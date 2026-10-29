// 零落山川 v2 — Cloudflare Workers + KV 个人导航
// 路由：
//   GET  /                  首页
//   GET  /assets/app.css   样式（同源，无外部依赖）
//   GET  /assets/font-title.woff2  标题字体（龙藏体子集，同源）
//   GET  /assets/font-body.woff2   正文字体（得意黑子集，同源）
//   GET  /assets/app.js    首页客户端脚本
//   GET  /assets/admin.js  后台客户端脚本
//   GET  /api/nav          当前可见导航（公开 + 已解锁私密）与语录设置
//   POST /api/reveal       { pwd } 口令解锁，成功后发 HttpOnly 会话 Cookie
//   POST /api/lock         清除 reveal 会话
//   POST /api/status       { indices } 探测链接状态（HEAD 优先，非在线响应回落 GET，手动跳转判定，8 秒超时，GET 失败重试一次，60 秒缓存）
//   GET  /admin            管理后台（Basic Auth，ADMIN_PWD Secret）
//   GET  /admin/api/config 后台读取全部配置
//   POST /admin/api/save   后台保存配置与语录设置

import { DEFAULT_SETTINGS } from "./config.js";
import { loadItems, loadSettings, saveItems, saveSettings, visibleItems } from "./store.js";
import {
  checkAdmin, checkReveal, createRevealSession, hasRevealSession,
  destroyRevealSession, revealCookie, clearRevealCookie,
} from "./auth.js";
import { renderHome, renderAdmin, renderNotFound } from "./ui.js";
import { APP_CSS, HOME_JS, ADMIN_JS, FONT_TITLE_WOFF2_B64, FONT_BODY_WOFF2_B64 } from "./assets.js";

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; " +
    "font-src 'self'; connect-src 'self' https://v1.hitokoto.cn; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

function html(body, status = 200, extra = {}) {
  return new Response(body, { status, headers: { ...SECURITY_HEADERS, "Content-Type": "text/html;charset=UTF-8", ...extra } });
}
function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...SECURITY_HEADERS, "Content-Type": "application/json;charset=UTF-8", "Cache-Control": "no-store", ...extra } });
}
function text(body, status = 200, contentType = "text/plain;charset=UTF-8") {
  return new Response(body, { status, headers: { ...SECURITY_HEADERS, "Content-Type": contentType } });
}
function unauthorizedAdmin(configured) {
  const body = configured ? "未授权访问，请出示身份凭证。" : "管理员密码未配置，拒绝访问。请在 Cloudflare 后台为该 Worker 设置 ADMIN_PWD Secret。";
  return new Response(body, {
    status: 401,
    headers: { ...SECURITY_HEADERS, "WWW-Authenticate": 'Basic realm="LingLuo ShanChuan Admin"', "Content-Type": "text/plain;charset=UTF-8" },
  });
}

// 状态探测缓存：每个 isolate 内 60 秒有效，避免每次刷新都全量探测。
const statusCache = new Map(); // url -> { ok, at }

// 在线判定分两段，导航站的状态灯表示“站点可达、服务在响应”：
// - HEAD 阶段从严：只有 200-399 算通过；405 / 403 / 404 / 5xx 都不下结论，
//   必须回落 GET，因为不少站点只禁用或限制 HEAD（pan.llsc.cc 就是 HEAD 405）。
// - GET 阶段按可达性判定：状态码 < 500 就算在线，200-399 正常，401 / 403 是
//   站点需要登录但本身通的，404 是服务器在响应（页面可能被移走，状态灯仍
//   表示可达，所以算在线）。5xx 和网络错误 / 超时算离线。
function isOnlineStatus(status) {
  return typeof status === "number" && status < 500;
}

async function probe(url) {
  const cached = statusCache.get(url);
  if (cached && Date.now() - cached.at < 60_000) return cached.ok;
  const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 LLSC-Monitor";
  let ok = false;
  // 先试 HEAD：200-399 直接在线。HEAD 返回 405 / 403 / 404 / 5xx 等非在线响应时
  // 不能据此判离线（有些站点只禁用 HEAD）——必须继续用 GET 再试一次。
  // 跳转用 manual：3xx 本身就说明服务在响应，不用再跟跳转链（跳转链本身
  // 也可能失败，徒增离线误判）。GET 抛异常（超时 / 网络错）时重试一次。
  try {
    const head = await fetch(url, {
      method: "HEAD", redirect: "manual",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8000),
    });
    const hs = head.status;
    // 拿到响应头就够判定了：立刻取消 body，不要把整站内容下载下来。
    try { if (head.body) await head.body.cancel(); } catch { /* 取消失败不影响判定 */ }
    if (hs >= 200 && hs < 400) ok = true;
  } catch { /* HEAD 异常，落到 GET */ }
  if (!ok) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch(url, {
          method: "GET", redirect: "manual",
          headers: { "User-Agent": UA },
          signal: AbortSignal.timeout(8000),
        });
        const status = res.status;
        try { if (res.body) await res.body.cancel(); } catch { /* 取消失败不影响判定 */ }
        ok = isOnlineStatus(status);
        break; // GET 拿到响应就下结论（无论在线离线），不再重试
      } catch { /* GET 异常：再试一次；两次都异常则离线 */ }
    }
  }
  statusCache.set(url, { ok, at: Date.now() });
  return ok;
}

// base64（标准字母表，无换行）解码为字节：字体文件以 base64 存在 assets.js，
// 请求时再解码成二进制返回，避免把二进制直接写进源码。
function b64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ---- 静态资源 ----
    if (url.pathname === "/assets/app.css" && request.method === "GET") {
      return text(APP_CSS, 200, "text/css;charset=UTF-8");
    }
    if (url.pathname === "/assets/app.js" && request.method === "GET") {
      return text(HOME_JS, 200, "text/javascript;charset=UTF-8");
    }
    if (url.pathname === "/assets/admin.js" && request.method === "GET") {
      return text(ADMIN_JS, 200, "text/javascript;charset=UTF-8");
    }
    if (url.pathname === "/assets/font-title.woff2" && request.method === "GET") {
      return new Response(b64ToBytes(FONT_TITLE_WOFF2_B64), { headers: { ...SECURITY_HEADERS, "Content-Type": "font/woff2", "Cache-Control": "public, max-age=31536000, immutable" } });
    }
    if (url.pathname === "/assets/font-body.woff2" && request.method === "GET") {
      return new Response(b64ToBytes(FONT_BODY_WOFF2_B64), { headers: { ...SECURITY_HEADERS, "Content-Type": "font/woff2", "Cache-Control": "public, max-age=31536000, immutable" } });
    }
    if (url.pathname === "/assets/hero.jpg" && request.method === "GET") {
      const data = await env.MY_KV.get("hero-night-river", "arrayBuffer");
      if (data === null) return new Response("not found", { status: 404 });
      return new Response(data, { headers: { ...SECURITY_HEADERS, "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" } });
    }

    // ---- 管理后台 ----
    if (url.pathname === "/admin" && request.method === "GET") {
      const auth = await checkAdmin(request, env);
      if (!auth.ok) return unauthorizedAdmin(auth.configured);
      return html(renderAdmin());
    }
    if (url.pathname === "/admin/api/config" && request.method === "GET") {
      const auth = await checkAdmin(request, env);
      if (!auth.ok) return unauthorizedAdmin(auth.configured);
      const [items, settings] = await Promise.all([loadItems(env), loadSettings(env)]);
      return json({ items, settings });
    }
    if (url.pathname === "/admin/api/save" && request.method === "POST") {
      const auth = await checkAdmin(request, env);
      if (!auth.ok) return unauthorizedAdmin(auth.configured);
      let body;
      try {
        body = await request.json();
      } catch {
        return text("请求体必须是 JSON", 400);
      }
      try {
        const [items, settings] = await Promise.all([saveItems(env, body.items), saveSettings(env, body.settings)]);
        return json({ ok: true, items: items.length, settings });
      } catch (e) {
        return text(`保存失败：${e.message}`, 400);
      }
    }

    // ---- 公开 API ----
    if (url.pathname === "/api/nav" && request.method === "GET") {
      const [items, settings, unlocked] = await Promise.all([
        loadItems(env), loadSettings(env), hasRevealSession(request, env),
      ]);
      // 只返回调用者可见项，且剥掉 isPrivate / isHidden 字段：
      // 未解锁的人从响应里看不出“存在私密项”这件事。
      const visible = visibleItems(items, unlocked).map(({ title, url, desc, icon, originalIdx }) => (
        { title, url, desc, icon, originalIdx }
      ));
      return json({ items: visible, unlocked, settings });
    }

    if (url.pathname === "/api/reveal" && request.method === "POST") {
      let pwd;
      try {
        ({ pwd } = await request.json());
      } catch {
        return text("请求体必须是 JSON", 400);
      }
      const result = await checkReveal(pwd, env);
      if (!result.configured) return text("口令尚未设置，拒绝访问", 503);
      if (!result.ok) return text("Unauthorized", 401);
      const token = await createRevealSession(env);
      return json({ ok: true }, 200, { "Set-Cookie": revealCookie(token, request) });
    }

    if (url.pathname === "/api/lock" && request.method === "POST") {
      await destroyRevealSession(request, env);
      return json({ ok: true }, 200, { "Set-Cookie": clearRevealCookie(request) });
    }

    if (url.pathname === "/api/status" && request.method === "POST") {
      let indices;
      try {
        ({ indices } = await request.json());
      } catch {
        return text("请求体必须是 JSON", 400);
      }
      if (!Array.isArray(indices) || indices.length > 50) return text("indices 必须是最多 50 个下标的数组", 400);
      const [items, unlocked] = await Promise.all([loadItems(env), hasRevealSession(request, env)]);
      // 只探测调用者可见的项：不可见的下标（私密未解锁、隐藏、不存在）
      // 一律返回同样的 { idx, ok: false }，不去探测、不区分、不留时延差别。
      const visibleIdx = new Set(visibleItems(items, unlocked).map((v) => v.originalIdx));
      const results = await Promise.all(indices.map(async (idx) => {
        const item = items[idx];
        if (!item || item.isHidden || !visibleIdx.has(idx)) return { idx, ok: false };
        return { idx, ok: await probe(item.url) };
      }));
      return json(results);
    }

    // ---- 首页 ----
    if (url.pathname === "/" && request.method === "GET") {
      const settings = await loadSettings(env);
      return html(renderHome(settings));
    }

    return html(renderNotFound(), 404);
  },
};

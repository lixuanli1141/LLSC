// 认证：密码只来自 Worker Secret，缺失时拒绝，绝不使用默认值。
// reveal 口令以 SHA-256 摘要比对，成功后发一个 KV 会话，
// 客户端不再保存明文口令。

import { ADMIN_USER, SESSION_TTL_SECONDS } from "./config.js";

export async function sha256Hex(text) {
  const data = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(data)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// 管理员 Basic Auth。未配置 ADMIN_PWD 时返回 { ok: false, configured: false }。
export async function checkAdmin(request, env) {
  const configured = Boolean(env.ADMIN_PWD);
  if (!configured) return { ok: false, configured: false };
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Basic ")) return { ok: false, configured: true };
  let decoded;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return { ok: false, configured: true };
  }
  const sep = decoded.indexOf(":");
  if (sep < 0) return { ok: false, configured: true };
  const user = decoded.slice(0, sep);
  const pass = decoded.slice(sep + 1);
  const ok = user === ADMIN_USER && timingSafeEqual(await sha256Hex(pass), await sha256Hex(env.ADMIN_PWD));
  return { ok, configured: true };
}

// reveal 口令校验。未配置 REVEAL_PWD 时拒绝。
export async function checkReveal(pwd, env) {
  if (!env.REVEAL_PWD) return { ok: false, configured: false };
  if (typeof pwd !== "string" || !pwd) return { ok: false, configured: true };
  const ok = timingSafeEqual(await sha256Hex(pwd), await sha256Hex(env.REVEAL_PWD));
  return { ok, configured: true };
}

export async function createRevealSession(env) {
  const token = crypto.randomUUID();
  await env.MY_KV.put(`REVEAL_SESSION:${token}`, "1", { expirationTtl: SESSION_TTL_SECONDS });
  return token;
}

export async function hasRevealSession(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)llsc_reveal=([^;]+)/);
  if (!match) return false;
  const token = decodeURIComponent(match[1]);
  if (!/^[0-9a-f-]{36}$/.test(token)) return false;
  return (await env.MY_KV.get(`REVEAL_SESSION:${token}`)) === "1";
}

export async function destroyRevealSession(request, env) {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(/(?:^|;\s*)llsc_reveal=([^;]+)/);
  if (match) await env.MY_KV.delete(`REVEAL_SESSION:${decodeURIComponent(match[1])}`);
}

export function revealCookie(token, request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `llsc_reveal=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearRevealCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `llsc_reveal=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}

// 页面外壳：首页与管理后台的 HTML。卡片由客户端 JS 从 /api/nav 取数渲染，
// 服务端不把导航数据拼进 HTML，避免注入。
// 视觉系统按 elayadesign landing-page-design + redesign-existing-projects：
// 单一字体、Tailwind 字阶与间距 token、扁平背景、一个点缀色、
// 基础动效曲线 + IntersectionObserver 滚动显现、tagline 逐词显现。

import { SITE_NAME, SITE_SUBTITLE, escapeHtml } from "./config.js";

function safeSettingsJson(settings) {
  return JSON.stringify(settings).replace(/</g, "\\u003c");
}

const FAVICON = "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0284c7"/><path d="M6 22 L13 10 L18 18 L21 13 L26 22 Z" fill="#fff"/></svg>`
);


export function renderHome(settings) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="description" content="${escapeHtml(SITE_NAME)} — 云盘、影视、题库和服务器，都在一处归拢的个人导航。">
<meta property="og:title" content="${escapeHtml(SITE_NAME)}">
<meta property="og:description" content="云盘、影视、题库和服务器，都在一处归拢的个人导航。">
<meta property="og:type" content="website">
<meta name="theme-color" content="#050b18">
<title>${escapeHtml(SITE_NAME)} — 个人导航</title>
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/long-cang@5.3.0/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/ma-shan-zheng@5.2.9/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@callmebill/lxgw-wenkai-web@1.522.0/lxgwwenkai-regular/result.css">
<link rel="stylesheet" href="/assets/app.css?v=2.5.17">
<script type="application/json" id="llsc-settings">${safeSettingsJson(settings)}</script>
</head>
<body>
<a class="skip" href="#nav">跳到导航</a>
<div id="toast" class="toast" role="status"></div>
<button class="stealth" id="stealth" type="button" aria-label="口令"></button>
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="dialog">
    <h2 id="modal-title">输入口令</h2>
    <div class="row">
      <input type="password" id="pwd" placeholder="口令" autocomplete="current-password">
      <button id="submit-pwd" type="button">解锁</button>
    </div>
    <p class="hint">解锁后会记住 24 小时。</p>
    <div class="row"><button class="ghost" id="close-modal" type="button">取消</button></div>
  </div>
</div>
<header class="hero">
  <div class="hero-copy">
    <h1>零落<br>山川</h1>
    <p class="quote" id="quote"><span class="quote-layer" id="quote-layer-a">山川有灵，归处有光。</span><span class="quote-layer off" id="quote-layer-b"></span></p>
    <div class="cta-row">
      <a class="btn-primary" href="#nav">进入导航</a>
    </div>
    <p class="proof" id="proof">正在探测节点状态</p>
  </div>
  <figure class="hero-visual reveal">
    <div class="window-bar"><span></span><span></span><span></span></div>
    <img src="/assets/hero.jpg" alt="山川夜景" fetchpriority="high">
    <figcaption>山川有灵，归处有光</figcaption>
  </figure>
</header>
<main id="main">
  <section id="nav" class="reveal" aria-label="导航">
    <div class="section-head">
      <h2>所有入口，一处归拢</h2>
      <p class="section-sub">点一张卡片，直达一个地方。状态点会实时告诉你它现在能不能打开。</p>
    </div>
    <div class="grid" id="grid"></div>
    <div class="lockbar"><button class="ghost" id="lock-btn" type="button" style="display:none">锁定</button></div>
  </section>
  <section id="how" class="reveal" aria-label="如何使用">
    <div class="section-head">
      <h2>两步直达</h2>
    </div>
    <ol class="steps">
      <li><span class="step-num">01</span><h3>打开页面</h3><p>所有节点都在上面，点卡片就走，不用记地址。</p></li>
      <li><span class="step-num">02</span><h3>点卡片直达</h3><p>状态点在线就直接打开，离线先别点，等它回来。</p></li>
    </ol>
  </section>
  <section class="tagline" aria-label="一句">
    <p id="tagline">把散落各处的入口，收进一处干净的地方。</p>
  </section>
</main>
<footer>
  <span>© ${year} ${escapeHtml(SITE_NAME)}</span>
  <span><a href="/">回首页</a> · <a href="/admin">管理后台</a></span>
</footer>
<script src="/assets/app.js?v=2.5.14" defer></script>
</body>
</html>`;
}

export function renderNotFound() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>页面不在这里 · ${escapeHtml(SITE_NAME)}</title>
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="/assets/app.css?v=2.5.17">
</head>
<body>
<main class="notfound">
  <p class="eyebrow">404</p>
  <h1>这个页面不在这里</h1>
  <p class="sub">地址可能输错了，或者它已经被移走了。</p>
  <a class="btn-primary" href="/">回首页</a>
</main>
</body>
</html>`;
}

export function renderAdmin() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${escapeHtml(SITE_NAME)} · 管理后台</title>
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="/assets/app.css?v=2.5.17">
<style>
  main{width:min(860px,92vw)} .edit-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px;margin-bottom:16px;box-shadow:var(--shadow)}
  .card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .badge{background:var(--accent-soft);color:var(--accent);padding:4px 12px;border-radius:8px;font-size:14px}
  .field{display:block;margin-bottom:12px} .field span{display:block;font-size:14px;color:var(--muted);margin-bottom:8px}
  .checks{display:flex;gap:24px;flex-wrap:wrap;margin-top:8px;font-size:14px}
  .checks input{width:auto} .toolbar{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
  textarea{min-height:64px;font-family:monospace;font-size:14px}
  .settings{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:var(--shadow)}
  .settings h2{margin:0 0 16px;font-size:24px}
  @media (max-width:600px){
    .edit-card{padding:16px}
    .card-head{flex-wrap:wrap;gap:12px}
    .card-head > div{display:flex;gap:8px;flex-wrap:wrap}
    .card-head button{min-height:48px;padding:12px}
    .toolbar button{flex:1 1 40%}
    .checks{flex-direction:column;gap:12px}
  }
</style>
</head>
<body>
<div id="toast" class="toast" role="status"></div>
<header class="admin-head"><h1>管理后台</h1><div class="subtitle">零落山川 · 导航与语录设置</div></header>
<main>
  <div class="settings">
    <h2>语录设置</h2>
    <label class="field"><span>语录来源</span>
      <select id="quoteSource">
        <option value="local">本地语录（默认，不依赖外部服务）</option>
        <option value="hitokoto">一言（hitokoto，失败时用本地兜底）</option>
        <option value="off">关闭语录</option>
      </select>
    </label>
    <label class="field"><span>语录轮换间隔（秒，0 为不自动轮换）</span>
      <input type="number" id="quoteInterval" min="0" max="3600" value="60">
    </label>
    <p class="hint">管理员密码与口令在 Cloudflare 后台以 Secret 管理，不在这里修改，也不会显示在这里。</p>
  </div>
  <div class="toolbar">
    <button id="export" type="button" class="ghost">导出配置</button>
    <button id="import" type="button" class="ghost">导入配置</button>
    <a href="/" style="align-self:center;color:var(--muted)">回首页</a>
  </div>
  <div id="list"></div>
  <button id="add" type="button" class="ghost" style="width:100%;margin-bottom:16px">添加节点</button>
  <button id="save" type="button" style="width:100%;padding:12px;font-size:16px">保存</button>
</main>
<footer>© ${new Date().getFullYear()} ${escapeHtml(SITE_NAME)}</footer>
<script src="/assets/admin.js" defer></script>
</body>
</html>`;
}

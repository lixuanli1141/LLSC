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
<meta name="description" content="${escapeHtml(SITE_NAME)} — 云盘、影视、服务器，东西都在这儿。">
<meta property="og:title" content="${escapeHtml(SITE_NAME)}">
<meta property="og:description" content="云盘、影视、服务器，东西都在这儿。">
<meta property="og:type" content="website">
<meta name="theme-color" content="#050b18">
<title>${escapeHtml(SITE_NAME)} — 个人导航</title>
<link rel="icon" href="${FAVICON}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/long-cang@5.3.0/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/ma-shan-zheng@5.2.9/index.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@callmebill/lxgw-wenkai-web@1.522.0/lxgwwenkai-regular/result.css">
<link rel="stylesheet" href="/assets/app.css?v=2.5.49">
<script type="application/json" id="llsc-settings">${safeSettingsJson(settings)}</script>
</head>
<body class="home">
<a class="skip" href="#nav">跳到导航</a>
<div class="bg" aria-hidden="true"><div class="bg-static"></div><video id="bg-video" muted playsinline loop preload="none" poster="/assets/bg-ink.jpg"></video></div>
<div id="toast" class="toast" role="status"></div>
<button class="stealth" id="stealth" type="button" aria-label="口令"></button>
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="dialog">
    <div class="lottie-box" id="lottie-box" hidden></div>
    <h2 id="modal-title">输入口令</h2>
    <div class="row" id="pwd-row">
      <input type="password" id="pwd" placeholder="口令" autocomplete="current-password">
      <button id="submit-pwd" type="button">解锁</button>
    </div>
    <p class="err" id="pwd-err" role="alert" hidden>口令不对，再试一次。</p>
    <p class="hint">解锁后会记住 24 小时。</p>
    <div class="row"><button class="ghost" id="close-modal" type="button">取消</button></div>
  </div>
</div>
<header class="hero">
  <div class="hero-copy">
    <h1><span class="hline"><span class="hline-in">零落</span></span><span class="hline"><span class="hline-in">山川</span></span></h1>
    <p class="quote" id="quote"><span class="quote-layer" id="quote-layer-a">山川有灵，归处有光。</span><span class="quote-layer off" id="quote-layer-b"></span></p>
    <div class="cta-row">
      <a class="btn-primary" href="#nav">进入导航</a>
    </div>
    <p class="proof" id="proof">正在探测节点状态</p>
  </div>
  <figure class="hero-visual reveal">
    <div class="window-bar"><span></span><span></span><span></span></div>
    <div class="hero-media">
      <video src="/assets/hero.mp4" poster="/assets/hero-poster.jpg" playsinline preload="metadata"></video>
      <button class="hero-play" type="button" aria-label="播放视频"><svg viewBox="0 0 24 24" width="64" height="64" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="#fff" fill-opacity="0.6"/></svg></button>
    </div>
    <figcaption>山川有灵，归处有光</figcaption>
  </figure>
</header>
<main id="main">
  <section id="nav" class="reveal" aria-label="导航">
    <div class="section-head">
      <h2>东西都在这儿</h2>
      <p class="section-sub">点卡片就打开。绿点是在线，暗了就是挂了。</p>
    </div>
    <div class="grid" id="grid"></div>
    <div class="lockbar"><button class="ghost lock-btn" id="lock-btn" type="button" style="display:none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path class="shackle" d="M8 11V7a4 4 0 0 1 8 0v4"/></svg><span>锁定</span></button></div>
  </section>
  <section id="how" class="reveal" aria-label="如何使用">
    <div class="section-head">
      <h2>怎么用</h2>
    </div>
    <ol class="steps">
      <li><span class="step-num">01</span><h3>打开页面</h3><p>东西都在上面，点一下就走，不用记地址。</p></li>
      <li><span class="step-num">02</span><h3>点卡片</h3><p>绿了直接点，灰了先别点，等它回来。</p></li>
    </ol>
  </section>
  <section class="tagline" aria-label="一句">
    <p id="tagline">东西散得到处都是，收在这儿了。</p>
  </section>
</main>
<footer>
  <span>© ${year} ${escapeHtml(SITE_NAME)}</span>
</footer>
<script src="/assets/app.js?v=2.5.49" defer></script>
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
<link rel="stylesheet" href="/assets/app.css?v=2.5.49">
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
<link rel="stylesheet" href="/assets/app.css?v=2.5.49">
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
        <option value="hitokoto">一言（hitokoto 中转，失败时用本地兜底）</option>
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

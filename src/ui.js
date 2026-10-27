// 页面外壳：首页与管理后台的 HTML。卡片由客户端 JS 从 /api/nav 取数渲染，
// 服务端不把导航数据拼进 HTML，避免注入。

import { SITE_NAME, SITE_SUBTITLE, escapeHtml } from "./config.js";

function safeSettingsJson(settings) {
  return JSON.stringify(settings).replace(/</g, "\\u003c");
}

export function renderHome(settings) {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="description" content="${escapeHtml(SITE_NAME)} — 个人导航">
<title>${escapeHtml(SITE_NAME)}</title>
<link rel="stylesheet" href="/assets/app.css">
<script type="application/json" id="llsc-settings">${safeSettingsJson(settings)}</script>
</head>
<body>
<div id="toast" class="toast" role="status"></div>
<button class="stealth" id="stealth" type="button" title="私密导航" aria-label="私密导航">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
</button>
<div class="modal" id="modal">
  <div class="dialog">
    <h2>输入口令</h2>
    <div class="row">
      <input type="password" id="pwd" placeholder="私密导航口令" autocomplete="current-password">
      <button id="submit-pwd" type="button">解锁</button>
    </div>
    <p style="color:var(--muted);font-size:13px;margin:14px 0 0">解锁后会记住 24 小时，点右下角可再次锁定。</p>
    <div class="row" style="margin-top:14px"><button class="ghost" id="close-modal" type="button">取消</button></div>
  </div>
</div>
<header>
  <div class="eyebrow"><span class="mark"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="1.5" y="1.5" width="13" height="13" rx="2"/><path d="M1.5 5.5h13M5.5 5.5v9"/></svg>LLSC / NAV</span><span class="status-pill"><i></i>SYSTEM ONLINE</span></div>
  <h1>${escapeHtml(SITE_NAME)}</h1>
  <div class="subtitle">${escapeHtml(SITE_SUBTITLE)}</div>
  <div class="quote" id="quote">山川有灵，归处有光。</div>
</header>
<main>
  <div class="grid" id="grid"></div>
  <div class="lockbar"><button class="ghost" id="lock-btn" type="button" style="display:none">锁定私密导航</button></div>
</main>
<footer>© ${year} ${escapeHtml(SITE_NAME)}</footer>
<script src="/assets/app.js" defer></script>
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
<link rel="stylesheet" href="/assets/app.css">
<style>
  main{width:min(860px,92vw)} .edit-card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:16px;box-shadow:var(--shadow)}
  .card-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
  .badge{background:var(--accent-soft);color:var(--accent);padding:4px 10px;border-radius:8px;font-size:13px}
  .field{display:block;margin-bottom:12px} .field span{display:block;font-size:13px;color:var(--muted);margin-bottom:6px}
  .checks{display:flex;gap:20px;flex-wrap:wrap;margin-top:6px;font-size:14px}
  .checks input{width:auto} .toolbar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px}
  textarea{min-height:64px;font-family:monospace;font-size:13px}
  .settings{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:20px;box-shadow:var(--shadow)}
  .settings h2{margin:0 0 14px;font-size:17px}
  @media (max-width:600px){
    .edit-card{padding:16px}
    .card-head{flex-wrap:wrap;gap:10px}
    .card-head > div{display:flex;gap:8px;flex-wrap:wrap}
    .card-head button{min-height:44px;padding:10px 12px}
    .toolbar button{flex:1 1 40%}
    .checks{flex-direction:column;gap:12px}
  }
</style>
</head>
<body>
<div id="toast" class="toast" role="status"></div>
<header><h1 style="font-size:36px">管理后台</h1><div class="subtitle">零落山川 · 导航与语录设置</div></header>
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
    <p style="color:var(--muted);font-size:13px;margin:0">管理员密码与私密口令在 Cloudflare 后台以 Secret 管理，不在这里修改，也不会显示在这里。</p>
  </div>
  <div class="toolbar">
    <button id="export" type="button" class="ghost">导出配置</button>
    <button id="import" type="button" class="ghost">导入配置</button>
    <a href="/" style="align-self:center;color:var(--muted)">← 回首页</a>
  </div>
  <div id="list"></div>
  <button id="add" type="button" class="ghost" style="width:100%;margin-bottom:16px">+ 添加节点</button>
  <button id="save" type="button" style="width:100%;padding:14px;font-size:16px">保存</button>
</main>
<footer>© ${new Date().getFullYear()} ${escapeHtml(SITE_NAME)}</footer>
<script src="/assets/admin.js" defer></script>
</body>
</html>`;
}

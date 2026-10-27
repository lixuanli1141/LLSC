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
  <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 26c0-6 7-11 15-11 5 0 8 1 11 3 2 1 6 2 6 5s-3 4-5 4c-1 2-3 4-6 4-2 3-5 4-8 4-6 0-13-3-13-9Z" fill="var(--sky-soft)"/><path d="M12 24c2-2 5-3 8-3" stroke="var(--sky)" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="16" cy="21" r="1.6" fill="#1c2333"/><path d="M33 20c2-3 6-3 7-1-1 0-2 1-2 2s1 2 2 2c-1 2-5 2-7-3Z" fill="var(--sky)"/><path d="M22 33c1 2 3 3 5 3" stroke="var(--sky)" stroke-width="2" fill="none" stroke-linecap="round"/></svg>
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
  <svg class="hero" viewBox="0 0 560 150" role="img" aria-label="手绘山水与小鲸鱼">
    <circle class="hero-sun" cx="452" cy="34" r="20" fill="var(--sun)"/>
    <circle cx="452" cy="34" r="27" fill="none" stroke="var(--sun)" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round"/>
    <g class="hero-cloud hero-cloud-a" fill="#ffffff"><ellipse cx="90" cy="38" rx="30" ry="12"/><ellipse cx="112" cy="30" rx="22" ry="11"/><ellipse cx="70" cy="30" rx="18" ry="9"/></g>
    <g class="hero-cloud hero-cloud-b" fill="#ffffff"><ellipse cx="300" cy="22" rx="24" ry="9"/><ellipse cx="318" cy="16" rx="17" ry="8"/></g>
    <g class="hero-whale">
      <path d="M196 62c0-8 10-14 20-14 6 0 10 1 14 4 3 1 8 2 8 6s-4 5-7 5c-1 3-4 5-8 5-3 4-7 5-11 5-8 0-16-4-16-11Z" fill="var(--sky-soft)"/>
      <path d="M204 60c3-3 7-4 11-4" stroke="var(--sky)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="210" cy="57" r="2" fill="#1c2333"/>
      <path d="M232 58c3-4 8-4 9-1-1 0-3 1-3 3s1 2 3 2c-1 3-6 3-9-4Z" fill="var(--sky)"/>
      <path d="M222 70c1 3 4 4 7 4" stroke="var(--sky)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>
    <path d="M0 118 L70 62 L120 104 L180 52 L250 118 Z" fill="var(--hill-1)"/>
    <path d="M150 118 L230 70 L290 110 L350 60 L430 118 Z" fill="var(--hill-2)"/>
    <path d="M330 118 L410 76 L470 112 L520 84 L560 118 Z" fill="var(--hill-1)"/>
    <path d="M0 118 Q140 104 280 118 T560 118 V150 H0 Z" fill="var(--hill-3)"/>
    <g stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity=".8">
      <path d="M176 62 l6 8 M184 58 l5 7"/><path d="M346 70 l6 8 M354 66 l5 7"/>
    </g>
  </svg>
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

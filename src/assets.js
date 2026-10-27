// 前端静态资源：CSS 与客户端 JS。
// 视觉系统按 elayadesign landing-page-design + redesign-existing-projects：
// 单一字体（系统字体栈是“不引外部字体”的用户约束下的最接近选择，
// 等宽字体只用于数据与标签）、Tailwind 字阶与间距 token、
// 扁平背景、一个点缀色、基础动效曲线 + IntersectionObserver 显现。

export const APP_CSS = `
:root{
  --bg:#fafafa; --card:#ffffff; --ink:#111111; --muted:#666666;
  --line:#e5e5e5;
  --accent:#0284c7; --accent-soft:#e0f2fe;
  --ok:#16a34a; --danger:#dc2626;
  --shadow:0 1px 2px rgba(2,132,199,.06);
  --shadow-hover:0 12px 32px rgba(2,132,199,.12);
  --ease:cubic-bezier(0.22,1,0.36,1);
  --sans:system-ui,-apple-system,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  --mono:ui-monospace,"SF Mono","Cascadia Code",Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark){
  :root{ --bg:#181818; --card:#1f1f1f; --ink:#f5f5f5; --muted:#9b9b9b;
    --line:#313131;
    --accent:#38bdf8; --accent-soft:#0c2a3d;
    --ok:#22c55e; --danger:#ef4444; --shadow:0 1px 2px rgba(0,0,0,.4);
    --shadow-hover:0 12px 32px rgba(0,0,0,.5); }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
html,body{overflow-x:hidden}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);
  font-family:var(--sans);display:flex;flex-direction:column;align-items:center;}
.skip{position:absolute;left:16px;top:-64px;z-index:300;background:var(--ink);color:var(--bg);
  padding:12px 16px;border-radius:8px;font-size:14px;text-decoration:none;transition:top .3s var(--ease);}
.skip:focus{top:16px;}
a{color:inherit}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{
  outline:2px solid var(--accent);outline-offset:2px;}
.topnav{position:sticky;top:16px;z-index:60;width:min(1200px,92vw);margin:16px auto 0;
  display:flex;align-items:center;gap:16px;padding:8px 16px;
  background:var(--card);border:1px solid var(--line);border-radius:999px;
  box-shadow:var(--shadow);}
.brand{display:inline-flex;align-items:center;gap:8px;text-decoration:none;font-weight:700;
  font-size:16px;letter-spacing:.08em;}
.brand-mark{display:inline-flex;width:24px;height:24px;color:var(--accent);}
.brand-mark svg{width:24px;height:24px;}
.nav-links{display:flex;gap:24px;margin-left:auto;}
.nav-links a{text-decoration:none;color:var(--muted);font-size:14px;}
.nav-links a:hover{color:var(--ink);}
.status-pill{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;
  border:1px solid var(--line);border-radius:999px;padding:4px 12px;
  font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--muted);background:var(--card);}
.status-pill i{width:8px;height:8px;border-radius:50%;background:var(--ok);}
.nav-unlock{min-height:32px;padding:8px 12px;font-size:14px;}
.hero{width:min(1200px,92vw);margin:0 auto;padding:64px 0 48px;
  display:grid;grid-template-columns:1fr;gap:48px;align-items:center;}
@media (min-width:1024px){.hero{grid-template-columns:1.05fr .95fr;}}
.eyebrow{font-family:var(--mono);font-size:12px;letter-spacing:.16em;color:var(--muted);
  text-transform:uppercase;margin:0 0 16px;}
h1{font-size:36px;line-height:1;margin:0;letter-spacing:-.02em;font-weight:700;
  text-wrap:balance;
  background:linear-gradient(90deg,#000000,#666666);
  -webkit-background-clip:text;background-clip:text;color:transparent;}
@media (min-width:1024px){h1{font-size:60px;}}
@media (prefers-color-scheme: dark){
  h1{background:linear-gradient(90deg,#ffffff,#9b9b9b);
    -webkit-background-clip:text;background-clip:text;}
}
.sub{font-size:18px;line-height:28px;color:var(--muted);max-width:680px;
  margin:24px 0 0;text-wrap:pretty;}
.cta-row{display:flex;gap:12px;flex-wrap:wrap;margin-top:32px;}
.btn-primary{display:inline-flex;align-items:center;justify-content:center;min-height:48px;
  padding:12px 24px;border-radius:8px;background:var(--accent);color:#fff;
  font-size:16px;font-weight:600;text-decoration:none;border:0;cursor:pointer;
  transition:transform .3s var(--ease),opacity .3s var(--ease);}
.btn-primary:hover{transform:translateY(-2px);}
.btn-primary:active{transform:scale(.98);}
.btn-ghost{display:inline-flex;align-items:center;justify-content:center;min-height:48px;
  padding:12px 24px;border-radius:8px;background:transparent;color:var(--ink);
  font-size:16px;font-weight:600;border:1px solid var(--line);cursor:pointer;
  transition:transform .3s var(--ease),border-color .3s var(--ease);}
.btn-ghost:hover{transform:translateY(-2px);border-color:var(--accent);}
.btn-ghost:active{transform:scale(.98);}
.proof{font-family:var(--mono);font-size:12px;letter-spacing:.08em;color:var(--muted);margin:24px 0 0;}
.quote{margin:24px 0 0;max-width:680px;color:var(--muted);font-size:16px;line-height:24px;
  min-height:24px;transition:opacity .3s var(--ease);
  border-left:2px solid var(--accent);padding-left:12px;}
.quote .src{display:block;text-align:right;font-size:12px;margin-top:8px;}
.hero-visual{margin:0;border:1px solid var(--line);border-radius:16px;overflow:hidden;
  background:var(--card);box-shadow:var(--shadow);}
.hero-visual svg{display:block;width:100%;height:auto;}
.window-bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--line);}
.window-bar span{width:12px;height:12px;border-radius:50%;background:var(--line);}
.window-bar em{font-style:normal;font-family:var(--mono);font-size:12px;color:var(--muted);margin-left:8px;}
.hero-visual figcaption{padding:16px;font-family:var(--mono);font-size:12px;color:var(--muted);}
main{width:min(1200px,92vw);margin:0 auto;}
section{padding:48px 0;}
.section-head{margin-bottom:32px;}
.section-head h2{font-size:30px;line-height:36px;margin:0 0 12px;font-weight:700;letter-spacing:-.01em;text-wrap:balance;}
.section-sub{font-size:16px;line-height:24px;color:var(--muted);max-width:680px;margin:0;text-wrap:pretty;}
.grid{display:grid;grid-template-columns:1fr;gap:16px;}
@media (min-width:700px){
  .grid{grid-template-columns:repeat(2,1fr);}
  .card:first-child{grid-column:span 2;}
}
@media (min-width:1024px){
  .grid{grid-template-columns:repeat(6,1fr);}
  .card:nth-child(1){grid-column:span 4;min-height:192px;}
  .card:nth-child(2){grid-column:span 2;}
  .card:nth-child(3){grid-column:span 2;}
  .card:nth-child(4){grid-column:span 4;}
  .card:nth-child(n+5){grid-column:span 3;}
}
.card{display:flex;align-items:center;gap:16px;padding:24px;min-height:96px;background:var(--card);
  border:1px solid var(--line);border-radius:16px;text-decoration:none;color:inherit;
  box-shadow:var(--shadow);position:relative;
  transition:transform .5s var(--ease),border-color .3s var(--ease),box-shadow .3s var(--ease);
  animation:cardIn .5s var(--ease) both;}
@keyframes cardIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
.card:hover{transform:translateY(-2px);border-color:var(--accent);box-shadow:var(--shadow-hover);}
.card:active{transform:scale(.98);}
.card.private{border-style:dashed;}
.icon{flex:none;width:48px;height:48px;border-radius:8px;background:var(--accent-soft);
  color:var(--accent);display:flex;align-items:center;justify-content:center;border:1px solid var(--line);}
.icon svg{width:24px;height:24px;}
.body{min-width:0;flex:1;}
.title{font-size:20px;line-height:28px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.desc{font-size:14px;line-height:20px;color:var(--muted);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.meta{display:flex;gap:12px;align-items:baseline;margin-top:8px;font-family:var(--mono);font-size:12px;letter-spacing:.04em;color:var(--muted);}
.meta .idx{color:var(--accent);font-weight:700;}
.meta .host{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.dot{position:absolute;top:16px;right:16px;width:8px;height:8px;border-radius:2px;background:var(--muted);opacity:.5;}
.dot.online{background:var(--ok);opacity:1;}
.dot.offline{background:var(--danger);opacity:.9;}
.skeleton{min-height:160px;border:1px solid var(--line);border-radius:16px;background:var(--line);
  animation:skel 1s var(--ease) infinite alternate;}
@keyframes skel{from{opacity:.4}to{opacity:1}}
.steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;gap:16px;}
@media (min-width:1024px){
  .steps{grid-template-columns:repeat(3,1fr);gap:24px;}
  .steps li:nth-child(2){margin-top:24px;}
  .steps li:nth-child(3){margin-top:48px;}
}
.steps li{padding:24px;border:1px solid var(--line);border-radius:16px;background:var(--card);box-shadow:var(--shadow);}
.step-num{display:block;font-family:var(--mono);font-size:14px;color:var(--accent);margin-bottom:16px;}
.steps h3{margin:0 0 8px;font-size:20px;line-height:28px;font-weight:600;}
.steps p{margin:0;font-size:14px;line-height:20px;color:var(--muted);}
.tagline{padding:80px 0;}
.tagline p{margin:0;max-width:680px;font-size:36px;line-height:1;font-weight:700;letter-spacing:-.02em;text-wrap:balance;}
@media (min-width:1024px){.tagline p{font-size:60px;}}
.tagline span{opacity:.3;transition:opacity .5s var(--ease);}
.tagline span.on{opacity:1;}
.reveal{opacity:0;transform:translateY(32px);
  transition:opacity .7s var(--ease),transform .7s var(--ease);}
.reveal.in{opacity:1;transform:translateY(0);}
footer{width:min(1200px,92vw);margin:0 auto;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  color:var(--muted);font-family:var(--mono);font-size:12px;letter-spacing:.08em;padding:32px 0 48px;}
footer a{text-decoration:none;}
footer a:hover{color:var(--ink);}
.admin-head{width:min(860px,92vw);padding:48px 0 16px;text-align:left;}
.admin-head h1{font-size:36px;background:none;-webkit-text-fill-color:var(--ink);color:var(--ink);}
.subtitle{font-family:var(--mono);color:var(--muted);letter-spacing:.16em;font-size:12px;margin-top:12px;text-transform:uppercase;}
.notfound{width:min(680px,92vw);margin:0 auto;padding:96px 0;}
.notfound h1{font-size:36px;background:none;-webkit-text-fill-color:var(--ink);color:var(--ink);}
.notfound .sub{margin:24px 0 32px;}
.stealth{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:52px;height:52px;
  border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--accent);cursor:pointer;z-index:50;
  display:flex;align-items:center;justify-content:center;padding:0;box-shadow:var(--shadow);
  transition:transform .3s var(--ease),border-color .3s var(--ease);}
.stealth svg{width:24px;height:24px;}
.stealth:hover{transform:translateY(-2px);border-color:var(--accent);}
.modal{position:fixed;inset:0;background:rgba(2,6,23,.6);display:none;align-items:center;justify-content:center;z-index:100;padding:24px;}
.modal.open{display:flex;}
.dialog{background:var(--card);border:1px solid var(--line);border-radius:16px;
  padding:24px;width:min(420px,100%);box-shadow:var(--shadow-hover);}
.dialog h2{margin:0 0 16px;font-size:24px;line-height:32px;}
.hint{color:var(--muted);font-size:14px;line-height:20px;margin:16px 0 0;}
.row{display:flex;gap:12px;flex-wrap:wrap;}
.row input{flex:1 1 180px;}
input,select,textarea{width:100%;min-height:48px;padding:12px;border:1px solid var(--line);border-radius:8px;
  background:var(--bg);color:var(--ink);font:inherit;font-size:16px;}
button{min-height:48px;padding:12px 24px;border:0;border-radius:8px;background:var(--accent);color:#fff;
  font:inherit;font-size:16px;font-weight:600;cursor:pointer;
  transition:transform .3s var(--ease),background-color .3s var(--ease),border-color .3s var(--ease);}
button:active{transform:scale(.98);}
button.ghost{background:transparent;color:var(--muted);border:1px solid var(--line);}
button.danger{background:var(--danger);}
.toast{position:fixed;top:16px;left:50%;transform:translateX(-50%) translateY(-12px);
  background:var(--ink);color:var(--bg);padding:12px 24px;border-radius:999px;font-size:14px;
  max-width:92vw;text-align:center;
  opacity:0;pointer-events:none;transition:opacity .3s var(--ease),transform .3s var(--ease);z-index:200;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.empty{color:var(--muted);text-align:center;padding:48px 0;}
.lockbar{display:flex;justify-content:center;margin-top:16px;}
@media (max-width:600px){
  .nav-links{display:none;}
  .hero{padding-top:48px;}
  .stealth{width:56px;height:56px;}
  .dialog{padding:24px;}
  .lockbar button{width:100%;}
}
@media (prefers-reduced-motion: reduce){
  html{scroll-behavior:auto;}
  *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;}
  .card{animation:none;}
  .reveal{opacity:1;transform:none;}
  .tagline span{opacity:1;}
}
`;

export const HOME_JS = `
(() => {
  const grid = document.getElementById('grid');
  const quoteEl = document.getElementById('quote');
  const proofEl = document.getElementById('proof');
  const toastEl = document.getElementById('toast');
  const lockBtn = document.getElementById('lock-btn');
  const modal = document.getElementById('modal');
  const pwdInput = document.getElementById('pwd');
  const settings = JSON.parse(document.getElementById('llsc-settings').textContent || '{}');
  let unlocked = false;
  let items = [];
  let quoteTimer = null;

  const LOCAL_QUOTES = ${JSON.stringify([
    "山重水复疑无路，柳暗花明又一村。",
    "会当凌绝顶，一览众山小。",
    "行到水穷处，坐看云起时。",
    "千山鸟飞绝，万径人踪灭。",
    "白日依山尽，黄河入海流。",
    "明月出天山，苍茫云海间。",
    "水光潋滟晴方好，山色空蒙雨亦奇。",
    "青山遮不住，毕竟东流去。",
    "两岸青山相对出，孤帆一片日边来。",
    "落霞与孤鹜齐飞，秋水共长天一色。",
  ])};

  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'), 3000); }
  function el(tag, cls, text){ const n = document.createElement(tag); if(cls) n.className = cls; if(text !== undefined) n.textContent = text; return n; }

  // 滚动显现：只用 IntersectionObserver，一次性显现，不回放。
  const revealObserver = new IntersectionObserver((entries) => {
    for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } }
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach((n) => revealObserver.observe(n));

  // Tagline 逐字显现：每字一个 IntersectionObserver 触发点。
  const taglineEl = document.getElementById('tagline');
  if (taglineEl) {
    const chars = [...taglineEl.textContent];
    taglineEl.textContent = '';
    const spans = chars.map((c) => { const s = el('span', '', c === ' ' ? '\\u00a0' : c); taglineEl.appendChild(s); return s; });
    const wordObserver = new IntersectionObserver((entries) => {
      for (const e of entries) { if (e.isIntersecting) { e.target.classList.add('on'); wordObserver.unobserve(e.target); } }
    }, { threshold: 0.5, rootMargin: '0px 0px -20% 0px' });
    spans.forEach((s) => wordObserver.observe(s));
  }

  function renderSkeleton(){
    grid.textContent = '';
    for (let i = 0; i < 4; i++) grid.appendChild(el('div', 'skeleton'));
  }

  function render(){
    grid.textContent = '';
    if(!items.length){ grid.appendChild(el('p','empty','暂无可用的导航项，去管理后台添加一个吧。')); return; }
    items.forEach((item, i) => {
      const a = el('a','card' + (item.isPrivate ? ' private' : ''));
      a.href = item.url; a.target = '_blank'; a.rel = 'noopener';
      a.style.animationDelay = Math.min(i * 60, 400) + 'ms';
      const icon = el('span','icon'); icon.innerHTML = item.icon || ''; // 图标已由服务端清洗，仅允许安全 SVG
      const body = el('div','body'); body.appendChild(el('div','title', item.title)); body.appendChild(el('div','desc', item.desc || ''));
      const meta = el('div','meta'); meta.appendChild(el('span','idx', String(i + 1).padStart(2, '0')));
      let host = ''; try { host = new URL(item.url).host; } catch(e) { host = ''; }
      meta.appendChild(el('span','host', host)); body.appendChild(meta);
      const dot = el('span','dot'); dot.dataset.idx = item.originalIdx;
      a.append(icon, body, dot); grid.appendChild(a);
    });
    checkStatus();
  }

  async function loadNav(){
    renderSkeleton();
    const res = await fetch('/api/nav');
    if(!res.ok){ grid.textContent = ''; grid.appendChild(el('p','empty','导航加载失败，请刷新重试。')); return; }
    const data = await res.json();
    items = data.items || []; unlocked = !!data.unlocked;
    lockBtn.style.display = unlocked ? '' : 'none';
    proofEl.textContent = items.length + ' 个节点 · 正在探测状态';
    render();
  }

  async function checkStatus(){
    const dots = [...document.querySelectorAll('.dot:not(.checked)')];
    if(!dots.length) return;
    dots.forEach(d => d.classList.add('checked'));
    try{
      const indices = dots.map(d => parseInt(d.dataset.idx, 10));
      const res = await fetch('/api/status', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ indices }) });
      if(!res.ok) return;
      const list = await res.json();
      let online = 0;
      for(const s of list){
        if (s.ok) online++;
        const dot = document.querySelector('.dot[data-idx="' + s.idx + '"]');
        if(dot) dot.classList.add(s.ok ? 'online' : 'offline');
      }
      proofEl.textContent = items.length + ' 个节点 · ' + online + ' 个在线';
    }catch(e){ /* 探测失败时圆点保持灰色，不打扰用户 */ }
  }

  let quoteIdx = Math.floor(Math.random() * LOCAL_QUOTES.length);
  async function loadQuote(){
    if(settings.quoteSource === 'off' || settings.quoteInterval === 0){ quoteEl.style.display = 'none'; return; }
    quoteEl.style.opacity = 0;
    await new Promise(r => setTimeout(r, 400));
    let text = LOCAL_QUOTES[quoteIdx % LOCAL_QUOTES.length]; quoteIdx++;
    let src = '';
    if(settings.quoteSource === 'hitokoto'){
      try{
        const res = await fetch('https://v1.hitokoto.cn/', { signal: AbortSignal.timeout(3000) });
        if(res.ok){ const d = await res.json(); text = d.hitokoto; src = [d.from_who, d.from].filter(Boolean).join(' · '); }
      }catch(e){ /* 一言失败时用本地语录兜底 */ }
    }
    quoteEl.textContent = '「 ' + text + ' 」';
    if(src){ const s = el('span','src','—— ' + src); quoteEl.appendChild(s); }
    quoteEl.style.opacity = 1;
  }

  function openModal(){ modal.classList.add('open'); pwdInput.value=''; setTimeout(()=>pwdInput.focus(), 50); }
  function closeModal(){ modal.classList.remove('open'); }
  async function verify(){
    const pwd = pwdInput.value; if(!pwd) return;
    try{
      const res = await fetch('/api/reveal', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pwd }) });
      if(res.status === 503){ toast('口令尚未设置'); return; }
      if(!res.ok) throw new Error('bad pwd');
      closeModal(); toast('已解锁私密导航'); await loadNav();
    }catch(e){ pwdInput.value=''; toast('口令不对，再试一次'); }
  }
  async function lock(){
    await fetch('/api/lock', { method:'POST' });
    location.reload();
  }

  document.getElementById('stealth').addEventListener('click', () => { if(unlocked) lock(); else openModal(); });
  document.getElementById('nav-unlock').addEventListener('click', () => { if(unlocked) lock(); else openModal(); });
  document.getElementById('hero-unlock').addEventListener('click', () => { if(unlocked) lock(); else openModal(); });
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('submit-pwd').addEventListener('click', verify);
  pwdInput.addEventListener('keydown', e => { if(e.key === 'Enter') verify(); });
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });
  lockBtn.addEventListener('click', lock);

  loadNav();
  loadQuote();
  const interval = (settings.quoteInterval || 0) * 1000;
  if(interval > 0 && settings.quoteSource !== 'off') quoteTimer = setInterval(loadQuote, interval);
})();
`;

export const ADMIN_JS = `
(() => {
  const listEl = document.getElementById('list');
  const toastEl = document.getElementById('toast');
  let items = [];
  let settings = {};

  function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'), 3000); }
  function el(tag, cls, text){ const n = document.createElement(tag); if(cls) n.className = cls; if(text !== undefined) n.textContent = text; return n; }
  function field(label, value, oninput, type){
    const w = el('label','field'); w.appendChild(el('span','', label));
    const input = el(type === 'textarea' ? 'textarea' : 'input');
    if(type && type !== 'textarea') input.type = type;
    input.value = value || ''; input.addEventListener('input', () => oninput(input.value));
    w.appendChild(input); return w;
  }

  function render(){
    listEl.textContent = '';
    items.forEach((item, i) => {
      const card = el('div','edit-card');
      const head = el('div','card-head');
      head.appendChild(el('span','badge','节点 #' + (i + 1)));
      const ops = el('div');
      const up = el('button','ghost','上移'); up.type='button'; up.disabled = i===0; up.addEventListener('click', ()=>{ [items[i-1],items[i]]=[items[i],items[i-1]]; render(); });
      const down = el('button','ghost','下移'); down.type='button'; down.disabled = i===items.length-1; down.addEventListener('click', ()=>{ [items[i+1],items[i]]=[items[i],items[i+1]]; render(); });
      const del = el('button','danger','删除'); del.type='button'; del.addEventListener('click', ()=>{ if(confirm('确定删除「'+item.title+'」吗？')){ items.splice(i,1); render(); } });
      ops.append(up, down, del); head.appendChild(ops); card.appendChild(head);
      card.appendChild(field('标题', item.title, v => item.title = v));
      card.appendChild(field('链接（https）', item.url, v => item.url = v, 'url'));
      card.appendChild(field('描述', item.desc, v => item.desc = v));
      card.appendChild(field('图标 SVG（可留空用默认图标）', item.icon, v => item.icon = v, 'textarea'));
      const checks = el('div','checks');
      const p = el('label'); const pc = el('input'); pc.type='checkbox'; pc.checked = !!item.isPrivate; pc.addEventListener('change', ()=> item.isPrivate = pc.checked); p.append(pc, document.createTextNode(' 私密（口令解锁后显示）'));
      const h = el('label'); const hc = el('input'); hc.type='checkbox'; hc.checked = !!item.isHidden; hc.addEventListener('change', ()=> item.isHidden = hc.checked); h.append(hc, document.createTextNode(' 隐藏（任何情况都不显示）'));
      checks.append(p, h); card.appendChild(checks);
      listEl.appendChild(card);
    });
  }

  async function load(){
    const res = await fetch('/admin/api/config');
    if(!res.ok){ toast('加载失败，请重新登录'); return; }
    const data = await res.json();
    items = data.items || []; settings = data.settings || {};
    document.getElementById('quoteInterval').value = settings.quoteInterval ?? 60;
    document.getElementById('quoteSource').value = settings.quoteSource || 'local';
    render();
  }

  async function save(){
    settings.quoteInterval = parseInt(document.getElementById('quoteInterval').value, 10) || 0;
    settings.quoteSource = document.getElementById('quoteSource').value;
    const res = await fetch('/admin/api/save', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items, settings }) });
    if(res.ok) toast('已保存'); else { const t = await res.text(); toast('保存失败：' + t); }
  }

  function exportJson(){
    const a = el('a'); a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    a.download = 'llsc_nav_config.json'; a.click();
  }
  function importJson(){
    const input = el('input'); input.type='file'; input.accept='application/json';
    input.addEventListener('change', () => {
      const file = input.files[0]; if(!file) return;
      const reader = new FileReader();
      reader.onload = () => { try{ items = JSON.parse(reader.result); render(); toast('已导入，记得点保存'); }catch(e){ toast('JSON 格式有误'); } };
      reader.readAsText(file);
    });
    input.click();
  }

  document.getElementById('add').addEventListener('click', () => { items.push({ title:'新节点', url:'https://', desc:'', isPrivate:false, isHidden:false, icon:'' }); render(); });
  document.getElementById('save').addEventListener('click', save);
  document.getElementById('export').addEventListener('click', exportJson);
  document.getElementById('import').addEventListener('click', importJson);
  load();
})();
`;

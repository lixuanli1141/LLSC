// 前端静态资源：CSS 与客户端 JS。
// 不依赖任何外部字体或 CDN。字体只用系统字体栈。

export const APP_CSS = `
:root{
  --bg:#f7f5f0; --card:#ffffff; --ink:#1c2333; --muted:#6b7280;
  --line:#e6e2d8; --accent:#2f6b4f; --accent-soft:#e7f0ea;
  --sun:#f2b544; --coral:#e07856; --coral-soft:#fdeee8; --sky:#5aa9c7; --sky-soft:#dceef5;
  --lilac:#8b7fd4; --lilac-soft:#ece9fb;
  --hill-1:#bcd9c3; --hill-2:#8fc3a4; --hill-3:#6fae8e;
  --danger:#c0392b; --shadow:0 10px 30px rgba(28,35,51,.08);
  --radius:16px;
}
@media (prefers-color-scheme: dark){
  :root{ --bg:#12161f; --card:#1b2230; --ink:#eef1f6; --muted:#9aa4b2;
    --line:#2a3345; --accent:#7fc8a4; --accent-soft:#1d2f26; --shadow:0 10px 30px rgba(0,0,0,.35);
    --sun:#d99a2b; --coral:#d97a5c; --coral-soft:#3a2620; --sky:#6fb3cc; --sky-soft:#1e323e;
    --lilac:#a89ee0; --lilac-soft:#2a2745;
    --hill-1:#2c4a3d; --hill-2:#24403a; --hill-3:#1d332f; }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
html,body{overflow-x:hidden}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);
  font-family:"Songti SC","Noto Serif SC",Georgia,serif;
  display:flex;flex-direction:column;align-items:center;
  background-image:linear-gradient(var(--line) 1px,transparent 1px);
  background-size:100% 56px;}
body::before{content:"";position:fixed;inset:auto 0 0 0;height:120px;pointer-events:none;
  background:linear-gradient(transparent,rgba(47,107,79,.10));}
header{width:min(860px,92vw);text-align:center;padding:28px 0 8px;}
.hero{width:min(560px,100%);height:auto;display:block;margin:0 auto 4px;}
.hero-cloud-a{animation:drift 9s ease-in-out infinite alternate;}
.hero-cloud-b{animation:drift 12s ease-in-out infinite alternate-reverse;}
.hero-sun{animation:bob 5s ease-in-out infinite;transform-origin:452px 34px;}
.hero-whale{animation:swim 14s ease-in-out infinite;}
@keyframes drift{from{transform:translateX(-8px)}to{transform:translateX(10px)}}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-5px)}}
@keyframes swim{0%,100%{transform:translate(0,0) rotate(0deg)}50%{transform:translate(26px,-7px) rotate(-3deg)}}
h1{font-size:clamp(40px,8vw,64px);margin:0;letter-spacing:.18em;font-weight:600;}
.subtitle{color:var(--muted);letter-spacing:.35em;font-size:13px;margin-top:14px;}
.quote{margin:26px auto 8px;max-width:560px;color:var(--muted);font-size:17px;line-height:1.9;
  min-height:2em;transition:opacity .5s ease;}
.quote .src{display:block;text-align:right;font-size:13px;margin-top:6px;}
main{width:min(860px,92vw);padding:20px 0 40px;z-index:1;}
.grid{display:grid;grid-template-columns:1fr;gap:14px;}
@media (min-width:640px){.grid{grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}}
.card{display:flex;align-items:center;gap:14px;padding:20px;min-height:84px;background:var(--card);
  border:1px solid var(--line);border-radius:20px;text-decoration:none;color:inherit;
  box-shadow:var(--shadow);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease;position:relative;
  animation:cardIn .5s cubic-bezier(.22,1.4,.36,1) both;}
@keyframes cardIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
.card:hover,.card:active{transform:translateY(-4px) scale(1.015);border-color:var(--accent);box-shadow:0 16px 34px rgba(28,35,51,.14);}
.card:hover .icon,.card:active .icon{transform:rotate(-8deg) scale(1.12);}
.card.private{border-style:dashed;border-color:var(--accent);}
.card:nth-child(4n+1) .icon{background:var(--accent-soft);color:var(--accent);}
.card:nth-child(4n+2) .icon{background:var(--sky-soft);color:var(--sky);}
.card:nth-child(4n+3) .icon{background:var(--coral-soft);color:var(--coral);}
.card:nth-child(4n+4) .icon{background:var(--lilac-soft);color:var(--lilac);}
.icon{flex:none;width:50px;height:50px;border-radius:16px;background:var(--accent-soft);
  color:var(--accent);display:flex;align-items:center;justify-content:center;
  transition:transform .25s cubic-bezier(.22,1.4,.36,1);}
.icon svg{width:26px;height:26px;}
.title{font-size:17px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.desc{font-size:13px;color:var(--muted);margin-top:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.dot{position:absolute;top:14px;right:14px;width:10px;height:10px;border-radius:50%;background:var(--muted);opacity:.5;}
.dot.online{background:#22a06b;opacity:1;animation:pulse 2s ease-out infinite;}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(34,160,107,.45)}70%{box-shadow:0 0 0 9px rgba(34,160,107,0)}100%{box-shadow:0 0 0 0 rgba(34,160,107,0)}}
.dot.offline{background:var(--danger);opacity:.9;}
footer{color:var(--muted);font-size:12px;letter-spacing:.15em;padding-bottom:28px;text-align:center;}
.stealth{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:64px;height:64px;
  border-radius:50%;border:2px solid var(--line);background:var(--card);cursor:pointer;z-index:50;
  display:flex;align-items:center;justify-content:center;padding:0;box-shadow:var(--shadow);}
.stealth svg{width:44px;height:44px;animation:bob 3.2s ease-in-out infinite;}
.stealth:hover,.stealth:active{transform:scale(1.1);}
.stealth:focus-visible{outline:3px solid var(--accent);outline-offset:2px;}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;z-index:100;padding:20px;}
.modal.open{display:flex;}
.dialog{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);
  padding:26px;width:min(420px,100%);box-shadow:var(--shadow);animation:pop .28s cubic-bezier(.22,1.4,.36,1) both;}
@keyframes pop{from{opacity:0;transform:scale(.94) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.dialog h2{margin:0 0 16px;font-size:19px;}
.row{display:flex;gap:10px;flex-wrap:wrap;}
.row input{flex:1 1 180px;}
input,select,textarea{width:100%;min-height:48px;padding:12px;border:1px solid var(--line);border-radius:12px;
  background:var(--bg);color:var(--ink);font:inherit;font-size:16px;}
input:focus,select:focus,textarea:focus{outline:2px solid var(--accent);outline-offset:1px;}
button{min-height:48px;padding:12px 20px;border:0;border-radius:12px;background:var(--accent);color:#fff;
  font:inherit;font-size:16px;cursor:pointer;}
button:active{transform:scale(.97);}
button.ghost{background:transparent;color:var(--muted);border:1px solid var(--line);}
button.danger{background:var(--danger);}
.toast{position:fixed;top:18px;left:50%;transform:translateX(-50%) translateY(-12px);
  background:var(--ink);color:var(--bg);padding:12px 20px;border-radius:999px;font-size:14px;
  max-width:92vw;text-align:center;
  opacity:0;pointer-events:none;transition:all .25s ease;z-index:200;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.empty{color:var(--muted);text-align:center;padding:40px 0;}
.lockbar{display:flex;justify-content:center;margin-top:10px;}
.quote::before{content:"❝ ";color:var(--sun);font-size:22px;line-height:0;}
@media (max-width:600px){
  header{padding-top:20px;}
  h1{letter-spacing:.12em;}
  .subtitle{letter-spacing:.22em;}
  .quote{font-size:16px;line-height:1.8;}
  main{padding-top:14px;}
  .dialog{padding:22px;}
  .lockbar button{width:100%;}
}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important;}
  .card{animation:none;}
}
`;

export const HOME_JS = `
(() => {
  const grid = document.getElementById('grid');
  const quoteEl = document.getElementById('quote');
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

  function render(){
    grid.textContent = '';
    if(!items.length){ grid.appendChild(el('p','empty','暂无可用的导航项，去管理后台添加一个吧。')); return; }
    items.forEach((item, i) => {
      const a = el('a','card' + (item.isPrivate ? ' private' : ''));
      a.href = item.url; a.target = '_blank'; a.rel = 'noopener';
      a.style.animationDelay = Math.min(i, 7) * 70 + 'ms';
      const icon = el('span','icon'); icon.innerHTML = item.icon || ''; // 图标已由服务端清洗，仅允许安全 SVG
      const body = el('div'); body.appendChild(el('div','title', item.title)); body.appendChild(el('div','desc', item.desc || ''));
      const dot = el('span','dot'); dot.dataset.idx = item.originalIdx;
      a.append(icon, body, dot); grid.appendChild(a);
    });
    checkStatus();
  }

  async function loadNav(){
    const res = await fetch('/api/nav');
    if(!res.ok){ toast('导航加载失败'); return; }
    const data = await res.json();
    items = data.items || []; unlocked = !!data.unlocked;
    lockBtn.style.display = unlocked ? '' : 'none';
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
      for(const s of list){
        const dot = document.querySelector('.dot[data-idx="' + s.idx + '"]');
        if(dot) dot.classList.add(s.ok ? 'online' : 'offline');
      }
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

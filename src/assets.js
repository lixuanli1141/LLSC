// 前端静态资源：CSS 与客户端 JS。
// 不依赖任何外部字体或 CDN。字体只用系统字体栈。

export const APP_CSS = `
:root{
  --bg:#eef1f4; --card:#ffffff; --ink:#0f172a; --muted:#64748b;
  --line:#dde3ea; --grid:rgba(15,23,42,.045);
  --accent:#0369a1; --accent-bright:#0284c7; --accent-soft:#e0f2fe;
  --ok:#16a34a; --danger:#dc2626;
  --shadow:0 1px 2px rgba(15,23,42,.05);
  --radius:10px;
  --sans:system-ui,-apple-system,"Segoe UI",Roboto,"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
  --mono:ui-monospace,"SF Mono","Cascadia Code",Menlo,Consolas,monospace;
}
@media (prefers-color-scheme: dark){
  :root{ --bg:#0a0f1a; --card:#101827; --ink:#e2e8f0; --muted:#8b9bb4;
    --line:#1e293b; --grid:rgba(226,232,240,.05);
    --accent:#38bdf8; --accent-bright:#38bdf8; --accent-soft:#0c2a3d;
    --ok:#22c55e; --danger:#ef4444; --shadow:0 1px 2px rgba(0,0,0,.4); }
}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
html,body{overflow-x:hidden}
body{margin:0;min-height:100vh;background:var(--bg);color:var(--ink);
  font-family:var(--sans);
  display:flex;flex-direction:column;align-items:center;
  background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);
  background-size:40px 40px;}
body::before{content:"";position:fixed;top:0;left:0;right:0;height:2px;pointer-events:none;
  background:linear-gradient(90deg,transparent,var(--accent-bright),transparent);}
header{width:min(1080px,92vw);text-align:left;padding:36px 0 8px;}
.eyebrow{display:flex;justify-content:space-between;align-items:center;gap:12px;
  font-family:var(--mono);font-size:12px;letter-spacing:.22em;color:var(--muted);
  text-transform:uppercase;margin-bottom:18px;}
.eyebrow .mark{display:inline-flex;align-items:center;gap:8px;}
.eyebrow .mark svg{width:16px;height:16px;}
.status-pill{display:inline-flex;align-items:center;gap:7px;white-space:nowrap;
  border:1px solid var(--line);border-radius:999px;padding:5px 11px;
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--muted);background:var(--card);}
.status-pill i{width:7px;height:7px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 3px rgba(34,197,94,.16);}
h1{font-size:clamp(30px,5vw,42px);margin:0;letter-spacing:.02em;font-weight:700;line-height:1.15;}
.subtitle{font-family:var(--mono);color:var(--muted);letter-spacing:.18em;font-size:12px;margin-top:10px;text-transform:uppercase;}
.quote{margin:22px 0 6px;max-width:640px;color:var(--muted);font-size:14px;line-height:1.8;
  font-family:var(--mono);min-height:1.8em;transition:opacity .4s ease;
  border-left:2px solid var(--accent);padding-left:12px;}
.quote .src{display:block;text-align:right;font-size:12px;margin-top:6px;}
main{width:min(1080px,92vw);padding:22px 0 44px;z-index:1;}
.grid{display:grid;grid-template-columns:1fr;gap:12px;}
@media (min-width:700px){.grid{grid-template-columns:repeat(2,1fr);gap:14px;}}
@media (min-width:1024px){
  .grid{grid-template-columns:repeat(4,1fr);}
  .card{flex-direction:column;align-items:flex-start;min-height:158px;}
  .card .body{width:100%;}
  .card .meta{margin-top:auto;padding-top:12px;}
}
.card{display:flex;align-items:center;gap:14px;padding:18px;min-height:88px;background:var(--card);
  border:1px solid var(--line);border-radius:var(--radius);text-decoration:none;color:inherit;
  box-shadow:var(--shadow);transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;position:relative;
  animation:cardIn .35s ease both;}
@keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.card:hover,.card:active{transform:translateY(-2px);border-color:var(--accent);box-shadow:0 8px 24px rgba(2,132,199,.14);}
.card.private{border-style:dashed;}
.icon{flex:none;width:44px;height:44px;border-radius:8px;background:var(--accent-soft);
  color:var(--accent);display:flex;align-items:center;justify-content:center;border:1px solid var(--line);}
.icon svg{width:22px;height:22px;}
.body{min-width:0;flex:1;}
.title{font-size:16px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.desc{font-size:13px;color:var(--muted);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.meta{display:flex;gap:10px;align-items:baseline;margin-top:6px;font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--muted);}
.meta .idx{color:var(--accent);font-weight:700;}
.meta .host{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.dot{position:absolute;top:12px;right:12px;width:8px;height:8px;border-radius:2px;background:var(--muted);opacity:.5;}
.dot.online{background:var(--ok);opacity:1;box-shadow:0 0 0 3px rgba(34,197,94,.16);}
.dot.offline{background:var(--danger);opacity:.9;}
footer{color:var(--muted);font-family:var(--mono);font-size:11px;letter-spacing:.18em;padding-bottom:28px;text-align:center;}
.stealth{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));width:52px;height:52px;
  border-radius:var(--radius);border:1px solid var(--line);background:var(--card);color:var(--accent);cursor:pointer;z-index:50;
  display:flex;align-items:center;justify-content:center;padding:0;box-shadow:var(--shadow);
  transition:transform .18s ease,border-color .18s ease;}
.stealth svg{width:24px;height:24px;}
.stealth:hover,.stealth:active{transform:translateY(-2px);border-color:var(--accent);}
.stealth:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
.modal{position:fixed;inset:0;background:rgba(2,6,23,.6);display:none;align-items:center;justify-content:center;z-index:100;padding:20px;}
.modal.open{display:flex;}
.dialog{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);
  padding:26px;width:min(420px,100%);box-shadow:var(--shadow);}
.dialog h2{margin:0 0 16px;font-size:18px;}
.row{display:flex;gap:10px;flex-wrap:wrap;}
.row input{flex:1 1 180px;}
input,select,textarea{width:100%;min-height:48px;padding:12px;border:1px solid var(--line);border-radius:8px;
  background:var(--bg);color:var(--ink);font:inherit;font-size:16px;}
input:focus,select:focus,textarea:focus{outline:2px solid var(--accent);outline-offset:1px;}
button{min-height:48px;padding:12px 20px;border:0;border-radius:8px;background:var(--accent);color:#fff;
  font:inherit;font-size:15px;font-weight:600;cursor:pointer;}
button:active{transform:scale(.98);}
button.ghost{background:transparent;color:var(--muted);border:1px solid var(--line);}
button.danger{background:var(--danger);}
.toast{position:fixed;top:18px;left:50%;transform:translateX(-50%) translateY(-12px);
  background:var(--ink);color:var(--bg);padding:12px 20px;border-radius:999px;font-size:14px;
  max-width:92vw;text-align:center;
  opacity:0;pointer-events:none;transition:all .25s ease;z-index:200;}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.empty{color:var(--muted);text-align:center;padding:40px 0;}
.lockbar{display:flex;justify-content:center;margin-top:12px;}
@media (max-width:600px){
  header{padding-top:24px;}
  .eyebrow{letter-spacing:.14em;}
  .quote{font-size:13px;}
  main{padding-top:16px;}
  .stealth{width:56px;height:56px;}
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
      a.style.animationDelay = Math.min(i, 7) * 40 + 'ms';
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

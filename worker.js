// ==========================================
// 默认初始数据兜底配置
// ==========================================
const DEFAULT_CONFIG = [
  { url: "https://drive.ing.nn.kg", title: "私人云盘", desc: "OpenList / Alist 文件管理", isPrivate: false, isHidden: false, icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>` },
  { url: "https://media.lxlhub.qzz.io", title: "流媒体中心", desc: "MoonTV 影视库", isPrivate: false, isHidden: false, icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>` },
  { url: "https://quiz.ing.nn.kg", title: "在线题库", desc: "自定义刷题与测试系统", isPrivate: false, isHidden: false, icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
  { url: "https://ops.lxlhub.qzz.io", title: "服务器探针", desc: "VPS 资源监控状态", isPrivate: false, isHidden: false, icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>` }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 后台系统的绝对入口密码
    const adminPwd = env.ADMIN_PWD || "lixuanli"; 

    // 获取系统动态安全配置（口令）
    let sysConfigStr = await env.MY_KV.get("SYS_CONFIG");
    let sysConfig = sysConfigStr ? JSON.parse(sysConfigStr) : { revealPwd: "5201314" };

    // ==========================================
    // 1. 安全层：后台系统鉴权 (Admin)
    // ==========================================
    if (url.pathname.startsWith('/admin')) {
      const expectedAuth = "Basic " + btoa("admin:" + adminPwd);
      const authHeader = request.headers.get("Authorization");

      if (authHeader !== expectedAuth) {
        return new Response("未授权访问，请出示身份凭证。", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="LingLuo ShanChuan Workspace"' }
        });
      }

      if (request.method === "POST") {
        const formData = await request.formData();
        const newJson = formData.get("configJson");
        const newRevealPwd = formData.get("revealPwd") || "5201314";
        
        try {
          JSON.parse(newJson); 
          await env.MY_KV.put("NAV_CONFIG", newJson);
          await env.MY_KV.put("SYS_CONFIG", JSON.stringify({ revealPwd: newRevealPwd }));
          return Response.redirect(url.origin + "/admin?msg=success", 302);
        } catch (e) {
          return new Response("数据编译错误，保存失败！", { status: 400 });
        }
      }

      let currentConfig = await env.MY_KV.get("NAV_CONFIG");
      if (!currentConfig) currentConfig = JSON.stringify(DEFAULT_CONFIG, null, 2);

      const msgHtml = url.searchParams.get("msg") === "success" 
        ? `<div style="background:#ecfdf5;color:#059669;padding:12px;border-radius:6px;margin-bottom:20px;border:1px solid #a7f3d0;font-weight:500;">✨ 阵法更新完毕，数据已同步至大千世界！</div>` 
        : "";

      const adminHtml = `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <title>零落山川 | 阵法中枢</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 30px 15px; padding-bottom: calc(30px + env(safe-area-inset-bottom)); -webkit-font-smoothing: antialiased; }
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
          .header { max-width: 800px; margin: 0 auto 24px; display: flex; justify-content: space-between; align-items: center; }
          .header h2 { margin: 0; font-size: 24px; color: #1e293b; letter-spacing: 1px; }
          .container { max-width: 800px; margin: 0 auto; }
          .toolbar { display: flex; gap: 10px; margin-bottom: 20px; }
          .edit-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); transition: all 0.2s ease; position: relative;}
          .edit-card:hover { border-color: #3b82f6; box-shadow: 0 10px 25px -5px rgba(59,130,246,0.1); transform: translateY(-2px); }
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px dashed #e2e8f0; }
          .card-header .badge { background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 6px; font-weight: 600; font-size: 14px; }
          .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
          .form-group label { display: block; font-size: 13px; color: #64748b; margin-bottom: 6px; font-weight: 500; }
          input, textarea { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; font-family: inherit; font-size: 14px; transition: all 0.2s; background: #f8fafc; }
          input:focus, textarea:focus { outline: none; border-color: #3b82f6; background: white; box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }
          textarea { height: 70px; resize: vertical; font-family: monospace; font-size: 13px; color: #475569; }
          .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; font-size: 15px; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; text-decoration: none;}
          .btn-primary { background: #1d4ed8; color: white; width: 100%; padding: 14px; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(29, 78, 216, 0.2); }
          .btn-add { background: #ffffff; color: #10b981; border: 2px dashed #10b981; width: 100%; padding: 16px; margin-bottom: 24px; font-size: 16px; font-weight: 600;}
          .btn-secondary { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
          .btn-secondary:active { transform: scale(0.97); }
          .icon-btn { background: white; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; padding: 6px 10px; margin-left: 6px; font-size: 14px; color: #475569;}
          .back-link { color: #64748b; text-decoration: none; font-size: 15px; }
          
          .checkbox-group { display: flex; gap: 20px; margin-top: 10px; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px dashed #cbd5e1; }
          .checkbox-label { display: flex; align-items: center; cursor: pointer; font-size: 14px; font-weight: 500; }
          .checkbox-label input { width: 16px; height: 16px; margin-right: 8px; cursor: pointer;}
          
          @media (max-width: 600px) { .input-grid { grid-template-columns: 1fr; } .toolbar { flex-direction: column; } .checkbox-group { flex-direction: column; gap: 10px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>⚙️ 阵法中枢 (Admin)</h2>
          <a href="/" class="back-link">← 归去</a>
        </div>
        <div class="container">
          ${msgHtml}
          <div class="toolbar">
            <button type="button" class="btn btn-secondary" onclick="exportJson()">📦 导出玉简 (Export)</button>
            <button type="button" class="btn btn-secondary" onclick="importJson()">📜 融合玉简 (Import)</button>
          </div>
          <form method="POST" id="adminForm">
            
            <!-- 核心安全配置区域 -->
            <div class="edit-card" style="border-color: #f87171; box-shadow: 0 4px 6px -1px rgba(239,68,68,0.1);">
                <div class="card-header">
                    <span class="badge" style="background:#fef2f2;color:#ef4444;">🛡️ 核心动态密钥配置</span>
                </div>
                <div class="form-group">
                    <label>隐秘法阵口令 (右下角极限盲区触发)</label>
                    <input type="text" name="revealPwd" value="${sysConfig.revealPwd}" required>
                </div>
            </div>

            <input type="hidden" name="configJson" id="hidden-json">
            <div id="list-container"></div>
            <button type="button" class="btn btn-add" onclick="addItem()">+ 凝练新节点</button>
            <button type="submit" class="btn btn-primary">⚡ 刻印阵法并同步天下 (Save)</button>
          </form>
        </div>

        <script>
          let siteData = ${currentConfig};
          siteData = siteData.map(item => ({
             ...item,
             isPrivate: item.isPrivate || false,
             isHidden: item.isHidden || false
          }));

          function render() {
            const container = document.getElementById('list-container');
            container.innerHTML = '';
            siteData.forEach((item, index) => {
              container.innerHTML += \`
                <div class="edit-card">
                  <div class="card-header">
                    <span class="badge">洞天 #\${index + 1}</span>
                    <div>
                      \${index > 0 ? \`<button type="button" class="icon-btn" title="上移" onclick="moveItem(\${index}, -1)">⬆️</button>\` : ''}
                      \${index < siteData.length - 1 ? \`<button type="button" class="icon-btn" title="下移" onclick="moveItem(\${index}, 1)">⬇️</button>\` : ''}
                      <button type="button" class="icon-btn danger" title="删除" onclick="deleteItem(\${index})">🗑️</button>
                    </div>
                  </div>
                  <div class="input-grid">
                    <div class="form-group">
                      <label>尊号 (Title)</label>
                      <input type="text" value="\${item.title}" oninput="updateItem(\${index}, 'title', this.value)" required>
                    </div>
                    <div class="form-group">
                      <label>空间坐标 (URL)</label>
                      <input type="url" value="\${item.url}" oninput="updateItem(\${index}, 'url', this.value)" required>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>法则解析 (Description)</label>
                    <input type="text" value="\${item.desc}" oninput="updateItem(\${index}, 'desc', this.value)">
                  </div>
                  <div class="checkbox-group">
                      <label class="checkbox-label" style="color: #ef4444;">
                        <input type="checkbox" \${item.isPrivate ? 'checked' : ''} onchange="updateItem(\${index}, 'isPrivate', this.checked)">
                        🔒 设为私密 (输入全局口令后显示)
                      </label>
                      <label class="checkbox-label" style="color: #64748b;">
                        <input type="checkbox" \${item.isHidden ? 'checked' : ''} onchange="updateItem(\${index}, 'isHidden', this.checked)">
                        👻 彻底隐藏 (即使有口令也不显示)
                      </label>
                  </div>
                  <div class="form-group" style="margin-top: 15px;">
                    <label>阵纹代码 (SVG Icon)</label>
                    <textarea oninput="updateItem(\${index}, 'icon', this.value)">\${item.icon}</textarea>
                  </div>
                </div>
              \`;
            });
            document.getElementById('hidden-json').value = JSON.stringify(siteData);
          }

          function updateItem(index, key, value) { siteData[index][key] = value; document.getElementById('hidden-json').value = JSON.stringify(siteData); }
          function deleteItem(index) { if(confirm('要将此洞天从星图中抹除吗？')) { siteData.splice(index, 1); render(); } }
          function moveItem(index, dir) { const temp = siteData[index]; siteData[index] = siteData[index + dir]; siteData[index + dir] = temp; render(); }
          function addItem() {
            siteData.push({ title: "新洞天", url: "https://", desc: "请注入法则描述", isPrivate: false, isHidden: false, icon: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>\` });
            render();
          }
          
          function exportJson() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(siteData, null, 2));
            const dlNode = document.createElement('a');
            dlNode.setAttribute("href", dataStr);
            dlNode.setAttribute("download", "llsc_nav_config.json");
            document.body.appendChild(dlNode);
            dlNode.click();
            dlNode.remove();
          }

          function importJson() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = e => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = event => {
                try {
                  siteData = JSON.parse(event.target.result);
                  render();
                  alert("✅ 阵法图解析成功，请点击最下方按钮保存同步！");
                } catch(err) { alert("❌ 玉简解析失败，JSON格式有误！"); }
              };
              reader.readAsText(file);
            }
            input.click();
          }

          render();
        </script>
      </body>
      </html>
      `;
      return new Response(adminHtml, { headers: { "content-type": "text/html;charset=UTF-8" } });
    }

    // ==========================================
    // 2. API层：数据交互
    // ==========================================
    let navDataStr = await env.MY_KV.get("NAV_CONFIG");
    let NAV_ITEMS = navDataStr ? JSON.parse(navDataStr) : DEFAULT_CONFIG;

    if (url.pathname === '/api/reveal' && request.method === 'POST') {
      const { pwd } = await request.json();
      if (pwd === sysConfig.revealPwd) {
        // 返回未被彻底隐藏，且标记为私密的节点
        const privateItems = NAV_ITEMS
          .map((item, idx) => ({ ...item, originalIdx: idx }))
          .filter(item => item.isPrivate && !item.isHidden);
        return new Response(JSON.stringify({ items: privateItems }), { headers: { "Content-Type": "application/json" } });
      } else {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    if (url.pathname === '/api/status' && request.method === 'POST') {
      const { indices } = await request.json();
      const results = await Promise.all(indices.map(async (idx) => {
        const item = NAV_ITEMS[idx];
        if (!item || item.isHidden) return { idx, ok: false };
        try {
          const res = await fetch(item.url, { 
            method: 'GET', 
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Hub-Monitor' }, 
            signal: AbortSignal.timeout(3000) 
          });
          return { idx, ok: res.ok };
        } catch (error) { return { idx, ok: false }; }
      }));
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json;charset=UTF-8", "Cache-Control": "no-store" } });
    }

    // ==========================================
    // 3. 前端页面：大千世界主入口
    // ==========================================
    
    // SSR 仅渲染公开且未彻底隐藏的节点
    const publicItems = NAV_ITEMS
      .map((item, idx) => ({ ...item, originalIdx: idx }))
      .filter(item => !item.isHidden && !item.isPrivate);

    const cardsHtml = publicItems.map(item => `
      <a href="${item.url}" class="nav-item" target="_blank" id="node-${item.originalIdx}">
          <span class="icon">${item.icon}</span>
          <div class="details">
              <span class="title">${item.title}</span>
              <span class="desc">${item.desc}</span>
          </div>
          <div class="status-dot" data-idx="${item.originalIdx}"></div>
      </a>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
        <title>零落山川</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Long+Cang&family=Ma+Shan+Zheng&family=LXGW+WenKai+TC&display=swap" rel="stylesheet">
        
        <style>
            :root { 
                --bg-base: #0b1120; 
                --grid-color: rgba(30, 58, 138, 0.08); 
                --text-main: #f8fafc; --text-secondary: #94a3b8; 
                --card-bg: rgba(15, 23, 42, 0.6); --border-color: rgba(255, 255, 255, 0.08); 
                --primary-blue: #3b82f6; --hover-border: rgba(59, 130, 246, 0.5); --hover-shadow: rgba(29, 78, 216, 0.2);
            }
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; 
                background-color: var(--bg-base); 
                background-image: linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px); 
                background-size: 50px 50px; 
                background-position: center center; 
                color: var(--text-main); 
                display: flex; flex-direction: column; justify-content: center; align-items: center; 
                min-height: 100vh; margin: 0; overflow-x: hidden;
                padding-bottom: env(safe-area-inset-bottom); 
                -webkit-font-smoothing: antialiased; 
            }
            
            ::-webkit-scrollbar { display: none; }
            * { scrollbar-width: none; }

            .container { max-width: 750px; width: 90%; padding: 45px 30px; z-index: 10; background: radial-gradient(circle at top, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.1) 100%); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); position: relative; }
            
            h1 { text-align: center; font-family: 'Long Cang', cursive; font-size: 52px; font-weight: normal; margin-top: 0; margin-bottom: 5px; letter-spacing: 6px; text-shadow: 0 2px 15px rgba(255, 255, 255, 0.15); cursor: default; }
            .sub-quote { text-align: center; font-family: 'Ma Shan Zheng', serif; font-size: 16px; color: var(--text-secondary); margin-bottom: 40px; letter-spacing: 2px; opacity: 0.8; text-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }
            
            .nav-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
            .nav-item { position: relative; display: flex; align-items: center; padding: 18px 22px; text-decoration: none; background-color: var(--card-bg); backdrop-filter: blur(12px); border: 1px solid var(--border-color); border-radius: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; -webkit-tap-highlight-color: transparent;}
            .nav-item::before { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent); transform: skewX(-20deg); transition: all 0.5s ease; }
            
            .nav-item:hover::before { left: 150%; }
            .nav-item:hover { border-color: var(--hover-border); background-color: rgba(30, 41, 59, 0.8); transform: translateY(-4px); box-shadow: 0 10px 30px -5px var(--hover-shadow), 0 0 0 1px var(--hover-border) inset; }
            .nav-item:active { transform: scale(0.97); }
            .nav-item:hover .title, .nav-item:hover .icon { color: var(--primary-blue); }
            
            /* 私密节点入场动画 */
            @keyframes fade-in-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .private-node { animation: fade-in-up 0.5s ease forwards; border-color: rgba(16, 185, 129, 0.2); }
            .private-node:hover { border-color: rgba(16, 185, 129, 0.6); box-shadow: 0 10px 30px -5px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.4) inset; }

            @media (-webkit-min-device-pixel-ratio: 2) {
                .nav-item { border-width: 0.5px; }
                .container { border-width: 0.5px; }
            }

            .icon { display: flex; align-items: center; justify-content: center; margin-right: 18px; color: var(--text-secondary); transition: color 0.3s ease; background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); }
            .icon svg { width: 22px; height: 22px; }
            .details { display: flex; flex-direction: column; overflow: hidden; width: calc(100% - 30px); }
            .title { display: flex; align-items: center; font-size: 16px; font-weight: 500; font-family: 'LXGW WenKai TC', sans-serif; color: var(--text-main); transition: color 0.3s ease; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .desc { font-size: 13px; font-family: 'LXGW WenKai TC', sans-serif; color: var(--text-secondary); margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            
            .status-dot { position: absolute; top: 16px; right: 18px; width: 8px; height: 8px; border-radius: 50%; background-color: var(--text-secondary); opacity: 0.3; transition: all 0.5s ease; }
            .status-dot.online { background-color: #10b981; opacity: 1; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6), 0 0 12px rgba(16, 185, 129, 0.2); animation: dot-breathe 2.4s ease-in-out infinite; }
            .status-dot.offline { background-color: #ef4444; opacity: 1; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); }

            /* 全局 Toast 提示框 */
            .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%) translateY(-20px); background: rgba(16, 185, 129, 0.9); color: white; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; backdrop-filter: blur(10px); z-index: 2000; opacity: 0; pointer-events: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); display: flex; align-items: center; gap: 8px;}
            .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
            .toast.error { background: rgba(239, 68, 68, 0.9); box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.4); }

            /* 隐蔽口令触控区 (右下角极限盲区) - 双向开关 */
            .stealth-trigger-reveal { position: fixed; bottom: 0; right: 0; width: 80px; height: 80px; cursor: pointer; z-index: 999; opacity: 0; -webkit-tap-highlight-color: transparent;}

            .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1000; display: none; justify-content: center; align-items: center; opacity: 0; transition: opacity 0.3s; }
            .modal-overlay.active { display: flex; opacity: 1; }
            .modal-box { background: #0f172a; border: 1px solid var(--border-color); border-radius: 16px; padding: 30px; width: 90%; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); transform: translateY(20px); transition: transform 0.3s; }
            .modal-overlay.active .modal-box { transform: translateY(0); }
            .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-family: 'LXGW WenKai TC', sans-serif; font-size: 20px; color: white; border-bottom: 1px dashed var(--border-color); padding-bottom: 15px;}
            .close-btn { cursor: pointer; color: var(--text-secondary); font-size: 24px; transition: color 0.2s; }
            .close-btn:hover { color: white; }
            
            .auth-area { display: flex; gap: 10px; margin-bottom: 15px; }
            .auth-input { flex: 1; padding: 12px 15px; border-radius: 8px; border: 1px solid var(--border-color); background: rgba(0,0,0,0.3); color: white; font-size: 14px; outline: none; transition: border 0.3s;}
            .auth-input:focus { border-color: var(--primary-blue); }
            .auth-submit { padding: 0 20px; background: var(--primary-blue); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; transition: opacity 0.3s; }
            .auth-submit:hover { opacity: 0.8; }
            .auth-submit:active { transform: scale(0.95); }

            .ripple { position: absolute; border-radius: 50%; background: rgba(59, 130, 246, 0.35); transform: scale(0); transform-origin: center; animation: ripple-anim 0.6s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; will-change: transform, opacity; }
            
            .aurora-glow { position: fixed; border-radius: 50%; filter: blur(60px); opacity: 0.25; pointer-events: none; z-index: 0; will-change: transform; transform: translateZ(0); }
            .glow-1 { width: 320px; height: 320px; background: radial-gradient(circle, #3b82f6, transparent 70%); top: 8%; left: -10%; animation: drift-1 16s ease-in-out infinite; }
            .glow-2 { width: 280px; height: 280px; background: radial-gradient(circle, #0ea5e9, transparent 70%); bottom: 5%; right: -8%; animation: drift-2 20s ease-in-out infinite; }
            
            .footer { margin-top: 40px; margin-bottom: env(safe-area-inset-bottom); font-size: 12px; color: var(--text-secondary); letter-spacing: 1px; opacity: 0.5; z-index: 10; text-align: center; line-height: 1.8;}
            
            @keyframes drift-1 { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(40px, 30px, 0) scale(1.15); } }
            @keyframes drift-2 { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(-30px, -25px, 0) scale(1.1); } }
            @keyframes dot-breathe { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.6; } }
            @keyframes ripple-anim { to { transform: scale(3); opacity: 0; } }
            
            @media (max-width: 600px) { 
                .container { padding: 35px 20px; width: 92%; } 
                .nav-grid { grid-template-columns: 1fr; } 
                h1 { font-size: 44px; } 
            }
        </style>
    </head>
    <body>
        <div class="aurora-glow glow-1"></div>
        <div class="aurora-glow glow-2"></div>
        
        <!-- 全局提示框 -->
        <div id="toast" class="toast"></div>

        <!-- ================================================== -->
        <!-- 右下角隐蔽点击触发：隐秘法阵 / 重置封印双向开关 -->
        <div class="stealth-trigger-reveal" onclick="handleStealthClick()" title=" "></div>
        <!-- ================================================== -->

        <!-- 通用模态框 -->
        <div class="modal-overlay" id="app-modal">
            <div class="modal-box">
                <div class="modal-header">
                    <span id="modal-title">认证中枢</span>
                    <span class="close-btn" onclick="closeModal()">×</span>
                </div>
                
                <div class="auth-area" id="auth-area">
                    <input type="password" id="sys-pwd" class="auth-input" placeholder="请输入阵法口令...">
                    <button class="auth-submit" onclick="verifyPwd()">破阵</button>
                </div>
            </div>
        </div>

        <div class="container">
            <h1 id="main-title">零落山川</h1>
            <div class="sub-quote" id="random-quote">道法推演中...</div>
            <div class="nav-grid">
                ${cardsHtml}
            </div>
        </div>
        
        <div class="footer" id="footer-text">
            © <span id="current-year"></span> 零落山川 All Rights Reserved.
        </div>

        <script>


            let isUnlocked = false; // 记录当前是否已解密

            async function loadDynamicQuote() {
                const quoteEl = document.getElementById('random-quote');
                try {
                    // 开启全域盲抽模式
                    const res = await fetch('https://v1.hitokoto.cn/', { signal: AbortSignal.timeout(3000) });
                    if (!res.ok) throw new Error('API_ERR');
                    const data = await res.json();
                    let sourceText = "";
                    if (data.from_who) sourceText += data.from_who;
                    if (data.from) sourceText += (sourceText ? " " : "") + "《" + data.from + "》";
                    
                    quoteEl.innerText = "「 " + data.hitokoto + " 」";
                    if (sourceText) {
                        const sourceDiv = document.createElement('div');
                        // 专门为出处设置了不同的字体和透明度，拉开视觉层次
                        sourceDiv.style.cssText = "margin-top: 12px; font-size: 14px; opacity: 0.65; font-family: 'LXGW WenKai TC', sans-serif; letter-spacing: 1px; text-shadow: none; text-align: right;";
                        sourceDiv.innerText = "—— " + sourceText;
                        quoteEl.appendChild(sourceDiv);
                    }
                } catch (e) {
                    // 原生语录已彻底抹除，网络超时仅做极简提示
                    quoteEl.innerText = "「 灵气枯竭，未能连接到语录之源... 」";
                }
            }

            function showToast(msg, isError = false) {
                const toast = document.getElementById('toast');
                toast.innerText = msg;
                if(isError) toast.classList.add('error');
                else toast.classList.remove('error');
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }

            document.addEventListener("DOMContentLoaded", async () => {
                document.getElementById('current-year').innerText = new Date().getFullYear();
                loadDynamicQuote();

                bindRipple(document.querySelectorAll('.nav-item'));

                // 回车快捷验证
                document.getElementById('sys-pwd').addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') verifyPwd();
                });

                // 自动检查是否已有口令记忆，静默加载私密节点
                const savedPasscode = localStorage.getItem('LLSC_PASSCODE');
                if (savedPasscode) {
                    try {
                        const res = await fetch('/api/reveal', { method: 'POST', body: JSON.stringify({ pwd: savedPasscode }) });
                        if (res.ok) {
                            const data = await res.json();
                            isUnlocked = true;
                            renderPrivateCards(data.items);
                            showToast('✨ 隐秘阵法已自动解除隐匿');
                        } else {
                            localStorage.removeItem('LLSC_PASSCODE'); 
                        }
                    } catch(e) {}
                }

                // 推演页面上已有节点的状态
                checkStatus();
            });

            function bindRipple(elements) {
                elements.forEach(card => {
                    if(card.dataset.rippleBound) return;
                    card.dataset.rippleBound = true;
                    
                    card.addEventListener('click', function(e) {
                        const rect = this.getBoundingClientRect();
                        const ripple = document.createElement('span');
                        const size = Math.max(rect.width, rect.height);
                        ripple.className = 'ripple';
                        ripple.style.width = ripple.style.height = size + 'px';
                        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                        this.appendChild(ripple);
                        setTimeout(() => ripple.remove(), 600);
                    });
                });
            }

            async function checkStatus() {
                const dots = document.querySelectorAll('.status-dot:not(.checked)');
                if (dots.length === 0) return;
                
                const indices = Array.from(dots).map(dot => parseInt(dot.getAttribute('data-idx')));
                dots.forEach(dot => dot.classList.add('checked')); 
                
                try {
                    const res = await fetch('/api/status', { method: 'POST', body: JSON.stringify({ indices }) });
                    const statuses = await res.json();
                    statuses.forEach(status => {
                        const dot = document.querySelector(\`.status-dot[data-idx="\${status.idx}"]\`);
                        if (dot) {
                            if (status.ok) dot.classList.add('online');
                            else dot.classList.add('offline');
                        }
                    });
                } catch (error) { console.error('探针推演受阻'); }
            }

            function renderPrivateCards(items) {
                const grid = document.querySelector('.nav-grid');
                items.forEach(item => {
                    if (!document.getElementById('node-' + item.originalIdx)) {
                        const a = document.createElement('a');
                        a.href = item.url;
                        a.className = 'nav-item private-node';
                        a.target = '_blank';
                        a.id = 'node-' + item.originalIdx;
                        // 完全抹除视觉上的锁标记，实现真正的无差别隐匿
                        a.innerHTML = \`
                            <span class="icon">\${item.icon}</span>
                            <div class="details">
                                <span class="title">\${item.title}</span>
                                <span class="desc">\${item.desc}</span>
                            </div>
                            <div class="status-dot" data-idx="\${item.originalIdx}"></div>
                        \`;
                        grid.appendChild(a);
                    }
                });
                bindRipple(document.querySelectorAll('.private-node'));
                checkStatus(); 
            }

            // 右下角隐秘触发器双向开关控制逻辑
            function handleStealthClick() {
                if (isUnlocked) {
                    // 如果已经解密，再次点击则直接退隐（锁定系统）
                    lockSystem();
                } else {
                    // 尚未解密，打开认证框
                    openModal();
                }
            }

            function openModal() {
                document.getElementById('auth-area').style.display = 'flex';
                document.getElementById('modal-title').innerText = '🔑 隐秘法阵';
                document.getElementById('sys-pwd').placeholder = '请输入破除隐匿的全局口令...';
                document.getElementById('sys-pwd').value = '';
                
                document.getElementById('app-modal').classList.add('active');
                setTimeout(() => document.getElementById('sys-pwd').focus(), 100);
            }

            function closeModal() {
                document.getElementById('app-modal').classList.remove('active');
            }

            async function verifyPwd() {
                const pwd = document.getElementById('sys-pwd').value;
                if (!pwd) return;

                try {
                    const res = await fetch('/api/reveal', { method: 'POST', body: JSON.stringify({ pwd }) });
                    if (!res.ok) throw new Error('Reveal Failed');
                    const data = await res.json();
                    
                    localStorage.setItem('LLSC_PASSCODE', pwd);
                    isUnlocked = true;
                    
                    closeModal();
                    renderPrivateCards(data.items);
                    showToast('✅ 口令验证成功，隐秘阵法已显现');
                } catch (e) { 
                    document.getElementById('sys-pwd').value = '';
                    showToast('❌ 口令错误，阵法未响应', true);
                }
            }

            function lockSystem() {
                localStorage.removeItem('LLSC_PASSCODE');
                isUnlocked = false;
                window.location.reload();
            }
        </script>
    </body>
    </html>
    `;

    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  },
};

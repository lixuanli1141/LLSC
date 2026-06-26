// ==========================================
// 默认初始数据兜底配置
// ==========================================
const DEFAULT_CONFIG = [
  { url: "https://drive.ing.nn.kg", title: "私人云盘", desc: "OpenList / Alist 文件管理", icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>` },
  { url: "https://media.lxlhub.qzz.io", title: "流媒体中心", desc: "MoonTV 影视库", icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>` },
  { url: "https://quiz.ing.nn.kg", title: "在线题库", desc: "自定义刷题与测试系统", icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>` },
  { url: "https://ops.lxlhub.qzz.io", title: "服务器探针", desc: "VPS 资源监控状态", icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>` }
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // ==========================================
    // 1. 安全层：后台系统鉴权
    // ==========================================
    if (url.pathname.startsWith('/admin')) {
      const adminPwd = env.ADMIN_PWD || "123456"; 
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
        try {
          JSON.parse(newJson); 
          await env.MY_KV.put("NAV_CONFIG", newJson);
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>零落山川 | 阵法中枢</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 30px 15px; }
          .header { max-width: 800px; margin: 0 auto 24px; display: flex; justify-content: space-between; align-items: center; }
          .header h2 { margin: 0; font-size: 24px; color: #1e293b; letter-spacing: 1px; }
          .container { max-width: 800px; margin: 0 auto; }
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
          .icon-btn { background: white; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; padding: 6px 10px; margin-left: 6px; font-size: 14px; color: #475569;}
          .back-link { color: #64748b; text-decoration: none; font-size: 15px; }
          @media (max-width: 600px) { .input-grid { grid-template-columns: 1fr; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>⚙️ 阵法中枢 (Admin)</h2>
          <a href="/" class="back-link">← 归去</a>
        </div>
        <div class="container">
          ${msgHtml}
          <form method="POST" id="adminForm">
            <input type="hidden" name="configJson" id="hidden-json">
            <div id="list-container"></div>
            <button type="button" class="btn btn-add" onclick="addItem()">+ 凝练新节点</button>
            <button type="submit" class="btn btn-primary">⚡ 刻印阵法并同步天下 (Save)</button>
          </form>
        </div>

        <script>
          let siteData = ${currentConfig};

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
                  <div class="form-group">
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
            siteData.push({ title: "新洞天", url: "https://", desc: "请注入法则描述", icon: \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>\` });
            render();
          }
          render();
        </script>
      </body>
      </html>
      `;
      return new Response(adminHtml, { headers: { "content-type": "text/html;charset=UTF-8" } });
    }

    // ==========================================
    // 4. 前台：读取配置与探针接口
    // ==========================================
    let navDataStr = await env.MY_KV.get("NAV_CONFIG");
    let NAV_ITEMS = navDataStr ? JSON.parse(navDataStr) : DEFAULT_CONFIG;

    if (url.pathname === '/api/status') {
      const results = await Promise.all(NAV_ITEMS.map(async (item) => {
        try {
          const res = await fetch(item.url, { method: 'GET', headers: { 'User-Agent': 'Hub-Monitor' }, signal: AbortSignal.timeout(3000) });
          return { url: item.url, ok: res.ok };
        } catch (error) { return { url: item.url, ok: false }; }
      }));
      return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json;charset=UTF-8", "Cache-Control": "no-store" } });
    }

    // ==========================================
    // 5. 前端页面：神级书法字体 + 百句语录
    // ==========================================
    const cardsHtml = NAV_ITEMS.map(item => `
      <a href="${item.url}" class="nav-item" target="_blank">
          <span class="icon">${item.icon}</span>
          <div class="details">
              <span class="title">${item.title}</span>
              <span class="desc">${item.desc}</span>
          </div>
          <div class="status-dot" data-url="${item.url}"></div>
      </a>
    `).join('');

    const html = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>零落山川</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&family=LXGW+WenKai+TC&display=swap" rel="stylesheet">
        
        <style>
            :root { 
                --bg-base: #0b1120; 
                --grid-color: rgba(30, 58, 138, 0.15); 
                --text-main: #f8fafc; 
                --text-secondary: #94a3b8; 
                --card-bg: rgba(15, 23, 42, 0.6); 
                --border-color: rgba(255, 255, 255, 0.08); 
                --primary-blue: #3b82f6; 
                --hover-border: rgba(59, 130, 246, 0.5);
                --hover-shadow: rgba(29, 78, 216, 0.2);
            }
            
            body { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; 
                background-color: var(--bg-base); 
                background-image: 
                    linear-gradient(var(--grid-color) 1px, transparent 1px),
                    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
                background-size: 30px 30px;
                background-position: center center;
                color: var(--text-main); 
                display: flex; 
                flex-direction: column; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh; 
                margin: 0; 
            }

            .container { 
                max-width: 750px; 
                width: 90%; 
                padding: 45px 30px; 
                z-index: 10;
                background: radial-gradient(circle at top, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.1) 100%);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.05);
                border-radius: 20px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }

            /* 书法主标题：霞鹜文楷 */
            h1 { 
                text-align: center; 
                font-family: 'LXGW WenKai TC', cursive;
                font-size: 52px; 
                font-weight: normal; 
                margin-top: 0; 
                margin-bottom: 5px; 
                letter-spacing: 6px; 
                text-shadow: 0 2px 15px rgba(255, 255, 255, 0.15);
            }

            /* 诗词副标题：马善政楷书 */
            .sub-quote {
                text-align: center;
                font-family: 'Ma Shan Zheng', serif;
                font-size: 16px;
                color: var(--text-secondary);
                margin-bottom: 40px;
                letter-spacing: 2px;
                opacity: 0.8;
                text-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
                transition: opacity 1s ease-in-out;
            }

            .nav-grid { 
                display: grid; 
                grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); 
                gap: 20px; 
            }

            .nav-item { 
                position: relative; 
                display: flex; 
                align-items: center; 
                padding: 18px 22px; 
                text-decoration: none; 
                background-color: var(--card-bg); 
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid var(--border-color); 
                border-radius: 12px; 
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                overflow: hidden;
            }

            .nav-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 50%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
                transform: skewX(-20deg);
                transition: all 0.5s ease;
            }

            .nav-item:hover::before { left: 150%; }

            .nav-item:hover { 
                border-color: var(--hover-border); 
                background-color: rgba(30, 41, 59, 0.8); 
                transform: translateY(-4px); 
                box-shadow: 0 10px 30px -5px var(--hover-shadow), 0 0 0 1px var(--hover-border) inset; 
            }

            .nav-item:hover .title, .nav-item:hover .icon { color: var(--primary-blue); }

            .icon { 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                margin-right: 18px; 
                color: var(--text-secondary); 
                transition: color 0.3s ease; 
                background: rgba(255, 255, 255, 0.03);
                padding: 10px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }

            .icon svg { width: 22px; height: 22px; }

            .details { display: flex; flex-direction: column; }

            .title { font-size: 16px; font-weight: 500; color: var(--text-main); transition: color 0.3s ease; letter-spacing: 0.5px; }
            .desc { font-size: 13px; color: var(--text-secondary); margin-top: 6px; }

            .status-dot { 
                position: absolute; 
                top: 16px; 
                right: 18px; 
                width: 8px; 
                height: 8px; 
                border-radius: 50%; 
                background-color: var(--text-secondary); 
                opacity: 0.3; 
                transition: all 0.5s ease; 
            }

            .status-dot.online { background-color: #10b981; opacity: 1; box-shadow: 0 0 8px rgba(16, 185, 129, 0.6), 0 0 12px rgba(16, 185, 129, 0.2); }
            .status-dot.offline { background-color: #ef4444; opacity: 1; box-shadow: 0 0 8px rgba(239, 68, 68, 0.6); }
            
            .footer { margin-top: 40px; font-size: 12px; color: var(--text-secondary); letter-spacing: 1px; opacity: 0.5; }
            
            @media (max-width: 600px) { 
                .container { padding: 35px 20px; width: 92%; } 
                .nav-grid { grid-template-columns: 1fr; } 
                h1 { font-size: 44px; } /* 手机端标题稍微缩小避免换行 */
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>零落山川</h1>
            <div class="sub-quote" id="random-quote">道法推演中...</div>
            <div class="nav-grid">
                ${cardsHtml}
            </div>
        </div>
        <div class="footer" id="footer-text">© <span id="current-year"></span> 零落山川 All Rights Reserved.</div>

        <script>
            // 100 句修仙/玄幻大圆满金句库
            const xianxiaQuotes = [
                // 凡人修仙传
                "大道无情，修仙本就是逆天而行。",
                "修仙界本就弱肉强食，哪有什么真正的道理可言。",
                "纵然天道崎岖，我也要踏出一条长生路。",
                "岁月不居，时节如流，修仙无岁月。",
                "法宝再好，也不如自身的修为靠得住。",
                "所谓长生，不过是看尽故人离去，独自品尝这无尽的孤寂。",
                "我韩立行事，何须向他人解释。",
                // 仙逆 / 求魔
                "这雨生于天，死于大地，中间的过程，便是人生。",
                "顺为凡，逆则仙，只在中间颠倒颠。",
                "道在人为，我命由我不由天！",
                "我修的不是仙，是这无尽的孤寂。",
                "魔前一叩三千年，回首凡尘不做仙。",
                "既然世人皆称我为魔，那我从此，便做这天地间第一大魔！",
                "我左手是修魔海短暂的因果，右手里百年一个漫长的孤陌。",
                "如果这天遮了我的眼，那我就捅破这天！",
                "我命如妖欲封天！",
                "既然找不到前往仙界的路，那便自己走出来一条。",
                // 遮天 / 完美世界
                "仙路尽头谁为峰，一见无始道成空。",
                "哪怕背负天渊，需一手托原始帝城，我安澜一样无敌于世间！",
                "登天路，踏歌行，弹指遮天。",
                "我为天帝，当镇压世间一切敌！",
                "谁在称无敌，哪个敢言不败？帝落时代都不见！",
                "一粒尘可填海，一根草斩尽日月星辰，弹指间天翻地覆。",
                "吾乃万道之尊，执掌诸天星辰！",
                "星空彼岸，有我无敌。",
                "历千劫万险，纵使魂飞魄散，我灵识依在，战百世轮回，纵使六道无常，我依然永生！",
                "待到逆乱阴阳时，以我魔血染青天！",
                // 剑来 / 雪中悍刀行
                "有些道理，剑鞘里说不通，那就拔剑跟这个世界讲。",
                "遇事不决，可问春风。春风不语，即随本心。",
                "我有一剑，可搬山，倒海，降妖，镇魔，摘星，断江，摧城，开天！",
                "天不生我李淳罡，剑道万古如长夜。",
                "天上剑仙三百万，见我也须尽低眉。",
                "愿吾辈剑修，人人皆可一剑开天门。",
                "世间文字八万个，唯有情字最杀人。",
                "且视他人之疑目如盏盏鬼火，大胆去走你的夜路。",
                "莫道书生无胆气，敢叫天地沉入海。",
                // 将夜 / 悟空传
                "天不生夫子，万古如长夜。",
                "若天压我，劈开那天；若地拘我，踏碎那地。",
                "我等生来自由身，谁敢高高在上。",
                "原来一生一世那么短暂，原来当你发现所爱的，就应该不顾一切的去追求。",
                "我要这天，再遮不住我眼；要这地，再埋不了我心。",
                "长夜漫漫，唯剑作伴。",
                "生如夏花之绚烂，死如秋叶之静美。",
                // 古典道法
                "大梦谁先觉？平生我自知。",
                "寄蜉蝣于天地，渺沧海之一粟。",
                "一剑光寒十九洲。",
                "万象玉简，包罗山川之志。",
                "千秋万载，大道独行。",
                "吾有一口玄黄气，可吞天地日月星。",
                "万古沧桑，唯我大道长存。",
                "道生一，一生二，二生三，三生万物。",
                "天地不仁，以万物为刍狗。",
                "太上忘情，最下不及情，情之所钟，正在我辈。",
                "夫天地者，万物之逆旅也；光阴者，百代之过客也。",
                "心如明镜台，时时勤拂拭。",
                "菩提本无树，明镜亦非台，本来无一物，何处惹尘埃。",
                "凡所有相，皆是虚妄。",
                "一花一世界，一叶一菩提。",
                "修心即修道，心若止水，万法不侵。",
                "天之道，损有余而补不足；人之道，损不足以奉有余。",
                "上善若水。水善利万物而不争。",
                "致虚极，守静笃。万物并作，吾以观复。",
                "知人者智，自知者明。胜人者有力，自胜者强。",
                // 硬核霸气
                "三十年河东，三十年河西，莫欺少年穷！",
                "手握日月摘星辰，世间无我这般人。",
                "败在我手中之敌，从来不会被我视为对手，我给你时间追赶，直至你遥望不见。",
                "重瞳本是无敌路，何须再借他人骨。",
                "仙之巅，傲世间，有我安澜便有天！",
                "纵使这世间再无仙，我也要踏破虚空，问鼎苍穹。",
                "天地玄黄，宇宙洪荒，唯我道心，万古不灭。",
                "你若执迷不悟，休怪我剑下无情。",
                "一朝顿悟，立地成佛；一念成魔，万劫不复。",
                "吾辈修士，当有一往无前之心，纵死无悔！",
                "神若挡我，我便杀神；魔若阻我，我便诛魔！",
                "世间毁誉，不过是一阵秋风，拂过便散。",
                // 归隐山林 
                "结庐在人境，而无车马喧。",
                "采菊东篱下，悠然见南山。",
                "山中何所有，岭上多白云。只可自怡悦，不堪持赠君。",
                "行到水穷处，坐看云起时。",
                "明月松间照，清泉石上流。",
                "绿蚁新醅酒，红泥小火炉。晚来天欲雪，能饮一杯无？",
                "此中有真意，欲辨已忘言。",
                "回首向来萧瑟处，归去，也无风雨也无晴。",
                "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。",
                "世事一场大梦，人生几度秋凉。",
                "休言万事转头空，未转头时皆梦。",
                "人生如逆旅，我亦是行人。",
                // 赛博修仙
                "数据流转生灭，犹如诸天星辰起落。",
                "以代码为阵纹，以算力为灵气，证道大千。",
                "逻辑不灭，神识永存。",
                "在比特与字节的深渊中，窥见大道的真理。",
                "每一行代码，皆是我留给这世间的道标。"
            ];

            document.addEventListener("DOMContentLoaded", async () => {
                document.getElementById('current-year').innerText = new Date().getFullYear();

                const quoteEl = document.getElementById('random-quote');
                const randomText = xianxiaQuotes[Math.floor(Math.random() * xianxiaQuotes.length)];
                quoteEl.style.opacity = 0;
                setTimeout(() => {
                    quoteEl.innerText = "「 " + randomText + " 」";
                    quoteEl.style.opacity = 1;
                }, 100);

                try {
                    const res = await fetch('/api/status');
                    const statuses = await res.json();
                    statuses.forEach(status => {
                        const dot = document.querySelector(\`.status-dot[data-url="\${status.url}"]\`);
                        if (dot) {
                            if (status.ok) dot.classList.add('online');
                            else dot.classList.add('offline');
                        }
                    });
                } catch (error) { console.error('阵法推演受阻'); }
            });
        </script>
    </body>
    </html>
    `;

    return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
  },
};

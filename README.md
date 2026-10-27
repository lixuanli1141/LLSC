# 零落山川 · 个人导航站 v2.3

Cloudflare Workers + KV 的个人导航站。按 elayadesign 的 landing-page-design 与 redesign-existing-projects 两套技能重做：饱满的 hero 区（大标题、副标题、一个主行动、实时状态证明、主视觉）、不对称的 bento 导航分区、三步使用说明、逐词显现的 tagline 区。视觉系统：单一字体、Tailwind 字阶与间距 token、扁平背景、一个点缀色、基础动效曲线加 IntersectionObserver 滚动显现；不引外部字体或 CDN，动效只动 transform 与 opacity，尊重 `prefers-reduced-motion`。桌面多列、手机单列，兼顾 1280px 与 390px 视口。

注：技能要求用 Geist / Manrope 等字体，但本项目不引外部字体与 CDN，所以字体用系统字体栈代替，等宽字体只用于数据与标签；技能的主按钮内边距是 8px / 12px，本项目为保证手机触摸目标，按钮最小高度 48px、内边距 12px / 24px。

## 结构

| 文件 | 说明 |
| --- | --- |
| `worker.js` | 入口（薄层），实际逻辑在 `src/worker.js` |
| `src/worker.js` | 路由与 API：首页、`/api/nav`、`/api/reveal`、`/api/lock`、`/api/status`、`/admin` |
| `src/config.js` | 默认导航（4 个公开链接）、校验与 SVG 图标清洗、本地语录 |
| `src/auth.js` | 管理员 Basic Auth、reveal 口令 SHA-256 比对、24 小时 reveal 会话 |
| `src/store.js` | KV 存取：`NAV_CONFIG` 导航项、`SYS_CONFIG` 语录设置 |
| `src/ui.js` | 首页与后台 HTML 外壳 |
| `src/assets.js` | 同源 CSS 与客户端 JS（`/assets/app.css`、`/assets/app.js`、`/assets/admin.js`） |
| `wrangler.toml` | Worker 配置，KV 绑定 `MY_KV` |

## 功能

- 首页：4 个公开导航（私人云盘、流媒体中心、在线题库、服务器探针），状态圆点探测（HEAD 优先、4 秒超时、60 秒缓存）。
- 语录：默认本地语录轮换，可在后台切到一言（hitokoto，失败用本地兜底）或关闭；间隔 0 为不自动轮换。
- 私密导航：点右下角锁定按钮输口令解锁，成功后发 HttpOnly 会话 Cookie（24 小时），客户端不再保存明文口令；再点右下角或点“锁定”可锁定。
- 管理后台 `/admin`：Basic Auth，增删改、上下排序、导入导出 JSON、语录设置。

## 密码（重要）

管理员密码与私密口令**不在代码和仓库里**，都是 Cloudflare Worker Secret：

```bash
wrangler secret put ADMIN_PWD    # 管理后台，用户名固定为 admin
wrangler secret put REVEAL_PWD   # 私密导航口令
```

两者缺失时对应功能直接拒绝访问，不使用任何默认值。改密码只需重新执行上面命令并重新部署（Secret 改动后新请求即生效）。

旧版 `SYS_CONFIG` 里若残留口令字段，新版读取时一律丢弃，永不回显。

## 本地开发

```bash
npm install -g wrangler   # 或 npx wrangler
cp .dev.vars.example .dev.vars   # 填入仅供本地测试的密码
npx wrangler dev --local
```

`.dev.vars` 只留在本地，不要提交。

## 部署

```bash
npx wrangler deploy
```

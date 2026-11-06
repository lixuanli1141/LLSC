# LLSC

零落山川的个人博客，部署在 https://llsc.cc。

本站基于 [heiehiehi/XinghuisamaBlogs](https://github.com/heiehiehi/XinghuisamaBlogs)（XHBlogs v0.4.1，CC BY-NC 4.0）二次开发，保留原作者署名。

## 部署

Vercel 导入本仓库，Framework 选择 Next.js，直接部署即可。

AI 猫猫助手需要设置环境变量 `GEMINI_API_KEY`（或 `OPENAI_API_KEY`）；评论需要填 `siteConfig.ts` 里的 `gitalkConfig`。

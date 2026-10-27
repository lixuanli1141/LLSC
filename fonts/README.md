# 字体（开源可商用，SIL OFL 1.1）

站内字体全部子集化后以 base64 内嵌在 `src/assets.js` 的 CSS 里同源下发，不依赖外部字体或 CDN；`font-display: swap`，加载失败时自动回落系统字体，页面不会空白、不会乱版。

| 文件 | 来源 | 用途 | 子集 |
| --- | --- | --- | --- |
| `llsc-calligraphy.woff2`（27.8 KB） | Ma Shan Zheng（马善政毛笔体），Google Fonts，https://github.com/google/fonts/tree/main/ofl/mashanzheng | 大标题“零落山川”、tagline | 70 字：标题、章节标题、tagline、hero 副标题用字 |
| `llsc-wenkai.woff2`（102.7 KB） | LXGW WenKai（霞鹜文楷）Regular v1.530，https://github.com/lxgw/LxgwWenKai/releases/tag/v1.530 | 正文、语录、卡片标题、副标题 | 521 字：站内全部界面文案、本地语录、默认导航用字 |

英文、数字、标签用系统等宽字体栈。站外用户在后台新增的导航标题若含子集外的生僻字，会自动回落系统字体显示，不会乱码。

重新生成子集（需 fonttools + brotli）：

```bash
python3 -m fontTools.subset MaShanZheng.ttf --text-file=charset-cal.txt \
  --output-file=llsc-calligraphy.woff2 --flavor=woff2 --no-hinting --desubroutinize
python3 -m fontTools.subset LXGWWenKai-Regular.ttf --text-file=charset-all.txt \
  --output-file=llsc-wenkai.woff2 --flavor=woff2 --no-hinting --desubroutinize
```

备选（未采用）：Zhi Mang Xing（Google Fonts，毛笔体），如需换标题字体可直接替换子集来源。

// 零落山川 — 默认导航配置与校验
// 注意：这里没有任何密码。管理员密码与 reveal 口令只来自 Worker Secret
//（环境变量 ADMIN_PWD / REVEAL_PWD），缺失时拒绝访问，绝不使用默认值。

export const SITE_NAME = "零落山川";
export const SITE_SUBTITLE = "LLSC // NAVIGATION HUB";
export const ADMIN_USER = "admin";
export const SESSION_TTL_SECONDS = 24 * 60 * 60; // reveal 会话 24 小时
export const MAX_ITEMS = 50;

const LINK_ICON =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
const CLOUD_ICON =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
const FILM_ICON =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>`;
const BOOK_ICON =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;
const SERVER_ICON =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>`;

export const DEFAULT_CONFIG = [
  { url: "https://drive.ing.nn.kg", title: "私人云盘", desc: "OpenList / Alist 文件管理", isPrivate: false, isHidden: false, icon: CLOUD_ICON },
  { url: "https://media.lxlhub.qzz.io", title: "流媒体中心", desc: "MoonTV 影视库", isPrivate: false, isHidden: false, icon: FILM_ICON },
  { url: "https://quiz.ing.nn.kg", title: "在线题库", desc: "自定义刷题与测试系统", isPrivate: false, isHidden: false, icon: BOOK_ICON },
  { url: "https://ops.lxlhub.qzz.io", title: "服务器探针", desc: "VPS 资源监控状态", isPrivate: false, isHidden: false, icon: SERVER_ICON },
];

export const DEFAULT_SETTINGS = { quoteInterval: 60, quoteSource: "local" }; // quoteSource: local | hitokoto | off

export const LOCAL_QUOTES = [
  "山重水复疑无路，柳暗花明又一村。",
  "会当凌绝顶，一览众山小。",
  "行到水穷处，坐看云起时。",
  "千山鸟飞绝，万径人踪灭。",
  "江流石不转，遗恨失吞吴。",
  "白日依山尽，黄河入海流。",
  "明月出天山，苍茫云海间。",
  "不识庐山真面目，只缘身在此山中。",
  "水光潋滟晴方好，山色空蒙雨亦奇。",
  "青山遮不住，毕竟东流去。",
  "两岸青山相对出，孤帆一片日边来。",
  "落霞与孤鹜齐飞，秋水共长天一色。",
];

// ---- 校验与清洗：所有写入 KV 的导航数据都经过这里 ----

const ALLOWED_ICON_TAGS = new Set(["svg", "path", "rect", "circle", "line", "polyline", "polygon", "ellipse", "g"]);
const ALLOWED_ICON_ATTRS = new Set([
  "xmlns", "viewBox", "fill", "stroke", "stroke-width", "stroke-linecap",
  "stroke-linejoin", "d", "x", "y", "width", "height", "rx", "ry",
  "x1", "x2", "y1", "y2", "points", "cx", "cy", "r",
]);

export function sanitizeIcon(raw) {
  if (typeof raw !== "string" || !raw.trim()) return LINK_ICON;
  // 只允许一小段纯 SVG，拒绝 script、事件属性、外部引用与多余标签。
  const cleaned = raw.replace(/<script[\s\S]*?<\/script>/gi, "");
  const tags = [...cleaned.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g)];
  if (!tags.length) return LINK_ICON;
  for (const [, tag, attrs] of tags) {
    if (!ALLOWED_ICON_TAGS.has(tag.toLowerCase())) return LINK_ICON;
    const attrNames = [...attrs.matchAll(/([a-zA-Z-]+)\s*=/g)].map((m) => m[1].toLowerCase());
    for (const name of attrNames) {
      if (name.startsWith("on") || name === "href" || !ALLOWED_ICON_ATTRS.has(name)) return LINK_ICON;
    }
    if (/javascript:|data:text\/html/i.test(attrs)) return LINK_ICON;
  }
  if (!/^<svg[\s\S]*<\/svg>\s*$/.test(cleaned.trim())) return LINK_ICON;
  return cleaned.trim();
}

export function validateItems(input) {
  if (!Array.isArray(input)) throw new Error("导航配置必须是数组");
  if (input.length > MAX_ITEMS) throw new Error(`导航项最多 ${MAX_ITEMS} 个`);
  return input.map((item) => {
    if (!item || typeof item !== "object") throw new Error("导航项格式错误");
    const title = String(item.title ?? "").trim();
    if (!title || title.length > 40) throw new Error("标题长度需在 1-40 字之间");
    let url;
    try {
      url = new URL(String(item.url ?? "").trim());
    } catch {
      throw new Error(`无效链接：${title}`);
    }
    if (url.protocol !== "https:") throw new Error(`链接必须是 https：${title}`);
    const desc = String(item.desc ?? "").trim().slice(0, 120);
    return {
      url: url.href,
      title,
      desc,
      isPrivate: item.isPrivate === true,
      isHidden: item.isHidden === true,
      icon: sanitizeIcon(item.icon),
    };
  });
}

export function validateSettings(input) {
  const out = { ...DEFAULT_SETTINGS };
  if (!input || typeof input !== "object") return out;
  const interval = parseInt(input.quoteInterval, 10);
  out.quoteInterval = Number.isFinite(interval) ? Math.min(Math.max(interval, 0), 3600) : DEFAULT_SETTINGS.quoteInterval;
  out.quoteSource = ["local", "hitokoto", "off"].includes(input.quoteSource) ? input.quoteSource : "local";
  return out;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

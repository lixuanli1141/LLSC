// KV 存取：NAV_CONFIG（导航项）、SYS_CONFIG（仅 quote 设置，不含任何密码）。
// 旧版 SYS_CONFIG 里若残留 revealPwd 字段，读取时一律丢弃，永不回显。

import { DEFAULT_CONFIG, DEFAULT_SETTINGS, validateItems, validateSettings } from "./config.js";

export async function loadItems(env) {
  const raw = await env.MY_KV.get("NAV_CONFIG", { cacheTtl: 60 });
  if (!raw) return [...DEFAULT_CONFIG];
  try {
    return validateItems(JSON.parse(raw));
  } catch {
    return [...DEFAULT_CONFIG];
  }
}

export async function saveItems(env, items) {
  const clean = validateItems(items);
  await env.MY_KV.put("NAV_CONFIG", JSON.stringify(clean));
  return clean;
}

export async function loadSettings(env) {
  const raw = await env.MY_KV.get("SYS_CONFIG", { cacheTtl: 60 });
  if (!raw) return { ...DEFAULT_SETTINGS };
  try {
    const parsed = JSON.parse(raw);
    delete parsed.revealPwd; // 旧版残留字段，永不使用
    return validateSettings(parsed);
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(env, settings) {
  const clean = validateSettings(settings);
  await env.MY_KV.put("SYS_CONFIG", JSON.stringify(clean));
  return clean;
}

// 导航的公开视图：隐藏项永不出现；私密项只在 reveal 会话有效时出现。
export function visibleItems(items, unlocked) {
  return items
    .map((item, idx) => ({ ...item, originalIdx: idx }))
    .filter((item) => !item.isHidden && (unlocked || !item.isPrivate));
}

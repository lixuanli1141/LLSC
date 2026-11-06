/** data/*.ts 列表文件（友链/项目/相册）的读写：保留文件头，只替换数组内容 */

export type ListKey = 'friends' | 'projects' | 'albums';

export const LIST_FILES: Record<ListKey, { path: string; constName: string; label: string }> = {
  friends: { path: 'data/friends.ts', constName: 'friendsData', label: '友链' },
  projects: { path: 'data/projects.ts', constName: 'projectsData', label: '项目' },
  albums: { path: 'data/albums.ts', constName: 'albums', label: '相册' },
};

/** 从 .ts 文件内容里抠出数组（括号配对扫描，数组里可以嵌套） */
export function parseTsArray(content: string, constName: string): unknown[] {
  const re = new RegExp(`export\\s+const\\s+${constName}[^=]*=\\s*\\[`);
  const m = re.exec(content);
  if (!m) throw new Error(`在文件里找不到 ${constName} 数组`);
  let i = m.index + m[0].length - 1; // 指向 '['
  let depth = 0;
  let inStr: string | null = null;
  let esc = false;
  for (; i < content.length; i++) {
    const c = content[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      inStr = c;
      continue;
    }
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) {
        const json = content.slice(m.index + m[0].length - 1, i + 1);
        return JSON.parse(json) as unknown[];
      }
    }
  }
  throw new Error(`${constName} 数组括号不匹配`);
}

/** 把数组写回 .ts 文件，保留原文件头（注释 + 类型定义） */
export function renderTsFile(original: string, constName: string, items: unknown[]): string {
  const re = new RegExp(`(export\\s+const\\s+${constName}[^=]*=\\s*)\\[[\\s\\S]*\\];?`);
  if (!re.test(original)) throw new Error(`在文件里找不到 ${constName} 数组`);
  return original.replace(re, `$1${JSON.stringify(items, null, 2)};`);
}

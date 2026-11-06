/** 后台管理的 Markdown 栏目定义：目录 + frontmatter 字段 */

export type CollectionKey = 'posts' | 'chatters' | 'moments';

export interface CollectionDef {
  key: CollectionKey;
  dir: string;
  label: string;
  /** 新建时的默认 slug 生成方式 */
  slugHint: string;
}

export const COLLECTIONS: Record<CollectionKey, CollectionDef> = {
  posts: { key: 'posts', dir: 'posts', label: '文章', slugHint: '比如 hello-llsc' },
  chatters: { key: 'chatters', dir: 'chatters', label: '碎碎念', slugHint: '比如 2026-11-06-随想' },
  moments: { key: 'moments', dir: 'moments', label: '动态', slugHint: '自动生成 moment-时间戳' },
};

export const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

const q = (s: string) => JSON.stringify(s ?? '');

function tagsLine(tags: string[]): string {
  return `tags: [${tags.map((t) => q(t)).join(', ')}]`;
}

/** 各栏目的 frontmatter + 正文拼成完整 md */
export function buildMarkdown(
  collection: CollectionKey,
  fields: Record<string, unknown>,
  content: string,
): string {
  const lines: string[] = ['---'];
  if (collection === 'posts') {
    lines.push(`title: ${q(String(fields.title || ''))}`);
    lines.push(`date: ${q(String(fields.date || ''))}`);
    lines.push(`description: ${q(String(fields.description || ''))}`);
    lines.push(`cover: ${q(String(fields.cover || '/cover.svg'))}`);
    lines.push(tagsLine((fields.tags as string[]) || []));
  } else if (collection === 'chatters') {
    lines.push(`title: ${q(String(fields.title || ''))}`);
    lines.push(`date: ${q(String(fields.date || ''))}`);
    lines.push(tagsLine((fields.tags as string[]) || []));
    lines.push(`mood: ${q(String(fields.mood || ''))}`);
    lines.push(`cover: ${q(String(fields.cover || ''))}`);
    lines.push(`description: ${q(String(fields.description || ''))}`);
  } else {
    // moments
    lines.push(`id: ${q(String(fields.id || ''))}`);
    lines.push(`date: ${q(String(fields.date || ''))}`);
    lines.push(`location: ${q(String(fields.location || ''))}`);
    const images = (fields.images as string[]) || [];
    if (images.length === 0) {
      lines.push('images: []');
    } else {
      lines.push('images:');
      for (const u of images) lines.push(`  - ${q(u)}`);
    }
  }
  lines.push('---', '');
  lines.push((content || '').replace(/\r\n/g, '\n'));
  lines.push('');
  return lines.join('\n');
}

/** 从 gray-matter 解析结果里取各栏目的字段 */
export function fieldsFromData(collection: CollectionKey, data: Record<string, unknown>): Record<string, unknown> {
  const str = (k: string) => String((data as Record<string, unknown>)[k] ?? '');
  const arr = (k: string) => {
    const v = (data as Record<string, unknown>)[k];
    return Array.isArray(v) ? v.map(String) : [];
  };
  if (collection === 'posts') {
    return { title: str('title'), date: str('date'), description: str('description'), cover: str('cover') || '/cover.svg', tags: arr('tags') };
  }
  if (collection === 'chatters') {
    return { title: str('title'), date: str('date'), tags: arr('tags'), mood: str('mood'), cover: str('cover'), description: str('description') };
  }
  return { id: str('id'), date: str('date'), location: str('location'), images: arr('images') };
}

/** 新建动态时的 id/文件名 */
export function newMomentId(): string {
  return `moment-${Date.now()}`;
}

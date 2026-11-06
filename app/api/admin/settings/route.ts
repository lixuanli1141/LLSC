import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin, err } from '@/lib/admin-api';
import { getTextFile, saveTextFile } from '@/lib/github-admin';

const PATH = 'siteConfig.ts';

/** 单行字符串字段：键名 -> 在文件里的正则 */
const STRING_FIELDS = [
  'bio',
  'chatterTitle',
  'chatterDescription',
  'defaultPostCover',
  'photoWallImage',
] as const;

const SOCIAL_FIELDS = ['github', 'gitee', 'google', 'email', 'qq', 'wechat'] as const;

function readString(content: string, key: string): string {
  const m = new RegExp(`^\\s*${key}:\\s*("(?:[^"\\\\]|\\\\.)*")`, 'm').exec(content);
  if (!m) return '';
  try {
    return JSON.parse(m[1]) as string;
  } catch {
    return '';
  }
}

function readDanmaku(content: string): string[] {
  const m = /danmakuList:\s*(\[[^\]]*\])/m.exec(content);
  if (!m) return [];
  try {
    return JSON.parse(m[1]) as string[];
  } catch {
    return [];
  }
}

function readIdList(content: string, key: string): string[] {
  const m = new RegExp(`${key}:\\s*(\\[[^\\]]*\\])`, 'm').exec(content);
  if (!m) return [];
  try {
    const v = JSON.parse(m[1]) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

function replaceString(content: string, key: string, value: string): string {
  const re = new RegExp(`(^\\s*${key}:\\s*)("(?:[^"\\\\]|\\\\.)*")`, 'm');
  if (!re.test(content)) throw new Error(`在 siteConfig.ts 里找不到 ${key}`);
  return content.replace(re, `$1${JSON.stringify(value)}`);
}

/** GET /api/admin/settings -> 网站设置 */
export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  try {
    const { content } = await getTextFile(PATH);
    const social: Record<string, string> = {};
    for (const k of SOCIAL_FIELDS) social[k] = readString(content, k);
    const settings: Record<string, unknown> = { social, danmaku: readDanmaku(content), cloudMusicIds: readIdList(content, 'cloudMusicIds') };
    for (const k of STRING_FIELDS) settings[k] = readString(content, k);
    return NextResponse.json({ ok: true, settings });
  } catch (e) {
    return err(e);
  }
}

/** POST /api/admin/settings -> 只改传来的字段 */
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式不对' }, { status: 400 });
  }
  try {
    const { content, sha } = await getTextFile(PATH);
    let next = content;
    for (const k of STRING_FIELDS) {
      if (typeof body[k] === 'string') next = replaceString(next, k, body[k] as string);
    }
    if (body.social && typeof body.social === 'object') {
      const social = body.social as Record<string, unknown>;
      for (const k of SOCIAL_FIELDS) {
        if (typeof social[k] === 'string') next = replaceString(next, k, social[k] as string);
      }
    }
    if (Array.isArray(body.danmaku)) {
      const arr = (body.danmaku as unknown[]).map(String).filter(Boolean);
      if (!/danmakuList:\s*\[[^\]]*\]/m.test(next)) throw new Error('在 siteConfig.ts 里找不到 danmakuList');
      next = next.replace(/danmakuList:\s*\[[^\]]*\]/m, `danmakuList: ${JSON.stringify(arr)}`);
    }
    if (Array.isArray(body.cloudMusicIds)) {
      const arr = (body.cloudMusicIds as unknown[]).map(String).filter(Boolean);
      if (!/cloudMusicIds:\s*\[[^\]]*\]/m.test(next)) throw new Error('在 siteConfig.ts 里找不到 cloudMusicIds');
      next = next.replace(/cloudMusicIds:\s*\[[^\]]*\]/m, `cloudMusicIds: ${JSON.stringify(arr)}`);
    }
    if (next === content) return NextResponse.json({ ok: true, changed: false });
    await saveTextFile(PATH, next, sha, '更新网站设置');
    return NextResponse.json({ ok: true, changed: true });
  } catch (e) {
    return err(e);
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin, err } from '@/lib/admin-api';
import { getTextFile, saveTextFile } from '@/lib/github-admin';
import { LIST_FILES, parseTsArray, renderTsFile, type ListKey } from '@/lib/admin-lists';

function listOf(req: NextRequest): ListKey | null {
  const t = req.nextUrl.searchParams.get('type');
  if (t === 'friends' || t === 'projects' || t === 'albums') return t;
  return null;
}

/** GET /api/admin/lists?type=friends -> 该列表的全部条目 */
export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const key = listOf(req);
  if (!key) return NextResponse.json({ ok: false, error: '列表不对' }, { status: 400 });
  const def = LIST_FILES[key];
  try {
    const { content } = await getTextFile(def.path);
    const items = parseTsArray(content, def.constName);
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return err(e);
  }
}

/** POST /api/admin/lists {type, items} -> 整个列表写回文件 */
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  let body: { type?: string; items?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式不对' }, { status: 400 });
  }
  const key = body.type;
  if (key !== 'friends' && key !== 'projects' && key !== 'albums') {
    return NextResponse.json({ ok: false, error: '列表不对' }, { status: 400 });
  }
  if (!Array.isArray(body.items)) {
    return NextResponse.json({ ok: false, error: '内容不对' }, { status: 400 });
  }
  const def = LIST_FILES[key];
  try {
    const { content, sha } = await getTextFile(def.path);
    const next = renderTsFile(content, def.constName, body.items);
    await saveTextFile(def.path, next, sha, `更新${def.label}列表`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return err(e);
  }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import matter from 'gray-matter';
import { requireAdmin, err } from '@/lib/admin-api';
import { listMdFiles, getTextFile, saveTextFile, deleteTextFile } from '@/lib/github-admin';
import { COLLECTIONS, SLUG_RE, buildMarkdown, fieldsFromData, newMomentId, type CollectionKey } from '@/lib/admin-collections';

function collectionOf(req: NextRequest): CollectionKey | null {
  const c = req.nextUrl.searchParams.get('collection');
  if (c === 'posts' || c === 'chatters' || c === 'moments' || c === 'drafts') return c;
  return null;
}

/** GET /api/admin/items?collection=posts -> 列表；再加 slug=xxx -> 单篇 */
export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const collection = collectionOf(req);
  if (!collection) return NextResponse.json({ ok: false, error: '栏目不对' }, { status: 400 });
  const def = COLLECTIONS[collection];
  const slug = req.nextUrl.searchParams.get('slug');
  try {
    if (slug) {
      if (!SLUG_RE.test(slug)) return NextResponse.json({ ok: false, error: '链接名不合法' }, { status: 400 });
      const { content, sha } = await getTextFile(`${def.dir}/${slug}.md`);
      const parsed = matter(content);
      return NextResponse.json({
        ok: true,
        item: { slug, sha, ...fieldsFromData(collection, parsed.data as Record<string, unknown>), content: parsed.content.replace(/^\n+/, '') },
      });
    }
    const files = await listMdFiles(def.dir);
    const items: Array<{ slug: string; sha: string; title: string; date: string }> = [];
    for (const f of files) {
      const slugName = f.name.replace(/\.md$/, '');
      try {
        const { content } = await getTextFile(`${def.dir}/${slugName}.md`);
        const parsed = matter(content);
        const d = parsed.data as Record<string, unknown>;
        items.push({
          slug: slugName,
          sha: f.sha,
          title: String(d.title || d.id || slugName),
          date: String(d.date || ''),
        });
      } catch {
        items.push({ slug: slugName, sha: f.sha, title: slugName, date: '' });
      }
    }
    items.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return NextResponse.json({ ok: true, items });
  } catch (e) {
    return err(e);
  }
}

/** POST /api/admin/items -> 新建或更新 */
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式不对' }, { status: 400 });
  }
  const collection = body.collection;
  if (collection !== 'posts' && collection !== 'chatters' && collection !== 'moments' && collection !== 'drafts') {
    return NextResponse.json({ ok: false, error: '栏目不对' }, { status: 400 });
  }
  const def = COLLECTIONS[collection];
  let slug = String(body.slug || '').trim();
  if (collection === 'moments' && !slug) {
    slug = newMomentId();
    body.id = slug;
  }
  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ ok: false, error: '链接名只能用小写字母、数字和 -，开头要是字母或数字' }, { status: 400 });
  }
  if ((collection === 'posts' || collection === 'chatters' || collection === 'drafts') && !String(body.title || '').trim()) {
    return NextResponse.json({ ok: false, error: '标题不能为空' }, { status: 400 });
  }
  const fields: Record<string, unknown> = { ...body };
  if (typeof fields.tags === 'string') {
    fields.tags = String(fields.tags).split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
  }
  if (typeof fields.images === 'string') {
    fields.images = String(fields.images).split('\n').map((t) => t.trim()).filter(Boolean);
  }
  const md = buildMarkdown(collection, fields, String(body.content || ''));
  try {
    const isUpdate = !!body.sha;
    await saveTextFile(`${def.dir}/${slug}.md`, md, (body.sha as string) || null, isUpdate ? `更新${def.label} ${slug}` : `新建${def.label} ${slug}`);
    return NextResponse.json({ ok: true, slug, updated: isUpdate });
  } catch (e) {
    return err(e);
  }
}

/** DELETE /api/admin/items?collection=posts&slug=xxx&sha=yyy */
export async function DELETE(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const collection = collectionOf(req);
  if (!collection) return NextResponse.json({ ok: false, error: '栏目不对' }, { status: 400 });
  const def = COLLECTIONS[collection];
  const slug = req.nextUrl.searchParams.get('slug') || '';
  const sha = req.nextUrl.searchParams.get('sha') || '';
  if (!SLUG_RE.test(slug) || !sha) {
    return NextResponse.json({ ok: false, error: '参数不对' }, { status: 400 });
  }
  try {
    await deleteTextFile(`${def.dir}/${slug}.md`, sha, `删除${def.label} ${slug}`);
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return err(e);
  }
}

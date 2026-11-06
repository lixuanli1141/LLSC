import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import matter from 'gray-matter';
import { ADMIN_COOKIE, isValidSession, adminConfigured } from '@/lib/admin-auth';
import { listPostFiles, getPostFile, savePostFile, deletePostFile, githubReady } from '@/lib/github-admin';

function authed(req: NextRequest): boolean {
  return isValidSession(req.cookies.get(ADMIN_COOKIE)?.value);
}

function needAuth(req: NextRequest): NextResponse | null {
  if (!adminConfigured() || !githubReady()) {
    return NextResponse.json({ ok: false, error: '后台还没配置好（缺少环境变量）' }, { status: 503 });
  }
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: '没登录' }, { status: 401 });
  }
  return null;
}

const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/;

function buildMarkdown(front: { title: string; date: string; description: string; cover: string; tags: string[] }, content: string): string {
  const q = (s: string) => JSON.stringify(s);
  const lines = [
    '---',
    `title: ${q(front.title)}`,
    `date: ${q(front.date)}`,
    `description: ${q(front.description)}`,
    `cover: ${q(front.cover || '/cover.svg')}`,
    `tags: [${front.tags.map((t) => q(t)).join(', ')}]`,
    '---',
    '',
    content.replace(/\r\n/g, '\n'),
    '',
  ];
  return lines.join('\n');
}

/** GET /api/admin/posts -> 文章列表；?slug=xxx -> 单篇正文 */
export async function GET(req: NextRequest) {
  const guard = needAuth(req);
  if (guard) return guard;
  const slug = req.nextUrl.searchParams.get('slug');
  try {
    if (slug) {
      if (!SLUG_RE.test(slug)) return NextResponse.json({ ok: false, error: 'slug 不合法' }, { status: 400 });
      const { content, sha } = await getPostFile(slug);
      const parsed = matter(content);
      return NextResponse.json({
        ok: true,
        post: {
          slug,
          sha,
          title: String(parsed.data.title || ''),
          date: String(parsed.data.date || ''),
          description: String(parsed.data.description || ''),
          cover: String(parsed.data.cover || '/cover.svg'),
          tags: Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : [],
          content: parsed.content.replace(/^\n+/, ''),
        },
      });
    }
    const files = await listPostFiles();
    const posts: Array<{ slug: string; sha: string; title: string; date: string }> = [];
    for (const f of files) {
      const slugName = f.name.replace(/\.md$/, '');
      try {
        const { content } = await getPostFile(slugName);
        const parsed = matter(content);
        posts.push({ slug: slugName, sha: f.sha, title: String(parsed.data.title || slugName), date: String(parsed.data.date || '') });
      } catch {
        posts.push({ slug: slugName, sha: f.sha, title: slugName, date: '' });
      }
    }
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    return NextResponse.json({ ok: true, posts });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : '读取失败' }, { status: 500 });
  }
}

/** POST /api/admin/posts -> 新建或更新文章 */
export async function POST(req: NextRequest) {
  const guard = needAuth(req);
  if (guard) return guard;
  let body: { slug?: string; title?: string; date?: string; description?: string; cover?: string; tags?: string[]; content?: string; sha?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式不对' }, { status: 400 });
  }
  const slug = (body.slug || '').trim();
  const title = (body.title || '').trim();
  if (!SLUG_RE.test(slug)) return NextResponse.json({ ok: false, error: 'slug 只能用小写字母、数字和 -，开头要是字母或数字' }, { status: 400 });
  if (!title) return NextResponse.json({ ok: false, error: '标题不能为空' }, { status: 400 });
  const md = buildMarkdown(
    {
      title,
      date: (body.date || '').trim(),
      description: (body.description || '').trim(),
      cover: (body.cover || '').trim(),
      tags: (body.tags || []).map((t) => String(t).trim()).filter(Boolean),
    },
    body.content || '',
  );
  try {
    const isUpdate = !!body.sha;
    await savePostFile(slug, md, body.sha || null, isUpdate ? `更新文章 ${slug}` : `新建文章 ${slug}`);
    return NextResponse.json({ ok: true, slug, updated: isUpdate });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : '保存失败' }, { status: 500 });
  }
}

/** DELETE /api/admin/posts?slug=xxx&sha=yyy */
export async function DELETE(req: NextRequest) {
  const guard = needAuth(req);
  if (guard) return guard;
  const slug = req.nextUrl.searchParams.get('slug') || '';
  const sha = req.nextUrl.searchParams.get('sha') || '';
  if (!SLUG_RE.test(slug) || !sha) {
    return NextResponse.json({ ok: false, error: '参数不对' }, { status: 400 });
  }
  try {
    await deletePostFile(slug, sha);
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : '删除失败' }, { status: 500 });
  }
}

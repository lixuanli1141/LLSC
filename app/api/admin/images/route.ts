import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin, err } from '@/lib/admin-api';
import { listImages, saveBinaryFile, deleteTextFile } from '@/lib/github-admin';

const DIR = 'public/images';
const NAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(png|jpe?g|gif|webp|svg|avif)$/i;

/** GET /api/admin/images -> public/images 里的图片 */
export async function GET(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  try {
    const files = await listImages();
    return NextResponse.json({
      ok: true,
      images: files.map((f) => ({ name: f.name, sha: f.sha, url: `/images/${encodeURIComponent(f.name)}` })),
    });
  } catch (e) {
    return err(e);
  }
}

/** POST /api/admin/images {name, data} -> 上传一张图片（data 为 base64，不带前缀） */
export async function POST(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  let body: { name?: string; data?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式不对' }, { status: 400 });
  }
  const name = (body.name || '').trim();
  const data = (body.data || '').replace(/^data:[^;]+;base64,/, '');
  if (!NAME_RE.test(name)) {
    return NextResponse.json({ ok: false, error: '文件名不对，只能用字母、数字、- _ .，且要是图片格式' }, { status: 400 });
  }
  if (!data || data.length < 10) {
    return NextResponse.json({ ok: false, error: '图片数据不对' }, { status: 400 });
  }
  if (data.length > 12 * 1024 * 1024) {
    return NextResponse.json({ ok: false, error: '图片太大了，控制在 9MB 以内' }, { status: 400 });
  }
  try {
    await saveBinaryFile(`${DIR}/${name}`, data, null, `上传图片 ${name}`);
    return NextResponse.json({ ok: true, name, url: `/images/${encodeURIComponent(name)}` });
  } catch (e) {
    return err(e);
  }
}

/** DELETE /api/admin/images?name=xxx&sha=yyy */
export async function DELETE(req: NextRequest) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const name = req.nextUrl.searchParams.get('name') || '';
  const sha = req.nextUrl.searchParams.get('sha') || '';
  if (!NAME_RE.test(name) || !sha) {
    return NextResponse.json({ ok: false, error: '参数不对' }, { status: 400 });
  }
  try {
    await deleteTextFile(`${DIR}/${name}`, sha, `删除图片 ${name}`);
    return NextResponse.json({ ok: true, name });
  } catch (e) {
    return err(e);
  }
}

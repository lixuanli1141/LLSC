import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, adminConfigured, isValidSession, passwordMatches, makeSessionValue } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: '后台还没配置好（缺少环境变量）' }, { status: 503 });
  }
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式不对' }, { status: 400 });
  }
  if (!passwordMatches(body.password || '')) {
    return NextResponse.json({ ok: false, error: '密码不对' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeSessionValue(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function GET(req: NextRequest) {
  // 让前端判断当前是否已登录
  const ok = isValidSession(req.cookies.get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ ok, configured: adminConfigured() });
}

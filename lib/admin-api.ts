import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_COOKIE, isValidSession, adminConfigured } from '@/lib/admin-auth';
import { githubReady } from '@/lib/github-admin';

/** 未登录或未配置时返回错误响应，否则返回 null 继续处理 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!adminConfigured() || !githubReady()) {
    return NextResponse.json({ ok: false, error: '后台还没配置好（缺少环境变量）' }, { status: 503 });
  }
  if (!isValidSession(req.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ ok: false, error: '没登录' }, { status: 401 });
  }
  return null;
}

export function err(e: unknown): NextResponse {
  return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : '操作失败' }, { status: 500 });
}

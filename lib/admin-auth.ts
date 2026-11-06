import { createHash, createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE = 'llsc_admin';
const SESSION_LABEL = 'llsc-admin-session';

function sha256(s: string): Buffer {
  return createHash('sha256').update(s).digest();
}

/** timing-safe password check against ADMIN_PASSWORD */
export function passwordMatches(input: string): boolean {
  const expected = (process.env.ADMIN_PASSWORD || '').trim();
  if (!expected) return false;
  const a = sha256(input);
  const b = sha256(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** stateless session cookie value: 1.<hmac(secret, label)> */
export function makeSessionValue(): string {
  const secret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  const h = createHmac('sha256', secret || 'unset').update(SESSION_LABEL).digest('hex');
  return `1.${h}`;
}

export function isValidSession(value: string | undefined | null): boolean {
  if (!value) return false;
  const secret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (!secret) return false;
  const expected = createHmac('sha256', secret).update(SESSION_LABEL).digest('hex');
  const [flag, h] = value.split('.');
  if (flag !== '1' || !h) return false;
  const a = Buffer.from(h);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminConfigured(): boolean {
  return !!(process.env.ADMIN_PASSWORD || '').trim()
    && !!(process.env.ADMIN_SESSION_SECRET || '').trim()
    && !!(process.env.GITHUB_TOKEN || '').trim();
}

import {
  createDailyAccessCode,
  getChinaDateKey,
  safeCodeEqual,
} from './_access-code.js';
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
} from './_session.js';
import process from 'node:process';

export default function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ valid: false, message: 'Method not allowed' });
  }

  const requestHost = request.headers['x-forwarded-host'] || request.headers.host;
  const requestOrigin = request.headers.origin;
  const fetchSite = request.headers['sec-fetch-site'];
  let originMatchesHost = true;
  if (requestOrigin && requestHost) {
    try {
      originMatchesHost = new URL(requestOrigin).host === requestHost;
    } catch {
      originMatchesHost = false;
    }
  }
  if (fetchSite === 'cross-site' || !originMatchesHost) {
    return response.status(403).json({ valid: false, message: '跨站请求已拒绝。' });
  }

  const secret = process.env.SITE_ACCESS_SECRET;
  if (!secret) {
    console.error('SITE_ACCESS_SECRET is not configured');
    return response.status(503).json({
      valid: false,
      message: '暗号验证服务尚未配置，请联系 Helen。',
    });
  }

  const submittedCode = request.body?.code;
  if (typeof submittedCode !== 'string' || submittedCode.length > 64) {
    return response.status(400).json({ valid: false, message: '请输入有效暗号。' });
  }

  const now = new Date();
  const todayKey = getChinaDateKey(now);
  const prefix = process.env.ACCESS_CODE_PREFIX || 'HQ';
  const expectedCode = createDailyAccessCode(secret, todayKey, prefix);
  const valid = safeCodeEqual(submittedCode, expectedCode);

  if (!valid) {
    return response.status(401).json({ valid: false, message: '暗号不正确，请重新输入。' });
  }

  const session = createSessionToken(secret, now);
  response.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(session.token)}; Path=/; Max-Age=${SESSION_TTL_SECONDS}; HttpOnly; Secure; SameSite=Strict`,
  );
  return response.status(200).json({ valid: true, expiresAt: session.expiresAt });
}

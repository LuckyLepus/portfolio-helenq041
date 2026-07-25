import { next, rewrite } from '@vercel/functions';
import process from 'node:process';
import {
  readCookie,
  SESSION_COOKIE,
  verifySessionToken,
} from './api/_session.js';

const PRIVATE_HEADERS = {
  'Cache-Control': 'private, no-store',
  'Content-Security-Policy': "frame-ancestors 'none'",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

const PUBLIC_HEADERS = {
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

const PUBLIC_PATHS = new Set([
  '/unlock.html',
  '/api/unlock',
  '/api/logout',
  '/robots.txt',
  '/llms.txt',
  '/ai-index.md',
  '/resume.md',
  '/portfolio-index.md',
  '/services.md',
  '/sitemap.xml',
  '/favicon.svg',
]);

export const config = {
  runtime: 'nodejs',
  matcher: '/(.*)',
};

export default function middleware(request) {
  const requestedUrl = new URL(request.url);
  if (PUBLIC_PATHS.has(requestedUrl.pathname)) {
    return next({ headers: PUBLIC_HEADERS });
  }

  const secret = process.env.SITE_ACCESS_SECRET;
  const token = readCookie(request.headers.get('cookie'), SESSION_COOKIE);

  if (verifySessionToken(token, secret)) {
    return next({ headers: PRIVATE_HEADERS });
  }

  const unlockUrl = new URL('/unlock.html', request.url);
  unlockUrl.searchParams.set('next', `${requestedUrl.pathname}${requestedUrl.search}`);
  return rewrite(unlockUrl, { headers: PRIVATE_HEADERS });
}

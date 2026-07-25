import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createDailyAccessCode,
  getChinaDateKey,
  safeCodeEqual,
} from '../api/_access-code.js';
import {
  createSessionToken,
  readCookie,
  SESSION_COOKIE,
  verifySessionToken,
} from '../api/_session.js';
import { getAuthorizedHeaders } from '../middleware.js';

const secret = 'test-secret-that-is-long-enough-and-never-used-in-production';

test('daily access codes are deterministic per China calendar day', () => {
  const now = new Date('2026-07-25T12:00:00.000Z');
  const dateKey = getChinaDateKey(now);
  const code = createDailyAccessCode(secret, dateKey, 'HQ');
  assert.equal(code, createDailyAccessCode(secret, dateKey, 'HQ'));
  assert.match(code, /^HQ-[A-Z2-9]{6}$/);
  assert.equal(safeCodeEqual(code.toLowerCase(), code), true);
});

test('session token accepts a valid token and rejects expiry or tampering', () => {
  const issuedAt = new Date('2026-07-25T12:00:00.000Z');
  const session = createSessionToken(secret, issuedAt);
  assert.equal(verifySessionToken(session.token, secret, issuedAt), true);
  assert.equal(
    verifySessionToken(session.token, secret, new Date('2026-07-25T17:00:00.000Z')),
    false,
  );
  assert.equal(verifySessionToken(`${session.token}x`, secret, issuedAt), false);
  assert.equal(verifySessionToken(session.token, 'different-secret', issuedAt), false);
});

test('cookie parser reads only the exact session cookie', () => {
  const token = 'v1.123.signature';
  const header = `theme=dark; ${SESSION_COOKIE}=${encodeURIComponent(token)}; other=1`;
  assert.equal(readCookie(header, SESSION_COOKIE), token);
  assert.equal(readCookie(header, 'missing'), undefined);
});

test('only podcast assets may be embedded by the same origin', () => {
  const podcastHeaders = getAuthorizedHeaders('/podcast/index.html');
  const portfolioHeaders = getAuthorizedHeaders('/project/06');

  assert.equal(podcastHeaders['X-Frame-Options'], 'SAMEORIGIN');
  assert.equal(podcastHeaders['Content-Security-Policy'], "frame-ancestors 'self'");
  assert.equal(
    podcastHeaders['Permissions-Policy'],
    'camera=(), microphone=(), geolocation=()',
  );
  assert.equal(portfolioHeaders['X-Frame-Options'], 'DENY');
  assert.equal(portfolioHeaders['Content-Security-Policy'], "frame-ancestors 'none'");
});

test('camera permission is scoped to the authenticated Backrooms lab path', () => {
  const cameraLabHeaders = getAuthorizedHeaders('/lab/backrooms/index.html');
  const storybookHeaders = getAuthorizedHeaders('/lab/storybook/index.html');
  const portfolioHeaders = getAuthorizedHeaders('/project/06');

  assert.equal(
    cameraLabHeaders['Permissions-Policy'],
    'camera=(self), microphone=(), geolocation=()',
  );
  assert.equal(
    storybookHeaders['Permissions-Policy'],
    'camera=(), microphone=(), geolocation=()',
  );
  assert.equal(
    portfolioHeaders['Permissions-Policy'],
    'camera=(), microphone=(), geolocation=()',
  );
  assert.equal(cameraLabHeaders['X-Frame-Options'], 'DENY');
});

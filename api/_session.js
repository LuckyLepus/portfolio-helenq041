import { createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';

export const SESSION_COOKIE = 'helenq_session';
export const SESSION_TTL_SECONDS = 4 * 60 * 60;

function signatureFor(secret, payload) {
  return createHmac('sha256', secret).update(`session:${payload}`).digest('base64url');
}

export function createSessionToken(secret, now = new Date()) {
  if (!secret) {
    throw new Error('SITE_ACCESS_SECRET is required');
  }
  const expiresAt = Math.floor(now.getTime() / 1000) + SESSION_TTL_SECONDS;
  const payload = `v1.${expiresAt}`;
  return {
    token: `${payload}.${signatureFor(secret, payload)}`,
    expiresAt: new Date(expiresAt * 1000).toISOString(),
  };
}

export function verifySessionToken(token, secret, now = new Date()) {
  if (typeof token !== 'string' || !secret) {
    return false;
  }

  const [version, rawExpiry, signature, ...extra] = token.split('.');
  if (version !== 'v1' || extra.length > 0 || !/^\d+$/.test(rawExpiry || '')) {
    return false;
  }

  const expiresAt = Number(rawExpiry);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= Math.floor(now.getTime() / 1000)) {
    return false;
  }

  const expected = Buffer.from(signatureFor(secret, `${version}.${rawExpiry}`));
  const supplied = Buffer.from(signature || '');
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function readCookie(cookieHeader, name) {
  if (!cookieHeader) {
    return undefined;
  }

  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    if (key === name) {
      return decodeURIComponent(part.slice(separator + 1).trim());
    }
  }
  return undefined;
}

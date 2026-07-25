import { createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

export function getChinaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function createDailyAccessCode(secret, dateKey, prefix = 'HQ') {
  if (!secret) {
    throw new Error('SITE_ACCESS_SECRET is required');
  }

  const digest = createHmac('sha256', secret).update(`helenq:${dateKey}`).digest();
  let code = '';
  for (let index = 0; index < CODE_LENGTH; index += 1) {
    code += CODE_ALPHABET[digest[index] % CODE_ALPHABET.length];
  }
  return `${prefix}-${code}`;
}

export function safeCodeEqual(input, expected) {
  const left = Buffer.from(String(input).trim().toUpperCase());
  const right = Buffer.from(String(expected).trim().toUpperCase());
  return left.length === right.length && timingSafeEqual(left, right);
}

export function getChinaDayExpiry(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1) - 8 * 60 * 60 * 1000).toISOString();
}

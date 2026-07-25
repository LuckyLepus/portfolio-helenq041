import { createDailyAccessCode, getChinaDateKey, getChinaDayExpiry } from '../api/_access-code.js';

const secret = process.env.SITE_ACCESS_SECRET;
if (!secret) {
  console.error('缺少 SITE_ACCESS_SECRET。请在 .env.local 中设置与 Vercel 相同的私密种子。');
  process.exitCode = 1;
} else {
  const dateKey = getChinaDateKey();
  const prefix = process.env.ACCESS_CODE_PREFIX || 'HQ';
  console.log(`今日日期（北京时间）：${dateKey}`);
  console.log(`今日暗号：${createDailyAccessCode(secret, dateKey, prefix)}`);
  console.log(`有效期至：${getChinaDayExpiry(dateKey)}`);
}

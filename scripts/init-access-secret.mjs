import { randomBytes } from 'node:crypto';
import { access, writeFile } from 'node:fs/promises';

const envPath = new URL('../.env.local', import.meta.url);

try {
  await access(envPath);
  console.log('.env.local already exists; no changes made.');
} catch {
  const secret = randomBytes(48).toString('base64url');
  await writeFile(
    envPath,
    `SITE_ACCESS_SECRET=${secret}\nACCESS_CODE_PREFIX=HQ\n`,
    { encoding: 'utf8', flag: 'wx', mode: 0o600 },
  );
  console.log('Created .env.local with a cryptographically random access secret.');
}

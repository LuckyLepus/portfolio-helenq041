import { rm } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const distRoot = resolve('dist');
const target = resolve(distRoot, 'project06');

if (!target.startsWith(`${distRoot}${sep}`)) {
  throw new Error(`Refusing to remove path outside dist: ${target}`);
}

await rm(target, { recursive: true, force: true });
console.log('Removed private experiment bundle from production output.');

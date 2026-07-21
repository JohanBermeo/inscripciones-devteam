import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve('./dist');
const CLIENT_ASSETS = resolve('./dist/client');
const SOURCEMAP = '.map';

const SECRET_PATTERNS = [
  /TURSO_AUTH_TOKEN=[A-Za-z0-9_-]{40,}/,
  /CSRF_SECRET=[A-Za-z0-9_-]{32,}/,
  /IP_HASH_SALT=[A-Za-z0-9_-]{16,}/,
  /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
];

let issues = 0;

function isClientBundle(path: string): boolean {
  return path.startsWith(CLIENT_ASSETS);
}

function scanFile(filePath: string) {
  const content = readFileSync(filePath, 'utf-8');

  for (const pattern of SECRET_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      console.error(`❌ Secreto filtrado en: ${filePath}`);
      console.error(`   Match: ${match[0].substring(0, 40)}...`);
      issues++;
    }
  }

  if (filePath.endsWith(SOURCEMAP)) {
    const relativePath = filePath.replace(DIST, 'dist');
    const source = filePath.replace('.map', '');
    if (existsSync(source) || source.endsWith('.mjs')) {
      console.error(`❌ Sourcemap en output: ${relativePath}`);
      issues++;
    }
  }
}

function walkDir(dir: string) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile() && !entry.name.startsWith('.')) {
      scanFile(fullPath);
    }
  }
}

console.log('🔍 Escaneando secretos (valores reales) y sourcemaps...');
walkDir(DIST);

if (issues === 0) {
  console.log('✅ Audit: 0 secretos filtrados, 0 sourcemaps en output');
} else {
  console.error(`❌ Audit falló: ${issues} problema(s)`);
  process.exit(1);
}

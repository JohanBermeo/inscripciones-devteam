import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { env } from '../src/lib/env';

const db = createClient({
  url: env.TURSO_DATABASE_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

const schemaPath = resolve('./src/lib/db/schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

async function main() {
  console.log('📦 Initializing database...');
  
  const statements = schema
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  for (const stmt of statements) {
    await db.execute(stmt + ';');
    console.log(`  ✓ Executed: ${stmt.substring(0, 60)}...`);
  }

  console.log('✅ Database initialized successfully');
}

main().catch((err) => {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
});

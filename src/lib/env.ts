import { z } from 'zod';
import { config } from 'dotenv';
config();

const envSchema = z.object({
  TURSO_DATABASE_URL: z.string().url().refine(u => u.startsWith('libsql://'), {
    message: 'TURSO_DATABASE_URL debe comenzar con libsql://',
  }),
  TURSO_AUTH_TOKEN: z.string().min(32, 'TURSO_AUTH_TOKEN debe tener al menos 32 caracteres'),

  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET debe tener al menos 32 caracteres'),
  IP_HASH_SALT: z.string().min(16, 'IP_HASH_SALT debe tener al menos 16 caracteres'),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000),

  FORM_DEADLINE: z.string().datetime({ offset: true }),

  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

function parseEnv() {
  if (typeof process === 'undefined' || typeof process.env === 'undefined') {
    console.error('❌ process.env no está disponible en este contexto');
    process.exit(1);
  }

  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Variables de entorno inválidas:');
    for (const issue of result.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

export const env = parseEnv();
export const FORM_DEADLINE = new Date(env.FORM_DEADLINE);
export const isFormOpen = (): boolean => new Date() <= FORM_DEADLINE;


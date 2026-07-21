import { describe, it, expect, beforeAll } from 'vitest';

describe('env validation', () => {
  beforeAll(() => {
    process.env.TURSO_DATABASE_URL = 'libsql://test.turso.io';
    process.env.TURSO_AUTH_TOKEN = 'a'.repeat(32);
    process.env.CSRF_SECRET = 'a'.repeat(32);
    process.env.IP_HASH_SALT = 'test-salt-16-chars!';
    process.env.FORM_DEADLINE = '2025-08-08T23:59:59-05:00';
    process.env.NODE_ENV = 'test';
  });

  it('parses env vars correctly', async () => {
    const { env } = await import('../../src/lib/env');
    expect(env.TURSO_DATABASE_URL).toBe('libsql://test.turso.io');
    expect(env.RATE_LIMIT_MAX).toBe(5);
    expect(env.RATE_LIMIT_WINDOW_MS).toBe(3600000);
    expect(env.NODE_ENV).toBe('test');
  });

  it('exposes isFormOpen helper', async () => {
    const { isFormOpen, FORM_DEADLINE } = await import('../../src/lib/env');
    expect(FORM_DEADLINE).toBeInstanceOf(Date);
    expect(isFormOpen()).toBeTypeOf('boolean');
  });
});

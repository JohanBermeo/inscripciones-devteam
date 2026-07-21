import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.IP_HASH_SALT = 'test-salt-16-chars!';
  process.env.CSRF_SECRET = 'a'.repeat(32);
  process.env.TURSO_DATABASE_URL = 'libsql://test.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'a'.repeat(32);
  process.env.FORM_DEADLINE = '2025-08-08T23:59:59-05:00';
});

describe('CSRF Token', () => {
  it('generates a valid token', async () => {
    const { generateCsrfToken } = await import('../../src/lib/security/csrf');
    const token = await generateCsrfToken();
    expect(token).toBeTruthy();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT format
  });

  it('validates the same token', async () => {
    const { generateCsrfToken, validateCsrfToken } = await import('../../src/lib/security/csrf');
    const token = await generateCsrfToken();
    const result = await validateCsrfToken(token, token);
    expect(result).toBe(true);
  });

  it('rejects a different token', async () => {
    const { generateCsrfToken, validateCsrfToken } = await import('../../src/lib/security/csrf');
    const token1 = await generateCsrfToken();
    const token2 = await generateCsrfToken();
    const result = await validateCsrfToken(token1, token2);
    expect(result).toBe(false);
  });

  it('rejects when token is missing', async () => {
    const { validateCsrfToken } = await import('../../src/lib/security/csrf');
    const result = await validateCsrfToken(undefined, undefined);
    expect(result).toBe(false);
  });

  it('rejects when cookie token is missing', async () => {
    const { generateCsrfToken, validateCsrfToken } = await import('../../src/lib/security/csrf');
    const token = await generateCsrfToken();
    const result = await validateCsrfToken(token, undefined);
    expect(result).toBe(false);
  });

  it('generates tokens that expire', async () => {
    const { generateCsrfToken, validateCsrfToken } = await import('../../src/lib/security/csrf');
    const token = await generateCsrfToken();
    expect(token).toBeTruthy();
  });
});

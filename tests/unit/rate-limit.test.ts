import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.IP_HASH_SALT = 'test-salt-16-chars!';
  process.env.CSRF_SECRET = 'a'.repeat(32);
  process.env.TURSO_DATABASE_URL = 'libsql://test.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'a'.repeat(32);
  process.env.FORM_DEADLINE = '2025-08-08T23:59:59-05:00';
});

describe('Rate Limit', () => {
  it('allows first request', async () => {
    const { checkRateLimit } = await import('../../src/lib/security/rate-limit');
    const result = checkRateLimit('1.2.3.4');
    expect(result.allowed).toBe(true);
  });

  it('blocks after 5 requests', async () => {
    const { checkRateLimit } = await import('../../src/lib/security/rate-limit');
    const ip = '5.6.7.8';

    for (let i = 0; i < 5; i++) {
      const result = checkRateLimit(ip);
      expect(result.allowed).toBe(true);
    }

    const sixth = checkRateLimit(ip);
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfter).toBeDefined();
    expect(typeof sixth.retryAfter).toBe('number');
  });

  it('resets after clearing', async () => {
    const { checkRateLimit, clearRateLimit } = await import('../../src/lib/security/rate-limit');
    const ip = '9.10.11.12';

    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip);
    }

    expect(checkRateLimit(ip).allowed).toBe(false);

    clearRateLimit(ip);

    expect(checkRateLimit(ip).allowed).toBe(true);
  });

  it('tracks different IPs separately', async () => {
    const { checkRateLimit } = await import('../../src/lib/security/rate-limit');
    const ip1 = '100.1.1.1';
    const ip2 = '200.2.2.2';

    for (let i = 0; i < 5; i++) {
      checkRateLimit(ip1);
    }

    expect(checkRateLimit(ip1).allowed).toBe(false);
    expect(checkRateLimit(ip2).allowed).toBe(true);
  });
});

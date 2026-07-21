import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.IP_HASH_SALT = 'test-salt-16-chars!';
  process.env.CSRF_SECRET = 'a'.repeat(32);
  process.env.TURSO_DATABASE_URL = 'libsql://test.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'a'.repeat(32);
  process.env.FORM_DEADLINE = '2025-08-08T23:59:59-05:00';
});

describe('hashIp', () => {
  it('produces consistent hash for same IP', async () => {
    const { hashIp } = await import('../../src/lib/security/crypto');
    const hash1 = hashIp('192.168.1.1');
    const hash2 = hashIp('192.168.1.1');
    expect(hash1).toBe(hash2);
  });

  it('produces different hashes for different IPs', async () => {
    const { hashIp } = await import('../../src/lib/security/crypto');
    const hash1 = hashIp('192.168.1.1');
    const hash2 = hashIp('10.0.0.1');
    expect(hash1).not.toBe(hash2);
  });

  it('produces hex string of 64 characters (SHA-256)', async () => {
    const { hashIp } = await import('../../src/lib/security/crypto');
    const hash = hashIp('127.0.0.1');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('hashUserAgent', () => {
  it('produces consistent hash for same UA', async () => {
    const { hashUserAgent } = await import('../../src/lib/security/crypto');
    const hash1 = hashUserAgent('Mozilla/5.0');
    const hash2 = hashUserAgent('Mozilla/5.0');
    expect(hash1).toBe(hash2);
  });

  it('produces hex string of 64 characters', async () => {
    const { hashUserAgent } = await import('../../src/lib/security/crypto');
    const hash = hashUserAgent('Mozilla/5.0');
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });
});

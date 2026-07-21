import { describe, it, expect, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.IP_HASH_SALT = 'test-salt-16-chars!';
  process.env.CSRF_SECRET = 'a'.repeat(32);
  process.env.TURSO_DATABASE_URL = 'libsql://test.turso.io';
  process.env.TURSO_AUTH_TOKEN = 'a'.repeat(32);
  process.env.FORM_DEADLINE = '2025-08-08T23:59:59-05:00';
});

describe('sanitizeInput', () => {
  it('removes HTML tags from text fields', async () => {
    const { sanitizeInput } = await import('../../src/lib/validation/sanitize');
    const result = sanitizeInput({
      fullName: '<script>alert("xss")</script>Juan',
      email: 'test@udistrital.edu.co',
      availabilityHours: 10,
      specialtyArea: '<b>Frontend</b>',
      currentSemester: 5,
      motivation: 'A'.repeat(50),
      csrfToken: 'token',
    });

    expect(result.fullName).not.toContain('<script>');
    expect(result.fullName).toContain('Juan');
    expect(result.specialtyArea).not.toContain('<b>');
  });

  it('strips all HTML and attributes', async () => {
    const { sanitizeInput } = await import('../../src/lib/validation/sanitize');
    const result = sanitizeInput({
      fullName: 'Juan<a onmouseover="alert(1)">Click</a>',
      email: 'test@udistrital.edu.co',
      availabilityHours: 10,
      specialtyArea: 'Frontend',
      currentSemester: 5,
      motivation: 'A'.repeat(50),
      csrfToken: 'token',
    });

    expect(result.fullName).not.toContain('onmouseover');
    expect(result.fullName).toContain('Juan');
  });

  it('preserves safe text content', async () => {
    const { sanitizeInput } = await import('../../src/lib/validation/sanitize');
    const motivation = 'Quiero aprender a desarrollar aplicaciones web modernas con tecnologías actualizadas.';
    const result = sanitizeInput({
      fullName: 'María José López',
      email: 'maria@udistrital.edu.co',
      availabilityHours: 15,
      specialtyArea: 'Backend Development',
      currentSemester: 7,
      motivation,
      linkedinUrl: 'https://linkedin.com/in/maria',
      csrfToken: 'token',
    });

    expect(result.fullName).toBe('María José López');
    expect(result.specialtyArea).toBe('Backend Development');
    expect(result.motivation).toBe(motivation);
    expect(result.linkedinUrl).toBe('https://linkedin.com/in/maria');
  });
});

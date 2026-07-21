import { describe, it, expect } from 'vitest';
import { registrationSchema } from '../../src/lib/validation/schemas';

const validData = {
  fullName: 'Juan Pérez',
  email: 'juan.perez@udistrital.edu.co',
  availabilityHours: '20',
  specialtyArea: 'Frontend',
  currentSemester: '5',
  motivation: 'Quiero aprender y contribuir al equipo de desarrollo con mis conocimientos en tecnologías web modernas.',
  csrfToken: 'valid-token-here',
};

describe('registrationSchema', () => {
  it('accepts valid data', () => {
    const result = registrationSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts optional fields as empty', () => {
    const data = {
      ...validData,
      linkedinUrl: '',
      githubUrl: '',
      discordUsername: '',
    };
    const result = registrationSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  describe('fullName', () => {
    it('rejects too short names', () => {
      const result = registrationSchema.safeParse({ ...validData, fullName: 'A' });
      expect(result.success).toBe(false);
    });

    it('rejects names with numbers', () => {
      const result = registrationSchema.safeParse({ ...validData, fullName: 'Juan123' });
      expect(result.success).toBe(false);
    });

    it('rejects names with special characters', () => {
      const result = registrationSchema.safeParse({ ...validData, fullName: 'Juan!!!' });
      expect(result.success).toBe(false);
    });

    it('accepts names with tildes and ñ', () => {
      const result = registrationSchema.safeParse({ ...validData, fullName: 'María José Nuñez' });
      expect(result.success).toBe(true);
    });
  });

  describe('email', () => {
    it('rejects non-udistrital emails', () => {
      const result = registrationSchema.safeParse({ ...validData, email: 'user@gmail.com' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid email format', () => {
      const result = registrationSchema.safeParse({ ...validData, email: 'not-an-email' });
      expect(result.success).toBe(false);
    });

    it('accepts valid udistrital emails', () => {
      const result = registrationSchema.safeParse({ ...validData, email: 'test@udistrital.edu.co' });
      expect(result.success).toBe(true);
    });
  });

  describe('availabilityHours', () => {
    it('rejects values below 1', () => {
      const result = registrationSchema.safeParse({ ...validData, availabilityHours: '0' });
      expect(result.success).toBe(false);
    });

    it('rejects values above 40', () => {
      const result = registrationSchema.safeParse({ ...validData, availabilityHours: '41' });
      expect(result.success).toBe(false);
    });

    it('rejects non-integer values', () => {
      const result = registrationSchema.safeParse({ ...validData, availabilityHours: '5.5' });
      expect(result.success).toBe(false);
    });

    it('accepts boundary values', () => {
      expect(registrationSchema.safeParse({ ...validData, availabilityHours: '1' }).success).toBe(true);
      expect(registrationSchema.safeParse({ ...validData, availabilityHours: '40' }).success).toBe(true);
    });
  });

  describe('currentSemester', () => {
    it('rejects values below 2', () => {
      const result = registrationSchema.safeParse({ ...validData, currentSemester: '1' });
      expect(result.success).toBe(false);
    });

    it('rejects values above 14', () => {
      const result = registrationSchema.safeParse({ ...validData, currentSemester: '15' });
      expect(result.success).toBe(false);
    });

    it('accepts boundary values', () => {
      expect(registrationSchema.safeParse({ ...validData, currentSemester: '2' }).success).toBe(true);
      expect(registrationSchema.safeParse({ ...validData, currentSemester: '14' }).success).toBe(true);
    });
  });

  describe('linkedinUrl', () => {
    it('rejects non-linkedin urls', () => {
      const result = registrationSchema.safeParse({ ...validData, linkedinUrl: 'https://example.com' });
      expect(result.success).toBe(false);
    });

    it('accepts valid linkedin urls', () => {
      const result = registrationSchema.safeParse({ ...validData, linkedinUrl: 'https://linkedin.com/in/juanperez' });
      expect(result.success).toBe(true);
    });

    it('accepts empty string', () => {
      const result = registrationSchema.safeParse({ ...validData, linkedinUrl: '' });
      expect(result.success).toBe(true);
    });
  });

  describe('githubUrl', () => {
    it('rejects non-github urls', () => {
      const result = registrationSchema.safeParse({ ...validData, githubUrl: 'https://gitlab.com/user' });
      expect(result.success).toBe(false);
    });

    it('accepts valid github urls', () => {
      const result = registrationSchema.safeParse({ ...validData, githubUrl: 'https://github.com/juanperez' });
      expect(result.success).toBe(true);
    });
  });

  describe('motivation', () => {
    it('rejects too short motivation', () => {
      const result = registrationSchema.safeParse({ ...validData, motivation: 'Corto' });
      expect(result.success).toBe(false);
    });

    it('rejects too long motivation', () => {
      const result = registrationSchema.safeParse({ ...validData, motivation: 'A'.repeat(2001) });
      expect(result.success).toBe(false);
    });
  });

  describe('csrfToken', () => {
    it('rejects empty csrf token', () => {
      const result = registrationSchema.safeParse({ ...validData, csrfToken: '' });
      expect(result.success).toBe(false);
    });
  });
});

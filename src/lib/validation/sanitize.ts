import DOMPurify from 'isomorphic-dompurify';
import type { RegistrationInput } from './schemas';

export function sanitizeInput(data: RegistrationInput): RegistrationInput {
  const safe: RegistrationInput = { ...data };

  const textFields: (keyof RegistrationInput)[] = [
    'fullName', 'specialtyArea', 'motivation',
    'linkedinUrl', 'githubUrl', 'discordUsername',
  ];

  for (const field of textFields) {
    const value = safe[field];
    if (typeof value === 'string' && value.length > 0) {
      safe[field] = DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      }) as never;
    }
  }

  return safe;
}

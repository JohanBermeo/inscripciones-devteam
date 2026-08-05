import type { RegistrationInput } from './schemas';

const TAG_PATTERN = /<[^>]*>/g;
const UNSAFE_CONTENT_PATTERN = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

function stripHtml(value: string): string {
  return value
    .replace(UNSAFE_CONTENT_PATTERN, '')
    .replace(TAG_PATTERN, '');
}

export function sanitizeInput(data: RegistrationInput): RegistrationInput {
  const safe: RegistrationInput = { ...data };

  const textFields: (keyof RegistrationInput)[] = [
    'fullName', 'specialtyArea', 'motivation',
    'linkedinUrl', 'githubUrl', 'discordUsername',
  ];

  for (const field of textFields) {
    const value = safe[field];
    if (typeof value === 'string' && value.length > 0) {
      safe[field] = stripHtml(value) as never;
    }
  }

  return safe;
}

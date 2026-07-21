import type { APIRoute } from 'astro';
import { registrationSchema } from '../../lib/validation/schemas';
import { sanitizeInput } from '../../lib/validation/sanitize';
import { validateCsrfToken } from '../../lib/security/csrf';
import { checkRateLimit, clearRateLimit } from '../../lib/security/rate-limit';
import { hashIp, hashUserAgent } from '../../lib/security/crypto';
import { db } from '../../lib/db/client';
import { insertRegistration } from '../../lib/db/queries';

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const ip = clientAddress ?? 'unknown';

  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return redirectError('rate_limit');
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return redirectError('form_data');
  }

  const csrfToken = formData.get('csrfToken')?.toString();
  const cookieToken = cookies.get('csrf_token')?.value;

  const csrfValid = await validateCsrfToken(csrfToken, cookieToken);
  if (!csrfValid) {
    return redirectError('csrf');
  }

  if (formData.get('website')) {
    return redirectError('spam');
  }

  const rawData = Object.fromEntries(formData.entries());
  const parseResult = registrationSchema.safeParse(rawData);

  if (!parseResult.success) {
    return redirectError('validation');
  }

  const sanitized = sanitizeInput(parseResult.data);

  try {
    await insertRegistration(db, {
      fullName: sanitized.fullName,
      email: sanitized.email,
      availabilityHours: sanitized.availabilityHours,
      specialtyArea: sanitized.specialtyArea,
      currentSemester: sanitized.currentSemester,
      linkedinUrl: sanitized.linkedinUrl || undefined,
      githubUrl: sanitized.githubUrl || undefined,
      discordUsername: sanitized.discordUsername || undefined,
      motivation: sanitized.motivation,
      ipHash: hashIp(ip),
      userAgentHash: hashUserAgent(request.headers.get('user-agent') ?? ''),
    });
  } catch (err) {
    if (err instanceof Error && err.message?.includes('UNIQUE constraint failed')) {
      return redirectError('duplicate_email');
    }
    throw err;
  }

  clearRateLimit(ip);

  return new Response(null, {
    status: 303,
    headers: { Location: '/register/success' },
  });
};

function redirectError(type: string): Response {
  return new Response(null, {
    status: 303,
    headers: { Location: `/error?type=${type}` },
  });
}

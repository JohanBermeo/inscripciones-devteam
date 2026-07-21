import { SignJWT, jwtVerify } from 'jose';
import { env } from '../env';

const encoder = new TextEncoder();
const secret = encoder.encode(env.CSRF_SECRET);

export async function generateCsrfToken(): Promise<string> {
  const jti = crypto.randomUUID();
  return new SignJWT({ jti })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
}

export async function validateCsrfToken(
  token: string | undefined,
  cookieToken: string | undefined,
): Promise<boolean> {
  if (!token || !cookieToken || token !== cookieToken) return false;

  try {
    await jwtVerify(token, secret, { algorithms: ['HS256'] });
    return true;
  } catch {
    return false;
  }
}

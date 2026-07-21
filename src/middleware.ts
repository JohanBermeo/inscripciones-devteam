import { defineMiddleware } from 'astro:middleware';
import { isFormOpen } from './lib/env';

export const onRequest = defineMiddleware(async ({ url, request, locals }, next) => {
  locals.formOpen = isFormOpen();

  if (url.pathname === '/api/register' && request.method === 'POST') {
    if (!locals.formOpen) {
      return new Response(
        JSON.stringify({ error: 'El período de inscripciones ha finalizado.' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }

  const response = await next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  );
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'none'",
      "form-action 'self'",
    ].join('; '),
  );

  return response;
});

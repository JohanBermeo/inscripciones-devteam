# Plan: Formulario de Inscripción Seguro

## Stack Confirmado

| Capa | Tecnología |
|------|------------|
| **Framework** | Astro 7.x (SSR) |
| **Database** | Turso (libSQL) - Raw queries (`@libsql/client`) |
| **Validation** | Zod (server + client shared schemas) |
| **Sanitización** | DOMPurify server-side (`isomorphic-dompurify`) |
| **UI Feedback** | Toast accesible (`role="status" aria-live="polite"`) |
| **Testing** | Vitest (unit/integration) + Playwright (E2E + a11y) |
| **Deploy** | Vercel + `@astrojs/vercel` (SSR) |
| **Security** | CSRF (HttpOnly cookie), Rate Limit (5/hr/IP), Honeypot, IP/UA Hash, CSP strict |
| **Fecha límite** | 8 agosto 2025 23:59 UTC-5 (middleware bloquea POST) |
| **Notificaciones** | Ninguna (solo toast + log en BD) |
| **Panel admin** | No (acceso directo a Turso con token read-only) |
| **Credenciales** | Solo en Vercel ENV, `.gitignore` estricto, validación fail-fast |
| **Commits** | Convencionales, atómicos, PR requerido a main |
| **Idioma** | Español único |
| **Base de datos** | `libsql://inscripciones-devteam-johanbermeo.aws-us-east-1.turso.io` |

---

## FASE 1: Setup Inicial y Configuración Base

### 1.1 Dependencias y Configuración
- [ ] Instalar dependencias: `zod`, `@libsql/client`, `isomorphic-dompurify`, `jose`, `@astrojs/vercel`
- [ ] DevDeps: `vitest`, `playwright`, `@axe-core/playwright`, `msw`, `husky`, `@types/node`
- [ ] Configurar `astro.config.mjs`: adapter Vercel, `output: 'server'`, `vite.build.sourcemap: false`
- [ ] Crear `.env.example` (template sin valores)
- [ ] Configurar `.gitignore` (verificar que `.env*` esté incluido)

### 1.2 Validación de Entorno (Fail Fast)
- [ ] `src/lib/env.ts`: Schema Zod para todas las env vars
- [ ] Helpers: `isFormOpen()`, `FORM_DEADLINE`

### 1.3 Scripts
- [ ] `scripts/setup-db.ts`: Inicializa tabla en Turso (run once)
- [ ] `scripts/security-audit.ts`: Escanea credenciales en build output

---

## FASE 2: Capa de Base de Datos

- [ ] `src/lib/db/client.ts`: `createClient()` con env vars validadas
- [ ] `src/lib/db/queries.ts`: `insertRegistration()` con SQL parametrizado
- [ ] `src/lib/db/schema.sql`: CREATE TABLE + índices

---

## FASE 3: Validación Zod y Sanitización

- [ ] `src/lib/validation/schemas.ts`: `registrationSchema` con todas las reglas
- [ ] Exportar `RegistrationInput` y `RegistrationErrors` types
- [ ] `src/lib/validation/sanitize.ts`: `sanitizeInput()` con DOMPurify

---

## FASE 4: Seguridad

- [ ] `src/lib/security/csrf.ts`: `generateCsrfToken()`, `validateCsrfToken()` (JWT HS256)
- [ ] `src/lib/security/rate-limit.ts`: `checkRateLimit(ip)`, `clearRateLimit(ip)`
- [ ] `src/lib/security/crypto.ts`: `hashIp()`, `hashUserAgent()` (SHA-256 + salt)

---

## FASE 5: Middleware y Endpoint API

- [ ] `src/middleware.ts`: CSP headers, deadline blocking
- [ ] `src/pages/api/register.ts`: POST endpoint (validación completa + PRG)

---

## FASE 6: Frontend - Páginas y Componentes

- [ ] `src/layouts/Layout.astro`: security meta, CSP fallback
- [ ] `src/components/forms/FormField.astro`: label, input, error, aria attrs
- [ ] `src/components/forms/SubmitButton.astro`: loading state
- [ ] `src/components/forms/Toast.astro`: accessible toast
- [ ] `src/components/forms/RegistrationForm.astro`: form principal SSR
- [ ] `src/scripts/form-validation.ts`: progressive enhancement
- [ ] `src/pages/register.astro`: GET form page
- [ ] `src/pages/register/success.astro`: PRG success page
- [ ] `src/styles/forms.css`: responsive form styles

---

## FASE 7: Testing

- [ ] Unit (Vitest): validation, sanitize, crypto, csrf, rate-limit
- [ ] Integration (Vitest + MSW): API endpoint
- [ ] E2E (Playwright): happy path, deadline, a11y, responsive

---

## FASE 8: CI, Deploy Config, Pre-commit Hooks

- [ ] `.github/workflows/ci.yml`
- [ ] `vercel.json`
- [ ] `.husky/pre-commit`

---

## FASE 9: Verificación Pre-Deploy

- [ ] Build local limpio
- [ ] Security audit
- [ ] Tests pasan
- [ ] Merge a main + tag v1.0.0

---

## Orden de Commits

1. `chore: add dependencies and Vercel adapter config`
2. `chore: add env validation (zod) fail-fast`
3. `chore: add db setup script and schema.sql`
4. `chore: add libSQL client (server-only)`
5. `chore: add typed db queries`
6. `validation: add Zod registration schema (shared types)`
7. `validation: add DOMPurify sanitization`
8. `security: implement CSRF token (HttpOnly cookie + JWT)`
9. `security: add rate limiting (5/hr per IP)`
10. `security: add IP/UA hashing for audit logs`
11. `security: add honeypot field validation`
12. `api: add POST /api/register with full validation pipeline`
13. `middleware: add deadline enforcement + CSP headers`
14. `layout: add security headers and CSP meta`
15. `feat: add FormField, SubmitButton, Toast components`
16. `feat: add RegistrationForm component (SSR + client:load)`
17. `feat: add client-side progressive validation`
18. `page: add /register (GET) with deadline check`
19. `page: add /register/success (PRG pattern)`
20. `style: add form CSS (responsive, accessible, toast animations)`
21. `test: add unit tests`
22. `test: add integration tests (MSW)`
23. `test: add e2e tests (Playwright)`
24. `test: add security audit script`
25. `chore: add CI workflow, vercel.json, husky hooks`

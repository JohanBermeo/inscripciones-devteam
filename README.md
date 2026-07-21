# Inscripciones DevTeam

Formulario de inscripción para el **DevTeam** de la **Universidad Distrital Francisco José de Caldas**.

El formulario está disponible únicamente hasta el **8 de agosto de 2026 a las 23:59 (UTC-5)**.

---

## Stack

| Tecnología                                 | Versión | Uso                                       |
| ------------------------------------------- | -------- | ----------------------------------------- |
| [Astro](https://astro.build)                 | 7        | Framework web (SSR)                       |
| [TypeScript](https://www.typescriptlang.org) | —       | Lenguaje                                  |
| [Turso](https://turso.tech) (libSQL)         | —       | Base de datos SQLite distribuida          |
| [Zod](https://zod.dev)                       | 4        | Validación de esquemas (server + client) |

---

## Requisitos

- **Node.js** >= 22.12.0
- **pnpm** >= 9 (recomendado 11+)
- Cuenta en [Turso](https://turso.tech) con una base de datos creada

---

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd inscripciones-devteam

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Turso y secretos

# 4. Inicializar la base de datos en Turso
pnpm db:setup

# 5. Iniciar servidor de desarrollo
pnpm dev
```

---

## Comandos

| Comando                 | Descripción                                          |
| ----------------------- | ----------------------------------------------------- |
| `pnpm dev`            | Inicia servidor de desarrollo (http://localhost:4321) |
| `pnpm build`          | Build de producción                                  |
| `pnpm preview`        | Previsualiza el build de producción                  |
| `pnpm test`           | Tests unitarios y de integración (Vitest)            |
| `pnpm test:watch`     | Tests en modo watch                                   |
| `pnpm test:e2e`       | Tests end-to-end (Playwright)                         |
| `pnpm test:all`       | Ejecuta unitarios + E2E                               |
| `pnpm db:setup`       | Inicializa tablas en Turso                            |
| `pnpm security:audit` | Escanea secretos en el build output                   |
| `pnpm lint`           | Verifica tipos con`astro check`                     |

---

## Estructura del proyecto

```
├── src/
│   ├── components/forms/      # Componentes del formulario
│   │   ├── FormField.astro    # Campo reutilizable con validación
│   │   ├── RegistrationForm.astro  # Formulario principal
│   │   ├── SubmitButton.astro # Botón con spinner de carga
│   │   └── Toast.astro        # Notificaciones toast
│   ├── layouts/
│   │   └── Layout.astro       # Layout base con reset CSS y meta tags
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts      # Cliente Turso
│   │   │   ├── queries.ts     # Consultas SQL tipadas
│   │   │   └── schema.sql     # DDL de la base de datos
│   │   ├── security/
│   │   │   ├── crypto.ts      # Hash de IP y User-Agent (SHA-256 + salt)
│   │   │   ├── csrf.ts        # Tokens CSRF con JWT HS256
│   │   │   └── rate-limit.ts  # Rate-limit en memoria por IP
│   │   ├── validation/
│   │   │   ├── sanitize.ts    # Sanitización con DOMPurify
│   │   │   └── schemas.ts     # Esquemas Zod compartidos
│   │   └── env.ts             # Validación de variables de entorno
│   ├── pages/
│   │   ├── index.astro        # Formulario de inscripción (GET)
│   │   ├── api/
│   │   │   └── register.ts    # Endpoint de registro (POST)
│   │   └── register/
│   │       └── success.astro  # Página de confirmación
│   ├── scripts/
│   │   └── form-validation.js # Validación client-side (progressive enhancement)
│   ├── styles/
│   │   └── forms.css          # Variables CSS (referencia)
│   └── middleware.ts          # CSP headers + deadline enforcement
├── scripts/
│   ├── setup-db.ts            # Script para inicializar Turso
│   └── security-audit.ts      # Escáner de secretos en build
├── tests/
│   ├── unit/                  # Tests unitarios (Vitest)
│   └── integration/           # Tests de integración (Vitest + MSW)
├── astro.config.mjs           # Configuración de Astro
├── .env.example               # Plantilla de variables de entorno
└── AGENTS.md                  # Contexto para asistentes AI
```

---

## Seguridad

| Mecanismo                         | Implementación                                                              |
| --------------------------------- | ---------------------------------------------------------------------------- |
| **CSRF**                    | Token JWT HS256 en cookie HttpOnly, validado en cada POST                    |
| **Rate-limit**              | 5 intentos/hora por IP (Map en memoria)                                      |
| **Honeypot**                | Campo`website` oculto (rellenar = spam)                                    |
| **Sanitización**           | DOMPurify server-side antes de insertar en DB                                |
| **Hash de PII**             | IP y User-Agent hasheados con SHA-256 + salt                                 |
| **CSP**                     | Content-Security-Policy restrictivo (script-src 'self', etc.)                |
| **Headers**                 | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **Sin secretos en cliente** | 0 credenciales en bundle (verificar con`pnpm security:audit`)              |

---

## Base de datos (Turso)

### Inicialización

```bash
pnpm db:setup
```

## Testing

- **Unitarios**: Vitest — pruebas de esquemas Zod, seguridad (CSRF, crypto, rate-limit)
- **Integración**: Vitest + MSW — pruebas del endpoint API con base de datos mockeada
- **E2E**: Playwright + axe-core — pruebas de accesibilidad y flujo completo

```bash
pnpm test          # Unitarios + integración
pnpm test:e2e      # E2E (Playwright)
pnpm test:all      # Todo
```


---

## License

MIT

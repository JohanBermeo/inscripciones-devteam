import { z } from "zod";
//#region src/lib/env.ts
var envSchema = z.object({
	TURSO_DATABASE_URL: z.string().url().refine((u) => u.startsWith("libsql://"), { message: "TURSO_DATABASE_URL debe comenzar con libsql://" }),
	TURSO_AUTH_TOKEN: z.string().min(32, "TURSO_AUTH_TOKEN debe tener al menos 32 caracteres"),
	CSRF_SECRET: z.string().min(32, "CSRF_SECRET debe tener al menos 32 caracteres"),
	IP_HASH_SALT: z.string().min(16, "IP_HASH_SALT debe tener al menos 16 caracteres"),
	RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
	RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(36e5),
	FORM_DEADLINE: z.string().datetime({ offset: true }),
	NODE_ENV: z.enum([
		"development",
		"production",
		"test"
	]).default("development")
});
function parseEnv() {
	const result = envSchema.safeParse(Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SITE": void 0,
		"SSR": true
	}, {
		NODE: "C:\\Program Files\\nodejs\\node.exe",
		NODE_ENV: "production"
	}));
	if (!result.success) {
		console.error("❌ Variables de entorno inválidas:");
		for (const issue of result.error.issues) console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
		process.exit(1);
	}
	return result.data;
}
var env = parseEnv();
var FORM_DEADLINE = new Date(env.FORM_DEADLINE);
var isFormOpen = () => /* @__PURE__ */ new Date() <= FORM_DEADLINE;
//#endregion
export { isFormOpen as n, env as t };

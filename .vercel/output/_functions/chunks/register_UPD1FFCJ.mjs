import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as env } from "./env_PpDctdX_.mjs";
import { n as validateCsrfToken } from "./csrf_DhPDWTd7.mjs";
import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { createHash } from "node:crypto";
import { createClient } from "@libsql/client";
//#region src/lib/validation/schemas.ts
var registrationSchema = z.object({
	fullName: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "Solo letras y espacios"),
	email: z.string().email("Correo electrónico inválido").regex(/@udistrital\.edu\.co$/, "Debe ser @udistrital.edu.co"),
	availabilityHours: z.coerce.number().int("Debe ser número entero").min(1, "Mínimo 1 hora").max(40, "Máximo 40 horas"),
	specialtyArea: z.string().min(2, "Requerido").max(100, "Máximo 100 caracteres"),
	currentSemester: z.coerce.number().int("Debe ser número entero").min(2, "Mínimo semestre 2").max(14, "Máximo semestre 14"),
	linkedinUrl: z.string().url("URL inválida").regex(/linkedin\.com/, "Debe ser un perfil de LinkedIn (linkedin.com)").optional().or(z.literal("")),
	githubUrl: z.string().url("URL inválida").regex(/github\.com/, "Debe ser un perfil de GitHub (github.com)").optional().or(z.literal("")),
	discordUsername: z.string().min(3, "Mínimo 3 caracteres").max(50, "Máximo 50").optional().or(z.literal("")),
	motivation: z.string().min(50, "Mínimo 50 caracteres").max(2e3, "Máximo 2000"),
	csrfToken: z.string().min(1, "Token de seguridad inválido"),
	website: z.string().optional()
});
//#endregion
//#region src/lib/validation/sanitize.ts
function sanitizeInput(data) {
	const safe = { ...data };
	for (const field of [
		"fullName",
		"specialtyArea",
		"motivation",
		"linkedinUrl",
		"githubUrl",
		"discordUsername"
	]) {
		const value = safe[field];
		if (typeof value === "string" && value.length > 0) safe[field] = DOMPurify.sanitize(value, {
			ALLOWED_TAGS: [],
			ALLOWED_ATTR: []
		});
	}
	return safe;
}
//#endregion
//#region src/lib/security/rate-limit.ts
var store = /* @__PURE__ */ new Map();
var MAX = env.RATE_LIMIT_MAX;
var WINDOW_MS = env.RATE_LIMIT_WINDOW_MS;
function checkRateLimit(ip) {
	const now = Date.now();
	const entry = store.get(ip);
	if (!entry || now > entry.resetAt) {
		store.set(ip, {
			count: 1,
			resetAt: now + WINDOW_MS
		});
		return { allowed: true };
	}
	if (entry.count >= MAX) return {
		allowed: false,
		retryAfter: Math.ceil((entry.resetAt - now) / 1e3)
	};
	entry.count++;
	return { allowed: true };
}
function clearRateLimit(ip) {
	store.delete(ip);
}
//#endregion
//#region src/lib/security/crypto.ts
function hashIp(ip) {
	return createHash("sha256").update(ip + env.IP_HASH_SALT).digest("hex");
}
function hashUserAgent(ua) {
	return createHash("sha256").update(ua + env.IP_HASH_SALT).digest("hex");
}
//#endregion
//#region src/lib/db/client.ts
var db = createClient({
	url: env.TURSO_DATABASE_URL,
	authToken: env.TURSO_AUTH_TOKEN
});
//#endregion
//#region src/lib/db/queries.ts
async function insertRegistration(db, data) {
	await db.execute({
		sql: `INSERT INTO registrations (
      full_name, email, availability_hours, specialty_area, current_semester,
      linkedin_url, github_url, discord_username, motivation,
      ip_hash, user_agent_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			data.fullName,
			data.email,
			data.availabilityHours,
			data.specialtyArea,
			data.currentSemester,
			data.linkedinUrl || null,
			data.githubUrl || null,
			data.discordUsername || null,
			data.motivation,
			data.ipHash,
			data.userAgentHash
		]
	});
}
//#endregion
//#region src/pages/api/register.ts
var register_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies, clientAddress }) => {
	const ip = clientAddress ?? "unknown";
	const rateCheck = checkRateLimit(ip);
	if (!rateCheck.allowed) return new Response(JSON.stringify({
		error: "Demasiados intentos. Intente más tarde.",
		retryAfter: rateCheck.retryAfter
	}), {
		status: 429,
		headers: { "Content-Type": "application/json" }
	});
	let formData;
	try {
		formData = await request.formData();
	} catch {
		return jsonResponse({ error: "Datos de formulario inválidos" }, 400);
	}
	const csrfToken = formData.get("csrfToken")?.toString();
	const cookieToken = cookies.get("csrf_token")?.value;
	if (!await validateCsrfToken(csrfToken, cookieToken)) return jsonResponse({ error: "Token de seguridad inválido. Recargue la página." }, 403);
	if (formData.get("website")) return jsonResponse({ error: "Spam detectado" }, 400);
	const rawData = Object.fromEntries(formData.entries());
	const parseResult = registrationSchema.safeParse(rawData);
	if (!parseResult.success) {
		const fieldErrors = {};
		for (const issue of parseResult.error.issues) {
			const path = issue.path.join(".");
			if (!fieldErrors[path]) fieldErrors[path] = [];
			fieldErrors[path].push(issue.message);
		}
		return jsonResponse({ errors: fieldErrors }, 400);
	}
	const sanitized = sanitizeInput(parseResult.data);
	try {
		await insertRegistration(db, {
			fullName: sanitized.fullName,
			email: sanitized.email,
			availabilityHours: sanitized.availabilityHours,
			specialtyArea: sanitized.specialtyArea,
			currentSemester: sanitized.currentSemester,
			linkedinUrl: sanitized.linkedinUrl || void 0,
			githubUrl: sanitized.githubUrl || void 0,
			discordUsername: sanitized.discordUsername || void 0,
			motivation: sanitized.motivation,
			ipHash: hashIp(ip),
			userAgentHash: hashUserAgent(request.headers.get("user-agent") ?? "")
		});
	} catch (err) {
		if (err instanceof Error && err.message?.includes("UNIQUE constraint failed")) return jsonResponse({ errors: { email: ["Este correo ya está registrado"] } }, 409);
		throw err;
	}
	clearRateLimit(ip);
	return new Response(null, {
		status: 303,
		headers: { Location: "/register/success" }
	});
};
function jsonResponse(body, status) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" }
	});
}
//#endregion
//#region \0virtual:astro:page:src/pages/api/register@_@ts
var page = () => register_exports;
//#endregion
export { page };

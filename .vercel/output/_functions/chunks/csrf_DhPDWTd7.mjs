import { t as env } from "./env_PpDctdX_.mjs";
import { SignJWT, jwtVerify } from "jose";
//#region src/lib/security/csrf.ts
var secret = new TextEncoder().encode(env.CSRF_SECRET);
async function generateCsrfToken() {
	return new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1h").sign(secret);
}
async function validateCsrfToken(token, cookieToken) {
	if (!token || !cookieToken || token !== cookieToken) return false;
	try {
		await jwtVerify(token, secret, { algorithms: ["HS256"] });
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { validateCsrfToken as n, generateCsrfToken as t };

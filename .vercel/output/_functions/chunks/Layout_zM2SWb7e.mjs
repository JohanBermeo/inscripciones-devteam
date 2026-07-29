import { g as addAttribute, h as renderHead, s as renderSlot, u as renderTemplate, w as createAstro } from "./server_ADzEM-mn.mjs";
import { t as createComponent } from "./compiler_B4kDLpxO.mjs";
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	return renderTemplate`<html lang="es" data-astro-cid-ju4pidww><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="generator"${addAttribute(Astro.generator, "content")}><meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"><meta name="referrer" content="strict-origin-when-cross-origin"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${Astro.props.title || "DevTeam - Inscripciones"}</title>${renderSlot($$result, $$slots["head"])}${renderHead($$result)}</head><body data-astro-cid-ju4pidww>${renderSlot($$result, $$slots["default"])}</body></html>`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };

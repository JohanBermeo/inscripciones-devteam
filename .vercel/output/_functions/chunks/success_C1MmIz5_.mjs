import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_ADzEM-mn.mjs";
import { t as createComponent } from "./compiler_B4kDLpxO.mjs";
import { t as $$Layout } from "./Layout_zM2SWb7e.mjs";
//#region src/pages/register/success.astro
var success_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Success,
	file: () => $$file,
	url: () => $$url
});
var $$Success = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Inscripción Exitosa - DevTeam",
		"data-astro-cid-vejc4csg": true
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<main class="success-page" data-astro-cid-vejc4csg><div class="success-card" data-astro-cid-vejc4csg><svg class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="64" height="64" data-astro-cid-vejc4csg><circle cx="12" cy="12" r="10" stroke-width="2" data-astro-cid-vejc4csg></circle><path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-vejc4csg></path></svg><h1 data-astro-cid-vejc4csg>¡Inscripción Enviada!</h1><p data-astro-cid-vejc4csg>Hemos recibido tu formulario correctamente. El equipo revisará tu solicitud y te contactarán pronto al correo registrado.</p><a href="/register" class="back-link" data-astro-cid-vejc4csg>Volver al inicio</a></div></main>` })}`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/pages/register/success.astro", void 0);
var $$file = "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/pages/register/success.astro";
var $$url = "/register/success";
//#endregion
//#region \0virtual:astro:page:src/pages/register/success@_@astro
var page = () => success_exports;
//#endregion
export { page };

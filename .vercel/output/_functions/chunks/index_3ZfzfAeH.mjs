import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as createRenderInstruction, g as addAttribute, i as renderComponent, m as maybeRenderHead, u as renderTemplate, w as createAstro } from "./server_ADzEM-mn.mjs";
import { t as createComponent } from "./compiler_B4kDLpxO.mjs";
import { t as generateCsrfToken } from "./csrf_DhPDWTd7.mjs";
import { t as $$Layout } from "./Layout_zM2SWb7e.mjs";
//#region node_modules/.pnpm/astro@7.1.3_@emnapi+core@1._00c1b714c77f8fe42a5bf9b4419fea94/node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region src/components/forms/FormField.astro
createAstro("https://astro.build");
var $$FormField = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$FormField;
	const { name, label, type = "text", required, placeholder, helpText, min, max, pattern, rows } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="form-field" data-astro-cid-ro5tem3y><label${addAttribute(name, "for")} data-astro-cid-ro5tem3y>${label}${required && renderTemplate`<span class="required" aria-hidden="true" data-astro-cid-ro5tem3y>*</span>`}</label>${type === "textarea" ? renderTemplate`<textarea${addAttribute(name, "id")}${addAttribute(name, "name")}${addAttribute(placeholder, "placeholder")}${addAttribute(required, "required")}${addAttribute(rows ?? "4", "rows")}${addAttribute(helpText ? `${name}-help` : void 0, "aria-describedby")} data-astro-cid-ro5tem3y></textarea>` : renderTemplate`<input${addAttribute(name, "id")}${addAttribute(name, "name")}${addAttribute(type, "type")}${addAttribute(placeholder, "placeholder")}${addAttribute(required, "required")}${addAttribute(min, "min")}${addAttribute(max, "max")}${addAttribute(pattern, "pattern")}${addAttribute(name === "email" ? "email" : name === "fullName" ? "name" : "off", "autocomplete")}${addAttribute(helpText ? `${name}-help` : void 0, "aria-describedby")} data-astro-cid-ro5tem3y>`}${helpText && renderTemplate`<p${addAttribute(`${name}-help`, "id")} class="help-text" data-astro-cid-ro5tem3y>${helpText}</p>`}<p${addAttribute(`${name}-error`, "id")} class="error-text" role="alert" aria-live="polite" data-astro-cid-ro5tem3y></p></div>`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/components/forms/FormField.astro", void 0);
//#endregion
//#region src/components/forms/SubmitButton.astro
var $$SubmitButton = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`---${maybeRenderHead($$result)}<button type="submit" class="submit-btn" id="submit-btn" data-astro-cid-j2sy5b24><span class="btn-text" data-astro-cid-j2sy5b24>Enviar inscripción</span><span class="btn-spinner" aria-hidden="true" data-astro-cid-j2sy5b24><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="20" height="20" data-astro-cid-j2sy5b24><circle cx="12" cy="12" r="10" stroke-dasharray="31.4 31.4" stroke-linecap="round" data-astro-cid-j2sy5b24></circle></svg></span></button>`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/components/forms/SubmitButton.astro", void 0);
//#endregion
//#region src/components/forms/Toast.astro
var $$Toast = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`---${maybeRenderHead($$result)}<div id="toast-container" class="toast-container" role="status" aria-live="polite" aria-atomic="true" hidden data-astro-cid-ruwwz5ux><div class="toast" role="alert" data-astro-cid-ruwwz5ux><span class="toast-message" data-astro-cid-ruwwz5ux></span><button class="toast-close" aria-label="Cerrar" data-astro-cid-ruwwz5ux>&times;</button></div></div>${renderScript($$result, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/components/forms/Toast.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/components/forms/Toast.astro", void 0);
//#endregion
//#region src/components/forms/RegistrationForm.astro
createAstro("https://astro.build");
var $$RegistrationForm = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RegistrationForm;
	const { csrfToken, deadline } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<form id="registration-form" method="POST" action="/api/register" class="registration-form" novalidate data-astro-cid-22stgon2><input type="hidden" name="csrfToken"${addAttribute(csrfToken, "value")} data-astro-cid-22stgon2><input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;height:0;width:0;opacity:0" data-astro-cid-22stgon2><div class="form-grid" data-astro-cid-22stgon2>${renderComponent($$result, "FormField", $$FormField, {
		"name": "fullName",
		"label": "Nombre Completo",
		"required": true,
		"pattern": "[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+",
		"placeholder": "Ej: Juan Pérez",
		"helpText": "Solo letras y espacios",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "email",
		"label": "Correo Electrónico",
		"type": "email",
		"required": true,
		"placeholder": "usuario@udistrital.edu.co",
		"helpText": "Debe ser @udistrital.edu.co",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "availabilityHours",
		"label": "Disponibilidad Horaria (hrs/semana)",
		"type": "number",
		"required": true,
		"min": "1",
		"max": "40",
		"placeholder": "10",
		"helpText": "Entre 1 y 40 horas semanales",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "currentSemester",
		"label": "Semestre Actual",
		"type": "number",
		"required": true,
		"min": "2",
		"max": "14",
		"placeholder": "5",
		"helpText": "Entre semestre 2 y 14",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "specialtyArea",
		"label": "Área de Especialidad",
		"required": true,
		"placeholder": "Ej: Frontend, Backend, DevOps, UX",
		"helpText": "¿Cuál es tu área de interés o especialidad?",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "linkedinUrl",
		"label": "Perfil de LinkedIn (opcional)",
		"type": "url",
		"placeholder": "https://linkedin.com/in/tuusuario",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "githubUrl",
		"label": "Perfil de GitHub (opcional)",
		"type": "url",
		"placeholder": "https://github.com/tuusuario",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "FormField", $$FormField, {
		"name": "discordUsername",
		"label": "Usuario de Discord (opcional)",
		"placeholder": "usuario#1234",
		"data-astro-cid-22stgon2": true
	})}</div>${renderComponent($$result, "FormField", $$FormField, {
		"name": "motivation",
		"label": "¿Por qué deseas entrar al grupo?",
		"type": "textarea",
		"required": true,
		"rows": "5",
		"placeholder": "Cuéntanos tu motivación, experiencia y qué esperas aportar...",
		"helpText": "Mínimo 50 caracteres, máximo 2000",
		"data-astro-cid-22stgon2": true
	})}${renderComponent($$result, "SubmitButton", $$SubmitButton, { "data-astro-cid-22stgon2": true })}</form>${renderComponent($$result, "Toast", $$Toast, { "data-astro-cid-22stgon2": true })}${renderScript($$result, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/components/forms/RegistrationForm.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/components/forms/RegistrationForm.astro", void 0);
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro2 = $$result.createAstro($$props, $$slots);
	Astro2.self = $$Index;
	const formOpen = Astro2.locals.formOpen ?? true;
	const csrfToken = await generateCsrfToken();
	Astro2.cookies.set("csrf_token", csrfToken, {
		httpOnly: true,
		secure: true,
		sameSite: "strict",
		maxAge: 3600,
		path: "/"
	});
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": "Inscripción - DevTeam",
		"data-astro-cid-lcdefpme": true
	}, { "default": ($$result2) => renderTemplate`${maybeRenderHead($$result2)}<main class="page" data-astro-cid-lcdefpme><header class="page-header" data-astro-cid-lcdefpme><h1 data-astro-cid-lcdefpme>Formulario de Inscripción</h1><p class="subtitle" data-astro-cid-lcdefpme>DevTeam - Universidad Distrital</p><p class="info-text" data-astro-cid-lcdefpme>Completa todos los campos obligatorios (*) para enviar tu solicitud.</p></header>${formOpen ? renderTemplate`${renderComponent($$result2, "RegistrationForm", $$RegistrationForm, {
		"csrfToken": csrfToken,
		"deadline": "2025-08-08T23:59:59-05:00",
		"data-astro-cid-lcdefpme": true
	})}` : renderTemplate`<section class="closed-message" role="alert" data-astro-cid-lcdefpme><h2 data-astro-cid-lcdefpme>Inscripciones Cerradas</h2><p data-astro-cid-lcdefpme>El período de inscripciones finalizó el <strong data-astro-cid-lcdefpme>8 de agosto de 2025</strong>.</p><p data-astro-cid-lcdefpme>Gracias por tu interés en formar parte del DevTeam.</p></section>`}</main>` })}`;
}, "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/pages/index.astro", void 0);
var $$file = "C:/Users/johan/OneDrive/Documentos/GitHub/inscripciones-devteam/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };

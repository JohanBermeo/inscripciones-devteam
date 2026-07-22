(function () {
  var form = document.getElementById('registration-form');
  if (!form) return;

  var currentStep = 1;
  var totalSteps = 4;
  var maxCompletedStep = 0;
  var stepData = {};

  var stepFields = {
    1: ['fullName', 'email', 'currentSemester'],
    2: ['specialtyArea', 'availabilityHours'],
    3: ['motivation'],
    4: ['linkedinUrl', 'githubUrl', 'discordUsername'],
  };

  var RULES = {
    fullName: {
      required: true,
      validate: function (v) {
        return v.length < 2
          ? 'M\u00ednimo 2 caracteres'
          : v.length > 100
            ? 'M\u00e1ximo 100 caracteres'
            : !/^[a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1\u00c1\u00c9\u00cd\u00d3\u00da\u00dc\u00d1\s]+$/.test(v)
              ? 'Solo letras y espacios'
              : null;
      },
    },
    email: {
      required: true,
      validate: function (v) {
        return !/@udistrital\.edu\.co$/.test(v)
          ? 'Debe ser un correo @udistrital.edu.co'
          : null;
      },
    },
    currentSemester: {
      required: true,
      validate: function (v) {
        var n = Number(v);
        return !Number.isInteger(n)
          ? 'Debe ser n\u00famero entero'
          : n < 2
            ? 'M\u00ednimo semestre 2'
            : n > 14
              ? 'M\u00e1ximo semestre 14'
              : null;
      },
    },
    specialtyArea: {
      required: true,
      validate: function (v) {
        return v.length < 2 ? 'Requerido' : v.length > 100 ? 'M\u00e1ximo 100 caracteres' : null;
      },
    },
    availabilityHours: {
      required: true,
      validate: function (v) {
        var n = Number(v);
        return !Number.isInteger(n)
          ? 'Debe ser n\u00famero entero'
          : n < 1
            ? 'M\u00ednimo 1 hora'
            : n > 40
              ? 'M\u00e1ximo 40 horas'
              : null;
      },
    },
    motivation: {
      required: true,
      validate: function (v) {
        return v.length < 50
          ? 'M\u00ednimo 50 caracteres'
          : v.length > 2000
            ? 'M\u00e1ximo 2000 caracteres'
            : null;
      },
    },
    linkedinUrl: {
      required: false,
      validate: function (v) {
        return v.length > 0 && !/linkedin\.com/.test(v) ? 'Debe ser linkedin.com' : null;
      },
    },
    githubUrl: {
      required: false,
      validate: function (v) {
        return v.length > 0 && !/github\.com/.test(v) ? 'Debe ser github.com' : null;
      },
    },
    discordUsername: {
      required: false,
      validate: function (v) {
        return v.length > 0 && v.length < 3
          ? 'M\u00ednimo 3 caracteres'
          : v.length > 50
            ? 'M\u00e1ximo 50'
            : null;
      },
    },
  };

  function getFieldEl(name) {
    return form.querySelector('[name="' + name + '"]') || document.getElementById(name);
  }

  function getErrorEl(name) {
    return document.getElementById(name + '-error');
  }

  function clearErrors(step) {
    var fields = stepFields[step] || [];
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i];
      var err = getErrorEl(name);
      var f = getFieldEl(name);
      if (err) {
        err.textContent = '';
        err.classList.remove('visible');
      }
      if (f) {
        f.removeAttribute('aria-invalid');
        f.classList.remove('error');
      }
    }
  }

  function clearAllErrors() {
    for (var i = 1; i <= totalSteps; i++) {
      clearErrors(i);
    }
  }

  function showError(name, msg) {
    var err = getErrorEl(name);
    var f = getFieldEl(name);
    if (err) {
      err.textContent = msg;
      err.classList.add('visible');
    }
    if (f) {
      f.setAttribute('aria-invalid', 'true');
      f.classList.add('error');
    }
  }

  function saveCurrentStepData() {
    var fields = stepFields[currentStep] || [];
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i];
      var el = getFieldEl(name);
      if (el) {
        stepData[name] = el.value;
      }
    }
  }

  function renderStep(step) {
    var container = document.getElementById('step-container');
    if (!container) return;

    var tpl = document.getElementById('step-tpl-' + step);
    if (!tpl) return;

    var content = tpl.content.cloneNode(true);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    container.appendChild(content);

    var fields = stepFields[step] || [];
    for (var i = 0; i < fields.length; i++) {
      var name = fields[i];
      if (stepData[name] !== undefined) {
        var el = getFieldEl(name);
        if (el) el.value = stepData[name];
      }
    }
  }

  function validateStep(step) {
    var fields = stepFields[step] || [];
    var valid = true;
    var firstErrorField = null;

    clearErrors(step);

    for (var i = 0; i < fields.length; i++) {
      var name = fields[i];
      var f = getFieldEl(name);
      if (!f) continue;
      var value = f.value.trim();
      var rule = RULES[name];
      if (!rule) continue;

      if (rule.required && value.length === 0) {
        showError(name, 'Este campo es obligatorio');
        valid = false;
        if (!firstErrorField) firstErrorField = f;
        continue;
      }

      if (value.length > 0) {
        var err = rule.validate(value);
        if (err) {
          showError(name, err);
          valid = false;
          if (!firstErrorField) firstErrorField = f;
        }
      }
    }

    if (firstErrorField) firstErrorField.focus();
    return valid;
  }

  function validateValue(name, value) {
    if (value === undefined || value === null) value = '';
    var rule = RULES[name];
    if (!rule) return null;
    var trimmed = String(value).trim();
    if (rule.required && trimmed.length === 0) return 'Este campo es obligatorio';
    if (trimmed.length > 0) return rule.validate(trimmed);
    return null;
  }

  function validateAllFromData() {
    var valid = true;
    var firstInvalidStep = null;

    clearAllErrors();

    for (var s = 1; s <= totalSteps; s++) {
      var fields = stepFields[s] || [];
      for (var i = 0; i < fields.length; i++) {
        var name = fields[i];
        var value = stepData[name] || '';
        var err = validateValue(name, value);
        if (err) {
          if (firstInvalidStep === null) firstInvalidStep = s;
          valid = false;
        }
      }
    }

    return { valid: valid, firstInvalidStep: firstInvalidStep };
  }

  function addHiddenInputs() {
    for (var key in stepData) {
      if (stepData.hasOwnProperty(key) && !form.querySelector('[name="' + key + '"]')) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = stepData[key] || '';
        form.appendChild(input);
      }
    }
  }

  function updateProgress() {
    var fill = document.getElementById('header-progress-fill');
    if (fill) {
      var pct = (maxCompletedStep / totalSteps) * 100;
      fill.style.width = pct + '%';
    }

    var progress = document.getElementById('header-progress');
    if (progress) progress.setAttribute('aria-valuenow', currentStep);

    var stepLabel = document.getElementById('step-announce');
    if (stepLabel) {
      var names = {
        1: 'Informaci\u00f3n Personal',
        2: '\u00c1rea de Especializaci\u00f3n',
        3: 'Motivaci\u00f3n de Ingreso',
        4: 'Campos Opcionales',
      };
      stepLabel.textContent =
        'Paso ' + currentStep + ' de ' + totalSteps + ': ' + (names[currentStep] || '');
    }
  }

  function updateNavButtons() {
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var submitBtn = document.getElementById('submit-btn');

    if (!prevBtn || !nextBtn || !submitBtn) return;

    if (currentStep === 1) {
      // Paso 1: Únicamente el botón de siguiente activo
      prevBtn.hidden = true;
      nextBtn.hidden = false;
      submitBtn.hidden = true;
    } else if (currentStep === totalSteps) {
      // Paso 4: Solo anterior y enviar solicitud activos
      prevBtn.hidden = false;
      nextBtn.hidden = true;
      submitBtn.hidden = false;
    } else {
      // Otros pasos: Solo anterior y siguiente activos
      prevBtn.hidden = false;
      nextBtn.hidden = false;
      submitBtn.hidden = true;
    }
  }

  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    if (step - 1 > maxCompletedStep) {
      maxCompletedStep = step - 1;
    }

    currentStep = step;
    renderStep(step);
    updateProgress();
    updateNavButtons();

    var fields = stepFields[step] || [];
    for (var i = 0; i < fields.length; i++) {
      var f = getFieldEl(fields[i]);
      if (f) {
        f.focus();
        break;
      }
    }
  }

  var nextBtn = document.getElementById('next-btn');
  var prevBtn = document.getElementById('prev-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (validateStep(currentStep)) {
        saveCurrentStepData();
        goToStep(currentStep + 1);
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      saveCurrentStepData();
      goToStep(currentStep - 1);
    });
  }

  form.addEventListener('submit', function (e) {
    saveCurrentStepData();

    var result = validateAllFromData();
    if (!result.valid) {
      e.preventDefault();
      goToStep(result.firstInvalidStep);
      validateStep(result.firstInvalidStep);
      return;
    }

    addHiddenInputs();
  });

  goToStep(1);
})();

(function () {
  var form = document.getElementById('registration-form');
  if (!form) return;

  var RULES = {
    fullName: {
      validate: function (v) {
        return v.length < 2
          ? 'Mínimo 2 caracteres'
          : v.length > 100
            ? 'Máximo 100 caracteres'
            : !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v)
              ? 'Solo letras y espacios'
              : null;
      },
    },
    email: {
      validate: function (v) {
        return !/@udistrital\.edu\.co$/.test(v)
          ? 'Debe ser un correo @udistrital.edu.co'
          : null;
      },
    },
    availabilityHours: {
      validate: function (v) {
        var n = Number(v);
        return !Number.isInteger(n)
          ? 'Debe ser número entero'
          : n < 1
            ? 'Mínimo 1 hora'
            : n > 40
              ? 'Máximo 40 horas'
              : null;
      },
    },
    currentSemester: {
      validate: function (v) {
        var n = Number(v);
        return !Number.isInteger(n)
          ? 'Debe ser número entero'
          : n < 2
            ? 'Mínimo semestre 2'
            : n > 14
              ? 'Máximo semestre 14'
              : null;
      },
    },
    specialtyArea: {
      validate: function (v) {
        return v.length < 2 ? 'Requerido' : v.length > 100 ? 'Máximo 100 caracteres' : null;
      },
    },
    linkedinUrl: {
      validate: function (v) {
        return v.length > 0 && !/linkedin\.com/.test(v) ? 'Debe ser linkedin.com' : null;
      },
    },
    githubUrl: {
      validate: function (v) {
        return v.length > 0 && !/github\.com/.test(v) ? 'Debe ser github.com' : null;
      },
    },
    discordUsername: {
      validate: function (v) {
        return v.length > 0 && v.length < 3 ? 'Mínimo 3 caracteres' : v.length > 50 ? 'Máximo 50' : null;
      },
    },
    motivation: {
      validate: function (v) {
        return v.length < 50
          ? 'Mínimo 50 caracteres'
          : v.length > 2000
            ? 'Máximo 2000 caracteres'
            : null;
      },
    },
  };

  function getErrorEl(fieldName) {
    return document.getElementById(fieldName + '-error');
  }

  function getFieldEl(fieldName) {
    return document.getElementById(fieldName);
  }

  function clearAllErrors() {
    for (var name in RULES) {
      if (RULES.hasOwnProperty(name)) {
        var errorEl = getErrorEl(name);
        var fieldEl = getFieldEl(name);
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
        if (fieldEl) {
          fieldEl.removeAttribute('aria-invalid');
          fieldEl.classList.remove('error');
        }
      }
    }
  }

  function showError(fieldName, message) {
    var errorEl = getErrorEl(fieldName);
    var fieldEl = getFieldEl(fieldName);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    if (fieldEl) {
      fieldEl.setAttribute('aria-invalid', 'true');
      fieldEl.classList.add('error');
    }
  }

  form.addEventListener('submit', function (e) {
    clearAllErrors();

    var hasError = false;
    var data = new FormData(form);

    for (var name in RULES) {
      if (RULES.hasOwnProperty(name)) {
        var value = (data.get(name)) || '';
        var error = RULES[name].validate(value);
        if (error) {
          showError(name, error);
          hasError = true;
        }
      }
    }

    if (hasError) {
      e.preventDefault();

      var firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
    }
  });
})();

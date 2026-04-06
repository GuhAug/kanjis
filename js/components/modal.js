// ============================================================
// modal.js — Generic modal and toast utilities
// ============================================================

var Modal = (function () {

  function show(title, body, actions) {
    var overlay = document.getElementById('modal-overlay');
    if (!overlay) return;

    var actionsHtml = (actions || []).map(function (a) {
      return '<button class="btn ' + (a.cls || 'btn-secondary') + '" data-modal-action="' + a.id + '">' + a.label + '</button>';
    }).join('');

    overlay.innerHTML =
      '<div class="modal-box">' +
        '<h3>' + title + '</h3>' +
        '<div class="modal-body">' + body + '</div>' +
        (actionsHtml ? '<div class="modal-actions">' + actionsHtml + '</div>' : '') +
      '</div>';

    overlay.classList.remove('hidden');

    overlay.addEventListener('click', function handler(e) {
      if (e.target === overlay) {
        close();
        overlay.removeEventListener('click', handler);
      }
      var btn = e.target.closest('[data-modal-action]');
      if (btn) {
        var id = btn.dataset.modalAction;
        close();
        overlay.removeEventListener('click', handler);
        if (actions) {
          var action = actions.find(function (a) { return a.id === id; });
          if (action && action.fn) action.fn();
        }
      }
    });
  }

  function close() {
    var overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.innerHTML = '';
    }
  }

  function confirm(title, body, onConfirm) {
    show(title, body, [
      { id: 'cancel',  label: 'Cancelar', cls: 'btn-secondary' },
      { id: 'confirm', label: 'Confirmar', cls: 'btn-danger', fn: onConfirm },
    ]);
  }

  return { show: show, close: close, confirm: confirm };

})();

// ---- Toast ----

var Toast = (function () {

  function show(msg, type, duration) {
    var container = document.getElementById('toast-container');
    if (!container) return;

    var el = document.createElement('div');
    el.className = 'toast ' + (type || 'info');
    el.textContent = msg;
    container.appendChild(el);

    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity 300ms';
      setTimeout(function () { el.remove(); }, 300);
    }, duration || 2500);
  }

  function success(msg) { show(msg, 'success'); }
  function error(msg)   { show(msg, 'error'); }
  function info(msg)    { show(msg, 'info'); }

  return { show: show, success: success, error: error, info: info };

})();

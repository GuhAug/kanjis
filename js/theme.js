// ============================================================
// theme.js — Dark / light theme management
// ============================================================

var Theme = (function () {

  var _theme = localStorage.getItem('nihongo_theme') || 'dark';

  function apply() {
    document.documentElement.setAttribute('data-theme', _theme);
  }

  function toggle() {
    _theme = _theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('nihongo_theme', _theme);
    apply();
  }

  function get() { return _theme; }

  return { apply: apply, toggle: toggle, get: get };

})();

Theme.apply();

// ============================================================
// navbar.js — Sidebar (desktop) and bottom nav (mobile)
// ============================================================

var Navbar = (function () {

  // ---- Sidebar items (with section dividers) ----
  var SIDEBAR_ITEMS = [
    { type: 'item',    path: '/',          icon: '🏠', label: 'Início' },
    { type: 'section', label: 'Kanji' },
    { type: 'item',    path: '/browse',    icon: '📚', label: 'Navegar' },
    { type: 'item',    path: '/flashcard', icon: '🃏', label: 'Flashcards' },
    { type: 'item',    path: '/quiz',      icon: '✏️',  label: 'Quiz' },
    { type: 'section', label: 'Gramática' },
    { type: 'item',    path: '/grammar',   icon: '🔀', label: 'Flexões' },
    { type: 'item',    path: '/theory',    icon: '📖', label: 'Teoria' },
  ];

  // ---- Mobile bottom nav ----
  // Main row — 4 top-level tabs (漢 Kanji navigates to /browse)
  var MAIN_NAV = [
    { path: '/',        icon: '🏠', label: 'Início',  jp: false },
    { path: '/browse',  icon: '漢', label: 'Kanji',   jp: true  },
    { path: '/grammar', icon: '🔀', label: 'Flexões', jp: false },
    { path: '/theory',  icon: '📖', label: 'Teoria',  jp: false },
  ];

  // Kanji sub-row — visible only when on a kanji path
  var KANJI_SUB_NAV = [
    { path: '/browse',    icon: '📚', label: 'Navegar' },
    { path: '/flashcard', icon: '🃏', label: 'Flashcards' },
    { path: '/quiz',      icon: '✏️',  label: 'Quiz' },
  ];

  function _isKanjiPath(path) {
    return path.startsWith('/browse') || path.startsWith('/flashcard') ||
           path.startsWith('/quiz')   || path.startsWith('/kanji');
  }

  function render() {
    renderSidebar();
    renderBottomNav();
  }

  function renderSidebar() {
    var el = document.getElementById('sidebar');
    if (!el) return;

    var stats = KanjiStorage.getStats();
    var pct = stats.pct;

    var items = SIDEBAR_ITEMS.map(function (item) {
      if (item.type === 'section') {
        return '<div class="nav-section-label">' + item.label + '</div>';
      }
      return '<div class="nav-item" data-nav="' + item.path + '">' +
        '<span class="nav-icon">' + item.icon + '</span>' +
        '<span>' + item.label + '</span>' +
        '</div>';
    }).join('');

    el.innerHTML =
      '<div class="sidebar-logo">' +
        '<div class="logo-kanji">漢</div>' +
        '<div class="logo-text">' +
          '<span class="logo-title">Kanji Progressive</span>' +
          '<span class="logo-sub">Novo Progressivo 1–4</span>' +
        '</div>' +
      '</div>' +
      '<nav class="sidebar-nav">' + items + '</nav>' +
      '<div class="sidebar-progress">' +
        '<div class="prog-label">' +
          '<span>Progresso geral</span>' +
          '<span id="sidebar-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="prog-bar-wrap">' +
          '<div class="prog-bar-fill" id="sidebar-prog-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>';

    el.addEventListener('click', function (e) {
      var item = e.target.closest('[data-nav]');
      if (item) KanjiApp.navigate(item.dataset.nav);
    });
  }

  function renderBottomNav() {
    var el = document.getElementById('bottom-nav');
    if (!el) return;

    var subItems = KANJI_SUB_NAV.map(function (item) {
      return '<div class="bottom-nav-item bn-sub" data-nav="' + item.path + '">' +
        '<span class="nav-icon">' + item.icon + '</span>' +
        '<span>' + item.label + '</span>' +
      '</div>';
    }).join('');

    var mainItems = MAIN_NAV.map(function (item) {
      var iconCls = item.jp ? 'nav-icon nav-icon-jp' : 'nav-icon';
      return '<div class="bottom-nav-item" data-nav="' + item.path + '">' +
        '<span class="' + iconCls + '">' + item.icon + '</span>' +
        '<span>' + item.label + '</span>' +
      '</div>';
    }).join('');

    el.innerHTML =
      '<div class="bn-kanji-row" id="bn-kanji-row">' + subItems + '</div>' +
      '<div class="bn-main-row">' + mainItems + '</div>';

    el.addEventListener('click', function (e) {
      var item = e.target.closest('[data-nav]');
      if (item) KanjiApp.navigate(item.dataset.nav);
    });
  }

  function updateActive(path) {
    var isKanji = _isKanjiPath(path);

    // Sidebar: highlight matching item
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      var navPath = el.dataset.nav;
      var active = (navPath === '/' ? path === '/' : path.startsWith(navPath));
      el.classList.toggle('active', active);
    });

    // Bottom nav — main row: 漢 Kanji tab active for any kanji path
    document.querySelectorAll('.bn-main-row .bottom-nav-item').forEach(function (el) {
      var navPath = el.dataset.nav;
      var active;
      if (navPath === '/browse') {
        active = isKanji;
      } else if (navPath === '/') {
        active = (path === '/');
      } else {
        active = path.startsWith(navPath);
      }
      el.classList.toggle('active', active);
    });

    // Bottom nav — kanji sub-row: highlight the matching sub-item
    document.querySelectorAll('.bn-kanji-row .bottom-nav-item').forEach(function (el) {
      var navPath = el.dataset.nav;
      var active = path.startsWith(navPath);
      el.classList.toggle('active', active);
    });

    // Show kanji sub-row and expand bottom padding when on a kanji path
    var kanjiRow = document.getElementById('bn-kanji-row');
    if (kanjiRow) kanjiRow.classList.toggle('kanji-active', isKanji);
    document.body.classList.toggle('kanji-section', isKanji);
  }

  function updateProgress() {
    var stats = KanjiStorage.getStats();
    var fill = document.getElementById('sidebar-prog-fill');
    var pct  = document.getElementById('sidebar-pct');
    if (fill) fill.style.width = stats.pct + '%';
    if (pct)  pct.textContent = stats.pct + '%';
  }

  return { render: render, updateActive: updateActive, updateProgress: updateProgress };

})();

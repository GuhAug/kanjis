// ============================================================
// navbar.js — Sidebar (desktop) + Hamburger drawer (mobile)
// ============================================================

var Navbar = (function () {

  var _drawerOpen = false;

  // ---- Sidebar items (desktop) ----
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

  // ---- Drawer structure (mobile) — card sections per theme ----
  var DRAWER_STRUCTURE = [
    { type: 'item', path: '/', icon: '🏠', label: 'Início' },
    {
      type: 'section', label: 'Kanji',
      items: [
        { path: '/browse',    icon: '📚', label: 'Navegar' },
        { path: '/flashcard', icon: '🃏', label: 'Flashcards' },
        { path: '/quiz',      icon: '✏️',  label: 'Quiz' },
      ]
    },
    {
      type: 'section', label: 'Gramática',
      items: [
        { path: '/grammar', icon: '🔀', label: 'Flexões' },
      ]
    },
    { type: 'item', path: '/theory', icon: '📖', label: 'Teoria' },
  ];

  function _openDrawer() {
    _drawerOpen = true;
    var drawer  = document.getElementById('nav-drawer');
    var overlay = document.getElementById('nav-overlay');
    if (drawer)  drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function _closeDrawer() {
    _drawerOpen = false;
    var drawer  = document.getElementById('nav-drawer');
    var overlay = document.getElementById('nav-overlay');
    if (drawer)  drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function render() {
    renderSidebar();
    renderTopBar();
    renderDrawer();
  }

  function renderTopBar() {
    var el = document.getElementById('top-bar');
    if (!el) return;

    el.innerHTML =
      '<div class="top-bar-logo">' +
        '<span class="top-bar-kanji">漢</span>' +
        '<span class="top-bar-title">Nihongo Progressive</span>' +
      '</div>' +
      '<button class="hamburger-btn" id="hamburger-btn" aria-label="Abrir menu">☰</button>';

    document.getElementById('hamburger-btn').addEventListener('click', _openDrawer);
  }

  function renderDrawer() {
    var stats = KanjiStorage.getStats();
    var pct   = stats.pct;

    // Build drawer body
    var bodyHTML = DRAWER_STRUCTURE.map(function (entry) {
      if (entry.type === 'item') {
        return '<div class="drawer-item" data-nav="' + entry.path + '">' +
          '<span class="nav-icon">' + entry.icon + '</span>' +
          '<span>' + entry.label + '</span>' +
        '</div>';
      }
      var subItems = entry.items.map(function (item) {
        return '<div class="drawer-item" data-nav="' + item.path + '">' +
          '<span class="nav-icon">' + item.icon + '</span>' +
          '<span>' + item.label + '</span>' +
        '</div>';
      }).join('');
      return '<div class="drawer-section">' +
        '<div class="drawer-section-label">' + entry.label + '</div>' +
        subItems +
      '</div>';
    }).join('');

    // Overlay
    var overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', _closeDrawer);

    // Drawer
    var drawer = document.createElement('nav');
    drawer.id = 'nav-drawer';
    drawer.className = 'nav-drawer';
    drawer.innerHTML =
      '<div class="drawer-header">' +
        '<div class="drawer-logo">' +
          '<span class="drawer-kanji">漢</span>' +
          '<div class="drawer-logo-text">' +
            '<span class="drawer-title">Nihongo Progressive</span>' +
            '<span class="drawer-sub">Novo Progressivo 1–4</span>' +
          '</div>' +
        '</div>' +
        '<button class="drawer-close-btn" id="drawer-close-btn" aria-label="Fechar menu">✕</button>' +
      '</div>' +
      '<div class="drawer-body">' + bodyHTML + '</div>' +
      '<div class="drawer-progress">' +
        '<div class="prog-label">' +
          '<span>Progresso geral</span>' +
          '<span id="drawer-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="prog-bar-wrap">' +
          '<div class="prog-bar-fill" id="drawer-prog-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    document.getElementById('drawer-close-btn').addEventListener('click', _closeDrawer);

    drawer.addEventListener('click', function (e) {
      var item = e.target.closest('[data-nav]');
      if (item) {
        _closeDrawer();
        KanjiApp.navigate(item.dataset.nav);
      }
    });
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
          '<span class="logo-title">Nihongo Progressive</span>' +
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

  function updateActive(path) {
    // Sidebar
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      var navPath = el.dataset.nav;
      var active = (navPath === '/' ? path === '/' : path.startsWith(navPath));
      el.classList.toggle('active', active);
    });

    // Drawer
    document.querySelectorAll('#nav-drawer .drawer-item').forEach(function (el) {
      var navPath = el.dataset.nav;
      var active = (navPath === '/' ? path === '/' : path.startsWith(navPath));
      el.classList.toggle('active', active);
    });
  }

  function updateProgress() {
    var stats = KanjiStorage.getStats();

    var fill = document.getElementById('sidebar-prog-fill');
    var pct  = document.getElementById('sidebar-pct');
    if (fill) fill.style.width = stats.pct + '%';
    if (pct)  pct.textContent = stats.pct + '%';

    var dfill = document.getElementById('drawer-prog-fill');
    var dpct  = document.getElementById('drawer-pct');
    if (dfill) dfill.style.width = stats.pct + '%';
    if (dpct)  dpct.textContent = stats.pct + '%';
  }

  return { render: render, updateActive: updateActive, updateProgress: updateProgress };

})();

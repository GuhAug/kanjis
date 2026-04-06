// ============================================================
// navbar.js — Sidebar (desktop) and bottom nav (mobile)
// ============================================================

var Navbar = (function () {

  var NAV_ITEMS = [
    { path: '/',          icon: '🏠', label: 'Início' },
    { path: '/browse',    icon: '📚', label: 'Navegar' },
    { path: '/flashcard', icon: '🃏', label: 'Flashcards' },
    { path: '/quiz',      icon: '✏️',  label: 'Quiz' },
    { path: '/theory',    icon: '📖', label: 'Teoria' },
  ];

  function render() {
    renderSidebar();
    renderBottomNav();
  }

  function renderSidebar() {
    var el = document.getElementById('sidebar');
    if (!el) return;

    var stats = KanjiStorage.getStats();
    var pct = stats.pct;

    var items = NAV_ITEMS.map(function (item) {
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

    var items = NAV_ITEMS.map(function (item) {
      return '<div class="bottom-nav-item" data-nav="' + item.path + '">' +
        '<span class="nav-icon">' + item.icon + '</span>' +
        '<span>' + item.label + '</span>' +
        '</div>';
    }).join('');

    el.innerHTML = items;

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
    // Bottom nav
    document.querySelectorAll('.bottom-nav .bottom-nav-item').forEach(function (el) {
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
  }

  return { render: render, updateActive: updateActive, updateProgress: updateProgress };

})();

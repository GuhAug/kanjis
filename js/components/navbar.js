// ============================================================
// navbar.js — Sidebar (desktop) + Hamburger drawer (mobile)
// ============================================================

var Navbar = (function () {

  var _drawerOpen = false;

  function _getSidebarItems() {
    return [
      { type: 'item',    path: '/',             icon: '🏠', label: Lang.t('nav_home') },
      { type: 'section', label: Lang.t('nav_section_kanji') },
      { type: 'item',    path: '/browse',       icon: '📚', label: Lang.t('nav_browse') },
      { type: 'item',    path: '/flashcard',    icon: '🃏', label: Lang.t('nav_flashcard') },
      { type: 'item',    path: '/quiz',         icon: '✏️',  label: Lang.t('nav_quiz') },
      { type: 'section', label: Lang.t('nav_section_grammar') },
      { type: 'item',    path: '/grammar',      icon: '🔀', label: Lang.t('nav_grammar') },
      { type: 'item',    path: '/particles',    icon: '🧩', label: Lang.t('nav_particles') },
      { type: 'item',    path: '/transitivity', icon: '↔️', label: Lang.t('nav_transitivity') },
      { type: 'item',    path: '/theory',       icon: '📖', label: Lang.t('nav_theory') },
    ];
  }

  function _getDrawerStructure() {
    return [
      { type: 'item', path: '/', icon: '🏠', label: Lang.t('nav_home') },
      {
        type: 'section', label: Lang.t('nav_section_kanji'),
        items: [
          { path: '/browse',    icon: '📚', label: Lang.t('nav_browse') },
          { path: '/flashcard', icon: '🃏', label: Lang.t('nav_flashcard') },
          { path: '/quiz',      icon: '✏️',  label: Lang.t('nav_quiz') },
        ]
      },
      {
        type: 'section', label: Lang.t('nav_section_grammar'),
        items: [
          { path: '/grammar',      icon: '🔀', label: Lang.t('nav_grammar') },
          { path: '/particles',    icon: '🧩', label: Lang.t('nav_particles') },
          { path: '/transitivity', icon: '↔️', label: Lang.t('nav_transitivity') },
        ]
      },
      { type: 'item', path: '/theory', icon: '📖', label: Lang.t('nav_theory') },
    ];
  }

  function _getPathTitles() {
    return {
      '/':             Lang.t('nav_home'),
      '/browse':       Lang.t('nav_browse'),
      '/kanji':        Lang.t('nav_browse'),
      '/flashcard':    Lang.t('nav_flashcard'),
      '/quiz':         Lang.t('nav_quiz'),
      '/grammar':      Lang.t('nav_grammar'),
      '/particles':    Lang.t('nav_particles'),
      '/transitivity': Lang.t('nav_transitivity'),
      '/theory':       Lang.t('nav_theory'),
    };
  }

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
        '<span class="top-bar-title" id="top-bar-title">Nihongo Progressive</span>' +
      '</div>' +
      '<div class="top-bar-right">' +
        _langSwitcherHTML('top') +
        '<button class="hamburger-btn" id="hamburger-btn" aria-label="Abrir menu">☰</button>' +
      '</div>';

    document.getElementById('hamburger-btn').addEventListener('click', _openDrawer);
    document.getElementById('lang-sw-top').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lang]');
      if (btn) _onLangSelect(btn.dataset.lang);
    });
  }

  function renderDrawer() {
    // Clean up existing elements
    var existingOverlay = document.getElementById('nav-overlay');
    var existingDrawer  = document.getElementById('nav-drawer');
    if (existingOverlay) document.body.removeChild(existingOverlay);
    if (existingDrawer)  document.body.removeChild(existingDrawer);

    var stats = KanjiStorage.getStats();
    var pct   = stats.pct;

    var bodyHTML = _getDrawerStructure().map(function (entry) {
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

    var overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', _closeDrawer);

    var drawer = document.createElement('nav');
    drawer.id = 'nav-drawer';
    drawer.className = 'nav-drawer';
    drawer.innerHTML =
      '<div class="drawer-header">' +
        '<div class="drawer-logo">' +
          '<span class="drawer-kanji">漢</span>' +
          '<div class="drawer-logo-text">' +
            '<span class="drawer-title">' + Lang.t('site_name') + '</span>' +
            '<span class="drawer-sub">' + Lang.t('site_sub') + '</span>' +
          '</div>' +
        '</div>' +
        '<button class="drawer-close-btn" id="drawer-close-btn" aria-label="Fechar menu">✕</button>' +
      '</div>' +
      '<div class="drawer-body">' + bodyHTML + '</div>' +
      '<div class="drawer-progress">' +
        '<div class="prog-label">' +
          '<span>' + Lang.t('nav_progress') + '</span>' +
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

    var items = _getSidebarItems().map(function (item) {
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
          '<span class="logo-title">' + Lang.t('site_name') + '</span>' +
          '<span class="logo-sub">' + Lang.t('site_sub') + '</span>' +
        '</div>' +
      '</div>' +
      '<nav class="sidebar-nav">' + items + '</nav>' +
      '<div class="sidebar-lang">' +
        _langSwitcherHTML('sidebar') +
      '</div>' +
      '<div class="sidebar-progress">' +
        '<div class="prog-label">' +
          '<span>' + Lang.t('nav_progress') + '</span>' +
          '<span id="sidebar-pct">' + pct + '%</span>' +
        '</div>' +
        '<div class="prog-bar-wrap">' +
          '<div class="prog-bar-fill" id="sidebar-prog-fill" style="width:' + pct + '%"></div>' +
        '</div>' +
      '</div>';

    el.addEventListener('click', function (e) {
      var navItem = e.target.closest('[data-nav]');
      if (navItem) KanjiApp.navigate(navItem.dataset.nav);
      var langBtn = e.target.closest('[data-lang]');
      if (langBtn) _onLangSelect(langBtn.dataset.lang);
    });
  }

  function _langSwitcherHTML(id) {
    var cur = Lang.get();
    return '<div class="lang-switcher" id="lang-sw-' + id + '">' +
      '<button class="ls-opt' + (cur === 'pt' ? ' active' : '') + '" data-lang="pt">PT</button>' +
      '<button class="ls-opt' + (cur === 'en' ? ' active' : '') + '" data-lang="en">EN</button>' +
    '</div>';
  }

  function _onLangSelect(lang) {
    if (Lang.get() === lang) return;
    Lang.set(lang);
    refreshLang();
    KanjiApp.rerender();
  }

  function refreshLang() {
    renderSidebar();
    renderTopBar();
    renderDrawer();
    // Restore active state
    var hash = location.hash;
    var path = hash ? hash.slice(1) : '/';
    updateActive(path || '/');
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

    // Top bar title (mobile)
    var titleEl = document.getElementById('top-bar-title');
    if (titleEl) {
      var titles = _getPathTitles();
      var title = Lang.t('nav_home');
      if (path !== '/') {
        var keys = Object.keys(titles).filter(function (k) { return k !== '/'; });
        for (var i = 0; i < keys.length; i++) {
          if (path.startsWith(keys[i])) { title = titles[keys[i]]; break; }
        }
      }
      titleEl.textContent = title;
    }
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

  return { render: render, updateActive: updateActive, updateProgress: updateProgress, refreshLang: refreshLang, renderSidebar: renderSidebar, renderTopBar: renderTopBar };

})();

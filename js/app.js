// ============================================================
// app.js — Router, global state, keyboard handler, init
// ============================================================

var KanjiApp = (function () {

  var _currentView = null;
  var _keyHandler  = null;
  var _container   = null;

  // ---- Routes ----
  var ROUTES = [
    { pattern: /^\/$/,                        view: HomeView },
    { pattern: /^\/theory(\/\w+)?$/,          view: TheoryView },
    { pattern: /^\/browse$/,                  view: BrowseView, params: [null, null, null] },
    { pattern: /^\/browse\/(\d+)$/,           view: BrowseView },
    { pattern: /^\/browse\/(\d+)\/(\d+)$/,    view: BrowseView },
    { pattern: /^\/kanji\/(\d+)$/,            view: CardView },
    { pattern: /^\/flashcard(\/.*)?$/,        view: FlashcardView },
    { pattern: /^\/quiz(\/.*)?$/,             view: QuizView },
  ];

  function _resolve(path) {
    for (var i = 0; i < ROUTES.length; i++) {
      var m = path.match(ROUTES[i].pattern);
      if (m) return { view: ROUTES[i].view, params: m };
    }
    return null;
  }

  // ---- Navigation ----
  function navigate(path) {
    location.hash = '#' + path;
  }

  function _onHashChange() {
    var hash = location.hash;
    var path = hash ? hash.slice(1) : '/';
    if (!path) path = '/';

    var route = _resolve(path);
    if (!route) route = { view: HomeView, params: ['/'] };

    // Destroy previous view
    if (_currentView && _currentView.destroy) _currentView.destroy();
    _keyHandler = null;

    _currentView = route.view;
    _container.innerHTML = '';
    _currentView.render(_container, route.params);

    Navbar.updateActive(path);
    window.scrollTo(0, 0);
  }

  // ---- Keyboard ----
  function setKeyHandler(fn) {
    _keyHandler = fn;
  }

  function _onKeyDown(e) {
    // Ignore when typing in inputs
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    if (_keyHandler) _keyHandler(e);

    // Global shortcuts
    if (e.key === 'Escape') {
      Modal.close();
    }
  }

  // ---- Init ----
  function init() {
    if (!window.KANJI_DATA || !window.KANJI_DATA.length) {
      document.getElementById('app').innerHTML =
        '<div class="empty-state">' +
          '<div class="es-icon">⚠️</div>' +
          '<div class="es-title">Dados não encontrados</div>' +
          '<p class="text-muted" style="margin-top:8px">Execute <code>python extract_data.py</code> para gerar o arquivo de dados.</p>' +
        '</div>';
      return;
    }

    // Initialize data
    KanjiData.init(window.KANJI_DATA);

    _container = document.getElementById('app');

    // Patch flashcard to handle custom pool (from quiz "study errors")
    var origFCRender = FlashcardView.render;
    FlashcardView.render = function (container, params) {
      if (params[1] && params[1].indexOf('custom') !== -1 && window._fcOverridePool) {
        var pool = window._fcOverridePool.slice();
        window._fcOverridePool = null;
        FlashcardView._runWithPool(container, pool);
        return;
      }
      origFCRender.call(FlashcardView, container, params);
    };

    // Render navbar
    Navbar.render();

    // Listen for hash changes
    window.addEventListener('hashchange', _onHashChange);
    window.addEventListener('keydown', _onKeyDown);

    // Initial render
    if (!location.hash || location.hash === '#') {
      navigate('/');
    } else {
      _onHashChange();
    }
  }

  // ---- Public API ----
  return {
    navigate: navigate,
    setKeyHandler: setKeyHandler,
    init: init,
  };

})();

// Extend FlashcardView with custom pool runner
FlashcardView._runWithPool = function (container, pool) {
  if (!pool || !pool.length) {
    KanjiApp.navigate('/flashcard');
    return;
  }
  // Access private-ish state via the closure workaround
  // We reinitialize by re-rendering with a temporary override
  window._fcOverridePool = pool;
  FlashcardView._forcePool = pool;

  var shuffled = KanjiData.shuffle(pool.slice());
  var position = 0;
  var results  = [];
  var flipped  = false;
  var mode     = 'kanji-to-meaning';

  function renderCard() {
    if (position >= shuffled.length) {
      // Simple done screen
      var correct = results.filter(function(r){ return r.correct; }).length;
      container.innerHTML =
        '<div class="view-enter fc-result-screen">' +
          '<div class="fc-result-score">' + correct + ' / ' + shuffled.length + '</div>' +
          '<div class="fc-result-label">Sessão de revisão concluída!</div>' +
          '<div class="fc-result-actions mt-16">' +
            '<button class="btn btn-primary btn-lg" id="btn-back-flash">← Voltar ao Quiz</button>' +
          '</div>' +
        '</div>';
      container.querySelector('#btn-back-flash').addEventListener('click', function () {
        KanjiApp.navigate('/quiz');
      });
      return;
    }

    var k = shuffled[position];
    var total = shuffled.length;
    var pct = Math.round((position / total) * 100);

    container.innerHTML =
      '<div class="view-enter flashcard-session">' +
        '<div class="fc-progress-bar"><div class="fc-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="fc-counter">' + (position + 1) + ' / ' + total + ' (Revisão de erros)</div>' +
        '<div class="flip-card-wrap" id="flip-wrap">' +
          '<div class="flip-card-inner">' +
            '<div class="flip-card-front">' +
              '<div class="fc-big-kanji">' + k.k + '</div>' +
              '<div class="fc-hint">Clique para virar</div>' +
            '</div>' +
            '<div class="flip-card-back">' +
              '<div class="fc-big-kanji" style="font-size:3rem">' + k.k + '</div>' +
              '<div class="fc-big-text" style="font-size:1.4rem">' + (k.pt || '') + '</div>' +
              (k.kun ? '<div class="fc-reading">Kun: ' + k.kun + '</div>' : '') +
              (k.on  ? '<div class="fc-reading">On: '  + k.on  + '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div id="fc-controls" style="display:none" class="fc-controls">' +
          '<button class="btn btn-danger" id="btn-wrong">✗ Não sei</button>' +
          '<button class="btn btn-success" id="btn-correct">✓ Sei</button>' +
        '</div>' +
        '<div class="fc-keyboard-hint">Espaço = virar | ← errei | → acertei</div>' +
      '</div>';

    flipped = false;
    var wrap     = container.querySelector('#flip-wrap');
    var controls = container.querySelector('#fc-controls');

    function doFlip() {
      if (flipped) return;
      flipped = true;
      wrap.classList.add('flipped');
      controls.style.display = 'flex';
    }

    wrap.addEventListener('click', doFlip);

    container.querySelector('#btn-wrong').addEventListener('click', function () {
      results.push({ id: k.id, correct: false });
      var reinsert = Math.min(position + 4, shuffled.length);
      shuffled.splice(reinsert, 0, k);
      position++;
      renderCard();
    });

    container.querySelector('#btn-correct').addEventListener('click', function () {
      results.push({ id: k.id, correct: true });
      position++;
      renderCard();
    });

    KanjiApp.setKeyHandler(function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); doFlip(); }
      if (e.key === 'ArrowLeft'  && flipped) container.querySelector('#btn-wrong').click();
      if (e.key === 'ArrowRight' && flipped) container.querySelector('#btn-correct').click();
    });
  }

  renderCard();
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  KanjiApp.init();
});

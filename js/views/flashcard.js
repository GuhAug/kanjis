// ============================================================
// flashcard.js — Flashcard review mode
// ============================================================

var FlashcardView = (function () {

  var _deck = [];
  var _position = 0;
  var _results = [];
  var _flipped = false;
  var _mode = 'kanji-to-meaning';
  var _level = 0;
  var _chapter = 0;

  function render(container, params) {
    if (params[1] && params[1] !== '/session') {
      var parts = params[1].replace(/^\//, '').split('/');
      _level   = parseInt(parts[0]) || 0;
      _chapter = parseInt(parts[1]) || 0;
      _startSession(container);
    } else if (_deck.length > 0 && params[1] === '/session') {
      _renderCard(container);
    } else {
      _renderConfig(container);
    }
  }

  // ---- Config screen ----
  function _renderConfig(container) {
    var levels = KanjiData.getLevels();

    var levelOpts = '<option value="0">' + Lang.t('fc_all_levels') + '</option>' +
      levels.map(function (lv) {
        return '<option value="' + lv.level + '">' + (Lang.t('level_' + lv.level) || lv.name) + ' (' + lv.count + ')</option>';
      }).join('');

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('fc_title') + '</h1>' +
          '<p>' + Lang.t('fc_subtitle') + '</p>' +
        '</div>' +
        '<div class="flashcard-config card">' +
          '<div class="field">' +
            '<label>' + Lang.t('fc_level') + '</label>' +
            '<select id="fc-level">' + levelOpts + '</select>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('fc_chapter') + '</label>' +
            '<select id="fc-chapter"><option value="0">' + Lang.t('fc_all_chapters') + '</option></select>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('fc_mode') + '</label>' +
            '<div class="quiz-type-options">' +
              _modeOpt('kanji-to-meaning', '🀄', Lang.t('fc_km_title'), Lang.t('fc_km_desc')) +
              _modeOpt('meaning-to-kanji', '🔤', Lang.t('fc_mk_title'), Lang.t('fc_mk_desc')) +
              _modeOpt('kanji-to-reading', '📢', Lang.t('fc_kr_title'), Lang.t('fc_kr_desc')) +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary btn-lg w-full mt-16" id="btn-start-fc">' + Lang.t('fc_start') + '</button>' +
        '</div>' +
      '</div>';

    var levelSel   = container.querySelector('#fc-level');
    var chapterSel = container.querySelector('#fc-chapter');

    function updateChapters() {
      var lv = parseInt(levelSel.value);
      var chapters = lv ? KanjiData.getChaptersForLevel(lv) : [];
      chapterSel.innerHTML = '<option value="0">' + Lang.t('fc_all_chapters') + '</option>' +
        chapters.map(function (ch) {
          return '<option value="' + ch + '">' + Lang.t('fc_chapter_n') + ' ' + ch + '</option>';
        }).join('');
    }

    levelSel.addEventListener('change', updateChapters);

    container.querySelectorAll('.quiz-type-opt').forEach(function (el) {
      el.addEventListener('click', function () {
        container.querySelectorAll('.quiz-type-opt').forEach(function (x) { x.classList.remove('selected'); });
        el.classList.add('selected');
        _mode = el.dataset.mode;
      });
    });
    container.querySelector('[data-mode="kanji-to-meaning"]').classList.add('selected');
    _mode = 'kanji-to-meaning';

    container.querySelector('#btn-start-fc').addEventListener('click', function () {
      _level   = parseInt(levelSel.value);
      _chapter = parseInt(chapterSel.value);
      _startSession(container);
    });
  }

  function _modeOpt(mode, icon, title, desc) {
    return '<div class="quiz-type-opt" data-mode="' + mode + '">' +
      '<span class="qt-icon">' + icon + '</span>' +
      '<div class="qt-text">' +
        '<div class="qt-title">' + title + '</div>' +
        '<div class="qt-desc">' + desc + '</div>' +
      '</div>' +
    '</div>';
  }

  // ---- Session ----
  function _startSession(container) {
    var pool = KanjiData.getPool(_level, _chapter);

    if (_mode === 'kanji-to-reading') {
      pool = pool.filter(function (k) { return k.kun || k.on; });
    }

    if (!pool.length) {
      container.innerHTML = '<div class="empty-state"><div class="es-icon">😕</div><div class="es-title">' + Lang.t('fc_no_kanji') + '</div></div>';
      return;
    }

    _deck     = KanjiData.shuffle(pool.slice());
    _position = 0;
    _results  = [];
    _flipped  = false;
    _renderCard(container);
  }

  function _renderCard(container) {
    if (_position >= _deck.length) {
      _renderResults(container);
      return;
    }

    var k = _deck[_position];
    var total = _deck.length;
    var pct = Math.round((_position / total) * 100);

    var front = _buildFront(k);
    var back  = _buildBack(k);

    container.innerHTML =
      '<div class="view-enter flashcard-session">' +
        '<div class="fc-progress-bar"><div class="fc-progress-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="fc-counter">' + (_position + 1) + ' / ' + total + '</div>' +

        '<div class="flip-card-wrap" id="flip-wrap">' +
          '<div class="flip-card-inner" id="flip-inner">' +
            '<div class="flip-card-front">' + front + '</div>' +
            '<div class="flip-card-back">' + back + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="fc-controls" id="fc-controls" style="display:none">' +
          '<button class="btn btn-danger" id="btn-wrong">' + Lang.t('fc_btn_wrong') + '</button>' +
          '<button class="btn btn-success" id="btn-correct">' + Lang.t('fc_btn_correct') + '</button>' +
        '</div>' +

        '<div id="fc-flip-hint" class="fc-keyboard-hint">' + Lang.t('fc_flip_instruction') + '</div>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="btn-exit-fc" style="font-size:0.85rem;opacity:0.6">' + Lang.t('fc_exit') + '</button>' +
        '</div>' +
      '</div>';

    _flipped = false;

    var flipWrap    = container.querySelector('#flip-wrap');
    var fcControls  = container.querySelector('#fc-controls');
    var fcHint      = container.querySelector('#fc-flip-hint');
    var btnWrong    = container.querySelector('#btn-wrong');
    var btnCorrect  = container.querySelector('#btn-correct');

    function doFlip() {
      if (_flipped) return;
      _flipped = true;
      flipWrap.classList.add('flipped');
      fcControls.style.display = 'flex';
      fcHint.textContent = Lang.t('fc_did_you_know');
      KanjiStorage.markSeen(k.id);
      Navbar.updateProgress();
    }

    flipWrap.addEventListener('click', doFlip);

    btnWrong.addEventListener('click', function () {
      _results.push({ id: k.id, correct: false });
      var reinsert = Math.min(_position + 4, _deck.length);
      _deck.splice(reinsert, 0, k);
      _position++;
      _renderCard(container);
    });

    btnCorrect.addEventListener('click', function () {
      _results.push({ id: k.id, correct: true });
      _position++;
      _renderCard(container);
    });

    container.querySelector('#btn-exit-fc').addEventListener('click', function () {
      _deck = [];
      _position = 0;
      _results = [];
      _renderConfig(container);
    });

    KanjiApp.setKeyHandler(function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); doFlip(); }
      if (e.key === 'ArrowLeft'  && _flipped) btnWrong.click();
      if (e.key === 'ArrowRight' && _flipped) btnCorrect.click();
      if (e.key === 'a' && _flipped) btnWrong.click();
      if (e.key === 'd' && _flipped) btnCorrect.click();
    });
  }

  function _buildFront(k) {
    if (_mode === 'kanji-to-meaning' || _mode === 'kanji-to-reading') {
      return '<div class="fc-big-kanji">' + k.k + '</div>' +
        '<div class="fc-hint">' + Lang.t('fc_flip_hint') + '</div>';
    }
    return '<div class="fc-big-text">' + KanjiData.meaning(k) + '</div>' +
      '<div class="fc-hint">' + Lang.t('fc_flip_hint') + '</div>';
  }

  function _buildBack(k) {
    if (_mode === 'kanji-to-meaning') {
      return '<div class="fc-big-kanji" style="font-size:3rem">' + k.k + '</div>' +
        '<div class="fc-big-text" style="font-size:1.4rem">' + KanjiData.meaning(k) + '</div>' +
        (k.kun ? '<div class="fc-reading">Kun: ' + k.kun + '</div>' : '') +
        (k.on  ? '<div class="fc-reading">On: '  + k.on  + '</div>' : '') +
        (k.kunEx ? '<div class="fc-example example-jp">' + (k.kunExHtml || KanjiData.annotateEx(k.kunEx, k.k)) + '</div>' : '') +
        (k.kunTr ? '<div class="fc-translation">' + KanjiData.exTr(k, 'kun') + '</div>' : '');
    }
    if (_mode === 'meaning-to-kanji') {
      return '<div class="fc-big-kanji">' + k.k + '</div>' +
        '<div class="fc-big-text" style="font-size:1.2rem">' + KanjiData.meaning(k) + '</div>' +
        (k.kun ? '<div class="fc-reading">Kun: ' + k.kun + '</div>' : '') +
        (k.on  ? '<div class="fc-reading">On: '  + k.on  + '</div>' : '');
    }
    var readingsHtml = '';
    if (k.kun) readingsHtml += '<div class="fc-reading" style="font-size:1.4rem;color:var(--text)">Kun: ' + k.kun + '</div>';
    if (k.on)  readingsHtml += '<div class="fc-reading" style="font-size:1.4rem;color:var(--text)">On: '  + k.on  + '</div>';
    return '<div class="fc-big-kanji" style="font-size:3rem">' + k.k + '</div>' +
      readingsHtml +
      '<div style="font-size:0.9rem;color:var(--text-muted)">' + KanjiData.meaning(k) + '</div>';
  }

  // ---- Results ----
  function _renderResults(container) {
    var seen = {};
    var correct = 0;
    for (var i = _results.length - 1; i >= 0; i--) {
      var r = _results[i];
      if (!seen[r.id]) {
        seen[r.id] = true;
        if (r.correct) correct++;
      }
    }
    var uniqueTotal = Object.keys(seen).length;
    var pct = uniqueTotal ? Math.round((correct / uniqueTotal) * 100) : 0;

    var wrongIds = [];
    var lastAttempt = {};
    for (var j = 0; j < _results.length; j++) {
      lastAttempt[_results[j].id] = _results[j].correct;
    }
    for (var id in lastAttempt) {
      if (!lastAttempt[id]) wrongIds.push(parseInt(id));
    }

    var emoji = pct === 100 ? '🎉' : pct >= 70 ? '👍' : '💪';

    container.innerHTML =
      '<div class="view-enter fc-result-screen">' +
        '<div class="text-center">' +
          '<div style="font-size:3rem">' + emoji + '</div>' +
          '<div class="fc-result-score">' + correct + ' / ' + uniqueTotal + '</div>' +
          '<div class="fc-result-label">' + pct + Lang.t('fc_pct_score') + '</div>' +
        '</div>' +
        '<div class="divider"></div>' +
        '<div class="fc-result-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo-all">' + Lang.t('fc_redo_all') + '</button>' +
          (wrongIds.length > 0 ?
            '<button class="btn btn-secondary btn-lg" id="btn-redo-wrong">' + Lang.t('fc_redo_wrong') + ' (' + wrongIds.length + ')</button>' : '') +
          '<button class="btn btn-ghost" id="btn-back">' + Lang.t('fc_back') + '</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-redo-all').addEventListener('click', function () {
      _startSession(container);
    });

    var btnWrong = container.querySelector('#btn-redo-wrong');
    if (btnWrong) btnWrong.addEventListener('click', function () {
      var pool = wrongIds.map(function (id) { return KanjiData.getById(id); }).filter(Boolean);
      _deck     = KanjiData.shuffle(pool);
      _position = 0;
      _results  = [];
      _flipped  = false;
      _renderCard(container);
    });

    container.querySelector('#btn-back').addEventListener('click', function () {
      _deck = [];
      _position = 0;
      _results = [];
      _renderConfig(container);
    });

    KanjiApp.setKeyHandler(null);
  }

  function destroy() {
    KanjiApp.setKeyHandler(null);
    _deck = [];
    _position = 0;
    _results = [];
  }

  return { render: render, destroy: destroy };

})();

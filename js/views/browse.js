// ============================================================
// browse.js — Browse kanji by level → chapter → grid
// ============================================================

var BrowseView = (function () {

  var LEVEL_COLORS = { 1: 'l1', 2: 'l2', 3: 'l3', 4: 'l4' };

  function render(container, params) {
    var level   = params[1] ? parseInt(params[1]) : null;
    var chapter = params[2] ? parseInt(params[2]) : null;

    if (level && chapter) {
      _renderKanjiGrid(container, level, chapter);
    } else if (level) {
      _renderChapterList(container, level);
    } else {
      _renderLevelList(container);
    }
  }

  function _levelName(n) {
    return Lang.t('level_' + n) || KanjiData.getLevelName(n);
  }

  // ---- Level selection ----
  function _renderLevelList(container) {
    var levels = KanjiData.getLevels();
    var stats  = KanjiStorage.getStats();

    var cards = levels.map(function (lv) {
      var s = stats.byLevel[lv.level] || { seen: 0, total: lv.count, pct: 0 };
      var cls = LEVEL_COLORS[lv.level] || '';
      var name = _levelName(lv.level);
      return '<div class="level-card ' + cls + '" data-nav="/browse/' + lv.level + '">' +
        '<div class="lc-num">' + lv.level + '</div>' +
        '<div class="lc-name">' + name + '</div>' +
        '<div class="lc-count">' + lv.count + ' ' + Lang.t('browse_kanji') + '</div>' +
        '<div class="prog-bar-wrap">' +
          '<div class="prog-bar-fill" style="width:' + s.pct + '%"></div>' +
        '</div>' +
        '<div style="font-size:0.75rem;color:var(--text-muted);margin-top:6px">' + s.seen + '/' + s.total + ' ' + Lang.t('browse_studied') + '</div>' +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('browse_title') + '</h1>' +
          '<p>' + Lang.t('browse_subtitle') + '</p>' +
        '</div>' +
        '<div class="level-cards-grid">' + cards + '</div>' +
      '</div>';

    _bindNavClicks(container);
  }

  // ---- Chapter list ----
  function _renderChapterList(container, level) {
    var levelName = _levelName(level);
    var chapters  = KanjiData.getChaptersForLevel(level);

    var cards = chapters.map(function (ch) {
      var kanji = KanjiData.getChapter(level, ch);
      var seen = 0, mastered = 0;
      kanji.forEach(function (k) {
        if (KanjiStorage.isMastered(k.id)) mastered++;
        else if (KanjiStorage.isSeen(k.id)) seen++;
      });
      return '<div class="chapter-card" data-nav="/browse/' + level + '/' + ch + '">' +
        '<div class="cc-jp">' + KanjiData.getChapterLabel(ch) + '</div>' +
        '<div class="cc-num">' + Lang.t('browse_chapter') + ' ' + ch + '</div>' +
        '<div class="cc-count">' + kanji.length + ' ' + Lang.t('browse_kanji') + '</div>' +
        (seen + mastered > 0 ?
          '<div style="margin-top:6px;font-size:0.72rem;color:var(--text-muted)">' +
            (mastered > 0 ? '<span style="color:var(--success)">⭐' + mastered + ' dom.</span> ' : '') +
            (seen > 0 ? '<span style="color:var(--accent2)">👁️' + seen + ' ' + Lang.t('browse_studied') + '</span>' : '') +
          '</div>' : '') +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="breadcrumb">' +
          '<a data-nav="/browse">' + Lang.t('browse_levels') + '</a>' +
          '<span>›</span>' +
          '<span>' + levelName + '</span>' +
        '</div>' +
        '<div class="page-header">' +
          '<h1>' + levelName + '</h1>' +
          '<p>' + Lang.t('browse_select_chapter') + '</p>' +
        '</div>' +
        '<div class="chapter-cards-grid">' + cards + '</div>' +
      '</div>';

    _bindNavClicks(container);
  }

  // ---- Kanji grid ----
  function _renderKanjiGrid(container, level, chapter) {
    var levelName = _levelName(level);
    var kanji = KanjiData.getChapter(level, chapter);
    var chLabel = KanjiData.getChapterLabel(chapter);

    if (!kanji.length) {
      container.innerHTML = '<div class="empty-state"><div class="es-icon">😕</div><div class="es-title">' + Lang.t('browse_not_found') + '</div></div>';
      return;
    }

    var cells = kanji.map(function (k) {
      var cls = KanjiStorage.isMastered(k.id) ? 'mastered' : KanjiStorage.isSeen(k.id) ? 'seen' : '';
      return '<div class="kanji-cell ' + cls + '" data-kanji-id="' + k.id + '">' +
        '<div class="kc-dot"></div>' +
        '<div class="kc-char">' + k.k + '</div>' +
        '<div class="kc-pt">' + (k.pt || '') + '</div>' +
      '</div>';
    }).join('');

    var mastered = kanji.filter(function (k) { return KanjiStorage.isMastered(k.id); }).length;

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="breadcrumb">' +
          '<a data-nav="/browse">' + Lang.t('browse_levels') + '</a>' +
          '<span>›</span>' +
          '<a data-nav="/browse/' + level + '">' + levelName + '</a>' +
          '<span>›</span>' +
          '<span>' + Lang.t('browse_chapter') + ' ' + chapter + '</span>' +
        '</div>' +
        '<div class="chapter-info-bar">' +
          '<h2 style="font-size:1.3rem;font-weight:700">' +
            '<span style="font-family:\'Noto Sans JP\',serif">' + chLabel + '</span>' +
            ' — ' + Lang.t('browse_chapter') + ' ' + chapter +
          '</h2>' +
          '<div class="flex-gap">' +
            '<span class="badge badge-level-' + level + '">' + levelName + '</span>' +
            '<span class="badge badge-muted">' + kanji.length + ' ' + Lang.t('browse_kanji') + '</span>' +
            (mastered ? '<span class="badge badge-success">⭐ ' + mastered + '</span>' : '') +
          '</div>' +
        '</div>' +
        '<div class="flex-gap mb-16">' +
          '<button class="btn btn-secondary btn-sm" id="btn-flashcard-ch">🃏 ' + Lang.t('nav_flashcard') + '</button>' +
          '<button class="btn btn-secondary btn-sm" id="btn-quiz-ch">✏️ ' + Lang.t('nav_quiz') + '</button>' +
        '</div>' +
        '<div class="kanji-grid" id="kanji-grid">' + cells + '</div>' +
      '</div>';

    container.querySelector('#btn-flashcard-ch').addEventListener('click', function () {
      KanjiApp.navigate('/flashcard/' + level + '/' + chapter);
    });
    container.querySelector('#btn-quiz-ch').addEventListener('click', function () {
      KanjiApp.navigate('/quiz/' + level + '/' + chapter);
    });

    container.querySelector('#kanji-grid').addEventListener('click', function (e) {
      var cell = e.target.closest('[data-kanji-id]');
      if (cell) KanjiApp.navigate('/kanji/' + cell.dataset.kanjiId);
    });

    _bindNavClicks(container);
  }

  function _bindNavClicks(container) {
    container.addEventListener('click', function (e) {
      var el = e.target.closest('[data-nav]');
      if (el) KanjiApp.navigate(el.dataset.nav);
    });
  }

  function destroy() {}

  return { render: render, destroy: destroy };

})();

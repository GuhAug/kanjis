// ============================================================
// card.js — Individual kanji study card
// ============================================================

var CardView = (function () {

  // ---- Furigana helpers ----

  function _isKanji(ch) {
    var code = ch.charCodeAt(0);
    return (code >= 0x4E00 && code <= 0x9FFF) ||
           (code >= 0x3400 && code <= 0x4DBF);
  }

  function _shortestReading(k) {
    var kun = k.kun ? k.kun.split('、')[0].replace(/[（(][^）)]*[）)]/g, '').replace(/[～〜~]/g, '').trim() : null;
    var on  = k.on  ? k.on.split('、')[0].replace(/[（(][^）)]*[）)]/g, '').replace(/[～〜~]/g, '').trim() : null;
    if (on) on = on.replace(/[ァ-ン]/g, function (ch) { return String.fromCharCode(ch.charCodeAt(0) - 0x60); });
    return kun || on || null;
  }

  function _buildKnownData(currentKanji) {
    var known      = {};
    var readingMap = {};

    var all = KanjiData.getAll();
    for (var i = 0; i < all.length; i++) {
      var k = all[i];
      if (!k.k) continue;

      var reading = _shortestReading(k);
      if (reading) readingMap[k.k] = reading;

      var sameOrEarlierLevel   = k.level < currentKanji.level;
      var sameLevel            = k.level === currentKanji.level;
      var sameOrEarlierChapter = k.chapter <= currentKanji.chapter;

      if (sameOrEarlierLevel || (sameLevel && sameOrEarlierChapter)) {
        known[k.k] = true;
      }
    }

    return { known: known, readingMap: readingMap };
  }

  function _annotateText(text, known, readingMap) {
    if (!text) return '';
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (_isKanji(ch)) {
        if (known[ch]) {
          result += ch;
        } else {
          var reading = readingMap[ch];
          if (reading) {
            result += '<ruby>' + ch + '<rt>' + reading + '</rt></ruby>';
          } else {
            result += '<span class="kanji-unknown" title="' + Lang.t('card_unknown_title') + '">' + ch + '</span>';
          }
        }
      } else {
        result += ch;
      }
    }
    return result;
  }

  // ---- Render ----

  function render(container, params) {
    var id = parseInt(params[1]);
    var k  = KanjiData.getById(id);

    if (!k) {
      container.innerHTML = '<div class="empty-state"><div class="es-icon">😕</div><div class="es-title">' + Lang.t('card_not_found') + '</div></div>';
      return;
    }

    var levelName  = KanjiData.getLevelName(k.level);
    var chLabel    = KanjiData.getChapterLabel(k.chapter);
    var isSeen     = KanjiStorage.isSeen(k.id);
    var isMastered = KanjiStorage.isMastered(k.id);

    var chapterKanji = KanjiData.getChapter(k.level, k.chapter);
    var idx  = chapterKanji.findIndex(function (x) { return x.id === k.id; });
    var prev = idx > 0 ? chapterKanji[idx - 1] : null;
    var next = idx < chapterKanji.length - 1 ? chapterKanji[idx + 1] : null;

    var knownData  = _buildKnownData(k);
    var known      = knownData.known;
    var readingMap = knownData.readingMap;

    var kunExHtml = _annotateText(k.kunEx, known, readingMap);
    var onExHtml  = _annotateText(k.onEx,  known, readingMap);

    var capLabel = Lang.t('browse_cap') + ' ';

    container.innerHTML =
      '<div class="view-enter kanji-card-page">' +
        '<div class="breadcrumb">' +
          '<a data-nav="/browse">' + Lang.t('card_levels') + '</a>' +
          '<span>›</span>' +
          '<a data-nav="/browse/' + k.level + '">' + levelName + '</a>' +
          '<span>›</span>' +
          '<a data-nav="/browse/' + k.level + '/' + k.chapter + '">' + capLabel + k.chapter + '</a>' +
          '<span>›</span>' +
          '<span>' + k.k + '</span>' +
        '</div>' +

        '<div class="kanji-display-box">' +
          '<div class="flex-between mb-8">' +
            '<span class="badge badge-level-' + k.level + '">' + levelName + '</span>' +
            '<span class="badge badge-muted">' + capLabel + k.chapter + ' — ' + chLabel + '</span>' +
          '</div>' +
          '<span class="kanji-main-char">' + k.k + '</span>' +
          '<div class="kanji-meaning">' + (k.pt || '') + '</div>' +
          '<div class="readings-row">' +
            (k.kun ? '<div class="reading-box"><div class="rb-label">' + Lang.t('card_kun_reading') + '</div><div class="rb-value">' + k.kun + '</div></div>' : '') +
            (k.on  ? '<div class="reading-box"><div class="rb-label">' + Lang.t('card_on_reading')  + '</div><div class="rb-value">' + k.on  + '</div></div>' : '') +
          '</div>' +
        '</div>' +

        (k.kunEx ? _exampleSection(Lang.t('card_kun_reading'), kunExHtml, k.kunTr) : '') +
        (k.onEx  ? _exampleSection(Lang.t('card_on_reading'),  onExHtml,  k.onTr)  : '') +

        '<div class="kanji-legend">' +
          '<span class="legend-item"><span class="legend-dot known"></span> ' + Lang.t('card_legend_known') + '</span>' +
          '<span class="legend-item"><span class="legend-dot unknown"></span> ' + Lang.t('card_legend_unknown') + '</span>' +
        '</div>' +

        '<div class="kanji-actions">' +
          '<button class="btn btn-secondary btn-seen' + (isSeen ? ' active' : '') + '" id="btn-seen">' +
            (isSeen ? Lang.t('card_seen') : Lang.t('card_mark_seen')) +
          '</button>' +
          '<button class="btn btn-secondary btn-mastered' + (isMastered ? ' active' : '') + '" id="btn-mastered">' +
            (isMastered ? Lang.t('card_mastered') : Lang.t('card_mark_mastered')) +
          '</button>' +
        '</div>' +

        '<div class="kanji-nav">' +
          '<button class="btn btn-secondary" id="btn-prev" ' + (prev ? '' : 'disabled') + '>' + Lang.t('card_prev') + '</button>' +
          '<button class="btn btn-secondary" id="btn-next" ' + (next ? '' : 'disabled') + '>' + Lang.t('card_next') + '</button>' +
        '</div>' +
      '</div>';

    var btnSeen     = container.querySelector('#btn-seen');
    var btnMastered = container.querySelector('#btn-mastered');
    var btnPrev     = container.querySelector('#btn-prev');
    var btnNext     = container.querySelector('#btn-next');

    btnSeen.addEventListener('click', function () {
      KanjiStorage.markSeen(k.id);
      btnSeen.textContent = Lang.t('card_seen');
      btnSeen.classList.add('active');
      Navbar.updateProgress();
      Toast.success(Lang.t('card_toast_seen'));
    });

    btnMastered.addEventListener('click', function () {
      var nowMastered = KanjiStorage.toggleMastered(k.id);
      btnMastered.textContent = nowMastered ? Lang.t('card_mastered') : Lang.t('card_mark_mastered');
      btnMastered.classList.toggle('active', nowMastered);
      btnSeen.textContent = Lang.t('card_seen');
      btnSeen.classList.add('active');
      Navbar.updateProgress();
      Toast.success(nowMastered ? Lang.t('card_toast_mastered') : Lang.t('card_toast_unmastered'));
    });

    if (prev) btnPrev.addEventListener('click', function () { KanjiApp.navigate('/kanji/' + prev.id); });
    if (next) btnNext.addEventListener('click', function () { KanjiApp.navigate('/kanji/' + next.id); });

    container.addEventListener('click', function (e) {
      var el = e.target.closest('[data-nav]');
      if (el) KanjiApp.navigate(el.dataset.nav);
    });

    KanjiApp.setKeyHandler(function (e) {
      if (e.key === 'ArrowLeft'  && prev) KanjiApp.navigate('/kanji/' + prev.id);
      if (e.key === 'ArrowRight' && next) KanjiApp.navigate('/kanji/' + next.id);
    });
  }

  function _exampleSection(label, jpHtml, pt) {
    return '<div class="example-section">' +
      '<div class="ex-label">' + label + '</div>' +
      '<div class="example-jp">' + jpHtml + '</div>' +
      (pt ? '<div class="example-pt">' + pt + '</div>' : '') +
    '</div>';
  }

  function destroy() {
    KanjiApp.setKeyHandler(null);
  }

  return { render: render, destroy: destroy };

})();

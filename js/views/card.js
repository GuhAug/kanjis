// ============================================================
// card.js — Individual kanji study card
// ============================================================

var CardView = (function () {

  // ---- Furigana helpers ----

  // Returns true if char is a CJK kanji character
  function _isKanji(ch) {
    var code = ch.charCodeAt(0);
    return (code >= 0x4E00 && code <= 0x9FFF) ||
           (code >= 0x3400 && code <= 0x4DBF);
  }

  // Extract simplest possible reading from a reading string like "ひと、ひと（つ）"
  function _shortestReading(k) {
    var kun = k.kun ? k.kun.split('、')[0].replace(/[（）()～〜~]/g, '').trim() : null;
    var on  = k.on  ? k.on.split('、')[0].replace(/[（）()～〜~]/g, '').trim() : null;
    if (kun && on) return kun.length <= on.length ? kun : on;
    return kun || on || null;
  }

  // Build the set of "known" kanji characters for a given kanji card.
  // Known = same or earlier level, same or earlier chapter.
  function _buildKnownData(currentKanji) {
    var known     = {};   // kanji char → true
    var readingMap = {};  // kanji char → simplest reading (for ALL kanji, for annotation)

    var all = KanjiData.getAll();
    for (var i = 0; i < all.length; i++) {
      var k = all[i];
      if (!k.k) continue;

      // Build reading map for every kanji regardless of known status
      var reading = _shortestReading(k);
      if (reading) readingMap[k.k] = reading;

      // A kanji is "known" if it belongs to a chapter ≤ current in level ≤ current
      var sameOrEarlierLevel   = k.level < currentKanji.level;
      var sameLevel            = k.level === currentKanji.level;
      var sameOrEarlierChapter = k.chapter <= currentKanji.chapter;

      if (sameOrEarlierLevel || (sameLevel && sameOrEarlierChapter)) {
        known[k.k] = true;
      }
    }

    return { known: known, readingMap: readingMap };
  }

  // Annotate a Japanese sentence: wrap unknown kanji in <ruby> tags.
  // Returns safe HTML string.
  function _annotateText(text, known, readingMap) {
    if (!text) return '';
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (_isKanji(ch)) {
        if (known[ch]) {
          result += ch;                              // Known kanji — show as-is
        } else {
          var reading = readingMap[ch];
          if (reading) {
            // Unknown but in our dataset → furigana
            result += '<ruby>' + ch + '<rt>' + reading + '</rt></ruby>';
          } else {
            // Unknown and not in dataset → dotted underline tooltip
            result += '<span class="kanji-unknown" title="Kanji não estudado ainda">' + ch + '</span>';
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
      container.innerHTML = '<div class="empty-state"><div class="es-icon">😕</div><div class="es-title">Kanji não encontrado</div></div>';
      return;
    }

    var levelName  = KanjiData.getLevelName(k.level);
    var chLabel    = KanjiData.getChapterLabel(k.chapter);
    var isSeen     = KanjiStorage.isSeen(k.id);
    var isMastered = KanjiStorage.isMastered(k.id);

    // Previous / Next within chapter
    var chapterKanji = KanjiData.getChapter(k.level, k.chapter);
    var idx  = chapterKanji.findIndex(function (x) { return x.id === k.id; });
    var prev = idx > 0 ? chapterKanji[idx - 1] : null;
    var next = idx < chapterKanji.length - 1 ? chapterKanji[idx + 1] : null;

    // Build known-kanji data for furigana annotation
    var knownData  = _buildKnownData(k);
    var known      = knownData.known;
    var readingMap = knownData.readingMap;

    // Annotate example sentences
    var kunExHtml = _annotateText(k.kunEx, known, readingMap);
    var onExHtml  = _annotateText(k.onEx,  known, readingMap);

    container.innerHTML =
      '<div class="view-enter kanji-card-page">' +
        '<div class="breadcrumb">' +
          '<a data-nav="/browse">Níveis</a>' +
          '<span>›</span>' +
          '<a data-nav="/browse/' + k.level + '">' + levelName + '</a>' +
          '<span>›</span>' +
          '<a data-nav="/browse/' + k.level + '/' + k.chapter + '">Cap. ' + k.chapter + '</a>' +
          '<span>›</span>' +
          '<span>' + k.k + '</span>' +
        '</div>' +

        '<div class="kanji-display-box">' +
          '<div class="flex-between mb-8">' +
            '<span class="badge badge-level-' + k.level + '">' + levelName + '</span>' +
            '<span class="badge badge-muted">Cap. ' + k.chapter + ' — ' + chLabel + '</span>' +
          '</div>' +
          '<span class="kanji-main-char">' + k.k + '</span>' +
          '<div class="kanji-meaning">' + (k.pt || '') + '</div>' +
          '<div class="readings-row">' +
            (k.kun ? '<div class="reading-box"><div class="rb-label">Leitura Kun</div><div class="rb-value">' + k.kun + '</div></div>' : '') +
            (k.on  ? '<div class="reading-box"><div class="rb-label">Leitura On</div><div class="rb-value">'  + k.on  + '</div></div>' : '') +
          '</div>' +
        '</div>' +

        (k.kunEx ? _exampleSection('Leitura Kun', kunExHtml, k.kunTr) : '') +
        (k.onEx  ? _exampleSection('Leitura On',  onExHtml,  k.onTr)  : '') +

        '<div class="kanji-legend">' +
          '<span class="legend-item"><span class="legend-dot known"></span> Kanji estudado</span>' +
          '<span class="legend-item"><span class="legend-dot unknown"></span> Kanji ainda não estudado (leitura mostrada)</span>' +
        '</div>' +

        '<div class="kanji-actions">' +
          '<button class="btn btn-secondary btn-seen' + (isSeen ? ' active' : '') + '" id="btn-seen">' +
            (isSeen ? '✅ Visto' : '👁️ Marcar como visto') +
          '</button>' +
          '<button class="btn btn-secondary btn-mastered' + (isMastered ? ' active' : '') + '" id="btn-mastered">' +
            (isMastered ? '⭐ Dominado' : '☆ Marcar como dominado') +
          '</button>' +
        '</div>' +

        '<div class="kanji-nav">' +
          '<button class="btn btn-secondary" id="btn-prev" ' + (prev ? '' : 'disabled') + '>← Anterior</button>' +
          '<button class="btn btn-secondary" id="btn-next" ' + (next ? '' : 'disabled') + '>Próximo →</button>' +
        '</div>' +
      '</div>';

    // Bind events
    var btnSeen     = container.querySelector('#btn-seen');
    var btnMastered = container.querySelector('#btn-mastered');
    var btnPrev     = container.querySelector('#btn-prev');
    var btnNext     = container.querySelector('#btn-next');

    btnSeen.addEventListener('click', function () {
      KanjiStorage.markSeen(k.id);
      btnSeen.textContent = '✅ Visto';
      btnSeen.classList.add('active');
      Navbar.updateProgress();
      Toast.success('Marcado como visto!');
    });

    btnMastered.addEventListener('click', function () {
      var nowMastered = KanjiStorage.toggleMastered(k.id);
      btnMastered.textContent = nowMastered ? '⭐ Dominado' : '☆ Marcar como dominado';
      btnMastered.classList.toggle('active', nowMastered);
      btnSeen.textContent = '✅ Visto';
      btnSeen.classList.add('active');
      Navbar.updateProgress();
      Toast.success(nowMastered ? 'Marcado como dominado!' : 'Removido dos dominados.');
    });

    if (prev) btnPrev.addEventListener('click', function () { KanjiApp.navigate('/kanji/' + prev.id); });
    if (next) btnNext.addEventListener('click', function () { KanjiApp.navigate('/kanji/' + next.id); });

    // Breadcrumb nav
    container.addEventListener('click', function (e) {
      var el = e.target.closest('[data-nav]');
      if (el) KanjiApp.navigate(el.dataset.nav);
    });

    // Keyboard shortcuts
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

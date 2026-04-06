// ============================================================
// card.js — Individual kanji study card
// ============================================================

var CardView = (function () {

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
            (k.on  ? '<div class="reading-box"><div class="rb-label">Leitura On</div><div class="rb-value">' + k.on  + '</div></div>' : '') +
          '</div>' +
        '</div>' +

        (k.kunEx ? _exampleSection('Leitura Kun', k.kunEx, k.kunTr) : '') +
        (k.onEx  ? _exampleSection('Leitura On',  k.onEx,  k.onTr)  : '') +

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

  function _exampleSection(label, jp, pt) {
    return '<div class="example-section">' +
      '<div class="ex-label">' + label + '</div>' +
      '<div class="example-jp">' + jp + '</div>' +
      (pt ? '<div class="example-pt">' + pt + '</div>' : '') +
    '</div>';
  }

  function destroy() {
    KanjiApp.setKeyHandler(null);
  }

  return { render: render, destroy: destroy };

})();

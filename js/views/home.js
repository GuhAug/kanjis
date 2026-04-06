// ============================================================
// home.js — Dashboard / home view
// ============================================================

var HomeView = (function () {

  var _chart = null;

  function render(container) {
    var stats = KanjiStorage.getStats();

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>Bem-vindo ao Kanji Progressive</h1>' +
          '<p>Acompanhe seu progresso e continue estudando.</p>' +
        '</div>' +

        _renderStreak(stats) +

        '<div class="stats-grid">' +
          _statCard('📊', stats.total, 'Kanji total') +
          _statCard('👁️', stats.seen, 'Estudados') +
          _statCard('⭐', stats.mastered, 'Dominados') +
          _statCard('📝', (stats.quizHistory.length > 0 ? stats.quizHistory[0].score + '/' + stats.quizHistory[0].total : '—'), 'Último quiz') +
        '</div>' +

        '<div class="section-title">Progresso por nível</div>' +
        _renderLevelProgress(stats) +

        '<div class="section-title">Atalhos</div>' +
        '<div class="home-cta-grid">' +
          _ctaCard('📚', 'Navegar Kanji', 'Explore por nível e capítulo', '/browse') +
          _ctaCard('🃏', 'Flashcards', 'Pratique com virada de cartas', '/flashcard') +
          _ctaCard('✏️', 'Quiz', 'Teste seus conhecimentos', '/quiz') +
          _ctaCard('📖', 'Teoria', 'Aprenda sobre o sistema de escrita', '/theory') +
        '</div>' +

        (stats.quizHistory.length > 0 ?
          '<div class="section-title mt-24">Histórico de quizzes</div>' +
          _renderQuizHistory(stats.quizHistory) : '') +

        '<div class="divider"></div>' +
        '<div class="flex-gap flex-wrap">' +
          '<button class="btn btn-secondary btn-sm" id="btn-export">⬇️ Exportar progresso</button>' +
          '<button class="btn btn-secondary btn-sm" id="btn-import">⬆️ Importar progresso</button>' +
          '<button class="btn btn-ghost btn-sm" id="btn-reset">🗑️ Resetar</button>' +
        '</div>' +
        '<input type="file" id="import-file-input" accept=".json" style="display:none">' +
      '</div>';

    // Bind events
    var btnExport = container.querySelector('#btn-export');
    var btnImport = container.querySelector('#btn-import');
    var btnReset  = container.querySelector('#btn-reset');
    var fileInput = container.querySelector('#import-file-input');

    if (btnExport) btnExport.addEventListener('click', function () {
      KanjiStorage.exportJSON();
      Toast.success('Progresso exportado!');
    });

    if (btnImport) btnImport.addEventListener('click', function () {
      fileInput.click();
    });

    if (fileInput) fileInput.addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        if (KanjiStorage.importJSON(ev.target.result)) {
          Toast.success('Progresso importado com sucesso!');
          KanjiApp.navigate('/');
        } else {
          Toast.error('Arquivo inválido.');
        }
      };
      reader.readAsText(file);
    });

    if (btnReset) btnReset.addEventListener('click', function () {
      Modal.confirm('Resetar progresso',
        'Tem certeza? Todo o seu progresso será apagado permanentemente.',
        function () {
          KanjiStorage.reset();
          Toast.success('Progresso resetado.');
          KanjiApp.navigate('/');
        }
      );
    });

    // CTA clicks
    container.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function () {
        KanjiApp.navigate(el.dataset.nav);
      });
    });
  }

  function _renderStreak(stats) {
    if (!stats.streak) return '';
    return '<div class="streak-display mb-24">' +
      '<span class="streak-num">🔥 ' + stats.streak + '</span>' +
      '<div class="streak-text">' +
        '<strong>' + (stats.streak === 1 ? 'dia de sequência' : 'dias de sequência') + '</strong><br>' +
        '<span style="font-size:0.82rem;color:var(--text-muted)">Continue estudando todos os dias!</span>' +
      '</div>' +
    '</div>';
  }

  function _statCard(icon, value, label) {
    return '<div class="stat-card">' +
      '<div class="stat-icon">' + icon + '</div>' +
      '<div class="stat-value">' + value + '</div>' +
      '<div class="stat-label">' + label + '</div>' +
    '</div>';
  }

  function _renderLevelProgress(stats) {
    var levels = [
      { n: 1, name: 'Iniciante',     color: 'var(--level-1)' },
      { n: 2, name: 'Elementar',     color: 'var(--level-2)' },
      { n: 3, name: 'Intermediário', color: 'var(--level-3)' },
      { n: 4, name: 'Avançado',      color: 'var(--level-4)' },
    ];

    return '<div class="level-progress-list mb-24">' +
      levels.map(function (lv) {
        var s = stats.byLevel[lv.n] || { seen: 0, total: 0, pct: 0 };
        return '<div class="level-prog-item">' +
          '<span class="lp-label">' + lv.name + '</span>' +
          '<div class="lp-bar-wrap">' +
            '<div class="lp-bar-fill" style="width:' + s.pct + '%;background:' + lv.color + '"></div>' +
          '</div>' +
          '<span class="lp-count">' + s.seen + ' / ' + s.total + '</span>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function _ctaCard(icon, title, desc, path) {
    return '<div class="cta-card" data-nav="' + path + '">' +
      '<div class="cta-icon">' + icon + '</div>' +
      '<div class="cta-title">' + title + '</div>' +
      '<div class="cta-desc">' + desc + '</div>' +
    '</div>';
  }

  function _renderQuizHistory(history) {
    return '<div class="quiz-history-list mb-24">' +
      history.map(function (q) {
        var pct = Math.round((q.score / q.total) * 100);
        var color = pct >= 80 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)';
        return '<div class="quiz-history-item">' +
          '<span>' + q.type + '</span>' +
          '<span class="qh-score" style="color:' + color + '">' + q.score + '/' + q.total + ' (' + pct + '%)</span>' +
          '<span class="qh-date">' + q.date + '</span>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function destroy() {}

  return { render: render, destroy: destroy };

})();

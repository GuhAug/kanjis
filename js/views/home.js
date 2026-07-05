// ============================================================
// home.js — Dashboard / home view
// ============================================================

var HomeView = (function () {

  function render(container) {
    var stats          = KanjiStorage.getStats();
    var grammarHistory = KanjiStorage.getGrammarHistory();

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('home_welcome') + '</h1>' +
          '<p>' + Lang.t('home_subtitle') + '</p>' +
        '</div>' +

        _renderStreak(stats) +

        '<div class="stats-grid">' +
          _statCard('📊', stats.total,   Lang.t('home_stat_total')) +
          _statCard('👁️', stats.seen,    Lang.t('home_stat_seen')) +
          _statCard('⭐', stats.mastered, Lang.t('home_stat_mastered')) +
          _statCard('📝', (stats.quizHistory.length > 0 ? stats.quizHistory[0].score + '/' + stats.quizHistory[0].total : '—'), Lang.t('home_stat_lastquiz')) +
        '</div>' +

        '<div class="section-title">' + Lang.t('home_shortcuts_kanji') + '</div>' +
        '<div class="home-cta-grid">' +
          _ctaCard('📚', Lang.t('cta_browse_title'), Lang.t('cta_browse_desc'), '/browse') +
          _ctaCard('🃏', Lang.t('cta_flash_title'),  Lang.t('cta_flash_desc'),  '/flashcard') +
          _ctaCard('✏️', Lang.t('cta_quiz_title'),   Lang.t('cta_quiz_desc'),   '/quiz') +
        '</div>' +

        '<div class="section-title">' + Lang.t('home_shortcuts_grammar') + '</div>' +
        '<div class="home-cta-grid">' +
          _ctaCard('🔀', Lang.t('cta_grammar_title'),      Lang.t('cta_grammar_desc'),      '/grammar') +
          _ctaCard('🧩', Lang.t('cta_particles_title'),    Lang.t('cta_particles_desc'),    '/particles') +
          _ctaCard('↔️', Lang.t('cta_transitivity_title'), Lang.t('cta_transitivity_desc'), '/transitivity') +
          _ctaCard('📖', Lang.t('cta_theory_title'),       Lang.t('cta_theory_desc'),       '/theory') +
        '</div>' +

        '<div class="section-title">' + Lang.t('home_level_progress') + '</div>' +
        _renderLevelProgress(stats) +

        (stats.quizHistory.length > 0 ?
          '<div class="section-title mt-24">' + Lang.t('home_history_kanji') + '</div>' +
          _renderQuizHistory(stats.quizHistory) : '') +

        (grammarHistory.length > 0 ?
          '<div class="section-title mt-24">' + Lang.t('home_history_grammar') + '</div>' +
          _renderQuizHistory(grammarHistory) : '') +

        '<div class="divider"></div>' +
        '<div class="flex-gap flex-wrap">' +
          '<button class="btn btn-secondary btn-sm" id="btn-export">' + Lang.t('home_export') + '</button>' +
          '<button class="btn btn-secondary btn-sm" id="btn-import">' + Lang.t('home_import') + '</button>' +
          '<button class="btn btn-ghost btn-sm" id="btn-reset">' + Lang.t('home_reset') + '</button>' +
        '</div>' +
        '<input type="file" id="import-file-input" accept=".json" style="display:none">' +
      '</div>';

    var btnExport = container.querySelector('#btn-export');
    var btnImport = container.querySelector('#btn-import');
    var btnReset  = container.querySelector('#btn-reset');
    var fileInput = container.querySelector('#import-file-input');

    if (btnExport) btnExport.addEventListener('click', function () {
      KanjiStorage.exportJSON();
      Toast.success(Lang.t('home_toast_exported'));
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
          Toast.success(Lang.t('home_toast_imported'));
          KanjiApp.navigate('/');
        } else {
          Toast.error(Lang.t('home_toast_import_err'));
        }
      };
      reader.readAsText(file);
    });

    if (btnReset) btnReset.addEventListener('click', function () {
      Modal.confirm(Lang.t('home_reset_title'), Lang.t('home_reset_msg'), function () {
        KanjiStorage.reset();
        Toast.success(Lang.t('home_toast_reset'));
        KanjiApp.navigate('/');
      });
    });

    container.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function () {
        KanjiApp.navigate(el.dataset.nav);
      });
    });
  }

  function _renderStreak(stats) {
    if (!stats.streak) return '';
    var streakLabel = stats.streak === 1 ? Lang.t('home_streak_day') : Lang.t('home_streak_days');
    return '<div class="streak-display mb-24">' +
      '<span class="streak-num">🔥 ' + stats.streak + '</span>' +
      '<div class="streak-text">' +
        '<strong>' + streakLabel + '</strong><br>' +
        '<span style="font-size:0.82rem;color:var(--text-muted)">' + Lang.t('home_streak_keep') + '</span>' +
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
      { n: 1, name: Lang.t('level_1'), color: 'var(--level-1)' },
      { n: 2, name: Lang.t('level_2'), color: 'var(--level-2)' },
      { n: 3, name: Lang.t('level_3'), color: 'var(--level-3)' },
      { n: 4, name: Lang.t('level_4'), color: 'var(--level-4)' },
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

  function _quizTypeLabel(type) {
    return Lang.t('quiz_type_' + type) || type;
  }

  function _renderQuizHistory(history) {
    return '<div class="quiz-history-list mb-24">' +
      history.map(function (q) {
        var pct = Math.round((q.score / q.total) * 100);
        var color = KanjiData.pctColor(pct);
        return '<div class="quiz-history-item">' +
          '<span>' + _quizTypeLabel(q.type) + '</span>' +
          '<span class="qh-score" style="color:' + color + '">' + q.score + '/' + q.total + ' (' + pct + '%)</span>' +
          '<span class="qh-date">' + q.date + '</span>' +
        '</div>';
      }).join('') +
    '</div>';
  }

  function destroy() {}

  return { render: render, destroy: destroy };

})();

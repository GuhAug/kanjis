// ============================================================
// particles.js — Particle placement quiz
// ============================================================

var ParticlesView = (function () {

  var _questions      = [];
  var _index          = 0;
  var _score          = 0;
  var _answers        = [];
  var _answered       = false;
  var _count          = 20;
  var _resultRecorded = false;

  function render(container, params) {
    var sub = params[1] || '';
    if      (sub === '/session' && _questions.length) _renderSession(container);
    else if (sub === '/results' && _answers.length)   _renderResults(container);
    else                                              _renderConfig(container);
  }

  // ── Config ──────────────────────────────────────────────

  function _renderConfig(container) {
    var total = (window.PARTICLES_DATA || []).length;

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('particles_title') + '</h1>' +
          '<p>' + Lang.t('particles_subtitle') + '</p>' +
        '</div>' +
        '<div class="grammar-config card">' +
          '<div class="field">' +
            '<label>' + Lang.t('particles_count') + '</label>' +
            '<select id="pt-count">' +
              '<option value="10"' + (_count === 10 ? ' selected' : '') + '>10</option>' +
              '<option value="20"' + (_count === 20 ? ' selected' : '') + '>20</option>' +
              '<option value="0"'  + (_count === 0  ? ' selected' : '') + '>All (' + total + ')</option>' +
            '</select>' +
          '</div>' +
          '<div class="gr-config-actions">' +
            '<button class="btn btn-primary btn-lg" id="btn-start-pt">' + Lang.t('particles_start') + '</button>' +
          '</div>' +
        '</div>' +
        _renderParticleRef() +
      '</div>';

    container.querySelector('#pt-count').addEventListener('change', function () {
      _count = parseInt(this.value);
    });

    container.querySelector('#btn-start-pt').addEventListener('click', function () {
      var data = (window.PARTICLES_DATA || []).slice();
      _shuffle(data);
      _questions = _count > 0 ? data.slice(0, _count) : data;
      if (!_questions.length) {
        Toast.error('Dados de partículas não encontrados.');
        return;
      }
      _index = 0; _score = 0; _answers = []; _answered = false; _resultRecorded = false;
      _renderSession(container);
    });
  }

  function _renderParticleRef() {
    var rows = [
      ['は',   Lang.t('p_ha_fn'),   Lang.t('p_ha_ex')],
      ['が',   Lang.t('p_ga_fn'),   Lang.t('p_ga_ex')],
      ['を',   Lang.t('p_wo_fn'),   Lang.t('p_wo_ex')],
      ['に',   Lang.t('p_ni_fn'),   Lang.t('p_ni_ex')],
      ['で',   Lang.t('p_de_fn'),   Lang.t('p_de_ex')],
      ['と',   Lang.t('p_to_fn'),   Lang.t('p_to_ex')],
      ['も',   Lang.t('p_mo_fn'),   Lang.t('p_mo_ex')],
      ['の',   Lang.t('p_no_fn'),   Lang.t('p_no_ex')],
      ['から', Lang.t('p_kara_fn'), Lang.t('p_kara_ex')],
      ['まで', Lang.t('p_made_fn'), Lang.t('p_made_ex')],
      ['へ',   Lang.t('p_e_fn'),    Lang.t('p_e_ex')],
      ['より', Lang.t('p_yori_fn'), Lang.t('p_yori_ex')],
    ];

    var tableRows = rows.map(function (r) {
      return '<tr>' +
        '<td class="pt-ref-particle">' + r[0] + '</td>' +
        '<td>' + r[1] + '</td>' +
        '<td class="pt-ref-ex">' + r[2] + '</td>' +
      '</tr>';
    }).join('');

    return '<div class="section-title mt-24">' + Lang.t('particles_ref') + '</div>' +
      '<div class="card" style="overflow-x:auto">' +
        '<table class="gr-table">' +
          '<thead><tr>' +
            '<th>' + Lang.t('particles_ref_particle') + '</th>' +
            '<th>' + Lang.t('particles_ref_function') + '</th>' +
            '<th>' + Lang.t('particles_ref_example') + '</th>' +
          '</tr></thead>' +
          '<tbody>' + tableRows + '</tbody>' +
        '</table>' +
      '</div>';
  }

  // ── Session ──────────────────────────────────────────────

  function _renderSession(container) {
    if (_index >= _questions.length) {
      _renderResults(container);
      return;
    }

    _answered = false;
    var q   = _questions[_index];
    var pct = Math.round((_index / _questions.length) * 100);

    var allOpts = q.distractors.concat([q.particle]);
    _shuffle(allOpts);
    var correctIdx = allOpts.indexOf(q.particle);

    var sentenceHTML = q.sentence.replace('___',
      '<span class="particle-blank" id="pt-blank">＿＿</span>');

    var optsHTML = allOpts.map(function (opt, i) {
      return '<button class="quiz-option pt-opt" data-idx="' + i + '">' + opt + '</button>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter quiz-session">' +
        '<div class="quiz-prog-bar"><div class="quiz-prog-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="quiz-counter">' + (_index + 1) + ' / ' + _questions.length + '</div>' +

        '<div class="quiz-stimulus">' +
          '<div class="pt-sentence">' + sentenceHTML + '</div>' +
          '<div class="gr-meaning-hint">(' + q.meaning + ')</div>' +
        '</div>' +

        '<div class="quiz-options pt-options" id="pt-options">' + optsHTML + '</div>' +

        '<div class="quiz-feedback" id="pt-feedback">' +
          '<div class="qf-result" id="pt-result"></div>' +
          '<div class="gr-explanation" id="pt-exp" style="display:none">' +
            '<div class="gr-exp-row">' +
              '<span class="gr-exp-lbl">' + Lang.t('particles_function_lbl') + '</span>' +
              '<span class="gr-exp-val" style="font-size:0.9rem">' + q.role + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<button class="btn btn-primary quiz-next-btn hidden" id="pt-next">' + Lang.t('particles_next') + '</button>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="pt-exit" style="font-size:0.85rem;opacity:0.6">' + Lang.t('particles_exit') + '</button>' +
        '</div>' +
      '</div>';

    var optionsEl  = container.querySelector('#pt-options');
    var feedbackEl = container.querySelector('#pt-feedback');
    var resultEl   = container.querySelector('#pt-result');
    var expEl      = container.querySelector('#pt-exp');
    var nextBtn    = container.querySelector('#pt-next');
    var blank      = container.querySelector('#pt-blank');

    function answer(chosenIdx) {
      if (_answered) return;
      _answered = true;

      var isCorrect = (chosenIdx === correctIdx);
      if (isCorrect) _score++;
      _answers.push({
        qIdx:      _index,
        id:        q.id,
        sentence:  q.sentence,
        meaning:   q.meaning,
        correct:   q.particle,
        chosen:    allOpts[chosenIdx],
        isCorrect: isCorrect,
      });

      blank.textContent = q.particle;
      blank.classList.add(isCorrect ? 'pt-blank-correct' : 'pt-blank-wrong');

      optionsEl.querySelectorAll('.pt-opt').forEach(function (btn) {
        btn.classList.add('answered');
        var idx = parseInt(btn.dataset.idx);
        if (idx === correctIdx)                   btn.classList.add('correct');
        else if (idx === chosenIdx && !isCorrect) btn.classList.add('wrong');
      });

      feedbackEl.classList.add('show', isCorrect ? 'correct-fb' : 'wrong-fb');
      resultEl.textContent = isCorrect
        ? Lang.t('particles_correct')
        : Lang.t('particles_wrong_prefix') + q.particle;
      expEl.style.display = 'block';
      nextBtn.classList.remove('hidden');

      KanjiApp.setKeyHandler(function (e) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') nextBtn.click();
      });
    }

    optionsEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-idx]');
      if (btn) answer(parseInt(btn.dataset.idx));
    });

    nextBtn.addEventListener('click', function () {
      _index++;
      _renderSession(container);
    });

    container.querySelector('#pt-exit').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = [];
      _renderConfig(container);
    });

    KanjiApp.setKeyHandler(function (e) {
      var n = parseInt(e.key);
      if (n >= 1 && n <= 4) answer(n - 1);
    });
  }

  // ── Results ──────────────────────────────────────────────

  function _renderResults(container) {
    var total = _questions.length;
    var pct   = total ? Math.round((_score / total) * 100) : 0;
    var emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';

    if (!_resultRecorded) {
      KanjiStorage.recordGrammarQuiz('Partículas', _score, total);
      _resultRecorded = true;
    }

    var wrongAnswers = _answers.filter(function (a) { return !a.isCorrect; });
    var wrongHTML    = wrongAnswers.map(function (a) {
      var displayed = a.sentence.replace('___',
        '<span style="color:var(--danger);font-weight:700">' + a.chosen + '</span>');
      var corrected = a.sentence.replace('___',
        '<span style="color:var(--success);font-weight:700">' + a.correct + '</span>');
      return '<div class="wrong-item" style="flex-direction:column;gap:4px;align-items:flex-start">' +
        '<div class="pt-wr-sent pt-wr-wrong">' + displayed + '</div>' +
        '<div class="pt-wr-sent pt-wr-right">' + corrected + '</div>' +
        '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">' + a.meaning + '</div>' +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter quiz-results">' +
        '<div class="qr-score-big">' +
          '<div style="font-size:2.5rem">' + emoji + '</div>' +
          '<div class="qr-num">' + _score + ' / ' + total + '</div>' +
          '<div class="qr-label">' + Lang.t('particles_correct_answers') + '</div>' +
          '<div class="qr-pct" style="color:' + _pctColor(pct) + '">' + pct + '%</div>' +
        '</div>' +
        (wrongHTML
          ? '<div class="section-title">' + Lang.t('particles_wrong_title') + '</div>' +
            '<div class="wrong-list">' + wrongHTML + '</div>'
          : '') +
        '<div class="qr-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo-pt">' + Lang.t('particles_redo') + '</button>' +
          (wrongAnswers.length > 0
            ? '<button class="btn btn-secondary" id="btn-review-pt">' + Lang.t('particles_review') + ' (' + wrongAnswers.length + ')</button>'
            : '') +
          '<button class="btn btn-ghost" id="btn-back-pt">' + Lang.t('particles_back') + '</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-redo-pt').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = [];
      _shuffle(_questions);
      _renderSession(container);
    });
    var reviewBtn = container.querySelector('#btn-review-pt');
    if (reviewBtn) reviewBtn.addEventListener('click', function () {
      var seen = {};
      var wrongQs = wrongAnswers
        .filter(function (a) { if (seen[a.qIdx]) return false; seen[a.qIdx] = true; return true; })
        .map(function (a) { return _questions[a.qIdx]; })
        .filter(Boolean);
      _questions = wrongQs; _index = 0; _score = 0; _answers = [];
      _renderSession(container);
    });
    container.querySelector('#btn-back-pt').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = []; _resultRecorded = false;
      _renderConfig(container);
    });
    KanjiApp.setKeyHandler(null);
  }

  function _pctColor(pct) {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 50) return 'var(--warning)';
    return 'var(--danger)';
  }

  function _shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function destroy() { KanjiApp.setKeyHandler(null); }

  return { render: render, destroy: destroy };

})();

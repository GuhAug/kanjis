// ============================================================
// transitivity.js — Transitive / intransitive verb quiz
// ============================================================

var TransitivityView = (function () {

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

  // ── Config ───────────────────────────────────────────────

  function _renderConfig(container) {
    var total = _countTotal();

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('transitivity_title') + '</h1>' +
          '<p>' + Lang.t('transitivity_subtitle') + '</p>' +
        '</div>' +
        '<div class="grammar-config card">' +
          '<div class="field">' +
            '<label>' + Lang.t('transitivity_count') + '</label>' +
            '<select id="tr-count">' +
              '<option value="10"' + (_count === 10 ? ' selected' : '') + '>10</option>' +
              '<option value="20"' + (_count === 20 ? ' selected' : '') + '>20</option>' +
              '<option value="0"'  + (_count === 0  ? ' selected' : '') + '>All (' + total + ')</option>' +
            '</select>' +
          '</div>' +
          '<div class="gr-config-actions">' +
            '<button class="btn btn-primary btn-lg" id="btn-start-tr">' + Lang.t('transitivity_start') + '</button>' +
          '</div>' +
        '</div>' +
        _renderTheoryCard() +
        _renderPairsTable() +
      '</div>';

    container.querySelector('#tr-count').addEventListener('change', function () {
      _count = parseInt(this.value);
    });

    container.querySelector('#btn-start-tr').addEventListener('click', function () {
      var qs = _buildQuestions(_count);
      if (!qs.length) { Toast.error(Lang.t('transitivity_no_data')); return; }
      _questions = qs; _index = 0; _score = 0; _answers = []; _resultRecorded = false;
      _renderSession(container);
    });
  }

  function _countTotal() {
    return (window.TRANSITIVITY_DATA || []).reduce(function (n, p) {
      return n + p.qs.length;
    }, 0);
  }

  function _renderTheoryCard() {
    return '<div class="section-title mt-24">' + Lang.t('transitivity_concept') + '</div>' +
      '<div class="card grammar-theory-card">' +
        '<div class="theory-cat-header">↔️ <strong>他動詞 vs 自動詞</strong></div>' +
        '<p class="theory-note">' + Lang.t('transitivity_concept_note') + '</p>' +
        '<div class="table-wrap"><table class="gr-table">' +
          '<thead><tr>' +
            '<th>' + Lang.t('transitivity_col_type') + '</th>' +
            '<th>' + Lang.t('transitivity_col_part') + '</th>' +
            '<th>' + Lang.t('transitivity_col_example') + '</th>' +
            '<th>' + Lang.t('transitivity_col_trans') + '</th>' +
          '</tr></thead>' +
          '<tbody>' +
            '<tr><td class="gr-td-label">他動詞</td><td style="color:var(--accent2)">を</td><td>私は窓を<strong>開けた</strong>。</td><td>' + Lang.t('transitivity_ex_tr_trans') + '</td></tr>' +
            '<tr><td class="gr-td-label">自動詞</td><td style="color:var(--success)">が</td><td>窓が<strong>開いた</strong>。</td><td>' + Lang.t('transitivity_ex_intr_trans') + '</td></tr>' +
          '</tbody>' +
        '</table></div>' +
      '</div>';
  }

  function _renderPairsTable() {
    var data = window.TRANSITIVITY_DATA || [];
    var rows = data.map(function (p) {
      return '<tr>' +
        '<td style="color:var(--text-muted);font-size:0.82rem">' + p.meaning + '</td>' +
        '<td><span style="font-family:\'Noto Sans JP\',sans-serif;font-weight:700;color:var(--accent2)">' +
          p.tr.base + '</span> <span style="font-size:0.78rem;color:var(--text-muted)">(' + p.tr.meaning + ')</span></td>' +
        '<td><span style="font-family:\'Noto Sans JP\',sans-serif;font-weight:700;color:var(--success)">' +
          p.intr.base + '</span> <span style="font-size:0.78rem;color:var(--text-muted)">(' + p.intr.meaning + ')</span></td>' +
      '</tr>';
    }).join('');

    return '<div class="section-title mt-24">' + Lang.t('transitivity_pairs') + '</div>' +
      '<div class="card" style="overflow-x:auto">' +
        '<table class="gr-table">' +
          '<thead><tr>' +
            '<th>' + Lang.t('transitivity_col_meaning') + '</th>' +
            '<th>' + Lang.t('transitivity_col_tr') + '</th>' +
            '<th>' + Lang.t('transitivity_col_intr') + '</th>' +
          '</tr></thead>' +
          '<tbody>' + rows + '</tbody>' +
        '</table>' +
      '</div>';
  }

  // ── Build questions ──────────────────────────────────────

  function _buildQuestions(count) {
    var data = window.TRANSITIVITY_DATA || [];

    var raw = [];
    data.forEach(function (pair) {
      pair.qs.forEach(function (q) {
        raw.push({
          sentence:    q.text,
          meaning:     q.pt,
          pair:        pair,
          correctType: q.ans,
          correct:     q.ans === 'tr' ? pair.tr.past : pair.intr.past,
          wrong:       q.ans === 'tr' ? pair.intr.past : pair.tr.past,
        });
      });
    });

    KanjiData.shuffle(raw);
    var pool = count > 0 ? raw.slice(0, count) : raw;

    return pool.map(function (q, idx) {
      var seen = {};
      seen[q.correct] = true;
      seen[q.wrong]   = true;

      var dists = [];
      for (var i = 0; i < pool.length && dists.length < 2; i++) {
        if (i === idx) continue;
        var cand = Math.random() < 0.5 ? pool[i].pair.tr.past : pool[i].pair.intr.past;
        if (!seen[cand]) { seen[cand] = true; dists.push(cand); }
      }
      for (var j = 0; j < raw.length && dists.length < 2; j++) {
        var c2 = Math.random() < 0.5 ? raw[j].pair.tr.past : raw[j].pair.intr.past;
        if (!seen[c2]) { seen[c2] = true; dists.push(c2); }
      }

      var options = KanjiData.shuffle([q.correct, q.wrong].concat(dists.slice(0, 2)));

      return {
        sentence:    q.sentence,
        meaning:     q.meaning,
        pair:        q.pair,
        correctType: q.correctType,
        correct:     q.correct,
        wrong:       q.wrong,
        options:     options,
        correctIdx:  options.indexOf(q.correct),
      };
    });
  }

  // ── Session ──────────────────────────────────────────────

  function _renderSession(container) {
    if (_index >= _questions.length) { _renderResults(container); return; }

    _answered = false;
    var q   = _questions[_index];
    var pct = Math.round((_index / _questions.length) * 100);

    var trWord   = Lang.t('transitivity_tr_word');
    var intrWord = Lang.t('transitivity_intr_word');
    var typeLabel = q.correctType === 'tr'
      ? '<span style="color:var(--accent2)">他動詞</span> (' + trWord + ')'
      : '<span style="color:var(--success)">自動詞</span> (' + intrWord + ')';

    var sentenceHTML = q.sentence.replace('___',
      '<span class="particle-blank" id="tr-blank">＿＿＿</span>');

    var optsHTML = q.options.map(function (opt, i) {
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

        '<div class="quiz-options pt-options" id="tr-options">' + optsHTML + '</div>' +

        '<div class="quiz-feedback" id="tr-feedback">' +
          '<div class="qf-result" id="tr-result"></div>' +
          '<div class="gr-explanation" id="tr-exp" style="display:none">' +
            '<div class="gr-exp-row">' +
              '<span class="gr-exp-lbl">' + Lang.t('transitivity_correct_lbl') + '</span>' +
              '<span class="gr-exp-val">' + typeLabel + '</span>' +
            '</div>' +
            '<div class="gr-exp-row" style="margin-top:6px;gap:16px;flex-wrap:wrap">' +
              '<span style="font-size:0.82rem">' +
                '<span style="color:var(--text-faint);margin-right:4px">他動詞</span>' +
                '<span style="font-family:\'Noto Sans JP\',sans-serif;color:var(--accent2)">' +
                  q.pair.tr.base + '</span>' +
                '<span style="color:var(--text-muted);font-size:0.78rem;margin-left:4px">(' + q.pair.tr.meaning + ')</span>' +
              '</span>' +
              '<span style="font-size:0.82rem">' +
                '<span style="color:var(--text-faint);margin-right:4px">自動詞</span>' +
                '<span style="font-family:\'Noto Sans JP\',sans-serif;color:var(--success)">' +
                  q.pair.intr.base + '</span>' +
                '<span style="color:var(--text-muted);font-size:0.78rem;margin-left:4px">(' + q.pair.intr.meaning + ')</span>' +
              '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<button class="btn btn-primary quiz-next-btn hidden" id="tr-next">' + Lang.t('transitivity_next') + '</button>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="tr-exit" style="font-size:0.85rem;opacity:0.6">' + Lang.t('transitivity_exit') + '</button>' +
        '</div>' +
      '</div>';

    var optionsEl  = container.querySelector('#tr-options');
    var feedbackEl = container.querySelector('#tr-feedback');
    var resultEl   = container.querySelector('#tr-result');
    var expEl      = container.querySelector('#tr-exp');
    var nextBtn    = container.querySelector('#tr-next');
    var blank      = container.querySelector('#tr-blank');

    function answer(chosenIdx) {
      if (_answered) return;
      _answered = true;

      var isCorrect = (chosenIdx === q.correctIdx);
      if (isCorrect) _score++;
      _answers.push({
        qIdx:        _index,
        sentence:    q.sentence,
        meaning:     q.meaning,
        pair:        q.pair,
        correctType: q.correctType,
        correct:     q.correct,
        chosen:      q.options[chosenIdx],
        isCorrect:   isCorrect,
      });

      blank.textContent = q.correct;
      blank.classList.add(isCorrect ? 'pt-blank-correct' : 'pt-blank-wrong');

      optionsEl.querySelectorAll('.pt-opt').forEach(function (btn) {
        btn.classList.add('answered');
        var idx = parseInt(btn.dataset.idx);
        if (idx === q.correctIdx)                   btn.classList.add('correct');
        else if (idx === chosenIdx && !isCorrect)   btn.classList.add('wrong');
      });

      feedbackEl.classList.add('show', isCorrect ? 'correct-fb' : 'wrong-fb');
      resultEl.textContent = isCorrect
        ? Lang.t('transitivity_correct')
        : Lang.t('transitivity_wrong') + ' ' + q.correct;
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

    container.querySelector('#tr-exit').addEventListener('click', function () {
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
      KanjiStorage.recordGrammarQuiz('transitivity', _score, total);
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
        '<div style="font-size:0.76rem;color:var(--text-faint)">' +
          '他動詞 ' + a.pair.tr.base + ' &nbsp;·&nbsp; 自動詞 ' + a.pair.intr.base +
        '</div>' +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter quiz-results">' +
        '<div class="qr-score-big">' +
          '<div style="font-size:2.5rem">' + emoji + '</div>' +
          '<div class="qr-num">' + _score + ' / ' + total + '</div>' +
          '<div class="qr-label">' + Lang.t('transitivity_correct_answers') + '</div>' +
          '<div class="qr-pct" style="color:' + KanjiData.pctColor(pct) + '">' + pct + '%</div>' +
        '</div>' +
        (wrongHTML
          ? '<div class="section-title">' + Lang.t('transitivity_wrong_title') + '</div>' +
            '<div class="wrong-list">' + wrongHTML + '</div>'
          : '') +
        '<div class="qr-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo-tr">' + Lang.t('transitivity_redo') + '</button>' +
          (wrongAnswers.length > 0
            ? '<button class="btn btn-secondary" id="btn-review-tr">' + Lang.t('transitivity_review') + ' (' + wrongAnswers.length + ')</button>'
            : '') +
          '<button class="btn btn-ghost" id="btn-back-tr">' + Lang.t('transitivity_back') + '</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-redo-tr').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = [];
      KanjiData.shuffle(_questions);
      _renderSession(container);
    });
    var reviewBtn = container.querySelector('#btn-review-tr');
    if (reviewBtn) reviewBtn.addEventListener('click', function () {
      var seen = {};
      var wrongQs = wrongAnswers
        .filter(function (a) { if (seen[a.qIdx]) return false; seen[a.qIdx] = true; return true; })
        .map(function (a) { return _questions[a.qIdx]; })
        .filter(Boolean);
      _questions = wrongQs; _index = 0; _score = 0; _answers = [];
      _renderSession(container);
    });
    container.querySelector('#btn-back-tr').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = []; _resultRecorded = false;
      _renderConfig(container);
    });
    KanjiApp.setKeyHandler(null);
  }

  function destroy() { KanjiApp.setKeyHandler(null); }

  return { render: render, destroy: destroy };

})();

// ============================================================
// grammar.js — Flexion/conjugation study and practice
// ============================================================

var GrammarView = (function () {

  var FORM_LABELS = {
    pres:       'Presente',
    neg:        'Negativo',
    past:       'Passado',
    'past-neg': 'Pass. Negativo',
    te:         'Forma-て',
  };

  var FORM_FULL = {
    pres:       'Presente (afirmativo)',
    neg:        'Negativo (presente)',
    past:       'Passado (afirmativo)',
    'past-neg': 'Passado (negativo)',
    te:         'Forma-て',
  };

  var CAT_SHORT = { verb:'Verbos', noun:'Subst.', i_adj:'い-adj', na_adj:'な-adj' };
  var CAT_FULL  = { verb:'Verbos', noun:'Substantivos', i_adj:'い-adjetivos', na_adj:'な-adjetivos' };

  // Session state (preserved between config ↔ session)
  var _questions   = [];
  var _index       = 0;
  var _score       = 0;
  var _answers     = [];
  var _answered    = false;
  var _selCats     = ['verb','noun','i_adj','na_adj'];
  var _selForms    = ['pres','neg','past','past-neg'];
  var _direction   = 'polite-to-plain';
  var _count       = 20;

  function render(container, params) {
    var sub = params[1] || '';
    if (sub === '/theory')                            _renderTheory(container);
    else if (sub === '/session' && _questions.length) _renderSession(container);
    else if (sub === '/results' && _answers.length)   _renderResults(container);
    else                                              _renderConfig(container);
  }

  // ── Config ──────────────────────────────────────────────

  function _renderConfig(container) {
    var allForms = ['pres','neg','past','past-neg','te'];
    var allCats  = ['verb','noun','i_adj','na_adj'];

    function chips(items, selected, attr) {
      return items.map(function (v) {
        var lbl = (attr === 'cat') ? CAT_SHORT[v] : FORM_LABELS[v];
        var sel = selected.indexOf(v) !== -1 ? ' selected' : '';
        return '<div class="filter-chip' + sel + '" data-' + attr + '="' + v + '">' + lbl + '</div>';
      }).join('');
    }

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>🔀 Flexões</h1>' +
          '<p>Pratique a transformação entre formas polidas (丁寧語) e informais (普通体).</p>' +
        '</div>' +
        '<div class="grammar-config card">' +
          '<div class="field">' +
            '<label>Categoria <span class="field-hint">(uma ou mais)</span></label>' +
            '<div class="chip-group" id="gr-cats">' + chips(allCats, _selCats, 'cat') + '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>Formas a praticar <span class="field-hint">(uma ou mais)</span></label>' +
            '<div class="chip-group" id="gr-forms">' + chips(allForms, _selForms, 'form') + '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>Direção</label>' +
            '<div class="chip-group" id="gr-dir">' +
              '<div class="filter-chip' + (_direction === 'polite-to-plain' ? ' selected' : '') + '" data-dir="polite-to-plain">Polido → Informal</div>' +
              '<div class="filter-chip' + (_direction === 'plain-to-polite' ? ' selected' : '') + '" data-dir="plain-to-polite">Informal → Polido</div>' +
            '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>Número de questões</label>' +
            '<select id="gr-count">' +
              '<option value="10"' + (_count === 10 ? ' selected' : '') + '>10 questões</option>' +
              '<option value="20"' + (_count === 20 ? ' selected' : '') + '>20 questões</option>' +
              '<option value="0"'  + (_count === 0  ? ' selected' : '') + '>Todas</option>' +
            '</select>' +
          '</div>' +
          '<div class="gr-config-actions">' +
            '<button class="btn btn-ghost" id="btn-gr-theory">📖 Ver Teoria</button>' +
            '<button class="btn btn-primary btn-lg" id="btn-start-gr">Iniciar Prática</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    function toggleChip(groupId, arr, attr) {
      container.querySelector('#' + groupId).addEventListener('click', function (e) {
        var chip = e.target.closest('.filter-chip');
        if (!chip || !chip.dataset[attr]) return;
        var val = chip.dataset[attr];
        var idx = arr.indexOf(val);
        if (idx === -1) { arr.push(val); chip.classList.add('selected'); }
        else            { arr.splice(idx, 1); chip.classList.remove('selected'); }
      });
    }

    toggleChip('gr-cats',  _selCats,  'cat');
    toggleChip('gr-forms', _selForms, 'form');

    container.querySelector('#gr-dir').addEventListener('click', function (e) {
      var chip = e.target.closest('[data-dir]');
      if (!chip) return;
      container.querySelectorAll('#gr-dir .filter-chip').forEach(function (x) { x.classList.remove('selected'); });
      chip.classList.add('selected');
      _direction = chip.dataset.dir;
    });

    container.querySelector('#gr-count').addEventListener('change', function () {
      _count = parseInt(this.value);
    });

    container.querySelector('#btn-gr-theory').addEventListener('click', function () {
      _renderTheory(container);
    });

    container.querySelector('#btn-start-gr').addEventListener('click', function () {
      if (!_selCats.length || !_selForms.length) {
        Toast.error('Selecione pelo menos uma categoria e uma forma.');
        return;
      }
      var qs = _buildQuestions(_selCats, _selForms, _direction, _count);
      if (!qs.length) {
        Toast.error('Não há questões suficientes para a seleção atual.');
        return;
      }
      _questions = qs; _index = 0; _score = 0; _answers = [];
      _renderSession(container);
    });
  }

  // ── Theory ──────────────────────────────────────────────

  function _renderTheory(container) {
    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>📖 Teoria — Flexões</h1>' +
          '<p>Regras de transformação entre forma polida (丁寧語) e informal (普通体).</p>' +
        '</div>' +
        _theoryVerbs() +
        _theoryNouns() +
        _theoryIAdj() +
        _theoryNaAdj() +
        '<div style="text-align:center;margin-top:24px;margin-bottom:8px">' +
          '<button class="btn btn-primary" id="btn-theory-back">← Voltar</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-theory-back').addEventListener('click', function () {
      _renderConfig(container);
    });
    KanjiApp.setKeyHandler(null);
  }

  function _tbl(headers, rows) {
    return '<div class="table-wrap"><table class="gr-table">' +
      '<thead><tr>' + headers.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function (row) {
        return '<tr>' + row.map(function (cell, i) {
          return '<td' + (i === 0 ? ' class="gr-td-label"' : '') + '>' + cell + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }

  function _ex(polite, plain, meaning) {
    return '<div class="gr-ex-row">' +
      '<span class="gr-word">' + polite + '</span>' +
      '<span class="gr-arrow">→</span>' +
      '<span class="gr-word gr-word-plain">' + plain + '</span>' +
      '<span class="gr-meaning">(' + meaning + ')</span>' +
    '</div>';
  }

  function _theoryVerbs() {
    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">🏃 <strong>Verbos (動詞)</strong></div>' +
      '<p class="theory-note">Grupo <strong>1</strong> = godan (〜う/く/す/つ/む/ぬ/ぶ/る/ぐ) · <strong>2</strong> = ichidan (〜る) · <strong>3</strong> = irregular (する, 来る)</p>' +
      _tbl(
        ['Forma', 'Polido (丁寧)', 'Informal (普通)'],
        [
          ['Presente',        '〜ます',               '〜る (gr.2) / vogal+う (gr.1)'],
          ['Negativo',        '〜ません',             '〜ない'],
          ['Passado',         '〜ました',             '〜た / 〜んだ'],
          ['Pass. Negativo',  '〜ませんでした',       '〜なかった'],
          ['Forma-て',        '—',                    '〜て / 〜で'],
        ]
      ) +
      '<div class="gr-te-table">' +
        '<div class="gr-te-title">Regras da Forma-て (grupo 1)</div>' +
        _tbl(
          ['Terminação', 'Transforma em', 'Exemplo'],
          [
            ['〜く',     '〜いて',  '書く → 書いて'],
            ['〜ぐ',     '〜いで',  '泳ぐ → 泳いで'],
            ['〜す',     '〜して',  '話す → 話して'],
            ['〜む/ぬ/ぶ','〜んで', '飲む → 飲んで'],
            ['〜る/つ/う','〜って', '帰る → 帰って, 待つ → 待って'],
            ['行く (exc.)','行って', '—'],
          ]
        ) +
      '</div>' +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">Exemplos</div>' +
        _ex('食べます', '食べる', 'comer') +
        _ex('飲みます', '飲む',   'beber') +
        _ex('来ます',   '来る',   'vir — irregular') +
        _ex('します',   'する',   'fazer — irregular') +
      '</div>' +
    '</div>';
  }

  function _theoryNouns() {
    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">📦 <strong>Substantivos (名詞) + です</strong></div>' +
      _tbl(
        ['Forma', 'Polido (丁寧)', 'Informal (普通)'],
        [
          ['Presente',        'N + です',                    'N + だ'],
          ['Negativo',        'N + じゃありません',          'N + じゃない'],
          ['Passado',         'N + でした',                  'N + だった'],
          ['Pass. Negativo',  'N + じゃありませんでした',    'N + じゃなかった'],
        ]
      ) +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">Exemplos</div>' +
        _ex('学生です',    '学生だ',    'sou estudante') +
        _ex('先生でした',  '先生だった','era professor') +
        _ex('学校じゃありません', '学校じゃない', 'não é escola') +
      '</div>' +
    '</div>';
  }

  function _theoryIAdj() {
    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">✨ <strong>い-adjetivos (い形容詞)</strong></div>' +
      '<p class="theory-note">Exceção: <strong>いい</strong> (bom) usa a base <strong>よ</strong> nas formas modificadas → よくない / よかった / よくなかった</p>' +
      _tbl(
        ['Forma', 'Polido (丁寧)', 'Informal (普通)'],
        [
          ['Presente',        'Adj-い + です',         'Adj-い (sem です)'],
          ['Negativo',        'Adj-くないです',        'Adj-くない'],
          ['Passado',         'Adj-かったです',        'Adj-かった'],
          ['Pass. Negativo',  'Adj-くなかったです',    'Adj-くなかった'],
        ]
      ) +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">Exemplos</div>' +
        _ex('高いです',        '高い',        'é caro') +
        _ex('高くないです',    '高くない',    'não é caro') +
        _ex('高かったです',    '高かった',    'era caro') +
        _ex('いいです',        'いい',        'é bom (exceção)') +
        _ex('よくなかったです','よくなかった','não era bom (exceção)') +
      '</div>' +
    '</div>';
  }

  function _theoryNaAdj() {
    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">🌸 <strong>な-adjetivos (な形容詞)</strong></div>' +
      '<p class="theory-note">Conjugação idêntica à dos substantivos — usa だ/じゃない/だった/じゃなかった.</p>' +
      _tbl(
        ['Forma', 'Polido (丁寧)', 'Informal (普通)'],
        [
          ['Presente',        'Adj-na + です',                 'Adj-na + だ'],
          ['Negativo',        'Adj-na + じゃありません',       'Adj-na + じゃない'],
          ['Passado',         'Adj-na + でした',               'Adj-na + だった'],
          ['Pass. Negativo',  'Adj-na + じゃありませんでした', 'Adj-na + じゃなかった'],
        ]
      ) +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">Exemplos</div>' +
        _ex('元気です',       '元気だ',       'está bem/saudável') +
        _ex('きれいでした',   'きれいだった', 'era bonito/a') +
        _ex('好きじゃありません','好きじゃない','não gosta') +
      '</div>' +
    '</div>';
  }

  // ── Build questions ──────────────────────────────────────

  function _buildQuestions(cats, forms, direction, count) {
    var data = window.GRAMMAR_DATA || [];
    var pool = data.filter(function (item) { return cats.indexOf(item.category) !== -1; });

    var questions = [];

    pool.forEach(function (item) {
      forms.forEach(function (form) {
        // te-form only for verbs
        if (form === 'te' && item.category !== 'verb') return;

        var f = item.forms[form];
        if (!f) return;

        var isTe    = (form === 'te');
        var toPlain = isTe || direction === 'polite-to-plain';

        var stimulus     = isTe ? item.dict : (toPlain ? f.polite : f.plain);
        var correctAnswer = toPlain ? f.plain : f.polite;
        if (!stimulus || !correctAnswer) return;

        var stimLabel = CAT_FULL[item.category] + ' — ' + FORM_FULL[form];

        // Distractors: same category + same form, different words
        var distractors = [];
        pool.forEach(function (other) {
          if (other.id === item.id) return;
          var of = other.forms[form];
          if (!of) return;
          var val = toPlain ? of.plain : of.polite;
          if (val && val !== correctAnswer) distractors.push(val);
        });

        _shuffle(distractors);
        var seen = {}; var dists = [];
        seen[correctAnswer] = true;
        for (var i = 0; i < distractors.length && dists.length < 3; i++) {
          if (!seen[distractors[i]]) { seen[distractors[i]] = true; dists.push(distractors[i]); }
        }

        if (dists.length < 3) return;

        var options = dists.concat([correctAnswer]);
        _shuffle(options);

        questions.push({
          itemId:        item.id,
          form:          form,
          stimulus:      stimulus,
          stimLabel:     stimLabel,
          meaning:       item.meaning,
          dict:          item.dict,
          options:       options,
          correct:       options.indexOf(correctAnswer),
          correctAnswer: correctAnswer,
          polite:        isTe ? null : f.polite,
          plain:         f.plain,
          formFull:      FORM_FULL[form],
        });
      });
    });

    _shuffle(questions);
    if (count > 0) questions = questions.slice(0, count);
    return questions;
  }

  function _shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
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

    var dirHint = q.form === 'te'
      ? 'Qual é a forma-て deste verbo?'
      : (_direction === 'polite-to-plain'
          ? 'Transforme para a forma <strong>informal</strong>:'
          : 'Transforme para a forma <strong>polida</strong>:');

    container.innerHTML =
      '<div class="view-enter quiz-session">' +
        '<div class="quiz-prog-bar"><div class="quiz-prog-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="quiz-counter">' + (_index + 1) + ' / ' + _questions.length + '</div>' +

        '<div class="quiz-stimulus">' +
          '<div class="qs-label">' + q.stimLabel + '</div>' +
          '<div class="gr-stimulus">' + q.stimulus + '</div>' +
          '<div class="gr-meaning-hint">(' + q.meaning + ')</div>' +
          '<div class="gr-dir-hint">' + dirHint + '</div>' +
        '</div>' +

        '<div class="quiz-options gr-options" id="qz-options">' +
          q.options.map(function (opt, i) {
            return '<button class="quiz-option gr-opt" data-idx="' + i + '">' + opt + '</button>';
          }).join('') +
        '</div>' +

        '<div class="quiz-feedback" id="qz-feedback">' +
          '<div class="qf-result" id="qf-result"></div>' +
          '<div class="gr-explanation" id="gr-exp" style="display:none">' +
            (q.polite ? '<div class="gr-exp-row"><span class="gr-exp-lbl">Polido:</span> <span class="gr-exp-val">' + q.polite + '</span></div>' : '') +
            '<div class="gr-exp-row"><span class="gr-exp-lbl">Informal:</span> <span class="gr-exp-val">' + q.plain + '</span></div>' +
          '</div>' +
        '</div>' +

        '<button class="btn btn-primary quiz-next-btn hidden" id="qz-next">Próxima →</button>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="gr-exit" style="font-size:0.85rem;opacity:0.6">✕ Sair</button>' +
        '</div>' +
      '</div>';

    var optionsEl  = container.querySelector('#qz-options');
    var feedbackEl = container.querySelector('#qz-feedback');
    var resultEl   = container.querySelector('#qf-result');
    var expEl      = container.querySelector('#gr-exp');
    var nextBtn    = container.querySelector('#qz-next');

    function answer(chosenIdx) {
      if (_answered) return;
      _answered = true;

      var isCorrect = (chosenIdx === q.correct);
      if (isCorrect) _score++;
      _answers.push({ itemId: q.itemId, form: q.form, chosen: chosenIdx, correct: q.correct, isCorrect: isCorrect });

      optionsEl.querySelectorAll('.quiz-option').forEach(function (btn) {
        btn.classList.add('answered');
        var idx = parseInt(btn.dataset.idx);
        if (idx === q.correct)                  btn.classList.add('correct');
        else if (idx === chosenIdx && !isCorrect) btn.classList.add('wrong');
      });

      feedbackEl.classList.add('show', isCorrect ? 'correct-fb' : 'wrong-fb');
      resultEl.textContent = isCorrect
        ? '✅ Correto!'
        : '❌ Errado. Resposta correta: ' + q.correctAnswer;
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

    nextBtn.addEventListener('click', function () { _index++; _renderSession(container); });

    container.querySelector('#gr-exit').addEventListener('click', function () {
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

    var wrongItems = _answers.filter(function (a) { return !a.isCorrect; }).map(function (a) {
      var q = null;
      for (var i = 0; i < _questions.length; i++) {
        if (_questions[i].itemId === a.itemId && _questions[i].form === a.form) { q = _questions[i]; break; }
      }
      if (!q) return '';
      return '<div class="wrong-item">' +
        '<div class="wi-kanji" style="font-size:1.1rem;min-width:unset;padding-right:8px">' + q.stimulus + '</div>' +
        '<div class="wi-info">' +
          '<div class="wi-correct">' + q.correctAnswer + '</div>' +
          '<div class="wi-yours">Sua resposta: ' + q.options[a.chosen] + '</div>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML =
      '<div class="view-enter quiz-results">' +
        '<div class="qr-score-big">' +
          '<div style="font-size:2.5rem">' + emoji + '</div>' +
          '<div class="qr-num">' + _score + ' / ' + total + '</div>' +
          '<div class="qr-label">respostas corretas</div>' +
          '<div class="qr-pct" style="color:' + _pctColor(pct) + '">' + pct + '%</div>' +
        '</div>' +
        (wrongItems.length > 0
          ? '<div class="section-title">Respostas erradas (' + wrongItems.length + ')</div>' +
            '<div class="wrong-list">' + wrongItems.join('') + '</div>'
          : '') +
        '<div class="qr-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo">🔁 Refazer</button>' +
          '<button class="btn btn-ghost" id="btn-back-gr">← Voltar</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-redo').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = [];
      _shuffle(_questions);
      _renderSession(container);
    });
    container.querySelector('#btn-back-gr').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = [];
      _renderConfig(container);
    });
    KanjiApp.setKeyHandler(null);
  }

  function _pctColor(pct) {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 50) return 'var(--warning)';
    return 'var(--danger)';
  }

  function destroy() { KanjiApp.setKeyHandler(null); }

  return { render: render, destroy: destroy };

})();

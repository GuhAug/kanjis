// ============================================================
// grammar.js — Flexion/conjugation study and practice
// ============================================================

var GrammarView = (function () {

  function _getFormLabels() {
    return {
      pres:       Lang.t('grammar_form_pres'),
      neg:        Lang.t('grammar_form_neg'),
      past:       Lang.t('grammar_form_past'),
      'past-neg': Lang.t('grammar_form_past_neg'),
      te:         Lang.t('grammar_form_te'),
    };
  }

  function _getFormFull() {
    return {
      pres:       Lang.t('grammar_form_pres_full'),
      neg:        Lang.t('grammar_form_neg_full'),
      past:       Lang.t('grammar_form_past_full'),
      'past-neg': Lang.t('grammar_form_past_neg_full'),
      te:         Lang.t('grammar_form_te_full'),
    };
  }

  function _getCatShort() {
    return {
      verb:   Lang.t('grammar_cat_verb'),
      noun:   Lang.t('grammar_cat_noun'),
      i_adj:  Lang.t('grammar_cat_i_adj'),
      na_adj: Lang.t('grammar_cat_na_adj'),
    };
  }

  function _getCatFull() {
    return {
      verb:   Lang.t('grammar_cat_verb_full'),
      noun:   Lang.t('grammar_cat_noun_full'),
      i_adj:  Lang.t('grammar_cat_i_adj_full'),
      na_adj: Lang.t('grammar_cat_na_adj_full'),
    };
  }

  // Session state (preserved between config ↔ session)
  var _questions       = [];
  var _index           = 0;
  var _score           = 0;
  var _answers         = [];
  var _answered        = false;
  var _resultRecorded  = false;
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
    var allForms  = ['pres','neg','past','past-neg','te'];
    var allCats   = ['verb','noun','i_adj','na_adj'];
    var weakItems = KanjiStorage.getWeakItems('grammar', 3);

    function chips(items, selected, attr) {
      var labels = (attr === 'cat') ? _getCatShort() : _getFormLabels();
      return items.map(function (v) {
        var sel = selected.indexOf(v) !== -1 ? ' selected' : '';
        return '<div class="filter-chip' + sel + '" data-' + attr + '="' + v + '">' + labels[v] + '</div>';
      }).join('');
    }

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('grammar_title') + '</h1>' +
          '<p>' + Lang.t('grammar_subtitle') + '</p>' +
        '</div>' +
        '<div class="grammar-config card">' +
          '<div class="field">' +
            '<label>' + Lang.t('grammar_cat') + ' <span class="field-hint">' + Lang.t('grammar_cat_hint') + '</span></label>' +
            '<div class="chip-group" id="gr-cats">' + chips(allCats, _selCats, 'cat') + '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('grammar_forms') + ' <span class="field-hint">' + Lang.t('grammar_forms_hint') + '</span></label>' +
            '<div class="chip-group" id="gr-forms">' + chips(allForms, _selForms, 'form') + '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('grammar_direction') + '</label>' +
            '<div class="chip-group" id="gr-dir">' +
              '<div class="filter-chip' + (_direction === 'polite-to-plain' ? ' selected' : '') + '" data-dir="polite-to-plain">' + Lang.t('grammar_pol_to_pl') + '</div>' +
              '<div class="filter-chip' + (_direction === 'plain-to-polite' ? ' selected' : '') + '" data-dir="plain-to-polite">' + Lang.t('grammar_pl_to_pol') + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('grammar_count') + '</label>' +
            '<select id="gr-count">' +
              '<option value="10"' + (_count === 10 ? ' selected' : '') + '>10</option>' +
              '<option value="20"' + (_count === 20 ? ' selected' : '') + '>20</option>' +
              '<option value="0"'  + (_count === 0  ? ' selected' : '') + '>' + Lang.t('quiz_all') + '</option>' +
            '</select>' +
          '</div>' +
          '<div class="gr-config-actions">' +
            '<button class="btn btn-ghost" id="btn-gr-theory">' + Lang.t('grammar_theory_btn') + '</button>' +
            '<button class="btn btn-primary btn-lg" id="btn-start-gr">' + Lang.t('grammar_start') + '</button>' +
            (weakItems.length > 0
              ? '<button class="btn btn-secondary" id="btn-weak-gr">' +
                  '⚠️ ' + Lang.t('weak_btn') + ' (' + weakItems.length + ')' +
                '</button>'
              : '') +
          '</div>' +
          (weakItems.length > 0
            ? '<div style="font-size:0.78rem;color:var(--text-muted);margin-top:6px">' + Lang.t('weak_hint') + '</div>'
            : '') +
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
        Toast.error(Lang.t('grammar_select_err'));
        return;
      }
      var qs = _buildQuestions(_selCats, _selForms, _direction, _count);
      if (!qs.length) {
        Toast.error(Lang.t('grammar_no_qs'));
        return;
      }
      _questions = qs; _index = 0; _score = 0; _answers = []; _resultRecorded = false;
      _renderSession(container);
    });

    var weakBtn = container.querySelector('#btn-weak-gr');
    if (weakBtn) weakBtn.addEventListener('click', function () {
      var weakIds = weakItems.map(function (w) { return w.id; });
      var qs = _buildQuestions(allCats, allForms, _direction, 0, weakIds);
      if (!qs.length) { Toast.error(Lang.t('grammar_no_qs')); return; }
      _questions = qs; _index = 0; _score = 0; _answers = []; _resultRecorded = false;
      _renderSession(container);
    });
  }

  // ── Theory ──────────────────────────────────────────────

  function _renderTheory(container) {
    var isEN = Lang.get() === 'en';
    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + (isEN ? '📖 Theory — Polite and Plain Forms' : '📖 Teoria — Formas Polida e Informal') + '</h1>' +
          '<p>' + (isEN ? 'Transformation rules between polite (丁寧語) and plain (普通体) forms.' : 'Regras de transformação entre forma polida (丁寧語) e informal (普通体).') + '</p>' +
        '</div>' +
        _theoryVerbs() +
        _theoryNouns() +
        _theoryIAdj() +
        _theoryNaAdj() +
        '<div style="text-align:center;margin-top:24px;margin-bottom:8px">' +
          '<button class="btn btn-primary" id="btn-theory-back">' + Lang.t('grammar_back') + '</button>' +
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
    var isEN = Lang.get() === 'en';
    var cols = isEN
      ? ['Form', 'Polite (丁寧)', 'Plain (普通)']
      : ['Forma', 'Polido (丁寧)', 'Informal (普通)'];
    var rows = isEN
      ? [
          ['Present',    '〜ます',           '〜る (gr.2) / vowel+う (gr.1)'],
          ['Negative',   '〜ません',         '〜ない'],
          ['Past',       '〜ました',         '〜た / 〜んだ'],
          ['Past Neg.',  '〜ませんでした',   '〜なかった'],
          ['て-Form',    '—',                '〜て / 〜で'],
        ]
      : [
          ['Presente',       '〜ます',           '〜る (gr.2) / vogal+う (gr.1)'],
          ['Negativo',       '〜ません',         '〜ない'],
          ['Passado',        '〜ました',         '〜た / 〜んだ'],
          ['Pass. Negativo', '〜ませんでした',   '〜なかった'],
          ['Forma-て',       '—',                '〜て / 〜で'],
        ];
    var teCols = isEN
      ? ['Ending', 'Transforms to', 'Example']
      : ['Terminação', 'Transforma em', 'Exemplo'];
    var teRows = [
      ['〜く',      '〜いて',  '書く → 書いて'],
      ['〜ぐ',      '〜いで',  '泳ぐ → 泳いで'],
      ['〜す',      '〜して',  '話す → 話して'],
      ['〜む/ぬ/ぶ','〜んで',  '飲む → 飲んで'],
      ['〜る/つ/う','〜って',  '帰る → 帰って, 待つ → 待って'],
      ['行く (exc.)','行って', '—'],
    ];

    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">🏃 <strong>' + (isEN ? 'Verbs (動詞)' : 'Verbos (動詞)') + '</strong></div>' +
      '<p class="theory-note">' + (isEN
        ? 'Group <strong>1</strong> = godan (〜う/く/す/つ/む/ぬ/ぶ/る/ぐ) · <strong>2</strong> = ichidan (〜る) · <strong>3</strong> = irregular (する, 来る)'
        : 'Grupo <strong>1</strong> = godan (〜う/く/す/つ/む/ぬ/ぶ/る/ぐ) · <strong>2</strong> = ichidan (〜る) · <strong>3</strong> = irregular (する, 来る)') + '</p>' +
      _tbl(cols, rows) +
      '<div class="gr-te-table">' +
        '<div class="gr-te-title">' + (isEN ? 'て-Form Rules (group 1)' : 'Regras da Forma-て (grupo 1)') + '</div>' +
        _tbl(teCols, teRows) +
      '</div>' +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">' + (isEN ? 'Examples' : 'Exemplos') + '</div>' +
        _ex('食べます', '食べる', isEN ? 'eat'  : 'comer') +
        _ex('飲みます', '飲む',   isEN ? 'drink' : 'beber') +
        _ex('来ます',   '来る',   isEN ? 'come — irregular'   : 'vir — irregular') +
        _ex('します',   'する',   isEN ? 'do/make — irregular' : 'fazer — irregular') +
      '</div>' +
    '</div>';
  }

  function _theoryNouns() {
    var isEN = Lang.get() === 'en';
    var cols = isEN
      ? ['Form', 'Polite (丁寧)', 'Plain (普通)']
      : ['Forma', 'Polido (丁寧)', 'Informal (普通)'];
    var rows = isEN
      ? [
          ['Present',  'N + です',                    'N + だ'],
          ['Negative', 'N + じゃありません',          'N + じゃない'],
          ['Past',     'N + でした',                  'N + だった'],
          ['Past Neg.','N + じゃありませんでした',    'N + じゃなかった'],
        ]
      : [
          ['Presente',       'N + です',                    'N + だ'],
          ['Negativo',       'N + じゃありません',          'N + じゃない'],
          ['Passado',        'N + でした',                  'N + だった'],
          ['Pass. Negativo', 'N + じゃありませんでした',    'N + じゃなかった'],
        ];

    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">📦 <strong>' + (isEN ? 'Nouns (名詞) + です' : 'Substantivos (名詞) + です') + '</strong></div>' +
      _tbl(cols, rows) +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">' + (isEN ? 'Examples' : 'Exemplos') + '</div>' +
        _ex('学生です',              '学生だ',       isEN ? 'I am a student'   : 'sou estudante') +
        _ex('先生でした',            '先生だった',   isEN ? 'was a teacher'    : 'era professor') +
        _ex('学校じゃありません',    '学校じゃない', isEN ? "it's not a school" : 'não é escola') +
      '</div>' +
    '</div>';
  }

  function _theoryIAdj() {
    var isEN = Lang.get() === 'en';
    var cols = isEN
      ? ['Form', 'Polite (丁寧)', 'Plain (普通)']
      : ['Forma', 'Polido (丁寧)', 'Informal (普通)'];
    var rows = isEN
      ? [
          ['Present',  'Adj-い + です',      'Adj-い (no です)'],
          ['Negative', 'Adj-くないです',     'Adj-くない'],
          ['Past',     'Adj-かったです',     'Adj-かった'],
          ['Past Neg.','Adj-くなかったです', 'Adj-くなかった'],
        ]
      : [
          ['Presente',       'Adj-い + です',      'Adj-い (sem です)'],
          ['Negativo',       'Adj-くないです',     'Adj-くない'],
          ['Passado',        'Adj-かったです',     'Adj-かった'],
          ['Pass. Negativo', 'Adj-くなかったです', 'Adj-くなかった'],
        ];

    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">✨ <strong>' + (isEN ? 'い-adjectives (い形容詞)' : 'い-adjetivos (い形容詞)') + '</strong></div>' +
      '<p class="theory-note">' + (isEN
        ? 'Exception: <strong>いい</strong> (good) uses the base <strong>よ</strong> in modified forms → よくない / よかった / よくなかった'
        : 'Exceção: <strong>いい</strong> (bom) usa a base <strong>よ</strong> nas formas modificadas → よくない / よかった / よくなかった') + '</p>' +
      _tbl(cols, rows) +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">' + (isEN ? 'Examples' : 'Exemplos') + '</div>' +
        _ex('高いです',        '高い',        isEN ? "it's expensive"     : 'é caro') +
        _ex('高くないです',    '高くない',    isEN ? "it's not expensive"  : 'não é caro') +
        _ex('高かったです',    '高かった',    isEN ? 'it was expensive'    : 'era caro') +
        _ex('いいです',        'いい',        isEN ? "it's good (exception)" : 'é bom (exceção)') +
        _ex('よくなかったです','よくなかった',isEN ? 'not good (exception)' : 'não era bom (exceção)') +
      '</div>' +
    '</div>';
  }

  function _theoryNaAdj() {
    var isEN = Lang.get() === 'en';
    var cols = isEN
      ? ['Form', 'Polite (丁寧)', 'Plain (普通)']
      : ['Forma', 'Polido (丁寧)', 'Informal (普通)'];
    var rows = isEN
      ? [
          ['Present',  'Adj-na + です',                 'Adj-na + だ'],
          ['Negative', 'Adj-na + じゃありません',       'Adj-na + じゃない'],
          ['Past',     'Adj-na + でした',               'Adj-na + だった'],
          ['Past Neg.','Adj-na + じゃありませんでした', 'Adj-na + じゃなかった'],
        ]
      : [
          ['Presente',       'Adj-na + です',                 'Adj-na + だ'],
          ['Negativo',       'Adj-na + じゃありません',       'Adj-na + じゃない'],
          ['Passado',        'Adj-na + でした',               'Adj-na + だった'],
          ['Pass. Negativo', 'Adj-na + じゃありませんでした', 'Adj-na + じゃなかった'],
        ];

    return '<div class="card grammar-theory-card">' +
      '<div class="theory-cat-header">🌸 <strong>' + (isEN ? 'な-adjectives (な形容詞)' : 'な-adjetivos (な形容詞)') + '</strong></div>' +
      '<p class="theory-note">' + (isEN
        ? 'Same conjugation as nouns — uses だ/じゃない/だった/じゃなかった.'
        : 'Conjugação idêntica à dos substantivos — usa だ/じゃない/だった/じゃなかった.') + '</p>' +
      _tbl(cols, rows) +
      '<div class="theory-examples">' +
        '<div class="gr-ex-title">' + (isEN ? 'Examples' : 'Exemplos') + '</div>' +
        _ex('元気です',            '元気だ',       isEN ? 'is well/healthy' : 'está bem/saudável') +
        _ex('きれいでした',        'きれいだった', isEN ? 'was beautiful'   : 'era bonito/a') +
        _ex('好きじゃありません',  '好きじゃない', isEN ? "doesn't like"    : 'não gosta') +
      '</div>' +
    '</div>';
  }

  // ── Build questions ──────────────────────────────────────

  function _buildQuestions(cats, forms, direction, count, weakIds) {
    var data = window.GRAMMAR_DATA || [];
    var pool = weakIds
      ? data
      : data.filter(function (item) { return cats.indexOf(item.category) !== -1; });
    var formFull   = _getFormFull();
    var catFull    = _getCatFull();
    var activeForms = weakIds ? ['pres','neg','past','past-neg','te'] : forms;

    var questions = [];

    pool.forEach(function (item) {
      activeForms.forEach(function (form) {
        if (weakIds && weakIds.indexOf(item.id + ':' + form) === -1) return;
        if (form === 'te' && item.category !== 'verb') return;

        var f = item.forms[form];
        if (!f) return;

        var isTe    = (form === 'te');
        var toPlain = isTe || direction === 'polite-to-plain';

        var stimulus      = isTe ? item.dict : (toPlain ? f.polite : f.plain);
        var correctAnswer = toPlain ? f.plain : f.polite;
        if (!stimulus || !correctAnswer) return;

        var stimLabel = catFull[item.category] + ' — ' + formFull[form];

        var distFormKeys = isTe
          ? ['neg', 'past', 'past-neg']
          : ['pres', 'neg', 'past', 'past-neg'].filter(function (k) { return k !== form; });

        var distractors = [];
        distFormKeys.forEach(function (dk) {
          var df = item.forms[dk];
          if (!df) return;
          var val = toPlain ? df.plain : df.polite;
          if (val && val !== correctAnswer) distractors.push(val);
        });

        if (distractors.length < 3) {
          pool.forEach(function (other) {
            if (other.id === item.id) return;
            var of = other.forms[form];
            if (!of) return;
            var val = toPlain ? of.plain : of.polite;
            if (val) distractors.push(val);
          });
        }

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
          meaning:       Lang.get() === 'en' ? (item.en || item.meaning) : item.meaning,
          dict:          item.dict,
          options:       options,
          correct:       options.indexOf(correctAnswer),
          correctAnswer: correctAnswer,
          polite:        isTe ? null : f.polite,
          plain:         f.plain,
          formFull:      formFull[form],
        });
      });
    });

    _shuffle(questions);
    if (!weakIds && count > 0) questions = questions.slice(0, count);
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
    var isEN = Lang.get() === 'en';

    var dirHint = q.form === 'te'
      ? (isEN ? 'What is the て-form of this verb?' : 'Qual é a forma-て deste verbo?')
      : (_direction === 'polite-to-plain'
          ? (isEN ? 'Transform to the <strong>plain</strong> form:' : 'Transforme para a forma <strong>informal</strong>:')
          : (isEN ? 'Transform to the <strong>polite</strong> form:' : 'Transforme para a forma <strong>polida</strong>:'));

    var politeLabel = isEN ? 'Polite:' : 'Polido:';
    var plainLabel  = isEN ? 'Plain:'  : 'Informal:';

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
            (q.polite ? '<div class="gr-exp-row"><span class="gr-exp-lbl">' + politeLabel + '</span> <span class="gr-exp-val">' + q.polite + '</span></div>' : '') +
            '<div class="gr-exp-row"><span class="gr-exp-lbl">' + plainLabel + '</span> <span class="gr-exp-val">' + q.plain + '</span></div>' +
          '</div>' +
        '</div>' +

        '<button class="btn btn-primary quiz-next-btn hidden" id="qz-next">' + Lang.t('grammar_next') + '</button>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="gr-exit" style="font-size:0.85rem;opacity:0.6">' + Lang.t('grammar_exit') + '</button>' +
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
      KanjiStorage.recordItemResult('grammar', q.itemId + ':' + q.form, isCorrect);
      _answers.push({ qIdx: _index, itemId: q.itemId, form: q.form, chosen: chosenIdx, correct: q.correct, isCorrect: isCorrect });

      optionsEl.querySelectorAll('.quiz-option').forEach(function (btn) {
        btn.classList.add('answered');
        var idx = parseInt(btn.dataset.idx);
        if (idx === q.correct)                    btn.classList.add('correct');
        else if (idx === chosenIdx && !isCorrect) btn.classList.add('wrong');
      });

      feedbackEl.classList.add('show', isCorrect ? 'correct-fb' : 'wrong-fb');
      resultEl.textContent = isCorrect
        ? Lang.t('grammar_correct')
        : Lang.t('grammar_wrong_prefix') + q.correctAnswer;
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

    if (!_resultRecorded) {
      KanjiStorage.recordGrammarQuiz('grammar', _score, total);
      _resultRecorded = true;
    }

    var wrongAnswers = _answers.filter(function (a) { return !a.isCorrect; });
    var wrongItems   = wrongAnswers.map(function (a) {
      var q = _questions[a.qIdx];
      if (!q) return '';
      return '<div class="wrong-item">' +
        '<div class="wi-kanji" style="font-size:1.1rem;min-width:unset;padding-right:8px">' + q.stimulus + '</div>' +
        '<div class="wi-info">' +
          '<div class="wi-correct">' + q.correctAnswer + '</div>' +
          '<div class="wi-yours">' + Lang.t('grammar_your_ans') + q.options[a.chosen] + '</div>' +
        '</div>' +
      '</div>';
    });

    container.innerHTML =
      '<div class="view-enter quiz-results">' +
        '<div class="qr-score-big">' +
          '<div style="font-size:2.5rem">' + emoji + '</div>' +
          '<div class="qr-num">' + _score + ' / ' + total + '</div>' +
          '<div class="qr-label">' + Lang.t('grammar_correct_answers') + '</div>' +
          '<div class="qr-pct" style="color:' + KanjiData.pctColor(pct) + '">' + pct + '%</div>' +
        '</div>' +
        (wrongItems.length > 0
          ? '<div class="section-title">' + Lang.t('grammar_wrong_title') + ' (' + wrongItems.length + ')</div>' +
            '<div class="wrong-list">' + wrongItems.join('') + '</div>'
          : '') +
        '<div class="qr-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo">' + Lang.t('grammar_redo') + '</button>' +
          (wrongAnswers.length > 0
            ? '<button class="btn btn-secondary" id="btn-review-gr">' + Lang.t('grammar_review') + ' (' + wrongAnswers.length + ')</button>'
            : '') +
          '<button class="btn btn-ghost" id="btn-back-gr">' + Lang.t('grammar_back') + '</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-redo').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = [];
      _shuffle(_questions);
      _renderSession(container);
    });
    var reviewBtn = container.querySelector('#btn-review-gr');
    if (reviewBtn) reviewBtn.addEventListener('click', function () {
      var seen = {};
      var wrongQs = wrongAnswers
        .filter(function (a) { if (seen[a.qIdx]) return false; seen[a.qIdx] = true; return true; })
        .map(function (a) { return _questions[a.qIdx]; })
        .filter(Boolean);
      _questions = wrongQs; _index = 0; _score = 0; _answers = [];
      _renderSession(container);
    });
    container.querySelector('#btn-back-gr').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = []; _resultRecorded = false;
      _renderConfig(container);
    });
    KanjiApp.setKeyHandler(null);
  }

  function destroy() { KanjiApp.setKeyHandler(null); }

  return { render: render, destroy: destroy };

})();

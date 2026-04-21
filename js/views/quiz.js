// ============================================================
// quiz.js — Quiz engine + view
// ============================================================

var QuizView = (function () {

  // Session state
  var _questions = [];
  var _index     = 0;
  var _score     = 0;
  var _answers   = [];
  var _type      = 'meaning';
  var _answered  = false;

  // ---- QuizEngine (pure logic) ----
  function buildQuestions(pool, type, count) {
    var questions = [];

    // Filter pool by type requirements
    var validPool = pool.filter(function (k) {
      if (type === 'kun')  return !!k.kun;
      if (type === 'on')   return !!k.on;
      return true; // meaning and recognition work for all
    });

    if (!validPool.length) return [];

    var shuffled = KanjiData.shuffle(validPool.slice());
    var limit = count === 0 ? shuffled.length : Math.min(count, shuffled.length);

    for (var i = 0; i < limit; i++) {
      var k = shuffled[i];
      var q = _buildQuestion(k, type, validPool);
      if (q) questions.push(q);
    }

    return questions;
  }

  function _buildQuestion(k, type, pool) {
    var stimulus, stimulusType, options, correctIndex, field;

    if (type === 'meaning') {
      // Kanji → Portuguese meaning
      var distractors = KanjiData.getDistractors(k, 'pt', 3);
      if (distractors.length < 3) return null;
      options = distractors.concat([k.pt]);
      KanjiData.shuffle(options);
      correctIndex = options.indexOf(k.pt);
      return {
        kanjiId:    k.id,
        type:       'meaning',
        stimLabel:  'O que significa este kanji?',
        stimKanji:  k.k,
        stimText:   null,
        options:    options,
        correct:    correctIndex,
        explanation: { pt: k.pt, example: k.kunEx || k.onEx, exampleHtml: k.kunExHtml || k.onExHtml, translation: k.kunTr || k.onTr },
      };
    }

    if (type === 'kun') {
      var dist = KanjiData.getDistractors(k, 'kun', 3);
      if (dist.length < 3) return null;
      options = dist.concat([k.kun]);
      KanjiData.shuffle(options);
      return {
        kanjiId:   k.id,
        type:      'kun',
        stimLabel: 'Qual a leitura Kun deste kanji?',
        stimKanji: k.k,
        stimText:  null,
        options:   options,
        correct:   options.indexOf(k.kun),
        explanation: { pt: k.pt, example: k.kunEx, exampleHtml: k.kunExHtml, translation: k.kunTr },
      };
    }

    if (type === 'on') {
      var distO = KanjiData.getDistractors(k, 'on', 3);
      if (distO.length < 3) return null;
      options = distO.concat([k.on]);
      KanjiData.shuffle(options);
      return {
        kanjiId:   k.id,
        type:      'on',
        stimLabel: 'Qual a leitura On deste kanji?',
        stimKanji: k.k,
        stimText:  null,
        options:   options,
        correct:   options.indexOf(k.on),
        explanation: { pt: k.pt, example: k.onEx, exampleHtml: k.onExHtml, translation: k.onTr },
      };
    }

    if (type === 'recognition') {
      // Meaning → Kanji character
      var distK = KanjiData.getDistractors(k, 'k', 3);
      if (distK.length < 3) return null;
      options = distK.concat([k.k]);
      KanjiData.shuffle(options);
      return {
        kanjiId:   k.id,
        type:      'recognition',
        stimLabel: 'Qual é o kanji para:',
        stimKanji: null,
        stimText:  k.pt,
        options:   options,
        correct:   options.indexOf(k.k),
        explanation: { pt: k.pt, example: k.kunEx || k.onEx, exampleHtml: k.kunExHtml || k.onExHtml, translation: k.kunTr || k.onTr },
      };
    }

    if (type === 'reading') {
      var sentence    = k.kunEx || k.onEx;
      var sentenceHtml = k.kunExHtml || k.onExHtml;
      if (!sentence) return null;

      // Find which token in the annotated HTML contains k.k.
      // If it's a compound (今日, 音楽…) we ask for the full compound reading.
      var targetSurface = k.k;
      var correctReading = null;
      if (sentenceHtml) {
        var re = /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g, m;
        while ((m = re.exec(sentenceHtml)) !== null) {
          if (m[1].indexOf(k.k) !== -1) {
            targetSurface  = m[1];   // e.g. "今日"
            correctReading = m[2];   // e.g. "きょう"
            break;
          }
        }
      }
      // Fall back to isolated kun/on reading
      function _cleanR(r) {
        return r.split('、')[0].replace(/[（(][^）)]*[）)]/g,'').replace(/[～〜~]/g,'')
          .replace(/[ァ-ン]/g, function(c){ return String.fromCharCode(c.charCodeAt(0)-0x60); }).trim();
      }
      if (!correctReading) {
        correctReading = k.kun ? _cleanR(k.kun) : (k.on ? _cleanR(k.on) : null);
      }
      if (!correctReading) return null;

      // Build distractors:
      // 1. Always include the naive single-kanji readings as tempting wrong answers
      // 2. Fill remaining slots from pool
      var distractors = [];
      if (targetSurface !== k.k) {
        // We're asking about a compound — add the isolated reading as a distractor
        var naiveKun = k.kun ? _cleanR(k.kun) : null;
        var naiveOn  = k.on  ? _cleanR(k.on)  : null;
        if (naiveKun && naiveKun !== correctReading) distractors.push(naiveKun);
        if (naiveOn  && naiveOn  !== correctReading && naiveOn !== naiveKun) distractors.push(naiveOn);
      }
      var poolDist = KanjiData.getDistractors(k, k.kun ? 'kun' : 'on', 4)
        .map(_cleanR)
        .filter(function(r){ return r && r !== correctReading && distractors.indexOf(r) === -1; });
      distractors = distractors.concat(poolDist).slice(0, 3);
      if (distractors.length < 3) return null;

      options = distractors.concat([correctReading]);
      KanjiData.shuffle(options);

      // Stimulus: plain sentence with the full target surface highlighted
      var stimHtml = sentence.replace(
        new RegExp(targetSurface.split('').join(''), 'g'),
        '<span class="qs-target">' + targetSurface + '</span>'
      );

      var stimLabel = targetSurface.length > 1
        ? 'Como se lê a palavra destacada?'
        : 'Como se lê o kanji destacado?';

      return {
        kanjiId:     k.id,
        type:        'reading',
        stimLabel:   stimLabel,
        stimKanji:   null,
        stimText:    null,
        stimSentence: stimHtml,
        options:     options,
        correct:     options.indexOf(correctReading),
        explanation: { pt: k.pt, example: sentence, exampleHtml: sentenceHtml, translation: k.kunTr || k.onTr },
      };
    }

    return null;
  }

  // ---- Config screen ----
  function render(container, params) {
    // Support direct navigation: /quiz/level/chapter
    if (params[1] && params[1] !== '/session' && params[1] !== '/results') {
      var parts = params[1].replace(/^\//, '').split('/');
      var lv = parseInt(parts[0]) || 0;
      var ch = parseInt(parts[1]) || 0;
      var pool = KanjiData.getPool(lv, ch);
      _type = 'meaning';
      _questions = buildQuestions(pool, _type, 10);
      _questions = _questions.filter(Boolean);
      _index = 0; _score = 0; _answers = [];
      _renderSession(container);
      return;
    }
    if (params[1] === '/session' && _questions.length > 0) {
      _renderSession(container);
    } else if (params[1] === '/results' && _answers.length > 0) {
      _renderResults(container);
    } else {
      _renderConfig(container);
    }
  }

  function _renderConfig(container) {
    var levels = KanjiData.getLevels();

    var levelOpts = '<option value="0">Todos os níveis</option>' +
      levels.map(function (lv) {
        return '<option value="' + lv.level + '">' + lv.name + '</option>';
      }).join('');

    var countOpts = [5, 10, 20].map(function (n) {
      return '<option value="' + n + '" ' + (n === 10 ? 'selected' : '') + '>' + n + ' questões</option>';
    }).join('') + '<option value="0">Todas</option>';

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>✏️ Quiz</h1>' +
          '<p>Teste seus conhecimentos sobre os kanji.</p>' +
        '</div>' +
        '<div class="quiz-config card">' +
          '<div class="field">' +
            '<label>Nível</label>' +
            '<select id="qz-level">' + levelOpts + '</select>' +
          '</div>' +
          '<div class="field">' +
            '<label>Capítulo</label>' +
            '<select id="qz-chapter"><option value="0">Todos os capítulos</option></select>' +
          '</div>' +
          '<div class="field">' +
            '<label>Número de questões</label>' +
            '<select id="qz-count">' + countOpts + '</select>' +
          '</div>' +
          '<div class="field">' +
            '<label>Tipo de quiz</label>' +
            '<div class="quiz-type-options">' +
              _typeOpt('meaning',     '🀄', 'Significado',    'Kanji → adivinhe o significado em português') +
              _typeOpt('kun',         '📝', 'Leitura Kun',    'Kanji → adivinhe a leitura Kun (hiragana)') +
              _typeOpt('on',          '🔊', 'Leitura On',     'Kanji → adivinhe a leitura On (katakana)') +
              _typeOpt('recognition', '🔍', 'Reconhecimento', 'Significado → identifique o kanji correto') +
              _typeOpt('reading',     '📝', 'Leitura em frase', 'Frase completa → escolha a leitura do kanji destacado') +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary btn-lg w-full mt-16" id="btn-start-qz">Iniciar quiz</button>' +
        '</div>' +
      '</div>';

    var levelSel   = container.querySelector('#qz-level');
    var chapterSel = container.querySelector('#qz-chapter');
    _type = 'meaning';

    function updateChapters() {
      var lv = parseInt(levelSel.value);
      var chapters = lv ? KanjiData.getChaptersForLevel(lv) : [];
      chapterSel.innerHTML = '<option value="0">Todos os capítulos</option>' +
        chapters.map(function (ch) {
          return '<option value="' + ch + '">Capítulo ' + ch + '</option>';
        }).join('');
    }

    levelSel.addEventListener('change', updateChapters);

    container.querySelectorAll('.quiz-type-opt').forEach(function (el) {
      el.addEventListener('click', function () {
        container.querySelectorAll('.quiz-type-opt').forEach(function (x) { x.classList.remove('selected'); });
        el.classList.add('selected');
        _type = el.dataset.type;
      });
    });
    container.querySelector('[data-type="meaning"]').classList.add('selected');

    container.querySelector('#btn-start-qz').addEventListener('click', function () {
      var lv  = parseInt(levelSel.value);
      var ch  = parseInt(chapterSel.value);
      var cnt = parseInt(container.querySelector('#qz-count').value);
      var pool = KanjiData.getPool(lv, ch);
      var qs = buildQuestions(pool, _type, cnt);
      qs = qs.filter(Boolean);

      if (!qs.length) {
        Toast.error('Não há kanji suficientes para este tipo de quiz. Tente outro nível ou tipo.');
        return;
      }

      _questions = qs;
      _index = 0; _score = 0; _answers = [];
      _renderSession(container);
    });
  }

  function _typeOpt(type, icon, title, desc) {
    return '<div class="quiz-type-opt" data-type="' + type + '">' +
      '<span class="qt-icon">' + icon + '</span>' +
      '<div class="qt-text">' +
        '<div class="qt-title">' + title + '</div>' +
        '<div class="qt-desc">' + desc + '</div>' +
      '</div>' +
    '</div>';
  }

  // ---- Session ----
  function _renderSession(container) {
    if (_index >= _questions.length) {
      _renderResults(container);
      return;
    }

    _answered = false;
    var q   = _questions[_index];
    var pct = Math.round((_index / _questions.length) * 100);

    container.innerHTML =
      '<div class="view-enter quiz-session">' +
        '<div class="quiz-prog-bar"><div class="quiz-prog-fill" id="qz-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="quiz-counter">' + (_index + 1) + ' / ' + _questions.length + '</div>' +

        '<div class="quiz-stimulus">' +
          '<div class="qs-label">' + q.stimLabel + '</div>' +
          (q.stimKanji    ? '<div class="qs-kanji">'    + q.stimKanji    + '</div>' : '') +
          (q.stimText     ? '<div class="qs-text">'     + q.stimText     + '</div>' : '') +
          (q.stimSentence ? '<div class="qs-sentence example-jp">' + q.stimSentence + '</div>' : '') +
        '</div>' +

        '<div class="quiz-options" id="qz-options">' +
          q.options.map(function (opt, i) {
            return '<button class="quiz-option" data-idx="' + i + '">' + opt + '</button>';
          }).join('') +
        '</div>' +

        '<div class="quiz-feedback" id="qz-feedback">' +
          '<div class="qf-result" id="qf-result"></div>' +
          (q.explanation.example ?
            '<div class="qf-example example-jp">' + (q.explanation.exampleHtml || KanjiData.annotateEx(q.explanation.example)) + '</div>' +
            (q.explanation.translation ? '<div class="qf-trans">' + q.explanation.translation + '</div>' : '')
            : '') +
        '</div>' +

        '<button class="btn btn-primary quiz-next-btn hidden" id="qz-next">Próxima →</button>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="qz-exit" style="font-size:0.85rem;opacity:0.6">✕ Sair do quiz</button>' +
        '</div>' +
      '</div>';

    var optionsEl = container.querySelector('#qz-options');
    var feedbackEl = container.querySelector('#qz-feedback');
    var resultEl   = container.querySelector('#qf-result');
    var nextBtn    = container.querySelector('#qz-next');

    function answer(chosenIdx) {
      if (_answered) return;
      _answered = true;

      var isCorrect = (chosenIdx === q.correct);
      if (isCorrect) _score++;
      _answers.push({ id: q.kanjiId, chosen: chosenIdx, correct: q.correct, isCorrect: isCorrect });

      // Highlight options
      optionsEl.querySelectorAll('.quiz-option').forEach(function (btn) {
        btn.classList.add('answered');
        var idx = parseInt(btn.dataset.idx);
        if (idx === q.correct) btn.classList.add('correct');
        else if (idx === chosenIdx && !isCorrect) btn.classList.add('wrong');
      });

      // Feedback
      feedbackEl.classList.add('show');
      feedbackEl.classList.add(isCorrect ? 'correct-fb' : 'wrong-fb');
      resultEl.textContent = isCorrect
        ? '✅ Correto! — ' + q.explanation.pt
        : '❌ Errado. A resposta correta é: ' + q.options[q.correct];

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

    container.querySelector('#qz-exit').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = [];
      _renderConfig(container);
    });

    // Keyboard: 1-4 to select option
    KanjiApp.setKeyHandler(function (e) {
      var n = parseInt(e.key);
      if (n >= 1 && n <= 4) answer(n - 1);
    });
  }

  // ---- Results ----
  function _renderResults(container) {
    var total = _questions.length;
    var pct   = total ? Math.round((_score / total) * 100) : 0;
    var emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪';

    var wrongAnswers = _answers.filter(function (a) { return !a.isCorrect; });
    var wrongKanji   = wrongAnswers.map(function (a) {
      var k = KanjiData.getById(a.id);
      if (!k) return '';
      var q = _questions.find(function (q) { return q.kanjiId === a.id; });
      return '<div class="wrong-item">' +
        '<div class="wi-kanji">' + k.k + '</div>' +
        '<div class="wi-info">' +
          '<div class="wi-correct">' + (q ? q.options[q.correct] : k.pt) + '</div>' +
          '<div class="wi-yours">Sua resposta: ' + (q ? q.options[a.chosen] : '?') + '</div>' +
        '</div>' +
      '</div>';
    });

    KanjiStorage.recordQuiz(_type, _score, total);
    Navbar.updateProgress();

    container.innerHTML =
      '<div class="view-enter quiz-results">' +
        '<div class="qr-score-big">' +
          '<div style="font-size:2.5rem">' + emoji + '</div>' +
          '<div class="qr-num">' + _score + ' / ' + total + '</div>' +
          '<div class="qr-label">questões corretas</div>' +
          '<div class="qr-pct" style="color:' + _pctColor(pct) + '">' + pct + '%</div>' +
        '</div>' +

        (wrongKanji.length > 0 ?
          '<div class="section-title">Respostas erradas (' + wrongKanji.length + ')</div>' +
          '<div class="wrong-list">' + wrongKanji.join('') + '</div>' : '') +

        '<div class="qr-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo">🔁 Refazer quiz</button>' +
          (wrongKanji.length > 0 ?
            '<button class="btn btn-secondary btn-lg" id="btn-study-wrong">🃏 Estudar erros no Flashcard</button>' : '') +
          '<button class="btn btn-ghost" id="btn-back">← Voltar</button>' +
        '</div>' +
      '</div>';

    container.querySelector('#btn-redo').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = [];
      KanjiData.shuffle(_questions);
      _renderSession(container);
    });

    var btnStudy = container.querySelector('#btn-study-wrong');
    if (btnStudy) btnStudy.addEventListener('click', function () {
      var wrongIds = wrongAnswers.map(function (a) { return a.id; });
      // Store in flashcard state and navigate
      FlashcardView._startWithIds(wrongIds, container);
    });

    container.querySelector('#btn-back').addEventListener('click', function () {
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

  function destroy() {
    KanjiApp.setKeyHandler(null);
  }

  return { render: render, destroy: destroy };

})();

// Allow quiz to start flashcard with specific IDs
FlashcardView._startWithIds = function (ids, container) {
  var pool = ids.map(function (id) { return KanjiData.getById(id); }).filter(Boolean);
  if (!pool.length) return;
  // Store globally and navigate
  window._fcOverridePool = pool;
  KanjiApp.navigate('/flashcard/custom');
};

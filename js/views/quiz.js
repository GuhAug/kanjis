// ============================================================
// quiz.js — Quiz engine + view
// ============================================================

var QuizView = (function () {

  var _questions = [];
  var _index     = 0;
  var _score     = 0;
  var _answers   = [];
  var _type      = 'meaning';
  var _answered  = false;

  // ---- QuizEngine (pure logic) ----
  function buildQuestions(pool, type, count) {
    var questions = [];

    var validPool = pool.filter(function (k) {
      if (type === 'kun')  return !!k.kun;
      if (type === 'on')   return !!k.on;
      return true;
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
    var options, correctIndex;

    if (type === 'meaning') {
      var distractors = KanjiData.getDistractors(k, 'pt', 3);
      if (distractors.length < 3) return null;
      options = distractors.concat([k.pt]);
      KanjiData.shuffle(options);
      correctIndex = options.indexOf(k.pt);
      return {
        kanjiId:    k.id,
        type:       'meaning',
        stimLabel:  Lang.t('quiz_stim_meaning'),
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
        stimLabel: Lang.t('quiz_stim_kun'),
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
        stimLabel: Lang.t('quiz_stim_on'),
        stimKanji: k.k,
        stimText:  null,
        options:   options,
        correct:   options.indexOf(k.on),
        explanation: { pt: k.pt, example: k.onEx, exampleHtml: k.onExHtml, translation: k.onTr },
      };
    }

    if (type === 'recognition') {
      var distK = KanjiData.getDistractors(k, 'k', 3);
      if (distK.length < 3) return null;
      options = distK.concat([k.k]);
      KanjiData.shuffle(options);
      return {
        kanjiId:   k.id,
        type:      'recognition',
        stimLabel: Lang.t('quiz_stim_recog'),
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

      var targetSurface = k.k;
      var correctReading = null;
      if (sentenceHtml) {
        var re = /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>/g, m;
        while ((m = re.exec(sentenceHtml)) !== null) {
          if (m[1].indexOf(k.k) !== -1) {
            targetSurface  = m[1];
            correctReading = m[2];
            break;
          }
        }
      }
      function _cleanR(r) {
        return r.split('、')[0].replace(/[（(][^）)]*[）)]/g,'').replace(/[～〜~]/g,'')
          .replace(/[ァ-ン]/g, function(c){ return String.fromCharCode(c.charCodeAt(0)-0x60); }).trim();
      }
      if (!correctReading) {
        correctReading = k.kun ? _cleanR(k.kun) : (k.on ? _cleanR(k.on) : null);
      }
      if (!correctReading) return null;

      var distractors = [];
      if (targetSurface !== k.k) {
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

      var stimHtml = sentence.replace(
        new RegExp(targetSurface.split('').join(''), 'g'),
        '<span class="qs-target">' + targetSurface + '</span>'
      );

      var stimLabel = targetSurface.length > 1
        ? Lang.t('quiz_stim_word')
        : Lang.t('quiz_stim_kanji');

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
    var selectedLevels   = [];
    var selectedChapters = [];

    var levelChips = levels.map(function (lv) {
      return '<div class="filter-chip" data-level="' + lv.level + '">' + (Lang.t('level_' + lv.level) || lv.name) + '</div>';
    }).join('');

    var countOpts = [5, 10, 20].map(function (n) {
      return '<option value="' + n + '" ' + (n === 10 ? 'selected' : '') + '>' + n + ' ' + Lang.t('quiz_count').toLowerCase().replace('number of ', '').replace('número de ', '') + '</option>';
    }).join('') + '<option value="0">' + Lang.t('quiz_all') + '</option>';

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header">' +
          '<h1>' + Lang.t('quiz_title') + '</h1>' +
          '<p>' + Lang.t('quiz_subtitle') + '</p>' +
        '</div>' +
        '<div class="quiz-config card">' +
          '<div class="field">' +
            '<label>' + Lang.t('quiz_level') + ' <span class="field-hint">' + Lang.t('quiz_level_hint') + '</span></label>' +
            '<div class="chip-group" id="qz-levels">' + levelChips + '</div>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('quiz_chapter') + ' <span class="field-hint">' + Lang.t('quiz_chapter_hint') + '</span></label>' +
            '<div class="chip-group" id="qz-chapters"></div>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('quiz_count') + '</label>' +
            '<select id="qz-count">' + countOpts + '</select>' +
          '</div>' +
          '<div class="field">' +
            '<label>' + Lang.t('quiz_type') + '</label>' +
            '<div class="quiz-type-options">' +
              _typeOpt('meaning',     '🀄', Lang.t('quiz_meaning_title'), Lang.t('quiz_meaning_desc')) +
              _typeOpt('kun',         '📝', Lang.t('quiz_kun_title'),     Lang.t('quiz_kun_desc')) +
              _typeOpt('on',          '🔊', Lang.t('quiz_on_title'),      Lang.t('quiz_on_desc')) +
              _typeOpt('recognition', '🔍', Lang.t('quiz_recog_title'),   Lang.t('quiz_recog_desc')) +
              _typeOpt('reading',     '📝', Lang.t('quiz_reading_title'), Lang.t('quiz_reading_desc')) +
            '</div>' +
          '</div>' +
          '<button class="btn btn-primary btn-lg w-full mt-16" id="btn-start-qz">' + Lang.t('quiz_start') + '</button>' +
        '</div>' +
      '</div>';

    _type = 'meaning';

    function updateChapterChips() {
      var chaptersEl = container.querySelector('#qz-chapters');
      var chapters = KanjiData.getChaptersForLevels(selectedLevels);
      selectedChapters = selectedChapters.filter(function (ch) { return chapters.indexOf(ch) !== -1; });
      chaptersEl.innerHTML = chapters.map(function (ch) {
        var sel = selectedChapters.indexOf(ch) !== -1 ? ' selected' : '';
        return '<div class="filter-chip' + sel + '" data-chapter="' + ch + '">' + Lang.t('quiz_cap') + ' ' + ch + '</div>';
      }).join('');
      chaptersEl.querySelectorAll('.filter-chip').forEach(function (el) {
        el.addEventListener('click', function () {
          var ch = parseInt(el.dataset.chapter);
          var idx = selectedChapters.indexOf(ch);
          if (idx === -1) { selectedChapters.push(ch); el.classList.add('selected'); }
          else            { selectedChapters.splice(idx, 1); el.classList.remove('selected'); }
        });
      });
    }

    updateChapterChips();

    container.querySelector('#qz-levels').addEventListener('click', function (e) {
      var chip = e.target.closest('.filter-chip');
      if (!chip) return;
      var lv  = parseInt(chip.dataset.level);
      var idx = selectedLevels.indexOf(lv);
      if (idx === -1) { selectedLevels.push(lv); chip.classList.add('selected'); }
      else            { selectedLevels.splice(idx, 1); chip.classList.remove('selected'); }
      updateChapterChips();
    });

    container.querySelectorAll('.quiz-type-opt').forEach(function (el) {
      el.addEventListener('click', function () {
        container.querySelectorAll('.quiz-type-opt').forEach(function (x) { x.classList.remove('selected'); });
        el.classList.add('selected');
        _type = el.dataset.type;
      });
    });
    container.querySelector('[data-type="meaning"]').classList.add('selected');

    container.querySelector('#btn-start-qz').addEventListener('click', function () {
      var cnt  = parseInt(container.querySelector('#qz-count').value);
      var pool = KanjiData.getPoolMulti(selectedLevels, selectedChapters);
      var qs   = buildQuestions(pool, _type, cnt);
      qs = qs.filter(Boolean);

      if (!qs.length) {
        Toast.error(Lang.t('quiz_no_kanji'));
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

        '<button class="btn btn-primary quiz-next-btn hidden" id="qz-next">' + Lang.t('quiz_next') + '</button>' +
        '<div style="text-align:center;margin-top:12px">' +
          '<button class="btn btn-ghost" id="qz-exit" style="font-size:0.85rem;opacity:0.6">' + Lang.t('quiz_exit') + '</button>' +
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

      optionsEl.querySelectorAll('.quiz-option').forEach(function (btn) {
        btn.classList.add('answered');
        var idx = parseInt(btn.dataset.idx);
        if (idx === q.correct) btn.classList.add('correct');
        else if (idx === chosenIdx && !isCorrect) btn.classList.add('wrong');
      });

      feedbackEl.classList.add('show');
      feedbackEl.classList.add(isCorrect ? 'correct-fb' : 'wrong-fb');
      resultEl.textContent = isCorrect
        ? Lang.t('quiz_correct_prefix') + q.explanation.pt
        : Lang.t('quiz_wrong_prefix') + q.options[q.correct];

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
      var q;
      for (var qi = 0; qi < _questions.length; qi++) {
        if (_questions[qi].kanjiId === a.id) { q = _questions[qi]; break; }
      }
      return '<div class="wrong-item">' +
        '<div class="wi-kanji">' + k.k + '</div>' +
        '<div class="wi-info">' +
          '<div class="wi-correct">' + (q ? q.options[q.correct] : k.pt) + '</div>' +
          '<div class="wi-yours">' + Lang.t('quiz_your_ans') + (q ? q.options[a.chosen] : '?') + '</div>' +
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
          '<div class="qr-label">' + Lang.t('quiz_correct_label') + '</div>' +
          '<div class="qr-pct" style="color:' + KanjiData.pctColor(pct) + '">' + pct + '%</div>' +
        '</div>' +

        (wrongKanji.length > 0 ?
          '<div class="section-title">' + Lang.t('quiz_wrong_title') + ' (' + wrongKanji.length + ')</div>' +
          '<div class="wrong-list">' + wrongKanji.join('') + '</div>' : '') +

        '<div class="qr-actions">' +
          '<button class="btn btn-primary btn-lg" id="btn-redo">' + Lang.t('quiz_redo') + '</button>' +
          (wrongKanji.length > 0 ?
            '<button class="btn btn-secondary btn-lg" id="btn-study-wrong">' + Lang.t('quiz_study_err') + '</button>' : '') +
          '<button class="btn btn-ghost" id="btn-back">' + Lang.t('quiz_back') + '</button>' +
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
      FlashcardView._startWithIds(wrongIds, container);
    });

    container.querySelector('#btn-back').addEventListener('click', function () {
      _index = 0; _score = 0; _answers = []; _questions = [];
      _renderConfig(container);
    });

    KanjiApp.setKeyHandler(null);
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
  window._fcOverridePool = pool;
  KanjiApp.navigate('/flashcard/custom');
};

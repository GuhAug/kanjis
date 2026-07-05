// ============================================================
// theory.js — Theory / explanation pages
// ============================================================

var TheoryView = (function () {

  function _getSections() {
    return [
      { id: 'intro',    label: Lang.t('theory_s_intro') },
      { id: 'hiragana', label: Lang.t('theory_s_hiragana') },
      { id: 'katakana', label: Lang.t('theory_s_katakana') },
      { id: 'kanji',    label: Lang.t('theory_s_kanji') },
      { id: 'readings', label: Lang.t('theory_s_readings') },
      { id: 'guide',    label: Lang.t('theory_s_guide') },
    ];
  }

  function render(container, params) {
    var activeId = (params[1] || '').replace(/^\//, '') || 'intro';
    var sections = _getSections();

    var sidebarItems = sections.map(function (s) {
      return '<div class="ts-item ' + (s.id === activeId ? 'active' : '') + '" data-theory="' + s.id + '">' + s.label + '</div>';
    }).join('');

    var sectionsHtml = sections.map(function (s) {
      return '<div class="theory-section ' + (s.id === activeId ? 'active' : '') + '" id="ts-' + s.id + '">' +
        _getContent(s.id) +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header"><h1>' + Lang.t('theory_title') + '</h1></div>' +
        '<div class="theory-layout">' +
          '<div class="theory-sidebar">' + sidebarItems + '</div>' +
          '<div class="theory-content">' + sectionsHtml + '</div>' +
        '</div>' +
      '</div>';

    container.querySelectorAll('[data-theory]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.dataset.theory;
        container.querySelectorAll('[data-theory]').forEach(function (x) { x.classList.remove('active'); });
        el.classList.add('active');
        container.querySelectorAll('.theory-section').forEach(function (x) { x.classList.remove('active'); });
        var sec = container.querySelector('#ts-' + id);
        if (sec) sec.classList.add('active');
      });
    });
  }

  function _getContent(id) {
    switch (id) {
      case 'intro':    return _intro();
      case 'hiragana': return _hiragana();
      case 'katakana': return _katakana();
      case 'kanji':    return _kanjiTheory();
      case 'readings': return _readings();
      case 'guide':    return _guide();
      default: return '<p>' + Lang.t('theory_not_found') + '</p>';
    }
  }

  // ---- CONTENT SECTIONS ----

  function _intro() {
    var isEN = Lang.get() === 'en';
    if (isEN) {
      return '<h2>Introduction to Japanese Writing</h2>' +
        '<p>Japanese uses <strong>three writing systems</strong> combined in the same text:</p>' +

        '<h3>1. Hiragana (ひらがな)</h3>' +
        '<p>A native syllabary with <strong>46 base characters</strong>. Represents Japanese sounds and is used for native Japanese words, grammatical particles, verb conjugations, and furigana (kanji readings).</p>' +
        '<div class="info-box">Example: <strong>たべる</strong> (taberu) = to eat &nbsp;|&nbsp; <strong>は</strong> (wa) = topic particle</div>' +

        '<h3>2. Katakana (カタカナ)</h3>' +
        '<p>A syllabary with the <strong>same sounds</strong> as hiragana but with more angular strokes. Used mainly for foreign words, onomatopoeia, foreign proper names, and emphasis.</p>' +
        '<div class="info-box">Example: <strong>コーヒー</strong> (kōhī) = coffee &nbsp;|&nbsp; <strong>アメリカ</strong> (Amerika) = America</div>' +

        '<h3>3. Kanji (漢字)</h3>' +
        '<p>Characters of Chinese origin that represent <strong>words or concepts</strong>. Each kanji has its own meaning and generally multiple readings. Standard Japanese uses about 2,136 kanji (Joyo Kanji). This course covers <strong>305 kanji</strong> from the first four progressive levels.</p>' +
        '<div class="info-box">Example: <strong>山</strong> = mountain &nbsp;|&nbsp; <strong>水</strong> = water &nbsp;|&nbsp; <strong>日本</strong> = Japan</div>' +

        '<h3>How do they combine?</h3>' +
        '<p>A typical Japanese text combines all three systems. For example:</p>' +
        '<div class="info-box"><strong>私は東京に行きます。</strong><br>' +
          '私 (kanji) + は (hiragana) + 東京 (kanji) + に (hiragana) + 行き (kanji + hiragana) + ます (hiragana)<br>' +
          '<em>"I am going to Tokyo."</em>' +
        '</div>';
    }
    return '<h2>Introdução à Escrita Japonesa</h2>' +
      '<p>O japonês utiliza <strong>três sistemas de escrita</strong> de forma combinada no mesmo texto:</p>' +

      '<h3>1. Hiragana (ひらがな)</h3>' +
      '<p>Silabário nativo com <strong>46 caracteres base</strong>. Representa sons do japonês e é usado para palavras japonesas nativas, partículas gramaticais, conjugações e furigana (leitura de kanji).</p>' +
      '<div class="info-box">Exemplo: <strong>たべる</strong> (taberu) = comer &nbsp;|&nbsp; <strong>は</strong> (wa) = partícula de tópico</div>' +

      '<h3>2. Katakana (カタカナ)</h3>' +
      '<p>Silabário com os <strong>mesmos sons</strong> do hiragana, mas com formato mais angular. Usado principalmente para palavras estrangeiras, onomatopeias, nomes próprios estrangeiros e ênfase.</p>' +
      '<div class="info-box">Exemplo: <strong>コーヒー</strong> (kōhī) = café &nbsp;|&nbsp; <strong>アメリカ</strong> (Amerika) = América</div>' +

      '<h3>3. Kanji (漢字)</h3>' +
      '<p>Caracteres de origem chinesa que representam <strong>palavras ou conceitos</strong>. Cada kanji tem significado próprio e geralmente múltiplas leituras. O japonês padrão usa cerca de 2.136 kanji (Joyo Kanji). Este curso cobre <strong>305 kanji</strong> dos quatro primeiros níveis progressivos.</p>' +
      '<div class="info-box">Exemplo: <strong>山</strong> = montanha &nbsp;|&nbsp; <strong>水</strong> = água &nbsp;|&nbsp; <strong>日本</strong> = Japão</div>' +

      '<h3>Como eles se combinam?</h3>' +
      '<p>Um texto japonês típico combina os três sistemas. Por exemplo:</p>' +
      '<div class="info-box"><strong>私は東京に行きます。</strong><br>' +
        '私 (kanji) + は (hiragana) + 東京 (kanji) + に (hiragana) + 行き (kanji + hiragana) + ます (hiragana)<br>' +
        '<em>"Eu vou para Tóquio."</em>' +
      '</div>';
  }

  function _hiragana() {
    var isEN = Lang.get() === 'en';
    var rows = [
      { v: 'a',  chars: [['あ','a'],['い','i'],['う','u'],['え','e'],['お','o']] },
      { v: 'k',  chars: [['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko']] },
      { v: 's',  chars: [['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so']] },
      { v: 't',  chars: [['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to']] },
      { v: 'n',  chars: [['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no']] },
      { v: 'h',  chars: [['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho']] },
      { v: 'm',  chars: [['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo']] },
      { v: 'y',  chars: [['や','ya'],[null,''],['ゆ','yu'],[null,''],['よ','yo']] },
      { v: 'r',  chars: [['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro']] },
      { v: 'w',  chars: [['わ','wa'],[null,''],['を','wo'],[null,''],[null,'']] },
      { v: 'n',  chars: [['ん','n'],[null,''],[null,''],[null,''],[null,'']] },
    ];

    var tableHtml = '<div style="overflow-x:auto">' +
      '<table class="kana-table">' +
        '<thead><tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr></thead>' +
        '<tbody>' +
        rows.map(function (row) {
          return '<tr><th style="background:var(--surface2);padding:6px 10px;border:1px solid var(--border);font-size:0.78rem;color:var(--text-muted)">' + row.v + '</th>' +
            row.chars.map(function (c) {
              if (!c[0]) return '<td class="kana-table"><div class="kana-cell empty"></div></td>';
              return '<td><div class="kana-cell" title="' + c[1] + '">' +
                '<span class="kana-char">' + c[0] + '</span>' +
                '<span class="kana-rom">' + c[1] + '</span>' +
              '</div></td>';
            }).join('') +
          '</tr>';
        }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>';

    if (isEN) {
      return '<h2>Hiragana (ひらがな)</h2>' +
        '<p>Hiragana is the first syllabary learned in Japan. Each character represents one <strong>syllable</strong>. Memorise this table as the foundation for reading Japanese.</p>' +
        tableHtml +
        '<p style="margin-top:14px">Beyond the 46 basics, there are variations with <strong>dakuten</strong> (˝) and <strong>handakuten</strong> (°) that modify the sound: が (ga), ば (ba), ぱ (pa), etc.</p>';
    }
    return '<h2>Hiragana (ひらがな)</h2>' +
      '<p>O hiragana é o primeiro silabário aprendido no Japão. Cada caractere representa uma <strong>sílaba</strong>. Memorize esta tabela como base para ler japonês.</p>' +
      tableHtml +
      '<p style="margin-top:14px">Além dos 46 básicos, há variações com <strong>dakuten</strong> (˝) e <strong>handakuten</strong> (°) que modificam o som: が (ga), ば (ba), ぱ (pa), etc.</p>';
  }

  function _katakana() {
    var isEN = Lang.get() === 'en';
    var rows = [
      { v: 'a',  chars: [['ア','a'],['イ','i'],['ウ','u'],['エ','e'],['オ','o']] },
      { v: 'k',  chars: [['カ','ka'],['キ','ki'],['ク','ku'],['ケ','ke'],['コ','ko']] },
      { v: 's',  chars: [['サ','sa'],['シ','shi'],['ス','su'],['セ','se'],['ソ','so']] },
      { v: 't',  chars: [['タ','ta'],['チ','chi'],['ツ','tsu'],['テ','te'],['ト','to']] },
      { v: 'n',  chars: [['ナ','na'],['ニ','ni'],['ヌ','nu'],['ネ','ne'],['ノ','no']] },
      { v: 'h',  chars: [['ハ','ha'],['ヒ','hi'],['フ','fu'],['ヘ','he'],['ホ','ho']] },
      { v: 'm',  chars: [['マ','ma'],['ミ','mi'],['ム','mu'],['メ','me'],['モ','mo']] },
      { v: 'y',  chars: [['ヤ','ya'],[null,''],['ユ','yu'],[null,''],['ヨ','yo']] },
      { v: 'r',  chars: [['ラ','ra'],['リ','ri'],['ル','ru'],['レ','re'],['ロ','ro']] },
      { v: 'w',  chars: [['ワ','wa'],[null,''],['ヲ','wo'],[null,''],[null,'']] },
      { v: 'n',  chars: [['ン','n'],[null,''],[null,''],[null,''],[null,'']] },
    ];

    var tableHtml = '<div style="overflow-x:auto">' +
      '<table class="kana-table">' +
        '<thead><tr><th></th><th>a</th><th>i</th><th>u</th><th>e</th><th>o</th></tr></thead>' +
        '<tbody>' +
        rows.map(function (row) {
          return '<tr><th style="background:var(--surface2);padding:6px 10px;border:1px solid var(--border);font-size:0.78rem;color:var(--text-muted)">' + row.v + '</th>' +
            row.chars.map(function (c) {
              if (!c[0]) return '<td class="kana-table"><div class="kana-cell empty"></div></td>';
              return '<td><div class="kana-cell" title="' + c[1] + '">' +
                '<span class="kana-char">' + c[0] + '</span>' +
                '<span class="kana-rom">' + c[1] + '</span>' +
              '</div></td>';
            }).join('') +
          '</tr>';
        }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>';

    if (isEN) {
      return '<h2>Katakana (カタカナ)</h2>' +
        '<p>Katakana has the <strong>same sounds</strong> as hiragana but with straighter, more angular strokes. It is used mainly to transcribe <strong>foreign words</strong> (loanwords).</p>' +
        tableHtml +
        '<h3>Katakana word examples</h3>' +
        '<div class="info-box">' +
          '<strong>テレビ</strong> (terebi) = television<br>' +
          '<strong>パン</strong> (pan) = bread<br>' +
          '<strong>コンピューター</strong> (konpyūtā) = computer<br>' +
          '<strong>ブラジル</strong> (Burajiru) = Brazil' +
        '</div>';
    }
    return '<h2>Katakana (カタカナ)</h2>' +
      '<p>O katakana tem os <strong>mesmos sons</strong> do hiragana, mas com traços mais retos e angulares. É usado principalmente para transcrever <strong>palavras estrangeiras</strong> (empréstimos linguísticos).</p>' +
      tableHtml +
      '<h3>Exemplos de palavras em katakana</h3>' +
      '<div class="info-box">' +
        '<strong>テレビ</strong> (terebi) = televisão<br>' +
        '<strong>パン</strong> (pan) = pão<br>' +
        '<strong>コンピューター</strong> (konpyūtā) = computador<br>' +
        '<strong>ブラジル</strong> (Burajiru) = Brasil' +
      '</div>';
  }

  function _kanjiTheory() {
    var isEN = Lang.get() === 'en';
    if (isEN) {
      return '<h2>Kanji — Origin and Structure</h2>' +

        '<h3>Origin</h3>' +
        '<p>Kanji are characters of <strong>Chinese</strong> origin adopted by Japan from around the 5th century AD. The word "kanji" (漢字) literally means "Han characters" (from the Han dynasty of China). Today, Japanese kanji differ from modern Chinese characters in some forms.</p>' +

        '<h3>Radicals (部首 — Bushu)</h3>' +
        '<p>Most kanji are composed of <strong>radicals</strong>, smaller elements that indicate the semantic or phonetic category. For example:</p>' +
        '<div class="info-box">' +
          '氵(water) → 海 (sea), 川 (river), 泳 (swim)<br>' +
          '木 (tree) → 森 (forest), 林 (grove), 木 (wood)' +
        '</div>' +

        '<h3>Classification by structure</h3>' +
        '<p>Kanji can be classified as:</p>' +
        '<div class="info-box">' +
          '<strong>Pictograms:</strong> Derived from drawings — 山 (mountain), 日 (sun), 月 (moon)<br>' +
          '<strong>Simple ideograms:</strong> Represent abstract concepts — 一 (one), 上 (above), 下 (below)<br>' +
          '<strong>Compound ideograms:</strong> Combination of elements — 明 (bright = sun 日 + moon 月)<br>' +
          '<strong>Phono-semantic compounds:</strong> One element indicates meaning, another the sound — majority of kanji' +
        '</div>' +

        '<h3>Stroke order</h3>' +
        '<p>Each kanji is written following a standardised <strong>stroke order</strong>. The general rules are:</p>' +
        '<div class="info-box">' +
          '• Top to bottom<br>' +
          '• Left to right<br>' +
          '• Horizontal strokes before vertical<br>' +
          '• Outer strokes before inner<br>' +
          '• Crossing strokes last' +
        '</div>' +

        '<h3>Joyo Kanji</h3>' +
        '<p>The Japanese government maintains a list of <strong>2,136 kanji for regular use</strong> (常用漢字, Joyo Kanji), taught during primary and secondary school. This site covers the <strong>305 kanji</strong> from the Novo Progressivo course (levels 1 to 4).</p>';
    }
    return '<h2>Kanji — Origem e Estrutura</h2>' +

      '<h3>Origem</h3>' +
      '<p>Os kanji são caracteres de origem <strong>chinesa</strong> adotados pelo Japão a partir do século V d.C. A palavra "kanji" (漢字) significa literalmente "caracteres Han" (da dinastia Han da China). Hoje, os kanji japoneses diferem dos caracteres chineses modernos em algumas grafias.</p>' +

      '<h3>Radicais (部首 — Bushu)</h3>' +
      '<p>A maioria dos kanji é composta por <strong>radicais</strong>, elementos menores que indicam a categoria semântica ou fonética. Por exemplo:</p>' +
      '<div class="info-box">' +
        '氵(água) → 海 (mar), 川 (rio), 泳 (nadar)<br>' +
        '木 (árvore) → 森 (floresta), 林 (bosque), 木 (madeira)' +
      '</div>' +

      '<h3>Classificação por estrutura</h3>' +
      '<p>Os kanji podem ser classificados em:</p>' +
      '<div class="info-box">' +
        '<strong>Pictogramas:</strong> Derivados de desenhos — 山 (montanha), 日 (sol), 月 (lua)<br>' +
        '<strong>Ideogramas simples:</strong> Representam conceitos — 一 (um), 上 (cima), 下 (baixo)<br>' +
        '<strong>Ideogramas compostos:</strong> Combinação de elementos — 明 (brilhante = sol 日 + lua 月)<br>' +
        '<strong>Fonossemânticos:</strong> Um elemento indica o significado, outro o som — maioria dos kanji' +
      '</div>' +

      '<h3>Ordem dos traços</h3>' +
      '<p>Cada kanji é escrito seguindo uma <strong>ordem de traços</strong> padronizada. As regras gerais são:</p>' +
      '<div class="info-box">' +
        '• De cima para baixo<br>' +
        '• Da esquerda para a direita<br>' +
        '• Traços horizontais antes de verticais<br>' +
        '• Traços externos antes do interior<br>' +
        '• Traços que cruzam por último' +
      '</div>' +

      '<h3>Kanji Joyo</h3>' +
      '<p>O governo japonês estabelece a lista de <strong>2.136 kanji de uso regular</strong> (常用漢字, Joyo Kanji), ensinados durante o ensino fundamental e médio. Este site cobre os <strong>305 kanji</strong> do curso Novo Progressivo (níveis 1 a 4).</p>';
  }

  function _readings() {
    var isEN = Lang.get() === 'en';
    var kunLabel = Lang.t('card_kun_reading');
    var onLabel  = Lang.t('card_on_reading');

    var examples = [];
    var allKanji = KanjiData.getAll();
    for (var i = 0; i < allKanji.length && examples.length < 4; i++) {
      var k = allKanji[i];
      if (k.kun && k.on && k.kunEx && k.onEx) examples.push(k);
    }

    var examplesHtml = examples.map(function (k) {
      return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 18px;margin-bottom:10px">' +
        '<div style="font-family:\'Noto Sans JP\',serif;font-size:2rem;font-weight:700;margin-bottom:8px">' + k.k + ' — ' + k.pt + '</div>' +
        '<div style="display:flex;gap:20px;flex-wrap:wrap">' +
          '<div>' +
            '<div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">' + kunLabel + '</div>' +
            '<div style="font-family:\'Noto Sans JP\',serif;font-weight:700;color:var(--level-1)">' + k.kun + '</div>' +
            '<div style="font-size:0.88rem;color:var(--text-muted)">' + k.kunEx + '</div>' +
            (k.kunTr ? '<div style="font-size:0.78rem;color:var(--text-faint)">' + k.kunTr + '</div>' : '') +
          '</div>' +
          '<div>' +
            '<div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">' + onLabel + '</div>' +
            '<div style="font-family:\'Noto Sans JP\',serif;font-weight:700;color:var(--level-3)">' + k.on + '</div>' +
            '<div style="font-size:0.88rem;color:var(--text-muted)">' + k.onEx + '</div>' +
            (k.onTr ? '<div style="font-size:0.78rem;color:var(--text-faint)">' + k.onTr + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    if (isEN) {
      return '<h2>On Reading vs. Kun Reading</h2>' +

        '<p>The vast majority of kanji have <strong>two categories of reading</strong>: the On reading and the Kun reading.</p>' +

        '<h3>Kun Reading (訓読み)</h3>' +
        '<p>The <strong>Kun</strong> reading is the native Japanese reading of the kanji. Generally used when the kanji appears <strong>alone</strong> or combined with hiragana. It may have multiple variations (with okurigana — the hiragana letters that follow the kanji).</p>' +
        '<div class="info-box">山 Kun reading: <strong>やま</strong> (yama) — Ex: 山に登る (to climb the mountain)</div>' +

        '<h3>On Reading (音読み)</h3>' +
        '<p>The <strong>On</strong> reading is the Sino-Japanese reading, derived from the original Chinese pronunciation. Generally used when the kanji appears in <strong>compounds (熟語, jukugo)</strong> with other kanji. It is written in katakana in dictionaries.</p>' +
        '<div class="info-box">山 On reading: <strong>サン</strong> (san) — Ex: 富士山 (Mt. Fuji)</div>' +

        '<h3>Which one to use?</h3>' +
        '<div class="info-box">' +
          '<strong>General rule:</strong><br>' +
          '• Kanji alone or with okurigana → usually Kun<br>' +
          '• Two or more kanji together → usually On<br>' +
          '• Japanese proper names → usually Kun<br>' +
          '• Technical/formal terms → usually On' +
        '</div>' +

        '<h3>Dataset examples</h3>' +
        examplesHtml;
    }
    return '<h2>Leitura On vs. Leitura Kun</h2>' +

      '<p>A grande maioria dos kanji possui <strong>duas categorias de leitura</strong>: a leitura On e a leitura Kun.</p>' +

      '<h3>Leitura Kun (訓読み)</h3>' +
      '<p>A leitura <strong>Kun</strong> é a leitura japonesa nativa do kanji. Geralmente usada quando o kanji aparece <strong>sozinho</strong> ou combinado com hiragana. Pode ter múltiplas variações (com okurigana — as letras em hiragana que seguem o kanji).</p>' +
      '<div class="info-box">山 com leitura Kun: <strong>やま</strong> (yama) — Ex: 山に登る (subir na montanha)</div>' +

      '<h3>Leitura On (音読み)</h3>' +
      '<p>A leitura <strong>On</strong> é a leitura sinonizante, derivada da pronúncia chinesa original. Geralmente usada quando o kanji aparece em <strong>compostos (熟語, jukugo)</strong> com outros kanji. É escrita em katakana nos dicionários.</p>' +
      '<div class="info-box">山 com leitura On: <strong>サン</strong> (san) — Ex: 富士山 (Monte Fuji)</div>' +

      '<h3>Como saber qual usar?</h3>' +
      '<div class="info-box">' +
        '<strong>Regra geral:</strong><br>' +
        '• Kanji sozinho ou com okurigana → geralmente Kun<br>' +
        '• Dois ou mais kanji juntos → geralmente On<br>' +
        '• Nomes próprios japoneses → geralmente Kun<br>' +
        '• Termos técnicos/formais → geralmente On' +
      '</div>' +

      '<h3>Exemplos do dataset</h3>' +
      examplesHtml;
  }

  function _guide() {
    var isEN = Lang.get() === 'en';
    if (isEN) {
      return '<h2>🎓 How to Use This Site</h2>' +

        '<h3>🏠 Home (Dashboard)</h3>' +
        '<p>See your overall progress, study-day streak, and recent quizzes. Use the shortcut buttons to jump directly to each section.</p>' +

        '<h3>📚 Browse</h3>' +
        '<p>Explore the 305 kanji organised by <strong>level</strong> (Beginner → Advanced) and <strong>chapter</strong>. Each kanji appears as a card in the grid:</p>' +
        '<div class="info-box">' +
          '⚫ Grey = not yet studied<br>' +
          '🔵 Blue = marked as seen<br>' +
          '🟢 Green = marked as mastered' +
        '</div>' +
        '<p>Click any kanji to see its <strong>full page</strong> with readings, meaning, and example sentences.</p>' +

        '<h3>🃏 Flashcards</h3>' +
        '<p>Practice with flip cards. Choose the level, chapter, and practice mode:</p>' +
        '<div class="info-box">' +
          '<strong>Kanji → Meaning:</strong> See the kanji, try to recall the meaning<br>' +
          '<strong>Meaning → Kanji:</strong> See the meaning, identify the kanji<br>' +
          '<strong>Kanji → Reading:</strong> See the kanji, recall the readings' +
        '</div>' +
        '<p>Use <kbd>Space</kbd> to flip, <kbd>→</kbd> for "Know" and <kbd>←</kbd> for "Don\'t know". Wrong cards come back earlier in the deck.</p>' +

        '<h3>✏️ Quiz</h3>' +
        '<p>4 types of multiple-choice questions:</p>' +
        '<div class="info-box">' +
          '<strong>Meaning:</strong> Kanji → choose the correct meaning<br>' +
          '<strong>Kun Reading:</strong> Kanji → choose the correct Kun reading<br>' +
          '<strong>On Reading:</strong> Kanji → choose the correct On reading<br>' +
          '<strong>Recognition:</strong> Meaning → choose the correct kanji' +
        '</div>' +
        '<p>Use keys <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> to select options and <kbd>Enter</kbd> for the next question.</p>' +

        '<h3>💾 Progress Saving</h3>' +
        '<p>All progress is saved automatically in the browser\'s <strong>localStorage</strong>. Use the <em>"Export progress"</em> button on the Dashboard to back up to a JSON file.</p>';
    }
    return '<h2>🎓 Como Usar Este Site</h2>' +

      '<h3>🏠 Início (Dashboard)</h3>' +
      '<p>Veja seu progresso geral, a sequência de dias estudados e os últimos quizzes. Use os botões de atalho para ir direto a cada seção.</p>' +

      '<h3>📚 Navegar</h3>' +
      '<p>Explore os 305 kanji organizados por <strong>nível</strong> (Iniciante → Avançado) e <strong>capítulo</strong>. Cada kanji aparece como um card na grade:</p>' +
      '<div class="info-box">' +
        '⚫ Cinza = ainda não estudado<br>' +
        '🔵 Azul = marcado como visto<br>' +
        '🟢 Verde = marcado como dominado' +
      '</div>' +
      '<p>Clique em qualquer kanji para ver sua <strong>página completa</strong> com leituras, significado e frases de exemplo.</p>' +

      '<h3>🃏 Flashcards</h3>' +
      '<p>Pratique com cartas viráveis. Escolha o nível, capítulo e modo de prática:</p>' +
      '<div class="info-box">' +
        '<strong>Kanji → Significado:</strong> Veja o kanji, tente lembrar o significado<br>' +
        '<strong>Significado → Kanji:</strong> Veja o significado, identifique o kanji<br>' +
        '<strong>Kanji → Leitura:</strong> Veja o kanji, lembre as leituras' +
      '</div>' +
      '<p>Use <kbd>Espaço</kbd> para virar, <kbd>→</kbd> para "Sei" e <kbd>←</kbd> para "Não sei". Cartas erradas voltam mais cedo no baralho.</p>' +

      '<h3>✏️ Quiz</h3>' +
      '<p>4 tipos de questões de múltipla escolha:</p>' +
      '<div class="info-box">' +
        '<strong>Significado:</strong> Kanji → escolha o significado correto<br>' +
        '<strong>Leitura Kun:</strong> Kanji → escolha a leitura Kun correta<br>' +
        '<strong>Leitura On:</strong> Kanji → escolha a leitura On correta<br>' +
        '<strong>Reconhecimento:</strong> Significado → escolha o kanji correto' +
      '</div>' +
      '<p>Use as teclas <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> <kbd>4</kbd> para selecionar opções e <kbd>Enter</kbd> para próxima questão.</p>' +

      '<h3>💾 Salvamento do Progresso</h3>' +
      '<p>Todo o progresso é salvo automaticamente no <strong>localStorage</strong> do navegador. Use o botão <em>"Exportar progresso"</em> no Dashboard para fazer backup em arquivo JSON.</p>';
  }

  function destroy() {}

  return { render: render, destroy: destroy };

})();

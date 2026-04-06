// ============================================================
// theory.js — Theory / explanation pages
// ============================================================

var TheoryView = (function () {

  var SECTIONS = [
    { id: 'intro',    label: '📝 Introdução' },
    { id: 'hiragana', label: 'あ Hiragana' },
    { id: 'katakana', label: 'ア Katakana' },
    { id: 'kanji',    label: '漢 Kanji' },
    { id: 'readings', label: '🔊 Leituras On/Kun' },
    { id: 'guide',    label: '🎓 Como usar o site' },
  ];

  function render(container, params) {
    var activeId = (params[1] || '').replace(/^\//, '') || 'intro';

    var sidebarItems = SECTIONS.map(function (s) {
      return '<div class="ts-item ' + (s.id === activeId ? 'active' : '') + '" data-theory="' + s.id + '">' + s.label + '</div>';
    }).join('');

    var sectionsHtml = SECTIONS.map(function (s) {
      return '<div class="theory-section ' + (s.id === activeId ? 'active' : '') + '" id="ts-' + s.id + '">' +
        _getContent(s.id) +
      '</div>';
    }).join('');

    container.innerHTML =
      '<div class="view-enter">' +
        '<div class="page-header"><h1>📖 Teoria</h1></div>' +
        '<div class="theory-layout">' +
          '<div class="theory-sidebar">' + sidebarItems + '</div>' +
          '<div class="theory-content">' + sectionsHtml + '</div>' +
        '</div>' +
      '</div>';

    container.querySelectorAll('[data-theory]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.dataset.theory;
        // Update active sidebar item
        container.querySelectorAll('[data-theory]').forEach(function (x) { x.classList.remove('active'); });
        el.classList.add('active');
        // Show section
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
      default: return '<p>Seção não encontrada.</p>';
    }
  }

  // ---- CONTENT SECTIONS ----

  function _intro() {
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

    return '<h2>Hiragana (ひらがな)</h2>' +
      '<p>O hiragana é o primeiro silabário aprendido no Japão. Cada caractere representa uma <strong>sílaba</strong>. Memorize esta tabela como base para ler japonês.</p>' +
      '<div style="overflow-x:auto">' +
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
      '</div>' +
      '<p style="margin-top:14px">Além dos 46 básicos, há variações com <strong>dakuten</strong> (˝) e <strong>handakuten</strong> (°) que modificam o som: が (ga), ば (ba), ぱ (pa), etc.</p>';
  }

  function _katakana() {
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

    return '<h2>Katakana (カタカナ)</h2>' +
      '<p>O katakana tem os <strong>mesmos sons</strong> do hiragana, mas com traços mais retos e angulares. É usado principalmente para transcrever <strong>palavras estrangeiras</strong> (empréstimos linguísticos).</p>' +
      '<div style="overflow-x:auto">' +
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
      '</div>' +
      '<h3>Exemplos de palavras em katakana</h3>' +
      '<div class="info-box">' +
        '<strong>テレビ</strong> (terebi) = televisão<br>' +
        '<strong>パン</strong> (pan) = pão<br>' +
        '<strong>コンピューター</strong> (konpyūtā) = computador<br>' +
        '<strong>ブラジル</strong> (Burajiru) = Brasil' +
      '</div>';
  }

  function _kanjiTheory() {
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
    // Get some real examples from dataset
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
            '<div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Leitura Kun</div>' +
            '<div style="font-family:\'Noto Sans JP\',serif;font-weight:700;color:var(--level-1)">' + k.kun + '</div>' +
            '<div style="font-size:0.88rem;color:var(--text-muted)">' + k.kunEx + '</div>' +
            (k.kunTr ? '<div style="font-size:0.78rem;color:var(--text-faint)">' + k.kunTr + '</div>' : '') +
          '</div>' +
          '<div>' +
            '<div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Leitura On</div>' +
            '<div style="font-family:\'Noto Sans JP\',serif;font-weight:700;color:var(--level-3)">' + k.on + '</div>' +
            '<div style="font-size:0.88rem;color:var(--text-muted)">' + k.onEx + '</div>' +
            (k.onTr ? '<div style="font-size:0.78rem;color:var(--text-faint)">' + k.onTr + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

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

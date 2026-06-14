// ============================================================
// particles.js — Particle quiz data
// Each entry: sentence with ___ as blank, correct particle,
// Portuguese meaning, and 3 distractor particles.
// ============================================================
window.PARTICLES_DATA = [

  // ── は — marcador de tópico ────────────────────────────────
  { id:'p01', particle:'は', distractors:['が','を','に'],
    sentence:'私___学生です。', meaning:'Eu sou estudante.', role:'は: tópico da frase' },
  { id:'p02', particle:'は', distractors:['が','の','を'],
    sentence:'これ___日本語の本です。', meaning:'Este é um livro de japonês.', role:'は: tópico da frase' },
  { id:'p03', particle:'は', distractors:['が','で','に'],
    sentence:'今日___月曜日です。', meaning:'Hoje é segunda-feira.', role:'は: tópico da frase' },
  { id:'p04', particle:'は', distractors:['が','を','の'],
    sentence:'あの人___だれですか。', meaning:'Quem é aquela pessoa?', role:'は: tópico da frase' },
  { id:'p05', particle:'は', distractors:['が','も','を'],
    sentence:'この店___有名です。', meaning:'Esta loja é famosa.', role:'は: tópico da frase' },

  // ── が — marcador de sujeito ───────────────────────────────
  { id:'p06', particle:'が', distractors:['は','を','で'],
    sentence:'あそこに猫___います。', meaning:'Há um gato lá.', role:'が: sujeito (existência)' },
  { id:'p07', particle:'が', distractors:['は','を','に'],
    sentence:'だれ___来ましたか。', meaning:'Quem veio?', role:'が: sujeito após palavra interrogativa' },
  { id:'p08', particle:'が', distractors:['は','で','を'],
    sentence:'桜の花___きれいです。', meaning:'As flores de cerejeira são bonitas.', role:'が: sujeito (observação)' },
  { id:'p09', particle:'が', distractors:['は','を','に'],
    sentence:'何___ほしいですか。', meaning:'O que você quer?', role:'が: sujeito com ほしい / 好き' },
  { id:'p10', particle:'が', distractors:['は','で','を'],
    sentence:'私は日本語___話せます。', meaning:'Eu consigo falar japonês.', role:'が: sujeito de verbo potencial' },

  // ── を — marcador de objeto direto ─────────────────────────
  { id:'p11', particle:'を', distractors:['は','が','に'],
    sentence:'ご飯___食べます。', meaning:'Vou comer arroz.', role:'を: objeto direto' },
  { id:'p12', particle:'を', distractors:['は','が','で'],
    sentence:'本___読みます。', meaning:'Vou ler um livro.', role:'を: objeto direto' },
  { id:'p13', particle:'を', distractors:['は','が','に'],
    sentence:'音楽___聞きます。', meaning:'Vou ouvir música.', role:'を: objeto direto' },
  { id:'p14', particle:'を', distractors:['は','に','で'],
    sentence:'日本語___勉強します。', meaning:'Vou estudar japonês.', role:'を: objeto direto' },
  { id:'p15', particle:'を', distractors:['は','が','に'],
    sentence:'コーヒー___飲みます。', meaning:'Vou beber café.', role:'を: objeto direto' },
  { id:'p16', particle:'を', distractors:['は','が','で'],
    sentence:'映画___見ます。', meaning:'Vou assistir a um filme.', role:'を: objeto direto' },
  { id:'p17', particle:'を', distractors:['で','に','は'],
    sentence:'公園___散歩します。', meaning:'Passear no parque (atravessando o espaço).', role:'を: espaço percorrido' },

  // ── に — direção, tempo, existência ────────────────────────
  { id:'p18', particle:'に', distractors:['を','で','へ'],
    sentence:'学校___行きます。', meaning:'Vou para a escola.', role:'に: destino' },
  { id:'p19', particle:'に', distractors:['は','が','で'],
    sentence:'七時___起きます。', meaning:'Acordo às 7 horas.', role:'に: tempo específico' },
  { id:'p20', particle:'に', distractors:['で','を','は'],
    sentence:'机の上___本があります。', meaning:'Há um livro em cima da mesa.', role:'に: local de existência (あります/います)' },
  { id:'p21', particle:'に', distractors:['で','を','は'],
    sentence:'東京___住んでいます。', meaning:'Moro em Tóquio.', role:'に: local com 住む' },
  { id:'p22', particle:'に', distractors:['と','を','で'],
    sentence:'先生___質問します。', meaning:'Vou fazer uma pergunta ao professor.', role:'に: destinatário da ação' },
  { id:'p23', particle:'に', distractors:['で','を','は'],
    sentence:'いす___座ります。', meaning:'Sento na cadeira.', role:'に: ponto de contato' },
  { id:'p24', particle:'に', distractors:['は','が','で'],
    sentence:'月曜日___テストがあります。', meaning:'Há uma prova na segunda-feira.', role:'に: tempo específico' },

  // ── で — local de ação, meio, âmbito ──────────────────────
  { id:'p25', particle:'で', distractors:['に','を','は'],
    sentence:'図書館___勉強します。', meaning:'Estudo na biblioteca.', role:'で: local onde ocorre a ação' },
  { id:'p26', particle:'で', distractors:['に','を','は'],
    sentence:'バス___来ました。', meaning:'Vim de ônibus.', role:'で: meio de transporte' },
  { id:'p27', particle:'で', distractors:['を','に','は'],
    sentence:'日本語___話します。', meaning:'Falo em japonês.', role:'で: meio / língua utilizada' },
  { id:'p28', particle:'で', distractors:['に','を','は'],
    sentence:'公園___サッカーをします。', meaning:'Jogo futebol no parque.', role:'で: local onde ocorre a ação' },
  { id:'p29', particle:'で', distractors:['を','に','は'],
    sentence:'はさみ___紙を切ります。', meaning:'Corto papel com tesoura.', role:'で: instrumento' },
  { id:'p30', particle:'で', distractors:['に','は','が'],
    sentence:'クラス___一番背が高いです。', meaning:'Sou o mais alto da turma.', role:'で: âmbito / entre um grupo' },

  // ── と — companhia, lista (exaustiva) ─────────────────────
  { id:'p31', particle:'と', distractors:['は','に','が'],
    sentence:'友達___映画を見ます。', meaning:'Vou ver filmes com amigos.', role:'と: companhia' },
  { id:'p32', particle:'と', distractors:['に','は','が'],
    sentence:'田中さん___話しました。', meaning:'Falei com Tanaka-san.', role:'と: companhia / interação' },
  { id:'p33', particle:'と', distractors:['は','も','や'],
    sentence:'りんご___みかんを買いました。', meaning:'Comprei maçãs e tangerinas (lista completa).', role:'と: lista exaustiva' },
  { id:'p34', particle:'と', distractors:['に','は','で'],
    sentence:'家族___旅行します。', meaning:'Viajo com a família.', role:'と: companhia' },

  // ── から — ponto de partida ────────────────────────────────
  { id:'p35', particle:'から', distractors:['に','で','まで'],
    sentence:'日本___来ました。', meaning:'Vim do Japão.', role:'から: ponto de origem' },
  { id:'p36', particle:'から', distractors:['まで','に','で'],
    sentence:'九時___授業が始まります。', meaning:'A aula começa a partir das 9.', role:'から: início temporal' },
  { id:'p37', particle:'から', distractors:['で','に','まで'],
    sentence:'駅___ここまで歩きました。', meaning:'Caminhei da estação até aqui.', role:'から: ponto de partida' },

  // ── まで — ponto final (espaço ou tempo) ──────────────────
  { id:'p38', particle:'まで', distractors:['から','に','で'],
    sentence:'六時___働きます。', meaning:'Trabalho até as 6.', role:'まで: limite temporal' },
  { id:'p39', particle:'まで', distractors:['から','に','へ'],
    sentence:'駅___タクシーで行きます。', meaning:'Vou de táxi até a estação.', role:'まで: destino final' },
  { id:'p40', particle:'まで', distractors:['から','に','は'],
    sentence:'明日___待ちます。', meaning:'Espero até amanhã.', role:'まで: limite temporal' },

  // ── も — também, inclusão ─────────────────────────────────
  { id:'p41', particle:'も', distractors:['は','が','を'],
    sentence:'山田さん___学生です。', meaning:'Yamada-san também é estudante.', role:'も: inclusão (também)' },
  { id:'p42', particle:'も', distractors:['は','が','で'],
    sentence:'この料理___おいしいです。', meaning:'Esta comida também é deliciosa.', role:'も: inclusão (também)' },
  { id:'p43', particle:'も', distractors:['は','が','を'],
    sentence:'私は英語___話せます。', meaning:'Também falo inglês (além de outra língua).', role:'も: inclusão' },

  // ── の — possessivo / modificador ─────────────────────────
  { id:'p44', particle:'の', distractors:['は','が','を'],
    sentence:'これは私___本です。', meaning:'Este é o meu livro.', role:'の: possessivo' },
  { id:'p45', particle:'の', distractors:['は','が','に'],
    sentence:'田中さん___かばんはどこですか。', meaning:'Onde está a bolsa de Tanaka-san?', role:'の: possessivo' },
  { id:'p46', particle:'の', distractors:['は','が','を'],
    sentence:'日本___食べ物が好きです。', meaning:'Gosto da comida japonesa.', role:'の: modificador de substantivo' },
  { id:'p47', particle:'の', distractors:['は','が','に'],
    sentence:'昨日___ニュースを見ましたか。', meaning:'Você assistiu às notícias de ontem?', role:'の: modificador de substantivo' },

  // ── へ — direção (ênfase no trajeto) ──────────────────────
  { id:'p48', particle:'へ', distractors:['に','で','を'],
    sentence:'外国___行きたいです。', meaning:'Quero ir para o exterior.', role:'へ: direção (ênfase no trajeto)' },
  { id:'p49', particle:'へ', distractors:['に','で','は'],
    sentence:'うち___帰ります。', meaning:'Volto para casa.', role:'へ: direção' },

  // ── より — comparação (do que) ────────────────────────────
  { id:'p50', particle:'より', distractors:['は','が','に'],
    sentence:'夏___冬のほうが好きです。', meaning:'Prefiro o inverno ao verão.', role:'より: comparação (do que)' },
  { id:'p51', particle:'より', distractors:['は','が','まで'],
    sentence:'昨日___今日のほうが寒いです。', meaning:'Hoje está mais frio do que ontem.', role:'より: comparação (do que)' },
  { id:'p52', particle:'より', distractors:['は','で','まで'],
    sentence:'バス___電車のほうが速いです。', meaning:'O trem é mais rápido do que o ônibus.', role:'より: comparação (do que)' },

];

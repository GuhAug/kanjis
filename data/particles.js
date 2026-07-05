// ============================================================
// particles.js — Particle quiz data
// Each entry: sentence with ___ as blank, correct particle,
// bilingual meaning/role, and 3 distractor particles.
// ============================================================
window.PARTICLES_DATA = [

  // ── は — topic marker ────────────────────────────────
  { id:'p01', particle:'は', distractors:['が','を','に'],
    sentence:'私___学生です。', meaning:'Eu sou estudante.', en:'I am a student.', role:'は: tópico da frase', roleEn:'は: topic marker' },
  { id:'p02', particle:'は', distractors:['が','の','を'],
    sentence:'これ___日本語の本です。', meaning:'Este é um livro de japonês.', en:'This is a Japanese book.', role:'は: tópico da frase', roleEn:'は: topic marker' },
  { id:'p03', particle:'は', distractors:['が','で','に'],
    sentence:'今日___月曜日です。', meaning:'Hoje é segunda-feira.', en:'Today is Monday.', role:'は: tópico da frase', roleEn:'は: topic marker' },
  { id:'p04', particle:'は', distractors:['が','を','の'],
    sentence:'あの人___だれですか。', meaning:'Quem é aquela pessoa?', en:'Who is that person?', role:'は: tópico da frase', roleEn:'は: topic marker' },
  { id:'p05', particle:'は', distractors:['が','も','を'],
    sentence:'この店___有名です。', meaning:'Esta loja é famosa.', en:'This store is famous.', role:'は: tópico da frase', roleEn:'は: topic marker' },

  // ── が — subject marker ────────────────────────────
  { id:'p06', particle:'が', distractors:['は','を','で'],
    sentence:'あそこに猫___います。', meaning:'Há um gato lá.', en:'There is a cat over there.', role:'が: sujeito (existência)', roleEn:'が: subject (existence)' },
  { id:'p07', particle:'が', distractors:['は','を','に'],
    sentence:'だれ___来ましたか。', meaning:'Quem veio?', en:'Who came?', role:'が: sujeito após palavra interrogativa', roleEn:'が: subject after question word' },
  { id:'p08', particle:'が', distractors:['は','で','を'],
    sentence:'桜の花___きれいです。', meaning:'As flores de cerejeira são bonitas.', en:'The cherry blossoms are beautiful.', role:'が: sujeito (observação)', roleEn:'が: subject (observation)' },
  { id:'p09', particle:'が', distractors:['は','を','に'],
    sentence:'何___ほしいですか。', meaning:'O que você quer?', en:'What do you want?', role:'が: sujeito com ほしい / 好き', roleEn:'が: subject with ほしい / 好き' },
  { id:'p10', particle:'が', distractors:['は','で','を'],
    sentence:'私は日本語___話せます。', meaning:'Eu consigo falar japonês.', en:'I can speak Japanese.', role:'が: sujeito de verbo potencial', roleEn:'が: subject of potential verb' },

  // ── を — direct object ─────────────────────────────
  { id:'p11', particle:'を', distractors:['は','が','に'],
    sentence:'ご飯___食べます。', meaning:'Vou comer arroz.', en:'I will eat rice.', role:'を: objeto direto', roleEn:'を: direct object' },
  { id:'p12', particle:'を', distractors:['は','が','で'],
    sentence:'本___読みます。', meaning:'Vou ler um livro.', en:'I will read a book.', role:'を: objeto direto', roleEn:'を: direct object' },
  { id:'p13', particle:'を', distractors:['は','が','に'],
    sentence:'音楽___聞きます。', meaning:'Vou ouvir música.', en:'I will listen to music.', role:'を: objeto direto', roleEn:'を: direct object' },
  { id:'p14', particle:'を', distractors:['は','に','で'],
    sentence:'日本語___勉強します。', meaning:'Vou estudar japonês.', en:'I will study Japanese.', role:'を: objeto direto', roleEn:'を: direct object' },
  { id:'p15', particle:'を', distractors:['は','が','に'],
    sentence:'コーヒー___飲みます。', meaning:'Vou beber café.', en:'I will drink coffee.', role:'を: objeto direto', roleEn:'を: direct object' },
  { id:'p16', particle:'を', distractors:['は','が','で'],
    sentence:'映画___見ます。', meaning:'Vou assistir a um filme.', en:'I will watch a movie.', role:'を: objeto direto', roleEn:'を: direct object' },
  { id:'p17', particle:'を', distractors:['で','に','は'],
    sentence:'公園___散歩します。', meaning:'Passear no parque (atravessando o espaço).', en:'Take a walk through the park (moving through space).', role:'を: espaço percorrido', roleEn:'を: space traversed' },

  // ── に — direction, time, location ────────────────
  { id:'p18', particle:'に', distractors:['を','で','へ'],
    sentence:'学校___行きます。', meaning:'Vou para a escola.', en:'I am going to school.', role:'に: destino', roleEn:'に: destination' },
  { id:'p19', particle:'に', distractors:['は','が','で'],
    sentence:'七時___起きます。', meaning:'Acordo às 7 horas.', en:'I wake up at 7 o\'clock.', role:'に: tempo específico', roleEn:'に: specific time' },
  { id:'p20', particle:'に', distractors:['で','を','は'],
    sentence:'机の上___本があります。', meaning:'Há um livro em cima da mesa.', en:'There is a book on the desk.', role:'に: local de existência (あります/います)', roleEn:'に: location of existence (あります/います)' },
  { id:'p21', particle:'に', distractors:['で','を','は'],
    sentence:'東京___住んでいます。', meaning:'Moro em Tóquio.', en:'I live in Tokyo.', role:'に: local com 住む', roleEn:'に: location with 住む' },
  { id:'p22', particle:'に', distractors:['と','を','で'],
    sentence:'先生___質問します。', meaning:'Vou fazer uma pergunta ao professor.', en:'I will ask the teacher a question.', role:'に: destinatário da ação', roleEn:'に: recipient of action' },
  { id:'p23', particle:'に', distractors:['で','を','は'],
    sentence:'いす___座ります。', meaning:'Sento na cadeira.', en:'I sit on the chair.', role:'に: ponto de contato', roleEn:'に: point of contact' },
  { id:'p24', particle:'に', distractors:['は','が','で'],
    sentence:'月曜日___テストがあります。', meaning:'Há uma prova na segunda-feira.', en:'There is a test on Monday.', role:'に: tempo específico', roleEn:'に: specific time' },

  // ── で — location of action, means, scope ────────
  { id:'p25', particle:'で', distractors:['に','を','は'],
    sentence:'図書館___勉強します。', meaning:'Estudo na biblioteca.', en:'I study at the library.', role:'で: local onde ocorre a ação', roleEn:'で: location of action' },
  { id:'p26', particle:'で', distractors:['に','を','は'],
    sentence:'バス___来ました。', meaning:'Vim de ônibus.', en:'I came by bus.', role:'で: meio de transporte', roleEn:'で: means of transport' },
  { id:'p27', particle:'で', distractors:['を','に','は'],
    sentence:'日本語___話します。', meaning:'Falo em japonês.', en:'I speak in Japanese.', role:'で: meio / língua utilizada', roleEn:'で: means / language' },
  { id:'p28', particle:'で', distractors:['に','を','は'],
    sentence:'公園___サッカーをします。', meaning:'Jogo futebol no parque.', en:'I play soccer in the park.', role:'で: local onde ocorre a ação', roleEn:'で: location of action' },
  { id:'p29', particle:'で', distractors:['を','に','は'],
    sentence:'はさみ___紙を切ります。', meaning:'Corto papel com tesoura.', en:'I cut paper with scissors.', role:'で: instrumento', roleEn:'で: instrument' },
  { id:'p30', particle:'で', distractors:['に','は','が'],
    sentence:'クラス___一番背が高いです。', meaning:'Sou o mais alto da turma.', en:'I am the tallest in the class.', role:'で: âmbito / entre um grupo', roleEn:'で: scope / among a group' },

  // ── と — with, exhaustive list ────────────────────
  { id:'p31', particle:'と', distractors:['は','に','が'],
    sentence:'友達___映画を見ます。', meaning:'Vou ver filmes com amigos.', en:'I will watch movies with friends.', role:'と: companhia', roleEn:'と: together with' },
  { id:'p32', particle:'と', distractors:['に','は','が'],
    sentence:'田中さん___話しました。', meaning:'Falei com Tanaka-san.', en:'I talked with Tanaka-san.', role:'と: companhia / interação', roleEn:'と: company / interaction' },
  { id:'p33', particle:'と', distractors:['は','も','や'],
    sentence:'りんご___みかんを買いました。', meaning:'Comprei maçãs e tangerinas (lista completa).', en:'I bought apples and tangerines (complete list).', role:'と: lista exaustiva', roleEn:'と: exhaustive list' },
  { id:'p34', particle:'と', distractors:['に','は','で'],
    sentence:'家族___旅行します。', meaning:'Viajo com a família.', en:'I travel with my family.', role:'と: companhia', roleEn:'と: together with' },

  // ── から — starting point ─────────────────────────
  { id:'p35', particle:'から', distractors:['に','で','まで'],
    sentence:'日本___来ました。', meaning:'Vim do Japão.', en:'I came from Japan.', role:'から: ponto de origem', roleEn:'から: point of origin' },
  { id:'p36', particle:'から', distractors:['まで','に','で'],
    sentence:'九時___授業が始まります。', meaning:'A aula começa a partir das 9.', en:'Class starts from 9 o\'clock.', role:'から: início temporal', roleEn:'から: starting time' },
  { id:'p37', particle:'から', distractors:['で','に','まで'],
    sentence:'駅___ここまで歩きました。', meaning:'Caminhei da estação até aqui.', en:'I walked from the station to here.', role:'から: ponto de partida', roleEn:'から: starting point' },

  // ── まで — endpoint (space or time) ──────────────
  { id:'p38', particle:'まで', distractors:['から','に','で'],
    sentence:'六時___働きます。', meaning:'Trabalho até as 6.', en:'I work until 6 o\'clock.', role:'まで: limite temporal', roleEn:'まで: time limit' },
  { id:'p39', particle:'まで', distractors:['から','に','へ'],
    sentence:'駅___タクシーで行きます。', meaning:'Vou de táxi até a estação.', en:'I will go to the station by taxi.', role:'まで: destino final', roleEn:'まで: final destination' },
  { id:'p40', particle:'まで', distractors:['から','に','は'],
    sentence:'明日___待ちます。', meaning:'Espero até amanhã.', en:'I will wait until tomorrow.', role:'まで: limite temporal', roleEn:'まで: time limit' },

  // ── も — also, inclusion ──────────────────────────
  { id:'p41', particle:'も', distractors:['は','が','を'],
    sentence:'山田さん___学生です。', meaning:'Yamada-san também é estudante.', en:'Yamada-san is also a student.', role:'も: inclusão (também)', roleEn:'も: inclusion (also/too)' },
  { id:'p42', particle:'も', distractors:['は','が','で'],
    sentence:'この料理___おいしいです。', meaning:'Esta comida também é deliciosa.', en:'This food is also delicious.', role:'も: inclusão (também)', roleEn:'も: inclusion (also/too)' },
  { id:'p43', particle:'も', distractors:['は','が','を'],
    sentence:'私は英語___話せます。', meaning:'Também falo inglês (além de outra língua).', en:'I can also speak English (besides another language).', role:'も: inclusão', roleEn:'も: inclusion' },

  // ── の — possessive / noun modifier ──────────────
  { id:'p44', particle:'の', distractors:['は','が','を'],
    sentence:'これは私___本です。', meaning:'Este é o meu livro.', en:'This is my book.', role:'の: possessivo', roleEn:'の: possessive' },
  { id:'p45', particle:'の', distractors:['は','が','に'],
    sentence:'田中さん___かばんはどこですか。', meaning:'Onde está a bolsa de Tanaka-san?', en:'Where is Tanaka-san\'s bag?', role:'の: possessivo', roleEn:'の: possessive' },
  { id:'p46', particle:'の', distractors:['は','が','を'],
    sentence:'日本___食べ物が好きです。', meaning:'Gosto da comida japonesa.', en:'I like Japanese food.', role:'の: modificador de substantivo', roleEn:'の: noun modifier' },
  { id:'p47', particle:'の', distractors:['は','が','に'],
    sentence:'昨日___ニュースを見ましたか。', meaning:'Você assistiu às notícias de ontem?', en:'Did you watch yesterday\'s news?', role:'の: modificador de substantivo', roleEn:'の: noun modifier' },

  // ── へ — direction (emphasis on journey) ─────────
  { id:'p48', particle:'へ', distractors:['に','で','を'],
    sentence:'外国___行きたいです。', meaning:'Quero ir para o exterior.', en:'I want to go abroad.', role:'へ: direção (ênfase no trajeto)', roleEn:'へ: direction (emphasis on journey)' },
  { id:'p49', particle:'へ', distractors:['に','で','は'],
    sentence:'うち___帰ります。', meaning:'Volto para casa.', en:'I am going home.', role:'へ: direção', roleEn:'へ: direction' },

  // ── より — comparison (than) ──────────────────────
  { id:'p50', particle:'より', distractors:['は','が','に'],
    sentence:'夏___冬のほうが好きです。', meaning:'Prefiro o inverno ao verão.', en:'I prefer winter to summer.', role:'より: comparação (do que)', roleEn:'より: comparison (than)' },
  { id:'p51', particle:'より', distractors:['は','が','まで'],
    sentence:'昨日___今日のほうが寒いです。', meaning:'Hoje está mais frio do que ontem.', en:'Today is colder than yesterday.', role:'より: comparação (do que)', roleEn:'より: comparison (than)' },
  { id:'p52', particle:'より', distractors:['は','で','まで'],
    sentence:'バス___電車のほうが速いです。', meaning:'O trem é mais rápido do que o ônibus.', en:'The train is faster than the bus.', role:'より: comparação (do que)', roleEn:'より: comparison (than)' },

];

// ============================================================
// transitivity.js — Transitive / intransitive verb pair data
// Each pair has two questions: one needing the tr form (を sentence)
// and one needing the intr form (が sentence).
// ============================================================
window.TRANSITIVITY_DATA = [

  {
    id: 'akeru',
    tr:   { base: '開ける', past: '開けた', meaning: 'abrir (algo)',  en: 'open (something)' },
    intr: { base: '開く',   past: '開いた', meaning: 'abrir-se',      en: 'open (by itself)' },
    meaning: 'abrir', en: 'open',
    qs: [
      { text: '私は窓を___。',   ans: 'tr',   pt: 'Eu abri a janela.',  en: 'I opened the window.' },
      { text: '花が___。',        ans: 'intr', pt: 'A flor abriu.',      en: 'The flower opened.' },
    ]
  },

  {
    id: 'shimeru',
    tr:   { base: '閉める',  past: '閉めた',  meaning: 'fechar (algo)',  en: 'close (something)' },
    intr: { base: '閉まる',  past: '閉まった', meaning: 'fechar-se',      en: 'close (by itself)' },
    meaning: 'fechar', en: 'close',
    qs: [
      { text: '彼はドアを___。',  ans: 'tr',   pt: 'Ele fechou a porta.', en: 'He closed the door.' },
      { text: 'お店が___。',      ans: 'intr', pt: 'A loja fechou.',       en: 'The store closed.' },
    ]
  },

  {
    id: 'ireru',
    tr:   { base: '入れる', past: '入れた',  meaning: 'colocar dentro', en: 'put inside' },
    intr: { base: '入る',   past: '入った',  meaning: 'entrar',          en: 'enter' },
    meaning: 'entrar / colocar', en: 'put in / enter',
    qs: [
      { text: 'バッグにお金を___。', ans: 'tr',   pt: 'Coloquei dinheiro na bolsa.',  en: 'I put money in the bag.' },
      { text: '猫が部屋に___。',     ans: 'intr', pt: 'O gato entrou no quarto.',     en: 'The cat entered the room.' },
    ]
  },

  {
    id: 'dasu',
    tr:   { base: '出す',  past: '出した', meaning: 'tirar / enviar', en: 'take out / send' },
    intr: { base: '出る',  past: '出た',   meaning: 'sair',           en: 'come out / leave' },
    meaning: 'sair / tirar', en: 'take out / leave',
    qs: [
      { text: '引き出しからペンを___。', ans: 'tr',   pt: 'Tirei a caneta da gaveta.',    en: 'I took the pen from the drawer.' },
      { text: '電車が駅を___。',          ans: 'intr', pt: 'O trem saiu da estação.',     en: 'The train left the station.' },
    ]
  },

  {
    id: 'okosu',
    tr:   { base: '起こす', past: '起こした', meaning: 'acordar alguém', en: 'wake someone up' },
    intr: { base: '起きる', past: '起きた',   meaning: 'acordar',         en: 'wake up' },
    meaning: 'acordar', en: 'wake up',
    qs: [
      { text: '母が弟を___。',    ans: 'tr',   pt: 'A mãe acordou meu irmão.', en: 'Mom woke my brother up.' },
      { text: '私は七時に___。',  ans: 'intr', pt: 'Eu acordei às 7 horas.',   en: 'I woke up at 7 o\'clock.' },
    ]
  },

  {
    id: 'hajimeru',
    tr:   { base: '始める', past: '始めた',   meaning: 'começar (algo)', en: 'start (something)' },
    intr: { base: '始まる', past: '始まった', meaning: 'começar',         en: 'begin' },
    meaning: 'começar', en: 'start / begin',
    qs: [
      { text: '先生が授業を___。', ans: 'tr',   pt: 'O professor começou a aula.', en: 'The teacher started the class.' },
      { text: '試合が___。',        ans: 'intr', pt: 'O jogo começou.',             en: 'The game began.' },
    ]
  },

  {
    id: 'otosu',
    tr:   { base: '落とす', past: '落とした', meaning: 'derrubar / deixar cair', en: 'drop / let fall' },
    intr: { base: '落ちる', past: '落ちた',   meaning: 'cair',                    en: 'fall' },
    meaning: 'cair / derrubar', en: 'drop / fall',
    qs: [
      { text: '私はコップを___。',    ans: 'tr',   pt: 'Derrubei o copo.',           en: 'I dropped the glass.' },
      { text: '葉っぱが木から___。', ans: 'intr', pt: 'A folha caiu da árvore.',    en: 'The leaf fell from the tree.' },
    ]
  },

  {
    id: 'kowasu',
    tr:   { base: '壊す',   past: '壊した',  meaning: 'quebrar (algo)', en: 'break (something)' },
    intr: { base: '壊れる', past: '壊れた',  meaning: 'quebrar-se',      en: 'break (by itself)' },
    meaning: 'quebrar', en: 'break',
    qs: [
      { text: '子どもがおもちゃを___。', ans: 'tr',   pt: 'A criança quebrou o brinquedo.', en: 'The child broke the toy.' },
      { text: '古い機械が___。',          ans: 'intr', pt: 'A máquina velha quebrou.',       en: 'The old machine broke.' },
    ]
  },

  {
    id: 'naosu',
    tr:   { base: '直す',  past: '直した', meaning: 'consertar / corrigir', en: 'fix / correct' },
    intr: { base: '直る',  past: '直った', meaning: 'sarar / ser consertado', en: 'heal / get fixed' },
    meaning: 'consertar', en: 'fix / heal',
    qs: [
      { text: '父が自転車を___。', ans: 'tr',   pt: 'Meu pai consertou a bicicleta.', en: 'My father fixed the bicycle.' },
      { text: '風邪が___。',        ans: 'intr', pt: 'O resfriado sarou.',              en: 'The cold got better.' },
    ]
  },

  {
    id: 'kaeru',
    tr:   { base: '変える', past: '変えた',   meaning: 'mudar (algo)',      en: 'change (something)' },
    intr: { base: '変わる', past: '変わった', meaning: 'mudar-se / mudar', en: 'change (by itself)' },
    meaning: 'mudar', en: 'change',
    qs: [
      { text: '彼は仕事を___。',  ans: 'tr',   pt: 'Ele mudou de emprego.', en: 'He changed his job.' },
      { text: '天気が___。',      ans: 'intr', pt: 'O tempo mudou.',         en: 'The weather changed.' },
    ]
  },

  {
    id: 'tomeru',
    tr:   { base: '止める', past: '止めた',   meaning: 'parar (algo)', en: 'stop (something)' },
    intr: { base: '止まる', past: '止まった', meaning: 'parar',         en: 'stop (by itself)' },
    meaning: 'parar', en: 'stop',
    qs: [
      { text: '運転手が車を___。', ans: 'tr',   pt: 'O motorista parou o carro.', en: 'The driver stopped the car.' },
      { text: 'バスが___。',        ans: 'intr', pt: 'O ônibus parou.',             en: 'The bus stopped.' },
    ]
  },

  {
    id: 'kesu',
    tr:   { base: '消す',   past: '消した',  meaning: 'apagar / desligar',      en: 'turn off / erase' },
    intr: { base: '消える', past: '消えた',  meaning: 'apagar-se / desaparecer', en: 'go out / disappear' },
    meaning: 'apagar', en: 'turn off / erase',
    qs: [
      { text: '電気を___。',    ans: 'tr',   pt: 'Apaguei a luz.',         en: 'I turned off the light.' },
      { text: '煙が___。',      ans: 'intr', pt: 'A fumaça desapareceu.',  en: 'The smoke disappeared.' },
    ]
  },

  {
    id: 'atsumeru',
    tr:   { base: '集める', past: '集めた',   meaning: 'coletar / reunir (algo)', en: 'collect / gather (something)' },
    intr: { base: '集まる', past: '集まった', meaning: 'reunir-se',                en: 'gather together' },
    meaning: 'reunir / coletar', en: 'gather / collect',
    qs: [
      { text: '彼はコインを___。',      ans: 'tr',   pt: 'Ele colecionou moedas.',            en: 'He collected coins.' },
      { text: '人々が広場に___。',      ans: 'intr', pt: 'As pessoas se reuniram na praça.',  en: 'People gathered in the square.' },
    ]
  },

  {
    id: 'fuyasu',
    tr:   { base: '増やす', past: '増やした', meaning: 'aumentar (algo)', en: 'increase (something)' },
    intr: { base: '増える', past: '増えた',   meaning: 'aumentar',         en: 'increase (by itself)' },
    meaning: 'aumentar', en: 'increase',
    qs: [
      { text: '店が商品を___。',   ans: 'tr',   pt: 'A loja aumentou os produtos.', en: 'The store increased its products.' },
      { text: '物価が___。',        ans: 'intr', pt: 'Os preços aumentaram.',         en: 'Prices increased.' },
    ]
  },

  {
    id: 'tsuzukeru',
    tr:   { base: '続ける', past: '続けた', meaning: 'continuar (algo)', en: 'continue (something)' },
    intr: { base: '続く',   past: '続いた', meaning: 'continuar',         en: 'continue (by itself)' },
    meaning: 'continuar', en: 'continue',
    qs: [
      { text: '彼は練習を___。',        ans: 'tr',   pt: 'Ele continuou praticando.',           en: 'He continued practicing.' },
      { text: '雨が一週間___。',        ans: 'intr', pt: 'A chuva continuou por uma semana.',   en: 'The rain continued for a week.' },
    ]
  },

];

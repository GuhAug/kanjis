// ============================================================
// transitivity.js — Transitive / intransitive verb pair data
// Each pair has two questions: one needing the tr form (を sentence)
// and one needing the intr form (が sentence).
// ============================================================
window.TRANSITIVITY_DATA = [

  {
    id: 'akeru',
    tr:   { base: '開ける', past: '開けた', meaning: 'abrir (algo)' },
    intr: { base: '開く',   past: '開いた', meaning: 'abrir-se' },
    meaning: 'abrir',
    qs: [
      { text: '私は窓を___。',   ans: 'tr',   pt: 'Eu abri a janela.' },
      { text: '花が___。',        ans: 'intr', pt: 'A flor abriu.' },
    ]
  },

  {
    id: 'shimeru',
    tr:   { base: '閉める',  past: '閉めた',  meaning: 'fechar (algo)' },
    intr: { base: '閉まる',  past: '閉まった', meaning: 'fechar-se' },
    meaning: 'fechar',
    qs: [
      { text: '彼はドアを___。',  ans: 'tr',   pt: 'Ele fechou a porta.' },
      { text: 'お店が___。',      ans: 'intr', pt: 'A loja fechou.' },
    ]
  },

  {
    id: 'ireru',
    tr:   { base: '入れる', past: '入れた',  meaning: 'colocar dentro' },
    intr: { base: '入る',   past: '入った',  meaning: 'entrar' },
    meaning: 'entrar / colocar',
    qs: [
      { text: 'バッグにお金を___。', ans: 'tr',   pt: 'Coloquei dinheiro na bolsa.' },
      { text: '猫が部屋に___。',     ans: 'intr', pt: 'O gato entrou no quarto.' },
    ]
  },

  {
    id: 'dasu',
    tr:   { base: '出す',  past: '出した', meaning: 'tirar / enviar' },
    intr: { base: '出る',  past: '出た',   meaning: 'sair' },
    meaning: 'sair / tirar',
    qs: [
      { text: '引き出しからペンを___。', ans: 'tr',   pt: 'Tirei a caneta da gaveta.' },
      { text: '電車が駅を___。',          ans: 'intr', pt: 'O trem saiu da estação.' },
    ]
  },

  {
    id: 'okosu',
    tr:   { base: '起こす', past: '起こした', meaning: 'acordar alguém' },
    intr: { base: '起きる', past: '起きた',   meaning: 'acordar' },
    meaning: 'acordar',
    qs: [
      { text: '母が弟を___。',    ans: 'tr',   pt: 'A mãe acordou meu irmão.' },
      { text: '私は七時に___。',  ans: 'intr', pt: 'Eu acordei às 7 horas.' },
    ]
  },

  {
    id: 'hajimeru',
    tr:   { base: '始める', past: '始めた',   meaning: 'começar (algo)' },
    intr: { base: '始まる', past: '始まった', meaning: 'começar' },
    meaning: 'começar',
    qs: [
      { text: '先生が授業を___。', ans: 'tr',   pt: 'O professor começou a aula.' },
      { text: '試合が___。',        ans: 'intr', pt: 'O jogo começou.' },
    ]
  },

  {
    id: 'otosu',
    tr:   { base: '落とす', past: '落とした', meaning: 'derrubar / deixar cair' },
    intr: { base: '落ちる', past: '落ちた',   meaning: 'cair' },
    meaning: 'cair / derrubar',
    qs: [
      { text: '私はコップを___。',    ans: 'tr',   pt: 'Derrubei o copo.' },
      { text: '葉っぱが木から___。', ans: 'intr', pt: 'A folha caiu da árvore.' },
    ]
  },

  {
    id: 'kowasu',
    tr:   { base: '壊す',   past: '壊した',  meaning: 'quebrar (algo)' },
    intr: { base: '壊れる', past: '壊れた',  meaning: 'quebrar-se' },
    meaning: 'quebrar',
    qs: [
      { text: '子どもがおもちゃを___。', ans: 'tr',   pt: 'A criança quebrou o brinquedo.' },
      { text: '古い機械が___。',          ans: 'intr', pt: 'A máquina velha quebrou.' },
    ]
  },

  {
    id: 'naosu',
    tr:   { base: '直す',  past: '直した', meaning: 'consertar / corrigir' },
    intr: { base: '直る',  past: '直った', meaning: 'sarar / ser consertado' },
    meaning: 'consertar',
    qs: [
      { text: '父が自転車を___。', ans: 'tr',   pt: 'Meu pai consertou a bicicleta.' },
      { text: '風邪が___。',        ans: 'intr', pt: 'O resfriado sarou.' },
    ]
  },

  {
    id: 'kaeru',
    tr:   { base: '変える', past: '変えた',   meaning: 'mudar (algo)' },
    intr: { base: '変わる', past: '変わった', meaning: 'mudar-se / mudar' },
    meaning: 'mudar',
    qs: [
      { text: '彼は仕事を___。',  ans: 'tr',   pt: 'Ele mudou de emprego.' },
      { text: '天気が___。',      ans: 'intr', pt: 'O tempo mudou.' },
    ]
  },

  {
    id: 'tomeru',
    tr:   { base: '止める', past: '止めた',   meaning: 'parar (algo)' },
    intr: { base: '止まる', past: '止まった', meaning: 'parar' },
    meaning: 'parar',
    qs: [
      { text: '運転手が車を___。', ans: 'tr',   pt: 'O motorista parou o carro.' },
      { text: 'バスが___。',        ans: 'intr', pt: 'O ônibus parou.' },
    ]
  },

  {
    id: 'kesu',
    tr:   { base: '消す',   past: '消した',  meaning: 'apagar / desligar' },
    intr: { base: '消える', past: '消えた',  meaning: 'apagar-se / desaparecer' },
    meaning: 'apagar',
    qs: [
      { text: '電気を___。',    ans: 'tr',   pt: 'Apaguei a luz.' },
      { text: '煙が___。',      ans: 'intr', pt: 'A fumaça desapareceu.' },
    ]
  },

  {
    id: 'atsumeru',
    tr:   { base: '集める', past: '集めた',   meaning: 'coletar / reunir (algo)' },
    intr: { base: '集まる', past: '集まった', meaning: 'reunir-se' },
    meaning: 'reunir / coletar',
    qs: [
      { text: '彼はコインを___。',      ans: 'tr',   pt: 'Ele colecionou moedas.' },
      { text: '人々が広場に___。',      ans: 'intr', pt: 'As pessoas se reuniram na praça.' },
    ]
  },

  {
    id: 'fuyasu',
    tr:   { base: '増やす', past: '増やした', meaning: 'aumentar (algo)' },
    intr: { base: '増える', past: '増えた',   meaning: 'aumentar' },
    meaning: 'aumentar',
    qs: [
      { text: '店が商品を___。',   ans: 'tr',   pt: 'A loja aumentou os produtos.' },
      { text: '物価が___。',        ans: 'intr', pt: 'Os preços aumentaram.' },
    ]
  },

  {
    id: 'tsuzukeru',
    tr:   { base: '続ける', past: '続けた', meaning: 'continuar (algo)' },
    intr: { base: '続く',   past: '続いた', meaning: 'continuar' },
    meaning: 'continuar',
    qs: [
      { text: '彼は練習を___。',        ans: 'tr',   pt: 'Ele continuou praticando.' },
      { text: '雨が一週間___。',        ans: 'intr', pt: 'A chuva continuou por uma semana.' },
    ]
  },

];

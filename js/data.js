// ============================================================
// data.js — Data helpers built on window.KANJI_DATA
// ============================================================

var KanjiData = (function () {

  var _data = [];
  var _byId = {};
  var _byLevel = {};
  var _byChapter = {};

  function init(rawData) {
    _data = rawData || [];
    _byId = {};
    _byLevel = { 1: [], 2: [], 3: [], 4: [] };
    _byChapter = {};
    _readingMap = null; // reset so it's rebuilt with new data

    for (var i = 0; i < _data.length; i++) {
      var k = _data[i];
      _byId[k.id] = k;
      if (!_byLevel[k.level]) _byLevel[k.level] = [];
      _byLevel[k.level].push(k);
      var ck = k.level + '-' + k.chapter;
      if (!_byChapter[ck]) _byChapter[ck] = [];
      _byChapter[ck].push(k);
    }
  }

  function getAll() { return _data; }

  function getById(id) { return _byId[id] || null; }

  function getLevel(level) { return _byLevel[level] || []; }

  function getChapter(level, chapter) {
    return _byChapter[level + '-' + chapter] || [];
  }

  function getChaptersForLevel(level) {
    var chapters = [];
    var seen = {};
    var arr = _byLevel[level] || [];
    for (var i = 0; i < arr.length; i++) {
      var ch = arr[i].chapter;
      if (!seen[ch]) {
        seen[ch] = true;
        chapters.push(ch);
      }
    }
    chapters.sort(function (a, b) { return a - b; });
    return chapters;
  }

  function getLevels() {
    return [
      { level: 1, name: 'Iniciante',     count: (_byLevel[1] || []).length },
      { level: 2, name: 'Elementar',     count: (_byLevel[2] || []).length },
      { level: 3, name: 'Intermediário', count: (_byLevel[3] || []).length },
      { level: 4, name: 'Avançado',      count: (_byLevel[4] || []).length },
    ];
  }

  function getLevelName(level) {
    var names = { 1: 'Iniciante', 2: 'Elementar', 3: 'Intermediário', 4: 'Avançado' };
    return names[level] || 'Nível ' + level;
  }

  var CHAPTER_JP = ['一', '二', '三', '四', '五', '六', '七', '八'];

  function getChapterLabel(ch) {
    return CHAPTER_JP[ch - 1] || ch;
  }

  // Search across kanji char, reading, and PT meaning
  function search(query) {
    if (!query) return [];
    var q = query.trim().toLowerCase();
    return _data.filter(function (k) {
      return (
        (k.k && k.k.includes(query)) ||
        (k.kun && k.kun.toLowerCase().includes(q)) ||
        (k.on && k.on.toLowerCase().includes(q)) ||
        (k.pt && k.pt.toLowerCase().includes(q))
      );
    });
  }

  // Get pool for a quiz/flashcard session
  // scope: { level: 0|1-4, chapter: 0|1-8 }  — 0 means "all"
  function getPool(level, chapter) {
    if (!level || level === 0) return _data.slice();
    if (!chapter || chapter === 0) return (_byLevel[level] || []).slice();
    return getChapter(level, chapter).slice();
  }

  // Fisher-Yates shuffle (in-place, returns arr)
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // Pick n random unique items from arr (returns new array)
  function pickRandom(arr, n) {
    var copy = arr.slice();
    shuffle(copy);
    return copy.slice(0, Math.min(n, copy.length));
  }

  // Build distractor pools — same level preferred, fallback to all
  function getDistractors(correct, field, count) {
    count = count || 3;
    var pool = (_byLevel[correct.level] || []).filter(function (k) {
      return k.id !== correct.id && k[field];
    });
    if (pool.length < count) {
      pool = _data.filter(function (k) {
        return k.id !== correct.id && k[field];
      });
    }
    shuffle(pool);
    // Deduplicate by field value
    var seen = {}; var result = [];
    seen[correct[field]] = true;
    for (var i = 0; i < pool.length && result.length < count; i++) {
      var val = pool[i][field];
      if (!seen[val]) { seen[val] = true; result.push(val); }
    }
    return result;
  }

  function total() { return _data.length; }

  // ---- Furigana annotation ----
  var _readingMap = null;

  // Convert katakana string to hiragana (for displaying on readings as furigana)
  function _toHiragana(str) {
    return str.replace(/[ァ-ン]/g, function (ch) {
      return String.fromCharCode(ch.charCodeAt(0) - 0x60);
    });
  }

  // Strip the first reading from a reading string like "ちか（い）" or "おし（える）"
  // Removes full parenthetical groups (（…）) so we get the base form only.
  function _baseReading(str) {
    return str.split('、')[0]
      .replace(/[（(][^）)]*[）)]/g, '') // remove （…） or (…) entirely
      .replace(/[～〜~]/g, '')
      .trim();
  }

  function _buildReadingMap() {
    _readingMap = {};
    for (var i = 0; i < _data.length; i++) {
      var k = _data[i];
      if (!k.k) continue;
      var kun = k.kun ? _baseReading(k.kun)            : null;
      var on  = k.on  ? _toHiragana(_baseReading(k.on)) : null;
      var reading = (kun && on) ? (kun.length <= on.length ? kun : on) : (kun || on);
      if (reading) _readingMap[k.k] = reading;
    }
  }

  // Wrap kanji characters in <ruby> tags with furigana readings.
  // skipChar: if provided, that kanji character is left as plain text (used to
  // avoid annotating the kanji currently being studied in its own example).
  // Returns safe HTML string suitable for innerHTML.
  function annotateEx(text, skipChar) {
    if (!text) return '';
    if (!_readingMap) _buildReadingMap();
    var result = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      var code = ch.charCodeAt(0);
      var isKanji = (code >= 0x4E00 && code <= 0x9FFF) || (code >= 0x3400 && code <= 0x4DBF);
      if (isKanji) {
        if (skipChar && ch === skipChar) {
          result += ch; // studied kanji — show plain, reader already knows it
        } else {
          var reading = _readingMap[ch];
          result += reading
            ? '<ruby>' + ch + '<rt>' + reading + '</rt></ruby>'
            : '<span class="kanji-unknown" title="Kanji não catalogado">' + ch + '</span>';
        }
      } else {
        result += ch;
      }
    }
    return result;
  }

  return {
    init: init,
    getAll: getAll,
    getById: getById,
    getLevel: getLevel,
    getChapter: getChapter,
    getChaptersForLevel: getChaptersForLevel,
    getLevels: getLevels,
    getLevelName: getLevelName,
    getChapterLabel: getChapterLabel,
    search: search,
    getPool: getPool,
    shuffle: shuffle,
    pickRandom: pickRandom,
    getDistractors: getDistractors,
    total: total,
    annotateEx: annotateEx,
  };

})();

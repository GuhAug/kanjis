// ============================================================
// storage.js — localStorage wrapper for progress tracking
// ============================================================

var KanjiStorage = (function () {

  var KEY = 'kanjis_progress';

  function _load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  function _save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function _ensure(data) {
    if (!data.seen)        data.seen = [];
    if (!data.mastered)    data.mastered = [];
    if (!data.quizHistory) data.quizHistory = [];
    if (!data.streakDays)  data.streakDays = [];
    return data;
  }

  // ---- Seen / Mastered ----

  function markSeen(id) {
    var d = _ensure(_load());
    if (d.seen.indexOf(id) === -1) d.seen.push(id);
    _recordActivity(d);
    _save(d);
  }

  function markSeenBulk(ids) {
    var d = _ensure(_load());
    for (var i = 0; i < ids.length; i++) {
      if (d.seen.indexOf(ids[i]) === -1) d.seen.push(ids[i]);
    }
    _recordActivity(d);
    _save(d);
  }

  function toggleMastered(id) {
    var d = _ensure(_load());
    var idx = d.mastered.indexOf(id);
    if (idx === -1) {
      d.mastered.push(id);
      if (d.seen.indexOf(id) === -1) d.seen.push(id);
    } else {
      d.mastered.splice(idx, 1);
    }
    _save(d);
    return idx === -1; // true if now mastered
  }

  function isSeen(id) {
    var d = _load();
    return (d.seen || []).indexOf(id) !== -1;
  }

  function isMastered(id) {
    var d = _load();
    return (d.mastered || []).indexOf(id) !== -1;
  }

  // ---- Stats ----

  function getStats() {
    var d = _ensure(_load());
    var total = KanjiData.total();
    var seenCount = d.seen.length;
    var masteredCount = d.mastered.length;

    var byLevel = {};
    for (var l = 1; l <= 4; l++) {
      var levelKanji = KanjiData.getLevel(l);
      var levelSeen = 0, levelMastered = 0;
      for (var i = 0; i < levelKanji.length; i++) {
        var id = levelKanji[i].id;
        if (d.mastered.indexOf(id) !== -1) { levelMastered++; levelSeen++; }
        else if (d.seen.indexOf(id) !== -1) { levelSeen++; }
      }
      byLevel[l] = {
        total: levelKanji.length,
        seen: levelSeen,
        mastered: levelMastered,
        pct: levelKanji.length ? Math.round((levelSeen / levelKanji.length) * 100) : 0,
      };
    }

    var streak = _getStreak(d.streakDays);

    return {
      total: total,
      seen: seenCount,
      mastered: masteredCount,
      pct: total ? Math.round((seenCount / total) * 100) : 0,
      byLevel: byLevel,
      streak: streak,
      quizHistory: (d.quizHistory || []).slice(-5).reverse(),
    };
  }

  // ---- Quiz History ----

  function recordQuiz(type, score, total) {
    var d = _ensure(_load());
    var today = _today();
    d.quizHistory.push({ date: today, type: type, score: score, total: total });
    if (d.quizHistory.length > 20) d.quizHistory = d.quizHistory.slice(-20);
    _recordActivity(d);
    _save(d);
  }

  // ---- Streak ----

  function _today() {
    return new Date().toISOString().slice(0, 10);
  }

  function _recordActivity(d) {
    var t = _today();
    if ((d.streakDays || []).indexOf(t) === -1) {
      d.streakDays = d.streakDays || [];
      d.streakDays.push(t);
    }
  }

  function _getStreak(days) {
    if (!days || days.length === 0) return 0;
    var sorted = days.slice().sort();
    var today = _today();
    var streak = 0;
    var current = today;
    for (var i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i] === current) {
        streak++;
        var d = new Date(current);
        d.setDate(d.getDate() - 1);
        current = d.toISOString().slice(0, 10);
      } else if (sorted[i] < current) {
        break;
      }
    }
    return streak;
  }

  // ---- Export / Import / Reset ----

  function exportJSON() {
    var d = _load();
    var blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'kanji_progresso_' + _today() + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(str) {
    try {
      var d = JSON.parse(str);
      _save(d);
      return true;
    } catch (e) {
      return false;
    }
  }

  function reset() {
    localStorage.removeItem(KEY);
  }

  return {
    markSeen: markSeen,
    markSeenBulk: markSeenBulk,
    toggleMastered: toggleMastered,
    isSeen: isSeen,
    isMastered: isMastered,
    getStats: getStats,
    recordQuiz: recordQuiz,
    exportJSON: exportJSON,
    importJSON: importJSON,
    reset: reset,
  };

})();

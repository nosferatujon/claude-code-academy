/*
 * Client-side progress tracking for Claude Code Academy.
 * No backend, no accounts — everything lives in localStorage.
 * Exposed globally as window.Progress.
 */
(function () {
  const KEY = 'cca_progress_v1';

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const data = JSON.parse(raw);
      return Object.assign(blank(), data);
    } catch {
      return blank();
    }
  }

  function blank() {
    // exercises/lessons map: slug -> domainId
    return { exercises: {}, lessons: {}, exam: { last: null, history: [] } };
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
    document.dispatchEvent(new CustomEvent('progress-change', { detail: data }));
  }

  const Progress = {
    all() {
      return load();
    },

    isExerciseDone(slug) {
      return Boolean(load().exercises[slug]);
    },
    toggleExercise(slug, domain) {
      const d = load();
      if (d.exercises[slug]) delete d.exercises[slug];
      else d.exercises[slug] = domain;
      save(d);
      return Boolean(d.exercises[slug]);
    },

    isLessonRead(slug) {
      return Boolean(load().lessons[slug]);
    },
    markLessonRead(slug, domain) {
      const d = load();
      if (!d.lessons[slug]) {
        d.lessons[slug] = domain;
        save(d);
      }
    },
    toggleLesson(slug, domain) {
      const d = load();
      if (d.lessons[slug]) delete d.lessons[slug];
      else d.lessons[slug] = domain;
      save(d);
      return Boolean(d.lessons[slug]);
    },

    // result = { correct, total, byDomain: {domain:{correct,total}} }
    saveExam(result) {
      const d = load();
      const entry = Object.assign({ date: new Date().toISOString() }, result);
      d.exam.last = entry;
      d.exam.history = (d.exam.history || []).concat(entry).slice(-25);
      save(d);
    },

    // Count of completed items per domain. catalog optional for totals.
    domainCounts() {
      const d = load();
      const out = {};
      for (const [, dom] of Object.entries(d.exercises)) {
        out[dom] = out[dom] || { ex: 0, lesson: 0 };
        out[dom].ex++;
      }
      for (const [, dom] of Object.entries(d.lessons)) {
        out[dom] = out[dom] || { ex: 0, lesson: 0 };
        out[dom].lesson++;
      }
      return out;
    },

    reset() {
      localStorage.removeItem(KEY);
      document.dispatchEvent(new CustomEvent('progress-change', { detail: blank() }));
    },
  };

  window.Progress = Progress;
})();

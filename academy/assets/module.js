/* ReferTRM Academy — module page engine.
   Reading cards are static (readable with JS dead). This file adds:
   progress recording, EN/MM language toggle, the mastery gate
   (sequential questions, a miss routes back to the teaching card,
   no shame copy), and the certificate moment. */
(function () {
  'use strict';
  const V = window.AcademyViews;
  if (!V) return;
  const dataEl = document.getElementById('mod-data');
  if (!dataEl) return;
  const MOD = JSON.parse(dataEl.textContent);
  const P = V.loadProgress();

  /* ---------- theme ---------- */
  function renderThemeBtn() {
    const b = document.getElementById('themebtn');
    if (!b) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    b.innerHTML = dark ? V.ICON.sun : V.ICON.moon;
  }
  const tb = document.getElementById('themebtn');
  if (tb) tb.addEventListener('click', function () {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('academy-theme', next); } catch (e) {}
    renderThemeBtn();
  });
  renderThemeBtn();

  /* ---------- progress: seen + furthest card ---------- */
  if (!P.passed[MOD.id]) {
    P.seen[MOD.id] = Date.now();
    V.saveProgress(P);
  }
  const cards = Array.prototype.slice.call(document.querySelectorAll('.rcard[data-card]'));
  if ('IntersectionObserver' in window && cards.length) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const n = parseInt(en.target.getAttribute('data-card'), 10);
        if (!P.card[MOD.id] || n > P.card[MOD.id]) {
          P.card[MOD.id] = n;
          V.saveProgress(P);
        }
      });
    }, { rootMargin: '0px 0px -40% 0px' });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- language toggle ---------- */
  const langTog = document.getElementById('langtog');
  if (langTog) {
    langTog.addEventListener('click', function (ev) {
      const btn = ev.target.closest('button[data-lang]');
      if (!btn) return;
      const lang = btn.getAttribute('data-lang');
      langTog.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('on', b === btn);
      });
      document.querySelectorAll('[data-langbody]').forEach(function (el) {
        el.style.display = el.getAttribute('data-langbody') === lang ? '' : 'none';
      });
    });
  }

  /* ---------- status pill ---------- */
  function paintStatus(state) {
    const el = document.getElementById('statuspill');
    if (!el) return;
    if (state === 'done') el.innerHTML = `<span class="pill teal">${V.ICON.check} Passed</span>`;
    else if (state === 'revision') el.innerHTML = `<span class="pill warn">${V.ICON.refresh} One more pass</span>`;
    else el.innerHTML = `<span class="pill teal">${V.ICON.play} In progress</span>`;
  }
  if (P.passed[MOD.id]) paintStatus('done');
  else if (P.review[MOD.id]) paintStatus('revision');

  /* ---------- mastery gate ---------- */
  const quizRoot = document.getElementById('quiz');
  if (!quizRoot) return;
  const lang = function () {
    const on = document.querySelector('#langtog button.on');
    return on ? on.getAttribute('data-lang') : 'en';
  };
  const questions = function () {
    return (lang() === 'mm' && MOD.quizMm && MOD.quizMm.length === MOD.quiz.length) ? MOD.quizMm : MOD.quiz;
  };

  /* teaching-card matcher: route a miss to the card that most likely teaches it */
  function bestCard(q) {
    const words = (q.q + ' ' + q.opts.join(' ')).toLowerCase().split(/[^a-z\u1000-\u109f]+/).filter(function (w) { return w.length > 4; });
    let best = 0, bestScore = 0;
    MOD.cards.forEach(function (c, i) {
      const hay = (c.title + ' ' + c.body).toLowerCase();
      let s = 0;
      words.forEach(function (w) { if (hay.indexOf(w) >= 0) s++; });
      if (s > bestScore) { bestScore = s; best = i; }
    });
    return best;
  }

  const state = { current: 0, right: 0, done: !!P.passed[MOD.id] };

  function renderQuiz() {
    const qs = questions();
    let html = '';
    qs.forEach(function (q, qi) {
      if (qi > state.current && !state.done) {
        html += `<div class="quiz-q" data-q="${qi}" style="opacity:.55">
          <div class="qq">${V.esc(q.q)}</div>
          <p class="sm dim" style="margin-top:8px">Opens after question ${qi} is answered.</p>
        </div>`;
        return;
      }
      const answered = qi < state.current || state.done;
      html += `<div class="quiz-q" data-q="${qi}">
        <div class="qq ${lang() === 'mm' ? 'mm' : ''}">${V.esc(q.q)}</div>
        ${q.opts.map(function (o, oi) {
          let cls = '';
          if (answered) cls = oi === q.correct ? 'right' : '';
          return `<button class="quiz-opt ${cls}" data-q="${qi}" data-o="${oi}" ${answered ? 'disabled' : ''}>
            <span class="oi">${answered && oi === q.correct ? V.ICON.check : String.fromCharCode(65 + oi)}</span>
            <span class="${lang() === 'mm' ? 'mm' : ''}">${V.esc(o)}</span>
          </button>`;
        }).join('')}
        <div class="quiz-feedback" data-fb="${qi}">${answered && q.why ? `<div class="quiz-note good">${V.esc(q.why)}</div>` : ''}</div>
      </div>`;
    });
    quizRoot.innerHTML = html;
  }

  quizRoot.addEventListener('click', function (ev) {
    const opt = ev.target.closest('.quiz-opt');
    if (opt && !opt.disabled) {
      const qi = parseInt(opt.getAttribute('data-q'), 10);
      const oi = parseInt(opt.getAttribute('data-o'), 10);
      if (qi !== state.current) return;
      const q = questions()[qi];
      const fb = quizRoot.querySelector(`[data-fb="${qi}"]`);
      if (oi === q.correct) {
        opt.classList.add('right');
        opt.querySelector('.oi').innerHTML = V.ICON.check;
        quizRoot.querySelectorAll(`.quiz-opt[data-q="${qi}"]`).forEach(function (b) { b.disabled = true; });
        if (fb && q.why) fb.innerHTML = `<div class="quiz-note good">${V.esc(q.why)}</div>`;
        state.right++;
        state.current++;
        delete P.review[MOD.id];
        V.saveProgress(P);
        if (state.current >= questions().length) {
          passModule();
        } else {
          setTimeout(renderQuiz, 350);
        }
      } else {
        /* a miss routes back to the teaching — no shame */
        opt.classList.add('miss');
        opt.disabled = true;
        P.review[MOD.id] = Date.now();
        V.saveProgress(P);
        paintStatus('revision');
        const ci = bestCard(q);
        if (fb) fb.innerHTML = `<div class="quiz-note">${V.esc(q.why || 'Not this one.')}</div>
          <div style="margin-top:10px"><button class="btn ghost sm" data-tocard="${ci}" style="padding:6px 12px">${V.ICON.book} Back to the teaching — card ${ci + 1}</button></div>`;
      }
      return;
    }
    const toCard = ev.target.closest('[data-tocard]');
    if (toCard) {
      const ci = parseInt(toCard.getAttribute('data-tocard'), 10);
      const el = cards[ci];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('flash');
        setTimeout(function () { el.classList.remove('flash'); }, 2600);
      }
    }
  });

  function passModule() {
    state.done = true;
    P.passed[MOD.id] = { at: Date.now() };
    delete P.review[MOD.id];
    V.saveProgress(P);
    paintStatus('done');
    renderQuiz();
    const cert = document.getElementById('certificate');
    if (cert) {
      cert.style.display = '';
      cert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const gate = document.getElementById('gatenote');
    if (gate) gate.style.display = 'none';
  }

  /* certificate PDF click — records the real action for the dashboard */
  const pdfLink = document.getElementById('certpdf');
  if (pdfLink) pdfLink.addEventListener('click', function () {
    P.certPdf[MOD.id] = Date.now();
    V.saveProgress(P);
  });

  /* already passed on arrival: show certificate */
  if (state.done) {
    const cert = document.getElementById('certificate');
    if (cert) cert.style.display = '';
    const gate = document.getElementById('gatenote');
    if (gate) gate.style.display = 'none';
  }
  renderQuiz();
})();

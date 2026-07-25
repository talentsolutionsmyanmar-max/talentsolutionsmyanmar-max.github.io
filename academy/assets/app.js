/* ReferTRM Academy — dashboard + roads hydration.
   Static HTML already paints the true zero-progress state; this file
   re-renders dynamic regions with the learner's real local progress
   and wires theme + the time-aware, name-aware greeting. */
(function () {
  'use strict';
  const V = window.AcademyViews;
  const D = window.ACADEMY;
  if (!V || !D) return;

  const BASE = document.body.getAttribute('data-base') || '';
  const P = V.loadProgress();

  /* ---------- theme ---------- */
  function renderThemeBtn() {
    const b = document.getElementById('themebtn');
    if (!b) return;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    b.innerHTML = dark ? V.ICON.sun : V.ICON.moon;
    b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
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

  /* ---------- greeting (time-aware, name-aware, local-only) ---------- */
  function greet() {
    const h = new Date().getHours();
    const part = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    return P.name ? `${part}, ${P.name}.` : `${part}.`;
  }
  const gEl = document.getElementById('greeting');
  if (gEl) gEl.textContent = greet();
  const nEl = document.getElementById('nameset');
  if (nEl) {
    const paintName = function () {
      nEl.textContent = P.name ? `Not ${P.name}? Change` : 'Add your name';
      nEl.title = 'Stored only on this device — it never leaves your phone.';
    };
    paintName();
    nEl.addEventListener('click', function () {
      const v = window.prompt('What should Academy call you? (Stored only on this device.)', P.name || '');
      if (v === null) return;
      P.name = v.trim().slice(0, 40);
      V.saveProgress(P);
      paintName();
      if (gEl) gEl.textContent = greet();
    });
  }

  /* ---------- region hydration ---------- */
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  setHTML('rg-ladder', V.ladderStrip(D, P));
  setHTML('rg-continue', V.continueCard(D, P, BASE));
  setHTML('rg-attention', V.attentionList(D, P, BASE));
  setHTML('rg-mmband', V.mmHeroBand(D, P, BASE));
  setHTML('rg-catgrid', V.categoryGrid(D, P, BASE));
  setHTML('rg-catsecs', V.categorySections(D, P, BASE));
  if (document.getElementById('rg-roadsteaser')) {
    setHTML('rg-roadsteaser', V.roadsTeaser(D, P, BASE));
  }

  /* ---------- roads page: patch module rows + stage locks ---------- */
  const roadsRoot = document.getElementById('rg-roads');
  if (roadsRoot && window.ACADEMY_TRACKS) {
    /* module rows: re-render with live state */
    roadsRoot.querySelectorAll('[data-mid]').forEach(function (el) {
      const m = D.modules.find(function (x) { return x.id === el.getAttribute('data-mid'); });
      if (!m) return;
      const tmp = document.createElement('div');
      tmp.innerHTML = V.moduleRow(D, P, m, BASE);
      const row = tmp.firstChild;
      row.setAttribute('data-mid', m.id);
      el.replaceWith(row);
    });
    /* stage cards: unlocked when every mapped module of the previous stage passed */
    roadsRoot.querySelectorAll('[data-stage]').forEach(function (el) {
      const fam = el.getAttribute('data-fam');
      const idx = parseInt(el.getAttribute('data-stage'), 10);
      if (idx === 0) return;
      const prevLvl = ['BEGINNER', 'STARTER', 'MOVER', 'FLYER'][idx - 1];
      const prevMods = D.modules.filter(function (m) { return m.fam === fam && m.flvl === prevLvl; });
      const open = prevMods.length > 0 && prevMods.every(function (m) { return P.passed[m.id]; });
      el.classList.toggle('locked', !open);
      const lockEl = el.querySelector('[data-lock]');
      if (lockEl) lockEl.innerHTML = open ? '' : V.ICON.lock;
    });
  }
})();

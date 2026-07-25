/* ============================================================
   ReferTRM Academy — shared view library (isomorphic)
   Runs in Node at build time (static pre-render) and in the
   browser (hydration with real local progress). No framework.
   All learner progress lives in localStorage on this device.
   ============================================================ */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AcademyViews = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ---------- icons (inline SVG, Lucide geometry) ---------- */
  const I = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

  const ICON = {
    home:      I('<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'),
    map:       I('<path d="M14.1 5.6a2 2 0 0 0 1.8 0l3.6-1.8A1 1 0 0 1 21 4.6v12.8a1 1 0 0 1-.6.9l-4.5 2.3a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.6 1.8A1 1 0 0 1 3 19.4V6.6a1 1 0 0 1 .6-.9l4.5-2.3a2 2 0 0 1 1.8 0z"/><path d="M15 5.8v15"/><path d="M9 3.2v15"/>'),
    book:      I('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
    check:     I('<polyline points="20 6 9 17 4 12"/>'),
    lock:      I('<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'),
    arrowR:    I('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    chevR:     I('<path d="m9 18 6-6-6-6"/>'),
    sun:       I('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>'),
    moon:      I('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
    grad:      I('<path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>'),
    clock:     I('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
    fileText:  I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" x2="13" y2="13"/><line x1="16" x2="8" y1="17" x2="17" y2="17"/>'),
    shield:    I('<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
    flag:      I('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>'),
    play:      I('<polygon points="6 3 20 12 6 21 6 3"/>'),
    msgSquare: I('<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>'),
    award:     I('<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>'),
    users:     I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
    compass:   I('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>'),
    refresh:   I('<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>'),
    checkC:    I('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
    bot:       I('<rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/>'),
    globe:     I('<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'),
    download:  I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>'),
    share:     I('<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/>'),
    ext:       I('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    briefcase: I('<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
    banknote:  I('<rect width="20" height="12" x="2" y="6" rx="2" ry="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>'),
    megaphone: I('<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
    cpu:       I('<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>'),
    package:   I('<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>'),
    clipboard: I('<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>'),
    spark:     I('<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'),
  };

  const FAMILY_ICON = {
    Sales: 'briefcase', HR: 'users', Finance: 'banknote', Marketing: 'megaphone',
    IT: 'cpu', Operations: 'package', Admin: 'clipboard',
  };

  /* ---------- helpers ---------- */
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const titleCase = (s) => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1).toLowerCase();

  const LEVELS = ['FOUNDATION', 'BEGINNER', 'INTERMEDIATE', 'CERTIFYING'];

  /* Recruiter Pathway gate (real platform rule): M4 opens when M1–M3 are passed. */
  const PATHWAY_SLUGS = [
    'recruiter-path-m1-the-intake-calibrate-before-you-source',
    'recruiter-path-m2-the-hunt-sourcing-and-the-search-string',
    'recruiter-path-m3-the-scorecard-quality-metrics-and-the-money',
  ];
  const M4_SLUG = 'recruiter-path-m4-the-screen-truth-dignity-and-certification';

  /* ---------- progress store ---------- */
  const STORE_KEY = 'academy.v1';
  function emptyProgress() {
    return { name: '', passed: {}, review: {}, certPdf: {}, card: {}, seen: {} };
  }
  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyProgress();
      return Object.assign(emptyProgress(), JSON.parse(raw));
    } catch (e) { return emptyProgress(); }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) {}
  }

  /* ---------- state resolvers (pure) ---------- */
  function modsOfLevel(data, lvl) { return data.modules.filter((m) => m.lvl === lvl); }

  function levelComplete(data, p, lvl) {
    const mods = modsOfLevel(data, lvl);
    return mods.length > 0 && mods.every((m) => p.passed[m.id]);
  }

  function levelUnlocked(data, p, lvl) {
    if (lvl === 'FOUNDATION') return true;
    if (lvl === 'CERTIFYING') {
      /* the Certifying rung is the Recruiter Pathway destination */
      return PATHWAY_SLUGS.every((s) => {
        const m = data.modules.find((x) => x.slug === s);
        return m && p.passed[m.id];
      });
    }
    const prev = LEVELS[LEVELS.indexOf(lvl) - 1];
    return levelComplete(data, p, prev);
  }

  function levelState(data, p, lvl) {
    if (levelComplete(data, p, lvl)) return 'done';
    if (levelUnlocked(data, p, lvl)) return 'current';
    return 'locked';
  }

  function moduleLocked(data, p, m) {
    if (m.slug === M4_SLUG) {
      return !PATHWAY_SLUGS.every((s) => {
        const x = data.modules.find((y) => y.slug === s);
        return x && p.passed[x.id];
      });
    }
    return !levelUnlocked(data, p, m.lvl);
  }

  function moduleState(data, p, m) {
    if (p.passed[m.id]) return 'done';
    if (p.review[m.id]) return 'revision';
    if (moduleLocked(data, p, m)) return 'locked';
    if (p.seen[m.id]) return 'active';
    return 'upcoming';
  }

  /* MM-complete categories: every module has a Myanmar body. Mark only what is complete. */
  function mmCompleteCategories(data) {
    const byCat = {};
    data.modules.forEach((m) => { (byCat[m.cat] = byCat[m.cat] || []).push(m); });
    return Object.keys(byCat).filter((c) => byCat[c].every((m) => m.mm)).sort();
  }

  function categoryProgress(data, p, cat) {
    const mods = data.modules.filter((m) => m.cat === cat);
    const done = mods.filter((m) => p.passed[m.id]).length;
    return { done, total: mods.length };
  }

  /* continue-learning: most recently seen, unfinished, unlocked module;
     zero-activity state → a real, dignified first suggestion (Myanmar-first). */
  function continueTarget(data, p) {
    const candidates = data.modules
      .filter((m) => !p.passed[m.id] && !moduleLocked(data, p, m));
    const started = candidates
      .filter((m) => p.seen[m.id] || p.review[m.id])
      .sort((a, b) => (p.seen[b.id] || 0) - (p.seen[a.id] || 0));
    if (started.length) return { kind: 'continue', mod: started[0] };
    const mmCats = mmCompleteCategories(data);
    for (const c of mmCats) {
      const mods = candidates.filter((m) => m.cat === c).sort((a, b) => a.ord - b.ord);
      if (mods.length) return { kind: 'begin', mod: mods[0], mmFirst: true };
    }
    const any = candidates.slice().sort((a, b) => a.ord - b.ord);
    return any.length ? { kind: 'begin', mod: any[0] } : null;
  }

  /* ---------- fragments ---------- */
  function mmk() {
    return `<span class="mmk" title="Full Myanmar body inside">${ICON.globe} MM</span>`;
  }

  function moduleRow(data, p, m, base) {
    const st = moduleState(data, p, m);
    const glyph = st === 'done' ? ICON.check
      : st === 'locked' ? ICON.lock
      : st === 'revision' ? ICON.refresh
      : st === 'active' ? ICON.play
      : ICON.book;
    const sub = st === 'done' ? 'Passed'
      : st === 'revision' ? 'One more pass — the check is waiting'
      : st === 'locked' ? (m.slug === M4_SLUG ? 'Opens after M1–M3 of the Recruiter Pathway' : `${titleCase(m.lvl)} level — locked`)
      : st === 'active' ? 'Started — pick up where you left off'
      : `${titleCase(m.lvl)} level`;
    const inner = `
      <span class="mi">${glyph}</span>
      <span class="mt">
        <span class="t">${esc(m.t)}</span>
        <span class="s" style="display:block">${sub}</span>
        ${m.mm && m.tm ? `<span class="s mm" style="display:block">${esc(m.tm)}</span>` : ''}
      </span>
      ${m.mm ? mmk() : ''}
      <span class="meta"><span class="row num" style="gap:5px">${ICON.clock} ${m.dur} min</span><span class="xpm num">${m.xp} XP</span></span>
      ${st !== 'locked' ? `<span class="chev">${ICON.chevR}</span>` : ''}`;
    if (st === 'locked') return `<div class="mrow locked">${inner}</div>`;
    return `<a class="mrow ${st}" href="${base}m/${m.slug}/">${inner}</a>`;
  }

  function ladderStrip(data, p) {
    return LEVELS.map((lvl) => {
      const st = levelState(data, p, lvl);
      const n = modsOfLevel(data, lvl).length;
      const node = st === 'done' ? ICON.check : st === 'current' ? ICON.play : ICON.lock;
      const d = st === 'done' ? 'Complete'
        : st === 'current' ? (lvl === 'FOUNDATION' ? `Open · ${n} modules` : `Open · ${n} module${n === 1 ? '' : 's'}`)
        : `Locked · ${n} module${n === 1 ? '' : 's'}`;
      return `<div class="rung ${st}"><span class="node">${node}</span><span class="t">${titleCase(lvl)}</span><span class="d">${d}</span></div>`;
    }).join('');
  }

  function continueCard(data, p, base) {
    const t = continueTarget(data, p);
    if (!t) {
      /* every module passed — honest summit */
      return `<section class="panel pad">
        <span class="label">Continue learning</span>
        <h2 class="h2" style="margin-top:12px">Every module is passed.</h2>
        <p class="mut sm" style="margin-top:4px">The library is complete under your hand. The certificates are yours to send.</p>
      </section>`;
    }
    const m = t.mod;
    if (t.kind === 'continue') {
      const inReview = !!p.review[m.id];
      return `<section class="panel pad">
        <div class="between">
          <span class="label">Continue learning</span>
          <span class="pill ${inReview ? 'warn' : 'teal'}">${inReview ? ICON.refresh + ' One more pass' : ICON.play + ' In progress'}</span>
        </div>
        <h2 class="h2" style="margin-top:12px">${esc(m.t)}</h2>
        ${m.mm && m.tm ? `<p class="sm mm mut" style="margin-top:4px">${esc(m.tm)}</p>` : ''}
        <p class="mut sm" style="margin-top:4px">${esc(m.cat)} · ${titleCase(m.lvl)} level · <span class="num">${m.dur} min</span></p>
        <p class="sm dim" style="margin-top:14px">${inReview
          ? 'The mastery check sent you back to the teaching. It is not a penalty — it is the method.'
          : 'You started this one. The teaching and its mastery check are waiting where you left them.'}</p>
        <div class="row" style="margin-top:16px;justify-content:flex-end">
          <a class="btn primary" href="${base}m/${m.slug}/">${inReview ? 'Review and retry' : 'Continue'} ${ICON.arrowR}</a>
        </div>
      </section>`;
    }
    /* begin state — a suggestion, never a score */
    return `<section class="panel pad">
      <div class="between">
        <span class="label">Begin here</span>
        ${t.mmFirst ? `<span class="pill gold">${ICON.globe} Reads fully in Myanmar</span>` : ''}
      </div>
      <h2 class="h2" style="margin-top:12px">${esc(m.t)}</h2>
      ${m.mm && m.tm ? `<p class="sm mm mut" style="margin-top:4px">${esc(m.tm)}</p>` : ''}
      <p class="mut sm" style="margin-top:4px">${esc(m.cat)}${m.cat === 'Recruitment' ? ' · the Recruiter Pathway' : ''} · ${titleCase(m.lvl)} level · <span class="num">${m.dur} min</span> · <span class="num">${m.q} question${m.q === 1 ? '' : 's'}</span> at the gate</p>
      <p class="sm dim" style="margin-top:14px">A first step, not a test. Any open module on this page is a good beginning — this one simply reads in your language.</p>
      <div class="row" style="margin-top:16px;justify-content:flex-end">
        <a class="btn primary" href="${base}m/${m.slug}/">Start reading ${ICON.arrowR}</a>
      </div>
    </section>`;
  }

  function attentionList(data, p, base) {
    const items = [];
    Object.keys(p.review).forEach((id) => {
      if (p.passed[id]) return;
      const m = data.modules.find((x) => x.id === id);
      if (!m) return;
      items.push({ icon: 'refresh', kind: 'warn', href: `${base}m/${m.slug}/`,
        title: 'One more pass',
        sub: `${m.t} — the mastery check routed you back to the teaching. It is waiting when you are.`,
        act: 'Review' });
    });
    Object.keys(p.passed).forEach((id) => {
      if (p.certPdf[id]) return;
      const m = data.modules.find((x) => x.id === id);
      if (!m) return;
      items.push({ icon: 'award', kind: 'gold', href: `${base}m/${m.slug}/#certificate`,
        title: 'Your certificate is ready',
        sub: `${m.t} — passed. Open the PDF, send it anywhere.`,
        act: 'Open' });
    });
    if (!items.length) {
      return `<div class="attn">
        <span class="icobox teal">${ICON.checkC}</span>
        <span><span class="t">Nothing is waiting on you.</span>
        <span class="s" style="display:block">When a mastery check needs another pass — or a certificate is ready to send — it appears here first.</span></span>
      </div>`;
    }
    return items.map((a) => `
      <div class="attn">
        <span class="icobox ${a.kind}">${ICON[a.icon]}</span>
        <span><span class="t">${a.title}</span><span class="s" style="display:block">${a.sub}</span></span>
        <span class="act"><a class="btn ghost sm" href="${a.href}" style="padding:6px 12px">${a.act} ${ICON.arrowR}</a></span>
      </div>`).join('');
  }

  function mmHeroBand(data, p, base) {
    const cats = mmCompleteCategories(data);
    if (!cats.length) return '';
    return cats.map((c) => {
      const mods = data.modules.filter((m) => m.cat === c).sort((a, b) => a.ord - b.ord);
      const cp = categoryProgress(data, p, c);
      return `<section class="mmband-hero">
        <div class="between" style="flex-wrap:wrap">
          <div>
            <span class="label" style="color:var(--gold)">In your language</span>
            <h2 class="h2" style="margin-top:8px">${esc(c)}${c === 'Recruitment' ? ' — the Recruiter Pathway' : ''}</h2>
            <p class="mut sm" style="margin-top:4px">Every module here reads fully in Myanmar — today. <span class="num">${cp.done} of ${cp.total}</span> passed by you.</p>
          </div>
          <span class="pill gold">${ICON.globe} ${mods.length} of ${mods.length} in Myanmar</span>
        </div>
        <div style="margin-top:14px">${mods.map((m) => moduleRow(data, p, m, base)).join('')}</div>
      </section>`;
    }).join('');
  }

  function categoryGrid(data, p, base) {
    const cats = {};
    data.modules.forEach((m) => { (cats[m.cat] = cats[m.cat] || []).push(m); });
    const mmFull = mmCompleteCategories(data);
    const names = Object.keys(cats).sort((a, b) => cats[b].length - cats[a].length || a.localeCompare(b));
    return names.map((c) => {
      const cp = categoryProgress(data, p, c);
      const full = mmFull.includes(c);
      const pct = cp.total ? Math.round((cp.done / cp.total) * 100) : 0;
      return `<a class="catcard ${full ? 'mmfull' : ''}" href="${base}#cat-${encodeURIComponent(c)}">
        <span class="cn">${esc(c)}</span>
        <span class="cc" style="display:block"><span class="num">${cp.total}</span> modules${c === 'Recruitment' ? ' · Recruiter Pathway' : ''}</span>
        <span class="track ${full ? 'gold' : ''}" style="display:block"><i style="width:${pct}%"></i></span>
        <span class="cp" style="display:block">${cp.done} of ${cp.total} passed</span>
        ${full ? `<span class="mmband">${ICON.globe} Myanmar-complete</span>` : ''}
      </a>`;
    }).join('');
  }

  function categorySections(data, p, base) {
    const cats = {};
    data.modules.forEach((m) => { (cats[m.cat] = cats[m.cat] || []).push(m); });
    const names = Object.keys(cats).sort((a, b) => cats[b].length - cats[a].length || a.localeCompare(b));
    return names.map((c) => {
      const mods = cats[c].slice().sort((a, b) => a.ord - b.ord);
      const cp = categoryProgress(data, p, c);
      return `<section class="catsec" id="cat-${encodeURIComponent(c)}">
        <div class="catsec-head">
          <span class="cn">${esc(c)}</span>
          <span class="cx">${c === 'Recruitment' ? 'The Recruiter Pathway — four modules, ending in certification' : ''}</span>
          <span class="ccount"><span class="num">${cp.done}/${cp.total}</span> passed</span>
        </div>
        ${mods.map((m) => moduleRow(data, p, m, base)).join('')}
      </section>`;
    }).join('');
  }

  function proofChain() {
    const steps = [
      ['book', 'Module'], ['checkC', 'Mastery check'], ['award', 'Certificate'], ['download', 'PDF'], ['share', "An employer's hands"],
    ];
    return `<div class="proofchain">${steps.map(([ic, t]) =>
      `<div class="pstep"><span class="n">${ICON[ic]}</span><span class="t">${t}</span></div>`).join('')}</div>`;
  }

  function roadsTeaser(data, p, base) {
    const fams = data.fams || [];
    const rows = fams.map((f) => {
      const mapped = data.modules.filter((m) => m.fam === f.name && m.flvl);
      const done = mapped.filter((m) => p.passed[m.id]).length;
      return `<a class="mrow" href="${base}roads/#fam-${encodeURIComponent(f.name)}">
        <span class="mi">${ICON[FAMILY_ICON[f.name]] || ICON.compass}</span>
        <span class="mt">
          <span class="t">${esc(f.name)}</span>
          <span class="s" style="display:block">${f.stages} stages · ${mapped.length ? `${done} of ${mapped.length} modules passed` : 'map complete · teaching modules arrive as written'}</span>
        </span>
        <span class="chev">${ICON.chevR}</span>
      </a>`;
    }).join('');
    return rows;
  }

  /* ---------- shell ---------- */
  function topbar(base, on) {
    const link = (href, key, ic, label) =>
      `<a href="${href}" class="${on === key ? 'on' : ''}">${ICON[ic]}<span>${label}</span></a>`;
    return `<header class="topbar">
      <div class="topbar-in">
        <a class="wordmark" href="${base}">
          <span class="mark">R</span>
          <span>ReferTRM</span>
          <span class="sub">Academy</span>
        </a>
        <nav class="topnav">
          ${link(base, 'home', 'home', 'Home')}
          ${link(base + '#library', 'library', 'book', 'Library')}
          ${link(base + 'roads/', 'roads', 'map', 'Roads')}
        </nav>
        <div class="spacer"></div>
        <button class="themebtn" id="themebtn" aria-label="Switch theme"></button>
      </div>
    </header>`;
  }

  function footer() {
    return `<footer class="demo-foot">
      <span>ReferTRM · Talent Resources Myanmar Co., Ltd.</span><span class="dot"></span>
      <span>Free — the front door of ReferTRM</span><span class="dot"></span>
      <span>Your progress is stored only on this device</span>
    </footer>`;
  }

  return {
    ICON, FAMILY_ICON, LEVELS, PATHWAY_SLUGS, M4_SLUG, STORE_KEY,
    esc, titleCase,
    emptyProgress, loadProgress, saveProgress,
    modsOfLevel, levelComplete, levelUnlocked, levelState, moduleLocked, moduleState,
    mmCompleteCategories, categoryProgress, continueTarget,
    mmk, moduleRow, ladderStrip, continueCard, attentionList, mmHeroBand,
    categoryGrid, categorySections, proofChain, roadsTeaser, topbar, footer,
  };
});

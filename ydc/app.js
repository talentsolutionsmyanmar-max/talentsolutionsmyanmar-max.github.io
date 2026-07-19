/* ============================================================
   YDC — Youth Development Center · demo surface
   No framework. No build step. No network requests.
   All learner data is INVENTED, seeded via PRNG (seed 20260719).
   English-only UI. Myanmar string placements are F50/CCO.
   ============================================================ */
'use strict';

/* ---------- seeded PRNG (mulberry32) — same pattern as portal, new seed ---------- */
function mulberry32(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260719);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];

/* ---------- data model (invented — zero real learner data) ----------
   Ladder canon (SEALED S282): Foundation → Working → Professional → Advanced
   Exactly 4 tiers. No invented tiers. Tier displays ALONE — never
   paired with age or numeric score (dignity guard, HA spec).      */

const LEARNER = {
  firstName: 'Nanda',            // invented
  fullName: 'Nanda Lin',         // invented
  tierId: 'working',
  mentor: 'M. Thiri',            // invented mentor label
};

const TIERS = [
  { id:'foundation',   name:'Foundation',   n:1, status:'done',
    summary:'Core study skills and subject foundations.',
    topics:[] },
  { id:'working',      name:'Working',      n:2, status:'current',
    summary:'Applied skills: reading, writing, lab method, presentation.',
    topics:[] },
  { id:'professional', name:'Professional', n:3, status:'locked',
    summary:'Independent project work and specialist subject tracks.',
    topics:['Research Methods','Advanced Composition','Data Analysis','Subject Specialisation','Mentored Project'] },
  { id:'advanced',     name:'Advanced',     n:4, status:'locked',
    summary:'Mastery portfolio and community leadership.',
    topics:['Portfolio Capstone','Peer Teaching','Community Leadership'] },
];

/* module shape mirrors YDC Foundation: 10 modules per foundation tier */
const MODULES = {
  foundation: [
    { id:'f-1',  title:'Orientation: How YDC Works' },
    { id:'f-2',  title:'Study Habits & Note-Taking' },
    { id:'f-3',  title:'Scientific Reading I' },
    { id:'f-4',  title:'Everyday English I' },
    { id:'f-5',  title:'Numbers & Data Basics' },
    { id:'f-6',  title:'Biology Foundations: Cells' },
    { id:'f-7',  title:'Chemistry Foundations: Matter' },
    { id:'f-8',  title:'Physics Foundations: Motion' },
    { id:'f-9',  title:'Digital Literacy & Safety' },
    { id:'f-10', title:'Capstone: My Learning Plan' },
  ],
  working: [
    { id:'w-1',  title:'Scientific Reading II' },
    { id:'w-2',  title:'Everyday English II' },
    { id:'w-3',  title:'Lab Methods & Safety' },
    { id:'w-4',  title:'Writing Clear Reports' },
    { id:'w-5',  title:'Biology: Ecosystems' },
    { id:'w-6',  title:'Chemistry: Reactions' },
    { id:'w-7',  title:'Physics: Energy' },
    { id:'w-8',  title:'Presentation Skills' },
    { id:'w-9',  title:'Research Basics' },
    { id:'w-10', title:'Capstone: Community Project' },
  ],
};

/* learner progress state (invented) */
const PROGRESS = {
  foundation: { done: 10, total: 10 },     // complete → promoted
  working:    { done: 3,  total: 10, active: 'w-4' },
};

const LESSONS = {
  'w-4': [
    { n:1, title:'Structuring a Report',      state:'done',    dur:25 },
    { n:2, title:'Evidence & Sources',        state:'done',    dur:30 },
    { n:3, title:'Clear Sentences',           state:'done',    dur:20 },
    { n:4, title:'Data Tables & Figures',     state:'current', dur:35 },
    { n:5, title:'Peer Review Practice',      state:'todo',    dur:30 },
    { n:6, title:'Final Draft & Submission',  state:'todo',    dur:40 },
  ],
};

const ATTENTION = [
  { icon:'fileText', kind:'warn',
    title:'Practice task returned',
    sub:'Mentor feedback is ready on your Lesson 3 draft summary.' },
  { icon:'clock', kind:'warn',
    title:'Capstone proposal not started',
    sub:'W-10 opens soon — outline your community project idea.' },
];

/* module durations — seeded, stable across reloads */
const MOD_META = {};
Object.values(MODULES).flat().forEach(m => {
  MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 4) };   // 4–7 lessons
});
MOD_META['w-4'].lessons = 6;   // matches authored LESSONS['w-4']

/* module row state resolver */
function moduleState(tierId, idx){
  if(tierId === 'foundation') return 'done';
  if(tierId === 'working'){
    if(idx < PROGRESS.working.done) return 'done';
    if(MODULES.working[idx].id === PROGRESS.working.active) return 'active';
    return 'upcoming';
  }
  return 'locked';
}

/* ---------- icons (inline SVG, Lucide geometry) ---------- */
const I = (paths, size) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${size?` width="${size}" height="${size}"`:''}>${paths}</svg>`;

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
  alert:     I('<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>'),
  fileText:  I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>'),
  shield:    I('<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
  flag:      I('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>'),
  play:      I('<polygon points="6 3 20 12 6 21 6 3"/>'),
};

/* ---------- shell ---------- */
function themeToggle(){
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try{ localStorage.setItem('ydc-theme', next); }catch(e){}
  renderThemeBtn();
}
function renderThemeBtn(){
  const b = document.getElementById('themebtn');
  if(!b) return;
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  b.innerHTML = dark ? ICON.sun : ICON.moon;
  b.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
}

function shell(content, route){
  return `
  <header class="topbar">
    <div class="topbar-in">
      <a class="wordmark" href="#/">
        <span class="mark">Y</span>
        <span>Youth Development Center</span>
        <span class="sub">Learner</span>
      </a>
      <nav class="topnav">
        <a href="#/" class="${route==='home'?'on':''}">${ICON.home}<span>Home</span></a>
        <a href="#/roadmap" class="${route==='roadmap'?'on':''}">${ICON.map}<span>Roadmap</span></a>
      </nav>
      <div class="spacer"></div>
      <button class="themebtn" id="themebtn" onclick="themeToggle()"></button>
    </div>
  </header>
  ${content}
  <footer class="demo-foot">
    <span>Design demo — isolated host</span><span class="dot"></span>
    <span>Seeded invented data, zero real learner records</span><span class="dot"></span>
    <span>Promotion flow designed, not wired to production</span>
  </footer>`;
}

/* ---------- shared fragments ---------- */
function tierBadge(tier){
  /* dignity guard: tier name ALONE in the badge — no age, no score */
  return `<span class="pill gold">${ICON.grad} ${tier.name} tier</span>`;
}

function moduleRow(tierId, m, idx){
  const st = moduleState(tierId, idx);
  const meta = MOD_META[m.id];
  const inner = `
    <span class="mi">${st==='done' ? ICON.check : st==='locked'||st==='upcoming' ? (st==='locked'?ICON.lock:String(idx+1)) : ICON.play}</span>
    <span class="mt">
      <span class="t">${m.title}</span>
      <span class="s" style="display:block">${
        st==='done'    ? 'Completed' :
        st==='active'  ? `In progress · ${meta.lessons} lessons` :
        st==='upcoming'? `${meta.lessons} lessons` :
                         'Locked'
      }</span>
    </span>
    ${st==='active' ? `<span class="pill teal">Current</span>` : ''}
    ${st==='locked' ? '' : `<span class="chev">${ICON.chevR}</span>`}`;
  if(st==='locked') return `<div class="mrow locked">${inner}</div>`;
  return `<a class="mrow ${st}" href="#/module/${m.id}">${inner}</a>`;
}

/* ---------- screen 1 · learner home ---------- */
function viewHome(){
  const tier = TIERS.find(t=>t.id===LEARNER.tierId);
  const mod = MODULES.working.find(m=>m.id===PROGRESS.working.active);
  const lessons = LESSONS[mod.id];
  const cur = lessons.find(l=>l.state==='current');
  const doneCount = lessons.filter(l=>l.state==='done').length;

  const ladder = TIERS.map(t=>{
    const cls = t.status==='done' ? 'done' : t.status==='current' ? 'current' : 'locked';
    const node = t.status==='done' ? ICON.check : t.status==='current' ? ICON.play : ICON.lock;
    const d = t.status==='done' ? 'Complete' : t.status==='current' ? 'In progress' : 'Locked';
    return `<div class="rung ${cls}"><span class="node">${node}</span><span class="t">${t.name}</span><span class="d">${d}</span></div>`;
  }).join('');

  const attn = ATTENTION.map(a=>`
    <div class="attn">
      <span class="icobox ${a.kind}">${ICON[a.icon]}</span>
      <span><span class="t">${a.title}</span><span class="s" style="display:block">${a.sub}</span></span>
      <span class="act"><a class="btn ghost sm" href="#/module/w-4" style="padding:6px 12px">Review ${ICON.arrowR}</a></span>
    </div>`).join('');

  const content = `
  <main class="page">
    <div class="between" style="align-items:flex-end;flex-wrap:wrap">
      <div>
        <div class="label">Learner home</div>
        <h1 class="h1" style="margin-top:6px">Good evening, ${LEARNER.firstName}.</h1>
      </div>
      ${tierBadge(tier)}
    </div>

    <div class="panel pad" style="margin-top:20px">
      <div class="between">
        <span class="label">Your ladder</span>
        <a class="sm mut row" href="#/roadmap" style="gap:6px">Full roadmap ${ICON.chevR}</a>
      </div>
      <div class="ladder" style="margin-top:18px">${ladder}</div>
    </div>

    <div class="grid2" style="margin-top:20px">
      <div class="stack16">
        <section class="panel pad">
          <div class="between">
            <span class="label">Continue learning</span>
            <span class="pill teal">${ICON.play} In progress</span>
          </div>
          <h2 class="h2" style="margin-top:12px">${mod.title}</h2>
          <p class="mut sm" style="margin-top:4px">Working tier · Module 4 · ${doneCount} of ${lessons.length} lessons complete</p>
          <div class="track" style="margin-top:14px"><i style="width:${Math.round(doneCount/lessons.length*100)}%"></i></div>
          <div class="row" style="margin-top:16px;justify-content:space-between;flex-wrap:wrap">
            <span class="sm dim">Next: Lesson ${cur.n} — ${cur.title} · <span class="num">${cur.dur} min</span></span>
            <a class="btn primary" href="#/module/${mod.id}">Continue lesson ${ICON.arrowR}</a>
          </div>
        </section>

        <section>
          <div class="label" style="margin-bottom:10px">Needs your attention</div>
          ${attn}
        </section>
      </div>

      <aside class="stack16">
        <section class="panel pad">
          <span class="label">Up next</span>
          <div class="stack12" style="margin-top:12px">
            ${MODULES.working.slice(4,6).map((m,i)=>`
              <div class="row" style="gap:12px">
                <span class="icobox">${ICON.book}</span>
                <span><span class="sm" style="font-weight:600;display:block">${m.title}</span>
                <span class="sm dim">${MOD_META[m.id].lessons} lessons</span></span>
              </div>`).join('')}
          </div>
        </section>
        <section class="panel pad">
          <span class="label">Mentor</span>
          <div class="row" style="margin-top:12px;gap:12px">
            <span class="icobox teal">${ICON.shield}</span>
            <span><span class="sm" style="font-weight:600;display:block">${LEARNER.mentor}</span>
            <span class="sm dim">Reviews within 2 working days</span></span>
          </div>
        </section>
        <section class="panel pad" style="border-color:color-mix(in srgb, var(--gold) 35%, transparent)">
          <span class="label" style="color:var(--gold)">Mastery gate</span>
          <p class="sm mut" style="margin-top:8px">Complete all Working modules to open the Professional gate review.</p>
          <a class="btn ghost sm" href="#/promotion" style="margin-top:12px;padding:6px 0">Preview a promotion ${ICON.chevR}</a>
        </section>
      </aside>
    </div>
  </main>`;
  return shell(content, 'home');
}

/* ---------- screen 2 · roadmap / ladder ---------- */
function viewRoadmap(){
  const tiers = TIERS.map(t=>{
    const cls = t.status==='done' ? 'done' : t.status==='current' ? 'current' : 'locked';
    const statePill = t.status==='done'
      ? `<span class="pill teal">${ICON.check} Complete</span>`
      : t.status==='current'
        ? `<span class="pill gold">Current tier</span>`
        : `<span class="pill dim">${ICON.lock} Locked</span>`;

    let body = '';
    if(t.status === 'locked'){
      /* honest empty state — Q3 discipline */
      const gate = TIERS[t.n-2].name;
      body = `<div class="tier-body">
        <div class="locked-state">
          <span class="icobox">${ICON.lock}</span>
          <div class="txt">
            <div class="t">This tier is not open yet</div>
            <div class="s">Complete the ${gate} tier to unlock ${t.name}. Your mentor reviews every gate — nothing unlocks early, nothing is skipped.</div>
            <div class="topic-preview">${t.topics.map(x=>`<span>${x}</span>`).join('')}</div>
          </div>
        </div>
      </div>`;
    } else {
      const mods = MODULES[t.id];
      const done = mods.filter((m,i)=>moduleState(t.id,i)==='done').length;
      body = `<div class="tier-body">
        <div class="between" style="margin-bottom:12px">
          <span class="sm dim num">${done} of ${mods.length} modules complete</span>
          <div class="track ${t.status==='done'?'gold':''}" style="width:140px"><i style="width:${Math.round(done/mods.length*100)}%"></i></div>
        </div>
        ${mods.map((m,i)=>moduleRow(t.id, m, i)).join('')}
      </div>`;
    }

    return `<section class="panel tier ${cls}">
      <div class="tier-head">
        <span class="num-badge">${String(t.n).padStart(2,'0')}</span>
        <div style="flex:1;min-width:0">
          <div class="h2">${t.name}</div>
          <div class="sm dim" style="margin-top:2px">${t.summary}</div>
        </div>
        ${statePill}
      </div>
      ${body}
    </section>`;
  }).join('');

  const content = `
  <main class="page" style="max-width:860px">
    <div class="label">Roadmap</div>
    <h1 class="h1" style="margin-top:6px">The ladder</h1>
    <p class="mut" style="margin-top:6px;max-width:60ch">Four tiers. Every tier ends with a mastery gate reviewed by your mentor. The ladder is the progress — there is nothing else to chase.</p>
    <div class="stack16" style="margin-top:24px">${tiers}</div>
  </main>`;
  return shell(content, 'roadmap');
}

/* ---------- screen 3 · module detail ---------- */
const LESSON_BANK = [
  'Guided Reading','Core Concepts','Worked Examples','Practice Task',
  'Discussion Prep','Applied Exercise','Review & Reflection','Mastery Check',
];
function lessonsFor(modId, state){
  if(LESSONS[modId]) return LESSONS[modId];
  /* procedural, stable per module — seeded PRNG, not random per render */
  const seed = modId.split('').reduce((a,c)=>a + c.charCodeAt(0)*7, 13);
  const r = mulberry32(seed);
  const n = MOD_META[modId].lessons;
  const used = new Set();
  return Array.from({length:n}, (_,i)=>{
    let t; do { t = LESSON_BANK[Math.floor(r()*LESSON_BANK.length)]; } while(used.has(t));
    used.add(t);
    return {
      n:i+1, title:t,
      state: state==='done' ? 'done' : 'todo',
      dur: 15 + Math.floor(r()*6)*5,
    };
  });
}

function viewModule(modId){
  const tierId = modId.startsWith('f-') ? 'foundation' : 'working';
  const tier = TIERS.find(t=>t.id===tierId);
  const idx = MODULES[tierId].findIndex(m=>m.id===modId);
  const mod = MODULES[tierId][idx];
  if(!mod) return viewRoadmap();
  const st = moduleState(tierId, idx);
  const lessons = lessonsFor(modId, st);
  const done = lessons.filter(l=>l.state==='done').length;
  const nextMod = MODULES[tierId][idx+1];

  const lessonRows = lessons.map(l=>`
    <div class="lesson ${l.state}">
      <span class="li">${l.state==='done' ? ICON.check : l.state==='current' ? ICON.play : `<span style="width:4px;height:4px;border-radius:50%;background:var(--dim)"></span>`}</span>
      <span class="lt">
        <span class="t">Lesson ${l.n} — ${l.title}</span>
        ${l.state==='current' ? '<span class="s" style="display:block">You are here</span>' : ''}
      </span>
      <span class="dur num">${l.dur} min</span>
    </div>`).join('');

  const statusPill = st==='done'
    ? `<span class="pill teal">${ICON.check} Completed</span>`
    : st==='active' ? `<span class="pill teal">${ICON.play} In progress</span>`
    : `<span class="pill dim">Not started</span>`;

  const cta = st==='active'
    ? `<a class="btn primary" href="#/module/${modId}">Continue lesson ${lessons.find(l=>l.state==='current').n} ${ICON.arrowR}</a>`
    : st==='done'
    ? `<a class="btn ghost" href="#/roadmap">Back to roadmap</a>`
    : `<a class="btn" href="#/module/${modId}">Start module ${ICON.arrowR}</a>`;

  const content = `
  <main class="page" style="max-width:980px">
    <a class="sm dim row" href="#/roadmap" style="gap:6px">${ICON.map} Roadmap <span style="opacity:.5">/</span> ${tier.name}</a>
    <div class="between" style="margin-top:12px;align-items:flex-end;flex-wrap:wrap">
      <div>
        <span class="label">Module ${String(idx+1).padStart(2,'0')} · ${tier.name} tier</span>
        <h1 class="h1" style="margin-top:6px">${mod.title}</h1>
      </div>
      ${statusPill}
    </div>

    <div class="grid2" style="margin-top:22px">
      <section class="panel">
        <div class="pad between" style="border-bottom:1px solid var(--line)">
          <span class="label">Lessons</span>
          <span class="sm dim num">${done} of ${lessons.length} complete</span>
        </div>
        <div style="padding:8px 10px">${lessonRows}</div>
      </section>

      <aside class="stack16">
        <section class="panel pad">
          <span class="label">Next action</span>
          <p class="sm mut" style="margin-top:10px">${
            st==='active' ? `Lesson ${lessons.find(l=>l.state==='current').n} — ${lessons.find(l=>l.state==='current').title}. About ${lessons.find(l=>l.state==='current').dur} minutes.` :
            st==='done'   ? 'This module is complete and verified by your mentor.' :
                            `Lesson 1 — ${lessons[0].title}. About ${lessons[0].dur} minutes.`
          }</p>
          <div style="margin-top:14px">${cta}</div>
        </section>

        <section class="panel pad">
          <span class="label">What unlocks next</span>
          <div class="row" style="margin-top:12px;gap:12px">
            <span class="icobox">${nextMod ? ICON.book : ICON.flag}</span>
            <span><span class="sm" style="font-weight:600;display:block">${nextMod ? nextMod.title : 'Tier mastery gate'}</span>
            <span class="sm dim">${nextMod ? `Module ${idx+2} · ${tier.name} tier` : `Completing this tier opens the ${TIERS.find(t=>t.n===tier.n+1)?.name ?? 'final'} gate review`}</span></span>
          </div>
          <div class="track" style="margin-top:14px"><i style="width:${Math.round(done/lessons.length*100)}%"></i></div>
          <p class="sm dim" style="margin-top:8px">Finish all lessons to open ${nextMod ? 'the next module' : 'the gate review'}.</p>
        </section>
      </aside>
    </div>
  </main>`;
  return shell(content, 'roadmap');
}

/* ---------- screen 4 · promotion moment ---------- */
function viewPromotion(){
  /* dignity guard: the tier pill stands ALONE.
     No age. No numeric score adjacent to the tier. */
  const content = `
  <main class="promo-wrap">
    <div class="promo">
      <div class="prestige">${ICON.grad}</div>
      <div class="kicker label" style="color:var(--gold)">Mastery gate passed</div>
      <div class="tier-pill">Working</div>
      <p class="quiet">Your Foundation work is complete and verified. You have been promoted — every module reviewed, nothing skipped.</p>
      <div class="verify">${ICON.shield} Verified by ${LEARNER.mentor}, your mentor</div>
      <div class="ctas">
        <a class="btn gold" href="#/roadmap">See the roadmap ${ICON.arrowR}</a>
        <a class="btn ghost" href="#/">Back home</a>
      </div>
    </div>
  </main>`;
  return shell(content, 'promo');
}

/* ---------- router ---------- */
function route(){
  const h = location.hash.replace(/^#\/?/, '');
  const app = document.getElementById('app');
  let html, r = 'home';
  if(h.startsWith('module/')){ html = viewModule(h.split('/')[1]); r='roadmap'; }
  else if(h === 'roadmap'){ html = viewRoadmap(); r='roadmap'; }
  else if(h === 'promotion'){ html = viewPromotion(); r='promo'; }
  else { html = viewHome(); r='home'; }
  app.innerHTML = html;
  renderThemeBtn();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);
route();

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

/* ---------- school band (R3-A, KoKo ruling) ----------
   type SchoolBand = 'basic' | 'middle' | 'high' | 'out_of_school'
   Self-declared at enrollment. NO birthdate field anywhere, ever.
   Band is a SETTING (content register + career gating); tier is the
   ACHIEVEMENT. The two never render adjacent — display law.        */
const BANDS = {
  basic:         'Basic school',
  middle:        'Middle school',
  high:          'High school',
  out_of_school: 'Out of school',
};
function getBand(){
  try{ return localStorage.getItem('ydc-band') || 'high'; }catch(e){ return 'high'; }
}
function setBand(v){
  try{ localStorage.setItem('ydc-band', v); }catch(e){}
  route();
}
/* content register shifts per band — all copy English, CCO-flagged */
const REGISTER = {
  basic: {
    greet: ()=>`Hello, ${LEARNER.firstName}. Let's learn today.`,
    roadIntro: 'Four steps. Five subjects. Finish one step to open the next. Your mentor checks every step.',
  },
  middle: {
    greet: ()=>`Good evening, ${LEARNER.firstName}.`,
    roadIntro: 'Four tiers, five majors. Finish a tier and your mentor opens the next gate.',
  },
  high: {
    greet: ()=>`Good evening, ${LEARNER.firstName}.`,
    roadIntro: 'Four tiers, five majors. Every tier ends with a mastery gate reviewed by your mentor. The ladder is the progress — there is nothing else to chase.',
  },
  out_of_school: {
    greet: ()=>`Good evening, ${LEARNER.firstName}.`,
    roadIntro: 'Four tiers, five majors. Every tier ends with a mastery gate reviewed by your mentor. The ladder is the progress — there is nothing else to chase.',
  },
};
function registerFor(band){ return REGISTER[band] || REGISTER.high; }

const TIERS = [
  { id:'foundation',   name:'Foundation',   n:1, status:'done',
    summary:'Core study skills and subject foundations.',
    topicsByMajor:[] },
  { id:'working',      name:'Working',      n:2, status:'current',
    summary:'Applied skills: reading, writing, lab method, presentation.',
    topicsByMajor:[] },
  { id:'professional', name:'Professional', n:3, status:'locked',
    summary:'Independent project work and specialist subject tracks.',
    topicsByMajor:[
      ['english',['Advanced Composition','Live Client Calls']],
      ['math',['Data Analysis']],
      ['physics',['Specialist Track']],
      ['chemistry',['Specialist Track']],
      ['biology',['Research Methods','Mentored Project']],
    ] },
  { id:'advanced',     name:'Advanced',     n:4, status:'locked',
    summary:'Mastery portfolio and community leadership.',
    topicsByMajor:[
      ['english',['Peer Teaching']],
      ['math',['Portfolio Capstone']],
      ['biology',['Community Leadership']],
    ] },
];

/* ---------- five majors (SEALED R3) — reasoning trainers, not warehouses ---------- */
const MAJORS = {
  english:   { name:'English',   cap:'Live communication — speaking, listening, being trusted in the room' },
  math:      { name:'Math',      cap:'Formal reasoning' },
  physics:   { name:'Physics',   cap:'Causal reasoning' },
  chemistry: { name:'Chemistry', cap:'Process reasoning' },
  biology:   { name:'Biology',   cap:'Systems reasoning' },
};
const MAJOR_ORDER = ['english','math','physics','chemistry','biology'];

/* language policy per tier (design indicator — CCO authors the language later) */
function langChip(tierId){
  const mm = tierId === 'foundation' || tierId === 'working';
  return `<span class="pill lang">${ICON.msgSquare} ${mm ? 'MM-first · AI-translated · CCO-gated' : 'English-medium'}</span>`;
}

/* Foundation mirrors the real 10-module science shape (Bio 6 / Chem 2 / Phys 2);
   English + Math rails are seeded invented SHAPES — structure, not data. */
const MODULES = {
  foundation: [
    { id:'f-1',  title:'Cells: The Smallest Units of Life',        major:'biology' },
    { id:'f-2',  title:'Plants & Photosynthesis',                  major:'biology' },
    { id:'f-3',  title:'The Human Body',                           major:'biology' },
    { id:'f-4',  title:'Ecosystems & Food Webs',                   major:'biology' },
    { id:'f-5',  title:'Genetics: What You Inherit',               major:'biology' },
    { id:'f-6',  title:'Capstone: The Living World',               major:'biology' },
    { id:'f-7',  title:'Chemistry Foundations: Matter',            major:'chemistry' },
    { id:'f-8',  title:'Chemistry Foundations: Mixing & Reactions',major:'chemistry' },
    { id:'f-9',  title:'Physics Foundations: Motion',              major:'physics' },
    { id:'f-10', title:'Physics Foundations: Forces Around You',   major:'physics' },
    { id:'f-11', title:'Everyday English: First Words in the Room',major:'english' },
    { id:'f-12', title:'Read Aloud: Sounds & Sentences',           major:'english' },
    { id:'f-13', title:'Numbers & Data Basics',                    major:'math' },
    { id:'f-14', title:'Shapes, Patterns & Logic',                 major:'math' },
  ],
  working: [
    { id:'w-1',  title:'Everyday English II',        major:'english' },
    { id:'w-2',  title:'Scientific Reading II',      major:'english' },
    { id:'w-3',  title:'Lab Methods & Safety',       major:'chemistry' },
    { id:'w-4',  title:'Writing Clear Reports',      major:'english' },
    { id:'w-5',  title:'Biology: Ecosystems',        major:'biology' },
    { id:'w-6',  title:'Chemistry: Reactions',       major:'chemistry' },
    { id:'w-7',  title:'Physics: Energy',            major:'physics' },
    { id:'w-8',  title:'Presentation Skills',        major:'english' },
    { id:'w-9',  title:'Data, Evidence & Estimation',major:'math' },
    { id:'w-10', title:'Capstone: Community Project',major:'biology' },
  ],
};

/* learner progress state (invented) */
const PROGRESS = {
  foundation: { done: 14, total: 14 },    // complete → promoted
  working:    { done: 3,  total: 10, active: 'w-4' },
};

/* ---------- R4 — band = world, not label ----------
   Per-band module libraries: same 4-tier ladder canon, different contents.
   Basic = simpler titles, 3–4-lesson modules, picture-first types.
   Middle = intermediate. High / out-of-school = the current library.
   Five majors canon unchanged in every world. Invented shapes — real
   band libraries are HA/CCO curriculum work (demo shows the shape).   */
const BAND_MODULES = {
  basic: {
    foundation: [
      { id:'b-f-1', title:'Plants Around Us',              major:'biology' },
      { id:'b-f-2', title:'Animals Near Home',             major:'biology' },
      { id:'b-f-3', title:'My Body Works',                 major:'biology' },
      { id:'b-f-4', title:'Water, Air & Mixing',           major:'chemistry' },
      { id:'b-f-5', title:'Things That Move',              major:'physics' },
      { id:'b-f-6', title:'Words for My Day',              major:'english' },
      { id:'b-f-7', title:'Listen & Say It',               major:'english' },
      { id:'b-f-8', title:'Counting & Shapes',             major:'math' },
    ],
    working: [
      { id:'b-w-1', title:'Talk About Your Day',           major:'english' },
      { id:'b-w-2', title:'Draw & Tell: A Plant You Found',major:'biology' },
      { id:'b-w-3', title:'Measure It',                    major:'math' },
      { id:'b-w-4', title:'Mix & Watch',                   major:'chemistry' },
      { id:'b-w-5', title:'Push, Pull, Roll',              major:'physics' },
      { id:'b-w-6', title:'Capstone: My Nature Project',   major:'biology' },
    ],
  },
  middle: {
    foundation: [
      { id:'m-f-1', title:'Cells: Tiny Building Blocks',   major:'biology' },
      { id:'m-f-2', title:'How Plants Make Food',          major:'biology' },
      { id:'m-f-3', title:'Body Systems',                  major:'biology' },
      { id:'m-f-4', title:'Habitats & Food Chains',        major:'biology' },
      { id:'m-f-5', title:'Matter & Mixtures',             major:'chemistry' },
      { id:'m-f-6', title:'Simple Reactions',              major:'chemistry' },
      { id:'m-f-7', title:'Pushes, Pulls & Motion',        major:'physics' },
      { id:'m-f-8', title:'Everyday English: Clear Sentences', major:'english' },
      { id:'m-f-9', title:'Reading Short Texts',           major:'english' },
      { id:'m-f-10', title:'Numbers, Fractions & Patterns',major:'math' },
    ],
    working: [
      { id:'m-w-1', title:'Everyday English II: Conversations', major:'english' },
      { id:'m-w-2', title:'Scientific Reading: Short Articles', major:'english' },
      { id:'m-w-3', title:'Lab Basics & Safety',           major:'chemistry' },
      { id:'m-w-4', title:'Writing Short Reports',         major:'english' },
      { id:'m-w-5', title:'Ecosystems Around You',         major:'biology' },
      { id:'m-w-6', title:'Energy at Home',                major:'physics' },
      { id:'m-w-7', title:'Data Around Me',                major:'math' },
      { id:'m-w-8', title:'Capstone: My Community Project',major:'biology' },
    ],
  },
};

/* per-band progress (invented) — same learner journey shape, sized to the world */
const BAND_PROGRESS = {
  basic:  { foundation: { done: 8,  total: 8 },  working: { done: 1, total: 6, active: 'b-w-2' } },
  middle: { foundation: { done: 10, total: 10 }, working: { done: 3, total: 8, active: 'm-w-4' } },
};

function bandKey(band){ return band==='basic' ? 'basic' : band==='middle' ? 'middle' : 'high'; }
function libraryFor(band){ return band==='basic' ? BAND_MODULES.basic : band==='middle' ? BAND_MODULES.middle : MODULES; }
function progressFor(band){ return band==='basic' ? BAND_PROGRESS.basic : band==='middle' ? BAND_PROGRESS.middle : PROGRESS; }
function bandFromModId(id){ return id.startsWith('b-') ? 'basic' : id.startsWith('m-') ? 'middle' : 'high'; }

const LESSONS = {
  'w-4': [
    { n:1, title:'Structuring a Report',      state:'done',    dur:25, type:'reading' },
    { n:2, title:'Evidence & Sources',        state:'done',    dur:30, type:'video' },
    { n:3, title:'Clear Sentences',           state:'done',    dur:20, type:'speaking' },
    { n:4, title:'Data Tables & Figures',     state:'current', dur:35, type:'sim' },
    { n:5, title:'Peer Review Practice',      state:'todo',    dur:30, type:'scenario' },
    { n:6, title:'Final Draft & Submission',  state:'todo',    dur:40, type:'speaking' },
  ],
  /* R4 — Basic world active module: 3–4 lessons, picture-first */
  'b-w-2': [
    { n:1, title:'Watch: Plants Near You',  state:'done',    dur:10, type:'video' },
    { n:2, title:'Parts of a Plant',        state:'done',    dur:12, type:'video' },
    { n:3, title:'Draw What You See',       state:'current', dur:15, type:'scenario' },
    { n:4, title:'Say the Names Aloud',     state:'todo',    dur:10, type:'speaking' },
  ],
  /* R4 — Middle world active module */
  'm-w-4': [
    { n:1, title:'The Shape of a Report',   state:'done',    dur:20, type:'reading' },
    { n:2, title:'Facts & Where They Live', state:'done',    dur:25, type:'video' },
    { n:3, title:'Short, Clear Sentences',  state:'current', dur:20, type:'reading' },
    { n:4, title:'Tables & Pictures',       state:'todo',    dur:25, type:'sim' },
    { n:5, title:'Share Your Draft',        state:'todo',    dur:20, type:'speaking' },
  ],
};

/* lesson-type system — her #2: "show me pictures, not paragraphs"
   scenario-first where the subject allows it; English reads speaking-first */
const TYPE_META = {
  sim:        { icon:'atom',      label:'Sim' },
  video:      { icon:'play',      label:'Video' },
  experiment: { icon:'flask',     label:'Experiment' },
  reading:    { icon:'book',      label:'Reading' },
  scenario:   { icon:'msgSquare', label:'Scenario' },
  speaking:   { icon:'mic',       label:'Speaking' },
};
const TYPE_KEYS = Object.keys(TYPE_META);
const TYPE_ENGLISH = ['speaking','scenario','speaking','scenario','video','reading'];
const TYPE_BASIC = ['video','sim','video','scenario','video','sim'];   // R4 — picture-first for the youngest world

/* ---------- assignment loop (designed, not wired — honest footers apply) ---------- */
const RUBRIC = [
  ['Understanding', 30],
  ['Application',   30],
  ['Creativity',    20],
  ['Presentation',  20],
];

/* peer reviewer names come from PRNG arrays — never literals */
const PEER_NAMES = ['Su Myat','Kyaw Zin','Hnin Wai','Min Khant','Thaw Dar','Zar Ni','Pyae Sone','May Thu'];
function peersFor(modId){
  const seed = modId.split('').reduce((a,c)=>a + c.charCodeAt(0)*11, 7);
  const r = mulberry32(seed);
  const a = Math.floor(r()*PEER_NAMES.length);
  let b; do { b = Math.floor(r()*PEER_NAMES.length); } while(b===a);
  return [PEER_NAMES[a], PEER_NAMES[b]];
}
function earnedFor(modId){
  const seed = modId.split('').reduce((a,c)=>a + c.charCodeAt(0)*13, 29);
  const r = mulberry32(seed);
  return RUBRIC.map(([,w]) => w - Math.floor(r()*5));
}

/* per-subject DO tasks — the experiential cycle, her #1 demand */
function assignTask(m){
  const t = m.title.toLowerCase();
  if(t.includes('biology') || t.includes('cells') || t.includes('plants') || t.includes('ecosystems')) return 'Film a plant near where you live. Identify 3 parts and label them in your video.';
  if(t.includes('chemistry') || t.includes('mixing')) return 'With an adult present, mix vinegar and baking soda. Photograph the reaction and explain the gas it makes.';
  if(t.includes('physics') || t.includes('motion') || t.includes('forces')) return 'Drop 3 different objects. Record what you see. Explain in your own words why they fall the way they do.';
  if(t.includes('energy')) return 'Find 5 things at home that use energy. Order them from least to most — guess first, then check the labels.';
  if(t.includes('lab')) return 'Run the measurement drill from this module at home. Photograph your setup and your recorded results.';
  if(t.includes('english') || t.includes('writing') || t.includes('reading') || t.includes('aloud')) return 'Read your latest draft aloud. Record 2 minutes of audio, then write 3 lines rating your own clarity.';
  if(t.includes('presentation')) return 'Record a 2-minute talk on any topic from this module. Watch it once, then re-record one improvement.';
  if(t.includes('research')) return 'Ask 3 people one question from your research plan. Write down their answers and what surprised you.';
  if(t.includes('data') || t.includes('numbers') || t.includes('shapes')) return 'Collect 10 real numbers from your home — prices, weights, times. Order them, find the middle value, and explain what it tells you.';
  if(t.includes('capstone') || t.includes('project')) return 'Draft your project proposal on one page. Photograph it or type it — your mentor reads the real thing.';
  if(t.includes('digital')) return 'Audit your own phone: list every app permission you have granted. Photograph your notes.';
  return 'Apply this module\u2019s skill in the real world, then submit your evidence.';
}

/* R4 — Basic-world DO tasks, phrased for a child. Sealed rubric unchanged. */
function basicTask(m){
  const t = m.title.toLowerCase();
  if(t.includes('plant') || t.includes('animals') || t.includes('body') || t.includes('nature')) return 'Draw the plant you found. Name 3 parts.';
  if(t.includes('mix') || t.includes('water')) return 'With a grown-up, mix salt into water. Watch what happens. Draw what you see.';
  if(t.includes('move') || t.includes('push') || t.includes('roll')) return 'Roll 3 things. Which one goes far? Draw them in a row.';
  if(t.includes('word') || t.includes('listen') || t.includes('talk') || t.includes('say')) return 'Tell a grown-up about your day. Use 5 sentences.';
  if(t.includes('count') || t.includes('measure') || t.includes('shapes')) return 'Find 3 things at home. Which is longest? Draw them in order.';
  if(t.includes('project') || t.includes('capstone')) return 'Draw your idea for the nature project on one page.';
  return 'Show what you learned — a drawing or a photo.';
}
function taskFor(band, m){ return bandKey(band)==='basic' ? basicTask(m) : assignTask(m); }

/* assignment flavors — the two-AI disagreement task is the verification
   reflex made into a task; available in every major */
const DISAGREE_TASK = 'Ask two different AIs the same question. Find where they disagree. Resolve it with an experiment or the textbook. Submit your verdict.';
const DISAGREE_GHOST = {
  a: 'AI A — “Earthworms improve soil for every plant, everywhere.”',
  b: 'AI B — “Earthworms can harm forest soils where they are not native.”',
  resolve: 'Resolve it: your textbook chapter, or the soil-pot experiment from Lesson 2. Submit your verdict — written or photo.',
};
function flavorFor(modId){
  return modId === 'w-5' ? 'two_ai_disagreement' : 'do_task';
}
/* R4 — assignment state + mentor register follow the band's world */
const REVISION_ID = { basic:'b-w-1', middle:'m-w-3', high:'w-3' };
const REVISION_QUOTE = {
  basic:  '\u201CNice try! Now tell me one thing you saw, in your own words.\u201D',
  middle: '\u201CGood start. Add what you measured \u2014 and one thing that surprised you.\u201D',
  high:   '\u201CGood measurements. Add units to every value and say what surprised you.\u201D',
};
function assignState(tierId, modId, band){
  if(tierId === 'foundation') return 'scored';      // completed tier → certificates earned
  if(modId === REVISION_ID[bandKey(band)]) return 'revision';   // ties to home needs-attention
  if(modId === progressFor(band).working.active) return 'awaiting';   // 1 of 2 peer reviews in
  return 'notsub';
}

/* needs-attention drawn from the band's own library (R4) */
const ATTENTIONS = {
  basic: [
    { icon:'fileText', kind:'warn', href:'#/module/b-w-1',
      title:'Your recording came back',
      sub:'Your mentor left a note — one more try.' },
    { icon:'clock', kind:'warn', href:'#/module/b-w-6',
      title:'Project idea not started',
      sub:'Your nature project opens soon — start thinking about it.' },
  ],
  middle: [
    { icon:'fileText', kind:'warn', href:'#/module/m-w-3',
      title:'Assignment returned',
      sub:'Your Lab Basics & Safety assignment came back with mentor feedback — one more pass.' },
    { icon:'clock', kind:'warn', href:'#/module/m-w-8',
      title:'Capstone proposal not started',
      sub:'M-W-8 opens soon — outline your community project idea.' },
  ],
  high: [
    { icon:'fileText', kind:'warn', href:'#/module/w-3',
      title:'Assignment returned',
      sub:'Your Lab Methods & Safety assignment came back with mentor feedback — one more pass.' },
    { icon:'clock', kind:'warn', href:'#/module/w-10',
      title:'Capstone proposal not started',
      sub:'W-10 opens soon — outline your community project idea.' },
  ],
};
function attentionFor(band){ return ATTENTIONS[bandKey(band)]; }

/* module durations — seeded, stable across reloads */
const MOD_META = {};
Object.values(MODULES).flat().forEach(m => {
  MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 4) };   // 4–7 lessons
});
MOD_META['w-4'].lessons = 6;   // matches authored LESSONS['w-4']
/* R4 band libraries — shorter modules for younger worlds */
Object.values(BAND_MODULES.basic).flat().forEach(m => {
  MOD_META[m.id] = { lessons: 3 + Math.floor(rng() * 2) };   // 3–4 lessons
});
Object.values(BAND_MODULES.middle).flat().forEach(m => {
  MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 2) };   // 4–5 lessons
});
MOD_META['b-w-2'].lessons = 4;   // matches authored LESSONS['b-w-2']
MOD_META['m-w-4'].lessons = 5;   // matches authored LESSONS['m-w-4']

/* module row state resolver — band-aware (R4) */
function moduleState(tierId, idx, band){
  const lib = libraryFor(band);
  const prog = progressFor(band);
  if(tierId === 'foundation') return 'done';
  if(tierId === 'working'){
    if(idx < prog.working.done) return 'done';
    if(lib.working[idx].id === prog.working.active) return 'active';
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
  fileText:  I('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/>'),
  shield:    I('<path d="M20 13c0 5-3.5 7.5-7.7 9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.7a1.2 1.2 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'),
  flag:      I('<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>'),
  play:      I('<polygon points="6 3 20 12 6 21 6 3"/>'),
  atom:      I('<circle cx="12" cy="12" r="1"/><path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"/><path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"/>'),
  flask:     I('<path d="M10 2v7.5a2 2 0 0 1-.2.9L4.7 20.5a1 1 0 0 0 .9 1.5h12.8a1 1 0 0 0 .9-1.5L14.2 10.4a2 2 0 0 1-.2-.9V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>'),
  msgSquare: I('<path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/>'),
  video:     I('<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>'),
  camera:    I('<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>'),
  pen:       I('<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>'),
  upload:    I('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>'),
  award:     I('<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>'),
  users:     I('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'),
  compass:   I('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>'),
  refresh:   I('<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>'),
  checkC:    I('<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'),
  mic:       I('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>'),
  bot:       I('<rect width="18" height="10" x="3" y="11" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" x2="8" y1="16" y2="16"/><line x1="16" x2="16" y1="16" y2="16"/>'),
  help:      I('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>'),
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

function bandSwitcher(){
  /* demo affordance — lives ONLY in the topbar, never adjacent to
     any tier badge (display law: band = setting, tier = achievement) */
  const cur = getBand();
  const opts = Object.entries(BANDS).map(([v, label])=>
    `<option value="${v}" ${v===cur?'selected':''}>${label}</option>`).join('');
  return `<label class="bandsel-wrap" title="School band — demo switcher">
    <span class="bandsel-label">Band</span>
    <select id="bandsel" class="bandsel" onchange="setBand(this.value)">${opts}</select>
  </label>`;
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
        <a href="#/career" class="${route==='career'?'on':''}">${ICON.compass}<span>Career</span></a>
      </nav>
      <div class="spacer"></div>
      ${bandSwitcher()}
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

function moduleRow(tierId, m, idx, band){
  const st = moduleState(tierId, idx, band);
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
  const band = getBand();
  const reg = registerFor(band);
  const lib = libraryFor(band);
  const prog = progressFor(band);
  const modIdx = lib.working.findIndex(m=>m.id===prog.working.active);
  const mod = lib.working[modIdx];
  const lessons = LESSONS[mod.id];
  const cur = lessons.find(l=>l.state==='current');
  const doneCount = lessons.filter(l=>l.state==='done').length;

  const ladder = TIERS.map(t=>{
    const cls = t.status==='done' ? 'done' : t.status==='current' ? 'current' : 'locked';
    const node = t.status==='done' ? ICON.check : t.status==='current' ? ICON.play : ICON.lock;
    const d = t.status==='done' ? 'Complete' : t.status==='current' ? 'In progress' : 'Locked';
    return `<div class="rung ${cls}"><span class="node">${node}</span><span class="t">${t.name}</span><span class="d">${d}</span></div>`;
  }).join('');

  const attn = attentionFor(band).map(a=>`
    <div class="attn">
      <span class="icobox ${a.kind}">${ICON[a.icon]}</span>
      <span><span class="t">${a.title}</span><span class="s" style="display:block">${a.sub}</span></span>
      <span class="act"><a class="btn ghost sm" href="${a.href}" style="padding:6px 12px">Review ${ICON.arrowR}</a></span>
    </div>`).join('');

  const content = `
  <main class="page">
    <div class="between" style="align-items:flex-end;flex-wrap:wrap">
      <div>
        <div class="label">Learner home</div>
        <h1 class="h1" style="margin-top:6px">${reg.greet()}</h1>
      </div>
      ${tierBadge(tier)}
    </div>
    <p class="posline">AI is the tutor. YDC is the proof.</p>

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
          <p class="mut sm" style="margin-top:4px">Working tier · Module ${modIdx+1} · ${doneCount} of ${lessons.length} lessons complete</p>
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
            ${lib.working.slice(modIdx+1, modIdx+3).map((m,i)=>`
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
          <p class="sm mut" style="margin-top:8px">Complete all Working modules to open the Professional gate review. Every tier promotion requires passing the English test.</p>
          <a class="btn ghost sm" href="#/promotion" style="margin-top:12px;padding:6px 0">Preview a promotion ${ICON.chevR}</a>
        </section>
      </aside>
    </div>
  </main>`;
  return shell(content, 'home');
}

/* ---------- screen 2 · roadmap / ladder ---------- */
function viewRoadmap(){
  const band = getBand();
  const lib = libraryFor(band);
  const tiers = TIERS.map(t=>{
    const cls = t.status==='done' ? 'done' : t.status==='current' ? 'current' : 'locked';
    const statePill = t.status==='done'
      ? `<span class="pill teal">${ICON.check} Complete</span>`
      : t.status==='current'
        ? `<span class="pill gold">Current tier</span>`
        : `<span class="pill dim">${ICON.lock} Locked</span>`;

    let body = '';
    if(t.status === 'locked'){
      /* honest empty state — Q3 discipline; topic previews per major */
      const gate = TIERS[t.n-2].name;
      body = `<div class="tier-body">
        <div class="locked-state">
          <span class="icobox">${ICON.lock}</span>
          <div class="txt">
            <div class="t">This tier is not open yet</div>
            <div class="s">Complete the ${gate} tier to unlock ${t.name}. Your mentor reviews every gate — nothing unlocks early, nothing is skipped.</div>
            ${t.topicsByMajor.map(([mj, items])=>`
              <span class="lmj">${MAJORS[mj].name}</span>
              <div class="topic-preview" style="margin-top:6px">${items.map(x=>`<span>${x}</span>`).join('')}</div>`).join('')}
          </div>
        </div>
      </div>`;
    } else {
      const mods = lib[t.id];
      const done = mods.filter((m,i)=>moduleState(t.id,i,band)==='done').length;
      const rails = MAJOR_ORDER.map(mj=>{
        const inRail = mods.map((m,i)=>({m,i})).filter(x=>x.m.major===mj);
        if(!inRail.length) return '';
        return `<div class="major-rail">
          <div class="major-head">
            <span class="mn">${MAJORS[mj].name}</span>
            <span class="mc">${MAJORS[mj].cap}</span>
            <span class="mcount num">${inRail.length} modules</span>
          </div>
          ${inRail.map(x=>moduleRow(t.id, x.m, x.i, band)).join('')}
        </div>`;
      }).join('');
      body = `<div class="tier-body">
        <div class="between" style="margin-bottom:6px">
          <span class="sm dim num">${done} of ${mods.length} modules complete</span>
          <div class="track ${t.status==='done'?'gold':''}" style="width:140px"><i style="width:${Math.round(done/mods.length*100)}%"></i></div>
        </div>
        ${rails}
      </div>`;
    }

    return `<section class="panel tier ${cls}">
      <div class="tier-head">
        <span class="num-badge">${String(t.n).padStart(2,'0')}</span>
        <div style="flex:1;min-width:0">
          <div class="h2">${t.name}</div>
          <div class="sm dim" style="margin-top:2px">${t.summary}</div>
          <div style="margin-top:8px">${langChip(t.id)}</div>
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
    <p class="mut" style="margin-top:6px;max-width:60ch">${registerFor(band).roadIntro}</p>
    <p class="langline">Learning happens in your language. The earning tiers train the room's language.</p>
    <div class="stack16" style="margin-top:24px">${tiers}</div>
  </main>`;
  return shell(content, 'roadmap');
}

/* ---------- screen 3 · module detail ---------- */
const LESSON_BANK = [
  'Guided Reading','Core Concepts','Worked Examples','Practice Task',
  'Discussion Prep','Applied Exercise','Review & Reflection','Mastery Check',
];
function lessonsFor(modId, state, major){
  if(LESSONS[modId]) return LESSONS[modId];
  /* procedural, stable per module — seeded PRNG, not random per render */
  const seed = modId.split('').reduce((a,c)=>a + c.charCodeAt(0)*7, 13);
  const r = mulberry32(seed);
  const n = MOD_META[modId].lessons;
  const band = bandFromModId(modId);
  const pool = band==='basic' ? TYPE_BASIC : major === 'english' ? TYPE_ENGLISH : TYPE_KEYS;
  const used = new Set();
  return Array.from({length:n}, (_,i)=>{
    let t; do { t = LESSON_BANK[Math.floor(r()*LESSON_BANK.length)]; } while(used.has(t));
    used.add(t);
    return {
      n:i+1, title:t,
      state: state==='done' ? 'done' : 'todo',
      dur: 15 + Math.floor(r()*6)*5,
      type: pool[Math.floor(r()*pool.length)],
    };
  });
}

/* ---------- embed slot (sim / video — designed, 3G-friendly) ---------- */
function embedBlock(lesson){
  const isSim = lesson.type === 'sim';
  const isVideo = lesson.type === 'video';
  if(!isSim && !isVideo) return '';
  return `
  <section class="embed-frame">
    <span class="embed-ico">${ICON[isSim ? 'atom' : 'play']}</span>
    <div class="t">${isSim ? 'Interactive simulation' : 'Video lesson'} — ${lesson.title}</div>
    <div class="s">${isSim
      ? 'PhET-class embed · loads on demand · light shell for slow connections'
      : 'Adaptive stream · low-bandwidth first'} · designed slot, content invented</div>
    <span class="btn ghost sm" style="margin-top:14px;pointer-events:none">${isSim ? 'Launch simulation' : 'Play lesson'} ${ICON.arrowR}</span>
  </section>`;
}

/* ---------- assignment card — 4 states, sealed rubric, certificate ---------- */
function rubricBars(earned, flavor){
  return RUBRIC.map(([name, w], i)=>{
    /* sealed rubric unchanged; on the disagreement flavor the first
       criterion carries the CCO-flagged caption "verification quality" */
    const label = (flavor === 'two_ai_disagreement' && i === 0) ? `${name} — verification quality` : name;
    const e = earned ? earned[i] : 0;
    const pct = earned ? Math.round(e / w * 100) : 0;
    return `<div class="crit">
      <div class="between"><span class="sm">${label}</span><span class="sm dim num">${earned ? e + ' / ' + w : '— / ' + w}</span></div>
      <div class="track ${earned ? 'gold' : ''}" style="margin-top:5px"><i style="width:${pct}%"></i></div>
    </div>`;
  }).join('');
}

function assignSteps(state){
  const steps = ['Submitted', 'Peer reviews', 'Scored', 'Certificate'];
  const pos = { notsub:-1, awaiting:1, revision:1, scored:3 }[state];
  return `<div class="asteps">${steps.map((t, i)=>{
    const cls = state==='notsub' ? '' :
      i < pos ? 'done' :
      i === pos ? (state==='revision' ? 'cur-warn' : 'cur') : '';
    const glyph = i < pos ? ICON.check : String(i+1);
    return `<div class="astep ${cls}"><span class="n">${glyph}</span><span class="t">${t}</span></div>`;
  }).join('')}</div>`;
}

function assignBlock(tierId, m, band){
  const st = assignState(tierId, m.id, band);
  const flavor = flavorFor(m.id);
  const task = flavor === 'two_ai_disagreement' ? DISAGREE_TASK : taskFor(band, m);
  const peers = peersFor(m.id);

  /* submission formats follow the world: Basic submits drawings/photos */
  const typepickHtml = flavor === 'two_ai_disagreement'
    ? `<span>${ICON.pen} Written</span><span>${ICON.camera} Photo</span>`
    : bandKey(band) === 'basic'
      ? `<span>${ICON.pen} Drawing</span><span>${ICON.camera} Photo</span>`
      : `<span>${ICON.video} Video</span>
        <span>${ICON.camera} Photo</span>
        <span>${ICON.pen} Written</span>
        <span>${ICON.flask} Experiment</span>`;

  const statePill = {
    notsub:   `<span class="pill dim">Not submitted</span>`,
    awaiting: `<span class="pill teal">${ICON.users} Peer review — 1 of 2</span>`,
    scored:   `<span class="pill gold">${ICON.award} Scored — certificate earned</span>`,
    revision: `<span class="pill warn">${ICON.refresh} Revision requested</span>`,
  }[st];

  /* two-column disagreement visual — ghost content, invented */
  const disagreeVisual = flavor === 'two_ai_disagreement' ? `
      <div class="disagree">
        <div class="col"><span class="h">AI A claims</span><p class="q">${DISAGREE_GHOST.a}</p></div>
        <div class="col"><span class="h">AI B claims</span><p class="q">${DISAGREE_GHOST.b}</p></div>
        <div class="col verdict"><span class="h">Your verification</span><p class="q">${DISAGREE_GHOST.resolve}</p></div>
      </div>` : '';

  let body = '';
  if(st === 'notsub'){
    body = `
      <p class="sm mut" style="margin-top:14px">${task}</p>
      ${disagreeVisual}
      <div class="typepick">
        ${typepickHtml}
      </div>
      ${flavor === 'two_ai_disagreement' ? `<div style="margin-top:16px">${rubricBars(null, flavor)}</div>` : ''}`;
  } else if(st === 'awaiting'){
    body = `
      <div class="peer" style="border-top:0">
        <span class="icobox teal">${ICON.checkC}</span>
        <span><span class="nm" style="display:block">Your submission is in</span>
        <span class="st ok">Received — peers review against the sealed rubric</span></span>
      </div>
      <div class="peer">
        <span class="icobox">${ICON.users}</span>
        <span><span class="nm" style="display:block">${peers[0]}</span>
        <span class="st ok">Review submitted</span></span>
      </div>
      <div class="peer">
        <span class="icobox">${ICON.users}</span>
        <span><span class="nm" style="display:block">${peers[1]}</span>
        <span class="st">Review in progress</span></span>
      </div>
      <div style="margin-top:16px">${rubricBars(null)}</div>
      <p class="sm dim" style="margin-top:12px">Two peer reviews unlock the score. You can keep learning while they finish.</p>`;
  } else if(st === 'scored'){
    body = `
      <div style="margin-top:14px">${rubricBars(earnedFor(m.id))}</div>
      <div class="cert">
        <span class="aw">${ICON.award}</span>
        <span>
          <span class="t" style="display:block">Module Certificate</span>
          <span class="s" style="display:block">${m.title} · verified by ${LEARNER.mentor} · counts toward your tier mastery gate</span>
        </span>
      </div>`;
  } else if(st === 'revision'){
    body = `
      <div class="rev" style="margin-top:14px">
        <span class="icobox warn">${ICON.refresh}</span>
        <span>
          <span class="t" style="display:block">One more pass</span>
          <span class="s" style="display:block">${LEARNER.mentor} — ${REVISION_QUOTE[bandKey(band)]}</span>
        </span>
      </div>
      <p class="sm mut" style="margin-top:14px">${task}</p>
      <div class="typepick">
        ${typepickHtml}
      </div>`;
  }

  return `
  <section class="panel">
    <div class="pad between" style="border-bottom:1px solid var(--line)">
      <span class="label">Assignment — do it for real</span>
      ${statePill}
    </div>
    <div class="pad">
      ${assignSteps(st)}
      ${body}
      <div class="assign-foot">Submit and review flow designed — not wired to production.</div>
    </div>
  </section>`;
}

/* ---------- AI-guidance companion — "Learn this with AI" ----------
   Anti-profiling law (hardest form): never "based on your history…",
   never age, never scores near identity. A tool the learner picks up. */
function companionBlock(){
  return `
  <section class="panel">
    <div class="pad between" style="border-bottom:1px solid var(--line)">
      <span class="label">Learn this with AI</span>
      <span class="pill teal">${ICON.bot} Maya</span>
    </div>
    <div class="pad">
      <div class="row" style="gap:12px">
        <span class="icobox teal">${ICON.bot}</span>
        <span><span class="sm" style="font-weight:600;display:block">Maya — AI study companion</span>
        <span class="sm dim">Text-first · works on slow connections</span></span>
      </div>
      <div class="cslots">
        <span>${ICON.book} Explain at my level</span>
        <span>${ICON.msgSquare} Explain in my language</span>
        <span>${ICON.help} Quiz me before the assignment</span>
      </div>
      <div class="assign-foot">AI companion designed — not wired. Maya guardrails + CCO gate apply in production.</div>
    </div>
  </section>`;
}

function viewModule(modId){
  const band = getBand();
  const lib = libraryFor(band);
  const tierId = modId.split('-').includes('f') ? 'foundation' : 'working';
  const tier = TIERS.find(t=>t.id===tierId);
  const idx = lib[tierId].findIndex(m=>m.id===modId);
  const mod = idx >= 0 ? lib[tierId][idx] : undefined;
  if(!mod) return viewRoadmap();   // id from another world's library → back to this world's roadmap
  const st = moduleState(tierId, idx, band);
  const lessons = lessonsFor(modId, st, mod.major);
  const done = lessons.filter(l=>l.state==='done').length;
  const nextMod = lib[tierId][idx+1];

  const lessonRows = lessons.map(l=>{
    const tm = TYPE_META[l.type];
    return `
    <div class="lesson ${l.state}">
      <span class="li">${l.state==='done' ? ICON.check : l.state==='current' ? ICON.play : `<span style="width:4px;height:4px;border-radius:50%;background:var(--dim)"></span>`}</span>
      <span class="lt">
        <span class="t">Lesson ${l.n} — ${l.title}</span>
        ${l.state==='current' ? '<span class="s" style="display:block">You are here</span>' : ''}
      </span>
      <span class="ltype">${ICON[tm.icon]}<span>${tm.label}</span></span>
      <span class="dur num">${l.dur} min</span>
    </div>`;
  }).join('');

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
        <span class="label">Module ${String(idx+1).padStart(2,'0')} · ${tier.name} tier · ${MAJORS[mod.major].name}</span>
        <h1 class="h1" style="margin-top:6px">${mod.title}</h1>
      </div>
      ${statusPill}
    </div>
    <div class="row" style="margin-top:12px;gap:8px">${langChip(tierId)}</div>

    <div class="grid2" style="margin-top:22px">
      <div class="stack16">
        ${st==='active' ? embedBlock(lessons.find(l=>l.state==='current')) : ''}
        <section class="panel">
          <div class="pad between" style="border-bottom:1px solid var(--line)">
            <span class="label">Lessons</span>
            <span class="sm dim num">${done} of ${lessons.length} complete</span>
          </div>
          <div style="padding:8px 10px">${lessonRows}</div>
        </section>
        ${companionBlock()}
        ${assignBlock(tierId, mod, band)}
      </div>

      <aside class="stack16">
        <section class="panel pad">
          <span class="label">Next action</span>
          <p class="sm mut" style="margin-top:10px">${
            st==='active' ? `Lesson ${lessons.find(l=>l.state==='current').n} — ${lessons.find(l=>l.state==='current').title}. About ${lessons.find(l=>l.state==='current').dur} minutes.` :
            st==='done'   ? (assignState(tierId, modId, band)==='revision'
                            ? 'Lessons complete — your assignment needs one more pass, below.'
                            : 'This module is complete and verified by your mentor.') :
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
      <div class="engate">${ICON.book} Every tier promotion requires passing the English test — this one is no exception.</div>
      <div class="verify">${ICON.shield} Verified by ${LEARNER.mentor}, your mentor · module certificates on record</div>
      <div class="ctas">
        <a class="btn gold" href="#/roadmap">See the roadmap ${ICON.arrowR}</a>
        <a class="btn ghost" href="#/">Back home</a>
      </div>
    </div>
  </main>`;
  return shell(content, 'promo');
}

/* ---------- screen 5 · youth career roadmap ----------
   DESIGN LAW: the learner's own age is never rendered, computed, or
   stored. The stage rail is the road — generic. The tier badge is the
   person. The two never merge. Career FAMILIES, not jobs. Readiness is
   qualitative — no numbers near identity.                          */
const CAREER = {
  families: [
    'Technology & Digital','Health & Life Sciences','Business & Enterprise',
    'Creative & Communication','Engineering & Making','Community & Service',
  ],
  readiness: ['Exploring','Focusing','Building','Ready'],
  stages: [
    { band:'14–15', name:'Explore',
      copy:'Try everything. No choosing yet — curiosity is the work.',
      gates:[], lang:null, kind:'families' },
    { band:'16–17', name:'Focus',
      copy:'Two families go deeper. Real projects begin.',
      gates:['English L1'], lang:'Learning tiers · MM-first · AI-translated · CCO-gated', kind:'focus' },
    { band:'18–20', name:'Specialize',
      copy:'Skills sharpen into evidence others can trust.',
      gates:['Portfolio','Mentorship','English L2'], lang:'Earning tiers · English-medium', kind:'specialize' },
    { band:'20+', name:'Transition',
      copy:'Move to the adult platform — referrals, real roles, the full network.',
      gates:[], lang:null, kind:'transition' },
  ],
};

function viewCareer(){
  const tier = TIERS.find(t=>t.id===LEARNER.tierId);
  const band = getBand();
  const readyIdx = { foundation:1, working:2, professional:2, advanced:3 }[tier.id];

  const ready = CAREER.readiness.map((t,i)=>
    `<div class="rstep ${i===readyIdx?'cur':''}"><span class="p"></span><span class="t">${t}</span></div>`
  ).join('');

  const header = `
    <div class="between" style="align-items:flex-end;flex-wrap:wrap">
      <div>
        <div class="label">Career roadmap</div>
        <h1 class="h1" style="margin-top:6px">Where this road goes</h1>
      </div>
      ${tierBadge(tier)}
    </div>
    <p class="mut" style="margin-top:8px;max-width:62ch">Stages describe the road, not you. Your tier marks your skills — nobody here is a number.</p>`;

  /* band-gated states (R3-A). Band copy English, CCO-flagged. */
  if(band === 'basic'){
    const content = `
  <main class="page" style="max-width:860px">
    ${header}
    <section class="panel" style="margin-top:20px">
      <div class="tier-body" style="border-top:0">
        <div class="locked-state">
          <span class="icobox">${ICON.lock}</span>
          <div class="txt">
            <div class="t">The career road opens at High school band</div>
            <div class="s">Career planning uses real-world stages. Until then, the ladder in your roadmap is the work that matters — every module you finish still counts.</div>
            <div style="margin-top:12px"><a class="btn ghost sm" href="#/roadmap">Go to your roadmap ${ICON.arrowR}</a></div>
          </div>
        </div>
      </div>
    </section>
  </main>`;
    return shell(content, 'career');
  }

  if(band === 'middle'){
    const s = CAREER.stages[0];   // Explore only
    const content = `
  <main class="page" style="max-width:860px">
    ${header}
    <section class="panel pad" style="margin-top:20px">
      <div class="between">
        <span class="label">How close to ready</span>
        <span class="sm dim">qualitative — never a score</span>
      </div>
      <div class="ready" style="margin-top:16px">${ready}</div>
      <p class="sm dim" style="margin-top:14px">Your ${tier.name} tier places you at <b style="color:var(--ink)">${CAREER.readiness[readyIdx]}</b> — a statement about skills. It says nothing about how old you are.</p>
    </section>
    <section class="panel pad" style="margin-top:16px;border-style:dashed;border-color:color-mix(in srgb, var(--ink) 22%, transparent)">
      <div class="row" style="gap:12px">
        <span class="icobox">${ICON.compass}</span>
        <span><span class="sm" style="font-weight:600;display:block">Explore-only at Middle school band</span>
        <span class="sm dim" style="display:block;margin-top:2px">The full road — with its gates — opens at High school band. For now: try everything.</span></span>
      </div>
    </section>
    <div class="road" style="margin-top:24px">
      <div class="stage last">
        <span class="dot"></span>
        <span class="band">${s.band}</span>
        <div class="nm">${s.name}</div>
        <div class="ds">${s.copy}</div>
        <div class="body"><div class="topic-preview">${CAREER.families.map(f=>`<span>${f}</span>`).join('')}</div></div>
      </div>
    </div>
  </main>`;
    return shell(content, 'career');
  }

  const stageBody = (s)=>{
    if(s.kind==='families'){
      return `<div class="topic-preview">${CAREER.families.map(f=>`<span>${f}</span>`).join('')}</div>`;
    }
    if(s.kind==='focus'){
      return `<div class="topic-preview">${CAREER.families.slice(0,2).map(f=>`<span>${f}</span>`).join('')}</div>
        <p class="sm dim" style="margin-top:8px">You choose your two when you reach this stage — nothing is chosen for you.</p>`;
    }
    if(s.kind==='specialize'){
      return `
        <div class="row" style="gap:11px;margin-top:2px">
          <span class="icobox">${ICON.book}</span>
          <span><span class="sm" style="font-weight:600;display:block">Writing Clear Reports</span>
          <span class="sm dim">Working tier · in progress now</span></span>
        </div>
        <div class="row" style="gap:11px;margin-top:10px">
          <span class="icobox">${ICON.book}</span>
          <span><span class="sm" style="font-weight:600;display:block">Presentation Skills</span>
          <span class="sm dim">Module next · feeds your portfolio</span></span>
        </div>`;
    }
    return `<p class="sm mut">The ladder ends here — the network begins. ReferTRM verification travels with you.</p>`;
  };

  /* the road climbs: cap at the top, stages descending to the start */
  const road = [...CAREER.stages].reverse().map((s,i,arr)=>`
    <div class="stage ${i===arr.length-1?'last':''}">
      <span class="dot"></span>
      <span class="band">${s.band}</span>
      <div class="nm">${s.name}</div>
      <div class="ds">${s.copy}</div>
      ${s.gates.length ? `<div class="gates">${s.gates.map(g=>`<span>${ICON.flag} Gate · ${g}</span>`).join('')}</div>` : ''}
      ${s.lang ? `<div style="margin-top:8px"><span class="pill lang">${ICON.msgSquare} ${s.lang}</span></div>` : ''}
      <div class="body">${stageBody(s)}</div>
    </div>`).join('');

  const content = `
  <main class="page" style="max-width:860px">
    ${header}

    <section class="panel pad" style="margin-top:20px">
      <div class="between">
        <span class="label">How close to ready</span>
        <span class="sm dim">qualitative — never a score</span>
      </div>
      <div class="ready" style="margin-top:16px">${ready}</div>
      <p class="sm dim" style="margin-top:14px">Your ${tier.name} tier places you at <b style="color:var(--ink)">${CAREER.readiness[readyIdx]}</b> — a statement about skills. It says nothing about how old you are.</p>
    </section>

    <section class="panel pad" style="margin-top:16px;border-color:color-mix(in srgb, var(--gold) 40%, transparent)">
      <div class="row" style="gap:14px">
        <span class="icobox gold" style="width:44px;height:44px">${ICON.shield}</span>
        <span>
          <span style="font-size:16px;font-weight:700;color:var(--gold);display:block">Career Ready — Verified by ReferTRM</span>
          <span class="sm mut" style="display:block;margin-top:2px">The top of the road. Every gate below passed, every certificate real.</span>
          <span class="posline" style="display:block;margin-top:8px">AI is the tutor. YDC is the proof.</span>
        </span>
      </div>
    </section>

    <div class="road" style="margin-top:24px">${road}</div>
  </main>`;
  return shell(content, 'career');
}

/* ---------- router ---------- */
function route(){
  const h = location.hash.replace(/^#\/?/, '');
  const app = document.getElementById('app');
  let html, r = 'home';
  if(h.startsWith('module/')){ html = viewModule(h.split('/')[1]); r='roadmap'; }
  else if(h === 'roadmap'){ html = viewRoadmap(); r='roadmap'; }
  else if(h === 'career'){ html = viewCareer(); r='career'; }
  else if(h === 'promotion'){ html = viewPromotion(); r='promo'; }
  else { html = viewHome(); r='home'; }
  app.innerHTML = html;
  renderThemeBtn();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);
route();

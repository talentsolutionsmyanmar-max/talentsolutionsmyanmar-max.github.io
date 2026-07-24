/* ============================================================
   YDC — THE NIGHT TRAIL · app-data.js
   Canon data + state helpers. No bundler on 3G: script-load
   order is the module system. This file assigns window.* so a
   self-contained app.js can never collide during deploys.
   ============================================================ */
'use strict';

/* ---------- seeded PRNG ---------- */
function mulberry32(seed){
  let a = seed >>> 0;
  return function(){
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
window.rng = mulberry32(20260719);

/* ---------- canon model (invented) ---------- */
window.LEARNER = { firstName:'Nanda', fullName:'Nanda Lin', tierId:'working', mentor:'M. Thiri' };

window.BANDS = { basic:'Basic', middle:'Middle', high:'High', out_of_school:'Out of school' };
function getBand(){ try{ return localStorage.getItem('ydc-canvas-band') || 'high'; }catch(e){ return 'high'; } }
function setBand(v){ try{ localStorage.setItem('ydc-canvas-band', v); }catch(e){} route(); }
function bandKey(band){ return band==='basic' ? 'basic' : band==='middle' ? 'middle' : band==='out_of_school' ? 'oos' : 'high'; }

window.REGISTER = {
  basic:  { bubble:'Ready to play and learn?' },
  middle: { bubble:'Your trail is waiting. One more step?' },
  high:   { bubble:'Your trail is waiting. One more step?' },
  out_of_school:{ bubble:'Real skills, real income. One step tonight?' },
};
function registerFor(band){ return REGISTER[band] || REGISTER.high; }

/* time-aware greeting — the trail knows what the sky looks like */
function dayPart(){ const h = new Date().getHours(); return h < 5 ? 'night' : h < 11 ? 'morning' : h < 17 ? 'afternoon' : h < 22 ? 'evening' : 'night'; }
window.GREET = { morning:'Good morning', afternoon:'Good afternoon', evening:'Good evening', night:'Still up' };
window.SUBLINE = {
  morning:   'A fresh page on your trail.',
  afternoon: 'Your trail is right where you left it.',
  evening:   'The whole trail is yours tonight.',
  night:     'The stars are out. So is your trail.',
};
function greetFor(band){ return band === 'basic' ? `Hello, ${LEARNER.firstName}!` : `${GREET[dayPart()]}, ${LEARNER.firstName}`; }
function subFor(band){
  if(band === 'basic') return 'Come play on your trail!';
  if(band === 'out_of_school') return 'Real skills, real income — your trail is right where you left it.';
  return SUBLINE[dayPart()];
}
function skyEm(){ const p = dayPart(); return (p === 'morning' || p === 'afternoon') ? '☀️' : '🌙'; }

window.TIERS = [
  { id:'foundation',   name:'Foundation',   n:1, status:'done',    em:'🌱', summary:'Core study skills and subject foundations.' },
  { id:'working',      name:'Working',      n:2, status:'current', em:'🎒', summary:'Applied skills: reading, writing, lab method, presentation.' },
  { id:'professional', name:'Professional', n:3, status:'locked',  em:'🧭', summary:'Independent project work and specialist subject tracks.' },
  { id:'advanced',     name:'Advanced',     n:4, status:'locked',  em:'🏆', summary:'Mastery portfolio and community leadership.' },
];

/* five majors — canon names, reasoning captions; canvas adds color + emoji */
window.MAJORS = {
  english:   { name:'English',   cap:'Live communication',  em:'💬', c:'var(--c-english)',   c1:'#FF7A85', c2:'#FF9E64' },
  math:      { name:'Math',      cap:'Formal reasoning',    em:'🧮', c:'var(--c-math)',      c1:'#FFC24B', c2:'#FF8E53' },
  physics:   { name:'Physics',   cap:'Causal reasoning',    em:'⚡', c:'var(--c-physics)',   c1:'#54C8FF', c2:'#7C6CFF' },
  chemistry: { name:'Chemistry', cap:'Process reasoning',   em:'🧪', c:'var(--c-chemistry)', c1:'#B28CFF', c2:'#FF6E9E' },
  biology:   { name:'Biology',   cap:'Systems reasoning',   em:'🌿', c:'var(--c-biology)',   c1:'#4ADE80', c2:'#2DD4BF' },
};
window.MAJOR_ORDER = ['english','math','physics','chemistry','biology'];

function langLine(tierId){
  return (tierId==='foundation' || tierId==='working')
    ? 'Taught MM-first · AI-translated · CCO-gated'
    : 'English-medium tier';
}

window.MODULES = {
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
window.PROGRESS = {
  foundation: { done: 14, total: 14 },
  working:    { done: 3,  total: 10, active: 'w-4' },
};

/* R4 band worlds — per-band libraries (invented shapes, HA/CCO lane in production) */
window.BAND_MODULES = {
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
window.BAND_PROGRESS = {
  basic:  { foundation: { done: 8,  total: 8 },  working: { done: 1, total: 6, active: 'b-w-2' } },
  middle: { foundation: { done: 10, total: 10 }, working: { done: 3, total: 8, active: 'm-w-4' } },
};
/* out-of-school — its own world: practical foundations, earning skills.
   Voice law: never "dropout", never remedial. These youth are earners-in-waiting. */
window.OOS_MODULES = {
  foundation: [
    { id:'o-f-1', title:'Money Math: Prices, Change & Bills',  major:'math' },
    { id:'o-f-2', title:'Work English I: Greetings & Directions', major:'english' },
    { id:'o-f-3', title:'Reading Forms & Notices',             major:'english' },
    { id:'o-f-4', title:'Safe Cooking: Heat & Food',           major:'chemistry' },
    { id:'o-f-5', title:'Electricity at Home & Work',          major:'physics' },
    { id:'o-f-6', title:'Your Body at Work: Strength & Rest',  major:'biology' },
    { id:'o-f-7', title:'Measuring for Real Jobs',             major:'math' },
    { id:'o-f-8', title:'Clean Water & Hygiene',               major:'biology' },
  ],
  working: [
    { id:'o-w-1', title:'Work English II: Customers & Problems', major:'english' },
    { id:'o-w-2', title:'Money Records: Notebook to Spreadsheet', major:'math' },
    { id:'o-w-3', title:'Pricing Your Work',                   major:'math' },
    { id:'o-w-4', title:'Writing Messages That Get Answered',  major:'english' },
    { id:'o-w-5', title:'Tools & Machines: Use Them Safely',   major:'physics' },
    { id:'o-w-6', title:'Materials: What Things Are Made Of',  major:'chemistry' },
    { id:'o-w-7', title:'Health for Long Work Weeks',          major:'biology' },
    { id:'o-w-8', title:'Capstone: Your First Paid Job Plan',  major:'math' },
  ],
};
window.OOS_PROGRESS = {
  foundation: { done: 8, total: 8 },
  working:    { done: 1, total: 8, active: 'o-w-2' },
};
BAND_MODULES.out_of_school = OOS_MODULES;
BAND_PROGRESS.out_of_school = OOS_PROGRESS;
function libraryFor(band){ return band==='basic' ? BAND_MODULES.basic : band==='middle' ? BAND_MODULES.middle : band==='out_of_school' ? OOS_MODULES : MODULES; }
function progressFor(band){ return band==='basic' ? BAND_PROGRESS.basic : band==='middle' ? BAND_PROGRESS.middle : band==='out_of_school' ? OOS_PROGRESS : PROGRESS; }
/* deep links are band-agnostic: a module id renders in whichever
   band world owns it — the band pill is a preference, not a wall */
function findModule(modId){
  const tierId = modId.split('-').includes('f') ? 'foundation' : 'working';
  const cur = getBand();
  const order = [cur, ...Object.keys(BANDS).filter(b=>b!==cur)];
  for(const b of order){
    const lib = libraryFor(b);
    const idx = lib[tierId].findIndex(m=>m.id===modId);
    if(idx >= 0) return { band:b, lib, tierId, idx, mod: lib[tierId][idx] };
  }
  return null;
}

window.LESSONS = {
  'w-4': [
    { n:1, title:'Structuring a Report',      state:'done',    dur:25, type:'reading' },
    { n:2, title:'Evidence & Sources',        state:'done',    dur:30, type:'video' },
    { n:3, title:'Clear Sentences',           state:'done',    dur:20, type:'speaking' },
    { n:4, title:'Data Tables & Figures',     state:'current', dur:35, type:'sim' },
    { n:5, title:'Peer Review Practice',      state:'todo',    dur:30, type:'scenario' },
    { n:6, title:'Final Draft & Submission',  state:'todo',    dur:40, type:'speaking' },
  ],
  'b-w-2': [
    { n:1, title:'Watch: Plants Near You',  state:'done',    dur:10, type:'video' },
    { n:2, title:'Parts of a Plant',        state:'done',    dur:12, type:'video' },
    { n:3, title:'Draw What You See',       state:'current', dur:15, type:'scenario' },
    { n:4, title:'Say the Names Aloud',     state:'todo',    dur:10, type:'speaking' },
  ],
  'm-w-4': [
    { n:1, title:'The Shape of a Report',   state:'done',    dur:20, type:'reading' },
    { n:2, title:'Facts & Where They Live', state:'done',    dur:25, type:'video' },
    { n:3, title:'Short, Clear Sentences',  state:'current', dur:20, type:'reading' },
    { n:4, title:'Tables & Pictures',       state:'todo',    dur:25, type:'sim' },
    { n:5, title:'Share Your Draft',        state:'todo',    dur:20, type:'speaking' },
  ],
  'o-w-2': [
    { n:1, title:'Notebooks That Work',        state:'done',    dur:15, type:'reading' },
    { n:2, title:'Writing Down Sales & Costs', state:'done',    dur:20, type:'scenario' },
    { n:3, title:'From Paper to Phone',        state:'current', dur:15, type:'video' },
    { n:4, title:'Check Your Week',            state:'todo',    dur:20, type:'sim' },
    { n:5, title:'Show Your Numbers',          state:'todo',    dur:15, type:'speaking' },
  ],
};

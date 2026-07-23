/* ============================================================
   YDC — THE NIGHT TRAIL · app-flow.js
   Canon data + state helpers. No bundler on 3G: script-load
   order is the module system. This file assigns window.* so a
   self-contained app.js can never collide during deploys.
   ============================================================ */
'use strict';

/* DO-tasks — canon */
function assignTask(m){
  const t = m.title.toLowerCase();
  if(t.includes('money math')) return 'Buy 3 small things. Write down each price, what you handed over, and the change you got — check every one.';
  if(t.includes('greetings')) return 'Greet 3 people in English today — a shop, the street, home. Write down what you said and how they replied.';
  if(t.includes('forms')) return 'Photograph one real form or notice from daily life. Circle every word you are unsure of, then look them up.';
  if(t.includes('cooking')) return 'With an adult, cook one dish and note the exact moment it becomes safe to eat. Photograph the steps.';
  if(t.includes('electricity')) return 'With the power OFF, find your home’s breaker and meter. Photograph and label them. Never touch live wires.';
  if(t.includes('body at work')) return 'Film yourself lifting something the right way — back straight, legs bend. Explain the difference in one line.';
  if(t.includes('measuring')) return 'Measure 5 real things with whatever you have — hand spans, string, a ruler. Record each and compare.';
  if(t.includes('water')) return 'Trace where your drinking water comes from today. Photograph each step. Name one risk you see.';
  if(t.includes('customers')) return 'Role-play an unhappy customer with a friend. Record 2 minutes: stay calm, solve one problem.';
  if(t.includes('money records')) return 'Record every kyat in and out for 3 days — notebook or phone. Total it honestly, no hiding.';
  if(t.includes('pricing')) return 'Pick one thing you can make or do. Cost every part, add your time, set a price. Photograph your working.';
  if(t.includes('messages')) return 'Write one real message asking for something — a job, a price, a meeting. Rewrite it twice, then send it if you dare.';
  if(t.includes('tools')) return 'With someone experienced, name 3 tools and their safety rules. Photograph and label them.';
  if(t.includes('materials')) return 'Find 5 objects made of different materials. For each: name the material and one reason it was chosen.';
  if(t.includes('health')) return 'Track your sleep and water for 3 days. Draw the pattern. Name one change you will make.';
  if(t.includes('job plan')) return 'Plan one real paid job on a single page: what, who pays, every cost, your price, the date. Photograph it.';
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
  return 'Apply this module’s skill in the real world, then submit your evidence.';
}
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

window.DISAGREE_TASK = 'Ask two different AIs the same question. Find where they disagree. Resolve it with an experiment or the textbook. Submit your verdict.';
window.DISAGREE_GHOST = {
  a: '“Earthworms improve soil for every plant, everywhere.”',
  b: '“Earthworms can harm forest soils where they are not native.”',
  resolve: 'Resolve it: your textbook chapter, or the soil-pot experiment from Lesson 2. Submit your verdict — written or photo.',
};
function flavorFor(modId){ return modId === 'w-5' ? 'two_ai_disagreement' : 'do_task'; }

window.REVISION_ID = { basic:'b-w-1', middle:'m-w-3', high:'w-3', oos:'o-w-1' };
window.REVISION_QUOTE = {
  basic:  '“Nice try! Now tell me one thing you saw, in your own words.”',
  middle: '“Good start. Add what you measured — and one thing that surprised you.”',
  high:   '“Good measurements. Add units to every value and say what surprised you.”',
  oos:    '“Good phrases. Now slow down — let the customer finish first, then answer.”',
};
function assignState(tierId, modId, band){
  const ov = getOv('ydc-canvas-assign')[modId];
  if(ov && ov === 'awaiting') return ov;
  if(tierId === 'foundation') return 'scored';
  if(modId === REVISION_ID[bandKey(band)]) return 'revision';
  if(modId === progressFor(band).working.active) return 'awaiting';
  return 'notsub';
}

/* struggle moments: no emoji — warm words carry it (dignity fence) */
window.ATTENTIONS = {
  basic: [
    { href:'#/module/b-w-1', title:'Your recording came back', sub:'Your mentor left a note — one more try. You can do it.' },
  ],
  middle: [
    { href:'#/module/m-w-3', title:'Assignment returned', sub:'Lab Basics & Safety — one more pass with your mentor’s note.' },
  ],
  high: [
    { href:'#/module/w-3', title:'Assignment returned', sub:'Lab Methods & Safety — one more pass with your mentor’s note.' },
  ],
  oos: [
    { href:'#/module/o-w-1', title:'Assignment returned', sub:'Work English II — one more pass with your mentor’s note.' },
  ],
};
function attentionFor(band){ return ATTENTIONS[bandKey(band)]; }

/* module meta — seeded (high library first, same order as canon) */
window.MOD_META = {};
Object.values(MODULES).flat().forEach(m => { MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 4) }; });
MOD_META['w-4'].lessons = 6;
Object.values(BAND_MODULES.basic).flat().forEach(m => { MOD_META[m.id] = { lessons: 3 + Math.floor(rng() * 2) }; });
Object.values(BAND_MODULES.middle).flat().forEach(m => { MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 2) }; });
MOD_META['b-w-2'].lessons = 4;
MOD_META['m-w-4'].lessons = 5;
Object.values(OOS_MODULES).flat().forEach(m => { MOD_META[m.id] = { lessons: 3 + Math.floor(rng() * 3) }; });
MOD_META['o-w-2'].lessons = 5;

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

window.LESSON_BANK = [
  'Guided Reading','Core Concepts','Worked Examples','Practice Task',
  'Discussion Prep','Applied Exercise','Review & Reflection','Mastery Check',
];
function lessonsFor(modId, state){
  if(LESSONS[modId]) return LESSONS[modId];
  const seed = modId.split('').reduce((a,c)=>a + c.charCodeAt(0)*7, 13);
  const r = mulberry32(seed);
  const n = MOD_META[modId].lessons;
  const basic = modId.startsWith('b-');
  const oos = modId.startsWith('o-');
  const pool = basic ? TYPE_BASIC : oos ? TYPE_OOS : TYPE_KEYS;
  const used = new Set();
  return Array.from({length:n}, (_,i)=>{
    let t; do { t = LESSON_BANK[Math.floor(r()*LESSON_BANK.length)]; } while(used.has(t));
    used.add(t);
    return { n:i+1, title:t, state: state==='done' ? 'done' : 'todo', dur: 15 + Math.floor(r()*6)*5, type: pool[Math.floor(r()*pool.length)] };
  });
}

/* ---------- session state — invented, on-device only ---------- */
function getOv(key){ try{ return JSON.parse(localStorage.getItem(key)||'{}'); }catch(e){ return {}; } }
function setOv(key, id, val){ const o = getOv(key); o[id] = val; try{ localStorage.setItem(key, JSON.stringify(o)); }catch(e){} }

/* lesson states = canon base + the learner's own on-device marks */
function lessonStates(modId, state){
  const base = lessonsFor(modId, state).map(l=>({ ...l }));
  const doneSet = new Set(getOv('ydc-canvas-lessons')[modId] || []);
  base.forEach(l=>{ if(doneSet.has(l.n)) l.state = 'done'; });
  let seen = false;
  base.forEach(l=>{ if(l.state === 'current'){ if(seen) l.state = 'todo'; else seen = true; } });
  if(!seen){ const nxt = base.find(l=>l.state !== 'done'); if(nxt) nxt.state = 'current'; }
  return base;
}
function markLessonDone(modId, n){
  const o = getOv('ydc-canvas-lessons');
  const arr = o[modId] || [];
  if(!arr.includes(n)){ arr.push(n); setOv('ydc-canvas-lessons', modId, arr); }
  const band = getBand();
  const lib = libraryFor(band);
  const tierId = modId.split('-').includes('f') ? 'foundation' : 'working';
  const idx = lib[tierId].findIndex(m=>m.id===modId);
  const left = lessonStates(modId, moduleState(tierId, idx, band)).filter(l=>l.state!=='done').length;
  route();
  toast(left === 0 ? 'All lessons done — the real-world quest is waiting 🌍' : 'Lesson marked done ✓');
}
function pickFmt(btn){ btn.classList.toggle('on'); }
function submitQuest(modId){
  setOv('ydc-canvas-assign', modId, 'awaiting');
  route();
  toast('Submitted — two friends will review it against the sealed rubric');
}

/* career — canon; the road, never the person */
window.CAREER = {
  families: [
    'Technology & Digital','Health & Life Sciences','Business & Enterprise',
    'Creative & Communication','Engineering & Making','Community & Service',
  ],
  readiness: ['Exploring','Focusing','Building','Ready'],
  stages: [
    { band:'14–15', em:'🧪', name:'Explore',
      copy:'Try everything. No choosing yet — curiosity is the work.', gates:[], kind:'families' },
    { band:'16–17', em:'🎯', name:'Focus',
      copy:'Two families go deeper. Real projects begin.', gates:['English L1'], kind:'focus' },
    { band:'18–20', em:'🔧', name:'Specialize',
      copy:'Skills sharpen into evidence others can trust.', gates:['Portfolio','Mentorship','English L2'], kind:'specialize' },
    { band:'20+', em:'🚀', name:'Transition',
      copy:'Move to the adult platform — referrals, real roles, the full network.', gates:[], kind:'transition' },
  ],
};

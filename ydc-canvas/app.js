/* ============================================================
   YDC — THE NIGHT TRAIL · open canvas (S320)
   Content architecture: ratified R1–R4 canon (five majors, four
   tiers, band worlds, assignment loop, career road).
   Feel: entirely new. All learner data INVENTED (seeded PRNG).
   English-only UI. Myanmar string placements wait for CCO.
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
const rng = mulberry32(20260719);

/* ---------- canon model (invented) ---------- */
const LEARNER = { firstName:'Nanda', fullName:'Nanda Lin', tierId:'working', mentor:'M. Thiri' };

const BANDS = { basic:'Basic', middle:'Middle', high:'High', out_of_school:'Out of school' };
function getBand(){ try{ return localStorage.getItem('ydc-canvas-band') || 'high'; }catch(e){ return 'high'; } }
function setBand(v){ try{ localStorage.setItem('ydc-canvas-band', v); }catch(e){} route(); }
function bandKey(band){ return band==='basic' ? 'basic' : band==='middle' ? 'middle' : 'high'; }

const REGISTER = {
  basic:  { bubble:'Ready to play and learn?' },
  middle: { bubble:'Your trail is waiting. One more step?' },
  high:   { bubble:'Your trail is waiting. One more step?' },
  out_of_school:{ bubble:'Your trail is waiting. One more step?' },
};
function registerFor(band){ return REGISTER[band] || REGISTER.high; }

/* time-aware greeting — the trail knows what the sky looks like */
function dayPart(){ const h = new Date().getHours(); return h < 5 ? 'night' : h < 11 ? 'morning' : h < 17 ? 'afternoon' : h < 22 ? 'evening' : 'night'; }
const GREET = { morning:'Good morning', afternoon:'Good afternoon', evening:'Good evening', night:'Still up' };
const SUBLINE = {
  morning:   'A fresh page on your trail.',
  afternoon: 'Your trail is right where you left it.',
  evening:   'The whole trail is yours tonight.',
  night:     'The stars are out. So is your trail.',
};
function greetFor(band){ return band === 'basic' ? `Hello, ${LEARNER.firstName}!` : `${GREET[dayPart()]}, ${LEARNER.firstName}`; }
function subFor(band){ return band === 'basic' ? 'Come play on your trail!' : SUBLINE[dayPart()]; }
function skyEm(){ const p = dayPart(); return (p === 'morning' || p === 'afternoon') ? '☀️' : '🌙'; }

const TIERS = [
  { id:'foundation',   name:'Foundation',   n:1, status:'done',    em:'🌱', summary:'Core study skills and subject foundations.' },
  { id:'working',      name:'Working',      n:2, status:'current', em:'🎒', summary:'Applied skills: reading, writing, lab method, presentation.' },
  { id:'professional', name:'Professional', n:3, status:'locked',  em:'🧭', summary:'Independent project work and specialist subject tracks.' },
  { id:'advanced',     name:'Advanced',     n:4, status:'locked',  em:'🏆', summary:'Mastery portfolio and community leadership.' },
];

/* five majors — canon names, reasoning captions; canvas adds color + emoji */
const MAJORS = {
  english:   { name:'English',   cap:'Live communication',  em:'💬', c:'var(--c-english)',   c1:'#FF7A85', c2:'#FF9E64' },
  math:      { name:'Math',      cap:'Formal reasoning',    em:'🧮', c:'var(--c-math)',      c1:'#FFC24B', c2:'#FF8E53' },
  physics:   { name:'Physics',   cap:'Causal reasoning',    em:'⚡', c:'var(--c-physics)',   c1:'#54C8FF', c2:'#7C6CFF' },
  chemistry: { name:'Chemistry', cap:'Process reasoning',   em:'🧪', c:'var(--c-chemistry)', c1:'#B28CFF', c2:'#FF6E9E' },
  biology:   { name:'Biology',   cap:'Systems reasoning',   em:'🌿', c:'var(--c-biology)',   c1:'#4ADE80', c2:'#2DD4BF' },
};
const MAJOR_ORDER = ['english','math','physics','chemistry','biology'];

function langLine(tierId){
  return (tierId==='foundation' || tierId==='working')
    ? 'Taught MM-first · AI-translated · CCO-gated'
    : 'English-medium tier';
}

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
const PROGRESS = {
  foundation: { done: 14, total: 14 },
  working:    { done: 3,  total: 10, active: 'w-4' },
};

/* R4 band worlds — per-band libraries (invented shapes, HA/CCO lane in production) */
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
const BAND_PROGRESS = {
  basic:  { foundation: { done: 8,  total: 8 },  working: { done: 1, total: 6, active: 'b-w-2' } },
  middle: { foundation: { done: 10, total: 10 }, working: { done: 3, total: 8, active: 'm-w-4' } },
};
function libraryFor(band){ return band==='basic' ? BAND_MODULES.basic : band==='middle' ? BAND_MODULES.middle : MODULES; }
function progressFor(band){ return band==='basic' ? BAND_PROGRESS.basic : band==='middle' ? BAND_PROGRESS.middle : PROGRESS; }

const LESSONS = {
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
};

/* ============================================================
   THE LADDER LAW (mechanical spine — nothing decorative):
   · every module is a QUEST that proves one MASTERY (a DO-thing)
   · a tier's GATE checks every mastery + the English test
   · passing the gate PROMOTES you a tier
   The gate is always visible on the trail before it is reachable.
   ============================================================ */
const PROOFS = {
  /* high — foundation (all proven) */
  'f-1':'See how living things are built',       'f-2':'Explain how plants eat light',
  'f-3':'Map the body’s systems',                'f-4':'Trace who eats whom',
  'f-5':'Read what you inherit',                 'f-6':'Present the living world',
  'f-7':'Tell matter apart — and why',           'f-8':'Mix safely, observe honestly',
  'f-9':'Describe how things move',              'f-10':'Find the forces around you',
  'f-11':'Say your first English sentences',     'f-12':'Read English out loud',
  'f-13':'Count, compare, record',               'f-14':'See patterns and prove them',
  /* high — working */
  'w-1':'Hold a real conversation',              'w-2':'Read science and explain it',
  'w-3':'Run a safe, measured experiment',       'w-4':'Write a report others trust',
  'w-5':'Verify a claim with evidence',          'w-6':'Predict and show a reaction',
  'w-7':'Measure energy in your home',           'w-8':'Speak so people follow',
  'w-9':'Prove a point with numbers',            'w-10':'Deliver a project for your community',
  /* basic — foundation */
  'b-f-1':'Name the plants near you',            'b-f-2':'Know the animals near home',
  'b-f-3':'Name what your body does',            'b-f-4':'See what mixing does',
  'b-f-5':'Show how things move',                'b-f-6':'Say words for your day',
  'b-f-7':'Listen and answer',                   'b-f-8':'Count and find shapes',
  /* basic — working */
  'b-w-1':'Talk about your day in English',      'b-w-2':'Show and name what you found',
  'b-w-3':'Measure real things',                 'b-w-4':'Watch a change and say what happened',
  'b-w-5':'Make things move and explain',        'b-w-6':'Finish your nature project',
  /* middle — foundation */
  'm-f-1':'Name the tiny building blocks',       'm-f-2':'Explain how plants make food',
  'm-f-3':'Explain your body systems',           'm-f-4':'Follow a food chain',
  'm-f-5':'Sort matter and mixtures',            'm-f-6':'Spot a simple reaction',
  'm-f-7':'Measure pushes and pulls',            'm-f-8':'Write clear sentences',
  'm-f-9':'Read and retell short texts',         'm-f-10':'Work with fractions and patterns',
  /* middle — working */
  'm-w-1':'Keep a conversation going',           'm-w-2':'Read an article and retell it',
  'm-w-3':'Do a safe lab drill',                 'm-w-4':'Write a short clear report',
  'm-w-5':'Explain an ecosystem near you',       'm-w-6':'Track energy at home',
  'm-w-7':'Use data from your life',             'm-w-8':'Run a community project',
};
function proofFor(id){ return PROOFS[id] || 'Master this module'; }

/* the gate, stated plainly — visible before reachable */
function gateCard(tierName, doneCount, total){
  return `<div class="gatecard rv">
    <div class="t">The ${tierName} Gate — two keys, both earned</div>
    <div class="key"><span class="em">🔑</span><span><b>Every ${tierName} mastery proven.</b><br>${doneCount} of ${total} so far — each one checked by your mentor and two friends.</span></div>
    <div class="key"><span class="em">📖</span><span><b>The English gate.</b><br>Level 1 → Level 2 — its own test, opened when your masteries are ready.</span></div>
    <div class="s">Nothing here is given. Everything is checked. That is why it means something.</div>
  </div>`;
}

/* ============================================================
   THE SOUL — every mechanic means one of two things humanly:
   CURIOSITY (wondering is rewarded, never walled) and
   GENEROSITY (we give before we ask; learners give each other).
   ============================================================ */
/* curiosity: asking “why” is never a dead end — every mastery answers it */
const WHY_MAJOR = {
  english:  'because people who say it clearly get heard — in class, at work, anywhere.',
  math:     'because numbers stop being scary the moment you can make them talk.',
  physics:  'because the world runs on rules you can see — once you know where to look.',
  chemistry:'because your kitchen is already a lab. This teaches you to read it.',
  biology:  'because once you see how living things work, you can’t unsee it.',
};
function whyFor(major){ return WHY_MAJOR[major]; }

/* curiosity: side paths — free wonders, always open, cost nothing */
const WONDERS = {
  light: {
    q:'Why do plants reach for light?', tag:'Biology',
    a:'A plant is a solar panel with roots. Its leaves carry tiny engines that eat light — light is dinner. So it reaches, bends, leans its whole body, because moving toward light is how it eats. Next time you see a plant tilted toward a window, you are watching dinner time in slow motion.',
    quest:['f-2','Plants & Photosynthesis'],
  },
  sky: {
    q:'Why is the sky blue?', tag:'Physics',
    a:'Sunlight looks white, but it is a crowd of colors traveling together. Air bumps the blue part of the crowd sideways more than the rest — so blue light gets scattered everywhere, and the whole sky glows with it. At sunset the light takes a longer road, the blue gets lost along the way, and the reds arrive instead.',
    quest:null,
  },
  dream: {
    q:'Why do we dream?', tag:'Biology',
    a:'Your brain does not fully switch off at night — it sorts the day. Memories get replayed, mixed, and filed, and dreams are what that filing feels like from the inside. Scientists still argue about the details. That is not a dead end — that is an open door with your name on it.',
    quest:null,
  },
};

/* curiosity: free tastes of locked tiers — looking costs nothing */
const PEEKS = {
  composition: { name:'Advanced Composition', zone:'Professional',
    taste:'One idea, three drafts. You take a rough paragraph and rebuild it until a stranger cannot misunderstand it — then until they cannot forget it. Professional tier work is slower, deeper, and entirely yours.' },
  data: { name:'Data Analysis', zone:'Professional',
    taste:'You stop asking “what do the numbers say?” and start asking “what are they hiding?” Real datasets, real mess, real conclusions you defend out loud.' },
  research: { name:'Research Methods', zone:'Professional',
    taste:'A question you are genuinely curious about, a method to chase it honestly, and a mentor who keeps you truthful. It ends with findings you present to people who matter.' },
};

/* generosity: sharing — the trail is meant to travel */
const SHARE_URL = 'https://talentsolutionsmyanmar-max.github.io/ydc-canvas/';
function doShare(payload){
  if(navigator.share){ navigator.share({ title:payload.title, text:payload.text, url:SHARE_URL }).catch(()=>{}); }
  else if(navigator.clipboard){ navigator.clipboard.writeText(payload.text + ' ' + SHARE_URL).then(()=>toast('Copied — paste it anywhere 💛')).catch(()=>toast(payload.text)); }
  else toast(payload.text);
}
function shareIt(kind){
  if(kind === 'promotion') doShare({ title:'Gate passed!', text:'I just passed the Foundation Gate on my Night Trail — every mastery proven, English Level 1 cleared. ✨' });
  if(kind === 'keepsake') doShare({ title:'My first keepsake', text:'My very first session on the Night Trail already made something I can keep and show — a field sketch. 🌿' });
}
function shareCert(el){ doShare({ title:'Mastery proven', text:'I proved a mastery on my Night Trail: ' + (el.dataset.proof || '') + ' — verified by my mentor. 🏅' }); }
function boostMate(btn, name){
  btn.textContent = 'sent 💛'; btn.disabled = true; btn.classList.add('sent');
  toast('Boost sent to ' + name + ' — they will see it tonight');
}
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2300);
}

/* lesson types — canon + emoji */
const TYPE_META = {
  sim:        { em:'🎮', label:'Sim' },
  video:      { em:'🎬', label:'Video' },
  experiment: { em:'🔬', label:'Experiment' },
  reading:    { em:'📖', label:'Reading' },
  scenario:   { em:'💬', label:'Scenario' },
  speaking:   { em:'🎤', label:'Speaking' },
};
const TYPE_KEYS = Object.keys(TYPE_META);
const TYPE_ENGLISH = ['speaking','scenario','speaking','scenario','video','reading'];
const TYPE_BASIC = ['video','sim','video','scenario','video','sim'];

/* sealed rubric — canon, never changed */
const RUBRIC = [
  ['Understanding', 30],
  ['Application',   30],
  ['Creativity',    20],
  ['Presentation',  20],
];

const PEER_NAMES = ['Su Myat','Kyaw Zin','Hnin Wai','Min Khant','Thaw Dar','Zar Ni','Pyae Sone','May Thu'];
const PEER_COLORS = ['var(--c-english)','var(--c-math)','var(--c-physics)','var(--c-chemistry)','var(--c-biology)','#F472B6','#34D399','#FBBF24'];
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

/* the circle — invented peer activity, warm not comparative (dignity: no scores, no ranks) */
const CIRCLE_ACTS = [
  ['🌿','finished her plant drawing quest'],
  ['📸','submitted a photo quest'],
  ['🎤','is practicing speaking out loud'],
  ['💛','left a kind review on a friend’s draft'],
  ['🧪','tried the kitchen-sink reaction'],
  ['🏅','earned a module certificate'],
  ['🎮','solved the sim’s hardest level'],
  ['🎁','shared her notes with the circle'],
  ['📖','read two lessons before dinner'],
];
function circleFor(band){
  const r = mulberry32(9000 + bandKey(band).length * 77);
  const names = [...PEER_NAMES];
  const out = [];
  for(let i=0; i<4; i++){
    const ni = Math.floor(r()*names.length);
    const nm = names.splice(ni,1)[0];
    const act = CIRCLE_ACTS[Math.floor(r()*CIRCLE_ACTS.length)];
    out.push({ nm, em:act[0], text:act[1], color:PEER_COLORS[Math.floor(r()*PEER_COLORS.length)] });
  }
  return out;
}

/* DO-tasks — canon */
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

const DISAGREE_TASK = 'Ask two different AIs the same question. Find where they disagree. Resolve it with an experiment or the textbook. Submit your verdict.';
const DISAGREE_GHOST = {
  a: '“Earthworms improve soil for every plant, everywhere.”',
  b: '“Earthworms can harm forest soils where they are not native.”',
  resolve: 'Resolve it: your textbook chapter, or the soil-pot experiment from Lesson 2. Submit your verdict — written or photo.',
};
function flavorFor(modId){ return modId === 'w-5' ? 'two_ai_disagreement' : 'do_task'; }

const REVISION_ID = { basic:'b-w-1', middle:'m-w-3', high:'w-3' };
const REVISION_QUOTE = {
  basic:  '“Nice try! Now tell me one thing you saw, in your own words.”',
  middle: '“Good start. Add what you measured — and one thing that surprised you.”',
  high:   '“Good measurements. Add units to every value and say what surprised you.”',
};
function assignState(tierId, modId, band){
  if(tierId === 'foundation') return 'scored';
  if(modId === REVISION_ID[bandKey(band)]) return 'revision';
  if(modId === progressFor(band).working.active) return 'awaiting';
  return 'notsub';
}

/* struggle moments: no emoji — warm words carry it (dignity fence) */
const ATTENTIONS = {
  basic: [
    { href:'#/module/b-w-1', title:'Your recording came back', sub:'Your mentor left a note — one more try. You can do it.' },
  ],
  middle: [
    { href:'#/module/m-w-3', title:'Assignment returned', sub:'Lab Basics & Safety — one more pass with your mentor’s note.' },
  ],
  high: [
    { href:'#/module/w-3', title:'Assignment returned', sub:'Lab Methods & Safety — one more pass with your mentor’s note.' },
  ],
};
function attentionFor(band){ return ATTENTIONS[bandKey(band)]; }

/* module meta — seeded (high library first, same order as canon) */
const MOD_META = {};
Object.values(MODULES).flat().forEach(m => { MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 4) }; });
MOD_META['w-4'].lessons = 6;
Object.values(BAND_MODULES.basic).flat().forEach(m => { MOD_META[m.id] = { lessons: 3 + Math.floor(rng() * 2) }; });
Object.values(BAND_MODULES.middle).flat().forEach(m => { MOD_META[m.id] = { lessons: 4 + Math.floor(rng() * 2) }; });
MOD_META['b-w-2'].lessons = 4;
MOD_META['m-w-4'].lessons = 5;

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

const LESSON_BANK = [
  'Guided Reading','Core Concepts','Worked Examples','Practice Task',
  'Discussion Prep','Applied Exercise','Review & Reflection','Mastery Check',
];
function lessonsFor(modId, state){
  if(LESSONS[modId]) return LESSONS[modId];
  const seed = modId.split('').reduce((a,c)=>a + c.charCodeAt(0)*7, 13);
  const r = mulberry32(seed);
  const n = MOD_META[modId].lessons;
  const basic = modId.startsWith('b-');
  const pool = basic ? TYPE_BASIC : TYPE_KEYS;
  const used = new Set();
  return Array.from({length:n}, (_,i)=>{
    let t; do { t = LESSON_BANK[Math.floor(r()*LESSON_BANK.length)]; } while(used.has(t));
    used.add(t);
    return { n:i+1, title:t, state: state==='done' ? 'done' : 'todo', dur: 15 + Math.floor(r()*6)*5, type: pool[Math.floor(r()*pool.length)] };
  });
}

/* career — canon; the road, never the person */
const CAREER = {
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

/* ---------- theme ---------- */
function themeToggle(){
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'night' ? 'day' : 'night';
  document.documentElement.setAttribute('data-theme', next);
  try{ localStorage.setItem('ydc-canvas-theme', next); }catch(e){}
  renderThemeBtn();
}
function renderThemeBtn(){
  const b = document.getElementById('themebtn');
  if(b) b.textContent = document.documentElement.getAttribute('data-theme') === 'night' ? '☀️' : '🌙';
}

/* ---------- shell ---------- */
function bandSwitcher(){
  const cur = getBand();
  const opts = Object.entries(BANDS).map(([v,label])=>`<option value="${v}" ${v===cur?'selected':''}>${label}</option>`).join('');
  return `<select class="pillbtn" title="School band — demo switcher" onchange="setBand(this.value)">${opts}</select>`;
}

function shell(content, routeName){
  const active = LESSONS ? progressFor(getBand()).working.active : null;
  return `
  <div class="stars" aria-hidden="true">${starField()}</div>
  <div class="shoot" aria-hidden="true"></div>
  <div class="firefly" aria-hidden="true"></div>
  <div class="firefly f2" aria-hidden="true"></div>
  <div class="firefly f3" aria-hidden="true"></div>
  <header class="topbar">
    <div class="topbar-in">
      <a class="brand" href="#/"><span class="bug"></span><span class="full">YDC&nbsp;</span><span style="color:var(--dim);font-weight:700;font-size:13px">night trail</span></a>
      <nav class="topnav">
        <a href="#/" class="${routeName==='home'?'on':''}">Home</a>
        <a href="#/map" class="${routeName==='map'?'on':''}">Trail map</a>
        <a href="#/horizon" class="${routeName==='horizon'?'on':''}">Horizon</a>
      </nav>
      <div class="spacer"></div>
      ${bandSwitcher()}
      <button class="pillbtn" id="themebtn" onclick="themeToggle()" aria-label="Toggle day/night"></button>
    </div>
  </header>
  ${content}
  <nav class="tabbar"><div class="tabbar-in">
    <a href="#/" class="${routeName==='home'?'on':''}"><span class="em">🏠</span>Home</a>
    <a href="#/map" class="${routeName==='map'?'on':''}"><span class="em">📍</span>Trail</a>
    <a href="#/module/${active}" class="${routeName==='quest'?'on':''}"><span class="em">🎯</span>Quest</a>
    <a href="#/horizon" class="${routeName==='horizon'?'on':''}"><span class="em">🌅</span>Horizon</a>
  </div></nav>`;
}
function starField(){
  const r = mulberry32(42);
  let s = '';
  for(let i=0; i<46; i++){
    s += `<i style="left:${(r()*100).toFixed(1)}%;top:${(r()*100).toFixed(1)}%;--tw:${(2+r()*3.5).toFixed(1)}s;animation-delay:${(r()*3).toFixed(1)}s"></i>`;
  }
  for(let i=0; i<10; i++){
    s += `<i class="b" style="left:${(r()*100).toFixed(1)}%;top:${(r()*100).toFixed(1)}%;--tw:${(5+r()*4).toFixed(1)}s;animation-delay:${(r()*5).toFixed(1)}s"></i>`;
  }
  return s;
}
function footNote(text){
  return `<div class="foot-note">${text || 'Design demo — invented learners, zero real data · this flow is designed, not wired'}</div>`;
}

/* ---------- trail renderer (the heart) ---------- */
function trailHtml(items, opts){
  /* items: [{em, color, state:'done'|'current'|'todo'|'gate'|'gatepassed', label, href}] */
  const spacing = opts && opts.tight ? 108 : 128;
  const H = items.length * spacing + 90;
  const pts = items.map((it, i)=>({
    it,
    x: 0.5 + 0.24 * Math.sin(i * 1.15 + 0.6) * (i===0 ? 0 : 1),
    y: 50 + i * spacing,
  }));
  const pathD = pts.map((p,i)=>{
    if(i===0) return '';
    const a = pts[i-1], b = p;
    const my = (a.y + b.y) / 2;
    return `C ${a.x*100} ${my}, ${b.x*100} ${my}, ${b.x*100} ${b.y}`;
  }).join(' ');
  const first = pts[0];
  /* curiosity: a side path branches off the current node — free, always open */
  let branchPath = '', sideNode = '';
  if(opts && opts.side){
    const ci = pts.findIndex(p=>p.it.state==='current');
    if(ci >= 0){
      const c = pts[ci];
      const dir = c.x > 0.5 ? -1 : 1;
      const sx = c.x + dir * 0.27;
      branchPath = `<path class="branch" d="M ${c.x*100} ${c.y} L ${sx*100} ${c.y+8}" vector-effect="non-scaling-stroke"/>`;
      sideNode = `<a class="tnode sidepath" href="${opts.side.href}" style="left:${(sx*100).toFixed(1)}%;top:${c.y+8}px;--nc:var(--c-teal)">
        <span class="orb">✨</span>
        <span class="tn">${opts.side.label}</span>
      </a>`;
    }
  }
  return `
  <div class="trail" style="height:${H}px">
    <svg class="path" viewBox="0 0 100 ${H}" preserveAspectRatio="none">
      <path d="M ${first.x*100} ${first.y} ${pathD}" vector-effect="non-scaling-stroke"/>
      <path class="pulse" pathLength="100" d="M ${first.x*100} ${first.y} ${pathD}" vector-effect="non-scaling-stroke"/>
      ${branchPath}
    </svg>
    ${pts.map(p=>`
      <a class="tnode ${p.it.state}" href="${p.it.href}" style="left:${(p.x*100).toFixed(1)}%;top:${p.y}px;--nc:${p.it.color}">
        ${p.it.state==='current' ? '<span class="youflag">YOU ARE HERE</span>' : ''}
        <span class="orb">${p.it.state==='done' ? '✓' : p.it.em}</span>
        <span class="tn">${p.it.label}</span>
      </a>`).join('')}
    ${sideNode}
  </div>`;
}

/* ============================================================
   SCREEN 1 · HOME — greeting, tonight's quest, the trail, circle
   ============================================================ */
function viewHome(){
  const band = getBand();
  const reg = registerFor(band);
  const lib = libraryFor(band);
  const prog = progressFor(band);
  const modIdx = lib.working.findIndex(m=>m.id===prog.working.active);
  const mod = lib.working[modIdx];
  const mj = MAJORS[mod.major];
  const lessons = LESSONS[mod.id];
  const cur = lessons.find(l=>l.state==='current');
  const doneCount = lessons.filter(l=>l.state==='done').length;
  const tier = TIERS.find(t=>t.id===LEARNER.tierId);

  const trailItems = lib.working.map((m,i)=>{
    const st = moduleState('working', i, band);
    const mm = MAJORS[m.major];
    return {
      em: mm.em, color: mm.c,
      state: st==='done' ? 'done' : st==='active' ? 'current' : 'todo',
      label: m.title, href: `#/module/${m.id}`,
    };
  });
  const doneW = trailItems.filter(t=>t.state==='done').length;
  /* the next gate, ON the trail — visible before reachable */
  trailItems.push({ em:'🔒', color:'var(--c-gold)', state:'gate', label:'The Working Gate', href:'#/map' });

  const circle = circleFor(band);
  const attn = attentionFor(band);

  const content = `
  <main class="page">
    <section class="hero rv">
      <h1>${greetFor(band)}</h1>
      <p class="sub">${skyEm()} ${subFor(band)}</p>
      <div class="bubble"><span class="who"><span class="bug"></span>MAYA · your AI buddy</span>
        ${reg.bubble} I'm here if you get stuck.</div>
      <p class="posline"><b>AI is the tutor.</b> YDC is the proof.</p>
    </section>

    <section class="rv">
      <div class="quest press" style="--qc1:${mj.c1};--qc2:${mj.c2}">
        <div class="qk">Tonight's quest · ${mj.name}</div>
        <h2>${mj.em} ${mod.title}</h2>
        <div class="qs">Module ${modIdx+1} · ${doneCount} of ${lessons.length} lessons done · ${tier.name} tier</div>
        <div class="qproof">Proving: ${proofFor(mod.id)}</div>
        <div class="qbar"><i style="width:${Math.round(doneCount/lessons.length*100)}%"></i></div>
        <div class="qdots">${lessons.map(l=>`<span class="qd ${l.state}"></span>`).join('')}</div>
        <div class="qrow">
          <span class="qnext">Next: ${TYPE_META[cur.type].em} ${cur.title} · ${cur.dur} min</span>
          <a class="qbtn" href="#/module/${mod.id}">Continue ▶</a>
        </div>
      </div>
    </section>

    ${attn.map(a=>`
    <section class="rv" style="margin-top:14px">
      <a class="statusbanner warn press" href="${a.href}" style="display:flex;text-decoration:none">
        <span><span class="t">${a.title}</span><br><span style="color:var(--mut)">${a.sub}</span></span>
      </a>
    </section>`).join('')}

    <section class="rv" style="margin-top:14px">
      <div class="keepsake">
        <span class="art"><svg width="38" height="38" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 34 C20 26 20 18 20 10" stroke="#4ADE80" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M20 24 C14 22 11 17 11 12 C16 13 20 17 20 24" fill="#4ADE80" opacity=".8"/><path d="M20 20 C26 18 29 13 29 8 C24 9 20 13 20 20" fill="#4ADE80" opacity=".6"/><circle cx="20" cy="8" r="2.5" fill="#FFD166"/></svg></span>
        <span><span class="t">From your very first session</span>
        <span class="s">Your first field sketch — kept forever, yours to show. The platform gives before it asks.</span></span>
        <button class="sharepill" onclick="shareIt('keepsake')">Show it off</button>
      </div>
    </section>

    <div class="sechead rv"><h3>Your trail</h3><a class="more" href="#/map">Full map →</a></div>
    <section class="trailwrap rv">
      <div class="summit" style="margin-bottom:18px">
        <span class="medal">🏅</span>
        <span><span class="t">Foundation Gate — passed!</span><br>
        <span class="s">Every Foundation mastery proven and verified. The gate opened; you walked through.</span></span>
      </div>
      ${trailHtml(trailItems, { side:{ label:'Side path · free wonder', href:'#/wonder/light' } })}
      ${gateCard('Working', doneW, lib.working.length)}
      <div class="fogzone" style="margin-top:14px">
        <div class="mist"></div>
        <div class="t">☁️ Professional tier — beyond the gate</div>
        <div class="s">The mist clears when the Working Gate and the English gate are both behind you. Nothing unlocks early — but looking costs nothing.</div>
        <div class="peeks"><a href="#/peek/composition">Advanced Composition</a><a href="#/peek/data">Data Analysis</a><a href="#/peek/research">Research Methods</a></div>
      </div>
    </section>

    <div class="sechead rv"><h3>Your circle</h3><span class="more">4 friends learning</span></div>
    <section class="circle-strip rv">
      ${circle.map(c=>`
        <div class="mate">
          <div class="hd"><span class="ava" style="--ac:${c.color}">${c.nm.split(' ').map(w=>w[0]).join('')}</span>
          <span class="nm">${c.nm}</span></div>
          <div class="act"><span class="em">${c.em}</span>${c.text}</div>
          <button class="boost" onclick="boostMate(this,'${c.nm}')">💛 boost</button>
        </div>`).join('')}
      <div class="mate" style="display:grid;place-items:center;text-align:center">
        <div class="act">💬<br>Study circles open<br>when your mentor<br>pairs you up.</div>
      </div>
    </section>

    <section class="rv" style="margin-top:26px">
      <a class="horizon-tease press" href="#/horizon" style="display:block">
        <span class="sun"></span>
        <h3>Where does this trail go? 🌅</h3>
        <p>All the way to a career — families to explore, gates to pass, and a sunrise with your name on it.</p>
        <span class="qbtn">See the horizon</span>
      </a>
    </section>
    ${footNote('Design demo · invented learners, zero real data · built for people the education system forgot')}
  </main>`;
  return shell(content, 'home');
}

/* ============================================================
   SCREEN 2 · TRAIL MAP — all four zones
   ============================================================ */
function viewMap(){
  const band = getBand();
  const lib = libraryFor(band);

  const zones = TIERS.map(t=>{
    const headCls = t.status==='done' ? 'done' : t.status==='current' ? 'cur' : '';
    const tag = t.status==='done' ? '<span class="chip" style="color:var(--c-gold);border-color:color-mix(in srgb, var(--c-gold) 45%, transparent)">🏅 Complete</span>'
      : t.status==='current' ? '<span class="chip" style="color:var(--c-teal);border-color:color-mix(in srgb, var(--c-teal) 45%, transparent)">You are here</span>'
      : '<span class="chip">🔒 Locked</span>';
    let body = '';
    if(t.status === 'locked'){
      body = `<div class="fogzone">
        <div class="mist"></div>
        <div class="t">☁️ Still in the mist</div>
        <div class="s">Complete the ${TIERS[t.n-2].name} tier and pass the gate to enter ${t.name} — but looking costs nothing.</div>
        <div class="peeks"><a href="#/peek/composition">Advanced Composition</a><a href="#/peek/data">Data Analysis</a><a href="#/peek/research">Research Methods</a></div>
      </div>`;
    } else {
      const items = lib[t.id].map((m,i)=>{
        const st = moduleState(t.id, i, band);
        const mm = MAJORS[m.major];
        return {
          em: mm.em, color: mm.c,
          state: st==='done' ? 'done' : st==='active' ? 'current' : 'todo',
          label: m.title, href: `#/module/${m.id}`,
        };
      });
      /* gates are physical: a monument where one passed, a beacon where one waits */
      if(t.status==='done') items.push({ em:'🏅', color:'var(--c-gold)', state:'gatepassed', label:`${t.name} Gate — passed`, href:'#/promotion' });
      if(t.status==='current') items.push({ em:'🔒', color:'var(--c-gold)', state:'gate', label:`The ${t.name} Gate`, href:'#/map' });
      body = trailHtml(items, { tight: t.status==='done' });
      if(t.status==='current') body += gateCard(t.name, progressFor(band).working.done, lib.working.length);
    }
    return `<section class="zone rv">
      <div class="zone-head ${headCls}">
        <span class="zb">${t.em}</span>
        <span><span class="zt">${t.name}</span><div class="zs">${t.summary} — ${langLine(t.id)}</div></span>
        <span class="ztag">${tag}</span>
      </div>
      ${body}
    </section>`;
  }).join('');

  const content = `
  <main class="page">
    <section class="hero rv">
      <h1>The trail map <span class="em">📍</span></h1>
      <p class="sub">Four zones. Five colors. Every step is real.</p>
    </section>
    <section class="maplegend rv">
      <span><b>🎯 Quest</b> proves one mastery</span>
      <span><b>🏁 Gate</b> checks them all — with the English test</span>
      <span><b>🏆 Pass</b> and you rise a tier</span>
    </section>
    ${zones}
    ${footNote()}
  </main>`;
  return shell(content, 'map');
}

/* ============================================================
   SCREEN 3 · QUEST (module) — lessons, real-world quest, Maya
   ============================================================ */
function viewModule(modId){
  const band = getBand();
  const lib = libraryFor(band);
  const tierId = modId.split('-').includes('f') ? 'foundation' : 'working';
  const tier = TIERS.find(t=>t.id===tierId);
  const idx = lib[tierId].findIndex(m=>m.id===modId);
  const mod = idx >= 0 ? lib[tierId][idx] : undefined;
  if(!mod) return viewMap();
  const mj = MAJORS[mod.major];
  const st = moduleState(tierId, idx, band);
  const lessons = lessonsFor(modId, st);
  const done = lessons.filter(l=>l.state==='done').length;
  const cur = lessons.find(l=>l.state==='current');

  const lessonCards = lessons.map(l=>{
    const tm = TYPE_META[l.type];
    const cls = l.state==='done' ? 'done' : l.state==='current' ? 'current' : 'todo';
    const stamp = l.state==='done' ? 'DONE ✓' : l.state==='current' ? 'YOU →' : `${l.dur} min`;
    return `<div class="lcard ${cls} press" style="--lc:${mj.c}">
      <span class="lem">${tm.em}</span>
      <span class="lt"><span class="t">Lesson ${l.n} — ${l.title}</span>
      <span class="s">${tm.label} · ${l.dur} min${l.state==='current' ? ' · you are here' : ''}</span></span>
      <span class="stamp">${stamp}</span>
    </div>`;
  }).join('');

  const content = `
  <main class="page">
    <section class="rv">
      <div class="qhero" style="--qc1:${mj.c1};--qc2:${mj.c2}">
        <div class="crumb"><a href="#/map">Trail map</a> · ${tier.name} zone · ${mj.name}</div>
        <h1><span class="qem">${mj.em}</span> ${mod.title}</h1>
        <div class="qproof">🎯 ${st==='done' ? 'Mastery proven' : 'Proving'}: ${proofFor(mod.id)}</div>
        <div class="qwhy">Why this mastery? ${whyFor(mod.major)}</div>
        <div class="qmeta">
          <span class="chip">${done} of ${lessons.length} lessons</span>
          <span class="chip">${langLine(tierId)}</span>
          ${st==='done' ? '<span class="chip">🏅 Complete</span>' : st==='active' ? '<span class="chip">🔥 In progress</span>' : '<span class="chip">Not started</span>'}
        </div>
      </div>
    </section>

    <div class="sechead rv"><h3>Lessons</h3><span class="more">${cur ? `Next: ${cur.title}` : 'All done'}</span></div>
    <section class="rv">${lessonCards}</section>

    <div class="sechead rv"><h3>Maya, your AI buddy</h3><span class="more">✨ always awake</span></div>
    <section class="maya rv">
      <div class="bubble" style="max-width:none"><span class="who"><span class="bug"></span>MAYA</span>
        Stuck anywhere in ${mod.title}? I explain like a friend, not a textbook.</div>
      <div class="opts">
        <span>💡 Explain this lesson simply</span>
        <span>🌐 Explain in my language</span>
        <span>🎯 Quiz me before the quest</span>
      </div>
    </section>

    <div class="sechead rv"><h3>Real-world quest</h3><span class="more">do it for real 🌍</span></div>
    ${assignCard(tierId, mod, band)}

    <div class="sechead rv"><h3>What unlocks next</h3></div>
    <section class="rv">
      ${unlockCard(tierId, idx, band, mj)}
    </section>
    ${footNote()}
  </main>`;
  return shell(content, 'quest');
}

function unlockCard(tierId, idx, band, mj){
  const lib = libraryFor(band);
  const next = lib[tierId][idx+1];
  const tier = TIERS.find(t=>t.id===tierId);
  if(!next){
    return `<div class="horizon-tease press" style="padding:22px 20px">
      <span class="sun"></span>
      <h3 style="font-size:19px">The ${tier.name} Gate waits at the top 🏁</h3>
      <p>Finish every quest in this zone and the gate checks them all — plus the English test. Nothing skipped, nothing rushed.</p>
    </div>`;
  }
  const nm = MAJORS[next.major];
  return `<a class="lcard press" href="#/module/${next.id}" style="--lc:${nm.c};text-decoration:none">
    <span class="lem">${nm.em}</span>
    <span class="lt"><span class="t">${next.title}</span>
    <span class="s">Proves: ${proofFor(next.id)} · opens when this one is done</span></span>
    <span class="stamp" style="color:var(--dim);border:1px dashed var(--line)">NEXT →</span>
  </a>`;
}

/* ---------- real-world quest card (assignment, 4 states) ---------- */
function assignCard(tierId, m, band){
  const st = assignState(tierId, m.id, band);
  const flavor = flavorFor(m.id);
  const task = flavor === 'two_ai_disagreement' ? DISAGREE_TASK : taskFor(band, m);
  const peers = peersFor(m.id);
  const formats = flavor === 'two_ai_disagreement' ? ['✍️ Written','📸 Photo']
    : bandKey(band)==='basic' ? ['✏️ Drawing','📸 Photo']
    : ['🎥 Video','📸 Photo','✍️ Written','🔬 Experiment'];

  const disagree = flavor === 'two_ai_disagreement' ? `
    <div class="disagree">
      <div class="dcol"><div class="h">🤖 AI A claims</div><div class="q">${DISAGREE_GHOST.a}</div></div>
      <div class="dcol"><div class="h">🤖 AI B claims</div><div class="q">${DISAGREE_GHOST.b}</div></div>
      <div class="dcol verdict"><div class="h">🔍 Your verification</div><div class="q">${DISAGREE_GHOST.resolve}</div></div>
    </div>` : '';

  const rubric = (earned)=>`
    <div class="rubric">
      ${RUBRIC.map(([nm,w],i)=>{
        const label = (flavor==='two_ai_disagreement' && i===0) ? 'Understanding — verification quality' : nm;
        const e = earned ? earned[i] : 0;
        return `<div class="row"><span class="nm">${label}</span>
          <span class="bar"><i style="width:${earned ? Math.round(e/w*100) : 0}%"></i></span>
          <span class="vl">${earned ? e+' / '+w : '— / '+w}</span></div>`;
      }).join('')}
    </div>`;

  let statusHtml = '';
  if(st === 'notsub'){
    statusHtml = `<p class="task">${task}</p>${disagree}
      <div class="formats">${formats.map(f=>`<span>${f}</span>`).join('')}</div>
      ${flavor==='two_ai_disagreement' ? rubric(null) : ''}`;
  } else if(st === 'awaiting'){
    statusHtml = `
      <div class="statusbanner ok"><span style="font-size:20px">📮</span>
        <span><span class="t">Your submission is in!</span><br>Two friends review it against the sealed rubric — one has already replied.</span></div>
      <div class="chat">
        <div class="chatmsg"><span class="ava" style="--ac:var(--c-biology)">${peers[0].split(' ').map(w=>w[0]).join('')}</span>
          <span class="txt"><b>${peers[0]}</b> — review submitted 💛</span></div>
        <div class="chatmsg"><span class="ava" style="--ac:var(--c-physics)">${peers[1].split(' ').map(w=>w[0]).join('')}</span>
          <span class="txt"><b>${peers[1]}</b> — still reviewing…</span></div>
      </div>
      ${rubric(null)}
      <p style="margin-top:12px;font-size:13px;color:var(--dim)">Keep learning while they finish — no waiting around.</p>`;
  } else if(st === 'revision'){
    statusHtml = `
      <div class="statusbanner warn">
        <span><span class="t">One more pass — you've got this</span><br>
        <b>${LEARNER.mentor}</b> (mentor): ${REVISION_QUOTE[bandKey(band)]}</span></div>
      <p class="task" style="margin-top:14px">${task}</p>
      <div class="formats">${formats.map(f=>`<span>${f}</span>`).join('')}</div>`;
  } else if(st === 'scored'){
    statusHtml = `
      ${rubric(earnedFor(m.id))}
      <div class="cert"><span class="medal">🏅</span>
        <span><span class="t">Mastery proven!</span><br>
        <span class="s">${proofFor(m.id)} — verified by ${LEARNER.mentor} · counts toward your tier gate</span></span></div>
      <button class="sharepill" data-proof="${proofFor(m.id)}" onclick="shareCert(this)">Share this mastery 🎉</button>`;
  }

  const stateChip = {
    notsub:   '<span class="chip">Not submitted</span>',
    awaiting: '<span class="chip" style="color:var(--c-teal);border-color:color-mix(in srgb, var(--c-teal) 45%, transparent)">👥 Peer review · 1 of 2</span>',
    revision: '<span class="chip" style="color:var(--c-math);border-color:color-mix(in srgb, var(--c-math) 45%, transparent)">Revision requested</span>',
    scored:   '<span class="chip" style="color:var(--c-gold);border-color:color-mix(in srgb, var(--c-gold) 45%, transparent)">🏅 Scored</span>',
  }[st];

  return `<section class="rwquest rv">
    <div class="hd">
      <span class="cam">🌍</span>
      <span class="t">Do it in the real world</span>
      <span style="margin-left:auto">${stateChip}</span>
    </div>
    <div class="bd">${statusHtml}</div>
  </section>`;
}

/* ============================================================
   SCREEN 4 · HORIZON (career) — the sunrise
   ============================================================ */
function viewHorizon(){
  const band = getBand();
  const tier = TIERS.find(t=>t.id===LEARNER.tierId);
  const readyIdx = { foundation:1, working:2, professional:2, advanced:3 }[tier.id];

  const readyLine = `<div class="ready-line">
    ${CAREER.readiness.map((t,i)=>`<span class="rl ${i===readyIdx?'cur':''}"><span class="dot"></span>${t}</span>`).join('<span style="color:var(--dim)">·</span>')}
  </div>
  <p style="text-align:center;margin-top:10px;font-size:13px;color:var(--dim)">Your ${tier.name} tier places you at <b style="color:var(--ink)">${CAREER.readiness[readyIdx]}</b> — a statement about skills. Never a score.</p>`;

  /* band-gated states — canon */
  if(band === 'basic'){
    const content = `
  <main class="page">
    <section class="horizon-hero rv">
      <span class="sun"></span>
      <h1>The horizon 🌅</h1>
      <p>Where every trail in YDC eventually leads — a working life you choose.</p>
    </section>
    <section class="rv" style="margin-top:18px">
      <div class="fogzone" style="padding:30px 22px">
        <div class="mist"></div>
        <div class="t" style="font-size:17px">☁️ The horizon opens at High school band</div>
        <div class="s" style="max-width:44ch;margin:6px auto 0">Career planning uses real-world stages. Until then, the trail in your map is the adventure that matters — every module you finish still counts.</div>
        <div class="peeks"><a class="btn ghost" href="#/map" style="margin-top:6px">Back to your trail →</a></div>
      </div>
    </section>
    ${footNote()}
  </main>`;
    return shell(content, 'horizon');
  }

  if(band === 'middle'){
    const s = CAREER.stages[0];
    const content = `
  <main class="page">
    <section class="horizon-hero rv">
      <span class="sun"></span>
      <h1>The horizon 🌅</h1>
      <p>A peek at where this all leads.</p>
    </section>
    <section class="rv" style="margin-top:18px">${readyLine}</section>
    <section class="rv" style="margin-top:16px">
      <div class="statusbanner warn"><span style="font-size:20px">🧭</span>
        <span><span class="t">Explore-only at Middle school band</span><br>The full road — with its gates — opens at High school band. For now: try everything.</span></div>
    </section>
    <section class="step-cloud rv">
      <span class="sem">${s.em}</span>
      <span><span class="t">${s.name}<span class="yr">${s.band}</span></span>
      <div class="s">${s.copy}</div>
      <div class="tags">${CAREER.families.map(f=>`<span>${f}</span>`).join('')}</div></span>
    </section>
    ${footNote()}
  </main>`;
    return shell(content, 'horizon');
  }

  const stageCards = [...CAREER.stages].reverse().map(s=>`
    <section class="step-cloud rv">
      <span class="sem">${s.em}</span>
      <span><span class="t">${s.name}<span class="yr">${s.band}</span></span>
      <div class="s">${s.copy}</div>
      <div class="tags">
        ${s.gates.map(g=>`<span class="gate">🚩 Gate · ${g}</span>`).join('')}
        ${s.kind==='families' ? CAREER.families.map(f=>`<span>${f}</span>`).join('') : ''}
        ${s.kind==='focus' ? `<span>💬 English</span><span>🧮 Math</span><span style="color:var(--dim)">…you pick your two when you get here</span>` : ''}
        ${s.kind==='specialize' ? `<span>📄 Writing Clear Reports — in progress now</span><span>🎤 Presentation Skills — feeds your portfolio</span>` : ''}
      </div></span>
    </section>`).join('');

  const content = `
  <main class="page">
    <section class="horizon-hero rv">
      <span class="sun"></span>
      <h1>The horizon 🌅</h1>
      <p>Stages describe the road, not you. Your tier marks your skills — nobody here is a number.</p>
      <span class="cap-badge">🌅 Career Ready — Verified by ReferTRM</span>
      <p class="posline" style="margin-top:14px"><b>AI is the tutor.</b> YDC is the proof.</p>
    </section>
    <section class="rv" style="margin-top:18px">${readyLine}</section>
    <div style="height:8px"></div>
    ${stageCards}
    ${footNote()}
  </main>`;
  return shell(content, 'horizon');
}

/* ============================================================
   SCREEN 5 · PROMOTION — the celebration
   ============================================================ */
function viewPromotion(){
  const confetti = (()=>{
    const r = mulberry32(777);
    const colors = ['var(--c-english)','var(--c-math)','var(--c-physics)','var(--c-chemistry)','var(--c-biology)','var(--c-gold)'];
    let s = '';
    for(let i=0; i<42; i++){
      s += `<i style="left:${(r()*100).toFixed(1)}%;--cc:${colors[Math.floor(r()*colors.length)]};--fd:${(3+r()*3).toFixed(1)}s;--fdel:${(r()*2.5).toFixed(1)}s"></i>`;
    }
    return s;
  })();

  const content = `
  <main class="promo-wrap">
    <div class="confetti" aria-hidden="true">${confetti}</div>
    <div class="promo">
      <div class="bigmedal">🎓</div>
      <h1>Gate passed!</h1>
      <div class="tierbig">Working tier</div>
      <p class="quiet">The Foundation Gate checked every proof — all verified, English Level 1 cleared. Promotions here are earned, and this one is yours.</p>
      <p class="quiet" style="margin-top:10px;font-size:13px;color:var(--dim)">Verified by ${LEARNER.mentor}, your mentor · every tier gate includes the English test</p>
      <div class="ctas">
        <button class="btn primary" onclick="shareIt('promotion')">Share this moment ✨</button>
        <a class="btn warm" href="#/map">Keep climbing 📍</a>
        <a class="btn ghost" href="#/">Back home</a>
      </div>
    </div>
  </main>`;
  return shell(content, 'promo');
}

/* ============================================================
   WONDER & PEEK — curiosity, open to every band, costs nothing
   ============================================================ */
function viewWonder(id){
  const w = WONDERS[id] || WONDERS.light;
  const quest = w.quest ? `<a class="wquest press" href="#/module/${w.quest[0]}">Follow this wonder into a quest: ${w.quest[1]} →</a>`
                        : `<span class="wquest dim">No gate on this one — wondering was the whole point.</span>`;
  const content = `
  <main class="page">
    <section class="rv">
      <div class="qhero" style="--qc1:#0D9488;--qc2:#155E75">
        <div class="crumb"><a href="#/">Home</a> · side path · free wonder</div>
        <h1><span class="qem">✨</span> ${w.q}</h1>
        <div class="qproof">Asked by learners · ${w.tag}</div>
        <div class="qwhy">Open to every band, forever — no wonder is locked behind a wall.</div>
      </div>
    </section>
    <section class="card rv wcard"><div class="wanswer">${w.a}</div>${quest}</section>
    <section class="card rv wcard"><div class="wlist-t">Keep wondering — it costs nothing</div><div class="wonders">
      <a href="#/wonder/light">🌿 Why do plants reach for light?</a>
      <a href="#/wonder/sky">🌌 Why is the sky blue?</a>
      <a href="#/wonder/dream">🌙 Why do we dream?</a>
    </div></section>
    <a class="btn ghost" href="#/">Back to the trail</a>
    ${footNote()}
  </main>`;
  return shell(content, 'home');
}
function viewPeek(id){
  const p = PEEKS[id] || PEEKS.composition;
  const content = `
  <main class="page">
    <section class="rv">
      <div class="qhero" style="--qc1:#B45309;--qc2:#92400E">
        <div class="crumb"><a href="#/">Home</a> · a look ahead · ${p.zone} tier</div>
        <h1><span class="qem">🔭</span> ${p.name}</h1>
        <div class="qproof">Locked for now — but looking costs nothing</div>
        <div class="qwhy">Curiosity has no gate. Every peek is free.</div>
      </div>
    </section>
    <section class="card rv wcard"><div class="wanswer">${p.taste}</div>
      <span class="wquest dim">This mastery waits at the ${p.zone} Gate — every quest on your trail walks toward it.</span></section>
    <a class="btn ghost" href="#/">Back to the trail</a>
    ${footNote()}
  </main>`;
  return shell(content, 'home');
}

/* ---------- router + reveal ---------- */
function observeReveals(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.rv').forEach(el=>el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:.08 });
  document.querySelectorAll('.rv').forEach(el=>io.observe(el));
}

function route(){
  const h = location.hash.replace(/^#\/?/, '');
  const app = document.getElementById('app');
  let html;
  if(h.startsWith('module/')) html = viewModule(h.split('/')[1]);
  else if(h === 'map') html = viewMap();
  else if(h === 'horizon') html = viewHorizon();
  else if(h === 'promotion') html = viewPromotion();
  else if(h.startsWith('wonder/')) html = viewWonder(h.split('/')[1]);
  else if(h.startsWith('peek/')) html = viewPeek(h.split('/')[1]);
  else html = viewHome();
  app.innerHTML = html;
  renderThemeBtn();
  observeReveals();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);
route();

/* ============================================================
   YDC — THE NIGHT TRAIL · app-rules.js
   Canon data + state helpers. No bundler on 3G: script-load
   order is the module system. This file assigns window.* so a
   self-contained app.js can never collide during deploys.
   ============================================================ */
'use strict';

/* ============================================================
   THE LADDER LAW (mechanical spine — nothing decorative):
   · every module is a QUEST that proves one MASTERY (a DO-thing)
   · a tier's GATE checks every mastery + the English test
   · passing the gate PROMOTES you a tier
   The gate is always visible on the trail before it is reachable.
   ============================================================ */
window.PROOFS = {
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
  /* out-of-school — foundation */
  'o-f-1':'Handle money without mistakes',       'o-f-2':'Greet and guide in English',
  'o-f-3':'Read any form put in front of you',   'o-f-4':'Keep food safe with heat',
  'o-f-5':'Stay safe around electricity',        'o-f-6':'Work hard without breaking your body',
  'o-f-7':'Measure and estimate on the job',     'o-f-8':'Keep water and hands safe',
  /* out-of-school — working */
  'o-w-1':'Calm an unhappy customer in English', 'o-w-2':'Keep clean money records',
  'o-w-3':'Price a job so you never lose money', 'o-w-4':'Write messages people answer',
  'o-w-5':'Use tools and machines safely',       'o-w-6':'Choose the right material',
  'o-w-7':'Protect your health over long weeks', 'o-w-8':'Plan and cost a real job',
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
window.WHY_MAJOR = {
  english:  'because people who say it clearly get heard — in class, at work, anywhere.',
  math:     'because numbers stop being scary the moment you can make them talk.',
  physics:  'because the world runs on rules you can see — once you know where to look.',
  chemistry:'because your kitchen is already a lab. This teaches you to read it.',
  biology:  'because once you see how living things work, you can’t unsee it.',
};
function whyFor(major){ return WHY_MAJOR[major]; }

/* curiosity: side paths — free wonders, always open, cost nothing */
window.WONDERS = {
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
window.PEEKS = {
  composition: { name:'Advanced Composition', zone:'Professional',
    taste:'One idea, three drafts. You take a rough paragraph and rebuild it until a stranger cannot misunderstand it — then until they cannot forget it. Professional tier work is slower, deeper, and entirely yours.' },
  data: { name:'Data Analysis', zone:'Professional',
    taste:'You stop asking “what do the numbers say?” and start asking “what are they hiding?” Real datasets, real mess, real conclusions you defend out loud.' },
  research: { name:'Research Methods', zone:'Professional',
    taste:'A question you are genuinely curious about, a method to chase it honestly, and a mentor who keeps you truthful. It ends with findings you present to people who matter.' },
};

/* generosity: sharing — the trail is meant to travel */
window.SHARE_URL = 'https://talentsolutionsmyanmar-max.github.io/ydc-canvas/';
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
window.TYPE_META = {
  sim:        { em:'🎮', label:'Sim' },
  video:      { em:'🎬', label:'Video' },
  experiment: { em:'🔬', label:'Experiment' },
  reading:    { em:'📖', label:'Reading' },
  scenario:   { em:'💬', label:'Scenario' },
  speaking:   { em:'🎤', label:'Speaking' },
};
window.TYPE_KEYS = Object.keys(TYPE_META);
window.TYPE_ENGLISH = ['speaking','scenario','speaking','scenario','video','reading'];
window.TYPE_BASIC = ['video','sim','video','scenario','video','sim'];
window.TYPE_OOS = ['scenario','video','speaking','sim','scenario','reading'];

/* sealed rubric — canon, never changed */
window.RUBRIC = [
  ['Understanding', 30],
  ['Application',   30],
  ['Creativity',    20],
  ['Presentation',  20],
];

window.PEER_NAMES = ['Su Myat','Kyaw Zin','Hnin Wai','Min Khant','Thaw Dar','Zar Ni','Pyae Sone','May Thu'];
window.PEER_COLORS = ['var(--c-english)','var(--c-math)','var(--c-physics)','var(--c-chemistry)','var(--c-biology)','#F472B6','#34D399','#FBBF24'];
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
window.CIRCLE_ACTS = [
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
/* out-of-school circle — peers who are earning or close to it */
window.CIRCLE_ACTS_OOS = [
  ['🧾','kept her money records for a full week'],
  ['🗣️','role-played an unhappy customer'],
  ['💛','shared a pricing tip with the circle'],
  ['🏅','earned a module certificate'],
  ['📸','submitted a photo quest'],
  ['🎁','shared his job-costing sheet'],
  ['📖','finished a lesson on the bus'],
  ['🧮','priced her first real job'],
  ['🎤','is practicing customer English out loud'],
];
function circleFor(band){
  const r = mulberry32(9000 + bandKey(band).length * 77);
  const pool = bandKey(band)==='oos' ? CIRCLE_ACTS_OOS : CIRCLE_ACTS;
  const names = [...PEER_NAMES];
  const out = [];
  for(let i=0; i<4; i++){
    const ni = Math.floor(r()*names.length);
    const nm = names.splice(ni,1)[0];
    const act = pool[Math.floor(r()*pool.length)];
    out.push({ nm, em:act[0], text:act[1], color:PEER_COLORS[Math.floor(r()*PEER_COLORS.length)] });
  }
  return out;
}

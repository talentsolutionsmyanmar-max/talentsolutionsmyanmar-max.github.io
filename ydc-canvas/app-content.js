/* ============================================================
   YDC — THE NIGHT TRAIL · app-content.js
   Authored lesson + Maya content (the HA/CCO content lane's file).
   ============================================================ */
'use strict';

/* ============================================================
   LESSON CONTENT — authored for each band’s active module;
   every other lesson renders an honest structural shape.
   ============================================================ */
window.LESSON_CONTENT = {
  /* HIGH · w-4 Writing Clear Reports */
  'w-4:1': { brief:[
    'A report is not homework — it is a tool. Somewhere at the end of it, a person makes a decision, and your words are what they decide with.',
    'The shape never changes: the Question (what we wanted to know), the Evidence (what we measured), the Analysis (what it means), and the Ask (what should happen next). Hold those four parts and any report you write will stand up.' ],
    check:{ q:'A report exists to…', opts:['help a reader decide something','fill a page nicely','impress with vocabulary'], ans:0, why:'reports are tools for decisions — the reader acts on them.' } },
  'w-4:2': { watch:['how every claim gets a named source','the difference between a fact and a guess','why two weak sources are not one strong one'], brief:[
    'Watch how the writer never says “everyone knows”. Every number has an address — where it was measured, by whom, when. That is what makes a reader trust you.' ],
    check:{ q:'Which one is evidence?', opts:['a measured number with a source','something everyone says','a strongly held opinion'], ans:0, why:'evidence can be checked. Feelings and rumors cannot.' } },
  'w-4:3': { say:[
    'Read this aloud: “The water level rose 4 cm in one hour.”',
    'Now say the same fact in your own words — shorter.',
    'Now answer out loud: what does this mean for the shop owner?' ], brief:[
    'Clear writing is just clear speaking, written down. If you cannot say a sentence in one breath, cut it in two. One idea per sentence — the reader should never have to re-read.' ],
    check:{ q:'The clearest sentence is…', opts:['The level rose 4 cm in an hour','It is observed that precipitation augmented levels','Water happened a lot'], ans:0, why:'short, concrete, one idea. The reader gets it on the first try.' } },
  'w-4:4': { goal:'Turn six raw notes into a clean table, then choose the one figure that shows the point fastest.', brief:[
    'Tables carry exact numbers; figures carry shape. Never make a reader hunt through a paragraph for a number — if it matters, it lives in a table.' ],
    check:{ q:'A table beats a paragraph when…', opts:['readers need exact numbers fast','you want to hide the data','the report feels too short'], ans:0, why:'tables are for precision. The reader scans, finds, decides.' } },
  'w-4:5': { script:[
    { w:'FRIEND', t:'I read your draft. The evidence part is strong — but I got lost in the analysis.' },
    { w:'YOU', t:'Which line lost you?' },
    { w:'FRIEND', t:'“The data implies several considerations.” What does that mean?' },
    { w:'YOU', t:'Nothing yet — I will replace it with what the numbers actually say.' } ], brief:[
    'Peer review is a gift, not a trial. A confused reader is information: something you wrote is not yet doing its job. Thank them, find the line, fix the line.' ],
    check:{ q:'A useful review comment is…', opts:['specific and kind','short and vague','only praise'], ans:0, why:'“I got lost at this line” fixes reports. “Looks good!” fixes nothing.' } },
  'w-4:6': { say:[
    'Read your title aloud — does it promise what the report delivers?',
    'Say your Ask in one sentence, out loud.',
    'State your strongest piece of evidence in thirty seconds.' ], brief:[
    'The final draft is a promise: every claim sourced, every number in a table, every sentence one idea. Read it aloud once — your ear catches what your eye misses. Then submit, and let the rubric do its work.' ],
    check:{ q:'Before submitting, you…', opts:['read the whole report aloud once','add more adjectives','make it longer'], ans:0, why:'the read-aloud test catches what silent reading misses.' } },
  /* BASIC · b-w-2 Draw & Tell: A Plant You Found */
  'b-w-2:1': { watch:['leaves drink light','roots drink water','every plant has parts with jobs'], brief:[
    'Watch how the plant is not one thing — it is a team. Each part has a job, and together they keep the plant alive.' ],
    check:{ q:'Leaves are for…', opts:['catching light','looking pretty','nothing much'], ans:0, why:'leaves catch light — that is how the plant eats.' } },
  'b-w-2:2': { watch:['root — drinks from the soil','stem — carries water up','leaf — catches the light','flower — makes new seeds'], brief:[
    'Four parts, four jobs. Say each one as you see it: root, stem, leaf, flower. You already know more plant science than you think.' ],
    check:{ q:'The roots…', opts:['drink water from the soil','make the flowers','catch the sunlight'], ans:0, why:'roots drink from the soil and hold the plant steady.' } },
  'b-w-2:3': { script:[
    { w:'MAYA', t:'Find a real plant. Any plant — small is fine.' },
    { w:'MAYA', t:'Look closely for one whole minute before you draw. What do you see?' },
    { w:'YOU', t:'The leaves have lines in them!' },
    { w:'MAYA', t:'Draw those lines too. Draw what you really see — then label three parts.' } ], brief:[
    'Scientists draw to see better. Your drawing does not need to be beautiful — it needs to be true. Look first, draw second, label last.' ],
    check:{ q:'When you draw a plant, you…', opts:['draw what you really see','draw fast and messy','copy a friend'], ans:0, why:'your eyes are the tool. The pencil just follows them.' } },
  'b-w-2:4': { say:[
    'root — say it out loud',
    'stem — say it out loud',
    'leaf — say it out loud, then point at one' ], brief:[
    'Saying a word out loud makes it yours. Say each name, point at the part on your drawing, and teach it to someone at home — teaching is the strongest way to remember.' ],
    check:{ q:'Which part carries water up the plant?', opts:['the stem','the flower','the soil'], ans:0, why:'the stem is the road the water travels.' } },
  /* MIDDLE · m-w-4 Writing Short Reports */
  'm-w-4:1': { brief:[
    'A short report has four bones: the question it answers, the facts it found, what those facts mean, and one clear ask at the end.',
    'Short does not mean empty. Short means every sentence earns its place — and the reader finishes it.' ],
    check:{ q:'A short report starts with…', opts:['the question it answers','a long greeting','the biggest word you know'], ans:0, why:'the question tells the reader why to keep reading.' } },
  'm-w-4:2': { watch:['facts live in measurements and named sources','opinions live in heads','write down where each fact came from'], brief:[
    'Watch how the writer separates “what I saw” from “what I think”. Both are allowed — but they never share a costume.' ],
    check:{ q:'A fact is…', opts:['something you can check','something you feel strongly','a rumor many people repeat'], ans:0, why:'if you can check it, it can be a fact. If not, it is just noise.' } },
  'm-w-4:3': { brief:[
    'One sentence, one idea. When a sentence tries to carry two ideas, it drops both.',
    'The test is your own voice: read the sentence aloud. If you need a second breath or a second thought, split it.' ],
    check:{ q:'One sentence should carry…', opts:['one idea','three ideas','as much as possible'], ans:0, why:'one idea per sentence keeps the reader with you.' } },
  'm-w-4:4': { goal:'Turn six notes into a small table — then write the title that tells the point, not just the topic.', brief:[
    'A table is a kindness to the reader: the numbers line up so their eyes do not have to. And a good title does half the talking — “Sales doubled in June” beats “Table 1”.' ],
    check:{ q:'A good table title…', opts:['says what the numbers mean','is the word “Table”','is left blank'], ans:0, why:'the title is the first sentence of the table.' } },
  'm-w-4:5': { say:[
    'Tell a friend your whole report in thirty seconds.',
    'Ask them: which part was unclear?',
    'Say thank you — feedback is a gift.' ], brief:[
    'Sharing a draft takes courage the first time and pays forever. Thirty seconds out loud tells you more than an hour of silent re-reading.' ],
    check:{ q:'When a friend finds a mistake, you…', opts:['thank them and fix it','argue your case','delete the report'], ans:0, why:'a found mistake is a free lesson — take it, fix it, move on.' } },
  /* OUT OF SCHOOL · o-w-2 Money Records */
  'o-w-2:1': { brief:[
    'Any notebook works if every kyat goes into it. Two columns: money in, money out. Date every line — a number without a date is a rumor.',
    'Memory lies kindly; paper does not. The notebook feels small for three days, then one evening it tells you exactly where your money goes. That evening changes things.' ],
    check:{ q:'The rule of money records is…', opts:['write every kyat, every day','write only the big amounts','keep it in your head'], ans:0, why:'small leaks sink real businesses. Every kyat, every day.' } },
  'o-w-2:2': { script:[
    { w:'MAYA', t:'A tea-shop morning. Three sales: 500, 1500, 800. Two costs: gas 1200, milk 600.' },
    { w:'YOU', t:'In: 500 + 1500 + 800 = 2800. Out: 1200 + 600 = 1800.' },
    { w:'MAYA', t:'Left over?' },
    { w:'YOU', t:'1000. Before I wrote it down, I would have guessed “a good day” — now I know how good.' } ], brief:[
    'Sales feel bigger than costs while they happen — the cash is in your hand and the gas bill is invisible. Writing both down the same way is the whole discipline.' ],
    check:{ q:'Which one is a cost?', opts:['the gas for the stove','a paid order','change given correctly'], ans:0, why:'money out is a cost — even when it buys something you need.' } },
  'o-w-2:3': { watch:['the same two columns, now on the phone','one row per day — no merging','the phone adds; you still check'], brief:[
    'A spreadsheet is the same honest notebook with one upgrade: it never gets tired of adding. You still write every line — the phone only does the arithmetic.' ],
    check:{ q:'A spreadsheet helps because…', opts:['it adds without tired mistakes','it looks modern','it replaces thinking'], ans:0, why:'it does the adding. The thinking stays with you.' } },
  'o-w-2:4': { goal:'Total one invented week: find the biggest cost, and decide if it earned its keep.', brief:[
    'At the end of the week the notebook answers three questions: how much came in, how much went out, and what is left. Then the fourth question, the one that grows a business: which cost earned its keep, and which did not?' ],
    check:{ q:'Profit is…', opts:['money in minus money out','all the money that came in','the busiest day’s sales'], ans:0, why:'busy is not profit. In minus out — that number never flatters.' } },
  'o-w-2:5': { say:[
    'Say your week in one sentence: in, out, left over.',
    'Name your biggest cost — and one line on why it stays.',
    'Ask your own numbers one question out loud.' ], brief:[
    'Numbers you can say out loud are numbers you own. Show them to your mentor without shame or decoration — a clean week and a messy week both teach, but only if they are real.' ],
    check:{ q:'Showing your numbers to a mentor…', opts:['makes your next decision better','is showing off','is dangerous'], ans:0, why:'honest numbers are how mentors help — hiding them hides the help.' } },
};
window.SLOT_NAMES = { explain_level:'Explain this lesson simply', explain_language:'Explain in my language', quiz_me:'Quiz me before the quest' };

/* ============================================================
   VIDEO LANE — Phase 1 (S324): curated embeds only, never
   in-house production this year (KoKo ruling). Fences, verbatim:
   · embed-only, never re-host        · youtube-nocookie.com
   · consent facade + data-cost line — iframe loads ONLY on tap
   · every entry: review gate + CCO sign + rot-recheck + fallback
   · rel=0, no autoplay · low-data twin under every video
   Empty Basic/OOS slots stay honest-designed. Phases 2–3 parked.
   Flags flip only in the review/CCO lanes — never self-approved.
   ============================================================ */
window.VIDEO_REGISTRY = {
  /* key: 'modId:lessonN' — same keying as LESSON_CONTENT */
  'w-4:2': { id:'hxhbOvR2TGk', channel:'CrashCourse',
    title:'Evaluating Evidence — Crash Course Navigating Digital Information #6',
    dur:'13 min', mb:13, lang:'en',
    review:'pending', cco:'pending', recheck:'2026-10-24', twin:'brief',
    note:'ID verified 2026-07-24 (resolves, title match).' },
  'm-w-4:2': { id:'nv4nfCJnHXQ', channel:'Learn and Play Online!',
    title:'Facts and Opinions',
    dur:'~5 min', mb:6, lang:'en',
    review:'pending', cco:'pending', recheck:'2026-10-24', twin:'brief',
    note:'ID verified 2026-07-24 (resolves, title match).' },
  'o-w-2:3': { id:'rwbho0CgEAE', channel:'Technology for Teachers and Students',
    title:'The Beginner’s Guide to Excel — Excel Basics Tutorial',
    dur:'22 min', mb:22, lang:'en',
    review:'pending', cco:'pending', recheck:'2026-10-24', twin:'brief',
    note:'ID verified 2026-07-24 (resolves, title match). Visual-first; language call sits with CCO.' },
  'b-w-2:2': { id:'p3St51F4kE8', channel:'Peekaboo Kidz',
    title:'Parts Of A Plant — The Dr. Binocs Show',
    dur:'~5 min', mb:6, lang:'en',
    review:'pending', cco:'pending', recheck:'2026-10-24', twin:'brief',
    note:'ID verified 2026-07-24 (resolves, title match). Basic band is MM-first — CCO language call.' },
};

/* the gate, mechanical: nothing plays until review + CCO both
   land AND the rot-recheck date is still in the future.
   Preview switch (?video=preview) is device-local demo state ONLY —
   canon flags stay pending; the facade says so out loud. */
function videoPreviewMode(){
  /* the URL flag is authoritative on every render (hash navigation keeps
     location.search intact) — localStorage is only the persistence backup,
     so storage-blocked browsers still preview */
  if(/[?&]video=preview/.test(location.search)){
    try{ localStorage.setItem('ydc-canvas-video-preview','1'); }catch(e){}
    return true;
  }
  if(/[?&]video=off/.test(location.search)){
    try{ localStorage.removeItem('ydc-canvas-video-preview'); }catch(e){}
    return false;
  }
  try{ return localStorage.getItem('ydc-canvas-video-preview') === '1'; }catch(e){ return false; }
}
function videoEntry(modId, n){
  const e = (window.VIDEO_REGISTRY || {})[modId + ':' + n];
  if(!e) return null;
  const gated = e.review === 'approved' && e.cco === 'signed' && Date.parse(e.recheck) > Date.now();
  return { e, live: gated || videoPreviewMode(), gated };
}

function lessonContent(modId, mod, mj, lesson, tm){
  const hit = LESSON_CONTENT[modId + ':' + lesson.n];
  if(hit) return hit;
  /* structural fallback — the shape is real, the authoring slot is honest */
  return { brief:[
    `${lesson.title} — a ${tm.label.toLowerCase()} lesson inside “${mod.title}”. It trains ${mj.cap.toLowerCase()}: one small, provable step toward ${proofFor(mod.id).toLowerCase()}.`,
    'Full lesson text authors in the content lane (HA/CCO). This demo renders the real shape — frame, brief, and a live quick check below.' ],
    check:{ q:'This lesson is part of…', opts:[`proving one mastery in ${mod.title}`,'an unrelated subject','nothing — it stands alone'], ans:0, why:'every lesson lives inside a quest, and every quest proves one mastery.' } };
}

function viewLesson(modId, nStr){
  const band = getBand();
  const lib = libraryFor(band);
  const tierId = modId.split('-').includes('f') ? 'foundation' : 'working';
  const idx = lib[tierId].findIndex(m=>m.id===modId);
  const mod = idx >= 0 ? lib[tierId][idx] : undefined;
  if(!mod) return viewMap();
  const mj = MAJORS[mod.major];
  const st = moduleState(tierId, idx, band);
  const lessons = lessonStates(modId, st);
  const n = parseInt(nStr, 10) || 1;
  const lesson = lessons.find(l=>l.n===n) || lessons[0];
  const tm = TYPE_META[lesson.type];
  const c = lessonContent(modId, mod, mj, lesson, tm);
  const prev = lessons.find(l=>l.n===lesson.n-1);
  const next = lessons.find(l=>l.n===lesson.n+1);

  let frame = '';
  if(lesson.type === 'video'){
    const ve = videoEntry(modId, lesson.n);
    const watchList = `<ul class="watch">${(c.watch||[]).map(w=>`<li>${w}</li>`).join('')}</ul>`;
    if(ve && ve.live){
      /* curated + gated: consent facade — the iframe exists only after a tap */
      const e = ve.e;
      frame = `
    <div class="lframe"><div class="screen vfacade press" data-vid="${e.id}" onclick="videoAsk(this)"><span class="play">▶</span>
      <span class="vtitle">${e.title}</span><span class="vdur">Video · ${e.channel} · ${e.dur} · ~${e.mb} MB</span>
      <span class="vbadges">${ve.gated ? 'reviewed ✓ · CCO signed ✓' : 'preview mode · gates still pending'}</span></div>
      <div class="vconsent" style="display:none">
        <p>Streams from YouTube in privacy mode (youtube-nocookie.com) — about <b>${e.mb} MB</b> of your data. Nothing loads until you choose it.</p>
        <div class="vrow">
          <button class="btn primary" onclick="videoGo(this)">Watch the video (~${e.mb} MB)</button>
          <button class="btn ghost" onclick="videoNo(this)">Not now — keep it light</button>
        </div>
      </div>
      ${watchList}
      <div class="vtwin">🔋 <b>Low-data twin:</b> the brief below carries this lesson (&lt;0.1 MB). The video waits for your tap — it never loads itself.</div></div>`;
    } else if(ve){
      /* curated, moving through the gates — honest, no facade */
      frame = `
    <div class="lframe"><div class="screen press" onclick="videoIdle('review')"><span class="play">▶</span>
      <span class="vtitle">${ve.e.title}</span><span class="vdur">${ve.e.channel} · ${ve.e.dur} · curated, in review</span></div>
      ${watchList}
      <div class="honest">A curated video for this lesson is moving through review + CCO sign — it unlocks right here when both land. The brief below carries the lesson meanwhile.</div>
      <div class="vtwin">🔋 <b>Low-data twin:</b> the brief below carries this lesson (&lt;0.1 MB).</div></div>`;
    } else {
      /* no entry — honest-designed (empty Basic/OOS slots stay this way) */
      frame = `
    <div class="lframe"><div class="screen press" onclick="videoIdle('designed')"><span class="play">▶</span>
      <span class="vtitle">${lesson.title}</span><span class="vdur">${tm.label} · ${lesson.dur} min</span></div>
      ${watchList}
      <div class="honest">Designed frame — the real video streams here in production, 3G-light.</div>
      <div class="vtwin">🔋 <b>Low-data twin:</b> the brief below carries this lesson (&lt;0.1 MB).</div></div>`;
    }
  }
  else if(lesson.type === 'sim') frame = `
    <div class="lframe"><div class="screen simscreen press"><span class="play">🎮</span>
      <span class="vtitle">${c.goal || lesson.title}</span><span class="vdur">Sim · ${lesson.dur} min</span></div>
      <div class="honest">Sim slot — designed frame (PhET-class, 3G-first). The quick check below is live.</div></div>`;
  else if(lesson.type === 'scenario') frame = `
    <div class="script">${(c.script||[]).map(l=>`<div class="sline ${l.w==='YOU'?'you':''}"><b>${l.w==='MAYA'?'✨ MAYA':l.w}</b><span>${l.t}</span></div>`).join('')}</div>`;
  else if(lesson.type === 'speaking') frame = `
    <div class="saycards">${(c.say||[]).map(s=>`<div class="say press">🎤 ${s}</div>`).join('')}</div>
    <div class="honest">Say it out loud — hearing yourself is the lesson. Nothing is recorded in this demo.</div>`;
  else if(lesson.type === 'experiment') frame = `
    <div class="steps">${(c.steps||[]).map((s,i)=>`<div class="step"><b>${i+1}</b><span>${s}</span></div>`).join('')}</div>`;

  const readBlock = `<div class="read">${c.brief.map(p=>`<p>${p}</p>`).join('')}</div>`;

  const content = `
  <main class="page">
    <section class="rv">
      <div class="qhero" style="--qc1:${mj.c1};--qc2:${mj.c2}">
        <div class="crumb"><a href="#/module/${modId}">${mod.title}</a> · Lesson ${lesson.n} of ${lessons.length}</div>
        <h1><span class="qem">${tm.em}</span> ${lesson.title}</h1>
        <div class="qproof">${tm.label} · ${lesson.dur} min · ${lesson.state==='done' ? 'Done ✓' : lesson.state==='current' ? 'You are here' : 'Ahead on the trail'}</div>
        <div class="qwhy">Part of proving: ${proofFor(modId)}</div>
      </div>
    </section>
    <section class="rv">${frame}${readBlock}</section>
    <section class="rv">
      <div class="qcheck">
        <div class="qt">Quick check — one question, no stakes</div>
        <div class="qq">${c.check.q}</div>
        <div class="qopts">${c.check.opts.map((o,i)=>`<button class="qopt" onclick="checkOpt(this, ${i===c.check.ans})">${o}</button>`).join('')}</div>
        <div class="qexp" style="display:none"><span class="pre"></span>${c.check.why}</div>
      </div>
    </section>
    <section class="rv lfoot">
      ${lesson.state==='done'
        ? '<span class="chip donechip">Done ✓</span>'
        : `<button class="btn primary" onclick="markLessonDone('${modId}', ${lesson.n})">Mark lesson done</button>`}
      <div class="lnav">
        ${prev ? `<a class="btn ghost" href="#/lesson/${modId}/${prev.n}">← ${prev.title}</a>` : `<a class="btn ghost" href="#/module/${modId}">Back to the quest</a>`}
        ${next ? `<a class="btn ghost" href="#/lesson/${modId}/${next.n}">${next.title} →</a>` : `<a class="btn ghost" href="#/module/${modId}">To the quest →</a>`}
      </div>
    </section>
    ${footNote()}
  </main>`;
  return shell(content, 'quest');
}
function checkOpt(btn, ok){
  const box = btn.closest('.qcheck');
  const exp = box.querySelector('.qexp');
  if(ok){
    btn.classList.add('ok');
    box.querySelectorAll('.qopt').forEach(b=>{ b.disabled = true; });
    exp.querySelector('.pre').textContent = '✓ ';
  } else {
    btn.classList.add('no');
    btn.disabled = true;
    exp.querySelector('.pre').textContent = 'Not yet — ';
  }
  exp.style.display = 'block';
}

/* video consent facade — the ONLY path from tap to iframe.
   Two taps by design: consent first, then the player itself. No autoplay. */
function videoIdle(kind){
  toast(kind === 'review'
    ? 'Curated and moving through review + CCO sign — the brief below carries the lesson meanwhile'
    : 'Designed frame — no video here yet. The brief below carries this lesson');
}
function videoAsk(sc){ const c = sc.parentElement.querySelector('.vconsent'); if(c) c.style.display = 'block'; }
function videoNo(btn){ const c = btn.closest('.vconsent'); if(c) c.style.display = 'none'; }
function videoGo(btn){
  const lf = btn.closest('.lframe');
  const sc = lf && lf.querySelector('.vfacade');
  if(!sc) return;
  const f = document.createElement('div');
  f.className = 'vframe';
  f.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${sc.dataset.vid}?rel=0" title="Lesson video" loading="lazy" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  sc.replaceWith(f);
  const c = lf.querySelector('.vconsent'); if(c) c.remove();
}

/* Maya’s answers — authored, guardrailed: no profiling, no ages, no identity scores */
window.MAYA_RESP = {
  english: {
    explain_level:'Think of %T% as talking, not grammar. One idea per sentence — if a tired friend understands you on the first try, you did it. Grammar polishes later; being understood comes first.',
    explain_language:'In production I answer fully in your language, every word CCO-checked before it reaches you. This demo stays English-only — this slot is the placement, and it is flagged for CCO.',
    quiz_me:'Two quick ones, out loud: (1) the main idea of %T% in one sentence. (2) one example from your own day. If both came fast, you are ready for the quest.',
  },
  math: {
    explain_level:'Numbers here are just honest counting. %T% is really: write it down, line it up, and the answer shows itself. Slow is not wrong — slow is how right answers get made.',
    explain_language:'In production I answer fully in your language, every word CCO-checked before it reaches you. This demo stays English-only — this slot is the placement, and it is flagged for CCO.',
    quiz_me:'Two quick ones: (1) say the steps of %T% out loud, in order. (2) invent one tiny problem like it and solve it on paper. Both done = quest-ready.',
  },
  physics: {
    explain_level:'%T% is about what things DO, not what they are called. Push something, watch it, say what you saw — that is already physics. The names just come later, to save time.',
    explain_language:'In production I answer fully in your language, every word CCO-checked before it reaches you. This demo stays English-only — this slot is the placement, and it is flagged for CCO.',
    quiz_me:'Two quick ones: (1) name one place you saw %T% working today. (2) predict one thing it will do tomorrow — then check. That habit is the whole subject.',
  },
  chemistry: {
    explain_level:'%T% is cooking with questions. Something changes when you mix or heat it — your job is to watch exactly what, and write it down before memory edits it.',
    explain_language:'In production I answer fully in your language, every word CCO-checked before it reaches you. This demo stays English-only — this slot is the placement, and it is flagged for CCO.',
    quiz_me:'Two quick ones: (1) one change you saw in a kitchen this week — what caused it? (2) what would you mix to test your answer? Safety first: an adult present, always.',
  },
  biology: {
    explain_level:'%T% is a system — parts with jobs, working together. Find the parts, name their jobs, and the whole thing stops being magic and starts being readable.',
    explain_language:'In production I answer fully in your language, every word CCO-checked before it reaches you. This demo stays English-only — this slot is the placement, and it is flagged for CCO.',
    quiz_me:'Two quick ones: (1) name the parts in %T% and one job each. (2) what breaks if one part stops? If you can answer both, the quest is yours.',
  },
};
function mayaAsk(modId, slot){
  const band = getBand();
  const lib = libraryFor(band);
  const tierId = modId.split('-').includes('f') ? 'foundation' : 'working';
  const mod = lib[tierId].find(m=>m.id===modId);
  const mj = mod ? MAJORS[mod.major] : null;
  const resp = (mj && MAYA_RESP[mod.major] && MAYA_RESP[mod.major][slot]) || '';
  const box = document.getElementById('mayaresp');
  if(!box) return;
  box.innerHTML = `<b>${SLOT_NAMES[slot]}</b><span>${resp.replace(/%T%/g, mod ? mod.title : 'this module')}</span>`;
  box.classList.add('show');
  box.scrollIntoView({ behavior:'smooth', block:'nearest' });
}

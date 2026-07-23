/* ============================================================
   YDC — THE NIGHT TRAIL · app.js (quest/horizon views + router)
   Loads LAST. Data + rules + flow + content + views all bind
   before this file runs. All learner data INVENTED (seeded PRNG).
   ============================================================ */
'use strict';

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
  const lessons = lessonStates(modId, st);
  const done = lessons.filter(l=>l.state==='done').length;
  const cur = lessons.find(l=>l.state==='current');

  const lessonCards = lessons.map(l=>{
    const tm = TYPE_META[l.type];
    const cls = l.state==='done' ? 'done' : l.state==='current' ? 'current' : 'todo';
    const stamp = l.state==='done' ? 'DONE ✓' : l.state==='current' ? 'YOU →' : `${l.dur} min`;
    return `<a class="lcard ${cls} press" href="#/lesson/${modId}/${l.n}" style="--lc:${mj.c}">
      <span class="lem">${tm.em}</span>
      <span class="lt"><span class="t">Lesson ${l.n} — ${l.title}</span>
      <span class="s">${tm.label} · ${l.dur} min${l.state==='current' ? ' · you are here' : ''}</span></span>
      <span class="stamp">${stamp}</span>
    </a>`;
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
        <button class="slot press" onclick="mayaAsk('${modId}','explain_level')">💡 Explain this lesson simply</button>
        <button class="slot press" onclick="mayaAsk('${modId}','explain_language')">🌐 Explain in my language</button>
        <button class="slot press" onclick="mayaAsk('${modId}','quiz_me')">🎯 Quiz me before the quest</button>
      </div>
      <div class="resp" id="mayaresp"></div>
      <div class="honest">Designed, not wired — Maya guardrails + CCO gate apply in production.</div>
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
      <div class="formats pick">${formats.map(f=>`<button class="fmt" onclick="pickFmt(this)">${f}</button>`).join('')}</div>
      <button class="btn primary submitq" onclick="submitQuest('${m.id}')">Submit your quest 🌍</button>
      <p class="honest">Designed flow — nothing leaves this device. In production your mentor receives the real file.</p>
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
      <div class="formats pick">${formats.map(f=>`<button class="fmt" onclick="pickFmt(this)">${f}</button>`).join('')}</div>
      <button class="btn primary submitq" onclick="submitQuest('${m.id}')">Resubmit your quest 🌍</button>
      <p class="honest">Designed flow — nothing leaves this device. In production your mentor receives the real file.</p>`;
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

  /* out-of-school — the full road, meeting you where you are */
  if(band === 'out_of_school'){
    const stageCards = CAREER.stages.slice(1).reverse().map(s=>`
    <section class="step-cloud rv">
      <span class="sem">${s.em}</span>
      <span><span class="t">${s.name}<span class="yr">${s.band}</span></span>
      <div class="s">${s.copy}</div>
      <div class="tags">
        ${s.gates.map(g=>`<span class="gate">🚩 Gate · ${g}</span>`).join('')}
        ${s.kind==='focus' ? `<span>💬 English</span><span>🧮 Math</span><span style="color:var(--dim)">…your two deepen from here</span>` : ''}
        ${s.kind==='specialize' ? `<span>🧾 Money Records — in progress now</span><span>🗣️ Customer English — feeds your portfolio</span>` : ''}
      </div></span>
    </section>`).join('');
    const content = `
  <main class="page">
    <section class="horizon-hero rv">
      <span class="sun"></span>
      <h1>The horizon 🌅</h1>
      <p>No classroom required. Skills, proof, income — the road meets you where you are, and every gate checks skill alone.</p>
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
  else if(h.startsWith('lesson/')){ const p = h.split('/'); html = viewLesson(p[1], p[2]); }
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

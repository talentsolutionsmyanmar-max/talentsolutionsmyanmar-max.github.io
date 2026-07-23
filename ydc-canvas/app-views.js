/* ============================================================
   YDC — THE NIGHT TRAIL · app-views.js (home + map views)
   Load order: app-data → app-rules → app-flow → app-content →
   app-views → app.js. Data files bind window.* names this file
   reads as bare globals. All learner data INVENTED (seeded PRNG).
   ============================================================ */
'use strict';

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
  const lessons = lessonStates(mod.id, 'active');
  const cur = lessons.find(l=>l.state==='current') || lessons[lessons.length-1];
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
          <span class="qnext">${lessons.every(l=>l.state==='done') ? 'All lessons done — the real-world quest is waiting 🌍' : `Next: ${TYPE_META[cur.type].em} ${cur.title} · ${cur.dur} min`}</span>
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

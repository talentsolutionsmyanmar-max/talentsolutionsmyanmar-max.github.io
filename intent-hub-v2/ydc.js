/* ============================================================
   YDC schoolhouse — path / lesson / mastery check / scripted Maya
   Zero-touch: reads window.__ydc, renders into #ydcTrail + #ydcLesson.
   Laws: mastery-not-grade (degree-of-fit, no scores, no fail states) ·
   no-shame re-route + parallel re-ask · Maya never solves checks ·
   honest lanes (CCO_PENDING assets disclosed, never faked).
   Class names follow ydc.css exactly.
   ============================================================ */
(function(){
"use strict";

var MAYA_QA = [
  ["How do I work this lesson?",
   "Read the scene once, then say every “at work” line out loud — quiet is fine. The book line is correct grammar; the work line is the one that survives a real shift. When your mouth knows both, run the check."],
  ["The check feels hard. What am I missing?",
   "Nothing about you. Ask one question of every option: would I say this to a tired colleague at 7pm? If it sounds like an exam, it belongs to the book."],
  ["What if I pick wrong?",
   "Then the lesson is working. There is no score here and nothing to fail — pick, read the note, pick again. The re-ask stays open until every answer lands at best fit."]
];
var BACK_SVG = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>';
var CHEV_SVG = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>';
var HEAR_SVG = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/></svg>';
var MIC_SVG = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 19v3"/></svg>';

function h(tag, cls, text){
  var n = document.createElement(tag);
  if(cls) n.className = cls;
  if(text != null) n.textContent = text;
  return n;
}
function clear(n){ while(n.firstChild) n.removeChild(n.firstChild); }
function shuffle(a){
  a = a.slice();
  for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=t; a[j]=t; a[i]=a[j]; a[j]=t; }
  return a;
}

/* ---------- device-kept progress (honest: this device only) ---------- */
var PKEY = "ydc.path.v1";
function pLoad(){ try{ return JSON.parse(localStorage.getItem(PKEY)||"{}"); }catch(e){ return {}; } }
function pSave(p){ try{ localStorage.setItem(PKEY, JSON.stringify(p)); }catch(e){} }

/* ---------- device voice (honest: this device speaks — studio voice in progress) ---------- */
var VOICE = { ok: ("speechSynthesis" in window), v: null };
function voicePick(){
  if(!VOICE.ok) return;
  var vs = [];
  try{ vs = speechSynthesis.getVoices() || []; }catch(e){}
  var en = vs.filter(function(x){ return /^en([-_]|$)/i.test(x.lang || ""); });
  VOICE.v = en.filter(function(x){ return /US/i.test(x.lang); })[0] || en[0] || null;
}
if(VOICE.ok){
  voicePick();
  try{ speechSynthesis.onvoiceschanged = voicePick; }catch(e){}
}
function speakLine(text, rate, btn){
  if(!VOICE.ok) return;
  try{
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    if(VOICE.v){ try{ u.voice = VOICE.v; }catch(e){} }
    u.lang = (VOICE.v && VOICE.v.lang) || "en-US";
    u.rate = rate;
    if(btn){
      btn.classList.add("speaking");
      u.onend = u.onerror = function(){ btn.classList.remove("speaking"); };
    }
    speechSynthesis.speak(u);
  }catch(e){}
}

/* ---------- line mastery (this device): 1 met the sound · 2 produced it ---------- */
var LKEY = "ydc.lines.v1";
function lLoad(){ try{ return JSON.parse(localStorage.getItem(LKEY)||"{}"); }catch(e){ return {}; } }
function lSave(m){ try{ localStorage.setItem(LKEY, JSON.stringify(m)); }catch(e){} }
function lineState(slug, idx){ var m = lLoad(); return (m[slug] && m[slug][idx]) || 0; }
function lineMet(slug, idx, st){
  var m = lLoad();
  if(!m[slug]) m[slug] = {};
  if((m[slug][idx] || 0) < st){ m[slug][idx] = st; lSave(m); }
}
function linesYours(){
  var m = lLoad(), n = 0;
  Object.keys(m).forEach(function(s){
    Object.keys(m[s]).forEach(function(i){ if(m[s][i] >= 2) n++; });
  });
  return n;
}
function hearBtns(line, slug, idx){
  var wrap = h("span","ydc-hear");
  if(!VOICE.ok){ wrap.style.display = "none"; return wrap; }
  var b1 = h("button","ydc-hear-btn");
  b1.type = "button";
  b1.setAttribute("aria-label","hear this line");
  b1.innerHTML = HEAR_SVG;
  b1.addEventListener("click", function(){ speakLine(line, 0.95, b1); lineMet(slug, idx, 1); });
  var b2 = h("button","ydc-hear-btn slow","slow");
  b2.type = "button";
  b2.setAttribute("aria-label","hear this line slowly");
  b2.addEventListener("click", function(){ speakLine(line, 0.6, b2); lineMet(slug, idx, 1); });
  wrap.appendChild(b1);
  wrap.appendChild(b2);
  return wrap;
}
function refreshGate(){
  var g = document.getElementById("ydcGateGo");
  if(!g || !window.__ydc) return;
  var prog = pLoad();
  var done = window.__ydc.lessons.filter(function(l){ return prog[l.slug]; }).length;
  var card = g.closest(".ydc-gate");
  if(done >= window.__ydc.lessons.length){
    card.classList.add("open");
    card.querySelector("h3").textContent = "JOB-READY — the gate is open";
    card.querySelector("p").innerHTML = "You walked all eighteen on this device. The platform keeps the real record — <b>you are the proof now</b>.";
    if(g.firstChild) g.firstChild.nodeValue = "walk it again";
  }
}

/* ---------- trail ---------- */
function renderTrail(){
  var D = window.__ydc, host = document.getElementById("ydcTrail");
  if(!D || !host) return;
  clear(host);
  var prog = pLoad();
  D.bands.forEach(function(band){
    var lessons = D.lessons.filter(function(l){ return l.band === band.id; });
    var walked = lessons.filter(function(l){ return prog[l.slug]; }).length;
    var card = h("section","ydc-band");
    card.setAttribute("data-band", band.id);
    var head = h("div","ydc-band-head");
    head.appendChild(h("span","ydc-band-name",band.name));
    head.appendChild(h("span","ydc-band-sub",band.sub));
    head.appendChild(h("span","ydc-band-count", walked ? (walked+"/"+lessons.length+" walked") : (lessons.length+" lessons")));
    card.appendChild(head);
    lessons.forEach(function(l){
      var row = h("button","ydc-row");
      row.type = "button";
      row.setAttribute("aria-label", l.code + " — " + l.title_en);
      if(prog[l.slug]) row.classList.add("done");
      row.appendChild(h("span","ydc-code",l.code));
      var rt = h("span","ydc-rt");
      rt.appendChild(h("b",null,l.title_en));
      rt.appendChild(h("i",null,l.title_mm));
      row.appendChild(rt);
      row.appendChild(h("span","ydc-rtag",l.workplace));
      row.appendChild(h("span","ydc-tick","✓"));
      var chev = h("span","ydc-chev");
      chev.innerHTML = CHEV_SVG;
      row.appendChild(chev);
      row.addEventListener("click", function(){ openLesson(l.slug, true); });
      card.appendChild(row);
    });
    host.appendChild(card);
  });
  var yours = linesYours();
  var totalLines = D.lessons.reduce(function(n, x){ return n + x.phrases.length; }, 0);
  host.appendChild(h("p","ydc-progress-note",
    "your walk is kept on this device only · the platform keeps the real record" +
    (yours ? " · " + yours + "/" + totalLines + " lines becoming yours" : "")));
}

/* ---------- lesson overlay ---------- */
var view, cur = null;

function openLesson(slug, push){
  var l = null;
  window.__ydc.lessons.forEach(function(x){ if(x.slug === slug) l = x; });
  if(!l || !view) return;
  if(VOICE.ok){ try{ speechSynthesis.cancel(); }catch(e){} }
  cur = { l:l, answered:0 };
  buildLesson();
  view.hidden = false;
  document.body.style.overflow = "hidden";
  view.scrollTop = 0;
  if(push && history.replaceState) history.replaceState(null,"","?l="+slug);
}
function closeLesson(){
  if(!view) return;
  if(VOICE.ok){ try{ speechSynthesis.cancel(); }catch(e){} }
  view.hidden = true;
  document.body.style.overflow = "";
  if(history.replaceState) history.replaceState(null,"",location.pathname);
  var t = document.getElementById("ydcTrail");
  if(t) t.scrollIntoView({block:"start"});
}

function buildLesson(){
  var l = cur.l;
  clear(view);

  /* topbar */
  var bar = h("div","ydc-topbar");
  var back = h("button","ydc-back");
  back.type = "button";
  back.innerHTML = BACK_SVG;
  back.appendChild(document.createTextNode("path"));
  back.addEventListener("click", closeLesson);
  bar.appendChild(back);
  bar.appendChild(h("span","ydc-lcode",l.code+" · "+l.cefr));
  var mayaBtn = h("button","ydc-maya-chip","Maya");
  mayaBtn.type = "button";
  mayaBtn.addEventListener("click", function(){
    var p = view.querySelector(".ydc-maya-panel");
    if(p) p.classList.toggle("open");
  });
  bar.appendChild(mayaBtn);
  view.appendChild(bar);

  var body = h("div","ydc-wrap");

  /* head */
  var head = h("header");
  head.appendChild(h("h1","ydc-h1",l.title_en));
  head.appendChild(h("p","ydc-hmm",l.title_mm));
  head.appendChild(h("span","ydc-wtag",l.workplace));
  body.appendChild(head);

  /* recall — the weakest line you already met, before the new scene (adaptive return loop) */
  var prog0 = pLoad(), cand = [];
  window.__ydc.lessons.forEach(function(x){
    if(x.slug === l.slug || !prog0[x.slug]) return;
    x.phrases.forEach(function(p, pi){
      cand.push({ les:x, idx:pi, st:lineState(x.slug, pi) });
    });
  });
  if(cand.length){
    cand.sort(function(a, b){ return a.st - b.st; });
    var pool = cand.filter(function(c){ return c.st === cand[0].st; });
    var pick = pool[Math.floor(Math.random()*pool.length)];
    var rc = h("div","ydc-recall");
    rc.appendChild(h("p","ydc-recall-k","before the new scene · one line from "+pick.les.code));
    rc.appendChild(h("p","ydc-recall-cue","You walked “"+pick.les.title_en+"” already. Say this line out loud — then peek."));
    var ans = h("div","ydc-recall-ans");
    ans.appendChild(h("p",null,pick.les.phrases[pick.idx][1]));
    ans.appendChild(hearBtns(pick.les.phrases[pick.idx][1], pick.les.slug, pick.idx));
    var rb = h("button","ydc-recall-btn","show me the line");
    rb.type = "button";
    rb.addEventListener("click", function(){
      rc.classList.add("open");
      rb.remove();
      var mine = h("button","ydc-recall-mine","I said it — mark it mine");
      mine.type = "button";
      mine.addEventListener("click", function(){
        lineMet(pick.les.slug, pick.idx, 2);
        mine.remove();
        rc.appendChild(h("p","ydc-recall-done","yours now — it will come back less often."));
      });
      rc.appendChild(mine);
    });
    rc.appendChild(ans);
    rc.appendChild(rb);
    body.appendChild(rc);
  }

  /* scene */
  var sec1 = h("section","ydc-sec");
  var lab1 = h("p","ydc-slabel","the scene");
  lab1.appendChild(h("em",null,"picture the shift before you speak"));
  sec1.appendChild(lab1);
  var sc = h("div","ydc-card");
  sc.appendChild(h("p","ydc-en",l.scenario_en));
  sc.appendChild(h("p","ydc-mm",l.scenario_mm));
  sec1.appendChild(sc);
  body.appendChild(sec1);

  /* phrases */
  var sec2 = h("section","ydc-sec");
  var lab2 = h("p","ydc-slabel","the lines");
  lab2.appendChild(h("em",null,"same meaning — the book, then the floor"));
  sec2.appendChild(lab2);
  if(VOICE.ok) sec2.appendChild(h("p","ydc-voice-note","tap to hear every work line — device voice on your phone · studio voice in progress (CTO lane)"));
  l.phrases.forEach(function(ph, pi){
    var card = h("article","ydc-ph");
    var book = h("div","ydc-ph-book");
    book.appendChild(h("span","ydc-tag","the book"));
    book.appendChild(h("span",null,ph[0]));
    card.appendChild(book);
    var work = h("div","ydc-ph-work");
    work.appendChild(h("span","ydc-tag work","at work"));
    work.appendChild(h("span",null,ph[1]));
    work.appendChild(hearBtns(ph[1], l.slug, pi));
    if(lineState(l.slug, pi) >= 2) work.classList.add("mine");
    card.appendChild(work);
    var mt = h("button","ydc-ph-mmt","မြန်မာ မှတ်ချက်");
    mt.type = "button";
    mt.setAttribute("aria-expanded","false");
    var mm = h("div","ydc-ph-mm");
    mm.appendChild(h("p",null,ph[2]));
    mt.addEventListener("click", function(){
      var open = mm.classList.toggle("open");
      mt.setAttribute("aria-expanded", open ? "true" : "false");
    });
    card.appendChild(mt);
    card.appendChild(mm);
    sec2.appendChild(card);
  });
  body.appendChild(sec2);

  /* grammar */
  if(l.grammar_en){
    var sec3 = h("section","ydc-sec");
    sec3.appendChild(h("p","ydc-slabel","the pattern"));
    var g = h("div","ydc-card ydc-grammar");
    g.appendChild(h("p","ydc-en",l.grammar_en));
    if(l.grammar_mm) g.appendChild(h("p","ydc-mm",l.grammar_mm));
    sec3.appendChild(g);
    body.appendChild(sec3);
  }

  body.appendChild(buildSheet(l));
  body.appendChild(buildCheck(l));

  /* footer */
  var ft = h("p","ydc-lfoot");
  ft.textContent = window.__ydc.meta.source + " · verified " + window.__ydc.meta.asof + " · mastery, not grades";
  body.appendChild(ft);

  view.appendChild(body);
  view.appendChild(buildMaya());
}

/* ---------- sheet ---------- */
function buildSheet(l){
  var sec = h("section","ydc-sec");
  var lab = h("p","ydc-slabel","your sheet");
  lab.appendChild(h("em",null,"keep it — one look before a shift"));
  sec.appendChild(lab);
  var s = h("div","ydc-card ydc-sheet");
  var ol = h("ol");
  [
    "Read the scene once — picture the counter, the guest, the moment.",
    "Say every “at work” line out loud, twice. Quiet is fine.",
    "Run the check below until every answer lands at best fit.",
    "Use one line today — in a message, or in your head."
  ].forEach(function(t){ ol.appendChild(h("li",null,t)); });
  s.appendChild(ol);
  s.appendChild(h("span","ydc-lane","CCO lane · မြန်မာ glossary + voice in progress — lands here when signed"));
  var btn = h("button","ydc-copy","copy this sheet");
  btn.type = "button";
  btn.addEventListener("click", function(){
    var txt = l.code+" — "+l.title_en+" ("+l.workplace+")\n"+
      l.scenario_en+"\n\n"+
      l.phrases.map(function(p,i){ return (i+1)+". book: "+p[0]+"\n   work: "+p[1]+"\n   mm: "+p[2]; }).join("\n")+
      (l.grammar_en ? "\n\npattern: "+l.grammar_en : "")+
      "\n\nYDC · "+window.__ydc.meta.asof;
    function ok(){ btn.textContent = "copied ✓"; setTimeout(function(){ btn.textContent = "copy this sheet"; },1800); }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(ok, ok);
    } else {
      var ta = document.createElement("textarea");
      ta.value = txt; document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); }catch(e){}
      document.body.removeChild(ta); ok();
    }
  });
  s.appendChild(btn);
  sec.appendChild(s);
  return sec;
}

/* ---------- check ---------- */
function buildCheck(l){
  var sec = h("section","ydc-sec");
  var lab = h("p","ydc-slabel","the check");
  lab.appendChild(h("em",null,"mastery, not grades — the re-ask never closes"));
  sec.appendChild(lab);
  sec.appendChild(h("p","ydc-check-intro",
    "Four moments, no scores. “Best fit” means you found the working line — and the last one you say yourself. Anything else is just a signpost — read the note, try again."));
  /* Maya steps aside during the check — she never solves it, and never covers it */
  sec.addEventListener("click", function(){
    var p = view.querySelector(".ydc-maya-panel.open");
    if(p) p.classList.remove("open");
  }, {once:true});

  var others = shuffle(window.__ydc.lessons.filter(function(x){ return x.slug !== l.slug; }));

  /* Q1 — work voice */
  var q1 = qBlock(sec, "moment 1 · work voice",
    "“"+l.phrases[0][0]+"” — how does this actually sound on the floor?");
  singlePick(q1, shuffle([{t:l.phrases[0][1], fit:2}]
    .concat(others.slice(0,3).map(function(o){ return {t:o.phrases[0][1], fit:1}; }))),
    function(fit){
      if(fit === 2) return { cls:"best", head:"Best fit.", body:"That is the line as it is actually said — short, polite, movable.", final:true };
      return { cls:"partial", head:"Right voice, wrong shift.",
        body:"That is a real work line, but it belongs to another lesson. Find the one that matches this scene and pick again." };
    });

  /* Q2 — book or work (pick the two naturals) */
  var q2 = qBlock(sec, "moment 2 · book or work",
    "Four lines. Tap the two that would survive a real shift, then check your picks.");
  var q2data = shuffle([
    {t:l.phrases[1][0], nat:false}, {t:l.phrases[2][0], nat:false},
    {t:others[0].phrases[1][1], nat:true}, {t:others[1].phrases[1][1], nat:true}
  ]);
  var q2btns = [];
  var q2note = h("div");
  var q2btn = h("button","ydc-confirm","check my picks");
  q2btn.type = "button";
  q2btn.disabled = true;
  q2data.forEach(function(d){
    var o = h("button","ydc-opt",d.t);
    o.type = "button";
    o.addEventListener("click", function(){
      if(q2.done) return;
      d.on = !d.on;
      o.classList.toggle("sel", d.on);
      q2btn.disabled = (q2data.filter(function(x){ return x.on; }).length !== 2);
    });
    q2btns.push(o);
    q2.appendChild(o);
  });
  q2btn.addEventListener("click", function(){
    if(q2.done) return;
    var right = q2data.filter(function(x){ return x.on && x.nat; }).length;
    q2data.forEach(function(d,i){
      if(d.on) q2btns[i].classList.add(d.nat ? "best" : "notyet");
    });
    if(right === 2){
      q2.done = true;
      q2btn.remove();
      setNote(q2note, "best", "Best fit.", "You can hear the difference between the book and the floor — that is the whole skill.");
      tally(sec, l);
    } else if(right === 1){
      setNote(q2note, "partial", "Halfway there.",
        "One pick still sounds like a textbook. Swap it for the other line you would actually say.");
      q2data.forEach(function(d,i){ if(d.on && !d.nat){ d.on=false; q2btns[i].className="ydc-opt"; } });
      q2btn.disabled = true;
    } else {
      setNote(q2note, "notyet", "Not yet — and that is fine.",
        "Both picks came from the book. Read the “at work” lines once more, then try again.");
      reroute();
      q2data.forEach(function(d,i){ if(d.on){ d.on=false; q2btns[i].className="ydc-opt"; } });
      q2btn.disabled = true;
    }
  });
  q2.appendChild(q2btn);
  q2.appendChild(q2note);

  /* Q3 — the colleague test */
  var q3 = qBlock(sec, "moment 3 · the colleague test",
    l.scenario_en+" Your colleague freezes in this exact moment. What do you hand them?");
  singlePick(q3, shuffle([
    {t:l.phrases[1][1], fit:2},
    {t:l.phrases[1][0], fit:1},
    {t:others[2].phrases[0][1], fit:0}
  ]), function(fit){
    if(fit === 2) return { cls:"best", head:"Best fit.", body:"You handed them the line they can use tonight.", final:true };
    if(fit === 1) return { cls:"partial", head:"True, but heavy.",
      body:"Correct words, classroom sound. Hand them the working line, not the page." };
    return { cls:"notyet", head:"Not this moment.",
      body:"That line belongs to a different scene. Reread this one, then pick again." };
  });

  /* Q4 — say it yourself (voice first where the device allows, typing always) */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
  var q4 = qBlock(sec, "moment 4 · say it yourself",
    SR ? "No options this time. Speak the line you would actually say — or type it. Close counts."
       : "No options this time. The moment is in front of you — type the line you would actually say, in your own words. Close counts.");
  var sayRow = h("div","ydc-say-row");
  var sayIn = h("input","ydc-say-in");
  sayIn.type = "text";
  sayIn.setAttribute("autocomplete","off");
  sayIn.setAttribute("aria-label","Your line");
  sayIn.placeholder = "your line, your words…";
  var sayGo = h("button","ydc-confirm","try it");
  sayGo.type = "button";
  var sayNote = h("div");
  var sayMiss = 0, sayDone = false, micBtn = null;
  var SAY_STOP = {};
  ("the a an to for of and or is are am do does did you your i we me my our please just can could would will shall should may might how what who it its that this these those on in at by be been being have has had with from about so up down there here not no if as he she they them his her their were was are").split(" ").forEach(function(w){ SAY_STOP[w]=1; });
  function sayTokens(s){
    return s.toLowerCase().replace(/[^a-z0-9\s']/g," ").split(/\s+/).filter(function(t){ return t.length>2 && !SAY_STOP[t]; });
  }
  function sayGrade(){
    if(sayDone) return;
    var t = sayTokens(sayIn.value);
    if(t.length < 2){
      setNote(sayNote, "notyet", "Give me the line, not a word.",
        "Two or three real words at least — the way you would say it to a person.");
      return;
    }
    var best = 0, bestLine = null;
    l.phrases.forEach(function(p){
      var target = sayTokens(p[1]);
      if(!target.length) return;
      var hit = target.filter(function(x){ return t.indexOf(x) >= 0; }).length;
      var r = hit / target.length;
      if(r > best){ best = r; bestLine = p[1]; }
    });
    if(!bestLine) bestLine = l.phrases[0][1];
    var bestIdx = -1;
    l.phrases.forEach(function(p, pi){ if(p[1] === bestLine) bestIdx = pi; });
    if(best >= 0.75){
      sayDone = true;
      sayIn.disabled = true;
      sayGo.remove();
      if(micBtn) micBtn.disabled = true;
      if(bestIdx >= 0){
        lineMet(l.slug, bestIdx, 2);
        var rows = view.querySelectorAll(".ydc-ph-work");
        if(rows[bestIdx]) rows[bestIdx].classList.add("mine");
      }
      setNote(sayNote, "best", "Best fit — in your own hands.",
        "You did not pick the line. You produced it. That is the moment it becomes yours.");
      tally(sec, l);
    } else {
      sayMiss++;
      if(sayMiss >= 3){
        sayDone = true;
        sayIn.disabled = true;
        sayGo.remove();
        if(micBtn) micBtn.disabled = true;
        if(bestIdx >= 0) lineMet(l.slug, bestIdx, 1);
        setNote(sayNote, "partial", "Here — take the line.",
          "“"+bestLine+"” — say it out loud once, slowly. It will be yours next time.");
        tally(sec, l);
      } else if(best >= 0.4){
        setNote(sayNote, "partial", "The bones are there.",
          "You have the right idea — now say it again with the whole line, every word earning its place.");
      } else {
        setNote(sayNote, "notyet", "Not yet — and that is fine.",
          "Read the “at work” lines once more, then try again. Nobody is counting.");
        reroute();
      }
    }
  }
  sayGo.addEventListener("click", sayGrade);
  sayIn.addEventListener("keydown", function(e){ if(e.key === "Enter") sayGrade(); });
  if(SR){
    var micRow = h("div","ydc-mic-row");
    var mic = h("button","ydc-mic");
    mic.type = "button";
    mic.innerHTML = MIC_SVG;
    mic.appendChild(document.createTextNode(" speak the line"));
    micBtn = mic;
    var listening = false;
    mic.addEventListener("click", function(){
      if(sayDone || listening) return;
      var rec;
      try{ rec = new SR(); }catch(e){
        setNote(sayNote, "notyet", "The mic is not answering.", "Type the line instead — same ground, same line.");
        return;
      }
      try{
        rec.lang = "en-US";
        rec.interimResults = false;
        rec.maxAlternatives = 3;
      }catch(e){}
      listening = true;
      mic.classList.add("listening");
      mic.lastChild.nodeValue = " listening… speak now";
      var settled = false;
      function settle(){
        if(settled) return;
        settled = true;
        listening = false;
        mic.classList.remove("listening");
        mic.lastChild.nodeValue = " speak the line";
      }
      rec.onresult = function(ev){
        settle();
        var bestT = "", bestC = -1;
        try{
          for(var i = 0; i < ev.results[0].length; i++){
            var alt = ev.results[0][i];
            if(alt.confidence > bestC){ bestC = alt.confidence; bestT = alt.transcript; }
          }
        }catch(e){}
        if(bestT){
          sayIn.value = bestT;
          sayGrade();
        } else {
          setNote(sayNote, "notyet", "The mic heard nothing.", "Speak a little closer, or type the line — both count the same.");
        }
      };
      rec.onerror = function(ev){
        settle();
        setNote(sayNote, "notyet", "The mic missed that one.",
          (ev && ev.error === "not-allowed")
            ? "Mic permission is off — typing works exactly the same. Your line, your way."
            : "No harm done — type the line, or tap the mic and try again.");
      };
      rec.onend = function(){ settle(); };
      try{ rec.start(); }catch(e){
        settle();
        setNote(sayNote, "notyet", "The mic is not answering.", "Type the line instead — same ground, same line.");
      }
    });
    micRow.appendChild(mic);
    micRow.appendChild(h("span","ydc-mic-note","your device listens · typing works too"));
    q4.appendChild(micRow);
  }
  sayRow.appendChild(sayIn);
  sayRow.appendChild(sayGo);
  q4.appendChild(sayRow);
  q4.appendChild(sayNote);

  function singlePick(q, opts, judge){
    var note = h("div");
    var locked = false;
    opts.forEach(function(d){
      var o = h("button","ydc-opt",d.t);
      o.type = "button";
      o.addEventListener("click", function(){
        if(locked) return;
        var r = judge(d.fit);
        q.querySelectorAll(".ydc-opt").forEach(function(x){ x.className = "ydc-opt"; });
        o.classList.add("sel", r.cls);
        setNote(note, r.cls, r.head, r.body);
        if(r.final){
          locked = true;
          tally(sec, l);
        } else {
          if(r.cls === "notyet") reroute();
          setTimeout(function(){ if(!locked){ o.className = "ydc-opt"; } }, 1500);
        }
      });
      q.appendChild(o);
    });
    q.appendChild(note);
  }
  return sec;

  function qBlock(host, step, prompt){
    var q = h("div","ydc-q on");
    q.appendChild(h("p","ydc-q-k",step));
    q.appendChild(h("p","ydc-q-p",prompt));
    host.appendChild(q);
    return q;
  }
  function setNote(host, cls, head, bodyTxt){
    clear(host);
    var f = h("div","ydc-fit "+cls+" on");
    f.appendChild(h("strong",null,head));
    f.appendChild(h("p",null,bodyTxt));
    host.appendChild(f);
  }
  function reroute(){
    var ph = view.querySelectorAll(".ydc-ph");
    for(var i=0;i<ph.length;i++){
      (function(p,k){
        setTimeout(function(){ p.classList.add("pulse"); }, k*120);
        setTimeout(function(){ p.classList.remove("pulse"); }, 1700 + k*120);
      })(ph[i], i);
    }
  }
  function tally(host, l){
    cur.answered++;
    if(cur.answered >= 4) showDone(host, l);
  }
}

function showDone(host, l){
  var old = host.querySelector(".ydc-done");
  if(old) old.remove();
  var d = h("div","ydc-done on");
  d.appendChild(h("h4",null,"You showed you can do this."));
  d.appendChild(h("p",null,
    "You picked the working lines, then said one in your own words — no score, just ground under your feet. Use one line today."));
  var row = h("div","ydc-done-row");
  var again = h("button","ydc-again","run it again");
  again.type = "button";
  again.addEventListener("click", function(){ openLesson(l.slug, false); });
  row.appendChild(again);
  var nxt = null;
  window.__ydc.lessons.forEach(function(x){ if(x.order === l.order+1) nxt = x; });
  if(nxt){
    var nb = h("button","ydc-next","next · "+nxt.code);
    nb.type = "button";
    nb.addEventListener("click", function(){ openLesson(nxt.slug, true); });
    row.appendChild(nb);
  } else {
    var gb = h("button","ydc-next","back to the path");
    gb.type = "button";
    gb.addEventListener("click", closeLesson);
    row.appendChild(gb);
  }
  d.appendChild(row);
  host.appendChild(d);
  var prog = pLoad();
  if(!prog[l.slug]){
    prog[l.slug] = { at: new Date().toISOString().slice(0,10) };
    pSave(prog);
  }
  renderTrail();
  refreshGate();
  d.scrollIntoView({block:"center"});
}

/* ---------- scripted Maya ---------- */
function buildMaya(){
  var p = h("aside","ydc-maya-panel");
  p.setAttribute("aria-label","Maya — scripted preview");
  p.appendChild(h("h5",null,"Maya · scripted preview"));
  MAYA_QA.forEach(function(qa){
    var q = h("button","ydc-maya-q",qa[0]);
    q.type = "button";
    var a = h("div","ydc-maya-a");
    a.appendChild(h("p",null,qa[1]));
    q.addEventListener("click", function(){ a.classList.toggle("on"); });
    p.appendChild(q);
    p.appendChild(a);
  });
  if(!buildMaya._shown){ p.classList.add("open"); buildMaya._shown = true; }
  return p;
}

/* ---------- boot ---------- */
function boot(){
  view = document.getElementById("ydcLesson");
  if(!view || !window.__ydc) return;
  renderTrail();
  refreshGate();
  var gate = document.getElementById("ydcGateGo");
  if(gate) gate.addEventListener("click", function(){
    var first = window.__ydc.lessons[0];
    if(first) openLesson(first.slug, true);
  });
  var m = /[?&]l=([a-z0-9-]+)/.exec(location.search);
  if(m) openLesson(m[1], false);
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();

})();

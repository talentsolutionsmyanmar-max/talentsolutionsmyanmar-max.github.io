(function(){
"use strict";
var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
var ect = conn.effectiveType || '';
var slowNet = !!conn.saveData || ect === 'slow-2g' || ect === '2g' || ect === '3g';
var lowMem = typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4;
var qs = new URLSearchParams(location.search);
var lite = qs.get('lite')==='1' || (qs.get('full')!=='1' && (slowNet || lowMem));
var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || lite;
var hasGsap = typeof gsap !== 'undefined';
if(lite){ document.body.classList.add('lite'); }
if(!hasGsap || reduced){ document.body.classList.add('noanim'); }

var NAMES=['KBZ Life Insurance','NielsenIQ Myanmar','Otsuka Myanmar','Unicharm Myanmar','Connect Gateway','Yangoods','Thadoe Mahar','RK Yangon Steel','Electronic City','Wagon Links','Myanmar IndoBest','AMI Life Insurance','HTI Myanmar','Power Link','Marga Global','Real Aid Microfinance','GK International','Kozicol Intertrade','TOMO','Wave Plus','WOW Sports','Shwe Taung Htun','Pacific Dragon','Rebirth Hair','Royal Care Plus','Sal Pyar','Sankoyo Frontier','Universal Energy','Innopex','Minn Shwe Htee','Shwe Chan'];
var half=NAMES.map(function(n){return '<span>'+n+' <b>·</b></span>';}).join('');
document.getElementById('tick2').innerHTML=half+half;
var mq=document.getElementById('mqTrack'); mq.innerHTML+=mq.innerHTML;

var nav=document.getElementById('nav');
function onScroll(){ nav.classList.toggle('scrolled', window.scrollY>24); }
addEventListener('scroll', onScroll, {passive:true}); onScroll();

var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
if(fine && !reduced){
  var dot=document.getElementById('curDot'), ring=document.getElementById('curRing');
  var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;dot.style.transform='translate('+(mx-3)+'px,'+(my-3)+'px)';},{passive:true});
  (function loop(){rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.transform='translate('+(rx-ring.offsetWidth/2)+'px,'+(ry-ring.offsetHeight/2)+'px)';requestAnimationFrame(loop);})();
  document.querySelectorAll('a,button,.opt2,.fqQ').forEach(function(el){
    el.addEventListener('mouseenter',function(){ring.classList.add('big');});
    el.addEventListener('mouseleave',function(){ring.classList.remove('big');});
  });
  document.querySelectorAll('[data-mag]').forEach(function(el){
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();
      el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)';});
    el.addEventListener('mouseleave',function(){el.style.transform='';});
  });
  document.querySelectorAll('.cli,.bCell').forEach(function(el){
    el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();
      el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');});
  });
  var aura=document.getElementById('heroAura'), sIn=document.getElementById('surfaceIn');
  document.getElementById('hero').addEventListener('mousemove',function(e){
    aura.style.setProperty('--mx',(e.clientX/innerWidth*100)+'%');
    aura.style.setProperty('--my',(e.clientY/innerHeight*100)+'%');
    var x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
    sIn.style.transform='rotateY('+(x*7)+'deg) rotateX('+(-y*6)+'deg)';
  },{passive:true});
}

var typeEl=document.getElementById('typeHero');
var MM_WORDS='Salary negotiation ကို မည်သို့ ပြင်ဆင်ရပါမည်နည်း'.split(' ');
if(reduced){
  typeEl.textContent=MM_WORDS.join(' ');
}
if(reduced || !hasGsap){
  var rn=document.getElementById('ringNum'); if(rn){ rn.textContent='87'; }
  var ra=document.getElementById('ringArc'); if(ra){ ra.setAttribute('stroke-dashoffset','20'); }
}
if(!reduced){
  var wi=0;
  (function typeNext(){
    if(wi<=MM_WORDS.length){
      typeEl.innerHTML=MM_WORDS.slice(0,wi).join(' ')+'<span class="caret"></span>';
      wi++; setTimeout(typeNext, 300);
    } else { setTimeout(function(){wi=0;typeNext();}, 4200); }
  })();
}

if(hasGsap && !reduced){
  gsap.registerPlugin(ScrollTrigger);

  if(typeof Lenis!=='undefined'){
    var lenis=new Lenis({lerp:.09, smoothWheel:true});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(t){ lenis.raf(t*1000); });
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(function(a){
      a.addEventListener('click',function(e){var id=a.getAttribute('href');
        if(id.length>1 && document.querySelector(id)){e.preventDefault();lenis.scrollTo(id,{offset:-70});}});
    });
  }

  gsap.to('.h1 .ln > span',{y:0,duration:1.15,ease:'power4.out',stagger:.12,delay:.15});
  gsap.from('.heroLic,.heroMm,.heroSub,.ctaRow,.heroNote',{opacity:0,y:24,duration:1,ease:'power3.out',stagger:.08,delay:.5});
  gsap.from('.surface',{opacity:0,y:40,duration:1.2,ease:'power3.out',delay:.7});

  var arc=document.getElementById('ringArc'), num=document.getElementById('ringNum'), C=157;
  gsap.to({v:0},{v:87,duration:1.8,ease:'power2.out',delay:1.1,onUpdate:function(){
    var v=this.targets()[0].v; num.textContent=Math.round(v);
    arc.setAttribute('stroke-dashoffset', C-(C*v/100));
  }});

  gsap.to('#mqTrack',{xPercent:-50,ease:'none',scrollTrigger:{trigger:'.mq',start:'top bottom',end:'bottom top',scrub:1.2}});

  ScrollTrigger.batch('.rv3',{start:'top 88%',onEnter:function(els){
    gsap.to(els,{opacity:1,y:0,duration:1,ease:'power3.out',stagger:.09,overwrite:true});
  }});

  document.querySelectorAll('[data-count]').forEach(function(el){
    var t=+el.dataset.count;
    ScrollTrigger.create({trigger:el,start:'top 85%',once:true,onEnter:function(){
      gsap.to({v:0},{v:t,duration:1.6,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(this.targets()[0].v);}});
    }});
  });

  document.querySelectorAll('.rungBar i').forEach(function(bar){
    gsap.to(bar,{width:bar.dataset.w+'%',duration:1.2,ease:'power3.out',
      scrollTrigger:{trigger:bar,start:'top 88%'}});
  });

  var mm=gsap.matchMedia();
  mm.add('(min-width: 900px)',function(){
    var track=document.getElementById('jTrack'), pin=document.getElementById('jPin');
    var dist=function(){return track.scrollWidth - document.documentElement.clientWidth + 96;};
    gsap.to(track,{x:function(){return -dist();},ease:'none',
      scrollTrigger:{trigger:pin,start:'top top',end:function(){return '+='+dist();},
        pin:true,scrub:1,invalidateOnRefresh:true,anticipatePin:1,
        onUpdate:function(st){document.getElementById('jBarFill').style.width=(st.progress*100)+'%';}}});
  });

  gsap.to('#h1',{yPercent:-14,opacity:.35,ease:'none',
    scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
}
else{
  document.querySelectorAll('[data-count]').forEach(function(el){ el.textContent=el.dataset.count; });
  document.querySelectorAll('.rungBar i').forEach(function(bar){ bar.style.width=bar.dataset.w+'%'; });
}
})();

/* ============ CAREER SIMULATOR ============ */
(function(){
var stage=document.getElementById('gmStage');
if(!stage){ return; }
var SCEN=[
 {k:"SCENARIO 01 — THE QUARTERLY REPORT",
  t:"Your colleague made a mistake in the quarterly report. Your manager will discover it in 10 minutes. Your colleague is watching you.",
  o:[
   {k:"A",t:"Tell the manager. Take shared responsibility.",xp:20,tr:{trust:2,courage:1,wisdom:1},fb:"You took the hit together. Managers promote people who own problems — and your colleague will never forget who stood with them."},
   {k:"B",t:"Fix it quietly. Tell no one.",xp:10,tr:{trust:0,courage:1,wisdom:2},fb:"Problem solved, but silently. Nobody learned anything — and if it surfaces later, trust breaks twice as hard."},
   {k:"C",t:"Let your colleague handle it alone.",xp:5,tr:{trust:0,courage:0,wisdom:1},fb:"Fair — it is their mistake. But teams are judged together, and your manager noticed you watching from the side."},
   {k:"D",t:"Blame the accounting system.",xp:0,tr:{trust:0,courage:0,wisdom:0},fb:"The system did not make the mistake. Deflection is the one habit managers never promote."}]},
 {k:"SCENARIO 02 — THE SALARY TALK",
  t:"Your annual review is tomorrow. You carried two big projects this year. A friend in the same role earns 20% more than you.",
  o:[
   {k:"A",t:"Bring market data and ask for a specific number.",xp:20,tr:{trust:1,courage:2,wisdom:2},fb:"Data beats emotion. You anchored the talk with facts and a number — exactly how professionals negotiate in Yangon and everywhere else."},
   {k:"B",t:"Ask vaguely for \u201Csomething more\u201D.",xp:10,tr:{trust:0,courage:1,wisdom:0},fb:"You asked — but without a number, the easiest answer is \u201Cwe will see\u201D. Vague asks get vague answers."},
   {k:"C",t:"Say nothing. Loyalty will be rewarded.",xp:5,tr:{trust:1,courage:0,wisdom:1},fb:"Sometimes it is. But in most offices, silence reads as satisfaction. Your friend asked. You did not."},
   {k:"D",t:"Threaten to resign on the spot.",xp:0,tr:{trust:0,courage:1,wisdom:0},fb:"An ultimatum works once — then trust is gone forever. Negotiation is a conversation, not a hostage situation."}]},
 {k:"SCENARIO 03 — THE REFERRAL TEST",
  t:"Your childhood friend asks you to refer them for a Sales Executive role. You know they are not ready. You earn money only if they are hired.",
  o:[
   {k:"A",t:"Tell them honestly — then help them prepare with free Academy courses first.",xp:20,tr:{trust:2,courage:1,wisdom:2},fb:"You protected your reputation AND the friendship. A referral is your signature — sign only what you believe in."},
   {k:"B",t:"Refer them anyway. Money is money.",xp:0,tr:{trust:0,courage:1,wisdom:0},fb:"If they fail, the employer stops trusting YOUR referrals. One quick fee can cost you ten future ones."},
   {k:"C",t:"Ignore the message and hope they forget.",xp:5,tr:{trust:0,courage:0,wisdom:1},fb:"Avoidance feels safe, but the friendship fades anyway. Honesty, delivered kindly, is the cheaper path."},
   {k:"D",t:"Refer them, then quietly warn the recruiter.",xp:10,tr:{trust:0,courage:0,wisdom:2},fb:"Half-honest is half-dishonest. Your friend deserved the truth from you first — not through a back channel."}]}
];
var MAXT={trust:5,courage:5,wisdom:5};
var ARCH={
 trust:{t:"The Trusted Anchor",m:"ယုံကြည်စိတ်ချရဆုံး အသင်းသား",d:"Teams form around people like you. You protect relationships without losing honesty — the profile employers fight to hire and friends trust with their futures."},
 courage:{t:"The Bold Negotiator",m:"ရဲစွမ်းသော ဆွေးနွေးသူ",d:"You ask for what you are worth and you act when others wait. Channel that boldness with data, and there is no salary talk or interview you cannot win."},
 wisdom:{t:"The Quiet Strategist",m:"တည်ငြိမ်သော နည်းဗျူဟာရှင်",d:"You see three moves ahead while others see one. Your edge is judgment — pair it with visibility, and leadership roles will come looking for you."}
};
var idx=0, xp=0, tr={trust:0,courage:0,wisdom:0}, answered=false;
var elLvl=document.getElementById('gmLvlTxt'), elDots=document.getElementById('gmDots'),
    elXP=document.getElementById('gmXP'), elK=document.getElementById('gmScenK'),
    elT=document.getElementById('gmScenT'), elOpts=document.getElementById('gmOpts'),
    elFb=document.getElementById('gmFb'), elFbX=document.getElementById('gmFbX'),
    elFbT=document.getElementById('gmFbT'), elNext=document.getElementById('gmNext'),
    elRes=document.getElementById('gmRes');
function bars(){
  document.getElementById('tTrust').style.width=(tr.trust/MAXT.trust*100)+'%';
  document.getElementById('tCourage').style.width=(tr.courage/MAXT.courage*100)+'%';
  document.getElementById('tWisdom').style.width=(tr.wisdom/MAXT.wisdom*100)+'%';
}
function tweenXP(to){
  var from=xp; xp=to; var t0=null;
  function step(ts){
    if(!t0){t0=ts;}
    var p=Math.min(1,(ts-t0)/550);
    elXP.textContent=Math.round(from+(to-from)*p);
    if(p<1){requestAnimationFrame(step);}
  }
  requestAnimationFrame(step);
  elXP.classList.add('pop'); setTimeout(function(){elXP.classList.remove('pop');},240);
}
function renderScen(){
  answered=false;
  var s=SCEN[idx];
  elLvl.textContent='LEVEL '+(idx+1)+' / 3';
  var dots=elDots.children;
  for(var i=0;i<dots.length;i++){ dots[i].className = i<idx ? 'done' : (i===idx?'on':''); }
  elK.textContent=s.k;
  elT.textContent=s.t;
  elFb.classList.remove('show'); elFb.style.display='none';
  elOpts.innerHTML='';
  s.o.forEach(function(o){
    var b=document.createElement('button');
    b.type='button'; b.className='gmOpt';
    b.innerHTML='<span class="k">'+o.k+'</span>'+o.t;
    b.addEventListener('click',function(){ pick(o,b); });
    elOpts.appendChild(b);
  });
}
function pick(o,btn){
  if(answered){ return; }
  answered=true;
  btn.classList.add('picked');
  Array.prototype.forEach.call(elOpts.children,function(c){ if(c!==btn){c.classList.add('dim');} });
  tr.trust+=o.tr.trust; tr.courage+=o.tr.courage; tr.wisdom+=o.tr.wisdom;
  bars();
  tweenXP(xp+o.xp);
  elFbX.textContent='+'+o.xp+' XP';
  elFbT.textContent=o.fb;
  elNext.textContent = idx<2 ? 'Next situation \u2192' : 'Reveal my career personality \u2192';
  elFb.style.display='block';
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ elFb.classList.add('show'); }); });
}
elNext.addEventListener('click',function(){
  if(idx<2){ idx++; renderScen(); }
  else{ showRes(); }
});
function showRes(){
  stage.style.display='none';
  document.querySelector('.gmTraits').style.display='none';
  document.querySelector('.gmTop').style.display='none';
  var best='wisdom';
  if(tr.trust>=tr.courage && tr.trust>=tr.wisdom){ best='trust'; }
  else if(tr.courage>=tr.trust && tr.courage>=tr.wisdom){ best='courage'; }
  var a=ARCH[best];
  document.getElementById('gmResT').textContent=a.t;
  document.getElementById('gmResM').textContent=a.m;
  document.getElementById('gmResD').textContent=a.d;
  document.getElementById('gmRsXP').textContent=xp;
  document.getElementById('gmRsBest').textContent=best.charAt(0).toUpperCase()+best.slice(1);
  elRes.hidden=false;
}
document.getElementById('gmReplay').addEventListener('click',function(){
  idx=0; xp=0; tr={trust:0,courage:0,wisdom:0};
  elXP.textContent='0'; bars();
  elRes.hidden=true;
  stage.style.display='';
  document.querySelector('.gmTraits').style.display='';
  document.querySelector('.gmTop').style.display='';
  renderScen();
});
renderScen(); bars();
})();

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
  var rn=document.getElementById('ringNum'); if(rn){ rn.textContent='87'; }
  var ra=document.getElementById('ringArc'); if(ra){ ra.setAttribute('stroke-dashoffset','20'); }
}
else{
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

    (()=>{
      const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
      const allowed=new Set(['home','jobs','game','learn','refer']);
      const screenName=()=>{const name=new URLSearchParams(location.search).get('door')||'home';return allowed.has(name)?name:'home'};
      let animateTruthCards=()=>{};
      const show=(name,{history=true}={})=>{
        if(!allowed.has(name))name='home';
        $$('[data-sheen]').forEach(surface=>surface.classList.remove('soul-touching','is-soul-active'));
        $$('.screen').forEach(x=>x.classList.toggle('is-active',x.dataset.door===name));
        const active=$(`[data-door="${name}"]`);active.scrollTop=0;
        if(history){const url=new URL(location.href);url.searchParams.set('door',name);window.history.pushState({door:name},'',url)}
        const title=$('h1',active);if(title){title.tabIndex=-1;title.focus({preventScroll:true})}
        $('#announcer').textContent=`${name} screen`;
        if(name==='jobs')animateTruthCards();
      };
      $$('.js-door').forEach(b=>b.addEventListener('click',()=>show(b.dataset.target)));
      $('.js-home').addEventListener('click',e=>{e.preventDefault();show('home')});
      addEventListener('popstate',()=>show(screenName(),{history:false}));
      const outcomes={
        negotiate:{copy:'Negotiation preserves the relationship while buying time. Mark noted your composure.',delta:'K +4 · S +4 · TRUST +8',signal:'Composure + negotiation'},
        alternatives:{copy:'Diversifying suppliers shows strategic thinking. You found two backup options within hours.',delta:'K +5 · S +2 · TRUST +5',signal:'Foresight + options'},
        accept:{copy:'Accepting without negotiation wastes company resources. Mark questioned your judgment.',delta:'K −2 · A −3 · TRUST −5',signal:'Urgency under pressure'}
      };
      $$('.js-choice').forEach(b=>b.addEventListener('click',()=>{
        $$('.js-choice').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
        const result=outcomes[b.dataset.choice];$('#coach-copy').textContent=result.copy;$('#delta').textContent=result.delta;
        $('#signal-pill').textContent=result.signal;$('#coach').classList.add('is-visible');$('#science').classList.add('is-visible');$('#career-bridge').classList.add('is-visible');
      }));
      /* Stable 2026 feedback: the surface never moves; light follows intent. */
      const connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection||{};
      const effectiveType=connection.effectiveType||'';
      const slowNet=Boolean(connection.saveData)||['slow-2g','2g','3g'].includes(effectiveType);
      const motionQuery=new URLSearchParams(location.search);
      const lite=motionQuery.get('lite')==='1'||(motionQuery.get('full')!=='1'&&slowNet);
      const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
      const reduced=reducedMotion.matches;
      const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
      const soulSurfaces=$$('[data-sheen]');
      if(lite)document.documentElement.dataset.lite='true';

      if(fine&&!reduced){
        const dot=$('.cur-dot'),ring=$('.cur-ring');let mx=-80,my=-80,rx=-80,ry=-80;
        addEventListener('pointermove',event=>{mx=event.clientX;my=event.clientY;dot.style.transform=`translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;document.body.classList.add('cursor-live')},{passive:true});
        const follow=()=>{rx+=(mx-rx)*.14;ry+=(my-ry)*.14;ring.style.transform=`translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`;requestAnimationFrame(follow)};follow();
        soulSurfaces.forEach(surface=>{surface.addEventListener('pointerenter',()=>document.body.classList.add('cursor-card'));surface.addEventListener('pointerleave',()=>document.body.classList.remove('cursor-card'))});
      }

      if(fine&&!reduced){
        soulSurfaces.forEach(element=>{
          const control=element.querySelector('.intent-arrow');
          element.addEventListener('pointermove',event=>{const rect=element.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;element.style.setProperty('--mx',`${x}px`);element.style.setProperty('--my',`${y}px`);if(control){const dx=(x-rect.width/2)*.18,dy=(y-rect.height/2)*.28;control.style.transform=`translate3d(${Math.max(-7,Math.min(7,dx))}px,${Math.max(-7,Math.min(7,dy))}px,0)`}},{passive:true});
          element.addEventListener('pointerleave',()=>{if(control)control.style.transform='translate3d(0,0,0)'},{passive:true});
        });
      }

      if(!reduced){
        soulSurfaces.forEach(element=>{
          const release=()=>{
            if(!element.classList.contains('soul-touching'))return;
            element.classList.remove('soul-touching');
            clearTimeout(element.soulSheenTimer);
            element.soulSheenTimer=setTimeout(()=>element.classList.remove('is-soul-active'),260);
          };
          element.addEventListener('pointerdown',event=>{
            if(event.pointerType==='mouse')return;
            const rect=element.getBoundingClientRect();
            element.style.setProperty('--mx',`${event.clientX-rect.left}px`);element.style.setProperty('--my',`${event.clientY-rect.top}px`);
            element.classList.add('soul-touching','is-soul-active');
          });
          ['pointerup','pointercancel','pointerleave'].forEach(type=>element.addEventListener(type,release));
        });
      }

      if(typeof gsap!=='undefined'&&!reduced){
        let truthAnimated=false;
        animateTruthCards=()=>{
          if(truthAnimated)return;truthAnimated=true;
          gsap.from('#screen-jobs .route-card',{opacity:0,y:34,duration:1,ease:'power3.out',stagger:.09,overwrite:true,clearProps:'opacity,transform'});
        };
      }

      show(screenName(),{history:false});
    })();
/* ===== hub-v2 engine: interior sky for door 01 + the rotating truth ===== */
(()=>{
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lite=document.documentElement.dataset.lite==='true';
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const card=$('.jobs-card'), cv=$('.card-sky');
  let skyPulse=()=>{};

  /* ---- door 01 interior sky: dust, drift, and the sky that answers ---- */
  if(cv&&card){
    const ctx=cv.getContext('2d');
    const DPR=Math.min(window.devicePixelRatio||1,1.5);
    let W=0,H=0,stars=[],raf=null,t0=0,hot=0,hotT=0,visible=true;
    function size(){
      const r=card.getBoundingClientRect();W=Math.max(1,r.width);H=Math.max(1,r.height);
      cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
      ctx.setTransform(DPR,0,0,DPR,0,0);seed();
    }
    function seed(){
      stars=[];const n=(lite||reduced)?16:30;
      for(let i=0;i<n;i++)stars.push({x:Math.random()*W,y:Math.random()*H,
        vx:(Math.random()-.5)*.05,vy:(Math.random()-.5)*.05,r:.7+Math.random()*1.2,tw:Math.random()*6.28});
    }
    function drawStatic(){
      ctx.clearRect(0,0,W,H);
      for(const p of stars){ctx.fillStyle='rgba(214,222,240,.35)';
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.2832);ctx.fill();}
    }
    function frame(now){
      raf=requestAnimationFrame(frame);
      const dt=Math.min(32,now-t0);t0=now;
      hot+=(hotT-hot)*.08;
      ctx.clearRect(0,0,W,H);
      for(const p of stars){
        p.x+=p.vx*dt*.06;p.y+=p.vy*dt*.06;p.tw+=dt*.0011;
        if(p.x<-8)p.x=W+8;if(p.x>W+8)p.x=-8;if(p.y<-8)p.y=H+8;if(p.y>H+8)p.y=-8;
        const a=(0.32+Math.sin(p.tw)*0.22)*(1+hot*0.9);
        ctx.fillStyle='rgba(214,222,240,'+Math.min(1,a).toFixed(3)+')';
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.2832);ctx.fill();
      }
      if(hot>0.03){ /* the door answers: nearby stars connect in gold */
        ctx.lineWidth=.8;
        for(let i=0;i<stars.length;i++)for(let j=i+1;j<stars.length;j++){
          const p=stars[i],q=stars[j],dx=p.x-q.x,dy=p.y-q.y,d2=dx*dx+dy*dy;
          if(d2<8100){const a=(1-Math.sqrt(d2)/90)*.62*hot;
            ctx.strokeStyle='rgba(212,175,55,'+a.toFixed(3)+')';
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
        }
        const g=ctx.createRadialGradient(W*.77,H*.55,4,W*.77,H*.55,W*.3);
        g.addColorStop(0,'rgba(212,175,55,'+(0.18*hot).toFixed(3)+')');g.addColorStop(1,'rgba(212,175,55,0)');
        ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      }
    }
    function start(){if(raf||!visible)return;size();t0=performance.now();raf=requestAnimationFrame(frame);}
    function stop(){if(raf){cancelAnimationFrame(raf);raf=null;}}
    new IntersectionObserver(es=>{visible=es[0].isIntersecting;
      if(!visible)stop();else if(!lite&&!reduced)start();},{threshold:.05}).observe(card);
    document.addEventListener('visibilitychange',()=>{document.hidden?stop():(!lite&&!reduced&&start());});
    let rz;addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{size();if(lite||reduced)drawStatic();},160);});
    let hovSky=false,pulseT=null;
    skyPulse=(ms=1700)=>{if(lite||reduced||hovSky)return;hotT=1;clearTimeout(pulseT);pulseT=setTimeout(()=>{if(!hovSky)hotT=0;},ms);};
    if(fine){card.addEventListener('pointerenter',()=>{hovSky=true;hotT=1;});card.addEventListener('pointerleave',()=>{hovSky=false;hotT=0;});}
    card.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')skyPulse(1900);},{passive:true});
    window.__sky=()=>({stars:stars.length,hot,hotT});
    size();
    if(lite||reduced)drawStatic();else start();
  }

  /* ---- the rotating truth: sequential dissolve, real public data ---- */
  const paths=$$('#workPaths span[data-wp]'), panes=$$('.jobs-card .tpane');
  if(paths.length&&panes.length){
    let cur=0,hov=false,seq=0;
    function show(i){
      if(i===cur)return;const ticket=++seq;
      panes[cur].classList.remove('on');paths[cur].classList.remove('on');
      setTimeout(()=>{if(ticket!==seq)return;
        panes[i].classList.add('on');paths[i].classList.add('on');cur=i;skyPulse();},430);
    }
    paths.forEach((el,i)=>{
      el.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();show(i);});
      el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();show(i);}});
      if(fine)el.addEventListener('pointerenter',()=>show(i));
    });
    if(card){card.addEventListener('pointerenter',()=>{hov=true;});card.addEventListener('pointerleave',()=>{hov=false;});}
    paths[0].classList.add('on');
    if(!reduced)setInterval(()=>{if(!hov)show((cur+1)%3);},5200);
    window.__truth=()=>({cur,hov});
  }
})();

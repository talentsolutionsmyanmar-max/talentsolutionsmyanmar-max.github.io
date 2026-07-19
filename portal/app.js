(function(){
"use strict";
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var R=mulberry32(20260719);
function ri(min,max){return Math.floor(R()*(max-min+1))+min;}
function pick(arr){return arr[Math.floor(R()*arr.length)];}

var G1=["Aung","Kyaw","Min","Zaw","Thant","Htet","Nay","Win","Soe","Phyo","Wai","Lin","Tun","Naing","Kaung","Sithu","Ye","Thiha","Aye","Chan"];
var G2=["Khant","Min","Htun","Zaw","Oo","Aung","Kyaw","Thu","Naing","Lin","Htet","Ko","Myat","Sithu","Thant","Pyae","Nanda","Zin","Htike","Wai"];
var F1=["Su","Thiri","Hnin","Aye","Khin","Moe","Nandar","Yadanar","May","Zin","Thuzar","Sandar","Ei","Cho","Mya","Hla","Thin","Wutt","Phyu","Amsar"];
var F2=["Yadanar","Hlaing","Htun","Aung","Myat","Win","Kyaw","Thiri","Nwe","Zar","Moe","Hnin","Wai","Thandar","Sandar","Khine","Mar","Pwint","Shoon","Chit"];
var DEPTS={
 "O2O":["O2O Picker","O2O Associate","O2O Lead"],
 "Check Out":["Cashier","Senior Cashier","Checkout Supervisor"],
 "Fresh Food":["Fresh Associate — Bakery","Fresh Associate — Butchery","Fresh Associate — Produce","Fresh Food Lead"],
 "Dry Food":["Sales Associate","Stock Controller","Dry Food Lead"]
};
var DEPT_W=[["O2O",34],["Check Out",38],["Fresh Food",28],["Dry Food",25]];
var EXITS=["Resigned","Contract ended","Relocated","Career change"];
var CYCLES=["Q1 2026","Q2 2026"];
var MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function dstr(y,m,d){return d+" "+MONTHS[m]+" "+y;}

function mkName(){
  if(R()<0.5){ return pick(G1)+" "+pick(G2)+(R()<0.6?" "+pick(G2):""); }
  return pick(F1)+" "+pick(F2)+(R()<0.6?" "+pick(F2):"");
}
function mkPhone(){ return "09 "+ri(400,799)+" "+ri(100,999)+" "+ri(100,999); }
function mkScore(){
  var r=R();
  if(r<0.60){ return ri(70,96); }
  if(r<0.90){ return ri(50,69); }
  return ri(28,49);
}

var STAFF=[];
(function(){
  var n=0;
  DEPT_W.forEach(function(dw){
    for(var i=0;i<dw[1];i++){
      n++;
      var joinY=pick([2023,2023,2024,2024,2024,2025,2025,2025,2026]);
      var joinM=ri(0,11);
      var rec={id:"EMP-"+String(1000+n), name:mkName(), dept:dw[0], role:pick(DEPTS[dw[0]]),
               phone:mkPhone(), joined:dstr(joinY,joinM,ri(1,28)), joinedY:joinY, joinedM:joinM,
               status:"active", exitReason:null, exitDate:null, probDue:null,
               checks:{}, scores:{}};
      STAFF.push(rec);
    }
  });
  var idxs=[]; while(idxs.length<7){ var x=ri(0,STAFF.length-1); if(idxs.indexOf(x)<0){idxs.push(x);} }
  idxs.sort(function(a,b){return a-b;});
  idxs.forEach(function(x,k){
    var s=STAFF[x];
    s.status="former";
    if(k<2){ s.exitReason="promoted"; s.exitDate=dstr(2026,ri(2,5),ri(1,28)); s._forceGreen=true; }
    else{ s.exitReason=pick(EXITS); s.exitDate=dstr(2025,ri(6,11),ri(1,28)); }
  });
  var p=0;
  while(p<12){ var s=pick(STAFF); if(s.status==="active" && !s.probDue){ s.probDue=dstr(2026,ri(6,9),ri(1,28)); s.status="probation"; p++; } }
  STAFF.forEach(function(s){
    CYCLES.forEach(function(c){
      if(s.status==="former" && c==="Q2 2026" && s.exitDate.indexOf("2025")>=0){ return; }
      var sc=s._forceGreen?ri(78,95):mkScore(); s.scores[c]=sc;
      s.checks[c]=ri(2,6);
    });
  });
})();
var ACTIVE=STAFF.filter(function(s){return s.status!=="former";});
var FORMER=STAFF.filter(function(s){return s.status==="former";});
var PROMO=FORMER.filter(function(s){return s.exitReason==="promoted";});
var PROB=STAFF.filter(function(s){return s.status==="probation";});
function avgScore(cyc,list){
  var v=(list||STAFF).map(function(s){return s.scores[cyc];}).filter(function(x){return typeof x==="number";});
  if(!v.length){ return null; }
  return Math.round(v.reduce(function(a,b){return a+b;},0)/v.length);
}
function scoreClass(s){ return s>=70?"sOK":(s>=50?"sWarn":"sBad"); }
function esc(t){ return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }

var root=document.documentElement;
function setTheme(t){
  root.setAttribute('data-theme',t);
  try{ localStorage.setItem('portal-theme',t); }catch(e){}
  document.getElementById('themeIco').innerHTML = t==='dark'
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>'
    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
}
document.getElementById('themeBtn').addEventListener('click',function(){
  setTheme(root.getAttribute('data-theme')==='dark'?'light':'dark');
});
setTheme((function(){ try{ return localStorage.getItem('portal-theme')||'light'; }catch(e){ return 'light'; } })());

var CRUMBS={today:'TODAY',roster:'WORKFORCE',person:'EMPLOYEE',cycle:'PERFORMANCE'};
function route(){
  var h=location.hash||'#/today';
  var parts=h.replace('#/','').split('/');
  var r=parts[0]||'today';
  if(r==='person' && parts[1]){ show('person'); renderPerson(parts[1]); }
  else if(r==='roster'){ show('roster'); }
  else if(r==='cycle'){ show('cycle'); }
  else { r='today'; show('today'); }
  document.querySelectorAll('.snI').forEach(function(a){
    a.classList.toggle('on', a.dataset.r===r || (r==='person'&&a.dataset.r==='roster'));
  });
  document.getElementById('topCrumb').innerHTML='PORTAL / <b>'+(CRUMBS[r]||'TODAY')+'</b>';
  window.scrollTo(0,0);
}
function show(id){
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('on'); });
  document.getElementById('scr-'+id).classList.add('on');
}
addEventListener('hashchange',route);

function renderToday(){
  var q2=avgScore('Q2 2026');
  var checksDue=ri(9,14);
  document.getElementById('scr-today').innerHTML =
  '<div class="pageHead"><div><p class="kick">01 / TODAY</p><h1 class="h1p">Good morning, <em>Thiri</em></h1>'+
  '<p class="pageSub">Sunday, 19 July 2026 · Premium Retail (Makro) · Q3 2026 cycle, week 3</p></div>'+
  '<div style="display:flex;gap:10px"><a class="btnG btn" href="#/cycle">Open Q3 cycle</a><a class="btn" href="#/roster">Workforce</a></div></div>'+
  '<div class="kpiGrid">'+
    kpi('ACTIVE WORKFORCE', ACTIVE.length, '<i>of '+STAFF.length+' total</i>', '<b>'+PROB.length+'</b> on probation')+
    kpi('Q2 2026 AVG SCORE', q2, '<i>/ 100</i>', '70/50 canon · <b>'+pctGreen()+'%</b> at green tier')+
    kpi('CHECK-INS DUE', checksDue, '<i>this week</i>', '<b class="w">'+PROB.length+'</b> probation reviews pending')+
    kpi('PROMOTED TO CLIENT', PROMO.length, '<i>2026 YTD</i>', 'The prestige badge — <b>your pipeline works</b>')+
  '</div>'+
  '<div class="twoCol">'+
    '<div class="card"><div class="cardH"><span class="cardT">NEEDS <b>ATTENTION</b></span><a class="btn" href="#/roster" style="padding:6px 11px;font-size:11px">View all</a></div>'+
      attentionRows()+
    '</div>'+
    '<div class="card"><div class="cardH"><span class="cardT">RECENT <b>ACTIVITY</b></span></div>'+feedRows()+'</div>'+
  '</div>';
}
function kpi(k,v,unit,d){
  return '<div class="card kpi"><div class="kpiK">'+k+'</div><div class="kpiV">'+v+' '+unit+'</div><div class="kpiD">'+d+'</div></div>';
}
function pctGreen(){
  var v=STAFF.map(function(s){return s.scores['Q2 2026'];}).filter(function(x){return typeof x==="number";});
  return Math.round(v.filter(function(x){return x>=70;}).length/v.length*100);
}
function attentionRows(){
  var rows='';
  PROB.slice(0,4).forEach(function(s){
    rows+='<div class="attRow" onclick="location.hash=\'#/person/'+s.id+'\'">'+
      '<span class="attIcn iWarn"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>'+
      '<div class="attTx"><div class="attT">'+esc(s.name)+'</div><div class="attS">Probation review · '+esc(s.dept)+'</div></div>'+
      '<span class="attR">due '+esc(s.probDue)+'</span></div>';
  });
  PROMO.forEach(function(s){
    rows+='<div class="attRow" onclick="location.hash=\'#/person/'+s.id+'\'">'+
      '<span class="attIcn iGold"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></span>'+
      '<div class="attTx"><div class="attT">'+esc(s.name)+'</div><div class="attS">Promoted to client staff · '+esc(s.dept)+'</div></div>'+
      '<span class="pill pPromo">Prestige</span></div>';
  });
  return rows;
}
function feedRows(){
  var F=[
    ['g','<b>Q2 2026 cycle closed</b> — 118 assignments scored, average '+avgScore('Q2 2026')+'/100.','2 weeks ago'],
    ['t','<b>'+pick(F1)+' '+pick(F2)+'</b> completed check-in #4 — Check Out department.','3 days ago'],
    ['n','<b>Q3 2026 cycle opened</b> — assignments being drafted for 4 departments.','2 days ago'],
    ['g','<b>1 promotion to client staff</b> confirmed by Premium Retail HQ.','5 days ago'],
    ['n','<b>6 new starters</b> imported from ReferTRM placement pipeline.','1 week ago']
  ];
  return F.map(function(f){ return '<div class="feedRow"><span class="feedDot '+f[0]+'"></span><div><div class="feedTx">'+f[1]+'</div><div class="feedTm">'+f[2]+'</div></div></div>'; }).join('');
}

var R_FILTER={q:'',dept:'all',status:'all'};
function statusPill(s){
  if(s.status==='former'){
    if(s.exitReason==='promoted'){ return '<span class="pill pPromo">Promoted to client staff</span>'; }
    return '<span class="pill pFormer">Former · '+esc(s.exitReason)+'</span>';
  }
  if(s.status==='probation'){ return '<span class="pill pProb">Probation</span>'; }
  return '<span class="pill pActive">Active</span>';
}
function lastScore(s){ var v=s.scores['Q2 2026']; return typeof v==="number"?v:null; }
function renderRoster(){
  var el=document.getElementById('scr-roster');
  var depts=Object.keys(DEPTS);
  el.innerHTML =
  '<div class="pageHead"><div><p class="kick">02 / WORKFORCE</p><h1 class="h1p">Workforce <em>roster</em></h1>'+
  '<p class="pageSub">'+STAFF.length+' people on record — '+ACTIVE.length+' active, '+FORMER.length+' former. Exit is data, not deletion.</p></div>'+
  '<button class="btn">Export CSV</button></div>'+
  '<div class="filters">'+
    '<div class="fSearch"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input id="rSearch" placeholder="Search name, ID, role, phone…" value="'+esc(R_FILTER.q)+'"></div>'+
    '<select class="fSel" id="rDept"><option value="all">All departments</option>'+depts.map(function(d){return '<option'+(R_FILTER.dept===d?' selected':'')+'>'+d+'</option>';}).join('')+'</select>'+
    '<select class="fSel" id="rStatus"><option value="all">All statuses</option><option value="active"'+(R_FILTER.status==='active'?' selected':'')+'>Active</option><option value="probation"'+(R_FILTER.status==='probation'?' selected':'')+'>Probation</option><option value="former"'+(R_FILTER.status==='former'?' selected':'')+'>Former</option><option value="promoted"'+(R_FILTER.status==='promoted'?' selected':'')+'>Promoted to client</option></select>'+
  '</div>'+
  '<div class="rosterMeta" id="rosterMeta"></div>'+
  '<div class="card"><div class="tblWrap"><table class="tbl"><thead><tr>'+
  '<th>ID</th><th>Name</th><th>Department</th><th>Role</th><th>Status</th><th>Probation due</th><th style="text-align:right">Q2 score</th>'+
  '</tr></thead><tbody id="rBody"></tbody></table></div></div>';
  document.getElementById('rSearch').addEventListener('input',function(e){ R_FILTER.q=e.target.value; drawRoster(); });
  document.getElementById('rDept').addEventListener('change',function(e){ R_FILTER.dept=e.target.value; drawRoster(); });
  document.getElementById('rStatus').addEventListener('change',function(e){ R_FILTER.status=e.target.value; drawRoster(); });
  drawRoster();
}
function drawRoster(){
  var q=R_FILTER.q.toLowerCase();
  var list=STAFF.filter(function(s){
    if(R_FILTER.dept!=='all' && s.dept!==R_FILTER.dept){ return false; }
    if(R_FILTER.status==='promoted'){ if(!(s.status==='former'&&s.exitReason==='promoted')){ return false; } }
    else if(R_FILTER.status!=='all' && s.status!==R_FILTER.status){ return false; }
    if(q){ var hay=(s.name+' '+s.id+' '+s.role+' '+s.phone+' '+s.dept).toLowerCase(); if(hay.indexOf(q)<0){ return false; } }
    return true;
  });
  document.getElementById('rosterMeta').innerHTML='SHOWING <b>'+list.length+'</b> / '+STAFF.length+' · Q2 2026 SCORES · 70/50 CANON';
  var rows=list.map(function(s){
    var sc=lastScore(s);
    return '<tr'+(s.status==='former'&&s.exitReason==='promoted'?' class="promoRow"':'')+' onclick="location.hash=\'#/person/'+s.id+'\'">'+
      '<td class="num" style="color:var(--dim)">'+s.id+'</td>'+
      '<td><div class="tName">'+esc(s.name)+'</div><div class="tSub">'+esc(s.phone)+'</div></td>'+
      '<td><span class="deptTag">'+s.dept+'</span></td>'+
      '<td style="color:var(--mut);font-size:12.5px">'+esc(s.role)+'</td>'+
      '<td>'+statusPill(s)+'</td>'+
      '<td class="num" style="color:var(--dim)">'+(s.probDue||'—')+'</td>'+
      '<td style="text-align:right">'+(sc===null?'<span class="score sNone">—</span>':'<span class="score '+scoreClass(sc)+'">'+sc+'</span>')+'</td></tr>';
  }).join('');
  document.getElementById('rBody').innerHTML=rows || '<tr><td colspan="7" style="text-align:center;padding:34px;color:var(--dim)">No matches — adjust search or filters.</td></tr>';
}

function renderPerson(id){
  var s=STAFF.filter(function(x){return x.id===id;})[0];
  var el=document.getElementById('scr-person');
  if(!s){ el.innerHTML='<div class="card empty"><div class="emptyT">Employee not found</div></div>'; return; }
  var q2=s.scores['Q2 2026'];
  var initials=s.name.split(' ').map(function(w){return w[0];}).slice(0,2).join('');
  el.innerHTML =
  '<div style="margin-bottom:16px"><a href="#/roster" class="btn" style="padding:7px 12px;font-size:11.5px">← Back to roster</a></div>'+
  '<div class="card" style="margin-bottom:14px"><div class="pHead">'+
    '<span class="pAva">'+initials+'</span>'+
    '<div><div class="pName">'+esc(s.name)+' '+statusPill(s)+'</div>'+
      '<div class="pMeta">'+s.id+'<span class="dotSep">·</span>'+esc(s.role)+'<span class="dotSep">·</span>'+s.dept+'<span class="dotSep">·</span>Joined '+esc(s.joined)+
      (s.status==='former'?'<span class="dotSep">·</span>Exited '+esc(s.exitDate):'')+'</div>'+
      (s.probDue?'<div class="probBar" style="max-width:340px"><i style="width:62%"></i></div><div class="tSub" style="margin-top:6px">Probation ends '+esc(s.probDue)+' · 62% through period</div>':'')+
    '</div>'+
    '<div class="pHeadStats">'+
      '<div class="pSt"><div class="pStV">'+(typeof q2==="number"?q2:'—')+'</div><div class="pStK">Q2 score</div></div>'+
      '<div class="pSt"><div class="pStV">'+(s.checks['Q2 2026']||0)+'</div><div class="pStK">Q2 check-ins</div></div>'+
      '<div class="pSt"><div class="pStV">'+tenure(s)+'</div><div class="pStK">Tenure</div></div>'+
    '</div>'+
  '</div></div>'+
  '<div class="pGrid">'+
    '<div class="card"><div class="cardH"><span class="cardT">LIFECYCLE <b>TIMELINE</b></span><span class="cardT">ASSIGNMENT → CHECK-IN → SCORE</span></div><div class="tl">'+timeline(s)+'</div></div>'+
    '<div style="display:flex;flex-direction:column;gap:14px">'+
      '<div class="card"><div class="cardH"><span class="cardT">RECORD</span></div>'+
        kv('Employee ID',s.id)+kv('Phone',s.phone)+kv('Department',s.dept)+kv('Role',s.role)+
        kv('Status',s.status.toUpperCase())+(s.status==='former'?kv('Exit reason',s.exitReason==='promoted'?'PROMOTED TO CLIENT STAFF':s.exitReason.toUpperCase())+kv('Exit date',s.exitDate):kv('Joined',s.joined))+
      '</div>'+
      '<div class="card"><div class="cardH"><span class="cardT">SCORE <b>HISTORY</b></span><span class="cardT">70 / 50 CANON</span></div>'+
        scoreHist(s)+
      '</div>'+
    '</div>'+
  '</div>';
}
function tenure(s){
  var y=2026-s.joinedY, m=7-s.joinedM;
  if(m<0){ y--; m+=12; }
  return (y>0?y+'y ':'')+m+'m';
}
function kv(k,v){ return '<div class="kvRow"><span class="kvK">'+k+'</span><span class="kvV">'+esc(v)+'</span></div>'; }
function scoreHist(s){
  var out='';
  CYCLES.slice().reverse().forEach(function(c){
    var v=s.scores[c];
    out+='<div class="kvRow"><span class="kvK">'+c+'</span><span>'+(typeof v==="number"?'<span class="score '+scoreClass(v)+'">'+v+'</span>':'<span class="score sNone">no record</span>')+'</span></div>';
  });
  return out;
}
function timeline(s){
  var items=[];
  if(s.status==='former' && s.exitReason==='promoted'){
    items.push(['g','PROMOTED TO CLIENT STAFF','Absorbed into Premium Retail HQ — the pipeline\'s prestige outcome. Celebrated, not churn.',s.exitDate]);
  } else if(s.status==='former'){
    items.push(['n','EMPLOYMENT ENDED','Exit reason: '+s.exitReason+'. Record retained for reference.',s.exitDate]);
  }
  if(typeof s.scores['Q2 2026']==="number"){
    items.push(['g','Q2 2026 SCORED','Cycle score '+s.scores['Q2 2026']+'/100 ('+tierWord(s.scores['Q2 2026'])+'). '+(s.checks['Q2 2026'])+' check-ins completed.', '30 Jun 2026']);
  }
  if(s.checks['Q2 2026']){
    items.push(['t','CHECK-IN #'+s.checks['Q2 2026'],pick(['On-track review with team lead.','Development goals reviewed, on plan.','Attendance and punctuality confirmed.','Cross-training progress noted.']),'18 Jun 2026']);
  }
  items.push(['t','ASSIGNMENT — Q2 2026',pick(['Weekly section targets assigned.','O2O order accuracy focus assigned.','Checkout speed & courtesy targets assigned.','Fresh counter hygiene standard assigned.']),'1 Apr 2026']);
  if(typeof s.scores['Q1 2026']==="number"){
    items.push(['g','Q1 2026 SCORED','Cycle score '+s.scores['Q1 2026']+'/100 ('+tierWord(s.scores['Q1 2026'])+').','31 Mar 2026']);
  }
  items.push(['n','JOINED REFERTRM PLACEMENT','Placed as '+s.role+', '+s.dept+'.',s.joined]);
  return items.map(function(i){
    return '<div class="tlItem"><span class="tlDot '+i[0]+'"></span><div class="tlK">'+i[1]+'</div><div class="tlD" style="margin-top:2px">'+i[2]+'</div><div class="tlTime">'+i[3]+'</div></div>';
  }).join('');
}
function tierWord(v){ return v>=70?'green tier':(v>=50?'amber tier':'red tier'); }

var CYC_Q='Q2 2026';
function renderCycle(){
  var el=document.getElementById('scr-cycle');
  el.innerHTML =
  '<div class="pageHead"><div><p class="kick">03 / PERFORMANCE</p><h1 class="h1p">Performance <em>cycles</em></h1>'+
  '<p class="pageSub">Quarterly rhythm: assignment → check-ins → score. Fresh quarters start empty — by design.</p></div>'+
  '<div class="seg" id="cycSeg"><button data-q="Q1 2026">Q1 2026</button><button data-q="Q2 2026" class="on">Q2 2026</button><button data-q="Q3 2026">Q3 2026</button></div></div>'+
  '<div id="cycBody"></div>';
  document.querySelectorAll('#cycSeg button').forEach(function(b){
    b.addEventListener('click',function(){
      document.querySelectorAll('#cycSeg button').forEach(function(x){x.classList.remove('on');});
      b.classList.add('on'); CYC_Q=b.dataset.q; drawCycle();
    });
  });
  drawCycle();
}
function drawCycle(){
  var body=document.getElementById('cycBody');
  if(CYC_Q==='Q3 2026'){
    body.innerHTML='<div class="card"><div class="cardH"><span class="cardT">'+CYC_Q+' · <b>IN PROGRESS</b></span></div>'+
    '<div class="empty"><div class="emptyIcn"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>'+
    '<div class="emptyT">Q3 has just begun — nothing to score yet</div>'+
    '<div class="emptyD">Assignments are being drafted for all 4 departments. Check-ins will appear here as team leads complete them. Scores land at quarter close, 30 Sep 2026.</div>'+
    '<div style="margin-top:20px"><button class="btnG btn">Draft Q3 assignments</button></div></div></div>'+
    '<div class="cycleGrid" style="margin-top:14px">'+deptCoverage(true)+'</div>';
    return;
  }
  var q=CYC_Q;
  var scores=STAFF.map(function(s){return s.scores[q];}).filter(function(x){return typeof x==="number";});
  var avg=Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length);
  var green=scores.filter(function(x){return x>=70;}).length;
  var amber=scores.filter(function(x){return x>=50&&x<70;}).length;
  var red=scores.filter(function(x){return x<50;}).length;
  var checks=STAFF.reduce(function(a,s){return a+(s.checks[q]||0);},0);
  body.innerHTML =
  '<div class="kpiGrid" style="grid-template-columns:repeat(4,1fr)">'+
    '<div class="card kpi"><div class="kpiK">CYCLE AVERAGE</div><div class="kpiV">'+avg+' <i>/100</i></div><div class="kpiD">'+scores.length+' scored · 70/50 canon</div></div>'+
    '<div class="card kpi"><div class="kpiK">GREEN TIER ≥70</div><div class="kpiV" style="color:var(--ok)">'+green+'</div><div class="kpiD">'+Math.round(green/scores.length*100)+'% of workforce</div></div>'+
    '<div class="card kpi"><div class="kpiK">AMBER 50–69</div><div class="kpiV" style="color:var(--warn)">'+amber+'</div><div class="kpiD">'+Math.round(amber/scores.length*100)+'% · coaching focus</div></div>'+
    '<div class="card kpi"><div class="kpiK">RED &lt;50</div><div class="kpiV" style="color:var(--bad)">'+red+'</div><div class="kpiD">'+Math.round(red/scores.length*100)+'% · review required</div></div>'+
  '</div>'+
  '<div class="cycleGrid">'+deptCoverage(false,q)+
    '<div class="card"><div class="cardH"><span class="cardT">CHECK-IN <b>PROGRESS</b></span><span class="cardT">'+checks+' TOTAL</span></div>'+checkRows(q)+
    '<div class="legend"><span><i style="background:var(--ok)"></i>≥70 green</span><span><i style="background:var(--warn)"></i>50–69 amber</span><span><i style="background:var(--bad)"></i>&lt;50 red</span></div></div>'+
  '</div>';
}
function deptCoverage(isDraft,q){
  return Object.keys(DEPTS).map(function(d){
    var inDept=STAFF.filter(function(s){return s.dept===d;});
    if(isDraft){
      return '<div class="card"><div class="cardH"><span class="cardT">'+d.toUpperCase()+'</span><span class="covV"><b>0</b>/'+inDept.filter(function(s){return s.status!=="former";}).length+' assigned</span></div>'+
      '<div class="covRow"><div class="covBar"><i style="width:0%"></i></div></div></div>';
    }
    var scored=inDept.filter(function(s){return typeof s.scores[q]==="number";});
    var cov=Math.round(scored.length/inDept.length*100);
    return '<div class="card"><div class="cardH"><span class="cardT">'+d.toUpperCase()+' · ASSIGNMENT COVERAGE</span><span class="covV"><b>'+scored.length+'</b>/'+inDept.length+' · '+cov+'%</span></div>'+
    '<div class="covRow"><div class="covBar"><i style="width:'+cov+'%"></i></div></div></div>';
  }).join('');
}
function checkRows(q){
  return Object.keys(DEPTS).map(function(d){
    var inDept=STAFF.filter(function(s){return s.dept===d;});
    var done=inDept.reduce(function(a,s){return a+(s.checks[q]||0);},0);
    var target=inDept.length*5;
    var pct=Math.min(100,Math.round(done/target*100));
    var cls=pct>=85?'':(pct>=60?' g':' w');
    return '<div class="covRow"><div class="covTop"><span class="covN">'+d+'</span><span class="covV"><b>'+done+'</b> / '+target+' check-ins</span></div><div class="covBar"><i class="'+cls.trim()+'" style="width:'+pct+'%"></i></div></div>';
  }).join('');
}

document.getElementById('navCount').textContent=STAFF.length;
renderToday(); renderRoster(); renderCycle();
route();
})();

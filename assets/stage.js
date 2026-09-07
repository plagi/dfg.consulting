/* dfg.consulting — the stage switch: four scenes in the same world */
(function(){
  var root=document.getElementById('stage'); if(!root||!window.DFGWorld)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs=[].slice.call(root.querySelectorAll('.tab')), panels=[].slice.call(root.querySelectorAll('.rows'));
  var cap=document.getElementById('stageCap');
  var CAP=['The ground is surveyed and the plots are marked. Nothing is built until the plan says what, where and by whom.',
           'One structure goes up and is made to stand: the first use-case in production, the first partner signed, the first audit passed.',
           'More structures, streets between them, and the risk moves to vendors, cost and control.',
           'A city that runs: governance, rehearsed incident plans, and a perimeter that is checked, not assumed.'];
  var CYCLE=9000, timer=null, cur=-1, manual=false;
  var c=document.getElementById('stageCanvas');
  var w=new DFGWorld.World(c,{bx:4,by:3,bg:'#11141A',seed:2026,fit:0.86,tx:0.5,ty:0.5,fitMobile:0.9,txMobile:0.5,tyMobile:0.48,hmax:1.6});
  window.__stageWorld=w;

  function set(i,byUser){
    if(i===cur)return; cur=i;
    tabs.forEach(function(t,k){t.classList.toggle('on',k===i); t.setAttribute('aria-selected',k===i?'true':'false'); var f=t.querySelector('.fill'); f.style.animation='none'; void f.offsetWidth; f.style.animation='';});
    panels.forEach(function(p,k){p.hidden=k!==i; p.classList.remove('in'); if(k===i){void p.offsetWidth; p.classList.add('in');}});
    cap.textContent=CAP[i];
    w.setScript(DFGWorld.stageScript(w,i)); w.play();
    if(byUser){manual=true; clearInterval(timer); timer=null; root.style.setProperty('--cycle','0s');}
  }
  tabs.forEach(function(t,k){t.addEventListener('click',function(){set(k,true);});});
  set(0,false);
  if(!reduce){root.style.setProperty('--cycle',CYCLE+'ms'); timer=setInterval(function(){if(!manual)set((cur+1)%4,false);},CYCLE);}
  else root.style.setProperty('--cycle','0s');
})();

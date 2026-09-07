/* dfg.consulting — the stage switch: 0 → 1 and 1 → ∞ */
(function(){
  var root=document.getElementById('stage'); if(!root)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tabs=[].slice.call(root.querySelectorAll('.tab')), panels=[].slice.call(root.querySelectorAll('.rows'));
  var g0=root.querySelector('.glyph .g0'), g1=root.querySelector('.glyph .g1'), cap=document.getElementById('stageCap'), glyph=root.querySelector('.glyph');
  var CAP=['From a mandate, a deck or a dataset to one thing running in production.',
           'From a pilot to something that runs every day, with the first partner and the first audit behind it.',
           'From one thing running to several, without losing control of vendors, cost and risk.',
           'Keeping it running: governance, resilience, and someone who calls you before the vendor does.'];
  var GL=[['0','1'],['1','10'],['10','100'],['100','∞']];
  var LIT=[1,4,13,COLS];
  var CYCLE=9000, timer=null, cur=-1, manual=false;

  /* canvas: a dot field; 0→1 lights one column into a line; 1→∞ spreads it across the field */
  var COLS=26, ROWS=14;
  var c=document.getElementById('stageCanvas'), ctx=c.getContext('2d'), W=0,H=0,dpr=1, t0=0, stage=0, raf=0;
  function size(){dpr=Math.min(2,window.devicePixelRatio||1); W=c.clientWidth; H=c.clientHeight; c.width=W*dpr; c.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);}
  function draw(ts){
    var el=ts-t0, dur=stage===0?1400:1800, p=reduce?1:Math.min(1,el/dur); p=p*p*(3-2*p); var last=stage===3;
    ctx.clearRect(0,0,W,H);
    var mx=26,my=22, gx=(W-2*mx)/(COLS-1), gy=(H-2*my)/(ROWS-1), c0=Math.round(COLS*0.42);
    for(var i=0;i<COLS;i++){
      var d=Math.abs(i-c0), lit=false, a=0.16;
      var reach=LIT[stage]-1; lit=d<=reach*p+0.001;
      var x=mx+i*gx;
      if(lit){
        var rowsLit=stage===0?Math.floor(p*ROWS+0.999):ROWS;
        var col=i===c0?'242,180,65':'233,235,239';
        var ca=i===c0?0.95:Math.max(0.22,0.7-d/COLS*0.9);
        if(last&&p>=1&&!reduce){ca*=0.75+0.25*Math.sin(el/900+i*0.7);}
        if(rowsLit>1){ctx.strokeStyle='rgba('+col+','+(ca*0.55)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(x,my+(ROWS-1)*gy); ctx.lineTo(x,my+(ROWS-rowsLit)*gy); ctx.stroke();}
        for(var j=0;j<ROWS;j++){var on=j>=ROWS-rowsLit; ctx.fillStyle=on?'rgba('+col+','+ca+')':'rgba(233,235,239,'+a+')'; var r=on?1.6:1; var y=my+j*gy; ctx.fillRect(x-r,y-r,2*r,2*r);}
      }else{
        for(var k=0;k<ROWS;k++){ctx.fillStyle='rgba(233,235,239,'+a+')'; var yy=my+k*gy; ctx.fillRect(x-1,yy-1,2,2);}
      }
    }
    if(!reduce&&(p<1||last))raf=requestAnimationFrame(draw); else raf=0;
  }
  function start(){cancelAnimationFrame(raf); t0=performance.now(); raf=requestAnimationFrame(draw);}

  function set(i,byUser){
    if(i===cur)return; cur=i;
    tabs.forEach(function(t,k){t.classList.toggle('on',k===i); t.setAttribute('aria-selected',k===i?'true':'false'); var f=t.querySelector('.fill'); f.style.animation='none'; void f.offsetWidth; f.style.animation='';});
    panels.forEach(function(p,k){p.hidden=k!==i; p.classList.remove('in'); if(k===i){void p.offsetWidth; p.classList.add('in');}});
    glyph.classList.remove('swap'); void glyph.offsetWidth; g0.textContent=GL[i][0]; g1.textContent=GL[i][1]; glyph.classList.add('swap');
    cap.textContent=CAP[i]; stage=i; start();
    if(byUser){manual=true; clearInterval(timer); timer=null; root.style.setProperty('--cycle','0s');}
  }
  tabs.forEach(function(t,k){t.addEventListener('click',function(){set(k,true);});});
  size(); set(0,false);
  window.addEventListener('resize',function(){size(); start();});
  if(!reduce){root.style.setProperty('--cycle',CYCLE+'ms'); timer=setInterval(function(){if(!manual)set((cur+1)%4,false);},CYCLE);}
  else root.style.setProperty('--cycle','0s');
})();

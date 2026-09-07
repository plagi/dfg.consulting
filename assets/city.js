/* dfg.consulting — the district.
   An axonometric city drawn the way an architect draws one: a street grid, blocks with one or two buildings,
   a park, and a story in phases. A scan line surveys the ground; plots are marked; wireframes rise under cranes;
   facades fill with shaded faces and aligned windows; shopfronts light at street level; people walk the streets.
   The same renderer draws the hero and the four stage scenes. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(seed){return function(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  function ease(p){return p<0?0:p>1?1:p*p*(3-2*p);}
  var BONE='233,235,239', SIG='242,180,65';

  function World(canvas,opt){
    var c=canvas, ctx=c.getContext('2d',{alpha:false}), BG=opt.bg||'#0A0C10';
    var BX=opt.bx||7, BY=opt.by||5, BS=1, ST=0.36, U=BS+ST, M=0.9;
    var rand=rng(opt.seed||7);
    var blocks=[], buildings=[], parks=[], hmax=0;
    var ccx=(BX*U-ST)/2, ccy=(BY*U-ST)/2;
    for(var by=0;by<BY;by++)for(var bx=0;bx<BX;bx++){
      var ox=bx*U, oy=by*U, blk={x0:ox,y0:oy,x1:ox+BS,y1:oy+BS,d:ox+oy};blocks.push(blk);
      var dc=Math.min(1,Math.hypot((ox+BS/2-ccx)/ccx,(oy+BS/2-ccy)/ccy)*0.9), r=rand();
      if(r<0.09&&parks.length<2&&BX>4){parks.push(blk);continue;}
      function add(x0,y0,x1,y1){var h=0.3+(1-dc)*1.4*Math.pow(rand(),0.7)+rand()*0.35;h=Math.min(h,opt.hmax||2.3);hmax=Math.max(hmax,h);
        buildings.push({x0:x0,y0:y0,x1:x1,y1:y1,h:h,key:x0+y0+rand()*0.2,win:[],shop:rand()<0.72});}
      var m=0.1;
      if(r<0.5){add(ox+m,oy+m,ox+BS-m,oy+BS-m);}
      else if(r<0.75){var g=0.14;add(ox+m,oy+m,ox+BS/2-g/2,oy+BS-m);add(ox+BS/2+g/2,oy+m,ox+BS-m,oy+BS-m);}
      else{var g2=0.14;add(ox+m,oy+m,ox+BS-m,oy+BS/2-g2/2);add(ox+m,oy+BS/2+g2/2,ox+BS-m,oy+BS-m);}
    }
    buildings.sort(function(a,b){return a.key-b.key;});
    buildings.forEach(function(b){var w=b.x1-b.x0,dd=b.y1-b.y0;var cols=Math.max(1,Math.floor(w/0.2)),cols2=Math.max(1,Math.floor(dd/0.2)),rows=Math.max(1,Math.floor(b.h/0.24));
      var r2=rng(Math.floor(b.key*9973));
      for(var i=0;i<cols;i++)for(var j=0;j<rows;j++)b.win.push({f:0,u:b.x0+0.05+i*0.2,z:0.08+j*0.24,on:r2()<0.4,ph:r2()*6.28});
      for(var i2=0;i2<cols2;i2++)for(var j2=0;j2<rows;j2++)b.win.push({f:1,u:b.y0+0.05+i2*0.2,z:0.08+j2*0.24,on:r2()<0.4,ph:r2()*6.28});});
    var DMAX=(BX*U-ST)+(BY*U-ST), XW=BX*U-ST, YW=BY*U-ST;
    /* streets, for the people */
    var sx=[],sy=[];for(var i=0;i<=BX;i++)sx.push(i*U-ST/2);for(var j=0;j<=BY;j++)sy.push(j*U-ST/2);

    var W=0,H=0,dpr=1,K=1,OX=0,OY=0;
    function P(wx,wy,wz){return {x:OX+(wx-wy)*K*0.8660254,y:OY+(wx+wy)*K*0.5-wz*K};}
    function size(){dpr=Math.min(2,window.devicePixelRatio||1);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
      var mob=W<700, fit=mob?(opt.fitMobile||1.05):(opt.fit||0.62), tx=mob?(opt.txMobile||0.5):(opt.tx||0.66), ty=mob?(opt.tyMobile||0.5):(opt.ty||0.54);
      var ww=(XW+YW+2*M)*0.8660254; K=fit*W/ww;
      var top=-(hmax)*K-M*K*0.5, bot=(XW+YW+2*M)*K*0.5; /* screen extents with OX=OY=0 around ground */
      OX=tx*W-((XW-YW))*K*0.8660254/2; OY=ty*H-(top+bot)/2-(-M)*K*0.5;}
    var S={sweepT:2600,buildings:[],plots:[],people:[],ring:null,peopleAt:1e9,parksAt:1e9};
    var prand=rng(3);
    function setScript(s){S=s;S.people.forEach(function(p){var ax=prand()<0.5;p.axis=ax?'x':'y';var lines=ax?sy:sx;p.line=lines[Math.floor(prand()*lines.length)];p.pos=prand()*(ax?XW:YW);p.dir=prand()<0.5?1:-1;p.sp=0.25+prand()*0.25;});}
    function quad(a,b,cc,d,fill){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(cc.x,cc.y);ctx.lineTo(d.x,d.y);ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
    function seg(a,b){ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}

    function draw(t){
      ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);
      var sp=ease(t/S.sweepT), sd=-2*M+(DMAX+4*M)*sp;
      /* ground: surveyed dots on a half-unit grid, revealed by the scan line */
      for(var gx=-M;gx<=XW+M;gx+=0.5)for(var gy=-M;gy<=YW+M;gy+=0.5){var d=gx+gy;if(d>sd)continue;var near=Math.max(0,1-(sd-d)/0.9);var q=P(gx,gy,0);
        ctx.fillStyle=near>0?'rgba('+SIG+','+(0.35+0.6*near)+')':'rgba('+BONE+',0.2)';var r=near>0?1.5:1;ctx.fillRect(q.x-r/2,q.y-r/2,r,r);}
      if(sp<1){var a=P(sd+M,-M,0),b=P(-M,sd+M,0);ctx.beginPath();seg(a,b);ctx.strokeStyle='rgba('+SIG+',.85)';ctx.lineWidth=1;ctx.stroke();}
      /* block outlines once surveyed */
      ctx.beginPath();blocks.forEach(function(k){if(k.x1+k.y1>sd)return;var p0=P(k.x0,k.y0,0),p1=P(k.x1,k.y0,0),p2=P(k.x1,k.y1,0),p3=P(k.x0,k.y1,0);seg(p0,p1);seg(p1,p2);seg(p2,p3);seg(p3,p0);});
      ctx.strokeStyle='rgba('+BONE+',.14)';ctx.lineWidth=1;ctx.stroke();
      /* parks */
      if(t>S.parksAt){parks.forEach(function(k,pi){var r3=rng(11+pi);for(var n=0;n<9;n++){var px=k.x0+0.15+r3()*(BS-0.3),py=k.y0+0.15+r3()*(BS-0.3),q=P(px,py,0.12),rr=K*(0.07+r3()*0.05);
          ctx.beginPath();ctx.arc(q.x,q.y,rr,0,6.283);ctx.fillStyle='rgba('+BONE+',.12)';ctx.fill();ctx.strokeStyle='rgba('+BONE+',.35)';ctx.lineWidth=1;ctx.stroke();}});}
      /* plots */
      S.plots.forEach(function(pl){var g=ease((t-pl.t0)/700);if(g<=0)return;var b=pl.b,fade=1-ease((t-b.t0)/600);if(fade<=0)return;
        var cs=[P(b.x0,b.y0,0.005),P(b.x1,b.y0,0.005),P(b.x1,b.y1,0.005),P(b.x0,b.y1,0.005)];ctx.setLineDash([3,3]);ctx.beginPath();var n=Math.floor(g*4+0.999);for(var i=0;i<n;i++)seg(cs[i],cs[(i+1)%4]);
        ctx.strokeStyle='rgba('+SIG+','+(0.8*fade)+')';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);cs.forEach(function(cp){ctx.fillStyle='rgba('+SIG+','+fade+')';ctx.fillRect(cp.x-1.5,cp.y-1.5,3,3);});});
      /* buildings, back to front */
      var tt=t/1000;
      S.buildings.forEach(function(b){var g=ease((t-b.t0)/b.rise);if(g<=0)return;var h=b.h*g;
        var fg=g>=1?ease((t-b.fillAt)/1000):0, sg=(b.shop&&fg>=1)?ease((t-b.shopAt)/600):0;
        var A=P(b.x0,b.y0,0),B=P(b.x1,b.y0,0),C=P(b.x1,b.y1,0),D=P(b.x0,b.y1,0),At=P(b.x0,b.y0,h),Bt=P(b.x1,b.y0,h),Ct=P(b.x1,b.y1,h),Dt=P(b.x0,b.y1,h);
        if(fg>0){quad(At,Bt,Ct,Dt,'rgba(36,41,50,'+(0.97*fg)+')');quad(D,C,Ct,Dt,'rgba(24,28,36,'+(0.97*fg)+')');quad(B,C,Ct,Bt,'rgba(14,17,22,'+(0.97*fg)+')');}
        /* edges: hidden ones faint while it is a wireframe, gone once it is solid */
        if(fg<1){ctx.beginPath();seg(A,B);seg(A,D);seg(A,At);seg(At,Bt);seg(At,Dt);ctx.strokeStyle='rgba('+BONE+','+(0.18*(1-fg))+')';ctx.lineWidth=1;ctx.stroke();}
        ctx.beginPath();seg(B,C);seg(C,D);seg(B,Bt);seg(C,Ct);seg(D,Dt);ctx.strokeStyle='rgba('+BONE+','+(0.45+0.3*fg)+')';ctx.lineWidth=1;ctx.stroke();
        ctx.beginPath();seg(Bt,Ct);seg(Ct,Dt);seg(Dt,At);seg(At,Bt);ctx.strokeStyle=g<1?'rgba('+SIG+',.95)':'rgba('+BONE+','+(0.6+0.3*fg)+')';ctx.stroke();
        if(g<1){var mast=P(b.x1,b.y1,0),mt=P(b.x1,b.y1,b.h*1.25),jib=P(b.x1-(b.x1-b.x0)*1.1,b.y1,b.h*1.25),hook=P(b.x1-(b.x1-b.x0)*0.8,b.y1,h+0.05);
          ctx.beginPath();seg(mast,mt);seg(mt,jib);seg(P(b.x1-(b.x1-b.x0)*0.8,b.y1,b.h*1.25),hook);ctx.strokeStyle='rgba('+SIG+',.85)';ctx.stroke();ctx.fillStyle='rgba('+SIG+',.9)';ctx.fillRect(hook.x-1.5,hook.y-1.5,3,3);}
        if(fg>0.5){var wa=(fg-0.5)*2;b.win.forEach(function(w){if(w.z+0.14>b.h)return;if(sg>0&&w.z<0.3)return;var on=w.on&&Math.sin(tt*0.4+w.ph)>(sg>0?-0.9:-0.3);
            var p0,p1,p2,p3;if(w.f===0){p0=P(w.u,b.y1,w.z);p1=P(w.u+0.1,b.y1,w.z);p2=P(w.u+0.1,b.y1,w.z+0.14);p3=P(w.u,b.y1,w.z+0.14);}else{p0=P(b.x1,w.u,w.z);p1=P(b.x1,w.u+0.1,w.z);p2=P(b.x1,w.u+0.1,w.z+0.14);p3=P(b.x1,w.u,w.z+0.14);}
            quad(p0,p1,p2,p3,on?'rgba('+SIG+','+(0.8*wa)+')':'rgba('+BONE+','+(0.13*wa)+')');});}
        if(sg>0){var z0=0.02,z1=0.18;quad(P(b.x0,b.y1,z0),P(b.x1,b.y1,z0),P(b.x1,b.y1,z1),P(b.x0,b.y1,z1),'rgba('+SIG+','+(0.24*sg)+')');quad(P(b.x1,b.y0,z0),P(b.x1,b.y1,z0),P(b.x1,b.y1,z1),P(b.x1,b.y0,z1),'rgba('+SIG+','+(0.16*sg)+')');
          if(b.h>0.6){var i0=b.x0+0.14,i1=b.x1-0.14;quad(P(i0,b.y1+0.01,0.22),P(i1,b.y1+0.01,0.22),P(i1,b.y1+0.01,0.27),P(i0,b.y1+0.01,0.27),'rgba('+SIG+','+(0.85*sg)+')');}
          for(var li=0;li<3;li++){var lq=P(b.x0+0.15+li*((b.x1-b.x0-0.3)/2),b.y1+0.14,0.005);ctx.fillStyle='rgba('+SIG+','+(0.4*sg)+')';ctx.fillRect(lq.x-2,lq.y-0.5,4,1);}}
      });
      /* people on the streets */
      if(t>S.peopleAt){var dt=Math.min(0.05,(t-(S._lt||t))/1000);S._lt=t;
        S.people.forEach(function(p){var lim=p.axis==='x'?XW:YW;if(!reduce){p.pos+=p.sp*p.dir*dt;if(p.pos<0||p.pos>lim){p.dir*=-1;p.pos=Math.max(0,Math.min(lim,p.pos));}
            var cross=p.axis==='x'?sx:sy;for(var ci=0;ci<cross.length;ci++){if(Math.abs(p.pos-cross[ci])<p.sp*dt&&prand()<0.35){var old=p.pos;p.axis=p.axis==='x'?'y':'x';p.pos=p.line;p.line=cross[ci];p.dir=prand()<0.5?1:-1;break;}}}
          var q=p.axis==='x'?P(p.pos,p.line,0.02):P(p.line,p.pos,0.02);ctx.fillStyle='rgba('+BONE+',.95)';ctx.fillRect(q.x-1,q.y-3,2,3);ctx.fillStyle='rgba('+SIG+',.95)';ctx.fillRect(q.x-1,q.y-4.2,2,1.2);});}
      /* perimeter */
      if(S.ring){var rg=ease((t-S.ring.t0)/1200);if(rg>0){var m2=0.55,cs2=[P(-m2,-m2,0),P(XW+m2,-m2,0),P(XW+m2,YW+m2,0),P(-m2,YW+m2,0)];ctx.setLineDash([4,4]);ctx.beginPath();var n2=Math.floor(rg*4+0.999);for(var k2=0;k2<n2;k2++)seg(cs2[k2],cs2[(k2+1)%4]);ctx.strokeStyle='rgba('+SIG+',.7)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);}}
    }
    var raf=0,t0=null,visible=true,last=0,running=false;
    function frame(ts){if(t0===null)t0=ts;var t=ts-t0;if(ts-last>33){last=ts;draw(t);}if(running&&visible)raf=requestAnimationFrame(frame);else raf=0;}
    function play(){running=true;t0=null;if(reduce){draw(60000);return;}cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}
    function stop(){running=false;cancelAnimationFrame(raf);raf=0;}
    size();var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();if(reduce)draw(60000);},150);});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible&&running&&!raf&&!reduce)raf=requestAnimationFrame(frame);if(!visible){cancelAnimationFrame(raf);raf=0;}}).observe(c);}
    return {setScript:setScript,play:play,stop:stop,draw:draw,size:size,buildings:buildings,DMAX:DMAX};
  }

  /* the hero story: survey 0-2.6s, plots, wireframes to ~7s, facades 7.4-9.4s, shops 9.8-11s, people from 11.2s */
  function heroScript(w,mobile){var r=rng(5),B=[],pl=[],P2=[];
    w.buildings.forEach(function(b,i){var bb=Object.assign({},b);bb.t0=1300+(b.x0+b.y0)/w.DMAX*2600+300+r()*500;bb.rise=1100+r()*500;bb.fillAt=7400+i*45;bb.shopAt=9800+(i%7)*180;B.push(bb);pl.push({b:bb,t0:bb.t0-800});});
    for(var k=0;k<(mobile?10:26);k++)P2.push({});
    return {sweepT:2600,buildings:B,plots:pl,people:P2,ring:null,peopleAt:11200,parksAt:7000};}
  /* the four stage scenes: surveyed plots; one structure rising; several built and more rising; the city running */
  function stageScript(w,k){var r=rng(20+k),B=[],pl=[],P2=[];var all=w.buildings;
    if(k===0){all.slice(0,3).forEach(function(b,i){var bb=Object.assign({},b);bb.t0=1e9;bb.rise=1;B.push(bb);pl.push({b:bb,t0:500+i*450});});}
    if(k===1){var one=Object.assign({},all[Math.floor(all.length/2)]);one.t0=500;one.rise=1700;one.fillAt=2500;one.shopAt=1e9;B.push(one);pl.push({b:one,t0:0});
      all.slice(0,2).forEach(function(b,i){var bb=Object.assign({},b);bb.t0=1e9;bb.rise=1;B.push(bb);pl.push({b:bb,t0:1500+i*500});});}
    if(k===2){all.forEach(function(b,i){if(i%2)return;var bb=Object.assign({},b);var late=i%3===0;bb.t0=late?300+(i%5)*400:-4000;bb.rise=1300;bb.fillAt=late?bb.t0+1600:-2000;bb.shopAt=1e9;B.push(bb);if(late)pl.push({b:bb,t0:bb.t0-600});});}
    if(k===3){all.forEach(function(b,i){var bb=Object.assign({},b);bb.t0=-5000;bb.rise=1000;bb.fillAt=-3000;bb.shopAt=200+(i%6)*150;B.push(bb);});for(var q=0;q<12;q++)P2.push({});}
    return {sweepT:1,buildings:B,plots:pl,people:P2,ring:k===3?{t0:400}:null,peopleAt:k===3?800:1e9,parksAt:k>=2?0:1e9};}
  window.DFGWorld={World:World,heroScript:heroScript,stageScript:stageScript};

  var hero=document.getElementById('scan');
  if(hero){var mob=hero.clientWidth<700;var w=new World(hero,{bx:mob?5:7,by:mob?4:5,seed:7});w.setScript(heroScript(w,mob));w.play();window.__heroWorld=w;}
})();

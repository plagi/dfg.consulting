/* dfg.consulting — the world.
   A surface is surveyed by a sweep. Where it has been surveyed, plots are marked, structures rise as wireframes,
   and a city stands with people moving between the buildings. The same renderer draws the hero story and the
   four stage scenes; only the script differs. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rng(seed){return function(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
  function ease(p){return p<0?0:p>1?1:p*p*(3-2*p);}

  function World(canvas,opt){
    var c=canvas, ctx=c.getContext('2d',{alpha:false});
    var NX=opt.nx||150, NZ=opt.nz||84, X0=-1.9,X1=1.9, Z0=0.25,Z1=3.4;
    var BG=opt.bg||'#0A0C10';
    var rand=rng(opt.seed||90626), G=[];
    [3,6,12,24].forEach(function(f){var g=[];for(var i=0;i<(f+1)*(f+1);i++)g.push(rand());G.push({f:f,g:g});});
    function n2(gd,u,v){var f=gd.f,x=u*f,y=v*f,x0=Math.floor(x),y0=Math.floor(y),tx=x-x0,ty=y-y0;tx=tx*tx*(3-2*tx);ty=ty*ty*(3-2*ty);
      var g=gd.g,r0=y0*(f+1),r1=(y0+1)*(f+1);var a=g[r0+x0],b=g[r0+x0+1],cc=g[r1+x0],d=g[r1+x0+1];return (a*(1-tx)+b*tx)*(1-ty)+(cc*(1-tx)+d*tx)*ty;}
    function height(u,v){var h=n2(G[0],u,v)+n2(G[1],u,v)*.5+n2(G[2],u,v)*.25+n2(G[3],u,v)*.12;h/=1.87;var r=1-Math.abs(n2(G[1],u*.7+.3,v*.7)*2-1);return Math.pow(h,1.6)*(opt.relief||.55)+r*r*.12;}
    var pts=[];for(var j=0;j<NZ;j++)for(var i=0;i<NX;i++){var u=i/(NX-1),v=j/(NZ-1);pts.push({x:X0+(X1-X0)*u,z:Z0+(Z1-Z0)*v,y:height(u,v)});}
    var cam={y:opt.camY||1.05,z:-0.55,pitch:opt.pitch||0.5,f:1.0}, yaw=0, W=0,H=0,dpr=1, o={x:0,y:0,d:0};
    function size(){dpr=Math.min(2,window.devicePixelRatio||1);W=c.clientWidth;H=c.clientHeight;c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}
    function project(p,out){var x=p.x+yaw*p.z,vx=x,vy=p.y-cam.y,vz=p.z-cam.z,cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch);
      var vy2=vy*cp+vz*sp,vz2=-vy*sp+vz*cp;if(vz2<0.05)return false;
      var f=cam.f*(W<700?W*(opt.mobileF||0.72):Math.min(W,H*(opt.fRatio||1.35)));
      out.x=W*(opt.cx||0.5)+f*vx/vz2;out.y=H*(W<700?(opt.cyMobile||0.42):(opt.cy||0.56))-f*vy2/vz2;out.d=vz2;return true;}
    function world(u,v){return {x:X0+(X1-X0)*u,z:Z0+(Z1-Z0)*v,y:height(u,v)};}

    /* script: what happens when */
    var S={sweepT:3200,sweepStart:0,buildings:[],people:[],plots:[],ring:null,peopleAt:1e9,streets:true};
    var prand=rng(7);
    function setScript(s){S=s;S.buildings.forEach(function(b){var w=world(b.u,b.v);b.x=w.x;b.z=w.z;b.y=w.y;b.win=[];
      var cols=Math.max(2,Math.round(b.w/0.045)),rows=Math.max(2,Math.round(b.h/0.05)),r=rng(Math.floor(b.u*1000+b.v*7000));
      for(var i=0;i<cols;i++)for(var j=0;j<rows;j++)b.win.push({i:i,j:j,cols:cols,rows:rows,on:r()<0.38,ph:r()*6.28});});
      S.people.forEach(function(p){p.f=prand();p.a=Math.floor(prand()*S.buildings.length);p.b=(p.a+1+Math.floor(prand()*(S.buildings.length-1)))%S.buildings.length;p.sp=0.05+prand()*0.08;p.side=(prand()-0.5)*0.06;});}

    function line(a,b){if(project(a,o)){var ax=o.x,ay=o.y;if(project(b,o)){ctx.moveTo(ax,ay);ctx.lineTo(o.x,o.y);}}}
    function depthA(z){return Math.max(0.15,Math.min(1,1-(z-0.6)/3.4));}

    function draw(t){
      ctx.fillStyle=BG;ctx.fillRect(0,0,W,H);
      var sp=ease((t-S.sweepStart)/S.sweepT), sx=X0+(X1-X0)*sp, band=0.16;
      /* surveyed ground */
      for(var k=0;k<pts.length;k++){var p=pts[k];if(p.x>sx)continue;if(!project(p,o))continue;
        var depth=Math.max(0,Math.min(1,(o.d-0.6)/3.2)),near=Math.max(0,1-(sx-p.x)/band);
        var a=(0.26+(1-depth)*0.5)*(1-near*0.4)+near*0.9,r=(1-depth)*1.6+0.6;
        ctx.fillStyle=near>0?'rgba(242,180,65,'+Math.min(1,a)+')':'rgba(233,235,239,'+Math.min(1,a)+')';
        ctx.fillRect(o.x-r*0.5,o.y-r*0.5,r,r);}
      /* the sweep */
      if(sp<1){ctx.beginPath();var first=true,ui=(sx-X0)/(X1-X0);
        for(var j=0;j<NZ;j++){var v=j/(NZ-1),q={x:sx,z:Z0+(Z1-Z0)*v,y:height(ui,v)};if(!project(q,o))continue;if(first){ctx.moveTo(o.x,o.y);first=false;}else ctx.lineTo(o.x,o.y);}
        ctx.strokeStyle='rgba(242,180,65,.9)';ctx.lineWidth=1;ctx.stroke();}
      /* plots: surveyed rectangles, drawn in */
      S.plots.forEach(function(pl){var g=ease((t-pl.t0)/900);if(g<=0)return;var w=world(pl.u,pl.v);
        var cs=[{x:w.x-pl.w/2,z:w.z-pl.d/2},{x:w.x+pl.w/2,z:w.z-pl.d/2},{x:w.x+pl.w/2,z:w.z+pl.d/2},{x:w.x-pl.w/2,z:w.z+pl.d/2}];
        ctx.setLineDash([3,3]);ctx.strokeStyle='rgba(242,180,65,'+(0.75*g)+')';ctx.lineWidth=1;ctx.beginPath();
        var n=Math.floor(g*4+0.999);for(var i=0;i<n;i++){var a=cs[i],b=cs[(i+1)%4];line({x:a.x,z:a.z,y:w.y+0.008},{x:b.x,z:b.z,y:w.y+0.008});}
        ctx.stroke();ctx.setLineDash([]);
        cs.forEach(function(cp){if(project({x:cp.x,z:cp.z,y:w.y+0.008},o)){ctx.fillStyle='rgba(242,180,65,'+g+')';ctx.fillRect(o.x-1.5,o.y-1.5,3,3);}});});
      /* streets between built structures */
      var built=S.buildings.filter(function(b){return t>b.t0+b.rise;}).sort(function(a,b){return a.x-b.x;});
      if(S.streets&&built.length>1){ctx.beginPath();for(var i=1;i<built.length;i++){var a=built[i-1],b=built[i];var n=10;var pf=true;
          for(var s=0;s<=n;s++){var f=s/n,x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f,u=(x-X0)/(X1-X0),v=(z-Z0)/(Z1-Z0),q={x:x,z:z,y:height(u,v)+0.012};if(!project(q,o))continue;if(pf){ctx.moveTo(o.x,o.y);pf=false;}else ctx.lineTo(o.x,o.y);}}
        ctx.strokeStyle='rgba(233,235,239,.28)';ctx.lineWidth=1;ctx.stroke();}
      /* structures */
      S.buildings.forEach(function(b){if(b.x>sx)return;var g=ease((t-b.t0)/b.rise);if(g<=0)return;var da=depthA(b.z);
        var hx=b.w/2,hz=b.d/2,y0=b.y,y1=b.y+b.h*g;
        var base=[{x:b.x-hx,z:b.z-hz},{x:b.x+hx,z:b.z-hz},{x:b.x+hx,z:b.z+hz},{x:b.x-hx,z:b.z+hz}];
        ctx.lineWidth=1;
        ctx.beginPath();for(var i=0;i<4;i++){var a=base[i],bb=base[(i+1)%4];line({x:a.x,z:a.z,y:y0},{x:bb.x,z:bb.z,y:y0});line({x:a.x,z:a.z,y:y0},{x:a.x,z:a.z,y:y1});}
        ctx.strokeStyle='rgba(233,235,239,'+(0.55*da)+')';ctx.stroke();
        ctx.beginPath();for(var i2=0;i2<4;i2++){var a2=base[i2],b2=base[(i2+1)%4];line({x:a2.x,z:a2.z,y:y1},{x:b2.x,z:b2.z,y:y1});}
        ctx.strokeStyle=g<1?'rgba(242,180,65,.95)':'rgba(233,235,239,'+(0.7*da)+')';ctx.stroke();
        if(g<1){/* the crane: a mast at one corner and a jib over the top */
          var mx=b.x+hx,mz=b.z+hz,top=b.y+b.h*1.25;ctx.beginPath();line({x:mx,z:mz,y:y0},{x:mx,z:mz,y:top});line({x:mx,z:mz,y:top},{x:mx-b.w*1.1,z:mz,y:top});line({x:mx-b.w*0.8,z:mz,y:top},{x:mx-b.w*0.8,z:mz,y:y1+0.02});
          ctx.strokeStyle='rgba(242,180,65,.8)';ctx.stroke();}
        else{/* windows on the near face and the side face */
          var tt=t/1000;b.win.forEach(function(wv){var fx=b.x-hx+(wv.i+0.5)/wv.cols*b.w,fy=y0+(wv.j+0.5)/wv.rows*b.h;
            var on=wv.on&&Math.sin(tt*0.35+wv.ph)>-0.85;var q={x:fx,z:b.z-hz,y:fy};if(project(q,o)){ctx.fillStyle=on?'rgba(242,180,65,'+(0.85*da)+')':'rgba(233,235,239,'+(0.14*da)+')';ctx.fillRect(o.x-0.8,o.y-0.8,1.6,1.6);}});}
      });
      /* people */
      if(t>S.peopleAt&&built.length>1){var dt=Math.min(0.05,(t-(S._lt||t))/1000);S._lt=t;
        S.people.forEach(function(p){var A=S.buildings[p.a%S.buildings.length],B=S.buildings[p.b%S.buildings.length];if(!A||!B)return;
          if(!reduce){p.f+=p.sp*dt;if(p.f>=1){p.f=0;p.a=p.b;p.b=(p.a+1+Math.floor(prand()*(S.buildings.length-1)))%S.buildings.length;}}
          var x=A.x+(B.x-A.x)*p.f+p.side,z=A.z+(B.z-A.z)*p.f+p.side*0.5,u=(x-X0)/(X1-X0),v=(z-Z0)/(Z1-Z0);if(u<0||u>1||v<0||v>1)return;
          var q={x:x,z:z,y:height(u,v)+0.018};if(project(q,o)){var da2=depthA(z);ctx.fillStyle='rgba(233,235,239,'+(0.95*da2)+')';ctx.fillRect(o.x-1,o.y-2.5,2,3.5);ctx.fillStyle='rgba(242,180,65,'+(0.9*da2)+')';ctx.fillRect(o.x-1,o.y-3.5,2,1);}});}
      /* perimeter ring on the ground */
      if(S.ring){var rg=ease((t-S.ring.t0)/1400);if(rg>0){var cw=world(S.ring.u,S.ring.v);ctx.setLineDash([4,4]);ctx.beginPath();var pf2=true,n2_=48;
          for(var s2=0;s2<=Math.floor(n2_*rg);s2++){var an=s2/n2_*6.2832,x3=cw.x+Math.cos(an)*S.ring.rx,z3=cw.z+Math.sin(an)*S.ring.rz,u3=(x3-X0)/(X1-X0),v3=(z3-Z0)/(Z1-Z0);if(u3<0||u3>1||v3<0||v3>1)continue;
            var q3={x:x3,z:z3,y:height(u3,v3)+0.01};if(!project(q3,o))continue;if(pf2){ctx.moveTo(o.x,o.y);pf2=false;}else ctx.lineTo(o.x,o.y);}
          ctx.strokeStyle='rgba(242,180,65,.7)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);}}
    }

    var raf=0,t0=null,visible=true,last=0,running=false;
    function frame(ts){if(t0===null)t0=ts;var t=ts-t0;if(ts-last>33){last=ts;draw(t);}if(running&&visible)raf=requestAnimationFrame(frame);else raf=0;}
    function play(){running=true;t0=null;if(reduce){draw(60000);return;}cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);}
    function stop(){running=false;cancelAnimationFrame(raf);raf=0;}
    size();
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size();if(reduce)draw(60000);},150);});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting;if(visible&&running&&!raf&&!reduce)raf=requestAnimationFrame(frame);if(!visible){cancelAnimationFrame(raf);raf=0;}}).observe(c);}
    return {setScript:setScript,play:play,stop:stop,draw:draw,size:size};
  }

  /* ---- the hero story: survey, plots, construction, city ---- */
  function heroScript(mobile){
    var r=rng(41),B=[],P=[],pl=[];
    var n=mobile?9:14;
    for(var i=0;i<n;i++){var u=(mobile?0.05+0.9*r():0.34+0.64*r()),v=0.32+0.52*r();var w=0.06+r()*0.09,d=0.06+r()*0.08,h=0.04+v*Math.pow(r(),1.3)*0.24;
      B.push({u:u,v:v,w:w,d:d,h:h,rise:1300+r()*600});}
    B.sort(function(a,b){return a.u-b.u;});
    B.forEach(function(b,i){b.t0=900+b.u*2600+700+i*120;pl.push({u:b.u,v:b.v,w:b.w*1.25,d:b.d*1.25,t0:b.t0-700});});
    for(var k=0;k<(mobile?8:20);k++)P.push({});
    return {sweepT:3200,sweepStart:0,buildings:B,people:P,plots:pl,ring:null,peopleAt:7000,streets:true};
  }
  /* ---- the four stage scenes ---- */
  var SITES=[[0.5,0.44],[0.36,0.52],[0.64,0.5],[0.44,0.6],[0.58,0.62],[0.3,0.4],[0.7,0.38],[0.5,0.3],[0.38,0.33],[0.62,0.31]];
  function stageScript(k){
    var r=rng(11+k),B=[],pl=[],P=[];
    function bld(i,t0,rise){var s=SITES[i];return {u:s[0],v:s[1],w:0.13+r()*0.08,d:0.11+r()*0.07,h:0.1+r()*0.24,t0:t0,rise:rise||1400};}
    if(k===0){for(var i=0;i<3;i++){var s=SITES[i];pl.push({u:s[0],v:s[1],w:0.18,d:0.16,t0:600+i*500});}}
    if(k===1){B.push(bld(0,400,1600));pl.push({u:SITES[0][0],v:SITES[0][1],w:0.2,d:0.18,t0:0});pl.push({u:SITES[1][0],v:SITES[1][1],w:0.18,d:0.16,t0:1400});pl.push({u:SITES[2][0],v:SITES[2][1],w:0.18,d:0.16,t0:1900});}
    if(k===2){for(var j=0;j<6;j++)B.push(bld(j,j<3?-2000:300+(j-3)*500,1400));}
    if(k===3){for(var m=0;m<10;m++)B.push(bld(m,-3000,1000));for(var q=0;q<12;q++)P.push({});}
    return {sweepT:1,sweepStart:-10,buildings:B,people:P,plots:pl,ring:k===3?{u:0.5,v:0.46,rx:0.95,rz:0.62,t0:500}:null,peopleAt:k===3?200:1e9,streets:k>=2};
  }
  window.DFGWorld={World:World,heroScript:heroScript,stageScript:stageScript};

  var hero=document.getElementById('scan');
  if(hero){var w=new World(hero,{});w.setScript(heroScript(hero.clientWidth<700));w.play();window.__heroWorld=w;}
})();

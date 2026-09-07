/* dfg.consulting — the hero: a surface resolved into a point cloud by a sweep; six sites set on it in engagement order. */
  /* ---------- The scan. A surface being resolved into a point cloud by a sweep moving across it.
     Behind the sweep: known, drawn. Ahead of it: nothing yet. The readout is real: points resolved so far. ---------- */
  (function(){
    var c=document.getElementById('scan'); if(!c)return; var hero=c.parentNode, ctx=c.getContext('2d',{alpha:false});
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var NX=170,NZ=96, X0=-1.9,X1=1.9, Z0=0.25,Z1=3.4;
    var pts=[], W=0,H=0,dpr=1, t0=null, sweepT=15000, holdT=2600, readN=document.getElementById('rN'), readP=document.getElementById('rP');
    function rng(seed){return function(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
    // heightfield: value noise, three octaves, one ridge
    var rand=rng(90626), G=[]; [3,6,12,24].forEach(function(f){var g=[];for(var i=0;i<(f+1)*(f+1);i++)g.push(rand());G.push({f:f,g:g});});
    function n2(gd,u,v){var f=gd.f, x=u*f, y=v*f, x0=Math.floor(x), y0=Math.floor(y), tx=x-x0, ty=y-y0; tx=tx*tx*(3-2*tx); ty=ty*ty*(3-2*ty);
      var g=gd.g, r0=y0*(f+1), r1=(y0+1)*(f+1); var a=g[r0+x0],b=g[r0+x0+1],cc=g[r1+x0],d=g[r1+x0+1]; return (a*(1-tx)+b*tx)*(1-ty)+(cc*(1-tx)+d*tx)*ty;}
    function height(u,v){var h=n2(G[0],u,v)*1+n2(G[1],u,v)*.5+n2(G[2],u,v)*.25+n2(G[3],u,v)*.12; h/=1.87; var r=1-Math.abs(n2(G[1],u*.7+.3,v*.7)*2-1); return Math.pow(h,1.6)*.55+r*r*.12;}
    for(var j=0;j<NZ;j++)for(var i=0;i<NX;i++){var u=i/(NX-1), v=j/(NZ-1); pts.push({x:X0+(X1-X0)*u, z:Z0+(Z1-Z0)*v, y:height(u,v)});}
    var cam={y:1.05,z:-0.55,pitch:0.50,f:1.0}, yaw=0, o={x:0,y:0,d:0};
    // the plan: six sites in the order an engagement runs, set on the surveyed ground as the sweep passes
    var SITES=[{l:'Diagnose'},{l:'Plan'},{l:'Vendors'},{l:'Pilot'},{l:'Production'},{l:'Stay'}];

    var readM=document.getElementById('rM');
    function size(){dpr=Math.min(2,window.devicePixelRatio||1); W=c.clientWidth||hero.clientWidth; H=c.clientHeight||hero.clientHeight; c.width=W*dpr; c.height=H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); placeSites();}
    function placeSites(){
      var fx=[0.07,0.23,0.40,0.57,0.74,0.91], fy=W<700?[0.80,0.68,0.82,0.66,0.80,0.70]:[0.90,0.85,0.93,0.86,0.92,0.90];
      var saveYaw=yaw; yaw=0;
      SITES.forEach(function(m,i){var tx=fx[i]*W, ty=fy[i]*H, best=null, bd=1e12;
        for(var k=0;k<pts.length;k+=1){var p=pts[k]; if(!project(p,o))continue; var dx=o.x-tx, dy=o.y-ty, d=dx*dx+dy*dy; if(d<bd){bd=d;best=p;}}
        m.x=best.x; m.z=best.z; m.y=best.y; m.u=(best.x-X0)/(X1-X0); m.v=(best.z-Z0)/(Z1-Z0); m.h=(0.04+i*0.012)*(W<700?0.7:1); m.t=null;});
      yaw=saveYaw;
    }
    function project(p,out){
      var cy=Math.cos(yaw), sy=Math.sin(yaw); var x=p.x*cy - p.z*sy*0.0 ; // yaw kept tiny; apply as x shear for cheapness
      x=p.x + yaw*p.z;
      var vx=x, vy=p.y-cam.y, vz=p.z-cam.z;
      var cp=Math.cos(cam.pitch), sp=Math.sin(cam.pitch);
      var vy2=vy*cp+vz*sp, vz2=-vy*sp+vz*cp;
      if(vz2<0.05)return false;
      var f=cam.f*(W<700?W*0.72:Math.min(W,H*1.35));
      out.x=W*0.5+f*vx/vz2; out.y=H*(W<700?0.42:0.56)-f*vy2/vz2; out.d=vz2; return true;
    }
    function draw(ts){
      if(t0===null)t0=ts-sweepT*0.42; var el=(ts-t0)%(sweepT+holdT); var s=Math.min(1,el/sweepT); // sweep position 0..1 across x
      var e=s*s*(3-2*s); var sx=X0+(X1-X0)*e;
      if(!reduce) yaw=Math.sin(ts*0.00012)*0.035;
      ctx.fillStyle='#0A0C10'; ctx.fillRect(0,0,W,H);
      var resolved=0, band=0.16;
      // known points
      for(var k=0;k<pts.length;k++){var p=pts[k]; if(p.x>sx)continue; resolved++; if(!project(p,o))continue;
        var depth=Math.max(0,Math.min(1,(o.d-0.6)/3.2)); var near=Math.max(0,1-(sx-p.x)/band);
        var a=(0.28+ (1-depth)*0.55)*(1-near*0.4) + near*0.9; var r=(1-depth)*1.6+0.6;
        if(near>0){ctx.fillStyle='rgba(242,180,65,'+Math.min(1,a)+')';} else {ctx.fillStyle='rgba(233,235,239,'+Math.min(1,a)+')';}
        ctx.fillRect(o.x-r*0.5,o.y-r*0.5,r,r);
      }
      // the sweep itself: the intersection line across the surface at x = sx
      if(s<1){ctx.beginPath(); var first=true; var ui=(sx-X0)/(X1-X0);
        for(var j=0;j<NZ;j++){var v=j/(NZ-1); var q={x:sx,z:Z0+(Z1-Z0)*v,y:height(ui,v)}; if(!project(q,o))continue; if(first){ctx.moveTo(o.x,o.y);first=false;} else ctx.lineTo(o.x,o.y);}
        ctx.strokeStyle='rgba(242,180,65,.9)'; ctx.lineWidth=1; ctx.stroke();
        // and its vertical extent, faint, to read as a plane
        var top={x:sx,z:Z0,y:1.1}, bot={x:sx,z:Z0,y:0}; if(project(top,o)){var tx=o.x,ty=o.y; if(project(bot,o)){ctx.strokeStyle='rgba(242,180,65,.18)'; ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(o.x,o.y); ctx.stroke();}}
      }
      // plan: markers, route, structures
      var built=0, prevEl=draw.prevEl||0; if(el<prevEl){SITES.forEach(function(m){m.t=null;});} draw.prevEl=el;
      ctx.font='11px "Geist Mono", Menlo, monospace'; ctx.textBaseline='middle';
      for(var i=0;i<SITES.length;i++){var m=SITES[i]; if(m.x>sx){break;} if(m.t===null)m.t=ts; var age=ts-m.t; built++;
        var seg=Math.min(1,age/900), rise=Math.max(0,Math.min(1,(age-500)/1100)), last=(i===SITES.length-1||SITES[i+1].x>sx);
        // route from the previous site, along the surface
        if(i>0&&seg>0){var a=SITES[i-1]; ctx.beginPath(); var first=true, n=28;
          for(var k=0;k<=Math.floor(n*seg);k++){var f=k/n; var u=a.u+(m.u-a.u)*f, v=a.v+(m.v-a.v)*f; var q={x:X0+(X1-X0)*u,z:Z0+(Z1-Z0)*v,y:height(u,v)+0.012}; if(!project(q,o))continue; if(first){ctx.moveTo(o.x,o.y);first=false;} else ctx.lineTo(o.x,o.y);}
          ctx.strokeStyle='rgba(233,235,239,.85)'; ctx.lineWidth=1.2; ctx.stroke();}
        // marker on the ground
        if(project(m,o)){var mx=o.x,my=o.y; ctx.fillStyle=last?'rgba(242,180,65,1)':'rgba(233,235,239,.95)'; ctx.fillRect(mx-2.5,my-2.5,5,5);
          // structure rising
          if(rise>0){var top={x:m.x,z:m.z,y:m.y+m.h*rise}; if(project(top,o)){ctx.strokeStyle=last?'rgba(242,180,65,.95)':'rgba(233,235,239,.8)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(o.x,o.y); ctx.stroke();
            // platform cap and label once it stands
            if(rise>=1){ctx.fillStyle=last?'rgba(242,180,65,1)':'rgba(233,235,239,.9)'; ctx.fillRect(o.x-5,o.y-1,10,2);
              if(W>=700){ctx.fillStyle=last?'rgba(242,180,65,1)':'rgba(174,180,191,1)'; var lab=('0'+(i+1))+'  '+m.l, lw=ctx.measureText(lab).width; if(o.x+12+lw>W-8){ctx.textAlign='right';ctx.fillText(lab,o.x-10,o.y);ctx.textAlign='left';} else ctx.fillText(lab,o.x+10,o.y);}}}}
        }
      }
      if(readM)readM.textContent=built+' of '+SITES.length;
      if(readN)readN.textContent=resolved.toLocaleString('en-US'); if(readP)readP.textContent=Math.round(resolved/pts.length*100)+'%';
    }
    var raf=0, visible=true, last=0;
    function loop(ts){ if(ts-last>33){last=ts; draw(ts);} if(visible)raf=requestAnimationFrame(loop);}
    size();
    if(reduce){draw(sweepT*0.62);} else raf=requestAnimationFrame(loop);
    var rt; window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){size(); if(reduce)draw(sweepT*0.62);},150);});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){visible=es[0].isIntersecting; if(visible&&!reduce&&!raf)raf=requestAnimationFrame(loop); if(!visible){cancelAnimationFrame(raf);raf=0;}}).observe(hero);}
  })();

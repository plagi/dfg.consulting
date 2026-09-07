/* dfg.consulting — the three checks. Nothing is stored; state lives in the page. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  var AI={
    key:'ai', name:'AI readiness assessment', kind:'quiz', total:6, levels:3,
    intro:'Each answer is a level from 0 to 3, in ascending order. Choose the line that describes today, not the plan.',
    qs:[
      {d:'Executive ownership',q:'Who is accountable for AI at executive level?',o:[
        'No one is named.',
        'A named executive, without a budget line.',
        'A named executive with a budget line.',
        'A named executive with a budget line, reporting results to the board at least quarterly.'],
        w:'Name an executive owner and a budget line before any use-case is chosen. Without one, the plan has nobody to be handed to.'},
      {d:'Data',q:'How would you describe the data the first use-cases depend on?',o:[
        'Held in separate systems and spreadsheets, reconciled by hand.',
        'Centralised in a warehouse or lake; quality undocumented.',
        'Documented, with named owners and measured quality for the main datasets.',
        'Governed end to end: owners, quality metrics, access controls and lineage.'],
        w:'Ownership and quality for the two or three datasets the first use-cases need. Not the whole estate; the part the plan depends on.'},
      {d:'Use-case selection',q:'How far has the list of candidate use-cases been worked?',o:[
        'There is no list, or a long one nobody has costed.',
        'A shortlist with rough value estimates only.',
        'A ranked shortlist: value, feasibility, and a named business owner for each.',
        'A ranked, owned shortlist, sequenced against delivery capacity and the data that exists.'],
        w:'Ranking the candidates by value and feasibility, with a named owner each. This usually takes a list of thirty to a list of two.'},
      {d:'Production record',q:'How many AI use-cases are in production today?',o:[
        'None. Individual staff use chat tools.',
        'None. One or more pilots ran and stopped.',
        'One, without measured results.',
        'One or more, with results measured and reported to the sponsor.'],
        w:'Taking one use-case to production with a measured result, so the board sees evidence before the next budget round.'},
      {d:'Engineering',q:'Who would build and run the first use-case?',o:[
        'Vendors only; no in-house engineering.',
        'An in-house team with no ML or LLM delivery experience.',
        'An in-house team that has shipped one ML or LLM feature, with vendor support.',
        'An in-house team that ships and operates ML or LLM features, with monitoring and on-call.'],
        w:'Deciding what is built in-house and what is bought, and setting vendor terms so the team can operate it afterwards.'},
      {d:'Governance',q:'What is the policy on AI use?',o:[
        'No policy. Decisions are made case by case.',
        'A policy that restricts use, with no route to approval.',
        'A policy with a defined review path for new use-cases.',
        'A review path, a model inventory, and an assessment record for each use-case in production.'],
        w:'A review path that approves a use-case in weeks rather than quarters, with a record an auditor can read.'}
    ],
    read:function(s){
      if(s<=6)return{h:'Foundations first.',p:'The plan should begin with ownership and data, not with models. The first two weeks of a Diagnosis would go on who owns what, where the data is, and which two use-cases justify fixing it.'};
      if(s<=12)return{h:'Ready for a shortlist.',p:'The foundations are partly there. The work now is choosing two use-cases by value and feasibility, and taking one to production with a measured result before the next budget conversation.'};
      return{h:'Ready to scale.',p:'The question is how to run three or four use-cases at once without losing control of vendors, cost and risk. A Diagnosis here would concentrate on governance, vendor oversight and the delivery plan.'};
    }
  };

  var TRI=['In place','Partly','Not yet'];
  var BANK={
    key:'bank', name:'Bank onboarding evidence', kind:'list',
    title:'Mark each item as it stands today.',
    intro:'In place means the document exists and is current. Partly means it exists but is out of date or incomplete.',
    groups:[
      ['Regulatory and licensing',[
        ['Written confirmation of regulatory status in each market: licence, registration, or a legal opinion on exemption'],
        ['A register of regulatory obligations, with an owner and a change log']]],
      ['Financial crime',[
        ['AML and KYC programme documented, with a named MLRO or compliance officer'],
        ['Sanctions and PEP screening in operation, with records of alerts handled']]],
      ['Information security',[
        ['SOC 2 Type II or ISO 27001 certificate, or a dated audit plan the bank can review'],
        ['PCI DSS scope and attestation, where card data is touched'],
        ['Penetration test report from the last twelve months, with remediation status']]],
      ['Data and privacy',[
        ['Data-flow map and a data-residency position for each market'],
        ['Privacy notices and a data-processing agreement template the bank’s counsel can mark up']]],
      ['Operational resilience',[
        ['Incident-response and business-continuity plans, tested in the last twelve months'],
        ['Critical third parties listed (cloud, KYC vendor, processors), each with its own assurance on file']]],
      ['Financial standing',[
        ['Audited or reviewed accounts, with twelve months of runway shown']]],
      ['Technology',[
        ['Integration architecture written down: APIs, environments, responsibilities, and the change process']]]
    ],
    read:function(n,t){
      if(n>=10)return{h:'Ready to open the conversation.',p:'Most of what a sponsor bank’s third-party review asks for exists. The open items below set the length of onboarding, not whether it happens.'};
      if(n>=5)return{h:'Halfway. The order matters.',p:'A bank’s review opens with regulatory status and the financial-crime programme, and stops if either is missing. Close those first; the security and data items can be prepared alongside.'};
      return{h:'Not yet. Start with the first two groups.',p:'Without written regulatory status and a documented AML programme, a bank will not open a file. Those two groups are the first four to six weeks of work, and they are the same in every market.'};
    }
  };

  var SEC={
    key:'sec', name:'ISO 27001 control check', kind:'list',
    title:'Mark each control as it stands today.',
    intro:'In place means written, operating, and evidenced. Partly means one of those three is missing.',
    groups:[
      ['Organisational controls',[
        ['Information security policy approved by management and reviewed within the last year','A.5.1'],
        ['Inventory of information assets, each with a named owner','A.5.9'],
        ['Access control policy with joiner, mover and leaver procedures','A.5.15'],
        ['Supplier security requirements in contracts, with a supplier register','A.5.19'],
        ['Incident management plan with roles, escalation and a contact list','A.5.24']]],
      ['People controls',[
        ['Security awareness training for all staff in the last year, with attendance records','A.6.3']]],
      ['Physical controls',[
        ['Physical entry controls to offices and server areas, with visitor records','A.7.2']]],
      ['Technological controls',[
        ['Privileged access restricted, logged and reviewed quarterly','A.8.2'],
        ['Multi-factor authentication on email, cloud consoles and remote access','A.8.5'],
        ['Vulnerability management with defined patch windows and evidence of closure','A.8.8'],
        ['Backups taken, tested by restore, and stored separately','A.8.13'],
        ['Logging enabled on critical systems, protected from change and reviewed','A.8.15']]]
    ],
    read:function(n,t){
      if(n>=10)return{h:'Audit-ready on paper.',p:'The controls an auditor samples first exist. What remains is evidence: records that show each control operating over time, not only a document saying it should.'};
      if(n>=5)return{h:'Half the controls. Gaps in audit order.',p:'An auditor works from policy and inventory to access, then to the technical controls. The open items below follow that order; the first is the one to close first.'};
      return{h:'Start with policy, inventory and access.',p:'The technical controls depend on knowing what you hold and who can reach it. The open items are in the order an assessment would take them.'};
    }
  };

  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function arrow(){return '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" stroke-width="2"/></svg>';}
  function btn(cls,html,fn){var b=el('button',cls,html); b.type='button'; if(fn)b.addEventListener('click',fn); return b;}

  /* Hands the result to the contact form on the same page, visibly, as text the visitor can edit. */
  function send(text){
    var form=document.getElementById('contactForm'); if(!form)return;
    var ta=form.querySelector('textarea[name=problem]');
    var cur=ta.value.replace(/\n*\[Check result\][\s\S]*$/,'').replace(/\s+$/,'');
    ta.value=(cur?cur+'\n\n':'')+'[Check result]\n'+text;
    var c=document.getElementById('contact'); if(c)c.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});
    setTimeout(function(){ta.focus({preventScroll:true});},reduce?0:500);
  }

  function header(def,stepText,progress){
    var b=el('div','bar'); b.appendChild(el('span','name',def.name)); b.appendChild(el('span','step',stepText));
    var t=el('div','track'); var i=el('i'); i.style.width=Math.round(progress*100)+'%'; t.appendChild(i);
    var f=document.createDocumentFragment(); f.appendChild(b); f.appendChild(t); return f;
  }

  function mountQuiz(root,def){
    var i=0, ans=[];
    function render(){
      root.innerHTML='';
      if(i>=def.total){root.appendChild(header(def,'Result',1)); return result();}
      root.appendChild(header(def,'Question '+(i+1)+' of '+def.total,i/def.total));
      var body=el('div','body step-in'); var q=def.qs[i];
      body.appendChild(el('div','dim',q.d));
      body.appendChild(el('h3','q',q.q));
      if(i===0)body.appendChild(el('p','hint',def.intro));
      var opts=el('div','opts'); opts.setAttribute('role','radiogroup'); opts.setAttribute('aria-label',q.q);
      var next;
      q.o.forEach(function(t,idx){
        var b=btn('opt'+(ans[i]===idx?' sel':''),'<span class="r"></span><span>'+t+'</span>',function(){
          ans[i]=idx; [].forEach.call(opts.children,function(x,j){x.classList.toggle('sel',j===idx); x.setAttribute('aria-checked',j===idx?'true':'false');});
          next.disabled=false;
        });
        b.setAttribute('role','radio'); b.setAttribute('aria-checked',ans[i]===idx?'true':'false');
        opts.appendChild(b);
      });
      body.appendChild(opts); root.appendChild(body);
      var foot=el('div','foot'); foot.appendChild(el('span','note',i<def.total-1?'Levels rise from top to bottom.':'Last question. The result follows.'));
      var nav=el('div','nav');
      var back=btn(null,'Back',function(){if(i>0){i--;render();}}); back.disabled=i===0;
      next=btn('pri',(i<def.total-1?'Next':'See the result')+' '+arrow(),function(){if(ans[i]==null)return; i++; render(); root.scrollIntoView({behavior:'auto',block:'nearest'});});
      next.disabled=ans[i]==null;
      nav.appendChild(back); nav.appendChild(next); foot.appendChild(nav); root.appendChild(foot);
    }
    function result(){
      var score=ans.reduce(function(a,b){return a+b;},0), max=def.total*def.levels, r=def.read(score);
      var low=0; ans.forEach(function(a,k){if(a<ans[low])low=k;}); var lowQ=def.qs[low];
      var body=el('div','body step-in'); var res=el('div','res');
      res.appendChild(el('div','score','<b>'+score+'</b><span>of '+max+' across six dimensions</span>'));
      res.appendChild(el('h4',null,r.h)); res.appendChild(el('p',null,r.p));
      var prof=el('div','prof');
      def.qs.forEach(function(q,k){prof.appendChild(el('div','prow'+(k===low?' low':''),'<span class="l">'+q.d+'</span><span class="b"><i class="'+(ans[k]>=1?'on':'')+'"></i><i class="'+(ans[k]>=2?'on':'')+'"></i><i class="'+(ans[k]>=3?'on':'')+'"></i></span><span class="v">'+ans[k]+' of 3</span>'));});
      res.appendChild(prof);
      res.appendChild(el('div','first','<span class="k">Where a Diagnosis would start &middot; '+lowQ.d+'</span>'+lowQ.w));
      var summary=def.name+': '+score+' of '+max+'. '+r.h+'\n'+def.qs.map(function(q,k){return '- '+q.d+': '+ans[k]+' of 3';}).join('\n')+'\nLowest dimension: '+lowQ.d+'.';
      var acts=el('div','acts');
      acts.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(summary);}));
      acts.appendChild(btn(null,'Start again',function(){i=0;ans=[];render();}));
      res.appendChild(acts); body.appendChild(res); root.appendChild(body);
    }
    render();
  }

  function mountChecklist(root,def){
    var items=[]; def.groups.forEach(function(g){g[1].forEach(function(it){items.push({t:it[0],c:it[1]||'',g:g[0],s:-1});});});
    var done=false;
    function marked(){return items.filter(function(it){return it.s>=0;}).length;}
    function score(){return items.reduce(function(a,it){return a+(it.s===0?1:it.s===1?0.5:0);},0);}
    function fmt(n){return (n%1?n.toFixed(1):String(n));}
    function tally(){var c=[0,0,0,0]; items.forEach(function(it){c[it.s<0?3:it.s]++;}); return c;}
    function footText(){var m=marked(); return m?fmt(score())+' of '+items.length+' in place &middot; '+m+' of '+items.length+' marked':'Nothing marked yet';}
    function render(){
      root.innerHTML='';
      if(done){root.appendChild(header(def,'Result',1)); return result();}
      root.appendChild(header(def,items.length+' items',marked()/items.length));
      var body=el('div','body step-in');
      body.appendChild(el('h3','q',def.title));
      body.appendChild(el('p','hint',def.intro));
      var list=el('div','list'); var lastG=null; var foot, go, note;
      items.forEach(function(it){
        if(it.g!==lastG){list.appendChild(el('div','grp',it.g)); lastG=it.g;}
        var row=el('div','row'); row.appendChild(el('span','t',it.t+(it.c?'<span class="c">'+it.c+'</span>':'')));
        var seg=el('div','seg'); seg.setAttribute('role','radiogroup'); seg.setAttribute('aria-label',it.t);
        TRI.forEach(function(lab,si){var b=btn('s'+si+(it.s===si?' on':''),lab,function(){
            it.s=si; [].forEach.call(seg.children,function(x,j){x.className='s'+j+(j===si?' on':''); x.setAttribute('aria-checked',j===si?'true':'false');});
            root.querySelector('.track i').style.width=Math.round(marked()/items.length*100)+'%';
            note.innerHTML=footText(); go.disabled=marked()===0;
          }); b.setAttribute('role','radio'); b.setAttribute('aria-checked',it.s===si?'true':'false'); seg.appendChild(b);});
        row.appendChild(seg); list.appendChild(row);
      });
      body.appendChild(list); root.appendChild(body);
      foot=el('div','foot'); note=el('span','note',footText()); foot.appendChild(note);
      var nav=el('div','nav'); go=btn('pri','See the gaps '+arrow(),function(){done=true;render();root.scrollIntoView({behavior:'auto',block:'nearest'});}); go.disabled=marked()===0; nav.appendChild(go); foot.appendChild(nav); root.appendChild(foot);
    }
    function result(){
      var n=score(), c=tally(), r=def.read(n,items.length);
      var body=el('div','body step-in'); var res=el('div','res');
      res.appendChild(el('div','score','<b>'+fmt(n)+'</b><span>of '+items.length+' in place</span>'));
      var segs=el('div','segs'); items.forEach(function(_,k){var s=el('i'); if(k<Math.floor(n))s.className='on'; else if(k<n)s.className='half'; segs.appendChild(s);}); res.appendChild(segs);
      res.appendChild(el('div','tally','<span><b>'+c[0]+'</b> in place</span><span><b>'+c[1]+'</b> partly</span><span><b>'+c[2]+'</b> not yet</span>'+(c[3]?'<span><b>'+c[3]+'</b> not marked</span>':'')));
      res.appendChild(el('h4',null,r.h)); res.appendChild(el('p',null,r.p+(c[3]?' Items left unmarked are listed as open.':'')));
      var gaps=items.filter(function(it){return it.s!==0;});
      if(gaps.length){var ol=el('ol'); var lastG=null; var num=0;
        gaps.forEach(function(it){ if(it.g!==lastG){ol.appendChild(el('li','g',it.g)); lastG=it.g;} num++;
          var st=it.s===1?'<span class="st p">Partly</span>':it.s===2?'<span class="st">Not yet</span>':'<span class="st u">Not marked</span>';
          ol.appendChild(el('li',null,'<span class="n">'+num+'</span><span>'+it.t+(it.c?'<span class="c">'+it.c+'</span>':'')+'</span>'+st));});
        res.appendChild(ol);}
      var summary=def.name+': '+fmt(n)+' of '+items.length+' in place ('+c[0]+' in place, '+c[1]+' partly, '+c[2]+' not yet'+(c[3]?', '+c[3]+' not marked':'')+'). '+r.h+
        (gaps.length?'\nOpen items:\n'+gaps.map(function(g){return '- '+g.t+(g.c?' ('+g.c+')':'')+(g.s===1?' [partly]':g.s===2?' [not yet]':' [not marked]');}).join('\n'):'');
      var acts=el('div','acts');
      acts.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(summary);}));
      acts.appendChild(btn(null,'Edit answers',function(){done=false;render();}));
      res.appendChild(acts); body.appendChild(res); root.appendChild(body);
    }
    render();
  }

  var DEFS={ai:AI,bank:BANK,sec:SEC};
  document.querySelectorAll('[data-check]').forEach(function(root){
    var def=DEFS[root.getAttribute('data-check')]; if(!def)return;
    if(def.kind==='quiz')mountQuiz(root,def); else mountChecklist(root,def);
  });
})();

/* dfg.consulting — the three checks.
   Each opens with three questions about you, then the check itself. Every answer shows what it usually means,
   and the result is written for the person who took it. Nothing is stored; state lives in the page. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- who is taking the check ---------- */
  var ROLE={key:'role',q:'Which is closest to you?',o:[['board','Board member or executive sponsor'],['tech','CTO, CIO or head of technology'],['founder','Founder or CEO'],['risk','COO, compliance or risk'],['other','Something else']]};
  var ORG={key:'org',q:'And the company?',o:[['bank','A bank'],['fintech','A fintech'],['corp','A corporate, outside financial services'],['other','Something else']]};
  var ROLE_L={board:'a board member',tech:'a CTO or CIO',founder:'a founder',risk:'a COO or compliance lead',other:'you'};
  var ORG_L={bank:'a bank',fintech:'a fintech',corp:'a corporate',other:'the company'};

  /* ---------- 01 AI readiness ---------- */
  var AI={
    key:'ai', name:'AI readiness assessment', kind:'quiz', total:6, levels:3,
    desk:{key:'desk',q:'What is on your desk right now?',o:[['mandate','A board mandate for AI, and no plan'],['stalled','A pilot that stopped, or never reached production'],['scale','Several use-cases running, and vendors or costs slipping'],['budget','A budget request to defend'],['curious','Nothing dated; I want to know where we stand']]},
    intro:'Each answer is a level from 0 to 3, in ascending order. Choose the line that describes today, not the plan.',
    qs:[
      {d:'Executive ownership',q:'Who is accountable for AI at executive level?',o:[
        'No one is named.','A named executive, without a budget line.','A named executive with a budget line.','A named executive with a budget line, reporting results to the board at least quarterly.'],
        i:['Without a named owner every use-case is an orphan, and plans written for orphans get filed.',
           'A name without a budget line is the commonest state: the mandate exists, the money sits elsewhere, and the first invoice tests it.',
           'Owner and budget in place. The question becomes whether results reach the board before the next budget round.',
           'This is what a board expects and rarely gets. The plan can start with use-cases rather than with governance.'],
        w:'Name an executive owner and a budget line before any use-case is chosen. Without one, the plan has nobody to be handed to.'},
      {d:'Data',q:'How would you describe the data the first use-cases depend on?',o:[
        'Held in separate systems and spreadsheets, reconciled by hand.','Centralised in a warehouse or lake; quality undocumented.','Documented, with named owners and measured quality for the main datasets.','Governed end to end: owners, quality metrics, access controls and lineage.'],
        i:['Reconciled by hand means the first use-case spends its budget on plumbing. Say so in the plan, or the plan lies.',
           'A lake with undocumented quality is where most pilots drown. Someone has to own the two or three datasets that matter.',
           'Documented and owned for the main datasets. Check the ones the first use-cases actually need; they are rarely the main ones.',
           'Governed end to end is rare outside regulated data teams. The remaining risk is a use-case that needs data nobody governs yet.'],
        w:'Ownership and quality for the two or three datasets the first use-cases need. Not the whole estate; the part the plan depends on.'},
      {d:'Use-case selection',q:'How far has the list of candidate use-cases been worked?',o:[
        'There is no list, or a long one nobody has costed.','A shortlist with rough value estimates only.','A ranked shortlist: value, feasibility, and a named business owner for each.','A ranked, owned shortlist, sequenced against delivery capacity and the data that exists.'],
        i:['Thirty candidates nobody has costed is a wish list. Ranking them by value and feasibility usually leaves two.',
           'Value estimates without feasibility produce the pilot that looks best and ships last.',
           'A ranked, owned shortlist is what a board can fund. The next question is sequence against delivery capacity.',
           'Sequenced against capacity and data, the shortlist is a plan. The work is holding it against vendor promises.'],
        w:'Ranking the candidates by value and feasibility, with a named owner each. This usually takes a list of thirty to a list of two.'},
      {d:'Production record',q:'How many AI use-cases are in production today?',o:[
        'None. Individual staff use chat tools.','None. One or more pilots ran and stopped.','One, without measured results.','One or more, with results measured and reported to the sponsor.'],
        i:['Staff using chat tools is not a programme, but it is evidence of appetite. Nothing is measured yet.',
           'Pilots that ran and stopped are the most expensive state: budget spent, scepticism bought. The next one has to reach production.',
           'One in production without measured results cannot defend its own budget. Instrument it before starting the second.',
           'Measured results reported to a sponsor is the bar. The risk is now scale, not proof.'],
        w:'Taking one use-case to production with a measured result, so the board sees evidence before the next budget round.'},
      {d:'Engineering',q:'Who would build and run the first use-case?',o:[
        'Vendors build and run it; no one in-house owns it.','Vendors build; an in-house owner runs the contract and the operations, without ML or LLM delivery experience.','An in-house team that has shipped one ML or LLM feature, with vendor support.','An in-house team that ships and operates ML or LLM features, with monitoring and on-call.'],
        i:['When vendors build and run it and nobody in-house owns it, the vendor owns you. The contract needs exit and knowledge transfer written in.',
           'An in-house owner without delivery experience can run a vendor, if the terms let them operate what is delivered.',
           'One feature shipped with vendor support is enough to judge build against buy honestly.',
           'A team that ships and operates with monitoring and on-call can take a use-case to production on its own. Governance is the constraint.'],
        w:'Deciding what is built in-house and what is bought, and setting vendor terms so the team can operate it afterwards.'},
      {d:'Governance',q:'What is the policy on AI use?',o:[
        'No policy. Decisions are made case by case.','A policy that restricts use, with no route to approval.','A policy with a defined review path for new use-cases.','A review path, a model inventory, and an assessment record for each use-case in production.'],
        i:['Case by case works until an auditor, a regulator or a customer asks how a decision was made.',
           'A policy that only restricts sends use into the shadows and pilots into the vendor\'s cloud. It needs a route to yes.',
           'A review path is the minimum. The question is how long it takes; quarters kill use-cases.',
           'Review path, model inventory and assessment records are what a regulator\'s AI guidance asks for. Keep it proportionate.'],
        w:'A review path that approves a use-case in weeks rather than quarters, with a record an auditor can read.'}
    ],
    read:function(s){
      if(s<=6)return{h:'Foundations first.',p:'The plan should begin with ownership and data, not with models. The first two weeks of a Diagnosis would go on who owns what, where the data is, and which two use-cases justify fixing it.'};
      if(s<=12)return{h:'Ready for a shortlist.',p:'The foundations are partly there. The work now is choosing two use-cases by value and feasibility, and taking one to production with a measured result before the next budget conversation.'};
      return{h:'Ready to scale.',p:'The question is how to run three or four use-cases at once without losing control of vendors, cost and risk. A Diagnosis here would concentrate on governance, vendor oversight and the delivery plan.'};
    },
    tailor:function(p,r){
      var band=r.score<=6?'low':r.score<=12?'mid':'high', low=r.lowQ;
      var role={
        board:{low:'For the board paper: the honest line is that the foundations are not there yet. The first ask is an owner, a budget line and two use-cases, not a platform.',
               mid:'For the board paper: fund two use-cases, name their owners, and ask for a measured result in six months. That is a request a board can approve and hold you to.',
               high:'For the board paper: the question is scale and control. Ask for the governance and the vendor oversight before the third use-case, not after.'},
        tech:{low:'First fix, '+low.d.toLowerCase()+': '+low.w+' Nothing built on top survives without it.',
              mid:'First fix, '+low.d.toLowerCase()+': '+low.w+' Then one use-case to production with a measured result before the budget conversation.',
              high:'You are past the readiness question. The risk now is vendors, cost and control across several use-cases, which is a delivery-oversight problem, not a technology one.'},
        founder:{low:'At this stage the work is yours: name who owns AI, find the two datasets that matter, and pick two use-cases. Nobody should be paid to tell you that.',
                 mid:'Pick the one use-case with a customer on the other end and take it to production with a number attached. Investors and enterprise customers ask for the number, not the roadmap.',
                 high:'The programme is real. What enterprise customers will ask next is how it is governed; the model inventory and the review path are now sales documents.'},
        risk:{low:'From the second line: there is nothing yet to govern, which is the moment to set the review path, before the first vendor arrives with its own.',
              mid:'From the second line: insist on the assessment record for the first production use-case now. Retrofitting it under audit costs a quarter.',
              high:'From the second line: the model inventory and the assessment records are what an auditor or regulator will sample first. Make them proportionate and current.'},
        other:{low:'Start with '+low.d.toLowerCase()+': '+low.w,mid:'The next move is one use-case to production with a measured result, and '+low.d.toLowerCase()+' fixed alongside it.',high:'The next move is governance and vendor oversight across the use-cases already running.'}};
      var org={bank:'In a bank the review path and the model inventory are what the regulator asks about first; build them alongside the first use-case, not after it.',
               fintech:'In a fintech the fastest route is one narrow use-case on data you already own. Enterprise customers will ask how the model is governed before they ask what it does.',
               corp:'Outside financial services the constraint is rarely governance. It is data ownership across business units, and vendors who sell platforms rather than results.',
               other:''};
      var desk={mandate:'A mandate with no plan is the right moment for a Diagnosis. The wrong moment is after a vendor has been chosen.',
                stalled:'A stopped pilot usually failed on data ownership or on nobody owning the result. The next one needs a measured target before it starts.',
                scale:'With several use-cases running, a Diagnosis concentrates on governance and vendor oversight rather than readiness.',
                budget:'A budget request holds if it names two use-cases, their owners, and the result the board will see in six months.',
                curious:'Knowing where you stand is enough for now. Run the check again when there is a mandate or a budget.'};
      var need=(band==='high'&&r.ans[4]>=2)?'Do you need us? Probably not for a Diagnosis. The work you need is delivery oversight and governance, and you may already have both. If you want a second pair of eyes for two weeks, that is the whole scope.'
        :band==='low'?'Do you need us? Not yet for delivery. An owner, a budget line and a ranked list are things a good executive can produce in a month. A Diagnosis makes sense once that owner exists and needs a plan the board will approve.'
        :'Do you need us? This is the situation a Diagnosis is for: two weeks to rank the use-cases, check the data and the vendors they depend on, and write a plan with owners and budget bands.';
      return {k:'For '+ROLE_L[p.role]+' at '+ORG_L[p.org],p:role[p.role][band]+' '+org[p.org],d:desk[p.desk],need:need};
    }
  };

  /* ---------- 02 Bank onboarding evidence ---------- */
  var TRI=['In place','Partly','Not yet'];
  var BANK={
    key:'bank', name:'Bank onboarding evidence', kind:'list',
    desk:{key:'desk',q:'What is the review?',o:[['sponsor','A sponsor bank or banking-as-a-service partner'],['network','A card network or scheme application'],['enterprise','An enterprise customer\'s due diligence'],['prep','Nothing dated yet; preparing']]},
    title:'Mark each item as it stands today.',
    intro:'In place means the document exists and is current. Partly means it exists but is out of date or incomplete. The first three groups are the ones a review stops on.',
    gate:['Entity and ownership','Regulatory and licensing','Financial crime'],
    groups:[
      ['Entity and ownership',[
        ['Corporate documents: incorporation, shareholder and UBO chart, directors and their fit-and-proper status, source of funds','','The reviewer wants the shareholder chart down to natural persons, and will screen the directors against sanctions and PEP lists themselves.']]],
      ['Regulatory and licensing',[
        ['Written confirmation of regulatory status in each market: licence, registration, or a legal opinion on exemption','','A licence number or a dated legal opinion, per market. "We are applying" is not a status.'],
        ['A register of regulatory obligations, with an owner and a change log','','The rules you are subject to, each with an owner and a record of changes. Most fintechs have the policies and not the register.']]],
      ['Financial crime',[
        ['AML and KYC programme documented, with a named MLRO or compliance officer','','The programme plus the MLRO\'s name and appointment. The reviewer asks whether the MLRO reports to the board.'],
        ['Business-wide risk assessment, customer risk rating, transaction monitoring and suspicious-activity reporting, with records','','The risk assessment dated within the year, the customer risk model, and evidence of alerts handled and reports filed. A policy without alerts is partly.'],
        ['Sanctions and PEP screening in operation, with records of alerts handled','','Screening at onboarding and ongoing, with the log of hits and the decisions taken. The reviewer samples the log, not the policy.']]],
      ['Information security',[
        ['SOC 2 Type II or ISO 27001 certificate, or a dated audit plan the bank can review','','A certificate, or a signed audit plan with dates. A gap assessment is not an audit plan.'],
        ['PCI DSS scope and attestation, where card data is touched','','The scope statement and the attestation for that scope. If you never touch card data, say so in writing, with the architecture to prove it.'],
        ['Penetration test report from the last twelve months, with remediation status','','The report, the retest, and the status of each finding. A report with open highs is worse than no report.']]],
      ['Data and privacy',[
        ['Data-flow map and a data-residency position for each market','','Where personal and transaction data is stored and processed, per market, with the residency position in writing.'],
        ['Privacy notices and a data-processing agreement template the bank\'s counsel can mark up','','The public notices and a DPA template. Reviews stall on the DPA, not on the notice.']]],
      ['Operational resilience',[
        ['Incident-response and business-continuity plans, tested in the last twelve months','','Both plans and the record of the last test, with findings. Tested means a dated exercise with names.'],
        ['Critical third parties listed (cloud, KYC vendor, processors), each with its own assurance on file','','The list, and each provider\'s own assurance: SOC 2, ISO, or a completed questionnaire. The bank\'s outsourcing rules apply to your outsourcing too.']]],
      ['Financial standing',[
        ['Audited or reviewed accounts, with twelve months of runway shown','','Accounts and a runway statement. Pre-revenue is acceptable; unexplained is not.']]],
      ['Technology',[
        ['Integration architecture written down: APIs, environments, responsibilities, and the change process','','Diagram, environments, who is responsible for what, and how changes are approved. The bank\'s technology team reads this before anyone else.']]]
    ],
    read:function(n,t,hard){
      if(hard>0)return{h:hard===1?'One hard stop open.':hard+' hard stops open.',p:'A bank’s review opens with who you are, your regulatory status and the financial-crime programme, and stops at the first of those it cannot see. However complete the rest is, the file does not open until the items marked below in the first three groups are in place. Those are usually the first four to six weeks of work; the detail differs by regulator.'};
      if(n>=t*0.75)return{h:'Ready to open the conversation.',p:'The hard stops are in place and most of what a sponsor bank’s third-party review asks for exists. The open items below set the length of onboarding, not whether it happens.'};
      return{h:'The file opens. The rest sets the timeline.',p:'Who you are, your regulatory status and the financial-crime programme are in place, so a bank will open the review. The security, data, resilience and technology items below decide how long it takes; prepare them in this order.'};
    },
    tailor:function(p,r){
      var desk={sponsor:'A sponsor bank\'s review runs in the order of this list and opens with the first three groups.',
                network:'A scheme application weighs security and financial standing more heavily; PCI DSS scope and the attestation move to the front.',
                enterprise:'An enterprise customer\'s due diligence is a security and privacy review with a procurement wrapper; the information-security and data groups decide it.',
                prep:'Preparing before a date is the cheap way to do this. Most of the list takes weeks to produce and days to review.'};
      var role={board:'For the board: the hard stops are the schedule. Nothing else on the list moves the date.',
                tech:'Your groups are information security, data and technology, and they are prepared in parallel with the compliance items, not after them.',
                founder:'The first two groups are usually the founder\'s job: entity documents and regulatory status. The AML programme needs a named person before it needs a document.',
                risk:'You will be the reviewer\'s main contact. The logs matter more than the policies; start collecting the evidence now.',
                other:'Work the list from the top. The order is the bank\'s, not ours.'};
      var org={bank:'If you are the bank in this picture, this is the list your third-party team already uses; the gaps are what your fintech partners will bring you.',fintech:'',corp:'For a corporate launching a financial product, the entity and regulatory items are the unfamiliar ones, and the ones that take longest.',other:''};
      var need=r.hard>0?'Do you need us? The hard stops are the work. If nobody in-house has written an AML programme or obtained a regulatory opinion, that is where an adviser earns the fee. The rest of the list you can prepare yourselves, with this as the checklist.'
        :r.n>=r.t*0.75?'Do you need us? Probably not for the review itself. Where we add something is sitting alongside it and answering the bank\'s follow-up questions in the order they come.'
        :'Do you need us? For the sequencing, perhaps. The items are known; the order and the evidence standard are what stall reviews.';
      return {k:'For '+ROLE_L[p.role]+' at '+ORG_L[p.org],p:role[p.role]+' '+org[p.org],d:desk[p.desk],need:need};
    }
  };

  /* ---------- 03 ISO 27001 control check ---------- */
  var SEC={
    key:'sec', name:'ISO 27001 control check', kind:'list',
    desk:{key:'desk',q:'Why now?',o:[['quest','A customer\'s security questionnaire'],['first','A first ISO 27001 certification'],['soc2','SOC 2, alongside or instead'],['recert','A surveillance or recertification audit'],['posture','No audit dated; I want to know where we stand']]},
    title:'Mark each item as it stands today.',
    intro:'In place means written, operating, and evidenced. Partly means one of those three is missing. The first two items are what a Stage 1 audit opens with; the rest are the Annex A controls sampled first.',
    groups:[
      ['Management system',[
        ['Scope, risk assessment and risk treatment plan, current and approved','Cl. 4.3, 6.1.2','The auditor reads the scope first and the risk assessment second. A risk register without treatment decisions and dates is partly.'],
        ['Statement of Applicability, with a justification for every included and excluded control','Cl. 6.1.3','Every control included or excluded with a reason. "Not applicable" without a reason is a finding on day one.']]],
      ['Organisational controls',[
        ['Information security policy approved by management and reviewed within the last year','A.5.1','Approved with a date, and reviewed within the year. The auditor asks who approved it and when it was last read.'],
        ['Inventory of information and associated assets, each with a named owner','A.5.9','Systems, data and devices, each with a named owner. The auditor picks three at random and asks the owners.'],
        ['Access control policy, with identity and access-rights procedures for joiners, movers and leavers','A.5.15, A.5.18','The policy, plus evidence of a leaver removed on time. One leaver with access still open is a major.'],
        ['Supplier security requirements in agreements, with a supplier register','A.5.19, A.5.20','Security clauses in the contracts and a register of who holds your data. The auditor asks for the contract of your largest cloud or SaaS provider.'],
        ['Cloud services: security requirements, and the responsibilities split with each provider','A.5.23','What you are responsible for and what the provider is, per service. A shared-responsibility diagram is evidence; the provider\'s marketing page is not.'],
        ['Incident management plan with roles, escalation and a contact list','A.5.24','Roles, escalation, contacts, and the record of the last incident or exercise. The auditor asks what happened the last time something went wrong.']]],
      ['People controls',[
        ['Security awareness training for all staff in the last year, with attendance records','A.6.3','Who attended, when, and what. A slide deck without an attendance list is partly.']]],
      ['Technological controls',[
        ['Privileged access restricted, logged and reviewed quarterly','A.8.2','The list of privileged accounts and the record of the last quarterly review. The auditor samples the review, not the list.'],
        ['Multi-factor authentication on email, cloud consoles and remote access','A.8.5','Everywhere, including the console of every cloud provider and every remote path. One admin without MFA is a finding.'],
        ['Vulnerability management with defined patch windows and evidence of closure','A.8.8','Patch windows defined, and evidence of a critical patched within the window. Scanner output alone is not closure.'],
        ['Backups taken, tested by restore, and stored separately','A.8.13','The date of the last restore test and who signed it. A backup job log is not evidence of restore.'],
        ['Logging enabled on critical systems, protected from change and reviewed','A.8.15','Which systems log, where the logs go, who reviews them, and that they cannot be edited. The auditor asks for a review record.']]]
    ],
    read:function(n,t){
      if(n>=t*0.8)return{h:'Ready for Stage 1 on paper.',p:'The documents a Stage 1 opens with and the controls sampled first exist. What remains is evidence: records that show each control operating over time, not only a document saying it should. Expect minor findings; the aim is no majors at Stage 2.'};
      if(n>=t*0.4)return{h:'Half the items. Gaps in audit order.',p:'An auditor works from the risk assessment and the Statement of Applicability to policy, inventory and access, then to the technical controls. The open items below follow that order; the first is the one to close first.'};
      return{h:'Start with the risk assessment, then policy, inventory and access.',p:'The technical controls depend on knowing what you hold, what you have decided to protect, and who can reach it. The open items are in the order an assessment would take them.'};
    },
    tailor:function(p,r){
      var desk={quest:'A questionnaire is answered from the same evidence an auditor samples. With this gap list you can answer honestly and say which items have dates.',
                first:'A first certification runs Stage 1 on the management-system items, then Stage 2 on the controls. Close the first two items first or Stage 1 stops.',
                soc2:'SOC 2 maps onto most of this list; the differences are the trust services criteria and the observation period. Build the evidence once and use it twice.',
                recert:'A surveillance audit samples what changed and what was found last time. Closed findings with evidence are the first thing the auditor asks for.',
                posture:'Without a date, use this as the order of work. The first four items are usually the cheapest to close and the ones that decide an audit.'};
      var role={board:'For the board: the certificate is the visible outcome, but the questionnaire from your largest customer is the deadline that matters.',
                tech:'The technological controls are usually the easiest for you to close. The management-system items are the ones that need a document owner.',
                founder:'At an early stage a certificate is rarely needed; a completed questionnaire with honest dates usually is. Do the evidence, defer the audit.',
                risk:'The management-system items are yours; the technical evidence comes from engineering. Agree who owns each item before the auditor asks.',
                other:'Work the list from the top; it is the auditor\'s order.'};
      var org={bank:'In a bank most of this exists somewhere; the work is proving it operates in the scope the auditor will sample.',fintech:'For a fintech the supplier and cloud items carry the most weight: your customers\' data sits with your providers.',corp:'For a corporate the inventory and access items are where the estate is usually larger than anyone has written down.',other:''};
      var need=r.n>=r.t*0.8?'Do you need us? Probably not for the audit. A pre-audit review of the evidence, two weeks, is the most we would suggest.'
        :r.n>=r.t*0.4?'Do you need us? For the order and the evidence standard. The gap list is known; what stalls audits is closing items in the wrong order and calling a document in place.'
        :'Do you need us? Not for the first items. Scope, the risk assessment and the Statement of Applicability are management decisions; an adviser can draft them, but the decisions are yours. A Diagnosis makes sense once they exist.';
      return {k:'For '+ROLE_L[p.role]+' at '+ORG_L[p.org],p:role[p.role]+' '+org[p.org],d:desk[p.desk],need:need};
    }
  };

  /* ---------- rendering ---------- */
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function arrow(){return '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" stroke-width="2"/></svg>';}
  function btn(cls,html,fn){var b=el('button',cls,html);b.type='button';if(fn)b.addEventListener('click',fn);return b;}
  function header(def,stepText,progress){var b=el('div','bar');b.appendChild(el('span','name',def.name));b.appendChild(el('span','step',stepText));var t=el('div','track');var i=el('i');i.style.width=Math.round(progress*100)+'%';t.appendChild(i);var f=document.createDocumentFragment();f.appendChild(b);f.appendChild(t);return f;}
  function chips(group,val,onpick){var g=el('div','chips');g.setAttribute('role','radiogroup');g.setAttribute('aria-label',group.q);
    group.o.forEach(function(o){var b=btn('chip'+(val===o[0]?' on':''),o[1],function(){[].forEach.call(g.children,function(x){x.classList.remove('on');x.setAttribute('aria-checked','false');});b.classList.add('on');b.setAttribute('aria-checked','true');onpick(o[0]);});b.setAttribute('role','radio');b.setAttribute('aria-checked',val===o[0]?'true':'false');g.appendChild(b);});return g;}

  /* hands the result to the form on the same page, visibly, as text the visitor can edit */
  function send(text){var form=document.getElementById('contactForm');if(!form)return;var ta=form.querySelector('textarea[name=problem]');
    var cur=ta.value.replace(/\n*\[Check result\][\s\S]*$/,'').replace(/\s+$/,'');ta.value=(cur?cur+'\n\n':'')+'[Check result]\n'+text;
    var c=document.getElementById('contact');if(c)c.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});setTimeout(function(){ta.focus({preventScroll:true});},reduce?0:500);}
  function sendbar(root,summary){removeBar();var bar=el('div','sendbar');bar.id='sendbar';bar.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(summary);}));document.body.appendChild(bar);
    var c=document.getElementById('contact');if(c&&'IntersectionObserver' in window){bar._io=new IntersectionObserver(function(es){bar.classList.toggle('off',es[0].isIntersecting);},{threshold:0.1});bar._io.observe(c);}}
  function removeBar(){var b=document.getElementById('sendbar');if(b){if(b._io)b._io.disconnect();b.remove();}}
  function profileText(p,def){var d=def.desk.o.filter(function(o){return o[0]===p.desk;})[0];return 'Role: '+ROLE.o.filter(function(o){return o[0]===p.role;})[0][1]+'. Company: '+ORG.o.filter(function(o){return o[0]===p.org;})[0][1]+'. On the desk: '+(d?d[1]:'')+'.';}

  function intake(root,def,p,onDone,stepText){
    root.innerHTML='';root.appendChild(header(def,stepText,0));
    var body=el('div','body step-in');body.appendChild(el('div','dim','Before the check'));body.appendChild(el('h3','q','Three things about you, so the result is written for you.'));
    var next;function check(){next.disabled=!(p.role&&p.org&&p.desk);}
    [ROLE,ORG,def.desk].forEach(function(g){body.appendChild(el('p','ql',g.q));body.appendChild(chips(g,p[g.key],function(v){p[g.key]=v;check();}));});
    root.appendChild(body);
    var foot=el('div','foot');foot.appendChild(el('span','note','Nothing is stored. This only shapes the result.'));var nav=el('div','nav');next=btn('pri','Start the check '+arrow(),onDone);nav.appendChild(next);foot.appendChild(nav);root.appendChild(foot);check();
  }

  function mountQuiz(root,def){
    var i=-1,ans=[],p={};
    function render(){
      root.innerHTML='';removeBar();
      if(i<0)return intake(root,def,p,function(){i=0;render();},'Before the check');
      if(i>=def.total){root.appendChild(header(def,'Result',1));return result();}
      root.appendChild(header(def,'Question '+(i+1)+' of '+def.total,i/def.total));
      var body=el('div','body step-in'),q=def.qs[i];
      body.appendChild(el('div','dim',q.d));body.appendChild(el('h3','q',q.q));if(i===0)body.appendChild(el('p','hint',def.intro));
      var opts=el('div','opts');opts.setAttribute('role','radiogroup');opts.setAttribute('aria-label',q.q);var next,ins=el('div','ins');ins.hidden=true;
      q.o.forEach(function(t,idx){var b=btn('opt'+(ans[i]===idx?' sel':''),'<span class="r"></span><span>'+t+'</span>',function(){ans[i]=idx;[].forEach.call(opts.children,function(x,j){x.classList.toggle('sel',j===idx);x.setAttribute('aria-checked',j===idx?'true':'false');});
          ins.innerHTML='<span class="k">What this usually means</span>'+q.i[idx];ins.hidden=false;next.disabled=false;});
        b.setAttribute('role','radio');b.setAttribute('aria-checked',ans[i]===idx?'true':'false');opts.appendChild(b);});
      body.appendChild(opts);if(ans[i]!=null){ins.innerHTML='<span class="k">What this usually means</span>'+q.i[ans[i]];ins.hidden=false;}body.appendChild(ins);root.appendChild(body);
      var foot=el('div','foot');foot.appendChild(el('span','note',i<def.total-1?'Levels rise from top to bottom.':'Last question. The result follows.'));
      var nav=el('div','nav');var back=btn(null,'Back',function(){i--;render();});
      next=btn('pri',(i<def.total-1?'Next':'See the result')+' '+arrow(),function(){if(ans[i]==null)return;i++;render();root.scrollIntoView({behavior:'auto',block:'nearest'});});next.disabled=ans[i]==null;
      nav.appendChild(back);nav.appendChild(next);foot.appendChild(nav);root.appendChild(foot);
    }
    function result(){
      var score=ans.reduce(function(a,b){return a+b;},0),max=def.total*def.levels,r=def.read(score);
      var low=0;ans.forEach(function(a,k){if(a<ans[low])low=k;});var lowQ=def.qs[low];
      var T=def.tailor(p,{score:score,max:max,lowQ:lowQ,ans:ans});
      var body=el('div','body step-in'),res=el('div','res');
      res.appendChild(el('div','score','<b>'+score+'</b><span>of '+max+' across six dimensions</span>'));
      res.appendChild(el('h4',null,r.h));res.appendChild(el('p',null,r.p));
      var prof=el('div','prof');def.qs.forEach(function(q,k){prof.appendChild(el('div','prow'+(k===low?' low':''),'<span class="l">'+q.d+'</span><span class="b"><i class="'+(ans[k]>=1?'on':'')+'"></i><i class="'+(ans[k]>=2?'on':'')+'"></i><i class="'+(ans[k]>=3?'on':'')+'"></i></span><span class="v">'+ans[k]+' of 3</span>'));});res.appendChild(prof);
      res.appendChild(el('div','foryou','<span class="k">'+T.k+'</span><p>'+T.p+'</p><p>'+T.d+'</p><p class="need">'+T.need+'</p>'));
      res.appendChild(el('div','first','<span class="k">Where a Diagnosis would start &middot; '+lowQ.d+'</span>'+lowQ.w));
      var summary=profileText(p,def)+'\n'+def.name+': '+score+' of '+max+'. '+r.h+'\n'+def.qs.map(function(q,k){return '- '+q.d+': '+ans[k]+' of 3';}).join('\n')+'\nLowest dimension: '+lowQ.d+'.';
      var acts=el('div','acts');acts.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(summary);}));acts.appendChild(btn(null,'Start again',function(){i=-1;ans=[];p={};render();}));
      res.appendChild(acts);body.appendChild(res);root.appendChild(body);sendbar(root,summary);
    }
    render();
  }

  function mountChecklist(root,def){
    var items=[];def.groups.forEach(function(g){g[1].forEach(function(it){items.push({t:it[0],c:it[1]||'',n:it[2]||'',g:g[0],s:-1});});});
    var stage=0,p={};
    function marked(){return items.filter(function(it){return it.s>=0;}).length;}
    function score(){return items.reduce(function(a,it){return a+(it.s===0?1:it.s===1?0.5:0);},0);}
    function fmt(n){return (n%1?n.toFixed(1):String(n));}
    function tally(){var c=[0,0,0,0];items.forEach(function(it){c[it.s<0?3:it.s]++;});return c;}
    function footText(){var m=marked();return m?fmt(score())+' of '+items.length+' in place &middot; '+m+' of '+items.length+' marked':'Nothing marked yet';}
    function render(){
      root.innerHTML='';removeBar();
      if(stage===0)return intake(root,def,p,function(){stage=1;render();},'Before the check');
      if(stage===2){root.appendChild(header(def,'Result',1));return result();}
      root.appendChild(header(def,items.length+' items',marked()/items.length));
      var body=el('div','body step-in');body.appendChild(el('h3','q',def.title));body.appendChild(el('p','hint',def.intro));
      var list=el('div','list'),lastG=null,go,note;
      items.forEach(function(it){
        if(it.g!==lastG){list.appendChild(el('div','grp',it.g));lastG=it.g;}
        var row=el('div','row');row.appendChild(el('span','t',it.t+(it.c?'<span class="c">'+it.c+'</span>':'')));
        var seg=el('div','seg');seg.setAttribute('role','radiogroup');seg.setAttribute('aria-label',it.t);
        var ins=el('div','ins rowins');ins.hidden=it.s<0;if(it.s>=0)ins.innerHTML='<span class="k">What the reviewer asks for</span>'+it.n;
        TRI.forEach(function(lab,si){var b=btn('s'+si+(it.s===si?' on':''),lab,function(){it.s=si;[].forEach.call(seg.children,function(x,j){x.className='s'+j+(j===si?' on':'');x.setAttribute('aria-checked',j===si?'true':'false');});
            root.querySelector('.track i').style.width=Math.round(marked()/items.length*100)+'%';note.innerHTML=footText();go.disabled=marked()===0;ins.innerHTML='<span class="k">What the reviewer asks for</span>'+it.n;ins.hidden=false;});
          b.setAttribute('role','radio');b.setAttribute('aria-checked',it.s===si?'true':'false');seg.appendChild(b);});
        row.appendChild(seg);list.appendChild(row);list.appendChild(ins);
      });
      body.appendChild(list);root.appendChild(body);
      var foot=el('div','foot');note=el('span','note',footText());foot.appendChild(note);
      var nav=el('div','nav');nav.appendChild(btn(null,'Back',function(){stage=0;render();}));go=btn('pri','See the gaps '+arrow(),function(){stage=2;render();root.scrollIntoView({behavior:'auto',block:'nearest'});});go.disabled=marked()===0;nav.appendChild(go);foot.appendChild(nav);root.appendChild(foot);
    }
    function result(){
      var n=score(),c=tally(),hard=def.gate?items.filter(function(it){return def.gate.indexOf(it.g)>=0&&it.s!==0;}).length:0,r=def.read(n,items.length,hard);
      var T=def.tailor(p,{n:n,t:items.length,hard:hard});
      var body=el('div','body step-in'),res=el('div','res');
      res.appendChild(el('div','score','<b>'+fmt(n)+'</b><span>of '+items.length+' in place</span>'));
      var segs=el('div','segs');items.forEach(function(_,k){var s=el('i');if(k<Math.floor(n))s.className='on';else if(k<n)s.className='half';segs.appendChild(s);});res.appendChild(segs);
      res.appendChild(el('div','tally','<span><b>'+c[0]+'</b> in place</span><span><b>'+c[1]+'</b> partly</span><span><b>'+c[2]+'</b> not yet</span>'+(c[3]?'<span><b>'+c[3]+'</b> not marked</span>':'')));
      res.appendChild(el('h4',null,r.h));res.appendChild(el('p',null,r.p+(c[3]?' Items left unmarked are listed as open.':'')));
      res.appendChild(el('div','foryou','<span class="k">'+T.k+'</span><p>'+T.p+'</p><p>'+T.d+'</p><p class="need">'+T.need+'</p>'));
      var gaps=items.filter(function(it){return it.s!==0;});
      if(gaps.length){var ol=el('ol'),lastG=null,num=0;gaps.forEach(function(it){if(it.g!==lastG){ol.appendChild(el('li','g',it.g));lastG=it.g;}num++;
          var st=it.s===1?'<span class="st p">Partly</span>':it.s===2?'<span class="st">Not yet</span>':'<span class="st u">Not marked</span>';
          ol.appendChild(el('li',null,'<span class="n">'+num+'</span><span>'+it.t+(it.c?'<span class="c">'+it.c+'</span>':'')+'<span class="ask">'+it.n+'</span></span>'+st));});res.appendChild(ol);}
      var summary=profileText(p,def)+'\n'+def.name+': '+fmt(n)+' of '+items.length+' in place ('+c[0]+' in place, '+c[1]+' partly, '+c[2]+' not yet'+(c[3]?', '+c[3]+' not marked':'')+'). '+r.h+(gaps.length?'\nOpen items:\n'+gaps.map(function(g){return '- '+g.t+(g.c?' ('+g.c+')':'')+(g.s===1?' [partly]':g.s===2?' [not yet]':' [not marked]');}).join('\n'):'');
      var acts=el('div','acts');acts.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(summary);}));acts.appendChild(btn(null,'Edit answers',function(){stage=1;render();}));
      res.appendChild(acts);body.appendChild(res);root.appendChild(body);sendbar(root,summary);
    }
    render();
  }

  var DEFS={ai:AI,bank:BANK,sec:SEC};
  document.querySelectorAll('[data-check]').forEach(function(root){var def=DEFS[root.getAttribute('data-check')];if(!def)return;if(def.kind==='quiz')mountQuiz(root,def);else mountChecklist(root,def);});
})();

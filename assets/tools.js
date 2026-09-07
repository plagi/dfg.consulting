/* dfg.consulting — three diagnostics.
   Each is the first ten minutes of a Diagnosis: the next question depends on the last answer, every answer says
   what it usually means, and the result is written from the answers: findings, the questions you will be asked,
   the order of work with weeks, and a straight answer on whether you need us. Nothing is stored. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function O(v,t,i,f,w,tag){return {v:v,t:t,i:i,f:f,w:w||0,tag:tag||null};}
  var LV=function(d,q,o,tags){return {id:d.toLowerCase().replace(/[^a-z]+/g,'-'),k:d,q:q,o:o.map(function(x,n){return O(String(n),x[0],x[1],x[2],x[3]||0,tags?tags[n]:null);})};};

  /* ================= 01 AI: a branching diagnosis ================= */
  var AI_STEPS={
    situation:{id:'situation',k:'Where you are',q:'What is on your desk right now?',o:[
      O('mandate','A board mandate for AI, and no plan','The commonest starting point in banks and corporates. Mandates arrive from peers, regulators and vendor demos; plans arrive from an owner with a budget line.','A mandate without a plan, an owner or a budget line.',3),
      O('stalled','A pilot that stopped, or never reached production','The most expensive state: budget spent, scepticism bought. Why it stopped decides what to do next.','A pilot that did not reach production.',3),
      O('scale','Several use-cases running, and vendors or costs slipping','Past the readiness question. The risk is now control: vendors, cost, and a review queue that takes quarters.','Several use-cases in production without programme-level control.',3),
      O('budget','A budget request to defend','A budget holds when it names two use-cases, their owners, and the result the board will see in six months.','A budget request that has to survive the board.',2),
      O('curious','Nothing dated. I want to know where we stand','Fair. Three questions on the foundations say more than a maturity score.','No dated pressure; a foundations question.',1)]},
    source:{id:'source',k:'The mandate',q:'Where did the mandate come from?',o:[
      O('peers','Peers and the press: the board does not want to be last','The weakest mandate and the most common. It funds a demo, not a programme, unless someone turns it into a use-case with a number.','The mandate is defensive; it will fund a demo unless it is turned into a use-case with a number.',2,'shortlist'),
      O('regulator','A regulator, a customer or a partner asked what we are doing','A mandate with a questioner behind it. The plan needs a governance answer before a technology one.','There is a questioner behind the mandate; governance has to be answered before technology.',3,'review'),
      O('vendor','A vendor demo, or a platform already bought','The plan is being written backwards from a tool. A Diagnosis usually finds the tool fits one use-case of the five it was bought for.','The plan is being written backwards from a tool.',3,'shortlist'),
      O('ceo','The CEO believes in it and wants a plan','The best mandate, if it comes with a budget line. Without one, it is a speech.','The mandate has conviction behind it; it needs a budget line to be a programme.',1,'owner')]},
    owner:{id:'owner',k:'Ownership',q:'Who has been asked to answer it?',o:[
      O('cio','The CIO or CTO','Right person for delivery, wrong person to choose the use-cases alone. The business owners have to be in the room.','Technology owns the answer; the business owners of the use-cases are not yet named.',2,'shortlist'),
      O('head','A new head of AI or data','A hire before a plan. The first ninety days go on the plan they were hired to execute.','A head of AI was hired before the plan they are meant to execute.',2,'shortlist'),
      O('committee','A committee','Committees rank; they do not own. Something ships when one name is on it.','A committee holds the mandate; nothing ships until one name does.',3,'owner'),
      O('nobody','Nobody yet','Then the first move is a name, not a plan.','No one is accountable for AI at executive level.',4,'owner')]},
    budget:{id:'budget',k:'Money',q:'And the money?',o:[
      O('none','No budget','A mandate without money is an opinion.','There is no budget line; the mandate is an opinion until there is.',4,'owner'),
      O('number','A number has been mentioned, no line yet','The first invoice tests it. Get the line before choosing the vendor.','A number has been mentioned but no budget line exists; the first invoice will test it.',3,'owner'),
      O('line','A line in next year\'s plan','Workable. The Diagnosis has to be done before the plan is locked, or the line funds the wrong thing.','A budget line exists for next year; the ranking has to be done before the plan locks.',2,'shortlist'),
      O('approved','Approved and ring-fenced','Rare. Spend the first two weeks on ranking, not on procurement.','Budget is approved; the risk is spending it on procurement before ranking.',1,'shortlist')]},
    why:{id:'why',k:'The pilot',q:'What stopped it?',o:[
      O('data','The data could not be got, or could not be trusted','Nobody owned the dataset. The commonest cause, and the cheapest to fix, if it is fixed before the next pilot.','The pilot failed on data nobody owned.',4,'data'),
      O('measure','It ran, but nobody could say what it was worth','No target before the start means no result after. The next one needs a number agreed in writing on day one.','The pilot had no measured target, so it could not defend itself.',3,'target'),
      O('owner','The pilot team moved on and nobody took it over','Ownership ended with the project. Production needs an owner who was there before the pilot and stays after.','Ownership ended with the project team.',3,'owner'),
      O('vendor','Vendor cost, lock-in or a contract that could not scale','The pilot price was not the production price. Terms need exit, volume pricing and operability written in.','The vendor terms did not survive contact with production.',3,'vendor'),
      O('risk','Risk, compliance or legal blocked it','A policy without a route to approval. The review path is the fix, not a different model.','Risk or compliance blocked production because there was no review path to approval.',3,'review')]},
    builder:{id:'builder',k:'The pilot',q:'Who built it?',o:[
      O('vendorb','A vendor','Fine for a pilot. For production, someone in-house has to be able to run it.','The pilot was vendor-built; nobody in-house can run it in production.',2,'vendor'),
      O('inhouse','An in-house team','Good evidence of capability. The gap is usually ownership and data, not engineering.','In-house engineering exists; the gap is ownership and data, not capability.',0),
      O('mix','A mix','Ask who holds the code, the prompts and the evaluation set. That is who owns it.','Ownership of the code, prompts and evaluation set is unclear.',2,'vendor')]},
    written:{id:'written',k:'The pilot',q:'Has anyone written down why it stopped?',o:[
      O('yes','Yes, and the board has seen it','Then you have the first page of the next plan.','The post-mortem exists; it is the first page of the next plan.',0),
      O('partly','Informally','Write it. Two pages, with names. Without it the next pilot repeats the first.','No written post-mortem; the next pilot will repeat the first.',2,'target'),
      O('no','No','The board will ask before funding the next one.','No post-mortem; the board will ask for one before funding anything.',2,'target')]},
    count:{id:'count',k:'The programme',q:'How many use-cases are in production?',o:[
      O('two','2 or 3','Enough to feel the vendor and cost problems, not yet enough to need a platform.','Two or three use-cases in production; vendor and cost problems are starting.',1,'oversight'),
      O('four','4 to 6','Governance is now the constraint: who approves the seventh, and how long it takes.','Four to six use-cases; governance is the constraint.',2,'review'),
      O('many','More than 6','You are running a programme. The question is whether anyone can see cost and risk across it in one place.','A programme of more than six use-cases without one view of cost and risk.',3,'oversight')]},
    slips:{id:'slips',k:'The programme',q:'What slips most?',o:[
      O('vendors','Vendor delivery','Vendor oversight is a job. If nobody owns it, dates move.','Vendor delivery slips because nobody owns vendor oversight.',3,'oversight'),
      O('cost','Cost','Model and infrastructure cost drifts unless someone reads the bill per use-case monthly.','Cost drifts; nobody reads the bill per use-case.',3,'oversight'),
      O('quality','Model quality or incidents','Monitoring and an on-call route. A use-case without them is a pilot that got lucky.','Quality incidents without monitoring or an on-call route.',3,'monitor'),
      O('queue','The review queue','Quarters, not weeks. The review path needs a proportionate fast lane.','The review queue takes quarters.',3,'review')]},
    inventory:{id:'inventory',k:'Governance',q:'Is there a model inventory with an assessment record per use-case?',o:[
      O('yes','Yes, current','What regulators and auditors ask for first. Keep it proportionate.','A current model inventory exists.',0),
      O('partly','Partly','Complete it before the next audit, not after.','The model inventory is incomplete.',2,'inventory'),
      O('no','No','The first governance move, and a fortnight of work.','No model inventory or assessment records.',3,'inventory')]},
    ask:{id:'ask',k:'The request',q:'What is being asked for?',o:[
      O('platform','A platform','Boards fund results, not platforms. Name the two use-cases the platform is for.','The request is for a platform rather than for results.',3,'shortlist'),
      O('team','A team','A team without a shortlist builds what is interesting. Tie the hire to the first use-case.','The request is for a team without a shortlist to build.',2,'shortlist'),
      O('two','Two use-cases and the data they need','The request that holds. Add the owners and the result the board will see.','The request names use-cases; it needs owners and a measured result.',1,'target'),
      O('firm','An outside firm','Ask what they leave behind. If the answer is a deck, do not.','The request is for an outside firm; ask what it leaves behind.',1,'shortlist')]},
    evidence:{id:'evidence',k:'The request',q:'What evidence backs it?',o:[
      O('none','None yet','Ask for a smaller amount: a two-week Diagnosis and one use-case.','No evidence behind the request.',3,'target'),
      O('pilot','A pilot result','Useful, if the number was measured and not estimated.','A pilot result backs the request; check it was measured, not estimated.',1,'target'),
      O('prod','A measured result in production','The strongest case a board can hear. Lead with it.','A measured production result backs the request.',0)]},
    data:LV('Data','How would you describe the data the first use-cases depend on?',[
      ['Held in separate systems and spreadsheets, reconciled by hand.','Reconciled by hand means the first use-case spends its budget on plumbing. Say so in the plan, or the plan lies.','The data the first use-cases need is reconciled by hand.',4],
      ['Centralised in a warehouse or lake; quality undocumented.','A lake with undocumented quality is where most pilots drown. Someone has to own the two or three datasets that matter.','Data is centralised but nobody owns its quality.',3],
      ['Documented, with named owners and measured quality for the main datasets.','Documented and owned for the main datasets. Check the ones the first use-cases actually need; they are rarely the main ones.','The main datasets are owned; check the ones the first use-cases need.',1],
      ['Governed end to end: owners, quality metrics, access controls and lineage.','Rare outside regulated data teams. The remaining risk is a use-case that needs data nobody governs yet.','Data is governed end to end.',0]],['data','data',null,null]),
    eng:LV('Engineering','Who would build and run the first use-case?',[
      ['Vendors build and run it; no one in-house owns it.','When vendors build and run it and nobody in-house owns it, the vendor owns you. The contract needs exit and knowledge transfer written in.','Vendors would build and run it with no in-house owner.',3],
      ['Vendors build; an in-house owner runs the contract and the operations.','Workable, if the terms let them operate what is delivered.','Vendors build; an in-house owner runs the contract.',1],
      ['An in-house team that has shipped one ML or LLM feature, with vendor support.','Enough to judge build against buy honestly.','In-house engineering has shipped one feature with vendor support.',0],
      ['An in-house team that ships and operates ML or LLM features, with monitoring and on-call.','Can take a use-case to production alone. Governance is the constraint.','In-house engineering ships and operates on its own.',0]],['vendor','vendor',null,null]),
    own6:LV('Executive ownership','Who is accountable for AI at executive level?',[
      ['No one is named.','Without a named owner every use-case is an orphan, and plans written for orphans get filed.','No one is accountable for AI at executive level.',4],
      ['A named executive, without a budget line.','The commonest state: the mandate exists, the money sits elsewhere, and the first invoice tests it.','A named executive without a budget line.',3],
      ['A named executive with a budget line.','Owner and budget in place. The question becomes whether results reach the board before the next budget round.','An owner and a budget line exist.',1],
      ['A named executive with a budget line, reporting results to the board at least quarterly.','What a board expects and rarely gets.','Ownership, budget and reporting are in place.',0]],['owner','owner',null,null]),
    uc:LV('Use-cases','How far has the list of candidate use-cases been worked?',[
      ['There is no list, or a long one nobody has costed.','Thirty candidates nobody has costed is a wish list. Ranking them by value and feasibility usually leaves two.','There is no ranked, costed shortlist.',3],
      ['A shortlist with rough value estimates only.','Value estimates without feasibility produce the pilot that looks best and ships last.','The shortlist has value estimates but no feasibility.',2],
      ['A ranked shortlist: value, feasibility, and a named business owner for each.','What a board can fund. The next question is sequence against delivery capacity.','A ranked, owned shortlist exists.',0],
      ['A ranked, owned shortlist, sequenced against delivery capacity and the data that exists.','The shortlist is a plan. The work is holding it against vendor promises.','The shortlist is sequenced against capacity and data.',0]],['shortlist','shortlist',null,null])
  };
  var AI_BRANCH={mandate:['source','owner','budget','data','eng'],stalled:['why','builder','written','data','eng'],scale:['count','slips','inventory','data','eng'],budget:['ask','evidence','owner','data','eng'],curious:['own6','data','uc','eng']};
  var WORK={owner:['Weeks 1-2','Name the executive owner and the budget line. Everything else is handed to that name.'],
            shortlist:['Weeks 1-2','Rank the candidate use-cases by value and feasibility. Keep two, with a business owner each.'],
            target:['Week 2','Agree the measured target for the first use-case in writing before anything is built.'],
            data:['Weeks 2-6','Own the two or three datasets the first use-cases need: a name, a quality measure, a cost to fix.'],
            vendor:['Weeks 3-6','Rewrite the vendor terms: exit, volume pricing, and the right to operate what is delivered.'],
            review:['Weeks 2-4','Set a review path that approves a use-case in weeks, with a record an auditor can read.'],
            inventory:['Weeks 1-3','Complete the model inventory and an assessment record for each use-case in production.'],
            monitor:['Weeks 2-5','Monitoring and an on-call route for what is already in production.'],
            prod:['Months 2-5','Take one use-case to production and measure it, before the next budget round.'],
            oversight:['Monthly','Vendor and cost oversight across the programme: one view of dates, bills and risk.']};
  var WORK_ORDER=['owner','shortlist','target','data','vendor','review','inventory','monitor','prod','oversight'];
  var AI={
    key:'ai',name:'AI readiness diagnosis',kind:'flow',
    steps:function(ans){var s=[AI_STEPS.situation];var sit=ans.situation;if(sit)AI_BRANCH[sit.v].forEach(function(id){s.push(AI_STEPS[id]);});return s;},
    result:function(ans,steps){
      var sit=ans.situation.v, picks=steps.map(function(st){return ans[st.id];}).filter(Boolean);
      var findings=picks.filter(function(o){return o.w>0&&o!==ans.situation;}).sort(function(a,b){return b.w-a.w;}).slice(0,5);
      var tags={};picks.forEach(function(o){if(o.tag)tags[o.tag]=1;});
      if(sit!=='scale')tags.prod=1; if(sit==='scale')tags.oversight=1;
      var order=WORK_ORDER.filter(function(k){return tags[k];}).slice(0,5).map(function(k){return {w:WORK[k][0],t:WORK[k][1]};});
      var heavy=findings.reduce(function(a,o){return a+o.w;},0);
      var title=sit==='mandate'?(heavy>=9?'A mandate, not yet a programme.':'A mandate with most of a programme behind it.')
        :sit==='stalled'?(tags.data?'It stopped where most do: at the data.':tags.owner?'It stopped when the team left.':'It stopped for a reason that is fixable in weeks.')
        :sit==='scale'?(tags.review||tags.inventory?'Running, and not yet governed.':'Running. The risk is control, not readiness.')
        :sit==='budget'?(tags.target&&!tags.shortlist?'A request that can hold, with a number attached.':'A request the board will send back.')
        :(heavy>=8?'Foundations first.':heavy>=4?'Ready for a shortlist.':'Ready to build.');
      var asks={mandate:['Which two use-cases, and who owns them?','What does it cost, and what do we see in six months?','What happens to our data, and who is accountable if it goes wrong?'],
        stalled:['Why did the last one stop, in writing?','What is different this time?','Who owns it after the project team leaves?'],
        scale:['What does the programme cost per use-case, per month?','Who approves the next one, and how long does that take?','What happens when a vendor fails or a model drifts?'],
        budget:['What do we get for it, and by when?','Why this, and not the platform the vendor showed us?','Who is accountable for the result?'],
        curious:['Where do we stand against peers?','What would it take to run one use-case with a measured result?']}[sit];
      var lead={mandate:'The plan the board will accept names an owner, a budget line and two use-cases, and says what the board will see in six months. What is missing today is listed below, in the order to fix it.',
        stalled:'The next pilot is funded on the post-mortem of the last. The findings below are what that post-mortem would say, and the order of work is what changes the outcome.',
        scale:'The readiness question is answered. What decides the next year is control: vendors, cost, quality and the review queue. The findings are where control is missing.',
        budget:'A budget request holds when it is specific. The findings say where this one is not yet, and the order of work is how to make it so before the board meeting.',
        curious:'Three foundations decide whether a first use-case reaches production: an owner with money, data somebody owns, and a ranked list. Here is where each stands.'}[sit];
      var fit=sit==='curious'&&heavy<4?'Do you need us? Not now. The foundations are there; the next step is picking one use-case and measuring it, which your own team can do.'
        :sit==='scale'?'Do you need us? Not for a Diagnosis. What this situation needs is delivery oversight: monthly, across vendors, cost and the review queue, with a notice period. That is our third step without the first two.'
        :(tags.owner&&sit!=='budget')?'Do you need us? Not yet. The first move is a name and a budget line, and nobody should be paid to tell you that. Once the owner exists and needs a plan the board will approve, a two-week Diagnosis is the right size of help.'
        :'Do you need us? This is what a Diagnosis is for: two weeks to rank the use-cases, check the data and vendors they depend on, and write a plan with owners and budget bands that the board can approve.';
      var summary='Situation: '+ans.situation.t+'.\n'+AI.name+': '+title+'\nFindings:\n'+findings.map(function(o){return '- '+o.f;}).join('\n')+'\nOrder of work:\n'+order.map(function(w){return '- '+w.w+': '+w.t;}).join('\n');
      return {title:title,lead:lead,findings:findings.map(function(o){return o.f;}),asksLabel:'What the board will ask',asks:asks,order:order,fit:fit,summary:summary};
    }
  };

  /* ================= 02 Bank: an evidence review with a timeline ================= */
  var TRI=['In place','Partly','Not yet'];
  var WHEN={id:'when',k:'The date',q:'When does the review expect the file?',o:[O('4','Within 30 days','Thirty days closes nothing that is not already written. It is enough to assemble what exists and to be honest about the rest.','',0),O('8','Within 60 days','Sixty days is one hard stop, if the people are named on day one.','',0),O('13','Within 90 days','Ninety days is a realistic review cycle if the hard stops are started this week.','',0),O('0','No date yet','Then the list is the order of work, and the date is yours to set.','',0)]};
  var BANK={
    key:'bank',name:'Bank onboarding review',kind:'list',
    intake:[{id:'who',k:'The review',q:'Whose review is it?',o:[
      O('sponsor','A sponsor bank or banking-as-a-service partner','A sponsor bank\'s third-party review runs in the order of this list and opens with the first three groups.','',0),
      O('network','A card network or scheme','A scheme weighs security and financial standing more heavily; PCI DSS scope and the attestation move to the front.','',0),
      O('enterprise','An enterprise customer\'s due diligence','A security and privacy review with a procurement wrapper; the information-security and data groups decide it.','',0),
      O('prep','Nobody yet; preparing','The cheap way to do this. Most of the list takes weeks to produce and days to review.','',0)]},WHEN],
    title:'Mark each item as it stands today.',
    intro:'In place means the document exists and is current. Partly means it exists but is out of date or incomplete. The first three groups are the ones a review stops on.',
    gate:['Entity and ownership','Regulatory and licensing','Financial crime'],
    groups:[
      ['Entity and ownership',[['Corporate documents: incorporation, shareholder and UBO chart, directors and their fit-and-proper status, source of funds','',1,'The reviewer wants the shareholder chart down to natural persons, and will screen the directors against sanctions and PEP lists themselves.']]],
      ['Regulatory and licensing',[['Written confirmation of regulatory status in each market: licence, registration, or a legal opinion on exemption','',4,'A licence number or a dated legal opinion, per market. "We are applying" is not a status.'],['A register of regulatory obligations, with an owner and a change log','',2,'The rules you are subject to, each with an owner and a record of changes. Most fintechs have the policies and not the register.']]],
      ['Financial crime',[['AML and KYC programme documented, with a named MLRO or compliance officer','',5,'The programme plus the MLRO\'s name and appointment. The reviewer asks whether the MLRO reports to the board.'],['Business-wide risk assessment, customer risk rating, transaction monitoring and suspicious-activity reporting, with records','',4,'The risk assessment dated within the year, the customer risk model, and evidence of alerts handled and reports filed. A policy without alerts is partly.'],['Sanctions and PEP screening in operation, with records of alerts handled','',3,'Screening at onboarding and ongoing, with the log of hits and the decisions taken. The reviewer samples the log, not the policy.']]],
      ['Information security',[['SOC 2 Type II or ISO 27001 certificate, or a dated audit plan the bank can review','',2,'A certificate, or a signed audit plan with dates. A gap assessment is not an audit plan.'],['PCI DSS scope and attestation, where card data is touched','',6,'The scope statement and the attestation for that scope. If you never touch card data, say so in writing, with the architecture to prove it.'],['Penetration test report from the last twelve months, with remediation status','',4,'The report, the retest, and the status of each finding. A report with open highs is worse than no report.']]],
      ['Data and privacy',[['Data-flow map and a data-residency position for each market','',2,'Where personal and transaction data is stored and processed, per market, with the residency position in writing.'],['Privacy notices and a data-processing agreement template the bank\'s counsel can mark up','',2,'The public notices and a DPA template. Reviews stall on the DPA, not on the notice.']]],
      ['Operational resilience',[['Incident-response and business-continuity plans, tested in the last twelve months','',3,'Both plans and the record of the last test, with findings. Tested means a dated exercise with names.'],['Critical third parties listed (cloud, KYC vendor, processors), each with its own assurance on file','',2,'The list, and each provider\'s own assurance: SOC 2, ISO, or a completed questionnaire. The bank\'s outsourcing rules apply to your outsourcing too.']]],
      ['Financial standing',[['Audited or reviewed accounts, with twelve months of runway shown','',3,'Accounts and a runway statement. Pre-revenue is acceptable; unexplained is not.']]],
      ['Technology',[['Integration architecture written down: APIs, environments, responsibilities, and the change process','',2,'Diagram, environments, who is responsible for what, and how changes are approved. The bank\'s technology team reads this before anyone else.']]]
    ],
    result:function(ans,items){
      var who=ans.who.v, dl=parseInt(ans.when.v,10);
      var wk=function(it){return it.s===1?Math.ceil(it.wk/2):it.s===2?it.wk:it.s<0?it.wk:0;};
      var hard=items.filter(function(it){return BANK.gate.indexOf(it.g)>=0&&it.s!==0;});
      var rest=items.filter(function(it){return BANK.gate.indexOf(it.g)<0&&it.s!==0;});
      var byG={};hard.forEach(function(it){byG[it.g]=(byG[it.g]||0)+wk(it);});
      var open=hard.length?Math.max.apply(null,Object.keys(byG).map(function(g){return byG[g];})):0;
      var restW=rest.length?Math.max.apply(null,rest.map(wk)):0;
      var total=open+Math.max(restW,1)+4;
      var crit=hard.length?hard.slice().sort(function(a,b){return wk(b)-wk(a);})[0]:(rest.length?rest.slice().sort(function(a,b){return wk(b)-wk(a);})[0]:null);
      var title=hard.length?(hard.length===1?'The file does not open yet. One hard stop.':'The file does not open yet. '+hard.length+' hard stops.'):rest.length?'The file opens. About '+total+' weeks to onboard.':'Ready. The review can start today.';
      var lead=hard.length?'A bank\'s review opens with who you are, your regulatory status and the financial-crime programme, and stops at the first of those it cannot see. On these answers the file opens in about '+open+' weeks, and onboarding completes in about '+total+', counting four for the bank\'s own cycle.'
        :rest.length?'Who you are, your status and the financial-crime programme are in place, so the review opens. The remaining items decide the timeline: about '+total+' weeks, counting four for the bank\'s own cycle.'
        :'Everything a third-party review works from exists. What remains is the bank\'s own cycle, usually four to six weeks.';
      var whoLine={sponsor:'A sponsor bank reads the list in this order and will not read past a hard stop.',network:'A scheme reads security and financial standing first; PCI DSS scope and the attestation carry more weight than in a bank review.',enterprise:'An enterprise customer\'s procurement team will spend most of its time on the information-security and data groups, and will ask for the DPA before the notice.',prep:'Without a counterparty, this list is the order of work, and the weeks are the schedule.'}[who];
      var findings=[];hard.forEach(function(it){findings.push(it.t.split(':')[0]+': '+(it.s===1?'partly':'not yet')+'. Hard stop, about '+wk(it)+' weeks. '+it.n);});
      rest.slice(0,4).forEach(function(it){findings.push(it.t.split(':')[0]+': '+(it.s===1?'partly':it.s===2?'not yet':'not marked')+', about '+wk(it)+' weeks. '+it.n);});
      if(!findings.length)findings.push('Nothing open. Expect the reviewer to sample the logs behind the financial-crime items rather than the documents.');
      var order=hard.map(function(it){return {w:wk(it)+' wk',t:it.t.split(':')[0]};}).concat(rest.map(function(it){return {w:wk(it)+' wk',t:it.t.split(':')[0]};})).slice(0,7);
      var date='';if(dl){date=total<=dl?(dl-total>0?'Against your date: on time, with about '+(dl-total)+' weeks of margin.':'Against your date: on time, with no margin.'):'Against your date: about '+(total-dl)+' weeks late on these answers. The compressed route is to start every hard stop in the same week with a named owner each, and to assemble the rest as it exists rather than as it should be.';}
      var asks=hard.length?['Who is the MLRO, and who do they report to?','Which regulator, and under what status, in each market?','Who are the natural persons behind the shareholding?']:['Which of these documents is dated within the last twelve months?','Who holds our customers\' data, and what assurance do you hold on them?','How do changes to the integration get approved?'];
      var fit=hard.length?'Do you need us? The hard stops are the work. If nobody in-house has written an AML programme or obtained a regulatory opinion, that is where an adviser earns the fee. The rest of the list you can prepare yourselves, with this as the checklist.'
        :rest.length?'Do you need us? Probably not for the review itself. Where we add something is sitting alongside it and answering the bank\'s follow-up questions in the order they come.'
        :'Do you need us? No. Send the file.';
      var summary='Review: '+ans.who.t+'. Date: '+ans.when.t+'.\n'+BANK.name+': '+title+' File opens ~'+open+' wk; onboarding ~'+total+' wk.\n'+(date?date+'\n':'')+'Findings:\n'+findings.map(function(f){return '- '+f;}).join('\n');
      return {title:title,lead:lead,lead2:whoLine+(date?' '+date:''),findings:findings,asksLabel:'What the reviewer will ask in the first call',asks:asks,order:order,fit:fit,summary:summary,crit:crit};
    }
  };

  /* ================= 03 ISO: an audit dry run ================= */
  var SEC={
    key:'sec',name:'ISO 27001 audit dry run',kind:'list',
    intake:[{id:'why',k:'Why now',q:'Why now?',o:[
      O('quest','A customer\'s security questionnaire','A questionnaire is answered from the same evidence an auditor samples. The gap list tells you which answers have dates.','',0),
      O('first','A first ISO 27001 certification','A first certification runs Stage 1 on the management-system items, then Stage 2 on the controls.','',0),
      O('soc2','SOC 2, alongside or instead','SOC 2 maps onto most of this list; the differences are the trust services criteria and the observation period.','',0),
      O('recert','A surveillance or recertification audit','A surveillance audit samples what changed and what was found last time.','',0),
      O('posture','No audit dated; I want to know where we stand','Then the list is the order of work.','',0)]},
      {id:'when',k:'The date',q:'When is it due?',o:[O('4','Within 30 days','Thirty days is enough to assemble evidence, not to create controls.','',0),O('13','Within 90 days','Ninety days closes most technical gaps and one or two management-system items.','',0),O('26','Within six months','Six months is a realistic first-certification runway, including the operating evidence.','',0),O('0','Not dated','Then start with the two management-system items; everything else waits on them.','',0)]},
      {id:'estate',k:'The estate',q:'Where does the estate run?',o:[O('cloud','Cloud-native, no offices with servers','Physical controls fall to the providers; the cloud and supplier items carry the weight.','',0),O('mixed','Mixed cloud and on-premise','Both sets of evidence, and a scope statement that says which is which.','',0),O('onprem','Mostly on-premise','Physical entry and backup restore evidence come back into scope.','',0)]}],
    title:'Mark each item as it stands today.',
    intro:'In place means written, operating, and evidenced. Partly means one of those three is missing. The first two items are what a Stage 1 audit opens with; the rest are the Annex A controls sampled first.',
    majors:['Scope, risk assessment and risk treatment plan, current and approved','Statement of Applicability, with a justification for every included and excluded control','Access control policy, with identity and access-rights procedures for joiners, movers and leavers','Multi-factor authentication on email, cloud consoles and remote access','Backups taken, tested by restore, and stored separately','Privileged access restricted, logged and reviewed quarterly'],
    groups:[
      ['Management system',[['Scope, risk assessment and risk treatment plan, current and approved','Cl. 4.3, 6.1.2',3,'The auditor reads the scope first and the risk assessment second. A risk register without treatment decisions and dates is partly.'],['Statement of Applicability, with a justification for every included and excluded control','Cl. 6.1.3',2,'Every control included or excluded with a reason. "Not applicable" without a reason is a finding on day one.']]],
      ['Organisational controls',[['Information security policy approved by management and reviewed within the last year','A.5.1',1,'Approved with a date, and reviewed within the year. The auditor asks who approved it and when it was last read.'],['Inventory of information and associated assets, each with a named owner','A.5.9',3,'Systems, data and devices, each with a named owner. The auditor picks three at random and asks the owners.'],['Access control policy, with identity and access-rights procedures for joiners, movers and leavers','A.5.15, A.5.18',2,'The policy, plus evidence of a leaver removed on time. One leaver with access still open is a major.'],['Supplier security requirements in agreements, with a supplier register','A.5.19, A.5.20',3,'Security clauses in the contracts and a register of who holds your data. The auditor asks for the contract of your largest cloud or SaaS provider.'],['Cloud services: security requirements, and the responsibilities split with each provider','A.5.23',2,'What you are responsible for and what the provider is, per service. A shared-responsibility diagram is evidence; the provider\'s marketing page is not.'],['Incident management plan with roles, escalation and a contact list','A.5.24',2,'Roles, escalation, contacts, and the record of the last incident or exercise. The auditor asks what happened the last time something went wrong.']]],
      ['People controls',[['Security awareness training for all staff in the last year, with attendance records','A.6.3',1,'Who attended, when, and what. A slide deck without an attendance list is partly.']]],
      ['Technological controls',[['Privileged access restricted, logged and reviewed quarterly','A.8.2',2,'The list of privileged accounts and the record of the last quarterly review. The auditor samples the review, not the list.'],['Multi-factor authentication on email, cloud consoles and remote access','A.8.5',1,'Everywhere, including the console of every cloud provider and every remote path. One admin without MFA is a finding.'],['Vulnerability management with defined patch windows and evidence of closure','A.8.8',3,'Patch windows defined, and evidence of a critical patched within the window. Scanner output alone is not closure.'],['Backups taken, tested by restore, and stored separately','A.8.13',2,'The date of the last restore test and who signed it. A backup job log is not evidence of restore.'],['Logging enabled on critical systems, protected from change and reviewed','A.8.15',3,'Which systems log, where the logs go, who reviews them, and that they cannot be edited. The auditor asks for a review record.']]]
    ],
    result:function(ans,items){
      var why=ans.why.v, dl=parseInt(ans.when.v,10);
      var wk=function(it){return it.s===1?Math.ceil(it.wk/2):it.s===2||it.s<0?it.wk:0;};
      var mg=items.filter(function(it){return it.g==='Management system'&&it.s!==0;});
      var majors=items.filter(function(it){return SEC.majors.indexOf(it.t)>=0&&(it.s===2||it.s<0)&&it.g!=='Management system';});
      var minors=items.filter(function(it){return it.s!==0&&mg.indexOf(it)<0&&majors.indexOf(it)<0;});
      var inPlace=items.filter(function(it){return it.s===0;}).length;
      var mgW=mg.length?Math.max.apply(null,mg.map(wk)):0, otherW=items.filter(function(it){return it.s!==0&&it.g!=='Management system';}).map(wk);
      var total=mgW+(otherW.length?Math.max.apply(null,otherW):0);
      var title=mg.length?'Stage 1 would stop at the management system.':majors.length?'Stage 1 passes. '+majors.length+(majors.length===1?' likely major':' likely majors')+' at Stage 2.':minors.length?'Stage 1 and Stage 2 pass on paper, with minors.':'Audit-ready on paper. What remains is evidence over time.';
      var lead=mg.length?'An auditor reads the scope and the risk assessment before any control. Without them the visit ends at Stage 1, whatever the technical controls look like. About '+mgW+' weeks to close the management system, then '+(otherW.length?Math.max.apply(null,otherW):0)+' for the rest: about '+total+' weeks to a Stage 1 with confidence, plus one to three months of operating evidence before Stage 2.'
        :majors.length?'The management system exists, so Stage 1 opens. The items below are the ones an auditor writes up as major nonconformities: not policies, but controls that are not operating. About '+total+' weeks to close them, then the operating evidence.'
        :'The controls sampled first are in place. Expect minor findings on evidence quality; the aim is no majors at Stage 2. About '+total+' weeks to tidy what is partly.';
      var whyLine={quest:'For the questionnaire: you can answer '+inPlace+' of '+items.length+' with evidence today; the rest need a date, and an honest date beats a hopeful yes.',first:'For a first certification, the order is the management system, then access and privileged accounts, then everything the auditor samples with a log.',soc2:'For SOC 2, the same evidence serves; add the observation period to the timeline and map the controls to the trust services criteria.',recert:'For a surveillance audit, closed findings from last time come first; the auditor opens with them.',posture:'Without a date, treat the order below as the plan; the first two items are decisions, not documents.'}[why];
      var estLine={cloud:'Cloud-native: the supplier and cloud items carry your customers\' data; they matter more than the physical ones.',mixed:'Mixed estate: the scope statement has to say which systems are which, or the audit samples the wrong ones.',onprem:'On-premise: restore tests and privileged-access reviews are the two the auditor asks to see performed, not described.'}[ans.estate.v];
      var findings=[];mg.forEach(function(it){findings.push('Stage 1 stop: '+it.t.split(',')[0]+' ('+it.c+'). '+it.n);});
      majors.forEach(function(it){findings.push('Likely major: '+it.t.split(',')[0]+' ('+it.c+'). '+it.n);});
      minors.slice(0,3).forEach(function(it){findings.push('Minor: '+it.t.split(',')[0]+' ('+it.c+'). '+it.n);});
      if(!findings.length)findings.push('Nothing open on paper. The auditor will now ask for records that show each control operating over time.');
      var order=mg.concat(majors,minors).map(function(it){return {w:wk(it)+' wk',t:it.t.split(',')[0]+' ('+it.c+')'};}).slice(0,7);
      var date='';if(dl){date=total<=dl?(dl-total>0?'Against your date: on time, with about '+(dl-total)+' weeks of margin before the operating evidence.':'Against your date: on time, with no margin before the operating evidence.'):'Against your date: about '+(total-dl)+' weeks late on these answers. What can be done by the date is the management system and the technical controls; the operating evidence cannot be compressed.';}
      var asks=mg.length?['What is in scope, and what is deliberately out?','Show me the risk assessment and the date it was last reviewed.','Which controls did you exclude, and why?']:['Show me the last leaver and when their access was removed.','When was the last restore test, and who signed it?','Which privileged accounts exist, and who reviewed them last quarter?'];
      var fit=mg.length?'Do you need us? Not for the first items. Scope, the risk assessment and the Statement of Applicability are management decisions; an adviser can draft them, but the decisions are yours. A Diagnosis makes sense once they exist.'
        :majors.length?'Do you need us? For the order and the evidence standard. The gaps are known; what stalls audits is closing items in the wrong order and calling a document in place.'
        :'Do you need us? Probably not for the audit. A two-week pre-audit review of the evidence is the most we would suggest.';
      var summary='Why: '+ans.why.t+'. Date: '+ans.when.t+'. Estate: '+ans.estate.t+'.\n'+SEC.name+': '+title+' ~'+total+' weeks to close.\n'+(date?date+'\n':'')+'Findings:\n'+findings.map(function(f){return '- '+f;}).join('\n');
      return {title:title,lead:lead,lead2:whyLine+' '+estLine+(date?' '+date:''),findings:findings,asksLabel:'What the auditor will ask first',asks:asks,order:order,fit:fit,summary:summary};
    }
  };

  /* ================= rendering ================= */
  function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
  function arrow(){return '<svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M2 9h13M10 4l5 5-5 5" stroke="currentColor" stroke-width="2"/></svg>';}
  function btn(cls,html,fn){var b=el('button',cls,html);b.type='button';if(fn)b.addEventListener('click',fn);return b;}
  function header(def,stepText,progress){var b=el('div','bar');b.appendChild(el('span','name',def.name));b.appendChild(el('span','step',stepText));var t=el('div','track');var i=el('i');i.style.width=Math.round(progress*100)+'%';t.appendChild(i);var f=document.createDocumentFragment();f.appendChild(b);f.appendChild(t);return f;}
  function send(text){var form=document.getElementById('contactForm');if(!form)return;var ta=form.querySelector('textarea[name=problem]');
    var cur=ta.value.replace(/\n*\[Check result\][\s\S]*$/,'').replace(/\s+$/,'');ta.value=(cur?cur+'\n\n':'')+'[Check result]\n'+text;
    var c=document.getElementById('contact');if(c)c.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});setTimeout(function(){ta.focus({preventScroll:true});},reduce?0:500);}
  function sendbar(summary){removeBar();var bar=el('div','sendbar');bar.id='sendbar';bar.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(summary);}));document.body.appendChild(bar);
    var c=document.getElementById('contact');if(c&&'IntersectionObserver' in window){bar._io=new IntersectionObserver(function(es){bar.classList.toggle('off',es[0].isIntersecting);},{threshold:0.1});bar._io.observe(c);}}
  function removeBar(){var b=document.getElementById('sendbar');if(b){if(b._io)b._io.disconnect();b.remove();}}

  /* one question: options with a radio mark, the chosen one explained beneath */
  function question(root,def,step,val,onPick,onNext,onBack,stepText,progress,isLast){
    root.innerHTML='';root.appendChild(header(def,stepText,progress));
    var body=el('div','body step-in');body.appendChild(el('div','dim',step.k));body.appendChild(el('h3','q',step.q));
    var opts=el('div','opts');opts.setAttribute('role','radiogroup');opts.setAttribute('aria-label',step.q);var next,ins=el('div','ins');ins.hidden=true;
    step.o.forEach(function(o){var b=btn('opt'+(val&&val.v===o.v?' sel':''),'<span class="r"></span><span>'+o.t+'</span>',function(){[].forEach.call(opts.children,function(x){x.classList.toggle('sel',x===b);x.setAttribute('aria-checked',x===b?'true':'false');});ins.innerHTML='<span class="k">What this usually means</span>'+o.i;ins.hidden=false;next.disabled=false;onPick(o);});
      b.setAttribute('role','radio');b.setAttribute('aria-checked',val&&val.v===o.v?'true':'false');opts.appendChild(b);});
    body.appendChild(opts);if(val){ins.innerHTML='<span class="k">What this usually means</span>'+val.i;ins.hidden=false;}body.appendChild(ins);root.appendChild(body);
    var foot=el('div','foot');foot.appendChild(el('span','note','Nothing is stored. The next question follows your answer.'));var nav=el('div','nav');
    var back=btn(null,'Back',onBack);back.disabled=!onBack;next=btn('pri',(isLast?'See the result':'Next')+' '+arrow(),onNext);next.disabled=!val;nav.appendChild(back);nav.appendChild(next);foot.appendChild(nav);root.appendChild(foot);
  }
  function resultView(root,def,R,restart,restartLabel){
    root.innerHTML='';root.appendChild(header(def,'Result',1));
    var body=el('div','body step-in'),res=el('div','res');
    res.appendChild(el('h4',null,R.title));res.appendChild(el('p',null,R.lead));if(R.lead2)res.appendChild(el('p',null,R.lead2));
    res.appendChild(el('div','sec','Findings'));var fl=el('ol','findings');R.findings.forEach(function(f,i){fl.appendChild(el('li',null,'<b>'+(i+1<10?'0':'')+(i+1)+'</b><span>'+f+'</span>'));});res.appendChild(fl);
    res.appendChild(el('div','sec',R.asksLabel));var al=el('ul','asks');R.asks.forEach(function(a){al.appendChild(el('li',null,a));});res.appendChild(al);
    if(R.order.length){res.appendChild(el('div','sec','The order of work'));var ol=el('ol','order');R.order.forEach(function(w){ol.appendChild(el('li',null,'<span class="w">'+w.w+'</span><span>'+w.t+'</span>'));});res.appendChild(ol);}
    res.appendChild(el('div','foryou','<p class="need">'+R.fit+'</p>'));
    var acts=el('div','acts');acts.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(R.summary);}));acts.appendChild(btn(null,restartLabel||'Start again',restart));
    res.appendChild(acts);body.appendChild(res);root.appendChild(body);sendbar(R.summary);
  }

  function mountFlow(root,def){
    var ans={},i=0;
    function render(){removeBar();var steps=def.steps(ans);
      if(i>=steps.length){var R=def.result(ans,steps);return resultView(root,def,R,function(){ans={};i=0;render();});}
      var st=steps[i];
      question(root,def,st,ans[st.id],function(o){var prev=ans[st.id];ans[st.id]=o;if(st.id==='situation'&&prev&&prev.v!==o.v){var keep={};keep.situation=o;ans=keep;}},
        function(){if(!ans[st.id])return;i++;render();root.scrollIntoView({behavior:'auto',block:'nearest'});},i>0?function(){i--;render();}:null,
        'Question '+(i+1)+' of '+steps.length,i/steps.length,i===steps.length-1);}
    render();
  }
  function mountList(root,def){
    var items=[];def.groups.forEach(function(g){g[1].forEach(function(it){items.push({t:it[0],c:it[1]||'',wk:it[2],n:it[3]||'',g:g[0],s:-1});});});
    var ans={},i=0,stage=0;var TRI2=TRI;
    function marked(){return items.filter(function(it){return it.s>=0;}).length;}
    function score(){return items.reduce(function(a,it){return a+(it.s===0?1:it.s===1?0.5:0);},0);}
    function fmt(n){return (n%1?n.toFixed(1):String(n));}
    function footText(){var m=marked();return m?fmt(score())+' of '+items.length+' in place &middot; '+m+' of '+items.length+' marked':'Nothing marked yet';}
    function render(){removeBar();var n=def.intake.length;
      if(stage===0&&i<n){var st=def.intake[i];return question(root,def,st,ans[st.id],function(o){ans[st.id]=o;},function(){if(!ans[st.id])return;i++;if(i>=n)stage=1;render();},i>0?function(){i--;render();}:null,'Question '+(i+1)+' of '+n,i/(n+1),false);}
      if(stage===2){var R=def.result(ans,items);return resultView(root,def,R,function(){stage=1;render();},'Edit answers');}
      root.appendChild(header(def,items.length+' items',(n+marked()/items.length)/(n+1)));
      var body=el('div','body step-in');body.appendChild(el('h3','q',def.title));body.appendChild(el('p','hint',def.intro));
      var list=el('div','list'),lastG=null,go,note;
      items.forEach(function(it){if(it.g!==lastG){list.appendChild(el('div','grp',it.g));lastG=it.g;}
        var row=el('div','row');row.appendChild(el('span','t',it.t+(it.c?'<span class="c">'+it.c+'</span>':'')));
        var seg=el('div','seg');seg.setAttribute('role','radiogroup');seg.setAttribute('aria-label',it.t);
        var ins=el('div','ins rowins');ins.hidden=it.s<0;if(it.s>=0)ins.innerHTML='<span class="k">What the reviewer asks for</span>'+it.n;
        TRI2.forEach(function(lab,si){var b=btn('s'+si+(it.s===si?' on':''),lab,function(){it.s=si;[].forEach.call(seg.children,function(x,j){x.className='s'+j+(j===si?' on':'');x.setAttribute('aria-checked',j===si?'true':'false');});
            root.querySelector('.track i').style.width=Math.round((n+marked()/items.length)/(n+1)*100)+'%';note.innerHTML=footText();go.disabled=marked()===0;ins.innerHTML='<span class="k">What the reviewer asks for</span>'+it.n;ins.hidden=false;});
          b.setAttribute('role','radio');b.setAttribute('aria-checked',it.s===si?'true':'false');seg.appendChild(b);});
        row.appendChild(seg);list.appendChild(row);list.appendChild(ins);});
      body.appendChild(list);root.appendChild(body);
      var foot=el('div','foot');note=el('span','note',footText());foot.appendChild(note);var nav=el('div','nav');
      nav.appendChild(btn(null,'Back',function(){stage=0;i=n-1;render();}));go=btn('pri','See the result '+arrow(),function(){stage=2;render();root.scrollIntoView({behavior:'auto',block:'nearest'});});go.disabled=marked()===0;nav.appendChild(go);foot.appendChild(nav);root.appendChild(foot);}
    function renderWrap(){root.innerHTML='';render();}
    render=(function(r){return function(){root.innerHTML='';r();};})(render);
    render();
  }

  var DEFS={ai:AI,bank:BANK,sec:SEC};
  document.querySelectorAll('[data-check]').forEach(function(root){var def=DEFS[root.getAttribute('data-check')];if(!def)return;if(def.kind==='flow')mountFlow(root,def);else mountList(root,def);});
})();

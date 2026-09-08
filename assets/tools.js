/* dfg.consulting — three diagnostics.
   The next question depends on the last answer, each answer is explained, and the result is written from the
   answers: findings, the questions a reviewer or board is likely to ask, a suggested order of work, and whether
   further support would be useful. Nothing is stored. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function O(v,t,i,f,w,tag){return {v:v,t:t,i:i,f:f,w:w||0,tag:tag||null};}
  var LV=function(d,q,o,tags){return {id:d.toLowerCase().replace(/[^a-z]+/g,'-'),k:d,q:q,o:o.map(function(x,n){return O(String(n),x[0],x[1],x[2],x[3]||0,tags?tags[n]:null);})};};

  /* ================= 01 AI readiness ================= */
  var AI_STEPS={
    situation:{id:'situation',k:'Starting point',q:'Which describes your situation?',o:[
      O('mandate','The board has asked for an AI plan and there is none yet','The next questions establish who is accountable, where the request came from and whether a budget exists.','No AI plan exists yet.',3),
      O('stalled','A pilot ran but did not reach production','The next questions establish why it stopped, who built it and whether the reasons are documented.','A pilot did not reach production.',3),
      O('scale','Several use-cases are in production','The next questions establish how many, where delivery slips and how decisions are governed.','Several use-cases are in production.',3),
      O('budget','A budget request is being prepared','The next questions establish what is being requested and what evidence supports it.','A budget request is being prepared.',2),
      O('curious','No immediate decision; establishing where things stand','The next questions cover ownership, data and the use-case list.','No immediate decision.',1)]},
    source:{id:'source',k:'The request',q:'Where did the request come from?',o:[
      O('peers','Competitor activity or press coverage','Confirm what outcome the board expects, so the plan can be measured against it rather than against competitors.','The request is driven by external comparison; the expected outcome is not yet defined.',2,'shortlist'),
      O('regulator','A regulator, customer or partner asked about AI use','Governance requirements should be established before use-cases are selected, since the enquirer will ask about them.','An external party has asked about AI governance.',3,'review'),
      O('vendor','A vendor proposal or a platform already purchased','Establish which use-cases the platform supports before committing further budget to it.','A platform decision precedes the use-case decision.',3,'shortlist'),
      O('ceo','Senior management initiative','Confirm the budget position; an initiative without an allocation cannot be planned.','Senior management backs the initiative.',1,'owner')]},
    owner:{id:'owner',k:'Accountability',q:'Who has been asked to produce the plan?',o:[
      O('cio','The CIO or CTO','Involve the business owners of the candidate use-cases in selection; technology alone cannot rank value.','Technology leads the plan; business owners are not yet involved in selection.',2,'shortlist'),
      O('head','A newly appointed head of AI or data','Agree the scope and the first deliverable with them before the plan, so the role is measured against something.','A new role has been created to produce the plan.',2,'shortlist'),
      O('committee','A committee','Identify the executive accountable for approving priorities, resolving issues and monitoring delivery.','A committee holds the mandate; the accountable executive is not yet identified.',3,'owner'),
      O('nobody','Not yet assigned','Assigning an accountable executive is the first step; the plan cannot be approved without one.','No executive is accountable for the plan.',4,'owner')]},
    budget:{id:'budget',k:'Budget',q:'What is the budget position?',o:[
      O('none','No budget allocated','Confirm an accountable sponsor and an initial budget before selecting vendors or use-cases.','No budget is allocated.',4,'owner'),
      O('number','An amount has been discussed but not allocated','Secure the allocation before vendor selection; contracts cannot be signed against a discussion.','A budget has been discussed but not allocated.',3,'owner'),
      O('line','A line in the next planning cycle','Complete the use-case ranking before the planning cycle closes, so the line funds selected work.','A budget line exists in the next cycle.',2,'shortlist'),
      O('approved','Approved and allocated','Proceed to ranking use-cases before procurement.','Budget is approved.',1,'shortlist')]},
    why:{id:'why',k:'The pilot',q:'What stopped it?',o:[
      O('data','The required data was unavailable or unreliable','Assign an owner and a quality measure to the datasets the next use-case depends on before it starts.','The pilot was blocked by data availability or quality.',4,'data'),
      O('measure','Results were not measured against a target','Agree the measure of success in writing before the next pilot begins.','The pilot had no agreed measure of success.',3,'target'),
      O('owner','Ownership ended when the project team moved on','Identify the operational owner of the use-case before the next build, and include them in the pilot.','Operational ownership was not assigned.',3,'owner'),
      O('vendor','Vendor costs or contract terms did not support production','Review the contract for production pricing, exit terms and the right to operate the system in-house.','Vendor terms did not support production use.',3,'vendor'),
      O('risk','Risk, compliance or legal review blocked deployment','Establish a review path with defined criteria, so the next use-case can be assessed before it is built.','Deployment was blocked for lack of a defined review path.',3,'review')]},
    builder:{id:'builder',k:'The pilot',q:'Who built it?',o:[
      O('vendorb','A vendor','Confirm whether in-house staff can operate and modify the system; production support depends on it.','The pilot was vendor-built; in-house operability is unconfirmed.',2,'vendor'),
      O('inhouse','An in-house team','In-house capability exists. The remaining questions concern ownership and data.','In-house engineering capability exists.',0),
      O('mix','A combination','Establish who holds the code, the prompts and the evaluation data, and under what terms.','Ownership of the pilot\'s assets is shared between parties.',2,'vendor')]},
    written:{id:'written',k:'The pilot',q:'Are the reasons it stopped documented?',o:[
      O('yes','Yes, and reported to the sponsor','The documentation can serve as the starting point for the next plan.','The reasons the pilot stopped are documented.',0),
      O('partly','Informally','Record the reasons and the people involved before the next pilot; the board will ask.','The reasons the pilot stopped are not formally recorded.',2,'target'),
      O('no','No','A short written account of what stopped the pilot is needed before further budget is requested.','The reasons the pilot stopped are not recorded.',2,'target')]},
    count:{id:'count',k:'The programme',q:'How many use-cases are in production?',o:[
      O('two','Two or three','Establish the cost and the owner of each before adding more.','Two or three use-cases are in production.',1,'oversight'),
      O('four','Four to six','Confirm how new use-cases are approved and how long approval takes.','Four to six use-cases are in production.',2,'review'),
      O('many','More than six','Confirm whether cost, risk and vendor performance are reported across the programme in one place.','More than six use-cases are in production.',3,'oversight')]},
    slips:{id:'slips',k:'The programme',q:'Where does delivery most often slip?',o:[
      O('vendors','Vendor delivery','Assign responsibility for vendor oversight, with regular reporting against agreed dates.','Vendor delivery slips without assigned oversight.',3,'oversight'),
      O('cost','Cost','Report cost per use-case monthly, so drift is visible before the budget is exceeded.','Cost is not tracked per use-case.',3,'oversight'),
      O('quality','Model quality or incidents','Confirm that monitoring and an incident route exist for each production use-case.','Production use-cases lack monitoring or an incident route.',3,'monitor'),
      O('queue','Approval of new use-cases','Define review criteria and a target approval time, proportionate to the risk of each use-case.','Approval of new use-cases is slow.',3,'review')]},
    inventory:{id:'inventory',k:'Governance',q:'Is there an inventory of models in production, with an assessment record for each?',o:[
      O('yes','Yes, and current','The inventory supports audit and regulatory enquiries; keep it proportionate.','A current model inventory exists.',0),
      O('partly','Partly','Complete the inventory before the next audit or regulatory enquiry.','The model inventory is incomplete.',2,'inventory'),
      O('no','No','An inventory with an assessment record per use-case is the first governance step.','No model inventory exists.',3,'inventory')]},
    ask:{id:'ask',k:'The request',q:'What is being requested?',o:[
      O('platform','A platform','Name the use-cases the platform will serve; the board approves outcomes, and the platform is a means to them.','The request is for a platform rather than for defined use-cases.',3,'shortlist'),
      O('team','A team','Tie the hiring to a first use-case with an owner, so the team has a defined first deliverable.','The request is for a team without a defined first use-case.',2,'shortlist'),
      O('two','Specific use-cases and the data they need','Add the owners and the measure of success for each.','The request names use-cases; owners and measures are to be added.',1,'target'),
      O('firm','External advisory support','Define the deliverables expected from the engagement, so it can be evaluated.','The request is for external support; deliverables are to be defined.',1,'shortlist')]},
    evidence:{id:'evidence',k:'The request',q:'What evidence supports the request?',o:[
      O('none','None yet','Consider requesting a smaller initial amount for an assessment and one use-case, to produce evidence.','No evidence supports the budget request.',3,'target'),
      O('pilot','A pilot result','Confirm that the result was measured against a target rather than estimated.','A pilot result supports the request.',1,'target'),
      O('prod','A measured result in production','The result can lead the request.','A measured production result supports the request.',0)]},
    data:LV('Data','How would you describe the data the first use-cases depend on?',[
      ['Held in separate systems and spreadsheets, reconciled manually.','Data preparation will be a large part of the first use-case; include it in the plan and the budget.','The required data is reconciled manually.',4],
      ['Centralised, with quality undocumented.','Assign an owner and a quality measure to the datasets the first use-cases need.','Data is centralised; quality is not documented.',3],
      ['Documented, with named owners and measured quality for the main datasets.','Confirm that the datasets the first use-cases need are among those documented.','The main datasets are documented and owned.',1],
      ['Governed end to end: owners, quality metrics, access controls and lineage.','Confirm that the first use-cases fall within the governed data.','Data is governed end to end.',0]],['data','data',null,null]),
    eng:LV('Engineering','Who would build and operate the first use-case?',[
      ['A vendor, with no in-house owner.','Include in-house operability, exit terms and knowledge transfer in the vendor contract.','No in-house owner is assigned for a vendor-built system.',3],
      ['A vendor, with an in-house owner responsible for the contract and operations.','Confirm the owner has the access and the terms needed to operate the system.','A vendor builds; an in-house owner operates.',1],
      ['An in-house team with one delivered feature, supported by a vendor.','Capability exists to evaluate build against buy.','In-house engineering has delivered one feature.',0],
      ['An in-house team that builds and operates such systems, with monitoring and on-call support.','Capability exists to take a use-case to production in-house.','In-house engineering builds and operates.',0]],['vendor','vendor',null,null]),
    own6:LV('Accountability','Who is accountable for AI at executive level?',[
      ['No one is named.','Assign an accountable executive before selecting use-cases.','No executive is accountable for AI.',4],
      ['A named executive, without a budget.','Confirm an initial budget so the plan can be resourced.','An executive is accountable; no budget is allocated.',3],
      ['A named executive with a budget.','Establish how and when results are reported to the board.','An accountable executive and budget exist.',1],
      ['A named executive with a budget, reporting results to the board at least quarterly.','Accountability and reporting are in place.','Accountability, budget and reporting are in place.',0]],['owner','owner',null,null]),
    uc:LV('Use-cases','How far has the list of candidate use-cases been developed?',[
      ['No list, or a long list that has not been costed.','Rank the candidates by expected value and feasibility, and cost the top few.','The use-case list is not ranked or costed.',3],
      ['A shortlist with value estimates only.','Add a feasibility assessment covering data, engineering and governance.','The shortlist lacks a feasibility assessment.',2],
      ['A ranked shortlist with value, feasibility and a business owner for each.','Sequence the shortlist against delivery capacity.','A ranked, owned shortlist exists.',0],
      ['A ranked, owned shortlist sequenced against delivery capacity and available data.','The shortlist can serve as the delivery plan.','The shortlist is sequenced against capacity and data.',0]],['shortlist','shortlist',null,null])
  };
  var AI_BRANCH={mandate:['source','owner','budget','data','eng'],stalled:['why','builder','written','data','eng'],scale:['count','slips','inventory','data','eng'],budget:['ask','evidence','owner','data','eng'],curious:['own6','data','uc','eng']};
  var WORK={owner:['Weeks 1-2','Confirm the accountable executive and an initial budget.'],
            shortlist:['Weeks 1-2','Rank the candidate use-cases by value and feasibility, with a business owner for each.'],
            target:['Week 2','Agree the measure of success for the first use-case in writing.'],
            data:['Weeks 2-6','Assign owners and quality measures to the datasets the first use-cases depend on.'],
            vendor:['Weeks 3-6','Review vendor terms for production pricing, exit and in-house operability.'],
            review:['Weeks 2-4','Define the review path and criteria for approving new use-cases.'],
            inventory:['Weeks 1-3','Complete the model inventory and an assessment record for each use-case in production.'],
            monitor:['Weeks 2-5','Establish monitoring and an incident route for production use-cases.'],
            prod:['Months 2-5','Deliver the first use-case to production and measure the result.'],
            oversight:['Monthly','Report vendor performance, cost and risk across the programme.']};
  var WORK_ORDER=['owner','shortlist','target','data','vendor','review','inventory','monitor','prod','oversight'];
  var AI={
    key:'ai',name:'AI readiness assessment',kind:'flow',
    steps:function(ans){var s=[AI_STEPS.situation];var sit=ans.situation;if(sit)AI_BRANCH[sit.v].forEach(function(id){s.push(AI_STEPS[id]);});return s;},
    result:function(ans,steps){
      var sit=ans.situation.v, picks=steps.map(function(st){return ans[st.id];}).filter(Boolean);
      var findings=picks.filter(function(o){return o.w>0&&o!==ans.situation;}).sort(function(a,b){return b.w-a.w;}).slice(0,5);
      var tags={};picks.forEach(function(o){if(o.tag)tags[o.tag]=1;});
      if(sit!=='scale')tags.prod=1; if(sit==='scale')tags.oversight=1;
      var order=WORK_ORDER.filter(function(k){return tags[k];}).slice(0,5).map(function(k){return {w:WORK[k][0],t:WORK[k][1]};});
      var heavy=findings.reduce(function(a,o){return a+o.w;},0);
      var title={mandate:heavy>=9?'Accountability and budget need to be established before planning.':'The prerequisites for a plan are largely in place.',
        stalled:tags.data?'The pilot was blocked by data; the next one depends on data ownership.':tags.owner?'The pilot lacked an operational owner.':'The reasons the pilot stopped can be addressed before the next one.',
        scale:(tags.review||tags.inventory)?'Use-cases are running; governance is incomplete.':'Use-cases are running; the remaining risk is programme control.',
        budget:(tags.target&&!tags.shortlist)?'The request can be supported with owners and measures added.':'The request needs defined use-cases before it can be assessed.',
        curious:heavy>=8?'Accountability, data and use-case selection need work before a first delivery.':heavy>=4?'A ranked shortlist is the next step.':'The foundations for a first delivery are in place.'}[sit];
      var lead={mandate:'On these answers, the items below are what a board would need to see before approving a plan: an accountable executive, an allocated budget, and a ranked shortlist with owners.',
        stalled:'On these answers, the items below are the reasons the next pilot may repeat the last one. The order of work addresses them before further budget is committed.',
        scale:'On these answers, the items below are where programme control is incomplete: vendor oversight, cost reporting, monitoring and the approval path.',
        budget:'On these answers, the items below are what the board is likely to question in the request. The order of work addresses them before the request is submitted.',
        curious:'On these answers, the items below describe the current position on accountability, data and use-case selection.'}[sit];
      var asks={mandate:['Which use-cases, and who owns each?','What is the cost, and what result will be reported, and when?','How will data and model risk be governed?'],
        stalled:['Why did the previous pilot stop?','What has changed since?','Who will operate the system after delivery?'],
        scale:['What does each use-case cost per month?','How are new use-cases approved, and how long does it take?','What happens when a vendor fails or a model degrades?'],
        budget:['What will be delivered, and by when?','Why this option rather than the alternatives?','Who is accountable for the result?'],
        curious:['What would a first delivery require?','Who would own it?']}[sit];
      var fit=sit==='scale'?'Whether to involve us: the relevant service is delivery oversight, reported monthly across vendors, cost and approvals, rather than an initial assessment.'
        :(tags.owner&&sit!=='budget')?'Whether to involve us: the immediate priority is to confirm an accountable sponsor and an initial budget. We can support that step, or the assessment that follows it, in a two-week engagement.'
        :(sit==='curious'&&heavy<4)?'Whether to involve us: on these answers the foundations exist. If a first use-case is being selected, a two-week assessment can rank the candidates and set the delivery plan.'
        :'Whether to involve us: a two-week assessment covers the use-case ranking, the data and vendor review, and an implementation plan with owners and budget bands.';
      var summary='Situation: '+ans.situation.t+'.\n'+AI.name+': '+title+'\nFindings:\n'+findings.map(function(o){return '- '+o.f;}).join('\n')+'\nOrder of work:\n'+order.map(function(w){return '- '+w.w+': '+w.t;}).join('\n');
      return {title:title,lead:lead,findings:findings.map(function(o){return o.f;}),asksLabel:'Questions the board is likely to ask',asks:asks,order:order,fit:fit,summary:summary};
    }
  };

  /* ================= 02 Fintech readiness ================= */
  var FIN_STEPS={
    stage:{id:'stage',k:'Starting point',q:'Where is the product?',o:[
      O('idea','An idea, not yet built','The next questions cover customer demand, the business model and licensing.','The product is not yet built.',3,'evidence'),
      O('proto','A prototype without paying customers','The prototype provides an opportunity to test demand, pricing and cost assumptions.','A prototype exists; demand and pricing are untested.',3,'model'),
      O('live','Live, with paying customers','The next questions cover market entry, licensing, providers and partners.','The product is live with paying customers.',1,'market'),
      O('scaling','Expanding into new markets or segments','Each market has its own licensing requirements and partner landscape; the next questions cover them.','The product is expanding into new markets.',2,'market')]},
    customer:{id:'customer',k:'Customers',q:'What is the evidence of customer demand?',o:[
      O('none','None yet','Structured conversations with prospective customers, including a proposed price, are the next step.','No customer demand has been tested.',4,'evidence'),
      O('pilots','Unpaid pilots','Pilots test the product; a proposed price tests the model. Introduce pricing in the next pilot.','Demand is tested; pricing is not.',3,'evidence'),
      O('guess','Paying customers at a price set without cost data','Establish the cost to serve, so pricing can be set against it.','Pricing was set without cost data.',2,'model'),
      O('tested','Paying customers at a price tested against costs','Demand and pricing are established.','',0)]},
    model:{id:'model',k:'The model',q:'Are the unit economics known?',o:[
      O('no','No','Establish cost to serve and cost to acquire before planning growth.','Unit economics are not established.',4,'model'),
      O('rough','Estimated','Replace estimated inputs with measured ones where the product is live.','Unit economics are estimated rather than measured.',2,'model'),
      O('yes','Yes: pricing, cost to serve, cost to acquire, payback','Unit economics are established.','',0)]},
    licence:{id:'licence',k:'Licensing',q:'Is the licensing position in the target market established?',o:[
      O('unknown','Not yet assessed','Assess which activities the product performs and which require a licence in the target market.','The licensing position is not assessed.',4,'licence'),
      O('lawyer','Legal advice has been obtained','Has the legal advice been translated into a launch plan covering permitted activities, dependencies and responsibilities?','Legal advice exists; the launch plan is not yet derived from it.',3,'licence'),
      O('partner','The product will operate under a licensed partner','Confirm the partner\'s onboarding requirements, permitted activities and allocation of compliance responsibilities.','The product depends on a licensed partner.',2,'partners'),
      O('own','A licence is held or applied for','Sequence the launch around the licence timeline.','A licence is held or in application.',1,'licence')]},
    market:{id:'market',k:'The market',q:'How was the next market chosen?',o:[
      O('undecided','Not yet chosen','Assess candidate markets on reachable customers, licensing requirements and partner availability.','The next market is not yet chosen.',3,'market'),
      O('size','By market size','Confirm the licensing timeline and partner availability for the chosen market before committing budget.','The next market was chosen on size; licensing and partners are unconfirmed.',3,'market'),
      O('reach','By licensing, reach and partner availability','The selection criteria are in place.','',0)]},
    providers:{id:'providers',k:'Providers',q:'How were providers selected: KYC, payments, custody, core systems?',o:[
      O('first','Without a formal comparison','Compare shortlisted providers against functional requirements, total cost, security assurance and exit terms.','Providers were selected without a formal comparison.',3,'providers'),
      O('price','Primarily on price','Extend the comparison to security assurance, exit terms and integration effort.','Providers were compared primarily on price.',2,'providers'),
      O('terms','On requirements, cost, assurance and exit terms','Provider selection is documented.','',0),
      O('none','Not yet needed','Begin the comparison before the requirement becomes urgent.','Providers are not yet selected.',1,'providers')]},
    partners:{id:'partners',k:'Partners',q:'What is the status of the bank or card-network partnership?',o:[
      O('none','Not required','Confirm this against the licensing position.','',0),
      O('notstarted','Required, not started','Obtain the partner\'s onboarding requirements and evidence list, and plan against them.','A bank or network partnership is required and not started.',3,'partners'),
      O('inreview','In the partner\'s onboarding review','Confirm which items the review treats as prerequisites, and address those first.','A partner onboarding review is under way.',2,'partners'),
      O('signed','Signed','The remaining work is integration and change management.','',0)]},
    plan:{id:'plan',k:'The plan',q:'Is there an implementation plan with owners, budget and metrics?',o:[
      O('no','No','Prepare a plan that sequences the items above, with owners, budget bands and the metrics to be reported.','No implementation plan exists.',2,'plan'),
      O('deck','A presentation','Convert the presentation into a plan with owners, dates and budget bands.','The plan exists as a presentation without owners and dates.',2,'plan'),
      O('yes','Yes','The plan can be reviewed against the licensing and partner positions.','',0)]}
  };
  var FIN_BRANCH={idea:['customer','model','licence','plan'],proto:['customer','model','licence','plan'],live:['market','licence','providers','partners','plan'],scaling:['market','licence','providers','partners','plan']};
  var FWORK={evidence:['Weeks 1-3','Structured conversations with prospective customers, with a proposed price.'],
             model:['Weeks 2-4','Establish unit economics from measured inputs.'],
             licence:['Weeks 1-2','Assess the licensing position per market: activities, requirements, timeline.'],
             market:['Weeks 2-4','Select the next market on licensing, reach and partner availability.'],
             providers:['Weeks 3-6','Compare providers against requirements, cost, assurance and exit terms.'],
             partners:['Weeks 4-12','Obtain the partner\'s onboarding requirements and prepare the evidence.'],
             plan:['Weeks 3-4','Prepare the implementation plan: owners, sequence, budget bands, metrics.']};
  var FWORK_ORDER=['licence','evidence','model','market','providers','partners','plan'];
  var FIN={
    key:'fin',name:'Fintech readiness assessment',kind:'flow',
    steps:function(ans){var s=[FIN_STEPS.stage];var st=ans.stage;if(st)FIN_BRANCH[st.v].forEach(function(id){s.push(FIN_STEPS[id]);});return s;},
    result:function(ans,steps){
      var st=ans.stage.v, picks=steps.map(function(x){return ans[x.id];}).filter(Boolean);
      var findings=picks.filter(function(o){return o.w>0&&o!==ans.stage;}).sort(function(a,b){return b.w-a.w;}).slice(0,5);
      var tags={};picks.forEach(function(o){if(o.tag)tags[o.tag]=1;});
      var order=FWORK_ORDER.filter(function(k){return tags[k];}).slice(0,5).map(function(k){return {w:FWORK[k][0],t:FWORK[k][1]};});
      var heavy=findings.reduce(function(a,o){return a+o.w;},0);
      var title=(st==='idea'||st==='proto')?(tags.evidence?'Customer demand and pricing are not yet tested.':tags.licence?'The licensing position needs to be established.':'Demand, model and licensing are in place.')
        :((tags.licence||tags.market)?'The next market and its licensing position need to be established.':tags.partners?'The partner onboarding is the constraint.':tags.providers?'Provider selection needs a documented comparison.':'The prerequisites for the next market are in place.');
      var lead={idea:'On these answers, the items below are what an investor or partner would need to see: evidence of demand, a cost basis for pricing, and a licensing position.',
        proto:'On these answers, the items below are the open questions between the prototype and a business: demand, pricing, cost to serve and licensing.',
        live:'On these answers, the items below are the open questions for the next market: licensing, provider selection and the partner position.',
        scaling:'On these answers, the items below are where the plan for the next market is less developed than the plan for the first.'}[st];
      var asks=(st==='idea'||st==='proto')?['What do customers pay, and what does it cost to serve them?','Which activities does the product perform, and do they require a licence in the launch market?','Who are the first customers?']:['Under which licence does the product operate in each market, and who is responsible for compliance?','Which providers hold customer funds and data, and what assurance do they provide?','What is the status and timeline of the bank or network partnership?'];
      var fit=(tags.partners&&ans.partners&&ans.partners.v==='inreview')?'Whether to involve us: during a partner onboarding review, the relevant support is preparing the evidence in the order the review requires and responding to the review\'s questions.'
        :(heavy<=2)?'Whether to involve us: on these answers the plan is largely in place. A review of the licensing position and partner terms before signing may be useful.'
        :'Whether to involve us: a two-week assessment covers the segment and product, unit economics, the licensing position per market, provider comparison and partner requirements, and produces an implementation plan.';
      var summary='Stage: '+ans.stage.t+'.\n'+FIN.name+': '+title+'\nFindings:\n'+findings.map(function(o){return '- '+o.f;}).join('\n')+'\nOrder of work:\n'+order.map(function(w){return '- '+w.w+': '+w.t;}).join('\n');
      return {title:title,lead:lead,findings:findings.map(function(o){return o.f;}),asksLabel:'Questions an investor, partner or regulator is likely to ask',asks:asks,order:order,fit:fit,summary:summary};
    }
  };

  /* ================= 03 Security due diligence ================= */
  var TRI=['In place','Partly','Not yet'];
  var SEC={
    key:'sec',name:'Security due-diligence check',kind:'list',
    intake:[{id:'who',k:'The review',q:'Who is conducting the review?',o:[
      O('customer','A customer\'s security team','Customer reviews typically request evidence for a sample of the answers.','',0),
      O('partner','A bank or partner\'s third-party review','Third-party reviews typically have a deadline and defined prerequisites.','',0),
      O('investor','An investor\'s due diligence','Investor reviews typically focus on governance, incident history and dated remediation plans.','',0),
      O('board','No external review; an internal assessment','The list below can serve as the order of work.','',0)]},
      {id:'when',k:'The date',q:'When is it due?',o:[O('2','Within two weeks','Two weeks allows evidence to be assembled for items already in place.','',0),O('4','Within 30 days','Thirty days allows the shorter items to be completed.','',0),O('13','Within 90 days','Ninety days allows most items to be completed if owners are assigned promptly.','',0),O('0','No date','The list below can serve as the plan.','',0)]},
      {id:'estate',k:'The estate',q:'Where do the systems run?',o:[O('cloud','Cloud services only','Supplier and cloud responsibility items carry most of the weight.','',0),O('mixed','Cloud and on-premise','Both sets of evidence are needed, with a scope statement identifying which systems are which.','',0),O('onprem','Mostly on-premise','Backup restore tests and access reviews are commonly requested as performed, not described.','',0)]}],
    title:'Mark each item as it stands today.',
    intro:'In place means the control is documented, operating, and evidenced. Partly means one of the three is missing. The list follows the order in which reviews commonly proceed. This is a self-assessment; it records your answers and does not verify them.',
    groups:[
      ['Governance',[['A security policy approved by management, with a named owner, reviewed within the year','ISO 27001 A.5.1',1,'Reviewers typically ask who approved the policy, when, and who owns it.'],['A risk assessment with treatment decisions: what is accepted, what is being addressed, by whom','ISO 27001 6.1.2',3,'Reviewers typically ask for the treatment decisions and dates, not only the register.']]],
      ['Access',[['Multi-factor authentication on email, cloud consoles and remote access, without exceptions','A.8.5 · SOC 2 CC6.1',1,'Reviewers typically ask for confirmation across all cloud consoles and remote paths, including administrators.'],['Joiner, mover and leaver procedures, with evidence of timely removal','A.5.18 · CC6.2',2,'Reviewers typically ask for a recent leaver and the date access was removed.'],['Privileged accounts listed and reviewed quarterly, with the review record','A.8.2 · CC6.3',2,'Reviewers typically ask for the record of the most recent review.']]],
      ['Data',[['An inventory of the systems and data that hold customer information, each with an owner','A.5.9 · CC3',3,'Reviewers typically select systems from the inventory and ask their owners about them.'],['Encryption in transit and at rest, with key management described','A.8.24 · CC6.7',2,'Reviewers typically ask who can access keys and how that access is reviewed.']]],
      ['Suppliers and cloud',[['A register of the suppliers that hold your data, with assurance on file for each','A.5.19 · CC9.2',3,'Reviewers typically ask for each supplier\'s SOC 2 report, ISO certificate or completed questionnaire.'],['The division of security responsibilities with each cloud provider, documented per service','A.5.23',2,'Reviewers typically ask for the responsibility model per service rather than the provider\'s general documentation.']]],
      ['Operations',[['Vulnerability management with defined patch windows and evidence of closure','A.8.8 · CC7.1',3,'Reviewers typically ask for the patch windows and one example of a critical vulnerability closed within them.'],['Change management for production, with approvals recorded','A.8.32 · CC8.1',2,'Reviewers typically ask who approves production changes and for recent records.'],['Logging on critical systems, protected from alteration, with a review record','A.8.15 · CC7.2',3,'Reviewers typically ask which systems log, where logs are held, who reviews them and how they are protected.']]],
      ['Resilience',[['Backups tested by restore and stored separately from production','A.8.13 · A1.2',2,'Reviewers typically ask for the date of the last restore test and who performed it.'],['An incident-response plan with roles, escalation and customer notification, exercised within the year','A.5.24 · CC7.4',2,'Reviewers typically ask for the plan, the record of the last exercise, and how customers would be notified.']]]
    ],
    result:function(ans,items){
      var who=ans.who.v, dl=parseInt(ans.when.v,10);
      var wk=function(it){return it.s===1?Math.ceil(it.wk/2):it.wk;};
      var ok=items.filter(function(it){return it.s===0;}), open=items.filter(function(it){return it.s!==0;}), unmarked=items.filter(function(it){return it.s<0;}).length;
      var total=open.length?Math.max.apply(null,open.map(wk)):0;
      var weakest=open.slice().sort(function(a,b){return wk(b)-wk(a);});
      var title=ok.length+' of '+items.length+' items marked in place.';
      var lead=open.length?'On these answers, '+open.length+' items are open'+(unmarked?' ('+unmarked+' not marked)':'')+'. The indicative time to address them is about '+total+' weeks, assuming each has an assigned owner and work proceeds in parallel; the longest single item determines the date. The estimates are indicative and depend on the estate.'
        :'On these answers, all '+items.length+' items are marked in place. This check records your assessment and cannot verify it; a reviewer will typically request evidence for a sample of items, most often access, suppliers and incident response.';
      var whoLine={customer:'Customer security teams typically request evidence for a sample of answers rather than all of them.',partner:'Third-party reviews typically have prerequisites; confirm which items the reviewer treats as such and address them first.',investor:'Investor reviews typically accept dated remediation plans for open items.',board:'For an internal assessment, the order below can serve as the plan.'}[who];
      var estLine={cloud:'For a cloud-only estate, the supplier and cloud responsibility items carry most of the weight.',mixed:'For a mixed estate, a scope statement identifying which systems are in which environment is typically requested.',onprem:'For an on-premise estate, restore tests and access reviews are typically requested as performed.'}[ans.estate.v];
      var findings=weakest.slice(0,5).map(function(it){return it.t.split(',')[0]+': '+(it.s===1?'partly in place':it.s===2?'not in place':'not marked')+', indicatively '+wk(it)+' weeks. '+it.n;});
      if(!findings.length)findings.push('No open items on these answers. Prepare the evidence a reviewer is likely to sample: access removals, supplier assurance, the last restore test and the last incident exercise.');
      var order=open.map(function(it){return {w:wk(it)+' wk',t:it.t.split(',')[0]};}).slice(0,7);
      var date='';if(dl){date=total<=dl?'Against the date given, the indicative timeline fits'+(dl-total>0?', with about '+(dl-total)+(dl-total===1?' week':' weeks')+' of margin.':'.'):'Against the date given, the indicative timeline exceeds it by about '+(total-dl)+(total-dl===1?' week':' weeks')+'. Items that cannot be completed by the date can be reported with a remediation date.';}
      var asks=['When was access last removed for a leaver, and how quickly?','Which suppliers hold customer data, and what assurance is held for each?','When was the last restore test, and what happened in the last security incident?'];
      var fit=open.length>=8?'Whether to involve us: an assessment covers the posture against the frameworks the reviewer references, the architecture and supplier review, and a remediation plan in the reviewer\'s order. We prepare organisations for reviews and audits; we do not perform audits.'
        :open.length?'Whether to involve us: support may be useful for the questionnaire responses and for the items with the longest indicative timelines. The remaining items can be addressed internally using this list.'
        :'Whether to involve us: on these answers, the remaining work is preparing the evidence for the review. An independent check of the evidence before submission may be useful.';
      var summary='Review: '+ans.who.t+'. Date: '+ans.when.t+'. Estate: '+ans.estate.t+'.\n'+SEC.name+': '+title+' Indicative time to address open items: '+total+' weeks.\n'+(date?date+'\n':'')+'Open items:\n'+open.map(function(it){return '- '+it.t.split(',')[0]+' ['+(it.s===1?'partly':it.s===2?'not in place':'not marked')+']';}).join('\n');
      return {title:title,lead:lead,lead2:whoLine+' '+estLine+(date?' '+date:''),findings:findings,asksLabel:'Questions a reviewer is likely to ask',asks:asks,order:order,fit:fit,summary:summary};
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
    step.o.forEach(function(o){var b=btn('opt'+(val&&val.v===o.v?' sel':''),'<span class="r"></span><span>'+o.t+'</span>',function(){[].forEach.call(opts.children,function(x){x.classList.toggle('sel',x===b);x.setAttribute('aria-checked',x===b?'true':'false');});ins.innerHTML='<span class="k">What this indicates</span>'+o.i;ins.hidden=false;next.disabled=false;onPick(o);});
      b.setAttribute('role','radio');b.setAttribute('aria-checked',val&&val.v===o.v?'true':'false');opts.appendChild(b);});
    body.appendChild(opts);if(val){ins.innerHTML='<span class="k">What this indicates</span>'+val.i;ins.hidden=false;}body.appendChild(ins);root.appendChild(body);
    var foot=el('div','foot');foot.appendChild(el('span','note','Nothing is stored. The next question depends on this answer.'));var nav=el('div','nav');
    var back=btn(null,'Back',onBack);back.disabled=!onBack;next=btn('pri',(isLast?'See the result':'Next')+' '+arrow(),onNext);next.disabled=!val;nav.appendChild(back);nav.appendChild(next);foot.appendChild(nav);root.appendChild(foot);
  }
  function resultView(root,def,R,restart,restartLabel){
    root.innerHTML='';root.appendChild(header(def,'Result',1));
    var body=el('div','body step-in'),res=el('div','res');
    res.appendChild(el('h4',null,R.title));res.appendChild(el('p',null,R.lead));if(R.lead2)res.appendChild(el('p',null,R.lead2));
    res.appendChild(el('div','sec','Findings'));var fl=el('ol','findings');R.findings.forEach(function(f,i){fl.appendChild(el('li',null,'<b>'+(i+1<10?'0':'')+(i+1)+'</b><span>'+f+'</span>'));});res.appendChild(fl);
    res.appendChild(el('div','sec',R.asksLabel));var al=el('ul','asks');R.asks.forEach(function(a){al.appendChild(el('li',null,a));});res.appendChild(al);
    if(R.order.length){res.appendChild(el('div','sec','Suggested order of work'));var ol=el('ol','order');R.order.forEach(function(w){ol.appendChild(el('li',null,'<span class="w">'+w.w+'</span><span>'+w.t+'</span>'));});res.appendChild(ol);}
    res.appendChild(el('div','foryou','<p class="need">'+R.fit+'</p>'));
    var acts=el('div','acts');acts.appendChild(btn('pri','Send this result with an enquiry '+arrow(),function(){send(R.summary);}));acts.appendChild(btn(null,restartLabel||'Start again',restart));
    res.appendChild(acts);body.appendChild(res);root.appendChild(body);sendbar(R.summary);
  }

  function mountFlow(root,def){
    var ans={},i=0;
    function render(){removeBar();var steps=def.steps(ans);
      if(i>=steps.length){var R=def.result(ans,steps);return resultView(root,def,R,function(){ans={};i=0;render();});}
      var st=steps[i];
      question(root,def,st,ans[st.id],function(o){var prev=ans[st.id];ans[st.id]=o;if(i===0&&prev&&prev.v!==o.v){var keep={};keep[st.id]=o;ans=keep;}},
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
        var ins=el('div','ins rowins');ins.hidden=it.s<0;if(it.s>=0)ins.innerHTML='<span class="k">What reviewers typically request</span>'+it.n;
        TRI2.forEach(function(lab,si){var b=btn('s'+si+(it.s===si?' on':''),lab,function(){it.s=si;[].forEach.call(seg.children,function(x,j){x.className='s'+j+(j===si?' on':'');x.setAttribute('aria-checked',j===si?'true':'false');});
            root.querySelector('.track i').style.width=Math.round((n+marked()/items.length)/(n+1)*100)+'%';note.innerHTML=footText();go.disabled=marked()===0;ins.innerHTML='<span class="k">What reviewers typically request</span>'+it.n;ins.hidden=false;});
          b.setAttribute('role','radio');b.setAttribute('aria-checked',it.s===si?'true':'false');seg.appendChild(b);});
        row.appendChild(seg);list.appendChild(row);list.appendChild(ins);});
      body.appendChild(list);root.appendChild(body);
      var foot=el('div','foot');note=el('span','note',footText());foot.appendChild(note);var nav=el('div','nav');
      nav.appendChild(btn(null,'Back',function(){stage=0;i=n-1;render();}));go=btn('pri','See the result '+arrow(),function(){stage=2;render();root.scrollIntoView({behavior:'auto',block:'nearest'});});go.disabled=marked()===0;nav.appendChild(go);foot.appendChild(nav);root.appendChild(foot);}
    function renderWrap(){root.innerHTML='';render();}
    render=(function(r){return function(){root.innerHTML='';r();};})(render);
    render();
  }

  var DEFS={ai:AI,fin:FIN,sec:SEC};
  document.querySelectorAll('[data-check]').forEach(function(root){var def=DEFS[root.getAttribute('data-check')];if(!def)return;if(def.kind==='flow')mountFlow(root,def);else mountList(root,def);});
})();

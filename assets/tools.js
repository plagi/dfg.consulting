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

  /* ================= 02 Fintech: product, model, market, licence, providers, partners ================= */
  var FIN_STEPS={
    stage:{id:'stage',k:'Where you are',q:'Where is the product?',o:[
      O('idea','An idea and a deck','Nothing to test yet except the customer. The first evidence to get is that someone will pay, and for what.','No product yet; the first work is customer evidence.',3,'evidence'),
      O('proto','A prototype, no paying customers','The product exists; the business model does not. Pricing and cost to serve decide whether it ever will.','A prototype without a tested business model.',3,'model'),
      O('live','Live, with paying customers','Product and model exist. The questions turn to the next market, its licence, and the partners it needs.','A live product; the next decisions are market, licence and partners.',1,'market'),
      O('scaling','Scaling into new markets or segments','Each market has its own licensing landscape and its own partners. Entering them in the wrong order costs a year.','Scaling into markets with different licensing and partners.',2,'market')]},
    customer:{id:'customer',k:'Customers',q:'Who pays, and do you know why?',o:[
      O('none','Nobody yet','Interest is not evidence. Ten conversations with a price on the table are.','No paying customer, and no price has been tested.',4,'evidence'),
      O('pilots','A few pilots, unpaid','Unpaid pilots test the product, not the model. Put a price on the next one.','Unpaid pilots; the price has not been tested.',3,'evidence'),
      O('guess','Paying customers, at a price we guessed','A guessed price is a price that will be renegotiated. Cost to serve says where it should sit.','Paying customers at an untested price.',2,'model'),
      O('tested','Paying customers, at a price we tested','Then the model can be written down and defended.','',0)]},
    model:{id:'model',k:'The model',q:'Do you know the unit economics?',o:[
      O('no','No','Without cost to serve and cost to acquire, growth is a guess with a burn rate.','Unit economics are unknown.',4,'model'),
      O('rough','Roughly, in a spreadsheet','A spreadsheet is fine if the inputs are measured rather than assumed. Check which ones are.','Unit economics are estimated, not measured.',2,'model'),
      O('yes','Yes: pricing, cost to serve, cost to acquire, payback','That is the page an investor reads first.','',0)]},
    licence:{id:'licence',k:'Licensing',q:'Does the product need a licence in the market you are entering?',o:[
      O('unknown','We do not know','Then nothing else is decided. The licensing landscape is the first week of a fintech Diagnosis.','The licensing requirement in the target market is unknown.',4,'licence'),
      O('lawyer','A lawyer gave a view','A view is not a plan. Which activities fall under which regime, and what can launch unregulated first.','A legal view exists; the licensing path is not planned.',3,'licence'),
      O('partner','We will operate under a licensed partner','Then the partner is your regulator too, and its onboarding review is the next gate.','The product depends on a licensed partner and its onboarding review.',2,'partners'),
      O('own','We hold, or are applying for, our own','Applications take longer than products. Sequence the launch around the date, not the hope.','Own licence held or in application; the launch has to be sequenced around it.',1,'licence')]},
    market:{id:'market',k:'The market',q:'Which market next, and why?',o:[
      O('undecided','Undecided','A market is chosen on three things: customers you can reach, a licence you can get, and a partner who will onboard you.','The next market is undecided.',3,'market'),
      O('size','The biggest opportunity','The biggest market is usually the slowest to license. Check the order before the budget.','The next market was chosen on size rather than on licence and partner availability.',3,'market'),
      O('reach','The one we can license and reach','The right reason. Now the partners.','',0)]},
    providers:{id:'providers',k:'Providers',q:'How were the providers chosen: KYC, payments, custody, core?',o:[
      O('first','Whoever answered first','Providers chosen by response time are replaced within two years, at your cost.','Providers were chosen without a comparison.',3,'providers'),
      O('price','Compared on price','Price is the smallest difference between providers. Exit terms and assurance are the large ones.','Providers were compared on price only.',2,'providers'),
      O('terms','Compared on terms, exit and assurance','Then the ecosystem is a decision rather than an accident.','',0),
      O('none','Not needed yet','They will be. Start the comparison before the need.','Providers are not yet selected.',1,'providers')]},
    partners:{id:'partners',k:'Partners',q:'Where is the bank or card-network partnership?',o:[
      O('none','Not needed','Check the licence answer. Most fintech products run on someone else\'s rails.','',0),
      O('notstarted','Needed, not started','A sponsor bank\'s review takes a quarter at best. Start with its evidence list.','A bank or network partnership is needed and has not started.',3,'partners'),
      O('inreview','In a bank\'s review now','The review runs in the bank\'s order and stops at the first hard stop: entity documents, regulatory status, the financial-crime programme.','A bank\'s review is under way.',2,'partners'),
      O('signed','Signed','Then the constraint moves to integration and the change process.','',0)]},
    plan:{id:'plan',k:'The plan',q:'Is there a plan with owners, budget bands and the metrics to watch?',o:[
      O('no','No','Then the answers above are opinions. A plan is what turns them into a sequence.','There is no plan with owners and metrics.',2,'plan'),
      O('deck','A deck','Decks persuade; plans get followed. The difference is owners and dates.','A deck stands in for a plan.',2,'plan'),
      O('yes','Yes','Good. A Diagnosis would test it against the licensing and the partners.','',0)]}
  };
  var FIN_BRANCH={idea:['customer','model','licence','plan'],proto:['customer','model','licence','plan'],live:['market','licence','providers','partners','plan'],scaling:['market','licence','providers','partners','plan']};
  var FWORK={evidence:['Weeks 1-3','Ten customer conversations with a price on the table, written up.'],
             model:['Weeks 2-4','Unit economics from measured inputs: pricing, cost to serve, cost to acquire, payback.'],
             licence:['Weeks 1-2','The licensing landscape per market: which activities need a licence, and what can launch first.'],
             market:['Weeks 2-4','Choose the next market on licence, reach and partner availability, in that order.'],
             providers:['Weeks 3-6','Compare the providers on terms, exit and assurance, and contract accordingly.'],
             partners:['Weeks 4-12','Design the partnership and prepare the evidence a bank\'s review will ask for, in its order.'],
             plan:['Weeks 3-4','The plan: owners, sequence, budget bands, and the metrics that show within a quarter whether it works.']};
  var FWORK_ORDER=['licence','evidence','model','market','providers','partners','plan'];
  var FIN={
    key:'fin',name:'Fintech readiness diagnosis',kind:'flow',
    steps:function(ans){var s=[FIN_STEPS.stage];var st=ans.stage;if(st)FIN_BRANCH[st.v].forEach(function(id){s.push(FIN_STEPS[id]);});return s;},
    result:function(ans,steps){
      var st=ans.stage.v, picks=steps.map(function(x){return ans[x.id];}).filter(Boolean);
      var findings=picks.filter(function(o){return o.w>0&&o!==ans.stage;}).sort(function(a,b){return b.w-a.w;}).slice(0,5);
      var tags={};picks.forEach(function(o){if(o.tag)tags[o.tag]=1;});if(!tags.plan&&ans.plan&&ans.plan.w>0)tags.plan=1;
      var order=FWORK_ORDER.filter(function(k){return tags[k];}).slice(0,5).map(function(k){return {w:FWORK[k][0],t:FWORK[k][1]};});
      var heavy=findings.reduce(function(a,o){return a+o.w;},0);
      var title=(st==='idea'||st==='proto')?(tags.evidence?'The product is ahead of the evidence.':tags.licence?'The model is there; the licence is not decided.':'A product with a model behind it.')
        :(tags.licence||tags.market?'The next market is not yet a decision.':tags.partners?'The rails are the constraint.':tags.providers?'The product runs on providers chosen by accident.':'Ready for the next market.');
      var lead={idea:'A fintech at this stage is decided by three things: whether anyone will pay, what it costs to serve them, and whether the product needs a licence where it launches. The findings say which of the three is unanswered.',
        proto:'A prototype proves the product works. It does not prove the business does. The findings are what an investor or a partner bank would find missing in the first meeting.',
        live:'With customers paying, the questions are where to go next and on whose licence and rails. The order of those decisions decides how long the next year takes.',
        scaling:'Each new market brings a licensing landscape, providers and partners of its own. The findings are where the plan for the next market is thinner than the plan for the first.'}[st];
      var asks=(st==='idea'||st==='proto')?['What does one customer pay, and what does it cost to serve them?','Which activity are you performing, and does it need a licence where you launch?','Who are the first ten customers, by name?']:['Under which licence do you operate in each market, and who is your compliance officer?','Which providers hold your customers\' money and data, and what assurance do you hold on them?','Where is the sponsor bank or the card programme, and what is the date?'];
      var fit=(st==='idea'&&tags.evidence)?'Do you need us? Not yet. The next step is ten conversations with a price on the table, and nobody should be paid to have them for you. When you have the answers and need a model, a market and a licensing path written down, that is a Diagnosis.'
        :(tags.partners&&ans.partners&&ans.partners.v==='inreview')?'Do you need us? For the review, perhaps. We have sat on the bank\'s side of it; the value is answering the questions in the bank\'s order and knowing which ones stop the file.'
        :(heavy<=2)?'Do you need us? Probably not for a Diagnosis. The plan holds; what would help is a second reading of the licensing and the partner terms before you sign.'
        :'Do you need us? This is what the fintech Diagnosis is for: two weeks on the segment, the model, the licensing landscape, the providers and the partners, and a plan with owners and budget bands.';
      var summary='Stage: '+ans.stage.t+'.\n'+FIN.name+': '+title+'\nFindings:\n'+findings.map(function(o){return '- '+o.f;}).join('\n')+'\nOrder of work:\n'+order.map(function(w){return '- '+w.w+': '+w.t;}).join('\n');
      return {title:title,lead:lead,findings:findings.map(function(o){return o.f;}),asksLabel:'What an investor, a partner bank or a regulator will ask',asks:asks,order:order,fit:fit,summary:summary};
    }
  };

  /* ================= 03 Security: what a customer's due-diligence review asks ================= */
  var TRI=['In place','Partly','Not yet'];
  var SEC={
    key:'sec',name:'Security due-diligence check',kind:'list',
    intake:[{id:'who',k:'Who is asking',q:'Who is asking?',o:[
      O('customer','A customer\'s security questionnaire','A customer\'s security team reads the answers, then asks for the evidence behind three or four of them.','',0),
      O('partner','A bank or partner\'s third-party review','A third-party review is a questionnaire with a deadline and a person who can say no.','',0),
      O('investor','An investor\'s due diligence','Investors ask fewer questions and want dates on all of them.','',0),
      O('board','Nobody yet; the board wants to know where we stand','Then this is the order of work, and the date is yours.','',0)]},
      {id:'when',k:'The date',q:'When is it due?',o:[O('2','Within two weeks','Two weeks is enough to assemble what exists and to be honest about the rest.','',0),O('4','Within 30 days','Thirty days closes the quick items: MFA, the policy, the supplier register.','',0),O('13','Within 90 days','Ninety days closes most of the list if the owners are named this week.','',0),O('0','No date','Then the list is the plan.','',0)]},
      {id:'estate',k:'The estate',q:'Where does the estate run?',o:[O('cloud','Cloud-native, no servers of our own','The cloud and supplier items carry most of the weight; your customers\' data sits with your providers.','',0),O('mixed','Mixed cloud and on-premise','Both kinds of evidence, and a scope statement that says which system is which.','',0),O('onprem','Mostly on-premise','Backup restores and access reviews are the two a reviewer asks to see performed.','',0)]}],
    title:'Mark each item as it stands today.',
    intro:'In place means it is written, it operates, and there is evidence. Partly means one of the three is missing. The list is in the order a reviewer works through it.',
    groups:[
      ['Governance',[['A security policy approved by management, with a named owner, reviewed within the year','ISO 27001 A.5.1',1,'The reviewer asks who approved it, when, and who owns it now.'],['A risk assessment with treatment decisions: what is accepted, what is being fixed, by whom','ISO 27001 6.1.2',3,'A register of risks with no decisions is a list. The reviewer wants the decisions and the dates.']]],
      ['Access',[['Multi-factor authentication on email, cloud consoles and remote access, with no exceptions','A.8.5 · SOC 2 CC6.1',1,'Everywhere, including every cloud console and every remote path. One admin without it is the finding.'],['Joiner, mover and leaver procedures, with evidence that the last leaver was removed on time','A.5.18 · CC6.2',2,'The reviewer asks for the last leaver and the date access was removed.'],['Privileged accounts listed and reviewed quarterly, with the review record','A.8.2 · CC6.3',2,'The list, and the record of the last review. The reviewer samples the review, not the list.']]],
      ['Data',[['An inventory of the systems and data that hold customer information, each with an owner','A.5.9 · CC3',3,'Which systems hold customer data, where, and who owns each. The reviewer picks three and asks the owners.'],['Encryption in transit and at rest, and who holds the keys','A.8.24 · CC6.7',2,'Encryption is assumed; key management is asked about. Who can decrypt, and how is that reviewed?']]],
      ['Suppliers and cloud',[['A register of the suppliers that hold your data, each with its own assurance on file','A.5.19 · CC9.2',3,'The register, and for each supplier a SOC 2 report, an ISO certificate, or a completed questionnaire.'],['The split of responsibilities with each cloud provider, written down per service','A.5.23',2,'What the provider secures and what you do, per service. A shared-responsibility diagram is evidence; their marketing page is not.']]],
      ['Operations',[['Vulnerability management with defined patch windows, and evidence that a critical was closed inside one','A.8.8 · CC7.1',3,'Patch windows defined, and one example of a critical closed within the window. Scanner output alone is not closure.'],['Change management for production, with approvals recorded','A.8.32 · CC8.1',2,'Who approves a production change, and the record of the last ten.'],['Logging on critical systems, protected from change, with a review record','A.8.15 · CC7.2',3,'Which systems log, where the logs go, who reviews them, and that they cannot be edited.']]],
      ['Resilience',[['Backups taken, tested by restore, and stored separately from production','A.8.13 · A1.2',2,'The date of the last restore test and who signed it. A backup job log is not evidence of a restore.'],['An incident-response plan with roles, escalation and customer notification, rehearsed within the year','A.5.24 · CC7.4',2,'The plan, the record of the last rehearsal, and how customers would be told. The reviewer asks about the last real incident.']]]
    ],
    result:function(ans,items){
      var who=ans.who.v, dl=parseInt(ans.when.v,10);
      var wk=function(it){return it.s===1?Math.ceil(it.wk/2):it.wk;};
      var ok=items.filter(function(it){return it.s===0;}), open=items.filter(function(it){return it.s!==0;});
      var total=open.length?Math.max.apply(null,open.map(wk)):0;
      var weakest=open.slice().sort(function(a,b){return wk(b)-wk(a);});
      var title='You can answer '+ok.length+' of '+items.length+' with evidence today.';
      var lead=open.length?'A reviewer accepts an honest date more readily than a hopeful yes. The '+open.length+' open items below take about '+total+' weeks if their owners are named this week and the work runs in parallel; the longest single item sets the date.'
        :'Everything a due-diligence review asks about is in place with evidence. What remains is answering the questionnaire in the reviewer\'s language, and having the evidence ready before it is asked for.';
      var whoLine={customer:'A customer\'s security team will read the answers and ask for the evidence behind three or four of them, usually access, suppliers and incident response.',partner:'A bank or partner review has a deadline and a person who can say no. Send the honest answers early and the evidence as it exists.',investor:'An investor asks fewer questions and wants dates on all of them; the order of work below is the answer.',board:'For the board, the list below is the plan, and the weeks are the schedule.'}[who];
      var estLine={cloud:'Cloud-native: the supplier and cloud items carry your customers\' data; they matter more than anything physical.',mixed:'Mixed estate: say which systems are which, or the reviewer samples the wrong ones.',onprem:'On-premise: the restore test and the access review are the two things a reviewer asks to see done, not described.'}[ans.estate.v];
      var findings=weakest.slice(0,5).map(function(it){return it.t.split(',')[0]+': '+(it.s===1?'partly':it.s===2?'not yet':'not marked')+', about '+wk(it)+' weeks. '+it.n;});
      if(!findings.length)findings.push('Nothing open. Expect the reviewer to sample the records behind access, suppliers and incident response rather than the documents.');
      var order=open.map(function(it){return {w:wk(it)+' wk',t:it.t.split(',')[0]};}).slice(0,7);
      var date='';if(dl){date=total<=dl?(dl-total>0?'Against your date: on time, with about '+(dl-total)+(dl-total===1?' week':' weeks')+' of margin.':'Against your date: on time, with no margin.'):'Against your date: about '+(total-dl)+(total-dl===1?' week':' weeks')+' short on these answers. What can be done by the date is the quick items and honest dates on the rest; reviewers accept dates, not silence.';}
      var asks=['Show me the last leaver and when their access was removed.','Which suppliers hold our data, and what assurance do you hold on each?','When was the last restore test, and what happened in the last incident?'];
      var fit=open.length>=8?'Do you need us? For the posture assessment and the order of remediation, yes. The list is known; what takes time is deciding what to accept, what to fix, and proving it with evidence. We prepare you for the review and, if there is one, for the audit; we do not perform audits.'
        :open.length?'Do you need us? Perhaps for the questionnaire itself and the two or three items with the longest weeks. The rest your team can close with this as the list.'
        :'Do you need us? No. Answer the questionnaire and have the evidence ready.';
      var summary='Asking: '+ans.who.t+'. Date: '+ans.when.t+'. Estate: '+ans.estate.t+'.\n'+SEC.name+': '+title+' About '+total+' weeks to close the rest.\n'+(date?date+'\n':'')+'Open items:\n'+open.map(function(it){return '- '+it.t.split(',')[0]+' ['+(it.s===1?'partly':it.s===2?'not yet':'not marked')+']';}).join('\n');
      return {title:title,lead:lead,lead2:whoLine+' '+estLine+(date?' '+date:''),findings:findings,asksLabel:'What the reviewer will ask on the call',asks:asks,order:order,fit:fit,summary:summary};
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

  var DEFS={ai:AI,fin:FIN,sec:SEC};
  document.querySelectorAll('[data-check]').forEach(function(root){var def=DEFS[root.getAttribute('data-check')];if(!def)return;if(def.kind==='flow')mountFlow(root,def);else mountList(root,def);});
})();

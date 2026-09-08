# DFG website implementation

Implemented locally on 8 September 2026 against [the consolidated plan](DFG-WEBSITE-FIX-PLAN.md). Production has not been deployed by this implementation task.

## Story and disclosure

The homepage introduces the offer, immediately explains the deliverables for all four services, then presents services and engagement choices, offers optional self-assessments and finally invites an enquiry. Each deliverable description identifies the documents, their contents and the decision they support. Navigation and the hero's next-section link follow that order. This section describes the offer, not verified client evidence; illustrative samples remain on service pages. The same logic continues within service pages: situation → work → deliverable → client inputs and responsibilities → next step.

Four service pages contain the five agreed initial engagements. AI investment and pilot review are distinct offers on one page. Data and architecture reviews are scoped workstreams rather than a broad standalone product. Incident preparedness is within the security page, explicitly distinct from emergency response. The old URLs redirect to those subsections, including HTML and trailing-slash forms; their previous content remains recoverable from Git history.

The universal timeline and mandatory Assessment/Plan/Stay progression have been replaced by optional engagement types with distinct outputs. ISO certification and approval guarantees are excluded. The stage section, its controller and unused stage scenes/styles were retired; the hero illustration and visual identity remain.

## Confirmed delivery model

The owner confirmed that DFG implements directly and through partners depending on the task. Homepage outputs and engagement options now cover implemented solutions or operational changes, acceptance checks and handover, as well as advisory documents. Service pages no longer assign all implementation to the client. Each scope must identify the delivery team, responsibilities and acceptance criteria. This supersedes the advisory-only assumptions in the original plan and the initial-engagement table below.

## Offer contract

| Engagement | Decision | Output | Responsibility / completion |
|---|---|---|---|
| AI investment assessment | Pursue, test, defer or stop an initiative | Investment brief with value assumptions, feasibility and delivery options | DFG reviews agreed evidence and discusses the recommendation; sponsor owns investment decision |
| AI pilot review | Whether and how to fund further work | Evidence-linked findings, continuation options and remaining dependencies | DFG reviews the scoped pilot; implementation can be commissioned directly or with delivery partners |
| Fintech launch and market entry | Validate, launch or enter another market | Commercial model and market-entry decision brief | DFG provides analysis and planning; legal advice and approvals remain with qualified parties |
| Partner and provider selection | Which option fits the operating requirements | Selection matrix, recommendation and onboarding dependencies | Client appoints/contracts; providers and internal teams integrate |
| Customer security review support | What can be evidenced and what needs action | Evidence register, supported responses and gap plan | DFG supports the agreed review; no certification or customer-approval promise |

## Assessment behavior

Questions and inference rules are separate from browser rendering. Only selected facts produce domain findings. Context such as role, vendor involvement or portfolio size is not scored. The result separates reported strengths, gaps, unknowns and applicability exclusions. No numeric maturity score or effort estimate is generated.

Users can skip questions, review/edit answers and change branches. Inactive branch data is removed. Not-applicable control responses require a reason. Summaries remain local until explicitly included and submitted in an enquiry. Re-including a summary preserves additional enquiry text. Contact delivery now preserves longer summaries up to the explicit 20,000-character limit instead of silently truncating at 5,000.

## Evidence and publication limits

No principal biography, permission-cleared client case or verified outcome was supplied during implementation. The site therefore uses labelled illustrative decision briefs and evidence-register examples, without client logos, invented biographies or performance claims. Add verified material beside the relevant offers when it is available; no empty Experience section is published.

Service responsibilities follow the supplied plan and existing advisory model. No competitor service was added merely to match its catalogue. Reply/proposal deadlines are not invented.

## Verification

Run `npm test` for consequential inference, routing and contact-boundary checks. Run `npm run test:browser` for all retained pages at 390, 768 and 1440 pixels, internal links, branch edits, applicability reasons and summary submission with mocked transport. Browser screenshots are in [preview](preview/).

Use `npm run preview` to review locally. Cloudflare deployment, actual provider delivery and legal compliance were not certified by these local checks. Research and development artifacts are excluded from the deploy script's upload staging directory.

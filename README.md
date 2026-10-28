# dfg.consulting

Public website for DFG. Digital Frontiers Group.

Static site with no production build step. DFG is positioned as an independent advisory firm for AI, fintech and cybersecurity. The homepage follows the advix.com pattern: a "Which stage are you at?" picker, four areas of expertise, how we work, self-assessments and an enquiry form. Google Fonts supplies the typefaces. Node dependencies are for development and verification only.

## Editing pages

Service names, stages, expertise pages and the shared header, footer and enquiry block live in one place: `scripts/build-pages.cjs`. Edit the registry there, then run:

```bash
npm run build:pages
```

The script writes `index.html` and `expertise/*.html`, refreshes the header, footer and enquiry block on the other pages and regenerates `sitemap.xml`. Do not hand-edit those generated parts; the next build overwrites them.

## Files

- `index.html` — hero, stage picker, expertise, how we work, self-assessments, enquiry (generated)
- `expertise/ai-strategy.html`, `expertise/it-strategy.html`, `expertise/fintech-product.html`, `expertise/security-posture.html` — AI strategy, IT strategy, Fintech and payments, Cybersecurity (generated)
- `ai-readiness.html`, `fintech-readiness.html`, `security-check.html` — self-assessments, served at clean URLs without `.html`
- `privacy.html`, `terms.html` — legal pages
- `404.html` — not-found page
- `assets/site.css` — shared visual system; `assets/site.js` — menu, stage tabs, scroll reveals and contact form
- `assets/assessment-model.js` — questions, branching, directly supported findings and editable summary serialization; also importable in Node tests
- `assets/tools.js` — accessible question, answer-review and result views; no answer persistence or network calls
- `assets/city.js` — the hero illustration, with reduced-motion support and a pause control
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `og.png`
- `_headers` — security headers and long-lived caching for versioned assets
- `functions/api/contact.js` — enquiry delivery; messages over 20,000 characters are rejected rather than truncated
- `functions/_middleware.js` — canonical host, Content Security Policy with a per-request nonce, and legacy-path redirects (`/expertise/partnerships` to Fintech and payments, `/expertise/data-and-it` to IT strategy)
- `scripts/build-pages.cjs` — page generator and single source of service names
- `scripts/preview.cjs` — local server with clean URLs and production legacy-path rules; no email delivery
- `scripts/social-card.html` — source layout for the 1200 × 630 social image
- `tests/` — assessment-rule, route and enquiry-boundary tests; browser journeys with intercepted email delivery
- `docs/` — plan, research, implementation notes and generated preview screenshots; excluded from deployment
- `deploy.sh` — pushes the site to Cloudflare Pages

## Hosting

Cloudflare Pages, project `dfg-consulting` (account: vorobiev.alexey@gmail.com).
Preview URL: https://dfg-consulting.pages.dev. Custom domains: dfg.consulting and www.dfg.consulting.

Deploy with:

```bash
./deploy.sh
```

Wrangler must be logged in once (`npx wrangler login`). There is no git integration; deploys are manual.

DNS is on Cloudflare (nameservers boyd.ns.cloudflare.com and heather.ns.cloudflare.com); the registrar is GoDaddy.

| Type  | Name | Value                      | Proxy |
|-------|------|----------------------------|-------|
| CNAME | @    | dfg-consulting.pages.dev   | on    |
| CNAME | www  | dfg.consulting             | on    |

## Contact form

The form posts JSON to `/api/contact`, a Pages Function that sends the message to hello@dfg.consulting through [Resend](https://resend.com). If the endpoint is unavailable or not configured, the page falls back to opening the visitor's mail client with the message prefilled.

Configure once in Cloudflare Pages > dfg-consulting > Settings > Variables and Secrets:

| Name             | Type   | Value                                                    |
|------------------|--------|----------------------------------------------------------|
| `RESEND_API_KEY` | secret | API key from Resend                                      |
| `CONTACT_FROM`   | text   | optional, default `DFG website <website@dfg.consulting>` |
| `CONTACT_TO`     | text   | optional, default `hello@dfg.consulting`                 |

Or from the terminal:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name dfg-consulting
```

The sending domain (dfg.consulting) must be verified in Resend, which means adding its SPF and DKIM records in Cloudflare DNS.

The optional booking button is hidden until `BOOKING_URL` in `assets/site.js` is set.

An assessment summary is included in the editable enquiry text only at the visitor's request. Nothing is submitted until Send enquiry is pressed. Answers are cleared on reload. Results describe self-reported information, not a verified diagnosis, certification, readiness score or delivery schedule.

## Local preview

```bash
npm install
npm run preview
```

Open http://127.0.0.1:8080. If that port is occupied, use `PORT=4173 npm run preview`. The server implements clean URLs and legacy redirects; a generic static server does not reproduce that routing.

## Verification

```bash
npm test
npx playwright install chromium
npm run test:browser
```

Browser checks create `docs/preview/` screenshots, exercise all retained pages at three widths, check internal links, edit assessment branches and intercept the enquiry endpoint. They do not send real messages. The preview server does not exercise Cloudflare hosting configuration; deployment remains a separate operation.

The deploy script excludes research, tests, development scripts and Node dependencies from the published site. Do not add invented credentials or client claims: the current site uses clearly labelled illustrative work samples pending permission-cleared evidence.

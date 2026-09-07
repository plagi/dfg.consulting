# dfg.consulting

Public website for DFG. Digital Frontiers Group.

Static site, no build step. Six HTML pages sharing one stylesheet and three small scripts; the only external dependency is Google Fonts.

## Files

- `index.html` — homepage
- `ai-readiness.html`, `bank-onboarding.html`, `iso-27001.html` — the three checks, one page each (served at clean URLs without `.html`)
- `privacy.html`, `terms.html` — legal pages
- `404.html` — not-found page
- `assets/site.css` — all styles; `assets/site.js` — header, contact form; `assets/tools.js` — the three checks; `assets/city.js` — the world renderer (hero story and stage scenes); `assets/stage.js` — the stage switch
- `favicon.svg`, `robots.txt`, `sitemap.xml`, `og.png`
- `functions/api/contact.js` — Pages Function behind the contact form; `functions/_middleware.js` — canonical-host redirect
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

The "Book a 30-minute call" button is hidden until `BOOKING_URL` in `index.html` is set.

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

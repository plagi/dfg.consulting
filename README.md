# dfg.consulting

Public website for DFG. Digital Frontiers Group.

Static site, no build step. `index.html` is the whole homepage (styles and scripts inline); the only external dependency is Google Fonts.

## Files

- `index.html` — homepage
- `404.html` — not-found page
- `favicon.svg`, `robots.txt`, `sitemap.xml`
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

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

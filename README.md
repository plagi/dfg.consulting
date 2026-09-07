# dfg.consulting

Public website for DFG. Digital Frontiers Group.

Static site, no build step. `index.html` is the whole homepage (styles and scripts inline); the only external dependency is Google Fonts.

## Files

- `index.html` — homepage
- `404.html` — not-found page
- `favicon.svg`, `robots.txt`, `sitemap.xml`
- `CNAME` — custom domain for GitHub Pages (do not delete)

## Hosting

Served by GitHub Pages from the `main` branch, root directory. Every push to `main` redeploys within about a minute.

DNS lives at GoDaddy:

| Type  | Name | Value                    |
|-------|------|--------------------------|
| A     | @    | 185.199.108.153          |
| A     | @    | 185.199.109.153          |
| A     | @    | 185.199.110.153          |
| A     | @    | 185.199.111.153          |
| CNAME | www  | plagi.github.io          |

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

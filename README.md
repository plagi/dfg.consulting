# dfg.consulting

Public website for DFG. Digital Frontiers Group.

Static site, no build step. `index.html` is the whole homepage (styles and scripts inline); the only external dependency is Google Fonts.

## Files

- `index.html` — homepage
- `404.html` — not-found page
- `favicon.svg`, `robots.txt`, `sitemap.xml`

## Hosting

Not yet decided. Any static host works: point it at the repo root, no build step.

DNS lives at GoDaddy.

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

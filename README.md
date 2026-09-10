# wesleylomax.co.uk

Personal blog of **Wesley Lomax** — on making regulated Azure platforms
compliant and affordable (PCI DSS, Azure architecture, cloud security and cost).
Includes the earlier Sitecore / .NET archive.

Built with [Astro](https://astro.build/). Content lives as Markdown in
`src/content/blog/` and is deployed to Netlify.

## Develop

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
```

## Build

```bash
npm run build    # output to ./dist
npm run preview  # preview the production build locally
```

## Writing a post

Add a Markdown file to `src/content/blog/`. The file name becomes the URL slug
(`/posts/<file-name>/`), so keep the date-prefixed naming convention. Frontmatter:

```yaml
---
title: My post title
date: 2026-01-15
description: A one-line summary used for previews and SEO.
featuredimage: /img/some-image.png   # optional, lives in public/img
tags:
  - Azure
  - PCI DSS
---
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/content/blog/` | Markdown posts |
| `src/pages/` | Routes (home, posts, tags, about, contact, RSS, 404) |
| `src/layouts/` | Page + blog-post layouts |
| `src/components/` | Header, footer, cards, etc. |
| `src/styles/global.css` | Design tokens + base styles (light/dark) |
| `public/` | Static assets served as-is (`/img`, `/wp-content`, `_redirects`) |

## URLs & redirects

Original post URLs (`/posts/<slug>/`), tag URLs (`/tags/<slug>/`) and the RSS
feed (`/rss.xml`) are preserved. Legacy WordPress paths are handled by
`public/_redirects`.

## License

[MIT](LICENSE)

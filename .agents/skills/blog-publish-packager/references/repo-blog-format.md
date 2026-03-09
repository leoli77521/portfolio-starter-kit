# Repo Blog Format

Use this file when packaging an article for `app/blog/posts/`.

## Destination

- Write blog posts to `app/blog/posts/[filename].mdx`
- Time-sensitive news posts should usually use a dated filename:
  - `YYYY-MM-DD-key-terms.mdx`
- Evergreen explainers can use shorter canonical names when appropriate

## Current Frontmatter Shape

```yaml
---
title: "Article Title"
publishedAt: "2026-03-09"
updatedAt: "2026-03-09"
summary: "Archive summary and meta description."
image: "/og?title=Article%20Title"
category: 'AI Technology'
tags: ["Claude", "Anthropic", "Firefox"]
faq: [{"question":"...","answer":"..."}]
howto: [{"name":"...","text":"..."}]
---
```

## Category Guidance

Prefer existing categories:

- `AI Technology`
- `Web Development`
- `SEO & Marketing`
- `Productivity`
- `Technology`

## Tag Guidance

- Keep tags human-readable, not slugified in frontmatter
- Prefer canonical concepts over near-duplicates
- Avoid stuffing too many tags; 5-8 is usually enough

## Summary Guidance

- Treat `summary` as dual-purpose:
  - archive card copy
  - metadata description
- Keep it tight and factual
- Aim for one sentence when possible

## Image Guidance

- If a local hero asset exists, use `/images/...`
- If not, use the repo's dynamic OG route:
  - `/og?title=...`
- Inline figures can use remote editorial images when the article needs them

## FAQ and HowTo Guidance

- Only include `faq` when the article naturally answers recurring reader questions
- Only include `howto` when the article has practical next steps
- Keep them compact and concrete

## Internal Links

Good packaging usually adds 2-3 internal links to:

- related benchmark or model-comparison posts
- related topic explainers
- adjacent guides with practical implementation detail

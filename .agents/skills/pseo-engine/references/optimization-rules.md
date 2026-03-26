# SEO Optimization Rules

Comprehensive optimization rules for the pSEO engine.

## Title Optimization

### Length Requirements
- **Minimum**: 30 characters
- **Optimal**: 50-60 characters
- **Maximum**: 60 characters (Google truncates after ~60)

### Title Formula
```
[Primary Keyword] + [Modifier] + [Benefit/Year] | [Brand]
```

### Power Words (Increase CTR)
Use at least one power word:

**Urgency**: Now, Today, Quick, Fast, Instant
**Value**: Free, Ultimate, Complete, Essential, Best
**Curiosity**: Secret, Hidden, Surprising, Little-known
**Trust**: Proven, Expert, Official, Research-backed
**Numbers**: 7 Ways, 10 Tips, 5 Steps, 2024

### Examples
Good:
- `Master Next.js in 2024: Complete Developer Guide`
- `10 TypeScript Tips That Will Transform Your Code`
- `The Ultimate React Performance Guide for 2024`

Avoid:
- `Next.js Guide` (too short, no hook)
- `A Very Comprehensive and Complete Guide to Learning Next.js Framework` (too long)

---

## Meta Description Optimization

### Length Requirements
- **Minimum**: 120 characters
- **Optimal**: 150-160 characters
- **Maximum**: 160 characters

### Structure
```
[Hook/Problem] + [Solution/What You'll Learn] + [CTA]
```

### Must Include
- Primary keyword (naturally, within first 100 chars)
- Call-to-action verb (Learn, Discover, Build, Master, Get)
- Benefit or outcome

### Examples
Good:
```
Learn how to build lightning-fast Next.js applications with our comprehensive guide. Covers SSR, SSG, and the App Router. Start building today.
```

Avoid:
```
This is a guide about Next.js. It covers many topics including SSR and SSG and other features of the framework.
```

---

## Heading Hierarchy

### Rules
1. Only ONE `<h1>` per page (usually the title)
2. H2s should divide main sections
3. H3s subdivide H2 sections
4. Never skip levels (no H1 → H3 without H2)

### Ideal Structure
```markdown
# Main Title (H1)

## Section 1 (H2)
Content...

### Subsection 1.1 (H3)
Content...

### Subsection 1.2 (H3)
Content...

## Section 2 (H2)
Content...
```

### Heading Keywords
- Include primary keyword in H1
- Include secondary keywords in at least 2 H2s
- Use question formats for PAA targeting

---

## Keyword Placement

### Primary Keyword Must Appear In:
1. Title (within first 60 chars)
2. Meta description (within first 100 chars)
3. H1 heading
4. First paragraph (within first 100 words)
5. URL slug
6. At least one H2

### Keyword Density
- Target: 1-2% for primary keyword
- Avoid: Over 3% (keyword stuffing)
- Use LSI (semantically related) keywords naturally

### Formula for 1500-word Article
- Primary keyword: 15-30 occurrences
- Secondary keywords: 5-10 each
- LSI keywords: Sprinkle throughout

---

## Internal Linking

### Rules
1. **Minimum 2-3 internal links** per blog post
2. Use **descriptive anchor text** (not "click here")
3. Link to **relevant content** (same category or shared tags)
4. **Distribute links** throughout content (not just at end)
5. **Update old posts** to link to new content

### Anchor Text Guidelines
Good:
- "Learn more about React hooks"
- "our Next.js performance guide"
- "TypeScript best practices"

Avoid:
- "click here"
- "this article"
- "read more"
- Exact match keyword anchors (too many = spam signal)

### Link Placement Strategy
- Introduction: 0-1 links (for context)
- Body: 2-3 links (to related deep-dives)
- Conclusion: 1 link (to related guide or next steps)

---

## Image Optimization

### Alt Text Requirements
- Describe the image content
- Include keyword if relevant (naturally)
- Keep under 125 characters
- Don't start with "Image of" or "Picture of"

### Examples
Good:
- `Next.js project structure showing app directory layout`
- `React component lifecycle diagram`
- `TypeScript error message in VS Code`

Avoid:
- `image1.png`
- `Image of a screenshot`
- `next.js next.js tutorial next.js guide` (keyword stuffing)

### File Naming
- Use descriptive, hyphenated names
- Include keywords naturally
- Examples: `nextjs-folder-structure.png`, `react-hooks-diagram.svg`

---

## Content Freshness

### Signals of Outdated Content
- Years older than current (2023 when it's 2024)
- Version numbers (v1.0 when v3.0 is current)
- "Deprecated" mentions
- Broken external links
- Outdated screenshots

### Update Triggers
- Major version releases of covered technology
- 6+ months since last update for evergreen content
- Significant traffic drop
- User comments about outdated info

### Update Best Practices
1. Update the year in title if applicable
2. Add "Updated for [Year]" to meta description
3. Update `updatedAt` in frontmatter
4. Review and update code examples
5. Check and fix external links

---

## Schema Markup

### Required Schema Types

**BlogPosting** (all blog posts):
```json
{
  "@type": "BlogPosting",
  "headline": "Title",
  "description": "Meta description",
  "author": {...},
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
```

**FAQPage** (posts with Q&A sections):
```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text..."
      }
    }
  ]
}
```

**HowTo** (tutorial/guide posts):
```json
{
  "@type": "HowTo",
  "name": "How to [do something]",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1",
      "text": "Instructions..."
    }
  ]
}
```

---

## URL Structure

### Rules
1. Use lowercase
2. Use hyphens (not underscores)
3. Keep short (3-5 words ideal)
4. Include primary keyword
5. Avoid stop words (the, a, an, and)
6. No special characters

### Examples
Good:
- `/blog/nextjs-performance-guide`
- `/blog/react-hooks-tutorial`
- `/guides/typescript-basics`

Avoid:
- `/blog/the-ultimate-guide-to-learning-nextjs-in-2024`
- `/blog/Post_About_React`
- `/blog/123456`

---

## Mobile Optimization

### Requirements
1. Viewport meta tag present
2. Touch-friendly tap targets (44x44px minimum)
3. Readable font sizes (16px+ base)
4. No horizontal scrolling
5. Fast loading on 3G

### Testing
- Google Mobile-Friendly Test
- Chrome DevTools device simulation
- Real device testing

---

## Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s - 4s | > 4s |
| FID (First Input Delay) | < 100ms | 100ms - 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 - 0.25 | > 0.25 |

### Optimization Tips
- LCP: Optimize hero images, use next/image
- FID: Minimize/defer JavaScript, use web workers
- CLS: Set image dimensions, avoid layout shifts

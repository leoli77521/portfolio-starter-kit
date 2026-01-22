# SERP Feature Patterns

Guide to targeting specific SERP features with content optimization.

## Featured Snippets

### Paragraph Snippets

**Target Queries**: "What is...", "Who is...", "Why does..."

**Format**:
```markdown
## What is [Topic]?

[Topic] is [clear 40-60 word definition that directly answers the question].
It [additional context about purpose or function]. This makes it ideal for
[use case].
```

**Example**:
```markdown
## What is Next.js?

Next.js is a React framework for building full-stack web applications. It
provides features like server-side rendering, static site generation, and
API routes out of the box. This makes it ideal for building fast,
SEO-friendly websites and web applications.
```

**Best Practices**:
- Answer the question in the first 40-60 words after the heading
- Use the exact question as an H2/H3 heading
- Provide comprehensive but concise answer
- Follow with more detail in subsequent paragraphs

---

### List Snippets

**Target Queries**: "Best...", "Top...", "How to...", "Steps to..."

**Ordered List (Steps)**:
```markdown
## How to [Do Something]

1. **Step One Title** - Brief description of first step
2. **Step Two Title** - Brief description of second step
3. **Step Three Title** - Brief description of third step
4. **Step Four Title** - Brief description of fourth step
5. **Step Five Title** - Brief description of fifth step
```

**Unordered List (Best/Top)**:
```markdown
## Best [Things] for [Purpose]

- **Item One** - Why it's good for this purpose
- **Item Two** - Why it's good for this purpose
- **Item Three** - Why it's good for this purpose
- **Item Four** - Why it's good for this purpose
- **Item Five** - Why it's good for this purpose
```

**Best Practices**:
- Use 5-8 items for optimal snippet capture
- Bold the main item/step name
- Keep descriptions under 15 words each
- Use the query terms in the heading

---

### Table Snippets

**Target Queries**: "...vs...", "comparison", "differences"

**Format**:
```markdown
## [Thing A] vs [Thing B]: Comparison

| Feature | Thing A | Thing B |
|---------|---------|---------|
| Feature 1 | Value | Value |
| Feature 2 | Value | Value |
| Feature 3 | Value | Value |
| Feature 4 | Value | Value |
```

**Best Practices**:
- Include 4-6 comparison points
- Use clear, concise values
- Make the table immediately after the H2
- Include both items in the heading

---

## People Also Ask (PAA)

### Targeting PAA Boxes

**Question Patterns to Include**:
```markdown
## What is [Topic]?
[Direct answer in 2-3 sentences]

## How does [Topic] work?
[Explanation in 2-3 sentences]

## Why is [Topic] important?
[Benefits explanation in 2-3 sentences]

## Is [Topic] right for [Audience]?
[Targeted answer in 2-3 sentences]

## How do I get started with [Topic]?
[Quick start steps in 2-3 sentences]
```

**Best Practices**:
- Research actual PAA questions via WebSearch
- Use exact question format as headings
- Answer in 40-60 words directly after heading
- Provide more detail after the initial answer
- Include 3-5 PAA-style questions per article
- Add FAQPage schema for these sections

---

## Video Carousel

### Triggering Video Results

**Content Signals**:
- Include video embed (YouTube, Vimeo)
- Add VideoObject schema
- Use video-related terms in title/content

**Schema**:
```json
{
  "@type": "VideoObject",
  "name": "Video title",
  "description": "Video description",
  "thumbnailUrl": "thumbnail-url.jpg",
  "uploadDate": "2024-01-15",
  "duration": "PT5M30S",
  "contentUrl": "video-url",
  "embedUrl": "embed-url"
}
```

---

## Image Pack

### Triggering Image Results

**Requirements**:
- 3+ relevant images per article
- Descriptive alt text with keywords
- High-quality, original images preferred
- Proper image file naming

**Image Types That Work**:
- Diagrams and infographics
- Screenshots with annotations
- Comparison charts
- Step-by-step visuals

---

## Knowledge Panel

### Triggering Entity Recognition

**For Personal/Brand Sites**:
- Consistent NAP (Name, Address, Phone) across web
- Organization schema on homepage
- Linked social profiles
- Wikipedia/Wikidata presence (if notable)

**Schema**:
```json
{
  "@type": "Person",
  "name": "Your Name",
  "url": "https://yoursite.com",
  "sameAs": [
    "https://twitter.com/handle",
    "https://linkedin.com/in/profile",
    "https://github.com/username"
  ],
  "jobTitle": "Job Title",
  "worksFor": {
    "@type": "Organization",
    "name": "Company"
  }
}
```

---

## Sitelinks

### Triggering Sitelinks

**Requirements**:
- Clear site structure
- Internal linking hierarchy
- Descriptive page titles
- XML sitemap submitted
- Good site authority

**Site Structure for Sitelinks**:
```
Homepage
├── /blog (Blog main)
├── /about (About page)
├── /contact (Contact page)
├── /topics (Topic hubs)
└── /guides (Guides/Tutorials)
```

---

## Rich Results Targeting Matrix

| SERP Feature | Schema Required | Content Format | Target Keywords |
|--------------|-----------------|----------------|-----------------|
| Featured Snippet (Para) | None | Definition after H2 | "What is...", "Who is..." |
| Featured Snippet (List) | None | Ordered/Unordered lists | "How to...", "Best...", "Steps..." |
| Featured Snippet (Table) | None | Comparison tables | "...vs...", "difference between" |
| FAQ Rich Result | FAQPage | Q&A headings | "FAQ", questions |
| How-To Rich Result | HowTo | Numbered steps | "How to...", "Tutorial" |
| Video Result | VideoObject | Embedded video | "Video", "Tutorial", "Demo" |
| Recipe Result | Recipe | Recipe format | "Recipe", "How to make" |
| Review Stars | Review/AggregateRating | Review content | "Review", "Best" |
| Event | Event | Event details | Dates, "Workshop", "Webinar" |
| Course | Course | Learning content | "Course", "Learn", "Class" |

---

## Query Modifier Patterns

### Informational Queries
- "What is [topic]"
- "How does [topic] work"
- "[topic] explained"
- "[topic] meaning"
- "[topic] definition"

### Procedural Queries
- "How to [action]"
- "[action] tutorial"
- "[action] guide"
- "Steps to [action]"
- "[action] for beginners"

### Comparative Queries
- "[A] vs [B]"
- "[A] or [B]"
- "Difference between [A] and [B]"
- "Best [type] for [purpose]"
- "[A] alternatives"

### Commercial Queries
- "Best [product] for [use case]"
- "Top [number] [products]"
- "[product] review"
- "Is [product] worth it"
- "[product] pricing"

---

## Seasonal/Temporal Patterns

### Add Year for Freshness
- "Best [topic] 2024"
- "[Topic] guide 2024"
- "[Topic] trends 2024"

### Seasonal Content
- "Spring [topic]"
- "Holiday [topic]"
- "Back to school [topic]"

### Update Strategy
1. Add year to title when relevant
2. Update "last updated" date
3. Review and refresh content quarterly
4. Monitor for query freshness signals

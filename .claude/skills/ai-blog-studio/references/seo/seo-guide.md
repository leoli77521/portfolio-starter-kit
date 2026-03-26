# SEO Guide for tolearn.blog

Complete SEO reference for blog optimization.

---

## Keyword Research Process

### Finding Keywords
1. Use Google autocomplete for topic ideas
2. Check "People also ask" sections
3. Analyze competitor blog titles
4. Focus on questions beginners ask

### Keyword Types

| Type | Example | Use Case |
|------|---------|----------|
| Primary | "Claude API tutorial" | Title, H1, URL |
| Secondary | "Anthropic API guide" | H2 headings |
| Long-tail | "how to use Claude API for beginners" | Subheadings, content |
| LSI | "LLM", "prompt engineering" | Natural body content |

---

## Title Optimization

### Guidelines
- **Length**: 50-60 characters (optimal for search)
- **Format**: `[Action Verb] + [Topic] + [Benefit/Year]`

### Power Words to Include
How, Why, What, Guide, Tutorial, Best, Top, Ultimate, Complete, Easy, Quick, Simple

### Examples
- "Build Your First AI Chatbot with Claude API in 2026"
- "Master Prompt Engineering: 7 Techniques That Actually Work"
- "Claude vs GPT-4: Which AI Should You Choose?"

---

## Meta Description

### Guidelines
- **Length**: 150-160 characters
- Include primary keyword naturally
- End with call-to-action or benefit

### Template
```
Learn [what reader will learn] with this [type] guide. [Benefit/outcome]. [CTA].
```

### Example
```
Learn to build AI chatbots with Claude API in this step-by-step tutorial. Includes working code examples. Start building today.
```

---

## URL Structure

### Best Practices
- Keep URLs short: `/claude-api-tutorial/`
- Use hyphens, not underscores
- Include primary keyword
- Avoid dates in URLs (evergreen content)

### Examples
| Good | Bad |
|------|-----|
| `/claude-api-guide/` | `/2026/01/15/my-claude-api-guide-post/` |
| `/prompt-engineering-tips/` | `/tips_for_prompt_engineering/` |

---

## Heading Hierarchy

```
H1: Main title (only one per page)
  H2: Major sections
    H3: Subsections
      H4: Rarely needed
```

### Best Practices
- Include keywords in H2s naturally
- Use 4-8 H2 headings per article
- H3s should logically nest under H2s
- Don't skip levels (H1 → H3)

---

## Image Optimization

### File Names
Use descriptive names: `claude-api-response-example.png`

### Alt Text
Include keyword naturally: "Claude API JSON response showing message content"

### Technical
- Compress images to < 100KB when possible
- Use WebP format for better performance
- Specify width and height to prevent layout shift

---

## Schema Markup

### For Tutorials (HowTo Schema)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Build a Chatbot with Claude API",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Install dependencies",
      "text": "Run pip install anthropic to install the Python SDK."
    },
    {
      "@type": "HowToStep",
      "name": "Set up API key",
      "text": "Export your API key as ANTHROPIC_API_KEY environment variable."
    }
  ]
}
```

### For Articles
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Understanding AI Agents",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "datePublished": "2026-01-15"
}
```

### For FAQs
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the Claude API rate limit?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Claude API rate limits vary by tier..."
      }
    }
  ]
}
```

---

## Content Length Guidelines

| Post Type | Word Count | Reasoning |
|-----------|------------|-----------|
| Quick tutorial | 800-1200 | Focused, actionable |
| In-depth guide | 1500-2500 | Comprehensive coverage |
| Comparison post | 1200-1800 | Detailed analysis |
| News/update | 500-800 | Timely, concise |

---

## Internal Linking Strategy

### Guidelines
- Link to 2-3 related posts per article
- Use descriptive anchor text (not "click here")
- Link from high-traffic pages to newer content
- Create topic clusters

### Example
```markdown
For more on prompt engineering, check out our
[complete guide to system prompts](/blog/system-prompts-guide).
```

### Avoid
```markdown
For more information, [click here](/blog/system-prompts-guide).
```

---

## External Link Strategy

### Good External Links
- Official documentation (Anthropic docs, Python docs)
- Research papers (arXiv for AI topics)
- GitHub repositories
- Authoritative tech sites (GitHub, Stack Overflow)

### Avoid Linking To
- Competitors' blogs
- Low-quality aggregator sites
- Paywalled content without note

---

## Featured Snippet Optimization

### Target "Position Zero" with:

1. **Definition boxes**
```markdown
## What is prompt engineering?

Prompt engineering is the practice of designing inputs for AI models
to get desired outputs. It involves crafting questions, instructions,
and context that guide the model's responses.
```

2. **Numbered lists**
```markdown
## How to set up Claude API

1. Create an Anthropic account
2. Generate an API key
3. Install the SDK
4. Set your environment variable
5. Make your first request
```

3. **Tables**
```markdown
| Model | Speed | Quality | Best For |
|-------|-------|---------|----------|
| Haiku | Fast | Good | Quick tasks |
| Sonnet | Medium | Great | General use |
| Opus | Slow | Best | Complex tasks |
```

4. **FAQ sections**
```markdown
## Frequently Asked Questions

### What is the Claude API rate limit?
The Claude API has different rate limits based on your tier...

### How much does Claude API cost?
Pricing varies by model. Claude Sonnet costs approximately...
```

---

## Content Freshness

### Update Schedule
- Tutorial posts: Review every 6 months
- API guides: Update when API changes
- Tool comparisons: Update quarterly
- Evergreen concepts: Annual review

### Update Signals to Add
- "Last updated: [date]" at top
- Version numbers for code/tools
- Changelog for major revisions

---

## On-Page SEO Checklist

### Before Publishing

- [ ] Title is 50-60 characters
- [ ] Title includes primary keyword
- [ ] Meta description is 150-160 characters
- [ ] URL is short and includes keyword
- [ ] Only one H1 (the title)
- [ ] H2s include secondary keywords
- [ ] First paragraph mentions primary keyword
- [ ] Images have descriptive alt text
- [ ] 2-3 internal links included
- [ ] External links to authoritative sources
- [ ] Schema markup added (if applicable)
- [ ] Content meets length guidelines

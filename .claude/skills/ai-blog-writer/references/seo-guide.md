# SEO Guide for tolearn.blog

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

## On-Page SEO Checklist

### URL Structure
- Keep URLs short: `/claude-api-tutorial/`
- Use hyphens, not underscores
- Include primary keyword
- Avoid dates in URLs (evergreen content)

### Heading Hierarchy
```
H1: Main title (only one per page)
  H2: Major sections
    H3: Subsections
      H4: Rarely needed
```

### Image Optimization
- Descriptive file names: `claude-api-response-example.png`
- Alt text with keyword: "Claude API JSON response showing message content"
- Compress images to < 100KB when possible
- Use WebP format for better performance

### Schema Markup (for tutorials)
```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Build a Chatbot with Claude API",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Install dependencies",
      "text": "Run pip install anthropic..."
    }
  ]
}
```

## Content Length Guidelines

| Post Type | Word Count | Reasoning |
|-----------|------------|-----------|
| Quick tutorial | 800-1200 | Focused, actionable |
| In-depth guide | 1500-2500 | Comprehensive coverage |
| Comparison post | 1200-1800 | Detailed analysis |
| News/update | 500-800 | Timely, concise |

## External Link Strategy

### Good external links:
- Official documentation (Anthropic docs, Python docs)
- Research papers (arXiv for AI topics)
- GitHub repositories
- Authoritative tech sites (GitHub, Stack Overflow)

### Avoid linking to:
- Competitors' blogs
- Low-quality aggregator sites
- Paywalled content without note

## Featured Snippet Optimization

### Target "Position Zero" with:
1. **Definition boxes**: "What is prompt engineering? Prompt engineering is..."
2. **Numbered lists**: Steps 1-5 clearly formatted
3. **Tables**: Comparison data
4. **FAQ sections**: Direct Q&A format

### Example FAQ format:
```markdown
## Frequently Asked Questions

### What is the Claude API rate limit?
The Claude API has different rate limits based on your tier...

### How much does Claude API cost?
Pricing varies by model. Claude Sonnet costs approximately...
```

## Content Freshness

### Update schedule:
- Tutorial posts: Review every 6 months
- API guides: Update when API changes
- Tool comparisons: Update quarterly
- Evergreen concepts: Annual review

### Update signals to add:
- "Last updated: [date]" at top
- Version numbers for code/tools
- Changelog for major revisions

# Visual Guidelines

图片插入模板和视觉元素最佳实践。

## MDX Image Templates

### Standard Image with Caption
```mdx
<figure className="my-8">
  <img
    src="/images/[filename].png"
    alt="[Descriptive text for screen readers and SEO]"
    className="w-full h-auto rounded-lg shadow-lg"
  />
  <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
    [Caption explaining what the image shows]
  </figcaption>
</figure>
```

### Hero Image (Full Width)
```mdx
<figure className="my-8 -mx-4 md:-mx-8">
  <img
    src="/images/[filename].png"
    alt="[Descriptive text]"
    className="w-full h-auto"
  />
  <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 px-4">
    [Caption]
  </figcaption>
</figure>
```

### Side-by-Side Comparison
```mdx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
  <figure>
    <img
      src="/images/[before].png"
      alt="[Before state description]"
      className="w-full h-auto rounded-lg shadow-md"
    />
    <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
      Before: [description]
    </figcaption>
  </figure>
  <figure>
    <img
      src="/images/[after].png"
      alt="[After state description]"
      className="w-full h-auto rounded-lg shadow-md"
    />
    <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
      After: [description]
    </figcaption>
  </figure>
</div>
```

### Screenshot with Border
```mdx
<figure className="my-8">
  <img
    src="/images/[screenshot].png"
    alt="[UI element] showing [feature/action]"
    className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg"
  />
  <figcaption className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
    Screenshot: [What this demonstrates]
  </figcaption>
</figure>
```

---

## Image Placement Rules

### Where to Insert Images

| Position | Purpose | Image Type |
|----------|---------|------------|
| After intro | Set context, grab attention | Hero, conceptual |
| Before complex section | Prepare reader | Diagram, overview |
| After explanation | Reinforce understanding | Example, screenshot |
| At data points | Visualize statistics | Chart, infographic |
| Before conclusion | Summarize visually | Summary graphic |

### Spacing Guidelines
- **Minimum**: 2-3 paragraphs between images
- **Maximum**: No more than 500 words without visual break
- **Exception**: Code-heavy sections may have tighter image spacing

### Image Density by Article Type
| Article Type | Images per 1000 words |
|--------------|----------------------|
| Tutorial | 3-5 |
| Explanation | 2-3 |
| Opinion/Analysis | 1-2 |
| News/Update | 1-2 |

---

## Alt Text Best Practices

### Structure
```
[Subject] + [Action/State] + [Context/Purpose]
```

### Examples

**Good:**
```
alt="Claude AI dashboard showing conversation history and model selection dropdown"
```

**Bad:**
```
alt="screenshot" ❌
alt="image1.png" ❌
alt="a picture of the Claude interface" ❌
```

### Guidelines
1. **Be specific**: Describe what's actually shown
2. **Include context**: Why is this image here?
3. **Use keywords naturally**: Don't keyword stuff
4. **Length**: 50-125 characters ideal
5. **No "image of"**: Start directly with content

### Alt Text by Image Type

| Type | Pattern | Example |
|------|---------|---------|
| Screenshot | [UI name] showing [feature] | "VS Code editor showing MCP configuration file" |
| Diagram | [Diagram type] of [concept] | "Flowchart of the AI agent decision process" |
| Chart | [Chart type] comparing [metrics] | "Bar chart comparing response times across AI models" |
| Code output | [Language/tool] output showing [result] | "Terminal output showing successful API response" |

---

## Diagram Recommendations

### When to Use Diagrams

| Concept Type | Recommended Diagram |
|--------------|-------------------|
| Process/workflow | Flowchart |
| System architecture | Block diagram |
| Relationships | Entity diagram |
| Comparisons | Side-by-side or matrix |
| Timeline | Horizontal timeline |
| Hierarchy | Tree diagram |

### ASCII Diagram Template (for inline use)
```mdx
```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  Input  │────▶│ Process │────▶│ Output  │
└─────────┘     └─────────┘     └─────────┘
```
```

---

## File Naming Conventions

### Pattern
```
[article-slug]-[descriptor]-[number].png
```

### Examples
```
mcp-guide-architecture-01.png
ai-agents-workflow-diagram-01.png
claude-api-response-screenshot-01.png
```

### Directory Structure
```
public/images/
├── blog/
│   ├── [article-slug]/
│   │   ├── hero.png
│   │   ├── diagram-01.png
│   │   └── screenshot-01.png
```

---

## Image Optimization Checklist

Before adding images:

- [ ] Compressed for web (aim for <200KB)
- [ ] Appropriate dimensions (max 1200px width)
- [ ] Alt text is descriptive and SEO-friendly
- [ ] Caption explains significance
- [ ] File named descriptively
- [ ] Placed at logical break point

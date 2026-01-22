# Schema.org Templates

Ready-to-use structured data templates for the pSEO engine.

## BlogPosting Schema

Use for all blog posts.

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{title}",
  "description": "{description}",
  "image": "{ogImage}",
  "author": {
    "@type": "Person",
    "name": "{authorName}",
    "url": "{authorUrl}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "{siteName}",
    "logo": {
      "@type": "ImageObject",
      "url": "{logoUrl}"
    }
  },
  "datePublished": "{publishedAt}",
  "dateModified": "{updatedAt}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "{canonicalUrl}"
  },
  "keywords": "{tags}",
  "articleSection": "{category}",
  "wordCount": "{wordCount}",
  "timeRequired": "PT{readingTime}M"
}
```

### Variables
| Variable | Source | Example |
|----------|--------|---------|
| `{title}` | Post title | "Next.js Tutorial for Beginners" |
| `{description}` | Meta description | "Learn Next.js from scratch..." |
| `{ogImage}` | OG image URL | "/og/nextjs-tutorial.png" |
| `{publishedAt}` | ISO date | "2024-01-15T00:00:00Z" |
| `{updatedAt}` | ISO date | "2024-01-20T00:00:00Z" |
| `{tags}` | Comma-separated | "Next.js, React, Tutorial" |
| `{readingTime}` | Minutes | "8" |

---

## FAQPage Schema

Use for content with question-answer sections.

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question1}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer1}"
      }
    },
    {
      "@type": "Question",
      "name": "{question2}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer2}"
      }
    }
  ]
}
```

### Best Practices
- Include 3-8 questions per page
- Questions should be natural (how users would ask)
- Answers should be concise but complete
- Can be combined with BlogPosting (use @graph)

### Combined Example
```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "React Hooks Guide",
      ...
    },
    {
      "@type": "FAQPage",
      "mainEntity": [...]
    }
  ]
}
```

---

## HowTo Schema

Use for step-by-step tutorials and guides.

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "{title}",
  "description": "{description}",
  "image": "{heroImage}",
  "totalTime": "PT{totalMinutes}M",
  "estimatedCost": {
    "@type": "MonetaryCost",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "{supply1}"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "{tool1}"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "{stepTitle1}",
      "text": "{stepDescription1}",
      "image": "{stepImage1}",
      "url": "{canonicalUrl}#step1"
    },
    {
      "@type": "HowToStep",
      "name": "{stepTitle2}",
      "text": "{stepDescription2}",
      "url": "{canonicalUrl}#step2"
    }
  ]
}
```

### Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `{totalMinutes}` | Time to complete | "30" |
| `{supply}` | Required materials | "Node.js 18+", "VS Code" |
| `{tool}` | Required tools | "Terminal", "Code Editor" |

---

## Course Schema

Use for learning paths and comprehensive guides.

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "{courseName}",
  "description": "{courseDescription}",
  "provider": {
    "@type": "Organization",
    "name": "{siteName}",
    "sameAs": "{siteUrl}"
  },
  "educationalLevel": "{difficulty}",
  "timeRequired": "PT{hours}H",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT{hours}H"
  }
}
```

### Variables
| Variable | Options | Example |
|----------|---------|---------|
| `{difficulty}` | Beginner, Intermediate, Advanced | "Intermediate" |
| `{hours}` | Estimated hours | "4" |

---

## BreadcrumbList Schema

Use for navigation hierarchy.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{baseUrl}"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{category}",
      "item": "{baseUrl}/categories/{categorySlug}"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{postTitle}",
      "item": "{postUrl}"
    }
  ]
}
```

---

## WebSite Schema (for homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "{siteName}",
  "url": "{baseUrl}",
  "description": "{siteDescription}",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "{baseUrl}/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## Organization Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{siteName}",
  "url": "{baseUrl}",
  "logo": "{logoUrl}",
  "sameAs": [
    "{twitterUrl}",
    "{githubUrl}",
    "{linkedinUrl}"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "{contactEmail}"
  }
}
```

---

## pSEO Template Schemas

### Tech + Role Template Page

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Best {tech} Portfolio for {role}s",
      "description": "{description}",
      "url": "{baseUrl}/templates/{techSlug}/{roleSlug}",
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {"@type": "ListItem", "position": 1, "name": "Home", "item": "{baseUrl}"},
          {"@type": "ListItem", "position": 2, "name": "Templates", "item": "{baseUrl}/templates"},
          {"@type": "ListItem", "position": 3, "name": "{tech}", "item": "{baseUrl}/templates/{techSlug}"},
          {"@type": "ListItem", "position": 4, "name": "{role}", "item": "{baseUrl}/templates/{techSlug}/{roleSlug}"}
        ]
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "{tech} Portfolio Template for {role}s",
      "applicationCategory": "WebApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why use {tech} for a {role} portfolio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "{techBenefits}"
          }
        }
      ]
    }
  ]
}
```

### Feature Page

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "Portfolio Template with {feature}",
      "description": "{description}",
      "url": "{baseUrl}/solutions/{featureSlug}"
    },
    {
      "@type": "Product",
      "name": "{feature} Portfolio Template",
      "description": "{featureDescription}",
      "brand": {
        "@type": "Organization",
        "name": "{siteName}"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
}
```

---

## Validation Checklist

Before deploying schema:

- [ ] Valid JSON-LD syntax (use JSON validator)
- [ ] Test with [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Test with [Schema.org Validator](https://validator.schema.org/)
- [ ] Check Search Console for errors
- [ ] Verify all URLs are absolute
- [ ] Ensure dates are ISO 8601 format
- [ ] Check image URLs are accessible

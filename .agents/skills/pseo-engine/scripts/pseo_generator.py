"""
pSEO Page Generator Module for pSEO Engine

This module handles batch generation of programmatic SEO pages
based on technology × role combinations and feature pages.

Usage by Claude:
- Trigger: "generate pseo" or "生成pSEO页面"
- Creates/updates pseo_data.json
- Generates template pages
- Updates sitemap
- Verifies build
"""

from dataclasses import dataclass, field
from typing import Optional
import json


@dataclass
class Technology:
    """Technology definition for pSEO"""
    slug: str
    name: str
    description: str
    features: list[str] = field(default_factory=list)
    use_cases: list[str] = field(default_factory=list)
    related_posts: list[str] = field(default_factory=list)
    icon: Optional[str] = None


@dataclass
class Role:
    """Developer role definition for pSEO"""
    slug: str
    name: str
    description: str
    keywords: list[str] = field(default_factory=list)
    challenges: list[str] = field(default_factory=list)
    goals: list[str] = field(default_factory=list)


@dataclass
class Feature:
    """Feature definition for pSEO"""
    slug: str
    name: str
    description: str
    benefits: list[str] = field(default_factory=list)
    technical_details: str = ""


@dataclass
class PSEOData:
    """Complete pSEO data structure"""
    technologies: list[Technology] = field(default_factory=list)
    roles: list[Role] = field(default_factory=list)
    features: list[Feature] = field(default_factory=list)
    templates: dict = field(default_factory=dict)


# Default technologies for the portfolio starter kit
DEFAULT_TECHNOLOGIES = [
    Technology(
        slug="nextjs",
        name="Next.js",
        description="The React framework for production-grade applications with built-in SSR, SSG, and API routes.",
        features=["Server-side Rendering", "Static Site Generation", "API Routes", "App Router", "Image Optimization"],
        use_cases=["Portfolio websites", "Blogs", "E-commerce", "SaaS applications"],
        icon="nextjs"
    ),
    Technology(
        slug="react",
        name="React",
        description="A JavaScript library for building interactive user interfaces with component-based architecture.",
        features=["Component-based", "Virtual DOM", "Hooks", "JSX", "Rich ecosystem"],
        use_cases=["Single-page apps", "Interactive UIs", "Web applications"],
        icon="react"
    ),
    Technology(
        slug="typescript",
        name="TypeScript",
        description="JavaScript with static type definitions for better developer experience and code quality.",
        features=["Static typing", "IntelliSense", "Error detection", "Better refactoring"],
        use_cases=["Large-scale applications", "Team projects", "API development"],
        icon="typescript"
    ),
    Technology(
        slug="tailwindcss",
        name="Tailwind CSS",
        description="A utility-first CSS framework for rapid UI development without leaving your HTML.",
        features=["Utility-first", "Responsive design", "Dark mode", "JIT compiler"],
        use_cases=["Rapid prototyping", "Custom designs", "Responsive layouts"],
        icon="tailwindcss"
    ),
    Technology(
        slug="mdx",
        name="MDX",
        description="Markdown enhanced with JSX components for rich, interactive documentation and blogs.",
        features=["Markdown + JSX", "Interactive components", "Syntax highlighting", "Frontmatter"],
        use_cases=["Technical blogs", "Documentation", "Content-heavy sites"],
        icon="mdx"
    ),
]

# Default roles for pSEO targeting
DEFAULT_ROLES = [
    Role(
        slug="frontend-developer",
        name="Frontend Developer",
        description="Developers focused on building user interfaces and client-side applications.",
        keywords=["React", "Vue", "CSS", "JavaScript", "UI/UX"],
        challenges=["Responsive design", "Performance optimization", "Cross-browser compatibility"],
        goals=["Showcase UI skills", "Display interactive projects", "Highlight design sense"]
    ),
    Role(
        slug="backend-developer",
        name="Backend Developer",
        description="Developers specializing in server-side logic, databases, and APIs.",
        keywords=["Node.js", "Python", "APIs", "Databases", "Security"],
        challenges=["Scalability", "API design", "Database optimization"],
        goals=["Show system design skills", "Display API projects", "Highlight architecture"]
    ),
    Role(
        slug="fullstack-developer",
        name="Fullstack Developer",
        description="Developers skilled in both frontend and backend technologies.",
        keywords=["React", "Node.js", "Databases", "DevOps", "Full-stack"],
        challenges=["Balancing frontend and backend", "System integration", "Deployment"],
        goals=["Showcase end-to-end projects", "Display diverse skills", "Show project ownership"]
    ),
    Role(
        slug="software-engineer",
        name="Software Engineer",
        description="Engineers focused on building robust, scalable software systems.",
        keywords=["Algorithms", "System design", "Clean code", "Testing", "Architecture"],
        challenges=["Code quality", "Maintainability", "Performance"],
        goals=["Display engineering mindset", "Show problem-solving", "Highlight best practices"]
    ),
    Role(
        slug="devops-engineer",
        name="DevOps Engineer",
        description="Engineers bridging development and operations with automation and infrastructure.",
        keywords=["CI/CD", "Docker", "Kubernetes", "AWS", "Automation"],
        challenges=["Infrastructure management", "Deployment automation", "Monitoring"],
        goals=["Show infrastructure projects", "Display automation skills", "Highlight DevOps culture"]
    ),
]

# Default features for pSEO
DEFAULT_FEATURES = [
    Feature(
        slug="dark-mode",
        name="Dark Mode",
        description="Eye-friendly dark theme that reduces eye strain and saves battery on OLED screens.",
        benefits=["Reduced eye strain", "Battery saving on OLED", "Modern aesthetic", "User preference respect"],
        technical_details="Implemented using CSS custom properties and system preference detection."
    ),
    Feature(
        slug="seo-optimized",
        name="SEO Optimized",
        description="Built-in SEO best practices for better search engine visibility.",
        benefits=["Higher search rankings", "More organic traffic", "Better discoverability", "Rich snippets"],
        technical_details="Includes meta tags, structured data, sitemap, and optimized content structure."
    ),
    Feature(
        slug="responsive-design",
        name="Responsive Design",
        description="Fully responsive layout that looks great on all devices.",
        benefits=["Mobile-friendly", "Consistent experience", "Better engagement", "SEO boost"],
        technical_details="Built with Tailwind CSS responsive utilities and mobile-first approach."
    ),
    Feature(
        slug="fast-performance",
        name="Fast Performance",
        description="Optimized for speed with excellent Core Web Vitals scores.",
        benefits=["Better user experience", "Higher engagement", "SEO ranking boost", "Lower bounce rate"],
        technical_details="Uses Next.js Image optimization, code splitting, and edge caching."
    ),
    Feature(
        slug="blog-ready",
        name="Blog Ready",
        description="Full-featured blog with MDX support, categories, tags, and RSS.",
        benefits=["Content marketing", "Thought leadership", "SEO content", "Audience engagement"],
        technical_details="MDX-powered blog with syntax highlighting, frontmatter, and automatic sitemap."
    ),
]


def generate_pseo_data() -> dict:
    """
    Generate the complete pSEO data structure.

    Returns:
        Dictionary ready to be saved as JSON
    """
    data = {
        "technologies": [
            {
                "slug": t.slug,
                "name": t.name,
                "description": t.description,
                "features": t.features,
                "useCases": t.use_cases,
                "relatedPosts": t.related_posts,
                "icon": t.icon
            }
            for t in DEFAULT_TECHNOLOGIES
        ],
        "roles": [
            {
                "slug": r.slug,
                "name": r.name,
                "description": r.description,
                "keywords": r.keywords,
                "challenges": r.challenges,
                "goals": r.goals
            }
            for r in DEFAULT_ROLES
        ],
        "features": [
            {
                "slug": f.slug,
                "name": f.name,
                "description": f.description,
                "benefits": f.benefits,
                "technicalDetails": f.technical_details
            }
            for f in DEFAULT_FEATURES
        ],
        "templates": {
            "techRole": {
                "titlePattern": "{tech} Portfolio Template for {role}s | Build Your Developer Portfolio",
                "descriptionPattern": "Create a stunning {role} portfolio powered by {tech}. Features: {features}. Start building your professional presence today.",
                "h1Pattern": "Best {tech} Portfolio Template for {role}s"
            },
            "feature": {
                "titlePattern": "{feature} Portfolio Template | Modern Developer Portfolio",
                "descriptionPattern": "Build a portfolio with {feature}. {benefits}. Perfect for developers who want a professional online presence.",
                "h1Pattern": "Portfolio Template with {feature}"
            }
        },
        "faqs": {
            "techRole": [
                {
                    "questionPattern": "Why use {tech} for a {role} portfolio?",
                    "answerPattern": "{tech} is perfect for {role}s because it offers {features}. This makes it ideal for showcasing your work professionally."
                },
                {
                    "questionPattern": "Is this template suitable for {role}s?",
                    "answerPattern": "Absolutely! This template is designed with {role}s in mind, addressing challenges like {challenges} and helping you achieve {goals}."
                },
                {
                    "questionPattern": "How do I customize this {tech} template?",
                    "answerPattern": "The template is fully customizable. You can modify colors, layouts, and content using {tech}'s component system and Tailwind CSS utilities."
                }
            ],
            "feature": [
                {
                    "questionPattern": "How does {feature} work in this template?",
                    "answerPattern": "{technicalDetails}"
                },
                {
                    "questionPattern": "What are the benefits of {feature}?",
                    "answerPattern": "{feature} provides: {benefits}."
                }
            ]
        }
    }

    return data


def generate_static_params_code(technologies: list, roles: list) -> str:
    """
    Generate TypeScript code for generateStaticParams.

    Args:
        technologies: List of technology slugs
        roles: List of role slugs

    Returns:
        TypeScript code string
    """
    code = '''export async function generateStaticParams() {
  const pseoData = await import('@/data/pseo_data.json')

  const params: { tech: string; role: string }[] = []

  for (const tech of pseoData.technologies) {
    for (const role of pseoData.roles) {
      params.push({
        tech: tech.slug,
        role: role.slug,
      })
    }
  }

  return params
}'''
    return code


def calculate_total_pages(technologies: list, roles: list, features: list) -> dict:
    """
    Calculate total pages to be generated.

    Args:
        technologies: List of technologies
        roles: List of roles
        features: List of features

    Returns:
        Dictionary with page counts
    """
    tech_role_pages = len(technologies) * len(roles)
    feature_pages = len(features)

    return {
        "tech_role_combinations": tech_role_pages,
        "feature_pages": feature_pages,
        "total": tech_role_pages + feature_pages,
        "breakdown": {
            "technologies": len(technologies),
            "roles": len(roles),
            "features": len(features)
        }
    }


# Usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "generate pseo" or "生成pSEO页面":

### Step 1: Create/Update pseo_data.json

```typescript
// data/pseo_data.json structure
{
  "technologies": [...],
  "roles": [...],
  "features": [...],
  "templates": {...},
  "faqs": {...}
}
```

Use Write tool to create `data/pseo_data.json` with the complete data structure.

### Step 2: Create Tech × Role Pages

Create `app/templates/[tech]/[role]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import pseoData from '@/data/pseo_data.json'

interface Props {
  params: Promise<{ tech: string; role: string }>
}

export async function generateStaticParams() {
  const params: { tech: string; role: string }[] = []
  for (const tech of pseoData.technologies) {
    for (const role of pseoData.roles) {
      params.push({ tech: tech.slug, role: role.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props) {
  const { tech, role } = await params
  const technology = pseoData.technologies.find(t => t.slug === tech)
  const roleData = pseoData.roles.find(r => r.slug === role)

  if (!technology || !roleData) return {}

  const title = pseoData.templates.techRole.titlePattern
    .replace('{tech}', technology.name)
    .replace('{role}', roleData.name)

  return {
    title,
    description: pseoData.templates.techRole.descriptionPattern
      .replace('{tech}', technology.name)
      .replace('{role}', roleData.name)
      .replace('{features}', technology.features.slice(0, 3).join(', ')),
  }
}

export default async function TemplatePage({ params }: Props) {
  const { tech, role } = await params
  // ... render page content
}
```

### Step 3: Create Feature Pages

Create `app/solutions/[feature]/page.tsx` with similar structure.

### Step 4: Update Sitemap

Add to `app/sitemap.ts`:

```typescript
import pseoData from '@/data/pseo_data.json'

// In sitemap function, add:
const templateRoutes = pseoData.technologies.flatMap(tech =>
  pseoData.roles.map(role => ({
    url: `${baseUrl}/templates/${tech.slug}/${role.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
)

const solutionRoutes = pseoData.features.map(feature => ({
  url: `${baseUrl}/solutions/${feature.slug}`,
  lastModified: new Date().toISOString(),
  changeFrequency: 'weekly' as const,
  priority: 0.6,
}))
```

### Step 5: Verify Build

Run `npm run build` to verify all pages generate correctly.

### Output Report

```markdown
## pSEO Generation Complete

### Pages Generated
- Tech × Role combinations: 25 pages (5 tech × 5 roles)
- Feature pages: 5 pages
- **Total**: 30 new pages

### Routes Created
- /templates/nextjs/frontend-developer
- /templates/nextjs/backend-developer
- ...
- /solutions/dark-mode
- /solutions/seo-optimized
- ...

### Sitemap Updated
- Added 30 new URLs to sitemap.xml

### Build Status
- [x] Build successful
- [x] All pages generated
- [x] No duplicate content warnings

### Content Uniqueness Verification
- All titles: Unique
- All descriptions: Unique
- FAQ variations: Implemented
```
"""

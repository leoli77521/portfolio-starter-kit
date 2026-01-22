"""
Technical SEO Audit Module for pSEO Engine

This module performs comprehensive technical SEO health checks,
extending the base /api/seo-health functionality.

Usage by Claude:
- Trigger: "seo audit" or "SEO诊断"
- Call /api/seo-health as base
- Perform extended checks on schema, links, and structure
- Generate prioritized fix list
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class CheckStatus(Enum):
    """Status of an SEO check"""
    PASSED = "passed"
    WARNING = "warning"
    FAILED = "failed"
    SKIPPED = "skipped"


class Priority(Enum):
    """Priority levels for fixes"""
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


@dataclass
class SEOCheck:
    """Represents a single SEO check result"""
    name: str
    category: str
    status: CheckStatus
    message: str
    impact: str
    fix_instructions: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    details: dict = field(default_factory=dict)


@dataclass
class AuditReport:
    """Complete technical SEO audit report"""
    timestamp: str
    overall_score: int  # 0-100
    status: str  # "excellent", "good", "needs-improvement", "poor"
    checks: list[SEOCheck] = field(default_factory=list)
    critical_issues: list[SEOCheck] = field(default_factory=list)
    warnings: list[SEOCheck] = field(default_factory=list)
    passed: list[SEOCheck] = field(default_factory=list)
    priority_fixes: list[SEOCheck] = field(default_factory=list)


# Check categories
CATEGORIES = {
    "accessibility": "Site Accessibility",
    "meta": "Meta Tags & SEO",
    "schema": "Structured Data",
    "performance": "Performance",
    "mobile": "Mobile Friendliness",
    "links": "Internal Linking",
    "technical": "Technical SEO",
}


# Base checks (aligned with /api/seo-health)
BASE_CHECKS = [
    {
        "name": "Sitemap Accessibility",
        "category": "accessibility",
        "check_url": "/sitemap.xml",
        "expected": "200 OK",
        "impact": "Search engines cannot discover pages without sitemap"
    },
    {
        "name": "Robots.txt Accessibility",
        "category": "accessibility",
        "check_url": "/robots.txt",
        "expected": "200 OK",
        "impact": "Crawlers may not understand crawl rules"
    },
    {
        "name": "Homepage Meta Tags",
        "category": "meta",
        "checks": ["title", "description", "canonical", "og:image"],
        "impact": "Poor SERP appearance and click-through rates"
    },
    {
        "name": "Structured Data Validation",
        "category": "schema",
        "check_for": "application/ld+json",
        "impact": "Missing rich results in search"
    },
    {
        "name": "Page Speed Basics",
        "category": "performance",
        "checks": ["response_time", "lazy_loading", "preconnect", "compression"],
        "impact": "Poor user experience and rankings"
    },
    {
        "name": "Mobile Friendliness",
        "category": "mobile",
        "checks": ["viewport", "responsive_images", "touch_icons"],
        "impact": "Poor mobile search rankings"
    },
]

# Extended checks (beyond base API)
EXTENDED_CHECKS = [
    {
        "name": "Schema Coverage",
        "category": "schema",
        "description": "Check for required schema types on content pages",
        "required_schemas": ["BlogPosting", "WebSite", "Organization"],
        "optional_schemas": ["HowTo", "FAQPage", "Course"],
        "impact": "Missing rich snippets and SERP features"
    },
    {
        "name": "Canonical Tags Consistency",
        "category": "technical",
        "description": "Verify all pages have correct canonical tags",
        "impact": "Duplicate content issues"
    },
    {
        "name": "Internal Link Health",
        "category": "links",
        "description": "Check for broken internal links",
        "impact": "Poor user experience and crawl efficiency"
    },
    {
        "name": "Orphan Page Detection",
        "category": "links",
        "description": "Find pages with no internal links pointing to them",
        "impact": "Pages may not be discovered by search engines"
    },
    {
        "name": "Redirect Chain Analysis",
        "category": "technical",
        "description": "Detect redirect chains longer than 1 hop",
        "impact": "PageRank dilution and slow page loads"
    },
    {
        "name": "Core Web Vitals Indicators",
        "category": "performance",
        "description": "Check for CWV optimization signals",
        "checks": ["image_optimization", "font_loading", "js_defer"],
        "impact": "Poor Core Web Vitals scores"
    },
    {
        "name": "HTTPS Enforcement",
        "category": "technical",
        "description": "Verify all URLs use HTTPS",
        "impact": "Security warnings and ranking penalty"
    },
    {
        "name": "XML Sitemap Completeness",
        "category": "accessibility",
        "description": "Verify all important pages are in sitemap",
        "impact": "Incomplete indexing"
    },
    {
        "name": "Hreflang Tags (if multilingual)",
        "category": "technical",
        "description": "Check for proper hreflang implementation",
        "impact": "Wrong language versions in search results"
    },
]


def get_status_emoji(status: CheckStatus) -> str:
    """Get emoji for check status"""
    return {
        CheckStatus.PASSED: "[PASS]",
        CheckStatus.WARNING: "[WARN]",
        CheckStatus.FAILED: "[FAIL]",
        CheckStatus.SKIPPED: "[SKIP]",
    }[status]


def calculate_overall_score(checks: list[SEOCheck]) -> tuple[int, str]:
    """
    Calculate overall SEO score and status.

    Args:
        checks: List of completed checks

    Returns:
        Tuple of (score, status)
    """
    if not checks:
        return 0, "unknown"

    passed = sum(1 for c in checks if c.status == CheckStatus.PASSED)
    total = len([c for c in checks if c.status != CheckStatus.SKIPPED])

    if total == 0:
        return 0, "unknown"

    score = round((passed / total) * 100)

    if score >= 90:
        status = "excellent"
    elif score >= 75:
        status = "good"
    elif score >= 50:
        status = "needs-improvement"
    else:
        status = "poor"

    return score, status


def prioritize_fixes(checks: list[SEOCheck]) -> list[SEOCheck]:
    """
    Sort failed checks by priority.

    Args:
        checks: List of checks

    Returns:
        Prioritized list of fixes needed
    """
    failed = [c for c in checks if c.status in (CheckStatus.FAILED, CheckStatus.WARNING)]
    return sorted(failed, key=lambda x: x.priority.value)


# Example usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "seo audit" or "SEO诊断":

1. First, call the /api/seo-health endpoint:
```
WebFetch: {baseUrl}/api/seo-health
```

2. Parse the base API results

3. Perform extended checks:
   - Read sitemap.ts to verify all pages are included
   - Check blog posts for schema coverage
   - Analyze internal link structure
   - Look for orphan pages

4. Generate comprehensive report:

```markdown
## Technical SEO Audit Report

Generated: 2024-01-15T10:30:00Z

### Overall Score: 85/100 - Good

### Summary
- Passed: 12 checks
- Warnings: 3 checks
- Failed: 1 check

---

### Critical Issues (Fix Immediately)

#### [FAIL] Schema Coverage
**Impact**: Missing rich snippets on blog posts
**Details**: 5 out of 20 blog posts missing BlogPosting schema
**Fix**: Add schema generation to blog post template

**Affected Pages**:
- /blog/example-post-1
- /blog/example-post-2

---

### Warnings (Should Fix)

#### [WARN] Orphan Pages Detected
**Impact**: These pages may not be discovered by search engines
**Details**: 2 pages have no incoming internal links
**Fix**: Add contextual links from related content

**Orphan Pages**:
- /blog/old-post-1
- /about

---

### Passed Checks

- [PASS] Sitemap Accessibility
- [PASS] Robots.txt Accessibility
- [PASS] Homepage Meta Tags
- [PASS] Mobile Friendliness
- [PASS] HTTPS Enforcement
- [PASS] Core Web Vitals Indicators
...

---

### Priority Fix Queue

1. **[CRITICAL]** Add missing BlogPosting schema to 5 posts
2. **[HIGH]** Fix orphan pages - add internal links
3. **[MEDIUM]** Optimize images for Core Web Vitals
4. **[LOW]** Add FAQPage schema to tutorial posts

---

### Quick Wins (Auto-fixable)
- Add missing schema to blog posts
- Generate updated sitemap

Run `apply seo fixes` to auto-fix compatible issues.
```

5. Offer to apply auto-fixes if available
"""


def generate_fix_instructions(check: SEOCheck) -> str:
    """
    Generate specific fix instructions for a failed check.

    Args:
        check: The failed check

    Returns:
        Detailed fix instructions
    """
    instructions = {
        "Schema Coverage": """
1. Check app/blog/[slug]/page.tsx for schema generation
2. Ensure generateMetadata returns proper JSON-LD
3. Add BlogPosting schema to all blog posts
4. Verify with Google Rich Results Test
""",
        "Orphan Page Detection": """
1. Identify related content for each orphan page
2. Add contextual internal links from high-traffic pages
3. Consider adding to navigation or footer if appropriate
4. Update sitemap if pages are important
""",
        "Internal Link Health": """
1. Run link checker to find broken links
2. Update or remove broken link references
3. Check for 404 pages and set up redirects
4. Verify all internal links use relative paths
""",
        "Core Web Vitals Indicators": """
1. Optimize images: use next/image with proper sizing
2. Defer non-critical JavaScript
3. Use font-display: swap for web fonts
4. Implement lazy loading for below-fold content
5. Check with PageSpeed Insights
""",
    }

    return instructions.get(check.name, "Review and fix according to best practices")

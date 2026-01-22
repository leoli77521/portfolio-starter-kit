"""
Content Optimizer Module for pSEO Engine

This module analyzes MDX/markdown content for SEO optimization opportunities,
scores existing content, and provides actionable improvement suggestions.

Usage by Claude:
- Trigger: "optimize content [path]" or "优化文章 [路径]"
- Read target file, analyze against SEO criteria
- Generate optimization report with auto-fixable and manual review items
"""

import re
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class IssueSeverity(Enum):
    """Severity levels for SEO issues"""
    CRITICAL = "critical"  # Must fix immediately
    WARNING = "warning"    # Should fix
    INFO = "info"          # Nice to have


class IssueCategory(Enum):
    """Categories of SEO issues"""
    TITLE = "title"
    META = "meta"
    HEADINGS = "headings"
    CONTENT = "content"
    IMAGES = "images"
    LINKS = "links"
    SCHEMA = "schema"
    FRESHNESS = "freshness"


@dataclass
class SEOIssue:
    """Represents an SEO issue found in content"""
    category: IssueCategory
    severity: IssueSeverity
    message: str
    current_value: Optional[str] = None
    suggested_fix: Optional[str] = None
    auto_fixable: bool = False
    line_number: Optional[int] = None


@dataclass
class ContentAnalysis:
    """Complete content analysis results"""
    file_path: str
    seo_score: int  # 0-100
    issues: list[SEOIssue] = field(default_factory=list)
    auto_fixes: list[SEOIssue] = field(default_factory=list)
    manual_review: list[SEOIssue] = field(default_factory=list)
    internal_link_suggestions: list[dict] = field(default_factory=list)
    schema_suggestions: list[str] = field(default_factory=list)


# SEO optimization rules
TITLE_MIN_LENGTH = 30
TITLE_MAX_LENGTH = 60
TITLE_OPTIMAL_MIN = 50
TITLE_OPTIMAL_MAX = 60

META_MIN_LENGTH = 120
META_MAX_LENGTH = 160
META_OPTIMAL_MIN = 150
META_OPTIMAL_MAX = 160

# Power words that increase CTR
POWER_WORDS = [
    "ultimate", "complete", "essential", "proven", "powerful",
    "simple", "easy", "quick", "fast", "best",
    "guide", "tutorial", "tips", "secrets", "mistakes",
    "free", "new", "updated", "2024", "2025",
]

# Outdated patterns to detect
OUTDATED_PATTERNS = [
    r"\b202[0-3]\b",  # Years 2020-2023
    r"v\d+\.\d+\.\d+",  # Version numbers (may need updating)
    r"deprecated",
    r"legacy",
]


def analyze_title(title: str) -> list[SEOIssue]:
    """
    Analyze title for SEO optimization.

    Args:
        title: The article title

    Returns:
        List of issues found
    """
    issues = []
    length = len(title)

    if length < TITLE_MIN_LENGTH:
        issues.append(SEOIssue(
            category=IssueCategory.TITLE,
            severity=IssueSeverity.WARNING,
            message=f"Title too short ({length} chars). Aim for {TITLE_OPTIMAL_MIN}-{TITLE_OPTIMAL_MAX} chars.",
            current_value=title,
            suggested_fix=f"Expand title to include more descriptive keywords",
            auto_fixable=False
        ))
    elif length > TITLE_MAX_LENGTH:
        issues.append(SEOIssue(
            category=IssueCategory.TITLE,
            severity=IssueSeverity.WARNING,
            message=f"Title too long ({length} chars). May be truncated in SERPs.",
            current_value=title,
            suggested_fix=f"Shorten to under {TITLE_MAX_LENGTH} characters",
            auto_fixable=False
        ))

    # Check for power words
    has_power_word = any(word.lower() in title.lower() for word in POWER_WORDS)
    if not has_power_word:
        issues.append(SEOIssue(
            category=IssueCategory.TITLE,
            severity=IssueSeverity.INFO,
            message="Title lacks power words. Consider adding one for higher CTR.",
            current_value=title,
            suggested_fix=f"Add a power word like: {', '.join(POWER_WORDS[:5])}",
            auto_fixable=False
        ))

    return issues


def analyze_meta_description(description: str) -> list[SEOIssue]:
    """
    Analyze meta description for SEO optimization.

    Args:
        description: The meta description

    Returns:
        List of issues found
    """
    issues = []

    if not description:
        issues.append(SEOIssue(
            category=IssueCategory.META,
            severity=IssueSeverity.CRITICAL,
            message="Missing meta description!",
            auto_fixable=False
        ))
        return issues

    length = len(description)

    if length < META_MIN_LENGTH:
        issues.append(SEOIssue(
            category=IssueCategory.META,
            severity=IssueSeverity.WARNING,
            message=f"Meta description too short ({length} chars). Aim for {META_OPTIMAL_MIN}-{META_OPTIMAL_MAX}.",
            current_value=description,
            auto_fixable=False
        ))
    elif length > META_MAX_LENGTH:
        issues.append(SEOIssue(
            category=IssueCategory.META,
            severity=IssueSeverity.WARNING,
            message=f"Meta description too long ({length} chars). Will be truncated.",
            current_value=description,
            suggested_fix=f"Trim to under {META_MAX_LENGTH} characters",
            auto_fixable=True  # Can auto-trim
        ))

    return issues


def analyze_headings(content: str) -> list[SEOIssue]:
    """
    Analyze heading structure for SEO.

    Args:
        content: The full content

    Returns:
        List of issues found
    """
    issues = []

    # Extract headings
    h1_matches = re.findall(r'^#\s+(.+)$', content, re.MULTILINE)
    h2_matches = re.findall(r'^##\s+(.+)$', content, re.MULTILINE)
    h3_matches = re.findall(r'^###\s+(.+)$', content, re.MULTILINE)

    # Check H1 count
    if len(h1_matches) > 1:
        issues.append(SEOIssue(
            category=IssueCategory.HEADINGS,
            severity=IssueSeverity.WARNING,
            message=f"Multiple H1 tags found ({len(h1_matches)}). Use only one H1.",
            auto_fixable=False
        ))

    # Check heading hierarchy
    if h3_matches and not h2_matches:
        issues.append(SEOIssue(
            category=IssueCategory.HEADINGS,
            severity=IssueSeverity.WARNING,
            message="H3 used without H2. Maintain proper heading hierarchy.",
            auto_fixable=False
        ))

    # Check heading count (content depth indicator)
    if len(h2_matches) < 3:
        issues.append(SEOIssue(
            category=IssueCategory.HEADINGS,
            severity=IssueSeverity.INFO,
            message="Few H2 headings. Consider breaking content into more sections.",
            auto_fixable=False
        ))

    return issues


def analyze_images(content: str) -> list[SEOIssue]:
    """
    Analyze images for SEO optimization.

    Args:
        content: The full content

    Returns:
        List of issues found
    """
    issues = []

    # Find markdown images
    img_pattern = r'!\[([^\]]*)\]\(([^)]+)\)'
    images = re.findall(img_pattern, content)

    for alt_text, src in images:
        if not alt_text or alt_text.strip() == "":
            issues.append(SEOIssue(
                category=IssueCategory.IMAGES,
                severity=IssueSeverity.WARNING,
                message=f"Image missing alt text: {src}",
                current_value=f"![{alt_text}]({src})",
                suggested_fix="Add descriptive alt text for accessibility and SEO",
                auto_fixable=True  # Can suggest alt text
            ))

    # Find Next.js Image components
    next_img_pattern = r'<Image[^>]*(?:alt\s*=\s*["\']([^"\']*)["\'])?[^>]*src\s*=\s*["\']([^"\']+)["\']'
    next_images = re.findall(next_img_pattern, content)

    for alt_text, src in next_images:
        if not alt_text:
            issues.append(SEOIssue(
                category=IssueCategory.IMAGES,
                severity=IssueSeverity.WARNING,
                message=f"Next.js Image missing alt text: {src}",
                auto_fixable=True
            ))

    return issues


def analyze_internal_links(content: str, all_posts: list[dict]) -> list[SEOIssue]:
    """
    Analyze internal linking opportunities.

    Args:
        content: The full content
        all_posts: List of all blog posts for linking

    Returns:
        List of issues found
    """
    issues = []

    # Count internal links
    internal_link_pattern = r'\[([^\]]+)\]\(/blog/([^)]+)\)'
    internal_links = re.findall(internal_link_pattern, content)

    if len(internal_links) < 2:
        issues.append(SEOIssue(
            category=IssueCategory.LINKS,
            severity=IssueSeverity.WARNING,
            message=f"Only {len(internal_links)} internal links. Aim for 2-3 related posts.",
            auto_fixable=True  # Can suggest links
        ))

    return issues


def analyze_content_freshness(content: str) -> list[SEOIssue]:
    """
    Check for outdated content patterns.

    Args:
        content: The full content

    Returns:
        List of issues found
    """
    issues = []

    for pattern in OUTDATED_PATTERNS:
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            issues.append(SEOIssue(
                category=IssueCategory.FRESHNESS,
                severity=IssueSeverity.INFO,
                message=f"Potentially outdated content detected: {', '.join(set(matches))}",
                auto_fixable=False
            ))

    return issues


def calculate_seo_score(issues: list[SEOIssue]) -> int:
    """
    Calculate overall SEO score based on issues.

    Args:
        issues: List of SEO issues

    Returns:
        Score from 0-100
    """
    score = 100

    for issue in issues:
        if issue.severity == IssueSeverity.CRITICAL:
            score -= 20
        elif issue.severity == IssueSeverity.WARNING:
            score -= 10
        elif issue.severity == IssueSeverity.INFO:
            score -= 3

    return max(0, score)


def suggest_schema_types(content: str, metadata: dict) -> list[str]:
    """
    Suggest appropriate Schema.org types for content.

    Args:
        content: The full content
        metadata: Post metadata

    Returns:
        List of suggested schema types
    """
    suggestions = []

    # Always suggest Article/BlogPosting
    suggestions.append("BlogPosting (required)")

    # Check for how-to patterns
    howto_patterns = ["step 1", "step one", "how to", "tutorial", "guide"]
    if any(pattern in content.lower() for pattern in howto_patterns):
        suggestions.append("HowTo - Content has step-by-step instructions")

    # Check for FAQ patterns
    faq_patterns = ["?", "Q:", "FAQ", "question"]
    question_count = content.count("?")
    if question_count >= 3:
        suggestions.append("FAQPage - Content has multiple Q&A sections")

    # Check for course/tutorial content
    if "lesson" in content.lower() or "chapter" in content.lower():
        suggestions.append("Course - Content structured as learning material")

    return suggestions


# Example usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "optimize content [path]":

1. Read the target file using Read tool
2. Extract frontmatter metadata and content body
3. Run analysis functions on each aspect
4. Generate report:

```markdown
## Content Optimization Report: [filename]

### SEO Score: 75/100

### Critical Issues
- [x] Missing meta description

### Warnings (Should Fix)
- [ ] Title too short (45 chars) - Aim for 50-60
- [ ] Only 1 internal link - Add 1-2 more related posts

### Auto-fixable Issues
Ready to auto-apply:
- Add alt text to image on line 45
- Add FAQ Schema for Q&A section

### Internal Link Suggestions
Based on content similarity:
| Anchor Text | Target Post | Relevance |
|-------------|-------------|-----------|
| "AI development" | /blog/ai-development-guide | High |
| "prompt engineering" | /blog/prompt-engineering-tips | Medium |

### Schema Recommendations
- [x] BlogPosting (already present)
- [ ] Add HowTo schema - content has step-by-step instructions
- [ ] Add FAQPage schema - content has 5 Q&A sections

### Content Freshness Check
- Warning: References to "2023" found - consider updating

---

To apply auto-fixes, respond: "apply fixes"
To skip, respond: "skip"
```

5. If user confirms, apply auto-fixable changes using Edit tool
"""

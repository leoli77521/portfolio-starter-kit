"""
SEO Report Generator Module for pSEO Engine

This module generates comprehensive SEO analysis reports
by combining results from all other modules.

Usage by Claude:
- Trigger: "seo analysis" or "SEO分析"
- Runs all checks: technical, content, keywords, links
- Generates prioritized action plan
- Provides executive summary
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional
from enum import Enum


class ImpactLevel(Enum):
    """Impact level for SEO issues"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class EffortLevel(Enum):
    """Effort required to fix"""
    QUICK = "quick"  # < 5 minutes
    MODERATE = "moderate"  # 5-30 minutes
    SIGNIFICANT = "significant"  # > 30 minutes


@dataclass
class ActionItem:
    """A prioritized action item"""
    title: str
    description: str
    impact: ImpactLevel
    effort: EffortLevel
    category: str
    auto_fixable: bool = False
    affected_pages: list[str] = field(default_factory=list)
    fix_command: Optional[str] = None


@dataclass
class CategoryScore:
    """Score for a specific SEO category"""
    name: str
    score: int  # 0-100
    checks_passed: int
    checks_total: int
    issues: list[str] = field(default_factory=list)


@dataclass
class SEOReport:
    """Complete SEO analysis report"""
    generated_at: str
    overall_score: int  # 0-100
    status: str  # "excellent", "good", "needs-improvement", "poor"
    executive_summary: str
    category_scores: list[CategoryScore] = field(default_factory=list)
    quick_wins: list[ActionItem] = field(default_factory=list)
    priority_actions: list[ActionItem] = field(default_factory=list)
    all_actions: list[ActionItem] = field(default_factory=list)
    content_stats: dict = field(default_factory=dict)
    technical_health: dict = field(default_factory=dict)
    keyword_opportunities: list[str] = field(default_factory=list)


def calculate_priority_score(item: ActionItem) -> float:
    """
    Calculate priority score for sorting actions.

    Higher score = higher priority.

    Args:
        item: The action item

    Returns:
        Priority score
    """
    impact_weights = {
        ImpactLevel.HIGH: 3,
        ImpactLevel.MEDIUM: 2,
        ImpactLevel.LOW: 1
    }

    effort_weights = {
        EffortLevel.QUICK: 3,
        EffortLevel.MODERATE: 2,
        EffortLevel.SIGNIFICANT: 1
    }

    # Higher impact + lower effort = higher priority
    return impact_weights[item.impact] * effort_weights[item.effort]


def prioritize_actions(actions: list[ActionItem]) -> list[ActionItem]:
    """
    Sort actions by priority score.

    Args:
        actions: List of action items

    Returns:
        Sorted list (highest priority first)
    """
    return sorted(actions, key=calculate_priority_score, reverse=True)


def identify_quick_wins(actions: list[ActionItem]) -> list[ActionItem]:
    """
    Identify quick wins (high impact, low effort, auto-fixable).

    Args:
        actions: All action items

    Returns:
        List of quick wins
    """
    return [
        a for a in actions
        if a.effort == EffortLevel.QUICK and a.impact in (ImpactLevel.HIGH, ImpactLevel.MEDIUM)
    ]


def generate_executive_summary(report: SEOReport) -> str:
    """
    Generate executive summary text.

    Args:
        report: The full report

    Returns:
        Executive summary string
    """
    status_descriptions = {
        "excellent": "Your site's SEO is in excellent shape",
        "good": "Your site's SEO is good with room for improvement",
        "needs-improvement": "Your site's SEO needs attention in several areas",
        "poor": "Your site's SEO requires significant work"
    }

    summary = f"{status_descriptions.get(report.status, 'SEO analysis complete')}. "

    if report.quick_wins:
        summary += f"There are {len(report.quick_wins)} quick wins available that can be fixed immediately. "

    critical_count = sum(1 for a in report.all_actions if a.impact == ImpactLevel.HIGH)
    if critical_count:
        summary += f"Found {critical_count} high-impact issues requiring attention. "

    if report.content_stats.get("total_posts", 0) > 0:
        avg_score = report.content_stats.get("average_score", 0)
        summary += f"Average content SEO score is {avg_score}/100 across {report.content_stats['total_posts']} posts."

    return summary


def calculate_overall_score(category_scores: list[CategoryScore]) -> tuple[int, str]:
    """
    Calculate overall score from category scores.

    Args:
        category_scores: List of category scores

    Returns:
        Tuple of (score, status)
    """
    if not category_scores:
        return 0, "unknown"

    # Weighted average (technical issues weight more)
    weights = {
        "Technical SEO": 1.5,
        "Content Quality": 1.2,
        "Internal Linking": 1.0,
        "Structured Data": 1.0,
        "Performance": 1.0,
    }

    total_weight = 0
    weighted_sum = 0

    for cs in category_scores:
        weight = weights.get(cs.name, 1.0)
        weighted_sum += cs.score * weight
        total_weight += weight

    score = round(weighted_sum / total_weight) if total_weight > 0 else 0

    if score >= 90:
        status = "excellent"
    elif score >= 75:
        status = "good"
    elif score >= 50:
        status = "needs-improvement"
    else:
        status = "poor"

    return score, status


def format_report_markdown(report: SEOReport) -> str:
    """
    Format report as markdown.

    Args:
        report: The SEO report

    Returns:
        Formatted markdown string
    """
    md = f"""# Comprehensive SEO Analysis Report

Generated: {report.generated_at}

## Executive Summary

**Overall Score: {report.overall_score}/100** - {report.status.title()}

{report.executive_summary}

---

## Category Breakdown

| Category | Score | Passed/Total |
|----------|-------|--------------|
"""

    for cs in report.category_scores:
        md += f"| {cs.name} | {cs.score}/100 | {cs.checks_passed}/{cs.checks_total} |\n"

    md += """
---

## Quick Wins (Do These Now)

"""
    if report.quick_wins:
        for i, qw in enumerate(report.quick_wins, 1):
            auto = " [Auto-fixable]" if qw.auto_fixable else ""
            md += f"{i}. **{qw.title}**{auto}\n"
            md += f"   - Impact: {qw.impact.value.title()}\n"
            md += f"   - {qw.description}\n\n"
    else:
        md += "No quick wins identified.\n"

    md += """
---

## Priority Action Items

"""
    for i, action in enumerate(report.priority_actions[:10], 1):
        md += f"""### {i}. {action.title}

- **Impact**: {action.impact.value.title()}
- **Effort**: {action.effort.value.title()}
- **Category**: {action.category}

{action.description}

"""
        if action.affected_pages:
            md += "**Affected pages:**\n"
            for page in action.affected_pages[:5]:
                md += f"- {page}\n"
            if len(action.affected_pages) > 5:
                md += f"- ... and {len(action.affected_pages) - 5} more\n"
            md += "\n"

    md += """
---

## Content Statistics

"""
    if report.content_stats:
        md += f"""| Metric | Value |
|--------|-------|
| Total Posts | {report.content_stats.get('total_posts', 'N/A')} |
| Average Score | {report.content_stats.get('average_score', 'N/A')}/100 |
| Posts with Schema | {report.content_stats.get('with_schema', 'N/A')} |
| Posts needing updates | {report.content_stats.get('needs_update', 'N/A')} |
"""

    md += """
---

## Keyword Opportunities

"""
    if report.keyword_opportunities:
        for kw in report.keyword_opportunities[:5]:
            md += f"- {kw}\n"
    else:
        md += "Run `keyword research [topic]` to discover opportunities.\n"

    md += """
---

## Available Actions

| Command | Description |
|---------|-------------|
| `apply seo fixes` | Apply all auto-fixable changes |
| `optimize content [path]` | Deep-dive on specific content |
| `build internal links` | Get internal link suggestions |
| `generate pseo` | Create programmatic SEO pages |
"""

    return md


# Usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "seo analysis" or "SEO分析":

### Workflow

```
Step 1: Technical Audit
→ Call /api/seo-health (WebFetch)
→ Extended checks (schema coverage, link health)

Step 2: Content Analysis
→ Read all blog posts
→ Score each for SEO
→ Identify issues

Step 3: Link Analysis
→ Build link graph
→ Find orphans
→ Identify opportunities

Step 4: Keyword Analysis (Optional)
→ WebSearch for key topics
→ Identify gaps

Step 5: Compile Report
→ Calculate scores
→ Prioritize actions
→ Generate markdown
```

### Example Output

```markdown
# Comprehensive SEO Analysis Report

Generated: 2024-01-15T10:30:00Z

## Executive Summary

**Overall Score: 78/100** - Good

Your site's SEO is good with room for improvement. There are 5 quick
wins available that can be fixed immediately. Found 3 high-impact
issues requiring attention. Average content SEO score is 72/100
across 28 posts.

---

## Category Breakdown

| Category | Score | Passed/Total |
|----------|-------|--------------|
| Technical SEO | 85/100 | 10/12 |
| Content Quality | 72/100 | 21/28 |
| Internal Linking | 68/100 | 15/22 |
| Structured Data | 80/100 | 8/10 |
| Performance | 82/100 | 9/11 |

---

## Quick Wins (Do These Now)

1. **Add missing alt text to 12 images** [Auto-fixable]
   - Impact: Medium
   - Improves accessibility and image SEO

2. **Add BlogPosting schema to 5 posts** [Auto-fixable]
   - Impact: High
   - Enables rich snippets in search results

3. **Fix meta description length on 3 posts** [Auto-fixable]
   - Impact: Medium
   - Optimizes SERP appearance

---

## Priority Action Items

### 1. Add FAQ Schema to Tutorial Posts

- **Impact**: High
- **Effort**: Moderate
- **Category**: Structured Data

5 tutorial posts could benefit from FAQPage schema to capture
PAA (People Also Ask) SERP features.

**Affected pages:**
- /blog/nextjs-tutorial
- /blog/react-hooks-guide
- /blog/typescript-basics
- /blog/tailwind-setup
- /blog/mdx-blog-setup

### 2. Rescue Orphan Pages

- **Impact**: High
- **Effort**: Moderate
- **Category**: Internal Linking

3 pages have no internal links pointing to them and may not
be discovered by search engines.

**Affected pages:**
- /blog/old-react-post
- /blog/2023-summary
- /about

...

---

## Available Actions

| Command | Description |
|---------|-------------|
| `apply seo fixes` | Apply all 5 auto-fixable changes |
| `optimize content /blog/[slug]` | Deep-dive on specific content |
| `build internal links` | Get detailed link suggestions |
| `generate pseo` | Create programmatic SEO pages |
```

### After Report Generation

Wait for user to choose action:
- If "apply seo fixes" → Execute auto-fixes
- If specific command → Run that module
- If questions → Explain findings
"""

"""
Competitor Analyzer Module for pSEO Engine

This module analyzes competitor pages to identify content gaps,
structural differences, and optimization opportunities.

Usage by Claude:
- Trigger: "analyze competitor [url]" or "分析竞争对手 [URL]"
- Use WebFetch to retrieve competitor page
- Compare against our site's content
- Generate actionable opportunity report
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ContentMetrics:
    """Metrics extracted from content analysis"""
    word_count: int = 0
    heading_count: int = 0
    h2_count: int = 0
    h3_count: int = 0
    image_count: int = 0
    video_count: int = 0
    internal_link_count: int = 0
    external_link_count: int = 0
    code_block_count: int = 0
    list_count: int = 0
    table_count: int = 0


@dataclass
class SchemaInfo:
    """Schema.org structured data found on page"""
    types: list[str] = field(default_factory=list)
    has_faq: bool = False
    has_howto: bool = False
    has_article: bool = False
    has_breadcrumb: bool = False
    has_organization: bool = False
    raw_schemas: list[dict] = field(default_factory=list)


@dataclass
class SERPFeatures:
    """SERP features the competitor may be targeting"""
    targets_featured_snippet: bool = False
    has_faq_schema: bool = False
    has_howto_schema: bool = False
    has_video: bool = False
    has_images_for_pack: bool = False
    estimated_serp_features: list[str] = field(default_factory=list)


@dataclass
class CompetitorAnalysis:
    """Complete competitor analysis results"""
    url: str
    title: str
    meta_description: str
    content_metrics: ContentMetrics
    schema_info: SchemaInfo
    serp_features: SERPFeatures
    keywords_detected: list[str] = field(default_factory=list)
    content_structure: list[str] = field(default_factory=list)  # Heading hierarchy
    strengths: list[str] = field(default_factory=list)
    weaknesses: list[str] = field(default_factory=list)


@dataclass
class GapAnalysis:
    """Gap analysis between competitor and our site"""
    competitor_url: str
    our_coverage: dict = field(default_factory=dict)
    keyword_gaps: list[str] = field(default_factory=list)
    content_gaps: list[str] = field(default_factory=list)
    schema_gaps: list[str] = field(default_factory=list)
    opportunities: list[dict] = field(default_factory=list)


def extract_content_metrics(html_content: str) -> ContentMetrics:
    """
    Extract content metrics from HTML.

    Args:
        html_content: Raw HTML content

    Returns:
        ContentMetrics with extracted values
    """
    metrics = ContentMetrics()

    # Count words (rough estimate from text content)
    import re
    text = re.sub(r'<[^>]+>', ' ', html_content)
    words = text.split()
    metrics.word_count = len(words)

    # Count headings
    metrics.h2_count = len(re.findall(r'<h2[^>]*>', html_content, re.IGNORECASE))
    metrics.h3_count = len(re.findall(r'<h3[^>]*>', html_content, re.IGNORECASE))
    metrics.heading_count = metrics.h2_count + metrics.h3_count

    # Count media
    metrics.image_count = len(re.findall(r'<img[^>]+>', html_content, re.IGNORECASE))
    metrics.video_count = len(re.findall(r'<video|<iframe[^>]*youtube|<iframe[^>]*vimeo', html_content, re.IGNORECASE))

    # Count code blocks
    metrics.code_block_count = len(re.findall(r'<pre[^>]*>|<code[^>]*class="', html_content, re.IGNORECASE))

    # Count lists
    metrics.list_count = len(re.findall(r'<ul[^>]*>|<ol[^>]*>', html_content, re.IGNORECASE))

    # Count tables
    metrics.table_count = len(re.findall(r'<table[^>]*>', html_content, re.IGNORECASE))

    return metrics


def extract_schema_info(html_content: str) -> SchemaInfo:
    """
    Extract Schema.org structured data from HTML.

    Args:
        html_content: Raw HTML content

    Returns:
        SchemaInfo with found schemas
    """
    import re
    import json

    info = SchemaInfo()

    # Find JSON-LD scripts
    pattern = r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>'
    matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)

    for match in matches:
        try:
            schema = json.loads(match.strip())
            info.raw_schemas.append(schema)

            # Detect schema type
            schema_type = schema.get('@type', '')
            if isinstance(schema_type, list):
                info.types.extend(schema_type)
            else:
                info.types.append(schema_type)

            # Check for specific types
            if 'FAQPage' in str(schema_type):
                info.has_faq = True
            if 'HowTo' in str(schema_type):
                info.has_howto = True
            if 'Article' in str(schema_type) or 'BlogPosting' in str(schema_type):
                info.has_article = True
            if 'BreadcrumbList' in str(schema_type):
                info.has_breadcrumb = True
            if 'Organization' in str(schema_type):
                info.has_organization = True

        except json.JSONDecodeError:
            continue

    return info


def analyze_serp_features(content_metrics: ContentMetrics, schema_info: SchemaInfo) -> SERPFeatures:
    """
    Analyze what SERP features the content might be targeting.

    Args:
        content_metrics: Extracted content metrics
        schema_info: Schema information

    Returns:
        SERPFeatures analysis
    """
    features = SERPFeatures()
    estimated = []

    # Featured snippet targeting
    if content_metrics.list_count > 0 or content_metrics.table_count > 0:
        features.targets_featured_snippet = True
        estimated.append("Featured Snippet (list/table)")

    # FAQ targeting
    if schema_info.has_faq:
        features.has_faq_schema = True
        estimated.append("FAQ Rich Result")

    # HowTo targeting
    if schema_info.has_howto:
        features.has_howto_schema = True
        estimated.append("HowTo Rich Result")

    # Video targeting
    if content_metrics.video_count > 0:
        features.has_video = True
        estimated.append("Video Carousel")

    # Image pack
    if content_metrics.image_count >= 3:
        features.has_images_for_pack = True
        estimated.append("Image Pack (potential)")

    features.estimated_serp_features = estimated
    return features


def identify_keyword_gaps(competitor_keywords: list[str], our_keywords: list[str]) -> list[str]:
    """
    Identify keywords competitor ranks for that we don't cover.

    Args:
        competitor_keywords: Keywords from competitor analysis
        our_keywords: Keywords we currently target

    Returns:
        List of gap keywords
    """
    our_set = set(k.lower() for k in our_keywords)
    gaps = [k for k in competitor_keywords if k.lower() not in our_set]
    return gaps


def generate_opportunities(
    competitor: CompetitorAnalysis,
    our_metrics: ContentMetrics,
    our_schema: SchemaInfo
) -> list[dict]:
    """
    Generate actionable opportunities based on comparison.

    Args:
        competitor: Competitor analysis
        our_metrics: Our content metrics
        our_schema: Our schema info

    Returns:
        List of opportunity dictionaries
    """
    opportunities = []

    # Content length gap
    if competitor.content_metrics.word_count > our_metrics.word_count * 1.5:
        opportunities.append({
            "type": "content_depth",
            "priority": "high",
            "description": f"Competitor has {competitor.content_metrics.word_count} words vs our ~{our_metrics.word_count}",
            "action": "Expand content with more detail, examples, or sections"
        })

    # Media gap
    if competitor.content_metrics.image_count > our_metrics.image_count + 2:
        opportunities.append({
            "type": "visual_content",
            "priority": "medium",
            "description": f"Competitor uses {competitor.content_metrics.image_count} images",
            "action": "Add diagrams, screenshots, or infographics"
        })

    # Schema gap
    if competitor.schema_info.has_faq and not our_schema.has_faq:
        opportunities.append({
            "type": "schema",
            "priority": "high",
            "description": "Competitor has FAQ schema, we don't",
            "action": "Add FAQ section with FAQPage schema"
        })

    if competitor.schema_info.has_howto and not our_schema.has_howto:
        opportunities.append({
            "type": "schema",
            "priority": "medium",
            "description": "Competitor has HowTo schema",
            "action": "Add step-by-step section with HowTo schema if applicable"
        })

    # Video gap
    if competitor.content_metrics.video_count > 0 and our_metrics.video_count == 0:
        opportunities.append({
            "type": "media",
            "priority": "medium",
            "description": "Competitor includes video content",
            "action": "Consider adding explanatory video or embed"
        })

    # Code examples gap
    if competitor.content_metrics.code_block_count > our_metrics.code_block_count + 2:
        opportunities.append({
            "type": "technical_depth",
            "priority": "medium",
            "description": f"Competitor has {competitor.content_metrics.code_block_count} code examples",
            "action": "Add more practical code examples"
        })

    return opportunities


# Usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "analyze competitor [url]":

1. Use WebFetch to retrieve the competitor page:
```
WebFetch: [competitor_url]
Prompt: "Extract the following from this page:
- Page title
- Meta description
- All H2 and H3 headings
- Number of images
- Number of code blocks
- Any FAQ sections
- Any step-by-step instructions
- JSON-LD structured data"
```

2. Compare against our relevant content

3. Generate comparison report:

```markdown
## Competitor Analysis: [URL]

### Page Overview
- **Title**: [title] (X chars)
- **Meta**: [description] (X chars)
- **Word Count**: ~X,XXX words

### Content Structure
```
H1: Main Title
  H2: Section 1
    H3: Subsection 1.1
  H2: Section 2
  ...
```

### Content Metrics Comparison

| Metric | Competitor | Our Page | Gap |
|--------|------------|----------|-----|
| Word Count | 3,500 | 1,800 | -1,700 |
| Images | 12 | 4 | -8 |
| Code Blocks | 8 | 3 | -5 |
| H2 Sections | 7 | 4 | -3 |

### Schema Implementation

| Schema Type | Competitor | Our Page |
|-------------|------------|----------|
| Article/BlogPosting | Yes | Yes |
| FAQPage | Yes | No |
| HowTo | No | No |
| BreadcrumbList | Yes | Yes |

### SERP Features Targeting
Competitor appears to target:
- [x] Featured Snippet (has structured lists)
- [x] FAQ Rich Results (has FAQPage schema)
- [ ] Video Carousel

### Keyword Analysis
Keywords competitor emphasizes that we don't cover:
- [keyword 1]
- [keyword 2]
- [keyword 3]

### Strengths (Competitor Does Well)
1. More comprehensive content depth
2. Better visual explanations
3. FAQ section captures PAA

### Weaknesses (We Can Beat)
1. Outdated examples (references 2023)
2. No practical code examples
3. Poor mobile formatting

---

## Actionable Opportunities

### High Priority
1. **Add FAQ Section**
   - Create 5-8 common questions with answers
   - Add FAQPage schema
   - Target People Also Ask

2. **Expand Content Depth**
   - Add 1,500+ words of value
   - Cover missing subtopics: [list]

### Medium Priority
3. **Add Visual Content**
   - Create 5+ diagrams/screenshots
   - Add code output examples

4. **Include Video**
   - Embed tutorial video
   - Or create short explainer

### Quick Wins
- Add structured list for featured snippet targeting
- Update meta description to be more compelling
- Add more internal links
```

4. Suggest specific content improvements based on gaps
"""

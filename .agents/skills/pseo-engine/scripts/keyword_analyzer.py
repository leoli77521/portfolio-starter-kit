"""
Keyword Analyzer Module for pSEO Engine

This module provides keyword research capabilities using WebSearch to analyze
SERP data, discover long-tail keywords, and classify search intent.

Usage by Claude:
- Trigger: "keyword research [topic]" or "分析关键词 [主题]"
- Uses WebSearch tool to gather real-time SERP data
- Generates comprehensive keyword reports
"""

from dataclasses import dataclass
from enum import Enum
from typing import Optional


class SearchIntent(Enum):
    """Classification of search intent types"""
    INFORMATIONAL = "informational"  # User wants to learn something
    NAVIGATIONAL = "navigational"    # User wants to find a specific page
    TRANSACTIONAL = "transactional"  # User wants to take action (buy, download)
    COMMERCIAL = "commercial"        # User is researching before purchase


@dataclass
class Keyword:
    """Represents a keyword with its analysis metrics"""
    term: str
    intent: SearchIntent
    difficulty: str  # "low", "medium", "high"
    opportunity_score: int  # 1-100
    search_volume_indicator: str  # "low", "medium", "high" (estimated)
    notes: Optional[str] = None


@dataclass
class KeywordReport:
    """Complete keyword research report"""
    topic: str
    primary_keywords: list[Keyword]
    long_tail_variations: list[str]
    paa_questions: list[str]  # People Also Ask
    featured_snippet_opportunities: list[str]
    content_recommendations: list[str]
    competitor_insights: list[str]


# Long-tail keyword patterns for different contexts
LONG_TAIL_PATTERNS = [
    "{topic} tutorial",
    "{topic} guide",
    "{topic} for beginners",
    "{topic} best practices",
    "{topic} examples",
    "how to use {topic}",
    "what is {topic}",
    "{topic} vs alternatives",
    "{topic} in 2024",
    "{topic} tips and tricks",
    "learn {topic}",
    "{topic} for developers",
    "{topic} for software engineers",
    "{topic} for frontend developers",
    "{topic} for backend developers",
]

# Role-based patterns for pSEO targeting
ROLE_PATTERNS = [
    "{topic} for {role}",
    "best {topic} {role} guide",
    "{topic} tutorial for {role}s",
]

ROLES = [
    "developer",
    "software engineer",
    "frontend developer",
    "backend developer",
    "fullstack developer",
    "data scientist",
    "DevOps engineer",
    "product manager",
]


def classify_intent(query: str, serp_features: dict) -> SearchIntent:
    """
    Classify search intent based on query and SERP features.

    Args:
        query: The search query
        serp_features: Dictionary of SERP features present

    Returns:
        SearchIntent enum value
    """
    query_lower = query.lower()

    # Informational signals
    info_signals = ["what is", "how to", "why", "guide", "tutorial", "learn", "explained"]
    if any(signal in query_lower for signal in info_signals):
        return SearchIntent.INFORMATIONAL

    # Transactional signals
    trans_signals = ["buy", "download", "get", "pricing", "free", "trial"]
    if any(signal in query_lower for signal in trans_signals):
        return SearchIntent.TRANSACTIONAL

    # Commercial signals
    comm_signals = ["best", "top", "review", "comparison", "vs", "alternative"]
    if any(signal in query_lower for signal in comm_signals):
        return SearchIntent.COMMERCIAL

    # Default to informational for tech topics
    return SearchIntent.INFORMATIONAL


def estimate_difficulty(serp_results: list) -> str:
    """
    Estimate keyword difficulty based on SERP analysis.

    Factors considered:
    - Domain authority of ranking sites
    - Presence of major brands
    - Content depth of top results

    Args:
        serp_results: List of SERP result data

    Returns:
        "low", "medium", or "high"
    """
    high_authority_domains = [
        "github.com", "stackoverflow.com", "medium.com",
        "dev.to", "mozilla.org", "w3schools.com",
        "microsoft.com", "google.com", "aws.amazon.com"
    ]

    # Count high-authority domains in top 10
    authority_count = 0
    for result in serp_results[:10]:
        domain = result.get("domain", "")
        if any(auth in domain for auth in high_authority_domains):
            authority_count += 1

    if authority_count >= 7:
        return "high"
    elif authority_count >= 4:
        return "medium"
    return "low"


def calculate_opportunity_score(
    difficulty: str,
    intent: SearchIntent,
    has_featured_snippet: bool,
    paa_count: int
) -> int:
    """
    Calculate opportunity score (1-100) for a keyword.

    Higher scores indicate better opportunities.

    Args:
        difficulty: "low", "medium", or "high"
        intent: SearchIntent classification
        has_featured_snippet: Whether featured snippet is present
        paa_count: Number of People Also Ask questions

    Returns:
        Score from 1-100
    """
    score = 50  # Base score

    # Difficulty adjustment
    if difficulty == "low":
        score += 30
    elif difficulty == "medium":
        score += 15
    else:
        score -= 10

    # Intent bonus (informational is best for content sites)
    if intent == SearchIntent.INFORMATIONAL:
        score += 15
    elif intent == SearchIntent.COMMERCIAL:
        score += 10

    # Featured snippet opportunity
    if has_featured_snippet:
        score += 10

    # PAA opportunity
    score += min(paa_count * 3, 15)

    return max(1, min(100, score))


def generate_long_tail_keywords(topic: str) -> list[str]:
    """
    Generate long-tail keyword variations for a topic.

    Args:
        topic: The main topic/keyword

    Returns:
        List of long-tail keyword variations
    """
    variations = []

    for pattern in LONG_TAIL_PATTERNS:
        variations.append(pattern.format(topic=topic))

    for role in ROLES:
        for pattern in ROLE_PATTERNS:
            variations.append(pattern.format(topic=topic, role=role))

    return variations


def extract_paa_questions(serp_data: dict) -> list[str]:
    """
    Extract People Also Ask questions from SERP data.

    Args:
        serp_data: Raw SERP data from WebSearch

    Returns:
        List of PAA questions
    """
    # This would parse actual SERP data
    # Example questions based on common patterns
    questions = [
        f"What is {serp_data.get('topic', 'this topic')}?",
        f"How does {serp_data.get('topic', 'this')} work?",
        f"Is {serp_data.get('topic', 'this')} good for beginners?",
        f"What are the benefits of {serp_data.get('topic', 'this')}?",
    ]
    return questions


def generate_content_recommendations(
    topic: str,
    keywords: list[Keyword],
    paa_questions: list[str]
) -> list[str]:
    """
    Generate content recommendations based on keyword analysis.

    Args:
        topic: Main topic
        keywords: Analyzed keywords
        paa_questions: PAA questions to target

    Returns:
        List of content recommendations
    """
    recommendations = []

    # Tutorial recommendation
    recommendations.append(
        f"Create a comprehensive '{topic} Tutorial for Beginners' - "
        "High search volume, informational intent"
    )

    # Comparison post
    recommendations.append(
        f"Write '{topic} vs [Competitor] Comparison' - "
        "Captures commercial intent traffic"
    )

    # FAQ post targeting PAA
    if paa_questions:
        recommendations.append(
            f"Create FAQ-style post answering common {topic} questions - "
            "Target featured snippets and PAA boxes"
        )

    # Best practices guide
    recommendations.append(
        f"Publish '{topic} Best Practices Guide' - "
        "Evergreen content for authority building"
    )

    return recommendations


# Example usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "keyword research [topic]":

1. Use WebSearch to query:
   - "[topic]" - main SERP
   - "[topic] tutorial" - informational variant
   - "best [topic]" - commercial variant

2. Analyze results:
   - Count high-authority domains
   - Identify featured snippets
   - Extract PAA questions

3. Generate report using this format:

```markdown
## Keyword Research Report: [Topic]

### Primary Keywords
| Keyword | Intent | Difficulty | Opportunity |
|---------|--------|------------|-------------|
| [keyword] | Informational | Medium | 75 |

### Long-tail Variations
- [topic] tutorial for beginners
- how to use [topic] effectively
- [topic] best practices 2024

### People Also Ask (Target These)
- What is [topic]?
- How does [topic] work?

### Content Recommendations
1. **Tutorial Post**: "[Topic] Complete Guide for Beginners"
   - Target: "[topic] tutorial", "[topic] for beginners"
   - Estimated difficulty: Medium

2. **Comparison Post**: "[Topic] vs [Alternative]: Which is Better?"
   - Target: "[topic] vs [alt]", "best [topic]"
   - Estimated difficulty: Low

### Featured Snippet Opportunities
- Definition snippets for "what is [topic]"
- List snippets for "best [topic] practices"
```
"""

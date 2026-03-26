"""
Internal Link Builder Module for pSEO Engine

This module builds and analyzes the internal link structure,
identifies orphan pages, and suggests optimal link placements.

Usage by Claude:
- Trigger: "build internal links" or "构建内链"
- Analyzes all pages for link structure
- Implements Hub-and-Spoke strategy
- Generates link insertion recommendations
"""

from dataclasses import dataclass, field
from typing import Optional
from collections import defaultdict


@dataclass
class PageNode:
    """Represents a page in the link graph"""
    path: str
    title: str
    category: Optional[str] = None
    tags: list[str] = field(default_factory=list)
    incoming_links: list[str] = field(default_factory=list)
    outgoing_links: list[str] = field(default_factory=list)
    page_type: str = "content"  # "hub", "content", "guide", "pseo"
    authority_score: float = 0.0


@dataclass
class LinkSuggestion:
    """A suggested internal link to add"""
    source_path: str
    target_path: str
    anchor_text: str
    reason: str
    relevance_score: float
    context: str  # Where in the content to add


@dataclass
class LinkGraph:
    """Complete site internal link structure"""
    pages: dict[str, PageNode] = field(default_factory=dict)
    orphan_pages: list[str] = field(default_factory=list)
    hub_pages: list[str] = field(default_factory=list)
    average_incoming: float = 0.0
    average_outgoing: float = 0.0
    suggestions: list[LinkSuggestion] = field(default_factory=list)


# Page type definitions
PAGE_TYPES = {
    "hub": {
        "patterns": ["/topics/", "/categories/"],
        "target_outgoing": 10,
        "target_incoming": 5
    },
    "guide": {
        "patterns": ["/guides/"],
        "target_outgoing": 5,
        "target_incoming": 8
    },
    "content": {
        "patterns": ["/blog/"],
        "target_outgoing": 3,
        "target_incoming": 2
    },
    "pseo": {
        "patterns": ["/templates/", "/solutions/"],
        "target_outgoing": 3,
        "target_incoming": 1
    }
}


def classify_page_type(path: str) -> str:
    """
    Classify a page by its type based on URL pattern.

    Args:
        path: The page path

    Returns:
        Page type string
    """
    for page_type, config in PAGE_TYPES.items():
        if any(pattern in path for pattern in config["patterns"]):
            return page_type
    return "content"


def calculate_authority_score(node: PageNode) -> float:
    """
    Calculate page authority score based on links.

    Args:
        node: The page node

    Returns:
        Authority score (0-1)
    """
    incoming_weight = len(node.incoming_links) * 0.7
    outgoing_weight = len(node.outgoing_links) * 0.3

    # Type bonus
    type_bonus = {
        "hub": 0.3,
        "guide": 0.2,
        "content": 0.1,
        "pseo": 0.05
    }.get(node.page_type, 0)

    score = (incoming_weight + outgoing_weight + type_bonus) / 10
    return min(1.0, score)


def find_orphan_pages(graph: LinkGraph) -> list[str]:
    """
    Find pages with no incoming links.

    Args:
        graph: The link graph

    Returns:
        List of orphan page paths
    """
    orphans = []
    for path, node in graph.pages.items():
        if len(node.incoming_links) == 0:
            orphans.append(path)
    return orphans


def find_anchor_opportunities(content: str, target_keywords: list[str]) -> list[dict]:
    """
    Find natural anchor text opportunities in content.

    Args:
        content: The source content
        target_keywords: Keywords to look for

    Returns:
        List of anchor opportunities
    """
    opportunities = []

    for keyword in target_keywords:
        # Case-insensitive search
        lower_content = content.lower()
        lower_keyword = keyword.lower()

        if lower_keyword in lower_content:
            # Find the actual case-preserved match
            import re
            pattern = re.compile(re.escape(keyword), re.IGNORECASE)
            matches = pattern.finditer(content)

            for match in matches:
                opportunities.append({
                    "keyword": match.group(),
                    "position": match.start(),
                    "context": content[max(0, match.start()-50):min(len(content), match.end()+50)]
                })

    return opportunities


def suggest_links(
    source_node: PageNode,
    all_nodes: dict[str, PageNode],
    content: str
) -> list[LinkSuggestion]:
    """
    Generate link suggestions for a page.

    Args:
        source_node: The source page
        all_nodes: All pages in the graph
        content: Source page content

    Returns:
        List of link suggestions
    """
    suggestions = []

    for target_path, target_node in all_nodes.items():
        # Skip self and already linked pages
        if target_path == source_node.path:
            continue
        if target_path in source_node.outgoing_links:
            continue

        # Calculate relevance
        relevance = 0.0
        reasons = []

        # Same category bonus
        if source_node.category == target_node.category and source_node.category:
            relevance += 0.3
            reasons.append("Same category")

        # Tag overlap
        common_tags = set(source_node.tags) & set(target_node.tags)
        if common_tags:
            relevance += 0.2 * len(common_tags)
            reasons.append(f"Shared tags: {', '.join(list(common_tags)[:3])}")

        # Hub pages should link to related content
        if source_node.page_type == "hub":
            relevance += 0.2
            reasons.append("Hub to content link")

        # Guide pages should reference
        if source_node.page_type == "guide" and target_node.page_type == "content":
            relevance += 0.15
            reasons.append("Guide references content")

        if relevance >= 0.3:
            # Find anchor text opportunity
            keywords = [target_node.title] + target_node.tags[:2]
            anchors = find_anchor_opportunities(content, keywords)

            anchor_text = target_node.title  # Default
            context = "Add link in related section"

            if anchors:
                anchor_text = anchors[0]["keyword"]
                context = anchors[0]["context"]

            suggestions.append(LinkSuggestion(
                source_path=source_node.path,
                target_path=target_path,
                anchor_text=anchor_text,
                reason="; ".join(reasons),
                relevance_score=relevance,
                context=context
            ))

    # Sort by relevance
    suggestions.sort(key=lambda x: x.relevance_score, reverse=True)
    return suggestions[:5]  # Top 5 suggestions


def generate_hub_spoke_structure(graph: LinkGraph) -> dict:
    """
    Analyze and suggest Hub-and-Spoke link structure.

    Args:
        graph: The link graph

    Returns:
        Hub-spoke analysis and recommendations
    """
    hubs = {}
    spokes = defaultdict(list)

    for path, node in graph.pages.items():
        if node.page_type == "hub":
            hubs[path] = {
                "title": node.title,
                "outgoing": len(node.outgoing_links),
                "target": PAGE_TYPES["hub"]["target_outgoing"]
            }

            # Find related spokes
            for target in node.outgoing_links:
                if target in graph.pages:
                    spokes[path].append(target)

    return {
        "hubs": hubs,
        "spokes": dict(spokes),
        "recommendations": _generate_hub_recommendations(hubs, graph)
    }


def _generate_hub_recommendations(hubs: dict, graph: LinkGraph) -> list[str]:
    """Generate recommendations for improving hub structure."""
    recommendations = []

    for hub_path, hub_info in hubs.items():
        if hub_info["outgoing"] < hub_info["target"]:
            recommendations.append(
                f"Hub '{hub_info['title']}' needs {hub_info['target'] - hub_info['outgoing']} more outgoing links"
            )

    return recommendations


# Usage documentation for Claude
USAGE_EXAMPLE = """
## How Claude Should Use This Module

When user triggers "build internal links" or "构建内链":

### Step 1: Build Link Graph

1. Read all content files (blog posts, topic hubs, guides)
2. Extract existing internal links from each
3. Build the graph structure

```python
# Pseudo-code for Claude to follow:
for each content file:
    - Extract outgoing links (markdown links to /blog/, /topics/, etc.)
    - Record page metadata (category, tags, title)
    - Classify page type
```

### Step 2: Analyze Structure

- Calculate orphan pages
- Calculate average links per page
- Identify hub pages
- Calculate authority scores

### Step 3: Generate Report

```markdown
## Internal Link Analysis Report

### Site Link Graph Summary
| Metric | Value |
|--------|-------|
| Total pages | 45 |
| Average incoming links | 2.3 |
| Average outgoing links | 3.1 |
| Orphan pages | 5 |
| Hub pages | 4 |

### Hub-and-Spoke Analysis

#### Topic Hubs
| Hub | Outgoing Links | Target | Status |
|-----|----------------|--------|--------|
| /topics/ai-development-guide | 8 | 10 | Needs 2 more |
| /topics/seo-fundamentals | 6 | 10 | Needs 4 more |

#### Spoke Distribution
- ai-development-guide: 8 connected posts
- seo-fundamentals: 6 connected posts

### Orphan Pages (No Incoming Links)
These pages need internal links pointing to them:

1. `/blog/old-post-about-react`
   - Suggested source: /topics/nextjs-mastery
   - Anchor text: "React fundamentals"

2. `/blog/typescript-tips`
   - Suggested source: /blog/nextjs-best-practices
   - Anchor text: "TypeScript configuration"

### Link Insertion Recommendations

#### High Priority
| Source | Anchor Text | Target | Reason |
|--------|-------------|--------|--------|
| /blog/nextjs-guide | "AI tools" | /topics/ai-tools-for-developers | Shared tags: AI Tools, Development |
| /topics/seo-fundamentals | "technical SEO" | /blog/seo-audit-guide | Hub to content |

#### Medium Priority
| Source | Anchor Text | Target | Reason |
|--------|-------------|--------|--------|
| /blog/react-hooks | "performance tips" | /blog/react-performance | Same category |

### Auto-Insert Preview

For `/blog/nextjs-guide`, line 45:
```markdown
// Current:
When building with Next.js, you should consider AI tools for productivity.

// Suggested:
When building with Next.js, you should consider [AI tools](/topics/ai-tools-for-developers) for productivity.
```

---

### Actions Available
1. `apply link suggestions` - Insert all high-priority links
2. `preview [source-path]` - See detailed preview for a specific page
3. `skip` - Don't make any changes
```

### Step 4: Apply Changes (If Confirmed)

Use Edit tool to insert links at suggested locations.
Verify links are properly formatted markdown.
"""

---
name: ai-trend-radar
description: "Finds the latest AI, AI-tool, and technology topics from the live web with strong recency signals. Use when the task is '找最新AI热点', '抓取AI工具趋势', 'collect fresh AI topics', 'what is trending in AI this week', or any request that depends on up-to-date AI/tech news."
---

# AI Trend Radar

## Overview

Use this skill when the user needs a fresh, time-sensitive shortlist of AI, AI tool, or technology topics worth writing about.

The goal is not generic research. The goal is to surface topics that are both recent and blog-worthy.

## When To Use

Use this skill when the user wants:

- The newest AI or AI-tool topics
- Fresh product launches, releases, benchmarks, or model updates
- Timely AI developer-tool stories
- A shortlist of topics to feed into `$viral-topic-analyst`

Do not use this skill for evergreen explainers or static background research.

## Workflow

1. Search the live web. Do not rely on memory for recency-sensitive claims.
2. Default to a 7-day window. Expand to 14 days only if the signal set is thin.
3. Cover four buckets:
   - Frontier model releases and capabilities
   - AI tools and developer products
   - Benchmarks, studies, or measurable shifts
   - Important policy, platform, or ecosystem moves
4. Prioritize source quality using `references/source-priority.md`.
5. Deduplicate overlapping stories. If five articles report the same release, keep one topic.
6. Filter out rumors, vague opinion pieces, and recycled commentary without a new event.
7. Rank topics by timeliness, novelty, practical utility, and discussion potential.

## Search Rules

- Prefer official announcements, product pages, release notes, papers, and first-party docs.
- Use media coverage only to enrich context, not as the sole proof of a topic.
- If social posts are used, treat them as secondary signal only.
- Always capture dates and links.
- Be explicit when a conclusion is an inference rather than a direct fact.

## Output Format

Return a compact shortlist in this structure:

```markdown
## TREND_SHORTLIST

| Rank | Topic | Why Now | Audience | Freshness | Utility | Discussion Potential | Sources |
|------|-------|---------|----------|-----------|---------|----------------------|---------|

### Notes
- Mention duplicates merged into one topic.
- Mention any topics rejected for weak evidence or weak timeliness.
```

## Quality Bar

- Aim for 8 to 12 topics.
- Every topic must have at least 2 credible links when possible.
- At least half the list should be younger than 7 days unless the user asks otherwise.
- The shortlist should be ready to hand off directly to `$viral-topic-analyst`.

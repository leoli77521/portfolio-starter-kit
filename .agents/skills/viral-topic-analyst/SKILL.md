---
name: viral-topic-analyst
description: "Scores a fresh AI or tech topic shortlist and picks the angle most likely to break out. Use when the task is '分析热门话题', '挑最容易出爆款的话题', 'rank fresh AI topics', or when a shortlist from $ai-trend-radar needs a single winning angle."
---

# Viral Topic Analyst

## Overview

Use this skill after a fresh topic shortlist exists. It decides which topic has the best chance to become a breakout post.

This is a selection skill, not a writing skill.

## Expected Input

Best input: a `TREND_SHORTLIST` block from `$ai-trend-radar`.

If the user gives raw notes instead, normalize them into comparable candidate topics first.

## Workflow

1. Merge duplicates and restate each topic as a clean candidate angle.
2. Score each candidate using `references/scoring-rubric.md`.
3. Eliminate weak candidates:
   - Old news without a new hook
   - Pure rumor
   - Topics with no practical audience
   - Topics too narrow to support a full article
4. Pick one winner and explain why it wins now, not in theory.
5. Prepare a handoff packet for `$viral-blog-writer`.

## Selection Principles

- Favor topics with both novelty and practical consequence.
- Prefer angles that create a strong "I need to understand this now" reaction.
- Prefer topics that support a clear promise to the reader.
- Break ties using breadth of audience plus evidence density.

## Output Format

Return this structure:

```markdown
## WINNING_TOPIC

- Topic:
- Core angle:
- Why it can break out now:
- Target reader:
- Emotional hook:
- Practical payoff:
- Content moat:

## TITLE_DIRECTIONS
1. ...
2. ...
3. ...

## WRITING_BRIEF
- Thesis:
- Recommended format:
- Sections to cover:
- Evidence to include:
- Pitfalls to avoid:
```

## Quality Bar

- Choose one winner, not three.
- Make the reasoning concrete and comparative.
- Give the next skill enough detail to write without re-guessing the angle.

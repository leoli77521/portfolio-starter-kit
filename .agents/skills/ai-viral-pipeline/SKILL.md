---
name: ai-viral-pipeline
description: "Coordinates $ai-trend-radar, $viral-topic-analyst, $viral-blog-writer, and $blog-illustration-director to go from fresh AI trends to a finished breakout article with visuals. Use when the task is '一键跑完整流程', '从热点到成文和配图', 'build the whole AI viral blog pipeline', or when the user wants trend discovery, topic selection, writing, and blog visuals handled as one chain."
---

# AI Viral Pipeline

## Overview

Use this skill when the user wants the full workflow, not a single step.

This skill orchestrates:

1. `$ai-trend-radar`
2. `$viral-topic-analyst`
3. `$viral-blog-writer`
4. `$blog-illustration-director`

## Default Behavior

- Topic scope: AI, AI tools, AI developer tooling, and adjacent technology shifts
- Freshness target: last 7 days by default
- Output language: follow the target audience, default to English for Western-facing blogs
- Writing style: Western tech editorial with strong hooks, short paragraphs, and clear thesis

## Workflow

### Step 1: Collect fresh topics

Invoke the logic from `$ai-trend-radar` to build a `TREND_SHORTLIST`.

Requirements:

- Use live web sources
- Favor official and first-party links
- Deduplicate overlapping stories
- Keep only topics that are recent enough to matter now

### Step 2: Pick the breakout topic

Pass the shortlist into `$viral-topic-analyst`.

Requirements:

- Choose one winner
- Explain why it wins now
- Produce a `WRITING_BRIEF`

### Step 3: Write the article

Pass the winning brief into `$viral-blog-writer`.

Requirements:

- Keep the article current
- Keep the structure skimmable
- Make the reader payoff obvious

### Step 4: Build the visual plan

Pass the article into `$blog-illustration-director`.

Requirements:

- Create one cohesive visual direction
- Include hero and section visuals
- Add alt text and placement notes
- Prefer credible editorial art over generic AI imagery

## Skip Logic

- If the user already gives a vetted shortlist, skip Step 1.
- If the user already gives a winning topic and thesis, skip Steps 1 and 2.
- If the user already gives a finished article, skip to Step 4.
- If the user only wants topic selection, stop after Step 2.

## Output Contract

Return the chain in this order:

```markdown
## TREND_SHORTLIST
...

## WINNING_TOPIC
...

## TITLE_OPTIONS
...

## META_DESCRIPTION
...

## ARTICLE
...

## VISUAL_PLAN
...

## SOURCES
...
```

## Quality Bar

- The handoff between steps should be explicit.
- Do not let the writer step silently change the chosen angle.
- Do not let the visuals step drift away from the article thesis.
- If the source base is weak, say so before drafting.
- If the topic is too old, pick a fresher one instead of forcing the workflow.

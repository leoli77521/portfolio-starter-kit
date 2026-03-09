---
name: ai-viral-pipeline
description: "Coordinates $ai-trend-radar, $viral-topic-analyst, $viral-blog-writer, $blog-illustration-director, and $blog-publish-packager to go from fresh AI trends to a finished breakout article, visuals, and repo-ready publish file. Use when the task is '一键跑完整流程', '从热点到成文配图再到发布文件', 'build the whole AI viral blog pipeline', or when the user wants trend discovery, topic selection, writing, visuals, and packaging handled as one chain."
---

# AI Viral Pipeline

## Overview

Use this skill when the user wants the full workflow, not a single step.

This skill orchestrates:

1. `$ai-trend-radar`
2. `$viral-topic-analyst`
3. `$viral-blog-writer`
4. `$blog-illustration-director`
5. `$blog-publish-packager`

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

### Step 5: Package for publish

Pass the article and visual plan into `$blog-publish-packager`.

Requirements:

- Generate repo-ready frontmatter
- Choose a stable filename and slug
- Produce a clean MDX package
- Use repo-safe image handling

## Skip Logic

- If the user already gives a vetted shortlist, skip Step 1.
- If the user already gives a winning topic and thesis, skip Steps 1 and 2.
- If the user already gives a finished article, skip to Step 4.
- If the user already has article and visuals, skip to Step 5.
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

## PUBLISH_PACKAGE
...

## SOURCES
...
```

## Quality Bar

- The handoff between steps should be explicit.
- Do not let the writer step silently change the chosen angle.
- Do not let the visuals step drift away from the article thesis.
- Do not let the packaging step rewrite the article's core claim.
- If the source base is weak, say so before drafting.
- If the topic is too old, pick a fresher one instead of forcing the workflow.

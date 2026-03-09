---
name: viral-blog-writer
description: "Turns a chosen AI or tech breakout angle into a Western-style viral blog post. Use when the task is '写爆款博客', '按欧美爆款文章风格写', 'write a viral AI article', or when a brief from $viral-topic-analyst needs to become a full article."
---

# Viral Blog Writer

## Overview

Use this skill to turn one winning AI or tech topic into a high-conviction blog post with a Western viral structure.

Default writing language: follow the target audience. Use English by default for Western-facing blogs.

Default style: Western tech editorial pacing with punchy subheads, strong thesis, short paragraphs, and evidence-backed claims.

## Expected Input

Best input: a `WINNING_TOPIC` and `WRITING_BRIEF` packet from `$viral-topic-analyst`.

If the brief is incomplete, quickly fill the gaps before drafting.

## Workflow

1. Restate the core thesis in one sentence.
2. Recheck the key facts against current sources if the topic is time-sensitive.
3. Build the draft using `references/viral-structure.md`.
4. Write with urgency, but never fake certainty.
5. Keep the article specific:
   - concrete examples
   - named tools or companies
   - direct implications for the reader
6. End with a clean takeaway or action-oriented close.
7. Preserve enough section clarity that `$blog-illustration-director` can map visuals onto the draft without guessing.

## Writing Rules

- Start with a sharp hook, not background filler.
- Keep paragraphs short and skimmable.
- Use subheads that create forward motion.
- Prefer crisp claims over vague hype.
- Explain why the news matters, not just what happened.
- Keep English product names intact.
- When quoting numbers or release details, preserve source accuracy.

## Default Article Output

Return this structure:

```markdown
## TITLE_OPTIONS
1. ...
2. ...
3. ...

## META_DESCRIPTION
...

## ARTICLE
# Headline

Intro hook

## Section 1
...

## Section 2
...

## Section 3
...

## Why This Matters
...

## Final Take
...

## SOURCES
- [Source title](URL)
```

## Quality Bar

- The piece should feel assertive, current, and readable.
- Do not sound like generic AI-generated content.
- Do not pad with history unless it sharpens the contrast.
- If a claim is uncertain, qualify it plainly.

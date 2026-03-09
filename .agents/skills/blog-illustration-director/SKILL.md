---
name: blog-illustration-director
description: "Turns a draft, outline, or finished blog post into a publish-ready illustration plan. Use when the task is '配图', '插图', 'hero image', 'section visuals', 'image prompts', 'visual brief', or when a post from $viral-blog-writer needs article art, diagram ideas, stock-photo searches, alt text, and placement guidance."
---

# Blog Illustration Director

## Overview

Use this skill after the article angle is clear.

It converts a blog draft or brief into a cohesive visual system for Western tech readers: hero image direction, section illustration prompts, diagram ideas, stock-photo fallbacks, alt text, captions, and insertion guidance.

## Best Input

Best case:

- final article draft
- title options
- target audience
- brand or site tone
- whether visuals should be AI-generated, stock-first, or diagram-first

Acceptable fallback:

- a `WINNING_TOPIC` and `WRITING_BRIEF` packet from `$viral-topic-analyst`
- a rough article outline from `$viral-blog-writer`

## Workflow

1. Identify the article promise:
   - what emotion should the lead visual create
   - what tension or contrast drives the story
   - which claims are concrete enough to visualize directly
2. Choose one primary visual lane. If needed, read [references/visual-style-playbook.md](references/visual-style-playbook.md) and pick the closest lane instead of mixing styles.
3. Build a compact visual system:
   - hero image concept
   - 2-4 section visuals
   - 1 optional diagram or infographic
   - stock or editorial fallback searches
4. Make the art usable in production:
   - add aspect ratios
   - add placement suggestions
   - write descriptive alt text
   - write short captions
   - provide clear filenames
5. Keep the visuals credible:
   - do not invent fake product screenshots
   - do not imply events or UI states that were not reported
   - when the claim is sensitive, use conceptual or diagrammatic visuals instead of fabricated scenes

## Visual Rules

- Prefer editorial, conceptual, or diagrammatic visuals over generic AI art.
- Avoid cliches like glowing robot faces, floating holograms, neon brains, or random code rain unless the user explicitly wants that style.
- Match Western tech readership:
  - strong concept
  - restrained palette
  - readable composition
  - enough negative space for social crops and headline overlays
- Keep brand names and logos out of generated prompts unless the user asks for brand-specific assets.
- If the article is news-driven, the hero image should amplify the thesis, not repeat the headline literally.

## Output Contract

Return the visual brief in this order:

```markdown
## VISUAL_DIRECTION
- Core mood
- Style lane
- Palette
- Composition rules
- Avoid list

## HERO_IMAGE
- Purpose
- Aspect ratios
- AI image prompt
- Optional stock-photo search terms
- Alt text
- Caption

## SECTION_VISUALS
### Section 1
- Placement
- Prompt
- Alt text
- Caption

## DIAGRAM_OR_INFOGRAPHIC
- Whether it is needed
- What it should explain
- Suggested format

## ASSET_CHECKLIST
- filenames
- crops
- export notes
- any dependencies or approvals
```

## Quality Bar

- The visual plan should feel intentional, not like filler art.
- Prompts should be specific enough to hand to Midjourney, DALL-E, Flux, or an in-house designer.
- The image system should support the article's thesis and pacing.
- If the article already has too many images, say so and recommend fewer, stronger assets.

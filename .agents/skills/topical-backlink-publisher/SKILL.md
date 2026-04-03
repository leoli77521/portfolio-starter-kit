---
name: topical-backlink-publisher
description: "Plans and publishes topic-matched backlinks for ToLearn Blog by matching external pages to the closest site page or article, drafting natural human-sounding comments, and keeping the workflow extensible for new backlink types. Use when Codex is asked to '自动发相关外链', 'publish topical backlinks', '围绕文章主题发外链', or extend this repo's backlink automation."
---

# Topical Backlink Publisher

Use this skill when the goal is not just to place backlinks, but to place relevant backlinks that fit both:

- the external page being commented on or submitted to
- the exact ToLearn page being linked

This skill is project-specific. It is built for `https://tolearn.blog` and sits on top of:

- `$backlink-no-signup-filter` for screening raw opportunities
- `$backlink-auto-publisher` for queue building and browser submission

When working inside this repo, default to:

- `assets/tolearn-backlink-campaign-profile.json`
- `assets/backlink-type-registry.json`
- `../backlink-no-signup-filter/assets/tolearn-project-profile.json`
- `../backlink-auto-publisher/assets/tolearn-site-profile.json`
- `../backlink-auto-publisher/assets/tolearn-approved-targets.json`

Read `references/voice-and-relevance.md` before drafting any public comment.
Read `references/backlink-type-extension.md` only when adding a new backlink type or submission surface.

## Quick Workflow

1. Build a campaign brief from a post or topic:

```bash
py scripts/build_campaign_brief.py --post app/blog/posts/<post>.mdx --output <brief.json> --report <brief.md>
```

If there is no existing post yet, use manual inputs:

```bash
py scripts/build_campaign_brief.py --title "..." --summary "..." --tags "AI Agents,MCP,Rust" --destination-url "https://tolearn.blog/topics/ai-coding-agent-stack" --output <brief.json>
```

2. If the backlink list is raw or noisy, screen it first with `$backlink-no-signup-filter`.

3. Shortlist only targets that overlap with the campaign topic:

```bash
py scripts/shortlist_targets.py --campaign <brief.json> --targets ../backlink-auto-publisher/assets/tolearn-approved-targets.json --output <shortlist.json> --report <shortlist.md>
```

4. Use `$backlink-auto-publisher` on the shortlisted targets. Keep the campaign destination when the article-specific URL is a stronger fit than a generic hub.

5. Draft comments using `references/voice-and-relevance.md`:
   - reference one concrete point from the target page
   - add one short extension, reaction, or practitioner observation
   - keep the backlink in the website field unless the platform truly requires inline context

6. Submit only when the public flow is still valid:
   - no signup
   - no login wall
   - no captcha
   - no broken or mismatched form fields

7. Save queue, shortlist, and submission result reports so later runs can learn from them.

## Hard Rules

- Relevance beats volume.
- Prefer article URLs when the target clearly matches one article.
- Use a topic hub or guide when the target is broader than one post.
- Use the homepage only as a fallback.
- Do not publish if the best possible comment would still feel generic.
- Do not reuse the same comment skeleton across a batch.
- Keep brand mention secondary to the useful observation.
- Do not automate around anti-bot barriers.

## Writing Rules

- Comments should usually be 2 to 5 sentences.
- Avoid robotic openers like "Great post" or "Very informative article" unless they are followed immediately by something specific.
- Do not stuff keywords or exact-match anchors.
- Prefer sounding like a real builder, operator, or reader who noticed one practical point.
- If a page-topic match is only medium or weak, skip it instead of forcing a backlink.

## Extending This Skill

Add future backlink types in `assets/backlink-type-registry.json`.

For each new type:

- give it a stable `id`
- map `input_source_types`
- define `automation_level`
- define `required_fields`
- set a realistic `fit_threshold`
- write one short note about when it is safe to use

If a new type needs deterministic prep, add a script under `scripts/` and mention it here in one short line. Keep the automation limited to public, reviewable, no-signup flows.

## Output

Return a compact report in this shape:

```markdown
## CAMPAIGN
- Destination URL: ...
- Topic: ...
- Active backlink types: ...

## SHORTLIST
| Domain | Status | Score | Destination | Note |
|--------|--------|-------|-------------|------|

## SUBMISSION_RESULTS
| Domain | Target URL | Status | Destination URL | Note |
|--------|------------|--------|-----------------|------|
```

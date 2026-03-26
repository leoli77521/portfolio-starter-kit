---
name: backlink-auto-publisher
description: "Prepares and submits approved backlinks to public comment or submission forms using saved site profile and target configs. Use when Codex is asked to '自动发布外链', 'publish approved backlinks', 'submit no-signup backlink forms', or fill comment forms for a vetted project-fit backlink list."
---

# Backlink Auto Publisher

Use this skill to turn an approved no-signup backlink list into a submission queue and, when requested, execute the submissions with Playwright.

When working inside this repo, default to `assets/tolearn-site-profile.json` and `assets/tolearn-approved-targets.json`.

Prefer smart landing-page routing over a single default destination. Match the target page topic to the closest stable guide, topic hub, or templates index whenever possible.

## Required Inputs

- a site profile with public author name, public email, default website, and link destinations
- a target list that was already screened and live-verified as `verified_no_signup`

If the user has not supplied better public-facing details yet, use the defaults in `assets/tolearn-site-profile.json` and tell the user what can be refined later.

## Workflow

1. Validate the site profile and approved targets:

```bash
py scripts/build_submission_queue.py --site-profile assets/tolearn-site-profile.json --targets assets/tolearn-approved-targets.json --output <queue.json> --report <queue.md>
```

2. Use the generated queue to identify which targets are `ready` and which need manual review.
   The queue should include the chosen destination plus the routing rule or fallback that selected it.
3. For each `ready` item, use Playwright to:
   - open the target URL
   - confirm the form still has no login wall and no captcha
   - fill `Comment`, `Name`, `Email`, and `Website` using the queue payload
   - submit only if the page state still matches the verified assumptions
4. Write the comment using `references/comment-style-guide.md`.
5. Stop and skip the item if you encounter:
   - registration or login requirements
   - captcha
   - closed comments
   - form fields that no longer match the approved config
6. Record the result for every target:
   - `submitted`
   - `manual_review`
   - `login_required`
   - `captcha`
   - `closed`
   - `error`

## Submission Rules

- Keep comments topical and page-specific.
- Default to 2 to 5 sentences.
- Use the website field for the link when it exists; avoid dropping naked URLs into the comment body unless the platform truly requires it.
- Avoid exact-match anchor spam.
- If the page topic is only medium fit, skip it instead of forcing a backlink.
- Do not automate around anti-bot barriers.

## Output

Return a compact report in this structure:

```markdown
## SUBMISSION_SUMMARY
- Queue file: ...
- Ready: ...
- Submitted: ...
- Skipped: ...

## RESULTS
| Domain | Target URL | Status | Destination URL | Note |
|--------|------------|--------|-----------------|------|
```

## Notes

- This skill assumes the list was already filtered by `$backlink-no-signup-filter` or an equivalent manual review.
- If the user later gives a preferred public author alias, landing pages, or topic-specific pitches, update the site profile and rerun the queue generator.

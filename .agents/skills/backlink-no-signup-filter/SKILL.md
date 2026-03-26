---
name: backlink-no-signup-filter
description: "Screens backlink opportunity lists and keeps only project-fit targets that appear to accept public submissions without signup. Use when Codex receives an Excel/CSV/JSON backlink export, competitor backlink sheet, or requests like '筛选免注册外链', 'filter no-signup backlinks', 'screen backlink targets', or '哪些外链不用注册'."
---

# Backlink No Signup Filter

Use this skill to turn a noisy backlink export into a short, defensible list of no-signup targets.

When working inside this repo, default to `assets/tolearn-project-profile.json` unless the user gives a different project profile.

## Workflow

1. Load the backlink source file. Support `.xlsx`, `.csv`, and `.json`.
2. Run:

```bash
py scripts/filter_backlinks.py --input <source-file> --project-profile assets/tolearn-project-profile.json --output <screened-output.json>
```

3. Review the output buckets:
   - `preapproved`: strong no-signup signal and strong project fit, but still needs live verification.
   - `watchlist`: maybe useful, but missing topical confidence or submission confidence.
   - `reject`: poor fit, profile/forum junk, missing website field, captcha, or obvious spam risk.
4. Live-verify every target you plan to keep with web or Playwright before calling it approved. Approval requires:
   - the page is reachable now
   - no login or signup wall appears in the visible submission flow
   - no captcha appears in the visible submission flow
   - the page exposes a public comment or submission form with a usable website field, or an equivalent public link field
5. Keep a short evidence note with the verification date and the reason the target fits the project.
6. Prefer topical alignment over raw volume. For this repo, a tiny list of AI, SEO, web, and design opportunities is more valuable than hundreds of random lifestyle comments.

## Repo Defaults

- Treat `https://tolearn.blog` as the primary destination.
- Prioritize pages about AI systems, machine learning, SEO, search, developer workflow, web design, frontend execution, typography, and portfolio-building.
- Use `references/project-fit-rubric.md` for fit scoring and rejection patterns.

## Output

Return a compact result in this structure:

```markdown
## SCREENING_SUMMARY
- Source file: ...
- Total rows: ...
- Preapproved: ...
- Watchlist: ...
- Reject: ...

## PREAPPROVED
| Domain | Target URL | Why it fits | No-signup signal | Live verification needed |
|--------|------------|-------------|------------------|--------------------------|

## WATCHLIST
| Domain | Target URL | Blocking question |
|--------|------------|-------------------|

## REJECT
| Domain | Target URL | Reason |
|--------|------------|--------|
```

## Notes

- Do not keep profile pages, bug trackers, forum profiles, or unrelated lifestyle blogs just because they expose a URL field.
- Do not treat the source sheet as truth. It is only a lead source; current site behavior must be rechecked.
- If the user provides a new project or different topical focus, update the project profile before trusting the scores.

# Backlink Type Extension

Use this file only when you need to add a new backlink surface.

## Registry Fields

Every new entry in `assets/backlink-type-registry.json` should include:

- `id`: stable lowercase identifier
- `status`: `active`, `planned`, or `deprecated`
- `automation_level`: `full`, `semi-auto`, or `manual`
- `input_source_types`: source-sheet or target-list type names that map to this type
- `input_submission_modes`: expected submission channel names
- `required_fields`: minimum fields needed to submit
- `fit_threshold`: minimum topical score for inclusion
- `notes`: one short sentence about safe usage

## Good Future Types

- `resource-page`
- `tool-directory`
- `newsletter-roundup`
- `guest-post-pitch`

## Unsafe Types To Avoid

- profile pages
- forum signatures
- anything requiring account creation
- anything with captcha or anti-bot friction
- unrelated lifestyle comment sections

## Extension Steps

1. Add the new type to `assets/backlink-type-registry.json`.
2. If the raw backlink export uses a new source label, include it in `input_source_types`.
3. If deterministic prep is needed, add a script in `scripts/`.
4. Update `SKILL.md` only if the default workflow changes.
5. Test the type with one dry run before using it in a larger batch.

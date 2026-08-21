# SEO review cadence

The repository now has deterministic policies for English canonicals, stale translations, utility pages, legacy redirects, and curated AI entry points. Use the cadence below after each production deploy.

## 7-day check: crawl and redirect health

- Export the current GSC “Page indexing” rows and save them locally as a JSON file with a `urls` array.
- Run `pnpm audit:indexing ./path/to/gsc-indexing-urls.json`.
- Confirm every redirect candidate resolves directly to its final canonical with HTTP 308.
- Confirm `/sitemap.xml`, `/sitemap/zh.xml`, `/sitemap/de.xml`, `/sitemap/fr.xml`, `/sitemap/th.xml`, and `/sitemap/pt.xml` return 200 XML.
- Confirm stale translations are absent from language sitemaps and hreflang alternates.
- Run `pnpm audit:i18n:strict` and `pnpm audit:i18n:quality`; the latter keeps native-speaker review explicitly open even when automated checks pass.

The repository also keeps a machine-readable monitoring store in `data/seo-monitoring.json`.
Import one authenticated GSC/AI-search snapshot with:

```bash
pnpm metrics:record -- --input=.local/seo-metrics-snapshot.json
pnpm metrics:audit
```

For a direct GSC API pull, provide a read-only service account that has access to the property:

```bash
GSC_SERVICE_ACCOUNT_FILE=/secure/path/gsc-service-account.json \
  pnpm metrics:fetch -- --record
```

The collector queries the Search Analytics API for 7/14/28-day clicks, impressions, CTR, and
position. When API credentials are unavailable, the same fields can be recorded from the
authenticated GSC UI; AI-search impressions and Page indexing totals were captured that way in the
2026-08-21 snapshot. The standard Search Analytics endpoint does not provide the AI-search report
totals.

The internal dashboard is available at `/seo-dashboard`. It shows 7/14/28-day clicks,
impressions, CTR, AI-search visibility, index coverage, conversions, and the active experiment.
Null values are intentional until the corresponding export is connected; do not replace them with
zeroes. The original supplied baseline was 955 AI-search impressions over roughly three months,
including 795 for the benchmark page. The authenticated GSC UI snapshot now records 7/14/28-day
AI-search impressions of 49/120/310, with 41/103/253 for the benchmark page.

## 14-day check: query and content signals

In GSC, compare the previous 14 days with the preceding 14 days for the three directory pages and their linked pillar articles:

- impressions and clicks;
- average position and CTR;
- indexed versus discovered URL count;
- queries that map to the wrong directory;
- clicks into `/ai-models`, `/ai-tools`, and `/ai-coding-agents`.

Change one page variable at a time: title, first answer paragraph, comparison table, or internal-link block. Record the change date in the article frontmatter before reading the result.

## 28-day check: decision review

- Keep a page’s canonical role if its queries, links, and click path match the intended directory.
- Strengthen a page if it has impressions but weak CTR or weak engagement.
- Merge or redirect only when two pages satisfy the same intent and one has no distinct evidence.
- Keep a page `noindex` when it is a utility route, narrow archive, stale translation, or an unresolved GSC candidate.
- Re-run `pnpm test`, `pnpm audit:i18n`, and the AI SEO audit before submitting the next sitemap refresh.

## External actions still required

After deployment, use an authenticated GSC session for the remaining external checks:

1. Submit `https://tolearn.blog/sitemap.xml` and the five language sitemaps in GSC.
2. Inspect the final destinations for the exported redirect rows and request validation.
3. Monitor the 106 “Crawled — currently not indexed” URLs; the repository decision register now resolves all 21 former review URLs.
4. Check AI-search visibility and citation mentions separately; GSC does not expose a complete generative-AI click report.
5. Record conversion events for directory clicks, newsletter signups, and guide starts alongside CTR.

As of 2026-08-21, the 16 redirect-error URLs are in GSC validation with 16 pending and 0 failed;
do not restart validation unless the current run fails. All six submitted sitemaps were also
reported as Success on 2026-08-21, with 158 URLs discovered in the main sitemap and 46 in each
language sitemap.

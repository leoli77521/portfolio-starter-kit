import Link from 'next/link'
import type { Metadata } from 'next'
import { getTagDescription } from 'app/lib/tag-descriptions'
import { getBlogPosts } from 'app/blog/utils'
import {
  MIN_POSTS_FOR_INDEXED_TAG_PAGE,
  getTagCounts,
  toTagSlug,
} from 'app/lib/tags'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'Tags',
  description:
    'Browse the ToLearn archive by tag to find recurring themes, tools, and technical patterns.',
  alternates: {
    canonical: `${baseUrl}/tags`,
  },
}

export default function TagsPage() {
  const allPosts = getBlogPosts()
  const tagCounts = getTagCounts()

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])
  const indexedTags = sortedTags.filter(([, count]) => count >= MIN_POSTS_FOR_INDEXED_TAG_PAGE)
  const longTailTags = sortedTags.filter(([, count]) => count < MIN_POSTS_FOR_INDEXED_TAG_PAGE)
  const featuredTags = indexedTags.slice(0, 6)
  const remainingIndexedTags = indexedTags.slice(6)

  return (
    <section className="space-y-8">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">Recurring themes</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Tags show the conversation threads running through the archive
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              Use tags when you want a narrower slice than categories. They surface specific
              tools, workflows, and concepts that repeat across essays and tutorials.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {indexedTags.length}
              </span>
              <span>indexed tag clusters</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {allPosts.length}
              </span>
              <span>total published posts</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {longTailTags.length}
              </span>
              <span>single-post reference tags</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Featured tags</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Start with the strongest clusters
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              These tags appear on at least {MIN_POSTS_FOR_INDEXED_TAG_PAGE} posts, so they form a
              stronger archive cluster and stay in the indexed discovery layer.
            </p>
          </div>
          <Link href="/blog" className="editorial-link">
            Open the full journal
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredTags.map(([tag, count]) => {
            const details = getTagDescription(tag)

            return (
              <Link
                key={tag}
                href={`/tags/${toTagSlug(tag)}`}
                className="surface-card group block px-6 py-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-kicker">Tag</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                      {tag}
                    </h3>
                  </div>
                  <span className="meta-chip normal-case tracking-normal">{count} posts</span>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  {details?.description || `Browse everything tagged with ${tag}.`}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {details?.relatedCategory ? (
                    <span className="meta-chip normal-case tracking-normal">
                      {details.relatedCategory}
                    </span>
                  ) : null}
                  {(details?.relatedTags || []).slice(0, 3).map((relatedTag) => (
                    <span key={relatedTag} className="meta-chip normal-case tracking-normal">
                      {relatedTag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 editorial-link">
                  Open tag archive
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Indexed tags</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Additional multi-post clusters
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Tags below the featured set still stay searchable when they connect more than one article.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {remainingIndexedTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${toTagSlug(tag)}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
            >
              <span>{tag}</span>
              <span className="meta-chip normal-case tracking-normal">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Reference tags</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Long-tail labels stay browsable
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Single-post tags are still useful for readers, but they are treated as reference labels rather than primary indexed archives.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {longTailTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${toTagSlug(tag)}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
            >
              <span>{tag}</span>
              <span className="meta-chip normal-case tracking-normal">{count}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


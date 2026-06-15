import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { AiDirectoryPage } from 'app/components/ai-directory-page'
import { getAiDirectory } from 'app/lib/ai-directories'
import { baseUrl } from 'app/sitemap'

const config = getAiDirectory('ai-tools')

export const metadata: Metadata = config
  ? {
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      alternates: {
        canonical: `${baseUrl}${config.canonicalPath}`,
      },
      openGraph: {
        title: `${config.title} | ToLearn Blog`,
        description: config.description,
        url: `${baseUrl}${config.canonicalPath}`,
        type: 'website',
      },
    }
  : {}

export default function AiToolsPage() {
  if (!config) {
    notFound()
  }

  return <AiDirectoryPage config={config} />
}

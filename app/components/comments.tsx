'use client'

import Giscus from '@giscus/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

type Repo = `${string}/${string}`

function isRepo(value: string): value is Repo {
  return value.includes('/')
}

export default function Comments() {
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="min-h-[300px]" /> // Placeholder
  }

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  if (!repo || !repoId || !isRepo(repo)) {
    return <div className="min-h-[300px]" /> // Placeholder
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const hasCategory = Boolean(category && categoryId)

  return (
    <div className="mt-16 w-full max-w-2xl mx-auto px-4">
      <Giscus
        id="comments"
        repo={repo}
        repoId={repoId}
        category={hasCategory ? category : undefined}
        categoryId={hasCategory ? categoryId : undefined}
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={currentTheme === 'dark' ? 'dark' : 'light'}
        lang="en"
        loading="lazy"
      />
    </div>
  )
}

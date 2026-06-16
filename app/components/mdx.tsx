import Link from 'next/link'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React from 'react'
import remarkGfm from 'remark-gfm'
import { slugify } from '@/app/lib/formatters'
import { getArticlePath } from 'app/lib/blog-i18n'
import { defaultLocale, localizePath } from 'app/lib/i18n-paths'
import { getDescriptiveImageAlt } from 'app/lib/seo'
import type {
  TableProps,
  CustomLinkProps,
  RoundedImageProps,
  CodeProps,
  HeadingProps,
} from '@/app/types'
import { CodeBlock } from './code-block'

type MDXComponents = Record<string, React.ComponentType<any>> & {
  wrapper?: React.ComponentType<any>
}

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => (
    <th key={index} scope="col">
      {header}
    </th>
  ))
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <div className="overflow-x-auto" role="region" aria-label="Data table">
      <table>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  )
}

function getLocalizedMdxHref(href: string, locale: string) {
  if (!href.startsWith('/')) {
    return href
  }

  const articleMatch = href.match(/^\/blog\/([^/?#]+)(.*)$/)
  if (articleMatch) {
    let slug = articleMatch[1]
    const suffix = articleMatch[2] || ''

    try {
      slug = decodeURIComponent(slug)
    } catch {
      // Keep the raw slug when decoding fails.
    }

    return `${getArticlePath(slug, locale)}${suffix}`
  }

  return localizePath(href, locale)
}

function createCustomLink(locale: string) {
  function CustomLink({ href = '', children, ...props }: CustomLinkProps) {
    if (href.startsWith('/')) {
      return (
        <Link href={getLocalizedMdxHref(href, locale)} {...props}>
          {children}
        </Link>
      )
    }

    if (href.startsWith('#')) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      )
    }

    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  }

  CustomLink.displayName = 'CustomLink'

  return CustomLink
}

function RoundedImage({ alt, src, className, loading, decoding, ...props }: RoundedImageProps) {
  const resolvedAlt = getDescriptiveImageAlt(
    alt,
    typeof src === 'string' ? src : undefined
  )

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={resolvedAlt}
      src={src}
      className={className ?? 'rounded-lg'}
      loading={loading ?? 'lazy'}
      decoding={decoding ?? 'async'}
      {...props}
    />
  )
}

function Code({ children, className, ...props }: CodeProps) {
  const codeString = typeof children === 'string' ? children : String(children ?? '')
  const codeHTML = highlight(codeString)
  // Extract language from className (e.g. language-js)
  const language = className?.replace(/language-/, '') || 'text'
  
  return (
    <CodeBlock 
      codeHTML={codeHTML} 
      rawCode={codeString} 
      language={language}
      {...props} 
    />
  )
}

function createHeading(level: number) {
  const Heading = ({ children }: HeadingProps) => {
    const childText = typeof children === 'string' ? children : String(children ?? '')
    const slug = slugify(childText)
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
          'aria-label': `Link to ${childText}`,
        }),
      ],
      children
    )
  }

  Heading.displayName = `Heading${level}`

  return Heading
}

const baseComponents = {
  h1: createHeading(2),
  h2: createHeading(3),
  h3: createHeading(4),
  h4: createHeading(5),
  h5: createHeading(6),
  h6: createHeading(6),
  Image: RoundedImage,
  code: Code,
  img: ({ alt, src, loading, decoding, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={getDescriptiveImageAlt(alt, typeof src === 'string' ? src : undefined)}
      src={src}
      loading={loading ?? 'lazy'}
      decoding={decoding ?? 'async'}
      {...props}
    />
  ),
  Table,
} as MDXComponents

interface CustomMDXProps extends Omit<MDXRemoteProps, 'components'> {
  components?: MDXComponents
  locale?: string
}

export function CustomMDX({
  components: userComponents,
  locale = defaultLocale,
  ...props
}: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
      components={{ ...baseComponents, a: createCustomLink(locale), ...(userComponents || {}) }}
    />
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc'
import { highlight } from 'sugar-high'
import React, { ReactNode } from 'react'
import type { MDXComponents } from 'mdx/types'
import { slugify } from '@/app/lib/formatters'
import type {
  TableProps,
  CustomLinkProps,
  RoundedImageProps,
  CodeProps,
  HeadingProps,
} from '@/app/types'

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

function CustomLink({ href = '', children, ...props }: CustomLinkProps) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...props}>
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

function RoundedImage({ alt, ...props }: RoundedImageProps) {
  return <Image alt={alt} className="rounded-lg" {...props} />
}

import { CodeBlock } from './code-block'

// ... existing imports

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

const components = {
  h1: createHeading(2),
  h2: createHeading(3),
  h3: createHeading(4),
  h4: createHeading(5),
  h5: createHeading(6),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  Table,
} as MDXComponents

interface CustomMDXProps extends Omit<MDXRemoteProps, 'components'> {
  components?: MDXComponents
}

export function CustomMDX({ components: userComponents, ...props }: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(userComponents || {}) }}
    />
  )
}

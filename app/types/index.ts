import type { ReactNode, AnchorHTMLAttributes, ImgHTMLAttributes } from 'react'

// Blog metadata types
export type BlogMetadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  category?: Category
  tags?: string[]
}

export type BlogPost = {
  slug: string
  metadata: BlogMetadata
  content: string
}

// Category types
export type Category =
  | 'All'
  | 'AI Technology'
  | 'Web Development'
  | 'SEO & Marketing'
  | 'Productivity'

export type CategoryColor = 'gray' | 'blue' | 'green' | 'purple' | 'orange'

export type CategoryConfig = {
  name: Category
  color: CategoryColor
  emoji: string
}

// Heading types for table of contents
export type Heading = {
  level: number
  text: string
  slug: string
}

// MDX component types
export type TableData = {
  headers: string[]
  rows: string[][]
}

export interface TableProps {
  data: TableData
}

export interface CustomLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
  children?: ReactNode
}

export interface RoundedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string
  src: string
  width?: number
  height?: number
}

export interface CodeProps {
  children?: ReactNode
  className?: string
}

export interface HeadingProps {
  children?: ReactNode
}

// Search types
export type SearchResult = {
  slug: string
  title: string
  summary: string
  publishedAt: string
}

// API response types
export type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}

// Color styles mapping type
export type ColorStylesMap = {
  [key in CategoryColor]: {
    active: string
    inactive: string
  }
}

export type CategoryBadgeColorMap = {
  [key in CategoryColor]: string
}

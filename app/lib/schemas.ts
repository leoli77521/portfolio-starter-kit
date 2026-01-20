import { baseUrl, organization } from './constants'

// Types for schema generation
export interface ListItem {
  url: string
  name: string
  description?: string
  image?: string
  position?: number
}

export interface SchemaOptions {
  name: string
  description: string
  url: string
  items?: ListItem[]
  datePublished?: string
  dateModified?: string
  image?: string
}

/**
 * Generate ItemList schema for list pages (categories, tags, topics)
 * @see https://schema.org/ItemList
 */
export function generateItemListSchema(options: {
  name: string
  description: string
  items: ListItem[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: options.name,
    description: options.description,
    numberOfItems: options.items.length,
    itemListElement: options.items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      url: item.url,
      name: item.name,
      ...(item.description && { description: item.description }),
      ...(item.image && {
        image: {
          '@type': 'ImageObject',
          url: item.image,
        },
      }),
    })),
  }
}

/**
 * Generate CollectionPage schema for list/archive pages
 * @see https://schema.org/CollectionPage
 */
export function generateCollectionPageSchema(options: SchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': options.url,
    name: options.name,
    description: options.description,
    url: options.url,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: 'ToLearn Blog',
      url: baseUrl,
    },
    publisher: organization,
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.image && {
      image: {
        '@type': 'ImageObject',
        url: options.image,
      },
    }),
    inLanguage: 'en-US',
    mainEntity: options.items
      ? {
          '@type': 'ItemList',
          numberOfItems: options.items.length,
          itemListElement: options.items.map((item, index) => ({
            '@type': 'ListItem',
            position: item.position ?? index + 1,
            url: item.url,
            name: item.name,
          })),
        }
      : undefined,
  }
}

/**
 * Generate Course/LearningResource schema for guide pages
 * @see https://schema.org/Course
 * @see https://schema.org/LearningResource
 */
export function generateCourseSchema(options: {
  name: string
  description: string
  url: string
  provider?: string
  educationalLevel?: 'Beginner' | 'Intermediate' | 'Advanced'
  duration?: string // ISO 8601 duration format
  topics?: string[]
  datePublished?: string
  dateModified?: string
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': options.url,
    name: options.name,
    description: options.description,
    url: options.url,
    provider: {
      '@type': 'Organization',
      name: options.provider || 'ToLearn Blog',
      url: baseUrl,
    },
    ...(options.educationalLevel && {
      educationalLevel: options.educationalLevel,
    }),
    ...(options.duration && { timeRequired: options.duration }),
    ...(options.topics && {
      about: options.topics.map((topic) => ({
        '@type': 'Thing',
        name: topic,
      })),
    }),
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    ...(options.image && {
      image: {
        '@type': 'ImageObject',
        url: options.image,
      },
    }),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }
}

/**
 * Generate BreadcrumbList schema
 * @see https://schema.org/BreadcrumbList
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Serialize schema to JSON-LD script tag content
 */
export function schemaToJsonLd(schema: object | object[]): string {
  return JSON.stringify(schema)
}

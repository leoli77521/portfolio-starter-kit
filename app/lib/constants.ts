export const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://tolearn.blog'

export const organization = {
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'ToLearn Blog',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/favicon.ico`,
    width: 32,
    height: 32,
  },
  email: 'lileo16881533@gmail.com',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'lileo16881533@gmail.com',
    },
  ],
}

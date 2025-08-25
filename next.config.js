/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出优化
  trailingSlash: false,
  // 压缩配置
  compress: true,
  // 优化图片
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // SEO 优化
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ]
  },
  // 重定向配置 - 统一URL结构和修复常见错误
  redirects: async () => {
    return [
      // 重定向 www 到非 www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.tolearn.blog' }],
        destination: 'https://tolearn.blog/:path*',
        permanent: true,
      },
      // 修复常见的URL错误
      {
        source: '/blog/post/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/posts/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/article/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/articles/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // 修复带有双斜杠的URL
      {
        source: '/blog//:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // 修复带有尾随斜杠的情况
      {
        source: '/blog/:slug/',
        destination: '/blog/:slug',
        permanent: true,
      },
      // 重定向首页的多种变体
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      // 修复旧的博客URL结构
      {
        source: '/blog/category/:category*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/category/:category*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tag/:tag*',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/tags/:tag*',
        destination: '/blog',
        permanent: true,
      },
      // 修复常见的文件扩展名错误
      {
        source: '/blog/:slug.html',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug.php',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug.aspx',
        destination: '/blog/:slug',
        permanent: true,
      },
      // 处理旧的RSS和sitemap路径
      {
        source: '/feed.xml',
        destination: '/rss',
        permanent: true,
      },
      {
        source: '/rss.xml',
        destination: '/rss',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/rss',
        permanent: true,
      },
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      // 处理WordPress常见路径
      {
        source: '/wp-admin/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-includes/:path*',
        destination: '/',
        permanent: true,
      },
      // 处理管理员和用户相关的错误路径
      {
        source: '/admin/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig
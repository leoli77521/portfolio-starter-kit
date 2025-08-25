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
  // 重定向配置 - 仅保留域名级别和特殊案例的重定向
  redirects: async () => {
    return [
      // 重定向 www 到非 www (域名级别，middleware无法处理)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.tolearn.blog' }],
        destination: 'https://tolearn.blog/:path*',
        permanent: true,
      },
      // 处理特殊的静态文件重定向
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
      // 处理文件扩展名的特殊情况
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
      {
        source: '/index.htm',
        destination: '/',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig
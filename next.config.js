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
  // 重定向配置 - 统一URL结构
  redirects: async () => {
    return [
      // 重定向 www 到非 www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.tolearn.blog' }],
        destination: 'https://tolearn.blog/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态导出优化
  trailingSlash: false,
  // 压缩配置
  compress: true,
  // SWC 最小化
  swcMinify: true,
  // 生产环境移除 console
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // 优化图片
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 实验性功能优化
  experimental: {
    optimizePackageImports: ['lucide-react'],
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
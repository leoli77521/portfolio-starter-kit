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
  // SEO 优化 - Headers 已移至 vercel.json 避免重复配置
  // 仅保留 Next.js 特定的 headers
  headers: async () => {
    return []
  },
  // 重定向配置已移至 vercel.json 避免双重跳转
  // Next.js 层面只保留应用逻辑相关的重定向
  redirects: async () => {
    return [
      // 其他应用级别的重定向可以在这里添加
      // 例如：旧路由到新路由的映射
    ]
  },
}

module.exports = nextConfig
/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**.360buyimg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: '@svgr/webpack',
    })
    // 配置别名
    config.resolve.alias['@'] = path.resolve(__dirname, '.')
    return config
  },

  rewrites() {
    return [
      {
        source: '/v1/:path*', // 匹配前端请求的路径
        destination: 'http://localhost:8000/v1/:path*', // 后端 API 地址
      },
    ]
  },
}

module.exports = nextConfig

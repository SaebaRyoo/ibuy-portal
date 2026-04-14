/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  output: 'export',
  experimental: {
    missingSuspenseWithCSRBailout: false,
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

/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pagesの場合、リポジトリ名をbase pathとして設定
  basePath: isProd ? '/game-of-life-bank' : '',
  assetPrefix: isProd ? '/game-of-life-bank' : '',
}

module.exports = nextConfig
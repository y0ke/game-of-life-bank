/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'
const useBasePath = process.env.USE_BASEPATH === 'true'

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // GitHub Pagesの場合、リポジトリ名をbase pathとして設定
  basePath: useBasePath ? '/game-of-life-bank' : '',
  assetPrefix: useBasePath ? '/game-of-life-bank' : '',
}

module.exports = nextConfig
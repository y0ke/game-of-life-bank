import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '人生ゲーム銀行',
  description: '人生ゲームの銀行管理アプリ',
  manifest: '/manifest.json',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#667eea',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gradient-to-b from-background to-white">
        {children}
      </body>
    </html>
  )
}
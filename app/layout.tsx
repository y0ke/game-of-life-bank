import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'かんたん銀行役 - ボードゲームのお金管理アプリ',
  description: '人生ゲームやモノポリーなどボードゲームの銀行役をスマホで！紙幣の数え間違いや紛失とはさようなら。',
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
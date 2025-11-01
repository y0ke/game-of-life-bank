// フォーマット関連のユーティリティ関数

import { CurrencyType } from '@/types/game'

// 数値を通貨形式にフォーマット
export const formatCurrency = (amount: number, currency: CurrencyType = 'JPY'): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } else {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
}

// 数値をカンマ区切りでフォーマット
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ja-JP').format(num)
}

// 日時をフォーマット
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

// 時刻のみフォーマット
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ja-JP', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(date)
}

// IDを生成
export const generateId = (prefix: string = ''): string => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`
}
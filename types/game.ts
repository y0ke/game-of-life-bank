// ゲーム関連の型定義

export type CurrencyType = 'JPY' | 'USD'

export interface Player {
  id: string
  name: string
  color: string
  balance: number
}

export type TransactionType = 'bank_income' | 'bank_payment' | 'transfer'

export interface Transaction {
  id: string
  type: TransactionType
  from: string // 'bank' or player ID
  to: string // 'bank' or player ID
  amount: number
  timestamp: string
  playerName?: string // 表示用のプレイヤー名
}

export interface GameState {
  gameId: string
  startedAt: string
  initialAmount: number
  currency: CurrencyType
  players: Player[]
  transactions: Transaction[]
  isGameEnded?: boolean
}

// プレイヤーカラーの定義
export const PLAYER_COLORS = [
  '#FF6B6B', // 赤
  '#4ECDC4', // 青緑
  '#95E77E', // 黄緑
  '#FFA07A', // オレンジ
  '#87CEEB', // 空色
  '#DDA0DD', // 紫
  '#F0E68C', // 黄
  '#FFB6C1', // ピンク
]

// クイック金額ボタンの値
export const QUICK_AMOUNTS = [1000, 5000, 10000, 20000, 50000, 100000]

// デフォルトの初期金額
export const DEFAULT_INITIAL_AMOUNT = 5000

// デフォルトの通貨
export const DEFAULT_CURRENCY: CurrencyType = 'USD'

// 最小・最大プレイヤー数
export const MIN_PLAYERS = 2
export const MAX_PLAYERS = 8
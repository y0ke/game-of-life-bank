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

// プレイヤーカラーの定義（人生ゲームの車の色に近い色）
export const PLAYER_COLORS = [
  '#E74C3C', // 赤
  '#3498DB', // 青
  '#F1C40F', // 黄
  '#2ECC71', // 緑
  '#9B59B6', // 紫
  '#E67E22', // オレンジ
  '#1ABC9C', // ターコイズ
  '#EC407A', // ピンク
  '#34495E', // ダークグレー
  '#95A5A6', // グレー
  '#16A085', // エメラルド
  '#D35400', // 濃いオレンジ
]

// 利用可能な色の選択肢（人生ゲームの車の色に対応）
export const AVAILABLE_COLORS = [
  { name: '赤', value: '#E74C3C' },
  { name: '青', value: '#3498DB' },
  { name: '黄色', value: '#F1C40F' },
  { name: '緑', value: '#2ECC71' },
  { name: '紫', value: '#9B59B6' },
  { name: 'オレンジ', value: '#E67E22' },
  { name: 'ターコイズ', value: '#1ABC9C' },
  { name: 'ピンク', value: '#EC407A' },
  { name: '黒', value: '#34495E' },
  { name: 'グレー', value: '#95A5A6' },
  { name: 'エメラルド', value: '#16A085' },
  { name: '茶色', value: '#D35400' },
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
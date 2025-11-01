// LocalStorage関連のユーティリティ関数

import { GameState, Transaction, Player, CurrencyType } from '@/types/game'

const STORAGE_KEY = 'game-of-life-bank'
const STORAGE_VERSION = '1.0.0'

interface StorageData {
  version: string
  currentGame: GameState | null
  gameHistory: GameState[]
}

// LocalStorageからデータを読み込む
export const loadFromStorage = (): StorageData => {
  if (typeof window === 'undefined') {
    return {
      version: STORAGE_VERSION,
      currentGame: null,
      gameHistory: [],
    }
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      return {
        version: STORAGE_VERSION,
        currentGame: null,
        gameHistory: [],
      }
    }

    const parsed = JSON.parse(data) as StorageData

    // バージョンチェック
    if (parsed.version !== STORAGE_VERSION) {
      // バージョンが異なる場合の移行処理をここに追加
      console.warn('Storage version mismatch, resetting data')
      return {
        version: STORAGE_VERSION,
        currentGame: null,
        gameHistory: [],
      }
    }

    return parsed
  } catch (error) {
    console.error('Failed to load from storage:', error)
    return {
      version: STORAGE_VERSION,
      currentGame: null,
      gameHistory: [],
    }
  }
}

// LocalStorageにデータを保存する
export const saveToStorage = (data: StorageData): void => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save to storage:', error)
  }
}

// 現在のゲームを保存
export const saveCurrentGame = (game: GameState): void => {
  const data = loadFromStorage()
  data.currentGame = game
  saveToStorage(data)
}

// 現在のゲームを読み込む
export const loadCurrentGame = (): GameState | null => {
  const data = loadFromStorage()
  return data.currentGame
}

// ゲームを終了して履歴に追加
export const endGame = (game: GameState): void => {
  const data = loadFromStorage()

  if (data.currentGame) {
    // ゲーム終了フラグを設定
    data.currentGame.isGameEnded = true

    // 履歴に追加（最新のゲームを先頭に）
    data.gameHistory.unshift(data.currentGame)

    // 履歴は最大10件まで保持
    if (data.gameHistory.length > 10) {
      data.gameHistory = data.gameHistory.slice(0, 10)
    }

    // 現在のゲームをクリア
    data.currentGame = null
  }

  saveToStorage(data)
}

// 取引を追加
export const addTransaction = (transaction: Transaction): void => {
  const data = loadFromStorage()

  if (data.currentGame) {
    data.currentGame.transactions.push(transaction)

    // プレイヤーの残高を更新
    const playerFrom = data.currentGame.players.find(p => p.id === transaction.from)
    const playerTo = data.currentGame.players.find(p => p.id === transaction.to)

    if (transaction.from !== 'bank' && playerFrom) {
      playerFrom.balance -= transaction.amount
    }

    if (transaction.to !== 'bank' && playerTo) {
      playerTo.balance += transaction.amount
    }

    saveToStorage(data)
  }
}

// 直前の取引を取り消し（アンドゥ機能）
export const undoLastTransaction = (): boolean => {
  const data = loadFromStorage()

  if (data.currentGame && data.currentGame.transactions.length > 0) {
    // 最後の取引を取得して削除
    const lastTransaction = data.currentGame.transactions.pop()

    if (lastTransaction) {
      // プレイヤーの残高を元に戻す
      const playerFrom = data.currentGame.players.find(p => p.id === lastTransaction.from)
      const playerTo = data.currentGame.players.find(p => p.id === lastTransaction.to)

      if (lastTransaction.from !== 'bank' && playerFrom) {
        playerFrom.balance += lastTransaction.amount
      }

      if (lastTransaction.to !== 'bank' && playerTo) {
        playerTo.balance -= lastTransaction.amount
      }

      saveToStorage(data)
      return true
    }
  }

  return false
}

// データをリセット
export const resetStorage = (): void => {
  if (typeof window === 'undefined') return

  localStorage.removeItem(STORAGE_KEY)
}

// 新しいゲームを開始
export const startNewGame = (players: Player[], initialAmount: number, currency: CurrencyType): GameState => {
  const newGame: GameState = {
    gameId: `game-${Date.now()}`,
    startedAt: new Date().toISOString(),
    initialAmount,
    currency,
    players,
    transactions: [],
  }

  saveCurrentGame(newGame)
  return newGame
}
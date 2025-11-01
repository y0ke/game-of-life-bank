'use client'

import { useState, useEffect } from 'react'
import GameSetup from '@/components/GameSetup'
import BankScreen from '@/components/BankScreen'
import TransactionHistory from '@/components/TransactionHistory'
import GameResult from '@/components/GameResult'
import { Player, Transaction, GameState, CurrencyType } from '@/types/game'
import {
  loadCurrentGame,
  saveCurrentGame,
  startNewGame,
  addTransaction,
  undoLastTransaction,
  endGame
} from '@/utils/storage'

type Screen = 'setup' | 'bank' | 'history' | 'result'

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>('setup')
  const [canUndo, setCanUndo] = useState(false)

  // 初期化時にLocalStorageから読み込み
  useEffect(() => {
    const savedGame = loadCurrentGame()
    if (savedGame && !savedGame.isGameEnded) {
      setGameState(savedGame)
      setCurrentScreen('bank')
      setCanUndo(savedGame.transactions.length > 0)
    }
  }, [])

  // ゲーム状態が変更されたら保存
  useEffect(() => {
    if (gameState && !gameState.isGameEnded) {
      saveCurrentGame(gameState)
      setCanUndo(gameState.transactions.length > 0)
    }
  }, [gameState])

  // ゲーム開始
  const handleStartGame = (players: Player[], initialAmount: number, currency: CurrencyType) => {
    const newGame = startNewGame(players, initialAmount, currency)
    setGameState(newGame)
    setCurrentScreen('bank')
  }

  // 取引処理
  const handleTransaction = (transaction: Transaction) => {
    if (!gameState) return

    // 取引を追加
    addTransaction(transaction)

    // 状態を更新
    const updatedGame = loadCurrentGame()
    if (updatedGame) {
      setGameState(updatedGame)
    }
  }

  // 取引を取り消し
  const handleUndo = () => {
    if (undoLastTransaction()) {
      const updatedGame = loadCurrentGame()
      if (updatedGame) {
        setGameState(updatedGame)
      }
    }
  }

  // ゲーム終了
  const handleEndGame = () => {
    if (gameState) {
      endGame(gameState)
      setCurrentScreen('result')
    }
  }

  // 新しいゲーム開始
  const handleNewGame = () => {
    setGameState(null)
    setCurrentScreen('setup')
    setCanUndo(false)
  }

  // ナビゲーションバー
  const NavigationBar = () => {
    if (currentScreen === 'setup' || currentScreen === 'result') return null

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="flex">
          <button
            onClick={() => setCurrentScreen('bank')}
            className={`nav-tab ${currentScreen === 'bank' ? 'nav-tab-active' : ''}`}
          >
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs">銀行</span>
            </div>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`nav-tab ${currentScreen === 'history' ? 'nav-tab-active' : ''}`}
          >
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-xs">履歴</span>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // 画面のレンダリング
  const renderScreen = () => {
    switch (currentScreen) {
      case 'setup':
        return <GameSetup onStartGame={handleStartGame} />

      case 'bank':
        return gameState ? (
          <BankScreen
            players={gameState.players}
            currency={gameState.currency}
            onTransaction={handleTransaction}
            onEndGame={handleEndGame}
            onUndo={handleUndo}
            canUndo={canUndo}
          />
        ) : null

      case 'history':
        return gameState ? (
          <TransactionHistory
            transactions={gameState.transactions}
            players={gameState.players}
            currency={gameState.currency}
          />
        ) : null

      case 'result':
        return gameState ? (
          <GameResult
            players={gameState.players}
            currency={gameState.currency}
            initialAmount={gameState.initialAmount}
            onNewGame={handleNewGame}
          />
        ) : null

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen relative">
      {renderScreen()}
      <NavigationBar />
    </main>
  )
}
'use client'

import { useState, useRef, useEffect } from 'react'
import { Player, Transaction, TransactionType, CurrencyType, QUICK_AMOUNTS } from '@/types/game'
import { formatCurrency } from '@/utils/format'
import { generateId } from '@/utils/format'

interface BankScreenProps {
  players: Player[]
  currency: CurrencyType
  onTransaction: (transaction: Transaction) => void
  onEndGame: () => void
  onUndo: () => void
  canUndo: boolean
}

export default function BankScreen({
  players,
  currency,
  onTransaction,
  onEndGame,
  onUndo,
  canUndo,
}: BankScreenProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(players[0]?.id || '')
  const [transactionType, setTransactionType] = useState<'income' | 'payment'>('income')
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [transferToId, setTransferToId] = useState<string>('')

  const playerCardsRef = useRef<HTMLDivElement>(null)

  // 選択されたプレイヤーを取得
  const selectedPlayer = players.find(p => p.id === selectedPlayerId)

  // 金額を加算
  const handleAmountAdd = (value: number) => {
    setAmount(prev => prev + value)
    setCustomAmount('')
  }

  // 金額をリセット
  const handleAmountReset = () => {
    setAmount(0)
    setCustomAmount('')
  }

  // カスタム金額を設定
  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(numValue)) {
      setAmount(numValue)
      setCustomAmount(value)
    } else if (value === '') {
      setAmount(0)
      setCustomAmount('')
    }
  }

  // 取引を実行
  const handleTransaction = () => {
    if (!selectedPlayer || amount <= 0) return

    const transaction: Transaction = {
      id: generateId('trans'),
      type: transactionType === 'income' ? 'bank_income' : 'bank_payment',
      from: transactionType === 'income' ? 'bank' : selectedPlayer.id,
      to: transactionType === 'income' ? selectedPlayer.id : 'bank',
      amount,
      timestamp: new Date().toISOString(),
      playerName: selectedPlayer.name,
    }

    onTransaction(transaction)

    // リセット
    setAmount(0)
    setCustomAmount('')
  }

  // 送金を実行
  const handleTransfer = () => {
    if (!selectedPlayer || !transferToId || amount <= 0) return
    if (selectedPlayer.id === transferToId) return

    const toPlayer = players.find(p => p.id === transferToId)
    if (!toPlayer) return

    const transaction: Transaction = {
      id: generateId('trans'),
      type: 'transfer',
      from: selectedPlayer.id,
      to: transferToId,
      amount,
      timestamp: new Date().toISOString(),
      playerName: `${selectedPlayer.name} → ${toPlayer.name}`,
    }

    onTransaction(transaction)

    // リセット
    setAmount(0)
    setCustomAmount('')
    setShowTransferModal(false)
    setTransferToId('')
  }

  // プレイヤー選択時にカードをスクロール
  useEffect(() => {
    if (playerCardsRef.current) {
      const selectedCard = playerCardsRef.current.querySelector(`[data-player-id="${selectedPlayerId}"]`)
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [selectedPlayerId])

  // 確認ダイアログを表示
  const handleEndGameConfirm = () => {
    if (window.confirm('ゲームを終了しますか？終了後は結果が表示されます。')) {
      onEndGame()
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* ヘッダー */}
      <div className="bg-primary text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">人生ゲーム銀行</h1>
          <div className="flex gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="btn bg-white/20 text-white hover:bg-white/30 p-2"
              aria-label="取り消し"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={handleEndGameConfirm}
              className="btn bg-error hover:bg-red-700 text-white px-3 py-1 text-sm"
            >
              終了
            </button>
          </div>
        </div>
      </div>

      {/* プレイヤーカード */}
      <div className="p-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-600 mb-2">プレイヤー選択</h3>
          <div
            ref={playerCardsRef}
            className={`grid gap-3 ${
              players.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' :
              players.length <= 4 ? 'grid-cols-2 md:grid-cols-4' :
              players.length <= 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' :
              'grid-cols-2 md:grid-cols-4 lg:grid-cols-4'
            } ${players.length <= 4 ? '' : 'lg:overflow-x-auto lg:flex lg:grid-cols-none'}`}
          >
            {players.map((player) => (
              <div
                key={player.id}
                data-player-id={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`
                  bg-white rounded-xl p-4 cursor-pointer transition-all duration-200
                  ${players.length > 4 ? 'lg:min-w-[200px] lg:flex-shrink-0' : 'w-full'}
                  ${selectedPlayerId === player.id
                    ? 'ring-2 ring-primary shadow-lg transform scale-105'
                    : 'hover:shadow-md hover:scale-102'
                  }
                `}
                style={{
                  borderTop: `4px solid ${player.color}`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: player.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{player.name}</p>
                      {selectedPlayerId === player.id && (
                        <p className="text-xs text-primary">選択中</p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">残高</p>
                  <p className={`text-xl font-bold ${player.balance < 0 ? 'text-error' : 'text-gray-900'}`}>
                    {formatCurrency(player.balance, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 取引タイプ選択 */}
      <div className="px-4 mb-4 max-w-2xl mx-auto">
        <h3 className="text-sm font-medium text-gray-600 mb-2">取引タイプ</h3>
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTransactionType('income')}
            className={`transaction-tab ${transactionType === 'income' ? 'transaction-tab-active' : ''}`}
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8 8-8-8" />
            </svg>
            銀行から受取
          </button>
          <button
            onClick={() => setTransactionType('payment')}
            className={`transaction-tab ${transactionType === 'payment' ? 'transaction-tab-active' : ''}`}
          >
            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m8 8l-8-8-8 8" />
            </svg>
            銀行へ支払
          </button>
        </div>
      </div>

      {/* 金額選択 */}
      <div className="px-4 pb-4 max-w-2xl mx-auto">
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">金額を選択</h3>

          {/* クイック金額ボタン */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {QUICK_AMOUNTS.map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => handleAmountAdd(quickAmount)}
                className="btn btn-secondary text-sm"
              >
                +{formatCurrency(quickAmount, currency)}
              </button>
            ))}
          </div>

          {/* カスタム金額入力 */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">直接入力:</span>
              <input
                type="text"
                inputMode="numeric"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                placeholder="金額を入力"
                className="input flex-1"
              />
            </div>
          </div>

          {/* 選択金額表示 */}
          <div className="bg-primary/10 rounded-lg p-3 mb-4 text-center">
            <p className="text-sm text-gray-600">
              {transactionType === 'income' ? '受取金額' : '支払金額'}
            </p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(amount, currency)}</p>
          </div>

          {/* リセットボタン */}
          <button
            onClick={handleAmountReset}
            className="btn btn-secondary w-full mb-3 text-sm"
          >
            リセット
          </button>

          {/* 実行ボタン */}
          <div className="flex gap-2">
            <button
              onClick={handleTransaction}
              disabled={amount <= 0 || !selectedPlayer}
              className="btn btn-success flex-1 text-lg"
            >
              {transactionType === 'income' ? '受取' : '支払'}実行
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              disabled={amount <= 0 || !selectedPlayer}
              className="btn btn-primary"
            >
              送金
            </button>
          </div>
        </div>
      </div>

      {/* 送金モーダル */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">送金先を選択</h3>
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  setTransferToId('')
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {selectedPlayer && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-600 mb-1">送金元</p>
                <div className="flex items-center">
                  <div
                    className="w-6 h-6 rounded-full mr-2"
                    style={{ backgroundColor: selectedPlayer.color }}
                  />
                  <span className="font-medium">{selectedPlayer.name}</span>
                  <span className={`ml-auto text-sm ${selectedPlayer.balance < 0 ? 'text-error font-bold' : 'text-gray-600'}`}>
                    {formatCurrency(selectedPlayer.balance, currency)}
                  </span>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-2">送金先を選択してください</p>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {players
                .filter(p => p.id !== selectedPlayerId)
                .map((player) => (
                  <button
                    key={player.id}
                    onClick={() => setTransferToId(player.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      transferToId === player.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-8 h-8 rounded-full mr-3"
                          style={{ backgroundColor: player.color }}
                        />
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className={`text-xs ${player.balance < 0 ? 'text-error font-semibold' : 'text-gray-500'}`}>
                            残高: {formatCurrency(player.balance, currency)}
                          </p>
                        </div>
                      </div>
                      {transferToId === player.id && (
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
            </div>

            {amount > 0 && transferToId && (
              <div className="bg-primary/10 rounded-lg p-3 mb-4 text-center">
                <p className="text-sm text-gray-600">送金額</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(amount, currency)}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowTransferModal(false)
                  setTransferToId('')
                }}
                className="btn btn-secondary flex-1"
              >
                キャンセル
              </button>
              <button
                onClick={handleTransfer}
                disabled={!transferToId}
                className="btn btn-primary flex-1"
              >
                送金実行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
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
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const playerCardsRef = useRef<HTMLDivElement>(null)

  // 成功トーストを表示
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessToast(true)
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 3000)
  }

  // 選択されたプレイヤーを取得
  const selectedPlayer = players.find(p => p.id === selectedPlayerId)

  // 紙幣の色を取得（金額に応じて異なる色）
  const getBillColor = (amount: number, index: number) => {
    const colors = [
      '#8B7355', // 茶色 - 1,000
      '#4A90E2', // 青 - 5,000
      '#E74C3C', // 赤 - 10,000
      '#27AE60', // 緑 - 20,000
      '#9B59B6', // 紫 - 50,000
      '#F39C12', // オレンジ - 100,000
    ]
    return colors[index] || colors[0]
  }

  const getBillColorLight = (amount: number, index: number) => {
    const colors = [
      '#A89078', // 明るい茶色
      '#6BA8E8', // 明るい青
      '#ED6C5E', // 明るい赤
      '#4DC47D', // 明るい緑
      '#B577D1', // 明るい紫
      '#F5B041', // 明るいオレンジ
    ]
    return colors[index] || colors[0]
  }

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

    // 成功メッセージを表示
    const action = transactionType === 'income' ? '受取' : '支払'
    showSuccess(`${selectedPlayer.name}が${formatCurrency(amount, currency)}を${action}しました`)

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

    // 成功メッセージを表示
    showSuccess(`${selectedPlayer.name}から${toPlayer.name}へ${formatCurrency(amount, currency)}を送金しました`)

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
          <h1 className="text-xl font-bold">かんたん銀行役</h1>
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
      <div className="bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h3 className="text-xs font-medium text-gray-600 mb-2">プレイヤー</h3>
          <div
            ref={playerCardsRef}
            className="grid gap-2 md:gap-3 pb-2"
            style={{
              gridTemplateColumns: `repeat(${players.length}, minmax(120px, 1fr))`,
              maxWidth: '100%'
            }}
          >
            {players.map((player) => (
              <div
                key={player.id}
                data-player-id={player.id}
                onClick={() => setSelectedPlayerId(player.id)}
                className={`
                  bg-white rounded-lg p-2 md:p-3 cursor-pointer transition-all duration-200
                  ${selectedPlayerId === player.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-md'
                  }
                `}
                style={{
                  borderTop: `3px solid ${player.color}`,
                  maxWidth: '200px'
                }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full mb-1 md:mb-2 flex-shrink-0"
                    style={{ backgroundColor: player.color }}
                  />
                  <p className="font-bold text-xs md:text-sm text-gray-900 truncate w-full text-center">{player.name}</p>
                  <p className={`text-sm md:text-base font-bold mt-1 ${player.balance < 0 ? 'text-error' : 'text-gray-900'}`}>
                    {formatCurrency(player.balance, currency)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 取引タイプ選択 */}
      <div className="px-4 mb-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-sm font-medium text-gray-600 mb-2">取引タイプ</h3>
          <div className="flex gap-3 md:gap-4">
            <button
              onClick={() => setTransactionType('income')}
              className={`transaction-type-btn ${transactionType === 'income' ? 'transaction-type-btn-income-active' : 'transaction-type-btn-inactive'}`}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm md:text-lg font-bold">お金を受け取る</span>
              <span className="text-xs md:text-sm text-gray-600 mt-0.5">（銀行 → プレイヤー）</span>
            </button>
            <button
              onClick={() => setTransactionType('payment')}
              className={`transaction-type-btn ${transactionType === 'payment' ? 'transaction-type-btn-payment-active' : 'transaction-type-btn-inactive'}`}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4m16 0l-8-8m8 8l-8 8" />
              </svg>
              <span className="text-sm md:text-lg font-bold">お金を支払う</span>
              <span className="text-xs md:text-sm text-gray-600 mt-0.5">（プレイヤー → 銀行）</span>
            </button>
          </div>
        </div>
      </div>

      {/* 金額選択 */}
      <div className="px-4 pb-4">
        <div className="max-w-7xl mx-auto">
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">金額を選択</h3>

            {/* クイック金額ボタン */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4">
              {QUICK_AMOUNTS.map((quickAmount, index) => (
                <button
                  key={quickAmount}
                  onClick={() => handleAmountAdd(quickAmount)}
                  className="money-bill-btn"
                  style={{
                    background: `linear-gradient(135deg, ${getBillColor(quickAmount, index)} 0%, ${getBillColorLight(quickAmount, index)} 100%)`,
                  }}
                >
                  <div className="bill-pattern"></div>
                  <span className="bill-amount">+{formatCurrency(quickAmount, currency)}</span>
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
            <div className="bg-primary/10 rounded-lg p-4 md:p-5 mb-4 text-center">
              <p className="text-sm md:text-base text-gray-600">
                {transactionType === 'income' ? '受取金額' : '支払金額'}
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">{formatCurrency(amount, currency)}</p>
            </div>

            {/* リセットボタン */}
            <button
              onClick={handleAmountReset}
              className="btn btn-secondary w-full mb-3 text-sm md:text-base"
            >
              リセット
            </button>

            {/* 実行ボタン */}
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={handleTransaction}
                disabled={amount <= 0 || !selectedPlayer}
                className="btn btn-success flex-1 text-lg md:text-xl"
              >
                {transactionType === 'income' ? '受取' : '支払'}実行
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                disabled={amount <= 0 || !selectedPlayer}
                className="btn btn-primary text-base md:text-lg"
              >
                送金
              </button>
            </div>
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
                className="btn btn-success flex-1 text-lg font-bold"
              >
                ✓ 送金実行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 成功トースト通知 */}
      {showSuccessToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-sm md:text-base">{successMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
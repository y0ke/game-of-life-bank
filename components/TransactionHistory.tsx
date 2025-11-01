'use client'

import { Transaction, Player, CurrencyType } from '@/types/game'
import { formatCurrency, formatTime } from '@/utils/format'

interface TransactionHistoryProps {
  transactions: Transaction[]
  players: Player[]
  currency: CurrencyType
}

export default function TransactionHistory({ transactions, players, currency }: TransactionHistoryProps) {
  // 取引タイプのアイコンを取得
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'bank_income':
        return (
          <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8 8-8-8" />
          </svg>
        )
      case 'bank_payment':
        return (
          <svg className="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V4m8 8l-8-8-8 8" />
          </svg>
        )
      case 'transfer':
        return (
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        )
      default:
        return null
    }
  }

  // 取引タイプのラベルを取得
  const getTransactionLabel = (transaction: Transaction) => {
    switch (transaction.type) {
      case 'bank_income':
        return '銀行から受取'
      case 'bank_payment':
        return '銀行へ支払'
      case 'transfer':
        return '送金'
      default:
        return ''
    }
  }

  // 取引の説明を取得
  const getTransactionDescription = (transaction: Transaction) => {
    const fromPlayer = players.find(p => p.id === transaction.from)
    const toPlayer = players.find(p => p.id === transaction.to)

    switch (transaction.type) {
      case 'bank_income':
        return toPlayer ? `${toPlayer.name} が受取` : ''
      case 'bank_payment':
        return fromPlayer ? `${fromPlayer.name} が支払` : ''
      case 'transfer':
        return fromPlayer && toPlayer ? `${fromPlayer.name} → ${toPlayer.name}` : ''
      default:
        return ''
    }
  }

  // 取引を新しい順にソート
  const sortedTransactions = [...transactions].reverse()

  if (transactions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">取引履歴がありません</p>
          <p className="text-sm mt-2">取引を行うと履歴が表示されます</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4">取引履歴</h2>

        <div className="space-y-2">
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="card flex items-center justify-between animate-fade-in"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {getTransactionLabel(transaction)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getTransactionDescription(transaction)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTime(transaction.timestamp)}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-lg font-bold ${
                    transaction.type === 'bank_income' ? 'text-success' :
                    transaction.type === 'bank_payment' ? 'text-error' :
                    'text-primary'
                  }`}
                >
                  {transaction.type === 'bank_income' ? '+' : '-'}
                  {formatCurrency(transaction.amount, currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
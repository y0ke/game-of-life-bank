'use client'

import { Player, CurrencyType } from '@/types/game'
import { formatCurrency } from '@/utils/format'

interface GameResultProps {
  players: Player[]
  currency: CurrencyType
  initialAmount: number
  onNewGame: () => void
}

export default function GameResult({ players, currency, initialAmount, onNewGame }: GameResultProps) {
  // プレイヤーを残高順にソート
  const sortedPlayers = [...players].sort((a, b) => b.balance - a.balance)

  // 順位のメダルアイコンを取得
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return `${rank}位`
    }
  }

  // 残高の変動を計算（初期金額との差）
  const getBalanceChange = (balance: number) => {
    const change = balance - initialAmount
    if (change > 0) {
      return { text: `+${formatCurrency(change, currency)}`, color: 'text-success' }
    } else if (change < 0) {
      return { text: formatCurrency(change, currency), color: 'text-error' }
    } else {
      return { text: currency === 'USD' ? '±$0' : '±¥0', color: 'text-gray-500' }
    }
  }

  // 勝者を取得
  const winner = sortedPlayers[0]

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-full animate-fade-in">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">ゲーム終了</h1>
          <p className="text-gray-600">最終結果</p>
        </div>

        {/* 優勝者表示 */}
        {winner && (
          <div className="card mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
            <div className="text-center">
              <p className="text-4xl mb-2">🎉</p>
              <p className="text-xl font-bold mb-1">優勝</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ backgroundColor: winner.color }}
                />
                <span className="text-2xl font-bold">{winner.name}</span>
              </div>
              <p className={`text-3xl font-bold ${winner.balance < 0 ? 'text-error' : ''}`}>
                {formatCurrency(winner.balance, currency)}
              </p>
            </div>
          </div>
        )}

        {/* 順位表 */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">最終順位</h2>

          <div className="space-y-3">
            {sortedPlayers.map((player, index) => {
              const rank = index + 1
              const balanceChange = getBalanceChange(player.balance)

              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    rank === 1 ? 'bg-yellow-50' :
                    rank === 2 ? 'bg-gray-50' :
                    rank === 3 ? 'bg-orange-50' :
                    'bg-white'
                  } border border-gray-200`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">
                      {getRankIcon(rank)}
                    </span>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-lg font-bold ${player.balance < 0 ? 'text-error' : ''}`}>
                      {formatCurrency(player.balance, currency)}
                    </p>
                    <p className={`text-sm ${balanceChange.color}`}>{balanceChange.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 統計情報 */}
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-3">統計</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">最高額</p>
              <p className="text-lg font-bold text-success">
                {formatCurrency(Math.max(...players.map(p => p.balance)), currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">最低額</p>
              <p className="text-lg font-bold text-error">
                {formatCurrency(Math.min(...players.map(p => p.balance)), currency)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">平均額</p>
              <p className="text-lg font-bold text-primary">
                {formatCurrency(
                  Math.round(
                    players.reduce((sum, p) => sum + p.balance, 0) / players.length
                  ),
                  currency
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">総資産</p>
              <p className="text-lg font-bold">
                {formatCurrency(
                  players.reduce((sum, p) => sum + p.balance, 0),
                  currency
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 新しいゲーム開始ボタン */}
        <button
          onClick={onNewGame}
          className="btn btn-primary w-full text-lg py-4"
        >
          新しいゲームを開始
        </button>
      </div>
    </div>
  )
}
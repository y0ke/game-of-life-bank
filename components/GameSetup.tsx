'use client'

import { useState } from 'react'
import { Player, CurrencyType, PLAYER_COLORS, AVAILABLE_COLORS, DEFAULT_INITIAL_AMOUNT, DEFAULT_CURRENCY, MIN_PLAYERS, MAX_PLAYERS, QUICK_AMOUNTS } from '@/types/game'
import { formatCurrency } from '@/utils/format'
import { generateId } from '@/utils/format'

interface GameSetupProps {
  onStartGame: (players: Player[], initialAmount: number, currency: CurrencyType) => void
}

export default function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerNames, setPlayerNames] = useState<string[]>(['', ''])
  const [playerColors, setPlayerColors] = useState<string[]>([PLAYER_COLORS[0], PLAYER_COLORS[1]])
  const [initialAmount, setInitialAmount] = useState(DEFAULT_INITIAL_AMOUNT)
  const [customAmount, setCustomAmount] = useState('')
  const [currency, setCurrency] = useState<CurrencyType>(DEFAULT_CURRENCY)

  // プレイヤー名を追加
  const addPlayer = () => {
    if (playerNames.length < MAX_PLAYERS) {
      setPlayerNames([...playerNames, ''])
      setPlayerColors([...playerColors, PLAYER_COLORS[playerNames.length]])
    }
  }

  // プレイヤー名を削除
  const removePlayer = (index: number) => {
    if (playerNames.length > MIN_PLAYERS) {
      setPlayerNames(playerNames.filter((_, i) => i !== index))
      setPlayerColors(playerColors.filter((_, i) => i !== index))
    }
  }

  // プレイヤー名を更新
  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
  }

  // プレイヤーの色を更新
  const updatePlayerColor = (index: number, color: string) => {
    const newColors = [...playerColors]
    newColors[index] = color
    setPlayerColors(newColors)
  }

  // 初期金額を加算
  const handleAmountAdd = (amount: number) => {
    setInitialAmount(prev => prev + amount)
    setCustomAmount('')
  }

  // 初期金額をリセット
  const handleAmountReset = () => {
    setInitialAmount(0)
    setCustomAmount('')
  }

  // カスタム金額を設定
  const handleCustomAmountChange = (value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(numValue)) {
      setInitialAmount(numValue)
      setCustomAmount(value)
    } else if (value === '') {
      setInitialAmount(0)
      setCustomAmount('')
    }
  }

  // ゲーム開始
  const handleStartGame = () => {
    // 空の名前を除外し、デフォルト名を設定
    const validPlayers = playerNames
      .map((name, index) => ({
        id: generateId('player'),
        name: name.trim() || `プレイヤー${index + 1}`,
        color: playerColors[index],
        balance: initialAmount,
      }))
      .filter(player => player.name)

    if (validPlayers.length >= MIN_PLAYERS) {
      onStartGame(validPlayers, initialAmount, currency)
    }
  }

  // 有効なプレイヤー数を取得
  const validPlayerCount = playerNames.filter(name => name.trim()).length

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-full animate-fade-in">
        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">かんたん銀行役</h1>
          <p className="text-gray-600">ボードゲームのお金管理をスマホで！</p>
        </div>

        {/* プレイヤー登録セクション */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">プレイヤー登録</h2>

          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 cursor-pointer border-2 border-gray-300"
                    style={{ backgroundColor: playerColors[index] }}
                    onClick={() => {
                      const colorSelector = document.getElementById(`color-selector-${index}`)
                      if (colorSelector) {
                        colorSelector.classList.toggle('hidden')
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`プレイヤー${index + 1}`}
                    className="input flex-1"
                    maxLength={10}
                  />
                  {playerNames.length > MIN_PLAYERS && (
                    <button
                      onClick={() => removePlayer(index)}
                      className="btn btn-danger p-2"
                      aria-label="削除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <div id={`color-selector-${index}`} className="hidden ml-10 mb-2">
                  <p className="text-xs text-gray-600 mb-2">車の色を選択:</p>
                  <div className="grid grid-cols-6 gap-2">
                    {AVAILABLE_COLORS.map((colorOption) => (
                      <button
                        key={colorOption.value}
                        onClick={() => {
                          updatePlayerColor(index, colorOption.value)
                          const colorSelector = document.getElementById(`color-selector-${index}`)
                          if (colorSelector) {
                            colorSelector.classList.add('hidden')
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          playerColors[index] === colorOption.value
                            ? 'border-gray-800 scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: colorOption.value }}
                        title={colorOption.name}
                        aria-label={colorOption.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* プレイヤー追加ボタン */}
          {playerNames.length < MAX_PLAYERS && (
            <button
              onClick={addPlayer}
              className="btn btn-secondary w-full mt-4"
            >
              プレイヤーを追加
            </button>
          )}

          <p className="text-sm text-gray-600 mt-2">
            {validPlayerCount}/{MIN_PLAYERS}-{MAX_PLAYERS}人
          </p>
        </div>

        {/* 通貨選択セクション */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">通貨設定</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrency('JPY')}
              className={`flex-1 btn ${currency === 'JPY' ? 'btn-primary' : 'btn-secondary'}`}
            >
              JPY (¥)
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`flex-1 btn ${currency === 'USD' ? 'btn-primary' : 'btn-secondary'}`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* 初期金額設定セクション */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">初期所持金</h2>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {QUICK_AMOUNTS.map(amount => (
              <button
                key={amount}
                onClick={() => handleAmountAdd(amount)}
                className="btn btn-secondary text-sm"
              >
                +{formatCurrency(amount, currency)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-gray-600">直接入力:</span>
            <input
              type="text"
              inputMode="numeric"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="金額を入力"
              className="input flex-1"
            />
          </div>

          <div className="bg-primary/10 rounded-lg p-4 mb-3">
            <p className="text-sm text-gray-600 text-center">現在の金額</p>
            <p className="text-2xl font-bold text-center text-primary">
              {formatCurrency(initialAmount, currency)}
            </p>
          </div>

          <button
            onClick={handleAmountReset}
            className="btn btn-secondary w-full text-sm"
          >
            リセット
          </button>
        </div>

        {/* ゲーム開始ボタン */}
        <button
          onClick={handleStartGame}
          disabled={validPlayerCount < MIN_PLAYERS}
          className="btn btn-primary w-full text-lg py-4"
        >
          ゲーム開始
        </button>

        {validPlayerCount < MIN_PLAYERS && (
          <p className="text-error text-sm text-center mt-2">
            最低{MIN_PLAYERS}人以上のプレイヤーが必要です
          </p>
        )}
      </div>
    </div>
  )
}
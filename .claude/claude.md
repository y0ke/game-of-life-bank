# 人生ゲーム銀行アプリ

人生ゲームで紙のお金を配る手間を省き、スマートフォンでタップとスワイプだけで簡単にお金の管理ができるWebアプリケーションです。

## プロジェクト概要

### 技術スタック
- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ保存**: LocalStorage
- **ホスティング**: GitHub Pages

### ディレクトリ構造
```
game-of-life-bank/
├── app/                    # Next.js App Router
│   ├── page.tsx           # メインページ（ゲーム状態管理）
│   ├── layout.tsx         # レイアウト
│   └── globals.css        # グローバルスタイル
├── components/            # Reactコンポーネント
│   ├── GameSetup.tsx     # ゲーム設定画面
│   ├── BankScreen.tsx    # 銀行画面（入出金・送金）
│   ├── TransactionHistory.tsx  # 取引履歴
│   └── GameResult.tsx    # ゲーム結果画面
├── types/                # TypeScript型定義
│   └── game.ts           # ゲーム関連の型
├── utils/                # ユーティリティ関数
│   ├── storage.ts        # LocalStorage操作
│   └── format.ts         # フォーマット関数
├── public/               # 静的ファイル
└── out/                  # ビルド出力ディレクトリ
```

## 開発ワークフロー

### 開発サーバーの起動
```bash
npm run dev
```

### ビルドとプレビュー
```bash
# プロダクションビルド
npm run build

# ローカルプレビュー（ポート8080）
cd out && python3 -m http.server 8080
```

### 重要な設定

#### next.config.js
- 本番環境では `basePath: '/game-of-life-bank'` が設定されています
- GitHub Pages用の静的エクスポート設定（`output: 'export'`）
- ローカルでのプレビューは開発サーバー（`npm run dev`）を推奨

#### LocalStorage
- ゲーム状態は自動的にLocalStorageに保存されます
- キー: `game-of-life-current-game`

## 主な機能

### ゲーム設定
- プレイヤー登録（2〜8人）
- 通貨選択（JPY/USD）
- 初期所持金設定

### 銀行機能
- **入出金管理**: 銀行からの受取・銀行への支払い
  - 改善されたUI: 「お金を受け取る」（緑）と「お金を支払う」（赤）で色分け
  - レスポンシブなボタンサイズ（タブレット・デスクトップで拡大）
- **プレイヤー間送金**: プレイヤー同士の送金機能
- **クイック金額ボタン**: よく使う金額をワンタップで入力
- **取引の取り消し**: 直前の取引をアンドゥ可能

### 管理機能
- 取引履歴の表示
- マイナス残高の警告表示
- データ永続化

### ゲーム終了
- 最終順位表示
- 統計情報（最高額、最低額、平均額、総資産）

## スタイリングガイドライン

### Tailwindカスタムクラス（globals.css）
- `.btn`: 基本ボタンスタイル
- `.btn-primary`, `.btn-secondary`, `.btn-success`: ボタンバリエーション
- `.transaction-type-btn`: 取引タイプボタン（入出金選択）
  - レスポンシブサイズ: モバイル100px、タブレット140px、デスクトップ160px
  - `.transaction-type-btn-income-active`: 受取選択時（緑）
  - `.transaction-type-btn-payment-active`: 支払選択時（赤）
- `.card`: カードコンポーネント
- `.input`: 入力フィールド

### デザイン原則
- モバイルファーストのレスポンシブデザイン
- タッチ操作に適した最小サイズ（44px）
- 視覚的フィードバック（ホバー、アクティブ状態）
- 色分けによる直感的なUI（緑＝受取、赤＝支払）

## トラブルシューティング

### ビルド後のプレビューでスタイルが表示されない
- `next.config.js`の`basePath`設定が原因の可能性
- ローカルプレビューは `npm run dev` を使用してください
- または `cd out && python3 -m http.server 8080` でプレビュー

### LocalStorageのクリア
ブラウザの開発者ツールで以下を実行:
```javascript
localStorage.removeItem('game-of-life-current-game')
```

## デプロイ

### GitHub Pages
1. リポジトリをGitHubにプッシュ
2. GitHub Actions で自動デプロイ
3. Settings > Pages でGitHub Pagesを有効化

## 最近の更新

- 銀行入出金ボタンのUI改善
  - わかりやすいラベル（「お金を受け取る」「お金を支払う」）
  - 色分けによる視覚的区別（緑/赤）
  - レスポンシブなボタンサイズ（タブレット・デスクトップ対応）
  - 補足テキストで取引方向を明示

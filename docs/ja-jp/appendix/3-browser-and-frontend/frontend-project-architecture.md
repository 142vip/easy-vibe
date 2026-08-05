# フロントエンドアーキテクチャ：モジュール分割とディレクトリ設計


::: tip 🎯 核心の問い
**シンプルな HTML ページから複雑なエンタープライズアプリケーションまで、異なる規模のプロジェクトに適切なアーキテクチャをどう選ぶか？** それはこう問うのと同じです：ワンルームマンションから大型ショッピングモールまで、ニーズに応じて異なる空間レイアウトをどう設計するか？良いアーキテクチャは、プロジェクトの成長とともに進化すべきであり、最初から過剰に設計されるべきではありません。
:::

---

## 1. アーキテクチャの進化：シンプルから複雑へ

### 1.1 三つの複雑さレベルの概要

フロントエンドプロジェクトのアーキテクチャは、プロジェクトの複雑さにマッチすべきです。**技術的複雑さ**と**ユーザー規模**の二つの次元で、プロジェクトを三つのレベルに分類します：

| レベル | 技術スタック | ユーザー規模 | 典型的なシーン | 中核的な関心事 |
|------|--------|----------|----------|------------|
| **入門** | HTML/CSS/JS | 個人/小チーム | 個人ブログ、ランディングページ、シンプルなツール | 迅速な公開、シンプルな保守 |
| **中級** | Vue/React + ビルドツール | 中小企業 | 管理システム、EC フロントエンド、SaaS | コンポーネントの再利用、状態管理 |
| **エンタープライズ** | フレームワーク + マイクロフロントエンド/SSR | 大規模アプリ | 大規模プラットフォーム、複雑なビジネスシステム | パフォーマンス最適化、チーム協力、スケーラビリティ |

::: tip 💡 どう選ぶか？
**過剰設計しないこと！** 多くのプロジェクトはシンプルな HTML から始まり、ニーズの成長に伴って徐々にフレームワークやツールを導入していきます。

- 個人プロジェクト → 入門レベル
- スタートアップの MVP → 入門または中級レベル
- 企業管理システム → 中級レベル
- 大規模インターネットプラットフォーム → エンタープライズレベル
:::

---

## 2. 入門レベル：HTML/CSS/JS プロジェクト

### 2.1 適用シーン

- 個人ブログ、履歴書ページ
- 製品ランディングページ
- シンプルなツールページ（計算機、変換ツールなど）
- プロトタイプ検証、クイックデモ

### 2.2 推奨ディレクトリ構造

```
my-simple-project/
├── index.html              # ホームページ
├── about.html              # 概要ページ（必要な場合）
├── css/
│   ├── reset.css           # リセットスタイル
│   ├── variables.css       # CSS 変数（色、フォントなど）
│   ├── components.css      # コンポーネントスタイル（ボタン、カードなど）
│   └── main.css            # メインスタイルファイル
├── js/
│   ├── utils.js            # ユーティリティ関数
│   ├── api.js              # シンプルな API 呼び出し
│   └── main.js             # メインロジック
├── assets/
│   ├── images/             # 画像リソース
│   └── fonts/              # フォントファイル
└── README.md               # プロジェクト説明
```

### 2.3 コード構成の原則

**HTML**：セマンティックタグ、明確な構造

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>私の個人ブログ</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">ホーム</a>
      <a href="about.html">概要</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>記事タイトル</h1>
      <p>記事の内容...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 私のブログ</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS**：CSS 変数でテーマを管理

```css
/* variables.css */
:root {
  --primary-color: #3498db;
  --text-color: #333;
  --bg-color: #fff;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --font-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* components.css - 再利用可能なコンポーネントスタイル */
.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
}

.card {
  padding: var(--spacing-md);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

**JavaScript**：モジュール化された構成（ES6 モジュールまたはシンプルな分割を使用）

```javascript
// utils.js
const utils = {
  // DOM 操作の簡略化
  $(selector) {
    return document.querySelector(selector);
  },

  // シンプルなデバウンス
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // ローカルストレージのラッパー
  storage: {
    get(key) {
      return JSON.parse(localStorage.getItem(key) || 'null');
    },
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

// main.js
document.addEventListener('DOMContentLoaded', () => {
  // ページ初期化ロジック
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 ベストプラクティス

✅ **推奨**：
- セマンティック HTML タグを使用する
- CSS 変数で色と間隔を管理する
- 画像の圧縮と遅延読み込み
- 基本的な SEO メタタグを追加する

❌ **避けるべきこと**：
- インラインスタイル（`style="..."`）
- グローバル変数の汚染
- 重複コード（コピペ）

---

## 3. 中級レベル：Vue/React フレームワークプロジェクト

### 3.1 適用シーン

- 企業管理システム（ERP、CRM、OA）
- EC フロントエンド/バックエンド
- SaaS アプリケーション
- 複雑なインタラクションが必要な Web アプリケーション

### 3.2 Vue プロジェクトの推奨構造

```
my-vue-project/
├── public/                     # 静的リソース
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # スタイル、画像、フォント
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # 共通コンポーネント
│   │   ├── common/             # グローバル共通（Button、Modal など）
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # ビジネスコンポーネント（UserCard など）
│   ├── views/                  # ページコンポーネント
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # ルーティング設定
│   │   └── index.js
│   ├── stores/                 # Pinia/Vuex 状態管理
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # API サービス
│   │   ├── request.js          # axios ラッパー
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # ユーティリティ関数
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # コンポーザブル関数
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # 定数定義
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # テストファイル
├── .env                        # 環境変数
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 React プロジェクトの推奨構造

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # 共通コンポーネント
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # ビジネスコンポーネント
│   ├── pages/                  # ページコンポーネント
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # カスタム Hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # API サービス
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Redux/Zustand 状態管理
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 主要概念の解説

#### コンポーネント設計の原則

**単一責任**：一つのコンポーネントは一つのことだけを行う

```vue
<!-- ❌ 悪い例：コンポーネントが多すぎることをしている -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- フォームの内容 -->
    </form>
    <table>
      <!-- データテーブル -->
    </table>
    <div class="charts">
      <!-- グラフ -->
    </div>
  </div>
</template>

<!-- ✅ 良い例：独立したコンポーネントに分割 -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### 状態管理の戦略

| 状態の種類 | 保存場所 | 例 |
|----------|----------|------|
| **グローバル状態** | Pinia/Redux | ユーザー情報、ログイン状態、テーマ設定 |
| **ページ状態** | ページコンポーネント | リスト検索条件、ページネーション情報 |
| **コンポーネント状態** | コンポーネント内部 | フォーム入力、モーダルの表示/非表示 |
| **サーバー状態** | TanStack Query/SWR | サーバーデータ、キャッシュ |

#### ディレクトリ構成アプローチの選択

**アプローチ 1：種類別に構成（小規模プロジェクト向け）**

```
src/
├── components/     # すべてのコンポーネント
├── views/          # すべてのページ
├── stores/         # すべての状態
└── services/       # すべてのサービス
```

**アプローチ 2：機能別に構成（中〜大規模プロジェクト向け）**

```
src/
├── features/
│   ├── auth/       # 認証機能のすべてのコード
│   ├── user/       # ユーザー機能のすべてのコード
│   └── product/    # 製品機能のすべてのコード
├── shared/         # 共有リソース
└── App.vue
```

::: tip 💡 どう選ぶか？
- プロジェクトのページ数 < 10 → 種類別に構成
- プロジェクトのページ数 > 20 → 機能別に構成
- チーム > 5 人 → 並行開発のために機能別に構成
:::

---

## 4. エンタープライズレベル：大規模アプリケーションアーキテクチャ

### 4.1 適用シーン

- 大規模インターネットプラットフォーム（EC、ソーシャル、コンテンツプラットフォーム）
- 複雑なエンタープライズアプリケーション
- マルチチーム協力が必要なプロジェクト
- パフォーマンスと保守性への要件が非常に高いプロジェクト

### 4.2 マイクロフロントエンドアーキテクチャ

プロジェクトの規模が大きくなり、単一のコードベースの保守が困難になった場合、**マイクロフロントエンド**アーキテクチャを検討できます。

```
大規模 EC プラットフォーム/
├── ベースアプリケーション（メインフレームワーク）
│   ├── トップナビゲーション
│   ├── サイドメニュー
│   ├── ユーザーセンター入口
│   └── サブアプリケーションコンテナ
├── 製品サブアプリケーション（独立デプロイ）
│   ├── 製品リスト
│   ├── 製品詳細
│   └── 製品管理
├── 注文サブアプリケーション（独立デプロイ）
│   ├── カート
│   ├── 注文リスト
│   └── 決済フロー
├── ユーザーサブアプリケーション（独立デプロイ）
│   ├── 個人センター
│   ├── 配送先住所
│   └── クーポン
└── マーケティングサブアプリケーション（独立デプロイ）
    ├── キャンペーンページ
    ├── クーポン配布
    └── ポイントモール
```

**マイクロフロントエンドの利点**：
- チームの自律性：各サブアプリケーションが独立して開発・デプロイ
- 技術スタックの自由：異なるチームが異なるフレームワークを使用可能
- 段階的なアップグレード：レガシーシステムを段階的にリファクタリング可能

### 4.3 エンタープライズレベルのディレクトリ構造

```
enterprise-project/
├── apps/                       # マイクロフロントエンドサブアプリケーション
│   ├── main/                   # ベースアプリケーション
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # 共有パッケージ（Monorepo）
│   ├── ui-components/          # 共通コンポーネントライブラリ
│   ├── utils/                  # ユーティリティ関数
│   ├── constants/              # 定数定義
│   └── types/                  # TypeScript 型
├── shared/                     # 共有設定
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # プロジェクトドキュメント
├── scripts/                    # ビルドスクリプト
└── package.json
```

### 4.4 パフォーマンス最適化アーキテクチャ

大規模アプリケーションではパフォーマンス最適化に注力する必要があります：

```
パフォーマンス最適化戦略/
├── ビルド時最適化
│   ├── コード分割（Code Splitting）
│   ├── ルート遅延読み込み
│   ├── Tree Shaking
│   └── アセット圧縮
├── 実行時最適化
│   ├── 仮想スクロール（長いリスト）
│   ├── 画像の遅延読み込み
│   ├── オンデマンドコンポーネントレンダリング
│   └── キャッシュ戦略
└── ネットワーク最適化
    ├── CDN アクセラレーション
    ├── HTTP キャッシュ
    ├── リソースの事前読み込み
    └── Service Worker
```

### 4.5 SSR/SSG アーキテクチャ

SEO や初回画面のパフォーマンスが必要なシーン向け：

| アプローチ | 適用シーン | 代表的なフレームワーク |
|------|----------|----------|
| **SSR** | SEO が必要、初回画面の高速レンダリング | Next.js、Nuxt.js |
| **SSG** | 静的コンテンツ、更新頻度が低い | Astro、VitePress |
| **ハイブリッド** | 一部静的、一部動的 | Next.js (ISR) |

---

## 5. ユーザー数規模別のアーキテクチャ選択

### 5.1 個人/小チーム（DAU < 1,000）

**特徴**：迅速なイテレーション、リソースが限定的、要件の変化が激しい

**推奨アーキテクチャ**：
- 技術スタック：Vue 3 + Vite または React + Vite
- 状態管理：Pinia または Zustand（軽量）
- UI ライブラリ：Element Plus / Ant Design
- デプロイ：Vercel / Netlify / クラウドサーバー

**ディレクトリ構造**：シンプルに種類別に構成

### 5.2 中規模企業（DAU 1k-100k）

**特徴**：複雑なビジネス、チーム協力、安定性が必要

**推奨アーキテクチャ**：
- 技術スタック：Vue 3 + TypeScript または React + TypeScript
- 状態管理：Pinia + コンポーザブル または Redux Toolkit
- UI ライブラリ：自社コンポーネントライブラリ + ビジネスコンポーネントライブラリ
- テスト：ユニットテスト + E2E テスト
- デプロイ：CI/CD パイプライン + Docker

**ディレクトリ構造**：機能別に構成、規範を確立

### 5.3 大規模プラットフォーム（DAU > 100k）

**特徴**：高トラフィック、マルチチーム協力、長期保守

**推奨アーキテクチャ**：
- 技術スタック：React/Vue + TypeScript（厳格モード）
- アーキテクチャ：マイクロフロントエンド + Monorepo
- 状態管理：細粒度の状態管理 + サーバー状態キャッシュ
- パフォーマンス：SSR/SSG + CDN + エッジコンピューティング
- モニタリング：フロントエンドモニタリング + エラートラッキング + パフォーマンス分析

**ディレクトリ構造**：Monorepo + マイクロフロントエンド

---

## 6. アーキテクチャ進化のロードマップ

### 6.1 進化の例：ブログからプラットフォームへ

```
ステージ 1：個人ブログ（HTML/CSS/JS）
    ↓ ニーズ：バックエンド管理が必要
ステージ 2：管理画面を追加（Vue/React + シンプルな構成）
    ↓ ニーズ：ユーザーシステム、コメント機能
ステージ 3：機能モジュール化（機能別に構成）
    ↓ ニーズ：マルチチーム協力、独立デプロイ
ステージ 4：マイクロフロントエンドアーキテクチャ（Monorepo）
```

### 6.2 アーキテクチャの判断基準

| シグナル | 説明 | 提案 |
|------|------|------|
| ビルド時間 > 5 分 | プロジェクトが大きすぎる | コード分割、マイクロフロントエンド |
| 頻繁にマージコンフリクト発生 | 協力が困難 | 機能別に構成、モジュール分割 |
| 一箇所の修正で別の箇所が壊れる | 結合が密 | リファクタリング、テストの強化 |
| 初回画面の読み込み > 3 秒 | パフォーマンスの問題 | 遅延読み込み、SSR、最適化 |
| 新規メンバーのオンボーディングが遅い | 構造が乱雑 | ドキュメント、規範、リファクタリング |

---

## 7. まとめ

::: tip 💡 核心思想
**アーキテクチャに銀の弾丸はない。適しているものが最善。**

- **小規模プロジェクト**は過剰設計せず、HTML/CSS/JS で十分
- **中規模プロジェクト**は規範を確立し、コンポーネント化、モジュール化
- **大規模プロジェクト**はマイクロフロントエンド、パフォーマンス最適化、チーム協力を検討

**次のポイントを覚えておきましょう**：
1. **段階的な進化**：シンプルに始め、ニーズに応じて成長させる
2. **統一された規約**：命名、構造、コードスタイルの一貫性を保つ
3. **ドキュメントを先行**：アーキテクチャの決定事項を記録し、引き継ぎを容易に
4. **定期的なリファクタリング**：技術的負債を適切なタイミングで返済する

**最終目標**：コードを整理された空間のように——規模に関わらず、効率的に機能させること。
:::

---

## 参考リソース

- [Vue スタイルガイド](https://vuejs.org/style-guide/)
- [React プロジェクト構成の推奨事項](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - アーキテクチャガイド](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [マイクロフロントエンドアーキテクチャ](https://micro-frontends.org/)

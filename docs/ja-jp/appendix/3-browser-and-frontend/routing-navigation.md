# ルーティング：SPAナビゲーションと履歴管理

::: tip 🎯 核心問題
**なぜ一部のウェブサイトはページを切り替えても画面が白くならず、アプリのようにスムーズなのか？** これがフロントエンドルーティングの魔法です。本章では、従来のウェブサイトの「ページをめくるような遷移」から、シングルページアプリケーションの「スライド切替」の世界へと入り、フロントエンドルーティングがどのようにユーザー体験を一段階引き上げるのかを理解します。
:::

---

## 1. フロントエンドルーティングの動機

### 1.1 従来のウェブサイトからシングルページアプリケーションへ：ユーザー体験の質的変化

初期のウェブブラウジング体験を振り返ると、リンクをクリックするたびに「完全なページめくり」のプロセスが発生していました。画面が一瞬白くなり、ローディングインジケーターが回り、ページ全体が再描画されるのです。ネットワークが遅ければ、ローディングインジケーターを数秒間眺めることになります。この体験は今では時代遅れですが、当時はそれが標準でした。

モダンフロントエンド開発はこのパターンを完全に変えました。フロントエンドルーティング技術を使うことで、ページ切り替えがスマホアプリのようにスムーズになります。白画面もローディングインジケーターもなく、ユーザーは「遷移」のプロセスをほとんど感じません。この体験の向上は魔法ではなく、フロントエンドルーティングシステムの成果です。

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 従来のウェブサイト（MPA）**
- リンクをクリック → ページ全体がリフレッシュ
- 各ページは独立した HTML ファイル
- ブラウザがすべてのリソースを再ダウンロード
- 「本をめくる」ような体験で、明確なページ遷移がある

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 シングルページアプリケーション（SPA）**
- リンクをクリック → リフレッシュなしで切り替え
- HTML エントリファイルは 1 つだけ
- 必要なデータのみダウンロード
- 「スライドショー」のような体験で、スムーズかつ自然

</div>
</div>

**これが「フロントエンドルーティング」が解決する核心問題です：ページをリフレッシュせずにビューの切り替えと URL の同期更新を実現すること。**

<RouteMatchingDemo />

### 1.2 ケース：なぜルーティングモードを理解する必要があるのか

あなたはこう言うかもしれません：「Vue Router や React Router を使えば設定するだけで動くのに、なぜこうした低レイヤーの原理を理解する必要があるのか？」 実際のエピソードを紹介すれば、なぜこの知識が重要なのかがわかるでしょう。

::: warning 小李のデプロイ失敗談
小李はフロントエンドの新人で、入社早々 Vue ベースの SPA 開発を任されました。ローカル開発ではすべて正常で、ルーティング遷移も非常にスムーズでした。しかしプロジェクトをテストサーバーにデプロイした後、問題が発生しました。ユーザーが特定のルート（例：`example.com/user/123`）に直接アクセスしたり、詳細ページでリフレッシュしたりすると、**404 Not Found** エラーが表示されたのです。

小李は困惑しました。ローカルでは正常にアクセスできるのに、なぜデプロイ後に 404 になるのか？ 彼は長時間調査し、サーバー設定の問題ではないかとさえ疑いました。

その後、先輩に相談したところ、先輩は一目で問題を見抜きました。小李は History モードを使っていましたが、サーバーに fallback が設定されていなかったのです。ユーザーが `/user/123` に直接アクセスすると、サーバーはこのパスに対応するファイルを探しますが、SPA のすべてのルートは実際には同じ `index.html` を指しています。解決策はシンプルで、サーバーにすべてのルートを `index.html` にフォールバックさせ、フロントエンドルーティングに後続の処理を任せるよう設定することです。

小李はこの経験から一つの教訓を得ました：**ルーティングモードの原理とサーバー設定要件を理解していなければ、エラーの原因すらわからず、ましてや問題解決などできない。**
:::

::: info 💡 核心的な示唆
フロントエンドルーティングは「ブラックマジック」ではありません。その動作原理を理解することで、デプロイ、パフォーマンス、SEO の問題が発生したときに迅速に特定し、的確に解決できます。さらに重要なのは、プロジェクトのアーキテクチャ設計時に、より賢明な選択ができるようになることです。いつ Hash モードを使い、いつ History モードを使うか、よくある落とし穴をどう回避するか。
:::

---

## 2. 核心概念：ルート、モード、ナビゲーション

具体的な実装に入る前に、いくつかの核心概念を明確にする必要があります。理解を深めるために、図書館の比喩を使ってそれらの関係を説明します。

::: tip 🤔 これらの概念とルーティングの関係は？
ルート、モード、ナビゲーションは、フロントエンドルーティングシステムの三本柱です。

Vue Router や React Router を使うと、フレームワークはあなたに代わって以下を処理します：
1. **ルートマッピング** → URL とコンポーネントの対応関係を定義
2. **モード選択** → Hash モードか History モードかを決定
3. **ナビゲーション制御** → ページ遷移、ブラウザの進む・戻るを処理

つまり、**この三つの概念を理解して初めて、ルーティングシステムが何をしているのか、なぜ特別な設定が必要な場合があるのか、なぜデプロイ時に問題が起こるのかがわかるのです。**
:::

### 2.1 図書館の比喩でルーティングシステムを理解する

図書館で本を探すことを想像してください。このプロセスはフロントエンドルーティングの動作原理と驚くほど似ています：

| 概念 | 📚 図書館の比喩 | 実際の役割 | 具体例 |
|------|-------------|----------|----------|
| **ルート（Route）** | 書架番号と書籍の対応関係 | URL とページコンポーネントのマッピング関係を定義 | `/user/123` パスが `UserDetail.vue` コンポーネントに対応 |
| **ルーター（Router）** | 図書館の案内システムと位置情報サービス | すべてのルートを管理し、ナビゲーション動作を処理する核心モジュール | Vue Router、React Router がルーター |
| **ルーティングモード** | 検索方法（カード目録 vs 電子システム） | URL の形式と低レイヤーの実装方式を決定 | Hash モードは `#` を使用、History モードは通常のパスを使用 |
| **ナビゲーション** | ある書架から別の書架へ歩くこと | 異なるページ間を切り替える動作 | リンククリック、プログラムによる遷移、ブラウザの進む・戻る |

::: tip 📊 この表から何が読み取れるか？
各行を解説します：

**ルート**：単なる「設定」であり、「どの URL がどのページに対応するか」をシステムに伝えます。図書館の書架番号が本の場所に対応するのと同じです。

**ルーター**：「管理者」であり、現在の URL に基づいて対応するコンポーネントを見つけてレンダリングします。図書館員があなたの提供した書架番号を元に本を見つけてくれるのと同じです。

**ルーティングモード**：「実装方式」であり、URL がどのように見えるか、低レイヤーでどの技術を使うかを決定します。図書館が紙の目録を使うか、電子検索システムを使うかのようなものです。

**ナビゲーション**：「動作」であり、ユーザーがページ切り替えをトリガーするアクションです。図書館内で A エリアから B エリアへ歩くのと同じです。

この四者の違いを理解することは非常に重要です：**ルートは静的設定、ルーターは動的管理者、モードは技術選定、ナビゲーションはユーザー行動です。**
:::

### 2.2 ルート（Route）：URL とコンポーネントのマッピング契約

ルートとは、本質的に「契約」であり、ある URL にアクセスしたときにどのような内容を表示すべきかを規定します。Vue Router における典型的なルート設定は次のようになります：

```javascript
const routes = [
  {
    path: '/',           // URL パス
    component: Home      // 対応するコンポーネント
  },
  {
    path: '/user/:id',   // パラメータ付き動的ルート
    component: UserDetail,
    children: [          // ネストルート
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**疑問に思うかもしれません：なぜ単に `<a>` タグで遷移せず、わざわざルートを使うのか？**

答えは「シングルページアプリケーション」の本質にあります：SPA は 1 つの HTML ページしか持たず、すべてのページ切り替えは実際には同じページ内でコンポーネントを差し替えているだけです。もし従来の `<a href="/user/123">` を使うと、ブラウザは実際に `/user/123` というパスをリクエストし、ページのリフレッシュや 404 エラーを引き起こします。ルートの役割はこれらの遷移動作をインターセプトし、JavaScript で動的にコンポーネントを差し替えることで、リフレッシュなしの切り替えを実現することです。

::: details 🔧 ルート設定のよくあるパターン
**静的ルート**（最もシンプル）：
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**動的ルート**（パラメータ付き）：
```javascript
{ path: '/user/:id', component: UserDetail }
// /user/123、/user/abc などにマッチ
// コンポーネント内で route.params.id によりパラメータを取得可能
```

**ネストルート**（親子関係）：
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // 親コンポーネント
  children: [
    { path: 'profile', component: UserProfile },   // 実際のパス /user/:id/profile
    { path: 'posts', component: UserPosts }        // 実際のパス /user/:id/posts
  ]
}
```

**ワイルドカードルート**（404 ページ）：
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// 定義されていないすべてのルートにマッチ
```
:::

### 2.3 ルーティングモード：Hash vs History の本質的な違い

フロントエンドルーティングには二つの主流な実装モードがあります：Hash モードと History モードです。これらは URL の表現形式、低レイヤーの実装、互換性などの面で本質的な違いがあります。

::: tip 🤔 なぜ二つのモードが必要なのか？
これは実際には歴史的な理由と技術的なトレードオフの結果です。

**Hash モード**は最も初期のフロントエンドルーティング実装方式で、URL の hash 部分（`#` 以降の内容）を利用します。hash の変更はページリフレッシュをトリガーせず、互換性も非常に優れています（IE8 でもサポート）。

**History モード**は HTML5 登場後の「標準的なやり方」で、History API が提供する `pushState` と `replaceState` メソッドを利用し、URL をより「普通」に（`#` なしに）できますが、サーバー側の設定協力が必要です。

例えるなら：Hash モードは「部屋のドアに付箋を貼る」ようなもの（部屋の構造に影響しない）、History モードは「部屋番号を付け直す」ようなもの（番号システムの更新が必要）です。
:::

| 特性 | Hash モード | History モード |
|------|-----------|--------------|
| **URL 例** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **実装原理** | `hashchange` イベントを監視 | History API（`pushState`、`replaceState`）を使用 |
| **サーバー設定** | 不要（hash はサーバーに送信されない） | **index.html への fallback 設定が必須** |
| **ブラウザ互換性** | IE8+（ほぼすべてのブラウザ） | IE10+（モダンブラウザ） |
| **SEO 親和性** | 低い（検索エンジンが hash を無視する可能性あり） | 良好（URL 構造が明確） |
| **ユーザー体験** | URL に `#` があり、「アンカー遷移」のように見える | URL が美しく、従来のウェブサイトに近い |
| **デプロイ難易度** | 低い、特別な設定不要 | 高い、サーバーを正しく設定する必要あり |

<HashVsHistoryDemo />

::: tip 📊 この表から何が読み取れるか？
各行を解説します：

**URL 例**：Hash モードの URL には明確な `#` があり、ユーザーは一目でこれが「シングルページアプリケーション」だとわかります。History モードの URL は従来のウェブサイトと同じで、より「プロフェッショナル」に見えます。

**実装原理**：Hash モードは `hashchange` イベント（hash 変更時に発火）を監視します。History モードは HTML5 の History API を使い、ページが遷移したように「見せかけ」ますが、実際にはリフレッシュしません。

**サーバー設定**：これが最もハマりやすいポイントです！ Hash モードの `#` 以降の内容はサーバーに送信されないため、サーバーはルートの存在を知る必要がありません。しかし History モードの完全なパスはサーバーに送信されるため、サーバーが正しく設定されていないと 404 が返ります。

**SEO 親和性**：検索エンジンのクローラーは通常 JavaScript を実行しないため、Hash モードの URL は無視される可能性があります。History モードの URL 構造は明確で、インデックスされやすくなります。

**デプロイ難易度**：Hash モードは「箱から出してすぐ使える」一方、History モードは運用知識（Nginx、Apache など）が必要です。これが多くの個人プロジェクトがデフォルトで Hash モードを使う理由でもあります。
:::

---

## 3. 進化の道筋：従来のウェブサイトからモダンルーティングへ

概念をいろいろ説明しましたが、実際の事例を見てみましょう：ある EC サイトがどのように「従来のマルチページ」から「モダンなシングルページアプリケーションルーティング」へと段階的に進化したか。この事例を通じて、フロントエンドルーティングが何を解決したのかがより直感的に理解できるでしょう。

::: tip 📖 背景知識：MPA、SPA、SSR とは？
事例に入る前に、これらの用語を簡単に紹介します：

- **MPA（Multi-Page Application）**：**マルチページアプリケーション**、従来のウェブサイト開発方式。各ページは独立した HTML ファイルで、ページ遷移時にページ全体がリフレッシュされる。
- **SPA（Single-Page Application）**：**シングルページアプリケーション**、モダンフロントエンドの主流方式。HTML エントリは 1 つだけで、ページ切り替えは JavaScript で動的にコンポーネントを差し替え、リフレッシュなし。
- **SSR（Server-Side Rendering）**：**サーバーサイドレンダリング**、サーバー側で完全な HTML を生成。SPA と MPA の利点を組み合わせ、初回表示が速く、SEO にも優れる。

**簡単に理解するなら**：MPA は「ページをめくるたびに描き直す」、SPA は「同じ紙の上で消して描き直す」、SSR は「あらかじめ紙に描いてから渡す」です。
:::

### 3.1 進化の全景図

以下の表はフロントエンドアプリケーションの四つの進化段階を示しています。ルーティング技術がどのように段階的に発展してきたかがわかります：

| 段階 | アプリケーションタイプ | ルーティング実装 | 核心的特徴 | ユーザー体験 |
|------|---------|---------|---------|---------|
| **段階一：従来のマルチページ** | MPA | サーバーサイドルーティング | 各ページが独立した HTML ファイル | 遷移のたびにリフレッシュ |
| **段階二：初期 SPA** | SPA（Hash モード） | Hash ルーティング | URL に `#` 付き、互換性良好 | リフレッシュなし、ただし URL は美しくない |
| **段階三：モダン SPA** | SPA（History モード） | History ルーティング | URL が美しい、サーバー設定が必要 | スムーズ、URL が従来のウェブサイトに近い |
| **段階四：ハイブリッドレンダリング** | SPA + SSR | アイソモーフィックルーティング | 初回表示はサーバーサイドレンダリング、以降はフロントエンドルーティング | 初回表示が速い、SEO 良好、体験スムーズ |

::: tip 📊 この表から何が読み取れるか？
各行を解説します：

**段階一 → 段階二**：「リフレッシュあり」から「リフレッシュなし」へ、これは質的飛躍です。ユーザーは初めて「アプリのような」スムーズさを体験しましたが、代償として URL に `#` が付き、ややプロフェッショナルさに欠けます。

**段階二 → 段階三**：「使える」から「快適」へ。History モードは URL を美しくし、従来のウェブサイトにより近づけましたが、代償としてデプロイの複雑さが増しました（サーバー設定が必要）。

**段階三 → 段階四**：「体験が良い」から「体験が良い + SEO も良い」へ。SSR は SPA の SEO 問題を解決し、初回表示速度も向上しましたが、実装の複雑さは大幅に上がりました。

**まとめ**：フロントエンドルーティングの進化は単に「切り替えが速くなった」だけではなく、**アプリケーションアーキテクチャ全体のアップグレード**です。サーバー主導からフロントエンド主導へ、そしてフロントエンドとバックエンドの融合へと、各段階でユーザー体験、開発コスト、SEO など複数の次元のバランスを取っています。
:::

### 3.2 段階一：従来のマルチページアプリケーション——毎回リフレッシュ

なぜ「従来のマルチページアプリケーション」と呼ばれるのでしょうか？ この段階では各ページが独立した HTML ファイルであり、ページ遷移時にブラウザがすべてのリソース（HTML、CSS、JS）を再ダウンロードするからです。これは最も初期の Web 開発方式で、現在でも多くの従来型ウェブサイトがこのように動作しています。

この段階では、EC サイト「買得多」は典型的な MPA アーキテクチャを採用していました：

**開発方式**：
- **ルーティング実装**：サーバーサイドルーティング、各ページはサーバー上の 1 つの HTML ファイルに対応
- **ページ遷移**：`<a href="/products/123">` を使用し、完全なページリフレッシュをトリガー
- **状態管理**：遷移のたびに以前のページ状態（スクロール位置、フォーム内容など）が失われる

**この段階の特徴**：
- ✅ **利点**：実装がシンプル、検索エンジンに優しい（SEO 良好）、ブラウザの進む・戻るが箱から出してすぐ使える
- ❌ **欠点**：遷移のたびにリフレッシュ、ユーザー体験が悪い、サーバー負荷が大きい（同じリソースを繰り返し読み込む）

::: details 当時のプロジェクト構成とアクセスフロー
**プロジェクト構成**（サーバーサイドレンダリングの典型的な構成）：
```
server/
├── views/              # HTML テンプレート
│   ├── index.html      # トップページテンプレート
│   ├── products.html   # 商品一覧ページテンプレート
│   └── product.html    # 商品詳細ページテンプレート
├── public/             # 静的リソース
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # サーバーエントリポイント
```

**ページ遷移フロー**：
```
1. ユーザーがリンクをクリック <a href="/products/123">
       ↓
2. ブラウザがサーバーに GET リクエストを送信
       ↓
3. サーバーが product.html をレンダリングし、データを挿入
       ↓
4. 完全な HTML ページを返却
       ↓
5. ブラウザが HTML を解析、CSS/JS をダウンロード、ページを描画
       ↓
6. ユーザーがページを表示（このプロセスは通常 1〜3 秒かかる）
```

**ユーザーの痛点**：
- リンクをクリックするとページが白くなり、待ち時間が長い
- 遷移のたびに同じ CSS/JS ファイルを再ダウンロード
- ブラウザの進む・戻るでページが再読み込みされる
- 複雑なページ状態（フィルタ条件、スクロール位置など）を保存できない
:::

この開発方式は小規模なウェブサイトなら許容できますが、サイト規模が大きくなり、ユーザーの体験要求が高まるにつれて、これらの問題はユーザー維持率やコンバージョン率に深刻な影響を及ぼし始めます。

### 3.3 段階二：初期シングルページアプリケーション——Hash ルーティングの時代

従来のマルチページアプリケーションの問題が一定のレベルまで蓄積したとき、「買得多」チームはフロントエンドルーティングを導入し、シングルページアプリケーションアーキテクチャへのアップグレードを決断しました。これは重要な転換点です——「サーバー主導」から「フロントエンド主導」へ。

しかしこの段階にも代償がありました：URL に `#` が付き、プロフェッショナルさに欠け、検索エンジンのインデックスにも問題がありました。

**開発方式**：
- **ルーティング実装**：Hash ルーティング、URL の `#` 部分を利用
- **ページ遷移**：JavaScript がリンククリックをインターセプトし、動的にコンポーネントを差し替え
- **状態管理**：ページ状態はクライアント側で保持され、再読み込み不要

**この段階の特徴**：
- ✅ **利点**：リフレッシュなしの切り替え、ユーザー体験がスムーズ、サーバー負荷が減少
- ❌ **欠点**：URL に `#` 付き、SEO に不利、初回読み込みが遅い

::: details Hash ルーティングの実装方式
**プロジェクト構成**（初期 SPA の典型的な構成）：
```
project/
├── index.html          # 唯一の HTML エントリファイル
├── css/
│   └── app.css         # すべてのスタイルを 1 ファイルにパッケージ
├── js/
│   ├── router.js       # シンプルなルーティング実装
│   ├── views/          # ページコンポーネント
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # アプリケーションエントリポイント
└── server.js           # シンプルな静的ファイルサーバー
```

**Hash ルーティングの核心コード**：
```javascript
// router.js - 簡略化した Hash ルーティング実装
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // hash 変化を監視
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // 初期化
    this.matchRoute()
  }

  matchRoute() {
    // 現在の hash を取得（# を除去）
    const hash = window.location.hash.slice(1) || '/'
    const route = this.routes.find(r => r.path === hash)

    if (route) {
      this.render(route.component)
    } else {
      this.render(NotFoundComponent)
    }
  }

  render(component) {
    const app = document.getElementById('app')
    app.innerHTML = component.template()
    component.mount?.(app)
  }

  navigate(path) {
    window.location.hash = path
  }
}

// 使用
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// ナビゲーション
router.navigate('/products/123')
```

**URL 形式**：
- トップページ：`https://example.com/#/`
- 商品一覧：`https://example.com/#/products`
- 商品詳細：`https://example.com/#/products/123`

**もたらされた改善**：
1. **ユーザー体験の向上**：ページ切り替えがリフレッシュなしでスムーズかつ自然
2. **サーバー負荷の減少**：HTML/CSS/JS を一度だけ読み込み、以降はデータのみリクエスト
3. **状態の保持**：スクロール位置、フォーム内容などの状態をページ切り替え時にも保持可能
4. **オフライン対応**：Service Worker と組み合わせてオフラインアクセスが可能

**新たな痛点**：
1. **URL が美しくない**：`#` があるため URL が「アンカー遷移」のように見え、プロフェッショナルさに欠ける
2. **SEO 問題**：検索エンジンのクローラーが hash 以降の内容を無視する可能性があり、ページがインデックスされない
3. **初回読み込みが遅い**：すべての JavaScript を一度に読み込む必要があり、初回表示時間が長い
:::

### 3.4 段階三：モダンシングルページアプリケーション——History ルーティングが主流に

Hash ルーティングの痛点（URL が美しくない、SEO が悪い）は長年開発者を悩ませてきました。HTML5 の普及とブラウザ互換性の向上に伴い、History ルーティングが徐々に主流になりました。

History ルーティングは HTML5 History API を利用し、URL を「普通」に（`#` なしに）できますが、代償としてサーバー側の設定協力が必要です。

**開発方式**：
- **ルーティング実装**：History ルーティング、`pushState` と `replaceState` を使用
- **ルーティングライブラリ**：Vue Router、React Router などの成熟したルーティングライブラリ
- **サーバー設定**：すべてのルートを `index.html` にフォールバックするようサーバーを設定する必要あり

**この段階の特徴**：
- ✅ **利点**：URL が美しい、SEO に優しい、ユーザー体験がスムーズ
- ❌ **欠点**：デプロイに特別な設定が必要、サーバー側の協力が必須

::: details History ルーティングの実装とデプロイ設定
**プロジェクト構成**（モダン SPA の典型的な構成）：
```
project/
├── public/
│   └── index.html          # 唯一の HTML エントリ
├── src/
│   ├── router/
│   │   └── index.js        # ルーティング設定
│   ├── views/              # ページコンポーネント
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # ビルド設定
```

**Vue Router 設定例**：
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // History モード
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**URL 形式**：
- トップページ：`https://example.com/`
- 商品一覧：`https://example.com/products`
- 商品詳細：`https://example.com/products/123`

**重要：Nginx 設定**（デプロイ時に必須）：
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # 重要な設定：すべてのルートを index.html に転送
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**なぜこの設定が必要なのか？**

```
シナリオ：ユーザーが https://example.com/products/123 に直接アクセス

❌ 設定がない場合：
1. ブラウザがサーバーに /products/123 をリクエスト
2. Nginx がファイルシステムで /products/123 を検索
3. ファイルが見つからないため、404 を返す

✅ try_files が設定されている場合：
1. ブラウザがサーバーに /products/123 をリクエスト
2. Nginx がファイルを検索 → 存在しない
3. try_files ルールに従い /index.html にフォールバック
4. ブラウザが index.html を読み込み
5. Vue Router が制御を引き継ぎ、/products/123 を解析
6. ProductDetail コンポーネントをレンダリング
7. ページが正常に表示される！
```

**Hash モードとの差異比較**：
| 比較項目 | Hash モード | History モード |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| サーバー設定 | 不要 | **必須** |
| 直接アクセス | ✅ 正常に動作 | ❌ サーバーサポートが必要 |
| SEO | ⚠️ 悪い | ✅ 良好 |
:::

### 3.5 段階四：ハイブリッドレンダリング——SPA + SSR の究極ソリューション

History ルーティングが成熟した後、チームはさらに深い問題に注目し始めました：SPA のスムーズな体験を保ちつつ、SEO と初回読み込みの遅さの問題をどう解決するか？

この段階の核心は「アイソモーフィックレンダリング」です——初回表示はサーバーサイドでレンダリングし（SEO 良好、読み込み高速）、後続の操作はフロントエンドルーティングで行います（体験スムーズ）。

**開発方式**：
- **フレームワーク選択**：Next.js（React）、Nuxt.js（Vue）
- **レンダリング戦略**：サーバーサイドレンダリング + クライアントサイドハイドレーション（Hydration）
- **ルーティングモード**：History モード（サーバー側で設定済み）

**この段階の特徴**：
- ✅ **利点**：初回表示が速い、SEO 良好、後続の操作もスムーズ
- ❌ **欠点**：実装の複雑さが高い、サーバー実行環境が必要

::: details ハイブリッドレンダリングの動作原理
**ページ読み込みフロー**：
```
1. ユーザーが /products/123 にアクセス
       ↓
2. サーバーがリクエストを受信
       ↓
3. サーバーが ProductDetail コンポーネントをレンダリング → 完全な HTML を生成
       ↓
4. HTML をブラウザに返却（完全なコンテンツを含む）
       ↓
5. ブラウザがコンテンツを素早く表示（初回表示が高速）
       ↓
6. JavaScript を読み込み、「ハイドレーション（Hydration）」を実行
       ↓
7. 以降のページ切り替えはフロントエンドルーティングが担当（リフレッシュなし）
```

**従来の SPA vs SSR の初回表示比較**：

| 比較項目 | 従来の SPA | SSR |
|--------|---------|-----|
| 初回表示内容 | 白画面 → JS 読み込み → レンダリング | 即座にコンテンツを表示 |
| SEO | クローラーが内容を認識できない可能性あり | クローラーが完全な HTML を認識可能 |
| 初回表示時間 | 遅い（JS の読み込みが必要） | 速い（HTML に内容が既に含まれている） |
| 後続の操作 | スムーズ（フロントエンドルーティング） | スムーズ（フロントエンドルーティング） |
:::

---

## 4. 原理の深掘り：ルーティングはどのように動作するのか

実際の事例を理解したところで、フロントエンドルーティングの動作原理を深く見ていき、Hash と History の二つのモードが具体的に何が異なるのかを理解しましょう。

<RouterArchitectureDemo />

### 4.1 Hash モードの動作原理

Hash モードの核心は、URL の `hash` 部分（`#` 以降の内容）を利用することです。hash には二つの重要な特性があります：

1. **hash の変更はページリフレッシュをトリガーしない**
2. **hash の変更はブラウザの履歴スタックに記録される**

つまり、ページをリフレッシュせずに URL を変更でき、同時にブラウザの進む/戻るボタンも正常に動作します。

**ワークフロー**：

```
ユーザーがリンクをクリック <a href="#/user/123">
       ↓
ブラウザが URL を更新（ページリフレッシュなし）
https://example.com/#/user/123
       ↓
hashchange イベントが発火
       ↓
ルーティングリスナーがイベントをキャプチャ
       ↓
hash 値を解析 → /user/123
       ↓
ルート設定とマッチング → UserDetail コンポーネントを発見
       ↓
コンポーネントをページにレンダリング
```

**核心コード実装**：

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // hash 変化を監視
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // 初期読み込み
    this.loadRoute()
  }

  loadRoute() {
    // 現在の hash を取得、先頭の # を除去
    const hash = window.location.hash.slice(1) || '/'
    const route = this.matchRoute(hash)

    if (route) {
      this.render(route.component)
    }
  }

  matchRoute(path) {
    return this.routes.find(r => r.path === path)
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }

  push(path) {
    window.location.hash = path
  }
}
```

::: tip 💡 Hash モードの利点
- **互換性が高い**：IE8+ でサポートされ、ほぼすべてのブラウザで利用可能
- **デプロイが簡単**：サーバー設定不要、箱から出してすぐ使える
- **実装がシンプル**：`hashchange` イベントを監視するだけでよい
:::

### 4.2 History モードの動作原理

History モードは HTML5 History API を利用し、`pushState`、`replaceState` などのメソッドを提供します。これによりページをリフレッシュせずに URL を変更できます。

**核心 API**：

```javascript
// 新しい履歴レコードを追加
history.pushState(state, title, url)
// 例：history.pushState({id: 123}, 'ユーザー詳細', '/user/123')

// 現在の履歴レコードを置換
history.replaceState(state, title, url)

// 履歴変化を監視（進む/戻るボタン）
window.addEventListener('popstate', (event) => {
  // event.state には pushState 時に渡された state が含まれる
})
```

**ワークフロー**：

```
ユーザーがリンクをクリック <a href="/user/123">
       ↓
JavaScript がクリックイベントをインターセプト
event.preventDefault()
       ↓
history.pushState を呼び出し
history.pushState({id: 123}, 'ユーザー詳細', '/user/123')
       ↓
URL を更新（ページリフレッシュなし）
https://example.com/user/123
       ↓
ルートマッチングとコンポーネントレンダリング
       ↓
ユーザーがブラウザの戻るボタンをクリック
       ↓
popstate イベントが発火
       ↓
ルーティングリスナーがイベントをキャプチャ
       ↓
新しい URL に基づいて対応するコンポーネントをレンダリング
```

**核心コード実装**：

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // すべてのリンククリックをインターセプト
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // ブラウザの進む/戻るを監視
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // 初期読み込み
    this.loadRoute()
  }

  loadRoute() {
    const path = window.location.pathname
    const route = this.matchRoute(path)

    if (route) {
      this.render(route.component)
    }
  }

  push(path) {
    history.pushState({}, '', path)
    this.loadRoute()
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }
}
```

::: warning ⚠️ History モードの落とし穴
History モードの最大の問題は：**ユーザーが直接 URL にアクセスしたりページをリフレッシュしたりすると、ブラウザがサーバーにリクエストを送信することです**。

サーバーが正しく設定されていない場合、404 が返ります。解決策は、すべてのルートを `index.html` にフォールバックするようサーバーを設定し、フロントエンドルーティングに後続の処理を任せることです。
:::

---

## 5. ルーティング設定実践ガイド

理論はほぼ説明しました。以下は実際のプロジェクトでよく使われるルーティング設定パターンとベストプラクティスです。

### 5.1 基本ルーティング設定

::: details Vue Router 完全設定例

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true  // ルートパラメータを props として渡す
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // スクロール動作：戻る時はスクロール位置を保持、それ以外はトップにスクロール
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

:::

### 5.2 ルート遅延読み込み：初回表示パフォーマンスの向上

ルート遅延読み込みとは、すべてのコンポーネントを一度に読み込むのではなく、ルートにアクセスしたときだけ対応するコンポーネントを読み込むことです。これにより初回表示時間を大幅に短縮できます。

```javascript
// ❌ すべてのコンポーネントを一度に読み込む（初回表示が遅い）
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ 遅延読み込み（初回表示が速い）
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 遅延読み込みの原理
`import('@/views/Home.vue')` を使うと、Webpack/Vite はこのコンポーネントを別ファイルとしてパッケージします。ユーザーがこのルートにアクセスしたときだけ、対応するファイルがダウンロードされます。

例えるなら：遅延読み込みは「必要なときに注文する」ようなもので、一度にすべての料理をテーブルに並べるのではありません。これにより初回表示時間を短縮し、ユーザー体験を向上させます。
:::

### 5.3 ルートガード：権限制御とナビゲーションインターセプト

ルートガードはルート遷移の前後にロジックを実行でき、権限検証、ページタイトル設定、データプリフェッチなどのシナリオでよく使われます。

```javascript
// グローバル前置ガード
router.beforeEach(async (to, from, next) => {
  // ページタイトルを設定
  document.title = to.meta.title || 'My App'

  // 権限検証
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// グローバル後置フック
router.afterEach((to, from) => {
  // ページアクセス統計
  analytics.trackPageView(to.path)
})

// ルートレベルガード
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // このルート専用のロジック
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 ルートガードのよくある用途
- **権限検証**：ユーザーが特定のページにアクセスする権限があるかチェック
- **ページタイトル**：document.title を動的に設定
- **データプリフェッチ**：ページに入る前にデータを事前取得
- **プログレスバー**：ページ切り替えのプログレスバーを表示
- **アクセス統計**：ページアクセス状況を記録
:::

---

## 6. よくある問題と解決策

### 6.1 デプロイ後のリフレッシュで 404

**問題**：ローカル開発では正常だが、サーバーにデプロイ後、特定のルートに直接アクセスしたりページをリフレッシュしたりすると 404 が表示される。

**原因**：History モードでは、サーバーが URL をファイルパスとして検索するが、SPA のすべてのルートは実際には `index.html` を指している。

**解決策**：サーバーの fallback を設定する。

```nginx
# Nginx 設定
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Apache 設定（.htaccess）
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 ルートパラメータの消失

**問題**：ページをリフレッシュすると、ルートパラメータ `$route.params` が消失する。

**原因**：ルートパラメータはルート遷移時のみ存在し、リフレッシュ後は URL から再解析する必要がある。

**解決策**：

```javascript
// ❌ 誤った方法：created 時のみパラメータを取得
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ 正しい方法：ルート変化を監視
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 ページ切り替え時のスクロール位置異常

**問題**：ページ切り替え後、スクロール位置がリセットされない、または戻る時に前の位置が保持されない。

**解決策**：ルートの `scrollBehavior` を設定する。

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 戻る時はスクロール位置を保持
    if (savedPosition) {
      return savedPosition
    }
    // アンカーにジャンプ
    if (to.hash) {
      return { el: to.hash }
    }
    // それ以外はトップにスクロール
    return { top: 0 }
  }
})
```

---

## 7. まとめ

表でフロントエンドルーティングの核心概念を振り返りましょう：

| 概念 | 一言で説明 | 解決する問題 | 代表的なソリューション |
|------|-----------|-----------|----------|
| **ルート** | URL とコンポーネントのマッピング関係 | 異なる URL にアクセスしたときに異なる内容を表示 | Vue Router、React Router |
| **Hash モード** | URL hash を利用したルーティング | 互換性が高く、デプロイが簡単 | Vue Router Hash モード |
| **History モード** | History API を利用したルーティング | URL が美しく、SEO 良好 | Vue Router History モード |
| **ルート遅延読み込み** | 必要なときにルートコンポーネントを読み込み | 初回表示時間の短縮 | `() => import('./Page.vue')` |
| **ルートガード** | ルート遷移前後のフック関数 | 権限制御、データプリフェッチ | `beforeEach`、`beforeEnter` |
| **動的ルート** | パラメータ付きルート | 単一ではなく一連のパスにマッチ | `/user/:id` |

::: info 最後に
フロントエンドルーティングはモダンシングルページアプリケーションの核心技術の一つです。初期の Hash モードから現在主流の History モードまで、ルーティング技術は進化を続け、ユーザーによりスムーズなブラウジング体験を提供しています。

ルーティングの原理とモードを理解することで、デプロイ、パフォーマンス、SEO の問題が発生したときに迅速に特定し、的確に解決できます。さらに重要なのは、プロジェクトのアーキテクチャ設計時により賢明な選択ができるようになることです。いつ Hash を使い、いつ History を使うか、よくある落とし穴をどう回避するか。

この記事がフロントエンドルーティングの全体的な理解を構築する助けになれば幸いです。実際のプロジェクトでルーティング関連の問題に遭遇したとき、どこから手をつけ、どのように特定し、どう解決すればよいかがわかるようになるでしょう。
:::
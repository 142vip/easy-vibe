# HTML/CSS レイアウト基礎

::: tip 🎯 核心問題
**Webページはどうやって作られるのか？なぜテキストだけのページもあれば、アプリのように操作できるページもあるのか？** この問題はWeb開発の3つの基盤へと導き、すべてのWebページの背後にある構造を理解させてくれる。
:::

---

## 1. HTML、CSS、JavaScriptの概要

### 1.1 静的Webページから動的アプリケーションへ

街で見かける**ポスター**を想像してみてほしい。見ることはできるが、双方向のやり取りはできない——ポスターは見たからといって内容が変わることはないし、どこかをクリックしたからといって情報がポップアップすることもない。

初期のWebページはまさにこの「電子ポスター」だった。見ることしかできず、変更できず、内容は固定されていた。

しかし現代のWebページはまったく異なる。まるで**デスクトップアプリケーション**のようだ。

- クリック、ドラッグ、入力、アップロードができる
- 操作に応じてページがリアルタイムに変化する
- ソフトウェアのように複雑なタスク（例：オンライン動画編集）をこなせる

**この変化の核心が、Web技術の3つの基盤「HTML + CSS + JavaScript」である。**

### 1.2 家を建てるという比喩

| 技術           | 🏠 家の比喩               | 実際の役割           | 具体例                                   |
| -------------- | ------------------------ | -------------------- | ---------------------------------------- |
| **HTML**       | 家の**構造と材料**       | Webページの内容と階層を定義 | これは壁、これは窓、これは部屋             |
| **CSS**        | 家の**内装と外観**       | Webページのスタイルとレイアウトを制御 | 壁を青く塗る、窓を東側に置く、床にタイルを敷く |
| **JavaScript** | 家の**電気とスマートシステム** | Webページにインタラクションとロジックを与える | スイッチを押すと電気がつく、ドアを開けるとカーテンが自動で開く |

::: tip 💡 三者関係

**HTML → CSS**：まず家があって、それから内装。HTMLが基礎で、CSSが装飾。

**HTML + CSS → JavaScript**：まず家と内装があって、それからスマートシステム。JavaScriptが「死んだ」ページを「生きた」ページにする。

**核心思想**：三者はそれぞれ役割を持ち、どれも欠かせない。HTMLだけのページは見た目が悪く、HTML+CSSだけのページは操作できず、三者が揃って初めてWeChat Web版や淘宝のような「Webアプリケーション」が作れる。
:::

### 1.3 実際に触ってみよう

👇 以下のデモはHTML/CSS/JavaScriptの三者がどのように連携するかを示している：

<WebTechTriad />

---

## 2. HTML：WebページのHTML構造

### 2.1 HTMLの動機

HTMLが登場する前、インターネット上のコンテンツは**プレーンテキスト**だけだった。今読んでいるこの文章のように、フォーマットも階層もリンクもなかった。

プレーンテキストの問題点は何か？

- ❌ **階層を表現できない**：どれがタイトルで、どれが本文で、どれが注釈か区別できない
- ❌ **機械が理解できない**：検索エンジンやスクリーンリーダー（視覚障害者向け）が内容を理解できない
- ❌ **インタラクションできない**：リンクもボタンも入力欄もない

**HTML (HyperText Markup Language)** はまさにこの問題を解決するために生まれた。タグを使って内容の意味をマークし、ブラウザに「これが何か」を伝える。

### 2.2 HTMLコードはどんな見た目か

HTMLの基本単位は「タグ」である。タグは山括弧 `< >` で囲まれ、ペアで現れる：

```html
<h1>これはタイトル</h1>
<p>これは段落</p>
<a href="url">これはリンク</a>
```

**キーコンセプト**：

| 概念 | 説明 | 例 |
|------|------|------|
| **タグ** | 山括弧で囲まれたマーク | `<h1>`、`</h1>` |
| **要素** | タグ + 内容の全体 | `<h1>タイトル</h1>` |
| **属性** | タグに付加する情報 | `href="url"`、`class="card"` |
| **ネスト** | タグの中にタグを入れる | `<div><p>テキスト</p></div>` |

### 2.3 HTMLコードをどう読むか

::: tip 🎯 ゼロからの必読：コードの読み方

多くの初心者は `<xxx>` の羅列を見ただけで目が回る。しかしHTMLコードを読むには**決まった手順**がある：

**第1ステップ：「一番外側」を探す**

```html
<div class="card">        ← これはコンテナで、中身を包んでいる
  <h2>タイトル</h2>
  <p>説明文</p>
</div>
```

**第2ステップ：タグ名から意味を推測する**

| タグ名 | 一目で覚える | 中に入れるもの |
|--------|-------------|---------------|
| `<div>` | 大箱 | あらゆる内容、グループ化に使う |
| `<span>` | 小箱 | テキストの断片、マークアップに使う |
| `<p>` | 段落 | ひとまとまりのテキスト |
| `<h1>`-`<h6>` | 見出し | 見出しテキスト、数字が小さいほど重要 |
| `<a>` | アンカー/リンク | クリックしてジャンプできる内容 |
| `<img>` | 画像 | 内容は入れず、srcで画像を指定 |
| `<button>` | ボタン | クリックできるテキスト/アイコン |
| `<input>` | 入力欄 | 内容は入れず、ユーザーが入力する場所 |

**第3ステップ：class と id を見る**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → この要素の「種類」、CSSで一括選択できる
- `id="user-123"` → この要素の「ID番号」、一意の識別子

**第4ステップ：インデントが階層を表す**

```html
<body>
  <header>           ← インデントは header が body の子であることを示す
    <nav>            ← nav は header の子
      <a>ホーム</a>    ← a は nav の子
    </nav>
  </header>
</body>
```
:::

### 2.4 よく使うHTMLタグ早見表

**構造タグ**（ページの骨格を定義）：

```html
<h1>これは見出しレベル1</h1>
<h2>これは見出しレベル2</h2>
<p>これは段落</p>
<div>これはコンテナ（グループ化用）</div>
<span>これはインラインコンテナ（テキストのマークアップ用）</span>
```

**リンクとメディア**（ページを豊かに）：

```html
<a href="https://example.com">ここをクリックしてジャンプ</a>
<img src="photo.jpg" alt="写真の説明" />
<video src="movie.mp4" controls></video>
```

**フォーム**（ユーザー入力を収集）：

```html
<form>
  <input type="text" placeholder="ユーザー名を入力" />
  <input type="password" placeholder="パスワードを入力" />
  <button type="submit">ログイン</button>
</form>
```

**セマンティックタグ**（HTML5で追加、ページの意味をより明確に）：

```html
<header>ページヘッダー</header>
<nav>ナビゲーションバー</nav>
<main>メインコンテンツエリア</main>
<article>記事</article>
<aside>サイドバー</aside>
<footer>フッター</footer>
```

::: tip 💡 なぜセマンティックタグを使うのか？

`<div class="header">` と `<header>` は見た目が同じように見えるが、なぜ後者を使うべきなのか？

1. **SEOに有利**：検索エンジンがページ構造をよりよく理解できる
2. **アクセシビリティ**：スクリーンリーダーが「ナビゲーション」「メインコンテンツ」などの領域を素早く特定できる
3. **コードの可読性**：`<header>` を見れば一目でヘッダーだとわかる

**いつ div を使うか？** 適切なセマンティックタグがない場合。例えば純粋に装飾的なコンテナ。
:::

### 2.5 どうやってHTMLタグを覚えるか

::: tip 🎯 初心者の悩み

「HTMLタグは100個以上あるのに、どうやって覚えればいいの？」

**答え：全部覚える必要はない。** 実際の開発では、90%のケースで20個程度のタグしか使わない。
:::

#### 用途別に分類して覚える

**一、ページ構造系（骨格を描く）**

| タグ | 覚え方 | 用途 |
|------|--------|------|
| `<header>` | 頭 | ページやブロックのヘッダー |
| `<nav>` | ナビ | ナビゲーションリンク領域 |
| `<main>` | メイン | ページのメインコンテンツ（1ページに1つだけ） |
| `<article>` | 記事 | 独立したコンテンツブロック（単独で取り出しても意味が通じる） |
| `<section>` | セクション | テーマのあるコンテンツグループ |
| `<aside>` | 脇 | サイドバー、補足コンテンツ |
| `<footer>` | 足 | ページやブロックのフッター |

**覚え方**：新聞を想像しよう——ヘッダー（header）、目次（nav）、本文（main/article）、コラム（aside）、フッター（footer）。

**二、コンテンツマークアップ系（何であるかを明確にする）**

| タグ | 覚え方 | 用途 |
|------|--------|------|
| `<h1>`-`<h6>` | 見出し1-6 | 見出し階層、h1が最も大きく重要 |
| `<p>` | 段落 | ひとまとまりのテキスト |
| `<ul>`/`<ol>`/`<li>` | 順不同/順序付き/リスト項目 | リスト |
| `<a>` | アンカー | リンク、ジャンプ用 |
| `<img>` | 画像 | 画像 |
| `<video>`/`<audio>` | 動画/音声 | マルチメディア |
| `<strong>`/`<em>` | 強調/斜体強調 | セマンティックな強調 |

**覚え方**：`<a>` は anchor（錨）の略。船が錨を下ろして一箇所に停まるように、リンクも別のページに「停まる」もの。

**三、フォームインタラクション系（ユーザー入力を収集）**

| タグ | 覚え方 | 用途 |
|------|--------|------|
| `<form>` | フォーム | フォームのコンテナ |
| `<input>` | 入力 | さまざまな入力欄（typeで種類が決まる） |
| `<textarea>` | テキストエリア | 複数行テキスト入力 |
| `<select>`/`<option>` | 選択/オプション | ドロップダウン選択 |
| `<button>` | ボタン | ボタン |
| `<label>` | ラベル | 入力欄の説明テキスト |

**覚え方**：`<input>` の type 属性が見た目を決める：
- `type="text"` → テキストボックス
- `type="password"` → パスワード欄
- `type="email"` → メールアドレス欄
- `type="checkbox"` → チェックボックス
- `type="radio"` → ラジオボタン

**四、コンテナ系（グループ化用）**

| タグ | 覚え方 | 用途 |
|------|--------|------|
| `<div>` | 大箱 | ブロックレベルコンテナ、1行を占有 |
| `<span>` | 小箱 | インラインコンテナ、コンテンツ幅のみ占有 |

**覚え方**：div = division（区画）、span = span（範囲）。divは大きな領域を区切るのに使い、spanはテキストの断片をマークするのに使う。

#### 知らないタグに出会ったら

**方法1：英単語を推測する**

多くのタグは英単語の略語：
- `<abbr>` = abbreviation（略語）
- `<blockquote>` = block quote（ブロック引用）
- `<caption>` = caption（キャプション/説明）
- `<figcaption>` = figure caption（図の説明）

**方法2：MDNで調べる**

[MDN HTML要素リファレンス](https://developer.mozilla.org/ja/docs/Web/HTML/Element) にすべてのタグの詳細な説明がある。

**方法3：AIに聞く**

> 「HTMLの `<dl>` タグはどういう意味？いつ使うの？」

#### タグを無理に暗記しなくていい

**実際のワークフローはこうだ**：

1. 「コンテナ」が必要だとわかる → `<div>` と書く
2. 後でこれが「ナビゲーション領域」だと気づく → `<nav>` に変える
3. さらに後でこれが「独立した記事」だと気づく → `<article>` に変える

**まず書いて、後でセマンティクスを最適化する**。タグはいつでも変更できる。最初からどれを使うか悩む必要はない。

---

## 3. CSS：Webページのスキン

### 3.1 CSSの動機

**スケルトン状態の部屋**に引っ越したと想像してほしい。壁も窓もドアもある、住めることは住める。しかし：

- 壁は灰色のコンクリートで、見た目が悪い
- コンセントやスイッチは適当に設置されていて、美しくない
- 家具がなく、生活が不便

HTMLだけのWebページはまさにこれだ。内容も構造もあるが、**醜く**、**乱雑で**、**ユーザーフレンドリーではない**。

CSS (Cascading Style Sheets) はWebページの「内装チーム」である。HTMLの構造を変えず（壁を壊さず、ドアを変えず）、以下のことだけを担当する：

- 🎨 **壁を塗る**：色や背景を変える
- 🖼️ **絵を掛ける**：枠線、影、角丸を追加する
- 🪑 **家具を配置する**：レイアウト、間隔、配置を調整する

### 3.2 CSSコードはどんな見た目か

CSSコードには決まったフォーマットがある：

```css
セレクタ {
  プロパティ名: プロパティ値;
  プロパティ名: プロパティ値;
}
```

**3つの書き方**：

```html
<!-- 方法1：インラインスタイル（一時的なテスト用） -->
<div style="color: red;">赤い文字</div>

<!-- 方法2：内部スタイル（HTMLファイル内に書く） -->
<style>
  .red-text { color: red; }
</style>

<!-- 方法3：外部スタイル（独立したCSSファイル、推奨） -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 CSSコードをどう読むか

::: tip 🎯 ゼロからの必読：CSSの読み方

**第1ステップ：セレクタを見る——「誰を装飾するのか？」**

| セレクタ | 書き方 | 意味 |
|--------|------|------|
| タグセレクタ | `p { }` | すべての `<p>` タグ |
| クラスセレクタ | `.card { }` | すべての `class="card"` 要素 |
| IDセレクタ | `#header { }` | 一意の `id="header"` 要素 |
| 子孫セレクタ | `.card h2 { }` | `.card` の中のすべての `<h2>` |
| グループセレクタ | `.card, .box { }` | `.card` または `.box` の両方を選択 |

**第2ステップ：プロパティを見る——「何を装飾するのか？」**

| プロパティ分類 | よく使うプロパティ | 役割 |
|----------|----------|------|
| テキスト | `color`, `font-size`, `font-weight` | 色、サイズ、太さ |
| 背景 | `background`, `background-color` | 背景色、背景画像 |
| 枠線 | `border`, `border-radius` | 枠線、角丸 |
| 間隔 | `margin`, `padding` | 外側の余白、内側の余白 |
| レイアウト | `display`, `flex`, `grid` | 配置方法 |

**第3ステップ：値を見る——「どのように装飾するのか？」**

```css
.card {
  width: 300px;        /* 固定幅 */
  padding: 16px;       /* 内側の余白 16ピクセル */
  border-radius: 8px;  /* 角丸 8ピクセル */
  background: #fff;    /* 白背景 */
}
```

**よく使う単位**：
- `px`：ピクセル、固定サイズ
- `%`：パーセント、親要素に対して
- `rem`：ルート要素のフォントサイズに対して
- `vw/vh`：ビューポートの幅/高さに対して
:::

### 3.4 セレクタの優先順位

ある要素が同時に複数のセレクタで選択された場合、どれが優先されるのか？

```html
<p class="highlight" id="special">このテキストは何色？</p>
```

```css
p { color: red; }             /* 優先度：1 */
.highlight { color: yellow; } /* 優先度：10 */
#special { color: blue; }     /* 優先度：100 */
```

**答え**：青色。IDセレクタの優先度が最も高く、クラスセレクタが次、タグセレクタが最も低い。

**インラインスタイル**（style属性に書く）の優先度は1000で、最も高い！

### 3.5 ボックスモデル：なぜ幅が合わないのか

::: tip 🎯 実際のシナリオ

Webページを作っていて、3枚のカードを横並びに表示したい。各カードの幅は300px、コンテナの合計幅は900px。こう書いた：

```css
.card { width: 300px; }
```

結果：**3枚目のカードが次の行に落ちた！**

**なぜか？** `width: 300px` はコンテンツの幅だけで、padding と border を計算に入れていなかったからだ。カードに `padding: 20px` と `border: 1px` がある場合、実際の幅は342px、3枚で1026pxになり、コンテナを超えてしまう！
:::

すべてのHTML要素はCSSでは「ボックス」として扱われ、4層で構成される。**宅配便の梱包**を想像しよう：内容物が商品、paddingが緩衝材、borderが段ボール箱、marginが箱と箱の間隔だ。

👇 **実際に触ってみよう**：スライダーをドラッグして各層のサイズを調整し、ボックスモデルの変化を観察しよう：

<CssBoxModel />

**解決策**：

```css
.box {
  box-sizing: border-box;  /* width に padding と border を含める */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

こうすれば、`width: 200px` が最終的な幅になり、padding と border はその中に「押し込まれる」。

### 3.6 Flexbox：要素を自動で整列させるには

Flexboxは現代のCSSで最もよく使われるレイアウト方式だ。本棚の本が自動的に整列するように、要素を自動で配置・整列させる。

👇 **実際に触ってみよう**：方向や整列方法を切り替えて、ボックスがどう配置されるか観察しよう：

<CssFlexbox />

**Flexのコアコンセプト**：

| プロパティ | 役割 | よく使う値 |
|------|------|--------|
| `display: flex` | Flexレイアウトを有効化 | - |
| `flex-direction` | 主軸の方向 | `row`（水平）、`column`（垂直） |
| `justify-content` | 主軸方向の整列 | `flex-start`、`center`、`space-between` |
| `align-items` | 交差軸方向の整列 | `stretch`、`center`、`flex-start` |
| `flex-wrap` | 折り返しの有無 | `nowrap`、`wrap` |
| `gap` | 要素間の間隔 | `10px`、`1rem` |

### 3.7 CSSプリプロセッサ：SCSS/SASS と LESS

::: tip 🎯 実際のシナリオ

プロジェクトを書いていて、CSSファイルが2000行になった。後でテーマカラーを変更しようとしたら、こうなった：

- メインカラー `#3b82f6` が50箇所に出てくる
- 1つの色を変えるのに全体を検索置換しなければならず、それでも漏れが心配
- セレクタが `.nav .nav-list .nav-item .nav-link` のように長くなり、保守が大変

**CSSプリプロセッサ**はまさにこれらの問題を解決するためにある。CSSにも「プログラミング」を可能にする。変数、ネスト、コードの再利用ができる。
:::

#### 3.7.1 CSSプリプロセッサの概要

**端的に言うと**：プリプロセッサは「より賢いCSS」だ。より強力な文法でスタイルを書き、それを**コンパイル**して普通のCSSに変換する。ブラウザはそれを普通に認識できる。

**なぜ使うのか？**

| 課題 | 生のCSS | プリプロセッサ |
|------|----------|----------|
| 色が繰り返し出てくる | あちこちにコピペ | 変数を定義し、一箇所の変更で全体に反映 |
| セレクタの階層が深すぎる | 長い一文になる | ネスト構文で階層が一目瞭然 |
| 同じスタイルを繰り返し書く | コピペ | ミックスイン（Mixin）、関数のように再利用 |

#### 3.7.2 三大プリプロセッサの比較

| 特性 | 生のCSS | **SCSS/SASS** | **LESS** |
|------|----------|---------------|----------|
| **変数の書き方** | `--primary` | `$primary` | `@primary` |
| **ネスト構文** | ❌ 非対応 | ✅ 対応 | ✅ 対応 |
| **ミックスイン（コード再利用）** | ❌ 非対応 | ✅ `@mixin` | ✅ `.mixin()` |
| **学習難易度** | 簡単 | 中程度 | 中程度 |
| **普及度** | - | ⭐⭐⭐ 最も普及 | ⭐⭐ やや普及 |

**簡単な覚え方**：
- **SCSS**：`$` 記号を使う。Bootstrap 5が採用、エコシステムが最も充実
- **LESS**：`@` 記号を使う。CSSの `@media` と同じ書き方で、習得しやすい

#### 3.7.3 主要機能の比較例

##### 1. 変数：一箇所の変更で全体に反映

**シナリオ**：テーマカラー `#3b82f6` が20箇所で使われている。赤色に変更したい。

<Tabs>
<TabItem label="生のCSS">

```css
/* 20箇所を変更しなければならず、漏れやすい */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* $primary を一箇所変更するだけ */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* @primary を一箇所変更するだけ */
```

</TabItem>
</Tabs>

##### 2. ネスト：階層関係が一目瞭然

**シナリオ**：ナビゲーションバーに多層構造がある。

<Tabs>
<TabItem label="生のCSS">

```css
/* 長い一文になり、階層関係がわかりにくい */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* & は親セレクタを表す */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. ミックスイン（Mixin）：コード断片の再利用

**シナリオ**：複数のボタンに「中央揃え」のスタイルが必要。

<Tabs>
<TabItem label="生のCSS">

```css
/* 3回コピペ */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 どう選ぶか

| 状況 | 推奨する選択 |
|------|----------|
| 学び始め、小規模プロジェクト | **生のCSS**（まず基礎を固める） |
| プロジェクトがBootstrap 5を使用 | **SCSS**（BootstrapのソースはSCSS） |
| チームが `@` 記号に慣れている | **LESS**（CSSの `@media` と同じ書き方） |
| 複雑なロジック（ループ、条件分岐）が必要 | **SCSS**（機能がより強力） |

#### 3.7.5 プロジェクトで使う

**Viteプロジェクト（最も簡単）**：

```bash
# sass をインストール
npm install -D sass

# .scss または .less ファイルを直接使用
```

::: tip 💡 初心者へのアドバイス

1. **まず生のCSSをしっかり学ぶ**：プリプロセッサはあくまで「シンタックスシュガー」。CSSの基礎を理解していないと、使えば使うほど混乱する
2. **小規模プロジェクトでは無理に使わない**：CSSが200行未満なら、直接CSSを書く方が簡単
3. **SCSSから始める**：文法がCSSとほぼ同じで、`$` 変数が追加されただけ
4. **ネストを深くしすぎない**：3階層を超えるとコードの保守が難しくなる
:::

#### 3.7.6 異なる技術スタックのファイル構成比較

**同じプロジェクトでも、異なる技術スタックを使うとファイル構成はどう変わるか？**

<Tabs>
<TabItem label="生のHTML + CSS">

```
my-website/
├── index.html              # ページ構造
├── about.html
├── css/
│   ├── reset.css           # リセットスタイル
│   ├── layout.css          # レイアウトスタイル
│   ├── components.css      # コンポーネントスタイル
│   └── style.css           # メインスタイル（数千行になることも）
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**特徴**：
- CSSが1つまたは数個のファイルに集中
- スタイルを変更するにはHTMLとCSSファイルを行き来する必要がある
- スタイルが互いに衝突しやすい

</TabItem>
<TabItem label="Vue + 生のCSS">

```
src/
├── components/             # コンポーネントフォルダ
│   ├── Button/
│   │   ├── Button.vue      # テンプレート + スタイル + ロジック
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # ページフォルダ
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # ルートコンポーネント
└── main.js                 # エントリーファイル
```

**Button.vue の内部構造**：
```vue
<template>
  <button class="btn">クリック</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped スタイルは現在のコンポーネントのみに影響 -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # 変数：色、間隔など
│       ├── _mixins.scss        # ミックスイン：再利用コードブロック
│       ├── _functions.scss     # 関数：色計算など
│       └── global.scss         # グローバルスタイルエントリ
├── components/
│   ├── Button/
│   │   └── Button.vue          # コンポーネント内で @import で変数を導入
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss**：
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue**：
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // 変数を使用
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # style ブロック不要
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# 設定ファイル（ルートディレクトリ）
tailwind.config.js          # テーマ設定
tailwind.css                # ベーススタイルエントリ
```

**Button.vue**（styleブロックなし）：
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    クリック
  </button>
</template>
```

**特徴**：
- 独立したスタイルファイルがない
- クラス名がそのままスタイル（`bg-blue-500` = 青色背景）
- 設定は `tailwind.config.js` に集中

</TabItem>
</Tabs>

**核心的な違いのまとめ**：

| 技術スタック | スタイルファイルの場所 | テーマ管理 | コード再利用 |
|--------|-------------|----------|----------|
| 生のHTML+CSS | 集中型 `css/` フォルダ | 検索置換 | コピペ |
| Vue + CSS | `.vue` コンポーネント内に分散 | 検索置換 | コピペ |
| Vue + SCSS | コンポーネント内 + `styles/` 共通ファイル | 変数で一元管理 | ミックスインで再利用 |
| Vue + Tailwind | なし（クラス名内） | `tailwind.config.js` | クラス名の組み合わせ |

### 3.8 どうやってCSSプロパティを覚えるか

::: tip 🎯 初心者の悩み

「CSSプロパティは数百個もあるのに、どうやって覚えればいいの？」

**答え：用途別に分類し、コアプロパティを覚え、その他は必要になったら調べる。**
:::

#### 用途別に分類して覚える

**一、テキスト組版系（テキストの見た目を管理）**

| プロパティ | 覚え方 | よく使う値 |
|------|--------|--------|
| `color` | 色 | `red`、`#fff`、`rgb(0,0,0)` |
| `font-size` | フォントサイズ | `16px`、`1rem`、`1.5em` |
| `font-weight` | フォントの太さ | `normal`、`bold`、`100`-`900` |
| `font-family` | フォント | `"Hiragino Sans"`、`sans-serif` |
| `line-height` | 行の高さ | `1.5`、`24px` |
| `text-align` | テキスト揃え | `left`、`center`、`right` |
| `text-decoration` | テキスト装飾 | `none`、`underline`、`line-through` |

**覚え方**：Wordで文書を組版するのを想像しよう——色を変え、サイズを変え、太字にし、フォントを変え、行間を調整し、揃え、下線を引く。

**二、ボックスモデル系（要素が占めるスペースを管理）**

| プロパティ | 覚え方 | よく使う値 |
|------|--------|--------|
| `width`/`height` | 幅/高さ | `100px`、`50%`、`100vw` |
| `padding` | 内側の余白 | `10px`、`10px 20px` |
| `margin` | 外側の余白 | `10px`、`auto`（中央揃え用） |
| `border` | 枠線 | `1px solid #ccc` |
| `border-radius` | 角丸 | `4px`、`50%`（円形） |
| `box-sizing` | ボックスモデル | `border-box`（推奨） |

**覚え方**：paddingは「内側」の余白（コンテンツから枠線までの距離）、marginは「外側」の余白（枠線から他の要素までの距離）。

**ショートハンドのルール**：
```css
/* 4つの値：上 右 下 左（時計回り） */
padding: 10px 20px 15px 25px;

/* 2つの値：上下 左右 */
padding: 10px 20px;

/* 1つの値：4方向すべて同じ */
padding: 10px;
```

**三、背景と枠線系（要素の見た目を管理）**

| プロパティ | 覚え方 | よく使う値 |
|------|--------|--------|
| `background` | 背景 | `#fff`、`url(bg.jpg)`、`linear-gradient(...)` |
| `background-color` | 背景色 | `#fff`、`rgba(0,0,0,0.5)` |
| `background-image` | 背景画像 | `url(photo.jpg)` |
| `background-size` | 背景サイズ | `cover`、`contain`、`100%` |
| `background-position` | 背景位置 | `center`、`top left` |
| `box-shadow` | ボックスシャドウ | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | 透明度 | `0`-`1`（0は完全に透明） |

**覚え方**：`background` はショートハンドで、複数の値を一度に設定できる：
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          色     画像       繰り返しなし   位置/サイズ */
```

**四、レイアウト系（要素の配置方法を管理）**

| プロパティ | 覚え方 | よく使う値 |
|------|--------|--------|
| `display` | 表示方式 | `block`、`inline`、`flex`、`grid`、`none` |
| `position` | 位置指定 | `static`、`relative`、`absolute`、`fixed`、`sticky` |
| `top`/`right`/`bottom`/`left` | 四方向 | `10px`、`50%`（positionと併用） |
| `z-index` | 重なり順 | 数字が大きいほど上層 |
| `float` | フロート | `left`、`right`（古い方法、非推奨） |
| `overflow` | はみ出し処理 | `visible`、`hidden`、`scroll`、`auto` |

**position の覚え方**：
- `static`：デフォルト、通常フロー
- `relative`：自分の元の位置を基準にオフセット
- `absolute`：最も近い位置指定された祖先要素を基準に配置
- `fixed`：ビューポートを基準に配置（スクロールしても動かない）
- `sticky`：スクロールして一定位置に達すると固定

**五、Flexboxレイアウト系（一次元レイアウトの神器）**

| プロパティ | 覚え方 | 役割 |
|------|--------|------|
| `display: flex` | Flexを有効化 | コンテナをFlexコンテナにする |
| `flex-direction` | 方向 | `row`（横方向）、`column`（縦方向） |
| `justify-content` | 主軸方向の整列 | 要素を主軸上でどう配置するか |
| `align-items` | 交差軸方向の整列 | 要素を交差軸上でどう整列させるか |
| `flex-wrap` | 折り返し | `nowrap`、`wrap` |
| `gap` | 隙間 | 要素間の間隔 |
| `flex` | 伸縮 | 子要素の伸縮比率 |

**覚え方**：
- `justify` = 整列 → 主軸方向の整列
- `align` = 配置/整列 → 交差軸方向の整列

**六、アニメーション・トランジション系（要素の動きを管理）**

| プロパティ | 覚え方 | よく使う値 |
|------|--------|--------|
| `transition` | トランジション | `all 0.3s ease` |
| `transform` | 変形 | `translate(10px)`、`rotate(45deg)`、`scale(1.1)` |
| `animation` | アニメーション | `fadeIn 1s ease forwards` |

**ショートハンドのルール**：
```css
/* transition: プロパティ 時間 イージング関数 遅延 */
transition: all 0.3s ease 0s;

/* transform は複数の変形を組み合わせられる */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### 知らないプロパティに出会ったら

**方法1：英単語を推測する**

多くのプロパティは英単語または略語：
- `margin` = 余白、余地
- `padding` = 詰め物
- `border` = 境界
- `visibility` = 可視性
- `cursor` = カーソル

**方法2：シナリオから連想する**

ある効果を実現したいとき、「キーワード」を考える：

| やりたいこと | 使えそうなプロパティ |
|---------|------------|
| 色を変える | `color`、`background-color`、`border-color` |
| サイズを変える | `width`、`height`、`font-size` |
| 位置を変える | `margin`、`position`、`top/left` |
| 間隔を変える | `padding`、`margin`、`gap` |
| 要素を隠す | `display: none`、`visibility: hidden`、`opacity: 0` |
| 中央揃え | `margin: auto`、`text-align: center`、`justify-content: center` |
| 角丸を追加 | `border-radius` |
| 影を追加 | `box-shadow`、`text-shadow` |
| アニメーションを追加 | `transition`、`animation` |

**方法3：MDNで調べるかAIに聞く**

[MDN CSSプロパティリファレンス](https://developer.mozilla.org/ja/docs/Web/CSS/Reference) にすべてのプロパティの詳細な説明がある。

> 「CSSでテキストを1行だけ表示し、はみ出した部分を省略記号にするには？」

**方法4：開発者ツールで「学ぶ」**

気に入ったWebページの効果を見つけたら：
1. 右クリック → 「検証」
2. 要素を選択し、Stylesパネルを見る
3. CSSプロパティを直接コピー

#### プロパティを無理に暗記しなくていい

**実際のワークフローはこうだ**：

1. 「中央揃え」したいとわかる → 「CSS 中央揃え」で検索
2. コードをコピーし、数値を調整
3. 使い込むうちに自然に覚える

**推奨する学習パス**：

1. **まずボックスモデルをマスター**：`width`、`height`、`padding`、`margin`、`border`
2. **次にFlexboxをマスター**：`display: flex`、`justify-content`、`align-items`
3. **それから位置指定をマスター**：`position`、`top/left`、`z-index`
4. **最後にアニメーションを学ぶ**：`transition`、`transform`、`animation`

その他のプロパティは必要になったら調べ、使い込むうちに自然に覚える。

---

## 4. JavaScript：Webページの頭脳

### 4.1 JavaScriptの動機

HTML + CSSだけのWebページは、**ショーウィンドウのマネキン**のようなものだ：

- ✅ 見た目はきれい（CSS）
- ✅ 構造は明確（HTML）
- ❌ しかし話しかけても反応しない
- ❌ ボタンを押しても何も起こらない

**JavaScript**はWebページを「ショーウィンドウのマネキン」から「生きた人間」に変える：

- ✅ ボタンをクリックすると、ポップアップが表示される
- ✅ テキストを入力すると、リアルタイムでフォーマットがチェックされる
- ✅ ページをスクロールすると、さらにコンテンツが読み込まれる
- ✅ フォームを送信すると、「送信中...」と表示される

### 4.2 JavaScriptコードはどんな見た目か

**能力1：データを記憶する**（変数）

```javascript
let userName = '田中'
let isLoggedIn = true
let cartCount = 5
```

**能力2：繰り返し実行する**（関数）

```javascript
function sayHello(name) {
  return 'こんにちは、' + name + '！'
}

console.log(sayHello('田中'))  // 出力：こんにちは、田中！
```

**能力3：イベントに応答する**（イベントリスナー）

```javascript
button.addEventListener('click', function() {
  alert('ボタンがクリックされました！')
})
```

**能力4：ページを変更する**（DOM操作）

```javascript
document.getElementById('title').textContent = '新しいタイトル'
document.getElementById('box').style.background = 'red'
```

### 4.3 JavaScriptコードをどう読むか

::: tip 🎯 ゼロからの必読：JSコードの読み方

**第1ステップ：変数を探す——「何を記憶しているのか？」**

```javascript
const API_URL = 'https://api.example.com'  // 定数、変わらない
let count = 0                                // 変数、変わる
const user = { name: '田中', age: 25 }       // オブジェクト、複数のデータ
const items = ['リンゴ', 'バナナ', 'オレンジ']  // 配列、リストデータ
```

**第2ステップ：関数を探す——「何ができるのか？」**

```javascript
// 関数名から用途が推測できることが多い
function handleClick() { }      // クリック処理
function fetchData() { }        // データ取得
function validateForm() { }     // フォーム検証
```

**第3ステップ：イベントを探す——「いつ発火するのか？」**

```javascript
button.addEventListener('click', handleClick)     // クリック時
input.addEventListener('input', validateForm)     // 入力時
window.addEventListener('scroll', loadMore)       // スクロール時
```

**第4ステップ：DOM操作を探す——「何を変更したのか？」**

```javascript
element.textContent = '新しい内容'     // テキスト変更
element.classList.add('active')       // スタイルクラス追加
element.style.display = 'none'        // 要素を非表示
parent.appendChild(child)             // 要素を追加
```
:::

### 4.4 DOM：JavaScriptはどうやってページを操作するのか

ブラウザはHTMLコードを読み取った後、それらを単なる文字列として扱うのではなく、メモリ内で「木」として描画する：

```
Document (ドキュメント)
    ↓
<html>
    ├─<head>
    │   └─<title>私のWebページ</title>
    └─<body>
        ├─<h1>ようこそ</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>テキスト</p>
```

この木のことを **DOMツリー** と呼ぶ。各HTMLタグはこの木の上の「ノード」である。

**どうやってノードを見つけるか？**

```javascript
// IDで探す（最速、一意）
const element = document.getElementById('header')

// セレクタで探す（最もよく使う）
const element = document.querySelector('.card h2')    // 最初の1つを探す
const elements = document.querySelectorAll('button')  // すべてを探す

// 関係で探す
element.parentNode           // 親ノードを探す
element.children             // 子ノードを探す
element.nextElementSibling   // 次の兄弟を探す
```

**パフォーマンス警告**：DOM操作は非常に**コストが高い**。DOMを変更するたびに、ブラウザはレイアウトを再計算し、再描画する。

```javascript
// ❌ 非効率：1000回ループし、毎回DOMを操作
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ 効率的：先に組み立てて、一度に挿入
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

这正是 **Vue / React** などのモダンフレームワークが誕生した理由でもある。メモリ上で「仮想DOM」を使い、最小限の変更量を計算してから、最後に実際のDOMを操作する。

👇 **実際に触ってみよう**：DOM操作の基本メソッド：

<DomManipulator />

### 4.5 ECMAScript：JavaScriptのバージョン進化

**ECMAScript** はJavaScriptの「標準仕様書」である。ブラウザベンダーはこの標準に従ってJavaScriptエンジンを実装する。

#### なぜバージョン番号があるのか

JavaScriptは不変ではない。毎年新しい機能が追加され、問題が修正される。バージョン番号は「このブラウザがどの機能をサポートしているか」を示す。

#### 重要なバージョン一覧

| バージョン | 年 | コア機能 | 解決した問題 |
|------|------|----------|----------------|
| **ES5** | 2009 | 厳格モード、`forEach`/`map`/`filter` | 言語の標準化、配列メソッドの追加 |
| **ES6/ES2015** | 2015 | `let/const`、アロー関数、`class`、`Promise`、モジュール化 | 最大のアップデート、モダンJSの出発点 |
| **ES2016** | 2016 | `includes()`、`**` べき乗演算子 | 小規模アップデート |
| **ES2017** | 2017 | `async/await`、`Object.entries()` | 非同期コードがより読みやすく |
| **ES2018** | 2018 | `...` スプレッド演算子、`Promise.finally()` | オブジェクトと非同期の強化 |
| **ES2020** | 2020 | オプショナルチェーン `?.`、Null合体 `??`、`BigInt` | ネストされたプロパティへの安全なアクセス |
| **ES2021** | 2021 | `replaceAll()`、論理代入 `??=` | 文字列と代入の強化 |
| **ES2022** | 2022 | トップレベル `await`、`.at()` インデックス | モジュールの非同期読み込みがより便利に |

#### ES6+ で最もよく使われる新文法

**1. `let` と `const` で `var` を置き換え**

```javascript
// ❌ 古い書き方：var は巻き上げがあり、バグを起こしやすい
var name = '田中'
if (true) {
  var name = '鈴木'  // 外側の name を上書き
}
console.log(name)  // '鈴木'、期待した結果ではない

// ✅ 新しい書き方：let はブロックスコープ
let name = '田中'
if (true) {
  let name = '鈴木'  // この if の中だけで有効
}
console.log(name)  // '田中'、期待通り

// ✅ const：宣言後に再代入不可
const PI = 3.14159
PI = 3  // エラー！意図しない変更を防ぐ
```

**2. アロー関数：より簡潔な関数の書き方**

```javascript
// ❌ 古い書き方
const add = function(a, b) {
  return a + b
}

// ✅ 新しい書き方
const add = (a, b) => a + b

// アロー関数の this は外側のスコープを束縛
const obj = {
  name: '田中',
  // ❌ 通常関数：this は呼び出し元を指す
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ アロー関数：this は obj を継承
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // '田中'
    }, 100)
  }
}
```

**3. 分割代入：オブジェクト/配列からデータを抽出**

```javascript
// オブジェクトの分割
const user = { name: '田中', age: 25, city: '東京' }
const { name, age } = user  // 直接抽出
console.log(name)  // '田中'

// 配列の分割
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// 関数パラメータの分割
function greet({ name, age }) {
  console.log(`${name} さんは ${age} 歳です`)
}
greet(user)  // '田中 さんは 25 歳です'
```

**4. テンプレート文字列：文字列結合の苦痛から解放**

```javascript
// ❌ 古い書き方：引用符とプラス記号だらけ
const msg = 'ユーザー ' + name + ' の年齢は ' + age + ' 歳です'

// ✅ 新しい書き方：バッククォート + ${}
const msg = `ユーザー ${name} の年齢は ${age} 歳です`

// 複数行もサポート
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>年齢：${age}</p>
  </div>
`
```

**5. `async/await`：非同期コードを同期のように書く**

```javascript
// ❌ コールバック地獄
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. オプショナルチェーン `?.` と Null合体 `??`**

```javascript
const user = {
  name: '田中',
  address: {
    city: '東京'
  }
}

// ❌ 古い書き方：階層ごとに判定
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : '不明'

// ✅ 新しい書き方：オプショナルチェーン + Null合体
const streetName = user?.address?.street ?? '不明'
```

::: tip 💡 ブラウザがどの機能をサポートしているか知るには？

1. **互換性テーブルを調べる**：[caniuse.com](https://caniuse.com/) で機能名を入力
2. **ビルドツールを使う**：Babelが新しい文法を古いブラウザ対応のコードに変換できる
3. **ターゲットユーザーを見る**：モダンブラウザのみをサポートするなら、ほとんどのES6+機能がそのまま使える
:::

### 4.6 TypeScript：JavaScriptに型制約を追加

#### なぜTypeScriptが必要なのか

**シナリオ1：関数パラメータの型が不確定**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ 文字列結合、掛け算ではない
calculateTotal(100, '5')    // 500 ✅ しかしこれは運が良かっただけ
```

JavaScriptはパラメータの型が間違っていても教えてくれず、実行時まで問題が発見できない。

**シナリオ2：オブジェクトプロパティのスペルミス**

```javascript
// JavaScript
const user = {
  name: '田中',
  age: 25
}

console.log(user.nmae)  // undefined、スペルミスだがエラーにならない
```

**TypeScriptはこれらの問題を解決する**：

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`こんにちは、${user.name}`)
  console.log(user.nmae)  // ❌ コンパイル時エラー：プロパティ 'nmae' は存在しません
}

greet({ name: '田中', age: 25 })        // ✅
greet({ name: '田中', age: '25' })      // ❌ コンパイル時エラー：age は number であるべき
greet({ name: '田中' })                 // ❌ コンパイル時エラー：age が不足
```

#### TypeScriptのコアコンセプト

**1. 基本型**

```typescript
let name: string = '田中'
let age: number = 25
let isActive: boolean = true
let anyValue: any = 'どんな型でも可'  // 非推奨、型チェックの意味がなくなる
```

**2. インターフェース（Interface）：オブジェクト構造の定義**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // オプショナルプロパティ
  readonly createdAt: Date  // 読み取り専用プロパティ
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. 型エイリアス（Type）**

```typescript
type ID = string | number  // ユニオン型
type Status = 'pending' | 'approved' | 'rejected'  // リテラル型

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' は有効な Status ではない
```

**4. ジェネリクス：再利用可能な型**

```typescript
// ジェネリクスなし：型ごとに書き直し
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// ジェネリクスあり：1つの関数で完結
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // number を返す
getFirst(['a', 'b', 'c'])  // string を返す
```

#### TypeScript vs JavaScript 比較

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 型チェック | 実行時までエラーが発見できない | コンパイル時にエラーを発見 |
| IDEサポート | 基本的なヒント | インテリジェントな補完、リファクタリング、定義ジャンプ |
| 学習曲線 | 簡単 | 型システムの学習が必要 |
| 適用シーン | 小規模プロジェクト、プロトタイプ | 大規模プロジェクト、チーム開発 |
| 実行方法 | ブラウザで直接実行 | JavaScriptにコンパイルが必要 |

#### 実際の開発でのTypeScript

```typescript
// APIレスポンスの型定義
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// 型付きAPIリクエスト
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 使用時にIDEがすべてのプロパティを補完
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ IDEが自動補完
  console.log(res.data.nmae)   // ❌ コンパイル時エラー
})
```

::: tip 💡 初心者へのアドバイス

1. **まずJavaScriptをしっかり学ぶ**：TypeScriptはJSのスーパーセット。JSを理解せずにTSを学ぶのは非常に苦しい
2. **小規模プロジェクトでは無理にTSを使わない**：型定義はコード量を増やし、シンプルなプロジェクトではかえって複雑になる
3. **JSDocから移行を始める**：JSファイルに `/** @type {User} */` コメントを書いて、型ヒントを体験する
4. **`any` は妥協策であり、解決策ではない**：型の問題に直面したらまず解決を試み、すぐに `any` にしない
:::

### 4.7 モダンJavaScript開発ツールチェーン

::: tip 🎯 なぜツールチェーンが必要なのか？

ブラウザが認識できるのはHTML/CSS/JSだけ。しかしモダン開発では以下のようなものを使う：

- **TypeScript**：ブラウザは認識できない、JSにコンパイルが必要
- **SCSS/Less**：ブラウザは認識できない、CSSにコンパイルが必要
- **モジュール化**：`import/export` は1つのファイルにバンドルする必要がある
- **新しい文法**：ES6+は古いブラウザ対応のコードにトランスパイルする必要がある

ツールチェーンはこれらの「開発時に使うコード」を「ブラウザが実行できるコード」に変換するものだ。
:::

**コアツール**：

| ツール | 役割 | 類推 |
|------|------|------|
| **Node.js** | JavaScript実行環境 | JSをブラウザから切り離して実行可能に |
| **npm/yarn/pnpm** | パッケージマネージャ | 他人が書いたコードライブラリをダウンロード |
| **Vite/Webpack** | ビルドツール | ソースコードをブラウザが実行できるコードにバンドル |
| **Babel** | コンパイラ | 新しい文法を古い文法に変換 |
| **ESLint** | コードチェック | コードの問題やスタイルの不整合を発見 |

**典型的な開発フロー**：

```bash
# 1. プロジェクトを初期化
npm create vite@latest my-app -- --template vue-ts

# 2. 依存関係をインストール
cd my-app
npm install

# 3. 開発モード（ホットリロード）
npm run dev

# 4. 本番用ビルド
npm run build
```

---

## 5. 三者の連携関係

### 5.1 役割分担の比較

| 役割 | 担当すること | 担当しないこと | 典型的な例 |
|------|----------|----------|----------|
| **HTML** | 構造とセマンティクスの定義 | スタイル/インタラクション | `<section><h1>タイトル</h1></section>` |
| **CSS** | 外観とレイアウトの制御 | ロジック/データ | `.card { background: white; }` |
| **JavaScript** | インタラクションとロジックの処理 | 構造の定義 | `button.onclick = () => alert()` |

### 5.2 完全な連携例

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS：カードを見栄え良く */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML：カード構造を定義 -->
  <div class="card">
    <h2 id="title">ボタンをクリック</h2>
    <button id="btn">クリックして</button>
  </div>

  <script>
    // JavaScript：ボタンをクリック可能に
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = 'クリックされました！'
      alert('タイトルが変更されました')
    })
  </script>
</body>
</html>
```

---

## 6. 知らないコードに出会ったら

### 6.1 AIに聞く

> 「HTMLの `<aside>` タグはどういう意味？いつ使うの？」
>
> 「CSSの `position: sticky` はどんな効果？」

### 6.2 MDNで調べる

[MDN Web Docs](https://developer.mozilla.org/) は最も信頼できるWeb技術ドキュメント。知らないタグ、プロパティ、メソッドに出会ったら、直接検索すればよい。

### 6.3 ブラウザ開発者ツール

1. ページ要素を右クリック → 「検証」
2. **Elements** パネルでHTML構造を確認
3. **Styles** パネルでCSSスタイルを確認
4. **Console** パネルでJSコードを実行

### 6.4 よく使うCSSプロパティ早見表

| これを見たら | これは何をするものか |
|----------|------------|
| `display: flex` | フレックスレイアウトを有効化 |
| `position: absolute` | 絶対位置指定 |
| `z-index: 100` | 重なり順、数字が大きいほど上 |
| `overflow: hidden` | はみ出し部分を非表示 |
| `cursor: pointer` | マウスを手の形に |
| `transition: all 0.3s` | アニメーショントランジション効果 |
| `box-sizing: border-box` | width に padding と border を含める |

---

## 7. 用語早見表

| 用語 | 英語 | 端的な説明 |
|------|------|------------|
| **HTML** | HyperText Markup Language | ハイパーテキストマークアップ言語、タグでWebページ構造を記述 |
| **CSS** | Cascading Style Sheets | カスケーディングスタイルシート、色、レイアウト、アニメーションを制御 |
| **JavaScript** | JavaScript | Webページのプログラミング言語、インタラクションとロジックを担当 |
| **DOM** | Document Object Model | ドキュメントオブジェクトモデル、オブジェクトツリーでページを表現 |
| **Flexbox** | Flexible Box Layout | 一次元レイアウト方式、整列と分配が容易 |
| **ボックスモデル** | CSS Box Model | 要素をコンテンツからマージンまでの階層ボックスとして扱う |
| **SCSS** | Sassy CSS | CSSプリプロセッサ、変数、ネスト、ミックスインをサポート |
| **TypeScript** | TypeScript | JavaScriptのスーパーセット、型システムを追加 |
| **ES6** | ECMAScript 2015 | JavaScriptの重要なバージョン、多くの文法が追加された |
| **セマンティック** | Semantic HTML | divではなく意味のあるタグ（header など）を使用すること |
| **レスポンシブ** | Responsive Design | 異なる画面サイズに自動適応するデザイン |

---

## まとめ

これであなたは理解したはずだ：**HTMLは骨格を定義し、CSSは見た目を担当し、JavaScriptは魂を吹き込む**。

この三つはWeb開発の基盤である。これらを理解すれば、あなたは：

- あらゆるWebページのソースコードを読める（右クリック → 「ページのソースを表示」）
- 他人のWebページを変更できる（ブラウザDevTools → Elements）
- フロントエンドフレームワーク（Vue/React）の学習を始められる——これらはすべてこの三つの上に成り立っている

**次のステップのおすすめ**：

- 手早くWebページを作りたいなら、**Vue** または **React** フレームワークを学ぼう
- CSSを深く理解したいなら、**Flexbox** と **Grid** レイアウトを学ぼう
- コード品質を向上させたいなら、**TypeScript** を学ぼう
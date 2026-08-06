# HTML/CSS 佈局基礎
::: tip 🎯 核心問題
**網頁是怎麼做出來的？為什麼有的網頁只有文字，有的卻像應用程式一樣可以互動？** 這個問題會引出 Web 開發的三大基石，讓你理解每一個網頁背後的結構。
:::

---

## 1. HTML、CSS、JavaScript 分別概述

### 1.1 從靜態網頁到動態應用

想像一下你在街上看到的**海報**。你只能看，不能互動——海報不會因為你看了就改變內容，也不會因為你點了某個地方就彈出更多資訊。

早期的網頁就是這樣的「電子海報」：只能看、不能改、內容固定。

但現代網頁完全不同了。它們像**桌面應用程式**一樣：

- 你可以點擊、拖曳、輸入、上傳
- 頁面會根據你的操作即時變化
- 可以像軟體一樣完成複雜任務（比如線上影片剪輯）

**這種轉變的核心原因，就是網頁技術的三大基石：HTML + CSS + JavaScript**。

### 1.2 一個比喻：蓋房子

| 技術           | 🏠 房子比喻              | 實際作用             | 具體例子                             |
| -------------- | ------------------------ | -------------------- | ------------------------------------ |
| **HTML**       | 房子的**結構和材料**     | 定義網頁的內容和層級 | 這是一面牆、這是一扇窗、這是一個房間 |
| **CSS**        | 房子的**裝修和外觀**     | 控制網頁的樣式和佈局 | 牆刷成藍色、窗戶放在東邊、地板鋪磁磚 |
| **JavaScript** | 房子的**電器和智慧系統** | 讓網頁具備互動和邏輯 | 按開關燈亮了、開門窗簾自動拉開       |

::: tip 💡 三者的關係

**HTML → CSS**：先有房子，才能裝修。HTML 是基礎，CSS 是美化。

**HTML + CSS → JavaScript**：先有房子和裝修，才能裝智慧系統。JavaScript 會讓「死」的頁面變「活」。

**核心思想**：三者各司其職，缺一不可。只有 HTML 的頁面很醜，只有 HTML+CSS 的頁面不能互動，三者齊全才能做出像 LINE 網頁版、蝦皮這樣的「Web 應用」。
:::

### 1.3 動手試試看

👇 下面這個演示展示了 HTML/CSS/JavaScript 三者如何協作：

<WebTechTriad />

---

## 2. HTML：網頁的骨架

### 2.1 需要 HTML 的動機

在 HTML 出現之前，網際網路上的內容只是**純文字**。就像你現在看的這段文字，沒有任何格式、沒有層級、沒有連結。

純文字的問題是什麼？

- ❌ **無法表達層級**：分不清哪是標題、哪是正文、哪是註解
- ❌ **機器看不懂**：搜尋引擎、螢幕閱讀器（盲人用）無法理解內容
- ❌ **無法互動**：沒有連結、沒有按鈕、沒有輸入框

**HTML (HyperText Markup Language)** 就是為了解決這個問題誕生的。它用「標籤」（tag）來標記內容的含義，讓瀏覽器知道「這是什麼」。

### 2.2 HTML 程式碼的格式外觀概述

HTML 的基本單位是「標籤」（tag）。標籤用尖括號 `< >` 包裹，成對出現：

```html
<h1>這是標題</h1>
<p>這是段落</p>
<a href="url">這是連結</a>
```

**關鍵概念**：

| 概念 | 解釋 | 例子 |
|------|------|------|
| **標籤** | 用尖括號包裹的標記 | `<h1>`、`</h1>` |
| **元素** | 標籤 + 內容的整體 | `<h1>標題</h1>` |
| **屬性** | 標籤上的附加資訊 | `href="url"`、`class="card"` |
| **巢狀** | 標籤裡再放標籤 | `<div><p>文字</p></div>` |

### 2.3 看懂 HTML 程式碼的方法

::: tip 🎯 零基礎必讀：看程式碼的方法

很多新手看到一堆 `<xxx>` 就暈了。其實看 HTML 程式碼有**固定套路**：

**第一步：找「最外層」**

```html
<div class="card">        ← 這是容器，裡面裝著內容
  <h2>標題</h2>
  <p>描述文字</p>
</div>
```

**第二步：看標籤名猜含義**

| 標籤名 | 一眼記住 | 裡面放什麼 |
|--------|----------|------------|
| `<div>` | 大盒子 | 任何內容，用來分組 |
| `<span>` | 小盒子 | 文字片段，用來標記 |
| `<p>` | 段落 | 一段文字 |
| `<h1>`-`<h6>` | 標題 | 標題文字，數字越小越重要 |
| `<a>` | 錨點/連結 | 可點擊跳轉的內容 |
| `<img>` | 圖片 | 不放內容，用 src 指向圖片 |
| `<button>` | 按鈕 | 可點擊的文字/圖示 |
| `<input>` | 輸入框 | 不放內容，使用者輸入的地方 |

**第三步：看 class 和 id**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → 這個元素的「類型」，CSS 可以批量選中
- `id="user-123"` → 這個元素的「身分證號」，唯一標識

**第四步：縮排表示層級**

```html
<body>
  <header>           ← 縮排表示 header 是 body 的孩子
    <nav>            ← nav 是 header 的孩子
      <a>首頁</a>    ← a 是 nav 的孩子
    </nav>
  </header>
</body>
```
:::

### 2.4 常用 HTML 標籤速查

**結構標籤**（定義頁面骨架）：

```html
<h1>這是一級標題</h1>
<h2>這是二級標題</h2>
<p>這是一個段落</p>
<div>這是一個容器（用來分組）</div>
<span>這是行內容器（用來標記文字）</span>
```

**連結與媒體**（讓頁面豐富）：

```html
<a href="https://example.com">點擊這裡跳轉</a>
<img src="photo.jpg" alt="照片描述" />
<video src="movie.mp4" controls></video>
```

**表單**（收集使用者輸入）：

```html
<form>
  <input type="text" placeholder="請輸入使用者名稱" />
  <input type="password" placeholder="請輸入密碼" />
  <button type="submit">登入</button>
</form>
```

**語意化標籤**（HTML5 新增，讓頁面含義更明確）：

```html
<header>頁面頭部</header>
<nav>導覽列</nav>
<main>主要內容區</main>
<article>一篇文章</article>
<aside>側邊欄</aside>
<footer>頁腳</footer>
```

::: tip 💡 為什麼要用語意化標籤？

`<div class="header">` 和 `<header>` 看起來效果一樣，為什麼要用後者？

1. **SEO 友好**：搜尋引擎能更好理解頁面結構
2. **可存取性**：螢幕閱讀器能快速定位「導覽」「主要內容」等區域
3. **程式碼可讀性**：看到 `<header>` 一眼就知道是頭部

**什麼時候用 div？** 當沒有合適的語意標籤時。比如一個純裝飾性的容器。
:::

### 2.5 記住這麼多 HTML 標籤的方法

::: tip 🎯 新手困惑

「HTML 標籤有一百多個，怎麼記得住？」

**答案是：不需要全部記住。** 實際開發中，90% 的情況只用 20 個左右的標籤。
:::

#### 按用途分類記憶

**一、頁面結構類（畫骨架）**

| 標籤 | 記憶口訣 | 用途 |
|------|----------|------|
| `<header>` | 頭 | 頁面或區塊的頭部 |
| `<nav>` | 導覽 | 導覽連結區域 |
| `<main>` | 主體 | 頁面主要內容（每頁只有一個） |
| `<article>` | 文章 | 獨立的內容塊（可以單獨拿走還有意義） |
| `<section>` | 章節 | 有主題的內容分組 |
| `<aside>` | 旁邊 | 側邊欄、補充內容 |
| `<footer>` | 腳 | 頁面或區塊的底部 |

**記憶方法**：想像一張報紙——有報頭（header）、目錄（nav）、正文（main/article）、專欄（aside）、報腳（footer）。

**二、內容標記類（說清楚是什麼）**

| 標籤 | 記憶口訣 | 用途 |
|------|----------|------|
| `<h1>`-`<h6>` | 標題1-6 | 標題層級，h1 最大最重要 |
| `<p>` | 段落 | 一段文字 |
| `<ul>`/`<ol>`/`<li>` | 無序/有序/列表項 | 列表 |
| `<a>` | 錨點 | 連結，跳轉用 |
| `<img>` | 圖片 | 圖片 |
| `<video>`/`<audio>` | 影片/音訊 | 多媒體 |
| `<strong>`/`<em>` | 強調/斜體強調 | 語意化的強調 |

**記憶方法**：`<a>` 是 anchor（錨）的縮寫，想像船拋錨停在一個地方，連結就是「停」到另一個頁面。

**三、表單互動類（收集使用者輸入）**

| 標籤 | 記憶口訣 | 用途 |
|------|----------|------|
| `<form>` | 表單 | 表單容器 |
| `<input>` | 輸入 | 各種輸入框（type 決定類型） |
| `<textarea>` | 文字區域 | 多行文字輸入 |
| `<select>`/`<option>` | 選擇/選項 | 下拉選擇 |
| `<button>` | 按鈕 | 按鈕 |
| `<label>` | 標籤 | 輸入框的說明文字 |

**記憶方法**：`<input>` 的 type 屬性決定它長什麼樣：
- `type="text"` → 文字框
- `type="password"` → 密碼框
- `type="email"` → 電子郵件框
- `type="checkbox"` → 核取方塊
- `type="radio"` → 單選按鈕

**四、容器類（分組用）**

| 標籤 | 記憶口訣 | 用途 |
|------|----------|------|
| `<div>` | 大盒子 | 區塊級容器，獨佔一行 |
| `<span>` | 小盒子 | 行內容器，只佔內容寬度 |

**記憶方法**：div = division（分區），span = span（跨度）。div 用來劃分大區域，span 用來標記文字片段。

#### 遇到不認識的標籤怎麼辦？

**方法一：猜英文單字**

很多標籤是英文單字的縮寫：
- `<abbr>` = abbreviation（縮寫）
- `<blockquote>` = block quote（區塊引用）
- `<caption>` = caption（標題/說明）
- `<figcaption>` = figure caption（圖片說明）

**方法二：查 MDN**

[MDN HTML 元素參考](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Element) 有所有標籤的詳細說明。

**方法三：問 AI**

> 「HTML 中的 `<dl>` 標籤是什麼意思？什麼時候用？」

#### 不用刻意背標籤

**真正的工作流程是這樣的**：

1. 你知道要用一個「容器」 → 寫 `<div>`
2. 後來發現這是「導覽區域」 → 改成 `<nav>`
3. 後來發現這是「獨立文章」 → 改成 `<article>`

**先寫出來，再最佳化語意**。標籤可以隨時改，不用一開始就糾結用哪個。

---

## 3. CSS：網頁的皮膚

### 3.1 需要 CSS 的動機

想像你住進了一個**毛胚房**：有牆、有窗、有門，能住人，但是：

- 牆是灰色的水泥，不好看
- 插座和開關隨便裝，不美觀
- 沒有傢俱，生活不方便

只有 HTML 的網頁就是這樣：有內容、有結構，但**醜**、**亂**、**不友好**。

CSS (Cascading Style Sheets) 就是網頁的「裝修隊」。它不改變 HTML 的結構（不拆牆、不改門），只負責：

- 🎨 **刷牆**：改變顏色、背景
- 🖼️ **掛畫**：加入邊框、陰影、圓角
- 🪑 **擺傢俱**：調整佈局、間距、對齊

### 3.2 CSS 程式碼的格式外觀概述

CSS 程式碼有固定格式：

```css
選擇器 {
  屬性名: 屬性值;
  屬性名: 屬性值;
}
```

**三種寫法**：

```html
<!-- 方式一：行內樣式（臨時測試用） -->
<div style="color: red;">紅色文字</div>

<!-- 方式二：內部樣式（寫在 HTML 檔案裡） -->
<style>
  .red-text { color: red; }
</style>

<!-- 方式三：外部樣式（獨立 CSS 檔案，推薦） -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 看懂 CSS 程式碼的方法

::: tip 🎯 零基礎必讀：看 CSS 的方法

**第一步：看選擇器——「給誰裝修？」**

| 選擇器 | 寫法 | 含義 |
|--------|------|------|
| 標籤選擇器 | `p { }` | 所有 `<p>` 標籤 |
| 類別選擇器 | `.card { }` | 所有 `class="card"` 的元素 |
| ID 選擇器 | `#header { }` | 唯一的 `id="header"` 元素 |
| 後代選擇器 | `.card h2 { }` | `.card` 裡面的所有 `<h2>` |
| 組合選擇器 | `.card, .box { }` | `.card` 或 `.box` 都選中 |

**第二步：看屬性——「裝修什麼？」**

| 屬性分類 | 常見屬性 | 作用 |
|----------|----------|------|
| 文字 | `color`, `font-size`, `font-weight` | 顏色、大小、粗細 |
| 背景 | `background`, `background-color` | 背景色、背景圖 |
| 邊框 | `border`, `border-radius` | 邊框線、圓角 |
| 間距 | `margin`, `padding` | 外邊距、內邊距 |
| 佈局 | `display`, `flex`, `grid` | 排列方式 |

**第三步：看值——「裝修成什麼樣？」**

```css
.card {
  width: 300px;        /* 固定寬度 */
  padding: 16px;       /* 內邊距 16 像素 */
  border-radius: 8px;  /* 圓角 8 像素 */
  background: #fff;    /* 白色背景 */
}
```

**常見單位**：
- `px`：像素，固定大小
- `%`：百分比，相對於父元素
- `rem`：相對於根元素字型大小
- `vw/vh`：相對於視埠寬度/高度
:::

### 3.4 選擇器優先級

如果一個元素同時被多個選擇器選中，誰說了算？

```html
<p class="highlight" id="special">這段文字是什麼顏色？</p>
```

```css
p { color: red; }             /* 優先級：1 */
.highlight { color: yellow; } /* 優先級：10 */
#special { color: blue; }     /* 優先級：100 */
```

**答案**：藍色。ID 選擇器優先級最高，類別選擇器次之，標籤選擇器最低。

**行內樣式**（寫在 style 屬性裡）優先級是 1000，最高！

### 3.5 盒模型：寬度對不上的動機

::: tip 🎯 真實場景

你做一個網頁，要求三個卡片並排顯示，每個卡片寬度 300px，容器總寬度 900px。你寫了：

```css
.card { width: 300px; }
```

結果：**第三個卡片掉到下一行了！**

**為什麼？** 因為 `width: 300px` 只是內容寬度，你忘了算 padding 和 border。如果卡片有 `padding: 20px` 和 `border: 1px`，實際寬度是 342px，三個卡片就是 1026px，超出了容器！
:::

每個 HTML 元素在 CSS 中都被看作一個「盒子」，由四層組成。想像你在**打包快遞**：內容是商品，padding 是氣泡膜，border 是紙箱，margin 是箱子之間的間隔。

👇 **動手試試看**：拖曳滑桿調節各層大小，觀察盒模型的變化：

<CssBoxModel />

**解決方案**：

```css
.box {
  box-sizing: border-box;  /* 讓 width 包含 padding 和 border */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

這樣，`width: 200px` 就是最終寬度，padding 和 border 會「擠」在裡面。

### 3.6 Flexbox：讓元素自動對齊的實作

Flexbox 是現代 CSS 最常用的佈局方式。它讓元素自動排列對齊，就像書架上的書會自動對齊一樣。

👇 **動手試試看**：切換方向、對齊方式，觀察盒子如何排列：

<CssFlexbox />

**Flex 核心概念**：

| 屬性 | 作用 | 常用值 |
|------|------|--------|
| `display: flex` | 開啟 Flex 佈局 | - |
| `flex-direction` | 主軸方向 | `row`（水平）、`column`（垂直） |
| `justify-content` | 主軸對齊 | `flex-start`、`center`、`space-between` |
| `align-items` | 交叉軸對齊 | `stretch`、`center`、`flex-start` |
| `flex-wrap` | 是否換行 | `nowrap`、`wrap` |
| `gap` | 元素間距 | `10px`、`1rem` |

### 3.7 CSS 預處理器：SCSS/SASS 與 LESS

::: tip 🎯 真實場景

你寫了一個專案，CSS 檔案有 2000 行。後來要改主題色，你發現：

- 主色調 `#3b82f6` 出現了 50 次
- 改一個顏色要全域搜尋取代，還要擔心漏改
- 選擇器寫成 `.nav .nav-list .nav-item .nav-link` 又長又難維護

**CSS 預處理器**就是來解決這些問題的。它讓 CSS 也能「程式設計」：有變數、有巢狀、能複用程式碼。
:::

#### 3.7.1 什麼是 CSS 預處理器？

**用白話解釋**：預處理器是一種「更聰明的 CSS」。你用更強大的語法寫樣式，然後它幫你**編譯**成普通 CSS，瀏覽器就能正常識別了。

**為什麼要用？**

| 痛點 | 原生 CSS | 預處理器 |
|------|----------|----------|
| 顏色重複出現 | 到處複製貼上 | 定義變數，一處修改全域生效 |
| 選擇器層級太深 | 寫成一長串 | 巢狀語法，層級一目瞭然 |
| 相同樣式重複寫 | 複製貼上 | 混入（Mixin），像函式一樣複用 |

#### 3.7.2 三大預處理器對比

| 特性 | 原生 CSS | **SCSS/SASS** | **LESS** |
|------|----------|---------------|----------|
| **變數寫法** | `--primary` | `$primary` | `@primary` |
| **巢狀語法** | ❌ 不支援 | ✅ 支援 | ✅ 支援 |
| **混入（複用程式碼）** | ❌ 不支援 | ✅ `@mixin` | ✅ `.mixin()` |
| **學習難度** | 簡單 | 中等 | 中等 |
| **流行程度** | - | ⭐⭐⭐ 最流行 | ⭐⭐ 較流行 |

**簡單記憶**：
- **SCSS**：用 `$` 符號，Bootstrap 5 在用，生態最好
- **LESS**：用 `@` 符號，和 CSS 的 `@media` 寫法一致，容易上手

#### 3.7.3 核心功能對比示例

##### 1. 變數：一處修改，全域生效

**場景**：主題色 `#3b82f6` 在 20 個地方用到，要改成紅色。

<Tabs>
<TabItem label="原生 CSS">

```css
/* 要改 20 處，容易漏 */
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
/* 改 $primary 一處即可 */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* 改 @primary 一處即可 */
```

</TabItem>
</Tabs>

##### 2. 巢狀：層級關係一目瞭然

**場景**：導覽列裡有多層結構。

<Tabs>
<TabItem label="原生 CSS">

```css
/* 寫成一長串，難看出層級關係 */
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
        &:hover { }  /* & 表示父選擇器 */
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

##### 3. 混入（Mixin）：複用程式碼片段

**場景**：多個按鈕都需要「居中顯示」的樣式。

<Tabs>
<TabItem label="原生 CSS">

```css
/* 複製貼上 3 次 */
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

#### 3.7.4 如何選擇？

| 情況 | 推薦選擇 |
|------|----------|
| 剛開始學，專案小 | **原生 CSS**（先打好基礎） |
| 專案用 Bootstrap 5 | **SCSS**（Bootstrap 原始碼是 SCSS） |
| 團隊熟悉 `@` 符號 | **LESS**（和 CSS 的 `@media` 寫法一致） |
| 需要複雜邏輯（迴圈、條件） | **SCSS**（功能更強大） |

#### 3.7.5 在專案中使用

**Vite 專案（最簡單）**：

```bash
# 安裝 sass
npm install -D sass

# 直接使用 .scss 或 .less 檔案
```

::: tip 💡 新手建議

1. **先學好原生 CSS**：預處理器只是「語法糖」，不懂 CSS 基礎會越用越亂
2. **小專案不用強上**：CSS 不到 200 行，直接寫 CSS 更簡單
3. **從 SCSS 開始**：語法和 CSS 幾乎一樣，只是多了 `$` 變數
4. **不要巢狀太深**：超過 3 層會讓程式碼難維護
:::

#### 3.7.6 不同技術棧的檔案組織對比

**同樣的專案，用不同技術棧，檔案結構有什麼不同？**

<Tabs>
<TabItem label="原生 HTML + CSS">

```
my-website/
├── index.html              # 頁面結構
├── about.html
├── css/
│   ├── reset.css           # 重置樣式
│   ├── layout.css          # 佈局樣式
│   ├── components.css      # 元件樣式
│   └── style.css           # 主樣式（可能上千行）
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**特點**：
- CSS 集中在一個或幾個檔案
- 改樣式要來回切換 HTML 和 CSS 檔案
- 樣式容易互相衝突

</TabItem>
<TabItem label="Vue + 原生 CSS">

```
src/
├── components/             # 元件資料夾
│   ├── Button/
│   │   ├── Button.vue      # 模板 + 樣式 + 邏輯
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # 頁面資料夾
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # 根元件
└── main.js                 # 入口檔案
```

**Button.vue 內部結構**：
```vue
<template>
  <button class="btn">點擊</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped 樣式只影響當前元件 -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # 變數：顏色、間距等
│       ├── _mixins.scss        # 混入：複用程式碼塊
│       ├── _functions.scss     # 函式：顏色計算等
│       └── global.scss         # 全域樣式入口
├── components/
│   ├── Button/
│   │   └── Button.vue          # 元件內用 @import 引入變數
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
  background: $primary;      // 使用變數
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # 不需要 style 塊
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# 配置檔案（根目錄）
tailwind.config.js          # 主題配置
tailwind.css                # 基礎樣式入口
```

**Button.vue**（沒有 style 塊）：
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    點擊
  </button>
</template>
```

**特點**：
- 沒有單獨的樣式檔案
- 類別名就是樣式（`bg-blue-500` = 藍色背景）
- 配置集中在 `tailwind.config.js`

</TabItem>
</Tabs>

**核心區別總結**：

| 技術棧 | 樣式檔案位置 | 主題管理 | 程式碼複用 |
|--------|-------------|----------|----------|
| 原生 HTML+CSS | 集中式 `css/` 資料夾 | 搜尋取代 | 複製貼上 |
| Vue + CSS | 分散在 `.vue` 元件內 | 搜尋取代 | 複製貼上 |
| Vue + SCSS | 元件內 + `styles/` 公共檔案 | 變數統一管理 | 混入複用 |
| Vue + Tailwind | 無（類別名裡） | `tailwind.config.js` | 類別名組合 |

### 3.8 記住這麼多 CSS 屬性的方法

::: tip 🎯 新手困惑

「CSS 屬性有好幾百個，怎麼記得住？」

**答案是：按用途分類，記住核心屬性，其他的用到再查。**
:::

#### 按用途分類記憶

**一、文字排版類（管文字長什麼樣）**

| 屬性 | 記憶口訣 | 常用值 |
|------|----------|--------|
| `color` | 顏色 | `red`、`#fff`、`rgb(0,0,0)` |
| `font-size` | 字型大小 | `16px`、`1rem`、`1.5em` |
| `font-weight` | 字重 | `normal`、`bold`、`100`-`900` |
| `font-family` | 字型 | `"微軟正黑體"`、`sans-serif` |
| `line-height` | 行高 | `1.5`、`24px` |
| `text-align` | 文字對齊 | `left`、`center`、`right` |
| `text-decoration` | 文字裝飾 | `none`、`underline`、`line-through` |

**記憶方法**：想像你在 Word 裡排版——改顏色、改大小、加粗、改字型、調行距、對齊、加底線。

**二、盒模型類（管元素佔多大空間）**

| 屬性 | 記憶口訣 | 常用值 |
|------|----------|--------|
| `width`/`height` | 寬/高 | `100px`、`50%`、`100vw` |
| `padding` | 內邊距 | `10px`、`10px 20px` |
| `margin` | 外邊距 | `10px`、`auto`（居中用） |
| `border` | 邊框 | `1px solid #ccc` |
| `border-radius` | 圓角 | `4px`、`50%`（圓形） |
| `box-sizing` | 盒模型 | `border-box`（推薦） |

**記憶方法**：padding 是「內」邊距（內容到邊框的距離），margin 是「外」邊距（邊框到其他元素的距離）。

**簡寫規則**：
```css
/* 四個值：上 右 下 左（順時針） */
padding: 10px 20px 15px 25px;

/* 兩個值：上下 左右 */
padding: 10px 20px;

/* 一個值：四個方向都一樣 */
padding: 10px;
```

**三、背景與邊框類（管元素長什麼樣）**

| 屬性 | 記憶口訣 | 常用值 |
|------|----------|--------|
| `background` | 背景 | `#fff`、`url(bg.jpg)`、`linear-gradient(...)` |
| `background-color` | 背景色 | `#fff`、`rgba(0,0,0,0.5)` |
| `background-image` | 背景圖 | `url(photo.jpg)` |
| `background-size` | 背景大小 | `cover`、`contain`、`100%` |
| `background-position` | 背景位置 | `center`、`top left` |
| `box-shadow` | 盒陰影 | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | 透明度 | `0`-`1`（0 完全透明） |

**記憶方法**：`background` 是簡寫，可以一次設定多個值：
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          顏色  圖片      是否重複   位置/大小 */
```

**四、佈局類（管元素怎麼排列）**

| 屬性 | 記憶口訣 | 常用值 |
|------|----------|--------|
| `display` | 顯示方式 | `block`、`inline`、`flex`、`grid`、`none` |
| `position` | 定位 | `static`、`relative`、`absolute`、`fixed`、`sticky` |
| `top`/`right`/`bottom`/`left` | 四個方向 | `10px`、`50%`（配合 position 使用） |
| `z-index` | 層級 | 數字越大越在上層 |
| `float` | 浮動 | `left`、`right`（老方法，不推薦） |
| `overflow` | 溢出處理 | `visible`、`hidden`、`scroll`、`auto` |

**position 記憶方法**：
- `static`：預設，正常流
- `relative`：相對於自己原來的位置偏移
- `absolute`：相對於最近的定位祖先元素定位
- `fixed`：相對於視埠定位（捲動也不動）
- `sticky`：捲動到一定位置後固定

**五、Flexbox 佈局類（一維佈局神器）**

| 屬性 | 記憶口訣 | 作用 |
|------|----------|------|
| `display: flex` | 開啟 Flex | 容器變成 Flex 容器 |
| `flex-direction` | 方向 | `row`（橫向）、`column`（縱向） |
| `justify-content` | 主軸對齊 | 元素在主軸上怎麼排 |
| `align-items` | 交叉軸對齊 | 元素在交叉軸上怎麼對齊 |
| `flex-wrap` | 換行 | `nowrap`、`wrap` |
| `gap` | 間隙 | 元素之間的間距 |
| `flex` | 彈性 | 子元素的伸縮比例 |

**記憶方法**：
- `justify` = 證明/對齊 → 主軸對齊
- `align` = 排列/對齊 → 交叉軸對齊

**六、動畫過渡類（管元素怎麼動）**

| 屬性 | 記憶口訣 | 常用值 |
|------|----------|--------|
| `transition` | 過渡 | `all 0.3s ease` |
| `transform` | 變換 | `translate(10px)`、`rotate(45deg)`、`scale(1.1)` |
| `animation` | 動畫 | `fadeIn 1s ease forwards` |

**簡寫規則**：
```css
/* transition: 屬性 時長 緩動函式 延遲 */
transition: all 0.3s ease 0s;

/* transform 可以組合多個變換 */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### 遇到不認識的屬性怎麼辦？

**方法一：猜英文單字**

很多屬性是英文單字或縮寫：
- `margin` = 邊緣、餘地
- `padding` = 填充
- `border` = 邊界
- `visibility` = 可見性
- `cursor` = 游標

**方法二：按場景聯想**

當你想實現某個效果時，想想「關鍵字」：

| 我想... | 可能的屬性 |
|---------|------------|
| 改顏色 | `color`、`background-color`、`border-color` |
| 改大小 | `width`、`height`、`font-size` |
| 改位置 | `margin`、`position`、`top/left` |
| 改間距 | `padding`、`margin`、`gap` |
| 隱藏元素 | `display: none`、`visibility: hidden`、`opacity: 0` |
| 居中 | `margin: auto`、`text-align: center`、`justify-content: center` |
| 加圓角 | `border-radius` |
| 加陰影 | `box-shadow`、`text-shadow` |
| 加動畫 | `transition`、`animation` |

**方法三：查 MDN 或問 AI**

[MDN CSS 屬性參考](https://developer.mozilla.org/zh-TW/docs/Web/CSS/Reference) 有所有屬性的詳細說明。

> 「CSS 中如何讓文字只顯示一行，超出部分用省略號？」

**方法四：用開發者工具「偷師」**

看到喜歡的網頁效果：
1. 右鍵 → 「檢查」
2. 選中元素，看 Styles 面板
3. 直接複製 CSS 屬性

#### 不用刻意背屬性

**真正的工作流程是這樣的**：

1. 你知道要「居中」 → 搜尋「CSS 居中」
2. 複製程式碼，改改數值
3. 用多了就記住了

**推薦的學習路徑**：

1. **先掌握盒模型**：`width`、`height`、`padding`、`margin`、`border`
2. **再掌握 Flexbox**：`display: flex`、`justify-content`、`align-items`
3. **然後掌握定位**：`position`、`top/left`、`z-index`
4. **最後學動畫**：`transition`、`transform`、`animation`

其他屬性用到再查，用多了自然就記住了。

---

## 4. JavaScript：網頁的大腦

### 4.1 需要 JavaScript 的動機

只有 HTML + CSS 的網頁，就像**商店櫥窗裡的模特**：

- ✅ 看起來很漂亮（CSS）
- ✅ 結構很清晰（HTML）
- ❌ 但你跟它說話，它不會回應
- ❌ 你按了按鈕，什麼也不會發生

**JavaScript** 讓網頁從「櫥窗模特」變成「真人」：

- ✅ 點擊按鈕，會彈出提示
- ✅ 輸入文字，會即時檢查格式
- ✅ 捲動頁面，會載入更多內容
- ✅ 提交表單，會顯示「正在提交...」

### 4.2 JavaScript 程式碼的格式外觀概述

**能力一：記住資料**（變數）

```javascript
let userName = '張三'
let isLoggedIn = true
let cartCount = 5
```

**能力二：重複做事**（函式）

```javascript
function sayHello(name) {
  return '你好，' + name + '！'
}

console.log(sayHello('張三'))  // 輸出：你好，張三！
```

**能力三：回應事件**（事件監聽）

```javascript
button.addEventListener('click', function() {
  alert('按鈕被點擊了！')
})
```

**能力四：修改頁面**（DOM 操作）

```javascript
document.getElementById('title').textContent = '新標題'
document.getElementById('box').style.background = 'red'
```

### 4.3 看懂 JavaScript 程式碼的方法

::: tip 🎯 零基礎必讀：看 JS 程式碼的方法

**第一步：找變數——「記住了什麼？」**

```javascript
const API_URL = 'https://api.example.com'  // 常數，不會變
let count = 0                                // 變數，會變
const user = { name: '張三', age: 25 }       // 物件，多個資料
const items = ['蘋果', '香蕉', '橘子']        // 陣列，列表資料
```

**第二步：找函式——「能做什麼？」**

```javascript
// 函式名通常能猜出用途
function handleClick() { }      // 處理點擊
function fetchData() { }        // 取得資料
function validateForm() { }     // 驗證表單
```

**第三步：找事件——「什麼時候觸發？」**

```javascript
button.addEventListener('click', handleClick)     // 點擊時
input.addEventListener('input', validateForm)     // 輸入時
window.addEventListener('scroll', loadMore)       // 捲動時
```

**第四步：找 DOM 操作——「改了什麼？」**

```javascript
element.textContent = '新內容'     // 改文字
element.classList.add('active')    // 加樣式類別
element.style.display = 'none'     // 隱藏元素
parent.appendChild(child)          // 加入元素
```
:::

### 4.4 DOM：JavaScript 操作頁面的方法

瀏覽器讀取 HTML 程式碼後，不會把它們當成一堆字串，而是在記憶體裡把它們畫成一棵「樹」：

```
Document (文件)
    ↓
<html>
    ├─<head>
    │   └─<title>我的網頁</title>
    └─<body>
        ├─<h1>歡迎</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>一段文字</p>
```

這棵樹就叫 **DOM 樹**。每個 HTML 標籤都是這棵樹上的一個「節點」。

**怎麼找到節點？**

```javascript
// 按 ID 找（最快，唯一）
const element = document.getElementById('header')

// 按選擇器找（最常用）
const element = document.querySelector('.card h2')    // 找第一個
const elements = document.querySelectorAll('button')  // 找所有

// 按關係找
element.parentNode           // 找父節點
element.children             // 找子節點
element.nextElementSibling   // 找下一個兄弟
```

**效能警告**：操作 DOM 是很**貴**的。每次修改 DOM，瀏覽器都要重新計算佈局、重新繪製。

```javascript
// ❌ 低效：迴圈 1000 次，每次都操作 DOM
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ 高效：先拼好，一次性插入
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

這也正是 **Vue / React** 等現代框架誕生的原因：它們在記憶體裡玩「虛擬 DOM」，計算好最小修改量，最後才去動真正的 DOM。

👇 **動手試試看**：DOM 操作的基本方法：

<DomManipulator />

### 4.5 ECMAScript：JavaScript 的版本演進

**ECMAScript** 是 JavaScript 的「標準說明書」。瀏覽器廠商按照這個標準來實作 JavaScript 引擎。

#### 為什麼要有版本號？

JavaScript 不是一成不變的。每年都會新增功能、修復問題。版本號告訴你「這個瀏覽器支援哪些功能」。

#### 重要版本一覽

| 版本 | 年份 | 核心特性 | 解決了什麼問題 |
|------|------|----------|----------------|
| **ES5** | 2009 | 嚴格模式、`forEach`/`map`/`filter` | 規範化語言，增加陣列方法 |
| **ES6/ES2015** | 2015 | `let/const`、箭頭函式、`class`、`Promise`、模組化 | 最大的更新，現代 JS 的起點 |
| **ES2016** | 2016 | `includes()`、`**` 冪運算 | 小更新 |
| **ES2017** | 2017 | `async/await`、`Object.entries()` | 非同步程式碼更易讀 |
| **ES2018** | 2018 | `...` 展開運算子、`Promise.finally()` | 物件和非同步增強 |
| **ES2020** | 2020 | 可選串聯 `?.`、空值合併 `??`、`BigInt` | 安全存取巢狀屬性 |
| **ES2021** | 2021 | `replaceAll()`、邏輯賦值 `??=` | 字串和賦值增強 |
| **ES2022** | 2022 | 頂層 `await`、`.at()` 索引 | 模組非同步載入更方便 |

#### ES6+ 最常用的新語法

**1. `let` 和 `const` 替代 `var`**

```javascript
// ❌ 舊寫法：var 有變數提升，容易出 bug
var name = '張三'
if (true) {
  var name = '李四'  // 覆蓋了外面的 name
}
console.log(name)  // '李四'，不是預期的結果

// ✅ 新寫法：let 有區塊級作用域
let name = '張三'
if (true) {
  let name = '李四'  // 只在這個 if 裡有效
}
console.log(name)  // '張三'，符合預期

// ✅ const：宣告後不能重新賦值
const PI = 3.14159
PI = 3  // 報錯！防止意外修改
```

**2. 箭頭函式：更簡潔的函式寫法**

```javascript
// ❌ 舊寫法
const add = function(a, b) {
  return a + b
}

// ✅ 新寫法
const add = (a, b) => a + b

// 箭頭函式的 this 綁定外層作用域
const obj = {
  name: '張三',
  // ❌ 普通函式：this 指向呼叫者
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ 箭頭函式：this 繼承自 obj
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // '張三'
    }, 100)
  }
}
```

**3. 解構賦值：從物件/陣列中提取資料**

```javascript
// 物件解構
const user = { name: '張三', age: 25, city: '北京' }
const { name, age } = user  // 直接提取
console.log(name)  // '張三'

// 陣列解構
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// 函式參數解構
function greet({ name, age }) {
  console.log(`${name} 今年 ${age} 歲`)
}
greet(user)  // '張三 今年 25 歲'
```

**4. 模板字串：字串拼接不再痛苦**

```javascript
// ❌ 舊寫法：一堆引號和加號
const msg = '使用者 ' + name + ' 的年齡是 ' + age + ' 歲'

// ✅ 新寫法：反引號 + ${}
const msg = `使用者 ${name} 的年齡是 ${age} 歲`

// 還支援多行
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>年齡：${age}</p>
  </div>
`
```

**5. `async/await`：非同步程式碼像同步一樣寫**

```javascript
// ❌ 回呼地獄
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

**6. 可選串聯 `?.` 和空值合併 `??`**

```javascript
const user = {
  name: '張三',
  address: {
    city: '北京'
  }
}

// ❌ 舊寫法：層層判斷
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : '未知'

// ✅ 新寫法：可選串聯 + 空值合併
const streetName = user?.address?.street ?? '未知'
```

::: tip 💡 如何知道瀏覽器支援哪些特性？

1. **查相容表**：[caniuse.com](https://caniuse.com/) 輸入特性名
2. **用構建工具**：Babel 可以把新語法轉成舊瀏覽器支援的程式碼
3. **看目標使用者**：如果只支援現代瀏覽器，大部分 ES6+ 特性都能直接用
:::

### 4.6 TypeScript：給 JavaScript 加上型別約束

#### 為什麼需要 TypeScript？

**場景一：函式參數型別不確定**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ 字串拼接，不是乘法
calculateTotal(100, '5')    // 500 ✅ 但這是運氣好
```

JavaScript 不會告訴你參數型別錯了，直到執行時才發現問題。

**場景二：物件屬性拼寫錯誤**

```javascript
// JavaScript
const user = {
  name: '張三',
  age: 25
}

console.log(user.nmae)  // undefined，拼寫錯誤但不報錯
```

**TypeScript 解決這些問題**：

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`你好，${user.name}`)
  console.log(user.nmae)  // ❌ 編譯時報錯：屬性 'nmae' 不存在
}

greet({ name: '張三', age: 25 })        // ✅
greet({ name: '張三', age: '25' })      // ❌ 編譯時報錯：age 應該是 number
greet({ name: '張三' })                 // ❌ 編譯時報錯：缺少 age
```

#### TypeScript 的核心概念

**1. 基本型別**

```typescript
let name: string = '張三'
let age: number = 25
let isActive: boolean = true
let anyValue: any = '可以是任何型別'  // 不推薦，失去型別檢查的意義
```

**2. 介面（Interface）：定義物件結構**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // 可選屬性
  readonly createdAt: Date  // 唯讀屬性
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. 型別別名（Type）**

```typescript
type ID = string | number  // 聯合型別
type Status = 'pending' | 'approved' | 'rejected'  // 字面量型別

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' 不是有效的 Status
```

**4. 泛型：可複用的型別**

```typescript
// 不用泛型：每個型別寫一遍
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// 用泛型：一個函式搞定
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // 回傳 number
getFirst(['a', 'b', 'c'])  // 回傳 string
```

#### TypeScript vs JavaScript 對比

| 特性 | JavaScript | TypeScript |
|------|------------|------------|
| 型別檢查 | 執行時才發現錯誤 | 編譯時就發現錯誤 |
| IDE 支援 | 基礎提示 | 智慧補全、重構、跳轉定義 |
| 學習曲線 | 簡單 | 需要學習型別系統 |
| 適用場景 | 小專案、原型 | 大型專案、團隊協作 |
| 執行方式 | 瀏覽器直接執行 | 需要編譯成 JavaScript |

#### 實際開發中的 TypeScript

```typescript
// API 回應型別定義
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

// 帶型別的 API 請求
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// 使用時 IDE 會提示所有屬性
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ IDE 自動補全
  console.log(res.data.nmae)   // ❌ 編譯時報錯
})
```

::: tip 💡 新手建議

1. **先學好 JavaScript**：TypeScript 是 JS 的超集，不懂 JS 學 TS 會很痛苦
2. **小專案不用強上 TS**：型別定義會增加程式碼量，簡單專案反而變複雜
3. **從 JSDoc 開始過渡**：在 JS 檔案裡寫 `/** @type {User} */` 註解，體驗型別提示
4. **用 `any` 是妥協，不是解決方案**：遇到型別問題先嘗試解決，不要直接 `any`
:::

### 4.7 現代 JavaScript 開發工具鏈

::: tip 🎯 為什麼需要工具鏈？

瀏覽器只認識 HTML/CSS/JS。但現代開發中，我們會用：

- **TypeScript**：瀏覽器不認識，需要編譯成 JS
- **SCSS/Less**：瀏覽器不認識，需要編譯成 CSS
- **模組化**：`import/export` 需要打包成一個檔案
- **新語法**：ES6+ 需要轉譯成舊瀏覽器支援的程式碼

工具鏈就是把這些「開發時用的程式碼」轉換成「瀏覽器能執行的程式碼」。
:::

**核心工具**：

| 工具 | 作用 | 類比 |
|------|------|------|
| **Node.js** | JavaScript 執行環境 | 讓 JS 可以脫離瀏覽器執行 |
| **npm/yarn/pnpm** | 套件管理器 | 下載別人寫好的程式碼庫 |
| **Vite/Webpack** | 構建工具 | 把原始碼打包成瀏覽器能執行的程式碼 |
| **Babel** | 編譯器 | 把新語法轉成舊語法 |
| **ESLint** | 程式碼檢查 | 發現程式碼問題和風格不一致 |

**一個典型的開發流程**：

```bash
# 1. 初始化專案
npm create vite@latest my-app -- --template vue-ts

# 2. 安裝依賴
cd my-app
npm install

# 3. 開發模式（熱更新）
npm run dev

# 4. 構建生產版本
npm run build
```

---

## 5. 三者的協作關係

### 5.1 分工對比

| 角色 | 負責什麼 | 不做什麼 | 典型示例 |
|------|----------|----------|----------|
| **HTML** | 定義結構與語意 | 不負責樣式/互動 | `<section><h1>標題</h1></section>` |
| **CSS** | 控制外觀與佈局 | 不負責邏輯/資料 | `.card { background: white; }` |
| **JavaScript** | 處理互動與邏輯 | 不負責結構定義 | `button.onclick = () => alert()` |

### 5.2 一個完整的協作示例

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS：讓卡片好看 */
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
  <!-- HTML：定義卡片結構 -->
  <div class="card">
    <h2 id="title">點擊按鈕</h2>
    <button id="btn">點我</button>
  </div>

  <script>
    // JavaScript：讓按鈕能點擊
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = '已點擊！'
      alert('標題已改變')
    })
  </script>
</body>
</html>
```

---

## 6. 不認識的程式碼故障排查

### 6.1 問 AI

> 「HTML 中的 `<aside>` 標籤是什麼意思？什麼時候用？」
>
> 「CSS 中的 `position: sticky` 是什麼效果？」

### 6.2 查 MDN

[MDN Web Docs](https://developer.mozilla.org/) 是最權威的 Web 技術文件。遇到不認識的標籤、屬性、方法，直接搜尋即可。

### 6.3 瀏覽器開發者工具

1. 右鍵點擊頁面元素 → 「檢查」
2. 在 **Elements** 面板看到 HTML 結構
3. 在 **Styles** 面板看到 CSS 樣式
4. 在 **Console** 面板可以執行 JS 程式碼

### 6.4 常見 CSS 屬性速查

| 看到這個 | 它是幹嘛的 |
|----------|------------|
| `display: flex` | 開啟彈性佈局 |
| `position: absolute` | 絕對定位 |
| `z-index: 100` | 層級，數字大的在上面 |
| `overflow: hidden` | 超出部分隱藏 |
| `cursor: pointer` | 滑鼠變成手型 |
| `transition: all 0.3s` | 動畫過渡效果 |
| `box-sizing: border-box` | 讓 width 包含 padding 和 border |

---

## 7. 名詞速查表

| 名詞 | 英文 | 用白話解釋 |
|------|------|------------|
| **HTML** | HyperText Markup Language | 超文字標記語言，用標籤描述網頁結構 |
| **CSS** | Cascading Style Sheets | 層疊樣式表，控制顏色、佈局、動畫 |
| **JavaScript** | JavaScript | 網頁的程式語言，負責互動和邏輯 |
| **DOM** | Document Object Model | 文件物件模型，用物件樹表示頁面 |
| **Flexbox** | Flexible Box Layout | 一種一維佈局方案，易於對齊與分佈 |
| **盒模型** | CSS Box Model | 元素從內容到外邊距的層層盒子 |
| **SCSS** | Sassy CSS | CSS 預處理器，支援變數、巢狀、混入 |
| **TypeScript** | TypeScript | JavaScript 的超集，增加了型別系統 |
| **ES6** | ECMAScript 2015 | JavaScript 的一個重要版本，新增很多語法 |
| **語意化** | Semantic HTML | 使用有含義的標籤（如 header）而不是 div |
| **響應式** | Responsive Design | 頁面自動適配不同螢幕尺寸的設計 |

---

## 總結

現在你已經知道：**HTML 定義骨架，CSS 負責顏值，JavaScript 賦予靈魂**。

這三者是 Web 開發的基石。理解了它們，你就能：

- 看懂任何網頁的原始碼（右鍵 → 「查看網頁原始碼」）
- 修改別人的網頁（瀏覽器 DevTools → Elements）
- 開始學習前端框架（Vue/React），它們都是基於這三者的

**下一步建議**：

- 如果你想快速做出網頁，可以學習 **Vue** 或 **React** 框架
- 如果你想深入理解 CSS，可以學習 **Flexbox** 和 **Grid** 佈局
- 如果你想提升程式碼品質，可以學習 **TypeScript**
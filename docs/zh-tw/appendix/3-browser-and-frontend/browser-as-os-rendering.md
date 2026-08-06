# 瀏覽器渲染原理
::: tip 🎯 核心問題
**為什麼有些網頁流暢如絲，有些卻卡成 PPT？** 瀏覽器是怎麼把一堆 HTML、CSS、JavaScript 程式碼變成你眼前看到的網頁的？本章將帶你深入瀏覽器的「車間」，理解它的工作流程，從而寫出效能更好的網頁。
:::

**這篇文章會帶你學什麼？**

| 章節 | 內容 | 學完能幹嘛 |
|-----|------|-----------|
| **第 1 章** | 為什麼要理解渲染管線 | 理解效能最佳化的必要性 |
| **第 2 章** | 渲染管線的五個階段 | 掌握瀏覽器渲染的基本流程 |
| **第 3 章** | 構建 DOM 樹和 CSSOM 樹 | 理解 HTML 和 CSS 如何被解析 |
| **第 4 章** | 構建渲染樹 | 知道哪些元素會被渲染 |
| **第 5 章** | 佈局與重排 | 避免觸發昂貴的佈局計算 |
| **第 6 章** | 繪製與重繪 | 減少不必要的繪製操作 |
| **第 7 章** | 合成與 GPU 加速 | 利用 GPU 提升動畫效能 |
| **第 8 章** | 事件迴圈 | 理解 JavaScript 的執行機制 |
| **第 9 章** | 效能最佳化實戰 | 掌握常用的效能最佳化技巧 |

每一章都從「理解原理」開始，不需要你會手寫最佳化程式碼。遇到效能問題時，隨時回來查就行。

---

## 1. 要理解「渲染管線」的動機

### 1.1 從「能跑」到「跑得快」：前端開發的進階之路

剛開始學前端時，我們只關心程式碼「能不能跑」——頁面能顯示出來，按鈕能點擊，就算成功了。但隨著專案變大，使用者變多，你很快會發現一個殘酷的現實：**同樣的功能，有人寫的頁面絲般順滑，有人寫的卻卡頓到使用者想摔滑鼠**。

這就像學開車。新手只關心「車能不能開動」，但老司機會關心「什麼時候該換檔、什麼時候該煞車、怎麼開最省油」。瀏覽器就是你開的那輛「車」，理解它的「工作習性」，你才能開得又快又穩。

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐢 新手思維（只關注功能）**
- 只要頁面能顯示就行
- 卡頓是瀏覽器的問題
- 效能最佳化是後期才考慮的事

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 進階思維（關注體驗）**
- 流暢度是使用者體驗的核心
- 理解瀏覽器工作流程
- 寫程式碼時就考慮效能

</div>
</div>

**理解渲染管線，就是從「能跑」到「跑得快」的關鍵一步。**

### 1.2 案例：「最佳化」後反而更卡了的動機

::: warning 小張的效能踩坑記
小張是一家電商公司的前端工程師，負責最佳化商品詳情頁。這個頁面展示商品資訊時卡得要死，使用者投訴不斷。

小張想：「頁面卡應該是因為 DOM 太多了，我先用 `display:none` 隱藏起來，修改完再顯示，這樣瀏覽器就不會重複渲染了吧？」

於是他寫了這樣的程式碼：

```javascript
// 你以為的「最佳化」
const container = document.getElementById('list')
container.style.display = 'none'  // 先隱藏，應該不會觸發渲染了吧？

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // 隨機寬度
  container.appendChild(item)
}

container.style.display = 'block'  // 最後顯示，一次性渲染
```

結果測試後發現，頁面**更卡了**！小張懵了：明明已經「最佳化」了，為什麼反而更慢？

後來前端負責人看了程式碼，點出問題所在：**雖然元素被隱藏了，但你每次修改 `style.width` 仍然會觸發瀏覽器的樣式計算和佈局標記，瀏覽器在背景做了大量無用功**。

正確的做法是用 `DocumentFragment` 在記憶體中批次操作，最後一次性插入 DOM，只觸發一次渲染。
:::

::: info 💡 核心啟示
不了解瀏覽器的工作流程，你可能會「自作聰明」地寫出一堆「最佳化程式碼」，結果反而讓效能更差。**理解渲染管線，你才知道哪些操作是昂貴的、哪些是廉價的，從而避免在錯誤的地方用力。**
:::

---

## 2. 核心概念：渲染管線 概述

::: tip 🤔 什麼是「渲染」？
**渲染（Rendering）**，簡單說就是瀏覽器把程式碼「畫」成你看到的網頁的過程。

你可以把它想像成**印刷廠印書**：
- **HTML** = 書稿內容（文字、圖片、章節）
- **CSS** = 排版要求（字型大小、顏色、間距）
- **JavaScript** = 動態修改（作者臨時改稿、調整排版）

瀏覽器拿到這些「材料」後，要經過一道道「工序」，最後才能「印刷」出你看到的網頁。這一系列工序，就是**渲染管線（Rendering Pipeline）**。
:::

為了幫你更好地理解，我們用一家**麵包店**來比喻瀏覽器的渲染流程。

### 2.1 用麵包店比喻理解渲染管線

想像你在經營一家麵包店，每天要為顧客製作各種麵包。這個過程中涉及到的環節，與瀏覽器的渲染流程驚人地相似：

| 階段 | 🥖 麵包店比喻 | 瀏覽器實際工作 | 具體例子 |
|------|-------------|--------------|----------|
| **1. 準備食材** | 整理原料清單（麵粉、雞蛋、奶油...） | **構建 DOM 樹**：把 HTML 解析成樹形結構 | 你寫 `<div><p>Hello</p></div>`，瀏覽器解析成 `div→p→"Hello"` 的樹 |
| **2. 準備配方** | 整理配方卡（每種麵包的配料比例） | **構建 CSSOM 樹**：把 CSS 解析成規則樹 | 你寫 `.title { color: red }`，瀏覽器記錄「`.title` 的文字是紅色」 |
| **3. 制定計劃** | 根據原料和配方，決定今天要做什麼麵包 | **構建渲染樹**：合併 DOM 和 CSSOM，只保留可見元素 | `<script>` 標籤不顯示，所以不在渲染樹裡 |
| **4. 擺放位置** | 把麵包擺到展示櫃，決定每個麵包放哪 | **佈局（Layout）**：計算每個元素的尺寸和位置 | 算出「這個 div 寬 200px、高 100px，在螢幕的 (50, 50) 位置」 |
| **5. 上色裝飾** | 給麵包刷蛋液、撒芝麻、擠奶油 | **繪製（Paint）**：把元素的顏色、邊框、陰影等「畫」出來 | 把「紅色文字」真正畫到螢幕上 |
| **6. 組裝完成** | 把所有麵包層疊在一起，擺成漂亮的樣子 | **合成（Composite）**：把多個圖層合併成最終畫面 | GPU 把背景層、文字層、圖片層合併成一張完整畫面 |

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表，理解渲染管線的每個階段：

**階段 1-2（準備階段）**：瀏覽器先「看懂」你的程式碼。HTML 和 CSS 是分開解析的，因為它們職責不同——HTML 決定「有什麼內容」，CSS 決定「長什麼樣」。

**階段 3（合併階段）**：為什麼要「合併」？因為不是所有 HTML 元素都會顯示（比如 `<head>`、`<script>`），瀏覽器需要把「可見元素」和「它們的樣式」結合在一起，形成一張「施工圖」。

**階段 4-5（繪製階段）**：佈局是「算位置」，繪製是「上顏色」。佈局改變（比如改寬度）會導致繪製，但繪製改變（比如改顏色）不會導致佈局。

**階段 6（合成階段）**：現代瀏覽器的「魔法」。傳統方式是「一次性畫完」（CPU 慢），現代方式是「分層繪製 + GPU 合成」（快），這就是為什麼 `transform` 動畫比 `width` 動畫流暢的原因。
:::

### 2.2 渲染管線的五個階段

<RenderingPipelineDemo />

---

## 3. 第一階段：構建 DOM 樹和 CSSOM 樹

### 3.1 要「樹」化的動機

::: tip 🤔 什麼是 DOM？
**DOM（Document Object Model，文件物件模型）**，是瀏覽器把 HTML 文件轉換成的一種樹形結構，方便 JavaScript 操作頁面元素。

你可以把它想像成**家譜樹**：
- 最頂端是「祖先」（`<html>`）
- 下面是「子代」（`<body>`、`<head>`）
- 再下面是「孫代」（`<div>`、`<p>`、`<span>`）

**為什麼要轉成樹？** 因為樹形結構很方便「尋找」和「修改」。比如你想找到「所有 class 是 `title` 的元素」，瀏覽器可以在樹上快速搜尋，而不是從一堆亂七八糟的文字裡慢慢找。
:::

瀏覽器拿到 HTML 後，不會馬上顯示，而是要先「理解」它。這個過程分為三步：

**第一步：詞法分析——把程式碼拆成「詞」**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

瀏覽器看到這段程式碼，會先「拆詞」：
- `<div>` → 「開始標籤 div」
- `class="container"` → 「屬性 class，值 container」
- `<p>` → 「開始標籤 p」
- `Hello World` → 「文字內容」
- `</p>` → 「結束標籤 p」
- `</div>` → 「結束標籤 div」

**第二步：語法分析——把「詞」組裝成「節點」**

瀏覽器根據 HTML 規則，把這些「詞」組裝成「節點」：
- 元素節點：`<div>`、`<p>`
- 屬性節點：`class="container"`
- 文字節點：`"Hello World"`

**第三步：構建樹——建立「父子關係」**

最後，瀏覽器根據標籤的巢狀關係，構建出樹形結構：

```
Document（文件根節點）
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 CSSOM 樹：樣式的「規則手冊」

::: tip 🤔 什麼是 CSSOM？
**CSSOM（CSS Object Model，CSS 物件模型）**，是瀏覽器把 CSS 規則轉換成的樹形結構，用來計算每個元素的最終樣式。

你可以把它想像成**服裝搭配指南**：
- 上層規則（body 的字型）會影響下層（所有子元素）
- 如果有衝突（比如同一元素多個規則指定不同顏色），要按「優先順序」決定用哪個
- 最終算出每個元素該穿什麼「衣服」
:::

CSSOM 的構建過程和 DOM 類似，但有一個關鍵區別：**CSS 是「繼承」和「層疊」的**。

::: details 查看 CSSOM 構建過程
**原始 CSS：**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* 會覆蓋 body 的 color */
}

.container p {
  font-weight: bold;
}
```

**構建後的 CSSOM 樹：**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (優先順序更高，覆蓋 body 的 color)
    └── p
        └── font-weight: bold
```
:::

### 3.3 問題案例：我的 CSS「不生效」

**坑一：CSS 選擇器權重衝突**

::: details 查看常見錯誤
```css
/* 你寫的 CSS */
#header { color: red; }      /* id 選擇器，權重 100 */
.title { color: blue; }     /* class 選擇器，權重 10 */

/* HTML */
<div id="header" class="title">這段文字是什麼顏色？</div>
```

你以為是藍色，結果是**紅色**。因為 id 選擇器的權重（100）比 class 選擇器（10）高。
:::

**坑二：HTML 標籤沒閉合，瀏覽器「自動修復」**

::: details 查看瀏覽器如何修復錯誤 HTML
```html
<!-- 你寫的 HTML -->
<div>
  <p>這是一段文字
</div>

<!-- 瀏覽器修復後 -->
<div>
  <p>這是一段文字</p>  <!-- 瀏覽器自動幫你閉合標籤 -->
</div>
```

瀏覽器很「寬容」，會自動修復你的錯誤。但這種寬容是有代價的——瀏覽器需要額外計算來猜測你的意圖，**會影響效能**。
:::

<DomToRenderTreeDemo />

---

## 4. 第二階段：構建渲染樹

### 4.1 需要「渲染樹」的動機

你可能會問：**「已經有了 DOM 樹和 CSSOM 樹，為什麼還要再構建一個渲染樹？直接用 DOM 不行嗎？」**

答案是：**DOM 樹包含了太多「無用」資訊**。

比如下面這段 HTML：

```html
<html>
<head>
  <title>頁面標題</title>
  <style>/* CSS 程式碼 */</style>
  <script>/* JavaScript 程式碼 */</script>
</head>
<body>
  <div class="container">
    <p>可見內容</p>
  </div>
  <div style="display: none">
    <p>隱藏內容（display:none）</p>
  </div>
</body>
</html>
```

**DOM 樹會包含所有元素**：
- `<head>`、`<title>`、`<style>`、`<script>`（這些不顯示）
- `display: none` 的 div（也不顯示）

但**渲染樹只包含「要畫到螢幕上」的元素**：
- 去掉 `<head>` 及其子元素
- 去掉 `display: none` 的 div

### 4.2 渲染樹的構建規則

瀏覽器在構建渲染樹時，會遵循一套規則：

| 場景 | 處理方式 | 範例 | 效能影響 |
|------|---------|------|----------|
| `display: none` | **完全排除**出渲染樹 | 元素及其子元素都不可見 | ✅ 減少渲染工作量 |
| `visibility: hidden` | **包含在渲染樹中**，但不繪製 | 佔據空間，但完全透明 | ⚠️ 仍需佈局計算 |
| `opacity: 0` | **包含在渲染樹中**，但透明 | 可互動（能點擊），但看不見 | ⚠️ 仍需佈局計算 |
| 不在視埠內 | **包含在渲染樹中**，暫不繪製 | 捲動到視埠時才繪製 | ⚠️ 但仍在渲染樹中 |

::: tip 📊 從表格中你能看到什麼？
**關鍵發現**：`display: none` 是唯一「真正省效能」的隱藏方式，因為元素完全不在渲染樹裡，瀏覽器不會為它做任何佈局和繪製工作。

而 `visibility: hidden` 和 `opacity: 0` 雖然「看不見」，但仍在渲染樹中，瀏覽器仍需計算它們的佈局（佔據空間）。如果你需要「隱藏但不影響佈局」（比如做淡入淡出動畫），可以用 `opacity`；如果需要「完全隱藏且不佔空間」，用 `display: none`。
:::

### 4.3 問題案例：設定了 display:none，頁面還是卡

::: danger ❌ 常見誤區：以為 display:none 的元素「不存在」
很多人以為設定 `display: none` 後，元素就「消失」了，怎麼操作都不會影響效能。這是**錯誤**的！

雖然 `display: none` 的元素不在渲染樹中，但你透過 JavaScript 修改它的屬性時，瀏覽器仍需要：
1. **重新計算樣式**（匹配 CSS 規則）
2. **追蹤變化**（為未來顯示做準備）

看下面這個「最佳化」例子：
:::

::: details 查看「無效最佳化」的程式碼
```javascript
// ❌ 你以為的「最佳化」：先隱藏，修改完再顯示
const container = document.getElementById('list')
container.style.display = 'none'

// 瘋狂操作 DOM
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // 改變寬度！
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// 問題：每次修改 style.width，瀏覽器都要重新計算樣式，
// 即使元素是 display:none！
```

**✅ 正確的最佳化姿勢：**
```javascript
// 使用 DocumentFragment 批次操作
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // 虛擬容器

// 所有操作都在記憶體中的 fragment 上進行
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // 不影響真實 DOM
}

// 一次性插入真實 DOM，只觸發一次渲染
container.appendChild(fragment)
```
:::

---

## 5. 第三階段：佈局與重排

### 5.1 佈局 概述

::: tip 🤔 什麼是佈局（Layout）？
**佈局**，也叫**回流（Reflow）**，是瀏覽器計算渲染樹中每個元素「在什麼位置、佔多大空間」的過程。

你可以把它想像成**裝潢設計師測量房間**：
- 先測量每個房間的長寬
- 決定傢俱擺在哪裡
- 算出每個傢俱的座標

**為什麼佈局很「貴」？** 因為一個元素的變化可能影響其他元素。比如你把一個 div 變寬了，它旁邊的 div 可能被擠下去，導致整個頁面重新計算。
:::

### 5.2 觸發重排的「雷區」

以下是常見的會觸發重排的操作，**建議收藏並背誦**：

| 類別 | 屬性/操作 | 效能影響 | 替代方案 |
|------|----------|----------|----------|
| **尺寸** | `width`, `height`, `min/max-width/height` | 💀💀💀 | 用 `transform: scale()` 代替 |
| **位置** | `top`, `right`, `bottom`, `left` | 💀💀💀 | 用 `transform: translate()` 代替 |
| **邊距** | `margin`, `padding` | 💀💀 | 用 `transform` 或 `gap` 代替 |
| **邊框** | `border-width` | 💀💀 | 盡量避免頻繁修改 |
| **內容** | 文字內容變化、圖片載入 | 💀💀 | 預留空間，避免佈局抖動 |
| **字型** | `font-size`, `line-height` | 💀💀💀 | 盡量避免頻繁修改 |
| **顯示** | `display` 值改變 | 💀💀💀 | 用 `visibility` 或 `opacity` 代替（如不需要完全隱藏） |
| **查詢** | `offsetWidth`, `offsetHeight` 等 | 💀💀💀💀💀 | **批次讀取，避免佈局抖動** |

::: tip 📊 從表格中你能看到什麼？
**關鍵發現**：
1. **幾何屬性（寬高位置）最昂貴**：它們會觸發完整的佈局計算
2. **查詢屬性比修改更危險**：讀取 `offsetWidth` 會**強制同步佈局**（詳見 5.4 節）
3. **transform 和 opacity 是效能最好的**：它們不觸發重排，只觸發合成
:::

### 5.3 問題案例：我的動畫卡成 PPT

**坑：用 width 做動畫**

::: details 查看效能差的動畫程式碼
```css
/* ❌ 壞的動畫：觸發重排 */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* 改變寬度會觸發重排！ */
}
```

每一幀動畫都會觸發重排，瀏覽器需要：
1. 重新計算寬度
2. 重新計算位置（可能影響其他元素）
3. 重新繪製

**✅ 好的動畫：用 transform**
```css
/* ✅ 好的動畫：只觸發合成 */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* 縮放不觸發重排！ */
}
```

`transform` 直接由 GPU 處理，不會觸發重排和重繪，動畫絲般順滑。
:::

### 5.4 效能殺手：強制同步佈局

::: danger 💀 最危險的效能問題：佈局抖動
**強制同步佈局（Forced Synchronous Layout）**，也叫**佈局抖動（Layout Thrashing）**，是最常見也是最嚴重的效能問題。

它的原因是：**JavaScript 在讀取佈局屬性（如 `offsetWidth`）時，瀏覽器必須立即執行佈局計算，才能返回準確值。**

如果你「讀寫交替」，就會導致瀏覽器反覆「佈局→讀取→佈局→讀取」，形成惡性循環。
:::

::: details 查看佈局抖動的程式碼
```javascript
// ❌ 極壞：讀寫交替，導致佈局抖動
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // 讀取 → 強制佈局
  elements[i].style.width = (height * 2) + 'px'  // 寫入 → 標記需要重排
  // 下一次迴圈的讀取又會強制佈局...惡性循環！
}

// 如果有 100 個元素，就會觸發 100 次佈局計算！
```

**✅ 正確的最佳化姿勢：讀寫分離**
```javascript
const elements = document.querySelectorAll('.item')

// 第一步：批次讀取（先全部讀完）
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // 只觸發一次佈局
}

// 第二步：批次寫入（再全部寫）
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // 只觸發一次重排
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. 第四階段：繪製與重繪

### 6.1 繪製 概述

::: tip 🤔 什麼是繪製（Paint）？
**繪製**，是瀏覽器把「佈局計算好」的元素真正「畫」到螢幕上的過程。

你可以把它想像成**給房間刷漆**：
- 佈局階段 = 量尺寸、畫線
- 繪製階段 = 真正刷漆、貼壁紙

**繪製沒有佈局那麼昂貴，但也不便宜。** 頻繁繪製仍會影響效能，尤其是複雜元素（陰影、漸層等）。
:::

### 6.2 觸發重繪的訊號

與重排不同，重繪只涉及「外觀」的改變，不涉及「幾何」的改變：

| 類別 | 屬性 | 效能影響 | 備註 |
|------|------|----------|------|
| **顏色** | `color`, `background-color` | 💀 | 最常見的重繪觸發者 |
| **背景** | `background-image`, `background-position` | 💀💀 | 圖片比純色慢 |
| **邊框** | `border-color`, `border-style` | 💀 | 改變邊框顏色/樣式 |
| **文字** | `text-decoration`, `text-shadow` | 💀💀 | 陰影比純文字慢 |
| **盒陰影** | `box-shadow` | 💀💀💀 | 複雜的陰影很慢 |
| **圓角** | `border-radius` | 💀 | 改變圓角大小 |
| **透明度** | `opacity` | ✅ | **特殊：不觸發重繪，只觸發合成** |

::: tip 📊 從表格中你能看到什麼？
**關鍵發現**：`opacity` 是特殊的！它和 `transform` 一樣，不會觸發重繪，而是直接觸發合成階段。這就是為什麼用 `opacity` 做淡入淡出動畫效能最好的原因。

另外，**陰影和漸層比重繪更昂貴**，因為它們需要複雜的像素計算。如果你的頁面有很多 `box-shadow`，考慮用偽元素或圖片代替。
:::

### 6.3 問題案例：我的 hover 效果卡

**坑：用 box-shadow 做 hover 動畫**

::: details 查看效能差的 hover 效果
```css
/* ❌ 壞的 hover 效果：box-shadow 動畫很慢 */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* 陰影很慢！ */
}
```

`box-shadow` 需要逐像素計算，動畫時會卡頓。

**✅ 好的做法：用 transform 或偽元素**
```css
/* ✅ 好的 hover 效果：用 transform */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* 只在 hover 時改陰影，不做動畫 */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. 第五階段：合成與 GPU 加速

### 7.1 合成 概述

::: tip 🤔 什麼是合成（Composite）？
**合成**，是現代瀏覽器的「魔法」，它把頁面的不同部分分成多個**層（Layer）**，然後利用 **GPU（圖形處理器）**來並行合成最終的畫面。

你可以把它想像成 **Photoshop 的圖層**：
- 傳統方式 = 所有東西畫在一層上（CPU 序列，慢）
- 合成方式 = 分層畫，最後合併（GPU 並行，快）

**為什麼合成快？** 因為 GPU 擅長處理「圖像合成」這種並行任務，比 CPU 快幾十倍。
:::

### 7.2 元素會被提升到「合成層」的範圍界定

瀏覽器會自動將某些元素提升到獨立的合成層。以下是常見的觸發條件：

| 觸發條件 | CSS 屬性/值 | 效能影響 | 注意事項 |
|---------|-----------|----------|----------|
| **3D 變換** | `transform: translate3d()`, `rotate3d()` | ✅✅✅ | 動畫效能最佳 |
| **硬體加速 hack** | `transform: translateZ(0)` | ✅✅ | 俗稱「強制 GPU 加速」 |
| **透明度動畫** | `opacity` 變化（配合動畫） | ✅✅✅ | 不觸發重繪 |
| **固定定位** | `position: fixed` | ✅ | 避免捲動時重複佈局 |
| **Will-Change** | `will-change: transform, opacity` | ✅✅ | 提前建立層，注意記憶體 |
| **Canvas/WebGL** | `<canvas>`, WebGL 內容 | ✅✅ | 天然在獨立層中 |
| **Video** | `<video>` | ✅✅ | 獨立層，防止相互影響 |

::: tip 📊 從表格中你能看到什麼？
**關鍵發現**：`transform` 和 `opacity` 是效能最好的動畫屬性，因為它們不觸發重排和重繪，直接觸發合成。這就是為什麼效能最佳化指南總是說「用 transform 和 opacity 做動畫」。

但要注意：**每個合成層都要佔用 GPU 記憶體**，濫用 `translateZ(0)` 會導致記憶體爆炸（詳見 7.4 節）。
:::

### 合成層過多的效能瓶頸分析

::: danger 💀 過度最佳化的陷阱
有人聽說「GPU 加速快」，就給所有元素都加 `transform: translateZ(0)`，結果頁面反而更卡了。

**問題原因**：
每個合成層需要在 GPU 中儲存一份「紋理」（點陣圖），佔用記憶體。如果一個頁面有 100 個合成層，GPU 記憶體可能被撐爆，導致低端裝置崩潰或降級到 CPU 渲染。
:::

::: details 查看「過度最佳化」的程式碼
```css
/* ❌ 錯誤做法：給所有元素都開啟 GPU 加速 */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100 個元素都加 ... */

/* 結果：GPU 記憶體爆炸，頁面卡死 */
```

**✅ 正確的做法：按需使用**
```css
/* 策略 1：只給真正需要動畫的元素開啟 */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* 自動建立合成層 */
}

/* 策略 2：用 will-change 提示瀏覽器 */
.card {
  will-change: transform;  /* 提前建立層 */
}

/* 策略 3：動畫結束後移除 */
.card:not(:hover) {
  will-change: auto;  /* 釋放 GPU 記憶體 */
}
```
:::

<CompositeDemo />

---

## 8. 事件迴圈：JavaScript 的「分身術」

::: tip 🤔 什麼是事件迴圈？
**事件迴圈（Event Loop）**，是 JavaScript 實現「非同步」的機制。因為 JavaScript 是**單執行緒**的（一次只能做一件事），但它又要處理使用者點擊、網路請求、定時器等多種任務，所以需要一套「排程系統」來管理這些任務。

你可以把它想像成**快遞分揀中心**：
- **Call Stack（呼叫堆疊）** = 目前正在處理的快遞
- **Web APIs** = 外部合作倉庫（定時器、網路請求等）
- **Callback Queue（回呼佇列）** = 待處理的快遞架
- **Event Loop（事件迴圈）** = 分揀機器人（不斷檢查「是否可以處理下一個任務」）
:::

### 8.1 巨集任務與微任務

早期的 JavaScript 只有一套任務佇列。但隨著非同步程式設計變複雜，瀏覽器引入了兩類任務：

| 類型 | 常見來源 | 優先順序 | 執行時機 |
|------|---------|--------|----------|
| **巨集任務** | `setTimeout`/`setInterval`、I/O 操作、UI 渲染 | 低 | 每個事件迴圈週期執行一個 |
| **微任務** | `Promise.then`、`MutationObserver` | 高 | 目前巨集任務結束後，立即清空所有微任務 |

**執行順序的「口訣」**：

```
1. 執行目前巨集任務（比如 <script> 整體）
2. 執行過程中產生的所有微任務（Promise.then 等）
   ↳ 微任務可以產生新的微任務，全部清空後才繼續
3. 如果有需要，進行 UI 渲染（重排/重繪）
4. 開啟下一輪事件迴圈，執行下一個巨集任務
```

### Promise 與 setTimeout 的排程優先級比較

::: danger ❌ 常見誤解：setTimeout(fn, 0) 會「立即」執行
很多人以為 `setTimeout(fn, 0)` 是「0 毫秒後立即執行」，這是**錯誤**的理解。

實際上，`setTimeout(fn, 0)` 的含義是：**「至少等待 0 毫秒後，將回呼加入巨集任務佇列」**。但它需要等待目前呼叫堆疊清空、微任務佇列清空、可能的 UI 渲染完成後，才能執行。
:::

::: details 查看執行順序
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// 你以為的輸出順序：
// 1. Start
// 4. End
// 2. setTimeout callback  ← setTimeout(0) 不是立即嗎？
// 3. Promise.then

// 實際的輸出順序：
// 1. Start
// 4. End
// 3. Promise.then         ← Promise.then 比 setTimeout 先執行！
// 2. setTimeout callback
```

**執行流程圖解：**
```
呼叫堆疊（Call Stack）          巨集任務佇列                  微任務佇列
                              [setTimeout callback]         [Promise.then callback]

1. console.log('1. Start')
   → 輸出: 1. Start

2. setTimeout(fn, 0)
   → 將回呼加入巨集任務佇列      ← [setTimeout callback]

3. Promise.resolve().then()
   → 將回呼加入微任務佇列                                   ← [Promise.then callback]

4. console.log('4. End')
   → 輸出: 4. End

5. 呼叫堆疊清空，檢查微任務佇列
   → 發現 Promise.then 回呼
   → 執行: console.log('3. Promise.then')
   → 輸出: 3. Promise.then

6. 微任務佇列清空
   → 可能需要 UI 渲染（如果有變化）

7. 檢查巨集任務佇列
   → 發現 setTimeout 回呼
   → 執行: console.log('2. setTimeout callback')
   → 輸出: 2. setTimeout callback
```
:::

::: tip 💡 核心啟示
**微任務比巨集任務「更急」**。如果你希望某個操作在「目前程式碼區塊結束後、但 UI 更新前」盡快執行，用 `Promise.then` 或 `queueMicrotask`。

`setTimeout(0)` 不保證立即執行，它至少會被延遲到目前呼叫堆疊清空、微任務佇列清空之後。
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. 效能最佳化實戰：讓你的網頁「飛」起來

理解了渲染管線的工作流程後，我們來看看如何最佳化。以下是五個最實用的最佳化技巧。

### 9.1 黃金法則：避免強制同步佈局

**問題**：交替讀取和寫入佈局屬性，導致佈局抖動。

::: details 查看最佳化前後對比
```javascript
// ❌ 極壞：讀寫交替，導致佈局抖動
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // 讀取 → 強制佈局
  elements[i].style.height = (height * 2) + 'px'  // 寫入 → 標記需要重排
  // 下一次迴圈的讀取又會強制佈局...惡性循環！
}

// ✅ 極好：先全部讀取，再全部寫入
// 第一步：批次讀取
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// 第二步：批次寫入
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 使用 transform 和 opacity 做動畫

**問題**：用 `width`、`height`、`left`、`top` 做動畫會觸發重排。

::: details 查看最佳化前後對比
```css
/* ❌ 壞的動畫：觸發重排 */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* ✅ 好的動畫：只觸發合成 */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 虛擬捲動：解決大資料列表

**問題**：列表項數量達到數千時，DOM 節點數量過多導致效能問題。

**核心思想**：只渲染視埠內可見的列表項（加上少量緩衝），DOM 節點數量固定，與資料總量無關。

<RenderingPerformanceDemo />

::: details 查看虛擬捲動的實作
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- 佔位元素，撐起捲軸 -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- 實際渲染的列表項 -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // 緩衝數量

// 可視區域能顯示多少項
const visibleCount = computed(() => 10)

// 起始索引
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// 結束索引
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// 目前可視的資料
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// 總高度
const totalHeight = computed(() => props.items.length * props.itemHeight)

// 偏移量
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 防抖與節流：減少事件觸發頻率

**問題**：頻繁觸發的事件（如 scroll、resize）會導致效能問題。

::: details 查看防抖與節流的實作
```javascript
// 防抖（Debounce）：延遲執行，如果在延遲時間內再次觸發，則重新計時
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 節流（Throttle）：固定時間間隔執行
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// 使用範例
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 延遲載入：延遲載入非關鍵資源

**問題**：首屏載入太多資源導致頁面開啟慢。

::: details 查看延遲載入的實作
```javascript
// 圖片延遲載入
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // 載入真實圖片
      img.removeAttribute('data-src')
      observer.unobserve(img)  // 停止觀察
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. 你現在應該能識別的效能問題

理解了瀏覽器的渲染管線後，你應該能識別以下常見的效能問題：

| 問題程式碼 | 問題所在 | 如何描述給 AI |
|---------|---------|-------------|
| `element.style.width = ...` | 在迴圈中頻繁修改寬度 | "這裡會觸發多次重排，請改用 transform 或者批次處理" |
| `height = element.offsetHeight` | 在寫入後立即讀取佈局屬性 | "這是強制同步佈局，請分離讀寫操作" |
| `element.className = ...` | 頻繁修改 class 觸發樣式重新計算 | "用 classList.add/remove 代替，減少樣式計算" |
| 動畫用 `width`/`left` | 觸發重排和重繪，效能差 | "改用 transform 和 opacity 做動畫" |
| 給所有元素加 `translateZ(0)` | 濫用 GPU 加速導致記憶體爆炸 | "只給需要動畫的元素開啟 GPU 加速" |
| 列表項 10000 個全渲染 | DOM 節點過多導致卡頓 | "實作虛擬捲動，只渲染可見區域" |
| scroll 事件裡直接操作 DOM | 觸發頻率太高導致卡頓 | "用 requestAnimationFrame 或節流最佳化" |
| `box-shadow` 做 hover 動畫 | 複雜的陰影計算很慢 | "改用 transform 或偽元素，避免動畫陰影" |

**如果你認真讀了每一章的「踩坑實錄」，你還掌握了這些核心概念：**

- **渲染管線五階段**：DOM/CSSOM → 渲染樹 → 佈局 → 繪製 → 合成
- **重排 vs 重繪**：重排最昂貴（幾何變化），重繪次之（外觀變化）
- **強制同步佈局**：讀寫交替會導致佈局抖動，必須分離
- **GPU 加速**：transform 和 opacity 由 GPU 處理，效能最佳
- **事件迴圈**：JavaScript 是單執行緒的，透過任務佇列實現非同步

這些概念會幫你快速定位效能瓶頸。

::: info 💡 遇到效能問題時這樣跟 AI 說
- "動畫卡頓，檢查是否觸發了重排或重繪"
- "捲動效能差，可能需要節流或 requestAnimationFrame"
- "列表資料量大時卡頓，需要虛擬捲動"
- "頻繁修改樣式導致效能問題，請用 transform 最佳化"
:::

---

## 11. 總結：渲染管線最佳化的本質

透過本文的學習，我們可以得出以下核心結論：

**從實踐來看**：不是最佳化越多越好，而是最佳化越「對位」越好。理解瀏覽器的渲染管線，才能知道在哪裡用力、在哪裡放手。

**從成本視角看**：
- 大部分效能浪費來自對佈局屬性的**頻繁讀寫交替**，需要透過讀寫分離、批次處理來解決
- 複雜的動畫效果如果觸發了重排和重繪，往往源於使用了「錯誤的屬性」，需要透過 `transform` 和 `opacity` 來解決
- 面對大量資料的列表渲染，單純依靠虛擬 DOM 已經不夠，必須結合**虛擬捲動**等技術

**目標是：在給定的瀏覽器和硬體條件下，讓每一個渲染步驟的投入都具備明確的效能收益。**

---

## 12. 名詞對照表

| 英文術語 | 中文對照 | 解釋 |
| :--- | :--- | :--- |
| **DOM** | 文件物件模型 | 瀏覽器將 HTML 文件解析後形成的樹形結構，JavaScript 可以透過 DOM API 操作頁面元素 |
| **CSSOM** | CSS 物件模型 | 瀏覽器將 CSS 解析後形成的樹形結構，與 DOM 結合用於計算最終樣式 |
| **Render Tree** | 渲染樹 | 由 DOM 樹和 CSSOM 樹合併而成，只包含可見節點，用於後續的佈局計算和繪製 |
| **Layout** | 佈局 | 計算渲染樹中每個節點的幾何資訊（位置、大小）的過程，也稱為 Reflow（重排） |
| **Reflow** | 重排/回流 | 當元素的尺寸、位置等幾何屬性發生變化時，瀏覽器需要重新計算佈局的過程 |
| **Paint** | 繪製/重繪 | 將佈局計算後的元素樣式（顏色、背景、邊框等）繪製到螢幕上的過程 |
| **Repaint** | 重繪 | 當元素的外觀屬性（如顏色、背景）變化但不影響幾何屬性時，觸發的繪製更新 |
| **Composite** | 合成 | 將多個繪製層（Layer）合併為最終螢幕圖像的過程，通常在 GPU 上執行 |
| **Layer** | 層/合成層 | 瀏覽器為了最佳化渲染而建立的獨立繪製表面，可以單獨變換和合成 |
| **Event Loop** | 事件迴圈 | JavaScript 的非同步執行機制，負責排程巨集任務和微任務的執行 |
| **Call Stack** | 呼叫堆疊 | 記錄目前正在執行的 JavaScript 函式的資料結構 |
| **Macro Task** | 巨集任務 | 事件迴圈中優先順序較低的任務類型，如 setTimeout、setInterval、I/O 操作等 |
| **Micro Task** | 微任務 | 事件迴圈中優先順序較高的任務類型，如 Promise.then、MutationObserver 等 |
| **Forced Synchronous Layout** | 強制同步佈局 | 在 JavaScript 中交替讀取和寫入佈局屬性，導致瀏覽器被迫立即執行佈局計算的效能問題 |
| **Layout Thrashing** | 佈局抖動 | 頻繁的強制同步佈局導致的效能急劇下降現象 |
| **Virtual Scrolling** | 虛擬捲動 | 只渲染視埠內可見列表項的技術，用於最佳化大資料列表的效能 |
| **RAF** | 請求動畫幀 | 瀏覽器提供的 API，用於在下一次重繪前執行動畫相關的 JavaScript 程式碼 |
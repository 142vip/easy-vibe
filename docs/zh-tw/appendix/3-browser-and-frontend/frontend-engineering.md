# 前端工程化全景
::: tip 🎯 核心問題
**如何把你寫的程式碼，變成使用者瀏覽器能跑的網站？** 這就像是問：如何把原材料變成成品，還要保證品質、控制成本？本章將帶你深入理解前端工程化的核心概念和建構流程。
:::

---

## 1. 要「工程化」的動機

### 1.1 從簡單到複雜：前端開發的演變

回顧十年前的前端開發，那時候的我們工作方式非常簡單：寫幾個 HTML 頁面，內嵌一些 CSS 和 JavaScript，直接把檔案拖到瀏覽器裡就能看效果，部署的時候也只需要把資料夾上傳到伺服器，一個網站的總程式碼量可能也就幾十 KB。那是一個「所見即所得」的時代，開發流程簡單直接，幾乎沒有「工程化」這個概念。

但現代前端開發完全不一樣了。我們現在用 TypeScript 代替 JavaScript，這意味著需要編譯；我們用 Vue 或 React 的元件化開發方式，需要額外的轉換；我們用 Sass 或 Less 寫 CSS，需要預處理；我們透過 npm 安裝各種依賴套件，最終需要打包。一個中大型專案的前端依賴可能上千個，總大小幾百 MB，這與十年前的「簡單直接」形成了鮮明對比。

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**👴 十年前的開發方式**
- 寫幾個 HTML + CSS + JS 就是一個專案
- 直接拖到瀏覽器就能看效果
- 上傳資料夾到伺服器就完成部署
- 整個專案程式碼量通常只有幾十 KB

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 現代的開發方式**
- 使用 TypeScript，需要編譯才能執行
- 使用 Vue/React，需要轉換成原生 JS
- 使用 npm 套件管理，需要打包合併
- 專案依賴動輒幾百 MB

</div>
</div>

**這就是「前端工程化」要解決的問題：如何管理複雜度，讓開發效率更高、程式碼品質更好、使用者體驗更優。**

<BuildPipelineDemo />

### 1.2 案例：為什麼你需要了解建構原理

你可能會說：「我用 Vite 或者 Create React App，開箱即用，為什麼還需要了解這些建構原理？」 讓我講一個真實的故事，你就會明白為什麼這些知識如此重要。

::: warning 小明的踩坑記
小明是一個剛入職的前端新人，公司用的是 Vite 搭建的專案。有一天，產品經理跑過來說首頁載入太慢了，使用者都在抱怨，需要盡快最佳化。

小明立刻行動起來：他壓縮了圖片、實作了路由懶載入、啟用了 Gzip 壓縮...一頓操作猛如虎，但首頁載入速度依然很慢，問題根本沒有解決。

後來他請教師傅，師傅開啟瀏覽器的開發者工具，看了一眼網路請求，立刻發現了問題所在：`vendor.js` 檔案竟然有 2MB！原來小明為了使用某個日期格式化函式，直接引入了 `moment.js` 整個函式庫，而 `moment.js` 包含了 100 多種語言的 locale 檔案，大部分都是專案根本用不到的。

解決方案很簡單：把 `moment.js` 換成 `dayjs`，或者按需引入 `date-fns`。這樣改動之後，2MB 的體積瞬間變成了 2KB，首頁載入速度提升了十幾倍。

小明從此明白了一個道理：**不了解建構和打包原理，你連問題出在哪都不知道，更別提解決問題了。**
:::

::: info 💡 核心啟示
建構工具不是黑魔法，理解它的工作原理能讓你在遇到問題時快速定位、精準解決。更重要的是，它能在設計架構和選擇依賴時幫你做出更明智的決策。
:::

---

## 2. 核心概念：轉譯、打包、建構

::: tip 🤔 這些概念和建構有什麼關係？
轉譯、打包就是流水線上的關鍵工序。

當你執行 `npm run build` 時，建構工具會依次執行：
1. **程式碼檢查** → 發現錯誤
2. **轉譯** → 把新語法翻譯成瀏覽器能懂的程式碼
3. **打包** → 把分散的檔案合併起來
4. **最佳化** → 壓縮體積、刪除無用程式碼

所以，**轉譯和打包是建構流程的核心環節**。理解它們，你才能知道建構工具到底在做什麼，為什麼有時候建構很慢，為什麼有時候打包後體積很大。
:::

在深入學習具體工具之前，我們需要先搞清楚這幾個核心概念。為了幫助你更好地理解，我們用一個餐廳的比喻來類比它們之間的關係。

### 2.1 用餐廳比喻理解三個概念

想像你經營一家餐廳，每天要為顧客提供各種美食。這個過程中涉及到的環節，與前端工程化的三個核心概念驚人地相似：

| 概念 | 🍽️ 餐廳比喻 | 實際作用 | 具體例子 |
|------|-------------|----------|----------|
| **轉譯** | 把中文菜譜翻譯成英文，讓外國廚師也能看懂 | 把新語法轉換成瀏覽器能理解的舊語法 | 你寫 `const name = user?.name`，轉譯後變成 `var name = user && user.name` |
| **打包** | 把各桌點的菜裝成一個個外送盒，方便配送 | 把分散的模組檔案合併成少數幾個檔案 | 你寫了 50 個 .js 檔案，打包後變成 2 個檔案 |
| **建構** | 從接單、做菜、打包到配送的完整流程 | 從原始碼到生產程式碼的完整轉換過程 | 執行 `npm run build` 後，src 資料夾變成 dist 資料夾 |

### 2.2 轉譯（Transpile）：程式碼的「翻譯官」

轉譯，顧名思義就是「轉換+編譯」，它的核心作用是把一種程式語言（或其新版本）轉換成另一種（或其舊版本）。你可能會有疑問：為什麼要這樣做？直接寫瀏覽器支援的程式碼不就行了嗎？

答案在於瀏覽器相容性問題。雖然 JavaScript 每年都會發布新版本，帶來更強大的語法和 API，但瀏覽器的更新速度遠遠跟不上。如果你使用了最新的 ES2022 語法，在舊版瀏覽器上可能完全無法執行。轉譯工具的作用就是把你的「超前程式碼」轉換成「保守程式碼」，確保在所有瀏覽器上都能正常執行。

::: details 🔧 轉譯範例：看看轉譯做了什麼
讓我們看一個具體的例子。下面是你寫的程式碼，使用了 ES2020 的可選鏈操作符和空值合併操作符：

```js
// 你寫的（ES2020+）
const result = data?.items?.map(item => item.name) ?? []
```

這段程式碼很簡潔優雅，但在舊瀏覽器上會報語法錯誤。轉譯工具會把它轉換成等價的、相容性更好的程式碼：

```js
// 轉譯後（ES5 相容版本）
var _data$items, _data$items$map
var result =
  (_data$items$map =
    (_data$items = data == null ? void 0 : data.items) == null
      ? void 0
      : _data$items.map(function (item) {
          return item.name
        })) != null
    ? _data$items$map
    : []
```

可以看到，一行簡潔的程式碼被轉換成了多行「囉嗦」的程式碼，但後者可以在任何瀏覽器上正常執行。
:::

**常用的轉譯工具：**

- **Babel** 是最老牌、生態最豐富的 JavaScript 轉譯器，幾乎可以處理所有現代語法。它的外掛系統非常強大，但也因為靈活性高導致配置相對複雜。
- **SWC** 是用 Rust 語言重寫的轉譯器，速度比 Babel 快 20 倍以上，正在被越來越多的專案採用，包括 Next.js 等知名框架。
- **esbuild** 是用 Go 語言編寫的，同樣以速度著稱，Vite 在開發模式下就使用它來進行快速轉譯。

::: details 🔍 我的專案用的是什麼轉譯工具？
你不需要刻意選擇，通常是由專案鷹架決定的：

| 專案類型 | 預設轉譯工具 |
|---------|-------------|
| Vite 專案 | esbuild（開發模式）+ esbuild/rollup（生產模式） |
| Create React App | Babel |
| Next.js | SWC（新版本）/ Babel（舊版本） |
| Vue CLI | Babel |

想知道自己專案用的是什麼？打開 `package.json`，搜尋 `babel`、`@babel/core` 這些關鍵詞。如果找到了，說明用的是 Babel；如果沒有，很可能是 esbuild 或 SWC。

**其實你不需要關心這個**——這些工具對開發者是「透明」的，你只管寫程式碼，它們會在背景默默工作。
:::

### 2.3 打包（Bundle）：模組的「打包員」

打包是指把多個分散的模組檔案合併成一個（或幾個）檔案的過程。在早期的前端開發中，我們習慣把所有程式碼寫在一個 JS 檔案裡，但隨著專案規模增大，這種方式變得難以維護。現代前端採用模組化開發，每個功能一個檔案，但瀏覽器載入大量小檔案會帶來效能問題，這就需要打包工具來幫忙。

::: tip 📦 什麼是 ES 模組？
你可能聽說過「ES 模組」這個詞，它到底是什麼？

**先區分兩個概念**：
- **ECMAScript（ES）**：是 JavaScript 的語言標準規範，定義了語法和 API
- **ES 模組**：是 ECMAScript 標準中定義的模組化方案，透過 `import` 和 `export` 語法匯入匯出程式碼

打個比方：ECMAScript 就像「普通話標準」，而 ES 模組就像「普通話中的某種表達方式」。

```js
// utils.js - 匯出模組
export function add(a, b) { return a + b }
export function subtract(a, b) { return a - b }

// main.js - 匯入模組
import { add, subtract } from './utils.js'
console.log(add(1, 2))  // 3
```

**ES 版本小知識**：ECMAScript 每年都會發布新版本：
- **ES5（2009）**：經典版本，幾乎所有瀏覽器都支援
- **ES6/ES2015**：里程碑式大更新，引入了 `let/const`、箭頭函式、**ES 模組**、`class` 等
- **ES2016-ES2024**：每年持續新增新特性（如 `async/await`、可選鏈 `?.` 等）

ES 模組正是在 ES6（2015年）引入的。在此之前，JavaScript 沒有官方的模組系統，開發者只能用各種「民間方案」（如 CommonJS、AMD），這導致了模組規範不統一的問題。ES 模組統一了這些規範，成為現代前端開發的基石。
:::

**為什麼需要打包？** 主要有三個原因：首先，雖然現代瀏覽器已經支援 ES 模組，但在生產環境中載入上百個小檔案仍然會帶來效能開銷；其次，打包過程可以進行 Tree Shaking，自動刪除未使用的程式碼，減小檔案體積；最後，打包後可以做程式碼分割，實現按需載入，提升首屏速度。

::: details 📁 打包前後對比：看看打包做了什麼
**打包前的原始碼結構**（分散的多個檔案）：
```
src/
├── index.js          (入口檔案，匯入其他模組)
├── utils/
│   ├── a.js          (工具函式 A)
│   ├── b.js          (工具函式 B)
│   └── c.js          (工具函式 C)
└── components/
    └── Button.vue    (按鈕元件)
```

**打包後的產物**（合併後的少數檔案）：
```
dist/
├── index.[hash].js      (主入口程式碼)
├── vendor.[hash].js     (第三方函式庫程式碼)
└── assets/
    └── logo.[hash].png  (靜態資源)
```

打包工具會分析檔案之間的依賴關係，按照正確的順序把它們合併到一起，同時進行各種最佳化。
:::

👇 **動手試試看**：
下面這個演示展示了程式碼分割如何實現按需載入。點擊不同的路由，觀察哪些程式碼被載入了：

<CodeSplittingDemo />

### 2.4 建構（Build）：完整的「生產線」

建構是一個更廣義的概念，它涵蓋了從原始碼到可部署產物的完整轉換過程。一個完整的建構流程通常包括以下步驟：

1. **預編譯階段**：把 TypeScript 編譯成 JavaScript，把 Sass 編譯成 CSS
2. **程式碼檢查階段**：執行 ESLint 進行程式碼規範檢查，執行 TypeScript 型別檢查
3. **依賴解析階段**：分析模組之間的依賴關係，建構依賴圖

👇 **動手看看**：
下面這個演示展示了專案中模組之間的依賴關係圖譜。點擊不同的節點，觀察模組是如何相互參考的：

<DependencyGraphDemo />

4. **轉譯階段**：使用 Babel 等工具轉換語法，確保相容性
5. **打包階段**：合併模組檔案，應用 Tree Shaking 刪除無用程式碼
6. **最佳化階段**：壓縮程式碼、分割程式碼、提取公共模組
7. **資源處理階段**：壓縮圖片、生成雪碧圖、處理字型檔案
8. **產物生成階段**：輸出最終檔案到 dist 目錄

理解這個完整流程非常重要，因為當建構出現問題時，你需要知道問題出在哪個環節，才能有針對性地解決。

---

## 3. 實戰：一個團隊的工程化演進之路

::: tip 🤔 什麼是「工程化」？
說了半天「工程化」，它到底是什麼意思？

**簡單來說，工程化就是把「手工作坊」變成「現代化工廠」的過程。**

想像一下：你在家做飯，想吃什麼就做什麼，很自由。但如果要開一家餐廳，每天服務幾百個顧客，就不能再「想吃什麼做什麼」了——你需要標準化的菜譜、規範的操作流程、統一的原材料採購，這樣才能保證每道菜的品質穩定、出餐效率高。

前端開發也一樣。一個人寫小專案，怎麼寫都行。但團隊協作、專案變大後，就需要：
- **統一的程式碼規範**：大家都按同樣的方式寫程式碼
- **自動化工具**：讓機器幫我們檢查錯誤、轉換程式碼、打包檔案
- **標準化流程**：從開發到上線有一套清晰的步驟

**這就是工程化：用工具和規範，讓開發更高效、程式碼更可靠、協作更順暢。**
:::

講了這麼多概念，讓我們看一個真實的案例：某創業公司是如何從「直接寫 HTML」一步步進化到「現代化工程化流程」的。透過這個案例，你會更直觀地理解工程化到底解決了什麼問題。

::: tip 📖 背景知識：jQuery、Vue、React 是什麼？
在開始案例之前，先簡單介紹一下這些名詞：

- **jQuery**：十多年前最流行的 JavaScript 函式庫，用來簡化 DOM 操作（比如「點擊按鈕後改變文字」）。現在已經被 Vue、React 等現代框架取代，但很多老專案還在使用。
- **Vue / React**：現代前端開發的主流框架。它們讓你用「元件」的方式組織程式碼，資料和視圖自動同步，開發效率更高。你現在學的很可能就是其中之一。

**簡單理解**：jQuery 是「手排」，你要自己操作每一個元素；Vue/React 是「自排」，你只需要告訴它資料是什麼，它會自動更新介面。
:::

### 3.1 演進的全景圖

::: tip 🤔 什麼是鷹架？
鷹架就是幫你「搭好專案骨架」的工具。比如 `npm create vite@latest` 會自動建立一個配置好的專案，裡面有目錄結構、配置檔案、範例程式碼，你直接開始寫業務程式碼就行。

**沒有鷹架的時代**：你要手動建立資料夾、寫配置檔案、安裝依賴...一個專案搭建下來可能要半天。
**有鷹架的時代**：一條指令，30 秒搞定。
:::

下面這張表展示了工程化演進的四個階段，你可以看到建構工具、鷹架、框架是如何一步步進化的：

| 階段 | 建構工具 | 鷹架 | 框架 | 核心變化 |
|------|---------|--------|------|----------|
| **階段一：原始時代** | 無（直接執行） | 無（手動建檔案） | jQuery | 沒有任何工具，全靠手工 |
| **階段二：模組化** | Webpack + Babel | 簡單範本複製 | Vue 2 / React | 開始有建構流程，但配置很麻煩 |
| **階段三：現代化** | Vite | create-vite / create-react-app | Vue 3 / React 18 | 開箱即用，零配置啟動 |
| **階段四：持續最佳化** | Vite + 外掛 | 自訂鷹架範本 | 框架 + TypeScript | 團隊規範化、範本化 |

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**階段一 → 階段二**：從「沒有工具」到「有了工具」。這是質的飛躍——你開始用建構工具處理程式碼，用框架組織專案。但代價是配置複雜，新人上手難。

**階段二 → 階段三**：從「能用」到「好用」。Vite 把原來需要手動配置的東西都自動化了，鷹架一鍵生成專案，開發體驗大幅提升。你現在大概率就處在這個階段。

**階段三 → 階段四**：從「個人好用」到「團隊高效」。當團隊變大後，需要統一的技術棧和規範，這時候會自訂鷹架範本，讓所有專案保持一致的風格。

**總結一下**：工程化演進不只是「建構工具變快了」，而是**整個開發體驗的升級**——從手動搭建專案到鷹架一鍵生成，從複雜配置到開箱即用，從各自為戰到團隊規範。
:::

### 3.2 階段一：原始時代——全靠手工

為什麼叫「原始時代」？因為這個階段沒有任何自動化工具，所有事情都要手動完成——建立資料夾、寫程式碼、管理依賴、除錯問題，全部靠人工。

在這個階段，團隊只有 3 個前端工程師，做一個管理後台專案。專案很小，大家各寫各的，看起來沒什麼問題。但隨著專案變大，問題開始暴露出來。

**開發方式**：
- **建構工具**：無，直接寫 HTML/JS/CSS，瀏覽器直接執行
- **鷹架**：無，手動建立資料夾和檔案
- **框架**：jQuery，用選擇器操作 DOM

**這個階段的特點**：
- ✅ **優點**：簡單直接，沒有學習成本，寫完就能跑
- ❌ **缺點**：程式碼一多就亂，團隊協作困難，沒有程式碼檢查容易出 bug

::: details 檢視當時的專案結構和程式碼方式
**專案結構**（手動建立）：
```
project/
├── index.html
├── login.html
├── css/
│   ├── bootstrap.css
│   └── custom.css
├── js/
│   ├── jquery.js
│   ├── bootstrap.js
│   └── app.js
└── images/
```

**遇到的問題**：
1. **全域變數污染**：所有變數都在全域命名空間，不同檔案中的同名變數會互相覆蓋
2. **依賴管理混亂**：jQuery 外掛必須先載入 jQuery，script 標籤順序錯了就報錯
3. **程式碼難以複用**：想複用某個功能，只能複製貼上程式碼
4. **沒有程式碼檢查**：變數拼寫錯誤等低級問題，只能執行後才發現

**當時的臨時解決方案**：
```js
// 用自執行函式模擬模組化（IIFE 模式）
var ModuleA = (function () {
  var privateVar = 'private'  // 私有變數，外部無法存取

  function privateFn() {
    console.log(privateVar)
  }

  return {
    publicMethod: function () {
      privateFn()  // 暴露公共方法
    }
  }
})()

// 依賴管理全靠註解說明
/**
 * @requires jquery.js (must load first)
 * @requires bootstrap.js
 */
```
:::

這種開發方式在小專案中還能應付，但隨著團隊擴大到 8 人、專案變得越來越複雜，這些問題開始嚴重影響開發效率和程式碼品質，團隊迫切需要一種更好的組織方式。

### 3.3 階段二：模組化時代——開始有工具鏈

原始時代的問題累積到一定程度，團隊終於決定引入現代化工具鏈。這是一個重要的轉折點——從「手工勞動」進入「機械化生產」。

但這個階段也有代價：工具鏈的學習成本很高，配置檔案複雜，新人上手需要時間。

**開發方式**：
- **建構工具**：Webpack + Babel，需要寫配置檔案
- **鷹架**：複製舊專案範本，手動改配置
- **框架**：Vue 2 / React，元件化開發

**這個階段的特點**：
- ✅ **優點**：模組化開發，程式碼可維護性大幅提升，有程式碼檢查
- ❌ **缺點**：配置複雜，啟動慢，鷹架簡陋容易出錯

::: details 檢視引入工具鏈後的變化
**專案結構**（Webpack + Vue 2 時代）：
```
my-project/
├── build/               # 建構配置（這個階段配置很複雜！）
│   ├── webpack.base.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── config/              # 環境配置
│   ├── index.js
│   ├── dev.env.js
│   └── prod.env.js
├── src/
│   ├── components/      # 元件
│   ├── views/           # 頁面
│   ├── router/          # 路由
│   ├── store/           # 狀態管理
│   ├── App.vue
│   └── main.js
├── static/              # 靜態資源
├── .eslintrc.js         # ESLint 配置
├── .babelrc             # Babel 配置
├── package.json
└── index.html
```

**配置檔案範例**（這就是為什麼說「配置複雜」）：
```js
// webpack.base.js - 僅僅是基礎配置就有這麼多內容
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(png|jpg|gif)$/, loader: 'url-loader', options: { limit: 8192 } }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: { '@': path.resolve(__dirname, '../src') }
  }
}
```

**帶來的改善**：
1. **模組化開發**：每個檔案就是一個模組，透過 import/export 清晰管理依賴關係
2. **程式碼複用**：元件和工具函式可以在不同專案中複用，不用再複製貼上
3. **程式碼品質**：ESLint 在儲存時自動檢查，TypeScript 在編譯時發現型別錯誤
4. **效能最佳化**：Webpack 的程式碼分割和懶載入讓首屏載入速度大幅提升

**新的痛點**：
1. **配置複雜**：webpack.config.js 動輒幾百行，新人很難上手
2. **啟動慢**：冷啟動 30 秒以上，改程式碼熱更新要等 5 秒
3. **鷹架簡陋**：複製舊專案範本，經常忘記改配置，導致各種奇怪問題
:::

### 3.4 階段三：現代化時代——開箱即用

階段二的痛點（配置複雜、啟動慢）困擾了開發者很多年。直到 2021 年，Vite 的出現徹底改變了這一切。

Vite 的核心理念是「約定優於配置」——它內建了合理的預設配置，你不需要寫幾百行配置檔案，開箱即用。這就像從「自己組裝電腦」變成了「買品牌機」，省去了大量折騰的時間。

2021 年之後，團隊開始用 Vite 替代 Webpack，開發體驗得到了質的提升。

**開發方式**：
- **建構工具**：Vite，零配置啟動，秒級熱更新
- **鷹架**：`npm create vite@latest`，一鍵生成專案
- **框架**：Vue 3 / React 18，更強大的元件系統

**這個階段的特點**：
- ✅ **優點**：秒級啟動，熱更新極快，配置簡單，新人友好
- ❌ **缺點**：生態還在完善中，某些特殊需求可能需要額外配置

::: details Vite 帶來的變化
**專案結構**（Vite + Vue 3 時代）：
```
my-project/
├── src/
│   ├── components/      # 元件
│   ├── views/           # 頁面
│   ├── router/          # 路由
│   ├── stores/          # 狀態管理（Pinia）
│   ├── assets/          # 靜態資源
│   ├── App.vue
│   └── main.js
├── public/              # 公共資源
├── vite.config.js       # 配置檔案（簡潔！）
├── package.json
└── index.html
```

**配置檔案對比**（Vite 配置有多簡潔）：
```js
// vite.config.js - 整個配置檔案就這麼點
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': '/src' }
  }
})
// 對比上面 Webpack 的配置，是不是簡潔太多了？
```

| 對比項 | 階段二（Webpack） | 階段三（Vite） | 體驗提升 |
|--------|---------|------|------|
| 建立專案 | 複製範本，手動改配置 | `npm create vite@latest` | 30 秒搞定 |
| 冷啟動 | 30s+ | <1s | **快 30 倍** |
| 熱更新 | 3-5s | <100ms | **快 30 倍** |
| 配置檔案 | 幾百行 | 幾十行甚至不需要 | **大幅簡化** |

**實際體驗對比**：
```bash
# 階段二：使用 Webpack
npm run dev
# 等待 30 秒...喝杯咖啡回來還在編譯
# [INFO] Compiled successfully in 30123ms
# 修改程式碼 -> 儲存 -> 等待 5 秒 -> 終於看到效果

# 階段三：使用 Vite
npm create vite@latest my-project  # 一鍵建立專案
cd my-project && npm install
npm run dev
# 等待 300 毫秒...還沒反應過來就好了
# [INFO] ready in 312ms
# 修改程式碼 -> 儲存 -> 瞬間看到效果
```
:::

### 3.5 階段四：持續最佳化——團隊規範化

當工具鏈成熟後，團隊開始關注更深層次的問題：如何讓團隊協作更高效？如何避免重複踩坑？如何統一程式碼風格？

這個階段的核心是「規範化」——不只是工具好用，還要讓團隊所有人用同樣的方式工作。

**開發方式**：
- **建構工具**：Vite + 自訂外掛，適配團隊特殊需求
- **鷹架**：團隊內部鷹架範本，統一技術棧和規範
- **框架**：Vue 3 / React 18 + TypeScript，型別安全

**這個階段的特點**：
- ✅ **優點**：團隊協作高效，程式碼風格統一，新人入職有範本可循
- ❌ **缺點**：需要投入時間維護鷹架和規範，有一定維護成本

**這個階段會做什麼？**
1. **自訂鷹架範本**：把團隊常用的配置、目錄結構、公共元件打包成範本，新專案一鍵生成
2. **引入 TypeScript**：讓程式碼有型別檢查，減少執行時期錯誤
3. **建立程式碼規範**：ESLint 規則、Git 提交規範、程式碼審查流程
4. **持續整合/持續部署（CI/CD）**：程式碼提交後自動測試、自動部署

::: details 團隊規範化階段的專案結構
**專案結構**（團隊內部範本 + TypeScript）：
```
my-project/
├── .husky/              # Git hooks（提交前自動檢查）
├── src/
│   ├── components/      # 元件
│   ├── views/           # 頁面
│   ├── router/          # 路由
│   ├── stores/          # 狀態管理
│   ├── api/             # API 介面
│   ├── utils/           # 工具函式
│   ├── types/           # TypeScript 型別定義
│   ├── assets/          # 靜態資源
│   ├── App.vue
│   └── main.ts          # 注意是 .ts 不是 .js
├── public/
├── .eslintrc.cjs        # ESLint 配置（團隊統一規則）
├── .prettierrc          # Prettier 配置（程式碼格式化）
├── tsconfig.json        # TypeScript 配置
├── vite.config.ts       # Vite 配置
├── package.json
└── README.md            # 專案文件
```

**團隊規範化的具體體現**：
```js
// tsconfig.json - TypeScript 配置，型別安全
{
  "compilerOptions": {
    "target": "ES2020",
    "strict": true,           // 開啟嚴格模式
    "noImplicitAny": true,    // 禁止隱式 any
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}

// .eslintrc.cjs - 團隊統一的程式碼規範
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  rules: {
    'no-console': 'warn',     // 禁止 console.log
    'no-debugger': 'error',   // 禁止 debugger
    'vue/multi-word-component-names': 'error'  // 元件名必須是多詞
  }
}
```

**常見踩坑與解決方案**：

**坑一：引入整個函式庫而不是按需引入**

這是最常見的錯誤之一。很多時候我們只需要一個函式庫中的某個函式，卻不小心引入了整個函式庫。

```js
// ❌ 錯誤做法：引入整個 moment.js（2.5MB！）
import moment from 'moment'
const formattedDate = moment(date).format('YYYY-MM-DD')

// ✅ 正確做法：使用更輕量的 dayjs（2KB）
import dayjs from 'dayjs'
const formattedDate = dayjs(date).format('YYYY-MM-DD')

// 或者按需匯入 date-fns 的函式
import { format } from 'date-fns'
const formattedDate = format(date, 'yyyy-MM-dd')
```

**坑二：Tree Shaking 失效**

Tree Shaking 是打包工具自動刪除未使用程式碼的功能，但它需要正確的匯入方式才能生效。

```js
// ❌ 錯誤做法：這會引入整個 lodash（70KB+）
import _ from 'lodash'
_.debounce(fn, 200)

// ✅ 正確做法：只匯入需要的函式
import debounce from 'lodash/debounce'

// 或者使用 lodash-es（ES 模組版本，支援 Tree Shaking）
import { debounce } from 'lodash-es'
```

👇 **動手試試看**：
下面這個演示展示了 Tree Shaking 的工作原理。勾選你需要的函式，觀察打包後的體積變化：

<TreeShakingDemo />

**坑三：沒有使用檔案 Hash，導致快取問題**

瀏覽器會快取靜態資源以提高載入速度，但如果檔名不變，更新程式碼後使用者可能還在使用舊版本。

```js
// ❌ 問題場景：檔名固定，使用者快取了舊版本
// <script src="/js/app.js"></script>

// ✅ 正確做法：使用 content hash
// Vite/Webpack 會自動處理：
// <script src="/js/app.a3f7b2c.js"></script>
// 內容變化時 hash 也會變化，瀏覽器會自動取得新版本
```
:::

---

## 4. 原理深入：Vite 這麼快的動機

了解了實際案例後，讓我們深入看看 Vite 的工作原理，理解它為什麼能比傳統工具快這麼多。

<BundlerComparisonDemo />

### 4.1 兩種截然不同的工作方式

傳統打包工具（如 Webpack）的工作方式是「先打包後服務」：在啟動開發伺服器之前，它必須先把整個應用的所有模組打包成一個或幾個 bundle 檔案。這個過程中需要走訪所有來源檔案、解析依賴關係、轉換程式碼、合併檔案，專案越大，這個過程就越慢。

```
傳統打包工具的工作流程：

原始碼 (100+ 檔案)
    ↓
[建構時全部打包] ← 這一步非常耗時！
    ↓
Bundle (單個/幾個大檔案)
    ↓
瀏覽器請求 → 返回打包後的檔案
```

Vite 的工作方式完全不同，它採用了「按需編譯」的策略：啟動時幾乎不做任何打包工作，直接啟動開發伺服器。當瀏覽器請求某個模組時，Vite 才會即時編譯這個模組並返回。

```
Vite 的工作流程：

原始碼 (100+ 檔案)
    ↓
[不打包！直接啟動伺服器] ← 幾乎瞬間完成
    ↓
瀏覽器請求 index.html
    ↓
瀏覽器發現 <script type="module">，繼續請求 JS 檔案
    ↓
Vite 即時編譯請求的模組 → 返回編譯後的程式碼
    ↓
瀏覽器按需載入，用到的才請求
```

### 4.2 Vite 工作流程的三個關鍵時刻

**啟動時：冷啟動秒開**

Vite 啟動時只做兩件事：啟動一個靜態檔案伺服器，預處理一些依賴資訊。它不需要打包，不需要編譯所有檔案，所以幾乎瞬間就能啟動完成。

**請求時：按需編譯**

當瀏覽器透過 `<script type="module">` 請求 JavaScript 檔案時，Vite 會攔截這個請求，即時編譯程式碼後再返回。它會把 TypeScript 轉成 JavaScript，把 Vue 單檔案元件拆分成 template/script/style，把 CSS 預處理器編譯成原生 CSS。

**修改時：極速熱更新**

當你修改程式碼並儲存時，Vite 會透過 WebSocket 通知瀏覽器，只更新發生變化的模組，而不是重新整理整個頁面。由於模組粒度很細（一個檔案就是一個模組），更新速度非常快，通常在 100 毫秒以內。

👇 **動手看看**：
下面這個演示對比了傳統重新整理和 HMR 熱更新的區別：

<HotReloadDemo />

::: tip 💡 生產環境為什麼還是要打包？
你可能會問：既然不打包這麼快，為什麼生產環境還是要打包呢？原因有幾個：首先，雖然 HTTP/2 支援多路複用，但載入大量小檔案仍然有效能開銷；其次，打包過程可以進行更激進的最佳化，比如程式碼壓縮、作用域提升、更徹底的 Tree Shaking；最後，打包後可以做更好的快取策略和 CDN 分發。所以 Vite 在生產建構時使用 Rollup 進行打包。
:::

---

## 5. Webpack 的 Loader 和 Plugin

雖然 Vite 越來越流行，但很多老專案仍在使用 Webpack，而且 Webpack 的設計思想對理解建構工具很有幫助。如果你需要維護使用 Webpack 的專案，了解它的兩個核心概念——Loader 和 Plugin——是必不可少的。

### 5.1 Loader：檔案轉換器

Webpack 的核心理念是「一切皆模組」，但 Webpack 本身只理解 JavaScript。Loader 的作用就是把其他類型的檔案轉換成 Webpack 能處理的 JavaScript 模組。

比如，當你 import 一個 `.vue` 檔案時，`vue-loader` 會把它轉換成 JavaScript 元件物件；當你 import 一個 `.scss` 檔案時，`sass-loader` 會把它編譯成 CSS，然後 `css-loader` 解析其中的 `@import` 和 `url()`，最後 `style-loader` 把 CSS 注入到頁面的 `<style>` 標籤中。

### 5.2 Plugin：功能擴充器

Plugin 的能力比 Loader 更強，它可以存取 Webpack 的完整建構生命週期，在各個階段執行自訂邏輯。比如，`HtmlWebpackPlugin` 可以自動生成 HTML 檔案並注入打包後的資源參考；`MiniCssExtractPlugin` 可以把 CSS 提取成獨立檔案而不是內嵌在 JS 中；`BundleAnalyzerPlugin` 可以分析打包後的檔案組成，幫助你找出體積過大的模組。

### 5.3 Loader 與 Plugin 的區別

| 對比項 | Loader | Plugin |
|--------|--------|--------|
| **核心職責** | 檔案轉換，把非 JS 檔案轉成 JS 模組 | 功能擴充，干預建構過程的各個環節 |
| **執行時機** | 在模組載入時執行，針對單個檔案 | 貫穿整個建構生命週期，可以監聽各種事件 |
| **配置位置** | `module.rules` 陣列中配置 | `plugins` 陣列中實例化 |
| **典型例子** | `babel-loader`、`vue-loader`、`sass-loader` | `HtmlWebpackPlugin`、`MiniCssExtractPlugin` |

---

## 6. Vite 配置範本

理論講得差不多了，下面是一個可以直接使用的 Vite 配置範本，涵蓋了大多數專案需要的常用功能。你可以根據自己的專案需求進行刪減和調整。

::: details 點擊檢視完整配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  // 基礎路徑配置
  base: './',  // 部署時的基礎路徑，相對路徑更靈活

  // 路徑別名，讓 import 更簡潔
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@api': resolve(__dirname, 'src/api')
    }
  },

  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        // 自動匯入全域樣式變數
        additionalData: `@use "@/styles/vars.scss" as *;`
      }
    }
  },

  // 開發伺服器配置
  server: {
    port: 3000,           // 埠號
    open: true,           // 自動開啟瀏覽器
    cors: true,           // 允許跨域
    // API 代理配置，解決開發環境跨域問題
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

  // 建構配置
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',  // 生產環境不生成 sourcemap

    // Rollup 打包配置
    rollupOptions: {
      output: {
        // 程式碼分割策略：把不同類型的依賴打包到不同檔案
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'ui-vendor': ['element-plus'],
          'utils-vendor': ['lodash-es', 'axios', 'dayjs']
        },
        // 檔案命名規則
        entryFileNames: 'js/[name]-[hash].js',
        chunkFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(assetInfo.name)) {
            return 'img/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return 'fonts/[name]-[hash][extname]'
          }
          return '[ext]/[name]-[hash][extname]'
        }
      }
    },

    // 程式碼壓縮配置
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // 移除 console
        drop_debugger: true   // 移除 debugger
      }
    },

    // 大於 500KB 的 chunk 會觸發警告
    chunkSizeWarningLimit: 500
  },

  // 外掛配置
  plugins: [
    vue()  // Vue 3 支援
  ]
}))
```

:::

這個配置涵蓋了日常開發的主要需求：路徑別名讓 import 語句更簡潔，開發伺服器代理解決了跨域問題，程式碼分割策略最佳化了載入效能，壓縮配置移除了除錯程式碼。

---

## 6.1 SourceMap：除錯壓縮程式碼的秘密武器

你可能注意到了配置中的 `sourcemap` 選項。什麼是 SourceMap？它為什麼這麼重要？

在生產環境中，我們的程式碼會被壓縮、合併、轉譯，最終變成一行難以閱讀的「天書」。當程式碼出錯時，瀏覽器只能告訴你錯誤發生在壓縮後程式碼的第 1 行第 1234 個字元——這對除錯毫無幫助。SourceMap 的作用就是建立一個對映關係，讓你在瀏覽器開發者工具中看到的仍然是原始的原始碼。

👇 **動手看看**：
下面這個演示展示了 SourceMap 如何將壓縮後的程式碼對映回原始碼：

<SourceMapDemo />

---

## 6.2 資源指紋：長期快取與版本控制

在配置中你可能注意到檔名帶有 `[hash]`，這就是資源指紋。它的作用是實現長期快取策略：當檔案內容不變時，hash 也不變，瀏覽器可以直接使用快取；當檔案內容變化時，hash 隨之變化，瀏覽器會自動取得新版本。

👇 **動手試試看**：
下面這個演示展示了資源指紋如何影響瀏覽器快取行為。點擊「重新建構」模擬程式碼變更，開啟/關閉 Hash 觀察快取命中的變化：

<AssetFingerprintDemo />


## 7. 總結

讓我們用一張表格來回顧前端工程化的核心概念：

| 概念 | 一句話解釋 | 解決的問題 | 代表工具 |
|------|-----------|-----------|----------|
| **轉譯** | 把新語法「翻譯」成舊語法 | 瀏覽器相容性 | Babel、SWC、esbuild |
| **打包** | 把多個檔案合併成少數檔案 | 減少請求、模組管理 | Webpack、Rollup、Vite |
| **建構** | 從原始碼到產物的完整流程 | 自動化、最佳化 | 上述所有工具 |
| **Tree Shaking** | 刪除未使用的程式碼 | 減小檔案體積 | Webpack、Rollup |
| **Code Splitting** | 把程式碼分成多個小塊按需載入 | 首屏效能最佳化 | Webpack、Vite |
| **HMR** | 熱模組替換，不重新整理更新 | 開發體驗 | Webpack、Vite |


::: info 寫在最後
前端工程化是一個持續演進的話題，工具會變，但核心理念不變：**用自動化手段提高效率、保證品質、最佳化效能**。理解了這些基本原理，無論工具如何更新換代，你都能快速上手、從容應對。

希望這篇文章能幫助你建立起對前端工程化的整體認知。當你在實際專案中遇到建構相關的問題時，能夠知道從哪裡入手、如何定位、怎樣解決。
:::
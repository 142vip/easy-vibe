# 路由與導航導論
::: tip 🎯 核心問題
**為什麼有些網站切換頁面時不會白屏刷新，像 App 一樣流暢？** 這就是前端路由的魔法。本章將帶你從傳統網站的「翻書式跳轉」，進入到單頁應用的「投影片切換」世界，理解前端路由如何讓使用者體驗提升一個檔次。
:::

---

## 1. 要「前端路由」的動機

### 1.1 從傳統網站到單頁應用：使用者體驗的質變

回顧早期的網站瀏覽體驗，每次點擊連結都是一次「完整翻頁」的過程：頁面白屏一下、載入圈轉動、整個頁面重新渲染。如果網路慢，你還要盯著載入圈發呆幾秒。這種體驗在今天看來已經過時了，但當時這就是標準做法。

現代前端開發完全改變了這種模式。我們使用前端路由技術，讓頁面切換像手機 App 一樣流暢——沒有白屏、沒有載入圈、使用者幾乎感覺不到「跳轉」的過程。這種體驗的提升不是魔法，而是前端路由系統的功勞。

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 傳統網站（MPA）**
- 點擊連結 → 整頁刷新
- 每個頁面是獨立的 HTML 檔案
- 瀏覽器重新下載所有資源
- 體驗像「翻書」，有明顯的翻頁過程

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 單頁應用（SPA）**
- 點擊連結 → 無刷新切換
- 只有一個 HTML 入口檔案
- 只下載需要的資料
- 體驗像「投影片」，流暢自然

</div>
</div>

**這就是「前端路由」要解決的核心問題：在不刷新頁面的情況下，實現檢視的切換和 URL 的同步更新。**

<RouteMatchingDemo />

### 1.2 案例：為什麼你需要理解路由模式

你可能會說：「我用 Vue Router 或者 React Router，設定一下就能用，為什麼還需要了解這些底層原理？」讓我講一個真實的故事，你就會明白為什麼這些知識如此重要。

::: warning 小李的部署踩坑記
小李是一個前端新人，剛入職就負責開發一個基於 Vue 的單頁應用。在本地開發時一切正常，路由跳轉絲般順滑。但是當他把專案部署到測試伺服器後，問題出現了：使用者直接存取某個路由（如 `example.com/user/123`）或者在詳情頁刷新頁面時，會看到 **404 Not Found** 錯誤。

小李懵了：明明本地能正常存取，為什麼部署後就 404 了？他排查了很久，甚至懷疑是伺服器設定問題。

後來他請教師兄，師兄一眼就看出了問題：小李用的是 History 模式，但伺服器沒有設定 fallback。當使用者直接存取 `/user/123` 時，伺服器會去尋找這個路徑對應的檔案，但 SPA 的所有路由其實都指向同一個 `index.html`。解決方案很簡單：設定伺服器讓所有路由都回退到 `index.html`，讓前端路由接管後續處理。

小李從此明白了一個道理：**不理解路由模式的原理和伺服器設定要求，你連為什麼報錯都不知道，更別提解決問題了。**
:::

::: info 💡 核心啟示
前端路由不是「黑魔法」，理解它的工作原理能讓你在遇到部署、效能、SEO 問題時快速定位、精準解決。更重要的是，它能在專案架構設計時幫你做出更明智的選擇——什麼時候用 Hash 模式、什麼時候用 History 模式、如何避免常見的坑。
:::

---

## 2. 核心概念：路由、模式、導航

在深入具體實作之前，我們需要先搞清楚幾個核心概念。為了幫助你更好地理解，我們用一個圖書館的比喻來類比它們之間的關係。

::: tip 🤔 這些概念和路由有什麼關係？
路由、模式、導航就是前端路由系統的三大支柱。

當你使用 Vue Router 或 React Router 時，框架會幫你處理：
1. **路由對映** → 定義 URL 和元件的對應關係
2. **模式選擇** → 決定用 Hash 還是 History 模式
3. **導航控制** → 處理頁面跳轉、瀏覽器前進後退

所以，**理解這三個概念，你才能知道路由系統到底在做什麼，為什麼有時候需要特殊設定，為什麼部署時會出問題。**
:::

### 2.1 用圖書館比喻理解路由系統

想像你在圖書館裡找書，這個過程與前端路由的工作原理驚人地相似：

| 概念 | 📚 圖書館比喻 | 實際作用 | 具體例子 |
|------|-------------|----------|----------|
| **路由（Route）** | 書架編號和書籍的對應關係 | 定義 URL 和頁面元件的對映關係 | `/user/123` 路徑對應 `UserDetail.vue` 元件 |
| **路由器（Router）** | 圖書館的指引系統和定位服務 | 管理所有路由、處理導航行為的核心模組 | Vue Router、React Router 就是路由器 |
| **路由模式** | 索引方式（卡片目錄 vs 電子系統） | 決定 URL 的形式和底層實作方式 | Hash 模式用 `#`、History 模式用普通路徑 |
| **導航** | 從一個書架走到另一個書架 | 在不同頁面之間切換的行為 | 點擊連結、程式式跳轉、瀏覽器前進後退 |

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**路由**：只是一個「設定」，告訴系統「什麼 URL 對應什麼頁面」。就像圖書館的書號對應一本書的位置。

**路由器**：是「管理者」，負責根據當前的 URL 找到對應的元件並渲染。就像圖書館員根據你提供的書號幫你找到書。

**路由模式**：是「實作方式」，決定了 URL 長什麼樣、底層用什麼技術實作。就像圖書館可以用紙本目錄，也可以用電子查詢系統。

**導航**：是「行為」，是使用者觸發頁面切換的動作。就像你在圖書館裡從 A 區走到 B 區。

理解這四者的區別非常重要：**路由是靜態設定，路由器是動態管理者，模式是技術選型，導航是使用者行為。**
:::

### 2.2 路由（Route）：URL 與元件的對映契約

路由，本質上就是一個「契約」，它規定了存取某個 URL 時應該顯示什麼內容。在 Vue Router 中，一個典型的路由設定長這樣：

```javascript
const routes = [
  {
    path: '/',           // URL 路徑
    component: Home      // 對應的元件
  },
  {
    path: '/user/:id',   // 帶參數的動態路由
    component: UserDetail,
    children: [          // 巢狀路由
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**你可能會有疑問：為什麼不直接用 `<a>` 標籤跳轉，非要用路由？**

答案在於「單頁應用」的本質：SPA 只有一個 HTML 頁面，所有的頁面切換其實都是在同一個頁面內替換元件。如果你用傳統的 `<a href="/user/123">`，瀏覽器會真的去請求 `/user/123` 這個路徑，導致頁面刷新或 404 錯誤。路由的作用就是攔截這些跳轉行為，用 JavaScript 動態替換元件，從而實作無刷新切換。

::: details 🔧 路由設定的幾種常見模式
**靜態路由**（最簡單）：
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**動態路由**（帶參數）：
```javascript
{ path: '/user/:id', component: UserDetail }
// 可以匹配 /user/123、/user/abc 等
// 元件內可以透過 route.params.id 取得參數
```

**巢狀路由**（父子關係）：
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // 父元件
  children: [
    { path: 'profile', component: UserProfile },   // 實際路徑 /user/:id/profile
    { path: 'posts', component: UserPosts }        // 實際路徑 /user/:id/posts
  ]
}
```

**萬用字元路由**（404 頁面）：
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// 匹配所有未定義的路由
```
:::

### 2.3 路由模式：Hash vs History 的本質區別

前端路由有兩種主流的實作模式：Hash 模式和 History 模式。它們在 URL 表現形式、底層實作、相容性等方面有本質區別。

::: tip 🤔 為什麼需要兩種模式？
這其實是歷史原因和技術權衡的結果。

**Hash 模式**是最早的前端路由實作方式，它利用 URL 中的 hash 部分（即 `#` 後面的內容）。hash 的變化不會觸發頁面刷新，而且相容性極好（連 IE8 都支援）。

**History 模式**是 HTML5 推出後的「標準做法」，它利用 History API 提供的 `pushState` 和 `replaceState` 方法，可以讓 URL 變得更「正常」（沒有 `#`），但需要伺服器端配合設定。

打個比方：Hash 模式就像「給房間門口貼個便利貼」（不影響房間結構），History 模式就像「重新給房間編號」（需要更新門牌系統）。
:::

| 特性 | Hash 模式 | History 模式 |
|------|-----------|--------------|
| **URL 範例** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **實作原理** | 監聽 `hashchange` 事件 | 使用 History API (`pushState`、`replaceState`) |
| **伺服器端設定** | 不需要（hash 不被傳送到伺服器） | **必須設定 fallback 到 index.html** |
| **瀏覽器相容性** | IE8+（幾乎全部瀏覽器） | IE10+（現代瀏覽器） |
| **SEO 友善度** | 較差（搜尋引擎可能忽略 hash） | 良好（URL 結構清晰） |
| **使用者體驗** | URL 有 `#`，看起來像「錨點跳轉」 | URL 美觀，接近傳統網站 |
| **部署難度** | 低，無需特殊設定 | 高，需要正確設定伺服器 |

<HashVsHistoryDemo />

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**URL 範例**：Hash 模式的 URL 中有明顯的 `#`，使用者會一眼看出這是個「單頁應用」；History 模式的 URL 和傳統網站一樣，看起來更「專業」。

**實作原理**：Hash 模式監聽的是 `hashchange` 事件（hash 變化時觸發）；History 模式用的是 HTML5 的 History API，可以「假裝」頁面跳轉了，但實際不刷新。

**伺服器端設定**：這是最容易踩坑的地方！Hash 模式的 `#` 後面的內容不會傳送到伺服器，所以伺服器不需要知道路由的存在；但 History 模式的完整路徑會傳送到伺服器，如果伺服器沒設定好，會回傳 404。

**SEO 友善度**：搜尋引擎爬蟲通常不會執行 JavaScript，Hash 模式的 URL 可能被忽略；History 模式的 URL 結構清晰，更容易被收錄。

**部署難度**：Hash 模式「開箱即用」，History 模式需要運維知識（Nginx、Apache 等）。這也是為什麼很多個人專案預設用 Hash 模式的原因。
:::

---

## 3. 演進之路：從傳統網站到現代路由

講了這麼多概念，讓我們看一個真實的案例：某電商網站是如何從「傳統多頁面」一步步進化到「現代單頁應用路由」的。透過這個案例，你會更直觀地理解前端路由解決了什麼問題。

::: tip 📖 背景知識：MPA、SPA、SSR 是什麼？
在開始案例之前，先簡單介紹一下這些名詞：

- **MPA（Multi-Page Application）**：**多頁面應用**，傳統網站的開發方式。每個頁面是獨立的 HTML 檔案，頁面跳轉會刷新整個頁面。
- **SPA（Single-Page Application）**：**單頁面應用**，現代前端的主流方式。只有一個 HTML 入口，頁面切換透過 JavaScript 動態替換元件，無刷新。
- **SSR（Server-Side Rendering）**：**伺服器端渲染**，在伺服器端生成完整的 HTML。結合了 SPA 和 MPA 的優點，首屏渲染快、SEO 好。

**簡單理解**：MPA 是「每次翻頁都重新畫」，SPA 是「在同一張紙上擦了再畫」，SSR 是「提前在紙上畫好再給你」。
:::

### 3.1 演進的全景圖

下面這張表展示了前端應用的四個演進階段，你可以看到路由技術是如何一步步發展的：

| 階段 | 應用類型 | 路由實作 | 核心特點 | 使用者體驗 |
|------|---------|---------|---------|---------|
| **階段一：傳統多頁** | MPA | 伺服器端路由 | 每個頁面獨立 HTML 檔案 | 每次跳轉都刷新 |
| **階段二：早期 SPA** | SPA（Hash 模式） | Hash 路由 | URL 帶 `#`，相容性好 | 無刷新，但 URL 不美觀 |
| **階段三：現代 SPA** | SPA（History 模式） | History 路由 | URL 美觀，需伺服器端設定 | 流暢，URL 接近傳統網站 |
| **階段四：混合渲染** | SPA + SSR | 同構路由 | 首屏伺服器端渲染，後續前端路由 | 首屏快、SEO 好、體驗流暢 |

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**階段一 → 階段二**：從「有刷新」到「無刷新」，這是質的飛躍。使用者第一次體驗到了「像 App 一樣」的流暢感，但代價是 URL 中帶著 `#`，看起來不太專業。

**階段二 → 階段三**：從「能用」到「好用」。History 模式讓 URL 變得美觀，更接近傳統網站，但代價是增加了部署複雜度（需要設定伺服器）。

**階段三 → 階段四**：從「體驗好」到「體驗好 + SEO 好」。SSR 解決了 SPA 的 SEO 問題，首屏渲染速度也更快，但實作複雜度大幅提升。

**總結一下**：前端路由演進不只是「切換變快了」，而是**整個應用架構的升級**——從伺服器端主導到前端主導，再到前後端結合，每一步都在平衡使用者體驗、開發成本、SEO 等多個維度。
:::

### 3.2 階段一：傳統多頁應用——每次都刷新

為什麼叫「傳統多頁應用」？因為這個階段每個頁面都是獨立的 HTML 檔案，頁面跳轉時瀏覽器會重新下載所有資源（HTML、CSS、JS）。這是最早的 Web 開發方式，現在很多傳統網站仍然這樣運作。

在這個階段，電商網站「買得多」用的是典型的 MPA 架構：

**開發方式**：
- **路由實作**：伺服器端路由，每個頁面對應伺服器上的一個 HTML 檔案
- **頁面跳轉**：使用 `<a href="/products/123">`，觸發完整的頁面刷新
- **狀態管理**：每次跳轉都會遺失之前的頁面狀態（捲動位置、表單內容等）

**這個階段的特點**：
- ✅ **優點**：實作簡單，對搜尋引擎友善（SEO 好），瀏覽器前進後退開箱即用
- ❌ **缺點**：每次跳轉都刷新，使用者體驗差，伺服器壓力大（重複載入相同資源）

::: details 檢視當時的專案結構和存取流程
**專案結構**（伺服器端渲染的典型結構）：
```
server/
├── views/              # HTML 模板
│   ├── index.html      # 首頁模板
│   ├── products.html   # 商品列表頁模板
│   └── product.html    # 商品詳情頁模板
├── public/             # 靜態資源
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # 伺服器入口
```

**頁面跳轉流程**：
```
1. 使用者點擊連結 <a href="/products/123">
       ↓
2. 瀏覽器傳送 GET 請求到伺服器
       ↓
3. 伺服器渲染 product.html，插入資料
       ↓
4. 回傳完整的 HTML 頁面
       ↓
5. 瀏覽器解析 HTML、下載 CSS/JS、渲染頁面
       ↓
6. 使用者看到頁面（這個過程通常需要 1-3 秒）
```

**使用者的痛點**：
- 點擊連結後頁面白屏，等待時間長
- 每次跳轉都重新下載相同的 CSS/JS 檔案
- 瀏覽器前進後退會重新載入頁面
- 無法儲存複雜的頁面狀態（如篩選條件、捲動位置）
:::

這種開發方式在小網站還能接受，但隨著網站規模變大、使用者對體驗要求提高，這些問題開始嚴重影響使用者留存和轉換率。

### 3.3 階段二：早期單頁應用——Hash 路由的時代

傳統多頁應用的問題積累到一定程度，「買得多」團隊決定引入前端路由，升級到單頁應用架構。這是一個重要的轉折點——從「伺服器端主導」進入「前端主導」。

但這個階段也有代價：URL 中帶著 `#`，看起來不夠專業，搜尋引擎收錄也有問題。

**開發方式**：
- **路由實作**：Hash 路由，利用 URL 中的 `#` 部分
- **頁面跳轉**：JavaScript 攔截連結點擊，動態替換元件
- **狀態管理**：頁面狀態在客戶端保持，不需要重新載入

**這個階段的特點**：
- ✅ **優點**：無刷新切換，使用者體驗流暢，伺服器壓力減小
- ❌ **缺點**：URL 帶 `#`，SEO 不友善，首次載入較慢

::: details 檢視 Hash 路由的實作方式
**專案結構**（早期 SPA 的典型結構）：
```
project/
├── index.html          # 唯一的 HTML 入口檔案
├── css/
│   └── app.css         # 所有樣式封裝在一個檔案
├── js/
│   ├── router.js       # 簡單的路由實作
│   ├── views/          # 頁面元件
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # 應用入口
└── server.js           # 簡單的靜態檔案伺服器
```

**Hash 路由的核心程式碼**：
```javascript
// router.js - 簡化的 Hash 路由實作
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // 監聽 hash 變化
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // 初始化
    this.matchRoute()
  }

  matchRoute() {
    // 取得當前 hash（去掉 #）
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

// 導航
router.navigate('/products/123')
```

**URL 形式**：
- 首頁：`https://example.com/#/`
- 商品列表：`https://example.com/#/products`
- 商品詳情：`https://example.com/#/products/123`

**帶來的改善**：
1. **使用者體驗提升**：頁面切換無刷新，流暢自然
2. **伺服器壓力減小**：只載入一次 HTML/CSS/JS，後續只請求資料
3. **狀態保持**：捲動位置、表單內容等狀態可以在頁面切換時保持
4. **離線友善**：配合 Service Worker 可以實作離線存取

**新的痛點**：
1. **URL 不美觀**：`#` 讓 URL 看起來像「錨點跳轉」，不夠專業
2. **SEO 問題**：搜尋引擎爬蟲可能忽略 hash 後的內容，導致頁面無法被收錄
3. **首次載入慢**：需要一次性載入所有 JavaScript，首屏時間較長
:::

### 3.4 階段三：現代單頁應用——History 路由成為主流

Hash 路由的痛點（URL 不美觀、SEO 差）困擾了開發者很多年。隨著 HTML5 的普及和瀏覽器相容性的提升，History 路由逐漸成為主流。

History 路由利用 HTML5 History API，可以讓 URL 變得「正常」（沒有 `#`），但代價是需要伺服器端配合設定。

**開發方式**：
- **路由實作**：History 路由，使用 `pushState` 和 `replaceState`
- **路由庫**：Vue Router、React Router 等成熟路由庫
- **伺服器端設定**：需要設定伺服器將所有路由回退到 `index.html`

**這個階段的特點**：
- ✅ **優點**：URL 美觀，SEO 友善，使用者體驗流暢
- ❌ **缺點**：部署需要特殊設定，伺服器端必須配合

::: details History 路由的實作和部署設定
**專案結構**（現代 SPA 的典型結構）：
```
project/
├── public/
│   └── index.html          # 唯一的 HTML 入口
├── src/
│   ├── router/
│   │   └── index.js        # 路由設定
│   ├── views/              # 頁面元件
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # 建置設定
```

**Vue Router 設定範例**：
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // History 模式
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
- 首頁：`https://example.com/`
- 商品列表：`https://example.com/products`
- 商品詳情：`https://example.com/products/123`

**關鍵：Nginx 設定**（部署時必須設定）：
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # 關鍵設定：所有路由都指向 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**為什麼需要這個設定？**

```
場景：使用者直接存取 https://example.com/products/123

❌ 沒有設定的情況：
1. 瀏覽器向伺服器請求 /products/123
2. Nginx 在檔案系統中尋找 /products/123
3. 找不到這個檔案，回傳 404

✅ 設定了 try_files 的情況：
1. 瀏覽器向伺服器請求 /products/123
2. Nginx 嘗試尋找檔案 → 不存在
3. 回退到 /index.html（根據 try_files 規則）
4. 瀏覽器載入 index.html
5. Vue Router 接管，解析 /products/123
6. 渲染 ProductDetail 元件
7. 頁面正常顯示！
```

**對比 Hash 模式的差異**：
| 對比項 | Hash 模式 | History 模式 |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| 伺服器端設定 | 不需要 | **必須設定** |
| 直接存取 | ✅ 正常工作 | ❌ 需要伺服器端支援 |
| SEO | ⚠️ 較差 | ✅ 良好 |
:::

### 3.5 階段四：混合渲染——SPA + SSR 的終極方案

當 History 路由成熟後，團隊開始關注更深層次的問題：如何既保留 SPA 的流暢體驗，又解決 SEO 和首屏載入慢的問題？

這個階段的核心是「同構渲染」——首屏在伺服器端渲染（SEO 好、載入快），後續互動在前端路由（體驗流暢）。

**開發方式**：
- **框架選擇**：Next.js（React）、Nuxt.js（Vue）
- **渲染策略**：伺服器端渲染 + 客戶端水合（Hydration）
- **路由模式**：History 模式（伺服器端已設定好）

**這個階段的特點**：
- ✅ **優點**：首屏快、SEO 好、後續互動流暢
- ❌ **缺點**：實作複雜度高，需要伺服器端執行環境

::: details 混合渲染的工作原理
**頁面載入流程**：
```
1. 使用者存取 /products/123
       ↓
2. 伺服器端接收到請求
       ↓
3. 伺服器端渲染 ProductDetail 元件 → 生成完整 HTML
       ↓
4. 回傳 HTML 到瀏覽器（包含了完整的內容）
       ↓
5. 瀏覽器快速顯示內容（首屏渲染快）
       ↓
6. 載入 JavaScript，執行「水合」（Hydration）
       ↓
7. 後續頁面切換由前端路由接管（無刷新）
```

**傳統 SPA vs SSR 的首屏對比**：

| 對比項 | 傳統 SPA | SSR |
|--------|---------|-----|
| 首屏內容 | 白屏 → 載入 JS → 渲染 | 立即顯示內容 |
| SEO | 爬蟲可能看不到內容 | 爬蟲能看到完整 HTML |
| 首屏時間 | 較慢（需要載入 JS） | 較快（HTML 已包含內容） |
| 後續互動 | 流暢（前端路由） | 流暢（前端路由） |
:::

---

## 路由的運作方法

了解了實際案例後，讓我們深入看看前端路由的工作原理，理解 Hash 和 History 兩種模式到底有什麼不同。

<RouterArchitectureDemo />

### 4.1 Hash 模式的工作原理

Hash 模式的核心是利用 URL 中的 `hash` 部分（即 `#` 後面的內容）。hash 有兩個重要特性：

1. **hash 的變化不會觸發頁面刷新**
2. **hash 的變化會記錄在瀏覽器歷史堆疊中**

這意味著我們可以在不刷新頁面的情況下改變 URL，同時瀏覽器的前進/後退按鈕也能正常工作。

**工作流程**：

```
使用者點擊連結 <a href="#/user/123">
       ↓
瀏覽器更新 URL（不刷新頁面）
https://example.com/#/user/123
       ↓
觸發 hashchange 事件
       ↓
路由監聽器捕獲事件
       ↓
解析 hash 值 → /user/123
       ↓
匹配路由設定 → 找到 UserDetail 元件
       ↓
渲染元件到頁面
```

**核心程式碼實作**：

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // 監聽 hash 變化
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // 初始化載入
    this.loadRoute()
  }

  loadRoute() {
    // 取得當前 hash，去掉開頭的 #
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

::: tip 💡 Hash 模式的優點
- **相容性好**：IE8+ 都支援，幾乎適用於所有瀏覽器
- **部署簡單**：不需要伺服器端設定，開箱即用
- **實作簡單**：只需要監聽 `hashchange` 事件
:::

### 4.2 History 模式的工作原理

History 模式利用 HTML5 History API，提供了 `pushState`、`replaceState` 等方法，可以改變 URL 而不刷新頁面。

**核心 API**：

```javascript
// 新增歷史記錄
history.pushState(state, title, url)
// 範例：history.pushState({id: 123}, '使用者詳情', '/user/123')

// 替換當前歷史記錄
history.replaceState(state, title, url)

// 監聽歷史記錄變化（前進/後退按鈕）
window.addEventListener('popstate', (event) => {
  // event.state 包含 pushState 時傳入的 state
})
```

**工作流程**：

```
使用者點擊連結 <a href="/user/123">
       ↓
JavaScript 攔截點擊事件
event.preventDefault()
       ↓
呼叫 history.pushState
history.pushState({id: 123}, '使用者詳情', '/user/123')
       ↓
URL 更新（不刷新頁面）
https://example.com/user/123
       ↓
路由匹配並渲染元件
       ↓
使用者點擊瀏覽器後退按鈕
       ↓
觸發 popstate 事件
       ↓
路由監聽器捕獲事件
       ↓
根據新 URL 渲染對應元件
```

**核心程式碼實作**：

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // 攔截所有連結點擊
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // 監聽瀏覽器前進/後退
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // 初始化載入
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

::: warning ⚠️ History 模式的陷阱
History 模式最大的問題在於：**當使用者直接存取某個 URL 或刷新頁面時，瀏覽器會向伺服器傳送請求**。

如果伺服器沒有正確設定，會回傳 404。解決方案是設定伺服器讓所有路由都回退到 `index.html`，讓前端路由接管後續處理。
:::

---

## 5. 路由設定實戰指南

理論講得差不多了，下面是實際專案中常用的路由設定模式和最佳實踐。

### 5.1 基礎路由設定

::: details Vue Router 完整設定範例

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
      props: true  // 將路由參數作為 props 傳遞
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // 捲動行為：返回時保持捲動位置，否則捲動到頂部
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

### 5.2 路由懶載入：提升首屏效能

路由懶載入是指只在存取某個路由時才載入對應的元件，而不是一次性載入所有元件。這可以顯著減少首屏載入時間。

```javascript
// ❌ 一次性載入所有元件（首屏慢）
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ 懶載入（首屏快）
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 懶載入的原理
當你使用 `import('@/views/Home.vue')` 時，Webpack/Vite 會把這個元件封裝成單獨的檔案。只有當使用者存取這個路由時，才會下載對應的檔案。

打個比方：懶載入就像「按需點菜」，而不是一次性把所有菜都端上來。這樣可以減少首屏載入時間，提升使用者體驗。
:::

### 5.3 路由守衛：權限控制與導航攔截

路由守衛可以在路由跳轉前後執行邏輯，常用於權限驗證、頁面標題設定、資料預載入等場景。

```javascript
// 全域前置守衛
router.beforeEach(async (to, from, next) => {
  // 設定頁面標題
  document.title = to.meta.title || 'My App'

  // 權限驗證
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// 全域後置鉤子
router.afterEach((to, from) => {
  // 頁面存取統計
  analytics.trackPageView(to.path)
})

// 路由級守衛
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // 這個路由的專屬邏輯
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 路由守衛的常見用途
- **權限驗證**：檢查使用者是否有權限存取某個頁面
- **頁面標題**：動態設定 document.title
- **資料預載入**：在進入頁面前提前取得資料
- **進度條**：顯示頁面切換的進度條
- **存取統計**：記錄頁面存取情況
:::

---

## 6. 常見問題與解決方案

### 6.1 部署後刷新 404

**問題**：本地開發正常，部署到伺服器後，直接存取某個路由或刷新頁面會顯示 404。

**原因**：History 模式下，伺服器會將 URL 當作檔案路徑去尋找，但 SPA 的所有路由其實都指向 `index.html`。

**解決方案**：設定伺服器 fallback。

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

### 6.2 路由參數遺失

**問題**：頁面刷新後，路由參數 `$route.params` 遺失。

**原因**：路由參數只在路由跳轉時存在，刷新後需要從 URL 中重新解析。

**解決方案**：

```javascript
// ❌ 錯誤做法：只在 created 時取得參數
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ 正確做法：監聽路由變化
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 頁面切換時捲動位置異常

**問題**：頁面切換後，捲動位置沒有重置，或者返回時沒有保持之前的位置。

**解決方案**：設定路由的 `scrollBehavior`。

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 返回時保持捲動位置
    if (savedPosition) {
      return savedPosition
    }
    // 跳轉到錨點
    if (to.hash) {
      return { el: to.hash }
    }
    // 否則捲動到頂部
    return { top: 0 }
  }
})
```

---

## 7. 總結

讓我們用一張表格來回顧前端路由的核心概念：

| 概念 | 一句話解釋 | 解決的問題 | 代表方案 |
|------|-----------|-----------|----------|
| **路由** | URL 和元件的對映關係 | 存取不同 URL 顯示不同內容 | Vue Router、React Router |
| **Hash 模式** | 利用 URL hash 實作路由 | 相容性好、部署簡單 | Vue Router Hash 模式 |
| **History 模式** | 利用 History API 實作路由 | URL 美觀、SEO 好 | Vue Router History 模式 |
| **路由懶載入** | 按需載入路由元件 | 減少首屏載入時間 | `() => import('./Page.vue')` |
| **路由守衛** | 路由跳轉前後的鉤子函式 | 權限控制、資料預載入 | `beforeEach`、`beforeEnter` |
| **動態路由** | 帶參數的路由 | 匹配一類路徑而非單個 | `/user/:id` |

::: info 寫在最後
前端路由是現代單頁應用的核心技術之一。從早期的 Hash 模式到現在主流的 History 模式，路由技術在不斷進化，為使用者提供更流暢的瀏覽體驗。

理解路由的原理和模式，能讓你在遇到部署、效能、SEO 問題時快速定位、精準解決。更重要的是，它能在專案架構設計時幫你做出更明智的選擇——什麼時候用 Hash、什麼時候用 History、如何避免常見的坑。

希望這篇文章能幫助你建立起對前端路由的整體認知。當你在實際專案中遇到路由相關的問題時，能夠知道從哪裡入手、如何定位、怎樣解決。
:::
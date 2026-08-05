# 前端專案架構原理

::: tip 🎯 核心問題
**從簡單的 HTML 頁面到複雜的企業級應用，如何為不同規模的專案選擇合適的架構？** 這就像問：從單身公寓到大型商場，如何根據需求設計不同的空間佈局？好的架構應該隨專案成長而演進，而不是一開始就過度設計。
:::

---

## 1. 架構演進：從簡單到複雜

### 1.1 三個複雜度級別概覽

前端專案的架構應該與專案複雜度相匹配。我們按**技術複雜度**和**使用者規模**兩個維度，將專案分為三個級別：

| 級別 | 技術棧 | 使用者規模 | 典型場景 | 核心關注點 |
|------|--------|----------|----------|------------|
| **入門級** | HTML/CSS/JS | 個人/小團隊 | 個人部落格、宣傳頁、簡單工具 | 快速上線、簡單維護 |
| **進階級** | Vue/React + 建構工具 | 中小型企業 | 管理系統、電商前台、SaaS | 元件複用、狀態管理 |
| **企業級** | 框架 + 微前端/SSR | 大型應用 | 大型平台、複雜業務系統 | 效能最佳化、團隊協作、可擴展性 |

::: tip 💡 如何選擇？
**不要過度設計！** 很多專案從簡單的 HTML 開始，隨著需求增長逐步引入框架和工具。

- 個人專案 → 入門級
- 新創公司 MVP → 入門級或進階級
- 企業管理系統 → 進階級
- 大型網路平台 → 企業級
:::

---

## 2. 入門級：HTML/CSS/JS 專案

### 2.1 適用場景

- 個人部落格、履歷頁面
- 產品宣傳頁（Landing Page）
- 簡單的工具頁面（計算機、轉換器等）
- 原型驗證、快速 Demo

### 2.2 推薦目錄結構

```
my-simple-project/
├── index.html              # 首頁
├── about.html              # 關於頁面（如有）
├── css/
│   ├── reset.css           # 重置樣式
│   ├── variables.css       # CSS 變數（顏色、字型等）
│   ├── components.css      # 元件樣式（按鈕、卡片等）
│   └── main.css            # 主樣式檔案
├── js/
│   ├── utils.js            # 工具函式
│   ├── api.js              # 簡單的 API 呼叫
│   └── main.js             # 主邏輯
├── assets/
│   ├── images/             # 圖片資源
│   └── fonts/              # 字型檔案
└── README.md               # 專案說明
```

### 2.3 程式碼組織原則

**HTML**：語意化標籤，清晰的結構

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的個人部落格</title>
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/main.css">
</head>
<body>
  <header class="site-header">
    <nav class="main-nav">
      <a href="index.html">首頁</a>
      <a href="about.html">關於</a>
    </nav>
  </header>

  <main class="content">
    <article class="blog-post">
      <h1>文章標題</h1>
      <p>文章內容...</p>
    </article>
  </main>

  <footer class="site-footer">
    <p>&copy; 2024 我的部落格</p>
  </footer>

  <script src="js/utils.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

**CSS**：使用 CSS 變數管理主題

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

/* components.css - 可複用的元件樣式 */
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

**JavaScript**：模組化組織（使用 ES6 模組或簡單拆分）

```javascript
// utils.js
const utils = {
  // DOM 操作簡化
  $(selector) {
    return document.querySelector(selector);
  },

  // 簡單的防抖
  debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  // 本機儲存封裝
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
  // 頁面初始化邏輯
  initNavigation();
  loadBlogPosts();
});
```

### 2.4 最佳實踐

✅ **應該做的**：
- 使用語意化 HTML 標籤
- CSS 變數管理顏色和間距
- 圖片壓縮和延遲載入
- 新增基礎的 SEO meta 標籤

❌ **避免的**：
- 內行樣式（`style="..."`）
- 全域變數污染
- 重複程式碼（複製貼上）

---

## 3. 進階級：Vue/React 框架專案

### 3.1 適用場景

- 企業管理系統（ERP、CRM、OA）
- 電商前台/後台
- SaaS 應用
- 需要複雜互動的 Web 應用

### 3.2 Vue 專案推薦結構

```
my-vue-project/
├── public/                     # 靜態資源
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/                 # 樣式、圖片、字型
│   │   ├── styles/
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── global.scss
│   │   └── images/
│   ├── components/             # 通用元件
│   │   ├── common/             # 全域通用（Button、Modal 等）
│   │   │   ├── Button/
│   │   │   │   ├── index.vue
│   │   │   │   └── Button.scss
│   │   │   └── Modal/
│   │   └── business/           # 業務元件（UserCard 等）
│   ├── views/                  # 頁面元件
│   │   ├── Home/
│   │   ├── User/
│   │   │   ├── List.vue
│   │   │   └── Detail.vue
│   │   └── Product/
│   ├── router/                 # 路由設定
│   │   └── index.js
│   ├── stores/                 # Pinia/Vuex 狀態管理
│   │   ├── user.js
│   │   └── app.js
│   ├── services/               # API 服務
│   │   ├── request.js          # axios 封裝
│   │   ├── user.js
│   │   └── product.js
│   ├── utils/                  # 工具函式
│   │   ├── format.js
│   │   ├── validate.js
│   │   └── storage.js
│   ├── composables/            # 組合式函式
│   │   ├── useAuth.js
│   │   └── useLoading.js
│   ├── constants/              # 常數定義
│   │   └── index.js
│   ├── App.vue
│   └── main.js
├── tests/                      # 測試檔案
├── .env                        # 環境變數
├── vite.config.js
├── package.json
└── README.md
```

### 3.3 React 專案推薦結構

```
my-react-project/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/             # 通用元件
│   │   │   ├── Button/
│   │   │   │   ├── index.jsx
│   │   │   │   └── Button.module.css
│   │   │   └── Modal/
│   │   └── business/           # 業務元件
│   ├── pages/                  # 頁面元件
│   │   ├── Home/
│   │   ├── User/
│   │   └── Product/
│   ├── hooks/                  # 自訂 Hooks
│   │   ├── useAuth.js
│   │   └── useFetch.js
│   ├── services/               # API 服務
│   │   ├── api.js
│   │   └── userService.js
│   ├── store/                  # Redux/Zustand 狀態管理
│   │   ├── slices/
│   │   └── index.js
│   ├── utils/
│   ├── constants/
│   ├── App.jsx
│   └── main.jsx
├── tests/
└── package.json
```

### 3.4 關鍵概念詳解

#### 元件設計原則

**單一職責**：一個元件只做一件事

```vue
<!-- ❌ 不好的例子：元件做了太多事 -->
<template>
  <div>
    <form @submit="handleSubmit">
      <!-- 表單內容 -->
    </form>
    <table>
      <!-- 資料表格 -->
    </table>
    <div class="charts">
      <!-- 統計圖表 -->
    </div>
  </div>
</template>

<!-- ✅ 好的例子：拆分成獨立元件 -->
<template>
  <div>
    <UserForm @submit="fetchData" />
    <UserTable :data="users" />
    <UserStats :data="users" />
  </div>
</template>
```

#### 狀態管理策略

| 狀態類型 | 儲存位置 | 範例 |
|----------|----------|------|
| **全域狀態** | Pinia/Redux | 使用者資訊、登入狀態、主題設定 |
| **頁面狀態** | 頁面元件 | 列表查詢條件、分頁資訊 |
| **元件狀態** | 元件內部 | 表單輸入、彈窗顯示/隱藏 |
| **伺服器狀態** | TanStack Query/SWR | 伺服器資料、快取 |

#### 目錄組織方式選擇

**方式一：按類型組織（適合小型專案）**

```
src/
├── components/     # 所有元件
├── views/          # 所有頁面
├── stores/         # 所有狀態
└── services/       # 所有服務
```

**方式二：按功能組織（適合中大型專案）**

```
src/
├── features/
│   ├── auth/       # 認證功能的所有程式碼
│   ├── user/       # 使用者功能的所有程式碼
│   └── product/    # 商品功能的所有程式碼
├── shared/         # 共享資源
└── App.vue
```

::: tip 💡 如何選擇？
- 專案頁面 < 10 個 → 按類型組織
- 專案頁面 > 20 個 → 按功能組織
- 團隊 > 5 人 → 按功能組織，便於平行開發
:::

---

## 4. 企業級：大型應用架構

### 4.1 適用場景

- 大型網路平台（電商、社群、內容平台）
- 複雜的企業級應用
- 需要支援多團隊協作的專案
- 對效能和可維護性要求極高的專案

### 4.2 微前端架構

當專案規模大到一定程度，單個程式碼庫難以維護時，可以考慮**微前端**架構。

```
大型電商平台/
├── 基座應用（主框架）
│   ├── 頂部導航
│   ├── 側邊選單
│   ├── 使用者中心入口
│   └── 子應用容器
├── 商品子應用（獨立部署）
│   ├── 商品列表
│   ├── 商品詳情
│   └── 商品管理
├── 訂案子應用（獨立部署）
│   ├── 購物車
│   ├── 訂單列表
│   └── 付款流程
├── 使用者子應用（獨立部署）
│   ├── 個人中心
│   ├── 收貨地址
│   └── 優惠券
└── 行銷子應用（獨立部署）
    ├── 活動頁面
    ├── 優惠券發放
    └── 積分商城
```

**微前端的優勢**：
- 團隊自治：每個子應用獨立開發、部署
- 技術棧無關：不同團隊可以用不同框架
- 漸進式升級：可以逐步重構老系統

### 4.3 企業級目錄結構

```
enterprise-project/
├── apps/                       # 微前端子應用
│   ├── main/                   # 基座應用
│   ├── product/
│   ├── order/
│   └── user/
├── packages/                   # 共享套件（Monorepo）
│   ├── ui-components/          # 通用元件庫
│   ├── utils/                  # 工具函式
│   ├── constants/              # 常數定義
│   └── types/                  # TypeScript 型別
├── shared/                     # 共享設定
│   ├── eslint-config/
│   ├── ts-config/
│   └── vite-config/
├── docs/                       # 專案文件
├── scripts/                    # 建構指令碼
└── package.json
```

### 4.4 效能最佳化架構

大型應用需要關注效能最佳化：

```
效能最佳化策略/
├── 建構時最佳化
│   ├── 程式碼分割（Code Splitting）
│   ├── 路由延遲載入
│   ├── Tree Shaking
│   └── 資源壓縮
├── 執行時最佳化
│   ├── 虛擬捲動（長列表）
│   ├── 圖片延遲載入
│   ├── 元件按需渲染
│   └── 快取策略
└── 網路最佳化
    ├── CDN 加速
    ├── HTTP 快取
    ├── 資源預載入
    └── Service Worker
```

### 4.5 SSR/SSG 架構

對於需要 SEO 或首屏效能的場景：

| 方案 | 適用場景 | 代表框架 |
|------|----------|----------|
| **SSR** | 需要 SEO、首屏渲染快 | Next.js、Nuxt.js |
| **SSG** | 內容靜態、更新不頻繁 | Astro、VitePress |
| **混合** | 部分靜態、部分動態 | Next.js (ISR) |

---

## 5. 按使用者量級別的架構選擇

### 5.1 個人/小團隊（日活 < 1000）

**特點**：快速迭代、資源有限、需求變化快

**推薦架構**：
- 技術棧：Vue 3 + Vite 或 React + Vite
- 狀態管理：Pinia 或 Zustand（輕量級）
- UI 庫：Element Plus / Ant Design
- 部署：Vercel / Netlify / 雲端伺服器

**目錄結構**：簡單按類型組織即可

### 5.2 中型企業（日活 1k-100k）

**特點**：業務複雜、團隊協作、需要穩定性

**推薦架構**：
- 技術棧：Vue 3 + TypeScript 或 React + TypeScript
- 狀態管理：Pinia + 組合式函式 或 Redux Toolkit
- UI 庫：自建元件庫 + 業務元件庫
- 測試：單元測試 + E2E 測試
- 部署：CI/CD 流水線 + Docker

**目錄結構**：按功能組織，建立規範

### 5.3 大型平台（日活 > 100k）

**特點**：高併發、多團隊協作、長期維護

**推薦架構**：
- 技術棧：React/Vue + TypeScript（嚴格模式）
- 架構：微前端 + Monorepo
- 狀態管理：細粒度狀態管理 + 伺服器狀態快取
- 效能：SSR/SSG + CDN + 邊緣運算
- 監控：前端監控 + 錯誤追蹤 + 效能分析

**目錄結構**：Monorepo + 微前端

---

## 6. 架構演進路線圖

### 6.1 演進範例：從部落格到平台

```
階段 1：個人部落格（HTML/CSS/JS）
    ↓ 需求：需要後台管理
階段 2：增加管理後台（Vue/React + 簡單結構）
    ↓ 需求：使用者系統、評論功能
階段 3：功能模組化（按功能組織）
    ↓ 需求：多團隊協作、獨立部署
階段 4：微前端架構（Monorepo）
```

### 架構升級的時機判定

| 訊號 | 說明 | 建議 |
|------|------|------|
| 建構時間 > 5 分鐘 | 專案過大 | 程式碼分割、微前端 |
| 多人頻繁衝突 | 協作困難 | 按功能組織、模組拆分 |
| 改一處崩多處 | 耦合嚴重 | 重構、加強測試 |
| 首屏載入 > 3 秒 | 效能問題 | 延遲載入、SSR、最佳化 |
| 新成員上手慢 | 結構混亂 | 文件、規範、重構 |

---

## 7. 總結

::: tip 💡 核心思想
**架構沒有銀彈，適合的才是最好的。**

- **小專案**不要過度設計，HTML/CSS/JS 足夠
- **中專案**建立規範，元件化、模組化
- **大專案**考慮微前端、效能最佳化、團隊協作

**記住這幾點**：
1. **漸進式演進**：從簡單開始，隨需求增長
2. **統一約定**：命名、結構、程式碼風格保持一致
3. **文件先行**：架構決策要記錄，便於傳承
4. **定期重構**：技術債務要及時償還

**最終目標**：讓程式碼像整理好的空間一樣，無論大小，都能高效運轉。
:::

---

## 參考資源

- [Vue 風格指南](https://vuejs.org/style-guide/)
- [React 專案結構建議](https://react.dev/learn/thinking-in-react)
- [Bulletproof React - 架構指南](https://github.com/alan2207/bulletproof-react)
- [Feature Sliced Design](https://feature-sliced.design/)
- [微前端架構](https://micro-frontends.org/)

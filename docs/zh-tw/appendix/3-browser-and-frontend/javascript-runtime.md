# JavaScript 執行時期原理

::: tip 前言
你已經學會了 JavaScript 的基本語法，但你是否想過：
- 程式碼到底在哪裡執行？
- 為什麼同樣的程式碼在瀏覽器和 Node.js 中行為不一樣？
- 為什麼有時程式碼會「卡住」，有時卻能「平行」執行？

這篇文章會帶你深入了解 JavaScript 的執行時期環境，包括事件迴圈、呼叫堆疊、記憶體管理等。讀完這篇，你就能理解程式碼為什麼按某個順序執行，快速定位非同步相關的 bug，最佳化程式碼效能並避免記憶體洩漏。
:::

**這篇文章會帶你學什麼？**

| 章節 | 內容 | 學完能做什麼 |
|-----|------|-----------|
| **第 1 章** | 執行時期概述 | 理解 JavaScript 程式碼在哪裡執行 |
| **第 2 章** | 瀏覽器執行時期 | 知道瀏覽器提供了哪些 Web API |
| **第 3 章** | Node.js 執行時期 | 了解伺服器端的 JavaScript 環境 |
| **第 4 章** | 事件迴圈深入 | 掌握巨集任務和微任務的執行順序 |
| **第 5 章** | 呼叫堆疊與記憶體 | 理解程式碼執行過程和記憶體管理 |
| **第 6 章** | 實戰技巧 | 最佳化效能、除錯記憶體洩漏 |

---

## 1. 執行時期概述

::: tip 🤔 核心問題
**什麼是「執行時期」？** JavaScript 只是一門語言，為什麼同樣的程式碼在不同環境中會有不同的行為？
:::

### 1.1 執行時期是什麼

**執行時期 = JavaScript 引擎 + 環境提供的 API**

如果把 JavaScript 比作「程式語言」，那麼執行時期就是「作業系統」——它決定了你的程式碼能做什麼、不能做什麼。

```
┌─────────────────────────────────────┐
│         JavaScript 程式碼            │
├─────────────────────────────────────┤
│      JavaScript 引擎 (V8)           │  ← 負責解析和執行程式碼
├─────────────────────────────────────┤
│      執行時期環境 (瀏覽器/Node.js)   │  ← 提供額外能力
└─────────────────────────────────────┘
```

**一個比喻：JavaScript 是「國語」，執行時期是「城市」**

- JavaScript 語法（國語）哪裡都一樣
- 但不同城市提供的設施不一樣：
  - 瀏覽器 = 有 DOM、window、fetch（就像城市有商場、圖書館）
  - Node.js = 有 fs、http、path（就像城市有工廠、高速公路）

### 1.2 兩大主流執行時期

| 特性 | 瀏覽器 | Node.js |
|------|--------|---------|
| **主要用途** | 網頁互動、使用者介面 | 伺服器端應用、命令列工具 |
| **全域物件** | `window` | `global` |
| **DOM API** | ✅ 支援 | ❌ 不支援 |
| **檔案系統** | ❌ 受限 | ✅ 完整支援 |
| **模組系統** | ES Modules | CommonJS + ES Modules |
| **計時器** | `setTimeout`, `setInterval` | `setTimeout`, `setInterval` |
| **網路請求** | `fetch`, `XMLHttpRequest` | `http`, `https` 模組 |

👇 **動手試試看**：對比瀏覽器和 Node.js 的環境差異

<RuntimeEnvironmentDemo />

::: info 💡 核心啟示
執行時期決定了你能用什麼 API。在瀏覽器能用的 DOM API，在 Node.js 裡用不了；在 Node.js 能用的檔案 API，在瀏覽器裡也用不了。這就是為什麼有些程式碼需要「環境判斷」。
:::

---

## 2. 瀏覽器執行時期

::: tip 🤔 核心問題
**瀏覽器提供了哪些能力讓 JavaScript 操作網頁？**
:::

### 2.1 瀏覽器執行時期的組成

```
┌─────────────────────────────────────────────┐
│            JavaScript 引擎                  │
│            (V8 / SpiderMonkey)              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│              Web APIs                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   DOM   │ │   BOM    │ │ Network  │     │
│  │ 操作網頁 │ │ 操作瀏覽器│ │ 網路請求  │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           事件迴圈 (Event Loop)              │
│     負責協調程式碼執行、事件處理、任務排程      │
└─────────────────────────────────────────────┘
```

### 2.2 Web APIs 的三大類

**1. DOM API - 操作網頁內容**

```javascript
// 尋找元素
const title = document.querySelector('h1')

// 修改內容
title.textContent = '新標題'

// 新增樣式
title.style.color = 'red'
```

**2. BOM API - 操作瀏覽器**

```javascript
// 頁面跳轉
window.location.href = 'https://example.com'

// 瀏覽器儲存
localStorage.setItem('key', 'value')

// 瀏覽器歷史記錄
history.back()
```

**3. Network API - 網路請求**

```javascript
// 發送 HTTP 請求
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

### 2.3 瀏覽器特有的事件機制

瀏覽器執行時期最強大的功能之一是「事件驅動」——程式碼不需要一直執行，而是等使用者操作時才執行。

```javascript
button.addEventListener('click', () => {
  console.log('按鈕被點擊了')
})
```

**常見事件類型：**

| 事件類型 | 觸發時機 | 實際場景 |
|---------|---------|---------|
| `click` | 滑鼠點擊 | 按鈕互動 |
| `input` | 輸入框內容變化 | 即時搜尋 |
| `scroll` | 頁面捲動 | 延遲載入 |
| `load` | 資源載入完成 | 初始化資料 |
| `error` | 發生錯誤 | 錯誤處理 |

---

## 3. Node.js 執行時期

::: tip 🤔 核心問題
**JavaScript 能在伺服器端執行，靠的是什麼？**
:::

### 3.1 Node.js 的組成

```
┌─────────────────────────────────────────────┐
│            JavaScript 引擎                  │
│                 (V8)                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Node.js 內建模組                   │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   fs    │ │   http   │ │   path   │     │
│  │ 檔案操作 │ │ 網路伺服器│ │ 路徑處理  │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          libuv 事件迴圈庫                    │
│      跨平台的非同步 I/O 支援                 │
└─────────────────────────────────────────────┘
```

### 3.2 Node.js 特有能力

**1. 檔案系統操作**

```javascript
const fs = require('fs')

// 讀取檔案
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// 寫入檔案
fs.writeFile('./output.txt', 'Hello', (err) => {
  if (err) throw err
  console.log('寫入成功')
})
```

**2. HTTP 伺服器**

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World</h1>')
})

server.listen(3000)
```

**3. 模組系統**

```javascript
// CommonJS (Node.js 預設)
const fs = require('fs')
module.exports = { myFunction }

// ES Modules (現代方式)
import fs from 'fs'
export { myFunction }
```

### 3.3 瀏覽器 vs Node.js 對比

| 特性 | 瀏覽器 | Node.js |
|------|--------|---------|
| **入口檔案** | HTML 檔案 | JavaScript 檔案 |
| **全域物件** | `window`, `document` | `global`, `process` |
| **模組載入** | `<script>` 標籤 | `require()` / `import` |
| **安全性** | 沙箱環境，受限 | 可以存取系統資源 |
| **用途** | 使用者介面 | 後端服務、工具 |

---

## 4. 事件迴圈深入

::: tip 🤔 核心問題
**JavaScript 是單執行緒的，為什麼能做到「不阻塞」？**
:::

### 4.1 事件迴圈是什麼

**事件迴圈 = JavaScript 的「任務排程中心」**

JavaScript 是單執行緒的，一次只能做一件事。但事件迴圈讓它看起來能「同時」做很多事。

**核心機制：**

1. **執行同步程式碼**（呼叫堆疊）
2. **處理非同步任務**（任務佇列）
3. **等待新任務**（循環往復）

```
呼叫堆疊                  任務佇列
┌─────────┐              ┌──────────┐
│ 任務 1  │              │ 巨集任務 1 │
│ 任務 2  │ ←──────────── │ 巨集任務 2 │
│ 任務 3  │  執行完一個    │ 巨集任務 3 │
└─────────┘  就取下一個   └──────────┘
      ↓                        ↑
      └────────────────────────┘
         事件迴圈不斷檢查
```

### 4.2 巨集任務 vs 微任務

這是面試和實際開發中最容易搞混的概念！

**巨集任務 (Macrotask)：**
- `setTimeout`, `setInterval`
- I/O 操作
- UI 渲染

**微任務 (Microtask)：**
- `Promise.then`
- `MutationObserver`
- `queueMicrotask`

**執行順序：同步程式碼 → 微任務 → 巨集任務**

👇 **動手試試看**：觀察巨集任務和微任務的執行順序

<TaskQueueDemo />

### 4.3 經典面試題

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// 輸出: 1, 4, 3, 2
```

**為什麼是這個順序？**

1. 執行同步程式碼：`console.log('1')`，`console.log('4')` → 輸出 1, 4
2. 檢查微任務佇列：`Promise.then` → 輸出 3
3. 檢查巨集任務佇列：`setTimeout` → 輸出 2

::: info 💡 實戰技巧
- 如果想讓程式碼盡快執行，用微任務（`Promise.then`）
- 如果想延遲執行，用巨集任務（`setTimeout`）
- 永遠不要混用太多非同步操作，否則會陷入「回呼地獄」
:::

---

## 5. 呼叫堆疊與記憶體

::: tip 🤔 核心問題
**程式碼是怎麼被執行的？變數存在哪裡？什麼時候被回收？**
:::

### 5.1 呼叫堆疊：函式執行的「足跡」

**呼叫堆疊 = 記錄函式呼叫的「筆記本」**

每次呼叫一個函式，就會在堆疊上新增一筆記錄；函式執行完，記錄就被移除。

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('執行完畢')
}

a()
```

**呼叫堆疊的變化：**

```
步驟 1: 呼叫 a()
┌─────────┐
│    a    │
└─────────┘

步驟 2: a() 呼叫 b()
┌─────────┐
│    b    │
│    a    │
└─────────┘

步驟 3: b() 呼叫 c()
┌─────────┐
│    c    │
│    b    │
│    a    │
└─────────┘

步驟 4: c() 執行完，依序彈出
┌─────────┐
│    b    │
│    a    │
└─────────┘
```

👇 **動手試試看**：觀察呼叫堆疊的變化

<CallStackDemo />

### 5.2 記憶體管理：垃圾去哪了

JavaScript 有「自動垃圾回收」機制——你不需要手動釋放記憶體，引擎會幫你做。

**垃圾回收的原理：標記-清除算法**

1. **標記階段**：從「根」開始，找到所有能存取的變數
2. **清除階段**：沒被標記的變數就是「垃圾」，會被回收

```javascript
// 垃圾回收範例
let obj1 = { name: '物件1' }
let obj2 = { name: '物件2' }

// obj1 被重新賦值，原來的物件失去了參照
obj1 = null  // 原來的 { name: '物件1' } 會被回收

// obj2 還在使用中，不會被回收
console.log(obj2.name)
```

👇 **動手試試看**：觀察垃圾回收的過程

<GarbageCollectionDemo />

### 5.3 記憶體洩漏：忘記清理的後果

**記憶體洩漏 = 該釋放的記憶體沒釋放，越積越多**

常見原因：

**1. 全域變數太多**

```javascript
// ❌ 錯誤：全域變數不會被回收
globalCache = []

function addItem(item) {
  globalCache.push(item)
}
```

**2. 事件監聽沒移除**

```javascript
// ❌ 錯誤：監聽器沒移除
button.addEventListener('click', handleClick)

// ✅ 正確：不需要時移除監聽
button.removeEventListener('click', handleClick)
```

**3. 閉包參照大物件**

```javascript
// ❌ 錯誤：閉包一直參照大物件，不會被回收
function createHandler() {
  const bigData = new Array(1000000).fill('data')
  return function() {
    console.log('處理中')
  }
}

const handler = createHandler()  // bigData 一直存在於記憶體中
```

👇 **動手試試看**：觀察記憶體洩漏是如何發生的

<MemoryLeakDemo />

::: info 💡 實戰技巧
- **定期檢查**：開啟瀏覽器 DevTools → Memory → Take Heap Snapshot，查看記憶體佔用
- **避免全域變數**：盡量用 `const` 和 `let`，不用 `var`
- **及時清理**：事件監聽、計時器用完要移除
- **弱參照**：用 `WeakMap` 和 `WeakSet` 儲存物件參照
:::

---

## 6. 實戰技巧

::: tip 🤔 核心問題
**怎麼寫出高效能的 JavaScript 程式碼？遇到問題怎麼除錯？**
:::

### 6.1 效能最佳化技巧

**1. 減少重排重繪**

```javascript
// ❌ 錯誤：每次迴圈都觸發重排
for (let i = 0; i < 1000; i++) {
  element.style.top = i + 'px'
}

// ✅ 正確：批次修改
element.style.transform = `translateY(${position}px)`
```

**2. 使用事件委託**

```javascript
// ❌ 錯誤：給每個按鈕都新增監聽
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ 正確：只給父元素新增一個監聽
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e)
  }
})
```

**3. 防抖和節流**

```javascript
// 防抖：使用者停止輸入後再執行
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 節流：限制執行頻率
function throttle(fn, delay) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
```

### 6.2 除錯技巧

**1. 用 DevTools 查看呼叫堆疊**

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  debugger  // 在這裡暫停，查看呼叫堆疊
}

a()
```

**2. 用 `console.trace()` 追蹤執行路徑**

```javascript
function trackExecution() {
  console.trace('執行路徑')
  // 會輸出完整的呼叫堆疊
}
```

**3. 用 Performance 分析效能**

```javascript
performance.mark('start')

// 執行一些程式碼
for (let i = 0; i < 10000; i++) {
  // ...
}

performance.mark('end')
performance.measure('迴圈效能', 'start', 'end')

const measure = performance.getEntriesByName('迴圈效能')[0]
console.log(`執行時間: ${measure.duration}ms`)
```

### 6.3 常見問題速查

| 問題 | 可能原因 | 解決方案 |
|------|---------|---------|
| **記憶體佔用高** | 記憶體洩漏、快取太多 | 檢查全域變數、移除監聽器 |
| **頁面卡頓** | 長任務阻塞主執行緒 | 拆分任務、用 Web Workers |
| **事件不觸發** | 監聽器沒綁定、元素不存在 | 檢查 DOM 載入時機 |
| **非同步順序錯亂** | 混用巨集任務和微任務 | 統一用 Promise 或 async/await |
| **計時器不準** | 主執行緒阻塞 | 用 Web Workers 或 requestAnimationFrame |

---

## 總結

你現在應該能理解：

- **執行時期 = 引擎 + 環境 API**，不同執行時期提供不同能力
- **事件迴圈**負責協調同步程式碼、微任務、巨集任務的執行順序
- **呼叫堆疊**記錄函式執行過程，**堆疊溢位**是因為遞迴太深
- **垃圾回收**自動清理不用的變數，但要注意**記憶體洩漏**
- **效能最佳化**的關鍵是減少重排重繪、合理使用非同步

::: info 💡 遇到問題時這樣跟 AI 說
- 「這個函式執行太慢，幫我看看怎麼最佳化效能」
- 「記憶體佔用一直在漲，可能是記憶體洩漏，幫我檢查一下」
- 「非同步操作順序不對，應該是先 A 再 B，現在是 A 和 B 幾乎同時開始」
- 「事件監聽器沒有觸發，檢查一下元素是否已經載入到 DOM」
:::

# 設計模式基礎

::: tip 前言
**為什麼你的程式碼總是「能跑但很亂」？** 你可能遇到過這樣的情況：需求一變，程式碼就要大改；想複用一段邏輯，卻發現它和其他程式碼糾纏在一起。設計模式就是前人總結的「程式碼組織套路」，幫你寫出靈活、可維護的程式碼。

本章帶你理解最實用的設計模式，不是死記硬背，而是理解「什麼場景用什麼套路」。
:::

**這篇文章會帶你學什麼？**

| 章節 | 內容 | 核心概念 |
|-----|------|---------|
| **第 1 章** | 設計模式是什麼 | 模式的本質與分類 |
| **第 2 章** | 建立型模式 | 如何優雅地建立物件 |
| **第 3 章** | 結構型模式 | 如何組織程式碼結構 |
| **第 4 章** | 行為型模式 | 如何管理物件間的互動 |

學完本章，你將掌握最常用的設計模式，能在實際專案中識別適用場景並靈活運用。

---

## 0. 全景圖：設計模式的本質

想像你在學做菜。你可以每次都從零開始摸索，也可以學習經典食譜——食譜不會限制你的創造力，反而讓你站在前人的肩膀上。設計模式就是程式設計世界的「經典食譜」。

::: tip 設計模式的價值
- **共同語言**：說「這裡用觀察者模式」，團隊立刻理解你的設計意圖
- **經驗複用**：不用重新踩前人踩過的坑
- **靈活擴展**：好的模式讓程式碼面對變化時只需小改，而不是大改
:::

透過下面的互動元件，瀏覽常見設計模式的分類和用途：

<DesignPatternCatalogDemo />

---

## 1. 建立型模式：如何優雅地建立物件

### 1.1 單例模式（Singleton）

**場景**：全域只需要一個實例，比如設定管理器、日誌記錄器、資料庫連線池。

```javascript
class ConfigManager {
  static instance = null

  static getInstance() {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  constructor() {
    this.config = {}
  }
}

// 無論呼叫多少次，都是同一個實例
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 工廠模式（Factory）

**場景**：根據不同條件建立不同類型的物件，呼叫方不需要知道具體的建立細節。

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`發送電子郵件: ${message}`) }
    case 'sms':
      return { send: () => console.log(`發送簡訊: ${message}`) }
    case 'push':
      return { send: () => console.log(`推送通知: ${message}`) }
    default:
      throw new Error(`未知通知類型: ${type}`)
  }
}

// 呼叫方不關心具體實作
const notification = createNotification('email', '你好')
notification.send()
```

---

## 2. 結構型模式：如何組織程式碼結構

### 2.1 轉接器模式（Adapter）

**場景**：兩個介面不相容，需要一個「轉換插頭」。比如舊 API 回傳的資料格式和新元件期望的格式不一致。

```javascript
// 舊 API 回傳的格式
const oldApi = {
  getUserInfo: () => ({ user_name: '張三', user_age: 25 })
}

// 轉接器：轉換為新格式
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: '張三', age: 25 }
```

### 2.2 裝飾器模式（Decorator）

**場景**：在不修改原有程式碼的前提下，給物件添加新功能。像給手機套殼——手機功能不變，但多了保護。

```javascript
// 基礎日誌函式
function log(message) {
  console.log(message)
}

// 裝飾：添加時間戳
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// 裝飾：添加日誌級別
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('服務啟動成功')
// [2025-01-15T10:30:00.000Z] [INFO] 服務啟動成功
```

---

## 3. 行為型模式：如何管理物件間的互動

### 3.1 觀察者模式（Observer）

**場景**：一個物件狀態變化時，需要自動通知其他物件。比如使用者下單後，需要同時發電子郵件、扣庫存、記日誌。

```javascript
class EventEmitter {
  constructor() {
    this.listeners = {}
  }

  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = []
    this.listeners[event].push(callback)
  }

  emit(event, data) {
    (this.listeners[event] || []).forEach(cb => cb(data))
  }
}

const bus = new EventEmitter()
bus.on('order:created', (order) => console.log('發送確認郵件', order.id))
bus.on('order:created', (order) => console.log('扣減庫存', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 策略模式（Strategy）

**場景**：同一個操作有多種演算法/策略，需要在執行時切換。比如不同的排序方式、不同的價格計算規則。

```javascript
const pricingStrategies = {
  normal: (price) => price,
  vip: (price) => price * 0.8,
  svip: (price) => price * 0.6
}

function calculatePrice(price, memberLevel) {
  const strategy = pricingStrategies[memberLevel] || pricingStrategies.normal
  return strategy(price)
}

calculatePrice(100, 'vip')  // 80
calculatePrice(100, 'svip') // 60
```

透過下面的互動元件，動手體驗不同設計模式的執行效果：

<PatternPlaygroundDemo />

---

## 4. 選擇設計模式的方法

| 你遇到的問題 | 推薦模式 | 核心思路 |
|-------------|---------|---------|
| 全域只需一個實例 | 單例 | 控制實例數量 |
| 根據條件建立不同物件 | 工廠 | 封裝建立邏輯 |
| 介面不相容需要轉換 | 轉接器 | 包裝一層轉換 |
| 動態添加功能 | 裝飾器 | 層層包裝增強 |
| 狀態變化需通知多方 | 觀察者 | 發布-訂閱解耦 |
| 多種演算法需執行時切換 | 策略 | 將演算法封裝為物件 |

::: tip 核心原則
設計模式不是越多越好。**過度設計**和**沒有設計**一樣糟糕。只在真正需要靈活性的地方使用模式，簡單問題用簡單方案。記住 KISS 原則：Keep It Simple, Stupid。
:::

---

## 5. AI 助力：用大模型學習和應用設計模式

大模型可以幫你識別程式碼中適合使用設計模式的場景，並給出具體的重構方案。

### 5.1 識別適用模式

> **提示詞**：
> ```
> 分析以下程式碼，判斷是否存在可以用設計模式改進的地方。
> 如果有，請說明：
> 1. 目前程式碼的問題
> 2. 推薦使用哪種設計模式
> 3. 重構後的程式碼範例
> 4. 為什麼這個模式適合這個場景
>
> [貼上你的程式碼]
> ```

### 5.2 用具體場景學習模式

> **提示詞**：
> ```
> 用一個「外送點餐系統」的真實場景，分別示範以下設計模式的應用：
> - 工廠模式：建立不同類型的訂單
> - 觀察者模式：訂單狀態變化通知
> - 策略模式：不同的外送費計算規則
>
> 用 JavaScript 程式碼範例，每個模式先展示不用模式的問題，
> 再展示用模式後的改進。
> ```

### 5.3 判斷是否過度設計

> **提示詞**：
> ```
> 審查以下程式碼，判斷是否存在過度設計的問題。
> 是否有不必要的抽象、用不到的設計模式、或過早的最佳化？
> 如果有，請建議如何簡化，遵循 KISS 原則。
>
> [貼上你的程式碼]
> ```

::: tip AI 使用建議
讓 AI 用你熟悉的業務場景來解釋設計模式，比看抽象的 UML 圖有效得多。但記住：AI 可能傾向於推薦更複雜的方案，你需要自己判斷是否真的需要。
:::

---

## 6. 總結

1. **建立型模式**：解決「如何建立物件」的問題，讓建立過程更靈活
2. **結構型模式**：解決「如何組織程式碼」的問題，讓結構更清晰
3. **行為型模式**：解決「物件間如何互動」的問題，讓協作更鬆耦合
4. **靈活運用**：根據實際場景選擇，不要為了用模式而用模式

::: tip 終極思考
設計模式的本質是**管理變化**。好的設計讓變化的部分容易修改，不變的部分保持穩定。當你寫程式碼時問自己：「如果需求變了，我需要改多少地方？」——如果答案是「很多地方」，那可能需要一個設計模式來幫忙了。
:::

---

## 延伸閱讀

- **經典書籍**：GoF《設計模式：可複用物件導向軟體的基礎》是設計模式的開山之作。
- **現代視角**：JavaScript 中很多模式因為語言特性（閉包、高階函式）變得更簡潔。
- **實踐建議**：先理解問題，再考慮模式。不要拿著鐵鎚找釘子。
- **進階學習**：了解 SOLID 原則，它是設計模式背後的指導思想。

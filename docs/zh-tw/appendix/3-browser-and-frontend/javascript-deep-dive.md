# JavaScript 導論

::: tip 前言
你已經學會了 HTML 和 CSS，能做出好看的網頁了。但你可能會發現：點擊按鈕沒反應，填了表單提交不了，網頁就像一張「靜態」的圖片。

這就是我們需要 JavaScript 的原因——它讓網頁「活」起來。點擊按鈕能彈出選單，輸入文字能即時搜尋，捲動頁面能載入更多內容……這些互動效果都靠 JavaScript。

在 vibecoding 裡，AI 會幫你寫大部分程式碼。但你至少得能看懂程式碼在做什麼，否則 AI 寫錯了你也不會發現。讀完這篇，你就能：

- 讀懂 AI 寫的程式碼在做什麼
- 看出程式碼哪裡有問題
- 用清晰的話告訴 AI 怎麼改
:::

**這篇文章會帶你學什麼？**

| 章節 | 內容 | 學完能幹嘛 |
|-----|------|-----------|
| **第 1 章** | JavaScript 是什麼 | 明白它在網頁裡扮演什麼角色 |
| **第 2 章** | 資料與變數 | 知道程式怎麼存東西、怎麼用東西 |
| **第 3 章** | 函式與邏輯 | 看懂程式碼的判斷、迴圈和複用邏輯 |
| **第 4 章** | DOM 與事件 | 知道程式碼怎麼控制網頁、怎麼回應使用者操作 |
| **第 5 章** | 實戰技巧 | 拿到 AI 程式碼怎麼讀、遇到報錯怎麼說 |

每一章都從「能識別程式碼」開始，不需要你會手寫。遇到不懂的程式碼，隨時回來查就行。

---

## 1. JavaScript 是什麼

::: tip 🤔 核心問題
**為什麼網頁需要 JavaScript？** HTML 和 CSS 已經能讓網頁有內容、有樣式了，為什麼還要學一門新語言？
:::

### 1.1 從「靜態網頁」到「動態應用」

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📄 沒有 JavaScript 的網頁**
- 內容固定，無法互動
- 點擊按鈕沒反應
- 填寫表單提交不了
- 頁面不會自動更新

*就像一張紙質海報，只能看*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 有 JavaScript 的網頁**
- 點擊按鈕彈出選單
- 輸入文字即時搜尋
- 捲動自動載入內容
- 資料即時更新顯示

*就像一個真正的應用程式*

</div>
</div>

**用一句話理解三者的關係：**

| 技術 | 比喻 | 作用 |
|------|------|------|
| **HTML** | 骨架 | 定義網頁的結構和內容 |
| **CSS** | 皮膚 | 定義網頁的外觀和樣式 |
| **JavaScript** | 肌肉和神經系統 | 讓網頁能回應、能互動、能思考 |

### 1.2 vibecoding 也需要懂 JavaScript的動機

::: warning 剛學 JS 的開發者踩坑記
一位剛學 JavaScript 的開發者用 AI 做了一個「計數器」應用：點擊按鈕，數字加 1。AI 生成的程式碼能正常工作。

但他想改成「點擊加 2」，對 AI 說：「讓每次點擊加 2。」 AI 改了程式碼，可數字還是只加 1。

他問 AI 為啥沒效果，AI 解釋了一通，但他看不懂程式碼裡的 `count = count + 1` 是什麼意思，也不知道 AI 改的是不是這個地方。只能反覆說「加 2 沒效果」，AI 又改了好幾版，有的把初始值改成 2，有的在完全不相關的地方加了 2。

最後他看了第 2 章「變數」的概念，明白了 `count = count + 1` 是在把 count 的值加 1 再存回去。然後他對 AI 說：「把 `count + 1` 改成 `count + 2`。」

一次就改對了。

**這就是為什麼要懂 JavaScript——不是為了手寫程式碼，而是為了在 AI 沒改對時，你能一眼看出問題在哪，一句話說到點子上。**
:::

### 1.3 先睹為快：一段真實的 AI 程式碼

在深入學習之前，讓我們先看一段 AI 生成的真實程式碼。不要擔心看不懂，只要有個印象，後面我們會逐一講解每個部分。

**場景**：做一個「點擊按鈕切換背景顏色」的功能

```javascript
// 定義一組顏色
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
let currentIndex = 0

// 找到頁面上的按鈕
const button = document.querySelector('#changeBtn')

// 給按鈕添加點擊事件
button.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % colors.length
  document.body.style.backgroundColor = colors[currentIndex]
})
```

**這段程式碼在做什麼？**

| 程式碼 | 作用 | 對應章節 |
|------|------|----------|
| `const colors = [...]` | 定義一組顏色資料 | 第 2 章：陣列 |
| `let currentIndex = 0` | 記錄目前顯示第幾個顏色 | 第 2 章：變數 |
| `document.querySelector(...)` | 找到頁面上的按鈕 | 第 4 章：DOM 查找 |
| `button.addEventListener(...)` | 給按鈕添加點擊事件 | 第 4 章：事件監聽 |
| `() => {...}` | 定義點擊後要執行的程式碼 | 第 3 章：箭頭函式 |

::: info 💡 核心啟示
你不需要現在就理解每一行程式碼。只要記住：**JavaScript 程式碼就是一系列指令，告訴瀏覽器「當使用者做某事時，應該發生什麼」。**
:::

---

## 2. 資料篇：變數與資料型別

::: tip 🤔 核心問題
**程式是怎麼「記住」東西的？** 使用者輸入的內容、從伺服器取得的資料、計算過程中的中間結果——這些資訊都存在哪裡？
:::

### 2.1 變數：給資料起個名字

**變數就像一個有標籤的盒子**——你可以把資料放進去，以後透過標籤來取用。

```javascript
const name = "張三"   // 名字不會變，用 const
let age = 25          // 年齡可能會變，用 let
```

**為什麼要區分 const 和 let？**

想像一下：你的身分證字號（const）這輩子都不會變，但你的年齡（let）每年都會變。JavaScript 讓你在不同的關鍵字來表達這種「變與不變」的意圖。

| 關鍵字 | 能否修改 | 使用場景 | 範例 |
|--------|---------|----------|------|
| `const` | ❌ 不能 | 值不會變的資料 | 身分證字號、配置項、顏色列表 |
| `let` | ✅ 能 | 值會變化的資料 | 計數器、目前選中的選項、使用者輸入 |

::: details 🔍 看一個具體的範例
```javascript
// 用 const：這些值不會變
const PI = 3.14159
const MAX_USERS = 100
const APP_NAME = "TodoList"

// 用 let：這些值會變化
let count = 0
count = 1  // ✅ 可以修改

count = count + 1  // ✅ 可以基於原值計算

// 如果用 const 會怎樣？
const fixedCount = 0
fixedCount = 1  // ❌ 報錯！const 不能重新賦值
```
:::

👇 **動手試試看**：修改下面的程式碼，看看 const 和 let 的區別

<VariableBoxDemo />

### 2.2 資料型別：JavaScript 裡的幾種「東西」

JavaScript 把資料分成幾種類型，最常用的有三種：

| 類型 | 說明 | 範例 | 實際場景 |
|------|------|------|----------|
| `string`（字串）| 文字內容 | `"hello"`, `'你好'` | 使用者名稱、商品描述、提示資訊 |
| `number`（數字）| 數值 | `42`, `3.14` | 價格、數量、評分 |
| `boolean`（布林值）| 是/否 | `true`, `false` | 是否登入、是否完成、是否可見 |

**還有兩個特殊值需要知道：**

- `undefined` → 變數宣告了，但還沒給值
- `null` → 故意設為空（表示「這裡沒有值」）

::: details 🔍 範本字串：更方便地拼接文字
在 AI 程式碼裡，你經常會看到用反引號（`` ` ``）包裹的字串，裡面還有 `${...}`：

```javascript
const name = "張三"
const age = 25

// 傳統寫法（麻煩）
const message = "我叫" + name + "，今年" + age + "歲"

// 範本字串（簡潔）
const message = `我叫${name}，今年${age}歲`
// 結果："我叫張三，今年25歲"
```

**識別要點**：看到反引號和 `${}`，就知道是在把變數插入到文字中。
:::

### 2.3 物件和陣列：把資料組織起來

**物件 = 一組有名字的屬性**（像一張個人資訊表）

```javascript
const user = {
  name: "張三",
  age: 25,
  isVIP: true
}

// 使用點號存取屬性
console.log(user.name)    // "張三"
console.log(user.age)     // 25
```

**陣列 = 一組有順序的資料**（像一個列表）

```javascript
const colors = ['紅色', '綠色', '藍色']

// 用索引存取（從 0 開始）
console.log(colors[0])  // "紅色"
console.log(colors[1])  // "綠色"
```

**巢狀結構：物件裡套陣列、陣列裡套物件**

這是 AI 程式碼中最常見的資料結構：

```javascript
const todos = [
  { id: 1, text: "學習 JavaScript", done: false },
  { id: 2, text: "做專案", done: true },
  { id: 3, text: "寫文件", done: false }
]

// 存取：先取陣列的第 0 項，再取它的 text 屬性
console.log(todos[0].text)  // "學習 JavaScript"
```

::: info 💡 識別技巧
- 看到 `{}` → 這是一個物件，裡面是一組 `名字: 值`
- 看到 `[]` → 這是一個陣列，裡面是一組按順序排列的值
- 看到 `data[0].name` → 先取陣列第 0 項，再取它的 name 屬性
:::

### 2.4 值與參考：一個容易踩的坑

這是新手最常遇到的問題之一！

**基本型別（string、number、boolean）賦值 = 複製一份全新的資料：**

```javascript
let a = 10
let b = a      // b 得到 a 的副本
b = 20
console.log(a) // 10（a 不受影響）
```

**物件和陣列賦值 = 複製的是「位址」（指向同一個東西）：**

```javascript
let user1 = { name: "張三" }
let user2 = user1      // user2 指向同一個物件
user2.name = "李四"     // 修改 user2 會影響 user1
console.log(user1.name) // "李四"（user1 也變了！）
```

**為什麼要建立副本？**

在 React/Vue 中，直接修改資料會導致介面不更新。所以 AI 程式碼裡經常看到 `[...array]` 或 `{...obj}`——它在建立副本，避免互相影響。

```javascript
// 用展開運算子建立副本
const arr1 = [1, 2, 3]
const arr2 = [...arr1]     // 建立新陣列
arr2.push(4)
console.log(arr1)          // [1, 2, 3]（不受影響）
console.log(arr2)          // [1, 2, 3, 4]
```

👇 **動手試試看**：觀察修改副本時原資料的變化

<ReferenceDemo />

### 2.5 解構與展開：現代 JavaScript 的快捷寫法

這兩個語法在 AI 程式碼裡到處都是，不認識就讀不懂程式碼。

**解構賦值：從物件或陣列裡快速提取資料**

```javascript
const user = { name: "張三", age: 25, city: "北京" }

// 傳統寫法（麻煩）
const name = user.name
const age = user.age

// 解構寫法（簡潔）
const { name, age } = user
// 效果一樣，但一行搞定
```

**展開運算子：複製並擴展資料**

```javascript
// 複製陣列並添加新元素
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]  // [1, 2, 3, 4, 5]

// 複製物件並添加新屬性
const user1 = { name: "張三", age: 25 }
const user2 = { ...user1, city: "北京" }
// { name: "張三", age: 25, city: "北京" }
```

::: info 💡 識別技巧
- 看到 `const { name, age } = person` → 從 person 物件裡提取 name 和 age
- 看到 `...array` 或 `...obj` → 把陣列或物件展開鋪平
- 你不需要能手寫，但必須能讀懂
:::

---

## 3. 邏輯篇：函式與流程控制

::: tip 🤔 核心問題
**程式碼是怎麼「做決定」和「重複做事」的？** 程式需要根據條件執行不同的操作，也需要重複執行某些任務——這些邏輯怎麼表達？
:::

### 3.1 條件判斷：如果...就...否則...

**if/else：最基本的條件判斷**

```javascript
const age = 18

if (age >= 18) {
  console.log("成年人")
} else {
  console.log("未成年")
}
```

**三元運算子：簡寫的 if/else**

```javascript
// 完整寫法（4 行）
let message
if (age >= 18) {
  message = "成年人"
} else {
  message = "未成年"
}

// 三元運算子（1 行）
const message = age >= 18 ? "成年人" : "未成年"
// 格式：條件 ? 條件為真時的值 : 條件為假時的值
```

**&& 短路寫法：React 程式碼裡常見**

```javascript
// 只有 isLoggedIn 為 true 時才顯示使用者面板
isLoggedIn && <UserPanel />

// 等價於
if (isLoggedIn) {
  return <UserPanel />
}
```

::: info 💡 識別技巧
- 看到 `? :` → 這是三元運算子，簡寫的 if/else
- 看到 `&&` → 前面為 true 才執行後面
:::

### 3.2 函式：把操作打包起來

**函式 = 一道菜的配方**

- 定義函式 = 寫下配方
- 呼叫函式 = 按配方做菜
- 參數 = 原料
- 回傳值 = 成品

```javascript
// 定義函式（寫下配方）
function greet(name) {
  return "Hello " + name
}

// 呼叫函式（按配方做菜）
console.log(greet("張三"))  // "Hello 張三"
console.log(greet("李四"))  // "Hello 李四"
```

**三種寫法，一眼識別：**

```javascript
// 1. function 宣告（傳統寫法）
function greet(name) {
  return "Hello " + name
}

// 2. 箭頭函式（AI 程式碼裡用得最多）
const greet = (name) => {
  return "Hello " + name
}

// 3. 箭頭函式簡寫（只有一行時）
const greet = (name) => "Hello " + name
```

👇 **動手試試看**：輸入不同的名字，看看函式怎麼工作

<FunctionMachineDemo />

::: info 💡 識別技巧
- 看到 `function` 或 `=>` → 這是一個函式
- 看到 `fn()` → 在呼叫這個函式
- 看到 `() => {}` → 箭頭函式，現代 JS 的主流寫法
:::

### 3.3 陣列方法：處理列表的利器

在 React/Vue 裡，幾乎每個列表渲染都會用到這些方法。

```javascript
const todos = [
  { id: 1, text: "學習", done: false },
  { id: 2, text: "工作", done: true }
]

// .map()：把陣列的每一項變成另一個東西
const texts = todos.map(todo => todo.text)
// ["學習", "工作"]

// .filter()：篩選出符合條件的項
const unfinished = todos.filter(todo => !todo.done)
// [{ id: 1, text: "學習", done: false }]

// .find()：找到第一個符合條件的項
const found = todos.find(todo => todo.id === 1)
// { id: 1, text: "學習", done: false }
```

::: info 💡 識別技巧
- 看到 `.map()` → 對陣列做變換，回傳新陣列
- 看到 `.filter()` → 篩選陣列
- 看到 `items.map(item => <li>{item.name}</li>)` → 把每個資料項變成列表標籤
:::

### 3.4 作用域：變數的「可見範圍」

**用「房間」比喻：**

- 函式內部的變數就像房間裡的東西，外面看不到
- 但房間裡的人可以看到走廊（外層作用域）的東西

```javascript
const global = "全域變數"  // 走廊裡的東西

function room() {
  const local = "房間裡的東西"  // 房間裡的東西
  console.log(global)  // ✅ 能看到走廊
}

console.log(local)  // ❌ 報錯！外面看不到房間裡的東西
```

**核心直覺：** 程式碼寫在哪裡，決定了它能看到什麼變數。

👇 **動手試試看**：點擊不同的作用域，看看能存取哪些變數

<ScopeDemo />

### 3.5 閉包：函式「記住」了它誕生時的環境

**不要把它當成獨立的概念，從一個具體場景理解：**

```javascript
function setupCounter() {
  let count = 0  // 這個變數在函式內部

  return {
    add: () => { count++; return count },
    getCount: () => count
  }
}

const counter = setupCounter()
console.log(counter.add())      // 1
console.log(counter.add())      // 2
console.log(counter.getCount()) // 2
```

**核心直覺：** 函式在被建立時，會「記住」它周圍的變數，即使外層函式已經執行完了。

👇 **動手試試看**：觀察閉包如何讓函式「記住」狀態

<ClosureDemo />

### 3.6 this：函式被誰呼叫

**不講複雜的繫結規則，只講最常見的場景：**

**場景 1：在物件的方法裡，this 指向這個物件**

```javascript
const user = {
  name: "張三",
  sayHi() {
    console.log("你好，我是" + this.name)  // this 指向 user
  }
}
user.sayHi()  // "你好，我是張三"
```

**場景 2：在事件監聽裡，this 指向觸發事件的元素**

```javascript
button.addEventListener('click', function() {
  console.log(this)  // this 指向 button 元素
})

// 但箭頭函式不會改變 this
button.addEventListener('click', () => {
  console.log(this)  // this 指向外層的 this
})
```

::: info 💡 遇到問題怎麼辦？
如果 AI 程式碼裡出現 this 相關的 bug（比如 `Cannot read property of undefined`），告訴 AI：「這個方法裡的 this 指向不對，改成箭頭函式或者用 bind」
:::

---

## 4. 互動篇：DOM、事件與非同步

::: tip 🤔 核心問題
**JavaScript 怎麼跟網頁「互動」？** 怎麼找到頁面上的元素？怎麼回應使用者的點擊、輸入？怎麼從伺服器取得資料？
:::

### 4.1 DOM：JavaScript 看到的網頁

網頁在 JavaScript 眼裡是一棵「樹」，每個 HTML 標籤都是樹上的一個「節點」。

```html
<html>
  <body>
    <h1>標題</h1>
    <p>段落</p>
    <ul>
      <li>項目1</li>
      <li>項目2</li>
    </ul>
  </body>
</html>
```

**JS 操控網頁 = 找到節點 + 修改節點 + 建立/刪除節點**

👇 **動手試試看**：點擊節點，看看 DOM 樹是怎麼組織的

<DOMTreeDemo />

### 4.2 查找與修改元素

**查找元素：**

```javascript
// 根據 CSS 選擇器查找（最常用）
const title = document.querySelector('h1')      // 找第一個 h1
const button = document.querySelector('#btn')   // 找 id="btn" 的元素
const items = document.querySelectorAll('.item') // 找所有 class="item" 的元素
```

**修改元素：**

```javascript
// 改文字
title.textContent = "新標題"

// 改樣式
element.style.color = "red"
element.style.fontSize = "20px"

// 改 CSS 類別
element.classList.add('active')      // 添加類別
element.classList.remove('hidden')   // 移除類別
element.classList.toggle('open')     // 切換類別（有就移除，沒有就添加）
```

::: info 💡 識別技巧
- 看到 `document.querySelector` → 在查找網頁元素
- 看到 `.textContent` → 改文字
- 看到 `.style.xxx` → 改樣式
- 看到 `.classList.add/remove/toggle` → 改 CSS 類別
:::

### 4.3 事件：當使用者做了某個操作時...

**addEventListener：給元素添加事件監聽**

```javascript
button.addEventListener('click', () => {
  console.log("按鈕被點擊了")
})
```

**常見事件：**

| 事件 | 觸發時機 | 實際場景 |
|------|---------|----------|
| `click` | 點擊 | 按鈕點擊、連結跳轉 |
| `input` | 輸入框內容變化 | 即時搜尋、表單驗證 |
| `submit` | 表單提交 | 登入、註冊、提交資料 |
| `scroll` | 捲動頁面 | 懶載入、回到頂部 |

**事件物件：取得更多資訊**

```javascript
input.addEventListener('input', (e) => {
  console.log(e.target.value)  // 取得輸入框的值
  e.preventDefault()            // 阻止預設行為（比如表單提交後重新整理頁面）
})
```

::: info 💡 實際應用
當你想給按鈕加一個功能，本質上就是在告訴 AI：「給這個按鈕添加一個點擊事件，點擊後執行某某操作」
:::

### 4.4 非同步：為什麼有些操作不是立刻完成的

**餐廳比喻：**

點菜後不用站在廚房門口等，可以先做別的事，菜好了服務生會端過來。

**最常見場景：從伺服器取得資料**

```javascript
// 同步寫法（會卡住頁面，不要用）
const data = fetch('/api/data')  // ❌ 這樣寫會卡住

// 非同步寫法（正確）
async function loadData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('出錯了:', error)
  }
}
```

**async/await 語法：**

- `async` → 標記這個函式裡有非同步操作
- `await` → 等待這個操作完成（但不會卡住頁面）
- `try/catch` → 處理可能出現的錯誤

👇 **動手試試看**：觀察非同步操作的執行順序

<AsyncRestaurantDemo />

::: info 💡 識別技巧
- 看到 `async/await` → 在等待耗時操作
- 看到 `fetch()` → 在從伺服器取得資料
- 看到 `try/catch` → 在處理可能的錯誤
:::

### 4.5 事件迴圈：JavaScript 到底怎麼工作的

**不用術語「微任務/巨集任務」，用一個簡單的模型理解：**

**JS 是一個「單人工位」**，同時只做一件事，但有一個「待辦便條欄」（任務佇列）。

當遇到要等待的操作（網路請求、計時器），JS 不是傻等，而是把「等好了之後做什麼」貼到便條欄，自己繼續往下執行。等當前事情做完了，才去看便條欄。

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)  // 即使是 0 秒，也會推遲

console.log("3")

// 輸出：1, 3, 2（不是 1, 2, 3！）
```

**為什麼？**
1. 執行 `console.log("1")` → 輸出 1
2. 遇到 `setTimeout` → 把回呼貼到便條欄，繼續往下
3. 執行 `console.log("3")` → 輸出 3
4. 當前程式碼執行完了，去看便條欄
5. 執行 `setTimeout` 的回呼 → 輸出 2

👇 **動手試試看**：觀察程式碼的執行順序

<JSEventLoopDemo />

::: info 💡 遇到問題怎麼辦？
如果 AI 程式碼裡資料還沒取得頁面就渲染了，告訴 AI：「資料還沒載入完就開始渲染了，需要添加 loading 狀態，等資料到了再渲染」
:::

### 4.6 模組：import 和 export

AI 生成的 React/Vue 程式碼第一行幾乎都是 `import`。

**import = 從別的檔案引入功能**

```javascript
// 從工具檔案引入函式
import { formatDate } from './utils'

// 從第三方套件引入
import React from 'react'
import { useState } from 'react'
```

**export = 把功能暴露出去給別人用**

```javascript
// utils.js
export function formatDate(date) {
  // ...
}

// 或者預設匯出
export default function formatDate(date) {
  // ...
}
```

**npm 套件 = 別人寫好的工具，安裝後就能用**

```javascript
// 安裝套件：npm install lodash
// 使用套件
import _ from 'lodash'
```

::: info 💡 識別技巧
- 看到 `import` → 從別的檔案引入功能
- 看到 `export` → 把功能暴露給別人用
- 看到 `from 'react'` → 從 React 套件引入
- 看到 `from './utils'` → 從本地檔案引入
:::

---

## 5. 實戰篇：讀懂程式碼、看懂報錯、精準描述

::: tip 🤔 核心問題
**前面學了這麼多語法，實際拿到 AI 程式碼時怎麼用？** 怎麼快速讀懂程式碼？遇到報錯怎麼辦？怎麼讓 AI 準確地幫你改程式碼？
:::

### 5.1 拿到 AI 程式碼後怎麼讀

**四步法：**

| 步驟 | 看什麼 | 範例 |
|------|--------|------|
| **第一步：看整體結構** | 有幾個函式？分別做什麼？ | `loadData()` 載入資料，`renderList()` 渲染列表 |
| **第二步：找入口** | 程式從哪裡開始執行？ | `addEventListener('click', ...)` 點擊時開始 |
| **第三步：追蹤資料流** | 資料從哪裡來？到哪裡去？ | 從 API 取得 → 解析 → 渲染到頁面 |
| **第四步：看細節邏輯** | 具體函式裡怎麼處理的？ | 迴圈、判斷、計算 |

**用第 1 章的程式碼範例做一次完整的「閱讀演示」：**

```javascript
// 第一步：整體結構
// - 一個顏色陣列
// - 一個變數記錄目前索引
// - 一個按鈕的點擊事件

// 第二步：入口點
// button.addEventListener('click', ...) → 點擊按鈕時執行

// 第三步：資料流
// colors（顏色陣列）→ currentIndex（目前索引）→ backgroundColor（背景色）

// 第四步：細節邏輯
// currentIndex = (currentIndex + 1) % colors.length
// 這個公式的意思：每次 +1，但不超過陣列長度（循環）
```

### 5.2 常見報錯速查

| 報錯 | 白話文解釋 | 怎麼跟 AI 說 |
|------|-----------|-------------|
| `TypeError: Cannot read properties of undefined` | 你想從一個不存在的東西上取值 | 「第 X 行報錯，某某變數是 undefined，檢查它的賦值邏輯」 |
| `ReferenceError: xxx is not defined` | 用了一個沒有宣告過的變數名稱 | 「變數 xxx 沒有定義，是不是拼寫錯了或者忘了匯入」 |
| `TypeError: xxx is not a function` | 把一個不是函式的東西當函式呼叫了 | 「xxx 不是函式，檢查一下它的類型和來源」 |
| `SyntaxError: Unexpected token` | 語法寫錯了（括號不匹配、少了逗號等） | 「第 X 行語法錯誤，檢查括號和標點」 |
| `CORS error` | 瀏覽器阻止了跨域請求 | 「遇到 CORS 錯誤，需要配置跨域資源共享」 |
| `404 Not Found` | 請求的資源不存在 | 「API 回傳 404，檢查介面位址是否正確」 |

### 5.3 如何精準描述問題

新手和熟練開發者的差距，往往就體現在**描述問題的精準度**上。

| ❌ 差的描述 | ✅ 好的描述 |
|-----------|-----------|
| 「程式碼有 bug」 | 「點擊刪除按鈕時，刪除的不是目前項而是最後一項」 |
| 「樣式不對」 | 「標題應該置中，現在是左對齊」 |
| 「資料顯示不出來」 | 「fetch 請求回傳了資料（主控台能看到），但頁面沒有重新渲染」 |
| 「加一個功能」 | 「在使用者列表頁面添加一個搜尋框，輸入時即時過濾列表，按 name 欄位模糊比對」 |
| 「點擊沒反應」 | 「點擊按鈕時主控台報錯 'Cannot read property of undefined'，錯誤在第 X 行」 |

**一個實戰練習：**

```javascript
// 有 bug 的程式碼
function deleteTodo(index) {
  todos.splice(index, 1)  // 總是刪除最後一項
}

// 錯誤現象：無論點哪個刪除按鈕，刪的都是最後一項
```

**❌ 差的描述：** 「刪除功能有 bug」

**✅ 好的描述：** 「點擊刪除按鈕時，刪除的不是目前項而是最後一項。程式碼裡用了 splice(index, 1)，但 index 可能不正確。需要改成用每個事項的唯一 id 來匹配刪除。」

### 5.4 你現在應該能識別的程式碼

- 看到 `const/let` → 知道變數能不能重新賦值
- 看到 `{}` → 物件 / 看到 `[]` → 陣列
- 看到 `{...obj}` 或 `[...arr]` → 在建立副本
- 看到 `function` 或 `=>` → 定義了一段可重複執行的操作
- 看到 `if/else` 或 `? :` → 程式碼在做判斷
- 看到 `.map()` / `.filter()` → 在變換或篩選陣列
- 看到 `document.querySelector` → 在查找網頁元素
- 看到 `addEventListener` → 在監聽使用者操作
- 看到 `async/await` → 在等待耗時操作
- 看到 `import/export` → 在引入或匯出模組
- 遇到報錯 → 能讀懂大意並精準描述給 AI

**如果你認真讀了每章的「深入」部分，你還掌握了這些核心概念：**

- **值 vs 參考**：基本型別複製值，物件/陣列複製的是位址
- **作用域與閉包**：函式能「記住」它誕生時周圍的變數
- **this 的本質**：取決於函式被誰呼叫，而不是寫在哪裡
- **事件迴圈**：JS 是單執行緒的，靠任務佇列實現「不阻塞」

這些概念會幫你更快定位問題。

::: info 💡 遇到問題時這樣跟 AI 說
- 「第 X 行報錯 XXX，幫我看看是什麼問題」
- 「這個函式的邏輯是 XXX，但結果不對，應該是 XXX」
- 「我想修改 XXX 功能，具體要求是 XXX」
:::
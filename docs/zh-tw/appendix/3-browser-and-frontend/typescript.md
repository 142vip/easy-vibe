# TypeScript 導論

::: tip 前言
你已經會寫 JavaScript 了，但可能遇到過這些問題：
- 變數指派了錯誤型別，執行階段才發現
- 物件屬性寫錯了名字，除錯半天
- 函式參數型別不對，改來改去

TypeScript 就是在程式碼執行前幫你發現這些問題的工具。讀完這篇，你就能理解 TypeScript 為什麼能提升程式碼品質，看懂型別註解、介面、泛型等核心概念，在 vibecoding 中更好地利用 AI 生成的程式碼。
:::

**這篇文章會帶你學什麼？**

| 章節 | 內容 | 學完能做什麼 |
|-----|------|-----------|
| **第 1 章** | TypeScript 是什麼 | 明白它和 JavaScript 的關係 |
| **第 2 章** | 基礎型別註解 | 知道怎麼給變數標註型別 |
| **第 3 章** | 物件型別與介面 | 定義資料結構的型別 |
| **第 4 章** | 函式型別 | 給函式參數和回傳值標註型別 |
| **第 5 章** | 泛型 | 編寫可重複使用的型別安全程式碼 |
| **第 6 章** | 型別推斷與實用技巧 | 知道何時需要明確註解 |

---

## 1. TypeScript 是什麼

::: tip 🤔 核心問題
**JavaScript 已經夠用了，為什麼還需要 TypeScript？** 多學一門語法值得嗎？
:::

### 1.1 從「執行階段出錯」到「編譯階段發現」

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🔴 JavaScript 的痛點**
- 執行階段才發現型別錯誤
- 拼字錯誤難以察覺
- 重構時容易遺漏
- IDE 提示不夠準確

*就像沒有拼字檢查的文件編輯器*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**✅ TypeScript 的優勢**
- 寫程式碼時就發現錯誤
- 智慧提示更準確
- 重構更安全
- 程式碼更容易維護

*就像有拼字檢查和語法突顯的編輯器*

</div>
</div>

**用一句話理解兩者的關係：**

| 技術 | 比喻 | 作用 |
|------|------|------|
| **JavaScript** | 原始材料 | 可以直接執行的程式碼 |
| **TypeScript** | 藍圖 + 品質檢查 | 給 JavaScript 加型別檢查，最後編譯成 JavaScript |

### 1.2 vibecoding 也需要 TypeScript 的動機

::: warning AI 寫程式碼也會出錯
一位開發者用 AI 生成了一個使用者管理功能。AI 寫的 JavaScript 程式碼能執行，但有個問題：使用者年齡應該是數字，但有時候會被錯誤地指派為字串。

結果在計算「是否成年」時，字串 "25" 被當成字串處理，導致判斷失敗。這個 bug 隱藏了很久，直到某個使用者輸入了非數字字元才暴露出來。

如果用 TypeScript，這段程式碼在寫的時候就會報錯：`不能將型別 "string" 指派給型別 "number"`。

**這就是 TypeScript 的價值——在 AI 寫錯型別時，你能第一時間發現。**
:::

### 1.3 TypeScript 實際上是這樣的

TypeScript 不是一門全新的語言，它只是 JavaScript 的「超集合」：

```typescript
// 這是有效的 JavaScript，也是有效的 TypeScript
const name = "張三"
const age = 25
function greet(user) {
  return `Hello ${user}`
}

// 這是 TypeScript 特有的型別註解
const name2: string = "李四"
const age2: number = 30
function greet2(user: string): string {
  return `Hello ${user}`
}
```

**關鍵理解：**
- 所有 JavaScript 程式碼都是有效的 TypeScript 程式碼
- TypeScript 新增了可選的**型別註解**
- TypeScript 最終會編譯成 JavaScript 執行

::: info 💡 核心啟發
TypeScript 不會改變程式碼的執行方式，它只是在編譯階段幫你檢查型別是否正確。**你可以漸進地採用 TypeScript**——從給關鍵變數新增型別開始。
:::

---

## 2. 基礎型別註解

::: tip 🤔 核心問題
**怎麼告訴 TypeScript 一個變數應該是什麼型別？** 型別註解的語法是怎樣的？
:::

### 2.1 型別註解語法

型別註解就是在變數名稱後面加上`: 型別`：

```typescript
// 語法：變數名稱: 型別 = 值
const name: string = "張三"
let age: number = 25
let isStudent: boolean = true
```

👇 **動手試試看**：給變數新增型別註解

<TypeAnnotationDemo />

::: details 🔍 為什麼有些地方不需要型別註解？
TypeScript 可以根據指派自動推斷型別：

```typescript
// 這些不需要型別註解，TypeScript 能自動推斷
const name = "張三"      // 推斷為 string
const age = 25          // 推斷為 number
const isActive = true   // 推斷為 boolean

// 這些情況需要明確註解
let data  // ❌ 錯誤：不能推斷型別
let data: any  // ✅ 可以，但失去了型別檢查的好處

function add(a, b) {  // ❌ 參數型別不明確
  return a + b
}

function add2(a: number, b: number): number {  // ✅ 型別明確
  return a + b
}
```
:::

### 2.2 基本型別

TypeScript 支援所有 JavaScript 的基本型別：

| 型別 | 說明 | 範例 |
|------|------|------|
| `string` | 字串 | `"hello"`, `'你好'` |
| `number` | 數字（整數和小數） | `42`, `3.14` |
| `boolean` | 布林值 | `true`, `false` |
| `null` / `undefined` | 空值 | `null`, `undefined` |
| `array` | 陣列 | `number[]`, `string[]` |
| `object` | 物件 | `{ name: string; age: number }` |

**陣列型別的兩種寫法：**

```typescript
// 寫法 1：型別[]（較常用）
const numbers: number[] = [1, 2, 3, 4, 5]
const names: string[] = ["張三", "李四", "王五"]

// 寫法 2：Array<型別>
const numbers2: Array<number> = [1, 2, 3, 4, 5]
const names2: Array<string> = ["張三", "李四", "王五"]
```

**特殊型別：**

```typescript
// any：任意型別（謹慎使用，相當於關閉型別檢查）
let data: any = 42
data = "現在可以是字串"
data = { name: "張三" }  // 也可以是物件

// unknown：型別安全的 any
let value: unknown = 42
// if (typeof value === "number") {
//   console.log(value + 10)  // 需要先檢查型別才能用
// }

// void：沒有回傳值
function log(message: string): void {
  console.log(message)
}

// never：永遠不會回傳
function error(message: string): never {
  throw new Error(message)
}
```

::: info 💡 識別技巧
- 看到 `: string` → 這是 string 型別的註解
- 看到 `: number[]` → 這是數字陣列的註解
- 看到 `: void` → 這個函式沒有回傳值
:::

---

## 3. 物件型別與介面

::: tip 🤔 核心問題
**怎麼定義一個物件的型別？** 物件的屬性應該是什麼型別？
:::

### 3.1 介面（Interface）：定義物件的「形狀」

介面是 TypeScript 中定義物件型別的主要方式：

```typescript
// 定義一個 User 介面
interface User {
  id: number
  name: string
  email: string
  age?: number  // 可選屬性
}

// 使用介面
const user: User = {
  id: 1,
  name: "張三",
  email: "zhangsan@example.com",
  age: 25
}

// age 是可選的，可以不提供
const user2: User = {
  id: 2,
  name: "李四",
  email: "lisi@example.com"
}
```

👇 **動手試試看**：建立符合介面定義的物件

<InterfaceDemo />

::: details 🔍 介面的其他特性
```typescript
// 唯讀屬性
interface User {
  readonly id: number  // id 建立後不能修改
  name: string
}

const user: User = {
  id: 1,
  name: "張三"
}

user.id = 2  // ❌ 錯誤：不能修改唯讀屬性
user.name = "李四"  // ✅ 可以修改

// 函式型別
interface User {
  name: string
  greet: () => string  // greet 是一個函式，回傳 string
}

const user: User = {
  name: "張三",
  greet: () => "Hello"
}

// 繼承介面
interface Admin extends User {
  permissions: string[]
}

const admin: Admin = {
  name: "管理員",
  greet: () => "Hello Admin",
  permissions: ["read", "write", "delete"]
}
```
:::

### 3.2 型別別名（Type Alias）

除了介面，還可以用 `type` 定義型別別名：

```typescript
// 型別別名
type User = {
  id: number
  name: string
  email: string
}

// 聯合型別
type Status = "pending" | "success" | "error"

const status: Status = "success"  // ✅
// const status2: Status = "failed"  // ❌ 錯誤：不在聯合型別中

// 交叉型別（合併多個型別）
type User = {
  id: number
  name: string
}

type Timestamp = {
  createdAt: Date
  updatedAt: Date
}

type UserWithTimestamp = User & Timestamp

const user: UserWithTimestamp = {
  id: 1,
  name: "張三",
  createdAt: new Date(),
  updatedAt: new Date()
}
```

**介面 vs 型別別名：**

| 特性 | interface | type |
|------|-----------|------|
| 擴展 | `extends` | `&` 交叉型別 |
| 重複宣告 | 會自動合併 | 會報錯 |
| 適用場景 | 物件形狀、類別 | 聯合型別、交叉型別、基本型別別名 |

::: info 💡 識別技巧
- 看到 `interface` → 這是定義物件型別
- 看到 `type` → 這是建立型別別名
- 看到 `?` → 這是可選屬性
- 看到 `readonly` → 這是唯讀屬性
:::

---

## 4. 函式型別

::: tip 🤔 核心問題
**怎麼給函式的參數和回傳值標註型別？**
:::

### 4.1 參數型別與回傳值型別

```typescript
// 完整的函式型別註解
function add(a: number, b: number): number {
  return a + b
}

// 箭頭函式
const multiply = (a: number, b: number): number => {
  return a * b
}

// 沒有回傳值
function log(message: string): void {
  console.log(message)
}

// 回傳多種型別（聯合型別）
function parseInput(input: string): number | string {
  const num = parseFloat(input)
  return isNaN(num) ? input : num
}
```

### 4.2 可選參數與預設參數

```typescript
// 可選參數（用 ? 標記）
function greet(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

greet("張三")  // "張三"
greet("張三", "先生")  // "先生 張三"

// 預設參數
function greet2(name: string, title: string = "朋友"): string {
  return `${title} ${name}`
}

greet2("李四")  // "朋友 李四"
greet2("李四", "博士")  // "博士 李四"
```

### 4.3 函式型別作為參數

```typescript
// 接受函式作為參數
function calculate(
  a: number,
  b: number,
  operation: (x: number, y: number) => number
): number {
  return operation(a, b)
}

calculate(10, 5, (x, y) => x + y)  // 15
calculate(10, 5, (x, y) => x * y)  // 50

// 更清晰的寫法：先定義函式型別
type Operation = (x: number, y: number) => number

function calculate2(
  a: number,
  b: number,
  operation: Operation
): number {
  return operation(a, b)
}
```

::: info 💡 識別技巧
- 看到 `(a: number, b: number) => number` → 這是函式型別，描述參數和回傳值
- 看到 `: void` → 函式沒有回傳值
- 看到 `?` → 參數是可選的
:::

---

## 5. 泛型

::: tip 🤔 核心問題
**怎麼編寫能處理多種型別、但保持型別安全的程式碼？**
:::

### 5.1 泛型的基本概念

泛型讓你在定義函式、介面或類別時，不預先指定具體的型別，而是在使用時再指定：

```typescript
// 泛型函式：T 是型別變數
function identity<T>(arg: T): T {
  return arg
}

// 使用時明確指定型別
const num1 = identity<number>(42)  // 型別是 number
const str1 = identity<string>("hello")  // 型別是 string

// 型別推斷：TypeScript 能自動推斷
const num2 = identity(42)  // 推斷為 number
const str2 = identity("hello")  // 推斷為 string
```

👇 **動手試試看**：使用泛型處理不同型別的資料

<GenericDemo />

### 5.2 泛型約束

限制泛型必須滿足某些條件：

```typescript
// 約束 T 必須有 length 屬性
interface HasLength {
  length: number
}

function logLength<T extends HasLength>(arg: T): void {
  console.log(arg.length)
}

logLength("hello")  // ✅ 字串有 length
logLength([1, 2, 3])  // ✅ 陣列有 length
// logLength(42)  // ❌ 數字沒有 length 屬性
```

### 5.3 泛型介面和類別

```typescript
// 泛型介面
interface Box<T> {
  value: T
  getValue(): T
}

const numberBox: Box<number> = {
  value: 42,
  getValue: () => 42
}

const stringBox: Box<string> = {
  value: "hello",
  getValue: () => "hello"
}

// 泛型類別
class Storage<T> {
  private items: T[] = []

  add(item: T): void {
    this.items.push(item)
  }

  get(index: number): T {
    return this.items[index]
  }
}

const numberStorage = new Storage<number>()
numberStorage.add(1)
numberStorage.add(2)
// numberStorage.add("string")  // ❌ 錯誤

const stringStorage = new Storage<string>()
stringStorage.add("hello")
// stringStorage.add(1)  // ❌ 錯誤
```

::: info 💡 識別技巧
- 看到 `<T>` → 這是泛型型別變數
- 看到 `<T extends SomeType>` → 泛型約束
- 看到 `Array<T>` 或 `Promise<T>` → 內建泛型型別
:::

---

## 6. 型別推斷與實用技巧

::: tip 🤔 核心問題
**什麼時候需要明確型別註解？什麼時候可以依賴推斷？**
:::

### 6.1 型別推斷

TypeScript 能根據上下文自動推斷型別：

```typescript
// 變數初始化時的推斷
const name = "張三"  // 推斷為 string
const age = 25  // 推斷為 number
const isActive = true  // 推斷為 boolean

// 陣列推斷
const numbers = [1, 2, 3]  // 推斷為 number[]
const mixed = [1, "hello", true]  // 推斷為 (number | string | boolean)[]

// 函式回傳值推斷
function add(a: number, b: number) {
  return a + b  // 推斷回傳值為 number
}
```

👇 **動手試試看**：觀察 TypeScript 如何推斷型別

<TypeInferenceDemo />

### 6.2 何時使用明確型別註解

::: details 推薦使用型別推斷的場景
```typescript
// ✅ 推薦：簡單的字面值指派
const count = 0
const name = "張三"
const isActive = true

// ✅ 推薦：函式回傳值可以推斷
function getUserId(user: User) {
  return user.id  // 推斷為 number
}
```
:::

::: details 推薦使用明確註解的場景
```typescript
// ✅ 推薦：函式參數（必須）
function add(a: number, b: number) {
  return a + b
}

// ✅ 推薦：物件屬性型別不明確
const user: {
  id: number
  name: string
  metadata: Record<string, any>
} = {
  id: 1,
  name: "張三",
  metadata: {}  // 可能推斷為 {}，需要明確指定
}

// ✅ 推薦：函式回傳型別複雜
function getUser(): User | null {
  // ...
  return null
}

// ✅ 推薦：公共 API
export function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0)
}
```
:::

### 6.3 型別守衛

在執行階段檢查型別：

```typescript
// typeof 型別守衛
function processValue(value: string | number) {
  if (typeof value === "string") {
    // 這裡 TypeScript 知道 value 是 string
    console.log(value.toUpperCase())
  } else {
    // 這裡 TypeScript 知道 value 是 number
    console.log(value * 2)
  }
}

// instanceof 型別守衛
class Dog {
  bark() {
    console.log("汪汪")
  }
}

class Cat {
  meow() {
    console.log("喵喵")
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()  // TypeScript 知道這是 Dog
  } else {
    animal.meow()  // TypeScript 知道這是 Cat
  }
}

// 自訂型別守衛
interface User {
  name: string
  email: string
}

function isUser(value: any): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.name === "string" &&
    typeof value.email === "string"
  )
}

function processValue(value: unknown) {
  if (isUser(value)) {
    // 這裡 value 是 User
    console.log(value.name)
  }
}
```

### 6.4 實用工具型別

TypeScript 提供了一些內建的工具型別：

```typescript
// Partial：將所有屬性變為可選
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User>
// 等同於：{ id?: number; name?: string; email?: string }

// Required：將所有屬性變為必需
type RequiredUser = Required<PartialUser>
// 等同於：{ id: number; name: number; email: string }

// Pick：只保留指定的屬性
type UserBasicInfo = Pick<User, "id" | "name">
// 等同於：{ id: number; name: string }

// Omit：排除指定的屬性
type UserWithoutEmail = Omit<User, "email">
// 等同於：{ id: number; name: string }

// Record：建立物件型別
type UserRoles = Record<string, boolean>
// 等同於：{ [key: string]: boolean }
```

---

## 7. 實戰技巧：在 vibecoding 中使用 TypeScript

::: tip 🤔 核心問題
**怎麼在 AI 輔助開發中更好地利用 TypeScript？**
:::

### 7.1 讓 AI 生成型別安全程式碼

**❌ 不好的提示詞：**
```
幫我寫一個使用者管理功能
```

**✅ 好的提示詞：**
```
幫我寫一個使用者管理功能，使用 TypeScript。

資料結構定義如下：
interface User {
  id: number
  name: string
  email: string
  age: number
}

需要實作：
1. 取得使用者清單：回傳 User[]
2. 建立使用者：接受 Partial<User>，回傳 User
3. 更新使用者：接受 id 和 Partial<User>，回傳 User
4. 刪除使用者：接受 id，回傳 void

請確保所有函式都有完整的型別註解。
```

### 7.2 看懂 TypeScript 錯誤資訊

**常見錯誤及含義：**

| 錯誤資訊 | 含義 | 解決方法 |
|---------|------|---------|
| `Type 'X' is not assignable to type 'Y'` | 型別 X 不能指派給型別 Y | 檢查型別是否匹配，或進行型別轉換 |
| `Property 'X' does not exist on type 'Y'` | 型別 Y 上不存在屬性 X | 檢查屬性名稱拼字，或定義該屬性 |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | 參數型別不匹配 | 檢查函式呼叫時的參數型別 |
| `Type 'X' is missing the following properties from type 'Y'` | 型別 X 缺少型別 Y 的某些屬性 | 補全缺失的屬性 |

### 7.3 漸進式採用 TypeScript

如果你有一個 JavaScript 專案，可以漸進地遷移到 TypeScript：

1. **第一步：將檔案重新命名為 `.ts`**
   ```bash
   # 從 utils.js 改為 utils.ts
   mv utils.js utils.ts
   ```

2. **第二步：修復明顯的型別錯誤**
   ```typescript
   // 如果報錯：Parameter 'a' implicitly has an 'any' type
   // 新增型別註解
   function add(a: number, b: number) {
     return a + b
   }
   ```

3. **第三步：逐步新增型別定義**
   ```typescript
   // 先用 any 快速修復
   function processUser(user: any) {
     // ...
   }

   // 後續再完善型別
   interface User {
     id: number
     name: string
   }

   function processUser(user: User) {
     // ...
   }
   ```

4. **第四步：啟用更嚴格的型別檢查**
   ```json
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,  // 啟用嚴格模式
       "noImplicitAny": true,  // 禁止隱式 any
       "strictNullChecks": true  // 嚴格空值檢查
     }
   }
   ```

---

## 8. 你現在應該能識別的程式碼

- 看到 `: string` → 這是 string 型別的註解
- 看到 `: number[]` → 這是數字陣列的註解
- 看到 `interface User` → 這是定義物件型別
- 看到 `type User =` → 這是型別別名
- 看到 `<T>` → 這是泛型
- 看到 `extends` → 介面繼承或泛型約束
- 看到 `?` → 可選屬性
- 看到 `readonly` → 唯讀屬性
- 看到 `|` → 聯合型別
- 看到 `&` → 交叉型別

**如果你認真讀了每章的「深入」部分，你還掌握了這些核心概念：**

- **型別註解**：明確告訴 TypeScript 變數的型別
- **介面**：定義物件的結構和型別
- **泛型**：編寫可重複使用的型別安全程式碼
- **型別推斷**：TypeScript 自動推斷型別
- **型別守衛**：執行階段檢查型別
- **工具型別**：Partial、Required、Pick、Omit 等

::: info 💡 遇到問題時這樣跟 AI 說
- "這個函式的型別註解應該怎麼寫？參數是 X，回傳值是 Y"
- "幫我定義一個介面，描述這個資料結構：..."
- "這個 TypeScript 錯誤是什麼意思？怎麼修復？"
- "如何給這個泛型函式新增約束，確保 T 必須有某個屬性？"
:::
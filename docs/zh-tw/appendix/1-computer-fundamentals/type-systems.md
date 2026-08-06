# 型別系統導論

::: tip 前言
**你剛寫完一段程式，按下執行。螢幕閃出紅色錯誤：`TypeError: Cannot read properties of undefined`。你皺眉頭嘟囔：「怎麼又來？」**

其實這個錯誤背後是「型別系統」在幫你把關。為什麼有的語言報錯在執行前，有的在執行後？為什麼有的語言 `1 + "1"` 等於 `"11"`，有的直接噴錯？這一切都和型別系統有關。

本章我們從最基礎的「什麼是型別」開始，用生活比喻解釋靜態/動態、強/弱型別，再動手實作一個迷你型別檢查器，最後比較 TypeScript、Rust、Python 的型別哲學。
:::

<TypeSystemIntroDemo />

**這篇文章會帶你學什麼？**

學完這章後，你將獲得：

- **四象限思維**：快速判斷任何語言的型別設計
- **底層理解**：知道為什麼 `1 + "1"` 在不同語言結果不同
- **實戰能力**：看懂並設計基本的型別註解
- **選型判斷**：根據場景選擇適合的型別嚴格度
- **動手經驗**：實作一個迷你型別檢查器，理解編譯器如何做型別推斷

| 章节 | 內容 | 核心概念 |
|-----|------|---------|
| **第 1 章** | 四象限 | 靜態/動態 × 強/弱型別 |
| **第 2 章** | 靜態 vs 動態 | 檢查時機與型別註解 |
| **第 3 章** | 強型別 vs 弱型別 | 隱式轉換與型別安全 |
| **第 4 章** | 型別推斷與推導 | 讓編譯器幫你寫型別 |
| **第 5 章** | 聯型與泛型 | 型別系統的進階武器 |
| **第 6 章** | 總結 | 選擇合適的型別系統 |

---

## 0. 全景圖：型別系統概述

<TypeSystemMapDemo />

---

## 1. 型別系統的作用

程式是對**資料**進行**操作**的過程。但不同類型的資料，能做的操作是不一樣的：

| 生活例子 | 類比程式 | 為什麼不能亂做？ |
|---------|---------|--------------|
| 你可以把兩個數字加起來：`2 + 3 = 5` | 數字型別加法 `number + number` | 這是數學加法 |
| 你可以把兩個字串拼起來：`"hello" + " world"` | 字串連接 `string + string` | 這是字串串接 |
| 但你不能把「地址」除以「電話號碼」 | 複合型別不支援除法 | 語義上毫無意義 |
| 也不能對「人名」做開根號 | 字串不支援數學運算 | 會得到無意義的結果 |

型別系統就是計算機的資料分類和操作規則系統。它定義了：

1. **有哪些型別**：整數、浮點數、字串、布林、陣列、物件……
2. **每種型別能做什麼操作**：數字可以加減乘除，字串可以拼接取長度……
3. **不同型別之間如何互動**：能不能相加？能不能賦值？需不需要轉換？

::: tip 生活比喻：圖書館分類
型別系統就像圖書館的分類系統：
- **分類標籤（型別）**：文學書、科技書、歷史書、繪本……
- **放置區域（記憶體配置）**：不同類型的書放在不同書架區
- **借閱規則（操作規則）**：參考書只能館內閱讀，普通書可以外借
- **館際互換（型別轉換）**：有些書可以跨館調閱（隱式轉換），有些必須手動申請（顯式轉換）

沒有分類的圖書館，找一本書要翻遍所有書架；沒有型別的程式，出了問題要逐行排查。型別系統就是為了讓**混亂變得有序**。
:::

---

## 2. 靜態型別與動態型別

型別檢查發生在**什麼時候**？這是靜態和動態的核心差異。

<StaticVsDynamicDemo />

| 維度 | 靜態型別（Static Typing） | 動態型別（Dynamic Typing） |
|------|--------------------------|--------------------------|
| **檢查時機** | 編譯時（Compile-time） | 執行時（Runtime） |
| **發現錯誤** | 程式執行**之前** | 程式執行**之後** |
| **型別宣告** | 通常需要（現代語言有推斷） | 不需要 |
| **代表語言** | Java、C++、Rust、TypeScript | Python、JavaScript、Ruby、PHP |
| **生活比喻** | 機場安檢：進去之前就檢查，不給帶違禁品 | 百貨公司隨逛：進去之後才可能被攔 |

### 靜態型別：把關在執行前

TypeScript 範例（注意這裡有個錯誤，把 `num2` 寫成了字串 `"2"`）：

```typescript
function addNumbers(a: number, b: number): number {
    return a + b;
}

// ✅ 正確
addNumbers(1, 2);      // 3

// ❌ 錯誤！編譯器直接報錯，程式根本跑不起來
// Argument of type 'string' is not assignable to parameter of type 'number'
addNumbers(1, "2");
```

**靜態型別的威力**：在你按下「執行」之前，型別檢查器就像一個嚴格的保安，攔下了所有不符合型別規定的程式碼。好的靜態型別系統甚至能幫你避免邏輯錯誤（Rust 的所有權系統甚至能避免記憶體泄漏和資料競爭）。

### 動態型別：出錯才攔截

JavaScript 範例（同樣的錯誤）：

```javascript
function addNumbers(a, b) {
    return a + b;
}

// ✅ 看起來正常
addNumbers(1, 2);      // 3

// ❌ 「正常執行」但結果不對！
addNumbers(1, "2");    // "12" —— 字串串接，不是加法
```

動態型別的靈活性代價是：**錯誤只有在執行到那段程式碼時才會浮出來**。如果你的測試沒覆蓋到那個分支，Bug 就會跑到生產環境。

### 那種比較好

| 場景 | 推薦型別 | 理由 |
|-----|---------|------|
| 快速原型、小工具、個人專案 | 動態型別（Python/JS） | 寫得快，心智負擔低 |
| 團隊協作、程式碼量大、長期維護 | 靜態型別（TS/Rust/Java） | 重構安全，錯誤提早發現 |
| 程式碼可能被別人維護 | 靜態型別 | 型別就是最好的文件 |
| 效能要求極高 | 靜態型別（C++/Rust） | 編譯器可以做更多最佳化 |

---

## 3. 強型別與弱型別

另一個維度是：**型別轉換有多「自動」？**

| 維度 | 強型別（Strong Typing） | 弱型別（Weak Typing） |
|------|------------------------|----------------------|
| **隱式轉換** | 幾乎不做自動轉換 | 積極做自動轉換 |
| **型別安全** | 高：不隨便混合不相容型別 | 低：為了「能跑」不惜結果奇怪 |
| **代表語言** | Python、Rust、Haskell | JavaScript、PHP、C |
| **生活比喻** | 嚴格的分類商店：蔬菜區和五金區不混賣 | 夜市攤販：什麼都可以搭在一起賣 |

### JavaScript 的隱式轉換（弱型別經典）

```javascript
// 這些結果合理嗎？
console.log(1 + "2");        // "12"     → 數字被轉成字串
console.log("5" - 1);        // 4        → 字串被轉成數字
console.log(true + false);   // 1        → 布林被轉成數字
console.log([] + {});        // "[object Object]" → 瘋狂轉換
console.log(NaN === NaN);    // false    → NaN 不等於自己
```

為什麼 JavaScript 這麼「自由」？因為 Brendan Eich 只用了 10 天設計這門語言，設計理念是「盡量讓程式碼跑起來，不要隨便報錯」。這個理念在 1995 年（當時 JS 只用來做表單驗證）或許合理，但在今天（Node.js 跑後端、單頁應用幾十萬行程式碼）就成了災難。**這也是為什麼 TypeScript 會誕生：給弱型別的 JS 加上強型別的保護。**

### Python 的強型別保護

```python
# Python 說：不行就是不行，不要自己亂猜
print(1 + "2")
# TypeError: unsupported operand type(s) for +: 'int' and 'str'

# 你必須手動做型別轉換（顯式轉換）
print(str(1) + "2")  # "12" —— 字串串接
print(1 + int("2"))  # 3    —— 數字加法
```

強型別的好處是：**不會在你沒察覺的時候偷偷做轉換，導致結果和你預期的不一樣。** 與其得到一個錯得很離譜的結果，不如直接報錯，讓你趕快修正。

### C 的「中間地帶」

```c
#include <stdio.h>
int main() {
    int x = 65;           // ASCII 碼 65 = 'A'
    char c = x;           // int → char 隱式轉換（寬容）
    printf("%c\n", c);    // 印出 A

    double d = 3.14;
    int y = d;            // double → int 隱式轉換（小數被截斷！）
    printf("%d\n", y);    // 印出 3，不是 3.14

    return 0;
}
```

C 在基本型別之間做了許多隱式轉換，是公認的「弱型別」。好處是寫起來方便，壞處是如果你不知道這些轉換規則，很容易踩到精確度丟失或溢位的坑。

---

## 4. 型別推斷與型別註解

很多初學者以為「靜態型別 = 每一行都要寫型別」，其實現代靜態型別語言幾乎都有**型別推斷（Type Inference）**，編譯器會根據右側的值自動推斷左側變數的型別：

<TypeInferenceDemo />

```typescript
// 你不需要寫 const message: string = "Hello"
// TypeScript 會自動推斷 message 是 string
const message = "Hello, TypeScript!";

// 但函式參數和返回值通常建議寫上型別註解
// 讓編譯器和讀你的程式碼的人都知道你的意圖
function greet(name: string): string {
    return `Hello, ${name}!`;
}

// Rust 推斷能力更強，大部分時候不用寫型別
fn main() {
    let number = 42;            // 推斷為 i32（整數）
    let pi = 3.14;              // 推斷為 f64（浮點數）
    let name = "Rust";          // 推斷為 &str（字串切片）
}
```

::: tip 原則：什麼時候寫型別註解？
1. **函式的參數和返回值一定要寫** — 這是介面契約
2. **複雜資料結構建議寫** — 物件、陣列的巢狀結構寫清楚比較好維護
3. **簡單的區域變數可以不寫** — 讓編譯器推斷，保持程式碼簡潔
:::

---

## 5. 聯型與泛型

學完基礎型別後，我們來看兩個進階但超好用的武器：**聯型（Union Types）** 讓一個變數可以是多種型別之一，**泛型（Generics）** 讓型別可以「參數化」。

### 聯型：「可能是 A 也可能是 B」

```typescript
// 一個使用者的狀態：可能是未登入（null）或已登入（物件）
type User = {
    id: number;
    name: string;
} | null;

// 請求結果：成功時帶資料，失敗時帶錯誤
type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };
```

### 泛型：「型別參數，型別化的函式」

```typescript
// 沒有泛型的話，你得寫無數個版本……
function identityString(x: string): string { return x; }
function identityNumber(x: number): number { return x; }

// 有了泛型，一個函式搞定所有型別
function identity<T>(x: T): T { return x; }

identity<string>("hello");   // T = string
identity<number>(42);        // T = number
identity({ name: "Alice" }); // 推斷 T = { name: string }
```

### 應用：泛型佇列

```rust
// Rust 的泛型實作：Queue 可裝任何型別的元素
struct Queue<T> {
    items: Vec<T>,
}

impl<T> Queue<T> {
    fn new() -> Self { Queue { items: Vec::new() } }
    fn enqueue(&mut self, item: T) { self.items.push(item); }
    fn dequeue(&mut self) -> Option<T> {
        if self.items.is_empty() { None } else { Some(self.items.remove(0)) }
    }
}
```

---

## 6. 總結：選擇合適的型別系統

把本章的四個維度整合起來，你就能判斷任何一門語言的型別風格：

<TypeSystemComparisonDemo />

| 語言 | 靜態/動態 | 強/弱型別 | 適合什麼 |
|-----|----------|---------|---------|
| **Rust** | 靜態 | 超強 | 系統軟體、效能敏感場景、追求零成本抽象 |
| **TypeScript** | 靜態 | 強（底層 JS 弱） | 前端、Node.js、需要漸進式加強型別 |
| **Java** | 靜態 | 強（但有很多轉換） | 企業級後端、Android、大型團隊 |
| **Go** | 靜態 | 強 | 雲原生基礎設施、微服務、Docker/K8s 生態 |
| **Python** | 動態 | 強 | AI / 資料科學 / 腳本 / 快速原型 |
| **JavaScript** | 動態 | 弱 | 簡單互動、腳本（但建議寫 TypeScript） |
| **PHP** | 動態 | 弱 | 早期 Web（現代 PHP 已加強型別） |

### 選型指南

**沒有最好的型別系統，只有最適合場景的選擇。** 但有三個經驗法則：

1. **個人專案 + 快速迭代**：選動態強型別（Python），爽就完事了
2. **團隊 + 長期維護 + 程式碼量大**：選靜態強型別（TS/Rust/Java），節省的除錯時間遠大於你寫型別的時間
3. **效能優先 + 底層控制**：選 Rust/C++，型別系統幫你守住底線並釋放最大效能

---

## 延伸閱讀

- [《型別程式設計入門》](https://leanpub.com/type-programming) — 用 TypeScript 講解型別系統的方方面面
- [The Rust Performance Book](https://nnethercote.github.io/perf-book/) — Rust 中的型別如何影響最佳化
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) — 官方文件講解高級型別技巧
- [Haskell 趣學指南](https://learnyouahaskell.com/) — 透過 Haskell 感受強大的 Hindley-Milner 型別推斷

---

**下一步學習**：回到[全棧開發導論](./vibe-coding-fullstack)，你會發現：理解了型別系統，再去看任何一門語言的文件，你都能快速掌握它的設計哲學，而不是死記語法。

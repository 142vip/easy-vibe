# 狀態管理原理
::: tip 🎯 核心問題
**當應用越來越大，組件之間該如何優雅地共享和同步資料？** 你可能會遇到這樣的困境：使用者在商品頁加入了購物車，但頭部的購物車數量沒更新；兩個不相關的組件需要同一份資料，卻不知道該怎麼傳遞。本章將帶你從「混亂的資料傳遞」進化到「清晰的狀態管理」。
:::

---

## 1. 要「組件化與狀態管理」的動機

### 1.1 從小作坊到工廠：前端開發的演變

在正式開始之前，先問你一個問題：**你有沒有試過在廚房裡做一頓大餐？**

如果你只是給自己煮一碗麵，那很簡單——一個鍋、一把麵、一點調料，十秒鐘搞定。但如果你要開一家餐廳，每天服務幾百個顧客，就不能再「想做什麼做什麼」了。你需要標準化的菜譜、明確的分工、統一的採購流程，這樣才能保證每道菜的品質穩定、出餐效率高。

前端開發也一樣。一個人寫小專案，程式碼隨便放哪裡都行。但當團隊變大、專案變複雜後，就需要一套系統的方法來組織程式碼和管理資料。這就是**組件化與狀態管理**要解決的問題。

::: tip 🤔 什麼是「組件」和「狀態」？
在繼續之前，先解釋兩個核心術語：

**組件（Component）**：就像樂高積木，每個積木是一個獨立的部份，有自己的形狀、顏色、功能。你可以把多個積木拼在一起，搭建出複雜的城堡。在前端開發中，一個按鈕、一個表單、一個導航欄，都可以是一個組件。

**狀態（State）**：就是組件的「記憶」。比如一個按鈕，它「記住」了自己是「禁用」還是「啟用」狀態；一個購物車組件，它「記住」了裡面有哪些商品。狀態會變化，而狀態變化會觸發介面更新。

**組件化 + 狀態管理 = 有組織的程式碼 + 清晰的資料流**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 小作坊模式**
- 程式碼寫在一個檔案裡，像在一口鍋裡煮所有菜
- 資料到處傳遞，像服務員端著盤子在餐廳亂跑
- 改一處可能影響其他地方，像鹽放多了整道菜都毀了

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 工廠模式**
- 程式碼拆分成組件，像餐廳分成前廳、後廚、採購部
- 資料集中管理，像有統一的倉庫和配送系統
- 改動影響範圍清晰，像換個菜不會影響整個餐廳

</div>
</div>

### 1.2 案例：狀態管理的必要性

你可能會說：「我用的不是 Vue/React 嗎？它們不是已經有狀態管理了嗎？」讓我講一個真實的故事，你就會明白為什麼系統性地理解組件化和狀態管理如此重要。

::: warning 小美的踩坑記
小美是某電商公司的產品經理轉前端開發，剛接手公司的購物車功能重構。她之前用的是 jQuery 時代的老專案，現在要用 Vue 3 改造。

小美想：「購物車邏輯很簡單，存個陣列就行了。」於是她開始寫程式碼：
- 在商品詳情頁組件裡，用一個陣列 `cart` 儲存購物車資料
- 在購物車頁面組件裡，又定義了一個 `cartItems` 陣列
- 在頭部導航欄組件裡，還有一個 `cartCount` 變數

問題很快出現了：
1. **資料不同步**：使用者在商品詳情頁加入了商品，但購物車頁面的資料沒更新
2. **重複程式碼**：小美不得不寫了好幾個「加入購物車」的函式，分別放在不同的組件裡
3. **維護困難**：營運說要加一個「清空購物車」功能，小美發現要改三個地方

後來她請教前端架構師阿強，阿強看了一眼程式碼就說：「你犯了狀態管理的大忌——同一份資料在多個地方儲存。」

解決方案很簡單：用 Pinia 建立一個全域的購物車狀態管理，所有組件都從同一個地方讀寫資料。這樣改動之後，所有問題迎刃而解。

小美從此明白了一個道理：**不理解組件化和狀態管理，你會寫出難以維護的「義大利麵條程式碼」。**
:::

::: info 💡 核心啟示
組件化和狀態管理不是框架的「附加功能」，而是現代前端開發的基石。理解它們，你才能設計出清晰的架構、寫出可維護的程式碼、在團隊協作中游刃有餘。
:::

---

## 2. 核心概念：理解組件化的本質

::: tip 🤔 什麼是「組件化思維」？
組件化思維，就是一種把複雜介面拆分成獨立、可複用、職責單一的程式碼單元的方法。

打個比方：想像你在組裝一台電腦。你會把 CPU、記憶體、硬碟、顯示卡這些部件分別買回來，然後組裝在一起。每個部件都有明確的功能，你可以隨時替換某個部件，而不影響其他部份。

組件化就是讓前端程式碼也能這樣「模組化」——每個組件負責自己的事情，透過明確的介面和其他組件協作。
:::

### 2.1 用餐廳比喻理解組件化

讓我們用餐廳的比喻來理解組件化的核心思想：

| 概念 | 🍽️ 餐廳比喻 | 實際作用 | 具體例子 |
|------|-------------|----------|----------|
| **組件** | 餐廳的各個部門（前廳、後廚、採購部） | 每個部門負責自己的事情 | 按鈕組件負責點擊，表單組件負責輸入 |
| **Props（屬性）** | 顧客給服務員點的菜單 | 父組件給子組件傳遞資料 | 父組件把「使用者名稱」傳給頭像組件 |
| **Events（事件）** | 服務員通知後廚「有新訂單」 | 子組件通知父組件發生了什麼 | 按鈕組件告訴父組件「我被點擊了」 |
| **State（狀態）** | 後廚的「目前訂單列表」 | 組件內部儲存的資料 | 購物車組件記住裡面有哪些商品 |

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**組件**：就像餐廳有不同的部門，前端頁面也由不同的組件組成。每個組件是一個獨立的部份，有自己的職責。

**Props**：這是父組件給子組件「傳遞資料」的方式。就像顧客點菜時告訴服務員要吃什麼，父組件也可以透過 props 把資料（比如使用者名稱、商品資訊）傳給子組件。注意：props 是「單向」的，只能從父傳給子，不能反向傳遞。

**Events**：當子組件需要通知父組件時（比如按鈕被點擊、表單提交），就會觸發事件。就像服務員接到訂單後通知後廚「開始做菜」。這樣保持了資料流的單向性——子組件不能直接修改父組件的資料，只能「發訊息」。

**State**：這是組件內部的「記憶」。就像後廚要記住目前有哪些訂單，組件也需要記住自己的狀態（比如購物車有哪些商品、按鈕是否被禁用）。狀態變化時，組件會自動更新介面。
:::

<ComponentHierarchyDemo />

### 2.2 Props 和 Events：父子組件的「官方通道」

在前端框架（Vue、React）中，**Props 和 Events 是父子組件通訊的標準方式**。

**Vue 範例：**

```vue
<!-- Parent.vue - 父組件 -->
<template>
  <div>
    <!-- 像給服務員遞菜單一樣，透過 props 傳遞資料 -->
    <Child
      :user-name="currentUser.name"
      :is-admin="currentUser.isAdmin"
      @delete-user="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Child from './Child.vue'

const currentUser = ref({
  name: '張三',
  isAdmin: true
})

const handleDelete = (userId) => {
  console.log('刪除使用者:', userId)
  // 處理刪除邏輯
}
</script>
```

```vue
<!-- Child.vue - 子組件 -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">管理員</span>
    <button @click="requestDelete">刪除使用者</button>
  </div>
</template>

<script setup>
// 接收父組件傳來的資料
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// 定義可以觸發的事件
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // 透過事件通知父組件
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 核心原則
**Props 向下，Events 向上**——這是組件通訊的黃金法則。

- 父組件透過 **props** 把資料傳給子組件（像給下屬分配任務）
- 子組件透過 **events** 通知父組件發生了什麼（像下屬匯報工作）

這樣保持了資料流的清晰和單向性，避免了「誰都可以改資料」的混亂局面。
:::

<PropsFlowDemo />

### 2.3 單向資料流：不能直接修改 props 的動機

很多初學者會犯一個錯誤：在子組件裡直接修改 props 的值。

```vue
<!-- ❌ 錯誤做法 -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// 直接修改 props - 這是被禁止的！
props.count = 10  // 會報錯
</script>
```

**為什麼不能直接修改 props？**

想像一下：你從圖書館借了一本書（props），然後在書上亂塗亂畫（修改 props）。其他借這本書的人（其他組件）也會看到你的塗鴉，這會導致混亂。正確的做法是：如果你需要修改資料，應該讓父組件來改，子組件只是「請求修改」。

```vue
<!-- ✅ 正確做法 -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// 透過事件請求父組件修改
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. 從「混沌」到「有序」：組件通訊的演進之路

::: tip 🤔 為什麼需要演進？
隨著專案變大，組件之間的通訊會變得越來越複雜。讓我們看看一個真實團隊是如何一步步進化出清晰的狀態管理方案的。

這不僅僅是「工具升級」，而是**整個思維方式的變化**——從「隨意傳遞資料」到「設計清晰的資料流」。
:::

### 3.1 演進的全景圖

下面這張表展示了組件通訊方式演進的四個階段，你可以看到問題是如何一步步被解決的：

| 階段 | 通訊方式 | 典型問題 | 核心變化 |
|------|---------|----------|----------|
| **階段一：自由傳遞** | 直接修改、全域變數 | 資料不同步、難以除錯 | 沒有規範，怎麼傳都行 |
| **階段二：Props/Events** | 父子組件標準通訊 | Props Drilling（層層傳遞） | 有了規範，但深層巢狀很麻煩 |
| **階段三：狀態管理庫** | Vuex/Redux/Pinia | 學習成本、樣板程式碼 | 資料集中管理，除錯方便 |
| **階段四：現代化方案** | 組合式函式/原子化 | 需要理解新概念 | 更靈活、更簡潔 |

<EventBusDemo />

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**階段一 → 階段二**：從「沒有規範」到「有規範」。這是質的飛躍——你開始用標準的 props/events 通訊，資料流變得清晰。但代價是當組件層級很深時，資料要一層層傳遞，很麻煩（這就是 Props Drilling）。

**階段二 → 階段三**：從「分散管理」到「集中管理」。你開始用 Vuex/Redux 這樣的狀態管理庫，把共享資料放在一個全域的「倉庫」裡，所有組件都從這裡讀寫資料。這樣解決了 Props Drilling，但學習成本變高了。

**階段三 → 階段四**：從「重量級」到「輕量級」。新的方案（如 Vue 3 的 Composition API、React 的 Hooks）讓狀態管理更靈活、更簡潔。你不再一定要用全域的 store，可以按需組合小的狀態單元。

**總結一下**：演進不只是「換了更好的工具」，而是**整個思維方式的升級**——從隨意傳遞資料，到設計清晰的資料流。
:::

### 3.2 階段一：自由傳遞——混亂的開始

為什麼叫「自由傳遞」？因為這個階段沒有任何規範，資料想怎麼傳就怎麼傳——全域變數、直接修改、事件匯流排滿天飛。

**典型場景：購物車資料分散在各處**

```javascript
// 商品詳情頁組件
export default {
  data() {
    return {
      localCart: []  // 自己維護一份購物車資料
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // 試圖同步到其他組件
      window.cart = this.localCart  // ❌ 全域變數！
    }
  }
}

// 購物車頁面組件
export default {
  data() {
    return {
      cartItems: []  // 又一份購物車資料
    }
  },
  mounted() {
    // 試圖從全域變數讀取
    this.cartItems = window.cart || []  // ❌ 不可靠！
  }
}

// 頭部導航組件
export default {
  data() {
    return {
      cartCount: 0  // 還有第三份資料！
    }
  },
  mounted() {
    // 輪詢檢查變化（多麼荒謬）
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ 效能差！
  }
}
```

**這個階段的特點：**
- ✅ **優點**：簡單直接，沒有任何學習成本
- ❌ **缺點**：資料分散、難以同步、除錯困難、一團亂麻

### 3.3 階段二：Props/Events——規範的建立

自由傳遞的混亂讓團隊意識到：**我們需要規範**。於是開始使用框架提供的標準通訊方式：props 和 events。

**典型場景：Props Drilling（屬性鑽取）**

```vue
<!-- 祖先組件：App.vue -->
<template>
  <div class="app">
    <!-- 層層傳遞使用者資訊 -->
    <Layout :user-name="userName" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './Layout.vue'

const userName = ref('張三')
</script>
```

```vue
<!-- 中間層：Layout.vue -->
<template>
  <div class="layout">
    <Header :user-name="userName" />  <!-- 只是傳遞，不使用 -->
    <Main>
      <Page :user-name="userName" />  <!-- 只是傳遞，不使用 -->
    </Main>
  </div>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

```vue
<!-- 真正需要的地方：Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- 終於用到了 -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**這個階段的特點：**
- ✅ **優點**：資料流清晰、單向流動、易於理解
- ❌ **缺點**：Props Drilling（層層傳遞很麻煩）、跨組件通訊困難

::: tip 🤔 什麼是 Props Drilling？
Props Drilling 指的是：**資料要透過很多中間組件，一層層往下傳，但這些中間組件並不真正使用這些資料**。

就像你要給住在五樓的人送快遞，但規定必須每一層樓都要簽收一次。一二三四樓的人只是幫你「傳快遞」，他們並不需要這個快遞，但必須參與進來。這顯然很麻煩。
:::

### 3.4 階段三：狀態管理庫——集中式管理

Props Drilling 的痛點催生了狀態管理庫（Vuex、Redux、Pinia）。它們的核心思想是：**把共享資料放在一個全域的「倉庫」裡，所有組件都從這裡讀寫資料**。

**典型場景：用 Pinia 管理購物車**

```javascript
// stores/cart.js - 全域購物車狀態
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // 所有購物車資料集中在這裡
  const items = ref([])

  // 計算屬性：商品數量
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // 方法：加入商品
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
})
```

```vue
<!-- 商品詳情頁組件 -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // 直接呼叫，無需層層傳遞
}
</script>
```

```vue
<!-- 頭部導航組件 -->
<template>
  <header>
    <span>購物車 ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // 直接讀取，自動同步
</script>
```

**這個階段的特點：**
- ✅ **優點**：資料集中管理、解決 Props Drilling、除錯工具強大
- ❌ **缺點**：學習成本、需要寫額外程式碼（樣板程式碼）、對簡單專案可能過度設計

### 3.5 階段四：現代化方案——靈活與簡潔

狀態管理庫雖然強大，但也有「大炮打蚊子」的問題。對於中小型專案，更靈活、更輕量的方案出現了。

**典型場景：用 Composable/Hooks 複用狀態邏輯**

```javascript
// composables/useCart.js - 可複用的購物車邏輯
import { ref, computed } from 'vue'

export function useCart() {
  const items = ref([])

  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  return {
    items,
    itemCount,
    addItem
  }
}
```

```vue
<!-- 在任何組件中使用 -->
<script setup>
import { useCart } from '@/composables/useCart'

// 每次呼叫都會建立一個新的狀態實例
// 適合組件內部的區域性狀態
const { items, itemCount, addItem } = useCart()
</script>
```

**這個階段的特點：**
- ✅ **優點**：靈活、輕量、可組合、按需使用
- ❌ **缺點**：需要理解組合式思維、跨組件共享需要額外處理

---

## 4. 狀態管理庫詳解：Vuex vs Pinia vs Redux

::: tip 🤔 如何選擇狀態管理庫？
面對不同的狀態管理庫，你可能會困惑：到底該選哪一個？

其實沒有「最好」的庫，只有「最適合」的。選擇時考慮這些因素：
- **你用什麼框架？** Vue 用 Pinia，React 用 Redux/Zustand
- **專案多大？** 小專案用 Composable，大專案用狀態管理庫
- **團隊經驗？** 選團隊熟悉的，或學習成本低的

接下來的內容會詳細介紹主流狀態管理庫的特點和使用場景。
:::

### 4.1 主流狀態管理庫對比

| 特性 | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **適用框架** | React | Vue | Vue | React |
| **學習曲線** | 陡峭 | 中等 | 平緩 | 平緩 |
| **樣板程式碼** | 多 | 中等 | 少 | 極少 |
| **TypeScript** | 良好 | 良好 | 優秀 | 優秀 |
| **除錯工具** | 強大 | 良好 | 優秀 | 良好 |
| **適用場景** | 大型專案 | Vue 2/3 中大型專案 | Vue 3 新專案 | React 中小型專案 |

::: tip 📊 從表格中你能看到什麼？
讓我們逐行解讀這張表：

**Redux**：React 生態的老牌狀態管理庫。優點是規範嚴格、除錯工具強大，但缺點是樣板程式碼多、學習曲線陡峭。適合大型專案和需要嚴格規範的團隊。

**Vuex**：Vue 2 時代的官方狀態管理庫。設計理念類似 Redux，但更貼合 Vue 的響應式系統。現在仍然可以用，但新專案推薦用 Pinia。

**Pinia**：Vue 3 官方推薦的新一代狀態管理庫。語法簡潔、TypeScript 支援好、學習成本低。**這是 Vue 3 專案的首選**。

**Zustand**：React 生態的輕量級狀態管理庫。API 極簡、幾乎無樣板程式碼。適合中小型 React 專案。
:::

<StateManagementComparisonDemo />

### 4.2 Pinia 實戰：Vue 3 的推薦選擇

Pinia 是 Vue 團隊官方推薦的狀態管理庫，專為 Vue 3 設計。它比 Vuex 更簡潔、更易用。

**為什麼叫 Pinia？**

Pinia 是西班牙語「鳳梨」的意思。鳳梨是一種由很多小花組成的水果，每個小花都很獨立，但整體上又是一個統一的整體。這正好比喻了 Pinia 的設計理念——**每個 store 是獨立的，但可以組合使用**。

**核心概念：**

::: details 查看完整程式碼範例
```javascript
// stores/user.js - 使用者狀態管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State：儲存資料
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions：修改資料的方法
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // 直接修改，Pinia 會處理響應式
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters：計算屬性
  const displayName = computed(() => {
    return userInfo.value?.name || '遊客'
  })

  return {
    userInfo,
    isLoggedIn,
    login,
    logout,
    displayName
  }
})
```
:::

**在組件中使用：**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">歡迎，{{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">登出</button>
    <button v-else @click="showLoginDialog">登入</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// 直接取得 store，所有內容都是響應式的
const user = useUserStore()

const showLoginDialog = () => {
  // 顯示登入對話框...
}
</script>
```

**Pinia 的優勢：**

| 優勢 | 說明 | 對比 Vuex |
|------|------|----------|
| **簡潔的 API** | 不需要 mutations，直接修改 state | Vuex 需要 mutations 和 actions 分開 |
| **TypeScript 友好** | 原生型別推導，不需要額外配置 | Vuex 需要複雜的型別定義 |
| **自動模組化** | 每個 store 檔案自動成為模組 | Vuex 需要手動配置 namespaced |
| **更小的體積** | 打包後約 1KB | Vuex 約 3KB |

<VuexPiniaDemo />

### 4.3 Redux 實戰：React 的經典選擇

Redux 是 React 生態中最經典的狀態管理庫，以嚴格的單向資料流著稱。

**為什麼叫 Redux？**

Redux 是 "Reduced Flux" 的縮寫。Flux 是 Facebook 早期提出的應用架構模式，Redux 簡化了 Flux 的概念，所以叫 "Reduced Flux"。

**核心原則：**

1. **單一資料來源**：整個應用的 state 儲存在一個物件樹中
2. **State 唯讀**：唯一改變 state 的方法是觸發 action
3. **使用純函式修改**：Reducer 必須是純函式

::: details 查看完整程式碼範例
```javascript
// 1. 定義 Action Types
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. 定義 Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. 定義 Reducer（純函式）
const initialState = {
  todos: []
}

const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload]
      }
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      }
    default:
      return state
  }
}

// 4. 建立 Store
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**在 React 中使用：**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // 讀取 state
  const todos = useSelector(state => state.todos)

  // 取得 dispatch 函式
  const dispatch = useDispatch()

  return (
    <ul>
      {todos.map(todo => (
        <li
          key={todo.id}
          onClick={() => dispatch(toggleTodo(todo.id))}
          style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}
```

**Redux 的優缺點：**

| 優點 | 缺點 |
| :--- | :--- |
| 嚴格的資料流，易於除錯 | 樣板程式碼多，學習曲線陡峭 |
| 時間旅行除錯（Time Travel） | 簡單的狀態也需要寫很多程式碼 |
| 豐富的中介軟體生態 | 不適合小型專案 |
| 可預測的狀態更新 | 需要理解函數式程式設計概念 |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. 實戰指南：設計狀態管理的方法

::: tip 🤔 什麼時候需要狀態管理庫？
不是所有專案都需要狀態管理庫。在引入之前，先問自己幾個問題：

1. **有多少組件需要共享這份資料？**
   - 如果只有 2-3 個組件，用 props/events 就夠了
   - 如果有 5+ 個組件，考慮狀態管理庫

2. **這份資料會經常變化嗎？**
   - 如果幾乎不變（如使用者資訊），用 Provide/Inject
   - 如果經常變化（如購物車），用狀態管理庫

3. **團隊規模多大？**
   - 個人或小團隊：簡單的方案就行
   - 大團隊：需要嚴格的規範和強大的除錯工具

**記住：從簡單開始，按需升級。**
:::

### 5.1 狀態設計的原則

無論你選擇哪種狀態管理方案，都應該遵循以下原則：

**原則一：單一資料來源**

同一份資料只應該在一個地方儲存。不要在多個組件裡重複定義相同的資料。

```javascript
// ❌ 錯誤：資料分散在各處
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ 正確：資料集中管理
const cartStore = { items: [] }  // 唯一的資料來源
```

**原則二：不可變性**

修改狀態時，應該建立新物件，而不是直接修改原物件。

```javascript
// ❌ 錯誤：直接修改
state.items.push(newItem)

// ✅ 正確：建立新物件
state.items = [...state.items, newItem]
```

**原則三：狀態往上提，事件往下傳**

共享狀態應該放在最近的公共祖先組件或全域 store 中，而不是分散在各個子組件裡。

```vue
<!-- ❌ 錯誤：狀態在子組件中 -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ 正確：狀態在父組件中 -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 實戰案例：電商購物車狀態設計

讓我們綜合運用前面的知識，設計一個電商購物車的狀態管理方案。

**需求分析：**

- 商品列表頁可以加入商品到購物車
- 購物車頁面可以查看、修改數量、刪除商品
- 頭部導航顯示購物車商品數量
- 支援選擇/取消選擇商品，計算選中商品總價
- 資料持久化到 localStorage

**狀態設計（Pinia）：**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State（狀態）============
  const items = ref([])  // 購物車商品列表
  const selectedIds = ref([])  // 選中的商品 ID

  // 從 localStorage 恢復資料
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('讀取購物車資料失敗:', e)
      }
    }
  }

  // 持久化到 localStorage
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters（計算屬性）============
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  const selectedItems = computed(() =>
    items.value.filter(item => selectedIds.value.includes(item.id))
  )

  const selectedTotalPrice = computed(() =>
    selectedItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // ============ Actions（方法）============
  const addItem = (product) => {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity += product.quantity || 1
    } else {
      items.value.push({
        ...product,
        quantity: product.quantity || 1
      })
    }
    persist()
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeItem(productId)
      } else {
        item.quantity = quantity
        persist()
      }
    }
  }

  const removeItem = (productId) => {
    items.value = items.value.filter(item => item.id !== productId)
    selectedIds.value = selectedIds.value.filter(id => id !== productId)
    persist()
  }

  const toggleSelection = (productId) => {
    const index = selectedIds.value.indexOf(productId)
    if (index > -1) {
      selectedIds.value.splice(index, 1)
    } else {
      selectedIds.value.push(productId)
    }
    persist()
  }

  // 初始化
  initFromStorage()

  return {
    // State
    items,
    selectedIds,
    // Getters
    itemCount,
    totalPrice,
    selectedItems,
    selectedTotalPrice,
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    toggleSelection
  }
})
```

**在組件中使用：**

```vue
<!-- 商品詳情頁：ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">加入購物車</button>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: Object
})

const cart = useCartStore()

const addToCart = () => {
  cart.addItem({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price
  })
}
</script>
```

```vue
<!-- 頭部導航：Header.vue -->
<template>
  <header class="header">
    <div class="logo">我的商店</div>
    <nav>
      <RouterLink to="/">首頁</RouterLink>
      <RouterLink to="/cart">
        購物車 ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // 直接使用，自動響應變化
</script>
```

---

## 6. 常見問題與規避指南

::: warning ⚠️ 這些坑，90% 的初學者都會踩
在狀態管理的實踐中，有些錯誤特別常見。讓我總結一下最常見的坑，以及如何避免它們。
:::

### 6.1 坑一：直接修改 Props 或 State

**錯誤程式碼：**

```javascript
// ❌ 直接修改 props
props.user.name = '李四'

// ❌ 直接修改 Vuex 的 state
store.state.user.name = '李四'

// ❌ 直接修改陣列元素
state.items[0].name = '新名稱'
```

**為什麼這樣不行？**

前端框架（Vue/React）需要「追蹤」資料的變化，才能自動更新介面。如果你直接修改物件或陣列，框架可能無法檢測到變化，導致介面不更新。

**正確做法：**

```javascript
// ✅ Vue 3 / Pinia：直接修改頂層屬性
store.user.name = '李四'  // Pinia 會自動處理響應式

// ✅ Vue 2 / Vuex：透過 mutation
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ 修改陣列：建立新陣列
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: '新名稱' } : item
)
```

### 6.2 坑二：在 Getter 中修改狀態

**錯誤程式碼：**

```javascript
// ❌ 在 getter 中修改狀態
getters: {
  doubleCount(state) {
    state.count *= 2  // 副作用！
    return state.count
  }
}
```

**為什麼這樣不行？**

Getter 應該是「純函式」，只負責計算和回傳值，不應該有任何副作用（修改狀態）。如果在 getter 中修改狀態，會導致無限迴圈、難以除錯的問題。

**正確做法：**

```javascript
// ✅ Getter 只計算，不修改
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ 如果需要修改，用 action
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 坑三：忘記清理事件監聽

**錯誤程式碼：**

```javascript
// ❌ 忘記取消訂閱
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // 組件銷毀了，但監聽還在！
}
```

**為什麼這樣不行？**

如果組件銷毀了但事件監聽還在，會導致記憶體洩漏（佔用的記憶體無法釋放）。在單頁應用中，使用者不斷切換頁面，這些未清理的監聽器會越積越多，最終導致頁面卡頓。

**正確做法：**

```javascript
// ✅ 及時取消訂閱
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3 用 beforeUnmount，Vue 2 用 beforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 坑四：過度使用狀態管理

**錯誤程式碼：**

```javascript
// ❌ 把所有狀態都放進 store
const store = useStore()
store.inputValue = '使用者輸入'
store.isModalOpen = true
store.currentTab = 'profile'
```

**為什麼這樣不行？**

不是所有狀態都需要放進全域 store。如果一個狀態只在一個組件中使用（如輸入框的值、模態框的開關），放在組件內部就行。過度使用狀態管理會讓程式碼變得複雜。

**正確做法：**

```javascript
// ✅ 區域性狀態用組件內部管理
const inputValue = ref('')

// ✅ 只有需要共享的狀態才放 store
const userInfo = useUserStore()  // 多個組件需要使用者資訊
const cart = useCartStore()  // 多個組件需要購物車資料
```

---

## 7. 總結與建議

### 7.1 核心知識點回顧

讓我們用一張表格來回顧組件化與狀態管理的核心概念：

| 概念 | 一句話解釋 | 解決的問題 | 典型工具 |
|------|-----------|-----------|----------|
| **組件化** | 把介面拆成獨立的、可複用的部份 | 程式碼複用、職責分離 | Vue/React 組件 |
| **Props** | 父組件給子組件傳遞資料 | 父子通訊 | Vue/React 內建 |
| **Events** | 子組件通知父組件發生了什麼 | 子父通訊 | Vue/React 內建 |
| **State** | 組件內部儲存的資料 | 記憶組件的狀態 | Vue/React 內建 |
| **狀態管理庫** | 集中管理全域共享狀態 | 跨組件通訊、Props Drilling | Pinia、Redux、Zustand |
| **單一資料來源** | 同一份資料只在一個地方儲存 | 資料不一致、同步困難 | 狀態管理庫的核心原則 |

### 7.2 不同場景的選擇建議

| 場景 | 推薦方案 | 理由 |
| :--- | :--- | :--- |
| **父子組件通訊** | Props + Events | 框架內建，簡單直接 |
| **跨層級傳值** | Provide / Inject | 避免層層傳遞 |
| **組件內區域性狀態** | ref / useState | 簡單，不需要額外工具 |
| **中型 Vue 專案** | Pinia | 官方推薦，學習成本低 |
| **中型 React 專案** | Zustand | 極簡，無樣板程式碼 |
| **大型 Vue 專案** | Pinia + 規範 | 靈活且可擴充 |
| **大型 React 專案** | Redux Toolkit | 規範嚴格，生態豐富 |
| **跨組件複用邏輯** | Composable / Hooks | 靈活，可組合 |

### 7.3 學習建議

**對於初學者：**

1. **先掌握基礎**：理解 props、events、state 這些基本概念
2. **從小專案開始**：不要一開始就上狀態管理庫
3. **多寫程式碼**：理論學再多，不如動手實踐

**對於進階者：**

1. **讀原始碼**：理解 Pinia/Redux 的工作原理
2. **學模式**：了解常見的設計模式（如觀察者模式、發布訂閱模式）
3. **關注生態**：學習相關的工具（如 DevTools、中介軟體）

**記住這些核心原則：**

1. **從簡單開始**：不要過早引入複雜的狀態管理庫
2. **單一資料來源**：避免同一份資料在多個地方儲存
3. **不可變性**：修改狀態時建立新物件，而不是直接修改
4. **按需選擇**：根據專案規模和團隊情況選擇合適的方案

希望這篇文章能幫助你建立起對組件化與狀態管理的整體認知。當你在實際專案中遇到複雜的資料流問題時，能夠知道從哪裡入手、如何設計、怎樣實現。
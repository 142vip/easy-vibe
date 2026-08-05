# 状態管理原理：コンポーネント間データフロー

::: tip 🎯 核心問題
**アプリケーションが大きくなるにつれて、コンポーネント間でどのようにエレガントにデータを共有・同期すればよいのか？** あなたはこんなジレンマに直面したことがあるかもしれません：ユーザーが商品ページでカートに追加したのに、ヘッダーのカート数が更新されない。関連性のない2つのコンポーネントが同じデータを必要としているのに、どう渡せばいいかわからない。この章では、「混乱したデータの受け渡し」から「明確な状態管理」への進化をガイドします。
:::

---

## 1. コンポーネント化と状態管理の動機

### 1.1 小規模工房から工場へ：フロントエンド開発の進化

本題に入る前に、一つ質問です：**キッチンで大規模な料理を作ろうとしたことはありますか？**

自分一人のためにラーメンを作るだけなら、とても簡単です。鍋一つ、麺一把、調味料少々で、10秒で完了です。しかし、レストランを開いて毎日数百人のお客様にサービスを提供するなら、「思いつきで何でも作る」わけにはいきません。標準化されたレシピ、明確な分業、統一された調達プロセスが必要で、それによって初めて各料理の品質が安定し、提供効率が高まります。

フロントエンド開発も同じです。一人で小さなプロジェクトを書くなら、コードをどこに置いても構いません。しかし、チームが大きくなり、プロジェクトが複雑になると、コードを整理しデータを管理するための体系的な方法が必要になります。これが**コンポーネント化と状態管理**が解決しようとしている問題です。

::: tip 🤔 「コンポーネント」と「状態」とは？
先に進む前に、2つの中核となる用語を説明します：

**コンポーネント（Component）**：レゴブロックのようなものです。各ブロックは独立した部品であり、独自の形状、色、機能を持っています。複数のブロックを組み合わせて、複雑な城を作ることができます。フロントエンド開発では、ボタン、フォーム、ナビゲーションバーなど、すべてがコンポーネントになり得ます。

**状態（State）**：コンポーネントの「記憶」です。例えば、ボタンは自分が「無効」か「有効」かを「記憶」しています。ショッピングカートコンポーネントは、中にどの商品が入っているかを「記憶」しています。状態は変化し、その変化がUIの更新をトリガーします。

**コンポーネント化 + 状態管理 = 整理されたコード + 明確なデータフロー**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 小規模工房モード**
- コードが一つのファイルに書かれ、一つの鍋ですべての料理を作るようなもの
- データがあちこちに渡され、ウェイターがレストラン中を走り回るようなもの
- 一箇所の変更が他の場所に影響し、塩を入れすぎると料理全体が台無しになるようなもの

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 工場モード**
- コードがコンポーネントに分割され、レストランがフロア、厨房、購買部に分かれるようなもの
- データが集中管理され、統一された倉庫と配送システムがあるようなもの
- 変更の影響範囲が明確で、一品の料理を変えてもレストラン全体に影響しないようなもの

</div>
</div>

### 1.2 ケース：なぜ状態管理を理解する必要があるのか

あなたはこう言うかもしれません：「VueやReactを使っているけど、それらにはすでに状態管理があるのでは？」 実際の話をしましょう。そうすれば、コンポーネント化と状態管理を体系的に理解することがなぜそれほど重要なのかがわかります。

::: warning シャオメイの失敗談
シャオメイは某EC企業のプロダクトマネージャーからフロントエンド開発者に転向し、会社のショッピングカート機能のリファクタリングを任されました。彼女は以前jQuery時代の古いプロジェクトを扱っていましたが、今回はVue 3で作り直します。

シャオメイはこう考えました：「ショッピングカートのロジックは簡単で、配列を保存すればいいだけ。」そして彼女はコードを書き始めました：
- 商品詳細ページのコンポーネントで、配列 `cart` を使ってカートデータを保存
- カートページのコンポーネントで、さらに `cartItems` 配列を定義
- ヘッダーナビゲーションのコンポーネントで、さらに `cartCount` 変数を定義

問題はすぐに表面化しました：
1. **データの不整合**：ユーザーが商品詳細ページで商品を追加しても、カートページのデータが更新されない
2. **コードの重複**：シャオメイは「カートに追加」関数を複数書かざるを得ず、それぞれ異なるコンポーネントに配置した
3. **保守の困難さ**：運用チームが「カートを空にする」機能を追加したいと言ったとき、シャオメイは3箇所を修正する必要があることに気づいた

その後、彼女はフロントエンドアーキテクトのアーチャンに相談しました。アーチャンはコードを一目見て言いました：「君は状態管理の最大のタブーを犯している——同じデータを複数の場所に保存している。」

解決策はシンプルでした：Piniaを使ってグローバルなショッピングカート状態管理を作成し、すべてのコンポーネントが同じ場所からデータを読み書きするようにします。この変更後、すべての問題が解決しました。

シャオメイはこれで一つの真理を理解しました：**コンポーネント化と状態管理を理解しなければ、保守不可能な「スパゲッティコード」を書いてしまうことになる。**
:::

::: info 💡 核心的な教訓
コンポーネント化と状態管理は、フレームワークの「付加機能」ではなく、モダンフロントエンド開発の基盤です。これらを理解することで、明確なアーキテクチャを設計し、保守可能なコードを書き、チームコラボレーションで自在に立ち回れるようになります。
:::

---

## 2. 核心概念：コンポーネント化の本質を理解する

::: tip 🤔 「コンポーネント思考」とは？
コンポーネント思考とは、複雑なUIを独立した、再利用可能な、単一責任のコードユニットに分解する方法です。

例えてみましょう：あなたがパソコンを組み立てていると想像してください。CPU、メモリ、ハードディスク、グラフィックカードなどの部品をそれぞれ購入し、組み立てます。各部品には明確な機能があり、他の部分に影響を与えることなく、いつでも特定の部品を交換できます。

コンポーネント化は、フロントエンドコードを同じように「モジュール化」することです——各コンポーネントは自分の仕事を担当し、明確なインターフェースを通じて他のコンポーネントと連携します。
:::

### 2.1 レストランの比喩でコンポーネント化を理解する

レストランの比喩を使って、コンポーネント化の核心的な考え方を理解しましょう：

| 概念 | 🍽️ レストランの比喩 | 実際の役割 | 具体例 |
|------|-------------|----------|----------|
| **コンポーネント** | レストランの各部門（フロア、厨房、購買部） | 各部門が自分の仕事を担当 | ボタンコンポーネントはクリックを担当、フォームコンポーネントは入力を担当 |
| **Props（プロパティ）** | お客様がウェイターに渡す注文 | 親コンポーネントが子コンポーネントにデータを渡す | 親コンポーネントが「ユーザー名」をアバターコンポーネントに渡す |
| **Events（イベント）** | ウェイターが厨房に「新規注文」を通知 | 子コンポーネントが親コンポーネントに何が起こったかを通知 | ボタンコンポーネントが親コンポーネントに「クリックされた」と伝える |
| **State（状態）** | 厨房の「現在の注文リスト」 | コンポーネント内部に保存されるデータ | カートコンポーネントが中にどの商品があるかを記憶 |

::: tip 📊 この表から何が読み取れるか？
各行を詳しく見ていきましょう：

**コンポーネント**：レストランに異なる部門があるように、フロントエンドページも異なるコンポーネントで構成されます。各コンポーネントは独立した部分であり、独自の責任を持ちます。

**Props**：これは親コンポーネントが子コンポーネントに「データを渡す」方法です。お客様が注文時にウェイターに何を食べたいか伝えるように、親コンポーネントもpropsを通じてデータ（ユーザー名、商品情報など）を子コンポーネントに渡すことができます。注意：propsは「単方向」で、親から子にのみ渡され、逆方向には渡せません。

**Events**：子コンポーネントが親コンポーネントに通知する必要がある場合（ボタンがクリックされた、フォームが送信されたなど）、イベントを発火します。ウェイターが注文を受けてから厨房に「料理を始めて」と通知するようなものです。これによりデータフローの単方向性が保たれます——子コンポーネントは親コンポーネントのデータを直接変更できず、「メッセージを送る」ことしかできません。

**State**：これはコンポーネント内部の「記憶」です。厨房が現在の注文を覚えておく必要があるように、コンポーネントも自分の状態（カートにどの商品があるか、ボタンが無効かどうかなど）を覚えておく必要があります。状態が変化すると、コンポーネントは自動的にUIを更新します。
:::

<ComponentHierarchyDemo />

### 2.2 PropsとEvents：親子コンポーネントの「公式チャネル」

フロントエンドフレームワーク（Vue、React）では、**PropsとEventsが親子コンポーネント間の標準的な通信方法**です。

**Vueの例：**

```vue
<!-- Parent.vue - 親コンポーネント -->
<template>
  <div>
    <!-- ウェイターにメニューを渡すように、propsを通じてデータを渡す -->
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
  console.log('ユーザーを削除:', userId)
  // 削除ロジックを処理
}
</script>
```

```vue
<!-- Child.vue - 子コンポーネント -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">管理者</span>
    <button @click="requestDelete">ユーザーを削除</button>
  </div>
</template>

<script setup>
// 親コンポーネントから渡されたデータを受け取る
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// 発火可能なイベントを定義
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // イベントを通じて親コンポーネントに通知
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 核心原則
**Propsは下へ、Eventsは上へ**——これがコンポーネント通信の黄金律です。

- 親コンポーネントは **props** を通じて子コンポーネントにデータを渡す（部下にタスクを割り当てるように）
- 子コンポーネントは **events** を通じて親コンポーネントに何が起こったかを通知する（部下が報告するように）

これによりデータフローの明確さと単方向性が保たれ、「誰でもデータを変更できる」という混乱した状況を回避します。
:::

<PropsFlowDemo />

### 2.3 単方向データフロー：なぜpropsを直接変更してはいけないのか

多くの初心者が犯すミスがあります：子コンポーネント内でpropsの値を直接変更することです。

```vue
<!-- ❌ 誤ったやり方 -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// propsを直接変更 - これは禁止されています！
props.count = 10  // エラーになります
</script>
```

**なぜpropsを直接変更してはいけないのか？**

想像してみてください：あなたが図書館から本を借り（props）、その本に落書きをした（propsを変更）とします。その本を借りる他の人（他のコンポーネント）もあなたの落書きを見ることになり、混乱を引き起こします。正しいやり方は：データを変更する必要がある場合、親コンポーネントに変更させ、子コンポーネントは「変更をリクエストする」だけにすべきです。

```vue
<!-- ✅ 正しいやり方 -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// イベントを通じて親コンポーネントに変更をリクエスト
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. 「混沌」から「秩序」へ：コンポーネント通信の進化の道

::: tip 🤔 なぜ進化が必要なのか？
プロジェクトが大きくなるにつれて、コンポーネント間の通信はますます複雑になります。実際のチームがどのようにして段階的に明確な状態管理ソリューションへと進化していったかを見てみましょう。

これは単なる「ツールのアップグレード」ではなく、**思考方法全体の変化**です——「データを適当に渡す」ことから「明確なデータフローを設計する」ことへ。
:::

### 3.1 進化の全景図

以下の表は、コンポーネント通信方式の進化の4段階を示しています。問題がどのように一歩ずつ解決されていったかがわかります：

| 段階 | 通信方式 | 典型的な問題 | 核心的変化 |
|------|---------|----------|----------|
| **段階1：自由な受け渡し** | 直接変更、グローバル変数 | データの不整合、デバッグ困難 | 規範なし、どう渡してもOK |
| **段階2：Props/Events** | 親子コンポーネント標準通信 | Props Drilling（バケツリレー） | 規範はできたが、深いネストが面倒 |
| **段階3：状態管理ライブラリ** | Vuex/Redux/Pinia | 学習コスト、ボイラープレートコード | データ集中管理、デバッグが容易 |
| **段階4：モダンなソリューション** | Composable/原子的 | 新しい概念の理解が必要 | より柔軟、より簡潔 |

<EventBusDemo />

::: tip 📊 この表から何が読み取れるか？
各行を詳しく見ていきましょう：

**段階1 → 段階2**：「規範なし」から「規範あり」へ。これは質的な飛躍です——標準的なprops/events通信を使い始め、データフローが明確になります。しかし代償として、コンポーネントの階層が深い場合、データを階層ごとに渡す必要があり、非常に面倒です（これがProps Drillingです）。

**段階2 → 段階3**：「分散管理」から「集中管理」へ。Vuex/Reduxのような状態管理ライブラリを使い始め、共有データをグローバルな「倉庫」に置き、すべてのコンポーネントがここからデータを読み書きします。これでProps Drillingは解決されますが、学習コストが高くなります。

**段階3 → 段階4**：「重量級」から「軽量級」へ。新しいソリューション（Vue 3のComposition API、ReactのHooksなど）により、状態管理がより柔軟で簡潔になります。必ずしもグローバルなstoreを使う必要はなく、必要に応じて小さな状態ユニットを組み合わせることができます。

**まとめ**：進化とは単に「より良いツールに変える」ことではなく、**思考方法全体のアップグレード**です——データを適当に渡すことから、明確なデータフローを設計することへ。
:::

### 3.2 段階1：自由な受け渡し——混乱の始まり

なぜ「自由な受け渡し」と呼ばれるのか？この段階では何の規範もなく、データをどう渡しても構わないからです——グローバル変数、直接変更、イベントバスが飛び交います。

**典型的なシナリオ：カートデータがあちこちに分散**

```javascript
// 商品詳細ページコンポーネント
export default {
  data() {
    return {
      localCart: []  // 自分でカートデータを保持
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // 他のコンポーネントと同期しようとする
      window.cart = this.localCart  // ❌ グローバル変数！
    }
  }
}

// カートページコンポーネント
export default {
  data() {
    return {
      cartItems: []  // また別のカートデータ
    }
  },
  mounted() {
    // グローバル変数から読み取ろうとする
    this.cartItems = window.cart || []  // ❌ 信頼できない！
  }
}

// ヘッダーナビゲーションコンポーネント
export default {
  data() {
    return {
      cartCount: 0  // さらに3つ目のデータ！
    }
  },
  mounted() {
    // ポーリングで変更をチェック（なんと馬鹿げたことか）
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ パフォーマンスが悪い！
  }
}
```

**この段階の特徴：**
- ✅ **利点**：シンプルで直接的、学習コストゼロ
- ❌ **欠点**：データが分散、同期が困難、デバッグが困難、混乱状態

### 3.3 段階2：Props/Events——規範の確立

自由な受け渡しの混乱により、チームは気づきました：**規範が必要だ**。そこでフレームワークが提供する標準的な通信方法であるpropsとeventsを使い始めました。

**典型的なシナリオ：Props Drilling（プロパティのバケツリレー）**

```vue
<!-- 祖先コンポーネント：App.vue -->
<template>
  <div class="app">
    <!-- ユーザー情報を階層ごとに渡す -->
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
    <Header :user-name="userName" />  <!-- 渡すだけで使わない -->
    <Main>
      <Page :user-name="userName" />  <!-- 渡すだけで使わない -->
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
<!-- 実際に必要な場所：Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- ようやく使われる -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**この段階の特徴：**
- ✅ **利点**：データフローが明確、単方向、理解しやすい
- ❌ **欠点**：Props Drilling（バケツリレーが面倒）、クロスコンポーネント通信が困難

::: tip 🤔 Props Drillingとは？
Props Drillingとは：**データが多くの仲介コンポーネントを経由して階層ごとに渡されるが、それらの中間コンポーネントは実際にはそのデータを使用しない**ことを指します。

5階に住んでいる人に宅配便を届けるようなものですが、規則で各階で一度サインしなければならないと決められています。1〜4階の人々はあなたの「宅配便を渡す」だけを手伝い、彼らはその荷物を必要としていませんが、参加しなければなりません。これは明らかに面倒です。
:::

### 3.4 段階3：状態管理ライブラリ——集中管理

Props Drillingの痛点が状態管理ライブラリ（Vuex、Redux、Pinia）を生み出しました。それらの核心的な考え方は：**共有データをグローバルな「倉庫」に置き、すべてのコンポーネントがここからデータを読み書きする**ことです。

**典型的なシナリオ：Piniaでカートを管理**

```javascript
// stores/cart.js - グローバルカート状態
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // すべてのカートデータはここに集中
  const items = ref([])

  // 計算プロパティ：商品数
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // メソッド：商品を追加
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
<!-- 商品詳細ページコンポーネント -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // 直接呼び出し、バケツリレー不要
}
</script>
```

```vue
<!-- ヘッダーナビゲーションコンポーネント -->
<template>
  <header>
    <span>カート ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // 直接読み取り、自動同期
</script>
```

**この段階の特徴：**
- ✅ **利点**：データ集中管理、Props Drilling解決、デバッグツールが強力
- ❌ **欠点**：学習コスト、追加コードが必要（ボイラープレート）、単純なプロジェクトにはオーバーエンジニアリング

### 3.5 段階4：モダンなソリューション——柔軟性と簡潔さ

状態管理ライブラリは強力ですが、「大砲で蚊を撃つ」ような問題もあります。中小規模のプロジェクトでは、より柔軟で軽量なソリューションが登場しました。

**典型的なシナリオ：Composable/Hooksで状態ロジックを再利用**

```javascript
// composables/useCart.js - 再利用可能なカートロジック
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
<!-- 任意のコンポーネントで使用 -->
<script setup>
import { useCart } from '@/composables/useCart'

// 呼び出すたびに新しい状態インスタンスが作成される
// コンポーネント内部のローカル状態に適している
const { items, itemCount, addItem } = useCart()
</script>
```

**この段階の特徴：**
- ✅ **利点**：柔軟、軽量、組み合わせ可能、必要に応じて使用
- ❌ **欠点**：コンポジション思考の理解が必要、クロスコンポーネント共有には追加処理が必要

---

## 4. 状態管理ライブラリ詳解：Vuex vs Pinia vs Redux

::: tip 🤔 状態管理ライブラリの選び方は？
異なる状態管理ライブラリを前にして、あなたは困惑するかもしれません：結局どれを選べばいいのか？

実際には「最高」のライブラリはなく、「最適」なライブラリがあるだけです。選択時には以下の要素を考慮してください：
- **どのフレームワークを使っているか？** VueならPinia、ReactならRedux/Zustand
- **プロジェクトの規模は？** 小規模ならComposable、大規模なら状態管理ライブラリ
- **チームの経験は？** チームが慣れているもの、または学習コストの低いものを選ぶ

これから、主要な状態管理ライブラリの特徴と使用シーンを詳しく紹介します。
:::

### 4.1 主要状態管理ライブラリの比較

| 特性 | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **対応フレームワーク** | React | Vue | Vue | React |
| **学習曲線** | 急峻 | 中程度 | 緩やか | 緩やか |
| **ボイラープレートコード** | 多い | 中程度 | 少ない | 極めて少ない |
| **TypeScript** | 良好 | 良好 | 優秀 | 優秀 |
| **デバッグツール** | 強力 | 良好 | 優秀 | 良好 |
| **適用シーン** | 大規模プロジェクト | Vue 2/3 中〜大規模プロジェクト | Vue 3 新規プロジェクト | React 中小規模プロジェクト |

::: tip 📊 この表から何が読み取れるか？
各行を詳しく見ていきましょう：

**Redux**：Reactエコシステムの老舗状態管理ライブラリ。利点は厳格な規範と強力なデバッグツールですが、欠点はボイラープレートコードが多く、学習曲線が急峻なことです。大規模プロジェクトや厳格な規範が必要なチームに適しています。

**Vuex**：Vue 2時代の公式状態管理ライブラリ。設計思想はReduxに似ていますが、Vueのリアクティブシステムにより適合しています。現在でも使用可能ですが、新規プロジェクトではPiniaが推奨されます。

**Pinia**：Vue 3公式推奨の新世代状態管理ライブラリ。シンプルな構文、優れたTypeScriptサポート、低い学習コスト。**これがVue 3プロジェクトの第一選択です**。

**Zustand**：Reactエコシステムの軽量状態管理ライブラリ。APIが極めてシンプルで、ボイラープレートコードがほとんどありません。中小規模のReactプロジェクトに適しています。
:::

<StateManagementComparisonDemo />

### 4.2 Pinia実践：Vue 3の推奨選択

PiniaはVueチームが公式に推奨する状態管理ライブラリで、Vue 3向けに設計されています。Vuexよりもシンプルで使いやすいです。

**なぜPiniaという名前なのか？**

Piniaはスペイン語で「パイナップル」を意味します。パイナップルは多くの小さな花からなる果物で、各小花は独立していますが、全体としては統一された一つの整体です。これはまさにPiniaの設計理念を象徴しています——**各storeは独立しているが、組み合わせて使用できる**。

**核心概念：**

::: details 完全なコード例を見る
```javascript
// stores/user.js - ユーザー状態管理
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State：データを保存
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions：データを変更するメソッド
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // 直接変更、Piniaがリアクティブを処理
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters：計算プロパティ
  const displayName = computed(() => {
    return userInfo.value?.name || 'ゲスト'
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

**コンポーネントでの使用：**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">ようこそ、{{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">ログアウト</button>
    <button v-else @click="showLoginDialog">ログイン</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// storeを直接取得、すべての内容がリアクティブ
const user = useUserStore()

const showLoginDialog = () => {
  // ログインダイアログを表示...
}
</script>
```

**Piniaの利点：**

| 利点 | 説明 | Vuexとの比較 |
|------|------|----------|
| **シンプルなAPI** | mutations不要、stateを直接変更可能 | Vuexはmutationsとactionsを分離する必要がある |
| **TypeScriptフレンドリー** | ネイティブ型推論、追加設定不要 | Vuexは複雑な型定義が必要 |
| **自動モジュール化** | 各storeファイルが自動的にモジュールになる | Vuexは手動でnamespacedを設定する必要がある |
| **より小さなサイズ** | バンドル後約1KB | Vuexは約3KB |

<VuexPiniaDemo />

### 4.3 Redux実践：Reactのクラシックな選択

ReduxはReactエコシステムで最もクラシックな状態管理ライブラリであり、厳格な単方向データフローで知られています。

**なぜReduxという名前なのか？**

Reduxは「Reduced Flux」の略です。FluxはFacebookが初期に提唱したアプリケーションアーキテクチャパターンで、ReduxはFluxの概念を簡略化したため、「Reduced Flux」と呼ばれます。

**核心原則：**

1. **単一データソース**：アプリケーション全体のstateが1つのオブジェクトツリーに保存される
2. **Stateは読み取り専用**：stateを変更する唯一の方法はactionを発火すること
3. **純粋関数で変更**：Reducerは純粋関数でなければならない

::: details 完全なコード例を見る
```javascript
// 1. Action Typesを定義
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. Action Creatorsを定義
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. Reducerを定義（純粋関数）
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

// 4. Storeを作成
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**Reactでの使用：**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // stateを読み取る
  const todos = useSelector(state => state.todos)

  // dispatch関数を取得
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

**Reduxの長所と短所：**

| 長所 | 短所 |
| :--- | :--- |
| 厳格なデータフロー、デバッグが容易 | ボイラープレートコードが多い、学習曲線が急峻 |
| タイムトラベルデバッグ（Time Travel） | 単純な状態でも多くのコードを書く必要がある |
| 豊富なミドルウェアエコシステム | 小規模プロジェクトには不向き |
| 予測可能な状態更新 | 関数型プログラミングの概念理解が必要 |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. 実践ガイド：状態管理をどう設計するか

::: tip 🤔 いつ状態管理ライブラリが必要か？
すべてのプロジェクトに状態管理ライブラリが必要なわけではありません。導入する前に、以下の質問を自問してください：

1. **いくつのコンポーネントがこのデータを共有する必要があるか？**
   - 2〜3個のコンポーネントだけであれば、props/eventsで十分
   - 5個以上のコンポーネントであれば、状態管理ライブラリを検討

2. **このデータは頻繁に変化するか？**
   - ほとんど変わらない場合（ユーザー情報など）、Provide/Injectを使う
   - 頻繁に変わる場合（カートなど）、状態管理ライブラリを使う

3. **チームの規模は？**
   - 個人または小規模チーム：シンプルなソリューションでOK
   - 大規模チーム：厳格な規範と強力なデバッグツールが必要

**覚えておいてください：シンプルから始め、必要に応じてアップグレードする。**
:::

### 5.1 状態設計の原則

どの状態管理ソリューションを選んでも、以下の原則に従うべきです：

**原則1：単一データソース**

同じデータは1箇所にのみ保存すべきです。複数のコンポーネントで同じデータを重複定義してはいけません。

```javascript
// ❌ 誤り：データがあちこちに分散
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ 正しい：データを集中管理
const cartStore = { items: [] }  // 唯一のデータソース
```

**原則2：不変性**

状態を変更する際は、元のオブジェクトを直接変更するのではなく、新しいオブジェクトを作成すべきです。

```javascript
// ❌ 誤り：直接変更
state.items.push(newItem)

// ✅ 正しい：新しいオブジェクトを作成
state.items = [...state.items, newItem]
```

**原則3：状態は上に上げ、イベントは下に渡す**

共有状態は、最も近い共通の祖先コンポーネントまたはグローバルstoreに配置すべきで、各子コンポーネントに分散させてはいけません。

```vue
<!-- ❌ 誤り：状態が子コンポーネントにある -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ 正しい：状態が親コンポーネントにある -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 実践案例：ECカートの状態設計

これまでの知識を総合して、ECカートの状態管理ソリューションを設計してみましょう。

**要件分析：**

- 商品リストページで商品をカートに追加できる
- カートページで確認、数量変更、商品削除ができる
- ヘッダーナビゲーションにカート商品数が表示される
- 商品の選択/選択解除、選択商品の合計金額計算をサポート
- データをlocalStorageに永続化

**状態設計（Pinia）：**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State（状態）============
  const items = ref([])  // カート商品リスト
  const selectedIds = ref([])  // 選択された商品ID

  // localStorageからデータを復元
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('カートデータの読み取りに失敗:', e)
      }
    }
  }

  // localStorageに永続化
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters（計算プロパティ）============
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

  // ============ Actions（メソッド）============
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

  // 初期化
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

**コンポーネントでの使用：**

```vue
<!-- 商品詳細ページ：ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">カートに入れる</button>
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
<!-- ヘッダーナビゲーション：Header.vue -->
<template>
  <header class="header">
    <div class="logo">マイストア</div>
    <nav>
      <RouterLink to="/">ホーム</RouterLink>
      <RouterLink to="/cart">
        カート ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // 直接使用、自動的に変更に反応
</script>
```

---

## 6. よくある失敗と回避ガイド

::: warning ⚠️ これらの落とし穴、初心者の90%がハマる
状態管理の実践では、特によくある間違いがあります。最も一般的な落とし穴とその回避方法をまとめましょう。
:::

### 6.1 ケース1：PropsやStateを直接変更する

**誤ったコード：**

```javascript
// ❌ propsを直接変更
props.user.name = '李四'

// ❌ Vuexのstateを直接変更
store.state.user.name = '李四'

// ❌ 配列要素を直接変更
state.items[0].name = '新しい名前'
```

**なぜダメなのか？**

フロントエンドフレームワーク（Vue/React）は、UIを自動更新するためにデータの変化を「追跡」する必要があります。オブジェクトや配列を直接変更すると、フレームワークが変化を検出できず、UIが更新されない可能性があります。

**正しいやり方：**

```javascript
// ✅ Vue 3 / Pinia：トップレベルのプロパティを直接変更
store.user.name = '李四'  // Piniaが自動的にリアクティブを処理

// ✅ Vue 2 / Vuex：mutationを通じて
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ 配列の変更：新しい配列を作成
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: '新しい名前' } : item
)
```

### 6.2 ケース2：Getterの中で状態を変更する

**誤ったコード：**

```javascript
// ❌ getterの中で状態を変更
getters: {
  doubleCount(state) {
    state.count *= 2  // 副作用！
    return state.count
  }
}
```

**なぜダメなのか？**

Getterは「純粋関数」であるべきで、計算して値を返すだけであり、いかなる副作用（状態の変更）もあってはいけません。getterの中で状態を変更すると、無限ループやデバッグ困難な問題を引き起こします。

**正しいやり方：**

```javascript
// ✅ Getterは計算のみ、変更しない
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ 変更が必要な場合はactionを使う
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 ケース3：イベントリスナーのクリーンアップを忘れる

**誤ったコード：**

```javascript
// ❌ 購読解除を忘れる
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // コンポーネントは破棄されたが、リスナーはまだ残っている！
}
```

**なぜダメなのか？**

コンポーネントが破棄されてもイベントリスナーが残っていると、メモリリーク（占有メモリが解放されない）が発生します。SPAでは、ユーザーが継続的にページを切り替えると、これらのクリーンアップされていないリスナーが蓄積し、最終的にページの動作が重くなります。

**正しいやり方：**

```javascript
// ✅ 適時に購読解除
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3ではbeforeUnmount、Vue 2ではbeforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 ケース4：状態管理の過剰使用

**誤ったコード：**

```javascript
// ❌ すべての状態をstoreに入れる
const store = useStore()
store.inputValue = 'ユーザー入力'
store.isModalOpen = true
store.currentTab = 'profile'
```

**なぜダメなのか？**

すべての状態をグローバルstoreに入れる必要はありません。ある状態が1つのコンポーネント内でのみ使用される場合（入力フィールドの値、モーダルの開閉状態など）、コンポーネント内部に置くだけで十分です。状態管理の過剰使用はコードを複雑にします。

**正しいやり方：**

```javascript
// ✅ ローカル状態はコンポーネント内部で管理
const inputValue = ref('')

// ✅ 共有が必要な状態だけをstoreに入れる
const userInfo = useUserStore()  // 複数のコンポーネントがユーザー情報を必要とする
const cart = useCartStore()  // 複数のコンポーネントがカートデータを必要とする
```

---

## 7. まとめとアドバイス

### 7.1 核心知識ポイントの復習

表を使ってコンポーネント化と状態管理の核心概念を振り返りましょう：

| 概念 | 一言で説明 | 解決する問題 | 代表的なツール |
|------|-----------|-----------|----------|
| **コンポーネント化** | UIを独立した再利用可能な部分に分割 | コード再利用、責務分離 | Vue/Reactコンポーネント |
| **Props** | 親コンポーネントが子コンポーネントにデータを渡す | 親子通信 | Vue/React 組み込み |
| **Events** | 子コンポーネントが親コンポーネントに何が起こったかを通知 | 子親通信 | Vue/React 組み込み |
| **State** | コンポーネント内部に保存されるデータ | コンポーネントの状態を記憶 | Vue/React 組み込み |
| **状態管理ライブラリ** | グローバル共有状態を集中管理 | クロスコンポーネント通信、Props Drilling | Pinia、Redux、Zustand |
| **単一データソース** | 同じデータは1箇所にのみ保存 | データ不整合、同期困難 | 状態管理ライブラリの核心原則 |

### 7.2 シーン別の選択アドバイス

| シーン | 推奨ソリューション | 理由 |
| :--- | :--- | :--- |
| **親子コンポーネント通信** | Props + Events | フレームワーク組み込み、シンプルで直接的 |
| **階層を跨いだ値の受け渡し** | Provide / Inject | バケツリレーを回避 |
| **コンポーネント内ローカル状態** | ref / useState | シンプル、追加ツール不要 |
| **中規模Vueプロジェクト** | Pinia | 公式推奨、学習コスト低 |
| **中規模Reactプロジェクト** | Zustand | 極めてシンプル、ボイラープレートなし |
| **大規模Vueプロジェクト** | Pinia + 規範 | 柔軟で拡張可能 |
| **大規模Reactプロジェクト** | Redux Toolkit | 規範が厳格、エコシステム豊富 |
| **クロスコンポーネントロジック再利用** | Composable / Hooks | 柔軟、組み合わせ可能 |

### 7.3 学習アドバイス

**初心者向け：**

1. **まず基礎をマスター**：props、events、stateといった基本概念を理解する
2. **小さなプロジェクトから始める**：最初から状態管理ライブラリを導入しない
3. **コードをたくさん書く**：理論をどれだけ学んでも、実践に勝るものはない

**中級者向け：**

1. **ソースコードを読む**：Pinia/Reduxの動作原理を理解する
2. **パターンを学ぶ**：一般的なデザインパターン（Observerパターン、Pub-Subパターンなど）を理解する
3. **エコシステムに注目**：関連ツール（DevTools、ミドルウェアなど）を学ぶ

**これらの核心原則を覚えておいてください：**

1. **シンプルから始める**：複雑な状態管理ライブラリを早まって導入しない
2. **単一データソース**：同じデータを複数箇所に保存することを避ける
3. **不変性**：状態を変更する際は新しいオブジェクトを作成し、直接変更しない
4. **必要に応じて選択**：プロジェクトの規模とチームの状況に応じて適切なソリューションを選ぶ

この記事が、コンポーネント化と状態管理に対する全体的な理解を築く助けとなることを願っています。実際のプロジェクトで複雑なデータフローの問題に直面したとき、どこから始め、どう設計し、どう実装すればよいかがわかるようになるでしょう。
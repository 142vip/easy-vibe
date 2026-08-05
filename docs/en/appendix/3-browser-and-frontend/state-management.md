# Principles of State Management
::: tip 🎯 Core Question
**As applications grow larger, how do components elegantly share and synchronize data?** You might face this dilemma: a user adds an item to the cart on the product page, but the cart count in the header doesn't update; two unrelated components need the same piece of data, but you don't know how to pass it. This chapter will guide you from "chaotic data passing" to "clear state management."
:::

---

## 1. Motivation for the "Componentization and State Management"

### 1.1 From Small Workshop to Factory: The Evolution of Frontend Development

Before we officially begin, let me ask you a question: **Have you ever tried cooking a big meal in the kitchen?**

If you're just making a bowl of noodles for yourself, it's simple — one pot, some noodles, a bit of seasoning, done in ten seconds. But if you're running a restaurant serving hundreds of customers every day, you can't just "cook whatever you feel like." You need standardized recipes, clear division of labor, and a unified procurement process to ensure consistent quality and efficient output for every dish.

Frontend development is the same. When working solo on a small project, you can put code anywhere. But as the team grows and the project becomes more complex, you need a systematic approach to organize code and manage data. This is exactly what **componentization and state management** aim to solve.

::: tip 🤔 What Are "Components" and "State"?
Before continuing, let's explain two core terms:

**Component**: Like LEGO bricks, each brick is an independent unit with its own shape, color, and function. You can snap multiple bricks together to build a complex castle. In frontend development, a button, a form, a navigation bar — each can be a component.

**State**: The "memory" of a component. For example, a button "remembers" whether it is "disabled" or "enabled"; a shopping cart component "remembers" what items are inside it. State changes, and state changes trigger UI updates.

**Componentization + State Management = Organized Code + Clear Data Flow**
:::

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏠 Small Workshop Model**
- Code written in a single file, like cooking all dishes in one pot
- Data passed around everywhere, like waiters running chaotically around the restaurant
- Changing one place may affect others, like oversalting ruining the entire dish

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🏭 Factory Model**
- Code split into components, like a restaurant divided into front-of-house, kitchen, and procurement
- Data centrally managed, like having a unified warehouse and distribution system
- Clear impact scope for changes, like swapping one dish without affecting the entire restaurant

</div>
</div>

### 1.2 Case: You Need to Understand State Management

You might say: "I'm using Vue/React, don't they already have state management?" Let me tell you a true story that will make you understand why systematically understanding componentization and state management is so important.

::: warning Xiaomei's Pitfall Diary
Xiaomei was a product manager turned frontend developer at an e-commerce company, and she had just taken over the shopping cart feature refactor. She had previously worked on legacy jQuery projects and now needed to migrate to Vue 3.

Xiaomei thought: "Shopping cart logic is simple, just store an array." So she started writing code:
- In the product detail page component, she used an array `cart` to store cart data
- In the cart page component, she defined another `cartItems` array
- In the header navigation component, there was yet another `cartCount` variable

Problems soon emerged:
1. **Data out of sync**: When a user added an item on the product detail page, the cart page data didn't update
2. **Duplicate code**: Xiaomei had to write several "add to cart" functions, placed in different components
3. **Maintenance difficulty**: When operations asked to add a "clear cart" feature, Xiaomei found she had to change three places

Later she consulted frontend architect Aqiang, who glanced at the code and said: "You've committed the cardinal sin of state management — storing the same data in multiple places."

The solution was simple: use Pinia to create a global cart state manager, where all components read from and write to the same place. After this change, all problems were solved.

Xiaomei learned a lesson from then on: **Without understanding componentization and state management, you'll write unmaintainable "spaghetti code."**
:::

::: info 💡 Core Insight
Componentization and state management are not "optional add-ons" to frameworks — they are the cornerstones of modern frontend development. Understanding them allows you to design clear architecture, write maintainable code, and navigate team collaboration with ease.
:::

---

## 2. Core Concepts: Understanding the Essence of Componentization

::: tip 🤔 What Is "Component-Oriented Thinking"?
Component-oriented thinking is a method of breaking down complex interfaces into independent, reusable, single-responsibility code units.

Think of it this way: imagine you're assembling a computer. You buy the CPU, memory, hard drive, and graphics card separately, then put them together. Each part has a clear function, and you can replace any part at any time without affecting the others.

Componentization makes frontend code "modular" in the same way — each component is responsible for its own task, collaborating with other components through clear interfaces.
:::

### 2.1 Understanding Componentization Through a Restaurant Analogy

Let's use a restaurant analogy to understand the core ideas of componentization:

| Concept | 🍽️ Restaurant Analogy | Actual Role | Concrete Example |
|------|-------------|----------|----------|
| **Component** | Different departments of a restaurant (front-of-house, kitchen, procurement) | Each department handles its own responsibilities | A button component handles clicks, a form component handles input |
| **Props** | The menu a customer gives to the waiter | Parent component passes data to child component | Parent component passes "username" to an avatar component |
| **Events** | The waiter notifying the kitchen "new order" | Child component notifies parent component of what happened | A button component tells the parent "I was clicked" |
| **State** | The kitchen's "current order list" | Data stored inside a component | A shopping cart component remembers what items are inside |

::: tip 📊 What Can You See from This Table?
Let's interpret this table row by row:

**Component**: Just like a restaurant has different departments, a frontend page is composed of different components. Each component is an independent unit with its own responsibilities.

**Props**: This is the way a parent component "passes data" to a child component. Just like a customer tells the waiter what they want to eat when ordering, a parent component can pass data (such as username, product info) to a child component via props. Note: props are "one-way" — they can only go from parent to child, not the reverse.

**Events**: When a child component needs to notify the parent component (e.g., a button was clicked, a form was submitted), it triggers events. Just like a waiter, after taking an order, notifies the kitchen to "start cooking." This maintains the one-way nature of data flow — child components cannot directly modify parent component data, they can only "send messages."

**State**: This is the internal "memory" of a component. Just like the kitchen needs to remember the current orders, a component needs to remember its own state (e.g., what items are in the cart, whether a button is disabled). When state changes, the component automatically updates the UI.
:::

<ComponentHierarchyDemo />

### 2.2 Props and Events: The "Official Channel" for Parent-Child Components

In frontend frameworks (Vue, React), **Props and Events are the standard way for parent-child component communication**.

**Vue Example:**

```vue
<!-- Parent.vue - Parent Component -->
<template>
  <div>
    <!-- Like handing a menu to the waiter, pass data via props -->
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
  name: 'Zhang San',
  isAdmin: true
})

const handleDelete = (userId) => {
  console.log('Delete user:', userId)
  // Handle delete logic
}
</script>
```

```vue
<!-- Child.vue - Child Component -->
<template>
  <div class="user-card">
    <h3>{{ userName }}</h3>
    <span v-if="isAdmin" class="badge">Admin</span>
    <button @click="requestDelete">Delete User</button>
  </div>
</template>

<script setup>
// Receive data passed from parent component
const props = defineProps({
  userName: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
})

// Define events that can be emitted
const emit = defineEmits(['delete-user'])

const requestDelete = () => {
  // Notify parent component via event
  emit('delete-user', props.userName)
}
</script>
```

::: tip 💡 Core Principle
**Props down, Events up** — this is the golden rule of component communication.

- Parent components pass data to child components via **props** (like assigning tasks to subordinates)
- Child components notify parent components of what happened via **events** (like subordinates reporting work)

This keeps the data flow clear and one-way, avoiding the chaos of "anyone can modify the data."
:::

<PropsFlowDemo />

### 2.3 One-Way Data Flow: Motivation for Caning 't You Directly Modify Props

Many beginners make the mistake of directly modifying props values in child components.

```vue
<!-- ❌ Wrong Approach -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

// Directly modifying props — this is forbidden!
props.count = 10  // Will throw an error
</script>
```

**Why can't you directly modify props?**

Imagine this: you borrow a book from the library (props), then scribble all over it (modify props). Other people who borrow this book (other components) will also see your scribbles, causing chaos. The correct approach is: if you need to modify the data, let the parent component do it — the child component only "requests the modification."

```vue
<!-- ✅ Correct Approach -->
<script setup>
const props = defineProps({
  count: { type: Number, default: 0 }
})

const emit = defineEmits(['update-count'])

// Request parent component to modify via event
const increment = () => {
  emit('update-count', props.count + 1)
}
</script>
```

---

## 3. From "Chaos" to "Order": The Evolution of Component Communication

::: tip 🤔 Why Is Evolution Necessary?
As projects grow, communication between components becomes increasingly complex. Let's see how a real team gradually evolved a clear state management solution.

This isn't just a "tool upgrade" — it's a **shift in the entire way of thinking** — from "passing data casually" to "designing a clear data flow."
:::

### 3.1 The Panorama of Evolution

The table below shows the four stages of component communication evolution, and you can see how problems are solved step by step:

| Stage | Communication Method | Typical Problems | Core Change |
|------|---------|----------|----------|
| **Stage 1: Free Passing** | Direct modification, global variables | Data out of sync, hard to debug | No conventions, pass data however you want |
| **Stage 2: Props/Events** | Standard parent-child component communication | Props Drilling (passing through layers) | Conventions established, but deep nesting is troublesome |
| **Stage 3: State Management Libraries** | Vuex/Redux/Pinia | Learning curve, boilerplate code | Centralized data management, easier debugging |
| **Stage 4: Modern Solutions** | Composables/Atomic state | Need to understand new concepts | More flexible, more concise |

<EventBusDemo />

::: tip 📊 What Can You See from This Table?
Let's interpret this table row by row:

**Stage 1 → Stage 2**: From "no conventions" to "having conventions." This is a qualitative leap — you start using standard props/events for communication, and the data flow becomes clear. But the cost is that when component hierarchies are deep, data has to be passed layer by layer, which is troublesome (this is Props Drilling).

**Stage 2 → Stage 3**: From "distributed management" to "centralized management." You start using state management libraries like Vuex/Redux, placing shared data in a global "store" where all components read from and write to it. This solves Props Drilling, but the learning curve increases.

**Stage 3 → Stage 4**: From "heavyweight" to "lightweight." New solutions (like Vue 3's Composition API, React's Hooks) make state management more flexible and concise. You no longer necessarily need a global store — you can compose small state units on demand.

**In summary**: Evolution is not just about "switching to better tools," but about **upgrading the entire way of thinking** — from casually passing data around to designing a clear data flow.
:::

### 3.2 Stage 1: Free Passing — The Beginning of Chaos

Why is it called "free passing"? Because at this stage, there are no conventions — data is passed however you want — global variables, direct modification, event buses flying everywhere.

**Typical Scenario: Cart data scattered everywhere**

```javascript
// Product detail page component
export default {
  data() {
    return {
      localCart: []  // Maintains its own copy of cart data
    }
  },
  methods: {
    addToCart(product) {
      this.localCart.push(product)
      // Attempting to sync to other components
      window.cart = this.localCart  // ❌ Global variable!
    }
  }
}

// Cart page component
export default {
  data() {
    return {
      cartItems: []  // Yet another copy of cart data
    }
  },
  mounted() {
    // Attempting to read from global variable
    this.cartItems = window.cart || []  // ❌ Unreliable!
  }
}

// Header navigation component
export default {
  data() {
    return {
      cartCount: 0  // A third copy of data!
    }
  },
  mounted() {
    // Polling to check for changes (how absurd)
    setInterval(() => {
      this.cartCount = window.cart?.length || 0
    }, 1000)  // ❌ Poor performance!
  }
}
```

**Characteristics of this stage:**
- ✅ **Pros**: Simple and direct, zero learning curve
- ❌ **Cons**: Data scattered, hard to sync, difficult to debug, complete mess

### 3.3 Stage 2: Props/Events — Establishing Conventions

The chaos of free passing made the team realize: **we need conventions.** So they started using the standard communication methods provided by the framework: props and events.

**Typical Scenario: Props Drilling**

```vue
<!-- Ancestor component: App.vue -->
<template>
  <div class="app">
    <!-- Passing user info layer by layer -->
    <Layout :user-name="userName" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Layout from './Layout.vue'

const userName = ref('Zhang San')
</script>
```

```vue
<!-- Middle layer: Layout.vue -->
<template>
  <div class="layout">
    <Header :user-name="userName" />  <!-- Just passing through, not using -->
    <Main>
      <Page :user-name="userName" />  <!-- Just passing through, not using -->
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
<!-- Where it's actually needed: Header.vue -->
<template>
  <header>
    <span>{{ userName }}</span>  <!-- Finally used! -->
  </header>
</template>

<script setup>
const props = defineProps({
  userName: String
})
</script>
```

**Characteristics of this stage:**
- ✅ **Pros**: Clear data flow, one-way, easy to understand
- ❌ **Cons**: Props Drilling (passing through layers is troublesome), cross-component communication is difficult

::: tip 🤔 What Is Props Drilling?
Props Drilling refers to: **data having to pass through many intermediate components, layer by layer, even though those intermediate components don't actually use the data.**

It's like delivering a package to someone on the fifth floor, but the rule says every floor must sign for it. People on floors one through four are just "relaying the package" — they don't need it, but they must participate. This is obviously troublesome.
:::

### 3.4 Stage 3: State Management Libraries — Centralized Management

The pain point of Props Drilling gave birth to state management libraries (Vuex, Redux, Pinia). Their core idea is: **place shared data in a global "store" where all components read from and write to it.**

**Typical Scenario: Managing a shopping cart with Pinia**

```javascript
// stores/cart.js - Global cart state
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // All cart data centralized here
  const items = ref([])

  // Computed property: item count
  const itemCount = computed(() =>
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  // Method: add item
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
<!-- Product detail page component -->
<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const addToCart = (product) => {
  cart.addItem(product)  // Direct call, no layer-by-layer passing needed
}
</script>
```

```vue
<!-- Header navigation component -->
<template>
  <header>
    <span>Cart ({{ cart.itemCount }})</span>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Direct read, auto-synced
</script>
```

**Characteristics of this stage:**
- ✅ **Pros**: Centralized data management, solves Props Drilling, powerful debugging tools
- ❌ **Cons**: Learning curve, requires extra code (boilerplate), may be over-engineering for simple projects

### 3.5 Stage 4: Modern Solutions — Flexibility and Simplicity

While state management libraries are powerful, they can be overkill — "using a cannon to kill a mosquito." For small to medium projects, more flexible and lightweight solutions have emerged.

**Typical Scenario: Reusing state logic with Composables/Hooks**

```javascript
// composables/useCart.js - Reusable cart logic
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
<!-- Using in any component -->
<script setup>
import { useCart } from '@/composables/useCart'

// Each call creates a new state instance
// Suitable for local state within a component
const { items, itemCount, addItem } = useCart()
</script>
```

**Characteristics of this stage:**
- ✅ **Pros**: Flexible, lightweight, composable, use on demand
- ❌ **Cons**: Requires understanding compositional thinking, cross-component sharing needs extra handling

---

## 4. State Management Libraries in Depth: Vuex vs Pinia vs Redux

::: tip 🤔 How to Choose a State Management Library?
Facing different state management libraries, you might be confused: which one should you choose?

There's actually no "best" library, only the "most suitable" one. Consider these factors when choosing:
- **What framework are you using?** Vue uses Pinia, React uses Redux/Zustand
- **How large is the project?** Small projects use Composables, large projects use state management libraries
- **Team experience?** Choose what the team is familiar with, or what has a low learning curve

The following content will detail the characteristics and use cases of mainstream state management libraries.
:::

### 4.1 Comparison of Mainstream State Management Libraries

| Feature | Redux | Vuex | Pinia | Zustand |
| :--- | :--- | :--- | :--- | :--- |
| **Target Framework** | React | Vue | Vue | React |
| **Learning Curve** | Steep | Moderate | Gentle | Gentle |
| **Boilerplate Code** | Much | Moderate | Little | Very Little |
| **TypeScript** | Good | Good | Excellent | Excellent |
| **Debugging Tools** | Powerful | Good | Excellent | Good |
| **Use Case** | Large projects | Vue 2/3 medium-large projects | New Vue 3 projects | React small-medium projects |

::: tip 📊 What Can You See from This Table?
Let's interpret this table row by row:

**Redux**: The veteran state management library in the React ecosystem. Its strengths are strict conventions and powerful debugging tools, but its weaknesses are lots of boilerplate code and a steep learning curve. Suitable for large projects and teams that need strict conventions.

**Vuex**: The official state management library from the Vue 2 era. Its design philosophy is similar to Redux, but more aligned with Vue's reactivity system. It can still be used today, but new projects are recommended to use Pinia.

**Pinia**: The new-generation state management library officially recommended for Vue 3. Clean syntax, good TypeScript support, low learning curve. **This is the first choice for Vue 3 projects.**

**Zustand**: A lightweight state management library in the React ecosystem. Minimal API, almost no boilerplate code. Suitable for small to medium React projects.
:::

<StateManagementComparisonDemo />

### 4.2 Pinia in Practice: The Recommended Choice for Vue 3

Pinia is the state management library officially recommended by the Vue team, designed specifically for Vue 3. It is simpler and easier to use than Vuex.

**Why is it called Pinia?**

Pinia means "pineapple" in Spanish. A pineapple is a fruit composed of many small flowers — each flower is independent, yet together they form a unified whole. This perfectly captures Pinia's design philosophy — **each store is independent, but they can be composed together.**

**Core Concepts:**

::: details View Complete Code Example
```javascript
// stores/user.js - User state management
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1. State: store data
  const userInfo = ref(null)
  const isLoggedIn = computed(() => !!userInfo.value)

  // 2. Actions: methods to modify data
  const login = async (username, password) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    const user = await response.json()
    userInfo.value = user  // Direct modification, Pinia handles reactivity
  }

  const logout = () => {
    userInfo.value = null
  }

  // 3. Getters: computed properties
  const displayName = computed(() => {
    return userInfo.value?.name || 'Guest'
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

**Using in Components:**

```vue
<template>
  <div class="user-panel">
    <span v-if="user.isLoggedIn">Welcome, {{ user.displayName }}</span>
    <button v-if="user.isLoggedIn" @click="user.logout">Log Out</button>
    <button v-else @click="showLoginDialog">Log In</button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

// Directly get the store, everything is reactive
const user = useUserStore()

const showLoginDialog = () => {
  // Show login dialog...
}
</script>
```

**Advantages of Pinia:**

| Advantage | Description | Compared to Vuex |
|------|------|----------|
| **Clean API** | No need for mutations, directly modify state | Vuex requires separating mutations and actions |
| **TypeScript Friendly** | Native type inference, no extra configuration needed | Vuex requires complex type definitions |
| **Auto-Modularization** | Each store file automatically becomes a module | Vuex requires manual namespaced configuration |
| **Smaller Bundle** | ~1KB after bundling | Vuex ~3KB |

<VuexPiniaDemo />

### 4.3 Redux in Practice: The Classic Choice for React

Redux is the most classic state management library in the React ecosystem, known for its strict one-way data flow.

**Why is it called Redux?**

Redux is short for "Reduced Flux." Flux was an application architecture pattern proposed by Facebook early on, and Redux simplified Flux's concepts, hence the name "Reduced Flux."

**Core Principles:**

1. **Single Source of Truth**: The entire application's state is stored in a single object tree
2. **State is Read-Only**: The only way to change state is by dispatching an action
3. **Changes Are Made with Pure Functions**: Reducers must be pure functions

::: details View Complete Code Example
```javascript
// 1. Define Action Types
const ADD_TODO = 'ADD_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'

// 2. Define Action Creators
const addTodo = (text) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
})

const toggleTodo = (id) => ({
  type: TOGGLE_TODO,
  payload: { id }
})

// 3. Define Reducer (pure function)
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

// 4. Create Store
import { createStore } from 'redux'
const store = createStore(todoReducer)
```
:::

**Using in React:**

```jsx
import { useSelector, useDispatch } from 'react-redux'

function TodoList() {
  // Read state
  const todos = useSelector(state => state.todos)

  // Get dispatch function
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

**Pros and Cons of Redux:**

| Pros | Cons |
| :--- | :--- |
| Strict data flow, easy to debug | Lots of boilerplate code, steep learning curve |
| Time-travel debugging | Simple state also requires writing lots of code |
| Rich middleware ecosystem | Not suitable for small projects |
| Predictable state updates | Requires understanding functional programming concepts |

<ReduxFlowDemo />

<MobxReactivityDemo />

<ZustandJotaiDemo />

---

## 5. Practical Guide: Approach to designing State Management

::: tip 🤔 When Do You Need a State Management Library?
Not every project needs a state management library. Before introducing one, ask yourself a few questions:

1. **How many components need to share this data?**
   - If only 2-3 components, props/events are sufficient
   - If 5+ components, consider a state management library

2. **Does this data change frequently?**
   - If it rarely changes (e.g., user info), use Provide/Inject
   - If it changes frequently (e.g., shopping cart), use a state management library

3. **How large is the team?**
   - Individual or small team: simple solutions are fine
   - Large team: need strict conventions and powerful debugging tools

**Remember: start simple, upgrade as needed.**
:::

### 5.1 Principles of State Design

Regardless of which state management solution you choose, you should follow these principles:

**Principle 1: Single Source of Truth**

The same piece of data should only be stored in one place. Don't define duplicate data in multiple components.

```javascript
// ❌ Wrong: data scattered everywhere
const ProductDetail = { cart: [] }
const CartPage = { items: [] }
const Header = { count: 0 }

// ✅ Correct: data centralized
const cartStore = { items: [] }  // The single source of truth
```

**Principle 2: Immutability**

When modifying state, create new objects instead of directly mutating the original.

```javascript
// ❌ Wrong: direct mutation
state.items.push(newItem)

// ✅ Correct: create new object
state.items = [...state.items, newItem]
```

**Principle 3: State Lifted Up, Events Passed Down**

Shared state should be placed in the nearest common ancestor component or global store, not scattered across child components.

```vue
<!-- ❌ Wrong: state in child component -->
<Parent>
  <Child :data="childData" @update="childData = $event" />
</Parent>

<!-- ✅ Correct: state in parent component -->
<Parent>
  <Child :data="parentData" @update="parentData = $event" />
</Parent>
```

### 5.2 Practical Case Study: E-Commerce Cart State Design

Let's synthesize everything we've learned so far to design a state management solution for an e-commerce shopping cart.

**Requirements Analysis:**

- Product list page can add items to the cart
- Cart page can view, modify quantity, and delete items
- Header navigation displays cart item count
- Support selecting/deselecting items, calculating total price of selected items
- Data persistence to localStorage

**State Design (Pinia):**

```javascript
// stores/cart.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ============ State ============
  const items = ref([])  // Cart item list
  const selectedIds = ref([])  // Selected item IDs

  // Restore data from localStorage
  const initFromStorage = () => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        items.value = data.items || []
        selectedIds.value = data.selectedIds || []
      } catch (e) {
        console.error('Failed to read cart data:', e)
      }
    }
  }

  // Persist to localStorage
  const persist = () => {
    localStorage.setItem('cart', JSON.stringify({
      items: items.value,
      selectedIds: selectedIds.value
    }))
  }

  // ============ Getters (Computed Properties) ============
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

  // ============ Actions (Methods) ============
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

  // Initialize
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

**Using in Components:**

```vue
<!-- Product detail page: ProductDetail.vue -->
<template>
  <div class="product-detail">
    <h2>{{ product.name }}</h2>
    <p class="price">¥{{ product.price }}</p>
    <button @click="addToCart">Add to Cart</button>
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
<!-- Header navigation: Header.vue -->
<template>
  <header class="header">
    <div class="logo">My Store</div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/cart">
        Cart ({{ cart.itemCount }})
      </RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()  // Use directly, auto-reacts to changes
</script>
```

---

## 6. Common Pitfalls and How to Avoid Them

::: warning ⚠️ These Pitfalls — 90% of Beginners Fall Into Them
In the practice of state management, some mistakes are especially common. Let me summarize the most common pitfalls and how to avoid them.
:::

### 6.1 Pitfall 1: Directly Modifying Props or State

**Wrong Code:**

```javascript
// ❌ Directly modifying props
props.user.name = 'Li Si'

// ❌ Directly modifying Vuex state
store.state.user.name = 'Li Si'

// ❌ Directly modifying array elements
state.items[0].name = 'New Name'
```

**Why is this wrong?**

Frontend frameworks (Vue/React) need to "track" data changes to automatically update the UI. If you directly mutate objects or arrays, the framework may not detect the change, causing the UI not to update.

**Correct Approach:**

```javascript
// ✅ Vue 3 / Pinia: directly modify top-level properties
store.user.name = 'Li Si'  // Pinia handles reactivity automatically

// ✅ Vue 2 / Vuex: through mutation
mutations: {
  UPDATE_USER_NAME(state, newName) {
    state.user.name = newName
  }
}

// ✅ Modifying arrays: create new array
state.items = state.items.map((item, index) =>
  index === 0 ? { ...item, name: 'New Name' } : item
)
```

### 6.2 Pitfall 2: Modifying State Inside a Getter

**Wrong Code:**

```javascript
// ❌ Modifying state inside a getter
getters: {
  doubleCount(state) {
    state.count *= 2  // Side effect!
    return state.count
  }
}
```

**Why is this wrong?**

Getters should be "pure functions" — they should only compute and return values, without any side effects (modifying state). If you modify state inside a getter, it can cause infinite loops and hard-to-debug issues.

**Correct Approach:**

```javascript
// ✅ Getter only computes, doesn't modify
getters: {
  doubleCount(state) {
    return state.count * 2
  }
}

// ✅ If you need to modify, use an action
actions: {
  doubleCountAndSave({ commit }) {
    commit('SET_DOUBLE_COUNT')
  }
}
```

### 6.3 Pitfall 3: Forgetting to Clean Up Event Listeners

**Wrong Code:**

```javascript
// ❌ Forgetting to unsubscribe
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  }
  // Component destroyed, but listener is still there!
}
```

**Why is this wrong?**

If a component is destroyed but the event listener remains, it causes a memory leak (occupied memory cannot be freed). In single-page applications, as users continuously switch pages, these uncleaned listeners accumulate, eventually causing the page to lag.

**Correct Approach:**

```javascript
// ✅ Unsubscribe promptly
export default {
  created() {
    EventBus.$on('cart-updated', this.handleCartUpdate)
  },
  beforeUnmount() {  // Vue 3 uses beforeUnmount, Vue 2 uses beforeDestroy
    EventBus.$off('cart-updated', this.handleCartUpdate)
  }
}
```

### 6.4 Pitfall 4: Overusing State Management

**Wrong Code:**

```javascript
// ❌ Putting all state into the store
const store = useStore()
store.inputValue = 'user input'
store.isModalOpen = true
store.currentTab = 'profile'
```

**Why is this wrong?**

Not all state needs to go into a global store. If a piece of state is only used in one component (e.g., input field value, modal open/close), keeping it inside the component is fine. Overusing state management makes the code more complex.

**Correct Approach:**

```javascript
// ✅ Local state managed within the component
const inputValue = ref('')

// ✅ Only shared state goes into the store
const userInfo = useUserStore()  // Multiple components need user info
const cart = useCartStore()  // Multiple components need cart data
```

---

## 7. Summary and Suggestions

### 7.1 Core Knowledge Review

Let's use a table to review the core concepts of componentization and state management:

| Concept | One-Line Explanation | Problem Solved | Typical Tools |
|------|-----------|-----------|----------|
| **Componentization** | Break the UI into independent, reusable parts | Code reuse, separation of concerns | Vue/React components |
| **Props** | Parent component passes data to child component | Parent-child communication | Vue/React built-in |
| **Events** | Child component notifies parent of what happened | Child-parent communication | Vue/React built-in |
| **State** | Data stored inside a component | Remembering component state | Vue/React built-in |
| **State Management Library** | Centralized management of global shared state | Cross-component communication, Props Drilling | Pinia, Redux, Zustand |
| **Single Source of Truth** | Same data stored in only one place | Data inconsistency, sync difficulties | Core principle of state management libraries |

### 7.2 Recommendations for Different Scenarios

| Scenario | Recommended Solution | Reason |
| :--- | :--- | :--- |
| **Parent-child component communication** | Props + Events | Built into the framework, simple and direct |
| **Cross-level value passing** | Provide / Inject | Avoids passing through layers |
| **Local state within a component** | ref / useState | Simple, no extra tools needed |
| **Medium Vue project** | Pinia | Officially recommended, low learning curve |
| **Medium React project** | Zustand | Minimal, no boilerplate code |
| **Large Vue project** | Pinia + conventions | Flexible and scalable |
| **Large React project** | Redux Toolkit | Strict conventions, rich ecosystem |
| **Cross-component logic reuse** | Composable / Hooks | Flexible, composable |

### 7.3 Learning Suggestions

**For Beginners:**

1. **Master the basics first**: Understand fundamental concepts like props, events, and state
2. **Start with small projects**: Don't jump straight into state management libraries
3. **Write more code**: No amount of theory beats hands-on practice

**For Advanced Learners:**

1. **Read source code**: Understand how Pinia/Redux work under the hood
2. **Learn patterns**: Understand common design patterns (e.g., Observer pattern, Publish-Subscribe pattern)
3. **Follow the ecosystem**: Learn related tools (e.g., DevTools, middleware)

**Remember These Core Principles:**

1. **Start simple**: Don't introduce complex state management libraries prematurely
2. **Single source of truth**: Avoid storing the same data in multiple places
3. **Immutability**: Create new objects when modifying state, rather than mutating directly
4. **Choose based on needs**: Select the appropriate solution based on project scale and team situation

We hope this article helps you build a comprehensive understanding of componentization and state management. When you encounter complex data flow problems in real projects, you'll know where to start, how to design, and how to implement.
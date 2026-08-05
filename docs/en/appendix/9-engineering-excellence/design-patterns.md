# Fundamentals of Design Patterns

::: tip Preface
**Why is your code always "works but messy"?** You may have encountered this: when requirements change, the code needs major rewrites; you want to reuse a piece of logic but find it tangled with other code. Design patterns are "code organization recipes" summarized by predecessors to help you write flexible, maintainable code.

This chapter helps you understand the most practical design patterns — not memorizing them by rote, but understanding "which pattern for which scenario."
:::

**What will you learn in this article?**

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | What are design patterns | The essence and classification of patterns |
| **Chapter 2** | Creational patterns | How to elegantly create objects |
| **Chapter 3** | Structural patterns | How to organize code structure |
| **Chapter 4** | Behavioral patterns | How to manage interactions between objects |

After reading this chapter, you will master the most commonly used design patterns and be able to identify applicable scenarios and apply them flexibly in real projects.

---

## 0. The Big Picture: The Essence of Design Patterns

Imagine you're learning to cook. You can figure everything out from scratch each time, or you can learn classic recipes — recipes don't limit your creativity; they let you stand on the shoulders of those who came before. Design patterns are the "classic recipes" of the programming world.

::: tip The Value of Design Patterns
- **Common Language**: Say "use the Observer pattern here" and the team immediately understands your design intent
- **Experience Reuse**: No need to step into the same traps others already fell into
- **Flexible Extension**: Good patterns allow code to adapt to changes with minor modifications rather than major rewrites
:::

Use the interactive component below to browse the classification and uses of common design patterns:

<DesignPatternCatalogDemo />

---

## 1. Creational Patterns: How to Elegantly Create Objects

### 1.1 Singleton Pattern

**Scenario**: Only one instance is needed globally, such as a configuration manager, logger, or database connection pool.

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

// No matter how many times you call it, it's always the same instance
const a = ConfigManager.getInstance()
const b = ConfigManager.getInstance()
console.log(a === b) // true
```

### 1.2 Factory Pattern

**Scenario**: Creating different types of objects based on different conditions, where the caller doesn't need to know the specific creation details.

```javascript
function createNotification(type, message) {
  switch (type) {
    case 'email':
      return { send: () => console.log(`Send email: ${message}`) }
    case 'sms':
      return { send: () => console.log(`Send SMS: ${message}`) }
    case 'push':
      return { send: () => console.log(`Push notification: ${message}`) }
    default:
      throw new Error(`Unknown notification type: ${type}`)
  }
}

// The caller doesn't care about the specific implementation
const notification = createNotification('email', 'Hello')
notification.send()
```

---

## 2. Structural Patterns: How to Organize Code Structure

### 2.1 Adapter Pattern

**Scenario**: Two interfaces are incompatible and need a "converter plug." For example, the data format returned by an old API doesn't match what a new component expects.

```javascript
// Format returned by the old API
const oldApi = {
  getUserInfo: () => ({ user_name: 'Zhang San', user_age: 25 })
}

// Adapter: convert to new format
function adaptUser(oldUser) {
  return { name: oldUser.user_name, age: oldUser.user_age }
}

const user = adaptUser(oldApi.getUserInfo())
// { name: 'Zhang San', age: 25 }
```

### 2.2 Decorator Pattern

**Scenario**: Adding new functionality to an object without modifying the original code. Like putting a case on your phone — the phone's functionality stays the same, but you gain protection.

```javascript
// Basic log function
function log(message) {
  console.log(message)
}

// Decorator: add timestamp
function withTimestamp(fn) {
  return (message) => fn(`[${new Date().toISOString()}] ${message}`)
}

// Decorator: add log level
function withLevel(fn, level) {
  return (message) => fn(`[${level}] ${message}`)
}

const enhancedLog = withTimestamp(withLevel(log, 'INFO'))
enhancedLog('Service started successfully')
// [2025-01-15T10:30:00.000Z] [INFO] Service started successfully
```

---

## 3. Behavioral Patterns: How to Manage Interactions Between Objects

### 3.1 Observer Pattern

**Scenario**: When one object's state changes, other objects need to be automatically notified. For example, after a user places an order, you need to simultaneously send an email, deduct inventory, and log the event.

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
bus.on('order:created', (order) => console.log('Send confirmation email', order.id))
bus.on('order:created', (order) => console.log('Deduct inventory', order.id))
bus.emit('order:created', { id: 'ORD-001' })
```

### 3.2 Strategy Pattern

**Scenario**: The same operation has multiple algorithms/strategies that need to be switched at runtime. For example, different sorting methods or different pricing rules.

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

Use the interactive component below to try out the effects of different design patterns:

<PatternPlaygroundDemo />

---

## 4. Approach to choosing a Design Pattern

| Problem You Encounter | Recommended Pattern | Core Idea |
|-------------|---------|---------|
| Only one global instance needed | Singleton | Control instance count |
| Create different objects based on conditions | Factory | Encapsulate creation logic |
| Incompatible interfaces need conversion | Adapter | Wrap with a conversion layer |
| Dynamically add functionality | Decorator | Layer-by-layer enhancement |
| State changes need to notify multiple parties | Observer | Publish-subscribe decoupling |
| Multiple algorithms need runtime switching | Strategy | Encapsulate algorithms as objects |

::: tip Core Principle
Design patterns are not "the more the better." **Over-engineering** is just as bad as **no design**. Only use patterns where flexibility is genuinely needed; solve simple problems with simple solutions. Remember the KISS principle: Keep It Simple, Stupid.
:::

---

## 5. AI-Powered: Using LLMs to Learn and Apply Design Patterns

LLMs can help you identify scenarios suitable for design patterns in your code and provide specific refactoring solutions.

### 5.1 Identifying Applicable Patterns

> **Prompt**:
> ```
> Analyze the following code and determine if there are opportunities
> to improve it with design patterns.
> If so, please explain:
> 1. Problems with the current code
> 2. Which design pattern is recommended
> 3. Refactored code example
> 4. Why this pattern fits this scenario
>
> [Paste your code]
> ```

### 5.2 Learning Patterns with Concrete Scenarios

> **Prompt**:
> ```
> Using a "food delivery ordering system" as a real scenario,
> demonstrate the application of these design patterns:
> - Factory Pattern: creating different types of orders
> - Observer Pattern: order status change notifications
> - Strategy Pattern: different delivery fee calculation rules
>
> Use JavaScript code examples. For each pattern, first show the
> problem without the pattern, then show the improvement with it.
> ```

### 5.3 Judging Over-Engineering

> **Prompt**:
> ```
> Review the following code and determine if there is over-engineering.
> Are there unnecessary abstractions, unused design patterns,
> or premature optimizations?
> If so, suggest how to simplify, following the KISS principle.
>
> [Paste your code]
> ```

::: tip AI Usage Advice
Having AI explain design patterns using business scenarios you're familiar with is much more effective than reading abstract UML diagrams. But remember: AI may tend to recommend more complex solutions — you need to judge for yourself whether they're truly necessary.
:::

---

## 6. Summary

1. **Creational Patterns**: Solve "how to create objects" problems, making the creation process more flexible
2. **Structural Patterns**: Solve "how to organize code" problems, making the structure clearer
3. **Behavioral Patterns**: Solve "how objects interact" problems, enabling looser coupling
4. **Flexible Application**: Choose based on actual scenarios — don't use patterns just for the sake of using them

::: tip Final Thought
The essence of design patterns is **managing change**. Good design makes the changing parts easy to modify while keeping the stable parts unchanged. When writing code, ask yourself: "If requirements change, how many places would I need to modify?" — if the answer is "many places," you might need a design pattern to help.
:::

---

## Further Reading

- **Classic Book**: GoF's *Design Patterns: Elements of Reusable Object-Oriented Software* is the foundational work on design patterns.
- **Modern Perspective**: Many patterns become more concise in JavaScript thanks to language features (closures, higher-order functions).
- **Practical Advice**: Understand the problem first, then consider patterns. Don't hold a hammer looking for nails.
- **Advanced Learning**: Learn the SOLID principles — they are the guiding philosophy behind design patterns.

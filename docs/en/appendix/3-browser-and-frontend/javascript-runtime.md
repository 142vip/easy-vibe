# Principles of JavaScript Runtime

::: tip Preface
You've already learned JavaScript basics, but have you ever wondered:
- Where exactly does your code run?
- Why does the same code behave differently in the browser versus Node.js?
- Why does code sometimes "freeze up," while at other times it seems to run "in parallel"?

This article will take you deep into the JavaScript runtime environment, including the event loop, call stack, memory management, and more. After reading this, you'll understand why code executes in a particular order, quickly locate async-related bugs, optimize code performance, and avoid memory leaks.
:::

**What will you learn in this article?**

| Chapter | Content | What you'll be able to do |
|-----|------|-----------|
| **Chapter 1** | Runtime overview | Understand where JavaScript code runs |
| **Chapter 2** | Browser runtime | Know what Web APIs the browser provides |
| **Chapter 3** | Node.js runtime | Understand the server-side JavaScript environment |
| **Chapter 4** | Event loop deep dive | Master the execution order of macrotasks and microtasks |
| **Chapter 5** | Call stack and memory | Understand code execution and memory management |
| **Chapter 6** | Practical tips | Optimize performance and debug memory leaks |

---

## 1. Runtime Overview

::: tip 🤔 Core Question
**What is a "runtime"?** JavaScript is just a language — why does the same code behave differently in different environments?
:::

### 1.1 Overview of a Runtime

**Runtime = JavaScript Engine + Environment-provided APIs**

If JavaScript is the "programming language," then the runtime is the "operating system" — it determines what your code can and cannot do.

```
┌─────────────────────────────────────┐
│         JavaScript Code             │
├─────────────────────────────────────┤
│      JavaScript Engine (V8)         │  ← Responsible for parsing and executing code
├─────────────────────────────────────┤
│      Runtime Environment (Browser/Node.js) │  ← Provides additional capabilities
└─────────────────────────────────────┘
```

**An analogy: JavaScript is "Mandarin," the runtime is the "city"**

- JavaScript syntax (Mandarin) is the same everywhere
- But different cities provide different facilities:
  - Browser = has DOM, window, fetch (like a city with malls, libraries)
  - Node.js = has fs, http, path (like a city with factories, highways)

### 1.2 Two Mainstream Runtimes

| Feature | Browser | Node.js |
|------|--------|---------|
| **Primary use** | Web interaction, user interfaces | Server-side applications, CLI tools |
| **Global object** | `window` | `global` |
| **DOM API** | ✅ Supported | ❌ Not supported |
| **File system** | ❌ Limited | ✅ Full support |
| **Module system** | ES Modules | CommonJS + ES Modules |
| **Timers** | `setTimeout`, `setInterval` | `setTimeout`, `setInterval` |
| **Network requests** | `fetch`, `XMLHttpRequest` | `http`, `https` modules |

👇 **Try it out**: Compare the environment differences between the browser and Node.js

<RuntimeEnvironmentDemo />

::: info 💡 Core Takeaway
The runtime determines which APIs you can use. DOM APIs available in the browser won't work in Node.js; file APIs available in Node.js won't work in the browser. That's why some code needs "environment detection."
:::

---

## 2. Browser Runtime

::: tip 🤔 Core Question
**What capabilities does the browser provide for JavaScript to manipulate web pages?**
:::

### 2.1 Components of the Browser Runtime

```
┌─────────────────────────────────────────────┐
│            JavaScript Engine                │
│            (V8 / SpiderMonkey)              │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│              Web APIs                        │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   DOM   │ │   BOM    │ │ Network  │     │
│  │Manipulate│ │Manipulate│ │ Network  │     │
│  │   pages  │ │ browser  │ │ requests │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Event Loop                        │
│     Coordinates code execution, event       │
│     handling, and task scheduling            │
└─────────────────────────────────────────────┘
```

### 2.2 Three Categories of Web APIs

**1. DOM API - Manipulate page content**

```javascript
// Find elements
const title = document.querySelector('h1')

// Modify content
title.textContent = 'New Title'

// Add styles
title.style.color = 'red'
```

**2. BOM API - Manipulate the browser**

```javascript
// Page navigation
window.location.href = 'https://example.com'

// Browser storage
localStorage.setItem('key', 'value')

// Browser history
history.back()
```

**3. Network API - Network requests**

```javascript
// Send HTTP request
fetch('/api/data')
  .then(response => response.json())
  .then(data => console.log(data))
```

### 2.3 Browser-Specific Event Mechanism

One of the most powerful features of the browser runtime is "event-driven" programming — code doesn't need to run continuously, but executes when the user performs actions.

```javascript
button.addEventListener('click', () => {
  console.log('Button was clicked')
})
```

**Common event types:**

| Event type | When triggered | Practical scenario |
|---------|---------|---------|
| `click` | Mouse click | Button interaction |
| `input` | Input field content changes | Real-time search |
| `scroll` | Page scrolling | Lazy loading |
| `load` | Resource finished loading | Initialize data |
| `error` | Error occurred | Error handling |

---

## 3. Node.js Runtime

::: tip 🤔 Core Question
**What enables JavaScript to run on the server side?**
:::

### 3.1 Components of Node.js

```
┌─────────────────────────────────────────────┐
│            JavaScript Engine                │
│                 (V8)                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           Node.js Built-in Modules           │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐     │
│  │   fs    │ │   http   │ │   path   │     │
│  │  File   │ │  HTTP    │ │  Path    │     │
│  │operations│ │  server  │ │ handling │     │
│  └─────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          libuv Event Loop Library           │
│      Cross-platform async I/O support       │
└─────────────────────────────────────────────┘
```

### 3.2 Node.js-Specific Capabilities

**1. File System Operations**

```javascript
const fs = require('fs')

// Read file
fs.readFile('./data.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// Write file
fs.writeFile('./output.txt', 'Hello', (err) => {
  if (err) throw err
  console.log('Write successful')
})
```

**2. HTTP Server**

```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('<h1>Hello World</h1>')
})

server.listen(3000)
```

**3. Module System**

```javascript
// CommonJS (Node.js default)
const fs = require('fs')
module.exports = { myFunction }

// ES Modules (modern approach)
import fs from 'fs'
export { myFunction }
```

### 3.3 Browser vs Node.js Comparison

| Feature | Browser | Node.js |
|------|--------|---------|
| **Entry file** | HTML file | JavaScript file |
| **Global objects** | `window`, `document` | `global`, `process` |
| **Module loading** | `<script>` tags | `require()` / `import` |
| **Security** | Sandbox environment, restricted | Can access system resources |
| **Use case** | User interfaces | Backend services, tools |

---

## 4. Event Loop Deep Dive

::: tip 🤔 Core Question
**JavaScript is single-threaded — how does it achieve "non-blocking" behavior?**
:::

### 4.1 Overview of the Event Loop

**Event Loop = JavaScript's "task scheduling center"**

JavaScript is single-threaded and can only do one thing at a time. But the event loop makes it appear to do many things "simultaneously."

**Core mechanism:**

1. **Execute synchronous code** (call stack)
2. **Process asynchronous tasks** (task queues)
3. **Wait for new tasks** (loop continuously)

```
Call Stack                 Task Queue
┌─────────┐              ┌──────────┐
│ Task 1  │              │ Macro 1  │
│ Task 2  │ ←──────────── │ Macro 2  │
│ Task 3  │   After one    │ Macro 3  │
└─────────┘   completes,   └──────────┘
      ↓        take next         ↑
      └──────────────────────────┘
         Event loop checks continuously
```

### 4.2 Macrotasks vs Microtasks

This is the concept most easily confused in interviews and actual development!

**Macrotasks:**
- `setTimeout`, `setInterval`
- I/O operations
- UI rendering

**Microtasks:**
- `Promise.then`
- `MutationObserver`
- `queueMicrotask`

**Execution order: Synchronous code → Microtasks → Macrotasks**

👇 **Try it out**: Observe the execution order of macrotasks and microtasks

<TaskQueueDemo />

### 4.3 Classic Interview Question

```javascript
console.log('1')

setTimeout(() => console.log('2'), 0)

Promise.resolve().then(() => console.log('3'))

console.log('4')

// Output: 1, 4, 3, 2
```

**Why this order?**

1. Execute synchronous code: `console.log('1')`, `console.log('4')` → outputs 1, 4
2. Check microtask queue: `Promise.then` → outputs 3
3. Check macrotask queue: `setTimeout` → outputs 2

::: info 💡 Practical Tips
- If you want code to execute as soon as possible, use microtasks (`Promise.then`)
- If you want delayed execution, use macrotasks (`setTimeout`)
- Never mix too many async operations, or you'll fall into "callback hell"
:::

---

## 5. Call Stack and Memory

::: tip 🤔 Core Question
**How is code executed? Where are variables stored? When are they garbage collected?**
:::

### 5.1 Call Stack: The "Footprint" of Function Execution

**Call stack = A "notebook" that records function calls**

Every time you call a function, a new record is added to the stack; when the function finishes, the record is removed.

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  console.log('Execution complete')
}

a()
```

**Call stack changes:**

```
Step 1: Call a()
┌─────────┐
│    a    │
└─────────┘

Step 2: a() calls b()
┌─────────┐
│    b    │
│    a    │
└─────────┘

Step 3: b() calls c()
┌─────────┐
│    c    │
│    b    │
│    a    │
└─────────┘

Step 4: c() completes, pop in order
┌─────────┐
│    b    │
│    a    │
└─────────┘
```

👇 **Try it out**: Observe the call stack changes

<CallStackDemo />

### 5.2 Memory Management: Placement of the Garbage Go

JavaScript has an "automatic garbage collection" mechanism — you don't need to manually free memory; the engine does it for you.

**Garbage collection principle: Mark-and-Sweep algorithm**

1. **Mark phase**: Starting from "roots," find all reachable variables
2. **Sweep phase**: Unmarked variables are "garbage" and will be collected

```javascript
// Garbage collection example
let obj1 = { name: 'Object 1' }
let obj2 = { name: 'Object 2' }

// obj1 is reassigned, the original object loses its reference
obj1 = null  // The original { name: 'Object 1' } will be collected

// obj2 is still in use, won't be collected
console.log(obj2.name)
```

👇 **Try it out**: Observe the garbage collection process

<GarbageCollectionDemo />

### 5.3 Memory Leaks: The Consequences of Forgetting to Clean Up

**Memory leak = Memory that should be freed isn't freed, accumulating over time**

Common causes:

**1. Too many global variables**

```javascript
// ❌ Wrong: Global variables won't be collected
globalCache = []

function addItem(item) {
  globalCache.push(item)
}
```

**2. Event listeners not removed**

```javascript
// ❌ Wrong: Listener not removed
button.addEventListener('click', handleClick)

// ✅ Correct: Remove listener when no longer needed
button.removeEventListener('click', handleClick)
```

**3. Closures referencing large objects**

```javascript
// ❌ Wrong: Closure keeps referencing large object, won't be collected
function createHandler() {
  const bigData = new Array(1000000).fill('data')
  return function() {
    console.log('Processing')
  }
}

const handler = createHandler()  // bigData persists in memory
```

👇 **Try it out**: Observe how memory leaks occur

<MemoryLeakDemo />

::: info 💡 Practical Tips
- **Regular checks**: Open browser DevTools → Memory → Take Heap Snapshot to view memory usage
- **Avoid global variables**: Use `const` and `let`, not `var`
- **Clean up promptly**: Remove event listeners and timers when done
- **Weak references**: Use `WeakMap` and `WeakSet` to store object references
:::

---

## 6. Practical Tips

::: tip 🤔 Core Question
**How do you write high-performance JavaScript code? How do you debug problems?**
:::

### 6.1 Performance Optimization Tips

**1. Reduce reflows and repaints**

```javascript
// ❌ Wrong: Triggers reflow on every loop iteration
for (let i = 0; i < 1000; i++) {
  element.style.top = i + 'px'
}

// ✅ Correct: Batch modification
element.style.transform = `translateY(${position}px)`
```

**2. Use event delegation**

```javascript
// ❌ Wrong: Add listener to every button
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick)
})

// ✅ Correct: Add only one listener to parent element
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e)
  }
})
```

**3. Debounce and throttle**

```javascript
// Debounce: Execute after user stops typing
function debounce(fn, delay) {
  let timer
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: Limit execution frequency
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

### 6.2 Debugging Tips

**1. View call stack with DevTools**

```javascript
function a() {
  b()
}

function b() {
  c()
}

function c() {
  debugger  // Pause here to view call stack
}

a()
```

**2. Trace execution path with `console.trace()`**

```javascript
function trackExecution() {
  console.trace('Execution path')
  // Will output the complete call stack
}
```

**3. Analyze performance with the Performance API**

```javascript
performance.mark('start')

// Execute some code
for (let i = 0; i < 10000; i++) {
  // ...
}

performance.mark('end')
performance.measure('Loop performance', 'start', 'end')

const measure = performance.getEntriesByName('Loop performance')[0]
console.log(`Execution time: ${measure.duration}ms`)
```

### 6.3 Common Problems Quick Reference

| Problem | Possible cause | Solution |
|------|---------|---------|
| **High memory usage** | Memory leak, too much caching | Check global variables, remove listeners |
| **Page stuttering** | Long tasks blocking main thread | Split tasks, use Web Workers |
| **Events not firing** | Listener not bound, element doesn't exist | Check DOM loading timing |
| **Async order incorrect** | Mixing macrotasks and microtasks | Use Promise or async/await consistently |
| **Timer inaccuracy** | Main thread blocked | Use Web Workers or requestAnimationFrame |

---

## Summary

You should now be able to understand:

- **Runtime = Engine + Environment APIs** — different runtimes provide different capabilities
- **Event loop** coordinates the execution order of synchronous code, microtasks, and macrotasks
- **Call stack** records the function execution process — **stack overflow** occurs from too-deep recursion
- **Garbage collection** automatically cleans up unused variables, but watch out for **memory leaks**
- **Performance optimization** hinges on reducing reflows/repaints and using async appropriately

::: info 💡 When encountering problems, tell your AI this way
- "This function executes too slowly, help me optimize the performance"
- "Memory usage keeps growing, might be a memory leak, help me check"
- "Async operations are in the wrong order — should be A then B, but A and B start almost simultaneously"
- "Event listener isn't firing, check if the element has already been loaded into the DOM"
:::

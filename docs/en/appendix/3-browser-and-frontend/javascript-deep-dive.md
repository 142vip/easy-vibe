# Principles of JavaScript

::: tip Foreword
By now you've learned HTML and CSS and can make decent-looking web pages. But you might have noticed: buttons don't respond to clicks, forms can't be submitted, and the page feels like a "static" picture.

That's why we need JavaScript — it brings web pages to life. Click a button to open a menu, type to search in real time, scroll to load more content… these interactive effects all rely on JavaScript.

In vibecoding, AI writes most of the code for you. But you at least need to be able to read what the code is doing, otherwise you won't catch it when AI gets things wrong. After reading this article, you'll be able to:

- Understand what AI-generated code is doing
- Spot where the code has problems
- Tell AI exactly how to fix it in clear, precise language
:::

**What will this article teach you?**

| Chapter | Content | What You'll Be Able to Do |
|-----|------|-----------|
| **Chapter 1** | What JavaScript is | Understand its role in a web page |
| **Chapter 2** | Data and Variables | Know how programs store and use information |
| **Chapter 3** | Functions and Logic | Read code that makes decisions, loops, and reuses logic |
| **Chapter 4** | DOM and Events | Know how code controls the page and responds to user actions |
| **Chapter 5** | Practical Skills | How to read AI code and describe errors precisely |

Each chapter starts from "being able to recognize code" — you don't need to write it by hand. Whenever you encounter code you don't understand, come back and use this as a reference.

---

## 1. What Is JavaScript

::: tip 🤔 Core Question
**Why do web pages need JavaScript?** HTML and CSS already give pages content and styling — why learn yet another language?
:::

### 1.1 From "Static Pages" to "Dynamic Applications"

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📄 Web Pages Without JavaScript**
- Content is fixed, no interaction
- Clicking buttons does nothing
- Filling out forms goes nowhere
- Page never updates automatically

*Like a paper poster — you can only look at it*

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Web Pages With JavaScript**
- Click a button to open a menu
- Type to search in real time
- Scroll to auto-load more content
- Data updates and displays live

*Like a real application*

</div>
</div>

**Understanding the relationship between the three in one sentence:**

| Technology | Analogy | Role |
|------|------|------|
| **HTML** | Skeleton | Defines the structure and content of the page |
| **CSS** | Skin | Defines the appearance and styling of the page |
| **JavaScript** | Muscles and nervous system | Makes the page responsive, interactive, and capable of logic |

### 1.2 Motivation for Vibecodinging Also Require Understanding JavaScript

::: warning A New Developer's Pitfall
A developer new to JavaScript used AI to build a "counter" app: click a button, and the number increases by 1. The AI-generated code worked fine.

But they wanted to change it to "increase by 2 on each click" and told the AI: "Make each click add 2." The AI modified the code, but the number still only increased by 1.

They asked the AI why it didn't work, and the AI gave an explanation — but they couldn't understand what `count = count + 1` meant in the code, or whether the AI had even changed the right place. All they could do was keep saying "adding 2 doesn't work," and the AI churned out several more versions — some changed the initial value to 2, others added 2 in completely unrelated places.

Finally, after reading Chapter 2's concept of "variables," they understood that `count = count + 1` means taking the value of count, adding 1, and storing it back. Then they told the AI: "Change `count + 1` to `count + 2`."

It worked on the first try.

**This is why you need to understand JavaScript — not to write code by hand, but so that when the AI doesn't get it right, you can spot the problem at a glance and describe it in one precise sentence.**
:::

### 1.3 A Sneak Peek: Real AI-Generated Code

Before diving deep, let's look at a real piece of AI-generated code. Don't worry about understanding it all — just get a general impression. We'll explain each part later.

**Scenario**: Build a "click a button to switch background color" feature

```javascript
// Define a set of colors
const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
let currentIndex = 0

// Find the button on the page
const button = document.querySelector('#changeBtn')

// Add a click event to the button
button.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % colors.length
  document.body.style.backgroundColor = colors[currentIndex]
})
```

**What does this code do?**

| Code | Purpose | See Chapter |
|------|------|----------|
| `const colors = [...]` | Define a set of color data | Chapter 2: Arrays |
| `let currentIndex = 0` | Track which color is currently shown | Chapter 2: Variables |
| `document.querySelector(...)` | Find the button on the page | Chapter 4: DOM Lookup |
| `button.addEventListener(...)` | Add a click event to the button | Chapter 4: Event Listeners |
| `() => {...}` | Define the code to run when clicked | Chapter 3: Arrow Functions |

::: info 💡 Key Insight
You don't need to understand every line of code right now. Just remember: **JavaScript code is a series of instructions that tell the browser "when the user does something, here's what should happen."**
:::

---

## 2. Data: Variables and Data Types

::: tip 🤔 Core Question
**How does a program "remember" things?** User input, data fetched from servers, intermediate results during computation — where is all this information stored?
:::

### 2.1 Variables: Giving Data a Name

**A variable is like a labeled box** — you can put data inside it and later retrieve it by the label.

```javascript
const name = "Zhang San"   // This name won't change, use const
let age = 25                // Age might change, use let
```

**Why distinguish between const and let?**

Think of it this way: your ID number (const) will never change in your lifetime, but your age (let) changes every year. JavaScript lets you use different keywords to express this intent of "changeable vs. unchangeable."

| Keyword | Can Be Reassigned | When to Use | Example |
|--------|---------|----------|------|
| `const` | ❌ No | Data that won't change | ID number, config values, color lists |
| `let` | ✅ Yes | Data that changes | Counters, currently selected item, user input |

::: details 🔍 A Concrete Example
```javascript
// Using const: these values won't change
const PI = 3.14159
const MAX_USERS = 100
const APP_NAME = "TodoList"

// Using let: these values will change
let count = 0
count = 1  // ✅ Can be reassigned

count = count + 1  // ✅ Can compute based on the original value

// What happens if you use const?
const fixedCount = 0
fixedCount = 1  // ❌ Error! const can't be reassigned
```
:::

👇 **Try it yourself**: Modify the code below to see the difference between const and let

<VariableBoxDemo />

### 2.2 Data Types: The Kinds of "Things" in JavaScript

JavaScript categorizes data into several types. The three most commonly used are:

| Type | Description | Example | Real-World Scenario |
|------|------|------|----------|
| `string` | Text content | `"hello"`, `'你好'` | Usernames, product descriptions, tooltips |
| `number` | Numeric values | `42`, `3.14` | Prices, quantities, ratings |
| `boolean` | Yes/no values | `true`, `false` | Logged in, completed, visible |

**Two special values worth knowing:**

- `undefined` → A variable has been declared but not yet assigned a value
- `null` → Intentionally set to empty (meaning "there is no value here")

::: details 🔍 Template Literals: A More Convenient Way to Concatenate Text
In AI-generated code, you'll often see strings wrapped in backticks (`` ` ``) with `${...}` inside them:

```javascript
const name = "Zhang San"
const age = 25

// Traditional approach (cumbersome)
const message = "I'm " + name + ", " + age + " years old"

// Template literal (concise)
const message = `I'm ${name}, ${age} years old`
// Result: "I'm Zhang San, 25 years old"
```

**Recognition tip**: When you see backticks and `${}`, you know variables are being inserted into text.
:::

### 2.3 Objects and Arrays: Organizing Data

**Object = a set of named properties** (like a personal information card)

```javascript
const user = {
  name: "Zhang San",
  age: 25,
  isVIP: true
}

// Use dot notation to access properties
console.log(user.name)    // "Zhang San"
console.log(user.age)     // 25
```

**Array = an ordered collection of data** (like a list)

```javascript
const colors = ['Red', 'Green', 'Blue']

// Access by index (starting from 0)
console.log(colors[0])  // "Red"
console.log(colors[1])  // "Green"
```

**Nested structures: objects inside arrays, arrays inside objects**

This is the most common data structure in AI-generated code:

```javascript
const todos = [
  { id: 1, text: "Learn JavaScript", done: false },
  { id: 2, text: "Build a project", done: true },
  { id: 3, text: "Write documentation", done: false }
]

// Access: first take item 0 of the array, then its text property
console.log(todos[0].text)  // "Learn JavaScript"
```

::: info 💡 Recognition Tips
- See `{}` → This is an object, containing a set of `name: value` pairs
- See `[]` → This is an array, containing an ordered list of values
- See `data[0].name` → First take item 0 of the array, then its name property
:::

### 2.4 Value vs. Reference: A Common Pitfall

This is one of the most common issues beginners run into!

**Primitive types (string, number, boolean) assignment = copying a brand new piece of data:**

```javascript
let a = 10
let b = a      // b gets a copy of a
b = 20
console.log(a) // 10 (a is unaffected)
```

**Object and array assignment = copying the "address" (both point to the same thing):**

```javascript
let user1 = { name: "Zhang San" }
let user2 = user1      // user2 points to the same object
user2.name = "Li Si"   // modifying user2 affects user1
console.log(user1.name) // "Li Si" (user1 changed too!)
```

**Why create copies?**

In React/Vue, directly mutating data prevents the UI from updating. That's why you often see `[...array]` or `{...obj}` in AI code — it's creating a copy to avoid mutual interference.

```javascript
// Create a copy using the spread operator
const arr1 = [1, 2, 3]
const arr2 = [...arr1]     // Create a new array
arr2.push(4)
console.log(arr1)          // [1, 2, 3] (unaffected)
console.log(arr2)          // [1, 2, 3, 4]
```

👇 **Try it yourself**: Observe how the original data changes when you modify a copy

<ReferenceDemo />

### 2.5 Destructuring and Spread: Modern JavaScript Shortcuts

These two syntax patterns are everywhere in AI code — if you don't recognize them, you can't read the code.

**Destructuring assignment: quickly extract data from objects or arrays**

```javascript
const user = { name: "Zhang San", age: 25, city: "Beijing" }

// Traditional approach (cumbersome)
const name = user.name
const age = user.age

// Destructuring (concise)
const { name, age } = user
// Same result, but done in one line
```

**Spread operator: copy and extend data**

```javascript
// Copy an array and add new elements
const arr1 = [1, 2, 3]
const arr2 = [...arr1, 4, 5]  // [1, 2, 3, 4, 5]

// Copy an object and add new properties
const user1 = { name: "Zhang San", age: 25 }
const user2 = { ...user1, city: "Beijing" }
// { name: "Zhang San", age: 25, city: "Beijing" }
```

::: info 💡 Recognition Tips
- See `const { name, age } = person` → Extracting name and age from the person object
- See `...array` or `...obj` → Spreading/flattening the array or object
- You don't need to write these by hand, but you must be able to read them
:::

---

## 3. Logic: Functions and Flow Control

::: tip 🤔 Core Question
**How does code "make decisions" and "repeat tasks"?** Programs need to execute different operations based on conditions and repeat certain tasks — how is this logic expressed?
:::

### 3.1 Conditionals: If... Then... Otherwise...

**if/else: the most basic conditional**

```javascript
const age = 18

if (age >= 18) {
  console.log("Adult")
} else {
  console.log("Minor")
}
```

**Ternary operator: shorthand if/else**

```javascript
// Full form (4 lines)
let message
if (age >= 18) {
  message = "Adult"
} else {
  message = "Minor"
}

// Ternary operator (1 line)
const message = age >= 18 ? "Adult" : "Minor"
// Format: condition ? value_if_true : value_if_false
```

**&& short-circuit: common in React code**

```javascript
// Only show the user panel when isLoggedIn is true
isLoggedIn && <UserPanel />

// Equivalent to
if (isLoggedIn) {
  return <UserPanel />
}
```

::: info 💡 Recognition Tips
- See `? :` → This is the ternary operator, shorthand for if/else
- See `&&` → The part after && only executes if the part before it is true
:::

### 3.2 Functions: Packaging Operations

**Function = a recipe for a dish**

- Defining a function = writing down the recipe
- Calling a function = cooking according to the recipe
- Parameters = ingredients
- Return value = the finished dish

```javascript
// Define a function (write down the recipe)
function greet(name) {
  return "Hello " + name
}

// Call the function (cook according to the recipe)
console.log(greet("Zhang San"))  // "Hello Zhang San"
console.log(greet("Li Si"))      // "Hello Li Si"
```

**Three forms, recognizable at a glance:**

```javascript
// 1. function declaration (traditional)
function greet(name) {
  return "Hello " + name
}

// 2. Arrow function (most common in AI code)
const greet = (name) => {
  return "Hello " + name
}

// 3. Arrow function shorthand (when there's only one line)
const greet = (name) => "Hello " + name
```

👇 **Try it yourself**: Enter different names and see how the function works

<FunctionMachineDemo />

::: info 💡 Recognition Tips
- See `function` or `=>` → This is a function
- See `fn()` → This function is being called
- See `() => {}` → Arrow function, the mainstream style in modern JS
:::

### 3.3 Array Methods: Power Tools for Processing Lists

In React/Vue, almost every list rendering uses these methods.

```javascript
const todos = [
  { id: 1, text: "Study", done: false },
  { id: 2, text: "Work", done: true }
]

// .map(): transform each item in the array into something else
const texts = todos.map(todo => todo.text)
// ["Study", "Work"]

// .filter(): filter out items that match a condition
const unfinished = todos.filter(todo => !todo.done)
// [{ id: 1, text: "Study", done: false }]

// .find(): find the first item that matches a condition
const found = todos.find(todo => todo.id === 1)
// { id: 1, text: "Study", done: false }
```

::: info 💡 Recognition Tips
- See `.map()` → Transforming an array, returns a new array
- See `.filter()` → Filtering an array
- See `items.map(item => <li>{item.name}</li>)` → Turning each data item into a list element
:::

### 3.4 Scope: The "Visibility Range" of Variables

**Use the "room" analogy:**

- Variables inside a function are like things in a room — invisible from outside
- But people inside the room can see things in the hallway (outer scope)

```javascript
const global = "Global variable"  // Something in the hallway

function room() {
  const local = "Something in the room"  // Something in the room
  console.log(global)  // ✅ Can see the hallway
}

console.log(local)  // ❌ Error! Can't see into the room from outside
```

**Core intuition:** Where code is written determines what variables it can see.

👇 **Try it yourself**: Click on different scopes to see which variables are accessible

<ScopeDemo />

### 3.5 Closures: Functions "Remember" the Environment They Were Born In

**Don't treat this as an isolated concept — understand it from a concrete scenario:**

```javascript
function setupCounter() {
  let count = 0  // This variable is inside the function

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

**Core intuition:** When a function is created, it "remembers" the variables around it, even after the outer function has finished executing.

👇 **Try it yourself**: Observe how closures let functions "remember" state

<ClosureDemo />

### 3.6 this: Whoever Calls the Function

**No complex binding rules — just the most common scenarios:**

**Scenario 1: In an object's method, this points to that object**

```javascript
const user = {
  name: "Zhang San",
  sayHi() {
    console.log("Hello, I'm " + this.name)  // this points to user
  }
}
user.sayHi()  // "Hello, I'm Zhang San"
```

**Scenario 2: In event listeners, this points to the element that fired the event**

```javascript
button.addEventListener('click', function() {
  console.log(this)  // this points to the button element
})

// But arrow functions don't change this
button.addEventListener('click', () => {
  console.log(this)  // this points to the outer this
})
```

::: info 💡 What to Do When You Run Into Problems?
If a this-related bug appears in AI code (e.g., `Cannot read property of undefined`), tell the AI: "The this binding in this method is wrong — switch to an arrow function or use bind."
:::

---

## 4. Interaction: DOM, Events, and Asynchrony

::: tip 🤔 Core Question
**How does JavaScript "interact" with a web page?** How do you find elements on the page? How do you respond to user clicks and input? How do you fetch data from a server?
:::

### 4.1 DOM: How JavaScript Sees a Web Page

In JavaScript's view, a web page is a "tree," and every HTML tag is a "node" on that tree.

```html
<html>
  <body>
    <h1>Title</h1>
    <p>Paragraph</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
    </ul>
  </body>
</html>
```

**JS controlling the page = finding nodes + modifying nodes + creating/deleting nodes**

👇 **Try it yourself**: Click on nodes to see how the DOM tree is organized

<DOMTreeDemo />

### 4.2 Finding and Modifying Elements

**Finding elements:**

```javascript
// Find by CSS selector (most common)
const title = document.querySelector('h1')      // Find the first h1
const button = document.querySelector('#btn')   // Find the element with id="btn"
const items = document.querySelectorAll('.item') // Find all elements with class="item"
```

**Modifying elements:**

```javascript
// Change text
title.textContent = "New Title"

// Change styles
element.style.color = "red"
element.style.fontSize = "20px"

// Change CSS classes
element.classList.add('active')      // Add a class
element.classList.remove('hidden')   // Remove a class
element.classList.toggle('open')     // Toggle a class (add if absent, remove if present)
```

::: info 💡 Recognition Tips
- See `document.querySelector` → Looking up a page element
- See `.textContent` → Changing text
- See `.style.xxx` → Changing styles
- See `.classList.add/remove/toggle` → Changing CSS classes
:::

### 4.3 Events: When the User Does Something...

**addEventListener: add an event listener to an element**

```javascript
button.addEventListener('click', () => {
  console.log("Button was clicked")
})
```

**Common events:**

| Event | Trigger | Real-World Scenario |
|------|---------|----------|
| `click` | Clicking | Button clicks, link navigation |
| `input` | Input field content changes | Real-time search, form validation |
| `submit` | Form submission | Login, registration, submitting data |
| `scroll` | Scrolling the page | Lazy loading, back-to-top button |

**Event object: getting more information**

```javascript
input.addEventListener('input', (e) => {
  console.log(e.target.value)  // Get the input field's value
  e.preventDefault()            // Prevent default behavior (e.g., page refresh on form submit)
})
```

::: info 💡 Practical Application
When you want to add functionality to a button, you're essentially telling the AI: "Add a click event to this button, and execute X operation when clicked."
:::

### 4.4 Asynchrony: Why Some Operations Don't Complete Immediately

**Restaurant analogy:**

After ordering, you don't have to stand at the kitchen door waiting — you can do other things, and the server will bring the food when it's ready.

**Most common scenario: fetching data from a server**

```javascript
// Synchronous approach (blocks the page — don't use)
const data = fetch('/api/data')  // ❌ Writing it this way will block

// Asynchronous approach (correct)
async function loadData() {
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Error:', error)
  }
}
```

**async/await syntax:**

- `async` → Marks this function as containing asynchronous operations
- `await` → Wait for this operation to complete (without blocking the page)
- `try/catch` → Handle potential errors

👇 **Try it yourself**: Observe the execution order of asynchronous operations

<AsyncRestaurantDemo />

::: info 💡 Recognition Tips
- See `async/await` → Waiting for a time-consuming operation
- See `fetch()` → Fetching data from a server
- See `try/catch` → Handling potential errors
:::

### 4.5 Event Loop: How JavaScript Actually Works

**No jargon like "microtasks/macrotasks" — understand it with a simple model:**

**JS is a "single-person workstation"** — it can only do one thing at a time, but it has a "sticky note board" (task queue).

When it encounters an operation that requires waiting (network requests, timers), JS doesn't just wait idly — instead, it sticks a note about "what to do when this is ready" onto the board and continues executing. Only when the current work is done does it check the board.

```javascript
console.log("1")

setTimeout(() => console.log("2"), 0)  // Even with 0ms delay, it gets deferred

console.log("3")

// Output: 1, 3, 2 (not 1, 2, 3!)
```

**Why?**
1. Execute `console.log("1")` → outputs 1
2. Encounter `setTimeout` → stick the callback on the board, continue
3. Execute `console.log("3")` → outputs 3
4. Current code is done, check the board
5. Execute the `setTimeout` callback → outputs 2

👇 **Try it yourself**: Observe the execution order of code

<JSEventLoopDemo />

::: info 💡 What to Do When You Run Into Problems?
If the page renders before data is fetched in AI code, tell the AI: "The data hasn't finished loading but the page is already rendering — add a loading state and only render once the data arrives."
:::

### 4.6 Modules: import and export

The first line of AI-generated React/Vue code is almost always `import`.

**import = bring in functionality from another file**

```javascript
// Import a function from a utility file
import { formatDate } from './utils'

// Import from a third-party package
import React from 'react'
import { useState } from 'react'
```

**export = expose functionality for others to use**

```javascript
// utils.js
export function formatDate(date) {
  // ...
}

// Or default export
export default function formatDate(date) {
  // ...
}
```

**npm packages = pre-built tools by others, use them after installing**

```javascript
// Install package: npm install lodash
// Use the package
import _ from 'lodash'
```

::: info 💡 Recognition Tips
- See `import` → Bringing in functionality from another file
- See `export` → Exposing functionality for others to use
- See `from 'react'` → Importing from the React package
- See `from './utils'` → Importing from a local file
:::

---

## 5. Practical Skills: Reading Code, Understanding Errors, Describing Precisely

::: tip 🤔 Core Question
**You've learned all this syntax — now how do you actually use it when you get AI-generated code?** How do you quickly read through code? What do you do when you encounter errors? How do you get AI to accurately fix your code?
:::

### 5.1 How to Read AI-Generated Code

**The four-step method:**

| Step | What to Look At | Example |
|------|--------|------|
| **Step 1: Overall structure** | How many functions? What does each do? | `loadData()` loads data, `renderList()` renders the list |
| **Step 2: Find the entry point** | Where does the program start executing? | `addEventListener('click', ...)` starts on click |
| **Step 3: Trace the data flow** | Where does data come from? Where does it go? | Fetch from API → parse → render to page |
| **Step 4: Examine the logic** | How does each function handle things? | Loops, conditionals, calculations |

**A complete "reading demo" using the code example from Chapter 1:**

```javascript
// Step 1: Overall structure
// - An array of colors
// - A variable tracking the current index
// - A click event on a button

// Step 2: Entry point
// button.addEventListener('click', ...) → executes when the button is clicked

// Step 3: Data flow
// colors (color array) → currentIndex (current index) → backgroundColor (background color)

// Step 4: Detailed logic
// currentIndex = (currentIndex + 1) % colors.length
// This formula means: increment by 1 each time, but cycle back when reaching the array length
```

### 5.2 Common Error Quick Reference

| Error | Plain English Explanation | How to Tell AI |
|------|-----------|-------------|
| `TypeError: Cannot read properties of undefined` | You're trying to access a property on something that doesn't exist | "Line X has an error — a certain variable is undefined, check its assignment logic" |
| `ReferenceError: xxx is not defined` | You used a variable name that hasn't been declared | "Variable xxx is not defined — check for typos or missing imports" |
| `TypeError: xxx is not a function` | You're calling something as a function that isn't one | "xxx is not a function — check its type and where it comes from" |
| `SyntaxError: Unexpected token` | Syntax error (mismatched brackets, missing comma, etc.) | "Line X has a syntax error — check brackets and punctuation" |
| `CORS error` | The browser blocked a cross-origin request | "Encountered a CORS error — need to configure cross-origin resource sharing" |
| `404 Not Found` | The requested resource doesn't exist | "The API returned 404 — check if the endpoint URL is correct" |

### 5.3 How to Describe Problems Precisely

The gap between beginners and experienced developers often comes down to the **precision of problem descriptions**.

| ❌ Poor Description | ✅ Good Description |
|-----------|-----------|
| "The code has a bug" | "When clicking the delete button, it deletes the last item instead of the current one" |
| "The styling is wrong" | "The title should be centered but it's currently left-aligned" |
| "The data won't display" | "The fetch request returns data (visible in the console), but the page isn't re-rendering" |
| "Add a feature" | "Add a search box to the user list page that filters the list in real-time as the user types, fuzzy-matching against the name field" |
| "Clicking does nothing" | "Clicking the button throws 'Cannot read property of undefined' in the console, error on line X" |

**A practical exercise:**

```javascript
// Buggy code
function deleteTodo(index) {
  todos.splice(index, 1)  // Always deletes the last item
}

// Observed behavior: no matter which delete button you click, it always deletes the last item
```

**❌ Poor description:** "The delete function has a bug"

**✅ Good description:** "When clicking the delete button, it deletes the last item instead of the current one. The code uses splice(index, 1), but the index might be incorrect. It should be changed to match deletion by each item's unique id."

### 5.4 What You Should Now Be Able to Recognize

- See `const/let` → Know whether a variable can be reassigned
- See `{}` → Object / See `[]` → Array
- See `{...obj}` or `[...arr]` → Creating a copy
- See `function` or `=>` → Defining a reusable block of operations
- See `if/else` or `? :` → Code is making a decision
- See `.map()` / `.filter()` → Transforming or filtering an array
- See `document.querySelector` → Looking up a page element
- See `addEventListener` → Listening for user actions
- See `async/await` → Waiting for a time-consuming operation
- See `import/export` → Importing or exporting modules
- Encounter an error → Can understand the gist and describe it precisely to AI

**If you carefully read the "deep dive" sections of each chapter, you've also grasped these core concepts:**

- **Value vs. Reference**: Primitives copy values, objects/arrays copy addresses
- **Scope and Closures**: Functions can "remember" the variables from where they were born
- **The Essence of this**: Depends on who calls the function, not where it's written
- **Event Loop**: JS is single-threaded and uses a task queue to stay "non-blocking"

These concepts will help you locate problems faster.

::: info 💡 When You Run Into Problems, Tell AI This
- "Line X throws error XXX — help me figure out what's wrong"
- "This function's logic is XXX, but the result is wrong — it should be XXX"
- "I want to modify the XXX feature — the specific requirements are XXX"
:::
# Principles of Frontend Frameworks

> **Learning Guide**: This article answers a fundamental question — **What exactly do frontend frameworks (Vue, React, Svelte, etc.) do?** If you've only learned HTML, CSS, and a bit of JavaScript, that's perfectly fine — we'll start from the very beginning.

Before we begin, make sure you know these two basic concepts. If you're unsure, you can check the corresponding chapters first:

- **HTML**: The skeleton of web pages, defining what elements are on the page (headings, paragraphs, buttons, images...). See [HTML and CSS Layout](./html-css-layout.md).
- **JavaScript**: The programming language that makes web pages "come alive," able to modify page content and respond to user actions. See [JavaScript Deep Dive](./javascript-deep-dive.md).

There's also one concept that will appear frequently later, so let's give it a complete explanation here.

### Overview of the DOM

DOM stands for Document Object Model.

When you open a web page in the browser, the first thing the browser does is read the HTML code. After reading it, the browser doesn't directly use the HTML text to display the page. Instead, it first **converts the HTML code into a tree structure** and stores it in memory. This tree is called the DOM tree.

Each node (Node) on the tree corresponds to an HTML tag. The nesting relationships between tags become parent-child relationships in the DOM tree.

👇 **Try it out**:
Hover your mouse over the HTML code on the left, and the corresponding node in the DOM tree on the right will be highlighted. It works the other way too. Each line of HTML tag corresponds to a node on the DOM tree.

<WhatIsDomDemo />

**Why understand the DOM?** Because the way JavaScript modifies pages is by manipulating this DOM tree — adding nodes, deleting nodes, modifying node content. And the core work that frontend frameworks do is help you automate these DOM operations. We'll mention the DOM repeatedly later — understanding it is the foundation for understanding framework principles.

---

## 0. Introduction: Overview of a "Frontend Framework"

First, let's explain the word "framework." In programming, a **Framework** is a set of pre-written code and rules that specifies how your code should be organized and run. You write code according to its conventions, and it handles a large amount of repetitive, tedious low-level work for you.

**Frontend frameworks** are frameworks specifically designed to help you **build web interfaces**. The most common ones today are Vue, React, Svelte, and Angular.

So what problems do they actually solve? These three cards summarize the core logic:

<FrameworkMotivationDemo />

Let's expand on this step by step, starting from the most basic questions.

---

## 1. The Core Question: Criteria for Data Changes, What Happens to the UI

### 1.1 First, Let's Clarify What "Data" and "UI" Are

In any web application, two things exist simultaneously:

- **Data (Data / State)**: Information stored internally by the program. For example, "the shopping cart has 3 items," "the username is Zhang San," "the 2nd tab is currently selected." This data exists in JavaScript variables, and users cannot see them.
- **UI (User Interface)**: What users see on the screen. For example, the page shows "Shopping Cart (3)", displays "Welcome, Zhang San", and the 2nd tab is highlighted. These are the visual effects presented by HTML elements.

**There's a correspondence between data and UI**: If the data is "3 items," the UI should display "3." If the data changes to "4 items," the UI should also change to "4."

The question is: **Who is responsible for this "following change" process?**

👇 **Try clicking**:
Click the "Add Item" button and notice: the data (left) has already changed, but the UI (right) hasn't updated along with it — they're "disconnected." Click "Sync UI" to manually fix it.

<DataUIGapDemo />

### 1.2 Motivation for Doning 't JavaScript Variable Changes Automatically Update the UI

This is the most confusing part for beginners, so let's explain the underlying principles step by step.

In JavaScript, a variable is simply a block of memory space used to store data. When you execute `count = count + 1`, the JavaScript engine does something very simple: changes the value of count in memory from 3 to 4. **Once this step is done, nothing else happens.**

The content displayed on the page (like the DOM node `<span>3</span>`) is stored in a completely different block of memory. When the JavaScript engine modifies a variable, it has no idea that a DOM node on the page is displaying that variable's value, and there's no mechanism for it to check.

So the fundamental reason is: **JavaScript variables and DOM nodes are two independent blocks of memory, with no automatic linkage mechanism between them.** Modifying a variable only changes the memory where the variable resides; the memory where the DOM node lives is not affected at all.

```javascript
let count = 3

// There's a DOM node on the page displaying count's value:
// <span id="counter">3</span>

count = 4
// What did the JavaScript engine do?
//   → Changed the value of variable count in memory from 3 to 4
//   → Done. That's it.
// The <span> on the page still shows "3"
```

If you want the display on the page to also become "4," you must **write extra code** to manually find that DOM node and then modify its content:

```javascript
count = 4  // Step 1: Change the variable

// Step 2: You must write this yourself — find the DOM node, change its text
document.getElementById('counter').textContent = count
```

If there are 5 places on the page displaying count's value (cart quantity, product list, total price, subtotal, status indicator), you need to write 5 such code blocks. **Miss any one, and that location will still show the old value — the user sees incorrect information.**

### 1.3 What Does the Framework Do Two Steps to Establish Automatic Connection


Frameworks can automatically sync, relying on **two coordinated steps** — neither can be missing.

**Step One: You "register" in the template which places should display this variable**

In the framework's HTML template, you use syntax like `{{ count }}` to mark "display count's value here":

```html
<!-- Vue template -->
<span>Shopping Cart: {{ count }} items</span>    <!-- Position A: I want to display count -->
<span>Total: ¥{{ count * 99 }}</span>   <!-- Position B: I also use count -->
<span>{{ count > 5 ? 'Too many' : 'Normal' }}</span>  <!-- Position C: I also use count -->
```

When the framework first renders the page, it records this "registration relationship": **Positions A, B, and C all depend on count**.

**Step Two: The framework monitors the variable and, when it changes, checks the registration table and updates automatically**

The framework uses JavaScript's built-in `Proxy` to "wrap" your variable, making it a "monitored variable." When you modify this variable, the Proxy quietly does something extra while assigning the value: it notifies the framework that "count changed." After receiving the notification, the framework checks the registration table from step one and updates all three positions A, B, and C.

```
Native JS:
  You write HTML → <span id="counter">3</span> (no connection to variable)
  You change variable → count = 4 → Done, no UI reaction
  You manually add → document.getElementById('counter').textContent = 4 → UI updates

Vue Framework:
  You write template → <span>{{ count }}</span> (framework remembers: this depends on count)
  You change variable → count = 4 → Proxy intercepts → notifies framework → framework checks registration table → auto-updates A/B/C
```

This is why "only frameworks can automatically sync" — there's fundamentally no connection between native HTML's `<span>` and JS variables. The framework's template syntax (`{{ }}`) is the key to establishing this connection. When you write `{{ count }}`, the framework knows this location should display count; only then can the framework precisely find and update it when count changes.

👇 **Try clicking**:
First select "Native JavaScript," click "Execute," and notice — the variable changed but the UI didn't budge; you need to manually sync each position step by step. Then switch to "Using Framework" and click "Execute" again — once the variable changes, the framework automatically completes all steps, and the UI immediately catches up.

<WhyNoAutoSyncDemo />

### 1.4 Comparison: Manual Sync vs. Auto Sync in Practice

After understanding the principles, let's see how significant the difference is between manual sync and auto sync in a slightly more complex scenario.

👇 **Try clicking**:
The left side shows the "manual sync" approach without a framework — for each display area, you need to click the "Sync" button separately to update. The right side shows the "auto sync" approach with a framework — you just click "Add Item," and all display areas update automatically. Try intentionally not syncing a certain area on the left to see what happens.

<ManualVsAutoSyncDemo />

**This is the fundamental reason frontend frameworks exist: to add the ability for JavaScript variables to "automatically notify the UI to update when modified," eliminating errors caused by manual synchronization.**

---

## 2. The Framework's Core Idea: Describing the UI with Data

### 2.1 The Difference Between Two Approaches

After understanding the value of "automatic sync," let's look at how frameworks specifically implement it.

In the pre-framework era (like using jQuery), code was written like this — you tell the browser step by step what to do:

```javascript
// Step 1: Find the element with id "counter" on the page
var element = document.getElementById('counter')
// Step 2: Change this element's text content to the new value
element.textContent = '4'
// Step 3: Find another element, change it too
document.getElementById('total').textContent = '¥396'
// Step 4: If quantity is greater than 5, also change the status indicator...
```

This approach is called **Imperative** — you're "commanding" the browser to execute operations step by step.

With a framework, code becomes like this — you only describe "what the UI should look like":

```html
<!-- I don't care how this value gets updated on the page -->
<!-- I'm just saying: this should display count's value -->
<span>{{ count }}</span>
<span>Total: ¥{{ count * 99 }}</span>
<span v-if="count > 5">Too many items!</span>
```

This approach is called **Declarative** — you're "declaring" the final state of the UI, and the framework handles how to reach that state.

### 2.2 Core Formula: UI = f(State)

All modern frontend frameworks — whether Vue, React, or Svelte — follow the same core idea, expressible as a formula:

> **UI = f(State)**

This formula means:

- **State**: Your application data. Those JavaScript variables: how many items are in the cart, whether the user is logged in, which page is current...
- **f (function)**: The framework's rendering mechanism. It knows how to turn data into UI.
- **UI**: The final result users see on screen.

**Meaning**: Given a set of data (State), after the framework's processing (f), you can deterministically get the corresponding UI. When data changes, the UI changes accordingly. Developers only need to care about data, not how the UI updates.

👇 **Try clicking**:
Modify the data (State) on the left and observe how the UI on the right automatically changes. This is the intuitive manifestation of `UI = f(State)`.

<DeclarativeFormulaDemo />

### 2.3 Motivation for Declarativing Better than Imperative

The advantage of declarative writing lies in:

| Comparison Dimension | Imperative (No Framework) | Declarative (With Framework) |
| :--- | :--- | :--- |
| **Code Volume** | Must write specific operation code for each update | Write template once, framework handles automatically |
| **Error Probability** | Easy to miss updating a location | Framework ensures all locations update |
| **Readability** | Code mixed with lots of DOM operations | Code clearly describes UI structure |
| **Maintenance Cost** | Changing one feature requires modifying many places | Just modify data logic, UI follows automatically |

Simply put: declarative lets you focus on "business logic" (how data changes) without worrying about the repetitive and error-prone task of "how to update the UI."

---

## 3. Reactivity System: Method for iting Framework Know Data Changed

### 3.1 Overview of "Reactivity"

Earlier we said "when data changes, the UI automatically updates." But there's a technical problem: **JavaScript itself doesn't have the ability to "automatically notify others when a variable is modified."**

When you write `count = 4`, JavaScript only changes count's value from 3 to 4 and doesn't automatically tell anyone. The framework needs a mechanism to "detect" when you've modified data.

**Reactivity** is the umbrella term for this mechanism: when data changes, the system can automatically sense the change and execute corresponding update operations.

### 3.2 Three Different Implementation Approaches

Different frameworks use different technical approaches to implement reactivity. This is also the most fundamental difference between Vue, React, and Svelte.

**Approach One: Proxy Interception (Vue's Approach)**

Vue uses JavaScript's built-in `Proxy` mechanism. `Proxy` can automatically execute code you specify when you read or modify an object's properties.

Vue wraps your data object with `Proxy`. When you execute `count = 4`, the `Proxy` intercepts this write operation and notifies Vue: "count's value has changed." Vue then updates all parts of the UI that use `count`.

As a developer, you don't need to do anything extra — just assign values directly, and Vue senses it automatically.

**Approach Two: Explicit Invocation (React's Approach)**

React doesn't use `Proxy`. It requires you to modify data through a dedicated function:

```javascript
// React's approach
const [count, setCount] = useState(0)

// Can't just write count = 4 (React won't sense it)
// Must call setCount:
setCount(4)
```

Only when you call `setCount()` does React know the data has changed and will update the UI. If you directly write `count = 4`, React has no idea, and the UI won't update.

This approach is more "explicit" — every data change is something you proactively tell the framework, preventing accidental updates.

**Approach Three: Compiler Analysis (Svelte's Approach)**

Svelte takes a completely different route. It has a Compiler that analyzes your source code before it runs.

When the compiler sees you've written an assignment like `count += 1`, it automatically inserts code after that line to "notify the UI to update." In other words, by the time the code runs, the "notification" action has already been pre-arranged by the compiler.

Your code looks like plain JavaScript assignment, but the compiled code contains additional UI update logic.

👇 **Try clicking**:
Select different framework tabs, click "Modify Data," and observe what steps each framework goes through "under the hood" to detect data changes and update the UI.

<ReactivityMechanismDemo />

### 3.3 Comparison of Three Approaches

| Comparison Dimension | Vue (Proxy) | React (Explicit Invocation) | Svelte (Compiler) |
| :--- | :--- | :--- | :--- |
| **Developer's Writing Style** | Direct assignment `count = 4` | Must use `setCount(4)` | Direct assignment `count = 4` |
| **When Changes are Detected** | Runtime automatic interception | Developer proactively notifies | Compiler pre-inserts notification code |
| **Runtime Performance Overhead** | Proxy has slight interception overhead | setState scheduling has slight overhead | Almost no additional overhead |
| **Debugging Difficulty** | Medium | Clear data flow, relatively easy | Need to understand compiled code |
| **Suitable Scenarios** | Pursuing development efficiency and natural syntax | Pursuing predictable data flow | Pursuing ultimate runtime performance |

None of the three approaches is absolutely better or worse. Vue is the most natural to write, React has the most controllable data flow, and Svelte has the best runtime performance. Which to choose depends on the project's specific needs.

---

## 4. Components: Breaking the UI into Reusable Small Pieces

### 4.1 Motivation for splitting

A complete web page might have a navigation bar, sidebar, content area, search box, user avatar, various buttons... If all the code is in one file, that file would become extremely long and very hard to maintain.

**Components** are about splitting the interface into independent small pieces, each managing its own data, its own UI, and its own logic.

For example, an e-commerce page can be split into these components:

- `NavBar` component: responsible for the top navigation bar
- `SearchBox` component: responsible for the search box
- `ProductCard` component: responsible for one product card
- `ShoppingCart` component: responsible for the shopping cart

Each component is independent. `ProductCard` doesn't need to know what code is in `NavBar` — it only needs to manage itself.

### 4.2 Three Benefits of Components

**Benefit One: Reuse.** Once a `ProductCard` component is written, it can be used 100 times on the page — each time you pass in different product data, it renders a different product card. No need to copy-paste 100 copies of HTML code.

**Benefit Two: Encapsulation.** The data and logic inside a component are independent. Modifying the `SearchBox` component's code won't affect the `ProductCard` component. When multiple people collaborate, different people can develop different components simultaneously without interfering with each other.

**Benefit Three: Maintainability.** When a feature has a problem, you can directly locate the corresponding component to fix it, rather than searching through a file with thousands of lines.

👇 **Try clicking**:
Click the component name on the left to see its corresponding area on the page. Notice that the same `ProductCard` component is reused multiple times, each time displaying different data.

<ComponentTreeDemo />

### 4.3 What Does a Component Look Like in Code

Taking Vue as an example, a component is a `.vue` file containing three parts:

```html
<!-- ProductCard.vue -->
<template>
  <!-- HTML structure here — the component's "appearance" -->
  <div class="card">
    <h3>{{ name }}</h3>
    <p>Price: ¥{{ price }}</p>
    <button @click="addToCart">Add to Cart</button>
  </div>
</template>

<script setup>
// JavaScript logic here — the component's "behavior"
const props = defineProps(['name', 'price'])

function addToCart() {
  // Handle "add to cart" logic
}
</script>

<style scoped>
/* CSS styles here — the component's "look" */
.card {
  border: 1px solid #ccc;
  padding: 16px;
}
</style>
```

When using this component, it's like using a custom HTML tag:

```html
<!-- Using the ProductCard component elsewhere -->
<ProductCard name="Wireless Earbuds" price="299" />
<ProductCard name="Mechanical Keyboard" price="599" />
<ProductCard name="Monitor" price="1999" />
```

Three lines of code render three different product cards.

---

## 5. The Cost of DOM Operations: Motivation for Frameworksing Try So Hard

### 5.1 Overview of DOM Operations

As mentioned earlier, the DOM is the tree structure generated after the browser parses HTML. **DOM operations** are using JavaScript to modify nodes on this tree. For example, changing text, adding an element, deleting an element, or modifying a style.

These operations themselves aren't complicated, but after executing DOM operations, the browser needs to do a lot of additional work to update the screen display:

1. **Recalculate Styles**: Do the CSS styles of this node and its children need to change?
2. **Layout (Reflow)**: The position and size of all elements on the page need to be recalculated. Because one element's change might affect other elements' positions.
3. **Repaint**: Paint the calculated content onto the screen.

Each of these steps has computational cost. If your code frequently triggers DOM operations, the browser will repeatedly execute these steps, and the page will become laggy.

👇 **Try clicking**:
Observe the time comparison between direct DOM operations and batch DOM operations. As the number of modifications increases, the "one-by-one operation" time rises sharply.

<DomOperationCostDemo />

### 5.2 Method for Frameworksing Solve This Problem

Since direct DOM operations are expensive, frameworks find ways to **reduce the number of DOM operations**. There are two specific strategies:

**Strategy One: Virtual DOM + Diffing (Vue and React's Approach)**

The Virtual DOM is a JavaScript object whose structure corresponds one-to-one with the real DOM tree, but it only exists in memory and doesn't trigger browser layout and painting.

When data changes, the framework's processing flow is:

1. Create a "new Virtual DOM tree" using JavaScript objects, describing what the UI should look like after data changes
2. Compare this new tree with the old tree (this process is called **Diff**), finding which nodes changed
3. Apply only the truly changed parts to the real DOM (this process is called **Patch**)

This way, no matter how data changes, the final operations on the real DOM are always minimal.

👇 **Try clicking**:
Click "Modify Data" and observe how the Virtual DOM compares the new and old trees to find changed nodes. Notice the "Real DOM" on the far right — only the truly changed parts flash.

<VirtualDomDiffDemo />

**Strategy Two: Compile-Time Precise Targeting (Svelte's Approach)**

Svelte doesn't use the Virtual DOM. Its compiler analyzes your code when you write it: "When `count` changes, the `<span>` on line 3 needs to be updated." At runtime, it directly targets that element for updating, completely without needing to compare new and old trees.

This approach skips the Diff step and is theoretically better performing. But it depends on the compiler's analytical ability — the compiler needs to be smart enough to correctly identify all places that need updating.

---

## 6. Runtime vs. Compile-Time: The Core Trade-off in Framework Design

### 6.1 Two Phases

Frontend code goes through two phases from when you write it to when it finally runs in the browser:

- **Compile-time (Build-time)**: Your source code is processed by build tools (like Vite, Webpack) and transformed into code the browser can execute directly. This process happens on your computer, before users open the web page.
- **Runtime**: The transformed code executes in the user's browser. The framework's core logic (like Virtual DOM Diff, reactivity tracking) works during this phase.

### 6.2 How Frameworks Distribute Work Across These Two Phases

Different frameworks distribute different amounts of work across these two phases, which determines their performance characteristics and bundle size:

- **React**: Most work is done at runtime. Virtual DOM creation, Diff, and Patch all happen in the browser. The advantage is high flexibility; the cost is needing to send the entire framework's runtime code (~40KB) to the browser.
- **Vue**: A hybrid approach. Templates are optimized at compile-time (the compiler marks which nodes are static and won't change), but the final UI updates still happen through the runtime Virtual DOM. Runtime code is approximately 30KB.
- **Svelte**: Most work is done at compile-time. The compiler analyzes your code and directly generates precise DOM update instructions. There's almost no framework code at runtime — the final bundle contains only your own business code. The smallest bundle size.

👇 **Try clicking**:
Click different framework tabs to see their position on the "Runtime ↔ Compile-time" spectrum, and their respective trade-offs in bundle size, runtime performance, and developer experience.

<FrameworkSpectrumDemo />

### 6.3 Industry Trends

In recent years, the direction of framework development has been clear: **move more and more work from runtime to compile-time.** Because compile-time computation doesn't consume user device resources and doesn't affect page load speed.

- **Vue** is developing Vapor Mode, which can skip the Virtual DOM and directly generate DOM operation code at compile-time
- **React** has introduced the React Compiler that automatically optimizes component re-rendering behavior at compile-time
- **Svelte 5** has introduced the Runes system, further enhancing compile-time analysis capabilities

---

## 7. Summary

Let's review the core points of this article:

**The fundamental problem frontend frameworks solve**: When data in an application changes, automatically, efficiently, and reliably update the UI, without requiring developers to manually operate the DOM.

**The core idea they all follow**: UI = f(State) — the UI is a function of data. Developers only need to focus on data changes, and the framework handles reflecting data changes to the UI.

**Their key technical differences**:

| Technical Point | Meaning |
| :--- | :--- |
| **Reactivity System** | How the framework detects data changes. Vue uses Proxy interception, React uses explicit setState, Svelte uses compiler analysis. |
| **Virtual DOM** | Vue and React use a JavaScript object to simulate the DOM tree, finding the minimal update by comparing new and old trees (Diff) to reduce real DOM operations. |
| **Componentization** | Breaking the UI into independent, reusable small pieces, each component managing its own data and UI. |
| **Compile-time Optimization** | Performing analysis and optimization in advance during the code build phase, reducing runtime computation. Svelte leads the way in this regard. |

**In one sentence**: The essential work of frontend frameworks is — taking over the "data to UI" synchronization process, letting developers only need to think about data logic, without needing to manually operate the UI.

---

## Glossary

| English Term | Chinese Translation | Explanation |
| :--- | :--- | :--- |
| **Framework** | 框架 | A set of pre-written code and rules that provides the foundational structure and common functionality for developers building applications. |
| **DOM** | Document Object Model | The tree data structure generated after the browser parses HTML, which JavaScript manipulates to modify the page. |
| **Virtual DOM** | Virtual DOM | Using JavaScript objects to simulate the DOM tree, finding the minimal update path through the Diff algorithm to reduce real DOM operations. |
| **State** | State | Data in the application, such as user information, shopping cart contents, current page state, etc. |
| **Reactivity** | Reactivity | When data changes, the system can automatically sense and execute corresponding UI update operations. |
| **Proxy** | Proxy | A built-in JavaScript mechanism that can intercept read and write operations on an object. Vue 3 uses it to implement reactivity. |
| **Component** | Component | An independent, reusable piece of UI code containing its own HTML structure, JavaScript logic, and CSS styles. |
| **Declarative** | Declarative | A programming style: you describe "what final result you want," and the framework decides how to implement it. |
| **Imperative** | Imperative | A programming style: you tell the program step by step "exactly what to do." |
| **Diff** | Diffing | Comparing new and old Virtual DOM trees to find which nodes have changed. |
| **Patch** | Patching | Applying the changes found by Diff to the real DOM. |
| **Compile-time** | Compile-time | The period when code is processed during the build phase, before users open the web page. |
| **Runtime** | Runtime | The period when code executes in the user's browser. |
| **Compiler** | Compiler | A program that transforms source code into another form of code. Svelte's compiler transforms `.svelte` files into efficient JavaScript. |


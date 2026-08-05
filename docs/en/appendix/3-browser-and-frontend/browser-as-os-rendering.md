# Principles of Browser Rendering
::: tip 🎯 Core Question
**Why are some web pages smooth as silk while others stutter like a slideshow?** How does the browser turn a pile of HTML, CSS, and JavaScript into the page you see? This chapter takes you inside the browser's "workshop" to understand its workflow so you can write higher-performance web pages.
:::

**What will this article teach you?**

| Chapter | Content | What You'll Be Able to Do |
|-----|------|-----------|
| **Chapter 1** | Why understand the rendering pipeline | Understand the necessity of performance optimization |
| **Chapter 2** | The five stages of the rendering pipeline | Master the basic browser rendering process |
| **Chapter 3** | Building the DOM tree and CSSOM tree | Understand how HTML and CSS are parsed |
| **Chapter 4** | Building the render tree | Know which elements get rendered |
| **Chapter 5** | Layout and reflow | Avoid triggering expensive layout calculations |
| **Chapter 6** | Paint and repaint | Reduce unnecessary paint operations |
| **Chapter 7** | Compositing and GPU acceleration | Leverage GPU to improve animation performance |
| **Chapter 8** | Event loop | Understand JavaScript's execution mechanism |
| **Chapter 9** | Performance optimization in practice | Master common performance optimization techniques |

Each chapter starts with "understanding the principles" — you don't need to hand-write optimization code. When you encounter performance issues, come back and reference this anytime.

---

## 1. Motivation for Understanding the "Rendering Pipeline"

### 1.1 From "It Works" to "It's Fast": The Advanced Path of Frontend Development

When you first learn frontend, you only care whether the code "works" — the page displays, buttons are clickable, and that's success. But as projects grow and users increase, you'll quickly face a harsh reality: **for the same functionality, some people's pages are buttery smooth, while others stutter so badly users want to throw their mouse.**

It's like learning to drive. Beginners only care about "can the car move," but experienced drivers care about "when to shift gears, when to brake, how to drive most efficiently." The browser is the "car" you're driving — understanding its "working habits" lets you drive fast and smooth.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐢 Beginner Mindset (Functionality Only)**
- As long as the page displays, it's fine
- Stuttering is the browser's problem
- Performance optimization is something to consider later

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Advanced Mindset (Experience Focused)**
- Smoothness is core to user experience
- Understand the browser's workflow
- Consider performance while writing code

</div>
</div>

**Understanding the rendering pipeline is the key step from "it works" to "it's fast."**

### 1.2 Case: "Optimization" Actually Making It Slower

::: warning Xiao Zhang's Performance Pitfall
Xiao Zhang is a frontend engineer at an e-commerce company, responsible for optimizing the product detail page. The page was horribly laggy when displaying product information, and user complaints kept pouring in.

Xiao Zhang thought: "The page is laggy probably because there are too many DOM elements. I'll hide them with `display:none` first, modify them, then show them again — that way the browser won't re-render repeatedly, right?"

So he wrote this code:

```javascript
// The "optimization" you thought you were doing
const container = document.getElementById('list')
container.style.display = 'none'  // Hide first — shouldn't trigger rendering, right?

for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Random width
  container.appendChild(item)
}

container.style.display = 'block'  // Show at the end, render once
```

After testing, the page was **even laggier**! Xiao Zhang was baffled: he had clearly "optimized" it, so why was it slower?

Later, the frontend lead looked at the code and pointed out the problem: **although the elements were hidden, each modification to `style.width` still triggered the browser's style recalculation and layout invalidation. The browser was doing a ton of useless work in the background.**

The correct approach is to use `DocumentFragment` to batch operations in memory, then insert into the DOM once, triggering only a single render.
:::

::: info 💡 Core Insight
Without understanding the browser's workflow, you might "cleverly" write a bunch of "optimization code" that actually makes performance worse. **Understanding the rendering pipeline tells you which operations are expensive and which are cheap, so you avoid putting effort in the wrong places.**
:::

---

## 2. Core Concept: Overview of the "Rendering Pipeline"

::: tip 🤔 What Is "Rendering"?
**Rendering**, simply put, is the process by which the browser "draws" code into the web page you see.

You can think of it like a **printing press producing a book**:
- **HTML** = the manuscript content (text, images, chapters)
- **CSS** = the typesetting requirements (font size, color, spacing)
- **JavaScript** = dynamic modifications (the author making last-minute edits, adjusting layout)

The browser takes these "materials" and passes them through a series of "processes" before finally "printing" the web page you see. This series of processes is the **Rendering Pipeline**.
:::

To help you understand better, let's use a **bakery** as an analogy for the browser's rendering process.

### 2.1 Understanding the Rendering Pipeline Through a Bakery Analogy

Imagine you're running a bakery, making various breads for customers every day. The stages involved in this process are strikingly similar to the browser's rendering pipeline:

| Stage | 🥖 Bakery Analogy | What the Browser Actually Does | Concrete Example |
|------|-------------|--------------|----------|
| **1. Prepare Ingredients** | Organize the ingredient list (flour, eggs, cream...) | **Build the DOM tree**: Parse HTML into a tree structure | You write `<div><p>Hello</p></div>`, the browser parses it into a `div→p→"Hello"` tree |
| **2. Prepare Recipes** | Organize recipe cards (ingredient ratios for each bread) | **Build the CSSOM tree**: Parse CSS into a tree of rules | You write `.title { color: red }`, the browser records "`.title` text is red" |
| **3. Make a Plan** | Based on ingredients and recipes, decide what breads to make today | **Build the render tree**: Merge DOM and CSSOM, keeping only visible elements | `<script>` tags don't display, so they're not in the render tree |
| **4. Arrange Positions** | Place breads in the display case, deciding where each one goes | **Layout**: Calculate the size and position of each element | Figure out "this div is 200px wide, 100px tall, at position (50, 50) on screen" |
| **5. Decorate** | Brush egg wash, sprinkle sesame seeds, pipe cream on breads | **Paint**: "Draw" elements' colors, borders, shadows, etc. onto the screen | Actually draw "red text" onto the screen |
| **6. Assemble** | Stack all bread layers together into a beautiful display | **Composite**: Merge multiple layers into the final image | GPU combines background layer, text layer, and image layer into one complete picture |

::: tip 📊 What Can You Learn From This Table?
Let's interpret this table row by row to understand each stage of the rendering pipeline:

**Stages 1-2 (Preparation)**: The browser first "understands" your code. HTML and CSS are parsed separately because they have different responsibilities — HTML determines "what content exists," CSS determines "how it looks."

**Stage 3 (Merging)**: Why "merge"? Because not all HTML elements are displayed (e.g., `<head>`, `<script>`), the browser needs to combine "visible elements" with "their styles" to form a "blueprint."

**Stages 4-5 (Drawing)**: Layout is "calculating positions," paint is "applying colors." Layout changes (e.g., changing width) trigger paint, but paint changes (e.g., changing color) don't trigger layout.

**Stage 6 (Compositing)**: The "magic" of modern browsers. The traditional approach is "draw everything at once" (CPU, slow), while the modern approach is "layer-based drawing + GPU compositing" (fast). This is why `transform` animations are smoother than `width` animations.
:::

### 2.2 The Five Stages of the Rendering Pipeline

<RenderingPipelineDemo />

---

## 3. Stage 1: Building the DOM Tree and CSSOM Tree

### 3.1 Motivation for the "Tree-ify"

::: tip 🤔 What Is the DOM?
**DOM (Document Object Model)** is a tree structure that the browser converts the HTML document into, making it easy for JavaScript to manipulate page elements.

You can think of it as a **family tree**:
- The top is the "ancestor" (`<html>`)
- Below are the "children" (`<body>`, `<head>`)
- Further down are the "grandchildren" (`<div>`, `<p>`, `<span>`)

**Why convert to a tree?** Because tree structures are great for "searching" and "modifying." For example, if you want to find "all elements with class `title`," the browser can quickly search the tree instead of slowly scanning through a mess of text.
:::

After the browser receives the HTML, it doesn't display it immediately — it first needs to "understand" it. This process has three steps:

**Step 1: Lexical Analysis — Breaking Code Into "Tokens"**

```html
<div class="container">
  <p>Hello World</p>
</div>
```

When the browser sees this code, it first "tokenizes":
- `<div>` → "start tag div"
- `class="container"` → "attribute class, value container"
- `<p>` → "start tag p"
- `Hello World` → "text content"
- `</p>` → "end tag p"
- `</div>` → "end tag div"

**Step 2: Syntactic Analysis — Assembling "Tokens" Into "Nodes"**

The browser assembles these "tokens" into "nodes" according to HTML rules:
- Element nodes: `<div>`, `<p>`
- Attribute nodes: `class="container"`
- Text nodes: `"Hello World"`

**Step 3: Building the Tree — Establishing "Parent-Child Relationships"**

Finally, the browser builds a tree structure based on tag nesting:

```
Document (document root node)
└── html
    └── body
        └── div.class = "container"
            └── p
                └── "Hello World"
```

### 3.2 The CSSOM Tree: The "Rulebook" for Styles

::: tip 🤔 What Is the CSSOM?
**CSSOM (CSS Object Model)** is a tree structure that the browser converts CSS rules into, used to calculate the final style of each element.

You can think of it as a **wardrobe styling guide**:
- Upper-level rules (body font) affect lower levels (all child elements)
- If there are conflicts (e.g., multiple rules specify different colors for the same element), they're resolved by "specificity"
- Ultimately, it calculates what "clothes" each element should wear
:::

The CSSOM construction process is similar to the DOM, but with one key difference: **CSS is "inherited" and "cascading."**

::: details View CSSOM Construction Process
**Original CSS:**
```css
body {
  font-size: 16px;
  color: #333;
}

.container {
  width: 100%;
  color: red;  /* will override body's color */
}

.container p {
  font-weight: bold;
}
```

**Constructed CSSOM Tree:**
```
StyleSheet
├── body
│   ├── font-size: 16px
│   └── color: #333
└── .container
    ├── width: 100%
    ├── color: red  (higher specificity, overrides body's color)
    └── p
        └── font-weight: bold
```
:::

### 3.3 Case: My CSS "Take Effect"

**Pitfall 1: CSS Selector Specificity Conflicts**

::: details View Common Mistakes
```css
/* The CSS you wrote */
#header { color: red; }      /* id selector, specificity 100 */
.title { color: blue; }     /* class selector, specificity 10 */

/* HTML */
<div id="header" class="title">What color is this text?</div>
```

You thought it would be blue, but it's **red**. Because the id selector's specificity (100) is higher than the class selector's (10).
:::

**Pitfall 2: Unclosed HTML Tags — The Browser "Auto-Repairs"**

::: details View How the Browser Fixes Malformed HTML
```html
<!-- The HTML you wrote -->
<div>
  <p>This is some text
</div>

<!-- After the browser fixes it -->
<div>
  <p>This is some text</p>  <!-- Browser automatically closes the tag for you -->
</div>
```

The browser is very "forgiving" and will automatically fix your errors. But this tolerance comes at a cost — the browser needs extra computation to guess your intent, **which affects performance**.
:::

<DomToRenderTreeDemo />

---

## 4. Stage 2: Building the Render Tree

### 4.1 Motivation for needing a "Render Tree"

You might ask: **"We already have the DOM tree and CSSOM tree, why build yet another render tree? Can't we just use the DOM directly?"**

The answer is: **the DOM tree contains too much "useless" information.**

For example, consider this HTML:

```html
<html>
<head>
  <title>Page Title</title>
  <style>/* CSS code */</style>
  <script>/* JavaScript code */</script>
</head>
<body>
  <div class="container">
    <p>Visible content</p>
  </div>
  <div style="display: none">
    <p>Hidden content (display:none)</p>
  </div>
</body>
</html>
```

**The DOM tree includes all elements**:
- `<head>`, `<title>`, `<style>`, `<script>` (these don't display)
- The `display: none` div (also doesn't display)

But **the render tree only includes elements that "need to be drawn on screen"**:
- Removes `<head>` and its children
- Removes the `display: none` div

### 4.2 Render Tree Construction Rules

When building the render tree, the browser follows a set of rules:

| Scenario | Handling | Example | Performance Impact |
|------|---------|------|----------|
| `display: none` | **Completely excluded** from render tree | Element and its children are all invisible | ✅ Reduces rendering workload |
| `visibility: hidden` | **Included in render tree**, but not painted | Occupies space, but fully transparent | ⚠️ Still requires layout calculation |
| `opacity: 0` | **Included in render tree**, but transparent | Interactive (clickable), but invisible | ⚠️ Still requires layout calculation |
| Outside viewport | **Included in render tree**, not painted yet | Painted only when scrolled into view | ⚠️ But still in the render tree |

::: tip 📊 What Can You Learn From This Table?
**Key finding**: `display: none` is the only hiding method that "truly saves performance," because the element is completely absent from the render tree, and the browser won't do any layout or paint work for it.

In contrast, `visibility: hidden` and `opacity: 0` are "invisible" but still in the render tree, so the browser still needs to calculate their layout (they occupy space). If you need to "hide without affecting layout" (e.g., for fade-in/fade-out animations), use `opacity`; if you need to "completely hide and not occupy space," use `display: none`.
:::

### 4.3 Case: Page Lag After Setting display:none

::: danger ❌ Common Misconception: Thinking display:none Elements "Don't Exist"
Many people think that after setting `display: none`, the element "disappears" and no operations on it will affect performance. This is **wrong**!

Although `display: none` elements are not in the render tree, when you modify their properties via JavaScript, the browser still needs to:
1. **Recalculate styles** (match CSS rules)
2. **Track changes** (prepare for future display)

Look at this "optimization" example:
:::

::: details View the "Ineffective Optimization" Code
```javascript
// ❌ The "optimization" you thought: hide first, modify, then show
const container = document.getElementById('list')
container.style.display = 'none'

// Aggressively manipulate the DOM
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'  // Changing width!
  item.textContent = `Item ${i}`
  container.appendChild(item)
}

container.style.display = 'block'

// Problem: every time style.width is modified, the browser recalculates styles,
// even though the element is display:none!
```

**✅ The correct optimization approach:**
```javascript
// Use DocumentFragment for batch operations
const container = document.getElementById('list')
const fragment = document.createDocumentFragment()  // Virtual container

// All operations happen on the in-memory fragment
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('div')
  item.style.width = Math.random() * 100 + 'px'
  item.textContent = `Item ${i}`
  fragment.appendChild(item)  // Doesn't affect the real DOM
}

// Insert into real DOM once, triggering only a single render
container.appendChild(fragment)
```
:::

---

## 5. Stage 3: Layout and Reflow

### 5.1 Overview of "Layout"

::: tip 🤔 What Is Layout?
**Layout**, also called **Reflow**, is the process where the browser calculates "where each element is and how much space it occupies" in the render tree.

You can think of it as an **interior designer measuring a room**:
- First measure the length and width of each room
- Decide where furniture goes
- Calculate the coordinates of each piece of furniture

**Why is layout "expensive"?** Because a change to one element can affect other elements. For example, if you widen a div, the div next to it might get pushed down, causing the entire page to recalculate.
:::

### 5.2 "Minefields" That Trigger Reflow

Here are common operations that trigger reflow — **recommended to bookmark and memorize**:

| Category | Property/Operation | Performance Impact | Alternative |
|------|----------|----------|----------|
| **Dimensions** | `width`, `height`, `min/max-width/height` | 💀💀💀 | Use `transform: scale()` instead |
| **Position** | `top`, `right`, `bottom`, `left` | 💀💀💀 | Use `transform: translate()` instead |
| **Margins** | `margin`, `padding` | 💀💀 | Use `transform` or `gap` instead |
| **Borders** | `border-width` | 💀💀 | Avoid frequent changes |
| **Content** | Text content changes, image loading | 💀💀 | Reserve space to avoid layout shift |
| **Fonts** | `font-size`, `line-height` | 💀💀💀 | Avoid frequent changes |
| **Display** | `display` value changes | 💀💀💀 | Use `visibility` or `opacity` instead (if full hiding isn't needed) |
| **Queries** | `offsetWidth`, `offsetHeight`, etc. | 💀💀💀💀💀 | **Batch reads to avoid layout thrashing** |

::: tip 📊 What Can You Learn From This Table?
**Key findings**:
1. **Geometric properties (width, height, position) are the most expensive**: They trigger a full layout recalculation
2. **Querying properties is more dangerous than modifying them**: Reading `offsetWidth` **forces synchronous layout** (see section 5.4)
3. **transform and opacity have the best performance**: They don't trigger reflow, only compositing
:::

### 5.3 Case: Animation Choppy Like a Slideshow

**Pitfall: Animating with width**

::: details View Poor-Performance Animation Code
```css
/* ❌ Bad animation: triggers reflow */
.box {
  width: 100px;
  transition: width 0.3s;
}

.box:hover {
  width: 200px;  /* Changing width triggers reflow! */
}
```

Every frame of the animation triggers reflow. The browser needs to:
1. Recalculate the width
2. Recalculate the position (may affect other elements)
3. Repaint

**✅ Good animation: use transform**
```css
/* ✅ Good animation: only triggers compositing */
.box {
  width: 100px;
  transform: scaleX(1);
  transition: transform 0.3s;
}

.box:hover {
  transform: scaleX(2);  /* Scaling doesn't trigger reflow! */
}
```

`transform` is handled directly by the GPU, doesn't trigger reflow or repaint, and the animation is buttery smooth.
:::

### 5.4 Performance Killer: Forced Synchronous Layout

::: danger 💀 The Most Dangerous Performance Problem: Layout Thrashing
**Forced Synchronous Layout**, also known as **Layout Thrashing**, is the most common and most severe performance problem.

It happens because: **when JavaScript reads a layout property (like `offsetWidth`), the browser must immediately execute layout calculation to return an accurate value.**

If you "interleave reads and writes," you force the browser to repeatedly "layout → read → layout → read," creating a vicious cycle.
:::

::: details View Layout Thrashing Code
```javascript
// ❌ Terrible: interleaved reads and writes cause layout thrashing
const elements = document.querySelectorAll('.item')

for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Read → forces layout
  elements[i].style.width = (height * 2) + 'px'  // Write → marks as needing reflow
  // The next iteration's read forces layout again... vicious cycle!
}

// With 100 elements, this triggers 100 layout calculations!
```

**✅ The correct optimization: separate reads and writes**
```javascript
const elements = document.querySelectorAll('.item')

// Step 1: Batch reads (read everything first)
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)  // Only triggers layout once
}

// Step 2: Batch writes (write everything after)
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.width = (heights[i] * 2) + 'px'  // Only triggers reflow once
  }
})
```
:::

<LayoutReflowDemo />

---

## 6. Stage 4: Paint and Repaint

### 6.1 Overview of "Paint"

::: tip 🤔 What Is Paint?
**Paint** is the process where the browser actually "draws" the layout-calculated elements onto the screen.

You can think of it as **painting a room**:
- Layout stage = measuring dimensions, drawing lines
- Paint stage = actually applying paint, putting up wallpaper

**Paint is not as expensive as layout, but it's not cheap either.** Frequent painting still affects performance, especially for complex elements (shadows, gradients, etc.).
:::

### 6.2 Signals That Trigger Repaint

Unlike reflow, repaint only involves "appearance" changes, not "geometric" changes:

| Category | Property | Performance Impact | Notes |
|------|------|----------|------|
| **Color** | `color`, `background-color` | 💀 | The most common repaint trigger |
| **Background** | `background-image`, `background-position` | 💀💀 | Images are slower than solid colors |
| **Border** | `border-color`, `border-style` | 💀 | Changing border color/style |
| **Text** | `text-decoration`, `text-shadow` | 💀💀 | Shadows are slower than plain text |
| **Box Shadow** | `box-shadow` | 💀💀💀 | Complex shadows are very slow |
| **Border Radius** | `border-radius` | 💀 | Changing corner roundness |
| **Opacity** | `opacity` | ✅ | **Special: doesn't trigger repaint, only compositing** |

::: tip 📊 What Can You Learn From This Table?
**Key finding**: `opacity` is special! Like `transform`, it doesn't trigger repaint — it directly triggers the compositing stage. This is why using `opacity` for fade-in/fade-out animations has the best performance.

Also, **shadows and gradients are more expensive than repaint** because they require complex pixel calculations. If your page has many `box-shadow`s, consider using pseudo-elements or images instead.
:::

### 6.3 Case: Hover Effect Stuttering

**Pitfall: Using box-shadow for hover animation**

::: details View Poor-Performance Hover Effect
```css
/* ❌ Bad hover effect: box-shadow animation is very slow */
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);  /* Shadows are slow! */
}
```

`box-shadow` requires per-pixel calculation, causing stutter during animation.

**✅ Good approach: use transform or pseudo-elements**
```css
/* ✅ Good hover effect: use transform */
.card {
  transform: translateY(0);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);  /* Only change shadow on hover, don't animate it */
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```
:::

<PaintLayerDemo />

---

## 7. Stage 5: Compositing and GPU Acceleration

### 7.1 Overview of "Compositing"

::: tip 🤔 What Is Compositing?
**Compositing** is the "magic" of modern browsers. It divides different parts of the page into multiple **layers** and uses the **GPU (Graphics Processing Unit)** to composite the final image in parallel.

You can think of it as **Photoshop layers**:
- Traditional approach = everything drawn on a single layer (CPU serial, slow)
- Compositing approach = draw in layers, then merge (GPU parallel, fast)

**Why is compositing fast?** Because GPUs excel at "image compositing" — parallel tasks that they can do dozens of times faster than CPUs.
:::

### 7.2 Criteria for Element Promotion to Compositing Layers

The browser automatically promotes certain elements to independent compositing layers. Here are the common triggers:

| Trigger Condition | CSS Property/Value | Performance Impact | Notes |
|---------|-----------|----------|----------|
| **3D Transform** | `transform: translate3d()`, `rotate3d()` | ✅✅✅ | Best animation performance |
| **Hardware Acceleration Hack** | `transform: translateZ(0)` | ✅✅ | Commonly called "force GPU acceleration" |
| **Opacity Animation** | `opacity` change (with animation) | ✅✅✅ | Doesn't trigger repaint |
| **Fixed Positioning** | `position: fixed` | ✅ | Avoids repeated layout on scroll |
| **Will-Change** | `will-change: transform, opacity` | ✅✅ | Creates layer in advance; watch memory |
| **Canvas/WebGL** | `<canvas>`, WebGL content | ✅✅ | Naturally in independent layers |
| **Video** | `<video>` | ✅✅ | Independent layer, prevents interference |

::: tip 📊 What Can You Learn From This Table?
**Key finding**: `transform` and `opacity` are the best-performing animation properties because they don't trigger reflow or repaint — they directly trigger compositing. This is why performance optimization guides always say "use transform and opacity for animations."

But be careful: **each compositing layer consumes GPU memory**. Abusing `translateZ(0)` can cause memory explosions (see section 7.4).
:::

### 7.3 Case: Too Many Compositing Layers Making It Slower

::: danger 💀 The Trap of Over-Optimization
Some people hear "GPU acceleration is fast" and add `transform: translateZ(0)` to every element, only to find the page is even slower.

**The problem**:
Each compositing layer needs to store a "texture" (bitmap) in GPU memory. If a page has 100 compositing layers, GPU memory can be overwhelmed, causing low-end devices to crash or fall back to CPU rendering.
:::

::: details View "Over-Optimization" Code
```css
/* ❌ Wrong approach: enable GPU acceleration on every element */
.card { transform: translateZ(0); }
.button { transform: translateZ(0); }
.icon { transform: translateZ(0); }
/* ... 100 elements all get it ... */

/* Result: GPU memory explosion, page freezes */
```

**✅ The correct approach: use on demand**
```css
/* Strategy 1: Only enable on elements that truly need animation */
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);  /* Automatically creates a compositing layer */
}

/* Strategy 2: Use will-change to hint the browser */
.card {
  will-change: transform;  /* Create layer in advance */
}

/* Strategy 3: Remove after animation ends */
.card:not(:hover) {
  will-change: auto;  /* Release GPU memory */
}
```
:::

<CompositeDemo />

---

## 8. Event Loop: JavaScript's "Cloning Technique"

::: tip 🤔 What Is the Event Loop?
The **Event Loop** is the mechanism JavaScript uses to achieve "asynchrony." Because JavaScript is **single-threaded** (it can only do one thing at a time), but it needs to handle user clicks, network requests, timers, and other tasks, it requires a "scheduling system" to manage these tasks.

You can think of it as a **package sorting center**:
- **Call Stack** = the package currently being processed
- **Web APIs** = external partner warehouses (timers, network requests, etc.)
- **Callback Queue** = shelves of pending packages
- **Event Loop** = the sorting robot (constantly checking "can the next task be processed?")
:::

### 8.1 Macrotasks and Microtasks

Early JavaScript only had a single task queue. But as asynchronous programming became more complex, browsers introduced two types of tasks:

| Type | Common Sources | Priority | Execution Timing |
|------|---------|--------|----------|
| **Macrotask** | `setTimeout`/`setInterval`, I/O operations, UI rendering | Low | One per event loop cycle |
| **Microtask** | `Promise.then`, `MutationObserver` | High | After the current macrotask ends, immediately flush all microtasks |

**The "mnemonic" for execution order**:

```
1. Execute the current macrotask (e.g., the entire <script>)
2. Execute all microtasks generated during execution (Promise.then, etc.)
   ↳ Microtasks can spawn new microtasks — all are flushed before continuing
3. If needed, perform UI rendering (reflow/repaint)
4. Start the next event loop cycle, execute the next macrotask
```

### 8.2 Case: Promise vs setTimeout Execution Speed

::: danger ❌ Common Misconception: setTimeout(fn, 0) Executes "Immediately"
Many people think `setTimeout(fn, 0)` means "execute immediately after 0 milliseconds." This is a **wrong** understanding.

In reality, `setTimeout(fn, 0)` means: **"after waiting at least 0 milliseconds, add the callback to the macrotask queue."** But it still needs to wait for the current call stack to clear, the microtask queue to flush, and possible UI rendering to complete before it can execute.
:::

::: details View Execution Order
```javascript
console.log('1. Start')

setTimeout(() => {
  console.log('2. setTimeout callback')
}, 0)

Promise.resolve().then(() => {
  console.log('3. Promise.then')
})

console.log('4. End')

// The output order you might expect:
// 1. Start
// 4. End
// 2. setTimeout callback  ← Isn't setTimeout(0) immediate?
// 3. Promise.then

// The actual output order:
// 1. Start
// 4. End
// 3. Promise.then         ← Promise.then executes before setTimeout!
// 2. setTimeout callback
```

**Execution Flow Diagram:**
```
Call Stack                    Macrotask Queue               Microtask Queue
                              [setTimeout callback]         [Promise.then callback]

1. console.log('1. Start')
   → Output: 1. Start

2. setTimeout(fn, 0)
   → Add callback to macrotask queue  ← [setTimeout callback]

3. Promise.resolve().then()
   → Add callback to microtask queue                            ← [Promise.then callback]

4. console.log('4. End')
   → Output: 4. End

5. Call stack clears, check microtask queue
   → Found Promise.then callback
   → Execute: console.log('3. Promise.then')
   → Output: 3. Promise.then

6. Microtask queue flushed
   → May need UI rendering (if there are changes)

7. Check macrotask queue
   → Found setTimeout callback
   → Execute: console.log('2. setTimeout callback')
   → Output: 2. setTimeout callback
```
:::

::: tip 💡 Core Insight
**Microtasks are "more urgent" than macrotasks.** If you want an operation to execute "right after the current code block ends, but before UI updates," use `Promise.then` or `queueMicrotask`.

`setTimeout(0)` does not guarantee immediate execution — it will be delayed at least until the current call stack clears and the microtask queue is flushed.
:::

<JSEventLoopDemo />

<MacroMicroTaskDemo />

---

## 9. Performance Optimization in Practice: Make Your Web Pages "Fly"

Now that you understand the rendering pipeline workflow, let's look at how to optimize. Here are the five most practical optimization techniques.

### 9.1 The Golden Rule: Avoid Forced Synchronous Layout

**Problem**: Interleaving reads and writes of layout properties causes layout thrashing.

::: details View Before/After Optimization Comparison
```javascript
// ❌ Terrible: interleaved reads and writes cause layout thrashing
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight  // Read → forces layout
  elements[i].style.height = (height * 2) + 'px'  // Write → marks as needing reflow
  // The next iteration's read forces layout again... vicious cycle!
}

// ✅ Excellent: read everything first, then write everything
// Step 1: Batch reads
const heights = []
for (let i = 0; i < elements.length; i++) {
  heights.push(elements[i].offsetHeight)
}

// Step 2: Batch writes
requestAnimationFrame(() => {
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.height = (heights[i] * 2) + 'px'
  }
})
```
:::

### 9.2 Use transform and opacity for Animations

**Problem**: Animating with `width`, `height`, `left`, `top` triggers reflow.

::: details View Before/After Optimization Comparison
```css
/* ❌ Bad animation: triggers reflow */
.box {
  transition: width 0.3s, left 0.3s;
}
.box.moving {
  width: 200px;
  left: 100px;
}

/* ✅ Good animation: only triggers compositing */
.box {
  transition: transform 0.3s;
}
.box.moving {
  transform: translateX(100px) scaleX(2);
}
```
:::

### 9.3 Virtual Scrolling: Solving Large Data Lists

**Problem**: When the number of list items reaches thousands, too many DOM nodes cause performance issues.

**Core idea**: Only render the list items visible within the viewport (plus a small buffer), keeping the DOM node count fixed regardless of total data size.

<RenderingPerformanceDemo />

::: details View Virtual Scrolling Implementation
```vue
<template>
  <div class="virtual-list" @scroll="handleScroll">
    <!-- Placeholder element to create scroll height -->
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <!-- Actually rendered list items -->
    <div class="content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="item"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  items: Array,
  itemHeight: { type: Number, default: 50 }
})

const scrollTop = ref(0)
const buffer = 5  // Buffer count

// How many items fit in the visible area
const visibleCount = computed(() => 10)

// Start index
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - buffer)
)

// End index
const endIndex = computed(() =>
  Math.min(props.items.length, startIndex.value + visibleCount.value + buffer * 2)
)

// Currently visible data
const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value)
)

// Total height
const totalHeight = computed(() => props.items.length * props.itemHeight)

// Offset
const offsetY = computed(() => startIndex.value * props.itemHeight)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}
</script>
```
:::

### 9.4 Debounce and Throttle: Reduce Event Trigger Frequency

**Problem**: Frequently triggered events (like scroll, resize) cause performance issues.

::: details View Debounce and Throttle Implementation
```javascript
// Debounce: delay execution; if triggered again within the delay, restart the timer
function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// Throttle: execute at fixed time intervals
function throttle(fn, interval) {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= interval) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

// Usage example
window.addEventListener('scroll', debounce(handleScroll, 200))
window.addEventListener('resize', throttle(handleResize, 100))
```
:::

### 9.5 Lazy Loading: Defer Loading Non-Critical Resources

**Problem**: Loading too many resources on the first screen makes the page open slowly.

::: details View Lazy Loading Implementation
```javascript
// Image lazy loading
const lazyImages = document.querySelectorAll('img[data-src]')

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src  // Load the real image
      img.removeAttribute('data-src')
      observer.unobserve(img)  // Stop observing
    }
  })
})

lazyImages.forEach(img => imageObserver.observe(img))
```
:::

---

## 10. Performance Problems You Should Now Be Able to Identify

After understanding the browser's rendering pipeline, you should be able to identify these common performance issues:

| Problem Code | What's Wrong | How to Describe It to AI |
|---------|---------|-------------|
| `element.style.width = ...` | Frequently modifying width in a loop | "This triggers multiple reflows; please use transform or batch processing instead" |
| `height = element.offsetHeight` | Reading layout properties right after writing | "This is forced synchronous layout; please separate reads and writes" |
| `element.className = ...` | Frequently modifying class triggers style recalculation | "Use classList.add/remove instead to reduce style calculations" |
| Animating with `width`/`left` | Triggers reflow and repaint, poor performance | "Use transform and opacity for animations instead" |
| Adding `translateZ(0)` to all elements | Abusing GPU acceleration causes memory explosion | "Only enable GPU acceleration on elements that need animation" |
| Rendering 10,000 list items all at once | Too many DOM nodes cause stutter | "Implement virtual scrolling to only render the visible area" |
| Manipulating DOM directly in scroll events | Too-high trigger frequency causes stutter | "Use requestAnimationFrame or throttle to optimize" |
| Using `box-shadow` for hover animation | Complex shadow calculation is very slow | "Use transform or pseudo-elements instead; avoid animating shadows" |

**If you've carefully read each chapter's "Pitfall Journal," you've also mastered these core concepts:**

- **The five stages of the rendering pipeline**: DOM/CSSOM → Render Tree → Layout → Paint → Composite
- **Reflow vs. Repaint**: Reflow is most expensive (geometric changes), repaint is next (appearance changes)
- **Forced Synchronous Layout**: Interleaved reads and writes cause layout thrashing — must separate them
- **GPU Acceleration**: transform and opacity are handled by GPU for best performance
- **Event Loop**: JavaScript is single-threaded, achieving asynchrony through task queues

These concepts will help you quickly identify performance bottlenecks.

::: info 💡 When You Encounter Performance Issues, Tell AI This
- "Animation is choppy — check if it's triggering reflow or repaint"
- "Scroll performance is poor — may need throttling or requestAnimationFrame"
- "Large lists stutter — need virtual scrolling"
- "Frequent style changes cause performance issues — please optimize with transform"
:::

---

## 11. Summary: The Essence of Rendering Pipeline Optimization

Through this article, we can draw the following core conclusions:

**From a practical standpoint**: It's not about doing more optimization, but about doing the *right* optimization. Understanding the browser's rendering pipeline tells you where to focus effort and where to let go.

**From a cost perspective**:
- Most performance waste comes from **frequent interleaved reads and writes** of layout properties, which must be solved through read/write separation and batch processing
- Complex animation effects that trigger reflow and repaint often stem from using the "wrong properties" and need to be solved through `transform` and `opacity`
- For rendering large data lists, relying solely on virtual DOM is no longer enough — techniques like **virtual scrolling** must be combined

**The goal is: under given browser and hardware conditions, ensure every rendering step's investment delivers clear performance returns.**

---

## 12. Glossary

| English Term | Chinese Translation | Explanation |
| :--- | :--- | :--- |
| **DOM** | 文档对象模型 | The tree structure formed after the browser parses an HTML document; JavaScript can manipulate page elements through the DOM API |
| **CSSOM** | CSS对象模型 | The tree structure formed after the browser parses CSS; combined with the DOM to calculate final styles |
| **Render Tree** | 渲染树 | Formed by merging the DOM tree and CSSOM tree; contains only visible nodes, used for subsequent layout calculation and painting |
| **Layout** | 布局 | The process of calculating geometric information (position, size) for each node in the render tree; also called Reflow |
| **Reflow** | 重排/回流 | When an element's geometric properties (size, position) change, the browser must recalculate layout |
| **Paint** | 绘制/重绘 | The process of drawing layout-calculated element styles (color, background, borders, etc.) onto the screen |
| **Repaint** | 重绘 | A paint update triggered when an element's appearance properties (like color, background) change without affecting geometric properties |
| **Composite** | 合成 | The process of merging multiple paint layers into the final screen image, typically executed on the GPU |
| **Layer** | 层/合成层 | An independent paint surface created by the browser to optimize rendering; can be transformed and composited independently |
| **Event Loop** | 事件循环 | JavaScript's asynchronous execution mechanism, responsible for scheduling macrotask and microtask execution |
| **Call Stack** | 调用栈 | A data structure that records the currently executing JavaScript functions |
| **Macro Task** | 宏任务 | Lower-priority task types in the event loop, such as setTimeout, setInterval, I/O operations, etc. |
| **Micro Task** | 微任务 | Higher-priority task types in the event loop, such as Promise.then, MutationObserver, etc. |
| **Forced Synchronous Layout** | 强制同步布局 | A performance problem where interleaving reads and writes of layout properties in JavaScript forces the browser to immediately execute layout calculations |
| **Layout Thrashing** | 布局抖动 | The severe performance degradation caused by frequent forced synchronous layout |
| **Virtual Scrolling** | 虚拟滚动 | A technique that only renders visible list items within the viewport, used to optimize performance for large data lists |
| **RAF** | 请求动画帧 | A browser API for executing animation-related JavaScript code before the next repaint |
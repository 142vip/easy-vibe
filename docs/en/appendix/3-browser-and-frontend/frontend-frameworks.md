# An Introduction to Frontend Frameworks

::: tip Preface
You've learned the basics of HTML, CSS, and JavaScript and can now build simple web pages. But as web functionality grows more complex, you may notice that writing raw JavaScript becomes hard to maintain — changing one thing requires touching many places, and collaboration often leads to conflicts.

This is why we need frontend frameworks — they make code more organized, easier to maintain, and more efficient to develop. In vibecoding, AI writes most of the code for you. But you should at least be able to read different frameworks' code styles, understand their pros and cons, so the AI can help you choose the most suitable tech stack.

By the end of this article, you'll be able to:
- Understand why frontend technology keeps evolving
- Know the characteristics of Vue, React, Svelte, and Angular
- Grasp core concepts like "data-driven" and "component-based" development
- Choose the right framework for your project
:::

**What will this article teach you?**

| Chapter | Content | What You'll Gain |
|-----|------|-----------|
| **Chapter 1** | Why care about frontend evolution | Understand what problems each evolution solves |
| **Chapter 2** | The static web page era | Learn the earliest web development approaches |
| **Chapter 3** | The jQuery era | Understand the pain points of "imperative" programming |
| **Chapter 4** | The Vue/React era | Master "declarative" and "data-driven" thinking |
| **Chapter 5** | Rendering strategies | Know the differences and use cases of CSR, SSR, and SSG |
| **Chapter 6** | Engineering tooling | Understand the role of build tools like Webpack and Vite |

Each chapter begins with "Why do we need this technology?" so you understand the logic behind each evolution.

---

## 1. Motivation for Caring About Frontend Evolution

::: tip 🤔 Core Question
**Why are web pages getting more complex? Why does frontend technology keep evolving?** This question will guide you through the technological journey from simple web pages to modern web applications.
:::

### 1.1 From "Digital Poster" to "Desktop Application"

Think about a **poster** you see on the street:

- ✅ Has content (text, images)
- ✅ Has design (colors, layout)
- ❌ But if you talk to it, it won't respond
- ❌ If you tap somewhere, nothing happens

**The earliest web pages** were just like these "digital posters": view-only, unchangeable, with fixed content.

**Modern web pages** are completely different. They're like **desktop applications** (VS Code, Figma):

- ✅ You can edit documents, draw, play games
- ✅ They respond to your every action in real time
- ✅ They can even work offline

**The core reason for this transformation: web page functionality has become increasingly complex, requiring more efficient technologies and development approaches.**

### 1.2 A Real-Life Analogy: Building a House

The evolution of frontend technology is like the evolution of house construction:

| Era | 🏠 House Analogy | Actual Characteristics | Pros & Cons |
|------|-----------|---------|--------|
| **2000s** | **Putting up posters** | Static web pages — just write HTML | ✅ Simple ❌ No interactivity |
| **2010s** | **Hiring workers for manual renovation** | jQuery era — manually manipulate every element | ✅ Interactive ❌ Messy code, hard to maintain |
| **2020s** | **Building with LEGO blocks** | Vue/React era — component-based development | ✅ Efficient, maintainable ❌ Learning curve |

::: tip 💡 What can you see from this table?

**Phase 1 → Phase 2**: From "can't move" to "can move." This is a qualitative leap — web pages become interactive, but at the cost of messy code.

**Phase 2 → Phase 3**: From "usable" to "delightful." Component-based development makes code reusable like building blocks, dramatically improving development efficiency.

**Core insight**: Technological evolution isn't "new for the sake of new" — it's about solving the pain points of the previous phase.
:::

---

---

## 2. Phase 1: Static Web Pages and "Image Slicing" (2000s)

::: tip 🤔 Core Question
**What were the earliest web pages like? Why weren't frameworks needed back then?** Understanding the limitations of this phase helps you see why later evolutions were necessary.
:::

<FrontendEvolutionDemo />

### 2.1 What Was ThOverview of Era Like

**Development approach**:

- Write a few HTML files
- Embed some CSS and JavaScript
- Drag the files directly into a browser to see the result
- Upload the folder to a server to deploy

**Characteristics**:

- ✅ **Pros**: Simple and direct, no learning cost, write and run
- ❌ **Cons**: No complex interactivity, code becomes messy as it grows

::: details View the project structure of that era

```
project/
├── index.html
├── login.html
├── css/
│   ├── bootstrap.css
│   └── custom.css
├── js/
│   ├── jquery.js
│   └── app.js
└── images/
```

**Problems encountered**:

1. **Global variable pollution**: All variables live in the global namespace, easy to overwrite each other
2. **Dependency management chaos**: JS files must be loaded in the correct order, otherwise errors occur
3. **Code hard to reuse**: To reuse a feature, you can only copy and paste
:::

### 2.2 Overview of "Image Slicing"

You may have heard the term "image slicing." It was the main task of early frontend work:

**What is image slicing?**

A designer creates a page layout in Photoshop → the frontend developer slices the design into small images → uses HTML to piece the images together into a page

**Why was it so slow?**

Every small image on a web page required a separate **network request** from the browser. More requests meant slower loading.

👇 **Try it yourself**: Observe how image requests affect loading performance

<SliceRequestDemo />

::: tip 💡 CSS Sprites

To reduce the number of requests, the "CSS sprite" technique emerged: combining many small images into one large image.

The advantage was fewer requests; the downside was that creating and maintaining them was a hassle.

The lesson from this phase: **too many requests is the enemy of performance**.
:::

---

---

## 3. Phase 2: The jQuery Era — "Manual Labor" (2010s)

::: tip 🤔 Core Question
**Why was jQuery needed? What problems did it solve, and what new problems did it create?** Understanding jQuery's limitations helps you appreciate the value of Vue/React.
:::

### 3.1 Motivation for jQuerying Needed

As web pages grew more complex, the problems of vanilla JavaScript became apparent:

- ❌ **Verbose APIs**: Simple operations required lots of code
- ❌ **Browser compatibility**: Different browsers had different APIs, requiring lots of compatibility code
- ❌ **Weak selectors**: Finding elements was cumbersome

**jQuery** was born. It made JavaScript simpler:

```javascript
// Vanilla JavaScript (verbose)
const element = document.getElementById('title')

// jQuery (concise)
const element = $('#title')
```

### 3.2 jQuery's Approach: Manually Modifying the Page

jQuery's core approach is **imperative**: you tell the browser "how to do it."

```javascript
// Find the title element
$('#title').text('New Title')

// Find the button and disable it
$('#submit-btn').attr('disabled', true)

// Find the list and add an item
$('ul').append('<li>New Item</li>')
```

**The problem**: You need to remember every element on the page, and every time data changes, you must manually update all related elements.

👇 **Try it yourself**: Compare jQuery and data-driven approaches

<JQueryVsStateDemo />

::: warning ⚠️ The Pain of jQuery

Imagine you're building a shopping cart:

```javascript
// User clicks "Add to Cart"
function addToCart() {
  cartCount++ // Data changes

  // You have to manually update every related spot
  $('#cart-count').text(cartCount) // Top-right badge
  $('#cart-page-count').text(cartCount) // Cart page
  $('#checkout-price').text(calculatePrice()) // Checkout button

  // If you miss one spot, the page becomes inconsistent!
}
```

**This is the cost of "manual labor"**: error-prone and hard to maintain.
:::

### 3.3 The Rise of Mobile: Responsive Design Emerges

Another major shift in this phase: **phones and tablets became mainstream**.

Web pages had to adapt to different screens. This required **responsive layout**: the same HTML/CSS automatically adjusts layout based on screen width.

**The core of responsive layout: Media Queries**

```css
/* Desktop screens (wider than 640px) */
@media (min-width: 640px) {
  .container {
    display: flex;
  }
}

/* Mobile screens (narrower than 640px) */
@media (max-width: 640px) {
  .container {
    display: block;
  }
}
```

👇 **Try it yourself**: Resize your browser and observe responsive layout in action

<ResponsiveGridDemo />

::: tip 💡 Responsive Design Is Like a "Smart Picture Frame"

Imagine viewing the same photo in different rooms:

- In a **large living room** (desktop screen), the photo can be displayed larger, with room for other decorations
- In a **small bedroom** (phone screen), the photo needs to be smaller, and other decorations need to be put away

**Responsive layout** is the "smart picture frame" that automatically adjusts how things are displayed based on the room size.
:::

---

---

## 4. Phase 3: From "Manual Labor" to "Data-Driven" (Vue/React)

::: tip 🤔 Core Question
**Why do we need Vue/React? What is the essential difference between them and jQuery?** Understanding "declarative" and "data-driven" is key to mastering modern frontend frameworks.
:::

### 4.1 Motivation for needing New Frameworks

The problems of the jQuery era accumulated to a tipping point:

- **Code becomes messy as it grows**: DOM operations everywhere, hard to maintain
- **Prone to bugs**: Miss one update and the page becomes inconsistent
- **Difficult collaboration**: Multiple people editing the same file leads to conflicts

**Vue / React**'s core approach: **just change the data, and the page updates automatically**.

### 4.2 Vue/React's Approach: Declarative UI

**jQuery (Imperative)**:

```javascript
// You tell the browser every step to take
$('#title').text('New Title')
$('#title').css('color', 'red')
$('#title').show()
```

**Vue (Declarative)**:

```javascript
// You just tell the browser "what to display"
data() {
  return {
    title: "New Title",
    color: "red",
    visible: true
  }
}
```

👇 **Try it yourself**: Compare imperative and declarative approaches

<ImperativeVsDeclarativeDemo />

::: tip 💡 Imperative vs. Declarative

It's like painting a picture:

- **Imperative**: You tell the painter "pick up the brush, dip it in red paint, draw a circle at coordinates (10, 10)"
- **Declarative**: You hand the painter a photo and say "paint it like this"

Vue/React is "declarative": you describe "what the page should look like," and the framework handles "how to draw it."
:::

### 4.3 Component-Based Development: Building Pages Like LEGO

**Vue / React**'s most powerful feature is **component-based development**: breaking the page into independent "building blocks."

Imagine you're building with LEGO:

- You don't need to "carve every block from scratch" (write HTML/CSS from scratch)
- You just need to "assemble the blocks following the instructions" (combine components together)
- Each block is **independent** and can be **reused** across different sets

**Benefits of components**:

- **Reusability**: Write one "Product Card" component and use it 100 times
- **Encapsulation**: Internal state of a component doesn't affect others
- **Maintainability**: Modify a component, and every place that uses it updates

::: info 💡 Recognition Tips
- See `<ComponentName />` → This is a component
- See `import xxx from './xxx.vue'` → Importing a component
- See `props: {...}` → Parameters the component receives
- See `emit('xxx')` → Component sending an event to its parent
:::

### 4.4 SPA: The Birth of Single-Page Applications

The **Vue / React** era brought another major shift: **from MPA to SPA**.

**MPA (Multi-Page Application)**:

- Click a link → full page refresh → see the new page
- Like **flipping through a book**: each time you turn a page, you close the old book and fetch a new one from the shelf

**SPA (Single-Page Application)**:

- Click a link → only the content area refreshes → the page itself doesn't reload
- Like **switching chapters in the same book**: only erase the old content and write in the new

👇 **Try it yourself**: Experience the difference between MPA and SPA

<RoutingModeDemo />

**SPA advantages**:

- ✅ **Smooth experience**: Fast page transitions
- ✅ **Easy state management**: Form inputs and scroll positions are preserved
- ❌ **Initial load may be slow**: JavaScript must be downloaded first
- ❌ **SEO requires extra handling**: Search engines may not index content (needs SSR/SSG)

---

---

## 5. Rendering Strategies: From CSR to SSR/SSG

::: tip 🤔 Core Question
**Is the page generated on the server or in the browser?** Different rendering strategies have different trade-offs — choosing the right one is critical for performance and SEO.
:::

**CSR (Client-Side Rendering)**:

- Browser downloads JavaScript → executes code → generates the page
- Pros: Smooth interactions, low server load
- Cons: Slow initial load, poor for SEO

**SSR (Server-Side Rendering)**:

- Server generates HTML → sends to browser → browser displays directly
- Pros: Fast initial load, good for SEO
- Cons: High server load, complex implementation

**SSG (Static Site Generation)**:

- Generates HTML for all pages at build time
- Pros: Extremely fast, fully static, CDN-friendly
- Cons: Not suitable for dynamic content

👇 **Try it yourself**: Compare the characteristics of different rendering strategies

<RenderingStrategyDemo />

::: info 💡 How to choose?
- **Content sites** (blogs, documentation): Prefer SSG
- **Dynamic sites needing SEO** (e-commerce, news): Use SSR
- **Admin dashboards**: Use CSR
- **Mixed requirements**: Consider hybrid rendering with Nuxt/Next.js
:::

---

## 6. Phase 4: Engineering and Build Tools (2015s–2020s)

::: tip 🤔 Core Question
**Why does frontend need "engineering"? What do build tools actually do?** Understanding engineering helps you grasp the workflow of modern frontend projects.
:::

### 6.1 Motivation for needing "Engineering"

Frontend projects have grown too large to rely on "manually including scripts."

**Engineering** means using tools and standards to make development more efficient, code more reliable, and collaboration smoother.

::: tip 💡 Engineering = From "Handicraft Workshop" to "Modern Factory"

Imagine cooking at home vs. running a restaurant:

- **Cooking at home**: Cook whatever you want, very free-form
- **Running a restaurant**: Requires standardized recipes, standardized procedures, unified ingredient sourcing

Frontend development is the same:

- **Small projects**: Write however you like
- **Large projects**: Need unified code standards, automated tools, standardized processes
:::

### 6.2 Build Tools: Webpack → Vite

**Webpack** (Traditional):

- How it works: **bundle first, then serve**
- On startup: bundle all code → start the dev server
- Problem: **slow**. The bigger the project, the slower the startup (can take 30+ seconds)

**Vite** (Modern):

- How it works: **compile on demand**
- On startup: no bundling, start the dev server directly
- When the browser requests a file, compile it in real time
- Advantage: **fast**. Typically starts in under 1 second

| Comparison | Webpack | Vite | Improvement |
|--------|---------|------|------|
| Cold start | 30s+ | <1s | **30x faster** |
| Hot reload | 3–5s | <100ms | **30x faster** |
| Config file | Hundreds of lines | Dozens of lines | **Drastically simplified** |

::: tip 💡 Why is Vite so fast?

**Webpack** is like **moving house with everything packed**: bundle everything first, then head out.

**Vite** is like **traveling light**: only bring the essentials, buy what you need along the way.

In development, most of the time you're only modifying a few files. Vite only compiles those files — of course it's fast.
:::

---

---

## 7. Comparing Mainstream Frameworks

::: tip 🤔 Core Question
**What are the characteristics of Vue, React, Svelte, and Angular? How do you choose the right framework?** Understanding their design philosophies and use cases helps you make informed decisions.
:::

### 7.1 Four-Framework Comparison

| Feature | Vue | React | Svelte | Angular |
|------|-----|-------|--------|---------|
| **Design Philosophy** | Progressive framework | UI library | Compile-time framework | Complete platform |
| **Learning Curve** | ⭐⭐ Easy | ⭐⭐⭐ Moderate | ⭐⭐ Easy | ⭐⭐⭐⭐ Steep |
| **Performance** | Fast | Fast | **Extremely fast** | Fast |
| **Ecosystem** | Mature | **Most mature** | Growing | Mature |
| **Bundle Size** | Small | Medium | **Smallest** | Large |
| **Best For** | Small-to-medium projects | Large projects | Performance-critical | Enterprise applications |
| **Backed By** | Evan You (Independent) | Meta | Community | Google |

### 7.2 Vue: Progressive Framework

**Core philosophy**: Adopt incrementally — use just a part or the full suite

```vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello Vue'
    }
  }
}
</script>
```

**Pros**:
- ✅ Gentle learning curve, excellent Chinese documentation
- ✅ Intuitive template syntax, easy to understand
- ✅ Single-file components (.vue) with clear structure
- ✅ Great for rapid development

**Cons**:
- ❌ State management in large projects requires learning Vuex/Pinia
- ❌ Slightly less flexible than React

**Best for**:
- Small-to-medium web applications
- Rapid prototyping
- Chinese-speaking teams (documentation-friendly)

### 7.3 React: UI Library

**Core philosophy**: Focus only on the view layer; everything else is left to the community

```jsx
function App() {
  const [message, setMessage] = useState('Hello React')
  return <div>{message}</div>
}
```

**Pros**:
- ✅ Most mature ecosystem, rich component libraries
- ✅ Flexible JSX syntax, powerful expressiveness
- ✅ Excellent virtual DOM performance
- ✅ Great for large projects

**Cons**:
- ❌ Steeper learning curve, requires grasping additional concepts
- ❌ Need to choose and combine various libraries yourself
- ❌ JSX requires compilation, can't run directly in the browser

**Best for**:
- Large, complex applications
- Projects needing a rich ecosystem
- Cross-platform development (React Native)

### 7.4 Svelte: Compile-Time Framework

**Core philosophy**: No virtual DOM — compiles components into efficient native code at build time

```svelte
<script>
  let message = 'Hello Svelte'
</script>

<div>{message}</div>
```

**Pros**:
- ✅ **Best performance** (no virtual DOM runtime overhead)
- ✅ Smallest bundle size
- ✅ Simple and intuitive syntax
- ✅ Built-in reactive system

**Cons**:
- ❌ Relatively smaller ecosystem
- ❌ Community smaller than Vue/React
- ❌ Fewer third-party libraries

**Best for**:
- Performance-critical applications
- Bundle-size-sensitive projects
- Teams willing to try new technologies

### 7.5 Angular: Complete Platform

**Core philosophy**: Provides a complete, out-of-the-box solution

```typescript
@Component({
  selector: 'app-root',
  template: '<div>{{ message }}</div>'
})
export class AppComponent {
  message = 'Hello Angular'
}
```

**Pros**:
- ✅ Full-featured — routing, HTTP, forms all included
- ✅ Native TypeScript support
- ✅ Great for large teams and projects
- ✅ Consistent code standards

**Cons**:
- ❌ Steep learning curve
- ❌ Many concepts, high complexity
- ❌ Large bundle size
- ❌ Not suitable for small projects

**Best for**:
- Large enterprise applications
- Teams requiring strict standards
- Projects already on a TypeScript stack

---

## 8. Summary: The Essence of Evolution

Frontend technology evolution is essentially about solving two problems:

### 8.1 Efficiency: From Manual to Automatic

| Era | Development Approach | Efficiency |
|------|---------|------|
| **2000s** | Hand-written HTML/CSS/JS | ⭐ |
| **2010s** | jQuery + manual DOM manipulation | ⭐⭐ |
| **2020s** | Vue/React + data-driven | ⭐⭐⭐ |
| **Today** | Component-based + engineering + automation | ⭐⭐⭐⭐⭐ |

### 8.2 Scale: From Individual to Team

| Era | Project Scale | Collaboration Style |
|------|---------|---------|
| **2000s** | A few files | One person can maintain |
| **2010s** | Dozens of files | Small team, prone to conflicts |
| **2020s** | Hundreds of files | Medium team, needs standards |
| **Today** | Thousands of files | Large team, needs full engineering system |

---

---

## 9. Learning Roadmap

### 9.1 If You're a Complete Beginner

**Step 1: HTML/CSS/JavaScript Fundamentals**

- Understand the three pillars of the web
- Be able to write simple static pages

**Step 2: Learn a Framework (Vue Recommended)**

- Understand the "data-driven" mindset
- Master component-based development

**Step 3: Build a Real Project**

- Create a complete single-page application
- Get familiar with routing, state management, and API calls

### 9.2 If You Have Some Experience

**Advanced directions**:

- **Engineering**: Learn Vite/Webpack, understand the build process
- **Performance Optimization**: Learn lazy loading, code splitting, caching strategies
- **TypeScript**: Add types to your code for greater reliability
- **Server-Side Rendering**: Learn Nuxt/Next.js to solve SEO and initial-load issues

---

## 10. What You Should Now Be Able to Recognize

After reading this chapter, you should be able to:

- ✅ Understand the trajectory and reasons behind frontend technology evolution
- ✅ Distinguish the characteristics of Vue, React, Svelte, and Angular
- ✅ Understand the difference between "imperative" and "declarative"
- ✅ Grasp the core idea of "data-driven" development
- ✅ Know the value of component-based development
- ✅ Understand the use cases of CSR, SSR, and SSG
- ✅ Understand the role of build tools (Webpack, Vite)
- ✅ Choose the right framework and tech stack for your project

::: info 💡 Practical Application
When using AI for your projects, you can tell it things like:

- "This is a blog site that needs SEO — use Nuxt (Vue's SSR framework)"
- "This is an admin dashboard — use Vue + Element Plus, no SSR needed"
- "This is a performance-critical web app — consider using Svelte"
- "The project is already on React — continue with the React ecosystem"
:::

---

## Glossary

| Term | English | Plain-English Explanation |
|------|------|-----------|
| **DOM** | Document Object Model | Represents the page as an object tree, readable and writable by JS. |
| **jQuery** | — | An early popular JS library that simplified DOM manipulation. |
| **Vue/React** | — | Modern frontend frameworks using data-driven and component-based development. |
| **Component** | Component | A reusable UI unit, such as a button, card, or navigation bar. |
| **MPA** | Multi-Page Application | Each navigation reloads the entire page. |
| **SPA** | Single-Page Application | Loads once; subsequent navigations don't refresh the page. |
| **Routing** | Routing | The rules and process for managing navigation between pages. |
| **SSR** | Server-Side Rendering | The server generates HTML and sends it to the browser. |
| **SSG** | Static Site Generation | Pages are pre-rendered as static HTML at build time. |
| **CSR** | Client-Side Rendering | The browser generates the page via JavaScript. |
| **Webpack** | — | Traditional bundler — bundles first, then serves. |
| **Vite** | — | Modern build tool — compiles on demand, extremely fast. |
| **Responsive** | Responsive Design | Design that automatically adapts to different screen sizes. |
| **Media Query** | Media Query | CSS conditional statements that apply different styles based on screen width. |
| **Imperative** | Imperative | Telling the program "how to do it." |
| **Declarative** | Declarative | Telling the program "what you want." |
| **Data-Driven** | Data-Driven | Only modify the data; the UI updates automatically. |
| **Tree Shaking** | — | Automatically removes unused code to reduce bundle size. |
| **Code Splitting** | Code Splitting | Splitting code into smaller chunks, loaded on demand. |
# An Introduction to Routing and Navigation
::: tip 🎯 Core Question
**Why do some websites switch pages without a white-screen refresh, as smooth as a native app?** This is the magic of frontend routing. This chapter will take you from the traditional "page-flip" style of website navigation into the "slide transition" world of single-page applications, helping you understand how frontend routing elevates the user experience to the next level.
:::

---

## 1. Motivation for the "Frontend Routing"

### 1.1 From Traditional Websites to SPAs: A Quantum Leap in UX

Think back to the early days of browsing the web — every link click was a full "page turn": a white flash, a spinning loader, the entire page re-rendering. On a slow connection, you'd stare at that spinner for seconds. This experience feels outdated today, but back then it was standard practice.

Modern frontend development has completely changed this model. We use frontend routing techniques to make page transitions as smooth as a mobile app — no white flash, no loading spinner, the user barely notices the "navigation" at all. This improvement isn't magic; it's the work of a frontend routing system.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📖 Traditional Websites (MPA)**
- Click a link → full page refresh
- Each page is an independent HTML file
- Browser re-downloads all resources
- Feels like "turning a book page" — a noticeable transition

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**📱 Single-Page Applications (SPA)**
- Click a link → refresh-free transition
- Only one HTML entry file
- Only downloads necessary data
- Feels like a "slide show" — smooth and natural

</div>
</div>

**This is the core problem frontend routing solves: switching views and synchronizing the URL — all without refreshing the page.**

<RouteMatchingDemo />

### 1.2 A Real-World Pitfall: Why You Need to Understand Routing Modes

You might be thinking: "I just use Vue Router or React Router, configure a few routes, and it works. Why do I need to understand the underlying principles?" Let me tell you a real story that will make it clear why this knowledge matters.

::: warning Xiao Li's Deployment Nightmare
Xiao Li is a junior frontend developer who was tasked with building a Vue-based SPA. Everything worked perfectly in local development — route transitions were buttery smooth. But once he deployed the project to the test server, problems appeared: when users directly accessed a route like `example.com/user/123` or refreshed a detail page, they saw a **404 Not Found** error.

Xiao Li was baffled: it worked fine locally, so why a 404 after deployment? He spent ages troubleshooting, even suspecting a server configuration issue.

He eventually asked a senior colleague, who spotted the problem immediately: Xiao Li was using History mode, but the server had no fallback configured. When a user directly accesses `/user/123`, the server tries to find a file at that path — but in an SPA, all routes point to the same `index.html`. The fix was simple: configure the server to fall back to `index.html` for all routes, letting the frontend router take over from there.

Xiao Li learned a lesson that day: **if you don't understand how routing modes work and their server configuration requirements, you won't even know why an error is happening, let alone how to fix it.**
:::

::: info 💡 Key Takeaway
Frontend routing is not "black magic." Understanding how it works lets you quickly pinpoint and resolve deployment, performance, and SEO issues. More importantly, it empowers you to make smarter architectural decisions — when to use Hash mode, when to use History mode, and how to avoid common pitfalls.
:::

---

## 2. Core Concepts: Route, Mode, Navigation

Before diving into specific implementations, we need to clarify a few core concepts. To help you understand them better, let's use a library analogy.

::: tip 🤔 How Do These Concepts Relate to Routing?
Routes, modes, and navigation are the three pillars of a frontend routing system.

When you use Vue Router or React Router, the framework handles:
1. **Route mapping** → defining the correspondence between URLs and components
2. **Mode selection** → deciding between Hash or History mode
3. **Navigation control** → handling page transitions, browser back/forward

So, **understanding these three concepts is the key to knowing what the routing system is actually doing, why special configuration is sometimes needed, and why things break in production.**
:::

### 2.1 Understanding the Routing System Through a Library Analogy

Imagine you're looking for a book in a library. The process is surprisingly similar to how frontend routing works:

| Concept | 📚 Library Analogy | Actual Role | Concrete Example |
|------|-------------|----------|----------|
| **Route** | The mapping between shelf numbers and books | Defines the mapping between URLs and page components | The path `/user/123` maps to the `UserDetail.vue` component |
| **Router** | The library's directory system and location service | The core module that manages all routes and handles navigation | Vue Router, React Router are routers |
| **Routing Mode** | The indexing method (card catalog vs. electronic system) | Determines the URL format and underlying implementation | Hash mode uses `#`, History mode uses normal paths |
| **Navigation** | Walking from one shelf to another | The act of switching between pages | Clicking links, programmatic navigation, browser back/forward |

::: tip 📊 What Can You Learn From This Table?
Let's go through each row:

**Route**: just a "configuration" that tells the system "which URL corresponds to which page." Like a call number mapping to a book's location.

**Router**: the "manager" that finds the matching component for the current URL and renders it. Like a librarian who finds the book based on the call number you provide.

**Routing Mode**: the "implementation approach" that determines what the URL looks like and which underlying technology is used. Like a library using a paper catalog vs. an electronic search system.

**Navigation**: the "action" — the user-triggered behavior of switching pages. Like walking from section A to section B in the library.

Understanding the distinction between these four is crucial: **routes are static configuration, the router is the dynamic manager, the mode is a technical choice, and navigation is user behavior.**
:::

### 2.2 Route: The Contract Between URL and Component

A route is essentially a "contract" that specifies what content should be displayed when a given URL is accessed. In Vue Router, a typical route configuration looks like this:

```javascript
const routes = [
  {
    path: '/',           // URL path
    component: Home      // the corresponding component
  },
  {
    path: '/user/:id',   // dynamic route with a parameter
    component: UserDetail,
    children: [          // nested routes
      { path: 'profile', component: UserProfile },
      { path: 'posts', component: UserPosts }
    ]
  }
]
```

**You might wonder: why not just use `<a>` tags for navigation instead of a router?**

The answer lies in the nature of SPAs: an SPA has only one HTML page, and all "page transitions" are really just component swaps within that single page. If you use a traditional `<a href="/user/123">`, the browser will actually request the `/user/123` path, causing a page refresh or a 404 error. The router's job is to intercept those navigation actions and dynamically swap components via JavaScript, enabling refresh-free transitions.

::: details 🔧 Common Route Configuration Patterns
**Static routes** (simplest):
```javascript
{ path: '/home', component: Home }
{ path: '/about', component: About }
```

**Dynamic routes** (with parameters):
```javascript
{ path: '/user/:id', component: UserDetail }
// Matches /user/123, /user/abc, etc.
// The component can access the parameter via route.params.id
```

**Nested routes** (parent-child relationships):
```javascript
{
  path: '/user/:id',
  component: UserLayout,    // parent component
  children: [
    { path: 'profile', component: UserProfile },   // actual path: /user/:id/profile
    { path: 'posts', component: UserPosts }        // actual path: /user/:id/posts
  ]
}
```

**Catch-all routes** (404 pages):
```javascript
{ path: '/:pathMatch(.*)*', component: NotFound }
// Matches all undefined routes
```
:::

### 2.3 Routing Modes: The Essential Difference Between Hash and History

Frontend routing has two mainstream implementation modes: Hash mode and History mode. They differ fundamentally in URL format, underlying implementation, and compatibility.

::: tip 🤔 Why Are There Two Modes?
This is the result of both history and technical trade-offs.

**Hash mode** is the earliest frontend routing approach. It leverages the hash portion of the URL (everything after `#`). Hash changes don't trigger page refreshes, and it has excellent compatibility (even IE8 supports it).

**History mode** is the "standard approach" introduced with HTML5. It uses the History API's `pushState` and `replaceState` methods to make URLs look "normal" (no `#`), but it requires server-side cooperation.

An analogy: Hash mode is like "sticking a post-it note on a room door" (doesn't affect the room structure), while History mode is like "renumbering the rooms" (requires updating the signage system).
:::

| Feature | Hash Mode | History Mode |
|------|-----------|--------------|
| **URL Example** | `https://example.com/#/user/123` | `https://example.com/user/123` |
| **Implementation** | Listens for `hashchange` events | Uses History API (`pushState`, `replaceState`) |
| **Server Config** | Not needed (hash is not sent to the server) | **Must configure fallback to index.html** |
| **Browser Support** | IE8+ (virtually all browsers) | IE10+ (modern browsers) |
| **SEO Friendliness** | Poor (search engines may ignore hash) | Good (clean URL structure) |
| **User Experience** | URL has `#`, looks like an "anchor jump" | Clean URL, resembles traditional websites |
| **Deployment Difficulty** | Low, no special configuration needed | High, requires correct server configuration |

<HashVsHistoryDemo />

::: tip 📊 What Can You Learn From This Table?
Let's go through each row:

**URL Example**: Hash mode URLs have a visible `#`, so users immediately recognize it as an SPA. History mode URLs look like traditional websites — more "professional."

**Implementation**: Hash mode listens for `hashchange` events (fired when the hash changes). History mode uses the HTML5 History API, which can "pretend" the page navigated without actually refreshing.

**Server Config**: This is the most common pitfall! In Hash mode, everything after `#` is never sent to the server, so the server doesn't need to know about routes. But in History mode, the full path is sent to the server — if it's not configured properly, you'll get a 404.

**SEO Friendliness**: Search engine crawlers typically don't execute JavaScript, so Hash mode URLs may be ignored. History mode URLs have a clean structure and are more easily indexed.

**Deployment Difficulty**: Hash mode works "out of the box." History mode requires ops knowledge (Nginx, Apache, etc.). This is why many personal projects default to Hash mode.
:::

---

## 3. The Evolution: From Traditional Websites to Modern Routing

With all those concepts covered, let's look at a real-world case study: how an e-commerce site evolved step by step from a traditional multi-page app to a modern SPA with routing. This will give you a more intuitive understanding of the problems frontend routing solves.

::: tip 📖 Background: What Are MPA, SPA, and SSR?
Before diving into the case study, a quick primer on these terms:

- **MPA (Multi-Page Application)**: The traditional way of building websites. Each page is an independent HTML file, and navigation triggers a full page refresh.
- **SPA (Single-Page Application)**: The mainstream modern frontend approach. Only one HTML entry point; page transitions are handled by dynamically swapping components with JavaScript — no refresh.
- **SSR (Server-Side Rendering)**: Generating the full HTML on the server. Combines the best of SPA and MPA — fast initial render and good SEO.

**A simple way to think about it**: MPA is "redraw the entire page every time," SPA is "erase and redraw on the same sheet of paper," and SSR is "the paper is already drawn before you get it."
:::

### 3.1 The Big Picture of Evolution

The table below shows the four evolutionary stages of frontend applications, illustrating how routing technology has developed step by step:

| Stage | App Type | Routing Implementation | Core Characteristics | User Experience |
|------|---------|---------|---------|---------|
| **Stage 1: Traditional MPA** | MPA | Server-side routing | Each page is an independent HTML file | Refresh on every navigation |
| **Stage 2: Early SPA** | SPA (Hash mode) | Hash routing | URL has `#`, good compatibility | No refresh, but URL looks unpolished |
| **Stage 3: Modern SPA** | SPA (History mode) | History routing | Clean URL, requires server config | Smooth, URL resembles traditional websites |
| **Stage 4: Hybrid Rendering** | SPA + SSR | Isomorphic routing | Server-rendered first screen, client-side routing thereafter | Fast first screen, good SEO, smooth interactions |

::: tip 📊 What Can You Learn From This Table?
Let's go through each row:

**Stage 1 → Stage 2**: From "with refresh" to "without refresh" — a qualitative leap. Users experienced app-like smoothness for the first time, at the cost of a `#` in the URL that looked less professional.

**Stage 2 → Stage 3**: From "it works" to "it works well." History mode made URLs clean and closer to traditional websites, at the cost of added deployment complexity (server configuration required).

**Stage 3 → Stage 4**: From "great UX" to "great UX + great SEO." SSR solved the SEO problem of SPAs and made the first screen render faster, but significantly increased implementation complexity.

**In summary**: the evolution of frontend routing isn't just about "faster transitions" — it's about **upgrading the entire application architecture**. From server-driven to client-driven, and then to a hybrid of both, each step balances UX, development cost, SEO, and other dimensions.
:::

### 3.2 Stage 1: Traditional Multi-Page Apps — Refresh Every Time

Why "traditional multi-page app"? Because at this stage, every page was an independent HTML file, and the browser re-downloaded all resources (HTML, CSS, JS) on every navigation. This was the earliest way of building for the web, and many traditional sites still work this way.

At this stage, the e-commerce site "BuyMore" used a typical MPA architecture:

**Development approach**:
- **Routing**: Server-side routing — each page corresponds to an HTML file on the server
- **Navigation**: Using `<a href="/products/123">`, triggering a full page refresh
- **State management**: Page state (scroll position, form content, etc.) is lost on every navigation

**Characteristics of this stage**:
- ✅ **Pros**: Simple to implement, search-engine friendly (good SEO), browser back/forward works out of the box
- ❌ **Cons**: Refresh on every navigation, poor UX, heavy server load (re-downloading the same resources repeatedly)

::: details View the Project Structure and Navigation Flow
**Project structure** (typical server-rendered setup):
```
server/
├── views/              # HTML templates
│   ├── index.html      # Homepage template
│   ├── products.html   # Product listing template
│   └── product.html    # Product detail template
├── public/             # Static assets
│   ├── css/
│   ├── js/
│   └── images/
└── server.js           # Server entry point
```

**Page navigation flow**:
```
1. User clicks link <a href="/products/123">
       ↓
2. Browser sends a GET request to the server
       ↓
3. Server renders product.html, injects data
       ↓
4. Returns a complete HTML page
       ↓
5. Browser parses HTML, downloads CSS/JS, renders the page
       ↓
6. User sees the page (this process typically takes 1–3 seconds)
```

**User pain points**:
- White screen after clicking a link, long wait times
- Same CSS/JS files re-downloaded on every navigation
- Browser back/forward reloads the page
- Can't preserve complex page state (filters, scroll position)
:::

This approach was tolerable for small websites, but as sites grew larger and user expectations rose, these problems began to seriously impact user retention and conversion rates.

### 3.3 Stage 2: Early SPAs — The Era of Hash Routing

As the problems with traditional MPAs piled up, the BuyMore team decided to adopt frontend routing and upgrade to an SPA architecture. This was a major turning point — from "server-driven" to "client-driven."

But this stage came with its own costs: the `#` in the URL looked unprofessional, and search engine indexing was problematic.

**Development approach**:
- **Routing**: Hash routing, leveraging the `#` portion of the URL
- **Navigation**: JavaScript intercepts link clicks and dynamically swaps components
- **State management**: Page state is preserved on the client, no reload needed

**Characteristics of this stage**:
- ✅ **Pros**: Refresh-free transitions, smooth UX, reduced server load
- ❌ **Cons**: URL has `#`, poor SEO, slower initial load

::: details How Hash Routing Is Implemented
**Project structure** (typical early SPA setup):
```
project/
├── index.html          # The single HTML entry file
├── css/
│   └── app.css         # All styles bundled into one file
├── js/
│   ├── router.js       # Simple routing implementation
│   ├── views/          # Page components
│   │   ├── Home.js
│   │   ├── ProductList.js
│   │   └── ProductDetail.js
│   └── app.js          # App entry point
└── server.js           # Simple static file server
```

**Core Hash routing code**:
```javascript
// router.js - simplified Hash routing implementation
class HashRouter {
  constructor(routes) {
    this.routes = routes
    this.currentPath = null

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.matchRoute()
    })

    // Initialize
    this.matchRoute()
  }

  matchRoute() {
    // Get the current hash (strip the #)
    const hash = window.location.hash.slice(1) || '/'
    const route = this.routes.find(r => r.path === hash)

    if (route) {
      this.render(route.component)
    } else {
      this.render(NotFoundComponent)
    }
  }

  render(component) {
    const app = document.getElementById('app')
    app.innerHTML = component.template()
    component.mount?.(app)
  }

  navigate(path) {
    window.location.hash = path
  }
}

// Usage
const router = new HashRouter([
  { path: '/', component: Home },
  { path: '/products', component: ProductList },
  { path: '/products/:id', component: ProductDetail }
])

// Navigate
router.navigate('/products/123')
```

**URL format**:
- Homepage: `https://example.com/#/`
- Product listing: `https://example.com/#/products`
- Product detail: `https://example.com/#/products/123`

**Improvements delivered**:
1. **Better UX**: Page transitions are refresh-free, smooth and natural
2. **Reduced server load**: HTML/CSS/JS loaded once, subsequent requests are data-only
3. **State preservation**: Scroll position, form content, and other state persists across navigation
4. **Offline-friendly**: Can support offline access with Service Workers

**New pain points**:
1. **Unpolished URLs**: The `#` makes URLs look like "anchor jumps" — less professional
2. **SEO issues**: Search engine crawlers may ignore content after the hash, preventing indexing
3. **Slow initial load**: All JavaScript must be loaded upfront, increasing time-to-first-screen
:::

### 3.4 Stage 3: Modern SPAs — History Routing Becomes Mainstream

The pain points of Hash routing (unpolished URLs, poor SEO) frustrated developers for years. With the widespread adoption of HTML5 and improved browser compatibility, History routing gradually became the mainstream.

History routing leverages the HTML5 History API to make URLs look "normal" (no `#`), at the cost of requiring server-side cooperation.

**Development approach**:
- **Routing**: History routing, using `pushState` and `replaceState`
- **Routing libraries**: Mature libraries like Vue Router, React Router
- **Server config**: Must configure the server to fall back all routes to `index.html`

**Characteristics of this stage**:
- ✅ **Pros**: Clean URLs, SEO-friendly, smooth UX
- ❌ **Cons**: Requires special deployment configuration, server-side cooperation is mandatory

::: details History Routing Implementation and Deployment Configuration
**Project structure** (typical modern SPA setup):
```
project/
├── public/
│   └── index.html          # The single HTML entry
├── src/
│   ├── router/
│   │   └── index.js        # Route configuration
│   ├── views/              # Page components
│   │   ├── Home.vue
│   │   ├── ProductList.vue
│   │   └── ProductDetail.vue
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js          # Build configuration
```

**Vue Router configuration example**:
```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),  // History mode
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/products', component: () => import('@/views/ProductList.vue') },
    { path: '/products/:id', component: () => import('@/views/ProductDetail.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
  ]
})

export default router
```

**URL format**:
- Homepage: `https://example.com/`
- Product listing: `https://example.com/products`
- Product detail: `https://example.com/products/123`

**Critical: Nginx configuration** (must be configured for deployment):
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/app;
    index index.html;

    # Key configuration: all routes fall back to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Why is this configuration needed?**

```
Scenario: user directly accesses https://example.com/products/123

❌ Without the configuration:
1. Browser requests /products/123 from the server
2. Nginx looks for /products/123 in the filesystem
3. File not found → returns 404

✅ With try_files configured:
1. Browser requests /products/123 from the server
2. Nginx tries to find the file → doesn't exist
3. Falls back to /index.html (per try_files rule)
4. Browser loads index.html
5. Vue Router takes over, parses /products/123
6. Renders the ProductDetail component
7. Page displays correctly!
```

**Comparison with Hash mode**:
| Comparison | Hash Mode | History Mode |
|--------|----------|-------------|
| URL | `/#/products/123` | `/products/123` |
| Server config | Not needed | **Must configure** |
| Direct access | ✅ Works fine | ❌ Requires server support |
| SEO | ⚠️ Poor | ✅ Good |
:::

### 3.5 Stage 4: Hybrid Rendering — The Ultimate SPA + SSR Solution

Once History routing matured, the team began focusing on deeper questions: how to preserve the smooth SPA experience while also solving SEO and slow initial load problems?

The core of this stage is "isomorphic rendering" — the first screen is rendered on the server (good SEO, fast load), and subsequent interactions are handled by the frontend router (smooth UX).

**Development approach**:
- **Framework choice**: Next.js (React), Nuxt.js (Vue)
- **Rendering strategy**: Server-side rendering + client-side hydration
- **Routing mode**: History mode (server is already configured)

**Characteristics of this stage**:
- ✅ **Pros**: Fast first screen, good SEO, smooth subsequent interactions
- ❌ **Cons**: High implementation complexity, requires a server runtime environment

::: details How Hybrid Rendering Works
**Page loading flow**:
```
1. User visits /products/123
       ↓
2. Server receives the request
       ↓
3. Server renders the ProductDetail component → generates complete HTML
       ↓
4. Returns HTML to the browser (with full content)
       ↓
5. Browser displays content quickly (fast first-screen render)
       ↓
6. JavaScript loads, hydration executes
       ↓
7. Subsequent navigation is handled by the frontend router (no refresh)
```

**Traditional SPA vs. SSR — first-screen comparison**:

| Comparison | Traditional SPA | SSR |
|--------|---------|-----|
| First-screen content | White screen → load JS → render | Content displayed immediately |
| SEO | Crawlers may not see content | Crawlers see complete HTML |
| Time to first screen | Slower (needs JS to load) | Faster (HTML already contains content) |
| Subsequent interactions | Smooth (frontend routing) | Smooth (frontend routing) |
:::

---

## 4. Under the Hood: Working Principles of Routing Actually

Now that we've seen real-world cases, let's dive deeper into how frontend routing works under the hood and understand what really sets Hash and History modes apart.

<RouterArchitectureDemo />

### 4.1 How Hash Mode Works

Hash mode leverages the `hash` portion of the URL (everything after `#`). The hash has two important properties:

1. **Hash changes do not trigger a page refresh**
2. **Hash changes are recorded in the browser's history stack**

This means we can change the URL without refreshing the page, while the browser's back/forward buttons still work correctly.

**Workflow**:

```
User clicks link <a href="#/user/123">
       ↓
Browser updates the URL (no page refresh)
https://example.com/#/user/123
       ↓
hashchange event fires
       ↓
Route listener captures the event
       ↓
Parses the hash value → /user/123
       ↓
Matches against route config → finds UserDetail component
       ↓
Renders component into the page
```

**Core implementation**:

```javascript
class HashRouter {
  constructor(routes) {
    this.routes = routes

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      this.loadRoute()
    })

    // Initial load
    this.loadRoute()
  }

  loadRoute() {
    // Get current hash, strip the leading #
    const hash = window.location.hash.slice(1) || '/'
    const route = this.matchRoute(hash)

    if (route) {
      this.render(route.component)
    }
  }

  matchRoute(path) {
    return this.routes.find(r => r.path === path)
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }

  push(path) {
    window.location.hash = path
  }
}
```

::: tip 💡 Advantages of Hash Mode
- **Great compatibility**: IE8+ supported, works in virtually all browsers
- **Simple deployment**: No server configuration needed, works out of the box
- **Simple implementation**: Just listen for the `hashchange` event
:::

### 4.2 How History Mode Works

History mode leverages the HTML5 History API, which provides `pushState`, `replaceState`, and other methods to change the URL without refreshing the page.

**Core APIs**:

```javascript
// Add a new history entry
history.pushState(state, title, url)
// Example: history.pushState({id: 123}, 'User Detail', '/user/123')

// Replace the current history entry
history.replaceState(state, title, url)

// Listen for history changes (back/forward buttons)
window.addEventListener('popstate', (event) => {
  // event.state contains the state passed to pushState
})
```

**Workflow**:

```
User clicks link <a href="/user/123">
       ↓
JavaScript intercepts the click event
event.preventDefault()
       ↓
Calls history.pushState
history.pushState({id: 123}, 'User Detail', '/user/123')
       ↓
URL updates (no page refresh)
https://example.com/user/123
       ↓
Route matches and renders the component
       ↓
User clicks browser back button
       ↓
popstate event fires
       ↓
Route listener captures the event
       ↓
Renders the corresponding component based on the new URL
```

**Core implementation**:

```javascript
class HistoryRouter {
  constructor(routes) {
    this.routes = routes

    // Intercept all link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a')
      if (link && link.getAttribute('href').startsWith('/')) {
        e.preventDefault()
        this.push(link.getAttribute('href'))
      }
    })

    // Listen for browser back/forward
    window.addEventListener('popstate', () => {
      this.loadRoute()
    })

    // Initial load
    this.loadRoute()
  }

  loadRoute() {
    const path = window.location.pathname
    const route = this.matchRoute(path)

    if (route) {
      this.render(route.component)
    }
  }

  push(path) {
    history.pushState({}, '', path)
    this.loadRoute()
  }

  render(component) {
    document.getElementById('app').innerHTML = component.template()
  }
}
```

::: warning ⚠️ The History Mode Trap
The biggest problem with History mode is: **when a user directly accesses a URL or refreshes the page, the browser sends a request to the server**.

If the server isn't configured correctly, it will return a 404. The solution is to configure the server to fall back all routes to `index.html`, letting the frontend router take over from there.
:::

---

## 5. Routing Configuration: A Practical Guide

That's enough theory. Here are the common routing patterns and best practices used in real projects.

### 5.1 Basic Route Configuration

::: details Complete Vue Router Configuration Example

```javascript
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/user/:id',
      name: 'UserDetail',
      component: () => import('@/views/UserDetail.vue'),
      props: true  // pass route params as props
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    // Scroll behavior: preserve position on back, otherwise scroll to top
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
```

:::

### 5.2 Route Lazy Loading: Boosting Initial Load Performance

Route lazy loading means loading a component only when its route is visited, rather than loading all components upfront. This significantly reduces the initial load time.

```javascript
// ❌ Loading all components at once (slow initial load)
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'
import User from '@/views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user', component: User }
]

// ✅ Lazy loading (fast initial load)
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/about', component: () => import('@/views/About.vue') },
  { path: '/user', component: () => import('@/views/User.vue') }
]
```

<CodeSplittingDemo />

::: tip 💡 How Lazy Loading Works
When you use `import('@/views/Home.vue')`, Webpack/Vite bundles that component into a separate file. The file is only downloaded when the user visits that route.

An analogy: lazy loading is like "ordering dishes as you need them" rather than "bringing all the dishes to the table at once." This reduces initial load time and improves the user experience.
:::

### 5.3 Route Guards: Access Control and Navigation Interception

Route guards let you execute logic before and after route transitions. They're commonly used for authentication, page title setup, data pre-fetching, and more.

```javascript
// Global before-guard
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = to.meta.title || 'My App'

  // Authentication check
  if (to.meta.requiresAuth) {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  next()
})

// Global after-hook
router.afterEach((to, from) => {
  // Page view analytics
  analytics.trackPageView(to.path)
})

// Per-route guard
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] },
    beforeEnter: (to, from, next) => {
      // Logic specific to this route
      if (hasPermission()) {
        next()
      } else {
        next('/403')
      }
    }
  }
]
```

::: tip 💡 Common Use Cases for Route Guards
- **Authentication**: Check if the user has permission to access a page
- **Page title**: Dynamically set document.title
- **Data pre-fetching**: Fetch data before entering the page
- **Progress bar**: Show a progress indicator during page transitions
- **Analytics**: Track page views
:::

---

## 6. Common Problems and Solutions

### 6.1 404 on Refresh After Deployment

**Problem**: Works fine in local development, but after deploying to a server, directly accessing a route or refreshing the page shows a 404.

**Cause**: In History mode, the server treats the URL as a file path to look up, but in an SPA all routes point to `index.html`.

**Solution**: Configure server fallback.

```nginx
# Nginx configuration
location / {
    try_files $uri $uri/ /index.html;
}
```

```apache
# Apache configuration (.htaccess)
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 6.2 Route Params Lost on Refresh

**Problem**: After a page refresh, `$route.params` is lost.

**Cause**: Route params only exist during navigation; they need to be re-parsed from the URL after a refresh.

**Solution**:

```javascript
// ❌ Wrong approach: only fetch params in created
created() {
  const userId = this.$route.params.id
  this.fetchUser(userId)
}

// ✅ Correct approach: watch for route changes
watch: {
  '$route.params.id': {
    immediate: true,
    handler(newId) {
      this.fetchUser(newId)
    }
  }
}
```

### 6.3 Abnormal Scroll Position on Page Transitions

**Problem**: After navigating, the scroll position isn't reset, or the previous position isn't preserved when going back.

**Solution**: Configure the router's `scrollBehavior`.

```javascript
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // Preserve scroll position when going back
    if (savedPosition) {
      return savedPosition
    }
    // Scroll to anchor
    if (to.hash) {
      return { el: to.hash }
    }
    // Otherwise scroll to top
    return { top: 0 }
  }
})
```

---

## 7. Summary

Let's review the core concepts of frontend routing with a table:

| Concept | One-Liner | Problem Solved | Representative Solution |
|------|-----------|-----------|----------|
| **Route** | Mapping between URL and component | Display different content for different URLs | Vue Router, React Router |
| **Hash Mode** | Routing via URL hash | Good compatibility, simple deployment | Vue Router Hash mode |
| **History Mode** | Routing via History API | Clean URLs, good SEO | Vue Router History mode |
| **Route Lazy Loading** | Load route components on demand | Reduce initial load time | `() => import('./Page.vue')` |
| **Route Guards** | Hooks before/after route transitions | Access control, data pre-fetching | `beforeEach`, `beforeEnter` |
| **Dynamic Routes** | Routes with parameters | Match a class of paths rather than a single one | `/user/:id` |

::: info Final Words
Frontend routing is one of the core technologies of modern single-page applications. From the early Hash mode to today's mainstream History mode, routing technology has continuously evolved to deliver a smoother browsing experience.

Understanding the principles and modes of routing lets you quickly pinpoint and resolve deployment, performance, and SEO issues. More importantly, it empowers you to make smarter architectural decisions — when to use Hash mode, when to use History mode, and how to avoid common pitfalls.

I hope this article helps you build a solid mental model of frontend routing, so that when you encounter routing-related problems in real projects, you'll know where to start, how to diagnose, and how to resolve them.
:::
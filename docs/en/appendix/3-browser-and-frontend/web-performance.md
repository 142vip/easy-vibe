# Principles of Web Performance Optimization
::: tip 🎯 Core Question
**Why is your webpage loading slowly, with users furiously complaining about lag?** It's like asking: why is the restaurant slow to serve, with customers growing impatient? This chapter will take you deep into the core concepts of frontend performance optimization, making your web pages "fly."
:::

---

## 1. Motivation for the "Performance Optimization"

### 1.1 From Functional to Excellent: The Evolution of Performance Optimization

Web pages ten years ago were extremely simple — a single page might be just a few KB, and loading speed was virtually instant. Back then, we didn't need to consider performance optimization at all — because the problem hadn't appeared yet.

But things are completely different now. Modern web page complexity has grown exponentially: an e-commerce homepage might have dozens of high-resolution images, a social platform might load thousands of posts simultaneously, and an admin dashboard might contain dozens of interactive components. Behind these "rich" features lie massive codebases and resource sizes — without proper optimization, the user experience will be terrible.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**👴 Web Pages Ten Years Ago**
- Single page only a few KB to tens of KB
- Only text and a few images
- Users barely noticed loading delays
- No performance optimization needed

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 Modern Web Pages**
- Single page could be several MB or larger
- Has high-res images, videos, interactive components
- Slow loading, laggy scrolling, unresponsive clicks
- Performance optimization is mandatory

</div>
</div>

**This is the problem "performance optimization" aims to solve: make users wait less, make interactions smoother.**

### 1.2 Case: You Need to Understand Performance Optimization

You might say: "Networks are so fast and devices are so good now — do we still need to consider performance optimization?" Let me tell you a real story, and you'll understand why this knowledge is so important.

::: warning Xiao Wang's Performance Pitfall Story
Xiao Wang is a newly hired frontend engineer responsible for developing the company's e-commerce homepage. He used the latest Vue 3 and the most popular UI library, with fully featured functionality. Everything worked fine when he tested on his high-performance work computer.

But the day after launch, the customer service department exploded — large numbers of users complained that "the website is too laggy," "images won't load," and "clicking buttons takes forever with no response." Xiao Wang opened his development machine to test, and everything was smooth. He couldn't understand where the problem was.

Later, he asked a senior colleague to help diagnose the issue. The senior told him to use an ordinary laptop connected to a regular 4G network, then test his website. Xiao Wang was shocked: the homepage took over ten seconds to load, scrolling through the list was as choppy as a slideshow, and clicking buttons took several seconds to respond.

It turned out that Xiao Wang's development environment was a top-spec MacBook Pro + gigabit fiber, while most users used ordinary devices + mobile networks. His code contained dozens of uncompressed high-resolution images, he imported the entire UI library but only used a few components, and he did heavy synchronous computations during rendering.

The solution was actually not complicated: compress images, import components on demand, move computations to background threads, and use virtual lists. After these changes, the homepage load time dropped from over ten seconds to 2 seconds, scrolling became very smooth, and user complaints disappeared immediately.

Xiao Wang learned an important lesson from then on: **Without understanding performance optimization, code that runs blazingly fast on your own computer might be completely unusable on users' devices.**
:::

::: info 💡 Core Takeaway
Performance optimization is not optional — it's an essential skill. You need to think from the user's perspective: they use ordinary devices and ordinary networks. If your code doesn't run well on their devices, it means you need to optimize.
:::

---

## 2. Core Concepts: Loading, Rendering, Interaction

::: tip 🤔 How do these concepts relate to performance?
Loading, rendering, and interaction are the three core stages of a user visiting a webpage — each stage can become a performance bottleneck.

When a user visits your webpage, they go through:
1. **Loading** → Download HTML/CSS/JS/images from the server to the browser
2. **Rendering** → Convert the downloaded content into a page the user can see
3. **Interaction** → Respond to user clicks, scrolls, and other actions

So, **performance optimization is about making all three of these stages faster**. Understanding them lets you know where performance bottlenecks are and what methods to use for optimization.
:::

Before diving into specific optimization techniques, we need to clarify these core concepts. To help you better understand, we'll use a restaurant analogy to illustrate their relationships.

### 2.1 Understanding the Three Stages with a Restaurant Analogy

Imagine going to a restaurant for a meal — this process is surprisingly similar to visiting a webpage:

| Stage | 🍽️ Restaurant Analogy | Actual Function | Concrete Example |
|------|-------------|----------|----------|
| **Loading** | Transporting ingredients from warehouse to kitchen | Downloading HTML/CSS/JS/images from server to browser | User opens webpage, browser starts downloading resources |
| **Rendering** | Chef processing ingredients into dishes | Browser converting code into a visible page | Browser parsing HTML, calculating layout, painting the page |
| **Interaction** | Waiter responding to customer requests | Browser responding to clicks, scrolls, and other actions | User clicks a button, page provides feedback |

### 2.2 Loading: Ingredient Transport

Loading is the process of downloading all the resources a webpage needs (HTML, CSS, JavaScript, images, fonts, etc.) from the server to the browser. This process is like transporting ingredients from a warehouse to the kitchen — if transport is slow or there are too many ingredients, the kitchen just has to wait.

**Why is loading slow?** There are three main reasons: first, resource size is too large — a single uncompressed high-resolution image might be 5MB, equivalent to downloading a novel; second, network latency — if the server is overseas or the user is on a mobile network, every request takes a long time; finally, too many requests — browsers have a limit on simultaneous downloads, so too many resources have to queue up.

::: details 🔍 See what happens during the loading stage
After a user types a URL in the browser address bar and presses Enter, the following happens in sequence:

1. **DNS Resolution**: Convert the domain name (e.g., `www.example.com`) to an IP address (e.g., `192.168.1.1`), like looking up a restaurant's address in a phone book
2. **TCP Connection**: Browser establishes a connection with the server, like dialing before making a phone call
3. **TLS Handshake**: Establish a secure connection (HTTPS), like verifying the other party's identity
4. **Request Resources**: Browser requests the HTML file from the server
5. **Parse HTML**: Browser parses HTML, discovers it needs CSS, JS, images, etc., and continues requesting
6. **Download Resources**: Downloads all needed resources locally
7. **Begin Rendering**: After download is complete, starts rendering the page

Steps 1-4 are called "Time to First Byte" (TTFB), and steps 5-7 are the actual resource download time.
:::

**Common loading optimization techniques:**

- **Compress resources**: Make files smaller (Gzip, Brotli compression)
- **Use CDN**: Store files on servers closer to users
- **Lazy loading**: Only load content users can see; load the rest when users scroll
- **Code splitting**: Split large files into small files, load on demand

### 2.3 Rendering: Chef Cooking

Rendering is the process of converting downloaded HTML, CSS, and JavaScript into a page the user can see. This process is like a chef processing ingredients into dishes — if the process is complex with many steps, serving will be slow.

::: tip 📖 What is "rendering"?
You may have heard the term "rendering" — what exactly is it?

**Simply put, rendering is the process of turning code into visuals.**

What the browser does includes:
1. **Parse HTML** → Generate DOM tree (page structure)
2. **Parse CSS** → Generate CSSOM tree (page styles)
3. **Merge** → Generate render tree (combination of structure and styles)
4. **Layout** → Calculate each element's position and size
5. **Paint** → Draw the elements
6. **Composite** → Merge multiple layers into the final image

This process is very complex — any problem in any step can cause page lag.
:::

**Why is rendering slow?** There are two main reasons: first, the page is too complex — if a page has tens of thousands of DOM nodes, the browser's layout calculation and painting will be very time-consuming; second, frequent page modifications — if JavaScript code frequently modifies the DOM, it causes the browser to repeatedly recalculate layout and repaint, consuming significant performance.

::: details 📁 See what happens during the rendering stage
**Complete rendering flow**:

```
HTML (string)
    ↓
[Parse HTML] → Generate DOM tree
    ↓
DOM tree (page structure)

CSS (stylesheet)
    ↓
[Parse CSS] → Generate CSSOM tree
    ↓
CSSOM tree (page styles)

DOM tree + CSSOM tree
    ↓
[Merge] → Generate render tree
    ↓
Render tree (elements to render)
    ↓
[Layout] → Calculate each element's position and size
    ↓
[Paint] → Fill colors, draw text
    ↓
[Composite] → Merge multiple layers
    ↓
Final image
```

**Critical Rendering Path**: The browser needs to render the first screen content as quickly as possible, making users feel "the website is fast." This is called "Critical Rendering Path optimization."
:::

👇 **Try it out**:
The demo below shows how the browser renders a page. Click "Next" to observe each stage of rendering:

<PerformanceOverviewDemo />

**Common rendering optimization techniques:**

- **Reduce reflows and repaints**: Avoid frequent DOM modifications, use `transform` and `opacity` instead of `top` and `width`
- **Virtual lists**: Only render visible area content, significant performance improvement for large datasets
- **CSS animations**: Use CSS animations instead of JavaScript animations for better performance

### 2.4 Interaction: Waiter Response

Interaction is the process of the browser responding to user actions (clicks, scrolls, input, etc.). This process is like a waiter responding to customer requests — if the waiter is too busy, customers have to wait.

**Why does interaction lag?** The main reason is **the main thread is blocked**. The browser's JavaScript is single-threaded — if code is executing complex calculations, it can't respond to user actions, causing page lag.

::: tip 🤔 What is the "main thread"?
The browser has multiple threads, but only one is responsible for executing JavaScript, rendering pages, and responding to user actions — the **main thread**.

Think of the main thread as a **busy waiter** who needs to do many things:
- Execute JavaScript code (calculate data, call APIs)
- Render pages (layout, paint)
- Respond to user actions (click buttons, scroll pages)

The problem is: **there's only one of them**. If they're executing complex JavaScript calculations (like processing 10,000 data items), and the user clicks a button, they can't respond immediately — they must wait until the calculation is done. This is the root cause of **lag**.

**Solutions**:
- Move complex calculations to Web Workers (background threads)
- Use time slicing to split large tasks into small ones
- Avoid synchronous complex operations, use async instead
:::

👇 **Try it out**:
The demo below compares synchronous computation and Web Workers. Click "Start Calculation" and observe whether the page lags:

<PerformanceMetricsDemo />

**Common interaction optimization techniques:**

- **Debounce and throttle**: Limit event trigger frequency (e.g., scroll events, input events)
- **Web Workers**: Move complex calculations to background threads, don't block the main thread
- **Time slicing**: Split large tasks into small ones, giving the browser a chance to respond to user actions

---

## 3. Practice: A Team's Performance Optimization Evolution

Having covered so many concepts, let's look at a real-world case: how a startup evolved from "completely ignoring performance" to "systematic performance optimization" step by step. Through this case, you'll more intuitively understand what problems performance optimization solves.

### 3.1 Evolution Overview

The table below shows the four stages of performance optimization — you can see how optimization techniques, tools, and metrics evolved step by step:

| Stage | Optimization Techniques | Monitoring Tools | Core Metrics | Key Change |
|------|---------|---------|---------|----------|
| **Stage 1: Primitive Era** | None (not considered) | None (by feel) | None | No performance awareness at all, just make it run |
| **Stage 2: Manual Optimization** | Compress images, reduce requests | Browser Network panel | Page load time | Started becoming aware, but methods were primitive |
| **Stage 3: Systematic Optimization** | Code splitting, lazy loading, virtual lists | Lighthouse, Performance panel | FCP, LCP, TBT | Using professional tools with clear optimization targets |
| **Stage 4: Continuous Optimization** | Performance budgets, CI/CD checks | RUM, Lighthouse CI | INP, CLS, full-chain monitoring | Integrating performance into the development process |

::: tip 📊 What can you see from the table?
Let's interpret each row:

**Stage 1 → Stage 2**: From "no awareness" to "awareness." This is a critical step — developers start realizing performance is an issue and try to optimize. But optimization methods are fairly primitive, mainly relying on feel and experience.

**Stage 2 → Stage 3**: From "manual" to "systematic." This is a qualitative leap — starting to use professional tools (Lighthouse, Performance panel) to diagnose performance issues, using scientific methods (code splitting, lazy loading) for optimization, rather than relying on feel.

**Stage 3 → Stage 4**: From "one-time optimization" to "continuous optimization." When performance optimization becomes part of the development process, you need to establish monitoring systems (RUM, real user monitoring), set performance budgets during development, and prevent regression.

**In summary**: Performance optimization evolution is not just about "using more techniques" — it's an **upgrade in mindset** — from reactive to proactive, from feeling-based to data-driven, from one-time optimization to continuous improvement.
:::

### 3.2 Stage 1: Primitive Era — Completely Unconsidered

Why call it the "primitive era"? Because at this stage, performance was not considered at all — just make it run. The team had only 3 people building a simple corporate website with a small project that seemed to have no problems.

But as the project grew larger and user count increased, problems started to surface.

**Development approach**:
- **Optimization techniques**: None — developed directly, no performance consideration
- **Monitoring tools**: None — judged speed by feel
- **Core metrics**: None

**Characteristics of this stage**:
- ✅ **Pros**: Fast development, no extra learning cost
- ❌ **Cons**: Poor user experience, unusable on slow networks

::: details See the problems at that time
**Specific problems encountered**:

1. **Images too large**: PM uploaded a 5MB homepage banner image — mobile network users waited 1 minute to open the page
2. **No compression**: CSS and JS files had zero compression — 3x the size of compressed versions
3. **No caching**: Every visit re-downloaded all resources, even returning users had to wait
4. **Synchronous loading**: All JS files loaded synchronously in `<head>`, blocking page rendering

**User feedback**:
- "Why won't your website open?"
- "Images take forever to load, it's just blank"
- "Clicking buttons does nothing, is the website broken?"

**Temporary solution at the time**:
```html
<!-- Use a loading overlay to "trick" users -->
<div id="loading">Loading...</div>
<script>
  // Only remove overlay after page loads
  window.onload = function() {
    document.getElementById('loading').style.display = 'none'
  }
</script>
```

This was pure self-deception — the page was still slow, users just couldn't see it.
:::

### 3.3 Stage 2: Manual Optimization — Becoming Aware

Problems from the primitive era accumulated to a point where the team finally decided to start performance optimization. This was an important turning point — from "completely ignoring" to "consciously optimizing."

But optimization at this stage was fairly primitive, mainly relying on simple techniques like compressing images and merging files.

**Development approach**:
- **Optimization techniques**: Manually compress images, merge CSS/JS files, reduce HTTP requests
- **Monitoring tools**: Browser Network panel, simple timing logs
- **Core metrics**: Page load time (manually timed with a stopwatch)

**Characteristics of this stage**:
- ✅ **Pros**: Noticeable improvement, users stopped complaining frantically
- ❌ **Cons**: Unsystematic optimization, easy to regress, lacks quantitative metrics

::: details See the specific manual optimization approaches
**Manual optimization techniques**:

1. **Manually compress images**:
   - Use Photoshop to manually "Save for Web" on each image
   - Convert PNG to JPEG (lossy compression, but much smaller)
   - Reduce image dimensions (e.g., shrink a 2000px-wide image to 800px)

2. **Manually merge files**:
   ```html
   <!-- Before: 10 JS files = 10 requests -->
   <script src="utils.js"></script>
   <script src="api.js"></script>
   <script src="component-a.js"></script>
   <script src="component-b.js"></script>
   ...（6 more）

   <!-- After: 1 merged JS file = 1 request -->
   <script src="all.js"></script>
   ```

3. **Move CSS/JS to bottom of page**:
   ```html
   <body>
     <!-- Page content -->
     <h1>Welcome</h1>

     <!-- Optimization: put CSS/JS last -->
     <link rel="stylesheet" href="style.css">
     <script src="app.js"></script>
   </body>
   ```

**Improvements achieved**:
- Image size reduced from 5MB to 500KB (90% reduction)
- HTTP requests reduced from 30 to 5
- Page load time reduced from 30 seconds to 8 seconds

**New pain points**:
1. **High manual workload**: Every update requires manually compressing images and merging files
2. **Easy to forget**: New team members don't know to optimize, upload raw images directly
3. **Lack of quantification**: Only know "it got faster," but not exactly how much faster
:::

### 3.4 Stage 3: Systematic Optimization — Using Tools and Data

Stage 2 problems (high manual workload, lack of quantification) troubled the team for a long time. Then the team discovered professional tools like Lighthouse and the Performance panel, entering the systematic optimization era.

The core of this stage is **data-driven optimization** — first diagnose problems with tools, find performance bottlenecks, then optimize with targeted solutions.

**Development approach**:
- **Optimization techniques**: Code splitting, lazy loading, virtual lists, automatic image compression
- **Monitoring tools**: Lighthouse, Chrome Performance panel, WebPageTest
- **Core metrics**: FCP (First Contentful Paint), LCP (Largest Contentful Paint), TBT (Total Blocking Time)

::: details Specific systematic optimization approaches
**Using Lighthouse to diagnose problems**:

Lighthouse is an automated performance testing tool developed by Google that provides comprehensive performance reports and optimization suggestions.

```bash
# Test a webpage with Lighthouse
lighthouse https://www.example.com --view
```

Lighthouse provides:
- **Performance score** (0-100)
- **Core metrics** (FCP, LCP, CLS, TBT, INP)
- **Optimization suggestions** (e.g., "Enable text compression," "Remove unused JavaScript")

**Key metrics explained**:

| Metric | Full Name | Meaning | Ideal Value |
|------|------|------|--------|
| **FCP** | First Contentful Paint | Time to first content paint (when user sees first piece of content) | <1.8s |
| **LCP** | Largest Contentful Paint | Time to largest content paint (when main content finishes loading) | <2.5s |
| **TBT** | Total Blocking Time | Total time the main thread is blocked | <200ms |
| **CLS** | Cumulative Layout Shift | Cumulative layout shift (how much page elements jump around) | <0.1 |

:::

**Characteristics of this stage**:
- ✅ **Pros**: Targeted optimization, good results, quantitative metrics
- ❌ **Cons**: Requires learning tools and metrics, has some learning curve

::: details See the specific systematic optimization techniques
**1. Code Splitting**:

Split large files into small ones and load on demand. For example, when users visit the homepage, only load the code needed for the homepage. When they click "About Us," then load the About page code.

```js
// Before: all code in one file, loaded at once
import About from './views/About.vue'
import Contact from './views/Contact.vue'
// ... 10 more pages

// After: lazy loading, load when visited
const About = () => import('./views/About.vue')
const Contact = () => import('./views/Contact.vue')
```

**Effect**: Homepage code volume reduced by 70%, first screen time dropped from 5 seconds to 1.5 seconds.

**2. Image Lazy Loading**:

Only load images the user can see; load other images when scrolled into the viewport.

```html
<!-- Modern browsers support native lazy loading -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
```

**Effect**: Homepage image count loaded dropped from 20 to 3, saving 80% bandwidth.

**3. Virtual Scrolling**:

When rendering 10,000 data items, don't actually create 10,000 DOM nodes — only render the 20 items in the visible area, dynamically replacing them on scroll.

```vue
<!-- Using vue-virtual-scroller component -->
<RecycleScroller
  :items="items"
  :item-size="50"
  key-field="id"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

**Effect**: 10,000 items went from "frozen" to "smooth scrolling," memory usage reduced by 95%.
:::

### 3.5 Stage 4: Continuous Optimization — Integrating Performance into the Development Process

When tools and methods matured, the team started focusing on deeper issues: how to prevent performance regression? How to make performance part of the development process?

The core of this stage is **establishing performance monitoring and budget systems** — not optimizing after launch, but preventing performance issues during development.

**Development approach**:
- **Optimization techniques**: Performance budgets, Lighthouse CI, Real User Monitoring (RUM)
- **Monitoring tools**: Lighthouse CI, WebPageTest API, Google Analytics
- **Core metrics**: INP (Interaction latency), CLS (Layout shift), full-chain monitoring

::: details Specific continuous optimization approaches
**1. Set performance budgets**:

Set limits in build configuration — throw errors when exceeded, preventing "accidentally introducing large files."

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // Limit individual files to 200KB
        chunkFileNames: 'js/[name]-[hash].js',
      }
    },
    // Warn when exceeding 200KB
    chunkSizeWarningLimit: 200
  }
})
```

**2. Lighthouse CI**:

Automatically run Lighthouse tests on every code submission — if performance scores drop, block the merge.

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          urls: |
            https://staging.example.com
          budgetPath: ./budget.json
```

**3. Real User Monitoring (RUM)**:

Collect performance data from real users' browsers, not just from development environment testing.

```js
// Send performance data to server
const perfData = performance.getEntriesByType('navigation')[0]
const lcp = performance.getEntriesByType('largest-contentful-paint')[0]

fetch('/api/perf', {
  method: 'POST',
  body: JSON.stringify({
    fcp: perfData.loadEventEnd - perfData.fetchStart,
    lcp: lcp.renderTime || lcp.loadTime,
    url: window.location.href
  })
})
```

**Effects**:
- Can detect performance regression promptly (e.g., a commit causing LCP to jump from 2s to 5s)
- Can understand real user experience (not the "ideal state" of development environment)
- Can target optimization for the slowest 10% of users
:::

**What does this stage involve?**

1. **Performance budgets**: Limit file sizes, request counts, alert when exceeded
2. **CI/CD checks**: Automatically test performance on every code submission, block merge on regression
3. **Real user monitoring**: Collect real users' performance data for continuous improvement
4. **Regular performance reports**: Generate weekly/monthly performance trend reports

---

## 4. Common Performance Bottlenecks and Solutions

Having covered so much theory, let's look at the most common performance issues in actual development and how to solve them.

### 4.1 Slow Image Loading

**Symptoms**: Images take forever to load, or the page jumps during loading.

**Causes**:
- Image files are too large (high-resolution originals)
- Image dimensions are too large (2000px-wide image displayed at 200px)
- No lazy loading (loading all images at once)

**Solutions**:

1. **Use modern image formats** (WebP, AVIF):

```html
<!-- Modern: WebP format, 30-70% smaller -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Image">
</picture>
```

2. **Responsive images** (load different sizes based on device):

```html
<!-- Small devices load small images, large devices load large images -->
<img
  src="image-800.jpg"
  srcset="image-400.jpg 400w,
          image-800.jpg 800w,
          image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1200px) 800px,
         1200px"
  alt="Responsive image">
```

3. **Lazy loading** (load when user scrolls to):

```html
<!-- Modern: native lazy loading -->
<img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy" />
```

👇 **Try it out**:
The demo below compares lazy loading vs. no lazy loading. Observe the network requests:

<ImageOptimizationDemo />

### 4.2 Slow First Screen Loading

**Symptoms**: User opens webpage, blank screen for a long time.

**Causes**:
- Loading too much unnecessary code
- Critical rendering path is blocked
- No code splitting

**Solutions**:

1. **Code Splitting**:

```js
// Route lazy loading: load when visited
const routes = [
  {
    path: '/about',
    component: () => import('./views/About.vue')  // Only load when visiting /about
  }
]
```

2. **Preload critical resources** (Preload):

```html
<!-- Tell the browser early: these resources are important, prioritize them -->
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="hero-image.jpg" as="image">
```

3. **Inline critical CSS**:

```html
<!-- Embed first-screen CSS directly in HTML -->
<style>
  /* First-screen critical styles */
  .hero { background: #000; color: #fff; }
</style>
```

### 4.3 Scroll Lag

**Symptoms**: Page stutters during scrolling, not smooth.

**Causes**:
- Too many DOM nodes rendered (e.g., 10,000 data items)
- Complex calculations in scroll event listeners
- Frequently triggering layout calculations

**Solutions**:

1. **Virtual Scrolling**:

```vue
<!-- Only render visible area content -->
<RecycleScroller
  :items="10000"
  :item-size="50"
>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</RecycleScroller>
```

👇 **Try it out**:
The demo below compares regular lists vs. virtual lists:

<VirtualScrollingDemo />

2. **Throttle scroll events** (Throttle):

```js
// Limit scroll event trigger frequency (at most once per 100ms)
const throttledScroll = throttle(() => {
  updatePosition()
}, 100)

window.addEventListener('scroll', throttledScroll)
```

3. **Use CSS `will-change`**:

```css
/* Tell the browser early: this element will change, prepare accordingly */
.scroll-container {
  will-change: transform;
}
```

### 4.4 Slow Click Response

**Symptoms**: After clicking a button, takes several seconds to respond.

**Causes**:
- Complex calculations in click event handlers (blocking the main thread)
- No debounce (user clicks rapidly multiple times, triggering multiple calculations)

**Solutions**:

1. **Debounce click events** (Debounce):

```js
// Only execute 300ms after user stops clicking
const debouncedClick = debounce(() => {
  submitForm()
}, 300)

button.addEventListener('click', debouncedClick)
```

2. **Use Web Workers** (move calculations to background threads):

```js
// Main thread
const worker = new Worker('calculator.js')
button.addEventListener('click', () => {
  worker.postMessage({ data: largeData })
})

worker.onmessage = (e) => {
  // Calculation complete, show result
  showResult(e.data.result)
}

// calculator.js (Worker thread)
self.onmessage = (e) => {
  const result = heavyCalculation(e.data.data)
  self.postMessage({ result })
}
```

---

## 5. Performance Monitoring Tools

Performance optimization is not a one-time task — it requires continuous monitoring. Here are commonly used tools.

### 5.1 Browser Developer Tools

**Chrome DevTools** is the most commonly used performance analysis tool:

- **Network panel**: View resource loading status
- **Performance panel**: Analyze runtime performance (FPS, main thread activity)
- **Lighthouse**: One-click performance report generation

::: tip How to use the Performance panel
1. Open Chrome DevTools (F12)
2. Switch to the Performance panel
3. Click the "Record" button
4. Interact with the webpage (scroll, click, etc.)
5. Click "Stop" to stop recording
6. Analyze results: look at FPS (frame rate), main thread activity, long tasks, etc.
:::

### 5.2 Lighthouse

**Lighthouse** is an automated performance testing tool developed by Google:

```bash
# Command line usage
lighthouse https://www.example.com --view

# Or use in Chrome DevTools
# Open DevTools → Lighthouse → Click "Analyze page load"
```

Lighthouse provides:
- Performance score (0-100)
- Core metrics (FCP, LCP, CLS, TBT, INP)
- Optimization suggestions (sorted by impact)

### 5.3 WebPageTest

**WebPageTest** is an online performance testing tool that can test from multiple locations and devices:

```bash
# Visit https://www.webpagetest.org
# Enter URL, select test location and device, click "Start Test"
```

WebPageTest provides:
- Waterfall chart: Timeline of each resource loading
- Video comparison: Loading process videos before and after optimization
- Optimization suggestions

---

## 6. Performance Optimization Checklist

Below is a practical performance optimization checklist. You can optimize your webpage in this order:

### 6.1 Loading Optimization

- ✅ **Compress images**: Use WebP format, compression quality 80-85%
- ✅ **Responsive images**: Load different image sizes based on device
- ✅ **Lazy loading**: Lazy load images and components, only load visible content
- ✅ **Code splitting**: Split code by route, load on demand
- ✅ **Compress code**: Enable Gzip/Brotli compression
- ✅ **Use CDN**: Put static resources on CDN for faster downloads
- ✅ **Preload critical resources**: Use `<link rel="preload">`

### 6.2 Rendering Optimization

- ✅ **Reduce reflows and repaints**: Use `transform` and `opacity` instead of `top` and `width`
- ✅ **Virtual lists**: Use virtual scrolling for large datasets
- ✅ **CSS animations**: Prefer CSS animations over JavaScript animations
- ✅ **Optimize critical rendering path**: Inline critical CSS, defer non-critical CSS
- ✅ **Avoid @import**: `@import` blocks rendering, use `<link>` instead

### 6.3 Interaction Optimization

- ✅ **Debounce and throttle**: Use debounce/throttle for scroll, input, resize events
- ✅ **Web Workers**: Move complex calculations to background threads
- ✅ **Time slicing**: Split large tasks into small ones, avoid long tasks
- ✅ **Avoid synchronous layout**: Don't read layout properties (like `offsetHeight`) in loops

### 6.4 Caching Optimization

- ✅ **HTTP caching**: Configure Cache-Control and ETag
- ✅ **Service Worker**: Cache static resources, enable offline access
- ✅ **LocalStorage**: Cache API data, reduce requests
- ✅ **Memory caching**: Use `Map`/`Object` to cache calculation results

### 6.5 Monitoring Optimization

- ✅ **Lighthouse CI**: Automatically test performance on every code submission
- ✅ **Real user monitoring**: Collect real users' performance data
- ✅ **Performance budgets**: Set file size limits, alert when exceeded
- ✅ **Regular performance reports**: Generate weekly/monthly performance trend reports

---

## 7. Summary

Let's review the core concepts of frontend performance optimization with a table:

| Concept | One-sentence Explanation | Problem Solved | Common Techniques |
|------|-----------|-----------|----------|
| **Loading optimization** | Make resource downloads faster | Slow first screen, long wait times | Compress images, CDN, code splitting, lazy loading |
| **Rendering optimization** | Make page "painting" faster | Laggy scrolling, slow clicks | Virtual lists, reduce reflows/repaints, CSS animations |
| **Interaction optimization** | Make responses faster | No click response, laggy operations | Debounce/throttle, Web Workers, time slicing |
| **Caching optimization** | Avoid redundant downloads | Slow repeat visits | HTTP caching, Service Worker, LocalStorage |
| **Monitoring optimization** | Continuously discover issues | Performance regression | Lighthouse, RUM, performance budgets |

::: info Final Note
Performance optimization is a continuously evolving topic. Tools will change, but the core philosophy remains: **think from the user's perspective — make wait times shorter and interactions smoother.**

With these fundamental principles understood, no matter how technology evolves, you'll be able to quickly adapt and respond with confidence.

I hope this article helps you build a comprehensive understanding of frontend performance optimization. When you encounter performance issues in real projects, you'll know where to start, how to diagnose, and how to solve them.
:::

# Fundamentals of Browser DevTools

::: tip 💡 Core Purpose
Browser Developer Tools (DevTools) are the "X-ray machine" and "operating table" of frontend development. They let you see through a webpage's skeleton (HTML), skin (CSS), and nervous system (JavaScript), and allow you to modify and debug them in real time.
:::

## 1. Overview of DevTools

**DevTools** is a set of web development and debugging tools built into modern browsers (Chrome, Edge, Firefox, Safari, etc.). For developers, it's closer to the "truth" than a code editor because **it shows what the code actually looks like when running in the browser**.

**How to Open DevTools?**

- **Keyboard shortcut**: `F12` or `Ctrl + Shift + I` (Mac: `Cmd + Option + I`)
- **Mouse**: **Right-click** on any element on the page and select **"Inspect"**.
- **Menu**: Browser menu (top right) → More Tools → Developer Tools.

---

## 2. Interactive Demo: DevTools Simulator

To help you get started quickly, we've built a simulated DevTools panel that replicates the Chrome browser's debugging interface.
**Try clicking the "▶ Start Auto Tour" button below and follow the cursor to learn about each area's functionality.**

<ClientOnly>
  <BrowserDevToolsDemo />
</ClientOnly>

### 2.1 Advanced Demo: Live Editing a Webpage

One of DevTools' most powerful features is **live editing**. The demo below contains a "virtual webpage" (top) and a "DevTools" panel (bottom).

**Try this:**

1. In the Elements panel below, click on the `h1` or `button` element in the DOM tree.
2. In the Styles panel on the right, modify property values in `element.style` (e.g., change `color` to `red`).
3. Observe how the virtual webpage above **changes in real time**.

<ClientOnly>
  <BrowserDevToolsLiveDemo />
</ClientOnly>

### 2.2 Hands-on Challenge: Modify Real Webpage Text

Now that you've mastered modifying styles, let's try something more exciting — **directly modifying the webpage you're currently viewing!**

1. **Open real DevTools**: Press `F12` (or right-click on this line of text → select "Inspect").
2. **Locate the element**: In the Elements panel, you'll see a line of highlighted code — that's the text you just clicked.
3. **Modify the content**: **Double-click** the black text in that line of code, change it to "**I am a hacker!**", then press Enter.
4. **See the magic**: Look! The text on the page has changed, hasn't it?

::: info 🤔 Why Does It Disappear After Refreshing?
You might notice that after refreshing the page, all your modifications disappear and the page returns to its original state.

This is because DevTools changes only happen in **your browser's local memory**.

- When you visit a webpage, the browser downloads HTML code from a **remote server** and renders it locally.
- You're only modifying your **local copy** — you don't have permission to modify the **source code** on the server.
- So every time you refresh, the browser fetches the latest (unmodified) code from the server, and everything resets.
  :::

---

## 3. Core Panels Explained

### 3.1 Elements Panel

<ClientOnly>
  <DevToolsElementsDemo />
</ClientOnly>

**Purpose**: View and live-edit the page's HTML and CSS.

- **Left side (DOM tree)**: Displays the webpage's HTML structure. You can double-click tags or text to modify them, and even drag nodes to rearrange them.
- **Right side (Styles)**: Shows the selected element's CSS styles. You can check/uncheck styles to see changes, or directly modify values (like colors, margins).
- **Use cases**:
  - "Why isn't this button aligned?" → Check CSS styles.
  - "I want to see if this title looks better in red." → Change `color: red` directly in Styles.

### 3.2 Console Panel

<ClientOnly>
  <DevToolsConsoleDemo />
</ClientOnly>

**Purpose**: View log messages and run JavaScript code.

- **Log output**: `console.log()` messages, warnings (yellow), and errors (red) from the running webpage all appear here.
- **Interactive environment**: You can type any JS code here and execute it immediately. For example, typing `alert('Hello')` will trigger a popup, and `document.body.style.background = 'red'` will turn the background red.
- **Use cases**:
  - "Why does clicking the button do nothing?" → Check if there are any red error messages.
  - "Verify a JS function's return value." → Run tests directly in the console.

### 3.3 Network Panel

<ClientOnly>
  <DevToolsNetworkDemo />
</ClientOnly>

**Purpose**: Monitor all network requests.

- **List view**: Shows all loaded resources (HTML, CSS, JS, images, API requests).
- **Request details**: Click any request row to slide out a detail panel on the right:
  - **Headers**: View request headers, response headers (like `Content-Type`).
  - **Response**: View the raw data returned by the server (JSON, HTML code, etc.).
  - **Preview**: Preview response content in a more readable format.
- **Key indicators**:
  - **Status**: Status code (200 success, 404 not found, 500 server error).
  - **Type**: Resource type (fetch/xhr indicates API requests).
  - **Time**: Loading duration.
- **Use cases**:
  - "Is the API down?" → Check if the API request shows a red 500.
  - "Why is the page loading so slowly?" → Find which image or file takes the longest to load.

### 3.4 Sources Panel

<ClientOnly>
  <DevToolsSourcesDemo />
</ClientOnly>

**Purpose**: View source code and debug JavaScript.

- **Breakpoint debugging**: Click a line number to set a "breakpoint." When code execution reaches that line, it **pauses**, giving you the chance to inspect current variable values and step through the code line by line.
- **Use cases**:
  - "Where did the code logic go wrong?" → Set breakpoints, watch the code execute step by step, and check if variable values match expectations.

### 3.5 Application Panel

<ClientOnly>
  <DevToolsApplicationDemo />
</ClientOnly>

**Purpose**: View and manage browser storage.

- **Storage**:
  - **Local Storage**: Persistent data storage.
  - **Session Storage**: Session-level storage (disappears when the tab is closed).
  - **Cookies**: Small text data used for authentication, etc.
- **Use cases**:
  - "Clear login state" → Delete tokens in Cookies or Local Storage.
  - "Check cached data" → Inspect what's stored in Local Storage.

---

## 4. Practical Tips

1. **Mobile mode debugging**: Click the "phone icon" 📱 in the top left of DevTools to simulate different phone models (iPhone, Pixel, etc.) and screen sizes to test responsive design.
2. **Force states**: In the Elements panel, right-click an element, select `Force state` → `:hover` to force the element into a hover state, making it easy to debug hover styles.
3. **Screenshot a node**: Select a node in the Elements panel, press `Ctrl + Shift + P` (Mac: `Cmd + Shift + P`) to open the command menu, type `screenshot`, and select `Capture node screenshot` to save a screenshot of that DOM node as an image.

::: warning ⚠️ Note
All changes in DevTools (modifying HTML, CSS, JS) are **temporary** and only take effect in the current browser page. Once you refresh, all changes are lost. To make changes permanent, you must modify your source code files.
:::

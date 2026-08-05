# Fundamentals of HTML/CSS Layout
::: tip 🎯 Core Question
**How are web pages made? Why do some pages only have text, while others are as interactive as applications?** This question leads to the three cornerstones of web development, helping you understand the structure behind every web page.
:::

---

## 1. Overview of HTML, CSS, and JavaScript

### 1.1 From Static Pages to Dynamic Applications

Imagine a **poster** you see on the street. You can only look at it, not interact with it — the poster won't change its content just because you looked at it, nor will it pop up more information because you tapped somewhere.

Early web pages were exactly like these "electronic posters": view-only, immutable, with fixed content.

But modern web pages are completely different. They behave like **desktop applications**:

- You can click, drag, input, and upload
- The page changes in real time based on your actions
- They can accomplish complex tasks like software (e.g., online video editing)

**The core reason for this transformation is the three cornerstones of web technology: HTML + CSS + JavaScript**.

### 1.2 An Analogy: Building a House

| Technology     | 🏠 House Analogy                    | Actual Role                    | Concrete Example                          |
| -------------- | ----------------------------------- | ------------------------------ | ----------------------------------------- |
| **HTML**       | The house's **structure and materials** | Defines the content and hierarchy of the page | This is a wall, this is a window, this is a room |
| **CSS**        | The house's **decoration and appearance** | Controls the style and layout of the page | Paint the wall blue, place the window on the east side, tile the floor |
| **JavaScript** | The house's **appliances and smart systems** | Enables interactivity and logic on the page | Press the switch and the light turns on, open the door and the curtains automatically draw |

::: tip 💡 The Relationship Between the Three

**HTML → CSS**: You need a house first before you can decorate it. HTML is the foundation, CSS is the beautification.

**HTML + CSS → JavaScript**: You need the house and decoration before you can install smart systems. JavaScript makes a "dead" page come "alive."

**Core Idea**: Each of the three has its own role, and none is dispensable. A page with only HTML is ugly, a page with only HTML+CSS can't be interactive, and only with all three can you build "web applications" like WeChat Web or Taobao.
:::

### 1.3 Try It Yourself

👇 The demo below shows how HTML/CSS/JavaScript work together:

<WebTechTriad />

---

## 2. HTML: The Skeleton of a Web Page

### 2.1 Motivation for needing HTML

Before HTML existed, content on the internet was just **plain text**. Like the text you're reading right now — no formatting, no hierarchy, no links.

What's wrong with plain text?

- ❌ **Can't express hierarchy**: Can't tell what's a heading, what's body text, what's a footnote
- ❌ **Machines can't understand it**: Search engines and screen readers (for the blind) can't comprehend the content
- ❌ **Can't interact**: No links, no buttons, no input fields

**HTML (HyperText Markup Language)** was created to solve these problems. It uses "tags" to mark the meaning of content, telling the browser "what this is."

### 2.2 What Does HTML Code Look Like

The basic unit of HTML is the "tag." Tags are wrapped in angle brackets `< >` and come in pairs:

```html
<h1>This is a heading</h1>
<p>This is a paragraph</p>
<a href="url">This is a link</a>
```

**Key Concepts**:

| Concept | Explanation | Example |
|---------|-------------|---------|
| **Tag** | A marker wrapped in angle brackets | `<h1>`, `</h1>` |
| **Element** | The tag + its content as a whole | `<h1>Heading</h1>` |
| **Attribute** | Additional information on a tag | `href="url"`, `class="card"` |
| **Nesting** | Tags placed inside other tags | `<div><p>Text</p></div>` |

### 2.3 How to Read HTML Code

::: tip 🎯 Must-Read for Beginners: How to Read Code

Many beginners get dizzy seeing a bunch of `<xxx>`. Actually, reading HTML code follows a **fixed pattern**:

**Step 1: Find the "outermost layer"**

```html
<div class="card">        ← This is a container, holding content inside
  <h2>Title</h2>
  <p>Description text</p>
</div>
```

**Step 2: Guess the meaning from the tag name**

| Tag Name | Quick Memory | What Goes Inside |
|----------|-------------|-------------------|
| `<div>` | Big box | Any content, used for grouping |
| `<span>` | Small box | Text fragments, used for marking |
| `<p>` | Paragraph | A block of text |
| `<h1>`-`<h6>` | Heading | Heading text, smaller number = more important |
| `<a>` | Anchor/Link | Clickable content that navigates |
| `<img>` | Image | No content inside, uses src to point to an image |
| `<button>` | Button | Clickable text/icon |
| `<input>` | Input field | No content inside, where users type |

**Step 3: Look at class and id**

```html
<div class="user-card" id="user-123">
```

- `class="user-card"` → The "type" of this element, CSS can select it in bulk
- `id="user-123"` → The "ID number" of this element, a unique identifier

**Step 4: Indentation shows hierarchy**

```html
<body>
  <header>           ← Indentation shows header is a child of body
    <nav>            ← nav is a child of header
      <a>Home</a>    ← a is a child of nav
    </nav>
  </header>
</body>
```
:::

### 2.4 Common HTML Tags Quick Reference

**Structural Tags** (define the page skeleton):

```html
<h1>This is a level-1 heading</h1>
<h2>This is a level-2 heading</h2>
<p>This is a paragraph</p>
<div>This is a container (for grouping)</div>
<span>This is an inline container (for marking text)</span>
```

**Links and Media** (enrich the page):

```html
<a href="https://example.com">Click here to navigate</a>
<img src="photo.jpg" alt="Photo description" />
<video src="movie.mp4" controls></video>
```

**Forms** (collect user input):

```html
<form>
  <input type="text" placeholder="Enter username" />
  <input type="password" placeholder="Enter password" />
  <button type="submit">Log in</button>
</form>
```

**Semantic Tags** (HTML5 additions, make page meaning clearer):

```html
<header>Page header</header>
<nav>Navigation bar</nav>
<main>Main content area</main>
<article>An article</article>
<aside>Sidebar</aside>
<footer>Footer</footer>
```

::: tip 💡 Why Use Semantic Tags?

`<div class="header">` and `<header>` seem to produce the same visual effect, so why use the latter?

1. **SEO-friendly**: Search engines can better understand page structure
2. **Accessibility**: Screen readers can quickly locate areas like "navigation" and "main content"
3. **Code readability**: Seeing `<header>` tells you immediately it's a header

**When to use div?** When there's no suitable semantic tag. For example, a purely decorative container.
:::

### 2.5 Approach to remembering So Many HTML Tags

::: tip 🎯 Beginner Confusion

"There are over a hundred HTML tags, how can I remember them all?"

**The answer: You don't need to remember them all.** In actual development, 90% of cases only use about 20 tags.
:::

#### Memorize by Purpose

**1. Page Structure (drawing the skeleton)**

| Tag | Memory Aid | Purpose |
|-----|-----------|---------|
| `<header>` | Head | Header of a page or section |
| `<nav>` | Navigation | Navigation link area |
| `<main>` | Main | Main content of the page (only one per page) |
| `<article>` | Article | Independent content block (still meaningful if taken out alone) |
| `<section>` | Section | Thematic content grouping |
| `<aside>` | Aside | Sidebar, supplementary content |
| `<footer>` | Foot | Footer of a page or section |

**Memory method**: Imagine a newspaper — it has a masthead (header), table of contents (nav), body text (main/article), columns (aside), and footer (footer).

**2. Content Marking (clarifying what it is)**

| Tag | Memory Aid | Purpose |
|-----|-----------|---------|
| `<h1>`-`<h6>` | Heading 1-6 | Heading hierarchy, h1 is the largest and most important |
| `<p>` | Paragraph | A block of text |
| `<ul>`/`<ol>`/`<li>` | Unordered/Ordered/List Item | Lists |
| `<a>` | Anchor | Links, for navigation |
| `<img>` | Image | Images |
| `<video>`/`<audio>` | Video/Audio | Multimedia |
| `<strong>`/`<em>` | Strong/Emphasis | Semantic emphasis |

**Memory method**: `<a>` stands for "anchor" — imagine a ship dropping anchor at a spot; a link "anchors" you to another page.

**3. Form Interaction (collecting user input)**

| Tag | Memory Aid | Purpose |
|-----|-----------|---------|
| `<form>` | Form | Form container |
| `<input>` | Input | Various input fields (type determines the kind) |
| `<textarea>` | Text Area | Multi-line text input |
| `<select>`/`<option>` | Select/Option | Dropdown selection |
| `<button>` | Button | Button |
| `<label>` | Label | Descriptive text for input fields |

**Memory method**: The `type` attribute of `<input>` determines what it looks like:
- `type="text"` → Text box
- `type="password"` → Password box
- `type="email"` → Email box
- `type="checkbox"` → Checkbox
- `type="radio"` → Radio button

**4. Container (for grouping)**

| Tag | Memory Aid | Purpose |
|-----|-----------|---------|
| `<div>` | Big box | Block-level container, takes up a full row |
| `<span>` | Small box | Inline container, only takes content width |

**Memory method**: div = division, span = span. div divides large areas, span marks text fragments.

#### What to Do When You Encounter an Unfamiliar Tag?

**Method 1: Guess the English word**

Many tags are abbreviations of English words:
- `<abbr>` = abbreviation
- `<blockquote>` = block quote
- `<caption>` = caption
- `<figcaption>` = figure caption

**Method 2: Check MDN**

[MDN HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) has detailed explanations for all tags.

**Method 3: Ask AI**

> "What does the `<dl>` tag in HTML mean? When should I use it?"

#### Don't Memorize Tags Deliberately

**The real workflow goes like this**:

1. You know you need a "container" → Write `<div>`
2. Later you realize it's a "navigation area" → Change to `<nav>`
3. Later you realize it's an "independent article" → Change to `<article>`

**Write it first, then optimize semantics**. Tags can be changed anytime; don't agonize over which one to use upfront.

---

## 3. CSS: The Skin of a Web Page

### 3.1 Motivation for needing CSS

Imagine you've moved into a **bare shell apartment**: it has walls, windows, and doors — livable, but:

- The walls are gray concrete, not pretty
- Outlets and switches are randomly placed, not aesthetic
- No furniture, inconvenient for daily life

An HTML-only web page is like this: it has content and structure, but it's **ugly**, **messy**, and **unfriendly**.

CSS (Cascading Style Sheets) is the web page's "decoration crew." It doesn't change the HTML structure (no tearing down walls or moving doors), it's only responsible for:

- 🎨 **Painting walls**: Changing colors and backgrounds
- 🖼️ **Hanging pictures**: Adding borders, shadows, rounded corners
- 🪑 **Arranging furniture**: Adjusting layout, spacing, and alignment

### 3.2 What Does CSS Code Look Like

CSS code has a fixed format:

```css
selector {
  property-name: property-value;
  property-name: property-value;
}
```

**Three ways to write it**:

```html
<!-- Method 1: Inline styles (for temporary testing) -->
<div style="color: red;">Red text</div>

<!-- Method 2: Internal styles (written inside the HTML file) -->
<style>
  .red-text { color: red; }
</style>

<!-- Method 3: External styles (separate CSS file, recommended) -->
<link rel="stylesheet" href="styles.css" />
```

### 3.3 How to Read CSS Code

::: tip 🎯 Must-Read for Beginners: How to Read CSS

**Step 1: Look at the selector — "Who gets decorated?"**

| Selector | Syntax | Meaning |
|----------|--------|---------|
| Tag selector | `p { }` | All `<p>` tags |
| Class selector | `.card { }` | All elements with `class="card"` |
| ID selector | `#header { }` | The unique element with `id="header"` |
| Descendant selector | `.card h2 { }` | All `<h2>` inside `.card` |
| Group selector | `.card, .box { }` | Selects both `.card` and `.box` |

**Step 2: Look at the property — "What to decorate?"**

| Property Category | Common Properties | Purpose |
|-------------------|-------------------|---------|
| Text | `color`, `font-size`, `font-weight` | Color, size, weight |
| Background | `background`, `background-color` | Background color, background image |
| Border | `border`, `border-radius` | Border line, rounded corners |
| Spacing | `margin`, `padding` | Outer margin, inner padding |
| Layout | `display`, `flex`, `grid` | Arrangement method |

**Step 3: Look at the value — "What should it look like after decoration?"**

```css
.card {
  width: 300px;        /* Fixed width */
  padding: 16px;       /* Inner padding of 16 pixels */
  border-radius: 8px;  /* Rounded corners of 8 pixels */
  background: #fff;    /* White background */
}
```

**Common units**:
- `px`: Pixels, fixed size
- `%`: Percentage, relative to the parent element
- `rem`: Relative to the root element's font size
- `vw/vh`: Relative to viewport width/height
:::

### 3.4 Selector Specificity

If an element is selected by multiple selectors at once, which one wins?

```html
<p class="highlight" id="special">What color is this text?</p>
```

```css
p { color: red; }             /* Specificity: 1 */
.highlight { color: yellow; } /* Specificity: 10 */
#special { color: blue; }     /* Specificity: 100 */
```

**Answer**: Blue. ID selectors have the highest specificity, class selectors next, and tag selectors the lowest.

**Inline styles** (written in the style attribute) have a specificity of 1000 — the highest!

### 3.5 The Box Model: Motivation for Doesning 't the Width Match

::: tip 🎯 Real-World Scenario

You're building a web page with three cards displayed side by side, each card 300px wide, with a container total width of 900px. You write:

```css
.card { width: 300px; }
```

Result: **The third card drops to the next row!**

**Why?** Because `width: 300px` is only the content width — you forgot to account for padding and border. If the card has `padding: 20px` and `border: 1px`, the actual width is 342px, three cards = 1026px, exceeding the container!
:::

Every HTML element is treated as a "box" in CSS, composed of four layers. Imagine you're **packing a parcel**: the content is the item, padding is the bubble wrap, border is the cardboard box, and margin is the space between boxes.

👇 **Try it yourself**: Drag the sliders to adjust each layer's size and observe how the box model changes:

<CssBoxModel />

**Solution**:

```css
.box {
  box-sizing: border-box;  /* Make width include padding and border */
  width: 200px;
  padding: 10px;
  border: 5px;
}
```

This way, `width: 200px` is the final width, and padding and border are "squeezed" inside.

### 3.6 Flexbox: Approach to Autoing -Align Elements

Flexbox is the most commonly used layout method in modern CSS. It makes elements automatically align and arrange themselves, like books on a shelf that automatically stay aligned.

👇 **Try it yourself**: Switch direction and alignment to see how boxes arrange themselves:

<CssFlexbox />

**Flex Core Concepts**:

| Property | Purpose | Common Values |
|----------|---------|---------------|
| `display: flex` | Enable Flex layout | - |
| `flex-direction` | Main axis direction | `row` (horizontal), `column` (vertical) |
| `justify-content` | Main axis alignment | `flex-start`, `center`, `space-between` |
| `align-items` | Cross axis alignment | `stretch`, `center`, `flex-start` |
| `flex-wrap` | Whether to wrap | `nowrap`, `wrap` |
| `gap` | Spacing between elements | `10px`, `1rem` |

### 3.7 CSS Preprocessors: SCSS/SASS and LESS

::: tip 🎯 Real-World Scenario

You've built a project with a 2000-line CSS file. Later, you need to change the theme color, and you discover:

- The primary color `#3b82f6` appears 50 times
- Changing one color requires a global search-and-replace, and you worry about missing one
- Selectors like `.nav .nav-list .nav-item .nav-link` are long and hard to maintain

**CSS preprocessors** were created to solve these problems. They let CSS "program": with variables, nesting, and reusable code.
:::

#### 3.7.1 What Is a CSS Preprocessor?

**In plain English**: A preprocessor is a "smarter CSS." You write styles with a more powerful syntax, then it **compiles** them into regular CSS that browsers can recognize.

**Why use one?**

| Pain Point | Vanilla CSS | Preprocessor |
|------------|-------------|--------------|
| Colors repeated everywhere | Copy-paste everywhere | Define a variable, change once and it applies globally |
| Deep selector nesting | Write a long chain | Nesting syntax, hierarchy at a glance |
| Same styles repeated | Copy-paste | Mixins, reusable like functions |

#### 3.7.2 Comparison of the Three Major Preprocessors

| Feature | Vanilla CSS | **SCSS/SASS** | **LESS** |
|---------|-------------|---------------|----------|
| **Variable syntax** | `--primary` | `$primary` | `@primary` |
| **Nesting syntax** | ❌ Not supported | ✅ Supported | ✅ Supported |
| **Mixins (code reuse)** | ❌ Not supported | ✅ `@mixin` | ✅ `.mixin()` |
| **Learning curve** | Easy | Moderate | Moderate |
| **Popularity** | - | ⭐⭐⭐ Most popular | ⭐⭐ Fairly popular |

**Quick memory**:
- **SCSS**: Uses `$` symbol, used by Bootstrap 5, best ecosystem
- **LESS**: Uses `@` symbol, consistent with CSS `@media` syntax, easier to pick up

#### 3.7.3 Core Feature Comparison by Example

##### 1. Variables: Change Once, Apply Globally

**Scenario**: The theme color `#3b82f6` is used in 20 places and needs to change to red.

<Tabs>
<TabItem label="Vanilla CSS">

```css
/* Need to change 20 places, easy to miss one */
.button { background: #3b82f6; }
.link { color: #3b82f6; }
.border { border-color: #3b82f6; }
```

</TabItem>
<TabItem label="SCSS">

```scss
$primary: #3b82f6;

.button { background: $primary; }
.link { color: $primary; }
.border { border-color: $primary; }
/* Change $primary in one place only */
```

</TabItem>
<TabItem label="LESS">

```less
@primary: #3b82f6;

.button { background: @primary; }
.link { color: @primary; }
.border { border-color: @primary; }
/* Change @primary in one place only */
```

</TabItem>
</Tabs>

##### 2. Nesting: Hierarchy at a Glance

**Scenario**: A navigation bar with multiple layers of structure.

<Tabs>
<TabItem label="Vanilla CSS">

```css
/* Written as a long chain, hard to see hierarchy */
.navbar .nav-list .nav-item .nav-link { }
.navbar .nav-list .nav-item .nav-link:hover { }
```

</TabItem>
<TabItem label="SCSS">

```scss
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }  /* & refers to the parent selector */
      }
    }
  }
}
```

</TabItem>
<TabItem label="LESS">

```less
.navbar {
  .nav-list {
    .nav-item {
      .nav-link {
        &:hover { }
      }
    }
  }
}
```

</TabItem>
</Tabs>

##### 3. Mixins: Reusable Code Snippets

**Scenario**: Multiple buttons all need "centered display" styles.

<Tabs>
<TabItem label="Vanilla CSS">

```css
/* Copy-paste 3 times */
.btn-primary {
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-secondary {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

</TabItem>
<TabItem label="SCSS">

```scss
@mixin center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { @include center; }
.btn-secondary { @include center; }
```

</TabItem>
<TabItem label="LESS">

```less
.center() {
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-primary { .center(); }
.btn-secondary { .center(); }
```

</TabItem>
</Tabs>

#### 3.7.4 How to Choose?

| Situation | Recommendation |
|-----------|---------------|
| Just starting out, small project | **Vanilla CSS** (build a solid foundation first) |
| Project uses Bootstrap 5 | **SCSS** (Bootstrap source is SCSS) |
| Team is familiar with `@` syntax | **LESS** (consistent with CSS `@media` syntax) |
| Need complex logic (loops, conditionals) | **SCSS** (more powerful features) |

#### 3.7.5 Using in a Project

**Vite Project (simplest)**:

```bash
# Install sass
npm install -D sass

# Use .scss or .less files directly
```

::: tip 💡 Beginner Advice

1. **Learn vanilla CSS first**: Preprocessors are just "syntactic sugar" — without understanding CSS fundamentals, you'll get more confused
2. **Don't force it on small projects**: If your CSS is under 200 lines, writing plain CSS is simpler
3. **Start with SCSS**: The syntax is almost identical to CSS, just with `$` variables added
4. **Don't nest too deeply**: More than 3 levels makes code hard to maintain
:::

#### 3.7.6 File Organization Comparison Across Tech Stacks

**For the same project, how does the file structure differ across tech stacks?**

<Tabs>
<TabItem label="Vanilla HTML + CSS">

```
my-website/
├── index.html              # Page structure
├── about.html
├── css/
│   ├── reset.css           # Reset styles
│   ├── layout.css          # Layout styles
│   ├── components.css      # Component styles
│   └── style.css           # Main styles (potentially thousands of lines)
├── js/
│   └── main.js
└── images/
    └── logo.png
```

**Characteristics**:
- CSS is centralized in one or a few files
- Changing styles requires switching between HTML and CSS files
- Styles easily conflict with each other

</TabItem>
<TabItem label="Vue + Vanilla CSS">

```
src/
├── components/             # Component folder
│   ├── Button/
│   │   ├── Button.vue      # Template + styles + logic
│   │   └── Button.test.js
│   ├── Header/
│   │   └── Header.vue
│   └── Footer/
│       └── Footer.vue
├── views/                  # Page folder
│   ├── Home.vue
│   └── About.vue
├── App.vue                 # Root component
└── main.js                 # Entry file
```

**Button.vue internal structure**:
```vue
<template>
  <button class="btn">Click</button>
</template>

<script>
export default { name: 'Button' }
</script>

<style scoped>              <!-- scoped styles only affect the current component -->
.btn { background: #3b82f6; }
</style>
```

</TabItem>
<TabItem label="Vue + SCSS">

```
src/
├── assets/
│   └── styles/
│       ├── _variables.scss     # Variables: colors, spacing, etc.
│       ├── _mixins.scss        # Mixins: reusable code blocks
│       ├── _functions.scss     # Functions: color calculations, etc.
│       └── global.scss         # Global styles entry point
├── components/
│   ├── Button/
│   │   └── Button.vue          # Components use @import to bring in variables
│   └── Card/
│       └── Card.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js
```

**_variables.scss**:
```scss
$primary: #3b82f6;
$secondary: #64748b;
$spacing-sm: 8px;
$spacing-md: 16px;
```

**Button.vue**:
```vue
<style scoped lang="scss">
@import '@/assets/styles/variables';

.btn {
  background: $primary;      // Using variables
  padding: $spacing-md;
}
</style>
```

</TabItem>
<TabItem label="Vue + Tailwind CSS">

```
src/
├── components/
│   ├── Button.vue          # No style block needed
│   ├── Card.vue
│   └── Header.vue
├── views/
│   ├── Home.vue
│   └── About.vue
├── App.vue
└── main.js

# Configuration files (root directory)
tailwind.config.js          # Theme configuration
tailwind.css                # Base styles entry point
```

**Button.vue** (no style block):
```vue
<template>
  <button class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
    Click
  </button>
</template>
```

**Characteristics**:
- No separate style files
- Class names are the styles (`bg-blue-500` = blue background)
- Configuration centralized in `tailwind.config.js`

</TabItem>
</Tabs>

**Core Differences Summary**:

| Tech Stack | Style File Location | Theme Management | Code Reuse |
|------------|---------------------|------------------|------------|
| Vanilla HTML+CSS | Centralized `css/` folder | Search and replace | Copy-paste |
| Vue + CSS | Scattered in `.vue` components | Search and replace | Copy-paste |
| Vue + SCSS | In components + `styles/` shared files | Variables for unified management | Mixins for reuse |
| Vue + Tailwind | None (in class names) | `tailwind.config.js` | Class name composition |

### 3.8 Approach to remembering So Many CSS Properties

::: tip 🎯 Beginner Confusion

"There are hundreds of CSS properties, how can I remember them all?"

**The answer: Categorize by purpose, remember the core properties, and look up the rest as needed.**
:::

#### Memorize by Purpose

**1. Text & Typography (what text looks like)**

| Property | Memory Aid | Common Values |
|----------|-----------|---------------|
| `color` | Color | `red`, `#fff`, `rgb(0,0,0)` |
| `font-size` | Font size | `16px`, `1rem`, `1.5em` |
| `font-weight` | Font weight | `normal`, `bold`, `100`-`900` |
| `font-family` | Font family | `"Microsoft YaHei"`, `sans-serif` |
| `line-height` | Line height | `1.5`, `24px` |
| `text-align` | Text alignment | `left`, `center`, `right` |
| `text-decoration` | Text decoration | `none`, `underline`, `line-through` |

**Memory method**: Imagine you're formatting in Word — change color, change size, bold, change font, adjust line spacing, align, add underline.

**2. Box Model (how much space an element takes)**

| Property | Memory Aid | Common Values |
|----------|-----------|---------------|
| `width`/`height` | Width/Height | `100px`, `50%`, `100vw` |
| `padding` | Inner padding | `10px`, `10px 20px` |
| `margin` | Outer margin | `10px`, `auto` (for centering) |
| `border` | Border | `1px solid #ccc` |
| `border-radius` | Rounded corners | `4px`, `50%` (circle) |
| `box-sizing` | Box model | `border-box` (recommended) |

**Memory method**: padding is the "inner" spacing (distance from content to border), margin is the "outer" spacing (distance from border to other elements).

**Shorthand rules**:
```css
/* Four values: top right bottom left (clockwise) */
padding: 10px 20px 15px 25px;

/* Two values: top-bottom left-right */
padding: 10px 20px;

/* One value: all four directions the same */
padding: 10px;
```

**3. Background & Border (what an element looks like)**

| Property | Memory Aid | Common Values |
|----------|-----------|---------------|
| `background` | Background | `#fff`, `url(bg.jpg)`, `linear-gradient(...)` |
| `background-color` | Background color | `#fff`, `rgba(0,0,0,0.5)` |
| `background-image` | Background image | `url(photo.jpg)` |
| `background-size` | Background size | `cover`, `contain`, `100%` |
| `background-position` | Background position | `center`, `top left` |
| `box-shadow` | Box shadow | `0 2px 10px rgba(0,0,0,0.1)` |
| `opacity` | Opacity | `0`-`1` (0 = fully transparent) |

**Memory method**: `background` is a shorthand that can set multiple values at once:
```css
background: #fff url(bg.jpg) no-repeat center/cover;
/*          color  image     repeat     position/size */
```

**4. Layout (how elements are arranged)**

| Property | Memory Aid | Common Values |
|----------|-----------|---------------|
| `display` | Display mode | `block`, `inline`, `flex`, `grid`, `none` |
| `position` | Positioning | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| `top`/`right`/`bottom`/`left` | Four directions | `10px`, `50%` (used with position) |
| `z-index` | Stack order | Higher number = on top |
| `float` | Float | `left`, `right` (legacy, not recommended) |
| `overflow` | Overflow handling | `visible`, `hidden`, `scroll`, `auto` |

**position memory method**:
- `static`: Default, normal flow
- `relative`: Offset relative to its original position
- `absolute`: Positioned relative to the nearest positioned ancestor
- `fixed`: Positioned relative to the viewport (doesn't move on scroll)
- `sticky`: Fixes in place after scrolling to a certain point

**5. Flexbox Layout (one-dimensional layout powerhouse)**

| Property | Memory Aid | Purpose |
|----------|-----------|---------|
| `display: flex` | Enable Flex | Container becomes a Flex container |
| `flex-direction` | Direction | `row` (horizontal), `column` (vertical) |
| `justify-content` | Main axis alignment | How elements are arranged on the main axis |
| `align-items` | Cross axis alignment | How elements are aligned on the cross axis |
| `flex-wrap` | Wrapping | `nowrap`, `wrap` |
| `gap` | Gap | Spacing between elements |
| `flex` | Flexibility | Child element's grow/shrink ratio |

**Memory method**:
- `justify` = justify/align → Main axis alignment
- `align` = align → Cross axis alignment

**6. Animation & Transition (how elements move)**

| Property | Memory Aid | Common Values |
|----------|-----------|---------------|
| `transition` | Transition | `all 0.3s ease` |
| `transform` | Transform | `translate(10px)`, `rotate(45deg)`, `scale(1.1)` |
| `animation` | Animation | `fadeIn 1s ease forwards` |

**Shorthand rules**:
```css
/* transition: property duration timing-function delay */
transition: all 0.3s ease 0s;

/* transform can combine multiple transformations */
transform: translateX(10px) rotate(45deg) scale(1.1);
```

#### What to Do When You Encounter an Unfamiliar Property?

**Method 1: Guess the English word**

Many properties are English words or abbreviations:
- `margin` = margin, edge
- `padding` = padding, filling
- `border` = border, boundary
- `visibility` = visibility
- `cursor` = cursor

**Method 2: Associate by scenario**

When you want to achieve a certain effect, think about the "keywords":

| I want to... | Possible properties |
|-------------|---------------------|
| Change color | `color`, `background-color`, `border-color` |
| Change size | `width`, `height`, `font-size` |
| Change position | `margin`, `position`, `top/left` |
| Change spacing | `padding`, `margin`, `gap` |
| Hide an element | `display: none`, `visibility: hidden`, `opacity: 0` |
| Center | `margin: auto`, `text-align: center`, `justify-content: center` |
| Add rounded corners | `border-radius` |
| Add shadow | `box-shadow`, `text-shadow` |
| Add animation | `transition`, `animation` |

**Method 3: Check MDN or ask AI**

[MDN CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference) has detailed explanations for all properties.

> "How do I make text display on a single line with an ellipsis for overflow in CSS?"

**Method 4: "Learn by stealing" with DevTools**

When you see a web page effect you like:
1. Right-click → "Inspect"
2. Select the element, look at the Styles panel
3. Copy the CSS properties directly

#### Don't Memorize Properties Deliberately

**The real workflow goes like this**:

1. You know you want to "center" → Search "CSS centering"
2. Copy the code, tweak the values
3. After using it enough, you'll remember it

**Recommended learning path**:

1. **Master the box model first**: `width`, `height`, `padding`, `margin`, `border`
2. **Then master Flexbox**: `display: flex`, `justify-content`, `align-items`
3. **Then master positioning**: `position`, `top/left`, `z-index`
4. **Finally learn animation**: `transition`, `transform`, `animation`

Look up other properties as needed; you'll naturally remember them after using them enough.

---

## 4. JavaScript: The Brain of a Web Page

### 4.1 Motivation for needing JavaScript

A web page with only HTML + CSS is like a **mannequin in a store window**:

- ✅ Looks beautiful (CSS)
- ✅ Structure is clear (HTML)
- ❌ But if you talk to it, it won't respond
- ❌ If you press a button, nothing happens

**JavaScript** turns a web page from a "mannequin" into a "real person":

- ✅ Click a button, and a prompt appears
- ✅ Type text, and it checks the format in real time
- ✅ Scroll the page, and more content loads
- ✅ Submit a form, and it shows "Submitting..."

### 4.2 What Does JavaScript Code Look Like

**Capability 1: Remembering data** (variables)

```javascript
let userName = 'John'
let isLoggedIn = true
let cartCount = 5
```

**Capability 2: Doing things repeatedly** (functions)

```javascript
function sayHello(name) {
  return 'Hello, ' + name + '!'
}

console.log(sayHello('John'))  // Output: Hello, John!
```

**Capability 3: Responding to events** (event listeners)

```javascript
button.addEventListener('click', function() {
  alert('The button was clicked!')
})
```

**Capability 4: Modifying the page** (DOM manipulation)

```javascript
document.getElementById('title').textContent = 'New Title'
document.getElementById('box').style.background = 'red'
```

### 4.3 How to Read JavaScript Code

::: tip 🎯 Must-Read for Beginners: How to Read JS Code

**Step 1: Find variables — "What's being remembered?"**

```javascript
const API_URL = 'https://api.example.com'  // Constant, won't change
let count = 0                                // Variable, can change
const user = { name: 'John', age: 25 }       // Object, multiple data points
const items = ['Apple', 'Banana', 'Orange']  // Array, list data
```

**Step 2: Find functions — "What can it do?"**

```javascript
// Function names usually hint at their purpose
function handleClick() { }      // Handle clicks
function fetchData() { }        // Fetch data
function validateForm() { }     // Validate forms
```

**Step 3: Find events — "When does it trigger?"**

```javascript
button.addEventListener('click', handleClick)     // On click
input.addEventListener('input', validateForm)     // On input
window.addEventListener('scroll', loadMore)       // On scroll
```

**Step 4: Find DOM operations — "What got changed?"**

```javascript
element.textContent = 'New content'     // Change text
element.classList.add('active')         // Add a style class
element.style.display = 'none'          // Hide the element
parent.appendChild(child)               // Add an element
```
:::

### 4.4 DOM: Method for JavaScripting Manipulate the Page

After the browser reads the HTML code, it doesn't treat them as a bunch of strings. Instead, it draws them as a "tree" in memory:

```
Document
    ↓
<html>
    ├─<head>
    │   └─<title>My Web Page</title>
    └─<body>
        ├─<h1>Welcome</h1>
        └─<div class="card">
            ├─<img src="photo.jpg">
            └─<p>A paragraph of text</p>
```

This tree is called the **DOM tree**. Every HTML tag is a "node" on this tree.

**How to find nodes?**

```javascript
// By ID (fastest, unique)
const element = document.getElementById('header')

// By selector (most common)
const element = document.querySelector('.card h2')    // Find the first one
const elements = document.querySelectorAll('button')  // Find all

// By relationship
element.parentNode           // Find parent node
element.children             // Find child nodes
element.nextElementSibling   // Find next sibling
```

**Performance warning**: DOM operations are **expensive**. Every time you modify the DOM, the browser has to recalculate layout and repaint.

```javascript
// ❌ Inefficient: Loop 1000 times, operating on the DOM each time
for (let i = 0; i < 1000; i++) {
  document.body.appendChild(createDiv())
}

// ✅ Efficient: Assemble first, then insert all at once
const fragment = document.createDocumentFragment()
for (let i = 0; i < 1000; i++) {
  fragment.appendChild(createDiv())
}
document.body.appendChild(fragment)
```

This is precisely why modern frameworks like **Vue / React** were born: they play with a "virtual DOM" in memory, calculate the minimal set of changes, and only then touch the real DOM.

👇 **Try it yourself**: Basic DOM manipulation methods:

<DomManipulator />

### 4.5 ECMAScript: The Evolution of JavaScript Versions

**ECMAScript** is the "standard specification" for JavaScript. Browser vendors implement JavaScript engines according to this standard.

#### Why Do Version Numbers Matter?

JavaScript is not static. New features are added and issues are fixed every year. Version numbers tell you "which features this browser supports."

#### Important Versions at a Glance

| Version | Year | Key Features | What Problem It Solved |
|---------|------|-------------|------------------------|
| **ES5** | 2009 | Strict mode, `forEach`/`map`/`filter` | Standardized the language, added array methods |
| **ES6/ES2015** | 2015 | `let/const`, arrow functions, `class`, `Promise`, modules | The biggest update, the starting point of modern JS |
| **ES2016** | 2016 | `includes()`, `**` exponentiation | Small update |
| **ES2017** | 2017 | `async/await`, `Object.entries()` | Async code is more readable |
| **ES2018** | 2018 | `...` spread operator, `Promise.finally()` | Object and async enhancements |
| **ES2020** | 2020 | Optional chaining `?.`, nullish coalescing `??`, `BigInt` | Safe access to nested properties |
| **ES2021** | 2021 | `replaceAll()`, logical assignment `??=` | String and assignment enhancements |
| **ES2022** | 2022 | Top-level `await`, `.at()` indexing | Easier async module loading |

#### The Most Commonly Used ES6+ Syntax

**1. `let` and `const` instead of `var`**

```javascript
// ❌ Old way: var has hoisting, prone to bugs
var name = 'John'
if (true) {
  var name = 'Jane'  // Overwrites the outer name
}
console.log(name)  // 'Jane', not the expected result

// ✅ New way: let has block scope
let name = 'John'
if (true) {
  let name = 'Jane'  // Only valid inside this if block
}
console.log(name)  // 'John', as expected

// ✅ const: Cannot be reassigned after declaration
const PI = 3.14159
PI = 3  // Error! Prevents accidental modification
```

**2. Arrow Functions: More Concise Function Syntax**

```javascript
// ❌ Old way
const add = function(a, b) {
  return a + b
}

// ✅ New way
const add = (a, b) => a + b

// Arrow functions bind this to the enclosing scope
const obj = {
  name: 'John',
  // ❌ Regular function: this points to the caller
  oldWay: function() {
    setTimeout(function() {
      console.log(this.name)  // undefined
    }, 100)
  },
  // ✅ Arrow function: this inherits from obj
  newWay: function() {
    setTimeout(() => {
      console.log(this.name)  // 'John'
    }, 100)
  }
}
```

**3. Destructuring Assignment: Extract Data from Objects/Arrays**

```javascript
// Object destructuring
const user = { name: 'John', age: 25, city: 'Beijing' }
const { name, age } = user  // Direct extraction
console.log(name)  // 'John'

// Array destructuring
const colors = ['red', 'green', 'blue']
const [first, second] = colors
console.log(first)  // 'red'

// Function parameter destructuring
function greet({ name, age }) {
  console.log(`${name} is ${age} years old`)
}
greet(user)  // 'John is 25 years old'
```

**4. Template Literals: String Concatenation Without Pain**

```javascript
// ❌ Old way: A mess of quotes and plus signs
const msg = 'User ' + name + ' is ' + age + ' years old'

// ✅ New way: Backticks + ${}
const msg = `User ${name} is ${age} years old`

// Also supports multi-line
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Age: ${age}</p>
  </div>
`
```

**5. `async/await`: Write Async Code Like Synchronous Code**

```javascript
// ❌ Callback hell
fetchUser(function(user) {
  fetchOrders(user.id, function(orders) {
    fetchDetails(orders[0].id, function(details) {
      console.log(details)
    })
  })
})

// ✅ async/await
async function getUserData() {
  const user = await fetchUser()
  const orders = await fetchOrders(user.id)
  const details = await fetchDetails(orders[0].id)
  console.log(details)
}
```

**6. Optional Chaining `?.` and Nullish Coalescing `??`**

```javascript
const user = {
  name: 'John',
  address: {
    city: 'Beijing'
  }
}

// ❌ Old way: Layer-by-layer checks
const street = user && user.address && user.address.street
const streetName = street !== undefined ? street : 'Unknown'

// ✅ New way: Optional chaining + nullish coalescing
const streetName = user?.address?.street ?? 'Unknown'
```

::: tip 💡 How to Know Which Features a Browser Supports?

1. **Check compatibility tables**: [caniuse.com](https://caniuse.com/) — enter the feature name
2. **Use build tools**: Babel can transpile new syntax into code older browsers understand
3. **Know your target users**: If you only support modern browsers, most ES6+ features work directly
:::

### 4.6 TypeScript: Adding Type Constraints to JavaScript

#### Why Do We Need TypeScript?

**Scenario 1: Uncertain function parameter types**

```javascript
// JavaScript
function calculateTotal(price, quantity) {
  return price * quantity
}

calculateTotal(100, 5)      // 500 ✅
calculateTotal('100', 5)    // '1005' ❌ String concatenation, not multiplication
calculateTotal(100, '5')    // 500 ✅ But this is just luck
```

JavaScript won't tell you the parameter type is wrong until you discover the problem at runtime.

**Scenario 2: Object property typos**

```javascript
// JavaScript
const user = {
  name: 'John',
  age: 25
}

console.log(user.nmae)  // undefined, typo but no error
```

**TypeScript solves these problems**:

```typescript
// TypeScript
interface User {
  name: string
  age: number
}

function greet(user: User) {
  console.log(`Hello, ${user.name}`)
  console.log(user.nmae)  // ❌ Compile-time error: Property 'nmae' does not exist
}

greet({ name: 'John', age: 25 })        // ✅
greet({ name: 'John', age: '25' })      // ❌ Compile-time error: age should be number
greet({ name: 'John' })                 // ❌ Compile-time error: missing age
```

#### Core Concepts of TypeScript

**1. Basic Types**

```typescript
let name: string = 'John'
let age: number = 25
let isActive: boolean = true
let anyValue: any = 'Can be any type'  // Not recommended, defeats the purpose of type checking
```

**2. Interface: Defining Object Structure**

```typescript
interface Product {
  id: number
  name: string
  price: number
  discount?: number  // Optional property
  readonly createdAt: Date  // Read-only property
}

const product: Product = {
  id: 1,
  name: 'iPhone 15',
  price: 6999,
  createdAt: new Date()
}
```

**3. Type Alias**

```typescript
type ID = string | number  // Union type
type Status = 'pending' | 'approved' | 'rejected'  // Literal type

function updateStatus(id: ID, status: Status) {
  // ...
}

updateStatus(1, 'approved')      // ✅
updateStatus('abc', 'pending')   // ✅
updateStatus(1, 'processing')    // ❌ 'processing' is not a valid Status
```

**4. Generics: Reusable Types**

```typescript
// Without generics: Write once per type
function getFirstNumber(arr: number[]): number {
  return arr[0]
}
function getFirstString(arr: string[]): string {
  return arr[0]
}

// With generics: One function handles it all
function getFirst<T>(arr: T[]): T {
  return arr[0]
}

getFirst([1, 2, 3])        // Returns number
getFirst(['a', 'b', 'c'])  // Returns string
```

#### TypeScript vs JavaScript Comparison

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| Type checking | Errors found at runtime | Errors found at compile time |
| IDE support | Basic hints | Intelligent autocomplete, refactoring, go-to-definition |
| Learning curve | Easy | Need to learn the type system |
| Suitable scenarios | Small projects, prototypes | Large projects, team collaboration |
| How it runs | Browsers run it directly | Needs to be compiled to JavaScript |

#### TypeScript in Real Development

```typescript
// API response type definition
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: number
  name: string
  email: string
}

// Typed API request
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// IDE will hint all properties when using
fetchUser(1).then(res => {
  console.log(res.data.name)   // ✅ IDE autocomplete
  console.log(res.data.nmae)   // ❌ Compile-time error
})
```

::: tip 💡 Beginner Advice

1. **Learn JavaScript well first**: TypeScript is a superset of JS; learning TS without knowing JS will be painful
2. **Don't force TS on small projects**: Type definitions add code volume, making simple projects more complex
3. **Transition from JSDoc**: Write `/** @type {User} */` comments in JS files to experience type hints
4. **Using `any` is a compromise, not a solution**: When you hit a type issue, try to solve it first rather than reaching for `any`
:::

### 4.7 Modern JavaScript Development Toolchain

::: tip 🎯 Why Do We Need a Toolchain?

Browsers only understand HTML/CSS/JS. But in modern development, we use:

- **TypeScript**: Browsers don't understand it, needs to be compiled to JS
- **SCSS/Less**: Browsers don't understand it, needs to be compiled to CSS
- **Modules**: `import/export` needs to be bundled into a single file
- **New syntax**: ES6+ needs to be transpiled into code older browsers support

The toolchain transforms "development-time code" into "browser-runnable code."
:::

**Core Tools**:

| Tool | Purpose | Analogy |
|------|---------|---------|
| **Node.js** | JavaScript runtime | Lets JS run outside the browser |
| **npm/yarn/pnpm** | Package manager | Downloads code libraries written by others |
| **Vite/Webpack** | Build tool | Bundles source code into browser-runnable code |
| **Babel** | Compiler | Transpiles new syntax to old syntax |
| **ESLint** | Code linter | Finds code issues and style inconsistencies |

**A Typical Development Workflow**:

```bash
# 1. Initialize the project
npm create vite@latest my-app -- --template vue-ts

# 2. Install dependencies
cd my-app
npm install

# 3. Development mode (hot reload)
npm run dev

# 4. Build for production
npm run build
```

---

## 5. How the Three Work Together

### 5.1 Division of Labor

| Role | Responsible For | Doesn't Do | Typical Example |
|------|----------------|------------|-----------------|
| **HTML** | Defines structure and semantics | Doesn't handle style/interaction | `<section><h1>Title</h1></section>` |
| **CSS** | Controls appearance and layout | Doesn't handle logic/data | `.card { background: white; }` |
| **JavaScript** | Handles interaction and logic | Doesn't define structure | `button.onclick = () => alert()` |

### 5.2 A Complete Collaboration Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* CSS: Make the card look good */
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      max-width: 300px;
    }
    .card button {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <!-- HTML: Define the card structure -->
  <div class="card">
    <h2 id="title">Click the Button</h2>
    <button id="btn">Click Me</button>
  </div>

  <script>
    // JavaScript: Make the button clickable
    const btn = document.getElementById('btn')
    const title = document.getElementById('title')

    btn.addEventListener('click', function() {
      title.textContent = 'Clicked!'
      alert('Title has been changed')
    })
  </script>
</body>
</html>
```

---

## 6. What to Do Criteria for You Encounter Unfamiliar Code

### 6.1 Ask AI

> "What does the `<aside>` tag in HTML mean? When should I use it?"
>
> "What effect does `position: sticky` have in CSS?"

### 6.2 Check MDN

[MDN Web Docs](https://developer.mozilla.org/) is the most authoritative web technology documentation. When you encounter an unfamiliar tag, property, or method, just search for it.

### 6.3 Browser Developer Tools

1. Right-click a page element → "Inspect"
2. See the HTML structure in the **Elements** panel
3. See CSS styles in the **Styles** panel
4. Execute JS code in the **Console** panel

### 6.4 Common CSS Properties Quick Reference

| If You See This | What It Does |
|-----------------|--------------|
| `display: flex` | Enables flexbox layout |
| `position: absolute` | Absolute positioning |
| `z-index: 100` | Stack order, higher number = on top |
| `overflow: hidden` | Hides content that overflows |
| `cursor: pointer` | Changes mouse cursor to a hand |
| `transition: all 0.3s` | Animation transition effect |
| `box-sizing: border-box` | Makes width include padding and border |

---

## 7. Glossary

| Term | Full Name | Plain English Explanation |
|------|-----------|---------------------------|
| **HTML** | HyperText Markup Language | A markup language that uses tags to describe web page structure |
| **CSS** | Cascading Style Sheets | Controls colors, layout, and animations |
| **JavaScript** | JavaScript | The programming language of the web, responsible for interaction and logic |
| **DOM** | Document Object Model | Represents the page as an object tree |
| **Flexbox** | Flexible Box Layout | A one-dimensional layout scheme, easy alignment and distribution |
| **Box Model** | CSS Box Model | The layered boxes from content to outer margin for each element |
| **SCSS** | Sassy CSS | A CSS preprocessor supporting variables, nesting, and mixins |
| **TypeScript** | TypeScript | A superset of JavaScript that adds a type system |
| **ES6** | ECMAScript 2015 | A major version of JavaScript that added many new syntax features |
| **Semantic** | Semantic HTML | Using meaningful tags (like header) instead of div |
| **Responsive** | Responsive Design | Design that automatically adapts to different screen sizes |

---

## Summary

Now you know: **HTML defines the skeleton, CSS handles the looks, and JavaScript gives it a soul**.

These three are the cornerstones of web development. Understanding them means you can:

- Read the source code of any web page (Right-click → "View Page Source")
- Modify other people's web pages (Browser DevTools → Elements)
- Start learning frontend frameworks (Vue/React), which are all built on top of these three

**Next Steps**:

- If you want to quickly build web pages, learn the **Vue** or **React** framework
- If you want to deeply understand CSS, learn **Flexbox** and **Grid** layouts
- If you want to improve code quality, learn **TypeScript**
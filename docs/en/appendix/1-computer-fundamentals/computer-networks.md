# Computer Networks: From URL to Page Rendering

::: tip Preface
You use a browser every day — watching videos, reading news, working online. But have you ever wondered: **When you type a URL in the address bar and press Enter, what happens behind the scenes?**

This article will use a relatable analogy of **"online shopping"** combined with the **actual technical process** to walk you step by step through how a browser turns a URL into a rich, colorful page.

After reading this, you will be able to:
- Understand the complete process from entering a URL to displaying a page
- Master core concepts like URL, DNS, TCP, and HTTP
- Learn how browsers render pages
- Know the difference between static and dynamic websites

**No programming experience required** — all you need is your everyday online shopping experience.
:::

**What will you learn from this article?**

After completing this chapter, you will master the complete technical process from entering a URL to page display, and understand how browsers and servers work together. This knowledge is the foundation for learning about APIs, interfaces, network security, and other technologies. It's also key to troubleshooting everyday issues like "webpage won't load" or "slow loading."

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | URL Parsing | Structure and purpose of URLs |
| **Chapter 2** | DNS Lookup | How domain names convert to IP addresses |
| **Chapter 3** | TCP Handshake | How to establish a reliable connection |
| **Chapter 4** | HTTP Communication | How browsers and servers talk to each other |
| **Chapter 5** | Browser Rendering | How code becomes a visual page |
| **Chapter 6** | Static vs Dynamic | How webpage content is generated |

---

## 0. Introduction: Lifecycle of a Network Request

::: tip Core Question
**When you type a URL in your browser and press Enter, what happens behind the scenes?** Why do some pages load quickly while others are slow? Why do you sometimes get a "server not found" error?
:::

### Analogy: An Online Shopping Journey

Imagine you're doing some **online shopping**. The entire process can be divided into 5 steps:

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Step 1: Fill Out the Order**
Select products and confirm the delivery address

</div>
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Step 2: Find the Warehouse**
The system locates the specific shipping warehouse

</div>
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Step 3: Establish a Channel**
Confirm the warehouse is open and can ship

</div>
</div>

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Step 4: Warehouse Ships**
The courier delivers the package to your door

</div>
<div style="flex: 1; padding: 16px; background: var(--vp-c-bg-alt); border-radius: 12px;">

**Step 5: Unboxing Experience**
Open the package and see your desired product

</div>
</div>

**The process of visiting a webpage is remarkably similar to online shopping!**

When you type `google.com` in your browser and press Enter, you are the "buyer." Through a series of operations, the browser eventually delivers the "product" (webpage content) from a distant server to your screen.

<UrlToBrowserQuickStart />

::: info Key Insight
The key to understanding how browsers work is: **map complex technical processes to familiar real-life scenarios.** The 5 steps of online shopping perfectly correspond to the 5 technical stages of a browser accessing a webpage.
:::

---

## 1. URL Parsing

::: tip Core Question
**Why does a URL look like this?** `https://www.example.com:8080/path/page.html?id=123#section` — What does this string of characters actually mean?
:::

### Analogy: Filling Out an Order Form

If you only wrote "buy shoes" on an order, the warehouse wouldn't know which pair to send. You need to specify:

- **Store type** (official flagship store / regular store)
- **Store name** (Nike official store)
- **Product location** (Men's shoes / Running series)
- **Specific model** (Air Max 90)
- **Special notes** (I want the red one)

### Actual Process: URL Parsing Flow

A **URL (Uniform Resource Locator)** is the "product locator code" of the browser world. When you type `https://www.example.com:8080/path/page.html?id=123#section` in the address bar, the browser immediately breaks it down:

| URL Part | Example Value | Shopping Analogy | Technical Purpose |
| -------------------------- | -------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| **Protocol** `https://` | Secure Hypertext Transfer Protocol | **Shipping method**: Secure delivery (HTTPS) vs regular delivery (HTTP) | Determines the communication rules. `http` is regular transfer, `https` is encrypted transfer |
| **Domain** `www.example.com` | Human-readable name of the server | **Store name**: JD Supermarket | Tells the browser which server to find. Domain names are for human memorization and must eventually be converted to IP addresses |
| **Port** `:8080` | Specific "door number" of the server | **Counter number**: Counter #3 (default is omitted) | A server may have multiple services; the port specifies which one to access. HTTP defaults to 80, HTTPS to 443 |
| **Path** `/path/page.html` | File location on the server | **Shelf location**: Daily goods aisle / Third row | Specifies the exact resource location on the server |
| **Query parameters** `?id=123` | Additional information | **Order notes**: Red, size XL | Extra data passed to the server, such as search keywords and page numbers |
| **Fragment** `#section` | Position within the page | **Manual page reference**: Turn to page 5 | Automatically scrolls to the specified position after the page loads; not sent to the server |

<UrlParserDemo />

::: info Key Understanding
URLs exist so that **humans** can remember and type them. What computers ultimately need are **IP addresses** (just as couriers need the actual warehouse address, not just the name "Nike Official Store").
:::

---

## 2. DNS Lookup

::: tip Core Question
**How does the browser find the website?** You type a human-readable domain name (like `baidu.com`), but what computers really need are numeric addresses (IP). What happens in between?
:::

### Analogy: Looking Up the Warehouse Address

You wrote "Nike Official Store" on your order, but the logistics system doesn't know where the warehouse is. It needs to check an address book:

1. First check **recent addresses** (have I bought from this store recently?) → Browser cache
2. If not, ask the **neighborhood delivery point** (they know the general area assignments) → Local DNS server
3. Ask the **headquarters dispatch center** (knows who manages .com stores) → Root name server
4. Ask the **brand management office** (ultimately finds the real shipping warehouse for the Nike store) → Authoritative name server

### Actual Process: DNS Hierarchical Lookup Flow

**DNS (Domain Name System)** is the internet's "distributed address book lookup system." Since there are billions of domain names worldwide, a hierarchical architecture is used to distribute the query load:

```
You (Browser)
    ↓ Ask: What's the IP for google.com?
Local DNS server (your ISP, such as China Telecom/China Unicom)
    ↓ Ask: Who manages .com?
Root name server (13 root server groups worldwide, managing all top-level domains)
    ↓ Tell: Ask the .com manager
Top-level domain server (Verisign manages .com)
    ↓ Tell: Ask the google.com manager
Authoritative name server (Google's own DNS server)
    ↓ Tell: google.com's IP is 142.250.80.46
Return IP address to browser
```

**Query types explained:**

- **Recursive Query**: The browser sends only one request; the local DNS is responsible for querying all levels and returning the result
- **Iterative Query**: Each level only tells the next level where to look; the browser needs multiple queries
- **Caching mechanism**: Query results are cached for direct return next time, greatly speeding up access

<DnsLookupDemo />

::: info Why So Many Layers?
Imagine if the entire world had only one address book — billions of people querying it simultaneously would crash it instantly. The hierarchical design lets each level manage only its own "jurisdiction," making it both efficient and reliable.

This is a core design principle of the internet: **distributed systems**.
:::

---

## 3. TCP Connection Establishment: The Three-Way Handshake

::: tip Core Question
**Why is a "three-way handshake" needed?** After finding the server address, why can't you just send data directly? Why go through three rounds of communication first?
:::

### Analogy: Establishing a Logistics Channel

If a logistics truck drove directly to the warehouse, the result could be:

- The warehouse is closed → Wasted trip
- The warehouse is overloaded and not accepting orders → Can't ship
- Can't find the loading dock → Can't connect

**So before actually shipping goods, you must first establish a reliable transport channel.**

### Actual Process: TCP Three-Way Handshake Flow

**TCP (Transmission Control Protocol)** is the protocol that ensures reliable data transmission. Before transmitting goods (data), a connection must be established through the "three-way handshake":

```
Client (Your Computer)              Server (Merchant Warehouse)
   |                                |
   |--- SYN=1 --------------------->|  1st: Hello, I'm home and ready to receive! (SYN)
   |                                |
   |<-- SYN=1, ACK=1 ---------------|  2nd: Got it! I'm ready to ship too. Are you home? (SYN-ACK)
   |                                |
   |--- ACK=1 --------------------->|  3rd: Yes! Please ship. (ACK)
   |                                |
   ===== Channel established, shipping begins =====
```

**Why three times, not two?**

- **First (SYN)**: Client proves it can send
- **Second (SYN-ACK)**: Server proves it can receive and send
- **Third (ACK)**: Client proves it can receive

The three-way handshake ensures: **both parties can send and both can receive** — all four conditions are met for reliable transmission.

**TCP is also responsible for:**

- **Data segmentation**: Breaking large data into smaller packets for transmission
- **Sequential reassembly**: Ensuring packets are assembled in the correct order
- **Error retransmission**: Automatically resending lost packets
- **Flow control**: Adjusting sending speed based on network conditions

<TcpHandshakeDemo />

> **HTTPS Extra Step**: For HTTPS (secure websites), after the TCP handshake, a **TLS handshake** (1-RTT or 2-RTT) is also performed. Both parties exchange encryption keys to ensure only they can understand the subsequent conversation — like communicating in secret code.

---

## 4. HTTP Protocol: Requests and Responses

::: tip Core Question
**What are the browser and server saying to each other?** After establishing a connection, how does the browser "tell" the server what it wants? And how does the server "respond"?
:::

### Analogy: Ordering, Shipping, and Order Verification

The logistics truck arrives at the warehouse: "Here's the order (HTTP request), **I want to pick up the product (webpage HTML source code)!**"
The warehouse manager verifies: "The order is valid. Here's your package (**HTML file**). Please take it."

### Actual Process: HTTP Communication Flow

**HTTP (HyperText Transfer Protocol)** is the "conversation rules" between browser and server. After the channel is established, the browser sends a **pickup request**. The **core goal is to retrieve the webpage's source code (HTML file)**:

**HTTP Request Example:**

```http
GET /index.html HTTP/1.1          ← Request method + path + protocol version
Host: www.example.com             ← Target host (supports virtual hosting; one server can host multiple websites)
User-Agent: Chrome/120.0          ← Client identifier (server can return adapted content based on this)
Accept: text/html,application/xhtml+xml  ← Acceptable response formats
Accept-Language: zh-CN,zh;q=0.9   ← Preferred languages
Accept-Encoding: gzip, deflate    ← Supported compression formats
Connection: keep-alive            ← Keep connection alive (reuse TCP connection)
Cookie: session_id=abc123         ← Authentication credentials
```

::: tip Developer Epiphany: Isn't This Just an API?
**Exactly the same!**
The API calls you write (`fetch` / `axios`) and the browser accessing a webpage are **exactly the same thing at the HTTP level**.

Both send a request, and the server returns text data.

- If the server returns **HTML**, the browser **renders** it (turning it into a webpage).
- If the server returns **JSON**, your code **stores** it (for logic processing).

**There aren't "two types" of requests — there's only one kind of HTTP request. The difference is just the response data format (Content-Type).**
This is why understanding HTTP means you understand 90% of backend API principles.

If you want to dive deeper into API development, please refer to the [API chapter](./api-intro.md).
:::

**Common HTTP Methods:**

- `GET`: Retrieve a resource (safe, idempotent, cacheable)
- `POST`: Submit data (create a resource, such as registration, login)
- `PUT`: Update a resource (full replacement)
- `PATCH`: Partially update a resource
- `DELETE`: Delete a resource
- `HEAD`: Get response headers only (no body returned; used to check if a resource exists)

**Server Returns HTTP Response:**

```http
HTTP/1.1 200 OK                   ← Protocol version + status code + status description
Date: Mon, 23 May 2025 12:00:00 GMT  ← Server time
Content-Type: text/html; charset=UTF-8  ← Content type and encoding
Content-Length: 1234              ← Content length (bytes)
Cache-Control: max-age=3600       ← Caching policy
Set-Cookie: user_id=xyz789        ← Set Cookie

<!DOCTYPE html>...                ← Response body (webpage content)
```

**HTTP Status Code Categories:**

| Status Code | Category | Meaning | Real-life Analogy |
| ----------- | ---------- | ---------------- | -------------------------------- |
| **200** | Success | Request successfully processed | "Order confirmed, shipping now" |
| **301/302** | Redirect | Resource has moved | "This store has relocated, please order at the new location" |
| **304** | Not Modified | Cache is still valid | "What you bought last time is still usable, no need to reship" |
| **400** | Client Error | Malformed request | "The order is unclear and unreadable" |
| **401** | Unauthorized | Authentication required | "Please show your membership card first" |
| **403** | Forbidden | Insufficient permissions | "Staff only, no entry" |
| **404** | Not Found | Resource does not exist | "This product is not in stock" |
| **500** | Server Error | Internal server error | "The warehouse is on fire, can't ship for now" |
| **502** | Bad Gateway | Upstream server unresponsive | "Main warehouse is out of stock, branch can't transfer either" |
| **503** | Service Unavailable | Server overloaded or under maintenance | "Too many orders, temporarily paused" |

<HttpExchangeDemo />

---

## 5. Browser Rendering Engine

::: tip Core Question
**How does code become a visual display?** The server sends dry HTML/CSS/JavaScript code. How does the browser turn it into a rich, colorful webpage?
:::

### Analogy: Unboxing and Assembly

You finally receive the delivery package (HTTP response), but when you open it, it's not ready-made furniture — it's a pile of **parts** (HTML) and an **assembly manual** (CSS). As the "buyer" (browser), you need to assemble it yourself:

1. **Open the packaging**: Take out all parts and check the list (parse HTML → DOM tree).
2. **Read the manual**: Understand the instructions — which part goes where, what color (parse CSS → CSSOM tree).
3. **Sort and organize**: Pick out the parts to assemble, discard the packing foam (`display: none`), and prepare for assembly (build render tree).
4. **Measure positions**: Use a ruler to measure the room dimensions and decide exactly where each piece of furniture goes (layout/reflow).
5. **Paint and decorate**: Apply paint and decals to the furniture (paint).
6. **Final display**: Clean up and turn on the lights for display (compositing).

### Actual Process: Page Rendering Flow

What the browser receives is **HTML/CSS/JavaScript code** (dry text), but it needs to become **pixel imagery** (a beautiful webpage). This process is called **rendering**, performed by the browser's **rendering engine** (such as Chrome's Blink, Safari's WebKit).

#### Step 1: Parse HTML → Build DOM Tree (Parts List)

The browser reads the HTML byte stream and parses it into a **DOM (Document Object Model) tree**. This is like organizing a pile of scattered parts into a hierarchically structured list:

```html
<!-- Original HTML -->
<div class="header">Title</div>
<div class="content">Content</div>
```

```text
DOM tree structure:
Document
 └─ html
     └─ body
         ├─ div.header ("Title")
         └─ div.content ("Content")
```

#### Step 2: Parse CSS → Build CSSOM Tree (Manual)

The browser parses all CSS (inline, external files) and builds a **CSSOM (CSS Object Model) tree**. This is like understanding the style rules in the manual:

```css
.header {
  color: blue;
  font-size: 24px;
} /* Title should be blue */
.content {
  display: none;
} /* Content temporarily hidden */
```

#### Step 3: Merge → Render Tree (Ready to Assemble)

DOM tree + CSSOM tree = **Render Tree**.
Key point: **Only "visible" elements are in the render tree.**

- `.header`: In the render tree (visible).
- `.content`: **Not** in the render tree (because `display: none`, like discarded wrapping paper that doesn't need assembly).

#### Step 4: Layout (Reflow) — Measure Dimensions

The browser calculates the **exact coordinates and sizes** of each node in the render tree on screen.

- "This title box is 100px wide, 50px tall, positioned at screen coordinates (0,0)."
- This process is called **reflow**. If the window size changes (e.g., rotating a phone), all element positions must be recalculated — very performance-intensive.

#### Step 5: Paint — Apply Colors

After knowing the positions, the browser starts filling in pixels: painting background colors, text colors, borders, shadows, etc.

#### Step 6: Composite — Final Display

Modern browsers divide the page into multiple **layers** for separate painting (e.g., 3D transforms, independent scrollbar layers), and the GPU composites them together like Photoshop layers onto the screen.

<BrowserRenderingDemo />

::: info Did You Know?
**Layout and painting** are when the browser is busiest. The more elements and complex the structure on a page, the more time the browser needs to calculate positions and paint colors. This is why some complex pages can feel sluggish.
:::

---

## 5.5 Page Generation Methods: Static vs. Dynamic Websites

::: tip Core Question
**Where does webpage content come from?** We covered how browsers render pages, but how does the HTML file on the server get there? Is it prepared in advance or made on demand?
:::

Everything we've covered so far is about how the browser "opens the package" — rendering the HTML/CSS/JS sent by the server into a page. But have you ever wondered: **how did that HTML file on the server get there in the first place?**

The answer: **there are two ways** — and that's the difference between static and dynamic websites.

### Static Websites: Pre-made and Served Directly

Imagine going to a supermarket to buy cookies. The cookies on the shelf are already produced at the factory — you just pick them up, no waiting needed.

A **static website** works the same way — the webpage is already prepared on the server. When you visit, the server sends the ready-made HTML file directly without any additional processing.

**Characteristics:**
- Fast access (server just sends files, no computation needed)
- Simple to create (just write HTML and it's ready)
- High capacity (can use CDN distribution; handles any traffic volume)
- Hard to update content (changing content requires regenerating files)

**Common examples:** Company profile pages, product documentation, help centers, personal blogs

### Dynamic Websites: Made to Order, Different Each Time

Now imagine going to a restaurant and ordering food. The chef prepares your dish fresh based on your order — if you order Kung Pao Chicken, you won't get Sweet and Sour Pork.

A **dynamic website** generates pages "on the spot" when you visit — after receiving your request, the server queries databases, computes data, and generates a brand new HTML file for you.

**Characteristics:**
- Real-time content (shopping carts show latest inventory, news updates instantly)
- Personalized (after logging in, you see your own profile)
- Powerful features (search, comments, recommendations, payments all possible)
- Slower access (server needs time to compute)
- Higher server load (many simultaneous visitors may need to queue)

**Common examples:** Taobao, Weibo, online banking, online documents

**Do you need a server?** Dynamic websites do need some kind of "backend" to generate content, but the forms vary:
- **Traditional servers**: Buy/rent your own server (Alibaba Cloud ECS, AWS EC2)
- **Serverless**: No server management needed; the cloud provider runs your code (AWS Lambda, Alibaba Cloud Function Compute, Cloudflare Workers)
- **Third-party API calls**: Use Stripe for payments, weather bureau API for weather — no need to write your own backend code

::: tip Combining Static and Dynamic
Many websites today are "hybrid": the main page structure is static, but certain parts (like comment sections, search boxes) are dynamically loaded. JavaScript can call APIs to fetch data after the page loads, achieving "static pages + dynamic functionality."
:::

### Static and Dynamic Websites: A Clear Comparison

| | Static Website | Dynamic Website |
|---|---------|---------|
| **How it's generated** | Pre-made, stored on server | Made on demand when visited |
| **Analogy** | Products on supermarket shelves | Made-to-order dishes at a restaurant |
| **Speed** | Fast | Slower (requires computation) |
| **Can content be changed?** | Difficult (need to regenerate) | Easy (change in the backend) |
| **Best for** | Display content (profiles, docs) | Interactive applications (shopping, social) |
| **Typical examples** | Company websites, help docs | Taobao, WeChat, online banking |

### Common Questions

**Q: Can static websites not use JavaScript?**

Of course they can! Interactive features like carousels, dropdown menus, and form validation can all be implemented with JavaScript on a static website. When we say "static" and "dynamic," we're referring to **whether the page content is pre-prepared**, not whether it has interactive features.

**Q: Do dynamic websites require buying your own server?**

Not necessarily. Besides traditional servers, you can use Serverless (cloud functions) or directly call third-party APIs. The current trend is "avoid touching servers when possible" — using static websites + JavaScript API calls for speed and cost savings.

::: tip Important Note
Whether a website is static or dynamic, **the browser rendering principles are exactly the same!** The browser renders whatever the server sends. The only difference is:
- Static website: The server sends a "finished product"
- Dynamic website: The server sends a "freshly made" product

As a frontend developer, your main focus is how the browser handles the content it receives, not how the server generated it.
:::

---

## 6. Summary: The Complete Network Request Process

::: tip After This Chapter, You Should Be Able To
- Explain the complete process from entering a URL to displaying a page
- Understand the roles and relationships of URL, DNS, TCP, and HTTP
- Know how browsers render pages
- Distinguish between static and dynamic websites
- Explain browser workings to others using real-life analogies
:::

Let's review the entire journey:

| Stage | Technical Term | Shopping Analogy | Core Task | Key Technology |
| ----------- | ---------- | -------- | ------------------ | ------------------------------ |
| **1. Parse** | URL Parsing | Fill out order | Understand what the buyer wants | Protocol, domain, port, path, parameters |
| **2. Lookup** | DNS Lookup | Find warehouse address | Find the store's shipping warehouse | Recursive/iterative queries, caching |
| **3. Connect** | TCP Handshake | Establish channel | Ensure smooth logistics | Three-way handshake, sequence numbers, flow control |
| **4. Exchange** | HTTP Exchange | Warehouse ships | Submit order and receive goods | Request methods, status codes, header fields |
| **5. Display** | Browser Rendering | Unbox and assemble | Display the product | DOM, CSSOM, render tree, layout, paint |

**The entire process typically completes in a few hundred milliseconds** — think about how remarkable that is!

Your browser, in less than 1 second:

- Parsed a complex address
- Queried DNS servers distributed around the world
- Established a reliable connection with a server thousands of miles away
- Conducted a complete HTTP conversation
- Turned dry code into a beautiful visual display

This is the charm of the internet: **complex technology, simple experience.**

::: info Further Learning
If you want to dive deeper into any part, check out:
- **API Development**: [Introduction to APIs](./api-intro.md) - Learn how to design and use APIs
- **Frontend Performance**: [Frontend Performance Optimization](./frontend-performance.md) - Learn how to optimize webpage loading speed
- **Browser Rendering**: [Browser Rendering Pipeline](./browser-rendering-pipeline.md) - Deep dive into rendering details
:::

---

## 7. Glossary

| Term | Full Name | Simple Explanation |
| ----------- | ----------------------------- | -------------------------------------------------------------------------- |
| **URL** | Uniform Resource Locator | The "address" of a webpage, telling the browser where to find the resource. |
| **DNS** | Domain Name System | The internet's "phone book," converting human-readable domain names into machine-readable IP addresses. |
| **IP Address** | Internet Protocol Address | The unique "door number" for every networked device, such as `192.168.1.1`. |
| **TCP** | Transmission Control Protocol | The "rules" ensuring reliable data transmission, establishing connections through a three-way handshake. |
| **HTTP** | HyperText Transfer Protocol | The rules for "conversation" between browser and server. |
| **HTTPS** | HTTP Secure | **Secure HTTP**. Adds encryption (TLS/SSL) on top of HTTP to protect data security. |
| **HTML** | HyperText Markup Language | The "skeleton" of a webpage, defining content structure. |
| **CSS** | Cascading Style Sheets | The "skin" of a webpage, defining content appearance. |
| **DOM** | Document Object Model | The tree structure the browser converts HTML into for easier manipulation. |
| **CSSOM** | CSS Object Model | The tree structure the browser converts CSS into. |
| **Rendering** | | The process of the browser converting code into screen pixels. |
| **RTT** | Round Trip Time | The time for a data packet to be sent and its acknowledgment received, affecting webpage loading speed. |

---

::: tip Congratulations
Now when you type a URL in the address bar and press Enter again, you can already see the busy and fascinating digital world behind your screen.

You now understand:
- Why sometimes webpages won't open (DNS resolution failure, server down)
- Why some pages are fast and others slow (network latency, server performance, page complexity)
- How the browser turns code into a visual display (rendering pipeline)

**This is the value of understanding technical principles** — when problems arise, you know where to look for the cause instead of feeling helpless.
:::

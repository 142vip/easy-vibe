# Computer System Overview: From Boot to Web Visit

::: tip Preface
Have you ever wondered what happens between pressing your computer's power button and finally seeing a webpage in your browser?

This process is like a **relay race** — hardware powers up and wakes the firmware, the firmware finishes checking and passes the baton to the operating system, the OS prepares the environment so the browser can run, and the browser reaches across the network to retrieve a webpage from a distant server. Every step **depends on the successful completion of the previous one**. If any runner drops the baton, subsequent steps cannot proceed.

Understanding this complete chain will help you build a holistic understanding of computer systems and is an essential step on the path to becoming a full-stack engineer.
:::

**What will you learn?**

This article guides you through the five stages from pressing the power button to seeing a webpage, in the actual order events occur:

1. **Hardware Boot** (Section 1) → How current wakes the CPU
2. **Firmware Self-Test** (Section 2) → How BIOS/UEFI confirms hardware is normal and finds the boot device
3. **OS Boot** (Section 3) → How the kernel loads and the desktop appears
4. **Browser Launch** (Section 4) → How an application is run by the operating system
5. **Network Request** (Section 5) → The complete network journey from entering a URL to page rendering

Each step builds on the previous one, and none can be skipped.

---

## 1. Pressing Power: Hardware Awakening

### 1.1 Power Supply Startup

When you press the power button, the **Power Supply Unit (PSU)** starts working, converting alternating current (220V) into direct current (12V, 5V, 3.3V, etc.) to power all hardware components.

```
Power button → Power Supply Unit (PSU) → DC output → Powers motherboard components
```

### 1.2 Motherboard Chipset Wake-up

Once the power stabilizes, the **motherboard chipset** begins working. It's like the computer's "head dispatcher," responsible for coordinating all hardware components.

### 1.3 CPU Reset

After receiving the reset signal, the CPU clears all internal registers and cache, and starts executing instructions from a preset address. This address typically points to the **BIOS/UEFI** chip.

<PowerOnDemo />

---

> **First relay leg complete** At this point, the hardware-level work is done: the power supply converted AC into stable DC, the motherboard chipset was awakened and began coordinating components, and the CPU completed its reset, cleared registers, and is ready to execute its first instruction.
>
> But note — at this moment, the CPU is like a "newborn baby just opening its eyes." It can execute instructions but knows nothing about its environment: how much memory is installed? Is the graphics card working? Where is the hard drive? Which device should it boot the OS from? The CPU can't answer these questions itself.
>
> So the first instruction the CPU executes after reset is a jump to a **fixed memory address** — this address points to the BIOS/UEFI firmware chip permanently soldered on the motherboard. From this moment on, control passes from pure hardware to firmware. BIOS/UEFI's mission is clear: **check that all hardware is functioning properly, then find and boot the operating system.** This is the second leg of the relay.

## 2. BIOS/UEFI: Hardware Self-Test

<BiosUefiInteractiveDemo />

---

> **Second relay leg complete** BIOS/UEFI has successfully fulfilled its three missions: confirmed through POST that memory, graphics card, keyboard, and other hardware are all working normally; initialized each hardware component's operating mode; and found the boot sector on the hard drive according to the boot order.
>
> But BIOS/UEFI's role ends here — it's essentially a "health examiner + dispatcher." It can check if hardware is healthy and decide which device to boot from, but it won't manage your files, run your applications, or display a beautiful desktop. These complex tasks require a more powerful software to take over — the **operating system**.
>
> The handoff is very specific: BIOS/UEFI reads the bootloader code from the first sector of the hard drive (boot sector), loads it into memory, and tells the CPU to jump to this code and begin execution. From this moment, control officially passes from firmware to the OS bootloader. The bootloader will gradually load the OS kernel, start system services, and ultimately present the familiar desktop. The most complex leg of this chain has begun.

## 3. OS Boot: From Kernel to Desktop

<OSBootInteractiveDemo />

---

> **Third relay leg complete** The operating system has fully started, and the desktop is displayed. Let's review what this leg accomplished: the bootloader read the kernel from disk, the kernel took control of the CPU and memory, system services started one by one (networking, audio, security center...), and finally the graphical interface rendered the desktop.
>
> At this point, the OS is like a building with water and electricity connected and property management moved in — **process management** allocates rooms to each resident (program), **memory management** allocates space, the **file system** manages the warehouse, and the **network protocol stack** handles external communications. These "public services" are the infrastructure all applications run on. Without them, no program could start.
>
> Now you want to go online, so you double-click the browser icon on the desktop. Behind this simple action, the OS must do a series of tasks: find where the browser's executable file is on the hard drive, create an independent process for it, allocate memory space, and load the program code... This is a direct demonstration of the OS's "process management" capability. Next, let's see how the browser is launched.

## 4. Opening the Browser: Application Startup

### 4.1 Application Launch Process

When you double-click the browser icon, the operating system will:

1. **Find the executable file**: Based on file associations, locate the browser's `.exe` (Windows) or executable file
2. **Create a process**: Create a new **process** for the browser
3. **Load the program**: Load the browser's code from the hard drive into memory
4. **Initialize**: Start the browser's main thread, rendering engine, network engine, etc.

```
Browser launch process:
┌─────────────────────────────────────┐
│  1. Double-click icon               │
│  2. OS finds browser executable     │
│  3. Create browser process          │
│  4. Load browser code into memory   │
│  5. Initialize modules (rendering,  │
│     networking, JS engine)          │
│  6. Display browser window          │
└─────────────────────────────────────┘
```

### 4.2 Major Components of a Browser

A modern browser is a complex "operating system," primarily composed of:

| Module | Function |
|-----|------|
| **User Interface** | Address bar, tabs, bookmarks, etc. |
| **Browser Engine** | Coordinates UI and rendering engine |
| **Rendering Engine** | Parses HTML/CSS and displays webpages |
| **JavaScript Engine** | Executes JavaScript code |
| **Networking Module** | Sends HTTP requests |
| **UI Backend** | Draws basic UI components |
| **Data Storage** | Cookies, LocalStorage, etc. |

<BrowserArchitectureDemo />

---

> **Fourth relay leg complete** The browser has launched successfully. The OS created an independent process for it, allocated memory space, and the browser's internal modules have all initialized: the rendering engine is ready to parse HTML/CSS, the JavaScript engine is ready to execute scripts, and the networking module is ready to send and receive data.
>
> You can think of the browser at this moment as a car that's been started — the engine is running, the dashboard is lit, and the navigation system is ready. But the car is still parked, because the driver (you) hasn't told it "where to go." The browser window is blank, the cursor blinks in the address bar, waiting for your input.
>
> When you type `https://www.example.com` in the address bar and press Enter, a journey spanning the entire internet begins. The browser's networking module takes over this request: first parsing the URL structure, then translating the domain name into an IP address via DNS, establishing a TCP connection with the distant server across the network, negotiating an encrypted channel, sending an HTTP request, waiting for the server's response, and finally passing the received HTML/CSS/JS code to the rendering engine to draw the webpage you see. This is the leg with the most steps and the richest set of protocols — and the one Web developers need to understand most.

## 5. Accessing a URL: The Complete Network Request Process

### 5.1 URL Overview

A **URL (Uniform Resource Locator)** is the address of a resource. Just like a real-world address, it locates resources on the internet.

```
URL structure:
┌─────────────────────────────────────────────────────────┐
│  https://  │  www.example.com  │  /path/to/page  │ ?query=1 │
│  Protocol  │     Domain        │      Path       │  Query   │
└─────────────────────────────────────────────────────────┘
```

- **Protocol**: How to access the resource (http, https, ftp, etc.)
- **Domain**: The server's address
- **Path**: The resource's location on the server
- **Query**: Additional parameters

### 5.2 The Complete Process of Accessing a URL

When you access `https://www.example.com`, here's what happens:

<URLRequestDemo />

#### Step 1: URL Parsing

The browser first **parses the URL**, extracting the protocol, domain, path, and other information.

```
URL parsing process:
https://www.example.com/index.html
  ↓
Protocol: https
Domain: www.example.com
Path: /index.html
```

#### Step 2: DNS Resolution

Computers access servers over the network using **IP addresses** (e.g., 93.184.216.34), not domain names. So the domain name must be converted to an IP address. This process is called **DNS resolution**.

```
DNS resolution flow:
┌─────────────────────────────────────────────────────────┐
│  Browser cache → hosts file → Local DNS cache → DNS server  │
└─────────────────────────────────────────────────────────┘

Actual process:
1. Browser checks cache (visited recently?)
2. Operating system checks DNS cache
3. Send query request to DNS server
4. DNS server returns IP address
```

#### Step 3: Establish TCP Connection

After obtaining the IP address, the browser needs to establish a **TCP connection** with the server. TCP is a transport layer protocol that ensures reliable data transmission.

```
TCP three-way handshake:
┌─────────────────────────────────────────────────────────┐
│  Client → Server: SYN (synchronization request)         │
│  Server → Client: SYN-ACK (acknowledge and synchronize) │
│  Client → Server: ACK (acknowledgment)                  │
│                        ↓                                │
│  Connection established!                                │
└─────────────────────────────────────────────────────────┘
```

For **HTTPS**, a **TLS/SSL handshake** is also needed to establish an encrypted channel.

#### Step 4: Send HTTP Request

After the connection is established, the browser sends an **HTTP request** to the server:

```
HTTP request format:
┌─────────────────────────────────────────────────────────┐
│  GET /index.html HTTP/1.1                              │
│  Host: www.example.com                                 │
│  User-Agent: Mozilla/5.0...                             │
│  Accept: text/html                                     │
│                                                         │
│  (empty line)                                          │
└─────────────────────────────────────────────────────────┘
```

Common HTTP methods:

| Method | Meaning | Purpose |
|-----|------|-----|
| **GET** | Retrieve a resource | Browsing webpages |
| **POST** | Submit data | Login, form submission |
| **PUT** | Upload a resource | File upload |
| **DELETE** | Delete a resource | Data deletion |

#### Step 5: Server Processes the Request

After the server (typically a **web server** like Nginx or Apache) receives the request:

1. **Parse the request**: Understand what the client wants
2. **Process business logic**: Call backend programs (e.g., Python, Node.js, Java)
3. **Query the database**: Retrieve needed data
4. **Generate response**: Assemble data into HTML, JSON, or other formats

```
Server processing flow:
┌─────────────────────────────────────────────────────────┐
│  1. Web server receives request (Nginx/Apache)          │
│  2. Route to the appropriate handler based on path      │
│  3. Execute backend code (API, business logic)          │
│  4. Query database if needed, retrieve data             │
│  5. Assemble response (HTML/JSON/CSS/JS)               │
│  6. Return HTTP response                                │
└─────────────────────────────────────────────────────────┘
```

#### Step 6: Return HTTP Response

The server returns an **HTTP response** containing a status code, response headers, and response body:

```
HTTP response format:
┌─────────────────────────────────────────────────────────┐
│  HTTP/1.1 200 OK                                       │
│  Content-Type: text/html                               │
│  Content-Length: 1234                                  │
│                                                         │
│  <!DOCTYPE html>                                       │
│  <html>...</html>                                      │
└─────────────────────────────────────────────────────────┘
```

Common status codes:

| Status Code | Meaning |
|-------|------|
| **200** | Success |
| **301/302** | Redirect |
| **404** | Resource not found |
| **500** | Server error |

#### Step 7: Browser Renders the Page

After receiving the response, the browser begins **rendering the page**:

<RenderingDemo />

1. **Parse HTML**: Build the DOM tree
2. **Parse CSS**: Calculate styles and build the render tree
3. **Execute JavaScript**: Run JS code in the page
4. **Paint the page**: Display content on screen

```
Browser rendering process:
┌─────────────────────────────────────────────────────────┐
│  1. HTML parsing → DOM tree                             │
│  2. CSS parsing → Style rules                           │
│  3. DOM + CSS → Render tree                             │
│  4. Layout calculation → Size and position of elements  │
│  5. Paint → Pixels displayed on screen                  │
│  6. Composite → Multiple layers merged for display      │
└─────────────────────────────────────────────────────────┘
```

---

> **Final relay leg complete** The webpage is finally displayed on your screen! Let's review how many stages this last leg went through: the browser parsed the URL to extract the protocol and domain, translated the domain into an IP address through layered DNS queries, established a reliable connection with the server via TCP three-way handshake, built an encrypted channel through TLS handshake, sent an HTTP request, the server processed business logic, queried the database, assembled response data and returned it, and finally the browser's rendering engine parsed the HTML into a DOM tree, computed CSS into style rules, merged both into a render tree, calculated layout, and painted pixels onto the screen one by one.
>
> Now let's zoom out and review the full picture of this relay race from start to finish. From the moment the power button is pressed: current wakes the hardware (1st leg) → firmware checks devices and finds the boot disk (2nd leg) → the OS boots completely from kernel to desktop (3rd leg) → the browser is launched as an application by the OS (4th leg) → network requests cross the internet to retrieve data and render it as a page (5th leg). Five legs connected end to end, each building on the previous one's results. Without any single leg, you couldn't see the webpage in front of you.
>
> Next, let's use a complete flowchart to connect these five stages and visualize their dependencies.

## 6. Complete Process Review

Let's connect the entire process:

<FullProcessDemo />

```
Complete process from pressing power to visiting a website:

┌──────────────────────────────────────────────────────────────────┐
│  1. Press Power                                                   │
│     └── Power startup → Motherboard wake-up → CPU reset → Execute BIOS/UEFI │
├──────────────────────────────────────────────────────────────────┤
│  2. BIOS/UEFI Boot                                                │
│     └── Hardware self-test → Find boot device → Read bootloader  │
├──────────────────────────────────────────────────────────────────┤
│  3. Operating System Boot                                         │
│     └── Bootloader → Load kernel → Start services → Display desktop │
├──────────────────────────────────────────────────────────────────┤
│  4. Open Browser                                                  │
│     └── Double-click icon → Create process → Load program → Display window │
├──────────────────────────────────────────────────────────────────┤
│  5. Access URL                                                    │
│     └── URL parsing → DNS resolution → TCP connection → HTTP request │
│         → Server processing → HTTP response → Browser rendering → Display page │
└──────────────────────────────────────────────────────────────────┘
```

---

> Looking at the entire chain, you'll notice an interesting pattern: each stage solves completely different problems, and the technical domains involved are entirely different. The 1st leg is in the domain of **electrical engineering** — power conversion, circuit design, signal transmission; the 2nd leg belongs to **firmware programming** — using low-level code to directly control hardware; the 3rd leg is the world of **operating systems** — process scheduling, memory management, file systems, which are core topics in computer science; the 4th leg involves **application development** — how to design a complex software architecture like a browser; and the 5th leg spans **computer networking** and **frontend development** — from network protocols like DNS, TCP/IP, and HTTP to HTML/CSS/JS parsing and rendering.
>
> This also explains why a "full-stack engineer" needs broad knowledge: every line of frontend code you write must travel through this entire chain before reaching the user. Understanding each link helps you quickly locate problems — is it a network layer issue? A server problem? Or a browser rendering issue?
>
> The knowledge map below organizes these technical domains and points the way for your further learning.

## 7. Knowledge Map

The knowledge domains covered in this chapter:

```
Computer System Overview
├── Hardware Basics
│   ├── Power Supply (PSU)
│   ├── Motherboard Chipset
│   └── CPU
├── BIOS/UEFI
│   ├── POST Self-Test
│   ├── Boot Order
│   └── Bootloader
├── Operating System
│   ├── Kernel
│   ├── System Services
│   └── Desktop Environment
├── Applications
│   ├── Process Management
│   └── Program Loading
└── Network Communication
    ├── DNS Resolution
    ├── TCP/IP Protocol
    ├── HTTP Protocol
    └── Browser Rendering
```

::: tip Continue Learning
If you want to dive deeper into any stage, you can continue learning:

- **From Transistors to CPU**: Understand computer hardware fundamentals
- **Operating Systems (Processes/Memory/File Systems)**: Deepen your understanding of operating systems
- **Computer Networks**: Deepen your understanding of network protocols
:::

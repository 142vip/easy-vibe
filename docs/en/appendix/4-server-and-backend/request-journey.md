# A Panorama of Request Flow

::: tip Introduction
**When you type a URL in your browser and press Enter, what exactly happens before the page appears?** This is a classic interview question, and more importantly, a key to understanding the entire Web architecture. Understanding this chain lets you see how frontend, backend, network, and databases work together.
:::

**What will you learn in this article?**

After reading this chapter, you will gain:

- **Full-chain perspective**: Understand the complete process of an HTTP request from sending to returning
- **Layer-by-layer responsibility awareness**: Know what DNS, TCP, load balancing, web servers, application servers, and databases each do
- **Problem diagnosis ability**: Know which layer to start investigating when requests are slow or fail
- **Performance optimization thinking**: Each layer has optimization potential; know where the optimization points are

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Browser initiates request | DNS resolution, TCP connection, HTTP request |
| **Chapter 2** | Network transmission | Routing, CDN, load balancing |
| **Chapter 3** | Server processing | Web server, application logic, database queries |
| **Chapter 4** | Response return | Serialization, compression, rendering |
| **Chapter 5** | Full-chain optimization | Caching, connection reuse, async processing |

---

## 0. The Big Picture: What Does a Request Go Through

Use an analogy to understand: you order a book online. This process is strikingly similar to an HTTP request.

| Request Stage | Book Ordering Analogy | Technical Equivalent |
|---------|---------|---------|
| Enter URL | You say "I want to go to that bookstore" | Browser parses URL |
| DNS resolution | Look at a map to find the bookstore's address | Domain → IP address |
| TCP connection | Walk to the bookstore door, push it open | Three-way handshake establishes connection |
| Send request | Tell the clerk "I want the book 'xxx'" | HTTP request message |
| Server processing | Clerk goes to warehouse to find the book, checks inventory, calculates price | Application logic + database query |
| Return response | Clerk hands you the book | HTTP response message |
| Browser rendering | You open the book and start reading | HTML/CSS/JS parsing and rendering |

<RequestJourneyFlow />

---

## 1. Browser Initiates the Request

### 1.1 URL Parsing

When you enter `https://api.example.com/books?id=123`, the browser breaks it into several parts:

| Part | Value | Meaning |
|-----|-----|------|
| Protocol | `https` | Encrypted communication |
| Domain | `api.example.com` | The server's "name" |
| Path | `/books` | The resource to access |
| Query parameters | `id=123` | Additional conditions |

### 1.2 DNS Resolution: Domain → IP Address

Computers don't understand domain names; they only understand IP addresses (like `93.184.216.34`). DNS is the internet's "phone book."

```
Browser cache → System cache → Router cache → ISP DNS → Root name server
     ↓ Hit = use directly; miss = check next level
```

::: tip The Significance of DNS Caching
If every request had to query from the root name server, the global internet would be overwhelmed by DNS queries. That's why every layer has caching; most requests can be resolved at the browser or system level.
:::

### 1.3 TCP Three-Way Handshake

After finding the IP address, the browser needs to "establish a connection" with the server. TCP uses a three-way handshake to ensure both sides are ready:

```
Client → Server: Hello, I'd like to connect (SYN)
Server → Client: OK, I'm ready (SYN + ACK)
Client → Server: Received, let's start communicating (ACK)
```

If using HTTPS, an additional TLS handshake is needed to negotiate encryption.

### 1.4 Sending the HTTP Request

After the connection is established, the browser sends the HTTP request message:

```http
GET /books?id=123 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
User-Agent: Chrome/120.0
```

| Component | Content |
|---------|------|
| Request line | Method (GET) + Path + Protocol version |
| Request headers | Metadata: authentication, expected data format, etc. |
| Request body | Only for POST/PUT requests; carries the data to submit |

---

## 2. Network Transmission: The Request on the Road

### 2.1 Routing and Forwarding

After leaving your computer, the request passes through multiple routers for forwarding, like a package going through multiple transit stations:

```
Your computer → Home router → ISP network → Backbone network → Target data center
```

Each router decides the "next hop" based on the IP address. You can use the `traceroute` command to see which nodes a request passes through.

### 2.2 CDN Acceleration

If the target website uses a CDN (Content Delivery Network), the request may not need to reach the origin server:

| Scenario | Routing |
|-----|------|
| Requesting static resources (images, CSS, JS) | CDN edge node returns directly |
| Requesting dynamic data (API) | Passes through CDN, reaches origin server |

The essence of CDN is "pre-placing content as close to users as possible."

### 2.3 Load Balancing

Large websites don't have just one server. A load balancer distributes requests across multiple servers:

```
User requests → Load balancer → Server A (30% traffic)
                              → Server B (30% traffic)
                              → Server C (40% traffic)
```

Common distribution strategies:

| Strategy | Principle | Use Case |
|-----|------|---------|
| Round robin | Distribute sequentially | Servers with identical specs |
| Weighted round robin | Distribute by weight | Servers with different specs |
| IP hash | Same user → same server | When session persistence is needed |
| Least connections | Assign to server with fewest connections | When request processing times vary greatly |

---

## 3. Server Processing: What Happens in the Kitchen

After the request arrives at the server, it goes through multiple layers of processing.

### 3.1 Web Server (Nginx / Apache)

The first to receive the request is typically the web server, responsible for:

| Responsibility | Description |
|-----|------|
| Static file serving | Directly returns HTML, CSS, JS, images |
| Reverse proxy | Forwards API requests to the backend application |
| SSL termination | Handles HTTPS encryption/decryption |
| Request filtering | Blocks malicious requests, rate limiting |

### 3.2 Application Server Processing

The web server forwards the request to the application server (Node.js, Spring, Django, etc.). The processing flow:

```
Request enters → Middleware chain → Route matching → Controller → Service layer → Data access layer
```

**What middleware does:**

1. Parse request body (JSON, form data)
2. Verify identity (check Token)
3. Check permissions (can this user access this endpoint?)
4. Log (who accessed what, when)

### 3.3 Database Query

Most requests ultimately need to interact with the database:

```
Application code: SELECT * FROM books WHERE id = 123
    ↓
Database engine: Parse SQL → Query optimization → Execution plan → Read data
    ↓
Return result: { id: 123, title: "xxx", price: 59.9 }
```

::: tip Databases Are the Most Common Performance Bottleneck
Network transmission is typically millisecond-level, application logic is fast too, but an unindexed database query can take several seconds or even tens of seconds. So "slow requests" are most likely caused by slow database queries.
:::

---

## 4. Response Return: The Data's Journey Back

### 4.1 Constructing the HTTP Response

After processing, the server constructs the response message:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
Cache-Control: max-age=3600

{"id": 123, "title": "xxx", "price": 59.9}
```

| Component | Content |
|---------|------|
| Status line | Protocol version + Status code (200 success, 404 not found, 500 server error) |
| Response headers | Data format, caching policy, compression method, etc. |
| Response body | The actual data content (JSON, HTML, etc.) |

### 4.2 Data Compression

The server typically compresses the response body with gzip or brotli to reduce transmission size:

| Compression Algorithm | Compression Ratio | Speed |
|---------|--------|------|
| gzip | ~70% | Fast |
| brotli | ~80% | Slower but better compression |

A 100KB JSON file might be only 20-30KB after compression.

### 4.3 Browser Rendering

After the browser receives the response:

1. **Parse HTML** → Build DOM tree
2. **Parse CSS** → Build style tree
3. **Merge** → Generate render tree
4. **Layout** → Calculate each element's position and size
5. **Paint** → Draw pixels onto the screen

<RequestTimeline />

---

## 5. Full-Chain Optimization: Every Layer Can Be Faster

### 5.1 Optimization Methods at Each Layer

| Layer | Optimization Method | Effect |
|-----|---------|---------|
| DNS | DNS prefetching, use fast DNS services | Reduce DNS query time |
| Network | CDN, HTTP/2, connection reuse | Reduce transmission latency |
| Server | Caching (Redis), async processing | Reduce processing time |
| Database | Indexes, query optimization, read-write splitting | Reduce query time |
| Frontend | Lazy loading, code splitting, asset compression | Reduce rendering time |

### 5.2 Caching: The Most Effective Optimization

Caching exists at every layer of the request chain:

```
Browser cache → CDN cache → Reverse proxy cache → Application cache (Redis) → Database cache
```

::: tip The Essence of Caching
Trading space for time. Store computed results so next time you can use them directly without recomputing. Every 10% improvement in cache hit rate can multiply system performance.
:::

### 5.3 Troubleshooting When Requests Fail

| Symptom | Possible Problem Layer | Investigation Method |
|-----|------------|---------|
| No response at all | DNS / Network | ping, nslookup |
| Connection timeout | Network / Server down | telnet, curl |
| Returns 4xx | Client request error | Check URL, parameters, Token |
| Returns 5xx | Server internal error | Check server logs |
| Slow response | Database / Application logic | Check slow query logs, APM tools |

---

## 6. Summary

The complete journey of an HTTP request:

1. **Browser**: Parse URL → DNS query → TCP connection → Send request
2. **Network**: Route forwarding → CDN check → Load balancing distribution
3. **Server**: Web server receives → Middleware processes → Business logic → Database query
4. **Return**: Construct response → Compress → Network transmission → Browser rendering

::: tip The Value of Understanding the Full Chain
When you can draw the complete request chain in your mind, you'll be able to quickly identify which layer has a problem no matter what issue you encounter. This is the key leap from "junior developer" to "someone who can independently troubleshoot problems."
:::

---

## Further Reading

- [HTTP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP) — MDN's HTTP documentation
- [High Performance Browser Networking](https://hpbn.co/) — Browser network performance optimization
- [What happens when...](https://github.com/alex/what-happens-when) — The classic "what happens after you type a URL" deep dive

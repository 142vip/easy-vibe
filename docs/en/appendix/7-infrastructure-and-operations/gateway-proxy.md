# Principles of Gateways and Reverse Proxies
::: tip 🎯 Core Question
**In high-concurrency internet architectures, how do you route traffic to the right service safely and efficiently?** Reverse proxies solve "how to distribute traffic," and API gateways solve "how to process requests." This article uses real-world analogies (reception desk, security system, intelligent routing) to explore the design philosophy and engineering practices of gateways.
:::

---

## 1. Motivation for the "Gateway"

### 1.1 A Real-World Case: The Architecture Evolution of an E-Commerce Platform

An e-commerce platform encountered serious architectural problems during rapid business growth:

**Scenario:**

```
Phase 1: Directly Exposing Services
Client → Directly calls User Service, Order Service, Payment Service...
         ↓
Problem 1: Service IPs are exposed — security risk
Problem 2: No unified authentication or rate limiting
Problem 3: Adding a new service requires modifying client configuration
```

::: warning ⚠️ Critical Issues with Direct Exposure

- **Security risk**: All service IPs are exposed and vulnerable to attacks
- **Redundant functionality**: Every service must implement authentication, rate limiting, and logging
- **Scaling difficulty**: Adding a new service requires changes to all clients
- **Protocol chaos**: Some services use HTTP, others gRPC — clients must adapt to all
  :::

**Improved Architecture (with Gateway):**

```
Client → API Gateway (Nginx/Kong) → Internal Services
         ↓
      Unified authentication, rate limiting, routing
         ↓
      Client only knows the gateway address
```

::: tip ✨ Benefits After Improvement

- **Security**: Real service IPs are hidden; only the gateway is exposed externally
- **Consolidation**: Authentication, rate limiting, and logging are handled centrally
- **Easy scaling**: Adding a new service only requires configuring a route on the gateway
- **Protocol unification**: HTTP externally, gRPC internally
  :::

### 1.2 A Real-Life Analogy for Gateways

**The Reception Desk**

Imagine visiting a large company:

- **No reception desk**: Visitors go straight to departments, don't know where to go, chaos ensues
- **With reception**: Visitors check in at reception first, explain their purpose, and are directed to the right department

**An API gateway is the "reception desk" of a system**:

- **Reverse proxy**: The receptionist, guiding visitors to the correct department
- **API gateway**: A smart receptionist that also verifies visitor identity (authentication) and limits visitor numbers (rate limiting)

<ReverseProxyDemo />

---

## 2. Overview of a Reverse Proxy

### 2.1 Forward Proxy vs. Reverse Proxy

::: tip 🤔 Terminology
**Forward Proxy**:

- Deployed on the client side
- Accesses external resources on behalf of the client
- Typical applications: VPNs, circumvention tools
- Example: In a corporate network, you access the internet through a proxy

**Reverse Proxy**:

- Deployed on the server side
- Receives client requests and forwards them to internal services
- Clients only know the proxy exists, not the real servers
- Examples: Nginx, HAProxy
  :::

**Comparison:**

| Dimension            | Forward Proxy                        | Reverse Proxy                        |
| -------------------- | ------------------------------------ | ------------------------------------ |
| **Deployment side**  | Client side                          | Server side                          |
| **Serves**           | Clients                              | Servers                              |
| **Typical use**      | VPN, circumvention                   | Load balancing, gateway              |
| **Transparency**     | Server sees the proxy IP             | Client sees the proxy IP             |
| **Purpose**          | Hide real client, accelerate access  | Hide real server, load balance       |

### 2.2 Core Value of a Reverse Proxy

::: details Value 1: Load Balancing
Distributes traffic across multiple backend servers to avoid single-point overload.

```
Client
  ↓
Nginx (Reverse Proxy)
  ↓
┌──────────┬──────────┬──────────┐
│ Server 1 │ Server 2 │ Server 3 │
└──────────┴──────────┴──────────┘
```

:::

::: details Value 2: Security Protection
Hides real server IPs to prevent direct attacks. Security is enforced at the proxy layer.

```
Client → Only sees Nginx's IP
Real servers → Only on the internal network, inaccessible externally
```

:::

::: details Value 3: SSL Termination
Handles HTTPS encryption/decryption at the proxy layer; backend services use HTTP, reducing backend computational overhead.

```
HTTPS Client → Nginx (encrypt/decrypt) → HTTP Backend Services
                   ↑
              SSL termination point
```

:::

---

## 3. Nginx: Method for handling Millions of Concurrent Connections

### 3.1 Master-Worker Process Model

Nginx uses a **multi-process** architecture, not multi-threaded:

**Master Process (Manager)**:

- Reads and validates configuration files
- Manages Worker processes (start, stop, reload)
- Does not handle actual requests

**Worker Processes (Workers)**:

- Actually handle HTTP requests
- Each Worker is an independent, isolated process
- The number is typically set to the number of CPU cores to avoid context-switching overhead

::: tip 💡 Advantages

- **Strong isolation**: One Worker crash does not affect other Workers
- **Full multi-core utilization**: Each Worker runs independently
- **Avoids multi-threading complexity**: No need to deal with locks, race conditions, etc.
  :::

### 3.2 Event-Driven + Async Non-Blocking

This is the core secret of Nginx's high performance:

**Traditional Apache (multi-process/thread model)**:

- One connection = one process/thread
- Concurrency is limited by the number of system processes/threads
- Under high connection counts, context-switching overhead is enormous

**Nginx (event-driven model)**:

- Uses efficient I/O multiplexing mechanisms like epoll (Linux) / kqueue (macOS)
- A single Worker process can handle tens of thousands of connections simultaneously
- When a connection has no data, it consumes no CPU; it is woken up by event notifications when new data arrives

::: tip Real-Life Analogy

- **Apache**: A restaurant where every diner gets a dedicated waiter (process); many diners require many waiters
- **Nginx**: One super-waiter serving all diners simultaneously, going to whoever needs service rather than standing next to a single diner
  :::

<NginxArchitectureDemo />

---

## 4. Overview of an API Gateway

### 4.1 Motivation for needing an API Gateway

**Imagine a system without a gateway:**

- The client must know addresses for multiple services (User Service, Order Service, Payment Service...)
- Each service must implement its own authentication, rate limiting, and logging
- Protocols are inconsistent — some use HTTP, others gRPC
- When services upgrade, clients must change too

::: warning ⚠️ Problems Without a Gateway

- **Client complexity**: Must configure multiple service addresses
- **Redundant functionality**: Every service must implement authentication and rate limiting
- **Protocol chaos**: Clients must adapt to multiple protocols
- **Upgrade difficulty**: Service upgrades force client-side changes
  :::

**With an API gateway:**

- The client only needs to know the gateway address; the gateway routes to the correct service
- Cross-cutting concerns like authentication, rate limiting, and logging are handled centrally
- The gateway can perform protocol translation; externally it uniformly exposes HTTP
- Backend service upgrades only require gateway config changes — clients are unaffected

<ApiGatewayDemo />

### 4.2 Core Features of an API Gateway

| Feature              | Description                                                       | Typical Scenario                                             |
| :------------------- | :---------------------------------------------------------------- | :----------------------------------------------------------- |
| **Route forwarding** | Forwards requests to different services based on URL, headers, etc. | `/api/users` → User Service, `/api/orders` → Order Service   |
| **Load balancing**   | Distributes traffic when a service has multiple instances         | User Service has 3 instances, round-robin request distribution |
| **Authentication**   | Centrally validates JWT, OAuth tokens                             | Unauthenticated users cannot access `/api/admin`             |
| **Rate limiting & circuit breaking** | Controls traffic caps to prevent service overload             | Max 1000 requests/second; beyond that returns 429            |
| **Protocol translation** | HTTP externally, can translate to gRPC internally              | Client uses HTTP, gateway translates to gRPC for internal calls |
| **Canary release**   | Routes a portion of traffic to a new version by header or ratio   | 5% of users experience the new version, 95% use the old      |
| **Logging & monitoring** | Centrally records request logs for analysis and troubleshooting | Record request latency, status codes, response sizes         |

---

## 5. Gateway in Practice: Approach to building a Complete Gateway Architecture

### 5.1 Full Architecture Diagram

```
┌───────────────────────────────────────────────────────────────────────┐
│                           Client (Browser/App)                         │
└───────────────────────────┬─────────────────────────────────────────┘
                                │ HTTPS
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                      Outer Layer: CDN + WAF                            │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  CDN (Content Delivery Network)                              │  │
│  │  - Static asset caching (images, CSS, JS)                    │  │
│  │  - Nearby access, reduced latency                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  WAF (Web Application Firewall)                               │  │
│  │  - Protection against SQL injection, XSS attacks              │  │
│  │  - Block malicious bots and crawlers                          │  │
│  │  - CC attack protection                                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                  Middle Layer: API Gateway (Nginx/Kong)                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Layer 1: SSL Termination + Security                          │  │
│  │  - HTTPS / TLS 1.3                                            │  │
│  │  - HSTS, security response headers                            │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Layer 2: Authentication & Authorization                      │  │
│  │  - JWT Token validation                                       │  │
│  │  - OAuth 2.0 / SSO integration                                │  │
│  │  - API Key management                                         │  │
│  │  - Permission checks (RBAC)                                   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Layer 3: Traffic Control                                     │  │
│  │  - Rate limiting — token bucket / leaky bucket algorithms     │  │
│  │  - Circuit breaking — prevent fault propagation               │  │
│  │  - Degradation — fallback when a service is unavailable       │  │
│  │  - Canary release — traffic splitting by ratio                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Layer 4: Routing & Load Balancing                            │  │
│  │  - Path-based Routing                                         │  │
│  │  - Host-based Routing                                         │  │
│  │  - Header-based Routing                                       │  │
│  │  - Load balancing algorithms — round-robin / weighted /       │  │
│  │    least connections / IP hash                                │  │
│  │  - Service Discovery integration                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Layer 5: Protocol Translation & Data Processing              │  │
│  │  - SSL Termination — HTTPS ↔ HTTP                             │  │
│  │  - Protocol translation — HTTP ↔ gRPC / WebSocket             │  │
│  │  - Request/Response transformation — JSON ↔ XML               │  │
│  │  - Data compression — Gzip / Brotli                           │  │
│  │  - Caching — static assets and API responses                  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────────────┐
│                    Inner Layer: Microservice Cluster                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐      │
│  │ User Svc    │ │ Order Svc   │ │ Product Svc │ │ Payment Svc │      │
│  │             │ │             │ │             │ │             │      │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘      │
│         │                │                │                │               │
│         └────────────────┴────────────────┴────────────────┘               │
│                                       │                              │
│                Service Discovery & Config Center (etcd)              │
│                - Service registration & discovery                    │
│                - Health checks                                       │
│                - KV config storage                                   │
└───────────────────────────────────────────────────────────────────────┘
```

### 5.2 Routing & Load Balancing

One of the gateway's core responsibilities is **getting requests to the right place**. This involves two key capabilities: **routing** (which server to go to) and **load balancing** (how to distribute traffic).

::: details Routing Rules: From URL to Service
Imagine an e-commerce system where different URLs map to different services:

- `/api/users/*` → User Service
- `/api/orders/*` → Order Service
- `/api/products/*` → Product Service
- `/api/pay/*` → Payment Service

**Nginx configuration example:**

```nginx
server {
    listen 80;
    server_name api.example.com;

    # User Service
    location /api/users/ {
        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Order Service
    location /api/orders/ {
        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Product Service
    location /api/products/ {
        proxy_pass http://product-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Payment Service (requires higher security)
    location /api/pay/ {
        # Restrict IP access
        allow 10.0.0.0/8;
        deny all;

        proxy_pass http://payment-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

:::

::: details Load Balancing: Comparing Four Strategies
When a service has multiple instances, how do you choose?

| Strategy              | Principle                                                       | Use Case                    | Pros                              | Cons                                      |
| :-------------------- | :-------------------------------------------------------------- | :-------------------------- | :-------------------------------- | :---------------------------------------- |
| **Round-robin**       | Assigns to each server in order                                 | Servers with similar specs  | Simple and fair                   | Doesn't consider current server load      |
| **Weighted round-robin** | Assigns by weight ratio; higher weight = more traffic         | Servers with uneven specs   | Fully utilizes high-perf servers  | Requires sensible weight configuration    |
| **Least connections** | Assigns to the server with the fewest active connections        | Long-lived connections, video streaming | Dynamically adapts to load changes | Requires real-time connection tracking |
| **IP hash**           | Hashes client IP; same IP always goes to the same server        | Session persistence needed  | Guarantees session consistency     | A heavy-traffic IP can create a hotspot   |

**Nginx configuration example:**

```nginx
# Weighted round-robin
upstream backend_weighted {
    server 10.0.1.10:8080 weight=3;  # High performance, handles more traffic
    server 10.0.1.11:8080 weight=2;
    server 10.0.1.12:8080 weight=1;  # Lower performance, handles less traffic
}

# Least connections
upstream backend_least_conn {
    least_conn;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}

# IP hash (session persistence)
upstream backend_ip_hash {
    ip_hash;
    server 10.0.1.10:8080;
    server 10.0.1.11:8080;
    server 10.0.1.12:8080;
}
```

:::

<LoadBalancingDemo />

---

## 6. Gateway Security: Approach to guarding the System's Front Door

### 6.1 Authentication & Authorization

**Traditional approach (each service authenticates independently):**

- User Service, Order Service, Payment Service... each must validate JWTs
- Code duplication, maintenance headache
- Secrets scattered across services — higher leak risk

**Gateway-unified authentication:**

- Client accesses the gateway with a token
- Gateway validates the token (signature, expiration)
- After validation, user info (e.g., user_id) is added to request headers and forwarded to backend services
- Backend services don't need to validate; they read user info directly from headers

::: tip 💡 Core Idea
**Authenticate at the gateway, authorize at the service**:

- **Authentication**: Who are you? (Validate token, obtain user identity)
- **Authorization**: What can you do? (Determine permissions based on user role)

Like a company reception desk: reception authenticates your identity (ID card), but specific permissions are determined by each department.
:::

<AuthMiddlewareDemo />

### 6.2 HTTPS & SSL Termination

**Why HTTPS?**

1. **Security**: Prevents data from being stolen in transit
2. **Compliance**: Modern browsers show "Not Secure" warnings for HTTP sites
3. **SEO**: Search engines prioritize HTTPS sites

**SSL termination approach:**

- Only configure HTTPS and certificates at the gateway layer
- The gateway handles TLS handshakes and encryption/decryption
- Communication between gateway and backend services uses plain HTTP (internal network is trusted)
- Backend services focus on business logic without handling TLS

::: tip 💡 Advantages of SSL Termination

- **Simplified management**: Certificates only configured on the gateway, not on backends
- **Reduced overhead**: Backend services don't need to handle TLS handshakes
- **Unified updates**: Certificate renewal only needs to happen on the gateway
  :::

<SslTerminationDemo />

---

## 7. Rate Limiting & Circuit Breaking: Approach to preventing the System from Being Overwhelmed by "Traffic Floods"

### 7.1 Rate Limiting Algorithm Comparison

| Algorithm        | Core Idea                                      | Burst traffic                        | Use Case                                  | Complexity |
| :--------------- | :--------------------------------------------- | :----------------------------------- | :---------------------------------------- | :--------- |
| **Token bucket** | Bucket holds tokens; a request needs a token to pass | Allows some bursting                | API rate limiting, bandwidth control      | Medium     |
| **Leaky bucket** | Requests enter the bucket and are processed at a steady rate | Enforces smoothing; bursts are queued or rejected | Scenarios requiring strict steady processing | Medium |
| **Sliding window** | Counts requests within a time window          | Strictly counts by window; excess is rejected | Precise counting (e.g., "max 100 per minute") | High    |

### 7.2 Nginx Rate Limiting Configuration in Practice

```nginx
# Define rate-limiting zones (place in the http block)

# 1. IP-based rate limiting (leaky bucket algorithm)
# zone=mylimit:10m — zone name and memory size (10 MB ≈ 160k IPs)
# rate=10r/s — 10 requests per second
limit_req_zone $binary_remote_addr zone=mylimit:10m rate=10r/s;

# 2. IP-based connection limit (prevents a single IP from opening too many connections)
limit_conn_zone $binary_remote_addr zone=addr:10m;

# 3. Endpoint-based rate limiting (not per-IP; protects the backend as a whole)
limit_req_zone $server_name zone=server_limit:10m rate=100r/s;

server {
    listen 80;
    server_name api.example.com;

    # User Service — normal rate limiting
    location /api/users/ {
        # Apply rate limiting
        # burst=20 — bucket capacity, allows 20 burst requests
        # nodelay — don't delay burst requests (process or reject immediately)
        limit_req zone=mylimit burst=20 nodelay;

        # Limit connections per IP
        limit_conn addr 10;

        proxy_pass http://user-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Order Service — stricter rate limiting
    location /api/orders/ {
        # Stricter: 5 requests per second
        limit_req_zone $binary_remote_addr zone=order_limit:10m rate=5r/s;
        limit_req zone=order_limit burst=10 nodelay;

        proxy_pass http://order-service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Handling after rate limiting
    # When a request is rate-limited, return 429 Too Many Requests
    error_page 429 /429.html;
    location = /429.html {
        internal;
        return 429 '{"error": "Too Many Requests", "message": "Rate limit exceeded. Please try again later."}';
        add_header Content-Type application/json;
    }
}
```

::: tip 💡 Rate Limiting Strategy Recommendations

- **Normal endpoints**: 10 requests/second, allow 20 burst
- **Critical endpoints** (payment, orders): 5 requests/second, allow 10 burst
- **Global protection**: Total across all requests no more than 100/second
  :::

<RateLimitingDemo />

### 7.3 Circuit Breaking: Preventing Fault Propagation

**How a circuit breaker works:**

1. **Closed state**: Requests are forwarded normally; error rate is tracked
2. **Open state**: When the error rate exceeds the threshold, the circuit breaker opens, immediately returning errors without forwarding requests
3. **Half-open state**: After a period, a small number of requests are allowed through as probes; if successful, the circuit breaker closes

::: tip 💡 Core Idea
**A circuit breaker is like an electrical fuse**: when current is too high, the fuse blows automatically, protecting the entire circuit from burning out.

Similarly, when a backend service has a high error rate, the circuit breaker "trips," failing fast to prevent the fault from spreading across the entire system.
:::

---

## 8. Summary: Core Thinking in Gateway Design

### 8.1 Review of Core Principles

| Principle         | Meaning                              | Key Practices                                           |
| ----------------- | ------------------------------------ | ------------------------------------------------------- |
| **Routing**       | Get requests to the right place      | Path-based, host-based, header-based routing            |
| **Load balancing**| Distribute traffic across servers    | Round-robin, weighted, least connections, IP hash       |
| **Security**      | Guard the system's front door        | Authentication & authorization, HTTPS, WAF              |
| **Rate limiting** | Prevent being overwhelmed by traffic | Token bucket, leaky bucket, sliding window              |
| **Circuit breaking** | Prevent fault propagation         | Fail fast, degradation strategies                       |
| **Observability** | Monitoring and troubleshooting       | Logging, metrics, distributed tracing                   |

### 8.2 Technology Selection Advice

::: tip 💡 Selection Decision Tree

```
Choosing a gateway:
│
├─ Only need reverse proxy & load balancing?
│  ├─ Yes → Nginx (first choice)
│  └─ No → Continue
│
├─ Need a rich plugin ecosystem?
│  ├─ Yes → Kong (built on Nginx)
│  └─ No → Continue
│
├─ Spring Cloud ecosystem?
│  ├─ Yes → Spring Cloud Gateway
│  └─ No → Nginx
```

:::

---

## 9. Glossary

| Term                    | Explanation                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Reverse Proxy**       | A proxy deployed on the server side that receives client requests and forwards them to internal services. Clients only know the reverse proxy, not the real server addresses. |
| **Forward Proxy**       | A proxy deployed on the client side that accesses external resources on behalf of the client. The server sees the proxy's IP, not the real client. Typical applications: VPNs, circumvention tools. |
| **API Gateway**         | An intermediary layer between clients and backend services that provides routing, authentication, rate limiting, logging, and more — the "unified front door" of a microservice architecture. |
| **Load Balancing**      | Distributing request traffic across multiple servers to avoid overloading a single server, improving system availability and performance.                           |
| **SSL Termination**     | Handling HTTPS encryption/decryption at the gateway layer; backend services use HTTP, reducing backend computational overhead and simplifying certificate management. |
| **Rate Limiting**       | Limiting the number of requests per unit of time to prevent the system from being overwhelmed by traffic bursts. Common algorithms: token bucket, leaky bucket, sliding window. |
| **Circuit Breaking**    | Automatically cutting off calls to a failing dependency to prevent fault propagation, while providing a fallback strategy.                                          |
| **Session Persistence** | Ensuring requests from the same client are always routed to the same backend server, used in scenarios requiring session state.                                     |
| **Health Check**        | Periodically checking the health of backend services, automatically removing faulty nodes to ensure traffic is only sent to healthy instances.                      |
| **Canary Release**      | Routing a small portion of traffic to a new version, verifying stability, then gradually increasing the ratio to reduce release risk.                               |
| **WAF**                 | Web Application Firewall — protects against SQL injection, XSS, CC attacks, and other web security threats.                                                        |
| **CDN**                 | Content Delivery Network — deploys edge nodes globally to accelerate access to static assets.                                                                       |
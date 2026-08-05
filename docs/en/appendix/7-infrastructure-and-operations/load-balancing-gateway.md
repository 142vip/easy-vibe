# Principles of Load Balancing and Gateways
::: tip 🎯 Core Question
**When a single server can't handle the load, how do you "smartly" distribute traffic across multiple server instances?** Load balancing is the "dispatcher" of modern distributed systems. This article uses real-world analogies (bubble tea shop checkout, package sorting, traffic control) to deeply explore the design philosophy and engineering practices of load balancing.
:::

---

## 1. Motivation for the "Load Balancing"

### 1.1 A Real-World Case: The Architecture Evolution of a Website

A startup encountered severe performance issues as its user base grew rapidly:

**Scenario:**

```
Phase 1: Single Server
Users → Server (1 vCPU, 2 GB RAM)
       ↓
  1,000 DAU → Peak: 1,000 concurrent users
       ↓
  Problem: CPU at 100%, slow responses, frequent crashes
```

::: warning ⚠️ The Fatal Flaws of a Single Server

- **Performance bottleneck**: CPU at 100%, response time > 5 seconds
- **Single point of failure**: If the server goes down, the entire site is unavailable
- **Scaling difficulty**: Only vertical scaling is possible (adding CPU, RAM), which is expensive and limited
  :::

**Improved Architecture (with Load Balancing):**

```
Phase 2: Multiple Servers + Load Balancer
Users → Load Balancer (Nginx)
       ↓
     ├→ Server 1 (1 vCPU, 2 GB RAM)
     ├→ Server 2 (1 vCPU, 2 GB RAM)
     └→ Server 3 (1 vCPU, 2 GB RAM)
```

::: tip ✨ Improvements

- **Better performance**: 3 servers processing in parallel, response time < 1 second
- **High availability**: If one server fails, others continue serving
- **Horizontal scaling**: Need more capacity? Just add more servers
  :::

### 1.2 Load Balancing in Everyday Terms

**The Bubble Tea Shop Counter**

Imagine you run a popular bubble tea shop:

- **1 counter**: Customers queue up, those at the back get impatient, negative reviews follow
- **3 counters**: Staff direct customers to different counters, efficiency triples

**The load balancer is the "counter assignment person"**:

- **Users** (customers) → make requests
- **Load balancer** (assignment person) → distributes requests to different servers
- **Servers** (counters) → handle requests

<LoadBalancerTypesDemo />

---

## 2. Overview of Load Balancing

### 2.1 Layer 4 Load Balancing (L4): Only Looking at the Address

**Operates at the transport layer (TCP/UDP)** — like a delivery driver who only looks at your **address (IP + port)** without caring about who you are or what you do.

**Characteristics:**

- **Extremely fast**: Simple address forwarding without parsing packet content
- **Use cases**: Database connections, Redis caching, long-connection game servers
- **Representative products**: LVS (Linux Virtual Server), AWS NLB, Azure Load Balancer

::: details How It Works

```
Client request → L4 Load Balancer → Backend server
                    ↓
           Only looks at IP + Port
                    ↓
           Fast forwarding (no content inspection)
```

:::

### 2.2 Layer 7 Load Balancing (L7): Inspecting the Build Artifact Contents

**Operates at the application layer (HTTP/HTTPS)** — like a delivery driver who not only checks the address but also **opens the package to inspect its contents** before deciding how to deliver.

**Characteristics:**

- **Intelligent routing**: Can perform fine-grained routing based on URL paths, HTTP headers, Cookies, etc.
- **Advanced features**: SSL termination, content caching, compression, WAF security
- **Use cases**: Web applications, API gateways, microservice architectures
- **Representative products**: Nginx, HAProxy, AWS ALB, Envoy

::: details How It Works

```
Client request → L7 Load Balancer → Parses HTTP content
                    ↓
          Inspects URL, Header, Cookie
                    ↓
          Intelligent routing to specific server
```

:::

### 2.3 L4 vs L7 Comparison

| Dimension              | L4 Load Balancing              | L7 Load Balancing                        |
| :--------------------- | :----------------------------- | :--------------------------------------- |
| **OSI Layer**          | Transport Layer (TCP/UDP)      | Application Layer (HTTP/HTTPS)           |
| **Routing Basis**      | IP address + port              | URL, Header, Cookie, Body                |
| **Processing Speed**   | Extremely fast (kernel-space)  | Fast (user-space parsing)                |
| **Feature Richness**   | Basic forwarding               | SSL termination, caching, compression, WAF |
| **Typical Scenarios**  | Databases, gaming, long connections | Web apps, API gateways, microservices |
| **Representative Products** | LVS, AWS NLB              | Nginx, HAProxy, AWS ALB                  |

---

## 3. Core Problem 1: Approach to preventing "Broken" Servers from Continuing to Serve

### 3.1 Health Checks: Don't Let Unhealthy Instances Drag Down the System

Imagine one of your checkout counters breaks, but the assignment person doesn't know and keeps sending customers there. The queue grows longer, and customers grow angrier.

**Health checks are the "sentinels" that prevent this scenario**. They periodically "examine" each server, immediately removing any "sick" ones from the pool and bringing them back once they "recover."

<!-- <HealthCheckDemo /> -->

### 3.2 Active Health Checks vs Passive Health Checks

**Active Health Check**: The load balancer actively "knocks on the door" asking the server, "Are you still there?"

- Periodically sends probe requests (e.g., HTTP /health, TCP ping)
- Considers the server unhealthy if the response times out or returns an error code
- **Advantage**: Accurate and reliable detection
- **Disadvantage**: Generates additional probe traffic

**Passive Health Check**: The load balancer "observes" the response patterns of real business traffic

- Tracks response times and error rates of actual requests
- Considers the server unhealthy after multiple consecutive failures
- **Advantage**: No additional traffic generated
- **Disadvantage**: Requires sufficient traffic samples to make a determination

::: details Threshold Settings
| Metric | Healthy Threshold | Unhealthy Threshold | Notes |
|:---|:---|:---|:---|
| **HTTP Status Code** | 200-399 | 400+ or timeout | 4xx/5xx are all considered failures |
| **TCP Connection** | Successfully established | Connection timeout | Checks whether the port is reachable |
| **Response Time** | < 500 ms | > 2000 ms | Timeout typically set to 2-5 seconds |
| **Consecutive Failures** | - | 3 times | Avoids false positives from transient blips |
| **Check Interval** | - | 5 s | Too frequent increases load |

::: tip 💡 Common Pitfall: Thresholds Set Too "Sensitive"
A team set the health check response time threshold to 100ms, but their application's average response time fluctuated between 80-120ms. As a result, servers were frequently marked as "unhealthy," causing traffic to oscillate between healthy and unhealthy states, and overall system availability actually dropped.

**The right approach**: Thresholds should be set to **2-3x the P99 response time**, leaving enough buffer for normal fluctuations.
:::

---

## 4. Core Problem 2: Approach to Ensuring Returning Users Always Get "Backend Instance"

### 4.1 Session Persistence: Let "Returning User" Always Find "Backend Instance"

Imagine you're a regular at a bubble tea shop, and the same staff member serves you every time. She knows your preferences (half sugar, no ice) and serves you quickly and thoughtfully. But if you get a new person every time, you have to repeat the same requests over and over — a huge efficiency loss.

**Session persistence (sticky sessions)** solves this problem: ensuring that requests from the same user are always routed to the same backend server.

<SessionPersistenceDemo />

### 4.2 Comparison of Three Session Persistence Mechanisms

| Mechanism        | How It Works                                         | Advantages                               | Disadvantages                                | Use Cases                      |
| :--------------- | :--------------------------------------------------- | :--------------------------------------- | :------------------------------------------- | :----------------------------- |
| **Cookie Insert** | LB inserts a cookie in the response; subsequent requests carry this cookie | Unaffected by IP changes; persists from the first request | Client must support cookies; may be disabled | Shopping carts, login sessions |
| **IP Hash**      | Hashes the client IP and maps it to a specific server | No client-side support needed; stateless | Session lost if IP changes; hard to distribute evenly | Cookie-free environments, WebSocket |
| **Sticky Session Table** | LB maintains a mapping table of sessions to servers | Supports session replication and failover | Consumes LB memory; requires additional synchronization | Scenarios with strict high-availability requirements |

::: tip 💡 Usage Recommendations

- **Cookie Insert**: Preferred recommendation; best compatibility
- **IP Hash**: Only for special scenarios like WebSocket
- **Sticky Session Table**: Combined with cookies to provide failover capability
  :::

---

## 5. Core Problem 3: Approach to achieving Zero-Downtime Deployment

### 5.1 Blue-Green Deployment: "One-Click Switch" for Zero-Downtime Releases

**Core idea**: Maintain two identical production environments (blue and green) simultaneously, but only one serves live traffic at any given time.

<BlueGreenDeploymentDemo />

**Workflow:**

1. **Initial state**: Blue environment runs v1.0 (production), green environment stands by.
2. **Deploy new version**: Deploy v1.1 to the green environment and run internal smoke tests.
3. **Switch traffic**: Point the load balancer to the green environment; traffic instantly switches to v1.1.
4. **Monitor**: Observe the green environment's behavior and confirm no anomalies.
5. **Keep old version**: Keep the blue environment on v1.0 for a period (e.g., 24 hours) as a safety net for rapid rollback.

::: tip ✨ Pros and Cons
| Pros | Cons |
|:---|:---|
| ✅ Zero downtime; switch completes in milliseconds | ❌ High resource cost; requires maintaining two environments |
| ✅ Fast rollback; switch back immediately if issues are found | ❌ Database schema changes require special compatibility handling |
| ✅ New environment can be fully tested before taking over traffic | ❌ Not suitable for stateful services (e.g., WebSocket long connections) |

:::

### 5.2 Canary Release: "Small Steps, Fast Iteration" Canary Strategy

The canary release is named after the historical "coal mine canary" — miners brought canaries into the mines; if the canary showed signs of distress, it indicated toxic gas leakage, and miners would evacuate immediately. In software releases, a canary release means exposing a small subset of users to the new version first, observing for issues, and then gradually expanding the rollout.

<CanaryReleaseDemo />

**Core idea:**

1. **Small traffic first**: Route 1% of traffic to the new version servers initially.
2. **Observe metrics**: Continuously monitor error rates, latency, and key business metrics.
3. **Gradual rollout**: If everything is normal, gradually increase the proportion to 5%, 10%, 25%, 50%, and 100%.
4. **Rapid rollback**: If any anomaly is detected, immediately switch all traffic back to the old version.

::: tip 💡 Advantages of Canary Releases
| Advantage | Description |
|:---|:---|
| 🎯 **Controlled risk** | Even if the new version has severe bugs, only a small number of users are affected |
| 📊 **Real-world validation** | Validated in the real production environment, more reliable than staging |
| 🚀 **Fast iteration** | Teams can release new features more confidently and frequently |
| 💰 **Resource-friendly** | Doesn't require two complete environments like blue-green deployment |

:::

---

## 6. Core Problem 4: Approach to making the System "Auto-Scale" on Its Own

### 6.1 Auto Scaling: Let the System Flexibly Schedule Workloads

Imagine you run a restaurant:

- **Lunch peak**: You need 10 servers, but at 3 PM during the afternoon lull, you only need 2
- If you always keep 10: labor costs explode
- If you always keep only 2: customers during peak hours can't wait and all leave

**Auto Scaling** lets the system "flexibly schedule" like a restaurant — automatically adding servers when busy and removing them when idle.

<AutoScalingDemo />

### 6.2 Choosing Scaling Metrics

The core question of auto scaling is: **When should you add machines? When should you remove them?**

Common decision metrics:

| Metric                  | Scale-Up Threshold | Scale-Down Threshold | Use Case                        |
| :---------------------- | :----------------- | :------------------- | :------------------------------ |
| **CPU Utilization**     | > 70%              | < 30%                | Compute-intensive applications  |
| **Memory Utilization**  | > 75%              | < 40%                | Memory-intensive applications   |
| **QPS (Queries/sec)**   | > 1000/s           | < 400/s              | API gateways, web services      |
| **Connection Count**    | > 5000             | < 1000               | Databases, message queues       |
| **Custom Business Metrics** | Depends on business | Depends on business | Specific business scenarios     |

::: tip 💡 Scaling Strategy Pitfalls and Solutions

**Pitfall 1: Scaling responds too slowly; the traffic surge already crashes the system**

During a major e-commerce promotion, the team set CPU > 80% as the scale-up trigger, but metric collection had a 1-minute delay, and new instance startup took 3 minutes. Traffic arrived too fast — before scaling completed, the servers were already overwhelmed.

**Solutions:**

- **Scale up proactively**: Predict traffic peaks based on historical data and start scaling 30 minutes in advance
- **Multi-level thresholds**: Set 60% as a warning (start warming new instances), 70% for formal scaling, 80% for emergency scaling
- **Fast scaling**: Use containerized deployment so new instances start within 30 seconds (vs. 3-5 minutes for VMs)

**Pitfall 2: Scaling is too aggressive; costs explode**

A startup set an aggressive auto-scaling policy: scale up if CPU > 50%. As a result, a normal business fluctuation triggered scaling, and the server count ballooned from 5 to 30. The end-of-month cloud bill terrified the CTO.

**Solutions:**

- **Set a scale-up cooldown period**: After one scale-up, wait at least 5 minutes before scaling again
- **Set a maximum instance count**: max = current instance count × 2, to prevent unlimited growth
- **Distinguish spikes from trends**: Only scale up if the threshold is exceeded for 3 consecutive periods, to avoid triggering on single-point spikes

**Pitfall 3: Scaling down too fast; newly added machines are removed immediately**

A team set CPU < 30% as the scale-down trigger. After scaling up, traffic was still settling, and CPU briefly dropped to 25%, triggering a scale-down. Right after scaling down, CPU spiked back to 80%, triggering another scale-up — the system oscillated wildly in a "scale-up, scale-down, scale-up" loop.

**Solutions:**

- **More conservative scale-down**: Scale-up threshold at 70%, scale-down threshold at 25%, leaving enough buffer in between
- **Longer scale-down cooldown**: Wait at least 10 minutes after scaling up before scaling down
- **Gradual scale-down**: Remove only 1 instance at a time, observe, then decide whether to continue
  :::

---

## 7. Practical Guide: Approach to choosing a Load Balancer

### 7.1 Comparison of Mainstream Load Balancers

| Feature               | Nginx                                | HAProxy                    | Envoy               | Cloud Provider LB  |
| --------------------- | ------------------------------------ | -------------------------- | ------------------- | ------------------ |
| **Positioning**       | High-performance reverse proxy / LB  | Open-source load balancer  | Cloud-native proxy  | Managed load balancer |
| **Performance**       | Extremely high (C, event-driven)     | High (event-driven)        | High (C++/Rust)     | Extremely high     |
| **Feature Richness**  | Basic LB, static files, caching      | Rich LB algorithms         | Advanced routing, observability | Full-featured |
| **Configuration**     | Config file (nginx.conf)             | Config file (haproxy.cfg)  | API / config file   | UI console         |
| **Extensibility**     | C modules / Lua scripts              | Lua scripts                | WASM / Filters      | Plugins            |
| **Use Cases**         | Static assets, L7 LB, SSL termination | L7 LB, high availability  | Service mesh, multi-cloud | Quick start     |

::: tip 💡 Selection Guide
**Decision Tree:**

```
Choose a load balancer:
│
├─ Only need basic L4 load balancing?
│  ├─ Yes → LVS (open-source, free) or cloud provider NLB
│  └─ No → Continue
│
├─ Need service mesh or multi-cloud deployment?
│  ├─ Yes → Envoy
│  └─ No → Continue
│
├─ Need extremely complex configuration and plugins?
│  ├─ Yes → HAProxy
│  └─ No → Continue
│
├─ Need high performance + simple configuration?
│  ├─ Yes → Nginx (first choice)
│  └─ Continue
│
├─ Want managed operations?
│  ├─ Yes → Cloud provider LB (AWS ALB, Alibaba Cloud SLB)
│  └─ Self-host Nginx
```

:::

---

## 8. Summary: Core Mindset of Load Balancing

### 8.1 Core Principles Recap

| Principle       | Meaning                                        | Key Practice Points                                          |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| **Layering**    | L4 handles "package sorting" (fast but simple) | L4 for databases, gaming; L7 for web, APIs                   |
| **Redundancy**  | Single points of failure are the enemy         | Improve availability through multi-instance, multi-region deployment |
| **Gradualism**  | Don't release new versions with "one big cut"  | Blue-green deployment for zero downtime; canary for controlled risk |
| **Elasticity**  | The system should "breathe" like a living organism | Automatically scale up when busy, scale down when idle     |

### 8.2 Design Checklist

Before introducing load balancing, ask yourself the following questions:

- [ ] Is load balancing really needed? (Is single-machine performance truly insufficient?)
- [ ] Choose L4 or L7? (Based on business scenario)
- [ ] How to handle session persistence? (Cookie, IP hash, session table)
- [ ] How to implement health checks? (Active, passive, threshold settings)
- [ ] How to achieve zero downtime? (Blue-green deployment, canary)
- [ ] How to implement elasticity? (Scaling metrics, cooldown periods, max instance count)

---

## 9. Glossary

| Term                          | Chinese Translation | Explanation                                                                           |
| ----------------------------- | ------------------- | ------------------------------------------------------------------------------------- |
| **Load Balancer**             | 负载均衡器          | A device or software that distributes traffic across multiple backend servers          |
| **L4 Load Balancing**         | 四层负载均衡        | Load balancing based on the transport layer (TCP/UDP)                                 |
| **L7 Load Balancing**         | 七层负载均衡        | Load balancing based on the application layer (HTTP/HTTPS)                            |
| **Health Check**              | 健康检查            | A mechanism that periodically checks the health status of backend servers             |
| **Session Persistence**       | 会话保持            | Ensures requests from the same user are always routed to the same server              |
| **Sticky Session**            | 粘性会话            | Another term for Session Persistence                                                  |
| **Blue-Green Deployment**     | 蓝绿部署            | A zero-downtime release strategy using two environments that switch over              |
| **Canary Release**            | 金丝雀发布          | A canary release strategy that validates with a small traffic portion first           |
| **Auto Scaling**              | 自动扩缩容          | Automatically increasing or decreasing the number of servers based on load            |
| **Horizontal Scaling**        | 水平扩展            | Increasing server count to improve processing capacity                                |
| **Vertical Scaling**          | 垂直扩展            | Upgrading individual machine specs (CPU, RAM) to improve processing capacity          |
| **Multi-Region**              | 多区域              | Deploying services across multiple geographic regions                                 |
| **Active-Active**             | 多活                | Multiple regions simultaneously serving traffic                                       |
| **Active-Standby**            | 主备                | Only one region serves traffic; others are on standby                                 |
| **Data Replication**          | 数据同步            | Cross-region data replication mechanism                                               |
| **RTO**                       | 恢复时间目标        | Recovery Time Objective — the target time within which a system must recover after failure |
| **RPO**                       | 恢复点目标          | Recovery Point Objective — the acceptable amount of data loss after a system failure  |

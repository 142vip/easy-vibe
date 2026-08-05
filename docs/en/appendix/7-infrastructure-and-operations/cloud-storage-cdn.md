# Principles of Object Storage and CDN
> 💡 **Learning Guide**: This article will walk you through a complete chain—from file upload to user download. You'll see how object storage manages massive files like a "smart warehouse," how CDN delivers content to users' doorsteps like a "courier network," and what pitfalls await you along the way. It's recommended to first understand basic HTTP requests and DNS resolution principles.

Before we begin, here are some foundational topics to brush up on:

- **HTTP Request Flow**: You can read [What Happens When You Enter a URL in the Browser](./web-basics/url-to-browser.md) to understand the complete request chain.
- **DNS Resolution Principles**: If you're not yet familiar with domain name resolution, check out the illustrated section of [DNS Query Flow](./deployment/dns-flow.md).

---

## 0. Introduction: Motivation for Filing Uploads and Downloads So "Slow"

Imagine this scenario: you upload a 10MB high-resolution photo to an image-sharing community, and it takes half a minute to finish. Yet your friend in Beijing downloads it in just 2 seconds. Why does the same file produce such drastically different upload and download experiences?

Or consider this: your e-commerce site runs a Double 11 promotion, and the product detail page suddenly gets flooded with millions of visits—your server goes down completely. Is it insufficient bandwidth? Or a flawed architecture design?

The answers to these questions are hidden in the "golden duo" of **object storage** and **CDN**.

---

## 1. Object Storage: Your "Smart Cloud Warehouse"

### 1.1 Overview of Object Storage

A traditional file system is like your wardrobe at home: clothes are organized by "tops/pants/skirts" in layers. To find a shirt, you have to open the wardrobe → tops section → shirt compartment. This "hierarchical nesting" model becomes extremely cumbersome when the number of files explodes.

Object storage, on the other hand, is like modern warehousing logistics: every package has a unique "tracking number" (object key). You just provide the tracking number, and the warehouse robot can precisely retrieve it from a sea of packages.

<ObjectStorageDemo />

**Key Differences at a Glance**:

| Dimension          | Traditional File System      | Object Storage                 |
| :----------------- | :--------------------------- | :----------------------------- |
| **Organization**   | Hierarchical directory tree  | Flat key-value pairs           |
| **Access Protocol**| POSIX (local file operations)| HTTP/REST API                  |
| **Scalability**    | Limited by single machine    | Near-infinite horizontal scaling|
| **Metadata**       | Basic attributes (size, time)| Rich custom metadata           |
| **Typical Use Case**| Local office documents      | Images/videos/backups/static assets |

### 1.2 Core Concepts of Object Storage

#### Bucket: Your "Warehouse Partition"

A bucket is the top-level container in object storage, equivalent to an independent namespace. All objects must be stored in a bucket.

**Naming Rules** (using Alibaba Cloud OSS as an example):

- Globally unique: cannot duplicate across all users of the cloud provider
- Can only contain lowercase letters, numbers, and hyphens
- Must start and end with a lowercase letter or number
- Length between 3-63 characters

**Real-World Pitfall**: A team once created dozens of buckets based on business lines, and were shocked when the monthly bill arrived—each bucket incurs minimum storage fees and request fees. Recommendation: plan buckets by combining "environment + purpose," such as `prod-static-assets`, `dev-backup-archive`.

#### Object: Your "Data Package"

An object is the basic unit of storage, consisting of three parts:

1. **Key**: The unique identifier of the object, equivalent to a "tracking number"
   - Example: `images/avatar/2024/user123.jpg`
   - Although it looks like a path, it's essentially just a string

2. **Data**: The object's content itself
   - Can be any binary data
   - Size limits depend on the cloud provider (typically up to 5TB per object)

3. **Metadata**: Additional information describing the object
   - System metadata: Content-Type, ETag, Last-Modified, etc.
   - Custom metadata: e.g., `x-oss-meta-owner`, `x-oss-meta-project`

#### Access Control: Who Can Touch My "Warehouse"?

Object storage provides multiple layers of permission control:

| Layer           | Control Method              | Typical Use Case                          |
| :-------------- | :-------------------------- | :---------------------------------------- |
| **Bucket-level**| Bucket Policy               | Block all external access, allow only specific IPs |
| **Object-level**| ACL (Access Control List)   | Public images, private documents          |
| **Temporary Auth**| STS (Security Token Service)| Frontend direct upload, mobile uploads    |

**Security Red Line**: Never write AccessKey ID and AccessKey Secret in frontend code! The correct approach is: the frontend requests temporary STS credentials from your backend, and the backend returns temporary credentials with an expiration time after verifying the user's identity.

---

## 2. CDN: Your "Global Courier Network"

### 2.1 Motivation for needing a CDN

Imagine you run an online store with servers in Shenzhen. Now a user in Beijing wants to access your images:

- **Without CDN**: The request travels from Beijing → Hebei → Henan → Hubei → Hunan → Guangdong → Shenzhen, spanning over 2,000 kilometers—a round trip of over 4,000 kilometers. Network transmission alone takes tens of milliseconds, and it's even worse during network congestion.

- **With CDN**: The request goes directly from Beijing to a Beijing CDN node (possibly in a Beijing Unicom data center). The distance shrinks from 2,000 km to 20 km, and latency drops from 50ms to 5ms.

This is the core value of CDN: **bringing content closer to the user**.

<CdnAccelerationDemo />

### 2.2 CDN Core Architecture

#### Edge Nodes: The "Courier Stations" Closest to Users

Edge nodes are the tier closest to users in the CDN network, typically deployed at:

- ISP data centers (China Unicom/China Telecom/China Mobile)
- Major city internet exchange points
- Key transportation hubs

**CDN Node Distribution in China**:

- Tier-1 cities: Beijing, Shanghai, Guangzhou, Shenzhen
- Tier-2 cities: Hangzhou, Nanjing, Chengdu, Wuhan, Xi'an
- Overseas: Hong Kong, Singapore, Tokyo, Silicon Valley, Frankfurt

<EdgeNodeDistributionDemo />

#### Origin Server: The "Main Warehouse" of Content

The origin is where the CDN fetches content from when cache misses occur. It can be:

- Object storage (OSS/COS/S3)
- Self-managed servers (ECS/physical machines)
- Load balancers (SLB/CLB)

**Key Configuration**:

- **Origin HOST**: The domain/IP used by CDN nodes when accessing the origin
- **Origin Protocol**: HTTP or HTTPS
- **Origin Port**: 80, 443, or a custom port

#### Mid-Tier Nodes: "Regional Distribution Centers"

Between edge nodes and the origin, CDNs typically have one or more layers of mid-tier nodes:

- **Aggregation nodes**: Consolidate origin requests from multiple edge nodes to reduce origin pressure
- **Regional centers**: Responsible for content distribution and scheduling within a large region

Benefits of this layered architecture:

1. **Reduces origin pressure**: 1,000 edge node requests may only require 10 requests to the origin
2. **Improves hit ratio**: Popular content is intercepted at the mid-tier, no need to go back to the origin
3. **Fault isolation**: If one link fails, traffic can automatically switch to another path

### 2.3 Complete CDN Acceleration Flow

Let's trace a real user request:

<CachePolicyDemo />

**Step 1: DNS Resolution** (Intelligent Scheduling)

```
User enters: cdn.example.com/image.jpg
↓
DNS server returns: Beijing Unicom CDN node IP (1.2.3.4)
```

The key here is **intelligent DNS**: based on the user's ISP, geographic location, and node load, it returns the optimal CDN node IP.

**Step 2: Edge Node Lookup** (Cache Hit?)

```
Request arrives at Beijing Unicom CDN node (1.2.3.4)
↓
Node checks local cache:
├─ Hit? Return content directly ✓
└─ Miss? Continue to next step
```

**Step 3: Origin Fetch** (Layer by Layer Upward)

```
Edge node miss
↓
Request to parent node (e.g., North China regional center)
├─ Parent node hit? Return content
└─ Parent node miss? Continue upward
    ↓
    Request to origin
    ↓
    Origin returns content
```

**Step 4: Cache and Return** (Faster Next Time)

```
Content returns along the chain
↓
Each layer caches a copy
↓
Finally reaches the user
```

This way, the next time a user requests the same file, it can be served directly from the edge node, achieving "instant loading."

---

## 3. From Upload to Access: Complete Chain Analysis

### 3.1 Three Ways to Upload Files

<UploadProcessDemo />

#### Method 1: Client → Server → Object Storage (Traditional Model)

```
Browser → Your Backend Server → Object Storage
```

**Flow**:

1. User selects a file and clicks upload
2. The file is first uploaded to your backend server
3. After receiving the complete file, the backend forwards it to object storage
4. The upload result is returned to the user

**Pros**:

- Simple to implement, easy to control on both frontend and backend
- Can perform file validation and format conversion on the backend
- Sensitive operations can be logged with permission checks

**Cons**:

- **Double bandwidth consumption**: User upload consumes bandwidth once, server forwarding consumes it again
- **High server pressure**: Large files consume significant memory and CPU
- **Slow uploads**: Essentially adds a relay step, extending the user-perceived upload time

**Use Cases**: Small files (<10MB), scenarios requiring backend processing (e.g., image compression, watermarking), internal management systems.

#### Method 2: Client Direct Upload to Object Storage (Modern Recommendation)

```
Browser ──────→ Object Storage
        ↑
        Backend only issues temporary credentials
```

**Flow**:

1. User selects a file; the frontend first requests an "upload credential" from the backend
2. The backend verifies the user's identity and requests **temporary STS credentials** (with expiration) from the object storage service
3. The backend returns the temporary credentials to the frontend
4. The frontend uses the credentials to **directly upload the file to object storage**
5. Object storage returns the upload result; the frontend notifies the backend that "upload is complete"

**Pros**:

- **Fast uploads**: No relay step, fastest user-perceived speed
- **Low server pressure**: Only handles credential issuance, not file streams
- **Bandwidth savings**: Only one upload transfer
- **High security**: Temporary credentials have expiration times; limited damage even if leaked

**Cons**:

- Slightly more complex implementation; requires understanding of STS and signing mechanisms
- Frontend needs to handle multipart uploads, resumable uploads, and other logic
- Cross-origin (CORS) configuration required

**Use Cases**: Large file uploads, user-generated content (UGC), businesses requiring high-concurrency uploads.

#### Method 3: Multipart Upload + Resumable Upload (Essential for Large Files)

```
10GB video file
↓
Split into 1,000 chunks of 10MB each
↓
Parallel upload (5 chunks at a time)
↓
Network drops! 600 chunks already uploaded
↓
Network recovers, resume from chunk 601
↓
All chunks uploaded, initiate "merge" request
```

**Why multipart?**

| Scenario            | Without Multipart                    | With Multipart                       |
| :------------------ | :----------------------------------- | :----------------------------------- |
| **Network Fluctuation**| 99% uploaded, disconnect → restart all| Only re-upload failed chunks        |
| **Upload Speed**    | Single-threaded, slow                | Multi-threaded parallel, fast        |
| **Memory Usage**    | Must buffer entire file              | Only buffer current chunk            |
| **Progress Display**| Only 0% and 100%                     | Precise progress per chunk           |

**Multipart Specifications by Major Cloud Providers**:

| Provider           | Chunk Size Limit | Max Chunks | Min Chunk Size |
| :----------------- | :--------------- | :--------- | :------------- |
| **Alibaba Cloud OSS**| 100MB           | 10,000     | 100KB          |
| **Tencent Cloud COS**| 5GB             | 10,000     | 1MB            |
| **AWS S3**         | 5GB              | 10,000     | 5MB (recommended)|
| **Qiniu Cloud**    | 100MB            | 10,000     | 4MB            |

### 3.2 CDN Origin Fetch Strategies Explained

<CachePolicyDemo />

#### What Is "Origin Fetch"?

CDN edge nodes cache content from the origin, but when:

- The content requested by the user is **being accessed for the first time**
- The cached content has **expired (TTL elapsed)**
- The cache has been **manually purged/preheated**

CDN nodes need to request the latest content from the **origin**—this process is called "origin fetch."

#### Three Origin Fetch Modes

| Mode                       | Principle                          | Use Case                          | Pros/Cons                                |
| :------------------------- | :--------------------------------- | :-------------------------------- | :--------------------------------------- |
| **Direct Origin Fetch**    | CDN node → Origin                  | Origin has a public IP and low traffic| Simple and direct, but high origin pressure|
| **Mid-Tier Origin Fetch**  | CDN node → Mid-tier → Origin       | Large websites, multi-layer cache | Reduces origin pressure, complex architecture|
| **OSS/COS as Origin**      | CDN node → Object Storage          | Static assets, images, videos     | Best practice, low cost, good performance|

#### Origin Fetch Configuration in Practice

**Scenario 1: Object Storage as Origin (Recommended)**

```
User accesses: cdn.example.com/images/photo.jpg
                    ↓
            CDN Edge Node (Beijing)
                    ↓
            Miss, fetch from origin
                    ↓
            Origin: bucket-name.oss-cn-beijing.aliyuncs.com
                    ↓
            Returns image, CDN caches and responds to user
```

Key configuration items:

- **Origin Type**: OSS/COS domain or custom origin
- **Origin Protocol**: HTTP or HTTPS (HTTPS recommended)
- **Origin HOST**: The Host header used when accessing the origin
- **Origin SNI**: Server Name Indication for HTTPS origin fetch

**Scenario 2: Multi-Origin Load Balancing**

When a single origin can't handle the origin fetch pressure, configure multiple origins:

```
CDN Edge Node
    ├─ Origin A (weight 50%)
    ├─ Origin B (weight 30%)
    └─ Origin C (weight 20%)
```

Active/standby mode:

```
CDN Edge Node
    ├─ Primary Origin A (all traffic when healthy)
    └─ Backup Origin B (failover when primary fails)
```

#### Origin Fetch Bandwidth vs. CDN Bandwidth

Here's an easily confused concept:

| Metric                | Definition                                  | Billing Relationship                    |
| :-------------------- | :------------------------------------------ | :-------------------------------------- |
| **CDN Downstream Bandwidth**| Traffic from CDN nodes to users        | Usually billed as CDN traffic cost      |
| **Origin Fetch Bandwidth**  | Traffic from origin to CDN nodes       | Usually object storage or origin egress cost|

**Cost-Saving Tips**:

- Improve CDN hit ratio (let more requests hit cache, reducing origin fetches)
- Set reasonable cache times (TTL)
- Use preheating to cache hot content before users access it
- Enable "Follow 301/302" to avoid unnecessary origin fetch redirects

### 3.3 Cache Strategy Configuration

<CachePolicyDemo />

#### Cache Key: Determining What Counts as the "Same File"

How does a CDN decide whether two requests should return the same cached copy? It relies on the **cache key**.

**Default cache key typically includes**:

- URL path (excluding query parameters)
- For example: `/images/photo.jpg`

**Problem Scenario**:

```
User A requests: /images/photo.jpg?w=100&h=100  (100×100 thumbnail)
User B requests: /images/photo.jpg?w=800&h=600  (800×600 large image)
```

If the cache key only includes the path, the two different-sized images would be treated as the same file, causing confusion.

**Solution: Custom Cache Key Rules**

| Rule                        | Example                       | Effect                                  |
| :-------------------------- | :---------------------------- | :-------------------------------------- |
| **Keep specified query params**| Keep `w`, `h`               | Cache different sizes separately        |
| **Keep all query params**   | Keep all                      | Fully exact matching                    |
| **Ignore specific query params**| Ignore `token`, `timestamp`| URLs with timestamps can hit cache      |
| **Include request headers** | Include `Accept-Language`     | Return different content for different languages|

**Real-World Configuration Example** (Alibaba Cloud CDN):

```
Cache key rules:
- URL path: /images/*
- Keep query params: w, h, format
- Ignore query params: token, timestamp, utm_source
```

#### Cache Time (TTL): Balancing Content "Freshness"

TTL (Time To Live) determines how long content is cached on CDN nodes. Set it too short, and you'll have many origin fetches and high costs; set it too long, and users will see stale content after updates.

**Recommended TTL by File Type**:

| File Type     | Recommended TTL           | Reason                                  |
| :------------ | :------------------------ | :-------------------------------------- |
| HTML pages    | 0-5 minutes               | Frequently updated, needs real-time     |
| JS/CSS files  | 1 year (with filename hash)| Content unchanged; cache invalidates when filename changes|
| Images/videos | 7-30 days                 | Low update frequency, can be cached long-term|
| Font files    | 1 year                    | Almost never change                     |
| API responses | 0-5 minutes (business-dependent)| High data real-time requirements |

**Best Practices for Frontend Engineering with CDN**:

```javascript
// webpack/vite configuration
output: {
  filename: 'js/[name]-[contenthash:8].js',
  chunkFilename: 'js/[name]-[contenthash:8].chunk.js',
}
```

Generated filename: `app-a3f2b1c9.js`

- File content changes → hash changes → new URL → natural cache invalidation
- File content unchanged → hash unchanged → URL unchanged → long-term cache hit

#### Cache Purge and Preheat

**Manual Purge (Emergency Scenarios)**:

When you've updated origin content but the CDN cache hasn't expired yet, users still see the old content:

| Purge Type        | Effect                                  | Time Required | Use Case            |
| :---------------- | :-------------------------------------- | :------------ | :------------------ |
| **URL Purge**     | Invalidate cache for a specific URL     | 5-10 minutes  | Single file update  |
| **Directory Purge**| Invalidate all content under a directory| 10-30 minutes | Batch update        |
| **Full-site Purge**| Invalidate all cache for the entire domain| 30+ minutes | Emergency rollback  |

**Important Reminder**: Purging only invalidates the cache; the next request will fetch new content from the origin. Don't do large-scale purges during peak hours, or you might overwhelm the origin.

**Preheat (Proactive Optimization)**:

Purge is reactive (content already updated); preheat is proactive (cache in advance).

```
Scenario: A viral article is going live tomorrow at 10 AM

Submit preheat request tonight:
- URL: https://cdn.example.com/articles/viral-article.html
- Preheat scope: All edge nodes nationwide

Result:
When users access it at 10 AM tomorrow, the content is already waiting at edge nodes
→ Zero origin fetch latency, instant loading experience
```

---

## 4. Traffic Scheduling: Getting Users to the "Nearest" Node

<TrafficSchedulingDemo />

### 4.1 Intelligent DNS Scheduling

Traditional DNS resolution:

```
User asks: What's the IP for cdn.example.com?
DNS answers: 1.2.3.4 (fixed)
```

Intelligent DNS resolution:

```
User (Beijing Unicom) asks: What's the IP for cdn.example.com?
Intelligent DNS: Let me check... Beijing Unicom's CDN node is 1.2.3.4

User (Shanghai Telecom) asks: What's the IP for cdn.example.com?
Intelligent DNS: Shanghai Telecom's CDN node is 5.6.7.8
```

**Scheduling Dimensions**:
| Dimension         | Description                        | Effect                              |
| :---------------- | :--------------------------------- | :---------------------------------- |
| **Geographic Location**| Assign by province/city/country| Nearby access, reduced latency     |
| **ISP**           | Unicom/Telecom/Mobile/BGP          | Same-ISP transmission, avoid cross-ISP|
| **Node Load**     | Real-time CPU/bandwidth/QPS        | Avoid overloaded nodes              |
| **Node Health**   | Availability probing               | Auto-remove faulty nodes            |
| **Cost Factors**  | Bandwidth unit price differences   | Balance performance and cost        |

### 4.2 HTTP DNS and Direct IP Connection

Traditional DNS has a problem: **DNS hijacking and resolution latency**.

**HTTP DNS Solution**:

```
Client → Bypasses system DNS → Directly queries HTTP DNS service (e.g., 223.5.5.5:80)
         ↓
    Returns optimal IP list (with weights)
         ↓
    Client probes network quality and selects the best IP
```

Advantages:

- Anti-hijacking: bypasses ISP DNS
- More precise: can select IP based on client network quality
- Real-time: faster failover

**Practical Recommendations**:

- Mobile apps are strongly recommended to integrate HTTP DNS
- Web apps can use CNAME-based scheduling provided by CDN
- Critical services can implement multi-IP failover (one domain returns multiple IPs)

---

## 5. HTTPS Optimization: Balancing Security and Performance

<HttpsOptimizationDemo />

### 5.1 Motivation for HTTPSing on CDN Important

**Scenario Comparison**:

```
Without HTTPS:
User accesses http://cdn.example.com/image.jpg
↓
Browser address bar shows "Not Secure"
↓
Some browsers/APPs directly block access
↓
SEO ranking drops
```

```
With HTTPS:
User accesses https://cdn.example.com/image.jpg
↓
Browser shows green lock icon
↓
HTTP/2 multiplexing takes effect
↓
Performance + security both improved
```

### 5.2 CDN HTTPS Configuration Essentials

#### Certificate Management

| Solution                    | Description                       | Cost              | Use Case                      |
| :-------------------------- | :-------------------------------- | :---------------- | :---------------------------- |
| **Cloud provider free cert**| Provided by Alibaba Cloud/Tencent Cloud| Free          | Single domain, quick start    |
| **Let's Encrypt**           | Community free certificate        | Free              | Automated deployment          |
| **Commercial DV/OV/EV cert**| Symantec, GeoTrust, etc.          | Hundreds to tens of thousands CNY/year| Enterprise, green bar needed|
| **Wildcard certificate**    | \*.example.com                    | Thousands CNY/year| Multiple subdomains           |

**Practical Recommendations**:

- Testing environments: Let's Encrypt or cloud provider free certificates
- Production environments: Wildcard certificate (convenient) or single-domain OV certificate (cost-effective)
- Watch certificate expiration dates; set up auto-renewal reminders

#### HTTPS Optimization Configuration

**TLS Version Selection**:

```
Recommended: TLS 1.2 and TLS 1.3 only
Compatibility: TLS 1.1 + TLS 1.2 + TLS 1.3 (for legacy browsers)
```

**Cipher Suites**:

```
Recommended: ECDHE key exchange + AES-GCM encryption
Disabled: DES, RC4, MD5, SHA1
```

**OCSP Stapling**:

```
Function: CDN node pre-fetches certificate revocation status
Effect: Reduces client verification time by 200-500ms
Recommendation: Always enable
```

**TLS Session Resumption**:

```
Session ID resumption: Client sends last Session ID, server resumes session
Session Ticket resumption: Server encrypts session state and sends to client, client sends it back next time
Effect: Avoids full TLS handshake, saves 1-RTT
```

### 5.3 HTTP/2 and HTTP/3 on CDN

**HTTP/2 Multiplexing**:

```
HTTP/1.1:
Request 1 (index.html) ────────────────→
Response 1 ←──────────────────────────────
Request 2 (style.css) ─────────────────→
Response 2 ←──────────────────────────────
Request 3 (script.js) ─────────────────→
Response 3 ←──────────────────────────────
(Serial, one finishes before the next)

HTTP/2:
Request 1 ──→
Request 2 ──→   Merged on one TCP connection, frames interleaved
Request 3 ──→
Response 1 ←──   Streamed back by priority
Response 2 ←──
Response 3 ←──
(Parallel, one connection multiplexed)
```

**HTTP/2 Server Push**:

```
Scenario: User requests index.html, which references style.css and script.js

Traditional approach:
1. User downloads index.html
2. Parsing discovers style.css and script.js are needed
3. Two more requests to fetch them

HTTP/2 Push:
1. User requests index.html
2. CDN node returns index.html while proactively pushing style.css and script.js
3. When the user parses the HTML, the resources are already in the cache

Note: Push cautiously—too much wastes bandwidth, too little has no effect
```

**HTTP/3 (QUIC)**:

```
HTTP/2 problem: TCP-based, head-of-line blocking
→ One TCP packet lost, entire connection waits for retransmission

HTTP/3 solution: QUIC-based (reliable transport over UDP)
→ Each stream is independent; one stream blocked doesn't affect others
→ Connection migration: WiFi to 4G switch, connection doesn't drop
→ 0-RTT handshake: Fast connection establishment even on first visit

Current status: As of 2024, mainstream CDNs support HTTP/3; recommended to enable
```

---

## 6. Access Analytics: Understanding Your CDN Reports

<AccessAnalyticsDemo />

### 6.1 Core Metrics Explained

#### Bandwidth

```
Definition: Amount of data transferred per unit of time
Unit: bps (bits per second), Mbps, Gbps

CDN bandwidth = Total egress traffic from all edge nodes

Note the distinction:
- Billing bandwidth: Usually billed by 95th percentile peak or daily peak
- Actual bandwidth: Real-time transfer rate
```

**Relationship Between Bandwidth and Traffic**:

```
1 Mbps bandwidth running continuously for 1 hour = 450 MB of traffic
(Calculation: 1,000,000 bps × 3600s ÷ 8 ÷ 1024 ÷ 1024 ≈ 429 MB)
```

#### QPS (Queries Per Second)

```
Definition: Number of queries/requests per second

CDN QPS = Total HTTP requests processed per second across all edge nodes

Note: High QPS doesn't mean high bandwidth
- Small file scenarios: High QPS, low bandwidth
- Large file scenarios: Low QPS, high bandwidth
```

#### Hit Ratio

```
Definition: Proportion of requests served from CDN edge node cache out of total requests

Formula:
Hit Ratio = (Hits / Total Requests) × 100%
or
Hit Ratio = (1 - Origin Fetch Traffic / Total Egress Traffic) × 100%

Industry standards:
- Images/videos/JS/CSS: > 95%
- HTML pages: 50-80% (depending on update frequency)
- API endpoints: Usually not cached or very low
```

**Common Causes of Low Hit Ratio**:

| Cause                  | Symptom                         | Solution                              |
| :--------------------- | :------------------------------ | :------------------------------------ |
| Cache time too short   | TTL only a few minutes          | Adjust TTL by file type               |
| Query parameter changes| URL carries random numbers      | Configure to ignore specific params   |
| Improper cache key     | Things that shouldn't differ are differentiated| Optimize cache key rules    |
| Frequent content updates| Files frequently overwritten   | Use version numbers or hash filenames |
| Many first-time visits | New content or new nodes        | Preheat in advance                    |

### 6.2 Log Analysis and Troubleshooting

#### CDN Log Field Breakdown

A typical CDN access log contains the following fields:

```
Time | Client IP | Request Method | URL | HTTP Status Code | Response Size | Cache Status | Response Time | Referer | User-Agent

Example:
2024-01-15 14:32:01 | 114.114.114.114 | GET | https://cdn.example.com/images/photo.jpg | 200 | 153600 | HIT | 23 | https://example.com/ | Mozilla/5.0...
```

Key Field Explanations:

| Field            | Description          | Analysis Value                                       |
| :--------------- | :------------------- | :--------------------------------------------------- |
| `cache_status`   | Cache status         | HIT (hit), MISS (miss), EXPIRED (expired)            |
| `response_time`  | Response time (ms)   | Determines user experience; optimize if >500ms       |
| `http_status`    | HTTP status code     | Troubleshoot 404/500 errors                          |
| `bytes_sent`     | Bytes sent           | Bandwidth statistics                                 |

#### Common Troubleshooting

**Issue 1: Users Report Slow Access**

Troubleshooting steps:

```
1. Check log response_time
   - If high (>500ms): Check if cache MISS or slow origin

2. Check cache_status
   - HIT: Cache hit; slowness may be due to large file or node issue
   - MISS: Cache miss; need to optimize cache strategy or hit ratio

3. Check client IP distribution
   - Slow in certain regions: May be high node load or insufficient coverage
```

**Issue 2: Cache Not Taking Effect, Always Fetching from Origin**

Troubleshooting checklist:

```
□ Does the origin response header have Cache-Control: no-cache / private?
□ Does the URL carry random parameters (e.g., ?_=123456)?
□ Is the cache key configuration correct?
□ Is the TTL too short?
□ Is it hitting the browser's local cache instead of CDN?
```

**Issue 3: Sudden Cost Spike**

Investigation directions:

```
1. Check bill details
   - High CDN traffic cost: Check if large files are being frequently accessed or hotlinked
   - High origin fetch traffic cost: Check if hit ratio has dropped sharply
   - High request count cost: Check for CC attacks or crawlers

2. Check access logs
   - Are there many 404 requests (possibly scanning or configuration errors)?
   - Is the Referer abnormal (to determine if hotlinking)?

3. Security settings
   - Enable hotlink protection (Referer whitelist)
   - Enable IP blacklist/whitelist
   - Configure CC protection
```

---

## 7. Real-World Case Study: Building an Image Acceleration Solution from Scratch

### 7.1 Business Scenario

Imagine you're the technical lead for an image-sharing community facing these challenges:

- **User uploads**: 1 million images uploaded daily (average 2MB each)
- **User access**: 50 million image view requests per day
- **Access distribution**: Users across the country, with some overseas access
- **Performance requirement**: Image load time < 500ms
- **Budget**: Try to keep it under 50,000 CNY/month

### 7.2 Architecture Design

```
                         ┌──────────────────────────────────────┐
                         │           User Upload Flow              │
                         └──────────────────────────────────────┘

   User Browser                                Backend Service                  Object Storage
       │                                            │                               │
       │  1. Request upload credentials              │                               │
       │───────────────────────────────────────────>│                               │
       │                                            │                               │
       │                                            │  2. Request STS temp credentials│
       │                                            │──────────────────────────────>│
       │                                            │                               │
       │                                            │  3. Return STS credentials    │
       │                                            │<──────────────────────────────│
       │                                            │                               │
       │  4. Return upload credentials (with STS)   │                               │
       │<───────────────────────────────────────────│                               │
       │                                            │                               │
       │  5. Direct file upload (using STS signature)│                              │
       │──────────────────────────────────────────────────────────────────────────>│
       │                                            │                               │
       │  6. Return upload result (URL, ETag, etc.) │                               │
       │<──────────────────────────────────────────────────────────────────────────│
       │                                            │                               │
       │  7. Notify backend upload complete (save to DB)│                           │
       │───────────────────────────────────────────>│                               │


                         ┌──────────────────────────────────────┐
                         │           User Access Flow              │
                         └──────────────────────────────────────┘

   User Browser              DNS Resolution            CDN Node              Object Storage (Origin)
       │                         │                        │                        │
       │  1. Request image URL   │                        │                        │
       │────────────────────────────────────────────────>│                        │
       │                         │                        │                        │
       │                         │  2. DNS query          │                        │
       │                         │───────────────────────>│                        │
       │                         │                        │                        │
       │                         │  3. Return optimal node IP│                     │
       │                         │<───────────────────────│                        │
       │                         │                        │                        │
       │  4. Connect to CDN node │                        │                        │
       │────────────────────────────────────────────────>│                        │
       │                         │                        │                        │
       │                         │  5. Check cache        │                        │
       │                         │                        ├─ Hit? Return directly  │
       │                         │                        └─ Miss? Continue       │
       │                         │                        │                        │
       │                         │                        │  6. Origin fetch       │
       │                         │                        │───────────────────────>│
       │                         │                        │                        │
       │                         │                        │  7. Return file        │
       │                         │                        │<───────────────────────│
       │                         │                        │                        │
       │                         │  8. Cache and respond  │                        │
       │<────────────────────────────────────────────────│                        │
```

### 7.3 Key Configuration Details

#### Object Storage Configuration

**Bucket Planning**:

```
 Bucket: myapp-images-prod
 ├─ Directory structure:
 │   ├─ uploads/           # Original images uploaded by users
 │   │   ├─ 2024/01/15/user123-abc.jpg
 │   │   └─ 2024/01/15/user456-def.png
 │   ├─ thumbnails/        # Thumbnails
 │   │   ├─ small/         # 100×100
 │   │   ├─ medium/        # 400×300
 │   │   └─ large/         # 800×600
 │   └─ processed/         # Processed images (watermarked, etc.)
 │
 ├─ Access permissions:
 │   ├─ Original images directory: Private (requires signed access)
 │   ├─ Thumbnails directory: Public read
 │   └─ CORS: Allow *.myapp.com access
 │
 └─ Lifecycle policies:
     ├─ 7 days after upload: Infrequent Access storage (save 40% cost)
     ├─ 90 days after upload: Archive storage (save 70% cost)
     └─ 3 years after upload: Auto-delete (or transfer to cheaper cold storage)
```

**CORS Configuration**:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://myapp.com</AllowedOrigin>
    <AllowedOrigin>https://www.myapp.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-oss-request-id</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

#### CDN Acceleration Configuration

**Cache Strategy Configuration**:

```
Global default rules:
├─ Cache key: URL path + keep w, h, format query params
├─ Default TTL: 7 days
└─ Origin HOST: Auto-follow

By file type:
├─ *.html:
│   ├─ TTL: 5 minutes
│   └─ Prefer memory cache reads
│
├─ *.js, *.css:
│   ├─ TTL: 1 year
│   └─ Ignore query params (since filenames have hashes)
│
├─ *.jpg, *.png, *.gif, *.webp:
│   ├─ TTL: 30 days
│   ├─ Keep query params (w, h, format for dynamic resizing)
│   └─ Enable automatic image compression optimization
│
└─ /api/*:
    ├─ TTL: 0 (no cache)
    └─ Direct origin fetch
```

**HTTPS Optimization Configuration**:

```
Certificate configuration:
├─ Certificate type: Wildcard certificate *.myapp.com
├─ Deployment method: Upload via CDN console, auto-renewal
└─ Backup certificate: EV certificate for main domain (shows green address bar)

TLS configuration:
├─ Minimum TLS version: 1.2 (balance compatibility and security)
├─ Maximum TLS version: 1.3
├─ Cipher suites: Only enable strong cipher suites
├─ OCSP Stapling: Enabled
├─ TLS Session Resumption: Enable Session Ticket
└─ HSTS: Enabled (max-age=31536000)

HTTP/2 and HTTP/3:
├─ HTTP/2: Enabled (multiplexing, header compression)
├─ HTTP/2 Server Push: Enable as needed (Preload recommended as alternative)
└─ HTTP/3 (QUIC): Enabled (experimental feature, gradual rollout)
```

### 7.4 Cost Control Strategies

#### Cost Breakdown Analysis

```
Monthly CDN + Object Storage cost breakdown:

CDN portion:
├─ Downstream traffic cost (major, ~60%)
│   ├─ China mainland: 0.15-0.30 CNY/GB
│   ├─ Asia-Pacific: 0.40-0.80 CNY/GB
│   └─ Europe & Americas: 0.30-0.60 CNY/GB
│
├─ Request count cost (minor, ~5%)
│   ├─ HTTP: 0.01-0.05 CNY per 10,000 requests
│   └─ HTTPS: 0.05-0.15 CNY per 10,000 requests (TLS handshake consumes resources)
│
├─ Peak bandwidth cost (optional billing method)
│   └─ 95th percentile billing: Suitable for highly fluctuating traffic
│
└─ Value-added feature costs (~5%)
    ├─ HTTPS certificate management
    ├─ WAF protection
    ├─ Real-time log push
    └─ Edge scripts/functions

Object Storage portion:
├─ Storage capacity cost (~15%)
│   ├─ Standard storage: 0.12-0.15 CNY/GB/month
│   ├─ Infrequent Access storage: 0.08-0.10 CNY/GB/month
│   └─ Archive storage: 0.03-0.05 CNY/GB/month
│
├─ Request costs (~5%)
│   ├─ PUT: 0.01-0.05 CNY per 10,000 requests
│   └─ GET: 0.005-0.01 CNY per 10,000 requests
│
├─ Data retrieval costs (Infrequent Access/Archive)
│   └─ Early deletion or retrieval incurs additional fees
│
└─ Origin fetch egress traffic cost (~10%)
    └─ Traffic cost for CDN origin fetch to object storage
```

#### Cost-Saving Tips in Practice

**Tip 1: Storage Tiering with Automatic Lifecycle Management**

```yaml
# Lifecycle rule example
rules:
  - id: image-lifecycle
    prefix: uploads/
    transitions:
      # After 7 days, transition to IA storage, save 30% cost
      - days: 7
        storageClass: IA
      # After 90 days, transition to Archive storage, save 70% cost
      - days: 90
        storageClass: Archive
    # Auto-delete after 3 years
    expiration:
      days: 1095
```

**Tip 2: Improve CDN Hit Ratio, Reduce Origin Fetch**

```
What does improving hit ratio from 90% to 95% mean?

Assuming:
- Daily traffic: 10 TB
- Hit ratio 90%: 1 TB origin fetch
- Hit ratio 95%: 0.5 TB origin fetch

Origin fetch savings: 0.5 TB/day × 0.15 CNY/GB × 30 days = 2,250 CNY/month
```

**Tip 3: Compression and Format Optimization**

```
Image optimization plan:
├─ Store original images in object storage (not directly exposed)
├─ Enable CDN image processing:
│   ├─ Auto format conversion: JPEG → WebP/AVIF (save 30-50%)
│   ├─ Auto quality compression: Visually lossless compression (save 20-40%)
│   ├─ Responsive sizing: Return appropriate size based on device
│   └─ Progressive loading: Blur to sharp
└─ Result: Bandwidth cost reduced by 50-70%
```

**Tip 4: Bandwidth Peak Cap and Alerts**

```yaml
# Bandwidth cap configuration
bandwidth_cap:
  daily_limit: 500 # Mbps, auto-disable CDN if daily peak exceeds
  monthly_limit: 10000 # GB, disable if monthly traffic exceeds

  # Alert thresholds
  alerts:
    - threshold: 70% # Alert at 70%
      channels: [sms, email]
    - threshold: 90% # Call at 90%
      channels: [phone]
```

---

## 8. Summary: The Golden Rules of Object Storage + CDN

### 8.1 Architecture Design Principles

**Principle 1: Separate Static and Dynamic Content**

```
Dynamic content (API, HTML) → Route to origin or edge functions
Static content (images, JS, CSS, videos) → Route through CDN + object storage
```

**Principle 2: Serve Nearby**

```
Content is cached wherever the users are
→ Choose a CDN provider with broad coverage
→ Enable intelligent DNS scheduling
→ Preheat important content in advance
```

**Principle 3: Layered Caching**

```
Browser local cache (strongest)
    ↓
CDN edge node cache (second strongest)
    ↓
CDN mid-tier/regional node (fallback)
    ↓
Object storage/origin (last line of defense)
```

**Principle 4: Balance Cost and Experience**

```
Storage tiering: Hot data on standard storage, cold data on archive storage
Cache strategy: Long TTL for high-frequency content, short TTL for low-frequency content
Compression optimization: WebP/AVIF formats, intelligent quality compression
Monitoring and alerts: Set bandwidth caps, prevent abnormal traffic
```

### 8.2 Pitfall Checklist

**Bucket Naming and Permissions**

- [ ] Bucket names are globally unique; avoid name conflicts
- [ ] Private files should not be set to public read
- [ ] Don't write AccessKey in frontend code; use STS temporary credentials
- [ ] Enable server-side encryption (SSE) to protect sensitive data

**CDN Cache Configuration**

- [ ] HTML file TTL shouldn't be too long (recommended < 5 minutes)
- [ ] JS/CSS should use hashed filenames with TTL set to 1 year
- [ ] Cache keys should be reasonable; don't include user-specific variables
- [ ] Remember to purge cache or preheat after important updates

**HTTPS Security**

- [ ] Certificates must not expire; set up auto-renewal
- [ ] Minimum TLS version should be 1.2
- [ ] Enable HSTS to prevent downgrade attacks
- [ ] Set Secure and HttpOnly flags on sensitive cookies

**Cost Control**

- [ ] Enable bandwidth cap alerts to prevent abnormal traffic
- [ ] Infrequent Access/Archive storage has minimum storage duration and early deletion fees; be mindful of rules
- [ ] Origin fetch traffic is also expensive; work hard to improve CDN hit ratio
- [ ] Regularly analyze access logs and clean up zombie resources

---

## 9. Practical Code Templates

### 9.1 Frontend Direct Upload to Object Storage (JavaScript)

```javascript
/**
 * Object Storage Direct Upload Utility
 * Supports: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
class DirectUploader {
  constructor(config) {
    this.provider = config.provider // 'oss' | 'cos' | 's3'
    this.region = config.region
    this.bucket = config.bucket
    this.getCredentials = config.getCredentials // Function to fetch temporary credentials
  }

  /**
   * Fetch STS temporary credentials
   */
  async fetchCredentials() {
    // Request temporary credentials from backend
    const credentials = await this.getCredentials()
    return {
      accessKeyId: credentials.accessKeyId,
      accessKeySecret: credentials.accessKeySecret,
      sessionToken: credentials.securityToken || credentials.sessionToken,
      expiration: credentials.expiration
    }
  }

  /**
   * Generate upload signature (for client-side signature computation)
   */
  generateSignature(credentials, fileKey, fileType, options = {}) {
    const timestamp = new Date().toISOString()
    const date = timestamp.slice(0, 10).replace(/-/g, '')

    // Signature algorithms differ slightly by provider
    switch (this.provider) {
      case 'oss':
        return this._ossSignature(credentials, fileKey, date, options)
      case 'cos':
        return this._cosSignature(credentials, fileKey, date, options)
      case 's3':
        return this._s3Signature(credentials, fileKey, date, options)
      default:
        throw new Error('Unknown provider')
    }
  }

  /**
   * Single file upload (small files < 100MB)
   */
  async upload(file, options = {}) {
    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    const formData = new FormData()

    // Build form fields (field names differ by provider)
    const formFields = this._buildFormFields(
      credentials,
      fileKey,
      file.type,
      options
    )
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('file', file)

    // Send upload request
    const uploadUrl = this._getUploadUrl()
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // For large files, you may need a longer timeout
      signal: options.signal // Support AbortController to cancel upload
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      etag: response.headers.get('ETag'),
      size: file.size
    }
  }

  /**
   * Multipart upload (large files > 100MB)
   */
  async multipartUpload(file, options = {}) {
    const partSize = options.partSize || 10 * 1024 * 1024 // Default 10MB per part
    const parallel = options.parallel || 3 // Default 3 concurrent

    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    // 1. Initialize multipart upload
    const uploadId = await this._initMultipartUpload(
      credentials,
      fileKey,
      file.type
    )

    // 2. Calculate parts
    const parts = []
    const totalParts = Math.ceil(file.size / partSize)
    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize
      const end = Math.min(start + partSize, file.size)
      parts.push({
        number: i + 1,
        start,
        end,
        blob: file.slice(start, end)
      })
    }

    // 3. Upload parts (with concurrency control and resumable upload)
    const uploadedParts = []
    const failedParts = []

    // Support resumable upload: check which parts are already uploaded
    if (options.resume) {
      const existingParts = await this._listParts(
        credentials,
        fileKey,
        uploadId
      )
      for (const part of existingParts) {
        uploadedParts.push(part)
      }
    }

    // Filter out already uploaded parts
    const pendingParts = parts.filter(
      (p) => !uploadedParts.some((up) => up.partNumber === p.number)
    )

    // Concurrent upload
    const uploadPart = async (part) => {
      try {
        const etag = await this._uploadPart(
          credentials,
          fileKey,
          uploadId,
          part
        )
        return { partNumber: part.number, etag }
      } catch (error) {
        failedParts.push({ part, error })
        throw error
      }
    }

    // Use Promise.all to control concurrency
    const chunks = []
    for (let i = 0; i < pendingParts.length; i += parallel) {
      chunks.push(pendingParts.slice(i, i + parallel))
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(chunk.map(uploadPart))
      for (const result of results) {
        if (result.status === 'fulfilled') {
          uploadedParts.push(result.value)
        }
      }
    }

    // Check if all parts uploaded successfully
    if (uploadedParts.length !== totalParts) {
      throw new Error(
        `Upload incomplete: ${uploadedParts.length}/${totalParts} parts uploaded`
      )
    }

    // 4. Complete multipart upload (merge parts)
    await this._completeMultipartUpload(
      credentials,
      fileKey,
      uploadId,
      uploadedParts
    )

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      size: file.size,
      parts: totalParts
    }
  }

  /**
   * Generate file storage path
   */
  _generateFileKey(file, directory = '') {
    const date = new Date()
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop() || 'bin'
    const key = directory
      ? `${directory}/${datePath}/${random}.${ext}`
      : `${datePath}/${random}.${ext}`
    return key
  }

  // ============ Provider-Specific Methods ============

  _getUploadUrl() {
    switch (this.provider) {
      case 'oss':
        return `https://${this.bucket}.oss-${this.region}.aliyuncs.com`
      case 'cos':
        return `https://${this.bucket}.cos.${this.region}.myqcloud.com`
      case 's3':
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com`
      default:
        throw new Error('Unknown provider')
    }
  }

  _getFileUrl(key) {
    return `https://${this.bucket}.${this.provider === 'oss' ? 'oss' : 'cos'}-${this.region}.${
      this.provider === 'oss'
        ? 'aliyuncs.com'
        : this.provider === 'cos'
          ? 'myqcloud.com'
          : 'amazonaws.com'
    }/${key}`
  }

  // Provider-specific signature, multipart upload methods... (implement as needed)
  _buildFormFields(credentials, fileKey, fileType, options) {
    // Provider-specific form field construction logic
    // Implement according to each provider's documentation
    return {}
  }

  async _initMultipartUpload(credentials, fileKey, fileType) {
    // Provider-specific multipart upload initialization logic
    return 'upload-id'
  }

  async _uploadPart(credentials, fileKey, uploadId, part) {
    // Provider-specific part upload logic
    return 'etag'
  }

  async _completeMultipartUpload(credentials, fileKey, uploadId, parts) {
    // Provider-specific multipart upload completion logic
  }

  async _listParts(credentials, fileKey, uploadId) {
    // Provider-specific logic to list uploaded parts
    return []
  }
}

// Usage example
const uploader = new DirectUploader({
  provider: 'oss',
  region: 'cn-beijing',
  bucket: 'myapp-images-prod',
  getCredentials: async () => {
    // Request temporary credentials from backend
    const res = await fetch('/api/upload/credentials')
    return res.json()
  }
})

// Small file upload
async function uploadAvatar(file) {
  try {
    const result = await uploader.upload(file, {
      directory: 'avatars',
      onProgress: (progress) => {
        console.log(`Upload progress: ${progress.percent}%`)
      }
    })
    console.log('Upload successful:', result.url)
    return result
  } catch (error) {
    console.error('Upload failed:', error)
    throw error
  }
}

// Large file multipart upload
async function uploadVideo(file) {
  try {
    const result = await uploader.multipartUpload(file, {
      directory: 'videos',
      partSize: 10 * 1024 * 1024, // 10MB per part
      parallel: 3, // 3 concurrent
      resume: true, // Support resumable upload
      onProgress: (progress) => {
        console.log(
          `Upload progress: ${progress.percent}%, uploaded ${progress.loaded}/${progress.total}`
        )
      },
      onPartComplete: (part) => {
        console.log(`Part ${part.number} upload complete`)
      }
    })
    console.log('Upload successful:', result.url)
    return result
  } catch (error) {
    console.error('Upload failed:', error)
    // You can implement retry logic or save checkpoint info here
    throw error
  }
}
```

### 9.2 Backend Temporary Credential Service (Node.js/Express)

```javascript
/**
 * Object Storage STS Temporary Credential Service
 * Supports: Alibaba Cloud OSS, Tencent Cloud COS, AWS S3
 */
const express = require('express')
const STS = require('ali-oss').STS // Alibaba Cloud
// const COS = require('cos-nodejs-sdk-v5') // Tencent Cloud
const router = express.Router()

// Configuration
const config = {
  // Alibaba Cloud OSS configuration
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    region: 'oss-cn-beijing',
    bucket: 'myapp-images-prod',
    // STS role ARN (needs to be created in RAM console)
    roleArn: process.env.OSS_STS_ROLE_ARN
  }
}

/**
 * Get STS temporary credentials (Alibaba Cloud OSS)
 * POST /api/upload/credentials
 */
router.post('/credentials', async (req, res) => {
  try {
    // 1. Verify user identity (implement as needed)
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. Generate unique file path prefix (for permission isolation)
    const date = new Date()
    const prefix = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${userId}/`

    // 3. Create STS client
    const sts = new STS({
      accessKeyId: config.oss.accessKeyId,
      accessKeySecret: config.oss.accessKeySecret
    })

    // 4. Request temporary credentials
    const result = await sts.assumeRole(
      config.oss.roleArn,
      {
        // Policy restricts permission scope (principle of least privilege)
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'oss:PutObject',
              'oss:InitiateMultipartUpload',
              'oss:UploadPart',
              'oss:CompleteMultipartUpload',
              'oss:AbortMultipartUpload',
              'oss:ListParts'
            ],
            Resource: [`acs:oss:*:*:${config.oss.bucket}/${prefix}*`]
          }
        ],
        Version: '1'
      },
      3600, // Credential validity: 1 hour
      'web-upload-session-' + Date.now()
    )

    // 5. Return credentials and configuration
    res.json({
      success: true,
      data: {
        // STS temporary credentials
        credentials: {
          accessKeyId: result.credentials.AccessKeyId,
          accessKeySecret: result.credentials.AccessKeySecret,
          sessionToken: result.credentials.SecurityToken,
          expiration: result.credentials.Expiration
        },
        // Upload configuration
        config: {
          provider: 'oss',
          region: config.oss.region,
          bucket: config.oss.bucket,
          endpoint: `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com`,
          prefix: prefix, // File path prefix
          // Security limits
          maxSize: 100 * 1024 * 1024, // Max 100MB
          allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4'
          ]
        }
      }
    })
  } catch (error) {
    console.error('Get credentials failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get upload credentials',
      message: error.message
    })
  }
})

/**
 * Callback notification: frontend notifies backend after upload completes
 * POST /api/upload/callback
 */
router.post('/callback', async (req, res) => {
  try {
    const { key, etag, size, mimeType, originalName } = req.body
    const userId = req.user?.id

    // 1. Verify file existence
    // 2. Save file info to database
    const fileRecord = await db.files.create({
      userId,
      key,
      etag,
      size,
      mimeType,
      originalName,
      url: `https://cdn.example.com/${key}`,
      createdAt: new Date()
    })

    // 3. Async processing: generate thumbnails, extract metadata, content moderation, etc.
    await processFileAsync(fileRecord)

    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        url: fileRecord.url,
        size: fileRecord.size
      }
    })
  } catch (error) {
    console.error('Upload callback failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process uploaded file'
    })
  }
})

module.exports = router
```

### 9.3 Hotlink Protection and Security Configuration

```javascript
/**
 * CDN Hotlink Protection and Security Configuration Example
 */

// 1. Referer hotlink protection (prevent other websites from directly referencing your resources)
const refererConfig = {
  // Whitelist mode: only allow the following Referers
  allowList: [
    '*.myapp.com', // Main site
    '*.myapp.cn', // Domestic site
    'localhost:*', // Local development
    '127.0.0.1:*'
  ],

  // Blacklist mode (optional): block the following Referers
  blockList: [
    '*.competitor.com', // Competitors
    'spam-site.com'
  ],

  // Empty Referer handling: whether to allow direct access (typing URL in browser address bar)
  allowEmptyReferer: false // Recommended false for production, can be true for testing
}

// 2. URL authentication (more secure hotlink protection with timestamp and signature)
class URLAuth {
  constructor(config) {
    this.key = config.key // Authentication key, stored only on the server
    this.expireTime = config.expireTime || 3600 // Default 1 hour validity
  }

  /**
   * Generate an authenticated URL
   * @param {string} url - Original URL, e.g., https://cdn.example.com/images/photo.jpg
   * @param {number} expireIn - Validity period (seconds)
   * @returns {string} URL with authentication parameters
   */
  sign(url, expireIn = this.expireTime) {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const timestamp = Math.floor(Date.now() / 1000) + expireIn

    // Construct signature string (format varies by provider; this is a generic example)
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const signature = this._md5(signStr)

    // Add authentication parameters
    urlObj.searchParams.set('sign', signature)
    urlObj.searchParams.set('t', timestamp.toString())

    return urlObj.toString()
  }

  /**
   * Verify URL signature (used at CDN edge or origin)
   */
  verify(url) {
    const urlObj = new URL(url)
    const signature = urlObj.searchParams.get('sign')
    const timestamp = parseInt(urlObj.searchParams.get('t'))
    const pathname = urlObj.pathname

    // Check if expired
    if (timestamp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'URL expired' }
    }

    // Verify signature
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const expectedSign = this._md5(signStr)

    if (signature !== expectedSign) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  }

  _md5(str) {
    // In real projects, use crypto-js or another MD5 library
    // This is a demonstration only
    return require('crypto').createHash('md5').update(str).digest('hex')
  }
}

// Usage example
const auth = new URLAuth({
  key: 'your-secret-key-only-known-by-server',
  expireTime: 3600 // 1 hour validity
})

// Server generates signed URL
const signedUrl = auth.sign(
  'https://cdn.example.com/private/document.pdf',
  7200
)
// Result: https://cdn.example.com/private/document.pdf?sign=xxxxx&t=1699123456

// CDN edge or origin verification
const result = auth.verify(signedUrl)
if (!result.valid) {
  // Return 403 Forbidden
}

// 3. IP Blacklist/Whitelist
const ipConfig = {
  // Only allow specific IPs (suitable for internal systems)
  whiteList: [
    '192.168.1.0/24', // Internal network segment
    '10.0.0.0/8'
  ],

  // Block specific IPs (ban attackers)
  blackList: ['1.2.3.4', '5.6.7.8']
}

// 4. UA (User-Agent) Blacklist/Whitelist
const uaConfig = {
  // Block crawlers/download tools
  blackList: [
    'Wget',
    'curl',
    'python-requests',
    'Scrapy',
    'AhrefsBot',
    'SemrushBot'
  ],

  // Only allow browser access (strict mode)
  whiteList: [
    'Mozilla/*', // Modern browsers
    'AppleWebKit/*'
  ]
}
```

---

## 10. Glossary

| English Term               | Chinese Translation  | Explanation                                                                                                 |
| :------------------------- | :------------------- | :---------------------------------------------------------------------------------------------------------- |
| **Object Storage**         | 对象存储             | A data storage architecture that manages data as objects rather than a file system hierarchy. Suitable for storing images, videos, backups, and other unstructured data. |
| **Bucket**                 | 存储桶               | The top-level container in object storage for organizing and isolating data. Each bucket has independent permission controls and configuration. |
| **Object**                 | 对象/文件对象        | The basic unit of object storage, consisting of the data itself, metadata, and a globally unique key.      |
| **CDN**                    | 内容分发网络         | Content Delivery Network. Accelerates access by deploying edge nodes globally to cache website content closer to users. |
| **Edge Node**              | 边缘节点             | Cache servers deployed across regions in a CDN network, directly serving content to users.                 |
| **Origin**                 | 源站                 | The server from which a CDN fetches content on a cache miss. Can be object storage, ECS, or a self-managed server. |
| **Cache Hit**              | 缓存命中             | The requested content already exists on the CDN edge node and is returned directly without fetching from origin. |
| **Cache Miss**             | 缓存未命中           | The edge node does not have the requested content and must fetch it from the origin.                       |
| **Hit Ratio**              | 命中率               | The proportion of cache hits to total requests. Higher hit ratio means fewer origin fetches and lower costs.|
| **TTL**                    | 生存时间/缓存时间    | Time To Live. The validity period of content cached on a CDN node. After expiration, it must be re-fetched from the origin. |
| **Back to Source**         | 回源                 | The process of a CDN edge node requesting content from the origin.                                          |
| **Purge/Refresh**          | 刷新缓存             | Force CDN cache invalidation so the next request fetches the latest content from the origin.               |
| **Preheat**                | 预热                 | Proactively push content to CDN nodes before official release, so users hit the cache on their first visit.|
| **CORS**                   | 跨域资源共享         | Cross-Origin Resource Sharing. A browser security mechanism that controls resource access between different domains. |
| **Referer**                | 来源页面             | An HTTP request header field indicating which page the request was linked from. Used for hotlink protection.|
| **STS**                    | 安全令牌服务         | Security Token Service. A service that issues temporary access credentials, used for scenarios like frontend direct upload. |
| **Multipart Upload**       | 分片上传             | Splitting a large file into multiple chunks for parallel upload, supporting resumable uploads for improved efficiency and reliability. |
| **ETag**                   | 实体标签             | An HTTP response header used to identify a specific version of a resource, commonly used for cache validation. |
| **S3 API**                 | S3 兼容接口          | AWS S3's object storage API specification, which most cloud providers' object storage services are compatible with. |
| **Canonical Query String** | 规范查询字符串       | Part of the signature string used to compute request signatures, ensuring requests are not tampered with.   |

---

## Summary: The Golden Rules of Object Storage + CDN

1. **Direct upload for uploads**: Multipart for large files, STS for security
2. **Layered caching**: Browser → CDN → Origin, cache at every layer
3. **Serve users nearby**: Intelligent DNS + global node coverage
4. **Never relax on security**: HTTPS + hotlink protection + access control
5. **Monitor costs**: Hit ratio, bandwidth, storage tiering—continuously optimize

This architecture underpins the vast majority of static resource access on the internet. Understand it, and you understand the cornerstone of modern web performance optimization.
# Principles of Caching: Strategies and Patterns
::: tip 🎯 The Core Question
**Why do some websites load in 50 milliseconds while others take 5 seconds?** It's like asking: why does grabbing a book from your backpack take 1 second, while going to the library to find it takes 10 minutes? The answer is — caching. This chapter will take you deep into the core principles, design patterns, and practical techniques of caching, so you can boost your system performance by 100x.
:::

---

## 1. Motivation for Cachinging

### 1.1 The Evolution from "Query Every Time" to "Remember Frequently Used Data"

In the early days of computing, programmers would query the hard drive or database every time they needed data. It's like flipping through a textbook to look up a formula for every single math problem — accurate, but terribly inefficient. As systems scaled, this "query every time" approach began to expose serious problems: database CPU spiking to 95%, response times ballooning from 100 milliseconds to 8 seconds, and eventually, complete system collapse.

This is like a student who runs from the dorm to the library to look up references for every class, 50 trips a day, eventually collapsing from exhaustion halfway there. The solution is simple: keep a notebook of commonly used formulas in your backpack, and check the backpack first instead of running to the library every time. Caching is the computer system's "formula notebook" — it stores frequently used data in a fast-access location so the system doesn't have to go to the "library" (the database) every time.

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐌 Without Cache**
- Every request hits the database
- Database CPU usage at 95%
- Response time 5–8 seconds
- System prone to crashes

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 With Cache**
- 95% of requests return directly
- Database CPU usage < 20%
- Response time 50 milliseconds
- System runs stably

</div>
</div>

**This is the core problem caching solves: by storing copies of frequently used data, it reduces access to slow storage (the database), making the system faster and more stable.**

<CachePerformanceComparisonDemo />

### 1.2 Case: Caching Is a Lifesaver

You might be thinking: "My system is fine right now, why design for caching in advance?" Let me tell you a real story so you understand why caching is not "optional" but "mandatory."

::: warning Ah-Qiang's Database Meltdown
Ah-Qiang was a full-stack engineer at a startup building a social app. Early on, with only a few hundred users, the system ran smoothly. Ah-Qiang figured there was no need for caching — just query the database directly.

Six months later, the user base grew to 100,000. One day, a celebrity posted on the app, and 100,000 users flooded in instantly. The database buckled: CPU hit 100%, response time went from 100ms to 30 seconds, and the entire app crashed, causing massive user churn.

Post-mortem: if there had been a simple caching layer (like Redis) to cache the trending posts, database load would have dropped by at least 95%, and the system would have easily weathered the traffic spike.

Ah-Qiang learned a hard lesson: **caching is not a nice-to-have; it's a lifeline for high-concurrency systems. Going without caching is like driving without a seatbelt — fine most of the time, but fatal when things go wrong.**
:::

::: info 💡 Key Takeaway
The value of caching isn't just "faster" — more importantly, it's "protection." It protects the database from being overwhelmed and keeps the system stable under high traffic. When designing a system, don't wait until something breaks to think about caching — make it a core part of your architecture from day one.
:::

---

## 2. Core Concepts: Overview of Caching

::: tip 🤔 What Exactly Is Caching?
Simply put, **a cache is a storage space for data copies**. It's like sticking a sticky note on your desk with frequently dialed phone numbers, so you don't have to scroll through your phone's contact list every time.

**Three key points**:
1. **Copy**: Data in the cache is a copy of the original data (in the database), not the primary data
2. **Fast access**: Caches are typically in memory, which is 100,000 times faster to read than a hard drive
3. **Limited capacity**: Cache space is finite — it can only store the most frequently used data

So, **caching is trading space for time** — sacrificing some memory space in exchange for blazing-fast data access.
:::

Before diving into specific technologies, we need to clarify a few core concepts. To help you understand, we'll use a "student's backpack" as an analogy for a caching system.

### 2.1 Understanding Core Caching Concepts Through the "Backpack Analogy"

Imagine you're a student who needs to look up various references every day. This process is strikingly similar to how a caching system works:

| Concept | 🎒 Backpack Analogy | Technical Meaning | Real-World Example |
|------|-----------|----------|----------|
| **Cache Hit** | The formula you need is right there on your sticky note | The requested data is found in the cache | Querying user info — it's in Redis, returned directly |
| **Cache Miss** | The sticky note doesn't have it; you have to flip through the book | The requested data is not in the cache | Querying user info — not in Redis, must query the database |
| **Hit Ratio** | Out of 100 formula lookups, 95 are on the sticky note | The proportion of cache hits | 95% hit ratio means 95% of requests never touch the database |
| **TTL (Time To Live)** | Write "tear off in 3 days" on the sticky note | The cache entry's expiration time | Set user info cache to expire automatically after 30 minutes |
| **Eviction** | Backpack is full — toss the oldest sticky note | Deleting old data when the cache is full | Redis memory is full — auto-delete the least-used data |

### 2.2 Cache Hit vs. Cache Miss

The performance difference between a cache hit and a cache miss is enormous. Let's look at the concrete numbers:

| Operation | Response Time | Relative Speed | Suitable Scenario |
|---------|---------|----------|----------|
| **CPU L1 Cache** | ~0.5 ns | Fastest (baseline) | Internal CPU operations |
| **Memory Read** | ~100 ns | 200× slower | Local cache (e.g., Caffeine) |
| **Redis Query** | ~1 ms | 2,000,000× slower | Distributed cache |
| **MySQL Query** | ~10 ms | 20,000,000× slower | Disk-based database query |

::: tip 📊 What Can You See From This Table?
**The performance gap is staggering**: memory operations are 100,000 times faster than MySQL queries! It's like the difference between grabbing a book from your desk (1 second) and going to the library to find it (100,000 seconds, or about 28 hours).

**Three-tier performance ladder**:
1. **Local cache (memory)**: Fastest, but small capacity — ideal for hot data
2. **Redis cache**: Medium speed, large capacity — ideal for distributed scenarios
3. **Database**: Slowest, but unlimited capacity — the ultimate source of truth

**Practical takeaway**: Your system should serve over 95% of requests from the cache layer, with fewer than 5% needing to hit the database. This keeps database load low and overall system performance high.
:::

::: details 🔍 Real Code: Cache Hit vs. Cache Miss
Let's compare the two scenarios with code:

```javascript
// Scenario: querying user information

// ===== Cache Hit =====
// 1. Check Redis cache first
const userFromCache = await redis.get('user:123')
if (userFromCache) {
  // Hit! Return directly, ~1 millisecond
  return JSON.parse(userFromCache)
}

// ===== Cache Miss =====
// 2. Not in cache, query the database
const userFromDB = await db.query('SELECT * FROM users WHERE id = 123')
// Miss! Must query database, ~10 milliseconds, 10× slower

// 3. Write to cache after querying, so next time it hits
await redis.set('user:123', JSON.stringify(userFromDB), 'EX', 1800)
return userFromDB
```

**Key points**:
- Cache hit: returns in 1 millisecond — excellent user experience
- Cache miss: returns in 10 milliseconds — slightly worse user experience
- **The value of caching**: turning misses into hits yields a 10× performance improvement
:::

### 2.3 The Cache Lifecycle

A cache entry goes through a complete lifecycle from creation to destruction. Understanding this process is crucial for designing caching systems.

**Four phases**:

**Phase 1: Write**
- **Active write**: Preload hot data into the cache at system startup (cache preheating)
- **Lazy load**: Load from the database and write to cache on first access (most common)

**Phase 2: Hit / Miss**
- Every request checks the cache first
- Hit → return directly; miss → query the database

**Phase 3: Expiration**
- **TTL (Time To Live)**: Set a lifespan for the cache entry (e.g., 30 minutes)
- Upon expiration, the cache entry is automatically invalidated; the next access must reload

**Phase 4: Eviction**
- Cache space is limited — when full, old data must be deleted
- Common eviction strategies:
  - **LRU (Least Recently Used)**: Evict the data that hasn't been accessed for the longest time (most common)
  - **LFU (Least Frequently Used)**: Evict the data with the lowest access frequency
  - **FIFO (First In First Out)**: Evict the earliest-written data

👇 **Try it yourself**:
The demo below illustrates the cache lifecycle. Click "Add Cache" and observe how cache entries go through the full process of write, hit, expiration, and eviction:

<CacheLifecycleDemo />

---

## 3. The Evolution of Caching: From Single-Machine to Distributed

::: tip 🤔 Why Do We Need Different Types of Caches?
Just like you keep reference materials in different places when studying: the most frequently used on your desk (sticky notes), commonly used in your backpack (notebook), and all materials in the library (stacks).

**Caching systems work the same way**:
- **Local cache (desk)**: Fastest, small capacity — for super-hot data
- **Distributed cache (public locker)**: Fairly fast, large capacity — for commonly used data
- **Database (library)**: Slowest, unlimited capacity — for all data

**Why layer them?** Because different tiers have different performance and cost characteristics. Combining them wisely yields the optimal result.
:::

Now that we've covered the concepts, let's look at a real case study: how an e-commerce system evolved from "no cache" to a "multi-level caching architecture." This case study will give you a more intuitive understanding of why cache design matters.

### 3.1 Stage 1: The No-Cache Era — Database Running Naked

**Background**: In the early days, with only a few hundred users, all requests hit the database directly with no caching layer.

**Tech stack**:
- Database: MySQL
- No cache: no Redis, no local cache

**System architecture**:
```
User Request → Application Server → MySQL Database
```

**Characteristics of this stage**:
- ✅ **Pros**: Simple architecture, fast to develop
- ❌ **Cons**: Heavy database load, poor performance, collapses beyond a thousand users

::: details View the Code and Problems at This Stage
**Code example** (querying the database every time):

```javascript
// Get product details — query the database every single time
async function getProduct(productId) {
  // Direct database query, no caching whatsoever
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )
  return product
}
```

**Problems encountered**:
1. **Database CPU spikes**: Every request hits the database, CPU usage 80%+
2. **Slow responses**: Complex queries take 50–100 ms — poor user experience
3. **Poor concurrency**: Database QPS (queries per second) capped at 2000 — anything more and it collapses
4. **Hot product bottleneck**: Trending product detail pages are queried relentlessly; the database becomes the bottleneck

**Temporary workarounds at the time**:
- Buy more expensive servers (more CPU, more RAM) — costly, limited effect
- Database read/write separation — relieves read pressure, but write pressure remains
- SQL optimization — 20–30% improvement, but doesn't solve the fundamental problem
:::

This "running naked" model works when users < 1,000, but as the user base grows to 10,000 or 100,000, the database begins to crash frequently, and the team urgently needs to introduce caching.

### 3.2 Stage 2: Introducing Redis Cache — 10× Performance Improvement

**Background**: Users grew to 10,000; the database couldn't keep up. The team decided to introduce Redis as a caching layer.

**Tech stack**:
- Database: MySQL
- Cache: Redis (single instance)

**System architecture**:
```
User Request → Application Server → Redis Cache (query DB only on miss) → MySQL Database
```

**Characteristics of this stage**:
- ✅ **Pros**: 10× performance improvement, 90% reduction in database load
- ❌ **Cons**: Redis single point of failure, potential cache-database inconsistency

::: details View the Redis Cache Implementation Code
**Code example** (adding Redis cache):

```javascript
// Get product details — check Redis first, fall back to database
async function getProduct(productId) {
  // 1. Check Redis cache first
  const cacheKey = `product:${productId}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    // Cache hit! Return directly, ~1 millisecond
    return JSON.parse(cached)
  }

  // 2. Cache miss, query the database
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Write to Redis after querying, set 30-minute TTL
  await redis.setex(
    cacheKey,
    1800,  // 30 minutes = 1800 seconds
    JSON.stringify(product)
  )

  return product
}
```

**Performance comparison**:

| Scenario | Without Cache | With Redis Cache | Improvement |
|------|-------|--------------|---------|
| Regular product query | 50ms | 5ms (on cache hit) | **10×** |
| Hot product query | 80ms | 1ms (95% hit rate) | **80×** |
| Database QPS | 2000 (at capacity) | 200 (90% intercepted by cache) | **10× less DB load** |
| Max system concurrency | 2,000 users | 20,000 users | **10×** |

**Improvements achieved**:
1. **Response speed**: On cache hit, response time drops from 50ms to 1–5ms
2. **Concurrency capacity**: System can support 20,000 users, up from 2,000
3. **Database load**: 90% of requests intercepted by Redis, DB CPU drops from 80% to 20%
4. **User experience**: Noticeably faster page loads, fewer user complaints

**New challenges**:
1. **Cache consistency**: Product price changes, the database is updated, but the cache still holds the old value
2. **Cache penetration**: Malicious queries for non-existent product IDs (e.g., id=-1) punch through to the database every time
3. **Cache avalanche**: After a system restart, all caches expire simultaneously, flooding the database with requests
4. **Redis single point of failure**: If Redis goes down, all requests hit the database directly — the system may collapse

**Solutions**:
- **Cache consistency**: When updating the database, delete the cache synchronously
- **Cache penetration**: Cache non-existent data too (with an empty value and a short TTL, e.g., 5 minutes)
- **Cache avalanche**: Add a random offset to cache TTLs to avoid simultaneous expiration
:::

After introducing Redis, system performance improved dramatically, but new problems emerged. The team began researching how to solve these cache-related issues.

### 3.3 Stage 3: Multi-Level Cache Architecture — Another 5× Performance Boost

**Background**: Users grew to 100,000. Even Redis caching started becoming a bottleneck (single-instance Redis QPS caps at ~100,000). The team decided to introduce multi-level caching.

**Tech stack**:
- L1 Cache: Application-local cache (Caffeine)
- L2 Cache: Redis cluster
- Database: MySQL primary-replica cluster

**System architecture**:
```
User Request → CDN Cache (static assets) → Application Server
                                               ↓
                                 L1: Local Cache (Caffeine) → Miss → L2: Redis → Miss → MySQL
```

**Characteristics of this stage**:
- ✅ **Pros**: Ultimate performance (local cache takes only ~0.1 ms), high availability (Redis downtime doesn't affect hot data)
- ❌ **Cons**: Complex architecture, difficult to guarantee consistency across cache tiers

::: details View the Multi-Level Cache Implementation Code
**Code example** (local cache + Redis two-level caching):

```javascript
// Using Caffeine local cache
const caffeine = require('caffeine')
const localCache = new caffeine.Cache({
  max: 1000,              // Max 1000 entries
  ttl: 30,                // 30-second TTL
})

// Get product details — two-level caching
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Check local cache first (fastest, ~0.1 ms)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 hit')
    return localCached
  }

  // L2: Local cache miss, check Redis (fast, ~1 ms)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 hit, backfilling L1')
    const product = JSON.parse(redisCached)
    // Backfill local cache
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Redis also missed, query database (slowest, ~10 ms)
  console.log('L3 hit, backfilling L2 and L1')
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Backfill Redis (30-minute TTL)
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  // Backfill local cache
  localCache.set(cacheKey, product)

  return product
}
```

**Multi-level cache performance comparison**:

| Cache Tier | Response Time | Hit Rate | Suitable Data |
|---------|---------|--------|--------------|
| **L1: Local Cache** | ~0.1 ms | 70% (super-hot) | Hot products, system config, user sessions |
| **L2: Redis Cache** | ~1 ms | 25% (warm) | Most product data, comment aggregates |
| **L3: Database** | ~10 ms | 5% (cold data) | Complete product catalog |

**Overall performance improvement**:
- **Average response time**: 5ms (Stage 2) → 1ms (Stage 3), **another 5× improvement**
- **Max system concurrency**: 20,000 users (Stage 2) → 100,000 users (Stage 3), **5× improvement**
- **Database QPS**: 200 (Stage 2) → 50 (Stage 3), **another 4× reduction**

**New problems solved at this stage**:
1. **Local cache consistency**: Multiple app instances may have inconsistent local caches (Instance A has the old price cached, Instance B has the new one)
   - **Solution**: Set a short local cache TTL (30 seconds) to minimize the inconsistency window
2. **Cache preheating**: After a system restart, the local cache is empty — massive requests punch through to Redis
   - **Solution**: Actively load hot data into the local cache at system startup
:::

Multi-level cache architectures are widely used by large internet companies (like Taobao, JD.com) and can support millions of QPS.

### 3.4 Cache Architecture Evolution Panorama

| Stage | Architecture | Response Time | Max Concurrency | Key Change |
|------|------|---------|---------|---------|
| **Stage 1: No Cache** | App → Database | 50ms | 2,000 users | Database running naked, poor performance |
| **Stage 2: Single-Level Cache** | App → Redis → Database | 5ms | 20,000 users | Redis introduced, 10× performance boost |
| **Stage 3: Multi-Level Cache** | App → Local Cache → Redis → Database | 1ms | 100,000 users | Local cache + Redis, another 5× boost |

::: tip 📊 What Can You See From This Table?
**Stage 1 → Stage 2**: A qualitative leap. Introducing Redis brings a 10× performance improvement and 90% reduction in database load. This is the critical step from "barely working" to "good enough."

**Stage 2 → Stage 3**: Extreme optimization. Adding local cache brings another 5× improvement. This is the progression from "good enough" to "excellent," suited for ultra-high-traffic scenarios.

**Practical recommendations**:
- **Users < 10,000**: Stage 1 (no cache) suffices, but introducing Redis (Stage 2) is recommended
- **Users 10,000–100,000**: Stage 2 (Redis cache) is the optimal choice
- **Users > 100,000**: Consider Stage 3 (multi-level cache), but be mindful of the consistency complexity

**In summary**: Cache architecture evolution isn't just about "adding more cache layers" — it's about **choosing the right architecture for your traffic scale**. Over-engineering adds unnecessary complexity; under-engineering leads to performance bottlenecks.
:::

---

## 4. The Three Classic Cache Problems: Penetration, Breakdown, and Avalanche

In practice, caching introduces three classic problems. If you don't understand them, your system could suddenly collapse at some point. Let's use everyday analogies to understand these problems.

### 4.1 Cache Penetration: Querying Non-Existent Data

**Problem definition**: Querying **data that doesn't exist** (e.g., id=-1). It's not in the cache (because it was never stored), and it's not in the database — so every request punches straight through to the database.

::: tip 🤔 The "Library Book" Analogy for Cache Penetration
Imagine you're at a library looking for a book. You ask the librarian: "Do you have 'The Nonexistent Book'?"

**Normal flow**:
- The librarian checks the catalog: "No such book"
- You leave

**Cache penetration scenario**:
- You come the 1st time, the librarian checks the database: "No," tells you
- You come the 2nd time, the librarian checks the database again: "No"
- You come the 100th time, the librarian still checks the database: "No"

**Problem**: The librarian (database) is exhausted — every query hits the database, even though the answer is always "no."

**Solution**: The librarian remembers that "'The Nonexistent Book' doesn't exist." Next time you ask, they say "no" immediately without checking the database. This is **caching a null object**.
:::

**Real-world scenarios**:
- Malicious attackers construct massive numbers of non-existent IDs for querying (e.g., id=-1, id=999999999)
- Crawlers traversing non-existent resource paths (e.g., /api/products/invalid-id)
- Business logic errors leading to queries for invalid data

**Solution 1: Cache Null Objects**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Check cache first
  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    // Note: cached could be the string "null"
    if (cached === 'null') {
      // Cached "null object" — the database doesn't have this data
      return null
    }
    return JSON.parse(cached)
  }

  // 2. Query the database
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. Even if the database has nothing, cache "null" with a short TTL (e.g., 5 minutes)
  if (!product) {
    await redis.setex(cacheKey, 300, 'null')
    return null
  }

  // 4. Data found, cache normally
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

**Solution 2: Bloom Filter**

A Bloom filter is a tool for "quickly determining whether data exists" — it's like a "super index":

::: tip 📖 What Is a Bloom Filter?
Imagine you have a "magic black box":
- You ask it: "Does product ID 123 exist?"
- It says: "**Definitely not**" → then it truly doesn't exist — no need to query the database
- It says: "**Might exist**" → then go query the database to confirm

**Characteristics**:
- **No false negatives**: If it says something doesn't exist, it truly doesn't
- **Possible false positives**: If it says something might exist, it might actually not (low probability, tunable)

**Value**: A Bloom filter can intercept 99% of "doesn't exist" requests before they even reach the cache, protecting the database.
:::

```javascript
// Using a Bloom filter
const { BloomFilter } = require('bloom-filters')

// Initialize Bloom filter (assuming up to 1 million product IDs)
const bloomFilter = new BloomFilter(1000000, 0.01)  // 1% false positive rate

// At system startup, add all product IDs to the Bloom filter
async function initBloomFilter() {
  const allIds = await db.query('SELECT id FROM products')
  allIds.forEach(row => {
    bloomFilter.add(row.id)
  })
}

// Before querying a product, check with the Bloom filter first
async function getProduct(productId) {
  // 1. Check with Bloom filter first
  if (!bloomFilter.has(productId)) {
    // Definitely doesn't exist — return null, no need to query the database
    console.log('Bloom filter intercept: product does not exist')
    return null
  }

  // 2. Bloom filter says "might exist" — check cache
  const cached = await redis.get(`product:${productId}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // 3. Cache miss — query database
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  if (!product) {
    // Bloom filter false positive (very low probability) — actually doesn't exist
    await redis.setex(`product:${productId}`, 300, 'null')
    return null
  }

  // 4. Data found, write to cache
  await redis.setex(`product:${productId}`, 1800, JSON.stringify(product))
  return product
}
```

### 4.2 Cache Breakdown: Hot Data Expiration

**Problem definition**: A piece of **hot data** (like a trending product or hot news) expires in the cache (TTL runs out). At that moment, a flood of concurrent requests all arrive simultaneously and all query the database, causing a sudden spike in database load.

::: tip 🤔 The "Book Rush" Analogy for Cache Breakdown
Imagine the library has a copy of "Harry Potter" — super popular, 100 people want to borrow it.

**Normal situation**:
- The library keeps "Harry Potter" at the "checkout counter" (cache)
- Everyone grabs it directly from the counter — no need to search the shelves

**Cache breakdown scenario**:
- The copy of "Harry Potter" at the checkout counter expires (gets returned to the shelves)
- 100 people come to borrow it at the same time, find the counter empty
- All 100 rush to the shelves (database)
- The shelf manager (database) gets overwhelmed

**Problem**: It's not a "non-existent book" — it's a "super popular book" that suddenly vanished from the cache, causing a massive surge of requests to hit the database simultaneously.
:::

**Real-world scenarios**:
- A trending hashtag on Weibo expires — tens of thousands visit simultaneously
- Celebrity gossip news cache expires — fans swarm in
- Flash sale inventory data expires at the start of the event

**Solution 1: Mutex Lock**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Check cache first
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. Cache miss — acquire distributed lock
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)  // 10-second lock

  if (lock === 'OK') {
    // 3. Lock acquired — query database
    console.log('Lock acquired, querying database')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    // 4. Write to cache
    await redis.setex(cacheKey, 1800, JSON.stringify(product))

    // 5. Release lock
    await redis.del(lockKey)
    return product
  } else {
    // 6. Lock not acquired — wait 50ms and retry
    console.log('Lock not acquired, waiting and retrying')
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)  // Recursive retry
  }
}
```

**Solution 2: Logical Expiration**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)

    // 2. Check logical expiration time
    if (Date.now() < data.expireTime) {
      // Not expired — return directly
      return data.product
    } else {
      // 3. Logically expired — rebuild cache asynchronously while returning old data
      console.log('Logically expired, rebuilding cache asynchronously')
      rebuildCacheAsync(productId)  // Async rebuild
      return data.product  // Return old data
    }
  }

  // 4. Cache doesn't exist (first load) — query database synchronously
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 5. Write to cache (including logical expiration time)
  const cacheData = {
    product: product,
    expireTime: Date.now() + 30 * 60 * 1000  // Logically expires in 30 minutes
  }
  await redis.set(cacheKey, JSON.stringify(cacheData))

  return product
}

// Async cache rebuild
async function rebuildCacheAsync(productId) {
  const lockKey = `rebuild:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('Async cache rebuild started')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    const cacheData = {
      product: product,
      expireTime: Date.now() + 30 * 60 * 1000
    }
    await redis.set(`product:${productId}`, JSON.stringify(cacheData))
    await redis.del(lockKey)
    console.log('Async cache rebuild complete')
  }
}
```

### 4.3 Cache Avalanche: Mass Simultaneous Expiration

**Problem definition**: A large amount of cached data **expires at the same moment** (or Redis goes down), causing all requests to punch through to the database simultaneously and overwhelm it instantly.

::: tip 🤔 The "Library Mass Return" Analogy for Cache Avalanche
Imagine the library's "checkout counter" (cache) has 1,000 books.

**Normal situation**:
- The return dates for these books are scattered: some due today, some tomorrow, some the day after
- Only a few dozen books expire each day — the manager (database) can handle it easily

**Cache avalanche scenario**:
- After a system restart, the manager sets all 1,000 books to "due in 30 days"
- 30 days later, all 1,000 books expire at the same time
- 1,000 people come to borrow at once, find the counter empty
- All 1,000 rush to the shelves
- The shelf manager (database) gets overwhelmed instantly

**Problem**: It's not about a single book — it's about **mass data expiring simultaneously**, causing a sudden, massive spike in database pressure.
:::

**Real-world scenarios**:
- After a system restart, all caches rebuild from scratch with identical TTLs (e.g., 30 minutes)
- A scheduled job bulk-refreshes caches with the same expiration time
- The cache service (Redis) goes down or experiences a network partition

**Solution 1: Random TTL**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // Key: add a random offset (±5 minutes) to the base TTL (30 minutes)
  const baseTTL = 1800  // 30 minutes
  const randomOffset = Math.floor(Math.random() * 600) - 300  // -5 to +5 minutes
  const finalTTL = baseTTL + randomOffset

  console.log(`Cache TTL: ${finalTTL} seconds (${Math.floor(finalTTL / 60)} minutes)`)
  await redis.setex(cacheKey, finalTTL, JSON.stringify(product))

  return product
}
```

**Solution 2: Cache Preheating**

```javascript
// At system startup, proactively load hot data into the cache
async function cacheWarmup() {
  console.log('Starting cache preheating...')

  // 1. Query the top 1,000 hottest products (sorted by view count)
  const hotProducts = await db.query(`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 1000
  `)

  // 2. Batch-write to Redis
  for (const product of hotProducts) {
    const cacheKey = `product:${product.id}`
    const ttl = 1800 + Math.floor(Math.random() * 600)  // 30 minutes ± 5 minutes
    await redis.setex(cacheKey, ttl, JSON.stringify(product))
  }

  console.log(`Cache preheating complete, loaded ${hotProducts.length} hot products`)
}

// Execute at application startup
cacheWarmup()
```

**Solution 3: Circuit Breaker with Fallback**

```javascript
// Use a circuit breaker to protect the database
const CircuitBreaker = require('opossum')

// Configure the circuit breaker
const dbQueryBreaker = new CircuitBreaker(
  async (productId) => {
    return await db.query('SELECT * FROM products WHERE id = ?', [productId])
  },
  {
    timeout: 3000,  // 3-second timeout
    errorThresholdPercentage: 50,  // Trip when error rate exceeds 50%
    resetTimeout: 30000  // Attempt recovery after 30 seconds
  }
)

// Fallback handling when the circuit is open
dbQueryBreaker.fallback(() => {
  console.log('Database circuit open, returning fallback data')
  return {
    id: productId,
    name: 'Service is busy, please try again later',
    status: 'degraded'
  }
})

async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // Query database through the circuit breaker
  const product = await dbQueryBreaker.fire(productId)

  if (product.status === 'degraded') {
    return product  // Return fallback data
  }

  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

👇 **Try it yourself**:
The demo below compares the scenarios and solutions for cache penetration, breakdown, and avalanche:

<CacheProblemsDemo />

---

## 5. Cache Consistency Strategies: Keeping Cache and Database in Sync

A cache is, by nature, a copy of data. There's always a window of inconsistency between the copy and the original data (the database). How to control this window is the core challenge of cache design.

### 5.1 Motivation for Caching and Database Become Inconsistent

::: tip 🤔 The "Sticky Note and Address Book" Analogy for Inconsistency
Imagine you've written on a sticky note: "Xiao Ming's phone: 123456" — this is a copy of your address book (the database).

**Inconsistency scenario**:
- You update your address book, changing Xiao Ming's number to "7654321"
- But you forget to update the sticky note
- Next time you look up the number, you check the sticky note — still the old "123456"

**The problem**: The sticky note (cache) and the address book (database) are out of sync.

**The cause**: The original data was updated, but the copy wasn't synced. In computer systems, this happens because "updating the database" and "updating the cache" are two independent operations with a time gap between them, during which other operations can interfere.
:::

**A real concurrency scenario**:

| Time | Thread A (updating user age) | Thread B (querying user) | Database | Cache |
|------|---------------------|------------------|--------|------|
| T1 | Starts updating database | - | age=20 | age=20 |
| T2 | Database updated to age=25 | Queries cache, hits age=20 | age=25 | age=20 ❌ |
| T3 | Deletes cache | - | age=25 | - |
| T4 | - | - | age=25 | Loads age=25 from DB ✅ |

**The problem**: At time T2, Thread B reads the old value 20 from the cache, while the database already has 25. This is **cache inconsistency**.

### 5.2 Best Practice: Update the Database First, Then Delete the Cache

::: tip 🤔 Why "Delete" Instead of "Update" the Cache?
You might wonder: why not just "update the cache" directly instead of "deleting the cache"?

**Problems with updating the cache**:
- Under concurrent updates, Thread A might update the cache first, then Thread B updates the database but the cache doesn't get updated
- Updating the cache can be expensive (e.g., it may require aggregating data from multiple tables)
- If the data gets deleted right after updating, the effort is wasted

**Advantages of deleting the cache**:
- The next query automatically loads the latest data from the database (lazy loading)
- Avoids dirty data caused by concurrent updates
- Simple and reliable — the industry best practice
:::

**Standard flow**:

```javascript
// Update product information
async function updateProduct(productId, updateData) {
  // 1. Update the database first
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Then delete the cache (not update it!)
  await redis.del(`product:${productId}`)

  // 3. On the next query, cache miss triggers automatic reload of the latest data
  console.log('Update complete, cache deleted')
}
```

::: details Why "Update DB First, Then Delete Cache" Is the Optimal Approach
Comparing three update strategies:

**Strategy 1: Update cache first, then database** ❌ Not Recommended
```javascript
// Problem: if the DB update fails, cache holds the new value, DB holds the old — inconsistent
await redis.set('product:1', newProduct)  // Cache update succeeds
await db.query('UPDATE products SET ...')  // Database update fails!
// Result: cache has new value, database has old value — permanently inconsistent!
```

**Strategy 2: Delete cache first, then update database** ❌ Not Recommended
```javascript
// Problem: between delete and update, another thread queries and loads old data into cache
await redis.del('product:1')  // Cache deleted
// At this moment, Thread B queries, finds no cache, queries DB (still old value), writes to cache
await db.query('UPDATE products SET ...')  // Database updated
// Result: cache has old value, database has new value — inconsistent!
```

**Strategy 3: Update database first, then delete cache** ✅ Recommended
```javascript
// Advantage: the DB update acquires a row lock — other threads must wait, avoiding dirty data
await db.query('UPDATE products SET ...')  // Update database (acquires row lock)
await redis.del('product:1')  // Delete cache
// Even if cache deletion fails, the next query just goes back to the source — no lingering dirty data
```

**Why is Strategy 3 optimal?**
1. **Database lock protection**: The update operation acquires a row lock — other read/write operations must wait
2. **Low impact of deletion failure**: Even if cache deletion fails, it just means the next read will hit the source — no dirty data
3. **Simple and reliable**: No additional complex logic needed
:::

### 5.3 Delayed Double-Delete: Consistency Guarantee for Extreme Scenarios

**Scenario**: Under high concurrency, even "update DB first, then delete cache" has a tiny probability of inconsistency. Delayed double-delete maximizes consistency through two deletions.

**Flow**:
```
1. Delete cache
2. Update database
3. Wait for a period (e.g., 500ms)
4. Delete cache again
```

```javascript
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. First cache deletion
  await redis.del(cacheKey)

  // 2. Update database
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 3. Wait 500ms (let other threads' queries complete)
  await new Promise(resolve => setTimeout(resolve, 500))

  // 4. Second cache deletion (remove old data possibly loaded by other threads)
  await redis.del(cacheKey)

  console.log('Delayed double-delete complete, data synced')
}
```

**Comparison of three consistency strategies**:

| Strategy | Consistency Level | Performance Impact | Complexity | Suitable Scenario |
|------|-----------|---------|--------|---------|
| **Update DB first, then delete cache** | Eventual consistency (inconsistency window < 100ms) | Low | Low | Most scenarios; recommended as the default |
| **Delayed double-delete** | Strong eventual consistency (inconsistency window < 10ms) | Medium (500ms delay) | Medium | Scenarios requiring higher consistency (e.g., finance, inventory) |
| **Delete cache first, then update DB** | Weak (large inconsistency window) | Low | Low | ❌ Not recommended; prone to inconsistency |

👇 **Try it yourself**:
The demo below compares the effects of the three consistency strategies. Click "Update Data" and observe how cache and database consistency changes:

<CacheConsistencyDemo />

---

## 6. Hands-On: Building a Complete Caching System

Now that we've covered the principles, let's look at a real case study: how to design a complete caching system for an e-commerce product detail page.

### 6.1 Business Scenario Analysis

**Requirement**: Users visit a product detail page that needs to display basic product info, price, inventory, reviews, and more.

**Characteristics**:
- **Read-heavy, write-light**: 100 reads for every 1 write (100:1 read/write ratio)
- **Hotspot concentration**: 20% of products drive 80% of traffic
- **Data complexity**: Basic product info + price + inventory + review aggregates
- **Consistency requirements**: Price and inventory require strong consistency; everything else can be eventually consistent

**Performance targets**:
- P99 response time < 100ms (99% of requests return within 100ms)
- Peak database QPS < 5,000
- Cache hit ratio > 95%

### 6.2 Architecture Design

**Multi-level cache architecture**:

```
User Request
  ↓
CDN Cache (static assets: images, CSS, JS)
  ↓ Miss
Nginx Local Cache (aggregated product info)
  ↓ Miss
Application Server
  ↓
  ├─ L1: Local Cache (Caffeine, hot products)
  │   ↓ Miss
  ├─ L2: Redis Cache (all product data)
  │   ↓ Miss
  └─ L3: MySQL Database (complete dataset)
```

### 6.3 Core Code Implementation

**Complete multi-level cache implementation (simplified)**:

```javascript
const caffeine = require('caffeine')

// L1: Local cache (30-second TTL)
const localCache = new caffeine.Cache({
  max: 1000,
  ttl: 30,
})

// Get product details (multi-level cache)
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: Local cache (~0.1 ms)
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 hit')
    return localCached
  }

  // L2: Redis cache (~1 ms)
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 hit, backfilling L1')
    const product = JSON.parse(redisCached)
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Database (~10 ms, with distributed lock to prevent breakdown)
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('L3 hit, querying database')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    if (product) {
      // Write to Redis (30 minutes + random TTL)
      const ttl = 1800 + Math.floor(Math.random() * 600) - 300
      await redis.setex(cacheKey, ttl, JSON.stringify(product))
      // Backfill local cache
      localCache.set(cacheKey, product)
    }

    await redis.del(lockKey)
    return product
  } else {
    // Lock not acquired — wait and retry
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)
  }
}

// Update product info (update DB first, then delete cache)
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. Update database
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. Delete local cache
  localCache.del(cacheKey)

  // 3. Delete Redis cache
  await redis.del(cacheKey)

  console.log('Update complete, cache deleted')
}
```

👇 **Try it yourself**:
The demo below shows the complete workflow of a multi-level caching system. Click "Query Product" and observe how requests flow through the cache tiers:

<EcommerceCacheArchitectureDemo />

---

## 7. Summary and Learning Path

### 7.1 Core Knowledge Review

| Concept | One-Line Explanation | Problem Solved | Practical Tip |
|--------|-----------|-----------|----------|
| **Cache Hit** | Data found in the cache | 10–100× performance improvement | Target hit ratio > 95% |
| **Cache Penetration** | Querying non-existent data hits the DB every time | Database dragged down by malicious queries | Bloom filter + cache null objects |
| **Cache Breakdown** | Hot data expires, massive requests hit the DB | Sudden spike in database pressure | Mutex lock + logical expiration |
| **Cache Avalanche** | Mass simultaneous data expiration | Database overwhelmed | Random TTL + cache preheating |
| **Multi-Level Cache** | Local cache + Redis + Database | Ultimate performance optimization | L1 local cache 70% hit rate, L2 Redis 25% hit rate |
| **Cache Consistency** | Keeping cache and database in sync | Data accuracy | Update DB first, then delete cache |
| **Delayed Double-Delete** | Delete cache before and after the update | Consistency in extreme scenarios | Wait 500ms before the second delete |

### 7.2 Recommended Learning Path

**Phase 1: Understand the Principles (1–2 days)**
- Grasp the essence of caching (data copies, trading space for time)
- Understand core concepts: hit ratio, TTL, eviction
- Learn the performance differences between storage media (memory vs. disk)

**Phase 2: Master the Basics (2–3 days)**
- Learn to use Redis for caching (SET, GET, SETEX commands)
- Implement simple cache read/write logic (check cache first, query database on miss)
- Understand why you "delete cache on update" rather than "update cache"

**Phase 3: Solve the Classic Problems (1 week)**
- Solve cache penetration: implement a Bloom filter or cache null objects
- Solve cache breakdown: implement a mutex lock or logical expiration
- Solve cache avalanche: implement random TTL and cache preheating

**Phase 4: Multi-Level Caching (1–2 weeks)**
- Introduce local caching (Caffeine/Guava)
- Design a local cache + Redis two-tier architecture
- Handle consistency issues across cache tiers

**Phase 5: Production-Grade Practice (ongoing)**
- Design a complete product detail page caching system
- Set up monitoring (cache hit ratio, response time)
- Perform load testing and performance tuning

::: info 💡 Final Words
Caching is the cornerstone of high-concurrency systems. From Taobao's product detail pages to Weibo's trending topics, from WeChat Moments to Douyin's video feeds — every high-performance system has a carefully designed caching architecture behind it.

Understanding caching isn't just about learning a technology — it's about grasping the architectural mindset of **trading space for time and using copies to protect the primary data**. When you truly master caching, your system performance will leap from "barely working" to "good," and ultimately to "excellent."

I hope this article helps you build a complete understanding of caching systems. When you encounter performance problems in real projects, you'll be able to ask yourself: "Can caching solve this?"
:::
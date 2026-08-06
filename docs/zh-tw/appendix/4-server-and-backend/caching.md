# 快取原理與策略
::: tip 🎯 核心問题
**為什么有些網站打開只需 50 毫秒，而有些却要等 5 秒？** 這就像問：為什么從書包拿書只要 1 秒，而要去图書館找書要 10 分鐘？答案就是——緩存。本章将带你深入理解緩存的核心原理、設計模式和實戰技巧，讓你的系统性能提升 100 倍。
:::

---

## 1. 緩存的動機

### 1.1 從"每次都查"到"記住常用數據"的演變

在計算機世界的早期，程序员每次需要數據時都會去硬盘或數據庫查询。這就像你每次做數學题都要翻書查公式，虽然準确，但效率很低。隨着系统規模增大，這種"每次都查"的方式開始暴露出嚴重的問题：數據庫 CPU 飙升到 95%，響應時間從 100 毫秒暴涨到 8 秒，最终整个系统崩溃。

這就像一个學生每天上课都要從宿舍跑到图書館查资料，一天跑 50 次，最後累瘫在半路。解决方案很简單：在書包裡放一本常用公式手册，需要時直接翻書包，不用每次都跑图書館。緩存就是計算機系统的"公式手册"，它把常用數據存儲在快速访問的地方，讓系统不用每次都去"图書館"（數據庫）。

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🐌 没有緩存**
- 每次請求都查數據庫
- 數據庫 CPU 使用率 95%
- 響應時間 5-8 秒
- 系统容易崩溃

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**🚀 有緩存**
- 95% 請求直接返回
- 數據庫 CPU 使用率 < 20%
- 響應時間 50 毫秒
- 系统穩定運行

</div>
</div>

**這就是"緩存"要解决的核心問题：通過存儲常用數據的副本，减少對慢速存儲（數據庫）的访問，讓系统更快、更穩定。**

<CachePerformanceComparisonDemo />

### 1.2 一个案例：為什么緩存是救命稻草

你可能會想："我的系统現在還行，為什么要提前設計緩存？"讓我讲一个真實的故事，你就會明白為什么緩存不是"可選项"，而是"必選项"。

::: warning 阿強的數據庫崩溃記
阿強是一个創業公司的全栈工程师，公司做了一个社交 App。早期用户少（几百人），系统運行正常，阿強觉得没必要搞緩存，直接查數據庫就行。

半年後，用户增長到 10 万人，某天有个明星在 App 上發了一條動態，瞬間涌來 10 万用户访問。結果數據庫直接撑爆了：CPU 100%，響應時間從 100ms 變成 30 秒，最後整个 App 崩溃，用户大量流失。

事後複盘：如果当時有一个简單的緩存層（比如 Redis），把热門動態緩存起來，數據庫压力至少能降低 95%，系统完全能撑住這次流量洪峰。

阿強從此明白了一个道理：**緩存不是錦上添花，而是高并發系统的保命符。不加緩存，就像開車不系安全带——平時没事，出事就晚了。**
:::

::: info 💡 核心启示
緩存的价值不只是"更快"，更重要的是"保護"。它保護數據庫不被压垮，保護系统在高流量下依然穩定運行。当你設計系统時，不要等到出事才想起緩存，要從一開始就把它作為核心架構的一部分。
:::

---

## 2. 核心概念：緩存概述

::: tip 🤔 緩存到底是什么？
简單來說，**緩存就是數據副本的存儲空間**。就像你在書桌前贴了一张便利贴，記着常用電话号碼，這样就不需要每次都翻手機通讯錄。

**三个關鍵點**：
1. **副本**：緩存裡的數據是原始數據（數據庫）的副本，不是主數據
2. **快速访問**：緩存通常在內存中，讀取速度比硬盘快 10 万倍
3. **有限容量**：緩存空間有限，只能存儲最常用的數據

所以，**緩存就是用空間换時間**——牺牲一些內存空間，换取极快的數據访問速度。
:::

在深入具體技術之前，我们需要先搞清楚几个核心概念。為了帮助你理解，我们用一个"學生的書包"來類比緩存系统。

### 2.1 用"書包比喻"理解緩存的核心概念

想象你是一个學生，每天需要查各種资料。這个過程和緩存系统惊人地相似：

| 概念 | 🎒 書包比喻 | 技術含義 | 真實例子 |
|------|-----------|----------|----------|
| **緩存命中 (Cache Hit)** | 你要找的公式正好在便利贴上 | 請求的數據在緩存中找到 | 查询用户信息，Redis 中有，直接返回 |
| **緩存未命中 (Cache Miss)** | 便利贴上没有，得翻書 | 請求的數據不在緩存中 | 查询用户信息，Redis 中没有，需要查數據庫 |
| **命中率 (Hit Ratio)** | 100 次查公式中，有 95 次在便利贴上 | 緩存命中的比例 | 命中率 95%，說明 95% 的請求不用查數據庫 |
| **TTL (Time To Live)** | 便利贴写上"3 天後撕掉" | 緩存的過期時間 | 設置用户信息緩存 30 分鐘後自動失效 |
| **淘汰 (Eviction)** | 書包装满了，把最舊的一张便利贴扔掉 | 緩存满時删除舊數據 | Redis 內存满了，自動删除最少使用的數據 |

### 2.2 緩存命中 vs 緩存未命中

緩存命中和未命中的性能差异是巨大的。讓我们看看具體的數據：

| 操作類型 | 響應時間 | 相對速度 | 適合場景 |
|---------|---------|----------|----------|
| **CPU L1 緩存** | ~0.5 纳秒 | 极快（基準） | CPU 內部運算 |
| **內存讀取** | ~100 纳秒 | 快 200 倍 | 本地緩存（如 Caffeine） |
| **Redis 查询** | ~1 毫秒 | 慢 200 万倍 | 分布式緩存 |
| **MySQL 查询** | ~10 毫秒 | 慢 2000 万倍 | 硬盘數據庫查询 |

::: tip 📊 從表格中你能看到什么？
**性能差距触目惊心**：內存操作比 MySQL 查询快 10 万倍！這就像從書桌拿書（1 秒）和去图書館找書（10 万秒，约 28 小時）的差距。

**三層性能階梯**：
1. **本地緩存（內存）**：最快，但容量小，適合热點數據
2. **Redis 緩存**：中等速度，容量大，適合分布式場景
3. **數據庫**：最慢，但容量无限，是數據的最终來源

**實戰启示**：你的系统應該讓 95% 以上的請求在緩存層就返回，只有不到 5% 的請求需要查數據庫。這样數據庫压力小，系统整體性能就會大幅提升。
:::

::: details 🔍 看看一次"緩存命中"和"緩存未命中"的真實代碼
讓我们用代碼對比這兩種情况：

```javascript
// 場景：查询用户信息

// ===== 緩存命中 (Cache Hit) =====
// 1. 先查 Redis 緩存
const userFromCache = await redis.get('user:123')
if (userFromCache) {
  // 命中！直接返回，耗時约 1 毫秒
  return JSON.parse(userFromCache)
}

// ===== 緩存未命中 (Cache Miss) =====
// 2. 緩存没有，查數據庫
const userFromDB = await db.query('SELECT * FROM users WHERE id = 123')
// 未命中！需要查數據庫，耗時约 10 毫秒，慢了 10 倍

// 3. 查到後写入緩存，下次命中
await redis.set('user:123', JSON.stringify(userFromDB), 'EX', 1800)
return userFromDB
```

**關鍵點**：
- 緩存命中：1 毫秒返回，用户體验极佳
- 緩存未命中：10 毫秒返回，用户體验稍差
- **緩存的价值**：把未命中變成命中，性能提升 10 倍
:::

### 2.3 緩存的生命周期

一个緩存條目從創建到銷毁，會經歷完整的生命周期。理解這个過程對設計緩存系统至關重要。

**四个階段**：

**階段一：写入 (Write)**
- **主動写入**：系统启動時，预先把热點數據加載到緩存（緩存预热）
- **懒加載**：首次访問時從數據庫加載并写入緩存（最常用）

**階段二：命中/未命中 (Hit/Miss)**
- 每次請求都會先查緩存
- 命中则直接返回，未命中则查數據庫

**階段三：過期 (Expiration)**
- **TTL (Time To Live)**：設置緩存存活時間（如 30 分鐘）
- 到期後緩存自動失效，下次访問需要重新加載

**階段四：淘汰 (Eviction)**
- 緩存空間有限，满了之後需要删除舊數據
- 常见淘汰策略：
  - **LRU (Least Recently Used)**：删除最久没有被使用的數據（最常用）
  - **LFU (Least Frequently Used)**：删除访問频率最低的數據
  - **FIFO (First In First Out)**：删除最早写入的數據

👇 **動手看看**：
下面這个演示展示了緩存的生命周期。點擊"新增緩存"，观察緩存如何經歷写入、命中、過期、淘汰的全過程：

<CacheLifecycleDemo />

---

## 3. 緩存的演進之路：從單機到分布式

::: tip 🤔 為什么需要不同類型的緩存？
就像你學習時會在不同地方放资料：書桌上放最常用的（便利贴），書包裡放常用的（笔記本），图書館放所有资料（書庫）。

**緩存系统也一样**：
- **本地緩存（書桌）**：最快，容量小，放超级热點數據
- **分布式緩存（公共儲物柜）**：較快，容量大，放常用數據
- **數據庫（图書館）**：最慢，容量无限，放所有數據

**為什么要分層？** 因為不同層次的性能和成本不同，合理組合才能達到最優效果。
:::

讲了這么多概念，讓我们看一个真實的案例：某電商系统是如何從"没有緩存"一步步進化到"多级緩存架構"的。通過這个案例，你會更直观地理解緩存設計的重要性。

### 3.1 階段一：无緩存時代——數據庫裸奔

**背景**：早期系统用户少（几百人），所有請求直接查數據庫，没有任何緩存層。

**技術栈**：
- 數據庫：MySQL
- 无緩存：没有 Redis，没有本地緩存

**系统架構**：
```
用户請求 → 應用服務器 → MySQL 數據庫
```

**這个階段的特點**：
- ✅ **優點**：架構简單，開發快速
- ❌ **缺點**：數據庫压力大，性能差，用户量上千就崩

::: details 查看当時的代碼和遇到的問题
**代碼示例**（每次都查數據庫）：

```javascript
// 獲取商品詳情——每次都查數據庫
async function getProduct(productId) {
  // 直接查數據庫，没有任何緩存
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )
  return product
}
```

**遇到的問题**：
1. **數據庫 CPU 飙升**：每次請求都查數據庫，CPU 使用率 80%+
2. **響應慢**：複雜查询要 50-100 毫秒，用户體验差
3. **并發能力差**：數據庫 QPS（每秒查询數）上限只有 2000，再多就崩溃
4. **热點商品問题**：热門商品詳情頁被频繁查询，數據庫成為瓶颈

**当時的臨時解决方案**：
- 買更贵的服務器（加 CPU、內存）——成本高，效果有限
- 數據庫讀写分離 —— 能緩解讀压力，但写压力依然存在
- SQL 優化 —— 能提升 20-30%，但无法解决根本問题
:::

這種"裸奔"模式在用户量 < 1000 時還能應付，但隨着用户增長到 1 万、10 万，數據庫開始频繁崩溃，团队迫切需要引入緩存。

### 3.2 階段二：引入 Redis 緩存——性能提升 10 倍

**背景**：用户增長到 1 万人，數據庫撑不住了，团队决定引入 Redis 作為緩存層。

**技術栈**：
- 數據庫：MySQL
- 緩存：Redis（單機版）

**系统架構**：
```
用户請求 → 應用服務器 → Redis 緩存（未命中才查） → MySQL 數據庫
```

**這个階段的特點**：
- ✅ **優點**：性能提升 10 倍，數據庫压力降低 90%
- ❌ **缺點**：Redis 單點故障，緩存和數據庫可能不一致

::: details 查看 Redis 緩存的實現代碼
**代碼示例**（增加 Redis 緩存）：

```javascript
// 獲取商品詳情——先查 Redis，没有再查數據庫
async function getProduct(productId) {
  // 1. 先查 Redis 緩存
  const cacheKey = `product:${productId}`
  const cached = await redis.get(cacheKey)

  if (cached) {
    // 緩存命中！直接返回，约 1 毫秒
    return JSON.parse(cached)
  }

  // 2. 緩存未命中，查數據庫
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. 查到後写入 Redis，設置 30 分鐘過期
  await redis.setex(
    cacheKey,
    1800,  // 30 分鐘 = 1800 秒
    JSON.stringify(product)
  )

  return product
}
```

**性能提升對比**：

| 場景 | 无緩存 | 有 Redis 緩存 | 提升倍數 |
|------|-------|--------------|---------|
| 普通商品查询 | 50ms | 5ms（緩存命中時） | **10 倍** |
| 热門商品查询 | 80ms | 1ms（命中率 95%） | **80 倍** |
| 數據庫 QPS | 2000（满載） | 200（緩存拦截 90%） | **數據庫压力降低 10 倍** |
| 系统最大并發 | 2000 用户 | 20000 用户 | **10 倍** |

**带來的改善**：
1. **響應速度**：緩存命中時，響應時間從 50ms 降到 1-5ms
2. **并發能力**：系统能支撑的用户量從 2000 提升到 20000
3. **數據庫压力**：90% 的請求被 Redis 拦截，數據庫 CPU 從 80% 降到 20%
4. **用户體验**：頁面加載速度明顯提升，用户投诉减少

**新的挑戰**：
1. **緩存一致性問题**：商品价格變了，數據庫更新了，但緩存還是舊的
2. **緩存穿透**：有人恶意查询不存在的商品 ID（如 id=-1），每次都穿透到數據庫
3. **緩存雪崩**：系统重启後，所有緩存同時失效，瞬間大量請求打到數據庫
4. **Redis 單點故障**：Redis 宕機，所有請求直接打到數據庫，系统可能崩溃

**解决方案**：
- **緩存一致性**：更新數據庫時，同步删除緩存
- **緩存穿透**：對不存在的數據也在 Redis 中緩存（value 為空，TTL 設置短一些，如 5 分鐘）
- **緩存雪崩**：给緩存過期時間加隨機值，避免同時失效
:::

引入 Redis 後，系统性能大幅提升，但新問题也隨之而來。团队開始研究如何解决這些緩存相關問题。

### 3.3 階段三：多级緩存架構——性能再提升 5 倍

**背景**：用户增長到 10 万人，即使是 Redis 緩存也開始成為瓶颈（單機 Redis QPS 上限约 10 万），团队决定引入多级緩存。

**技術栈**：
- L1 緩存：應用本地緩存（Caffeine）
- L2 緩存：Redis 集群
- 數據庫：MySQL 主從集群

**系统架構**：
```
用户請求 → CDN 緩存（静態资源） → 應用服務器
                                        ↓
                          L1: 本地緩存（Caffeine） → 未命中 → L2: Redis → 未命中 → MySQL
```

**這个階段的特點**：
- ✅ **優點**：极致性能（本地緩存只需 0.1 毫秒），高可用（Redis 宕機不影響热點數據）
- ❌ **缺點**：架構複雜，多级緩存的一致性難以保證

::: details 查看多级緩存的實現代碼
**代碼示例**（本地緩存 + Redis 兩级緩存）：

```javascript
// 使用 Caffeine 本地緩存
const caffeine = require('caffeine')
const localCache = new caffeine.Cache({
  max: 1000,              // 最多緩存 1000 條
  ttl: 30,                // 30 秒過期
})

// 獲取商品詳情——兩级緩存
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: 先查本地緩存（最快，约 0.1 毫秒）
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 命中')
    return localCached
  }

  // L2: 本地緩存未命中，查 Redis（較快，约 1 毫秒）
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 命中，回填 L1')
    const product = JSON.parse(redisCached)
    // 回填本地緩存
    localCache.set(cacheKey, product)
    return product
  }

  // L3: Redis 也未命中，查數據庫（最慢，约 10 毫秒）
  console.log('L3 命中，回填 L2 和 L1')
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 回填 Redis（30 分鐘過期）
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  // 回填本地緩存
  localCache.set(cacheKey, product)

  return product
}
```

**多级緩存性能對比**：

| 緩存層级 | 響應時間 | 命中率 | 適合存儲的數據 |
|---------|---------|--------|--------------|
| **L1: 本地緩存** | ~0.1 毫秒 | 70%（超级热點） | 热門商品、系统配置、用户會话 |
| **L2: Redis 緩存** | ~1 毫秒 | 25%（一般热點） | 大部分商品數據、評论聚合 |
| **L3: 數據庫** | ~10 毫秒 | 5%（冷數據） | 所有商品的全量數據 |

**整體性能提升**：
- **平均響應時間**：5ms（階段二） → 1ms（階段三），**再提升 5 倍**
- **系统最大并發**：2 万用户（階段二） → 10 万用户（階段三），**提升 5 倍**
- **數據庫 QPS**：200（階段二） → 50（階段三），**再降低 4 倍**

**這个階段解决的新問题**：
1. **本地緩存一致性**：多个應用實例的本地緩存可能不一致（A 實例緩存了舊价格，B 實例是新价格）
   - **解决**：本地緩存 TTL 設置短一些（30 秒），讓不一致的時間窗口變小
2. **緩存预热**：系统重启後，本地緩存是空的，大量請求會穿透到 Redis
   - **解决**：系统启動時，主動加載热點數據到本地緩存
:::

多级緩存架構在大型互聯網公司（如淘宝、京東）广泛應用，它能支撑百万级 QPS 的访問。

### 3.4 緩存架構演進全景图

| 階段 | 架構 | 響應時間 | 最大并發 | 核心變化 |
|------|------|---------|---------|---------|
| **階段一：无緩存** | 應用 → 數據庫 | 50ms | 2000 用户 | 數據庫裸奔，性能差 |
| **階段二：單级緩存** | 應用 → Redis → 數據庫 | 5ms | 20000 用户 | 引入 Redis，性能提升 10 倍 |
| **階段三：多级緩存** | 應用 → 本地緩存 → Redis → 數據庫 | 1ms | 100000 用户 | 本地緩存 + Redis，性能再提升 5 倍 |

::: tip 📊 從表格中你能看到什么？
**階段一 → 階段二**：质的飛躍。引入 Redis 後，性能提升 10 倍，數據庫压力降低 90%。這是從"能用"到"够用"的關鍵一步。

**階段二 → 階段三**：极致優化。引入本地緩存後，性能再提升 5 倍。這是從"够用"到"极致"的進階，適合超大流量場景。

**實戰建议**：
- **用户量 < 1 万**：階段一（无緩存）够用，但建议引入 Redis（階段二）
- **用户量 1-10 万**：階段二（Redis 緩存）是最佳選择
- **用户量 > 10 万**：考虑階段三（多级緩存），但要注意一致性複雜度

**總結一下**：緩存架構演進不只是"加更多緩存層"，而是**根據流量規模選择合適的架構**——過度設計會增加複雜度，設計不足會導致性能瓶颈。
:::

---

## 4. 緩存的三大經典問题：穿透、擊穿、雪崩

在實戰中，緩存會引入三類經典問题。如果不了解它们，你的系统可能在某个時刻突然崩溃。讓我们用生活化的比喻來理解這些問题。

### 4.1 緩存穿透：查询不存在數據

**問题定義**：查询一个**不存在的數據**（如 id=-1），緩存中没有（因為没有存過），數據庫中也没有，導致每次請求都直接穿透到數據庫。

::: tip 🤔 用"查書"比喻緩存穿透
想象你在图書館查一本書，你問管理员："有没有《不存在之書》？"

**正常流程**：
- 管理员查目錄："没有這本書"
- 你離開

**緩存穿透場景**：
- 你第 1 次來問，管理员查數據庫："没有"，告诉你
- 你第 2 次來問，管理员又查一遍數據庫："没有"
- 你第 100 次來問，管理员還是查數據庫："没有"

**問题**：管理员（數據庫）被烦死了，每次都要查數據庫，即使答案永遠是"没有"。

**解决**：管理员記住"《不存在之書》不存在"，下次你問，直接說"没有"，不用查數據庫。這就是**緩存空對象**。
:::

**真實場景**：
- 恶意攻擊者構造大量不存在的 ID 進行查询（如 id=-1, id=999999999）
- 爬虫遍歷不存在的资源路径（如 /api/products/invalid-id）
- 業務邏輯錯误導致查询无效數據

**解决方案 1：緩存空對象**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. 先查緩存
  const cached = await redis.get(cacheKey)
  if (cached !== null) {
    // 注意：cached 可能是字符串 "null"
    if (cached === 'null') {
      // 緩存的是"空對象"，說明數據庫中没有這个數據
      return null
    }
    return JSON.parse(cached)
  }

  // 2. 查數據庫
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 3. 即使數據庫没有，也緩存"null"，TTL 設置短一些（如 5 分鐘）
  if (!product) {
    await redis.setex(cacheKey, 300, 'null')
    return null
  }

  // 4. 查到數據，正常緩存
  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

**解决方案 2：布隆過滤器 (Bloom Filter)**

布隆過滤器是一个"快速判断數據是否存在"的工具，它像一个"超级索引"：

::: tip 📖 布隆過滤器是什么？
想象你有一个"神奇的黑盒"：
- 你問它："ID 為 123 的商品存在吗？"
- 它說："**肯定不存在**" → 那就真不存在，不用查數據庫
- 它說："**可能存在**" → 那就去查數據庫确認

**特點**：
- **绝對不會漏判**：如果它說不存在，那就真不存在
- **可能误判**：如果它說可能存在，有可能實际不存在（概率很低，可調）

**价值**：布隆過滤器能在查緩存之前，就把 99% 的"不存在"請求拦截掉，保護數據庫。
:::

```javascript
// 使用布隆過滤器
const { BloomFilter } = require('bloom-filters')

// 初始化布隆過滤器（假設最多有 100 万个商品 ID）
const bloomFilter = new BloomFilter(1000000, 0.01)  // 误判率 1%

// 系统启動時，把所有商品 ID 加入布隆過滤器
async function initBloomFilter() {
  const allIds = await db.query('SELECT id FROM products')
  allIds.forEach(row => {
    bloomFilter.add(row.id)
  })
}

// 查询商品前，先用布隆過滤器判断
async function getProduct(productId) {
  // 1. 先用布隆過滤器判断
  if (!bloomFilter.has(productId)) {
    // 肯定不存在，直接返回 null，不用查數據庫
    console.log('布隆過滤器拦截：商品不存在')
    return null
  }

  // 2. 布隆過滤器說"可能存在"，查緩存
  const cached = await redis.get(`product:${productId}`)
  if (cached) {
    return JSON.parse(cached)
  }

  // 3. 緩存未命中，查數據庫
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  if (!product) {
    // 布隆過滤器误判（概率很低），實际不存在
    await redis.setex(`product:${productId}`, 300, 'null')
    return null
  }

  // 4. 查到數據，写入緩存
  await redis.setex(`product:${productId}`, 1800, JSON.stringify(product))
  return product
}
```

### 4.2 緩存擊穿：热點數據過期

**問题定義**：某个**热點數據**（如热門商品、热搜新聞）在緩存中過期（TTL 到期），此時大量并發請求同時到達，都去查询數據庫，導致數據庫压力骤增。

::: tip 🤔 用"抢書"比喻緩存擊穿
想象图書館有本《哈利波特》，超热門，100 个人都想借。

**正常情况**：
- 图書館把《哈利波特》放在"借阅台"（緩存）
- 大家直接從借阅台拿，不用去書架找

**緩存擊穿場景**：
- 借阅台的《哈利波特》到期了（被還回書架）
- 100 个人同時來借，發現借阅台没有
- 100 个人都衝去書架找（數據庫）
- 書架管理员（數據庫）被挤爆了

**問题**：不是"不存在的書"，而是"超热門的書"突然從緩存消失了，導致瞬間大量請求打到數據庫。
:::

**真實場景**：
- 微博热搜榜過期瞬間，几万人同時访問
- 明星八卦新聞緩存失效，粉絲疯狂访問
- 秒殺活動開始時的庫存數據過期

**解决方案 1：互斥鎖 (Mutex Lock)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. 先查緩存
  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 2. 緩存未命中，獲取分布式鎖
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)  // 鎖 10 秒

  if (lock === 'OK') {
    // 3. 獲取到鎖，查數據庫
    console.log('獲取鎖成功，查询數據庫')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    // 4. 写入緩存
    await redis.setex(cacheKey, 1800, JSON.stringify(product))

    // 5. 釋放鎖
    await redis.del(lockKey)
    return product
  } else {
    // 6. 没獲取到鎖，等待 50ms 後重試
    console.log('獲取鎖失敗，等待後重試')
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)  // 遞归重試
  }
}
```

**解决方案 2：邏輯過期 (Logical Expiration)**

```javascript
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // 1. 查緩存
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = JSON.parse(cached)

    // 2. 檢查邏輯過期時間
    if (Date.now() < data.expireTime) {
      // 未過期，直接返回
      return data.product
    } else {
      // 3. 邏輯過期，异步重建緩存，同時返回舊數據
      console.log('邏輯過期，异步重建緩存')
      rebuildCacheAsync(productId)  // 异步重建
      return data.product  // 返回舊數據
    }
  }

  // 4. 緩存不存在（首次加載），同步查數據庫
  const product = await db.query(
    'SELECT * FROM products WHERE id = ?',
    [productId]
  )

  // 5. 写入緩存（包含邏輯過期時間）
  const cacheData = {
    product: product,
    expireTime: Date.now() + 30 * 60 * 1000  // 30 分鐘後邏輯過期
  }
  await redis.set(cacheKey, JSON.stringify(cacheData))

  return product
}

// 异步重建緩存
async function rebuildCacheAsync(productId) {
  const lockKey = `rebuild:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('异步重建緩存開始')
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
    console.log('异步重建緩存完成')
  }
}
```

### 4.3 緩存雪崩：大量數據同時過期

**問题定義**：大量緩存數據在**同一時間點集中過期**（或 Redis 宕機），導致所有請求同時穿透到數據庫，瞬間压垮數據庫。

::: tip 🤔 用"图書館批量還書"比喻緩存雪崩
想象图書館的"借阅台"（緩存）有 1000 本書。

**正常情况**：
- 這些書的還書時間是分散的：有的今天還，有的明天還，有的後天還
- 每天只有几十本書到期，管理员（數據庫）能輕松處理

**緩存雪崩場景**：
- 系统重启後，管理员把 1000 本書都設置"30 天後到期"
- 30 天後，這 1000 本書同時到期
- 1000 个人同時來借書，發現借阅台没有
- 1000 个人都衝去書架找
- 書架管理员（數據庫）瞬間被挤爆

**問题**：不是一本書的問题，而是**大量數據同時過期**，導致數據庫瞬間压力暴增。
:::

**真實場景**：
- 系统重启後，所有緩存從 0 開始重建，同時設置相同 TTL（如 30 分鐘）
- 定時任務批量刷新緩存，設置相同的過期時間
- 緩存服務（Redis）宕機或網絡分區

**解决方案 1：隨機 TTL**

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

  // 關鍵：在基础 TTL（30 分鐘）上加隨機值（±5 分鐘）
  const baseTTL = 1800  // 30 分鐘
  const randomOffset = Math.floor(Math.random() * 600) - 300  // -5 到 +5 分鐘
  const finalTTL = baseTTL + randomOffset

  console.log(`緩存 TTL: ${finalTTL} 秒（${Math.floor(finalTTL / 60)} 分鐘）`)
  await redis.setex(cacheKey, finalTTL, JSON.stringify(product))

  return product
}
```

**解决方案 2：緩存预热 (Cache Preheating)**

```javascript
// 系统启動時，主動加載热點數據到緩存
async function cacheWarmup() {
  console.log('開始緩存预热...')

  // 1. 查询最热門的 1000 个商品（根據访問量排序）
  const hotProducts = await db.query(`
    SELECT * FROM products
    ORDER BY view_count DESC
    LIMIT 1000
  `)

  // 2. 批量写入 Redis
  for (const product of hotProducts) {
    const cacheKey = `product:${product.id}`
    const ttl = 1800 + Math.floor(Math.random() * 600)  // 30 分鐘 ± 5 分鐘
    await redis.setex(cacheKey, ttl, JSON.stringify(product))
  }

  console.log(`緩存预热完成，已加載 ${hotProducts.length} 个热門商品`)
}

// 應用启動時執行
cacheWarmup()
```

**解决方案 3：熔断降级 (Circuit Breaker)**

```javascript
// 使用熔断器保護數據庫
const CircuitBreaker = require('opossum')

// 設置熔断器
const dbQueryBreaker = new CircuitBreaker(
  async (productId) => {
    return await db.query('SELECT * FROM products WHERE id = ?', [productId])
  },
  {
    timeout: 3000,  // 3 秒超時
    errorThresholdPercentage: 50,  // 錯误率超過 50% 時熔断
    resetTimeout: 30000  // 30 秒後尝試恢複
  }
)

// 熔断後的降级處理
dbQueryBreaker.fallback(() => {
  console.log('數據庫熔断，返回降级數據')
  return {
    id: productId,
    name: '服務繁忙，請稍後重試',
    status: 'degraded'
  }
})

async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  const cached = await redis.get(cacheKey)
  if (cached) {
    return JSON.parse(cached)
  }

  // 通過熔断器查數據庫
  const product = await dbQueryBreaker.fire(productId)

  if (product.status === 'degraded') {
    return product  // 返回降级數據
  }

  await redis.setex(cacheKey, 1800, JSON.stringify(product))
  return product
}
```

👇 **動手看看**：
下面這个演示對比了緩存穿透、擊穿、雪崩三種問题的場景和解决方案：

<CacheProblemsDemo />

---

## 5. 緩存一致性策略：緩存與數據庫的同步策略

緩存的本质是數據的副本，副本和原始數據（數據庫）之間必然存在不一致的時間窗口。如何控制這个時間窗口，是緩存設計的核心挑戰。

### 5.1 緩存與數據庫不一致的成因

::: tip 🤔 用"便利贴和書"比喻不一致
想象你在便利贴上記着："小明電话：123456"，這是你通讯錄（數據庫）的副本。

**不一致的場景**：
- 你更新通讯錄，把小明電话改成 "7654321"
- 但你忘記更新便利贴
- 下次你查電话，看便利贴，還是舊的 "123456"

**問题**：便利贴（緩存）和通讯錄（數據庫）不一致了。

**原因**：更新了原始數據，但没有同步更新副本。在計算機系统中，這是因為"更新數據庫"和"更新緩存"是兩个独立的操作，中間有時間窗口，可能被其他操作打亂。
:::

**真實的并發場景**：

| 時間 | 线程 A（更新用户年齡） | 线程 B（查询用户） | 數據庫 | 緩存 |
|------|---------------------|------------------|--------|------|
| T1 | 開始更新數據庫 | - | age=20 | age=20 |
| T2 | 數據庫更新為 age=25 | 查询緩存，命中 age=20 | age=25 | age=20 ❌ |
| T3 | 删除緩存 | - | age=25 | - |
| T4 | - | - | age=25 | 從 DB 加載 age=25 ✅ |

**問题**：在 T2 時刻，线程 B 讀到了緩存中的舊值 20，而數據庫已經是 25。這就是**緩存不一致**。

### 5.2 最佳實踐：先更新數據庫，再删除緩存

::: tip 🤔 為什么是"删除"而不是"更新"緩存？
你可能會想：為什么不直接"更新緩存"，而是"删除緩存"？

**更新緩存的問题**：
- 并發更新時，可能出現 A 线程先更新緩存，B 线程後更新數據庫但緩存没更新
- 更新緩存的成本可能很高（比如需要聚合多个表的數據）
- 如果更新後數據又被删除了，白費力气

**删除緩存的優勢**：
- 下次查询時自動從數據庫加載最新數據（懒加載）
- 避免并發更新導致的脏數據
- 简單可靠，是業界最佳實踐
:::

**標準流程**：

```javascript
// 更新商品信息
async function updateProduct(productId, updateData) {
  // 1. 先更新數據庫
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. 再删除緩存（不是更新緩存！）
  await redis.del(`product:${productId}`)

  // 3. 下次查询時，緩存未命中，自動從數據庫加載最新數據
  console.log('更新完成，緩存已删除')
}
```

::: details 查看為什么"先更新 DB，再删緩存"是最優方案
對比三種更新策略：

**策略 1：先更新緩存，再更新數據庫** ❌ 不推荐
```javascript
// 問题：如果更新數據庫失敗，緩存是新值，數據庫是舊值，不一致
await redis.set('product:1', newProduct)  // 緩存更新成功
await db.query('UPDATE products SET ...')  // 數據庫更新失敗！
// 結果：緩存是新值，數據庫是舊值，永久不一致！
```

**策略 2：先删除緩存，再更新數據庫** ❌ 不推荐
```javascript
// 問题：删除和更新之間，有其他线程查询，會加載舊數據到緩存
await redis.del('product:1')  // 緩存删除
// 此時线程 B 來查询，發現緩存没有，查數據庫（還是舊值），写入緩存
await db.query('UPDATE products SET ...')  // 更新數據庫
// 結果：緩存是舊值，數據庫是新值，不一致！
```

**策略 3：先更新數據庫，再删除緩存** ✅ 推荐
```javascript
// 優點：數據庫更新時加行鎖，其他线程必须等待，避免脏數據
await db.query('UPDATE products SET ...')  // 更新數據庫（加行鎖）
await redis.del('product:1')  // 删除緩存
// 即使删除緩存失敗，只是下次查询會回源，不會導致脏數據長期存在
```

**為什么策略 3 最優？**
1. **數據庫鎖保護**：更新操作會獲取行鎖，其他讀写操作必须等待
2. **删除失敗影響小**：即使删除緩存失敗，只是下次讀取會回源，不會導致脏數據
3. **简單可靠**：不需要额外的複雜邏輯
:::

### 5.3 延遲雙删：极端場景的一致性保障

**場景**：在高并發場景下，即使是"先更新 DB，再删緩存"，仍有极小概率出現不一致。延遲雙删通過兩次删除，最大限度保證一致性。

**流程**：
```
1. 删除緩存
2. 更新數據庫
3. 等待一段時間（如 500ms）
4. 再次删除緩存
```

```javascript
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. 第一次删除緩存
  await redis.del(cacheKey)

  // 2. 更新數據庫
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 3. 等待 500ms（讓其他线程的查询完成）
  await new Promise(resolve => setTimeout(resolve, 500))

  // 4. 第二次删除緩存（删除可能被其他线程加載的舊數據）
  await redis.del(cacheKey)

  console.log('延遲雙删完成，數據已同步')
}
```

**三種一致性策略對比**：

| 策略 | 一致性级別 | 性能影響 | 複雜度 | 適用場景 |
|------|-----------|---------|--------|---------|
| **先更新 DB，再删緩存** | 最终一致（不一致窗口 < 100ms） | 低 | 低 | 大多數場景，推荐作為默認方案 |
| **延遲雙删** | 強最终一致（不一致窗口 < 10ms） | 中（延遲 500ms） | 中 | 對一致性要求較高的場景（如金融、庫存） |
| **先删緩存，再更新 DB** | 弱（不一致窗口大） | 低 | 低 | ❌ 不推荐，易出現不一致 |

👇 **動手看看**：
下面這个演示對比了三種一致性策略的效果。點擊"更新數據"，观察緩存和數據庫的一致性變化：

<CacheConsistencyDemo />

---

## 6. 實戰：構建一个完整的緩存系统

讲了這么多原理，讓我们看一个真實案例：如何為一个電商商品詳情頁設計完整的緩存系统。

### 6.1 業務場景分析

**需求**：用户访問商品詳情頁，需要展示商品基础信息、价格、庫存、評价等數據。

**特點**：
- **讀多写少**：100 次查询，1 次更新（讀写比 100:1）
- **热點集中**：20% 的商品贡献 80% 的流量
- **數據複雜**：商品基础信息 + 价格 + 庫存 + 評价聚合
- **一致性要求**：价格、庫存強一致，其他可最终一致

**性能指標**：
- P99 響應時間 < 100ms（99% 的請求在 100ms 內返回）
- 數據庫 QPS 峰值 < 5000
- 緩存命中率 > 95%

### 6.2 架構設計

**多级緩存架構**：

```
用户請求
  ↓
CDN 緩存（静態资源：图片、CSS、JS）
  ↓ 未命中
Nginx 本地緩存（商品基础信息聚合）
  ↓ 未命中
應用服務器
  ↓
  ├─ L1: 本地緩存（Caffeine，热點商品）
  │   ↓ 未命中
  ├─ L2: Redis 緩存（所有商品數據）
  │   ↓ 未命中
  └─ L3: MySQL 數據庫（全量數據）
```

### 6.3 核心代碼實現

**完整的多级緩存實現（简化版）**：

```javascript
const caffeine = require('caffeine')

// L1: 本地緩存（30 秒過期）
const localCache = new caffeine.Cache({
  max: 1000,
  ttl: 30,
})

// 獲取商品詳情（多级緩存）
async function getProduct(productId) {
  const cacheKey = `product:${productId}`

  // L1: 本地緩存（约 0.1 毫秒）
  const localCached = localCache.get(cacheKey)
  if (localCached) {
    console.log('L1 命中')
    return localCached
  }

  // L2: Redis 緩存（约 1 毫秒）
  const redisCached = await redis.get(cacheKey)
  if (redisCached) {
    console.log('L2 命中，回填 L1')
    const product = JSON.parse(redisCached)
    localCache.set(cacheKey, product)
    return product
  }

  // L3: 數據庫（约 10 毫秒，带分布式鎖防擊穿）
  const lockKey = `lock:${productId}`
  const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10)

  if (lock === 'OK') {
    console.log('L3 命中，查询數據庫')
    const product = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [productId]
    )

    if (product) {
      // 写入 Redis（30 分鐘 + 隨機 TTL）
      const ttl = 1800 + Math.floor(Math.random() * 600) - 300
      await redis.setex(cacheKey, ttl, JSON.stringify(product))
      // 回填本地緩存
      localCache.set(cacheKey, product)
    }

    await redis.del(lockKey)
    return product
  } else {
    // 獲取鎖失敗，等待後重試
    await new Promise(resolve => setTimeout(resolve, 50))
    return getProduct(productId)
  }
}

// 更新商品信息（先更新 DB，再删除緩存）
async function updateProduct(productId, updateData) {
  const cacheKey = `product:${productId}`

  // 1. 更新數據庫
  await db.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [updateData.name, updateData.price, productId]
  )

  // 2. 删除本地緩存
  localCache.del(cacheKey)

  // 3. 删除 Redis 緩存
  await redis.del(cacheKey)

  console.log('更新完成，緩存已删除')
}
```

👇 **動手看看**：
下面這个演示展示了多级緩存系统的完整工作流程。點擊"查询商品"，观察請求如何在各级緩存中流轉：

<EcommerceCacheArchitectureDemo />

---

## 7. 總結與學習路径

### 7.1 核心知識點回顧

| 知識點 | 一句话解釋 | 解决的問题 | 實戰要點 |
|--------|-----------|-----------|----------|
| **緩存命中** | 數據在緩存中找到 | 性能提升 10-100 倍 | 命中率目標 > 95% |
| **緩存穿透** | 查询不存在數據，每次都查數據庫 | 數據庫被恶意查询拖垮 | 布隆過滤器 + 緩存空對象 |
| **緩存擊穿** | 热點數據過期，大量請求打到數據庫 | 數據庫瞬間压力暴增 | 互斥鎖 + 邏輯過期 |
| **緩存雪崩** | 大量數據同時過期 | 數據庫被压垮 | 隨機 TTL + 緩存预热 |
| **多级緩存** | 本地緩存 + Redis + 數據庫 | 性能极致優化 | L1 本地緩存命中率 70%，L2 Redis 命中率 25% |
| **緩存一致性** | 緩存和數據庫同步 | 數據準确性 | 先更新 DB，再删除緩存 |
| **延遲雙删** | 更新前後各删除一次緩存 | 极端場景的一致性 | 等待 500ms 後再删除 |

### 7.2 學習路径建议

**階段 1：理解原理（1-2 天）**
- 掌握緩存的本质（數據副本，用空間换時間）
- 理解緩存命中率、TTL、淘汰等核心概念
- 了解不同存儲介质的性能差异（內存 vs 硬盘）

**階段 2：掌握基础（2-3 天）**
- 學會使用 Redis 做緩存（SET、GET、SETEX 命令）
- 實現简單的緩存讀写邏輯（先查緩存，未命中再查數據庫）
- 理解為什么"更新時删除緩存而不是更新緩存"

**階段 3：解决經典問题（1 周）**
- 解决緩存穿透：實現布隆過滤器或緩存空對象
- 解决緩存擊穿：實現互斥鎖或邏輯過期
- 解决緩存雪崩：實現隨機 TTL 和緩存预热

**階段 4：多级緩存（1-2 周）**
- 引入本地緩存（Caffeine/Guava）
- 設計本地緩存 + Redis 的兩级架構
- 處理多级緩存的一致性問题

**階段 5：生產级實戰（持續）**
- 設計完整的商品詳情頁緩存系统
- 搭建監控（緩存命中率、響應時間）
- 進行压測验證和性能調優

::: info 💡 写在最後
緩存是高并發系统的基石。從淘宝的商品詳情頁到微博的热搜榜，從微信的朋友圈到抖音的视频流，所有高性能系统背後都有一套精心設計的緩存架構。

理解緩存，不只是學會一个技術，更是理解**用空間换時間、用副本保護主數據**的架構思想。当你真正掌握緩存，你的系统性能将從"能用"跨越到"好用"，最终達到"极致"。

希望這篇文章能帮助你建立起對緩存系统的完整認知。当你在實际项目中遇到性能問题時，能够想到："是否可以用緩存來解决？"
:::

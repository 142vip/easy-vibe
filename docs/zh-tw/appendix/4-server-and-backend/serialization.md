# 序列化：資料的編碼翻譯

::: tip 🎯 核心問题
**數據如何在網絡上傳輸？** 這就像問：一个人說的话，如何讓另一个人听懂？序列化解决的就是"數據翻译"的問题——把內存中的對象翻译成可以傳輸的格式。
:::

---

## 序列化數據的必要性

在前後端交互過程中，數據需要經歷多次"變形"才能從服務器傳遞到客户端。

**場景一：前端收到的數據"變了"**

```javascript
// 後端發送
Date birth = new Date(1990, 5, 15)

// 前端收到
{ "birth": "1990-06-15T00:00:00Z" }  // 字符串！
```

前端想用 `.getFullYear()`，結果报錯了——因為這不是 Date 對象，是字符串。

**場景二：中文亂碼**

```json
// 期望
{ "name": "张三" }

// 實际收到
{ "name": "å¼ ä¸" }
```

字符編碼問题導致中文變成亂碼。

**場景三：性能瓶颈**

```json
// 一个包含 10000 條商品列表的響應
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 more
  ]
}
// 大小：5.2 MB，傳輸時間：3.5 秒
```

JSON 格式的冗餘導致數據包太大，嚴重影響性能。

---

**序列化就像"翻译"**——把內存對象"翻译"成可以傳輸的格式，接收方再"翻译"回去。

---

## 1. 序列化/反序列化概述

**序列化**（Serialization）就是把對象轉换成可傳輸格式的過程。

**反序列化**（Deserialization）就是把傳輸格式還原成對象的過程。

### 1.1 用寄快遞來類比

| 寄快遞 | 序列化 | 說明 |
| :--- | :--- | :--- |
| 打包物品 | 序列化 | 把物品装箱，贴上標簽 |
| 運輸 | 網絡傳輸 | 快遞車運送到目的地 |
| 拆包取物 | 反序列化 | 收件人打開箱子，取出物品 |

### 1.2 為什麼的動機需要序列化

| 原因 | 說明 | 示例 |
| :--- | :--- | :--- |
| **網絡傳輸** | 網絡只能傳輸字節流 | API 調用、RPC 通信 |
| **持久化存儲** | 磁盘只能存儲字節 | 保存對象到文件、數據庫 |
| **跨語言** | 不同語言的數據結構不同 | Java 對象 → Python 字典 |
| **分布式緩存** | Redis/Memcached 存儲字節 | 緩存用户信息 |

---

## 2. 常见的序列化格式

👇 **動手試試看**：點擊下方按钮，观察不同語言的序列化過程：

<SerializationDemo />

### 2.1 JSON：最通用

**優點**：
- 可讀性好，調試方便
- 所有語言都支持
- 浏览器原生支持（`JSON.parse` / `JSON.stringify`）

**缺點**：
- 體积大（有大量 `{}` `""` 標記）
- 不支持豐富的數據類型（Date、Map、Set 會被轉换成字符串）

**適用場景**：
- 公開 API
- 前後端通信
- 配置文件

### 2.2 XML：曾經的主流

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>张三</name>
  <email>zhangsan@example.com</email>
  <age>28</age>
</user>
```

**優點**：
- 結構清晰，支持注釋
- 支持複雜的嵌套結構
- 有 Schema 验證（XSD）

**缺點**：
- 體积大，解析慢
- 標簽冗餘（`<open></close>`）

**適用場景**：
- 配置文件（Spring、MyBatis）
- SOAP 協议
- 複雜數據交换

### 2.3 Protobuf：最高效

```protobuf
// user.proto
syntax = "proto3";
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

**優點**：
- 體积小（比 JSON 小 30-50%）
- 速度快（解析速度快 5-10 倍）
- 向後兼容（新增字段不影響老版本）

**缺點**：
- 不可讀（二進制格式）
- 需要 .proto 文件定義
- 不支持動態類型

**適用場景**：
- 微服務內部通信
- 高性能場景（游戏、實時通信）
- 移動端 App（節省流量）

### 2.4 MessagePack：兼顧可讀性和性能

```json
// MessagePack 是 JSON 的二進制版本
// 相同數據，MessagePack 比 JSON 小 30% 左右
```

**優點**：
- 比 JSON 小，比 JSON 快
- 保持 JSON 的數據模型
- 支持所有 JSON 類型

**缺點**：
- 不可讀
- 不如 Protobuf 高效

**適用場景**：
- 需要性能但不想用 Protobuf
- Redis 緩存
- WebSocket 消息

---

## 3. 各語言序列化方式對比

| 語言 | JSON 庫 | Protobuf 庫 | XML 庫 |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip 💡 選择建议
- **前後端通信**：JSON（調試方便）
- **微服務內部**：Protobuf（性能最優）
- **配置文件**：JSON 或 YAML
- **舊系统對接**：XML（可能別无選择）
:::

---

## 4. 性能對比

### 4.1 大小對比（以用户對象為例）

| 格式 | 大小 | 相對 JSON |
| :--- | :--- | :--- |
| JSON | 68 bytes | 100% |
| XML | 142 bytes | 209% |
| Protobuf | 38 bytes | 56% |
| MessagePack | 52 bytes | 76% |

### 4.2 速度對比（序列化 10000 次）

| 格式 | 耗時 | 相對 JSON |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip 💡 性能測試結论
- **Protobuf 最快**：適合高性能場景
- **MessagePack 次之**：比 JSON 快 40% 左右
- **JSON 最慢**：但對大多數場景已經足够
:::

---

## 5. 常见問题

### 5.1 日期序列化問题

**問题**：Date 對象序列化後變成字符串

```javascript
// 序列化前
const date = new Date('2024-01-01')

// 序列化後
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**解决方案**：
```javascript
// 方案1：轉成時間戳
{ createdAt: date.getTime() }  // 1704067200000

// 方案2：轉成 ISO 字符串
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// 方案3：自定義序列化
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 循環引用問题

**問题**：對象循環引用會报錯

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**解决方案**：
```javascript
// 方案1：過滤掉循環引用
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// 方案2：使用 flatted 庫
import { parse, stringify } from 'flatted'
stringify(obj)  // 自動處理循環引用
```

### 5.3 中文亂碼問题

**問题**：中文序列化後亂碼

**原因**：
- 字符編碼不一致（UTF-8 vs GBK）
- BOM 標記

**解决方案**：
```python
# Python 确保使用 UTF-8
import json
json.dumps(data, ensure_ascii=False)  # 不轉義中文
```

```javascript
// Node.js 設置響應頭
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. 實戰：電商系统序列化方案

### 6.1 場景分析

| 場景 | 格式選择 | 理由 |
| :--- | :--- | :--- |
| **App → 後端 API** | JSON | 調試方便，前後端统一 |
| **後端 → 後端 RPC** | Protobuf | 性能最優，節省流量 |
| **緩存到 Redis** | MessagePack | 比 JSON 小，可序列化複雜對象 |
| **日志記錄** | JSON | 便于日志分析工具解析 |

### 6.2 代碼示例

```javascript
// API 響應（JSON）
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// 微服務通信（Protobuf）
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// 服務端
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// 客户端
const decoded = proto.Product.decode(buffer)

// Redis 緩存（MessagePack）
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. 用 AI 輔助選择序列化方案

AI 可以帮助你根據場景選择合適的序列化格式。

### 7.1 提示词模板

```
你是一位资深的系统架構师，精通數據序列化技術。請帮我選择合適的序列化方案。

## 業務場景
[描述你的場景，例如：電商 App、游戏後端、微服務等]

## 技術要求
[列出约束條件，例如：
- 前後端分離（Vue + Node.js）
- 性能要求高（QPS > 10000）
- 流量敏感（移動端，需節省流量）
- 需要跨語言（Java + Python + Go）]

## 數據特征
[描述數據特點，例如：
- 數據量大（單次響應 > 1MB）
- 結構複雜（多層嵌套）
- 包含日期、二進制數據等特殊類型]

## 輸出格式
請按以下格式輸出：
1. 推荐方案（JSON/Protobuf/MessagePack/XML）
2. 理由說明
3. 性能對比（估算大小和速度）
4. 代碼示例
```

### 7.2 實戰示例

**輸入提示词**：

```
你是一位资深的系统架構师。我们的電商 App 需要優化商品列表接口性能。

## 業務場景
- 電商 App 的商品列表接口
- 單次返回 100 个商品
- 每个 商品包含：id, name, price, image, description 等 20 个字段
- 当前使用 JSON，響應大小约 200KB，耗時 800ms

## 技術要求
- 前端是 Vue.js
- 後端是 Node.js + Go 微服務
- 需要兼顧性能和開發效率

## 優化目標
- 響應時間降到 300ms 以內
- 數據包大小减少 30%
```

**AI 輸出**：

```
推荐方案：混合方案

1. **API 層**：继續使用 JSON（前端友好）
2. **微服務通信**：切换到 Protobuf（性能提升）
3. **静態數據**：启用 gzip 压缩

### 理由說明
- JSON 對前端最友好，无需额外解析
- 後端微服務用 Protobuf，可以减少 40% 的數據量
- gzip 压缩對文本效果明顯（JSON 可压缩 70%）

### 性能對比
| 方案 | 大小 | 耗時 |
|------|------|------|
| 当前 (JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### 代碼示例
[具體實現代碼...]
```

---

## 名词速查表

| 名词 | 英文 | 解釋 |
| :--- | :--- | :--- |
| **序列化** | Serialization | 對象 → 字節流 |
| **反序列化** | Deserialization | 字節流 → 對象 |
| **JSON** | JavaScript Object Notation | 最常用的文本格式 |
| **XML** | Extensible Markup Language | 標記語言，曾主流 |
| **Protobuf** | Protocol Buffers | Google 開源的高效格式 |
| **MessagePack** | - | JSON 的二進制版本 |
| **編碼** | Encoding | 字符 → 字節 |
| **解碼** | Decoding | 字節 → 字符 |

# Principles of Serialization: Data Translation

::: tip Core Question
**How does data travel across a network?** It's like asking: how does one person's speech become understandable to another? Serialization solves the problem of "data translation" — converting in-memory objects into a transmittable format.
:::

---

## The Necessity of Data Serialization

During frontend-backend interaction, data undergoes multiple "transformations" to travel from the server to the client.

**Scenario 1: The data the frontend receives has "changed"**

```javascript
// Backend sends
Date birth = new Date(1990, 5, 15)

// Frontend receives
{ "birth": "1990-06-15T00:00:00Z" }  // A string!
```

The frontend tries to use `.getFullYear()` and gets an error — because this isn't a Date object, it's a string.

**Scenario 2: Chinese garbled text**

```json
// Expected
{ "name": "Zhang San" }

// Actually received
{ "name": "å¼ ä¸" }
```

Character encoding issues cause Chinese characters to become garbled.

**Scenario 3: Performance bottleneck**

```json
// A response containing 10,000 product listings
{
  "products": [
    { "id": 1, "name": "...", "description": "...", ... },
    // ... 9999 more
  ]
}
// Size: 5.2 MB, transfer time: 3.5 seconds
```

JSON format redundancy causes the data packet to be too large, seriously impacting performance.

---

**Serialization is like "translation"** — "translating" in-memory objects into a transmittable format, and the receiver "translates" them back.

---

## 1. Overview of Serialization and Deserialization

**Serialization** is the process of converting objects into a transmittable format.

**Deserialization** is the process of converting a transmitted format back into objects.

### 1.1 Package Delivery Analogy

| Package Delivery | Serialization | Description |
| :--- | :--- | :--- |
| Pack items | Serialize | Pack items in a box, attach labels |
| Transport | Network transmission | Delivery truck transports to destination |
| Unpack and retrieve | Deserialize | Recipient opens the box, takes out items |

### 1.2 Motivation for needing Serialization

| Reason | Description | Example |
| :--- | :--- | :--- |
| **Network transmission** | Networks can only transmit byte streams | API calls, RPC communication |
| **Persistent storage** | Disks can only store bytes | Saving objects to files, databases |
| **Cross-language** | Different languages have different data structures | Java object → Python dictionary |
| **Distributed caching** | Redis/Memcached store bytes | Caching user information |

---

## 2. Common Serialization Formats

**Try it out**: Click the button below to observe the serialization process across different languages:

<SerializationDemo />

### 2.1 JSON: The Most Universal

**Advantages**:
- Good readability, easy debugging
- Supported by all languages
- Browser native support (`JSON.parse` / `JSON.stringify`)

**Disadvantages**:
- Large size (lots of `{}` `""` markup)
- Doesn't support rich data types (Date, Map, Set are converted to strings)

**Use cases**:
- Public APIs
- Frontend-backend communication
- Configuration files

### 2.2 XML: The Former Mainstream

```xml
<?xml version="1.0" encoding="UTF-8"?>
<user>
  <id>123</id>
  <name>Zhang San</name>
  <email>zhangsan@example.com</email>
  <age>28</age>
</user>
```

**Advantages**:
- Clear structure, supports comments
- Supports complex nested structures
- Has Schema validation (XSD)

**Disadvantages**:
- Large size, slow parsing
- Tag redundancy (`<open></close>`)

**Use cases**:
- Configuration files (Spring, MyBatis)
- SOAP protocol
- Complex data exchange

### 2.3 Protobuf: The Most Efficient

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

**Advantages**:
- Small size (30-50% smaller than JSON)
- Fast speed (5-10x faster parsing)
- Backward compatible (adding fields doesn't affect old versions)

**Disadvantages**:
- Not human-readable (binary format)
- Requires .proto file definition
- Doesn't support dynamic types

**Use cases**:
- Microservice internal communication
- High-performance scenarios (gaming, real-time communication)
- Mobile apps (saves bandwidth)

### 2.4 MessagePack: Balancing Readability and Performance

```json
// MessagePack is a binary version of JSON
// Same data, MessagePack is about 30% smaller than JSON
```

**Advantages**:
- Smaller than JSON, faster than JSON
- Maintains JSON's data model
- Supports all JSON types

**Disadvantages**:
- Not human-readable
- Not as efficient as Protobuf

**Use cases**:
- Need performance but don't want Protobuf
- Redis caching
- WebSocket messages

---

## 3. Serialization Methods by Language

| Language | JSON Library | Protobuf Library | XML Library |
| :--- | :--- | :--- | :--- |
| **JavaScript** | `JSON.stringify()` | `protobuf.js` | `fast-xml-parser` |
| **Python** | `json.dumps()` | `protobuf` | `xmltodict` |
| **Java** | `Jackson` / `Gson` | `protobuf-java` | `JAXB` |
| **Go** | `encoding/json` | `proto` | `encoding/xml` |
| **C++** | `nlohmann/json` | `protobuf` | `tinyxml2` |
| **C#** | `System.Text.Json` | `Google.Protobuf` | `System.Xml` |

::: tip Selection Recommendations
- **Frontend-backend communication**: JSON (easy debugging)
- **Microservice internal**: Protobuf (best performance)
- **Configuration files**: JSON or YAML
- **Legacy system integration**: XML (may have no other choice)
:::

---

## 4. Performance Comparison

### 4.1 Size Comparison (using a user object as example)

| Format | Size | Relative to JSON |
| :--- | :--- | :--- |
| JSON | 68 bytes | 100% |
| XML | 142 bytes | 209% |
| Protobuf | 38 bytes | 56% |
| MessagePack | 52 bytes | 76% |

### 4.2 Speed Comparison (serializing 10,000 times)

| Format | Time | Relative to JSON |
| :--- | :--- | :--- |
| JSON | 45 ms | 100% |
| XML | 120 ms | 267% |
| Protobuf | 8 ms | 18% |
| MessagePack | 28 ms | 62% |

::: tip Performance Test Conclusions
- **Protobuf is fastest**: Suitable for high-performance scenarios
- **MessagePack is second**: About 40% faster than JSON
- **JSON is slowest**: But sufficient for most scenarios
:::

---

## 5. Common Issues

### 5.1 Date Serialization Problem

**Problem**: Date objects become strings after serialization

```javascript
// Before serialization
const date = new Date('2024-01-01')

// After serialization
JSON.stringify(date)  // "2024-01-01T00:00:00.000Z"
```

**Solutions**:
```javascript
// Option 1: Convert to timestamp
{ createdAt: date.getTime() }  // 1704067200000

// Option 2: Convert to ISO string
{ createdAt: date.toISOString() }  // "2024-01-01T00:00:00.000Z"

// Option 3: Custom serialization
JSON.stringify(obj, (key, value) => {
  if (value instanceof Date) {
    return { __type: 'Date', value: value.toISOString() }
  }
  return value
})
```

### 5.2 Circular Reference Problem

**Problem**: Circular references in objects cause errors

```javascript
const obj = { name: 'test' }
obj.self = obj
JSON.stringify(obj)  // TypeError: Converting circular structure to JSON
```

**Solutions**:
```javascript
// Option 1: Filter out circular references
const seen = new WeakSet()
JSON.stringify(obj, (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (seen.has(value)) return
    seen.add(value)
  }
  return value
})

// Option 2: Use the flatted library
import { parse, stringify } from 'flatted'
stringify(obj)  // Automatically handles circular references
```

### 5.3 Chinese Garbled Text Problem

**Problem**: Chinese characters become garbled after serialization

**Causes**:
- Character encoding mismatch (UTF-8 vs GBK)
- BOM markers

**Solutions**:
```python
# Python: Ensure UTF-8
import json
json.dumps(data, ensure_ascii=False)  # Don't escape Chinese characters
```

```javascript
// Node.js: Set response header
res.setHeader('Content-Type', 'application/json; charset=utf-8')
```

---

## 6. Practice: E-commerce System Serialization Solution

### 6.1 Scenario Analysis

| Scenario | Format Choice | Rationale |
| :--- | :--- | :--- |
| **App → Backend API** | JSON | Easy debugging, unified frontend-backend |
| **Backend → Backend RPC** | Protobuf | Best performance, saves bandwidth |
| **Cache to Redis** | MessagePack | Smaller than JSON, can serialize complex objects |
| **Log recording** | JSON | Easy for log analysis tools to parse |

### 6.2 Code Examples

```javascript
// API response (JSON)
app.get('/api/products/:id', async (req, res) => {
  const product = await db.getProduct(req.params.id)
  res.json({
    code: 0,
    data: product
  })
})

// Microservice communication (Protobuf)
// product.proto
syntax = "proto3";
message Product {
  int32 id = 1;
  string name = 2;
  int32 price = 3;
}

// Server side
const proto = require('./product.proto')
const message = proto.Product.create(product)
const buffer = proto.Product.encode(message).finish()

// Client side
const decoded = proto.Product.decode(buffer)

// Redis cache (MessagePack)
const msgpack = require('msgpack-lite')
await redis.set(
  `product:${id}`,
  msgpack.encode(product)
)
const cached = msgpack.decode(await redis.get(`product:${id}`))
```

---

## 7. Using AI to Help Choose a Serialization Solution

AI can help you choose the right serialization format based on your scenario.

### 7.1 Prompt Template

```
You are a senior system architect, proficient in data serialization technology. Please help me choose an appropriate serialization solution.

## Business Scenario
[Describe your scenario, e.g.: e-commerce app, game backend, microservices, etc.]

## Technical Requirements
[List constraints, e.g.:
- Frontend-backend separation (Vue + Node.js)
- High performance requirements (QPS > 10000)
- Bandwidth sensitive (mobile, need to save data)
- Cross-language needed (Java + Python + Go)]

## Data Characteristics
[Describe data features, e.g.:
- Large data volume (single response > 1MB)
- Complex structure (deeply nested)
- Contains dates, binary data, and other special types]

## Output Format
Please output in the following format:
1. Recommended solution (JSON/Protobuf/MessagePack/XML)
2. Rationale
3. Performance comparison (estimated size and speed)
4. Code examples
```

### 7.2 Practical Example

**Input prompt**:

```
You are a senior system architect. Our e-commerce app needs to optimize the product list API performance.

## Business Scenario
- E-commerce app product list API
- Returns 100 products per request
- Each product contains: id, name, price, image, description, and 20 other fields
- Currently using JSON, response size ~200KB, time ~800ms

## Technical Requirements
- Frontend is Vue.js
- Backend is Node.js + Go microservices
- Need to balance performance and development efficiency

## Optimization Goal
- Response time under 300ms
- Data packet size reduced by 30%
```

**AI output**:

```
Recommended solution: Hybrid approach

1. **API layer**: Continue using JSON (frontend-friendly)
2. **Microservice communication**: Switch to Protobuf (performance improvement)
3. **Static data**: Enable gzip compression

### Rationale
- JSON is most frontend-friendly, no extra parsing needed
- Backend microservices using Protobuf can reduce data volume by 40%
- gzip compression is very effective for text (JSON can be compressed by 70%)

### Performance Comparison
| Solution | Size | Time |
|------|------|------|
| Current (JSON) | 200 KB | 800 ms |
| + gzip | 60 KB | 350 ms |
| + Protobuf | 50 KB | 280 ms |

### Code Examples
[Specific implementation code...]
```

---

## Glossary

| Term | English | Description |
| :--- | :--- | :--- |
| **Serialization** | Serialization | Object → Byte stream |
| **Deserialization** | Deserialization | Byte stream → Object |
| **JSON** | JavaScript Object Notation | The most commonly used text format |
| **XML** | Extensible Markup Language | Markup language, formerly mainstream |
| **Protobuf** | Protocol Buffers | Efficient format open-sourced by Google |
| **MessagePack** | - | Binary version of JSON |
| **Encoding** | Encoding | Characters → Bytes |
| **Decoding** | Decoding | Bytes → Characters |

# Data Models: A Complete Overview — Document, Graph, Time-Series, and Vector

::: tip Core Question
**Why can't you just stuff all your data into MySQL tables?** When your data is a social network graph, millions of sensor readings per second, or semantic vectors for AI to understand, relational tables fall short. Different data shapes require different modeling approaches.
:::

---

## 1. Beyond Relational: Motivation for needing Other Data Models

Relational databases (MySQL, PostgreSQL) organize data with "tables + rows + columns," suitable for structured, well-defined business data. But real-world data comes in far more forms than just this:

| Data Shape | Relational Pain Point | Better Model |
|----------|-------------|-------------|
| User profiles (flexible fields, nested structures) | Frequent ALTER TABLE, many NULL columns | **Document Model** |
| Social networks (friends of friends of friends) | Multi-level JOIN performance degrades exponentially | **Graph Model** |
| Monitoring metrics (millions of writes per second) | Write bottlenecks, historical data bloat | **Time-Series Model** |
| AI semantic search ("similar meaning" content) | Cannot express semantic similarity | **Vector Model** |

::: info Core Insight
It's not about "replacing" relational databases, but "supplementing" them. Most systems still run their core business on MySQL/PostgreSQL, but introducing specialized data models for specific scenarios can yield orders-of-magnitude performance improvements.
:::

---

## 2. Document Model

### 2.1 Overview of the Document Model

The document model stores data as **JSON/BSON documents**, where each record is a self-contained document that can have different field structures.

```json
{
  "_id": "user_1001",
  "name": "Zhang San",
  "tags": ["VIP", "Active"],
  "address": { "city": "Beijing", "district": "Chaoyang" },
  "orders": [
    { "id": "o1", "amount": 299 },
    { "id": "o2", "amount": 599 }
  ]
}
```

**Key Features:**
- **No Schema Constraints**: No need to predefine table structure; fields can be added or removed at any time
- **Nested Structures**: Addresses and orders are embedded directly in the document; one read gets all data
- **Horizontal Scaling**: Naturally suited for sharding, easily handling massive data volumes

### 2.2 Document vs. Relational

| Comparison | Relational (MySQL) | Document (MongoDB) |
|----------|----------------|------------------|
| Data Structure | Fixed Schema, ALTER TABLE to modify | Flexible Schema, add fields anytime |
| Nested Data | Requires multi-table JOINs | Embedded directly in the document |
| Cross-record Relationships | JOINs are powerful | Relationship queries are weaker |
| Best For | Structurally stable business data | Structurally variable content data |

### 2.3 Typical Use Cases

- **CMS Content Management**: Articles, comments, and tags with varying structures
- **User Profiles**: Different users have different attribute fields
- **Product Catalogs**: Phones have "screen size," food has "shelf life" — completely different fields
- **Configuration Centers**: Each service's configuration structure is inconsistent

::: warning Common Misconception
"MongoDB doesn't need data structure design" — Wrong! The document model also requires careful design: nesting levels shouldn't be too deep, and frequently updated sub-documents should be split into separate collections.
:::

---

## 3. Graph Model

### 3.1 Overview of the Graph Model

The graph model uses **Nodes** and **Edges** to represent entities and their relationships. Each node is an entity, each edge is a relationship, and both nodes and edges can carry properties.

```
(Zhang San) --[follows]--> (Li Si) --[follows]--> (Wang Wu)
   |                                    |
   +--------[purchased]----> (iPhone) <--[purchased]--+
```

### 3.2 The Graph Model's Killer Feature: Multi-hop Queries

**Scenario**: Finding "friends of friends of friends" in a social network

Relational approach (3-level JOIN):
```sql
SELECT DISTINCT f3.name
FROM friends f1
JOIN friends f2 ON f1.friend_id = f2.user_id
JOIN friends f3 ON f2.friend_id = f3.user_id
WHERE f1.user_id = 1001;
```

Graph database approach (Cypher query language):
```cypher
MATCH (me)-[:FOLLOWS*1..3]->(target)
WHERE me.name = 'Zhang San'
RETURN DISTINCT target.name
```

Each additional hop in the relational approach adds another JOIN, causing exponential performance degradation. Graph databases traverse relationships via pointers directly, so multi-hop query performance remains nearly unchanged.

### 3.3 Typical Use Cases

- **Social Networks**: Friend recommendations, mutual follows, influence propagation
- **Knowledge Graphs**: Entity relationship reasoning ("who is the student of who's teacher")
- **Fraud Detection**: Discovering money loops, associated account networks
- **Recommendation Systems**: User-product-tag relationship graph-based recommendations

---

## 4. Time-Series Model

### 4.1 Overview of the Time-Series Model

The time-series model uses **timestamps** as the primary axis, specifically optimized for "write in chronological order, query by time range" scenarios.

```
timestamp            device      cpu_usage   memory
2024-01-15 10:00:01  server-01   45%         12.3GB
2024-01-15 10:00:02  server-01   67%         12.5GB
2024-01-15 10:00:03  server-01   92%         14.1GB
```

### 4.2 Motivation for Noting Use MySQL for Time-Series Data

| Issue | MySQL | Time-Series Database (InfluxDB) |
|------|-------|----------------------|
| Write Speed | Tens of thousands/sec | **Millions/sec** |
| Historical Data | Manual cleanup, tables keep growing | **Automatic expiration policy (TTL)** |
| Aggregation Queries | Slow GROUP BY | **Built-in downsampling** (5 sec → 1 min average) |
| Storage Efficiency | General-purpose storage, wasted space | **Columnar compression**, saving 90% space |

### 4.3 Typical Use Cases

- **Server Monitoring**: CPU, memory, disk collected every second
- **IoT Sensors**: Temperature, humidity, GPS trajectories
- **Financial Markets**: Stock prices, trading volume at second-level granularity
- **Log Analysis**: Timeline aggregation of application logs

---

## 5. Vector Model

### 5.1 Overview of the Vector Model

The vector model converts unstructured data like text, images, and audio into high-dimensional numerical vectors through an **Embedding model**, then measures semantic similarity by calculating the distance between vectors.

```
"delicious Japanese food" → Embedding → [0.82, 0.15, 0.91, 0.33, ...]
                                        ↓ Cosine similarity
"Ginza sushi master"    → [0.80, 0.18, 0.89, ...] → 96% similar
"Italian pizza"          → [0.12, 0.85, 0.20, ...] → 31% similar
```

### 5.2 Vector Search vs. Keyword Search

| Comparison | Keyword Search (LIKE / Full-text Index) | Vector Search |
|------|---------------------------|---------|
| Search Method | Exact string matching | Semantic similarity matching |
| "delicious Japanese food" | Can only match text containing "Japanese food" | Can find "sushi," "sashimi," "izakaya" |
| Multilingual | Needs separate handling | Cross-language semantic understanding |
| Multimodal | Text only | Unified retrieval across text, images, and audio |

### 5.3 Typical Use Cases

- **RAG (Retrieval-Augmented Generation)**: Providing relevant knowledge fragments to LLMs
- **Semantic Search**: Understanding user intent rather than keywords
- **Image Search**: Upload an image to find visually similar images
- **Recommendation Systems**: Content semantic-based similarity recommendations

::: tip Choosing a Vector Database
- **Standalone Vector Databases**: Pinecone, Milvus, Weaviate — focused on vector retrieval, best performance
- **Traditional Database Extensions**: pgvector (PostgreSQL), Atlas Vector Search (MongoDB) — reduce architectural complexity
- **In-Memory Vector Libraries**: FAISS, Annoy — suitable for small-scale, low-latency scenarios
:::

---

## 6. Selection Guide: Approach to choosing a Data Model

| What Does Your Data Look Like? | Recommended Model | Representative Products |
|-------------------|---------|---------|
| Fixed structure, clear relationships (orders, users) | Relational | MySQL, PostgreSQL |
| Flexible structure, deep nesting (content, configs) | Document | MongoDB, DynamoDB |
| Complex relationships between entities, need multi-hop traversal | Graph | Neo4j, Amazon Neptune |
| Write in chronological order, query by time range | Time-Series | InfluxDB, TimescaleDB |
| Unstructured data, need semantic similarity search | Vector | Pinecone, Milvus, pgvector |

::: info Practical Advice
Modern systems typically use **multiple models together**:
- **Core business** on PostgreSQL (relational)
- **User behavior logs** on InfluxDB (time-series)
- **AI knowledge base** on Milvus + pgvector (vector)
- **Recommendation engine** on Neo4j (graph)

Don't try to find "one database to solve all problems" — instead, let each type of data find its most suitable home.
:::

<DataModelsDemo />

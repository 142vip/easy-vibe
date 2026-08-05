# Principles of Search Engines

::: tip Introduction
**You search for "red dress" on Taobao and find the most relevant results from billions of products in 0.1 seconds — how is this possible?** Search engines are one of the internet's most critical infrastructure components. From Google to e-commerce site search, the core principles are the same: inverted index + relevance ranking.
:::

**What will you learn in this article?**

After reading this chapter, you will gain:

- **Inverted index**: Understand the core data structure of search engines
- **Tokenization technology**: Learn about the challenges and common solutions for Chinese word segmentation
- **Relevance ranking**: Master the basics of TF-IDF and BM25
- **Elasticsearch**: Understand the architecture and use cases of the most popular search engine
- **Search optimization**: Master practical search features like synonyms, spell correction, and highlighting

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Inverted index | Forward index vs inverted index |
| **Chapter 2** | Tokenization and analysis | Chinese word segmentation, stop words, stemming |
| **Chapter 3** | Relevance ranking | TF-IDF, BM25 |
| **Chapter 4** | Elasticsearch | Distributed architecture, shards, replicas |
| **Chapter 5** | Search optimization | Synonyms, spell correction, autocomplete |

---

## 0. The Big Picture: Overview of the Essence of Search

The essence of search is an **information retrieval** problem: given a query, find the most relevant results from a massive collection of documents and return them sorted by relevance.

This process has two phases:

- **Indexing phase (offline)**: Pre-process all documents and build efficient lookup structures
- **Query phase (online)**: When a user enters keywords, quickly find matching documents and rank them

::: tip Why Not Use Database LIKE Queries?
`SELECT * FROM products WHERE name LIKE '%red dress%'` might seem like it could work for search, but it requires a **full table scan** — checking each row one by one. When data reaches millions of records, this query becomes unusably slow. Inverted indexes turn this O(n) operation into an O(1) lookup.
:::

---

## 1. Inverted Index: The "Heart" of Search Engines

Traditional databases use **forward indexes**: from document ID to document content. Search engines use **inverted indexes**: from keywords to the list of documents containing them.

<InvertedIndexDemo />

| Index Type | Direction | Lookup Method | Use Case |
|---------|------|---------|---------|
| Forward index | Document → Content | Know the ID, look up content | Database primary key queries |
| Inverted index | Keyword → Document list | Know the keyword, look up documents | Full-text search |

::: tip Inverted Index Construction Process
1. **Document collection**: Gather all documents that need to be searchable
2. **Tokenization**: Split documents into individual terms
3. **Build mapping**: Record which documents each term appears in (along with position, frequency, etc.)
4. **Persist storage**: Write the index to disk for fast lookup
:::

---

## 2. Tokenization and Text Analysis

Tokenization is the first step in search engines and the biggest challenge for Chinese search. English naturally separates words with spaces, but Chinese has no delimiters — "乒乓球拍卖了" could be segmented as "乒乓球/拍卖/了" or "乒乓/球拍/卖/了".

| Tokenization Method | Description | Example |
|---------|------|------|
| Standard tokenizer | Split by spaces and punctuation (English) | "hello world" → ["hello", "world"] |
| Chinese tokenizer | Segment based on dictionaries or models | "搜索引擎" → ["搜索", "引擎"] |
| N-gram | Sliding window of fixed length | "搜索" → ["搜索", "索引"] |
| Custom dictionary | Add business-specific terms | "iPhone16ProMax" as a single term |

::: tip Text Analysis Pipeline
Tokenization is just one step in text analysis. The complete pipeline includes:
1. **Character filtering**: Remove HTML tags, special characters
2. **Tokenization**: Split text into tokens
3. **Stop word filtering**: Remove meaningless high-frequency words like "的", "了", "是"
4. **Synonym expansion**: Expand "手机" (mobile phone) to "手机、电话、移动电话"
5. **Stemming**: Reduce "running" to "run" (English)
:::

---

## 3. Relevance Ranking: Which Result Overview of Most "Relevant"

Finding matching documents is just the first step; more importantly, **ranking** — placing the most relevant results at the top.

| Algorithm | Principle | Characteristics |
|------|------|------|
| TF-IDF | Term Frequency (TF) × Inverse Document Frequency (IDF) | Classic algorithm, simple and effective |
| BM25 | Improved version of TF-IDF, adding document length normalization | Elasticsearch's default algorithm |
| Vector search | Convert documents and queries to vectors, compute cosine similarity | Supports semantic search |

::: tip Intuitive Understanding of TF-IDF
- **TF (Term Frequency)**: The more times a term appears in a document, the more likely the document is relevant to that term
- **IDF (Inverse Document Frequency)**: The fewer documents a term appears in, the higher its discriminative power
- "的" appears in all documents (low IDF), so searching for "的" is meaningless
- "Elasticsearch" appears in only a few documents (high IDF), so searching for it precisely locates relevant content
:::

---

## 4. Elasticsearch: The Most Popular Search Engine

Elasticsearch is currently the most popular open-source search engine, built on Apache Lucene, providing distributed, RESTful API-based full-text search capabilities.

| Concept | Description |
|------|------|
| Index | Similar to a database "table," storing documents of the same type |
| Document | A single record, in JSON format |
| Shard | A partition, splitting an index across multiple nodes |
| Replica | A copy, providing high availability and read scaling |
| Mapping | Field type definitions, similar to a database schema |
| Analyzer | Text analyzer, defining tokenization rules |

::: tip ES vs Database
Elasticsearch is not meant to replace databases; it works alongside them as a search layer. Typical architecture: data is written to the database → synced to ES → search requests go to ES → detail requests go to the database.
:::

---

## 5. Search Optimization: Making Search "Smarter"

| Optimization Method | Description | Effect |
|---------|------|------|
| Synonyms | Searching "手机" (mobile) also finds "电话" (phone) | Improves recall |
| Spell correction | "iphoen" auto-corrected to "iphone" | Fault tolerance |
| Autocomplete | Typing "苹" suggests "苹果手机" (Apple phone) | Better UX |
| Highlighting | Matching words shown in red in search results | Visual clarity |
| Weight adjustment | Title match weight > content match weight | Improves precision |
| Filtering and aggregation | Filter by price range, brand | Narrow results |

---

## Summary

Search engines are core infrastructure for internet applications. Understanding inverted indexes, tokenization, and relevance ranking — these three core concepts — means you've grasped the essence of search engines.

Key takeaways from this chapter:

1. **Inverted index**: The reverse mapping from keywords to documents is the core data structure of search engines
2. **Tokenization is foundational**: Chinese word segmentation is key to search quality; choosing the right tokenizer is essential
3. **BM25 ranking**: Relevance scoring based on term frequency and document frequency is ES's default algorithm
4. **ES architecture**: Shards + replicas enable distributed processing and high availability
5. **Search optimization**: Synonyms, spell correction, and autocomplete make search smarter

## Further Reading

- [Elasticsearch Official Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html) - The most authoritative ES reference
- [Elasticsearch: The Definitive Guide](https://www.elastic.co/guide/cn/elasticsearch/guide/current/index.html) - Chinese introductory guide
- [Apache Lucene](https://lucene.apache.org/) - The search engine library underlying ES
- [MeiliSearch](https://www.meilisearch.com/) - Lightweight search engine for small-to-medium projects
- [Typesense](https://typesense.org/) - Open-source instant search engine

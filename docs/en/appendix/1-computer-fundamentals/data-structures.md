# Data Structures: An Introduction

::: tip Preface
**Programs = Data Structures + Algorithms.** Previously, we learned how the CPU executes instructions and how the operating system manages resources. But the core objects that programs handle are **data** — user information, product lists, social relationships... How this data is organized in memory directly determines whether a program is fast or slow. You may have wondered: why do some programs process tens of thousands of records quickly while others freeze with just a few hundred? The answer often lies in **the choice of data structures**.
:::

**What will you learn from this article?**

After completing this chapter, you will gain:

- **Intuitive judgment**: When you see a requirement, the right data structure automatically comes to mind
- **Performance analysis perspective**: Determine whether a performance bottleneck is due to wrong data structure choice or inefficient algorithms
- **Trade-off thinking**: Understand "trading space for time" vs "trading time for space" — know that there's no perfect data structure
- **Code reading ability**: Terms like HashMap, Stack, Queue will no longer be foreign
- **Foundation for further learning**: Build a foundation for database indexes, caching systems, search engines, and other technologies

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Big Picture | Four major data structure categories, classification criteria |
| **Chapter 2** | Linear Structures | Arrays, linked lists, stacks, queues |
| **Chapter 3** | Hash Tables | Hash functions, collision handling, O(1) lookup |
| **Chapter 4** | Tree Structures | Binary trees, file system trees, DOM trees |
| **Chapter 5** | Graph Structures | Directed graphs, undirected graphs, traversal algorithms |
| **Chapter 6** | Performance Comparison | Time complexity, space complexity |
| **Chapter 7** | Selection Guide | Scenario analysis, decision flow |

---

## 1. Big Picture: Data Structures Overview

Imagine you need to organize a pile of books:

- **Piled on the floor**: To find a book, you have to flip through one by one — this is the most primitive storage
- **Arranged by number on shelves**: Go directly to the corresponding position to grab it — this is an **array**
- **Sorted by category into cabinets**: First determine the cabinet, then find the book — this is a **hash table**
- **Sorted alphabetically on multi-level shelves**: Eliminate half each time — this is a **tree**

Different organizational methods result in vastly different book-finding efficiency. **A data structure is the "organization method" for data** — it determines how data is stored, found, and modified.

<DataStructureOverviewDemo />

All data structures can be categorized into four major types:

| Type | Data Relationship | Typical Examples | Real-life Analogy |
|------|---------|---------|---------|
| **Linear** | One-to-one, arranged in a line | Arrays, linked lists, stacks, queues | Train cars, checkout lines |
| **Hash** | Key→Value mapping | Hash tables, dictionaries, sets | Library index cards |
| **Tree** | One-to-many, hierarchical | Binary trees, B-trees, heaps | Family trees, folder structures |
| **Graph** | Many-to-many, networked | Directed graphs, undirected graphs | Subway maps, social networks |

::: tip Why Learn So Many Types?
Because **there is no universal data structure**. Each one is a trade-off between "lookup speed," "insertion speed," and "memory usage." Just as you wouldn't use a backpack to move furniture or a truck to deliver a single letter — choosing the right tool makes all the difference.
:::

---

## 2. Linear Structures: The Most Basic Organization

Linear structures are the most intuitive way to organize data — data items are arranged one after another, like train cars. But different "connection methods" and "operation endpoints" produce four variants, each with its own strengths.

<LinearStructuresDemo />

### 2.1 Arrays vs Linked Lists: Two Fundamentally Different Storage Methods

Arrays and linked lists are the two most basic linear structures. Their core difference lies in **memory layout**:

| Comparison | Array | Linked List |
|---------|------|------|
| **Memory layout** | One continuous block | Scattered, connected by pointers |
| **Access nth element** | Calculate address directly, O(1) | Search from the head one by one, O(n) |
| **Insert in the middle** | Must shift all subsequent elements, O(n) | Just change two pointers, O(1) |
| **Size** | Fixed at creation | Can grow at any time |
| **Real-life analogy** | A row of numbered lockers | A chain of treasure hunt clues |

::: tip When to Use Arrays? When to Use Linked Lists?
- **Known data volume, frequent access by position** → Array (e.g., student grade tables, pixel matrices)
- **Unknown data volume, frequent insertion/deletion** → Linked list (e.g., playlists, undo history)
- **Not sure?** → Start with an array. In most scenarios, arrays' cache-friendly nature provides greater performance advantages
:::

### 2.2 Stacks and Queues: Linear Structures with "Rules"

Stacks and queues are essentially arrays or linked lists, just with **restricted operation methods**. It may seem like reduced functionality, but this restriction gives them specific purposes:

| Structure | Rule | Operations | Analogy | Where in Your Code? |
|------|------|------|------|-----------------|
| **Stack** | Last In, First Out (LIFO) | push / pop | A stack of plates | Function call stack, browser back button, Ctrl+Z undo |
| **Queue** | First In, First Out (FIFO) | enqueue / dequeue | Waiting in line for tickets | Task scheduling, message queues, print queues |

::: tip Why Is "Restriction" Actually a Good Thing?
Imagine a stack with only two operations — "place plate" and "remove plate." You'll never get the order wrong. **Restriction brings certainty, and certainty brings reliability.** The function call stack relies on "last in, first out" to ensure the most recently called function returns first. If random access to intermediate functions were allowed, programs would be chaotic.
:::

---

## 3. Hash Tables: The Fastest Lookup

Linear structures aren't fast enough for lookups — arrays require O(n) traversal, and even sorted binary search is O(log n). Is there a structure that can achieve **O(1) direct lookup**? Yes — the hash table.

<HashTableDemo />

### 3.1 The Core Idea of Hash Tables

The principle of hash tables is actually quite simple:

1. You provide a **key** (e.g., "apple")
2. A **hash function** computes a number from the key (e.g., `hash("apple") = 3`)
3. Go directly to position 3 in the array — no traversal needed, one step and you're there

This is like a library's index system: instead of searching shelf by shelf, you check the index card to find the book's exact location.

### 3.2 Hash Collision Resolution Methods

Two different keys may compute the same index — this is called a **hash collision**. Like two books having the same index number pointing to the same location.

| Resolution Method | Principle | Analogy |
|---------|------|------|
| **Chaining** | Store multiple values at the same position using a linked list | Put multiple books in the same cabinet |
| **Open addressing** | If there's a collision, look for the next empty slot | If the cabinet is full, use the adjacent one |

### 3.3 Hash Table Performance

| Operation | Average Case | Worst Case (All Collisions) |
|------|---------|-------------------|
| **Lookup** | O(1) | O(n) |
| **Insert** | O(1) | O(n) |
| **Delete** | O(1) | O(n) |

::: warning When Does It Degrade?
When all keys map to the same index, the hash table degrades into a linked list and all operations become O(n). Prevention: choose a good hash function + dynamic resizing (expand when the load factor exceeds a threshold).
:::

::: tip Hash Tables Are Everywhere in Your Code
- JavaScript `{}` objects and `Map` → Hash table
- Python `dict` → Hash table
- Java `HashMap` → Hash table
- Database indexes → Also use hashing at the底层

Every time you write `user["name"]` or `map.get("key")`, a hash table is working behind the scenes.
:::

---

## 4. Tree Structures: Expressing Hierarchical Relationships

Hash tables are fast for lookups, but data is unordered. If you need **both fast lookup and ordered data**, you need tree structures.

The core characteristic of a tree: each node can have multiple "children" but only one "parent" (except the root node). This one-to-many hierarchical relationship is everywhere in the real world.

<TreeStructureDemo />

### 4.1 Binary Search Trees: Ordered Trees

A binary search tree has one simple but powerful rule: **left is smaller, right is larger**.

- All values in the left subtree < root node
- All values in the right subtree > root node

When searching, each comparison eliminates half the nodes, with time complexity O(log n). Like the number guessing game — "Is it bigger or smaller than 50?" "Bigger." "Bigger or smaller than 75?" — eliminating half each time.

### 4.2 Balanced Trees: Preventing Degradation

Binary search trees have a problem: if data is inserted in order (1, 2, 3, 4, 5), the tree degenerates into a linked list and lookups return to O(n). Balanced trees avoid this by automatically adjusting the structure:

| Type | Balancing Strategy | Characteristics | Typical Applications |
|------|---------|------|---------|
| **AVL Tree** | Strict balance (height difference ≤ 1) | Fastest lookups, slightly slower insertions/deletions | Scenarios requiring frequent lookups |
| **Red-Black Tree** | Approximate balance | Good overall performance | Java TreeMap, Linux kernel |
| **B-Tree** | Multi-way balance; one node stores multiple values | Reduces disk I/O | Database indexes |

::: tip Where Are Trees in Your Code?
- **File system**: Nested folders are tree structures
- **HTML DOM**: `<html>` → `<body>` → `<div>` → `<p>` is a tree
- **Database indexes**: B+ trees enable lookups across millions of records with only 3-4 disk reads
- **JSON/XML**: Nested data formats are essentially trees
:::

---

## 5. Graph Structures: Networks of Complex Relationships

Trees can only represent "one-to-many" hierarchical relationships. But many real-world relationships are "many-to-many" — your friends also have friends, and there are multiple routes between cities. A structure where **any node can potentially connect to any other node** is a graph.

<GraphStructureDemo />

### 5.1 Three Types of Graphs

| Type | Characteristics | Analogy | Typical Applications |
|------|------|------|---------|
| **Undirected graph** | Edges have no direction; A→B equals B→A | WeChat friends (mutual) | Social networks, communication networks |
| **Directed graph** | Edges have direction; A→B is not the same as B→A | Weibo follows (one-way) | Web page links, dependency relationships |
| **Weighted graph** | Edges have weights (distance, cost, etc.) | Highways between cities (with mileages) | Map navigation, shortest path |

### 5.2 Graph Traversal

Graph traversal is more complex than linear structures because there may be cycles (A→B→C→A), requiring tracking of "visited" nodes:

| Traversal Method | Strategy | Analogy | Use Cases |
|---------|------|------|---------|
| **BFS (Breadth-First)** | Visit all neighbors first, then neighbors' neighbors | Ripples spreading in water | Shortest path, level-order traversal |
| **DFS (Depth-First)** | Go as deep as possible on one path, backtrack when stuck | Navigating a maze | Path search, connectivity checking |

::: tip Graphs in the Real World
- **Map navigation**: Cities are nodes, roads are edges; navigation finds the shortest path in the graph
- **Social networks**: Users are nodes, follows/friendships are edges; "People you may know" is graph algorithm recommendations
- **Package managers**: npm/pip dependency relationships are directed graphs; `npm install` performs topological sorting of the graph
:::

---

## 6. Performance Comparison: One Table to See All Data Structures

After learning so many data structures, how do their performances actually compare? The interactive comparison below will help you build intuition:

<DataStructureDemo />

**Core Performance Comparison Table:**

| Data Structure | Access | Search | Insert | Delete | Space |
|---------|------|------|------|------|------|
| **Array** | O(1) | O(n) | O(n) | O(n) | O(n) |
| **Linked List** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Stack/Queue** | O(n) | O(n) | O(1) | O(1) | O(n) |
| **Hash Table** | — | O(1) | O(1) | O(1) | O(n) |
| **Binary Search Tree** | — | O(log n) | O(log n) | O(log n) | O(n) |
| **Graph** | — | O(V+E) | O(1) | O(E) | O(V+E) |

::: tip How to Read This Table
- **O(1)**: Regardless of data volume, operation time is constant — fastest
- **O(log n)**: Doubling the data adds only one step — very fast
- **O(n)**: Doubling the data doubles the time — average
- **O(V+E)**: Depends on the number of vertices and edges — specific to graphs

Note: These are all **average cases**. In the worst case, hash tables degrade to O(n), and binary search trees also degrade to O(n).
:::

---

## 7. Selection Guide: Data Structure Application Scenarios

After learning so many data structures, how do you choose when facing actual requirements? The key is to **start from the requirements** and ask yourself a few questions:

1. **What's the most frequent operation?** Lookup? Insertion? Deletion? Traversal?
2. **What's the relationship between data items?** One-to-one? One-to-many? Many-to-many?
3. **How much data?** The optimal choice for dozens vs. millions of records may be completely different
4. **Does order matter?** Do you need to traverse data in a specific order?

<DataStructureSelectorDemo />

**Quick Decision Flow:**

| Your Need | Recommended Structure | Reason |
|---------|---------|------|
| Fast access by position | Array | O(1) random access |
| Frequent insertion/deletion in the middle | Linked list | O(1) insert/delete without moving elements |
| Last in, first out (undo, recursion) | Stack | LIFO semantics naturally match |
| First in, first out (task queue) | Queue | FIFO semantics naturally match |
| Fast lookup by key | Hash table | O(1) average lookup |
| Ordered data + fast lookup | Binary search tree | O(log n) lookup while maintaining order |
| Complex many-to-many relationships | Graph | Can express connections between any nodes |

::: tip Rules of Thumb in Practice
- **80% of scenarios** are fine with arrays and hash tables
- Consider **trees** when you need ordering
- Consider **graphs** when relationships are complex
- **Not sure?** Start with the simplest and switch when you hit performance issues. Premature optimization is the root of all evil
:::

---

## Summary

> Data structures are the skeleton of programs. **Arrays** are like a row of numbered lockers — fastest for retrieving items by position; **linked lists** are like a chain of treasure hunt clues — most flexible for insertions and deletions; **hash tables** are like a library index — fastest for finding things by name; **trees** are like family trees — expressing hierarchical relationships while maintaining order; **graphs** are like subway maps — expressing arbitrarily complex networked relationships. There's no best data structure, only the most appropriate one — the key is understanding the strengths and costs of each structure and making trade-offs based on actual requirements.

---

## Further Reading

| Topic | Recommended Resources |
|------|---------|
| Data structure visualization | [VisuAlgo](https://visualgo.net/) - Animated demonstrations of various data structures and algorithms |
| Algorithms and data structures | *Grokking Algorithms* by Aditya Bhargava — illustrated and beginner-friendly |
| In-depth understanding | *Data Structures and Algorithm Analysis* by Mark Allen Weiss |
| Practice problems | [LeetCode](https://leetcode.com/) - Practice categorized by data structure |

---

## Next Steps

Now that you've mastered the core knowledge of data structures, you can continue learning:

- **[Introduction to Algorithms](./algorithm-thinking.md)**: Learn to solve problems using sorting, searching, recursion, dynamic programming, and other algorithmic paradigms
- **[Programming Languages](./programming-languages.md)**: Understand how different programming languages implement these data structures

# Principles of Databases: Indexes, Transactions, and Query Optimization
::: tip Core Question
**Why does your Excel query take 10 seconds, while Taobao's search takes only 0.01 seconds?** When data grows from "a few thousand rows" to "a billion rows," and from "one person using it" to "tens of millions accessing it simultaneously," Excel is no longer enough. Databases were created to solve this problem — they are "super Excels" specifically designed to handle massive data and high-concurrency access. This chapter will take you from zero to understanding the core principles of databases.
:::

---

## 1. Motivation for the "Databases"

### 1.1 From a Small Bookstore to Taobao: The Evolution of Data Scale

Imagine you run a small bookstore that sells a few books each day. You casually jot down notes in a notebook:

```
2024-01-15: Zhang San bought "One Hundred Years of Solitude", 59 yuan
2024-01-16: Li Si bought "To Live", 39 yuan
```

At this point, a notebook works perfectly fine. But when your bookstore becomes the next "Amazon" with millions of orders pouring in daily, problems arise:

- **Data volume**: Not dozens of rows, but hundreds of millions of rows
- **Concurrent access**: Not one person querying, but tens of millions of simultaneous users
- **Data relationships**: Orders linked to users, products, inventory, logistics... complex relationships need efficient management
- **Data security**: A power outage shouldn't cause you to lose all orders

<div style="display: flex; gap: 20px; margin: 20px 0;">
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**Excel / Notebook**
- Suitable for individuals or small teams
- Data volume: a few thousand to tens of thousands of rows
- Single user, sequential access
- Manual lookup, slow speed

</div>
<div style="flex: 1; padding: 16px; border: 1px solid #e4e7ed; border-radius: 12px;">

**Database**
- Suitable for enterprise applications
- Data volume: billions and above
- Tens of millions of simultaneous online users
- Millisecond-level query speed

</div>
</div>

**This is the problem "databases" solve: how to efficiently store, quickly query, and securely manage massive amounts of data?**

### 1.2 A Real Cautionary Tale: Why You Can't Use Excel for User Data

You might say: "My project only has tens of thousands of users — isn't Excel enough?" Let me tell you a true story.

::: warning Xiao Lin's Startup Mishap
Xiao Lin built a social app as a startup. Initially, there weren't many users, so he used Excel to store user information (name, phone, registration time, etc.). Exporting Excel daily to track user growth worked fine.

When users surpassed 100,000, problems started appearing:
- Excel took 5 minutes to open
- Filtering "users in Beijing" caused long freezes
- One time, the Excel file got corrupted, and thousands of user records were permanently lost

The most critical issue was that he wanted to implement "view all orders for a specific user" — but user information and orders were in different Excel files. He had to manually copy and paste, taking 30 minutes each time.

He later asked a senior colleague for advice. The colleague took one look and laughed: "What you need isn't Excel — it's a database."

After switching to a database, everything changed:
- Querying "users in Beijing" took only 0.01 seconds
- Users and orders were automatically linked through "relationships" — one SQL statement did the job
- Data was automatically backed up — no more fear of file corruption

Xiao Lin learned an important lesson: **When data is small, anything works; but once data grows, Excel is a disaster.**
:::

::: info Key Takeaway
A database isn't "a more complex Excel" — it's an entirely different design philosophy:
- **Excel**: Designed for small data, single-user usage
- **Database**: Designed for big data, high concurrency, and complex relationships

Choosing the right tool can improve your system performance by thousands of times.
:::

---

## 2. Core Concepts: Tables, Rows, Columns, Primary Keys

::: tip How Do These Concepts Relate to Databases?
Tables, rows, columns, and primary keys are the "building blocks" of databases.

Imagine building a house:
- **Table** = A room (stores one type of data)
- **Row** = A box in the room (one complete record)
- **Column** = A label on the box (name, age, etc.)
- **Primary Key** = The box's unique serial number (never duplicated)

Understanding these foundational concepts will help you know how data is organized.
:::

Before diving deeper into databases, we need to clarify these core concepts. To help you understand, we'll use a library analogy.

### 2.1 Understanding Database Structure Through a Library Analogy

Imagine walking into a library — its organization is strikingly similar to a database:

| Concept | Library Analogy | Actual Function | Concrete Example |
|------|-------------|----------|----------|
| **Database** | The entire library | Container that holds all data | An e-commerce website's database |
| **Table** | A bookshelf | Collection of the same type of data | Users table, products table, orders table |
| **Column** | Labels on book spines | Data attributes (fields) | Name, age, phone number |
| **Row** | Each book on the shelf | One specific data record | "Zhang San, 25, Beijing" |
| **Primary Key** | Each book's ISBN number | Unique ID for each row | user_id = 1001 |

**A real example**: Users table (users)

| user_id (Primary Key) | name | age | city | email |
|:-------------:|------|-----|------|-------|
| 1001 | Zhang San | 25 | Beijing | zhangsan@example.com |
| 1002 | Li Si | 30 | Shanghai | lisi@example.com |
| 1003 | Wang Wu | 28 | Beijing | wangwu@example.com |

- **Table**: `users` (stores all user data)
- **Columns**: `user_id`, `name`, `age`, `city`, `email` (attributes for each user)
- **Row**: Each row is one user (e.g., "Zhang San, 25, Beijing")
- **Primary Key**: `user_id` (1001, 1002, 1003 — never duplicated)

### 2.2 Primary Key: The "Unique Identifier" for Data

::: tip What is a Primary Key?
A **primary key** is the unique identifier for each row in a table, just like an ID number.

**Key Characteristics**:
- **Uniqueness**: Absolutely never duplicated (no two people have the same ID number)
- **Non-null**: Must have a value (there's no such thing as a person "without an ID number")
- **Immutability**: Once set, it doesn't change (your ID number doesn't change)

**Common Approaches**:
- Use auto-incrementing integers: 1, 2, 3, 4...
- Use UUID (Universally Unique Identifier): `550e8400-e29b-41d4-a716-446655440000`
:::

Why do we need primary keys? Imagine a world without them:

**Scenario**: You want to change "Zhang San's" age, but there are 3 "Zhang Sans" in the table. Which one should the system update?

```sql
-- Without a primary key, this updates ALL people named "Zhang San"!
UPDATE users SET age = 26 WHERE name = 'Zhang San';

-- With a primary key, precise update
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**The Golden Rule of Primary Keys**: Every table should have a primary key, and you should never modify it.

### 2.3 Foreign Key: The Bridge Connecting Tables

This is what makes databases more powerful than Excel — **tables can establish relationships with each other**.

::: tip What is a Foreign Key?
A **foreign key** is a column that points to another table's primary key, used to establish associations between tables.

**Simple understanding**:
- Primary key = My own ID number
- Foreign key = Someone else's ID number that I reference

**Example**: The `user_id` in the orders table is a foreign key that points to the primary key of the users table.
:::

Let's look at a real example:

**Users table (users)**:

| user_id (Primary Key) | name | phone |
|:-------------:|------|-------|
| 1001 | Zhang San | 138xxxx |
| 1002 | Li Si | 139xxxx |

**Orders table (orders)**:

| order_id (Primary Key) | product_name | price | user_id (Foreign Key) |
|:--------------:|-------------|-------|:-------------:|
| 5001 | iPhone 15 | 5999 | 1001 |
| 5002 | MacBook | 14999 | 1001 |
| 5003 | AirPods | 1999 | 1002 |

**Key Understanding**:
- `user_id = 1001` in the orders table points to `user_id = 1001` in the users table (Zhang San)
- When you want to check "who placed order 5001?", the database automatically looks up the user with `user_id = 1001` in the users table

**Benefits**:
- **No data duplication**: Even if Zhang San makes 100 purchases, his information is stored only once in the users table
- **Easy maintenance**: If Zhang San changes his phone number, you only update the users table, and all orders automatically link to the new number
- **Flexible queries**: You can easily answer complex questions like "what's each user's total spending?"

<DatabaseRelationDemo />

---

## 3. Approach to talking to a Database SQL Basics and Practice

You can't directly "click" a database with a mouse (although GUI tools exist, they essentially convert actions into commands). You need a special language to instruct the database to work.

That language is **SQL (Structured Query Language)**.

The good news is: SQL is very close to natural English — it reads like you're talking.

### 3.1 Core SQL Operations: CRUD

Most of the time, you only need to master four operations, commonly known as **CRUD**:

| Operation | English | SQL Keyword | Plain Understanding |
|------|------|------------|----------|
| **C**reate | Create | `INSERT` | Add a new data record |
| **R**ead | Read | `SELECT` | Query data |
| **U**pdate | Update | `UPDATE` | Modify data |
| **D**elete | Delete | `DELETE` | Delete data |

::: tip What Can You See from This Table?
These four operations cover all data processing scenarios:
- **Create**: When a user registers, insert a new user record
- **Read**: When a user logs in, query their username and password
- **Update**: When a user edits their profile, update the data in the table
- **Delete**: When a user deletes their account, remove their user data

Master these four, and you've got 80% of everyday SQL operations.
:::

### 3.2 Querying Data (SELECT): The Most Common Database Operation

Querying is the most important function of a database and the key to performance optimization.

**Example 1**: Find all users in Beijing

```sql
SELECT name, age FROM users WHERE city = 'Beijing';
```

**Word-by-word understanding**:
- `SELECT name, age`: Choose the name and age columns
- `FROM users`: From the users table
- `WHERE city = 'Beijing'`: Where city equals 'Beijing'

**Return result**:

| name | age |
|------|-----|
| Zhang San | 25 |
| Wang Wu | 28 |

**Example 2**: Find products priced between 5000 and 15000

```sql
SELECT name, price FROM products
WHERE price BETWEEN 5000 AND 15000;
```

**Example 3**: Fuzzy search (find users whose names contain "Zhang")

```sql
SELECT name FROM users WHERE name LIKE '%Zhang%';
```

::: warning Performance Trap: Using LIKE
`LIKE '%Zhang%'` causes a **full table scan**, which is very slow with large data volumes.

**Optimization advice**:
- Don't use `LIKE '%Zhang%'` (wildcards on both sides)
- You can use `LIKE 'Zhang%'` (wildcard only on the right side)

Because `LIKE 'Zhang%'` can use an index, while `LIKE '%Zhang%'` cannot.
:::

### 3.3 Inserting Data (INSERT): Adding Records

**Example**: Add a new user

```sql
INSERT INTO users (user_id, name, age, city, email)
VALUES (1004, 'Zhao Liu', 35, 'Guangzhou', 'zhaoliu@example.com');
```

**Word-by-word understanding**:
- `INSERT INTO users`: Insert into the users table
- `(user_id, name, age, city, email)`: Specify the columns to insert
- `VALUES (1004, 'Zhao Liu', ...)`: The corresponding values

**Batch insert** (more efficient):

```sql
INSERT INTO users (name, age, city) VALUES
('Xiao Ming', 25, 'Beijing'),
('Xiao Hong', 28, 'Shanghai'),
('Xiao Gang', 30, 'Guangzhou');
```

### 3.4 Updating Data (UPDATE): Modifying Records

**Example**: Add 1 to the age of all users in Beijing

```sql
UPDATE users SET age = age + 1 WHERE city = 'Beijing';
```

::: danger Very Dangerous: Don't Forget WHERE!
If you forget to write the `WHERE` clause, you'll modify **all rows**!

```sql
-- Dangerous! Changes ALL users' age to 26
UPDATE users SET age = 26;

-- Correct: Only modify user with user_id = 1001
UPDATE users SET age = 26 WHERE user_id = 1001;
```

**Real lesson**: In 2012, a well-known company had an engineer forget to write WHERE, causing millions of user records to be incorrectly updated in production. The system was down for 4 hours, resulting in massive losses.
:::

### 3.5 Deleting Data (DELETE): Removing Records

**Example**: Delete the user with user_id = 1004

```sql
DELETE FROM users WHERE user_id = 1004;
```

::: danger Double Danger: DELETE Needs WHERE Even More!
```sql
-- Dangerous! Deletes ALL data in the table!
DELETE FROM users;

-- Correct: Only delete the specified row
DELETE FROM users WHERE user_id = 1004;
```

**Best practices**:
1. Always use SELECT to confirm data before deleting
2. In critical systems, use "soft delete" (add an `is_deleted` field to mark deletion)
3. Back up data before operations in production environments
:::

### 3.6 Multi-table Queries (JOIN): The Magic Moment of Databases

Remember the "foreign keys" we discussed? The most powerful aspect of SQL is the ability to query multiple related tables at once.

**Scenario**: Query "all products purchased by Zhang San"

Assume we have three tables:

**Users table (users)**:
| user_id | name |
|---------|------|
| 1001 | Zhang San |

**Products table (products)**:
| product_id | name | price |
|------------|------|-------|
| 201 | iPhone 15 | 5999 |
| 202 | MacBook | 14999 |

**Orders table (orders)**:
| order_id | user_id | product_id | quantity |
|----------|---------|------------|----------|
| 5001 | 1001 | 201 | 1 |
| 5002 | 1001 | 202 | 2 |

**SQL Query**:

```sql
SELECT u.name, p.name AS product_name, p.price, o.quantity
FROM orders o
JOIN users u ON o.user_id = u.user_id
JOIN products p ON o.product_id = p.product_id
WHERE u.name = 'Zhang San';
```

**Return result**:

| name | product_name | price | quantity |
|------|--------------|-------|----------|
| Zhang San | iPhone 15 | 5999 | 1 |
| Zhang San | MacBook | 14999 | 2 |

**Understanding the JOIN process**:
1. `FROM orders o`: Start from the orders table
2. `JOIN users u ON o.user_id = u.user_id`: Link to users table via user_id
3. `JOIN products p ON o.product_id = p.product_id`: Link to products table via product_id
4. `WHERE u.name = 'Zhang San'`: Filter for Zhang San's orders

<SqlPlaygroundDemo />

---

## 4. Motivation for Databasesing So Fast Demystifying Indexes

This is the most fascinating part of databases and also the most commonly asked topic in interviews.

If you search for "everyone whose surname is Zhang" in Excel, Excel has to scan from the first row to the last. This is a **full table scan** — the more data, the slower it gets.

But in a database, even with 1 billion rows, lookups take only milliseconds.

**The secret is: Indexes.**

### 4.1 Intuitive Understanding: The Dictionary Revelation

Imagine you need to find a word in a 1,000-page book with no table of contents. What would you do?

**You can only flip through page by page** — this is a full table scan, averaging 500 pages to flip through.

But what if this book has a **pinyin index**?

You want to find the word "database":
1. Turn to the index, find the section starting with "da"
2. Within the "da" section, look for "ta"
3. The index tells you: it's on page 256

You only needed 3 lookups to find it! This is **index lookup**.

**A database index is like a book's table of contents**:
- Without an index: Row-by-row scan (1 billion rows = several minutes)
- With an index: Direct jump (1 billion rows = 3 disk I/Os = milliseconds)

### 4.2 Full Table Scan vs. Index Lookup: Speed Comparison

Suppose we have a users table with 10 million records.

**Scenario**: Find the user with `user_id = 5,555,555`

| Method | Process | Rows to Check | Estimated Time |
|------|------|----------------|----------|
| **Full Table Scan** | Start from row 1, check one by one | Average 5 million rows | 5-30 seconds |
| **Index Lookup** | Search the index tree, jump directly to the target | 3-4 comparisons | 0.003 seconds |

**Speed difference: thousands of times!**

::: tip Key Takeaway
Indexes are not a silver bullet — they have costs:
- **Storage overhead**: Indexes require additional storage space
- **Slower writes**: Every INSERT/UPDATE/DELETE must also update the index

**When to create indexes?**
- Columns frequently used in queries (WHERE, JOIN conditions)
- Large data volumes (indexes are unnecessary for tables with a few thousand rows or fewer)

**When NOT to create indexes?**
- Rarely queried columns
- Frequently updated columns
- Small tables
:::

### 4.3 Underlying Data Structure: B+ Trees

Real indexes aren't simple "alphabetical lists" — they're a carefully designed data structure called a **B+ Tree**.

::: tip What is a B+ Tree?
A **B+ Tree** is a "short and wide" tree data structure:

- **Short**: From root to leaf is typically only 3-4 levels
- **Wide**: Each node can store hundreds of key values

**Why "short and wide"?**

Because data is stored on disk, and every disk read (I/O) is extremely slow (thousands of times slower than memory). The B+ Tree's design goal is to **minimize disk I/O operations**.

- 3-4 levels of height = at most 3-4 disk reads
- Large amounts of data stored per level = ensures the tree doesn't grow too tall
:::

**A real example**:

Suppose a B+ Tree where each node can store 1,000 key values:

- **Root node**: 1,000 key values → points to 1,000 child nodes
- **Intermediate nodes**: Each stores 1,000 key values → points to 1,000 leaf nodes
- **Leaf nodes**: Each stores 1,000 actual data records

**Total data** = 1000 x 1000 x 1000 = **1 billion records**

**Tree height** = **3 levels**

This means: finding any single record among 1 billion records requires only **3 disk I/Os**!

This is the secret behind lightning-fast database queries.

<BPlusTreeDemo />

---

## 5. Transactions: Approach to ensuring Data Isn't Lost or Corrupted

Imagine the scenario of snapping up train tickets during the Spring Festival travel rush:

- Time T1: User A queries and finds "G1234 train still has 1 ticket remaining"
- Time T2: User B also queries and finds "1 ticket remaining"
- Time T3: User A clicks "buy," the system deducts inventory, ticket sold to A
- Time T4: User B clicks "buy" — without a protection mechanism, the system would deduct inventory again, selling the same ticket to B!

This is a classic **concurrency conflict** problem.

### 5.1 Overview of a Transaction

A **transaction** is a group of database operations that **either all succeed or all fail** — there's no "half-done" state.

::: tip A Real-Life Example
**Bank transfer** is a classic transaction:

1. Deduct 100 yuan from Account A
2. Add 100 yuan to Account B

If step 1 succeeds but step 2 fails (e.g., power outage), what happens?
- **Without transactions**: Account A's money is gone, Account B never received it — money vanished into thin air
- **With transactions**: The system detects step 2 failed and automatically rolls back step 1. Both accounts return to their original state

This is the **atomicity** of transactions: all or nothing.
:::

### 5.2 The Four Properties of Transactions (ACID)

Transactions have four properties, abbreviated as **ACID**:

| Property | English | Meaning | Bank Transfer Example |
|------|------|------|--------------|
| **A**tomicity | Atomicity | All or nothing | Deduction and credit must both succeed; can't just deduct without crediting |
| **C**onsistency | Consistency | Data always remains in a valid state | Before and after transfer, the total amount in both accounts should remain unchanged |
| **I**solation | Isolation | Multiple transactions don't affect each other | When A is transferring, B should see the balance "before transfer" or "after transfer," not an intermediate state |
| **D**urability | Durability | Once committed, data is permanently saved | After a successful transfer, even a power outage won't revert the account balance |

::: tip What Can You See from This Table?
These four properties ensure data safety:

- **Atomicity**: Prevents "half-done" operations (deducted but not credited)
- **Consistency**: Prevents invalid data (total amount changed after transfer)
- **Isolation**: Prevents concurrency conflicts (two people modifying the same data simultaneously)
- **Durability**: Prevents data loss (committed data survives power outages)

Without these guarantees, banking systems could never function.
:::

### 5.3 Transaction Isolation Levels: Balancing Safety and Performance

In theory, we want transactions to be fully isolated. But **full isolation = very poor performance** (because it requires extensive locking, causing other transactions to wait).

Therefore, databases provide four **isolation levels**:

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read | Performance | Use Cases |
|----------|------|------------|------|------|----------|
| **Read Uncommitted** | Possible | Possible | Possible | Fastest | Almost never used (data may be incorrect) |
| **Read Committed** | Not possible | Possible | Possible | Fast | General business (Oracle default) |
| **Repeatable Read** | Not possible | Not possible | Possible | Medium | Bank transfers (MySQL default) |
| **Serializable** | Not possible | Not possible | Not possible | Slowest | Extremely strict scenarios (rarely used) |

::: tip What Do the Three "Reads" Mean?
- **Dirty Read**: Reading data that another transaction hasn't committed yet (may be rolled back, so data is inaccurate)
- **Non-Repeatable Read**: Within the same transaction, two reads of the same data return different results (modified by another transaction)
- **Phantom Read**: Within the same transaction, two queries return different numbers of rows (another transaction inserted/deleted data)

**Plain examples** (checking bank balance):
- **Dirty Read**: You see a balance of 1,000 yuan, but the other transaction was rolled back — the actual balance is only 100 yuan
- **Non-Repeatable Read**: You check your balance the first time and see 1,000 yuan, the second time it's 800 yuan (a deduction occurred)
- **Phantom Read**: You find 5 transactions the first time, 6 the second time (a new transaction was added)
:::

<TransactionACIDDemo />

---

## 6. Performance Optimization: Practical Tips to Make Queries 1000x Faster

Now you understand core concepts like indexes and transactions. But in real projects, you may encounter various performance issues.

This section provides **actionable optimization strategies**.

### 6.1 Index Pitfall Guide

::: warning Common Mistakes: Index Invalidation
Often, you've created an index, but queries are still slow — because the index became **invalid**.

**Common causes of index invalidation**:
1. Using functions on indexed columns
2. Implicit type conversion
3. LIKE queries starting with %
4. OR conditions (in some cases)
5. Composite indexes not satisfying the leftmost prefix rule
:::

**Pitfall 1: Using functions on indexed columns**

```sql
-- Wrong: Using a function on the indexed column, cannot use index
SELECT * FROM users WHERE YEAR(created_at) = 2024;

-- Correct: Rewrite as a range query, can use index
SELECT * FROM users
WHERE created_at >= '2024-01-01' AND created_at < '2025-01-01';
```

**Pitfall 2: Implicit type conversion**

```sql
-- Assume user_id is int type
-- Wrong: Passing a string causes implicit conversion, cannot use index
SELECT * FROM users WHERE user_id = '123';

-- Correct: Pass the matching type
SELECT * FROM users WHERE user_id = 123;
```

**Pitfall 3: LIKE starting with %**

```sql
-- Wrong: Starting with %, cannot use index
SELECT * FROM users WHERE name LIKE '%Zhang San%';

-- Correct: Starting with a fixed prefix, can use index
SELECT * FROM users WHERE name LIKE 'Zhang San%';

-- Or use full-text index (suitable for text search)
SELECT * FROM users WHERE MATCH(name) AGAINST('Zhang San');
```

### 6.2 SQL Optimization Practical Templates

**Template 1: Pagination Optimization (Deep Pagination Problem)**

::: details View the Problem and Solution
```sql
-- Problem: When OFFSET is large, queries get progressively slower
SELECT * FROM orders
ORDER BY created_at DESC
LIMIT 10 OFFSET 1000000;

-- Optimization 1: Use the last query's timestamp as a cursor
SELECT * FROM orders
WHERE created_at < '2024-01-15 12:00:00'
ORDER BY created_at DESC
LIMIT 10;

-- Optimization 2: Use primary key range query
SELECT * FROM orders
WHERE order_id > 1000000
ORDER BY order_id
LIMIT 10;
```
:::

**Template 2: Batch Insert Optimization**

```sql
-- Inefficient: Multiple single inserts (multiple network round trips)
INSERT INTO users (name, age) VALUES ('Zhang San', 25);
INSERT INTO users (name, age) VALUES ('Li Si', 30);
INSERT INTO users (name, age) VALUES ('Wang Wu', 28);

-- Efficient: Single SQL batch insert (only one network round trip)
INSERT INTO users (name, age) VALUES
('Zhang San', 25),
('Li Si', 30),
('Wang Wu', 28);
```

**Template 3: Avoid SELECT ***

```sql
-- Inefficient: Returns all columns (including unnecessary large fields)
SELECT * FROM users WHERE user_id = 1;

-- Efficient: Only return needed columns
SELECT user_id, name, email FROM users WHERE user_id = 1;
```

### 6.3 Strategies for High-Concurrency Scenarios

| Scenario | Problem | Solution |
|------|------|----------|
| **Hot Data** | A single row is frequently read/written, causing lock contention | Use caching (Redis) + read-write separation |
| **Flash Sales** | Instantaneous high-concurrency inventory deduction | Optimistic locking + inventory pre-warming + message queue peak shaving |
| **Slow Queries** | Complex queries overwhelm the database | Index optimization + query splitting + read-write separation |
| **Connection Exhaustion** | Too many concurrent requests deplete the connection pool | Connection pool optimization + rate limiting + service degradation |

::: tip Key Takeaway
Basic principles of performance optimization:
1. **Measure first, optimize later**: Use `EXPLAIN` to analyze query plans and find the real bottleneck
2. **Indexes first**: 80% of performance issues can be solved by optimizing indexes
3. **Reduce database pressure**: Use caching where possible, make things async where possible
4. **Divide and conquer**: Split large tables into small tables, split large queries into small queries
:::

<QueryOptimizationDemo />

---

## 7. Summary and Learning Path

Let's review the core concepts of databases with a table:

| Concept | One-Sentence Explanation | Problem Solved | Key Points |
|------|-----------|-----------|--------|
| **Tables, Rows, Columns** | How data is organized | How to store structured data | Table = Excel worksheet, Row = record, Column = field |
| **Primary Key** | Unique identifier for each row | How to precisely find one row of data | Unique, non-null, immutable |
| **Foreign Key** | Bridge connecting tables | How to link data across different tables | Points to another table's primary key |
| **SQL** | Language for talking to databases | How to CRUD data | SELECT, INSERT, UPDATE, DELETE |
| **Index** | Data structure that speeds up queries | How to quickly find data | B+ Tree, reduces disk I/O |
| **Transaction** | Mechanism that ensures data safety | How to prevent concurrency conflicts and data loss | ACID: Atomicity, Consistency, Isolation, Durability |

::: info Final Words
Databases are a vast and deep subject — this article is just an introduction. If you want to continue learning in depth, we recommend following this path:

**Next steps**:
1. **Hands-on practice**: Install MySQL or PostgreSQL, create tables, insert data, write SQL queries
2. **ORM frameworks**: Learn how to use databases in code (e.g., SQLAlchemy, Prisma, TypeORM)
3. **Index optimization**: Dive deeper into composite indexes, covering indexes, index condition pushdown, and other advanced topics
4. **Transaction principles**: Learn about MVCC (Multi-Version Concurrency Control), lock mechanisms, isolation level implementations
5. **Distributed databases**: Learn about table sharding, read-write separation, master-slave replication architectures

Remember: **Theory + Practice = True Mastery**.
:::

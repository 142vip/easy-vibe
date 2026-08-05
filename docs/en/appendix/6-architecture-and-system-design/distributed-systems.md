# Principles of Distributed Systems

::: tip Introduction
**When one machine is no longer enough, the real problems begin.** Distributed systems are the backbone of the modern internet — from WeChat messaging to Taobao orders, hundreds or thousands of machines work together behind the scenes. But "distributed" is no free lunch; it introduces a host of challenges that single-machine systems never face.
:::

**What will you learn from this article?**

After reading this chapter, you will gain:

- **Core Theorems**: Understand the CAP theorem and its impact on system design
- **Consistency Models**: Distinguish between strong consistency, eventual consistency, and causal consistency
- **Eight Challenges**: Master the core problems faced by distributed systems
- **Consensus Algorithms**: Understand the basic ideas behind Paxos, Raft, and other consensus protocols
- **Practical Patterns**: Become familiar with common solutions like 2PC, Saga, and CRDT

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Why Distributed Systems | Scalability, availability, geographic distribution |
| **Chapter 2** | CAP Theorem | Consistency, availability, partition tolerance |
| **Chapter 3** | Consistency Models | Strong consistency, eventual consistency, causal consistency |
| **Chapter 4** | Eight Challenges | Network, clocks, partitions, split brain, etc. |
| **Chapter 5** | Consensus Algorithms | Paxos, Raft, ZAB |
| **Chapter 6** | Distributed Transactions | 2PC, Saga, TCC |

---

## 0. The Big Picture: Motivation for needing Distributed Systems

Single-machine systems are simple and reliable, but they have three insurmountable bottlenecks:

| Bottleneck | Description | Distributed Solution |
|------|------|-------------|
| Performance ceiling | A single machine has physical limits on CPU, memory, and disk | Horizontal scaling: add more machines to share the load |
| Single point of failure | If one machine goes down, the entire service goes down | Redundant replicas: multiple machines serve as backups for each other |
| Geographic latency | Users are spread across the globe; a single machine can only be in one place | Multi-region deployment: serve users from nearby locations |

::: tip The Cost of Distribution
Distributed systems solve the problems above but introduce new complexities: unreliable networks, clock skew, partial failures, data consistency... These are the "challenges" this article will discuss.

**Peter Deutsch's Eight Fallacies of Distributed Computing** tell us that the following assumptions are all wrong in distributed environments:
1. The network is reliable
2. Latency is zero
3. Bandwidth is infinite
4. The network is secure
5. Topology doesn't change
6. There is one administrator
7. Transport cost is zero
8. The network is homogeneous
:::

---

## 1. CAP Theorem: The "Impossible Triangle" of Distributed Systems

In 2000, Eric Brewer proposed the CAP conjecture (later proven as a theorem): a distributed system can satisfy at most two of the following three properties simultaneously.

| Property | Meaning | Intuitive Explanation |
|------|------|---------|
| **C**onsistency | All nodes see the same data at the same time | You check your balance at any ATM and get the same result |
| **A**vailability | Every request receives a non-error response | The system always responds to you; it never says "service unavailable" |
| **P**artition tolerance | The system continues to operate during a network partition | Even if some network cables are cut, the system still works |

<CAPTheoremDemo />

### Motivation for Onlying Choose Two

In a distributed environment, network partitions (P) are inevitable — fiber optic cables get dug up, switches fail, data centers lose connectivity. So P is mandatory, and the real choice is a trade-off between C and A:

- **Choose CP**: Reject uncertain requests during a partition to ensure data correctness → suitable for finance, inventory
- **Choose AP**: Continue serving during a partition, but data may be temporarily inconsistent → suitable for social media, content

::: tip CAP Is Not Black and White
Real-world systems are not simply "CP or AP." Many systems make different choices for different operations — for example, in the same database, reads can be AP (allowing stale reads) while writes are CP (requiring majority acknowledgment).
:::

---

## 2. Consistency Models: The "Strictness" of Data Synchronization

Consistency is not a binary switch (on or off); it is a spectrum. Different consistency models make different trade-offs between "correctness" and "performance."

<ConsistencyModelsDemo />

### Consistency Model Comparison

| Model | Guarantee | Latency | Use Cases |
|------|------|------|---------|
| Strong consistency | Reads always return the most recently written value | High (requires waiting for sync) | Bank transfers, inventory deduction |
| Eventual consistency | All replicas will eventually converge, but intermediate reads may be stale | Low (writes return immediately) | Social feeds, DNS |
| Causal consistency | Causally related operations are guaranteed to be ordered | Medium | Comment replies, collaborative editing |
| Linearizability | All operations appear to execute sequentially as if on a single machine | Highest | Distributed locks, leader election |
| Session consistency | Within the same session, reads reflect your own writes | Low-Medium | User personal data |

::: tip "Read Your Own Writes" Consistency
The most common practical requirement is: after a user modifies their data, they can immediately see the update (but other users may see it later). This is called "Read Your Own Writes" consistency, a practical enhancement over eventual consistency.
:::

---

## 3. Eight Challenges: The "Minefield" of Distributed Systems

The complexity of distributed systems doesn't come from any single problem but from multiple problems intertwining. Here are the eight core challenges.

<DistributedChallengesDemo />

### Relationships Between Challenges

These eight challenges are not isolated; they are interconnected:

- **Unreliable network** → leads to **network partitions** → triggers **CAP trade-offs**
- **Clock skew** → leads to **event ordering difficulties** → affects **data consistency**
- **Partial failures** → may cause **split brain** → requires **consensus algorithms** to resolve
- **Data consistency** → requires **distributed transactions** → but transactions are affected by **unreliable networks**

::: tip No Silver Bullet
There is no "perfect" solution in distributed systems, only "appropriate" trade-offs. Understanding the nature of these challenges is essential for making the right design decisions.
:::

---

## 4. Consensus Algorithms: How to Get Multiple Machines to "Agree"

Consensus algorithms are at the heart of distributed systems — they solve the problem of how multiple nodes can agree on a value, even when some nodes fail or the network is slow.

### 4.1 Paxos

Proposed by Leslie Lamport in 1990, it was the first consensus algorithm to be rigorously proven correct.

| Role | Responsibility |
|------|------|
| Proposer | Proposes a value |
| Acceptor | Votes to accept or reject proposals |
| Learner | Learns the final chosen value |

**Two-Phase Process**:
1. **Prepare phase**: The Proposer sends a proposal number; Acceptors promise not to accept proposals with smaller numbers
2. **Accept phase**: The Proposer sends the actual value; if a majority of Acceptors accept, the proposal passes

::: tip The Problem with Paxos
Paxos is correct but notoriously difficult to understand and implement. Lamport's own paper used a Greek parliament analogy, which ended up confusing even more people.
:::

### 4.2 Raft: Built for Understandability

In 2014, Diego Ongaro proposed Raft with the goal of creating "an understandable Paxos." It decomposes consensus into three sub-problems:

| Sub-problem | Description |
|--------|------|
| Leader election | Elect a Leader in the cluster; all writes go through the Leader |
| Log replication | The Leader replicates operation logs to all Followers |
| Safety | Guarantees that committed logs will never be overwritten |

**Raft's Core Process**:
1. When the cluster starts, all nodes are Followers
2. If a Follower times out without receiving a Leader heartbeat, it becomes a Candidate and initiates an election
3. The Candidate that receives a majority of votes becomes the new Leader
4. The Leader accepts client requests and commits logs after replicating them to a majority of nodes

### 4.3 Consensus Algorithm Comparison

| Algorithm | Year Proposed | Understandability | Systems Using It |
|------|---------|---------|---------|
| Paxos | 1990 | Difficult | Google Chubby |
| Raft | 2014 | Easy | etcd, Consul, TiKV |
| ZAB | 2011 | Medium | ZooKeeper |
| EPaxos | 2013 | Difficult | Primarily academic research |

---

## 5. Distributed Transactions: Cross-Node "All-or-Nothing"

Single-machine database transactions achieve ACID through local locks and logs. But when a business operation involves multiple services or databases, how do you ensure atomicity?

### 5.1 Two-Phase Commit (2PC)

The most classic distributed transaction protocol, divided into two phases:

| Phase | Coordinator Action | Participant Action |
|------|-----------|-----------|
| Prepare | Asks all participants "Can you commit?" | Executes the operation but does not commit; replies Yes/No |
| Commit | If all Yes, sends Commit | Formally commits; if any No, all roll back |

**Problems with 2PC**:
- **Blocking**: After Prepare, if the coordinator goes down, participants will wait indefinitely
- **Single point of failure**: The coordinator is a single point; if it fails, the entire transaction stalls
- **Poor performance**: Requires multiple network round trips and holds locks for a long time

### 5.2 Saga Pattern

Saga breaks a large transaction into multiple local transactions, each with a corresponding compensating action. If any step fails, compensations are executed in reverse order.

**E-commerce Order Saga Example**:

| Step | Forward Operation | Compensating Operation |
|------|---------|---------|
| T1 | Create order (pending payment) | Cancel order |
| T2 | Deduct inventory | Restore inventory |
| T3 | Deduct balance | Refund balance |
| T4 | Confirm order (paid) | — |

If T3 (deduct balance) fails: execute C2 (restore inventory) → C1 (cancel order).

**Two Orchestration Approaches**:
- **Choreography**: Each service listens for events and decides its own next step. Simple but hard to track global state
- **Orchestration**: A central coordinator controls the workflow. Clear but the coordinator is a single point

### 5.3 TCC (Try-Confirm-Cancel)

TCC is a business-layer implementation of 2PC, splitting each operation into three phases:

| Phase | Description | Example (Deduct Inventory) |
|------|------|---------------|
| Try | Reserve resources without actually executing | Freeze 10 units of inventory (available -10, frozen +10) |
| Confirm | Confirm execution, consume reserved resources | Frozen -10 (actual deduction) |
| Cancel | Cancel reservation, release resources | Frozen -10, available +10 (restore) |

### 5.4 Comparison of Three Approaches

| Approach | Consistency | Performance | Complexity | Use Cases |
|------|--------|------|--------|---------|
| 2PC | Strong consistency | Low | Medium | Cross-database transactions at the database layer |
| Saga | Eventual consistency | High | High | Long-running business processes (orders, logistics) |
| TCC | Eventual consistency | Medium | Highest | High-reliability financial scenarios |

::: tip Practical Selection Advice
- If you can use a single-database transaction, don't use distributed transactions
- Saga + message queues are sufficient for most business scenarios
- TCC is suitable for financial scenarios requiring extremely high consistency, but development costs are high
- 2PC is suitable for automatic handling by database middleware (e.g., ShardingSphere)
:::

---

## Summary

Distributed systems are the infrastructure of the modern internet, but their complexity far exceeds that of single-machine systems. Understanding these challenges is not about "solving" them (many are fundamental), but about making the right trade-offs when designing systems.

Key takeaways from this chapter:

1. **CAP Theorem**: Network partitions are inevitable; the real choice is a trade-off between consistency and availability
2. **Consistency Models**: From strong to eventual consistency is a spectrum; choose based on business requirements
3. **Eight Challenges**: Unreliable networks, clock skew, network partitions, split brain, and more are all interconnected
4. **Consensus Algorithms**: Raft is currently the most practical consensus algorithm; etcd/Consul are built on it
5. **Distributed Transactions**: Saga for most scenarios, TCC for financial scenarios, 2PC for the database layer

## Further Reading

- [Designing Data-Intensive Applications](https://dataintensive.net/) - Martin Kleppmann's distributed systems classic
- [The Raft Consensus Algorithm](https://raft.github.io/) - Official Raft visualization demo
- [CAP Twelve Years Later](https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/) - Brewer's reassessment of CAP
- [Jepsen](https://jepsen.io/) - Distributed systems correctness testing framework
- [Distributed Systems Patterns](https://martinfowler.com/articles/patterns-of-distributed-systems/) - Martin Fowler's distributed patterns collection

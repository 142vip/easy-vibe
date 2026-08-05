# Principles of High Availability and Disaster Recovery

::: tip Introduction
**One minute of downtime can mean losses in the hundreds of thousands.** High Availability (HA) refers to a system's ability to continue providing service in the face of hardware failures, software bugs, network issues, and other anomalies. Disaster Recovery (DR) is the ability to restore service when a larger-scale disaster strikes.
:::

**What will you learn from this article?**

After reading this chapter, you will gain:

- **Availability Metrics**: Understand what "nines" mean and the corresponding downtime allowances
- **Failover**: Master active-standby, active-active, and multi-site high availability architectures
- **Disaster Recovery Strategies**: Understand RPO and RTO concepts and design methods
- **Failure Detection**: Understand heartbeat, probes, circuit breakers, and other failure detection mechanisms
- **Chaos Engineering**: Learn how to proactively inject failures to verify system resilience

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Availability Metrics | SLA, nines, downtime |
| **Chapter 2** | Failover Architectures | Active-standby, active-active, multi-AZ, multi-region active-active |
| **Chapter 3** | Disaster Recovery Design | RPO, RTO, backup strategies |
| **Chapter 4** | Failure Detection and Recovery | Heartbeat, circuit breakers, auto-scaling |
| **Chapter 5** | Chaos Engineering | Fault injection, resilience verification |

---

## 1. Availability Metrics: What Do "Nines" Mean

Availability is typically measured in "nines," calculated as:

**Availability = Uptime / Total Time x 100%**

For example, if a system is down for 43 minutes in a month (30 days = 43,200 minutes), its availability is (43,200 - 43) / 43,200 ≈ 99.9%. Each additional nine reduces the allowable downtime by an order of magnitude, and the difficulty and cost of achieving it grow exponentially.

| Availability Level | Percentage | Monthly Downtime Allowed | Annual Downtime Allowed | Typical Requirements |
|-----------|--------|------------|------------|---------|
| 2 nines | 99% | 7.3 hours | 3.65 days | Internal tools |
| 3 nines | 99.9% | 43 minutes | 8.76 hours | Standard business systems |
| 4 nines | 99.99% | 4.3 minutes | 52.6 minutes | E-commerce, SaaS |
| 5 nines | 99.999% | 26 seconds | 5.26 minutes | Finance, payments |

<AvailabilityCalculatorDemo />

::: tip What Is SLA?
**SLA (Service Level Agreement)** is a formal commitment between a service provider and its customers. For example, AWS S3 promises 99.99% availability; if it fails to meet that, it issues proportional refunds. An SLA is not just a technical metric — it's a business contract. Violating an SLA means losing money.
:::

::: tip The Gap Between 3 Nines and 4 Nines
3 nines (99.9%) means you can be down for 43 minutes per month — a single bad deployment and a rollback can use that up. 4 nines (99.99%) means only 4 minutes of downtime per month — this requires a complete high-availability infrastructure including automatic failover, rolling deployments, and health checks.
:::

---

## 2. Failover Architectures

Failover is the core mechanism of high availability: when the primary node fails, traffic is automatically switched to a backup node to continue serving.

### Active-Standby Mode

The most common high availability architecture. The primary node handles all requests while the standby node synchronizes data in real time but does not serve requests. When the primary fails, the standby automatically takes over.

```
Normal state:
  Client → Primary node (handling requests)
            Standby node (syncing data, on standby)

Failover:
  Client → Standby node (takes over as new primary)
            Original primary (failed, awaiting repair)
```

A key concern is **split brain**: during a network partition, both primary and standby think the other is down and both start serving requests, leading to data inconsistency. The solution is to introduce a **Quorum** — at least 3 nodes vote to decide which one is the primary.

### Multi-AZ (Multi-Availability Zone)

Deploy services across multiple data centers (availability zones) within the same region. A single data center losing power or connectivity does not affect the overall service. Cloud providers typically have low-latency dedicated links between availability zones (< 2ms).

### Multi-Region Active-Active

Deploy complete service replicas in different cities or even different countries, where each site can independently handle requests. This is the highest level of high availability architecture, but also the most complex — the core challenge is the latency and consistency issues of **cross-region data synchronization**.

<FailoverStrategyDemo />

| Architecture | Availability Level | Cost | Complexity | Use Cases |
|------|-----------|------|--------|---------|
| Single machine | 99%~99.9% | Low | Low | Development/testing, internal tools |
| Active-standby | 99.9%~99.99% | Medium | Medium | Small-to-medium business systems |
| Multi-AZ | 99.99% | High | High | E-commerce, SaaS platforms |
| Multi-region active-active | 99.999% | Very high | Very high | Finance, large-scale internet |

---

## 3. Disaster Recovery Design: RPO and RTO

Disaster recovery design revolves around two core metrics:

| Metric | Full Name | Meaning | Example |
|------|------|------|------|
| RPO | Recovery Point Objective | How much data loss is tolerable | RPO=0 means no data loss is acceptable |
| RTO | Recovery Time Objective | How much downtime is tolerable | RTO=5min means recovery within 5 minutes |

### Backup Strategy and RPO Relationship

| Backup Method | RPO | Cost | Description |
|---------|-----|------|------|
| Daily full backup | 24 hours | Low | At most one day of data loss |
| Real-time incremental backup | Minutes | Medium | Continuous binlog/WAL sync |
| Synchronous replication | 0 | High | Writes must wait for replica acknowledgment |

::: tip Not All Data Needs RPO=0
If a user's avatar is lost, they can re-upload it (RPO=24h is fine), but payment records must not lose a single entry (RPO=0). Decide backup strategies based on the business value of the data, rather than applying a one-size-fits-all approach.
:::

---

## 4. Failure Detection and Recovery

### 4.1 Failure Detection Mechanisms

| Mechanism | Principle | Detection Speed | Use Cases |
|------|------|---------|---------|
| Heartbeat | Periodically send heartbeat packets; timeout indicates failure | Seconds | Node liveness detection |
| Health check | HTTP/TCP probes check service status | Seconds | Load balancer backend detection |
| Business probe | Simulates real requests to check business logic | Seconds to minutes | End-to-end availability monitoring |

**How Heartbeat Detection Works**: Node A sends an "I'm alive" signal to the monitor at fixed intervals (e.g., every 5 seconds). If N consecutive heartbeats (e.g., 3) are missed, Node A is deemed to have failed. The key parameters are the **heartbeat interval** and **timeout threshold** — too short an interval increases network overhead, while too long delays failure detection.

**Three Levels of Health Checks**:
- **Liveness probe**: Is the process still running? If not, restart it
- **Readiness probe**: Can the service accept requests? If not, remove it from the load balancer
- **Startup probe**: Has the service finished starting? If not, wait — don't misdiagnose it as a failure

### 4.2 Automatic Recovery Mechanisms

| Mechanism | Description | Typical Tools |
|------|------|---------|
| Automatic restart | Automatically restart a crashed process | systemd, PM2, K8s |
| Auto-scaling | Automatically add instances when load increases | K8s HPA, cloud provider Auto Scaling |
| Circuit breaker / Degradation | Fast fail when downstream fails, preventing cascading failures | Hystrix, Sentinel, Resilience4j |
| Rate limiting | Reject requests that exceed capacity | Nginx limit_req, API gateway rate limiting |

**Circuit Breaker Pattern Explained**:

The circuit breaker is inspired by electrical fuses — when current is too high, the fuse automatically trips to protect the entire circuit from burning out. In microservices, when a downstream service fails, the circuit breaker "trips," causing requests to fail fast rather than waiting for a timeout.

```
Circuit breaker three states:

  Closed (normal) ──→ failure rate exceeds threshold ──→ Open (tripped)
       ↑                                    │
       │                              wait for cooldown
       │                                    ↓
       └── probe request succeeds ←── Half-Open (testing)
```

- **Closed state**: Normal request forwarding, while tracking failure rate
- **Open state**: All requests return errors immediately (fast fail), downstream is no longer called
- **Half-Open state**: After the cooldown period, a small number of probe requests are allowed through. If they succeed, return to Closed; if they fail, stay Open

**Fallback** is the companion strategy to circuit breaking: when the circuit breaker triggers, instead of returning an error, it returns a "fallback" result. For example, if the recommendation service is down, return a list of popular products; if a user's avatar fails to load, show a default avatar.

---

## 5. Chaos Engineering: Proactively Finding Problems

The core philosophy of chaos engineering is: **rather than waiting for failures to happen, proactively create them** to verify system resilience in a controlled environment.

| Tool | Creator | Core Capability |
|------|--------|---------|
| Chaos Monkey | Netflix | Randomly terminates production instances |
| Chaos Mesh | PingCAP | Fault injection in K8s environments |
| Litmus | CNCF | Cloud-native chaos engineering framework |
| ChaosBlade | Alibaba | Multi-scenario fault injection tool |

::: tip Chaos Engineering Implementation Steps
1. **Define steady state**: Clarify metrics for normal system operation (e.g., P99 latency < 200ms)
2. **Form a hypothesis**: If a node goes down, the system should automatically recover within 30 seconds
3. **Inject failures**: Create controlled failures (start in testing, then move to production)
4. **Observe results**: Did the system recover as expected? Were there cascading failures?
5. **Fix weaknesses**: Improve architecture and processes based on findings
:::

---

## Summary

High availability is not a feature — it is an architectural capability. It requires safeguards at every stage: design, development, deployment, and operations.

Key takeaways from this chapter:

1. **Nines**: Each additional nine reduces downtime by an order of magnitude, with cost and complexity growing exponentially
2. **Failover**: From active-standby to multi-region active-active, choose the right architecture based on business needs
3. **RPO and RTO**: Design backup and recovery strategies based on data value and business tolerance
4. **Automation**: Failure detection, automatic restart, circuit breakers, and degradation are fundamental high availability infrastructure
5. **Chaos Engineering**: Proactively inject failures to verify system resilience in a controlled environment

## Further Reading

- [Site Reliability Engineering](https://sre.google/sre-book/table-of-contents/) - Google SRE classic
- [Chaos Monkey](https://netflix.github.io/chaosmonkey/) - Netflix chaos engineering tool
- [Release It!](https://pragprog.com/titles/mnee2/release-it-second-edition/) - Production environment design patterns
- [Chaos Mesh](https://chaos-mesh.org/) - K8s chaos engineering platform

# An Introduction to Monolith-to-Microservices Evolution

::: tip Introduction
**No architecture is "the best" — there is only "the best fit for the current stage."** Moving from monolith to microservices is not a single leap but a gradual evolution as business scale and team size grow. Splitting into microservices too early is just as dangerous as splitting too late.
:::

**What will you learn from this article?**

After reading this chapter, you will gain:

- **Evolution Path**: Understand the four stages from monolith to microservices
- **When to Split**: Know when you should split and when you shouldn't
- **Splitting Strategies**: Master the methodology of splitting by business domain
- **Communication Patterns**: Understand the choices between synchronous and asynchronous inter-service communication
- **Data Splitting**: Understand the challenges and solutions of database decomposition

| Chapter | Content | Core Concepts |
|----- |------|---------|
| **Chapter 1** | Architecture Evolution Path | Monolith → Modular → SOA → Microservices |
| **Chapter 2** | When and Why to Split | Conway's Law, team autonomy |
| **Chapter 3** | Splitting Strategies | DDD bounded contexts, Strangler Fig pattern |
| **Chapter 4** | Service Communication | REST, gRPC, message queues |
| **Chapter 5** | Data Splitting | Database decomposition, data synchronization |

---

## 1. Architecture Evolution Path

Architecture evolution is not driven by technology — it is **driven by organizational scale**. When a team grows from 5 to 500 people, the collaboration efficiency of a monolithic architecture drops precipitously.

| Stage | Architecture | Team Size | Characteristics |
|------|------|---------|------|
| Startup | Monolithic application | 1–10 people | All code in one project, simple deployment |
| Growth | Modular monolith | 10–50 people | Code organized by module, but still deployed together |
| Expansion | SOA (Service-Oriented) | 50–200 people | Split into coarse-grained services by business line |
| Scale | Microservices | 200+ people | Fine-grained services, each team develops and deploys independently |

<ArchEvolutionDemo />

::: tip Conway's Law
"Organizations which design systems... produce designs which are copies of the communication structures of these organizations." — Melvin Conway

Simply put: 3 teams building one system will end up with 3 services. The essence of architecture splitting is **organizational splitting**.

**Inverse Conway's Law**: Since organizational structure determines system architecture, to get the architecture you want, first restructure the organization accordingly. For example, if you want an independent payment service, first create an independent payment team. Many companies fail at microservice splitting not because of technology, but because the organization didn't adapt.
:::

---

## 2. Criteria for Split into Microservices

Not all systems need microservices. Splitting too early introduces unnecessary complexity.

| Signal | Description | Recommendation |
|------|------|------|
| Frequent deployment conflicts | Multiple teams modifying the same codebase, frequent conflicts | Consider splitting |
| A module needs independent scaling | The search module needs 10x the resources of other modules | Consider splitting |
| Differentiated tech stacks needed | AI module uses Python, main site uses Java | Consider splitting |
| Team < 10 people | Low communication overhead, monolith is sufficient | Don't split |
| Business still in exploration phase | Requirements change rapidly, boundaries are unclear | Don't split |
| No DevOps capability | No CI/CD, containerization, or monitoring infrastructure | Don't split |

---

## 3. Splitting Strategies

### 3.1 Split by Business Domain (DDD Bounded Contexts)

The Bounded Context from DDD (Domain-Driven Design) is the best guiding principle for splitting microservices. Each bounded context corresponds to an independent business domain with its own data model and business rules.

**What is a bounded context?** The same word can mean different things in different business domains. For example, "user" in the user domain means registration info (name, email), in the order domain means the buyer (shipping address, payment method), and in the recommendation domain means a behavioral profile (browsing history, preference tags). A bounded context draws a boundary within which terminology and models have a clear, unified meaning.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  User Domain │  │ Order Domain│  │Payment Domain│
│             │  │             │  │             │
│ User        │  │ Order       │  │ Payment     │
│ Profile     │  │ OrderItem   │  │ Refund      │
│ Address     │  │ Cart        │  │ Transaction │
│             │  │             │  │             │
│ User Service│  │Order Service│  │Payment Svc  │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │
       └────── API calls / event communication ───────┘
```

| Bounded Context | Core Entities | Corresponding Service |
|-----------|---------|---------|
| User domain | User, Profile, Address | User Service |
| Product domain | Product, Category, SKU | Product Service |
| Order domain | Order, OrderItem | Order Service |
| Payment domain | Payment, Refund | Payment Service |
| Logistics domain | Shipment, Tracking | Logistics Service |

### 3.2 Strangler Fig Pattern

Don't rewrite the entire monolith at once. Instead, like a strangler fig, gradually replace old modules with new services:

1. Create a new service outside the monolith
2. Route some traffic to the new service through a proxy layer
3. After verifying the new service is stable, gradually migrate more traffic
4. Eventually replace the old module entirely

---

## 4. Service Communication Patterns

| Method | Protocol | Characteristics | Use Cases |
|------|------|------|---------|
| REST | HTTP/JSON | Simple and universal, great ecosystem | External APIs, CRUD operations |
| gRPC | HTTP/2 + Protobuf | High performance, strongly typed | High-frequency internal service calls |
| Message queue | AMQP/Kafka | Async decoupling, peak shaving | Event notifications, async tasks |
| GraphQL | HTTP/JSON | Client-driven queries | BFF layer, mobile clients |

::: tip Synchronous vs. Asynchronous Choices
- **Need immediate results** → Synchronous (REST/gRPC)
- **Don't need immediate results** → Asynchronous (message queue)
- **One event triggers multiple actions** → Asynchronous (publish-subscribe)

Rule of thumb: go async whenever possible. The longer the synchronous call chain, the more fragile the system.
:::

---

## 5. Data Splitting: The Hardest Part

The most painful part of microservice splitting is not code decomposition — it's database decomposition. Each service should own its own database, but this makes cross-service queries difficult.

| Challenge | Description | Solution |
|------|------|---------|
| Cross-service JOINs | Cannot directly JOIN tables from two services | API composition queries, data redundancy |
| Distributed transactions | Cross-database transactions cannot use local transactions | Saga, local message tables |
| Data consistency | Data across services may be temporarily inconsistent | Eventual consistency, event-driven |
| Data migration | Migrating from shared to independent databases | Dual-write transition, data sync tools |

---

## Summary

Moving from monolith to microservices is a gradual process, not a overnight revolution.

Key takeaways from this chapter:

1. **Evolution Path**: Monolith → modular monolith → SOA → microservices, each step driven by clear motivations
2. **When to Split**: Team size, deployment conflicts, and scaling needs are signals to split
3. **Splitting Strategies**: Use DDD bounded contexts to guide splitting and the Strangler Fig pattern for gradual migration
4. **Communication Choices**: Go async whenever possible; keep synchronous call chains as short as possible
5. **Data Splitting**: The hardest but most important part — accepting eventual consistency is the key mindset shift

## Further Reading

- [Building Microservices](https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/) - Sam Newman's microservices classic
- [Monolith to Microservices](https://www.oreilly.com/library/view/monolith-to-microservices/9781492047834/) - A guide to incremental migration
- [Domain-Driven Design](https://www.domainlanguage.com/ddd/) - Eric Evans' DDD classic
- [The Strangler Fig Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html) - Martin Fowler on the Strangler Fig pattern

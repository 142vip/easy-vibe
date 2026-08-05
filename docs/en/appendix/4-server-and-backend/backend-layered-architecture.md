# Principles of Backend Layered Architecture

> **Core Question**: As code grows more chaotic, how should you organize it to stay clear and understandable?

When a project expands from dozens of lines to tens of thousands, from solo development to team collaboration, and from simple CRUD to complex business logic, the way code is organized directly determines the project's survival. Layered architecture is not about showing off or following dogma — it exists to resolve a fundamental contradiction in software engineering: the clash between the **natural growth of business complexity** and the **limited capacity of human cognition**.

---

## 1. Motivation for Layersing

### 1.1 The Root of the Problem

**Early version** (100 lines of code):
```java
@PostMapping("/register")
public Result register(@RequestBody User user) {
    // 1. Check if username already exists
    if (userRepository.findByUsername(user.getUsername()) != null) {
        return Result.error("Username already exists");
    }
    // 2. Encrypt password
    user.setPassword(encrypt(user.getPassword()));
    // 3. Save user
    userRepository.save(user);
    // 4. Send welcome email
    emailService.sendWelcome(user.getEmail());
    // 5. Log
    log.info("User registered: {}", user.getUsername());
    return Result.success();
}
```

**6 months later** (500 lines of code):
- Phone number verification added
- Real-name authentication added
- Referral rewards added
- Risk control checks added
- ...

Now this method is 500 lines, and every change is nerve-wracking because:
- Logic is tangled together — changing one part may affect other features
- Hard to test — every test requires simulating a full HTTP request
- Newcomers can't understand it — all logic is piled together

**The essence of the problem**: code has no "boundaries"; all responsibilities are mixed together.

**The compounding effect of technical debt**:
- ❌ **High coupling**: Business logic is coupled with data access and HTTP protocol — a single change ripples everywhere
- ❌ **Low cohesion**: One method takes on multiple responsibilities, violating the Single Responsibility Principle
- ❌ **Hard to test**: Cannot test business logic in isolation — must boot the full HTTP container
- ❌ **Hard to reuse**: Business logic is bound to HTTP requests; scheduled tasks and message queues cannot reuse it
- ❌ **Cognitive load**: Developers must understand details across all layers simultaneously, unable to focus

### 1.2 The Core Idea of Layering

Layered architecture draws clear boundaries for code:

```
┌─────────────────────────────────────┐
│  Accept requests ← Controller       │  Only responsible for "taking orders"
├─────────────────────────────────────┤
│  Business orchestration ← Service   │  Only responsible for "cooking"
├─────────────────────────────────────┤
│  Data access ← Repository           │  Only responsible for "fetching ingredients"
├─────────────────────────────────────┤
│  Business definition ← Domain       │  Only responsible for "recipe standards"
└─────────────────────────────────────┘
```

**Key principles**:
- Each layer does only its own job
- Layers communicate through well-defined interfaces
- Business logic is concentrated in Service and Domain
- Data access logic is concentrated in Repository

**Engineering value of layered architecture**:

1. **Reduces cognitive load**: Developers can focus on the responsibilities of the current layer without understanding every global detail
2. **Improves testability**: Each layer can be unit-tested independently by mocking dependencies
3. **Enhances maintainability**: When requirements change, the scope of modifications is clear, reducing risk
4. **Promotes code reuse**: Business logic is not tied to HTTP — it can be reused in scheduled tasks and message queues
5. **Supports team collaboration**: Different developers can work on different layers in parallel, reducing conflicts
6. **Extends code lifespan**: Clear boundaries make code easier to refactor and evolve

---

## 2. The Four-Layer Architecture in Detail

### 2.1 Overall Structure

The essence of layered architecture is **Separation of Concerns** and **dependency direction control**:

```
┌─────────────────────────────────────────────────────┐
│  Frontend request                                     │
└────────────────────┬────────────────────────────────┘
                     │ HTTP Request
                     ▼
┌─────────────────────────────────────────────────────┐
│  Controller Layer                                    │
│  - Accept requests, validate parameters              │
│  - DTO conversion                                    │
│  - Call Service                                      │
│  - Return response                                   │
└────────────────────┬────────────────────────────────┘
                     │ Business call
                     ▼
┌─────────────────────────────────────────────────────┐
│  Service Layer                                       │
│  - Business logic orchestration                     │
│  - Transaction management                            │
│  - Coordinate multiple Repositories                  │
│  - Cross-module coordination                         │
└────────────────────┬────────────────────────────────┘
                     │ Data access
                     ▼
┌─────────────────────────────────────────────────────┐
│  Repository Layer                                    │
│  - Database CRUD                                     │
│  - Query encapsulation                               │
│  - ORM mapping                                       │
└────────────────────┬────────────────────────────────┘
                     │ Domain objects
                     ▼
┌─────────────────────────────────────────────────────┐
│  Domain Layer                                        │
│  - Entity                                            │
│  - Value Object                                      │
│  - Business rules                                    │
└─────────────────────────────────────────────────────┘
```

**Dependency direction**: Code dependencies must point toward **more stable, more abstract** directions
- Controller depends on Service interface (abstraction)
- Service depends on Repository interface (abstraction)
- All layers depend on Domain (business core, most stable)
- **Reverse dependencies are forbidden** (e.g., Repository depending on Service)

<LayeredArchitectureDemo />

### 2.2 Controller Layer

**Responsibility**: The "receptionist" for requests

- Accept HTTP requests, parse parameters
- Validate parameters (format, required fields, etc.)
- DTO conversion (Request → Param)
- Call Service to execute business logic
- DTO conversion (Result → Response)
- Return HTTP response

**What it should NOT do**:
- Write business logic directly
- Access the database directly
- Handle transactions

**Design philosophy**:
The Controller is the system's "facade," serving as an adapter — translating the external HTTP protocol into internal business calls. It should contain no business decisions, because business decisions embody domain knowledge and should be decoupled from the transport protocol.

**Example**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public UserResponse createUser(
            @RequestBody @Valid UserRequest request) {

        // 1. Request DTO → Param DTO
        UserParam param = UserParam.builder()
                .username(request.getUsername())
                .password(encrypt(request.getPassword()))
                .email(request.getEmail())
                .build();

        // 2. Call Service
        User user = userService.createUser(param);

        // 3. Entity → Response DTO
        return UserResponse.from(user);
    }
}
```

**Key points**:
- Use `@Valid` for automatic parameter validation
- Use DTOs to isolate frontend and backend data structures
- Only do "translation" and "dispatching" — no business logic

<ControllerLayerDemo />

### 2.3 Service Layer

**Responsibility**: The "chef" of the business

- Implement core business logic
- Orchestrate operations across multiple Repositories
- Manage transaction boundaries
- Handle cross-module coordination

**What it should NOT do**:
- Write SQL directly (leave that to Repository)
- Handle HTTP-related concerns
- Return database entities to Controller

**Design philosophy**:
The Service layer carries business logic and should remain pure. It does not depend on any framework or transport protocol, which enables:
- Unit testing independent of the web layer
- Reuse in scheduled tasks and message queue consumers
- Protection of business logic from technology stack changes

**Example**:
```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public User createUser(UserParam param) {
        // 1. Business rule: check if username already exists
        if (userRepository.existsByUsername(param.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        // 2. Create user entity
        User user = new User();
        user.setUsername(param.getUsername());
        user.setPassword(param.getPassword());
        user.setEmail(param.getEmail());

        // 3. Save to database
        userRepository.save(user);

        // 4. Send welcome email (cross-module coordination)
        emailService.sendWelcomeEmail(user);

        return user;
    }
}
```

**Key points**:
- Use `@Transactional` to guarantee transaction consistency
- Throw business exceptions and let the Controller handle them uniformly
- No dependency on HTTP concepts — reusable

<ServiceLayerDemo />

### 2.4 Repository Layer

**Responsibility**: The "warehouse keeper" of data

- Encapsulate all data access logic
- Execute CRUD operations
- Handle ORM mapping
- Encapsulate query conditions

**What it should NOT do**:
- Write business logic
- Handle transactions (managed by the Service layer)
- Depend on upper-layer modules

**Design philosophy**:
The Repository is an abstraction layer for data access that hides the details of the underlying database. The value of this abstraction lies in:
- When switching databases, only the Repository implementation needs to change — business logic remains untouched
- Easy mocking for unit testing
- Query logic is centrally managed, avoiding duplicate code

**Example**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Automatically implemented by Spring Data JPA
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    // Custom complex query
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.deleted = false")
    Optional<User> findActiveByEmail(@Param("email") String email);
}
```

**Key points**:
- Repository is an interface — contains no business logic
- Express query intent through method names
- Use `@Query` for custom complex queries

<RepositoryLayerDemo />

### 2.5 Domain Layer

**Responsibility**: The "recipe standards" of the business

- Define business entities
- Define value objects
- Encapsulate business rules
- Serve as the common dependency for all layers

**Important characteristics**:
- The Domain layer depends on no other layer
- All layers depend on the Domain layer
- It is the foundation of the layered architecture

**Design philosophy**:
The Domain layer is the business core of the entire system, expressing domain knowledge and business rules. Its purity is critical:
- Not depending on frameworks means business logic is not held hostage by the technology stack
- All layers depending on it ensures the consistency of business rules
- It supports long-term evolution — technology stacks can be replaced, but business rules are relatively stable

**Example**:
```java
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    // ✅ Business method: encapsulates business rules
    public boolean isPasswordCorrect(String rawPassword) {
        return BCrypt.checkpw(rawPassword, this.password);
    }

    public void changePassword(String oldPassword, String newPassword) {
        if (!isPasswordCorrect(oldPassword)) {
            throw new IncorrectPasswordException();
        }
        this.password = BCrypt.hashpw(newPassword);
    }
}
```

**Key points**:
- Entities have unique identifiers
- Business rules are encapsulated in Domain objects
- The Domain layer is pure business logic, not dependent on any framework

<DomainModelDemo />

---

## 3. DTO: The "Translator" Between Layers

### 3.1 Motivation for DTOsing

**The problem**: If you return database entities directly to the frontend:

```java
// ❌ Wrong: directly returning Entity
@Entity
public class User {
    private Long id;
    private String username;
    private String password;        // Sensitive information!
    private Boolean isDeleted;      // Internal field!
}
```

The frontend would receive fields that should never be exposed, creating security risks.

**The solution**: Use DTOs as "translators"

```
Database Entity → Service Param/Result → Controller Request/Response → Frontend
```

### 3.2 Types of DTOs

| Type | Purpose | Example |
|------|---------|---------|
| Request DTO | Controller receives parameters | UserCreateRequest |
| Response DTO | Controller returns data | UserResponse |
| Param DTO | Service method parameters | UserParam |
| Result DTO | Service returns results | UserResult |
| Entity | Database mapping | User |

**Key principle**:
Each layer uses its own DTOs — never pass entities directly. DTOs contain only necessary fields, which avoids exposing internal implementation details and preserves the independence of each layer.

<DtoFlowDemo />

---

## 4. Dependency Direction: The Iron Rule of Layered Architecture

### 4.1 Dependency Inversion Principle

**Wrong approach**:
```
Controller → UserServiceImpl → UserDaoImpl → UserEntity
```

**Correct approach**:
```
Controller → UserService (interface) → UserRepository (interface) → UserEntity
```

**Dependency direction**:

The correct dependency direction has all layers depending on more abstract, more stable layers. Specifically, Controller depends on the Service interface, Service depends on the Repository interface, all layers depend on the Domain layer, and the Domain layer depends on no other layer. This dependency direction ensures the independence and testability of business logic.

Wrong practices include Service directly depending on a Repository implementation class, Controller directly accessing the database, or the Domain layer depending on other layers — all of which increase coupling and reduce system maintainability.

### 4.2 Code Example

```java
// ✅ Correct: depends on interfaces
@Service
public class OrderService {
    private final OrderRepository orderRepository;  // interface
    private final PaymentService paymentService;    // interface
}

// ✅ Implementation class injected automatically by Spring
@Repository
public class OrderRepositoryImpl implements OrderRepository {
    // Implementation details
}
```

<DependencyDirectionDemo />

---

## 5. Real-World Case Study: E-Commerce Order System

### 5.1 Requirements

Creating an order:
1. User selects products
2. Check inventory
3. Calculate total amount
4. Create the order
5. Deduct inventory

### 5.2 Implementation

**Domain Layer**:
```java
@Entity
public class Order {
    @Id
    private Long id;
    private Long userId;
    private List<OrderItem> items;
    private Money totalAmount;
    private OrderStatus status;

    public void calculateTotal() {
        Money total = Money.zero();
        for (OrderItem item : items) {
            total = total.add(item.getSubTotal());
        }
        this.totalAmount = total;
    }

    public void cancel() {
        if (this.status != OrderStatus.PENDING_PAYMENT) {
            throw new IllegalStateException("Only pending-payment orders can be cancelled");
        }
        this.status = OrderStatus.CANCELLED;
    }
}
```

**Repository Layer**:
```java
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
```

**Service Layer**:
```java
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final InventoryService inventoryService;

    @Transactional
    public OrderDTO createOrder(OrderParam param) {
        // 1. Validate products and reserve inventory
        for (OrderItemParam item : param.getItems()) {
            inventoryService.reserveStock(item.getProductId(), item.getQuantity());
        }

        // 2. Create order
        Order order = new Order();
        order.setUserId(param.getUserId());
        order.calculateTotal();

        // 3. Save order
        orderRepository.save(order);

        return OrderDTO.from(order);
    }
}
```

**Controller Layer**:
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@RequestBody @Valid OrderRequest request) {
        OrderParam param = OrderParam.builder()
                .userId(request.getUserId())
                .items(request.getItems())
                .build();

        OrderDTO order = orderService.createOrder(param);

        return OrderResponse.from(order);
    }
}
```

---

## 6. Frequently Asked Questions

### 6.1 Can the Controller contain business logic

The Controller should not contain business logic — it is only responsible for accepting requests and returning responses. Business logic should be encapsulated in the Service layer. The benefit is that code can be reused: for example, scheduled tasks or message queue consumers can directly call the Service without going through HTTP. Additionally, business logic concentrated in one place is easier to test and maintain, avoiding inconsistencies caused by scattered logic.

### 6.2 Overview of the Anemic Domain Model and Rich Domain Model

The **Anemic Domain Model** means entity classes contain only properties and their corresponding getter/setter methods, with no business logic — all business rules reside in the Service layer. This model is simple in structure, easy to understand, and is the approach adopted by most projects.

The **Rich Domain Model** means entity classes contain not only properties but also business methods related to the entity, encapsulating business rules within the entity itself. This approach aligns better with object-oriented design principles, keeping data and behavior together and improving code cohesion.

It is recommended to choose the model based on the team's technical background and project complexity. Whichever you choose, maintain consistency, and the Domain layer should at least include basic behavioral methods rather than being a completely empty shell.

### 6.3 Approach to handling transactions that span multiple Services

When a business operation needs to span multiple Services, use a `@Transactional` annotation on the upper-level Service method, and within that method, call the lower-level Services in sequence. This ensures all operations execute within the same transaction context — either all succeed or all fail, maintaining data consistency. Note that transaction boundaries should be as small as possible, including only necessary operations, to avoid holding database locks for extended periods and affecting concurrency performance.

---

## 7. Summary

| Layer | Responsibility | Keywords |
|-------|---------------|----------|
| Controller | Accept requests, validate parameters, call Service, return response | Receptionist |
| Service | Business logic orchestration, transaction management, coordinate Repository | Chef |
| Repository | Data access, ORM mapping, query encapsulation | Warehouse Keeper |
| Domain | Entity definition, business rules, value objects | Recipe Standards |

**Core principles**:
1. Each layer does only its own job
2. Layers communicate through interfaces
3. Business logic is concentrated in Service and Domain
4. Data access logic is concentrated in Repository
5. Use DTOs to isolate data structures between layers
---

## 8. More Architectural Patterns

This article introduces **Layered Architecture**, the most common and easiest backend architecture pattern to get started with. But backend architecture goes far beyond this one pattern — depending on the business context, there are other architectural patterns worth understanding:

### 8.1 Other Common Architectural Patterns

| Pattern | Use Case | Characteristics |
|---------|----------|-----------------|
| **Monolithic Architecture** | Small projects, MVP | All functionality in a single application, simple deployment |
| **Microservices Architecture** | Large, complex systems | Split into multiple independent services, each independently deployable |
| **Event-Driven Architecture** | High concurrency, async processing | Processing flows triggered by events, highly decoupled |
| **Clean Architecture** | Complex business systems | Business logic at the center, dependencies only point inward, frameworks on the outermost layer |
| **Hexagonal Architecture** | Systems needing diverse external adapters | Isolates core from external systems through ports and adapters |
| **Onion Architecture** | Domain-Driven Design | Concentric layers, domain model innermost, infrastructure outermost |

Let's explore each one:

#### Monolithic Architecture

All functionality packaged in a single application, sharing one database and one process.

```
┌──────────────────────────────┐
│       Monolithic App         │
│  ┌────┐ ┌────┐ ┌────┐       │
│  │User│ │Order│ │Pay │ ...   │
│  └──┬─┘ └──┬─┘ └──┬─┘       │
│     └──────┼──────┘          │
│        Shared Database       │
└──────────────────────────────┘
```

- **Pros**: Simple to develop, easy to deploy, straightforward local debugging
- **Cons**: High code coupling, hard to scale, one module failure can bring down the entire system
- **Best for**: Early-stage startups, single-team development, rapid prototype validation

#### Microservices Architecture

Splits the system into multiple independent services, each with its own data and business logic, independently deployable and scalable.

```
┌────────┐  ┌────────┐  ┌────────┐
│User Svc│  │Order Svc│ │Pay Svc │
│  DB-1  │  │  DB-2  │  │  DB-3  │
└───┬────┘  └───┬────┘  └───┬────┘
    └───────────┼───────────┘
          API Gateway
```

- **Pros**: Independent deployment and scaling, flexible technology stack, fault isolation
- **Cons**: Complex inter-service communication, challenging distributed data consistency, requires mature DevOps capabilities
- **Best for**: Large complex systems, multi-team collaboration, scenarios requiring independent scaling

#### Event-Driven Architecture

Communication through asynchronous events — producers emit events, consumers respond to events, with highly decoupled components.

```
Producer ──→ [Event Bus / Message Queue] ──→ Consumer A
                                          ──→ Consumer B
                                          ──→ Consumer C
```

- **Pros**: Highly decoupled, naturally supports scaling, ideal for real-time processing
- **Cons**: Difficult debugging, event ordering and idempotency require extra handling
- **Best for**: Real-time data analysis, IoT systems, async communication between microservices

#### Clean Architecture

Proposed by Robert C. Martin, the system is divided into four concentric layers with dependencies pointing only inward:

```
┌─────────────────────────────────────┐
│  Frameworks & Drivers               │
│  ┌─────────────────────────────┐    │
│  │  Interface Adapters          │    │
│  │  ┌─────────────────────┐    │    │
│  │  │  Use Cases            │    │    │
│  │  │  ┌─────────────┐     │    │    │
│  │  │  │  Entities    │     │    │    │
│  │  │  │  (Domain)    │     │    │    │
│  │  │  └─────────────┘     │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
      Dependency direction: outer → inner
```

- **Core rule**: Inner layers know nothing about outer layers; business logic is completely independent of frameworks and databases
- **Pros**: High testability, replaceable technology stack, clear business logic
- **Cons**: Higher initial development cost, lots of inter-layer mapping code, risk of over-engineering in small projects
- **Best for**: Complex business systems, projects requiring long-term maintenance

<CleanArchitectureDemo />

#### Hexagonal Architecture (Ports & Adapters)

Defines input/output interfaces for the core business through "ports," and connects external systems through "adapters":

```
        ┌─────────────┐
  HTTP ──→ Port       │
  CLI  ──→ (Inbound)  │  Core Business  │  (Outbound) ──→ Database
  MQ   ──→            │  Logic           │  Port      ──→ External API
        └─────────────┘
```

- **Core idea**: Business logic does not depend on any external technology; external systems connect through adapters
- **Pros**: External systems can be freely swapped; testing only requires mock adapters
- **Best for**: Scenarios requiring integration with diverse external systems

#### Onion Architecture

Similar to Clean Architecture, emphasizes the domain model at the innermost layer and infrastructure at the outermost, with dependencies only pointing inward:

```
┌──────────────────────────────┐
│  Infrastructure              │
│  ┌────────────────────────┐  │
│  │  Application Services  │  │
│  │  ┌──────────────────┐  │  │
│  │  │  Domain Services  │  │  │
│  │  │  ┌────────────┐   │  │  │
│  │  │  │Domain Model│   │  │  │
│  │  │  └────────────┘   │  │  │
│  │  └──────────────────┘  │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

- **Core idea**: The domain model is the core of the system; all dependencies point toward it
- **Difference from Clean Architecture**: Onion Architecture emphasizes the domain service layer more; Clean Architecture emphasizes the use case layer more
- **Best for**: Projects adopting Domain-Driven Design (DDD)

### 8.2 Architecture Evolution Path

These architectures are not mutually exclusive alternatives — they represent a gradual evolution:

```text
Traditional Layered Architecture (N-Layered)
  │  Problem: inter-layer coupling, hard to replace external dependencies
  ▼
Hexagonal Architecture (Ports & Adapters)
  │  Improvement: use ports and adapters to isolate external systems
  ▼
Onion Architecture
  │  Improvement: explicit concentric layering, domain model at the center
  ▼
Clean Architecture
  │  Improvement: unified dependency rules, clear four-layer responsibilities
  ▼
Choose the right architecture based on business needs
```

### 8.3 Architecture Selection Guide

```text
Users < 1k, Code < 5,000 lines
    ↓
Monolithic + Simple Layering
    ↓
Users 1k–100k, requires multi-team collaboration
    ↓
Layered Architecture (this article)
    ↓
Users > 100k, high business complexity
    ↓
Microservices / Event-Driven Architecture
```

More detailed selection dimensions:

| Factor | Simple Layering | Clean/Hexagonal Architecture | Microservices |
|--------|----------------|------------------------------|---------------|
| Team size | 1–5 people | 5–20 people | 20+ people |
| Business complexity | Low | Medium–High | High |
| Deployment frequency | Low | Medium | High (independent deployment) |
| Technology stack diversity | Single | Single | Can be diverse |
| Operations cost | Low | Medium | High |

### 8.4 Recommended Reading

- **Monolithic Architecture**: See the companion article [`backend-project-architecture.md`](./backend-project-architecture.md) for the evolution from scripts to monoliths
- **Microservices Architecture**: See [From Monolith to Microservices](/en/appendix/6-architecture-and-system-design/monolith-to-microservices)
- **Clean Architecture**: Robert C. Martin's *Clean Architecture* — the classic that introduced dependency rules and the four-layer concentric model
- **Enterprise Architecture Patterns**: Martin Fowler's *Patterns of Enterprise Application Architecture* — the authoritative reference on layered architecture and domain logic organization

### 8.5 Approach to choosing

**Remember this principle**: **Architecture serves the business — don't do architecture for architecture's sake**.

- Small projects: use simple architecture, ship fast to validate
- Large projects: consider complex architecture when needed, avoid over-engineering
- Team familiarity matters too — choose solutions everyone can understand

---

## 9. Summary

| Layer | Responsibility | Keywords |
|-------|---------------|----------|
| Controller | Accept requests, validate parameters, call Service, return response | Receptionist |
| Service | Business logic orchestration, transaction management, coordinate Repository | Chef |
| Repository | Data access, ORM mapping, query encapsulation | Warehouse Keeper |
| Domain | Entity definition, business rules, value objects | Recipe Standards |

**Core principles**:

The core of layered architecture lies in clear responsibility division and dependency direction control. Each layer focuses only on its own responsibilities, communicates with adjacent layers through interfaces, concentrates business logic in the Service and Domain layers, concentrates data access logic in the Repository layer, and isolates data structures between layers through DTOs to avoid directly exposing internal implementation. This design makes the system easier to understand, test, and maintain, capable of supporting continuous business evolution.

---

## References

1. [Catalog of Patterns of Enterprise Application Architecture - Martin Fowler](https://www.martinfowler.com/eaaCatalog/) — Martin Fowler's catalog of enterprise application architecture patterns, the classic reference for layered architecture
2. [Backend Side Architecture Evolution (N-layered, DDD, Hexagon, Onion, Clean Architecture)](https://medium.com/@iamprovidence/backend-side-architecture-evolution-n-layered-ddd-hexagon-onion-clean-architecture-643d72444ce4) — The evolution from N-Layered to Clean Architecture, understanding why each pattern emerged
3. [Complete Guide to Clean Architecture - GeeksforGeeks](https://www.geeksforgeeks.org/complete-guide-to-clean-architecture/) — A complete guide to Clean Architecture, covering layers, dependency rules, and separation of concerns
4. [Understanding Hexagonal, Clean, Onion, and Traditional Layered Architectures: A Deep Dive](https://romanglushach.medium.com/understanding-hexagonal-clean-onion-and-traditional-layered-architectures-a-deep-dive-c0f93b8a1b96) — An in-depth comparison of Hexagonal, Clean, Onion, and Traditional Layered Architectures
5. [Building Clean Architectures in Modern Backend Frameworks](https://leapcell.io/blog/building-clean-architectures-in-modern-backend-frameworks) — A practical guide to implementing Clean Architecture in modern backend frameworks
6. [Backend Architecture Patterns: From Monoliths to Microservices](https://nerdleveltech.com/backend-architecture-patterns-from-monoliths-to-microservices) — A panoramic overview of backend architecture patterns from monoliths to microservices
7. [MVC Three-Layer Architecture Case Study](https://www.cnblogs.com/TheMagicalRainbowSea/p/17409206.html) — The relationship between MVC and three-layer architecture with practical examples, suitable for Chinese readers getting started

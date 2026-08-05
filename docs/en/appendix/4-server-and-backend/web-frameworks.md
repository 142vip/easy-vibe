# Principles of Web Frameworks
::: tip 🎯 Core Question
**You've written the code — how do you make it accessible to people around the world?** It's like asking: do you want to open a roadside food stall, or run a multinational restaurant chain? Your choice of backend architecture determines how many customers your "restaurant" can serve.
:::

---

## 1. Motivation for Understanding Architectural Evolution

Imagine you're planning a long-distance trip. You could choose to ride a bicycle, drive a car, take a high-speed train, or fly. Each mode of transport has its own sweet spot: a bicycle works for short distances when you want exercise; a plane is ideal for transcontinental journeys.

**The same goes for backend architecture choices.**

From the birth of the internet to today, backend architecture has undergone several major transformations. Each transformation wasn't about "chasing the new" — it was about solving specific problems at the time:

| Era   | Core Problem                                    | Architectural Evolution        |
| ----- | ----------------------------------------------- | ------------------------------ |
| 1990s | How to get a website running                    | Physical servers               |
| 2000s | Code is getting messy — how to maintain it      | Monolithic architecture + MVC  |
| 2010s | Systems are too large — how to scale and collaborate | Microservices + containerization |
| 2020s | How to reduce operational costs and complexity  | Serverless + cloud-native      |

::: tip 📊 What can you see from this table?
Let's interpret it row by row:

**1990s → 2000s**: From "just get it running" to "it needs to be maintainable." Websites evolved from static pages to dynamic applications, and code volume exploded — better organization was needed.

**2000s → 2010s**: From "single machine" to "distributed." User numbers grew exponentially; a single server couldn't handle the load anymore. Systems needed to be split and scaled horizontally.

**2010s → 2020s**: From "self-managed operations" to "cloud services." Containers and microservices, while powerful, came with high operational costs. Serverless lets developers focus solely on business logic.

**Core insight**: Architectural evolution isn't a game of technology selection — it's a process of **solving real problems**. Every stage has its applicable scenarios. There is no "best architecture," only the "most suitable architecture."
:::

**The value of understanding architectural evolution:**

1. **Avoid reinventing the wheel**: Many "new" concepts had prototypes decades ago. Understanding history lets you stand on the shoulders of giants.
2. **Make sound technology choices**: There is no best architecture, only the one best suited to your current stage.
3. **Understand the trade-offs behind technology**: Every architectural evolution involves balancing **development efficiency**, **system performance**, and **operational complexity**.
4. **Anticipate technology trends**: History rhymes. Understanding past evolutionary patterns helps you grasp future directions.

<EvolutionIntroDemo />

---

## 2. The Physical Server Era (1990s)

### 2.1 Overview of a Physical Server

When the internet was just getting started, the backend was simply a **physical server** (a real computer) sitting in a data center.

::: tip 💡 In Plain English
A **physical server** is like your desktop computer at home, but it:

- Runs 24/7 without shutting down
- Sits in a dedicated data center (with air conditioning, UPS power, fire suppression systems)
- Has faster network bandwidth (enterprise-grade fiber)
- Has a fixed public IP address (accessible from anywhere in the world)

It's like your home kitchen vs. a restaurant: your home kitchen cooks occasionally; a restaurant is a professional kitchen, open all day, with professional-grade equipment.
:::

### 2.2 Core Characteristics

- **Single-machine deployment**: All applications run on one physical machine
- **Manual operations**: Requires manual racking, cabling, and system installation
- **Vertical scaling**: When performance is insufficient, the only option is to buy a more powerful machine

::: details 🔧 Vertical Scaling vs. Horizontal Scaling
**Vertical Scaling** (Scale Up): Upgrading a single server's configuration (more CPU, more RAM, faster disks).

**Horizontal Scaling** (Scale Out): Adding more servers and having them work together.

**Analogy**:

- Vertical scaling: Turning a small restaurant into a larger one with fancier decor, but still only one chef
- Horizontal scaling: Opening a chain — each location is modest, but there are 100 of them

**Pros and Cons**:

- Vertical scaling is simple but has a ceiling (top-tier servers are expensive and have limits)
- Horizontal scaling is theoretically unlimited but requires solving data consistency challenges
:::

### 2.3 Pain Points

- **Slow**: Every code change required manual upload and server restart
- **Expensive**: Scaling meant buying bigger machines (vertical scaling only)
- **Hard to scale**: One machine handles all requests; when the CPU is maxed out, everyone queues up

<PhysicalServerDemo />

### 2.4 Pros and Cons of the Physical Server Era

| Dimension            | Assessment                                                    |
| -------------------- | ------------------------------------------------------------- |
| **Pros**             | Full hardware control, predictable performance; no virtualization overhead; physical data isolation, high security |
| **Cons**             | Long procurement cycles (weeks); high upfront investment (CapEx); low resource utilization; difficult to scale |
| **Suitable for**     | Financial core systems, government classified systems, scenarios with strict data sovereignty requirements |

::: tip 💡 CapEx vs. OpEx
**CapEx** (Capital Expenditure): A large one-time investment to purchase hardware.

**OpEx** (Operating Expenditure): Pay-as-you-go based on usage (e.g., cloud servers).

**Analogy**:

- CapEx: Buying a house — pay a large lump sum upfront, then only monthly property fees
- OpEx: Renting — pay monthly rent, no huge upfront cost

**Cloud-era insight**: Serverless and cloud services enable more companies to shift from CapEx to OpEx, lowering the barrier to starting a business.
:::

---

## 3. The Monolithic Architecture Era (2000s)

### 3.1 Overview of Monolithic Architecture

With the rise of frameworks (Rails / Django / Spring), everyone started packing all functionality into a single application.

::: tip 💡 In Plain English
**Monolithic architecture** (Monolith) is like a super-mall:

- Clothing, food, and electronics sections are all in the same building
- All employees work within a single management system
- If the whole building loses power, every section shuts down

In contrast, microservices are like a commercial street: each shop operates independently; one shop closing doesn't affect the others.
:::

<MonolithDemo />

### 3.2 Core Characteristics

- **Single codebase**: All functional modules live in the same project
- **Shared database**: All modules share the same database
- **Unified deployment**: The entire application is packaged and deployed as a whole

### 3.3 Advantages

- **Simple to develop**: One project handles all functionality
- **Easy to deploy**: Just throw one big package onto the server
- **Easy to debug**: Start it locally and you can debug everything

### 3.4 Pain Point: The Avalanche Effect

Imagine the chef "chopping vegetables" accidentally cuts their hand (a bug in the code). The entire kitchen has to stop to treat the wound, and every customer goes hungry.

This is the biggest risk of monolithic architecture: **poor isolation**.

::: details 🚨 A Real Avalanche Case
An e-commerce company during a Double 11 mega-sale:

- The order service throws an exception due to a pricing calculation error on a specific item
- The exception isn't properly caught, exhausting the thread pool
- All subsequent requests (including product browsing, search, user login) get blocked
- The entire website goes down completely for 1 hour

**If they had used microservices**:

- The order service would be down, but product browsing, search, and user login would still work
- Users could at least continue browsing products, minimizing losses
:::

### 3.5 Pros, Cons, and Suitable Scenarios for Monolithic Architecture

| Dimension              | Assessment                                                                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pros**               | Simple to develop, no distributed complexity to worry about; easy to debug — start locally and debug everything; simple deployment — one package runs it all; easy transaction management — a single-machine database ensures ACID |
| **Cons**               | High code coupling, codebase bloats as the business grows; single technology stack, hard to upgrade partially; difficult to scale — can only scale the whole thing; poor fault isolation — one module failure affects the entire system; low team collaboration efficiency — many people editing the same codebase |
| **Suitable for**       | Startup MVP validation, small teams (<10 people), relatively simple business, scenarios where delivery speed matters more than scalability |
| **Not suitable for**   | Large teams doing parallel development, scenarios requiring frequent independent module releases, scenarios where certain modules need independent scaling |

::: tip 🎯 Advice for Beginners
If you're learning backend development, **I strongly recommend starting with monolithic architecture**:

1. **Learn to walk first**: Understand HTTP, databases, and basic MVC architecture
2. **Then consider running**: When your project genuinely encounters scalability issues, then consider microservices
3. **Avoid over-engineering**: Many companies' "microservices" are actually "distributed monoliths" — even harder to maintain

**Learning path**:

- Phase 1: Build a complete monolithic application with Spring Boot / Django / Rails
- Phase 2: When you hit performance bottlenecks, try splitting out 1–2 services
- Phase 3: When the team exceeds 50 people and the system is genuinely complex, then go full microservices
:::

### 3.6 Technology Stack for Monolithic Architecture

| Language/Framework                  | Characteristics                           | Representative Companies      |
| ----------------------------------- | ----------------------------------------- | ----------------------------- |
| **Java + Spring**                   | Enterprise-grade development standard, mature ecosystem | Alibaba, JD.com               |
| **PHP + Laravel/ThinkPHP**          | Rapid development, suitable for small-to-medium projects | Early Facebook, Weibo         |
| **Python + Django/Flask**           | High development efficiency, great for rapid prototyping | Instagram, Pinterest          |
| **Ruby on Rails**                   | Convention over configuration, startup favorite | GitHub, Twitter (early days)  |
| **Node.js + Express**               | Unified language for frontend and backend, I/O-intensive scenarios | Netflix, Uber                 |

---

## 4. Containerization and Microservices (2010s)

### 4.1 Motivation for Microservicesing

The pain points of monolithic architecture erupted in the 2010s:

- **Code too massive**: A project with millions of lines of code — new hires need a month just to understand it
- **Deployment too slow**: A build takes 30 minutes; every release requires extreme caution
- **Collaboration too hard**: 100 developers editing the same project — code conflicts happen daily
- **Scaling too expensive**: You only need to scale the "chat service," but you have to replicate the entire application

**The core idea of microservices**: Split the big application into many small services, each:

- Independently developed and deployed
- With its own database
- Communicating via APIs

<ContainerDockerDemo />

::: tip 💡 What Is Docker?
**Docker** is like a "shipping container":

- Each container holds independent cargo (code + dependencies + runtime environment)
- No matter where it's shipped (which server), you open the container and it's ready to work
- No more worrying about "this machine doesn't have Python 3.9" or "that machine is missing a library"

**Analogy**:

- Without Docker: Every time you move, you have to carry furniture, appliances, and clothes piece by piece onto the truck, then arrange them one by one at the new place
- With Docker: Everything is packed into a container; the truck moves it directly; at the new place, you drop it and it's ready to use

**Core value**: "Build once, run anywhere."
:::

### 4.2 Technology Stack Timeline

<TechStackTimelineDemo />

### 4.3 Microservices Architecture

To solve the monolith's problems, we split the big kitchen into many small kitchens (services):

- A service dedicated to users
- A service dedicated to orders
- A service dedicated to payments

<MicroservicesDemo />

### 4.4 Kubernetes Orchestration

When the number of containers reaches hundreds or thousands, you need a "port dispatching system":

- **Kubernetes (K8s)**: Responsible for scheduling containers onto appropriate machines (scheduling, scaling, rolling updates)
- **Service Mesh**: Responsible for traffic rules between services (circuit breaking, rate limiting, retries, observability)

<KubernetesDemo />

::: tip 💡 What Is "Orchestration"?
**Orchestration** refers to a system that automatically manages large numbers of containers.

**Analogy**:

- Without K8s: You manually manage 100 containers — restart the ones that crash, add machines manually when traffic spikes
- With K8s: You tell it "I want this service to always have 10 instances running," and it automatically:
  - Schedules containers to servers with sufficient resources
  - Auto-restarts containers that crash
  - Auto-scales to 20 instances when traffic spikes
  - Performs rolling updates when deploying new code (stop one old instance, start one new instance, replace one by one)

**Key point**: Microservices aren't just about "splitting things up." The real challenge lies in **governance and operations**.
:::

### 4.5 Pros and Cons of Microservices and Containerization

| Dimension              | Assessment                                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pros**               | Independent service deployment, heterogeneous technology stacks possible; fault isolation — a single service crash doesn't affect the whole; on-demand scaling — scale only hot services; team-friendly — different teams own different services; smaller codebases, easier to understand and maintain |
| **Cons**               | High distributed complexity (network latency, distributed transactions, service discovery); high operational cost, requires a professional DevOps team; difficult to debug — issues may need tracing across multiple services; hard to guarantee data consistency; complex deployment and monitoring infrastructure requirements |
| **Suitable for**       | Large teams (>50 people), complex business requiring independent module evolution, certain modules needing independent scaling, multi-language tech stacks, systems with high availability requirements |
| **Not suitable for**   | Small teams, simple business, low and stable traffic, situations without a professional operations team |

::: details ⚠️ Microservices Pitfalls
**Pitfall 1: The Distributed Monolith**

You split into 10 microservices, but they're tightly coupled:

- Service A calls Service B, Service B calls Service C, Service C calls Service A again
- Changing one feature requires modifying 5 services simultaneously
- Deployment must follow a strict sequence, or the system throws errors

**This is worse than a monolith**: you have all the complexity of a monolith without enjoying the independent deployment benefits of microservices.

**Pitfall 2: Over-Splitting**

Splitting a 100-line feature into its own independent service:

- 10 services, each with only 100 lines of code
- The overhead of inter-service communication (network serialization/deserialization) outweighs the actual business logic
- Operational costs explode: you need to deploy, monitor, and collect logs for 10 services

**The right approach**: Split from the perspective of functional cohesion. A microservice should represent a complete business capability (e.g., "Order Service," not "Order Creation Service" and "Order Query Service").
:::

### 4.6 Microservices Technology Stack

| Category              | Technology/Tool                     | Purpose                              |
| --------------------- | ----------------------------------- | ------------------------------------ |
| **Containerization**  | Docker, containerd                  | Application packaging and isolation  |
| **Orchestration**     | Kubernetes, Docker Swarm            | Container management and auto-scaling |
| **Service Discovery** | Consul, etcd, ZooKeeper             | Service registration and discovery   |
| **API Gateway**       | Kong, Zuul, Envoy                   | Unified entry point, routing, rate limiting |
| **Config Center**     | Apollo, Nacos, Spring Cloud Config  | Centralized configuration management |
| **Monitoring & Alerting** | Prometheus, Grafana, ELK         | Metrics monitoring and log analysis  |
| **Distributed Tracing** | Jaeger, Zipkin, SkyWalking        | Distributed request tracing          |
| **Service Mesh**      | Istio, Linkerd                      | Traffic governance and security      |

---

## 5. The Serverless and Cloud-Native Era (2020s+)

### 5.1 Motivation for Serverlessing

Microservices are great, but maintaining dozens of small kitchens is still exhausting. You still need to worry about:

- Is the kitchen big enough? (server scaling)
- What if the power goes out? (high availability)
- How to manage so many containers? (operational costs)

<ServerlessDemo />

::: tip 💡 Serverless Doesn't Mean "No Servers"
**Serverless** means "you don't need to manage servers," not that there are literally no servers.

**Analogy**:

- **Physical server era**: You buy the land, build the house, decorate, hire chefs, buy ingredients... everything yourself
- **Cloud server era**: You rent an already-renovated restaurant, but you still hire chefs and manage operations
- **Serverless era**: You only need to design the menu. The cloud has a shared kitchen with professional chefs. You place orders, they cook, and you pay per use

**The core change**:

- Before: Buy servers → configure environments → deploy code → monitor → scale → maintain
- Now: Write code → upload → pay per usage

**It's like food delivery**: you don't need a kitchen — you just design the menu, and someone else does the cooking.
:::

### 5.2 Overview of Serverless

**Serverless = FaaS + BaaS**

**FaaS** (Function as a Service):

- You only write functions (e.g., "send a welcome email when a user registers")
- The cloud provider runs the function and auto-scales it
- Typical examples: AWS Lambda, Alibaba Cloud Function Compute

**BaaS** (Backend as a Service):

- Authentication → Auth0 / Supabase Auth
- Payments → Stripe
- Database → Supabase / Firebase / DynamoDB
- Messaging → Kafka / SQS

::: tip 🎯 Serverless Use Cases
**Best scenarios**:

1. **Tidal traffic**: Food delivery apps — heavy traffic at noon, almost none at midnight. Serverless automatically allocates 1,000 machines at noon and scales down to 0 at midnight
2. **Event-driven**: "When a user uploads an image, automatically compress it"
3. **Rapid validation**: Small teams, MVPs, hackathon projects

**Unsuitable scenarios**:

1. **Long-running tasks**: Video transcoding (may run for 1 hour, but function max execution time is typically 15 minutes)
2. **Low-latency applications**: High-frequency trading (cold start latency can range from tens of milliseconds to several seconds)
3. **Fine-grained low-level control**: OS kernel tuning, direct GPU access
:::

### 5.3 Pros and Cons of Serverless and Cloud-Native

| Dimension              | Assessment                                                                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pros**               | Zero operational cost — developers only focus on business code; automatic scaling, perfectly handles traffic spikes; pay-per-use, near-zero cost when idle; rapid time-to-market, deploy globally in minutes; built-in high availability, cloud services handle failover automatically |
| **Cons**               | Cold start latency (hundreds of milliseconds to several seconds); runtime duration limits (typically 5–15 minutes); difficult to debug — hard to fully simulate the cloud environment locally; vendor lock-in risk; unsuitable for long-running or compute-intensive tasks; costs can exceed traditional approaches under sustained high traffic |
| **Suitable for**       | Event-driven processing (image processing, message notifications); tidal traffic applications (campaign pages, promotions); rapid prototyping and MVP validation; low-frequency APIs or background tasks; small teams without dedicated operations |
| **Not suitable for**   | Applications requiring consistently low latency; long-running compute tasks; scenarios sensitive to cold starts (high-frequency trading); scenarios requiring fine-grained control over underlying infrastructure |

::: details 💰 Cost Comparison: When Is Serverless More Expensive?
**Scenario 1: Low-frequency access**

- Traditional server: $20/month (regardless of traffic)
- Serverless: 1 million requests × $0.0002/request = $20 (pay only when there's traffic)
- **Conclusion**: For low-frequency scenarios, Serverless is cheaper

**Scenario 2: High-frequency sustained access**

- Traditional server: $20/month
- Serverless: 100 million requests × $0.0002/request = $20,000
- **Conclusion**: For sustained high-frequency scenarios, traditional servers are cheaper

**Scenario 3: Tidal traffic**

- Traditional server: To handle peak traffic, you need a $100/month server (average resource utilization is only 10%)
- Serverless: $20 during peaks, nearly $0 during off-peak
- **Conclusion**: For tidal traffic scenarios, Serverless saves costs

**Takeaway**: Don't blindly adopt Serverless. Run cost estimates based on your actual traffic patterns.
:::

### 5.4 Serverless Technology Stack and Platforms

| Category         | Technology/Platform      | Characteristics                                   |
| ---------------- | ------------------------ | ------------------------------------------------- |
| **FaaS Platforms** | AWS Lambda               | The earliest FaaS service, most mature ecosystem  |
|                  | Azure Functions          | Deep Microsoft cloud integration, .NET-friendly   |
|                  | Google Cloud Functions   | Deep integration with GCP services                |
|                  | Alibaba Cloud Function Compute | Mature domestic ecosystem, good cold-start optimization |
|                  | Tencent Cloud SCF        | Integrated with WeChat ecosystem                  |
|                  | Vercel/Netlify Functions | Frontend-developer-friendly, edge deployment      |
| **BaaS Services** | Firebase                 | Google's mobile backend solution                  |
|                  | Supabase                 | Open-source Firebase alternative for PostgreSQL   |
|                  | AWS Amplify              | AWS development platform for mobile and web apps  |
| **Deployment Tools** | Serverless Framework   | Multi-cloud deployment, active community          |
|                  | Terraform                | Infrastructure as Code                            |
|                  | Pulumi                   | Define infrastructure using programming languages |

---

## 6. Architecture Comparison and Selection Guide

### 6.1 Full Architecture Evolution Comparison

<ArchitectureComparisonDemo />

| Dimension                  | Physical Servers         | Monolithic Architecture | Microservices + Containers     | Serverless            |
| -------------------------- | ------------------------ | ----------------------- | ------------------------------ | --------------------- |
| **Team Size**              | 1–5 people               | 5–50 people             | 50–500 people                  | 1–20 people           |
| **Deployment Complexity**  | Extremely high           | Low                     | Extremely high                 | Extremely low         |
| **Operational Cost**       | High                     | Medium                  | Very high                      | Low                   |
| **Scalability**            | Poor                     | Limited vertical scaling| Excellent horizontal scaling   | Auto-scaling          |
| **Tech Stack Flexibility** | None                     | Single                  | Diverse                        | Limited               |
| **Cold Start**             | None                     | None                    | Container startup time         | Has latency           |
| **Suitable for**           | Legacy systems, special compliance requirements | Startups, simple business | Large internet companies, complex business | Rapid validation, event-driven |

### 6.2 Technology Selection Decision Tree

```
Start Selection
    │
    ├─ Does the team have professional ops personnel?
    │   ├─ Yes → Consider microservices or physical machines
    │   └─ No → Continue evaluating
    │
    ├─ Need to launch quickly to validate an idea?
    │   ├─ Yes → Serverless or monolith
    │   └─ No → Continue evaluating
    │
    ├─ Team size > 50 people?
    │   ├─ Yes → Consider microservices
    │   └─ No → Continue evaluating
    │
    ├─ Does traffic have clear peak/off-peak patterns?
    │   ├─ Yes → Serverless
    │   └─ No → Monolithic architecture (recommended for startups)
    │
    └─ Special requirements (compliance, legacy systems)?
        └─ Yes → Physical servers
```

::: tip 🎯 Selection Advice for Beginners
**If you're an individual developer or a small team:**

1. **Phase 0 (Learning)**: Run a monolithic app locally; understand HTTP, databases, and basic architecture
2. **Phase 1 (MVP)**: Deploy the monolithic app to a cloud server (e.g., Alibaba Cloud ECS, AWS EC2)
3. **Phase 2 (Growth)**: When the team exceeds 10 people and the business becomes complex, consider splitting out 1–2 microservices
4. **Phase 3 (Maturity)**: When the team exceeds 50 people and traffic reaches millions, go full microservices

**Key principle**: Don't start with microservices — that's "premature optimization." Let the architecture evolve as the business grows.
:::

### 6.3 Recommended Architecture for Different Scenarios

#### Scenario 1: Solo Developer / Side Project

- **Recommended architecture**: Serverless (Vercel/Netlify) or monolithic application
- **Rationale**: Near-zero operational cost, pay-per-use, rapid time-to-market
- **Example tech stack**: Next.js + Vercel + Supabase

#### Scenario 2: Startup MVP Validation

- **Recommended architecture**: Monolithic architecture + cloud server
- **Rationale**: Fast development speed; the team can focus on business logic rather than infrastructure
- **Example tech stack**: Spring Boot / Django / Rails + RDS + ECS

#### Scenario 3: Growing Company (10–50 person team)

- **Recommended architecture**: Modular monolith or lightweight microservices
- **Rationale**: Starting to face code coupling issues, but not yet needing full microservices complexity
- **Example tech stack**: Spring Cloud / Go Micro + Kubernetes

#### Scenario 4: Large Internet Company

- **Recommended architecture**: Microservices + Service Mesh + middle-platform architecture
- **Rationale**: Large team, complex business, need independent release cadences and technology stacks
- **Example tech stack**: In-house RPC framework + Istio + self-built PaaS platform

#### Scenario 5: Event-Driven / Tidal Traffic Applications

- **Recommended architecture**: Serverless + event bus
- **Rationale**: High traffic volatility, need extreme cost optimization and auto-scaling
- **Example tech stack**: AWS Lambda + API Gateway + EventBridge

---

## 7. Summary and Learning Roadmap

### 7.1 Key Takeaways

The evolution of backend architecture is fundamentally about **addition** and **subtraction**:

| Era              | Architecture | What Developers Do              | What Ops Do                          |
| :--------------- | :----------- | :------------------------------ | :----------------------------------- |
| **Physical Era** | Single machine | Write scripts, deploy manually | Maintain data centers and hardware   |
| **Monolith Era** | One big block | Write all business logic       | Maintain a few large servers         |
| **Microservices Era** | Split up  | Focus on a single business domain | Maintain K8s clusters (exhausting!) |
| **Serverless**   | Functions    | Write only core functions      | Drink tea (cloud provider handles everything) |

**Key insights**:

- Architectural evolution isn't "new technology replacing old technology" — it's about **changes in applicable scenarios**
- There is no silver bullet; every architecture has its boundaries
- When choosing an architecture, consider: team size, business complexity, traffic patterns, and operational capability

### 7.2 Recommended Learning Roadmap

Based on your career stage, here are the recommended learning paths:

#### Phase 1: Build the Foundation (0–1 year)

**Goal**: Understand core backend concepts; be able to independently develop a monolithic application

- Master one backend language (choose from Java/Python/Go)
- Learn the HTTP protocol and RESTful API design
- Master relational databases (MySQL/PostgreSQL)
- Understand caching basics (Redis)
- Learn Git and basic Linux commands
- **Practice project**: Build a CRUD application with monolithic architecture (e.g., a blog system, a to-do app)

#### Phase 2: Expand Capabilities (1–3 years)

**Goal**: Understand distributed systems; be able to participate in microservices development

- Deep-dive into microservices architecture and splitting strategies
- Master Docker and Kubernetes basics
- Learn message queues (Kafka/RabbitMQ)
- Understand distributed transactions and consistency
- Master monitoring and logging (Prometheus/ELK)
- **Practice project**: Split a monolithic application into 3–5 microservices and deploy with Docker

#### Phase 3: Professional Deepening (3–5 years)

**Goal**: Be able to design large-scale systems; possess technology selection skills

- Deeply understand cloud-native architecture (Service Mesh, Serverless)
- Master capacity planning and performance tuning
- Understand multi-active architecture and disaster recovery design
- Learn DDD (Domain-Driven Design)
- Cultivate technical judgment and architectural thinking
- **Practice project**: Design a system architecture supporting millions of users, including high availability and elastic scaling solutions

### 7.3 Recommended Continuous Learning Resources

**Books**:

- *Designing Data-Intensive Applications* (DDIA) — essential reading for distributed systems
- *Cloud Native Patterns*
- *Building Microservices*
- *Domain-Driven Design*

**Online Resources**:

- Official architecture documentation from AWS/Azure/Alibaba Cloud
- CNCF (Cloud Native Computing Foundation) project documentation
- Tech blogs from major companies (Netflix Tech Blog, Alibaba Tech, etc.)

---

## 8. Glossary

| Term              | Full Name                         | Explanation                                                          |
| :---------------- | :-------------------------------- | :------------------------------------------------------------------- |
| **Backend**       | —                                 | Server-side system responsible for business logic, data storage, and external APIs |
| **CGI**           | Common Gateway Interface          | Early dynamic web technology; processes requests via scripts and returns results |
| **Monolith**      | —                                 | Monolithic architecture; packages all business logic in a single application |
| **Microservices** | —                                 | Microservices architecture; splits business logic into multiple independent services |
| **Container**     | —                                 | Containerization technology; packages applications and dependencies into portable units |
| **K8s**           | Kubernetes                        | Container orchestration platform for scheduling, scaling, and governing containers |
| **Service Mesh**  | —                                 | Service mesh; responsible for inter-service communication governance, observability, and security in microservices |
| **Serverless**    | —                                 | Serverless computing; developers write only functions, the platform automatically runs and scales them |
| **BaaS**          | Backend as a Service              | Plug-and-play backend cloud services (authentication, database, payments, etc.) |
| **CI/CD**         | Continuous Integration / Delivery | Automated testing and deployment pipelines |
| **Observability** | —                                 | Using logs, metrics, and traces to understand system runtime state |
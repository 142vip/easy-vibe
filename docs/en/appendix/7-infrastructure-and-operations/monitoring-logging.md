# Principles of Monitoring, Logging, and Alerting
> 💡 **Learning Guide**: This chapter requires no programming background. Through interactive demos, you'll gain a comprehensive understanding of operations — from monitoring and alerting to troubleshooting, from capacity planning to automated operations, mastering all the skills needed to run production systems.

## 0. Introduction: Deployment Is Just the Beginning

Many beginners think: "Once the code is deployed, the job is done."

**That couldn't be more wrong!**

Deployment is merely the **starting point of operations work**. It's like buying a new car — the real work of maintenance, repairs, and refueling is what follows.

Operations has three goals:

1. **Stability**: The system stays up and services remain available
2. **Performance**: Fast responses and a great user experience
3. **Security**: No data leaks and protection against attacks

---

## 1. Monitoring

Monitoring is the "eyes" of operations. A system without monitoring is like driving blind — you won't even know when something goes wrong.

### 1.1 The Three Layers of Monitoring

<MonitoringDashboardDemo />

**Infrastructure Monitoring**: Tracking server hardware resources

- CPU usage
- Memory usage
- Disk space and I/O
- Network bandwidth

**Application Monitoring**: Tracking software runtime state

- QPS (Queries Per Second)
- Response time (latency)
- Error rate
- Dependency service call status

**Business Monitoring**: Tracking business health

- DAU/MAU (Daily/Monthly Active Users)
- Order volume
- Payment success rate
- User retention rate

### 1.2 Monitoring Tool Stack

| Tool           | Purpose                  | Characteristics                           |
| :------------- | :----------------------- | :---------------------------------------- |
| **Prometheus** | Metric collection & storage | Time-series database, ideal for monitoring data |
| **Grafana**    | Visualization dashboards | Powerful charts and dashboards             |
| **Zabbix**     | Comprehensive monitoring  | Veteran tool with full-featured capabilities |
| **Datadog**    | SaaS monitoring platform  | One-stop solution, paid                   |

**Key Point**: Monitoring must be layered, covering everything from infrastructure to business to avoid blind spots.

---

## 2. Alerting

Once monitoring detects an issue, operations staff need to be notified promptly — that's **alerting**.

### 2.1 Alerting Flow

<AlertFlowDemo />

### 2.2 Alert Severity Levels

Proper alert classification helps prevent "alert fatigue":

| Level  | Response Time          | Typical Scenario                          | Notification Channels      |
| :----- | :--------------------- | :---------------------------------------- | :------------------------- |
| **P0** | Immediate (within 5 min) | Core service down, payment failures      | Phone + SMS + IM           |
| **P1** | Within 30 minutes      | Partial feature outage, severe performance degradation | SMS + IM + Email |
| **P2** | Same day               | High resource usage, occasional errors    | IM + Email                 |
| **P3** | Within the week        | Non-critical issues, optimization suggestions | Email                   |

### 2.3 Alert Deduplication & Noise Reduction

**Pain Point**: A single small issue can trigger hundreds or thousands of alerts, numbing on-call staff.

**Solutions**:

1. **Alert Grouping**: Merge similar alerts (e.g., multiple issues on the same server combined into one)
2. **Alert Suppression**: If a parent issue has already fired, don't repeat alerts for child issues
3. **Silence Rules**: Automatically suppress alerts during maintenance windows
4. **Rate Limiting**: Don't repeat the same alert notification within a short time window

**Key Point**: Alerts should be "few but meaningful" — every alert must be worth acting on.

---

## 3. Logging

Logs are the "black box" for troubleshooting.

### 3.1 Log Levels

```javascript
console.debug('Verbose debug info')  // Used during development
console.info('General information')   // Normal flow logging
console.warn('Warning')               // Potential issues
console.error('Error')                // Errors that need attention
```

### 3.2 Structured Logging

Traditional logging (not ideal):

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

Structured logging (recommended):

```json
{
  "timestamp": "2024-01-15T10:23:45Z",
  "level": "ERROR",
  "message": "User login failed",
  "user": "john",
  "attempts": 3,
  "ip": "192.168.1.100",
  "service": "auth-service"
}
```

### 3.3 The ELK Stack

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**: Log collection and filtering
- **Elasticsearch**: Log storage and search
- **Kibana**: Log visualization and querying

**Best Practices**:

- ✅ Don't log sensitive information (passwords, tokens)
- ✅ Critical operations (login, payment, permission changes) must be logged
- ✅ Logs should include context (user ID, request ID, timestamp)
- ✅ Regularly purge expired logs to avoid running out of disk space

---

## 4. Distributed Tracing

In a microservices architecture, a single request may pass through dozens of services — how do you trace its complete path?

**Trace ID and Span ID**

- **Trace ID**: The unique identifier for an entire request chain (like a package tracking number)
- **Span ID**: The identifier for a single service call (like each transfer hub)

### 4.1 Distributed Tracing Demo

<TraceVisualizationDemo />

### 4.2 The OpenTelemetry Standard

OpenTelemetry (OTel) is the **industry standard** for distributed tracing, providing a unified API and SDK.

```javascript
// Example: Recording a Span with OpenTelemetry
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // Create a Span
  const span = tracer.startSpan('processOrder')

  try {
    // Set attributes
    span.setAttribute('order.id', orderId)

    // Business logic...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // End the Span
  }
}
```

**Key Point**: Distributed tracing quickly identifies performance bottlenecks and failure points — an essential tool for microservices.

---

## 5. Troubleshooting Process

Production incidents are inevitable. The key is **fast response and fast recovery**.

### 5.1 Incident Response Process

<IncidentResponseDemo />

### 5.2 Common Troubleshooting Tools

| Tool         | Purpose                      | Typical Scenario                          |
| :----------- | :--------------------------- | :---------------------------------------- |
| **tcpdump**  | Packet capture analysis      | Network issues, packet loss               |
| **strace**   | System call tracing          | Process hanging, file permission issues   |
| **Arthas**   | Java diagnostics             | CPU spikes, memory leaks, deadlocks       |
| **top/htop** | System resource monitoring   | High CPU/memory usage                     |
| **netstat**  | Network connection inspection | Port conflicts, abnormal connection counts |
| **lsof**     | Open file inspection         | File locks, disk full                     |

**Arthas Example** (Alibaba's open-source Java diagnostic tool):

```bash
# View top 5 threads by CPU usage
$ top -H -p 12345

# Trace the execution time of a method
$ trace com.example.OrderService createOrder

# View a class's static fields
$ getstatic com.example.Config MAX_CONNECTIONS

# Hot-reload code (no restart needed)
$ mc /tmp/Test.java
$ redefine /tmp/Test.class
```

### 5.3 Post-mortem Analysis

**A post-mortem is not a blame session!**

The purpose of a post-mortem is:

1. Reconstruct the incident timeline
2. Identify the root cause (Root Cause Analysis)
3. Summarize lessons learned
4. Define improvement actions

**The 5 Whys Analysis**:

Ask "why" at least 5 times to find the root cause:

- Why did the service go down?
  - Because of an out-of-memory error
- Why did memory overflow?
  - Because cached data grew too large
- Why was cached data too large?
  - Because no expiration time was set
- Why was no expiration time set?
  - Because it was overlooked during development
- **Root cause**: Lack of code review and test coverage

**Key Point**: Build a blameless culture — focus on process improvement, not individual accountability.

---

## 6. Performance Optimization

### 6.1 Performance Bottleneck Analysis

**Top-down optimization approach**:

```
User Experience
  ↓
Frontend Optimization (reduce requests, CDN, lazy loading)
  ↓
Network Optimization (HTTP/2, compression, persistent connections)
  ↓
Backend Optimization (caching, async, batching)
  ↓
Database Optimization (indexes, query tuning, sharding)
  ↓
System Optimization (kernel parameters, JVM tuning)
```

### 6.2 Database Optimization

**Index Optimization**:

```sql
-- Slow query (no index)
SELECT * FROM orders WHERE user_id = 12345;

-- 100x faster after creating an index
CREATE INDEX idx_user_id ON orders(user_id);
```

**Query Optimization**:

```sql
-- ❌ Avoid SELECT *
SELECT * FROM users WHERE id = 123;

-- ✅ Only query needed fields
SELECT id, name, email FROM users WHERE id = 123;

-- ❌ Avoid overly large IN clauses
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- ✅ Use JOIN or batch queries
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 Cache Optimization

**Multi-level Cache Architecture**:

```
Browser Cache (CDN)
  ↓
Local Cache (In-memory/Guava)
  ↓
Distributed Cache (Redis/Memcached)
  ↓
Database (MySQL/PostgreSQL)
```

**Cache Update Strategies**:

| Strategy            | Pros                  | Cons                  | Use Case                          |
| :------------------ | :-------------------- | :-------------------- | :-------------------------------- |
| **Cache-Aside**     | Simple, reliable      | Slow on first query   | Read-heavy, write-light           |
| **Write-Through**   | Good data consistency | Slow writes           | Balanced read/write               |
| **Write-Behind**    | Extremely fast writes | Potential data loss   | Write-heavy, tolerates brief inconsistency |

**Key Point**: Caching is not a silver bullet — consider consistency, avalanche, and penetration issues (refer to the "System Cache Design" chapter).

---

## 7. Capacity Planning

### 7.1 Capacity Assessment

<CapacityPlanningDemo />

### 7.2 Stress Testing

**Tool Selection**:

| Tool       | Characteristics                  | Use Case                 |
| :--------- | :------------------------------- | :----------------------- |
| **JMeter** | Feature-rich, visual             | HTTP API stress testing  |
| **wrk/ab** | Lightweight, command-line        | Quick benchmarking       |
| **Locust** | Python scripting, distributed    | Complex scenario testing |
| **K6**     | Modern, JS scripting             | CI/CD integration        |

**wrk Example**:

```bash
# Install wrk
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# Stress test an HTTP endpoint (10 threads, 30 seconds)
$ wrk -t10 -c100 -d30s http://example.com/api/users

# Output:
# Running 30s test @ http://example.com/api/users
#   10 threads and 100 connections
#   Thread Stats   Avg      Stdev     Max   +/- Stdev
#     Latency    45.32ms   12.45ms 120.50ms   87.56%
#     Req/Sec     2.12k   123.45    3.45k    89.01%
#   632450 requests in 30.00s, 1.23GB read
# Requests/sec:  21081.67
```

### 7.3 Elastic Scaling

**Auto-scaling in the cloud-native era**:

```yaml
# Kubernetes HPA (Horizontal Pod Autoscaler)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

**When CPU usage exceeds 70%, pods automatically scale up (up to 10)**

**Key Point**: Combine business forecasting (e.g., Black Friday sales) with proactive scaling to avoid last-minute scrambling.

---

## 8. Security Operations

### 8.1 Access Control

**Principle of Least Privilege**:

- Developers can only access the development environment
- Operations staff can only access production, and require approval
- Sensitive database operations require secondary confirmation

**Jump Server (Bastion Host)**:

All operations tasks go through the bastion host, which records complete operation logs.

### 8.2 Data Backup

**The 3-2-1 Backup Rule**:

- **3** copies of data (1 original + 2 backups)
- **2** different storage media (local disk + cloud storage)
- **1** offsite backup (to prevent single-point disasters)

**Backup Strategies**:

| Type               | Frequency | Retention | RTO      | RPO       |
| :----------------- | :-------- | :-------- | :------- | :-------- |
| **Full Backup**    | Weekly    | 1 month   | 4 hours  | 24 hours  |
| **Incremental Backup** | Daily | 1 week    | 2 hours  | 1 hour    |
| **Real-time Backup** | Per second | 7 days  | Minutes  | Seconds   |

**RTO (Recovery Time Objective)**: The maximum acceptable downtime duration
**RPO (Recovery Point Objective)**: The maximum acceptable data loss

### 8.3 Vulnerability Scanning

**Regular Scanning**:

- **Code Scanning**: SonarQube, ESLint (detect potential vulnerabilities)
- **Dependency Scanning**: npm audit, Snyk (detect third-party library vulnerabilities)
- **Container Scanning**: Trivy, Clair (detect image vulnerabilities)

```bash
# npm audit example
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# Auto-fix
$ npm audit fix
```

---

## 9. Automated Operations (DevOps)

### 9.1 CI/CD Pipeline

```yaml
# .gitlab-ci.yml example
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm install
    - npm test
  tags:
    - docker

build:
  stage: build
  script:
    - docker build -t myapp:$CI_COMMIT_SHA .
    - docker push registry.example.com/myapp:$CI_COMMIT_SHA
  only:
    - main

deploy:
  stage: deploy
  script:
    - kubectl set image deployment/myapp myapp=registry.example.com/myapp:$CI_COMMIT_SHA
  environment:
    name: production
  when: manual # Manually triggered deployment
```

### 9.2 Infrastructure as Code (IaC)

**Terraform Example** (managing cloud resources):

```hcl
# main.tf
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"

  tags = {
    Name = "WebServer"
    Env  = "production"
  }
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Advantages**:

- ✅ Version Control: All configuration lives in Git
- ✅ Reproducibility: Environment consistency
- ✅ Auditability: Clear change history
- ✅ Rollback: Quickly revert to previous versions

### 9.3 GitOps Practices

**GitOps = Git + IaC + Automation**

Core principle: **The Git repository is the single source of truth for infrastructure**

Workflow:

```
1. Modify config files (push to Git)
   ↓
2. Git repository changes trigger CI/CD
   ↓
3. Automatically run terraform apply / kubectl apply
   ↓
4. Infrastructure updates automatically
   ↓
5. Monitor and reconcile actual state vs. desired state
```

**Tools**: ArgoCD, Flux (Kubernetes deployment)

---

## 10. Summary & Best Practices

Operations is a vast domain, but the core can be distilled into the following:

### 10.1 Operations Maturity Model

| Level         | Characteristics                   | Practices                                      |
| :------------ | :-------------------------------- | :--------------------------------------------- |
| **Beginner**  | Reactive, manual operations       | Fix issues only when they arise, manual deploys |
| **Intermediate** | Automated, standardized        | CI/CD, monitoring & alerting, documentation     |
| **Advanced**  | Proactive, self-healing           | Capacity planning, chaos drills, auto-scaling   |
| **Expert**    | Intelligent, unattended           | AIOps, chaos engineering, serverless            |

### 10.2 A Day in the Life of an SRE

```
09:00 - Review overnight alerts, confirm system status
10:00 - Handle user-reported issues
11:00 - Attend engineering weekly, assess operational risk of new proposals
14:00 - Optimize slow queries, improve performance
15:00 - Code review
16:00 - Write deployment docs, update monitoring rules
17:00 - Chaos engineering drills
18:00 - On-call handoff
```

### 10.3 Learning Roadmap

**Beginner Stage** (1–3 months):

- Learn common Linux commands
- Understand monitoring systems (Prometheus + Grafana)
- Master log querying (ELK)

**Intermediate Stage** (3–6 months):

- Deep dive into container technology (Docker + K8s)
- Master a diagnostic tool (Arthas, tcpdump)
- Practice CI/CD pipelines

**Advanced Stage** (6–12 months):

- Performance tuning (database, JVM, network)
- Capacity planning and cost optimization
- Post-mortems and process improvement

**Expert Stage** (1+ year):

- Architecture design (high availability, disaster recovery)
- Chaos engineering (proactively inject failures)
- AIOps (intelligent operations)

---

## 11. Glossary

| Term            | Full Name                         | Explanation                                                      |
| :-------------- | :-------------------------------- | :--------------------------------------------------------------- |
| **Monitoring**  | -                                 | Real-time observation of system health.                          |
| **Alerting**    | -                                 | Notifying relevant personnel when anomalies occur.               |
| **Logging**     | -                                 | Recording events during system operation.                        |
| **Tracing**     | -                                 | Tracking the full path of a request across a distributed system. |
| **QPS**         | Queries Per Second                | Queries per second, a measure of system throughput.              |
| **Latency**     | -                                 | The time from request initiation to response.                    |
| **RTO**         | Recovery Time Objective           | Maximum acceptable downtime duration.                            |
| **RPO**         | Recovery Point Objective          | Maximum acceptable data loss.                                    |
| **Post-mortem** | -                                 | Incident review to analyze root causes and improvement actions.  |
| **CI/CD**       | Continuous Integration/Delivery   | Automated testing and deployment.                                |
| **IaC**         | Infrastructure as Code            | Managing servers, networks, and other resources via code.        |
| **GitOps**      | -                                 | Git-driven operations — Git is the single source of truth.       |
| **ELK**         | Elasticsearch + Logstash + Kibana | The log collection, storage, and visualization trifecta.         |
| **SLA**         | Service Level Agreement           | Committed service availability (e.g., 99.9%).                    |
| **Blameless**   | -                                 | A no-blame culture where post-mortems focus on process over individuals. |

---

## 12. Further Reading

- **[System Cache Design](/en/appendix/4-server-and-backend/caching)** - Caching principles, patterns & best practices
- **[Message Queue Design](/en/appendix/4-server-and-backend/message-queues)** - Peak shaving, async decoupling
- **[Authentication & Authorization in Practice](/en/appendix/4-server-and-backend/auth-authorization)** - AuthN/AuthZ and security hardening
- **[Backend Evolution](/en/appendix/4-server-and-backend/backend-layered-architecture)** - From monoliths to microservices to serverless
- **[Deployment & Go-Live](/en/appendix/7-infrastructure-and-operations/ci-cd)** - The last mile from development to production
# Principles of Rate Limiting and Backpressure

::: tip Introduction
**On Double 11 at midnight, hundreds of millions of users flood in simultaneously — can the servers handle it?** Every system has a processing capacity limit. When request volume exceeds what the system can bear, without control, the result is that nobody can use the service. Rate limiting and backpressure are the two lines of defense that protect systems from being "overwhelmed."
:::

**What will you learn in this article?**

After reading this chapter, you will gain:

- **Why rate limiting is necessary**: Understand why you need to proactively reject some requests to protect the system
- **Rate limiting algorithms**: Master the principles and differences of three core algorithms — token bucket, leaky bucket, and sliding window
- **Backpressure mechanisms**: Understand handling strategies when upstream speed exceeds downstream speed
- **Multi-layer rate limiting**: Learn the multi-layer rate limiting architecture from client to gateway to service
- **Practical skills**: Know which rate limiting strategy to choose for which scenario

| Chapter | Content | Core Concepts |
|-----|------|---------|
| **Chapter 1** | Why rate limiting is needed | Cascading failure, service protection |
| **Chapter 2** | Rate limiting algorithms | Token bucket, leaky bucket, sliding window |
| **Chapter 3** | Backpressure control | Buffer, drop strategy, elastic scaling |
| **Chapter 4** | Multi-layer rate limiting architecture | Client, gateway, server side |
| **Chapter 5** | Practice and selection | Nginx, Redis, Sentinel |

---

## 0. The Big Picture: Motivation for the "Reject" Users

This sounds counterintuitive — shouldn't we serve every user well? But the reality is: **if you don't reject some requests, all requests will fail.**

Imagine a restaurant that can only seat 100 people, and suddenly 1,000 people rush in. Without rate limiting, the result isn't that all 1,000 get to eat — it's that the kitchen crashes, the servers are overwhelmed, and nobody gets fed. The right approach is to queue and limit at the door, letting 100 people in first while the rest wait.

::: tip Core Goals of Rate Limiting
- **Protect the system**: Prevent overload from causing complete service unavailability
- **Fair allocation**: Ensure accepted requests can be processed normally
- **Graceful degradation**: Rate-limited requests receive a clear 429 status code, rather than a timeout or 500 error
:::

---

## 1. Rate Limiting Algorithms: Three Classic Approaches

The core question of rate limiting is: **within a unit of time, what is the maximum number of requests allowed through?** Different algorithms make different trade-offs in precision, burst traffic handling, and implementation complexity.

<RateLimitAlgorithmDemo />

| Algorithm | Principle | Burst Traffic | Precision | Implementation Complexity |
|------|------|---------|--------|-----------|
| Token bucket | Tokens added at a fixed rate; requests consume tokens | Allowed (when bucket has surplus) | High | Medium |
| Leaky bucket | Requests queue up; processed at a fixed rate | Not allowed (fully smoothed) | High | Medium |
| Sliding window | Counts requests within a time window | Partially allowed | Fairly high | Low |
| Fixed window | Counts by fixed time window | May burst at boundaries | Low | Lowest |

::: tip Which Algorithm to Choose?
- **API rate limiting**: Token bucket is most commonly used, allowing reasonable burst traffic
- **Traffic shaping**: Leaky bucket suits scenarios requiring constant output rate
- **Simple counting**: Sliding window is easy to implement, suitable for most web applications
:::

---

## 2. Backpressure Control: When Upstream Is Faster Than Downstream

Rate limiting solves the problem of "too many external requests," while **backpressure** solves the problem of "internal component speed mismatch."

When a producer generates data faster than a consumer can process it, the intermediate buffer keeps growing, eventually leading to memory overflow or data loss. Backpressure mechanisms allow consumers to "notify upstream to slow down."

<BackpressureDemo />

::: tip Four Backpressure Strategies
1. **Drop**: When the buffer is full, discard new or old data; suitable for scenarios with high real-time requirements but tolerable data loss
2. **Block**: Pause the producer until the consumer finishes processing; suitable for scenarios where data cannot be lost
3. **Sample**: Only process a portion of the data; suitable for high-frequency data streams
4. **Elastic Scaling**: Dynamically increase the number of consumers; suitable for cloud-native environments
:::

---

## 3. Multi-Layer Rate Limiting Architecture

In production environments, rate limiting at a single point is not enough — you need **multi-layer protection**, with each layer solving problems at a different granularity.

| Layer | Location | Rate Limiting Granularity | Tools |
|------|------|---------|------|
| Client | Frontend/App | Button debounce, request throttling | lodash.throttle, debounce |
| CDN/WAF | Edge nodes | IP-level, region-level | Cloudflare Rate Limiting |
| API Gateway | Entry gateway | Route-level, user-level | Nginx limit_req, Kong |
| Server side | Inside application | Interface-level, resource-level | Sentinel, Resilience4j |
| Database | Storage layer | Connection count, QPS | Connection pool configuration, slow query circuit breaking |

::: tip HTTP Specification for Rate Limiting
Rate-limited requests should return a `429 Too Many Requests` status code with response headers including:
- `Retry-After`: How long the client should wait before retrying (seconds or date)
- `X-RateLimit-Limit`: Rate limit ceiling
- `X-RateLimit-Remaining`: Remaining quota
- `X-RateLimit-Reset`: Quota reset time
:::

---

## 4. Practical Selection

| Scenario | Recommended Solution | Notes |
|------|---------|------|
| Nginx entry rate limiting | `limit_req_zone` | Based on leaky bucket algorithm, simple configuration |
| Distributed rate limiting | Redis + Lua script | Token bucket or sliding window, multi-instance shared counting |
| Java microservices | Sentinel / Resilience4j | Supports circuit breaking, degradation, hotspot rate limiting |
| Node.js API | express-rate-limit | Easy to use, supports Redis storage |
| Go services | golang.org/x/time/rate | Standard library token bucket implementation |

---

## Summary

Rate limiting and backpressure are two critical lines of defense for protecting system stability. Rate limiting controls the rate of incoming external traffic, while backpressure coordinates the processing speed of internal components.

Key takeaways from this chapter:

1. **Necessity of rate limiting**: Without rejecting some requests, all requests will fail
2. **Three core algorithms**: Token bucket (allows bursts), leaky bucket (fully smoothed), sliding window (simple and precise)
3. **Backpressure mechanisms**: Four strategies — drop, block, sample, scale
4. **Multi-layer protection**: From client to database, each layer solves problems at a different granularity
5. **429 specification**: Return standard status code and rate limit headers when rate-limited

## Further Reading

- [Stripe's Rate Limiting Practices](https://stripe.com/blog/rate-limiters) - Rate limiting design in payment systems
- [Nginx limit_req Documentation](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) - Nginx rate limiting module
- [Alibaba Sentinel](https://sentinelguard.io/) - Traffic control component for distributed services
- [Resilience4j](https://resilience4j.readme.io/) - Lightweight fault tolerance library for Java
- [Token Bucket Algorithm Details](https://en.wikipedia.org/wiki/Token_bucket) - Mathematical principles of the token bucket algorithm

# Principles of API Design: Frontend-Backend Communication Protocols

::: tip 🎯 Core Question
**How do frontend and backend communicate efficiently?** It's like asking: how should a restaurant design its menu so guests can understand it at a glance? How should waiters take orders without making mistakes? How should dishes be served to keep customers satisfied? API design solves the problem of "conversation rules."
:::

---

## 0. First, a Question: Have You Experienced These Nightmares

**Scenario 1: Inconsistent API Naming**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

Four endpoints, same functionality, completely different naming styles. New hires are confused: which one should I use?

**Scenario 2: Inconsistent Error Handling**

```json
// Some return HTTP status codes
HTTP/1.1 404 Not Found

// Some return 200 + code
HTTP/1.1 200 OK
{ "code": 404, "message": "User not found" }

// Some just throw exceptions
HTTP/1.1 200 OK
{ "error": "Something went wrong" }
```

The frontend doesn't know how to determine if a request was successful.

**Scenario 3: Inconsistent Response Structures**

```json
// Endpoint A
{ "data": { ... } }

// Endpoint B
{ "result": { ... } }

// Endpoint C
{ "content": { ... } }
```

Every endpoint returns a different format, requiring the frontend to handle each one individually.

---

**Good API design is like a restaurant's ordering system** — clear menu, standardized procedures, and informative error messages.

---

## 1. Overview of an API

**API** (Application Programming Interface) is simply the "agreement for communication between programs."

### 1.1 Restaurant Analogy

| Restaurant Role | Corresponding Concept | Description |
| :--- | :--- | :--- |
| Menu | API Documentation | Tells you what "dishes" are available |
| Waiter | HTTP Protocol | A standardized "way of communicating" |
| Kitchen | Server | Processes requests based on "orders" |
| Serving Food | Response | Returns results to the "guest" |

### 1.2 A Complete API Request

👇 **Try it out**: Click the button below to observe a complete API request-response flow:

<ApiRequestDemo />

---

## 2. API Design Philosophy: RPC / REST / GraphQL / gRPC

Before diving into specific RESTful design, let's understand four major API design styles:

<ApiStyleCompare />

### 2.1 REST vs RESTful: What's the Difference

Many people confuse these two concepts:

| Concept | Meaning | Description |
| :--- | :--- | :--- |
| **REST** | An architectural style | A design philosophy proposed by Roy Fielding, consisting of a set of constraints |
| **RESTful** | Conforming to REST style | An adjective indicating that the API design follows REST principles |

**Analogy**:
- REST is like "minimalism" — a design philosophy
- RESTful API is like "a minimalist room" — a concrete implementation of that philosophy

**Six REST Constraints**:

| Constraint | Description |
| :--- | :--- |
| **Client-Server Separation** | Frontend and backend develop independently, interfaces are decoupled |
| **Stateless** | Each request contains all necessary information; the server doesn't save session state |
| **Cacheable** | Responses should indicate whether they are cacheable, improving performance |
| **Uniform Interface** | Use standard HTTP methods and status codes |
| **Layered System** | Clients don't need to know which layer of server they're connecting to |
| **Code on Demand** (optional) | The server can extend client functionality |

::: tip 💡 Why is REST the Most Popular?
1. **Low learning curve**: The HTTP protocol itself embodies REST principles
2. **Mature ecosystem**: Rich tools, frameworks, and documentation
3. **High versatility**: Any language, any platform can call it
4. **Easy to cache**: GET requests are naturally cacheable, CDN-friendly
:::

---

## 3. RESTful Design: Making URLs Communicate

**REST** (Representational State Transfer) is an architectural style with core principles:

- Abstract things on the network as "Resources"
- Use URLs to identify resources
- Use HTTP methods to operate on resources

### 3.1 Warehouse Analogy

| Warehouse Concept | REST Equivalent | Example |
| :--- | :--- | :--- |
| Shelf address | URL | `/users`, `/orders` |
| Operation method | HTTP Method | GET (view), POST (add) |
| Goods | Resource | User data, order data |

**Key Principle**: URLs are nouns, not verbs.

### 3.2 URL Design Rules

| Rule | Wrong Example | Correct Example | Description |
| :--- | :--- | :--- | :--- |
| Use nouns, not verbs | `/getUsers` | `/users` | URL represents resources, HTTP methods represent operations |
| Use plural form | `/user` | `/users` | Consistent plural style |
| Lowercase + hyphens | `/UserProfiles` | `/user-profiles` | URLs are case-sensitive |
| Avoid deep nesting | `/a/b/c/d/e` | `/a/b/c` | Maximum 3 levels |
| Use query params for filtering | `/products/phone/5000` | `/products?cat=phone` | Use `?` parameters for filters |

::: tip 💡 URLs Are Case-Sensitive
Using lowercase + hyphens (-) is the safest approach, avoiding case confusion and inconsistent underscore styles.
:::

### 3.3 HTTP Method Selection

| Method | Purpose | Idempotent | Safe | Typical Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Retrieve resource | Yes | Yes | Query lists, view details |
| **POST** | Create resource | No | No | Add user, submit order |
| **PUT** | Full update | Yes | No | Replace entire user profile |
| **PATCH** | Partial update | No | No | Only modify nickname |
| **DELETE** | Delete resource | Yes | No | Delete user, cancel order |

::: tip 💡 What is Idempotency?
**Idempotency**: Multiple executions produce the same result.

- **Idempotent operations** (GET/PUT/DELETE): Clicking 10 times produces the same result as clicking once
- **Non-idempotent operations** (POST): Clicking 10 times might create 10 orders

**Solution**: Use unique IDs for POST operations to prevent duplicate processing.
:::

---

## 4. Status Codes: Making Errors "Communicate"

HTTP status codes are the standard way for servers to tell clients "what happened."

### 4.1 Status Code Categories

| Category | Meaning | Typical Status Codes |
| :--- | :--- | :--- |
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Permanent Move, 304 Not Modified |
| **4xx** | Client Error | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| **5xx** | Server Error | 500 Internal Error, 503 Service Unavailable |

### 4.2 Common Status Code Demo

👇 **Try it out**: Click the button below to learn about common status codes:

<StatusCodeDemo />

---

## 5. Error Handling: Graceful "Rejection"

Good error handling lets clients "understand what happened from the status code" instead of guessing.

### 4.1 Error Handling "Pitfall Guide"

**Pitfall 1: Returning 200 for All Errors**

```json
// ❌ Bad practice
HTTP/1.1 200 OK
{ "error": "Something went wrong" }
```

Problem: Caching layers will cache this "successful" response, and monitoring systems won't detect the issue.

**Pitfall 2: Error Messages Too Vague**

```json
// ❌ Bad practice
HTTP/1.1 400 Bad Request
{ "message": "Invalid parameters" }
```

Problem: The client doesn't know which parameter is wrong or why.

**Pitfall 3: Exposing Sensitive Information**

```json
// ❌ Dangerous practice
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

Danger: Exposes code structure and database queries that attackers can exploit.

### 5.2 Correct Error Handling Demo

👇 **Try it out**: Compare "good" and "bad" error response designs:

<ErrorHandlingDemo />

---

## 6. Versioning: API "Backward Compatibility"

### 6.1 Motivation for Versioninging

Scenario: Your app has 1 million users, and you need to modify the order endpoint.

**Without versioning**:
- New app calls new endpoint → works fine
- Old app calls new endpoint → missing fields, crashes!

**Correct approach**:
- `/v1/orders` - Old endpoint, continues serving old apps
- `/v2/orders` - New endpoint, new features go here

### 6.2 Versioning Strategies

| Strategy | Example | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **URL Path** | `/v1/users` | Intuitive, cacheable | Longer URLs |
| **Request Header** | `Accept: vnd.api.v2+json` | Clean URLs | Harder to debug |
| **Query Parameter** | `/users?version=2` | Simple | Less standard |

### 6.3 Version Evolution Example

Using the user endpoint as an example, showing v1 to v2 evolution:

| Endpoint | v1 (Old) | v2 (New) | Change Description |
| :--- | :--- | :--- | :--- |
| **Get User** | `GET /v1/users`<br>Returns: `name, email` | `GET /v2/users`<br>Returns: `name, email, avatar, phone` | Added avatar and phone fields |
| **Create Order** | `POST /v1/orders`<br>Accepts: `items[]` | `POST /v2/orders`<br>Accepts: `items[], coupons[]` | Added coupon support |
| **Batch Operations** | None | `POST /v2/orders/batch` | Added batch creation endpoint |

::: tip 💡 Versioning Best Practices
- **Maintain backward compatibility**: Keep v1 endpoints for at least 6-12 months to give clients time to upgrade
- **Update documentation in sync**: Each version should have its own API documentation
- **Deprecation notices**: Announce in advance when v1 will be retired and guide migration
- **Monitor usage**: Track v1 call volume and confirm it's safe to retire before stopping service
:::

---

## 7. Response Structure Design

Response structure is the "data contract" for frontend-backend collaboration. A unified format dramatically reduces communication costs.

<ResponseStructureDemo />

### 7.1 Industry Best Practices

::: details Google API Design Guide
Refer to [Google API Design Guide](https://cloud.google.com/apis/design/errors). Google requires all API error responses to include the `google.rpc.Status` message structure:

```json
{
  "error": {
    "code": 429,
    "message": "Resource exhausted, please try again later",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "RESOURCE_AVAILABILITY",
        "domain": "compute.googleapis.com",
        "metadata": {
          "zone": "us-east1-a",
          "service": "compute"
        }
      }
    ]
  }
}
```

**Core Requirements**:
- Must include `ErrorInfo` providing machine-readable error identifiers
- `message` is developer-facing, describing the problem and solution in concise language
- `details` array can include `LocalizedMessage`, `Help` (help links), etc.
:::

::: details Microsoft REST API Guidelines
Refer to [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md). Microsoft emphasizes response consistency:

**Error vs. Fault Classification**:
- **Error**: Client sent invalid data, returns 4xx, doesn't affect API availability
- **Fault**: Server cannot properly respond to a valid request, returns 5xx, affects API availability

**Response Header Standards**:
- `Date`: Must be returned, using RFC 5322 format (GMT timezone)
- `Content-Type`: Must be returned
- `ETag`: Must be returned for resources supporting optimistic concurrency control
:::

::: details Alibaba Java Development Manual
Refer to [Alibaba Java Development Manual](https://developer.aliyun.com/special/tech-java). Alibaba has the following API response standards:

**Unified Return Object**:
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**Error Code Segmented Design**:
| Range | Type | Example |
| :--- | :--- | :--- |
| 0 | Success | 0 |
| 1xxxx | Parameter Error | 10001 Missing required parameter |
| 2xxxx | Business Error | 20001 Insufficient balance |
| 3xxxx | Authentication Error | 30001 Not logged in |
| 5xxxx | System Error | 50001 Database exception |
:::

::: details Stripe API Response Design
Refer to [Stripe API Documentation](https://docs.stripe.com/api/errors). Stripe's error response design is highly refined:

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "param": "number",
    "decline_code": "insufficient_funds",
    "doc_url": "https://stripe.com/docs/error-codes/card-declined"
  }
}
```

**Design Highlights**:
- `type` distinguishes error types: `api_error`, `card_error`, `invalid_request_error`
- `param` identifies which specific parameter has the error, frontend can directly locate form fields
- `doc_url` provides documentation links for developers to learn more
- `decline_code` provides more granular error reasons
:::

::: details JSON:API Specification
Refer to [JSON:API Specification](https://jsonapi.org/format/), a widely adopted JSON API response specification in the industry:

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API Specification Explained"
    },
    "relationships": {
      "author": {
        "data": { "type": "users", "id": "9" }
      }
    }
  },
  "included": [
    {
      "type": "users",
      "id": "9",
      "attributes": {
        "name": "John Doe"
      }
    }
  ]
}
```

**Core Design**:
- `data` contains the primary resource, must have `type` and `id`
- `attributes` stores resource attributes
- `relationships` describes resource associations
- `included` avoids repeated requests by returning related data at once
:::

::: details GitHub REST API Response Design
Refer to [GitHub REST API Documentation](https://docs.github.com/en/rest). GitHub's response design emphasizes developer experience:

**Success Response**:
```json
{
  "id": 1296269,
  "node_id": "MDEwOlJlcG9zaXRvcnkxMjk2MjY5",
  "name": "Hello-World",
  "full_name": "octocat/Hello-World",
  "owner": {
    "login": "octocat",
    "id": 1,
    "avatar_url": "https://github.com/images/error/octocat_happy.gif"
  },
  "private": false,
  "html_url": "https://github.com/octocat/Hello-World"
}
```

**Error Response**:
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**Design Highlights**:
- Response includes multiple URL formats (`html_url`, `url`) for different scenarios
- Error response includes `documentation_url` pointing to docs
- Uses `Link` response header for pagination navigation
:::

::: details Twitter/X API v2 Response Design
Refer to [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api). Twitter API v2 uses a concise response format:

```json
{
  "data": {
    "id": "1460323737035677698",
    "text": "Hello, Twitter!"
  },
  "includes": {
    "users": [
      {
        "id": "2244994945",
        "name": "Twitter Dev",
        "username": "TwitterDev"
      }
    ]
  }
}
```

**Design Highlights**:
- `data` contains primary data, `includes` contains related data (similar to JSON:API)
- Supports field selection: `?tweet.fields=created_at,public_metrics`
- Pagination uses `next_token` and `previous_token`
:::

### 7.2 Best Practices Summary

Combining the above specifications, response structure design should follow these principles:

1. **Consistency First**: All endpoints use the same response structure; the frontend can build a unified request layer
2. **Machine-Readable**: Error codes + error reasons allow programs to handle errors automatically
3. **Human-Friendly**: Clear message descriptions including resolution suggestions
4. **Traceable**: request_id spans the entire request chain for easy issue identification
5. **Internationalization Support**: Extend localized messages through details

### 7.3 Data Field Design Standards

`data` is the core of the response, and its design directly impacts frontend development efficiency.

<DataFieldDesignDemo />

### 7.4 Advanced Error Response Design

<ErrorResponseDesignDemo />

::: tip References
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [Alibaba Java Development Manual](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. Practice: E-commerce System API Design Example

```
# User Module
GET    /v1/users                    # Get user list
POST   /v1/users                    # Create new user
GET    /v1/users/{id}               # Get user details
PUT    /v1/users/{id}               # Full update user
PATCH  /v1/users/{id}               # Partial update user
DELETE /v1/users/{id}               # Delete user

# Order Module
GET    /v1/users/{id}/orders        # Get orders for a user
POST   /v1/orders                   # Create order
GET    /v1/orders/{id}              # Get order details
PATCH  /v1/orders/{id}/status       # Update order status

# Product Module (use query params for complex filtering)
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. Using AI to Assist API Design

AI can help you quickly generate specification-compliant API designs. The key is providing clear context and constraints.

### 9.1 Prompt Template

```
You are a senior backend architect, proficient in RESTful API design. Please help me design a set of API endpoints.

## Business Background
[Describe your business scenario, e.g., e-commerce system, blog platform, task management, etc.]

## Functional Requirements
[List the required functional modules, e.g.:
- User management: registration, login, personal information
- Order management: create order, query orders, cancel order
- Product management: product list, product details, search]

## Design Requirements
1. Follow RESTful conventions
2. URLs use plural nouns, lowercase + hyphens
3. Use HTTP methods correctly (GET/POST/PUT/PATCH/DELETE)
4. Unified response format: { code, message, data, request_id }
5. Appropriate status code usage
6. Versioning: URL path approach (/v1/)

## Output Format
Please output in the following format:

### Endpoint List
| Method | URL | Description | Request Body | Response Body |
|--------|-----|-------------|--------------|---------------|

### Request/Response Examples
[Detailed examples for key endpoints]

### Status Code Descriptions
[Status codes used and their meanings]
```

### 9.2 Practical Example: E-commerce Order API

**Input Prompt:**

```
You are a senior backend architect, proficient in RESTful API design. Please help me design a set of API endpoints for an e-commerce order system.

## Business Background
A B2C e-commerce platform where users can browse products, place orders, and view order status.

## Functional Requirements
- Order module: create order, query order list, query order details, cancel order, pay order
- Cart module: add product, modify quantity, remove product, view cart

## Design Requirements
1. Follow RESTful conventions
2. URLs use plural nouns, lowercase + hyphens
3. Use HTTP methods correctly
4. Unified response format
5. Versioning: /v1/
```

**AI Output Example:**

| Method | URL | Description |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | Create order |
| `GET` | `/v1/orders` | Query order list |
| `GET` | `/v1/orders/{id}` | Query order details |
| `PATCH` | `/v1/orders/{id}/status` | Update order status (cancel/pay) |
| `GET` | `/v1/users/{id}/cart` | Get cart |
| `POST` | `/v1/users/{id}/cart/items` | Add product to cart |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | Modify cart item quantity |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | Remove cart item |

### 9.3 Notes on AI-Assisted Design

| Note | Description |
| :--- | :--- |
| **Provide complete context** | Business background, user roles, and data relationships should all be clearly stated |
| **Define constraints clearly** | Naming conventions, versioning strategy, and response format should be defined upfront |
| **Iterate and refine** | The first output may not be perfect; ask follow-up questions and request modifications |
| **Manual review** | AI-generated content needs human verification against business requirements |
| **Cover edge cases** | Ask AI to consider error handling, permission control, pagination, and other edge cases |

::: tip 💡 Follow-up Question Techniques
- "Please add error response examples for each endpoint"
- "Please consider pagination, sorting, and filtering parameters"
- "Please add permission control descriptions for the endpoints"
- "Please check if it follows RESTful best practices"
:::

---

## Glossary

| Term | English | Explanation |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Agreement for communication between programs |
| **REST** | Representational State Transfer | An architectural style that uses URLs to identify resources |
| **Resource** | Resource | Core concept in REST architecture, has unique identifiers (URLs) |
| **Idempotency** | Idempotency | Multiple executions produce the same result |
| **Status Code** | Status Code | Response status defined by the HTTP protocol |
| **Versioning** | Versioning | Allows old and new APIs to coexist for smooth upgrades |
| **Request Body** | Request Body | Data carried by POST/PUT/PATCH requests |
| **Response Body** | Response Body | Data returned by the server |
| **Header** | Header | Metadata for requests/responses (e.g., Content-Type) |
| **Authentication** | Authentication | Verifying "who you are" (login, Token) |
| **Authorization** | Authorization | Verifying "what you can do" (permissions) |

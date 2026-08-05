# Principles of HTTP Protocol: Frontend-Backend Communication

::: tip Core Question
**How does HTTP work?** It's like asking: how do two people hold a conversation? They need to agree on a language, grammar, and conversation rules. HTTP is the "conversation protocol" between frontend and backend.
:::

---

## 0. The Essence of HTTP

**HTTP** (HyperText Transfer Protocol) is the foundational protocol for frontend-backend communication.

### 0.1 Communication Analogy

| Conversation Element | HTTP Equivalent | Description |
| :--- | :--- | :--- |
| Language | HTTP protocol | A language both sides can understand |
| Grammar | Request/response format | How to "speak" |
| Flow | Request-response pattern | One question, one answer |
| Ending | Hang up | TCP connection closes |

---

## 1. HTTP's Evolution

HTTP has undergone several major upgrades since its creation in 1991.

<HttpProtocolDemo />

### 1.1 Version Comparison

| Version | Year | Core Improvement | Key Feature |
| :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | Only supported GET | Plain text only, no response headers |
| **HTTP/1.0** | 1996 | Added POST/HEAD | One TCP connection per request |
| **HTTP/1.1** | 1997 | Persistent connections | Keep-Alive, multiple requests per connection |
| **HTTP/2** | 2015 | Multiplexing | Binary frames, header compression |
| **HTTP/3** | 2022 | Based on QUIC | UDP transport, solves head-of-line blocking |

::: tip Why HTTP/2?
Although HTTP/1.1 supports persistent connections, requests must be sent sequentially (the next request can only be sent after the previous response returns). HTTP/2 solves this problem through multiplexing, allowing multiple requests to be sent simultaneously.
:::

---

## 2. Structure of an HTTP Request

### 2.1 Request Line

```http
GET /api/users/123 HTTP/1.1
```

Contains three parts:
- **Method**: GET, POST, PUT, DELETE, etc.
- **URL**: The resource path being requested
- **Version**: HTTP/1.1 or HTTP/2

### 2.2 Request Headers

```http
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer xxx
Content-Type: application/json
Content-Length: 45
```

Common request headers:
| Header | Description | Example |
| :--- | :--- | :--- |
| **Host** | Server domain | `api.example.com` |
| **User-Agent** | Client information | `Mozilla/5.0` |
| **Accept** | Accepted response types | `application/json` |
| **Authorization** | Authentication information | `Bearer token` |
| **Content-Type** | Request body type | `application/json` |

### 2.3 Request Body

```json
{
  "name": "Zhang San",
  "email": "zhangsan@example.com"
}
```

Only POST, PUT, PATCH, and similar methods have a request body.

---

## 3. Structure of an HTTP Response

### 3.1 Status Line

```http
HTTP/1.1 200 OK
```

Contains three parts:
- **Version**: HTTP/1.1
- **Status code**: 200, 404, 500, etc.
- **Status text**: OK, Not Found, etc.

### 3.2 Response Headers

```http
Content-Type: application/json
Content-Length: 156
Cache-Control: max-age=3600
Set-Cookie: session=xxx; HttpOnly
```

Common response headers:
| Header | Description | Example |
| :--- | :--- | :--- |
| **Content-Type** | Response body type | `application/json` |
| **Content-Length** | Response body size | `156` |
| **Cache-Control** | Cache policy | `max-age=3600` |
| **Set-Cookie** | Set Cookie | `session=xxx` |

### 3.3 Response Body

```json
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "Zhang San"
  }
}
```

---

## 4. HTTP Methods in Detail

| Method | Purpose | Request Body | Idempotent | Safe |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Retrieve resource | None | Yes | Yes |
| **POST** | Create resource | Yes | No | No |
| **PUT** | Full update | Yes | Yes | No |
| **PATCH** | Partial update | Yes | No | No |
| **DELETE** | Delete resource | None | Yes | No |
| **HEAD** | Get headers only | None | Yes | Yes |
| **OPTIONS** | Query supported methods | None | Yes | Yes |

### 4.1 GET vs POST

| Feature | GET | POST |
| :--- | :--- | :--- |
| **Parameter location** | URL query parameters | Request body |
| **Caching** | Cacheable | Not cached by default |
| **Bookmarks** | Can be bookmarked | Cannot |
| **Browser history** | Saved in history | Not saved |
| **Data length** | Limited (URL length) | Unlimited |
| **Security** | Parameters visible in URL | Parameters in request body |

::: tip When to Use GET/POST?
- **GET**: Query, retrieve data
- **POST**: Create, submit data
- **PUT**: Full update (replace the entire resource)
- **PATCH**: Partial update (only modify specified fields)
- **DELETE**: Delete a resource
:::

---

## 5. HTTP Status Codes

### 5.1 Status Code Categories

| Category | Description | Typical Status Codes |
| :--- | :--- | :--- |
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Permanent, 302 Temporary, 304 Not Modified |
| **4xx** | Client error | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| **5xx** | Server error | 500 Internal Server Error, 503 Service Unavailable |

### 5.2 Common Status Codes

| Status Code | Description | Use Case |
| :--- | :--- | :--- |
| **200 OK** | Request succeeded | Successful GET, PUT request |
| **201 Created** | Resource created | Successful POST creating a resource |
| **204 No Content** | No content | Successful DELETE |
| **301 Moved Permanently** | Permanent redirect | URL permanently changed |
| **302 Found** | Temporary redirect | URL temporarily changed |
| **304 Not Modified** | Not modified | Cache still valid |
| **400 Bad Request** | Bad request | Malformed request parameters |
| **401 Unauthorized** | Unauthorized | Login required |
| **403 Forbidden** | Forbidden | Logged in but insufficient permissions |
| **404 Not Found** | Not found | Resource doesn't exist |
| **500 Internal Server Error** | Internal error | Server exception |
| **503 Service Unavailable** | Unavailable | Server maintenance or overload |

---

## 6. HTTPS: Secure HTTP

### 6.1 HTTP vs HTTPS

| Feature | HTTP | HTTPS |
| :--- | :--- | :--- |
| **Protocol** | TCP | TCP + SSL/TLS |
| **Port** | 80 | 443 |
| **Data** | Plaintext | Encrypted |
| **Certificate** | Not required | SSL certificate required |
| **Performance** | Slightly faster | Slightly slower (handshake overhead) |
| **SEO** | No effect | Search engines prioritize HTTPS |

### 6.2 How HTTPS Works

1. **Client Hello**: Client sends supported cipher suites
2. **Server Hello**: Server returns certificate and selected cipher suite
3. **Certificate verification**: Client verifies the server certificate's validity
4. **Key exchange**: Use asymmetric encryption to exchange a session key
5. **Encrypted communication**: Use the session key for symmetric encryption

::: tip HTTPS Advantages
- **Anti-eavesdropping**: Data is encrypted; third parties cannot read it
- **Anti-tampering**: Data integrity verification
- **Anti-impersonation**: SSL certificates verify server identity
:::

---

## 7. HTTP Caching Mechanism

### 7.1 Cache Headers

| Header | Description | Example |
| :--- | :--- | :--- |
| **Cache-Control** | Cache policy | `max-age=3600` |
| **ETag** | Resource version identifier | `"33a64df551425fcc"` |
| **Last-Modified** | Last modified time | `Wed, 21 Oct 2015 07:28:00 GMT` |

### 7.2 Caching Strategies

**Strong caching**:
```http
Cache-Control: max-age=3600
```
Within 3600 seconds, the browser uses the cache directly without sending a request.

**Negotiated caching**:
```http
ETag: "33a64df551425fcc"
```
The browser sends `If-None-Match`; the server returns 304 (not modified) or 200 (modified).

---

## 8. Common Questions

### 8.1 The Real Difference Between GET and POST

**Misconception**: The only difference between GET and POST is where parameters are placed.

**The truth**:
- GET is idempotent; multiple requests produce the same result
- POST is non-idempotent; multiple requests may create multiple resources
- GET can be cached; POST is not cached by default
- GET can be bookmarked; POST cannot

### 8.2 HTTP/1.1 Head-of-Line Blocking

**The problem**: Although HTTP/1.1 supports persistent connections, requests must be sent sequentially. If a previous request's response is slow, all subsequent requests must wait.

**Solutions**:
- HTTP/2 multiplexing
- Domain sharding (multiple domains for multiple connections)
- Connection pooling (limiting concurrency)

### 8.3 HTTP/2 Advantages

| Feature | HTTP/1.1 | HTTP/2 |
| :--- | :--- | :--- |
| **Transmission format** | Text | Binary frames |
| **Multiplexing** | Not supported | Supported |
| **Header compression** | None | HPACK algorithm |
| **Server push** | Not supported | Supported |

---

## Glossary

| Term | Full Name | Description |
| :--- | :--- | :--- |
| **HTTP** | HyperText Transfer Protocol | The foundational web communication protocol |
| **HTTPS** | HTTP Secure | HTTP + SSL/TLS |
| **TCP** | Transmission Control Protocol | Reliable transport protocol |
| **SSL/TLS** | Secure Sockets Layer | Security protocol layer |
| **Idempotent** | - | Multiple requests produce the same result |
| **Keep-Alive** | - | Sending multiple requests over one TCP connection |
| **Multiplexing** | - | Sending multiple requests simultaneously |
| **Head-of-Line Blocking** | - | Earlier requests blocking later ones |

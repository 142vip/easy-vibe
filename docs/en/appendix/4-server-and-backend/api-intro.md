# An Introduction to APIs: Understanding Inter-Program Communication from Scratch

::: tip 🎯 Core Question
**What is an API?** It's like asking: how should a restaurant design its menu so guests can understand it at a glance? How should waiters take orders without making mistakes? APIs solve the problem of "how programs communicate with each other." You've been using APIs since your first day of coding — you just might not have realized it.
:::

---

## 0. Three Common Confusions for Beginners

**Confusion 1: Are APIs something advanced?**

Many people think APIs are only for senior engineers. But you've already used APIs:

```python
len("hello")        # This is a Python API
open("file.txt")    # This is also an API
requests.get(url)   # This is still an API
```

**Confusion 2: What's the difference between Web APIs and regular APIs?**

| Type | Target | Communication Method | Typical Scenario |
| :--- | :--- | :--- | :--- |
| **Function API** | Local code | Function call | `len()`, `open()` |
| **OS API** | Operating system | System call | File I/O, process creation |
| **Web API** | Remote server | HTTP request | Calling AI models, getting weather |

**Confusion 3: Should I use HTTP or SDK?**

```python
# HTTP approach: handle all details yourself
import requests
response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": "Bearer sk-xxx"},
    json={"model": "deepseek-chat", "messages": [...]}
)
result = response.json()["choices"][0]["message"]["content"]

# SDK approach: let the butler handle it
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[...]
)
result = response.choices[0].message.content
```

---

## 1. The Essence of APIs: Plugs and Sockets

**API** (Application Programming Interface) is simply the "agreement for communication between programs."

### 1.1 Appliance Analogy

| Concept | Appliance Analogy | API Equivalent |
| :--- | :--- | :--- |
| **Interface** | Socket shape | Function signature / URL |
| **Input** | Electrical current input | Function parameters / Request body |
| **Output** | Appliance operates | Return value / Response body |

### 1.2 Three Types of API Comparison

<ApiTypesComparison />

### 1.3 Function API vs HTTP API: What's the Difference

Many beginners wonder: what's the real difference between function APIs and HTTP APIs? How to tell them apart when reading documentation?

<ApiFunctionVsHttp />

### 1.4 How to Read Different Types of API Documentation

Different types of API documentation have different focus areas:

<DocumentTypesComparison />

---

## 2. A Complete API Call

👇 **Try it out**: Click the button below to observe a complete API request-response flow:

<ApiRequestDemo />

### 2.1 Four Stages of an API Call

| Stage | What Happens | Appliance Analogy |
| :--- | :--- | :--- |
| **Request** | Client sends request to server | Pressing a switch |
| **Transmission** | Request travels through network to server | Current flows through wires |
| **Processing** | Server processes request and returns data | Appliance starts working |
| **Response** | Client receives and processes the result | Light bulb lights up |

### 2.2 Restaurant Analogy

| Restaurant Role | API Equivalent | Description |
| :--- | :--- | :--- |
| **Menu** | API Documentation | Tells you what "dishes" are available |
| **Waiter** | HTTP Protocol | Standardized "way of communicating" |
| **Kitchen** | Server | Processes requests based on "orders" |
| **Serving Food** | Response | Returns results to the "guest" |

---

## 3. HTTP Methods: Overview of You "Asking" or "Doing"

When calling a Web API, you need to tell the server what you want to do. That's where HTTP methods come in.

### 3.1 Restaurant Ordering Analogy

| Scenario | What would you say in real life? | HTTP Method |
| :--- | :--- | :--- |
| You want to see today's menu | "Waiter, let me see the menu" | **GET** - Pure "asking", doesn't modify data |
| You want to order Kung Pao Chicken | "I'll have the Kung Pao Chicken" | **POST** - "Doing" something, creates data |
| You want to change your dish | "Change Kung Pao Chicken to Sweet and Sour Pork" | **PUT** - Replace data |
| You want to change the flavor | "No peanuts in the Kung Pao Chicken" | **PATCH** - Partial modification |
| You don't want it anymore | "Never mind, cancel that dish" | **DELETE** - Delete data |

<HttpMethodsDemo />

::: warning About Idempotency
**Idempotency**: Do multiple executions produce the same result?

- **Idempotent operations** (GET/PUT/DELETE): Clicking 10 times produces the same result as clicking once
- **Non-idempotent operations** (POST): Clicking 10 times might create 10 orders

**Solution**: Use unique IDs for POST operations to prevent duplicate processing.
:::

### 3.2 HTTP Methods Quick Reference

| Method | Purpose | Idempotent | Safe | Typical Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | Retrieve resource | Yes | Yes | Query lists, view details |
| **POST** | Create resource | No | No | Add user, submit order |
| **PUT** | Full update | Yes | No | Replace entire user profile |
| **PATCH** | Partial update | No | No | Only modify nickname |
| **DELETE** | Delete resource | Yes | No | Delete user, cancel order |

---

## 4. HTTP Status Codes: Overview of the Server Telling You

When the server responds, it first returns a status code telling you whether the request was successful.

### 4.1 Status Code Categories

<StatusCodeCategories />

### 4.2 Common Status Codes Explained

| Status Code | Meaning | Typical Scenario | Client Handling |
| :--- | :--- | :--- | :--- |
| **200 OK** | Success | Request processed normally | Display data |
| **201 Created** | Created successfully | POST request successfully created resource | Redirect to new resource |
| **400 Bad Request** | Request format error | Missing or malformed parameters | Check parameters |
| **401 Unauthorized** | Unauthenticated | No valid API Key provided | Guide user to login |
| **403 Forbidden** | No permission | API Key doesn't have access to this resource | Show insufficient permissions |
| **404 Not Found** | Not found | Requested address or resource doesn't exist | Check URL |
| **429 Too Many Requests** | Too many requests | Exceeded rate limit | Retry later |
| **500 Internal Server Error** | Server error | Server-side problem | Tell user to retry later |

👇 **Try it out**: Click the button below to learn about common status codes:

<StatusCodeDemo />

---

## 5. HTTP vs SDK: Run Errands Yourself or Let the Butler Handle It

### 5.1 Two Calling Methods Compared

| | 🏃 **HTTP API** | 🤵 **SDK** |
| :--- | :--- | :--- |
| **Analogy** | Running errands yourself | Butler handles it |
| **Pros** | ✓ Works with any language<br>✓ Full control over request details<br>✓ No additional dependencies | ✓ Clean, readable code<br>✓ Automatic authentication<br>✓ Built-in error retry |
| **Cons** | ✗ Need to handle all details<br>✗ Verbose and error-prone code | ✗ Need to install dependencies<br>✗ May have version issues |
| **Code Example** | `requests.post(url, json=..., headers={...})` | `client.chat.completions.create(...)` |

### 5.2 Approach to choosing

| Scenario | Recommended Approach | Reason |
| :--- | :--- | :--- |
| **Rapid development** | SDK | Handles authentication, errors, and retries automatically |
| **Learning principles** | HTTP | Understand underlying mechanisms |
| **Unsupported language** | HTTP | Works with any language |
| **Need customization** | HTTP | Flexible control over every detail |

::: tip 💡 Recommendation
**Use SDK when available.** Leave the hassle to the library, save time for yourself.
:::

---

## 6. Approach to reading API Documentation

API documentation is like a combination of a manual and a menu. You don't need to read it cover to cover — just learn how to "look things up in a dictionary."

### 6.1 Documentation Reading Checklist

Open any API documentation (like OpenAI or DeepSeek), and you only need to find these things:

<ApiDocumentDemo />

| Item | Description | Example |
| :--- | :--- | :--- |
| **Base URL** | Root address of the API | `https://api.deepseek.com` |
| **Authentication** | How to prove your identity | `Authorization: Bearer sk-xxx` |
| **Endpoints** | Specific endpoint list | `/v1/chat/completions` |
| **Parameters** | Required/optional parameters | `model` (required), `temperature` (optional) |
| **Response** | Return data structure | `{"choices": [...]}` |

### 6.2 Steps to Read Documentation

1. **Find the Base URL** - This is the prefix for all requests
2. **Understand the authentication method** - Is the API Key in the Header or Query?
3. **Find the Endpoint you need** - The specific endpoint you want to call
4. **Check request parameters** - Which are required? Which are optional?
5. **Understand the response format** - How is the data organized?

---

## 7. Hands-on Practice: Simulate API Calls

Practice makes perfect. Here's a simulated API where you can fill in any parameters and change any address to see what happens.

<ApiPlayground />

Try triggering these scenarios:
- ✅ **Successful request**: Enter the correct Endpoint and API Key
- ❌ **401 Error**: Don't enter an API Key and see how the server rejects you
- ❌ **404 Error**: Enter a non-existent address

---

## 8. Summary

::: info Key Takeaways
1. **APIs are like megaphones**, helping you pass messages to other code or remote servers
2. **You've already used APIs**, from `len()` to `open()`, they're all APIs
3. **Web APIs are superpowers**, letting you call supercomputers thousands of miles away
4. **SDKs are good butlers**, use SDKs when available instead of running errands yourself
5. **Look for three things in documentation**: address, authentication, and parameters
:::

In the era of AI programming, you only need to remember these core concepts. The rest of the details will be handled by your IDE and AI assistant.

---

## Glossary

| Term | Full Name | Explanation |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | Application programming interface, defines how software interacts |
| **Web API** | - | HTTP-based API for network communication |
| **Endpoint** | - | Endpoint, the specific address of an API |
| **HTTP** | HyperText Transfer Protocol | Communication protocol used by Web APIs |
| **GET** | - | Method for retrieving resources |
| **POST** | - | Method for submitting data |
| **SDK** | Software Development Kit | Software development kit that wraps underlying API calls |
| **URL** | Uniform Resource Locator | Network address of an API |
| **JSON** | JavaScript Object Notation | Commonly used data format |
| **Authentication** | - | Process of verifying identity |
| **Status Code** | - | Status code in HTTP responses |
| **Request** | - | Request |
| **Response** | - | Response |
| **Header** | - | HTTP header containing metadata |
| **Payload** | - | Actual data in a request or response |
| **Rate Limit** | - | Rate limiting |
| **Idempotent** | - | Idempotent, multiple executions produce the same result |
| **REST** | Representational State Transfer | An API architectural style |
| **RPC** | Remote Procedure Call | Remote procedure call |
| **GraphQL** | - | A query language API |
| **gRPC** | - | High-performance RPC framework developed by Google |

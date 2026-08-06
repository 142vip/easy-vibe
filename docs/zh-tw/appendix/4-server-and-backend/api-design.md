# API 設計：前後端的通信協議

::: tip 🎯 核心問题
**前後端如何高效對话？** 這就像問：餐厅的菜單怎么設計，客人一看就懂？服務员怎么記單，不會出錯？上菜怎么規范，客人满意？API 設計解决的就是"對话規则"的問题。
:::

---

## 0. 場景引入

**場景一：接口命名隨心所欲**

```
GET /getUserData
GET /fetchUserInfo
GET /queryUserById
GET /users/query
```

四个接口，功能一样，命名風格完全不同。新人入职一脸懵：我該用哪个？

**場景二：錯误處理五花八門**

```json
// 有的返回 HTTP 狀態碼
HTTP/1.1 404 Not Found

// 有的返回 200 + code
HTTP/1.1 200 OK
{ "code": 404, "message": "用户不存在" }

// 有的直接抛异常
HTTP/1.1 200 OK
{ "error": "出錯了" }
```

前端不知道該怎么判断請求是否成功。

**場景三：響應結構千人千面**

```json
// 接口 A
{ "data": { ... } }

// 接口 B
{ "result": { ... } }

// 接口 C
{ "content": { ... } }
```

每个接口返回格式都不一样，前端需要針對每个接口單独處理。

---

**好的 API 設計就像餐厅的點餐系统**——菜單清晰、流程規范、出錯有提示。

---

## 1. API概述

**API**（Application Programming Interface，應用程序編程接口）就是"程序之間對话的约定"。

### 1.1 用餐厅來類比

| 餐厅角色 | 對應概念 | 說明 |
| :--- | :--- | :--- |
| 菜單 | API 文檔 | 告诉你有哪些"菜"可以點 |
| 服務员 | HTTP 協议 | 標準化的"對话方式" |
| 後厨 | 服務端 | 按"订單"處理請求 |
| 上菜 | 響應 | 把結果返回给"客人" |

### 1.2 一个完整的 API 請求

👇 **動手試試看**：點擊下方按钮，观察一次完整的 API 請求-響應流程：

<ApiRequestDemo />

---

## 2. API 設計哲學：RPC / REST / GraphQL / gRPC

在開始具體的 RESTful 設計之前，先了解四種主流的 API 設計風格：

<ApiStyleCompare />

### 2.1 REST vs RESTful：的區別界定

很多人會混淆這兩个概念：

| 概念 | 含義 | 說明 |
| :--- | :--- | :--- |
| **REST** | 一種架構風格 | 由 Roy Fielding 提出的設計理念，包含一組约束條件 |
| **RESTful** | 符合 REST 風格的 | 形容词，表示 API 設計遵循了 REST 原则 |

**類比**：
- REST 就像"极简主義"——一種設計理念
- RESTful API 就像"极简風格的房間"——應用了這个理念的具體實現

**REST 的六大约束**：

| 约束 | 說明 |
| :--- | :--- |
| **客户端-服務器分離** | 前後端独立開發，接口解耦 |
| **无狀態** | 每个請求包含所有必要信息，服務器不保存會话狀態 |
| **可緩存** | 響應應標明是否可緩存，提高性能 |
| **统一接口** | 使用標準的 HTTP 方法和狀態碼 |
| **分層系统** | 客户端无需知道連接的是哪層服務器 |
| **按需代碼**（可選） | 服務器可以擴展客户端功能 |

::: tip 💡 為什么 REST 最常用？
1. **學習成本低**：HTTP 協议本身就體現了 REST 思想
2. **生態成熟**：工具、框架、文檔豐富
3. **通用性強**：任何語言、任何平台都能調用
4. **易于緩存**：GET 請求天然可緩存，CDN 友好
:::

---

## 3. RESTful 設計：URL 命名語義

**REST**（Representational State Transfer）是一種架構風格，核心思想是：

- 把網絡上的事物抽象為"资源"（Resource）
- 用 URL 標識资源
- 用 HTTP 方法操作资源

### 3.1 用倉庫來類比

| 倉庫概念 | REST 對應 | 示例 |
| :--- | :--- | :--- |
| 货架地址 | URL | `/users`、`/orders` |
| 操作方式 | HTTP 方法 | GET（查看）、POST（入庫） |
| 货物 | 资源 | 用户數據、订單數據 |

**關鍵原则**：URL 是名词，不是動词。

### 3.2 URL 設計規则

| 規则 | 錯误示例 | 正确示例 | 說明 |
| :--- | :--- | :--- | :--- |
| 用名词不用動词 | `/getUsers` | `/users` | URL 表示资源，HTTP 方法表示操作 |
| 用複數形式 | `/user` | `/users` | 统一複數風格 |
| 小写+連字符 | `/UserProfiles` | `/user-profiles` | URL 大小写敏感 |
| 避免層级過深 | `/a/b/c/d/e` | `/a/b/c` | 最多 3 層 |
| 過滤用查询參數 | `/products/phone/5000` | `/products?cat=phone` | 過滤條件用 `?` 參數 |

::: tip 💡 URL 大小写敏感
统一用小写 + 連字符（-）是最安全的做法，避免大小写混亂和下划线風格不一致的問题。
:::

### 3.3 HTTP 方法選择

| 方法 | 用途 | 幂等性 | 安全性 | 典型場景 |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | 獲取资源 | 是 | 是 | 查询列表、查看詳情 |
| **POST** | 創建资源 | 否 | 否 | 新增用户、提交订單 |
| **PUT** | 全量更新 | 是 | 否 | 替换整个用户资料 |
| **PATCH** | 部分更新 | 否 | 否 | 只修改昵称 |
| **DELETE** | 删除资源 | 是 | 否 | 删除用户、取消订單 |

::: tip 💡 什么是幂等性？
**幂等性**：多次執行結果相同。

- **幂等的操作**（GET/PUT/DELETE）：點 10 次和點 1 次，結果一样
- **不幂等的操作**（POST）：點 10 次，可能創建 10 个订單

**解决方案**：POST 操作用唯一 ID 校验，避免重複處理。
:::

---

## 4. 狀態碼：讓錯误"會說话"

HTTP 狀態碼是服務器告诉客户端"發生了什么"的標準方式。

### 4.1 狀態碼分類

| 分類 | 含義 | 典型狀態碼 |
| :--- | :--- | :--- |
| **2xx** | 成功 | 200 OK、201 Created、204 No Content |
| **3xx** | 重定向 | 301 永久移動、304 未修改 |
| **4xx** | 客户端錯误 | 400 參數錯误、401 未認證、404 不存在 |
| **5xx** | 服務端錯误 | 500 內部錯误、503 服務不可用 |

### 4.2 常用狀態碼演示

👇 **動手試試看**：點擊下方按钮，了解常见狀態碼的含義：

<StatusCodeDemo />

---

## 5. 錯误處理：優雅地"拒绝"

好的錯误處理能讓客户端"看狀態碼就知道怎么回事"，而不是去猜。

### 4.1 錯误處理的"避坑指南"

**坑 1：所有錯误都返回 200**

```json
// ❌ 錯误做法
HTTP/1.1 200 OK
{ "error": "出錯了" }
```

問题：緩存層會緩存這个"成功"響應，監控系统發現不了問题。

**坑 2：錯误信息太笼统**

```json
// ❌ 錯误做法
HTTP/1.1 400 Bad Request
{ "message": "參數錯误" }
```

問题：客户端不知道哪个參數錯了、為什么錯。

**坑 3：暴露敏感信息**

```json
// ❌ 危險做法
HTTP/1.1 500 Internal Server Error
{ "stack": "at UserService.login...", "sql": "SELECT * FROM..." }
```

危險：暴露了代碼結構、數據庫查询，攻擊者可以利用這些信息。

### 5.2 正确的錯误處理演示

👇 **動手試試看**：對比"好的"和"差的"錯误響應設計：

<ErrorHandlingDemo />

---

## 6. 版本控制：API 的"向後兼容"

### 6.1 版本控制的動機

場景：你的 App 有 100 万用户，需要修改订單接口。

**如果不做版本控制**：
- 新 App 調用新接口 → 正常
- 舊 App 調用新接口 → 字段缺失，崩溃！

**正确的做法**：
- `/v1/orders` - 舊接口，继續服務舊 App
- `/v2/orders` - 新接口，新功能在這裡

### 6.2 版本控制策略

| 策略 | 示例 | 優點 | 缺點 |
| :--- | :--- | :--- | :--- |
| **URL 路径** | `/v1/users` | 直观、易緩存 | URL 變長 |
| **請求頭** | `Accept: vnd.api.v2+json` | URL 干净 | 不便調試 |
| **查询參數** | `/users?version=2` | 简單 | 不够標準 |

### 6.3 版本演進示例

以用户接口為例，展示 v1 到 v2 的演進：

| 接口 | v1（舊版） | v2（新版） | 變化說明 |
| :--- | :--- | :--- | :--- |
| **獲取用户** | `GET /v1/users`<br>返回：`name, email` | `GET /v2/users`<br>返回：`name, email, avatar, phone` | 新增頭像、手機号字段 |
| **創建订單** | `POST /v1/orders`<br>接收：`items[]` | `POST /v2/orders`<br>接收：`items[], coupons[]` | 新增優惠券支持 |
| **批量操作** | 无 | `POST /v2/orders/batch` | 新增批量創建接口 |

::: tip 💡 版本控制最佳實踐
- **保持向後兼容**：v1 接口至少維護 6-12 个月，给客户端升级時間
- **文檔同步更新**：每个版本有独立的 API 文檔
- **废弃公告**：提前通知 v1 将在何時下线，引導遷移
- **監控使用情况**：统計 v1 調用量，确認可以安全下线後再停止服務
:::

---

## 7. 響應結構設計

響應結構是前後端協作的"數據契约"，统一格式能大幅降低沟通成本。

<ResponseStructureDemo />

### 7.1 大厂實踐參考

::: details Google API 設計指南
參考 [Google API Design Guide](https://cloud.google.com/apis/design/errors)，Google 要求所有 API 錯误響應必须包含 `google.rpc.Status` 消息結構：

```json
{
  "error": {
    "code": 429,
    "message": "资源不足，請稍後重試",
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

**核心要求**：
- 必须包含 `ErrorInfo` 提供機器可讀的錯误標識
- `message` 面向開發者，用简洁語言描述問题和解决方案
- `details` 數組可包含 `LocalizedMessage`（本地化消息）、`Help`（帮助鏈接）等
:::

::: details Microsoft REST API 指南
參考 [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md)，微軟強調響應的一致性：

**錯误與故障的分類**：
- **錯误（Error）**：客户端傳遞无效數據導致，返回 4xx，不影響 API 可用性
- **故障（Fault）**：服務端无法正确響應有效請求，返回 5xx，影響 API 可用性

**響應標頭規范**：
- `Date`：必须返回，使用 RFC 5322 格式（GMT 時區）
- `Content-Type`：必须返回
- `ETag`：支持樂观并發控制的资源必须返回
:::

::: details 阿裡巴巴 Java 開發手册
參考 [阿裡巴巴 Java 開發手册](https://developer.aliyun.com/special/tech-java)，阿裡對 API 響應有以下規范：

**统一返回對象**：
```java
public class Result<T> {
    private Integer code;
    private String message;
    private T data;
    private String requestId;
}
```

**錯误碼分段設計**：
| 范围 | 類型 | 示例 |
| :--- | :--- | :--- |
| 0 | 成功 | 0 |
| 1xxxx | 參數錯误 | 10001 缺少必填參數 |
| 2xxxx | 業務錯误 | 20001 餘额不足 |
| 3xxxx | 認證錯误 | 30001 未登錄 |
| 5xxxx | 系统錯误 | 50001 數據庫异常 |
:::

::: details Stripe API 響應設計
參考 [Stripe API Documentation](https://docs.stripe.com/api/errors)，Stripe 的錯误響應設計非常精细：

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

**設計亮點**：
- `type` 區分錯误類型：`api_error`、`card_error`、`invalid_request_error`
- `param` 指出具體哪个參數出錯，前端可直接定位表單字段
- `doc_url` 提供文檔鏈接，開發者可深入了解
- `decline_code` 提供更细粒度的錯误原因
:::

::: details JSON:API 規范
參考 [JSON:API Specification](https://jsonapi.org/format/)，這是一个業界广泛采纳的 JSON API 響應規范：

```json
{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API 規范詳解"
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
        "name": "张三"
      }
    }
  ]
}
```

**核心設計**：
- `data` 包含主资源，必须有 `type` 和 `id`
- `attributes` 存放资源属性
- `relationships` 描述资源關聯
- `included` 避免重複請求，一次性返回關聯數據
:::

::: details GitHub REST API 響應設計
參考 [GitHub REST API Documentation](https://docs.github.com/en/rest)，GitHub 的響應設計注重開發者體验：

**成功響應**：
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

**錯误響應**：
```json
{
  "message": "Bad credentials",
  "documentation_url": "https://docs.github.com/rest"
}
```

**設計亮點**：
- 響應包含多種 URL 格式（`html_url`、`url`）方便不同場景使用
- 錯误響應包含 `documentation_url` 指向文檔
- 使用 `Link` 響應頭實現分頁導航
:::

::: details Twitter/X API v2 響應設計
參考 [Twitter API v2 Documentation](https://developer.twitter.com/en/docs/twitter-api)，Twitter API v2 采用简洁的響應格式：

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

**設計亮點**：
- `data` 包含主數據，`includes` 包含關聯數據（類似 JSON:API）
- 支持字段選择：`?tweet.fields=created_at,public_metrics`
- 分頁使用 `next_token` 和 `previous_token`
:::

### 7.2 最佳實踐總結

综合以上規范，響應結構設計應遵循以下原则：

1. **一致性優先**：所有接口使用相同的響應結構，前端可统一封装請求層
2. **機器可讀**：錯误碼 + 錯误原因（reason）讓程序能自動處理
3. **人類友好**：message 描述清晰，包含解决建议
4. **可追蹤**：request_id 贯穿請求全鏈路，便于問题定位
5. **国际化支持**：通過 details 擴展本地化消息

### 7.3 data 字段設計規范

`data` 是響應的核心，其設計直接影響前端開發效率。

<DataFieldDesignDemo />

### 7.4 錯误響應設計進階

<ErrorResponseDesignDemo />

::: tip 參考鏈接
- [Google API Design Guide - Errors](https://cloud.google.com/apis/design/errors)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
- [阿裡巴巴 Java 開發手册](https://developer.aliyun.com/special/tech-java)
- [Heroku HTTP API Design Guide](https://github.com/interagent/http-api-design)
- [Stripe API - Errors](https://docs.stripe.com/api/errors)
- [JSON:API Specification](https://jsonapi.org/format/)
:::

---

## 8. 實戰：電商系统 API 設計示例

```
# 用户模塊
GET    /v1/users                    # 獲取用户列表
POST   /v1/users                    # 創建新用户
GET    /v1/users/{id}               # 獲取用户詳情
PUT    /v1/users/{id}               # 全量更新用户
PATCH  /v1/users/{id}               # 部分更新用户
DELETE /v1/users/{id}               # 删除用户

# 订單模塊
GET    /v1/users/{id}/orders        # 獲取某用户的订單
POST   /v1/orders                   # 創建订單
GET    /v1/orders/{id}              # 獲取订單詳情
PATCH  /v1/orders/{id}/status       # 更新订單狀態

# 商品模塊（複雜過滤用查询參數）
GET    /v1/products?category=phone&price_max=5000&sort=price_desc&page=1
```

---

## 9. 用 AI 輔助設計 API

AI 可以帮助你快速生成符合規范的 API 設計。關鍵在于提供清晰的上下文和约束條件。

### 9.1 提示词模板

```
你是一位资深的後端架構师，精通 RESTful API 設計。請帮我設計一套 API 接口。

## 業務背景
[描述你的業務場景，例如：電商系统、博客平台、任務管理等]

## 功能需求
[列出需要的功能模塊，例如：
- 用户管理：注册、登錄、个人信息
- 订單管理：創建订單、查询订單、取消订單
- 商品管理：商品列表、商品詳情、搜索]

## 設計要求
1. 遵循 RESTful 規范
2. URL 使用名词複數，小写+連字符
3. 正确使用 HTTP 方法（GET/POST/PUT/PATCH/DELETE）
4. 统一的響應格式：{ code, message, data, request_id }
5. 合理的狀態碼使用
6. 版本控制：URL 路径方式（/v1/）

## 輸出格式
請按以下格式輸出：

### 接口列表
| 方法 | URL | 描述 | 請求體 | 響應體 |
|------|-----|------|--------|--------|

### 請求/響應示例
[關鍵接口的詳细示例]

### 狀態碼說明
[使用的狀態碼及其含義]
```

### 9.2 實戰示例：電商订單 API

**輸入提示词：**

```
你是一位资深的後端架構师，精通 RESTful API 設計。請帮我設計一套電商订單系统的 API 接口。

## 業務背景
一个 B2C 電商平台，用户可以浏览商品、下單購買、查看订單狀態。

## 功能需求
- 订單模塊：創建订單、查询订單列表、查询订單詳情、取消订單、支付订單
- 購物車模塊：添加商品、修改數量、删除商品、查看購物車

## 設計要求
1. 遵循 RESTful 規范
2. URL 使用名词複數，小写+連字符
3. 正确使用 HTTP 方法
4. 统一的響應格式
5. 版本控制：/v1/
```

**AI 輸出示例：**

| 方法 | URL | 描述 |
| :--- | :--- | :--- |
| `POST` | `/v1/orders` | 創建订單 |
| `GET` | `/v1/orders` | 查询订單列表 |
| `GET` | `/v1/orders/{id}` | 查询订單詳情 |
| `PATCH` | `/v1/orders/{id}/status` | 更新订單狀態（取消/支付） |
| `GET` | `/v1/users/{id}/cart` | 獲取購物車 |
| `POST` | `/v1/users/{id}/cart/items` | 添加商品到購物車 |
| `PATCH` | `/v1/users/{id}/cart/items/{itemId}` | 修改購物車商品數量 |
| `DELETE` | `/v1/users/{id}/cart/items/{itemId}` | 删除購物車商品 |

### 9.3 AI 輔助設計的注意事项

| 注意點 | 說明 |
| :--- | :--- |
| **提供完整上下文** | 業務背景、用户角色、數據關系都要說清楚 |
| **明确约束條件** | 命名規范、版本策略、響應格式等要提前定義 |
| **迭代優化** | 第一次輸出可能不完美，追問细節、要求修改 |
| **人工审核** | AI 生成的內容需要人工檢查是否符合業務需求 |
| **补充邊界情况** | 讓 AI 考虑錯误處理、權限控制、分頁等邊界情况 |

::: tip 💡 追問技巧
- "請补充每个接口的錯误響應示例"
- "請考虑分頁、排序、過滤參數"
- "請添加接口的權限控制說明"
- "請檢查是否符合 RESTful 最佳實踐"
:::

---

## 名词速查表

| 名词 | 英文 | 解釋 |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | 程序之間對话的约定 |
| **REST** | Representational State Transfer | 一種架構風格，用 URL 標識资源 |
| **资源** | Resource | REST 架構的核心概念，有唯一標識（URL） |
| **幂等性** | Idempotency | 多次執行結果相同 |
| **狀態碼** | Status Code | HTTP 協议定義的響應狀態 |
| **版本控制** | Versioning | 讓新舊 API 并存，平滑升级 |
| **請求體** | Request Body | POST/PUT/PATCH 請求携带的數據 |
| **響應體** | Response Body | 服務器返回的數據 |
| **Header** | Header | 請求/響應的元數據（如 Content-Type） |
| **認證** | Authentication | 验證"你是誰"（登錄、Token） |
| **授權** | Authorization | 验證"你能做什么"（權限） |

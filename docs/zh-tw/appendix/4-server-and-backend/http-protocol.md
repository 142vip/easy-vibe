# HTTP 協定原理：前後端的通訊語言

::: tip 🎯 核心問题
**HTTP 是如何工作的？** 這就像問：兩个人如何對话？需要约定語言、語法、對话規则。HTTP 就是前後端之間的"對话協议"。
:::

---

## 0. HTTP 的本质

**HTTP**（HyperText Transfer Protocol，超文本傳輸協议）是前後端通信的基础協议。

### 0.1 用對话來類比

| 對话要素 | HTTP 對應 | 說明 |
| :--- | :--- | :--- |
| 語言 | HTTP 協议 | 雙方都能理解的語言 |
| 語法 | 請求/響應格式 | 怎么"說话" |
| 流程 | 請求-響應模式 | 一問一答 |
| 結束 | 挂断 | TCP 連接關閉 |

---

## 1. HTTP 的發展歷程

HTTP 從 1991 年诞生至今，經歷了多次重大升级。

<HttpProtocolDemo />

### 1.1 版本對比

| 版本 | 年份 | 核心改進 | 典型特征 |
| :--- | :--- | :--- | :--- |
| **HTTP/0.9** | 1991 | 僅支持 GET | 纯文本，只有請求，无響應頭 |
| **HTTP/1.0** | 1996 | 增加 POST/HEAD | 每个請求一个 TCP 連接 |
| **HTTP/1.1** | 1997 | 持久連接 | Keep-Alive，一个連接多个請求 |
| **HTTP/2** | 2015 | 多路複用 | 二進制帧，頭部压缩 |
| **HTTP/3** | 2022 | 基于 QUIC | UDP 傳輸，解决队頭阻塞 |

::: tip 💡 為什么需要 HTTP/2？
HTTP/1.1 虽然支持持久連接，但請求必须串行發送（前一个請求的響應返回後，才能發送下一个請求）。HTTP/2 通過多路複用解决了這个問题，可以同時發送多个請求。
:::

---

## 2. HTTP 請求的結構

### 2.1 請求行

```http
GET /api/users/123 HTTP/1.1
```

包含三个部分：
- **方法**：GET、POST、PUT、DELETE 等
- **URL**：請求的资源路径
- **版本**：HTTP/1.1 或 HTTP/2

### 2.2 請求頭

```http
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer xxx
Content-Type: application/json
Content-Length: 45
```

常见請求頭：
| 頭部 | 說明 | 示例 |
| :--- | :--- | :--- |
| **Host** | 服務器域名 | `api.example.com` |
| **User-Agent** | 客户端信息 | `Mozilla/5.0` |
| **Accept** | 接受的響應類型 | `application/json` |
| **Authorization** | 認證信息 | `Bearer token` |
| **Content-Type** | 請求體類型 | `application/json` |

### 2.3 請求體

```json
{
  "name": "张三",
  "email": "zhangsan@example.com"
}
```

只有 POST、PUT、PATCH 等方法才有請求體。

---

## 3. HTTP 響應的結構

### 3.1 狀態行

```http
HTTP/1.1 200 OK
```

包含三个部分：
- **版本**：HTTP/1.1
- **狀態碼**：200、404、500 等
- **狀態文本**：OK、Not Found 等

### 3.2 響應頭

```http
Content-Type: application/json
Content-Length: 156
Cache-Control: max-age=3600
Set-Cookie: session=xxx; HttpOnly
```

常见響應頭：
| 頭部 | 說明 | 示例 |
| :--- | :--- | :--- |
| **Content-Type** | 響應體類型 | `application/json` |
| **Content-Length** | 響應體大小 | `156` |
| **Cache-Control** | 緩存策略 | `max-age=3600` |
| **Set-Cookie** | 設置 Cookie | `session=xxx` |

### 3.3 響應體

```json
{
  "code": 0,
  "data": {
    "id": 123,
    "name": "张三"
  }
}
```

---

## 4. HTTP 方法詳解

| 方法 | 用途 | 請求體 | 幂等性 | 安全性 |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | 獲取资源 | 无 | 是 | 是 |
| **POST** | 創建资源 | 有 | 否 | 否 |
| **PUT** | 全量更新 | 有 | 是 | 否 |
| **PATCH** | 部分更新 | 有 | 否 | 否 |
| **DELETE** | 删除资源 | 无 | 是 | 否 |
| **HEAD** | 獲取頭部 | 无 | 是 | 是 |
| **OPTIONS** | 查询支持的方法 | 无 | 是 | 是 |

### 4.1 GET vs POST

| 特性 | GET | POST |
| :--- | :--- | :--- |
| **參數位置** | URL 查询參數 | 請求體 |
| **緩存** | 可緩存 | 默認不緩存 |
| **書簽** | 可添加為書簽 | 不可 |
| **歷史記錄** | 保存在浏览器歷史 | 不保存 |
| **數據長度** | 有限制（URL 長度） | 无限制 |
| **安全性** | 參數可见在 URL | 參數在請求體中 |

::: tip 💡 何時使用 GET/POST？
- **GET**：查询、獲取數據
- **POST**：創建、提交數據
- **PUT**：全量更新（替换整个资源）
- **PATCH**：部分更新（只修改指定字段）
- **DELETE**：删除资源
:::

---

## 5. HTTP 狀態碼

### 5.1 狀態碼分類

| 分類 | 說明 | 典型狀態碼 |
| :--- | :--- | :--- |
| **2xx** | 成功 | 200 OK、201 Created、204 No Content |
| **3xx** | 重定向 | 301 永久、302 臨時、304 未修改 |
| **4xx** | 客户端錯误 | 400 參數錯误、401 未認證、404 不存在 |
| **5xx** | 服務端錯误 | 500 內部錯误、503 不可用 |

### 5.2 常用狀態碼

| 狀態碼 | 說明 | 使用場景 |
| :--- | :--- | :--- |
| **200 OK** | 請求成功 | GET、PUT 請求成功 |
| **201 Created** | 創建成功 | POST 創建资源成功 |
| **204 No Content** | 无內容 | DELETE 删除成功 |
| **301 Moved Permanently** | 永久重定向 | URL 永久變更 |
| **302 Found** | 臨時重定向 | URL 臨時變更 |
| **304 Not Modified** | 未修改 | 緩存有效 |
| **400 Bad Request** | 參數錯误 | 請求參數格式錯误 |
| **401 Unauthorized** | 未認證 | 需要登錄 |
| **403 Forbidden** | 无權限 | 已登錄但權限不足 |
| **404 Not Found** | 不存在 | 资源不存在 |
| **500 Internal Server Error** | 內部錯误 | 服務器异常 |
| **503 Service Unavailable** | 不可用 | 服務器維護或過載 |

---

## 6. HTTPS：安全的 HTTP

### 6.1 HTTP vs HTTPS

| 特性 | HTTP | HTTPS |
| :--- | :--- | :--- |
| **協议** | TCP | TCP + SSL/TLS |
| **端口** | 80 | 443 |
| **數據** | 明文傳輸 | 加密傳輸 |
| **證書** | 不需要 | 需要 SSL 證書 |
| **性能** | 略快 | 略慢（握手開銷） |
| **SEO** | 无影響 | 搜索引擎優先收錄 |

### 6.2 HTTPS 的工作流程

1. **Client Hello**：客户端發送支持的加密套件
2. **Server Hello**：服務器返回證書和選定的加密套件
3. **验證證書**：客户端验證服務器證書的有效性
4. **密鑰交换**：使用非對称加密交换會话密鑰
5. **加密通信**：使用會话密鑰進行對称加密通信

::: tip 💡 HTTPS 的優勢
- **防窃听**：數據加密，第三方无法讀取
- **防篡改**：數據完整性校验
- **防冒充**：SSL 證書验證服務器身份
:::

---

## 7. HTTP 緩存機制

### 7.1 緩存頭

| 頭部 | 說明 | 示例 |
| :--- | :--- | :--- |
| **Cache-Control** | 緩存策略 | `max-age=3600` |
| **ETag** | 资源版本号 | `"33a64df551425fcc"` |
| **Last-Modified** | 最後修改時間 | `Wed, 21 Oct 2015 07:28:00 GMT` |

### 7.2 緩存策略

**強緩存**：
```http
Cache-Control: max-age=3600
```
在 3600 秒內，浏览器直接使用緩存，不發送請求。

**協商緩存**：
```http
ETag: "33a64df551425fcc"
```
浏览器發送 `If-None-Match`，服務器返回 304（未修改）或 200（已修改）。

---

## 8. 常见問题

### 8.1 GET 和 POST 的本质區別

**误區**：GET 和 POST 的區別只是參數位置不同。

**真相**：
- GET 是幂等的，多次請求結果相同
- POST 是非幂等的，多次請求可能創建多个资源
- GET 可被緩存，POST 默認不緩存
- GET 可被書簽保存，POST 不可

### 8.2 HTTP/1.1 的队頭阻塞

**問题**：HTTP/1.1 虽然支持持久連接，但請求必须串行發送。前一个請求響應慢，後續請求都要等待。

**解决方案**：
- HTTP/2 多路複用
- 域名分片（多个域名建立多个連接）
- 連接池（限制并發數）

### 8.3 HTTP/2 的優勢

| 特性 | HTTP/1.1 | HTTP/2 |
| :--- | :--- | :--- |
| **傳輸格式** | 文本 | 二進制帧 |
| **多路複用** | 不支持 | 支持 |
| **頭部压缩** | 无 | HPACK 算法 |
| **服務器推送** | 不支持 | 支持 |

---

## 名词速查表

| 名词 | 英文 | 解釋 |
| :--- | :--- | :--- |
| **HTTP** | HyperText Transfer Protocol | 超文本傳輸協议 |
| **HTTPS** | HTTP Secure | HTTP + SSL/TLS |
| **TCP** | Transmission Control Protocol | 傳輸控制協议 |
| **SSL/TLS** | Secure Sockets Layer | 安全套接層 |
| **幂等性** | Idempotent | 多次請求結果相同 |
| **持久連接** | Keep-Alive | 一个 TCP 連接發送多个請求 |
| **多路複用** | Multiplexing | 同時發送多个請求 |
| **队頭阻塞** | Head-of-Line Blocking | 前面的請求阻塞後面的請求 |

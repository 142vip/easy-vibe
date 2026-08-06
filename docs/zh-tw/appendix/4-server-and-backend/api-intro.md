# API 入門導論：從零理解程式之間的通信

::: tip 🎯 核心問题
**什么是 API?** 這就像問:餐厅的菜單怎么設計,客人一看就懂?服務员怎么記單,不會出錯?API 解决的就是"程序之間如何對话"的問题。你写代碼的第一天就在用 API,只是你可能没意識到。
:::

---

## 0. 新手常见的三个困惑

**困惑一:API 是很高深的東西吗?**

很多人一听到 API,就觉得是高级工程师才能理解的概念。其實你早就用過 API 了:

```python
len("hello")        # 這就是 Python 提供的 API
open("file.txt")    # 這也是 API
requests.get(url)   # 這還是 API
```

**困惑二:Web API 和普通 API 有什么區別?**

| 類型 | 調用對象 | 通信方式 | 典型場景 |
| :--- | :--- | :--- | :--- |
| **函數 API** | 本地代碼 | 函數調用 | `len()`, `open()` |
| **操作系统 API** | 操作系统 | 系统調用 | 讀写文件、創建進程 |
| **Web API** | 遠程服務器 | HTTP 請求 | 調用 AI 模型、獲取天气 |

**困惑三:我該用 HTTP 還是 SDK?**

```python
# HTTP 方式:自己處理所有细節
import requests
response = requests.post(
    "https://api.deepseek.com/v1/chat/completions",
    headers={"Authorization": "Bearer sk-xxx"},
    json={"model": "deepseek-chat", "messages": [...]}
)
result = response.json()["choices"][0]["message"]["content"]

# SDK 方式:管家帮你處理
from openai import OpenAI
client = OpenAI(api_key="sk-xxx")
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[...]
)
result = response.choices[0].message.content
```

---

## 1. API 的本质:插頭與插座

**API**(Application Programming Interface,應用程序編程接口)就是"程序之間對话的约定"。

### 1.1 用電器來類比

| 概念 | 電器類比 | API 對應 |
| :--- | :--- | :--- |
| **接口** | 插座形狀 | 函數簽名 / URL |
| **輸入** | 電流輸入 | 函數參數 / 請求體 |
| **輸出** | 電器工作 | 返回值 / 響應體 |

### 1.2 三種 API 形態對比

<ApiTypesComparison />

### 1.3 函數 API vs HTTP API 的區別

很多初學者會困惑：函數 API 和 HTTP API 到底有什么區別？看文檔時該如何區分？

<ApiFunctionVsHttp />

### 1.4 API 文檔的閱讀方法

面對不同類型的 API 文檔，關注重點各不相同：

<DocumentTypesComparison />

---

## 2. 一次完整的 API 調用

👇 **動手試試看**:點擊下方按钮,观察一次完整的 API 請求-響應流程:

<ApiRequestDemo />

### 2.1 API 調用的四个階段

| 階段 | 發生了什么 | 電器類比 |
| :--- | :--- | :--- |
| **請求** | 客户端向服務器發送請求 | 按下開關 |
| **傳輸** | 請求通過網絡傳輸到服務器 | 電流通過電线 |
| **處理** | 服務器處理請求并返回數據 | 電器開始工作 |
| **響應** | 客户端接收并處理返回結果 | 灯泡發光 |

### 2.2 餐厅類比

| 餐厅角色 | API 對應 | 說明 |
| :--- | :--- | :--- |
| **菜單** | API 文檔 | 告诉你有哪些"菜"可以點 |
| **服務员** | HTTP 協议 | 標準化的"對话方式" |
| **後厨** | 服務端 | 按"订單"處理請求 |
| **上菜** | 響應 | 把結果返回给"客人" |

---

## 3. HTTP 方法:問與做的類型區分

調用 Web API 時,你需要告诉服務器你想做什么。這就是 HTTP 方法的由來。

### 3.1 用餐厅點餐來理解

| 場景 | 現實中你會怎么說? | 對應的 HTTP 方法 |
| :--- | :--- | :--- |
| 你想知道今天有什么菜 | "服務员,菜單给我看看" | **GET** - 纯"問",不改數據 |
| 你想點一份宫保鸡丁 | "给我來份宫保鸡丁" | **POST** - "做"件事,創建數據 |
| 你想换一道菜 | "把宫保鸡丁改成糖醋裡脊" | **PUT** - 替换數據 |
| 你想改口味 | "宫保鸡丁不要放花生" | **PATCH** - 部分修改 |
| 你不想要了 | "算了,那道菜不要了" | **DELETE** - 删除數據 |

<HttpMethodsDemo />

::: warning 關于幂等性
**幂等性**:多次執行結果是否相同?

- **幂等的操作**(GET/PUT/DELETE):點 10 次和點 1 次,結果一样
- **不幂等的操作**(POST):點 10 次,可能創建 10 个订單

**解决方案**:POST 操作用唯一 ID 校验,避免重複處理。
:::

### 3.2 HTTP 方法速查表

| 方法 | 用途 | 幂等性 | 安全性 | 典型場景 |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | 獲取资源 | 是 | 是 | 查询列表、查看詳情 |
| **POST** | 創建资源 | 否 | 否 | 新增用户、提交订單 |
| **PUT** | 全量更新 | 是 | 否 | 替换整个用户资料 |
| **PATCH** | 部分更新 | 否 | 否 | 只修改昵称 |
| **DELETE** | 删除资源 | 是 | 否 | 删除用户、取消订單 |

---

## 4. HTTP 狀態碼的資訊含義

服務器回複時,會先返回一个狀態碼,告诉你請求是否成功。

### 4.1 狀態碼分類

<StatusCodeCategories />

### 4.2 常见狀態碼詳解

| 狀態碼 | 含義 | 典型場景 | 客户端處理 |
| :--- | :--- | :--- | :--- |
| **200 OK** | 成功 | 請求正常處理 | 展示數據 |
| **201 Created** | 創建成功 | POST 請求成功創建资源 | 跳轉到新资源 |
| **400 Bad Request** | 請求格式錯误 | 參數缺失或格式不對 | 檢查參數 |
| **401 Unauthorized** | 未認證 | 没有提供有效的 API Key | 引導用户登錄 |
| **403 Forbidden** | 无權限 | API Key 没有访問該资源的權限 | 提示權限不足 |
| **404 Not Found** | 不存在 | 請求的地址或资源不存在 | 檢查 URL |
| **429 Too Many Requests** | 請求過多 | 超過了速率限制 | 稍後重試 |
| **500 Internal Server Error** | 服務器錯误 | 服務端出了問题 | 提示用户稍後重試 |

👇 **動手試試看**:點擊下方按钮,了解常见狀態碼的含義:

<StatusCodeDemo />

---

## 5與HTTP vs SDK：自己跑腿與讓管家代辦的途徑比較

### 5.1 兩種調用方式對比

| | 🏃 **HTTP API** | 🤵 **SDK** |
| :--- | :--- | :--- |
| **比喻** | 自己跑腿 | 管家代辦 |
| **優點** | ✓ 所有語言都能用<br>✓ 完全控制請求细節<br>✓ 无需额外依賴 | ✓ 代碼简洁易讀<br>✓ 自動處理鑑權<br>✓ 內置錯误重試 |
| **缺點** | ✗ 需要處理所有细節<br>✗ 代碼冗長易出錯 | ✗ 需要安装依賴<br>✗ 可能有版本問题 |
| **代碼示例** | `requests.post(url, json=..., headers={...})` | `client.chat.completions.create(...)` |

### 5.2 選择的方法

| 場景 | 推荐方式 | 原因 |
| :--- | :--- | :--- |
| **快速開發** | SDK | 自動處理鑑權、錯误、重試 |
| **學習原理** | HTTP | 理解底層機制 |
| **不支持的語言** | HTTP | 任何語言都能用 |
| **需要定制** | HTTP | 灵活控制每个细節 |

::: tip 💡 建议
**能用 SDK 就用 SDK**,把麻烦事留给庫,把時間留给自己。
:::

---

## 6. 阅讀 API 文檔的方法

API 文檔就像說明書和菜單的結合體。你不需要從頭讀到尾,只需要學會"查字典"。

### 6.1 文檔阅讀清單

打開任何一个 API 文檔(比如 OpenAI 或 DeepSeek),你只需要找這几样東西:

<ApiDocumentDemo />

| 项目 | 說明 | 示例 |
| :--- | :--- | :--- |
| **Base URL** | API 的根地址 | `https://api.deepseek.com` |
| **Authentication** | 如何證明身份 | `Authorization: Bearer sk-xxx` |
| **Endpoints** | 具體的接口列表 | `/v1/chat/completions` |
| **Parameters** | 必填/可選參數 | `model`(必填)、`temperature`(可選) |
| **Response** | 返回數據結構 | `{"choices": [...]}` |

### 6.2 阅讀文檔的步骤

1. **找到 Base URL** - 這是所有請求的前缀
2. **看懂認證方式** - API Key 放在 Header 還是 Query?
3. **找到需要的 Endpoint** - 你要調用的具體接口
4. **查看請求參數** - 哪些必填?哪些可選?
5. **理解返回格式** - 數據是如何組织的?

---

## 7. 動手练習:模擬 API 調用

光說不练假把式。這裡有个模擬 API,你可以隨便填參數、隨便改地址,看看會發生什么。

<ApiPlayground />

試着触發以下場景:
- ✅ **成功請求**:填入正确的 Endpoint 和 API Key
- ❌ **401 錯误**:不填 API Key,看看服務器怎么拒绝你
- ❌ **404 錯误**:填一个不存在的地址

---

## 8. 小結

::: info 核心要點
1. **API 就是傳声筒**,帮你把话傳给另一段代碼或遠程服務器
2. **你早就用過 API 了**,從 `len()` 到 `open()` 都是 API
3. **Web API 是超能力**,讓你調用千裡之外的超级電脑
4. **SDK 是好管家**,能用 SDK 就別自己跑腿
5. **看文檔找三样**:地址、鑑權、參數
:::

在 AI 編程的時代,你只需要記住這几个核心概念。剩下的细節,IDE 和 AI 助手會帮你處理。

---

## 名词速查表

| 名词 | 全称 | 解釋 |
| :--- | :--- | :--- |
| **API** | Application Programming Interface | 應用程序編程接口,定義了軟件之間如何交互 |
| **Web API** | - | 基于 HTTP 協议的 API,用于網絡通信 |
| **Endpoint** | - | 端點,API 的具體地址 |
| **HTTP** | HyperText Transfer Protocol | Web API 使用的通信協议 |
| **GET** | - | 獲取资源的方法 |
| **POST** | - | 提交數據的方法 |
| **SDK** | Software Development Kit | 軟件開發工具包,封装了底層 API 調用 |
| **URL** | Uniform Resource Locator | API 的網絡地址 |
| **JSON** | JavaScript Object Notation | 常用的數據格式 |
| **Authentication** | - | 验證身份的過程 |
| **Status Code** | - | HTTP 響應中的狀態碼 |
| **Request** | - | 請求 |
| **Response** | - | 響應 |
| **Header** | - | HTTP 頭,包含元信息 |
| **Payload** | - | 請求或響應的實际數據 |
| **Rate Limit** | - | 速率限制 |
| **Idempotent** | - | 幂等,多次執行結果相同 |
| **REST** | Representational State Transfer | 一種 API 架構風格 |
| **RPC** | Remote Procedure Call | 遠程過程調用 |
| **GraphQL** | - | 一種查询語言 API |
| **gRPC** | - | Google 開發的高性能 RPC 框架 |

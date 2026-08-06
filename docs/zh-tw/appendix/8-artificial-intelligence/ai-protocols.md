# AI Agent 協定原理：MCP 與 A2A

::: tip 核心問題
**AI Agent 如何與外部世界「對話」？** 就像網際網路需要 HTTP 協定，AI Agent 也需要標準化的通訊協定。本章介紹兩個最主流的 Agent 協定：MCP 和 A2A，它們分別解決了 AI 與工具、Agent 與 Agent 之間的通訊問題。
:::

---

## 0. 協定 概述

在電腦領域，**協定（Protocol）** 是一套標準化的規則和約定，讓不同的系統、程式能夠相互「理解」和「通訊」。

### 0.1 需要協定的動機

想像一個情境：你給朋友寄快遞，需要填寫地址。如果每個人寫的地址格式都不一樣，快遞員就沒法投遞。協定就是規定了「地址怎麼寫」的標準——省、市、區、街道、門牌號，按這個格式寫，誰都能看懂。

電腦也是一樣。兩個程式要通訊，必須約定好：
- 資料格式是什麼？（JSON？二進位？）
- 怎麼建立連線？（握手流程）
- 出錯了怎麼辦？（錯誤處理）

### 0.2 電腦中常見的協定

| 協定 | 作用 | 你每天都在用 |
|------|------|-------------|
| **HTTP** | 網頁傳輸協定 | 瀏覽器開啟網頁 |
| **HTTPS** | 加密的 HTTP | 網路銀行、支付頁面 |
| **TCP/IP** | 網際網路基礎協定 | 所有網路通訊 |
| **DNS** | 域名解析協定 | 把 `google.com` 變成 IP 位址 |
| **SMTP** | 郵件傳送協定 | 傳送郵件 |
| **WebSocket** | 雙向即時通訊 | 聊天軟體、線上遊戲 |
| **SSH** | 安全遠端登入 | 連線伺服器 |
| **FTP** | 檔案傳輸協定 | 上傳/下載檔案 |

這些協定構成了網際網路的基石。沒有它們，你無法瀏覽網頁、傳送郵件、觀看影片。

### 0.3 協定的價值

協定的核心價值是**標準化**和**互通性**：

- **標準化**：大家都按同一套規則辦事，減少溝通成本
- **互通性**：不同廠商、不同技術堆疊的系統可以無縫對接

比如 HTTP 協定，讓 Chrome 瀏覽器可以存取 Nginx 伺服器，讓 Python 爬蟲可以擷取 Java 網站的資料。不需要 Chrome 和 Nginx 互相「認識」，只要都遵守 HTTP 協定就行。

### 0.4 AI Agent 也需要協定

AI Agent 要真正「幹活」，需要：
- 呼叫外部工具（查天氣、發郵件、操作資料庫）
- 與其他 Agent 協作（分工合作完成複雜任務）

這就需要標準化的協定來規定「AI 怎麼呼叫工具」、「Agent 之間怎麼對話」。這就是 **MCP** 和 **A2A** 的由來。

---

## 1. Agent 協定的層次

在深入瞭解具體協定之前，讓我們先看看 Agent 生態中的通訊層次：

| 層級 | 協定 | 解決的問題 | 類比 |
|------|------|-----------|------|
| **1** | Function Call | AI 如何呼叫本地函式 | 大腦發出指令 |
| **2** | **MCP** | AI 如何連線外部工具和資料來源 | USB-C 介面 |
| **3** | **A2A** | Agent 之間如何協作通訊 | 企業微信 |

::: tip 逐行解讀這張表
**第1層（Function Call）**：這是大型語言模型最基礎的能力——透過輸出結構化資料（JSON）來觸發函式執行。它是「協定」的基礎，但本身更像是一種能力而非標準協定。

**第2層（MCP）**：Model Context Protocol，由 Anthropic 於 2024 年 11 月發布。它標準化了 AI 與外部工具、資料來源的連線方式，就像 USB-C 統一了各種裝置的充電介面。

**第3層（A2A）**：Agent-to-Agent Protocol，由 Google 於 2025 年 4 月發布。它讓不同的 Agent 能夠相互發現、通訊和協作，就像企業微信讓同事之間可以發任務、聊天。
:::

本章重點介紹第 2、3 層的兩個正式協定：MCP 和 A2A。

---

## 2. MCP (Model Context Protocol)

### 2.1 協定基本資訊

| 項目 | 內容 |
|------|------|
| **全稱** | Model Context Protocol |
| **發起方** | Anthropic |
| **發布時間** | 2024 年 11 月 25 日 |
| **官方文件** | [modelcontextprotocol.io](https://modelcontextprotocol.io) |
| **開源協定** | MIT License |
| **GitHub** | [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol) |

::: tip 為什麼叫「Context Protocol」？
**Context（上下文）** 是大型語言模型理解任務的關鍵。MCP 的核心思想是：**讓 AI 能夠動態取得所需的上下文資訊**，而不是把所有資訊都塞進 Prompt。

比如，AI 需要讀取一個檔案時，不需要你把檔案內容複製貼上給它，而是透過 MCP 直接存取檔案系統。
:::

### 2.2 發布的背景

2024 年，隨著 Claude 3.5 Sonnet 的發布，Anthropic 發現一個問題：**每個工具都要單獨整合**。

想像一下：
- 你想讓 AI 讀取 GitHub 儲存庫 → 要寫 GitHub 整合程式碼
- 你想讓 AI 查詢資料庫 → 要寫資料庫整合程式碼
- 你想讓 AI 操作檔案系統 → 要寫檔案系統整合程式碼

每個整合都要重複寫類似的程式碼：認證、錯誤處理、資料轉換……

Anthropic 在官方部落格中寫道：
> "We're introducing the Model Context Protocol (MCP), an open protocol that standardizes how applications provide context to LLMs."

**核心目標**：讓工具開發者寫一次程式碼，所有支援 MCP 的 AI 應用都能使用。

### 2.3 MCP概述

<McpVisualDemo />

**三大核心能力**：

| 能力 | 英文 | 作用 | 範例 |
|------|------|------|------|
| **工具** | Tools | AI 可以呼叫的功能 | 查詢天氣、傳送郵件 |
| **資源** | Resources | AI 可以讀取的資料 | 檔案內容、資料庫記錄 |
| **提示** | Prompts | 預定義的提示範本 | 程式碼審查範本、寫作範本 |

### 2.4 MCP 的內部實作

<McpDetailedDemo />

### 2.5 類比理解：USB-C 介面

MCP 就像 **USB-C 介面**：

- **以前**：每個裝置都有自己的充電口（圓口、扁口、磁吸……）
- **現在**：USB-C 統一了所有裝置的充電和資料傳輸
- **MCP**：統一了 AI 與所有工具的連線方式

工具開發者只需要實作一次 MCP Server，所有支援 MCP 的 AI 應用（Claude、Cursor、Windsurf 等）都能直接使用。

### 2.6 MCP 的典型應用情境

| 情境 | 說明 | 範例 |
|------|------|------|
| **本地檔案操作** | 讓 AI 讀取/修改本地檔案 | 讀取程式碼庫、分析日誌檔案 |
| **資料庫查詢** | 讓 AI 直接查詢資料庫 | SQL 查詢、資料分析 |
| **API 呼叫** | 讓 AI 呼叫第三方服務 | GitHub API、Slack、郵件 |
| **開發工具整合** | 讓 AI 使用開發工具 | Git 操作、終端機指令 |

**實際案例**：
- **Cursor/Windsurf**：透過 MCP 連線檔案系統、Git、終端機
- **Claude Desktop**：透過 MCP 連線筆記軟體、郵件客戶端
- **自動化腳本**：讓 AI 執行自動化任務（備份、部署、資料同步）

---

## 3. A2A (Agent-to-Agent Protocol)

### 3.1 協定基本資訊

| 項目 | 內容 |
|------|------|
| **全稱** | Agent-to-Agent Protocol |
| **發起方** | Google |
| **發布時間** | 2025 年 4 月 9 日 |
| **官方文件** | [google.github.io/A2A](https://google.github.io/A2A) |
| **開源協定** | Apache 2.0 |
| **GitHub** | [github.com/google/A2A](https://github.com/google/A2A) |

::: tip 為什麼是 Google 發起？
Google 在 Cloud Next 2025 大會上發布 A2A，與其企業級 AI 戰略密切相關。

Google 認為：未來的企業 AI 不是單個超級 Agent，而是**多個專業 Agent 協作**——有的負責資料分析，有的負責程式碼生成，有的負責文件處理。

這些 Agent 需要一種標準化的方式相互通訊，A2A 應運而生。
:::

### 3.2 發布的背景

MCP 解決了「AI 如何連線工具」的問題，但還有一個問題：**多個 Agent 如何協作？**

想像一個情境：
- Agent A 是「需求分析專家」
- Agent B 是「程式碼生成專家」
- Agent C 是「測試專家」

使用者說：「幫我開發一個登入功能」

Agent A 分析需求後，需要把任務分配給 Agent B；Agent B 寫完程式碼後，需要讓 Agent C 測試。它們之間如何通訊？

Google 在官方部落格中寫道：
> "A2A is an open protocol that enables AI agents to communicate with each other, facilitating collaboration across different frameworks and vendors."

**核心目標**：讓不同廠商、不同框架開發的 Agent 能夠無縫協作。

### 3.3 A2A概述

<A2AVisualDemo />

**三大核心概念**：

| 概念 | 英文 | 作用 | 類比 |
|------|------|------|------|
| **Agent Card** | Agent 名片 | 描述 Agent 的能力 | 員工工牌 |
| **Task** | 任務 | 要執行的工作單元 | 工單 |
| **Message** | 訊息 | Agent 之間的通訊內容 | 聊天記錄 |

### 3.4 A2A 的內部實作

<A2ADetailedDemo />

### 3.5 類比理解：企業微信

A2A 就像 **企業微信**：

- **Agent Card**：每個人的名片，顯示姓名、部門、職責
- **發任務**：@某人，分配一個任務
- **聊天溝通**：任務執行過程中可以隨時溝通
- **任務追蹤**：能看到任務的進度和狀態

不同的 Agent 就像不同的同事，A2A 讓它們能夠協作完成複雜專案。

### 3.6 A2A 的典型應用情境

| 情境 | 說明 | 範例 |
|------|------|------|
| **軟體開發** | 多 Agent 協作完成開發任務 | 需求分析→程式碼→測試→部署 |
| **企業工作流程** | 不同部門 Agent 協作處理業務 | HR Agent + 財務 Agent + 法務 Agent |
| **智慧客服** | 多個專業 Agent 分工處理 | 接待→解答→轉接→記錄 |
| **資料分析** | 多個 Agent 協作分析資料 | 收集→清洗→分析→視覺化→報告 |

**實際案例**：
- **Google Agent Space**：企業內部多個 Agent 協作處理文件、郵件、日程
- **軟體開發團隊**：需求 Agent → 程式碼 Agent → 測試 Agent → 部署 Agent
- **智慧客服系統**：接待 Agent → 專業解答 Agent → 人工轉接 Agent

---

## 4. MCP vs A2A：對比與關係

### 4.1 核心差異

| 維度 | MCP | A2A |
|------|-----|-----|
| **發起方** | Anthropic (2024.11) | Google (2025.04) |
| **定位** | AI 與工具的連線 | Agent 與 Agent 的協作 |
| **通訊範圍** | Client-Server | Peer-to-Peer |
| **資料格式** | JSON-RPC 2.0 | HTTP + JSON |
| **類比** | USB-C 介面 | 企業微信 |

### 4.2 兩者的關係

MCP 和 A2A **不是競爭關係，而是互補關係**：

<ProtocolComparisonDemo />

### 4.3 選擇的方法

| 情境 | 選擇 |
|------|------|
| 讓 AI 呼叫本地函式或工具 | Function Call |
| 使用第三方工具（資料庫、API、檔案系統） | MCP |
| 建構多 Agent 協作系統 | A2A |
| 同時需要工具整合和多 Agent 協作 | MCP + A2A |

---

## 5. 協定的未來趨勢

### 5.1 生態發展

**MCP 生態**（截至 2025 年初）：
- 官方提供的 Server：檔案系統、SQLite、Git、PostgreSQL 等
- 社群貢獻的 Server：Slack、Notion、Figma、Stripe 等
- 支援 MCP 的應用：Claude Desktop、Cursor、Windsurf、Zed 等

**A2A 生態**（剛發布）：
- Google 自家的 Agent 產品率先支援
- 開源社群正在開發各種語言的 SDK
- 企業級應用正在探索中

### 5.2 標準化程序

目前 Agent 協定還處於「戰國時代」：
- MCP 和 A2A 是最主流的兩個
- 還有其他新興協定如 ANP、AGP 等
- 未來可能會融合或統一

類比網際網路的發展：
- 早期：各種區域網路協定並存
- 後來：TCP/IP 成為標準
- 現在：Agent 協定可能也會走向統一

---

## 6. 小結

::: tip 核心要點
| 協定 | 一句話理解 | 發布時間 | 發起方 | 適用情境 |
|------|-----------|---------|--------|---------|
| **MCP** | AI 連線工具的「USB-C」 | 2024.11 | Anthropic | 工具整合、資料來源連線 |
| **A2A** | Agent 協作的「企業微信」 | 2025.04 | Google | 多 Agent 協作、任務委託 |

**關鍵洞察**：
1. MCP 解決「AI 如何取得外部能力」的問題
2. A2A 解決「多個 AI 如何協作」的問題
3. 兩者互補，未來可能會融合使用
4. 選擇協定要根據具體情境，沒有銀彈
:::

---

## 參考資料

1. **MCP 官方文件**: [modelcontextprotocol.io](https://modelcontextprotocol.io)
2. **MCP GitHub**: [github.com/modelcontextprotocol](https://github.com/modelcontextprotocol)
3. **Anthropic 發布部落格**: "Introducing the Model Context Protocol" (2024-11-25)
4. **A2A 官方文件**: [google.github.io/A2A](https://google.github.io/A2A)
5. **A2A GitHub**: [github.com/google/A2A](https://github.com/google/A2A)
6. **Google Cloud Blog**: "Announcing the Agent-to-Agent Protocol" (2025-04-09)
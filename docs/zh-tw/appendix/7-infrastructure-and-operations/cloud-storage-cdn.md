# 物件儲存與 CDN 原理
> 💡 **學習指南**：本文會帶你走完一條完整的鏈路——從檔案上傳到使用者下載。你會看到物件儲存如何像「智慧倉庫」一樣管理海量檔案，CDN 如何像「快遞據點」一樣把內容送到使用者家門口，以及這中間有哪些「坑」等著你跳進去。建議先了解基礎的 HTTP 請求和 DNS 解析原理。

在開始之前，建議你先補幾塊「基礎磚」：

- **HTTP 請求流程**：可以先閱讀 [瀏覽器輸入 URL 後發生了什麼](./web-basics/url-to-browser.md) 了解完整的請求鏈路。
- **DNS 解析原理**：如果你對網域名稱解析還不太熟悉，可以先看 [DNS 查詢流程](./deployment/dns-flow.md) 的圖解部分。

---

## 0. 引言：檔案上傳下載這麼「慢」的動機

想像一下這個場景：你在一個圖片社群上傳了一張 10MB 的高清照片，結果等了半分鐘才傳完；而你的朋友在北京，點擊下載卻只要 2 秒。為什麼同一張檔案，上傳和下載的體驗天差地別？

或者再想想：你的電商網站雙十一舉辦活動，商品詳情頁突然湧入百萬流量，伺服器直接「躺平」。是頻寬不夠？還是架構設計有問題？

這些問題的答案，都藏在**物件儲存**和 **CDN** 這對「黃金搭檔」裡。

---

## 1. 物件儲存：你的「智慧雲端倉庫」

### 1.1 什麼是概述物件儲存

傳統檔案系統就像你家衣櫃：衣服按「上衣/褲子/裙子」分層放，你要找一件襯衫，得先打開衣櫃→上衣區→襯衫格。這種「層級巢狀」的模式，在檔案數量爆炸時會變得極其笨重。

物件儲存則像現代倉儲物流：每個包裹都有一個唯一的「快遞單號」（物件鍵），你只需報單號，倉庫機器人就能從海量包裹中精準取出。

<ObjectStorageDemo />

**核心區別一覽**：

| 維度         | 傳統檔案系統           | 物件儲存                |
| :----------- | :--------------------- | :---------------------- |
| **組織方式** | 層級目錄樹             | 扁平鍵值對              |
| **存取協定** | POSIX（本地檔案操作）  | HTTP/REST API           |
| **擴充性**   | 單機容量有限           | 近乎無限水平擴充        |
| **中繼資料** | 基礎屬性（大小、時間） | 豐富的自訂中繼資料      |
| **典型場景** | 本地辦公文件           | 圖片/影片/備份/靜態資源 |

### 1.2 物件儲存的核心概念

#### 儲存貯體（Bucket）：你的「倉庫分區」

儲存貯體是物件儲存的頂級容器，相當於一個獨立的命名空間。所有物件都必須存放在某個儲存貯體中。

**命名規則**（以阿里雲 OSS 為例）：

- 全域唯一：在整個雲端廠商的所有使用者中不能重複
- 只能包含小寫字母、數字和短橫線
- 必須以小寫字母或數字開頭和結尾
- 長度在 3-63 個字元之間

**實戰踩坑**：曾經有個團隊按業務線建立了幾十個儲存貯體，結果月底帳單出來傻眼了——每個儲存貯體都有最低儲存費用和請求費用。建議：按「環境+用途」組合規劃儲存貯體，比如 `prod-static-assets`、`dev-backup-archive`。

#### 物件（Object）：你的「資料包裹」

物件是儲存的基本單元，由三部分組成：

1. **鍵（Key）**：物件的唯一識別碼，相當於「快遞單號」
   - 範例：`images/avatar/2024/user123.jpg`
   - 雖然看起來像路徑，但本質只是字串

2. **資料（Data）**：物件的內容本身
   - 可以是任意二進位資料
   - 大小限制取決於雲端廠商（通常單個物件 5TB 以內）

3. **中繼資料（Metadata）**：描述物件的附加資訊
   - 系統中繼資料：Content-Type、ETag、Last-Modified 等
   - 自訂中繼資料：如 `x-oss-meta-owner`、`x-oss-meta-project`

#### 存取控制：誰能動我的「倉庫」？

物件儲存提供多層權限控制：

| 層級         | 控制方式                  | 典型場景                        |
| :----------- | :------------------------ | :------------------------------ |
| **儲存貯體層級**   | Bucket Policy（資源政策） | 禁止所有外網存取、只允許特定 IP |
| **物件層級** | ACL（存取控制清單）       | 公開圖片、私有文件              |
| **暫時授權** | STS（安全權杖服務）       | 前端直傳、行動端上傳            |

**安全紅線**：永遠不要把 AccessKey ID 和 AccessKey Secret 寫在前端程式碼裡！正確做法是：前端向你的後端申請暫時 STS 憑證，後端驗證身分後回傳帶過期時間的暫時憑證。

---

## 2. CDN：你的「全球快遞網路」

### 2.1 需要 CDN的動機

想像你開了一家網路商店，伺服器放在深圳。現在有個使用者在台北存取你的圖片：

- **沒有 CDN**：請求從台北→新竹→台中→高雄→屏東→深圳，跨越 2000 多公里，來回就是 4000 多公里。光網路傳輸就要幾十毫秒，遇到網路壅塞更慘。

- **有了 CDN**：請求從台北直接到台北的 CDN 節點（可能就在台北中華電信機房），距離從 2000 公里變成 20 公里，延遲從 50ms 變成 5ms。

這就是 CDN 的核心價值：**讓內容離使用者更近**。

<CdnAccelerationDemo />

### 2.2 CDN 的核心架構

#### 邊緣節點：離使用者最近的「快遞站」

邊緣節點是 CDN 網路中最接近使用者的層級，通常部署在：

- 電信業者機房（中華電信/遠傳/台灣大哥大）
- 大城市網際網路交換中心
- 重要交通樞紐

**中國主要 CDN 節點分佈**：

- 一線城市：北京、上海、廣州、深圳
- 二線城市：杭州、南京、成都、武漢、西安
- 海外：香港、新加坡、東京、矽谷、法蘭克福

<EdgeNodeDistributionDemo />

#### 來源站：內容的「總倉庫」

來源站是 CDN 回源獲取內容的地方，可以是：

- 物件儲存（OSS/COS/S3）
- 自建伺服器（ECS/物理機）
- 負載平衡器（SLB/CLB）

**關鍵設定**：

- **回源 HOST**：CDN 節點存取來源站時使用的網域名稱/IP
- **回源協定**：HTTP 還是 HTTPS
- **回源埠**：80、443 還是自訂埠

#### 中間層節點：「區域分撥中心」

在邊緣節點和來源站之間，CDN 通常還有一層或多層中間節點：

- **匯聚節點**：聚合多個邊緣節點的回源請求，減少來源站壓力
- **區域中心**：負責一個大區的內容分發和排程

這種分層架構的好處：

1. **降低來源站壓力**：1000 個邊緣節點的請求，可能只需要向來源站發起 10 次
2. **提高命中率**：熱門內容在中間層就被攔截，不需要回源
3. **故障隔離**：某條鏈路出問題，可以自動切換到其他路徑

### 2.3 CDN 加速的完整流程

讓我們追蹤一次真實的使用者請求：

<CachePolicyDemo />

**Step 1：DNS 解析**（智慧排程）

```
使用者輸入：cdn.example.com/image.jpg
↓
DNS 伺服器回傳：台北中華電信 CDN 節點 IP（1.2.3.4）
```

這裡的關鍵是**智慧 DNS**：根據使用者的電信業者、地理位置、節點負載，回傳最優的 CDN 節點 IP。

**Step 2：邊緣節點查詢**（快取命中？）

```
請求到達台北中華電信 CDN 節點（1.2.3.4）
↓
節點檢查本地快取：
├─ 命中？直接回傳內容 ✓
└─ 未命中？繼續下一步
```

**Step 3：回源獲取**（層層向上）

```
邊緣節點未命中
↓
向父節點（如：台灣區域中心）請求
├─ 父節點命中？回傳內容
└─ 父節點未命中？繼續向上
    ↓
    向來源站請求
    ↓
    來源站回傳內容
```

**Step 4：快取並回傳**（下次更快）

```
內容沿鏈路回傳
↓
每層節點都快取一份
↓
最終到達使用者
```

這樣，下次有使用者請求同一個檔案時，就能直接從邊緣節點回傳，實現「秒開」。

---

## 3. 從上傳到存取：完整鏈路解析

### 3.1 檔案上傳的三種方式

<UploadProcessDemo />

#### 方式一：用戶端 → 伺服器端 → 物件儲存（傳統模式）

```
瀏覽器 → 你的後端伺服器 → 物件儲存
```

**流程**：

1. 使用者選擇檔案，點擊上傳
2. 檔案先上傳到你的後端伺服器
3. 後端接收完整檔案後，再轉上傳到物件儲存
4. 回傳上傳結果給使用者

**優點**：

- 實作簡單，前後端都好控制
- 可以在後端做檔案校驗、格式轉換
- 敏感操作可以記錄日誌、做權限校驗

**缺點**：

- **頻寬雙吃**：使用者上傳佔用一次頻寬，伺服器轉傳又佔用一次
- **伺服器壓力大**：大檔案會佔用大量記憶體和 CPU
- **上傳慢**：相當於多了一道中轉，使用者感知到的上傳時間更長

**適用場景**：小檔案（<10MB）、需要後端處理（如圖片壓縮、加浮水印）、內部管理系統。

#### 方式二：用戶端直傳物件儲存（現代推薦）

```
瀏覽器 ──────→ 物件儲存
        ↑
        後端只簽發暫時憑證
```

**流程**：

1. 使用者選擇檔案，前端先向後端申請「上傳憑證」
2. 後端驗證使用者身分，向物件儲存服務申請**暫時 STS 憑證**（帶過期時間）
3. 後端把暫時憑證回傳給前端
4. 前端拿著憑證，**直接上傳檔案到物件儲存**
5. 物件儲存回傳上傳結果，前端通知後端「上傳完成」

**優點**：

- **上傳快**：少了中轉環節，使用者感知速度最快
- **伺服器壓力小**：只處理憑證簽發，不處理檔案串流
- **頻寬省**：只走一次上傳流量
- **安全性高**：暫時憑證有過期時間，洩露也危害有限

**缺點**：

- 實作稍複雜，需要理解 STS、簽章機制
- 前端需要處理分片上傳、斷點續傳等邏輯
- 跨域（CORS）需要設定

**適用場景**：大檔案上傳、使用者生成內容（UGC）、需要高並行上傳的業務。

#### 方式三：分片上傳 + 斷點續傳（大檔案必備）

```
10GB 影片檔案
↓
切分成 1000 個 10MB 的分片
↓
並行上傳（同時傳 5 個分片）
↓
斷網了！已傳 600 個
↓
恢復網路，從第 601 個繼續傳
↓
所有分片傳完，發起「合併」請求
```

**為什麼需要分片？**

| 場景         | 不分片                  | 分片                 |
| :----------- | :---------------------- | :------------------- |
| **網路波動** | 傳了 99% 斷網，全部重傳 | 只重傳失敗的分片     |
| **上傳速度** | 單執行緒，速度慢        | 多執行緒並行，速度快 |
| **記憶體佔用** | 需要快取整個檔案      | 只需快取目前分片     |
| **進度顯示** | 只有 0% 和 100%         | 精確到每個分片的進度 |

**主流雲端廠商的分片規格**：

| 廠商           | 分片大小限制 | 最大分片數 | 最小分片大小 |
| :------------- | :----------- | :--------- | :----------- |
| **阿里雲 OSS** | 100MB        | 10000      | 100KB        |
| **騰訊雲 COS** | 5GB          | 10000      | 1MB          |
| **AWS S3**     | 5GB          | 10000      | 5MB（推薦）  |
| **七牛雲**     | 100MB        | 10000      | 4MB          |

### 3.2 CDN 回源策略詳解

<CachePolicyDemo />

#### 什麼是「回源」？

CDN 邊緣節點快取了來源站的內容，但當：

- 使用者請求的內容**第一次被存取**
- 快取的內容**已過期（TTL 到期）**
- 快取被**手動清除/預熱**

CDN 節點就需要向**來源站**請求最新內容，這個過程就叫「回源」。

#### 回源的三種模式

| 模式                  | 原理                     | 適用場景                  | 優缺點                   |
| :-------------------- | :----------------------- | :------------------------ | :----------------------- |
| **直接回源**          | CDN 節點 → 來源站        | 來源站有公網 IP，且流量不大 | 簡單直接，但來源站壓力大 |
| **中間源回源**        | CDN 節點 → 中間層 → 來源站 | 大型網站，多層快取架構    | 分擔來源站壓力，架構複雜 |
| **OSS/COS 作為來源站** | CDN 節點 → 物件儲存      | 靜態資源、圖片、影片      | 最佳實踐，成本低、效能好 |

#### 回源設定實戰

**場景 1：物件儲存作為來源站（推薦）**

```
使用者存取：cdn.example.com/images/photo.jpg
                    ↓
            CDN 邊緣節點（台北）
                    ↓
            未命中，回源到來源站
                    ↓
            來源站：bucket-name.oss-cn-beijing.aliyuncs.com
                    ↓
            回傳圖片，CDN 快取並回應使用者
```

關鍵設定項：

- **來源站類型**：OSS/COS 網域名稱 或 自訂來源站
- **回源協定**：HTTP 還是 HTTPS（建議 HTTPS）
- **回源 HOST**：存取來源站時使用的 Host 標頭
- **回源 SNI**：HTTPS 回源時的伺服器名稱指示

**場景 2：多來源站負載平衡**

當單個來源站扛不住回源壓力時，可以設定多個來源站：

```
CDN 邊緣節點
    ├─ 來源站 A (權重 50%)
    ├─ 來源站 B (權重 30%)
    └─ 來源站 C (權重 20%)
```

主備模式：

```
CDN 邊緣節點
    ├─ 主來源站 A (健康時全部流量)
    └─ 備來源站 B (主來源故障時切換)
```

#### 回源頻寬 vs CDN 頻寬

這裡有個容易混淆的概念：

| 指標             | 定義                    | 計費關係                     |
| :--------------- | :---------------------- | :--------------------------- |
| **CDN 下行頻寬** | 從 CDN 節點到使用者的流量 | 通常按流量計費的 CDN 費用    |
| **回源頻寬**     | 從來源站到 CDN 節點的流量 | 通常物件儲存或來源站出流量費用 |

**省錢技巧**：

- 提高 CDN 命中率（讓更多請求命中快取，減少回源）
- 設定合理的快取時間（TTL）
- 使用預熱功能，在使用者存取前就快取熱點內容
- 開啟「跟隨 301/302」，避免不必要的回源跳轉

### 3.3 快取策略設定

<CachePolicyDemo />

#### 快取鍵（Cache Key）：決定什麼算「同一個檔案」

CDN 如何判斷兩次請求是否應該回傳同一個快取副本？靠的就是**快取鍵**。

**預設快取鍵通常包括**：

- URL 路徑（不含查詢參數）
- 例如：`/images/photo.jpg`

**問題場景**：

```
使用者 A 請求：/images/photo.jpg?w=100&h=100  (100x100 縮圖)
使用者 B 請求：/images/photo.jpg?w=800&h=600  (800x600 大圖)
```

如果快取鍵只包含路徑，兩張不同尺寸的圖片會被認為是同一個檔案，導致混亂。

**解決方案：自訂快取鍵規則**

| 規則                 | 範例                      | 效果                      |
| :------------------- | :------------------------ | :------------------------ |
| **保留指定查詢參數** | 保留 `w`、`h`             | 不同尺寸分別快取          |
| **保留所有查詢參數** | 保留全部                  | 完全精確匹配              |
| **忽略特定查詢參數** | 忽略 `token`、`timestamp` | 帶時間戳的 URL 能命中快取 |
| **包含請求標頭**     | 包含 `Accept-Language`    | 不同語言回傳不同內容      |

**實戰設定範例**（阿里雲 CDN）：

```
快取鍵規則：
- URL 路徑：/images/*
- 保留查詢參數：w, h, format
- 忽略查詢參數：token, timestamp, utm_source
```

#### 快取時間（TTL）：內容「新鮮度」的平衡

TTL（Time To Live）決定了內容在 CDN 節點上快取多久。設定太短，回源多、成本高；設定太長，內容更新後使用者看到舊內容。

**按檔案類型設定 TTL 的建議**：

| 檔案類型    | 建議 TTL                | 原因                           |
| :---------- | :---------------------- | :----------------------------- |
| HTML 頁面   | 0-5 分鐘                | 內容頻繁更新，需要即時         |
| JS/CSS 檔案 | 1 年（搭配檔名 hash）   | 內容不變，檔名變化即快取失效   |
| 圖片/影片   | 7-30 天                 | 更新頻率低，可長期快取         |
| 字型檔案    | 1 年                    | 幾乎不變                       |
| API 回應    | 0-5 分鐘（視業務）      | 資料即時性要求高               |

**前端工程化搭配 CDN 的最佳實踐**：

```javascript
// webpack/vite 設定
output: {
  filename: 'js/[name]-[contenthash:8].js',
  chunkFilename: 'js/[name]-[contenthash:8].chunk.js',
}
```

產生的檔名：`app-a3f2b1c9.js`

- 檔案內容變化 → hash 變化 → 新 URL → 自然快取失效
- 檔案內容不變 → hash 不變 → URL 不變 → 長期快取命中

#### 快取清除與預熱

**手動清除（應急場景）**：

當你更新了來源站內容，但 CDN 快取還沒過期，使用者看到的還是舊內容：

| 清除類型     | 效果                   | 耗時        | 適用場景     |
| :----------- | :--------------------- | :---------- | :----------- |
| **URL 清除** | 指定 URL 的快取失效    | 5-10 分鐘   | 單個檔案更新 |
| **目錄清除** | 指定目錄下所有內容失效 | 10-30 分鐘  | 批量更新     |
| **全站清除** | 整個網域的快取全部失效 | 30 分鐘以上 | 緊急復原     |

**重要提醒**：清除只是讓快取失效，下次請求會回源拉取新內容。不要在高峰期大批量清除，否則可能導致來源站被打爆。

**預熱（ proactive 最佳化）**：

清除是被動的（內容已更新），預熱是主動的（提前快取）。

```
場景：明天上午 10 點要發一篇爆款文章

今晚就提交預熱請求：
- URL: https://cdn.example.com/articles/爆款文章.html
- 預熱範圍：全國所有邊緣節點

效果：
明天 10 點使用者存取時，內容已經在邊緣節點等著了
→ 零回源延遲，秒開體驗
```

---

## 4. 流量排程：讓使用者存取「最近」的節點

<TrafficSchedulingDemo />

### 4.1 智慧 DNS 排程

傳統 DNS 解析：

```
使用者問：cdn.example.com 的 IP 是什麼？
DNS 答：1.2.3.4（固定的）
```

智慧 DNS 解析：

```
使用者（台北中華電信）問：cdn.example.com 的 IP 是什麼？
智慧 DNS：讓我查查... 台北中華電信的 CDN 節點是 1.2.3.4

使用者（高雄遠傳）問：cdn.example.com 的 IP 是什麼？
智慧 DNS：高雄遠傳的 CDN 節點是 5.6.7.8
```

**排程維度**：
| 維度 | 說明 | 效果 |
| :--- | :--- | :--- |
| **地理位置** | 按省/市/國家分配 | 就近存取，降低延遲 |
| **電信業者** | 中華電信/遠傳/台灣大哥大/BGP | 同業者傳輸，避免跨網 |
| **節點負載** | 即時 CPU/頻寬/QPS | 避開過載節點 |
| **節點健康** | 探查可用性 | 自動移除故障節點 |
| **成本因素** | 頻寬單價差異 | 平衡效能與成本 |

### 4.2 HTTP DNS 與 IP 直連

傳統 DNS 有個問題：**DNS 劫持和解析延遲**。

**HTTP DNS 方案**：

```
用戶端 → 繞過系統 DNS → 直接問 HTTP DNS 服務（如 223.5.5.5:80）
         ↓
    回傳最優 IP 清單（帶權重）
         ↓
    用戶端根據網路品質探查，選擇最優 IP
```

優勢：

- 防劫持：不走電信業者 DNS
- 更精準：可以按用戶端網路品質選擇 IP
- 即時性：故障切換更快

**實戰建議**：

- 行動端 APP 強烈建議接入 HTTP DNS
- Web 端可以使用 CDN 提供的 CNAME 排程
- 關鍵業務可以做多 IP 容災（一個網域名稱回傳多個 IP）

---

## 5. HTTPS 最佳化：安全與效能的平衡

<HttpsOptimizationDemo />

### 5.1 CDN 上 HTTPS 很重要的動機

**場景對比**：

```
無 HTTPS：
使用者存取 http://cdn.example.com/image.jpg
↓
瀏覽器網址列顯示「不安全」
↓
某些瀏覽器/APP 直接攔截存取
↓
SEO 排名降低
```

```
有 HTTPS：
使用者存取 https://cdn.example.com/image.jpg
↓
瀏覽器顯示綠色鎖頭標誌
↓
HTTP/2 多工生效
↓
效能 + 安全雙提升
```

### 5.2 CDN HTTPS 設定要點

#### 憑證管理

| 方案                   | 說明                  | 成本           | 適用場景         |
| :--------------------- | :-------------------- | :------------- | :--------------- |
| **雲端廠商免費憑證**   | 阿里雲/騰訊雲等提供   | 免費           | 單網域，快速上手 |
| **Let's Encrypt**      | 社群免費憑證          | 免費           | 自動化部署       |
| **商業 DV/OV/EV 憑證** | Symantec、GeoTrust 等 | ￥幾百-幾萬/年 | 企業級、需要綠條 |
| **泛網域憑證**         | \*.example.com        | ￥幾千/年      | 多子網域         |

**實戰建議**：

- 測試環境：Let's Encrypt 或雲端廠商免費憑證
- 正式環境：泛網域憑證（省事）或單網域 OV 憑證（省錢）
- 注意憑證過期時間，設定自動續期提醒

#### HTTPS 最佳化設定

**TLS 版本選擇**：

```
推薦設定：僅 TLS 1.2 和 TLS 1.3
相容設定：TLS 1.1 + TLS 1.2 + TLS 1.3（相容老舊瀏覽器）
```

**密碼套件**：

```
推薦：ECDHE 金鑰交換 + AES-GCM 加密
停用：DES、RC4、MD5、SHA1
```

**OCSP Stapling**：

```
功能：CDN 節點預先獲取憑證撤銷狀態
效果：減少用戶端驗證時間 200-500ms
建議：務必開啟
```

**TLS 工作階段重用**：

```
Session ID 重用：用戶端帶著上次 Session ID，伺服器端恢復工作階段
Session Ticket 重用：伺服器端把工作階段狀態加密發給用戶端，下次帶來
效果：避免完整 TLS 交握，減少 1-RTT
```

### 5.3 HTTP/2 與 HTTP/3 在 CDN 上的應用

**HTTP/2 多工**：

```
HTTP/1.1：
請求 1 (index.html) ────────────────→
回應 1 ←──────────────────────────────
請求 2 (style.css) ─────────────────→
回應 2 ←──────────────────────────────
請求 3 (script.js) ─────────────────→
回應 3 ←──────────────────────────────
（序列，一個完了下一個）

HTTP/2：
請求 1 ──→
請求 2 ──→   合併在一個 TCP 連線上，幀交錯傳輸
請求 3 ──→
回應 1 ←──   按優先級串流式回傳
回應 2 ←──
回應 3 ←──
（並行，一個連線多工）
```

**HTTP/2 伺服器端推送**：

```
場景：使用者請求 index.html，裡面引用了 style.css 和 script.js

傳統方式：
1. 使用者下載 index.html
2. 解析發現需要 style.css 和 script.js
3. 再發兩個請求獲取

HTTP/2 推送：
1. 使用者請求 index.html
2. CDN 節點回傳 index.html 的同時，主動推送 style.css 和 script.js
3. 使用者解析 html 時，資源已經在快取裡了

注意：推送要謹慎，推多了浪費頻寬，推少了沒效果
```

**HTTP/3 (QUIC)**：

```
HTTP/2 的問題：基於 TCP，隊頭阻塞
→ 一個 TCP 封包丟失，整個連線等待重傳

HTTP/3 的解決：基於 QUIC（UDP 之上實現可靠傳輸）
→ 每個串流獨立，一個串流阻塞不影響其他串流
→ 連線遷移：WiFi 切 4G，連線不中斷
→ 0-RTT 交握：第一次存取也能快速建立連線

現狀：2024 年主流 CDN 已支援 HTTP/3，建議開啟
```

---

## 6. 存取分析：看懂你的 CDN 報表

<AccessAnalyticsDemo />

### 6.1 核心指標解讀

#### 頻寬（Bandwidth）

```
定義：單位時間內傳輸的資料量
單位：bps（位元每秒）、Mbps、Gbps

CDN 頻寬 = 所有邊緣節點的出流量總和

注意區分：
- 計費頻寬：通常按 95 峰值或日峰值計費
- 實際頻寬：即時傳輸速率
```

**頻寬與流量的關係**：

```
1 Mbps 頻寬持續跑 1 小時 = 450 MB 流量
（計算：1,000,000 bps × 3600s ÷ 8 ÷ 1024 ÷ 1024 ≈ 429 MB）
```

#### QPS（Queries Per Second）

```
定義：每秒查詢/請求數

CDN QPS = 所有邊緣節點每秒處理的 HTTP 請求總數

注意：QPS 高不代表頻寬高
- 小檔案場景：QPS 很高，頻寬不高
- 大檔案場景：QPS 不高，頻寬很高
```

#### 命中率（Hit Ratio）

```
定義：在 CDN 邊緣節點命中的請求佔總請求的比例

計算公式：
命中率 = (命中數 / 總請求數) × 100%
或
命中率 = (1 - 回源流量 / 總出流量) × 100%

行業標準：
- 圖片/影片/JS/CSS：> 95%
- HTML 頁面：50-80%（視更新頻率）
- API 介面：通常不快取或極低
```

**命中率低的常見原因**：

| 原因           | 現象               | 解決方案                 |
| :------------- | :----------------- | :----------------------- |
| 快取時間太短   | TTL 只有幾分鐘     | 根據檔案類型調整 TTL     |
| 查詢參數變化   | URL 帶隨機數       | 設定忽略特定參數         |
| 快取鍵設定不當 | 不該區分的被區分了 | 最佳化快取鍵規則         |
| 內容更新頻繁   | 檔案經常被覆蓋     | 使用版本號或 hash 檔名   |
| 首次存取多     | 新內容或新節點     | 提前預熱                 |

### 6.2 日誌分析與問題排查

#### CDN 日誌欄位解析

典型 CDN 存取日誌包含以下欄位：

```
時間 | 用戶端 IP | 請求方法 | URL | HTTP 狀態碼 | 回應大小 | 快取狀態 | 回應時間 | Referer | User-Agent

範例：
2024-01-15 14:32:01 | 114.114.114.114 | GET | https://cdn.example.com/images/photo.jpg | 200 | 153600 | HIT | 23 | https://example.com/ | Mozilla/5.0...
```

關鍵欄位解釋：

| 欄位            | 說明           | 分析價值                                     |
| :-------------- | :------------- | :------------------------------------------- |
| `cache_status`  | 快取狀態       | HIT（命中）、MISS（未命中）、EXPIRED（過期） |
| `response_time` | 回應時間（ms） | 判斷使用者體驗，>500ms 需最佳化              |
| `http_status`   | HTTP 狀態碼    | 404/500 錯誤排查                             |
| `bytes_sent`    | 傳送位元組數   | 頻寬統計                                     |

#### 常見問題排查

**問題 1：使用者反映存取慢**

排查步驟：

```
1. 看日誌 response_time
   - 如果很大（>500ms）：檢查是快取 MISS 還是來源站慢

2. 檢查 cache_status
   - HIT：快取命中，慢可能是檔案太大或節點問題
   - MISS：未命中，需最佳化快取策略或命中率

3. 檢查用戶端 IP 分佈
   - 某些地區慢：可能是該節點負載高或覆蓋不足
```

**問題 2：快取不生效，每次都回源**

排查清單：

```
□ 來源站回應標頭是否有 Cache-Control: no-cache / private？
□ URL 是否帶隨機參數（如 ?_=123456）？
□ 快取鍵設定是否正確？
□ TTL 設定是否過短？
□ 是否命中瀏覽器本地快取而非 CDN？
```

**問題 3：費用暴漲**

排查方向：

```
1. 看帳單明細
   - CDN 流量費高：檢查是否有大檔案被頻繁存取，或被盜鏈
   - 回源流量費高：檢查命中率是否驟降
   - 請求數費用高：檢查是否有 CC 攻擊或爬蟲

2. 看存取日誌
   - 是否有大量 404 請求（可能是掃描或設定錯誤）
   - Referer 是否異常（判斷是否被盜鏈）

3. 安全設定
   - 開啟防盜鏈（Referer 白名單）
   - 開啟 IP 黑名單/白名單
   - 設定 CC 防護
```

---

## 7. 實戰案例：從 0 搭建圖片加速方案

### 7.1 業務場景

假設你是一個圖片社群的技術負責人，面臨以下挑戰：

- **使用者上傳**：使用者每天上傳 100 萬張圖片（平均 2MB/張）
- **使用者存取**：每天 5000 萬次圖片檢視請求
- **存取分佈**：使用者遍佈全國，海外也有少量存取
- **效能要求**：圖片載入時間 < 500ms
- **成本預算**：盡量控制在每月 5 萬以內

### 7.2 架構設計

```
                         ┌──────────────────────────────────────┐
                         │           使用者上傳流程                │
                         └──────────────────────────────────────┘

   使用者瀏覽器                                  後端服務                      物件儲存
       │                                            │                            │
       │  1. 申請上傳憑證                            │                            │
       │───────────────────────────────────────────>│                            │
       │                                            │                            │
       │                                            │  2. 申請 STS 暫時憑證      │
       │                                            │───────────────────────────>│
       │                                            │                            │
       │                                            │  3. 回傳 STS 憑證         │
       │                                            │<───────────────────────────│
       │                                            │                            │
       │  4. 回傳上傳憑證（含 STS）                  │
       │<───────────────────────────────────────────│                            │
       │                                            │                            │
       │  5. 直接上傳檔案（使用 STS 簽章）          │
       │──────────────────────────────────────────────────────────────────────>│
       │                                            │                            │
       │  6. 回傳上傳結果（URL、ETag 等）           │
       │<──────────────────────────────────────────────────────────────────────│
       │                                            │                            │
       │  7. 通知後端上傳完成（儲存到資料庫）        │
       │───────────────────────────────────────────>│                            │


                         ┌──────────────────────────────────────┐
                         │           使用者存取流程                │
                         └──────────────────────────────────────┘

   使用者瀏覽器            DNS 解析              CDN 節點              物件儲存（來源站）
       │                     │                     │                     │
       │  1. 請求圖片 URL    │                     │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  2. DNS 查詢        │                     │
       │                     │────────────────────>│                     │
       │                     │                     │                     │
       │                     │  3. 回傳最優節點 IP │                     │
       │                     │<────────────────────│                     │
       │                     │                     │                     │
       │  4. 連線 CDN 節點   │                     │                     │
       │────────────────────────────────────────>│                     │
       │                     │                     │                     │
       │                     │  5. 檢查快取        │                     │
       │                     │                     ├─ 命中？直接回傳     │
       │                     │                     └─ 未命中？繼續       │
       │                     │                     │                     │
       │                     │                     │  6. 回源獲取       │
       │                     │                     │──────────────────>│
       │                     │                     │                     │
       │                     │                     │  7. 回傳檔案       │
       │                     │                     │<──────────────────│
       │                     │                     │                     │
       │                     │  8. 快取並回應      │                     │
       │<────────────────────────────────────────│                     │
```

### 7.3 關鍵設定詳解

#### 物件儲存設定

**儲存貯體規劃**：

```
 Bucket: myapp-images-prod
 ├─ 目錄結構：
 │   ├─ uploads/           # 使用者上傳的原圖
 │   │   ├─ 2024/01/15/user123-abc.jpg
 │   │   └─ 2024/01/15/user456-def.png
 │   ├─ thumbnails/        # 縮圖
 │   │   ├─ small/         # 100x100
 │   │   ├─ medium/        # 400x300
 │   │   └─ large/         # 800x600
 │   └─ processed/         # 處理後的圖片（加浮水印等）
 │
 ├─ 存取權限：
 │   ├─ 原圖目錄：私有（需簽章存取）
 │   ├─ 縮圖目錄：公共讀
 │   └─ 跨域 CORS：允許 *.myapp.com 存取
 │
 └─ 生命週期政策：
     ├─ 上傳 7 天後：低頻儲存（省 40% 費用）
     ├─ 上傳 90 天後：歸檔儲存（省 70% 費用）
     └─ 上傳 3 年後：自動刪除（或轉存到更便宜的冷儲存）
```

**CORS 跨域設定**：

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://myapp.com</AllowedOrigin>
    <AllowedOrigin>https://www.myapp.com</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>ETag</ExposeHeader>
    <ExposeHeader>x-oss-request-id</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

#### CDN 加速設定

**快取策略設定**：

```
全域預設規則：
├─ 快取鍵：URL 路徑 + 保留 w、h、format 查詢參數
├─ 預設 TTL：7 天
└─ 回源 HOST：自動跟隨

按檔案類型細分：
├─ *.html：
│   ├─ TTL：5 分鐘
│   └─ 優先從記憶體快取讀取
│
├─ *.js, *.css：
│   ├─ TTL：1 年
│   └─ 忽略查詢參數（因為檔名有 hash）
│
├─ *.jpg, *.png, *.gif, *.webp：
│   ├─ TTL：30 天
│   ├─ 保留查詢參數（w、h、format 用於動態裁剪）
│   └─ 啟用圖片自動壓縮最佳化
│
└─ /api/*：
    ├─ TTL：0（不快取）
    └─ 直接回源
```

**HTTPS 最佳化設定**：

```
憑證設定：
├─ 憑證類型：泛網域憑證 *.myapp.com
├─ 部署方式：CDN 主控台上傳，自動續期
└─ 備用憑證：EV 憑證用於主網域（顯示綠色網址列）

TLS 設定：
├─ 最低 TLS 版本：1.2（相容性與安全平衡）
├─ 最高 TLS 版本：1.3
├─ 密碼套件：僅啟用強加密套件
├─ OCSP Stapling：開啟
├─ TLS 工作階段重用：開啟 Session Ticket
└─ HSTS：開啟（max-age=31536000）

HTTP/2 與 HTTP/3：
├─ HTTP/2：開啟（多工、標頭壓縮）
├─ HTTP/2 Server Push：按需開啟（推薦用 Preload 替代）
└─ HTTP/3 (QUIC)：開啟（實驗性功能，逐步放量）
```

### 7.4 成本控制策略

#### 費用構成分析

```
月度 CDN + 物件儲存費用構成：

CDN 部分：
├─ 下行流量費（大頭，約 60%）
│   ├─ 中國大陸：0.15-0.30 元/GB
│   ├─ 亞太地區：0.40-0.80 元/GB
│   └─ 歐美：0.30-0.60 元/GB
│
├─ 請求數費用（小頭，約 5%）
│   ├─ HTTP：0.01-0.05 元/萬次
│   └─ HTTPS：0.05-0.15 元/萬次（因為 TLS 交握消耗資源）
│
├─ 頻寬峰值費用（可選計費方式）
│   └─ 95 峰值計費：適合流量波動大的場景
│
└─ 加值功能費（約 5%）
    ├─ HTTPS 憑證管理
    ├─ WAF 防護
    ├─ 即時日誌推送
    └─ 邊緣指令碼/函式

物件儲存部分：
├─ 儲存容量費（約 15%）
│   ├─ 標準儲存：0.12-0.15 元/GB/月
│   ├─ 低頻儲存：0.08-0.10 元/GB/月
│   └─ 歸檔儲存：0.03-0.05 元/GB/月
│
├─ 請求費用（約 5%）
│   ├─ PUT：0.01-0.05 元/萬次
│   └─ GET：0.005-0.01 元/萬次
│
├─ 資料取回費用（低頻/歸檔）
│   └─ 提前刪除或取回收取額外費用
│
└─ 回源出流量費（約 10%）
    └─ CDN 回源到物件儲存的流量費
```

#### 省錢技巧實戰

**技巧 1：儲存分級，自動生命週期管理**

```yaml
# 生命週期規則範例
rules:
  - id: image-lifecycle
    prefix: uploads/
    transitions:
      # 7 天後轉低頻儲存，省 30% 費用
      - days: 7
        storageClass: IA
      # 90 天後轉歸檔儲存，省 70% 費用
      - days: 90
        storageClass: Archive
    # 3 年後自動刪除
    expiration:
      days: 1095
```

**技巧 2：提高 CDN 命中率，減少回源**

```
命中率從 90% 提升到 95% 意味著什麼？

假設：
- 日流量：10 TB
- 命中率 90%：回源 1 TB
- 命中率 95%：回源 0.5 TB

節省回源流量：0.5 TB/天 × 0.15 元/GB × 30 天 = 2250 元/月
```

**技巧 3：壓縮與格式最佳化**

```
圖片最佳化方案：
├─ 原圖儲存在物件儲存（不對外直接開放）
├─ CDN 開啟圖片處理功能：
│   ├─ 格式自動轉換：JPEG → WebP/AVIF（省 30-50%）
│   ├─ 品質自動壓縮：視覺無損壓縮（省 20-40%）
│   ├─ 尺寸自適應：根據裝置回傳合適尺寸
│   └─ 漸進式載入：先模糊後清晰
└─ 效果：頻寬成本降低 50-70%
```

**技巧 4：頻寬峰值上限與警報**

```yaml
# 頻寬上限設定
bandwidth_cap:
  daily_limit: 500 # Mbps，日峰值超過則自動停用 CDN
  monthly_limit: 10000 # GB，月流量超過則停用

  # 警報閾值
  alerts:
    - threshold: 70% # 達到 70% 發警報
      channels: [sms, email]
    - threshold: 90% # 達到 90% 打電話
      channels: [phone]
```

---

## 8. 總結：物件儲存 + CDN 的黃金法則

### 8.1 架構設計原則

**原則 1：動靜分離**

```
動態內容（API、HTML）→ 走來源站或邊緣函式
靜態內容（圖片、JS、CSS、影片）→ 走 CDN + 物件儲存
```

**原則 2：就近服務**

```
使用者在哪裡，內容就快取到哪裡
→ 選擇覆蓋廣的 CDN 服務商
→ 啟用智慧 DNS 排程
→ 重要內容提前預熱
```

**原則 3：分層快取**

```
瀏覽器本地快取（最強）
    ↓
CDN 邊緣節點快取（次強）
    ↓
CDN 中間層/區域節點（兜底）
    ↓
物件儲存/來源站（最後防線）
```

**原則 4：成本與體驗的平衡**

```
儲存分級：熱資料標準儲存，冷資料歸檔儲存
快取策略：高頻內容長 TTL，低頻內容短 TTL
壓縮最佳化：WebP/AVIF 格式，智慧品質壓縮
監控警報：設定頻寬上限，防止異常流量
```

### 8.2 避坑清單

**儲存貯體命名與權限**

- [ ] 貯體名稱全域唯一，避免被佔用
- [ ] 私有檔案不要設定為公共讀
- [ ] AccessKey 不要寫在前端程式碼裡，用 STS 暫時憑證
- [ ] 啟用伺服器端加密（SSE）保護敏感資料

**CDN 快取設定**

- [ ] HTML 檔案 TTL 不要太長（建議 < 5 分鐘）
- [ ] JS/CSS 建議用帶 hash 的檔名，TTL 設為 1 年
- [ ] 快取鍵要合理，不要把使用者資訊等變數放進去
- [ ] 重要更新後記得清除快取或預熱

**HTTPS 安全**

- [ ] 憑證不要過期，設定自動續期
- [ ] 最低 TLS 版本建議 1.2
- [ ] 開啟 HSTS 防止降級攻擊
- [ ] 敏感 Cookie 設定 Secure 和 HttpOnly

**成本控制**

- [ ] 開啟頻寬上限警報，防止異常流量
- [ ] 低頻/歸檔儲存有最小儲存時間和提前刪除費，注意規則
- [ ] 回源流量費也很貴，努力提高 CDN 命中率
- [ ] 定期分析存取日誌，清理殭屍資源

---

## 9. 實戰程式碼範本

### 9.1 前端直傳物件儲存（JavaScript）

```javascript
/**
 * 物件儲存直傳工具類別
 * 支援：阿里雲 OSS、騰訊雲 COS、AWS S3
 */
class DirectUploader {
  constructor(config) {
    this.provider = config.provider // 'oss' | 'cos' | 's3'
    this.region = config.region
    this.bucket = config.bucket
    this.getCredentials = config.getCredentials // 獲取暫時憑證的函式
  }

  /**
   * 獲取 STS 暫時憑證
   */
  async fetchCredentials() {
    // 向後端申請暫時憑證
    const credentials = await this.getCredentials()
    return {
      accessKeyId: credentials.accessKeyId,
      accessKeySecret: credentials.accessKeySecret,
      sessionToken: credentials.securityToken || credentials.sessionToken,
      expiration: credentials.expiration
    }
  }

  /**
   * 產生上傳簽章（適用於前端計算簽章）
   */
  generateSignature(credentials, fileKey, fileType, options = {}) {
    const timestamp = new Date().toISOString()
    const date = timestamp.slice(0, 10).replace(/-/g, '')

    // 不同廠商的簽章演算法略有差異
    switch (this.provider) {
      case 'oss':
        return this._ossSignature(credentials, fileKey, date, options)
      case 'cos':
        return this._cosSignature(credentials, fileKey, date, options)
      case 's3':
        return this._s3Signature(credentials, fileKey, date, options)
      default:
        throw new Error('Unknown provider')
    }
  }

  /**
   * 單檔案上傳（小檔案 < 100MB）
   */
  async upload(file, options = {}) {
    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    const formData = new FormData()

    // 構建表單欄位（不同廠商欄位名不同）
    const formFields = this._buildFormFields(
      credentials,
      fileKey,
      file.type,
      options
    )
    Object.entries(formFields).forEach(([key, value]) => {
      formData.append(key, value)
    })

    formData.append('file', file)

    // 傳送上傳請求
    const uploadUrl = this._getUploadUrl()
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      // 如果上傳大檔案，可能需要設定更長的逾時
      signal: options.signal // 支援 AbortController 取消上傳
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Upload failed: ${response.status} ${errorText}`)
    }

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      etag: response.headers.get('ETag'),
      size: file.size
    }
  }

  /**
   * 分片上傳（大檔案 > 100MB）
   */
  async multipartUpload(file, options = {}) {
    const partSize = options.partSize || 10 * 1024 * 1024 // 預設 10MB/片
    const parallel = options.parallel || 3 // 預設 3 個並行

    const credentials = await this.fetchCredentials()
    const fileKey = this._generateFileKey(file, options.directory)

    // 1. 初始化分片上傳
    const uploadId = await this._initMultipartUpload(
      credentials,
      fileKey,
      file.type
    )

    // 2. 計算分片
    const parts = []
    const totalParts = Math.ceil(file.size / partSize)
    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize
      const end = Math.min(start + partSize, file.size)
      parts.push({
        number: i + 1,
        start,
        end,
        blob: file.slice(start, end)
      })
    }

    // 3. 上傳分片（帶並行控制和斷點續傳）
    const uploadedParts = []
    const failedParts = []

    // 支援斷點續傳：檢查哪些分片已上傳
    if (options.resume) {
      const existingParts = await this._listParts(
        credentials,
        fileKey,
        uploadId
      )
      for (const part of existingParts) {
        uploadedParts.push(part)
      }
    }

    // 過濾出未上傳的分片
    const pendingParts = parts.filter(
      (p) => !uploadedParts.some((up) => up.partNumber === p.number)
    )

    // 並行上傳
    const uploadPart = async (part) => {
      try {
        const etag = await this._uploadPart(
          credentials,
          fileKey,
          uploadId,
          part
        )
        return { partNumber: part.number, etag }
      } catch (error) {
        failedParts.push({ part, error })
        throw error
      }
    }

    // 使用 Promise.all 控制並行
    const chunks = []
    for (let i = 0; i < pendingParts.length; i += parallel) {
      chunks.push(pendingParts.slice(i, i + parallel))
    }

    for (const chunk of chunks) {
      const results = await Promise.allSettled(chunk.map(uploadPart))
      for (const result of results) {
        if (result.status === 'fulfilled') {
          uploadedParts.push(result.value)
        }
      }
    }

    // 檢查是否所有分片都上傳成功
    if (uploadedParts.length !== totalParts) {
      throw new Error(
        `Upload incomplete: ${uploadedParts.length}/${totalParts} parts uploaded`
      )
    }

    // 4. 完成分片上傳（合併分片）
    await this._completeMultipartUpload(
      credentials,
      fileKey,
      uploadId,
      uploadedParts
    )

    return {
      url: this._getFileUrl(fileKey),
      key: fileKey,
      size: file.size,
      parts: totalParts
    }
  }

  /**
   * 產生檔案儲存路徑
   */
  _generateFileKey(file, directory = '') {
    const date = new Date()
    const datePath = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
    const random = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop() || 'bin'
    const key = directory
      ? `${directory}/${datePath}/${random}.${ext}`
      : `${datePath}/${random}.${ext}`
    return key
  }

  // ============ 各廠商特定方法 ============

  _getUploadUrl() {
    switch (this.provider) {
      case 'oss':
        return `https://${this.bucket}.oss-${this.region}.aliyuncs.com`
      case 'cos':
        return `https://${this.bucket}.cos.${this.region}.myqcloud.com`
      case 's3':
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com`
      default:
        throw new Error('Unknown provider')
    }
  }

  _getFileUrl(key) {
    return `https://${this.bucket}.${this.provider === 'oss' ? 'oss' : 'cos'}-${this.region}.${
      this.provider === 'oss'
        ? 'aliyuncs.com'
        : this.provider === 'cos'
          ? 'myqcloud.com'
          : 'amazonaws.com'
    }/${key}`
  }

  // 各廠商的簽章、分片上傳等方法...（根據實際需求實作）
  _buildFormFields(credentials, fileKey, fileType, options) {
    // 各廠商表單欄位構建邏輯
    // 這裡需要根據具體廠商的文件實作
    return {}
  }

  async _initMultipartUpload(credentials, fileKey, fileType) {
    // 各廠商初始化分片上傳邏輯
    return 'upload-id'
  }

  async _uploadPart(credentials, fileKey, uploadId, part) {
    // 各廠商分片上傳邏輯
    return 'etag'
  }

  async _completeMultipartUpload(credentials, fileKey, uploadId, parts) {
    // 各廠商完成分片上傳邏輯
  }

  async _listParts(credentials, fileKey, uploadId) {
    // 各廠商列出已上傳分片邏輯
    return []
  }
}

// 使用範例
const uploader = new DirectUploader({
  provider: 'oss',
  region: 'cn-beijing',
  bucket: 'myapp-images-prod',
  getCredentials: async () => {
    // 向後端申請暫時憑證
    const res = await fetch('/api/upload/credentials')
    return res.json()
  }
})

// 小檔案上傳
async function uploadAvatar(file) {
  try {
    const result = await uploader.upload(file, {
      directory: 'avatars',
      onProgress: (progress) => {
        console.log(`上傳進度: ${progress.percent}%`)
      }
    })
    console.log('上傳成功:', result.url)
    return result
  } catch (error) {
    console.error('上傳失敗:', error)
    throw error
  }
}

// 大檔案分片上傳
async function uploadVideo(file) {
  try {
    const result = await uploader.multipartUpload(file, {
      directory: 'videos',
      partSize: 10 * 1024 * 1024, // 10MB 每片
      parallel: 3, // 3 個並行
      resume: true, // 支援斷點續傳
      onProgress: (progress) => {
        console.log(
          `上傳進度: ${progress.percent}%, 已傳 ${progress.loaded}/${progress.total}`
        )
      },
      onPartComplete: (part) => {
        console.log(`分片 ${part.number} 上傳完成`)
      }
    })
    console.log('上傳成功:', result.url)
    return result
  } catch (error) {
    console.error('上傳失敗:', error)
    // 可以在這裡實作重試邏輯或儲存斷點資訊
    throw error
  }
}
```

### 9.2 後端暫時憑證服務（Node.js/Express）

```javascript
/**
 * 物件儲存 STS 暫時憑證服務
 * 支援：阿里雲 OSS、騰訊雲 COS、AWS S3
 */
const express = require('express')
const STS = require('ali-oss').STS // 阿里雲
// const COS = require('cos-nodejs-sdk-v5') // 騰訊雲
const router = express.Router()

// 設定
const config = {
  // 阿里雲 OSS 設定
  oss: {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    region: 'oss-cn-beijing',
    bucket: 'myapp-images-prod',
    // STS 角色 ARN（需要在 RAM 主控台建立）
    roleArn: process.env.OSS_STS_ROLE_ARN
  }
}

/**
 * 獲取 STS 暫時憑證（阿里雲 OSS）
 * POST /api/upload/credentials
 */
router.post('/credentials', async (req, res) => {
  try {
    // 1. 驗證使用者身分（根據實際情況實作）
    const userId = req.user?.id
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // 2. 產生唯一的檔案路徑前綴（用於權限隔離）
    const date = new Date()
    const prefix = `uploads/${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${userId}/`

    // 3. 建立 STS 用戶端
    const sts = new STS({
      accessKeyId: config.oss.accessKeyId,
      accessKeySecret: config.oss.accessKeySecret
    })

    // 4. 申請暫時憑證
    const result = await sts.assumeRole(
      config.oss.roleArn,
      {
        // Policy 限制權限範圍（最小權限原則）
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'oss:PutObject',
              'oss:InitiateMultipartUpload',
              'oss:UploadPart',
              'oss:CompleteMultipartUpload',
              'oss:AbortMultipartUpload',
              'oss:ListParts'
            ],
            Resource: [`acs:oss:*:*:${config.oss.bucket}/${prefix}*`]
          }
        ],
        Version: '1'
      },
      3600, // 憑證有效期 1 小時
      'web-upload-session-' + Date.now()
    )

    // 5. 回傳憑證和設定
    res.json({
      success: true,
      data: {
        // STS 暫時憑證
        credentials: {
          accessKeyId: result.credentials.AccessKeyId,
          accessKeySecret: result.credentials.AccessKeySecret,
          sessionToken: result.credentials.SecurityToken,
          expiration: result.credentials.Expiration
        },
        // 上傳設定
        config: {
          provider: 'oss',
          region: config.oss.region,
          bucket: config.oss.bucket,
          endpoint: `https://${config.oss.bucket}.${config.oss.region}.aliyuncs.com`,
          prefix: prefix, // 檔案路徑前綴
          // 安全限制
          maxSize: 100 * 1024 * 1024, // 最大 100MB
          allowedTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4'
          ]
        }
      }
    })
  } catch (error) {
    console.error('Get credentials failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get upload credentials',
      message: error.message
    })
  }
})

/**
 * 回呼通知：前端上傳完成後通知後端
 * POST /api/upload/callback
 */
router.post('/callback', async (req, res) => {
  try {
    const { key, etag, size, mimeType, originalName } = req.body
    const userId = req.user?.id

    // 1. 驗證檔案是否存在
    // 2. 儲存檔案資訊到資料庫
    const fileRecord = await db.files.create({
      userId,
      key,
      etag,
      size,
      mimeType,
      originalName,
      url: `https://cdn.example.com/${key}`,
      createdAt: new Date()
    })

    // 3. 非同步處理：產生縮圖、擷取中繼資料、內容審核等
    await processFileAsync(fileRecord)

    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        url: fileRecord.url,
        size: fileRecord.size
      }
    })
  } catch (error) {
    console.error('Upload callback failed:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process uploaded file'
    })
  }
})

module.exports = router
```

### 9.3 防盜鏈與安全設定

```javascript
/**
 * CDN 防盜鏈與安全設定範例
 */

// 1. Referer 防盜鏈（防止其他網站直接引用你的資源）
const refererConfig = {
  // 白名單模式：只允許以下 Referer 存取
  allowList: [
    '*.myapp.com', // 主站
    '*.myapp.cn', // 國內站
    'localhost:*', // 本地開發
    '127.0.0.1:*'
  ],

  // 黑名單模式（可選）：禁止以下 Referer
  blockList: [
    '*.competitor.com', // 競爭對手
    'spam-site.com'
  ],

  // 空 Referer 處理：是否允許直接存取（瀏覽器網址列輸入 URL）
  allowEmptyReferer: false // 正式環境建議 false，測試環境可 true
}

// 2. URL 鑑權（更安全的防盜鏈，帶時間戳和簽章）
class URLAuth {
  constructor(config) {
    this.key = config.key // 鑑權金鑰，只在伺服器端儲存
    this.expireTime = config.expireTime || 3600 // 預設 1 小時有效期
  }

  /**
   * 產生帶鑑權的 URL
   * @param {string} url - 原始 URL，如 https://cdn.example.com/images/photo.jpg
   * @param {number} expireIn - 有效期（秒）
   * @returns {string} 帶鑑權參數的 URL
   */
  sign(url, expireIn = this.expireTime) {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const timestamp = Math.floor(Date.now() / 1000) + expireIn

    // 構造簽章字串（不同廠商格式不同，這裡是通用範例）
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const signature = this._md5(signStr)

    // 添加鑑權參數
    urlObj.searchParams.set('sign', signature)
    urlObj.searchParams.set('t', timestamp.toString())

    return urlObj.toString()
  }

  /**
   * 驗證 URL 簽章（在 CDN 邊緣或來源站使用）
   */
  verify(url) {
    const urlObj = new URL(url)
    const signature = urlObj.searchParams.get('sign')
    const timestamp = parseInt(urlObj.searchParams.get('t'))
    const pathname = urlObj.pathname

    // 檢查是否過期
    if (timestamp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'URL expired' }
    }

    // 驗證簽章
    const signStr = `${pathname}-${timestamp}-${this.key}`
    const expectedSign = this._md5(signStr)

    if (signature !== expectedSign) {
      return { valid: false, error: 'Invalid signature' }
    }

    return { valid: true }
  }

  _md5(str) {
    // 實際專案中使用 crypto-js 或其他 MD5 函式庫
    // 這裡僅作範例
    return require('crypto').createHash('md5').update(str).digest('hex')
  }
}

// 使用範例
const auth = new URLAuth({
  key: 'your-secret-key-only-known-by-server',
  expireTime: 3600 // 1 小時有效期
})

// 伺服器端產生帶簽章的 URL
const signedUrl = auth.sign(
  'https://cdn.example.com/private/document.pdf',
  7200
)
// 結果：https://cdn.example.com/private/document.pdf?sign=xxxxx&t=1699123456

// CDN 邊緣或來源站驗證
const result = auth.verify(signedUrl)
if (!result.valid) {
  // 回傳 403 Forbidden
}

// 3. IP 黑白名單
const ipConfig = {
  // 只允許特定 IP 存取（適合內部系統）
  whiteList: [
    '192.168.1.0/24', // 內網網段
    '10.0.0.0/8'
  ],

  // 禁止特定 IP 存取（封鎖攻擊者）
  blackList: ['1.2.3.4', '5.6.7.8']
}

// 4. UA（User-Agent）黑白名單
const uaConfig = {
  // 禁止爬蟲/下載工具
  blackList: [
    'Wget',
    'curl',
    'python-requests',
    'Scrapy',
    'AhrefsBot',
    'SemrushBot'
  ],

  // 只允許瀏覽器存取（嚴格模式）
  whiteList: [
    'Mozilla/*', // 現代瀏覽器
    'AppleWebKit/*'
  ]
}
```

---

## 10. 名詞對照表

| 英文術語                   | 中文對照          | 解釋                                                                                                 |
| :------------------------- | :---------------- | :--------------------------------------------------------------------------------------------------- |
| **Object Storage**         | 物件儲存          | 一種資料儲存架構，將資料作為物件管理，而非檔案系統層級結構。適合儲存圖片、影片、備份等非結構化資料。 |
| **Bucket**                 | 儲存貯體          | 物件儲存中的頂級容器，用於組織和隔離資料。每個貯體有獨立的權限控制和設定。                           |
| **Object**                 | 物件/檔案物件     | 物件儲存的基本單元，包含資料本身、中繼資料（Metadata）和全域唯一鍵（Key）。                          |
| **CDN**                    | 內容傳遞網路      | Content Delivery Network，透過在全球部署邊緣節點，將網站內容快取到離使用者最近的位置，加速存取速度。 |
| **Edge Node**              | 邊緣節點          | CDN 網路中部署在各地的快取伺服器，直接為使用者提供內容存取服務。                                     |
| **Origin**                 | 來源站            | CDN 回源獲取內容的伺服器，可以是物件儲存、ECS 或自建伺服器。                                         |
| **Cache Hit**              | 快取命中          | 使用者請求的內容在 CDN 邊緣節點已存在，直接回傳，無需回源。                                          |
| **Cache Miss**             | 快取未命中        | 邊緣節點沒有請求的內容，需要回源獲取。                                                               |
| **Hit Ratio**              | 命中率            | 快取命中次數佔總請求次數的比例。命中率越高，回源越少，成本越低。                                     |
| **TTL**                    | 存活時間/快取時間 | Time To Live，內容在 CDN 節點上快取的有效期。過期後需要重新回源。                                    |
| **Back to Source**         | 回源              | CDN 邊緣節點向來源站請求內容的過程。                                                                 |
| **Purge/Refresh**          | 清除快取          | 強制使 CDN 快取失效，下次請求回源獲取最新內容。                                                      |
| **Preheat**                | 預熱              | 在正式發布前，主動將內容推送到 CDN 節點，讓使用者第一次存取就能命中快取。                            |
| **CORS**                   | 跨來源資源共享    | Cross-Origin Resource Sharing，瀏覽器的安全機制，控制不同網域之間的資源存取。                        |
| **Referer**                | 參照來源          | HTTP 請求標頭欄位，指示請求是從哪個頁面連結過來的。用於防盜鏈。                                      |
| **STS**                    | 安全權杖服務      | Security Token Service，頒發暫時存取憑證的服務，用於前端直傳等場景。                                 |
| **Multipart Upload**       | 分片上傳          | 將大檔案切分成多個小分片並行上傳，支援斷點續傳，提高上傳效率和可靠性。                               |
| **ETag**                   | 實體標籤          | HTTP 回應標頭，用於識別資源的特定版本，常用於快取驗證。                                              |
| **S3 API**                 | S3 相容介面       | AWS S3 的物件儲存 API 規範，多數雲端廠商的物件儲存都相容此介面。                                     |
| **Canonical Query String** | 規範查詢字串      | 簽章字串的一部分，用於計算請求簽章，確保請求不被竄改。                                               |

---

## 總結：物件儲存 + CDN 的黃金法則

1. **上傳走直傳**：大檔案用分片，安全用 STS
2. **快取分層次**：瀏覽器 -> CDN -> 來源站，層層快取
3. **就近服務使用者**：智慧 DNS + 全球節點覆蓋
4. **安全不鬆懈**：HTTPS + 防盜鏈 + 存取控制
5. **成本要監控**：命中率、頻寬、儲存分級，持續最佳化

這套架構撐起了網際網路絕大部分的靜態資源存取，理解它，你就理解了現代 Web 效能最佳化的基石。
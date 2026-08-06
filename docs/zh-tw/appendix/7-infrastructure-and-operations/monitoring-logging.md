# 監控日誌與告警原理
> 💡 **學習指南**：本章節無需程式設計基礎，透過互動式演示帶你瞭解維運的完整知識體系。從監控告警到故障排查，從容量規劃到自動化維運，全面掌握線上系統維運技能。

## 0. 引言：系統上線只是開始

很多新手認為：「程式碼部署上線，任務就完成了。」

**大錯特錯！**

系統上線只是**維運工作的起點**。就像買了一輛新車，後續的保養、維修、加油才是常態。

維運的目標有三個：

1. **穩定性 (Stability)**：系統不當機，服務一直可用
2. **效能 (Performance)**：回應快速，使用者體驗好
3. **安全 (Security)**：資料不外洩，防止被攻擊

---

## 1. 監控體系 (Monitoring)

監控是維運的「眼睛」。沒有監控的系統就像盲人開車，出了問題都不知道。

### 1.1 監控的三個層次

<MonitoringDashboardDemo />

**基礎設施監控**：關注伺服器硬體資源

- CPU 使用率
- 記憶體使用率
- 磁碟空間和 I/O
- 網路頻寬

**應用監控**：關注軟體執行狀態

- QPS（每秒請求數）
- 回應時間（延遲）
- 錯誤率
- 依賴服務呼叫情況

**業務監控**：關注業務健康度

- DAU/MAU（日活/月活）
- 訂單量
- 支付成功率
- 使用者留存率

### 1.2 監控工具棧

| 工具           | 用途           | 特點                     |
| :------------- | :------------- | :----------------------- |
| **Prometheus** | 指標採集與儲存 | 時序資料庫，適合監控資料 |
| **Grafana**    | 視覺化面板     | 強大的圖表和 dashboard   |
| **Zabbix**     | 綜合監控       | 老牌工具，功能全面       |
| **Datadog**    | SaaS 監控平臺  | 一站式解決方案，收費     |

**關鍵點**：監控要分層，從基礎設施到業務全方位涵蓋，避免「盲區」。

---

## 2. 告警系統 (Alerting)

監控發現問題後，需要及時通知維運人員，這就是**告警**。

### 2.1 告警流程

<AlertFlowDemo />

### 2.2 告警級別設計

合理的告警分級能避免「告警疲勞」：

| 級別   | 回應時間        | 典型場景                   | 通知渠道           |
| :----- | :-------------- | :------------------------- | :----------------- |
| **P0** | 立即（5 分鐘內） | 核心服務當機、支付失敗     | 電話 + 簡訊 + 釘釘 |
| **P1** | 30 分鐘內        | 部分功能異常、效能嚴重下降 | 簡訊 + 釘釘 + 郵件 |
| **P2** | 當天處理        | 資源使用率偏高、偶發錯誤   | 釘釘 + 郵件        |
| **P3** | 本週處理        | 非核心問題、最佳化建議     | 郵件               |

### 2.3 告警收斂與降噪

**痛點**：一個小問題可能觸發成百上千條告警，導致值班人員麻木。

**解決方案**：

1. **告警分組**：相似告警合併（如同一臺伺服器的多個問題合併為一條）
2. **告警抑制**：如果父問題已觸發，子問題不重複告警
3. **靜默規則**：維護期間自動暫停告警
4. **頻率限制**：同一告警短時間內不重複通知

**關鍵點**：告警要「少而精」，每條都要值得處理。

---

## 3. 日誌管理 (Logging)

日誌是排查問題的「黑盒子」。

### 3.1 日誌分級

```javascript
console.debug('詳細除錯資訊') // 開發時使用
console.info('一般資訊') // 正常流程記錄
console.warn('警告資訊') // 潛在問題
console.error('錯誤資訊') // 需要關注的錯誤
```

### 3.2 結構化日誌

傳統日誌（不好）：

```
2024-01-15 10:23:45 ERROR User john failed to login, attempts=3, ip=192.168.1.100
```

結構化日誌（推薦）：

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

### 3.3 ELK 日誌棧

**ELK = Elasticsearch + Logstash + Kibana**

- **Logstash**：日誌採集和過濾
- **Elasticsearch**：日誌儲存和搜尋
- **Kibana**：日誌視覺化查詢

**最佳實務**：

- ✅ 敏感資訊（密碼、token）不要記入日誌
- ✅ 關鍵操作（登入、支付、權限變更）必須記錄
- ✅ 日誌要包含上下文（使用者 ID、請求 ID、時間戳）
- ✅ 定期清理過期日誌，避免磁碟爆滿

---

## 4. 鏈路追蹤 (Tracing)

在微服務架構中，一個請求可能經過十幾個服務，如何追蹤它的完整路徑？

**Trace ID 和 Span ID**

- **Trace ID**：整個請求鏈路的唯一識別碼（像快遞單號）
- **Span ID**：單個服務呼叫的識別碼（像每個中轉站）

### 4.1 分散式追蹤演示

<TraceVisualizationDemo />

### 4.2 OpenTelemetry 標準

OpenTelemetry (OTel) 是鏈路追蹤的**行業標準**，提供統一的 API 和 SDK。

```javascript
// 範例：使用 OpenTelemetry 記錄 Span
import { trace } from '@opentelemetry/api'

const tracer = trace.getTracer('my-service')

async function processOrder(orderId) {
  // 建立一個 Span
  const span = tracer.startSpan('processOrder')

  try {
    // 設定屬性
    span.setAttribute('order.id', orderId)

    // 業務邏輯...
    await validateOrder(orderId)
    await saveToDatabase(orderId)

    span.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    span.recordException(error)
    span.setStatus({ code: SpanStatusCode.ERROR, message: error.message })
  } finally {
    span.end() // 結束 Span
  }
}
```

**關鍵點**：鏈路追蹤能快速定位效能瓶頸和故障點，是微服務必備工具。

---

## 5. 故障排查流程

線上故障不可避免，關鍵是**快速回應、快速恢復**。

### 5.1 故障處理流程

<IncidentResponseDemo />

### 5.2 常用排查工具

| 工具         | 用途         | 典型場景                 |
| :----------- | :----------- | :----------------------- |
| **tcpdump**  | 抓包分析     | 網路不通、資料包丟失     |
| **strace**   | 追蹤系統呼叫 | 行程卡住、檔案權限問題   |
| **Arthas**   | Java 診斷    | CPU 飆高、記憶體洩漏、死結 |
| **top/htop** | 系統資源監控 | CPU/記憶體佔用高           |
| **netstat**  | 網路連線檢視 | 埠號佔用、連線數異常     |
| **lsof**     | 檢視開啟檔案 | 檔案被佔用、磁碟滿       |

**Arthas 範例**（阿里巴巴開源的 Java 診斷工具）：

```bash
# 檢視 CPU 最高的前 5 個執行緒
$ top -H -p 12345

# 檢視某個方法的呼叫耗時
$ trace com.example.OrderService createOrder

# 檢視類別的靜態欄位
$ getstatic com.example.Config MAX_CONNECTIONS

# 熱更新程式碼（無需重啟）
$ mc /tmp/Test.java
$ redefine /tmp/Test.class
```

### 5.3 故障檢討 (Post-mortem)

**檢討不是追責會！**

檢討的目的是：

1. 梳理故障時間線
2. 找出根本原因 (Root Cause Analysis)
3. 總結經驗教訓
4. 制定改進措施

**5 Why 分析法**：

問「為什麼」至少 5 次，找到根本原因：

- 為什麼服務當機？
  - 因為記憶體溢位
- 為什麼記憶體溢位？
  - 因為快取資料過多
- 為什麼快取資料過多？
  - 因為沒有設定過期時間
- 為什麼沒有設定過期時間？
  - 因為開發時遺漏了
- **根本原因**：缺少程式碼審查和測試用例

**關鍵點**：建立 blameless 文化，關注流程改進而非個人責任。

---

## 6. 效能最佳化

### 6.1 效能瓶頸分析

**從上到下的最佳化思路**：

```
使用者感知
  ↓
前端最佳化（減少請求、CDN、懶載入）
  ↓
網路最佳化（HTTP/2、壓縮、長連線）
  ↓
後端最佳化（快取、非同步、批次處理）
  ↓
資料庫最佳化（索引、查詢最佳化、分庫分表）
  ↓
系統最佳化（核心參數、JVM 調校）
```

### 6.2 資料庫最佳化

**索引最佳化**：

```sql
-- 查詢慢（無索引）
SELECT * FROM orders WHERE user_id = 12345;

-- 建立索引後快 100 倍
CREATE INDEX idx_user_id ON orders(user_id);
```

**查詢最佳化**：

```sql
-- ❌ 避免 SELECT *
SELECT * FROM users WHERE id = 123;

-- ✅ 只查需要的欄位
SELECT id, name, email FROM users WHERE id = 123;

-- ❌ 避免 IN 子句太多
SELECT * FROM orders WHERE user_id IN (1, 2, 3, ..., 10000);

-- ✅ 使用 JOIN 或批量查詢
SELECT * FROM orders o JOIN user_ids u ON o.user_id = u.id;
```

### 6.3 快取最佳化

**多級快取架構**：

```
瀏覽器快取 (CDN)
  ↓
本地快取 (記憶體/Guava)
  ↓
分散式快取 (Redis/Memcached)
  ↓
資料庫 (MySQL/PostgreSQL)
```

**快取更新策略**：

| 策略              | 優點         | 缺點         | 適用場景                 |
| :---------------- | :----------- | :----------- | :----------------------- |
| **Cache-Aside**   | 簡單、可靠   | 首次查詢慢   | 讀多寫少                 |
| **Write-Through** | 資料一致性佳 | 寫入慢       | 讀寫均衡                 |
| **Write-Behind**  | 寫入極快     | 可能丟失資料 | 寫多讀少、允許短時不一致 |

**關鍵點**：快取不是銀彈，要考慮一致性、雪崩、穿透等問題（參考《系統快取設計》章節）。

---

## 7. 容量規劃

### 7.1 容量評估

<CapacityPlanningDemo />

### 7.2 壓力測試

**工具選擇**：

| 工具       | 特點                | 適用場景      |
| :--------- | :------------------ | :------------ |
| **JMeter** | 功能強大、視覺化    | HTTP 介面壓測 |
| **wrk/ab** | 輕量、命令列        | 快速基準測試  |
| **Locust** | Python 腳本、分散式 | 複雜場景壓測  |
| **K6**     | 現代、JS 腳本       | CI/CD 整合    |

**wrk 範例**：

```bash
# 安裝 wrk
$ brew install wrk  # macOS
$ apt install wrk   # Ubuntu

# 壓測 HTTP 介面（10 執行緒，持續 30 秒）
$ wrk -t10 -c100 -d30s http://example.com/api/users

# 輸出：
# Running 30s test @ http://example.com/api/users
#   10 threads and 100 connections
# Thread Stats Avg Stdev Max +/- Stdev

# Latency 45.32ms 12.45ms 120.50ms 87.56%

# Req/Sec 2.12k 123.45 3.45k 89.01%

#   632450 requests in 30.00s, 1.23GB read
# Requests/sec: 21081.67

```

### 7.3 彈性擴縮容

**雲原生時代的自動擴縮容**：

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

**當 CPU 使用率超過 70% 時，自動擴容 Pod（最多 10 個）**

**關鍵點**：結合業務預測（如雙 11）提前擴容，避免來不及。

---

## 8. 安全維運

### 8.1 存取控制

**最小權限原則**：

- 開發人員只能存取開發環境
- 維運人員只能存取生產環境，且需要審批
- 資料庫敏感操作需要二次確認

**堡壘機 (Jump Server)**：

所有維運操作透過堡壘機進行，記錄完整操作日誌。

### 8.2 資料備份

**3-2-1 備份原則**：

- **3** 份資料副本（1 份原始 + 2 份備份）
- **2** 種不同儲存媒介（本地磁碟 + 雲端儲存）
- **1** 份異地備份（防止單點災難）

**備份策略**：

| 類型         | 頻率 | 保留時間 | RTO    | RPO     |
| :----------- | :--- | :------- | :----- | :------ |
| **全量備份** | 每週 | 1 個月   | 4 小時 | 24 小時 |
| **增量備份** | 每天 | 1 週     | 2 小時 | 1 小時  |
| **即時備份** | 秒級 | 7 天     | 分鐘級 | 秒級    |

**RTO (Recovery Time Objective)**：復原時間目標（服務最多中斷多久）
**RPO (Recovery Point Objective)**：復原點目標（最多丟失多少資料）

### 8.3 漏洞掃描

**定期掃描**：

- **程式碼掃描**：SonarQube、ESLint（發現潛在漏洞）
- **依賴掃描**：npm audit、Snyk（檢測第三方函式庫漏洞）
- **容器掃描**：Trivy、Clair（檢測映像檔漏洞）

```bash
# npm audit 範例
$ npm audit

found 3 vulnerabilities (1 moderate, 2 high)

Package         Severity  Vulnerable versions
lodash          high      <4.17.21
express         moderate  4.0.0 - 4.18.2

# 自動修復
$ npm audit fix
```

---

## 9. 自動化維運 (DevOps)

### 9.1 CI/CD 流水線

```yaml
# .gitlab-ci.yml 範例
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
  when: manual # 手動觸發部署
```

### 9.2 基礎設施即程式碼 (IaC)

**Terraform 範例**（管理雲端資源）：

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

**優勢**：

- ✅ 版本控制：所有配置在 Git 中
- ✅ 可重複：環境一致性
- ✅ 可審計：變更歷史清晰
- ✅ 可回滾：快速恢復到之前版本

### 9.3 GitOps 實務

**GitOps = Git + IaC + Automation**

核心理念：**Git 倉庫是基礎設施的唯一真實來源**

工作流程：

```
1. 修改配置檔案（push 到 Git）
   ↓
2. Git 倉庫變更觸發 CI/CD
   ↓
3. 自動執行terraform apply/kubectl apply
   ↓
4. 基礎設施自動更新
   ↓
5. 監控對比實際狀態與期望狀態
```

**工具**：ArgoCD、Flux（Kubernetes 部署）

---

## 10. 總結與最佳實務

維運是一個龐大的體系，但核心可以概括為：

### 10.1 維運成熟度模型

| 等級     | 特徵               | 實務                           |
| :------- | :----------------- | :----------------------------- |
| **初級** | 被動回應，人工操作 | 出問題才處理，手工部署         |
| **中級** | 自動化，標準化     | CI/CD、監控告警、文件化        |
| **高階** | 預防為主，自癒     | 容量規劃、故障演練、自動擴縮容 |
| **專家** | 智慧化，無人值守   | AIOps、混沌工程、Serverless    |

### 10.2 維運工程師的一天

```
09:00 - 檢視夜間告警，確認系統狀態
10:00 - 處理使用者回饋的問題
11:00 - 參加研發週會，評估新方案維運風險
14:00 - 最佳化慢查詢，提升效能
15:00 - 程式碼審查（Code Review）
16:00 - 編寫部署文件，更新監控規則
17:00 - 故障演練（Chaos Engineering）
18:00 - 值班交接
```

### 10.3 學習路線

**入門階段**（1-3 個月）：

- 學會 Linux 常用命令
- 瞭解監控系統（Prometheus + Grafana）
- 掌握日誌查詢（ELK）

**進階階段**（3-6 個月）：

- 深入理解容器技術（Docker + K8s）
- 掌握一門診斷工具（Arthas、tcpdump）
- 實作 CI/CD 流水線

**高階階段**（6-12 個月）：

- 效能調校（資料庫、JVM、網路）
- 容量規劃與成本最佳化
- 故障檢討與流程改進

**專家階段**（1 年以上）：

- 架構設計（高可用、容災）
- 混沌工程（主動注入故障）
- AIOps（智慧維運）

---

## 11. 名詞速查表 (Glossary)

| 名詞            | 全稱                              | 解釋                                           |
| :-------------- | :-------------------------------- | :--------------------------------------------- |
| **Monitoring**  | -                                 | 監控，即時觀測系統執行狀態。                   |
| **Alerting**    | -                                 | 告警，異常時通知相關人員。                     |
| **Logging**     | -                                 | 日誌，記錄系統執行過程中的事件。               |
| **Tracing**     | -                                 | 鏈路追蹤，跟蹤請求在分散式系統中的完整路徑。   |
| **QPS**         | Queries Per Second                | 每秒請求數，衡量系統吞吐量。                   |
| **Latency**     | -                                 | 延遲，請求從發出到回應的時間。                 |
| **RTO**         | Recovery Time Objective           | 復原時間目標，服務最多中斷多久。               |
| **RPO**         | Recovery Point Objective          | 復原點目標，最多丟失多少資料。                 |
| **Post-mortem** | -                                 | 故障檢討，分析故障原因和改進措施。             |
| **CI/CD**       | Continuous Integration/Delivery   | 持續整合與持續交付，自動化測試與部署。         |
| **IaC**         | Infrastructure as Code            | 基礎設施即程式碼，用程式碼管理伺服器、網路等資源。 |
| **GitOps**      | -                                 | Git 維運，Git 倉庫是基礎設施的唯一真實來源。   |
| **ELK**         | Elasticsearch + Logstash + Kibana | 日誌採集、儲存、視覺化三件套。                 |
| **SLA**         | Service Level Agreement           | 服務等級協定，承諾的服務可用性（如 99.9%）。   |
| **Blameless**   | -                                 | 無責備文化，檢討關注流程改進而非個人責任。     |

---

## 12. 延伸閱讀

- **[系統快取設計](/zh-cn/appendix/4-server-and-backend/caching)** - 快取原理、模式與最佳實務
- **[訊息佇列設計](/zh-cn/appendix/4-server-and-backend/message-queues)** - 削峰填谷、非同步解耦
- **[鑑權原理與實戰](/zh-cn/appendix/4-server-and-backend/auth-authorization)** - 認證授權、安全加固
- **[後端進化史](/zh-cn/appendix/4-server-and-backend/backend-layered-architecture)** - 從單體到微服務到 Serverless
- **[部署與上線](/zh-cn/appendix/7-infrastructure-and-operations/ci-cd)** - 從開發到生產的最後一公里
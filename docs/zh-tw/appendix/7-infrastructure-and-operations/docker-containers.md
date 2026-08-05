# Docker 容器化導論

::: tip 前言
**「在我的機器上能跑」是開發者最經典的藉口，Docker 讓這個藉口徹底消失。** 容器化技術將應用及其所有依賴打包成一個標準化的單元，確保在任何環境中都能一致執行。它是現代軟體交付的基石。
:::

**這篇文章會帶你學什麼？**

學完這章後，你將獲得：

- **核心概念**：理解映像、容器、倉庫三大核心概念
- **架構對比**：明白容器和虛擬機的本質區別
- **實作能力**：掌握 Dockerfile 撰寫和常用指令
- **編排基礎**：學會用 Docker Compose 管理多服務應用
- **最佳實踐**：了解映像最佳化、安全加固等生產級實踐

| 章節 | 內容 | 核心概念 |
|-----|------|---------|
| **第 1 章** | 為什麼需要容器 | 環境一致性、資源效率、標準化交付 |
| **第 2 章** | 核心概念 | 映像、容器、倉庫、Dockerfile |
| **第 3 章** | Docker 生命週期 | 撰寫、建置、推送、執行、管理 |
| **第 4 章** | Docker Compose | 多服務編排、網路、資料卷 |
| **第 5 章** | 最佳實踐 | 映像最佳化、安全、多階段建置 |

---

## 1. 需要容器的動機

在容器出現之前，部署一個應用需要在伺服器上手動安裝執行環境、設定環境變數、處理依賴衝突。不同環境（開發、測試、正式）之間的差異是 bug 的溫床。

<DockerArchitectureDemo />

### 容器的問題解決範疇

| 問題 | 傳統方式 | 容器方式 |
|------|---------|---------|
| 環境不一致 | 「我本地能跑」 | 打包所有依賴，到處一致 |
| 依賴衝突 | App A 需要 Node 14，App B 需要 Node 18 | 每個容器獨立環境 |
| 資源浪費 | 每個 VM 一個完整 OS | 共享核心，MB 級開銷 |
| 部署慢 | 手動安裝設定 | docker run 一條指令 |
| 擴容難 | 新建 VM、裝環境、部署 | 秒級啟動新容器 |

::: tip 容器的本質
容器不是輕量級虛擬機。它的本質是**被隔離的程序**。Linux 核心透過兩個機制實現容器：
- **Namespace**：隔離程序的視野（PID、網路、檔案系統等）
- **Cgroups**：限制程序的資源使用（CPU、記憶體、IO）

容器裡的程序和宿主機上的普通程序沒有本質區別，只是被「關在了一個看不到外面的房間裡」。
:::

---

## 2. 核心概念

Docker 的世界圍繞三個核心概念：映像（Image）、容器（Container）、倉庫（Registry）。

| 概念 | 類比 | 說明 |
|------|------|------|
| 映像（Image） | 類別 / 模板 | 唯讀的應用模板，包含程式碼、執行環境、函式庫、設定 |
| 容器（Container） | 實例 / 物件 | 映像的執行實例，可讀寫，有獨立的生命週期 |
| 倉庫（Registry） | 應用商店 | 儲存和分發映像的服務（Docker Hub、ACR、ECR） |
| Dockerfile | 配方 / 藍圖 | 定義如何建置映像的文字檔案 |
| 資料卷（Volume） | 外接硬碟 | 持久化資料，容器刪除後資料不遺失 |

### 映像的分層結構

Docker 映像由多個唯讀層（Layer）疊加而成，每條 Dockerfile 指令建立一層：

```
┌─────────────────────────┐
│  CMD ["node", "app.js"] │  ← 啟動命令層
├─────────────────────────┤
│  COPY . /app            │  ← 應用程式碼層（經常變）
├─────────────────────────┤
│  RUN npm install        │  ← 依賴安裝層（偶爾變）
├─────────────────────────┤
│  FROM node:18-alpine    │  ← 基礎映像層（很少變）
└─────────────────────────┘
```

::: tip 為什麼分層很重要？
Docker 會快取每一層。如果某一層沒有變化，建置時會直接複用快取。所以 Dockerfile 中應該把**變化頻率低的指令放在前面**（如安裝依賴），**變化頻率高的放在後面**（如複製程式碼）。這樣大部分建置都能命中快取，速度快很多。
:::

---

## 3. Docker 生命週期

從撰寫 Dockerfile 到容器執行，Docker 的運作流程是一條清晰的管線。

<DockerLifecycleDemo />

### Dockerfile 常用指令速查

| 指令 | 作用 | 範例 |
|------|------|------|
| `FROM` | 指定基礎映像 | `FROM node:18-alpine` |
| `WORKDIR` | 設定工作目錄 | `WORKDIR /app` |
| `COPY` | 複製檔案到映像 | `COPY package.json ./` |
| `RUN` | 建置時執行命令 | `RUN npm install` |
| `ENV` | 設定環境變數 | `ENV NODE_ENV=production` |
| `EXPOSE` | 宣告連接埠（僅文件作用） | `EXPOSE 3000` |
| `CMD` | 容器啟動命令 | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | 容器入口點（不易被覆蓋） | `ENTRYPOINT ["nginx"]` |

---

## 4. Docker Compose：多服務編排

真實專案通常不止一個容器。一個 Web 應用可能需要：應用伺服器 + 資料庫 + Redis + Nginx。Docker Compose 用一個 YAML 檔案定義和管理多個容器。

### docker-compose.yml 範例

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    volumes:
      - db-data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

  redis:
    image: redis:7-alpine

volumes:
  db-data:
```

### Compose 核心概念

| 概念 | 說明 | 範例 |
|------|------|------|
| services | 定義各個容器服務 | app、db、redis |
| volumes | 持久化資料卷 | db-data 儲存資料庫檔案 |
| networks | 自訂網路（預設自動建立） | 服務間透過服務名稱互相存取 |
| depends_on | 啟動順序依賴 | app 依賴 db 和 redis |
| environment | 環境變數 | 資料庫密碼、連線位址 |

::: tip 服務發現
在 Docker Compose 中，服務名稱就是主機名稱。app 容器可以直接用 `db:5432` 存取資料庫，用 `redis:6379` 存取 Redis，不需要知道 IP 位址。這是 Docker 內建 DNS 的功勞。
:::

---

## 5. 最佳實踐

### 5.1 多階段建置（Multi-stage Build）

多階段建置是最佳化映像大小的利器。建置階段安裝所有工具和依賴，最終階段只保留執行時需要的檔案。

```dockerfile
# 建置階段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 執行階段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### 5.2 映像最佳化清單

| 最佳化項目 | 做法 | 效果 |
|------------|------|------|
| 選擇小基礎映像 | 用 `alpine` 而非 `ubuntu` | 映像從 ~200MB 降到 ~50MB |
| 合併 RUN 指令 | 多個命令用 `&&` 連接 | 減少映像層數 |
| 使用 .dockerignore | 排除 node_modules、.git 等 | 加速建置，減小上下文 |
| 多階段建置 | 分離建置和執行環境 | 最終映像不含建置工具 |
| 固定版本號 | `node:18.17-alpine` 而非 `node:latest` | 建置可重現 |

### 5.3 安全實踐

| 實踐 | 說明 |
|------|------|
| 不用 root 執行 | `USER node` 指定非 root 使用者 |
| 掃描漏洞 | `docker scout` 或 Trivy 掃描映像 |
| 最小權限 | 只安裝必要的套件，不安裝除錯工具 |
| 不硬編碼金鑰 | 用環境變數或 Docker Secrets |
| 定期更新基礎映像 | 及時修復安全漏洞 |

---

## 總結

Docker 容器化是現代軟體交付的基礎設施，理解它對於任何開發者都至關重要。

回顧本章的關鍵要點：

1. **容器 vs 虛擬機**：容器共享宿主核心，更輕量、更快，但隔離性略弱於 VM
2. **核心三件套**：映像（模板）、容器（實例）、倉庫（分發）
3. **Dockerfile**：分層建置，利用快取，變化少的指令放前面
4. **Docker Compose**：用 YAML 定義多服務應用，服務名稱即主機名稱
5. **生產實踐**：多階段建置減小映像、alpine 基礎映像、非 root 執行

## 延伸閱讀

- [Docker 官方文件](https://docs.docker.com/) - 最權威的參考資料
- [Docker Getting Started](https://docs.docker.com/get-started/) - 官方入門教學
- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) - 官方最佳實踐指南
- [Docker Compose 文件](https://docs.docker.com/compose/) - Compose 完整參考

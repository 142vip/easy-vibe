# 領域特定語言（DSL）：宣告式抽象

::: tip 前言
在一个真實案例中，工程师 Armin 在新公司用 AI 構建了一套基础設施服務，總計约 4 万行代碼（Go + YAML + Pulumi + SDK 胶水代碼），其中超過 90% 由 AI 生成。這个案例中出現了许多初學者不熟悉的術語：YAML、Pulumi、HCL、Lua、SDK 胶水代碼……它们既不是 Python，也不是 JavaScript，却在後端项目中无處不在。本文将從一个统一的视角——**领域特定語言（DSL）**——來系统地介绍這些技術。
:::

**本文的學習目標**

在後端開發中，除了用通用編程語言（Python、Go、Java 等）編写的業務邏輯之外，還存在大量**用途各异、語法各异、但都不属于通用編程語言**的文件和代碼。它们有一个共同的上位概念：**DSL（Domain-Specific Language，领域特定語言）**。

學完本文後，你将能够：

- 理解 DSL 與通用編程語言（GPL）的本质區別
- 掌握 DSL 的分類體系：數據序列化格式、嵌入式脚本語言、基础設施定義語言
- 區分 XML、JSON、YAML、TOML、CSV、Protobuf 等數據格式的適用場景
- 理解 Lua 等嵌入式脚本語言的設計目的
- 解釋 Terraform（HCL）和 Pulumi 的原理與區別
- 理解 OpenAPI 規范與 SDK 自動生成的工作原理
- 判断哪些類型的代碼適合交给 AI 生成

| 章節 | 主题 | 核心概念 |
|-----|------|---------|
| **第 1 章** | DSL 總论 | DSL vs GPL 的定義、分類體系與全景图 |
| **第 2 章** | 數據序列化格式 | XML、JSON、YAML、TOML、CSV、Protobuf 等 |
| **第 3 章** | 嵌入式脚本語言 | Lua 等語言的設計哲學與典型應用 |
| **第 4 章** | 基础設施即代碼 | Terraform（HCL）、Pulumi 的原理與對比 |
| **第 5 章** | 胶水代碼與 SDK 生成 | OpenAPI 規范與客户端代碼自動生成 |
| **第 6 章** | AI 與 DSL 的關系 | 為什么 AI 特別擅長生成 DSL 代碼 |

---

## 1. DSL 總论：通用語言之外的另一个世界

### 1.1 DSL概述

**DSL（Domain-Specific Language，领域特定語言）** 是為某个特定领域或特定任務設計的語言。與之相對的是 **GPL（General-Purpose Language，通用編程語言）**，如 Python、Java、Go、C++ 等——它们被設計為可以解决任意計算問题。

兩者的核心區別：

| 維度 | GPL（通用編程語言） | DSL（领域特定語言） |
|------|-------------------|-------------------|
| **設計目標** | 解决任意計算問题 | 解决某个特定领域的問题 |
| **表達范围** | 图灵完備，理论上可以計算任何東西 | 通常有意限制表達范围 |
| **學習成本** | 較高，需要理解完整的語言體系 | 較低，只需理解該领域的概念 |
| **典型代表** | Python、Java、Go、C++、JavaScript | SQL、HTML/CSS、正则表達式、YAML、HCL |

你其實早就在使用 DSL 了：

- **SQL** 是數據庫查询领域的 DSL——你用 `SELECT * FROM users WHERE age > 18` 來查數據，而不是用 Python 手写遍歷邏輯
- **HTML/CSS** 是網頁結構與样式领域的 DSL——你用標簽和属性描述頁面，而不是用 C++ 操作像素
- **正则表達式** 是文本模式匹配领域的 DSL——你用 `\d{3}-\d{4}` 匹配電话号碼，而不是手写字符比較循環

### 1.2 DSL 的分類

DSL 可以按照"是否具備图灵完備性"分為兩大類：

**外部 DSL（External DSL）**

擁有独立的語法和解析器，不依附于任何通用編程語言。用户編写的代碼由專用的解釋器或編译器處理。

- 纯數據描述型：JSON、YAML、XML、TOML、CSV、Protobuf（不含任何邏輯）
- 查询/操作型：SQL、GraphQL、正则表達式（有限的邏輯能力）
- 领域建模型：HCL（Terraform）、Dockerfile、Nginx 配置語法（声明式描述特定领域的狀態）

**內部 DSL（Internal DSL / Embedded DSL）**

寄生在某門通用編程語言內部，利用宿主語言的語法來構建领域專用的表達方式。代碼本身是合法的宿主語言代碼，但讀起來像是一門專用語言。

- Pulumi（用 TypeScript/Python/Go 編写，但 API 設計得像声明式配置）
- Ruby on Rails 的路由定義（`get '/users', to: 'users#index'`，合法的 Ruby 代碼，但讀起來像配置）
- 測試框架中的断言語法（`expect(value).toBe(42)`，合法的 JavaScript，但讀起來像自然語言）

### 1.3 後端项目中的 DSL 全景图

在一个典型的後端项目中，你會遇到以下几類 DSL：

```
後端项目中的 DSL
├── 數據序列化格式（描述數據結構）
│   ├── 文本格式：JSON、YAML、XML、TOML、CSV、INI
│   └── 二進制格式：Protobuf、MessagePack、Avro、BSON
├── 嵌入式脚本語言（可編程的配置層）
│   ├── Lua（游戏引擎、Nginx、Redis）
│   ├── GDScript（Godot 引擎）
│   └── Jsonnet（配置模板生成）
├── 基础設施與運維 DSL（声明式描述系统狀態）
│   ├── HCL（Terraform）
│   ├── Dockerfile / Docker Compose YAML
│   └── Nginx / Apache 配置語法
└── 接口描述語言（描述 API 契约）
    ├── OpenAPI / Swagger
    ├── Protocol Buffers（.proto 文件）
    └── GraphQL Schema
```

理解了這张全景图，後續章節将逐一展開每个分支。

---

## 2. 數據序列化格式：用文本描述結構化數據

### 2.1 數據序列化概述

**序列化（Serialization）** 是指将內存中的數據結構（對象、字典、數組等）轉换為一種可存儲或可傳輸的文本/字節流的過程。反過來，從文本/字節流還原為內存中的數據結構，称為**反序列化（Deserialization）**。

數據序列化格式是 DSL 中最基础的一類——它们属于纯數據描述型外部 DSL，不具備任何邏輯能力，只负责静態地描述"值是什么"。

### 2.2 這些格式的動機

假設你開發了一个後端服務，數據庫地址為 `localhost:5432`。如果将這个地址硬編碼在源代碼中，本地開發没有問题，但部署到生產環境時，數據庫地址變為 `db.prod.company.com:5432`，你就需要修改源代碼并重新編译。

工程實踐中的通用做法是：**将可變的參數從代碼中分離出來，存放在独立的配置文件中。** 程序在启動時讀取配置文件，根據其中的值來决定行為。

除了配置之外，數據序列化格式還广泛用于：系统間的數據交换（API 請求/響應）、數據持久化存儲、跨語言通信等場景。

### 2.3 人類可讀的文本格式

以下是工程中最常见的文本序列化格式，按歷史顺序介绍。

**INI**

最早期的配置格式，起源于 Windows 系统。結構简單，由節（section）和鍵值對組成：

```ini
[database]
host = localhost
port = 5432

[server]
debug = true
```

優點是可讀性強。局限在于不支持嵌套結構和數組類型，无法表達複雜配置。目前主要出現在遺留系统和部分 Linux 配置中（如 `php.ini`、`my.cnf`）。

**CSV**

**CSV（Comma-Separated Values，逗号分隔值）** 是最简單的表格數據格式：

```csv
name,age,city
Alice,30,Beijing
Bob,25,Shanghai
```

每行是一條記錄，字段之間用逗号分隔。CSV 广泛用于數據導入導出、電子表格交换、數據分析管道。它的局限是只能表達扁平的二維表格，不支持嵌套結構，且没有類型信息（所有值都是字符串）。

**XML**

**XML（eXtensible Markup Language，可擴展標記語言）** 诞生于 1998 年，曾經是數據交换的主流標準：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>5432</port>
  </database>
  <server>
    <debug>true</debug>
    <allowed_origins>
      <origin>https://example.com</origin>
      <origin>https://app.example.com</origin>
    </allowed_origins>
  </server>
</config>
```

XML 的表達力非常強，支持嵌套、属性、命名空間、Schema 验證等高级特性。但它的語法冗長——大量的開閉標簽導致信噪比低，手動編写和阅讀的體验較差。

XML 在以下领域仍然广泛使用：
- Java 生態（Maven 的 `pom.xml`、Spring 配置、Android 布局文件）
- 企業级 Web 服務（SOAP 協议）
- 辦公文檔格式（`.docx`、`.xlsx` 本质上是 ZIP 压缩的 XML 文件集合）
- RSS/Atom 订阅源、SVG 矢量图形

**JSON**

**JSON（JavaScript Object Notation）** 诞生于 2001 年，因其简洁性迅速取代 XML 成為 Web API 數據交换的事實標準：

```json
{
  "database": {
    "host": "localhost",
    "port": 5432
  },
  "server": {
    "debug": true
  }
}
```

優點是結構清晰，几乎所有編程語言都有原生解析支持。主要缺點是**不支持注釋**，且大量的括号和引号在手動編写時容易出錯。JSON 同時也是前端项目配置的標準格式（`package.json`、`tsconfig.json`）。

**YAML**

**YAML（YAML Ain't Markup Language）** 同样诞生于 2001 年，是目前後端和 DevOps 领域使用最广泛的配置格式。Docker Compose、Kubernetes、GitHub Actions 等工具均采用 YAML：

```yaml
# 數據庫配置
database:
  host: localhost
  port: 5432

# 服務器配置
server:
  debug: true
  allowed_origins:
    - https://example.com
    - https://app.example.com
```

優點是支持注釋、語法简洁、可表達複雜嵌套結構。缺點是**依賴缩進來表示層级關系**，缩進錯误會導致解析失敗，這是初學者最常遇到的問题。

> 补充：YAML 的全称 "YAML Ain't Markup Language" 是一个遞归缩写。

**TOML**

**TOML（Tom's Obvious Minimal Language）** 诞生于 2013 年，被 Rust 的包管理器 Cargo 和 Python 的 `pyproject.toml` 采用：

```toml
[database]
host = "localhost"
port = 5432

[server]
debug = true
allowed_origins = [
  "https://example.com",
  "https://app.example.com"
]
```

TOML 試图兼顧 INI 的简洁性和 YAML 的表達力，同時避免缩進敏感带來的問题。

### 2.4 二進制序列化格式

上述格式都是人類可讀的文本。在對性能和體积有更高要求的場景中，還存在一類**二進制序列化格式**——它们牺牲可讀性，换取更小的體积和更快的解析速度。

| 格式 | 開發方 | 特點 | 典型使用場景 |
|------|-------|------|------------|
| **Protocol Buffers (Protobuf)** | Google | 需要预定義 `.proto` Schema 文件，強類型，體积极小 | gRPC 通信、Google 內部服務、高性能微服務 |
| **MessagePack** | 社區 | 類似 JSON 的二進制版本，无需 Schema | Redis 內部編碼、跨語言高性能通信 |
| **Avro** | Apache | 支持 Schema 演進，適合大數據場景 | Hadoop / Kafka 生態的數據序列化 |
| **BSON** | MongoDB | JSON 的二進制擴展，支持更多數據類型 | MongoDB 數據庫內部存儲格式 |

以 Protocol Buffers 為例，需要先定義 Schema：

```protobuf
// user.proto
syntax = "proto3";

message User {
  string name = 1;
  int32 age = 2;
  string email = 3;
}
```

然後通過編译器（`protoc`）自動生成各語言的序列化/反序列化代碼。這種"先定義 Schema，再生成代碼"的模式與後文将介绍的 OpenAPI SDK 生成思路一致。

### 2.5 完整對比

| 格式 | 類型 | 诞生年代 | 可讀性 | 支持注釋 | 典型使用場景 |
|------|------|---------|--------|---------|------------|
| **INI** | 文本 | 1980s | 高 | ✅ | 系统配置、遺留项目 |
| **CSV** | 文本 | 1972 | 高 | ❌ | 數據導入導出、表格交换 |
| **XML** | 文本 | 1998 | 中 | ✅ | Java 生態、企業级 Web 服務、文檔格式 |
| **JSON** | 文本 | 2001 | 高 | ❌ | Web API 數據交换、前端配置 |
| **YAML** | 文本 | 2001 | 高 | ✅ | Docker、K8s、CI/CD、後端服務配置 |
| **TOML** | 文本 | 2013 | 高 | ✅ | Rust / Python 项目配置 |
| **Protobuf** | 二進制 | 2008 | 无 | — | gRPC、高性能微服務通信 |
| **MessagePack** | 二進制 | 2008 | 无 | — | 高性能跨語言通信 |
| **Avro** | 二進制 | 2009 | 无 | — | Hadoop / Kafka 大數據管道 |
| **BSON** | 二進制 | 2009 | 无 | — | MongoDB 內部存儲 |

**要點**：所有這些格式的本质功能相同——**将結構化數據轉换為可存儲、可傳輸的形式**。文本格式優先考虑人類可讀性和易編輯性；二進制格式優先考虑解析性能和傳輸體积。選择哪種格式取决于具體場景的需求權衡。


---

## 3. 嵌入式脚本語言：可編程的配置層

### 3.1 概念定義

Python、JavaScript、Go 等語言是通用編程語言（General-Purpose Language），它们可以独立運行，構建完整的應用程序。

與之不同，還有一類語言**專門設計為嵌入到其他宿主程序中運行**，為宿主程序提供可編程的擴展能力。這類語言被称為**嵌入式脚本語言（Embedded Scripting Language）**。

它们解决的核心問题是：**当静態配置文件（YAML/JSON）的表達力不够，需要引入條件判断、循環等邏輯時，如何在不修改宿主程序源碼的前提下實現動態行為。**

### 3.2 Lua：最具代表性的嵌入式脚本語言

Lua（葡萄牙語中"月亮"的意思）是一門极其輕量的脚本語言，整个解釋器編译後僅几百 KB。它的設計目標不是独立運行，而是作為可嵌入的擴展層。

Lua 的典型應用場景：

- **游戏引擎**：《魔兽世界》的插件系统、《Roblox》的游戏脚本均使用 Lua。游戏引擎用 C/C++ 實現核心渲染和物理計算，将關卡邏輯、NPC 對话等频繁變動的部分交给 Lua 脚本。這样，策划人员修改游戏內容時不需要重新編译引擎。

- **Web 服務器**：OpenResty 将 Lua 嵌入 Nginx 內部，使運維人员可以用 Lua 脚本實現請求過滤、限流、鑑權等邏輯，而无需修改 Nginx 的 C 源碼。

- **數據庫**：Redis 支持将 Lua 脚本發送到服務端執行，用于實現需要原子性保證的複合操作（如"先讀後写"）。

以下是一段嵌入在 Nginx（OpenResty）中的 Lua 脚本示例：

```lua
-- 功能：對 /api/secret 路径進行 token 鑑權
local uri = ngx.var.uri
local token = ngx.req.get_headers()["Authorization"]

if uri == "/api/secret" and token ~= "Bearer my-secret-token" then
    ngx.status = 403
    ngx.say("Access denied")
    return ngx.exit(403)
end
```

### 3.3 其他嵌入式脚本語言

| 語言 | 宿主環境 | 典型用途 |
|------|---------|---------|
| **Lua** | 游戏引擎、Nginx（OpenResty）、Redis | 游戏邏輯、網關策略、緩存操作 |
| **VimScript / Lua** | Vim / Neovim 編輯器 | 編輯器插件開發 |
| **Emacs Lisp** | Emacs 編輯器 | 編輯器行為自定義 |
| **GDScript** | Godot 游戏引擎 | 游戏邏輯脚本 |
| **Jsonnet** | Kubernetes 生態 / 配置生成工具 | 模板化生成大量相似的 JSON/YAML 配置 |

**要點**：嵌入式脚本語言在 DSL 分類中属于**內部 DSL 與外部 DSL 的交界地带**——它们是独立的語言（有自己的語法和解釋器），但設計目標是嵌入宿主程序運行，而非独立構建應用。它们填补了"静態配置文件"（纯數據描述型 DSL）與"通用編程語言"（GPL）之間的空白：当配置需要表達邏輯（條件判断、循環、函數調用）時，嵌入一門輕量脚本語言是工程上的標準解决方案。


---

## 4. 基础設施即代碼（Infrastructure as Code）

### 4.1 基礎設施概述

在後端工程中，"基础設施"（Infrastructure）指的是應用程序運行所依賴的底層资源：

- 計算资源：服務器（虚擬機或容器）
- 數據存儲：數據庫實例、對象存儲桶
- 網絡：防火墙規则、负載均衡器、DNS 配置
- 中間件：消息队列、緩存集群

在云計算時代，這些资源通過云服務商（如 AWS、阿裡云、騰讯云）的控制台以图形界面的方式創建和管理。

### 4.2 手動管理的局限性

通過控制台手動操作在小規模项目中可行，但隨着项目規模增長，會暴露以下問题：

1. **不可重複**：操作步骤没有記錄，无法精确複現同一套環境
2. **不可审計**：无法追溯"誰在什么時間修改了什么配置"
3. **不可協作**：操作過程无法纳入版本控制，无法進行代碼审查
4. **容易出錯**：手動操作在生產環境中存在误操作風險

**基础設施即代碼（Infrastructure as Code，简称 IaC）** 的核心思想是：**用代碼來声明式地定義基础設施资源，使其具備版本控制、自動化執行和可重複部署的能力。**

### 4.3 Terraform

Terraform 是目前使用最广泛的 IaC 工具，由 HashiCorp 公司開發。它使用專用的 **HCL（HashiCorp Configuration Language）** 語言。

Terraform 采用**声明式**范式：用户描述期望的最终狀態，Terraform 自動計算從当前狀態到目標狀態所需的操作。

```hcl
# 定義一台云服務器
resource "aws_instance" "my_server" {
  ami           = "ami-0c55b159cbfafe1f0"  # 操作系统镜像
  instance_type = "t3.micro"               # 實例規格

  tags = {
    Name = "my-first-server"
  }
}

# 定義一个 PostgreSQL 數據庫實例
resource "aws_db_instance" "my_database" {
  engine         = "postgres"
  instance_class = "db.t3.micro"
  username       = "admin"
  password       = "please-use-secrets-manager"
}
```

執行流程：

```bash
terraform plan    # 预览将要執行的變更
terraform apply   # 确認并執行，自動在云平台創建资源
```

### 4.4 Pulumi

Pulumi 提供了另一種思路：**直接使用通用編程語言（TypeScript、Python、Go 等）來定義基础設施**，而非學習專用的 HCL 語法。

同样的服務器定義，用 Pulumi + TypeScript 表達如下：

```typescript
import * as aws from "@pulumi/aws";

const server = new aws.ec2.Instance("my-server", {
    ami: "ami-0c55b159cbfafe1f0",
    instanceType: "t3.micro",
    tags: { Name: "my-first-server" },
});

const bucket = new aws.s3.Bucket("my-bucket", {
    acl: "private",
});

export const serverIp = server.publicIp;
```

由于使用的是通用編程語言，開發者可以利用循環、條件判断、函數抽象等語言特性來處理複雜的基础設施邏輯。

### 4.5 Terraform 與 Pulumi 的對比

| 維度 | Terraform | Pulumi |
|------|-----------|--------|
| **語言** | HCL（專用語言） | TypeScript / Python / Go 等通用語言 |
| **學習成本** | 需要學習 HCL 語法 | 使用已掌握的編程語言，學習成本較低 |
| **社區生態** | 非常成熟，几乎覆盖所有云服務商 | 快速增長中，但規模小于 Terraform |
| **適用場景** | 運維团队主導的標準化基础設施管理 | 開發者主導的项目，需要複雜邏輯的場景 |
| **AI 代碼生成適配度** | 高（模式固定） | 很高（本质是通用編程語言代碼） |

**要點**：IaC 工具中的 HCL 是一種典型的外部 DSL——它有独立的語法和解析器，專門用于声明式描述基础設施狀態。而 Pulumi 则采用內部 DSL 的策略——用通用編程語言的語法來表達领域特定的概念。兩者目標一致（将基础設施管理從手動操作轉為代碼驅動），路径不同（專用語言 vs 通用語言）。代碼可以纳入 Git 版本控制、進行团队审查、自動化執行和回滚。


---

## 5. 胶水代碼與 SDK 自動生成

### 5.1 膠水程式碼概述

在軟件工程中，**胶水代碼（Glue Code）** 指的是本身不包含業務邏輯，僅用于連接兩个系统或模塊的代碼。

典型的胶水代碼包括：

- 前端調用後端 API 時編写的 HTTP 請求代碼（URL 拼接、請求頭設置、響應解析）
- 後端服務 A 調用服務 B 接口時編写的 HTTP 客户端代碼
- 不同編程語言之間的接口適配代碼

這類代碼的特征是：**高度重複、模式固定、但不可省略。**

### 5.2 OpenAPI 規范與代碼自動生成

既然胶水代碼具有高度的模式化特征，工程界的解决方案是：**先用標準格式描述 API 接口，再用工具自動生成客户端代碼。**

**OpenAPI 規范**（前身為 Swagger）是描述 REST API 的行業標準。它使用 YAML 或 JSON 格式，精确定義 API 的路径、參數、請求體和響應結構：

```yaml
openapi: 3.0.0
info:
  title: 郵件服務 API
  version: 1.0.0

paths:
  /emails:
    post:
      summary: 發送郵件
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                to:
                  type: string
                  example: "user@example.com"
                subject:
                  type: string
                body:
                  type: string
      responses:
        '200':
          description: 發送成功
```

基于這份規范文件，使用 `openapi-generator` 等工具可以自動生成多種語言的客户端 SDK：

- **Python**：`client.emails.send(to="user@example.com", subject="Hi", body="Hello")`
- **TypeScript**：`client.emails.send({ to: "user@example.com", subject: "Hi", body: "Hello" })`
- **Go**：`client.Emails.Send(ctx, &SendEmailRequest{To: "user@example.com", ...})`

生成的 SDK 封装了 HTTP 請求的所有细節，調用方无需關心 URL 路径、請求方法、序列化格式等底層實現。

### 5.3 重新理解 Armin 的案例

回到本文開頭的案例，現在可以準确理解其中每个組成部分：

| 組成部分 | 性质 | 說明 |
|---------|------|------|
| **Go** | 業務邏輯代碼 | 郵件收發服務的核心功能實現 |
| **YAML** | 配置文件 | 服務配置、CI/CD 流水线定義、OpenAPI 規范文件 |
| **Pulumi** | 基础設施代碼 | 用 Go/TypeScript 定義云资源（服務器、數據庫、網絡） |
| **SDK 胶水代碼** | 自動生成的客户端庫 | 從 OpenAPI 規范自動生成的 Python 和 TypeScript SDK |

其中 YAML 配置、Pulumi 资源定義、SDK 胶水代碼這三類均属于高度模式化、有明确規范约束的代碼，這正是 AI 代碼生成能力最強的领域。因此"4 万行代碼中 90% 由 AI 生成"是合理的。


---

## 6. AI 與 DSL 的關系

### 6.1 AI 代碼生成的適用性分析

| 特征維度 | 適合 AI 生成 | 不適合 AI 生成 |
|---------|-------------|---------------|
| **模式化程度** | 高度重複，存在固定模板 | 需要創造性設計，无先例可循 |
| **規范约束** | 有明确的 schema 或語法規范 | 需求模糊，邊界不清晰 |
| **上下文依賴** | 局部自洽，單个定義不依賴全局理解 | 需要理解整个系统的架構意图 |
| **可验證性** | 可被工具自動校验（如 `terraform validate`） | 只能依靠人工判断設計合理性 |

本文介绍的四類技術——配置文件、嵌入式脚本、IaC 代碼、SDK 胶水代碼——均具備左列的特征。這解釋了為什么 AI 在這些领域的代碼生成效果顯著優于業務邏輯代碼。

### 6.2 評估框架

在判断某段代碼是否適合交给 AI 生成時，可以參考以下三个標準：

1. **是否存在現成的規范或 schema？** —— 存在则 AI 友好
2. **是否属于大量重複的模式？** —— 是则 AI 友好
3. **生成結果能否被工具自動验證？** —— 能则 AI 友好

三项均满足的代碼（如從 OpenAPI 規范生成 SDK、用 Terraform 批量定義同構资源），可以高度依賴 AI 生成。三项均不满足的代碼（如設計一个新的分布式一致性協议），仍需要工程师自行完成。

---

## 7. 術語表

| 術語 | 全称 / 中文 | 定義 |
|------|------------|------|
| **DSL** | Domain-Specific Language / 领域特定語言 | 為特定领域設計的語言，與通用編程語言相對 |
| **GPL** | General-Purpose Language / 通用編程語言 | 可解决任意計算問题的編程語言，如 Python、Java、Go |
| **外部 DSL** | External DSL | 擁有独立語法和解析器的领域特定語言，如 SQL、HCL、YAML |
| **內部 DSL** | Internal DSL / Embedded DSL | 寄生在通用編程語言內部、利用宿主語法構建的领域專用表達，如 Pulumi |
| **數據序列化** | Data Serialization | 将內存中的數據結構轉换為可存儲或可傳輸的格式的過程 |
| **INI** | Initialization | 最早期的鍵值對配置格式，起源于 Windows 系统 |
| **CSV** | Comma-Separated Values / 逗号分隔值 | 用逗号分隔字段的纯文本表格格式 |
| **XML** | eXtensible Markup Language / 可擴展標記語言 | 基于標簽的文本數據格式，表達力強但語法冗長 |
| **JSON** | JavaScript Object Notation | 基于鍵值對的輕量數據交换格式，Web API 的事實標準 |
| **YAML** | YAML Ain't Markup Language | 基于缩進的配置文件格式，後端和 DevOps 领域广泛使用 |
| **TOML** | Tom's Obvious Minimal Language | 顯式語法的配置格式，Rust 和 Python 生態常用 |
| **Protobuf** | Protocol Buffers | Google 開發的二進制序列化格式，需预定義 Schema，體积小、速度快 |
| **MessagePack** | — | 類似 JSON 的二進制序列化格式，无需 Schema |
| **Lua** | — | 輕量级嵌入式脚本語言，常用于游戏引擎、Web 服務器和數據庫擴展 |
| **IaC** | Infrastructure as Code / 基础設施即代碼 | 用代碼定義和管理云計算资源的工程實踐 |
| **Terraform** | — | HashiCorp 開發的 IaC 工具，使用 HCL 声明式語言 |
| **HCL** | HashiCorp Configuration Language | Terraform 使用的專用配置語言 |
| **Pulumi** | — | 支持通用編程語言的 IaC 工具 |
| **OpenAPI** | — | 描述 REST API 接口的行業標準規范（前身為 Swagger） |
| **SDK** | Software Development Kit / 軟件開發工具包 | 封装了 API 調用细節的客户端庫 |
| **胶水代碼** | Glue Code | 不含業務邏輯，僅用于連接兩个系统的適配代碼 |

---

## 總結

後端工程中存在大量非業務邏輯代碼。它们有一个共同的上位概念：**DSL（领域特定語言）**——為特定领域設計的、與通用編程語言相對的語言。

本文介绍的 DSL 可以归為四个類別：

1. **數據序列化格式**（XML / JSON / YAML / TOML / CSV / Protobuf 等）—— 纯數據描述型外部 DSL，将結構化數據轉换為可存儲、可傳輸的形式
2. **嵌入式脚本語言**（Lua 等）—— 介于配置與通用語言之間，為宿主程序提供可編程的擴展能力
3. **基础設施定義語言**（HCL / Dockerfile 等）—— 声明式外部 DSL，描述系统期望狀態；Pulumi 则以內部 DSL 的方式實現同一目標
4. **接口描述語言與胶水代碼生成**（OpenAPI / .proto）—— 通過規范描述自動生成系统間的連接代碼

理解 DSL 這一分類框架後，面對後端项目中各類"不像代碼的代碼"時，可以快速識別其性质：它属于哪類 DSL、解决什么领域的問题、為什么不用通用編程語言來写。

同時，由于 DSL 代碼具有高度模式化、規范驅動、可自動验證的特征，它们也是当前 AI 代碼生成技術最有效的應用领域。
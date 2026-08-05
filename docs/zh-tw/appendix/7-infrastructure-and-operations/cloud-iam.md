# 雲端身分與權限管理原理
> **學習指南**：提示詞工程解決的是「怎麼把話說清楚」，雲端帳號權限管理解決的是「誰能做什麼事」。本章節會圍繞一個問題展開：**在雲端世界裡，如何既能方便地授權，又不把鑰匙交給不該給的人？**

在開始之前，建議你先補兩塊「基礎磚」：

- **Token 是什麼**：可以先閱讀 [大型語言模型入門](../8-artificial-intelligence/llm-principles.md) 的「分詞 & Token」部分。
- **Prompt 是什麼**：如果你還不熟悉 System / User / Assistant 的基本結構，可以先看 [提示詞工程](../8-artificial-intelligence/prompt-engineering/)。

---

## 0. 引言：剛上雲端就「踩雷」了的動機

<IamRamComparisonDemo />

很多人剛開始使用雲端服務時都會遇到類似的情況：

- 為了省事，直接把 AccessKey 寫在程式碼裡提交到 GitHub；
- 給所有員工都開了「管理員權限」，結果有人誤刪了生產資料庫；
- 專案交接後，不知道誰手裡還有舊員工的帳號密碼；
- 聽說要開 MFA，但覺得「麻煩」就一直拖著沒開。

直覺上，我們會以為是：**「這些員工安全意識不夠」**。

但大多數時候，問題並不在於人，而在於**沒有建立正確的權限管理體系**。

<IntroProblemReasonSolution />

面對這些挑戰，單純依靠「小心點操作」已經行不通了。我們需要一套系統的權限管理方法論，這正是 **IAM（Identity and Access Management，身分與存取管理）**試圖解決的問題。

---

## 1. 什麼是概述 IAM/RAM

### 1.1 類比：公司的智慧門禁

想像一下，你們公司搬到了一棟新辦公大樓：

| 場景       | 沒有 IAM 的做法                | 有 IAM 的做法                                |
| :--------- | :----------------------------- | :------------------------------------------- |
| 新員工入職 | 給他一把能開所有門的萬能鑰匙   | 給他一張門禁卡，只能刷他辦公區域的門         |
| 員工離職   | 鑰匙丟了就丟了，也不知道誰拿著 | 立即在系統裡登出他的門禁卡，所有門都打不開了 |
| 外包人員   | 把鑰匙借給他幾天               | 發臨時門禁卡，設定 3 天後自動失效              |
| 訪客       | 櫃檯配一把鑰匙給他             | 發一次性訪客碼，只能進會議室                 |

**IAM（Identity and Access Management，身分與存取管理）**，就像是這套「智慧門禁系統」：

- **身分（Identity）**：誰？員工、外包、訪客、應用程式
- **存取（Access）**：能進哪些門？能做什麼操作？
- **管理（Management）**：怎麼發鑰匙、怎麼收鑰匙、怎麼查記錄

### 1.2 AWS IAM vs 阿里雲 RAM

<IamRamComparisonDemo />

不同的雲端廠商都有自己的 IAM 實作：

| 雲端廠商     | 服務名稱                             | 核心概念                  |
| :--------- | :----------------------------------- | :------------------------ |
| **AWS**    | IAM (Identity and Access Management) | User、Group、Role、Policy |
| **阿里雲** | RAM (Resource Access Management)     | 使用者、使用者群組、角色、策略  |
| **騰訊雲** | CAM (Cloud Access Management)        | 使用者、使用者群組、角色、策略  |
| **華為雲** | IAM                                  | 使用者、使用者群組、委託、策略  |
| **Azure**  | Azure AD + RBAC                      | User、Group、Role、RBAC   |

雖然名字不同，但**核心概念都是相通的**：

- **使用者（User）**：代表一個具體的人或應用程式
- **使用者群組（Group）**：批次管理一批使用者的權限
- **角色（Role）**：定義一組權限，可以被「擔任」
- **策略（Policy）**：具體的權限規則（允許/拒絕做什麼）

---

## 2. 使用者、群組、角色：的選型決策方法

### 2.1 三種「身分」的區別

<IdentityProviderDemo />

用一個辦公室的場景來類比：

| 概念                | 類比                           | 適用場景             | 特點                               |
| :------------------ | :----------------------------- | :------------------- | :--------------------------------- |
| **使用者（User）**    | 正式員工，有自己的座位和門禁卡 | 長期、穩定的團隊成員 | 有永久憑證（密碼、AK/SK）          |
| **使用者群組（Group）** | 部門，如「技術部」、「銷售部」     | 批次管理權限         | 不能登入，只是權限容器             |
| **角色（Role）**    | 臨時訪客證、外包臨時卡         | 臨時授權、跨帳號存取 | 沒有永久憑證，靠「擔任」取得暫時性憑證 |

### 2.2 真實案例：一間新創公司的權限演進

**階段一：創始團隊（2-3 人）**

```
問題：直接用根帳號（Root Account）登入主控台，因為「省事」
風險：根帳號擁有所有權限，一旦洩露整個帳號就廢了
```

**階段二：團隊擴張（5-10 人）**

```
改進：給每個人建立 IAM User，分配不同權限
問題：
- 維運小王離職了，他的 AK/SK 散落在哪些伺服器上？
- 新來的前端需要 S3 唯讀權限，後端需要 RDS 權限，手動一個個配太麻煩
```

**階段三：規範化（10-30 人）**

```
改進：
1. 按角色建立 IAM Group：
   - Developers（開發）：S3、EC2、RDS 讀寫
   - DevOps（維運）：全權限，但需要 MFA
   - ReadOnly（唯讀）：檢視所有資源，不能修改
   - QAs（測試）：測試環境資源存取

2. 使用 IAM Role：
   - EC2 執行個體使用 Instance Profile，不再在伺服器上放 AK/SK
   - 跨帳號存取用 Role Assume，不用共享 AK/SK
   - CI/CD 用 OIDC Federation，不用儲存長期憑證
```

**階段四：多帳號/企業級（30 人+）**

```
架構：
- Master Account（主帳號）：只用來管理帳單和組織結構，不放任何資源
- Audit Account（稽核帳號）：收集所有帳號的日誌
- Dev Account（開發帳號）：開發環境
- Staging Account（預發布帳號）：測試環境
- Prod Account（生產帳號）：線上環境，權限最嚴格

權限流轉：
- 開發人員預設只有 Dev 帳號的唯讀權限
- 需要修改生產環境時，提工單申請 Assume 到 Prod 的臨時 Role
- 所有 Assume 操作都被 CloudTrail 記錄，定期稽核
```

---

## 3. 角色與策略：權限管理的「靈魂」

### 3.1 角色的本質：信任 + 權限

<RolePolicyDemo />

IAM Role 有兩個核心組成部分：

1. **信任策略（Trust Policy）**：誰可以擔任這個角色？
2. **權限策略（Permission Policy）**：擔任成功後能做什麼？

用一個話劇表演的類比：

| 概念                  | 類比                   | 說明                                                                                       |
| :-------------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| **Role（角色）**      | 劇本裡的「哈姆雷特」     | 定義了要演什麼戲（權限）                                                                   |
| **Trust Policy**      | 導演說「誰能演哈姆雷特」 | 可能是「本劇團的演員」（本帳號使用者）、「隔壁劇團借來的演員」（跨帳號）、「特邀嘉賓」（外部 IdP） |
| **Permission Policy** | 劇本內容               | 哈姆雷特能做什麼：說台詞、決鬥、發瘋（具體權限）                                           |
| **Assume Role**       | 演員上台表演           | 小李被導演選中演哈姆雷特，上台後他就擁有了劇本裡定義的所有權限                             |
| **暫時性憑證**          | 演出證                 | 小李拿到一個「臨時演出證」，演出結束後就失效了                                               |

### 3.2 策略（Policy）：權限的「語法」

<PermissionHierarchyDemo />

IAM Policy 是一個 JSON 文件，定義了「誰能對什麼資源做什麼操作」。

**一個完整的 Policy 範例**：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowS3ReadWrite",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::my-app-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "ap-northeast-1"
        },
        "Bool": {
          "aws:MultiFactorAuthPresent": "true"
        }
      }
    },
    {
      "Sid": "DenySensitiveData",
      "Effect": "Deny",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::my-app-bucket/sensitive/*"
    }
  ]
}
```

**關鍵欄位解釋**：

| 欄位          | 含義                               | 範例                     |
| :------------ | :--------------------------------- | :----------------------- |
| **Version**   | Policy 語法版本                    | "2012-10-17"             |
| **Statement** | 權限聲明陣列，可包含多個規則       | [...]                    |
| **Sid**       | 聲明 ID，可選，用於識別這條規則    | "AllowS3ReadWrite"       |
| **Effect**    | 效果：Allow（允許）或 Deny（拒絕） | "Allow"                  |
| **Action**    | 允許/拒絕的操作，支援萬用字元        | "s3:GetObject", "s3:\*"  |
| **Resource**  | 作用的資源，用 ARN 識別            | "arn:aws:s3:::bucket/\*" |
| **Condition** | 可選，滿足特定條件時才生效         | 區域限制、MFA 要求等     |

### 3.3 權限的優先順序：Deny > Allow > 預設拒絕

IAM 的權限評估邏輯可以用一句話總結：**明確 Deny 永遠贏，沒有 Allow 就是拒絕**。

評估流程如下：

```
1. 先看有沒有 Deny 策略
   ├─ 有 Deny → 拒絕（不管有沒有 Allow）
   └─ 沒有 Deny → 繼續看

2. 再看有沒有 Allow 策略
   ├─ 有 Allow → 允許
   └─ 沒有 Allow → 拒絕（預設拒絕原則）
```

**實戰案例：保護敏感資料**

```json
// 策略1：給開發者的普通權限
{
  "Effect": "Allow",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/*"
}

// 策略2：保護敏感目錄（即使開發者有 s3:* 也不能存取）
{
  "Effect": "Deny",
  "Action": ["s3:*"],
  "Resource": "arn:aws:s3:::company-data/sensitive/*"
}
```

**關鍵點**：

- 開發者雖然有 `s3:*` 的 Allow 權限
- 但敏感目錄有明確的 Deny 規則
- Deny 優先順序更高，所以開發者無法存取敏感資料
- 即使開發者是管理員，這個 Deny 也有效（除非是根帳號）

---

## 4. 存取金鑰（AK/SK）：一把需要謹慎保管的「鑰匙」

### 4.1 AK/SK概述

<AccessKeyManagementDemo />

Access Key（存取金鑰）是雲端服務提供的一種長期憑證，用於程式化的 API 呼叫。它由兩部分組成：

| 組成部分              | 名稱         | 作用                       | 類比       |
| :-------------------- | :----------- | :------------------------- | :--------- |
| **Access Key ID**     | 存取金鑰 ID  | 識別你是誰（類似於使用者名稱） | 銀行卡號   |
| **Secret Access Key** | 秘密存取金鑰 | 證明你是你（類似於密碼）   | 銀行卡密碼 |

### 4.2 AK/SK 是「高風險物品」的動機

**真實案例：某新創公司的教訓**

小李是一間新創公司的新進後端工程師。入職第一週，他的任務是除錯一個檔案上傳功能。

```python
# 小李寫的程式碼（有嚴重安全問題！）
import boto3

# 為了方便除錯，直接把 AK/SK 寫在程式碼裡
s3 = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    region_name='ap-northeast-1'
)

def upload_file(file_path, bucket_name, object_name):
    s3.upload_file(file_path, bucket_name, object_name)
    print(f"檔案已上傳到 s3://{bucket_name}/{object_name}")

# 測試上傳
upload_file('./test.jpg', 'my-company-bucket', 'uploads/test.jpg')
```

**一週後發生的事情**：

1. 小李提交程式碼到 GitHub（包括 AK/SK）
2. GitHub 上的程式碼被爬蟲掃描到，AK/SK 被擷取
3. 攻擊者使用這些憑證，在公司帳號裡建立了大量 EC2 執行個體挖礦
4. 月底收到帳單：額外消費 12,000 美元
5. 稽核發現 AK/SK 洩露，小李被約談...

**這個案例告訴我們什麼？**

| 錯誤做法                    | 正確做法                                         |
| :-------------------------- | :----------------------------------------------- |
| 把 AK/SK 硬式編碼在程式碼中     | 使用 IAM Role，讓程式自動取得暫時性憑證            |
| 把 AK/SK 提交到 Git 儲存庫    | 使用 `.gitignore` 忽略組態檔，使用金鑰管理服務 |
| 長期使用同一個 AK/SK 不輪替 | 定期輪替 AK/SK，使用暫時性憑證替代長期憑證         |
| 給 AK/SK 分配過大權限       | 遵循最小權限原則，只授予必要的權限               |

### 4.3 AK/SK 的安全使用指南

**場景一：本機開發**

```bash
# 正確做法：使用 AWS CLI 組態憑證，不寫在程式碼裡
aws configure
# 然後根據提示輸入 Access Key ID 和 Secret Access Key
# 這些資訊會被儲存在 ~/.aws/credentials，權限設定為 600

# 程式碼中不需要任何憑證組態
import boto3
s3 = boto3.client('s3')  # 自動從 ~/.aws/credentials 讀取
```

**場景二：伺服器/EC2**

```python
# 正確做法：使用 IAM Instance Profile
# 1. 建立一個 IAM Role，附加需要的權限（如 S3ReadOnly）
# 2. 建立一個 Instance Profile，關聯這個 Role
# 3. 啟動 EC2 時，選擇這個 Instance Profile

# 程式碼中完全不需要憑證
import boto3
s3 = boto3.client('s3')  # 自動從 EC2 中繼資料服務取得暫時性憑證

# 暫時性憑證會自動輪替，無需擔心過期
```

**場景三：CI/CD 管線**

```yaml
# 正確做法：使用 OIDC Federation（OpenID Connect）
# 以 GitHub Actions 為例：

# 1. 在 AWS 建立 OIDC Identity Provider，信任 GitHub
# 2. 建立一個 IAM Role，信任策略允許 GitHub 的特定儲存庫擔任
# 3. 在 GitHub Actions 中組態

name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write # 關鍵：允許請求 OIDC token
      contents: read
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRole
          aws-region: ap-northeast-1
          # 注意：這裡沒有 Access Key！完全使用暫時性憑證

      - name: Deploy
        run: aws s3 sync ./build s3://my-bucket/
```

**總結：AK/SK 使用的安全層級**

| 安全等級 | 做法                        | 適用場景                  | 風險等級 |
| :------- | :-------------------------- | :------------------------ | :------- |
| 最高     | 使用 IAM Role（無長期憑證） | EC2、Lambda、ECS、CI/CD   | 極低     |
| 高       | 使用 OIDC Federation        | GitHub Actions、GitLab CI | 低       |
| 中       | 使用金鑰管理服務            | 本機開發、小團隊          | 中       |
| 低       | 使用環境變數                | 快速原型、個人專案        | 高       |
| 極低     | 硬式編碼在程式碼中              | 任何場景都不推薦          | 極高     |

---

## 5. 多因素驗證（MFA）：給你的帳號加把「鎖」

### 5.1 什麼是概述 MFA

<MfaSecurityDemo />

MFA（Multi-Factor Authentication，多因素驗證），也叫 2FA（Two-Factor Authentication，雙因素驗證），是一種安全機制，要求使用者在登入時提供**兩種或以上**不同類型的驗證因素：

| 因素類型                   | 是什麼             | 例子           |
| :------------------------- | :----------------- | :------------- |
| **知識因素**（你知道什麼） | 只有使用者知道的資訊 | 密碼、PIN 碼   |
| **持有因素**（你有什麼）   | 使用者擁有的實體裝置 | 手機、硬體金鑰 |
| **生物因素**（你是什麼）   | 使用者的生物特徵     | 指紋、臉部辨識 |

### 5.2 MFA 這麼重要的動機

**真實資料告訴你答案**：

| 攻擊方式                 | 沒有 MFA 時的成功率 | 有 MFA 時的成功率               |
| :----------------------- | :------------------ | :------------------------------ |
| 密碼猜測/暴力破解        | 很高                | 極低（還需要第二因素）          |
| 釣魚攻擊取得密碼         | 很高                | 極低（釣魚頁面無法取得 MFA 碼） |
| 密碼洩露（其他網站洩露） | 很高                | 極低（不知道第二因素）          |

**微軟安全報告（2020）**：啟用 MFA 可以阻止 **99.9%** 的自動化攻擊。

### 5.3 MFA 實戰：為 AWS 根帳號開啟 MFA

**步驟一：登入 AWS 主控台**

1. 使用根帳號電子郵件和密碼登入
2. 在右上角點擊你的帳號名稱，選擇 "Security Credentials"

**步驟二：啟用 MFA**

1. 找到 "Multi-factor authentication (MFA)" 區域
2. 點擊 "Assign MFA device"
3. 選擇 MFA 裝置類型（推薦"Authenticator app"）

**步驟三：組態虛擬 MFA**

1. 在手機上安裝 Google Authenticator 或 Microsoft Authenticator
2. 掃描 QR 碼或手動輸入金鑰
3. 輸入 App 上顯示的 6 位驗證碼（連續輸入兩個，因為驗證碼每 30 秒重新整理）

**完成！** 你的根帳號現在有了 MFA 保護。

---

## 6. 跨帳號存取：安全地「串門」的方法

### 6.1 需要跨帳號存取的動機

<CrossAccountAccessDemo />

隨著業務成長，很多公司會使用**多帳號架構**來隔離不同環境：

| 帳號類型            | 用途                   | 權限要求           |
| :------------------ | :--------------------- | :----------------- |
| **Master Account**  | 組織管理、帳單結算     | 幾乎不使用         |
| **Security Audit**  | 集中收集所有帳號的日誌 | 唯讀存取其他帳號   |
| **Shared Services** | 共享資源（映像儲存庫等） | 其他帳號唯讀存取   |
| **Development**     | 開發環境               | 開發者完全權限     |
| **Staging**         | 測試/預發布環境        | 測試人員權限       |
| **Production**      | 生產環境               | 嚴格限制，需要審批 |

**問題：Shared Services 帳號裡的映像，怎麼讓 Production 帳號的 EC2 拉取？**

- 方案 A：把 AK/SK 寫在 Production 的使用者資料裡 （危險！AK/SK 洩露風險）
- 方案 B：使用跨帳號 Role Assume （推薦！暫時性憑證，自動輪替）

### 6.2 跨帳號 Role Assume 的原理

```
帳號 A（Production）                    帳號 B（Shared Services）
    |                                           |
    |  1. 請求 Assume Role                      |
    |  "我想擔任帳號 B 的 ECRReadRole"          |
    |------------------------------------------>|
    |                                           |
    |                    2. 檢查信任策略         |
    |                    "帳號 A 可以擔任我嗎？" |
    |                                           |
    |  3. 返回暫時性憑證                          |
    |  AccessKeyId, SecretKey, SessionToken    |
    |<------------------------------------------|
    |                                           |
    |  4. 使用暫時性憑證存取 ECR                  |
    |  docker pull 帳號B.dkr.ecr...            |
```

**關鍵點**：

- 暫時性憑證有效期預設 1 小時，最長可組態 12 小時
- 不需要在程式碼裡儲存任何長期憑證
- 信任策略可以限制誰可以擔任這個角色（如指定帳號、指定外部 ID）

### 6.3 實戰：組態跨帳號 ECR 存取

**場景**：Production 帳號的 EC2 需要拉取 Shared Services 帳號的 Docker 映像。

**步驟一：在 Shared Services 帳號建立 IAM Role**

1. 登入 Shared Services 帳號的 AWS 主控台
2. 進入 IAM -> Roles -> Create role
3. 選擇"Another AWS account"
4. 輸入 Production 帳號的 Account ID
5. 可選：勾選"Require external ID"並輸入一個隨機字串（增加安全性）
6. 附加權限：AmazonEC2ContainerRegistryReadOnly
7. 給 Role 命名：CrossAccountECRReadRole

**步驟二：取得 Role ARN**

建立完成後，複製 Role 的 ARN：

```
arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole
```

**步驟三：在 Production 帳號組態 EC2 執行個體**

方式 A：使用 Instance Profile（推薦）

1. 在 Production 帳號建立 IAM Role（EC2 用）
2. 信任策略：信任 EC2 服務
3. 權限策略：允許 Assume 跨帳號 Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole"
    }
  ]
}
```

4. 建立 Instance Profile，關聯這個 Role
5. 啟動 EC2 時，選擇這個 Instance Profile

方式 B：在 EC2 使用者資料裡動態 Assume Role

```bash
#!/bin/bash
# 安裝 AWS CLI
yum install -y aws-cli

# Assume 跨帳號 Role
CREDS=$(aws sts assume-role \
  --role-arn arn:aws:iam::SHARED_SERVICES_ACCOUNT_ID:role/CrossAccountECRReadRole \
  --role-session-name EC2PullSession)

# 擷取暫時性憑證
export AWS_ACCESS_KEY_ID=$(echo $CREDS | jq -r '.Credentials.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDS | jq -r '.Credentials.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDS | jq -r '.Credentials.SessionToken')

# 登入 ECR
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com

# 拉取映像
docker pull SHARED_SERVICES_ACCOUNT_ID.dkr.ecr.ap-northeast-1.amazonaws.com/my-app:latest
```

**步驟四：測試跨帳號存取**

在 Production 的 EC2 上執行：

```bash
# 測試能否 Assume Role
aws sts get-caller-identity
# 應該顯示：arn:aws:sts::PRODUCTION_ACCOUNT_ID:assumed-role/CrossAccountECRReadRole/EC2PullSession

# 測試能否列出 Shared Services 的 ECR 儲存庫
aws ecr describe-repositories --registry-id SHARED_SERVICES_ACCOUNT_ID
```

**完成！** 現在 Production 的 EC2 可以安全地拉取 Shared Services 的映像，而無需共享任何長期憑證。

---

## 7. 實戰：建構安全的權限體系

### 7.1 從零開始搭建權限架構

<BestPracticesDemo />

假設你是一個 10 人新創公司的技術負責人，需要從零設計 AWS 權限架構。以下是推薦的實施步驟：

**階段一：根帳號保護（第 1 天）**

```
目標：保護根帳號，這是最重要的帳號

1. 啟用根帳號 MFA（必須）
   - 推薦硬體 MFA（YubiKey），或者 Google Authenticator

2. 建立 IAM 管理員帳號
   - 使用者名稱：admin（或你的名字）
   - 權限：AdministratorAccess（但後續會收緊）
   - 啟用 MFA

3. 刪除根帳號的 Access Key（如果建立了的話）
   - 根帳號永遠不應該有 AK/SK

4. 組態根帳號使用警示
   - 使用 CloudWatch + SNS，一旦根帳號登入就發電子郵件/簡訊
```

**階段二：團隊權限分組（第 1 週）**

```
目標：給團隊成員分組，批次管理權限

1. 分析團隊角色：
   - 後端開發（2人）
   - 前端開發（1人）
   - 行動端開發（1人）
   - 產品經理（1人）
   - 設計師（1人）
   - 創辦人/管理員（3人）

2. 建立 IAM Groups：

   Group: Developers
   ├── 成員：所有開發（後端、前端、行動端）
   ├── 權限：
   │   ├── EC2: 啟動、停止、檢視（但不能刪除別人的執行個體）
   │   ├── S3: 讀寫開發環境的儲存貯體
   │   ├── RDS: 唯讀權限（不能修改生產資料庫）
   │   └── CloudWatch: 檢視日誌
   └── 限制：只能操作 ap-northeast-1 區域

   Group: ProductTeam
   ├── 成員：產品經理、設計師
   ├── 權限：
   │   ├── S3: 唯讀（檢視資料檔案）
   │   ├── CloudWatch Dashboard: 檢視監控圖表
   │   └── Cost Explorer: 檢視帳單（但不能修改）
   └── 限制：唯讀權限，不能修改任何資源

   Group: Administrators
   ├── 成員：創辦人、技術負責人
   ├── 權限：AdministratorAccess
   └── 要求：必須使用 MFA 才能操作

3. 給每個人建立 IAM User，加入對應的 Group
   - 不要給個人直接附加權限，一律透過 Group 管理
   - 啟用 MFA（強制要求）
```

**階段三：應用層權限最佳化（第 2-4 週）**

```
目標：讓應用程式安全地存取 AWS 資源

1. EC2 執行個體使用 Instance Profile
   - 不再在伺服器上組態 AK/SK
   - 建立 IAM Role，附加需要的權限（如 S3 讀寫）
   - 建立 Instance Profile，關聯這個 Role
   - 啟動 EC2 時選擇這個 Instance Profile
   - 應用程式碼中直接使用 boto3，無需組態憑證

2. 如果必須使用 AK/SK（第三方整合）
   - 使用 AWS Secrets Manager 儲存 AK/SK
   - 應用啟動時從 Secrets Manager 讀取
   - 設定定期輪替（90天）
   - 監控 AK/SK 的使用情況

3. 組態 CloudTrail 記錄所有 API 呼叫
   - 建立單獨的 S3 儲存貯體儲存日誌
   - 設定日誌檔案校驗（防止竄改）
   - 組態 SNS 通知關鍵事件（如根帳號使用、策略變更）
```

**階段四：安全加固（持續）**

```
目標：建立持續的安全監控和改進機制

1. 啟用 AWS Config
   - 監控資源組態變更
   - 檢查合規性（如安全群組是否開放了 0.0.0.0/0）

2. 啟用 IAM Access Analyzer
   - 持續分析資源策略
   - 識別外部存取（如 S3 儲存貯體是否公開）

3. 定期審查 IAM 組態
   - 每月檢查一次未使用的 IAM User、Role
   - 檢查 Access Key 的使用情況
   - 驗證 Group 成員是否合理

4. 建立安全事件回應流程
   - 如果發現 AK/SK 洩露：立即刪除、輪替、稽核影響範圍
   - 如果發現異常 API 呼叫：立即調查、限制權限
```

---

## 8. 常見誤區與避坑指南

### 8.1 十大 IAM 反模式

| #   | 反模式                       | 為什麼不好                                     | 正確做法                                         |
| :-- | :--------------------------- | :--------------------------------------------- | :----------------------------------------------- |
| 1   | 使用根帳號進行日常操作       | 根帳號擁有所有權限，一旦洩露無法限制損害       | 建立 IAM 管理員帳號，根帳號僅在必要時使用        |
| 2   | 給所有人 AdministratorAccess | 違反最小權限原則，增加誤操作和內部威脅風險     | 按角色分組，只授予必要的權限                     |
| 3   | 在程式碼中硬式編碼 AK/SK         | AK/SK 容易透過 GitHub 洩露，且難以輪替         | 使用 IAM Role、環境變數或金鑰管理服務            |
| 4   | 長期不輪替 AK/SK             | 增加憑證洩露後的風險曝露時間                   | 設定 90 天輪替策略，或更好的——使用暫時性憑證       |
| 5   | 忽略 MFA                     | 密碼洩露後帳號直接淪陷                         | 為所有 IAM 使用者啟用 MFA，尤其是高權限使用者        |
| 6   | 不使用 CloudTrail            | 無法稽核誰做了什麼操作，出事後無法溯源         | 啟用 CloudTrail，並將日誌儲存到獨立的稽核帳號    |
| 7   | IAM Policy 過於寬鬆          | 如 `Resource: "*"`、`Action: "*"`，增加攻擊面  | 明確指定資源 ARN 和具體 Action                   |
| 8   | 不清理離職員工的 IAM User    | 殭屍帳號可能成為後門                           | 建立離職流程，立即停用並刪除 IAM User            |
| 9   | 不使用 IAM Access Analyzer   | 無法發現過度寬鬆的資源策略（如公開 S3 儲存貯體） | 啟用 IAM Access Analyzer，定期檢查外部存取       |
| 10  | 不在測試環境驗證 Policy      | 直接在生產環境應用 Policy，可能導致服務中斷    | 使用 IAM Policy Simulator 測試，先在測試環境驗證 |

---

## 9. 名詞對照表

| 英文術語                                 | 中文對照        | 解釋                                       |
| :--------------------------------------- | :-------------- | :----------------------------------------- |
| **IAM (Identity and Access Management)** | 身分與存取管理  | 雲端服務中管理使用者身分和存取權限的服務       |
| **RAM (Resource Access Management)**     | 資源存取管理    | 阿里雲的 IAM 服務名稱                      |
| **Root Account**                         | 根帳號          | 註冊雲端帳號時建立的擁有者帳號，擁有最高權限 |
| **IAM User**                             | IAM 使用者/子帳號 | 由根帳號建立的子身分，用於日常操作         |
| **IAM Role**                             | IAM 角色        | 臨時性權限載體，無長期憑證，需要被「擔任」   |
| **IAM Policy**                           | IAM 策略        | JSON 格式的權限規則定義                    |
| **ARN**                                  | Amazon 資源名稱  | 全域唯一的資源識別碼                       |
| **AK/SK**                                | 存取金鑰/金鑰   | 程式存取雲端 API 的憑證                      |
| **STS**                                  | 安全權杖服務    | 提供臨時安全憑證的服務                     |
| **MFA**                                  | 多因素驗證      | 需要兩個或以上因素的驗證方式               |
| **SSO**                                  | 單一登入        | 使用者一次登入即可存取多個系統的驗證方式     |
| **ExternalId**                           | 外部 ID         | 用於防止混淆代理人攻擊的安全識別碼           |
| **CloudTrail**                           | 雲端稽核服務      | 記錄雲端帳號中所有 API 呼叫和操作的日誌服務  |

---

## 總結：雲端帳號權限管理的核心原則

雲端帳號權限管理不是一蹴可幾的，而是需要根據團隊規模和業務需求持續演進：

1. **起步階段**（1-10 人）：
   - 保護根帳號（MFA + 不用根帳號日常操作）
   - 建立 IAM 管理員帳號
   - 基本的分組（Developers、Admins）

2. **成長階段**（10-50 人）：
   - 細化的權限分組（前後端、維運、產品等）
   - 使用 IAM Role 替代 AK/SK
   - 啟用 CloudTrail 稽核
   - 定期權限審查

3. **成熟階段**（50 人以上 / 多帳號）：
   - 多帳號架構（Dev、Staging、Prod 分離）
   - 集中式日誌稽核帳號
   - 自動化權限審查和警示
   - 完善的權限申請和審批流程

**核心原則記住三句話**：

1. **最小權限原則**：只給必要的權限，不要給 AdministratorAccess
2. **不用長期憑證**：優先使用 IAM Role 和暫時性憑證，避免 AK/SK 洩露
3. **啟用 MFA**：特別是根帳號和高權限帳號，這是最有效的安全措施

---

> **延伸閱讀**：
>
> - [AWS IAM 官方文件](https://docs.aws.amazon.com/iam/)
> - [阿里雲 RAM 官方文件](https://www.aliyun.com/product/ram)
> - [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
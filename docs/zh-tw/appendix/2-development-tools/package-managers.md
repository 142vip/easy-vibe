# 套件管理器導論

> 💡 **學習指南**：寫程式不必從零造輪子——99% 的功能已經有人寫好並發佈到網路上了。**套件管理器**就是那個幫你找到、下載並管理這些「現成零件」的工具。本章圍繞一個核心問題展開：**如何讓程式碼依賴變得可重現、可協作、可維護？**

---

## 0. 你一定會用到套件管理器的動機

想像你要寫一個能發 HTTP 請求的 Node.js 程式。有兩條路：

- **方法 A（手動）**：自己實作 TCP 連線、HTTP 協定解析、重新導向處理、逾時機制……估計要寫幾千行程式碼，除錯幾個月。
- **方法 B（套件管理器）**：`npm install axios`，十秒鐘，一行程式碼搞定。

套件管理器本質上是**程式碼的「應用商店」**。它幫你：

1. 在中央儲存庫（Registry）裡找到別人發佈的函式庫
2. 自動下載並安裝到你的專案裡
3. 處理這個函式庫自己依賴的其他函式庫（依賴的依賴）
4. 記錄你用的是哪個精確版本，讓團隊協作不出問題

---

## 1. 各語言 / 系統生態的套件管理器一覽

不同程式語言和作業系統有各自的生態工具鏈，但底層邏輯完全一致。

👇 **動手試試看**：選擇你熟悉的生態，探索它的主流套件管理工具。

<PackageManagerOverviewDemo />

### 1.1 套件的取得管道： Registry（註冊表）

每個生態背後都有一個中央儲存庫，存放所有可下載的套件：

| 生態 | 註冊表 | 套件數量 |
| :--- | :--- | :--- |
| JavaScript | [npmjs.com](https://npmjs.com) | 200 萬+ |
| Python | [pypi.org](https://pypi.org) | 50 萬+ |
| Rust | [crates.io](https://crates.io) | 15 萬+ |
| Go | [pkg.go.dev](https://pkg.go.dev) | 50 萬+ |
| macOS/Linux 工具 | [formulae.brew.sh](https://formulae.brew.sh) | 7000+ |
| Windows 軟體 | [winget.run](https://winget.run) / [chocolatey.org](https://chocolatey.org) | 數萬款 |

### 1.2 JavaScript 三強對比：npm vs yarn vs pnpm

功能相近，區別主要體現在**速度和磁碟佔用**：

```text
磁碟佔用：pnpm（硬連結共享）< yarn PnP（零 node_modules）< npm（完整複製）
安裝速度：pnpm ≈ yarn > npm
使用習慣：npm（最通用）> pnpm（新專案推薦）> yarn（部分團隊）
```

**推薦**：新專案用 `pnpm`，已有專案維持原有工具，不要隨意切換。

### 1.3 Windows 三強對比：winget vs Chocolatey vs Scoop

| | winget | Chocolatey | Scoop |
| :--- | :--- | :--- | :--- |
| **官方背書** | Microsoft 官方 | 第三方 | 第三方 |
| **需要管理員** | 部分需要 | 是 | **不需要** |
| **適合場景** | 日常軟體安裝 | 企業批量部署 | 開發工具管理 |
| **套件數量** | 多且成長快 | 最多（10000+）| 聚焦開發工具 |

**推薦**：日常用 `winget`，開發工具用 `scoop`，企業自動化用 `Chocolatey`。

---

## 2. 安裝套件 —— 背後發生了的範圍界定

輸入 `npm install axios` 後，命令列安靜了幾秒，然後就好了。這幾秒裡到底發生了什麼？

👇 **動手試試看**：選擇一個套件，點擊「執行」，觀察安裝的全過程。

<PackageInstallDemo />

### 2.1 四個階段詳解

**① 依賴解析（Resolve）**

套件管理器先「讀懂」你要裝什麼。以 `axios` 為例，它自己依賴 `follow-redirects`、`form-data` 等套件，這些也都要安裝。這個過程叫做**建構依賴樹**。

**② 下載（Fetch）**

從 Registry 下載所有需要的套件（`.tgz` 格式的壓縮檔）。聰明的套件管理器會：
- 並行下載多個套件，而不是一個個等待
- 先查本地快取，命中就不走網路

**③ 連結（Link）**

把下載的套件解壓放到 `node_modules/` 目錄，並處理好引用關係。

**④ 寫鎖定檔（Lockfile）**

把這次安裝的**精確版本號**寫入 `package-lock.json`（或 `yarn.lock` / `pnpm-lock.yaml`）。

### 2.2 最常用指令速查

```bash
# ── JavaScript (npm) ──────────────────────────────────
npm install              # 按 package.json 安裝所有依賴
npm install axios        # 安裝新套件（生產依賴）
npm install -D jest      # 安裝開發依賴（只在開發時用）
npm install -g tsx       # 全域安裝（任何目錄都能用）
npm uninstall axios      # 解除安裝套件
npm update               # 升級所有套件到相容的最新版
npm run build            # 執行 package.json scripts 裡的腳本
npx create-react-app .   # 臨時執行，不安裝到專案

# ── Python (pip) ──────────────────────────────────────
pip install requests           # 安裝套件
pip install requests==2.28.0   # 安裝指定版本
pip freeze > requirements.txt  # 匯出目前依賴清單
pip install -r requirements.txt # 按清單安裝

# ── Rust (cargo) ──────────────────────────────────────
cargo add serde    # 新增依賴（會自動更新 Cargo.toml）
cargo build        # 建構專案
cargo test         # 執行測試
cargo run          # 執行專案

# ── Go (go mod) ───────────────────────────────────────
go get github.com/gin-gonic/gin  # 新增依賴
go mod tidy                      # 整理依賴（刪多餘、補缺失）
go build ./...                   # 建構

# ── Windows (winget) ──────────────────────────────────
winget install Git.Git           # 安裝軟體
winget upgrade --all             # 更新所有已安裝軟體
```

### 2.3 npm scripts概述

`package.json` 裡有一個 `scripts` 欄位，這是 npm 內建的**任務執行器**：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "jest",
    "lint": "eslint src/"
  }
}
```

執行方式：`npm run dev`、`npm run build`。這樣做的好處是：
- **統一入口**：團隊成員不需要記住底層工具的具體指令
- **環境自動設定**：執行時會自動把 `node_modules/.bin` 加入 PATH，可以直接用本地安裝的工具

---

## 3. 全域安裝 vs 本地安裝

這是新手最容易困惑的概念之一。

### 3.1 兩者的區別

```bash
npm install axios        # 本地安裝：裝到 ./node_modules/，只有目前專案能用
npm install -g typescript  # 全域安裝：裝到系統目錄，任何專案/目錄都能用
```

| | 本地安裝 | 全域安裝 |
| :--- | :--- | :--- |
| **存放位置** | `./node_modules/` | 系統級目錄（如 `/usr/local/lib/`） |
| **適合** | 專案依賴的函式庫（axios、vue、react） | 命令列工具（tsc、eslint、create-react-app） |
| **版本隔離** | 每個專案獨立版本 ✅ | 全機共用一個版本 ⚠️ |
| **團隊一致性** | 鎖定檔保證一致 ✅ | 各人版本可能不同 ⚠️ |

### 3.2 黃金法則

> **函式庫依賴（axios、lodash、vue）永遠本地安裝；
> 命令列工具（tsc、eslint）優先本地安裝，用 `npx` 呼叫。**

**為什麼命令列工具也推薦本地安裝？**

假設你全域安裝了 `eslint@8`，但專案 A 需要 `eslint@9` 的新規則，你就要在全域和專案之間反覆切換。把 `eslint` 裝到本地，用 `npx eslint .` 呼叫，每個專案都能獨立設定自己的版本。

### 3.3 npx —— 臨時執行，不污染環境

`npx` 是 npm 自帶的工具執行器，允許你**不安裝直接執行**一個套件：

```bash
#不安裝 create-vue，直接執行它來初始化專案
npx create-vue my-project

# 不安裝 prettier，直接格式化檔案
npx prettier --write src/

# 強制使用指定版本（忽略已安裝的）
npx typescript@5.4 tsc --version
```

Python 的 `uvx`、Rust 的 `cargo run` 也提供了類似的「臨時執行」能力：

```bash
uvx ruff check .       # Python：臨時執行 ruff 檢查器
cargo install ripgrep  # Rust：安裝到全域，變成系統命令 rg
```

---

## 4. 版本號的祕密 —— 語意化版本

你在 `package.json` 裡會看到這樣的內容：

```json
{
  "dependencies": {
    "axios": "^1.6.8",
    "typescript": "~5.4.0"
  }
}
```

這裡的 `^` 和 `~` 是什麼意思？

👇 **動手試試看**：滑鼠懸停版本號各個部分，理解含意；點擊範圍符號，看哪些版本會被接受。

<DependencyTreeDemo />

### 4.1 不鎖死版本的動機

| 做法 | 優點 | 缺點 |
| :--- | :--- | :--- |
| `"axios": "1.6.8"`（精確鎖定） | 完全可預測 | 安全修補程式無法自動更新 |
| `"axios": "^1.6.8"`（相容範圍，推薦） | 自動取得 bug 修復和新功能 | 極少情況下引入小不相容 |
| `"axios": "*"`（任意版本） | 總是最新 | 主版本升級會徹底破壞程式碼 |

**最佳實踐**：用 `^` 宣告範圍 + 鎖定檔固定實際版本，兩者配合使用。

### 4.2 依賴地獄概述

當你依賴 50 個套件，每個套件又依賴若干套件，「依賴樹」可能有幾百個節點。如果兩個你依賴的套件需要**同一個函式庫的不相容版本**，就產生了「依賴衝突」。

各生態的解法：
- **npm v3+**：同主版本提升到頂層共享，不同主版本各自安裝一份
- **pnpm**：硬連結 + 嚴格隔離，從根本上防止「幽靈依賴」（沒宣告卻能用的套件）
- **cargo（Rust）**：語言層面強制每個套件只能依賴同一版本，徹底規避衝突
- **go mod（Go）**：最小版本選擇（MVS）策略，選能滿足所有約束的最低版本

---

## 5. 鎖定檔 —— 團隊協作的基石

### 5.1 需要鎖定檔的動機

假設 `package.json` 寫的是 `"axios": "^1.6.0"`：

- 你今天安裝 → 裝到 `1.6.8`
- 隊友明天安裝 → 可能裝到 `1.7.0`（昨晚剛發佈）
- CI 伺服器下週 → 可能裝到 `1.7.1`

同樣的程式碼，三個人跑出不同結果。**鎖定檔**記錄每個套件的精確版本，所有人按它安裝，結果完全一致。

| 場景 | 指令 | 行為 |
| :--- | :--- | :--- |
| 開發環境同步 | `npm install` | 參考鎖定檔安裝，不升級版本 |
| CI / 正式部署 | `npm ci` | **嚴格**按鎖定檔安裝，有差異直接報錯 |
| 主動升級版本 | `npm update` | 在允許範圍內升級，並更新鎖定檔 |

### 5.2 鎖定檔的提交到 Git合規性判定

**應用程式必須提交，發佈到 npm 的函式庫可以不提交。**

- ✅ **Web 應用、後端服務**：必須提交，確保部署環境和開發環境完全一致
- ❌ **npm 發佈的函式庫**：通常不提交，函式庫的使用者有自己的鎖定檔
- ✅ **Python 專案**：`requirements.txt` 本身就起鎖定檔作用，應該提交
- ✅ **Go 專案**：`go.sum` 必須提交，用於完整性校驗

---

## 6. Python 虛擬環境

Python 有一個特別需要注意的概念：**虛擬環境（venv）**。

**為什麼需要？**

Python 預設**全域**安裝套件。你的專案 A 需要 `requests==2.28`，專案 B 需要 `requests==2.31`，兩者會互相衝突。

**解決方案**：為每個專案建立獨立的虛擬環境，互不干擾。

```bash
# 1. 建立虛擬環境（在專案根目錄執行）
python -m venv .venv

# 2. 啟動虛擬環境
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows（命令提示字元 CMD）
.venv\Scripts\Activate.ps1       # Windows（PowerShell）

# 3. 啟動後，pip install 只影響目前虛擬環境，不污染全域
pip install requests

# 4. 退出虛擬環境
deactivate
```

> ⚠️ **Windows 常見問題**：PowerShell 預設禁止執行腳本，需先執行：
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

**現代替代方案**：
- `conda create -n myproject python=3.11` —— 連 Python 版本都一起管理
- `uv venv && source .venv/bin/activate` —— Rust 寫的，建立速度飛快

**`.venv` 要提交到 Git 嗎？**

不要！`.venv` 是本機產生的，應加入 `.gitignore`。用 `requirements.txt` 或 `pyproject.toml` 來描述依賴。

---

## 7. 常見問題速查

**Q: `node_modules` 要提交到 Git 嗎？**

不要！通常有幾百 MB，應該加入 `.gitignore`。有了 `package-lock.json`，任何人都能 `npm install` 快速重建。

**Q: 安裝失敗 / 出現奇怪報錯怎麼辦？**

```bash
# 清空快取，刪除舊安裝，重來
npm cache clean --force
rm -rf node_modules package-lock.json   # macOS/Linux
rmdir /s /q node_modules && del package-lock.json  # Windows CMD
npm install
```

**Q: 安裝速度太慢？**

```bash
# 切換到國內鏡像（推薦寫入 .npmrc 檔案，不污染全域）
echo "registry=https://registry.npmmirror.com" > .npmrc

# pip 也可以設定鏡像
pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple
```

**Q: 套件有安全漏洞怎麼處理？**

```bash
npm audit          # 掃描已知漏洞
npm audit fix      # 自動修復相容的漏洞
npm audit fix --force  # 強制升級（可能有破壞性，謹慎用）
```

**Q: 怎麼知道某個套件是否值得信賴？**

在 [npmjs.com](https://npmjs.com) 或 [bundlephobia.com](https://bundlephobia.com) 查看：
- 週下載量（越高越可信）
- 最後更新時間（超過 2 年沒更新要謹慎）
- 依賴數量（依賴越多，引入問題的可能性越大）
- GitHub Stars 和 Issues 活躍度

**Q: Windows 上 winget 安裝的軟體在哪？**

winget 預設安裝到系統目錄（需要管理員）或 `%LOCALAPPDATA%\Microsoft\WindowsApps`。Scoop 安裝的軟體統一在 `%USERPROFILE%\scoop\apps\`，方便管理和遷移。

---

## 8. 名詞對照表

| 英文術語 | 中文對照 | 解釋 |
| :--- | :--- | :--- |
| **Package** | 套件 / 函式庫 | 別人寫好並發佈的程式碼模組 |
| **Registry** | 註冊表 / 儲存庫 | 所有套件的中央儲存伺服器（如 npmjs.com） |
| **Dependency** | 依賴 | 你的專案執行所需要的其他套件 |
| **devDependency** | 開發依賴 | 只在開發階段需要的套件（測試框架、建構工具等） |
| **Lockfile** | 鎖定檔 | 記錄精確版本號，保證環境一致性 |
| **SemVer** | 語意化版本 | MAJOR.MINOR.PATCH 版本命名規範 |
| **node_modules** | 模組目錄 | npm 安裝的套件實際存放的目錄 |
| **venv** | 虛擬環境 | Python 專案的獨立套件隔離沙箱 |
| **tarball** | 壓縮檔 | 套件的分發格式，通常為 `.tgz` 檔案 |
| **Hoisting** | 提升 | npm 將子依賴提升到頂層以避免重複安裝 |
| **Phantom Dependency** | 幽靈依賴 | 未在設定檔宣告卻能被使用的套件（pnpm 可防止） |
| **npx** | — | npm 自帶的套件執行器，臨時執行套件而無需安裝 |
| **go.sum** | — | Go 模組的雜湊校驗檔案，防止依賴被竄改 |
| **Crate** | — | Rust 生態中「套件」的單位名稱 |
| **winget** | — | Windows 官方套件管理器（Windows 10/11 內建） |

---

## 總結：套件管理器的本質

四句話記住核心：

1. **套件管理器 = 應用商店**：幫你找到、安裝、管理程式碼零件，不必重複造輪子。
2. **鎖定檔 = 團隊契約**：固定精確版本，讓「在我的機器上好好的」成為歷史。
3. **語意化版本 = 溝通語言**：`^` 安全地取得更新，MAJOR 變了就要小心。
4. **本地 > 全域**：專案依賴盡量本地安裝，`npx` / `uvx` 臨時執行工具，保持環境純淨。

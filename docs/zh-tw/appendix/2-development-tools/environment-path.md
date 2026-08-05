# 環境變數與 PATH 導論

> 💡 **學習指南**：每次你在終端機輸入 `git` 或 `python`，系統都要去找這個程式在哪裡。每次你的程式呼叫大模型 API，程式要知道用哪個金鑰。這兩件事背後都是同一套機制——**環境變數**。

---

## 0. 每個程式身邊都帶著一組設定

執行中的每個程式，都持有一組「鍵=值」設定，稱為**環境變數**。程式可以隨時讀取這些設定，用來了解目前的執行環境。

點擊下方列表裡的任意變數，在終端機裡「檢視」它的值：

<EnvVarOverviewDemo />

---

## 1. PATH：Shell 怎麼找到你輸入的指令

`PATH` 是一個特殊的環境變數，存著一串目錄路徑（用冒號分隔）。你輸入 `git` 時，Shell 就按這串目錄的順序，一個一個地進去找名叫 `git` 的可執行檔——找到第一個就立刻停止。

```bash
$ echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
```

選擇一個指令，觀察 Shell 逐目錄搜尋的過程：

<PathSearchDemo />

**三個關鍵規律**：
- 目錄在 PATH 裡越靠前，優先級越高
- 找到第一個就停止，不會繼續搜尋
- 所有目錄都沒有 → `command not found`

---

## 2. 安裝工具後要重啟終端機的動機

安裝 nvm、Homebrew、conda 這類工具時，安裝腳本會自動在 `~/.zshrc` 裡追加一行，把自己的目錄加入 PATH：

```bash
# 安裝腳本自動寫入的內容（範例）
export PATH="/usr/local/opt/python@3.12/bin:$PATH"
```

這行程式碼只在**新 Shell 啟動時**才執行。已經開啟的終端機視窗不受影響，所以：

```bash
# 不重啟也能立刻生效
source ~/.zshrc
```

**AI 開發工具常見情況**：

```bash
# Ollama / pipx 裝完報 command not found
which ollama          # 查實際安裝位置

# pip 安裝的 CLI 工具路徑（加入 PATH）
# macOS：~/Library/Python/3.x/bin
# Linux：~/.local/bin
export PATH="$PATH:$HOME/.local/bin"

# 推薦用 pipx 安裝命令列工具，自動管理 PATH
pipx install aider-chat
```

---

## 3. 變數的作用域的可見性範圍界定

環境變數不是廣播給所有程式的——每個行程持有**自己的一份副本**，從父行程繼承而來，修改自己的副本不會影響父行程。

下圖展示三個層級。在「使用者級」裡 export 一個新變數，看它是否出現在「行程級」：

<EnvScopeDemo />

---

## 4. export：決定子行程能不能讀到這個變數

設定變數時，加不加 `export` 是完全不同的兩件事：

<EnvExportDemo />

要讓變數跨會話永久存在，把 `export` 寫入設定檔：

```bash
# macOS (zsh)
echo 'export MY_VAR="value"' >> ~/.zshrc
source ~/.zshrc       # 立刻生效，不用重開終端機

# Linux (bash)
echo 'export MY_VAR="value"' >> ~/.bashrc
source ~/.bashrc
```

---

## 5. API 金鑰：絕對不能寫進程式碼

呼叫 OpenAI、Anthropic、DeepSeek 等 API 時，金鑰就是你的「身分證 + 信用卡」。洩露了，別人可以用你的額度消費，費用由你承擔。

最常見的錯誤是把金鑰直接寫在程式碼裡：

<ApiKeyDangerDemo />

---

## 6. 本地開發：用 .env 檔案管金鑰

本地開發時，把金鑰放在專案根目錄的 `.env` 檔案裡，程式透過 dotenv 函式庫讀取。`.env` 必須加入 `.gitignore`，不能提交到 Git。

左邊寫設定，右邊讀取——切換語言看兩種寫法：

<DotEnvDemo />

---

## 7. 正式環境：讓執行平台注入金鑰

`.env` 是開發階段的便利工具。伺服器和雲端平台上，應該由**執行環境**負責注入金鑰，程式本身完全不感知金鑰放在哪裡：

<ServerSecretDemo />

---

## 8. 實戰排錯

### `command not found`

```bash
# 第一步：確認是否在 PATH 裡
which python3         # 有輸出說明找到了

# 第二步：找到程式實際位置（macOS）
brew list python | grep bin

# 第三步：把目錄加入 PATH
export PATH="/找到的路徑:$PATH"
source ~/.zshrc       # 寫入設定檔後記得 source
```

### 裝了兩個版本，用的不是我想要的

```bash
which python
# /usr/bin/python ← 系統舊版，在 PATH 靠前

# 把新版目錄放到 PATH 最前面
export PATH="/usr/local/bin:$PATH"

which python
# /usr/local/bin/python ← 新版，現在優先了
```

### 變數明明設定了，程式卻讀不到

| 原因 | 解決 |
|:---|:---|
| 忘了 `export` | 加上 `export` 再試 |
| 改了 `~/.zshrc` 沒生效 | `source ~/.zshrc` |
| 用了 `.env` 但沒裝 dotenv | `pip install python-dotenv` / `npm install dotenv` |
| 伺服器上只在 SSH 會話有效 | 改用 systemd `EnvironmentFile` |

---

## 名詞速查

| 術語 | 含意 |
|:---|:---|
| **PATH** | 儲存 Shell 搜尋可執行檔的目錄列表，冒號分隔，順序決定優先級 |
| **export** | 將變數標記為可繼承，子行程啟動時自動獲得副本 |
| **source** | 在目前 Shell 重新執行設定檔，使修改立即生效 |
| **which** | 顯示某指令對應的可執行檔路徑（PATH 搜尋的結果） |
| **.env** | 專案本地設定檔，存開發用金鑰，必須加入 `.gitignore` |
| **.env.example** | 變數名稱完整、值留空的範本，可以安全提交到 Git |
| **chmod 600** | 檔案權限：只有擁有者可讀寫，適合保護金鑰檔案 |
| **Secret Scanner** | GitHub 等平台自動掃描金鑰洩露，發現後通知廠商撤銷 |

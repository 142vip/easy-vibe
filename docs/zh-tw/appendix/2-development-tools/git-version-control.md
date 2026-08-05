# Git 版本控制原理

> 💡 **學習指南**：這一章專門寫給完全沒用過 Git 的人。我們不會一上來就讓你背指令，而是先搞清楚「Git 到底在幫你解決什麼問題」，再一步步把指令和概念串起來。讀完後，你應該能獨立完成：本地提交、建立分支、推送到 GitHub。

---

## 0. 場景引入與問題界定

**場景一：版本地獄**

你寫論文或寫程式，改到一半發現改錯了，想回到三天前的版本——但你找不到了。

```
專案_v1.zip
專案_v2_修改版.zip
專案_v3_最終版.zip
專案_v3_最終版_真的最終版.zip
專案_v3_最終版_打死不改了.zip
```

每次存一個新副本，硬碟越來越亂，而且你根本記不住哪個版本改了什麼。

**場景二：協作噩夢**

你和隊友同時改同一個檔案：
- 你改了第 10 行，新增了登入功能
- 隊友改了第 10 行，修復了一個 Bug
- 你們用電子郵件互傳程式碼，結果合併時一個人的改動被另一個人覆蓋了
- 沒人知道最後哪段程式碼是對的

**場景三：沒有「後悔藥」**

你在正式環境部署了新程式碼，結果出 Bug 了，想緊急回退到上一個穩定版本——但你不知道怎麼回退，只能手忙腳亂地找備份。

---

**Git 就是為了解決這三個問題而生的。**

Git 是一個**版本控制系統**（Version Control System）。它的本質是：**把你每一次「存檔」操作都記錄下來，形成一條完整的歷史時間線，讓你可以隨時回到任意一個歷史節點。**

不誇張地說，Git 是現代軟體開發最重要的工具之一。幾乎所有的公司、所有的開源專案都在用它。

---

## 1. Git 與 GitHub 的區別界定

很多初學者會混淆這兩個概念，先澄清一下：

| | Git | GitHub |
| :--- | :--- | :--- |
| **是什麼** | 一個執行在你電腦上的版本控制工具 | 一個存放 Git 儲存庫的網站（雲端） |
| **在哪裡** | 你的本地電腦 | 網路上 |
| **能獨立使用嗎** | ✅ 可以，只管理本地歷史 | ❌ 需要配合 Git 使用 |
| **類比** | 你本地的日記本 | 存日記的雲端硬碟 |

簡單說：**Git 是工具，GitHub 是託管服務。** 就像 Word 是工具，OneDrive 是雲端硬碟一樣，兩者配合使用，但並不是同一個東西。

除了 GitHub，類似的服務還有 GitLab、Gitee（國內）等。

---

## 2. 核心概念：三個區域

這是整個 Git 最重要的設計，理解了這三個區域，你就理解了 Git 的靈魂。

Git 把你的檔案狀態分成三層：

**工作區（Working Directory）**
就是你的**普通資料夾**，你現在看到的、正在編輯的所有檔案都在這裡。你隨便改，Git 會感知到你改了什麼，但不會做任何記錄。

**暫存區（Staging Area / Index）**
這是一個**「預備提交」的中轉站**。你可以把工作區裡想要儲存的檔案「放進」暫存區，就像把快遞放進快遞盒——還沒寄出去，但已經選好了要寄什麼。

**儲存庫（Repository）**
這是**永久存檔的歷史記錄庫**，藏在 `.git` 資料夾裡。每次你執行 `git commit`，暫存區裡的內容就會被封存進儲存庫，形成一條不可竄改的歷史記錄。

👇 **動手試試看**：依次點擊指令按鈕，觀察檔案在三個區域之間的流轉。

<GitCommitFlow />

### 要「兩步走」（add + commit）的動機

很多初學者會問：為什麼不能直接一鍵儲存，非要先 `add` 再 `commit`？

**因為現實開發中，你經常不想把所有改動都一起提交。**

舉個例子：你今天改了 5 個檔案：
- `login.js`：完成了登入功能（想提交）
- `style.css`：調整了登入頁樣式（想提交）
- `debug.log`：臨時除錯輸出（**不想**提交）
- `experiment.js`：正在測試的新功能，還沒完成（**不想**提交）
- `todo.txt`：你的個人備忘（**不想**提交）

如果沒有暫存區，你要麼把這 5 個檔案全部提交（提交記錄很混亂），要麼一個都不提交。

有了暫存區，你可以精確控制：`git add login.js style.css`，只把這兩個檔案放進快遞盒，然後 `commit`，這次提交就清清楚楚地記錄「登入功能完成」。

---

## 3. 第一次使用 Git：初始化和基礎工作流程

### 3.1 安裝和初始化

安裝好 Git 後（macOS 自帶，Windows 去 git-scm.com 下載），開啟終端機，進入你的專案資料夾：

```bash
# 在目前資料夾初始化一個 Git 儲存庫
git init

# Git 會建立一個隱藏的 .git 資料夾，所有歷史記錄存在裡面
# 輸出：Initialized empty Git repository in .../your-project/.git/
```

第一次使用還需要告訴 Git 你是誰（這個資訊會附在每次提交記錄上）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的電子郵件"
```

### 3.2 日常工作流程：三步存檔

初始化之後，日常開發 90% 的操作就是反覆執行這三步：

**第一步：檢視狀態**

```bash
git status
```

這是你用得最多的指令，沒有之一。它告訴你：
- 你在哪個分支上
- 哪些檔案被修改了（紅色 = 未暫存）
- 哪些檔案在暫存區裡（綠色 = 已暫存，等待提交）

**第二步：把檔案放進暫存區**

```bash
# 新增單一檔案
git add login.js

# 新增多個檔案
git add login.js style.css

# 新增目前資料夾裡所有修改過的檔案（用 . 表示「全部」）
git add .
```

> ⚠️ 初學者常見誤區：`git add .` 非常方便，但會把所有修改都加進去，包括你不想提交的臨時檔案。養成精確 add 的習慣，或者用 `.gitignore` 排除不想追蹤的檔案（後面會講）。

**第三步：提交，寫上說明**

```bash
git commit -m "feat: 新增使用者登入功能"
```

`-m` 後面引號裡的內容叫做 **commit message**（提交說明）。這是寫給未來的自己和隊友看的，要寫得有意義。

### 3.3 Commit Message 寫才專業的實作

```bash
# ❌ 沒用的寫法——看了不知道做了什麼
git commit -m "update"
git commit -m "fix"
git commit -m "改了一些東西"

# ✅ 好的寫法：類型 + 冒號 + 一句話描述
git commit -m "feat: 新增使用者登入功能"
git commit -m "fix: 修復首頁在 iOS Safari 上的白畫面問題"
git commit -m "docs: 更新 README 中的部署說明"
git commit -m "refactor: 將 UserService 拆分為獨立模組"
git commit -m "style: 統一程式碼縮排為 2 空格"
```

**常用前綴含意：**

| 前綴 | 含意 |
| :--- | :--- |
| `feat:` | 新功能（feature） |
| `fix:` | 修復 Bug |
| `docs:` | 文件改動 |
| `style:` | 程式碼格式調整（不影響功能） |
| `refactor:` | 程式碼重構（功能不變，結構最佳化） |
| `chore:` | 建構、工具、依賴相關 |
| `test:` | 測試相關 |

養成這個習慣，幾個月後翻歷史記錄，一眼就知道每次提交做了什麼。這在團隊協作中尤其重要。

### 3.4 檢視歷史記錄

```bash
# 詳細格式（每次提交的完整資訊）
git log

# 簡潔格式（每行一條，推薦日常使用）
git log --oneline

# 範例輸出：
# a1b2c3d (HEAD -> main) feat: 新增使用者登入功能
# 9f3e1b2 init: 專案初始化
```

---

## 4. 平行宇宙：分支（Branch）

**分支**是 Git 最強大、也是最讓初學者困惑的功能。但理解了它之後，你會發現這個設計非常優雅。

### 4.1 分支概述用「平行宇宙」來理解

想像你在玩一個角色扮演遊戲，遊戲裡有一個關鍵選擇：
- 選擇 A：去挑戰大 Boss（開發新功能）
- 選擇 B：繼續穩定當前局面（主線不動）

如果你直接在主存檔上做選擇 A，萬一失敗了，整個遊戲進度就毀了。

但如果你**複製一個存檔**，在副本裡去挑戰 Boss：
- 打贏了？把副本的成果合併回主存檔
- 打輸了？主存檔完全沒有影響，刪掉副本重來

**Git 分支就是這個「副本存檔」機制。**

在 Git 裡，`main`（或 `master`）分支是你的「主存檔」，永遠保持穩定可用。當你要開發新功能時，你從 main 建立一個新分支，在那裡開發、測試，完成後再合併回 main。

### 4.2 分支的視覺化演示

👇 **動手試試看**：依次點擊指令按鈕，觀察下方分支圖如何分叉、延伸、最終合併。重點關注 HEAD 標籤的位置變化——它始終指向「你目前在哪裡」。

<GitBranchVisual />

### 4.3 分支操作詳解

**建立並切換到新分支：**

```bash
# 方式一：先建立，再切換（兩步）
git branch feature-login      # 建立分支
git checkout feature-login    # 切換過去

# 方式二：一步到位（推薦）
git checkout -b feature-login

# 輸出：Switched to a new branch 'feature-login'
```

建立分支後，你的命令列提示符會顯示目前分支名，比如：
```
user@mac ~/project (feature-login) $
```

**檢視所有分支：**

```bash
git branch

# 輸出（* 表示目前所在分支）：
# * feature-login
#   main
```

**在分支上正常開發：**

```bash
# 在 feature-login 分支上，改程式碼、add、commit，和平時完全一樣
git add login.js
git commit -m "feat: 新增登入表單 HTML 結構"

git add login.js api.js
git commit -m "feat: 完成登入介面對接"
```

這些提交只在 `feature-login` 分支上，`main` 分支完全不知道你做了什麼。

**切回主分支，合併：**

```bash
# 切回 main
git checkout main

# 把 feature-login 的所有改動合併進來
git merge feature-login

# 合併完成後，可以刪掉這個分支（可選）
git branch -d feature-login
```

### 4.4 開分支的時機界定

| 場景 | 建議 | 理由 |
| :--- | :--- | :--- |
| 開發一個新功能 | ✅ 開分支 | 功能完成前不影響主線，隨時可以放棄 |
| 修復線上緊急 Bug | ✅ 從 main 開 `hotfix-xxx` 分支 | 修完直接合併上線，不帶入未完成的功能 |
| 和隊友平行開發 | ✅ 各自開分支 | 互不干擾，完成後統一透過 Pull Request 合併 |
| 只改一個錯字 | ❌ 直接在 main 改 | 風險極低，沒必要額外開分支 |

### 4.5 團隊常用的分支策略

在實際專案中，團隊通常會約定好分支的命名和用途：

| 分支名 | 用途 | 特點 |
| :--- | :--- | :--- |
| `main` / `master` | 正式環境的穩定程式碼 | 只有測試通過的程式碼才能進來，不能直接推送 |
| `dev` / `develop` | 日常整合分支 | 所有功能分支先合併到這裡，測試通過再上 main |
| `feature/xxx` | 具體功能開發 | 如 `feature/user-login`，完成後合併到 dev |
| `hotfix/xxx` | 緊急修復 | 從 main 建立，修完直接合併回 main 和 dev |

---

## 5. 與隊友協作：遠端儲存庫

到目前為止，你學的都是**本地**的 Git 操作——所有歷史記錄都存在你自己的電腦上。要和隊共享程式碼，你需要一個**遠端儲存庫**，也就是 GitHub、GitLab 這樣的雲端儲存。

### 5.1 遠端儲存庫的運作原理

可以把遠端儲存庫理解為**團隊共用的「公共存檔」**：

- 每個人在本地寫程式碼、commit
- 寫完後 `push`（上傳）到遠端儲存庫
- 隊友 `pull`（下載）遠端儲存庫的最新內容到自己本地
- 這樣大家的程式碼就保持同步了

👇 **動手試試看**：依次點擊指令，體驗從關聯遠端儲存庫、推送到拉取隊友更新的完整流程。

<GitSyncDemo />

### 5.2 第一次推送專案到 GitHub

**第一步**：在 GitHub 上建立一個新儲存庫（點擊右上角 + → New repository），不要勾選初始化選項。

**第二步**：回到本地終端機，關聯遠端儲存庫：

```bash
# 把本地儲存庫和 GitHub 上的儲存庫關聯起來
# "origin" 是遠端儲存庫的別名，是約定俗成的名字（也可以改，但沒必要）
git remote add origin https://github.com/你的使用者名稱/儲存庫名.git

# 確認關聯成功
git remote -v
# 輸出：
# origin  https://github.com/你的使用者名稱/儲存庫名.git (fetch)
# origin  https://github.com/你的使用者名稱/儲存庫名.git (push)
```

**第三步**：推送本地內容到遠端：

```bash
# 第一次推送，-u 的意思是「以後 git push 時，預設推到 origin 的 main 分支」
git push -u origin main

# 之後每次推送只需要：
git push
```

### 5.3 日常協作的指令

**推送（你改了東西，要讓隊友看到）：**
```bash
git push
```

**拉取（隊友改了東西，你要同步）：**
```bash
git pull
```

`git pull` 實際上是兩個指令的組合：
1. `git fetch`：先去遠端儲存庫下載最新的提交記錄
2. `git merge`：把下載回來的內容合併到你目前的分支

**第一次從 GitHub 獲取別人的專案：**
```bash
# 把整個遠端儲存庫複製到本地（只需要做一次）
git clone https://github.com/某人/某專案.git

# clone 會自動建立與遠端的關聯，之後直接 push/pull 就行
```

### 5.4 push 和 pull 的方向

```
你的電腦（本地儲存庫）  ←→  GitHub（遠端儲存庫）

git push：  本地 → 遠端   （你改了東西，上傳給隊友）
git pull：  遠端 → 本地   （隊友改了東西，下載到你這裡）
git clone： 遠端 → 本地   （第一次完整複製整個儲存庫）
```

> **最佳實踐**：每天開始工作前先 `git pull`，拿到最新程式碼；下班或完成一個功能後 `git push`，及時備份並讓隊友看到你的進展。

---

## 6. 進階：處理衝突

衝突是協作中不可避免的，但也沒那麼可怕。

### 6.1 衝突發生的機制概述

當你和隊友**同時修改了同一個檔案的同一行**，在合併時 Git 不知道該用誰的版本，就會產生衝突。

舉個例子：
- 你在 `login.js` 第 5 行寫了：`const timeout = 3000`
- 隊友同時在同一行寫了：`const timeout = 5000`
- 當你 `git pull` 或 `git merge` 時，Git 發現了這個矛盾，就會「暫停」並告訴你：我不知道該用哪個，你來決定。

### 6.2 衝突檔案的格式外觀概述

Git 會在衝突的地方插入特殊標記：

```javascript
function login() {
  const url = '/api/login'

 <<<<<<< HEAD
  const timeout = 3000   // 你的版本
 =======
  const timeout = 5000   // 隊友的版本
 >>>>>>> feature/update-timeout

  return fetch(url, { timeout })
}
```

- `<<<<<<< HEAD` 到 `=======` 之間：是你目前分支的內容
- `=======` 到 `>>>>>>> xxx` 之間：是合併過來的內容

### 6.3 解決衝突的方法

**第一步**：開啟衝突檔案，找到所有 `<<<<<<<` 標記（通常 VS Code 等編輯器會自動高亮）

**第二步**：決定保留哪段程式碼，然後手動編輯檔案，刪掉所有標記符號（`<<<<<<<`、`=======`、`>>>>>>>`）。

比如決定用 5000（隊友的版本）：
```javascript
function login() {
  const url = '/api/login'
  const timeout = 5000   // 採用隊友的修改
  return fetch(url, { timeout })
}
```

**第三步**：重新提交

```bash
# 標記衝突已解決
git add login.js

# 完成合併提交（Git 會自動產生合併提交資訊）
git commit
```

### 6.4 減少衝突的好習慣

- **勤 pull**：開始工作前同步最新程式碼，減少「你落後太多」的情況
- **小步提交**：不要寫了一週程式碼才一次性提交，頻繁小提交更容易發現和解決衝突
- **分支隔離**：不同功能用不同分支，減少對同一行程式碼的競爭
- **溝通**：要改公共檔案（比如 `config.js`）前，跟隊友打個招呼

---

## 7. 常用指令速查

<GitCommandCheatsheet />

---

## 8. 實戰：加入一個團隊專案的完整流程

這是你加入新團隊或新專案時的標準操作流程，可以直接照抄：

```bash
# ① 第一天：把專案 clone 到本地（只做一次）
git clone https://github.com/team/project.git
cd project

# ② 每天開始工作：先拉取最新程式碼，確保你的程式碼是最新的
git pull origin main

# ③ 建立自己的功能分支（不要直接在 main 上改）
git checkout -b feature/user-profile

# ④ 正常開發...寫程式碼...

# ⑤ 完成一個小功能點後，立即提交（不要攢著）
git add src/UserProfile.vue
git commit -m "feat: 完成使用者頭像上傳功能"

git add src/UserProfile.vue src/api/user.js
git commit -m "feat: 完成使用者資料編輯介面"

# ⑥ 把自己的分支推送到遠端，讓隊友能看到
git push origin feature/user-profile

# ⑦ 在 GitHub 上建立 Pull Request（PR），請求合併到 main
# （這步在 GitHub 網頁上操作）

# ⑧ 等隊友 Code Review，按回饋修改，繼續 commit + push

# ⑨ PR 合併後，回到 main，更新本地，刪掉功能分支
git checkout main
git pull
git branch -d feature/user-profile
```

---

## 9. .gitignore：檔案的篩選範圍界定

有些檔案你**不想**提交到 Git 儲存庫裡，比如：
- `node_modules/`：依賴套件，體積巨大，可以用 `npm install` 重新產生
- `.env`：環境變數檔案，裡面可能有資料庫密碼、API Key，**絕對不能上傳到公開儲存庫**
- `*.log`：日誌檔案
- `.DS_Store`：macOS 自動產生的隱藏檔案
- `dist/`、`build/`：編譯產物，可以重新建構

在專案根目錄建立一個 `.gitignore` 檔案，寫上不想追蹤的檔案規則：

```gitignore
# 依賴套件
node_modules/

# 環境變數（重要！密碼不能提交）
.env
.env.local

# 建構產物
dist/
build/

# 系統檔案
.DS_Store
Thumbs.db

# 日誌
*.log
```

GitHub 上有各種語言和框架的 .gitignore 範本：[github.com/github/gitignore](https://github.com/github/gitignore)

---

## 名詞速查表

| 名詞 | 英文 | 解釋 |
| :--- | :--- | :--- |
| **儲存庫** | Repository (Repo) | 存放專案所有版本歷史的資料庫，在 `.git` 資料夾裡 |
| **提交** | Commit | 一次完整的版本記錄，像遊戲存檔點，附有說明和時間戳 |
| **分支** | Branch | 獨立的開發線，像平行時間線，互不影響 |
| **合併** | Merge | 把一個分支的改動整合到另一個分支 |
| **衝突** | Conflict | 同一行程式碼被多人修改，Git 不知道該用哪個，需要手動解決 |
| **暫存** | Stage / Index | 把修改放入「準備提交」清單的操作 |
| **遠端** | Remote | 雲端的儲存庫副本（GitHub / GitLab / Gitee） |
| **複製** | Clone | 把整個遠端儲存庫完整複製到本地 |
| **推送** | Push | 把本地提交上傳到遠端儲存庫 |
| **拉取** | Pull | 把遠端最新內容下載並合併到本地 |
| **HEAD** | HEAD | 目前所在分支/提交的指標，表示「你現在在哪裡」 |
| **origin** | origin | 遠端儲存庫的預設別名（約定俗成的名字） |
| **stash** | Stash | 臨時儲存還沒 commit 的改動，切換任務時用 |
| **PR / MR** | Pull Request / Merge Request | 請求把你的分支合併進主分支，通常需要隊友 review |

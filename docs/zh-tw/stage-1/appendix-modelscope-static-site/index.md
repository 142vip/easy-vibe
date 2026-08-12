---
title: 在魔搭社群發布你的 Vibe Coding 作品
description: 從純 HTML 到 Vue、React、Vite 建置產物，搭配魔搭官方 Skill 與創空間發布靜態網頁的完整教學
---

# 在魔搭社群發布你的 Vibe Coding 作品

網頁終於做出來了，接下來要找個地方展示，讓朋友、同學或真正的使用者可以直接開啟。

我們可以租伺服器，自己設定網域、HTTPS 和部署流程；也可以把作品託管到成熟的開源社群，少處理一些維運工作，把精力留給頁面本身。這一節選擇第二種方式：把網頁發布到 **魔搭社群（ModelScope）**。

魔搭社群（ModelScope）是由阿里巴巴聯合 CCF 開源發展委員會發起的開源社群。除了 20 萬+開源模型和 3 萬+資料集，它也提供展示應用的 **創空間（Studio）**。對我們來說，創空間最實用的一點是：不用先成為維運專家，也能為作品準備一個可以免費分享的地址。

> 本文依據魔搭社群目前的創空間頁面、官方 Skill 和命令列資料整理，最後核驗於 **2026 年 8 月 11 日**。魔搭仍在快速更新，按鈕位置可能改變，但「建立 Static 創空間 → 上傳建置產物 → 部署 → 透過創空間連結存取」的主要流程不變。

魔搭的 **創空間（Studio）** 不只可以執行 Gradio、Streamlit 和 Docker 應用，也支援 `static` 類型，也就是**已經建置好的純靜態網站**。如果網頁最後能變成 `index.html`、CSS、JavaScript 和圖片等檔案，就能用這種方式發布。

發布完成後，會得到類似下面的公開頁面：

```text
https://modelscope.cn/studios/你的使用者名稱/你的空間名稱
```

## 先選對發布方式

| 專案 | 創空間類型 | 發布前要做什麼 |
| --- | --- | --- |
| 純 HTML / CSS / JavaScript | **Static / 靜態網頁** | 不用建置，直接準備網頁檔案 |
| Vue、React、Vite、Svelte 等前端專案 | **Static / 靜態網頁** | 先執行建置，只上傳 `dist` 或 `build` 裡的內容 |
| Gradio 應用 | Gradio | 準備 `app.py` 和 `requirements.txt` |
| Streamlit 應用 | Streamlit | 準備 Streamlit 入口檔案和相依套件 |
| 有自訂後端、系統相依或特殊啟動方式 | Docker | 撰寫 Dockerfile，服務監聽平台要求的連接埠 |

本文重點講前兩種。**不要把 Vue、React 的原始碼直接當成 Static 網站上傳**：瀏覽器不會替你執行 `npm install` 和 `npm run build`。

## 建議方式：使用官方 Skill 與 AI 協作發布

魔搭官方維護 [ModelScope Skills](https://github.com/modelscope/modelscope-skills)，其中與發布網頁最相關的是下面兩個 Skill：

| Skill | 作用 | 何時使用 |
| --- | --- | --- |
| `ms-hub` | 魔搭平台的統一入口，涵蓋倉庫、模型、資料集、創空間、MCP 和 Skills Center | 第一次接入魔搭，或只需要執行創空間的一般操作 |
| `ms-studio-deploy` | 專門把本機專案部署到創空間，涵蓋專案辨識、建立空間、Git 同步、部署、日誌檢查和故障診斷 | **發布或更新本機網頁時優先使用** |

`ms-studio-deploy` 會依專案檔案判斷執行類型：根目錄已有 `index.html` 的建置產物會辨識為 `static`。Static 創空間不負責執行 `npm run build`，所以 Vue、React、Vite 專案仍要先在本機建置。

### 安裝 Skill

先安裝魔搭 SDK，再安裝統一入口和創空間部署 Skill：

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

如果目前的 `modelscope` 指令沒有 `skills` 子指令，可以使用官方安裝腳本：

```bash
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-hub
curl -fsSL https://modelscope.cn/skills/install.sh | bash -s -- @ModelScope/ms-studio-deploy
```

Skill 預設安裝到 `~/.agents/skills/`。Codex、Cursor、Claude Code 等支援 Agent Skills 的工具都能從這裡發現它們。安裝後重新開始一次 Agent 工作階段，讓工具更新可用 Skill 清單。

### 怎樣用 Skill 發布

依照魔搭官方的 [`ms-studio-deploy` 教學](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)，你不用自己逐條執行建立、推送、部署和查日誌指令。準備好三樣東西即可：

1. 已安裝 `ms-studio-deploy` Skill，並重新開啟一次 Agent 工作階段；
2. 目前目錄就是準備發布的目錄，且根目錄直接包含 `index.html`；
3. 本機已設定魔搭 Access Token。

第一次使用時，前往 [Access Token 頁面](https://modelscope.cn/my/myaccesstoken)取得權杖，並在終端機設定：

```bash
export MODELSCOPE_API_KEY="你的權杖"
```

純 HTML 專案直接進入網頁目錄。Vue、React、Vite 等專案先建置，再進入產物目錄：

```bash
npm run build
cd dist
```

上面以 Vite 的 `dist` 為例；如果專案產生的是 `build` 目錄，就進入 `build`。

接著在 Codex、Cursor、Claude Code 等支援 Agent Skills 的工具中開啟這個目錄。

#### 最簡單的提示詞

只要說這一句：

```text
請使用 ms-studio-deploy Skill，把目前網頁發布到魔搭社群的 Static 創空間，完成後把存取連結給我。
```

Skill 會先檢查 `index.html` 和登入資訊。如果需要建立新空間，還會確認空間名稱以及公開或私密；沒有特別需求時，建議先使用私密空間。

如果想一次把要求說清楚，可以使用下面這個版本：

```text
請使用 ms-studio-deploy Skill，把目前目錄發布到魔搭中國站的 Static 創空間。
空間名稱使用 my-portfolio，先設為私密；部署後檢查執行狀態和日誌。
如果失敗就依日誌修復並重新部署，成功後把存取連結給我。
```

#### AI 接下來會做什麼

官方 Skill 把發布流程整理成：

```text
辨識專案類型 → 確認中國站或國際站 → 取得帳號資訊
→ 建立或重用創空間 → 檢查敏感資訊 → 同步到 master
→ 觸發部署 → 檢查狀態與日誌 → 診斷並修復 → 回傳存取連結
```

如果 AI 詢問「公開或私密」，第一次發布建議選私密，確認頁面正常後再改為公開。Static 網站不需要付費硬體；若其他類型涉及付費資源，Skill 必須先取得你的明確同意。

權杖同時用於 API 驗證和 Git 推送。不要把權杖寫進網頁原始碼、README、提示詞或可分享的截圖。

## 手動方式：第 0 步，準備可以發布的網站

前面的 Skill 方式比較省事。下面保留不使用 Skill 的手動流程，方便理解創空間頁面，或在 Agent 暫時無法使用時完成發布。

### 情況 A：純 HTML 網頁

最小目錄如下，`index.html` 必須位於準備發布內容的根目錄：

```text
my-site/
├── index.html
├── styles.css
├── app.js
└── images/
    └── cover.jpg
```

發布前可以在終端機做一次本機檢查：

```bash
cd my-site
python3 -m http.server 8000
```

瀏覽器開啟 `http://localhost:8000`。不要只雙擊 `index.html` 檢查，因為 `file://` 和真正的 HTTP 存取在模組、跨來源和路徑處理上不同。

### 情況 B：Vue、React、Vite 等專案

先安裝相依套件並建置：

```bash
npm install
npm run build
```

常見輸出目錄：

| 工具或框架 | 常見輸出目錄 |
| --- | --- |
| Vite / Vue + Vite / React + Vite | `dist/` |
| Create React App | `build/` |
| Vue CLI | `dist/` |

要發布的是輸出目錄裡的**內容**，並確保最後倉庫根目錄直接出現 `index.html`：

```text
正確：index.html
錯誤：dist/index.html
```

如果部署後 CSS、JavaScript 或圖片出現 404，Vite 專案可以先嘗試使用相對資源基底：

```js
// vite.config.js / vite.config.ts
export default {
  base: './'
}
```

修改後重新執行 `npm run build`。單頁應用也可以使用 Hash 路由，例如 `/#/about`，因為純靜態託管不一定會把所有路徑都重新導向 `index.html`。

## 手動方式：第 1 步，進入創空間並登入

開啟[魔搭社群創空間](https://modelscope.cn/studios)。頁面頂部會顯示「建立空間 → 搭建應用 → 發布空間 → 分享創意」的流程。

![魔搭社群創空間首頁，頁面頂部展示建立、搭建、發布和分享流程](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

點選建立按鈕，或直接進入[建立創空間](https://modelscope.cn/studios/create)。尚未登入時，平台會先要求登入或註冊。中國站 `modelscope.cn` 和國際站 `modelscope.ai` 的帳號、權杖與內容並不互通；面向中國使用者時通常選擇中國站。

## 手動方式：第 2 步，填寫空間基本資訊

在「建立創空間」頁面填寫基本資訊：

![魔搭社群建立創空間頁面，包含名稱、擁有者、授權條款、可見性和說明](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

1. **所屬帳號或組織**：決定連結中的擁有者名稱。
2. **空間名稱**：建議使用小寫英文字母、數字和連字號，例如 `my-portfolio`。
3. **顯示名稱與簡介**：填寫訪客看得懂的標題和說明。
4. **可見性**：第一次部署建議先選私密，驗收後再公開。
5. **授權條款**：依專案實際情況選擇。

確認資訊後，點選頁面底部的建立按鈕，等待進入創空間詳細頁。

## 手動方式：第 3 步，上傳網頁檔案

下面是一個已經執行的 Static 創空間檔案頁。可以看到網頁入口 `index.html` 直接位於倉庫根目錄，旁邊還有 `README.md`。

![魔搭社群 Static 創空間檔案頁，根目錄包含 index.html 和 README.md](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

進入新空間的**檔案**頁，上傳 `index.html`、CSS、JavaScript 和圖片。完成後，根目錄必須直接出現 `index.html`，不能再包一層 `dist`、`build` 或專案目錄。

手動上傳適合純 HTML 頁面或檔案很少的專案。檔案多、更新頻繁時，回到前面的方式，讓 `ms-studio-deploy` 自動完成 Git 同步會更穩妥。

## 手動方式：第 4 步，在部署設定中選擇 Static

檔案上傳完成後，進入創空間的部署設定，在 SDK 類型中選擇 **Static**。頁面會提示 Static 適合展示已準備好的 HTML 頁面；同一區域也會提供 Gradio、Streamlit 和 Docker。

![魔搭社群創空間的部署設定，在 SDK 區域選擇 Static](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

再次確認倉庫根目錄有 `index.html`，然後儲存部署設定。

> 如果網頁需要資料庫、私密 API Key 或伺服器端運算，它就不是純靜態網頁。此時應選擇 Gradio、Streamlit、Docker，或把後端部署到其他服務。寫進前端 JavaScript 的金鑰無法保密。

## 手動方式：第 5 步，等待部署並驗收

儲存部署設定後，平台通常會自動部署。如果沒有，就在創空間頁面點選部署、重新啟動或重新執行。等待狀態變為「執行中」，再開啟類似下面的地址：

```text
https://modelscope.cn/studios/你的使用者名稱/你的空間名稱
```

開啟最後連結，確認：

- 首頁能否開啟；
- CSS、JavaScript 和圖片是否正常；
- 瀏覽器主控台是否有 404、CORS 或 JavaScript 錯誤；
- 手機寬度下是否仍能使用；
- 公開空間的連結能否在未登入視窗中開啟。

如果空間目前是私密，確認頁面正常後再改為公開，並用未登入視窗檢查公開連結。

## 手動方式：第 6 步，更新已發布的網頁

修改原始碼後，先在本機測試並重新建置。回到創空間的**檔案**頁，用新的 `dist` 或 `build` 內容替換舊檔案，再重新部署。

```text
修改原始碼 → 本機測試 → 重新建置 → 替換創空間檔案
→ 重新部署 → 開啟最後連結驗收
```

對 Vite、React、Vue 專案，仍然只上傳建置產物，不要上傳 `node_modules`、開發設定和完整原始碼。更新次數增加後，建議改用前面的 Skill 方式。

## 排障仍然建議使用 Skill

<ModelScopeTroubleshooter />

## 資料來源

- [魔搭社群創空間](https://modelscope.cn/studios)（頁面與截圖核驗於 2026-08-11）
- [魔搭核心開發者共創會回顧](https://community.modelscope.cn/683562c6870cef7360622f7f.html)
- [ModelScope 官方統一操作說明](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-hub/SKILL.md)
- [ModelScope 官方創空間部署 Skill](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)
- [ModelScope Hub 官方用戶端](https://github.com/modelscope/modelscope_hub)
- [公開 Static 創空間範例](https://modelscope.cn/studios/studio-demo-station/funasr-demo-static-multiple/summary)

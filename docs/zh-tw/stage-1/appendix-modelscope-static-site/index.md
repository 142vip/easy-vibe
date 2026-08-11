---
title: 在魔搭社群發布你的網頁
description: 使用魔搭創空間與官方部署 Skill，發布 HTML、Vue、React 或 Vite 靜態網站。
---

# 在魔搭社群發布你的網頁

網頁在本機跑通後，還需要一個讓同學、朋友或使用者可以直接開啟的連結。這一節使用 **魔搭社群（ModelScope）的創空間** 發布，不必先自己設定伺服器。

## 1. 先確認要發布什麼

| 專案 | 創空間類型 | 發布內容 |
| --- | --- | --- |
| HTML、CSS、JavaScript | Static | 根目錄直接放 `index.html` 和其他網站檔案 |
| Vue、React、Vite、Svelte | Static | 先建置，再發布 `dist` 或 `build` 裡的內容 |
| Gradio、Streamlit | 對應類型 | Python 入口檔與依賴 |
| 有後端或特殊系統依賴 | Docker | Dockerfile 與可啟動的服務 |

瀏覽器不會替訪客執行 `npm install`。框架專案要上傳的是**建置產物**，不是原始專案資料夾。

## 2. 使用官方部署 Skill

魔搭維護了 [ModelScope Skills](https://github.com/modelscope/modelscope-skills)。其中 `ms-studio-deploy` 可以辨識專案、建立創空間、同步檔案、部署並檢查日誌。

```bash
python -m pip install -U modelscope
modelscope skills add @ModelScope/ms-hub @ModelScope/ms-studio-deploy
```

到 [Access Token 頁面](https://modelscope.cn/my/myaccesstoken)取得令牌，只保存在本機，不要寫進網頁、README 或截圖。

Vite 專案先執行：

```bash
npm run build
cd dist
```

用 AI 工具開啟輸出資料夾後，只要說：

```text
請使用 ms-studio-deploy Skill，把目前資料夾發布到魔搭的 Static 創空間。成功後把連結給我。
```

## 3. 從網頁手動發布

開啟[魔搭創空間](https://modelscope.cn/studios)並登入。

![魔搭創空間首頁](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/01-studios-home.jpg)

進入[建立創空間](https://modelscope.cn/studios/create)，填寫擁有者、名稱、說明與可見性。

![建立創空間表單](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/02-create-studio.jpg)

在 SDK 類型中選擇 **Static**。

![選擇 Static 類型](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/03-select-static.jpg)

建立後打開「檔案」頁，上傳 `index.html`、CSS、JavaScript 和圖片。`index.html` 必須直接出現在根目錄，不能再包一層 `dist`。

![Static 創空間的檔案頁](../../../zh-cn/stage-1/appendix-modelscope-static-site/images/modelscope-static-site/04-studio-files.jpg)

儲存後等待部署。打開最後的連結，檢查首頁、樣式、圖片、手機寬度和瀏覽器主控台。公開空間還要用未登入視窗再測一次。

## 4. 更新與排錯

修改原始專案後，要重新本機測試、重新建置、替換發布檔案，再部署一次。常見問題如下：

- 沒有樣式或圖片：檢查資源路徑與 Vite 的 `base`；
- 重新整理子頁出現 404：靜態託管可改用 Hash 路由；
- 顯示檔案列表：確認根目錄有 `index.html`；
- 網頁需要私密金鑰：不要放在前端，改用後端服務。

官方資料：[ModelScope Studio](https://modelscope.cn/studios)、[ModelScope Skills](https://github.com/modelscope/modelscope-skills)、[`ms-studio-deploy`](https://github.com/modelscope/modelscope-skills/blob/main/skills/ms-studio-deploy/SKILL.md)。

---
title: '如何把做好的程式發布上架'
description: '從正式建置、簽名與內測，到商店審核、分批發布、監控與後續更新。'
---

# 如何把做好的程式發布上架

程式能在自己的電腦和手機執行，與使用者能安全安裝，是兩件事。不論使用 Flutter、React Native、Electron、Qt 或原生開發，最後都會走過：

> 選擇通路 → 固定 App 身分 → 建立 Release 套件 → 簽名 → 內測 → 準備商店資料 → 送審 → 分批發布 → 監控與更新

商店規則會改變，真正送出前要再查看後台提示與官方文件。

## 1. 分清楚打包、簽名、分發與審核

打包把專案變成安裝檔；簽名證明發行者並保護更新鏈；分發讓使用者取得；審核則檢查平台政策與品質。先知道失敗在哪一步，才不會把所有問題都叫作「上架失敗」。

## 2. 正式發布前先整理資產

開發者帳號、公司信箱、網域、雲端服務、簽名憑證、金流與稅務資料，盡量由組織持有並開啟雙重驗證。套件名稱、Bundle ID 與商店產品記錄是 App 的身分，發布後不要隨意更換。

版本名稱給使用者看，Build number 則辨識每次上傳。每次重新上傳都要增加建置編號。

Release 套件不能連到 localhost、測試資料庫或沙盒付款，也不能把管理員口令與伺服器密鑰放進客戶端。

## 3. 用真實版本準備商店資料

準備名稱、描述、圖示、真實執行截圖、支援頁、隱私政策、審核說明與素材授權。截圖不要留下電話、聊天、Token、客戶資料或本機路徑。

隱私申報要與程式和第三方 SDK 真正收集的資料一致。需要登入時，提供不依賴簡訊與過期邀請的審核帳號，並請沒有參與開發的人照著說明完整操作一次。

## 4. Android 與 iOS

Android 新 App 通常把簽名後的 `.aab` 上傳 Google Play，先進內部或封閉測試，再安裝商店提供的版本重測登入、付款、通知與升級。中國大陸有多個 Android 商店，要分別提交，並保持套件名稱、簽名、版本與隱私資料一致。

參考：[上傳 App 到 Play Console](https://developer.android.com/studio/publish/upload-bundle)。

iOS 先在 App Store Connect 建立記錄，讓 Bundle ID 與 Xcode 完全一致，再用 Xcode Archive、Validate、Upload，經 TestFlight 測試後補齊隱私、分級與審核資料。

參考：[App Store Connect 工作流程](https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-workflow)。

## 5. Windows、macOS、Linux 與 Web

Windows 可走 Microsoft Store 的 MSIX 流程，也可以從官網分發已簽名的安裝檔；後者必須自行負責 HTTPS、校驗值、SmartScreen、更新與復原。

macOS 官網版需要 Developer ID 簽名、Hardened Runtime、Apple 公證、staple 與乾淨 Mac 的 Gatekeeper 測試。Mac App Store 版本則走沙盒與商店審核。

Linux 常見 Flathub、Snap Store、AppImage、`.deb` 與 `.rpm`，都要說明架構、依賴、校驗與更新方式。

Web/PWA 部署到穩定 HTTPS 網域就是主要發布。要檢查 DNS、憑證續期、正式環境變數、404、離線、Manifest、Service Worker 更新、監控、備份與復原。

## 6. 小程式與瀏覽器擴充

微信小程式通常從開發者工具上傳，再到後台補齊類別與隱私說明、送審並發布。瀏覽器擴充則分別提交 Chrome Web Store、Edge Add-ons 或 Firefox AMO，並只申請真正需要的權限。

## 7. 審核被拒時怎麼做

常見原因包括 Release 版崩潰、審核帳號失效、隱私說明與 SDK 不一致、未完成按鈕、付款規則、過度權限與未授權素材。

> 這是商店的審核原文：【貼上原文】。請指出對應規則與要修改的功能，不要猜測。

修改後再列出要重測的操作與要更新的商店資料，最後以平台回覆為準。

## 8. 先小範圍發布

比較穩妥的順序是本機與真機、團隊內測、少量真實使用者、商店審核、小比例正式發布，再根據崩潰、API、登入、付款與客服訊號逐步擴大。

每次更新都要保持相同 App 身分與相容簽名、提高建置編號、安全遷移本機資料，並讓後端先相容舊版客戶端。

第一次先完成一個平台的一條發布路徑。把帳號、簽名、隱私、測試、監控與復原當成產品工程，第二次發布就會容易得多。

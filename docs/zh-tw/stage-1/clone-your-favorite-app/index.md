---
title: '從截圖復刻：第一次模仿練習'
description: '跟著課堂步驟，把一張產品截圖做成可以開啟、可以操作的網頁或小遊戲。'
---

# 從截圖復刻：第一次模仿練習

上一課，我們試過用一句話讓 AI 寫程式。這一課換一個更直觀的起點：**先找一張喜歡的截圖，再請 AI 看著它做。**

截圖已經呈現了顏色、間距、按鈕和版面。你只需要說清楚，想把它做成哪一種可以操作的作品。

## 1. 先選一個小目標

第一次只做一個畫面。你可以選產品首頁、SaaS 資料看板，或只有一種玩法的小遊戲。保留原始截圖，完成後才能把兩張圖放在一起比較。

## 2. 跟著做第一個網頁

下面是課堂使用的 Framer 參考圖。導覽列、大標題、紫色山景和按鈕都能在一張圖裡看清楚。

![Framer 網頁參考圖](../../../zh-cn/stage-1/clone-your-favorite-app/images/framer-official-interface.jpg)

_參考：[Framer Website Builder](https://www.framer.com/solutions/website-builder/)_

建立一個空資料夾，用 Trae 開啟，再把圖片拖進對話框。接著說：

```text
照著這張圖幫我做一個網頁。做好後幫我開啟看看。
```

等 Trae 建立並啟動檔案。這是課堂實際產生的結果：

![依照參考圖產生並執行的網頁](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-wishlabs.gif)

先不要研究每一行程式碼。只檢查網頁能不能開啟、主要內容有沒有出現，以及版面是否像參考圖。

如果標題太小，只改一件事：

```text
把中間的標題放大一點。
```

## 3. 換成自己的截圖

再建立一個空資料夾，放入你選的圖片，然後說：

```text
參考這張圖做一個網頁。做好後幫我開啟。
```

如果只想參考風格，可以補一句：

```text
樣式參考這張圖，名稱和內容換成新的。
```

第一版出現後，自己點一次主要按鈕，並把視窗縮窄看看排版。

## 4. 看板和遊戲也能這樣做

Linear 的看板左邊是導覽，右邊是卡片和圖表，很適合練習頁面結構。

![Linear Dashboard 參考圖](../../../zh-cn/stage-1/clone-your-favorite-app/images/linear-official-dashboard.png)

_參考：[Linear Dashboards](https://linear.app/docs/dashboards)_

```text
幫我做一個像這樣的資料看板，先使用範例資料。
```

![課堂實際產生的資料看板](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-linear-dashboard.gif)

也可以用 Minecraft 畫面練習小遊戲：

![Minecraft Creative Mode 參考圖](../../../zh-cn/stage-1/clone-your-favorite-app/images/minecraft-official-creative-mode.png)

_參考：[Microsoft Learn 的 Minecraft 範例](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108)_

```text
幫我做一個像這樣的方塊小遊戲。角色可以走動，也可以放方塊。
```

![課堂實際產生的 2D 方塊遊戲](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-block-game.gif)

想做第一人稱世界時，要明確說「3D」：

```text
幫我做一個像這樣的 3D 方塊遊戲。可以走動、轉動視角和放方塊。
```

![課堂實際產生的 3D 方塊遊戲](../../../zh-cn/stage-1/clone-your-favorite-app/images/trae-generated-3d-block-game.gif)

## 5. 一次只改一個問題

第一版不好看很正常。找到最明顯的問題，用平常的話說：

```text
上面的卡片太高了，矮一點。
```

```text
這個按鈕點了沒有反應，幫我修好。
```

每改一次就重新開啟、點擊和比較。不要把五個不相干的要求塞在同一句話裡。

## 6. 交作業前自己檢查

- 重新整理後仍然能開啟；
- 別人看得出這是官網、看板還是遊戲；
- 主要按鈕或遊戲操作可以使用；
- 視窗縮窄後，文字和圖片沒有嚴重重疊。

最後把參考圖和作品圖並排，說明你主動修改了哪一處。這次練習的順序很好記：選截圖、交給 AI、說一句想做什麼，再針對眼前的結果慢慢修改。

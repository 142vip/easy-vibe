---
title: '如何用 Godot 開發橫向、像素與 3D 遊戲'
description: '用三個實際執行的小原型認識 Godot，並從正式發行作品理解橫向、像素與 3D 遊戲的做法。'
---

# 如何用 Godot 開發橫向、像素與 3D 遊戲

Godot 是免費且開源的遊戲引擎，場景編輯、動畫、物理、聲音、輸入、程式與匯出工具都放在同一套軟體裡。本章不假裝一次做完三款遊戲，而是實際跑通橫向動作、像素收集與 3D 灰盒三個最小原型。

## 1. 先認識四個名詞

**節點**是一個有單一工作的小物件，例如圖片、鏡頭、碰撞形狀、燈光或文字；**場景**是一棵可以重複使用的節點樹；**腳本**讓節點產生行為；**GDScript** 是 Godot 最常用的腳本語言。

![Godot 編輯器中的橫向原型與場景樹](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-editor-platformer.png)

Godot 也支援 C#，效能關鍵的引擎擴充可以用 C++，但初學者完成下面三個原型不需要先學 C++。

## 2. 橫向動作：先把路線與跳躍做清楚

Primal Light 是 Godot Showcase 中的正式商業作品。它用清楚的平台輪廓、危險區域與前進目標，讓玩家知道下一步往哪裡走。

![Primal Light 官方展示圖](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-primal-light.webp)

> 建立一個 2D 橫向關卡，加入玩家、地面、三個平台和明顯的終點。先用簡單色塊。

> 加入左右移動與跳躍。玩家要能站在平台上，而且不能在空中再次跳躍。

![Godot 4.7.1 實際執行的 Skyline Courier](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-platformer.png)

逐一測試每個平台、邊緣碰撞和掉落重生，再閱讀 Godot 的[第一個 2D 遊戲教學](https://docs.godotengine.org/en/stable/getting_started/first_2d_game/index.html)。

## 3. 像素遊戲：小畫面也要看得懂目標

Dome Keeper 把像素畫面、資源數字與當前目標整理在有限空間裡。我們借用的是資訊層級，不是複製玩法。

![Dome Keeper 官方展示圖](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-dome-keeper.webp)

> 建立 320 × 180 的像素場景，加入玩家、森林空地、三個發光收集物和計數器。

> 玩家碰到收集物時移除它，計數只增加一次。

![Godot 4.7.1 實際執行的 Lantern Woods](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-pixel.png)

像素圖在非整數縮放時容易變糊。設定整數縮放，分別測試視窗與全螢幕，再參考[多解析度說明](https://docs.godotengine.org/en/stable/tutorials/rendering/multiple_resolutions.html)。

## 4. 3D 灰盒：先測空間，不急著找模型

Wrought Flesh 是使用 Godot 製作的第一人稱遊戲。它的展示圖很適合觀察空間輪廓、燈光與醒目的目標。

![Wrought Flesh 官方展示圖](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-case-wrought-flesh.webp)

**灰盒**是在正式模型完成前，用方塊、平面和簡單材質測試比例、移動與視線。

> 建立一個小型 3D 灰盒，加入地面、牆、可控制玩家、鏡頭與發光出口。只用基本幾何形狀。

> 加入方向光、環境光與陰影，讓路線保持清楚。

![Godot 4.7.1 實際執行的 Signal Garden](../../../../zh-cn/stage-3/cross-platform/godot-game-development/images/godot-run-3d.png)

走遍每面牆並確認不會穿過地面，再跟著[第一個 3D 遊戲教學](https://docs.godotengine.org/en/stable/getting_started/first_3d_game/index.html)繼續。

## 5. 每次只讓 AI 改一件事

> 只加入玩家移動，不要改關卡。

> 跳躍太高，只降低跳躍高度並告訴我改了哪個值。

> 發生這個錯誤：【貼上錯誤】。只修這個錯誤，並告訴我怎麼重測。

先讓遊戲循環成立，再逐一更換圖像、模型與聲音，同時保存素材來源和授權。

## 6. 匯出前的最後一段路

在編輯器執行只代表開發版通過。先到 **Editor → Manage Export Templates** 安裝與版本完全相符的模板，再從 **Project → Export** 建立目標平台設定。

桌面版要在沒有 Godot 的乾淨電腦測試；Web 版要透過本機伺服器或 HTTPS 開啟；Android、iOS 還要準備 SDK、簽名、權限與真機。

本章三個臨時原型已在 macOS 的 Godot 4.7.1 實際載入與執行。Windows、Linux、Web、Android、iOS 與主機匯出沒有被寫成「已通過」。

挑一條最接近自己想法的路線，先把五分鐘的玩法做到願意再玩一次，再增加關卡、素材和系統。

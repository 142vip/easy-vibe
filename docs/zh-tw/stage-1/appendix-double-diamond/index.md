---
title: '雙鑽設計模型'
description: '面向零基礎讀者的 Double Diamond 入門文章。理解 Discover、Define、Develop、Deliver 四個階段，避免在問題還沒搞清楚時就急著做原型。'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# 雙鑽設計模型

<a id="top-dd"></a>

經過需求分析和使用者訪談，我們往往會得到很多材料：不同使用者的經歷、現有工具的問題，以及若干可能的改進方向。材料變多之後，新的困難是如何取捨。

如果沒有區分“理解問題”和“設計方案”，人們很容易一邊訪談，一邊為自己偏好的功能尋找理由。雙鑽模型（Double Diamond）用兩次發散和收斂將這兩類工作分開。

本章介紹 Discover、Define、Develop 和 Deliver 四個階段，並說明每個階段的輸入、產出和常見錯誤。

<a id="dd-what"></a>
## [1. 兩次發散與收斂](#top-dd)

雙鑽模型是英國 **Design Council** 推廣的設計流程框架。它用兩個連續的鑽石表示問題空間和方案空間。

每個鑽石包含兩個過程：

- **發散**：先把視野打開，看更多可能性
- **收斂**：再把範圍縮小，做出判斷和取捨

整個過程一共四步：

1. **Discover**：廣泛瞭解使用者、問題、環境和市場
2. **Define**：從大量資訊裡提煉出真正值得解決的核心問題
3. **Develop**：圍繞核心問題發散多種解決方案
4. **Deliver**：篩選、原型、測試並交付更合適的方案

前兩個階段處理問題空間，後兩個階段處理方案空間。

<figure class="field-figure field-figure--diagram">
  <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/design-council-double-diamond-wide.png" alt="Design Council 官方雙鑽圖：Discover、Define、Develop 和 Deliver 組成兩個相連的鑽石" loading="lazy" />
  </a>
  <figcaption><strong>先看原圖：</strong>左邊的鑽石從 Discover 發散到 Define 收斂，右邊從 Develop 再次發散到 Deliver 收斂。Design Council 同時指出，這不是只能向前走一次的直線流程；測試中發現問題時，可以回到前面的階段。圖片來源：<a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">Design Council</a>，<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

## 2. 為什麼要把問題和方案分開

一種常見的產品開發過程如下：

- 想到一個點子
- 覺得這個方向很酷
- 馬上開始畫原型
- 做著做著發現功能越來越多
- 最後不知道自己到底在解決什麼問題

雙鑽模型將“理解問題”和“設計方案”分開。這樣可以檢查下列情況：

- 選錯了問題
- 誤解了使用者
- 過早鎖定瞭解決方案
- 把大量時間花在細節打磨上，卻沒有驗證方向

因此，進入下一階段前應檢查：

- 不要因為想法順手，就默認問題已經成立
- 不要因為方案能做出來，就默認它值得做
- 不要因為原型看起來完整，就默認使用者會真的需要

這三句話針對的是同一個錯誤：把“已經投入了多少”視為“方向是否正確”的證據。原型只能證明團隊做出了什麼；使用者訪談、現場觀察和真實使用，才能說明問題是否存在。

<a id="dd-first"></a>
## [3. 第一個鑽石：問題空間](#top-dd)

第一個鑽石關注的是 **問題本身** ，而不是解決方案。

在這個鑽石中，產出是問題定義，而不是產品原型。

### 3.1 Discover：先把問題空間打開

Discover 階段的核心任務，是 **廣泛研究，而不是快速下結論。**

這一步通常會做的事情包括：

- 看使用者在真實場景裡怎麼做
- 訪談潛在使用者，瞭解他們最近一次遇到問題是什麼時候
- 觀察他們現在怎麼湊合解決
- 看競品和替代方案都在怎麼處理
- 收集市場、流程、約束、上下游資訊

很多人會誤以為 Discover 就是“多看點資料”。其實更關鍵的是：**你要理解人和場景，而不只是搜一堆資訊。**

比如你想做一個“AI 幫忙整理會議紀要”的工具，在 Discover 階段更應該關注的是：

- 使用者開完會後到底哪裡最痛苦
- 是記錄難，還是整理難，還是同步難
- 他們現在是自己寫、讓實習生寫、錄音回聽，還是乾脆不整理
- 哪些會議場景最需要紀要，哪些根本不需要

這一步最重要的目標不是得出答案，而是 **別太早以為自己已經知道答案。**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-design-workshop.jpg" alt="Creative Commons 可用性研究工作坊現場，牆面貼著按訪談問題整理的大量便利貼" loading="lazy" />
  </a>
  <figcaption><strong>真實的 Discover 材料會很雜。</strong>Creative Commons 團隊在 2018 年的可用性研究中完成了 81 次訪談，並整理了另外 36 次既有訪談。照片裡的每張紙對應一個問題，便利貼記錄受訪者的回答，圓點用於標記和比較。此時團隊先保留差異，還沒有急著把材料壓成一個答案。照片與案例：<a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>，<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

### 3.2 Define：從一堆資訊裡提煉出核心問題

如果 Discover 是打開視野，Define 就是開始收束。

Define 階段要做的，不是把所有觀察都保留下來，而是問：

- 真正最值得優先解決的問題是哪一個
- 哪個問題最常出現、最痛、最有價值
- 我們第一版到底只盯住哪一個場景

這一步的核心，是把一個寬泛話題，收斂成一個清楚問題定義。

比如你一開始說：

> 我想做一個提高開會效率的 AI 工具。

到了 Define 階段，更好的表達可能會變成：

> 我們先解決項目型團隊在 30 到 60 分鐘協作會議結束後，無法在 10 分鐘內輸出帶待辦、責任人和截止時間的紀要這個問題。

這時候問題就開始變清楚了：

- 使用者是誰
- 場景是什麼
- 卡點是什麼
- 成功標准是什麼

Define 的本質，就是 **從“問題很多”收斂到“這次先解決哪一個問題”。**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-research-synthesis.jpg" alt="Creative Commons 團隊將訪談便利貼排列、聚類並標記主題的研究歸納牆" loading="lazy" />
  </a>
  <figcaption><strong>Define 不是挑一句最順耳的話。</strong>同一案例中，團隊把 117 次訪談彙整、聚類並尋找重複模式，最後提煉出 9 條洞察。圖中的空白、分組和不同顏色，正是從原始回答走向主題和優先級的中間過程。照片與案例：<a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>，<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

## 4. 第二個鑽石：方案空間

當你完成第一個鑽石後，才真正適合進入第二個鑽石。因為這時你解決的不是一個模糊方向，而是一個被收斂過的具體問題。

### 4.1 Develop：圍繞核心問題發散方案

Develop 階段的重點，是 **圍繞同一個問題，探索多種可能方案。**

注意，這裡的發散和 Discover 階段不一樣。

- Discover 的發散，是在探索問題空間
- Develop 的發散，是在探索解決方案空間

比如還是會議紀要這個例子，到了 Develop 階段，你可以開始想：

- 是做網頁工具，還是會議插件
- 是上傳錄音後處理，還是實時記錄
- 是只做摘要，還是重點做待辦提取
- 是強調個人效率，還是強調團隊同步
- 是給使用者自由編輯，還是直接輸出結構化模板

這一步很適合腦暴，也很適合和團隊一起把方案拉開。

但這裡有一個前提：**所有方案都必須服務同一個已定義的問題。**
如果問題沒定義清楚，Develop 很容易又重新變成功能亂飛。

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/develop-idea-board.jpg" alt="Wikimedia Deutschland 設計思維工作坊的方案白板，不同顏色便利貼被分布在多個候選方向中" loading="lazy" />
  </a>
  <figcaption><strong>Develop 先保留多個答案。</strong>這塊白板來自 Wikimedia Deutschland 的設計思維工作坊。候選想法按主題散開放置，還沒有被壓成一套功能清單。發散的價值不是便利貼數量，而是讓團隊在選方案之前真正比較過不同路徑。照片：<a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">Corinna Schuster（WMDE）/ Wikimedia Commons</a>，<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

### 4.2 Deliver：選擇方案、做原型、測試和交付

Deliver 階段是第二個鑽石裡的收斂階段。

這時你要做的不是繼續想更多，而是開始判斷：

- 哪個方案最適合當前階段
- 哪個版本最小但最有用
- 哪些功能必須先做，哪些可以以後再說
- 怎麼做原型、測試和小範圍驗證

很多人以為 Deliver 就等於“上線”。其實它更准確的意思是：**把一個方案變成可測試、可驗證、可迭代的內容。**

它可能是：

- 一張低擬真流程圖
- 一個 Figma 原型
- 一個可運行的 MVP
- 一次小規模使用者測試
- 一輪真實回饋後的迭代版本

Deliver 的重點不是“完美交付”，而是 **盡快把方案放進真實環境裡驗證。**

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/paper-prototype-test.jpg" alt="一隻手正在紙面原型的輸入框中書寫，模擬使用者與尚未開發的界面交互" loading="lazy" />
  </a>
  <figcaption><strong>可測試，不等於已經寫完程式碼。</strong>紙面原型把界面畫在紙上，由參與者點擊、填寫，研究者再替換下一張頁面。它足以檢查流程、文字和操作順序，卻避免團隊先花幾周實現一個可能錯誤的方向。照片：<a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">d_jan / Wikimedia Commons</a>，<a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>。</figcaption>
</figure>

## 5. 四個階段的區別

現在我們已經分別討論了四個階段。下面的圖將它們放在同一個過程中。選擇一個階段，並比較它的工作、產出和暫時不做的事情。

<DoubleDiamondNavigator />

## 6. 雙鑽模型最常見的誤區

### 6.1 還沒 Discover，就直接 Deliver

這是最常見的一種。很多人剛有想法就開畫原型、寫 PRD、接模型、做頁面。

問題不是你做得不認真，而是你可能根本還沒確認問題值不值得解決。

### 6.2 Discover 很久，但始終不 Define

另一種極端是一直研究、一直看資料、一直訪談，卻遲遲不敢收斂。

雙鑽不是讓你無限發散，而是提醒你：發散之後必須進入判斷和取捨。

### 6.3 Define 之後，又偷偷改問題

很多團隊會在 Develop 時因為某個方案更容易做，就反過來修改問題定義，讓它適配現有方案。

這很危險。因為你可能不是在解決問題，而是在為自己偏愛的方案找理由。

### 6.4 把 Deliver 誤解成“大而全上線”

Deliver 不是說必須把完整產品都做完才算結束。很多時候，一個可以測試的原型、一輪真實使用者試用，已經是很好的 deliver。

## 7. 在 AI 產品裡，雙鑽模型怎麼用

AI 產品特別容易掉進“能力先行”的坑裡，因為模型能力看起來太誘人了。你會很想直接去想：

- 要不要接多模態
- 要不要做 Agent
- 要不要加工作流
- 要不要接語音、圖像、聯網搜索

但雙鑽模型會逼你先問：

- 使用者到底在哪個環節真的卡住了
- 這個卡點是不是非 AI 不可
- 如果不用 AI，現有辦法到底哪裡最差
- AI 加進去之後，最核心的進展是什麼

這能幫你避免一種常見情況：**能力很強，價值很弱。**

一個實用的順序是：

1. 在 Discover 階段觀察使用者現在怎麼處理任務
2. 在 Define 階段把最痛的一個場景寫成一句清楚的問題定義
3. 在 Develop 階段再去比較哪些 AI 能力最適合服務這個問題
4. 在 Deliver 階段做一個最小版本，讓真實使用者測試

## 8. 可以直接套用的雙鑽模板

如果你正在做自己的產品，可以先按這個順序往下寫：

### Discover

- 我觀察到的使用者是誰？
- 他們最近一次遇到這個問題是什麼時候？
- 他們現在怎麼解決？
- 他們最煩、最慢、最不放心的地方是什麼？

### Define

- 這堆問題裡，最值得優先解決的是哪一個？
- 哪個場景最高頻，或者最關鍵？
- 我們第一版先只服務誰、只解決什麼？
- 成功解決後，使用者狀態會發生什麼變化？

### Develop

- 針對這個問題，有哪些可能方案？
- 哪些方案最輕、最快、最容易驗證？
- 哪些是必須做，哪些是以後再說？

<figure class="field-figure field-figure--portrait">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_Gruppenarbeit_2.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-group-workshop.jpg" alt="Wikimedia Deutschland 設計思維工作坊中，參與者圍桌動手製作方案" loading="lazy" />
  </a>
  <figcaption><strong>Develop 不是坐著等一個好點子。</strong>圖中的參與者正在剪裁、擺放和製作，把不同人的想法變成可以討論的內容。方案越早變得可見，就越容易比較、組合和捨棄。照片：Corinna Schuster（WMDE），<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

### Deliver

- 我們最小可以交付什麼來驗證這個方向？
- 是流程圖、原型，還是 MVP？
- 需要找誰測試？
- 測試後怎樣判斷要繼續、修改還是放棄？

## 9. 一個從零基礎也能看懂的例子

假設你想做一個“幫大學生准備求職簡歷”的 AI 工具。

很多人一開始就會直接進入第二個鑽石，開始想：

- 要不要一鍵美化
- 要不要智能改寫
- 要不要自動匹配 JD
- 要不要生成自我介紹

但按雙鑽模型，更好的過程會是這樣：

### 第一個鑽石

**Discover**

- 去聊應屆生最近一次改簡歷是什麼時候
- 看他們怎麼從舊簡歷改成新版本
- 瞭解他們最困擾的是“不會寫”“不會改”，還是“不會判斷好不好”

**Define**

- 最後收斂出一個更具體的問題：
- 不是“大學生不會做簡歷”
- 而是“第一次投遞實習的學生，很難把已有經歷改寫成貼合崗位的表達，因此拖延投遞”

### 第二個鑽石

**Develop**

- 想幾種方案：模板庫、AI 改寫、崗位對照、簡歷評分、案例參考

**Deliver**

- 第一版只做“根據崗位描述改寫經歷 bullet points”
- 給 5 個學生試用，看他們會不會更快投出第一版簡歷

你會發現，一旦第一個鑽石做扎實，第二個鑽石會清楚很多。

<figure class="field-figure field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_Prototyp_Mitmach-O-Mat.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-workshop-prototype.png" alt="Wikimedia Deutschland 設計思維工作坊產出的 Mitmach-O-Mat 手繪原型界面" loading="lazy" />
  </a>
  <figcaption><strong>原型只要足夠回答一個問題。</strong>這張工作坊產物沒有完整視覺系統，只有歡迎語、行動按鈕和一句說明，卻已經能拿去觀察參與者是否理解下一步。Deliver 的重點是獲得回饋，不是先把界面做得像成品。原型：Corinna Schuster / WMDE，<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

<a id="dd-ai"></a>
## [10. 在雙鑽流程中使用 AI](#top-dd)

AI 可以用於整理資訊、擴展候選方案和准備測試材料，但不能替代使用者證據或項目決策。

### 11.1 在 Discover 階段，用 AI 先做一輪資訊鋪墊

在正式訪談和研究前，你可以先讓 AI 幫你做一些輕量級問題掃描，比如：

- 市面上常見替代方案有哪些
- 使用者在公開社群裡最常抱怨什麼
- 這個問題常見於哪些場景和人群
- 現有產品通常忽略了什麼

這一步不能代替真實研究，但很適合幫你快速搭一個問題地圖。

一個很簡單的小白輸入可以是：

```text
我想做一個幫大學生改簡歷的工具。
你先別幫我想功能，先幫我看看大家在這個問題上最常遇到什麼麻煩。
```

AI 可能輸出：

```text
初步問題地圖：

1. 不知道該寫什麼經歷
2. 不知道怎麼針對崗位修改
3. 改了很多版還是不確定是否夠好
4. 需要別人幫看，但不方便總麻煩別人
5. 因為不確定，所以一直拖著不投
```

這種輸出的作用不是替你下結論，而是讓你更快進入 Discover。

### 11.2 在 Define 階段，讓 AI 幫你收斂問題定義

很多人收集了一堆資料之後，最難的是把問題收成一句真正清楚的話。你可以把研究筆記交給 AI，讓它幫你壓縮成幾個候選問題定義：

```text
下面是我在 Discover 階段收集到的使用者回饋和研究筆記：
[貼上內容]

請你幫我做三件事：
1. 歸納最常出現的問題模式
2. 按問題頻率、痛感和可驗證性，整理出 3 個值得優先解決的問題
3. 把每個問題寫成一句具體的問題定義
```

這樣你會更容易進入 Define，而不是一直停留在“問題好多”的狀態裡。

你甚至可以把輸入寫得非常簡單：

```text
我現在收集到的問題有：
1. 大家不知道簡歷寫什麼
2. 大家不知道怎麼改
3. 大家總覺得沒改好，不敢投

你幫我看看，第一版最適合先解決哪個問題。
```

AI 可能輸出：

```text
建議優先解決的問題：

“第一次投遞實習的學生，不確定簡歷是否已經達到可投遞水準，因此會反複修改並拖延投遞。”

原因：
1. 這個問題更具體
2. 它能解釋拖延行為
3. 更容易設計一個小版本去驗證
```

這類輸出很有用，因為它幫你從一堆模糊問題裡收出一個更像 MVP 起點的定義。

### 11.3 在 Develop 階段，用 AI 發散多個方案

很多人一定義完問題，就只盯著腦子裡第一個想到的方案。AI 在這一步很適合幫你強制發散：

```text
我已經定義了一個核心問題：[你的問題定義]
請你不要直接給我一個最終答案，而是從以下角度各提出 2-3 種解決方向：
1. 最輕量的 MVP
2. 最適合驗證需求的方案
3. 最適合提高體驗的方案
4. 不依賴 AI 的方案
5. 依賴 AI 的方案
最後請對比每種方案的優點、風險和驗證成本。
```

這樣你就不會太早被單一方案綁住。

一個簡單輸入可以是：

```text
我現在的問題定義是：
“大學生不確定簡歷是否已經可以投，所以一直拖著不投。”

請你幫我想 4 種不同解決方案，不要只給我一種。
```

AI 可能輸出：

```text
方案 1：簡歷可投遞檢查清單
方案 2：根據崗位描述做針對性改寫
方案 3：讓使用者上傳簡歷後給出風險提示
方案 4：提供優秀案例對照，幫助使用者判斷差距
```

這時你就更容易進入“比較方案”，而不是一上來只盯著 AI 改寫一個方向。

### 11.4 在 Deliver 階段，用 AI 幫你生成原型文案和測試材料

當你進入 Deliver 階段，AI 非常適合幫你加快這些工作：

- 生成低擬真原型裡的頁面文案
- 整理使用者測試腳本
- 生成可對比的多個版本標題、按鈕、說明語
- 整理測試後的回饋和問題列表

比如你可以讓 AI 幫你生成一個 20 分鐘使用者測試腳本，或者幫你把 5 個使用者回饋歸納成“繼續做 / 修改方向 / 暫停”的判斷依據。

比如一個最小輸入可以是：

```text
我做了一個很簡單的原型：
使用者上傳簡歷，系統告訴他哪些地方還不適合投遞。

請幫我生成一份 15 分鐘的使用者測試腳本。
```

AI 可能輸出：

```text
15 分鐘測試腳本：

1. 先請使用者描述最近一次投簡歷經歷
2. 讓使用者獨立完成上傳簡歷
3. 觀察他是否看得懂回饋結果
4. 詢問：這些提示裡哪些最有幫助，哪些讓你困惑
5. 詢問：如果下次投遞前，你會不會想再用一次
```

這種輸出很實用，因為它能幫你從“我做完原型了”走到“我接下來怎麼測”。

### 11.5 讓 AI 扮演“階段守門員”

雙鑽模型最常見的問題，是人會跳階段。你可以直接讓 AI 充當一個守門員，提醒你現在到底在哪一步：

```text
請你扮演產品流程教練。
下面是我當前的項目狀態：[你的描述]
請你判斷我現在更像處於 Discover、Define、Develop 還是 Deliver。
並告訴我：
1. 我是不是過早跳到了下一階段
2. 當前階段最該補的動作是什麼
3. 哪些事情現在先別做
```

這對新手特別有幫助，因為你很容易在“還沒想清楚問題時就開始畫原型”。

## 11. 小結

- Discover 和 Define 用於形成問題定義，Develop 和 Deliver 用於形成並驗證方案。
- 發散用於擴展候選項，收斂用於根據證據做出取捨。
- 問題定義應在方案探索之前完成，但可以根據後續測試結果修正。
- Deliver 的目標是獲得可用於學習的測試結果，不一定要交付完整產品。

## 12. 練習

<StageAssignmentCard title="用雙鑽模型整理你的點子">

  <ol>
    <li>選一個最近想做的點子，分別寫下發現、定義、發展和交付四步。</li>
    <li>把真正要解決的問題收成一句話。</li>
    <li>想出三種不同做法，再選擇其中一種。</li>
    <li>寫下一個可以在一周內做出來的最小版本。</li>
  </ol>

  <p>重點不是記住四個英文單詞，而是先把問題想清楚，再決定做什麼。</p>
</StageAssignmentCard>

## 延伸閱讀

這篇文章主要參考了 Design Council 關於 Double Diamond 的官方資料，適合繼續往下看：

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)

<style scoped>
.field-figure {
  margin: 24px 0 32px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.field-figure > a {
  display: block;
  background: #f4f4f1;
}

.field-figure img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.field-figure--diagram img {
  max-height: 580px;
  padding: 18px;
}

.field-figure--portrait img {
  max-height: 640px;
  object-fit: contain;
}

.field-figure--artifact img {
  padding: 20px;
  background: #f4f1eb;
  object-fit: contain;
}

.field-figure figcaption {
  padding: 13px 16px 15px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.field-figure figcaption strong {
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .field-figure {
    margin: 20px 0 28px;
  }

  .field-figure--diagram img {
    padding: 8px;
  }
}
</style>

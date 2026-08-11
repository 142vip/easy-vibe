---
title: '如何學習本課程'
description: '從零開始學習發現問題、驗證需求、構建 AI 產品並交付真實使用者，逐步成長為能夠對產品結果負責的產品工程師。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['zh-tw/stage-1/learning-map'] ?? []
</script>

# 如何學習本課程

::: info 特別感謝
本教程的核心貢獻者與測試者來自 **清華大學深圳國際研究生院**。感謝同學們在實際學習和操作中不斷指出問題、提出建議並參與修改，讓教程更清晰、更可靠，也更貼近初學者的真實需要。[**👉 查看完整貢獻者名單**](https://github.com/datawhalechina/easy-vibe#-contributing--contributors)
:::

以前做軟體，門檻很高：你要學習編程語言、開發工具和大量技術知識，才能把一個想法變成可以運行的程序。大語言模型和 AI 編程工具改變了這件事——人開始可以直接用自然語言描述意圖，讓 AI 幫助生成程式碼、搭建界面和修改功能。

## 從 Vibe Coding 到 Build Product

**[Vibe Coding](https://www.merriam-webster.com/dictionary/vibe%20coding) 這個說法出現於 2025 年 2 月 2 日。** AI 研究者 Andrej Karpathy 用它描述一種新的編程方式：人主要通過自然語言告訴 AI 想要什麼，觀察運行結果，再繼續對話和修改，而不必從頭手寫、理解和管理每一行程式碼。

> **什麼是 Vibe Coding？**
> 簡單說，就是“用說話來編程”：描述想法，讓 AI 生成程序，運行看看，再通過對話不斷調整。

它最先帶來的突破，是讓更多人跨過了“不會寫程式碼，所以無法開始”的門檻。一個沒有編程經驗的人，也可以在幾分鐘內做出小遊戲、網頁或可以演示的原型。

<figure class="concept-illustration">
  <img src="../../../zh-cn/stage-1/learning-map/images/vibe-coding-to-product.png" alt="一位創作者借助 AI 將自然語言想法變成產品原型，交給真實使用者使用，並根據反饋繼續迭代" loading="lazy">
  <figcaption>Vibe Coding 幫助你跨過“做出來”的門檻；Build Product 要繼續走向真實使用者、反饋與價值。</figcaption>
</figure>

這是一個巨大的變化：**人與計算機溝通的方式，正在從嚴格的編程語法延伸到自然語言。**

但當“做出一個能運行的 Demo”越來越容易，新的問題就出現了：

- 應該做什麼，而不只是能做什麼？
- 它為誰解決問題，使用者真的需要嗎？
- AI 生成的第一版，怎樣變成穩定、清楚、可以持續修改的產品？
- 怎樣把產品交給使用者，而不只是在自己的電腦上運行？
- 怎樣通過使用、反饋和付費，證明它確實創造了價值？

因此，Vibe Coding 並沒有消除學習要求，而是**改變並提高了要求**。

只看 Coding，目標是讓程式碼運行；真正 Build Product，則要對從問題到結果的完整過程負責：

> **Coding：我能不能把它做出來？**<br>
> **Build Product：它值不值得做，誰會使用，我怎樣把它交付出去，又怎樣知道它真的有效？**

Vibe Coding 是這門課的起點，但不是終點。我們會先讓你快速做出東西，再逐步學習怎樣選擇問題、驗證需求、設計方案、構建產品、接觸使用者和根據結果迭代。

::: tip 這門課真正想培養什麼？
這門課不只是教你使用 AI 編程工具，而是希望幫助你成為一名初步的**產品工程師（Product Engineer）**：能夠發現問題、驗證需求、親手構建產品、交付真實使用者，並根據結果繼續迭代的人。
:::

## 為什麼現在需要產品工程師？

產品工程師並不是 2026 年突然出現的新職業。

早在 2018 年，Intercom 就用 Product Engineer 描述一種具有產品所有權的工程師：他不只是實現別人已經設計好的功能，也要理解客戶、參與產品判斷，並持續改進自己交付的產品。

AI 帶來的新變化，是大幅降低了“做出來”的成本，也讓工程師有機會承擔更多過去由不同角色分工完成的工作。借助大模型和編程 Agent，一個人更容易跨越原型、界面、前後端、AI 能力集成、測試和部署。於是，崗位要求也開始從“完成程式碼”繼續向前延伸：直接理解使用者、驗證方案、推動採用，並對業務結果負責。

### 從“參與產品”到“負責結果”

下面是這條變化的幾個真實時間點：

| 時間 | 公司與崗位 | 崗位釋放的信號 |
| --- | --- | --- |
| 2018 年 5 月 | [Intercom：Product Engineer](https://www.intercom.com/blog/making-the-transition-from-consultant-to-product-engineer/) | 工程師同時也是產品人，要理解客戶並參與決定產品應該怎樣發展 |
| 2026 年 2 月 | [Hamilton AI：Product Engineer](https://jobs.ashbyhq.com/hamilton-ai/78c69fe9-828d-44b3-abe6-af56a2badf76/) | 直接與客戶交流，把一次客戶對話變成可以使用的產品，再交給真實使用者驗證 |
| 2026 年 6 月 | [Alma：Product Engineer - AI](https://jobs.ashbyhq.com/tryalma/8021fb35-fc1e-4950-a078-afc0e89d9856) | 同一個人設計 Agent、編寫後端、完成界面，並觀察律師和客戶怎樣使用產品 |
| 2026 年 7 月 | [Harper：Product Engineer](https://jobs.ashbyhq.com/harperinsure/7d678dba-885a-4432-94c7-a9c20852db35) | 深入銷售、客服和承保現場，對轉化率等業務指標負責，而不只對功能上線負責 |
| 2026 年 8 月 | [Paradigm：Product Engineer, Applied AI](https://jobs.ashbyhq.com/Paradigm/b85b9094-2467-4f49-9a36-ca93da34a3f5) | 進入投資、研究和業務團隊發現問題，構建內部與開源產品，並用實踐尋找新機會 |
| 截至 2026 年 8 月 | [OpenAI：Forward Deployed Engineer](https://openai.com/careers/forward-deployed-engineer-%28fde%29-seattle-seattle/) | 從問題發現、技術規劃、系統構建到生產部署全程負責，用採用率和工作流影響衡量成功 |

<details>
<summary><strong>查看更多不同行業的真實崗位</strong></summary>

這些案例來自航空、法律、保險、金融合規、生物醫藥、工業、企業服務和 AI 基礎設施等不同領域。

| 發布時間 | 公司與崗位 | 需要完成的閉環 |
| --- | --- | --- |
| 2026 年 2 月 | [Sphinx：Product Engineer](https://jobs.ashbyhq.com/Sphinx/08bdb9eb-4b6c-44ab-9615-3bb6b908d008) | 從客戶交流中選擇機會，快速做原型、測試，再用結果影響產品路線圖 |
| 2026 年 3 月 | [Hyperscale：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/hyperscale/950c982f-5fb9-481b-a6ad-808feba76757) | 參與技術調研、PoC、現場實施和企業銷售，用技術工作幫助贏得客戶 |
| 2026 年 4 月 | [Sphere：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/sphere/7b5f39b0-6f3f-4bc4-9469-74ae9722d85a) | 從客戶發現做到部署，並把客戶需求轉化成通用產品能力 |
| 2026 年 5 月 | [Avent：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/avent-industrial-inc/bf8337c2-00cf-4ca7-aa43-b4c29e4b8083) | 理解客戶業務、編寫程式碼、集成系統，對客戶成功上線負責 |
| 2026 年 5 月 | [Tamarind Bio：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/tamarindbio/be678c9b-984e-4a0a-aedc-a87187e18748/) | 覆蓋第一次技術溝通、試點、生產部署和擴展，參與 Demo 與銷售週期 |
| 2026 年 6 月 | [Protege：Forward Deployed Engineer, New Verticals](https://jobs.ashbyhq.com/protege/b62ebf3e-e07f-4f67-bc9c-4787f23fe449/) | 從早期客戶需求中建立新業務方向，把有效做法沈澱進平台 |
| 2026 年 6 月 | [Dataleap：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/dataleap/6afe756f-fea9-42fc-82ed-621c72a99387/) | 進入企業現場尋找重要工作流、構建 Agent、完成集成並教會客戶使用 |
| 2026 年 6 月 | [Collinear AI：Product Engineer](https://jobs.ashbyhq.com/collinear-ai/4d4af6b1-bfc7-4a28-9d86-5bab73e6e396) | 橫跨後端、前端、API、使用者體驗、測試和線上質量，把複雜 AI 變成可用產品 |
| 2026 年 7 月 | [Restate：Forward Deployed Engineer](https://jobs.ashbyhq.com/restate/c9419551-7f51-4691-8ba9-d80a27f1e284) | 負責 PoC、生產就緒和部署，把一次性交付沈澱為可重復模式 |
| 截至 2026 年 8 月 | [Scale AI：Forward Deployed Engineer, GenAI](https://scale.com/careers/4593571005) | 直接面對技術客戶，完成端到端開發和快速實驗，並影響產品路線圖 |

</details>

::: details 調查的時間口徑
本頁於 **2026 年 8 月 9 日** 整理。帶具體日期的 Ashby 招聘崗位，時間取自其公開招聘接口中的 `publishedAt` 字段；未展示發布日期的公司頁面以本頁核查時間為準。招聘頁面可能在崗位關閉後失效。

以上內容是對一組真實崗位的觀察，不是對整個就業市場的統計。它更適合說明 AI 原生公司和小型產品團隊正在出現的能力方向，而不是說明所有公司都會取消產品、設計、工程和銷售的專業分工。
:::

### 這些崗位正在發生什麼變化？

- **工作的起點變了：** 不再等別人寫好需求，而是直接進入使用者和業務現場發現問題。
- **原型的作用變了：** 不只是展示技術，而是盡快交給使用者，用來驗證判斷。
- **工程的邊界變了：** 從單一技術模塊擴展到界面、後端、AI、部署和使用者體驗。
- **成功的標準變了：** 從“功能上線”轉向採用率、效率提升、轉化率、收入和真實影響。
- **與銷售的關係變了：** 一部分產品工程師開始參與 Demo、PoC 和客戶上線，用技術證明產品價值。

這裡的“會銷售”，並不是要求每個人都成為傳統銷售。對產品工程師來說，它首先意味著：**能夠找到可能需要產品的人，聽懂他們的問題，演示解決方案，邀請他們使用，並驗證他們是否願意持續使用或付費。**

### Product Engineer、FDE 和 OPC 是什麼關係？

這三個概念處在同一條能力鏈上，但並不是同一種東西。

| 概念 | 它是什麼 | 主要工作場景 | 需要負責到哪裡 |
| --- | --- | --- | --- |
| **Product Engineer** | 一種產品與工程融合的崗位 | 在產品團隊內部工作 | 從問題和方案負責到產品上線、使用者反饋與業務指標 |
| **FDE（Forward Deployed Engineer）** | 產品工程能力向客戶現場的延伸 | 深入企業客戶、真實業務和生產環境 | 從客戶發現、PoC 和集成負責到部署、採用、擴展，有時直接參與銷售週期 |
| **OPC（One-Person Company）** | 一種由個人主導的公司經營方式，不是職位名稱 | 一個人借助 AI Agent、自動化平台和外部服務經營產品 | 從找市場、做產品負責到營銷、銷售、交付、客服和現金流 |

<div class="role-path-figure" role="img" aria-label="產品工程師、FDE 和 OPC 的能力範圍逐步從做出產品擴展到客戶現場和完整生意">
  <div class="role-path-node">
    <strong>Product Engineer</strong>
    <span>做出正確的產品</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>FDE</strong>
    <span>讓產品進入客戶現場</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>OPC</strong>
    <span>經營一門完整生意</span>
  </div>
</div>
<p class="role-path-caption">這不是必須依次晉升的職業階梯，而是同一套產品工程能力可以覆蓋的不同範圍。</p>

可以把它們理解成三個逐漸擴大的圓：

> **Product Engineer：把產品做對並做出來**<br>
> **FDE：把產品帶進客戶現場並產生結果**<br>
> **OPC：用同一套能力經營一門完整生意**

#### FDE：工程師開始進入客戶現場

FDE 並不是只負責安裝軟體的實施人員，也不是只做演示的售前工程師。AI 公司的 FDE 通常要同時完成四件事：

1. 和客戶一起找到最值得解決的問題。
2. 快速做出原型或 PoC，證明技術與業務價值。
3. 編寫生產程式碼，把方案接入客戶的真實資料和工作流。
4. 觀察採用效果，把重復出現的需求沈澱成通用產品。

截至 2026 年 8 月，OpenAI 已經在多個國家和城市招聘 FDE，並把崗位成功標準寫成生產採用率、可衡量的工作流影響，以及能夠改變產品和模型路線圖的現場反饋。這說明 FDE 正在從少數企業軟體公司的特殊模式，擴展為 AI 落地的重要崗位形態。

#### OPC：一個人也可以擁有一支“數字團隊”

這裡說的 OPC，不特指法律意義上的“一人公司”，而是指 **One-Person Company：由一個人主導經營，盡可能利用軟體、AI Agent 和外部基礎設施完成過去需要多人協作的工作。**

它也不是完全由 AI 自動運行的“無人公司”。創始人仍然需要判斷市場、承擔責任、接觸使用者並做關鍵決策；AI 更像是一支可以被調度的數字團隊。

這條趨勢並非完全從 AI 開始。獨立開發者 Pieter Levels 在自己的官網上介紹，他長期獨自構建和經營 Nomads.com、Remote OK、Photo AI 和 Interior AI 等產品。AI 讓這種模式能夠進一步覆蓋設計、編程、內容、分析和客服，但最終仍然要經過真實市場驗證。[查看 Pieter Levels 的專案記錄](https://levels.io/projects/)

到了 2025 年，Microsoft 的 Work Trend Index 開始使用 **Agent Boss** 描述能夠創建、委派和管理 AI Agent 的工作者。該報告基於 31 個國家的 31,000 名工作者調查，並顯示 81% 的領導者預計未來 12～18 個月會把 Agent 中度或深度納入 AI 戰略。[查看 Microsoft 2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)

2025 年 6 月，Wix 以約 8,000 萬美元收購自然語言應用開發平台 Base44。Base44 並不是嚴格意義上的 OPC，但它展示了一個重要基礎條件：資料庫、身份認證、部署等過去需要多種專業角色協作的工作，正在被對話式產品封裝和自動化。[查看 Wix 收購公告](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif)

因此，“第一家一人獨角獸什麼時候出現”目前仍然是一種預測，不應該被寫成已經發生的事實。更值得初學者關注的現實變化是：**一個人已經可以用更少的資金和團隊，更快完成產品驗證，並經營一門規模不大但真實賺錢的業務。**

::: tip 為什麼課程要同時講這三條路徑？
無論你以後進入產品團隊、成為 FDE，還是嘗試經營自己的 OPC，起點都是同一套產品工程基本功：發現真實問題、做出最小產品、交給使用者、說明價值，並根據使用和付費結果繼續迭代。
:::

因此，這門課訓練的不是幾個彼此分開的職位，而是一次完整的產品循環：

> **發現問題 → 驗證需求 → 設計方案 → 構建產品 → 交付使用者 → 說明價值 → 觀察結果 → 持續迭代**

當然，讓 AI 寫出程式碼只是第一步。要做出一個真正能用的產品，你還會遇到這些問題：

- 怎麼讓 AI 寫出乾淨、能維護的程式碼？
- 怎麼把零散的程式碼拼成一個能跑的應用？
- 怎麼讓應用真正上線、被人用到？
- 怎麼把文本生成、圖像識別這些 AI 能力裝進你的產品？
- 怎麼判斷使用者是否真的需要它，甚至願意為它付費？

這些問題將在這門課中找到答案。

不管你是學生、老師、醫生、工人，還是任何一位對技術一竅不通的普通人，你都不需要先學幾年編程，才能開始製作和驗證自己的第一個產品原型。

| 你的身份 | 這門課能幫你 |
|---------|-------------|
| 學生 | 作業、比賽、創業，自己動手做專案，不再求人 |
| 職場人 | 把重復工作自動化，提升效率，甚至開發副業 |
| 產品經理 / 設計師 | 想法不再停留在紙面，能快速做出 Demo 並交給使用者驗證 |
| 創業者 / 中小企業主 | 低成本驗證想法，不用先組建完整團隊也能做出 MVP |
| 老師 / 教育工作者 | 製作教學工具、課件、自動化出題，提升教學效率 |
| 醫生 / 律師 / 專業工作者 | 把專業流程自動化，打造自己的效率工具 |
| 任何人 | 用 AI 解決生活/工作中的具體問題，讓不可能變成可能 |

AI 可以降低實現成本，但真正決定產品價值的，仍然是你能否發現真實問題，並把解決方案交到使用者手裡。

## 成長路徑：從“會用 AI”到“成為產品工程師”

<div class="stage-intro">
  <div class="stage-card">
    <div class="stage-icon">🎮</div>
    <h3>新手入門</h3>
    <p class="stage-role">體驗 AI 編程</p>
    <div class="stage-tags">
      <span>貪吃蛇小遊戲</span>
      <span>零基礎上手</span>
      <span>Vibecoding 初體驗</span>
      <span>幾分鐘生成</span>
    </div>
  </div>
</div>

<div class="stage-grid">
  <div class="stage-card">
    <div class="stage-icon">🛠️</div>
    <h3>第一階段</h3>
    <p class="stage-role">產品工程師入門</p>
    <div class="stage-tags">
      <span>AI IDE (Cursor/Claude)</span>
      <span>需求驗證 & 原型</span>
      <span>接入 AI 能力</span>
      <span>交付真實使用者</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">💻</div>
    <h3>第二階段</h3>
    <p class="stage-role">全棧產品工程師</p>
    <div class="stage-tags">
      <span>Figma 到程式碼</span>
      <span>Supabase 資料庫</span>
      <span>Stripe 支付集成</span>
      <span>Dify 知識庫</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">🚀</div>
    <h3>第三階段</h3>
    <p class="stage-role">AI 產品工程師 / 技術負責人</p>
    <div class="stage-tags">
      <span>Web/小程序/多端</span>
      <span>MCP 高級工具</span>
      <span>RAG & LangGraph</span>
      <span>高級工程師思維</span>
    </div>
  </div>
</div>

<style>
.concept-illustration {
  margin: 24px 0 12px;
}

.concept-illustration img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.concept-illustration figcaption,
.role-path-caption {
  margin: 8px 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
}

.role-path-figure {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  margin: 24px 0 0;
}

.role-path-node {
  display: flex;
  min-height: 112px;
  padding: 18px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg));
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.role-path-node strong {
  color: var(--vp-c-brand-1);
  font-size: 1rem;
}

.role-path-node span {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.role-path-arrow::before {
  color: var(--vp-c-brand-1);
  content: '→';
  font-size: 1.25rem;
  font-weight: 700;
}

.stage-intro {
  margin: 20px auto;
  max-width: 400px;
}

.stage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.stage-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  padding: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.stage-card:hover {
  transform: translateY(-2px);
  background-color: var(--vp-c-bg-mute);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border-color: var(--vp-c-brand);
}

.stage-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  line-height: 1;
}

.stage-card h3 {
  margin: 0 0 4px 0 !important;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
}

.stage-role {
  margin: 0 0 8px 0 !important;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-weight: 500;
}

.stage-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

.stage-tags span {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 3px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.stage-card:hover .stage-tags span {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-dark);
}

@media (max-width: 720px) {
  .role-path-figure {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .role-path-node {
    min-height: 88px;
  }

  .role-path-arrow {
    text-align: center;
  }

  .role-path-arrow::before {
    content: '↓';
  }
}
</style>

通過這個完整的學習路徑，你將獲得：

- **Vibe Coding開發能力：** 熟練使用 vibecoding 思維和 AI 編碼工具，將開發效率提升數倍。不再需要死記硬背語法，而是學會如何引導 AI 生成高質量程式碼。
- **全棧開發技能：** 從 UI 設計到前端實現，從資料庫設計到 API 開發，從本機開發到雲端部署，掌握現代 Web 應用的完整技術棧。
- **AI 能力集成：** 學會調用各類多模態 AI API，將文本、圖像、語音等 AI 能力無縫集成到你的應用中，並通過 RAG 等技術構建智能化產品。
- **產品思維與運營能力：** 從使用者研究到需求拆解，從 MVP 設計到產品迭代，從支付集成到使用者管理，形成完整的產品開發與運營閉環。

# 學完能做什麼？

## 第一階段：做出你的第一個產品原型

這個階段適合完全沒編程基礎，或者只會一點點但不太自信的同學。你不用先學一堆理論知識，而是直接跟著做，在做的過程中學會用 AI 工具寫程式碼。

**學完你能**：
- 用 AI 編程工具獨立完成一個網頁應用
- 把產品想法變成能點擊、能交互的原型
- 給原型加上 AI 功能（比如文生圖、智能對話）
- 遇到報錯知道怎麼排查和解決

簡單說，就是能做出一個"能跑、能給別人演示"的東西。

我們可以先通過小遊戲感受 AI 編程，然後學會用 AI 編程工具幫你寫程式碼、改報錯。接著從簡單頁面開始，逐步做出能交互的多頁面應用，再加上文生圖、智能對話這些 AI 功能。最後獨立完成一個完整專案，讓你的創意能夠真正擁有落地的可能。

# 為什麼要用專案制來訓練？

> **現實世界的挑戰**
>
> 原因其實很簡單：按照大多數同學現在的狀態，直接走入職場，很可能會在真實專案和老闆 / 客戶的“社會毒打”下寸步難行。現實世界更常見的場景是：

> 你的導師 / 老闆：我們要做一個 xxx，目標是達到 yyy 的效果。
>
> 文檔？現成框架？詳細的需求說明？很多時候都不存在。

真實工作中的許多任務，本質上就是在高度不確定的環境下解決從未見過的問題：需求是模糊的，邊界是變化的，沒人告訴你標準答案，你需要自己查資料、做實驗、搭原型、不斷迭代，最後給出一個“能跑、能用、能上線”的解決方案。

這門課想做的，就是在一個相對安全的環境裡，提前給你一次“模擬社會毒打”：

- 通過看似有一定難度的專案任務，迫使你練習拆解問題、設計方案、自己尋找資料
- 通過不那麼“傻瓜化”的腳手架和程式碼，讓你學會閱讀、理解和改造一份中大型程式碼庫
- 通過從創意到上線的完整閉環，讓你體驗真實產品從 0 到 1 的完整過程

短期來看，這種訓練確實比較折磨人；但從長期來看，它會極大提高你在求職和職業發展中的競爭力：你會更能扛事兒，更能在不確定環境中找到突破口，也更有能力把 AI 變成真正落地的產品，而不是停留在“玩玩 Demo”階段。

# 提問的藝術：AI 時代的必備技能

在 AI 時代，提問也屬於一種 “基本功”。同一份程式碼、同一個報錯，**你怎麼提問，幾乎決定了 AI 能給出怎樣的答案**：是泛泛而談，還是一步一步給出可落地的改法。

**養成好習慣**：把“向 AI 提問”當成日常開發流程的一部分：遇到不懂、卡住的問題就立刻問。

## 為什麼這是必備技能？

- **現實很少有完整文檔**：更多時候你面對的是不清晰的需求、半成品程式碼、零散的錯誤資訊
- **AI 是你隨身的導師 + 同事**：會提問的人，能把它變成“高質量的結對編程”
- **能力上限由溝通決定**：你越能提供關鍵資訊、越能約束輸出格式，答案越可用

**常見誤區**：只問一句“為啥報錯？”通常只能得到一堆猜測。把上下文補齊，才會得到可執行的方案。

## 如何把資訊"餵給"AI：截圖 vs 複製粘貼

兩種方式都可以，但用途不同：

| 方式         | 適用場景                                  | 關鍵要求                                  |
| ------------ | ----------------------------------------- | ----------------------------------------- |
| **複製粘貼** | 報錯堆棧、日誌、程式碼、配置、API 返回      | 盡量完整，不要只截一行關鍵字              |
| **截圖**     | UI 佈局問題、交互異常、工具界面找不到按鈕 | 截全屏 + 標注重點區域，最好配一句文字說明 |

::: danger ⚠️ 重要前提
**並非所有 AI 都支持圖片輸入。** 截圖溝通需要 AI 具備多模態能力（即能夠理解和分析圖片）。目前支持圖片輸入的 AI 包括：Claude (Anthropic)、GPT-4V/GPT-4o (OpenAI)、Gemini (Google)、以及部分國產大模型如通義千問、文心一言等。

**如果你使用的 AI 不支持圖片輸入**，截圖將無法被識別，此時請改用複製粘貼文字的方式溝通。
:::

## 讓 AI “解釋得很好”的提示詞技巧

如果你不是只要答案，而是要“學會”答案。使用類似下面指令能顯著提升解釋質量：

> **學習型提問示例**
>
> - “請先用 5 句話講清楚這個概念，再給幾個問題提問我驗證我理解對了沒。”
> - ”請你詳細解釋一下這個報錯資訊，我不理解為什麼會報錯。”

# 堅持了好久還是搞不定，我想放棄了

也許是你堅持的方法不對。不要一個人在黑暗中硬撐，可以來跟作者和助教們聊聊：把你已經嘗試過的方法、遇到的具體卡點、和你目前的心理狀態，坦誠地說出來。很多時候，只要稍微調整一下方向、補上一個關鍵知識點，你就能繼續往前走。

# 我覺得教程有的設計不合理

歡迎隨時聯繫作者、提交 issue，或者在群裡 / 課堂上直接反饋。我們非常希望和你一起把這套教程打磨得越來越好：哪裡不清晰、哪裡體驗不好、哪裡讓你白費力氣，都可以坦誠指出來。越真實、越具體的反饋，越能幫助後來者少踩坑。

# Reference

- [南京大學 計算機科學與技術系 計算機系統基礎 課程實驗](https://nju-projectn.github.io/ics-pa-gitbook/ics2025/)

<RelatedArticlesSection
  title="接下來可以學什麼"
  description="按“從會用 AI 到會做產品”的路線，繼續向前推進。"
  :items="relatedArticles"
/>

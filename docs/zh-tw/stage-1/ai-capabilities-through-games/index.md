# 初級一：AI 時代，會說話就會程式設計

這是一個**基於專案制學習**的學習教程。我們鼓勵你跟隨步驟一步步操作，並嘗試復現結果。
不要擔心犯錯或修改內容，我們永遠相信你可以做到，請你永遠記住：

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">完成比完美更重要 🐣</span>
</div>
</div>

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = '約 <strong>4 小時</strong>，可分多次完成'
const relatedArticles =
  relatedArticlesMap['zh-tw/stage-1/ai-capabilities-through-games'] ?? []
</script>

## 本章導讀

<ChapterIntroduction :duration="duration" :tags="['對話式 AI 程式設計', 'AI 原生小遊戲', '貪喫蛇實戰']" coreOutput="AI 原生貪喫蛇 + 自創小遊戲" expectedOutput="1 個可執行的 AI 原生貪喫蛇 + （可選）1 個你自創的 AI 原生小遊戲或 Demo">

如果你<strong>完全不會程式設計</strong>，或者只會一點皮毛，這一章就是為你準備的。我們會從最基礎的開始：用<strong>對話的方式</strong>讓 AI 幫你寫程式碼，不需要記語法、不需要配環境，直接在網頁上就能跑起來。

你會親手做出<strong>第一個能執行的程式</strong>——一款會"喫單詞、寫詩、畫畫"的貪喫蛇。透過這個實戰，你會體驗到 AI 程式設計到底是什麼感覺：不是 AI 代替你思考，而是你把想法說出來，AI 幫你實現。

所有的創造都是從 0 到 1 開始的，很高興能將每一份信心與專業度傳遞與你，於你而言，<strong>執行力 is all you need</strong>。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: '困境與機會', description: '普通人的程式設計新可能' },
      { title: '能力初探', description: '60秒極速開發體驗' },
      { title: '原生實戰', description: '打造AI原生貪喫蛇' },
      { title: '拓展創造', description: '舉一反三做遊戲' }
    ]" />
  </ClientOnly>
</div>

## 1. 普通人的困境與機會

很多人腦子裡有一堆產品點子：一款幫自己記賬的小工具、一個記錄孩子成長的網頁、甚至一款小遊戲。但一想到要寫程式碼、要找程式設計師，就直接勸退。

AI 出現之後，第一次給了普通人一個全新的可能：你不需要會寫程式碼，只需要學會對 AI 說清楚你想要什麼。來自 GitHub Copilot 的[資料顯示](https://www.wearetenet.com/blog/github-copilot-usage-data-statistics)，超過1500萬開發者正在用AI輔助程式設計，平均46%的程式碼都是AI生成的! 在Java專案中這個比例能達到61%。

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">🚀</span>
      <span style="font-weight: bold; font-size: 16px;">效率與採用率的飛躍</span>
    </div>
  </template>
  
  <el-row :gutter="20" style="margin-bottom: 24px;">
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #409EFF; font-size: 24px; font-weight: bold;">55%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">速度提升</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #67C23A; font-size: 24px; font-weight: bold;">2.4 <span style="font-size: 14px;">天</span></div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">任務耗時 (原9.6天)</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #E6A23C; font-size: 24px; font-weight: bold;">81%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">首日安裝率</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #F56C6C; font-size: 24px; font-weight: bold;">96%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">建議採納率</div>
      </div>
    </el-col>
  </el-row>

  <div style="line-height: 1.8; color: #606266;">
    讓人真正興奮的是效率的飛躍：開發者完成任務的速度提升了 <b>55%</b>。原本需要 9.6 天才能提交的程式碼，現在只要 <b>2.4 天</b>就能搞定。 這種肉眼可見的效率提升，說明 AI 不再只是一個“可選工具”，而是正在成為開發流程中不可或缺的程式設計助手。採用率的資料也印證了這一點：在獲得訪問許可權的當天，就有 <b>81%</b> 的開發者第一時間完成安裝並開始使用；其中 <b>96%</b> 的人更是在當天就開始採納 AI 提供的程式碼建議。換句話說，開發者幾乎是立刻把 AI 融入了日常編碼工作。
  </div>
</el-card>

對於普通人來說,這個趨勢更有意義:如果專業程式設計師都在大量依賴AI寫程式碼,那我們這些**不會程式設計的人,為什麼不能直接跟AI對話來實現自己的想法呢**?

這門課的目標是幫你練成新技能：透過自然語言對話就能做應用。我們將教你怎麼跟 AI 用計算機的語言溝通、怎麼讓AI幫你把腦子裡的想法變成真實可用的產品。

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: '困境與機會', description: '普通人的程式設計新可能' },
      { title: '能力初探', description: '60秒極速開發體驗' },
      { title: '原生實戰', description: '打造AI原生貪喫蛇' },
      { title: '拓展創造', description: '舉一反三做遊戲' }
    ]" />
  </ClientOnly>
</div>

## 2. AI 能幫你做到什麼程度

在本節中，我們只討論一個問題：如果你完全不會寫程式碼，現在的 AI 能幫你做到什麼程度？

大致來說，你可以把當前大模型的能力理解為：可以勝任**簡單的內部小工具**、**資料視覺化看板**，以及一些**輕量級小遊戲**的開發。這些能力用來做**自用工具**、從**產品經理視角驗證需求**，基本已經足夠。但若想一鍵生成可直接**商用的成熟產品**，通常仍需要人工在**流程設計**、**細節打磨**上持續最佳化。

接下來，我們就以貪喫蛇為例，具體看看 AI 程式設計目前到底能做到什麼程度。

### 2.1 60 秒做一個貪喫蛇遊戲

首先，請你開啟課程中使用的實驗網頁 [z.ai](https://chat.z.ai/)，`z.ai` 是由智譜 AI（中國領先的大語言模型公司之一）開發的 AI 平臺，其核心能力由智譜自研的 GLM 系列大模型提供支援。該平臺整合了多項 AI 功能，包括幻燈片生成、海報設計和全棧開發等。在本教程中，我們將重點介紹其全棧開發模組的使用。

::: details 💡 什麼是「網頁就能程式設計」的新模式？

過去，開發一個網頁應用需要：
- 安裝程式設計環境（如 Python、Node.js）
- 配置程式碼編輯器
- 學習 HTML/CSS/JavaScript 等語言
- 處理各種依賴和報錯

而現在，藉助 AI 程式設計平臺，你只需要：
- 開啟瀏覽器，訪問網頁
- 用自然語言描述你想要的功能
- AI 自動生成程式碼並實時預覽效果

這種「對話即程式設計」的模式，讓程式設計從「寫程式碼」變成了「描述需求」。你不需要關心底層技術細節，只需要清楚地告訴 AI 你想要什麼，它就能幫你把想法變成可執行的程式。這就是 AI 時代程式設計的新正規化——**Vibe Coding（氛圍式編碼）**。
:::

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-25-03.png)

輸入我們的簡單需求後點選 **全棧開發** 按鈕，你可以實時觀看網頁的完整建立過程。通常只需泡一杯咖啡的時間，網頁便會自動生成完畢！

```
幫我做一個貪喫蛇遊戲：
1. 用方向鍵控制蛇的移動
2. 喫到食物後蛇會變長，分數增加
3. 撞到牆壁或自己的身體就遊戲結束
4. 要有開始和重新開始按鈕
5. 介面要簡潔好看
```

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-34-03.png)

生成結束後，你能看到右側出現可瀏覽的網頁介面。你可以上下滾動瀏覽頁面內容，或點選頁面頂部的 🧭 按鈕切換至全屏模式檢視效果。

> 其中頂部從左到右按鈕的作用依次為：箭頭按鈕展開側邊對話歷史欄，鉛筆按鈕用於新建一個對話，迴圈箭頭按鈕用於重新整理頁面，指南針按鈕負責切換至全屏模式，Download 按鈕用於下載專案，<> 按鈕用於切換程式碼檢視，Publish 按鈕用於釋出專案。

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/index-2026-01-07-18-35-11.png)

如果你想檢視該網頁的原始碼，可以點選右上角的程式碼圖示檢視完整程式碼。

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image7.png)

::: tip 🌐 探索更多 AI 程式設計工具

除了 z.ai，還推薦你還可以嘗試以下優秀的 AI 程式設計平臺進行測試：

| 工具 | 地址 | 特點 |
|------|------|------|
| **Kimi Code** | [kimi.com/code/console](https://kimi.com/code/console) | 月之暗面推出的 AI 程式設計助手，提供終端版 Kimi Code CLI 與 VS Code 擴充功能，底層為程式設計專用模型 Kimi K2.7 Code，還支援接入 Claude Code、Roo Code 等工具 |
| **Google AI Studio**（推薦） | [aistudio.google.com/apps](https://aistudio.google.com/apps) | 谷歌官方出品，支援 Gemini 模型，適合快速原型開發 |
| **Figma Make** | [figma.com/make](https://www.figma.com/make) | 與設計工具深度整合，適合設計師快速實現互動原型 |
| **Coze** | [coze.com](https://www.coze.cn) | 位元組跳動推出的 AI Bot 開發平臺，提供零程式碼的視覺化搭建能力。與豆包、Kimi 等國產大模型深度整合，支援外掛市場、定時任務和多渠道釋出（飛書、微信等），適合快速構建面向 C 端使用者的對話應用或企業內部智慧助手 |
| **v0.dev** | [v0.dev](https://v0.dev) | Vercel 出品的 AI 生成 UI 工具，輸入描述即可生成可執行的 React 元件程式碼 |
| **Bolt.new** | [bolt.new](https://bolt.new) | StackBlitz 推出的 AI 全棧開發平臺，可直接生成並部署完整的 Web 應用 |
| **Lovable** | [lovable.dev](https://lovable.dev) | 專注於生成高質量 React 應用，支援 GitHub 整合和一鍵部署 |
| **Replit Agent** | [replit.com](https://replit.com) | 整合 AI 程式設計助手的線上 IDE，支援多種語言和實時協作 |

想了解更多網頁程式設計工具的詳細對比和使用教程，可以參考我們的擴充套件閱讀：[7 款主流 Vibe Coding 線上平臺實測對比](../../stage-1/appendix-articles/example0-1/vibe-coding-tools-snake-game-tutorial.md)
:::

### 2.2 對話程式設計能做什麼不能做什麼

本節聚焦一個具體問題：當你只依賴對話式 AI、不寫任何程式碼時，它究竟能把事情推進到哪一步。
在經驗層面，一個較為穩定的結論是：它可以幫你完成一個“小而完整”的東西，但“做到什麼程度就算夠”，仍然需要你親自決策每一步的詳細步驟。

#### 更擅長“小而清晰”的應用

從前面的貪喫蛇示例中，你已經看到了一種典型模式：
只要你能把介面和互動說清楚，AI 通常可以在幾輪對話內，拼出一個可以開啟、可以點選、可以玩的完整網頁。

這類任務往往具備幾個共同特徵：

- 範圍清晰：一頁網頁、一個簡單內部工具、一個小玩法
- 結果可見：你能立即在瀏覽器中驗證是否按預期工作
- 糾錯直接：發現問題後，可以在後續對話中點明具體現象並要求修正（透過複製錯誤直接貼上，或者截圖貼上的形式讓 AI 進行修改）

在這個邊界內，你可以把對話式 AI 看作一位執行力不錯的"輔助開發者"。你只需在每一輪用自然語言細化和修正需求，就能快速得到可用的原型。

**AI 獨立完成小型專案的成功率：**
<el-progress :percentage="90" :stroke-width="15" status="success" striped striped-flow />

#### 大型專案需要“流程視角”

一旦超出小而清晰的範圍，只指望靠幾輪對話讓 AI 端到端完成複雜系統，很快就會遇到上限。大型專案往往要接後端、連資料庫、整合第三方服務，還牽涉許可權、安全、併發和大量業務規則，目標是交付一整套與現有業務深度打通的系統，而不是一頁網頁。

在這種情況下，更合理的做法不是把所有需求一股腦丟給 AI，而是先梳理出清晰的整體流程：關鍵步驟是什麼、每一步的輸入輸出和狀態變化是什麼、哪些節點對效能和安全最敏感。再基於這張流程圖，把相對獨立的環節拆分出來，交給對話式 AI 生成介面、模組、指令碼和測試。

以目前的能力來看，AI 更擅長加速一個個小步驟，由你（或你的團隊）來決定怎麼拆步驟、如何串聯，並負責最終的架構設計、系統整合和運維。

#### 能寫和能用的區別

咋一看，AI 好像什麼都能寫，但這些東西到底能不能用，能用到什麼程度，我們該如何劃分？

一個可參考的經驗是：

::: warning ⚠️ 適用場景指南

- **原型 / Demo / 內部自用工具**：非常適合先交給 AI 打第一版，再由你迭代細節。
- **面向真實使用者的大型產品**：通常需要工程師在架構、抽象、效能和維護上長期投入。
- **強安全 / 強合規系統（如支付、風控、醫療等）**：在當前階段，不宜“生成完就直接上線”，必須引入嚴格的審查與測試流程。
  :::

在當下，你可以相對安心地把 AI 視作一個高效的 Demo 與自用工具搭檔：
只要你願意多測試、多迭代，多問幾輪“這裡不對，幫我修一下並解釋原因”，在原型與內部工具這一級別，整體質量通常是足夠且具備實踐價值的。

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: '困境與機會', description: '普通人的程式設計新可能' },
      { title: '能力初探', description: '60秒極速開發體驗' },
      { title: '原生實戰', description: '打造AI原生貪喫蛇' },
      { title: '拓展創造', description: '舉一反三做遊戲' }
    ]" />
  </ClientOnly>
</div>

## 3. 動手：你的第一個 AI 原生應用

讓我們回到動手部分，在前一部分，我們已經用 AI 快速做出了一個可以玩的貪喫蛇原型，也大致知道了 AI 能做什麼、不能做什麼。接下來我們將學習如何用最基礎的 **vibe coding** 技巧建立一個**現代版**的 AI 貪喫蛇遊戲。我們將讓蛇喫掉文字字元而不是豆子。最後讓遊戲根據喫掉的文字字元生成一首詩，並畫一幅畫。
透過這個實際案例你能夠理解全新程式設計方式的核心理念：如何學會用自然語言清晰地表達需求。

### 3.1 AI 原生貪喫蛇

在一開始，我們可以用最簡單的方式與大模型對話，這將幫助我們快速獲得產品原型。我們可以直接在聊天框中輸入：

> **💡 示例提示詞：** 幫我做一個貪喫蛇遊戲
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image12.png)

> **💡 示例提示詞：** 幫我做一個貪喫蛇遊戲，它應該支援
>
> 1. 我可以喫不同的單詞，它們會被收集在一個盒子裡
>    ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image13.png)

> **💡 示例提示詞：** 幫我做一個貪喫蛇遊戲，它應該支援：
>
> 1. 我可以喫不同的單詞，它們會被收集在一個盒子裡
> 2. 當蛇喫了8個單詞時，llm 應該根據這些單詞創作一首詩，我們可以根據需要重新混合這首詩。
> 3. 當詩完成後，下一步將自動根據這首詩建立一幅影象。
>
> ![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image14.png)

注意，在開發過程中，我們可能會遇到不盡如人意的問題，例如點選按鈕沒有任何反應、使用功能時報錯、功能未按預期工作，或者前端頁面與預期設計不符。

在這種情況下，我們需要進一步向模型提問，以幫助修復這些意外問題。

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image15.png)

### 3.2 給遊戲新增新功能

完成基本功能後，我們可以嘗試給我們的程式新增一些新花樣！如果你覺得蛇喫單詞或字元的過程有點枯燥，你可以讓蛇喫不同顏色的單詞，並相應地改變蛇的顏色。

你還可以為“喫”的過程新增特效，或者引入觸發特效的魔法單詞——比如增加蛇的速度或大小。另一個想法是每當蛇喫一個單詞時就讓模型生成一首詩和一幅圖，而不是等到它喫掉八個單詞。

如果覺得這些有挑戰性，你可以直接向語言模型求助！它可以提供創意建議，讓你的遊戲更有趣。試一試吧！

```
1. "單詞解鎖世界" 機制
   功能：蛇喫掉一個單詞後，影象模型即時為該單詞生成一個小藝術品，逐漸拼湊成一幅由玩家創造的獨特全景畫——邊玩邊“作畫”。

2. "詩歌拼圖" 玩法
   功能：蛇喫掉的每個單詞觸發 LLM 生成一句詩、影象模型生成一幅插圖，回合結束時組合成一首 AI 協作的詩和畫。

3. "魔法單詞" & 故事分支
   功能：喫下“風、夜、夢”等魔法單詞時，LLM 改變場景主題，將影象風格切換為夜晚、暴風雨或夢幻氛圍；玩家喫掉的不同單詞還會讓 AI 生成的故事不斷演變。

4. "即時互動生成"
   功能：每喫一個單詞，LLM 生成一句對話或描述，讓遊戲中的 NPC“開口說話”、環境隨之改變，蛇的外觀或障礙物也根據喫掉的單詞發生變化。

5. "按句貪喫蛇" 挑戰
   功能：反向模式——LLM 給出一句詩或謎語，玩家引導蛇按順序喫掉單詞來重構句子，喫錯單詞會觸發影象模型生成有趣的藝術化後果。

6. "主題關卡" & 風格選擇
   功能：開局選擇“童話、科幻、唐詩”等主題，LLM 和影象模型會調整單詞、詩風與畫面風格，讓每次執行都煥然一新。

7. "現場共創"
   功能：喫掉特殊單詞時，LLM 提示玩家輸入短語或選擇風格，再生成對應的詩句和插圖，實現真正的人機共創。

8. "成長的故事"
   功能：蛇不斷成長，LLM 同步續寫故事詩，影象模型生成長卷全景圖，讓玩家同時體驗“寫作、繪畫和玩耍”。
```

此外，我們還可以要求 LLM 幫你直接生成專案級的提示詞。在上一節中，我們只自己寫了貪喫蛇遊戲的提示詞。現在讓我們嘗試讓大模型生成一個帶有整體框架和實現路徑的提示詞（你可以直接用 z.ai 生成）。

如果你想學習如何寫出更好的提示詞，可以檢視[提示詞工程附錄](/zh-cn/appendix/8-artificial-intelligence/prompt-engineering)。

> 我想讓 AI 生成一個網頁貪喫蛇遊戲，需要一個更完整的提示詞，讓生成結果更令人印象深刻和有趣。請生成相應的提示詞。當前目標是：生成一個貪喫蛇遊戲，需要實現喫不同單詞生成詩歌的功能，並且應該包含影象生成模組。

z.ai 的回覆將會是這樣的：

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image56.png)

我們可以使用這個提示詞在全棧開發模式下重新生成專案：

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image57.png)

![](../../../zh-cn/stage-1/ai-capabilities-through-games/images/image58.png)

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="3" :items="[
      { title: '困境與機會', description: '普通人的程式設計新可能' },
      { title: '能力初探', description: '60秒極速開發體驗' },
      { title: '原生實戰', description: '打造AI原生貪喫蛇' },
      { title: '拓展創造', description: '舉一反三做遊戲' }
    ]" />
  </ClientOnly>
</div>

### 3.3 嘗試製作其他小遊戲

除了貪喫蛇（遊戲），我們可以讓想象力盡情馳騁。

創造任何我們想創造的東西，甚至嘗試搞砸一切！然後重頭再來！

1. AI 藝術畫廊平臺：幫我做一個線上畫廊，使用者可以上傳、瀏覽、點讚和評論 AI 生成的藝術作品，還能按風格分類展示。
2. 復古遊戲檔案館：幫我做一個致敬經典遊戲的網站，收錄遊戲歷史與玩法指南，並內建幾款可以直接線上玩的復古小遊戲。
3. 可持續生活追蹤器：幫我做一個碳足跡追蹤工具，使用者填寫日常行為後自動估算碳排放，並提供環保建議和每週挑戰。
4. 虛擬廚房助手：幫我做一個 AI 烹飪助手，使用者輸入家裡有的食材，它就推薦食譜並給出一步步的烹飪說明。
5. 地下音樂發現平臺：幫我做一個音樂串流媒體網站，重點推薦獨立和新興音樂人的作品，支援建立歌單和評論互動。
6. 極簡任務管理系統：幫我做一個極簡風格的任務管理工具，支援建立任務、設定優先順序、拖動排序和檢視完成進度。
7. 科幻寫作工坊：幫我做一個科幻寫作平臺，提供世界觀設定範本、角色資料卡和故事大綱工具，幫助作者搭建設定。
8. 個人知識圖譜：幫我做一個視覺化筆記工具，把零散的想法做成節點，用連線把相關內容連線成一張知識網。
9. 虛擬植物園：幫我做一個植物百科網站，收錄各種植物的圖文資料，使用者還能種植自己的虛擬植物並觀察生長過程。
10. 程式設計挑戰競技場：幫我做一個線上程式設計競賽平臺，提供不同難度的演算法題目、線上程式碼編輯器、自動評測和排行榜。

還有... 如果你喜歡玩遊戲，讓我們一起嘗試創造遊戲吧！

1. 3D 開放世界 RPG：幫我做一個可自由探索的 3D 開放世界遊戲，有晝夜循環、天氣變化、任務系統和角色成長。
2. 第一人稱射擊 (FPS) 競技場：幫我做一個快節奏的多人 FPS 遊戲，支援團隊死鬥、奪旗等多種模式和多張地圖。
3. AI 國際象棋和多人遊戲：幫我做一個國際象棋平臺，既能與不同難度的 AI 對弈，也能線上匹配真實玩家。
4. 麻將線上多人遊戲：幫我做一個傳統麻將遊戲，支援多種規則、建立私人房間和自動計分。
5. 回合制策略遊戲：幫我做一個網格地圖的回合制策略遊戲，包含單位移動、攻擊、升級和戰爭迷霧。
6. 計時賽賽車遊戲：幫我做一個 3D 賽車遊戲，專注計時賽玩法，支援多張賽道、車輛改裝和幽靈車回放。
7. 卡牌對戰遊戲 (卡組構建)：幫我做一個卡牌對戰遊戲，玩家可以收集卡牌、自由構建卡組並參與排位賽。
8. 大逃殺 (俯視 2D)：幫我做一個俯視視角的 2D 大逃殺遊戲，包含縮圈機制、隨機戰利品和單排/組隊模式。
9. 恐怖生存遊戲 (第一人稱)：幫我做一個第一人稱恐怖生存遊戲，重點是資源管理、潛行躲避敵人和尋找逃生出口。
10. 音樂節奏遊戲 (3D)：幫我做一個 3D 音樂節奏遊戲，音符隨著音樂節拍從遠處飛來，玩家在正確時機擊打得分。

### 3.4 全網精選案例：看看別人用 AI 做出了什麼

看到這裡你可能還是會想：貪喫蛇只是一個入門例子，AI 真的能做出更複雜的遊戲嗎？

答案是肯定的。下面精選了 **8 個** 全網公開的真實案例——從經典街機遊戲合集、2048 風格拼圖，到復刻《我的世界》和《超級瑪利歐》、甚至由國產大模型 Kimi 做出的 3D 遊戲和官方遊戲平台。這些案例的開發者有的是程式設計師，也有完全零基礎的普通人，但共同點是：**都用對話的方式讓 AI 完成了大部分程式碼**。

#### 🕹️ 案例一：一個下午復刻 10 款經典街機遊戲（WotAI Games）

[WotAI Games](https://games.wotai.co/) 是一個完全用 Claude Code（Vibe Coding）從零開發、**不使用任何遊戲引擎** 的網頁遊戲合集。透過對話讓 AI 一口氣復刻了 10 款經典街機遊戲：吃豆人、俄羅斯方塊、太空侵略者、貪喫蛇、Flappy Bird、打磚塊、小蜜蜂、青蛙過河、塗鴉跳躍和數獨。每款都可以直接線上玩，還自帶排行榜系統。

![WotAI Games 首頁——10 款經典街機遊戲合集](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-games.png)

![俄羅斯方塊（WotAI Games，Vibe Coding 生成）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-tetris.png)

![吃豆人（WotAI Games，Vibe Coding 生成）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-wotai-pacman.png)

> 🔗 線上試玩：[games.wotai.co](https://games.wotai.co/) ｜ 開發復盤：[We vibe coded 10 classic arcade games with Claude Code](https://wotai.co/blog/wotai-games-vibe-coded-arcade-classics)

#### 🌸 案例二：零基礎者 2 小時做出 2048 風格遊戲（Blooming Garden）

日本一位完全不懂程式設計的開發者 [in0ho1no](https://github.com/in0ho1no)，用 Claude 透過純對話（Vibe Coding）在 **約 2 小時內** 做出了 2048 風格的「植物花園」遊戲 [Blooming Garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/)：同種植物合成升級、華麗的開花特效、粒子動畫、排行榜、音效、手機適配……這些功能全部透過自然語言對話完成，沒有手寫一行程式碼。

![Blooming Garden 植物合成遊戲（100% AI 生成）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-blooming-garden.png)

> 🔗 線上試玩：[in0ho1no.github.io/2025-adhoc-blooming-garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/) ｜ 原始碼：[github.com/in0ho1no/2025-adhoc-blooming-garden](https://github.com/in0ho1no/2025-adhoc-blooming-garden)

#### 🌍 案例三：設計師用 AI 做出可線上連線的 3D 遊戲（Planet Jumper）

設計師 [Ricardo de Zoete（Hammy）](https://x.com/RicardoDeZoete) 用 OpenAI 的 AI 透過純對話（Vibe Coding）在 three.js 基礎上做出了 [Planet Jumper](https://gamesbyhammy.cloud/play/planetjumper)——一個**3D 多人平台跳躍遊戲**：在一個小球狀星球表面奔跑、衝刺、跳躍，還能與陌生人在線同場競技。球形引力、連線同步、跳躍手感這些並不簡單的系統，全靠提示詞「聊」出來。

![Planet Jumper 3D 多人平台跳躍遊戲（Vibe Coding 生成）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-planet-jumper.png)

> 🔗 線上試玩：[gamesbyhammy.cloud/play/planetjumper](https://gamesbyhammy.cloud/play/planetjumper) ｜ 詳細介紹：[Planet Jumper: A Vibe-Coded Three.js Multiplayer Platformer](https://www.webgpu.com/showcase/planet-jumper-threejs-multiplayer/)

#### 🎮 案例四：一個人用 Vibe Coding 做了 100 款瀏覽器遊戲（2026）

2026 年 7 月，中文社群開發者 [wangzifan396-wzf](https://github.com/wangzifan396-wzf) 開源了 [mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games)——**用 Vibe Coding 一個人做出並持續打磨的 100 款瀏覽器小遊戲**，全部是零依賴的單 HTML 檔案，雙擊即可執行。玩法覆蓋動作、策略、塔防、經營、卡牌、物理、推理、競速、節奏、棋類和益智等類型，其中不少已經做到了多章節戰役、養成系統、存檔碼跨裝置同步的完整產品級深度。整個專案以 MIT 協議開源，線上目錄可以直接開玩。

![100 款瀏覽器遊戲線上目錄（2026 年 Vibe Coding 開源專案）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-100-games.png)

![《霓虹 2048》：六章 18 節點遠征 + 多種模式與工具系統](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-100-games-neon2048.png)

> 🔗 線上目錄：[wangzifan396-wzf.github.io/mini-browser-games](https://wangzifan396-wzf.github.io/mini-browser-games/) ｜ 原始碼：[github.com/wangzifan396-wzf/mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games) ｜ 創作復盤：[我用 Vibe Coding 做了 100 款瀏覽器遊戲，並把它們全部開源了](https://blog.csdn.net/m0_74023007/article/details/162945755)

#### ⛏️ 案例五：給侄子們做一個《我的世界》復刻版（CraftMine，2026）

2026 年 2 月，開發者 [Trent Sterling](https://tront.xyz/blog/posts/craftmine/) 因為侄子們想玩《我的世界》但沒有正版，乾脆打開一個空白 HTML 檔案，用 Claude Code 透過純對話做出了 [CraftMine](https://tront.xyz/craftmine/)——一個 **6,820 行、單檔案** 的網頁版《我的世界》復刻版：46 種方塊（還加了 21 種 DOOM 地獄主題方塊）、36 種生物（從小雞到 300 血的泰坦 Boss）、19 種武器（含 BFG 9000）、5 種生物群系、晝夜循環，甚至支援 **P2P 多人連線**。沒有任何建置步驟，打開網頁就能玩。

![CraftMine：《我的世界》復刻版，6,820 行單檔案（Vibe Coding 生成）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-craftmine.png)

> 🔗 線上試玩：[tront.xyz/craftmine](https://tront.xyz/craftmine/) ｜ 開發復盤：[CraftMine: A 6,820-line vibe-coded Minecraft clone in one HTML file](https://tront.xyz/blog/posts/craftmine/)

#### 🍄 案例六：AI 即時生成無限關卡的《超級瑪利歐》（2026）

2026 年 3 月，一位開發者把開源版《超級瑪利歐》和 OpenAI 的模型結合，做出了 [AI 版超級瑪利歐](https://supermario.leanmcp.live/)：既能玩經典的原版關卡，也能讓 AI **即時生成新關卡**——在「無限模式」下，AI 會隨著你的前進動態生成全新的場景和敵人，實測能連續玩 45 分鐘。你甚至可以直接在遊戲裡用文字讓 AI 加敵人、放平台、改主題。

![AI 版超級瑪利歐：經典、AI 關卡、無限模式三種玩法](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-ai-mario-menu.png)

![AI 即時生成的瑪利歐遊戲畫面](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-ai-mario-gameplay.png)

> 🔗 線上試玩：[supermario.leanmcp.live](https://supermario.leanmcp.live/) ｜ 詳細介紹：[OpenAI and Idiomorph Power Infinite Mario Level Generation in Browser](https://www.thenextgentechinsider.com/pulse/openai-and-idiomorph-power-infinite-mario-level-generation-in-browser)

#### 🇨🇳 案例七：國產大模型 Kimi K3 一個提示詞做出 3D 遊戲（2026）

2026 年 7 月，開發者 [Dr. Josh Simmons](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it) 只給國產大模型 **Kimi K3** 發了一個提示詞，就讓它做出了一個可玩的第一人稱 3D 遊戲：在程式化生成的伺服器設施裡收集資料核心、躲避巡邏無人機、坐貨運電梯下三層樓。整個遊戲一次生成即可遊玩，再透過兩輪對話修掉兩個 bug 就能順暢通關，全程花費約 **2 美元**。

![Kimi K3 一個提示詞生成的 3D 伺服器設施遊戲](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-kimi-k3-game.png)

> 🔗 線上試玩：[kimi-test-theta.vercel.app](https://kimi-test-theta.vercel.app/) ｜ 原始碼：[github.com/jcpsimmons/kimi-test](https://github.com/jcpsimmons/kimi-test) ｜ 開發者復盤：[Kimi K3 Built the Game. I Still Had to Play It.](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it)

#### 🎯 案例八：Kimi 官方遊戲平台 K399——幾十款 AI 遊戲線上開玩（2026）

2026 年 7 月 17 日，月之暗面發布 Kimi K3 模型後，同步上線了網頁遊戲平台 [K399](https://www.k399.games/)——裡面幾十款遊戲全部由 K3 模型參與製作，點開即玩。品類覆蓋 3D 射擊、音遊、橫版動作、宮鬥 AVG、3D 解謎甚至開放世界：既有復刻《薩爾達傳說》《黑神話：悟空》《泡泡堂》《吸血鬼倖存者》等經典玩法的作品，也有《先鋒練習場》（可移動、跳躍、滑鏟、瞄準射擊的 3D FPS）、開放世界《SpiderPunk》、五章主線八條支線 32 種隨機事件的宮鬥 AVG《鳳闕深宮》等完成度遠超 Demo 的原創遊戲。

![K399 平台介面——K3 Game Arcade，遊戲列表點開即玩](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-k399-platform-live.png)

![K399 上的開放世界遊戲 SpiderPunk：在賽博都市高樓間蕩蛛絲（K3 模型生成，實際遊玩畫面）](../../../zh-cn/stage-1/ai-capabilities-through-games/images/case-k399-spiderpunk.png)

> 🔗 線上試玩：[k399.games](https://www.k399.games/)（K3 Game Arcade，點開即玩）｜ 詳細介紹：[前米哈遊高階主管加入，當下最火的 AI 公司突然做了幾十個遊戲](https://eu.36kr.com/zh/p/3906895998178441) ｜ [Kimi K3，讓誰緊張？](https://36kr.com/p/3905392402748801)

看完這些案例你會發現：**貪喫蛇只是 AI 程式設計能力的冰山一角**。無論是經典街機遊戲、2048 拼圖、3D 遊戲、復刻《我的世界》和《超級瑪利歐》，還是上百款的遊戲合集、甚至國產大模型官方的遊戲平台，只要你能把想法說清楚，並願意多輪對話去打磨，AI 都能幫你從 0 到 1 做出來。接下來，就輪到你啦！

## 📚 Assignment

<el-card id="assignment-card" shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="font-weight: bold; font-size: 16px;">🎯 本章作業：完成你的第一批 AI 原生小遊戲</div>
  </template>

  <p>
    這一節，你已經跟著步驟體驗了從“對話生成貪喫蛇”到“理解 AI 原生小遊戲設計思路”的完整流程。下面的作業幫助你把這些理解真正變成自己的能力。
  </p>

  <ol>
    <li>
      <strong>完整復現 AI 原生貪喫蛇遊戲</strong>
      <ul>
        <li>至少實現：蛇可以移動、喫到“食物”後長度和分數發生變化、撞牆或撞到自己會結束。</li>
        <li>在復現過程中，練習把錯誤現象 + 報錯資訊 + 關鍵程式碼片段一次性丟給 AI，請它“小白模式”修復。</li>
      </ul>
    </li>
    <li>
      <strong>（可選）自創 1 個 AI 原生小遊戲或 Demo</strong>
      <ul>
        <li>可以是圍繞文字、圖片、音樂、節奏等的任意輕量玩法，例如“喫單詞寫詩”“節奏點選”“生成式跑酷”等。</li>
        <li>重點不是畫面多炫，而是你能清楚說出：AI 在這裡具體幫了什麼忙，它解決了什麼“人工難以做到或很麻煩”的部分。</li>
      </ul>
    </li>
  </ol>

  <p>
    這就是完整的教程！你可能需要 <strong>4 小時</strong> 才能完成所有內容並構建你自己的貪喫蛇遊戲。不要著急——探索、實驗並享受這個過程。如果在過程中遇到概念不太理解，推薦你順手檢視下方附錄中的相關部分。
  </p>
</el-card>

## 附錄

<el-card id="appendix-nav" shadow="hover" style="margin-top: 24px; margin-bottom: 24px; border-left: 5px solid #67C23A;">
  <div style="font-weight: bold; margin-bottom: 8px;">附錄導航</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    這裡整理了一些和本章相關的基礎概念：如果你在學習過程中遇到“前端是什麼”“Vibe Coding 到底指什麼”等問題，可以隨時回到這裡查閱。
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <a href="#appendix-1" style="text-decoration: none; color: inherit;"><b>附錄 1：我們需要前端開發知識嗎？</b></a><br/>
      <span style="font-size: 12px; color: #909399">搞清楚前端在整個應用裡的位置，知道哪些是“看得見”的部分。</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-2" style="text-decoration: none; color: inherit;"><b>附錄 2：到底什麼是 Vibe Coding</b></a><br/>
      <span style="font-size: 12px; color: #909399">理解“對話式開發”的核心思路，知道該如何和 AI 配合。</span>
    </el-col>
  </el-row>
  <el-row :gutter="16" style="margin-top: 10px;">
    <el-col :span="12">
      <a href="#appendix-3" style="text-decoration: none; color: inherit;"><b>附錄 3：模型上下文</b></a><br/>
      <span style="font-size: 12px; color: #909399">搞清楚“上下文長度”這類常聽到卻又容易混淆的概念。</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-4" style="text-decoration: none; color: inherit;"><b>附錄 4：指令遵循能力</b></a><br/>
      <span style="font-size: 12px; color: #909399">瞭解模型為什麼有時“聽不懂話”，以及如何寫得更清楚。</span>
    </el-col>
  </el-row>
  <div style="margin-top: 12px; font-size: 12px; color: #909399;">
    小技巧：你可以按 Ctrl/⌘+F 搜尋關鍵字，或者把不懂的段落複製給 AI，請它用“完全小白能看懂”的方式再解釋一遍。
  </div>
</el-card>

## <span id="appendix-1">[附錄 1：我們需要前端開發知識嗎？](#appendix-nav)</span>

::: tip 💡 一句話總結
你不需要會寫程式碼，但瞭解基礎概念能讓你更好地向 AI 描述需求。
:::

<el-row :gutter="16" style="margin: 20px 0;">
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">👁️</span>
          <span style="font-weight: bold;">前端</span>
          <el-tag type="success" size="small">可見</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        使用者能<strong>看到、點到</strong>的所有內容
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>網頁標題、文字、圖片</li>
          <li>按鈕、輸入框、下拉選單</li>
          <li>遊戲介面、動畫效果</li>
        </ul>
      </div>
    </el-card>
  </el-col>
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">⚙️</span>
          <span style="font-weight: bold;">後端</span>
          <el-tag type="info" size="small">不可見</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        執行在伺服器上的資料處理
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>使用者分數儲存</li>
          <li>登入賬號驗證</li>
          <li>關卡內容分配</li>
        </ul>
      </div>
    </el-card>
  </el-col>
</el-row>

### 前端三件套

瀏覽器透過三種"程式碼"來構建頁面：

<el-tabs type="border-card" style="margin: 20px 0;">
  <el-tab-pane label="🏗️ HTML - 骨架">
    <div style="padding: 10px;">
      <p><strong>作用：</strong>定義頁面上<strong>有什麼</strong>元素</p>
      <p><strong>類比：</strong>房子的結構草圖（牆、門、窗在哪裡）</p>
      <el-card style="background: #f5f7fa; margin-top: 12px;">
        <pre style="margin: 0;"><code>&lt;button&gt;點我&lt;/button&gt;
&lt;h1&gt;標題&lt;/h1&gt;
&lt;img src="photo.png"&gt;</code></pre>
      </el-card>
    </div>
  </el-tab-pane>
  <el-tab-pane label="🎨 CSS - 樣式">
    <div style="padding: 10px;">
      <p><strong>作用：</strong>控制元素<strong>長什麼樣</strong></p>
      <p><strong>類比：</strong>房子的裝修（顏色、材質、佈局）</p>
      <el-card style="background: #f5f7fa; margin-top: 12px;">
        <pre style="margin: 0;"><code>button {
  background: blue;
  color: white;
  border-radius: 8px;
}</code></pre>
      </el-card>
    </div>
  </el-tab-pane>
  <el-tab-pane label="⚡ JavaScript - 行為">
    <div style="padding: 10px;">
      <p><strong>作用：</strong>讓頁面<strong>動起來</strong></p>
      <p><strong>類比：</strong>房子的電路開關（點選後的響應）</p>
      <el-card style="background: #f5f7fa; margin-top: 12px;">
        <pre style="margin: 0;"><code>button.onclick = () => {
  alert('你點了我！')
}</code></pre>
      </el-card>
    </div>
  </el-tab-pane>
</el-tabs>

### 程式碼如何變成頁面？

當你開啟一個網頁時，瀏覽器會按順序處理三種程式碼：

**1. HTML —— 定義頁面結構**
瀏覽器首先解析 HTML，瞭解頁面上有哪些元素（標題、段落、圖片、按鈕等），以及它們的層級關係。

**2. CSS —— 應用樣式**
然後瀏覽器根據 CSS 規則，給這些元素新增樣式：顏色、大小、位置、間距等，讓頁面變得美觀。

**3. JavaScript —— 新增互動**
最後執行 JavaScript 程式碼，讓頁面"動起來"：響應點選、提交表單、播放動畫等。

**4. 頁面呈現**
三者的配合結果就是你最終看到的網頁。

### 現代前端框架：從 HTML 到 React/Vue

前面介紹的 HTML、CSS、JavaScript 是前端開發的"三件套"，它們是所有網頁的基礎。但當頁面變得複雜時，直接用這三件套開發會遇到挑戰：程式碼難以維護、重複勞動多、資料同步麻煩。

**現代前端框架**（如 React、Vue、Angular）建立在 HTML/CSS/JS 之上，讓開發更高效：

**1. HTML/CSS/JS（基礎階段）**
直接操作頁面元素，適合簡單頁面。但當程式碼量增大時，所有邏輯混在一起，難以維護。

**2. jQuery（過渡階段）**
簡化了 DOM 操作，讓程式碼更簡潔。但仍需手動管理頁面狀態，資料變化時要自己找到對應的元素並更新。

**3. React/Vue（現代階段）**
採用元件化和狀態驅動的設計：
- **元件化**：把頁面拆成獨立的可複用模組（如按鈕、卡片、導航欄）
- **狀態驅動**：資料變化時，框架自動更新對應的介面，無需手動操作

::: tip 💡 簡單理解
- **HTML/CSS/JS** = 基礎材料（磚塊、水泥、鋼筋）
- **React/Vue** = 建築框架（提供了搭建房屋的規範和工具）

在 AI 輔助程式設計時代，你不需要深入掌握框架的所有細節，只需要理解它們的基本概念，就能透過自然語言描述讓 AI 幫你生成程式碼。
:::

### 在 Vibe Coding 中

**核心要點：你不需要寫程式碼，只需要會描述。**

瞭解前端概念後，你可以這樣跟 AI 描述需求：

> "用 React 做一個排行榜頁面，右側顯示分數列表，點選某行在下方展示玩家詳情，風格簡潔現代。"

如果你想深入理解 HTML、CSS、JavaScript 等前端基礎知識，可以檢視[Web 基礎附錄](/zh-cn/appendix/3-browser-and-frontend/javascript-deep-dive)。想了解前端技術的發展歷程，可以檢視[前端進化史附錄](/zh-cn/appendix/3-browser-and-frontend/frontend-frameworks)。

## <span id="appendix-2">[附錄 2：到底什麼是 Vibe Coding](#appendix-nav)</span>

> 💡 什麼是 Vibe Coding？電腦科學家 [Andrej Karpathy](https://karpathy.ai/)（OpenAI 的聯合創始人之一，特斯拉前 AI 負責人）於 2025 年 2 月提出了 **vibe coding** 一詞。這個概念指的是一種依賴於 LLM 的編碼方法，**允許程式設計師透過提供自然語言描述而不是手動編寫程式碼來生成可工作的程式碼。**

![1767350588191](../../../zh-cn/stage-1/ai-capabilities-through-games/images/1767350588191.png)

從字面上看，Vibe Coding 可以理解為一種“用說的方式來做開發”。它的核心變化在於：你不再需要自己一行一行寫程式碼、查語法、調 Bug，而是直接用自然語言描述你想要的東西，例如：

“我需要一個登入頁面，上面有手機號輸入框和驗證碼輸入框。”
“登入成功後，跳轉到首頁，並在右上角顯示使用者名稱。”
“給我一個簡單的貪喫蛇小遊戲，可以用鍵盤方向鍵控制。”
大語言模型（LLM）會把這類描述自動翻譯成真正可以執行的程式碼，並生成對應的頁面、邏輯和資料結構。你看到效果後，再用自然語言提出修改意見，例如“按鈕再大一點”“背景換成深色”“得分記錄下來並顯示排行榜”，AI 會繼續按你的要求調整實現。

在這種模式下，你不需要先學會程式語言，再去寫程式碼；而是把主要精力放在：說清楚要做什麼、看到結果後判斷“哪裡不對”、再提出新的修改。AI 則負責把這些高層的想法落成具體實現，從而顯著減少機械、重複的編碼工作。

你可以點選這裡檢視更多關於 vibe coding 的細節：[https://www.ibm.com/think/topics/vibe-coding](https://www.ibm.com/think/topics/vibe-coding)

你可以點選這裡檢視更多關於 Karpathy 的分享內容：[https://karpathy.bearblog.dev/blog/](https://karpathy.bearblog.dev/blog/)

### 如何假裝自己是 Vibe Coding 大師

實際上，在真正的 vibe coding 過程中，我們通常不會使用很多複雜的提示詞。也許我們在開始時需要為整個程式提供一個具體且適度複雜的提示詞，但在那之後的每一步，你可能只需要以下型別的提示詞：

```
"程式碼裡有個 bug，請修復它。"
"我不要部分程式碼，給我完整的修改後的程式碼。"
"你的程式碼還是有問題。"
"請再次修改並給我完整的修正後的程式碼。"
"剛才還能執行，為什麼現在不能執行了？"
"你沒理解我的意思嗎？不要改我原來的程式碼。"
"不要新增任何除錯功能。"
"不要做我沒讓你做的事。"
"我讓你實現的功能在哪裡？"
"你聽不懂我說的話嗎？"
"我只要一個函式。"
"我告訴過你參考我之前的程式碼。"
"請不要新增不必要的註釋。"
"請不要修改我原始程式碼的基本邏輯。"
"幫我修改程式碼。"
"基於我的程式碼修改..."
"不要改我的變數名！！！"
"不要改原來的函式名！"
"不要亂動我的變數。"
"不要新增額外的功能。"
"不要只生成框架，生成完整的程式碼。"
```

這聽起來可能有點誇張，但實際上，這些就是我們在日常工作中可能使用的提示詞。由於大語言模型的**上下文長度限制**，或者有時因為它們的**指令遵循能力**不是很強，模型可能會忘記對話早些時候討論的內容。在 vibe coding 中，我們傾向使用長上下文的模型，並且使用指令遵循能力強的模型，我們可以透過這兩者的排行或者指標來判斷其是不是好模型。

或者，由於訓練資料集的風格，大模型傾向於以其訓練資料的風格回答。例如，有些人說話很嚴肅，有些人喜歡新增很多修飾，而有些大模型喜歡在程式碼中新增很多註釋或不必要的模組。

## <span id="appendix-3">[附錄 3：模型上下文](#appendix-nav)</span>

模型上下文可以理解為 AI 的短期記憶。它指的是在當前一次對話或一次任務中，模型能夠“看到”和“記住”的所有文字內容，包括你之前輸入的問題、系統提供的說明、相關資料等。

正是因為有上下文，AI 才能理解你在接著前面的內容繼續提問，才能進行一輪一輪、看起來連貫自然的對話。如果沒有上下文，你的每一句話在模型看來都像是一次全新的提問，它無法知道你之前說過什麼，也就談不上延續對話。

每個模型都有自己的有效上下文長度（context window）。這個長度通常用 token（可以粗略理解為“字詞片段”的單位）來衡量，目前主流模型大多在 32k～128k token 之間。上下文越長，模型一次能“讀”的內容就越多，例如：

- 一次性讀完一篇較長的論文或報告
- 在同一輪對話中引用多篇資料、多個案例
- 讓模型記住之前幾輪的複雜討論結論

當你輸入的內容接近或超過模型的上下文限制時，往往會出現一些常見現象：

- 模型開始遺忘前面長文字中的細節或關鍵資訊
- 對話進行到後面，話題逐漸偏離最初目標
- 對同一材料的不同問答之間，引用的內容不一致

這些現象並不是模型突然“變笨”，而是上下文容量被用滿或接近用滿後產生的自然結果。

在實際使用中，我們既希望上下文儘可能長，又要意識到：

- 上下文越長，佔用的算力資源越多
- 對應的呼叫成本（費用）也會隨之增加

因此，在設計 AI 應用時，需要在讓模型看得足夠多和控制成本、提升效率之間做平衡。例如：

- 對真正需要長期保留的資訊進行提煉後再交給模型
- 對不再需要的細節資訊，避免一遍又一遍原樣塞入上下文
- 使用外部知識庫等方式，把“長期記憶”交給系統，而不是強行塞進模型上下文中

## <span id="appendix-4">[附錄 4：指令遵循能力](#appendix-nav)</span>

指令遵循能力指的是：模型在理解你的指令之後，能否準確、完整地按照你的要求執行。它不僅包括能回答問題，還包括能按指定格式、風格、步驟完成任務。

例如，下面這些都是對模型有明確要求的指令：

- 將這篇文章總結為三個要點
- 用正式、禮貌的語氣寫一封回覆郵件
- 把這個詞翻譯成英文，並各造一個例句
- 從文章中提取作者、時間和主要事件

一個指令遵循能力強的模型，通常具備以下特徵：

- 按要求的數量輸出內容  
  例如要求總結三個要點，就不會給出五條。
- 覆蓋所有指定的要素  
  例如要求提取作者、時間和事件，就不會遺漏其中任何一項。
- 遵守指定的格式和語氣  
  例如要求使用正式語氣，就不會輸出過於口語化的回覆。
- 不做不必要的額外延伸  
  例如只要求翻譯和造句，就不會額外輸出一大段無關解釋。

在實際應用中，強指令遵循能力非常重要，原因包括：

- 提高穩定性：同樣的指令在不同時間、多次執行時，輸出結構和行為模式更加一致，不容易隨意發揮
- 提高可復現性：當你把一段提示詞配置到產品或流程中時，可以預期模型大致會怎樣響應，方便測試和迭代
- 便於系統整合：當模型輸出符合預期格式時，更容易與後端程式、工作流或其他工具自動對接

因此，在選擇和評估一個大語言模型時，除了關注它是否聰明、知識覆蓋是否廣之外，還需要特別關注它的指令遵循能力。對於工業級應用來說，能否穩定而準確地執行指令，往往比偶爾給出一次驚豔回答更重要。

<RelatedArticlesSection
  title="繼續學習"
  description="從“遊戲化體驗”出發，推薦你繼續進入本地開發與產品實踐。"
  :items="relatedArticles"
/>
---
title: '初級一：AI 時代，會說話就會編程'
description: '用對話式方式讓 AI 幫你寫代碼：從 0 到 1 做出 AI 原生貪吃蛇，並學會舉一反三做出自己的小遊戲或 Demo。'
---

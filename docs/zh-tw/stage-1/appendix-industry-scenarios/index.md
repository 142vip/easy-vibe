---
title: '從真實工作流里找 AI 場景'
description: '基於 60 余份咨詢、券商、行業研究與產品案例，拆解已經發生在企業和消費者身邊的 AI 應用場景。'
---

# 從真實工作流里找 AI 場景

很多“AI 行業應用大全”看起來很熱鬧：金融、醫療、教育、製造，每個行業下面再列十幾個點子。可真要動手時，你還是不知道該找誰、接什麼資料、替掉哪一步，也不知道做完以後誰會願意付錢。

問題在於，**行業不是場景**。“AI + 醫療”只是一個範圍；“醫生看診後要花十分鐘補病歷，系統先根據醫患對話起草記錄，再由醫生確認”才是一段可以研究、設計和驗證的工作流。

這篇附錄換一種寫法。我們查閱了 60 余份咨詢公司、券商、研究機構報告和產品案例，不再追求把行業列全，而是挑出已經有人使用、也能看見價值落點的 B 端和 C 端場景。你可以把它當成一張地圖，用來找到值得繼續訪談的問題，不要把它當成現成的創業答案。

<div class="research-note">
  <div>
    <span class="research-note__eyebrow">先記住這句話</span>
    <strong>B 端從工作流里找阻塞，C 端從一天里找反復發生的時刻。</strong>
  </div>
  <p>前者要說清誰在工作、經過哪些系統、最後由誰負責；後者要說清使用者為什麼會回來，以及 AI 比搜索、模板或人工服務究竟少了哪一步。</p>
</div>

## 先分清：B 端和 C 端不是兩套標題

### B 端：企業為結果付錢

企業很少為“能聊天”本身買單。它購買的通常是更短的處理時間、更少的返工、更穩定的合規質量，或者更多成交。一個可研究的 B 端場景，至少要能回答四件事：誰每天在做、材料從哪裡來、結果寫回哪個系統、出錯後誰負責。

這也是為什麼不少企業試驗遲遲沒能擴大。Deloitte 對 2,773 名企業管理者的調查顯示，很多組織仍只有少量生成式 AI 試驗能進入規模化階段；Accenture 對 2,000 多個項目的復盤也發現，真正產生企業級價值的組織仍是少數。難點往往不是模型能不能回答，而是它有沒有進入完整流程。[Deloitte：State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html) · [Accenture：Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)

### C 端：使用者為一個更輕鬆的時刻付錢

C 端產品不需要接入十套企業系統，但它要面對更直接的選擇：使用者隨時可以關掉 App。好的消費場景通常貼著一個明確時刻出現——準備旅行、比較商品、練口語、做一張海報、整理賬單。它先幫使用者完成一件事，再慢慢記住偏好。

Capgemini 對 12,000 名消費者的調查里，生成式 AI 已經進入商品發現和比較；QuestMobile 的國內資料也顯示，AI 應用正在從獨立聊天工具進入搜索、辦公、影像、音樂等已有產品。機會不只在“再做一個聊天框”，而在把對話接到下一步動作。[Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/) · [QuestMobile：2025 中國移動互聯網春季報告](https://www.questmobile.cn/research/report/1919961024158601218/)

## B 端：八段已經在發生的工作

下面每一節都從一個具體崗位開始。讀的時候，別急著抄產品名，先看清楚：原來的工作為什麼慢，AI 接住了哪一步，還有什麼必須留給人。

### 1. 客服不是“回答問題”，而是把一件事處理完

<figure class="product-shot">
  <a href="https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/klarna.jpg" alt="Klarna AI Assistant 的延期付款、多語言客服與退款解釋界面" loading="lazy" />
  </a>
  <figcaption><strong>Klarna AI Assistant：</strong>左邊不是一句“請聯繫人工”，而是直接給出延期付款入口；右邊把退款金額逐項拆開。客服 AI 真正有用的地方，是能查到這筆訂單並把動作接下去。</figcaption>
</figure>

**誰在做：** 一線客服、坐席主管和售後運營。

客戶說“我的退款怎麼還沒到”，客服要先確認身份，再去訂單、支付和物流系統查狀態，解釋規則，必要時創建工單。真正耗時的不是寫一句禮貌回復，而是在多個系統之間找齊上下文。

Klarna 的 AI 助手已經能處理退款、退貨和多語言客服；ResultsCX 的案例則把語音分流、賬戶查詢和後台 API 連在一起。兩者都說明，能產生價值的不是 FAQ，而是**查到狀態—按規則處理—留下記錄—必要時轉人工**這一整段。[Klarna 客服案例](https://openai.com/index/klarna/) · [ResultsCX 客服案例](https://aws.amazon.com/solutions/case-studies/resultscx/) · [Salesforce：State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)

如果你第一次做，可以只接“人工接待之後”的部分：自動生成會話小結、識別客戶訴求、帶出相關規則和建議動作，由客服確認後寫入工單。這樣既能測出節省了多少時間，也不會一開始就把退款權限交給模型。

<div class="scene-check">
  <span>值得追問</span>
  <p>客服最常切換哪幾個頁面？什麼問題看似重復，實際要根據訂單狀態做不同處理？轉人工時，下一位客服還要重新問一遍嗎？</p>
</div>

### 2. 銷售最缺的不是文案，是下一步該跟誰談什麼

<figure class="product-shot">
  <a href="https://openai.com/index/morgan-stanley/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/morgan-stanley.webp" alt="Morgan Stanley AI@MS Assistant 內部界面" loading="lazy" />
  </a>
  <figcaption><strong>Morgan Stanley AI@MS Assistant：</strong>顧問可以查詢開戶文件和案例狀態；頁面底部同時寫明“僅限內部使用”和需要人工核驗。它更像嵌進工作台的檢索入口，而不是替顧問做決定的聊天機器人。</figcaption>
</figure>

**誰在做：** B2B 銷售、客戶經理、售前和銷售主管。

一次客戶會議結束後，銷售往往要補 CRM、整理決策人、回顧異議、找案例、寫跟進郵件，再決定什麼時候聯繫。記錄散在會議錄音、聊天、郵箱和個人筆記里，主管看到的 CRM 經常已經過時。

McKinsey 對 B2B 銷售的研究把應用拆到完整交易週期：尋找線索、準備會面、輔助溝通、生成方案、推進成交和續約。Morgan Stanley 的財富顧問工具也不是替顧問做投資決定，而是讓他們快速檢索內部知識，並把客戶會議整理成筆記和待辦。[McKinsey：Unlocking Gen AI in B2B Sales](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai) · [Morgan Stanley 案例](https://openai.com/index/morgan-stanley/)

第一版可以只解決“會後十五分鐘”：從錄音中提取客戶目標、異議、承諾和下一步，生成一封可修改的跟進郵件，同時把字段補進 CRM。衡量它有沒有用，不看生成了多少字，看 CRM 是否更完整、跟進是否更及時。

### 3. 公司知識庫真正要解決的是“這一次該按哪條辦”

<figure class="product-shot">
  <a href="https://www.notion.com/help/guides/find-answers-and-generate-reports-with-enterprise-search" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/notion-enterprise-search.png" alt="Notion Enterprise Search 企業搜索界面" loading="lazy" />
  </a>
  <figcaption><strong>Notion Enterprise Search：</strong>同一個問題可以跨 Notion 與 Slack 查找，使用者還能在 Ask、Research 和 Build 之間切換。企業知識助手的產品形態，重點是接入現有資料和權限，而不只是上傳一份 PDF。</figcaption>
</figure>

**誰在做：** 顧問、運營、人力、財務、IT 支持和新員工。

企業里的答案往往並不缺，只是散在制度、產品手冊、歷史郵件、培訓影片和舊項目中。員工問“這類客戶能不能退款”，需要的不只是搜到含有“退款”的文件，而是拿到當前版本的規則、適用條件和出處。

Sun Life 的內部助手每周處理一萬多次員工查詢；Morgan Stanley 把可檢索的內部語料從有限問答擴展到約十萬份文件；Notion 的產品也把企業搜索、會議記錄和任務執行放進同一個工作空間。這類產品的核心不是“上傳 PDF 就能問”，而是權限、版本、來源和反饋閉環。[Sun Life Asks](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/) · [Notion AI 功能說明](https://www.notion.com/help/notion-ai-faqs)

第一次不要接全公司。選一個問題密集、資料邊界清楚的部門，例如售後政策或 IT 幫助台。回答必須帶原文位置；找不到時明確說找不到，並把問題收進待補資料列表。

### 4. 財務、法務與合規：先讀材料，再起草，不替人簽字

<figure class="product-shot">
  <a href="https://mena.thomsonreuters.com/en/products-services/legal/cocounsel.html" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/cocounsel.jpg" alt="Thomson Reuters CoCounsel 合同起草與研究界面" loading="lazy" />
  </a>
  <figcaption><strong>Thomson Reuters CoCounsel：</strong>左側顯示“起草”和“研究”兩項任務的進度，完成後再把草稿打開到 Word。AI 先讀材料、找依據、起草，專業人員仍在熟悉的文件里復核和定稿。</figcaption>
</figure>

**誰在做：** 財務分析、稅務、法務、採購和合規人員。

這些崗位每天面對大量格式相近、內容各異的材料：合同、發票、報表、政策、審計底稿和盡調文件。AI 適合先做抽取、比對、歸類、檢索和初稿，但最終判斷必須能回到原文，也必須有人負責。

Thomson Reuters 的 2025 年調查顯示，法律、稅務、風控等專業服務的生成式 AI 使用正在上升，常見工作包括法律與稅務研究、文件摘要、合同起草和申報準備。Moderna 的 Contract Companion 讓員工先得到合同摘要；OpenAI 與 PwC 則把財務智能體放在對賬、風險提示和跨系統流程里討論。[Thomson Reuters：2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/) · [Moderna 案例](https://openai.com/index/moderna/) · [OpenAI × PwC：CFO 工作流](https://openai.com/index/openai-pwc-finance-collaboration/)

適合小團隊驗證的切口，是一種固定材料和一套明確規則：例如逐條核對供應商合同里的付款、續約、賠償和資料條款，給出原文引用和風險說明。不要一上來承諾“AI 法務”，先證明漏檢率、復核時間和引用準確率。

### 5. 軟體開發：價值出現在倉庫里，不在單獨的聊天窗口裡

<figure class="product-shot">
  <a href="https://github.blog/changelog/2024-10-29-github-copilot-code-review-in-github-com-private-preview/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/github-copilot-review.png" alt="GitHub Copilot 在 Pull Request 中給出代碼審查建議" loading="lazy" />
  </a>
  <figcaption><strong>GitHub Copilot Code Review：</strong>Copilot 被選為審查人後，會把問題落到具體代碼行，並給出可提交的修改；開發者仍能查看差異、加入批次或拒絕建議。價值發生在 Pull Request 里，不在另一個聊天窗口裡。</figcaption>
</figure>

**誰在做：** 開發、測試、運維和安全工程師。

開發者真正花時間的地方包括理解舊代碼、補測試、查日誌、做代碼評審和熟悉陌生項目。GitHub 的受控實驗中，使用 Copilot 的參與者完成指定編程任務更快；但在真實團隊裡，能不能讀懂倉庫上下文、遵守規範、跑過測試，遠比“能生成代碼”重要。[GitHub Copilot 生產力研究](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [GitHub 後續研究報告](https://github.blog/wp-content/uploads/2023/06/Sea-Change-in-Software-Dev.pdf)

一個扎實的內部工具，可以從“失敗的 CI”開始：讀取報錯和相關改動，定位可能原因，提出修復建議並生成待審補丁。它必須執行測試、展示差異、接受評審，而不是直接把代碼推到生產環境。

### 6. 製造與現場服務：讓設備、手冊和工單說同一種話

<figure class="product-shot">
  <a href="https://blog.siemens.com/2026/02/the-digital-enterprise-and-the-synthesis-of-industrial-ai-digital-twin-and-data/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/siemens-industrial-copilot.jpg" alt="Siemens Engineering Copilot 與 TIA Portal 並排執行" loading="lazy" />
  </a>
  <figcaption><strong>Siemens Engineering Copilot：</strong>右側 Copilot 與左側 TIA Portal 同時打開。工程師提問時，助手面對的是當前自動化項目、設備結構和工程文件，而不是脫離現場回答一個寬泛的“機器為什麼壞了”。</figcaption>
</figure>

**誰在做：** 設備操作員、維修工程師、現場服務人員和工藝工程師。

機器停下來時，操作員看到的可能是一串錯誤碼。答案散在數百頁手冊、備件清單和歷史維修記錄中，真正的損失卻按停機分鐘計算。另一方面，現場人員修好設備後，還要補一份客戶能看懂、公司能歸檔的服務報告。

Siemens Industrial Copilot 已用於解釋設備信息、查找維修依據和輔助自動化編程；Siemens 的另一項現場服務試驗，則面向每年超過 140 萬份工單報告，把工程師的簡短記錄整理成一致的客戶報告。Deloitte 的製造業調查也提醒，資料質量和設備上下文仍是主要門檻。[Siemens Industrial Copilot](https://news.microsoft.com/source/emea/features/how-ai-is-helping-siemens-and-thyssenkrupp-bridge-skilling-gaps-in-manufacturing/) · [Siemens 現場報告案例](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service) · [Deloitte：2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)

小切口往往不是“預測整個工廠”，而是圍繞一種設備：識別錯誤碼，檢索對應手冊和歷史工單，給出排查順序；維修完成後，再把操作記錄整理成報告。所有建議都要顯示依據，並允許工程師標記“無效”。

### 7. 醫療先做文書和協調，不要把診斷當成演示功能

<figure class="product-shot">
  <a href="https://www.abridge.com/product" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/abridge-note.png" alt="Abridge 將臨床記錄與原始醫患對話關聯的界面" loading="lazy" />
  </a>
  <figcaption><strong>Abridge：</strong>上方是生成的病歷段落，下方是對應的醫患對話，點擊 Linked Evidence 可以回到原話。這裡最重要的不是“自動寫得快”，而是醫生能追溯、修改並確認每條記錄。</figcaption>
</figure>

**誰在做：** 醫生、護士、病案人員、保險審核和患者服務團隊。

醫療里最容易被忽略的負擔，是看診之外的記錄、轉診、授權、理賠和患者溝通。McKinsey 總結的近端應用，大量集中在病歷摘要、保險權益查詢、拒賠原因整理、出院說明和後台運營，而不是讓模型獨立診斷。[McKinsey：Tackling Healthcare’s Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)

Abridge 等環境式記錄產品，會從醫患對話生成結構化病歷草稿，再由醫生確認。這個“草稿—復核—寫回病歷”的邊界很重要：它減少文書時間，但沒有改變臨床責任人。[Abridge 醫療系統案例](https://www.abridge.com/press-release/abridge-hartford-healthcare) · [McKinsey：Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)

如果沒有醫療合規、資料和臨床夥伴，不要從診斷產品起步。可以先研究低風險的患者服務，例如把複雜的就診準備說明改寫成分步驟清單，或幫助工作人員整理來電，但仍要經過機構審核。

### 8. 零售和內容運營：一份素材要走完十幾個渠道

<figure class="product-shot">
  <a href="https://www.canva.com/newsroom/news/magic-studio/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/canva-magic-switch.png" alt="Canva Magic Switch 的改尺寸、翻譯與轉文件菜單" loading="lazy" />
  </a>
  <figcaption><strong>Canva Magic Switch：</strong>同一份設計可以繼續改尺寸、翻譯或轉成文件。對內容團隊來說，這正是“一份確認過的素材，接著做出多個渠道版本”的那段高頻工作。</figcaption>
</figure>

**誰在做：** 電商運營、品牌市場、設計、商品和本地化團隊。

新品上線不是“寫一段文案”這麼簡單。團隊要理解商品資料，生成不同平台的標題和賣點，處理圖片，適配尺寸，翻譯本地語言，檢查禁用詞，再根據反饋更新。大量時間花在搬運、改版和核對一致性上。

Deloitte 的零售展望把個性化、商品運營、供應鏈和營銷列為 AI 正在進入的環節。Canva 的 Magic Switch 可以把同一內容改成不同尺寸和語言，Adobe Firefly 則把生成、編輯和生產素材放在同一工作流里。這些案例的共同點是：AI 沒有替代品牌判斷，而是減少一份素材變成多個版本時的機械勞動。[Deloitte：2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html) · [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

第一版可以服務一個渠道和一種商品：從結構化商品資料生成詳情頁草稿，自動檢查必填項、尺寸和違禁表達，最終由運營發佈。比“萬能營銷助手”更容易獲得真實反饋。

## C 端：七個使用者會主動打開產品的時刻

C 端應用最容易犯的錯，是把同一個聊天框換七種提示詞。下面這些產品之所以成立，是因為對話後面接著商品、課程、行程、畫布、音樂或財務資料，使用者可以繼續完成事情。

### 1. “幫我把選擇變少”：搜索、比較與購買

<figure class="product-shot product-shot--mobile">
  <a href="https://www.aboutamazon.com/news/retail/amazon-rufus" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/amazon-rufus.jpg" alt="Amazon Rufus 購物助手界面" loading="lazy" />
  </a>
  <figcaption><strong>Amazon Rufus：</strong>入口就在 Amazon 搜索框下面，問題也圍繞購物展開：比較桌布、為 Prime Day 做準備、尋找適合睡眠監測的手錶。它能繼續接到真實商品，而不是只給一段泛泛建議。</figcaption>
</figure>

使用者買相機、嬰兒車或一雙適合雨天通勤的鞋時，不缺商品頁，缺的是把模糊條件變成可比較的選擇。Amazon 的 Rufus 會結合商品目錄、評價和問答回答購買問題；Capgemini 和 Adobe 的消費者研究也都看到，使用者開始用 AI 做商品發現、比較和售前咨詢。[Amazon Rufus](https://www.aboutamazon.com/news/retail/amazon-rufus) · [Adobe：2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)

可以研究的不是“AI 導購”四個字，而是某一類難選商品。比如租房族買投影儀，需要同時考慮投射距離、白天亮度、噪聲和預算。產品應展示比較依據、缺失信息和真實商品，而不是編一個看似專業的結論。

### 2. “我不想開二十個網頁”：旅行計劃與臨場調整

<figure class="product-shot">
  <a href="https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/expedia-chatgpt.jpg" alt="Expedia 對話式旅行規劃界面" loading="lazy" />
  </a>
  <figcaption><strong>Expedia 對話式旅行規劃：</strong>使用者從“蜜月去 Maui 還是 Kauai”聊起，得到酒店建議後可以直接保存到 Trips。真正形成產品閉環的，是聊天結果進入了收藏、行程和預訂。</figcaption>
</figure>

旅行規劃要來回處理目的地、日期、交通、營業時間、預算和同行人偏好。Expedia 把開放式對話接到酒店收藏、價格和預訂流程里，說明旅行 AI 的價值不是寫一篇漂亮路書，而是把建議變成可保存、可核對、可購買的行程。[Expedia 對話式旅行規劃](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/) · [Expedia AI 服務案例](https://www.expedia.com/newsroom/expedia-group-sets-the-standard-with-ai-powered-service-agent/)

更小的切口可以是“帶孩子去某座城市的半日行程”或“演出散場後的夜間路線”。實時信息要來自可靠接口；天氣、票價和營業時間必須標注更新時間。

### 3. “我想練一遍，不只聽一遍”：學習與反饋

<figure class="product-shot product-shot--portrait">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-roleplay.png" alt="Duolingo Max 的巴黎咖啡館角色扮演練習" loading="lazy" />
  </a>
  <figcaption><strong>Duolingo Max Roleplay：</strong>練習不是一句“和 AI 聊法語”，而是一個具體任務：在巴黎咖啡館點餐。場景、角色、目標和獎勵都已經設好，使用者打開後馬上就能練一輪。</figcaption>
</figure>

生成式 AI 最適合補上過去很貴的一環：隨時練習並得到針對這一次表現的反饋。Duolingo Max 用角色扮演和影片對話練語言；Khanmigo 更強調通過提問和提示引導學生，而不是直接交答案。[Duolingo Max](https://blog.duolingo.com/duolingo-max/) · [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)

一個具體產品可以只服務一個練習動作：面試回答、英語口語、銷售異議處理或答辯演練。使用者說完以後，反饋要對應原句，並給出下一輪可執行的改進，而不是泛泛地誇“表達很清晰”。

### 4. “先給我一個能改的初稿”：個人創作

<figure class="product-shot">
  <a href="https://firefly.adobe.com/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/adobe-firefly.png" alt="Adobe Firefly 文生圖工作界面" loading="lazy" />
  </a>
  <figcaption><strong>Adobe Firefly：</strong>真實界面里不只有一個提示詞框，還能選擇模型、比例、內容類型、視覺強度和參考圖，並比較多組結果。個人創作產品要給使用者繼續修改的控制，而不是只剩“再生成一次”。</figcaption>
</figure>

普通使用者做生日邀請、二手商品圖、短影片封面或社團海報時，最大的門檻常常是空白畫布和複雜軟體。Canva 把生成、摳圖、擴圖、改尺寸和翻譯放進設計畫布；Adobe Firefly 則讓創作者在圖像、影片、音頻和矢量素材之間繼續編輯。[Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly 發佈](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

這類產品要給使用者控制，而不是只給“再生成一次”。好切口往往包含一個明確成品：一套房源圖、一個播客封面、三種尺寸的活動海報。使用者可以鎖定文字、人物和品牌色，只讓 AI 改局部。

### 5. “這次錯在哪”：個人化解釋

<figure class="product-shot">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/duolingo-explain.jpg" alt="Duolingo Max Explain My Answer 的答錯解釋界面" loading="lazy" />
  </a>
  <figcaption><strong>Explain My Answer：</strong>中間這張界面直接引用使用者剛才的答案，解釋為什麼複數 vestidos 要配 gustan，並允許繼續要例子。它不是重新講一節語法課，而是接住“我剛才到底錯在哪”這一刻。</figcaption>
</figure>

同一個答案，對新手和熟練者需要不同解釋。Duolingo 的 Explain My Answer 從使用者剛剛做錯的題出發；這比另開一個通用問答更自然，因為系統已經知道題目、答案和學習進度。[Duolingo：Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free/)

類似思路也適用於健身動作、攝影參數、棋局復盤和樂器練習：先拿到一次真實表現，再指出一個最值得改的地方。沒有輸入資料的“個性化建議”，通常只是換了稱呼的通用內容。

### 6. “別只推薦，替我記住”：音樂和日常陪伴式體驗

<figure class="product-shot product-shot--mobile">
  <a href="https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/spotify-ai-dj.jpg" alt="Spotify AI DJ 播放界面" loading="lazy" />
  </a>
  <figcaption><strong>Spotify AI DJ：</strong>DJ 是首頁里的一個持續播放入口，下面直接接著曲目和播放控制。它依靠的是使用者長期收聽記錄、Spotify 的內容庫和下一首播放動作，而不只是生成一段像主持人的話。</figcaption>
</figure>

Spotify 的 AI DJ 不只是生成一句介紹，它基於使用者長期的收聽歷史選歌，並用一個持續存在的聲音串起體驗。這裡真正難複製的是偏好資料、內容版權和播放動作，不是 DJ 的語氣。[Spotify AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/) · [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)

你也可以從別的“連續體驗”里找機會，例如跑步、做飯或睡前閱讀。關鍵是產品能根據過去的選擇調整下一次內容，同時允許使用者輕鬆糾正，而不是假裝比使用者更懂自己。

### 7. “把複雜規定變成我的下一步”：個人財務與生活事務

<figure class="product-shot product-shot--portrait">
  <a href="https://turbotax.intuit.com/personal-taxes/mobile-apps/turbotax/" target="_blank" rel="noreferrer">
    <img src="../../../zh-cn/stage-1/appendix-industry-scenarios/images/products/intuit-assist.jpg" alt="TurboTax 中 Intuit Assist 比較兩年稅收抵免的界面" loading="lazy" />
  </a>
  <figcaption><strong>TurboTax 中的 Intuit Assist：</strong>它不是從零談稅務，而是拿使用者今年與去年的抵免金額做比較，再給出“還能申請哪些抵免”等下一步問題。個人財務助手的基礎，是使用者自己的資料和當下任務。</figcaption>
</figure>

報稅、信用、保險和賬單的共同難點，是規則複雜、材料分散，而且每個人的下一步不同。Intuit Assist 把生成式 AI 放進 TurboTax、Credit Karma 和 QuickBooks，目標不是陪聊，而是結合使用者已有的財務資料給出解釋和行動建議。[Intuit Assist](https://www.intuit.com/intuitassist/)

這類產品風險也更高。第一版更適合做材料清單、概念解釋、賬單分類和辦理提醒，並清楚區分事實、估算和建議。涉及報稅提交、投資交易或保險選擇時，應讓使用者確認並提供專業支持入口。

## 去哪裡找自己的 B 端和 C 端方向

上面的案例用來認識“場景長什麼樣”，不是讓你照著換一個行業。真正屬於你的方向，通常藏在你能接觸到的人、資料和日常習慣里。B 端與 C 端的找法不一樣。

### 找 B 端：沿著一個崗位，把工作追到底

B 端資料不會直接寫“這裡有一個創業機會”。它更常以招聘要求、採購文件、操作手冊、軟體評價和項目案例出現。先選一個具體崗位，例如外貿跟單、物業客服、診所前台或設備維修員，再順著他的工作找材料。

<div class="idea-routes">
  <div class="idea-route idea-route--b">
    <span>B 端從這裡找</span>
    <ul>
      <li><strong>招聘網站：</strong>看崗位每天負責什麼，常用哪些系統，要交付哪些表格和報告。</li>
      <li><strong>招標與採購公告：</strong>看企業正在花錢解決什麼，驗收標準和系統邊界寫得尤其具體。</li>
      <li><strong>軟體評價區：</strong>到 G2、Capterra、應用市場和行業論壇看差評，找“還要導出到 Excel”“每次都要手工補”的地方。</li>
      <li><strong>公司案例與年報：</strong>搜索企業名加“數字化案例”“效率提升”“客戶服務”，看已經進入預算的項目。</li>
      <li><strong>真實工作材料：</strong>舊工單、報價單、檢查表、群聊求助和培訓文件，往往比行業報告更接近產品入口。</li>
    </ul>
  </div>
  <div class="idea-route idea-route--c">
    <span>可以直接這樣搜</span>
    <p><code>設備維修員 日常工作流程</code></p>
    <p><code>物業客服 招標 智能化 filetype:pdf</code></p>
    <p><code>site:g2.com field service software reviews</code></p>
    <p><code>customer support workflow pain points report</code></p>
    <p><code>某行業 數字化轉型 案例 年報</code></p>
  </div>
</div>

假設你對外貿感興趣，不要只搜“AI + 外貿”。先看跟單員招聘信息，記下“詢盤回復、報價、核對規格、催交期、準備報關材料”；再找一份真實報價單和幾條跨境軟體差評。你可能會發現，最值得做的不是萬能外貿助手，而是“收到英文詢盤後，從歷史報價和產品參數里整理一份待確認報價”。

### 找 C 端：沿著一天，找反復出現的麻煩

C 端不從崗位出發，而從一個人什麼時候會掏出手機開始。回想一天里的搜索、比較、記錄、練習、等待和分享：哪些事情每周都會發生？使用者現在用截圖、備忘錄、收藏夾或群聊勉強完成什麼？

<div class="idea-routes">
  <div class="idea-route idea-route--c">
    <span>C 端從這裡找</span>
    <ul>
      <li><strong>App Store 與安卓商店：</strong>先看同類產品的一星到三星評價，關注缺失功能、收費節點和棄用原因。</li>
      <li><strong>小紅書、抖音、B 站與 Reddit：</strong>搜索“怎麼做”“有沒有工具”“求推薦”，評論區常有更具體的補充。</li>
      <li><strong>Product Hunt 與榜單：</strong>看新產品解決了哪個小動作，再看評論里使用者希望它接著完成什麼。</li>
      <li><strong>趨勢與流量報告：</strong>用 Google Trends、QuestMobile、艾瑞和平台年度報告確認這是不是一群人的長期行為。</li>
      <li><strong>自己的相冊和收藏夾：</strong>大量截圖、收藏後不再打開的攻略、反復複製的文字，都是沒有被接好的流程。</li>
    </ul>
  </div>
  <div class="idea-route idea-route--b">
    <span>可以直接這樣搜</span>
    <p><code>site:reddit.com "I wish there was an app"</code></p>
    <p><code>帶孩子旅行 攻略 太累</code></p>
    <p><code>記賬 App 難用 評論</code></p>
    <p><code>Product Hunt AI language learning</code></p>
    <p><code>AI 應用 使用者規模 QuestMobile</code></p>
  </div>
</div>

假設你經常旅行，先別做“AI 路書”。去看使用者為什麼收藏十幾篇攻略：有人是怕餐廳臨時休息，有人要照顧老人少走路，有人需要在演出散場後安全回酒店。選中一個反復出現的時刻，產品才可能從“生成一篇文字”變成真正有人打開的工具。

### 資料找到以後，別急著寫代碼

一個方向至少要留下三類證據：一份能看懂流程的材料、三個人重復提到的麻煩、一個已經有人付費或花時間繞過去的替代辦法。然後用 60 分鐘把它寫具體。

<div class="fieldwork">
  <div class="fieldwork__step"><b>01</b><span>圈定一個人</span><p>B 端寫到崗位，C 端寫到某類生活狀態。不要只寫“企業使用者”或“年輕人”。</p></div>
  <div class="fieldwork__step"><b>02</b><span>找到一次發生</span><p>拿到一張表、一段錄屏、一條差評或一次真實操作，看看麻煩具體卡在哪裡。</p></div>
  <div class="fieldwork__step"><b>03</b><span>交叉找三次</span><p>同類問題至少來自三個人或三個來源，避免被一句有趣的抱怨帶跑。</p></div>
  <div class="fieldwork__step"><b>04</b><span>只接住一步</span><p>寫清輸入、輸出、確認人和衡量指標，再決定 AI 是否真的合適。</p></div>
</div>

最後，把方向寫成一句別人聽完就能想象的描述：

> 當 **誰** 遇到 **什麼時刻**，他現在要用 **哪些材料或辦法** 完成 **哪件事**。我先讓 AI 接住 **其中一步**，結果由 **誰確認**，再用 **什麼變化** 判斷它有沒有價值。

一個 B 端方向可以這樣寫：

> 當包裝線操作員看到 E37 錯誤碼時，他現在要翻紙質手冊和舊工單。系統先根據設備型號找出相關章節和三個排查步驟，由維修工程師確認；試點看平均停機時間是否下降。

一個 C 端方向可以這樣寫：

> 當家長週末帶孩子逛博物館時，他現在要在公眾號、地圖和點評之間拼行程。產品先按孩子年齡和可用時間整理三小時路線，開放時間與票價保留來源，家長確認後加入日曆。

能寫到這個程度，你才擁有一個可以繼續訪談、做原型和小範圍試用的 idea。

## 參考資料

下面共列出 **67 個資訊來源**。正文優先採用調查方法清楚的咨詢報告、行業研究和產品一手案例；券商報告主要用來觀察國內市場關注的商業化方向，不把投資判斷當作使用者需求。部分廠商案例帶有營銷立場，使用時應與訪談、真實業務資料交叉驗證。

<details class="source-group">
<summary>一、總體採用與企業價值（15）</summary>

1. [McKinsey：The Economic Potential of Generative AI](https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier)
2. [McKinsey：The State of AI 2025](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai)
3. [PwC：2025 Global AI Jobs Barometer](https://www.pwc.com/gx/en/issues/c-suite-insights/the-leadership-agenda/AI-jobs-barometer.html)
4. [PwC：Global Workforce Hopes and Fears Survey 2025](https://www.pwc.com/gr/en/publications/specific-to-all-industries-index/hopes-and-fears-2025.html)
5. [Deloitte：State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html)
6. [Microsoft：2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)
7. [IBM：5 Trends for 2025](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/business-trends-2025)
8. [IBM：2025 CDO Study](https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/2025-cdo)
9. [Cisco：2025 AI Readiness Index](https://www.cisco.com/c/m/en_us/solutions/ai/readiness-index/realizing-the-value-of-ai.html)
10. [EY：2025 AI Pulse Survey](https://www.ey.com/en_us/insights/emerging-technologies/pulse-ai-survey)
11. [Accenture：Reinventing Enterprise Models in the Age of Gen AI](https://www.accenture.com/us-en/insights/artificial-intelligence/ai-investments)
12. [Accenture：Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)
13. [OpenAI：The State of Enterprise AI 2025](https://openai.com/business/guides-and-resources/the-state-of-enterprise-ai-2025-report/)
14. [中國信通院：《人工智能發展報告（2024 年）》](https://hrssit.cn/Uploads/file/20241217/1734400434600250.pdf)
15. [CNNIC：《生成式人工智能應用發展報告（2025）》](https://www3.cnnic.cn/n4/2025/1021/c88-11391.html)

</details>

<details class="source-group">
<summary>二、B 端行業、崗位與工作流（24）</summary>

16. [McKinsey：Unlocking Profitable B2B Growth Through Gen AI](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai)
17. [McKinsey：Capturing the Full Value of Generative AI in Banking](https://www.mckinsey.com/industries/financial-services/our-insights/capturing-the-full-value-of-generative-ai-in-banking)
18. [McKinsey：The AI-powered Bank—Customer Care](https://www.mckinsey.com/industries/financial-services/our-insights/the-ai-powered-bank-rewiring-for-excellence-in-customer-care)
19. [McKinsey：The Future of AI in Insurance](https://www.mckinsey.com/industries/financial-services/our-insights/the-future-of-ai-in-the-insurance-industry)
20. [McKinsey：Tackling Healthcare’s Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)
21. [McKinsey：Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)
22. [Deloitte：2025 Manufacturing Industry Outlook](https://www.deloitte.com/us/en/insights/industry/manufacturing-industrial-products/manufacturing-industry-outlook/2025.html)
23. [Deloitte：2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)
24. [Deloitte：2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html)
25. [Deloitte：2025 Global Health Care Outlook](https://www.deloitte.com/content/dam/assets-zone1/tw/en/docs/industries/life-sciences-health-care/2025/2025-healthcare-outlook-en.pdf)
26. [Accenture：Commercial Banking Trends 2024](https://www.accenture.com/content/dam/accenture/final/accenture-com/document-2/Accenture-Commercial-Banking-Trends-2024.pdf)
27. [Accenture：Banking Trends 2026](https://www.accenture.com/us-en/insights/banking/accenture-banking-trends-2026)
28. [Thomson Reuters：2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/)
29. [Salesforce：State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)
30. [Salesforce：State of Sales 2026](https://www.salesforce.com/en/wp-content/uploads/sites/4/documents/reports/sales/salesforce-state-of-sales-report-2026.pdf)
31. [Adobe：2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)
32. [Adobe：2025 Content Creation and Management](https://business.adobe.com/content/dam/dx/us/en/resources/reports/content-management-digital-trends/2025-ai-and-digital-trends-content-creation-and-management.pdf)
33. [艾瑞咨詢：《2025 年中國企業級 AI 應用行業研究報告》](https://www.bsia.org.cn/site/content/31686.html)
34. [GitHub：Quantifying Copilot’s Impact on Developer Productivity](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)
35. [Siemens × Microsoft：Industrial Copilot](https://news.microsoft.com/source/2024/10/24/siemens-and-microsoft-scale-industrial-ai/)
36. [Abridge：Hartford HealthCare Ambient AI 案例](https://www.abridge.com/press-release/abridge-hartford-healthcare)
37. [AWS：Sun Life 內部知識助手](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/)
38. [AWS：ResultsCX 客服自動化](https://aws.amazon.com/solutions/case-studies/resultscx/)
39. [AWS：Sanofi 企業 AI 助手](https://aws.amazon.com/solutions/case-studies/sanofi-bedrock-case-study/)

</details>

<details class="source-group">
<summary>三、落地產品與企業案例（10）</summary>

40. [OpenAI：Morgan Stanley](https://openai.com/index/morgan-stanley/)
41. [OpenAI：Klarna](https://openai.com/index/klarna/)
42. [OpenAI：Moderna](https://openai.com/index/moderna/)
43. [OpenAI：BBVA](https://openai.com/index/bbva-2025/)
44. [OpenAI × PwC：Reimagining the Office of the CFO](https://openai.com/index/openai-pwc-finance-collaboration/)
45. [Microsoft：Siemens 現場服務報告](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service)
46. [AWS：Legal & General 文件處理](https://aws.amazon.com/solutions/case-studies/aws-innovator-legal-and-general/)
47. [AWS × Infosys：醫療保險客服助手](https://aws.amazon.com/blogs/apn/how-infosys-built-aws-generative-ai-based-assistant-for-a-healthcare-payer-company/)
48. [Notion：Notion AI 功能說明](https://www.notion.com/help/notion-ai-faqs)
49. [Canva：Magic Studio](https://www.canva.com/newsroom/news/magic-studio/)

</details>

<details class="source-group">
<summary>四、C 端消費者與產品（13）</summary>

50. [Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/)
51. [Accenture：Me, My Brand and AI](https://www.accenture.com/us-en/insights/consulting/me-my-brand-ai-new-world-consumer-engagement)
52. [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
53. [QuestMobile：2025 中國移動互聯網春季報告](https://www.questmobile.cn/research/report/1919961024158601218/)
54. [QuestMobile：2025 年 8 月 AI 應用行業報告](https://www.questmobile.com.cn/research/report/1967853261412208641/)
55. [艾瑞咨詢：《2025 年中國 AI 類 App 流量分析報告》](https://www.etc.org.cn/UserFiles/Article/file/6388341575962762472758248.pdf)
56. [Amazon：Rufus 購物助手](https://www.aboutamazon.com/news/retail/amazon-rufus)
57. [Expedia：對話式旅行規劃](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/)
58. [Duolingo：Duolingo Max](https://blog.duolingo.com/duolingo-max/)
59. [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)
60. [Spotify：AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/)
61. [Intuit：Intuit Assist](https://www.intuit.com/intuitassist/)
62. [Adobe：Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

</details>

<details class="source-group">
<summary>五、國內券商視角（5）</summary>

63. [華鑫證券：WAIC 大會強供給，AI 應用商業化如何解](https://pdf.dfcfw.com/pdf/H3_AP202507291717868704_1.pdf)
64. [國信證券：人工智能專題——AI Agent](https://pdf.dfcfw.com/pdf/H3_AP202503121644302597_1.pdf)
65. [東吳證券：2025 年 AI 應用滲透趨勢](https://pdf.dfcfw.com/pdf/H301_AP202501021641518997_1.pdf)
66. [中銀證券：“人工智能+”應用與平台](https://pdf.dfcfw.com/pdf/H3_AP202510201765533690_1.pdf)
67. [AIGC 行業深度：算力、模型與應用的創新融合](https://pdf.dfcfw.com/pdf/H3_AP202411151640914780_1.pdf)

</details>

<p class="source-footnote">資料檢索與整理時間：2026 年 8 月。報告中的比例受樣本、地區和廠商口徑影響，不能直接代替你對目標使用者的訪談與試用資料。</p>

<style scoped>
.research-note {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 24px;
  margin: 32px 0 42px;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background:
    radial-gradient(circle at 8% 12%, color-mix(in srgb, var(--vp-c-brand-1) 16%, transparent), transparent 34%),
    var(--vp-c-bg-soft);
}

.research-note__eyebrow {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .12em;
}

.research-note strong {
  display: block;
  font-size: 21px;
  line-height: 1.5;
}

.research-note p {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.8;
}

.scene-check {
  margin: 24px 0 38px;
  padding: 18px 20px;
  border-left: 3px solid var(--vp-c-brand-1);
  border-radius: 0 12px 12px 0;
  background: var(--vp-c-bg-soft);
}

.scene-check span {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.scene-check p {
  margin: 6px 0 0;
}

.product-shot {
  margin: 20px 0 30px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 14px 38px color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
}

.product-shot a {
  display: block;
  background: #f5f5f3;
}

.product-shot img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.product-shot--portrait img {
  max-height: 560px;
}

.product-shot--mobile img {
  max-height: 520px;
}

.product-shot figcaption {
  padding: 14px 17px 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.product-shot figcaption strong {
  color: var(--vp-c-text-1);
}

.idea-routes {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(240px, .75fr);
  gap: 14px;
  margin: 24px 0 28px;
}

.idea-route {
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
}

.idea-route--b {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 58%, var(--vp-c-bg));
}

.idea-route--c {
  background: var(--vp-c-bg-soft);
}

.idea-route > span {
  display: block;
  margin-bottom: 12px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 700;
}

.idea-route ul {
  margin: 0;
  padding-left: 20px;
}

.idea-route li {
  margin: 10px 0;
}

.idea-route p {
  margin: 8px 0;
}

.idea-route code {
  white-space: normal;
  word-break: break-word;
}

.fieldwork {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin: 28px 0 34px;
}

.fieldwork__step {
  min-height: 150px;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}

.fieldwork__step b {
  display: block;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  letter-spacing: .1em;
}

.fieldwork__step span {
  display: block;
  margin-top: 12px;
  font-size: 18px;
  font-weight: 700;
}

.fieldwork__step p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
}

.source-group {
  margin: 12px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.source-group summary {
  padding: 16px 18px;
  cursor: pointer;
  font-weight: 700;
}

.source-group ol {
  margin: 0;
  padding: 0 22px 18px 44px;
}

.source-group li {
  margin: 8px 0;
}

.source-footnote {
  margin-top: 18px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

@media (max-width: 720px) {
  .research-note,
  .idea-routes,
  .fieldwork {
    grid-template-columns: 1fr;
  }

  .research-note {
    padding: 22px;
  }

  .fieldwork__step {
    min-height: auto;
  }
}
</style>

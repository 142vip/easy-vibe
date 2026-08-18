---
title: '為原型接入 AI 能力'
description: '從提示詞設計、官方文檔閱讀和服務台配置開始，為 Web 原型接入文本、視覺、圖像、語音與影片能力。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from '../../../zh-cn/stage-1/integrating-ai-capabilities/AiCapabilityGuide.vue'
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'

const duration = '約 <strong>1～2 天</strong>'
const relatedArticles =
  relatedArticlesMap['zh-tw/stage-1/integrating-ai-capabilities'] ?? []
</script>

# 為原型接入 AI 能力


## 章節導讀

<ChapterIntroduction :duration="duration" :tags="['提示詞', 'API 文檔', '服務台', '多模態']" coreOutput="為原型接入 1～2 種真實 AI 能力" expectedOutput="能夠呼叫文本、圖像、語音或影片服務的 Web 原型">

上一章完成的原型已經可以驗證頁面結構和操作流程，但生成結果仍然來自模擬數據。本章將把其中一個核心動作接到真實的 AI 服務上。

接入 AI 不只是“複製一段 API 代碼”。我們要同時處理三件事：**怎樣描述任務、怎樣讀懂官方文檔、怎樣把呼叫安全地放進產品流程。**

本章先建立一套通用方法，再分別看文本、圖片理解、圖片生成、語音和影片。模型名稱和控制台界面會持續更新，因此示例用於說明結構；實際接入時，應從對應服務的當前文檔中複製模型 ID 和參數。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: '寫清任務', description: '準備業務提示詞' },
      { title: '讀懂文檔', description: '找到接口與參數' },
      { title: '完成接入', description: '跑通安全呼叫' },
      { title: '擴展模態', description: '圖像、語音與影片' }
    ]" />
  </ClientOnly>
</div>

## 1. 先確定要接入的功能

上一章做出的電商內容工作台，已經有了商品資訊和“生成文案”按鈕，只是結果還來自模擬數據。現在我們先讓這個按鈕真正工作起來。

這個功能的過程很簡單：使用者填寫商品名稱、材質和賣點，點擊按鈕，頁面回傳一段商品文案。輸入和結果都是文字，因此我們要找的是一個能夠生成文本的模型。

如果頁面上的功能不同，需要的能力也會跟著變化。例如：

- 上傳商品照片，讓系統識別顏色和款式，需要用到圖片理解；
- 根據商品資料製作海報，需要用到圖片生成；
- 把一段錄音整理成會議紀要，要先把語音轉成文字，再讓文本模型進行整理；
- 把文章做成可以播放的音頻，需要用到文字轉語音；
- 讓一張商品圖動起來，則需要圖片生成影片的能力。

所以，接入前可以先看一遍頁面：使用者會提交什麼，最後希望在頁面上看到什麼。把這兩件事說清楚，通常就能判斷該去找文本、圖片、語音還是影片模型。

<AiCapabilityGuide />

### 1.1 一個功能有時需要分成幾步

並不是每個功能都能交給一個模型一次完成。比如“上傳商品照片並生成賣點”，要先讀懂照片中的商品，再根據識別結果寫文案；“根據公司資料回答問題”，也要先從文檔中找到相關內容，再組織答案。

拆解時不用從模型名稱出發，只要順著使用者的操作往下看：哪一步是在理解現有內容，哪一步是在生成新內容，哪一步只是查找資料。需要時，可以把兩三種能力依次接起來。

AI 只負責其中適合它的部分。登錄、支付、保存檔案和頁面跳轉都有明確規則，仍然使用普通程序來完成。

![商品圖片經過圖片理解後生成商品描述的實際頁面](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-35-41.webp)

*在這個原型中，使用者先上傳商品圖片，頁面識別出商品資訊，再生成可以繼續編輯的描述和賣點。*

### 1.2 打開服務台以後要找什麼

確定要做文本生成以後，我們就可以打開 DeepSeek、SiliconFlow、火山方舟或 MiniMax 等服務平台。平台負責賬號、計費和呼叫入口，真正處理這次請求的是我們選擇的模型。

第一次接入不用看完服務台里的所有菜單，先找到下面幾項即可：

1. 創建一個用於呼叫接口的 **API Key**；
2. 記下準備使用的 **Model ID**；
3. 在官方文檔中找到一段最小的 curl 或 JavaScript 示例；
4. 看清接口的額度、價格和呼叫限制。

應用通過 **API** 把商品資料發給模型。文檔如果提供了 JavaScript 或 Python 的 **SDK**，也可以直接使用，它只是把請求代碼封裝得更方便。請求中那段“請根據商品資訊生成標題和賣點”的文字，就是交給模型的提示詞。

服務平台的名稱、模型 ID 和 API 地址不是一回事。填寫代碼時，以官方示例中的地址和 Model ID 為準，不要把在線體驗頁面的網址複製進去。

### 1.3 暫時看不懂的接口可以先放一放

服務台中還可能出現 Embedding、Rerank、Function Calling、OCR 和內容審核等接口。做知識庫時會用到 Embedding 和 Rerank；讀取 PDF 或票據時會用到 OCR；讓模型呼叫搜索、數據庫等外部工具時，會用到 Function Calling。

這一階段不需要一次學完。我們先接通一個和頁面功能直接相關的 API，等產品需要新的能力時，再回來查對應的接口。

## 2. 先把生成結果試出來

在寫接口代碼之前，可以先到服務平台的在線體驗頁面試一試。我們要確認的不是模型“會不會寫文案”，而是它能不能按照頁面需要的格式回傳結果。

### 2.1 使用者只需要說清楚想要什麼

在在線體驗頁面中，可以先像真實使用者一樣輸入：

```text
我想上架一款輕量通勤雙肩包，黑色尼龍材質，
主要給日常通勤的人使用。
請幫我寫一個簡短的商品標題，再寫三條賣點。
```

真正做成頁面以後，使用者可能連這段話也不用自己組織。他只需填寫商品名稱、材質和顏色，再點擊“生成文案”。程序會讀取這些字段，並在請求中補上固定要求：不要編造價格和銷量、標題不要太長、結果按照指定格式回傳。

這些規則不應該交給每位使用者重復填寫。比如，頁面需要分別顯示標題、簡介和賣點時，可以由程序要求模型回傳 `title`、`summary` 和 `selling_points` 三個 JSON 字段。這樣使用者輸入仍然自然，頁面也能穩定讀取結果。

第一次測試時，可以換幾組商品資料，再故意少填一個字段，看看模型會不會擅自補充資訊。如果回傳格式不穩定，再去調整程序附加的固定要求，而不是讓使用者學習怎樣寫提示詞。

### 2.2 把 API 接到頁面里

官方文檔通常會給出一段 curl、JavaScript 或 Python 示例。我們可以把這段示例連同要實現的功能一起交給 AI IDE，讓它幫我們接到現有頁面中。

```text
我想給商品詳情頁加一個“生成文案”按鈕。

使用者點擊以後，把當前商品的資訊發給下面這個 API，
再把生成的文案顯示在頁面上。

API Key 不要放在前端。等待和失敗時，也請在頁面上給出提示。
做好後告訴我需要配置什麼，以及怎樣啓動和測試。

這是官方提供的 API 示例：
<粘貼不包含真實密鑰的 curl 或 SDK 示例>
```

有了頁面位置和官方示例，AI IDE 就不必自己猜接口格式。先確認一次請求能夠正常回傳；以後接入圖片、語音或影片時，換掉功能描述和官方示例就可以了。

## 3. 跟著官方示例發出第一次請求

提示詞試好以後，下一步是讓它從代碼中發出去。打開官方文檔，先找 Quick Start 或 API Reference。不同平台的文檔雖然長得不一樣，但第一次呼叫只需要看清四件事：請求發到哪個地址、API Key 放在哪裡、`model` 填什麼，以及官方的最小示例怎樣寫。

先複製官方提供的 curl、JavaScript 或 Python 示例，只替換模型 ID 和測試內容。能在終端中得到一次正常響應以後，再把代碼放進項目。這樣如果接入頁面後報錯，我們至少知道賬號、Key 和模型本身是可用的。

還要看一眼回傳結果。文本通常藏在某個 JSON 字段裡，圖片可能回傳 URL，語音可能直接回傳二進制內容，影片則常常先回傳一個任務編號。頁面後面怎樣寫，取決於接口實際回傳了什麼。

### 3.1 讓 AI 幫你讀長文檔

官方文檔太長時，不用從頭到尾讀完。把正在看的文檔鏈接交給 AI IDE，讓它先幫你找到第一次呼叫需要的內容：

```text
幫我看一下這個 API 文檔：<文檔鏈接>

我想用 JavaScript 呼叫它。請告訴我最簡單的寫法、
API Key 和 model 填在哪裡，以及怎樣拿到生成結果。
只使用文檔里寫明的參數。
```

## 4. 第一次打開服務台

創建 Key、選擇模型和查看用量，通常都在服務台中完成。各家的菜單名稱會有差別，但要做的事情大致相同。

### 4.1 創建 Key，並確認請求有沒有到達平台

API Key 是應用呼叫模型時使用的憑證。創建以後，把它放進本地環境變量，不要貼進截圖、聊天記錄或前端代碼。如果懷疑已經洩露，應立即到服務台撤銷並重新創建。

發出第一次請求後，可以打開 Usage 或 Billing 頁面看看是否出現了新的呼叫記錄。這裡還會顯示餘額和 Quota（額度）。遇到請求失敗時，先確認是代碼沒有發出去、平台拒絕了請求，還是賬號已經沒有可用額度。

![DeepSeek 用量頁面，包含餘額、月度支出和呼叫趨勢](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-13-57-41.webp)

*DeepSeek 的 Usage 頁面會顯示呼叫量、消耗和餘額。*

如果錯誤資訊中帶有 Request ID 或 Trace ID，也把它記下來。同一時間可能有很多請求，這個編號可以幫助我們在日誌里找到剛才失敗的那一次。

### 4.2 選擇模型，並複製準確的呼叫名稱

模型廣場或 Models 頁面用來查看平台當前提供哪些文本、圖片、語音和影片模型。點進詳情頁以後，注意複製代碼中使用的 Model ID；它可能和頁面上顯示的中文名稱不同。

![SiliconFlow 模型廣場，左側按文本、圖像、影片和語音區分能力](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-05-04.webp)

*SiliconFlow 的模型廣場可以按文本、圖像、影片和語音篩選模型。*

有些平台還要求先選擇 Region（區域），或者創建一個 Deployment（推理服務），然後才會給出 Base URL 和 Endpoint。遇到這種情況，直接跟著平台的快速接入嚮導完成，不要把控制台頁面的網址當成 API 地址。

![火山方舟快速 API 接入頁面，展示 API Key 與快速測試步驟](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-13-01.webp)

*火山方舟的快速接入頁面把創建 Key、選擇模型和執行示例放在了一起。*

### 4.3 用量限制和長任務

文本接口通常會標出 RPM 和 TPM，分別表示每分鐘允許的請求數和 Token 數；圖片、語音和影片還可能限制 Concurrency（同時生成的任務數）。超過限制時，接口通常會回傳 `429`，這時應該稍後重試，而不是不斷重復點擊。

影片等耗時較長的任務不會馬上回傳檔案，而是先給出一個 Task ID。程序可以使用它查詢進度，也可以提供 Callback 或 Webhook，讓平台在完成後主動通知。最後拿到的 File ID 或臨時下載地址可能會過期，準備正式上線時需要考慮是否把檔案保存到自己的存儲中。

文檔里還會出現 `max_tokens`、`temperature`、`stream` 等參數。第一版先沿用官方示例：只有輸出被截斷時再調整 `max_tokens`，需要邊生成邊顯示時再打開 `stream`。不確定某個參數的作用時，查對應模型的文檔，不必一次全部修改。

## 5. 從官方示例接到頁面

終端中的最小示例能夠回傳結果以後，再把它接進原型。可以按下面的順序來做：

1. 把 Key 寫進 `.env.local` 等不會提交到 Git 的環境檔案；
2. 在伺服器端或 Serverless Function 中呼叫模型；
3. 讓頁面呼叫自己的 `/api/...` 接口，而不是直接攜帶第三方 Key；
4. 給按鈕補上等待、成功和失敗狀態；
5. 回到 Usage 頁面，確認這次操作產生了真實呼叫。

```text
瀏覽器頁面
    │ 只發送業務輸入
    ▼
自己的 /api 接口 ── 讀取伺服器端環境變量中的 API Key
    │
    ▼
AI 服務平台 ── 回傳文字、JSON、檔案或 task_id
```

::: warning API Key 安全
不要把 API Key 寫進 Vue、React 或普通 HTML 的前端代碼。即使變量名稱帶有 `VITE_`、`NEXT_PUBLIC_`，它仍可能被打包進瀏覽器。準備公開部署時，應由後端、Serverless Function 或受保護的網關呼叫模型。
:::

### 5.1 有些接口不會馬上回傳結果

短文本、圖片理解和短音頻識別通常會在一次請求中直接回傳結果，頁面顯示“生成中”即可。對話或實時語音可能採用流式回傳，內容會一段一段到達，頁面可以邊接收邊展示。

圖片和影片生成則常常是異步任務：第一次請求只得到 `task_id`，隨後還要查詢任務是排隊中、生成中、成功還是失敗。這類功能可能要等待幾十秒，頁面不能一直停在一個沒有變化的“加載中”。

## 6. 先接通文本生成

[DeepSeek API 文檔](https://api-docs.deepseek.com/zh-cn/)提供兼容常見 SDK 的文本接口。模型會持續更新，接入前應從[模型列表](https://api-docs.deepseek.com/api/list-models)複製當前 ID。

下面先用 curl 發出一次請求。它使用的商品資料和前面在線體驗中的內容相同，這樣更容易比較兩邊的結果。

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "請回傳 JSON，字段為 title、summary 和 selling_points。selling_points 包含三條內容，不要編造價格、銷量或功效。"},
      {"role": "user", "content": "我想上架一款黑色尼龍通勤雙肩包。請幫我寫一個簡短標題、一段介紹和三條賣點。"}
    ],
    "stream": false
  }'
```

先把環境變量中的 Key 配好，再在終端執行這段命令。得到正常結果後，把同一段官方示例和第二節中的接入提示詞交給 AI IDE。第一版只保留一個按鈕和一組固定的商品資料，確認能從頁面得到結果以後，再接入完整表單。

### 先用兩組商品資料試一試

換一組商品名稱、材質和顏色，再點擊一次生成。如果兩次結果都對應各自的輸入，並且能被頁面正確顯示，說明最小接入已經跑通。接著可以刪掉一個字段，檢查模型是否會編造價格、功效或銷量；也可以暫時填錯 Key，看看頁面有沒有給出失敗提示。

最後到 Usage 頁面確認出現了這幾次呼叫。頁面顯示了文字，並不一定代表它真的來自 API；原型中殘留的模擬數據也可能產生相似效果。

## 7. 圖片理解：以 Qwen3-VL 為例

視覺模型接收一張圖片和一個問題。頁面需要什麼資訊，就直接問什麼；如果只問“這張圖里有什麼”，得到的往往是一段很寬泛的描述。

```text
幫我看看這張商品圖。告訴我它是什麼、主要是什麼顏色，
還能看出哪些材質和結構。圖里有文字也請抄出來。

看不清的地方直接說看不清，不要猜品牌、價格或銷量。
請用 JSON 回傳，方便我把結果顯示在頁面上。
```

在 [SiliconFlow 模型廣場](https://cloud.siliconflow.cn/models)中可以篩選當前可用的視覺模型。本節以 `Qwen/Qwen3-VL-8B-Instruct` 說明輸入結構；執行前仍要確認當前 Model ID。

```python
import base64
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SILICONFLOW_API_KEY"],
    base_url="https://api.siliconflow.cn/v1"
)

with open("product.jpg", "rb") as image_file:
    image_data = base64.b64encode(image_file.read()).decode("utf-8")

response = client.chat.completions.create(
    model="Qwen/Qwen3-VL-8B-Instruct",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "幫我看看這張商品圖。告訴我商品類別、顏色、看得出的材質和結構，以及圖片里的文字。看不清的地方不要猜，請用 JSON 回傳。"},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![在 AI IDE 中接入圖片理解接口](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-15-34-36.webp)

*先讓使用者確認模型識別出的商品資訊，再生成文案，通常比直接從圖片生成最終文案更容易發現錯誤。*

## 8. 生成和修改商品圖片

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite)可以根據文字生成圖片，也可以在參考圖的基礎上進行修改。商品圖片最怕“看起來很好，但商品本身變了”，因此除了描述背景、構圖和光線，還要明確哪些地方不能改變。

```text
把參考圖里的黑色雙肩包做成一張竪版商品海報。
背包放在淺灰色台面中央，光線柔和，上方留一點放標題的位置。
不要添加文字、Logo 或價格，也不要改變拉鍊、肩帶和口袋。
```

這段描述交代了圖片用途、商品位置、畫面風格和需要保留的結構。第一次生成後，先檢查背包本身有沒有變形，再看背景和構圖是否合適。不要一開始就在提示詞里堆很多風格詞。

從[火山方舟控制台](https://www.volcengine.com/experience/ark?launch=seedream)複製當前圖像模型 ID 和最小請求。不要長期照抄教程中的版本號。

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<從控制台複製當前圖像模型 ID>",
    "prompt": "把參考圖里的黑色雙肩包做成一張簡潔的竪版商品海報。不要添加文字、Logo 或價格，也不要改變背包的結構。",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![圖片生成能力接入產品後的效果](../../../zh-cn/stage-1/integrating-ai-capabilities/images/index-2026-01-20-23-21-13.webp)

圖片 URL 往往有有效期。原型可以直接展示，準備上線時要根據服務條款決定是否轉存，並記錄提示詞、模型版本和生成時間。

## 9. 語音能力：識別與合成是兩條接口

“接入語音”至少包含兩個方向：

- **ASR / STT**：把使用者說的話或音頻檔案變成文字；
- **TTS**：把文本變成可以播放的語音。

它們的輸入、輸出和頁面交互不同，不要放進一個模糊的“語音 API”按鈕中。

### 9.1 語音轉文字：上傳音頻並回傳文本

[SiliconFlow 語音轉文字文檔](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions)使用 `multipart/form-data` 上傳檔案。它與前面的 JSON 請求不同。

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

把官方示例交給 AI IDE 時，可以這樣說明頁面功能：

```text
幫我給當前頁面加一個“上傳錄音並轉寫”按鈕。

使用者上傳 mp3、m4a 或 wav 檔案後，用伺服器端呼叫下面的接口，
再把回傳的文字放進一個可以編輯的文本框。
API Key 放在環境變量中，上傳或識別失敗時可以重新嘗試。

這是官方示例：
<粘貼上面的 curl 示例>
```

### 9.2 文字轉語音：回傳的是音頻，不一定是 JSON

[MiniMax T2A HTTP 文檔](https://platform.minimax.io/docs/api-reference/speech-t2a-http)提供同步語音合成接口。當前文檔示例使用 `speech-2.8-hd`，實際模型和音色應以平台頁面為準。

語音合成的“提示詞”主要體現在朗讀腳本和聲音參數中。先把數字、英文縮寫和停頓改成適合朗讀的文本，再選擇音色、語速、音量、情緒和輸出格式。不要直接把頁面上的 Markdown、URL 和按鈕文字整段送去朗讀。

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "這是一段商品介紹的試聽內容。",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<從音色列表複製 voice_id>",
      "speed": 1,
      "vol": 1,
      "pitch": 0
    },
    "audio_setting": {
      "sample_rate": 32000,
      "bitrate": 128000,
      "format": "mp3",
      "channel": 1
    }
  }'
```

語音頁面通常還要提供試聽、停止、重新生成和下載。流式 TTS 則需要 WebSocket 或流式 HTTP，並在音頻到達時逐段播放。

::: warning 聲音與隱私
上傳錄音前要告訴使用者用途、保存時間和刪除方式。聲音克隆必須獲得音色擁有者的明確授權，不要使用來源不明的公眾人物或他人錄音。
:::

## 10. 影片生成：先創建任務，再等待結果

影片生成通常是異步接口。[MiniMax 影片生成文檔](https://platform.minimax.io/docs/guides/video-generation)把流程分成三步：創建任務得到 `task_id`、查詢狀態得到 `file_id`、最後獲取下載地址。

### 10.1 還要說明畫面怎樣變化

圖片只描述一個畫面，影片還要說明接下來幾秒發生什麼。寫提示詞時，可以把商品的初始位置、運動順序、鏡頭方向和時長說清楚：

```text
讓這只黑色雙肩包在淺灰色展台上展示 6 秒。
鏡頭從正面慢慢繞到右側，再稍微拉近，畫面保持竪屏。
不要改變背包的樣子，也不要添加人物、文字或 Logo。
```

如果動作很多，先保留一個鏡頭和一個主要動作。短影片里同時要求旋轉、開合、變焦和切換場景，往往更難保持商品外觀一致。

### 10.2 創建與查詢是兩個請求

```bash
# 第一步：創建任務
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "讓這只黑色雙肩包在淺灰色展台上展示。鏡頭從正面慢慢繞到右側，再稍微拉近。不要改變背包的樣子，也不要添加人物、文字或 Logo。",
    "duration": 6,
    "resolution": "1080P"
  }'

# 第二步：使用上一步回傳的 task_id 查詢狀態
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

頁面至少需要顯示：`Preparing`、`Queueing`、`Processing`、`Success` 和 `Fail`。輪詢要設置間隔和停止條件；正式產品可以使用文檔提供的 `callback_url`，由平台在任務狀態變化時通知你的伺服器端。

::: warning 影片與真人素材
使用真人照片、聲音、商標或版權素材生成影片時，要確認授權範圍和平台規則。有些服務還要求人臉驗證、素材資產登記或內容審核，這不是可以從前端繞過的技術步驟。
:::

## 11. 常見問題怎樣判斷

| 現象 | 優先檢查 |
| --- | --- |
| `401 / 403` | Key 是否正確、是否有權限、是否放錯請求頭 |
| `404` | Base URL、Endpoint 或 Model ID 是否已經變化 |
| `429` | RPM、TPM、併發或賬號用量等級 |
| `400` | 必填參數、檔案格式、JSON 結構和尺寸限制 |
| `5xx / timeout` | 平台狀態、超時設置和重試策略 |
| 一直排隊 | 併發、任務狀態查詢、額度和服務繁忙情況 |
| 頁面成功但沒有內容 | 響應字段路徑、二進制處理、臨時 URL 是否過期 |
| 本地能用，上線失敗 | 環境變量、跨域、Serverless 超時和區域網絡 |

調試時保存四樣東西：發生時間、請求類型、HTTP 狀態碼、Request ID/Trace ID。不要把 API Key、完整使用者音頻或敏感業務數據寫進日誌。

## 12. 📚 本章作業

<StageAssignmentCard title="為你的原型接入一種 AI 能力">

  <p>從頁面里選一個真正需要 AI 的按鈕。第一版只接一種能力，不必把文本、圖片、語音和影片全部做完。</p>

  <ol>
    <li>在官方文檔中找到當前 Model ID 和最小示例。</li>
    <li>把示例交給 AI IDE，接到頁面中的按鈕上。</li>
    <li>把 API Key 放在伺服器端環境變量中，並為等待和失敗加上提示。</li>
    <li>實際呼叫一次，再到 Usage 或日誌中確認請求已經到達平台。</li>
  </ol>

  <p>完成後，保存一張執行截圖，並用一句話說明 AI 在這個頁面里幫使用者做了什麼。使用別人的圖片、聲音或真人素材時，先確認可以使用。</p>
</StageAssignmentCard>

## 下一步

下一章會把這些能力放回完整產品流程：補充數據、狀態和使用者反饋，讓單次 API 呼叫變成可以連續使用的產品原型。

<RelatedArticlesSection
  title="相關文章"
  description="從單點 AI 能力繼續走向完整產品流程。"
  :items="relatedArticles"
/>

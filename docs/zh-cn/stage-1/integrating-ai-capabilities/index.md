---
title: '为原型接入 AI 能力'
description: '从提示词设计、官方文档阅读和服务台配置开始，为 Web 原型接入文本、视觉、图像、语音与视频能力。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'
import AiCapabilityGuide from './AiCapabilityGuide.vue'

const duration = '约 <strong>1～2 天</strong>'
const relatedArticles =
  relatedArticlesMap['zh-cn/stage-1/integrating-ai-capabilities'] ?? []
</script>

# 为原型接入 AI 能力

<ProductJourney current="ai" />

## 章节导读

<ChapterIntroduction :duration="duration" :tags="['提示词', 'API 文档', '服务台', '多模态']" coreOutput="为原型接入 1～2 种真实 AI 能力" expectedOutput="能够调用文本、图像、语音或视频服务的 Web 原型">

上一章完成的原型已经可以验证页面结构和操作流程，但生成结果仍然来自模拟数据。本章将把其中一个核心动作接到真实的 AI 服务上。

接入 AI 不只是“复制一段 API 代码”。我们要同时处理三件事：**怎样描述任务、怎样读懂官方文档、怎样把调用安全地放进产品流程。**

本章先建立一套通用方法，再分别看文本、图片理解、图片生成、语音和视频。模型名称和控制台界面会持续更新，因此示例用于说明结构；实际接入时，应从对应服务的当前文档中复制模型 ID 和参数。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: '写清任务', description: '准备业务提示词' },
      { title: '读懂文档', description: '找到接口与参数' },
      { title: '完成接入', description: '跑通安全调用' },
      { title: '扩展模态', description: '图像、语音与视频' }
    ]" />
  </ClientOnly>
</div>

## 1. 先确定要接入的功能

上一章做出的电商内容工作台，已经有了商品信息和“生成文案”按钮，只是结果还来自模拟数据。现在我们先让这个按钮真正工作起来。

这个功能的过程很简单：用户填写商品名称、材质和卖点，点击按钮，页面返回一段商品文案。输入和结果都是文字，因此我们要找的是一个能够生成文本的模型。

如果页面上的功能不同，需要的能力也会跟着变化。例如：

- 上传商品照片，让系统识别颜色和款式，需要用到图片理解；
- 根据商品资料制作海报，需要用到图片生成；
- 把一段录音整理成会议纪要，要先把语音转成文字，再让文本模型进行整理；
- 把文章做成可以播放的音频，需要用到文字转语音；
- 让一张商品图动起来，则需要图片生成视频的能力。

所以，接入前可以先看一遍页面：用户会提交什么，最后希望在页面上看到什么。把这两件事说清楚，通常就能判断该去找文本、图片、语音还是视频模型。

<AiCapabilityGuide />

### 1.1 一个功能有时需要分成几步

并不是每个功能都能交给一个模型一次完成。比如“上传商品照片并生成卖点”，要先读懂照片中的商品，再根据识别结果写文案；“根据公司资料回答问题”，也要先从文档中找到相关内容，再组织答案。

拆解时不用从模型名称出发，只要顺着用户的操作往下看：哪一步是在理解现有内容，哪一步是在生成新内容，哪一步只是查找资料。需要时，可以把两三种能力依次接起来。

AI 只负责其中适合它的部分。登录、支付、保存文件和页面跳转都有明确规则，仍然使用普通程序来完成。

![商品图片经过图片理解后生成商品描述的实际页面](images/index-2026-01-20-15-35-41.png)

*在这个原型中，用户先上传商品图片，页面识别出商品信息，再生成可以继续编辑的描述和卖点。*

### 1.2 打开服务台以后要找什么

确定要做文本生成以后，我们就可以打开 DeepSeek、SiliconFlow、火山方舟或 MiniMax 等服务平台。平台负责账号、计费和调用入口，真正处理这次请求的是我们选择的模型。

第一次接入不用看完服务台里的所有菜单，先找到下面几项即可：

1. 创建一个用于调用接口的 **API Key**；
2. 记下准备使用的 **Model ID**；
3. 在官方文档中找到一段最小的 curl 或 JavaScript 示例；
4. 看清接口的额度、价格和调用限制。

应用通过 **API** 把商品资料发给模型。文档如果提供了 JavaScript 或 Python 的 **SDK**，也可以直接使用，它只是把请求代码封装得更方便。请求中那段“请根据商品信息生成标题和卖点”的文字，就是交给模型的提示词。

服务平台的名称、模型 ID 和 API 地址不是一回事。填写代码时，以官方示例中的地址和 Model ID 为准，不要把在线体验页面的网址复制进去。

### 1.3 暂时看不懂的接口可以先放一放

服务台中还可能出现 Embedding、Rerank、Function Calling、OCR 和内容审核等接口。做知识库时会用到 Embedding 和 Rerank；读取 PDF 或票据时会用到 OCR；让模型调用搜索、数据库等外部工具时，会用到 Function Calling。

这一阶段不需要一次学完。我们先接通一个和页面功能直接相关的 API，等产品需要新的能力时，再回来查对应的接口。

## 2. 先把生成结果试出来

在写接口代码之前，可以先到服务平台的在线体验页面试一试。我们要确认的不是模型“会不会写文案”，而是它能不能按照页面需要的格式返回结果。

### 2.1 写一条方便程序使用的提示词

仍以商品文案为例，可以先从下面这段开始：

```text
请根据下面的商品资料，生成一版商品介绍。

商品名称：轻量通勤双肩包
类目：箱包
材质：尼龙
颜色：黑色
目标用户：日常通勤人群

只使用资料中已经提供的信息，不要补写功效、销量和折扣。
标题不超过 24 个汉字。
请返回 JSON，字段为 title、summary 和 selling_points，
其中 selling_points 包含 3 条内容。
```

这里要求返回 JSON，是因为页面可以直接读取 `title`、`summary` 和 `selling_points`，不用再从一大段文字中猜哪一句是标题、哪一句是卖点。

第一次测试时，可以换几组商品资料，再故意删掉材质或目标用户，看看模型会不会擅自补充信息。如果输出时而是 JSON、时而又变成普通文字，就要继续调整提示词，直到格式基本稳定。

### 2.2 把 API 接到页面里

官方文档通常会给出一段 curl、JavaScript 或 Python 示例。我们可以把这段示例连同要实现的功能一起交给 AI IDE，让它帮我们接到现有页面中。

```text
我想给商品详情页加一个“生成文案”按钮。

用户点击按钮后，把当前商品的信息发给下面这个 API，
再把生成的文案显示在页面上。

接入时请注意：
- API Key 放在环境变量中，不要写进前端代码；
- 请求期间显示“生成中”，请求失败时给出提示；
- 完成后告诉我需要配置什么，以及怎样启动和测试。

这是官方提供的 API 示例：
<粘贴不包含真实密钥的 curl 或 SDK 示例>
```

有了页面位置和官方示例，AI IDE 就不必自己猜接口格式。先确认一次请求能够正常返回；以后接入图片、语音或视频时，换掉功能描述和官方示例就可以了。

## 3. 跟着官方示例发出第一次请求

提示词试好以后，下一步是让它从代码中发出去。打开官方文档，先找 Quick Start 或 API Reference。不同平台的文档虽然长得不一样，但第一次调用只需要看清四件事：请求发到哪个地址、API Key 放在哪里、`model` 填什么，以及官方的最小示例怎样写。

先复制官方提供的 curl、JavaScript 或 Python 示例，只替换模型 ID 和测试内容。能在终端中得到一次正常响应以后，再把代码放进项目。这样如果接入页面后报错，我们至少知道账号、Key 和模型本身是可用的。

还要看一眼返回结果。文本通常藏在某个 JSON 字段里，图片可能返回 URL，语音可能直接返回二进制内容，视频则常常先返回一个任务编号。页面后面怎样写，取决于接口实际返回了什么。

### 3.1 让 AI 帮你读长文档

许多文档站提供 `llms.txt` 或 `llms-full.txt`。例如 [SiliconFlow 的文档使用说明](https://docs.siliconflow.cn/cn/userguide/use-docs-with-cursor)就介绍了怎样把文档索引交给编程工具。

如果文档没有这类入口，也可以把正在阅读的页面交给 AI IDE：

```text
这是我要使用的官方 API 文档：<文档链接>

请根据这个页面，找到 JavaScript 的最小调用示例，
并告诉我 API Key 放在哪里、model 应该填什么，
以及生成结果在返回数据的哪个字段中。

不要根据记忆补充文档里没有的参数。
```

## 4. 第一次打开服务台

创建 Key、选择模型和查看用量，通常都在服务台中完成。各家的菜单名称会有差别，但要做的事情大致相同。

### 4.1 创建 Key，并确认请求有没有到达平台

API Key 是应用调用模型时使用的凭证。创建以后，把它放进本地环境变量，不要贴进截图、聊天记录或前端代码。如果怀疑已经泄露，应立即到服务台撤销并重新创建。

发出第一次请求后，可以打开 Usage 或 Billing 页面看看是否出现了新的调用记录。这里还会显示余额和 Quota（额度）。遇到请求失败时，先确认是代码没有发出去、平台拒绝了请求，还是账号已经没有可用额度。

![DeepSeek 用量页面，包含余额、月度支出和调用趋势](images/index-2026-01-20-13-57-41.png)

*DeepSeek 的 Usage 页面会显示调用量、消耗和余额。*

如果错误信息中带有 Request ID 或 Trace ID，也把它记下来。同一时间可能有很多请求，这个编号可以帮助我们在日志里找到刚才失败的那一次。

### 4.2 选择模型，并复制准确的调用名称

模型广场或 Models 页面用来查看平台当前提供哪些文本、图片、语音和视频模型。点进详情页以后，注意复制代码中使用的 Model ID；它可能和页面上显示的中文名称不同。

![SiliconFlow 模型广场，左侧按文本、图像、视频和语音区分能力](images/index-2026-01-20-15-05-04.png)

*SiliconFlow 的模型广场可以按文本、图像、视频和语音筛选模型。*

有些平台还要求先选择 Region（区域），或者创建一个 Deployment（推理服务），然后才会给出 Base URL 和 Endpoint。遇到这种情况，直接跟着平台的快速接入向导完成，不要把控制台页面的网址当成 API 地址。

![火山方舟快速 API 接入页面，展示 API Key 与快速测试步骤](images/index-2026-01-20-23-13-01.png)

*火山方舟的快速接入页面把创建 Key、选择模型和运行示例放在了一起。*

### 4.3 用量限制和长任务

文本接口通常会标出 RPM 和 TPM，分别表示每分钟允许的请求数和 Token 数；图片、语音和视频还可能限制 Concurrency（同时生成的任务数）。超过限制时，接口通常会返回 `429`，这时应该稍后重试，而不是不断重复点击。

视频等耗时较长的任务不会马上返回文件，而是先给出一个 Task ID。程序可以使用它查询进度，也可以提供 Callback 或 Webhook，让平台在完成后主动通知。最后拿到的 File ID 或临时下载地址可能会过期，准备正式上线时需要考虑是否把文件保存到自己的存储中。

文档里还会出现 `max_tokens`、`temperature`、`stream` 等参数。第一版先沿用官方示例：只有输出被截断时再调整 `max_tokens`，需要边生成边显示时再打开 `stream`。不确定某个参数的作用时，查对应模型的文档，不必一次全部修改。

## 5. 从官方示例接到页面

终端中的最小示例能够返回结果以后，再把它接进原型。可以按下面的顺序来做：

1. 把 Key 写进 `.env.local` 等不会提交到 Git 的环境文件；
2. 在服务端或 Serverless Function 中调用模型；
3. 让页面调用自己的 `/api/...` 接口，而不是直接携带第三方 Key；
4. 给按钮补上等待、成功和失败状态；
5. 回到 Usage 页面，确认这次操作产生了真实调用。

```text
浏览器页面
    │ 只发送业务输入
    ▼
自己的 /api 接口 ── 读取服务端环境变量中的 API Key
    │
    ▼
AI 服务平台 ── 返回文字、JSON、文件或 task_id
```

::: warning API Key 安全
不要把 API Key 写进 Vue、React 或普通 HTML 的前端代码。即使变量名称带有 `VITE_`、`NEXT_PUBLIC_`，它仍可能被打包进浏览器。准备公开部署时，应由后端、Serverless Function 或受保护的网关调用模型。
:::

### 5.1 有些接口不会马上返回结果

短文本、图片理解和短音频识别通常会在一次请求中直接返回结果，页面显示“生成中”即可。对话或实时语音可能采用流式返回，内容会一段一段到达，页面可以边接收边展示。

图片和视频生成则常常是异步任务：第一次请求只得到 `task_id`，随后还要查询任务是排队中、生成中、成功还是失败。这类功能可能要等待几十秒，页面不能一直停在一个没有变化的“加载中”。

## 6. 先接通文本生成

[DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/)提供兼容常见 SDK 的文本接口。模型会持续更新，接入前应从[模型列表](https://api-docs.deepseek.com/api/list-models)复制当前 ID。

下面先用 curl 发出一次请求。它使用的商品资料和前面在线体验中的内容相同，这样更容易比较两边的结果。

```bash
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
    "model": "deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "你是一名电商内容编辑，只输出合法 JSON。"},
      {"role": "user", "content": "商品：轻量通勤双肩包；材质：尼龙；颜色：黑色。生成 title、summary 和三个 selling_points。"}
    ],
    "stream": false
  }'
```

先把环境变量中的 Key 配好，再在终端运行这段命令。得到正常结果后，把同一段官方示例和第二节中的接入提示词交给 AI IDE。第一版只保留一个按钮和一组固定的商品资料，确认能从页面得到结果以后，再接入完整表单。

### 先用两组商品资料试一试

换一组商品名称、材质和颜色，再点击一次生成。如果两次结果都对应各自的输入，并且能被页面正确显示，说明最小接入已经跑通。接着可以删掉一个字段，检查模型是否会编造价格、功效或销量；也可以暂时填错 Key，看看页面有没有给出失败提示。

最后到 Usage 页面确认出现了这几次调用。页面显示了文字，并不一定代表它真的来自 API；原型中残留的模拟数据也可能产生相似效果。

## 7. 图片理解：以 Qwen3-VL 为例

视觉模型接收一张图片和一个问题。页面需要什么信息，就直接问什么；如果只问“这张图里有什么”，得到的往往是一段很宽泛的描述。

```text
请分析这张商品图片，为后续文案准备资料。

只描述图片中可以确认的内容：
1. 商品类别；
2. 主色与辅助色；
3. 可见材质和结构；
4. 图片中出现的文字；
5. 无法确认的信息放进 uncertain_fields。

输出固定 JSON，不推测品牌、价格、功效和销量。
```

在 [SiliconFlow 模型广场](https://cloud.siliconflow.cn/models)中可以筛选当前可用的视觉模型。本节以 `Qwen/Qwen3-VL-8B-Instruct` 说明输入结构；运行前仍要确认当前 Model ID。

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
            {"type": "text", "text": "请按本节要求分析商品图片，只输出 JSON。"},
            {"type": "image_url", "image_url": {
                "url": f"data:image/jpeg;base64,{image_data}"
            }}
        ]
    }]
)
```

![在 AI IDE 中接入图片理解接口](images/index-2026-01-20-15-34-36.png)

*先让用户确认模型识别出的商品信息，再生成文案，通常比直接从图片生成最终文案更容易发现错误。*

## 8. 生成和修改商品图片

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite)可以根据文字生成图片，也可以在参考图的基础上进行修改。商品图片最怕“看起来很好，但商品本身变了”，因此除了描述背景、构图和光线，还要明确哪些地方不能改变。

```text
基于参考图中的黑色通勤双肩包，生成一张 4:5 商品海报。
背包放在浅灰色台面中央，正面略向右转 15 度；柔和影棚光，背景保持简洁；
画面上方留出标题区域，不生成任何文字、Logo、价格或促销标签；
保持拉链、肩带和口袋结构与参考图一致。
```

这段描述交代了图片用途、商品位置、画面风格和需要保留的结构。第一次生成后，先检查背包本身有没有变形，再看背景和构图是否合适。不要一开始就在提示词里堆很多风格词。

从[火山方舟控制台](https://www.volcengine.com/experience/ark?launch=seedream)复制当前图像模型 ID 和最小请求。不要长期照抄教程中的版本号。

```bash
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<从控制台复制当前图像模型 ID>",
    "prompt": "基于参考图生成简洁的商品海报，不添加文字和 Logo",
    "image": ["https://example.com/product-reference.png"],
    "response_format": "url",
    "stream": false,
    "watermark": false
  }'
```

![图片生成能力接入产品后的效果](images/index-2026-01-20-23-21-13.png)

图片 URL 往往有有效期。原型可以直接展示，准备上线时要根据服务条款决定是否转存，并记录提示词、模型版本和生成时间。

## 9. 语音能力：识别与合成是两条接口

“接入语音”至少包含两个方向：

- **ASR / STT**：把用户说的话或音频文件变成文字；
- **TTS**：把文本变成可以播放的语音。

它们的输入、输出和页面交互不同，不要放进一个模糊的“语音 API”按钮中。

### 9.1 语音转文字：上传音频并返回文本

[SiliconFlow 语音转文字文档](https://docs.siliconflow.cn/cn/api-reference/audio/create-audio-transcriptions)使用 `multipart/form-data` 上传文件。它与前面的 JSON 请求不同。

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/audio/transcriptions \
  -H "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  -F "file=@meeting.mp3" \
  -F "model=FunAudioLLM/SenseVoiceSmall"
```

把官方示例交给 AI IDE 时，可以这样说明页面功能：

```text
我想给当前页面增加一个“上传录音并转写”的功能。

用户选择 mp3、m4a 或 wav 文件后，
由服务端调用下面的官方接口，
再把返回的 text 显示在一个可以编辑的文本框中。

上传和识别期间请显示进度，失败时允许重新上传。
API Key 仍然放在服务端环境变量中。

这是官方示例：
<粘贴上面的 curl 示例>
```

### 9.2 文字转语音：返回的是音频，不一定是 JSON

[MiniMax T2A HTTP 文档](https://platform.minimax.io/docs/api-reference/speech-t2a-http)提供同步语音合成接口。当前文档示例使用 `speech-2.8-hd`，实际模型和音色应以平台页面为准。

语音合成的“提示词”主要体现在朗读脚本和声音参数中。先把数字、英文缩写和停顿改成适合朗读的文本，再选择音色、语速、音量、情绪和输出格式。不要直接把页面上的 Markdown、URL 和按钮文字整段送去朗读。

```bash
curl --request POST \
  --url https://api.minimax.io/v1/t2a_v2 \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "speech-2.8-hd",
    "text": "这是一段商品介绍的试听内容。",
    "stream": false,
    "output_format": "hex",
    "language_boost": "auto",
    "voice_setting": {
      "voice_id": "<从音色列表复制 voice_id>",
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

语音页面通常还要提供试听、停止、重新生成和下载。流式 TTS 则需要 WebSocket 或流式 HTTP，并在音频到达时逐段播放。

::: warning 声音与隐私
上传录音前要告诉用户用途、保存时间和删除方式。声音克隆必须获得音色拥有者的明确授权，不要使用来源不明的公众人物或他人录音。
:::

## 10. 视频生成：先创建任务，再等待结果

视频生成通常是异步接口。[MiniMax 视频生成文档](https://platform.minimax.io/docs/guides/video-generation)把流程分成三步：创建任务得到 `task_id`、查询状态得到 `file_id`、最后获取下载地址。

### 10.1 还要说明画面怎样变化

图片只描述一个画面，视频还要说明接下来几秒发生什么。写提示词时，可以把商品的初始位置、运动顺序、镜头方向和时长说清楚：

```text
一只黑色通勤双肩包放在浅灰色展台中央。
镜头从正面缓慢向右环绕，随后轻微推进，展示拉链、肩带和侧袋；
柔和影棚光保持稳定，背景不变化；6 秒，竖屏；
保持背包结构与首帧一致，不添加人物、文字、Logo 或额外配件。
```

如果动作很多，先保留一个镜头和一个主要动作。短视频里同时要求旋转、开合、变焦和切换场景，往往更难保持商品外观一致。

### 10.2 创建与查询是两个请求

```bash
# 第一步：创建任务
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "MiniMax-Hailuo-2.3",
    "prompt": "一只黑色通勤双肩包放在展台中央，镜头缓慢环绕并推进",
    "duration": 6,
    "resolution": "1080P"
  }'

# 第二步：使用上一步返回的 task_id 查询状态
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=<TASK_ID>" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

页面至少需要显示：`Preparing`、`Queueing`、`Processing`、`Success` 和 `Fail`。轮询要设置间隔和停止条件；正式产品可以使用文档提供的 `callback_url`，由平台在任务状态变化时通知你的服务端。

::: warning 视频与真人素材
使用真人照片、声音、商标或版权素材生成视频时，要确认授权范围和平台规则。有些服务还要求人脸验证、素材资产登记或内容审核，这不是可以从前端绕过的技术步骤。
:::

## 11. 常见问题怎样判断

| 现象 | 优先检查 |
| --- | --- |
| `401 / 403` | Key 是否正确、是否有权限、是否放错请求头 |
| `404` | Base URL、Endpoint 或 Model ID 是否已经变化 |
| `429` | RPM、TPM、并发或账号用量等级 |
| `400` | 必填参数、文件格式、JSON 结构和尺寸限制 |
| `5xx / timeout` | 平台状态、超时设置和重试策略 |
| 一直排队 | 并发、任务状态查询、额度和服务繁忙情况 |
| 页面成功但没有内容 | 响应字段路径、二进制处理、临时 URL 是否过期 |
| 本地能用，上线失败 | 环境变量、跨域、Serverless 超时和区域网络 |

调试时保存四样东西：发生时间、请求类型、HTTP 状态码、Request ID/Trace ID。不要把 API Key、完整用户音频或敏感业务数据写进日志。

## 12. 作业：为你的原型选择一种主能力

第一版不需要同时接入五种模态。根据用户的核心任务，选择一种主能力，再选一种真正有帮助的辅助能力。

例如：

- 商品内容工具：图片理解 + 文本生成；
- 有声文章工具：文本生成 + 语音合成；
- 会议整理工具：语音识别 + 文本摘要；
- 商品短片工具：图片生成/编辑 + 视频生成。

提交前检查：

- [ ] 提示词包含明确输入、输出和限制；
- [ ] 使用当前官方 Model ID 和最小示例；
- [ ] API Key 只存在服务端环境变量；
- [ ] 页面显示等待、成功和失败状态；
- [ ] 能从 Usage 或日志确认真实请求；
- [ ] 文件、声音和真人素材已确认使用权限；
- [ ] 记录了下一步最需要验证的用户反馈。

## 下一步

下一章会把这些能力放回完整产品流程：补充数据、状态和用户反馈，让单次 API 调用变成可以连续使用的产品原型。

<RelatedArticlesSection
  title="相关文章"
  description="从单点 AI 能力继续走向完整产品流程。"
  :items="relatedArticles"
/>

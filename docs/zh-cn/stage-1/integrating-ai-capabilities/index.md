---
title: '为原型接入 AI 能力'
description: '从提示词设计、官方文档阅读和服务台配置开始，为 Web 原型接入文本、视觉、图像、语音与视频能力。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

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

## 1. 先分清：平台、模型、API 和提示词

第一次打开 AI 服务台时，常会同时看到模型、应用、密钥、额度和在线体验等入口。可以先这样理解：

| 名称 | 它解决什么问题 | 例子 |
| --- | --- | --- |
| **服务平台** | 提供账号、计费、模型和调用入口 | DeepSeek 开放平台、SiliconFlow、火山方舟、MiniMax 开放平台 |
| **模型** | 真正处理输入并产生结果 | 文本模型、视觉语言模型、语音模型、视频模型 |
| **API** | 应用与模型服务通信的方式 | `/chat/completions`、`/audio/transcriptions` |
| **SDK** | 用某种编程语言封装 API | JavaScript SDK、Python SDK |
| **提示词** | 告诉模型这次要完成什么任务 | “根据商品信息生成 JSON 格式的标题和卖点” |

同一个平台可以提供许多模型，同一个模型也可能被不同平台托管。**平台名称不等于模型名称，在线体验地址也不一定等于 API 地址。**

### 1.1 常见 AI 能力与产品输入

| 能力 | 输入 | 输出 | 常见产品场景 |
| --- | --- | --- | --- |
| 文本生成 | 文字、结构化数据 | 文字、JSON | 文案、摘要、分类、问答 |
| 图片理解 | 图片 + 问题 | 描述、标签、JSON | 商品识别、票据提取、截图分析 |
| 图片生成/编辑 | 提示词、参考图 | 图片 URL 或二进制文件 | 海报、主图、背景替换 |
| 语音转文字（ASR） | 音频文件或音频流 | 文字、时间戳 | 会议转写、语音输入、字幕 |
| 文字转语音（TTS） | 文字、音色和语速 | MP3、WAV 或音频流 | 有声内容、播报、语音助手 |
| 视频生成 | 提示词、首帧或参考素材 | 视频文件 | 商品短片、动态演示、创意分镜 |

选择能力时，先问“用户给产品什么，产品应该返回什么”，再选择模型。不要因为某个模型热门，就反过来寻找使用场景。

### 1.2 从想做的功能倒推 AI 能力

先把功能写成一句简单的话：

> 用户提供什么，产品帮他完成什么，最后得到什么。

例如，“用户上传一张商品照片，产品帮他识别商品并生成卖点”。这里其实有两步：先用图片理解读懂照片，再用文本模型整理卖点。类似地：

- 上传会议录音，得到会议纪要：**语音转文字 + 文本总结**；
- 输入一篇文章，得到可以播放的音频：**文字转语音**；
- 上传商品图，得到一段展示视频：**图片生成或编辑 + 视频生成**；
- 根据公司资料回答问题：**文档解析 + 检索 + 文本生成**。

判断时可以依次看三件事：输入是什么，结果是什么，中间需要 AI 去**理解、生成、转换，还是查找资料**。一个功能可能只需要一种能力，也可能需要把两三种能力接起来。

AI 通常只负责流程中不容易写成固定规则的部分。登录、支付、文件存储和页面跳转等确定性工作，仍然应交给普通程序完成。

### 1.3 还会遇到的接口

| 接口 | 主要用途 | 这一阶段怎样理解 |
| --- | --- | --- |
| **Embedding** | 把文字或图片变成向量 | 用于相似度搜索和知识库检索 |
| **Rerank** | 给检索结果重新排序 | 从候选资料中挑出更相关的内容 |
| **Tool / Function Calling** | 让模型选择并填写工具参数 | 模型决定“调用什么”，真正操作仍由程序执行 |
| **OCR / 文档解析** | 提取图片、PDF 和表格中的内容 | 先得到结构化资料，再交给文本模型处理 |
| **Moderation / 内容审核** | 判断输入或输出是否违反规则 | 不能只靠提示词代替平台安全策略 |

这些能力会在知识库、Agent 和更完整的后端项目中继续使用。本章先把一次多模态 API 调用走通。

## 2. 两种提示词：给模型的，和给 AI IDE 的

这一章会使用两种提示词，它们的目标不同。

### 2.1 业务提示词：让模型完成一次任务

一条容易测试的提示词通常包含下面六部分：

```text
角色：你在这次任务中负责什么
任务：要完成的具体动作
输入：用户会提供哪些数据
判断标准：哪些信息可以使用，哪些不能猜
输出：返回文字、Markdown，还是固定 JSON
约束：长度、语言、语气、安全与失败处理
```

以商品文案为例：

```text
你是一名电商内容编辑。

任务：根据商品资料生成一版商品介绍。
输入：商品名称、类目、材质、颜色和目标用户。

要求：
1. 只使用输入中明确提供的事实，不补写功效、销量和折扣；
2. 标题不超过 24 个汉字；
3. 返回 JSON，字段固定为 title、summary、selling_points；
4. selling_points 必须是 3 个字符串组成的数组；
5. 信息不足时，在 missing_fields 中列出缺少的字段。
```

这里最重要的不是“写得像不像高手”，而是输出能否被程序稳定读取。第一版尽量要求固定字段，避免让前端从一大段自然语言中猜结构。

::: tip 提示词的最小测试集
不要只测一条“正常输入”。至少准备四条：信息完整、缺少字段、特别长的输入，以及明显不合规的输入。这样更容易发现提示词和页面状态中的问题。
:::

### 2.2 接入提示词：让 AI IDE 修改工程

接入 API 时，不必一开始就写很多工程要求。把**要实现的功能**和**官方示例**交给 AI IDE，让它先帮你完成最小接入。

```text
请参考下面的官方示例，把这个 API 接入当前项目。

我要实现的功能：
用户在商品详情页点击“生成文案”，AI 根据商品信息生成一段文案，并显示在当前页面。

请你：
1. 找到需要修改的页面和文件；
2. 使用环境变量保存 API Key，不要把密钥写进前端代码；
3. 接通 API，并为按钮加入生成中和失败提示；
4. 完成后告诉我怎样配置密钥、启动项目和测试功能。

官方示例：
<粘贴不包含真实密钥的 curl 或 SDK 示例>
```

换成图片、语音或视频接口时，只要改写“我要实现的功能”，再换成对应的官方示例即可。先把最小调用跑通，后面再根据产品需要补充返回格式、重试和更多页面状态。

## 3. 怎样读一页官方 API 文档

不同厂商的页面长得不同，但第一次调用需要找的内容基本相同：

1. **能力页面**：确认这个接口究竟是文本、图片、语音还是视频。
2. **Endpoint**：请求方法与地址，例如 `POST /v1/chat/completions`。
3. **Authentication**：API Key 放在 `Authorization` 还是其他请求头。
4. **Model ID**：请求体中 `model` 应填写的准确字符串。
5. **最小请求**：官方提供的 curl、JavaScript 或 Python 示例。
6. **最小响应**：结果在哪个字段，返回 JSON、URL 还是二进制文件。
7. **错误与限制**：文件大小、上下文长度、RPM、TPM、并发和计费方式。

推荐的阅读顺序是：**Quick Start → API Reference → Models → Error Codes → Rate Limits/Pricing。** 第一次不必把整套文档读完，先跑通最小示例，再回来看参数。

### 3.1 让 AI 帮你读长文档

许多文档站提供 `llms.txt` 或 `llms-full.txt`。例如 [SiliconFlow 的文档使用说明](https://docs.siliconflow.cn/cn/userguide/use-docs-with-cursor)就介绍了怎样把文档索引交给编程工具。

如果文档没有这类入口，也可以给 AI IDE 一个具体页面链接和明确任务：

```text
请阅读这个官方 API 页面，只回答下面七项：
1. 请求方法和 endpoint；
2. 鉴权方式；
3. 当前可用的 model ID；
4. 必填参数；
5. 成功结果所在字段；
6. 常见错误码；
7. 给出一个不含真实密钥的最小 curl 示例。

不要根据记忆补全，所有字段都要来自我提供的官方页面。
```

## 4. 服务台里常见的概念

### 4.1 模型与调用

| 服务台概念 | 简单理解 | 接入时要注意什么 |
| --- | --- | --- |
| **Model / Model ID** | 模型及其调用名称 | 页面展示名和请求里的 ID 可能不同，复制当前 ID |
| **Playground / 在线体验** | 不写代码先测试输入输出 | 适合试提示词，不代表 API 已经接通 |
| **Base URL / Endpoint** | API 的主地址和具体路径 | 不要把网页地址当成 API 地址 |
| **Region / 区域** | 服务运行的数据中心 | 区域不同，地址、可用模型和数据要求可能不同 |
| **Deployment / 推理服务** | 某个平台上已开通的模型实例 | 有些平台要先开通或部署，才能获得 endpoint |

### 4.2 账号、费用与排错

| 服务台概念 | 简单理解 | 接入时要注意什么 |
| --- | --- | --- |
| **API Key** | 调用凭证，也是费用入口 | 只放服务端环境变量；泄露后立即撤销 |
| **Usage / Billing** | 调用量、余额和账单 | 调试时用它确认请求是否真的到达平台 |
| **Quota** | 账号在一段时间内可用的总量 | 额度不足与代码错误是两类问题 |
| **RPM / TPM** | 每分钟请求数 / Token 数 | 超过限制通常返回 `429`，需要排队或重试 |
| **Concurrency** | 同时处理的任务数 | 图片、语音和视频常受并发限制 |
| **Request ID / Trace ID** | 一次请求的追踪编号 | 报错时记录它，便于查日志或联系客服 |
| **Task ID** | 异步任务编号 | 视频、长音频生成后要用它继续查询状态 |
| **Callback / Webhook** | 任务完成后由平台通知你的地址 | 比频繁轮询更适合正式产品 |
| **File ID / 临时 URL** | 生成文件的标识或下载地址 | 临时链接会过期，正式产品要转存自己的存储 |
| **Content Safety** | 内容审核和安全限制 | 真人、声音克隆和商业素材还要确认授权 |

### 4.3 文档中常见的请求参数

| 参数 | 它控制什么 | 使用建议 |
| --- | --- | --- |
| **Context Window** | 一次请求能处理的最大上下文 | 不等于每次都应该塞满；过长会增加费用和延迟 |
| **Input / Output Tokens** | 输入和输出的计量单位 | 用量页面常按两者分别计费 |
| **max_tokens** | 最多生成多少 Token | 给输出留够空间，但不要无限放大 |
| **temperature** | 输出的随机程度 | 分类、抽取用较低值；创意文案再适当提高 |
| **top_p** | 另一种控制采样范围的参数 | 初学时通常只调整 temperature，不必同时大改 |
| **stream** | 是否分段返回结果 | 对话和语音适合流式；固定 JSON 先用非流式 |
| **response_format** | JSON、URL、Base64 或二进制 | 前端展示方式取决于这里返回的类型 |
| **seed** | 尝试提高结果可复现性 | 不是所有模型都支持，也不保证完全一致 |
| **timeout / retry** | 超时与重试策略 | 只重试适合重试的错误，并限制次数 |

下面三张图分别展示了不同服务台中的典型入口。界面会变化，重点是认识信息类别，而不是记住按钮位置。

![DeepSeek 用量页面，包含余额、月度支出和调用趋势](images/index-2026-01-20-13-57-41.png)

*DeepSeek 的 Usage 页面用于确认消耗和余额。请求失败时，先区分“没有发出去”“平台拒绝”和“额度不足”。*

![SiliconFlow 模型广场，左侧按文本、图像、视频和语音区分能力](images/index-2026-01-20-15-05-04.png)

*模型聚合平台会同时提供多种厂商和模态。进入详情页后，还要继续确认价格、上下文、RPM、TPM 和准确的 Model ID。*

![火山方舟快速 API 接入页面，展示 API Key 与快速测试步骤](images/index-2026-01-20-23-13-01.png)

*一些云平台会把创建 Key、选择已开通模型和复制官方示例放在同一个接入向导中。真实 Key 不要进入截图、聊天记录或前端代码。*

## 5. 一套可以迁移的接入流程

无论接入哪种能力，都可以按下面的顺序进行：

1. 在 Playground 中用真实业务输入测试提示词。
2. 从官方文档复制当前最小示例和 Model ID。
3. 在本地终端中运行 curl，先确认账号和接口可用。
4. 把 Key 写入 `.env.local` 等不会提交的环境文件。
5. 在服务端或 Serverless 接口中封装第三方调用。
6. 前端只调用自己的 `/api/...`，并显示等待、成功和失败状态。
7. 用平台 Usage、日志和 Request ID 验证真实调用。

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

### 5.1 同步接口与异步接口

| 类型 | 调用后返回什么 | 适合什么任务 | 页面怎样显示 |
| --- | --- | --- | --- |
| **同步** | 直接返回最终结果 | 短文本、图片理解、短语音识别 | Loading → 结果或错误 |
| **流式** | 分段返回文字或音频 | 对话、实时播报 | 边接收边展示，并支持停止 |
| **异步** | 先返回 `task_id` | 图片、长音频、视频 | 排队中 → 生成中 → 成功/失败 |

图片和视频可能需要几十秒甚至更久。不要让按钮一直显示一个不变的“加载中”；把排队、生成、完成和失败分别告诉用户。

## 6. 文本生成：以 DeepSeek 为例

[DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/)提供兼容常见 SDK 的文本接口。模型会持续更新，接入前应从[模型列表](https://api-docs.deepseek.com/api/list-models)复制当前 ID。

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

第一次接入只保留一个按钮和一组固定输入。确认响应结构以后，再加入表单、历史记录和流式显示。

### 文本接口的验收

- 两组不同商品资料会得到对应结果；
- 缺少信息时不会编造价格、功效或销量；
- 返回结构可以被 `JSON.parse` 正确解析；
- 请求失败时页面允许重试；
- Usage 页面能看到真实消耗。

## 7. 图片理解：以 Qwen3-VL 为例

视觉语言模型接收“图片 + 文字问题”。它并不是先自动把图片变成一段万能描述，而是根据任务提取相关信息。

```text
任务：分析商品图片，为后续文案准备结构化资料。

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

![图片理解能力接入产品后的效果](images/index-2026-01-20-15-34-36.png)

*先让用户确认模型识别出的商品信息，再生成文案，通常比直接从图片生成最终文案更容易发现错误。*

## 8. 图片生成与编辑：以 Seedream 为例

[Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite)可以处理文生图与参考图编辑。控制图片结果时，提示词可以按下面顺序组织：

```text
主体：画面中最重要的对象
动作：主体在做什么
环境：时间、地点、背景
构图：景别、机位、主体位置、留白
光线与色彩：自然光、影棚光、主色调
用途：商品主图、横幅、海报或故事配图
限制：不添加商标、不生成额外文字、不改变商品结构
```

示例：

```text
基于参考图中的黑色通勤双肩包，生成一张 4:5 商品海报。
背包放在浅灰色台面中央，正面略向右转 15 度；柔和影棚光，背景保持简洁；
画面上方留出标题区域，不生成任何文字、Logo、价格或促销标签；
保持拉链、肩带和口袋结构与参考图一致。
```

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

接入提示词可以这样写：

```text
为页面增加“上传录音并转写”功能：
1. 允许选择 mp3、m4a 或 wav；
2. 上传前检查文件类型、大小和时长；
3. 服务端使用 multipart/form-data 调用转写接口；
4. 页面显示上传中、识别中、完成和失败状态；
5. 把返回的 text 放进可编辑文本框；
6. 日志记录 x-siliconcloud-trace-id，不记录音频内容和密钥。
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

### 10.1 视频提示词比图片多了“时间”

```text
主体：谁或什么出现在画面中
初始状态：视频开始时是什么样
动作：主体怎样运动，先发生什么，再发生什么
镜头：固定、推进、拉远、跟随或平移
环境变化：光线、天气、背景怎样变化
时长与比例：6 秒、横屏或竖屏
限制：保持商品外观，不添加文字和额外对象
```

示例：

```text
一只黑色通勤双肩包放在浅灰色展台中央。
镜头从正面缓慢向右环绕，随后轻微推进，展示拉链、肩带和侧袋；
柔和影棚光保持稳定，背景不变化；6 秒，竖屏；
保持背包结构与首帧一致，不添加人物、文字、Logo 或额外配件。
```

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

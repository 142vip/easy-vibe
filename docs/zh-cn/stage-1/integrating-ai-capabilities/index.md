---
title: '为原型接入 AI 能力'
description: '在已有 Web 原型中接入真实的 AI 能力：理解 API 的核心概念与密钥安全，学会阅读官方示例，并完成文本、图像理解或图像生成能力的接入。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = '约 <strong>1 天</strong>'
const relatedArticles =
  relatedArticlesMap['zh-cn/stage-1/integrating-ai-capabilities'] ?? []
</script>

# 为原型接入 AI 能力

<ProductJourney current="ai" />

## 章节导读

<ChapterIntroduction :duration="duration" :tags="['API', '文本模型', '文生图', '原型集成']" coreOutput="原型接入 1 个文本模型 + 1 个图像模型（可选）" expectedOutput="可调用真实 API 的 AI 原型">

上一章完成的原型已经能够验证页面结构和操作流程，但生成结果仍然来自模拟数据。本章将把其中一个核心按钮接到真实的 AI 服务上。

我们先理解 API Key、服务地址、模型名称和请求参数，再以文本生成为例走完一次完整调用。随后，你可以选择继续接入图像理解或图像生成能力。

模型名称和控制台界面会持续更新，因此本章更关注一套可以迁移的方法：阅读官方文档、运行最小示例、接入现有页面，并为失败情况提供清楚反馈。完成后，你会得到一个能够调用真实 AI 服务的原型。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: 'API 基础', description: '理解核心概念与安全规范' },
      { title: '接入文字', description: 'DeepSeek 文本生成实战' },
      { title: '接入图片', description: 'VLM 图像理解与生成' }
    ]" />
  </ClientOnly>
</div>

# 1. API 基础概念

前面提到，我们的目标是「把 AI 能力接进来」，让原型不再是静态演示，而是能调用真实 AI 服务的工具。要实现这一点，关键就在于理解并使用 API（应用程序编程接口）。

API 是计算机领域的一个重要抽象概念，我们可以简单理解为：**你按对方要求的格式"发一个问题"，对方就按同样的格式"回一个结果"**。

- **你发出去的内容**：通常包括"密钥（API Key）"和"你要生成什么"
- **对方回给你的内容**：成功就给结果；失败会告诉你原因（比如"密钥不对""余额不足""参数写错"）

具体来说，你需要掌握以下核心要素：

1. **API Key**：你的"通行证"，也是"钱包钥匙"。别人拿到它，就可以替你调用接口并产生费用。
2. **Endpoint（接口路径）**：API 请求的具体路径，告诉服务器你要访问哪个功能。完整的请求地址通常由"基础 URL + Endpoint路径"构成。例如：
   - 文本生成：基础URL (`https://api.service.com`) + Endpoint (`/v1/chat/completions`) = 完整URL `https://api.service.com/v1/chat/completions`
   - 图像生成：基础URL (`https://api.service.com`) + Endpoint (`/v1/images/generations`) = 完整URL `https://api.service.com/v1/images/generations`
3. **调用/请求**：向 AI 服务发送任务并获取结果的过程
4. **请求内容**：你发给AI的具体内容，比如你想让AI写的文章主题、生成的图片描述等。
5. **响应结果**：AI处理完后返回给你的内容，比如生成的文章、图片等。
6. **错误处理**：当出现问题时（如API Key错误、请求太频繁等），知道如何排查解决。

::: info ℹ️ 什么是 API
对于 API 的更深入的解释，请看附录：[API 入门](/zh-cn/appendix/4-server-and-backend/api-intro)。

::: warning 🔐 API Key 安全
API Key 是你请求 AI 服务的「通行证」，它是一串密码字符串，用于身份验证和计费。

由于 API Key 直接关联账户和费用，务必注意：

- 不要把 Key 发到聊天窗口、群聊、截图或公开论坛；
- 不要把 Key 直接写进前端代码，也不要提交到 Git 仓库；
- 本地练习时，把 Key 放在 `.env.local` 等不会提交的环境文件中；
- 准备公开部署时，应由后端或 Serverless 接口代为调用模型，避免浏览器直接暴露 Key；
- 如果怀疑 Key 已泄露，立即在服务平台撤销并重新创建。

后面的提示词和代码都使用环境变量占位符。你只需要在自己的本地环境中填写真实 Key。
:::

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: 'API 基础', description: '理解核心概念与安全规范' },
      { title: '接入文字', description: 'DeepSeek 文本生成实战' },
      { title: '接入图片', description: 'VLM 图像理解与生成' }
    ]" />
  </ClientOnly>
</div>

# 2. 接入文本生成 API：DeepSeek

虽然 API 涉及一些新概念，但接入过程可以先压缩成三件事：

> **找到官方示例、拿到 API Key、让 AI IDE 帮你接到按钮上。**

掌握了这些概念后，你会发现无论是接入文字模型还是图像模型，其本质流程都是一样的：当用户点击按钮时，前端整理输入并发起请求；接口返回结果后，再把结果展示到页面上。接下来，我们就通过实际操作来验证这一点。

在 `1.2 动手做出原型` 里，你已经做出了一个可交互的原型。接下来我们要做的，是把原型里“看起来像 AI 的功能”变成真正可用的能力：**当用户点击按钮时，原型会向外部的 AI 服务发出请求，并把返回的文字展示出来。**

::: info ℹ️ 原理延伸
如果你想了解更多原理相关的内容，请查看附录：[大语言模型（LLM）入门](/zh-cn/appendix/8-artificial-intelligence/llm-principles)。
::: details 了解更多：DeepSeek 是什么？

DeepSeek 提供与 OpenAI 和 Anthropic 格式兼容的 API，可以用常见 SDK 接入。模型名称会随版本更新；编写本章时，官方文档列出的文本模型包括 `deepseek-v4-flash` 和 `deepseek-v4-pro`。

不要依赖教程中长期不变的模型名。开始接入前，先查看 DeepSeek 的[首次调用 API](https://api-docs.deepseek.com/zh-cn/)和[模型列表](https://api-docs.deepseek.com/api/list-models)，再把当前模型 ID 填进请求。
:::

可以按照下面三步完成第一次调用：

1. **在 DeepSeek 平台创建一个 API Key**，并把它保存到本地环境变量；
2. **在 DeepSeek 文档中找到当前调用示例和模型名称**；
3. **把不含真实 Key 的官方示例交给 AI IDE**，说明要把返回结果接到哪个页面和按钮上。

先注册 [DeepSeek 开放平台](https://platform.deepseek.com/usage)账号，按需准备测试额度，并在“API Keys”页面创建密钥。密钥通常只会完整显示一次，请直接保存到本地环境文件，不要放进聊天记录或截图。

随后打开 [DeepSeek API 文档](https://api-docs.deepseek.com/)，找到当前的 curl 或 SDK 示例。把调用方式和功能需求交给 AI IDE，真实密钥仍然留在本地环境变量中。控制台界面容易变化，因此这里不再逐个展示按钮截图。

使用提示词参考如下：

```
参考这个调用方法，为商品信息页面增加文案生成功能。

要求：
1. 从环境变量读取 DEEPSEEK_API_KEY，不要把密钥写进源代码；
2. 用户点击“生成文案”后再发送请求；
3. 显示加载、成功和失败状态；
4. 把生成结果填写到可编辑的文案区域。

以下参考资料：
api 请求参考：
curl https://api.deepseek.com/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${DEEPSEEK_API_KEY}" \
  -d '{
        "model": "deepseek-v4-flash",
        "messages": [
          {"role": "system", "content": "你是一名电商内容编辑。"},
          {"role": "user", "content": "请根据商品信息生成一版简洁文案。"}
        ],
        "stream": false
      }'
```

代码生成完成后，先确认入口位置和请求逻辑，再用一条具体商品信息测试结果。如果入口不清楚，可以让 AI IDE 列出访问路径和相关文件，而不是立即重构整个项目。

![](images/index-2026-01-20-14-23-23.png)

![](images/index-2026-01-20-14-26-35.png)

要确认应用确实调用了模型，可以输入两组差异明显的商品信息，检查结果是否随输入变化；同时在浏览器网络面板和 [API 使用记录](https://platform.deepseek.com/usage)中查看请求。仅凭“每次文字不同”还不足以判断接入是否正确。

## 更多文本生成模型选型

除了 DeepSeek 之外，你也可以尝试其他文本模型。许多服务提供 **OpenAI 兼容接口**，切换时通常要检查 API Key、基础 URL、模型名称和参数差异。

### MiniMax 集成

::: details 了解更多：MiniMax 是什么？

**MiniMax** 提供文本、语音、视频等模型服务。这里使用它的文本模型，是为了练习如何在相似的接口之间切换。

截至本页更新时，开放平台文档列出的文本模型包括 `MiniMax-M2.7` 和 `MiniMax-M2.7-highspeed`。模型名称会继续变化，实际接入时应以 [MiniMax 模型列表](https://platform.minimax.io/docs/api-reference/models/openai/list-models)为准。
:::

接入方式与 DeepSeek 相似，可以从三步开始：

1. 前往 [MiniMax 开放平台](https://platform.minimax.io/) 注册账号并创建 API Key
2. 在 MiniMax 文档中找到调用示例
3. 把示例和环境变量名称交给 AI IDE，不要发送真实 API Key

下面的 curl 示例使用环境变量表示 API Key。可以把它交给 AI IDE 作为请求结构参考，不要附上真实密钥：

```bash
curl https://api.minimax.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${MINIMAX_API_KEY}" \
  -d '{
        "model": "MiniMax-M2.7",
        "messages": [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Hello!"}
        ],
        "stream": false
      }'
```

::: tip ✅ 提示
MiniMax 也提供 OpenAI 兼容格式。如果已经接入 DeepSeek，切换时重点检查下面三个地方，并以服务返回的错误信息为准：
1. **基础 URL**：改为 `https://api.minimax.io/v1`
2. **API Key**：使用 MiniMax 的 API Key
3. **模型名称**：从当前模型列表中选择，例如 `MiniMax-M2.7` 或 `MiniMax-M2.7-highspeed`

更多信息请参考 [MiniMax OpenAI 兼容接口文档](https://platform.minimax.io/docs/api-reference/text-openai-api)。
:::

# 3. 接入图像转文字 API：Qwen3 VL

::: info ℹ️ 原理延伸
如果你想了解更多原理相关的内容，请查看附录：[视觉语言模型（VLM）入门](/zh-cn/appendix/8-artificial-intelligence/multimodal-models)。

::: details 了解更多：Qwen3 VL 是什么？

**Qwen3 VL** 是通义千问团队推出的视觉语言模型系列。VL 代表「Vision-Language」。这类模型可以同时接收图片和文字，并根据图片生成描述、回答问题或提取信息。

![](images/index-2026-01-20-14-48-27.png)
![](images/index-2026-01-20-14-48-41.png)

**Qwen3 VL 的主要能力包括：**

- **图像理解**：能够识别图片中的物体、场景、人物、文字等内容
- **视觉问答**：根据用户提问，准确回答关于图像的问题
- **图像描述**：生成详细或简洁的图像文字描述
- **多图理解**：支持同时处理多张图像，进行对比分析
- **文本提取**：从图像中提取文字内容（OCR 能力）

**典型应用场景：**

- 电商：商品图片自动生成标题、描述、卖点
- 内容创作：根据素材图自动生成文案或配图建议
- 办公：图片内容提取、报表自动识别
- 教育：图片题目自动解析、知识点提取

:::

前面接入的是文本生成 API，但这个案例还允许用户上传商品图片。只把商品名称交给文本模型，往往会遗漏图片中的材质、颜色和结构等信息。

这时可以加入视觉语言模型（VLM），让它根据图片提取可见信息，再生成商品描述或关键词。

为了方便，我们使用[云平台 SiliconFlow](https://cloud.siliconflow.cn/me) 提供的 API 接口进行图生文 API 的接入。

::: details 了解更多：什么是 Siliconflow
**硅基流动（SiliconFlow）** 是一个模型 API 平台，可以通过相似的接口调用不同厂商的文本、视觉和图像模型。

**平台特点：**

- **多模型支持**：集成多种主流 AI 模型，包括 DeepSeek、Qwen、Llama 系列等开源模型
- **接口兼容**：提供兼容 OpenAI 格式的 API 接口，便于现有应用集成
- **按需付费**：支持按调用量计费的方式使用
:::

进入 SiliconFlow 的模型广场后，可以通过视觉标签筛选图片理解模型。平台上的模型和入口可能调整，不需要逐个寻找教程中的相同按钮。

这里以 `Qwen/Qwen3-VL-8B-Instruct` 为例。运行前请在控制台确认它仍然可用；如果模型 ID 已变化，复制控制台当前显示的 ID 即可。

进入 [SiliconFlow API 密钥页面](https://cloud.siliconflow.cn/me/account/ak)，创建一个新的 API Key。

你可以把下面的参考代码交给 AI IDE，并告诉它从环境变量读取密钥。真实 API Key 仍然只保存在本地。

::: details 图片转文字参考代码

```python
from openai import OpenAI
from typing import Dict, Any, List
import base64
import os
SILICONFLOW_API_KEY: str = os.environ["SILICONFLOW_API_KEY"]
SILICONFLOW_BASE_URL: str = "https://api.siliconflow.cn/v1/"
MODEL_NAME: str = "Qwen/Qwen3-VL-8B-Instruct"

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def get_vlm_completion(client: OpenAI, messages: List[Dict[str, Any]]) -> str:
    response = client.chat.completions.create(
        model=MODEL_NAME,
        messages=messages,
        max_tokens=512,
        temperature=0.7,
        top_p=0.7,
        frequency_penalty=0.5,
        stream=False,
        n=1
    )
    return response.choices[0].message.content

def caption_image(image_path: str) -> str:
    base64_image = encode_image(image_path)
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Please describe this image in detail."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ]

    client = OpenAI(
        api_key=SILICONFLOW_API_KEY,
        base_url=SILICONFLOW_BASE_URL
    )

    return get_vlm_completion(client, messages)

image_path = "images.jpg"
caption = caption_image(image_path)
```

:::

在这个场景中，我们直接尝试让 AI IDE 帮我们实现将上传的图片，自动生成电商卖点文本、关键词的功能，如下所示：

```
基于下面的图生文接口 API ，帮我们实现将上传的图片，自动生成电商卖点文本、关键词的功能

<此处粘贴参考代码，并说明密钥保存在 SILICONFLOW_API_KEY 环境变量中>
```

最后得到生成结果：
![](images/index-2026-01-20-15-34-36.png)

![](images/index-2026-01-20-15-35-41.png)

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: 'API 基础', description: '理解核心概念与安全规范' },
      { title: '接入文字', description: 'DeepSeek 文本生成实战' },
      { title: '接入图片', description: 'VLM 图像理解与生成' }
    ]" />
  </ClientOnly>
</div>

# 4. 接入图像生成 API：以 Seedream 为例

在前面的部分我们主要和文本相关的任务打交道，接下来我们将尝试接入图片生成的功能，支持从文字描述生成图片，或者对图片进行修改。

::: info ℹ️ 原理延伸
如果你想了解更多原理相关的内容，请查看附录：[图像生成入门](/zh-cn/appendix/8-artificial-intelligence/image-generation)。

::: details 了解更多：什么是 [Seedream](https://seed.bytedance.com/en/blog/deeper-thinking-more-accurate-generation-introducing-seedream-5-0-lite)？

![](images/index-2026-01-20-23-15-17.png)

> Seedream 是字节跳动推出的图像生成与编辑模型系列，可以根据文字或参考图生成新图片。模型版本更新较快，本节关注的是接入流程，而不是某个固定版本的参数。
>
> ![](images/index-2026-01-20-23-15-38.png)
> ![](images/index-2026-01-20-23-15-50.png)

**主要能力：**

- **文生图**：用文字描述生成图片，支持多种风格（写实、卡通、水墨、赛博朋克等）
- **风格迁移**：将一张图片转换成指定的艺术风格
- **图像变体**：基于参考图生成相似风格的新图
- **分辨率提升**：增强图片清晰度和细节
- **图像编辑**：在现有图片上进行编辑和修改，通过自然语言指令

**典型应用场景：**

- 电商：生成主图、详情页配图、促销海报
- 社交媒体：生成头像、表情包、配图
- 设计：快速出概念图、素材图、背景图
- 营销：制作广告图、活动 banner、节日海报

**与 Qwen3 VL 的配合：**

这两个 API 可以串联使用：先用 Qwen3 VL 分析参考图，理解画面内容；再用 Seedream 基于分析参考图的提示词内容生成新图片。
:::

许多 AI 海报、商品主图和角色图，都使用了图片生成或图片编辑模型。应用需要把用户输入整理成请求，等待服务返回图片，再把生成状态和结果展示出来。

接入时可以按照下面的顺序进行：

1. 在[火山方舟控制台](https://www.volcengine.com/experience/ark?launch=seedream)开通服务并创建 API Key。
2. 根据原型需要选择文生图或参考图编辑。
3. 从控制台复制当前模型 ID 和最小调用示例。
4. 把密钥保存在本地环境变量中，再让 AI IDE 把示例接入页面。

控制台界面、模型 ID 和可选参数都会变化。先运行官方提供的最小示例，确认请求成功后，再逐项加入尺寸、参考图、水印等参数。下面用参考图编辑说明请求的大致结构：

```
curl -X POST https://ark.cn-beijing.volces.com/api/v3/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ARK_API_KEY}" \
  -d '{
    "model": "<从控制台复制当前模型 ID>",
    "prompt": "将图1的服装换为图2的服装",
    "image": ["https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_1.png", "https://ark-project.tos-cn-beijing.volces.com/doc_image/seedream4_imagesToimage_2.png"],
    "sequential_image_generation": "disabled",
    "response_format": "url",
    "size": "2K",
    "stream": false,
    "watermark": false
}'
```

有了图像参考代码后，我们让 AI IDE 支持电商中常用的图像任务功能：

```
请基于下面的图片生成 API，为当前工程加入商品海报生成功能。
密钥从 ARK_API_KEY 环境变量读取，不要写入前端代码。

<此处粘贴官方图像编辑示例>
```

实现效果如下:

![](images/index-2026-01-20-23-21-13.png)

图片生成请求耗时较长，也可能因为参数、图片格式或额度不足而失败。调试阶段应保留服务返回的错误信息，同时在用户界面中显示简短、可理解的提示。例如：

```
请在开发日志中记录接口返回的错误类型和信息；页面上显示“生成失败，请检查图片格式或稍后重试”，并提供重试按钮。
```

如果代码已经修改但页面仍显示旧结果，可以先确认文件是否保存、浏览器是否刷新，再重启开发服务器。

在电商的业务中，我们可能会想让用户上传的衣服能够自动穿在人物身上，又或者是自动生成商品吸引人的售卖图、海报。这里我们尝试的提示词是让它生成一个电商海报：

![](images/index-2026-01-20-23-14-10.png)

你可以根据自己想象的业务场景，使用文生图或者图生图 API 实现不同的功能。

## 更多不同图像服务选型

下面给出其他选择。建议你先跑通 Qwen 生图的结果，再根据效果与成本使用下列服务做替换（根据实际使用感受选择）。

### Recraft 集成

如果你的原型更偏“设计生产”（例如生成品牌风格插画、营销海报、矢量风格素材），Recraft 往往会更顺手。接入方式与上一节完全一致：**拿到 Key + 找到官方示例 + 让 AI IDE 把示例落到你的按钮/页面里**。

::: details 了解更多：什么是 Recraft？

> Recraft 是面向设计、插画和营销素材的图像生成工具，也提供 API。它适合需要反复调整构图、风格或品牌素材的原型。
>
> ![](images/index-2026-01-20-23-23-34.png)
> ![](images/index-2026-01-20-23-23-42.png)

首先，在 [Recraft API 页面](https://www.recraft.ai/profile/api)查看当前的开通方式、额度和价格。这些信息可能变化，只准备完成测试所需的最小额度即可。

之后，我们仍然遵循同样的方法：去官方文档找到相应的请求示例：

- <https://www.recraft.ai/docs/api-reference/getting-started>
- <https://www.recraft.ai/docs/api-reference/usage>
- <https://www.recraft.ai/docs/api-reference/guides>

:::

### Qwen Image / Qwen Image Edit 集成

如果你希望使用更简单的方式接入图像生成服务，可以考虑 Qwen Image（通义万相）。思路同样不变：把它当成一个"图片生成 API"，接到你的原型按钮上即可。

::: details 了解更多：Qwen Image / Qwen Image Edit 是什么？

**Qwen Image**（也称通义万相）是阿里云通义团队推出的图像生成模型系列，主要包括两大模型：

**1. Qwen Image——文生图（Text-to-Image）模型**

根据文字描述生成全新的图片。你输入一段提示词，模型会理解你的意图并生成符合描述的图像。

![](images/index-2026-01-20-14-43-30.png)

**主要能力：**

- **文生图**：用文字描述生成图片，支持多种风格（写实、卡通、水墨、赛博朋克等）
- **风格迁移**：将一张图片转换成指定的艺术风格
- **图像变体**：基于参考图生成相似风格的新图
- **分辨率提升**：增强图片清晰度和细节

**2. Qwen Image Edit——图生图（Image-to-Image）模型**

在现有图片上进行编辑和修改。通过自然语言指令，让模型理解你的修改意图并生成结果。

**主要能力：**

- **局部替换**：替换图片中的某个物体或人物（如「把背景换成海边」）
- **元素移除**：去除图片中不需要的元素
- **风格转换**：给图片添加滤镜或艺术效果
- **图像扩展**：扩展图片边界，生成新内容
- **智能修图**：自动美化、调整光影、修复瑕疵

![](images/index-2026-01-20-14-46-17.png)

![](images/index-2026-01-20-14-46-29.png)

![](images/index-2026-01-20-14-46-33.png)

**典型应用场景：**

- 电商：生成主图、详情页配图、促销海报
- 社交媒体：生成头像、表情包、配图
- 设计：快速出概念图、素材图、背景图
- 营销：制作广告图、活动 banner、节日海报
  :::

在 [SiliconFlow](https://siliconflow.cn/) 的模型广场中，可以先试用当前可用的图像模型，再决定接入哪一个。模型列表与界面会更新，应以当前页面为准。

筛选图像模型后，从当前列表中选择一个适合文生图或图片编辑任务的模型。

一切设置好后，我们需要参考相应的图像生成 API 文档。你可以在官方文档页面找到任何标记为"API Reference"的部分。点击它，然后导航到[图像生成的 API 部分](https://docs.siliconflow.cn/cn/api-reference/images/images-generations)并找到相关的请求示例。

你可以把下面的请求结构交给 AI IDE，并让它从环境变量读取 API Key。模型 ID 请从当前控制台复制。

```bash
curl --request POST \
  --url https://api.siliconflow.cn/v1/images/generations \
  --header "Authorization: Bearer ${SILICONFLOW_API_KEY}" \
  --header 'Content-Type: application/json' \
  --data '
{
  "model": "<从控制台复制当前图像模型 ID>",
  "prompt": "an island near sea, with seagulls, moon shining over the sea, light house, boats int he background, fish flying over the sea"
}
'
```

文生图和图片编辑使用的模型不同。接入前先确认当前任务，再从模型页面复制对应的 ID。

::: details 图像编辑参考代码

把下列代码交给 AI IDE，并让它继续从环境变量读取密钥和当前模型 ID：

```python
import requests
import os
from typing import Dict, Any, Optional

SILICONFLOW_API_KEY: str = os.environ["SILICONFLOW_API_KEY"]
SILICONFLOW_BASE_URL: str = "https://api.siliconflow.cn/v1/images/generations"
QWEN_IMAGE_EDIT_MODEL: str = os.environ["QWEN_IMAGE_EDIT_MODEL"]

def generate_image_edit(
    prompt: str,
    image: Optional[str] = None,
    image2: Optional[str] = None,
    image3: Optional[str] = None,
    negative_prompt: Optional[str] = None,
    cfg: Optional[float] = 4.0,
    seed: Optional[int] = None
) -> Optional[Dict[str, Any]]:
    payload: Dict[str, Any] = {
        "model": QWEN_IMAGE_EDIT_MODEL,
        "prompt": prompt,
    }
    if image:
        payload["image"] = image
    if image2:
        payload["image2"] = image2
    if image3:
        payload["image3"] = image3
    if negative_prompt:
        payload["negative_prompt"] = negative_prompt
    if cfg is not None:
        payload["cfg"] = cfg
    if seed is not None:
        payload["seed"] = seed

    headers: Dict[str, str] = {
        "Authorization": f"Bearer {SILICONFLOW_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(SILICONFLOW_BASE_URL, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error generating image: {e}")
        return None

def save_image_from_url(image_url: str, output_path: str = "image.png") -> bool:
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        os.makedirs(os.path.dirname(output_path) if os.path.dirname(output_path) else ".", exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)
        print(f"Image saved successfully to: {output_path}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error downloading image: {e}")
        return False
    except Exception as e:
        print(f"Error saving image: {e}")
        return False

prompt: str = "让天空变成傍晚，有月亮和星星，梦幻风格"
negative_prompt: str = "模糊, 低质量, 扭曲"
image_url: str = "https://inews.gtimg.com/om_bt/Os3eJ8u3SgB3Kd-zrRRhgfR5hUvdwcVPKUTNO6O7sZfUwAA/641"
image2_url: Optional[str] = None
image3_url: Optional[str] = None

cfg: float = 4.0
seed: int = 12345
output_path: str = "edited_image.png"

print(f"Generating edited image with prompt: {prompt}")
print(f"Input image: {image_url}")
print(f"CFG: {cfg}, Seed: {seed}")
print("-" * 50)

result = generate_image_edit(
    prompt=prompt,
    image=image_url,
    image2=image2_url,
    image3=image3_url,
    negative_prompt=negative_prompt,
    cfg=cfg,
    seed=seed
)

if result and "images" in result:
    images = result["images"]
    if images and len(images) > 0:
        image_url_result = images[0]["url"]
        print(f"Image edit generated successfully. URL: {image_url_result}")
        success = save_image_from_url(image_url_result, output_path)
        if success:
            print(f"Image saved to: {output_path}")
        else:
            print("Failed to save image to local file")
    else:
        print("No images found in response")
else:
    print("Image generation failed")
    if result:
        print(f"Response: {result}")
```

:::

# 附录：如何找到“当前更强”的 AI 模型

文字模型更新很快，单篇教程很难长期给出固定答案。下面两个网站可以作为比较候选模型的补充信息。

一般来说，这类网站可以理解为 **“模型竞技场”**：它会把两个模型的输出放在一起，你投票选你更喜欢的那个。票数高的模型，通常意味着更多人觉得它“更好用”。

有些竞技场会出现匿名模型（“Unknown Model”），它们用于盲测。匿名结果适合观察体验，不适合作为需要稳定模型 ID 的产品依赖。

## LMArena

网站：<https://lmarena.ai/>

LMArena 更适合用来判断“多数人更偏好哪个模型的回答”。投票越多、分数越高，通常意味着它在真实使用场景里更稳。

一个简单的用法是：

1. 直接看排行榜（Leaderboard）
2. 先选一个你要做的方向（例如通用对话 / 编程 / 视觉）
3. 选 Top 3 里你能用的那个（能访问、价格能接受、延迟能接受）

![](images/image.png)

## Artificial Analysis

网站：<https://artificialanalysis.ai/>

Artificial Analysis 更适合把“效果 / 价格 / 速度”放在同一张表里对比，你可以把它当作模型选型的参数表。

常用的用法是：

1. 找到你关心的模型类别（文本 / 生图等）
2. 看质量指标（Quality）+ 价格（Price）+ 延迟/吞吐（Latency/Throughput）
3. 选一个“综合性价比”最符合你产品的

::: tip ✅ 建议
不要凭感觉争论“哪个更强”。更可靠的做法是：用同一组输入同时测试 2~3 个模型，再结合榜单与价格做决定。
:::

## 总结

在接入各类 AI 服务时，不必把 API 想象得太复杂。把握住以下几个核心概念，基本就能应对大多数场景：

**API 的本质是通信桥梁**。应用把请求发送给模型服务，再接收结果或错误。理解请求、响应和错误信息，能帮助你判断问题发生在哪一层。

**SDK 是对 API 的封装**。它通常会处理请求格式、参数校验等重复工作。先用官方最小示例跑通，再根据项目语言选择合适的 SDK。

**阅读文档时，先找到四样东西**：服务地址（endpoint）、身份凭证（API key）、当前模型 ID，以及最小调用示例。请求失败时，再查看状态码和错误信息。

AI IDE 可以帮助你改写示例和定位代码，但模型选择、密钥安全和最终效果仍需要你自己检查。用同一组真实输入比较两三个候选模型，通常比只看榜单更可靠。

# 5. 作业：接入一个 AI 能力

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="font-weight: bold; font-size: 16px;">练习：把 AI 能力接入工作台</div>
  </template>

  <p>
    参考本节课的提示词和内容，完成一次完整闭环：
  </p>

  <ul>
    <li>
      <strong>完整闭环实践</strong>
      <ul>
        <li>选择并接入一个 AI 服务（LLM / 文生图 / 图生图）→ 实现前后端交互 → 整合到你的原型中</li>
      </ul>
    </li>
    <li>
      <strong>成果分享</strong>
      <ul>
        <li>截图你的功能页面分享给大家看</li>
      </ul>
    </li>
    <li>
      <strong>思考题</strong>
      <ul>
        <li>为下一节“完整项目实践”预留空间，提前思考：你准备把哪些 AI 能力放进同一条用户流程？</li>
      </ul>
    </li>
  </ul>
</el-card>

## 下一步

在下一节中，我们将把这些分散的 AI 能力串联起来，结合实际业务场景做一个完整的产品：

- 把内容策划、商品上架、数据分析等环节串联成一条完整的业务流程
- 将本节课学到的 AI 能力（LLM 文案生成、文生图、图像编辑等）嵌入到实际业务节点中
- 把孤立的功能整理成可以连续操作的“电商 AI 工作台”原型

<RelatedArticlesSection
  title="相关文章"
  description="从“单点 AI 能力”到“完整产品流程”的推荐学习路径。"
  :items="relatedArticles"
/>

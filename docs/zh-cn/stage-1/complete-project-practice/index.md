---
title: '完整项目实战：从想法到作品'
description: '补全产品状态，使用模拟数据检验页面，并根据真实反馈完成一个可以交给别人体验的 AI 产品原型。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = '约 <strong>3 天</strong>'
const relatedArticles =
  relatedArticlesMap['zh-cn/stage-1/complete-project-practice'] ?? []
</script>

# 完整项目实战：从想法到作品

<ProductJourney current="finish" />

## 章节导读

<ChapterIntroduction :duration="duration" :tags="['产品思维', '模拟数据', '交互完善', 'LocalStorage']" coreOutput="1 个可以完整体验的 AI 产品原型" expectedOutput="包含完整链路与示例数据的 Web 应用">

上一章已经让核心功能调用了真实的 AI 服务。接下来，我们把注意力从“功能能否运行”转向“用户能否顺利完成任务”。

本章会补充加载、失败和空状态，保存必要的数据，并使用更接近真实业务的示例内容测试整个流程。随后，我们会邀请其他人试用，根据观察到的问题继续修改。

这是第一阶段的最后一章。完成后，你将拥有一个流程完整、可以演示并交给别人体验的 AI 产品原型。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: '完善链路', description: '从单点功能到完整闭环' },
      { title: '准备数据', description: '用模拟数据检验页面' },
      { title: '反馈迭代', description: '基于真实反馈修补体验' },
      { title: '完成作品', description: '整理并展示阶段成果' }
    ]" />
  </ClientOnly>
</div>

## 1. 完善核心流程中的不同状态

目前的原型已经可以在理想情况下完成一次任务：用户点击按钮，API 返回结果，页面显示内容。接下来还要补上等待、失败和空数据等状态。它们不会改变核心功能，却会直接影响用户能否理解页面正在发生什么。

### 1.1 增加“等待”与“反馈”

当用户点击“生成文案”时，AI 往往需要几秒钟才能响应。等待期间，按钮应该暂时不可重复点击，页面也需要给出明确反馈。

> “当我点击生成按钮时，请把按钮变成‘生成中...’并不可点击，同时在右侧区域显示一个加载动画。直到 API 返回结果后，再恢复正常。”

### 1.2 处理“失败”与“异常”

API Key 可能过期，网络也可能中断。页面需要说明请求没有完成，并允许用户重试；开发日志则应保留更具体的错误信息，方便排查。

> “如果 API 请求失败了，不要直接在控制台报错，请在页面顶部弹出一个红色的提示框（Toast），告诉用户‘生成失败，请稍后重试’，并允许用户重新点击生成。”

### 1.3 对话历史持久化

在与 AI 交互的过程中，我们需要保存对话内容，让用户能够回顾历史、继续之前的交流。目前阶段我们暂不引入数据库，可以选择以下轻量级方案：

**存储方案选择：**

| 方案             | 适用场景                         | 特点                                 |
| ---------------- | -------------------------------- | ------------------------------------ |
| **LocalStorage** | 纯前端项目，用户数据保存在浏览器 | 实现简单，刷新不丢失，无法跨设备同步 |
| **JSON 文件**    | 本地原型，数据以文件形式存储     | 结构清晰，便于调试，可手动编辑       |
| **TXT 文件**     | 最简方案，快速记录文本内容       | 格式自由，兼容性好                   |

保存的对话历史通常包含角色、内容和时间，例如：

```json
[
  {
    "role": "user",
    "content": "请根据这款蓝牙耳机的信息生成一版商品介绍",
    "timestamp": "2026-08-10 10:30:00"
  },
  {
    "role": "assistant",
    "content": "这款耳机支持主动降噪和 30 小时续航，适合通勤与日常办公。半入耳设计便于长时间佩戴，具体效果请以实际体验为准。",
    "timestamp": "2026-08-10 10:30:05"
  }
]
```

**实现提示词：**

> “请帮我实现对话历史的保存功能。支持将用户和 AI 的对话记录保存为 JSON 文件（或使用 LocalStorage）。每次进入页面时自动加载历史对话，支持查看和删除单条对话记录。”

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: '完善链路', description: '从单点功能到完整闭环' },
      { title: '准备数据', description: '用模拟数据检验页面' },
      { title: '反馈迭代', description: '基于真实反馈修补体验' },
      { title: '完成作品', description: '整理并展示阶段成果' }
    ]" />
  </ClientOnly>
</div>

## 2. 使用模拟数据检验页面

只有一条 `test` 数据时，很难发现列表过长、标题换行或失败状态等问题。我们可以准备一组模拟数据（Mock Data），让页面同时出现不同类目、状态和内容长度。模拟数据用于测试与演示，不应冒充真实用户数据。

### 2.1 让 AI 帮你设计数据结构

先描述业务场景和页面需要显示的信息，让 AI 给出一版数据结构。生成后仍要逐个检查字段：名称是否清楚，是否真的会在页面中使用，状态是否覆盖完整。

> **提示词示例：**
> “我正在做一个**电商内容工作台**的原型。
> 请帮我设计一个 JSON 数据结构，用来描述一个‘商品任务’。
> 这个任务应该包含：商品的基本信息（名字、类目）、输入的素材（图片链接）、以及 AI 生成的结果（标题、文案、海报图）。
> 请直接给我一个 JSON 示例。”

AI 可能会给出 `productName`、`generatedContent` 等字段。保留真正需要的部分，并统一命名方式。

### 2.2 生成覆盖不同状态的示例数据

有了结构以后，再生成一批示例数据。除了类目差异，还要覆盖 `pending`、`processing`、`completed` 和 `failed` 等状态。图片可以暂时使用占位图，但要明确它只用于原型测试。

> **提示词示例：**
> “请基于刚才设计的结构，帮我生成 10 条结构完整的模拟数据。
> （备注：不一定要 JSON 格式。如果你正在写前端，可以让它直接生成 JavaScript 数组；如果你用 Python，可以让它生成 List。）
>
> **业务场景要求**：
>
> 1. 商品涵盖服装、数码和日用品三个类目。
> 2. 数据需要包含处理中、已完成和失败等状态，并准备长短不同的标题与文案。
> 3. 图片暂时使用 `https://picsum.photos/seed/{random_id}/300/400`，并在界面中标明这是示例内容。”

**生成的 Mock Data 示例：**

```javascript
export const mockProductTasks = [
  {
    id: 'task_001',
    name: '轻薄印花连衣裙',
    status: 'completed',
    input: {
      category: '女装',
      features: ['轻薄', '印花', '日常通勤'],
      originalImage: 'https://picsum.photos/seed/dress_input/300/400'
    },
    output: {
      generatedTitle: '轻薄印花连衣裙：适合通勤与周末出行',
      generatedCopy:
        '轻薄面料搭配简洁印花，适合日常通勤和周末出行。版型与尺寸请结合商品详情和实际试穿判断。',
      generatedPosterImage: 'https://picsum.photos/seed/dress_output/300/400'
    },
    createdAt: '2026-08-08T10:00:00Z'
  },
  {
    id: 'task_002',
    name: '通勤降噪蓝牙耳机',
    status: 'processing',
    input: {
      category: '数码',
      features: ['主动降噪', '长续航', '低延迟'],
      originalImage: 'https://picsum.photos/seed/tech_input/300/400'
    },
    output: {
      generatedTitle: '',
      generatedCopy: '',
      generatedPosterImage: ''
    },
    createdAt: '2026-08-09T14:30:00Z'
  }
  // ... 更多数据
]
```

### 2.3 使用 LocalStorage 保存原型数据

如果你希望刚才生成的“模拟数据”不仅能看，还能删、能改，甚至新生成的任务刷新页面后还在，你可以结合 `LocalStorage`。

> **提示词示例：**
> “请帮我实现一个数据存储功能。
>
> 1. 优先从 `localStorage` 读取数据。
> 2. 如果 `localStorage` 为空，则使用刚才生成的 Mock 数据初始化，并将它们存入 `localStorage`。
> 3. 同时帮我写 `addProductTask` 和 `deleteProductTask` 函数，每次操作都要同步更新 `localStorage`。”

这样刷新页面后仍能看到刚才的操作，适合单机原型。LocalStorage 不能跨设备同步，也不适合保存 API Key 或敏感用户数据；进入下一阶段后，再把需要共享的数据迁移到数据库。

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: '完善链路', description: '从单点功能到完整闭环' },
      { title: '准备数据', description: '用模拟数据检验页面' },
      { title: '反馈迭代', description: '基于真实反馈修补体验' },
      { title: '完成作品', description: '整理并展示阶段成果' }
    ]" />
  </ClientOnly>
</div>

## 3. 收集反馈与快速迭代

原型已经具备核心功能、完整流程和示例数据，现在可以请几位目标用户试用。此时的重点不是证明作品已经完成，而是观察他们能否独立完成任务。

### 3.1 找谁测？怎么测？

- **邀请合适的人**：优先找接近目标用户的朋友或同事，不要求他们懂技术。
- **先观察，再提问**：给出任务，但不要直接告诉对方点击哪里。记录停顿、返回和误操作的位置。
- **必要时使用“绿野仙踪法”**：如果某个自动化能力还没有完成，可以暂时由人工返回结果，先验证流程是否有价值。测试者需要知道这是原型实验。

### 3.2 记录问题并决定下一步

- **样式错乱**：不同屏幕尺寸下可能会乱。
  - **处理方式**：记录屏幕宽度并截图，让 AI IDE 定位对应的响应式样式。
- **操作别扭**：“这个流程太繁琐了”。
  - **处理方式**：先确认多位用户是否遇到相同问题，再比较缩短流程的方案。
- **需求新增**：“如果有这个功能就好了”。
  - **处理方式**：判断它是否影响核心任务。重要且常见的问题优先处理，其他建议先记录。

AI IDE 可以帮助定位样式和修改代码，但你仍要说明问题、检查改动范围，并重新走一遍核心流程。一次只修改一类问题，更容易判断变化是否有效。

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="3" :items="[
      { title: '完善链路', description: '从单点功能到完整闭环' },
      { title: '准备数据', description: '用模拟数据检验页面' },
      { title: '反馈迭代', description: '基于真实反馈修补体验' },
      { title: '完成作品', description: '整理并展示阶段成果' }
    ]" />
  </ClientOnly>
</div>

## 4. 完成并展示你的阶段作品

到这里，你已经走过了寻找问题、收敛方案、制作原型和接入 AI 的完整过程。最后，用一个自己熟悉的场景整理这些能力，并完成一份可以展示的阶段作品。

作品不必局限于“电商内容工作台”。可以结合自己的兴趣或行业经验，选择一个具体、容易验证的问题。

### 选题与要求

你需要从 **[产业多分类场景方向参考](../appendix-industry-scenarios/index.md)** 中选择一个最接近的场景，或者根据自己的想法构思一个全新的场景。

作品建议包含以下内容：

1. **清楚的场景**：说明谁在什么情况下遇到了什么问题。
2. **可操作的原型**：核心流程可以完成，而不只是一组静态页面。
3. **真实的 AI 调用**：根据任务接入文本、视觉或图像生成模型。
4. **完整的状态**：包含等待、失败、空数据和结果展示。

### 作业产出

建议准备以下两项内容：

1.  **一个完整的原型应用**：部署上线或本地可运行，具备完整的使用链路。
2.  **30 秒的演示视频**：录制一段视频，简要介绍你的应用场景，并演示核心功能的实际操作。

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="font-weight: bold; font-size: 16px;">阶段作品检查清单</div>
  </template>

  <p>
    提交或展示之前，可以按照下面的清单检查一次：
  </p>

  <div style="font-weight: bold; margin-bottom: 10px;">核心功能自检</div>
  <ul style="list-style-type: none; padding-left: 0;">
    <li><label><input type="checkbox" disabled /> <strong>场景明确</strong>：选定了一个具体的行业或应用场景</label></li>
    <li><label><input type="checkbox" disabled /> <strong>逻辑闭环</strong>：核心流程能跑通，并处理等待、失败和空状态</label></li>
    <li><label><input type="checkbox" disabled /> <strong>AI 驱动</strong>：真实调用了大模型 API，而非预设回复</label></li>
    <li><label><input type="checkbox" disabled /> <strong>体验完整</strong>：包含 Loading、错误处理及模拟数据</label></li>
  </ul>

  <div style="font-weight: bold; margin: 20px 0 10px;">交付物准备</div>
  <ul style="list-style-type: none; padding-left: 0;">
    <li><label><input type="checkbox" disabled /> <strong>原型应用</strong>：代码已完成并可运行</label></li>
    <li><label><input type="checkbox" disabled /> <strong>演示视频</strong>：30 秒左右，清晰展示核心亮点</label></li>
  </ul>
</el-card>

## 下一步

完成这份作品后，你已经能够独立把一个问题转化为可交互的 AI 应用原型。Stage 2 会在此基础上加入数据库、用户系统和部署等全栈能力，让原型可以支持更真实的使用场景。

<RelatedArticlesSection
  title="继续进阶"
  description="完成 Stage 1 后，可以继续学习下面的工程化内容。"
  :items="relatedArticles"
/>

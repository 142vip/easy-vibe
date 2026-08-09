---
title: 'AI 时代的编程初体验'
description: '用对话式方式让 AI 帮你写代码：从 0 到 1 做出 AI 原生贪吃蛇，并学会举一反三做出自己的小游戏或 Demo。'
---

# AI 时代的编程初体验

这是一个**基于项目制学习**的学习教程。我们鼓励你跟随步骤一步步操作，并尝试复现结果。
不要担心犯错或修改内容，我们永远相信你可以做到，请你永远记住：

<div style="text-align: center;">
<div style="display: inline-block; padding: 8px 20px; border-radius: 8px; border: 1px dashed #FFB6C1; background: linear-gradient(135deg, #FFF0F5 0%, #FFE4EC 100%); margin: 12px 0;">
  <span style="font-size: 15px; font-weight: 500; color: #666;">完成比完美更重要 🐣</span>
</div>
</div>

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const duration = '约 <strong>4 小时</strong>，可分多次完成'
const relatedArticles =
  relatedArticlesMap['zh-cn/stage-1/ai-capabilities-through-games'] ?? []
</script>

## 本章导读

<ChapterIntroduction :duration="duration" :tags="['对话式 AI 编程', 'AI 原生小游戏', '贪吃蛇实战']" coreOutput="AI 原生贪吃蛇 + 自创小游戏" expectedOutput="1 个可运行的 AI 原生贪吃蛇 + （可选）1 个你自创的 AI 原生小游戏或 Demo">

如果你<strong>完全不会编程</strong>，或者只会一点皮毛，这一章就是为你准备的。我们会从最基础的开始：用<strong>对话的方式</strong>让 AI 帮你写代码，不需要记语法、不需要配环境，直接在网页上就能跑起来。

你会亲手做出<strong>第一个能运行的程序</strong>——一款会"吃单词、写诗、画画"的贪吃蛇。通过这个实战，你会体验到 AI 编程到底是什么感觉：不是 AI 代替你思考，而是你把想法说出来，AI 帮你实现。

所有的创造都是从 0 到 1 开始的，很高兴能将每一份信心与专业度传递与你，于你而言，<strong>执行力 is all you need</strong>。

</ChapterIntroduction>

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="0" :items="[
      { title: '困境与机会', description: '普通人的编程新可能' },
      { title: '能力初探', description: '60秒极速开发体验' },
      { title: '原生实战', description: '打造AI原生贪吃蛇' },
      { title: '拓展创造', description: '举一反三做游戏' }
    ]" />
  </ClientOnly>
</div>

## 1. 普通人的困境与机会

很多人脑子里有一堆产品点子：一款帮自己记账的小工具、一个记录孩子成长的网页、甚至一款小游戏。但一想到要写代码、要找程序员，就直接劝退。

AI 出现之后，第一次给了普通人一个全新的可能：你不需要会写代码，只需要学会对 AI 说清楚你想要什么。来自 GitHub Copilot 的[数据显示](https://www.wearetenet.com/blog/github-copilot-usage-data-statistics)，超过1500万开发者正在用AI辅助编程，平均46%的代码都是AI生成的! 在Java项目中这个比例能达到61%。

<el-card shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="font-size: 20px;">🚀</span>
      <span style="font-weight: bold; font-size: 16px;">效率与采用率的飞跃</span>
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
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">任务耗时 (原9.6天)</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #E6A23C; font-size: 24px; font-weight: bold;">81%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">首日安装率</div>
      </div>
    </el-col>
    <el-col :span="6" :xs="12">
      <div style="text-align: center; padding: 10px;">
        <div style="color: #F56C6C; font-size: 24px; font-weight: bold;">96%</div>
        <div style="color: #909399; font-size: 12px; margin-top: 4px;">建议采纳率</div>
      </div>
    </el-col>
  </el-row>

  <div style="line-height: 1.8; color: #606266;">
    让人真正兴奋的是效率的飞跃：开发者完成任务的速度提升了 <b>55%</b>。原本需要 9.6 天才能提交的代码，现在只要 <b>2.4 天</b>就能搞定。 这种肉眼可见的效率提升，说明 AI 不再只是一个“可选工具”，而是正在成为开发流程中不可或缺的编程助手。采用率的数据也印证了这一点：在获得访问权限的当天，就有 <b>81%</b> 的开发者第一时间完成安装并开始使用；其中 <b>96%</b> 的人更是在当天就开始采纳 AI 提供的代码建议。换句话说，开发者几乎是立刻把 AI 融入了日常编码工作。
  </div>
</el-card>

对于普通人来说,这个趋势更有意义:如果专业程序员都在大量依赖AI写代码,那我们这些**不会编程的人,为什么不能直接跟AI对话来实现自己的想法呢**?

这门课的目标是帮你练成新技能：通过自然语言对话就能做应用。我们将教你怎么跟 AI 用计算机的语言沟通、怎么让AI帮你把脑子里的想法变成真实可用的产品。

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="1" :items="[
      { title: '困境与机会', description: '普通人的编程新可能' },
      { title: '能力初探', description: '60秒极速开发体验' },
      { title: '原生实战', description: '打造AI原生贪吃蛇' },
      { title: '拓展创造', description: '举一反三做游戏' }
    ]" />
  </ClientOnly>
</div>

## 2. AI 能帮你做到什么程度

在本节中，我们只讨论一个问题：如果你完全不会写代码，现在的 AI 能帮你做到什么程度？

大致来说，你可以把当前大模型的能力理解为：可以胜任**简单的内部小工具**、**数据可视化看板**，以及一些**轻量级小游戏**的开发。这些能力用来做**自用工具**、从**产品经理视角验证需求**，基本已经足够。但若想一键生成可直接**商用的成熟产品**，通常仍需要人工在**流程设计**、**细节打磨**上持续优化。

接下来，我们就以贪吃蛇为例，具体看看 AI 编程目前到底能做到什么程度。

### 2.1 60 秒做一个贪吃蛇游戏

首先，请你打开课程中使用的实验网页 [z.ai](https://chat.z.ai/)，`z.ai` 是由智谱 AI（中国领先的大语言模型公司之一）开发的 AI 平台，其核心能力由智谱自研的 GLM 系列大模型提供支持。该平台集成了多项 AI 功能，包括幻灯片生成、海报设计和全栈开发等。在本教程中，我们将重点介绍其全栈开发模块的使用。

::: details 💡 什么是「网页就能编程」的新模式？

过去，开发一个网页应用需要：
- 安装编程环境（如 Python、Node.js）
- 配置代码编辑器
- 学习 HTML/CSS/JavaScript 等语言
- 处理各种依赖和报错

而现在，借助 AI 编程平台，你只需要：
- 打开浏览器，访问网页
- 用自然语言描述你想要的功能
- AI 自动生成代码并实时预览效果

这种「对话即编程」的模式，让编程从「写代码」变成了「描述需求」。你不需要关心底层技术细节，只需要清楚地告诉 AI 你想要什么，它就能帮你把想法变成可运行的程序。这就是 AI 时代编程的新范式——**Vibe Coding（氛围式编码）**。
:::

![](images/index-2026-01-07-18-25-03.png)

输入我们的简单需求后点击 **全栈开发** 按钮，你可以实时观看网页的完整创建过程。通常只需泡一杯咖啡的时间，网页便会自动生成完毕！

```
帮我做一个贪吃蛇游戏：
1. 用方向键控制蛇的移动
2. 吃到食物后蛇会变长，分数增加
3. 撞到墙壁或自己的身体就游戏结束
4. 要有开始和重新开始按钮
5. 界面要简洁好看
```

![](images/index-2026-01-07-18-34-03.png)

生成结束后，你能看到右侧出现可浏览的网页界面。你可以上下滚动浏览页面内容，或点击页面顶部的 🧭 按钮切换至全屏模式查看效果。

> 其中顶部从左到右按钮的作用依次为：箭头按钮展开侧边对话历史栏，铅笔按钮用于新建一个对话，循环箭头按钮用于刷新页面，指南针按钮负责切换至全屏模式，Download 按钮用于下载项目，<> 按钮用于切换代码视图，Publish 按钮用于发布项目。

![](images/index-2026-01-07-18-35-11.png)

如果你想查看该网页的源代码，可以点击右上角的代码图标查看完整代码。

![](images/image7.png)

::: tip 🌐 探索更多 AI 编程工具

除了 z.ai，还推荐你还可以尝试以下优秀的 AI 编程平台进行测试：

| 工具 | 地址 | 特点 |
|------|------|------|
| **Kimi Code**（推荐） | [kimi.com/code/console](https://kimi.com/code/console) | 月之暗面推出的 AI 编程助手，提供终端版 Kimi Code CLI 与 VS Code 扩展，底层为编程专用模型 Kimi K2.7 Code，还支持接入 Claude Code、Roo Code 等工具 |
| **Google AI Studio**（推荐） | [aistudio.google.com/apps](https://aistudio.google.com/apps) | 谷歌官方出品，支持 Gemini 模型，适合快速原型开发 |
| **Figma Make** | [figma.com/make](https://www.figma.com/make) | 与设计工具深度整合，适合设计师快速实现交互原型 |
| **Coze** | [coze.com](https://www.coze.cn) | 字节跳动推出的 AI Bot 开发平台，提供零代码的可视化搭建能力。与豆包、Kimi 等国产大模型深度集成，支持插件市场、定时任务和多渠道发布（飞书、微信等），适合快速构建面向 C 端用户的对话应用或企业内部智能助手 |
| **v0.dev** | [v0.dev](https://v0.dev) | Vercel 出品的 AI 生成 UI 工具，输入描述即可生成可运行的 React 组件代码 |
| **Bolt.new** | [bolt.new](https://bolt.new) | StackBlitz 推出的 AI 全栈开发平台，可直接生成并部署完整的 Web 应用 |
| **Lovable** | [lovable.dev](https://lovable.dev) | 专注于生成高质量 React 应用，支持 GitHub 集成和一键部署 |
| **Replit Agent** | [replit.com](https://replit.com) | 集成 AI 编程助手的在线 IDE，支持多种语言和实时协作 |

想了解更多网页编程工具的详细对比和使用教程，可以参考我们的扩展阅读：[7 款主流 Vibe Coding 在线平台实测对比](../../stage-1/appendix-articles/example0-1/vibe-coding-tools-snake-game-tutorial.md)
:::

### 2.2 对话编程能做什么不能做什么

本节聚焦一个具体问题：当你只依赖对话式 AI、不写任何代码时，它究竟能把事情推进到哪一步。
在经验层面，一个较为稳定的结论是：它可以帮你完成一个“小而完整”的东西，但“做到什么程度就算够”，仍然需要你亲自决策每一步的详细步骤。

#### 更擅长“小而清晰”的应用

从前面的贪吃蛇示例中，你已经看到了一种典型模式：
只要你能把界面和交互说清楚，AI 通常可以在几轮对话内，拼出一个可以打开、可以点击、可以玩的完整网页。

这类任务往往具备几个共同特征：

- 范围清晰：一页网页、一个简单内部工具、一个小玩法
- 结果可见：你能立即在浏览器中验证是否按预期工作
- 纠错直接：发现问题后，可以在后续对话中点明具体现象并要求修正（通过复制错误直接粘贴，或者截图粘贴的形式让 AI 进行修改）

在这个边界内，你可以把对话式 AI 看作一位执行力不错的"辅助开发者"。你只需在每一轮用自然语言细化和修正需求，就能快速得到可用的原型。

**AI 独立完成小型项目的成功率：**
<el-progress :percentage="90" :stroke-width="15" status="success" striped striped-flow />

#### 大型项目需要“流程视角”

一旦超出小而清晰的范围，只指望靠几轮对话让 AI 端到端完成复杂系统，很快就会遇到上限。大型项目往往要接后端、连数据库、整合第三方服务，还牵涉权限、安全、并发和大量业务规则，目标是交付一整套与现有业务深度打通的系统，而不是一页网页。

在这种情况下，更合理的做法不是把所有需求一股脑丢给 AI，而是先梳理出清晰的整体流程：关键步骤是什么、每一步的输入输出和状态变化是什么、哪些节点对性能和安全最敏感。再基于这张流程图，把相对独立的环节拆分出来，交给对话式 AI 生成接口、模块、脚本和测试。

以目前的能力来看，AI 更擅长加速一个个小步骤，由你（或你的团队）来决定怎么拆步骤、如何串联，并负责最终的架构设计、系统集成和运维。

#### 能写和能用的区别

咋一看，AI 好像什么都能写，但这些东西到底能不能用，能用到什么程度，我们该如何划分？

一个可参考的经验是：

::: warning ⚠️ 适用场景指南

- **原型 / Demo / 内部自用工具**：非常适合先交给 AI 打第一版，再由你迭代细节。
- **面向真实用户的大型产品**：通常需要工程师在架构、抽象、性能和维护上长期投入。
- **强安全 / 强合规系统（如支付、风控、医疗等）**：在当前阶段，不宜“生成完就直接上线”，必须引入严格的审查与测试流程。
  :::

在当下，你可以相对安心地把 AI 视作一个高效的 Demo 与自用工具搭档：
只要你愿意多测试、多迭代，多问几轮“这里不对，帮我修一下并解释原因”，在原型与内部工具这一级别，整体质量通常是足够且具备实践价值的。

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="2" :items="[
      { title: '困境与机会', description: '普通人的编程新可能' },
      { title: '能力初探', description: '60秒极速开发体验' },
      { title: '原生实战', description: '打造AI原生贪吃蛇' },
      { title: '拓展创造', description: '举一反三做游戏' }
    ]" />
  </ClientOnly>
</div>

## 3. 动手：你的第一个 AI 原生应用

让我们回到动手部分，在前一部分，我们已经用 AI 快速做出了一个可以玩的贪吃蛇原型，也大致知道了 AI 能做什么、不能做什么。接下来我们将学习如何用最基础的 **vibe coding** 技巧创建一个**现代版**的 AI 贪吃蛇游戏。我们将让蛇吃掉文字字符而不是豆子。最后让游戏根据吃掉的文字字符生成一首诗，并画一幅画。
通过这个实际案例你能够理解全新编程方式的核心理念：如何学会用自然语言清晰地表达需求。

### 3.1 AI 原生贪吃蛇

在一开始，我们可以用最简单的方式与大模型对话，这将帮助我们快速获得产品原型。我们可以直接在聊天框中输入：

> **💡 示例提示词：** 帮我做一个贪吃蛇游戏
>
> ![](images/image12.png)

> **💡 示例提示词：** 帮我做一个贪吃蛇游戏，它应该支持
>
> 1. 可以吃不同的单词，它们会被收集在一个盒子里
>    ![](images/image13.png)

> **💡 示例提示词：** 帮我做一个贪吃蛇游戏，它应该支持：
>
> 1. 可以吃不同的单词，它们会被收集在一个盒子里
> 2. 当蛇吃了8个单词时，llm 应该根据这些单词创作一首诗，我们可以根据需要重新混合这首诗。
> 3. 当诗完成后，下一步将自动根据这首诗创建一幅图像。
>
> ![](images/image14.png)

注意，在开发过程中，我们可能会遇到不尽如人意的问题，例如点击按钮没有任何反应、使用功能时报错、功能未按预期工作，或者前端页面与预期设计不符。

在这种情况下，我们需要进一步向模型提问，以帮助修复这些意外问题。

![](images/image15.png)

### 3.2 给游戏添加新功能

完成基本功能后，我们可以尝试给我们的程序添加一些新花样！如果你觉得蛇吃单词或字符的过程有点枯燥，你可以让蛇吃不同颜色的单词，并相应地改变蛇的颜色。

你还可以为“吃”的过程添加特效，或者引入触发特效的魔法单词——比如增加蛇的速度或大小。另一个想法是每当蛇吃一个单词时就让模型生成一首诗和一幅图，而不是等到它吃掉八个单词。

如果觉得这些有挑战性，你可以直接向语言模型求助！它可以提供创意建议，让你的游戏更有趣。试一试吧！

```
1. "单词解锁世界" 机制
   功能：蛇吃掉一个单词后，图像模型即时为该单词生成一个小艺术品，逐渐拼成一幅由玩家创造的独特全景画——边玩边"作画"。

2. "诗歌拼图" 玩法
   功能：蛇吃掉的每个单词触发 LLM 生成一句诗、图像模型生成一幅插图，回合结束时组合成一首 AI 协作的诗和画。

3. "魔法单词" & 故事分支
   功能：吃下"风、夜、梦"等魔法单词时，LLM 改变场景主题，将图像风格切换为夜晚、暴风雨或梦幻氛围；玩家吃掉的不同单词还会让 AI 生成的故事不断演变。

4. "实时互动生成"
   功能：每吃一个单词，LLM 生成一句对话或描述，让游戏中的 NPC"开口说话"、环境随之改变，蛇的外观或障碍物也根据吃掉的单词发生变化。

5. "按句贪吃蛇" 挑战
   功能：反向模式——LLM 给出一句诗或谜语，玩家引导蛇按顺序吃掉单词来重构句子，吃错单词会触发图像模型生成有趣的艺术化后果。

6. "主题关卡" & 风格选择
   功能：开局选择"童话、科幻、唐诗"等主题，LLM 和图像模型会调整单词、诗风与画面风格，让每次运行都焕然一新。

7. "现场共创"
   功能：吃掉特殊单词时，LLM 提示玩家输入短语或选择风格，再生成对应的诗句和插图，实现真正的人机共创。

8. "成长的故事"
   功能：蛇不断成长，LLM 同步续写故事诗，图像模型生成长卷全景图，让玩家同时体验"写作、绘画和玩耍"。
```

此外，我们还可以要求 LLM 帮你直接生成项目级的提示词。在上一节中，我们只自己写了贪吃蛇游戏的提示词。现在让我们尝试让大模型生成一个带有整体框架和实现路径的提示词（你可以直接用 z.ai 生成）。

如果你想学习如何写出更好的提示词，可以查看[提示词工程附录](/zh-cn/appendix/8-artificial-intelligence/prompt-engineering)。

> 我想让 AI 生成一个网页贪吃蛇游戏，需要一个更完整的提示词，让生成结果更令人印象深刻和有趣。请生成相应的提示词。当前目标是：生成一个贪吃蛇游戏，需要实现吃不同单词生成诗歌的功能，并且应该包含图像生成模块。

z.ai 的回复将会是这样的：

![](images/image56.png)

我们可以使用这个提示词在全栈开发模式下重新生成项目：

![](images/image57.png)

![](images/image58.png)

<div style="margin: 50px 0;">
  <ClientOnly>
    <StepBar :active="3" :items="[
      { title: '困境与机会', description: '普通人的编程新可能' },
      { title: '能力初探', description: '60秒极速开发体验' },
      { title: '原生实战', description: '打造AI原生贪吃蛇' },
      { title: '拓展创造', description: '举一反三做游戏' }
    ]" />
  </ClientOnly>
</div>

### 3.3 尝试制作其他小游戏

除了贪吃蛇（游戏），我们可以让想象力尽情驰骋。

创造任何我们想创造的东西，甚至尝试搞砸一切！然后重头再来！

1. AI 艺术画廊平台：帮我做一个在线画廊，用户可以上传、浏览、点赞和评论 AI 生成的艺术作品，还能按风格分类展示。
2. 复古游戏档案馆：帮我做一个致敬经典游戏的网站，收录游戏历史与玩法指南，并内置几款可以直接在线玩的复古小游戏。
3. 可持续生活追踪器：帮我做一个碳足迹追踪工具，用户填写日常行为后自动估算碳排放，并提供环保建议和每周挑战。
4. 虚拟厨房助手：帮我做一个 AI 烹饪助手，用户输入家里有的食材，它就推荐菜谱并给出一步步的烹饪说明。
5. 地下音乐发现平台：帮我做一个音乐流媒体网站，重点推荐独立和新兴音乐人的作品，支持创建歌单和评论互动。
6. 极简任务管理系统：帮我做一个极简风格的任务管理工具，支持创建任务、设定优先级、拖动排序和查看完成进度。
7. 科幻写作工坊：帮我做一个科幻写作平台，提供世界观设定模板、角色资料卡和故事大纲工具，帮助作者搭建设定。
8. 个人知识图谱：帮我做一个可视化笔记工具，把零散的想法做成节点，用连线把相关内容连接成一张知识网。
9. 虚拟植物园：帮我做一个植物百科网站，收录各种植物的图文资料，用户还能种植自己的虚拟植物并观察生长过程。
10. 编程挑战竞技场：帮我做一个在线编程竞赛平台，提供不同难度的算法题目、在线代码编辑器、自动评测和排行榜。

还有... 如果你喜欢玩游戏，让我们一起尝试创造游戏吧！

1. 3D 开放世界 RPG：帮我做一个可自由探索的 3D 开放世界游戏，有昼夜循环、天气变化、任务系统和角色成长。
2. 第一人称射击 (FPS) 竞技场：帮我做一个快节奏的多人 FPS 游戏，支持团队死斗、夺旗等多种模式和多张地图。
3. AI 国际象棋和多人游戏：帮我做一个国际象棋平台，既能与不同难度的 AI 对弈，也能在线匹配真实玩家。
4. 麻将在线多人游戏：帮我做一个传统麻将游戏，支持多种规则、创建私人房间和自动计分。
5. 回合制策略游戏：帮我做一个网格地图的回合制策略游戏，包含单位移动、攻击、升级和战争迷雾。
6. 计时赛赛车游戏：帮我做一个 3D 赛车游戏，专注计时赛玩法，支持多张赛道、车辆改装和幽灵车回放。
7. 卡牌对战游戏 (卡组构建)：帮我做一个卡牌对战游戏，玩家可以收集卡牌、自由构建卡组并参与排位赛。
8. 大逃杀 (俯视 2D)：帮我做一个俯视视角的 2D 大逃杀游戏，包含缩圈机制、随机战利品和单排/组队模式。
9. 恐怖生存游戏 (第一人称)：帮我做一个第一人称恐怖生存游戏，重点是资源管理、潜行躲避敌人和寻找逃生出口。
10. 音乐节奏游戏 (3D)：帮我做一个 3D 音乐节奏游戏，音符随着音乐节拍从远处飞来，玩家在正确时机击打得分。

### 3.4 全网精选案例：看看别人用 AI 做出了什么

看到这里你可能还是会想：贪吃蛇只是一个入门例子，AI 真的能做出更复杂的游戏吗？

答案是肯定的。下面精选了 **8 个** 全网公开的真实案例——从经典街机游戏合集、2048 风格拼图，到复刻《我的世界》和《超级马里奥》、甚至由国产大模型 Kimi 做出的 3D 游戏和官方游戏平台。这些案例的开发者有的是程序员，也有完全零基础的普通人，但共同点是：**都用对话的方式让 AI 完成了大部分代码**。

#### 🕹️ 案例一：一个下午复刻 10 款经典街机游戏（WotAI Games）

[WotAI Games](https://games.wotai.co/) 是一个完全用 Claude Code（Vibe Coding）从零开发、**不使用任何游戏引擎** 的网页游戏合集。通过对话让 AI 一口气复刻了 10 款经典街机游戏：吃豆人、俄罗斯方块、太空侵略者、贪吃蛇、Flappy Bird、打砖块、小蜜蜂、青蛙过河、涂鸦跳跃和数独。每款都可以直接在线玩，还自带排行榜系统。

![WotAI Games 首页——10 款经典街机游戏合集](images/case-wotai-games.png)

![俄罗斯方块（WotAI Games，Vibe Coding 生成）](images/case-wotai-tetris.png)

![吃豆人（WotAI Games，Vibe Coding 生成）](images/case-wotai-pacman.png)

> 🔗 在线试玩：[games.wotai.co](https://games.wotai.co/) ｜ 开发复盘：[We vibe coded 10 classic arcade games with Claude Code](https://wotai.co/blog/wotai-games-vibe-coded-arcade-classics)

#### 🌸 案例二：零基础者 2 小时做出 2048 风格游戏（Blooming Garden）

日本一位完全不懂编程的开发者 [in0ho1no](https://github.com/in0ho1no)，用 Claude 通过纯对话（Vibe Coding）在 **约 2 小时内** 做出了 2048 风格的「植物花园」游戏 [Blooming Garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/)：同种植物合成升级、华丽的开花特效、粒子动画、排行榜、音效、手机适配……这些功能全部通过自然语言对话完成，没有手写一行代码。

![Blooming Garden 植物合成游戏（100% AI 生成）](images/case-blooming-garden.png)

> 🔗 在线试玩：[in0ho1no.github.io/2025-adhoc-blooming-garden](https://in0ho1no.github.io/2025-adhoc-blooming-garden/) ｜ 源码：[github.com/in0ho1no/2025-adhoc-blooming-garden](https://github.com/in0ho1no/2025-adhoc-blooming-garden)

#### 🌍 案例三：设计师用 AI 做出可在线联机的 3D 游戏（Planet Jumper）

设计师 [Ricardo de Zoete（Hammy）](https://x.com/RicardoDeZoete) 用 OpenAI 的 AI 通过纯对话（Vibe Coding）在 three.js 基础上做出了 [Planet Jumper](https://gamesbyhammy.cloud/play/planetjumper)——一个**3D 多人平台跳跃游戏**：在一个小球状星球表面奔跑、冲刺、跳跃，还能与陌生人在线同场竞技。球形引力、联网同步、跳跃手感这些并不简单的系统，全靠提示词「聊」出来。

![Planet Jumper 3D 多人平台跳跃游戏（Vibe Coding 生成）](images/case-planet-jumper.png)

> 🔗 在线试玩：[gamesbyhammy.cloud/play/planetjumper](https://gamesbyhammy.cloud/play/planetjumper) ｜ 详细介绍：[Planet Jumper: A Vibe-Coded Three.js Multiplayer Platformer](https://www.webgpu.com/showcase/planet-jumper-threejs-multiplayer/)

#### 🎮 案例四：一个人用 Vibe Coding 做了 100 款浏览器游戏（2026）

2026 年 7 月，中文社区开发者 [wangzifan396-wzf](https://github.com/wangzifan396-wzf) 开源了 [mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games)——**用 Vibe Coding 一个人做出并持续打磨的 100 款浏览器小游戏**，全部是零依赖的单 HTML 文件，双击即可运行。玩法覆盖动作、策略、塔防、经营、卡牌、物理、推理、竞速、节奏、棋类和益智等类型，其中不少已经做到了多章节战役、养成系统、存档码跨设备同步的完整产品级深度。整个项目以 MIT 协议开源，在线目录可以直接开玩。

![100 款浏览器游戏在线目录（2026 年 Vibe Coding 开源项目）](images/case-100-games.png)

![《霓虹 2048》：六章 18 节点远征 + 多种模式与工具系统](images/case-100-games-neon2048.png)

> 🔗 在线目录：[wangzifan396-wzf.github.io/mini-browser-games](https://wangzifan396-wzf.github.io/mini-browser-games/) ｜ 源码：[github.com/wangzifan396-wzf/mini-browser-games](https://github.com/wangzifan396-wzf/mini-browser-games) ｜ 创作复盘：[我用 Vibe Coding 做了 100 款浏览器游戏，并把它们全部开源了](https://blog.csdn.net/m0_74023007/article/details/162945755)

#### ⛏️ 案例五：给侄子们做一个《我的世界》复刻版（CraftMine，2026）

2026 年 2 月，开发者 [Trent Sterling](https://tront.xyz/blog/posts/craftmine/) 因为侄子们想玩《我的世界》但没有正版，干脆打开一个空白 HTML 文件，用 Claude Code 通过纯对话做出了 [CraftMine](https://tront.xyz/craftmine/)——一个 **6,820 行、单文件** 的网页版《我的世界》复刻版：46 种方块（还加了 21 种 DOOM 地狱主题方块）、36 种生物（从小鸡到 300 血的泰坦 Boss）、19 种武器（含 BFG 9000）、5 种生物群系、昼夜循环，甚至支持 **P2P 多人联机**。没有任何构建步骤，打开网页就能玩。

![CraftMine：《我的世界》复刻版，6,820 行单文件（Vibe Coding 生成）](images/case-craftmine.png)

> 🔗 在线试玩：[tront.xyz/craftmine](https://tront.xyz/craftmine/) ｜ 开发复盘：[CraftMine: A 6,820-line vibe-coded Minecraft clone in one HTML file](https://tront.xyz/blog/posts/craftmine/)

#### 🍄 案例六：AI 实时生成无限关卡的《超级马里奥》（2026）

2026 年 3 月，一位开发者把开源版《超级马里奥》和 OpenAI 的模型结合，做出了 [AI 版超级马里奥](https://supermario.leanmcp.live/)：既能玩经典的原版关卡，也能让 AI **实时生成新关卡**——在「无限模式」下，AI 会随着你的前进动态生成全新的场景和敌人，实测能连续玩 45 分钟。你甚至可以直接在游戏里用文字让 AI 加敌人、放平台、改主题。

![AI 版超级马里奥：经典、AI 关卡、无限模式三种玩法](images/case-ai-mario-menu.png)

![AI 实时生成的马里奥游戏画面](images/case-ai-mario-gameplay.png)

> 🔗 在线试玩：[supermario.leanmcp.live](https://supermario.leanmcp.live/) ｜ 详细介绍：[OpenAI and Idiomorph Power Infinite Mario Level Generation in Browser](https://www.thenextgentechinsider.com/pulse/openai-and-idiomorph-power-infinite-mario-level-generation-in-browser)

#### 🇨🇳 案例七：国产大模型 Kimi K3 一个提示词做出 3D 游戏（2026）

2026 年 7 月，开发者 [Dr. Josh Simmons](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it) 只给国产大模型 **Kimi K3** 发了一个提示词，就让它做出了一个可玩的第一人称 3D 游戏：在程序化生成的服务器设施里收集数据核心、躲避巡逻无人机、坐货运电梯下三层楼。整个游戏一次生成即可游玩，再通过两轮对话修掉两个 bug 就能顺畅通关，全程花费约 **2 美元**。

![Kimi K3 一个提示词生成的 3D 服务器设施游戏](images/case-kimi-k3-game.png)

> 🔗 在线试玩：[kimi-test-theta.vercel.app](https://kimi-test-theta.vercel.app/) ｜ 源码：[github.com/jcpsimmons/kimi-test](https://github.com/jcpsimmons/kimi-test) ｜ 开发者复盘：[Kimi K3 Built the Game. I Still Had to Play It.](https://www.drjoshcsimmons.com/writing/kimi-k3-built-the-game-i-still-had-to-play-it)

#### 🎯 案例八：Kimi 官方游戏平台 K399——几十款 AI 游戏在线开玩（2026）

2026 年 7 月 17 日，月之暗面发布 Kimi K3 模型后，同步上线了网页游戏平台 [K399](https://www.k399.games/)——里面几十款游戏全部由 K3 模型参与制作，点开即玩。品类覆盖 3D 射击、音游、横版动作、宫斗 AVG、3D 解谜甚至开放世界：既有复刻《塞尔达传说》《黑神话：悟空》《泡泡堂》《吸血鬼幸存者》等经典玩法的作品，也有《先锋练习场》（可移动、跳跃、滑铲、瞄准射击的 3D FPS）、开放世界《SpiderPunk》、五章主线八条支线 32 种随机事件的宫斗 AVG《凤阙深宫》等完成度远超 Demo 的原创游戏。

![K399 平台界面——K3 Game Arcade，游戏列表点开即玩](images/case-k399-platform-live.png)

![K399 上的开放世界游戏 SpiderPunk：在赛博都市高楼间荡蛛丝（K3 模型生成，实际游玩画面）](images/case-k399-spiderpunk.png)

> 🔗 在线试玩：[k399.games](https://www.k399.games/)（K3 Game Arcade，点开即玩）｜ 详细介绍：[前米哈游高管加入，当下最火的 AI 公司突然做了几十个游戏](https://eu.36kr.com/zh/p/3906895998178441) ｜ [Kimi K3，让谁紧张？](https://36kr.com/p/3905392402748801)

看完这些案例你会发现：**贪吃蛇只是 AI 编程能力的冰山一角**。无论是经典街机游戏、2048 拼图、3D 游戏、复刻《我的世界》和《超级马里奥》，还是上百款的游戏合集、甚至国产大模型官方的游戏平台，只要你能把想法说清楚，并愿意多轮对话去打磨，AI 都能帮你从 0 到 1 做出来。接下来，就轮到你啦！

## 📚 Assignment

<el-card id="assignment-card" shadow="hover" style="margin: 20px 0; border-radius: 12px;">
  <template #header>
    <div style="font-weight: bold; font-size: 16px;">🎯 本章作业：完成你的第一批 AI 原生小游戏</div>
  </template>

  <p>
    这一节，你已经跟着步骤体验了从“对话生成贪吃蛇”到“理解 AI 原生小游戏设计思路”的完整流程。下面的作业帮助你把这些理解真正变成自己的能力。
  </p>

  <ol>
    <li>
      <strong>完整复现 AI 原生贪吃蛇游戏</strong>
      <ul>
        <li>至少实现：蛇可以移动、吃到“食物”后长度和分数发生变化、撞墙或撞到自己会结束。</li>
        <li>在复现过程中，练习把错误现象 + 报错信息 + 关键代码片段一次性丢给 AI，请它“小白模式”修复。</li>
      </ul>
    </li>
    <li>
      <strong>（可选）自创 1 个 AI 原生小游戏或 Demo</strong>
      <ul>
        <li>可以是围绕文字、图片、音乐、节奏等的任意轻量玩法，例如“吃单词写诗”“节奏点击”“生成式跑酷”等。</li>
        <li>重点不是画面多炫，而是你能清楚说出：AI 在这里具体帮了什么忙，它解决了什么“人工难以做到或很麻烦”的部分。</li>
      </ul>
    </li>
  </ol>

  <p>
    这就是完整的教程！你可能需要 <strong>4 小时</strong> 才能完成所有内容并构建你自己的贪吃蛇游戏。不要着急——探索、实验并享受这个过程。如果在过程中遇到概念不太理解，推荐你顺手查看下方附录中的相关部分。
  </p>
</el-card>

## 附录

<el-card id="appendix-nav" shadow="hover" style="margin-top: 24px; margin-bottom: 24px; border-left: 5px solid #67C23A;">
  <div style="font-weight: bold; margin-bottom: 8px;">附录导航</div>
  <div style="color: #606266; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
    这里整理了一些和本章相关的基础概念：如果你在学习过程中遇到“前端是什么”“Vibe Coding 到底指什么”等问题，可以随时回到这里查阅。
  </div>
  <el-row :gutter="16">
    <el-col :span="12">
      <a href="#appendix-1" style="text-decoration: none; color: inherit;"><b>附录 1：我们需要前端开发知识吗？</b></a><br/>
      <span style="font-size: 12px; color: #909399">搞清楚前端在整个应用里的位置，知道哪些是“看得见”的部分。</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-2" style="text-decoration: none; color: inherit;"><b>附录 2：到底什么是 Vibe Coding</b></a><br/>
      <span style="font-size: 12px; color: #909399">理解“对话式开发”的核心思路，知道该如何和 AI 配合。</span>
    </el-col>
  </el-row>
  <el-row :gutter="16" style="margin-top: 10px;">
    <el-col :span="12">
      <a href="#appendix-3" style="text-decoration: none; color: inherit;"><b>附录 3：模型上下文</b></a><br/>
      <span style="font-size: 12px; color: #909399">搞清楚“上下文长度”这类常听到却又容易混淆的概念。</span>
    </el-col>
    <el-col :span="12">
      <a href="#appendix-4" style="text-decoration: none; color: inherit;"><b>附录 4：指令遵循能力</b></a><br/>
      <span style="font-size: 12px; color: #909399">了解模型为什么有时“听不懂话”，以及如何写得更清楚。</span>
    </el-col>
  </el-row>
  <div style="margin-top: 12px; font-size: 12px; color: #909399;">
    小技巧：你可以按 Ctrl/⌘+F 搜索关键字，或者把不懂的段落复制给 AI，请它用“完全小白能看懂”的方式再解释一遍。
  </div>
</el-card>

## <span id="appendix-1">[附录 1：我们需要前端开发知识吗？](#appendix-nav)</span>

::: tip 💡 一句话总结
你不需要会写代码，但了解基础概念能让你更好地向 AI 描述需求。
:::

<el-row :gutter="16" style="margin: 20px 0;">
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">👁️</span>
          <span style="font-weight: bold;">前端</span>
          <el-tag type="success" size="small">可见</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        用户能<strong>看到、点到</strong>的所有内容
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>网页标题、文字、图片</li>
          <li>按钮、输入框、下拉菜单</li>
          <li>游戏界面、动画效果</li>
        </ul>
      </div>
    </el-card>
  </el-col>
  <el-col :span="12" :xs="24" style="margin-bottom: 16px;">
    <el-card shadow="hover" style="border-radius: 12px; height: 100%;">
      <template #header>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 20px;">⚙️</span>
          <span style="font-weight: bold;">后端</span>
          <el-tag type="info" size="small">不可见</el-tag>
        </div>
      </template>
      <div style="color: #606266; line-height: 1.8;">
        运行在服务器上的数据处理
        <ul style="margin: 12px 0; padding-left: 20px;">
          <li>用户分数存储</li>
          <li>登录账号验证</li>
          <li>关卡内容分配</li>
        </ul>
      </div>
    </el-card>
  </el-col>
</el-row>

### 前端三件套

把网页想成一间房子，三种"代码"各管一件事：

- **HTML**：管页面上**有什么**——好比盖房先画图纸
- **CSS**：管**长什么样**——好比刷墙、摆家具
- **JavaScript**：管**怎么动**——好比电灯开关，一按就亮

### 代码怎么变成页面？

浏览器**先搭骨架（HTML）、再装修（CSS）、最后通电（JS）**，三步做完，就是网页。

### React / Vue 是啥？

它们是**盖复杂网页的"预制板工具"**——更快、更稳。你不需要会，知道是帮手就行。

### 在 Vibe Coding 中

**不写代码，只描述。** 跟 AI 说人话就行，比如：

> "用 React 做个排行榜：右侧分数列表，点一行下方显示玩家详情，风格简洁现代。"

想深入看看 [Web 基础附录](/zh-cn/appendix/3-browser-and-frontend/javascript-deep-dive) 和 [前端进化史附录](/zh-cn/appendix/3-browser-and-frontend/frontend-frameworks)。

## <span id="appendix-2">[附录 2：到底什么是 Vibe Coding](#appendix-nav)</span>

> 💡 什么是 Vibe Coding？计算机科学家 [Andrej Karpathy](https://karpathy.ai/)（OpenAI 的联合创始人之一，特斯拉前 AI 负责人）于 2025 年 2 月提出了 **vibe coding** 一词。这个概念指的是一种依赖于 LLM 的编码方法，**允许程序员通过提供自然语言描述而不是手动编写代码来生成可工作的代码。**

![1767350588191](images/1767350588191.png)

从字面上看，Vibe Coding 可以理解为一种“用说的方式来做开发”。它的核心变化在于：你不再需要自己一行一行写代码、查语法、调 Bug，而是直接用自然语言描述你想要的东西，例如：

“我需要一个登录页面，上面有手机号输入框和验证码输入框。”
“登录成功后，跳转到首页，并在右上角显示用户名。”
“给我一个简单的贪吃蛇小游戏，可以用键盘方向键控制。”
大语言模型（LLM）会把这类描述自动翻译成真正可以运行的代码，并生成对应的页面、逻辑和数据结构。你看到效果后，再用自然语言提出修改意见，例如“按钮再大一点”“背景换成深色”“得分记录下来并显示排行榜”，AI 会继续按你的要求调整实现。

在这种模式下，你不需要先学会编程语言，再去写代码；而是把主要精力放在：说清楚要做什么、看到结果后判断“哪里不对”、再提出新的修改。AI 则负责把这些高层的想法落成具体实现，从而显著减少机械、重复的编码工作。

你可以点击这里查看更多关于 vibe coding 的细节：[https://www.ibm.com/think/topics/vibe-coding](https://www.ibm.com/think/topics/vibe-coding)

你可以点击这里查看更多关于 Karpathy 的分享内容：[https://karpathy.bearblog.dev/blog/](https://karpathy.bearblog.dev/blog/)

### 如何假装自己是 Vibe Coding 大师

实际上，在真正的 vibe coding 过程中，我们通常不会使用很多复杂的提示词。也许我们在开始时需要为整个程序提供一个具体且适度复杂的提示词，但在那之后的每一步，你可能只需要以下类型的提示词：

```
"代码里有个 bug，请修复它。"
"我不要部分代码，给我完整的修改后的代码。"
"你的代码还是有问题。"
"请再次修改并给我完整的修正后的代码。"
"刚才还能运行，为什么现在不能运行了？"
"你没理解我的意思吗？不要改我原来的代码。"
"不要添加任何调试功能。"
"不要做我没让你做的事。"
"我让你实现的功能在哪里？"
"你听不懂我说的话吗？"
"我只要一个函数。"
"我告诉过你参考我之前的代码。"
"请不要添加不必要的注释。"
"请不要修改我原始代码的基本逻辑。"
"帮我修改代码。"
"基于我的代码修改..."
"不要改我的变量名！！！"
"不要改原来的函数名！"
"不要乱动我的变量。"
"不要添加额外的功能。"
"不要只生成框架，生成完整的代码。"
```

这听起来可能有点夸张，但实际上，这些就是我们在日常工作中可能使用的提示词。由于大语言模型的**上下文长度限制**，或者有时因为它们的**指令遵循能力**不是很强，模型可能会忘记对话早些时候讨论的内容。在 vibe coding 中，我们倾向使用长上下文的模型，并且使用指令遵循能力强的模型，我们可以通过这两者的排行或者指标来判断其是不是好模型。

或者，由于训练数据集的风格，大模型倾向于以其训练数据的风格回答。例如，有些人说话很严肃，有些人喜欢添加很多修饰，而有些大模型喜欢在代码中添加很多注释或不必要的模块。

## <span id="appendix-3">[附录 3：模型上下文](#appendix-nav)</span>

模型上下文可以理解为 AI 的短期记忆。它指的是在当前一次对话或一次任务中，模型能够“看到”和“记住”的所有文本内容，包括你之前输入的问题、系统提供的说明、相关资料等。

正是因为有上下文，AI 才能理解你在接着前面的内容继续提问，才能进行一轮一轮、看起来连贯自然的对话。如果没有上下文，你的每一句话在模型看来都像是一次全新的提问，它无法知道你之前说过什么，也就谈不上延续对话。

每个模型都有自己的有效上下文长度（context window）。这个长度通常用 token（可以粗略理解为“字词片段”的单位）来衡量，目前主流模型大多在 32k～128k token 之间。上下文越长，模型一次能“读”的内容就越多，例如：

- 一次性读完一篇较长的论文或报告
- 在同一轮对话中引用多篇资料、多个案例
- 让模型记住之前几轮的复杂讨论结论

当你输入的内容接近或超过模型的上下文限制时，往往会出现一些常见现象：

- 模型开始遗忘前面长文本中的细节或关键信息
- 对话进行到后面，话题逐渐偏离最初目标
- 对同一材料的不同问答之间，引用的内容不一致

这些现象并不是模型突然“变笨”，而是上下文容量被用满或接近用满后产生的自然结果。

在实际使用中，我们既希望上下文尽可能长，又要意识到：

- 上下文越长，占用的算力资源越多
- 对应的调用成本（费用）也会随之增加

因此，在设计 AI 应用时，需要在让模型看得足够多和控制成本、提升效率之间做平衡。例如：

- 对真正需要长期保留的信息进行提炼后再交给模型
- 对不再需要的细节信息，避免一遍又一遍原样塞入上下文
- 使用外部知识库等方式，把“长期记忆”交给系统，而不是强行塞进模型上下文中

## <span id="appendix-4">[附录 4：指令遵循能力](#appendix-nav)</span>

指令遵循能力指的是：模型在理解你的指令之后，能否准确、完整地按照你的要求执行。它不仅包括能回答问题，还包括能按指定格式、风格、步骤完成任务。

例如，下面这些都是对模型有明确要求的指令：

- 将这篇文章总结为三个要点
- 用正式、礼貌的语气写一封回复邮件
- 把这个词翻译成英文，并各造一个例句
- 从文章中提取作者、时间和主要事件

一个指令遵循能力强的模型，通常具备以下特征：

- 按要求的数量输出内容  
  例如要求总结三个要点，就不会给出五条。
- 覆盖所有指定的要素  
  例如要求提取作者、时间和事件，就不会遗漏其中任何一项。
- 遵守指定的格式和语气  
  例如要求使用正式语气，就不会输出过于口语化的回复。
- 不做不必要的额外延伸  
  例如只要求翻译和造句，就不会额外输出一大段无关解释。

在实际应用中，强指令遵循能力非常重要，原因包括：

- 提高稳定性：同样的指令在不同时间、多次运行时，输出结构和行为模式更加一致，不容易随意发挥
- 提高可复现性：当你把一段提示词配置到产品或流程中时，可以预期模型大致会怎样响应，方便测试和迭代
- 便于系统集成：当模型输出符合预期格式时，更容易与后端程序、工作流或其他工具自动对接

因此，在选择和评估一个大语言模型时，除了关注它是否聪明、知识覆盖是否广之外，还需要特别关注它的指令遵循能力。对于工业级应用来说，能否稳定而准确地执行指令，往往比偶尔给出一次惊艳回答更重要。

<RelatedArticlesSection
  title="继续学习"
  description="从“游戏化体验”出发，推荐你继续进入本地开发与产品实践。"
  :items="relatedArticles"
/>

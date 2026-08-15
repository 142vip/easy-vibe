---
title: '如何学习本课程'
description: '从零开始学习发现问题、验证需求、构建 AI 产品并交付真实用户，逐步成长为能够对产品结果负责的产品工程师。'
---

<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['zh-cn/stage-1/learning-map'] ?? []
</script>

# 如何学习本课程

::: info 特别感谢
本教程的核心贡献者与测试者来自 **清华大学深圳国际研究生院**。感谢同学们在实际学习和操作中不断指出问题、提出建议并参与修改，让教程更清晰、更可靠，也更贴近初学者的真实需要。[**👉 查看完整贡献者名单**](https://github.com/datawhalechina/easy-vibe#-contributing--contributors)
:::

以前做软件，门槛很高：你要学习编程语言、开发工具和大量技术知识，才能把一个想法变成可以运行的程序。大语言模型和 AI 编程工具改变了这件事——人开始可以直接用自然语言描述意图，让 AI 帮助生成代码、搭建界面和修改功能。

## 从 Vibe Coding 到 Build Product

**[Vibe Coding](https://www.merriam-webster.com/dictionary/vibe%20coding) 这个说法出现于 2025 年 2 月 2 日。** AI 研究者 Andrej Karpathy 用它描述一种新的编程方式：人主要通过自然语言告诉 AI 想要什么，观察运行结果，再继续对话和修改，而不必从头手写、理解和管理每一行代码。

> **什么是 Vibe Coding？**
> 简单说，就是“用说话来编程”：描述想法，让 AI 生成程序，运行看看，再通过对话不断调整。

它最先带来的突破，是让更多人跨过了“不会写代码，所以无法开始”的门槛。一个没有编程经验的人，也可以在几分钟内做出小游戏、网页或可以演示的原型。

<figure class="concept-illustration">
  <img src="./images/vibe-coding-to-product.webp" alt="一位创作者借助 AI 将自然语言想法变成产品原型，交给真实用户使用，并根据反馈继续迭代" loading="lazy">
  <figcaption>Vibe Coding 帮助你跨过“做出来”的门槛；Build Product 要继续走向真实用户、反馈与价值。</figcaption>
</figure>

这是一个巨大的变化：**人与计算机沟通的方式，正在从严格的编程语法延伸到自然语言。**

但当“做出一个能运行的 Demo”越来越容易，新的问题就出现了：

- 应该做什么，而不只是能做什么？
- 它为谁解决问题，用户真的需要吗？
- AI 生成的第一版，怎样变成稳定、清楚、可以持续修改的产品？
- 怎样把产品交给用户，而不只是在自己的电脑上运行？
- 怎样通过使用、反馈和付费，证明它确实创造了价值？

因此，Vibe Coding 并没有消除学习要求，而是**改变并提高了要求**。

只看 Coding，目标是让代码运行；真正 Build Product，则要对从问题到结果的完整过程负责：

> **Coding：我能不能把它做出来？**<br>
> **Build Product：它值不值得做，谁会使用，我怎样把它交付出去，又怎样知道它真的有效？**

Vibe Coding 是这门课的起点，但不是终点。我们会先让你快速做出东西，再逐步学习怎样选择问题、验证需求、设计方案、构建产品、接触用户和根据结果迭代。

::: tip 这门课真正想培养什么？
这门课不只是教你使用 AI 编程工具，而是希望帮助你成为一名初步的**产品工程师（Product Engineer）**：能够发现问题、验证需求、亲手构建产品、交付真实用户，并根据结果继续迭代的人。
:::

## 为什么现在需要产品工程师？

你可能会问：“产品工程师”到底是什么？这不是 2026 年才突然冒出来的新头衔。

早在 2018 年，客户通讯公司 Intercom 就提出了 Product Engineer 这个概念，用来描述一种对产品有“所有权”的工程师：不只是照着别人写好的需求文档写代码，而是要真正理解用户的问题，参与讨论产品应该做成什么样，并且持续跟进自己负责的产品上线后的表现。

AI 带来的真正变化，是把“做东西”这件事的门槛大大降低了。以前一个人很难同时搞定原型、界面、前后端、AI 能力集成、测试和部署这一整套工作，但借助大模型和编程 Agent，这些技术边界正在被打破。相应地，公司对工程师的期待也在变化——不只是把代码写完交差，而是要能直接理解用户需求、验证方案是否可行、推动产品被真正用起来，最终对业务结果负责。

### 从“参与产品”到“负责结果”

下面是这条变化的几个真实时间点，都来自公开的招聘信息：

- **2018 年 5月 · [Intercom：Product Engineer](https://www.intercom.com/blog/making-the-transition-from-consultant-to-product-engineer/)**
  工程师不能只埋头写代码，也要懂用户、参与讨论产品该往哪走。

  <figure class="job-screenshot">
    <img src="./images/sources/intercom-product-engineer.png" alt="Intercom 关于 Product Engineer 的文章截图" loading="lazy">
    <figcaption>Intercom 早在 2018 年就提出了 Product Engineer 的概念</figcaption>
  </figure>

- **2026 年 2月 · [Hamilton AI：Product Engineer](https://jobs.ashbyhq.com/hamilton-ai/78c69fe9-828d-44b3-abe6-af56a2badf76/)**
  直接跟客户聊天，从一次对话里挖出需求做出产品，马上给真实用户试用。

  <figure class="job-screenshot">
    <img src="./images/sources/hamilton-ai-product-engineer.png" alt="Hamilton AI 产品工程师招聘截图" loading="lazy">
    <figcaption>2026 年的招聘要求已经覆盖从客户交流到产品验证的完整闭环</figcaption>
  </figure>

- **2026 年 6月 · [Alma：Product Engineer - AI](https://jobs.ashbyhq.com/tryalma/8021fb35-fc1e-4950-a078-afc0e89d9856)**
  一个人搞定 Agent 设计、后端代码、界面开发，还要观察律师和客户实际怎么用。

  <figure class="job-screenshot">
    <img src="./images/sources/alma-product-engineer-ai.png" alt="Alma AI 产品工程师招聘截图" loading="lazy">
    <figcaption>法律科技公司 Alma 要求产品工程师能独立完成从 Agent 到界面的全栈工作</figcaption>
  </figure>

- **2026 年 7月 · [Harper：Product Engineer](https://jobs.ashbyhq.com/harperinsure/7d678dba-885a-4432-94c7-a9c20852db35)**
  要深入销售、客服、承保现场，最终对转化率这类业务指标负责，不只是把功能上线。

  <figure class="job-screenshot">
    <img src="./images/sources/harper-product-engineer.png" alt="Harper 产品工程师招聘截图" loading="lazy">
    <figcaption>保险公司 Harper 要求工程师深入业务一线，直接对转化率负责</figcaption>
  </figure>

- **2026 年 8月 · [Paradigm：Product Engineer, Applied AI](https://jobs.ashbyhq.com/Paradigm/b85b9094-2467-4f49-9a36-ca93da34a3f5)**
  要泡在投资、研究、业务团队里找问题，做内部工具也做开源产品，在实践里找新机会。

  <figure class="job-screenshot">
    <img src="./images/sources/paradigm-product-engineer.png" alt="Paradigm 应用AI产品工程师招聘截图" loading="lazy">
    <figcaption>加密投资机构 Paradigm 要求工程师深入业务团队，既做内部工具也做开源产品</figcaption>
  </figure>

- **截至 2026 年 8月 · [OpenAI：Forward Deployed Engineer](https://openai.com/careers/forward-deployed-engineer-%28fde%29-seattle-seattle/)**
  从找问题、定方案、写代码到部署上线全包，成功标准是用户用不用、有没有真的提升工作效率。

  <figure class="job-screenshot">
    <img src="./images/sources/openai-fde.png" alt="OpenAI FDE 岗位招聘截图" loading="lazy">
    <figcaption>OpenAI 的 FDE 岗位把生产采用率和工作流影响作为核心成功标准</figcaption>
  </figure>

<details>
<summary><strong>查看更多不同行业的真实岗位</strong></summary>

这些案例来自航空、法律、保险、金融合规、生物医药、工业、企业服务和 AI 基础设施等不同领域：

- **2026 年 2月 · [Sphinx：Product Engineer](https://jobs.ashbyhq.com/Sphinx/08bdb9eb-4b6c-44ab-9615-3bb6b908d008)**
  从客户交流中选择机会，快速做原型、测试，再用结果影响产品路线图。

- **2026 年 3月 · [Hyperscale：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/hyperscale/950c982f-5fb9-481b-a6ad-808feba76757)**
  参与技术调研、PoC、现场实施和企业销售，用技术工作帮助赢得客户。

- **2026 年 4月 · [Sphere：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/sphere/7b5f39b0-6f3f-4bc4-9469-74ae9722d85a)**
  从客户发现做到部署，并把客户需求转化成通用产品能力。

- **2026 年 5月 · [Avent：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/avent-industrial-inc/bf8337c2-00cf-4ca7-aa43-b4c29e4b8083)**
  理解客户业务、编写代码、集成系统，对客户成功上线负责。

- **2026 年 5月 · [Tamarind Bio：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/tamarindbio/be678c9b-984e-4a0a-aedc-a87187e18748/)**
  覆盖第一次技术沟通、试点、生产部署和扩展，参与 Demo 与销售周期。

- **2026 年 6月 · [Protege：Forward Deployed Engineer, New Verticals](https://jobs.ashbyhq.com/protege/b62ebf3e-e07f-4f67-bc9c-4787f23fe449/)**
  从早期客户需求中建立新业务方向，把有效做法沉淀进平台。

- **2026 年 6月 · [Dataleap：Founding Forward Deployed Engineer](https://jobs.ashbyhq.com/dataleap/6afe756f-fea9-42fc-82ed-621c72a99387/)**
  进入企业现场寻找重要工作流、构建 Agent、完成集成并教会客户使用。

- **2026 年 6月 · [Collinear AI：Product Engineer](https://jobs.ashbyhq.com/collinear-ai/4d4af6b1-bfc7-4a28-9d86-5bab73e6e396)**
  横跨后端、前端、API、用户体验、测试和线上质量，把复杂 AI 变成可用产品。

- **2026 年 7月 · [Restate：Forward Deployed Engineer](https://jobs.ashbyhq.com/restate/c9419551-7f51-4691-8ba9-d80a27f1e284)**
  负责 PoC、生产就绪和部署，把一次性交付沉淀为可重复模式。

- **截至 2026 年 8月 · [Scale AI：Forward Deployed Engineer, GenAI](https://scale.com/careers/4593571005)**
  直接面对技术客户，完成端到端开发和快速实验，并影响产品路线图。

</details>

### 这些变化意味着什么？

这些变化不只是"公司对工程师要求更高了"这么简单——它同时意味着两件事：**会写代码的人角色在变，不懂代码的人也有了入场的机会。**

#### 对于已经会写代码的人：工程师角色正在重新定义

对比传统的"按需求写代码"的工程师岗位，产品工程师的工作方式发生了明显变化：

- **工作起点变了：** 不再等着产品经理把需求文档写好，而是自己走到用户和业务一线去发现真正的问题。
- **原型的作用变了：** 做原型不只是为了展示技术有多酷，而是尽快交到用户手里，验证你的想法对不对。
- **能力边界变了：** 不再只负责自己那一小块技术模块，而是要能打通界面、后端、AI、部署，甚至关心用户体验好不好用。
- **成功标准变了：** 以前"代码写完、功能上线"就算交差，现在要看产品有没有人用、有没有提升效率、能不能带来转化和收入。
- **和客户的距离变近了：** 越来越多的产品工程师开始直接参与客户演示、PoC（概念验证）和上线支持，用技术实力证明产品的价值。

你可能会担心："还要会销售？" 别紧张，这不是让你去做传统意义上的销售。对产品工程师来说，所谓"会销售"其实是：**能找到可能需要你产品的人，听得懂他们的真实痛点，能演示你的解决方案，邀请他们试用，并且验证他们是否真的愿意持续使用、甚至付费。**

#### 对于零基础、不会写代码的人：这是一扇新打开的门

更重要的是，AI 不仅改变了工程师的工作，也把"做产品"这件事的门槛降到了前所未有的低度。

以前，如果你不会写代码，哪怕有再好的想法，也只能停留在脑图、原型图或者 PPT 里；要做出真正能运行的产品，你必须找到工程师合作，或者自己花几年时间学编程。但现在不一样了：

- **不用先学几年编程：** 你可以用自然语言和 AI 对话，让它帮你写出代码、搭出界面、解决报错，直接做出能跑的东西。
- **行业经验比代码能力更稀缺：** 如果你是老师、医生、律师、销售、运营，或者在某个行业深耕多年，你懂用户的真实痛点、懂业务流程——这些领域知识，恰恰是很多纯工程师欠缺的，也是做出好产品最关键的东西。
- **从"我有一个想法"到"我做出了产品"，距离缩短到几周甚至几天：** 你完全可以自己动手，把你熟悉行业里的某个痛点做成一个小工具，交给真实用户使用，验证它的价值。

这门课就是为这两类人准备的：不管你是已经会写代码、想升级能力边界的工程师，还是完全零基础、但有想法、懂行业的普通人，都可以从这里开始，学会用 AI 把想法变成真正能解决问题的产品。

### Product Engineer、FDE 和 OPC 是什么关系？

你可能还听过 FDE、OPC 这些说法，它们和产品工程师是什么关系呢？简单说，这三个概念是同一套能力在不同范围的应用，但它们不是一回事，也不是必须按顺序晋升的阶梯。

- **Product Engineer（产品工程师）**
  - **是什么：** 产品思维和工程能力融合的岗位
  - **主要在哪里工作：** 在公司内部的产品团队
  - **要对什么结果负责：** 从发现问题、设计方案，一直负责到产品上线、用户反馈和业务指标

- **FDE（Forward Deployed Engineer，前沿部署工程师）**
  - **是什么：** 产品工程能力延伸到客户现场
  - **主要在哪里工作：** 深入企业客户一线，在真实业务环境里工作
  - **要对什么结果负责：** 从发现客户需求、做 PoC、系统集成，一直负责到部署上线、用户采用、后续扩展，有时还会直接参与销售过程

- **OPC（One-Person Company，一人公司）**
  - **是什么：** 一个人主导经营的公司模式，不是岗位名称
  - **主要在哪里工作：** 自己给自己干，借助 AI Agent、自动化平台和外部服务来做产品
  - **要对什么结果负责：** 从找市场机会、做产品，一直负责到营销、销售、交付、客服，甚至现金流

<div class="role-path-figure" role="img" aria-label="产品工程师、FDE 和 OPC 的能力范围逐步从做出产品扩展到客户现场和完整生意">
  <div class="role-path-node">
    <strong>Product Engineer</strong>
    <span>做出正确的产品</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>FDE</strong>
    <span>让产品进入客户现场</span>
  </div>
  <div class="role-path-arrow" aria-hidden="true"></div>
  <div class="role-path-node">
    <strong>OPC</strong>
    <span>经营一门完整生意</span>
  </div>
</div>
<p class="role-path-caption">这不是必须依次晋升的职业阶梯，而是同一套产品工程能力可以覆盖的不同范围。</p>

可以把它们理解成三个逐渐扩大的圆：

> **Product Engineer：把产品做对并做出来**<br>
> **FDE：把产品带进客户现场并产生结果**<br>
> **OPC：用同一套能力经营一门完整生意**

#### FDE：走到客户现场解决问题

很多人会把 FDE 误解成“帮客户装软件的实施人员”或者“只做演示的售前”，其实不是这样。AI 公司的 FDE 通常要从头到尾负责四件事：

1. **找对问题：** 和客户一起聊，找到那个真正值得解决的核心问题，而不是上来就写代码。
2. **快速验证：** 用最短时间做出原型或 PoC（概念验证），证明这个方案既有技术可行性，也能带来业务价值。
3. **落地交付：** 写真正能上生产环境的代码，把方案接入客户的真实数据和日常工作流。
4. **沉淀产品：** 观察客户用得怎么样，把多个客户都遇到的共性需求，沉淀成产品里的通用功能。

截至 2026 年 8 月，OpenAI 已经在全球多个城市招聘 FDE，并且在岗位描述里明确写了：成功标准不是写了多少代码，而是客户的生产采用率、可量化的工作流效率提升，以及从一线带回来、能改变产品和模型路线图的真实反馈。这说明 FDE 这种模式正在从少数企业软件公司的“特殊岗位”，变成 AI 产品落地的重要角色。

#### OPC：一个人也能带一支“数字团队”

这里说的 OPC，不只是法律意义上注册的“一人有限责任公司”，而是指 **One-Person Company 这种工作方式：一个人主导整个业务，尽可能借助软件、AI Agent 和现成的云服务，完成过去需要一个团队才能做完的事。**

但这也不是说什么都不用干，AI 自己就能把公司运转起来——那种“无人公司”目前还不存在。创始人依然要自己判断市场方向、承担风险、接触用户、拍板关键决策；AI 的角色更像是一支你随时可以调度的“数字团队”，帮你写代码、做设计、写文案、分析数据、回复客服。

这种趋势也不是 AI 出现后才有的。独立开发者 Pieter Levels 已经一个人做了很多年，Nomads.com、Remote OK、Photo AI、Interior AI 这些产品都是他独自构建和运营的。AI 只是让这种模式能覆盖的范围更广了——设计、编程、内容、分析、客服这些以前需要不同专业人做的事，现在一个人加 AI 就能搞定，但最终还是要经过真实市场的检验。[查看 Pieter Levels 的项目记录](https://levels.io/projects/)

2025 年，微软在 Work Trend Index 报告里提出了 **Agent Boss** 这个概念，用来描述那些会创建、分配任务给 AI Agent、并管理它们工作的人。这份报告调查了 31 个国家的 31,000 名职场人，数据显示 81% 的企业领导者预计在未来 12～18 个月里，会把 AI Agent 深度融入业务流程。[查看 Microsoft 2025 Work Trend Index](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born)

2025 年 6 月，网站搭建平台 Wix 以约 8,000 万美元收购了自然语言应用开发平台 Base44。Base44 本身不是 OPC，但它透露出一个重要信号：以前需要后端工程师、运维工程师、DBA 多种角色配合才能搞定的数据库、用户认证、部署上线这些事，正在被对话式的工具封装起来，普通人也能搞定。[查看 Wix 收购公告](https://www.wix.com/press-room/home/post/wix-further-expands-into-vibe-coding-with-acquisition-of-base44-a-hyper-growth-startup-that-simplif)

所以，“第一家一人独角兽什么时候出现”目前还是个预测，我们不应该把它当成已经发生的事实。对初学者来说，更实在的变化是：**现在一个人真的可以用更少的钱、更小的团队，更快地验证一个产品想法，甚至经营起一门虽然不大、但真的能赚钱的小生意。**

::: tip 为什么这门课三条路径都讲？
不管你毕业之后是想进大公司做产品工程师、去 AI 公司当 FDE，还是想自己试试做点小生意（OPC），起步要练的基本功都是一样的：发现真实问题、做出最小可用产品、交到用户手里、讲清楚价值，然后根据用户的使用反馈和付费意愿继续迭代。
:::

所以这门课不是在教你几个互不相干的岗位技能，而是在帮你走通一次完整的产品闭环：

> **发现问题 → 验证需求 → 设计方案 → 构建产品 → 交付用户 → 说明价值 → 观察结果 → 持续迭代**

当然，让 AI 写出代码只是第一步。要做出一个真正能用的产品，你还会遇到这些问题：

- 怎么让 AI 写出干净、能维护的代码？
- 怎么把零散的代码拼成一个能跑的应用？
- 怎么让应用真正上线、被人用到？
- 怎么把文本生成、图像识别这些 AI 能力装进你的产品？
- 怎么判断用户是否真的需要它，甚至愿意为它付费？

这些问题将在这门课中找到答案。

不管你是学生、老师、医生、工人，还是任何一位对技术一窍不通的普通人，你都不需要先学几年编程，才能开始制作和验证自己的第一个产品原型。

| 你的身份 | 这门课能帮你 |
|---------|-------------|
| 学生 | 作业、比赛、创业，自己动手做项目，不再求人 |
| 职场人 | 把重复工作自动化，提升效率，甚至开发副业 |
| 产品经理 / 设计师 | 想法不再停留在纸面，能快速做出 Demo 并交给用户验证 |
| 创业者 / 中小企业主 | 低成本验证想法，不用先组建完整团队也能做出 MVP |
| 老师 / 教育工作者 | 制作教学工具、课件、自动化出题，提升教学效率 |
| 医生 / 律师 / 专业工作者 | 把专业流程自动化，打造自己的效率工具 |
| 任何人 | 用 AI 解决生活/工作中的具体问题，让不可能变成可能 |

AI 可以降低实现成本，但真正决定产品价值的，仍然是你能否发现真实问题，并把解决方案交到用户手里。

## 成长路径：从“会用 AI”到“成为产品工程师”

<div class="stage-intro">
  <div class="stage-card">
    <div class="stage-icon">🎮</div>
    <h3>新手入门</h3>
    <p class="stage-role">体验 AI 编程</p>
    <div class="stage-tags">
      <span>贪吃蛇小游戏</span>
      <span>零基础上手</span>
      <span>Vibecoding 初体验</span>
      <span>几分钟生成</span>
    </div>
  </div>
</div>

<div class="stage-grid">
  <div class="stage-card">
    <div class="stage-icon">🛠️</div>
    <h3>第一阶段</h3>
    <p class="stage-role">产品工程师入门</p>
    <div class="stage-tags">
      <span>AI IDE (Cursor/Claude)</span>
      <span>需求验证 & 原型</span>
      <span>接入 AI 能力</span>
      <span>交付真实用户</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">💻</div>
    <h3>第二阶段</h3>
    <p class="stage-role">全栈产品工程师</p>
    <div class="stage-tags">
      <span>Figma 到代码</span>
      <span>Supabase 数据库</span>
      <span>Stripe 支付集成</span>
      <span>Dify 知识库</span>
    </div>
  </div>
  <div class="stage-card">
    <div class="stage-icon">🚀</div>
    <h3>第三阶段</h3>
    <p class="stage-role">AI 产品工程师 / 技术负责人</p>
    <div class="stage-tags">
      <span>Web/小程序/多端</span>
      <span>MCP 高级工具</span>
      <span>RAG & LangGraph</span>
      <span>高级工程师思维</span>
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

.job-screenshot {
  margin: 16px 0 24px;
}

.job-screenshot img {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.job-screenshot figcaption {
  margin: 8px 12px 0;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
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

通过这个完整的学习路径，你将获得：

- **Vibe Coding开发能力：** 熟练使用 vibecoding 思维和 AI 编码工具，将开发效率提升数倍。不再需要死记硬背语法，而是学会如何引导 AI 生成高质量代码。
- **全栈开发技能：** 从 UI 设计到前端实现，从数据库设计到 API 开发，从本地开发到云端部署，掌握现代 Web 应用的完整技术栈。
- **AI 能力集成：** 学会调用各类多模态 AI API，将文本、图像、语音等 AI 能力无缝集成到你的应用中，并通过 RAG 等技术构建智能化产品。
- **产品思维与运营能力：** 从用户研究到需求拆解，从 MVP 设计到产品迭代，从支付集成到用户管理，形成完整的产品开发与运营闭环。

# 学完能做什么？

## 第一阶段：做出你的第一个产品原型

这个阶段适合完全没编程基础，或者只会一点点但不太自信的同学。你不用先学一堆理论知识，而是直接跟着做，在做的过程中学会用 AI 工具写代码。

**学完你能**：
- 用 AI 编程工具独立完成一个网页应用
- 把产品想法变成能点击、能交互的原型
- 给原型加上 AI 功能（比如文生图、智能对话）
- 遇到报错知道怎么排查和解决

简单说，就是能做出一个"能跑、能给别人演示"的东西。

我们可以先通过小游戏感受 AI 编程，然后学会用 AI 编程工具帮你写代码、改报错。接着从简单页面开始，逐步做出能交互的多页面应用，再加上文生图、智能对话这些 AI 功能。最后独立完成一个完整项目，让你的创意能够真正拥有落地的可能。

# 为什么要用项目制来训练？

> **现实世界的挑战**
>
> 原因其实很简单：按照大多数同学现在的状态，直接走入职场，很可能会在真实项目和老板 / 客户的“社会毒打”下寸步难行。现实世界更常见的场景是：

> 你的导师 / 老板：我们要做一个 xxx，目标是达到 yyy 的效果。
>
> 文档？现成框架？详细的需求说明？很多时候都不存在。

真实工作中的许多任务，本质上就是在高度不确定的环境下解决从未见过的问题：需求是模糊的，边界是变化的，没人告诉你标准答案，你需要自己查资料、做实验、搭原型、不断迭代，最后给出一个“能跑、能用、能上线”的解决方案。

这门课想做的，就是在一个相对安全的环境里，提前给你一次“模拟社会毒打”：

- 通过看似有一定难度的项目任务，迫使你练习拆解问题、设计方案、自己寻找资料
- 通过不那么“傻瓜化”的脚手架和代码，让你学会阅读、理解和改造一份中大型代码库
- 通过从创意到上线的完整闭环，让你体验真实产品从 0 到 1 的完整过程

短期来看，这种训练确实比较折磨人；但从长期来看，它会极大提高你在求职和职业发展中的竞争力：你会更能扛事儿，更能在不确定环境中找到突破口，也更有能力把 AI 变成真正落地的产品，而不是停留在“玩玩 Demo”阶段。

# 提问的艺术：AI 时代的必备技能

在 AI 时代，提问也属于一种 “基本功”。同一份代码、同一个报错，**你怎么提问，几乎决定了 AI 能给出怎样的答案**：是泛泛而谈，还是一步一步给出可落地的改法。

**养成好习惯**：把“向 AI 提问”当成日常开发流程的一部分：遇到不懂、卡住的问题就立刻问。

## 为什么这是必备技能？

- **现实很少有完整文档**：更多时候你面对的是不清晰的需求、半成品代码、零散的错误信息
- **AI 是你随身的导师 + 同事**：会提问的人，能把它变成“高质量的结对编程”
- **能力上限由沟通决定**：你越能提供关键信息、越能约束输出格式，答案越可用

**常见误区**：只问一句“为啥报错？”通常只能得到一堆猜测。把上下文补齐，才会得到可执行的方案。

## 如何把信息"喂给"AI：截图 vs 复制粘贴

两种方式都可以，但用途不同：

| 方式         | 适用场景                                  | 关键要求                                  |
| ------------ | ----------------------------------------- | ----------------------------------------- |
| **复制粘贴** | 报错堆栈、日志、代码、配置、API 返回      | 尽量完整，不要只截一行关键字              |
| **截图**     | UI 布局问题、交互异常、工具界面找不到按钮 | 截全屏 + 标注重点区域，最好配一句文字说明 |

::: danger ⚠️ 重要前提
**并非所有 AI 都支持图片输入。** 截图沟通需要 AI 具备多模态能力（即能够理解和分析图片）。目前支持图片输入的 AI 包括：Claude (Anthropic)、GPT-4V/GPT-4o (OpenAI)、Gemini (Google)、以及部分国产大模型如通义千问、文心一言等。

**如果你使用的 AI 不支持图片输入**，截图将无法被识别，此时请改用复制粘贴文字的方式沟通。
:::

## 让 AI “解释得很好”的提示词技巧

如果你不是只要答案，而是要“学会”答案。使用类似下面指令能显著提升解释质量：

> **学习型提问示例**
>
> - “请先用 5 句话讲清楚这个概念，再给几个问题提问我验证我理解对了没。”
> - ”请你详细解释一下这个报错信息，我不理解为什么会报错。”

# 坚持了好久还是搞不定，我想放弃了

也许是你坚持的方法不对。不要一个人在黑暗中硬撑，可以来跟作者和助教们聊聊：把你已经尝试过的方法、遇到的具体卡点、和你目前的心理状态，坦诚地说出来。很多时候，只要稍微调整一下方向、补上一个关键知识点，你就能继续往前走。

# 我觉得教程有的设计不合理

欢迎随时联系作者、提交 issue，或者在群里 / 课堂上直接反馈。我们非常希望和你一起把这套教程打磨得越来越好：哪里不清晰、哪里体验不好、哪里让你白费力气，都可以坦诚指出来。越真实、越具体的反馈，越能帮助后来者少踩坑。

# Reference

- [南京大学 计算机科学与技术系 计算机系统基础 课程实验](https://nju-projectn.github.io/ics-pa-gitbook/ics2025/)

<RelatedArticlesSection
  title="接下来可以学什么"
  description="按“从会用 AI 到会做产品”的路线，继续向前推进。"
  :items="relatedArticles"
/>

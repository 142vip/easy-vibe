---
title: '双钻设计模型'
description: '面向零基础读者的 Double Diamond 入门文章。理解 Discover、Define、Develop、Deliver 四个阶段，避免在问题还没搞清楚时就急着做原型。'
---

<script setup>
import StageAssignmentCard from '@theme/components/StageAssignmentCard.vue'
</script>

# 双钻设计模型

<a id="top-dd"></a>

经过需求分析和用户访谈，我们往往会得到很多材料：不同用户的经历、现有工具的问题，以及若干可能的改进方向。材料变多之后，新的困难是如何取舍。

如果没有区分“理解问题”和“设计方案”，人们很容易一边访谈，一边为自己偏好的功能寻找理由。双钻模型（Double Diamond）用两次发散和收敛将这两类工作分开。

本章介绍 Discover、Define、Develop 和 Deliver 四个阶段，并说明每个阶段的输入、产出和常见错误。

<a id="dd-what"></a>
## [1. 两次发散与收敛](#top-dd)

双钻模型是英国 **Design Council** 推广的设计流程框架。它用两个连续的钻石表示问题空间和方案空间。

每个钻石包含两个过程：

- **发散**：先把视野打开，看更多可能性
- **收敛**：再把范围缩小，做出判断和取舍

整个过程一共四步：

1. **Discover**：广泛了解用户、问题、环境和市场
2. **Define**：从大量信息里提炼出真正值得解决的核心问题
3. **Develop**：围绕核心问题发散多种解决方案
4. **Deliver**：筛选、原型、测试并交付更合适的方案

前两个阶段处理问题空间，后两个阶段处理方案空间。

<figure class="field-figure field-figure--diagram">
  <a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/design-council-double-diamond-wide.png" alt="Design Council 官方双钻图：Discover、Define、Develop 和 Deliver 组成两个相连的钻石" loading="lazy" />
  </a>
  <figcaption><strong>先看原图：</strong>左边的钻石从 Discover 发散到 Define 收敛，右边从 Develop 再次发散到 Deliver 收敛。Design Council 同时指出，这不是只能向前走一次的直线流程；测试中发现问题时，可以回到前面的阶段。图源：<a href="https://www.designcouncil.org.uk/resources/framework-for-innovation/" target="_blank" rel="noreferrer">Design Council</a>，<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

## 2. 为什么要把问题和方案分开

一种常见的产品开发过程如下：

- 想到一个点子
- 觉得这个方向很酷
- 马上开始画原型
- 做着做着发现功能越来越多
- 最后不知道自己到底在解决什么问题

双钻模型将“理解问题”和“设计方案”分开。这样可以检查下列情况：

- 选错了问题
- 误解了用户
- 过早锁定了解决方案
- 把大量时间花在细节打磨上，却没有验证方向

因此，进入下一阶段前应检查：

- 不要因为想法顺手，就默认问题已经成立
- 不要因为方案能做出来，就默认它值得做
- 不要因为原型看起来完整，就默认用户会真的需要

这三句话针对的是同一个错误：把“已经投入了多少”当成“方向是否正确”的证据。原型只能证明团队做出了什么；用户访谈、现场观察和真实使用，才能说明问题是否存在。

<a id="dd-first"></a>
## [3. 第一个钻石：问题空间](#top-dd)

第一个钻石关注的是 **问题本身** ，而不是解决方案。

在这个钻石中，产出是问题定义，而不是产品原型。

### 3.1 Discover：先把问题空间打开

Discover 阶段的核心任务，是 **广泛调研，而不是快速下结论。**

这一步通常会做的事情包括：

- 看用户在真实场景里怎么做
- 访谈潜在用户，了解他们最近一次遇到问题是什么时候
- 观察他们现在怎么凑合解决
- 看竞品和替代方案都在怎么处理
- 收集市场、流程、约束、上下游信息

很多人会误以为 Discover 就是“多看点资料”。其实更关键的是：**你要理解人和场景，而不只是搜一堆信息。**

比如你想做一个“AI 帮忙整理会议纪要”的工具，在 Discover 阶段更应该关注的是：

- 用户开完会后到底哪里最痛苦
- 是记录难，还是整理难，还是同步难
- 他们现在是自己写、让实习生写、录音回听，还是干脆不整理
- 哪些会议场景最需要纪要，哪些根本不需要

这一步最重要的目标不是得出答案，而是 **别太早以为自己已经知道答案。**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-design-workshop.jpg" alt="Creative Commons 可用性研究工作坊现场，墙面贴着按访谈问题整理的大量便签" loading="lazy" />
  </a>
  <figcaption><strong>真实的 Discover 材料会很杂。</strong>Creative Commons 团队在 2018 年的可用性研究中完成了 81 次访谈，并整理了另外 36 次既有访谈。照片里的每张纸对应一个问题，便签记录受访者的回答，圆点用于标记和比较。此时团队先保留差异，还没有急着把材料压成一个答案。照片与案例：<a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>，<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

### 3.2 Define：从一堆信息里提炼出核心问题

如果 Discover 是打开视野，Define 就是开始收束。

Define 阶段要做的，不是把所有观察都保留下来，而是问：

- 真正最值得优先解决的问题是哪一个
- 哪个问题最常出现、最痛、最有价值
- 我们第一版到底只盯住哪一个场景

这一步的核心，是把一个宽泛话题，收敛成一个清晰问题定义。

比如你一开始说：

> 我想做一个提高开会效率的 AI 工具。

到了 Define 阶段，更好的表达可能会变成：

> 我们先解决项目型团队在 30 到 60 分钟协作会议结束后，无法在 10 分钟内输出带待办、责任人和截止时间的纪要这个问题。

这时候问题就开始变清楚了：

- 用户是谁
- 场景是什么
- 卡点是什么
- 成功标准是什么

Define 的本质，就是 **从“问题很多”收敛到“这次先解决哪一个问题”。**

<figure class="field-figure">
  <a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/creative-commons-research-synthesis.jpg" alt="Creative Commons 团队将访谈便签排列、聚类并标记主题的研究归纳墙" loading="lazy" />
  </a>
  <figcaption><strong>Define 不是挑一句最顺耳的话。</strong>同一案例中，团队把 117 次访谈汇总、聚类并寻找重复模式，最后提炼出 9 条洞察。图中的空白、分组和不同颜色，正是从原始回答走向主题和优先级的中间过程。照片与案例：<a href="https://creativecommons.org/2018/09/25/findings-from-the-discovery-phase-of-cc-usability/" target="_blank" rel="noreferrer">Creative Commons</a>，<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>。</figcaption>
</figure>

## 4. 第二个钻石：方案空间

当你完成第一个钻石后，才真正适合进入第二个钻石。因为这时你解决的不是一个模糊方向，而是一个被收敛过的具体问题。

### 4.1 Develop：围绕核心问题发散方案

Develop 阶段的重点，是 **围绕同一个问题，探索多种可能方案。**

注意，这里的发散和 Discover 阶段不一样。

- Discover 的发散，是在探索问题空间
- Develop 的发散，是在探索解决方案空间

比如还是会议纪要这个例子，到了 Develop 阶段，你可以开始想：

- 是做网页工具，还是会议插件
- 是上传录音后处理，还是实时记录
- 是只做摘要，还是重点做待办提取
- 是强调个人效率，还是强调团队同步
- 是给用户自由编辑，还是直接输出结构化模板

这一步很适合脑暴，也很适合和团队一起把方案拉开。

但这里有一个前提：**所有方案都必须服务同一个已定义的问题。**  
如果问题没定义清楚，Develop 很容易又重新变成功能乱飞。

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/develop-idea-board.jpg" alt="Wikimedia Deutschland 设计思维工作坊的方案白板，不同颜色便签被分布在多个候选方向中" loading="lazy" />
  </a>
  <figcaption><strong>Develop 先保留多个答案。</strong>这块白板来自 Wikimedia Deutschland 的设计思维工作坊。候选想法按主题散开放置，还没有被压成一套功能清单。发散的价值不是便签数量，而是让团队在选方案之前真正比较过不同路径。照片：<a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_1.jpg" target="_blank" rel="noreferrer">Corinna Schuster（WMDE）/ Wikimedia Commons</a>，<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

### 4.2 Deliver：选择方案、做原型、测试和交付

Deliver 阶段是第二个钻石里的收敛阶段。

这时你要做的不是继续想更多，而是开始判断：

- 哪个方案最适合当前阶段
- 哪个版本最小但最有用
- 哪些功能必须先做，哪些可以以后再说
- 怎么做原型、测试和小范围验证

很多人以为 Deliver 就等于“上线”。其实它更准确的意思是：**把一个方案变成可测试、可验证、可迭代的东西。**

它可能是：

- 一张低保真流程图
- 一个 Figma 原型
- 一个可运行的 MVP
- 一次小规模用户测试
- 一轮真实反馈后的迭代版本

Deliver 的重点不是“完美交付”，而是 **尽快把方案放进真实环境里验证。**

<figure class="field-figure">
  <a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/paper-prototype-test.jpg" alt="一只手正在纸面原型的输入框中书写，模拟用户与尚未开发的界面交互" loading="lazy" />
  </a>
  <figcaption><strong>可测试，不等于已经写完代码。</strong>纸面原型把界面画在纸上，由参与者点击、填写，研究者再替换下一张页面。它足以检查流程、文字和操作顺序，却避免团队先花几周实现一个可能错误的方向。照片：<a href="https://commons.wikimedia.org/wiki/File:TestingPaperPrototype.jpg" target="_blank" rel="noreferrer">d_jan / Wikimedia Commons</a>，<a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noreferrer">CC BY 2.0</a>。</figcaption>
</figure>

## 5. 四个阶段的区别

现在我们已经分别讨论了四个阶段。下面的图将它们放在同一个过程中。选择一个阶段，并比较它的工作、产出和暂时不做的事情。

<DoubleDiamondNavigator />

## 6. 双钻模型最常见的误区

### 6.1 还没 Discover，就直接 Deliver

这是最常见的一种。很多人刚有想法就开画原型、写 PRD、接模型、做页面。

问题不是你做得不认真，而是你可能根本还没确认问题值不值得解决。

### 6.2 Discover 很久，但始终不 Define

另一种极端是一直调研、一直看资料、一直访谈，却迟迟不敢收敛。

双钻不是让你无限发散，而是提醒你：发散之后必须进入判断和取舍。

### 6.3 Define 之后，又偷偷改问题

很多团队会在 Develop 时因为某个方案更容易做，就反过来修改问题定义，让它适配现有方案。

这很危险。因为你可能不是在解决问题，而是在为自己偏爱的方案找理由。

### 6.4 把 Deliver 误解成“大而全上线”

Deliver 不是说必须把完整产品都做完才算结束。很多时候，一个可以测试的原型、一轮真实用户试用，已经是很好的 deliver。

## 7. 在 AI 产品里，双钻模型怎么用

AI 产品特别容易掉进“能力先行”的坑里，因为模型能力看起来太诱人了。你会很想直接去想：

- 要不要接多模态
- 要不要做 Agent
- 要不要加工作流
- 要不要接语音、图像、联网搜索

但双钻模型会逼你先问：

- 用户到底在哪个环节真的卡住了
- 这个卡点是不是非 AI 不可
- 如果不用 AI，现有办法到底哪里最差
- AI 加进去之后，最核心的进展是什么

这能帮你避免一种常见情况：**能力很强，价值很弱。**

一个实用的顺序是：

1. 在 Discover 阶段观察用户现在怎么处理任务
2. 在 Define 阶段把最痛的一个场景写成一句清晰的问题定义
3. 在 Develop 阶段再去比较哪些 AI 能力最适合服务这个问题
4. 在 Deliver 阶段做一个最小版本，让真实用户测试

## 8. 可以直接套用的双钻模板

如果你正在做自己的产品，可以先按这个顺序往下写：

### Discover

- 我观察到的用户是谁？
- 他们最近一次遇到这个问题是什么时候？
- 他们现在怎么解决？
- 他们最烦、最慢、最不放心的地方是什么？

### Define

- 这堆问题里，最值得优先解决的是哪一个？
- 哪个场景最高频，或者最关键？
- 我们第一版先只服务谁、只解决什么？
- 成功解决后，用户状态会发生什么变化？

### Develop

- 针对这个问题，有哪些可能方案？
- 哪些方案最轻、最快、最容易验证？
- 哪些是必须做，哪些是以后再说？

<figure class="field-figure field-figure--portrait">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_WMDE_Gruppenarbeit_2.jpg" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-group-workshop.jpg" alt="Wikimedia Deutschland 设计思维工作坊中，参与者围桌动手制作方案" loading="lazy" />
  </a>
  <figcaption><strong>Develop 不是坐着等一个好点子。</strong>图中的参与者正在剪裁、摆放和制作，把不同人的想法变成可以讨论的东西。方案越早变得可见，就越容易比较、组合和舍弃。照片：Corinna Schuster（WMDE），<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

### Deliver

- 我们最小可以交付什么来验证这个方向？
- 是流程图、原型，还是 MVP？
- 需要找谁测试？
- 测试后怎样判断要继续、修改还是放弃？

## 9. 一个从零基础也能看懂的例子

假设你想做一个“帮大学生准备求职简历”的 AI 工具。

很多人一开始就会直接进入第二个钻石，开始想：

- 要不要一键美化
- 要不要智能改写
- 要不要自动匹配 JD
- 要不要生成自我介绍

但按双钻模型，更好的过程会是这样：

### 第一个钻石

**Discover**

- 去聊应届生最近一次改简历是什么时候
- 看他们怎么从旧简历改成新版本
- 了解他们最困扰的是“不会写”“不会改”，还是“不会判断好不好”

**Define**

- 最后收敛出一个更具体的问题：
- 不是“大学生不会做简历”
- 而是“第一次投递实习的学生，很难把已有经历改写成贴合岗位的表达，因此拖延投递”

### 第二个钻石

**Develop**

- 想几种方案：模板库、AI 改写、岗位对照、简历评分、案例参考

**Deliver**

- 第一版只做“根据岗位描述改写经历 bullet points”
- 给 5 个学生试用，看他们会不会更快投出第一版简历

你会发现，一旦第一个钻石做扎实，第二个钻石会清楚很多。

<figure class="field-figure field-figure--artifact">
  <a href="https://commons.wikimedia.org/wiki/File:Design_Thinking_Workshop_Prototyp_Mitmach-O-Mat.png" target="_blank" rel="noreferrer">
    <img src="/images/product-discovery/double-diamond/wmde-workshop-prototype.png" alt="Wikimedia Deutschland 设计思维工作坊产出的 Mitmach-O-Mat 手绘原型界面" loading="lazy" />
  </a>
  <figcaption><strong>原型只要足够回答一个问题。</strong>这张工作坊产物没有完整视觉系统，只有欢迎语、行动按钮和一句说明，却已经能拿去观察参与者是否理解下一步。Deliver 的重点是获得反馈，不是先把界面做得像成品。原型：Corinna Schuster / WMDE，<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a>。</figcaption>
</figure>

<a id="dd-ai"></a>
## [10. 在双钻流程中使用 AI](#top-dd)

AI 可以用于整理信息、扩展候选方案和准备测试材料，但不能替代用户证据或项目决策。

### 11.1 在 Discover 阶段，用 AI 先做一轮信息铺垫

在正式访谈和调研前，你可以先让 AI 帮你做一些轻量级问题扫描，比如：

- 市面上常见替代方案有哪些
- 用户在公开社区里最常抱怨什么
- 这个问题常见于哪些场景和人群
- 现有产品通常忽略了什么

这一步不能代替真实调研，但很适合帮你快速搭一个问题地图。

一个很简单的小白输入可以是：

```text
我想做一个帮大学生改简历的工具。
你先别帮我想功能，先帮我看看大家在这个问题上最常遇到什么麻烦。
```

AI 可能输出：

```text
初步问题地图：

1. 不知道该写什么经历
2. 不知道怎么针对岗位修改
3. 改了很多版还是不确定是否够好
4. 需要别人帮看，但不方便总麻烦别人
5. 因为不确定，所以一直拖着不投
```

这种输出的作用不是替你下结论，而是让你更快进入 Discover。

### 11.2 在 Define 阶段，让 AI 帮你收敛问题定义

很多人收集了一堆资料之后，最难的是把问题收成一句真正清楚的话。你可以把调研笔记交给 AI，让它帮你压缩成几个候选问题定义：

```text
下面是我在 Discover 阶段收集到的用户反馈和调研笔记：
[贴上内容]

请你帮我做三件事：
1. 归纳最常出现的问题模式
2. 按问题频率、痛感和可验证性，整理出 3 个值得优先解决的问题
3. 把每个问题写成一句具体的问题定义
```

这样你会更容易进入 Define，而不是一直停留在“问题好多”的状态里。

你甚至可以把输入写得非常简单：

```text
我现在收集到的问题有：
1. 大家不知道简历写什么
2. 大家不知道怎么改
3. 大家总觉得没改好，不敢投

你帮我看看，第一版最适合先解决哪个问题。
```

AI 可能输出：

```text
建议优先解决的问题：

“第一次投递实习的学生，不确定简历是否已经达到可投递水平，因此会反复修改并拖延投递。”

原因：
1. 这个问题更具体
2. 它能解释拖延行为
3. 更容易设计一个小版本去验证
```

这类输出很有用，因为它帮你从一堆模糊问题里收出一个更像 MVP 起点的定义。

### 11.3 在 Develop 阶段，用 AI 发散多个方案

很多人一定义完问题，就只盯着脑子里第一个想到的方案。AI 在这一步很适合帮你强制发散：

```text
我已经定义了一个核心问题：[你的问题定义]
请你不要直接给我一个最终答案，而是从以下角度各提出 2-3 种解决方向：
1. 最轻量的 MVP
2. 最适合验证需求的方案
3. 最适合提高体验的方案
4. 不依赖 AI 的方案
5. 依赖 AI 的方案
最后请对比每种方案的优点、风险和验证成本。
```

这样你就不会太早被单一方案绑住。

一个简单输入可以是：

```text
我现在的问题定义是：
“大学生不确定简历是否已经可以投，所以一直拖着不投。”

请你帮我想 4 种不同解决方案，不要只给我一种。
```

AI 可能输出：

```text
方案 1：简历可投递检查清单
方案 2：根据岗位描述做针对性改写
方案 3：让用户上传简历后给出风险提示
方案 4：提供优秀案例对照，帮助用户判断差距
```

这时你就更容易进入“比较方案”，而不是一上来只盯着 AI 改写一个方向。

### 11.4 在 Deliver 阶段，用 AI 帮你生成原型文案和测试材料

当你进入 Deliver 阶段，AI 非常适合帮你加快这些工作：

- 生成低保真原型里的页面文案
- 整理用户测试脚本
- 生成可对比的多个版本标题、按钮、说明语
- 整理测试后的反馈和问题列表

比如你可以让 AI 帮你生成一个 20 分钟用户测试脚本，或者帮你把 5 个用户反馈归纳成“继续做 / 修改方向 / 暂停”的判断依据。

比如一个最小输入可以是：

```text
我做了一个很简单的原型：
用户上传简历，系统告诉他哪些地方还不适合投递。

请帮我生成一份 15 分钟的用户测试脚本。
```

AI 可能输出：

```text
15 分钟测试脚本：

1. 先请用户描述最近一次投简历经历
2. 让用户独立完成上传简历
3. 观察他是否看得懂反馈结果
4. 询问：这些提示里哪些最有帮助，哪些让你困惑
5. 询问：如果下次投递前，你会不会想再用一次
```

这种输出很实用，因为它能帮你从“我做完原型了”走到“我接下来怎么测”。

### 11.5 让 AI 扮演“阶段守门员”

双钻模型最常见的问题，是人会跳阶段。你可以直接让 AI 充当一个守门员，提醒你现在到底在哪一步：

```text
请你扮演产品流程教练。
下面是我当前的项目状态：[你的描述]
请你判断我现在更像处于 Discover、Define、Develop 还是 Deliver。
并告诉我：
1. 我是不是过早跳到了下一阶段
2. 当前阶段最该补的动作是什么
3. 哪些事情现在先别做
```

这对新手特别有帮助，因为你很容易在“还没想清楚问题时就开始画原型”。

## 11. 小结

- Discover 和 Define 用于形成问题定义，Develop 和 Deliver 用于形成并验证方案。
- 发散用于扩展候选项，收敛用于根据证据做出取舍。
- 问题定义应在方案探索之前完成，但可以根据后续测试结果修正。
- Deliver 的目标是获得可用于学习的测试结果，不一定要交付完整产品。

## 12. 练习

<StageAssignmentCard title="用双钻模型整理你的点子">

  <ol>
    <li>选一个最近想做的点子，分别写下发现、定义、发展和交付四步。</li>
    <li>把真正要解决的问题收成一句话。</li>
    <li>想出三种不同做法，再选择其中一种。</li>
    <li>写下一个可以在一周内做出来的最小版本。</li>
  </ol>

  <p>重点不是记住四个英文单词，而是先把问题想清楚，再决定做什么。</p>
</StageAssignmentCard>

## 延伸阅读

这篇文章主要参考了 Design Council 关于 Double Diamond 的官方资料，适合继续往下看：

- [Design Council: The Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/)
- [Design Council: Framework for Innovation](https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-councils-evolved-double-diamond/)
- [Design Council: History of the Double Diamond](https://www.designcouncil.org.uk/our-resources/the-double-diamond/history-of-the-double-diamond/)

<style scoped>
.field-figure {
  margin: 24px 0 32px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.field-figure > a {
  display: block;
  background: #f4f4f1;
}

.field-figure img {
  display: block;
  width: 100%;
  max-height: 520px;
  object-fit: contain;
}

.field-figure--diagram img {
  max-height: 580px;
  padding: 18px;
}

.field-figure--portrait img {
  max-height: 640px;
  object-fit: contain;
}

.field-figure--artifact img {
  padding: 20px;
  background: #f4f1eb;
  object-fit: contain;
}

.field-figure figcaption {
  padding: 13px 16px 15px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.75;
}

.field-figure figcaption strong {
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .field-figure {
    margin: 20px 0 28px;
  }

  .field-figure--diagram img {
    padding: 8px;
  }
}
</style>

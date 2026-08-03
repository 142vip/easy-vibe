<script setup>
import { relatedArticlesMap } from '@theme/data/relatedArticles'

const relatedArticles = relatedArticlesMap['zh-cn/stage-2/frontend/ui-design'] ?? []
</script>

# 构建第一个现代应用程序 - UI 设计

还记得你第一次刷到一个设计精美的产品页面时的感受吗？明明功能差不多，别人的页面看起来就是更"高级"：配色干净、留白舒服、按钮的圆角恰到好处。你忍不住会想——**"他们是怎么设计出来的？我们能不能也做出这样的页面？"**

这种"想搞清楚别人怎么做"的念头，恰恰是前端设计最好的起点。在动手之前，先回顾一下我们已经掌握的能力：

- 在前几节课里，我们学会了用 NanoBanana 批量生成设计素材，理解了提示词里的"风格"如何影响最终输出；
- 认识了 Figma 与 MasterGo 这些专业设计工具，知道一份设计稿是如何组织起来的；
- 也见识了从设计稿到前端代码的转化流程。

但当你真正要为自己的项目做一个像样的页面时，可能还是会卡住：工具会用，素材能生成，却**不知道"好看"长什么样，更不知道该怎么拆解和模仿一个优秀的页面**。别担心，这节课就专门解决这个问题。

为了帮你把前后内容串起来，可以先思考几个小问题：

1. 一个现代网页通常由哪些区块组成？
2. "好看"是一种主观感受，还是可以被量化的数字（色值、字号、间距、圆角）？
3. 如果让你模仿一个网站的视觉风格，你会从哪里下手？

如果对这些问题还没有清晰的答案，没关系——这正是本节课要教你的。操作中遇到难以理解的步骤，随时对当前页面截图发给大模型询问；大胆尝试，不必害怕出错，每一次尝试都是学习和进步的机会。

::: tip 🎯 核心问题
**面对一款设计精美的 APP 或网页，如何分析它是怎么设计出来的，并借助 AI 设计工具把它临摹到"以假乱真"？**
:::

---

## 本节课你将学到

1. **学会"看"设计**：拿到一个页面，知道该看什么、怎么拆解
2. **掌握入门方法论**：找参考 → 分析 → 临摹 → 到像 → 入门
3. **认识 2 条设计路线**：Figma/MasterGo 与 Claude Design/Open Design（含 UI design Skills）
4. **实战临摹**：挑一个真实网页，从 0 临摹到高还原度交付
5. **沉淀设计系统**：把大厂的设计规范，变成你自己的

::: tip 📚 前置知识
本教程适合已经会用 AI 编程工具（如 Trae）、想为项目补齐前端视觉能力的开发者。若想先建立生图手感，建议先学 [NanoBanana 素材生产](../lovart-assets/)；若想深入设计工具，可结合 [Figma 与 MasterGo 入门](../figma-mastergo/) 学习。
:::

---

## 第 1 章：前端设计入门，从"抄"开始

上一节我们提出了三个问题——页面由哪些区块组成、好看看什么、怎么模仿。这一节先从方法论说起：**前端设计的第一课，不是创造，而是复刻。**

就像学书法先临帖、学画画先画石膏像一样，为什么偏偏是"抄"？

- 设计的"好"是可以被量化的——**色值、字号、间距、圆角、阴影**，全是数字
- 把一套成熟设计逐像素复刻出来，你就被迫搞懂了它背后的每一个决策
- 当你"抄到像"了，下一次遇到类似场景，你就知道"该往哪个方向抄"

![](images/design-reference.jpg)

> 💡 一句话总结：**能临摹出一款好产品，说明你已经具备了前端设计的基本功；能在此基础上做改动，说明你已经出师了。**

### 1.1 为什么临摹是入门最快的方式

有人会担心："我是在抄别人的东西，这样真的能学到东西吗？" 答案是：能，而且是最快的路径。原因在于临摹不是照搬结果，而是**强制自己还原过程**：

- 你会被迫去测量每一个间距，从而理解"留白是怎么制造呼吸感的"
- 你会被迫去查每一个色值，从而理解"这个配色为什么看起来协调"
- 你会被迫去比较每一个层级，从而理解"主次信息是怎么被排出来的"

当你能把一个优秀页面"拆到参数级别"再重建出来，你对设计的理解，已经超过了很多只会"凭感觉"的人。

### 1.2 大厂也在"参考"，这不是秘密

设计师的工作方式天然包含参考：Pinterest 找灵感、Dribbble 看趋势、竞品分析看结构。AI 时代这件事被放大了——因为工具直接把"参考"变成了可执行的能力：

![](images/design-inspiration.jpg)

- Claude Design 可以导入你收藏的参考网站，按它的风格生成初稿
- Open Design 内置了 151 套开源设计系统，一键套用到自己的项目
- 各种 UI design Skill 把"大厂的视觉规范"打包成 AI 可执行的指令

所以你的问题不该是"能不能抄"，而是"**怎么抄得专业、抄得合法、抄出自己的东西**"。

#### 去哪里找参考？先收藏这些网站

参考的第一步是**积累一个"参考库"**。下面这些网站按用途分类，建议全部收藏，按需取用：

| 网站 | 用途 | 适合找什么 |
| :--- | :--- | :--- |
| [Awwwards](https://www.awwwards.com) | 网页设计界的"奥斯卡" | 顶级创意、动效、交互，学"天花板"长什么样 |
| [Recent（原 Godly）](https://godly.website) | 高质量网页灵感合集 | AI、Web3、作品集网站的先锋设计 |
| [Landbook](https://land-book.com) | 落地页设计精选 | 按行业/配色筛选官网、定价页、首屏布局 |
| [Lapa Ninja](https://www.lapa.ninja) | 7300+ 落地页截图库 | 按元素分类查导航、特性展示、客户评价 |
| [Mobbin](https://mobbin.com) | 真实 App 界面库 | 研究 Uber、Notion 等产品的真实页面与流程 |
| [Dribbble](https://dribbble.com) | 设计师社区 | 配色、图标、插画风格与微交互灵感 |
| [Behance](https://www.behance.net) | 完整项目案例库 | 看设计思路、调研过程与完整作品集 |

这些网站长什么样？先睹为快（点击图片可放大）：

![Awwwards — 网页设计的"奥斯卡"](images/site-awwwards.jpg)

![Recent（原 Godly）— 高质量网页灵感合集](images/site-godly.jpg)

![Landbook — 落地页设计精选](images/site-landbook.jpg)

![Lapa Ninja — 7300+ 落地页截图库](images/site-lapa.jpg)

![Mobbin — 真实 App 界面库](images/site-mobbin.jpg)

![Dribbble — 设计师社区](images/site-dribbble.jpg)

![Behance — 完整项目案例库](images/site-behance.jpg)

::: tip 💡 建立自己的参考库
遇到心动的页面，**立刻截图 + 存链接**，按"落地页 / 组件 / 配色 / 动效"分类归档。临摹时直接从这个库里挑目标，比临时上网找快得多。
:::

### 1.3 参考 vs 抄袭：一条清晰的线

| 维度 | 参考（推荐 ✅） | 抄袭（危险 ❌） |
| :--- | :--- | :--- |
| 对象 | 布局结构、视觉风格、设计规范 | 品牌 Logo、专属图标、原创插画 |
| 方式 | 理解后重做，融入自己的产品 | 直接复制素材、代码、图片 |
| 结果 | 像风格，但内容完全不同 | 连文案、配色、素材都一模一样 |
| 风险 | 低 | 版权/商业风险高 |

第 7 章会专门讲版权边界，先记住一句话：**抄"规则"可以，抄"结果"危险。**

---

## 第 2 章：会看，才会设计——拆解一个页面

"抄得像"的前提是"看得懂"。这一章教你一套通用的页面拆解框架。

![](images/page-structure.jpg)

### 2.1 看结构：页面由哪些区块组成

绝大多数现代网页都能拆成 4 大块：

```
┌─────────────────────────┐
│ ① 导航栏 Nav             │  Logo · 菜单 · 登录/CTA
├─────────────────────────┤
│ ② 首屏 Hero              │  主标题 · 副标题 · 主按钮 · 产品图
├─────────────────────────┤
│ ③ 内容区 Sections         │  特性卡片 · 数据展示 · 评价 · 定价
├─────────────────────────┤
│ ④ 页脚 Footer            │  链接 · 版权 · 订阅
└─────────────────────────┘
```

看一个页面时，先别管细节，**先用眼睛画出它的"骨架图"**：哪块是导航、哪块是首屏、中间分了几段、每段几个元素。

### 2.2 看视觉：4 个可量化的要素

| 要素 | 看什么 | 怎么记 |
| :--- | :--- | :--- |
| **色彩** | 主色、背景色、文字色各是什么 | 用取色器直接取 Hex 值 |
| **字体** | 标题/正文用什么字体、几号、多粗 | 浏览器 DevTools 里看 font-family/size/weight |
| **间距** | 区块之间、卡片内部的留白 | 记下常用的 8 / 16 / 24 / 48 px 节奏 |
| **圆角与阴影** | 卡片、按钮的圆角半径与阴影强度 | DevTools 里看 border-radius / box-shadow |

::: tip 💡 前端设计的天然优势
**你是前端开发者，DevTools 就是你的设计分析仪。** 右键 → 检查元素，任何页面的色值、字号、间距、圆角全都暴露无遗。这是设计师梦寐以求、而开发者天生就有的能力。

常见取色工具：Chrome DevTools 的颜色选择器、`color-picker` 类扩展；也可以直接把截图丢给多模态大模型，让它帮你提取设计规范。
:::

### 2.3 看组件：拆出"可复用零件"

把页面拆成一个个组件，每个组件记录它的样式参数：

```text
按钮 Primary Button
- 背景：#4F46E5
- 文字：#FFFFFF，14px / 600
- 圆角：8px
- 内边距：12px 24px
- 阴影：0 2px 8px rgba(79,70,229,0.3)

卡片 Card
- 背景：#FFFFFF
- 圆角：16px
- 边框：1px solid #E2E8F0
- 阴影：0 4px 12px rgba(15,23,42,0.08)
```

拆完 3-5 个页面，你手里就有了一份"组件样式库"——这就是你自己的设计系统雏形。

### 2.4 把"看到的设计"翻译成"AI 听得懂的话"

临摹到 AI 工具里，你需要把视觉翻译成结构化描述。**看得越细，翻译得越准，AI 抄得越像。**

```text
参考这个落地页的风格，帮我做一个同构的页面：
- 结构：导航 + 首屏(Hero) + 3 个特性卡片 + 定价区 + 页脚
- 配色：主色 Indigo #4F46E5，背景 #F8FAFC，文字 #0F172A
- 字体：标题 Space Grotesk 700，正文 Inter 400
- 间距：区块 96px，卡片内 24px，栅格 24px
- 圆角：卡片 16px，按钮 8px
- 阴影：0 4px 12px rgba(15,23,42,0.08)
```

---

## 第 3 章：AI 时代的前端设计工具全景

"他们是怎么设计出来的？"答案越来越多元。以下是 2 条典型路线，覆盖从"手动精细控制"到"对话式自动生成"。

![](images/ai-design.jpg)

### 3.1 路线一：Figma / MasterGo——专业设计稿工具

如果你要的是**可编辑、可协作、像素级可控的设计稿**，用 Figma（国际主流）或 MasterGo（国产，上手更轻）：

- 在画布里搭布局、调组件、做交互原型
- 通过 Figma Make / MasterGo AI 等能力辅助生成与批量调整
- 最终交给前端按设计稿实现，或通过插件转代码

![Figma 编辑器：左侧图层面板、中间画布、右侧属性面板](images/figma_editor.jpg)

![MasterGo 编辑器：国产云端设计工具，与 Figma 类似的画布布局](images/mastergo_editor.jpg)

> 适合：需要严格设计稿交付、团队协作、复杂交互的场景。工具操作详见 [Figma 与 MasterGo 入门](../figma-mastergo/)。

### 3.2 路线二：Claude Design / Open Design——对话式设计画布

这类工具的共同点是**用自然语言直接生成可交互的设计原型**，而不是静态图片。代表工具是 Claude Design 与它的开源平替 Open Design。

#### Claude Design：官方对话式设计画布

Claude Design 是 Anthropic 推出的 AI 设计产品（入口 `claude.ai/design`）：

- 输入一句话需求，默认产出 3 个设计变体，覆盖落地页、线框图、演示文稿等
- 支持导入设计系统（GitHub 仓库、Figma 导出、网站截图、品牌文件），自动提取颜色/字体/组件
- 在画布内直接评论修改、拖拽微调，最终导出 HTML / PDF / PPTX，或交接给 Claude Code 实现为真实代码

**典型使用场景：**

**① 从参考截图直接复刻高保真页（最常用）**

输入产品描述与风格参考，Claude 自动生成完整落地页——左侧对话记录 prompt 和生成过程，右侧画布实时渲染结果。

```text
Create a high-fidelity landing page designed to raise $500,000 from angel investors
for "雾屿咖啡 Mist Island Coffee" - a boutique specialty coffee shop that combines
premium coffee, quiet workspaces, and warm community events.
Tone should feel warm, premium, calm, and trustworthy - think a mix of Blue Bottle
Coffee + Apple Store + minimalist lifestyle design.
```

![Claude Design 实际生成：雾屿咖啡高保真落地页，左侧对话+进度，右侧画布渲染完整 Hero 区](images/claude_case_landing.jpg)

**② 默认产出 3 个设计变体，选方向再精修**

Claude Design 不是只给一个答案，而是默认生成多个方向供你挑选——编辑器风、博物馆风、Zine 风等，点进去再细化。

![实际案例：PCWorld 记者让 Claude 解释 AI Tokens 概念，返回 Editorial / Museum / Field Notes 三种风格供选择](images/claude_case_variants.jpg)

**③ 生成可交互原型（不只是静态图）**

生成的页面是真正可点击、可输入的 HTML——按钮有 hover 效果，表单能输入，数据会实时计算。

![实际生成的 Token 科普页：内置实时分词器，输入句子后色块高亮显示每个 token，底部统计字符/词/token 数](images/claude_case_interactive.jpg)

**④ 做产品演示文稿/PPT**

不仅能做网页，还能生成完整的幻灯片（多页、带导航、可导出 PDF/PPTX）。

![实际生成：咖啡品牌 Pitch Deck，左侧列出 13 页大纲，右侧渲染当前幻灯片内容，底部可翻页](images/claude_case_slide.jpg)

**⑤ 生成动画视频**

通过 "From template" 可以创建带动画的 HTML 视频——分镜脚本 + 实际渲染的动画画面，有播放控制条。

![实际生成：45秒咖啡制作动画视频，左侧列出分镜时间表，右侧画布播放动画（咖啡豆→烘焙→冲泡）](images/claude_case_video.jpg)

**⑥ 迭代已有设计（直接在画布上评论）**

生成原型后，不用重新写 prompt，直接点 Comment 按钮圈选元素写评论，Claude 会局部修改。

![画布上点击 Comment 按钮，圈选任意元素后弹出评论框，写"Suggest to Claude"即可局部迭代](images/claude_case_comment.jpg)

**⑦ 移动端 App 页面设计**

支持指定设备尺寸（如 iPhone），生成带设备外框的移动端 UI 原型。

![实际生成：板球计分 App（Tracket）移动端界面——深色 Header + 比分显示 + 操作按钮，针对户外阳光场景做了高对比度设计](images/claude_case_mobile.jpg)

![Claude Design 画布总览：左侧对话，右侧 Tweaks 面板可实时调整主题、断点、颜色等参数](images/claude_design_canvas.jpg)

> 适合：没有设计背景、想跳过 Figma 学习曲线、快速拿到可交互原型的人。

#### Open Design：Claude Design 的开源平替

如果你不想订阅、或更看重数据隐私，可以试试 Open Design（nexu-io 开源项目）。它与 Claude Design 是同一路线：**对话式生成设计原型**，区别在于**本地优先、BYOK（自带模型 Key）、不绑定任何 Agent**。

它有两个核心概念：

| 概念 | 说明 | 对你的价值 |
| :--- | :--- | :--- |
| **Skills（技能）** | 16 个指令型设计技能（文案、配色、创意指导、头脑风暴…） | 一个技能 = 一个专业任务模板 |
| **Templates（模板）** | 288 个可运行模板（原型、幻灯片、动效…），都带 `example.html` | fork 下来换数据就能交付 |
| **Design Systems（设计系统）** | 151 套可移植的设计系统（色板、字体、动效、文风） | 一句话套用大厂视觉规范 |

它会检测你本地的编码 Agent（Claude Code、Codex、Cursor、Qwen、Kimi 等，官方称支持 21 种）作为"设计引擎"——**你现有的 Agent 就是设计师**。此外，Claude Code 等工具生态里的 **UI design Skill**（如 frontend-design）也能把设计规范打包成 AI 可执行的指令，让 AI 按规范输出。

**典型使用场景：**

**① 新建项目：选 Skill + 设计体系 + 精度**

创建原型时，可以选择线框图或高保真，指定目标平台（响应式 Web / 移动端等），并从内置的 150+ 设计体系中挑选一套作为视觉基础。

```text
用 Open Design，套用 Linear 的设计系统，生成一个 SaaS 产品的落地页 HTML
```

![Open Design 新建原型对话框：中文界面，可选原型/幻灯片/媒体，切换线框图/高保真，选择设计体系和目标平台](images/od_case_create.jpg)

![Open Design 内置 150+ 套设计系统（Agentic、Airbnb、Airtable、Linear、Stripe、Vercel…），按类别分组，每个都有色板预览和说明](images/od_case_designsystems.jpg)

**② Studio 工作区：对话驱动，实时生成**

左侧是对话面板（显示 AI 的思考步骤、Todo 列表、Write 操作），右侧是 iframe 画布实时渲染生成结果——和 Claude Design 类似，但底部显示本地正在调用哪个 CLI Agent（如 Claude Code、Codex、deepseek 等）。

![Open Design Studio 工作区：左侧 Chat 面板显示生成计划和进度，右侧画布渲染出"Open Design"大字封面页（幻灯片模式），顶部可切换 Preview/Source/Comment/Edit](images/od_case_studio.jpg)

**③ 套用设计系统生成幻灯片/PPT**

选择 Slide deck 类型，输入主题即可生成完整多页幻灯片。下图是社区用户用 Open Design 生成的中文演讲幻灯片。

![真实用户案例："一人公司 · 被 AI 折叠的组织"演讲幻灯片封面——深色背景、衬线大字标题、演讲者信息、底部页码导航](images/od_case_deck.jpg)

**④ 生成高保真移动端 App 原型**

支持多屏同时预览，自动生成 iPhone 设备外框，Tab 栏、卡片布局、进度条等组件一应俱全。

![真实生成案例：游戏化生活管理 App（Level）——3 屏并排预览，包含每日任务首页、任务分类仪表盘、任务详情页，浅色模式，彩色卡片](images/od_case_mobile.jpg)

**⑤ 用 UI design Skill 规范化 AI 输出**

给 Claude Code / Cursor 装上 frontend-design 这类 Skill，AI 写页面时自动遵循设计规范：

```text
# 在 Claude Code 里调用
/frontend-design 帮我实现一个登录页面
→ 自动按 Skill 内置的设计规范输出：
   - 颜色：主色 #4F46E5，成功 #10B981，错误 #EF4444
   - 间距：8px 基准网格
   - 组件：符合无障碍标准的 Button / Input / Form
   - 响应式：移动端 / 平板 / 桌面三端适配
```

**⑥ 本地私有项目不出网**

公司内部项目、含敏感数据的产品设计，所有文件都在本地处理，模型可走本地部署或 BYOK：

```text
# 本地启动 Open Design，模型走本地部署的 Qwen
OPENAI_API_KEY=your-local-key OPENAI_BASE_URL=http://localhost:8000/v1 \
opendesign
# 所有设计文件保存在本地 ~/.open-design/，不经过任何第三方服务器
```

![Open Design 主界面：选择 Skill（原型/幻灯片/图片/视频等）+ 输入需求即可生成，本地 CLI Agent 自动作为引擎](images/opendesign_home.jpg)

> 适合：注重数据隐私、已有编码 Agent、想完全掌控设计流程的开发者。

### 3.3 两条路线怎么选

| 对比项 | 路线一：Figma / MasterGo | 路线二：Claude Design / Open Design |
| :--- | :--- | :--- |
| 定位 | 专业设计稿工具 | 对话式 AI 设计画布 |
| 代表工具 | Figma、MasterGo | Claude Design（官方）、Open Design（开源平替） |
| 产出 | 可编辑设计稿 | 可交互 HTML 原型 |
| 上手难度 | ⭐⭐ 中 | ⭐ 低 |
| 成本 | 免费版可用 | Claude Design 需订阅；Open Design 开源免费（BYOK） |
| 适合 | 严谨交付与协作 | 快速原型验证、隐私优先 |

::: tip 💡 现实中的组合用法
**参考 → 设计 → 交付** 全程可以混用：用 Claude Design / Open Design 快速出方向和原型 → 定稿后导入 Figma/MasterGo 精修 → 交接给 Claude Code 写成代码。每条路线取长补短。
:::

![](images/design-tools.jpg)

---

## 第 4 章：实战一：把"别人的网页"临摹到像

目标很具体：**选一个你喜欢的真实网页，临摹到"像"。** 这里以落地页为例。

![](images/design-workspace.jpg)

### Step 1：选定目标

选一个结构清晰、你有兴趣的落地页（SaaS 官网、产品介绍页都行）。保存它的截图和链接。

### Step 2：用第 2 章框架拆解

在浏览器里右键 → 检查，按 4 步记录：

```text
目标：某 SaaS 官网落地页
① 结构：导航(Logo/菜单/CTA) → Hero(标题/副标题/按钮/截图) → 3 特性卡片 → 定价(3 档) → 页脚
② 色彩：主色 #0F172A 深色，强调 #6366F1，背景 #FFFFFF / #F8FAFC
③ 字体：标题 Inter 800 48px，正文 Inter 400 16px
④ 组件：按钮 圆角 8px/实色，卡片 圆角 16px/浅灰底/无边框
```

### Step 3：喂给 AI 设计工具，生成第一版

把拆解结果丢给 Claude Design / Open Design，让它按这套规范生成：

```text
按以下设计规范生成一个同构落地页：
[粘贴 Step 2 的拆解记录]
产品：我的项目（一句话说明用途）
要求：像素级遵循上面的色彩、字体、间距、圆角规范
```

第一版通常是"神似而形不似"——结构对，细节有偏差。**这不叫失败，这正好告诉你接下来该调哪里。**

### Step 4：逐区块对照，迭代修改

把参考截图和生成结果并排，逐区块对照，用"修改指令"逼近：

| 发现的问题 | 修改指令 |
| :--- | :--- |
| 主色偏亮 | "把主色改为 #0F172A，强调色 #6366F1" |
| 按钮圆角不对 | "所有按钮统一 8px 圆角、实心背景" |
| 间距太挤 | "区块间距改为 96px，卡片内边距 24px" |
| 字体不对 | "标题改用 Inter 800，正文 Inter 400" |
| 多了装饰元素 | "去掉背景装饰，只保留核心内容" |

### Step 5：验收标准——"像"

怎么判断自己入门了？给自己设一个客观标准：

- [ ] 截两张图：原网页 vs 你的临摹版
- [ ] 把两张图并排放大，逐像素对比
- [ ] 色值、字号、间距、圆角**肉眼看不出版式差异**
- [ ] 缩到 50% 再对比，依然分不清哪个是原版

> 💡 **"像"不是目的，是手段。** 临摹 2-3 个风格完全不同的网站后，你会自然积累一套"设计手感"：什么时候该大留白、什么时候该高饱和、什么时候圆角要收敛。这时候再临摹新页面，速度会快得多。

---

## 第 5 章：实战二：从设计到代码

临摹出的设计稿/原型，最终要变成产品里的真实页面。两条交接路径：

![](images/design-to-code.jpg)

### 5.1 路径 A：AI 设计工具 → 前端代码

- **Claude Design**：在画布定稿后，用 `/design-sync` 同步到 Claude Code，从设计直接续写代码，不必从截图重来
- **Open Design**：可直接导出 HTML，再交给 Agent 改造成项目组件
- **Figma/MasterGo**：通过插件或 MCP 导出 React / Vue 代码

### 5.2 路径 B：截图 → 多模态大模型还原

最简单：把临摹好的设计截图直接丢给多模态大模型，"还原成 React 组件"，逐区块落地。

> 三种"设计转代码"路径的详细对比，见 [从设计原型到项目代码](../design-to-code/)。想要组件级的工程化提效，可再看 [使用现代组件库更新你的界面](../modern-component-library/)。

---

## 第 6 章：把大厂的设计系统变成自己的

临摹 3 个页面后你会发现：**好看的页面背后都有一套稳定的"设计系统"**。与其自己从 0 造，不如站在巨人肩膀上。

![](images/design-system.jpg)

### 6.1 什么是"可移植的设计系统"

Open Design 把设计系统做成 `DESIGN.md` 文件（Linear、Vercel、Stripe、Apple、Cursor、Figma…），Claude Design 则从你的代码仓库/设计文件自动提取。它们本质都是同一件事：

```text
DESIGN.md  =  颜色 Token + 字体规范 + 间距节奏 + 组件样式 + 使用约定
```

一个真实的示例结构：

```markdown
# Design System: Linear

## Colors
- background: #08090A
- primary: #5E6AD2
- text: #F7F7F8

## Typography
- heading: 22px / 600, letter-spacing -0.4px
- body: 14px / 400

## Radius
- card: 8px
- button: 6px

## Spacing
- 4 / 8 / 12 / 16 / 24 / 32 px

## Do / Don't
- Do: 大量留白，克制用色
- Don't: 不使用渐变、不使用阴影堆叠
```

### 6.2 三步建立自己的设计系统

1. **选基底**：套用一个你认可的大厂设计系统（如 Linear 的克制暗色、Apple 的留白）
2. **改参数**：替换主色为你的品牌色、调整圆角与间距
3. **沉淀成文件**：保存为 `DESIGN.md` 或 Skill，让 AI 每次生成都自动遵守

### 6.3 进阶：用 UI design Skill 固定风格

把设计系统封装成 Skill 后，一句话即可调用：

```text
使用 my-brand skill 的设计规范，生成 3 个功能页面的首屏方案
```

创建与使用 Skill 的方法，详见 [用 LLM 和 Skills 让界面变好看](../llm-skills-beautiful/)。

---

## 第 7 章：版权与伦理

临摹能力越强，越要守住边界：

![](images/copyright.jpg)

**抄规则，不抄结果。** 布局、配色、间距这些"规则"可以学习；Logo、图标、插画、文案等"结果"不要直接复制。

**商用项目要谨慎。** 商业交付前确认：素材版权、字体授权（商用字体需购买）、参考网站的使用条款。

**AI 生成内容的归属。** 不同平台（Claude Design、Open Design 等）条款不同，商用前查看服务协议。

**标注 AI 参与。** 部分平台/法规要求公开内容由 AI 生成。

**最终把关。** 品牌标识、广告物料等敏感场景务必人工审核。

::: tip 💡 建议
学习与原型阶段放开临摹；**进入商业交付时，把"参考"变成"自己设计系统的再创作"，并保留生成记录**。
:::

---

## 总结

这一章把"前端设计入门"落到了可执行的路径上：

1. **心态**：前端设计入门从"抄"开始，抄规则、不抄结果
2. **看**：用结构(4 大块) + 视觉(色彩/字体/间距/圆角) + 组件 三层拆解任何页面，DevTools 是你的分析仪
3. **工具**：2 条路线——Figma/MasterGo（精细设计稿）、Claude Design / Open Design + UI design Skills（对话式原型）
4. **临摹**：选目标 → 拆解 → 生成 → 逐区块迭代 → 像素级对比验收
5. **沉淀**：把大厂 DESIGN.md 改造成自己的设计系统，再用 Skill 固定下来

::: tip 💡 下一步行动
今天就完成一次完整的临摹练习：
1. 找一个你想"抄"的落地页，用 DevTools 拆出它的色彩/字体/间距/圆角
2. 用 Claude Design 或 Open Design 生成第一版，逐区块修改到"像"
3. 把定稿交给 AI 变成代码，并顺手保存一份自己的 DESIGN.md
:::

<RelatedArticlesSection
  title="相关文章"
  description="继续深入 AI 设计、素材生产与设计转代码实战。"
  :items="relatedArticles"
/>

---
title: '从真实工作流里找 AI 场景'
description: '基于 60 余份咨询、券商、行业研究与产品案例，拆解已经发生在企业和消费者身边的 AI 应用场景。'
---

# 从真实工作流里找 AI 场景

很多“AI 行业应用大全”看起来很热闹：金融、医疗、教育、制造，每个行业下面再列十几个点子。可真要动手时，你还是不知道该找谁、接什么数据、替掉哪一步，也不知道做完以后谁会愿意付钱。

问题在于，**行业不是场景**。“AI + 医疗”只是一个范围；“医生看诊后要花十分钟补病历，系统先根据医患对话起草记录，再由医生确认”才是一段可以研究、设计和验证的工作流。

这篇附录换一种写法。我们查阅了 60 余份咨询公司、券商、研究机构报告和产品案例，不再追求把行业列全，而是挑出已经有人使用、也能看见价值落点的 B 端和 C 端场景。你可以把它当成一张地图，用来找到值得继续访谈的问题，不要把它当成现成的创业答案。

<div class="research-note">
  <div>
    <span class="research-note__eyebrow">先记住这句话</span>
    <strong>B 端从工作流里找阻塞，C 端从一天里找反复发生的时刻。</strong>
  </div>
  <p>前者要说清谁在工作、经过哪些系统、最后由谁负责；后者要说清用户为什么会回来，以及 AI 比搜索、模板或人工服务究竟少了哪一步。</p>
</div>

## 先分清：B 端和 C 端不是两套标题

### B 端：企业为结果付钱

企业很少为“能聊天”本身买单。它购买的通常是更短的处理时间、更少的返工、更稳定的合规质量，或者更多成交。一个可研究的 B 端场景，至少要能回答四件事：谁每天在做、材料从哪里来、结果写回哪个系统、出错后谁负责。

这也是为什么不少企业试验迟迟没能扩大。Deloitte 对 2,773 名企业管理者的调查显示，很多组织仍只有少量生成式 AI 试验能进入规模化阶段；Accenture 对 2,000 多个项目的复盘也发现，真正产生企业级价值的组织仍是少数。难点往往不是模型能不能回答，而是它有没有进入完整流程。[Deloitte：State of Generative AI in the Enterprise](https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html) · [Accenture：Making Reinvention Real with Gen AI](https://www.accenture.com/us-en/insights/consulting/making-reinvention-real-with-gen-ai)

### C 端：用户为一个更轻松的时刻付钱

C 端产品不需要接入十套企业系统，但它要面对更直接的选择：用户随时可以关掉 App。好的消费场景通常贴着一个明确时刻出现——准备旅行、比较商品、练口语、做一张海报、整理账单。它先帮用户完成一件事，再慢慢记住偏好。

Capgemini 对 12,000 名消费者的调查里，生成式 AI 已经进入商品发现和比较；QuestMobile 的国内数据也显示，AI 应用正在从独立聊天工具进入搜索、办公、影像、音乐等已有产品。机会不只在“再做一个聊天框”，而在把对话接到下一步动作。[Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/) · [QuestMobile：2025 中国移动互联网春季报告](https://www.questmobile.cn/research/report/1919961024158601218/)

## B 端：八段已经在发生的工作

下面每一节都从一个具体岗位开始。读的时候，别急着抄产品名，先看清楚：原来的工作为什么慢，AI 接住了哪一步，还有什么必须留给人。

### 1. 客服不是“回答问题”，而是把一件事处理完

<figure class="product-shot">
  <a href="https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/" target="_blank" rel="noreferrer">
    <img src="./images/products/klarna.webp" alt="Klarna AI Assistant 的延期付款、多语言客服与退款解释界面" loading="lazy" />
  </a>
  <figcaption><strong>Klarna AI Assistant：</strong>左边不是一句“请联系人工”，而是直接给出延期付款入口；右边把退款金额逐项拆开。客服 AI 真正有用的地方，是能查到这笔订单并把动作接下去。</figcaption>
</figure>

**谁在做：** 一线客服、坐席主管和售后运营。

客户说“我的退款怎么还没到”，客服要先确认身份，再去订单、支付和物流系统查状态，解释规则，必要时创建工单。真正耗时的不是写一句礼貌回复，而是在多个系统之间找齐上下文。

Klarna 的 AI 助手已经能处理退款、退货和多语言客服；ResultsCX 的案例则把语音分流、账户查询和后台 API 连在一起。两者都说明，能产生价值的不是 FAQ，而是**查到状态—按规则处理—留下记录—必要时转人工**这一整段。[Klarna 客服案例](https://openai.com/index/klarna/) · [ResultsCX 客服案例](https://aws.amazon.com/solutions/case-studies/resultscx/) · [Salesforce：State of Service 2025](https://www.salesforce.com/news/stories/state-of-service-report-announcement-2025/)

如果你第一次做，可以只接“人工接待之后”的部分：自动生成会话小结、识别客户诉求、带出相关规则和建议动作，由客服确认后写入工单。这样既能测出节省了多少时间，也不会一开始就把退款权限交给模型。

<div class="scene-check">
  <span>值得追问</span>
  <p>客服最常切换哪几个页面？什么问题看似重复，实际要根据订单状态做不同处理？转人工时，下一位客服还要重新问一遍吗？</p>
</div>

### 2. 销售最缺的不是文案，是下一步该跟谁谈什么

<figure class="product-shot">
  <a href="https://openai.com/index/morgan-stanley/" target="_blank" rel="noreferrer">
    <img src="./images/products/morgan-stanley.webp" alt="Morgan Stanley AI@MS Assistant 内部界面" loading="lazy" />
  </a>
  <figcaption><strong>Morgan Stanley AI@MS Assistant：</strong>顾问可以查询开户文件和案例状态；页面底部同时写明“仅限内部使用”和需要人工核验。它更像嵌进工作台的检索入口，而不是替顾问做决定的聊天机器人。</figcaption>
</figure>

**谁在做：** B2B 销售、客户经理、售前和销售主管。

一次客户会议结束后，销售往往要补 CRM、整理决策人、回顾异议、找案例、写跟进邮件，再决定什么时候联系。记录散在会议录音、聊天、邮箱和个人笔记里，主管看到的 CRM 经常已经过时。

McKinsey 对 B2B 销售的研究把应用拆到完整交易周期：寻找线索、准备会面、辅助沟通、生成方案、推进成交和续约。Morgan Stanley 的财富顾问工具也不是替顾问做投资决定，而是让他们快速检索内部知识，并把客户会议整理成笔记和待办。[McKinsey：Unlocking Gen AI in B2B Sales](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/unlocking-profitable-b2b-growth-through-gen-ai) · [Morgan Stanley 案例](https://openai.com/index/morgan-stanley/)

第一版可以只解决“会后十五分钟”：从录音中提取客户目标、异议、承诺和下一步，生成一封可修改的跟进邮件，同时把字段补进 CRM。衡量它有没有用，不看生成了多少字，看 CRM 是否更完整、跟进是否更及时。

### 3. 公司知识库真正要解决的是“这一次该按哪条办”

<figure class="product-shot">
  <a href="https://www.notion.com/help/guides/find-answers-and-generate-reports-with-enterprise-search" target="_blank" rel="noreferrer">
    <img src="./images/products/notion-enterprise-search.png" alt="Notion Enterprise Search 企业搜索界面" loading="lazy" />
  </a>
  <figcaption><strong>Notion Enterprise Search：</strong>同一个问题可以跨 Notion 与 Slack 查找，用户还能在 Ask、Research 和 Build 之间切换。企业知识助手的产品形态，重点是接入现有资料和权限，而不只是上传一份 PDF。</figcaption>
</figure>

**谁在做：** 顾问、运营、人力、财务、IT 支持和新员工。

企业里的答案往往并不缺，只是散在制度、产品手册、历史邮件、培训视频和旧项目中。员工问“这类客户能不能退款”，需要的不只是搜到含有“退款”的文档，而是拿到当前版本的规则、适用条件和出处。

Sun Life 的内部助手每周处理一万多次员工查询；Morgan Stanley 把可检索的内部语料从有限问答扩展到约十万份文档；Notion 的产品也把企业搜索、会议记录和任务执行放进同一个工作空间。这类产品的核心不是“上传 PDF 就能问”，而是权限、版本、来源和反馈闭环。[Sun Life Asks](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/) · [Notion AI 功能说明](https://www.notion.com/help/notion-ai-faqs)

第一次不要接全公司。选一个问题密集、资料边界清楚的部门，例如售后政策或 IT 帮助台。回答必须带原文位置；找不到时明确说找不到，并把问题收进待补资料列表。

### 4. 财务、法务与合规：先读材料，再起草，不替人签字

<figure class="product-shot">
  <a href="https://mena.thomsonreuters.com/en/products-services/legal/cocounsel.html" target="_blank" rel="noreferrer">
    <img src="./images/products/cocounsel.jpg" alt="Thomson Reuters CoCounsel 合同起草与研究界面" loading="lazy" />
  </a>
  <figcaption><strong>Thomson Reuters CoCounsel：</strong>左侧显示“起草”和“研究”两项任务的进度，完成后再把草稿打开到 Word。AI 先读材料、找依据、起草，专业人员仍在熟悉的文档里复核和定稿。</figcaption>
</figure>

**谁在做：** 财务分析、税务、法务、采购和合规人员。

这些岗位每天面对大量格式相近、内容各异的材料：合同、发票、报表、政策、审计底稿和尽调文件。AI 适合先做抽取、比对、归类、检索和初稿，但最终判断必须能回到原文，也必须有人负责。

Thomson Reuters 的 2025 年调查显示，法律、税务、风控等专业服务的生成式 AI 使用正在上升，常见工作包括法律与税务研究、文档摘要、合同起草和申报准备。Moderna 的 Contract Companion 让员工先得到合同摘要；OpenAI 与 PwC 则把财务智能体放在对账、风险提示和跨系统流程里讨论。[Thomson Reuters：2025 Generative AI in Professional Services](https://www.thomsonreuters.com/en-us/posts/technology/genai-professional-services-report-2025/) · [Moderna 案例](https://openai.com/index/moderna/) · [OpenAI × PwC：CFO 工作流](https://openai.com/index/openai-pwc-finance-collaboration/)

适合小团队验证的切口，是一种固定材料和一套明确规则：例如逐条核对供应商合同里的付款、续约、赔偿和数据条款，给出原文引用和风险说明。不要一上来承诺“AI 法务”，先证明漏检率、复核时间和引用准确率。

### 5. 软件开发：价值出现在仓库里，不在单独的聊天窗口里

<figure class="product-shot">
  <a href="https://github.blog/changelog/2024-10-29-github-copilot-code-review-in-github-com-private-preview/" target="_blank" rel="noreferrer">
    <img src="./images/products/github-copilot-review.webp" alt="GitHub Copilot 在 Pull Request 中给出代码审查建议" loading="lazy" />
  </a>
  <figcaption><strong>GitHub Copilot Code Review：</strong>Copilot 被选为审查人后，会把问题落到具体代码行，并给出可提交的修改；开发者仍能查看差异、加入批次或拒绝建议。价值发生在 Pull Request 里，不在另一个聊天窗口里。</figcaption>
</figure>

**谁在做：** 开发、测试、运维和安全工程师。

开发者真正花时间的地方包括理解旧代码、补测试、查日志、做代码评审和熟悉陌生项目。GitHub 的受控实验中，使用 Copilot 的参与者完成指定编程任务更快；但在真实团队里，能不能读懂仓库上下文、遵守规范、跑过测试，远比“能生成代码”重要。[GitHub Copilot 生产力研究](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/) · [GitHub 后续研究报告](https://github.blog/wp-content/uploads/2023/06/Sea-Change-in-Software-Dev.pdf)

一个扎实的内部工具，可以从“失败的 CI”开始：读取报错和相关改动，定位可能原因，提出修复建议并生成待审补丁。它必须运行测试、展示差异、接受评审，而不是直接把代码推到生产环境。

### 6. 制造与现场服务：让设备、手册和工单说同一种话

<figure class="product-shot">
  <a href="https://blog.siemens.com/2026/02/the-digital-enterprise-and-the-synthesis-of-industrial-ai-digital-twin-and-data/" target="_blank" rel="noreferrer">
    <img src="./images/products/siemens-industrial-copilot.jpg" alt="Siemens Engineering Copilot 与 TIA Portal 并排运行" loading="lazy" />
  </a>
  <figcaption><strong>Siemens Engineering Copilot：</strong>右侧 Copilot 与左侧 TIA Portal 同时打开。工程师提问时，助手面对的是当前自动化项目、设备结构和工程文档，而不是脱离现场回答一个宽泛的“机器为什么坏了”。</figcaption>
</figure>

**谁在做：** 设备操作员、维修工程师、现场服务人员和工艺工程师。

机器停下来时，操作员看到的可能是一串错误码。答案散在数百页手册、备件清单和历史维修记录中，真正的损失却按停机分钟计算。另一方面，现场人员修好设备后，还要补一份客户能看懂、公司能归档的服务报告。

Siemens Industrial Copilot 已用于解释设备信息、查找维修依据和辅助自动化编程；Siemens 的另一项现场服务试验，则面向每年超过 140 万份工单报告，把工程师的简短记录整理成一致的客户报告。Deloitte 的制造业调查也提醒，数据质量和设备上下文仍是主要门槛。[Siemens Industrial Copilot](https://news.microsoft.com/source/emea/features/how-ai-is-helping-siemens-and-thyssenkrupp-bridge-skilling-gaps-in-manufacturing/) · [Siemens 现场报告案例](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service) · [Deloitte：2025 Smart Manufacturing Survey](https://www2.deloitte.com/us/en/insights/industry/manufacturing/2025-smart-manufacturing-survey.html)

小切口往往不是“预测整个工厂”，而是围绕一种设备：识别错误码，检索对应手册和历史工单，给出排查顺序；维修完成后，再把操作记录整理成报告。所有建议都要显示依据，并允许工程师标记“无效”。

### 7. 医疗先做文书和协调，不要把诊断当成演示功能

<figure class="product-shot">
  <a href="https://www.abridge.com/product" target="_blank" rel="noreferrer">
    <img src="./images/products/abridge-note.webp" alt="Abridge 将临床记录与原始医患对话关联的界面" loading="lazy" />
  </a>
  <figcaption><strong>Abridge：</strong>上方是生成的病历段落，下方是对应的医患对话，点击 Linked Evidence 可以回到原话。这里最重要的不是“自动写得快”，而是医生能追溯、修改并确认每条记录。</figcaption>
</figure>

**谁在做：** 医生、护士、病案人员、保险审核和患者服务团队。

医疗里最容易被忽略的负担，是看诊之外的记录、转诊、授权、理赔和患者沟通。McKinsey 总结的近端应用，大量集中在病历摘要、保险权益查询、拒赔原因整理、出院说明和后台运营，而不是让模型独立诊断。[McKinsey：Tackling Healthcare’s Biggest Burdens with Generative AI](https://www.mckinsey.com/industries/healthcare/our-insights/tackling-healthcares-biggest-burdens-with-generative-ai)

Abridge 等环境式记录产品，会从医患对话生成结构化病历草稿，再由医生确认。这个“草稿—复核—写回病历”的边界很重要：它减少文书时间，但没有改变临床责任人。[Abridge 医疗系统案例](https://www.abridge.com/press-release/abridge-hartford-healthcare) · [McKinsey：Generative AI in Healthcare](https://www.mckinsey.com/industries/healthcare/our-insights/generative-ai-in-healthcare-current-trends-and-future-outlook)

如果没有医疗合规、数据和临床伙伴，不要从诊断产品起步。可以先研究低风险的患者服务，例如把复杂的就诊准备说明改写成分步骤清单，或帮助工作人员整理来电，但仍要经过机构审核。

### 8. 零售和内容运营：一份素材要走完十几个渠道

<figure class="product-shot">
  <a href="https://www.canva.com/newsroom/news/magic-studio/" target="_blank" rel="noreferrer">
    <img src="./images/products/canva-magic-switch.png" alt="Canva Magic Switch 的改尺寸、翻译与转文档菜单" loading="lazy" />
  </a>
  <figcaption><strong>Canva Magic Switch：</strong>同一份设计可以继续改尺寸、翻译或转成文档。对内容团队来说，这正是“一份确认过的素材，接着做出多个渠道版本”的那段高频工作。</figcaption>
</figure>

**谁在做：** 电商运营、品牌市场、设计、商品和本地化团队。

新品上线不是“写一段文案”这么简单。团队要理解商品资料，生成不同平台的标题和卖点，处理图片，适配尺寸，翻译本地语言，检查禁用词，再根据反馈更新。大量时间花在搬运、改版和核对一致性上。

Deloitte 的零售展望把个性化、商品运营、供应链和营销列为 AI 正在进入的环节。Canva 的 Magic Switch 可以把同一内容改成不同尺寸和语言，Adobe Firefly 则把生成、编辑和生产素材放在同一工作流里。这些案例的共同点是：AI 没有替代品牌判断，而是减少一份素材变成多个版本时的机械劳动。[Deloitte：2025 Retail Industry Outlook](https://www.deloitte.com/us/en/insights/industry/retail-distribution/retail-distribution-industry-outlook-2025.html) · [Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

第一版可以服务一个渠道和一种商品：从结构化商品资料生成详情页草稿，自动检查必填项、尺寸和违禁表达，最终由运营发布。比“万能营销助手”更容易获得真实反馈。

## C 端：七个用户会主动打开产品的时刻

C 端应用最容易犯的错，是把同一个聊天框换七种提示词。下面这些产品之所以成立，是因为对话后面接着商品、课程、行程、画布、音乐或财务数据，用户可以继续完成事情。

### 1. “帮我把选择变少”：搜索、比较与购买

<figure class="product-shot product-shot--mobile">
  <a href="https://www.aboutamazon.com/news/retail/amazon-rufus" target="_blank" rel="noreferrer">
    <img src="./images/products/amazon-rufus.webp" alt="Amazon Rufus 购物助手界面" loading="lazy" />
  </a>
  <figcaption><strong>Amazon Rufus：</strong>入口就在 Amazon 搜索框下面，问题也围绕购物展开：比较桌布、为 Prime Day 做准备、寻找适合睡眠监测的手表。它能继续接到真实商品，而不是只给一段泛泛建议。</figcaption>
</figure>

用户买相机、婴儿车或一双适合雨天通勤的鞋时，不缺商品页，缺的是把模糊条件变成可比较的选择。Amazon 的 Rufus 会结合商品目录、评价和问答回答购买问题；Capgemini 和 Adobe 的消费者研究也都看到，用户开始用 AI 做商品发现、比较和售前咨询。[Amazon Rufus](https://www.aboutamazon.com/news/retail/amazon-rufus) · [Adobe：2025 AI and Digital Trends](https://business.adobe.com/content/dam/dx/us/en/resources/digital-trends-report-2025/2025_Digital_Trends_Report.pdf)

可以研究的不是“AI 导购”四个字，而是某一类难选商品。比如租房族买投影仪，需要同时考虑投射距离、白天亮度、噪声和预算。产品应展示比较依据、缺失信息和真实商品，而不是编一个看似专业的结论。

### 2. “我不想开二十个网页”：旅行计划与临场调整

<figure class="product-shot">
  <a href="https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/" target="_blank" rel="noreferrer">
    <img src="./images/products/expedia-chatgpt.jpg" alt="Expedia 对话式旅行规划界面" loading="lazy" />
  </a>
  <figcaption><strong>Expedia 对话式旅行规划：</strong>用户从“蜜月去 Maui 还是 Kauai”聊起，得到酒店建议后可以直接保存到 Trips。真正形成产品闭环的，是聊天结果进入了收藏、行程和预订。</figcaption>
</figure>

旅行规划要来回处理目的地、日期、交通、营业时间、预算和同行人偏好。Expedia 把开放式对话接到酒店收藏、价格和预订流程里，说明旅行 AI 的价值不是写一篇漂亮路书，而是把建议变成可保存、可核对、可购买的行程。[Expedia 对话式旅行规划](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/) · [Expedia AI 服务案例](https://www.expedia.com/newsroom/expedia-group-sets-the-standard-with-ai-powered-service-agent/)

更小的切口可以是“带孩子去某座城市的半日行程”或“演出散场后的夜间路线”。实时信息要来自可靠接口；天气、票价和营业时间必须标注更新时间。

### 3. “我想练一遍，不只听一遍”：学习与反馈

<figure class="product-shot product-shot--portrait">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="./images/products/duolingo-roleplay.webp" alt="Duolingo Max 的巴黎咖啡馆角色扮演练习" loading="lazy" />
  </a>
  <figcaption><strong>Duolingo Max Roleplay：</strong>练习不是一句“和 AI 聊法语”，而是一个具体任务：在巴黎咖啡馆点餐。场景、角色、目标和奖励都已经设好，用户打开后马上就能练一轮。</figcaption>
</figure>

生成式 AI 最适合补上过去很贵的一环：随时练习并得到针对这一次表现的反馈。Duolingo Max 用角色扮演和视频对话练语言；Khanmigo 更强调通过提问和提示引导学生，而不是直接交答案。[Duolingo Max](https://blog.duolingo.com/duolingo-max/) · [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)

一个具体产品可以只服务一个练习动作：面试回答、英语口语、销售异议处理或答辩演练。用户说完以后，反馈要对应原句，并给出下一轮可执行的改进，而不是泛泛地夸“表达很清晰”。

### 4. “先给我一个能改的初稿”：个人创作

<figure class="product-shot">
  <a href="https://firefly.adobe.com/" target="_blank" rel="noreferrer">
    <img src="./images/products/adobe-firefly.webp" alt="Adobe Firefly 文生图工作界面" loading="lazy" />
  </a>
  <figcaption><strong>Adobe Firefly：</strong>真实界面里不只有一个提示词框，还能选择模型、比例、内容类型、视觉强度和参考图，并比较多组结果。个人创作产品要给用户继续修改的控制，而不是只剩“再生成一次”。</figcaption>
</figure>

普通用户做生日邀请、二手商品图、短视频封面或社团海报时，最大的门槛常常是空白画布和复杂软件。Canva 把生成、抠图、扩图、改尺寸和翻译放进设计画布；Adobe Firefly 则让创作者在图像、视频、音频和矢量素材之间继续编辑。[Canva Magic Studio](https://www.canva.com/newsroom/news/magic-studio/) · [Adobe Firefly 发布](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

这类产品要给用户控制，而不是只给“再生成一次”。好切口往往包含一个明确成品：一套房源图、一个播客封面、三种尺寸的活动海报。用户可以锁定文字、人物和品牌色，只让 AI 改局部。

### 5. “这次错在哪”：个人化解释

<figure class="product-shot">
  <a href="https://blog.duolingo.com/duolingo-max/" target="_blank" rel="noreferrer">
    <img src="./images/products/duolingo-explain.jpg" alt="Duolingo Max Explain My Answer 的答错解释界面" loading="lazy" />
  </a>
  <figcaption><strong>Explain My Answer：</strong>中间这张界面直接引用用户刚才的答案，解释为什么复数 vestidos 要配 gustan，并允许继续要例子。它不是重新讲一节语法课，而是接住“我刚才到底错在哪”这一刻。</figcaption>
</figure>

同一个答案，对新手和熟练者需要不同解释。Duolingo 的 Explain My Answer 从用户刚刚做错的题出发；这比另开一个通用问答更自然，因为系统已经知道题目、答案和学习进度。[Duolingo：Explain My Answer](https://blog.duolingo.com/explain-my-answer-now-free/)

类似思路也适用于健身动作、摄影参数、棋局复盘和乐器练习：先拿到一次真实表现，再指出一个最值得改的地方。没有输入数据的“个性化建议”，通常只是换了称呼的通用内容。

### 6. “别只推荐，替我记住”：音乐和日常陪伴式体验

<figure class="product-shot product-shot--mobile">
  <a href="https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/" target="_blank" rel="noreferrer">
    <img src="./images/products/spotify-ai-dj.jpg" alt="Spotify AI DJ 播放界面" loading="lazy" />
  </a>
  <figcaption><strong>Spotify AI DJ：</strong>DJ 是首页里的一个持续播放入口，下面直接接着曲目和播放控制。它依靠的是用户长期收听记录、Spotify 的内容库和下一首播放动作，而不只是生成一段像主持人的话。</figcaption>
</figure>

Spotify 的 AI DJ 不只是生成一句介绍，它基于用户长期的收听历史选歌，并用一个持续存在的声音串起体验。这里真正难复制的是偏好数据、内容版权和播放动作，不是 DJ 的语气。[Spotify AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/) · [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)

你也可以从别的“连续体验”里找机会，例如跑步、做饭或睡前阅读。关键是产品能根据过去的选择调整下一次内容，同时允许用户轻松纠正，而不是假装比用户更懂自己。

### 7. “把复杂规定变成我的下一步”：个人财务与生活事务

<figure class="product-shot product-shot--portrait">
  <a href="https://turbotax.intuit.com/personal-taxes/mobile-apps/turbotax/" target="_blank" rel="noreferrer">
    <img src="./images/products/intuit-assist.jpg" alt="TurboTax 中 Intuit Assist 比较两年税收抵免的界面" loading="lazy" />
  </a>
  <figcaption><strong>TurboTax 中的 Intuit Assist：</strong>它不是从零谈税务，而是拿用户今年与去年的抵免金额做比较，再给出“还能申请哪些抵免”等下一步问题。个人财务助手的基础，是用户自己的数据和当下任务。</figcaption>
</figure>

报税、信用、保险和账单的共同难点，是规则复杂、材料分散，而且每个人的下一步不同。Intuit Assist 把生成式 AI 放进 TurboTax、Credit Karma 和 QuickBooks，目标不是陪聊，而是结合用户已有的财务数据给出解释和行动建议。[Intuit Assist](https://www.intuit.com/intuitassist/)

这类产品风险也更高。第一版更适合做材料清单、概念解释、账单分类和办理提醒，并清楚区分事实、估算和建议。涉及报税提交、投资交易或保险选择时，应让用户确认并提供专业支持入口。

## 去哪里找自己的 B 端和 C 端方向

上面的案例用来认识“场景长什么样”，不是让你照着换一个行业。真正属于你的方向，通常藏在你能接触到的人、资料和日常习惯里。B 端与 C 端的找法不一样。

### 找 B 端：沿着一个岗位，把工作追到底

B 端资料不会直接写“这里有一个创业机会”。它更常以招聘要求、采购文件、操作手册、软件评价和项目案例出现。先选一个具体岗位，例如外贸跟单、物业客服、诊所前台或设备维修员，再顺着他的工作找材料。

<div class="idea-routes">
  <div class="idea-route idea-route--b">
    <span>B 端从这里找</span>
    <ul>
      <li><strong>招聘网站：</strong>看岗位每天负责什么，常用哪些系统，要交付哪些表格和报告。</li>
      <li><strong>招标与采购公告：</strong>看企业正在花钱解决什么，验收标准和系统边界写得尤其具体。</li>
      <li><strong>软件评价区：</strong>到 G2、Capterra、应用市场和行业论坛看差评，找“还要导出到 Excel”“每次都要手工补”的地方。</li>
      <li><strong>公司案例与年报：</strong>搜索企业名加“数字化案例”“效率提升”“客户服务”，看已经进入预算的项目。</li>
      <li><strong>真实工作材料：</strong>旧工单、报价单、检查表、群聊求助和培训文档，往往比行业报告更接近产品入口。</li>
    </ul>
  </div>
  <div class="idea-route idea-route--c">
    <span>可以直接这样搜</span>
    <p><code>设备维修员 日常工作流程</code></p>
    <p><code>物业客服 招标 智能化 filetype:pdf</code></p>
    <p><code>site:g2.com field service software reviews</code></p>
    <p><code>customer support workflow pain points report</code></p>
    <p><code>某行业 数字化转型 案例 年报</code></p>
  </div>
</div>

假设你对外贸感兴趣，不要只搜“AI + 外贸”。先看跟单员招聘信息，记下“询盘回复、报价、核对规格、催交期、准备报关材料”；再找一份真实报价单和几条跨境软件差评。你可能会发现，最值得做的不是万能外贸助手，而是“收到英文询盘后，从历史报价和产品参数里整理一份待确认报价”。

### 找 C 端：沿着一天，找反复出现的麻烦

C 端不从岗位出发，而从一个人什么时候会掏出手机开始。回想一天里的搜索、比较、记录、练习、等待和分享：哪些事情每周都会发生？用户现在用截图、备忘录、收藏夹或群聊勉强完成什么？

<div class="idea-routes">
  <div class="idea-route idea-route--c">
    <span>C 端从这里找</span>
    <ul>
      <li><strong>App Store 与安卓商店：</strong>先看同类产品的一星到三星评价，关注缺失功能、收费节点和弃用原因。</li>
      <li><strong>小红书、抖音、B 站与 Reddit：</strong>搜索“怎么做”“有没有工具”“求推荐”，评论区常有更具体的补充。</li>
      <li><strong>Product Hunt 与榜单：</strong>看新产品解决了哪个小动作，再看评论里用户希望它接着完成什么。</li>
      <li><strong>趋势与流量报告：</strong>用 Google Trends、QuestMobile、艾瑞和平台年度报告确认这是不是一群人的长期行为。</li>
      <li><strong>自己的相册和收藏夹：</strong>大量截图、收藏后不再打开的攻略、反复复制的文字，都是没有被接好的流程。</li>
    </ul>
  </div>
  <div class="idea-route idea-route--b">
    <span>可以直接这样搜</span>
    <p><code>site:reddit.com "I wish there was an app"</code></p>
    <p><code>带孩子旅行 攻略 太累</code></p>
    <p><code>记账 App 难用 评论</code></p>
    <p><code>Product Hunt AI language learning</code></p>
    <p><code>AI 应用 用户规模 QuestMobile</code></p>
  </div>
</div>

假设你经常旅行，先别做“AI 路书”。去看用户为什么收藏十几篇攻略：有人是怕餐厅临时休息，有人要照顾老人少走路，有人需要在演出散场后安全回酒店。选中一个反复出现的时刻，产品才可能从“生成一篇文字”变成真正有人打开的工具。

### 资料找到以后，别急着写代码

一个方向至少要留下三类证据：一份能看懂流程的材料、三个人重复提到的麻烦、一个已经有人付费或花时间绕过去的替代办法。然后用 60 分钟把它写具体。

<div class="fieldwork">
  <div class="fieldwork__step"><b>01</b><span>圈定一个人</span><p>B 端写到岗位，C 端写到某类生活状态。不要只写“企业用户”或“年轻人”。</p></div>
  <div class="fieldwork__step"><b>02</b><span>找到一次发生</span><p>拿到一张表、一段录屏、一条差评或一次真实操作，看看麻烦具体卡在哪里。</p></div>
  <div class="fieldwork__step"><b>03</b><span>交叉找三次</span><p>同类问题至少来自三个人或三个来源，避免被一句有趣的抱怨带跑。</p></div>
  <div class="fieldwork__step"><b>04</b><span>只接住一步</span><p>写清输入、输出、确认人和衡量指标，再决定 AI 是否真的合适。</p></div>
</div>

最后，把方向写成一句别人听完就能想象的描述：

> 当 **谁** 遇到 **什么时刻**，他现在要用 **哪些材料或办法** 完成 **哪件事**。我先让 AI 接住 **其中一步**，结果由 **谁确认**，再用 **什么变化** 判断它有没有价值。

一个 B 端方向可以这样写：

> 当包装线操作员看到 E37 错误码时，他现在要翻纸质手册和旧工单。系统先根据设备型号找出相关章节和三个排查步骤，由维修工程师确认；试点看平均停机时间是否下降。

一个 C 端方向可以这样写：

> 当家长周末带孩子逛博物馆时，他现在要在公众号、地图和点评之间拼行程。产品先按孩子年龄和可用时间整理三小时路线，开放时间与票价保留来源，家长确认后加入日历。

能写到这个程度，你才拥有一个可以继续访谈、做原型和小范围试用的 idea。

## 参考资料

下面共列出 **67 个信息源**。正文优先采用调查方法清楚的咨询报告、行业研究和产品一手案例；券商报告主要用来观察国内市场关注的商业化方向，不把投资判断当作用户需求。部分厂商案例带有营销立场，使用时应与访谈、真实业务数据交叉验证。

<details class="source-group">
<summary>一、总体采用与企业价值（15）</summary>

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
14. [中国信通院：《人工智能发展报告（2024 年）》](https://hrssit.cn/Uploads/file/20241217/1734400434600250.pdf)
15. [CNNIC：《生成式人工智能应用发展报告（2025）》](https://www3.cnnic.cn/n4/2025/1021/c88-11391.html)

</details>

<details class="source-group">
<summary>二、B 端行业、岗位与工作流（24）</summary>

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
33. [艾瑞咨询：《2025 年中国企业级 AI 应用行业研究报告》](https://www.bsia.org.cn/site/content/31686.html)
34. [GitHub：Quantifying Copilot’s Impact on Developer Productivity](https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/)
35. [Siemens × Microsoft：Industrial Copilot](https://news.microsoft.com/source/2024/10/24/siemens-and-microsoft-scale-industrial-ai/)
36. [Abridge：Hartford HealthCare Ambient AI 案例](https://www.abridge.com/press-release/abridge-hartford-healthcare)
37. [AWS：Sun Life 内部知识助手](https://aws.amazon.com/solutions/case-studies/sun-life-case-study/)
38. [AWS：ResultsCX 客服自动化](https://aws.amazon.com/solutions/case-studies/resultscx/)
39. [AWS：Sanofi 企业 AI 助手](https://aws.amazon.com/solutions/case-studies/sanofi-bedrock-case-study/)

</details>

<details class="source-group">
<summary>三、落地产品与企业案例（10）</summary>

40. [OpenAI：Morgan Stanley](https://openai.com/index/morgan-stanley/)
41. [OpenAI：Klarna](https://openai.com/index/klarna/)
42. [OpenAI：Moderna](https://openai.com/index/moderna/)
43. [OpenAI：BBVA](https://openai.com/index/bbva-2025/)
44. [OpenAI × PwC：Reimagining the Office of the CFO](https://openai.com/index/openai-pwc-finance-collaboration/)
45. [Microsoft：Siemens 现场服务报告](https://www.microsoft.com/en/customers/story/19736-siemens-ag-germany-dynamics-365-field-service)
46. [AWS：Legal & General 文档处理](https://aws.amazon.com/solutions/case-studies/aws-innovator-legal-and-general/)
47. [AWS × Infosys：医疗保险客服助手](https://aws.amazon.com/blogs/apn/how-infosys-built-aws-generative-ai-based-assistant-for-a-healthcare-payer-company/)
48. [Notion：Notion AI 功能说明](https://www.notion.com/help/notion-ai-faqs)
49. [Canva：Magic Studio](https://www.canva.com/newsroom/news/magic-studio/)

</details>

<details class="source-group">
<summary>四、C 端消费者与产品（13）</summary>

50. [Capgemini：What Matters to Today’s Consumer 2025](https://www.capgemini.com/insights/research-library/top-consumer-trends-in-2025/)
51. [Accenture：Me, My Brand and AI](https://www.accenture.com/us-en/insights/consulting/me-my-brand-ai-new-world-consumer-engagement)
52. [Deloitte：2025 Digital Media Trends](https://www.deloitte.com/us/en/insights/industry/technology/digital-media-trends-consumption-habits-survey/2025.html)
53. [QuestMobile：2025 中国移动互联网春季报告](https://www.questmobile.cn/research/report/1919961024158601218/)
54. [QuestMobile：2025 年 8 月 AI 应用行业报告](https://www.questmobile.com.cn/research/report/1967853261412208641/)
55. [艾瑞咨询：《2025 年中国 AI 类 App 流量分析报告》](https://www.etc.org.cn/UserFiles/Article/file/6388341575962762472758248.pdf)
56. [Amazon：Rufus 购物助手](https://www.aboutamazon.com/news/retail/amazon-rufus)
57. [Expedia：对话式旅行规划](https://www.expedia.com/newsroom/expedia-launches-conversational-trip-planning-powered-by-chatgpt-to-inspire-members-to-dream-about-travel-in-new-ways/)
58. [Duolingo：Duolingo Max](https://blog.duolingo.com/duolingo-max/)
59. [Khan Academy：Khanmigo](https://2023-2024.annualreport.khanacademy.org/khanmigo)
60. [Spotify：AI DJ](https://newsroom.spotify.com/2023-02-22/spotify-debuts-a-new-ai-dj-right-in-your-pocket/)
61. [Intuit：Intuit Assist](https://www.intuit.com/intuitassist/)
62. [Adobe：Firefly](https://news.adobe.com/news/2025/04/adobe-revolutionizes-ai-assisted-creativity-firefly)

</details>

<details class="source-group">
<summary>五、国内券商视角（5）</summary>

63. [华鑫证券：WAIC 大会强供给，AI 应用商业化如何解](https://pdf.dfcfw.com/pdf/H3_AP202507291717868704_1.pdf)
64. [国信证券：人工智能专题——AI Agent](https://pdf.dfcfw.com/pdf/H3_AP202503121644302597_1.pdf)
65. [东吴证券：2025 年 AI 应用渗透趋势](https://pdf.dfcfw.com/pdf/H301_AP202501021641518997_1.pdf)
66. [中银证券：“人工智能+”应用与平台](https://pdf.dfcfw.com/pdf/H3_AP202510201765533690_1.pdf)
67. [AIGC 行业深度：算力、模型与应用的创新融合](https://pdf.dfcfw.com/pdf/H3_AP202411151640914780_1.pdf)

</details>

<p class="source-footnote">资料检索与整理时间：2026 年 8 月。报告中的比例受样本、地区和厂商口径影响，不能直接代替你对目标用户的访谈与试用数据。</p>

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

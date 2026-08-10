<template>
  <section class="source-map" aria-label="创意灵感资料地图">
    <header class="map-header">
      <div>
        <p class="eyebrow">资料地图</p>
        <h3>你想找哪一种线索？</h3>
        <p>先选一个入口，不用一次把所有网站刷完。</p>
      </div>
      <span class="resource-total">{{ totalResources }} 个入口</span>
    </header>

    <nav class="category-tabs" aria-label="资料分类">
      <button
        v-for="(group, index) in groups"
        :key="group.name"
        type="button"
        :class="{ active: activeIndex === index }"
        :aria-pressed="activeIndex === index"
        @click="activeIndex = index"
      >
        <span>{{ group.number }}</span>
        {{ group.name }}
      </button>
    </nav>

    <div class="category-intro">
      <div>
        <strong>{{ activeGroup.title }}</strong>
        <p>{{ activeGroup.description }}</p>
      </div>
      <span>{{ activeGroup.resources.length }} 个资料源</span>
    </div>

    <div class="resource-grid">
      <a
        v-for="resource in activeGroup.resources"
        :key="resource.url"
        :href="resource.url"
        target="_blank"
        rel="noreferrer"
        class="resource-card"
      >
        <div class="card-top">
          <strong>{{ resource.name }}</strong>
          <span aria-hidden="true">↗</span>
        </div>
        <p>{{ resource.description }}</p>
        <small>{{ resource.action }}</small>
      </a>
    </div>

    <footer class="map-note">
      <span>使用提醒</span>
      {{ activeGroup.note }}
    </footer>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

const groups = [
  {
    number: '01',
    name: '点子社区',
    title: '用户和开发者公开讨论想法的地方',
    description: '这里的帖子通常从一句“希望有人做……”开始，适合观察大家最近想解决什么。',
    note: '这些都是灵感，不是已经成立的需求。先收藏原帖，下一章再判断。',
    resources: [
      {
        name: 'r/SomebodyMakeThis',
        url: 'https://www.reddit.com/r/SomebodyMakeThis/',
        description: 'Reddit 上专门收集“希望有人做出来”这类愿望的社区。发帖人通常会描述想要的东西，以及自己为什么需要它。',
        action: '建议先看 Top · Past Year'
      },
      {
        name: 'r/AppIdeas',
        url: 'https://www.reddit.com/r/AppIdeas/',
        description: 'Reddit 上讨论应用点子的社区。帖子大多围绕个人工具、小应用和某个很细的使用场景展开。',
        action: '评论里的现有替代办法更值得看'
      },
      {
        name: 'r/Startup_Ideas',
        url: 'https://www.reddit.com/r/Startup_Ideas/',
        description: '比 AppIdeas 更偏创业讨论的社区。除了想法本身，发帖人还常会谈目标用户、市场和可能的赚钱方式。',
        action: '先读思路，不必照单全收'
      },
      {
        name: 'Unvalidated Ideas',
        url: 'https://unvalidatedideas.com/',
        description: '一个专门整理“尚未验证的创业想法”的网站。每条内容的结构比较统一，比在论坛里翻帖子更快。',
        action: '优先收藏你看得懂的题目'
      },
      {
        name: 'IdeasAI',
        url: 'https://ideasai.com/',
        description: '一个可以不断刷新 AI 生成创业点子的网站。它更像随机灵感生成器，适合卡住时拓展联想。',
        action: '把它当灵感骰子，不当市场结论'
      }
    ]
  },
  {
    number: '02',
    name: '产品发布与案例',
    title: '看看新产品怎样发布，小产品怎样经营',
    description: '这里既有产品上线时争取曝光的榜单，也有独立开发者公开收入和经营过程的案例。',
    note: '不要照抄产品。看它服务谁、解决哪一步，以及用户为什么愿意换掉原来的做法。',
    resources: [
      {
        name: 'Product Hunt',
        url: 'https://www.producthunt.com/',
        description:
          'Product Hunt 是新产品集中首发和争取曝光的榜单。很多独立开发者和产品团队上线时都会来这里“打榜”，邀请用户投票、提问和留言。',
        action: '先看当天榜单，再进详情页读产品介绍和评论'
      },
      {
        name: 'Starter Story',
        url: 'https://www.starterstory.com/',
        description: '一个收录创业者真实经历的案例库。文章通常会讲产品怎样起步、如何找到客户，有时也会公开收入。',
        action: '优先找一个人或小团队的案例'
      },
      {
        name: 'Indie Hackers Products',
        url: 'https://www.indiehackers.com/products',
        description: '独立开发者交流产品和经营进展的社区。Products 页面里能看到产品介绍，有些作者还会公开收入与增长记录。',
        action: '别只看收入最高的产品'
      },
      {
        name: 'MicroConf Blog',
        url: 'https://microconf.com/blog',
        description: '面向自力更生 SaaS 创业者的社区与会议品牌。博客更关心定价、获客，以及怎样经营一个小而稳定的软件生意。',
        action: '留意产品第一版有多小'
      },
      {
        name: 'BetaList',
        url: 'https://betalist.com/',
        description: '专门展示早期创业产品的平台。这里的产品往往还在测试阶段，能看到团队最初如何介绍自己的方向。',
        action: '点进落地页看它先服务谁'
      },
      {
        name: '1000 Tools',
        url: 'https://1000.tools/',
        description: '按用途收录 AI 工具的导航站。翻译、写作、设计等分类下已经有哪些同类产品，在这里能很快扫一遍。',
        action: '按品类查，比刷首页更有效'
      }
    ]
  },
  {
    number: '03',
    name: '差评、采购与代做',
    title: '从真实交易里看工作是怎样完成的',
    description: '软件评价会暴露现有产品的缺口，采购和代做平台则能看到客户正在为什么任务付钱。',
    note: '有人花钱不等于整件事都适合做成软件，但能帮助你看清材料、步骤和交付结果。',
    resources: [
      {
        name: 'G2',
        url: 'https://www.g2.com/',
        description: '企业软件评价平台，常见 CRM、项目管理、客服等品类。用户评价会分别写产品的优点、缺点和使用场景。',
        action: '直接筛 1 星和 2 星评价'
      },
      {
        name: 'Capterra',
        url: 'https://www.capterra.com/',
        description: '按品类整理商业软件的目录与评价平台。适合把同一类 SaaS 放在一起比较，并查看用户写下的 Pros 与 Cons。',
        action: '把 Pros 和 Cons 对着看'
      },
      {
        name: '中国政府采购网',
        url: 'https://www.ccgp.gov.cn/',
        description: '政府采购信息的官方发布平台。学校、医院和政府机构采购系统时，公告里常会写预算、功能要求与使用单位。',
        action: '搜“管理系统”“数据采集”等词'
      },
      {
        name: 'Fiverr',
        url: 'https://www.fiverr.com/',
        description: '把自由职业服务做成固定套餐出售的平台。每个服务页都会说明客户要提供什么、价格多少、最后交付什么。',
        action: '试试 data entry、PDF to Excel'
      },
      {
        name: 'Upwork',
        url: 'https://www.upwork.com/',
        description: '公司和个人发布项目、寻找自由职业者的平台。招聘帖里通常会写清任务、技能要求、预算和交付时间。',
        action: '留意反复出现的任务描述'
      },
      {
        name: 'V2EX',
        url: 'https://www.v2ex.com/',
        description: '中文开发者和互联网从业者常用的讨论社区。帖子里经常有人求工具、讲工作流程，或者吐槽正在使用的软件。',
        action: '搜“有没有工具”“太麻烦”'
      },
      {
        name: 'Reddit 垂直社区',
        url: 'https://www.reddit.com/',
        description: 'Reddit 按主题分成大量社区。smallbusiness、SaaS、healthcare 等板块里，会有从业者讨论具体工作和日常麻烦。',
        action: '先进入一个板块，再搜索具体问题'
      }
    ]
  },
  {
    number: '04',
    name: '趋势与行业观点',
    title: '看看一个方向是不是正在升温',
    description: '趋势工具提供搜索变化，年度报告和投资机构文章则用来理解技术与行业正在往哪里走。',
    note: '趋势只能提供背景，不能替你证明需求。看完仍要回到具体的人和工作现场。',
    resources: [
      {
        name: 'Exploding Topics',
        url: 'https://explodingtopics.com/',
        description: '专门寻找“正在快速增长、但还没有完全进入主流”的话题和产品品类，并展示它们的长期增长曲线。',
        action: '看长期曲线，不追一天的热点'
      },
      {
        name: 'Google Trends',
        url: 'https://trends.google.com/',
        description: 'Google 提供的搜索趋势工具，可以比较关键词在不同时间、地区的热度，也能查看相关查询与飙升词。',
        action: '也看看“飙升”相关查询'
      },
      {
        name: 'Glimpse',
        url: 'https://meetglimpse.com/',
        description: '围绕消费者搜索趋势提供发现与分析的工具，可以补充 Google Trends 本身没有直接展示的信息。',
        action: '和其他来源一起看'
      },
      {
        name: 'State of AI Report',
        url: 'https://www.stateof.ai/',
        description: '每年发布的 AI 行业报告，集中回顾技术、研究、产业和政策变化，适合快速建立一年的整体背景。',
        action: '篇幅很长，只读相关章节即可'
      },
      {
        name: 'YC Requests for Startups',
        url: 'https://www.ycombinator.com/rfs',
        description: 'Y Combinator 公开发布的创业命题清单。它会直接说明希望创业者关注哪些问题，以及为什么现在值得做。',
        action: '重点看“为什么是现在”'
      },
      {
        name: 'a16z Big Ideas',
        url: 'https://a16z.com/big-ideas-2025/',
        description: 'a16z 每年邀请不同领域的投资人写下重要判断。内容覆盖多个行业，视角更偏趋势与赛道。',
        action: '看完还要回到具体的人和事'
      },
      {
        name: 'NFX',
        url: 'https://www.nfx.com/',
        description: '一家擅长网络效应与平台型公司的投资机构。网站文章常讨论市场结构、增长和商业模式。',
        action: '按已有主题搜索文章'
      },
      {
        name: 'Sequoia Capital',
        url: 'https://www.sequoiacap.com/article/',
        description: '红杉资本的文章栏目，常从公司成长和产业变化出发，讨论某类市场为什么会出现新的机会。',
        action: '适合建立背景，不适合直接抄题'
      },
      {
        name: 'First Round Review',
        url: 'https://review.firstround.com/',
        description: '以创业者和一线操盘者访谈见长的深度内容网站，主题包括用户研究、产品、招聘、销售和增长。',
        action: '按问题搜索，不必从头刷'
      }
    ]
  }
]

const activeIndex = ref(0)
const activeGroup = computed(() => groups[activeIndex.value])
const totalResources = groups.reduce((total, group) => total + group.resources.length, 0)
</script>

<style scoped>
.source-map {
  margin: 24px 0 34px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  background: var(--vp-c-bg-soft);
}

.map-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 30px 22px;
  background:
    radial-gradient(circle at 94% 0, rgba(71, 134, 102, 0.15), transparent 34%),
    var(--vp-c-bg);
}

.eyebrow { margin: 0 0 7px; color: #2f7d5b; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; }
.map-header h3 { margin: 0; border: 0; font-size: clamp(22px, 3vw, 30px); letter-spacing: -0.025em; }
.map-header p:last-child { margin: 9px 0 0; color: var(--vp-c-text-2); font-size: 14px; }
.resource-total { flex: 0 0 auto; padding: 7px 11px; color: #2f7d5b; font-size: 12px; font-weight: 700; border-radius: 99px; background: #e8f4ed; }

.category-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; padding: 14px 16px; border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.category-tabs button { padding: 10px 8px; color: var(--vp-c-text-2); font-size: 12px; font-weight: 650; border: 1px solid transparent; border-radius: 10px; background: transparent; cursor: pointer; }
.category-tabs button span { margin-right: 5px; color: var(--vp-c-text-3); font-size: 10px; }
.category-tabs button:hover { background: var(--vp-c-bg-soft); }
.category-tabs button.active { color: #276a4d; border-color: rgba(47, 125, 91, 0.2); background: #e8f4ed; }
.category-tabs button.active span { color: #2f7d5b; }

.category-intro { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 22px 24px 16px; }
.category-intro strong { font-size: 17px; }
.category-intro p { margin: 5px 0 0; color: var(--vp-c-text-2); font-size: 13px; line-height: 1.65; }
.category-intro > span { flex: 0 0 auto; color: var(--vp-c-text-3); font-size: 11px; }

.resource-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; padding: 0 16px 18px; }
.resource-card { display: flex; flex-direction: column; min-height: 132px; padding: 15px 16px; color: inherit; text-decoration: none !important; border: 1px solid var(--vp-c-divider); border-radius: 13px; background: var(--vp-c-bg); transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease; }
.resource-card:hover { border-color: rgba(47, 125, 91, 0.42); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(36, 56, 47, 0.08); }
.card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.card-top strong { color: var(--vp-c-text-1); font-size: 14px; }
.card-top span { color: #2f7d5b; font-size: 15px; }
.resource-card p { flex: 1; margin: 8px 0 12px; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.65; }
.resource-card small { color: #2f7d5b; font-size: 11px; font-weight: 650; }

.map-note { padding: 14px 20px; color: var(--vp-c-text-2); font-size: 12px; line-height: 1.65; border-top: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); }
.map-note span { margin-right: 8px; color: #2f7d5b; font-weight: 700; }

@media (max-width: 720px) {
  .source-map { border-radius: 18px; }
  .map-header { padding: 23px 19px 19px; }
  .resource-total { display: none; }
  .category-tabs { display: flex; overflow-x: auto; padding: 11px; scrollbar-width: none; }
  .category-tabs::-webkit-scrollbar { display: none; }
  .category-tabs button { flex: 0 0 auto; }
  .category-intro { padding: 18px 16px 13px; }
  .category-intro > span { display: none; }
  .resource-grid { grid-template-columns: 1fr; padding: 0 10px 12px; }
  .resource-card { min-height: 118px; }
}
</style>

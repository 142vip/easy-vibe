import stage2LovartCover from '../../assets/home/cards/stage2-asset-generation.webp'
import stage2FigmaCover from '../../assets/home/cards/stage2-interface-design.webp'
import stage2DesignToCodeCover from '../../assets/home/cards/stage2-design-to-code.webp'
import stage2SupabaseCover from '../../assets/home/cards/stage2-database.webp'
import stage2ZeaburCover from '../../assets/home/cards/stage2-deployment.webp'
import stage2DifyCover from '../../assets/home/cards/stage2-knowledge-base.webp'
import stage3ElectronCover from '../../assets/home/cards/stage3-desktop-voice.webp'
import stage3AgentTeamsCover from '../../assets/home/cards/stage3-agent-team.webp'
import stage3LongRunningCover from '../../assets/home/cards/stage3-long-running.webp'
import stage3PersonalBrandCover from '../../assets/home/cards/stage3-personal-brand.webp'

export const locales = [
  { code: 'zh-cn', text: '简体中文' },
  { code: 'en', text: 'English' },
  { code: 'ja-jp', text: '日本語' },
  { code: 'zh-tw', text: '繁體中文' },
  { code: 'ko-kr', text: '한국어' },
  { code: 'es-es', text: 'Español' },
  { code: 'fr-fr', text: 'Français' },
  { code: 'de-de', text: 'Deutsch' },
  { code: 'ar-sa', text: 'العربية' },
  { code: 'vi-vn', text: 'Tiếng Việt' }
]

export const stage1Cards = [
  {
    title: 'AI 产品经理',
    desc: '从想法到高保真原型，你只需要会说话。',
    sub: '适合非技术背景',
    color: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
    icon: '🎨',
    link: '/zh-cn/stage-1/learning-map/'
  },
  {
    title: '游戏化入门',
    desc: '通过制作贪吃蛇、俄罗斯方块，打破对代码的恐惧。',
    sub: '边玩边学',
    color: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
    icon: '🎮',
    link: '/zh-cn/stage-1/ai-capabilities-through-games/'
  },
  {
    title: 'Vibe Coding',
    desc: '掌握 AI 时代的编程核心：提示词工程与上下文管理。',
    sub: '核心心法',
    color: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
    icon: '💡',
    link: '/zh-cn/stage-1/introduction-to-ai-ide/'
  }
]

export const stage2Cards = [
  {
    imageColor: '#E0C3FC',
    image: stage2LovartCover,
    imageAlt: 'AI 素材生产工作流概念插画',
    link: '/zh-cn/stage-2/frontend/lovart-assets/'
  },
  {
    imageColor: '#D8C4F8',
    image: stage2FigmaCover,
    imageAlt: '界面设计与布局概念插画',
    link: '/zh-cn/stage-2/frontend/figma-mastergo/'
  },
  {
    imageColor: '#C7DDFB',
    image: stage2DesignToCodeCover,
    imageAlt: '设计稿转代码概念插画',
    link: '/zh-cn/stage-2/frontend/design-to-code/'
  },
  {
    imageColor: '#8EC5FC',
    image: stage2SupabaseCover,
    imageAlt: '数据库与权限概念插画',
    link: '/zh-cn/stage-2/backend/database-supabase/'
  },
  {
    imageColor: '#96E6A1',
    image: stage2ZeaburCover,
    imageAlt: '应用部署上线概念插画',
    link: '/zh-cn/stage-2/backend/zeabur-deployment/'
  },
  {
    imageColor: '#A7F3D0',
    image: stage2DifyCover,
    imageAlt: 'AI 知识库概念插画',
    link: '/zh-cn/stage-2/ai-capabilities/dify-knowledge-base/'
  }
]

export const stage3Cards = [
  {
    title: '跨平台桌面应用',
    desc: '用 Electron 做语音转文字桌面程序，一次开发同时跑在 Windows、macOS、Linux。',
    tag: 'Stage 3',
    visualType: 'phone',
    image: stage3ElectronCover,
    imageAlt: '跨平台语音转文字应用概念插画',
    link: '/zh-cn/stage-3/cross-platform/electron-voice-to-text/'
  },
  {
    title: 'AI 智能体团队',
    desc: '用 Claude Agent Teams 组建 AI 开发小队，多代理协作完成大型任务。',
    tag: 'Advanced',
    visualType: 'ai',
    image: stage3AgentTeamsCover,
    imageAlt: 'AI 智能体团队协作概念插画',
    link: '/zh-cn/stage-3/core-skills/agent-teams/'
  },
  {
    title: '长效稳定执行',
    desc: '用循环脚本和 Ralph 插件管理长时间任务，让 Claude Code 过夜稳定跑完工作。',
    tag: 'Architecture',
    visualType: 'arch',
    image: stage3LongRunningCover,
    imageAlt: '长时间循环任务概念插画',
    link: '/zh-cn/stage-3/core-skills/long-running-tasks/'
  },
  {
    title: '个人品牌与输出',
    desc: '搭建个人网站与技术博客，让你的项目和经验长期沉淀并被更多人看到。',
    tag: 'Brand',
    visualType: 'brand',
    image: stage3PersonalBrandCover,
    imageAlt: '个人网站与作品集概念插画',
    link: '/zh-cn/stage-3/personal-brand/personal-website-blog/'
  }
]

export const appendixCards = [
  {
    title: '人工智能',
    desc: 'LLM、Agent、RAG，深入 AI 底层原理。',
    tag: 'AI',
    link: '/zh-cn/appendix/8-artificial-intelligence/ai-history'
  },
  {
    title: '提示词工程',
    desc: '掌握与 AI 高效对话的技巧，解锁潜力。',
    tag: 'AI',
    link: '/zh-cn/appendix/8-artificial-intelligence/prompt-engineering'
  },
  {
    title: '大语言模型',
    desc: '深入浅出解析 LLM 的工作原理与应用。',
    tag: 'AI',
    link: '/zh-cn/appendix/8-artificial-intelligence/llm-principles'
  },
  {
    title: 'Agent 智能体',
    desc: '探索具备自主决策与执行能力的 AI 架构。',
    tag: 'AI',
    link: '/zh-cn/appendix/8-artificial-intelligence/ai-agents'
  },
  {
    title: '前端基础',
    desc: 'HTML/CSS/JS 三大基石，入门必修课。',
    tag: 'Frontend',
    link: '/zh-cn/appendix/3-browser-and-frontend/javascript-deep-dive'
  },
  {
    title: '前端进化史',
    desc: '了解前端技术栈演变，把握发展趋势。',
    tag: 'Frontend',
    link: '/zh-cn/appendix/3-browser-and-frontend/frontend-frameworks'
  },
  {
    title: '后端架构',
    desc: '从单体到微服务，探索架构演进之路。',
    tag: 'Backend',
    link: '/zh-cn/appendix/4-server-and-backend/backend-layered-architecture'
  },
  {
    title: '后端语言',
    desc: '对比主流后端语言特性，选择最佳技术栈。',
    tag: 'Backend',
    link: '/zh-cn/appendix/4-server-and-backend/backend-languages'
  },
  {
    title: '数据库原理',
    desc: '理解数据库核心原理，掌握数据存储艺术。',
    tag: 'Database',
    link: '/zh-cn/appendix/5-data/database-fundamentals'
  },
  {
    title: 'API 设计',
    desc: 'API 接口设计与开发的基础知识。',
    tag: 'API',
    link: '/zh-cn/appendix/4-server-and-backend/api-intro'
  },
  {
    title: 'Git 版本控制',
    desc: '深入理解 Git 原理与高级用法。',
    tag: 'General',
    link: '/zh-cn/appendix/2-development-tools/git-version-control'
  },
  {
    title: '计算机网络',
    desc: '网络协议与通信原理的基础知识。',
    tag: 'General',
    link: '/zh-cn/appendix/1-computer-fundamentals/computer-networks'
  }
]

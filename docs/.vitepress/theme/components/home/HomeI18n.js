export const i18n = {
  'zh-cn': {
    nav: {
      title: 'Easy-Vibe 教程',
      home: '首页',
      stories: '用户故事',
      pm: '零基础入门',
      junior: '初中级开发',
      senior: '高级开发',
      appendix: '附录',
      start: '开始学习'
    },
    stories: {
      cat: '用户故事',
      title: '看见每一个<br><span class="highlight">闪亮的你</span>',
      sub: '加入他们，分享你的 vibe coding 故事',
      s1: {
        title: '放弃月入过万，他在农村小学带孩子们“用AI赶苍蝇”',
        author: '小学老师小浩'
      },
      s2: {
        title: '期末考试周，我偷偷用AI造了个“校园闲鱼”',
        author: '一位大二学生'
      },
      s3: {
        title: '我给每个学生，做了一个不会累的“学霸同桌”',
        author: '高中信息技术老师'
      },
      s4: {
        title: '48岁货车司机，熬了几个通宵，硬是用AI磕出一个出海工具站',
        author: '货车司机老黄'
      },
      authorPrefix: '讲述者：',
      ui: {
        prevLabel: '上一则故事',
        nextLabel: '下一则故事',
        selectLabel: '查看这个故事',
        imageAlt: '用户故事封面'
      }
    },
    stage1: {
      cat: 'Stage 1 · 零基础入门',
      title: '没有技术背景？<br><span class="highlight">正好。</span>',
      sub: '不看专业、不看出身——会说话，你就能做产品。',
      cards: [
        {
          title: '学习地图',
          desc: '了解从零基础到全栈开发的完整学习路径，明确每个阶段的目标和收获。',
          sub: '全年龄友好',
          link: '/zh-cn/stage-1/learning-map/'
        },
        {
          title: '游戏化入门',
          desc: '通过制作贪吃蛇等 AI 原生小游戏，体验 AI 编程的魅力，打破对代码的恐惧。',
          sub: '边玩边学',
          link: '/zh-cn/stage-1/ai-capabilities-through-games/'
        },
        {
          title: '产品原型实战',
          desc: '掌握 Vibe Coding 工作流，从想法到可交互原型，独立完成高保真 Web 应用。',
          sub: '核心心法',
          link: '/zh-cn/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · 初中级开发',
      title: '一个人，<br><span class="highlight">就是一支团队。</span>',
      sub: '从前端到后端，从数据库到上线。',
      cards: [
        {
          title: '素材生成 Agent',
          headline: '先把素材生产提速。',
          desc: '从 Lovart 和 Nanobanana 出发，搭建自己的素材生产工作流和绘图 Agent。',
          link: '/zh-cn/stage-2/frontend/lovart-assets/'
        },
        {
          title: 'Figma 与 MasterGo',
          headline: '先把设计工具用顺。',
          desc: '掌握专业 UI 设计工具的基础操作，理解从设计稿到开发协作的关键链路。',
          link: '/zh-cn/stage-2/frontend/figma-mastergo/'
        },
        {
          title: '设计稿转代码',
          headline: '把原型真正变成页面。',
          desc: '学习如何将设计原型转成可以在浏览器里运行的前端代码，减少手工重搭。',
          link: '/zh-cn/stage-2/frontend/design-to-code/'
        },
        {
          title: '真实数据项目',
          headline: '连上真正的数据库。',
          desc: '在 Supabase 上设计数据表和权限，用真实读写操作支撑你的产品数据层。',
          link: '/zh-cn/stage-2/backend/database-supabase/'
        },
        {
          title: '部署上线',
          headline: '让世界看到你的作品。',
          desc: '使用 CloudBase、Vercel、Zeabur 等平台，一口气打通从代码到公网访问的完整流程。',
          link: '/zh-cn/stage-2/backend/zeabur-deployment/'
        },
        {
          title: 'AI 知识库集成',
          headline: '让应用接上智能问答。',
          desc: '学习用 Dify 构建 AI 应用和知识库，把检索增强能力接进你的真实产品。',
          link: '/zh-cn/stage-2/ai-capabilities/dify-knowledge-base/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · 高级开发',
      title: '产品和结果，<br><span class="highlight">我全都要。</span>',
      sub: '突破时间与设备限制，让 AI 产品随处可见。',
      cards: [
        {
          title: '跨平台桌面应用',
          desc: '用 Electron 做语音转文字桌面程序，一次开发同时跑在 Windows、macOS、Linux。',
          link: '/zh-cn/stage-3/cross-platform/electron-voice-to-text/'
        },
        {
          title: 'AI 智能体团队',
          desc: '用 Claude Agent Teams 组建 AI 开发小队，多代理协作完成大型任务。',
          link: '/zh-cn/stage-3/core-skills/agent-teams/'
        },
        {
          title: '长效稳定执行',
          desc: '用循环脚本和 Ralph 插件管理长时间任务，让 Claude Code 过夜稳定跑完工作。',
          link: '/zh-cn/stage-3/core-skills/long-running-tasks/'
        },
        {
          title: '个人品牌与输出',
          desc: '搭建个人网站与技术博客，让你的项目和经验长期沉淀并被更多人看到。',
          link: '/zh-cn/stage-3/personal-brand/personal-website-blog/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · 附录',
      title: '让代码，<br><span class="highlight">活灵活现。</span>',
      sub: '告别晦涩的文字堆砌。用动态演示和实时交互，重新定义技术文档。',
      cards: [
        {
          title: 'AI 进化史',
          desc: '回顾人工智能发展历程中的关键里程碑。',
          link: '/zh-cn/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: '提示词工程',
          desc: '掌握与 AI 高效对话的技巧，解锁潜力。',
          link: '/zh-cn/appendix/8-artificial-intelligence/prompt-engineering'
        },
        {
          title: '大语言模型',
          desc: '深入浅出解析 LLM 的工作原理与应用。',
          link: '/zh-cn/appendix/8-artificial-intelligence/llm-principles'
        },
        {
          title: 'Agent 智能体',
          desc: '探索具备自主决策与执行能力的 AI 架构。',
          link: '/zh-cn/appendix/8-artificial-intelligence/ai-agents'
        },
        {
          title: '前端基础',
          desc: 'HTML/CSS/JS 三大基石，入门必修课。',
          link: '/zh-cn/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: '前端进化史',
          desc: '了解前端技术栈演变，把握发展趋势。',
          link: '/zh-cn/appendix/3-browser-and-frontend/frontend-frameworks'
        },
        {
          title: '后端架构',
          desc: '从单体到微服务，探索架构演进之路。',
          link: '/zh-cn/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: '后端语言',
          desc: '对比主流后端语言特性，选择最佳技术栈。',
          link: '/zh-cn/appendix/4-server-and-backend/backend-languages'
        },
        {
          title: '数据库原理',
          desc: '理解数据库核心原理，掌握数据存储艺术。',
          link: '/zh-cn/appendix/5-data/database-fundamentals'
        },
        {
          title: 'API 设计',
          desc: 'API 接口设计与开发的基础知识。',
          link: '/zh-cn/appendix/4-server-and-backend/api-intro'
        },
        {
          title: 'Git 版本控制',
          desc: '深入理解 Git 原理与高级用法。',
          link: '/zh-cn/appendix/2-development-tools/git-version-control'
        },
        {
          title: '计算机网络',
          desc: '网络协议与通信原理的基础知识。',
          link: '/zh-cn/appendix/1-computer-fundamentals/computer-networks'
        }
      ]
    },
    footer: {
      title: '你的想法，<br>此刻上线。',
      desc: '灵感到现实，何不从现在开始。',
      btn: '>_ Start'
    }
  },
  en: {
    nav: {
      title: 'Easy-Vibe Tutorial',
      home: 'Home',
      stories: 'Vibe Stories',
      pm: 'Product Manager',
      junior: 'Junior Dev',
      senior: 'Senior Dev',
      appendix: 'Appendix',
      start: 'Start Learning'
    },
    stories: {
      cat: 'Vibe Stories',
      title: 'Meet every <br><span class="highlight">shining builder.</span>',
      sub: 'See how people from different backgrounds use AI to solve real problems.',
      s1: {
        title:
          'He gave up a high salary to help rural kids "fight flies" with AI',
        author: 'Xiaohao, primary school teacher'
      },
      s2: {
        title:
          'During finals week, I secretly built a campus marketplace with AI',
        author: 'A sophomore student'
      },
      s3: {
        title: 'I built every student a tireless AI study buddy',
        author: 'A high school IT teacher'
      },
      s4: {
        title:
          'A 48-year-old truck driver stayed up for nights to build an overseas AI tool site',
        author: 'Lao Huang, truck driver'
      },
      authorPrefix: 'By',
      ui: {
        prevLabel: 'Previous story',
        nextLabel: 'Next story',
        selectLabel: 'View this story',
        imageAlt: 'Vibe story cover'
      }
    },
    stage1: {
      cat: 'Stage 1 · Getting Started',
      title: 'Zero to Hero, <br><span class="highlight">Be Your Own PM.</span>',
      sub: 'No CS background needed. Just speak your ideas—AI will turn them into high-fidelity web prototypes.',
      cards: [
        {
          title: 'Learning Map',
          desc: 'Understand the complete learning path from zero to full-stack development.',
          sub: 'All Ages Friendly',
          link: '/en/stage-1/learning-map/'
        },
        {
          title: 'Gamified Intro',
          desc: 'Experience the magic of AI programming by building games like Snake.',
          sub: 'Learn by Playing',
          link: '/en/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'Master the core of AI coding: From product ideas to interactive prototypes.',
          sub: 'Core Mindset',
          link: '/en/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · Junior/Mid Dev',
      title:
        'Go Full Stack, <br><span class="highlight">Build Real Apps.</span>',
      sub: 'Understand the full journey from frontend to backend, database and deployment.',
      cards: [
        {
          title: 'Asset Agent',
          headline: 'Speed up content production.',
          desc: 'Build your own design-asset workflow and drawing agent with Lovart and Nanobanana.',
          link: '/en/stage-2/frontend/lovart-assets/'
        },
        {
          title: 'Figma & MasterGo',
          headline: 'Get fluent with design tools.',
          desc: 'Learn the basics of modern UI design tools and how design files flow into development.',
          link: '/en/stage-2/frontend/figma-mastergo/'
        },
        {
          title: 'Design to Code',
          headline: 'Turn mockups into pages.',
          desc: 'Convert prototypes into real frontend code that runs in the browser instead of staying as static designs.',
          link: '/en/stage-2/frontend/design-to-code/'
        },
        {
          title: 'Real Data Project',
          headline: 'Backed by a real DB.',
          desc: 'Design tables and permissions on Supabase and wire them into real read/write flows.',
          link: '/en/stage-2/backend/database-supabase/'
        },
        {
          title: 'Deployment',
          headline: 'Ship it to the world.',
          desc: 'Use CloudBase, Vercel and Zeabur to turn local projects into publicly reachable sites.',
          link: '/en/stage-2/backend/zeabur-deployment/'
        },
        {
          title: 'AI Knowledge Base',
          headline: 'Plug AI into the app.',
          desc: 'Use Dify to build AI workflows and knowledge-base powered product experiences.',
          link: '/en/stage-2/ai-capabilities/dify-knowledge-base/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · Senior Dev',
      title:
        'Advanced Practice, <br><span class="highlight">Infinite Possibilities.</span>',
      sub: 'Cross-platform apps and AI-native workflows, powered by Claude Code.',
      cards: [
        {
          title: 'Electron Desktop App',
          desc: 'Build a speech-to-text desktop app that runs on Windows, macOS and Linux from one codebase.',
          link: '/en/stage-3/cross-platform/electron-voice-to-text/'
        },
        {
          title: 'Agent Teams',
          desc: 'Use Claude Agent Teams to orchestrate multiple agents like a real dev team.',
          link: '/en/stage-3/core-skills/agent-teams/'
        },
        {
          title: 'Long-running Tasks',
          desc: 'Design loops and task queues so Claude Code can safely run overnight until work is truly done.',
          link: '/en/stage-3/core-skills/long-running-tasks/'
        },
        {
          title: 'Personal Brand',
          desc: 'Build your own website and tech blog to showcase projects and writing.',
          link: '/en/stage-3/personal-brand/personal-website-blog/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI History',
          desc: 'Milestones in AI evolution.',
          link: '/en/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Prompt Eng',
          desc: 'Master AI communication skills.',
          link: '/en/appendix/8-artificial-intelligence/prompt-engineering'
        },
        {
          title: 'LLM Intro',
          desc: 'Understanding Large Language Models.',
          link: '/en/appendix/8-artificial-intelligence/llm-principles'
        },
        {
          title: 'AI Agents',
          desc: 'Autonomous decision-making AI.',
          link: '/en/appendix/8-artificial-intelligence/ai-agents'
        },
        {
          title: 'Web Basics',
          desc: 'HTML/CSS/JS fundamentals.',
          link: '/en/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Frontend Evo',
          desc: 'Evolution of frontend tech stack.',
          link: '/en/appendix/3-browser-and-frontend/frontend-frameworks'
        },
        {
          title: 'Backend Arch',
          desc: 'From monolith to microservices.',
          link: '/en/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'Backend Lang',
          desc: 'Choosing the right tech stack.',
          link: '/en/appendix/4-server-and-backend/backend-languages'
        },
        {
          title: 'Database',
          desc: 'Core principles of data storage.',
          link: '/en/appendix/5-data/database-fundamentals'
        },
        {
          title: 'API Design',
          desc: 'Designing robust interfaces.',
          link: '/en/appendix/4-server-and-backend/api-intro'
        },
        {
          title: 'Git',
          desc: 'Version control mastery.',
          link: '/en/appendix/2-development-tools/git-version-control'
        },
        {
          title: 'Networks',
          desc: 'Protocols and communication.',
          link: '/en/appendix/1-computer-fundamentals/computer-networks'
        }
      ]
    },
    footer: {
      title: 'Ready to start?',
      desc: 'Easy-Vibe, make coding as natural as breathing.',
      btn: 'Start Now'
    }
  },
  'ja-jp': {
    nav: {
      title: 'Easy-Vibe チュートリアル',
      home: 'ホーム',
      stories: 'ユーザーストーリー',
      pm: 'プロダクトマネージャー',
      junior: '初中級開発者',
      senior: '上級開発者',
      appendix: '付録',
      start: '学習を開始'
    },
    stories: {
      cat: 'ユーザーストーリー',
      title: 'それぞれの<br><span class="highlight">輝く物語を見よう。</span>',
      sub: 'さまざまな背景の人たちが、AIで現実の課題をどう解決したかを紹介します。',
      s1: {
        title:
          '高収入の仕事を辞め、農村の子どもたちとAIで「ハエ対策」アプリを作った先生',
        author: '小学校教師 小浩'
      },
      s2: {
        title: '期末試験の週に、AIでこっそり「学内版フリマ」を作った',
        author: '大学2年生'
      },
      s3: {
        title: '生徒一人ひとりに、疲れない「AI優等生の隣の席」を作った',
        author: '高校の情報技術教師'
      },
      s4: {
        title:
          '48歳のトラック運転手が、徹夜で海外向けAIツールサイトを作り上げた',
        author: 'トラック運転手 老黄'
      },
      authorPrefix: '語り手：',
      ui: {
        prevLabel: '前のストーリー',
        nextLabel: '次のストーリー',
        selectLabel: 'このストーリーを見る',
        imageAlt: 'ユーザーストーリーのカバー'
      }
    },
    stage1: {
      cat: 'Stage 1 · 初心者とPM',
      title:
        'ゼロからの入門、<br><span class="highlight">自分だけのPMになる。</span>',
      sub: 'CSの背景は不要。アイデアを話すだけで、AIが高精度のWebプロトタイプに変換します。',
      cards: [
        {
          title: 'AI PM',
          desc: 'アイデアからプロトタイプまで、話すだけ。',
          sub: '非技術者向け',
          link: '/ja-jp/stage-1/learning-map/'
        },
        {
          title: 'ゲーム化入門',
          desc: 'スネークゲームやテトリスを作って、コードへの恐怖を克服。',
          sub: '遊びながら学ぶ',
          link: '/ja-jp/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'AI時代のコーディングの核心：プロンプトエンジニアリングとコンテキスト管理。',
          sub: '核心的な考え方',
          link: '/ja-jp/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · 初中級開発者',
      title:
        'フルスタックへ、<br><span class="highlight">リアルなアプリを構築。</span>',
      sub: 'フロントエンドとバックエンドの分離をマスター。DB、API、複雑なインタラクションを含む商用レベルのプロジェクトを構築。',
      cards: [
        {
          title: 'フルスタック',
          headline: 'フロント＆バックエンド。',
          desc: 'DB設計からAPI、コンポーネントまで、現代的なWebアプリを完全に構築。',
          link: '/ja-jp/stage-2/'
        },
        {
          title: 'リアルプロジェクト',
          headline: 'おもちゃのコードは卒業。',
          desc: '認証、ストレージ、ファイルアップロード、コアビジネスロジックを深く掘り下げる。',
          link: '/ja-jp/stage-2/'
        },
        {
          title: 'デプロイ',
          headline: '世界に公開。',
          desc: 'サーバー設定、DNS、CI/CD。製品リリースのラストワンマイル。',
          link: '/ja-jp/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · 上級開発者',
      title: '高度な実践、<br><span class="highlight">無限の可能性。</span>',
      sub: 'モバイルミニプログラムとAIネイティブアプリ。LLM時代の可能性を探求。',
      cards: [
        {
          title: 'WeChatミニアプリ',
          desc: 'クロスプラットフォーム開発、数億人のユーザーに到達。',
          link: '/ja-jp/stage-3/'
        },
        {
          title: 'AIネイティブアプリ',
          desc: 'RAG、Agent。LLMの限界を探る。',
          link: '/ja-jp/stage-3/'
        },
        {
          title: '複雑なアーキテクチャ',
          desc: '高並行性、高可用性のアーキテクチャ設計。',
          link: '/ja-jp/stage-3/'
        },
        {
          title: 'パーソナルブランド',
          desc: '自分のウェブサイトと学術ブログを構築。',
          link: '/ja-jp/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · 付録',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/ja-jp/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/ja-jp/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/ja-jp/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/ja-jp/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: '準備はいいですか？',
      desc: 'Easy-Vibe、呼吸するように自然にコーディング。',
      btn: '今すぐ開始'
    }
  },
  'zh-tw': {
    nav: {
      title: 'Easy-Vibe 教學',
      home: '首頁',
      stories: '使用者故事',
      pm: '產品經理',
      junior: '初中級開發',
      senior: '高級開發',
      appendix: '附錄',
      start: '開始學習'
    },
    stories: {
      cat: '使用者故事',
      title: '看見每一個<br><span class="highlight">閃光的你。</span>',
      sub: '看看不同背景的人，如何用 AI 解決真實問題、做出真實產品。',
      s1: {
        title: '放棄月入過萬，他在鄉村小學帶孩子們「用 AI 趕蒼蠅」',
        author: '小學老師小浩'
      },
      s2: {
        title: '期末考週，我偷偷用 AI 做了個「校園閒魚」',
        author: '一位大二學生'
      },
      s3: {
        title: '我給每個學生，做了一個不會累的「學霸同桌」',
        author: '高中資訊科技老師'
      },
      s4: {
        title: '48 歲貨車司機熬了幾個通宵，硬是用 AI 做出一個出海工具站',
        author: '貨車司機老黃'
      },
      authorPrefix: '講述者：',
      ui: {
        prevLabel: '上一則故事',
        nextLabel: '下一則故事',
        selectLabel: '查看這個故事',
        imageAlt: '使用者故事封面'
      }
    },
    stage1: {
      cat: 'Stage 1 · 新手與產品原型',
      title:
        '零基礎入門，<br><span class="highlight">做自己的產品經理。</span>',
      sub: '不需要計算機專業背景，只要會說話，就能通過 AI 將你的創意轉化為高保真的 Web 原型。',
      cards: [
        {
          title: 'AI 產品經理',
          desc: '從想法到高保真原型，你只需要會說話。',
          sub: '適合非技術背景',
          link: '/zh-tw/stage-1/learning-map/'
        },
        {
          title: '遊戲化入門',
          desc: '通過製作貪吃蛇、俄羅斯方塊，打破對代碼的恐懼。',
          sub: '邊玩邊學',
          link: '/zh-tw/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: '掌握 AI 時代的編程核心：提示詞工程與上下文管理。',
          sub: '核心心法',
          link: '/zh-tw/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · 初中級開發',
      title: '深入全棧，<br><span class="highlight">構建真實應用。</span>',
      sub: '掌握前後端分離架構，親手打造包含數據庫、API 和複雜交互的完整商業級項目。',
      cards: [
        {
          title: '全棧開發',
          headline: '獨立完成前後端。',
          desc: '從數據庫設計到 API 開發，再到前端組件化，完整構建一個現代化 Web 應用。',
          link: '/zh-tw/stage-2/'
        },
        {
          title: '真實項目',
          headline: '拒絕玩具代碼。',
          desc: '深入理解用戶鑑權、數據存儲、文件上傳等核心業務邏輯。',
          link: '/zh-tw/stage-2/'
        },
        {
          title: '部署上線',
          headline: '讓世界看到你的作品。',
          desc: '學習服務器配置、域名解析和自動化部署，打通產品落地的最後一公里。',
          link: '/zh-tw/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · 高級開發',
      title: '高階實戰，<br><span class="highlight">挑戰無限可能。</span>',
      sub: '進軍移動端小程序與 AI 原生應用開發，探索大模型時代的無限機遇。',
      cards: [
        {
          title: '微信小程序',
          desc: '跨平台開發，觸達億級用戶。',
          link: '/zh-tw/stage-3/'
        },
        {
          title: 'AI 原生應用',
          desc: 'RAG、Agent，探索 LLM 的無限可能。',
          link: '/zh-tw/stage-3/'
        },
        {
          title: '複雜業務架構',
          desc: '應對高並發、高可用場景的架構設計。',
          link: '/zh-tw/stage-3/'
        },
        {
          title: '個人品牌',
          desc: '構建屬於自己的個人網頁與學術博客。',
          link: '/zh-tw/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · 附錄',
      title: '百科全書，<br><span class="highlight">夯實基礎。</span>',
      sub: '從計算機網絡到 AI 原理，補齊你的技術拼圖。',
      cards: [
        {
          title: '人工智能',
          desc: 'LLM、Agent、RAG，深入 AI 底層原理。',
          link: '/zh-tw/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: '前端開發',
          desc: '瀏覽器原理、性能優化、Canvas 圖形學。',
          link: '/zh-tw/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: '後端架構',
          desc: '高並發、分佈式、微服務架構設計。',
          link: '/zh-tw/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: '通用技能',
          desc: 'Git、網絡、IDE 原理，開發者必備素養。',
          link: '/zh-tw/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: '準備好開始了嗎？',
      desc: 'Easy-Vibe，讓編程像呼吸一樣自然。',
      btn: '立即開啟'
    }
  },
  'ko-kr': {
    nav: {
      title: 'Easy-Vibe 튜토리얼',
      home: '홈',
      stories: '사용자 이야기',
      pm: '제품 관리자',
      junior: '초/중급 개발자',
      senior: '고급 개발자',
      appendix: '부록',
      start: '학습 시작'
    },
    stories: {
      cat: '사용자 이야기',
      title:
        '빛나는 모두의<br><span class="highlight">이야기를 만나보세요.</span>',
      sub: '서로 다른 배경의 사람들이 AI로 현실의 문제를 어떻게 해결했는지 살펴보세요.',
      s1: {
        title:
          '높은 월급을 포기하고 시골 초등학교 아이들과 AI로 "파리 막기"를 만든 선생님',
        author: '초등학교 교사 샤오하오'
      },
      s2: {
        title: '기말고사 주간에 몰래 AI로 "캠퍼스 중고장터"를 만든 이야기',
        author: '대학교 2학년 학생'
      },
      s3: {
        title: '모든 학생에게 지치지 않는 "AI 우등생 짝꿍"을 만들어 준 선생님',
        author: '고등학교 정보기술 교사'
      },
      s4: {
        title:
          '48세 트럭 운전사가 며칠 밤을 새워 해외용 AI 툴 사이트를 만든 이야기',
        author: '트럭 운전사 라오황'
      },
      authorPrefix: '화자:',
      ui: {
        prevLabel: '이전 이야기',
        nextLabel: '다음 이야기',
        selectLabel: '이 이야기 보기',
        imageAlt: '사용자 이야기 표지'
      }
    },
    stage1: {
      cat: 'Stage 1 · 초보자 & PM',
      title:
        '제로 베이스 입문,<br><span class="highlight">나만의 PM이 되다.</span>',
      sub: 'CS 배경지식이 없어도 괜찮습니다. 아이디어를 말하기만 하면 AI가 고품질 웹 프로토타입으로 변환해줍니다.',
      cards: [
        {
          title: 'AI 제품 관리자',
          desc: '아이디어에서 프로토타입까지, 말 한마디로.',
          sub: '비전공자 추천',
          link: '/ko-kr/stage-1/learning-map/'
        },
        {
          title: '게임으로 입문',
          desc: '스네이크 게임, 테트리스를 만들며 코딩 공포증 극복.',
          sub: '놀면서 배우기',
          link: '/ko-kr/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'AI 시대 코딩의 핵심: 프롬프트 엔지니어링과 컨텍스트 관리.',
          sub: '핵심 마인드셋',
          link: '/ko-kr/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · 초/중급 개발자',
      title: '풀스택 심화,<br><span class="highlight">실제 앱 구축.</span>',
      sub: '프론트엔드-백엔드 분리 아키텍처 마스터. DB, API, 복잡한 상호작용이 포함된 상용급 프로젝트 구축.',
      cards: [
        {
          title: '풀스택 개발',
          headline: '프론트 & 백엔드 독립 완성.',
          desc: 'DB 설계부터 API 개발, 프론트엔드 컴포넌트화까지 현대적인 웹 앱을 완벽하게 구축.',
          link: '/ko-kr/stage-2/'
        },
        {
          title: '실전 프로젝트',
          headline: '장난감 코드는 그만.',
          desc: '사용자 인증, 데이터 저장, 파일 업로드 등 핵심 비즈니스 로직 심층 이해.',
          link: '/ko-kr/stage-2/'
        },
        {
          title: '배포 및 출시',
          headline: '세상에 보여주세요.',
          desc: '서버 설정, 도메인 연결, CI/CD. 제품 출시의 마지막 관문.',
          link: '/ko-kr/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · 고급 개발자',
      title:
        '고급 실전,<br><span class="highlight">무한한 가능성에 도전.</span>',
      sub: '모바일 미니 프로그램 및 AI 네이티브 앱 개발. LLM 시대의 무한한 기회 탐색.',
      cards: [
        {
          title: '위챗 미니프로그램',
          desc: '크로스 플랫폼 개발, 수억 명의 사용자 도달.',
          link: '/ko-kr/stage-3/'
        },
        {
          title: 'AI 네이티브 앱',
          desc: 'RAG, Agent. LLM의 한계 탐색.',
          link: '/ko-kr/stage-3/'
        },
        {
          title: '복잡한 아키텍처',
          desc: '고동시성, 고가용성 아키텍처 설계.',
          link: '/ko-kr/stage-3/'
        },
        {
          title: '퍼스널 브랜딩',
          desc: '나만의 웹사이트와 학술 블로그 구축.',
          link: '/ko-kr/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · 부록',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/ko-kr/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/ko-kr/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/ko-kr/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/ko-kr/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: '시작할 준비 되셨나요?',
      desc: 'Easy-Vibe, 숨 쉬듯 자연스러운 코딩.',
      btn: '지금 시작하기'
    }
  },
  'es-es': {
    nav: {
      title: 'Tutorial Easy-Vibe',
      home: 'Inicio',
      stories: 'Historias de usuarios',
      pm: 'Gerente de Producto',
      junior: 'Desarrollador Junior',
      senior: 'Desarrollador Senior',
      appendix: 'Apéndice',
      start: 'Empezar'
    },
    stories: {
      cat: 'Historias de usuarios',
      title:
        'Conoce cada <br><span class="highlight">historia que brilla.</span>',
      sub: 'Descubre cómo personas de distintos contextos usan la IA para resolver problemas reales.',
      s1: {
        title:
          'Dejó un salario de cinco cifras para ayudar a niños rurales a "ahuyentar moscas" con IA',
        author: 'Xiaohao, maestro de primaria rural'
      },
      s2: {
        title:
          'Durante la semana de finales, construí en secreto un mercado universitario con IA',
        author: 'Una estudiante de segundo año'
      },
      s3: {
        title:
          'Le construí a cada alumno un compañero de estudio con IA que nunca se cansa',
        author: 'Un profesor de informática de secundaria'
      },
      s4: {
        title:
          'Un camionero de 48 años pasó varias noches despierto para crear una web de herramientas de IA para el extranjero',
        author: 'Lao Huang, camionero'
      },
      authorPrefix: 'Por',
      ui: {
        prevLabel: 'Historia anterior',
        nextLabel: 'Siguiente historia',
        selectLabel: 'Ver esta historia',
        imageAlt: 'Portada de la historia'
      }
    },
    stage1: {
      cat: 'Stage 1 · Principiante y PM',
      title:
        'De Cero a Héroe,<br><span class="highlight">Sé tu propio PM.</span>',
      sub: 'No necesitas experiencia en CS. Solo di tu idea y la IA la convertirá en prototipos web de alta fidelidad.',
      cards: [
        {
          title: 'PM de IA',
          desc: 'De la idea al prototipo, solo hablando.',
          sub: 'Amigable para no técnicos',
          link: '/es-es/stage-1/learning-map/'
        },
        {
          title: 'Intro Gamificada',
          desc: 'Crea Snake, Tetris y rompe el miedo al código.',
          sub: 'Aprende jugando',
          link: '/es-es/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'Domina el núcleo de la programación con IA: Ingeniería de Prompts y Contexto.',
          sub: 'Mentalidad Clave',
          link: '/es-es/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · Desarrollador Junior/Mid',
      title: 'Full Stack,<br><span class="highlight">Crea Apps Reales.</span>',
      sub: 'De la base de datos al despliegue: conecta frontend, backend y operaciones en un solo recorrido.',
      cards: [
        {
          title: 'Mapa de la Etapa',
          headline: 'Primero entiende el recorrido completo.',
          desc: 'Revisa la vista general de Stage 2 para ver cómo encajan frontend, backend, DB y despliegue.',
          link: '/es-es/stage-2/'
        },
        {
          title: 'Proyecto con DB real',
          headline: 'Supabase como base de datos de verdad.',
          desc: 'Diseña tablas y permisos en Supabase y conéctalos a flujos reales de lectura/escritura.',
          link: '/es-es/stage-2/backend/database-supabase/'
        },
        {
          title: 'Despliegue en producción',
          headline: 'Lleva tu app al mundo real.',
          desc: 'Usa CloudBase, Vercel y Zeabur para convertir tu código local en un sitio público.',
          link: '/es-es/stage-2/backend/zeabur-deployment/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · Desarrollador Senior',
      title:
        'Práctica Avanzada,<br><span class="highlight">Posibilidades Infinitas.</span>',
      sub: 'Apps multiplataforma y flujos de trabajo AI-native impulsados por Claude Code.',
      cards: [
        {
          title: 'App de escritorio multiplataforma',
          desc: 'Crea con Electron una app de voz a texto que funciona en Windows, macOS y Linux con una sola base de código.',
          link: '/es-es/stage-3/cross-platform/electron-voice-to-text/'
        },
        {
          title: 'Equipos de agentes IA',
          desc: 'Usa Claude Agent Teams para orquestar varios agentes como si fueran un equipo de desarrollo real.',
          link: '/es-es/stage-3/core-skills/agent-teams/'
        },
        {
          title: 'Tareas de larga duración',
          desc: 'Diseña bucles y colas de tareas para que Claude Code pueda trabajar durante horas de forma estable.',
          link: '/es-es/stage-3/core-skills/long-running-tasks/'
        },
        {
          title: 'Marca personal',
          desc: 'Construye tu sitio web y blog técnico para dar visibilidad a tus proyectos.',
          link: '/es-es/stage-3/personal-brand/personal-website-blog/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · Apéndice',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/es-es/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/es-es/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/es-es/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/es-es/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: '¿Listo para empezar?',
      desc: 'Easy-Vibe, haz que programar sea tan natural como respirar.',
      btn: 'Empezar Ahora'
    }
  },
  'fr-fr': {
    nav: {
      title: 'Tutoriel Easy-Vibe',
      home: 'Accueil',
      stories: 'Histoires d’utilisateurs',
      pm: 'Chef de Produit',
      junior: 'Dév Junior',
      senior: 'Dév Senior',
      appendix: 'Annexe',
      start: 'Commencer'
    },
    stories: {
      cat: 'Histoires d’utilisateurs',
      title:
        'Découvrez chaque <br><span class="highlight">parcours inspirant.</span>',
      sub: 'Voyez comment des personnes de tous horizons utilisent l’IA pour résoudre de vrais problèmes.',
      s1: {
        title:
          'Il a quitté un salaire confortable pour aider des enfants d’une école rurale à "chasser les mouches" avec l’IA',
        author: 'Xiaohao, instituteur'
      },
      s2: {
        title:
          'Pendant la semaine des examens, j’ai secrètement créé une marketplace de campus avec l’IA',
        author: 'Une étudiante de deuxième année'
      },
      s3: {
        title:
          'J’ai créé pour chaque élève un binôme d’étude IA qui ne se fatigue jamais',
        author: 'Un professeur d’informatique au lycée'
      },
      s4: {
        title:
          'Un chauffeur routier de 48 ans a veillé plusieurs nuits pour lancer un site d’outils IA à l’international',
        author: 'Lao Huang, chauffeur routier'
      },
      authorPrefix: 'Par',
      ui: {
        prevLabel: 'Histoire précédente',
        nextLabel: 'Histoire suivante',
        selectLabel: 'Voir cette histoire',
        imageAlt: 'Couverture de l’histoire'
      }
    },
    stage1: {
      cat: 'Stage 1 · Débutant & PM',
      title:
        'De Zéro à Héros,<br><span class="highlight">Soyez votre propre PM.</span>',
      sub: "Pas besoin de background CS. Parlez juste de votre idée, et l'IA la transformera en prototypes web haute fidélité.",
      cards: [
        {
          title: 'PM IA',
          desc: "De l'idée au prototype, juste en parlant.",
          sub: 'Accessible aux non-tech',
          link: '/fr-fr/stage-1/learning-map/'
        },
        {
          title: 'Intro Gamifiée',
          desc: 'Créez Snake, Tetris et brisez la peur du code.',
          sub: 'Apprendre en jouant',
          link: '/fr-fr/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'Maîtrisez le cœur du codage IA : Prompt Engineering & Contexte.',
          sub: 'Esprit Clé',
          link: '/fr-fr/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · Dév Junior/Mid',
      title:
        'Full Stack,<br><span class="highlight">Créez de Vraies Apps.</span>',
      sub: 'Maîtrisez la séparation frontend-backend. Créez des projets commerciaux avec DB, API et interactions complexes.',
      cards: [
        {
          title: 'Full Stack',
          headline: 'Frontend & Backend.',
          desc: 'Du design DB aux API et composants, construisez une web app moderne complète.',
          link: '/fr-fr/stage-2/'
        },
        {
          title: 'Projets Réels',
          headline: 'Pas de code jouet.',
          desc: "Plongez dans l'Auth, le Stockage, l'Upload de fichiers et la logique métier.",
          link: '/fr-fr/stage-2/'
        },
        {
          title: 'Déploiement',
          headline: 'Montrez au monde.',
          desc: 'Config serveur, DNS, CI/CD. Le dernier kilomètre de la livraison produit.',
          link: '/fr-fr/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · Dév Senior',
      title:
        'Pratique Avancée,<br><span class="highlight">Possibilités Infinies.</span>',
      sub: "Mini-programmes mobiles et Apps Natives IA. Explorez l'ère des LLM.",
      cards: [
        {
          title: 'WeChat Mini-app',
          desc: "Dév multiplateforme, touchant des millions d'utilisateurs.",
          link: '/fr-fr/stage-3/'
        },
        {
          title: 'Apps Natives IA',
          desc: 'RAG, Agent. Explorez les limites des LLM.',
          link: '/fr-fr/stage-3/'
        },
        {
          title: 'Arch. Complexe',
          desc: "Conception d'architecture haute concurrence et haute disponibilité.",
          link: '/fr-fr/stage-3/'
        },
        {
          title: 'Marque Perso',
          desc: 'Construisez votre propre site web et blog académique.',
          link: '/fr-fr/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · Annexe',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/fr-fr/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/fr-fr/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/fr-fr/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/fr-fr/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: 'Prêt à commencer ?',
      desc: 'Easy-Vibe, rendez le codage aussi naturel que la respiration.',
      btn: 'Commencer'
    }
  },
  'de-de': {
    nav: {
      title: 'Easy-Vibe Tutorial',
      home: 'Startseite',
      stories: 'Nutzergeschichten',
      pm: 'Produktmanager',
      junior: 'Junior Dev',
      senior: 'Senior Dev',
      appendix: 'Anhang',
      start: 'Starten'
    },
    stories: {
      cat: 'Nutzergeschichten',
      title:
        'Entdecke jede <br><span class="highlight">inspirierende Geschichte.</span>',
      sub: 'Sieh, wie Menschen mit ganz unterschiedlichen Hintergründen mit KI echte Probleme lösen.',
      s1: {
        title:
          'Er gab ein hohes Gehalt auf, um Kindern auf dem Land mit KI beim "Fliegenvertreiben" zu helfen',
        author: 'Xiaohao, Grundschullehrer'
      },
      s2: {
        title:
          'In der Prüfungswoche habe ich heimlich mit KI einen Campus-Marktplatz gebaut',
        author: 'Eine Studentin im zweiten Jahr'
      },
      s3: {
        title:
          'Ich habe jedem Schüler einen unermüdlichen KI-Lernpartner gebaut',
        author: 'Ein Informatiklehrer an einer Oberschule'
      },
      s4: {
        title:
          'Ein 48-jähriger Lkw-Fahrer blieb mehrere Nächte wach, um eine internationale KI-Toolseite zu bauen',
        author: 'Lao Huang, Lkw-Fahrer'
      },
      authorPrefix: 'Von',
      ui: {
        prevLabel: 'Vorherige Geschichte',
        nextLabel: 'Nächste Geschichte',
        selectLabel: 'Diese Geschichte ansehen',
        imageAlt: 'Titelbild der Geschichte'
      }
    },
    stage1: {
      cat: 'Stage 1 · Anfänger & PM',
      title:
        'Von Null auf Hundert,<br><span class="highlight">Sei dein eigener PM.</span>',
      sub: 'Kein CS-Hintergrund nötig. Sprich einfach deine Idee aus, und KI verwandelt sie in High-Fidelity-Web-Prototypen.',
      cards: [
        {
          title: 'KI PM',
          desc: 'Von der Idee zum Prototyp, einfach durch Sprechen.',
          sub: 'Nicht-Tech-freundlich',
          link: '/de-de/stage-1/learning-map/'
        },
        {
          title: 'Gamifizierte Intro',
          desc: 'Baue Snake, Tetris und überwinde die Angst vor Code.',
          sub: 'Spielend lernen',
          link: '/de-de/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'Meistere den Kern des KI-Codings: Prompt Engineering & Kontext.',
          sub: 'Kern-Mindset',
          link: '/de-de/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · Junior/Mid Dev',
      title: 'Full Stack,<br><span class="highlight">Baue echte Apps.</span>',
      sub: 'Meistere die Frontend-Backend-Trennung. Baue kommerzielle Projekte mit DB, API und komplexen Interaktionen.',
      cards: [
        {
          title: 'Full Stack',
          headline: 'Frontend & Backend.',
          desc: 'Vom DB-Design bis zu APIs und Komponenten, baue eine moderne Web-App komplett.',
          link: '/de-de/stage-2/'
        },
        {
          title: 'Echte Projekte',
          headline: 'Kein Spielzeug-Code.',
          desc: 'Tauche ein in Auth, Speicher, Datei-Uploads und Kern-Geschäftslogik.',
          link: '/de-de/stage-2/'
        },
        {
          title: 'Deployment',
          headline: 'Zeig es der Welt.',
          desc: 'Server-Konfig, DNS, CI/CD. Die letzte Meile der Produktlieferung.',
          link: '/de-de/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · Senior Dev',
      title:
        'Fortgeschrittene Praxis,<br><span class="highlight">Unendliche Möglichkeiten.</span>',
      sub: 'Mobile Mini-Programme & KI-Native Apps. Erkunde die Ära der LLMs.',
      cards: [
        {
          title: 'WeChat Mini-App',
          desc: 'Plattformübergreifende Entwicklung, Millionen von Nutzern erreichen.',
          link: '/de-de/stage-3/'
        },
        {
          title: 'KI-Native Apps',
          desc: 'RAG, Agent. Erkunde die Grenzen von LLMs.',
          link: '/de-de/stage-3/'
        },
        {
          title: 'Komplexe Arch',
          desc: 'Architekturdesign für hohe Gleichzeitigkeit und hohe Verfügbarkeit.',
          link: '/de-de/stage-3/'
        },
        {
          title: 'Persönliche Marke',
          desc: 'Baue deine eigene Website und deinen akademischen Blog.',
          link: '/de-de/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · Anhang',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/de-de/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/de-de/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/de-de/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/de-de/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: 'Bereit zu starten?',
      desc: 'Easy-Vibe, mache Coden so natürlich wie Atmen.',
      btn: 'Jetzt starten'
    }
  },
  'ar-sa': {
    nav: {
      title: 'دليل Easy-Vibe',
      home: 'الرئيسية',
      stories: 'قصص المستخدمين',
      pm: 'مدير المنتج',
      junior: 'مطور مبتدئ',
      senior: 'مطور خبير',
      appendix: 'ملحق',
      start: 'ابدأ التعلم'
    },
    stories: {
      cat: 'قصص المستخدمين',
      title: 'تعرّف على كل <br><span class="highlight">قصة ملهمة.</span>',
      sub: 'اكتشف كيف يستخدم أشخاص من خلفيات مختلفة الذكاء الاصطناعي لحل مشكلات حقيقية.',
      s1: {
        title:
          'تخلّى عن راتب مرتفع ليساعد أطفال مدرسة ريفية على "طرد الذباب" باستخدام الذكاء الاصطناعي',
        author: 'شياوهاو، معلم مدرسة ابتدائية'
      },
      s2: {
        title:
          'خلال أسبوع الامتحانات النهائية، بنيت سرًا سوقًا جامعيًا باستخدام الذكاء الاصطناعي',
        author: 'طالبة في السنة الثانية'
      },
      s3: {
        title: 'صنعت لكل طالب زميل دراسة بالذكاء الاصطناعي لا يتعب أبدًا',
        author: 'معلم تقنية معلومات في الثانوية'
      },
      s4: {
        title:
          'سائق شاحنة يبلغ 48 عامًا سهر عدة ليالٍ ليبني موقع أدوات ذكاء اصطناعي للأسواق الخارجية',
        author: 'لاو هوانغ، سائق شاحنة'
      },
      authorPrefix: 'الراوي:',
      ui: {
        prevLabel: 'القصة السابقة',
        nextLabel: 'القصة التالية',
        selectLabel: 'عرض هذه القصة',
        imageAlt: 'غلاف القصة'
      }
    },
    stage1: {
      cat: 'Stage 1 · مدير المنتج',
      title:
        'من الصفر إلى الاحتراف،<br><span class="highlight">كن مدير منتجك الخاص.</span>',
      sub: 'لا حاجة لخلفية في علوم الحاسوب. فقط تحدث بفكرتك، وسيُحولها الذكاء الاصطناعي إلى نماذج ويب عالية الدقة.',
      cards: [
        {
          title: 'مدير منتج AI',
          desc: 'من الفكرة إلى النموذج الأولي، بمجرد التحدث.',
          sub: 'صديق لغير التقنيين',
          link: '/ar-sa/stage-1/learning-map/'
        },
        {
          title: 'مقدمة بالألعاب',
          desc: 'ابنِ Snake و Tetris واكسر حاجز الخوف من الكود.',
          sub: 'تعلم باللعب',
          link: '/ar-sa/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'أتقن جوهر برمجة الذكاء الاصطناعي: هندسة الأوامر والسياق.',
          sub: 'العقلية الأساسية',
          link: '/ar-sa/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · مطور مبتدئ/متوسط',
      title:
        'Full Stack،<br><span class="highlight">ابنِ تطبيقات حقيقية.</span>',
      sub: 'أتقن فصل الواجهة الأمامية عن الخلفية. ابنِ مشاريع تجارية مع قواعد بيانات و API وتفاعلات معقدة.',
      cards: [
        {
          title: 'Full Stack',
          headline: 'واجهة أمامية وخلفية.',
          desc: 'من تصميم DB إلى API والمكونات، ابنِ تطبيق ويب حديث بالكامل.',
          link: '/ar-sa/stage-2/'
        },
        {
          title: 'مشاريع حقيقية',
          headline: 'ليس كود ألعاب.',
          desc: 'تعمق في المصادقة، التخزين، رفع الملفات ومنطق العمل الأساسي.',
          link: '/ar-sa/stage-2/'
        },
        {
          title: 'النشر',
          headline: 'أظهر للعالم.',
          desc: 'إعداد الخادم، DNS، CI/CD. الميل الأخير لتسليم المنتج.',
          link: '/ar-sa/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · مطور خبير',
      title:
        'ممارسة متقدمة،<br><span class="highlight">إمكانيات لا نهائية.</span>',
      sub: 'برامج WeChat الصغيرة وتطبيقات AI الأصلية. استكشف عصر LLMs.',
      cards: [
        {
          title: 'برنامج WeChat المصغر',
          desc: 'تطوير متعدد المنصات، الوصول لملايين المستخدمين.',
          link: '/ar-sa/stage-3/'
        },
        {
          title: 'تطبيقات AI الأصلية',
          desc: 'RAG، Agent. استكشف حدود LLMs.',
          link: '/ar-sa/stage-3/'
        },
        {
          title: 'هندسة معقدة',
          desc: 'تصميم هندسة التزامن العالي والتوافر العالي.',
          link: '/ar-sa/stage-3/'
        },
        {
          title: 'العلامة التجارية الشخصية',
          desc: 'ابنِ موقعك الخاص ومدونتك الأكاديمية.',
          link: '/ar-sa/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · ملحق',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/ar-sa/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/ar-sa/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/ar-sa/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/ar-sa/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: 'جاهز للبدء؟',
      desc: 'Easy-Vibe، اجعل البرمجة طبيعية كالتنفس.',
      btn: 'ابدأ الآن'
    }
  },
  'vi-vn': {
    nav: {
      title: 'Hướng dẫn Easy-Vibe',
      home: 'Trang chủ',
      stories: 'Câu chuyện người dùng',
      pm: 'Quản lý sản phẩm',
      junior: 'Dev Sơ/Trung cấp',
      senior: 'Dev Cao cấp',
      appendix: 'Phụ lục',
      start: 'Bắt đầu học'
    },
    stories: {
      cat: 'Câu chuyện người dùng',
      title:
        'Gặp gỡ từng <br><span class="highlight">câu chuyện tỏa sáng.</span>',
      sub: 'Khám phá cách những người từ nhiều xuất phát điểm khác nhau dùng AI để giải quyết vấn đề thật.',
      s1: {
        title:
          'Anh bỏ mức lương cao để giúp trẻ em vùng quê "đuổi ruồi" bằng AI',
        author: 'Xiaohao, giáo viên tiểu học'
      },
      s2: {
        title:
          'Trong tuần thi cuối kỳ, tôi lặng lẽ làm một chợ đồ cũ trong trường bằng AI',
        author: 'Một sinh viên năm hai'
      },
      s3: {
        title: 'Tôi tạo cho mỗi học sinh một bạn học giỏi AI không biết mệt',
        author: 'Một giáo viên CNTT trung học'
      },
      s4: {
        title:
          'Một tài xế xe tải 48 tuổi thức trắng nhiều đêm để làm một website công cụ AI cho thị trường quốc tế',
        author: 'Lao Huang, tài xế xe tải'
      },
      authorPrefix: 'Người kể:',
      ui: {
        prevLabel: 'Câu chuyện trước',
        nextLabel: 'Câu chuyện tiếp theo',
        selectLabel: 'Xem câu chuyện này',
        imageAlt: 'Ảnh bìa câu chuyện'
      }
    },
    stage1: {
      cat: 'Stage 1 · Người mới & PM',
      title:
        'Từ số 0 đến Hero,<br><span class="highlight">Tự làm PM cho chính mình.</span>',
      sub: 'Không cần nền tảng CS. Chỉ cần nói ra ý tưởng, AI sẽ biến nó thành nguyên mẫu web độ trung thực cao.',
      cards: [
        {
          title: 'AI PM',
          desc: 'Từ ý tưởng đến nguyên mẫu, chỉ bằng lời nói.',
          sub: 'Thân thiện với non-tech',
          link: '/vi-vn/stage-1/learning-map/'
        },
        {
          title: 'Nhập môn qua Game',
          desc: 'Xây dựng Snake, Tetris và phá bỏ nỗi sợ code.',
          sub: 'Học mà chơi',
          link: '/vi-vn/stage-1/ai-capabilities-through-games/'
        },
        {
          title: 'Vibe Coding',
          desc: 'Nắm vững cốt lõi lập trình AI: Prompt Engineering & Context.',
          sub: 'Tư duy cốt lõi',
          link: '/vi-vn/stage-1/introduction-to-ai-ide/'
        }
      ]
    },
    stage2: {
      cat: 'Stage 2 · Dev Sơ/Trung cấp',
      title:
        'Full Stack,<br><span class="highlight">Xây dựng App thực tế.</span>',
      sub: 'Nắm vững tách biệt frontend-backend. Xây dựng dự án thương mại với DB, API và tương tác phức tạp.',
      cards: [
        {
          title: 'Full Stack',
          headline: 'Frontend & Backend.',
          desc: 'Từ thiết kế DB đến API và component, xây dựng trọn vẹn web app hiện đại.',
          link: '/vi-vn/stage-2/'
        },
        {
          title: 'Dự án thực tế',
          headline: 'Không phải code đồ chơi.',
          desc: 'Đi sâu vào Auth, Lưu trữ, Upload file và logic nghiệp vụ cốt lõi.',
          link: '/vi-vn/stage-2/'
        },
        {
          title: 'Triển khai',
          headline: 'Show cho thế giới.',
          desc: 'Cấu hình server, DNS, CI/CD. Chặng cuối của việc giao sản phẩm.',
          link: '/vi-vn/stage-2/'
        }
      ]
    },
    stage3: {
      cat: 'Stage 3 · Dev Cao cấp',
      title:
        'Thực hành nâng cao,<br><span class="highlight">Khả năng vô hạn.</span>',
      sub: 'Mini-app di động & Ứng dụng AI Native. Khám phá kỷ nguyên LLM.',
      cards: [
        {
          title: 'WeChat Mini-app',
          desc: 'Phát triển đa nền tảng, tiếp cận hàng triệu người dùng.',
          link: '/vi-vn/stage-3/'
        },
        {
          title: 'App AI Native',
          desc: 'RAG, Agent. Khám phá giới hạn của LLM.',
          link: '/vi-vn/stage-3/'
        },
        {
          title: 'Kiến trúc phức tạp',
          desc: 'Thiết kế kiến trúc chịu tải cao và sẵn sàng cao.',
          link: '/vi-vn/stage-3/'
        },
        {
          title: 'Thương hiệu cá nhân',
          desc: 'Xây dựng website và blog học thuật của riêng bạn.',
          link: '/vi-vn/stage-3/'
        }
      ]
    },
    appendix: {
      cat: 'Appendix · Phụ lục',
      title:
        'Encyclopedia, <br><span class="highlight">Solid Foundation.</span>',
      sub: 'From Computer Networks to AI Principles, complete your tech puzzle.',
      cards: [
        {
          title: 'AI Fundamentals',
          desc: 'LLM, Agent, RAG. Dive into AI internals.',
          link: '/vi-vn/appendix/8-artificial-intelligence/ai-history'
        },
        {
          title: 'Frontend',
          desc: 'Browser internals, Performance, Canvas.',
          link: '/vi-vn/appendix/3-browser-and-frontend/javascript-deep-dive'
        },
        {
          title: 'Backend',
          desc: 'High concurrency, Distributed systems, Microservices.',
          link: '/vi-vn/appendix/4-server-and-backend/backend-layered-architecture'
        },
        {
          title: 'General Skills',
          desc: 'Git, Networks, IDE internals.',
          link: '/vi-vn/appendix/2-development-tools/git-version-control'
        }
      ]
    },
    footer: {
      title: 'Sẵn sàng chưa?',
      desc: 'Easy-Vibe, biến lập trình trở nên tự nhiên như hơi thở.',
      btn: 'Bắt đầu ngay'
    }
  }
}

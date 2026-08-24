const stage1Paths = [
  'learning-map',
  'ai-capabilities-through-games',
  'introduction-to-ai-ide'
]

const stage2Paths = [
  'frontend/lovart-assets',
  'frontend/figma-mastergo',
  'frontend/design-to-code',
  'backend/database-supabase',
  'backend/zeabur-deployment',
  'ai-capabilities/dify-knowledge-base'
]

const stage3Paths = [
  'cross-platform/electron-voice-to-text',
  'core-skills/agent-teams',
  'core-skills/long-running-tasks',
  'personal-brand/personal-website-blog'
]

const appendixPaths = [
  '8-artificial-intelligence/ai-history',
  '8-artificial-intelligence/prompt-engineering',
  '8-artificial-intelligence/llm-principles',
  '8-artificial-intelligence/ai-agents',
  '3-browser-and-frontend/javascript-deep-dive',
  '3-browser-and-frontend/frontend-frameworks',
  '4-server-and-backend/backend-layered-architecture',
  '4-server-and-backend/backend-languages',
  '5-data/database-fundamentals',
  '4-server-and-backend/api-intro',
  '2-development-tools/git-version-control',
  '1-computer-fundamentals/computer-networks'
]

const localizedContent = {
  'zh-tw': {
    stage1: [
      ['學習地圖', '了解從零基礎到全端開發的完整學習路徑。', '全年齡友善'],
      [
        '遊戲化入門',
        '透過製作貪吃蛇等 AI 原生小遊戲，消除對程式碼的恐懼。',
        '邊玩邊學'
      ],
      [
        '產品原型實戰',
        '掌握 Vibe Coding 工作流程，從想法做到可互動的高擬真 Web 原型。',
        '核心心法'
      ]
    ],
    stage2: [
      [
        '素材生成 Agent',
        '先加速素材生產。',
        '從 Lovart 和 Nanobanana 出發，建立自己的素材工作流程與繪圖 Agent。'
      ],
      [
        'Figma 與 MasterGo',
        '先熟悉設計工具。',
        '掌握專業 UI 設計工具與設計稿交付開發的關鍵流程。'
      ],
      [
        '設計稿轉程式碼',
        '把原型真正變成頁面。',
        '將設計原型轉成可在瀏覽器執行的前端程式碼。'
      ],
      [
        '真實資料專案',
        '連上真正的資料庫。',
        '在 Supabase 設計資料表與權限，支援真實讀寫流程。'
      ],
      [
        '部署上線',
        '讓世界看見你的作品。',
        '使用 CloudBase、Vercel 與 Zeabur，打通從程式碼到公開網站的流程。'
      ],
      [
        'AI 知識庫整合',
        '讓應用接上智慧問答。',
        '使用 Dify 建立 AI 工作流程與知識庫，並整合到真實產品。'
      ]
    ],
    stage3Sub: '突破時間與裝置限制，讓 AI 產品隨處可用。',
    stage3: [
      [
        '跨平台桌面應用',
        '用 Electron 製作語音轉文字應用，一套程式碼支援 Windows、macOS 與 Linux。'
      ],
      [
        'AI 智慧體團隊',
        '使用 Claude Agent Teams 組織多個 Agent，像真正的開發團隊一樣協作。'
      ],
      [
        '長時間穩定執行',
        '設計循環與任務佇列，讓 Claude Code 能穩定執行過夜任務。'
      ],
      ['個人品牌與輸出', '建立個人網站與技術部落格，長期展示你的專案與文章。']
    ],
    appendixTitle: '讓程式碼，<br><span class="highlight">活靈活現。</span>',
    appendixSub: '告別艱澀的文字堆疊，用動態演示與即時互動重新定義技術文件。',
    appendix: [
      ['AI 發展史', '回顧人工智慧發展的重要里程碑。'],
      ['提示詞工程', '掌握與 AI 高效溝通的方法。'],
      ['大型語言模型', '理解 LLM 的運作原理與應用。'],
      ['AI Agent', '探索能自主決策與執行的 AI 架構。'],
      ['前端基礎', '掌握 HTML、CSS 與 JavaScript 三大基石。'],
      ['前端演進史', '了解前端技術棧的演變與趨勢。'],
      ['後端架構', '從單體到微服務，理解架構演進。'],
      ['後端語言', '比較主流後端語言並選擇技術棧。'],
      ['資料庫原理', '理解資料儲存的核心原理。'],
      ['API 設計', '學習 API 介面設計與開發基礎。'],
      ['Git 版本控制', '深入理解 Git 原理與進階用法。'],
      ['電腦網路', '理解網路協定與通訊原理。']
    ]
  },
  'ja-jp': {
    stage1: [
      [
        '学習マップ',
        '未経験からフルスタック開発までの学習ルートを把握します。',
        '全年齢向け'
      ],
      [
        'ゲームで入門',
        'スネークなどの AI ネイティブゲームを作り、コードへの不安をなくします。',
        '遊びながら学ぶ'
      ],
      [
        'プロトタイプ実践',
        'Vibe Coding の流れを学び、アイデアを操作できる Web プロトタイプにします。',
        'コア実践'
      ]
    ],
    stage2: [
      [
        '素材生成 Agent',
        '素材制作を高速化。',
        'Lovart と Nanobanana で素材制作フローと描画 Agent を構築します。'
      ],
      [
        'Figma と MasterGo',
        'デザインツールに慣れる。',
        'UI デザインの基本と、デザインから開発へ渡す流れを学びます。'
      ],
      [
        'デザインからコードへ',
        'プロトタイプを実際の画面に。',
        'デザインをブラウザで動くフロントエンドコードに変換します。'
      ],
      [
        '実データプロジェクト',
        '本物の DB につなぐ。',
        'Supabase でテーブルと権限を設計し、読み書き処理を実装します。'
      ],
      [
        'デプロイ',
        '作品を世界へ公開。',
        'CloudBase、Vercel、Zeabur でローカルのコードを公開サイトにします。'
      ],
      [
        'AI ナレッジベース',
        'アプリに知的な Q&A を追加。',
        'Dify で AI フローとナレッジベースを作り、製品に組み込みます。'
      ]
    ],
    stage3Sub:
      '時間や端末の制約を越え、AI プロダクトをどこでも使える形にします。',
    stage3: [
      [
        'クロスプラットフォームアプリ',
        'Electron で音声文字起こしアプリを作り、Windows、macOS、Linux に対応します。'
      ],
      [
        'AI Agent チーム',
        'Claude Agent Teams で複数の Agent を開発チームのように連携させます。'
      ],
      [
        '長時間タスク',
        'ループとタスクキューを設計し、Claude Code を夜間も安定稼働させます。'
      ],
      [
        '個人ブランド',
        '個人サイトと技術ブログを作り、プロジェクトや知見を発信します。'
      ]
    ],
    appendixTitle: 'コードを、<br><span class="highlight">生き生きと。</span>',
    appendixSub:
      '難解な文章だけに頼らず、動くデモとリアルタイム操作で技術を理解します。',
    appendix: [
      ['AI の歴史', 'AI 発展の重要な節目を振り返ります。'],
      ['プロンプトエンジニアリング', 'AI と効果的に対話する方法を学びます。'],
      ['大規模言語モデル', 'LLM の仕組みと用途を理解します。'],
      ['AI Agent', '自律的に判断し実行する AI 構成を学びます。'],
      ['フロントエンド基礎', 'HTML、CSS、JavaScript の基本を学びます。'],
      ['フロントエンドの進化', '技術スタックの変遷と流れを把握します。'],
      ['バックエンド設計', 'モノリスからマイクロサービスへの進化を学びます。'],
      ['バックエンド言語', '主要言語を比較し、適切な技術を選びます。'],
      ['データベース原理', 'データ保存の基本原理を理解します。'],
      ['API 設計', '堅牢な API の設計と開発を学びます。'],
      ['Git バージョン管理', 'Git の仕組みと高度な使い方を学びます。'],
      [
        'コンピュータネットワーク',
        '通信プロトコルとネットワークの基礎を学びます。'
      ]
    ]
  },
  'ko-kr': {
    stage1: [
      [
        '학습 지도',
        '비전공자에서 풀스택 개발까지 이어지는 전체 학습 경로를 살펴봅니다.',
        '누구나 시작 가능'
      ],
      [
        '게임으로 입문',
        '스네이크 같은 AI 네이티브 게임을 만들며 코드에 대한 두려움을 없앱니다.',
        '놀면서 배우기'
      ],
      [
        '제품 프로토타입 실습',
        'Vibe Coding 흐름을 익혀 아이디어를 실제로 조작할 수 있는 Web 프로토타입으로 만듭니다.',
        '핵심 실습'
      ]
    ],
    stage2: [
      [
        '에셋 생성 Agent',
        '콘텐츠 제작부터 가속합니다.',
        'Lovart와 Nanobanana로 에셋 제작 워크플로와 드로잉 Agent를 구축합니다.'
      ],
      [
        'Figma와 MasterGo',
        '디자인 도구에 익숙해집니다.',
        'UI 디자인 도구의 기본과 디자인을 개발로 전달하는 과정을 배웁니다.'
      ],
      [
        '디자인을 코드로',
        '프로토타입을 실제 화면으로.',
        '디자인을 브라우저에서 실행되는 프론트엔드 코드로 변환합니다.'
      ],
      [
        '실데이터 프로젝트',
        '실제 DB에 연결합니다.',
        'Supabase에서 테이블과 권한을 설계하고 읽기·쓰기 흐름을 구현합니다.'
      ],
      [
        '배포 및 출시',
        '작품을 세상에 공개합니다.',
        'CloudBase, Vercel, Zeabur로 로컬 코드를 공개 사이트로 배포합니다.'
      ],
      [
        'AI 지식 베이스',
        '앱에 지능형 Q&A를 연결합니다.',
        'Dify로 AI 워크플로와 지식 베이스를 만들고 제품에 통합합니다.'
      ]
    ],
    stage3Sub:
      '시간과 기기의 제약을 넘어 어디서나 사용할 수 있는 AI 제품을 만듭니다.',
    stage3: [
      [
        '크로스 플랫폼 데스크톱 앱',
        'Electron으로 음성-텍스트 앱을 만들어 Windows, macOS, Linux에서 실행합니다.'
      ],
      [
        'AI Agent 팀',
        'Claude Agent Teams로 여러 Agent를 실제 개발팀처럼 협업시킵니다.'
      ],
      [
        '장시간 안정 실행',
        '루프와 작업 큐를 설계해 Claude Code가 밤새 안정적으로 작업하게 합니다.'
      ],
      [
        '개인 브랜드와 기록',
        '개인 웹사이트와 기술 블로그로 프로젝트와 경험을 꾸준히 공유합니다.'
      ]
    ],
    appendixTitle: '코드를,<br><span class="highlight">생생하게.</span>',
    appendixSub:
      '어려운 글만 나열하지 않고 동적 데모와 실시간 상호작용으로 기술을 이해합니다.',
    appendix: [
      ['AI의 역사', 'AI 발전의 주요 이정표를 돌아봅니다.'],
      ['프롬프트 엔지니어링', 'AI와 효과적으로 대화하는 방법을 익힙니다.'],
      ['대규모 언어 모델', 'LLM의 동작 원리와 활용을 이해합니다.'],
      ['AI Agent', '자율적으로 판단하고 실행하는 AI 구조를 살펴봅니다.'],
      ['프론트엔드 기초', 'HTML, CSS, JavaScript의 핵심을 배웁니다.'],
      ['프론트엔드의 진화', '기술 스택의 변화와 흐름을 이해합니다.'],
      ['백엔드 아키텍처', '모놀리스에서 마이크로서비스까지의 발전을 배웁니다.'],
      ['백엔드 언어', '주요 언어를 비교하고 적합한 기술 스택을 고릅니다.'],
      ['데이터베이스 원리', '데이터 저장의 핵심 원리를 이해합니다.'],
      ['API 설계', '견고한 API 설계와 개발의 기초를 배웁니다.'],
      ['Git 버전 관리', 'Git의 원리와 고급 사용법을 익힙니다.'],
      ['컴퓨터 네트워크', '네트워크 프로토콜과 통신 원리를 배웁니다.']
    ]
  },
  'es-es': {
    stage1: [
      [
        'Mapa de aprendizaje',
        'Conoce la ruta completa desde cero hasta el desarrollo full stack.',
        'Para todas las edades'
      ],
      [
        'Introducción con juegos',
        'Crea juegos nativos de IA como Snake y pierde el miedo al código.',
        'Aprende jugando'
      ],
      [
        'Prototipado de producto',
        'Domina el flujo de Vibe Coding y convierte una idea en un prototipo web interactivo.',
        'Práctica esencial'
      ]
    ],
    stage2: [
      [
        'Agent de recursos',
        'Acelera primero la creación de recursos.',
        'Crea con Lovart y Nanobanana un flujo de recursos y un Agent de dibujo.'
      ],
      [
        'Figma y MasterGo',
        'Domina las herramientas de diseño.',
        'Aprende las bases del diseño UI y el traspaso de diseños al desarrollo.'
      ],
      [
        'Del diseño al código',
        'Convierte el prototipo en una página real.',
        'Transforma diseños en código frontend que funciona en el navegador.'
      ],
      [
        'Proyecto con datos reales',
        'Conecta una base de datos real.',
        'Diseña tablas y permisos en Supabase e implementa lecturas y escrituras.'
      ],
      [
        'Despliegue',
        'Publica tu trabajo para todo el mundo.',
        'Usa CloudBase, Vercel y Zeabur para convertir código local en un sitio público.'
      ],
      [
        'Base de conocimiento con IA',
        'Añade preguntas y respuestas inteligentes.',
        'Crea con Dify flujos de IA y bases de conocimiento e intégralos en tu producto.'
      ]
    ],
    stage3Sub:
      'Supera los límites de tiempo y dispositivo para llevar tus productos de IA a cualquier lugar.',
    stage3: [
      [
        'App de escritorio multiplataforma',
        'Crea con Electron una app de voz a texto para Windows, macOS y Linux.'
      ],
      [
        'Equipos de Agent de IA',
        'Coordina varios Agent con Claude Agent Teams como un equipo de desarrollo real.'
      ],
      [
        'Ejecución estable y prolongada',
        'Diseña bucles y colas para que Claude Code trabaje de forma estable durante la noche.'
      ],
      [
        'Marca personal y contenido',
        'Crea tu web y blog técnico para compartir proyectos y experiencia.'
      ]
    ],
    appendixTitle:
      'Haz que el código<br><span class="highlight">cobre vida.</span>',
    appendixSub:
      'Sustituye las explicaciones densas por demostraciones dinámicas e interacción en tiempo real.',
    appendix: [
      [
        'Historia de la IA',
        'Repasa los principales hitos de la inteligencia artificial.'
      ],
      [
        'Ingeniería de prompts',
        'Aprende a comunicarte con la IA de forma eficaz.'
      ],
      ['Modelos de lenguaje', 'Comprende cómo funcionan y se usan los LLM.'],
      [
        'Agent de IA',
        'Explora sistemas de IA que deciden y actúan de forma autónoma.'
      ],
      ['Fundamentos frontend', 'Aprende las bases de HTML, CSS y JavaScript.'],
      [
        'Evolución del frontend',
        'Conoce la evolución y las tendencias del stack frontend.'
      ],
      ['Arquitectura backend', 'Del monolito a los microservicios.'],
      ['Lenguajes backend', 'Compara lenguajes y elige el stack adecuado.'],
      [
        'Fundamentos de bases de datos',
        'Comprende los principios del almacenamiento de datos.'
      ],
      [
        'Diseño de API',
        'Aprende las bases para diseñar y desarrollar API robustas.'
      ],
      [
        'Control de versiones con Git',
        'Profundiza en Git y sus usos avanzados.'
      ],
      [
        'Redes informáticas',
        'Comprende protocolos y principios de comunicación.'
      ]
    ]
  },
  'fr-fr': {
    stage1: [
      [
        'Parcours d’apprentissage',
        'Découvrez le parcours complet de débutant au développement full stack.',
        'Pour tous les âges'
      ],
      [
        'Débuter par le jeu',
        'Créez des jeux IA comme Snake et dépassez votre peur du code.',
        'Apprendre en jouant'
      ],
      [
        'Prototypage produit',
        'Maîtrisez le flux Vibe Coding pour transformer une idée en prototype web interactif.',
        'Pratique essentielle'
      ]
    ],
    stage2: [
      [
        'Agent de création visuelle',
        'Accélérez la production de ressources.',
        'Créez avec Lovart et Nanobanana un flux de production et un Agent de dessin.'
      ],
      [
        'Figma et MasterGo',
        'Maîtrisez les outils de design.',
        'Apprenez les bases du design UI et le passage des maquettes au développement.'
      ],
      [
        'Du design au code',
        'Transformez le prototype en vraie page.',
        'Convertissez les maquettes en code frontend exécutable dans le navigateur.'
      ],
      [
        'Projet avec données réelles',
        'Connectez une vraie base de données.',
        'Concevez tables et permissions dans Supabase et implémentez les lectures et écritures.'
      ],
      [
        'Déploiement',
        'Publiez votre création.',
        'Utilisez CloudBase, Vercel et Zeabur pour mettre votre code local en ligne.'
      ],
      [
        'Base de connaissances IA',
        'Ajoutez des réponses intelligentes.',
        'Créez avec Dify des flux IA et une base de connaissances intégrés au produit.'
      ]
    ],
    stage3Sub:
      'Dépassez les limites de temps et d’appareil pour rendre vos produits IA accessibles partout.',
    stage3: [
      [
        'Application bureau multiplateforme',
        'Créez avec Electron une application voix-texte pour Windows, macOS et Linux.'
      ],
      [
        'Équipe d’Agents IA',
        'Coordonnez plusieurs Agents avec Claude Agent Teams comme une véritable équipe de développement.'
      ],
      [
        'Exécution longue et stable',
        'Concevez boucles et files de tâches pour que Claude Code travaille de façon fiable toute la nuit.'
      ],
      [
        'Marque personnelle et partage',
        'Créez votre site et votre blog technique pour valoriser projets et expérience.'
      ]
    ],
    appendixTitle: 'Donnez vie<br><span class="highlight">au code.</span>',
    appendixSub:
      'Remplacez les textes arides par des démonstrations dynamiques et des interactions en temps réel.',
    appendix: [
      [
        'Histoire de l’IA',
        'Découvrez les grandes étapes du développement de l’intelligence artificielle.'
      ],
      [
        'Ingénierie des prompts',
        'Apprenez à dialoguer efficacement avec l’IA.'
      ],
      [
        'Grands modèles de langage',
        'Comprenez le fonctionnement et les usages des LLM.'
      ],
      [
        'Agents IA',
        'Explorez les architectures capables de décider et d’agir seules.'
      ],
      ['Bases du frontend', 'Maîtrisez HTML, CSS et JavaScript.'],
      [
        'Évolution du frontend',
        'Suivez l’évolution et les tendances des technologies frontend.'
      ],
      ['Architecture backend', 'Du monolithe aux microservices.'],
      [
        'Langages backend',
        'Comparez les langages et choisissez la bonne pile.'
      ],
      [
        'Principes des bases de données',
        'Comprenez les fondements du stockage des données.'
      ],
      [
        'Conception d’API',
        'Apprenez à concevoir et développer des API robustes.'
      ],
      [
        'Gestion de versions avec Git',
        'Approfondissez Git et ses usages avancés.'
      ],
      [
        'Réseaux informatiques',
        'Comprenez les protocoles et principes de communication.'
      ]
    ]
  },
  'de-de': {
    stage1: [
      [
        'Lernpfad',
        'Sieh dir den gesamten Weg vom Einstieg bis zur Full-Stack-Entwicklung an.',
        'Für jedes Alter'
      ],
      [
        'Spielerischer Einstieg',
        'Baue KI-native Spiele wie Snake und verliere die Angst vor Code.',
        'Spielend lernen'
      ],
      [
        'Produktprototyping',
        'Lerne den Vibe-Coding-Ablauf und verwandle eine Idee in einen interaktiven Webprototyp.',
        'Kernpraxis'
      ]
    ],
    stage2: [
      [
        'Asset-Agent',
        'Beschleunige zuerst die Asset-Produktion.',
        'Baue mit Lovart und Nanobanana einen Asset-Workflow und Zeichen-Agent.'
      ],
      [
        'Figma und MasterGo',
        'Beherrsche die Designwerkzeuge.',
        'Lerne UI-Design-Grundlagen und die Übergabe vom Design an die Entwicklung.'
      ],
      [
        'Vom Design zum Code',
        'Mach aus dem Prototyp eine echte Seite.',
        'Wandle Designs in Frontend-Code um, der im Browser läuft.'
      ],
      [
        'Projekt mit echten Daten',
        'Verbinde eine echte Datenbank.',
        'Entwirf Tabellen und Rechte in Supabase und implementiere Lese- und Schreibvorgänge.'
      ],
      [
        'Deployment',
        'Veröffentliche dein Werk.',
        'Bringe lokalen Code mit CloudBase, Vercel und Zeabur als öffentliche Website online.'
      ],
      [
        'KI-Wissensdatenbank',
        'Ergänze intelligente Antworten.',
        'Erstelle mit Dify KI-Abläufe und Wissensdatenbanken und integriere sie ins Produkt.'
      ]
    ],
    stage3Sub:
      'Überwinde Zeit- und Gerätegrenzen und mache KI-Produkte überall nutzbar.',
    stage3: [
      [
        'Plattformübergreifende Desktop-App',
        'Baue mit Electron eine Sprache-zu-Text-App für Windows, macOS und Linux.'
      ],
      [
        'KI-Agent-Teams',
        'Koordiniere mit Claude Agent Teams mehrere Agents wie ein echtes Entwicklungsteam.'
      ],
      [
        'Stabile Langzeitaufgaben',
        'Entwirf Schleifen und Warteschlangen, damit Claude Code über Nacht zuverlässig arbeitet.'
      ],
      [
        'Persönliche Marke und Inhalte',
        'Baue Website und Technikblog, um Projekte und Erfahrungen langfristig zu zeigen.'
      ]
    ],
    appendixTitle: 'Erwecke Code<br><span class="highlight">zum Leben.</span>',
    appendixSub:
      'Ersetze trockene Textwüsten durch dynamische Demos und Interaktion in Echtzeit.',
    appendix: [
      [
        'Geschichte der KI',
        'Entdecke die wichtigsten Meilensteine der künstlichen Intelligenz.'
      ],
      ['Prompt Engineering', 'Lerne, wirkungsvoll mit KI zu kommunizieren.'],
      ['Große Sprachmodelle', 'Verstehe Funktionsweise und Einsatz von LLMs.'],
      [
        'KI-Agents',
        'Erkunde KI-Systeme, die selbstständig entscheiden und handeln.'
      ],
      [
        'Frontend-Grundlagen',
        'Lerne die Grundlagen von HTML, CSS und JavaScript.'
      ],
      [
        'Frontend-Evolution',
        'Verstehe die Entwicklung und Trends des Frontend-Stacks.'
      ],
      ['Backend-Architektur', 'Vom Monolithen zu Microservices.'],
      [
        'Backend-Sprachen',
        'Vergleiche Sprachen und wähle den passenden Stack.'
      ],
      [
        'Datenbankgrundlagen',
        'Verstehe die Kernprinzipien der Datenspeicherung.'
      ],
      ['API-Design', 'Lerne robuste APIs zu entwerfen und zu entwickeln.'],
      [
        'Versionskontrolle mit Git',
        'Vertiefe Git und seine fortgeschrittene Nutzung.'
      ],
      ['Computernetzwerke', 'Verstehe Protokolle und Kommunikationsprinzipien.']
    ]
  },
  'ar-sa': {
    stage1: [
      [
        'خريطة التعلّم',
        'تعرّف على المسار الكامل من البداية إلى تطوير Full Stack.',
        'مناسب لجميع الأعمار'
      ],
      [
        'مدخل عبر الألعاب',
        'أنشئ ألعابًا أصلية بالذكاء الاصطناعي مثل Snake وتجاوز الخوف من البرمجة.',
        'تعلّم باللعب'
      ],
      [
        'تطبيق نموذج المنتج',
        'أتقن سير عمل Vibe Coding وحوّل الفكرة إلى نموذج ويب تفاعلي.',
        'تطبيق أساسي'
      ]
    ],
    stage2: [
      [
        'Agent لإنشاء الأصول',
        'سرّع إنتاج الأصول أولًا.',
        'أنشئ باستخدام Lovart وNanobanana سير عمل للأصول وAgent للرسم.'
      ],
      [
        'Figma وMasterGo',
        'أتقن أدوات التصميم.',
        'تعلّم أساسيات تصميم UI وتسليم التصاميم إلى فريق التطوير.'
      ],
      [
        'من التصميم إلى الكود',
        'حوّل النموذج إلى صفحة حقيقية.',
        'حوّل التصاميم إلى كود واجهة أمامية يعمل في المتصفح.'
      ],
      [
        'مشروع ببيانات حقيقية',
        'اتصل بقاعدة بيانات حقيقية.',
        'صمّم الجداول والصلاحيات في Supabase ونفّذ عمليات القراءة والكتابة.'
      ],
      [
        'النشر',
        'اعرض عملك للعالم.',
        'استخدم CloudBase وVercel وZeabur لتحويل الكود المحلي إلى موقع عام.'
      ],
      [
        'قاعدة معرفة بالذكاء الاصطناعي',
        'أضف إجابات ذكية إلى التطبيق.',
        'أنشئ عبر Dify تدفقات AI وقاعدة معرفة وادمجهما في منتجك.'
      ]
    ],
    stage3Sub:
      'تجاوز قيود الوقت والأجهزة واجعل منتجات الذكاء الاصطناعي متاحة في كل مكان.',
    stage3: [
      [
        'تطبيق سطح مكتب متعدد المنصات',
        'أنشئ باستخدام Electron تطبيق تحويل الصوت إلى نص لويندوز وmacOS ولينكس.'
      ],
      [
        'فرق AI Agent',
        'نسّق عدة Agents باستخدام Claude Agent Teams كفريق تطوير حقيقي.'
      ],
      [
        'تشغيل طويل ومستقر',
        'صمّم حلقات وقوائم مهام ليعمل Claude Code بثبات طوال الليل.'
      ],
      [
        'العلامة الشخصية والمحتوى',
        'أنشئ موقعك ومدونتك التقنية لعرض مشاريعك وخبراتك.'
      ]
    ],
    appendixTitle: 'اجعل الكود<br><span class="highlight">ينبض بالحياة.</span>',
    appendixSub:
      'استبدل النصوص المعقدة بعروض ديناميكية وتفاعل فوري يسهّلان فهم التقنية.',
    appendix: [
      ['تاريخ الذكاء الاصطناعي', 'استعرض أهم محطات تطور الذكاء الاصطناعي.'],
      ['هندسة الأوامر', 'تعلّم التواصل بفاعلية مع الذكاء الاصطناعي.'],
      ['نماذج اللغة الكبيرة', 'افهم آلية عمل LLM واستخداماتها.'],
      ['وكلاء الذكاء الاصطناعي', 'استكشف أنظمة تقرر وتنفذ المهام ذاتيًا.'],
      ['أساسيات الواجهة الأمامية', 'تعلّم أساسيات HTML وCSS وJavaScript.'],
      ['تطور الواجهة الأمامية', 'تعرّف على تطور تقنيات الواجهة واتجاهاتها.'],
      ['هندسة الواجهة الخلفية', 'من النظام الأحادي إلى الخدمات المصغرة.'],
      ['لغات الواجهة الخلفية', 'قارن اللغات واختر الحزمة التقنية المناسبة.'],
      ['أساسيات قواعد البيانات', 'افهم المبادئ الأساسية لتخزين البيانات.'],
      ['تصميم API', 'تعلّم تصميم واجهات API قوية وتطويرها.'],
      ['التحكم بالإصدارات عبر Git', 'تعمّق في Git واستخداماته المتقدمة.'],
      ['شبكات الحاسوب', 'افهم البروتوكولات ومبادئ الاتصال.']
    ]
  },
  'vi-vn': {
    stage1: [
      [
        'Bản đồ học tập',
        'Khám phá lộ trình hoàn chỉnh từ con số 0 đến phát triển full stack.',
        'Phù hợp mọi lứa tuổi'
      ],
      [
        'Nhập môn qua trò chơi',
        'Tạo game AI-native như Snake và xóa bỏ nỗi sợ code.',
        'Học mà chơi'
      ],
      [
        'Thực hành nguyên mẫu sản phẩm',
        'Nắm quy trình Vibe Coding và biến ý tưởng thành nguyên mẫu Web có thể tương tác.',
        'Thực hành cốt lõi'
      ]
    ],
    stage2: [
      [
        'Agent tạo tài nguyên',
        'Tăng tốc sản xuất tài nguyên trước tiên.',
        'Dùng Lovart và Nanobanana để xây quy trình tài nguyên và Agent vẽ hình.'
      ],
      [
        'Figma và MasterGo',
        'Làm chủ công cụ thiết kế.',
        'Học nền tảng thiết kế UI và quy trình bàn giao thiết kế cho phát triển.'
      ],
      [
        'Từ thiết kế đến code',
        'Biến nguyên mẫu thành trang thật.',
        'Chuyển thiết kế thành code frontend chạy được trong trình duyệt.'
      ],
      [
        'Dự án với dữ liệu thật',
        'Kết nối cơ sở dữ liệu thật.',
        'Thiết kế bảng và quyền trên Supabase rồi triển khai luồng đọc ghi.'
      ],
      [
        'Triển khai',
        'Đưa sản phẩm ra thế giới.',
        'Dùng CloudBase, Vercel và Zeabur để biến code cục bộ thành website công khai.'
      ],
      [
        'Kho kiến thức AI',
        'Thêm hỏi đáp thông minh vào ứng dụng.',
        'Dùng Dify xây quy trình AI và kho kiến thức rồi tích hợp vào sản phẩm.'
      ]
    ],
    stage3Sub:
      'Vượt giới hạn thời gian và thiết bị để sản phẩm AI có mặt ở mọi nơi.',
    stage3: [
      [
        'Ứng dụng desktop đa nền tảng',
        'Dùng Electron tạo ứng dụng chuyển giọng nói thành văn bản cho Windows, macOS và Linux.'
      ],
      [
        'Đội ngũ AI Agent',
        'Điều phối nhiều Agent bằng Claude Agent Teams như một đội phát triển thực thụ.'
      ],
      [
        'Thực thi dài hạn ổn định',
        'Thiết kế vòng lặp và hàng đợi để Claude Code làm việc ổn định qua đêm.'
      ],
      [
        'Thương hiệu cá nhân và chia sẻ',
        'Tạo website và blog kỹ thuật để giới thiệu dự án và kinh nghiệm.'
      ]
    ],
    appendixTitle:
      'Làm cho code<br><span class="highlight">trở nên sống động.</span>',
    appendixSub:
      'Thay những khối chữ khó hiểu bằng bản demo động và tương tác theo thời gian thực.',
    appendix: [
      ['Lịch sử AI', 'Nhìn lại các cột mốc quan trọng của trí tuệ nhân tạo.'],
      ['Kỹ thuật prompt', 'Học cách giao tiếp hiệu quả với AI.'],
      ['Mô hình ngôn ngữ lớn', 'Hiểu nguyên lý hoạt động và ứng dụng của LLM.'],
      ['AI Agent', 'Khám phá hệ thống AI tự quyết định và thực thi.'],
      ['Nền tảng frontend', 'Học các trụ cột HTML, CSS và JavaScript.'],
      [
        'Sự phát triển của frontend',
        'Tìm hiểu quá trình tiến hóa và xu hướng công nghệ frontend.'
      ],
      ['Kiến trúc backend', 'Từ monolith đến microservices.'],
      ['Ngôn ngữ backend', 'So sánh các ngôn ngữ và chọn công nghệ phù hợp.'],
      [
        'Nguyên lý cơ sở dữ liệu',
        'Hiểu các nguyên lý cốt lõi của lưu trữ dữ liệu.'
      ],
      ['Thiết kế API', 'Học nền tảng thiết kế và phát triển API vững chắc.'],
      ['Quản lý phiên bản với Git', 'Hiểu sâu Git và cách dùng nâng cao.'],
      ['Mạng máy tính', 'Hiểu giao thức mạng và nguyên lý truyền thông.']
    ]
  }
}

const interactionLabels = {
  'zh-cn': ['进一步了解', '向左滑动', '向右滑动'],
  en: ['Learn more', 'Scroll left', 'Scroll right'],
  'zh-tw': ['進一步了解', '向左滑動', '向右滑動'],
  'ja-jp': ['詳しく見る', '左へスクロール', '右へスクロール'],
  'ko-kr': ['자세히 알아보기', '왼쪽으로 스크롤', '오른쪽으로 스크롤'],
  'es-es': [
    'Más información',
    'Desplazar a la izquierda',
    'Desplazar a la derecha'
  ],
  'fr-fr': [
    'En savoir plus',
    'Faire défiler vers la gauche',
    'Faire défiler vers la droite'
  ],
  'de-de': ['Mehr erfahren', 'Nach links scrollen', 'Nach rechts scrollen'],
  'ar-sa': ['معرفة المزيد', 'التمرير إلى اليسار', 'التمرير إلى اليمين'],
  'vi-vn': ['Tìm hiểu thêm', 'Cuộn sang trái', 'Cuộn sang phải']
}

const makeCards = (locale, stage, paths, cards) =>
  cards.map(([title, headlineOrDesc, descOrSub], index) => ({
    title,
    ...(stage === 'stage2'
      ? { headline: headlineOrDesc, desc: descOrSub }
      : {}),
    ...(stage === 'stage1' ? { desc: headlineOrDesc, sub: descOrSub } : {}),
    ...(stage === 'stage3' || stage === 'appendix'
      ? { desc: headlineOrDesc }
      : {}),
    link: `/${locale}/${stage === 'appendix' ? 'appendix' : stage.replace('stage', 'stage-')}/${paths[index]}/`
  }))

export const synchronizeHomeTranslations = (messages) => {
  for (const [locale, [more, previous, next]] of Object.entries(
    interactionLabels
  )) {
    messages[locale].stage2.more = more
    messages[locale].appendix.ui = { previous, next }
  }

  for (const [locale, content] of Object.entries(localizedContent)) {
    messages[locale].stage1.cards = makeCards(
      locale,
      'stage1',
      stage1Paths,
      content.stage1
    )
    messages[locale].stage2.cards = makeCards(
      locale,
      'stage2',
      stage2Paths,
      content.stage2
    )
    messages[locale].stage3.sub = content.stage3Sub
    messages[locale].stage3.cards = makeCards(
      locale,
      'stage3',
      stage3Paths,
      content.stage3
    )
    messages[locale].appendix.title = content.appendixTitle
    messages[locale].appendix.sub = content.appendixSub
    messages[locale].appendix.cards = makeCards(
      locale,
      'appendix',
      appendixPaths,
      content.appendix
    )
  }
}

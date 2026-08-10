<script setup>
import { computed } from 'vue'

const props = defineProps({
  locale: {
    type: String,
    default: 'zh-cn'
  }
})

const content = {
  'zh-cn': {
    lead: '边做项目边学：先做出来，再交给用户。',
    startLabel: '从这里开始',
    startTitle: '用 AI 做一个贪吃蛇小游戏',
    startTags: ['零基础', '几分钟完成'],
    connector: '从体验走向创造',
    stages: [
      ['AI 软件创作者入门', '做出并上线第一个 AI 网页应用。', ['AI IDE', '原型与需求验证', 'AI 功能与部署']],
      ['全栈软件创作者', '让产品拥有数据、用户和支付能力。', ['Figma 到代码', 'Supabase 数据库', '用户与支付']],
      ['AI 原生创作者', '用 Agent 和 RAG 构建更复杂的应用。', ['Web 与多端应用', 'MCP 与 Agent', 'RAG 与 LangGraph']]
    ],
    resultLabel: '第一阶段完成后',
    result: '一个可以发给别人体验的 AI 网页应用'
  },
  'zh-tw': {
    lead: '邊做專案邊學：先做出來，再交給使用者。',
    startLabel: '從這裡開始',
    startTitle: '用 AI 做一個貪食蛇小遊戲',
    startTags: ['零基礎', '幾分鐘完成'],
    connector: '從體驗走向創作',
    stages: [
      ['AI 軟體創作者入門', '做出並上線第一個 AI 網頁應用。', ['AI IDE', '原型與需求驗證', 'AI 功能與部署']],
      ['全端軟體創作者', '讓產品擁有資料、使用者與支付能力。', ['Figma 到程式碼', 'Supabase 資料庫', '使用者與支付']],
      ['AI 原生創作者', '使用 Agent 和 RAG 建構更複雜的應用。', ['Web 與多端應用', 'MCP 與 Agent', 'RAG 與 LangGraph']]
    ],
    resultLabel: '第一階段完成後',
    result: '一個可以分享給別人體驗的 AI 網頁應用'
  },
  en: {
    lead: 'Learn by building: make it work, then ship it to users.',
    startLabel: 'Start here',
    startTitle: 'Build a Snake game with AI',
    startTags: ['No experience needed', 'Done in minutes'],
    connector: 'From trying to creating',
    stages: [
      ['AI Software Creator Basics', 'Build and launch your first AI web app.', ['AI IDE', 'Prototype and validate', 'AI features and deployment']],
      ['Full-Stack Software Creator', 'Add data, users, and payments to your product.', ['Figma to code', 'Supabase database', 'Users and payments']],
      ['AI-Native Creator', 'Build more advanced apps with Agents and RAG.', ['Web and multi-platform', 'MCP and Agents', 'RAG and LangGraph']]
    ],
    resultLabel: 'After Stage One',
    result: 'An AI web app you can share with real users'
  },
  'ja-jp': {
    lead: 'プロジェクトを作りながら学ぶ。まず動かし、次にユーザーへ届けます。',
    startLabel: 'ここからスタート',
    startTitle: 'AIでスネークゲームを作る',
    startTags: ['未経験OK', '数分で完成'],
    connector: '体験から創作へ',
    stages: [
      ['AIソフトウェアクリエイター入門', '最初のAI Webアプリを作って公開します。', ['AI IDE', 'プロトタイプと検証', 'AI機能とデプロイ']],
      ['フルスタック・ソフトウェアクリエイター', 'データ、ユーザー、決済を追加します。', ['Figmaからコードへ', 'Supabaseデータベース', 'ユーザーと決済']],
      ['AIネイティブ・クリエイター', 'AgentとRAGで高度なアプリを作ります。', ['Webとマルチプラットフォーム', 'MCPとAgent', 'RAGとLangGraph']]
    ],
    resultLabel: '第一段階の修了後',
    result: '実際のユーザーに共有できるAI Webアプリ'
  },
  'ko-kr': {
    lead: '프로젝트를 만들며 배웁니다. 먼저 작동시키고, 사용자에게 전달합니다.',
    startLabel: '여기서 시작',
    startTitle: 'AI로 스네이크 게임 만들기',
    startTags: ['초보자 가능', '몇 분 안에 완성'],
    connector: '체험에서 창작으로',
    stages: [
      ['AI 소프트웨어 크리에이터 입문', '첫 AI 웹 앱을 만들고 배포합니다.', ['AI IDE', '프로토타입과 검증', 'AI 기능과 배포']],
      ['풀스택 소프트웨어 크리에이터', '제품에 데이터, 사용자, 결제를 더합니다.', ['Figma에서 코드로', 'Supabase 데이터베이스', '사용자와 결제']],
      ['AI 네이티브 크리에이터', 'Agent와 RAG로 더 복잡한 앱을 만듭니다.', ['Web과 멀티플랫폼', 'MCP와 Agent', 'RAG와 LangGraph']]
    ],
    resultLabel: '1단계를 마치면',
    result: '실제 사용자에게 공유할 수 있는 AI 웹 앱'
  },
  'de-de': {
    lead: 'Lernen durch Bauen: erst funktionsfähig machen, dann an Nutzer ausliefern.',
    startLabel: 'Hier starten',
    startTitle: 'Ein Snake-Spiel mit AI bauen',
    startTags: ['Keine Vorkenntnisse', 'In wenigen Minuten'],
    connector: 'Vom Ausprobieren zum Erschaffen',
    stages: [
      ['Einstieg als AI Software Creator', 'Die erste AI-Web-App bauen und veröffentlichen.', ['AI IDE', 'Prototyp und Validierung', 'AI-Funktionen und Deployment']],
      ['Full-Stack Software Creator', 'Daten, Nutzer und Zahlungen ergänzen.', ['Figma zu Code', 'Supabase-Datenbank', 'Nutzer und Zahlungen']],
      ['AI-Native Creator', 'Komplexere Apps mit Agents und RAG bauen.', ['Web und mehrere Plattformen', 'MCP und Agents', 'RAG und LangGraph']]
    ],
    resultLabel: 'Nach Stage 1',
    result: 'Eine AI-Web-App, die echte Nutzer ausprobieren können'
  },
  'es-es': {
    lead: 'Aprende creando: primero haz que funcione y luego entrégalo a usuarios.',
    startLabel: 'Empieza aquí',
    startTitle: 'Crea un juego de Snake con IA',
    startTags: ['Sin experiencia', 'Listo en minutos'],
    connector: 'De probar a crear',
    stages: [
      ['Introducción a la creación de software con IA', 'Crea y publica tu primera aplicación web con IA.', ['IDE con IA', 'Prototipo y validación', 'Funciones de IA y despliegue']],
      ['Creador de software full-stack', 'Añade datos, usuarios y pagos al producto.', ['De Figma a código', 'Base de datos Supabase', 'Usuarios y pagos']],
      ['Creador nativo de IA', 'Crea aplicaciones más avanzadas con Agents y RAG.', ['Web y multiplataforma', 'MCP y Agents', 'RAG y LangGraph']]
    ],
    resultLabel: 'Al terminar la primera etapa',
    result: 'Una aplicación web con IA que puedes compartir con usuarios reales'
  },
  'fr-fr': {
    lead: 'Apprenez en créant : faites fonctionner le produit, puis livrez-le aux utilisateurs.',
    startLabel: 'Commencez ici',
    startTitle: 'Créez un jeu Snake avec l’IA',
    startTags: ['Aucun prérequis', 'Prêt en quelques minutes'],
    connector: 'De l’essai à la création',
    stages: [
      ['Débuter comme créateur de logiciels IA', 'Créez et publiez votre première application web IA.', ['IDE avec IA', 'Prototype et validation', 'Fonctions IA et déploiement']],
      ['Créateur de logiciels full-stack', 'Ajoutez les données, les utilisateurs et le paiement.', ['De Figma au code', 'Base de données Supabase', 'Utilisateurs et paiement']],
      ['Créateur AI-native', 'Créez des applications avancées avec Agents et RAG.', ['Web et multiplateforme', 'MCP et Agents', 'RAG et LangGraph']]
    ],
    resultLabel: 'Après la première étape',
    result: 'Une application web IA à partager avec de vrais utilisateurs'
  },
  'vi-vn': {
    lead: 'Học bằng cách làm dự án: làm cho chạy được, rồi đưa đến người dùng.',
    startLabel: 'Bắt đầu từ đây',
    startTitle: 'Làm trò chơi Rắn săn mồi với AI',
    startTags: ['Không cần kinh nghiệm', 'Hoàn thành trong vài phút'],
    connector: 'Từ trải nghiệm đến sáng tạo',
    stages: [
      ['Nhập môn sáng tạo phần mềm AI', 'Xây dựng và phát hành ứng dụng web AI đầu tiên.', ['AI IDE', 'Nguyên mẫu và kiểm chứng', 'Tính năng AI và triển khai']],
      ['Nhà sáng tạo phần mềm full-stack', 'Thêm dữ liệu, người dùng và thanh toán.', ['Từ Figma đến code', 'Cơ sở dữ liệu Supabase', 'Người dùng và thanh toán']],
      ['Nhà sáng tạo AI-native', 'Xây ứng dụng nâng cao với Agent và RAG.', ['Web và đa nền tảng', 'MCP và Agent', 'RAG và LangGraph']]
    ],
    resultLabel: 'Sau giai đoạn một',
    result: 'Một ứng dụng web AI có thể chia sẻ với người dùng thật'
  },
  'ar-sa': {
    lead: 'تعلّم من خلال البناء: اجعل المنتج يعمل أولًا، ثم قدّمه للمستخدمين.',
    startLabel: 'ابدأ من هنا',
    startTitle: 'أنشئ لعبة الثعبان باستخدام الذكاء الاصطناعي',
    startTags: ['لا تحتاج إلى خبرة', 'تُنجز خلال دقائق'],
    connector: 'من التجربة إلى الإبداع',
    stages: [
      ['مقدمة في إنشاء البرمجيات بالذكاء الاصطناعي', 'أنشئ أول تطبيق ويب بالذكاء الاصطناعي وانشره.', ['بيئة تطوير بالذكاء الاصطناعي', 'النموذج الأولي والتحقق', 'ميزات AI والنشر']],
      ['منشئ برمجيات متكامل', 'أضف البيانات والمستخدمين والمدفوعات إلى المنتج.', ['من Figma إلى الكود', 'قاعدة بيانات Supabase', 'المستخدمون والمدفوعات']],
      ['منشئ تطبيقات AI أصلية', 'أنشئ تطبيقات متقدمة باستخدام Agents وRAG.', ['الويب ومتعدد المنصات', 'MCP وAgents', 'RAG وLangGraph']]
    ],
    resultLabel: 'بعد المرحلة الأولى',
    result: 'تطبيق ويب بالذكاء الاصطناعي يمكنك مشاركته مع مستخدمين حقيقيين'
  }
}

const copy = computed(() => content[props.locale] || content.en)
</script>

<template>
  <section id="learning-path" class="learning-path" :dir="locale === 'ar-sa' ? 'rtl' : undefined">
    <p class="learning-path-lead">{{ copy.lead }}</p>

    <div class="path-start">
      <div class="path-icon" aria-hidden="true">🎮</div>
      <div>
        <span class="path-eyebrow">{{ copy.startLabel }}</span>
        <h3>{{ copy.startTitle }}</h3>
        <div class="path-tags">
          <span v-for="tag in copy.startTags" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>

    <div class="path-connector" aria-hidden="true"><span>{{ copy.connector }}</span></div>

    <div class="path-stages">
      <article
        v-for="(stage, index) in copy.stages"
        :key="stage[0]"
        class="path-stage"
        :class="`path-stage--${index + 1}`"
      >
        <div class="path-stage-head">
          <span class="path-stage-index">0{{ index + 1 }}</span>
          <span class="path-stage-icon" aria-hidden="true">{{ ['🛠️', '💻', '🚀'][index] }}</span>
        </div>
        <h3>{{ stage[0] }}</h3>
        <p>{{ stage[1] }}</p>
        <ul class="path-skill-list">
          <li v-for="skill in stage[2]" :key="skill">{{ skill }}</li>
        </ul>
      </article>
    </div>

    <div class="stage-one-result">
      <span class="path-eyebrow">{{ copy.resultLabel }}</span>
      <h3>{{ copy.result }}</h3>
    </div>
  </section>
</template>

<style scoped>
.learning-path {
  margin: 24px 0 36px;
  padding: clamp(18px, 3vw, 30px);
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  background: linear-gradient(145deg, color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg)) 0%, var(--vp-c-bg) 46%, var(--vp-c-bg-soft) 100%);
}

.learning-path-lead {
  margin: 0 0 20px !important;
  color: var(--vp-c-text-2);
  line-height: 1.7;
}

.path-start {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 20px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 32%, var(--vp-c-divider));
  border-radius: 18px;
  background: var(--vp-c-bg);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.06);
}

.path-icon {
  display: grid;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 14%, var(--vp-c-bg-soft));
  place-items: center;
  font-size: 2rem;
}

.path-eyebrow {
  color: var(--vp-c-brand-1);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.path-start h3,
.path-stage h3,
.stage-one-result h3 {
  margin: 5px 0 8px !important;
  border: 0 !important;
  padding: 0 !important;
  font-weight: 700;
  line-height: 1.35;
}

.path-start h3 { font-size: 1.24rem; }
.path-stage h3 { font-size: 1.05rem; }

.path-stage p {
  margin: 0 !important;
  color: var(--vp-c-text-2);
  font-size: 0.86rem;
  line-height: 1.7;
}

.path-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
}

.path-tags span {
  padding: 4px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.74rem;
}

.path-connector {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 16px 8px;
  color: var(--vp-c-text-3);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.path-connector::before,
.path-connector::after {
  height: 1px;
  background: var(--vp-c-divider);
  content: '';
  flex: 1;
}

.path-stages {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.path-stage {
  --path-accent: var(--vp-c-brand-1);
  display: flex;
  min-width: 0;
  min-height: 285px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-top: 4px solid var(--path-accent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--path-accent) 4%, var(--vp-c-bg));
  flex-direction: column;
}

.path-stage--2 { --path-accent: #7c5cff; }
.path-stage--3 { --path-accent: #e8872d; }

.path-stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.path-stage-index {
  color: var(--path-accent);
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.path-stage-icon { font-size: 1.45rem; }

.path-skill-list {
  display: grid;
  gap: 9px;
  margin: auto 0 0 !important;
  padding: 20px 0 0 !important;
  list-style: none !important;
}

.path-skill-list li {
  position: relative;
  padding-inline-start: 18px;
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  line-height: 1.45;
  list-style: none !important;
}

.path-skill-list li::marker { content: ''; }

.path-skill-list li::before {
  position: absolute;
  inset-inline-start: 0;
  color: var(--path-accent);
  content: '✓';
  font-weight: 800;
}

.stage-one-result {
  margin-top: 20px;
  padding: 18px 22px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, var(--vp-c-divider));
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 8%, var(--vp-c-bg));
}

.stage-one-result h3 {
  margin-bottom: 0 !important;
  font-size: 1.14rem;
}

@media (max-width: 720px) {
  .learning-path { padding: 16px; border-radius: 18px; }
  .path-start { grid-template-columns: 1fr; }
  .path-icon { width: 52px; height: 52px; border-radius: 14px; font-size: 1.6rem; }
  .path-stages { grid-template-columns: 1fr; }
  .path-stage { min-height: 0; }
  .path-skill-list { margin-top: 4px !important; }
}
</style>

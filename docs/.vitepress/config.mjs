import { defineConfig } from 'vitepress'
import markdownItKatex from 'markdown-it-katex'
import { createSeo } from './seo.mjs'
import { createBuildHooks } from './build-hooks.mjs'
import {
  zhCnSidebar,
  appendixSidebarEn,
  productManagerSidebarEn,
  productManagerSidebarKo,
  stage2SidebarEn,
  stage3SidebarEn,
  getVibeStoriesSidebar,
  getVibeStoriesNavText,
  getStage1Sidebar,
  getStage2Sidebar,
  getStage3Sidebar,
  localizeAppendixSidebar
} from './sidebars/index.mjs'

// 判断是否是 Vercel 环境， github page 和 vercel 的部署地址相关不一样
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL_URL
// 检查是否为 EdgeOne 部署 (通过环境变量 EDGEONE 判断)
const isEdgeOne = !!process.env.EDGEONE || process.env.EDGEONE === '1'

// 确定 Base 路径：
// 1. 如果设置了 BASE 环境变量，优先使用
// 2. 如果是 Vercel 或 EdgeOne，默认使用根路径 '/'
// 3. 否则（如 GitHub Pages），使用 '/easy-vibe/'
const base = process.env.BASE || (isVercel || isEdgeOne ? '/' : '/easy-vibe/')

// 站点 URL 配置 - 根据部署环境动态确定
const getSiteUrl = () => {
  if (isVercel && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (isEdgeOne && process.env.EDGEONE_URL) {
    return `https://${process.env.EDGEONE_URL}`
  }
  if (process.env.SITE_URL) {
    return process.env.SITE_URL
  }
  return 'https://datawhalechina.github.io/easy-vibe'
}

const siteUrl = getSiteUrl()

// 语言映射配置
const localeMap = {
  'zh-cn': {
    ogLocale: 'zh_CN',
    twitterSite: '@datawhale',
    lang: 'zh-CN',
    hreflang: 'zh-CN'
  },
  en: {
    ogLocale: 'en_US',
    twitterSite: '@datawhale',
    lang: 'en-US',
    hreflang: 'en'
  },
  'ja-jp': {
    ogLocale: 'ja_JP',
    twitterSite: '@datawhale',
    lang: 'ja-JP',
    hreflang: 'ja'
  },
  'zh-tw': {
    ogLocale: 'zh_TW',
    twitterSite: '@datawhale',
    lang: 'zh-TW',
    hreflang: 'zh-TW'
  },
  'ko-kr': {
    ogLocale: 'ko_KR',
    twitterSite: '@datawhale',
    lang: 'ko-KR',
    hreflang: 'ko'
  },
  'es-es': {
    ogLocale: 'es_ES',
    twitterSite: '@datawhale',
    lang: 'es-ES',
    hreflang: 'es'
  },
  'fr-fr': {
    ogLocale: 'fr_FR',
    twitterSite: '@datawhale',
    lang: 'fr-FR',
    hreflang: 'fr'
  },
  'de-de': {
    ogLocale: 'de_DE',
    twitterSite: '@datawhale',
    lang: 'de-DE',
    hreflang: 'de'
  },
  'ar-sa': {
    ogLocale: 'ar_SA',
    twitterSite: '@datawhale',
    lang: 'ar-SA',
    hreflang: 'ar'
  },
  'vi-vn': {
    ogLocale: 'vi_VN',
    twitterSite: '@datawhale',
    lang: 'vi-VN',
    hreflang: 'vi'
  }
}

const buildLocale = process.env.VITEPRESS_BUILD_LOCALE
const activeBuildLocales = (
  process.env.VITEPRESS_BUILD_LOCALES_ACTIVE ||
  buildLocale ||
  ''
)
  .split(',')
  .map((locale) => locale.trim())
  .filter(Boolean)
const supportedLocaleDirs = Object.keys(localeMap)
const activeSupportedBuildLocales = activeBuildLocales.filter((locale) =>
  supportedLocaleDirs.includes(locale)
)
const localeBuildExcludes = activeSupportedBuildLocales.length
  ? supportedLocaleDirs
      .filter((locale) => !activeSupportedBuildLocales.includes(locale))
      .map((locale) => `${locale}/**`)
  : []
const srcExclude = ['plans/**', ...localeBuildExcludes]
const buildConcurrency = Number.parseInt(
  // VitePress 2 alpha may hash a page before a concurrent render writes it.
  // Default to deterministic rendering; CI can opt into higher concurrency.
  process.env.VITEPRESS_BUILD_CONCURRENCY || '1',
  10
)

if (buildLocale && !supportedLocaleDirs.includes(buildLocale)) {
  console.warn(
    `Unsupported VITEPRESS_BUILD_LOCALE=${buildLocale}. Building all locales.`
  )
}

for (const locale of activeBuildLocales) {
  if (!supportedLocaleDirs.includes(locale)) {
    console.warn(
      `Unsupported active build locale=${locale}. Ignoring it for srcExclude.`
    )
  }
}

// SEO head 生成与 locale 链接工具（含构建期使用的 rewriteMissingLocaleMenuLinks）
const { getSeoHead, rewriteMissingLocaleMenuLinks } = createSeo({
  base,
  siteUrl,
  localeMap,
  supportedLocaleDirs
})

const commonThemeConfig = {
  logo: '/assets/easy-vibe-logo-hd.svg',
  siteTitle: false,
  search: false,
  // socialLinks: [
  //   { icon: 'github', link: 'https://github.com/datawhalechina/easy-vibe' }
  // ],
  editLink: {
    pattern: 'https://github.com/datawhalechina/easy-vibe/edit/main/docs/:path',
    text: 'Edit this page on GitHub'
  },
  outline: {
    level: [1, 6]
  },
  footer: {
    message:
      '<a href="https://beian.miit.gov.cn/" target="_blank">京ICP备2026002630号-1</a> | <a href="https://beian.mps.gov.cn/#/query/webSearch?code=11010602202215" rel="noreferrer" target="_blank">京公网安备11010602202215号</a>',
    copyright:
      '本作品采用 <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议（CC BY-NC-SA 4.0）</a> 进行许可'
  }
}

// 构建钩子（transformHtml / transformHead / buildEnd）
const buildHooks = createBuildHooks({
  base,
  siteUrl,
  supportedLocaleDirs,
  activeSupportedBuildLocales,
  rewriteMissingLocaleMenuLinks
})

const docFooterLabels = {
  'zh-cn': { prev: '上一页', next: '下一页' },
  en: { prev: 'Previous page', next: 'Next page' },
  'ja-jp': { prev: '前のページ', next: '次のページ' },
  'zh-tw': { prev: '上一頁', next: '下一頁' },
  'ko-kr': { prev: '이전 페이지', next: '다음 페이지' },
  'es-es': { prev: 'Página anterior', next: 'Página siguiente' },
  'fr-fr': { prev: 'Page précédente', next: 'Page suivante' },
  'de-de': { prev: 'Vorherige Seite', next: 'Nächste Seite' },
  'ar-sa': { prev: 'الصفحة السابقة', next: 'الصفحة التالية' },
  'vi-vn': { prev: 'Trang trước', next: 'Trang tiếp theo' }
}

export default defineConfig({
  srcExclude,
  ...(Number.isFinite(buildConcurrency) && buildConcurrency > 0
    ? { buildConcurrency }
    : {}),
  markdown: {
    config: (md) => {
      md.use(markdownItKatex)

      // Long tutorials contain many screenshots. Native lazy loading keeps
      // below-the-fold images from competing with the initial page render,
      // while async decoding prevents large screenshots from blocking paint.
      const defaultImageRenderer =
        md.renderer.rules.image ||
        ((tokens, index, options, env, self) =>
          self.renderToken(tokens, index, options))
      md.renderer.rules.image = (tokens, index, options, env, self) => {
        const token = tokens[index]
        const pagePath = env.relativePath || env.filePath || env.path || ''
        const isStage1Page = /(^|[/\\])stage-1([/\\]|$)/.test(pagePath)

        if (isStage1Page) {
          if (token.attrIndex('decoding') < 0)
            token.attrSet('decoding', 'async')
          if (token.attrIndex('loading') < 0) token.attrSet('loading', 'lazy')
        }

        return defaultImageRenderer(tokens, index, options, env, self)
      }
    }
  },
  base: base,
  ignoreDeadLinks: true,

  // Vite 配置
  vite: {
    server: {
      watch: {
        ignored: ['**/docs/.vitepress/dist/**']
      }
    },
    build: {
      chunkSizeWarningLimit: 2000
    }
  },

  // Sitemap 配置
  sitemap: {
    hostname: siteUrl,
    changefreq: 'weekly',
    priority: {
      '/': 1.0,
      '/zh-cn/': 0.9,
      '/zh-cn/stage-1/': 0.8,
      '/zh-cn/stage-2/': 0.8,
      '/zh-cn/stage-3/': 0.8,
      '/zh-cn/appendix/': 0.7
    },
    transformItems(items) {
      return items.filter((item) => {
        const url = item.url
        if (
          url.includes('/extra/') ||
          url.includes('/examples/') ||
          url.includes('/project/')
        ) {
          return false
        }
        return true
      })
    }
  },

  ...buildHooks,

  // 多语言配置 - 使用 cn/en-us/ja 结构
  locales: {
    // 根路径 — 仅用于 404 页面兜底，实际首页由 docs/index.md 自动重定向
    root: {
      label: '',
      lang: 'zh-CN',
      link: '/zh-cn/',
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: '页面未找到',
          quote: '你访问的页面不存在，可能已被移动或删除。',
          linkText: '返回首页',
          linkUrl: '/zh-cn/'
        }
      }
    },
    // 中文
    'zh-cn': {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh-cn/',
      title: 'Easy-Vibe 教程',
      description:
        '从零到一学习 Vibe Coding - 零基础学会用 AI 编程，掌握 Claude Code、Cursor 等 AI IDE 工具',
      head: getSeoHead(
        'zh-cn',
        'Easy-Vibe 教程',
        '从零到一学习 Vibe Coding - 零基础学会用 AI 编程，掌握 Claude Code、Cursor 等 AI IDE 工具'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: '页面未找到',
          quote: '你访问的页面不存在，可能已被移动或删除。',
          linkText: '返回首页',
          linkUrl: '/zh-cn/'
        },
        outline: {
          level: [1, 6],
          label: '页面导航'
        },
        docFooter: docFooterLabels['zh-cn'],
        nav: [
          { text: '首页', link: '/zh-cn/' },
          {
            text: '零基础入门',
            link: '/zh-cn/stage-1/learning-map/',
            activeMatch: '/zh-cn/stage-1/'
          },
          {
            text: '初中级开发',
            link: '/zh-cn/stage-2/frontend/lovart-assets/',
            activeMatch: '/zh-cn/stage-2/'
          },
          {
            text: '高级开发',
            link: '/zh-cn/stage-3/core-skills/basics/',
            activeMatch: '/zh-cn/stage-3/'
          },
          {
            text: '附录知识库',
            link: '/zh-cn/appendix/index',
            activeMatch: '/zh-cn/appendix/'
          },
          {
            text: 'Vibe 故事',
            link: '/zh-cn/vibe-stories/story-1',
            activeMatch:
              '/zh-cn/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: zhCnSidebar
      }
    },

    // 英文
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Easy-Vibe Tutorial',
      description:
        'Learn Vibe Coding from Zero to Advanced - Master AI programming with Claude Code, Cursor, and other AI IDE tools',
      head: getSeoHead(
        'en',
        'Easy-Vibe Tutorial',
        'Learn Vibe Coding from Zero to Advanced - Master AI programming with Claude Code, Cursor, and other AI IDE tools'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'Page Not Found',
          quote:
            'The page you are looking for does not exist or has been moved.',
          linkText: 'Take me home',
          linkUrl: '/en/'
        },
        outline: {
          level: [1, 6],
          label: 'On this page'
        },
        docFooter: docFooterLabels.en,
        nav: [
          { text: 'Home', link: '/en/' },
          {
            text: 'Getting Started',
            link: '/en/stage-1/learning-map/',
            activeMatch: '/en/stage-1/'
          },
          {
            text: 'Full-Stack Development',
            link: '/en/stage-2/frontend/lovart-assets/',
            activeMatch: '/en/stage-2/'
          },
          {
            text: 'Advanced Development',
            link: '/en/stage-3/core-skills/basics/',
            activeMatch: '/en/stage-3/'
          },
          {
            text: 'Appendix',
            link: '/en/appendix/index',
            activeMatch: '/en/appendix/'
          },
          {
            text: getVibeStoriesNavText('en'),
            link: '/en/vibe-stories/story-1',
            activeMatch:
              '/en/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/en/vibe-stories/': getVibeStoriesSidebar('en'),
          '/en/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('en'),
          '/en/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('en'),
          '/en/stage-1/': productManagerSidebarEn,
          '/en/stage-2/': stage2SidebarEn,
          '/en/stage-3/': stage3SidebarEn,
          '/en/appendix/': localizeAppendixSidebar(appendixSidebarEn, 'en')
        }
      }
    },

    // 日文
    'ja-jp': {
      label: '日本語',
      lang: 'ja-JP',
      link: '/ja-jp/',
      title: 'Easy-Vibe チュートリアル',
      description:
        'ゼロから学ぶ Vibe Coding - AIプログラミングを初めから体系的に学習',
      head: getSeoHead(
        'ja-jp',
        'Easy-Vibe チュートリアル',
        'ゼロから学ぶ Vibe Coding - AIプログラミングを初めから体系的に学習'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'ページが見つかりません',
          quote: 'お探しのページは存在しないか、移動された可能性があります。',
          linkText: 'ホームに戻る',
          linkUrl: '/ja-jp/'
        },
        outline: {
          level: [1, 6],
          label: 'このページの目次'
        },
        docFooter: docFooterLabels['ja-jp'],
        nav: [
          { text: 'ホーム', link: '/ja-jp/' },
          {
            text: '初心者とPM',
            link: '/ja-jp/stage-1/learning-map/',
            activeMatch: '/ja-jp/stage-1/'
          },
          {
            text: 'フルスタック開発',
            link: '/ja-jp/stage-2/',
            activeMatch: '/ja-jp/stage-2/'
          },
          {
            text: '上級開発',
            link: '/ja-jp/stage-3/',
            activeMatch: '/ja-jp/stage-3/'
          },
          {
            text: '付録',
            link: '/ja-jp/appendix/',
            activeMatch: '/ja-jp/appendix/'
          },
          {
            text: getVibeStoriesNavText('ja-jp'),
            link: '/ja-jp/vibe-stories/story-1',
            activeMatch:
              '/ja-jp/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/ja-jp/vibe-stories/': getVibeStoriesSidebar('ja-jp'),
          '/ja-jp/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('ja-jp'),
          '/ja-jp/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('ja-jp'),
          '/ja-jp/stage-1/': getStage1Sidebar('ja-jp'),
          '/ja-jp/stage-2/': getStage2Sidebar('ja-jp'),
          '/ja-jp/stage-3/': getStage3Sidebar('ja-jp'),
          '/ja-jp/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'ja-jp'
          )
        }
      }
    },
    'zh-tw': {
      label: '繁體中文',
      lang: 'zh-TW',
      link: '/zh-tw/',
      title: 'Easy-Vibe 教程',
      description:
        '從零到一學習 Vibe Coding - 零基礎學會用 AI 編程，掌握 Claude Code、Cursor 等 AI IDE 工具',
      head: getSeoHead(
        'zh-tw',
        'Easy-Vibe 教程',
        '從零到一學習 Vibe Coding - 零基礎學會用 AI 編程，掌握 Claude Code、Cursor 等 AI IDE 工具'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: '頁面未找到',
          quote: '你訪問的頁面不存在，可能已被移動或刪除。',
          linkText: '返回首頁',
          linkUrl: '/zh-tw/'
        },
        outline: {
          level: [1, 6],
          label: '頁面導航'
        },
        docFooter: docFooterLabels['zh-tw'],
        nav: [
          { text: '首頁', link: '/zh-tw/' },
          {
            text: '新手與產品原型',
            link: '/zh-tw/stage-1/learning-map/',
            activeMatch: '/zh-tw/stage-1/'
          },
          {
            text: '初中級開發',
            link: '/zh-tw/stage-2/',
            activeMatch: '/zh-tw/stage-2/'
          },
          {
            text: '高級開發',
            link: '/zh-tw/stage-3/',
            activeMatch: '/zh-tw/stage-3/'
          },
          {
            text: '附錄',
            link: '/zh-tw/appendix/',
            activeMatch: '/zh-tw/appendix/'
          },
          {
            text: getVibeStoriesNavText('zh-tw'),
            link: '/zh-tw/vibe-stories/story-1',
            activeMatch:
              '/zh-tw/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/zh-tw/vibe-stories/': getVibeStoriesSidebar('zh-tw'),
          '/zh-tw/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('zh-tw'),
          '/zh-tw/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('zh-tw'),
          '/zh-tw/stage-1/': getStage1Sidebar('zh-tw'),
          '/zh-tw/stage-2/': getStage2Sidebar('zh-tw'),
          '/zh-tw/stage-3/': getStage3Sidebar('zh-tw'),
          '/zh-tw/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'zh-tw'
          )
        }
      }
    },
    'ko-kr': {
      label: '한국어',
      lang: 'ko-KR',
      link: '/ko-kr/',
      title: 'Easy-Vibe 튜토리얼',
      description:
        'Vibe Coding을 처음부터 체계적으로 학습합니다 - AI 프로그래밍을 처음부터 고급까지',
      head: getSeoHead(
        'ko-kr',
        'Easy-Vibe 튜토리얼',
        'Vibe Coding을 처음부터 체계적으로 학습합니다 - AI 프로그래밍을 처음부터 고급까지'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: '페이지를 찾을 수 없습니다',
          quote: '찾고 있는 페이지가 존재하지 않거나 이동되었을 수 있습니다.',
          linkText: '홈으로 돌아가기',
          linkUrl: '/ko-kr/'
        },
        outline: {
          level: [1, 6],
          label: '페이지 탐색'
        },
        docFooter: docFooterLabels['ko-kr'],
        nav: [
          { text: '홈', link: '/ko-kr/' },
          {
            text: '초보자 & PM',
            link: '/ko-kr/stage-1/learning-map/',
            activeMatch: '/ko-kr/stage-1/'
          },
          {
            text: '풀스택 개발',
            link: '/ko-kr/stage-2/',
            activeMatch: '/ko-kr/stage-2/'
          },
          {
            text: '고급 개발',
            link: '/ko-kr/stage-3/',
            activeMatch: '/ko-kr/stage-3/'
          },
          {
            text: '부록',
            link: '/ko-kr/appendix/',
            activeMatch: '/ko-kr/appendix/'
          },
          {
            text: getVibeStoriesNavText('ko-kr'),
            link: '/ko-kr/vibe-stories/story-1',
            activeMatch:
              '/ko-kr/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/ko-kr/vibe-stories/': getVibeStoriesSidebar('ko-kr'),
          '/ko-kr/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('ko-kr'),
          '/ko-kr/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('ko-kr'),
          '/ko-kr/stage-1/': productManagerSidebarKo,
          '/ko-kr/stage-2/': getStage2Sidebar('ko-kr'),
          '/ko-kr/stage-3/': getStage3Sidebar('ko-kr'),
          '/ko-kr/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'ko-kr'
          )
        }
      }
    },
    'es-es': {
      label: 'Español',
      lang: 'es-ES',
      link: '/es-es/',
      title: 'Tutorial de Easy-Vibe',
      description:
        'Aprende Vibe Coding desde cero hasta avanzado - Domina la programación con IA desde el principio',
      head: getSeoHead(
        'es-es',
        'Tutorial de Easy-Vibe',
        'Aprende Vibe Coding desde cero hasta avanzado - Domina la programación con IA desde el principio'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'Página no encontrada',
          quote: 'La página que buscas no existe o ha sido movida.',
          linkText: 'Volver al inicio',
          linkUrl: '/es-es/'
        },
        outline: {
          level: [1, 6],
          label: 'Navegación de página'
        },
        docFooter: docFooterLabels['es-es'],
        nav: [
          { text: 'Inicio', link: '/es-es/' },
          {
            text: 'Principiante y PM',
            link: '/es-es/stage-1/learning-map/',
            activeMatch: '/es-es/stage-1/'
          },
          {
            text: 'Desarrollo Full Stack',
            link: '/es-es/stage-2/',
            activeMatch: '/es-es/stage-2/'
          },
          {
            text: 'Desarrollo Avanzado',
            link: '/es-es/stage-3/',
            activeMatch: '/es-es/stage-3/'
          },
          {
            text: 'Apéndice',
            link: '/es-es/appendix/',
            activeMatch: '/es-es/appendix/'
          },
          {
            text: getVibeStoriesNavText('es-es'),
            link: '/es-es/vibe-stories/story-1',
            activeMatch:
              '/es-es/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/es-es/vibe-stories/': getVibeStoriesSidebar('es-es'),
          '/es-es/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('es-es'),
          '/es-es/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('es-es'),
          '/es-es/stage-1/': getStage1Sidebar('es-es'),
          '/es-es/stage-2/': getStage2Sidebar('es-es'),
          '/es-es/stage-3/': getStage3Sidebar('es-es'),
          '/es-es/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'es-es'
          )
        }
      }
    },
    'fr-fr': {
      label: 'Français',
      lang: 'fr-FR',
      link: '/fr-fr/',
      title: 'Tutoriel Easy-Vibe',
      description:
        'Apprenez Vibe Coding de zéro à avancé - Maîtrisez la programmation IA du début au niveau avancé',
      head: getSeoHead(
        'fr-fr',
        'Tutoriel Easy-Vibe',
        'Apprenez Vibe Coding de zéro à avancé - Maîtrisez la programmation IA du début au niveau avancé'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'Page non trouvée',
          quote: "La page que vous recherchez n'existe pas ou a été déplacée.",
          linkText: "Retour à l'accueil",
          linkUrl: '/fr-fr/'
        },
        outline: {
          level: [1, 6],
          label: 'Navigation de page'
        },
        docFooter: docFooterLabels['fr-fr'],
        nav: [
          { text: 'Accueil', link: '/fr-fr/' },
          {
            text: 'Débutant & PM',
            link: '/fr-fr/stage-1/learning-map/',
            activeMatch: '/fr-fr/stage-1/'
          },
          {
            text: 'Développement Full Stack',
            link: '/fr-fr/stage-2/',
            activeMatch: '/fr-fr/stage-2/'
          },
          {
            text: 'Développement Avancé',
            link: '/fr-fr/stage-3/',
            activeMatch: '/fr-fr/stage-3/'
          },
          {
            text: 'Annexe',
            link: '/fr-fr/appendix/',
            activeMatch: '/fr-fr/appendix/'
          },
          {
            text: getVibeStoriesNavText('fr-fr'),
            link: '/fr-fr/vibe-stories/story-1',
            activeMatch:
              '/fr-fr/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/fr-fr/vibe-stories/': getVibeStoriesSidebar('fr-fr'),
          '/fr-fr/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('fr-fr'),
          '/fr-fr/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('fr-fr'),
          '/fr-fr/stage-1/': getStage1Sidebar('fr-fr'),
          '/fr-fr/stage-2/': getStage2Sidebar('fr-fr'),
          '/fr-fr/stage-3/': getStage3Sidebar('fr-fr'),
          '/fr-fr/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'fr-fr'
          )
        }
      }
    },
    'de-de': {
      label: 'Deutsch',
      lang: 'de-DE',
      link: '/de-de/',
      title: 'Easy-Vibe Tutorial',
      description:
        'Lernen Sie Vibe Coding von Null bis Fortgeschritten - Meistern Sie die KI-Programmierung von Grund auf',
      head: getSeoHead(
        'de-de',
        'Easy-Vibe Tutorial',
        'Lernen Sie Vibe Coding von Null bis Fortgeschritten - Meistern Sie die KI-Programmierung von Grund auf'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'Seite nicht gefunden',
          quote: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
          linkText: 'Zurück zur Startseite',
          linkUrl: '/de-de/'
        },
        outline: {
          level: [1, 6],
          label: 'Seitennavigation'
        },
        docFooter: docFooterLabels['de-de'],
        nav: [
          { text: 'Start', link: '/de-de/' },
          {
            text: 'Anfänger & PM',
            link: '/de-de/stage-1/learning-map/',
            activeMatch: '/de-de/stage-1/'
          },
          {
            text: 'Full Stack Entwicklung',
            link: '/de-de/stage-2/',
            activeMatch: '/de-de/stage-2/'
          },
          {
            text: 'Fortgeschrittene Entwicklung',
            link: '/de-de/stage-3/',
            activeMatch: '/de-de/stage-3/'
          },
          {
            text: 'Anhang',
            link: '/de-de/appendix/',
            activeMatch: '/de-de/appendix/'
          },
          {
            text: getVibeStoriesNavText('de-de'),
            link: '/de-de/vibe-stories/story-1',
            activeMatch:
              '/de-de/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/de-de/vibe-stories/': getVibeStoriesSidebar('de-de'),
          '/de-de/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('de-de'),
          '/de-de/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('de-de'),
          '/de-de/stage-1/': getStage1Sidebar('de-de'),
          '/de-de/stage-2/': getStage2Sidebar('de-de'),
          '/de-de/stage-3/': getStage3Sidebar('de-de'),
          '/de-de/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'de-de'
          )
        }
      }
    },
    'ar-sa': {
      label: 'العربية',
      lang: 'ar-SA',
      link: '/ar-sa/',
      title: 'دروس Easy-Vibe',
      description:
        'تعلم Vibe Coding من الصفر إلى المتقدم - إتقان البرمجة بالذكاء الاصطناعي من البداية',
      head: getSeoHead(
        'ar-sa',
        'دروس Easy-Vibe',
        'تعلم Vibe Coding من الصفر إلى المتقدم - إتقان البرمجة بالذكاء الاصطناعي من البداية'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'الصفحة غير موجودة',
          quote: 'الصفحة التي تبحث عنها غير موجودة أو تم نقلها.',
          linkText: 'العودة إلى الرئيسية',
          linkUrl: '/ar-sa/'
        },
        outline: {
          level: [1, 6],
          label: 'تنقل الصفحة'
        },
        docFooter: docFooterLabels['ar-sa'],
        nav: [
          { text: 'الرئيسية', link: '/ar-sa/' },
          {
            text: 'مبتدأ & PM',
            link: '/ar-sa/stage-1/learning-map/',
            activeMatch: '/ar-sa/stage-1/'
          },
          {
            text: 'تطوير Full Stack',
            link: '/ar-sa/stage-2/',
            activeMatch: '/ar-sa/stage-2/'
          },
          {
            text: 'تطوير متقدم',
            link: '/ar-sa/stage-3/',
            activeMatch: '/ar-sa/stage-3/'
          },
          {
            text: 'ملحق',
            link: '/ar-sa/appendix/',
            activeMatch: '/ar-sa/appendix/'
          },
          {
            text: getVibeStoriesNavText('ar-sa'),
            link: '/ar-sa/vibe-stories/story-1',
            activeMatch:
              '/ar-sa/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/ar-sa/vibe-stories/': getVibeStoriesSidebar('ar-sa'),
          '/ar-sa/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('ar-sa'),
          '/ar-sa/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('ar-sa'),
          '/ar-sa/stage-1/': getStage1Sidebar('ar-sa'),
          '/ar-sa/stage-2/': getStage2Sidebar('ar-sa'),
          '/ar-sa/stage-3/': getStage3Sidebar('ar-sa'),
          '/ar-sa/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'ar-sa'
          )
        }
      }
    },
    'vi-vn': {
      label: 'Tiếng Việt',
      lang: 'vi-VN',
      link: '/vi-vn/',
      title: 'Hướng dẫn Easy-Vibe',
      description:
        'Học Vibe Coding từ cơ bản đến nâng cao - Làm chủ lập trình AI từ cơ bản đến chuyên sâu',
      head: getSeoHead(
        'vi-vn',
        'Hướng dẫn Easy-Vibe',
        'Học Vibe Coding từ cơ bản đến nâng cao - Làm chủ lập trình AI từ cơ bản đến chuyên sâu'
      ),
      themeConfig: {
        ...commonThemeConfig,
        notFound: {
          title: 'Không tìm thấy trang',
          quote:
            'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
          linkText: 'Về trang chủ',
          linkUrl: '/vi-vn/'
        },
        outline: {
          level: [1, 6],
          label: 'Điều hướng trang'
        },
        docFooter: docFooterLabels['vi-vn'],
        nav: [
          { text: 'Trang chủ', link: '/vi-vn/' },
          {
            text: 'Người mới & PM',
            link: '/vi-vn/stage-1/learning-map/',
            activeMatch: '/vi-vn/stage-1/'
          },
          {
            text: 'Phát triển Full Stack',
            link: '/vi-vn/stage-2/',
            activeMatch: '/vi-vn/stage-2/'
          },
          {
            text: 'Phát triển Nâng cao',
            link: '/vi-vn/stage-3/',
            activeMatch: '/vi-vn/stage-3/'
          },
          {
            text: 'Phụ lục',
            link: '/vi-vn/appendix/',
            activeMatch: '/vi-vn/appendix/'
          },
          {
            text: getVibeStoriesNavText('vi-vn'),
            link: '/vi-vn/vibe-stories/story-1',
            activeMatch:
              '/vi-vn/(vibe-stories|stage-1/appendix-articles/example0-1|stage-1/appendix-articles/example0-2)/'
          }
        ],
        sidebar: {
          '/vi-vn/vibe-stories/': getVibeStoriesSidebar('vi-vn'),
          '/vi-vn/stage-1/appendix-articles/example0-1/':
            getVibeStoriesSidebar('vi-vn'),
          '/vi-vn/stage-1/appendix-articles/example0-2/':
            getVibeStoriesSidebar('vi-vn'),
          '/vi-vn/stage-1/': getStage1Sidebar('vi-vn'),
          '/vi-vn/stage-2/': getStage2Sidebar('vi-vn'),
          '/vi-vn/stage-3/': getStage3Sidebar('vi-vn'),
          '/vi-vn/appendix/': localizeAppendixSidebar(
            appendixSidebarEn,
            'vi-vn'
          )
        }
      }
    }
  }
})

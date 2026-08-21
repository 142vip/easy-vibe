// Sidebar builders & helpers for the VitePress site.
// Extracted from docs/.vitepress/config.mjs to keep the main config lean.
import fs from 'node:fs'
import {
  productManagerSidebar,
  productManagerSidebarEn,
  productManagerSidebarKo,
  stage2SidebarEn,
  zhCnStage2Sidebar,
  stage3SidebarEn,
  appendixSidebarEn,
  vibeStoriesSidebar,
  vibeStoriesLabels,
  appendixGroupLabels,
  stage1SidebarLabels,
  stage2SidebarLabels,
  zhCnStage3Sidebar,
  stage3SidebarLabels,
  zhCnSidebar
} from './data.mjs'

export {
  productManagerSidebar,
  productManagerSidebarEn,
  productManagerSidebarKo,
  stage2SidebarEn,
  zhCnStage2Sidebar,
  stage3SidebarEn,
  appendixSidebarEn,
  vibeStoriesSidebar,
  zhCnStage3Sidebar,
  zhCnSidebar
}

const LOCALIZED_PATH_PREFIX_RE =
  /^\/(?:zh-cn|en|zh-tw|ja-jp|ko-kr|es-es|fr-fr|de-de|ar-sa|vi-vn)\//

const getVibeStoriesSidebar = (locale) => {
  if (locale === 'zh-cn') return vibeStoriesSidebar
  const labels = vibeStoriesLabels[locale]
  if (!labels) return vibeStoriesSidebar
  return [
    {
      text: labels.groupText,
      collapsed: false,
      items: [
        { text: labels.items[0], link: `/${locale}/vibe-stories/story-1` },
        { text: labels.items[1], link: `/${locale}/vibe-stories/story-2` },
        { text: labels.items[2], link: `/${locale}/vibe-stories/story-3` },
        { text: labels.items[3], link: `/${locale}/vibe-stories/story-4` },
        {
          text: labels.items[4],
          link: `/${locale}/stage-1/appendix-articles/example0-1/vibe-coding-tools-snake-game-tutorial`
        },
        {
          text: labels.items[5],
          link: `/${locale}/stage-1/appendix-articles/example0-2/vibe-coding-tools-build-website-with-ai-coding-and-design-agents`
        }
      ]
    }
  ]
}

const getVibeStoriesNavText = (locale) => {
  const navTexts = {
    'zh-cn': 'Vibe 故事',
    en: 'Vibe Stories',
    'ja-jp': 'Vibe ストーリー',
    'zh-tw': 'Vibe 故事',
    'ko-kr': 'Vibe 스토리',
    'es-es': 'Historias Vibe',
    'fr-fr': 'Histoires Vibe',
    'de-de': 'Vibe-Geschichten',
    'ar-sa': 'قصص Vibe',
    'vi-vn': 'Câu chuyện Vibe'
  }
  return navTexts[locale] || 'Vibe Stories'
}

const markdownTitleCache = new Map()

const getMarkdownTitleForLink = (link) => {
  const cleanLink = link.split(/[?#]/)[0].replace(/\/$/, '')
  if (!cleanLink) return null
  if (markdownTitleCache.has(cleanLink))
    return markdownTitleCache.get(cleanLink)

  const relativePath = cleanLink.replace(/^\//, '')
  const candidates = [
    new URL(`../../${relativePath}.md`, import.meta.url),
    new URL(`../../${relativePath}/index.md`, import.meta.url)
  ]

  for (const fileUrl of candidates) {
    if (!fs.existsSync(fileUrl)) continue
    const match = fs.readFileSync(fileUrl, 'utf8').match(/^#\s+(.+?)\s*$/m)
    if (match) {
      const title = match[1].trim()
      markdownTitleCache.set(cleanLink, title)
      return title
    }
  }

  markdownTitleCache.set(cleanLink, null)
  return null
}

const localizeSidebarItemLinks = (items, locale) =>
  items.map((item) => ({
    ...item,
    link: item.link
      ? item.link.replace(LOCALIZED_PATH_PREFIX_RE, `/${locale}/`)
      : item.link,
    items: item.items
      ? localizeSidebarItemLinks(item.items, locale)
      : item.items
  }))

const localizeSidebarLinks = (sidebar, locale) =>
  sidebar.map((group) => ({
    ...group,
    link: group.link
      ? group.link.replace(LOCALIZED_PATH_PREFIX_RE, `/${locale}/`)
      : group.link,
    items: group.items
      ? localizeSidebarItemLinks(group.items, locale)
      : group.items
  }))

const localizeAppendixSidebarItem = (item, locale) => {
  const link = item.link
    ? item.link.replace(LOCALIZED_PATH_PREFIX_RE, `/${locale}/`)
    : item.link

  return {
    ...item,
    link,
    text: link ? getMarkdownTitleForLink(link) || item.text : item.text,
    items: item.items
      ? item.items.map((child) => localizeAppendixSidebarItem(child, locale))
      : item.items
  }
}

const localizeAppendixSidebar = (sidebar, locale) =>
  sidebar.map((group, index) => ({
    ...group,
    text: appendixGroupLabels[locale]?.[index] || group.text,
    link: group.link
      ? group.link.replace(LOCALIZED_PATH_PREFIX_RE, `/${locale}/`)
      : group.link,
    items: group.items
      ? group.items.map((item) => localizeAppendixSidebarItem(item, locale))
      : group.items
  }))

const applySidebarLabels = (
  sidebar,
  locale,
  labelsSource = stage1SidebarLabels
) => {
  const labels = labelsSource[locale]
  if (!labels) return sidebar

  return sidebar.map((group, groupIndex) => ({
    ...group,
    text: labels[groupIndex]?.text ?? group.text,
    items: group.items.map((item, itemIndex) => ({
      ...item,
      text: labels[groupIndex]?.items[itemIndex] ?? item.text
    }))
  }))
}

const getStage1Sidebar = (locale) => {
  if (locale === 'zh-cn') return productManagerSidebar
  if (locale === 'en') return productManagerSidebarEn
  if (locale === 'ko-kr') return productManagerSidebarKo
  return applySidebarLabels(
    localizeSidebarLinks(productManagerSidebarEn, locale),
    locale
  )
}

const getStage2Sidebar = (locale) => {
  if (locale === 'zh-cn') return zhCnStage2Sidebar
  if (locale === 'en') return stage2SidebarEn
  return applySidebarLabels(
    localizeSidebarLinks(stage2SidebarEn, locale),
    locale,
    stage2SidebarLabels
  )
}

const getStage3Sidebar = (locale) => {
  if (locale === 'zh-cn') return zhCnStage3Sidebar
  if (locale === 'en') return stage3SidebarEn
  return applySidebarLabels(
    localizeSidebarLinks(stage3SidebarEn, locale),
    locale,
    stage3SidebarLabels
  )
}

export {
  getVibeStoriesSidebar,
  getVibeStoriesNavText,
  localizeAppendixSidebar,
  getStage1Sidebar,
  getStage2Sidebar,
  getStage3Sidebar
}

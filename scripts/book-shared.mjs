/* global process */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)

export const rootDir = path.resolve(path.dirname(__filename), '..')
export const docsDir = path.join(rootDir, 'docs')
export const distDir = path.join(docsDir, '.vitepress', 'dist')
export const configPath = path.join(docsDir, '.vitepress', 'config.mjs')
export const packageJsonPath = path.join(rootDir, 'package.json')
export const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

function detectBookVersion() {
  const clean = (value) => String(value || '').trim().replace(/^v/, '')
  const env = clean(process.env.PDF_VERSION || process.env.EPUB_VERSION || '')
  if (env && /^\d+\.\d+\.\d+/.test(env)) return env
  const ghRef = clean(process.env.GITHUB_REF_NAME || '')
  if (/^\d+\.\d+\.\d+/.test(ghRef)) return ghRef
  const result = spawnSync('git', ['-C', rootDir, 'describe', '--tags', '--exact-match', 'HEAD'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  })
  const tag = clean(result.stdout || '')
  if (/^\d+\.\d+\.\d+/.test(tag)) return tag
  return packageJson.version || '0.1.0'
}

// 顶部资源目录下的 logo（用于封面 / 标题页）
export const logoPath = '../public/logo.png'

// --- Locale metadata ---
// easy-vibe 支持 10 种语言，目录名为 locale 键，lang 为 IETF 语言标签
export const LOCALES = [
  'zh-cn',
  'en',
  'zh-tw',
  'ja-jp',
  'ko-kr',
  'es-es',
  'fr-fr',
  'de-de',
  'ar-sa',
  'vi-vn'
]

export const LOCALE_LANG = {
  'zh-cn': 'zh-CN',
  en: 'en-US',
  'zh-tw': 'zh-TW',
  'ja-jp': 'ja-JP',
  'ko-kr': 'ko-KR',
  'es-es': 'es-ES',
  'fr-fr': 'fr-FR',
  'de-de': 'de-DE',
  'ar-sa': 'ar-SA',
  'vi-vn': 'vi-VN'
}

// 各语言在书内的书名 / 副标题
export const LOCALE_TITLE = {
  'zh-cn': 'Easy-Vibe 教程',
  en: 'Easy-Vibe Tutorial',
  'zh-tw': 'Easy-Vibe 教學',
  'ja-jp': 'Easy-Vibe チュートリアル',
  'ko-kr': 'Easy-Vibe 튜토리얼',
  'es-es': 'Tutorial Easy-Vibe',
  'fr-fr': 'Tutoriel Easy-Vibe',
  'de-de': 'Easy-Vibe Tutorial',
  'ar-sa': 'برنامج Easy-Vibe التعليمي',
  'vi-vn': 'Hướng dẫn Easy-Vibe'
}

export const LOCALE_SUBTITLE = {
  'zh-cn': '从零到一学习 Vibe Coding',
  en: 'Learn Vibe Coding from Zero to One',
  'zh-tw': '從零到一學習 Vibe Coding',
  'ja-jp': 'ゼロから Vibe Coding を学ぶ',
  'ko-kr': 'Vibe Coding을 처음부터 배우기',
  'es-es': 'Aprende Vibe Coding desde cero',
  'fr-fr': 'Apprenez le Vibe Coding de zéro',
  'de-de': 'Vibe Coding von Null an lernen',
  'ar-sa': 'تعلّم برمجة الأجواء من الصفر',
  'vi-vn': 'Học Vibe Coding từ số không'
}

// 各语言下 stage 的分组标题（用于书籍 Part 标题；未提供时回退英文）
export const STAGE_PART_LABELS = {
  'zh-cn': ['零基础入门', '初中级开发', '高级开发'],
  en: ['Getting Started', 'Intermediate Development', 'Advanced Development'],
  'zh-tw': ['新手入門', '初中級開發', '高級開發'],
  'ja-jp': ['初心編', '中級編', '上級編'],
  'ko-kr': ['초급', '중급', '고급'],
  'es-es': ['Nivel inicial', 'Nivel intermedio', 'Nivel avanzado'],
  'fr-fr': ['Débutant', 'Intermédiaire', 'Avancé'],
  'de-de': ['Anfänger', 'Fortgeschritten', 'Erweitert'],
  'ar-sa': ['مستوى مبتدئ', 'مستوى متوسط', 'مستوى متقدم'],
  'vi-vn': ['Cấp độ cơ bản', 'Cấp độ trung cấp', 'Cấp độ nâng cao']
}

// --- Book metadata ---

const sanbuGithubUrl =
  process.env.PDF_SANBU_GITHUB_URL || 'https://github.com/sanbuphy'

export const bookVersion = detectBookVersion()

export const bookAuthor =
  process.env.PDF_AUTHORS ||
  process.env.PDF_AUTHOR ||
  packageJson.author ||
  'Datawhale Easy-Vibe'

export const bookLicense = 'CC-BY-NC-SA-4.0'

export const bookBuildDate =
  process.env.PDF_BUILD_DATE ||
  new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'long',
    timeZone: 'Asia/Shanghai'
  }).format(new Date())

export function repositoryUrl() {
  if (process.env.PDF_GITHUB_URL) return process.env.PDF_GITHUB_URL

  const githubRepository = process.env.GITHUB_REPOSITORY
  if (githubRepository && githubRepository.includes('/')) {
    return `https://github.com/${githubRepository.replace(/\.git$/, '')}`
  }

  const repository =
    typeof packageJson.repository === 'string'
      ? packageJson.repository
      : packageJson.repository?.url || ''

  const sshMatch = repository.match(/github\.com:(.+?)\/(.+?)(\.git)?$/)
  if (sshMatch) {
    return `https://github.com/${sshMatch[1]}/${sshMatch[2]}`
  }

  const normalized = repository
    .replace(/^git\+/, '')
    .replace(/^https?:\/\/github\.com\//, '')
    .replace(/^git@github\.com:/, '')
    .replace(/\.git$/, '')

  if (normalized.includes('/')) {
    return `https://github.com/${normalized}`
  }

  return 'https://github.com/datawhalechina/easy-vibe'
}

export const bookGithubUrl = repositoryUrl()

// --- Utility functions ---

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function stripFrontmatter(value) {
  if (!value.startsWith('---\n')) return value
  const end = value.indexOf('\n---\n', 4)
  if (end === -1) return value
  return value.slice(end + 5)
}

export function stripScriptSetup(value) {
  const out = String(value).replace(/\r\n/g, '\n')
  let before
  let after = out
  // 反复移除所有 <script>/<style> 块（全局、非锚定，直到稳定），
  // 处理 frontmatter 后、文件任意位置的 script setup 模块。
  do {
    before = after
    after = before
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '\n')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '\n')
      .replace(/<template\b[^>]*>[\s\S]*?<\/template>/gi, '\n')
  } while (after.length !== before.length)
  return after
}

// ---------------------------------------------------------------------------
// Vue 组件块智能改写：把内容型组件恢复为可渲染的 markdown，
// 包装型组件透传内部内容，真正无内容的交互 Demo 仅留一行轻量注释。
// 供 PDF / EPUB 共用。
// ---------------------------------------------------------------------------

// 纯包装器：自身不产生内容，只包裹内部内容（应透传内部，仅去掉标签）
const WRAPPER_COMPONENTS = new Set([
  'ClientOnly',
  'NavGrid',
  'Tabs',
  'TabItem',
  'Tab',
  'Details',
  'template',
  'Transition',
  'Teleport'
])

// 逐行扫描：识别跨多行的 PascalCase Vue 组件块。
// 返回 { name, next, isOpen } 或 null。兼容属性引号、嵌套 <>、自闭合。
export function readVueComponentBlock(lines, start) {
  const first = lines[start] || ''
  const openMatch = first.match(/^\s*<([A-Z][A-Za-z0-9_:-]*)\b/)
  const closeMatch = first.match(/^\s*<\/([A-Z][A-Za-z0-9_:-]*)\s*>/)
  if (!openMatch && !closeMatch) return null
  if (closeMatch && !openMatch) {
    return { name: closeMatch[1], next: start + 1, isOpen: false }
  }
  const name = openMatch[1]
  let line = start
  let col = 0
  let depth = 0
  let started = false
  let inQuote = null
  while (line < lines.length) {
    const row = lines[line]
    while (col < row.length) {
      const c = row[col]
      const prev = row[col - 1]
      if (inQuote) {
        if (c === inQuote && prev !== '\\') inQuote = null
        col += 1
        continue
      }
      if (c === '"' || c === "'" || c === '`') {
        inQuote = c
        col += 1
        continue
      }
      if (!started) {
        if (c === '<') {
          depth += 1
          started = true
        }
        col += 1
        continue
      }
      if (c === '<' && row[col + 1] === '/') {
        depth -= 1
        if (depth === 0) {
          col = row.indexOf('>', col) + 1 || row.length
          return { name, next: col >= row.length ? line + 1 : line + 1, isOpen: true }
        }
        col += 2
        continue
      }
      if (c === '<') {
        const inner = row.slice(col + 1).match(/^([A-Za-z][A-Za-z0-9_:-]*)\b/)
        if (inner) {
          depth += 1
          col += 1 + inner[0].length
          continue
        }
        col += 1
        continue
      }
      if (c === '>' && prev === '/') {
        depth -= 1
        col += 1
        if (depth === 0) return { name, next: col >= row.length ? line + 1 : line + 1, isOpen: true }
        continue
      }
      if (c === '>') {
        depth -= 1
        col += 1
        if (depth === 0) {
          // 开标签结束但非自闭合（有 body / slot）。返回 isOpen=true 表示是配对标签，
          // 让调用方自行处理内部内容。
          return { name, next: col >= row.length ? line + 1 : line + 1, isOpen: true, paired: true }
        }
        continue
      }
      col += 1
    }
    line += 1
    col = 0
  }
  return { name, next: lines.length, isOpen: true, paired: true }
}

function unquoteValue(raw) {
  const s = String(raw || '').trim()
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, "'")
  }
  return null // 变量引用 / 未加引号 → 无法直接取值
}

function extractProp(blockText, propName) {
  // 匹配  propName="..." | :propName="..." | propName='...' | :propName='...'
  const re = new RegExp(
    `(?::?${propName}\\s*=\\s*)(["'])([\\s\\S]*?)\\1`,
    'i'
  )
  const m = blockText.match(re)
  if (!m) return null
  return unquoteValue(m[0])
}

function extractBodyBetweenTags(name, lines) {
  // 找到开标签的结束位置和闭标签 </name>
  const block = lines.join('\n')
  const closeRe = new RegExp(`<\\/${name}\\s*>`, 'i')
  const openEnd = block.indexOf('>') + 1
  const closeStart = block.search(closeRe)
  if (closeStart === -1) return ''
  return block.slice(openEnd, closeStart).trim()
}

function parseStepItems(blockText) {
  // :items="[ { title: '..', description: '..' }, ... ]"
  const m = blockText.match(/:items\s*=\s*(\[[\s\S]*?\])/i)
  if (!m) return []
  const items = []
  const itemRe = /\{\s*title\s*:\s*(['"])([\s\S]*?)\1[\s\S]*?(?:description\s*:\s*(['"])([\s\S]*?)\3)?\s*\}/gi
  let im
  while ((im = itemRe.exec(m[1])) !== null) {
    items.push({ title: im[2], description: im[4] || '' })
  }
  return items
}

// 根据组件名把整块改写为 markdown 行数组。
function renderComponentAsMarkdown(name, lines, locale) {
  const block = lines.join('\n').trim()
  const tShort =
    locale === 'zh-cn' || locale === 'zh-tw' ? '交互演示' : locale === 'ja-jp' ? 'インタラクティブデモ' : 'Interactive demo'

  // --- 内容型自闭合组件 ---
  if (name === 'NavCard') {
    const title = extractProp(block, 'title')
    const desc = extractProp(block, 'description')
    if (!title) return []
    return [`- **${title}**${desc ? `：${desc}` : ''}`]
  }

  if (name === 'StepBar') {
    const items = parseStepItems(block)
    if (!items.length) return []
    return items.map((it, idx) => `${idx + 1}. **${it.title}**${it.description ? `：${it.description}` : ''}`)
  }

  if (name === 'RelatedArticlesSection') {
    const title = extractProp(block, 'title')
    const desc = extractProp(block, 'description')
    if (!title && !desc) return []
    return [`::: tip ${title || ''}`, desc || '', ':::']
  }

  // --- 配对内容组件：保留正文 + 元信息框 ---
  if (name === 'ChapterIntroduction') {
    const body = extractBodyBetweenTags(name, lines)
    const meta = []
    const duration = extractProp(block, 'duration')
    const core = extractProp(block, 'coreOutput')
    const expected = extractProp(block, 'expectedOutput')
    if (duration) meta.push(`**${locale === 'en' ? 'Duration' : '时长'}**：${duration}`)
    if (core) meta.push(`**${locale === 'en' ? 'Core output' : '核心产出'}**：${core}`)
    if (expected) meta.push(`**${locale === 'en' ? 'Goal' : '达成目标'}**：${expected}`)
    const out = []
    if (meta.length) {
      out.push(`::: info ${locale === 'en' ? 'Chapter at a glance' : '本章导读'}`)
      out.push(meta.join('  ·  '))
      out.push(':::')
    }
    if (body) out.push(body)
    return out
  }

  // --- 纯包装器：透传内部内容 ---
  if (WRAPPER_COMPONENTS.has(name)) {
    const body = extractBodyBetweenTags(name, lines)
    return body ? body.split('\n') : []
  }

  // --- 配对且含正文的未知组件：保留正文 ---
  const body = extractBodyBetweenTags(name, lines)
  if (body) return body.split('\n')

  // --- 无正文的自闭合交互 Demo：一行轻量注释 ---
  return [`*${tShort}：${name}（详见在线版本）*`]
}

// 顶层入口：把源 markdown 中的 Vue 组件块改写为可渲染内容。
// 会跳过 ``` 代码块内的 <PascalCase> 伪代码。
export function transformVueComponents(md, locale) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0
  let inFence = false
  let fenceChar = ''
  while (i < lines.length) {
    const line = lines[i]
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})/)
    if (fenceMatch) {
      const ch = fenceMatch[1][0]
      if (!inFence) {
        inFence = true
        fenceChar = ch
      } else if (line.trim().startsWith(fenceChar)) {
        inFence = false
      }
      out.push(line)
      i += 1
      continue
    }
    if (inFence) {
      out.push(line)
      i += 1
      continue
    }
    const comp = readVueComponentBlock(lines, i)
    if (comp) {
      const blockLines = lines.slice(i, comp.next)
      const replacement = renderComponentAsMarkdown(comp.name, blockLines, locale)
      out.push(...replacement)
      i = comp.next
      continue
    }
    out.push(line)
    i += 1
  }
  return out.join('\n')
}

export function splitSuffix(value) {
  const hashIndex = value.indexOf('#')
  const queryIndex = value.indexOf('?')
  const suffixIndexes = [hashIndex, queryIndex].filter((index) => index >= 0)
  const suffixIndex = suffixIndexes.length ? Math.min(...suffixIndexes) : -1

  if (suffixIndex === -1) {
    return { clean: value, suffix: '' }
  }

  return {
    clean: value.slice(0, suffixIndex),
    suffix: value.slice(suffixIndex)
  }
}

export function pagePathForLink(link, locale) {
  const { clean } = splitSuffix(link.replace(/^\//, ''))

  const localePrefix = clean.startsWith(`${locale}/`) ? clean : `${locale}/${clean}`
  const normalized = localePrefix.replace(/\/$/, '')

  const candidates = [
    path.join(docsDir, `${normalized}.md`),
    path.join(docsDir, normalized, 'index.md')
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) || null
}

export async function loadVitePressConfig() {
  const module = await import(pathToFileURL(configPath).href)
  return module.default
}

// 从 config 中读取某个 locale 的 stage-1/2/3 sidebar（只含正文，不含顶层 appendix）
export function getStageSidebars(config, locale) {
  const sidebar = config.locales?.[locale]?.themeConfig?.sidebar || {}
  const stages = ['stage-1', 'stage-2', 'stage-3']
  return stages.map((stage) => sidebar[`/${locale}/${stage}/`] || [])
}

export function flattenSidebar(items, pages = [], seen = new Set()) {
  for (const item of items || []) {
    if (item.link && !item.link.includes('#') && !seen.has(item.link)) {
      seen.add(item.link)
      pages.push({ title: item.text || item.link, link: item.link })
    }
    if (item.items) {
      flattenSidebar(item.items, pages, seen)
    }
  }
  return pages
}

// 结构化书籍内容：Part(stage) -> Chapter(group) -> pages(items)
// 默认排除附录（顶级 /appendix/ 以及 stage 内嵌的 appendix 路径），只保留 stage 正文。
export function collectBookStructure(stageSidebars, locale, options = {}) {
  const { excludeAppendix = true } = options
  const stageLabels = STAGE_PART_LABELS[locale] || STAGE_PART_LABELS.en
  const chunks = []
  const seenPages = new Set()

  const isAppendix = (link) =>
    excludeAppendix && /(^|\/)appendix(-|$|\/)/i.test(String(link || ''))

  stageSidebars.forEach((sidebar, stageIndex) => {
    chunks.push({
      type: 'part',
      title: stageLabels[stageIndex] || `Stage ${stageIndex + 1}`
    })

    for (const group of sidebar || []) {
      const chapter = {
        type: 'chapter',
        title: group.text || 'Untitled',
        stage: stageIndex + 1,
        pages: []
      }

      const visit = (items) => {
        for (const item of items || []) {
          if (!item.link || item.link.includes('#') || seenPages.has(item.link)) {
            if (item.items) visit(item.items)
            continue
          }
          if (isAppendix(item.link)) continue
          seenPages.add(item.link)
          const page = {
            type: 'page',
            title: item.text || item.link,
            link: item.link,
            filePath: pagePathForLink(item.link, locale)
          }
          chapter.pages.push(page)
          if (item.items) visit(item.items)
        }
      }

      // 分组自身可能带 link（作为该分组的首页）
      if (
        group.link &&
        !group.link.includes('#') &&
        !seenPages.has(group.link) &&
        !isAppendix(group.link)
      ) {
        seenPages.add(group.link)
        chapter.pages.unshift({
          type: 'page',
          title: group.text || group.link,
          link: group.link,
          filePath: pagePathForLink(group.link, locale)
        })
      }

      visit(group.items)

      // 整组是附录（分组 link 或任一子项命中附录路径）时，跳过整章；
      // chapter.pages 为空时也跳过，避免生成空的 itemize。
      const appendixGroup = excludeAppendix
        ? isAppendix(group.link) ||
          recurseFindAppendix(group.items)
        : false
      if (appendixGroup || chapter.pages.length === 0) continue

      chunks.push(chapter)
    }
  })

  return chunks
}

function recurseFindAppendix(items) {
  for (const item of items || []) {
    if (
      item.link &&
      /(^|\/)appendix(-|$|\/)/i.test(String(item.link))
    ) {
      return true
    }
    if (item.items && recurseFindAppendix(item.items)) return true
  }
  return false
}
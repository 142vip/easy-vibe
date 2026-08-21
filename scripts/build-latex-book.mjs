#!/usr/bin/env node
/* eslint-disable no-control-regex */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), '..')

// 确保 xelatex/gs/convert 等工具在常见用户路径下可见
;(function augmentPath() {
  const existing = String(process.env.PATH || '')
  const entries = existing.split(path.delimiter).filter(Boolean)
  const prepend = []
  const candidates = [
    path.join(os.homedir(), 'bin', 'tex'),
    '/usr/local/texlive/2024/bin/universal-darwin',
    '/usr/local/texlive/2023/bin/universal-darwin',
    '/usr/local/texlive/2024/bin/x86_64-linux',
    '/usr/local/texlive/2023/bin/x86_64-linux',
    '/Library/TeX/texbin',
    path.join(os.homedir(), 'homebrew', 'bin'),
    '/opt/homebrew/bin'
  ]
  for (const dir of candidates) {
    if (!entries.includes(dir) && fs.existsSync(dir)) prepend.push(dir)
  }
  if (prepend.length) process.env.PATH = [...prepend, ...entries].join(path.delimiter)
})()

const docsDir = path.join(rootDir, 'docs')
const renderBookAssetScriptPath = path.join(
  rootDir,
  'scripts',
  'render-book-asset.mjs'
)
const configPath = path.join(docsDir, '.vitepress', 'config.mjs')
const packageJsonPath = path.join(rootDir, 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
const workDir = path.join(rootDir, 'temp', 'latex-book')
const assetDir = path.join(workDir, 'assets')
const distDir = path.join(docsDir, '.vitepress', 'dist')
const texPath = path.join(workDir, 'book.tex')

import {
  rootDir as _rootDir,
  docsDir as _docsDir,
  distDir as _distDir,
  packageJson as _packageJson,
  bookVersion,
  bookAuthor,
  bookBuildDate,
  bookGithubUrl,
  LOCALES,
  LOCALE_LANG,
  LOCALE_TITLE,
  LOCALE_SUBTITLE,
  STAGE_PART_LABELS,
  escapeHtml,
  stripFrontmatter,
  stripScriptSetup,
  transformVueComponents,
  splitSuffix,
  loadVitePressConfig,
  getStageSidebars,
  collectBookStructure,
  logoPath
} from './book-shared.mjs'

const locale = String(process.env.PDF_LOCALE || 'zh-cn').toLowerCase()
if (!LOCALES.includes(locale)) {
  console.error(`Unsupported PDF_LOCALE=${locale}. Supported: ${LOCALES.join(', ')}`)
  process.exit(1)
}
const lang = LOCALE_LANG[locale] || 'zh-CN'
const isRtl = locale === 'ar-sa'
const pdfVersion = bookVersion
const pdfVersionLabel = versionLabel(pdfVersion)
const pdfVersionFile = String(pdfVersion).replace(/^v/i, '')
// Keep the production book complete by default; use --limit or PDF_BOOK_LIMIT
// explicitly when a smaller development build is needed.
const sourcePageLimit = Math.max(0, readNumberArg('--limit', 0))
const defaultPdfFileName = `easy-vibe-open-textbook-${locale}-v${pdfVersionFile}.pdf`
const pdfOutputPath = path.join(
  distDir,
  process.env.LATEX_BOOK_FILE_NAME || defaultPdfFileName
)
const pdfAuthors = process.env.PDF_AUTHORS || bookAuthor
const pdfTitle = process.env.PDF_BOOK_TITLE || LOCALE_TITLE[locale]
const pdfEnglishTitle = 'Easy-Vibe'
const pdfSubtitle = process.env.PDF_SUBTITLE || LOCALE_SUBTITLE[locale]
const pdfTagline =
  process.env.PDF_TAGLINE ||
  (locale === 'zh-cn'
    ? '开放教材 · 书籍版 PDF：从零学会用 AI 编程（Vibe Coding）。'
    : `Open textbook PDF: ${pdfSubtitle}.`)
const pdfOnlineUrl =
  process.env.PDF_ONLINE_URL ||
  `https://datawhalechina.github.io/easy-vibe/${locale}/`
const pdfLicenseName =
  'Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)'
const pdfLicenseUrl = 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
const pdfBuildDate =
  process.env.PDF_BUILD_DATE ||
  new Intl.DateTimeFormat(locale === 'zh-cn' ? 'zh-CN' : locale === 'zh-tw' ? 'zh-TW' : locale, {
    dateStyle: 'long',
    timeZone: 'Asia/Shanghai'
  }).format(new Date())
const pdfOptimize = !['0', 'false', 'no', 'off'].includes(
  String(process.env.PDF_OPTIMIZE || '1').toLowerCase()
)
const skipCompile = ['1', 'true', 'yes'].includes(
  String(process.env.PDF_SKIP_COMPILE || '').toLowerCase()
)
const pdfOptimizeProfile = process.env.PDF_OPTIMIZE_PROFILE || 'default'
const pdfTitleLogoWidth = process.env.PDF_LOGO_WIDTH || '90mm'
const pdfBodyFontSize = process.env.PDF_BODY_FONT_SIZE || '9'
const pdfBodyLineHeight = process.env.PDF_BODY_LINE_HEIGHT || '10.8'
const pdfImageWidth = process.env.PDF_IMAGE_WIDTH || '0.9\\linewidth'
const pdfImageMaxHeight = process.env.PDF_IMAGE_MAX_HEIGHT || '0.72\\textheight'
const pdfDiagramImageWidth =
  process.env.PDF_DIAGRAM_IMAGE_WIDTH || '0.96\\linewidth'
const pdfDiagramImageMaxHeight =
  process.env.PDF_DIAGRAM_IMAGE_MAX_HEIGHT || '0.78\\textheight'
const keepWorkDir = process.argv.includes('--keep-workdir')
const buildWarnings = []

// 通用本地化文案
const T = {
  'zh-cn': {
    chapter: '第', chapterSuffix: '章', appendix: '附录', part: '部分',
    contents: '目录', note: '说明', tip: '提示', warning: '注意', danger: '警告',
    details: '补充说明', codeGroup: '代码组', fig: '图', tab: '表',
    chapterGuide: '本章导读', chapterSummary: '本章包含以下小节，建议先扫一遍结构，再进入正文和代码。',
    gettingStarted: '一起开始', 
  },
  'zh-tw': {
    chapter: '第', chapterSuffix: '章', appendix: '附錄', part: '部分',
    contents: '目錄', note: '說明', tip: '提示', warning: '注意', danger: '警告',
    details: '補充說明', codeGroup: '程式碼組', fig: '圖', tab: '表',
    chapterGuide: '本章導讀', chapterSummary: '本章包含以下小節，建議先瀏覽一遍結構，再進入正文與程式碼。',
    gettingStarted: '一起開始',
  },
  en: {
    chapter: 'Chapter ', chapterSuffix: '', appendix: 'Appendix ', part: 'Part',
    contents: 'Contents', note: 'Note', tip: 'Tip', warning: 'Warning', danger: 'Warning',
    details: 'Details', codeGroup: 'Code group', fig: 'Figure', tab: 'Table',
    chapterGuide: 'Chapter Guide', chapterSummary: 'This chapter contains the following sections. Skim the structure first, then move into the prose and code.',
    gettingStarted: 'Getting Started',
  },
  'ja-jp': {
    chapter: '第', chapterSuffix: '章', appendix: '付録', part: '部',
    contents: '目次', note: '説明', tip: 'ヒント', warning: '注意', danger: '警告',
    details: '補足', codeGroup: 'コードグループ', fig: '図', tab: '表',
    chapterGuide: '章の案内', chapterSummary: 'この章には以下のセクションが含まれます。まず構成を確認してから、本文とコードに進みましょう。',
    gettingStarted: 'はじめに',
  },
  'ko-kr': {
    chapter: '제', chapterSuffix: '장', appendix: '부록', part: '부',
    contents: '목차', note: '설명', tip: '팁', warning: '주의', danger: '경고',
    details: '추가 설명', codeGroup: '코드 그룹', fig: '그림', tab: '표',
    chapterGuide: '장 안내', chapterSummary: '이 장에는 다음 섹션이 포함됩니다. 먼저 구성을 훑어본 후 본문과 코드로 넘어가세요.',
    gettingStarted: '시작하기',
  },
  'es-es': {
    chapter: 'Capítulo ', chapterSuffix: '', appendix: 'Apéndice ', part: 'Parte',
    contents: 'Contenidos', note: 'Nota', tip: 'Consejo', warning: 'Advertencia', danger: 'Peligro',
    details: 'Detalles', codeGroup: 'Grupo de código', fig: 'Figura', tab: 'Tabla',
    chapterGuide: 'Guía del capítulo', chapterSummary: 'Este capítulo contiene las siguientes secciones. Examine la estructura primero, luego pase al texto y al código.',
    gettingStarted: 'Comenzar',
  },
  'fr-fr': {
    chapter: 'Chapitre ', chapterSuffix: '', appendix: 'Annexe ', part: 'Partie',
    contents: 'Sommaire', note: 'Remarque', tip: 'Astuce', warning: 'Attention', danger: 'Danger',
    details: 'Détails', codeGroup: 'Groupe de code', fig: 'Figure', tab: 'Tableau',
    chapterGuide: "Guide du chapitre", chapterSummary: "Ce chapitre contient les sections suivantes. Examinez la structure d'abord, puis passez au texte et au code.",
    gettingStarted: 'Commencer',
  },
  'de-de': {
    chapter: 'Kapitel ', chapterSuffix: '', appendix: 'Anhang ', part: 'Teil',
    contents: 'Inhalt', note: 'Hinweis', tip: 'Tipp', warning: 'Warnung', danger: 'Gefahr',
    details: 'Details', codeGroup: 'Codegruppe', fig: 'Abbildung', tab: 'Tabelle',
    chapterGuide: 'Kapitelübersicht', chapterSummary: 'Dieses Kapitel enthält die folgenden Abschnitte. Überfliegen Sie zuerst die Struktur, dann gehen Sie zum Text und Code über.',
    gettingStarted: 'Loslegen',
  },
  'ar-sa': {
    chapter: 'الفصل ', chapterSuffix: '', appendix: 'ملحق ', part: 'جزء',
    contents: 'المحتويات', note: 'ملاحظة', tip: 'نصيحة', warning: 'تحذير', danger: 'خطر',
    details: 'تفاصيل', codeGroup: 'مجموعة أكواد', fig: 'شكل', tab: 'جدول',
    chapterGuide: 'دليل الفصل', chapterSummary: 'يحتوي هذا الفصل على الأقسام التالية. اطلع على الهيكل أولاً، ثم انتقل إلى النص والكود.',
    gettingStarted: 'ابدأ',
  },
  'vi-vn': {
    chapter: 'Chương ', chapterSuffix: '', appendix: 'Phụ lục ', part: 'Phần',
    contents: 'Mục lục', note: 'Ghi chú', tip: 'Mẹo', warning: 'Cảnh báo', danger: 'Nguy hiểm',
    details: 'Chi tiết', codeGroup: 'Nhóm mã', fig: 'Hình', tab: 'Bảng',
    chapterGuide: 'Hướng dẫn chương', chapterSummary: 'Chương này chứa các phần sau. Hãy xem qua cấu trúc trước, sau đó vào phần nội dung và mã.',
    gettingStarted: 'Bắt đầu',
  }
}
const t = T[locale] || T.en

// --- Utility ---

function versionLabel(value) {
  const clean = String(value || '').trim()
  return /^v/i.test(clean) ? clean : `v${clean || '0.1.0'}`
}

function readArg(name, fallback = null) {
  const equalsArg = process.argv.find((arg) => arg.startsWith(`${name}=`))
  if (equalsArg) return equalsArg.slice(name.length + 1)

  const index = process.argv.indexOf(name)
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1]

  return fallback
}

function readNumberArg(name, fallback) {
  const raw = readArg(name, process.env.PDF_BOOK_LIMIT || String(fallback))
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

function toPosix(value) {
  return value.split(path.sep).join('/')
}

function stripMarkdown(value) {
  return value
    .replace(/\{#[^}]+\}/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_~>#]/g, '')
    .trim()
}

function stripTitleNumber(value) {
  return normalizeInlineHtml(stripMarkdown(value))
    .replace(/^第\s*\d+\s*章[：:\s-]*/, '')
    .replace(/^[A-Z]\.\s+/, '')
    .replace(/^\d+(?:\.\d+)*[.、]?\s*/, '')
    .trim()
}

function escapeLatex(value) {
  return String(value)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([{}%&#_^])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\$/g, '\\$')
}

function escapeLatexUrl(value) {
  return String(value)
    .replace(/\\/g, '/')
    .replace(/([{}%#])/g, '\\$1')
}

function normalizePdfSymbols(value) {
  return String(value)
    .replace(/🖼️/g, t.fig)
    .replace(/⚠️/g, t.warning)
    .replace(/🚧/g, t.warning)
    .replace(/🌟/g, 'Star')
    .replace(/⭐/g, t.gettingStarted)
    .replace(/🏆/g, t.gettingStarted)
    .replace(/📁/g, t.contents)
    .replace(/📊/g, t.fig)
    .replace(/📸/g, t.fig)
    .replace(/🚀/g, t.gettingStarted)
    .replace(/✅/g, 'OK')
    .replace(/❌/g, 'NO')
    .replace(/👀/g, t.tip)
    .replace(/👉/g, '→')
    .replace(/👍/g, '+1')
    .replace(/👎/g, '-1')
    .replace(/🔴/g, 'Red')
    .replace(/🔵/g, 'Blue')
    .replace(/⋮/g, '...')
    .replace(/🇨🇳/g, 'China')
    .replace(/📚/g, t.contents)
    .replace(/💡/g, `${t.tip}: `)
    .replace(/🎯/g, 'Goal')
    .replace(/🎓/g, t.gettingStarted)
    .replace(/🐣/g, t.gettingStarted)
    .replace(/🧭/g, t.tip)
    .replace(/🌐/g, t.fig)
    .replace(/🌍/g, t.fig)
    .replace(/🕹️/g, 'Game')
    .replace(/🖥️/g, t.fig)
    .replace(/🎮/g, 'Game')
    .replace(/⛏️/g, t.tip)
    .replace(/🍄/g, '')
    .replace(/⌘/g, 'Cmd')
    .replace(/👁️/g, t.tip)
    .replace(/⚙️/g, t.tip)
    .replace(/📝/g, `${t.note}: `)
    .replace(/🐞/g, 'Bug')
    .replace(/📂/g, t.contents)
    .replace(/🤖/g, 'AI')
    .replace(/🛠️/g, t.tip)
    .replace(/📦/g, 'Package')
    .replace(/☐/g, '[]')
    .replace(/ℹ️/g, t.tip)
    .replace(/📋/g, `${t.note}: `)
    .replace(/🔐/g, t.warning)
    .replace(/🎧/g, t.tip)
    .replace(/👇/g, '↓')
    .replace(/💰/g, t.gettingStarted)
    .replace(/🔥/g, t.gettingStarted)
    .replace(/✨/g, '')
    .replace(/👗/g, '')
    .replace(/🔇/g, t.warning)
    .replace(/🍌/g, '')
    .replace(/⚡/g, t.tip)
    .replace(/🎉/g, t.gettingStarted)
    .replace(/🥳/g, t.gettingStarted)
    .replace(/👏/g, '+1')
    .replace(/🔑/g, t.tip)
    .replace(/🔮/g, t.tip)
    .replace(/🗣️/g, t.tip)
    .replace(/🔗/g, 'Link')
    .replace(/✓/g, 'OK')
    .replace(/✗/g, 'x')
    .replace(/☕/g, 'Coffee')
    .replace(/🌸/g, '')
    .replace(/💬/g, t.tip)
    .replace(/📜/g, t.contents)
    .replace(/🗺/g, t.fig)
    .replace(/💾/g, t.note)
    .replace(/🔊/g, t.tip)
    .replace(/🧪/g, t.tip)
    .replace(/🟢/g, 'Green')
    .replace(/🐛/g, 'Bug')
    .replace(/🤝/g, t.gettingStarted)
    .replace(/►/g, '>')
    .replace(/◄/g, '<')
    .replace(/▶/g, '>')
    .replace(/🔍/g, t.tip)
    .replace(/🛡/g, t.warning)
    .replace(/🔧/g, t.tip)
    .replace(/✍/g, t.note)
    .replace(/🏭/g, t.fig)
    .replace(/🎫/g, t.tip)
    .replace(/➜/g, '->')
    .replace(/🔄/g, t.tip)
    .replace(/\u20E3/g, '')
    .replace(/\uFE0E/g, '')
    .replace(/\uFE0F/g, '')
    .replace(/\bStar\s+Star\b/g, 'Star')
}

function warnOnce(message) {
  if (!buildWarnings.includes(message)) buildWarnings.push(message)
}

function runTool(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  })

  return result.status === 0
}

function runToolCapture(command, args) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  })

  return result.status === 0 ? String(result.stdout || '') : null
}

const rawLatexTokens = []

function rawLatex(value) {
  const key = `RAWLATEX${rawLatexTokens.length}END`
  rawLatexTokens.push(String(value))
  return key
}

function protectLatexTokens() {
  const tokens = []

  return {
    token(value) {
      const key = `LATEXTOKEN${tokens.length}END`
      tokens.push([key, value])
      return key
    },
    restore(value) {
      let output = value
      for (let pass = 0; pass < 6; pass += 1) {
        const previous = output
        for (const [key, tokenValue] of [...tokens].reverse()) {
          output = output.replaceAll(key, tokenValue)
        }
        if (output === previous) break
      }
      return output
    }
  }
}

function normalizeLatexMath(value) {
  return String(value)
    .replace(/\\\\([A-Za-z])/g, (match, commandStart) => `\\${commandStart}`)
    .replace(/\\\*/g, '*')
}

// 判断一段内容是否「看起来像真的数学表达式」。
// 标记文档中大量 $...$ 实际是行内代码/变量名/美元价格/自然语言片段，
// 扔进 LaTeX math mode (cmmi 字体) 会丢失西欧/越南/阿拉伯变音字符。
// 因此必须先判定：含真数学符号/命令才走 math mode，否则当作普通文本。
function looksLikeMath(text) {
  if (/[\\^_{}]/.test(text)) return true
  if (/[+\-*/÷×=<>≤≥≠±∞∑∏∫√∂∇∈∉⊂⊃∪∩∧∨¬⇒⇔∀∃λμπσφθωαβγδεζηκρτωΣΩΔΘΛΨΦΞΓ]/.test(text)) return true
  if (/\\[A-Za-z]+/.test(text)) return true
  // 含数字上下标样式或常见 LaTeX 命令
  if (/\^\w|_\w|\bbmod\b|\bmod\b|\bfloor\b|\bceil\b|\binom|\\frac|\\sqrt|\\text|\\mathbf|\\mathrm|\\mathcal|\\mathbb|\\mathtt|\\mathsf|\\mathit/.test(text)) return true
  if (/[0-9]\s*[+\-*/=]\s*[0-9]/.test(text)) return true
  // 纯纯的自然语言（含变音/空格/长单词）→ 不算数学
  const asciiAlnum = (text.match(/[A-Za-z0-9]/g) || []).length
  const nonAsciiLetter = (text.match(/[^\x00-\x7F]/g) || []).length
  const whitespace = (text.match(/\s/g) || []).length
  if (nonAsciiLetter > 0 && /[A-Za-zÀ-ÿăâđêôơưĂÂĐÊÔƠƯàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/.test(text)) return false
  if (whitespace > 0 && asciiAlnum >= 6) return false
  return true
}

function wrapInlineMath(math) {
  const cleaned = normalizeLatexMath(math)
  if (!looksLikeMath(math)) {
    // 当作普通文本，转义后放入 \text{}（仍保留外层 $ 保持语义一致）
    // 也可以干脆不用 math mode，但为了最小影响仍保留 $...$。
    return `$\\textnormal{${escapeLatex(cleaned)}}$`
  }
  // 真数学：如果包含非 ASCII 字母，仍用 \text 把连续字母段包起来避免缺字
  const hasNonAscii = /[^$`\x00-\x7F\s]/.test(math)
  if (!hasNonAscii) return `$${cleaned}$`
  return `$\\textnormal{${escapeLatex(cleaned)}}$`
}

function renderHref(label, target) {
  const cleanLabel = normalizePdfSymbols(normalizeInlineHtml(label))
    .replace(/\s+/g, ' ')
    .trim()
  const isUrlLike =
    /^https?:\/\//i.test(cleanLabel) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanLabel) ||
    /^mailto:/i.test(target)

  if (isUrlLike) {
    const display = cleanLabel.replace(/^mailto:/i, '')
    return `\\href{${escapeLatexUrl(target)}}{\\nolinkurl{${escapeLatexUrl(
      display
    )}}}`
  }

  return `\\href{${escapeLatexUrl(target)}}{${renderInline(label)}}`
}

function wrapLtrSegments(value) {
  if (!isRtl) return value
  // 纯文本阶段留下的 ENGLISHSTART/ENGLISHEND 标记，在最终 LaTeX 中替换为真正的 \textenglish{}。
  return String(value).replace(
    /ENGLISHSTART([\s\S]*?)ENGLISHEND/g,
    (_, core) => (core && core.trim() ? `\\textenglish{${core}}` : core || '')
  )
}

// 拉丁字母数字 + 西欧/越南变音字母集合（Unicode 范围）。
// 用作"这段是 LTR 文字"的判定依据。
const LTR_LETTER_RE = /[A-Za-z0-9\u00C0-\u024FăâđêôơưĂÂĐÊÔƠƯàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/

// 允许出现在 LTR 段内部的"黏附"字符（标点、空白、括号、斜杠等）。
// 当扫描到这些字符时，如果当前在 LTR 段内，则不结束段；但段的开头和结尾必须仍是 LTR 字母。
function isLtrJoiner(ch) {
  return (
    ch === ' ' || ch === '\t' || ch === '\'' || ch === '_' || ch === '-' ||
    ch === '.' || ch === ',' || ch === ':' || ch === ';' || ch === '@' ||
    ch === '&' || ch === '+' || ch === '*' || ch === '=' || ch === '<' ||
    ch === '>' || ch === '!' || ch === '?' || ch === '~' || ch === '"' ||
    ch === '/' || ch === '(' || ch === ')' || ch === '[' || ch === ']' ||
    ch === '#' || ch === '%'
  )
}

function markLtrSegmentsInPlainText(value) {
  if (!isRtl) return value
  const str = String(value)
  const out = []
  let i = 0
  while (i < str.length) {
    const ch = str[i]
    // 跳过 token 占位符，避免破坏 protector 还原
    const tokenMatch = str.slice(i).match(/^(LATEXTOKEN\d+END|RAWLATEX\d+END)/)
    if (tokenMatch) {
      out.push(tokenMatch[0])
      i += tokenMatch[0].length
      continue
    }
    if (!LTR_LETTER_RE.test(ch)) {
      out.push(ch)
      i += 1
      continue
    }
    // 开始一段 LTR：往后读，直到遇到既不是 LTR 字母也不是 joiner 的字符
    // 同时最后必须仍以 LTR 字母结尾（否则尾部 joiner 不应该被吞进段）
    let j = i
    while (j < str.length) {
      const c = str[j]
      // 如果下一个字符是 token，也应当在 token 前停止
      const nextToken = str.slice(j).match(/^(LATEXTOKEN\d+END|RAWLATEX\d+END)/)
      if (nextToken) break
      if (LTR_LETTER_RE.test(c) || isLtrJoiner(c)) {
        j += 1
      } else {
        break
      }
    }
    // 截掉末尾纯 joiner
    let end = j
    while (end > i && isLtrJoiner(str[end - 1])) end -= 1
    const segment = str.slice(i, end)
    if (segment.trim()) {
      out.push('ENGLISHSTART', segment, 'ENGLISHEND')
    } else {
      out.push(segment)
    }
    i = end
  }
  return out.join('')
}

function renderInline(value) {
  const protector = protectLatexTokens()
  let source = normalizeInlineHtml(String(value || ''))

  source = source.replace(/RAWLATEX(\d+)END/g, (match, index) => {
    const raw = rawLatexTokens[Number(index)]
    return raw === undefined ? match : protector.token(raw)
  })

  source = source.replace(/`([^`]+)`/g, (match, code) =>
    protector.token(`\\texttt{${escapeLatex(code)}}`)
  )

  source = source.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (match, math) =>
    protector.token(wrapInlineMath(math))
  )

  source = source.replace(/!\[([^\]]*)\]\([^)]+\)/g, (match, alt) => alt || '')

  source = source.replace(
    /\[([^\]]+)\]\(((?:https?:\/\/|mailto:)(?:[^()\s]+|\([^)]*\))+)\)/g,
    (match, label, target) => protector.token(renderHref(label, target))
  )

  source = source.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  source = source.replace(/\*\*([^*]+)\*\*/g, (match, strong) =>
    protector.token(`\\textbf{${renderInline(strong)}}`)
  )

  source = source.replace(
    /(^|[^\w])_([^_\n]+)_($|[^\w])/g,
    (match, before, em, after) =>
      `${before}${protector.token(`\\emph{${renderInline(em)}}`)}${after}`
  )

  source = source.replace(/\*([^*\n]+)\*/g, (match, em) =>
    protector.token(`\\emph{${renderInline(em)}}`)
  )

  source = markLtrSegmentsInPlainText(source)
  return wrapLtrSegments(protector.restore(escapeLatex(source)))
}

function normalizeInlineHtml(value) {
  let s = String(value || '')
  // 先把所有 LaTeX 转义后的 \textless/\textgreater 回退一次到真正的 <>，
  // 否则 protector 把 <> 转义后 normalizeInlineHtml 里的 <[^>]+> 抓不到标签。
  s = s
    .replace(/\\textless\s*\{?\}?/gi, '<')
    .replace(/\\textgreater\s*\{?\}?/gi, '>')
  // 兜底的「字符级扫描」剥标签：即使跨多行 / > 被替换过，也能正确吃完整段。
  s = forceStripHtmlTags(s)
  return normalizePdfSymbols(
    s
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(
        /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
        '[$2]($1)'
      )
      .replace(/<\/?strong\b[^>]*>/gi, '**')
      .replace(/<\/?b\b[^>]*>/gi, '**')
      .replace(/<\/?em\b[^>]*>/gi, '*')
      .replace(/<\/?i\b[^>]*>/gi, '*')
      .replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, '`$1`')
      .replace(/<[^>]+>/g, '')
  )
}

// 字符级扫描的 HTML/XML 标签剥除：不依赖正则 `<[^>]+>`，能处理扫描期间已被
// 转义、或跨多行的标签（只要发现以 <[A-Za-z/!] 开头就吞到最近的 > 为止）。
function forceStripHtmlTags(value) {
  const src = String(value || '')
  let out = ''
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === '<' && /[A-Za-z/!?]/.test(src[i + 1] || '')) {
      // 开始一个标签：扫描直到最近的 >
      const end = src.indexOf('>', i)
      if (end === -1) {
        // 找不到闭合 >，保守把本行剩余部分视为「标签尾部」全跳过。
        const newline = src.indexOf('\n', i)
        i = newline === -1 ? src.length : newline
        continue
      }
      i = end + 1
      continue
    }
    out += c
    i += 1
  }
  return out
}

function renderParagraph(lines) {
  const text = lines
    .map((line) => normalizeInlineHtml(line.trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) return ''
  return `${renderInline(text)}\n`
}

function renderHeading(level, title) {
  const cleanTitle = stripTitleNumber(title.replace(/\s+\{#[^}]+\}\s*$/, ''))
  if (!cleanTitle) return ''

  if (level <= 1) return `\\section{${renderInline(cleanTitle)}}\n`
  if (level === 2) return `\\subsection{${renderInline(cleanTitle)}}\n`
  if (level === 3) return `\\subsubsection{${renderInline(cleanTitle)}}\n`
  return `\\paragraph{${renderInline(cleanTitle)}}\n`
}

function renderBlockquote(lines) {
  const body = lines
    .map((line) => line.replace(/^>\s?/, '').trim())
    .filter(Boolean)
    .map(renderInline)
    .join('\n\n')

  if (!body) return ''
  return `\\begin{quote}\n${body}\n\\end{quote}\n`
}

function renderContainerTitle(kind, rawTitle = '') {
  const title = stripMarkdown(normalizeInlineHtml(rawTitle)).trim()
  const normalizedKind = String(kind || '').toLowerCase()

  if (normalizedKind === 'code-group') return t.codeGroup
  if (title && !/^note$/i.test(title)) return title

  const fallbackTitles = {
    info: t.note,
    note: t.note,
    tip: t.tip,
    warning: t.warning,
    danger: t.danger,
    details: t.details
  }

  return fallbackTitles[normalizedKind] || title || normalizedKind || t.note
}

function renderList(lines, ordered) {
  const env = ordered ? 'enumerate' : 'itemize'
  const items = lines
    .map((line) =>
      line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '').replace(/\s+$/, '')
    )
    .filter(Boolean)
    .map((line) => `\\item ${renderInline(line)}`)
    .join('\n')

  if (!items) return ''
  return `\\begin{${env}}\n${items}\n\\end{${env}}\n`
}

function splitTableRow(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  const cells = []
  let cell = ''
  let inMath = false
  let inCode = false

  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index]
    const previous = trimmed[index - 1]

    if (char === '`' && previous !== '\\') inCode = !inCode
    if (char === '$' && previous !== '\\' && !inCode) inMath = !inMath

    if (char === '|' && !inMath && !inCode) {
      cells.push(cell.trim())
      cell = ''
      continue
    }

    cell += char
  }

  cells.push(cell.trim())
  return cells
}

function isTableDivider(line) {
  return /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line)
}

function renderTable(lines) {
  if (lines.length < 2 || !isTableDivider(lines[1])) return ''

  const rows = [splitTableRow(lines[0]), ...lines.slice(2).map(splitTableRow)]
  const columnCount = Math.max(...rows.map((row) => row.length))
  const columns = `|${Array.from({ length: columnCount }, () => 'X').join('|')}|`
  const body = rows
    .map((row, index) => {
      const cells = Array.from({ length: columnCount }, (_, cellIndex) =>
        renderInline(row[cellIndex] || '')
      )
      const suffix = index === 0 ? ' \\\\ \\hline\\hline' : ' \\\\ \\hline'
      return `${cells.join(' & ')}${suffix}`
    })
    .join('\n')

  return [
    '\\begin{center}',
    '\\scriptsize',
    '\\renewcommand{\\arraystretch}{1.16}',
    `\\begin{tabularx}{\\linewidth}{${columns}}`,
    '\\hline',
    body,
    '\\end{tabularx}',
    '\\end{center}'
  ].join('\n')
}

let assetCount = 0

function renderBookAsset(mode, inputPath, outputPath) {
  if (!fs.existsSync(renderBookAssetScriptPath)) return false

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    fs.rmSync(outputPath, { force: true })
    if (
      runTool(process.execPath, [
        renderBookAssetScriptPath,
        mode,
        inputPath,
        outputPath
      ]) &&
      hasUsableFile(outputPath)
    ) {
      return true
    }
  }

  return false
}

function renderMermaidBlock(lines) {
  assetCount += 1
  const assetStem = `asset-${String(assetCount).padStart(4, '0')}`
  const diagramPath = path.join(assetDir, `${assetStem}.mmd`)
  const targetPath = path.join(assetDir, `${assetStem}.png`)
  fs.writeFileSync(diagramPath, lines.join('\n'))

  if (renderBookAsset('mermaid', diagramPath, targetPath)) {
    const relative = toPosix(path.relative(workDir, targetPath))
    return [
      '\\begin{figure}[H]',
      '\\centering',
      `\\includegraphics[width=${pdfDiagramImageWidth},height=${pdfDiagramImageMaxHeight},keepaspectratio]{${relative}}`,
      '\\end{figure}\n'
    ].join('\n')
  }

  warnOnce('Unable to render a Mermaid diagram; kept a static note in the PDF.')
  return [
    `\\begin{BookNote}{${t.fig}}`,
    t.note,
    '\\end{BookNote}\n'
  ].join('\n')
}

function renderCodeBlock(language, lines) {
  if (language === 'mermaid') {
    return renderMermaidBlock(lines)
  }

  const code = lines
    .join('\n')
    .replace(/\\end\{Verbatim\}/g, '\\end {Verbatim}')
    .split('\n')
    .map((line) => normalizePdfSymbols(line))
    .join('\n')
  return [
    '\\begin{Verbatim}[fontsize=\\scriptsize,frame=single,framesep=1.4mm,rulecolor=BookRule,fillcolor=BookSoft]',
    code,
    '\\end{Verbatim}\n'
  ].join('\n')
}

function resolveMarkdownAsset(sourceFile, target) {
  if (!target || /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(target)) return null
  if (target.startsWith('data:')) return null

  const { clean } = splitSuffix(target)
  if (!clean) return null

  if (clean.startsWith('/')) {
    const publicCandidate = path.join(docsDir, 'public', clean.slice(1))
    if (fs.existsSync(publicCandidate)) return publicCandidate

    const docsCandidate = path.join(docsDir, clean.slice(1))
    if (fs.existsSync(docsCandidate)) return docsCandidate
    return null
  }

  const relativeCandidate = path.resolve(path.dirname(sourceFile), clean)
  if (fs.existsSync(relativeCandidate)) return relativeCandidate
  return null
}

const copiedAssets = new Map()

function hasUsableFile(filePath) {
  try {
    return fs.statSync(filePath).size > 0
  } catch {
    return false
  }
}

function detectRasterFormat(filePath) {
  let header
  try {
    header = fs.readFileSync(filePath, { length: 16 })
  } catch {
    return null
  }

  if (
    header
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'png'
  }
  if (header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return 'jpeg'
  }
  if (header.subarray(0, 4).toString('ascii') === '%PDF') {
    return 'pdf'
  }
  if (
    header.subarray(0, 4).toString('ascii') === 'RIFF' &&
    header.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp'
  }
  if (header.subarray(0, 3).toString('ascii') === 'GIF') {
    return 'gif'
  }
  if (header.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = header.subarray(8, 12).toString('ascii')
    if (brand === 'avif' || brand === 'avis') return 'avif'
  }

  return null
}

function convertAnimatedOrWebAsset(sourcePath, targetPath) {
  return (
    runTool('magick', [`${sourcePath}[0]`, targetPath]) ||
    runTool('convert', [`${sourcePath}[0]`, targetPath]) ||
    runTool('ffmpeg', ['-y', '-i', sourcePath, '-frames:v', '1', targetPath]) ||
    runTool('sips', ['-s', 'format', 'png', sourcePath, '--out', targetPath])
  )
}

// 将 PNG/JPG 等栅格图降采样到最大边不超过 maxDim 像素，减少最终 PDF 体积。
// 小图保持原样，避免不必要的重编码导致画质损失。
function downscaleRaster(sourcePath, targetPath) {
  const sourceMax = readNumberArg('--image-max-dim', 1600)
  const widthMatch = runToolCapture('sips', [
    '-g',
    'pixelWidth',
    sourcePath
  ])?.match(/pixelWidth:\s*(\d+)/i)
  const heightMatch = runToolCapture('sips', [
    '-g',
    'pixelHeight',
    sourcePath
  ])?.match(/pixelHeight:\s*(\d+)/i)
  const maxDim = Math.max(
    Number(widthMatch?.[1] || 0),
    Number(heightMatch?.[1] || 0)
  )

  if (maxDim <= sourceMax || maxDim === 0) {
    fs.copyFileSync(sourcePath, targetPath)
    return true
  }

  return runTool('sips', [
    '-Z',
    String(sourceMax),
    sourcePath,
    '--out',
    targetPath
  ])
}

// 将较大的 PNG 转为 JPEG（质量 ~82），大幅缩小最终 PDF 体积。
// 小图保留 PNG，避免不必要的画质损失。带透明通道的 PNG 保持原格式。
// 返回实际使用的文件路径。
function maybeJpegCompress(pngPath) {
  const threshold = readNumberArg('--jpeg-threshold-kb', 300)
  const stat = fs.existsSync(pngPath) ? fs.statSync(pngPath) : null
  if (!stat || stat.size < threshold * 1024) return pngPath

  // 带透明通道的 PNG 不能转 JPEG（会丢失透明度，透明区域变黑/白）
  const alphaInfo = runToolCapture('sips', ['-g', 'hasAlpha', pngPath])
  if (/hasAlpha:\s*yes/i.test(alphaInfo || '')) return pngPath

  const jpegPath = pngPath.replace(/\.png$/i, '.jpg')
  const quality = readArg('--jpeg-quality', '82')
  if (
    runTool('magick', [
      pngPath,
      '-quality',
      quality,
      jpegPath
    ]) ||
    runTool('convert', [pngPath, '-quality', quality, jpegPath]) ||
    runTool('sips', [
      '-s',
      'format',
      'jpeg',
      '-s',
      'formatOptions',
      quality,
      pngPath,
      '--out',
      jpegPath
    ])
  ) {
    if (hasUsableFile(jpegPath)) {
      fs.rmSync(pngPath, { force: true })
      return jpegPath
    }
  }

  return pngPath
}

function convertSvgAsset(sourcePath, pdfTargetPath, pngTargetPath) {
  if (renderBookAsset('svg', sourcePath, pngTargetPath)) {
    return pngTargetPath
  }

  if (
    runTool('rsvg-convert', ['-f', 'pdf', '-o', pdfTargetPath, sourcePath]) ||
    runTool('inkscape', [
      sourcePath,
      '--export-type=pdf',
      `--export-filename=${pdfTargetPath}`
    ])
  ) {
    return pdfTargetPath
  }

  if (
    runTool('rsvg-convert', ['-f', 'png', '-o', pngTargetPath, sourcePath]) ||
    runTool('magick', [sourcePath, pngTargetPath]) ||
    runTool('convert', [sourcePath, pngTargetPath]) ||
    runTool('sips', ['-s', 'format', 'png', sourcePath, '--out', pngTargetPath])
  ) {
    return pngTargetPath
  }

  return null
}

function copyAsset(sourcePath) {
  const ext = path.extname(sourcePath).toLowerCase()

  if (copiedAssets.has(sourcePath)) return copiedAssets.get(sourcePath)

  assetCount += 1
  const assetStem = `asset-${String(assetCount).padStart(4, '0')}`
  let targetPath = null

  const rasterFormat = detectRasterFormat(sourcePath)

  if (['webp', 'gif', 'avif'].includes(rasterFormat)) {
    targetPath = path.join(assetDir, `${assetStem}.png`)
    if (!convertAnimatedOrWebAsset(sourcePath, targetPath)) {
      warnOnce(
        `Unable to convert image to PNG; keeping a placeholder in the body: ${path.relative(
          rootDir,
          sourcePath
        )}`
      )
      return null
    }
  } else if (['.png', '.jpg', '.jpeg', '.pdf'].includes(ext)) {
    targetPath = path.join(assetDir, `${assetStem}${ext}`)
    if (ext === '.pdf') {
      fs.copyFileSync(sourcePath, targetPath)
    } else {
      downscaleRaster(sourcePath, targetPath)
    }
  } else if (['.gif', '.webp', '.avif'].includes(ext)) {
    targetPath = path.join(assetDir, `${assetStem}.png`)
    if (!convertAnimatedOrWebAsset(sourcePath, targetPath)) {
      warnOnce(
        `Unable to convert image to PNG; keeping a placeholder in the body: ${path.relative(
          rootDir,
          sourcePath
        )}`
      )
      return null
    }
  } else if (ext === '.svg') {
    targetPath = convertSvgAsset(
      sourcePath,
      path.join(assetDir, `${assetStem}.pdf`),
      path.join(assetDir, `${assetStem}.png`)
    )

    if (!targetPath) {
      warnOnce(
        `Unable to convert SVG to PDF/PNG; keeping a placeholder in the body: ${path.relative(
          rootDir,
          sourcePath
        )}`
      )
      return null
    }
  } else {
    warnOnce(
      `Unsupported image format; keeping a placeholder in the body: ${path.relative(
        rootDir,
        sourcePath
      )}`
    )
    return null
  }

  if (!hasUsableFile(targetPath)) {
    warnOnce(
      `Image processing result is empty; keeping a placeholder in the body: ${path.relative(
        rootDir,
        sourcePath
      )}`
    )
    return null
  }

  if (targetPath.toLowerCase().endsWith('.png')) {
    targetPath = maybeJpegCompress(targetPath)
  }

  const relative = toPosix(path.relative(workDir, targetPath))
  copiedAssets.set(sourcePath, relative)
  return relative
}

// --- Markdown 渲染到 LaTeX ---

function collectFootnotes(markdown) {
  const lines = markdown.split('\n')
  const output = []
  const footnotes = new Map()

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const match = line.match(/^\[\^([^\]]+)\]:\s*(.*)$/)
    if (!match) {
      output.push(line)
      continue
    }

    const noteLines = [match[2]]
    while (index + 1 < lines.length && /^(?: {2,}|\t)/.test(lines[index + 1])) {
      noteLines.push(lines[index + 1].trim())
      index += 1
    }
    footnotes.set(match[1], noteLines.join(' ').trim())
  }

  return {
    markdown: output.join('\n'),
    footnotes
  }
}

function renderMarkdown(markdown, sourceFile) {
  const prepared = transformVueComponents(
    stripScriptSetup(stripFrontmatter(markdown)),
    locale
  )
  const { markdown: withoutFootnoteDefinitions, footnotes } = collectFootnotes(
    prepared.replace(/<!--[\s\S]*?-->/g, '').replace(/\r\n/g, '\n')
  )
  const lines = withoutFootnoteDefinitions.split('\n')
  const output = []
  let index = 0
  let skippedFirstHeading = false
  let bookNoteDepth = 0

  function footnoteLatex(id) {
    const note = footnotes.get(id)
    return note ? `\\footnote{${renderInline(note)}}` : ''
  }

  function withFootnotes(line) {
    return line.replace(/\[\^([^\]]+)\]/g, (match, id) => {
      const note = footnoteLatex(id)
      return note ? rawLatex(note) : ''
    })
  }

  function extractHeadingFootnotes(line) {
    const notes = []
    const title = line
      .replace(/\[\^([^\]]+)\]/g, (match, id) => {
        const note = footnoteLatex(id)
        if (note) notes.push(note)
        return ''
      })
      .replace(/\s+/g, ' ')
      .trim()

    return { title, notes }
  }

  function isBlockStart(line) {
    return (
      /^#{1,6}\s+/.test(line) ||
      isHorizontalRule(line) ||
      /^>\s?/.test(line) ||
      /^\s*(?:[-*+]|\d+[.)])\s+/.test(line) ||
      /^(`{3,}|~{3,})/.test(line) ||
      /^\s*:::\s*/.test(line) ||
      /^!\[[^\]]*\]\([^)]+\)/.test(line) ||
      /^\s*\|.*\|\s*$/.test(line) ||
      /^\s*<\/?div\b/i.test(line) ||
      /^\s*<\/?p\b/i.test(line) ||
      /^\s*<\/?[A-Z][A-Za-z0-9_:-]*/.test(line) ||
      /^\s*\$\$\s*$/.test(line)
    )
  }

  while (index < lines.length) {
    const rawLine = lines[index]
    const line = rawLine.trimEnd()

    if (!line.trim()) {
      index += 1
      continue
    }

    if (isHorizontalRule(line)) {
      index += 1
      continue
    }

    const fence = line.match(/^(`{3,}|~{3,})\s*([A-Za-z0-9_-]*)/)
    if (fence) {
      const marker = fence[1][0]
      const fenceLength = fence[1].length
      const language = (fence[2] || '').toLowerCase()
      const codeLines = []
      index += 1

      while (index < lines.length) {
        const close = lines[index].match(/^(`{3,}|~{3,})/)
        if (close && close[1][0] === marker && close[1].length >= fenceLength) {
          index += 1
          break
        }
        codeLines.push(lines[index])
        index += 1
      }

      output.push(renderCodeBlock(language, codeLines))
      continue
    }

    const oneLineDisplayMath = line.match(/^\s*\$\$(.+)\$\$\s*$/)
    if (oneLineDisplayMath) {
      output.push(`\\[\n${normalizeLatexMath(oneLineDisplayMath[1])}\n\\]\n`)
      index += 1
      continue
    }

    if (/^\s*\$\$\s*$/.test(line)) {
      const mathLines = []
      let cursor = index + 1
      let foundClose = false
      let invalidBlock = false

      while (cursor < lines.length) {
        if (/^\s*\$\$\s*$/.test(lines[cursor])) {
          foundClose = true
          break
        }

        if (isDisplayMathBoundary(lines[cursor])) {
          invalidBlock = true
          break
        }

        mathLines.push(lines[cursor])
        cursor += 1
      }

      if (!foundClose || invalidBlock) {
        warnOnce(
          `Skipped possibly unclosed display math fence: ${path.relative(
            rootDir,
            sourceFile
          )}`
        )
        index += 1
        continue
      }

      index = cursor + 1
      const mathBody = mathLines.join('\n').trim()
      if (!mathBody) {
        continue
      }

      output.push(`\\[\n${normalizeLatexMath(mathBody)}\n\\]\n`)
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      const level = heading[1].length
      if (level === 1 && !skippedFirstHeading) {
        skippedFirstHeading = true
        index += 1
        continue
      }

      const { title, notes } = extractHeadingFootnotes(heading[2])

      if (
        /^(?:参考文献|参考资料|延伸阅读与参考资料|References|Further Reading|さらに読む|참고 자료|Referencias|Références|Literatur|المراجع|Tài liệu tham khảo)$/.test(
          stripMarkdown(title).trim()
        )
      ) {
        index += 1
        continue
      }

      output.push(renderHeading(level, title))
      if (notes.length) output.push(`\\mbox{}${notes.join('')}\n`)
      index += 1
      continue
    }

    const image = parseMarkdownImageLine(line)
    if (image) {
      output.push(renderImage(sourceFile, image.alt, image.target))
      index += 1
      continue
    }

    const htmlImage = parseHtmlImageLine(line)
    if (htmlImage) {
      output.push(renderImage(sourceFile, htmlImage.alt, htmlImage.target))
      index += 1
      continue
    }

    if (isNavigationTailLine(line)) {
      index += 1
      continue
    }

    if (/^>\s?/.test(line)) {
      const quoteLines = []
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        quoteLines.push(withFootnotes(lines[index]))
        index += 1
      }
      output.push(renderBlockquote(quoteLines))
      continue
    }

    if (/^\s*(?:[-*+])\s+/.test(line)) {
      const listLines = []
      while (index < lines.length && /^\s*(?:[-*+])\s+/.test(lines[index])) {
        listLines.push(withFootnotes(lines[index]))
        index += 1
      }
      output.push(renderList(listLines, false))
      continue
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const listLines = []
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
        listLines.push(withFootnotes(lines[index]))
        index += 1
      }
      output.push(renderList(listLines, true))
      continue
    }

    if (/^\s*\|.*\|\s*$/.test(line) && index + 1 < lines.length) {
      const tableLines = []
      while (index < lines.length && /^\s*\|.*\|\s*$/.test(lines[index])) {
        tableLines.push(withFootnotes(lines[index]))
        index += 1
      }
      const table = renderTable(tableLines)
      if (table) {
        output.push(`${table}\n`)
        continue
      }

      output.push(
        renderParagraph(tableLines.map((tableLine) => tableLine.trim()))
      )
      continue
    }

    if (/^\s*:::\s*/.test(line)) {
      const match = line.match(/^\s*:::\s*([A-Za-z][A-Za-z0-9_-]*)?\s*(.*)$/)
      if (match?.[1]) {
        const title = renderContainerTitle(match[1], match[2])
        output.push(`\\begin{BookNote}{${renderInline(title)}}\n`)
        bookNoteDepth += 1
      } else {
        if (bookNoteDepth > 0) {
          output.push('\\end{BookNote}\n')
          bookNoteDepth -= 1
        } else {
          warnOnce(
            `Skipped stray ":::" close without an open container in ${path.relative(
              rootDir,
              sourceFile
            )}`
          )
        }
      }
      index += 1
      continue
    }

    if (/^\s*<\/?div\b/i.test(line)) {
      index += 1
      continue
    }

    if (/^\s*<\/?p\b/i.test(line)) {
      const paragraph = normalizeInlineHtml(line).trim()
      if (paragraph)
        output.push(
          `\\begin{center}\\footnotesize ${renderInline(paragraph)}\\end{center}\n`
        )
      index += 1
      continue
    }

    const comp = consumeMultilineComponent(lines, index)
    if (comp) {
      if (comp.isOpenTag) output.push(renderCustomComponent(comp.name))
      index = comp.nextIndex
      continue
    }

    // 顶层 JS import / const / export 等零散语句 (script setup 漏出的)：跳过不渲染
    if (looksLikeTopLevelJs(line)) {
      index += 1
      continue
    }

    const paragraphLines = []
    while (index < lines.length) {
      const paragraphLine = lines[index]
      if (!paragraphLine.trim()) break
      // 跳过段内嵌套的独立 JS 行，防止 const xxx = ... / import / export 漏进段落
      if (looksLikeTopLevelJs(paragraphLine)) {
        index += 1
        continue
      }
      if (paragraphLines.length > 0 && isBlockStart(paragraphLine.trimEnd())) {
        break
      }
      paragraphLines.push(withFootnotes(paragraphLine))
      index += 1
    }

    if (paragraphLines.length) {
      output.push(renderParagraph(paragraphLines))
    }
  }

  if (bookNoteDepth > 0) {
    output.push('\n'.repeat(bookNoteDepth).replace(/\n/g, '\\end{BookNote}\n'))
    warnOnce(
      `Auto-closed ${bookNoteDepth} unclosed ":::" container(s) in ${path.relative(
        rootDir,
        sourceFile
      )}`
    )
  }

  return output.join('\n')
}

function isHorizontalRule(line) {
  return /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)
}

function isDisplayMathBoundary(line) {
  return isHorizontalRule(line) || /^#{1,6}\s+/.test(line)
}

// 顶层独立的 import / const / export / type / JS 对象赋值等语句 — 一般是 <script setup>
// 块漏出来的行，直接跳过不渲染。
function looksLikeTopLevelJs(line) {
  const s = line.trim()
  if (!s) return false
  if (
    /^(import\s|export\s|const\s+|let\s+|var\s+|type\s+|interface\s+|async\s+function\s|function\s)/.test(
      s
    )
  )
    return true
  if (/^[\w$]+\s*=\s*[^=]/u.test(s) && /[;{[]$/.test(s)) return true
  if (/^[<{[].*[>}\]];?$/.test(s) && !/^<(img|picture|video|audio|figure)\b/i.test(s)) return true
  if (/^<\/[a-z]/i.test(s)) return false // 闭合 HTML 标签不算 JS
  return false
}

// 读跨多行的 PascalCase Vue 组件标签：
//   <Foo prop="a" :items="[ {...}, {...} ]" />       // 自闭合，可能跨 N 行
//   <Foo ...> ... </Foo>                              // 开闭合（包含 slot 子块）
// 返回 { name, nextIndex, isOpenTag }；若当前行不是组件开头则返回 null。
function consumeMultilineComponent(lines, startIndex) {
  const firstLine = lines[startIndex] || ''
  const openMatch = firstLine.match(/^\s*<([A-Z][A-Za-z0-9_:-]*)\b/)
  const closeMatch = firstLine.match(/^\s*<\/([A-Z][A-Za-z0-9_:-]*)\s*>/)
  if (!openMatch && !closeMatch) return null

  // 纯闭合标签 </Foo>：直接跳过一行。
  if (closeMatch && !openMatch) {
    return { name: closeMatch[1], nextIndex: startIndex + 1, isOpenTag: false }
  }

  const name = openMatch[1]
  // 从 startIndex 开始逐字扫描：跟踪 <tag> / </tag> 嵌套，直到最外层开标签结束。
  let i = startIndex
  let col = 0
  let depth = 0
  let started = false
  let selfClosePending = false
  let quoteChar = null

  while (i < lines.length) {
    const line = lines[i]
    while (col < line.length) {
      const c = line[col]
      const prev = line[col - 1]

      if (quoteChar) {
        if (c === quoteChar && prev !== '\\') quoteChar = null
        col += 1
        continue
      }

      if (c === '"' || c === "'" || c === '`') {
        quoteChar = c
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

      if (c === '<' && line[col + 1] === '/') {
        depth -= 1
        if (depth === 0) {
          // 跳过 "</Foo>" 剩余字符
          col = line.indexOf('>', col) + 1 || line.length
          if (depth === 0) {
            return { name, nextIndex: col >= line.length ? i + 1 : i + 1, isOpenTag: true }
          }
          continue
        }
        col += 2
        continue
      }

      if (c === '<') {
        const innerNameMatch = line.slice(col + 1).match(/^([A-Za-z][A-Za-z0-9_:-]*)\b/)
        if (innerNameMatch) {
          depth += 1
          col += 1 + innerNameMatch[0].length
          continue
        }
        col += 1
        continue
      }

      if (c === '>' && prev === '/') {
        depth -= 1
        col += 1
        if (depth === 0) {
          return { name, nextIndex: col >= line.length ? i + 1 : i + 1, isOpenTag: true }
        }
        selfClosePending = false
        continue
      }

      if (c === '/') {
        selfClosePending = true
        col += 1
        continue
      } else {
        selfClosePending = false
      }

      if (c === '>') {
        depth -= 1
        col += 1
        if (depth === 0) {
          // 非自闭合：外层开标签结束但还有正文内容（slot 子块），继续扫描直到匹配 </Name>。
          // 已在读外层开标签的情况下，开标签结束后 depth 应该还是 1（开标签 <Foo ...> 配对 1 层）。
          // 如果这里 depth 已经 == 0，直接返回。
          return { name, nextIndex: col >= line.length ? i + 1 : i + 1, isOpenTag: true }
        }
        continue
      }

      col += 1
    }
    i += 1
    col = 0
  }

  // 没找到闭合：保守吞到文件末，避免漏到正文。
  return { name, nextIndex: lines.length, isOpenTag: true }
}

function renderCustomComponent(name) {
  const display = String(name || t.component).trim() || t.component
  return [
    `\\begin{BookNote}{${t.note}}`,
    `The original page contains an interactive ${renderInline(display)} component here. The book PDF keeps a static note; use the online version or repository source for interactive demos.`,
    '\\end{BookNote}\n'
  ].join('\n')
}

function parseMarkdownImageLine(line) {
  const match = line.match(/^!\[([^\]]*)\]\(/)
  if (!match) return null

  const targetStart = match[0].length
  let depth = 0
  let targetEnd = -1

  for (let index = targetStart; index < line.length; index += 1) {
    const char = line[index]
    const previous = line[index - 1]

    if (char === '(' && previous !== '\\') {
      depth += 1
      continue
    }

    if (char === ')' && previous !== '\\') {
      if (depth === 0) {
        targetEnd = index
        break
      }
      depth -= 1
    }
  }

  if (targetEnd === -1) return null

  const rawTarget = line.slice(targetStart, targetEnd).trim()
  const target = rawTarget.replace(/\s+["'][^"']*["']$/, '')

  return {
    alt: match[1],
    target
  }
}

function parseHtmlImageLine(line) {
  const srcMatch = line.match(/<img\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>/i)
  if (!srcMatch) return null

  const altMatch = line.match(/<img\b[^>]*\balt=(["'])([^"']*)\1[^>]*>/i)
  return {
    alt: altMatch?.[2] || t.fig,
    target: srcMatch[2]
  }
}

function isNavigationTailLine(line) {
  const text = stripMarkdown(normalizeInlineHtml(line))
    .replace(/\s+/g, ' ')
    .trim()

  if (!text) return false
  if (/^←\s*上一节/.test(text) && /下一节/.test(text)) return true
  if (/^上一节[:：]/.test(text) && /下一节[:：]/.test(text)) return true
  if (/^下一节[:：]/.test(text) && /\[[^\]]+\]\(/.test(line)) return true
  return false
}

function renderImage(sourceFile, alt, target) {
  const resolved = resolveMarkdownAsset(sourceFile, target)
  const label = alt ? renderInline(alt) : t.fig

  if (!resolved) {
    return [
      `\\begin{BookNote}{${t.note}}`,
      `${label}. External or unsupported image resource: \\url{${escapeLatexUrl(target)}}`,
      '\\end{BookNote}\n'
    ].join('\n')
  }

  const copied = copyAsset(resolved)
  if (!copied) {
    return [
      `\\begin{BookNote}{${t.note}}`,
      `${label}. This image format cannot be embedded directly yet: \\texttt{${escapeLatex(path.basename(resolved))}}`,
      '\\end{BookNote}\n'
    ].join('\n')
  }

  return [
    '\\begin{figure}[H]',
    '\\centering',
    `\\includegraphics[width=${pdfImageWidth},height=${pdfImageMaxHeight},keepaspectratio]{${copied}}`,
    `\\caption*{\\footnotesize ${label}}`,
    '\\end{figure}\n'
  ].join('\n')
}

// --- 书籍结构 ---

function renderChapterIntro(chapter, chapterNumber) {
  const pageList = chapter.pages
    .map((page) => `\\item ${renderInline(stripTitleNumber(page.title))}`)
    .join('\n')

  const label = `${t.chapter} ${chapterNumber}${t.chapterSuffix}`
  return [
    `\\BookChapter{${renderInline(chapter.title)}}{${renderInline(label)}}{`,
    t.chapterGuide,
    '}{',
    pageList,
    '}\n'
  ].join('\n')
}

function renderPage(page, chapter) {
  const title = stripTitleNumber(page.title)
  const lines = []

  if (!page.filePath || !fs.existsSync(page.filePath)) {
    lines.push(`\\section{${renderInline(title)}}`)
    lines.push(`\\begin{BookNote}{${t.note}}`)
    lines.push(
      `The sidebar contains this page, but no matching Markdown file was found locally: \\texttt{${escapeLatex(
        page.filePath ? path.relative(rootDir, page.filePath) : page.link
      )}}`
    )
    lines.push('\\end{BookNote}\n')
    return lines.join('\n')
  }

  const markdown = fs.readFileSync(page.filePath, 'utf8')
  const sectionCommand = chapter ? '\\section' : '\\chapter*'

  if (chapter) {
    lines.push(`${sectionCommand}{${renderInline(title)}}`)
  } else {
    lines.push('\\begingroup')
    lines.push('\\setcounter{secnumdepth}{0}')
    lines.push('\\cleardoublepage')
    lines.push(
      `\\phantomsection\\addcontentsline{toc}{chapter}{${renderInline(title)}}`
    )
    lines.push(`${sectionCommand}{${renderInline(title)}}`)
  }

  lines.push(renderMarkdown(markdown, page.filePath))
  if (!chapter) {
    lines.push('\\setcounter{secnumdepth}{2}')
    lines.push('\\endgroup')
  }
  return lines.join('\n')
}

function renderBookContent(chunks) {
  const output = []
  let chapterNumber = 0

  for (const chunk of chunks) {
    if (chunk.type === 'part') {
      output.push(`\\BookPart{${renderInline(chunk.title)}}\n`)
      continue
    }

    if (chunk.type === 'chapter') {
      chapterNumber += 1
      output.push(renderChapterIntro(chunk, chapterNumber))
      for (const page of chunk.pages) {
        output.push(renderPage(page, chunk))
      }
    }
  }

  return output.join('\n')
}

function localeFontPreamble(locale) {
  // 健壮 fallback 链：先优先 locale 专属衬线字体；
  // 退到 Noto Serif/Sans CJK（含不同地区子字体名、TTC 集合名、TTC 集合通用名）；
  // 再退到常见免费字体（WenQuanYi / Nanum / Hiragino / Songti / PingFang）；
  // 最后用 macOS 自带的 Times/Helvetica/Courier 或 Linux 自带的 DejaVu/Liberation 兜底。
  // 注意：Latin Modern 仅 TeX Live 自带，fontconfig 找不到，故不做最终 fallback。
  const mainFonts =
    locale === 'ar-sa'
      ? String.raw`\IfFontExistsTF{Noto Naskh Arabic}{\setmainfont{Noto Naskh Arabic}}{%
  \IfFontExistsTF{Noto Naskh Arabic UI}{\setmainfont{Noto Naskh Arabic UI}}{%
    \IfFontExistsTF{Amiri}{\setmainfont{Amiri}}{%
      \IfFontExistsTF{Scheherazade New}{\setmainfont{Scheherazade New}}{%
        \IfFontExistsTF{Geeza Pro}{\setmainfont{Geeza Pro}}{%
          \IfFontExistsTF{Damascus}{\setmainfont{Damascus}}{%
            \IfFontExistsTF{Noto Serif}{\setmainfont{Noto Serif}}{%
              \IfFontExistsTF{DejaVu Serif}{\setmainfont{DejaVu Serif}}{%
                \IfFontExistsTF{Liberation Serif}{\setmainfont{Liberation Serif}}{\setmainfont{Times}}%
              }%
            }%
          }%
        }%
      }%
    }%
  }%
}`
      : locale === 'ko-kr'
        ? String.raw`\IfFontExistsTF{Noto Serif CJK KR}{\setmainfont{Noto Serif CJK KR}}{%
  \IfFontExistsTF{Noto Serif CJK}{\setmainfont{Noto Serif CJK}}{%
    \IfFontExistsTF{Noto Sans CJK KR}{\setmainfont{Noto Sans CJK KR}}{%
      \IfFontExistsTF{Noto Sans CJK}{\setmainfont{Noto Sans CJK}}{%
        \IfFontExistsTF{NanumMyeongjo}{\setmainfont{NanumMyeongjo}}{%
          \IfFontExistsTF{Nanum Gothic}{\setmainfont{Nanum Gothic}}{%
            \IfFontExistsTF{Apple SD Gothic Neo}{\setmainfont{Apple SD Gothic Neo}}{%
              \IfFontExistsTF{Noto Sans KR}{\setmainfont{Noto Sans KR}}{%
                \IfFontExistsTF{Noto Serif KR}{\setmainfont{Noto Serif KR}}{%
                  \IfFontExistsTF{WenQuanYi Zen Hei}{\setmainfont{WenQuanYi Zen Hei}}{%
                    \IfFontExistsTF{DejaVu Sans}{\setmainfont{DejaVu Sans}}{\setmainfont{Helvetica}}%
                  }%
                }%
              }%
            }%
          }%
        }%
      }%
    }%
  }%
}`
        : locale === 'vi-vn'
          ? String.raw`\IfFontExistsTF{Noto Serif}{\setmainfont{Noto Serif}}{%
  \IfFontExistsTF{DejaVu Serif}{\setmainfont{DejaVu Serif}}{%
    \IfFontExistsTF{Liberation Serif}{\setmainfont{Liberation Serif}}{%
      \IfFontExistsTF{Times New Roman}{\setmainfont{Times New Roman}}{%
        \IfFontExistsTF{Libertinus Serif}{\setmainfont{Libertinus Serif}}{\setmainfont{Times}}%
      }%
    }%
  }%
}`
          : locale === 'ja-jp'
            ? String.raw`\IfFontExistsTF{Noto Serif CJK JP}{\setmainfont{Noto Serif CJK JP}}{%
  \IfFontExistsTF{Noto Serif CJK}{\setmainfont{Noto Serif CJK}}{%
    \IfFontExistsTF{Noto Sans CJK JP}{\setmainfont{Noto Sans CJK JP}}{%
      \IfFontExistsTF{Noto Sans CJK}{\setmainfont{Noto Sans CJK}}{%
        \IfFontExistsTF{Hiragino Mincho ProN}{\setmainfont{Hiragino Mincho ProN}}{%
          \IfFontExistsTF{Yu Mincho}{\setmainfont{Yu Mincho}}{%
            \IfFontExistsTF{Noto Serif JP}{\setmainfont{Noto Serif JP}}{%
              \IfFontExistsTF{Noto Sans JP}{\setmainfont{Noto Sans JP}}{%
                \IfFontExistsTF{WenQuanYi Zen Hei}{\setmainfont{WenQuanYi Zen Hei}}{%
                  \IfFontExistsTF{DejaVu Sans}{\setmainfont{DejaVu Sans}}{\setmainfont{Helvetica}}%
                }%
              }%
            }%
          }%
        }%
      }%
    }%
  }%
}`
            : locale === 'zh-tw'
              ? String.raw`\IfFontExistsTF{Noto Serif CJK TC}{\setmainfont{Noto Serif CJK TC}}{%
  \IfFontExistsTF{Noto Serif CJK}{\setmainfont{Noto Serif CJK}}{%
    \IfFontExistsTF{Noto Sans CJK TC}{\setmainfont{Noto Sans CJK TC}}{%
      \IfFontExistsTF{Noto Sans CJK}{\setmainfont{Noto Sans CJK}}{%
        \IfFontExistsTF{Songti TC}{\setmainfont{Songti TC}}{%
          \IfFontExistsTF{PingFang TC}{\setmainfont{PingFang TC}}{%
            \IfFontExistsTF{Noto Serif TC}{\setmainfont{Noto Serif TC}}{%
              \IfFontExistsTF{WenQuanYi Zen Hei}{\setmainfont{WenQuanYi Zen Hei}}{%
                \IfFontExistsTF{WenQuanYi Micro Hei}{\setmainfont{WenQuanYi Micro Hei}}{%
                  \IfFontExistsTF{DejaVu Sans}{\setmainfont{DejaVu Sans}}{\setmainfont{Helvetica}}%
                }%
              }%
            }%
          }%
        }%
      }%
    }%
  }%
}`
              : locale === 'zh-cn'
                ? String.raw`\IfFontExistsTF{Noto Serif CJK SC}{\setmainfont{Noto Serif CJK SC}}{%
  \IfFontExistsTF{Noto Serif CJK}{\setmainfont{Noto Serif CJK}}{%
    \IfFontExistsTF{Noto Sans CJK SC}{\setmainfont{Noto Sans CJK SC}}{%
      \IfFontExistsTF{Noto Sans CJK}{\setmainfont{Noto Sans CJK}}{%
        \IfFontExistsTF{Songti SC}{\setmainfont{Songti SC}}{%
          \IfFontExistsTF{PingFang SC}{\setmainfont{PingFang SC}}{%
            \IfFontExistsTF{Noto Serif SC}{\setmainfont{Noto Serif SC}}{%
              \IfFontExistsTF{WenQuanYi Zen Hei}{\setmainfont{WenQuanYi Zen Hei}}{%
                \IfFontExistsTF{WenQuanYi Micro Hei}{\setmainfont{WenQuanYi Micro Hei}}{%
                  \IfFontExistsTF{DejaVu Sans}{\setmainfont{DejaVu Sans}}{\setmainfont{Helvetica}}%
                }%
              }%
            }%
          }%
        }%
      }%
    }%
  }%
}`
                : String.raw`\IfFontExistsTF{Noto Serif}{\setmainfont{Noto Serif}}{%
  \IfFontExistsTF{DejaVu Serif}{\setmainfont{DejaVu Serif}}{%
    \IfFontExistsTF{Liberation Serif}{\setmainfont{Liberation Serif}}{%
      \IfFontExistsTF{Times New Roman}{\setmainfont{Times New Roman}}{%
        \IfFontExistsTF{Libertinus Serif}{\setmainfont{Libertinus Serif}}{\setmainfont{Times}}%
      }%
    }%
  }%
}`

  const monoFonts =
    locale === 'ko-kr'
      ? String.raw`\IfFontExistsTF{Noto Sans Mono CJK KR}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK KR}}{%
  \IfFontExistsTF{Noto Sans Mono CJK}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK}}{%
    \IfFontExistsTF{Nanum Gothic Coding}{\setmonofont[Scale=0.82]{Nanum Gothic Coding}}{%
      \IfFontExistsTF{Noto Sans Mono}{\setmonofont[Scale=0.82]{Noto Sans Mono}}{%
        \IfFontExistsTF{Noto Sans CJK KR}{\setmonofont[Scale=0.82]{Noto Sans CJK KR}}{%
          \IfFontExistsTF{Apple SD Gothic Neo}{\setmonofont[Scale=0.82]{Apple SD Gothic Neo}}{%
            \IfFontExistsTF{WenQuanYi Zen Hei Mono}{\setmonofont[Scale=0.82]{WenQuanYi Zen Hei Mono}}{%
              \IfFontExistsTF{DejaVu Sans Mono}{\setmonofont[Scale=0.82]{DejaVu Sans Mono}}{\setmonofont[Scale=0.82]{Courier}}%
            }%
          }%
        }%
      }%
    }%
  }%
}`
      : locale === 'ja-jp'
        ? String.raw`\IfFontExistsTF{Noto Sans Mono CJK JP}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK JP}}{%
  \IfFontExistsTF{Noto Sans Mono CJK}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK}}{%
    \IfFontExistsTF{Noto Sans Mono}{\setmonofont[Scale=0.82]{Noto Sans Mono}}{%
      \IfFontExistsTF{Noto Sans CJK JP}{\setmonofont[Scale=0.82]{Noto Sans CJK JP}}{%
        \IfFontExistsTF{Hiragino Sans GB}{\setmonofont[Scale=0.82]{Hiragino Sans GB}}{%
          \IfFontExistsTF{WenQuanYi Zen Hei Mono}{\setmonofont[Scale=0.82]{WenQuanYi Zen Hei Mono}}{%
            \IfFontExistsTF{DejaVu Sans Mono}{\setmonofont[Scale=0.82]{DejaVu Sans Mono}}{\setmonofont[Scale=0.82]{Courier}}%
          }%
        }%
      }%
    }%
  }%
}`
        : locale === 'vi-vn' || ['en', 'es-es', 'fr-fr', 'de-de', 'ar-sa'].includes(locale)
          ? String.raw`\IfFontExistsTF{Noto Sans Mono}{\setmonofont[Scale=0.82]{Noto Sans Mono}}{%
  \IfFontExistsTF{DejaVu Sans Mono}{\setmonofont[Scale=0.82]{DejaVu Sans Mono}}{%
    \IfFontExistsTF{Liberation Mono}{\setmonofont[Scale=0.82]{Liberation Mono}}{%
      \IfFontExistsTF{Menlo}{\setmonofont[Scale=0.82]{Menlo}}{\setmonofont[Scale=0.82]{Courier}}%
    }%
  }%
}`
          : locale === 'zh-tw'
            ? String.raw`\IfFontExistsTF{Noto Sans Mono CJK TC}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK TC}}{%
  \IfFontExistsTF{Noto Sans Mono CJK}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK}}{%
    \IfFontExistsTF{PingFang TC}{\setmonofont[Scale=0.82]{PingFang TC}}{%
      \IfFontExistsTF{Noto Sans Mono}{\setmonofont[Scale=0.82]{Noto Sans Mono}}{%
        \IfFontExistsTF{Noto Sans CJK TC}{\setmonofont[Scale=0.82]{Noto Sans CJK TC}}{%
          \IfFontExistsTF{WenQuanYi Zen Hei Mono}{\setmonofont[Scale=0.82]{WenQuanYi Zen Hei Mono}}{%
            \IfFontExistsTF{DejaVu Sans Mono}{\setmonofont[Scale=0.82]{DejaVu Sans Mono}}{\setmonofont[Scale=0.82]{Courier}}%
          }%
        }%
      }%
    }%
  }%
}`
            : String.raw`\IfFontExistsTF{Noto Sans Mono CJK SC}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK SC}}{%
  \IfFontExistsTF{Noto Sans Mono CJK}{\setmonofont[Scale=0.82]{Noto Sans Mono CJK}}{%
    \IfFontExistsTF{PingFang SC}{\setmonofont[Scale=0.82]{PingFang SC}}{%
      \IfFontExistsTF{Noto Sans Mono}{\setmonofont[Scale=0.82]{Noto Sans Mono}}{%
        \IfFontExistsTF{Noto Sans CJK SC}{\setmonofont[Scale=0.82]{Noto Sans CJK SC}}{%
          \IfFontExistsTF{WenQuanYi Zen Hei Mono}{\setmonofont[Scale=0.82]{WenQuanYi Zen Hei Mono}}{%
            \IfFontExistsTF{WenQuanYi Micro Hei Mono}{\setmonofont[Scale=0.82]{WenQuanYi Micro Hei Mono}}{%
              \IfFontExistsTF{DejaVu Sans Mono}{\setmonofont[Scale=0.82]{DejaVu Sans Mono}}{\setmonofont[Scale=0.82]{Courier}}%
            }%
          }%
        }%
      }%
    }%
  }%
}`

  // 除阿拉伯语用 polyglossia + 特殊 RTL 链外，其余都加一套 sans（正文之外也用于图注/目录）。
  const sansFonts =
    locale === 'zh-cn' || locale === 'zh-tw' || locale === 'ja-jp' || locale === 'ko-kr'
      ? (locale === 'zh-cn'
          ? String.raw`\IfFontExistsTF{Noto Sans CJK SC}{\setsansfont{Noto Sans CJK SC}}{%
  \IfFontExistsTF{Noto Sans CJK}{\setsansfont{Noto Sans CJK}}{%
    \IfFontExistsTF{PingFang SC}{\setsansfont{PingFang SC}}{%
      \IfFontExistsTF{WenQuanYi Zen Hei}{\setsansfont{WenQuanYi Zen Hei}}{%
        \IfFontExistsTF{DejaVu Sans}{\setsansfont{DejaVu Sans}}{\setsansfont{Helvetica}}%
      }%
    }%
  }%
}`
          : locale === 'zh-tw'
            ? String.raw`\IfFontExistsTF{Noto Sans CJK TC}{\setsansfont{Noto Sans CJK TC}}{%
  \IfFontExistsTF{Noto Sans CJK}{\setsansfont{Noto Sans CJK}}{%
    \IfFontExistsTF{PingFang TC}{\setsansfont{PingFang TC}}{%
      \IfFontExistsTF{WenQuanYi Zen Hei}{\setsansfont{WenQuanYi Zen Hei}}{%
        \IfFontExistsTF{DejaVu Sans}{\setsansfont{DejaVu Sans}}{\setsansfont{Helvetica}}%
      }%
    }%
  }%
}`
            : locale === 'ja-jp'
              ? String.raw`\IfFontExistsTF{Noto Sans CJK JP}{\setsansfont{Noto Sans CJK JP}}{%
  \IfFontExistsTF{Noto Sans CJK}{\setsansfont{Noto Sans CJK}}{%
    \IfFontExistsTF{Hiragino Sans GB}{\setsansfont{Hiragino Sans GB}}{%
      \IfFontExistsTF{DejaVu Sans}{\setsansfont{DejaVu Sans}}{\setsansfont{Helvetica}}%
    }%
  }%
}`
              : String.raw`\IfFontExistsTF{Noto Sans CJK KR}{\setsansfont{Noto Sans CJK KR}}{%
  \IfFontExistsTF{Noto Sans CJK}{\setsansfont{Noto Sans CJK}}{%
    \IfFontExistsTF{Nanum Gothic}{\setsansfont{Nanum Gothic}}{%
      \IfFontExistsTF{DejaVu Sans}{\setsansfont{DejaVu Sans}}{\setsansfont{Helvetica}}%
    }%
  }%
}`)
      : String.raw`\IfFontExistsTF{Noto Sans}{\setsansfont{Noto Sans}}{%
  \IfFontExistsTF{DejaVu Sans}{\setsansfont{DejaVu Sans}}{%
    \IfFontExistsTF{Liberation Sans}{\setsansfont{Liberation Sans}}{\setsansfont{Helvetica}}%
  }%
}`

  return `${mainFonts}\n${sansFonts}\n${monoFonts}`
}

function latexPreamble() {
  const rtlPreamble = isRtl
    ? String.raw`
\usepackage[document]{ragged2e}
\usepackage{polyglossia}
\setmainlanguage{arabic}
\setotherlanguage{english}
\IfFontExistsTF{Noto Naskh Arabic}{%
  \newfontfamily\arabicfont[Script=Arabic]{Noto Naskh Arabic}%
  \newfontfamily\arabicfontsf[Script=Arabic]{Noto Naskh Arabic}%
  \newfontfamily\arabicfonttt[Script=Arabic]{Noto Naskh Arabic}%
}{%
  \IfFontExistsTF{Noto Naskh Arabic UI}{%
    \newfontfamily\arabicfont[Script=Arabic]{Noto Naskh Arabic UI}%
    \newfontfamily\arabicfontsf[Script=Arabic]{Noto Naskh Arabic UI}%
    \newfontfamily\arabicfonttt[Script=Arabic]{Noto Naskh Arabic UI}%
  }{%
    \IfFontExistsTF{Amiri}{%
      \newfontfamily\arabicfont[Script=Arabic]{Amiri}%
      \newfontfamily\arabicfontsf[Script=Arabic]{Amiri}%
      \ifcsdef{arabicfonttt}{\relax}{\newcommand\arabicfonttt{\ttfamily}}%
    }{%
      \IfFontExistsTF{Geeza Pro}{%
        \newfontfamily\arabicfont[Script=Arabic]{Geeza Pro}%
        \newfontfamily\arabicfontsf[Script=Arabic]{Geeza Pro}%
        \ifcsdef{arabicfonttt}{\relax}{\newcommand\arabicfonttt{\ttfamily}}%
      }{%
        \newfontfamily\arabicfont[Script=Arabic]{Damascus}%
        \newfontfamily\arabicfontsf[Script=Arabic]{Damascus}%
        \ifcsdef{arabicfonttt}{\relax}{\newcommand\arabicfonttt{\ttfamily}}%
      }%
    }%
  }%
}
\IfFontExistsTF{Noto Serif}{\setmainfont{Noto Serif}}{%
  \IfFontExistsTF{DejaVu Serif}{\setmainfont{DejaVu Serif}}{%
    \IfFontExistsTF{Liberation Serif}{\setmainfont{Liberation Serif}}{\setmainfont{Times}}%
  }%
}
\IfFontExistsTF{Noto Sans Mono}{\setmonofont{Noto Sans Mono}}{%
  \IfFontExistsTF{DejaVu Sans Mono}{\setmonofont{DejaVu Sans Mono}}{%
    \IfFontExistsTF{Menlo}{\setmonofont{Menlo}}{\setmonofont{Courier}}%
  }%
}
\IfFontExistsTF{Noto Sans}{\setsansfont{Noto Sans}}{%
  \IfFontExistsTF{DejaVu Sans}{\setsansfont{DejaVu Sans}}{%
    \IfFontExistsTF{Liberation Sans}{\setsansfont{Liberation Sans}}{\setsansfont{Helvetica}}%
  }%
}
`
    : ''

  const fontPreamble = localeFontPreamble(locale)

  return String.raw`
\documentclass[10pt,openany,oneside]{book}
\usepackage[
  paperwidth=210mm,
  paperheight=297mm,
  top=16mm,
  bottom=18mm,
  inner=18mm,
  outer=18mm,
  headheight=14pt,
  headsep=5mm,
  footskip=8mm
]{geometry}
\usepackage{fontspec}
\defaultfontfeatures{Ligatures=TeX}
${isRtl ? rtlPreamble : fontPreamble}
\usepackage{microtype}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{graphicx}
\usepackage{float}
\usepackage{morefloats}
\usepackage{placeins}
\usepackage[table]{xcolor}
\usepackage{array}
\usepackage{tabularx}
\usepackage{fancyvrb}
\usepackage{caption}
\usepackage{hyperref}
\usepackage{bookmark}
\hypersetup{
  unicode=true,
  colorlinks=true,
  linkcolor=black,
  citecolor=black,
  urlcolor=RoyalBlue,
  linktoc=all,
  pdfpagemode=UseOutlines,
  bookmarksopen=true,
  bookmarksnumbered=true,
  pdftitle={${escapeLatex(pdfTitle)}},
  pdfauthor={${escapeLatex(pdfAuthors)}}
}
\definecolor{BookInk}{HTML}{222222}
\definecolor{BookMuted}{HTML}{666A73}
\definecolor{BookRule}{HTML}{D6DAE1}
\definecolor{BookSoft}{HTML}{F5F7FA}
\definecolor{RoyalBlue}{HTML}{2457A6}
\setlength{\parindent}{2em}
\setlength{\parskip}{0.14em}
\setlength{\emergencystretch}{2em}
\linespread{1.02}
\AtBeginDocument{\fontsize{${pdfBodyFontSize}}{${pdfBodyLineHeight}}\selectfont}
\XeTeXlinebreaklocale "${
  locale === 'zh-cn' || locale === 'zh-tw' ? 'zh' :
  locale === 'ja-jp' ? 'ja' :
  locale === 'ko-kr' ? 'ko' :
  locale === 'ar-sa' ? 'ar' :
  'en'
}"
\XeTeXlinebreakskip=${
  locale === 'zh-cn' || locale === 'zh-tw' || locale === 'ja-jp'
    ? '0pt plus 1pt'
    : locale === 'ko-kr'
      ? '0pt plus 2pt minus 0.5pt'
      : '0pt plus 2pt minus 1pt'
}
\tolerance=1600
\hbadness=3000
\raggedbottom
\renewcommand{\topfraction}{0.95}
\renewcommand{\bottomfraction}{0.95}
\renewcommand{\textfraction}{0.05}
\renewcommand{\floatpagefraction}{0.95}
\setcounter{topnumber}{8}
\setcounter{bottomnumber}{8}
\setcounter{totalnumber}{20}
\renewcommand{\dbltopfraction}{0.95}
\setcounter{dbltopnumber}{6}
\renewcommand{\contentsname}{${t.contents}}
\renewcommand{\figurename}{${t.fig}}
\renewcommand{\tablename}{${t.tab}}
\renewcommand{\arraystretch}{1.18}
\captionsetup{font=footnotesize,labelformat=empty}
\usepackage{titlesec}
\titleformat{\section}{\Large\bfseries\color{RoyalBlue}}{\thesection}{0.8em}{}
\titleformat{\subsection}{\large\bfseries\color{RoyalBlue}}{\thesubsection}{0.8em}{}
\titleformat{\subsubsection}{\normalsize\bfseries\color{RoyalBlue}}{\thesubsubsection}{0.8em}{}
\titlespacing*{\section}{0pt}{2.2ex plus .5ex minus .2ex}{1.2ex plus .2ex}
\titlespacing*{\subsection}{0pt}{1.8ex plus .4ex minus .2ex}{1.0ex plus .2ex}
\makeatletter
\def\@makechapterhead#1{%
  \vspace*{20pt}%
  {\parindent \z@ \raggedright \normalfont
    {\Large\color{BookMuted}\bfseries ${t.chapter} \thechapter ${t.chapterSuffix}\par}%
    \vspace{8pt}%
    {\Huge\bfseries #1\par}%
    \vspace{8pt}%
    \textcolor{RoyalBlue}{\rule{\textwidth}{1.2pt}}\par
    \vspace{16pt}%
  }%
}
\def\@makeschapterhead#1{%
  \vspace*{18pt}%
  {\parindent \z@ \raggedright \normalfont
    {\Huge\bfseries #1\par}%
    \vspace{8pt}%
    \textcolor{RoyalBlue}{\rule{\textwidth}{1.2pt}}\par
    \vspace{14pt}%
  }%
}
\makeatother
\usepackage{fancyhdr}
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\footnotesize \href{${escapeLatexUrl(bookGithubUrl)}}{Easy-Vibe}}
\fancyhead[R]{\footnotesize ${escapeLatex(pdfAuthors)}}
\fancyfoot[L]{\scriptsize GitHub: \href{${escapeLatexUrl(bookGithubUrl)}}{datawhalechina/easy-vibe}}
\fancyfoot[R]{\scriptsize\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\headrule}{{\color{RoyalBlue}\hrule width \headwidth height 0.8pt}}
\renewcommand{\footrulewidth}{0.3pt}
\renewcommand{\footrule}{{\color{BookRule}\hrule width \headwidth height 0.4pt}}
\fancypagestyle{plain}{%
  \fancyhf{}%
  \fancyfoot[L]{\scriptsize GitHub: \href{${escapeLatexUrl(bookGithubUrl)}}{datawhalechina/easy-vibe}}%
  \fancyfoot[R]{\scriptsize\thepage}%
  \renewcommand{\headrulewidth}{0pt}%
}
\makeatletter
\newenvironment{BookNote}[1]{%
  \par\medskip
  \begingroup
  \noindent
  \begin{lrbox}{\@tempboxa}%
  \begin{minipage}{\dimexpr\textwidth-2\fboxsep-0.6pt\relax}
  \small
  \textcolor{RoyalBlue}{\rule{2.4pt}{1.2em}}\hspace{5pt}\textbf{#1}\par
  \vspace{2pt}
  \leftskip=1.1em
}{%
  \end{minipage}%
  \end{lrbox}%
  \colorbox{BookSoft}{\usebox{\@tempboxa}}%
  \par\endgroup\medskip
}
\makeatother
\newcommand{\BookPart}[1]{%
  \cleardoublepage
  \phantomsection
  \addcontentsline{toc}{part}{#1}
  \thispagestyle{empty}
  \noindent
  \colorbox{RoyalBlue}{\parbox[c][0.5\textheight][c]{\dimexpr\textwidth-2\fboxsep\relax}{\centering
    {\Large\textcolor{white}{${t.part}}\par}
    \vspace{10pt}
    {\huge\bfseries\textcolor{white}{#1}\par}
    \vspace{14pt}
    \textcolor{white}{\rule{0.4\textwidth}{0.6pt}}\par
  }}
  \clearpage
}
\newcommand{\BookChapter}[4]{%
  \cleardoublepage
  \chapter{#1}
  \thispagestyle{plain}
  \vspace{4mm}
  {\large\bfseries #3\par}
  \vspace{2mm}
  ${t.chapterSummary}
  \begin{itemize}
  #4
  \end{itemize}
  \par\vspace{6mm}
  \noindent\textcolor{RoyalBlue}{\rule{\linewidth}{0.4pt}}\par
  \vspace{4mm}
}
`
}

function renderTitlePage(logoAsset) {
  const openCourseLabel = 'Open Course · Book PDF'
  const authorLabel = 'Authors'
  const repoLabel = 'Repository'
  const versionLabelText = 'Version'
  const coverNote =
    'This book is compiled by Datawhale Open Course Series as a versioned, citable PDF for offline reading and classroom use.'

  const logoCard = logoAsset
    ? `\\includegraphics[width=58mm]{${logoAsset}}\\\\[8mm]`
    : ''

  return [
    '\\begin{titlepage}',
    '\\thispagestyle{empty}',
    // 顶部蓝色色块：logo 白卡徽章 + 英文词标 + 标签
    '\\noindent\\colorbox{RoyalBlue}{%',
    '  \\parbox[c][0.43\\textheight][c]{\\dimexpr\\textwidth-2\\fboxsep\\relax}{%',
    '    \\centering',
    `    ${logoCard}`,
    `    {\\fontsize{40}{48}\\selectfont\\bfseries\\color{white} ${renderInline(
      pdfEnglishTitle
    )}}\\\\[3mm]`,
    `    {\\large\\color{white!88} ${renderInline(openCourseLabel)}}`,
    '  }%',
    '}\\par',
    '\\vspace{14mm}',
    '\\begin{center}',
    `{\\Huge\\bfseries\\color{BookInk} ${renderInline(pdfTitle)}}\\\\[5mm]`,
    `{\\Large\\color{BookMuted} ${renderInline(pdfSubtitle)}}\\\\[14mm]`,
    `\\fcolorbox{BookRule}{BookSoft}{\\parbox{0.82\\textwidth}{\\centering\\small\\color{BookInk} ${renderInline(
      pdfTagline
    )}}}\\\\[14mm]`,
    `{\\large Version \\textbf{${renderInline(pdfVersion)}} \\quad\\textbullet\\quad ${renderInline(
      pdfBuildDate
    )}}`,
    '\\end{center}',
    '\\vfill',
    '\\noindent\\textcolor{RoyalBlue}{\\rule{\\textwidth}{0.6pt}}\\\\[5mm]',
    `\\noindent\\textbf{${renderInline(authorLabel)}} \\quad ${renderInline(pdfAuthors)}\\\\[2.5mm]`,
    `\\noindent\\textbf{${renderInline(repoLabel)}} \\quad \\href{${escapeLatexUrl(
      bookGithubUrl
    )}}{${renderInline(bookGithubUrl)}}\\\\[2.5mm]`,
    `\\noindent\\textbf{${renderInline(versionLabelText)}} \\quad ${renderInline(pdfVersion)}\\\\[5mm]`,
    `\\noindent\\small\\color{BookMuted} ${renderInline(coverNote)}\\\\[2mm]`,
    '\\end{titlepage}'
  ].join('\n')
}

function renderFrontMatter(pageCount) {
  return [
    '\\frontmatter',
    '\\chapter*{About This Book}',
    '\\phantomsection\\addcontentsline{toc}{chapter}{About This Book}',
    '\\section*{Publication Information}',
    `\\noindent\\textbf{Title} \\quad ${renderInline(
      `${pdfTitle}: ${pdfSubtitle}`
    )}\\\\[2mm]`,
    `\\noindent\\textbf{Version} \\quad ${renderInline(pdfVersion)}\\\\[2mm]`,
    `\\noindent\\textbf{Build Date} \\quad ${renderInline(
      pdfBuildDate
    )}\\\\[2mm]`,
    `\\noindent\\textbf{Authors} \\quad ${renderInline(pdfAuthors)}\\\\[2mm]`,
    `\\noindent\\textbf{Repository} \\quad \\href{${escapeLatexUrl(
      bookGithubUrl
    )}}{${renderInline(bookGithubUrl)}}\\\\[2mm]`,
    `\\noindent\\textbf{Online Version} \\quad \\href{${escapeLatexUrl(
      pdfOnlineUrl
    )}}{${renderInline(pdfOnlineUrl)}}`,
    '',
    '\\section*{License}',
    'Copyright \\copyright{} 2026 Datawhale and contributors.',
    '',
    `Unless otherwise noted on a page, image, or code snippet, the original course text and figures are released under \\href{${escapeLatexUrl(
      pdfLicenseUrl
    )}}{${renderInline(pdfLicenseName)}}. You may copy, distribute, and adapt this material for non-commercial purposes, provided that attribution is preserved, changes are indicated, and derivative works are shared under the same license.`,
    '',
    '\\section*{About the Course}',
    `Easy-Vibe is an open course that teaches you how to use AI to program from scratch (Vibe Coding). This book edition compiles the course curriculum (Stage 1, Stage 2, Stage 3) into a single offline-readable volume.`,
    '',
    `This edition compiles ${pageCount} course pages with a cover, preface, contents, PDF bookmarks, and page numbers.`,
    '',
    '\\cleardoublepage',
    '\\phantomsection',
    '\\pdfbookmark[0]{Contents}{toc}',
    '\\tableofcontents',
    '\\mainmatter'
  ].join('\n')
}

async function loadSidebar() {
  const configModule = await import(pathToFileURL(configPath).href)
  const config = configModule.default
  return getStageSidebars(config, locale)
}

function prepareWorkDir() {
  if (!keepWorkDir) fs.rmSync(workDir, { recursive: true, force: true })
  fs.mkdirSync(assetDir, { recursive: true })
  fs.mkdirSync(distDir, { recursive: true })
}

function compileLatex() {
  for (let run = 1; run <= 2; run += 1) {
    const result = spawnSync(
      'xelatex',
      ['-interaction=nonstopmode', '-halt-on-error', 'book.tex'],
      {
        cwd: workDir,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    )

    if (result.status !== 0) {
      const stdoutLogPath = path.join(workDir, `xelatex-run-${run}.stdout.log`)
      const stderrLogPath = path.join(workDir, `xelatex-run-${run}.stderr.log`)
      fs.writeFileSync(stdoutLogPath, result.stdout || '')
      fs.writeFileSync(stderrLogPath, result.stderr || '')

      const tailLines = String(result.stdout || '')
        .split(/\r?\n/)
        .slice(-120)
        .join('\n')
      if (tailLines.trim()) {
        console.error(`\n--- xelatex stdout tail (run ${run}) ---`)
        console.error(tailLines)
        console.error('--- end xelatex stdout tail ---\n')
      }
      if (String(result.stderr || '').trim()) {
        console.error(`\n--- xelatex stderr (run ${run}) ---`)
        console.error(result.stderr)
        console.error('--- end xelatex stderr ---\n')
      }

      throw new Error(`xelatex failed on run ${run}. See ${stdoutLogPath}`)
    }
  }

  fs.copyFileSync(path.join(workDir, 'book.pdf'), pdfOutputPath)
}

function normalizeGhostscriptProfile(value) {
  const clean = String(value || 'default')
    .trim()
    .replace(/^\//, '')
    .toLowerCase()
  const allowed = new Set(['screen', 'ebook', 'printer', 'prepress', 'default'])
  return allowed.has(clean) ? `/${clean}` : '/default'
}

function optimizePdfOutput() {
  if (!pdfOptimize) return

  const optimizedPath = pdfOutputPath.replace(/\.pdf$/i, '.optimized.pdf')
  fs.rmSync(optimizedPath, { force: true })

  const ok = runTool('gs', [
    '-sDEVICE=pdfwrite',
    '-dCompatibilityLevel=1.7',
    `-dPDFSETTINGS=${normalizeGhostscriptProfile(pdfOptimizeProfile)}`,
    '-dColorConversionStrategy=/LeaveColorUnchanged',
    '-dDownsampleColorImages=false',
    '-dDownsampleGrayImages=false',
    '-dDownsampleMonoImages=false',
    '-dDetectDuplicateImages=true',
    '-dCompressFonts=true',
    '-dSubsetFonts=true',
    '-dNOPAUSE',
    '-dBATCH',
    '-dQUIET',
    `-sOutputFile=${optimizedPath}`,
    pdfOutputPath
  ])

  if (!ok || !hasUsableFile(optimizedPath)) {
    fs.rmSync(optimizedPath, { force: true })
    warnOnce('Unable to optimize PDF with Ghostscript; kept the unoptimized version.')
    return
  }

  fs.renameSync(optimizedPath, pdfOutputPath)
}

async function main() {
  prepareWorkDir()

  const logoSource = path.join(docsDir, 'public', 'logo.png')
  const logoAsset = fs.existsSync(logoSource) ? copyAsset(logoSource) : null
  const stageSidebars = await loadSidebar()
  const chunks = collectBookStructure(stageSidebars, locale)
  const limited = sourcePageLimit > 0 ? chunks.slice(0, sourcePageLimit) : chunks
  const pageCount = limited.reduce((count, chunk) => {
    if (chunk.type === 'chapter') return count + chunk.pages.length
    return count
  }, 0)

  const tex = [
    latexPreamble(),
    '\\begin{document}',
    renderTitlePage(logoAsset),
    renderFrontMatter(pageCount),
    renderBookContent(limited),
    '\\end{document}'
  ].join('\n\n')

  fs.writeFileSync(texPath, tex)

  if (skipCompile) {
    console.log(`PDF compilation skipped (PDF_SKIP_COMPILE=1). LaTeX source written to ${texPath}`)
    console.log(`Assets written to ${assetDir}`)
    return
  }

  compileLatex()
  optimizePdfOutput()

  console.log(`LaTeX book PDF written to ${pdfOutputPath}`)
  console.log(`LaTeX source written to ${texPath}`)
  if (buildWarnings.length) {
    console.warn('LaTeX book build warnings:')
    for (const warning of buildWarnings) console.warn(`- ${warning}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

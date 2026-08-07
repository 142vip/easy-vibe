#!/usr/bin/env node
/* global process, Buffer */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { ZipArchive } from 'archiver'
import { convertImageToPngFile } from './epub-image-conversion.mjs'
import {
  docsDir,
  distDir,
  bookVersion,
  bookAuthor,
  bookBuildDate,
  bookGithubUrl,
  bookLicense,
  LOCALES,
  LOCALE_LANG,
  LOCALE_TITLE,
  LOCALE_SUBTITLE,
  escapeHtml,
  stripFrontmatter,
  stripScriptSetup,
  transformVueComponents,
  collectBookStructure,
  pagePathForLink,
  loadVitePressConfig,
  getStageSidebars
} from './book-shared.mjs'

// 确保本地装的 TeX/ImageMagick/Ghostscript/homebrew 在非交互式 shell 下也能找到
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

const require = createRequire(import.meta.url)
const markdownIt = require('markdown-it')
const markdownItFootnote = require('markdown-it-footnote')
const markdownItContainer = require('markdown-it-container')
const katex = require('katex')

const locale = String(process.env.EPUB_LOCALE || 'zh-cn').toLowerCase()
if (!LOCALES.includes(locale)) {
  console.error(`Unsupported EPUB_LOCALE=${locale}. Supported: ${LOCALES.join(', ')}`)
  process.exit(1)
}
const lang = LOCALE_LANG[locale]
const bookTitle = process.env.EPUB_BOOK_TITLE || LOCALE_TITLE[locale]
const bookSubtitle = LOCALE_SUBTITLE[locale]
const bookTagline = process.env.EPUB_TAGLINE || `${bookTitle} · ${bookSubtitle}`

const localBuildDate =
  process.env.PDF_BUILD_DATE ||
  new Intl.DateTimeFormat(locale === 'zh-cn' ? 'zh-CN' : locale === 'zh-tw' ? 'zh-TW' : locale, {
    dateStyle: 'long',
    timeZone: 'Asia/Shanghai'
  }).format(new Date())

const bookVersionFile = String(bookVersion).replace(/^v/i, '')
const epubFileName =
  process.env.EPUB_FILE_NAME ||
  `easy-vibe-open-textbook-${locale}-v${bookVersionFile}.epub`
const epubOutputPath = path.join(distDir, epubFileName)
const epubBookId = `easy-vibe-${locale}-epub`

const logoPath = path.join(docsDir, 'public', 'logo.png')

// 各语言下 EPUB 前置页文案
const F = {
  'zh-cn': {
    toc: '目录', tocFront: '前置页', cover: '封面', introTitle: '本书简介', pubTitle: '版本说明',
    about: '关于本书', version: '版本', authors: '作者', repository: '项目仓库',
    build: '构建日期', online: '在线版本', onlineImg: '在线图片', note: '说明', tip: '提示',
    warning: '注意', danger: '警告', details: '补充说明', fig: '图', tab: '表',
    publisher: 'Datawhale 开源学习系列',
    introDesc: '本电子书汇编了 Easy-Vibe 课程的第一、二、三阶段全部正文内容，适合离线阅读与课堂使用。',
    pageCount: (n) => `本书共汇编 ${n} 个课程页面。`,
    licenseSection: '许可协议', licenseText: '除特别注明外，本书正文与图片均采用 CC BY-NC-SA 4.0 许可协议发布。'
  },
  'zh-tw': {
    toc: '目錄', tocFront: '前置頁', cover: '封面', introTitle: '本書簡介', pubTitle: '版本說明',
    about: '關於本書', version: '版本', authors: '作者', repository: '專案倉庫',
    build: '建置日期', online: '線上版本', onlineImg: '線上圖片', note: '說明', tip: '提示',
    warning: '注意', danger: '警告', details: '補充說明', fig: '圖', tab: '表',
    publisher: 'Datawhale 開源學習系列',
    introDesc: '本書彙編了 Easy-Vibe 課程第一、二、三階段的全部正文內容，適合離線閱讀與課堂使用。',
    pageCount: (n) => `本書共彙編 ${n} 個課程頁面。`,
    licenseSection: '授權條款', licenseText: '除特別註明外，本書正文與圖片均以 CC BY-NC-SA 4.0 授權條款發佈。'
  },
  en: {
    toc: 'Contents', tocFront: 'Front Matter', cover: 'Cover', introTitle: 'About This Book', pubTitle: 'Publication Note',
    about: 'About This Book', version: 'Version', authors: 'Authors', repository: 'Repository',
    build: 'Build Date', online: 'Online Version', onlineImg: 'Online image', note: 'Note', tip: 'Tip',
    warning: 'Warning', danger: 'Danger', details: 'Details', fig: 'Figure', tab: 'Table',
    publisher: 'Datawhale Open Course Series',
    introDesc: 'This ebook compiles the full course content of Stages 1, 2, and 3 of the Easy-Vibe course for offline reading and classroom use.',
    pageCount: (n) => `This edition compiles ${n} course pages.`,
    licenseSection: 'License', licenseText: 'Unless otherwise noted, the course text and figures are released under the CC BY-NC-SA 4.0 license.'
  },
  'ja-jp': {
    toc: '目次', tocFront: '前置ページ', cover: '表紙', introTitle: '本書について', pubTitle: '版について',
    about: '本書について', version: 'バージョン', authors: '著者', repository: 'リポジトリ',
    build: 'ビルド日', online: 'オンライン版', onlineImg: 'オンライン画像', note: '説明', tip: 'ヒント',
    warning: '注意', danger: '警告', details: '補足', fig: '図', tab: '表',
    publisher: 'Datawhale オープンコースシリーズ',
    introDesc: 'この電子書籍は、Easy-Vibe コースのステージ1・2・3の本文をまとめたもので、オフラインで読書や授業に最適です。',
    pageCount: (n) => `本書は ${n} ページのコース教材を収録しています。`,
    licenseSection: 'ライセンス', licenseText: '特記のない限り、本文と図は CC BY-NC-SA 4.0 ライセンスで提供されます。'
  },
  'ko-kr': {
    toc: '목차', tocFront: '앞표지', cover: '표지', introTitle: '이 책 소개', pubTitle: '발행 정보',
    about: '이 책 소개', version: '버전', authors: '저자', repository: '저장소',
    build: '빌드 날짜', online: '온라인 버전', onlineImg: '온라인 이미지', note: '설명', tip: '팁',
    warning: '주의', danger: '경고', details: '추가 설명', fig: '그림', tab: '표',
    publisher: 'Datawhale 오픈 코스 시리즈',
    introDesc: '이 전자책은 Easy-Vibe 코스의 1·2·3단계 전체 본문을 묶은 것으로, 오프라인 열람과 수업에 적합합니다.',
    pageCount: (n) => `본 책에는 ${n}개의 코스 페이지가 수록되어 있습니다.`,
    licenseSection: '라이선스', licenseText: '별도 표기가 없는 한 본문과 그림은 CC BY-NC-SA 4.0 라이선스로 배포됩니다.'
  },
  'es-es': {
    toc: 'Contenido', tocFront: 'Preliminares', cover: 'Portada', introTitle: 'Acerca de este libro', pubTitle: 'Nota de publicación',
    about: 'Acerca de este libro', version: 'Versión', authors: 'Autores', repository: 'Repositorio',
    build: 'Fecha de compilación', online: 'Versión en línea', onlineImg: 'Imagen en línea', note: 'Nota', tip: 'Consejo',
    warning: 'Advertencia', danger: 'Peligro', details: 'Detalles', fig: 'Figura', tab: 'Tabla',
    publisher: 'Serie de cursos abiertos Datawhale',
    introDesc: 'Este libro electrónico compila el contenido completo de las Etapas 1, 2 y 3 del curso Easy-Vibe para lectura sin conexión y uso en clase.',
    pageCount: (n) => `Esta edición compila ${n} páginas del curso.`,
    licenseSection: 'Licencia', licenseText: 'Salvo que se indique lo contrario, el texto y las figuras se publican bajo la licencia CC BY-NC-SA 4.0.'
  },
  'fr-fr': {
    toc: 'Sommaire', tocFront: 'Preliminaires', cover: 'Couverture', introTitle: 'À propos de ce livre', pubTitle: 'Note de publication',
    about: 'À propos de ce livre', version: 'Version', authors: 'Auteurs', repository: 'Dépôt',
    build: 'Date de compilation', online: 'Version en ligne', onlineImg: 'Image en ligne', note: 'Remarque', tip: 'Astuce',
    warning: 'Attention', danger: 'Danger', details: 'Détails', fig: 'Figure', tab: 'Tableau',
    publisher: 'Série de cours ouverts Datawhale',
    introDesc: 'Ce livre électronique compile le contenu complet des étapes 1, 2 et 3 du cours Easy-Vibe pour une lecture hors ligne et une utilisation en classe.',
    pageCount: (n) => `Cette édition compile ${n} pages de cours.`,
    licenseSection: 'Licence', licenseText: 'Sauf mention contraire, le texte et les figures sont publiés sous licence CC BY-NC-SA 4.0.'
  },
  'de-de': {
    toc: 'Inhalt', tocFront: 'Vorspann', cover: 'Titelseite', introTitle: 'Über dieses Buch', pubTitle: 'Veröffentlichungshinweis',
    about: 'Über dieses Buch', version: 'Version', authors: 'Autoren', repository: 'Repository',
    build: 'Erstellt am', online: 'Online-Version', onlineImg: 'Online-Bild', note: 'Hinweis', tip: 'Tipp',
    warning: 'Warnung', danger: 'Gefahr', details: 'Details', fig: 'Abbildung', tab: 'Tabelle',
    publisher: 'Datawhale Open Course Series',
    introDesc: 'Dieses E-Book fasst die vollständigen Inhalte der Stufen 1, 2 und 3 des Easy-Vibe-Kurses für die Offline-Lektüre und den Unterricht zusammen.',
    pageCount: (n) => `Diese Ausgabe fasst ${n} Kursseiten zusammen.`,
    licenseSection: 'Lizenz', licenseText: 'Sofern nicht anders angegeben, werden Text und Abbildungen unter der CC BY-NC-SA 4.0-Lizenz veröffentlicht.'
  },
  'ar-sa': {
    toc: 'المحتويات', tocFront: 'الصفحات الأولية', cover: 'الغلاف', introTitle: 'عن هذا الكتاب', pubTitle: 'ملاحظة النشر',
    about: 'عن هذا الكتاب', version: 'الإصدار', authors: 'المؤلفون', repository: 'المستودع',
    build: 'تاريخ البناء', online: 'النسخة الإلكترونية', onlineImg: 'صورة عبر الإنترنت', note: 'ملاحظة', tip: 'نصيحة',
    warning: 'تحذير', danger: 'خطر', details: 'تفاصيل', fig: 'شكل', tab: 'جدول',
    publisher: 'سلسلة دورات Datawhale المفتوحة',
    introDesc: 'يجمع هذا الكتاب الإلكتروني المحتوى الكامل للمراحل 1 و2 و3 من دورة Easy-Vibe للقراءة دون اتصال واستخدام الفصول الدراسية.',
    pageCount: (n) => `تتضمن هذه الطبعة ${n} من صفحات الدورة.`,
    licenseSection: 'الترخيص', licenseText: 'ما لم يُذكر خلاف ذلك، يُنشر نص الدورة والصور بموجب ترخيص CC BY-NC-SA 4.0.'
  },
  'vi-vn': {
    toc: 'Mục lục', tocFront: 'Phần đầu', cover: 'Bìa', introTitle: 'Về cuốn sách này', pubTitle: 'Ghi chú xuất bản',
    about: 'Về cuốn sách này', version: 'Phiên bản', authors: 'Tác giả', repository: 'Kho lưu trữ',
    build: 'Ngày biên dịch', online: 'Phiên bản trực tuyến', onlineImg: 'Hình ảnh trực tuyến', note: 'Ghi chú', tip: 'Mẹo',
    warning: 'Cảnh báo', danger: 'Nguy hiểm', details: 'Chi tiết', fig: 'Hình', tab: 'Bảng',
    publisher: 'Chuỗi khóa học mở Datawhale',
    introDesc: 'Sách điện tử này tổng hợp toàn bộ nội dung Giai đoạn 1, 2 và 3 của khóa học Easy-Vibe để đọc ngoại tuyến và sử dụng trong lớp.',
    pageCount: (n) => `Ấn bản này tổng hợp ${n} trang khóa học.`,
    licenseSection: 'Giấy phép', licenseText: 'Trừ khi có quy định khác, văn bản và hình ảnh được phát hành theo giấy phép CC BY-NC-SA 4.0.'
  }
}
const f = F[locale] || F.en

const pdfOnlineUrl = process.env.EPUB_ONLINE_URL || `https://datawhalechina.github.io/easy-vibe/${locale}/`

// --- Markdown pre-clean: drop residual top-level JS lines (safety net) ---

function looksLikeTopLevelJsLineFilter(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
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
    const s = line.trim()
    if (
      /^(import\s|export\s|const\s+|let\s+|var\s+|type\s+|interface\s+|async\s+function\s|function\s)/.test(s) ||
      (/^[\w$]+\s*=\s*[^=]/.test(s) && /[;{[]$/.test(s))
    ) {
      i += 1
      continue
    }
    out.push(line)
    i += 1
  }
  return out.join('\n')
}

// --- Markdown-it setup ---

function isValidMathDelimiter(state, pos) {
  const max = state.posMax
  const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
  const nextChar = pos + 1 < max ? state.src.charCodeAt(pos + 1) : -1
  return {
    canOpen: nextChar !== 0x20 && nextChar !== 0x09,
    canClose:
      prevChar !== 0x20 &&
      prevChar !== 0x09 &&
      (nextChar < 0x30 || nextChar > 0x39)
  }
}

function mathInline(state, silent) {
  if (state.src[state.pos] !== '$') return false
  let delimiter = isValidMathDelimiter(state, state.pos)
  if (!delimiter.canOpen) {
    if (!silent) state.pending += '$'
    state.pos += 1
    return true
  }
  const start = state.pos + 1
  const max = state.posMax
  let match = start
  while ((match = state.src.indexOf('$', match)) !== -1) {
    if (match >= max) {
      match = -1
      break
    }
    let pos = match - 1
    while (state.src[pos] === '\\') pos -= 1
    if ((match - pos) % 2 === 1) break
    match += 1
  }
  if (match === -1) {
    if (!silent) state.pending += '$'
    state.pos = start
    return true
  }
  if (match - start === 0) {
    if (!silent) state.pending += '$$'
    state.pos = start + 1
    return true
  }
  delimiter = isValidMathDelimiter(state, match)
  if (!delimiter.canClose) {
    if (!silent) state.pending += '$'
    state.pos = start
    return true
  }
  if (!silent) {
    const token = state.push('math_inline', 'math', 0)
    token.markup = '$'
    token.content = state.src.slice(start, match)
  }
  state.pos = match + 1
  return true
}

function mathBlock(state, start, end, silent) {
  let pos = state.bMarks[start] + state.tShift[start]
  const max = state.eMarks[start]
  if (pos + 2 > max) return false
  if (state.src.slice(pos, pos + 2) !== '$$') return false
  pos += 2
  let firstLine = state.src.slice(pos, max)
  let lastLine = ''
  let found = false
  let next = start
  if (silent) return true
  if (firstLine.trim().slice(-2) === '$$') {
    firstLine = firstLine.trim().slice(0, -2)
    found = true
  }
  while (!found) {
    next++
    if (next >= end) break
    pos = state.bMarks[next] + state.tShift[next]
    const lineMax = state.eMarks[next]
    if (pos < lineMax && state.tShift[next] < state.blkIndent) break
    if (state.src.slice(pos, lineMax).trim().slice(-2) === '$$') {
      const lastPos = state.src.slice(0, lineMax).lastIndexOf('$$')
      lastLine = state.src.slice(pos, lastPos)
      found = true
    }
  }
  state.line = next + 1
  const token = state.push('math_block', 'math', 0)
  token.block = true
  token.content =
    (firstLine && firstLine.trim() ? `${firstLine}\n` : '') +
    state.getLines(start + 1, next, state.tShift[start], true) +
    (lastLine && lastLine.trim() ? lastLine : '')
  token.map = [start, state.line]
  token.markup = '$$'
  return true
}

function renderKatex(content, displayMode) {
  const html = katex.renderToString(content, {
    displayMode,
    output: 'mathml',
    throwOnError: false,
    strict: false,
    trust: true
  })
  return html
    .replace(/^<span class="katex">/, '')
    .replace(/<\/span>$/, '')
    .replace(/<semantics>/, '')
    .replace(
      /<annotation encoding="application\/x-tex">[\s\S]*?<\/annotation><\/semantics>/,
      ''
    )
}

let mermaidAssetDir = null
let mermaidAssetCount = 0

function getMermaidAssetDir() {
  if (!mermaidAssetDir) {
    mermaidAssetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'epub-mermaid-'))
  }
  return mermaidAssetDir
}

function cleanupMermaidAssets() {
  if (mermaidAssetDir) fs.rmSync(mermaidAssetDir, { recursive: true, force: true })
}

let convertedAssetDir = null

function getConvertedAssetDir() {
  if (!convertedAssetDir) {
    convertedAssetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'epub-converted-'))
  }
  return convertedAssetDir
}

function cleanupConvertedAssets() {
  if (convertedAssetDir) fs.rmSync(convertedAssetDir, { recursive: true, force: true })
}

function detectActualFormat(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r')
    const buf = Buffer.alloc(12)
    fs.readSync(fd, buf, 0, 12, 0)
    fs.closeSync(fd)
    if (
      buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
    ) {
      return 'webp'
    }
    if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'gif'
  } catch {
    // unreadable
  }
  return null
}

const convertCache = new Map()

function convertImageToPng(imagePath) {
  const cached = convertCache.get(imagePath)
  if (cached) return cached
  const dir = getConvertedAssetDir()
  const basename = path.basename(imagePath, path.extname(imagePath))
  const pngPath = path.join(dir, `${basename}-${Date.now()}.png`)
  if (convertImageToPngFile(imagePath, pngPath)) {
    convertCache.set(imagePath, pngPath)
    return pngPath
  }
  return null
}

function needsConversion(filePath, ext) {
  if (ext === '.webp') return true
  if (ext === '.gif') return true
  if (detectActualFormat(filePath) === 'webp') return true
  return false
}

let optimizedAssetDir = null

function getOptimizedAssetDir() {
  if (!optimizedAssetDir) {
    optimizedAssetDir = fs.mkdtempSync(path.join(os.tmpdir(), 'epub-optimized-'))
  }
  return optimizedAssetDir
}

function cleanupOptimizedAssets() {
  if (optimizedAssetDir) fs.rmSync(optimizedAssetDir, { recursive: true, force: true })
}

function runToolCapture(command, args) {
  try {
    return execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15_000
    })
  } catch {
    return null
  }
}

function runTool(command, args) {
  try {
    execFileSync(command, args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 30_000
    })
    return true
  } catch {
    return false
  }
}

// 将栅格图降采样到最大边不超过 maxDim 像素，控制 EPUB/PDF 体积。
function downscaleRaster(sourcePath, targetPath) {
  const sourceMax = Number(process.env.BOOK_IMAGE_MAX_DIM || 1600)
  const widthMatch = runToolCapture('sips', ['-g', 'pixelWidth', sourcePath])?.match(
    /pixelWidth:\s*(\d+)/i
  )
  const heightMatch = runToolCapture('sips', ['-g', 'pixelHeight', sourcePath])?.match(
    /pixelHeight:\s*(\d+)/i
  )
  const maxDim = Math.max(
    Number(widthMatch?.[1] || 0),
    Number(heightMatch?.[1] || 0)
  )

  if (maxDim <= sourceMax || maxDim === 0) {
    fs.copyFileSync(sourcePath, targetPath)
    return true
  }

  return runTool('sips', ['-Z', String(sourceMax), sourcePath, '--out', targetPath])
}

// 将较大的 PNG 转为 JPEG（质量 ~82），大幅缩小体积。小图保留 PNG。
function maybeJpeg(files) {
  const thresholdKb = Number(process.env.BOOK_JPEG_THRESHOLD_KB || 300)
  const quality = String(process.env.BOOK_JPEG_QUALITY || '82')
  const output = []
  for (const file of files) {
    if (!fs.existsSync(file)) continue
    const stat = fs.statSync(file)
    if (path.extname(file).toLowerCase() === '.png' && stat.size >= thresholdKb * 1024) {
      const jpegPath = path.join(
        getOptimizedAssetDir(),
        `${path.basename(file, path.extname(file))}-${Date.now()}.jpg`
      )
      if (
        runTool('magick', [file, '-quality', quality, jpegPath]) ||
        runTool('convert', [file, '-quality', quality, jpegPath]) ||
        runTool('sips', [
          '-s',
          'format',
          'jpeg',
          '-s',
          'formatOptions',
          quality,
          file,
          '--out',
          jpegPath
        ])
      ) {
        if (fs.existsSync(jpegPath) && fs.statSync(jpegPath).size > 0) {
          output.push(jpegPath)
          continue
        }
      }
    }
    output.push(file)
  }
  return output
}

function renderMermaidToPng(source) {
  mermaidAssetCount += 1
  const stem = `mermaid-${String(mermaidAssetCount).padStart(4, '0')}`
  const dir = getMermaidAssetDir()
  const mmdPath = path.join(dir, `${stem}.mmd`)
  const pngPath = path.join(dir, `${stem}.png`)
  fs.writeFileSync(mmdPath, source)
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    fs.rmSync(pngPath, { force: true })
    try {
      execFileSync(
        process.execPath,
        ['scripts/render-book-asset.mjs', 'mermaid', mmdPath, pngPath],
        { cwd: path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }
      )
    } catch {
      continue
    }
    if (fs.existsSync(pngPath) && fs.statSync(pngPath).size > 0) return pngPath
  }
  return null
}

// --- Heading ID generation (matches VitePress slugify) ---

const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'"“”‘’<>,.?/]+/g
const rCombining = /[̀-ͯ]/g

function slugify(str) {
  return str
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(rControl, '')
    .replace(rSpecial, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/^(\d)/, '_$1')
    .toLowerCase()
}

function headingIdPlugin(md) {
  const slugCounts = new Map()
  md.core.ruler.push('heading_ids', (state) => {
    slugCounts.clear()
    for (let idx = 0; idx < state.tokens.length - 1; idx++) {
      const token = state.tokens[idx]
      if (token.type !== 'heading_open') continue
      const inline = state.tokens[idx + 1]
      if (!inline || inline.type !== 'inline') continue
      let customId = null
      const children = inline.children || []
      const lastText = [...children].reverse().find((t) => t.type === 'text')
      if (lastText) {
        const m = lastText.content.match(/\s*\{#([A-Za-z0-9][A-Za-z0-9_.:-]*)\}$/)
        if (m) {
          customId = m[1]
          lastText.content = lastText.content.slice(0, m.index)
          inline.content = inline.content.replace(m[0], '')
        }
      }
      const title = inline.content
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .trim()
      const baseSlug = customId || slugify(title)
      const count = slugCounts.get(baseSlug) || 0
      slugCounts.set(baseSlug, count + 1)
      token.attrSet('id', count === 0 ? baseSlug : `${baseSlug}-${count}`)
    }
  })
}

function createMarkdownRenderer(imageMap) {
  const md = markdownIt({ html: true, xhtmlOut: true, linkify: true, typographer: false })
  md.inline.ruler.before('text', 'math_inline', mathInline)
  md.block.ruler.after('blockquote', 'math_block', mathBlock, { alt: ['paragraph', 'reference', 'blockquote', 'list'] })
  md.renderer.rules.math_inline = (tokens, idx) => renderKatex(tokens[idx].content, false)
  md.renderer.rules.math_block = (tokens, idx) => `<p class="math-block">${renderKatex(tokens[idx].content, true)}</p>\n`
  md.use(markdownItFootnote)
  headingIdPlugin(md)
  md.use(markdownItContainer, 'output', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const title = tokens[idx].info.trim().slice(6).trim() || f.fig
        return `<div class="output-block"><p class="output-title">${escapeXml(title)}</p>\n`
      }
      return '</div>\n'
    }
  })

  // VitePress 提示容器（::: tip/warning/danger/info/details）
  md.use(markdownItContainer, 'tip', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) return `<div class="booknote"><p class="booknote-title">${escapeXml(f.tip)}</p>\n`
      return '</div>\n'
    }
  })
  md.use(markdownItContainer, 'warning', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) return `<div class="booknote"><p class="booknote-title">${escapeXml(f.warning)}</p>\n`
      return '</div>\n'
    }
  })
  md.use(markdownItContainer, 'danger', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) return `<div class="booknote"><p class="booknote-title">${escapeXml(f.danger)}</p>\n`
      return '</div>\n'
    }
  })
  md.use(markdownItContainer, 'info', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) return `<div class="booknote"><p class="booknote-title">${escapeXml(f.note)}</p>\n`
      return '</div>\n'
    }
  })
  md.use(markdownItContainer, 'details', {
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) return `<div class="booknote"><p class="booknote-title">${escapeXml(f.details)}</p>\n`
      return '</div>\n'
    }
  })

  const defaultFence = md.renderer.rules.fence || function (tokens, idx, options, env, self) { return self.renderToken(tokens, idx, options) }
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    if (token.info.trim().startsWith('mermaid')) {
      const pngPath = renderMermaidToPng(token.content)
      if (pngPath) {
        const imageId = `mermaid-${String(imageMap.size).padStart(4, '0')}.png`
        imageMap.set(pngPath, imageId)
        return `<div class="mermaid-diagram"><img src="../images/${imageId}" alt="Mermaid" /></div>\n`
      }
      return `<div class="mermaid-placeholder"><p class="mermaid-label">${escapeXml(f.fig)}</p><pre>${escapeXml(token.content)}</pre></div>\n`
    }
    return defaultFence(tokens, idx, options, env, self)
  }
  return md
}

function htmlToXhtml(html) {
  const voidElements = 'area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr'
  const pattern = new RegExp(`<(${voidElements})(\\b[^>]*?)\\s*/?>`, 'gi')
  return html
    .replace(pattern, (m, tag, attrs) => `<${tag}${attrs.replace(/\s*\/$/, '')} />`)
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;')
}

function escapeXml(value) {
  return escapeHtml(value).replace(/'/g, '&apos;')
}

function normalizeLinkKey(link) {
  return link
    .replace(/^\//, '')
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\/$/, '')
    .replace(/\/index$/, '')
    .replace(/\.md$/, '')
}

function buildLinkMap(allPages) {
  const map = new Map()
  for (const page of allPages) {
    if (!page._chapterId || !page.link) continue
    map.set(normalizeLinkKey(page.link), page._chapterId)
  }
  return map
}

function rewriteInternalLinks(html, linkMap, sourcePageLink) {
  const sourceDir = sourcePageLink ? sourcePageLink.replace(/^\//, '').replace(/\/[^/]*$/, '') : ''
  return html.replace(/<a\s([^>]*?)href=["']([^"']+)["']([^>]*)>/gi, (match, pre, href, post) => {
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('#')) return match
    const hashIdx = href.indexOf('#')
    const fragment = hashIdx >= 0 ? href.slice(hashIdx) : ''
    const pathPart = hashIdx >= 0 ? href.slice(0, hashIdx) : href
    let key
    if (pathPart.startsWith('/')) {
      key = normalizeLinkKey(pathPart)
    } else if (pathPart.startsWith('./') || pathPart.startsWith('../') || !pathPart.includes('://')) {
      key = normalizeLinkKey(path.posix.join(sourceDir, pathPart))
    } else {
      key = normalizeLinkKey(pathPart)
    }
    const chapterId = linkMap.get(key)
    if (chapterId) return `<a ${pre}href="${chapterId}.xhtml${fragment}"${post}>`
    const docsPath = key.startsWith('code/') ? key : `docs/${key}`
    return `<a ${pre}href="${escapeXml(`${bookGithubUrl}/blob/main/${docsPath}`)}"${post}>`
  })
}

function mediaTypeForExt(ext) {
  const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp' }
  return types[ext.toLowerCase()] || 'application/octet-stream'
}

let imageOptCounter = 0
const prepareCache = new Map()

// 统一处理图片：转码 → 降采样 → 大图转 JPEG，返回优化后的路径与扩展名。
// 以源图路径为缓存键，保证同一张图在多处引用时只优化一次、共用一个产物。
function prepareBookImage(sourcePath, ext) {
  if (prepareCache.has(sourcePath)) return prepareCache.get(sourcePath)

  let absolutePath = sourcePath
  if (needsConversion(absolutePath, ext)) {
    const converted = convertImageToPng(absolutePath)
    if (!converted) throw new Error(`Unable to convert image to PNG: ${absolutePath}`)
    absolutePath = converted
    ext = '.png'
  }

  if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    imageOptCounter += 1
    const downPath = path.join(
      getOptimizedAssetDir(),
      `opt-${String(imageOptCounter).padStart(4, '0')}${ext}`
    )
    downscaleRaster(absolutePath, downPath)
    absolutePath = downPath
  }

  if (ext === '.png') {
    const stat = fs.existsSync(absolutePath) ? fs.statSync(absolutePath) : null
    if (stat && stat.size >= Number(process.env.BOOK_JPEG_THRESHOLD_KB || 300) * 1024) {
      // 带透明通道的 PNG 不能转 JPEG
      const alphaInfo = runToolCapture('sips', ['-g', 'hasAlpha', absolutePath])
      const hasAlpha = /hasAlpha:\s*yes/i.test(alphaInfo || '')
      if (!hasAlpha) {
        imageOptCounter += 1
        const jpegPath = path.join(
          getOptimizedAssetDir(),
          `opt-${String(imageOptCounter).padStart(4, '0')}.jpg`
        )
        const quality = String(process.env.BOOK_JPEG_QUALITY || '82')
        if (
          runTool('magick', [absolutePath, '-quality', quality, jpegPath]) ||
          runTool('convert', [absolutePath, '-quality', quality, jpegPath]) ||
          runTool('sips', [
            '-s',
            'format',
            'jpeg',
            '-s',
            'formatOptions',
            quality,
            absolutePath,
            '--out',
            jpegPath
          ])
        ) {
          if (fs.existsSync(jpegPath) && fs.statSync(jpegPath).size > 0) {
            const result = { path: jpegPath, ext: '.jpg' }
            prepareCache.set(sourcePath, result)
            return result
          }
        }
      }
    }
  }

  const result = { path: absolutePath, ext }
  prepareCache.set(sourcePath, result)
  return result
}

function collectAndRewriteImages(html, sourcePagePath, imageMap) {
  const imgPattern = /<img\s[^>]*src=["']([^"']+)["'][^>]*>/gi
  return html.replace(imgPattern, (match, src) => {
    if (src.startsWith('data:')) return match
    if (src.startsWith('http://') || src.startsWith('https://')) {
      const altMatch = match.match(/alt=["']([^"']*)["']/)
      const alt = altMatch ? altMatch[1] : f.fig
      return `<span class="external-image-placeholder">[${f.onlineImg}: ${escapeXml(alt)}]</span>`
    }
    const sourceDir = path.dirname(sourcePagePath)
    let absolutePath
    if (src.startsWith('/')) {
      absolutePath = path.join(docsDir, src)
    } else {
      absolutePath = path.resolve(sourceDir, decodeURIComponent(src))
    }
    if (!fs.existsSync(absolutePath)) return match
    let ext = path.extname(absolutePath).toLowerCase()
    const prepared = prepareBookImage(absolutePath, ext)
    absolutePath = prepared.path
    ext = prepared.ext
    const imageId = imageMap.get(absolutePath) || `img-${String(imageMap.size).padStart(4, '0')}${ext}`
    if (!imageMap.has(absolutePath)) imageMap.set(absolutePath, imageId)
    return match.replace(src, `../images/${imageId}`)
  })
}

function collectMarkdownImages(markdown, sourcePagePath, imageMap) {
  const imgPattern = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g
  const sourceDir = path.dirname(sourcePagePath)
  for (const m of markdown.matchAll(imgPattern)) {
    const src = m[2]
    if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) continue
    let absolutePath
    if (src.startsWith('/')) {
      absolutePath = path.join(docsDir, src)
    } else {
      absolutePath = path.resolve(sourceDir, decodeURIComponent(src))
    }
    if (!fs.existsSync(absolutePath)) continue
    let ext = path.extname(absolutePath).toLowerCase()
    const prepared = prepareBookImage(absolutePath, ext)
    absolutePath = prepared.path
    ext = prepared.ext
    if (!imageMap.has(absolutePath)) {
      imageMap.set(absolutePath, `img-${String(imageMap.size).padStart(4, '0')}${ext}`)
    }
  }
}

// --- ePub structure generation ---

function generateMimetype() {
  return 'application/epub+zip'
}

function generateContainerXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
}

function generateContentOpf(chapters, imageMap, pageCount, hasCoverImage) {
  const now = new Date().toISOString().replace(/\.\d+Z$/, 'Z')
  const manifestItems = [
    '    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
    '    <item id="style" href="style.css" media-type="text/css"/>',
    '    <item id="cover" href="chapters/cover.xhtml" media-type="application/xhtml+xml"/>',
    '    <item id="intro" href="chapters/intro.xhtml" media-type="application/xhtml+xml"/>',
    '    <item id="pub-note" href="chapters/publication-note.xhtml" media-type="application/xhtml+xml"/>'
  ]
  if (hasCoverImage) {
    manifestItems.push(
      '    <item id="cover-image" href="images/cover-image.png" media-type="image/png" properties="cover-image"/>',
      '    <item id="cover-logo" href="images/cover-logo.png" media-type="image/png"/>'
    )
  } else {
    manifestItems.push('    <item id="cover-logo" href="images/cover-logo.png" media-type="image/png" properties="cover-image"/>')
  }
  const spineItems = [
    '    <itemref idref="cover"/>',
    '    <itemref idref="intro"/>',
    '    <itemref idref="pub-note"/>'
  ]
  for (let i = 0; i < chapters.length; i++) {
    const id = `ch${String(i).padStart(3, '0')}`
    manifestItems.push(`    <item id="${id}" href="chapters/${id}.xhtml" media-type="application/xhtml+xml" properties="mathml"/>`)
    spineItems.push(`    <itemref idref="${id}"/>`)
  }
  for (const [, imageId] of imageMap) {
    const ext = path.extname(imageId).toLowerCase()
    const safeId = imageId.replace(/[^a-zA-Z0-9-]/g, '-')
    manifestItems.push(`    <item id="${safeId}" href="images/${imageId}" media-type="${mediaTypeForExt(ext)}"/>`)
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="book-id">${escapeXml(epubBookId)}</dc:identifier>
    <dc:title>${escapeXml(bookTitle)}</dc:title>
    <dc:creator>${escapeXml(bookAuthor)}</dc:creator>
    <dc:language>${lang}</dc:language>
    <dc:date>${now}</dc:date>
    <meta property="dcterms:modified">${now}</meta>
    <dc:description>${escapeXml(bookTagline)}</dc:description>
    <dc:rights>${escapeXml(bookLicense)}</dc:rights>
    <dc:publisher>${escapeXml(f.publisher)}</dc:publisher>
    <meta name="version" content="${escapeXml(bookVersion)}"/>
    <meta name="build-date" content="${escapeXml(localBuildDate)}"/>
    <meta name="page-count" content="${pageCount}"/>
  </metadata>
  <manifest>
${manifestItems.join('\n')}
  </manifest>
  <spine>
${spineItems.join('\n')}
  </spine>
</package>`
}

function generateNavXhtml(hierarchy) {
  const navItems = [
    `      <li><span>${escapeXml(f.tocFront)}</span>`,
    '        <ol>',
    `          <li><a href="chapters/cover.xhtml">${escapeXml(f.cover)}</a></li>`,
    `          <li><a href="chapters/intro.xhtml">${escapeXml(f.introTitle)}</a></li>`,
    `          <li><a href="chapters/publication-note.xhtml">${escapeXml(f.pubTitle)}</a></li>`,
    '        </ol>',
    '      </li>'
  ]
  for (const part of hierarchy) {
    navItems.push(`      <li><span>${escapeXml(part.title)}</span>`)
    navItems.push('        <ol>')
    for (const chapter of part.chapters) {
      navItems.push(`          <li><span>${escapeXml(chapter.title)}</span>`)
      if (chapter.pages.length) {
        navItems.push('            <ol>')
        for (const page of chapter.pages) {
          if (page._chapterId) {
            navItems.push(`              <li><a href="chapters/${page._chapterId}.xhtml">${escapeXml(page.title)}</a></li>`)
          }
        }
        navItems.push('            </ol>')
      }
      navItems.push('          </li>')
    }
    navItems.push('        </ol>')
    navItems.push('      </li>')
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(f.toc)}</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>${escapeXml(f.toc)}</h1>
    <ol>
${navItems.join('\n')}
    </ol>
  </nav>
</body>
</html>`
}

function generateStyleCss() {
  return `@charset "UTF-8";
body { font-family: "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", Georgia, serif; font-size: 1em; line-height: 1.7; color: #1a1a1a; margin: 1em; }
h1 { font-size: 1.8em; margin: 1.2em 0 0.6em; line-height: 1.2; }
h2 { font-size: 1.4em; margin: 1em 0 0.5em; line-height: 1.3; }
h3 { font-size: 1.2em; margin: 0.8em 0 0.4em; }
h4 { font-size: 1.05em; margin: 0.6em 0 0.3em; }
p { margin: 0.6em 0; }
pre { background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 4px; padding: 0.8em; font-size: 0.85em; line-height: 1.4; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word; }
code { font-family: "JetBrains Mono", "Fira Code", "Source Code Pro", monospace; font-size: 0.88em; background: #f0f0f0; padding: 0.1em 0.3em; border-radius: 3px; }
pre code { background: none; padding: 0; border-radius: 0; }
blockquote { margin: 0.8em 0; padding: 0.5em 1em; border-left: 3px solid #ccc; color: #555; }
img { max-width: 100%; height: auto; display: block; margin: 0.8em auto; }
table { border-collapse: collapse; width: 100%; margin: 0.8em 0; font-size: 0.9em; }
th, td { border: 1px solid #ddd; padding: 0.4em 0.6em; text-align: left; }
th { background: #f5f5f5; font-weight: bold; }
a { color: #1a237e; text-decoration: none; }
.booknote { background: #f5f7fa; border-left: 3px solid #2457a6; border-radius: 4px; padding: 0.6em 0.8em; margin: 0.8em 0; }
.booknote-title { font-weight: bold; font-size: 0.9em; color: #495057; margin: 0 0 0.4em; }
.output-block { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 0.6em 0.8em; margin: 0.8em 0; }
.output-title { font-weight: bold; font-size: 0.9em; color: #495057; margin: 0 0 0.4em; }
.mermaid-diagram { text-align: center; margin: 0.8em 0; }
.mermaid-diagram img { max-width: 100%; height: auto; }
.mermaid-placeholder { background: #f0f4ff; border: 1px dashed #7986cb; border-radius: 4px; padding: 0.6em 0.8em; margin: 0.8em 0; }
.mermaid-label { font-style: italic; color: #5c6bc0; margin: 0 0 0.4em; }
.mermaid-placeholder pre { font-size: 0.75em; color: #666; background: transparent; border: none; padding: 0; }
.math-block { text-align: center; margin: 1em 0; overflow-x: auto; }
section.footnotes { margin-top: 2em; padding-top: 1em; border-top: 1px solid #ddd; font-size: 0.85em; }
sup { font-size: 0.75em; }
.external-image-placeholder { display: block; background: #f0f4ff; border: 1px dashed #7986cb; border-radius: 4px; padding: 0.4em 0.8em; color: #5c6bc0; font-style: italic; text-align: center; margin: 0.8em 0; }
.cover-page { text-align: center; padding: 2em 1em; }
.cover-logo { max-width: 80%; max-height: 15em; margin: 0 auto 2em; }
.cover-page h1 { font-size: 2.2em; line-height: 1.1; color: #102033; }
.cover-subtitle { font-size: 1.3em; font-weight: bold; color: #344054; margin: 0.5em 0 0; }
.cover-meta { width: 90%; margin: 2em auto 0; border: none; font-size: 0.9em; }
.cover-meta td { border: none; padding: 0.3em 0.5em; vertical-align: top; }
.meta-label { color: #667085; font-size: 0.8em; font-weight: bold; letter-spacing: 0.06em; text-align: right; width: 30%; }
.meta-value { color: #212121; text-align: left; }
.cover-publisher { margin-top: 1.5em; color: #667085; font-size: 0.85em; }
`
}

function generateCoverXhtml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(f.cover)}</title>
  <link rel="stylesheet" href="../style.css"/>
</head>
<body class="cover-page">
  <img src="../images/cover-logo.png" alt="Easy-Vibe" class="cover-logo" />
  <h1>${escapeXml(bookTitle)}</h1>
  <p class="cover-subtitle">${escapeXml(bookSubtitle)}</p>
  <table class="cover-meta">
    <tr><td class="meta-label">${escapeXml(f.version)}</td><td class="meta-value">${escapeXml(bookVersion)}</td></tr>
    <tr><td class="meta-label">${escapeXml(f.authors)}</td><td class="meta-value">${escapeXml(bookAuthor)}</td></tr>
    <tr><td class="meta-label">${escapeXml(f.repository)}</td><td class="meta-value">${escapeXml(bookGithubUrl)}</td></tr>
    <tr><td class="meta-label">${escapeXml(f.build)}</td><td class="meta-value">${escapeXml(localBuildDate)}</td></tr>
  </table>
  <p class="cover-publisher">${escapeXml(f.publisher)}</p>
</body>
</html>`
}

function generateIntroXhtml(pageCount) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(f.introTitle)}</title>
  <link rel="stylesheet" href="../style.css"/>
</head>
<body>
  <h1>${escapeXml(f.introTitle)}</h1>
  <p>${escapeXml(bookTagline)}</p>
  <p>${escapeXml(f.introDesc)}</p>
  <p>${escapeXml(f.pageCount(pageCount))}</p>
</body>
</html>`
}

function generatePublicationNoteXhtml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(f.pubTitle)}</title>
  <link rel="stylesheet" href="../style.css"/>
</head>
<body>
  <h1>${escapeXml(f.pubTitle)}</h1>
  <p><strong>${escapeXml(f.version)}：</strong>${escapeXml(bookVersion)}，${escapeXml(f.build)}：${escapeXml(localBuildDate)}。</p>
  <p><strong>${escapeXml(f.authors)}：</strong>${escapeXml(bookAuthor)}。</p>
  <p><strong>${escapeXml(f.repository)}：</strong><a href="${escapeXml(bookGithubUrl)}">${escapeXml(bookGithubUrl)}</a></p>
  <p><strong>${escapeXml(f.online)}：</strong><a href="${escapeXml(pdfOnlineUrl)}">${escapeXml(pdfOnlineUrl)}</a></p>
  <h2>${escapeXml(f.licenseSection)}</h2>
  <p>${escapeXml(f.licenseText)}</p>
</body>
</html>`
}

function wrapChapterXhtml(title, bodyHtml) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" href="../style.css"/>
</head>
<body>
${bodyHtml}
</body>
</html>`
}

// --- Main build ---

async function main() {
  const config = await loadVitePressConfig()
  const stageSidebars = getStageSidebars(config, locale)
  const chunks = collectBookStructure(stageSidebars, locale)

  // 层级：part(stage) -> chapter -> pages
  const hierarchy = []
  let chapterIndex = 0
  const allPages = []

  for (const chunk of chunks) {
    if (chunk.type === 'part') {
      hierarchy.push({ title: chunk.title, label: chunk.title, chapters: [] })
      continue
    }
    if (chunk.type === 'chapter') {
      const part = hierarchy[hierarchy.length - 1]
      chapterIndex += 1
      const chapterObj = { title: chunk.title, stage: chunk.stage, pages: [] }
      for (const page of chunk.pages) {
        page._chapterIndex = chapterIndex
        chapterObj.pages.push(page)
        allPages.push(page)
      }
      if (part) part.chapters.push(chapterObj)
      continue
    }
  }

  console.log(`Found ${allPages.length} pages in stages 1-3 (excl. appendices)`)

  const imageMap = new Map()
  const md = createMarkdownRenderer(imageMap)
  const chapters = []
  const missingPages = []

  for (let i = 0; i < allPages.length; i++) {
    const page = allPages[i]
    const sourcePagePath = pagePathForLink(page.link, locale)
    if (!sourcePagePath) {
      missingPages.push(page.link)
      continue
    }
    const chapterId = `ch${String(chapters.length).padStart(3, '0')}`
    page._chapterId = chapterId

    let source = fs.readFileSync(sourcePagePath, 'utf8')
    source = transformVueComponents(stripScriptSetup(stripFrontmatter(source)), locale)
    source = looksLikeTopLevelJsLineFilter(source).trim()

    collectMarkdownImages(source, sourcePagePath, imageMap)

    let html = md.render(source)
    html = collectAndRewriteImages(html, sourcePagePath, imageMap)
    html = htmlToXhtml(html)

    chapters.push({ id: chapterId, title: page.title, html })
  }

  if (missingPages.length) {
    console.warn(`Warning: ${missingPages.length} pages not found: ${missingPages.slice(0, 5).join(', ')}${missingPages.length > 5 ? '...' : ''}`)
  }

  const linkMap = buildLinkMap(allPages)
  for (const chapter of chapters) {
    const page = allPages.find((p) => p._chapterId === chapter.id)
    chapter.html = rewriteInternalLinks(chapter.html, linkMap, page?.link || '')
  }

  console.log(`Rendered ${chapters.length} chapters, collected ${imageMap.size} images, mapped ${linkMap.size} internal links`)

  // 构建 EPUB
  fs.mkdirSync(distDir, { recursive: true })
  const output = fs.createWriteStream(epubOutputPath)
  const archive = new ZipArchive({ zlib: { level: 9 } })
  const archiveFinished = new Promise((resolve, reject) => {
    output.on('close', resolve)
    archive.on('error', reject)
  })
  archive.pipe(output)

  archive.append(generateMimetype(), { name: 'mimetype', store: true })
  archive.append(generateContainerXml(), { name: 'META-INF/container.xml' })

  const pageCount = chapters.length
  archive.append(generateContentOpf(chapters, imageMap, pageCount, false), { name: 'OEBPS/content.opf' })
  archive.append(generateNavXhtml(hierarchy), { name: 'OEBPS/nav.xhtml' })
  archive.append(generateStyleCss(), { name: 'OEBPS/style.css' })
  archive.append(generateCoverXhtml(), { name: 'OEBPS/chapters/cover.xhtml' })
  archive.append(generateIntroXhtml(pageCount), { name: 'OEBPS/chapters/intro.xhtml' })
  archive.append(generatePublicationNoteXhtml(), { name: 'OEBPS/chapters/publication-note.xhtml' })

  if (fs.existsSync(logoPath)) {
    archive.file(logoPath, { name: 'OEBPS/images/cover-logo.png' })
  }

  for (const chapter of chapters) {
    archive.append(wrapChapterXhtml(chapter.title, chapter.html), { name: `OEBPS/chapters/${chapter.id}.xhtml` })
  }

  let skippedImages = 0
  for (const [absolutePath, imageId] of imageMap) {
    if (!fs.existsSync(absolutePath)) { skippedImages++; continue }
    if (fs.statSync(absolutePath).size < 100) { skippedImages++; continue }
    archive.file(absolutePath, { name: `OEBPS/images/${imageId}` })
  }
  if (skippedImages > 0) console.warn(`Warning: Skipped ${skippedImages} invalid/empty images`)

  await archive.finalize()
  await archiveFinished

  cleanupMermaidAssets()
  cleanupConvertedAssets()
  cleanupOptimizedAssets()

  const sizeMb = fs.statSync(epubOutputPath).size / 1024 / 1024
  console.log(`Wrote ${epubOutputPath} (${sizeMb.toFixed(1)} MB)`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
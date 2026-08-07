#!/usr/bin/env node
/* global process */
import { spawn } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { LOCALES } from './book-shared.mjs'

const __filename = fileURLToPath(import.meta.url)
const rootDir = path.resolve(path.dirname(__filename), '..')

// 确保本地装的 TeX Live（macOS 下常放 ~/bin/tex）和常见 Ghostscript/ImageMagick
// 路径在子进程里也能找到，避免「xelatex not found」在交互式 shell 外随机出现。
function augmentPath() {
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
  if (prepend.length) {
    process.env.PATH = [...prepend, ...entries].join(path.delimiter)
  }
}
augmentPath()

const requestedLocale = process.argv[2] ? String(process.argv[2]).toLowerCase() : ''
const locales = requestedLocale
  ? [requestedLocale]
  : process.env.BOOK_LOCALES
    ? String(process.env.BOOK_LOCALES).split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    : LOCALES

const onlyPdf = process.env.BOOK_PDF_ONLY === '1'
const onlyEpub = process.env.BOOK_EPUB_ONLY === '1'

const jobs = []
for (const locale of locales) {
  if (!LOCALES.includes(locale)) {
    console.warn(`Skipping unsupported locale: ${locale}`)
    continue
  }
  if (!onlyEpub) {
    jobs.push({ locale, kind: 'pdf', script: 'build-latex-book.mjs', env: { PDF_LOCALE: locale } })
  }
  if (!onlyPdf) {
    jobs.push({ locale, kind: 'epub', script: 'build-epub.mjs', env: { EPUB_LOCALE: locale } })
  }
}

if (jobs.length === 0) {
  console.error('No build jobs to run.')
  process.exit(1)
}

function runJob(job) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['scripts/' + job.script], {
      cwd: rootDir,
      env: { ...process.env, ...job.env },
      stdio: ['ignore', 'inherit', 'inherit']
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${job.kind.toUpperCase()} build failed for ${job.locale} (exit ${code})`))
    })
  })
}

let failed = 0
for (const job of jobs) {
  const label = `[${job.kind.toUpperCase()}] ${job.locale}`
  try {
    process.stdout.write(`\n=== Building ${label} ===\n`)
    await runJob(job)
    process.stdout.write(`=== Done ${label} ===\n`)
  } catch (error) {
    failed += 1
    console.error(`=== Failed ${label} ===`)
    console.error(error.message)
  }
}

if (failed > 0) {
  console.error(`\n${failed}/${jobs.length} book build jobs failed.`)
  process.exit(1)
}
console.log(`\nAll ${jobs.length} book build jobs succeeded.`)
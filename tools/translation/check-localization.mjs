#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { dirname, extname, relative, resolve } from 'node:path'
import process from 'node:process'

const [sourceArg, localizedArg, ...extraArgs] = process.argv.slice(2)

if (!sourceArg || !localizedArg || extraArgs.length) {
  console.error(
    'Usage: node tools/translation/check-localization.mjs <source.md> <localized.md>'
  )
  process.exit(2)
}

const root = process.cwd()
const sourcePath = resolve(root, sourceArg)
const localizedPath = resolve(root, localizedArg)

for (const [label, file] of [
  ['Source', sourcePath],
  ['Localized file', localizedPath]
]) {
  if (!existsSync(file)) {
    console.error(`${label} not found: ${relative(root, file)}`)
    process.exit(2)
  }
}

const source = readFileSync(sourcePath, 'utf8')
const localized = readFileSync(localizedPath, 'utf8')
const failures = []
const passes = []

function pass(message) {
  passes.push(`PASS ${message}`)
}

function fail(message) {
  failures.push(`FAIL ${message}`)
}

function analyzeFences(markdown) {
  const blocks = []
  const outside = []
  let open = null

  for (const line of markdown.split(/\r?\n/)) {
    if (!open) {
      const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
      if (!match) {
        outside.push(line)
        continue
      }

      open = {
        marker: match[1][0],
        length: match[1].length,
        info: match[2].trim(),
        lines: []
      }
      outside.push('')
      continue
    }

    const close = line.match(/^\s*(`+|~+)\s*$/)
    if (
      close &&
      close[1][0] === open.marker &&
      close[1].length >= open.length
    ) {
      blocks.push({ info: open.info, body: open.lines.join('\n') })
      open = null
      outside.push('')
    } else {
      open.lines.push(line)
      outside.push('')
    }
  }

  return { blocks, outside: outside.join('\n'), unclosed: Boolean(open) }
}

function frontmatter(markdown) {
  const lines = markdown.split(/\r?\n/)
  if (lines[0] !== '---') return { present: false, closed: true, keys: [] }

  const end = lines.indexOf('---', 1)
  if (end === -1) return { present: true, closed: false, keys: [] }

  const keys = lines.slice(1, end).flatMap((line) => {
    const match = line.match(/^(\s*)([A-Za-z_][\w-]*):/)
    return match ? [`${match[1].length}:${match[2]}`] : []
  })
  return { present: true, closed: true, keys: keys.sort() }
}

function structure(markdown) {
  const result = { headings: [], bullets: 0, ordered: 0, tableRows: 0 }

  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s/)
    if (heading) result.headings.push(heading[1].length)
    if (/^\s*[-*+]\s+/.test(line)) result.bullets++
    if (/^\s*\d+\.\s+/.test(line)) result.ordered++
    if (/^\s*\|.*\|\s*$/.test(line)) result.tableRows++
  }

  return result
}

function references(markdown) {
  const images = []
  const links = []
  const pattern = /(!?)\[[^\]]*\]\(\s*([^\s)]+)[^)]*\)/g

  for (const match of markdown.matchAll(pattern)) {
    ;(match[1] ? images : links).push(match[2].replace(/^<|>$/g, ''))
  }

  return { images, links }
}

function inlineCode(markdown) {
  const values = new Map()
  for (const match of markdown.matchAll(/`([^`\n]+)`/g)) {
    values.set(match[1], (values.get(match[1]) ?? 0) + 1)
  }
  return [...values].sort(([a], [b]) => a.localeCompare(b))
}

function isExternal(reference) {
  return /^(?:[a-z]+:|#)/i.test(reference)
}

function localTargetExists(markdownPath, reference) {
  if (isExternal(reference)) return true

  const clean = reference.split(/[?#]/, 1)[0]
  if (!clean) return true

  const target = clean.startsWith('/')
    ? resolve(root, 'docs', clean.slice(1))
    : resolve(dirname(markdownPath), clean)

  if (existsSync(target)) return true
  if (!extname(target) && existsSync(`${target}.md`)) return true
  return !extname(target) && existsSync(resolve(target, 'index.md'))
}

function docsLocale(file) {
  const parts = relative(root, file).split(/[\\/]/)
  const docsIndex = parts.lastIndexOf('docs')
  return docsIndex === -1 ? null : parts[docsIndex + 1]
}

const sourceFences = analyzeFences(source)
const localizedFences = analyzeFences(localized)

if (sourceFences.unclosed || localizedFences.unclosed) {
  fail('an unclosed fenced code block was found')
} else if (
  JSON.stringify(sourceFences.blocks) !== JSON.stringify(localizedFences.blocks)
) {
  fail('fenced code blocks were changed, added, removed, or reordered')
} else {
  pass('fenced code blocks are preserved')
}

const sourceFrontmatter = frontmatter(source)
const localizedFrontmatter = frontmatter(localized)
if (!sourceFrontmatter.closed || !localizedFrontmatter.closed) {
  fail('frontmatter is not closed')
} else if (
  sourceFrontmatter.present !== localizedFrontmatter.present ||
  JSON.stringify(sourceFrontmatter.keys) !==
    JSON.stringify(localizedFrontmatter.keys)
) {
  fail('frontmatter keys were changed, added, or removed')
} else {
  pass('frontmatter keys are preserved')
}

const sourceStructure = structure(sourceFences.outside)
const localizedStructure = structure(localizedFences.outside)
if (JSON.stringify(sourceStructure) !== JSON.stringify(localizedStructure)) {
  fail('heading levels, list items, or table rows do not match the source')
} else {
  pass('heading and Markdown structure match the source')
}

const sourceReferences = references(sourceFences.outside)
const localizedReferences = references(localizedFences.outside)
const sourceLocale = docsLocale(sourcePath)
const localizedLocale = docsLocale(localizedPath)
const staleSourceLocaleLink =
  sourceLocale &&
  localizedLocale &&
  sourceLocale !== localizedLocale &&
  localizedReferences.links.some((reference) =>
    reference.includes(`/${sourceLocale}/`)
  )
if (sourceReferences.links.length !== localizedReferences.links.length) {
  fail('link count does not match the source')
} else if (staleSourceLocaleLink) {
  fail(`a localized link still points to the ${sourceLocale} locale`)
} else if (
  localizedReferences.links.some(
    (reference) => !localTargetExists(localizedPath, reference)
  )
) {
  fail('a localized link points to a missing file')
} else {
  pass('links are present and local targets exist')
}

if (sourceReferences.images.length !== localizedReferences.images.length) {
  fail('image count does not match the source')
} else if (
  localizedReferences.images.some(
    (reference) => !localTargetExists(localizedPath, reference)
  )
) {
  fail('a localized image points to a missing file')
} else {
  pass('images are present and local targets exist')
}

if (
  JSON.stringify(inlineCode(sourceFences.outside)) !==
  JSON.stringify(inlineCode(localizedFences.outside))
) {
  fail('inline code was changed, added, or removed')
} else {
  pass('inline code is preserved')
}

const localizedProse = localizedFences.outside.replace(/`[^`\n]+`/g, '')
const sourceLanguageRuns =
  localizedProse.match(/[\u3400-\u4DBF\u4E00-\u9FFF]{2,}/g) ?? []
if (sourceLanguageRuns.length) {
  fail(
    `possible untranslated Chinese text remains: ${sourceLanguageRuns.slice(0, 5).join(', ')}`
  )
} else {
  pass('no untranslated Chinese text was detected')
}

console.log([...passes, ...failures].join('\n'))
process.exit(failures.length ? 1 : 0)

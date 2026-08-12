import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const projectRoot = path.resolve(import.meta.dirname, '..')
const docsRoot = path.join(projectRoot, 'docs')
const sourceRoot = path.join(docsRoot, 'zh-cn', 'stage-1')
const supportedRasterExtensions = new Set(['.png', '.jpg', '.jpeg'])
const minimumSourceBytes = 200 * 1024
const maximumWidth = 1600
const maximumWebpDimension = 16_380

function walk(directory, predicate) {
  const matches = []

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) matches.push(...walk(absolutePath, predicate))
    else if (predicate(absolutePath)) matches.push(absolutePath)
  }

  return matches
}

function stage1MarkdownFiles() {
  return fs
    .readdirSync(docsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const stageRoot = path.join(docsRoot, entry.name, 'stage-1')
      return fs.existsSync(stageRoot)
        ? walk(stageRoot, (file) => file.endsWith('.md'))
        : []
    })
}

function resolveReference(markdownPath, reference) {
  const cleanReference = reference.trim().replace(/^<|>$/g, '').split(/[?#]/)[0]

  if (!cleanReference || /^(?:https?:|data:|#)/.test(cleanReference))
    return null

  if (cleanReference.startsWith('/')) {
    const sourcePath = path.join(docsRoot, cleanReference)
    return fs.existsSync(sourcePath)
      ? sourcePath
      : path.join(docsRoot, 'public', cleanReference)
  }

  return path.resolve(path.dirname(markdownPath), cleanReference)
}

function referencedStage1Images(markdownFiles) {
  const images = new Set()

  for (const markdownPath of markdownFiles) {
    const markdown = fs.readFileSync(markdownPath, 'utf8')
    const references = [
      ...markdown.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g),
      ...markdown.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)
    ]

    for (const match of references) {
      const imagePath = resolveReference(markdownPath, match[1])
      if (
        imagePath?.startsWith(`${sourceRoot}${path.sep}`) &&
        fs.existsSync(imagePath)
      ) {
        images.add(imagePath)
      }
    }
  }

  return images
}

function imageDimensions(imagePath) {
  const output = execFileSync(
    'sips',
    ['-g', 'pixelWidth', '-g', 'pixelHeight', imagePath],
    { encoding: 'utf8' }
  )
  const width = Number(output.match(/pixelWidth:\s+(\d+)/)?.[1])
  const height = Number(output.match(/pixelHeight:\s+(\d+)/)?.[1])

  if (!width || !height)
    throw new Error(`Could not read dimensions: ${imagePath}`)
  return { width, height }
}

function optimizedDimensions({ width, height }) {
  let scale = Math.min(1, maximumWidth / width)
  scale = Math.min(scale, maximumWebpDimension / height)

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  }
}

function replaceImageReferences(markdownPath, replacements) {
  const original = fs.readFileSync(markdownPath, 'utf8')
  let updated = original

  updated = updated.replace(
    /(!\[[^\]]*\]\()([^)\s]+)((?:\s+[^)]*)?\))/g,
    (full, prefix, reference, suffix) => {
      const resolved = resolveReference(markdownPath, reference)
      const replacement = resolved ? replacements.get(resolved) : null
      if (!replacement) return full
      return `${prefix}${reference.replace(/\.[^.\/?#]+(?=([?#]|$))/, '.webp')}${suffix}`
    }
  )

  updated = updated.replace(
    /(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,
    (full, prefix, reference, suffix) => {
      const resolved = resolveReference(markdownPath, reference)
      const replacement = resolved ? replacements.get(resolved) : null
      if (!replacement) return full
      return `${prefix}${reference.replace(/\.[^.\/?#]+(?=([?#]|$))/, '.webp')}${suffix}`
    }
  )

  if (updated !== original) fs.writeFileSync(markdownPath, updated)
}

function optimizeStaticImages(markdownFiles, referencedImages) {
  const replacements = new Map()

  for (const sourcePath of [...referencedImages].sort()) {
    const extension = path.extname(sourcePath).toLowerCase()
    if (!supportedRasterExtensions.has(extension)) continue
    if (fs.statSync(sourcePath).size < minimumSourceBytes) continue

    const outputPath = sourcePath.slice(0, -extension.length) + '.webp'
    const dimensions = optimizedDimensions(imageDimensions(sourcePath))

    execFileSync('cwebp', [
      '-quiet',
      '-q',
      '84',
      '-m',
      '6',
      '-sharp_yuv',
      '-resize',
      String(dimensions.width),
      String(dimensions.height),
      sourcePath,
      '-o',
      outputPath
    ])
    replacements.set(sourcePath, outputPath)
  }

  for (const markdownPath of markdownFiles) {
    replaceImageReferences(markdownPath, replacements)
  }

  return replacements
}

function optimizeAnimations(markdownFiles, referencedImages) {
  const replacements = new Map()

  for (const sourcePath of [...referencedImages].sort()) {
    if (path.extname(sourcePath).toLowerCase() !== '.gif') continue

    const outputPath = sourcePath.slice(0, -4) + '.webp'
    execFileSync('gif2webp', [
      '-quiet',
      '-q',
      '80',
      '-m',
      '6',
      '-mt',
      '-mixed',
      sourcePath,
      '-o',
      outputPath
    ])
    replacements.set(sourcePath, outputPath)
  }

  for (const markdownPath of markdownFiles) {
    replaceImageReferences(markdownPath, replacements)
  }

  return replacements
}

const markdownFiles = stage1MarkdownFiles()
const referencedImages = referencedStage1Images(markdownFiles)
const staticReplacements = optimizeStaticImages(markdownFiles, referencedImages)
const animationReplacements = optimizeAnimations(
  markdownFiles,
  referencedImages
)

console.log(
  `Optimized ${staticReplacements.size} static images and ${animationReplacements.size} animations.`
)

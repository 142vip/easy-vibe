import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import test from 'node:test'

const toolDir = dirname(fileURLToPath(import.meta.url))
const checker = resolve(toolDir, 'check-localization.mjs')
const fixtures = resolve(toolDir, 'fixtures')

function runFiles(source, localized) {
  return spawnSync(process.execPath, [checker, source, localized], {
    encoding: 'utf8'
  })
}

function runFixture(name) {
  const fixture = resolve(fixtures, name)
  return runFiles(
    resolve(fixture, 'source.md'),
    resolve(fixture, 'localized.md')
  )
}

test('accepts a structurally preserved localization', () => {
  const result = runFixture('pass')
  assert.equal(result.status, 0, result.stdout + result.stderr)
})

for (const [fixture, expectedFailure] of [
  ['fail-frontmatter', /FAIL frontmatter keys/],
  ['fail-structure', /FAIL heading levels/],
  ['fail-link', /FAIL a localized link/],
  ['fail-image', /FAIL a localized image/],
  ['fail-code-block', /FAIL fenced code blocks/],
  ['fail-inline-code', /FAIL inline code/],
  ['fail-source-text', /FAIL possible untranslated Chinese text/]
]) {
  test(`rejects the ${fixture} fixture`, () => {
    const result = runFixture(fixture)
    assert.equal(result.status, 1, result.stdout + result.stderr)
    assert.match(result.stdout, expectedFailure)
  })
}

test('rejects a link that still points to the source locale', () => {
  const fixture = resolve(fixtures, 'fail-source-locale', 'docs')
  const result = runFiles(
    resolve(fixture, 'zh-cn', 'source.md'),
    resolve(fixture, 'ko-kr', 'localized.md')
  )
  assert.equal(result.status, 1, result.stdout + result.stderr)
  assert.match(
    result.stdout,
    /FAIL a localized link still points to the zh-cn locale/
  )
})

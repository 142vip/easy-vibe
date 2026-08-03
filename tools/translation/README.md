# Localization checks

This directory contains tool-agnostic guidance and deterministic checks for
localized documentation. The checker does not translate content and does not
use an LLM.

## Usage

```bash
node tools/translation/check-localization.mjs \
  docs/zh-cn/path/to/index.md \
  docs/ko-kr/path/to/index.md
```

Exit codes:

- `0`: all checks passed
- `1`: the localization failed one or more checks
- `2`: invalid arguments or a missing input file

The checker compares:

- frontmatter keys
- heading levels, list items, and table rows
- Markdown link and image counts, including local target existence
- links that still point to the source locale
- fenced code blocks
- inline code
- possible untranslated Chinese text

It intentionally does not judge meaning, fluency, or translation quality.
Those require language review. Locale-specific contributor guidance lives in
the locale directory, for example `ko-kr/glossary.md` and
`ko-kr/style-guide.md`.

The source-text residue check currently targets Chinese source text, which is
the source language used by this repository.

## Fixtures

The fixtures include one passing document pair and focused failures for each
check: frontmatter, Markdown structure, links, images, fenced code blocks,
inline code, source-locale links, and untranslated Chinese text. Run them with
the built-in Node test runner:

```bash
node --test tools/translation/check-localization.test.mjs
```

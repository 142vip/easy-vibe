# scripts/

本项目用于构建和维护的 **生产级脚本**（已移除全部调试/中间脚本）。

## 保留的脚本

| 脚本 | 触发方式 | 作用 |
|---|---|---|
| `build-locales.mjs` | `npm run build` / `npm run build:locales` / `npm run build:force` | 多 locale 并行构建（5 组 locale，每组 2 种语言），并调用下方的 sitemap 脚本 |
| `generate-sitemap.mjs` | `npm run sitemap` / 被 `build-locales.mjs` 自动调用 | 生成 `sitemap.xml` 与 `robots.txt` |
| `scan-appendix-component-i18n.md`（引用见文档） | `node scripts/scan-appendix-component-i18n.mjs <locale1> <locale2>` | 附录组件的 i18n 翻译缺失扫描（对比两个 locale 的 `<template>` 文案） |

## 其它

- 标题清理等一次性调试脚本已从仓库移除，不再保留历史版本。
- 需要临时排查/清理请直接写一次性脚本并在提交前删除，不要落地到 `scripts/`。

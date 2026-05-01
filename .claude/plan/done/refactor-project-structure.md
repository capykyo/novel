---
title: 总计划：项目结构整理
date: 2026-05-01
status: done
---

# 总计划：项目结构整理

## 背景

代码审查发现 6 个结构性问题，涉及路由安全、目录边界、命名一致性。
按优先级拆分为 6 个独立子任务，每个子任务有独立计划文档。

## 子任务列表

| # | 问题 | 计划文档 | 优先级 | 状态 |
|---|------|----------|--------|------|
| 1 | 测试页面暴露生产路由 | [P1-guard-dev-pages.md](P1-guard-dev-pages.md) | 🔴 高 | pending |
| 2 | mock 文件命名未统一 | [P2-rename-mock-files.md](P2-rename-mock-files.md) | 🔴 高 | pending |
| 3 | `index.tsx` 职责不明 | [P3-fix-index-page.md](P3-fix-index-page.md) | 🟡 中 | pending |
| 4 | `utils/` 与 `lib/` 边界模糊 | [P4-reorganize-utils-lib.md](P4-reorganize-utils-lib.md) | 🟡 中 | pending |
| 5 | `dashboard` 命名语义不准 | [P5-rename-dashboard.md](P5-rename-dashboard.md) | 🟢 低 | pending |
| 6 | `components/` 根目录散落文件 | [P6-organize-components-root.md](P6-organize-components-root.md) | 🟢 低 | pending |

## 执行顺序原则

- P1、P2 互相独立，可并行；优先处理
- P3 独立，P1 之后进行（均涉及页面路由）
- P4 独立；但 P2 完成后（mock 路径稳定）再做，避免二次改动
- P5 依赖 P3（路由引用更新思路一致）；P3 完成后进行
- P6 最后做，不影响功能

## 完成标准

所有子任务完成后：
- `pnpm build` 无报错
- `pnpm test:ci` 通过
- 所有正常页面路由可访问
- `/first-visit-test`、`/model-test` 在生产模式下返回 404
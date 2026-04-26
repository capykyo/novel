# CLAUDE.md — novel

Next.js 15 · React 19 · TypeScript · Tailwind · Radix UI · LangChain/LangGraph · pnpm

## 命令

```bash
pnpm dev        # 开发服务器
pnpm build      # 生产构建（验证必跑）
pnpm lint
pnpm test:ci
```

## 开发流程

讨论 → 计划（写入 `.claude/plan/`）→ 实现 → 验证（`pnpm build` + 浏览器目测）→ 存档 → 下一轮

验证失败时：在 `.claude/plan/issues/<功能域>-<简述>.md` 记录问题 → 讨论 → 回到计划。
问题未解决前不存档。

详见 [.claude/docs/dev-process.md](.claude/docs/dev-process.md)

## 编码规范

详见 [.claude/docs/coding-guidelines.md](.claude/docs/coding-guidelines.md)

## 参考

- [技术栈 & 目录结构](.claude/docs/stack.md)
- [功能总览](.claude/plan/notes/features.md)

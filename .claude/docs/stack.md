# 技术栈 & 目录结构

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15（App Router / Pages Router 混用） |
| UI | React 19 + Tailwind CSS v3 + Radix UI |
| 动画 | Motion (Framer Motion v12) |
| AI | LangChain · LangGraph · OpenAI |
| 测试 | Vitest + Testing Library |
| 部署 | Vercel |

## src 目录

```
src/
  components/   # 可复用 UI 组件
  configs/      # 配置常量
  contexts/     # React Context
  hooks/        # 自定义 Hook
  layouts/      # 页面布局
  lib/          # 工具库封装
  pages/        # Next.js 页面路由
  styles/       # 全局样式
  types/        # TypeScript 类型定义
  utils/        # 纯工具函数
```

## .claude 目录

```
.claude/
  plan/
    notes/      # features.md · backend-integration-notes.md · dev-process-notes.md
    done/       # 已完成计划存档（只读）
    issues/     # 验证阶段问题文档（解决后移入 done/）
    （根目录）  # 进行中的设计文档
  docs/         # 参考文档（不随对话自动加载）
  memory/       # Claude 跨会话记忆
```

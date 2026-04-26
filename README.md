# 小说阅读器

通过 AI 解说 Agent 将小说章节内容转换为精简摘要，缩短阅读时间。

## 快速开始

```bash
pnpm install
pnpm dev       # 开发服务器（Turbopack）
pnpm build     # 生产构建
pnpm lint      # ESLint 检查
pnpm test:ci   # 单次运行全部测试
```

## 环境变量

在 `.env.local` 中配置：

```
OPENAI_API_KEY=sk-...      # 开发环境后备 Key（可选）
USE_MOCK_API=true          # 开启离线 Mock 服务
```

> 生产环境要求用户在设置页面自行填入 API Key，不依赖服务端环境变量。

## 离线开发（Mock 服务）

无网络或 API 不可用时，设置 `USE_MOCK_API=true` 后启动开发服务器，四个 API 端点将全部返回本地固定数据，无需真实网络请求。

**可选 Query 参数（调试用）：**

| 参数 | 说明 |
|------|------|
| `?delay=1000` | 模拟 1s 延迟 |
| `?error=1` | 触发错误响应，测试错误态 UI |

## 项目结构

```
src/
  pages/          # Next.js 页面和 API 路由
    api/          # 后端 API 处理器
  components/     # 可复用 UI 组件
  contexts/       # React Context（书籍、设置）
  hooks/          # 自定义 Hook
  lib/
    api/          # API 工具（apiKey、sse、mock）
    modelManager  # OpenAI 客户端封装
    apiClient     # Axios 实例
  utils/          # 纯工具函数
  types/          # TypeScript 类型定义

.claude/
  plan/           # 开发计划文档
  docs/           # 参考文档
```

## 测试

```bash
pnpm test        # watch 模式
pnpm test:ci     # 单次运行
```

覆盖范围：工具函数、Contexts、组件、API 处理器、页面集成测试（共 20 个文件，119 个用例）。

## CI/CD

**GitHub Actions**（`.github/workflows/ci.yml`）在 push / PR 到 `main` 或 `dev` 时自动执行：lint → test → build。

**Vercel** 只负责部署，只运行 `pnpm build`，详见 `VERCEL_CI.md`。

## 安全

- XSS 防护：`isomorphic-dompurify` 清理 HTML 后再渲染
- 全局错误边界：`ErrorBoundary` 包裹整个应用，防止页面崩溃
- API Key 隔离：生产环境强制使用客户端传入的 Key，不落地服务端

## 待办

- 阅读计时器（页面激活时计时，存 localStorage）
- 本地持久化存储
- 防沉迷设置（限制阅读时间，听书模式豁免）
- 搜书功能

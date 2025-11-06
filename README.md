# 一个小说网站

## 安全与稳健性

- XSS 防护：在 `src/pages/article.tsx` 使用 `isomorphic-dompurify` 对 HTML 内容进行清理后再通过 `dangerouslySetInnerHTML` 渲染。
- 错误边界：新增 `src/components/ErrorBoundary.tsx`，在 `src/pages/_app.tsx` 全局包裹，防止页面崩溃并显示兜底 UI。
- 本地存储抽象：新增 `src/utils/storage.ts`，统一封装 `get/set/remove`，处理 SSR 与 JSON 异常。
- API 调用统一：新增 `src/lib/apiClient.ts`（Axios 实例 + 统一错误处理），用于前端 `/api` 请求。
- 面包屑复用：新增 `src/components/comm/BreadcrumbNav.tsx`，替换重复面包屑实现。

## 测试

- 基础单测（Vitest + Testing Library）：
  - `storage`：`src/utils/__tests__/storage.test.ts`
  - `helper.cleanHtmlContent`：`src/utils/__tests__/helper.test.ts`
  - `usePagination` 冒烟测试：`src/utils/__tests__/paginationCache.test.ts`
  - `ErrorBoundary`：`src/components/__tests__/ErrorBoundary.test.tsx`
  - `textFormat`：`src/utils/__tests__/textFormat.test.ts`
  - `dateFormat`：`src/utils/__tests__/dateFormat.test.ts`
  - `localStorageHelper`：`src/utils/__tests__/localStorageHelper.test.ts`
  - `apiClient`：`src/lib/__tests__/apiClient.test.ts`
  - `BreadcrumbNav`：`src/components/comm/__tests__/BreadcrumbNav.test.tsx`
  - `BookContext`：`src/contexts/__tests__/BookContext.test.tsx`
  - `SettingsContext`：`src/contexts/__tests__/SettingsContext.test.tsx`

### 运行测试

```bash
# 开发模式（watch）
pnpm test

# CI 模式（单次运行）
pnpm test:ci
```

## CI/CD 集成

### GitHub Actions

项目已配置 GitHub Actions 工作流（`.github/workflows/ci.yml`），在以下情况自动运行：

- Push 到 `main` 或 `dev` 分支
- 创建 Pull Request 到 `main` 或 `dev` 分支

**工作流步骤：**
1. ✅ 代码检出
2. ✅ 安装依赖（pnpm）
3. ✅ 运行 Linter
4. ✅ 运行测试
5. ✅ 构建项目

**查看测试结果：**
- 在 GitHub 仓库的 Actions 标签页查看
- Pull Request 页面会显示测试状态

### Vercel 集成

**当前配置：GitHub Actions 运行测试，Vercel 只负责部署**

- ✅ GitHub Actions 自动运行测试和 lint
- ✅ Vercel 只运行 `pnpm build`（不运行测试）
- ✅ 测试结果在 GitHub Actions 和 Pull Request 中可见
- ✅ 部署速度更快（不等待测试）

**配置说明：**
- `vercel.json` 已配置，确保只运行构建命令
- 详细配置请参考 `VERCEL_CI.md`

## 环境变量

- `OPENAI_API_KEY`：OpenAI API 密钥（用于 AI 功能）
- 在 Vercel 或本地 `.env.local` 中配置

**注意：** 目前代码会从 `process.env.OPENAI_API_KEY` 读取，如果未配置会显示友好的错误提示。

- 将阅读时常缩短，从阅读原文 xxxx 字，缩短到阅读解说 xxxx 字

## 说明

- 通过 AI 引擎，使用解说 Agent，将小说内容转换为更易于理解的内容

## 待办列表

- 增加阅读时间计时器，页面激活时开始计时，页面不激活时停止计时，计时器存储在 localStorage 中

- 设置本地持久化存储

- 增加 AI 解说 Agent

- 防沉迷设置，限制阅读时间，当听书模式时，无防沉迷

- 搜书功能，从可支持的网站搜索小说

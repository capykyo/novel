# Refactor Plan: src/pages 文件名重构

## 当前状态

`src/pages` 下使用驼峰命名（camelCase）和连字符命名混用：

| 当前文件名 | 路由 URL |
|-----------|---------|
| `aireading.tsx` | `/aireading` |
| `bookshelf.tsx` | `/bookshelf` |
| `controlpanel.tsx` | `/controlpanel` |
| `settings.tsx` | `/settings` |
| `article.tsx` | `/article` |
| `model.tsx` | `/model` |
| `index.tsx` | `/` |
| `first-visit-test.tsx` | `/first-visit-test` |
| `api/bookInfo.ts` | `/api/bookInfo` |
| `api/fetchArticle.ts` | `/api/fetchArticle` |
| `api/fetchAiContent.ts` | `/api/fetchAiContent` |
| `api/aiReader.ts` | `/api/aiReader` |

## 目标状态

统一使用 **kebab-case（连字符命名）**，与 Next.js 社区惯例一致，URL 对用户友好：

| 新文件名 | 新路由 URL | 旧路由 URL |
|---------|----------|----------|
| `ai-reading.tsx` | `/ai-reading` | `/aireading` |
| `bookshelf.tsx` | 不变 | 不变 |
| `control-panel.tsx` | `/control-panel` | `/controlpanel` |
| `settings.tsx` | 不变 | 不变 |
| `article.tsx` | 不变 | 不变 |
| `model.tsx` | 不变 | 不变 |
| `index.tsx` | 不变 | 不变 |
| `first-visit-test.tsx` | 不变 | 不变 |
| `api/book-info.ts` | `/api/book-info` | `/api/bookInfo` |
| `api/fetch-article.ts` | `/api/fetch-article` | `/api/fetchArticle` |
| `api/fetch-ai-content.ts` | `/api/fetch-ai-content` | `/api/fetchAiContent` |
| `api/ai-reader.ts` | `/api/ai-reader` | `/api/aiReader` |

> 注：`bookshelf`、`settings`、`article`、`model`、`first-visit-test`、`index` 已符合规范，无需改动。

---

## 受影响文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/pages/aireading.tsx` | 重命名 → `ai-reading.tsx` | 路由变更为 `/ai-reading` |
| `src/pages/controlpanel.tsx` | 重命名 → `control-panel.tsx` | 路由变更为 `/control-panel` |
| `src/pages/api/bookInfo.ts` | 重命名 → `api/book-info.ts` | API 路由变更 |
| `src/pages/api/fetchArticle.ts` | 重命名 → `api/fetch-article.ts` | API 路由变更 |
| `src/pages/api/fetchAiContent.ts` | 重命名 → `api/fetch-ai-content.ts` | API 路由变更 |
| `src/pages/api/aiReader.ts` | 重命名 → `api/ai-reader.ts` | API 路由变更（SSE） |
| `src/pages/article.tsx` | 修改内容 | 更新 router.push 中的路由字符串 |
| `src/pages/aireading.tsx` | 修改内容 | 更新内部路由引用 |
| `src/pages/first-visit-test.tsx` | 修改内容 | 更新路由引用 |
| `src/components/layout/Header.tsx` | 检查 | 确认是否有路由引用 |
| `src/components/article/Book.tsx` | 检查 | `router.push('/article')` 不变 |
| `src/components/bookshelf/BookItem.tsx` | 检查 | `router.push('/article')` 不变 |
| `src/layouts/MainLayout.tsx` | 检查 | 可能有导航链接 |
| `src/pages/api/test/bookInfo.test.ts` | 修改 | 更新 API 调用路径 |

---

## 执行计划

### Phase 1：重命名页面文件

- [ ] 1.1 重命名 `src/pages/aireading.tsx` → `src/pages/ai-reading.tsx`
- [ ] 1.2 重命名 `src/pages/controlpanel.tsx` → `src/pages/control-panel.tsx`
- [ ] 验证：`pnpm build` 无报错，路由 `/ai-reading` 和 `/control-panel` 可访问

### Phase 2：重命名 API 路由文件

- [ ] 2.1 重命名 `src/pages/api/bookInfo.ts` → `src/pages/api/book-info.ts`
- [ ] 2.2 重命名 `src/pages/api/fetchArticle.ts` → `src/pages/api/fetch-article.ts`
- [ ] 2.3 重命名 `src/pages/api/fetchAiContent.ts` → `src/pages/api/fetch-ai-content.ts`
- [ ] 2.4 重命名 `src/pages/api/aiReader.ts` → `src/pages/api/ai-reader.ts`
- [ ] 验证：`pnpm build` 无报错

### Phase 3：更新路由引用字符串

更新所有 `router.push`、`href`、`fetch('/api/...')` 等硬编码字符串：

- [ ] 3.1 `src/pages/article.tsx` — 将 `/aireading` 改为 `/ai-reading`
- [ ] 3.2 `src/pages/ai-reading.tsx` — 将 `/aireading`、`/controlpanel` 改为 `/ai-reading`、`/control-panel`
- [ ] 3.3 `src/pages/first-visit-test.tsx` — 更新所有路由引用
- [ ] 3.4 `src/pages/index.tsx` — 将 `/controlpanel` 改为 `/control-panel`
- [ ] 3.5 `src/pages/bookshelf.tsx` — 检查是否有 `/controlpanel` 引用
- [ ] 3.6 `src/components/layout/Header.tsx` — 检查并更新导航链接
- [ ] 3.7 `src/layouts/MainLayout.tsx` — 检查并更新面包屑/导航链接
- [ ] 3.8 前端 `fetch` 调用 — 搜索所有 `/api/bookInfo`、`/api/fetchArticle`、`/api/fetchAiContent`、`/api/aiReader` 并更新

### Phase 4：更新测试文件

- [ ] 4.1 `src/pages/api/test/bookInfo.test.ts` — 更新测试中的 API 路径
- [ ] 验证：`pnpm test:ci` 通过

### Phase 5：最终验证

- [ ] 5.1 `pnpm build` 完整构建通过
- [ ] 5.2 浏览器逐一访问所有新路由，确认正常
- [ ] 5.3 确认旧路由（如 `/aireading`）已不可访问（404）

---

## 回滚方案

若某步骤失败：

1. `git diff` 查看具体变更
2. `git checkout -- <file>` 恢复单个文件
3. 若多个文件已变更：`git stash` 暂存，回到已知可用状态
4. 定位问题后重新执行对应 Phase

---

## 风险点

| 风险 | 缓解措施 |
|------|---------|
| 遗漏某处硬编码路由字符串 | Phase 3 前用 `grep -r` 全局搜索所有旧路由名 |
| API 路由变更导致前端调用失败 | Phase 2 和 3 同步执行，build 验证 |
| SSE 流式接口 `/api/aiReader` 引用分散 | 重点搜索 `EventSource` 构造调用 |
| Git 重命名被识别为删除+新增 | 使用 `git mv` 而非手动删除，保留历史 |

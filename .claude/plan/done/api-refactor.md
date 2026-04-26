---
title: API 层重构
date: 2026-04-26
status: done
---

## Refactor Plan: API 层重构

### Current State

`src/pages/api/` 包含 4 个处理器：

| 文件 | 职责 | 响应方式 |
|------|------|----------|
| `bookInfo.ts` | 爬取书籍信息 | JSON |
| `fetchArticle.ts` | 爬取章节内容 | JSON |
| `fetchAiContent.ts` | AI 处理（非流式） | JSON |
| `aiReader.ts` | AI 摘要（流式），内部调用 fetchArticle | SSE |

**主要问题：**
1. API Key 验证逻辑在 `aiReader.ts` 和 `fetchAiContent.ts` 中各写了一遍
2. OpenAI 调用方式不统一：`aiReader.ts` 直接用 SDK，`fetchAiContent.ts` 用 `Client` 包装类
3. "不支持的网站"错误响应在 `bookInfo.ts` 和 `fetchArticle.ts` 中各写了一遍
4. SSE 响应头在 `aiReader.ts` 中内联，没有封装
5. 缺少 HTTP 方法验证（`aiReader.ts`、`bookInfo.ts`、`fetchArticle.ts` 均未校验）
6. 只有 `bookInfo` 有测试

### Target State

提取共享逻辑到 `src/pages/api/_lib/`，各处理器保持精简，专注业务逻辑。

```
src/pages/api/
  _lib/
    apiKey.ts       # resolveApiKey(req) — 统一 API Key 解析与验证
    errors.ts       # unsupportedSite() — 统一错误响应工具
    sse.ts          # setSseHeaders(res) — SSE 响应头设置
  aiReader.ts       # 使用 Client 包装类，使用 _lib/
  bookInfo.ts       # 使用 _lib/errors
  fetchArticle.ts   # 使用 _lib/errors
  fetchAiContent.ts # 使用 _lib/apiKey
  test/
    ...             # 补充缺失的测试
```

### Affected Files

| 文件 | 变更类型 | 说明 |
|------|----------|------|
| `_lib/apiKey.ts` | 新建 | 提取 API Key 验证逻辑 |
| `_lib/errors.ts` | 新建 | 提取 unsupportedSite 错误响应 |
| `_lib/sse.ts` | 新建 | 提取 SSE 响应头设置 |
| `aiReader.ts` | 修改 | 改用 Client 包装类；引用 _lib |
| `bookInfo.ts` | 修改 | 引用 _lib/errors；补充方法验证 |
| `fetchArticle.ts` | 修改 | 引用 _lib/errors；补充方法验证 |
| `fetchAiContent.ts` | 修改 | 引用 _lib/apiKey；补充方法验证 |
| `test/bookInfo.test.ts` | 保持 | 现有测试继续通过 |

### Execution Plan

#### Phase 1: 新建 `_lib/` 工具模块
- [ ] 1.1 新建 `_lib/apiKey.ts`
  ```ts
  // resolveApiKey(req): string | null
  // 生产环境取 body/query 中的 apiKey，开发环境后备 env
  ```
- [ ] 1.2 新建 `_lib/errors.ts`
  ```ts
  // unsupportedSite(res): void — 返回 400 + 支持站点列表
  ```
- [ ] 1.3 新建 `_lib/sse.ts`
  ```ts
  // setSseHeaders(res): void — 设置 Content-Type / Cache-Control / Connection
  ```
- [ ] Verify: `pnpm build` 通过（新文件无 TS 错误）

#### Phase 2: 修改处理器
- [ ] 2.1 `bookInfo.ts` — 替换内联的 unsupportedSite 逻辑为 `_lib/errors`；补充 `if (req.method !== 'GET')` 检查
- [ ] 2.2 `fetchArticle.ts` — 同上
- [ ] 2.3 `fetchAiContent.ts` — 替换内联的 API Key 验证为 `_lib/apiKey`
- [ ] 2.4 `aiReader.ts` — 替换直接 OpenAI 调用为 `Client` 包装类；替换内联 SSE 头为 `_lib/sse`；替换 API Key 验证为 `_lib/apiKey`
- [ ] Verify: `pnpm build` 通过；手动请求各接口确认响应正常

#### Phase 3: 测试
- [ ] 3.1 确认 `test/bookInfo.test.ts` 仍通过：`pnpm test:ci`
- [ ] 3.2 补充 `fetchArticle` 基础测试（参数验证分支）
- [ ] Verify: `pnpm test:ci` 全部通过

#### Phase 4: 清理
- [ ] 4.1 删除各处理器中已被 `_lib` 替代的重复代码段
- [ ] 4.2 确认 `_lib/` 下没有未使用的导出
- [ ] Verify: `pnpm build && pnpm lint` 通过

### Rollback Plan

每个 Phase 完成后可独立回滚：
1. Phase 1 失败：删除 `_lib/` 目录，无影响
2. Phase 2 失败：`git checkout src/pages/api/<file>.ts` 恢复单个文件
3. Phase 3/4 失败：`git stash` 回到 Phase 2 完成点

### Risks

- `aiReader.ts` 改用 `Client` 包装类后，需确认 `Client` 支持流式调用（`stream: true`）；若不支持需先扩展 `modelManager.ts`，该工作应在 Phase 2.4 前确认
- `_lib` 目录以 `_` 开头，Next.js 会忽略其路由注册，不会暴露为 API 端点（预期行为）

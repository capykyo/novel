# P4：整理 utils/ 与 lib/ 目录边界

## 问题

`utils/` 和 `lib/` 职责交叉：
- `utils/` 里混有 React Hook（`useAIReading.ts`, `paginationCache.ts`）
- `lib/` 里有纯工具函数（`utils.ts` 即 `cn()`）
- `hooks/` 目录只有 `use-toast.ts`，没有发挥聚合作用

## 目标状态

| 目录 | 职责 | 内容 |
|------|------|------|
| `hooks/` | 所有自定义 React Hook | `useAIReading`, `usePagination`(from paginationCache), `use-toast` |
| `utils/` | 纯工具函数（无 React 依赖） | `storage`, `dateFormat`, `textFormat`, `helper`, `localStorageHelper` |
| `lib/` | 第三方库封装和客户端实例 | `apiClient`, `modelManager`, `utils`(cn), `api/`, `models/` |

> `lib/utils.ts`（cn 函数）保持原位，因为这是 shadcn/ui 的约定路径，移动会破坏所有 ui 组件的导入。

## 受影响文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/utils/useAIReading.ts` | 移动 → `src/hooks/useAIReading.ts` | React Hook |
| `src/utils/paginationCache.ts` | 移动 → `src/hooks/usePaginationCache.ts` | React Hook，顺手加 `use` 前缀 |
| 所有 import `utils/useAIReading` 的文件 | 修改 import 路径 | 全局搜索替换 |
| 所有 import `utils/paginationCache` 的文件 | 修改 import 路径 | 全局搜索替换 |

## 执行步骤

- [ ] 1. 全局搜索 `utils/useAIReading` 和 `utils/paginationCache` 的所有引用
- [ ] 2. `git mv src/utils/useAIReading.ts src/hooks/useAIReading.ts`
- [ ] 3. `git mv src/utils/paginationCache.ts src/hooks/usePaginationCache.ts`
- [ ] 4. 检查 `paginationCache.ts` 内部导出名，确认是否需要同步重命名导出
- [ ] 5. 更新所有 import 路径
- [ ] 6. `pnpm build` 验证
- [ ] 7. `pnpm test:ci` 验证

## 排除的方案

- **移动 `lib/utils.ts`**：shadcn/ui 组件硬编码 `@/lib/utils` 路径，改动成本过高，收益为零
- **重命名 `paginationCache` → `usePaginationCache`**：文件已有 `use` 前缀的导出 Hook，顺手对齐；若内部导出名不一致则只改文件名

## 验证标准

- `pnpm build` 无报错
- `pnpm test:ci` 通过
- `src/utils/` 下无 React Hook 文件
- `src/hooks/` 包含全部 Hook

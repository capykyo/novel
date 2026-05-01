# P2：mock 文件命名统一为 kebab-case

## 问题

`src/lib/api/mock/` 下的文件仍使用驼峰命名，与已完成的 kebab-case 重构不一致：

```
lib/api/mock/bookInfo.ts        → book-info.ts
lib/api/mock/fetchArticle.ts    → article-content.ts
lib/api/mock/fetchAiContent.ts  → ai-summary.ts
lib/api/mock/aiReader.ts        → ai-reader.ts
```

新名称与对应的真实 API 文件名对齐（`pages/api/` 下的命名），语义更准确。

## 受影响文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/lib/api/mock/bookInfo.ts` | 重命名 → `book-info.ts` | |
| `src/lib/api/mock/fetchArticle.ts` | 重命名 → `article-content.ts` | |
| `src/lib/api/mock/fetchAiContent.ts` | 重命名 → `ai-summary.ts` | |
| `src/lib/api/mock/aiReader.ts` | 重命名 → `ai-reader.ts` | |
| 导入这些文件的模块 | 修改 import 路径 | 需全局搜索 |

## 执行步骤

- [ ] 1. 全局搜索所有对这 4 个文件的 import 引用
- [ ] 2. `git mv` 重命名 4 个文件
- [ ] 3. 更新所有 import 路径
- [ ] 4. `pnpm build` 验证

## 验证标准

- `pnpm build` 无报错
- `pnpm test:ci` 通过
- `src/lib/api/mock/` 下无驼峰命名文件

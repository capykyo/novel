# P6：整理 components/ 根目录散落文件

## 问题

`src/components/` 根目录有 8 个散落文件，没有归类：

```
GlobalSettingsButton.tsx
EstimatedReadingTime.tsx
ReadingDuration.tsx
TimeSaving.tsx
TimeSavingStats.tsx
MarkdownRenderer.tsx
SettingsDisplay.tsx
CustomHeading.tsx
ErrorBoundary.tsx
```

## 目标状态

按语义归入子目录，规则如下：

| 文件 | 目标目录 | 理由 |
|------|---------|------|
| `EstimatedReadingTime.tsx` | `components/reading/` | 阅读体验相关 |
| `ReadingDuration.tsx` | `components/reading/` | 阅读体验相关 |
| `TimeSaving.tsx` | `components/reading/` | 阅读统计相关 |
| `TimeSavingStats.tsx` | `components/reading/` | 阅读统计相关 |
| `MarkdownRenderer.tsx` | `components/reading/` | 阅读内容渲染 |
| `CustomHeading.tsx` | `components/reading/` | 阅读内容排版 |
| `GlobalSettingsButton.tsx` | `components/layout/` | 全局布局级别按钮 |
| `SettingsDisplay.tsx` | `components/settings/` | 设置相关展示 |
| `ErrorBoundary.tsx` | `components/comm/` | 通用基础组件 |

新建 `components/reading/` 目录，加 `index.ts` 统一导出。

## 受影响文件

| 文件 | 变更类型 |
|------|---------|
| 上述 9 个文件 | 移动到对应子目录 |
| 所有 import 这些组件的文件 | 修改 import 路径 |
| `components/layout/index.ts` | 添加 `GlobalSettingsButton` 导出 |
| `components/settings/index.ts` | 添加 `SettingsDisplay` 导出 |
| `components/comm/index.ts` | 添加 `ErrorBoundary` 导出 |
| `components/reading/index.ts` | 新建，导出所有 reading 组件 |

## 执行步骤

- [ ] 1. 全局搜索每个文件的 import 引用，记录受影响页面/组件
- [ ] 2. 新建 `src/components/reading/` 目录
- [ ] 3. `git mv` 移动 6 个 reading 相关文件
- [ ] 4. `git mv GlobalSettingsButton.tsx components/layout/`
- [ ] 5. `git mv SettingsDisplay.tsx components/settings/`
- [ ] 6. `git mv ErrorBoundary.tsx components/comm/`
- [ ] 7. 创建 `components/reading/index.ts` 导出文件
- [ ] 8. 更新各 `index.ts` 的导出
- [ ] 9. 更新所有 import 路径
- [ ] 10. `pnpm build` 验证

## 验证标准

- `pnpm build` 无报错
- `pnpm test:ci` 通过
- `src/components/` 根目录无业务组件文件（只保留 `__tests__/` 等基础目录）

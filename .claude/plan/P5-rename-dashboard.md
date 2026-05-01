# P5：dashboard 页面重命名

## 问题

`src/pages/dashboard.tsx` 实际内容是"阅读时间统计 + Bento 卡片功能展示"，
语义上更接近统计/概览页，而非操作控制台（dashboard 通常暗示有操作能力）。

历史原因：前身是 `controlpanel.tsx`，重命名为 `dashboard` 后语义仍不够准确。

## 目标

重命名为 `stats.tsx`，路由变为 `/stats`。

## 受影响文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/pages/dashboard.tsx` | 重命名 → `src/pages/stats.tsx` | 路由变更为 `/stats` |
| 所有引用 `/dashboard` 路由的文件 | 修改路由字符串 | 全局搜索 |

## 执行步骤

- [ ] 1. 全局搜索 `/dashboard` 路由引用（`router.push`、`href`、`pathname`、`Link`）
- [ ] 2. `git mv src/pages/dashboard.tsx src/pages/stats.tsx`
- [ ] 3. 更新所有路由引用字符串
- [ ] 4. 检查 `MainLayout.tsx` 中是否有对 `/dashboard` 的特判逻辑
- [ ] 5. `pnpm build` 验证
- [ ] 6. 浏览器验证 `/stats` 可访问，`/dashboard` 返回 404

## 验证标准

- `pnpm build` 无报错
- `/stats` 路由正常访问
- `/dashboard` 返回 404

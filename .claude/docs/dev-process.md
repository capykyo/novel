# 开发流程

## 步骤

1. **讨论** — 理解需求，澄清边界，确认方案
2. **计划** — 写入 `.claude/plan/`，包含：目标、方案、受影响文件、排除的替代方案
3. **实现** — 严格在计划范围内编码，不添加计划外功能或抽象
4. **验证** — `pnpm build` 通过 + 浏览器核心路径目测
5. **存档** — 计划文档加 front matter 后移入 `done/`，更新 `notes/features.md`
6. **下一轮** — 回到第 1 步

## 验证分支

```
pnpm build + 浏览器目测
  ├─ 通过 → 存档
  └─ 失败 → .claude/plan/issues/<功能域>-<简述>.md
             （记录：现象 · 影响范围 · 优先级）
           → 讨论方案 → 回到第 2 步
```

问题未解决前不进入存档。

## 存档操作

1. 在计划文档顶部加 front matter：
   ```yaml
   ---
   title: <功能名>
   date: YYYY-MM-DD
   status: done
   ---
   ```
2. 移入 `.claude/plan/done/`
3. 更新 `.claude/plan/notes/features.md`

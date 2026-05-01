---
title: P3：修正 index.tsx 职责
date: 2026-05-01
status: done
---

# P3：修正 index.tsx 职责

## 问题

当前 `/` 首页展示的是 Demo 性质的按钮/主题示例，对真实用户没有价值。
真正的用户入口是 `/bookshelf`（书架）。

## 目标

首页作为用户起点，直接引导到书架。

## 方案

将 `index.tsx` 改为服务端重定向到 `/bookshelf`。

选择重定向而非保留落地页的原因：当前项目是工具型应用，没有需要对外介绍的落地页内容；
保留 Demo 内容意义不大，重定向是最简洁的解法。若未来需要落地页再拆出。

## 受影响文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/pages/index.tsx` | 修改 | 替换为重定向到 `/bookshelf` |

## 执行步骤

- [ ] 1. 读取当前 `index.tsx` 内容，确认无需保留的逻辑
- [ ] 2. 将文件内容替换为：
  ```tsx
  export { default } from "./bookshelf";

  export const getServerSideProps = () => ({
    redirect: { destination: "/bookshelf", permanent: false },
  });
  ```
  或更简洁的纯重定向形式（无需默认导出组件）：
  ```tsx
  const IndexPage = () => null;
  export default IndexPage;

  export const getServerSideProps = () => ({
    redirect: { destination: "/bookshelf", permanent: false },
  });
  ```
- [ ] 3. `pnpm build` 验证
- [ ] 4. 浏览器验证：访问 `/` 自动跳转到 `/bookshelf`

## 验证标准

- `pnpm build` 无报错
- 访问 `/` 重定向到 `/bookshelf`
- 书架页正常显示
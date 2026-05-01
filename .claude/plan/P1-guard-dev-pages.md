# P1：测试页面暴露生产路由

## 问题

`src/pages/first-visit-test.tsx` 和 `src/pages/model-test.tsx` 是开发调试页面，
但作为正式 Next.js 页面路由存在，生产构建会将它们暴露为 `/first-visit-test` 和 `/model-test`。

## 目标

非 development 环境访问这两个路由时返回 404，不改动文件位置（避免影响开发体验）。

## 方案

在两个文件中各加一个 `getServerSideProps`，生产环境返回 `{ notFound: true }`。

选择此方案而非移动文件的原因：移动到 `pages/dev/` 子目录会改变路由路径，
而开发者已习惯当前路径；守卫方式改动最小，且开发环境完全无感知。

## 受影响文件

| 文件 | 变更类型 | 说明 |
|------|---------|------|
| `src/pages/first-visit-test.tsx` | 修改 | 添加 `getServerSideProps` 环境守卫 |
| `src/pages/model-test.tsx` | 修改 | 添加 `getServerSideProps` 环境守卫 |

## 执行步骤

- [ ] 1. 读取 `first-visit-test.tsx`，确认是否已有 `getServerSideProps`
- [ ] 2. 在文件末尾添加：
  ```ts
  export const getServerSideProps = () => {
    if (process.env.NODE_ENV !== "development") {
      return { notFound: true };
    }
    return { props: {} };
  };
  ```
- [ ] 3. 对 `model-test.tsx` 重复同样操作
- [ ] 4. `pnpm build` 验证构建通过
- [ ] 5. 浏览器验证：开发模式可访问；（build 后）生产模式返回 404

## 验证标准

- `pnpm build` 无报错
- 开发模式：`/first-visit-test`、`/model-test` 正常访问
- `NODE_ENV=production` 时两个路由返回 404

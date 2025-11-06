# Vercel 配置说明

## 当前配置：GitHub Actions 运行测试，Vercel 只负责部署

### 架构说明

- **GitHub Actions**：运行测试、lint 和构建验证
- **Vercel**：只负责部署（不运行测试）

### Vercel 配置

项目已配置 `vercel.json`，确保 Vercel 只运行构建命令：

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```

**重要：** Vercel 不会运行测试，测试由 GitHub Actions 负责。

### GitHub Actions 工作流

GitHub Actions 会在以下情况自动运行：

1. ✅ Push 到 `main` 或 `dev` 分支
2. ✅ 创建 Pull Request

**工作流步骤：**
1. 代码检出
2. 安装依赖
3. 运行 Linter
4. 运行测试（`pnpm test:ci`）
5. 构建验证

**如果测试失败：**
- GitHub Actions 会标记为失败
- Pull Request 会显示失败状态
- Vercel 仍然可以部署（如果需要阻止，可以在 Vercel 设置中配置）

### 阻止 Vercel 在测试失败时部署（可选）

如果需要确保测试通过后才部署，可以在 Vercel 项目设置中：

1. Settings → Git → Ignored Build Step
2. 添加条件：
   ```bash
   git diff HEAD^ HEAD --quiet .github/workflows/ci.yml || exit 1
   ```

或者使用 Vercel CLI 配置：
```bash
vercel env add VERCEL_IGNORE_BUILD_STEP
# 值设置为：检查 GitHub Actions 状态
```

### 环境变量

在 Vercel 中设置以下环境变量：
- `OPENAI_API_KEY`: OpenAI API 密钥（用于运行时）

**注意：** GitHub Actions 构建验证使用 `dummy-key-for-build`，不会使用真实 API Key。

### 优势

✅ **分离关注点**：测试和部署分离  
✅ **更快的部署**：Vercel 不需要运行测试，部署更快  
✅ **更好的可见性**：测试结果在 GitHub 清晰可见  
✅ **灵活控制**：可以独立控制测试和部署流程  

### 查看测试结果

- **GitHub Actions**：仓库 → Actions 标签页
- **Pull Request**：页面底部显示测试状态徽章
- **本地运行**：`pnpm test:ci`



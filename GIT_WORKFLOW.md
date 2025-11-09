# Git 工作流程最佳实践 - 避免合并冲突

## 冲突产生的原因

### 常见冲突场景

#### 场景 1：Fork 与主仓库的冲突

从之前的 rebase 冲突来看，主要原因有：

1. **并行开发**：主仓库（upstream/dev）和你的 fork（ubdmf/dev）同时对相同的文件进行了修改
2. **长时间未同步**：在开发新功能期间，没有及时同步主仓库的最新更改
3. **修改相同区域**：两个分支都修改了 `GlobalSettingsButton.tsx`、`controlpanel.tsx` 和 `first-visit-test.tsx` 的相同部分

#### 场景 2：Master 与 Dev 分支的冲突

**案例：将 dev 合并到 master 时的冲突**

在将 `dev` 分支合并到 `master` 分支时，我们遇到了以下冲突：

**冲突文件：**

1. `src/components/GlobalSettingsButton.tsx`
2. `src/pages/controlpanel.tsx`
3. `src/pages/first-visit-test.tsx`

**冲突原因分析：**

1. **分支分离时间过长**：

   - `master` 分支停留在较旧的版本
   - `dev` 分支持续开发新功能
   - 两个分支对相同文件进行了不同的修改

2. **功能演进差异**：

   - **GlobalSettingsButton.tsx**：
     - `master`：使用 `onClick` 和 `theme === "day"`（旧版本）
     - `dev`：使用 `onSelect` + `preventDefault` 和 `theme === "light"`（新版本，已修复）
   - **controlpanel.tsx**：
     - `master`：显示"更换新书"（旧功能描述）
     - `dev`：显示"管理书架"（新功能描述，更详细）
   - **first-visit-test.tsx**：
     - `master`：没有环境限制（所有环境可访问）
     - `dev`：添加了 `getServerSideProps` 限制（仅开发环境可访问）

3. **代码改进未同步**：
   - `dev` 分支包含了 bug 修复（如主题值从 "day" 改为 "light"）
   - `dev` 分支包含了功能增强（如防止菜单关闭的 `preventDefault`）
   - `dev` 分支包含了安全改进（如环境限制）

**解决方案：**

- 保留 `dev` 分支的版本，因为：
  - ✅ 包含最新的 bug 修复
  - ✅ 包含功能改进
  - ✅ 包含安全增强
  - ✅ 代码质量更高

**如何避免此类冲突：**

1. **定期将 dev 合并到 master**：

   ```bash
   # 定期（如每周）将 dev 合并到 master
   git checkout master
   git merge dev
   git push origin master
   ```

2. **使用发布流程**：

   发布流程是一种标准化的软件发布方法，确保代码质量和版本管理的一致性。

   **基本发布流程：**

   ```bash
   # 1. 在 dev 分支完成功能开发和测试
   git checkout dev
   # ... 开发和测试 ...

   # 2. 准备发布时，创建发布分支（可选，用于最终测试）
   git checkout -b release/v1.0.0
   # 进行最终测试和 bug 修复

   # 3. 将发布分支合并到 master
   git checkout master
   git merge release/v1.0.0

   # 4. 在 master 上打标签标记版本
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin master --tags

   # 5. 将 master 的更改合并回 dev（保持同步）
   git checkout dev
   git merge master
   ```

   **发布流程的好处：**

   - ✅ 版本管理清晰：每个版本都有明确的标签
   - 便于回滚：如果新版本有问题，可以快速回退到上一个标签
   - 历史追踪：可以清楚地看到每个版本的发布时间和内容
   - 生产稳定：`master` 分支始终保持可部署状态

3. **保持 master 稳定**：

   - `master` 分支应该始终是可部署的稳定版本
   - 新功能在 `dev` 分支开发
   - 只有经过测试的功能才合并到 `master`

4. **使用 Git Flow 工作流**：

   Git Flow 是一种流行的 Git 分支管理模型，由 Vincent Driessen 提出。它定义了不同类型的分支和它们的使用场景。

   **分支结构：**

   ```
   master (生产环境，稳定版本)
     ↑
   release/* (发布分支，用于准备新版本)
     ↑
   dev (开发环境，集成分支)
     ↑
   feature/* (功能分支，开发新功能)
     ↑
   hotfix/* (热修复分支，紧急修复生产问题)
   ```

   **各分支说明：**

   - **master 分支**：

     - 生产环境的代码
     - 只接受来自 `release` 或 `hotfix` 的合并
     - 每次合并都应该打标签（tag）

   - **dev 分支**：

     - 开发环境的集成分支
     - 所有功能开发完成后合并到这里
     - 用于日常开发和测试

   - **feature/\* 分支**：

     - 从 `dev` 分支创建
     - 用于开发新功能
     - 完成后合并回 `dev`
     - 命名示例：`feature/user-authentication`、`feature/payment-integration`

   - **release/\* 分支**：

     - 从 `dev` 分支创建
     - 用于准备新版本发布
     - 只进行 bug 修复，不添加新功能
     - 完成后合并到 `master` 和 `dev`
     - 命名示例：`release/v1.0.0`、`release/v2.1.0`

   - **hotfix/\* 分支**：
     - 从 `master` 分支创建
     - 用于紧急修复生产环境的问题
     - 完成后合并到 `master` 和 `dev`
     - 命名示例：`hotfix/critical-bug`、`hotfix/security-patch`

   **Git Flow 工作流示例：**

   ```bash
   # 1. 开始新功能开发
   git checkout dev
   git checkout -b feature/new-feature
   # ... 开发功能 ...
   git commit -m "feat: add new feature"
   git checkout dev
   git merge feature/new-feature
   git branch -d feature/new-feature

   # 2. 准备发布
   git checkout -b release/v1.0.0
   # ... 最终测试和 bug 修复 ...
   git checkout master
   git merge release/v1.0.0
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git checkout dev
   git merge release/v1.0.0
   git branch -d release/v1.0.0

   # 3. 紧急修复（如果需要）
   git checkout master
   git checkout -b hotfix/critical-bug
   # ... 修复问题 ...
   git checkout master
   git merge hotfix/critical-bug
   git tag -a v1.0.1 -m "Hotfix: critical bug"
   git checkout dev
   git merge hotfix/critical-bug
   git branch -d hotfix/critical-bug
   ```

   **Git Flow 工具（可选）：**

   可以使用 `git-flow` 工具简化操作：

   ```bash
   # 安装 git-flow（macOS）
   brew install git-flow

   # 初始化 git-flow
   git flow init

   # 使用 git-flow 命令
   git flow feature start new-feature    # 创建功能分支
   git flow feature finish new-feature  # 完成功能分支
   git flow release start 1.0.0         # 创建发布分支
   git flow release finish 1.0.0        # 完成发布分支
   git flow hotfix start critical-bug    # 创建热修复分支
   git flow hotfix finish critical-bug   # 完成热修复分支
   ```

   **Git Flow 的优缺点：**

   **优点：**

   - ✅ 分支职责清晰，易于理解
   - ✅ 支持并行开发多个功能
   - ✅ 生产环境代码稳定
   - ✅ 版本管理规范

   **缺点：**

   - ❌ 分支较多，管理复杂
   - ❌ 不适合小型项目或单人开发
   - ❌ 需要团队统一遵循规范

   **简化版 Git Flow（适合当前项目）：**

   对于中小型项目，可以使用简化版本：

   ```
   master (生产环境)
     ↑
   dev (开发环境)
     ↑
   feature/* (功能分支)
   ```

   这个简化版本去掉了 `release` 和 `hotfix` 分支，直接在 `dev` 测试完成后合并到 `master`。

## 避免冲突的最佳实践

### 1. 定期同步主仓库（推荐：每天或每次开发前）

```bash
# 获取主仓库最新更改
git fetch upstream

# 将主仓库的更改合并到你的分支
git merge upstream/dev

# 或者使用 rebase（保持提交历史更清晰）
git rebase upstream/dev
```

**时机建议：**

- 每天开始工作前
- 创建新功能分支前
- 提交 PR 前

### 2. 使用功能分支（Feature Branch）工作流

功能分支工作流是 Git Flow 的核心，它允许你在独立的分支上开发新功能，不影响主分支。

#### 创建 Feature 分支并推送到 Fork 仓库

**完整流程：**

```bash
# 1. 确保 dev 分支是最新的
git checkout dev
git fetch upstream          # 获取主仓库最新更改
git merge upstream/dev      # 或 git rebase upstream/dev

# 2. 创建功能分支
git checkout -b feature/your-feature-name

# 3. 在功能分支上开发
# ... 进行开发 ...
git add .
git commit -m "feat: add new feature"

# 4. 推送到 fork 的远程仓库（origin）
git push -u origin feature/your-feature-name
```

**远程仓库说明：**

在你的项目中，通常有两个远程仓库：

- **origin**：你的 fork 仓库（例如：`https://github.com/ubdmf/novel.git`）
- **upstream**：主仓库（例如：`https://github.com/capykyo/novel.git`）

**查看远程仓库：**

```bash
git remote -v
# 输出示例：
# origin    https://github.com/ubdmf/novel.git (fetch)
# origin    https://github.com/ubdmf/novel.git (push)
# upstream  https://github.com/capykyo/novel.git (fetch)
# upstream  https://github.com/capykyo/novel.git (push)
```

**推送选项说明：**

```bash
# 方式 1：首次推送，设置上游分支（推荐）
git push -u origin feature/your-feature-name

# 方式 2：后续推送（已设置上游分支）
git push

# 方式 3：明确指定远程和分支
git push origin feature/your-feature-name
```

**创建 Pull Request：**

推送功能分支后，可以在 GitHub 上创建 Pull Request：

1. 访问你的 fork 仓库：`https://github.com/ubdmf/novel`
2. 点击 "Compare & pull request" 按钮
3. 选择：
   - **base repository**: `capykyo/novel`
   - **base branch**: `dev`（或 `master`）
   - **compare branch**: `ubdmf/novel:feature/your-feature-name`
4. 填写 PR 描述和标题
5. 提交 PR

**功能分支开发完整示例：**

```bash
# === 开始新功能开发 ===

# 1. 同步主仓库最新代码
git checkout dev
git fetch upstream
git merge upstream/dev

# 2. 创建功能分支
git checkout -b feature/add-user-profile

# 3. 开发功能（多次提交）
git add src/components/UserProfile.tsx
git commit -m "feat: add UserProfile component"

git add src/pages/profile.tsx
git commit -m "feat: add profile page"

# 4. 推送到 fork 仓库
git push -u origin feature/add-user-profile

# === 继续开发（如果需要） ===

# 5. 继续开发并推送
git add .
git commit -m "fix: update UserProfile styling"
git push  # 已设置上游分支，直接 push

# === 功能完成后 ===

# 6. 在 GitHub 创建 PR
# 7. 等待代码审查
# 8. 审查通过后，在 GitHub 上合并 PR
# 9. 删除本地和远程分支（可选）

# 删除本地分支
git checkout dev
git branch -d feature/add-user-profile

# 删除远程分支
git push origin --delete feature/add-user-profile
```

**功能分支的好处：**

- ✅ 隔离功能开发，不影响主分支
- ✅ 更容易处理冲突
- ✅ 可以随时丢弃或重做
- ✅ 支持并行开发多个功能
- ✅ 便于代码审查和讨论

### 3. 小步提交，频繁同步

```bash
# 完成一个小功能就提交
git add .
git commit -m "feat: add small feature"

# 定期推送到远程
git push origin feature/your-feature-name

# 如果主仓库有更新，及时合并
git fetch upstream
git merge upstream/dev
```

**原则：**

- 每次提交只做一件事
- 提交信息清晰明确
- 不要积累太多未提交的更改

### 4. 提交 PR 前先同步

```bash
# 在提交 PR 之前，确保你的分支是最新的
git checkout dev
git fetch upstream
git merge upstream/dev  # 或 git rebase upstream/dev

# 解决任何冲突
# ... 解决冲突 ...

git push origin dev
```

### 5. 使用 Git 工具辅助

#### 配置 Git 别名（可选）

```bash
# 添加到 ~/.gitconfig
[alias]
    sync = !git fetch upstream && git merge upstream/dev
    sync-rebase = !git fetch upstream && git rebase upstream/dev
    status-short = status -sb
```

使用：

```bash
git sync  # 快速同步主仓库
```

### 6. 团队协作建议

#### 如果多人协作：

1. **沟通优先**：在修改公共文件前，在团队中沟通
2. **分工明确**：避免多人同时修改同一文件
3. **代码审查**：通过 PR 审查，及早发现冲突

#### 文件锁定策略（可选）：

对于关键文件，可以考虑：

- 使用 GitHub 的 CODEOWNERS 文件
- 在团队中分配文件负责人
- 使用 Issue 标记正在修改的文件

### 7. 冲突处理策略

即使遵循最佳实践，冲突仍可能发生。处理策略：

#### 策略 A：合并（Merge）

```bash
git merge upstream/dev
# 解决冲突
git add .
git commit -m "fix: resolve merge conflicts"
```

**优点：** 保留完整历史
**缺点：** 历史图可能复杂

#### 策略 B：变基（Rebase）

```bash
git rebase upstream/dev
# 解决冲突
git add .
git rebase --continue
```

**优点：** 历史更线性、清晰
**缺点：** 需要强制推送（如果已推送）

**注意：** 如果分支已经推送到远程并被他人使用，避免使用 rebase

### 7.1. 为什么 Rebase 也会产生冲突？

Rebase 冲突与 Merge 冲突的原因类似，但处理方式不同：

#### Rebase 冲突的原因

1. **逐个应用提交**：Rebase 会逐个将你的提交重新应用到目标分支上

   - Merge：一次性合并所有更改，产生一个合并提交
   - Rebase：逐个提交重新应用，每个提交都可能产生冲突

2. **提交顺序影响**：如果多个提交都修改了同一文件，每个提交都可能触发冲突

   ```
   你的提交历史：
   A -> B -> C -> D (修改了 file1.tsx)

   Rebase 过程：
   - 应用提交 B：可能冲突
   - 应用提交 C：可能冲突（即使 B 已解决）
   - 应用提交 D：可能冲突（即使 C 已解决）
   ```

3. **相同文件的多次修改**：如果同一个文件在多个提交中被修改，每个提交都需要重新解决

   ```
   示例场景：
   - 提交 1：添加了 Tooltip 功能到 GlobalSettingsButton.tsx
   - 提交 2：修改了 GlobalSettingsButton.tsx 的主题逻辑
   - 提交 3：又添加了章节跳转功能到 GlobalSettingsButton.tsx

   在 rebase 时，每个提交都可能与 upstream 的版本冲突
   ```

#### Rebase vs Merge 冲突的区别

| 特性         | Merge 冲突         | Rebase 冲突              |
| ------------ | ------------------ | ------------------------ |
| **冲突次数** | 通常只有一次       | 可能多次（每个提交一次） |
| **解决方式** | 一次性解决所有冲突 | 逐个提交解决冲突         |
| **历史记录** | 保留分支历史       | 重写提交历史             |
| **冲突位置** | 在合并提交中       | 在每个被重新应用的提交中 |

#### 实际案例：我们遇到的 Rebase 冲突

在刚才的 rebase 过程中，我们遇到了以下冲突：

1. **第一次冲突**（提交 `aca1413`）：

   - `GlobalSettingsButton.tsx`：upstream 有 Tooltip，我们的提交没有
   - `BookForm.tsx`：两个分支都添加了文件，但内容不同
   - `ClearBookshelf.tsx`：两个分支都添加了文件，但内容不同

2. **第二次冲突**（提交 `e77ac6e`）：
   - `GlobalSettingsButton.tsx`：upstream 使用 `onClick` 和 `theme === "day"`，我们使用 `onSelect` 和 `theme === "light"`

**为什么会有两次冲突？**

- 因为这两个提交都修改了 `GlobalSettingsButton.tsx`
- Rebase 会逐个应用提交，所以每个提交都需要重新解决冲突

#### 如何减少 Rebase 冲突

1. **更频繁地同步**：

   ```bash
   # 每天同步，而不是积累很多提交后再同步
   git fetch upstream
   git rebase upstream/dev
   ```

2. **小步提交**：

   - 每个提交只做一件事
   - 避免在一个提交中修改太多文件

3. **提交前检查**：

   ```bash
   # 提交前先检查是否有冲突
   git fetch upstream
   git merge-base HEAD upstream/dev  # 查看共同祖先
   git diff upstream/dev...HEAD  # 查看差异
   ```

4. **使用交互式 Rebase 整理提交**：
   ```bash
   # 合并相关的提交，减少冲突点
   git rebase -i upstream/dev
   # 使用 squash 或 fixup 合并相关提交
   ```

#### Rebase 冲突解决流程

```bash
# 1. 开始 rebase
git rebase upstream/dev

# 2. 遇到冲突时
# Git 会暂停，显示：
# "CONFLICT (content): Merge conflict in file.tsx"

# 3. 解决冲突
# 编辑冲突文件，移除冲突标记（<<<<<<, ======, >>>>>>）

# 4. 标记为已解决
git add file.tsx

# 5. 继续 rebase
git rebase --continue

# 6. 如果还有更多冲突，重复步骤 2-5

# 7. 如果某个提交的冲突太复杂，可以跳过
git rebase --skip

# 8. 如果想放弃 rebase
git rebase --abort
```

#### 什么时候使用 Rebase，什么时候使用 Merge？

**使用 Rebase 的情况：**

- ✅ 个人功能分支
- ✅ 提交 PR 前整理提交历史
- ✅ 想要线性、清晰的历史
- ✅ 分支还没有被其他人使用

**使用 Merge 的情况：**

- ✅ 主分支（main/master/dev）
- ✅ 多人协作的分支
- ✅ 想要保留完整的分支历史
- ✅ 不想重写已推送的历史

#### 最佳实践建议

对于当前项目，建议：

1. **日常开发**：使用功能分支 + Merge

   ```bash
   git checkout -b feature/new-feature
   # 开发...
   git checkout dev
   git merge feature/new-feature
   ```

2. **提交 PR 前**：使用 Rebase 整理提交

   ```bash
   # 在功能分支上
   git rebase -i upstream/dev  # 整理提交
   git push origin feature/new-feature --force-with-lease
   ```

3. **同步主分支**：根据情况选择
   - 如果只是同步：`git merge upstream/dev`
   - 如果想保持历史清晰：`git rebase upstream/dev`（需要强制推送）

### 8. 自动化同步（高级）

可以设置 GitHub Actions 自动同步：

```yaml
# .github/workflows/sync-upstream.yml
name: Sync Upstream
on:
  schedule:
    - cron: "0 0 * * *" # 每天午夜
  workflow_dispatch: # 手动触发

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Sync upstream
        run: |
          git fetch upstream
          git checkout dev
          git merge upstream/dev || true
          # 如果有冲突，创建 Issue 通知
```

## 当前项目的建议工作流

### 日常开发流程

```bash
# 1. 开始工作前
git checkout dev
git fetch upstream
git merge upstream/dev  # 同步最新代码

# 2. 创建功能分支
git checkout -b feature/new-feature

# 3. 开发并提交
git add .
git commit -m "feat: description"

# 4. 定期同步（每天至少一次）
git checkout dev
git merge upstream/dev
git checkout feature/new-feature
git merge dev  # 将主分支的更新合并到功能分支

# 5. 完成功能后
git checkout dev
git merge feature/new-feature
git push origin dev
```

### 提交 PR 前的检查清单

- [ ] 已同步主仓库最新代码
- [ ] 已解决所有冲突
- [ ] 代码已通过 lint 检查
- [ ] 测试全部通过
- [ ] 提交信息清晰明确

## 总结

**核心原则：**

1. ✅ **频繁同步**：每天至少同步一次主仓库
2. ✅ **小步提交**：不要积累太多未提交的更改
3. ✅ **功能分支**：使用独立分支开发功能
4. ✅ **提前沟通**：修改公共文件前与团队沟通
5. ✅ **及时处理**：发现冲突立即解决，不要拖延

遵循这些实践，可以大大减少冲突的发生，即使发生冲突，也会更容易解决。

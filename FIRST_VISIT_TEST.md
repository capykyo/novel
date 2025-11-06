# 首次访问测试指南

## 测试步骤

### 准备工作

1. 清除浏览器 localStorage：

   ```javascript
   // 在浏览器控制台执行
   localStorage.clear();
   ```

2. 或者使用隐私模式/无痕模式访问网站

### 测试用例

#### 1. 首页 (`/`)

- **访问**: `http://localhost:3000/` 或生产环境 URL
- **预期结果**:
  - ✅ 页面正常显示
  - ✅ 显示"魔法阅读"标题
  - ✅ "Try it now" 按钮可点击
  - ✅ 无控制台错误

#### 2. 控制台 (`/controlpanel`)

- **访问**: `http://localhost:3000/controlpanel`
- **预期结果**:
  - ✅ 页面正常显示
  - ✅ 显示"阅读: 暂无书籍"
  - ✅ 显示"请添加书籍"
  - ✅ "更换新书"卡片链接到 `/add`
  - ✅ 无控制台错误

#### 3. 添加书籍 (`/add`)

- **访问**: `http://localhost:3000/add`
- **预期结果**:
  - ✅ 页面正常显示
  - ✅ 显示"更新书籍"表单
  - ✅ 输入框为空
  - ✅ 历史记录区域为空（不显示任何书籍）
  - ✅ 无控制台错误

#### 4. 设置页面 (`/settings`)

- **访问**: `http://localhost:3000/settings`
- **预期结果**:
  - ✅ 页面正常显示
  - ✅ API KEY 输入框为空
  - ✅ AI 模型选择器显示默认选项
  - ✅ 休息时间显示默认值（15 分钟）
  - ✅ 无控制台错误

#### 5. 文章页面 - 无参数 (`/article`)

- **访问**: `http://localhost:3000/article`
- **预期结果**:
  - ✅ 自动重定向到 `/controlpanel`
  - ✅ 无错误页面

#### 6. 文章页面 - 有参数但无书籍数据 (`/article?number=1&url=test`)

- **访问**: `http://localhost:3000/article?number=1&url=https://example.com/article`
- **预期结果**:
  - ✅ 页面正常显示
  - ✅ 显示"文章"作为面包屑标题（因为无书籍数据）
  - ✅ 尝试加载文章内容
  - ✅ 如果 URL 无效，显示加载状态或错误

#### 7. AI 阅读 - 无参数 (`/aireading`)

- **访问**: `http://localhost:3000/aireading`
- **预期结果**:
  - ✅ 自动重定向到 `/controlpanel`
  - ✅ 无错误页面

#### 8. AI 阅读 - 有参数但无 API Key (`/aireading?number=1&url=test&originalWordCount=1000`)

- **访问**: `http://localhost:3000/aireading?number=1&url=https://example.com/article&originalWordCount=1000`
- **预期结果**:
  - ✅ 页面正常显示
  - ✅ 显示"未载入书籍"作为标题（因为无书籍数据）
  - ✅ 显示错误信息："连接失败，请检查网络或 API 配置"
  - ✅ 显示"前往设置页面配置 API Key"链接
  - ✅ 无控制台错误

## 自动化测试脚本

在浏览器控制台执行以下脚本进行快速测试：

```javascript
// 清除所有数据
localStorage.clear();
sessionStorage.clear();

// 测试函数
async function testFirstVisit() {
  const baseUrl = window.location.origin;
  const tests = [
    { name: "首页", path: "/" },
    { name: "控制台", path: "/controlpanel" },
    { name: "添加书籍", path: "/add" },
    { name: "设置", path: "/settings" },
  ];

  console.log("开始首次访问测试...");
  console.log(
    "当前 localStorage:",
    localStorage.length === 0 ? "空" : "有数据"
  );

  for (const test of tests) {
    console.log(`\n测试: ${test.name}`);
    console.log(`URL: ${baseUrl}${test.path}`);
    window.location.href = `${baseUrl}${test.path}`;
    await new Promise((resolve) => setTimeout(resolve, 2000)); // 等待页面加载
  }

  console.log("\n测试完成！请手动检查每个页面。");
}

// 执行测试
// testFirstVisit();
```

## 检查清单

### 功能检查

- [ ] 所有页面都能正常加载
- [ ] 无 JavaScript 错误
- [ ] 无控制台警告
- [ ] 页面布局正常
- [ ] 导航链接正常工作

### SSR 检查

- [ ] 页面首次加载时内容正确（无闪烁）
- [ ] 主题切换正常
- [ ] localStorage 访问不会导致 SSR 错误

### 用户体验检查

- [ ] 空状态提示清晰（如"暂无书籍"）
- [ ] 错误信息友好（如 API Key 缺失提示）
- [ ] 重定向逻辑正确（无参数时重定向到控制台）
- [ ] 加载状态正常显示

## 常见问题

### Q: 页面显示空白？

A: 检查浏览器控制台是否有错误，可能是 SSR 问题或 localStorage 访问问题。

### Q: 页面闪烁？

A: 可能是 SSR 和客户端渲染不一致，检查 `useLayoutEffect` 和 `useEffect` 的使用。

### Q: 重定向循环？

A: 检查 `getServerSideProps` 中的重定向逻辑，确保不会无限重定向。

## 测试报告模板

```
测试日期: [日期]
测试环境: [开发/生产]
浏览器: [Chrome/Firefox/Safari]
版本: [版本号]

测试结果:
- 首页: ✅/❌ [备注]
- 控制台: ✅/❌ [备注]
- 添加书籍: ✅/❌ [备注]
- 设置: ✅/❌ [备注]
- 文章页面（无参数）: ✅/❌ [备注]
- AI 阅读（无参数）: ✅/❌ [备注]

发现的问题:
1. [问题描述]
2. [问题描述]

修复建议:
1. [建议]
2. [建议]
```

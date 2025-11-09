# 多网站书籍解析系统

本目录包含多网站书籍解析系统的配置和实现。该系统通过配置文件管理不同网站的 DOM 解析规则，实现自动识别网站并使用对应解析器的功能。

## 目录结构

```
src/configs/
├── index.ts              # 解析器工厂和网站识别入口
├── types.ts              # 类型定义
├── utils.ts              # 工具函数
├── parsers/              # 解析器实现
│   ├── base.ts          # 基础解析器抽象类
│   └── quanben.ts       # quanben.io 解析器
├── sites/                # 网站配置
│   └── quanben.config.ts # quanben.io 配置
└── __tests__/            # 测试文件
```

## 核心概念

### SiteConfig（网站配置）

每个支持的网站都需要一个配置文件，定义：

- 网站标识（id, name, domain）
- URL 匹配模式（urlPattern）
- 书籍信息页面配置（选择器、URL 模板）
- 文章内容页面配置（选择器、URL 模板、清理规则）
- HTTP 请求配置（headers, timeout）

### BaseParser（基础解析器）

所有解析器都继承自 `BaseParser` 抽象类，需要实现：

- `parseBookInfo()` - 解析书籍信息
- `parseArticle()` - 解析文章内容

### 解析器工厂

通过 `getParser(url)` 函数自动识别网站并返回对应的解析器实例。

## 如何添加新网站

### 步骤 1: 创建网站配置

在 `src/configs/sites/` 目录下创建配置文件，例如 `newsite.config.ts`：

```typescript
import { SiteConfig } from "../types";

export const newsiteConfig: SiteConfig = {
  id: "newsite",
  name: "新网站",
  domain: "newsite.com",
  urlPattern: /^https?:\/\/(www\.)?newsite\.com\/book\/[^/]+\/?$/,

  bookInfo: {
    listUrl: "{url}/chapters",
    selectors: {
      title: ".book-title",
      img: ".book-cover img",
      description: ".book-description",
      lastChapter: ".chapter-list li:last-child a",
      lastChapterNumber: {
        selector: ".chapter-list li:last-child a",
        extract: /chapter-(\d+)/,
        attribute: "href",
      },
    },
  },

  article: {
    urlTemplate: "{url}/chapter/{number}",
    selectors: {
      content: ".article-content",
    },
  },

  request: {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
    timeout: 10000,
  },
};
```

### 步骤 2: 创建解析器实现

在 `src/configs/parsers/` 目录下创建解析器类，例如 `newsite.ts`：

```typescript
import { BaseParser } from "./base";
import { BookProps } from "@/types/book";
import { JSDOM } from "jsdom";

export class NewsiteParser extends BaseParser {
  parseBookInfo(html: string, baseUrl: string): BookProps {
    this.dom = new JSDOM(html);
    const body = this.dom.window.document.body;

    const title = body.querySelector(this.config.bookInfo.selectors.title);
    const img = body.querySelector(
      this.config.bookInfo.selectors.img
    ) as HTMLImageElement;
    const description = body.querySelector(
      this.config.bookInfo.selectors.description
    );
    const lastChapter = body.querySelector(
      this.config.bookInfo.selectors.lastChapter
    ) as HTMLAnchorElement;

    if (!title || !img || !description || !lastChapter) {
      throw new Error("Failed to find required elements");
    }

    // 提取章节号
    let lastChapterNumber = "";
    if (this.config.bookInfo.selectors.lastChapterNumber) {
      const config = this.config.bookInfo.selectors.lastChapterNumber;
      lastChapterNumber = this.extractChapterNumber(lastChapter, config);
    }

    return {
      title: title.textContent?.trim() || "",
      img: img.src || "",
      description: description.textContent?.trim() || "",
      lastChapterNumber,
      url: baseUrl,
      currentChapter: "1",
    };
  }

  parseArticle(html: string, chapterNumber?: number): string {
    this.dom = new JSDOM(html);
    const document = this.dom.window.document;

    const content = document.querySelector(
      this.config.article.selectors.content
    );

    if (!content) {
      throw new Error("Failed to find article content");
    }

    return content.innerHTML || "";
  }
}
```

### 步骤 3: 注册网站和解析器

在 `src/configs/index.ts` 中：

1. 导入配置和解析器：

```typescript
import { NewsiteParser } from "./parsers/newsite";
import { newsiteConfig } from "./sites/newsite.config";
```

2. 添加到配置数组：

```typescript
const siteConfigs: SiteConfig[] = [
  quanbenConfig,
  newsiteConfig, // 添加新配置
];
```

3. 添加到解析器映射：

```typescript
const parserMap: Record<string, new (config: SiteConfig) => BaseParser> = {
  quanben: QuanbenParser,
  newsite: NewsiteParser, // 添加新解析器
};
```

### 步骤 4: 编写测试

在 `src/configs/parsers/__tests__/` 和 `src/configs/__tests__/` 中添加测试用例。

## URL 模板说明

### 书籍列表 URL 模板

使用 `{url}` 作为占位符，例如：

- `"{url}/list.html"` → `https://site.com/book/list.html`
- `"{url}/chapters"` → `https://site.com/book/chapters`

### 文章 URL 模板

使用 `{url}` 和 `{number}` 作为占位符，例如：

- `"{url}/{number}.html"` → `https://site.com/book/1.html`
- `"{url}/chapter/{number}"` → `https://site.com/book/chapter/1`

**注意**：系统会自动处理 URL 末尾的斜杠，避免出现双斜杠问题。

## 章节号提取

如果网站的章节号需要从特定属性提取，可以使用 `lastChapterNumber` 配置：

```typescript
lastChapterNumber: {
  selector: ".chapter-list li:last-child a",
  extract: /chapter-(\d+)/,  // 正则表达式，捕获组1为章节号
  attribute: "href",          // 从 href 属性提取
}
```

- `selector`: 选择器定位元素
- `extract`: 可选，正则表达式提取章节号
- `attribute`: 可选，从哪个属性提取（"href" | "textContent" | "innerHTML"），默认为 textContent

## 错误处理

解析器在以下情况会抛出错误：

- 找不到必需的元素（书籍信息或文章内容）
- URL 格式不正确
- 网站不支持

API 端点会捕获这些错误并返回适当的 HTTP 状态码和错误消息。

## 测试

运行测试：

```bash
pnpm test:ci src/configs
```

## 示例

### 使用解析器工厂

```typescript
import { getParser, getSupportedSites } from "@/configs";

// 获取支持的网站列表
const sites = getSupportedSites();
console.log(sites); // [{ id: "quanben", name: "全本小说", domain: "quanben.io" }]

// 获取解析器
const url = "https://quanben.io/n/yishilingwutianxia/";
const parser = getParser(url);

if (parser) {
  // 构建书籍列表URL
  const listUrl = parser.buildBookListUrl(url);

  // 构建文章URL
  const articleUrl = parser.buildArticleUrl(url, 1);

  // 解析HTML
  const bookInfo = parser.parseBookInfo(html, url);
  const content = parser.parseArticle(html, 1);
}
```

## 注意事项

1. **URL 规范化**：系统会自动处理 URL 末尾的斜杠，但建议在配置中使用一致的格式
2. **选择器稳定性**：选择器应该尽可能稳定，避免因网站更新而失效
3. **错误处理**：解析器应该对缺失元素进行适当的错误处理
4. **类型安全**：所有配置和解析器都使用 TypeScript 类型定义，确保类型安全

/**
 * 网站解析配置类型定义
 */

/**
 * 章节号提取配置
 */
export interface ChapterNumberExtract {
  selector: string; // 选择器
  extract?: RegExp; // 提取章节号的正则表达式
  attribute?: "href" | "textContent" | "innerHTML"; // 从哪个属性提取，默认为 textContent
}

/**
 * 书籍信息选择器配置
 */
export interface BookInfoSelectors {
  title: string; // 标题选择器
  img: string; // 封面图选择器
  description: string; // 描述选择器
  lastChapter: string; // 最后一章选择器
  lastChapterNumber?: ChapterNumberExtract; // 章节号提取配置
}

/**
 * 内容清理配置
 */
export interface ContentCleanup {
  removeSelectors?: string[]; // 需要移除的元素选择器
  keepAttributes?: string[]; // 需要保留的HTML属性
}

/**
 * 文章内容选择器配置
 */
export interface ArticleSelectors {
  content: string; // 内容选择器
  title?: string; // 可选：文章标题选择器
  nextChapter?: string; // 可选：下一章链接选择器
  prevChapter?: string; // 可选：上一章链接选择器
}

/**
 * HTTP请求配置
 */
export interface RequestConfig {
  headers?: Record<string, string>; // 请求头
  timeout?: number; // 超时时间（毫秒）
}

/**
 * 书籍信息页面配置
 */
export interface BookInfoConfig {
  listUrl: string; // 章节列表URL模板，使用 {url} 作为占位符
  selectors: BookInfoSelectors; // 选择器配置
}

/**
 * 文章内容页面配置
 */
export interface ArticleConfig {
  urlTemplate: string; // 文章URL模板，使用 {url} 和 {number} 作为占位符
  selectors: ArticleSelectors; // 选择器配置
  cleanup?: ContentCleanup; // 内容清理配置
}

/**
 * 网站配置接口
 */
export interface SiteConfig {
  // 网站标识
  id: string; // 唯一标识符，如 'quanben'
  name: string; // 网站名称，如 '全本小说'
  domain: string; // 域名，如 'quanben.io'
  urlPattern: RegExp; // URL 匹配模式

  // 书籍信息页面配置
  bookInfo: BookInfoConfig;

  // 文章内容页面配置
  article: ArticleConfig;

  // HTTP 请求配置
  request?: RequestConfig;
}


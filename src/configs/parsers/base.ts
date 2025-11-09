/**
 * 基础解析器抽象类
 * 所有网站解析器都应继承此类
 */
import { JSDOM } from "jsdom";
import { BookProps } from "@/types/book";
import { SiteConfig } from "../types";

export abstract class BaseParser {
  protected config: SiteConfig;
  protected dom: JSDOM | null = null;

  constructor(config: SiteConfig) {
    this.config = config;
  }

  /**
   * 获取网站配置
   */
  getConfig(): SiteConfig {
    return this.config;
  }

  /**
   * 构建书籍列表URL
   */
  buildBookListUrl(baseUrl: string): string {
    // 规范化URL，移除末尾斜杠以避免双斜杠
    const normalizedUrl = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    return this.config.bookInfo.listUrl.replace("{url}", normalizedUrl);
  }

  /**
   * 构建文章URL
   */
  buildArticleUrl(baseUrl: string, chapterNumber: number): string {
    // 规范化URL，移除末尾斜杠以避免双斜杠
    const normalizedUrl = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
    return this.config.article.urlTemplate
      .replace("{url}", normalizedUrl)
      .replace("{number}", chapterNumber.toString());
  }

  /**
   * 解析书籍信息
   * @param html HTML内容
   * @param baseUrl 书籍基础URL
   * @returns 书籍信息
   */
  abstract parseBookInfo(html: string, baseUrl: string): BookProps;

  /**
   * 解析文章内容
   * @param html HTML内容
   * @param chapterNumber 章节号（可选，某些解析器可能需要）
   * @returns 文章HTML内容
   */
  abstract parseArticle(html: string, chapterNumber?: number): string;

  /**
   * 通用DOM查询辅助方法
   */
  protected querySelector(selector: string): Element | null {
    if (!this.dom) return null;
    return this.dom.window.document.querySelector(selector);
  }

  /**
   * 通用DOM查询辅助方法（多个元素）
   */
  protected querySelectorAll(selector: string): NodeListOf<Element> {
    if (!this.dom) {
      return [] as unknown as NodeListOf<Element>;
    }
    return this.dom.window.document.querySelectorAll(selector);
  }

  /**
   * 获取元素的文本内容
   */
  protected getTextContent(selector: string): string {
    const element = this.querySelector(selector);
    return element?.textContent?.trim() || "";
  }

  /**
   * 获取元素的属性值
   */
  protected getAttribute(selector: string, attribute: string): string {
    const element = this.querySelector(selector);
    if (element instanceof HTMLElement) {
      return element.getAttribute(attribute) || "";
    }
    return "";
  }

  /**
   * 提取章节号
   */
  protected extractChapterNumber(
    element: Element | null,
    config?: { extract?: RegExp; attribute?: string }
  ): string {
    if (!element) return "";

    let text = "";
    if (config?.attribute === "href") {
      text = (element as HTMLAnchorElement).href || "";
    } else if (config?.attribute === "innerHTML") {
      text = element.innerHTML || "";
    } else {
      text = element.textContent || "";
    }

    if (config?.extract) {
      const match = text.match(config.extract);
      return match ? match[1] || match[0] : "";
    }

    return text;
  }
}

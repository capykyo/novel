/**
 * quanben.io 解析器实现
 */
import { BaseParser } from "./base";
import { BookProps } from "@/types/book";
import { JSDOM } from "jsdom";

export class QuanbenParser extends BaseParser {
  parseBookInfo(html: string, baseUrl: string): BookProps {
    this.dom = new JSDOM(html);
    const body = this.dom.window.document.body;

    // 使用配置的选择器提取书籍信息
    const title = body.querySelector(this.config.bookInfo.selectors.title);
    const img = body.querySelector(
      this.config.bookInfo.selectors.img
    ) as HTMLImageElement;
    const description = body.querySelector(
      this.config.bookInfo.selectors.description
    );

    // 获取最后一章元素
    const lastChapterElements = body.querySelectorAll(
      this.config.bookInfo.selectors.lastChapter
    );
    const lastChapter = lastChapterElements[1] as HTMLAnchorElement;

    if (!title || !img || !description || !lastChapter) {
      throw new Error(
        "Failed to find required elements using the specified selectors."
      );
    }

    // 提取章节号
    let lastChapterNumber = "";
    if (this.config.bookInfo.selectors.lastChapterNumber) {
      const config = this.config.bookInfo.selectors.lastChapterNumber;
      lastChapterNumber = this.extractChapterNumber(lastChapter, config);
    } else {
      // 如果没有配置，使用默认逻辑
      const lastChapterUrl = lastChapter.href || lastChapter.toString();
      const chapterNumberMatch = lastChapterUrl.match(/(\d+)/);
      lastChapterNumber = chapterNumberMatch ? chapterNumberMatch[0] : "";
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parseArticle(html: string, _chapterNumber?: number): string {
    this.dom = new JSDOM(html);
    const document = this.dom.window.document;

    const content = document.querySelector(
      this.config.article.selectors.content
    );

    if (!content) {
      throw new Error(
        "Failed to find article content using the specified selector."
      );
    }

    return content.innerHTML || "";
  }
}

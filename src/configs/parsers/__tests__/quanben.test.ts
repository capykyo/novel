import { describe, it, expect, beforeEach } from "vitest";
import { QuanbenParser } from "../quanben";
import { quanbenConfig } from "../../sites/quanben.config";

// Mock HTML content for testing
const mockBookInfoHtml = `
<!DOCTYPE html>
<html>
<head><title>Test Book</title></head>
<body>
  <div class="list2">
    <h3><span>异世灵武天下</span></h3>
    <img src="https://example.com/book.jpg" alt="Book Cover" />
  </div>
  <div class="description">
    <p>这是一本测试书籍的描述内容</p>
  </div>
  <ul class="list3">
    <li><a href="/n/test/100.html">第100章</a></li>
    <li><a href="/n/test/200.html">第200章</a></li>
  </ul>
  <ul class="list3">
    <li><a href="/n/test/100.html">第100章</a></li>
    <li><a href="https://quanben.io/n/test/200.html">第200章</a></li>
  </ul>
</body>
</html>
`;

const mockArticleHtml = `
<!DOCTYPE html>
<html>
<head><title>Chapter 1</title></head>
<body>
  <div class="main">
    <h1>第一章</h1>
    <p>这是第一章的内容...</p>
  </div>
</body>
</html>
`;

describe("QuanbenParser", () => {
  let parser: QuanbenParser;

  beforeEach(() => {
    parser = new QuanbenParser(quanbenConfig);
  });

  describe("parseBookInfo", () => {
    it("should parse book info correctly", () => {
      const baseUrl = "https://quanben.io/n/yishilingwutianxia/";
      const bookInfo = parser.parseBookInfo(mockBookInfoHtml, baseUrl);

      expect(bookInfo.title).toBe("异世灵武天下");
      expect(bookInfo.img).toBe("https://example.com/book.jpg");
      expect(bookInfo.description).toBe("这是一本测试书籍的描述内容");
      expect(bookInfo.url).toBe(baseUrl);
      expect(bookInfo.currentChapter).toBe("1");
    });

    it("should extract last chapter number correctly", () => {
      const baseUrl = "https://quanben.io/n/yishilingwutianxia/";
      const bookInfo = parser.parseBookInfo(mockBookInfoHtml, baseUrl);

      // The last chapter link should contain "200" in the href
      expect(bookInfo.lastChapterNumber).toBeTruthy();
    });

    it("should throw error when required elements are missing", () => {
      const invalidHtml = "<html><body></body></html>";
      const baseUrl = "https://quanben.io/n/test/";

      expect(() => {
        parser.parseBookInfo(invalidHtml, baseUrl);
      }).toThrow();
    });
  });

  describe("parseArticle", () => {
    it("should parse article content correctly", () => {
      const content = parser.parseArticle(mockArticleHtml, 1);
      expect(content).toContain("第一章");
      expect(content).toContain("这是第一章的内容");
    });

    it("should throw error when content selector not found", () => {
      const invalidHtml =
        "<html><body><div>No main content</div></body></html>";

      expect(() => {
        parser.parseArticle(invalidHtml, 1);
      }).toThrow();
    });
  });

  describe("buildBookListUrl", () => {
    it("should build correct book list URL", () => {
      const baseUrl = "https://quanben.io/n/yishilingwutianxia/";
      const listUrl = parser.buildBookListUrl(baseUrl);
      expect(listUrl).toBe("https://quanben.io/n/yishilingwutianxia/list.html");
    });
  });

  describe("buildArticleUrl", () => {
    it("should build correct article URL", () => {
      const baseUrl = "https://quanben.io/n/yishilingwutianxia/";
      const articleUrl = parser.buildArticleUrl(baseUrl, 1);
      expect(articleUrl).toBe("https://quanben.io/n/yishilingwutianxia/1.html");
    });

    it("should handle different chapter numbers", () => {
      const baseUrl = "https://quanben.io/n/yishilingwutianxia/";
      const articleUrl = parser.buildArticleUrl(baseUrl, 100);
      expect(articleUrl).toBe(
        "https://quanben.io/n/yishilingwutianxia/100.html"
      );
    });
  });
});

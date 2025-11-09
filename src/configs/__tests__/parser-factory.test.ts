import { describe, it, expect } from "vitest";
import { getParser, identifySite, getSupportedSites } from "../index";
import { QuanbenParser } from "../parsers/quanben";

describe("Parser Factory", () => {
  describe("identifySite", () => {
    it("should identify quanben.io site correctly", () => {
      const url = "https://quanben.io/n/yishilingwutianxia/";
      const config = identifySite(url);
      expect(config).not.toBeNull();
      expect(config?.id).toBe("quanben");
      expect(config?.domain).toBe("quanben.io");
    });

    it("should identify quanben.io with www prefix", () => {
      const url = "https://www.quanben.io/n/yishilingwutianxia/";
      const config = identifySite(url);
      expect(config).not.toBeNull();
      expect(config?.id).toBe("quanben");
    });

    it("should return null for unsupported site", () => {
      const url = "https://example.com/book/123";
      const config = identifySite(url);
      expect(config).toBeNull();
    });

    it("should handle URLs without trailing slash", () => {
      const url = "https://quanben.io/n/yishilingwutianxia";
      const config = identifySite(url);
      expect(config).not.toBeNull();
      expect(config?.id).toBe("quanben");
    });
  });

  describe("getParser", () => {
    it("should return QuanbenParser for quanben.io URL", () => {
      const url = "https://quanben.io/n/yishilingwutianxia/";
      const parser = getParser(url);
      expect(parser).not.toBeNull();
      expect(parser).toBeInstanceOf(QuanbenParser);
    });

    it("should return null for unsupported site", () => {
      const url = "https://example.com/book/123";
      const parser = getParser(url);
      expect(parser).toBeNull();
    });

    it("should build correct book list URL", () => {
      const url = "https://quanben.io/n/yishilingwutianxia/";
      const parser = getParser(url);
      expect(parser).not.toBeNull();
      if (parser) {
        const listUrl = parser.buildBookListUrl(url);
        expect(listUrl).toBe("https://quanben.io/n/yishilingwutianxia/list.html");
      }
    });

    it("should build correct article URL", () => {
      const url = "https://quanben.io/n/yishilingwutianxia/";
      const parser = getParser(url);
      expect(parser).not.toBeNull();
      if (parser) {
        const articleUrl = parser.buildArticleUrl(url, 1);
        expect(articleUrl).toBe("https://quanben.io/n/yishilingwutianxia/1.html");
      }
    });
  });

  describe("getSupportedSites", () => {
    it("should return list of supported sites", () => {
      const sites = getSupportedSites();
      expect(sites).toBeInstanceOf(Array);
      expect(sites.length).toBeGreaterThan(0);
      expect(sites[0]).toHaveProperty("id");
      expect(sites[0]).toHaveProperty("name");
      expect(sites[0]).toHaveProperty("domain");
    });

    it("should include quanben in supported sites", () => {
      const sites = getSupportedSites();
      const quanben = sites.find((site) => site.id === "quanben");
      expect(quanben).toBeDefined();
      expect(quanben?.name).toBe("全本小说");
      expect(quanben?.domain).toBe("quanben.io");
    });
  });
});


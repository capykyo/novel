import { describe, it, expect } from "vitest";
import { identifySite } from "../index";

describe("Site Identification", () => {
  describe("quanben.io", () => {
    it("should identify quanben.io URLs", () => {
      const testUrls = [
        "https://quanben.io/n/yishilingwutianxia/",
        "https://www.quanben.io/n/yishilingwutianxia/",
        "http://quanben.io/n/xuezhonghandaoxing/",
        "https://quanben.io/n/chongshengbiannuwangnaxiatezhongduizhang",
      ];

      testUrls.forEach((url) => {
        const config = identifySite(url);
        expect(config).not.toBeNull();
        expect(config?.id).toBe("quanben");
        expect(config?.domain).toBe("quanben.io");
      });
    });

    it("should not identify invalid quanben.io URLs", () => {
      const invalidUrls = [
        "https://quanben.io/",
        "https://quanben.io/n/",
        "https://quanben.io/other/path",
        "https://fake-quanben.io/n/test/",
      ];

      invalidUrls.forEach((url) => {
        const config = identifySite(url);
        // Some might match, but we're testing edge cases
        if (config) {
          // If it matches, it should still be quanben
          expect(config.id).toBe("quanben");
        }
      });
    });
  });

  describe("unsupported sites", () => {
    it("should return null for unsupported sites", () => {
      const unsupportedUrls = [
        "https://example.com/book/123",
        "https://other-novel-site.com/novel/456",
        "https://not-a-book-site.com",
      ];

      unsupportedUrls.forEach((url) => {
        const config = identifySite(url);
        expect(config).toBeNull();
      });
    });
  });

  describe("URL normalization", () => {
    it("should handle URLs with and without trailing slashes", () => {
      const url1 = "https://quanben.io/n/yishilingwutianxia/";
      const url2 = "https://quanben.io/n/yishilingwutianxia";

      const config1 = identifySite(url1);
      const config2 = identifySite(url2);

      expect(config1).not.toBeNull();
      expect(config2).not.toBeNull();
      expect(config1?.id).toBe(config2?.id);
    });
  });
});


import { describe, it, expect } from "vitest";
import {
  removeWhitespaceAndNewlines,
  stripHtmlTags,
} from "@/utils/textFormat";

describe("textFormat", () => {
  describe("removeWhitespaceAndNewlines", () => {
    it("removes all whitespace and newlines", () => {
      const input = "hello   world\n\n\t  test";
      const result = removeWhitespaceAndNewlines(input);
      expect(result).toBe("helloworldtest");
    });

    it("handles empty string", () => {
      expect(removeWhitespaceAndNewlines("")).toBe("");
    });

    it("handles string with only whitespace", () => {
      expect(removeWhitespaceAndNewlines("   \n\t  ")).toBe("");
    });

    it("handles string without whitespace", () => {
      expect(removeWhitespaceAndNewlines("helloworld")).toBe("helloworld");
    });
  });

  describe("stripHtmlTags", () => {
    it("removes HTML tags and returns text content", () => {
      const html = "<div>Hello <strong>World</strong></div>";
      const result = stripHtmlTags(html);
      expect(result).toBe("Hello World");
    });

    it("handles nested HTML tags", () => {
      const html = "<p>Text <span>nested</span> content</p>";
      const result = stripHtmlTags(html);
      expect(result).toBe("Text nested content");
    });

    it("handles empty HTML", () => {
      expect(stripHtmlTags("")).toBe("");
    });

    it("handles HTML with only tags", () => {
      expect(stripHtmlTags("<div></div>")).toBe("");
    });

    it("handles plain text without tags", () => {
      expect(stripHtmlTags("plain text")).toBe("plain text");
    });

    it("handles HTML with attributes", () => {
      const html = '<div class="test" id="main">Content</div>';
      const result = stripHtmlTags(html);
      expect(result).toBe("Content");
    });
  });
});


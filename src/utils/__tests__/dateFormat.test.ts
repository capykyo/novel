import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatReadingTime,
  estimateReadingTime,
  formatTime,
} from "@/utils/dateFormat";

describe("dateFormat", () => {
  describe("formatDate", () => {
    it("formats seconds to HH:MM:SS", () => {
      expect(formatDate(3661)).toBe("1:1:1");
      expect(formatDate(3665)).toBe("1:1:5");
    });

    it("handles zero seconds", () => {
      expect(formatDate(0)).toBe("0:0:0");
    });

    it("handles less than one hour", () => {
      expect(formatDate(125)).toBe("0:2:5");
    });

    it("handles exactly one hour", () => {
      expect(formatDate(3600)).toBe("1:0:0");
    });

    it("handles large values", () => {
      expect(formatDate(36661)).toBe("10:11:1");
    });
  });

  describe("formatReadingTime", () => {
    it("formats seconds less than 60", () => {
      expect(formatReadingTime(30)).toBe("30秒");
      expect(formatReadingTime(0)).toBe("0秒");
    });

    it("formats minutes less than 60", () => {
      expect(formatReadingTime(120)).toBe("2分钟");
      expect(formatReadingTime(3599)).toBe("59分钟");
    });

    it("formats hours with minutes and seconds", () => {
      expect(formatReadingTime(3661)).toBe("1小时1分钟1秒");
      expect(formatReadingTime(7323)).toBe("2小时2分钟3秒");
    });

    it("handles zero", () => {
      expect(formatReadingTime(0)).toBe("0秒");
    });
  });

  describe("estimateReadingTime", () => {
    it("calculates reading time with default WPM", () => {
      // 350 words per minute = ~5.83 words per second
      // 350 words should take 60 seconds
      const result = estimateReadingTime(350);
      expect(result).toBe(60);
    });

    it("calculates reading time with custom WPM", () => {
      // 200 words per minute = ~3.33 words per second
      // 200 words should take 60 seconds
      const result = estimateReadingTime(200, 200);
      expect(result).toBe(60);
    });

    it("handles zero word count", () => {
      expect(estimateReadingTime(0)).toBe(0);
    });

    it("rounds to nearest second", () => {
      // 175 words at 350 WPM = 30 seconds
      const result = estimateReadingTime(175);
      expect(result).toBe(30);
    });

    it("handles large word counts", () => {
      const result = estimateReadingTime(3500);
      expect(result).toBe(600);
    });
  });

  describe("formatTime", () => {
    it("formats timestamp to locale string", () => {
      const timestamp = 1609459200000; // 2021-01-01 00:00:00 UTC
      const result = formatTime(timestamp);
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });

    it("handles current timestamp", () => {
      const now = Date.now();
      const result = formatTime(now);
      expect(result).toBeTruthy();
    });
  });
});


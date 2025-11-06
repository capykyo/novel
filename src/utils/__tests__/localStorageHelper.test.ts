import { describe, it, expect, beforeEach, vi } from "vitest";
import { updateBookCurrentChapter } from "@/utils/localStorageHelper";
import { storage } from "@/utils/storage";

// Mock storage module
vi.mock("@/utils/storage", () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe("localStorageHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateBookCurrentChapter", () => {
    it("updates currentChapter for first book", () => {
      const mockBooks = [
        { title: "Book 1", currentChapter: "1" },
        { title: "Book 2", currentChapter: "2" },
      ];
      vi.mocked(storage.get).mockReturnValue(mockBooks);

      updateBookCurrentChapter(5);

      expect(storage.get).toHaveBeenCalledWith("bookInfo", []);
      expect(storage.set).toHaveBeenCalledWith("bookInfo", [
        { title: "Book 1", currentChapter: "5" },
        { title: "Book 2", currentChapter: "2" },
      ]);
    });

    it("does nothing when bookInfo is empty", () => {
      vi.mocked(storage.get).mockReturnValue([]);

      updateBookCurrentChapter(5);

      expect(storage.get).toHaveBeenCalledWith("bookInfo", []);
      expect(storage.set).not.toHaveBeenCalled();
    });

    it("does nothing when bookInfo is null", () => {
      vi.mocked(storage.get).mockReturnValue(null);

      updateBookCurrentChapter(5);

      expect(storage.get).toHaveBeenCalledWith("bookInfo", []);
      expect(storage.set).not.toHaveBeenCalled();
    });

    it("handles chapter number as string conversion", () => {
      const mockBooks = [{ title: "Book 1", currentChapter: "1" }];
      vi.mocked(storage.get).mockReturnValue(mockBooks);

      updateBookCurrentChapter(10);

      expect(storage.set).toHaveBeenCalledWith("bookInfo", [
        { title: "Book 1", currentChapter: "10" },
      ]);
    });
  });
});


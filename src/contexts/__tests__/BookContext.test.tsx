import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import React from "react";
import { BookProvider, useBookContext } from "@/contexts/BookContext";

const TestComponent: React.FC = () => {
  const { bookInfo, currentPage, setBookInfo, setCurrentPage } = useBookContext();

  return (
    <div>
      <div data-testid="book-title">{bookInfo?.title || "No book"}</div>
      <div data-testid="current-page">{currentPage}</div>
      <button
        data-testid="set-book-btn"
        onClick={() =>
          setBookInfo({
            title: "Test Book",
            url: "https://example.com",
            img: "https://example.com/img.jpg",
            description: "Test description",
          })
        }
      >
        Set Book
      </button>
      <button data-testid="set-page-btn" onClick={() => setCurrentPage(5)}>
        Set Page
      </button>
    </div>
  );
};

describe("BookContext", () => {
  afterEach(() => {
    cleanup();
  });

  it("provides default values", () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    expect(screen.getByTestId("book-title").textContent).toBe("No book");
    expect(screen.getByTestId("current-page").textContent).toBe("1");
  });

  it("updates bookInfo when setBookInfo is called", () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    const setBookButton = screen.getByTestId("set-book-btn");
    act(() => {
      setBookButton.click();
    });

    expect(screen.getByTestId("book-title").textContent).toBe("Test Book");
  });

  it("updates currentPage when setCurrentPage is called", () => {
    render(
      <BookProvider>
        <TestComponent />
      </BookProvider>
    );

    const setPageButton = screen.getByTestId("set-page-btn");
    act(() => {
      setPageButton.click();
    });

    expect(screen.getByTestId("current-page").textContent).toBe("5");
  });

  it("throws error when used outside provider", () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useBookContext must be used within a BookProvider");

    consoleSpy.mockRestore();
  });
});


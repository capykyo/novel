import { describe, it, expect, beforeAll, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePagination } from "@/utils/paginationCache";

describe("usePagination", () => {
  beforeAll(() => {
    // mock fetch used by SWR fetcher
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({ content: "hi" }) }))
    );
  });

  it("returns initial structure and can navigate", async () => {
    const { result } = renderHook(() => usePagination(1, "test://"));
    expect(result.current.currentPage).toBe(1);
    expect(typeof result.current.handleNextPage).toBe("function");
    expect(typeof result.current.handlePrevPage).toBe("function");

    act(() => result.current.handleNextPage());
    expect(result.current.currentPage).toBe(2);
  });
});



import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "@/utils/storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("get returns default when missing", () => {
    const val = storage.get("missing", 123);
    expect(val).toBe(123);
  });

  it("set and get roundtrip", () => {
    storage.set("k", { a: 1 });
    const val = storage.get<{ a: number }>("k", { a: 0 });
    expect(val).toEqual({ a: 1 });
  });

  it("remove deletes key", () => {
    storage.set("k", "v");
    storage.remove("k");
    const val = storage.get("k", null);
    expect(val).toBeNull();
  });
});



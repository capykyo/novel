import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ApiKeyManager } from "../ApiKeyManager";
import { storage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

// Mock dependencies
vi.mock("@/utils/storage");
vi.mock("@/hooks/use-toast");

const mockToast = vi.fn();

describe("ApiKeyManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      toast: mockToast,
    });
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders API Key manager component", () => {
    vi.mocked(storage.get).mockReturnValue("");
    render(<ApiKeyManager />);

    // Use getAllByText for multiple "API KEY" elements
    expect(screen.getAllByText("API KEY").length).toBeGreaterThan(0);
    expect(screen.getByText("输入您的API KEY")).toBeTruthy();
    expect(screen.getByPlaceholderText("API KEY")).toBeTruthy();
    expect(screen.getByText("清除")).toBeTruthy();
    expect(screen.getByText("保存")).toBeTruthy();
  });

  it("loads saved API Key from storage on mount", () => {
    const savedKey = "sk-test123456789";
    vi.mocked(storage.get).mockReturnValue(savedKey);

    render(<ApiKeyManager />);

    expect(storage.get).toHaveBeenCalledWith("apiKey", "");
    const input = screen.getByPlaceholderText("API KEY") as HTMLInputElement;
    expect(input.value).toBe(savedKey);
  });

  it("displays masked API Key when key is set", () => {
    const savedKey = "sk-test123456789abcdef";
    vi.mocked(storage.get).mockReturnValue(savedKey);

    render(<ApiKeyManager />);

    // Should show masked version: first 4 + stars + last 4
    expect(screen.getByText(/sk-t\*+cdef/)).toBeTruthy();
  });

  it("displays '未设置' when API Key is empty", () => {
    vi.mocked(storage.get).mockReturnValue("");

    render(<ApiKeyManager />);

    expect(screen.getByText("您的API KEY：未设置")).toBeTruthy();
  });

  it("updates API Key state when input changes", () => {
    vi.mocked(storage.get).mockReturnValue("");

    render(<ApiKeyManager />);

    const input = screen.getByPlaceholderText("API KEY") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "new-api-key" } });

    expect(input.value).toBe("new-api-key");
  });

  it("saves API Key to storage when save button is clicked", () => {
    vi.mocked(storage.get).mockReturnValue("");

    render(<ApiKeyManager />);

    const input = screen.getByPlaceholderText("API KEY") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test-api-key" } });

    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    expect(storage.set).toHaveBeenCalledWith("apiKey", "test-api-key");
    expect(mockToast).toHaveBeenCalledWith({
      title: "保存成功",
      description: "API Key 已保存",
    });
  });

  it("shows error toast when save fails", () => {
    vi.mocked(storage.get).mockReturnValue("");
    vi.mocked(storage.set).mockImplementation(() => {
      throw new Error("Storage error");
    });

    render(<ApiKeyManager />);

    const input = screen.getByPlaceholderText("API KEY") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "test-api-key" } });

    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    expect(mockToast).toHaveBeenCalledWith({
      title: "保存失败",
      description: "无法保存 API Key，请重试",
      variant: "destructive",
    });
  });

  it("clears API Key when clear button is clicked", () => {
    const savedKey = "sk-test123456789";
    vi.mocked(storage.get).mockReturnValue(savedKey);

    render(<ApiKeyManager />);

    const clearButton = screen.getByText("清除");
    fireEvent.click(clearButton);

    expect(storage.remove).toHaveBeenCalledWith("apiKey");
    expect(mockToast).toHaveBeenCalledWith({
      title: "已清除",
      description: "API Key 已清除",
    });

    const input = screen.getByPlaceholderText("API KEY") as HTMLInputElement;
    expect(input.value).toBe("");
  });

  it("masks short API Key correctly (length <= 8)", () => {
    const shortKey = "sk-test";
    vi.mocked(storage.get).mockReturnValue(shortKey);

    render(<ApiKeyManager />);

    // Short keys should not be masked
    expect(screen.getByText(`您的API KEY：${shortKey}`)).toBeTruthy();
  });

  it("masks long API Key correctly (length > 8)", () => {
    const longKey = "sk-1234567890abcdefghijklmnop";
    vi.mocked(storage.get).mockReturnValue(longKey);

    render(<ApiKeyManager />);

    // Should show: first 4 chars + stars + last 4 chars
    const description = screen.getByText(/您的API KEY：/);
    expect(description.textContent).toContain("sk-1");
    expect(description.textContent).toContain("mnop");
    expect(description.textContent).toMatch(/\*+/); // Should contain stars
  });
});

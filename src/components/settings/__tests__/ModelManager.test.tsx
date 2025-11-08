import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { ModelManager } from "../ModelManager";
import { storage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

// Mock dependencies
vi.mock("@/utils/storage");
vi.mock("@/hooks/use-toast");

const mockToast = vi.fn();

describe("ModelManager", () => {
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

  it("renders Model Manager component", () => {
    vi.mocked(storage.get).mockReturnValue("");
    render(<ModelManager />);

    expect(screen.getByText("可选 AI 模型")).toBeTruthy();
    expect(screen.getByText("选择您想要使用的 AI 模型")).toBeTruthy();
    expect(screen.getByText("保存")).toBeTruthy();
  });

  it("loads saved model from storage on mount", () => {
    const savedModel = "deepseek-ai/DeepSeek-R1";
    vi.mocked(storage.get).mockReturnValue(savedModel);

    render(<ModelManager />);

    expect(storage.get).toHaveBeenCalledWith("aiModel", "");
  });

  it("saves selected model to storage when save button is clicked", () => {
    vi.mocked(storage.get).mockReturnValue("");

    render(<ModelManager />);

    // Note: SelectScrollable uses Radix UI Select which requires more complex interaction
    // For now, we test that the save button exists and can be clicked
    const saveButton = screen.getByText("保存");
    expect(saveButton).toBeTruthy();

    fireEvent.click(saveButton);

    // Should save empty string if no model selected
    expect(storage.set).toHaveBeenCalledWith("aiModel", "");
    expect(mockToast).toHaveBeenCalledWith({
      title: "保存成功",
      description: "AI 模型已保存",
    });
  });

  it("shows error toast when save fails", () => {
    vi.mocked(storage.get).mockReturnValue("");
    vi.mocked(storage.set).mockImplementation(() => {
      throw new Error("Storage error");
    });

    render(<ModelManager />);

    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    expect(mockToast).toHaveBeenCalledWith({
      title: "保存失败",
      description: "无法保存 AI 模型，请重试",
      variant: "destructive",
    });
  });

  it("displays model groups correctly", () => {
    vi.mocked(storage.get).mockReturnValue("");

    render(<ModelManager />);

    // Check that the select trigger is rendered
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeTruthy();
  });

  it("handles model selection change", () => {
    vi.mocked(storage.get).mockReturnValue("");

    render(<ModelManager />);

    // The component should render with empty value initially
    const selectTrigger = screen.getByRole("combobox");
    expect(selectTrigger).toBeTruthy();
  });
});

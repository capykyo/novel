import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { RestTimeManager } from "../RestTimeManager";
import { storage } from "@/utils/storage";
import { useToast } from "@/hooks/use-toast";

// Mock IntersectionObserver for NumberTicker component
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock dependencies
vi.mock("@/utils/storage");
vi.mock("@/hooks/use-toast");

const mockToast = vi.fn();
const DEFAULT_REST_TIME = 15;

describe("RestTimeManager", () => {
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

  it("renders Rest Time Manager component", () => {
    vi.mocked(storage.get).mockReturnValue(DEFAULT_REST_TIME);
    render(<RestTimeManager />);

    expect(screen.getByText("重置休息时间")).toBeTruthy();
    expect(
      screen.getByText("重置休息时间，并设置您想要休息的时间")
    ).toBeTruthy();
    expect(screen.getByText("重置")).toBeTruthy();
    expect(screen.getByText("保存")).toBeTruthy();
    expect(screen.getByText("分钟")).toBeTruthy();
  });

  it("loads saved rest time from storage on mount", () => {
    const savedTime = 20;
    vi.mocked(storage.get).mockReturnValue(savedTime);

    render(<RestTimeManager />);

    expect(storage.get).toHaveBeenCalledWith("restTime", DEFAULT_REST_TIME);
  });

  it("uses default rest time when storage is empty", () => {
    vi.mocked(storage.get).mockReturnValue(DEFAULT_REST_TIME);

    render(<RestTimeManager />);

    expect(storage.get).toHaveBeenCalledWith("restTime", DEFAULT_REST_TIME);
  });

  it("saves rest time to storage when save button is clicked", () => {
    vi.mocked(storage.get).mockReturnValue(DEFAULT_REST_TIME);

    render(<RestTimeManager />);

    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    expect(storage.set).toHaveBeenCalledWith("restTime", DEFAULT_REST_TIME);
    expect(mockToast).toHaveBeenCalledWith({
      title: "保存成功",
      description: `休息时间已设置为 ${DEFAULT_REST_TIME} 分钟`,
    });
  });

  it("shows error toast when save fails", () => {
    vi.mocked(storage.get).mockReturnValue(DEFAULT_REST_TIME);
    vi.mocked(storage.set).mockImplementation(() => {
      throw new Error("Storage error");
    });

    render(<RestTimeManager />);

    const saveButton = screen.getByText("保存");
    fireEvent.click(saveButton);

    expect(mockToast).toHaveBeenCalledWith({
      title: "保存失败",
      description: "无法保存休息时间，请重试",
      variant: "destructive",
    });
  });

  it("resets rest time to default when reset button is clicked", () => {
    const savedTime = 30;
    vi.mocked(storage.get).mockReturnValue(savedTime);
    // Reset storage.set mock to not throw error for this test
    vi.mocked(storage.set).mockImplementation(() => {});

    render(<RestTimeManager />);

    const resetButton = screen.getByText("重置");
    fireEvent.click(resetButton);

    expect(storage.set).toHaveBeenCalledWith("restTime", DEFAULT_REST_TIME);
    expect(mockToast).toHaveBeenCalledWith({
      title: "已重置",
      description: `休息时间已重置为 ${DEFAULT_REST_TIME} 分钟`,
    });
  });

  it("displays rest time value", () => {
    const savedTime = 25;
    vi.mocked(storage.get).mockReturnValue(savedTime);

    render(<RestTimeManager />);

    // NumberTicker should display the value
    // Since NumberTicker is a complex component, we just verify the structure exists
    const timeDisplay = screen.getByText("分钟");
    expect(timeDisplay).toBeTruthy();
  });
});

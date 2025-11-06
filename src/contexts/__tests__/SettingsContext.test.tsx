import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import React from "react";
import { SettingsProvider, useSettings } from "@/contexts/SettingsContext";

const TestComponent: React.FC = () => {
  const { theme, textSize, toggleTheme, setTextSize } = useSettings();

  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="text-size">{textSize}</div>
      <button data-testid="toggle-theme-btn" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <button data-testid="set-text-size-btn" onClick={() => setTextSize(18)}>
        Set Text Size
      </button>
    </div>
  );
};

// Mock storage
vi.mock("@/utils/storage", () => ({
  storage: {
    get: vi.fn(() => ({ theme: "light", textSize: 16 })),
    set: vi.fn(),
  },
}));

describe("SettingsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("provides default settings", () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("light");
    expect(screen.getByTestId("text-size").textContent).toBe("16");
  });

  it("toggles theme between light and dark", () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const toggleButton = screen.getByTestId("toggle-theme-btn");
    
    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("dark");

    act(() => {
      toggleButton.click();
    });

    expect(screen.getByTestId("theme").textContent).toBe("light");
  });

  it("updates text size", () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const setSizeButton = screen.getByTestId("set-text-size-btn");
    
    act(() => {
      setSizeButton.click();
    });

    expect(screen.getByTestId("text-size").textContent).toBe("18");
  });
});


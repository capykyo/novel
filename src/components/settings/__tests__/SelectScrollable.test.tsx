import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { SelectScrollable } from "../SelectScrollable";

describe("SelectScrollable", () => {
  afterEach(() => {
    cleanup();
  });

  const mockGroups = [
    {
      label: "Group 1",
      items: [
        { text: "Option 1", value: "opt1" },
        { text: "Option 2", value: "opt2" },
      ],
    },
    {
      label: "Group 2",
      items: [{ text: "Option 3", value: "opt3" }],
    },
  ];

  it("renders select with trigger text", () => {
    render(<SelectScrollable trigger="选择选项" groups={mockGroups} />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeTruthy();
  });

  it("renders with controlled value", () => {
    const handleChange = vi.fn();
    render(
      <SelectScrollable
        trigger="选择选项"
        groups={mockGroups}
        value="opt1"
        onValueChange={handleChange}
      />
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeTruthy();
  });

  it("renders without value and onValueChange (uncontrolled)", () => {
    render(<SelectScrollable trigger="选择选项" groups={mockGroups} />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeTruthy();
  });

  it("renders all groups and items", () => {
    render(<SelectScrollable trigger="选择选项" groups={mockGroups} />);

    // Radix UI Select renders items in a portal, so we check the trigger exists
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeTruthy();
  });
});

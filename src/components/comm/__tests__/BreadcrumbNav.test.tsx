import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import BreadcrumbNav from "@/components/comm/BreadcrumbNav";

describe("BreadcrumbNav", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders breadcrumb items", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Settings", href: "/settings" },
      { label: "Page", isPage: true },
    ];

    render(<BreadcrumbNav items={items} />);

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Settings")).toBeTruthy();
    expect(screen.getByText("Page")).toBeTruthy();
  });

  it("renders links for non-page items", () => {
    const items = [{ label: "Home", href: "/home" }];
    const { container } = render(<BreadcrumbNav items={items} />);
    
    const link = container.querySelector('a[href="/home"]');
    expect(link).toBeTruthy();
  });

  it("renders page item without link", () => {
    const items = [{ label: "Current Page", isPage: true }];
    const { container } = render(<BreadcrumbNav items={items} />);
    
    // Page items should not have href links
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it("uses default href for items without href", () => {
    const items = [{ label: "No Link" }];
    const { container } = render(<BreadcrumbNav items={items} />);
    
    const link = container.querySelector('a[href="#"]');
    expect(link).toBeTruthy();
  });

  it("applies custom className", () => {
    const items = [{ label: "Test" }];
    const { container } = render(
      <BreadcrumbNav items={items} className="custom-class" />
    );
    
    const breadcrumb = container.querySelector(".custom-class");
    expect(breadcrumb).toBeTruthy();
  });

  it("handles empty items array", () => {
    const { container } = render(<BreadcrumbNav items={[]} />);
    // Should render breadcrumb structure even with empty items
    expect(container.querySelector("nav")).toBeTruthy();
  });

  it("renders multiple items correctly", () => {
    const items = [
      { label: "Home", href: "/" },
      { label: "Settings", href: "/settings" },
    ];
    render(<BreadcrumbNav items={items} />);
    
    // Should have both items - use getAllByText and check first
    const homeLinks = screen.getAllByText("Home");
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getByText("Settings")).toBeTruthy();
  });
});


import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";

const Boom: React.FC = () => {
  throw new Error("boom");
};

describe("ErrorBoundary", () => {
  it("renders fallback when child throws", () => {
    const { container } = render(
      <ErrorBoundary fallback={<div>fallback</div>}>
        <Boom />
      </ErrorBoundary>
    );
    expect(container.textContent).toContain("fallback");
  });
});



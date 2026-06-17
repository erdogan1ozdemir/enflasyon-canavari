import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AdSlot } from "../components/AdSlot";

describe("AdSlot", () => {
  it("reklam flag'i kapalıyken hiçbir şey render etmez", () => {
    const { container } = render(<AdSlot id="anasayfa-ust" />);
    expect(container.firstChild).toBeNull();
  });
});

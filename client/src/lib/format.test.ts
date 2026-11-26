import { describe, it, expect } from "vitest";
import { formatUsd, formatTokenCount, formatTokenPair } from "./format";

describe("formatUsd", () => {
  it("uses 2/3/4 decimals by magnitude", () => {
    expect(formatUsd(1.5)).toBe("$1.50");
    expect(formatUsd(0.0142)).toBe("$0.014");
    expect(formatUsd(0.0013)).toBe("$0.0013");
  });

  it("shows a real zero cost, but no data as an em-dash (never $0.00)", () => {
    expect(formatUsd(0)).toBe("$0.000");
    expect(formatUsd(null)).toBe("—");
    expect(formatUsd(undefined)).toBe("—");
  });
});

describe("formatTokenCount / formatTokenPair", () => {
  it("keeps small counts as-is and abbreviates thousands / millions", () => {
    expect(formatTokenCount(950)).toBe("950");
    expect(formatTokenCount(15_000)).toBe("15K");
    expect(formatTokenCount(1_250_000)).toBe("1.3M");
  });

  it("formats an in→out pair", () => {
    expect(formatTokenPair(8200, 1300)).toBe("8.2K→1.3K");
    expect(formatTokenPair(12_000, 120)).toBe("12K→120");
  });
});

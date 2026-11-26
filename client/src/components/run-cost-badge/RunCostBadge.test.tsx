import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import common from "../../../messages/en/common.json";
import { RunCostBadge } from "./RunCostBadge";

function wrap(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ common }}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("RunCostBadge", () => {
  it("compact: cost only", () => {
    wrap(<RunCostBadge usd={0.0142} tokensIn={8200} tokensOut={1300} />);
    expect(screen.getByText("$0.014")).toBeInTheDocument();
    expect(screen.queryByText(/8\.2K/)).toBeNull();
  });

  it("full: cost · in→out tokens", () => {
    wrap(<RunCostBadge variant="full" usd={0.0142} tokensIn={8200} tokensOut={1300} />);
    expect(screen.getByText("$0.014")).toBeInTheDocument();
    expect(screen.getByText(/8\.2K→1\.3K/)).toBeInTheDocument();
    expect(screen.getByTitle("Cost of this review")).toBeInTheDocument();
  });

  it("unknown cost renders an em-dash, never $0.00", () => {
    wrap(<RunCostBadge variant="full" usd={null} tokensIn={0} tokensOut={0} />);
    expect(screen.getByText("—")).toBeInTheDocument();
    expect(screen.queryByText(/\$0/)).toBeNull();
  });
});

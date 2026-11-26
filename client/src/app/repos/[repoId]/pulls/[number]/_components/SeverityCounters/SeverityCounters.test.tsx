import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { Severity } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";
import { SeverityCounters } from "./SeverityCounters";

afterEach(cleanup);

const LEVELS: Severity[] = ["CRITICAL", "WARNING", "SUGGESTION"];

function renderCounters(active: Severity | null, counts = { CRITICAL: 3, WARNING: 5, SUGGESTION: 0 }) {
  const onChange = vi.fn();
  render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      <SeverityCounters levels={LEVELS} counts={counts} active={active} onChange={onChange} />
    </NextIntlClientProvider>,
  );
  return onChange;
}

describe("SeverityCounters", () => {
  it("renders one counter per level, including zero", () => {
    renderCounters(null);
    expect(screen.getByRole("button", { name: /3 CRITICAL/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /5 WARNING/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /0 SUGGESTION/ })).toBeDisabled();
  });

  it("click selects a level; clicking the active level clears it", () => {
    const onChange = renderCounters(null);
    fireEvent.click(screen.getByRole("button", { name: /3 CRITICAL/ }));
    expect(onChange).toHaveBeenLastCalledWith("CRITICAL");
    cleanup();

    const onChange2 = renderCounters("CRITICAL");
    expect(screen.getByRole("button", { name: /3 CRITICAL/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /5 WARNING/ })).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: /3 CRITICAL/ }));
    expect(onChange2).toHaveBeenLastCalledWith(null);
  });
});

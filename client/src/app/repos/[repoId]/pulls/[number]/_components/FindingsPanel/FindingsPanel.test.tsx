import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { FindingRecord } from "@devdigest/shared";
import messages from "../../../../../../../../messages/en/prReview.json";

const mutate = vi.fn();
vi.mock("../../../../../../../lib/hooks/reviews", () => ({
  useFindingAction: () => ({ mutate, isPending: false }),
}));

import { FindingsPanel } from "./FindingsPanel";
import { countBySeverity, visibleFindings } from "./helpers";

afterEach(cleanup);

const FINDINGS: FindingRecord[] = [
  {
    id: "f1",
    severity: "CRITICAL",
    category: "security",
    title: "Hardcoded secret",
    file: "src/config.ts",
    start_line: 11,
    end_line: 11,
    rationale: "A secret is committed.",
    suggestion: null,
    confidence: 0.95,
    kind: "finding",
    trifecta_components: null,
    evidence: null,
    review_id: "r1",
    accepted_at: null,
    dismissed_at: null,
  },
];

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview: messages }}>
      {ui}
    </NextIntlClientProvider>,
  );
}

describe("FindingsPanel (smoke)", () => {
  it("renders the toolbar + a finding card", () => {
    renderWithIntl(<FindingsPanel findings={FINDINGS} prId="pr1" />);
    expect(screen.getByText("Hide low confidence")).toBeInTheDocument();
    expect(screen.getByText("Hardcoded secret")).toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", () => {
    renderWithIntl(<FindingsPanel findings={[]} prId="pr1" />);
    expect(screen.getByText("No findings match")).toBeInTheDocument();
  });
});

// ---- Severity counters + filter (L01 homework) ------------------------------

function finding(id: string, severity: FindingRecord["severity"], confidence = 0.9): FindingRecord {
  return { ...FINDINGS[0]!, id, severity, confidence, title: `${severity} finding ${id}` };
}

// 2 CRITICAL (one low-confidence) · 3 WARNING · 1 SUGGESTION
const MIXED: FindingRecord[] = [
  finding("c1", "CRITICAL"),
  finding("c2", "CRITICAL", 0.3),
  finding("w1", "WARNING"),
  finding("w2", "WARNING"),
  finding("w3", "WARNING", 0.4),
  finding("s1", "SUGGESTION"),
];

const titles = () => screen.queryAllByText(/ finding /).map((el) => el.textContent);
const counter = (re: RegExp) => within(screen.getByRole("group")).getByRole("button", { name: re });

describe("severity helpers", () => {
  it("countBySeverity returns every level, 0 when absent", () => {
    expect(countBySeverity(MIXED)).toEqual({ CRITICAL: 2, WARNING: 3, SUGGESTION: 1 });
    expect(countBySeverity([])).toEqual({ CRITICAL: 0, WARNING: 0, SUGGESTION: 0 });
  });

  it("visibleFindings combines hide-low-confidence AND severity", () => {
    expect(visibleFindings(MIXED, false, "WARNING").map((f) => f.id)).toEqual(["w1", "w2", "w3"]);
    expect(visibleFindings(MIXED, true, "WARNING").map((f) => f.id)).toEqual(["w1", "w2"]);
  });
});

describe("FindingsPanel — severity counters + filter", () => {
  it("shows counters that match the list", () => {
    renderWithIntl(<FindingsPanel findings={MIXED} prId="pr1" />);
    expect(counter(/2 CRITICAL/)).toBeInTheDocument();
    expect(counter(/3 WARNING/)).toBeInTheDocument();
    expect(counter(/1 SUGGESTION/)).toBeInTheDocument();
    expect(titles()).toHaveLength(6);
  });

  it("click a level filters to it, another level moves the filter, re-click clears it", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderWithIntl(<FindingsPanel findings={MIXED} prId="pr1" />);

    fireEvent.click(counter(/2 CRITICAL/));
    expect(titles()).toEqual(["CRITICAL finding c1", "CRITICAL finding c2"]);
    expect(counter(/2 CRITICAL/)).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(counter(/3 WARNING/));
    expect(titles()).toHaveLength(3);
    expect(counter(/2 CRITICAL/)).toHaveAttribute("aria-pressed", "false");
    expect(counter(/3 WARNING/)).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(counter(/3 WARNING/));
    expect(titles()).toHaveLength(6);

    // Pure client-side: no request, no finding action.
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(mutate).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("works together with Hide low confidence: counts and list follow both", () => {
    renderWithIntl(<FindingsPanel findings={MIXED} prId="pr1" />);
    fireEvent.click(counter(/3 WARNING/));
    fireEvent.click(screen.getByRole("switch"));
    expect(counter(/2 WARNING/)).toHaveAttribute("aria-pressed", "true");
    expect(counter(/1 CRITICAL/)).toBeInTheDocument();
    expect(titles()).toEqual(["WARNING finding w1", "WARNING finding w2"]);
  });

  it("a level with no findings reads 0; an emptied list shows the empty state", () => {
    renderWithIntl(<FindingsPanel findings={[finding("c2", "CRITICAL", 0.3)]} prId="pr1" />);
    expect(counter(/0 WARNING/)).toBeDisabled();
    fireEvent.click(counter(/1 CRITICAL/));
    fireEvent.click(screen.getByRole("switch"));
    expect(screen.getByText("No findings match")).toBeInTheDocument();
  });
});

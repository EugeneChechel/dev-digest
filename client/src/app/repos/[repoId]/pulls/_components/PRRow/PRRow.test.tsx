import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { PrMeta } from "@/lib/types";
import prReview from "../../../../../../../messages/en/prReview.json";
import common from "../../../../../../../messages/en/common.json";
import { PRRow } from "./PRRow";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

afterEach(cleanup);

function pr(o: Partial<PrMeta>): PrMeta {
  return {
    id: "p1",
    number: 482,
    title: "Add rate limiting to public API endpoints",
    author: "marisa.koch",
    branch: "feat/rl",
    base: "main",
    head_sha: "abc",
    additions: 247,
    deletions: 38,
    files_count: 9,
    status: "needs_review",
    opened_at: null,
    updated_at: new Date().toISOString(),
    score: 61,
    ...o,
  } as PrMeta;
}

function renderRow(p: PrMeta) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ prReview, common }}>
      <PRRow pr={p} repoId="r1" />
    </NextIntlClientProvider>,
  );
}

describe("PRRow — COST cell (M1)", () => {
  it("shows the latest round's cost compactly", () => {
    renderRow(pr({ cost_usd: 0.0142 }));
    expect(screen.getByText("$0.014")).toBeInTheDocument();
  });

  it("an unreviewed PR shows an em-dash, never $0.00", () => {
    renderRow(pr({ score: null, cost_usd: null }));
    expect(screen.queryByText(/\$/)).toBeNull();
    // score cell and cost cell both read "—"
    expect(screen.getAllByText("—")).toHaveLength(2);
  });
});

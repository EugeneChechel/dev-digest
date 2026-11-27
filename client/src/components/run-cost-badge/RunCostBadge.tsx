/* RunCostBadge: compact spend display for a review run (M1). Ported from the
   design's CostBadge. Two variants:
     compact → "$0.014"
     full    → "$0.014 · 8.2K→1.3K" (tokens muted)
   Unknown cost (null/undefined) renders a muted "—", never "$0.00". */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { formatTokenPair, formatUsd, NO_VALUE } from "@/lib/format";

export interface RunCostBadgeProps {
  usd: number | null | undefined;
  tokensIn?: number | null;
  tokensOut?: number | null;
  variant?: "compact" | "full";
  style?: React.CSSProperties;
}

const base: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontSize: 11.5,
  fontWeight: 500,
  whiteSpace: "nowrap",
};

export function RunCostBadge({ usd, tokensIn, tokensOut, variant = "compact", style }: RunCostBadgeProps) {
  const t = useTranslations("common");
  if (usd == null) {
    return (
      <span className="mono" style={{ ...base, color: "var(--text-muted)", ...style }}>
        {NO_VALUE}
      </span>
    );
  }
  const showTokens = variant === "full" && tokensIn != null && tokensOut != null;
  return (
    <span className="mono tnum" title={t("cost.tooltip")} style={{ ...base, color: "var(--text-secondary)", ...style }}>
      {formatUsd(usd)}
      {showTokens && (
        <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>· {formatTokenPair(tokensIn, tokensOut)}</span>
      )}
    </span>
  );
}

export default RunCostBadge;

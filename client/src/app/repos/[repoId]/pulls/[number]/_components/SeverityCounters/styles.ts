import type { CSSProperties } from "react";

/** Co-located styles for SeverityCounters. */
export const s = {
  row: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } satisfies CSSProperties,
  /**
   * Counter pill. Active = filled with its SEV colour; while another level is
   * active the rest are muted, so the filter state reads even from a screenshot.
   */
  pill: ({
    color,
    bg,
    active,
    dimmed,
    empty,
  }: {
    color: string;
    bg: string;
    active: boolean;
    dimmed: boolean;
    empty: boolean;
  }): CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11.5,
    fontWeight: 700,
    letterSpacing: "0.04em",
    fontFamily: "inherit",
    color: active ? "var(--bg-elevated)" : dimmed || empty ? "var(--text-muted)" : color,
    background: active ? color : dimmed ? "transparent" : bg,
    border: `1px solid ${dimmed || empty ? "var(--border)" : color}`,
    opacity: dimmed ? 0.6 : empty ? 0.5 : 1,
    cursor: empty && !active ? "default" : "pointer",
    transition: "background .12s, color .12s, opacity .12s",
  }),
} as const;

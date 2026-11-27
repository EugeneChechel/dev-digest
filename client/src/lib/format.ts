/* Shared number formatters for run cost / token displays (M1 Run Cost Badge). */

/** Placeholder for "no data": a run without a known cost is "—", never "$0.00". */
export const NO_VALUE = "—";

/**
 * Compact USD: ≥ $1 → 2 dp, ≥ $0.01 → 3 dp, below that 4 dp so cheap runs
 * (e.g. $0.0013) don't collapse to "$0.001" / "$0.00". null/undefined → "—".
 */
export function formatUsd(usd: number | null | undefined): string {
  if (usd == null || !Number.isFinite(usd)) return NO_VALUE;
  const abs = Math.abs(usd);
  const digits = abs >= 1 ? 2 : abs >= 0.01 || abs === 0 ? 3 : 4;
  return `$${usd.toFixed(digits)}`;
}

/** Token count: 950 → "950", 8_200 → "8.2K", 15_000 → "15K", 1_250_000 → "1.3M". */
export function formatTokenCount(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${trimZero((n / 1000).toFixed(1))}K`;
  return `${trimZero((n / 1_000_000).toFixed(1))}M`;
}

/** Input→output token pair, e.g. "8.2K→1.3K". */
export function formatTokenPair(tokensIn: number, tokensOut: number): string {
  return `${formatTokenCount(tokensIn)}→${formatTokenCount(tokensOut)}`;
}

function trimZero(s: string): string {
  return s.endsWith(".0") ? s.slice(0, s.length - 2) : s;
}

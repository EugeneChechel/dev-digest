/* SeverityCounters: "3 CRITICAL · 5 WARNING · 2 SUGGESTION" row above a run's
   findings list. Each counter is a toggle that filters the list to its level.
   Pure presentational: counts come from findings the panel already has, so a
   click never hits the server or runs a model. */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Icon, SEV } from "@devdigest/ui";
import type { Severity } from "@devdigest/shared";
import { s } from "./styles";

export function SeverityCounters({
  levels,
  counts,
  active,
  onChange,
}: {
  levels: Severity[];
  counts: Record<Severity, number>;
  /** The level the list is filtered to; null = no filter. */
  active: Severity | null;
  /** Called with the new level, or null to clear the filter. */
  onChange: (level: Severity | null) => void;
}) {
  const t = useTranslations("prReview");
  return (
    <div role="group" aria-label={t("panel.severity.groupLabel")} style={s.row}>
      {levels.map((level) => {
        const sev = SEV[level];
        const I = Icon[sev.icon];
        const count = counts[level] ?? 0;
        const isActive = active === level;
        const dimmed = active != null && !isActive;
        return (
          <button
            key={level}
            type="button"
            aria-pressed={isActive}
            disabled={count === 0 && !isActive}
            title={isActive ? t("panel.severity.clearFilter") : t("panel.severity.filterBy", { level })}
            onClick={() => onChange(isActive ? null : level)}
            style={s.pill({ color: sev.c, bg: sev.bg, active: isActive, dimmed, empty: count === 0 })}
          >
            <I size={12} />
            <span className="tnum">{t(`panel.severity.${level}`, { count })}</span>
          </button>
        );
      })}
    </div>
  );
}

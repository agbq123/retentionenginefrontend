"use client";

import { useEffect, useState } from "react";

const AUTO_DISMISS_MS = 10_000;
const FADE_MS = 400;

export function UrgentBanner({
  revenueAtRiskLabel,
  atRiskClientCount,
  highRiskCount,
}: {
  revenueAtRiskLabel: string;
  atRiskClientCount: number;
  highRiskCount: number;
}) {
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const startFade = window.setTimeout(
      () => setFading(true),
      AUTO_DISMISS_MS - FADE_MS,
    );
    const unmount = window.setTimeout(() => setMounted(false), AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(startFade);
      window.clearTimeout(unmount);
    };
  }, []);

  if (!mounted || atRiskClientCount <= 0) return null;

  const mediumRiskCount = atRiskClientCount - highRiskCount;

  return (
    <div
      className={`border-b border-amber-500/25 bg-gradient-to-r from-amber-950/50 via-amber-950/35 to-orange-950/40 transition-opacity duration-300 ease-out ${fading ? "pointer-events-none opacity-0" : "opacity-100"}`}
      role="status"
    >
      <div className="mx-auto flex max-w-7xl items-start gap-3 px-4 py-3.5 sm:items-center sm:px-6 lg:px-8">
        <span
          className="mt-0.5 shrink-0 text-lg leading-none sm:mt-0"
          aria-hidden
        >
          ⚠️
        </span>
        <div className="min-w-0">
          <p className="text-sm leading-snug text-amber-100/95">
            <span className="font-semibold text-amber-50">Revenue at risk:</span>{" "}
            you could lose about{" "}
            <span className="font-semibold tabular-nums text-amber-50">
              {revenueAtRiskLabel}
            </span>{" "}
            if{" "}
            <span className="font-semibold tabular-nums text-amber-50">
              {atRiskClientCount}
            </span>{" "}
            at-risk {atRiskClientCount === 1 ? "client" : "clients"} churn.
          </p>
          <p className="mt-1.5 text-xs text-zinc-500">
            {highRiskCount} high-risk, {mediumRiskCount} medium-risk
          </p>
        </div>
      </div>
    </div>
  );
}

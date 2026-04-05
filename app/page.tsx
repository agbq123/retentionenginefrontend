import { QuickCampaigns } from "@/components/quick-campaigns";
import { SendSmsPreviewButton } from "@/components/send-sms-preview-button";
import { UrgentBanner } from "@/components/urgent-banner";
import {
  clients,
  dashboardMetrics,
  getRecommendation,
  topOpportunities,
  type Client,
  type RiskLevel,
} from "@/lib/mock-clients";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function riskLabel(risk: RiskLevel) {
  switch (risk) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
  }
}

const riskAccentBorder: Record<RiskLevel, string> = {
  high: "border-red-500/55",
  medium: "border-amber-500/50",
  low: "border-emerald-500/45",
};

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    high:
      "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/35",
    medium:
      "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-500/35",
    low:
      "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/35",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[risk]}`}
    >
      {riskLabel(risk)}
    </span>
  );
}

function RecommendationNote({ risk }: { risk: RiskLevel }) {
  return (
    <div
      className={`rounded-r-md border-l-2 ${riskAccentBorder[risk]} bg-zinc-800/40 py-1.5 pl-2.5 pr-2`}
    >
      <p className="text-xs font-medium leading-snug text-zinc-200">
        {getRecommendation(risk)}
      </p>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 shadow-sm shadow-black/20 backdrop-blur-sm">
      <p className="text-sm font-medium text-zinc-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-zinc-500">{hint}</p>
      ) : null}
    </div>
  );
}

function OpportunityRow({ client, rank }: { client: Client; rank: number }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-800/60 py-3 last:border-0">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-sm font-semibold text-violet-300">
          {rank}
        </span>
        <div className="min-w-0">
          <p className="truncate font-medium text-zinc-100">{client.name}</p>
          <div className="mt-0.5">
            <RiskBadge risk={client.risk} />
          </div>
          <p className="mt-1.5 text-xs text-zinc-500">
            Last visit {client.lastVisitDaysAgo} days ago ·{" "}
            {client.visitsPerMonth}{" "}
            {client.visitsPerMonth === 1 ? "visit" : "visits"}/mo
          </p>
          <div className="mt-2 max-w-[220px]">
            <RecommendationNote risk={client.risk} />
          </div>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold tabular-nums text-zinc-200">
        {formatCurrency(client.recoveryValue)}
      </p>
    </div>
  );
}

export default function Home() {
  const { revenueAtRisk, highRiskCount, atRiskClientCount, totalClients } =
    dashboardMetrics(clients);
  const opportunities = topOpportunities(clients, 5);

  return (
    <div className="flex flex-1 flex-col bg-zinc-950">
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-violet-400">
              Barber retention
            </p>
            <h1 className="mt-1 text-xl font-semibold text-zinc-50 sm:text-2xl">
              Dashboard
            </h1>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-xs text-zinc-500">Today</p>
            <p className="text-sm font-medium text-zinc-300">
              {new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }).format(new Date())}
            </p>
          </div>
        </div>
      </header>

      {atRiskClientCount > 0 ? (
        <UrgentBanner
          revenueAtRiskLabel={formatCurrency(revenueAtRisk)}
          atRiskClientCount={atRiskClientCount}
          highRiskCount={highRiskCount}
        />
      ) : null}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total revenue at risk"
            value={formatCurrency(revenueAtRisk)}
            hint="Sum of recovery value for medium & high risk clients"
          />
          <StatCard
            title="High-risk clients"
            value={String(highRiskCount)}
            hint="Clients flagged for churn risk"
          />
          <StatCard
            title="Total clients"
            value={String(totalClients)}
            hint="Active profiles in retention engine"
          />
        </section>

        <section
          className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-5 shadow-sm shadow-black/20"
          aria-labelledby="playbook-heading"
        >
          <h2
            id="playbook-heading"
            className="text-sm font-semibold text-zinc-200"
          >
            Action playbook
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Default SMS angles by risk tier—tune per client
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-3">
            {(["high", "medium", "low"] as const).map((risk) => (
              <div
                key={risk}
                className="flex flex-col gap-2 rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3"
              >
                <RiskBadge risk={risk} />
                <p className="text-sm text-zinc-300">
                  {getRecommendation(risk)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <QuickCampaigns
          highRiskCount={highRiskCount}
          atRiskClientCount={atRiskClientCount}
          totalClients={totalClients}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100">
                  Clients
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Risk, visit cadence, recommended action, and recovery value
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 shadow-sm shadow-black/20">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1040px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-900/80">
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        Name
                      </th>
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        Risk
                      </th>
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        Recommendation
                      </th>
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        Last visit
                      </th>
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        Visits / mo
                      </th>
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        Recovery value
                      </th>
                      <th className="px-5 py-3.5 font-medium text-zinc-400">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {clients.map((client) => (
                      <tr
                        key={client.id}
                        className="transition-colors hover:bg-zinc-800/30"
                      >
                        <td className="px-5 py-4 font-medium text-zinc-100">
                          {client.name}
                        </td>
                        <td className="px-5 py-4">
                          <RiskBadge risk={client.risk} />
                        </td>
                        <td className="max-w-[200px] px-5 py-4">
                          <RecommendationNote risk={client.risk} />
                        </td>
                        <td className="px-5 py-4 tabular-nums text-zinc-300">
                          {client.lastVisitDaysAgo} days ago
                        </td>
                        <td className="px-5 py-4 tabular-nums text-zinc-300">
                          {client.visitsPerMonth}
                        </td>
                        <td className="px-5 py-4 tabular-nums text-zinc-300">
                          {formatCurrency(client.recoveryValue)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <SendSmsPreviewButton
                            clientName={client.name}
                            lastVisitDaysAgo={client.lastVisitDaysAgo}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-zinc-100">
                Top opportunities
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Top 5 by recovery value
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-2 shadow-sm shadow-black/20">
              {opportunities.map((client, i) => (
                <OpportunityRow
                  key={client.id}
                  client={client}
                  rank={i + 1}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

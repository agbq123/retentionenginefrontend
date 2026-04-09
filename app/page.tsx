import { QuickCampaigns } from "@/components/quick-campaigns";
import { SendSmsPreviewButton } from "@/components/send-sms-preview-button";
import { UrgentBanner } from "@/components/urgent-banner";
import {
  getClients,
  getDashboard,
  getTopOpportunities,
  type Client,
  type RiskLevel,
} from "@/lib/api";

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

function getRecommendation(risk: RiskLevel) {
  switch (risk) {
    case "high":
      return "Send a strong win-back SMS with a clear call to book this week.";
    case "medium":
      return "Send a friendly reminder SMS and highlight convenience or availability.";
    case "low":
      return "Keep warm with a light-touch check-in or loyalty-style message.";
  }
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    high: "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/35",
    medium:
      "bg-amber-500/15 text-amber-200 ring-1 ring-inset ring-amber-500/35",
    low: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/35",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[risk]}`}
    >
      {riskLabel(risk)}
    </span>
  );
}

function RecommendationNote({ risk }: { risk: RiskLevel }) {
  return <p className="text-sm text-zinc-400">{getRecommendation(risk)}</p>;
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
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm">
      <div className="text-sm text-zinc-400">{title}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
        {value}
      </div>
      {hint ? <div className="mt-2 text-sm text-zinc-500">{hint}</div> : null}
    </div>
  );
}

function OpportunityRow({ client, rank }: { client: Client; rank: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/20 text-sm font-semibold text-violet-300">
          {rank}
        </div>
        <div>
          <div className="font-medium text-zinc-100">{client.name}</div>
          <div className="text-sm text-zinc-400">
            Last visit {client.lastVisitDaysAgo} days ago ·{" "}
            {client.visitsPerMonth}{" "}
            {client.visitsPerMonth === 1 ? "visit" : "visits"}/mo
          </div>
        </div>
      </div>
      <div className="text-right font-semibold text-zinc-100">
        {formatCurrency(client.recoveryValue)}
      </div>
    </div>
  );
}

export default async function Home() {
  const [dashboard, clients, opportunities] = await Promise.all([
    getDashboard(),
    getClients(),
    getTopOpportunities(),
  ]);

  const { revenueAtRisk, highRiskCount, atRiskClientCount, totalClients } =
    dashboard;

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-violet-300">
              Barber retention
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>

          <div className="text-sm text-zinc-400">
            Today{" "}
            {new Intl.DateTimeFormat("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(new Date())}
          </div>
        </div>

        {atRiskClientCount > 0 ? (
          <UrgentBanner
            revenueAtRiskLabel={formatCurrency(revenueAtRisk)}
            atRiskClientCount={atRiskClientCount}
            highRiskCount={highRiskCount}
          />
        ) : null}

        <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total clients" value={String(totalClients)} />
          <StatCard title="High risk clients" value={String(highRiskCount)} />
          <StatCard title="At-risk clients" value={String(atRiskClientCount)} />
          <StatCard
            title="Revenue at risk"
            value={formatCurrency(revenueAtRisk)}
          />
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Action playbook
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Default SMS angles by risk tier—tune per client
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(["high", "medium", "low"] as const).map((risk) => (
              <div
                key={risk}
                className={`rounded-2xl border bg-zinc-900/50 p-5 ${riskAccentBorder[risk]}`}
              >
                <RiskBadge risk={risk} />
                <div className="mt-3">
                  <RecommendationNote risk={risk} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Clients</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Risk, visit cadence, recommended action, and recovery value
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-zinc-900/80 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Risk</th>
                    <th className="px-4 py-3 font-medium">Recommendation</th>
                    <th className="px-4 py-3 font-medium">Last visit</th>
                    <th className="px-4 py-3 font-medium">Visits / mo</th>
                    <th className="px-4 py-3 font-medium">Recovery value</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-t border-zinc-800 align-top"
                    >
                      <td className="px-4 py-4 font-medium text-zinc-100">
                        {client.name}
                      </td>
                      <td className="px-4 py-4">
                        <RiskBadge risk={client.risk} />
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        <div>
                          <div>{client.recommendation}</div>

                          <div className="mt-1 text-xs text-zinc-500">
                            {client.reason}
                          </div>

                          <div className="mt-1 text-xs text-zinc-600">
                            Confidence: {client.confidence}
                          </div>

                          {client.hasUpcomingAppointment && (
                            <div className="mt-1 text-xs text-emerald-400">
                              Already has upcoming appointment
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {client.lastVisitDaysAgo} days ago
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {client.visitsPerMonth}
                      </td>
                      <td className="px-4 py-4 font-medium text-zinc-100">
                        {formatCurrency(client.recoveryValue)}
                      </td>
                      <td className="px-4 py-4">
                        <SendSmsPreviewButton
                          clientName={client.name}
                          lastVisitDaysAgo={client.lastVisitDaysAgo}
                        />
                      </td>
                    </tr>
                  ))}
                  {clients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-zinc-500"
                      >
                        No clients found yet. Run your Square sync first.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <QuickCampaigns
            highRiskCount={highRiskCount}
            atRiskClientCount={atRiskClientCount}
            totalClients={totalClients}
          />

          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Top opportunities
              </h2>
              <p className="mt-1 text-sm text-zinc-400">
                Top 5 by recovery value
              </p>
            </div>

            <div className="space-y-3">
              {opportunities.map((client, i) => (
                <OpportunityRow key={client.id} client={client} rank={i + 1} />
              ))}
              {opportunities.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-6 text-sm text-zinc-500">
                  No opportunity data yet.
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

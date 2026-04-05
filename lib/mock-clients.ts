export type RiskLevel = "high" | "medium" | "low";

export function getRecommendation(risk: RiskLevel): string {
  if (risk === "high") return "Send reminder ASAP";
  if (risk === "medium") return "Offer 10% discount";
  return "Check-in message";
}

export type Client = {
  id: string;
  name: string;
  risk: RiskLevel;
  recoveryValue: number;
  lastVisitDaysAgo: number;
  visitsPerMonth: number;
};

export const clients: Client[] = [
  {
    id: "1",
    name: "Client 0",
    risk: "high",
    recoveryValue: 303,
    lastVisitDaysAgo: 42,
    visitsPerMonth: 2,
  },
  {
    id: "2",
    name: "Client 1",
    risk: "high",
    recoveryValue: 278,
    lastVisitDaysAgo: 56,
    visitsPerMonth: 1,
  },
  {
    id: "3",
    name: "Client 2",
    risk: "medium",
    recoveryValue: 195,
    lastVisitDaysAgo: 28,
    visitsPerMonth: 2,
  },
  {
    id: "4",
    name: "Client 3",
    risk: "low",
    recoveryValue: 88,
    lastVisitDaysAgo: 12,
    visitsPerMonth: 3,
  },
  {
    id: "5",
    name: "Client 4",
    risk: "high",
    recoveryValue: 412,
    lastVisitDaysAgo: 63,
    visitsPerMonth: 1,
  },
  {
    id: "6",
    name: "Client 5",
    risk: "medium",
    recoveryValue: 156,
    lastVisitDaysAgo: 21,
    visitsPerMonth: 2,
  },
  {
    id: "7",
    name: "Client 6",
    risk: "low",
    recoveryValue: 64,
    lastVisitDaysAgo: 9,
    visitsPerMonth: 4,
  },
  {
    id: "8",
    name: "Client 7",
    risk: "medium",
    recoveryValue: 142,
    lastVisitDaysAgo: 35,
    visitsPerMonth: 2,
  },
  {
    id: "9",
    name: "Client 8",
    risk: "low",
    recoveryValue: 71,
    lastVisitDaysAgo: 18,
    visitsPerMonth: 3,
  },
  {
    id: "10",
    name: "Client 9",
    risk: "high",
    recoveryValue: 365,
    lastVisitDaysAgo: 48,
    visitsPerMonth: 2,
  },
];

export function dashboardMetrics(all: Client[]) {
  const highRiskCount = all.filter((c) => c.risk === "high").length;
  const atRiskClients = all.filter(
    (c) => c.risk === "high" || c.risk === "medium",
  );
  const revenueAtRisk = atRiskClients.reduce(
    (sum, c) => sum + c.recoveryValue,
    0,
  );
  return {
    totalClients: all.length,
    highRiskCount,
    revenueAtRisk,
    atRiskClientCount: atRiskClients.length,
  };
}

export function topOpportunities(all: Client[], limit = 5): Client[] {
  return [...all].sort((a, b) => b.recoveryValue - a.recoveryValue).slice(0, limit);
}

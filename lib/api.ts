export type RiskLevel = "high" | "medium" | "low";

export type Client = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;

  risk: RiskLevel;
  riskScore: number;

  recommendation: string;
  reason: string;
  confidence: string;

  lastVisitDaysAgo: number;
  cadenceDays: number;
  expectedNextVisit: string | null;
  daysLate: number;

  hasUpcomingAppointment: boolean;
  upcomingAppointmentDate: string | null;

  visitsPerMonth: number;
  recoveryValue: number;

  visitCount: number;
  lifetimeValue: number;
  avgTicket: number;

  firstVisit: string | null;
  lastVisit: string | null;
};

export type DashboardMetrics = {
  totalClients: number;
  highRiskCount: number;
  atRiskClientCount: number;
  revenueAtRisk: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getDashboard(): Promise<DashboardMetrics> {
  return fetchJson<DashboardMetrics>("/api/dashboard");
}

export async function getClients(): Promise<Client[]> {
  const data = await fetchJson<{ clients: Client[] }>("/api/clients");
  return data.clients;
}

export async function getTopOpportunities(): Promise<Client[]> {
  const data = await fetchJson<{ clients: Client[] }>(
    "/api/clients/top-opportunities"
  );
  return data.clients;
}
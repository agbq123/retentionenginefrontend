export type RiskLevel = "high" | "medium" | "low";

export type Client = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  risk: RiskLevel;
  recommendation: string;
  lastVisitDaysAgo: number;
  visitsPerMonth: number;
  recoveryValue: number;
  visitCount: number;
  lifetimeValue: number;
  firstVisit: string | null;
  lastVisit: string | null;
  hasUpcomingAppointment: boolean;
  upcomingAppointmentDate: string | null;
  reason: string;
  confidence: string;
  daysLate: number;
  cadenceDays: number;
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

export async function syncSquare(): Promise<{
  status: string;
  counts: Record<string, number>;
}> {
  const res = await fetch(`${API_BASE}/integrations/square/sync`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Square sync failed");
  }

  return data;
}
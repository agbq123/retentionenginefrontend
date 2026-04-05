export type RecipientSegment = "high" | "atRisk" | "all";

export type QuickCampaign = {
  id: string;
  label: string;
  /** Shown in modal as "Campaign: …" */
  modalTitle: string;
  defaultMessage: string;
  segment: RecipientSegment;
};

export const quickCampaigns: QuickCampaign[] = [
  {
    id: "high-risk-recovery",
    label: "High-Risk Recovery",
    modalTitle: "High-Risk Recovery",
    defaultMessage: "Hey! We miss you — come back for 10% off.",
    segment: "high",
  },
  {
    id: "we-miss-you",
    label: "We Miss You",
    modalTitle: "We Miss You",
    defaultMessage:
      "Hey! We haven't seen you in a while—we miss you at the shop. Book your next cut and we'll have your chair ready.",
    segment: "atRisk",
  },
  {
    id: "ten-percent-off",
    label: "10% Off Next Cut",
    modalTitle: "10% Off Next Cut",
    defaultMessage:
      "Come back soon! Take 10% off your next cut when you book this week. Reply to this message and we'll get you scheduled.",
    segment: "atRisk",
  },
  {
    id: "refer-friend",
    label: "Refer a Friend",
    modalTitle: "Refer a Friend",
    defaultMessage:
      "Love your cut? Refer a friend to the shop—when they book their first visit, you both get a perk on your next service. Ask us for details!",
    segment: "all",
  },
];

export function recipientCountForSegment(
  segment: RecipientSegment,
  counts: {
    highRiskCount: number;
    atRiskClientCount: number;
    totalClients: number;
  },
): number {
  switch (segment) {
    case "high":
      return counts.highRiskCount;
    case "atRisk":
      return counts.atRiskClientCount;
    case "all":
      return counts.totalClients;
  }
}

"use client";

import { useMemo, useState } from "react";
import { SmsComposerModal } from "@/components/sms-composer-modal";
import {
  quickCampaigns,
  recipientCountForSegment,
  type QuickCampaign,
} from "@/lib/quick-campaigns";

type Counts = {
  highRiskCount: number;
  atRiskClientCount: number;
  totalClients: number;
};

export function QuickCampaigns({
  highRiskCount,
  atRiskClientCount,
  totalClients,
}: Counts) {
  const [active, setActive] = useState<QuickCampaign | null>(null);

  const counts = useMemo(
    () => ({ highRiskCount, atRiskClientCount, totalClients }),
    [highRiskCount, atRiskClientCount, totalClients],
  );

  const recipientCount = active
    ? recipientCountForSegment(active.segment, counts)
    : 0;

  function openCampaign(campaign: QuickCampaign) {
    setActive(campaign);
  }

  function close() {
    setActive(null);
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-zinc-800/80 bg-zinc-900/25 p-5 shadow-sm shadow-black/20"
      aria-labelledby="quick-campaigns-heading"
    >
      <h2
        id="quick-campaigns-heading"
        className="text-sm font-semibold text-zinc-200"
      >
        Campaigns
      </h2>
      <p className="mt-1 text-xs text-zinc-500">
        One click opens a preview—edit the text, then send when your SMS
        provider is connected.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickCampaigns.map((campaign) => (
          <button
            key={campaign.id}
            type="button"
            onClick={() => openCampaign(campaign)}
            className="rounded-xl border border-zinc-700/90 bg-zinc-950/50 px-4 py-2.5 text-left text-sm font-medium text-zinc-200 transition hover:border-violet-500/40 hover:bg-zinc-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            {campaign.label}
          </button>
        ))}
      </div>

      {active ? (
        <SmsComposerModal
          open
          onClose={close}
          campaignTitle={active.modalTitle}
          recipientCount={recipientCount}
          defaultMessage={active.defaultMessage}
          onSend={(message) => {
            console.info("[demo] Campaign would send:", {
              campaignId: active.id,
              campaignTitle: active.modalTitle,
              recipientCount,
              message,
            });
          }}
        />
      ) : null}
    </section>
  );
}

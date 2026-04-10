"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { syncSquare } from "@/lib/api";

export function SyncSquareButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSync = async () => {
    try {
      setLoading(true);
      setMessage("");

      await syncSquare();

      setMessage("Square sync completed");
      router.refresh();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Square sync failed";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-xl border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Syncing..." : "Sync Square"}
      </button>

      {message ? (
        <div className="text-xs text-zinc-400">{message}</div>
      ) : null}
    </div>
  );
}
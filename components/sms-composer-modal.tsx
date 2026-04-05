"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  campaignTitle: string;
  recipientCount: number;
  defaultMessage: string;
  onSend: (message: string) => void;
};

export function SmsComposerModal({
  open,
  onClose,
  campaignTitle,
  recipientCount,
  defaultMessage,
  onSend,
}: Props) {
  const [draft, setDraft] = useState("");
  const titleId = useId();
  const fieldId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setDraft(defaultMessage);
    const id = window.requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, defaultMessage]);

  if (!open) return null;

  const canSend =
    recipientCount > 0 && draft.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-2xl border border-zinc-700/90 bg-zinc-900 p-6 shadow-2xl shadow-black/40"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id={titleId}
          className="text-base font-semibold tracking-tight text-zinc-50"
        >
          Campaign: {campaignTitle}
        </h2>

        <p className="mt-3 text-sm text-zinc-400">
          <span className="font-medium text-zinc-300">Recipients:</span>{" "}
          <span className="tabular-nums text-zinc-200">{recipientCount}</span>{" "}
          {recipientCount === 1 ? "client" : "clients"}
        </p>

        {recipientCount === 0 ? (
          <p className="mt-2 rounded-lg border border-amber-500/25 bg-amber-950/30 px-3 py-2 text-xs text-amber-200/90">
            No clients match this campaign right now—you can still edit the
            message for later.
          </p>
        ) : null}

        <label
          htmlFor={fieldId}
          className="mt-5 block text-xs font-medium uppercase tracking-wider text-zinc-500"
        >
          Message
        </label>
        <textarea
          ref={textareaRef}
          id={fieldId}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={5}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950/90 px-3.5 py-3 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
        />
        <p className="mt-1.5 text-xs text-zinc-600">Edit message above</p>

        <p className="mt-4 text-xs text-zinc-500">
          Demo only—connect your SMS provider to send for real.
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-600 bg-transparent px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSend(draft.trim());
              onClose();
            }}
            disabled={!canSend}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send Campaign
          </button>
        </div>
      </div>
    </div>
  );
}

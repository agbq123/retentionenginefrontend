"use client";

import { useEffect, useId, useRef, useState } from "react";

function buildDefaultMessage(
  clientName: string,
  lastVisitDaysAgo: number,
): string {
  return `Hey ${clientName}! We haven't seen you in a while — it's been about ${lastVisitDaysAgo} days since your last visit. Book your next cut whenever you're ready; we'd love to have you back.`;
}

export function SendSmsPreviewButton({
  clientName,
  lastVisitDaysAgo,
}: {
  clientName: string;
  lastVisitDaysAgo: number;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const titleId = useId();
  const bodyId = useId();
  const fieldId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  function openModal() {
    setDraft(buildDefaultMessage(clientName, lastVisitDaysAgo));
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function handleSend() {
    // Replace with API call when backend is ready
    console.info("[demo] SMS would send:", draft);
    close();
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        Send SMS
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            className="w-full max-w-lg rounded-2xl border border-zinc-700/90 bg-zinc-900 p-6 shadow-2xl shadow-black/40"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              id={titleId}
              className="text-xs font-medium uppercase tracking-wider text-violet-400"
            >
              SMS preview
            </p>
            <p id={bodyId} className="sr-only">
              Edit the message below, then send or cancel. Demo only—no SMS is
              delivered.
            </p>

            <label
              htmlFor={fieldId}
              className="mt-4 block text-sm font-medium text-zinc-300"
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
            <p className="mt-2 text-xs text-zinc-500">
              Demo only—nothing is sent until your SMS provider is connected.
            </p>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-zinc-600 bg-transparent px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSend}
                disabled={!draft.trim()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

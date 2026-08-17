"use client";

import { useTransition } from "react";
import { createCheckoutSession, createPortalSession } from "@/lib/actions/billing";

export function SubscribeButton({ label }: { label: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => createCheckoutSession())}
      disabled={isPending}
      className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink hover:bg-amber-dark disabled:opacity-60"
    >
      {isPending ? "Abrindo checkout…" : label}
    </button>
  );
}

export function ManageSubscriptionButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => createPortalSession())}
      disabled={isPending}
      className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
    >
      {isPending ? "Abrindo…" : "Gerenciar assinatura"}
    </button>
  );
}

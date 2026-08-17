"use client";

import { useActionState } from "react";
import { updateBusinessProfile } from "@/lib/actions/fiscal";
import { FormField } from "@/components/FormField";

export function BusinessProfileForm({
  businessName,
  phone,
}: {
  businessName: string | null;
  phone: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    updateBusinessProfile,
    null
  );

  return (
    <form action={formAction} className="mt-3 space-y-4">
      {state?.success && (
        <p className="rounded-lg bg-status-done-bg px-3 py-2 text-sm text-status-done">
          Dados salvos.
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Nome do negócio"
          name="businessName"
          placeholder="Ex: Elétrica Pereira"
          defaultValue={businessName ?? undefined}
        />
        <FormField
          label="Telefone/WhatsApp"
          name="phone"
          placeholder="(11) 99999-9999"
          defaultValue={phone ?? undefined}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar"}
      </button>
    </form>
  );
}

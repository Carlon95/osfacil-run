"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { updateClient } from "@/lib/actions/clients";
import { FormField } from "@/components/FormField";

type ClientData = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  document: string | null;
  zipCode: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
};

export function EditClientForm({ client }: { client: ClientData }) {
  const router = useRouter();
  const updateClientWithId = updateClient.bind(null, client.id);
  const [state, formAction, pending] = useActionState(
    updateClientWithId,
    null
  );

  return (
    <form
      action={formAction}
      className="mt-4 space-y-6 rounded-2xl border border-line bg-paper p-5"
    >
      {state?.error && (
        <p className="rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {state.error}
        </p>
      )}

      {/* Dados básicos */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Dados básicos
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">Nome</label>
            <input
              name="name"
              required
              defaultValue={client.name}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-ink"
            />
          </div>
          <FormField
            label="Telefone"
            name="phone"
            placeholder="(11) 99999-9999"
            defaultValue={client.phone ?? undefined}
          />
          <FormField
            label="E-mail"
            name="email"
            type="email"
            placeholder="cliente@exemplo.com"
            defaultValue={client.email ?? undefined}
          />
          <FormField
            label="CPF/CNPJ"
            name="document"
            placeholder="000.000.000-00"
            defaultValue={client.document ?? undefined}
          />
        </div>
      </section>

      {/* Endereço */}
      <section className="border-t border-dashed border-line pt-5">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Endereço
        </h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="CEP"
            name="zipCode"
            placeholder="00000-000"
            className="sm:col-span-1"
            defaultValue={client.zipCode ?? undefined}
          />
          <FormField
            label="Endereço (rua e número)"
            name="address"
            placeholder="Rua das Flores, 123"
            className="sm:col-span-1"
            defaultValue={client.address ?? undefined}
          />
          <FormField
            label="Bairro"
            name="neighborhood"
            defaultValue={client.neighborhood ?? undefined}
          />
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Cidade"
              name="city"
              className="col-span-2"
              defaultValue={client.city ?? undefined}
            />
            <FormField
              label="UF"
              name="state"
              placeholder="SP"
              defaultValue={client.state ?? undefined}
            />
          </div>
        </div>
      </section>

      {/* Observações */}
      <section className="border-t border-dashed border-line pt-5">
        <label className="text-sm font-medium text-ink">
          Observações{" "}
          <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <textarea
          name="notes"
          rows={2}
          defaultValue={client.notes ?? undefined}
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-ink"
          placeholder="Referência de acesso, preferência de horário, etc."
        />
      </section>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {pending ? "Salvando…" : "Salvar alterações"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/clientes")}
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

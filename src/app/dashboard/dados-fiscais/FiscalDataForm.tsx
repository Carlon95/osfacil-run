"use client";

import { useActionState } from "react";
import { updateFiscalData } from "@/lib/actions/fiscal";
import { FormField } from "@/components/FormField";

type FiscalData = {
  cnpj: string | null;
  inscricaoMunicipal: string | null;
  codigoMunicipio: string | null;
  optanteSimplesNacional: boolean | null;
  codigoServicoMunicipal: string | null;
  aliquotaIss: number | null;
};

export function FiscalDataForm({ data }: { data: FiscalData }) {
  const [state, formAction, pending] = useActionState(updateFiscalData, null);

  return (
    <form
      action={formAction}
      className="mt-6 space-y-5 rounded-2xl border border-line bg-paper p-5"
    >
      {state?.error && (
        <p className="rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg bg-status-done-bg px-3 py-2 text-sm text-status-done">
          Dados fiscais salvos.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="CNPJ"
          name="cnpj"
          placeholder="00.000.000/0001-00"
          defaultValue={data.cnpj ?? undefined}
        />
        <FormField
          label="Inscrição municipal"
          name="inscricaoMunicipal"
          defaultValue={data.inscricaoMunicipal ?? undefined}
        />
        <FormField
          label="Código IBGE do município"
          name="codigoMunicipio"
          placeholder="Ex: 3550308 (São Paulo)"
          defaultValue={data.codigoMunicipio ?? undefined}
        />
        <FormField
          label="Código do serviço (LC 116)"
          name="codigoServicoMunicipal"
          placeholder="Ex: 14.01"
          defaultValue={data.codigoServicoMunicipal ?? undefined}
        />
        <FormField
          label="Alíquota de ISS (%)"
          name="aliquotaIss"
          type="number"
          placeholder="Ex: 5"
          defaultValue={data.aliquotaIss?.toString() ?? undefined}
        />
        <div>
          <label className="text-sm font-medium text-ink">
            Optante pelo Simples Nacional?
          </label>
          <select
            name="optanteSimplesNacional"
            defaultValue={
              data.optanteSimplesNacional === null
                ? ""
                : data.optanteSimplesNacional
                  ? "sim"
                  : "nao"
            }
            className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          >
            <option value="">Selecione…</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-ink-soft">
        Não sabe algum desses dados? Seu contador tem essas informações —
        elas variam conforme sua cidade e o tipo de serviço que você presta.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Salvar dados fiscais"}
      </button>
    </form>
  );
}

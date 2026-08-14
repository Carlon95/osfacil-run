"use client";

import { useActionState, useState } from "react";
import { updateProfession } from "@/lib/actions/profile";
import { PROFESSIONS, getSuggestedItems } from "@/lib/professions";

export function ItemSuggestions({
  profession,
  onPick,
}: {
  profession: string | null;
  onPick: (description: string) => void;
}) {
  const [state, formAction, pending] = useActionState(updateProfession, null);
  const [selected, setSelected] = useState("");

  const suggestions = getSuggestedItems(profession);

  if (profession && suggestions.length > 0) {
    return (
      <div className="mb-3">
        <p className="mb-1.5 text-xs uppercase tracking-wide text-ink-soft">
          Sugestões pra sua profissão
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onPick(item)}
              className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft hover:border-ink hover:text-ink"
            >
              + {item}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Sem profissão definida (ou sem sugestões cadastradas pra ela): oferece
  // definir agora, rapidinho, sem precisar sair da tela.
  return (
    <div className="mb-3 rounded-lg border border-dashed border-line p-3">
      <p className="text-xs text-ink-soft">
        {profession
          ? "Ainda não temos sugestões de peças pra essa profissão."
          : "Defina sua profissão pra receber sugestões rápidas de peças aqui."}
      </p>
      {!profession && (
        <form action={formAction} className="mt-2 flex flex-wrap gap-2">
          <select
            name="profession"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
          >
            <option value="">Selecione…</option>
            {PROFESSIONS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {selected === "outro" && (
            <input
              name="professionOther"
              placeholder="Qual?"
              className="rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
            />
          )}
          <button
            type="submit"
            disabled={pending || !selected}
            className="rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            {pending ? "Salvando…" : "Salvar"}
          </button>
        </form>
      )}
      {state?.error && (
        <p className="mt-1.5 text-xs text-status-open">{state.error}</p>
      )}
    </div>
  );
}

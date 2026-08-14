"use client";

import { useState, useTransition } from "react";
import { updateProfession } from "@/lib/actions/profile";
import { PROFESSIONS, getSuggestedItems } from "@/lib/professions";

export function ItemSuggestions({
  profession,
  onPick,
}: {
  profession: string | null;
  onPick: (description: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState("");
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState<string | null>(null);

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

  function handleSaveProfession() {
    setError(null);
    const formData = new FormData();
    formData.set("profession", selected);
    formData.set("professionOther", otherText);

    startTransition(async () => {
      const result = await updateProfession(null, formData);
      if (result?.error) setError(result.error);
    });
  }

  // Sem profissão definida (ou sem sugestões cadastradas pra ela): oferece
  // definir agora, rapidinho, sem precisar sair da tela.
  // Importante: isto NÃO pode ser um <form>, porque já está dentro do
  // formulário principal da OS — forms aninhados são inválidos em HTML.
  return (
    <div className="mb-3 rounded-lg border border-dashed border-line p-3">
      <p className="text-xs text-ink-soft">
        {profession
          ? "Ainda não temos sugestões de peças pra essa profissão."
          : "Defina sua profissão pra receber sugestões rápidas de peças aqui."}
      </p>
      {!profession && (
        <div className="mt-2 flex flex-wrap gap-2">
          <select
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
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Qual?"
              className="rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-ink"
            />
          )}
          <button
            type="button"
            onClick={handleSaveProfession}
            disabled={isPending || !selected}
            className="rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
          >
            {isPending ? "Salvando…" : "Salvar"}
          </button>
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-status-open">{error}</p>}
    </div>
  );
}

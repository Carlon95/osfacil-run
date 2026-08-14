"use client";

import { useActionState, useMemo, useState } from "react";
import { createServiceOrder } from "@/lib/actions/service-orders";
import { formatMoney } from "@/lib/format";
import { ItemSuggestions } from "./ItemSuggestions";
import { getSuggestedServiceTypes } from "@/lib/professions";

type Item = { description: string; quantity: string; unitPrice: string };

export function NewOsForm({
  clients,
  profession,
}: {
  clients: { id: string; name: string }[];
  profession: string | null;
}) {
  const [state, formAction, pending] = useActionState(
    createServiceOrder,
    null
  );

  const [usingNewClient, setUsingNewClient] = useState(clients.length === 0);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [items, setItems] = useState<Item[]>([]);
  const [laborCost, setLaborCost] = useState("0");
  const [serviceType, setServiceType] = useState("");

  const serviceTypeSuggestions = useMemo(
    () => getSuggestedServiceTypes(profession),
    [profession]
  );

  const itemsTotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
        0
      ),
    [items]
  );
  const total = itemsTotal + (Number(laborCost) || 0);

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: "1", unitPrice: "0" }]);
  }

  function addSuggestedItem(description: string) {
    setItems((prev) => [...prev, { description, quantity: "1", unitPrice: "0" }]);
  }

  function updateItem(index: number, field: keyof Item, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  const itemsJson = JSON.stringify(
    items
      .filter((i) => i.description.trim().length > 0)
      .map((i) => ({
        description: i.description,
        quantity: Number(i.quantity) || 0,
        unitPrice: Number(i.unitPrice) || 0,
      }))
  );

  return (
    <form action={formAction} className="mt-8 max-w-2xl space-y-8">
      <input type="hidden" name="itemsJson" value={itemsJson} />

      {state?.error && (
        <p className="rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {state.error}
        </p>
      )}

      {/* Cliente */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Cliente</h2>

        {clients.length > 0 && (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setUsingNewClient(false)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                !usingNewClient
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-soft"
              }`}
            >
              Cliente existente
            </button>
            <button
              type="button"
              onClick={() => setUsingNewClient(true)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                usingNewClient
                  ? "bg-ink text-paper"
                  : "border border-line text-ink-soft"
              }`}
            >
              Novo cliente
            </button>
          </div>
        )}

        {!usingNewClient ? (
          <select
            name="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="mt-4 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-ink">
                Nome do cliente
              </label>
              <input
                name="newClientName"
                required={usingNewClient}
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">
                Telefone <span className="font-normal text-ink-soft">(opcional)</span>
              </label>
              <input
                name="newClientPhone"
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        )}
      </section>

      {/* Serviço */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <h2 className="font-display text-lg font-semibold text-ink">Serviço</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink">
              Tipo de serviço
            </label>
            <input
              name="serviceType"
              required
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
              placeholder="Ex: Troca de disjuntor, Conserto de vazamento…"
            />
            {serviceTypeSuggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {serviceTypeSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setServiceType(suggestion)}
                    className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft hover:border-ink hover:text-ink"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Descrição</label>
            <textarea
              name="description"
              required
              rows={3}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
              placeholder="O que foi feito ou será feito"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">
              Data agendada{" "}
              <span className="font-normal text-ink-soft">(opcional)</span>
            </label>
            <input
              type="date"
              name="scheduledDate"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30 sm:w-56"
            />
          </div>
        </div>
      </section>

      {/* Itens / materiais */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Materiais e peças
          </h2>
          <button
            type="button"
            onClick={addItem}
            className="text-sm font-semibold text-ink underline"
          >
            + Adicionar item
          </button>
        </div>

        <div className="mt-3">
          <ItemSuggestions profession={profession} onPick={addSuggestedItem} />
        </div>

        {items.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">
            Nenhum item adicionado. Use isso pra peças e materiais usados no serviço.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-12 items-center gap-2 rounded-lg border border-line p-3"
              >
                <input
                  value={item.description}
                  onChange={(e) => updateItem(index, "description", e.target.value)}
                  placeholder="Descrição do item"
                  className="col-span-12 rounded-md border border-line px-2.5 py-2 text-sm outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30 sm:col-span-6"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, "quantity", e.target.value)}
                  placeholder="Qtd"
                  className="col-span-3 rounded-md border border-line px-2.5 py-2 text-sm outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30 sm:col-span-2"
                />
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                  placeholder="Valor unit."
                  className="col-span-6 rounded-md border border-line px-2.5 py-2 text-sm outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30 sm:col-span-3"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  aria-label="Remover item"
                  className="col-span-3 rounded-md border border-line py-2 text-sm text-status-open hover:bg-status-open-bg sm:col-span-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mão de obra + total */}
      <section className="rounded-2xl border border-line bg-paper p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-ink">
              Mão de obra (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="laborCost"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">
              Observações{" "}
              <span className="font-normal text-ink-soft">(opcional)</span>
            </label>
            <input
              name="notes"
              className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
              placeholder="Garantia, condições de pagamento…"
            />
          </div>
        </div>

        <div className="mt-5 border-t border-dashed border-line pt-4">
          <p className="text-xs text-ink-soft">
            O total (materiais + mão de obra) aparece fixo no rodapé
            enquanto você preenche.
          </p>
        </div>
      </section>

      {/* Barra fixa com o total e o botão de enviar — sempre visível,
          sem precisar rolar até o fim do formulário. */}
      <div className="sticky bottom-4 z-10 flex items-center justify-between gap-4 rounded-2xl border border-line bg-paper/95 px-5 py-4 shadow-[0_10px_35px_-15px_rgba(28,27,26,0.4)] backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            Total estimado
          </p>
          <p className="font-mono text-xl font-semibold text-ink sm:text-2xl">
            {formatMoney(total)}
          </p>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink hover:bg-amber-dark disabled:opacity-60"
        >
          {pending ? "Gerando OS…" : "Gerar OS"}
        </button>
      </div>
    </form>
  );
}

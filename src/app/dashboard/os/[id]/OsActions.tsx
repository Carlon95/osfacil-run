"use client";

import { useTransition } from "react";
import { updateServiceOrderStatus } from "@/lib/actions/service-orders";

const OPTIONS = [
  { value: "ABERTA", label: "Aberta" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
  { value: "CANCELADA", label: "Cancelada" },
];

export function OsActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <select
        defaultValue={currentStatus}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() => {
            updateServiceOrderStatus(orderId, e.target.value);
          })
        }
        className="rounded-full border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink outline-none focus:border-ink"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink-soft"
      >
        Imprimir / Baixar PDF
      </button>
    </div>
  );
}

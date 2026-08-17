"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateServiceOrderStatus,
  setServiceOrderArchived,
} from "@/lib/actions/service-orders";

const OPTIONS = [
  { value: "ABERTA", label: "Aberta" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluída" },
  { value: "CANCELADA", label: "Cancelada" },
];

export function OsActions({
  orderId,
  currentStatus,
  archived,
}: {
  orderId: string;
  currentStatus: string;
  archived: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        className="rounded-full border border-line bg-paper px-3.5 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await setServiceOrderArchived(orderId, !archived);
            if (!archived) router.push("/dashboard/os");
          })
        }
        className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-medium text-ink-soft hover:border-ink hover:text-ink disabled:opacity-60"
      >
        {archived ? "Desarquivar" : "Arquivar"}
      </button>
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

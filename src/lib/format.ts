export function formatMoney(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_META: Record<
  string,
  { label: string; text: string; bg: string }
> = {
  ABERTA: {
    label: "Aberta",
    text: "text-status-open",
    bg: "bg-status-open-bg",
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    text: "text-status-progress",
    bg: "bg-status-progress-bg",
  },
  CONCLUIDA: {
    label: "Concluída",
    text: "text-status-done",
    bg: "bg-status-done-bg",
  },
  CANCELADA: {
    label: "Cancelada",
    text: "text-status-cancelled",
    bg: "bg-status-cancelled-bg",
  },
};

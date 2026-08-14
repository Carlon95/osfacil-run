import { STATUS_META } from "@/lib/format";

export function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.ABERTA;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.text}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

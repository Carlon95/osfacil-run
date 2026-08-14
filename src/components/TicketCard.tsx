export function TicketPerforation() {
  return (
    <div className="flex justify-between px-4">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="h-3 w-3 rounded-full bg-paper" />
      ))}
    </div>
  );
}

export function TicketCard({
  number,
  serviceType,
  client,
  total,
  status,
  className = "",
}: {
  number: string;
  serviceType: string;
  client: string;
  total: string;
  status: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full max-w-sm overflow-hidden rounded-2xl bg-ink-soft/[0.04] shadow-[0_20px_50px_-15px_rgba(28,27,26,0.35)] ${className}`}
    >
      <div className="bg-ink pt-3">
        <TicketPerforation />
      </div>
      <div className="border-x border-line bg-paper px-6 pb-6 pt-5">
        <div className="flex items-center justify-between border-b border-dashed border-line pb-3">
          <span className="font-mono text-xs tracking-wider text-ink-soft">
            OS Nº {number}
          </span>
          <span className="rounded-full bg-status-open-bg px-2.5 py-1 text-[11px] font-semibold text-status-open">
            {status}
          </span>
        </div>
        <p className="mt-4 font-display text-2xl font-semibold leading-tight text-ink">
          {serviceType}
        </p>
        <p className="mt-1 text-sm text-ink-soft">Cliente: {client}</p>
        <div className="mt-5 flex items-end justify-between border-t border-dashed border-line pt-4">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Total
          </span>
          <span className="font-mono text-2xl font-semibold text-ink">
            {total}
          </span>
        </div>
      </div>
      <div className="bg-ink pb-3">
        <TicketPerforation />
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getServiceOrdersForUser } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatMoney } from "@/lib/format";

const FILTERS = [
  { value: undefined, label: "Todas" },
  { value: "ABERTA", label: "Abertas" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "CONCLUIDA", label: "Concluídas" },
  { value: "CANCELADA", label: "Canceladas" },
];

export default async function ServiceOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { status } = await searchParams;
  const orders = await getServiceOrdersForUser(session.userId, status);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">
          Ordens de serviço
        </h1>
        <Link
          href="/dashboard/os/nova"
          className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-ink hover:bg-amber-dark"
        >
          + Nova OS
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = (status ?? undefined) === f.value;
          return (
            <Link
              key={f.label}
              href={f.value ? `/dashboard/os?status=${f.value}` : "/dashboard/os"}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
                isActive
                  ? "bg-ink text-paper"
                  : "border border-line bg-paper text-ink-soft hover:text-ink"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper p-8 text-center">
          <p className="text-ink-soft">Nenhuma ordem de serviço encontrada.</p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper">
          {orders.map((order) => {
            const total = order.total;
            return (
              <Link
                key={order.id}
                href={`/dashboard/os/${order.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-paper-dim"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">
                    #{String(order.number).padStart(4, "0")} ·{" "}
                    {order.serviceType}
                  </p>
                  <p className="truncate text-sm text-ink-soft">
                    {order.clientName} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-mono text-sm text-ink-soft sm:inline">
                    {formatMoney(total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { getDashboardSummary, getServiceOrdersForUser } from "@/lib/queries";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import { requireActiveUser } from "@/lib/access";

export default async function DashboardPage() {
  const user = await requireActiveUser();

  const [summary, recentOrders] = await Promise.all([
    getDashboardSummary(user.id),
    getServiceOrdersForUser(user.id),
  ]);

  const recent = recentOrders.slice(0, 5);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Resumo</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Suas ordens de serviço num relance.
          </p>
        </div>
        <Link
          href="/dashboard/os/nova"
          className="rounded-full bg-amber px-5 py-2.5 text-sm font-semibold text-ink hover:bg-amber-dark"
        >
          + Nova OS
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total de OS", value: summary.total },
          { label: "Abertas", value: summary.abertas },
          { label: "Em andamento", value: summary.emAndamento },
          { label: "Concluídas", value: summary.concluidas },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-line bg-paper p-4"
          >
            <p className="font-mono text-3xl font-semibold text-ink">
              {card.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            OS recentes
          </h2>
          <Link
            href="/dashboard/os"
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Ver todas →
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-paper p-8 text-center">
            <p className="text-ink-soft">
              Você ainda não criou nenhuma ordem de serviço.
            </p>
            <Link
              href="/dashboard/os/nova"
              className="mt-3 inline-block text-sm font-semibold text-ink underline"
            >
              Criar a primeira OS
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line rounded-2xl border border-line bg-paper">
            {recent.map((order) => (
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
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

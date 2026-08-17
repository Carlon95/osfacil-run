import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceOrderById } from "@/lib/queries";
import { requireActiveUser } from "@/lib/access";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, formatMoney } from "@/lib/format";
import { OsActions } from "./OsActions";
import { NotaFiscalSection } from "./NotaFiscalSection";

export default async function ServiceOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireActiveUser();

  const { id } = await params;
  const order = await getServiceOrderById(user.id, id);

  if (!order) notFound();

  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const total = itemsTotal + order.laborCost;

  return (
    <div>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/dashboard/os"
          className="text-sm font-medium text-ink-soft hover:text-ink"
        >
          ← Todas as OS
        </Link>
        <OsActions
          orderId={order.id}
          currentStatus={order.status}
          archived={order.archived}
        />
      </div>

      <div className="print-sheet mx-auto max-w-2xl rounded-2xl border border-line bg-paper p-8 shadow-[0_20px_50px_-30px_rgba(28,27,26,0.4)]">
        <div className="flex items-start justify-between border-b border-dashed border-line pb-5">
          <div>
            <p className="font-display text-xl font-bold text-ink">
              {user.businessName || user.name}
            </p>
            {user.phone && (
              <p className="text-sm text-ink-soft">{user.phone}</p>
            )}
          </div>
          <div className="text-right">
            <p className="font-mono text-sm text-ink-soft">
              OS Nº {String(order.number).padStart(4, "0")}
            </p>
            <p className="text-sm text-ink-soft">
              {formatDate(order.createdAt)}
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-end gap-1.5 no-print">
              <StatusBadge status={order.status} />
              {order.archived && (
                <span className="inline-flex items-center rounded-full bg-status-cancelled-bg px-2.5 py-1 text-xs font-semibold text-status-cancelled">
                  Arquivada
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 border-b border-dashed border-line pb-5 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Cliente
            </p>
            <p className="mt-1 font-medium text-ink">{order.clientName}</p>
            {order.clientPhone && (
              <p className="text-sm text-ink-soft">{order.clientPhone}</p>
            )}
            {order.clientAddress && (
              <p className="text-sm text-ink-soft">{order.clientAddress}</p>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Serviço
            </p>
            <p className="mt-1 font-medium text-ink">{order.serviceType}</p>
            {order.scheduledDate && (
              <p className="text-sm text-ink-soft">
                Agendado para {formatDate(order.scheduledDate)}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 border-b border-dashed border-line pb-5">
          <p className="text-xs uppercase tracking-wide text-ink-soft">
            Descrição
          </p>
          <p className="mt-1 whitespace-pre-wrap text-ink">
            {order.description}
          </p>
        </div>

        {order.items.length > 0 && (
          <div className="mt-5 border-b border-dashed border-line pb-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Materiais e peças
            </p>
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="text-left text-ink-soft">
                  <th className="py-1 font-medium">Item</th>
                  <th className="py-1 text-right font-medium">Qtd</th>
                  <th className="py-1 text-right font-medium">Valor unit.</th>
                  <th className="py-1 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-line">
                    <td className="py-1.5 text-ink">{item.description}</td>
                    <td className="py-1.5 text-right text-ink">
                      {item.quantity}
                    </td>
                    <td className="py-1.5 text-right font-mono text-ink">
                      {formatMoney(item.unitPrice)}
                    </td>
                    <td className="py-1.5 text-right font-mono text-ink">
                      {formatMoney(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {order.notes && (
          <div className="mt-5 border-b border-dashed border-line pb-5">
            <p className="text-xs uppercase tracking-wide text-ink-soft">
              Observações
            </p>
            <p className="mt-1 whitespace-pre-wrap text-ink">{order.notes}</p>
          </div>
        )}

        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Materiais e peças</span>
            <span className="font-mono">{formatMoney(itemsTotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-soft">
            <span>Mão de obra</span>
            <span className="font-mono">{formatMoney(order.laborCost)}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 text-lg font-semibold text-ink">
            <span>Total</span>
            <span className="font-mono">{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <NotaFiscalSection
        orderId={order.id}
        nfStatus={order.nfStatus}
        nfNumber={order.nfNumber}
        nfPdfUrl={order.nfPdfUrl}
        nfError={order.nfError}
      />
    </div>
  );
}

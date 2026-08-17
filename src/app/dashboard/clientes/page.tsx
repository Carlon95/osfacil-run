import Link from "next/link";
import { getClientsForUser } from "@/lib/queries";
import { requireActiveUser } from "@/lib/access";
import { NewClientForm } from "./NewClientForm";
import { ConfirmationBanner } from "@/components/ConfirmationBanner";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await requireActiveUser();

  const { saved } = await searchParams;
  const clients = await getClientsForUser(user.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">Clientes</h1>
      </div>

      {saved === "criado" && (
        <div className="mt-4">
          <ConfirmationBanner message="Cliente salvo." />
        </div>
      )}
      {saved === "atualizado" && (
        <div className="mt-4">
          <ConfirmationBanner message="Alterações salvas." />
        </div>
      )}

      <div className="mt-6">
        <NewClientForm />
      </div>

      {clients.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper p-8 text-center">
          <p className="text-ink-soft">Nenhum cliente cadastrado ainda.</p>
        </div>
      ) : (
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-paper">
          {clients.map((client) => {
            const addressParts = [
              client.address,
              client.neighborhood,
              [client.city, client.state].filter(Boolean).join("/"),
              client.zipCode,
            ].filter(Boolean);

            const contactParts = [client.phone, client.email].filter(Boolean);

            return (
              <div
                key={client.id}
                className="flex items-start gap-3 px-5 py-4"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-dim font-mono text-xs font-semibold text-ink-soft">
                  {getInitials(client.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <p className="font-medium text-ink">{client.name}</p>
                      {client.document && (
                        <span className="font-mono text-xs text-ink-soft">
                          {client.document}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/clientes/${client.id}`}
                      className="shrink-0 rounded-full px-3 py-1 text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink"
                    >
                      Editar
                    </Link>
                  </div>
                  {contactParts.length > 0 && (
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {contactParts.join(" · ")}
                    </p>
                  )}
                  {addressParts.length > 0 && (
                    <p className="mt-0.5 text-sm text-ink-soft">
                      {addressParts.join(", ")}
                    </p>
                  )}
                  {client.notes && (
                    <p className="mt-1.5 text-sm italic text-ink-soft">
                      {client.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

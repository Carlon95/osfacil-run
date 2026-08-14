import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getClientsForUser } from "@/lib/queries";
import { NewClientForm } from "./NewClientForm";

export default async function ClientsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const clients = await getClientsForUser(session.userId);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-ink">Clientes</h1>
      </div>

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
              <div key={client.id} className="px-5 py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="font-medium text-ink">{client.name}</p>
                  {client.document && (
                    <span className="font-mono text-xs text-ink-soft">
                      {client.document}
                    </span>
                  )}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

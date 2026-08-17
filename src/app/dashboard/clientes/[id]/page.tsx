import { notFound } from "next/navigation";
import Link from "next/link";
import { getClientById } from "@/lib/queries";
import { requireActiveUser } from "@/lib/access";
import { EditClientForm } from "./EditClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireActiveUser();

  const { id } = await params;
  const client = await getClientById(user.id, id);
  if (!client) notFound();

  return (
    <div>
      <Link
        href="/dashboard/clientes"
        className="text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Todos os clientes
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink">
        Editar cliente
      </h1>
      <EditClientForm client={client} />
    </div>
  );
}

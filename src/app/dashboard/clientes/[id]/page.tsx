import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getClientById } from "@/lib/queries";
import { EditClientForm } from "./EditClientForm";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const client = await getClientById(session.userId, id);
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

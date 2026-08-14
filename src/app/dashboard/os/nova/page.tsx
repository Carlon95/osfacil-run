import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getClientsForUser, getUserById } from "@/lib/queries";
import { NewOsForm } from "./NewOsForm";

export default async function NewServiceOrderPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [clients, user] = await Promise.all([
    getClientsForUser(session.userId),
    getUserById(session.userId),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Nova OS</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Preencha o essencial. Você pode ajustar depois.
      </p>
      <NewOsForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        profession={user?.profession ?? null}
      />
    </div>
  );
}

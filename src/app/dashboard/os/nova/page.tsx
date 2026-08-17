import { getClientsForUser } from "@/lib/queries";
import { requireActiveUser } from "@/lib/access";
import { NewOsForm } from "./NewOsForm";

export default async function NewServiceOrderPage() {
  const user = await requireActiveUser();

  const clients = await getClientsForUser(user.id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Nova OS</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Preencha o essencial. Você pode ajustar depois.
      </p>
      <NewOsForm
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        profession={user.profession ?? null}
      />
    </div>
  );
}

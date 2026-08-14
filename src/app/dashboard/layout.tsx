import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { logOut } from "@/lib/actions/auth";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) {
    // Sessão assinada corretamente, mas o usuário não existe mais
    // (ex: banco foi resetado). Redireciona pra rota que limpa o
    // cookie órfão — layouts/páginas não podem mexer em cookies
    // diretamente, só Server Actions e Route Handlers.
    redirect("/api/auth/invalidate");
  }

  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="no-print sticky top-0 z-10 border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="font-display text-xl font-bold text-ink">
            OS<span className="text-amber-dark">Fácil</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-soft sm:inline">
              {user.businessName || user.name}
            </span>
            <form action={logOut}>
              <button
                type="submit"
                className="text-sm font-medium text-ink-soft hover:text-ink"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
        <DashboardNav />
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}

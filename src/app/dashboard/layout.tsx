import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, clearSessionCookie } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { logOut } from "@/lib/actions/auth";

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
    // (ex: banco foi resetado). Limpa o cookie órfão pra não entrar
    // em loop de redirecionamento entre /login e /dashboard.
    await clearSessionCookie();
    redirect("/login");
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
        <nav className="mx-auto flex max-w-5xl gap-1 px-5 pb-2">
          {[
            { href: "/dashboard", label: "Resumo" },
            { href: "/dashboard/os", label: "Ordens de serviço" },
            { href: "/dashboard/clientes", label: "Clientes" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-paper-dim hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}

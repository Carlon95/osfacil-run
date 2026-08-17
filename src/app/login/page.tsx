import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redefinida?: string }>;
}) {
  const { redefinida } = await searchParams;

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse suas ordens de serviço e clientes."
    >
      {redefinida === "1" && (
        <p className="mt-4 rounded-lg bg-status-done-bg px-3 py-2 text-sm text-status-done">
          Senha redefinida! Já pode entrar com a senha nova.
        </p>
      )}
      <LoginForm />
    </AuthShell>
  );
}

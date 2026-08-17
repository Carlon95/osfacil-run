import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthShell title="Link inválido" subtitle="Esse link de redefinição está incompleto.">
        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link href="/esqueci-senha" className="font-semibold text-ink underline">
            Pedir um novo link
          </Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Criar nova senha" subtitle="Escolha uma senha nova pra sua conta.">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}

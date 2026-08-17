import { AuthShell } from "@/components/AuthShell";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Esqueceu a senha?"
      subtitle="Informe seu e-mail e mandamos um link pra você criar uma nova."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

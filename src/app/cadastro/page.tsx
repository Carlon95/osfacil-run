import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "./SignUpForm";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Criar conta"
      subtitle="7 dias grátis, sem cartão de crédito."
    >
      <SignUpForm />
    </AuthShell>
  );
}

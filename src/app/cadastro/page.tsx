import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "./SignUpForm";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Criar conta"
      subtitle="Leva menos de um minuto. Grátis pra começar."
    >
      <SignUpForm />
    </AuthShell>
  );
}

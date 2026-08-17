import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY não está definido. Veja RESEND.md.");
    }
    resendInstance = new Resend(key);
  }
  return resendInstance;
}

function getFromAddress() {
  // Sem domínio próprio verificado no Resend, use o remetente de teste
  // deles (só funciona pra mandar pro seu próprio e-mail de cadastro no
  // Resend). Veja RESEND.md.
  return process.env.RESEND_FROM_EMAIL ?? "OS Fácil <onboarding@resend.dev>";
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = getResend();

  await resend.emails.send({
    from: getFromAddress(),
    to,
    subject: "Redefinir sua senha — OS Fácil",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1C1B1A;">
        <h1 style="font-size: 20px;">Redefinir sua senha</h1>
        <p>Alguém (esperamos que você) pediu pra redefinir a senha da sua conta no OS Fácil.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #FFB703; color: #1C1B1A; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600;">
            Criar nova senha
          </a>
        </p>
        <p style="font-size: 13px; color: #6b6b65;">
          Esse link expira em 1 hora. Se você não pediu isso, pode ignorar
          este e-mail — sua senha continua a mesma.
        </p>
      </div>
    `,
  });
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import {
  isTrialing,
  trialDaysLeft,
  PLAN_NAME,
  PLAN_PRICE_LABEL,
} from "@/lib/subscription";
import { SubscribeButton, ManageSubscriptionButton } from "./SubscribeButtons";

export default async function SubscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/api/auth/invalidate");

  const { status } = await searchParams;
  const trialing = isTrialing(user);
  const daysLeft = trialDaysLeft(user);
  const isActive = user.subscriptionStatus === "active";

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-display text-3xl font-bold text-ink">Assinatura</h1>

      {status === "sucesso" && (
        <p className="mt-4 rounded-lg bg-status-done-bg px-3 py-2 text-sm text-status-done">
          Assinatura confirmada! Pode continuar usando o OS Fácil sem
          limites.
        </p>
      )}
      {status === "cancelado" && (
        <p className="mt-4 rounded-lg bg-status-cancelled-bg px-3 py-2 text-sm text-ink-soft">
          Checkout cancelado — nenhuma cobrança foi feita.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-paper p-6">
        <p className="text-xs uppercase tracking-wide text-ink-soft">
          {PLAN_NAME}
        </p>
        <p className="mt-1 font-mono text-3xl font-semibold text-ink">
          {PLAN_PRICE_LABEL}
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
          <li>OS ilimitadas</li>
          <li>Clientes ilimitados</li>
          <li>Impressão e PDF sem marca d&apos;água</li>
          <li>Cancele quando quiser</li>
        </ul>

        <div className="mt-6 border-t border-dashed border-line pt-5">
          {isActive ? (
            <div>
              <p className="text-sm font-medium text-status-done">
                Assinatura ativa
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Gerencie forma de pagamento, veja faturas ou cancele quando
                quiser.
              </p>
              <div className="mt-4">
                <ManageSubscriptionButton />
              </div>
            </div>
          ) : trialing ? (
            <div>
              <p className="text-sm font-medium text-ink">
                Teste grátis em andamento — faltam {daysLeft} dia
                {daysLeft === 1 ? "" : "s"}.
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Assine agora e continue sem interrupção quando o teste
                acabar.
              </p>
              <div className="mt-4">
                <SubscribeButton label="Assinar agora" />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-status-open">
                {user.subscriptionStatus === "past_due"
                  ? "Pagamento pendente"
                  : "Seu teste grátis acabou"}
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                {user.subscriptionStatus === "past_due"
                  ? "Não conseguimos cobrar sua última fatura. Atualize a forma de pagamento para continuar."
                  : "Assine para voltar a criar e gerenciar suas ordens de serviço."}
              </p>
              <div className="mt-4">
                <SubscribeButton label="Assinar agora" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

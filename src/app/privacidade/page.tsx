import Link from "next/link";

export const metadata = { title: "Política de Privacidade — OS Fácil" };

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-ink-soft hover:text-ink">
        ← Voltar
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">
        Política de Privacidade
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Última atualização: [PREENCHER DATA]
      </p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-ink">
        <section>
          <h2 className="font-display text-xl font-semibold">1. Quem somos</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            O OS Fácil ([RAZÃO SOCIAL], CNPJ [PREENCHER]) é um aplicativo que
            ajuda prestadores de serviço autônomos a criar e gerenciar
            ordens de serviço. Esta política explica quais dados coletamos,
            por quê, e quais são os seus direitos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            2. Quais dados coletamos
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Do <strong>prestador</strong> (quem usa o app): nome, e-mail,
            telefone, senha (criptografada), profissão, dados fiscais (CNPJ,
            inscrição municipal) quando informados, e dados de pagamento
            processados pelo Stripe (não guardamos número de cartão).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Dos <strong>clientes do prestador</strong> (cadastrados por ele
            no app): nome, telefone, e-mail, CPF/CNPJ e endereço, quando o
            prestador optar por preencher esses dados.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            3. Para que usamos esses dados
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>Criar e autenticar sua conta</li>
            <li>Gerar as ordens de serviço e permitir sua impressão/PDF</li>
            <li>Processar assinatura e pagamentos (via Stripe)</li>
            <li>Emitir nota fiscal quando solicitado (via Focus NFe)</li>
            <li>Dar suporte quando você entra em contato</li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Não vendemos seus dados nem os de seus clientes para terceiros,
            nem os usamos para anúncios.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            4. Com quem compartilhamos
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>
              <strong>Stripe</strong> — processamento de pagamento da
              assinatura
            </li>
            <li>
              <strong>Focus NFe</strong> — emissão de nota fiscal, quando
              você usa essa função
            </li>
            <li>
              <strong>Turso / Vercel</strong> — hospedagem do banco de dados
              e do aplicativo
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Só compartilhamos o necessário para essas funções operarem.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            5. Seus direitos (LGPD)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Você pode pedir a qualquer momento para acessar, corrigir ou
            excluir seus dados, ou os dados de clientes que cadastrou.
            Escreva para [E-MAIL DE CONTATO] que atendemos em até 15 dias.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            6. Por quanto tempo guardamos os dados
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Enquanto sua conta estiver ativa. Se você cancelar, pode pedir a
            exclusão completa dos seus dados e dos dados dos seus clientes
            cadastrados, respeitando prazos legais de guarda de documentos
            fiscais quando aplicável.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">7. Contato</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Dúvidas sobre privacidade: [E-MAIL DE CONTATO]
          </p>
        </section>
      </div>
    </main>
  );
}

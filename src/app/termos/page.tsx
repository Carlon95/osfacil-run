import Link from "next/link";

export const metadata = { title: "Termos de Uso — OS Fácil" };

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <Link href="/" className="text-sm font-medium text-ink-soft hover:text-ink">
        ← Voltar
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink">
        Termos de Uso
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Última atualização: [PREENCHER DATA]
      </p>

      <div className="prose prose-sm mt-8 max-w-none space-y-6 text-ink">
        <section>
          <h2 className="font-display text-xl font-semibold">1. O serviço</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            O OS Fácil é uma ferramenta para prestadores de serviço
            autônomos criarem e gerenciarem ordens de serviço, clientes e,
            opcionalmente, emitirem nota fiscal via integração com a Focus
            NFe. Oferecemos um período de teste grátis de 7 dias, seguido de
            assinatura mensal.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            2. Sua conta
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Você é responsável por manter sua senha em sigilo e por tudo que
            acontece na sua conta. Avise imediatamente se suspeitar de uso
            não autorizado.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            3. Assinatura e cobrança
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Após o período de teste, a assinatura é cobrada mensalmente via
            Stripe. Você pode cancelar quando quiser pelo próprio app — o
            acesso continua até o fim do período já pago. Não fazemos
            reembolso de períodos parciais já utilizados.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            4. Nota fiscal
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            A emissão de nota fiscal é feita através de integração com a
            Focus NFe. Você é o único responsável pela exatidão dos dados
            fiscais informados (CNPJ, código de serviço, alíquota) e pelo
            cumprimento das suas obrigações tributárias. O OS Fácil não se
            responsabiliza por erros de emissão decorrentes de dados
            incorretos fornecidos por você, nem atua como contador ou
            consultor tributário.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            5. Seus dados e de seus clientes
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Você é responsável por ter legitimidade para cadastrar os dados
            dos seus clientes no app (nome, telefone, CPF/CNPJ, endereço).
            Veja nossa{" "}
            <Link href="/privacidade" className="underline">
              Política de Privacidade
            </Link>{" "}
            para saber como tratamos esses dados.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            6. Uso aceitável
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Não use o OS Fácil para fins ilegais, para emitir documentos
            fiscais fraudulentos, ou para armazenar dados de pessoas sem
            seu conhecimento/consentimento quando exigido por lei.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            7. Disponibilidade
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Fazemos o possível para manter o serviço no ar, mas não
            garantimos disponibilidade ininterrupta. Não nos
            responsabilizamos por indisponibilidade de serviços de
            terceiros que usamos (Stripe, Focus NFe, hospedagem).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">
            8. Cancelamento
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Você pode cancelar sua conta a qualquer momento. Reservamo-nos o
            direito de suspender contas que violem estes termos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold">9. Contato</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Dúvidas sobre estes termos: [E-MAIL DE CONTATO]
          </p>
        </section>
      </div>
    </main>
  );
}

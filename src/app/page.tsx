import Link from "next/link";
import { TicketCard } from "@/components/TicketCard";

const PUBLICOS = [
  "Eletricistas",
  "Encanadores",
  "Ar-condicionado",
  "Borracheiros",
  "Manutenção geral",
  "Montadores",
];

const PASSOS = [
  {
    n: "01",
    title: "Anote o serviço",
    text: "Cliente, tipo de serviço, materiais usados e mão de obra. Tudo num formulário rápido, do celular mesmo.",
  },
  {
    n: "02",
    title: "A OS se monta sozinha",
    text: "Número sequencial, total calculado automaticamente e status da ordem — sem planilha, sem papel avulso.",
  },
  {
    n: "03",
    title: "Envie pro cliente",
    text: "Imprima ou baixe em PDF direto do navegador e mande por WhatsApp antes de sair da casa do cliente.",
  },
];

export default function Home() {
  return (
    <main className="bg-paper">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-2xl font-bold tracking-tight text-ink">
          OS<span className="text-amber-dark">Fácil</span>
        </span>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-ink-soft hover:text-ink"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper hover:bg-ink-soft"
          >
            Criar conta grátis
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-12 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-block rounded-full bg-amber/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-dark">
            Pra quem trabalha na rua, não no escritório
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-ink md:text-6xl">
            Ordem de serviço pronta antes do cliente perguntar o preço
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Crie a OS em menos de um minuto, direto do celular: serviço,
            peças, mão de obra e total já calculado. Sem planilha, sem
            bloquinho, sem esquecer de cobrar item.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/cadastro"
              className="rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink hover:bg-amber-dark"
            >
              Começar agora — 7 dias grátis
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-ink underline underline-offset-4"
            >
              Já tenho conta
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {PUBLICOS.map((p) => (
              <span
                key={p}
                className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-soft"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <TicketCard
            number="0128"
            serviceType="Troca de disjuntor + revisão do quadro"
            client="Marcos Andrade"
            total="R$ 280,00"
            status="ABERTA"
            className="rotate-2"
          />
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-t border-line bg-paper-dim">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-3xl font-bold text-ink">
            Como funciona
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {PASSOS.map((passo) => (
              <div key={passo.n}>
                <span className="font-mono text-sm text-amber-dark">
                  {passo.n}
                </span>
                <h3 className="mt-2 font-display text-xl font-semibold text-ink">
                  {passo.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {passo.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-ink">
          O que já vem pronto
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Clientes salvos",
              text: "Cadastre uma vez, reaproveite em toda nova OS.",
            },
            {
              title: "Itens e mão de obra",
              text: "Some peças e serviço, o total sai certo na hora.",
            },
            {
              title: "Status da ordem",
              text: "Aberta, em andamento, concluída — sempre visível.",
            },
            {
              title: "Imprimir ou PDF",
              text: "Gere um documento pronto pra entregar ou mandar por WhatsApp.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-paper p-5"
            >
              <h3 className="font-display text-lg font-semibold text-ink">
                {f.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-soft">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-14 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-paper">
              Sua próxima OS pode sair em 60 segundos
            </h2>
            <p className="mt-2 text-ink-soft">
              7 dias grátis, sem cartão de crédito. Depois, R$ 39,90/mês.
            </p>
          </div>
          <Link
            href="/cadastro"
            className="whitespace-nowrap rounded-full bg-amber px-6 py-3 text-sm font-semibold text-ink hover:bg-amber-dark"
          >
            Criar minha conta
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-8 text-xs text-ink-soft">
        OS Fácil — feito para quem presta serviço de verdade.
      </footer>
    </main>
  );
}

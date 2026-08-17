# OS Fácil

SaaS para prestadores de serviço autônomos (eletricistas, encanadores,
técnicos de ar-condicionado, borracheiros, etc.) gerarem Ordens de Serviço
(OS) rápidas e profissionais.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** — design tokens em `src/app/globals.css`
- **Drizzle ORM** + **libSQL** (`@libsql/client`) — compatível com SQLite,
  roda em arquivo local pra desenvolver e tem binários prontos pra cada
  sistema operacional (não precisa compilar nada na sua máquina)
- Autenticação própria: cookie de sessão assinado (JWT via `jose`) + senha
  com hash (`bcryptjs`)
- Geração de PDF: impressão nativa do navegador (`window.print()`) numa
  página com estilos específicos de impressão — sem depender de serviço
  externo

## Como rodar localmente

```bash
npm install
cp .env.example .env      # já vem preenchido com valores de desenvolvimento
npm run db:push           # cria as tabelas no banco SQLite local (dev.db)
npm run dev
```

Acesse `http://localhost:3000`.

> O arquivo `.env` de desenvolvimento já está incluso com uma
> `AUTH_SECRET` de exemplo. **Troque essa chave antes de qualquer uso real
> ou produção.**

## Estrutura do projeto

```
src/
  app/
    page.tsx              → landing page
    login/, cadastro/     → autenticação
    dashboard/
      page.tsx             → resumo (cards + OS recentes)
      os/                  → lista, criação e detalhe de OS
      clientes/            → lista e criação de clientes
  lib/
    actions/               → server actions (mutações: criar OS, cliente, login…)
    db/                     → schema Drizzle + conexão SQLite
    auth.ts                 → sessão (cookie JWT) e hash de senha
    queries.ts               → leituras usadas pelas páginas
    validators.ts            → validação (Zod) de todos os formulários
  proxy.ts                  → protege rotas do /dashboard (equivalente ao middleware)
```

## Assinatura

O app cobra assinatura via Stripe: **7 dias de teste grátis sem cartão**,
depois **R$ 39,90/mês**. Veja `STRIPE.md` para configurar (precisa de
conta no Stripe). Sem configurar, o app funciona normalmente em
desenvolvimento — o bloqueio só entra em ação quando o trial expira.

## Nota fiscal

Emissão de NFS-e integrada via Focus NFe. Veja `FOCUSNFE.md` — precisa
de conta lá, CNPJ, e alguns dados que variam por município (seu contador
tem essas informações).

## Recuperação de senha

Via e-mail (Resend). Veja `RESEND.md` para configurar — sem isso
configurado, o link "Esqueceu a senha?" não vai enviar e-mail (mas não
quebra o resto do app).

## Lançar oficialmente

Quando estiver pronto pra ir ao mercado de verdade (não só testar), veja
`LAUNCH.md` — cobre a parte legal/fiscal (CNPJ, termos de uso), técnica
(domínio, modo produção) e de loja de apps, em ordem.

## App Android

Já tem um projeto Android nativo pronto (pasta `android/`), gerado com
Capacitor, com ícone e splash da marca. Veja `DEPLOY.md` (publicar o
SaaS primeiro) e depois `MOBILE.md` (compilar e publicar o app).

## O que já funciona (MVP)

- Cadastro e login do prestador (com profissão, usada pra sugerir
  peças/tipos de serviço)
- Cadastro completo de clientes (criar, editar, dados fiscais e
  endereço completo)
- Criação de OS: tipo de serviço, descrição, itens/materiais com
  quantidade e valor, mão de obra, total calculado automaticamente
- Numeração sequencial da OS por prestador
- Lista de OS com filtro por status e por arquivadas
- Arquivar/desarquivar OS (some da lista principal sem apagar)
- Detalhe da OS pronto para impressão/PDF (`window.print()`)
- Emissão de nota fiscal (NFS-e) direto da OS, via Focus NFe
- Assinatura mensal via Stripe, com teste grátis de 7 dias
- Resumo com contadores por status

## O que foi deixado de fora de propósito (próxima rodada)

- **Envio automático por WhatsApp/e-mail** — hoje o envio é manual (o
  prestador baixa o PDF e manda ele mesmo)
- **Múltiplos usuários por conta** (equipe/funcionários)
- **Relatórios financeiros** (faturamento por período, por cliente, etc.)
- **Recuperação de senha por e-mail**

## Indo para produção

O banco local (`dev.db`, arquivo SQLite) é ótimo para desenvolver, mas
plataformas serverless (como a Vercel) não têm disco persistente entre
execuções — então ele não pode ser usado assim em produção. Como já
usamos libSQL, o caminho mais simples é:

1. **Criar um banco no [Turso](https://turso.tech)** (hospedagem de
   libSQL, tem plano gratuito) — ele te dá uma `url` (algo como
   `libsql://seu-banco.turso.io`) e um `authToken`.
2. Configurar na hospedagem (Vercel, etc.) as variáveis de ambiente:
   - `DATABASE_URL` = a url do Turso
   - Ajustar `src/lib/db/index.ts` para passar também `authToken:
     process.env.DATABASE_AUTH_TOKEN` no `createClient(...)`
   - Fazer o mesmo em `drizzle.config.ts` (`dbCredentials.authToken`)
3. Rodar `npm run db:push` apontando pro banco do Turso (definindo
   `DATABASE_URL`/`DATABASE_AUTH_TOKEN` no terminal antes do comando) para
   criar as tabelas lá.

Se preferir Postgres tradicional em vez de Turso, também dá: troque
`dialect: "turso"` por `"postgresql"` em `drizzle.config.ts` e use
`drizzle-orm/node-postgres` (ou `@vercel/postgres`) em
`src/lib/db/index.ts`, com um provedor como Supabase ou Neon.

Além do banco, gere uma **`AUTH_SECRET`** nova e forte (`openssl rand
-base64 32`) e configure como variável de ambiente na hospedagem — nunca
reuse a do `.env` de exemplo.

Depois disso, o roteiro natural é: Stripe (plano gratuito com limite de OS
+ plano pago ilimitado), envio automático da OS por WhatsApp, e
relatórios de faturamento.

# Assinatura (Stripe)

O app já está pronto pro modelo: **7 dias de teste grátis, sem pedir
cartão**, depois **R$ 39,90/mês**. Esses dois números estão em
`src/lib/subscription.ts` — pode mudar à vontade, não tem lógica escondida
em outro lugar.

## 1. Criar a conta

1. Crie uma conta em https://dashboard.stripe.com/register
2. Por padrão ela abre em **modo de teste** ("Test mode", tem um toggle
   no canto). Deixe em teste até validar tudo funcionando.

## 2. Criar o produto e o preço

1. No painel, vá em **Product catalog** → **Add product**
2. Nome: `OS Fácil — Plano Profissional`
3. Em "Pricing": modelo **Recurring**, valor `R$ 39,90`, intervalo
   **Monthly**
4. Salve. Clique no preço criado e copie o **Price ID** (começa com
   `price_...`)

## 3. Pegar a chave da API

1. **Developers** → **API keys**
2. Copie a **Secret key** (começa com `sk_test_...` no modo teste)

## 4. Configurar o webhook

O webhook é o que avisa seu app quando alguém assina, cancela ou tem um
pagamento recusado — sem ele, o status de assinatura não atualiza sozinho.

1. **Developers** → **Webhooks** → **Add endpoint**
2. URL do endpoint: `https://SEU-DOMINIO.vercel.app/api/stripe/webhook`
   (troque pela sua URL real de produção)
3. Eventos para escutar, adicione estes três:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Salve. Copie o **Signing secret** do endpoint (começa com `whsec_...`)

## 5. Configurar as variáveis de ambiente

Na Vercel (Settings → Environment Variables), adicione, com **Production**
marcado:

| Nome | Valor |
|---|---|
| `STRIPE_SECRET_KEY` | a Secret key do passo 3 |
| `STRIPE_PRICE_ID` | o Price ID do passo 2 |
| `STRIPE_WEBHOOK_SECRET` | o Signing secret do passo 4 |
| `NEXT_PUBLIC_APP_URL` | sua URL de produção (ex: `https://os-facil-seuuser.vercel.app`) |

Depois de adicionar, faça um **Redeploy** (Deployments → "⋯" → Redeploy).

## 6. Testar

Com a Stripe ainda em modo teste, crie uma conta nova no seu app, e na
tela "Assinatura" clique em "Assinar agora". Use um cartão de teste do
Stripe no checkout:

```
Número: 4242 4242 4242 4242
Validade: qualquer data futura
CVC: qualquer 3 dígitos
```

Se o checkout completar e a página `/dashboard/assinatura` mostrar
"Assinatura ativa", o webhook está funcionando.

## 7. Ir para produção de verdade

Quando estiver tudo testado, no painel do Stripe tem um botão pra
**ativar a conta** (ele pede dados da empresa/CPF, conta bancária pra
receber). Depois disso, troque o toggle pra **Live mode** e repita os
passos 2, 3 e 4 nesse modo (as chaves de teste e de produção são
diferentes) — atualize as variáveis de ambiente na Vercel com as chaves
`sk_live_...` e o novo webhook secret.

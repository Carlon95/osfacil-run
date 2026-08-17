# Lançar o OS Fácil oficialmente

Isso tem 4 partes: **legal/fiscal**, **técnica**, **loja de apps** e
**comercial**. A ordem importa — algumas coisas travam outras. Vou marcar
com 🧑‍💻 o que eu ajudo a construir e com 🧾 o que só você resolve
(burocracia, contas, decisões de negócio).

## Fase 0 — Base legal (faça isso primeiro)

Sem isso, você não consegue nem receber pelo Stripe de verdade nem emitir
nota fiscal — é a fundação de tudo.

- [ ] 🧾 **Abrir CNPJ.** Pra um SaaS começando, MEI costuma não servir
      (tem teto de faturamento de ~R$81 mil/ano e restrição de atividade
      pra alguns tipos de serviço de tecnologia) — vale conversar com um
      contador sobre MEI vs. Simples Nacional (ME) desde já, olhando pra
      onde você quer chegar em faturamento.
- [ ] 🧾 **Contratar um contador.** Ele vai te dar o código de serviço
      (LC 116), a alíquota de ISS pro seu município e cuidar dos impostos
      da própria empresa OS Fácil (diferente dos dados fiscais que cada
      *usuário* do app preenche pros próprios clientes deles).
- [ ] 🧾 **Conta bancária PJ**, pra receber os repasses do Stripe.
- [ ] 🧑‍💻 **Termos de Uso e Política de Privacidade** — já criei as
      páginas (`/termos` e `/privacidade`), mas tem campos marcados
      `[PREENCHER]` (razão social, CNPJ, e-mail de contato, data). Depois
      que tiver CNPJ, me avisa que eu preencho, ou você mesmo edita os
      arquivos `src/app/termos/page.tsx` e `src/app/privacidade/page.tsx`.
      **Recomendo um advogado revisar antes do lançamento oficial** —
      escrevi um rascunho razoável, mas não sou advogado, e você vai
      processar dado de terceiros (os clientes dos seus usuários), o que
      pede mais cuidado sob a LGPD.
- [ ] 🧾 **Registro da marca "OS Fácil"** no INPI, se quiser proteger o
      nome (opcional, mas evita alguém registrar antes de você — processo
      leva meses, então quanto antes começar, melhor).

## Fase 1 — Deixar o app pronto pra valer

- [ ] 🧾 **Domínio próprio.** Hoje o app está em
      `osfacil-run.vercel.app` — compre algo como `osfacil.com.br` (Registro.br,
      ~R$40/ano) e configure na Vercel (Settings → Domains). Depois, atualize
      `NEXT_PUBLIC_APP_URL` e o endpoint do webhook do Stripe pra URL nova.
- [ ] 🧾 **Stripe em modo produção** (`Live mode`) — troque as chaves de
      teste pelas de produção (veja `STRIPE.md`, seção 7). Isso exige
      ativar a conta Stripe com dados reais da empresa.
- [ ] 🧾 **Focus NFe em modo produção** — mesma lógica, precisa da conta
      validada com certificado digital da empresa (veja `FOCUSNFE.md`).
- [ ] 🧑‍💻 **E-mail transacional.** Hoje o app não manda e-mail nenhum —
      sem confirmação de cadastro, sem recuperação de senha. Pra um
      lançamento oficial, recuperação de senha é bem importante (hoje, se
      alguém esquece a senha, fica sem acesso). Posso implementar isso
      com Resend (tem plano grátis) quando você quiser — é a próxima
      coisa que eu recomendaria construir.
- [ ] 🧑‍💻 **Monitoramento de erro** (ex: Sentry, tem plano grátis) — pra
      você saber se algo quebrar em produção antes do usuário reclamar.
      Não implementei ainda; posso adicionar.
- [ ] 🧾 **Backup do banco.** O Turso faz backup automático nos planos
      pagos — confira o plano que você está usando.
- [ ] 🧑‍💻 **Teste de ponta a ponta uma última vez**: criar conta →
      assinar de verdade (com cartão real, valor baixo, você mesmo
      testando) → criar cliente → criar OS → emitir nota fiscal →
      cancelar assinatura. Faça isso com a Stripe e Focus NFe ainda em
      modo teste antes de virar a chave pra produção.

## Fase 2 — Google Play

- [ ] 🧾 **Conta Google Play Console** (taxa única de US$25) —
      https://play.google.com/console
- [ ] 🧑‍💻 **Gerar o `.aab` assinado** — passo a passo já está no
      `MOBILE.md`. Antes de gerar, atualize `capacitor.config.ts` pra
      apontar pro domínio novo (se você comprou um).
- [ ] 🧾 **Ficha da loja**: nome, descrição curta e longa, categoria
      (Produtividade ou Negócios), ícone (já tenho pronto em `assets/`),
      capturas de tela — tire umas 4-6 direto do app rodando (celular ou
      emulador).
- [ ] 🧾 **URL da Política de Privacidade** — a Google Play *exige* isso.
      Use `https://seu-dominio.com.br/privacidade`.
- [ ] 🧾 **Formulário de Segurança de Dados (Data Safety)** — a Google
      pergunta detalhadamente quais dados o app coleta e por quê. Baseado
      no que o app faz, você vai declarar: dados pessoais (nome, e-mail,
      telefone), dados financeiros (via Stripe), localização (não
      coletamos). Isso é preenchido no próprio painel, mas o conteúdo da
      nossa Política de Privacidade te dá a base.
- [ ] 🧾 **Classificação indicativa** — questionário simples, app sem
      conteúdo sensível deve sair como "Livre".
- [ ] 🧑‍💻 **Comece em "Teste interno"** antes de ir pra produção — libera
      mais rápido (minutos, não dias) e te deixa testar num grupo pequeno
      antes do público geral.
- [ ] 🧾 **Enviar pra revisão** — a Google costuma levar de algumas horas
      a poucos dias na primeira submissão.

## Fase 3 — Lançamento comercial

- [ ] 🧾 **Onde seu público está.** Eletricista, encanador, técnico de
      ar-condicionado, borracheiro, mecânico de trator — esse público
      costuma estar mais em grupos de WhatsApp/Facebook por categoria e
      região, e em lojas físicas de material (elétrica, hidráulica,
      autopeças) do que em canais "de tecnologia". Parcerias com essas
      lojas locais (um cartãozinho no balcão, por exemplo) podem valer
      mais que anúncio online no começo.
- [ ] 🧾 **Prova social**: pegue os primeiros 5-10 usuários (pode ser
      gente que você conhece do ramo) pra usar de graça por mais tempo em
      troca de feedback e, se gostarem, um depoimento pra colocar na
      landing page.
- [ ] 🧾 **Canal de suporte.** WhatsApp Business é provavelmente o mais
      natural pro seu público — considere colocar um número visível na
      landing page e no rodapé do app.
- [ ] 🧾 **Métricas básicas**: quantos cadastros, quantos viram
      assinantes pagos (taxa de conversão do trial), quantos cancelam.
      Isso guia se o preço/mensagem estão certos. Posso te ajudar a
      montar um painel simples disso mais pra frente, se quiser.

## Ordem sugerida, resumida

```
1. CNPJ + contador  (trava tudo que depende de dinheiro/nota fiscal)
2. Termos/Privacidade preenchidos de verdade
3. Domínio próprio
4. Recuperação de senha por e-mail (recomendo fortemente antes do público geral)
5. Stripe + Focus NFe em produção
6. Teste de ponta a ponta
7. Google Play: ficha, .aab assinado, teste interno → produção
8. Primeiros usuários reais, boca a boca / parcerias locais
```

Nada disso precisa ser feito tudo de uma vez — dá pra lançar "suave"
(soft launch) com um grupo pequeno de usuários reais antes de ir com tudo
pro Google Play e pra divulgação ampla.

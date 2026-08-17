# E-mail (Resend)

Usado hoje só pra um caso: **redefinição de senha**. O plano grátis do
Resend dá 3.000 e-mails/mês, mais que suficiente pra isso.

## 1. Criar a conta

1. Crie uma conta em https://resend.com
2. **Developers** → **API Keys** → **Create API Key** — copie o valor
   (começa com `re_...`)

## 2. O jeito rápido pra testar (sem domínio próprio)

Sem verificar um domínio, o Resend só deixa mandar e-mail pro **endereço
que você usou pra criar a conta lá**. É perfeito pra testar agora:

| Nome | Valor |
|---|---|
| `RESEND_API_KEY` | a chave do passo 1 |
| `RESEND_FROM_EMAIL` | deixe em branco (usa `onboarding@resend.dev` automaticamente) |

Com isso, crie uma conta no OS Fácil usando o **mesmo e-mail da sua conta
Resend**, peça redefinição de senha, e o e-mail deve chegar.

## 3. Pra funcionar com usuários de verdade

Precisa verificar um domínio (o mesmo que você for usar pro site, ex:
`osfacil.com.br`, veja `LAUNCH.md`):

1. No Resend: **Domains** → **Add Domain** → digite seu domínio
2. Eles mostram alguns registros DNS (tipo TXT e MX) — adicione no painel
   onde você comprou o domínio (Registro.br, etc.)
3. Espera verificar (geralmente minutos, às vezes até 24h)
4. Depois de verificado, defina:

| Nome | Valor |
|---|---|
| `RESEND_FROM_EMAIL` | `OS Fácil <naoresponda@seudominio.com.br>` |

## 4. Configurar na Vercel

Adicione `RESEND_API_KEY` e (quando tiver domínio) `RESEND_FROM_EMAIL`
nas variáveis de ambiente do projeto, com **Production** marcado, e
faça um redeploy.

## 5. Testar

1. Vá em `/esqueci-senha` no app, digite um e-mail cadastrado
2. Confira a caixa de entrada (e o spam, na primeira vez)
3. Clique no link, defina uma senha nova, tente logar

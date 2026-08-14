# Deploy do OS Fácil

Isso é pré-requisito pro app Android: ele vai carregar a versão publicada
na internet, não o `localhost`. São dois serviços, os dois com plano
gratuito suficiente pra começar.

## 1. Banco de dados (Turso)

1. Crie uma conta em https://turso.tech (dá pra entrar com GitHub)
2. Instale a CLI ou use o painel web deles para criar um banco:
   - Painel web: "Create Database" → dê um nome (ex: `os-facil`) →
     escolha a região mais perto do Brasil
   - Depois de criado, pegue:
     - a **URL** do banco (algo como `libsql://os-facil-seuuser.turso.io`)
     - um **auth token** (o painel tem um botão "Create Token")
3. Guarde os dois valores — vai usar como variável de ambiente.
4. Rode a migração apontando pro banco do Turso (no seu computador,
   dentro da pasta do projeto):

   **Windows (PowerShell):**
   ```powershell
   $env:DATABASE_URL="libsql://os-facil-seuuser.turso.io"
   $env:DATABASE_AUTH_TOKEN="o-token-que-voce-copiou"
   npm run db:push
   ```

   Isso cria as tabelas no banco remoto (uma vez só; depois disso o app
   já usa esse banco).

## 2. Hospedagem (Vercel)

1. Suba o código do projeto para um repositório no GitHub (se ainda não
   estiver lá)
2. Crie uma conta em https://vercel.com (dá pra entrar com GitHub)
3. "Add New Project" → selecione o repositório → a Vercel detecta que é
   Next.js automaticamente
4. Antes de clicar em "Deploy", adicione as variáveis de ambiente
   (seção "Environment Variables"):
   - `DATABASE_URL` = a URL do Turso
   - `DATABASE_AUTH_TOKEN` = o token do Turso
   - `AUTH_SECRET` = uma chave nova e forte — gere uma com
     `openssl rand -base64 32` (ou peça pra mim gerar uma)
5. Clique em "Deploy". Em 1-2 minutos você tem uma URL tipo
   `https://os-facil-seuuser.vercel.app`
6. Teste: abra a URL, crie uma conta, gere uma OS. Se funcionar, seu
   SaaS está no ar de verdade.

Depois disso, sempre que você atualizar o código e enviar pro GitHub, a
Vercel publica a nova versão sozinha.

## Próximo passo

Com a URL de produção em mãos, é ela que vai entrar no
`capacitor.config.ts` (veja `MOBILE.md`) pra gerar o app Android.

# Nota fiscal (Focus NFe)

Antes de tudo, um alinhamento de expectativa: emissão de NFS-e no Brasil é
**regulada por prefeitura**, e cada uma das mais de 5.000 cidades pode ter
regras, campos obrigatórios e formatos ligeiramente diferentes. A Focus
NFe cobre mais de 3.000 municípios com uma API padronizada, mas isso não
elimina 100% das particularidades — o app está pronto pra emitir e
mostrar o status, mas é bem possível que sua prefeitura específica peça
um ajuste fino que só aparece na hora de testar.

## 1. Criar a conta

1. Crie uma conta em https://focusnfe.com.br (tem teste grátis)
2. Você vai receber um **token de homologação** (ambiente de testes) —
   use ele primeiro, sem nenhum risco de emitir nota de verdade

## 2. Configurar seus dados fiscais no app

Antes de emitir qualquer nota, entre em **Dados fiscais** (no menu do
app) e preencha:

- **CNPJ**
- **Inscrição municipal**
- **Código IBGE do município** — busque o seu em
  https://www.ibge.gov.br/explica/codigos-dos-municipios.php
- **Código do serviço (LC 116)** — a lista nacional de serviços; seu
  contador sabe qual código se aplica ao que você presta, ou você
  encontra em buscadores por "lista de serviços LC 116"
- **Alíquota de ISS** — também varia por cidade; seu contador tem esse
  número

Se você presta serviço como pessoa física (CPF, autônomo, sem CNPJ),
esse fluxo não se aplica diretamente — a emissão de NFS-e normalmente
exige CNPJ. Nesse caso, vale conversar com um contador sobre o melhor
caminho (ex: abrir MEI).

## 3. Configurar as variáveis de ambiente

Na Vercel, adicione:

| Nome | Valor |
|---|---|
| `FOCUS_NFE_TOKEN` | o token que você recebeu da Focus NFe |
| `FOCUS_NFE_ENV` | `homologacao` para testar, `producao` quando for emitir de verdade |

## 4. Testar

1. Com `FOCUS_NFE_ENV=homologacao`, abra uma OS que tenha um cliente
   com CPF/CNPJ cadastrado
2. Clique em "Emitir nota fiscal"
3. Se dar erro, a mensagem que aparece na tela vem direto da Focus
   NFe — geralmente ela já diz qual campo está faltando ou errado
   pro seu município específico

## 5. Se sua prefeitura pedir algo que o app não envia

O código que monta os dados enviados pra Focus NFe está isolado em dois
arquivos:

- `src/lib/focusnfe.ts` — o formato dos dados enviados (payload)
- `src/lib/actions/nota-fiscal.ts` — de onde vêm esses dados (CNPJ,
  cliente, valor da OS, etc.)

Se aparecer um erro pedindo um campo que não existe hoje, é nesses dois
arquivos que ele entra. Me manda a mensagem de erro que apareceu que eu
ajudo a ajustar.

## 6. Indo para produção

Depois de emitir com sucesso em homologação, é só trocar
`FOCUS_NFE_ENV` para `producao` e usar o token de produção (a Focus NFe
libera esse token depois que você valida seu cadastro com eles, que
inclui certificado digital da empresa).

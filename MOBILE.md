# App Android (OS Fácil)

O projeto Android nativo já está montado na pasta `android/` (gerado com
[Capacitor](https://capacitorjs.com)), com ícone e splash screen prontos.
Faltam 3 coisas, todas feitas na sua máquina.

## 1. Aponte para a URL de produção

Depois de publicar o SaaS (veja `DEPLOY.md`), edite
`capacitor.config.ts` na raiz do projeto:

```ts
const PRODUCTION_URL = "https://os-facil-seuuser.vercel.app"; // sua URL real
```

Depois rode:

```bash
npx cap sync android
```

Isso atualiza o projeto Android com a URL nova.

## 2. Instale o Android Studio

Baixe em https://developer.android.com/studio (gratuito). Ele já vem com
tudo que falta: SDK do Android, ferramentas de build, emulador.

Depois de instalado, abra o Android Studio → "Open" → selecione a pasta
`android/` dentro do projeto. Na primeira vez, ele baixa mais alguns
componentes automaticamente (pode levar alguns minutos).

Pra testar rápido, com o projeto aberto: clique no ▶ (Run) — ele
instala e abre o app num emulador ou no seu celular conectado por USB
(com "Depuração USB" ativada no celular).

## 3. Gere o app assinado e publique

Dentro do Android Studio:

1. `Build` → `Generate Signed Bundle / APK`
2. Escolha **Android App Bundle** (é o formato que a Google Play pede)
3. Na primeira vez, clique em "Create new..." para gerar uma keystore
   (chave de assinatura) — **guarde esse arquivo e a senha num lugar
   seguro**. Se perder, não dá pra atualizar o app depois.
4. Selecione "release", finalize — ele gera um arquivo `.aab`

Depois:

1. Crie uma conta em https://play.google.com/console (taxa única de
   US$25)
2. "Criar app" → preencha nome, categoria, público-alvo
3. Envie o `.aab` gerado na seção de "Produção" (ou comece testando em
   "Teste interno", que é mais rápido de liberar)
4. Preencha a ficha da loja: descrição, capturas de tela (pode tirar do
   próprio emulador), política de privacidade (precisa de uma URL —
   posso escrever um texto padrão se quiser), classificação indicativa
5. Envie para revisão — a Google costuma levar de algumas horas a
   poucos dias pra aprovar

## Onde estão os arquivos de marca

- `assets/icon.png`, `icon-background.png`, `icon-foreground.png` —
  fonte do ícone do app
- `assets/splash.png` — fonte da tela de abertura
- Se quiser mudar o ícone/splash depois: edite os SVGs de origem (ou
  troque os PNGs em `assets/`) e rode
  `npx capacitor-assets generate --android` (precisa reinstalar
  `@capacitor/assets` e `sharp` como dependências de desenvolvimento
  antes: `npm install -D @capacitor/assets sharp`)

## iOS, caso queira depois

Precisa de um Mac com Xcode + conta Apple Developer (US$99/ano). O
comando `npx cap add ios` gera o projeto iOS do mesmo jeito que o
Android — mas isso só pode ser compilado e publicado numa máquina Mac.

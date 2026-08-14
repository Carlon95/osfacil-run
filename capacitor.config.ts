import type { CapacitorConfig } from "@capacitor/cli";

// TROQUE pela URL real depois do deploy (veja DEPLOY.md).
// É essa URL que o app Android vai carregar.
const PRODUCTION_URL = "https://osfacil-run.vercel.app";

const config: CapacitorConfig = {
  appId: "com.osfacil.app",
  appName: "OS Fácil",
  webDir: "mobile-shell",
  server: {
    url: PRODUCTION_URL,
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;

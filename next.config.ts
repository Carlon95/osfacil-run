import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Padrão é 1MB — precisa ser maior que o limite de logo (1MB) mais
      // uma margem pro overhead do multipart/form-data.
      bodySizeLimit: "2mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS obrigatório por 2 anos, incluindo subdomínios
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Impede que o navegador "adivinhe" o tipo de um arquivo
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Impede que o site seja carregado dentro de um <iframe> de
          // outro site (proteção contra clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Não vaza a URL completa como referrer ao sair pra outro site
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desativa acesso a câmera/microfone/geolocalização — o app
          // não usa nada disso
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

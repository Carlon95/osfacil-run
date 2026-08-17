import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Padrão é 1MB — precisa ser maior que o limite de logo (1MB) mais
      // uma margem pro overhead do multipart/form-data.
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;

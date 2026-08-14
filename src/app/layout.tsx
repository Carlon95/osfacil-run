import type { Metadata } from "next";
import "@fontsource/barlow-condensed/500.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "OS Fácil — Ordens de serviço em segundos",
  description:
    "Crie, organize e envie ordens de serviço em segundos. Feito para eletricistas, encanadores, técnicos de ar-condicionado e outros prestadores autônomos.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}

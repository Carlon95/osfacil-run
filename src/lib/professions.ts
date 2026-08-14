export const PROFESSIONS = [
  { value: "eletricista", label: "Eletricista" },
  { value: "encanador", label: "Encanador" },
  { value: "ar_condicionado", label: "Técnico de ar-condicionado" },
  { value: "borracheiro", label: "Borracheiro" },
  { value: "mecanico_tratores", label: "Mecânico de tratores/máquinas agrícolas" },
  { value: "mecanico_auto", label: "Mecânico automotivo" },
  { value: "eletrodomesticos", label: "Técnico de eletrodomésticos" },
  { value: "marceneiro", label: "Marceneiro" },
  { value: "serralheiro", label: "Serralheiro" },
  { value: "montador_moveis", label: "Montador de móveis" },
  { value: "outro", label: "Outro" },
] as const;

export type ProfessionValue = (typeof PROFESSIONS)[number]["value"];

export const SUGGESTED_ITEMS: Record<string, string[]> = {
  eletricista: [
    "Disjuntor",
    "Fio/cabo",
    "Tomada",
    "Interruptor",
    "Fita isolante",
    "Terminal",
    "Quadro de distribuição",
    "Chuveiro elétrico",
  ],
  encanador: [
    "Registro",
    "Torneira",
    "Sifão",
    "Cano PVC",
    "Joelho/conexão",
    "Veda-rosca",
    "Caixa d'água",
    "Válvula de descarga",
  ],
  ar_condicionado: [
    "Gás refrigerante",
    "Filtro",
    "Capacitor",
    "Placa eletrônica",
    "Controle remoto",
    "Mangueira de dreno",
    "Compressor",
  ],
  borracheiro: [
    "Pneu",
    "Câmara de ar",
    "Válvula",
    "Remendo",
    "Balanceamento",
    "Bico de válvula",
  ],
  mecanico_tratores: [
    "Embreagem",
    "Rolamento",
    "Retentor",
    "Parafusos",
    "Correia",
    "Filtro de óleo",
    "Filtro de combustível",
    "Óleo hidráulico",
  ],
  mecanico_auto: [
    "Pastilha de freio",
    "Disco de freio",
    "Correia dentada",
    "Filtro de óleo",
    "Filtro de ar",
    "Vela de ignição",
    "Amortecedor",
    "Óleo do motor",
  ],
  eletrodomesticos: [
    "Resistência",
    "Termostato",
    "Correia",
    "Rolamento",
    "Placa eletrônica",
    "Mangueira",
  ],
  marceneiro: [
    "Dobradiça",
    "Puxador",
    "Parafuso",
    "Cola",
    "Trilho corrediço",
    "MDF/madeira",
  ],
  serralheiro: [
    "Eletrodo de solda",
    "Dobradiça",
    "Fechadura",
    "Trinco",
    "Tinta/primer",
    "Perfil metálico",
  ],
  montador_moveis: ["Parafuso", "Bucha", "Dobradiça", "Puxador", "Trilho"],
};

export function getProfessionLabel(value: string | null) {
  if (!value) return null;
  return PROFESSIONS.find((p) => p.value === value)?.label ?? value;
}

export function getSuggestedItems(profession: string | null): string[] {
  if (!profession) return [];
  return SUGGESTED_ITEMS[profession] ?? [];
}

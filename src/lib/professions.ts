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

export const SUGGESTED_SERVICE_TYPES: Record<string, string[]> = {
  eletricista: [
    "Instalação elétrica",
    "Troca de disjuntor",
    "Manutenção de quadro elétrico",
    "Instalação de chuveiro elétrico",
    "Troca de tomada/interruptor",
    "Detecção de curto-circuito",
  ],
  encanador: [
    "Conserto de vazamento",
    "Desentupimento",
    "Troca de registro/torneira",
    "Instalação hidráulica",
    "Manutenção de caixa d'água",
    "Instalação de válvula de descarga",
  ],
  ar_condicionado: [
    "Instalação de ar-condicionado",
    "Manutenção preventiva",
    "Recarga de gás",
    "Limpeza de filtros",
    "Conserto de vazamento de água",
    "Troca de peça",
  ],
  borracheiro: [
    "Troca de pneu",
    "Reparo de furo",
    "Balanceamento",
    "Alinhamento",
    "Calibragem",
    "Troca de câmara de ar",
  ],
  mecanico_tratores: [
    "Manutenção preventiva",
    "Troca de óleo",
    "Reparo de embreagem",
    "Troca de rolamento/retentor",
    "Revisão geral",
    "Reparo hidráulico",
  ],
  mecanico_auto: [
    "Troca de óleo",
    "Revisão geral",
    "Reparo no freio",
    "Troca de correia dentada",
    "Diagnóstico eletrônico",
    "Alinhamento e balanceamento",
  ],
  eletrodomesticos: [
    "Conserto de geladeira",
    "Conserto de máquina de lavar",
    "Manutenção preventiva",
    "Troca de peça",
    "Instalação",
  ],
  marceneiro: [
    "Fabricação de móvel sob medida",
    "Reparo de móvel",
    "Instalação de móvel planejado",
    "Troca de dobradiça/puxador",
    "Restauração",
  ],
  serralheiro: [
    "Fabricação de portão",
    "Solda estrutural",
    "Instalação de grade",
    "Conserto de fechadura",
    "Reforma de estrutura metálica",
  ],
  montador_moveis: [
    "Montagem de móveis",
    "Desmontagem para mudança",
    "Instalação de prateleiras",
    "Ajuste/reparo de móvel montado",
  ],
};

export function getSuggestedServiceTypes(profession: string | null): string[] {
  if (!profession) return [];
  return SUGGESTED_SERVICE_TYPES[profession] ?? [];
}

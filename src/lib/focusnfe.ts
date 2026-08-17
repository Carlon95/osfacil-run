// Cliente para a API da Focus NFe (https://doc.focusnfe.com.br).
//
// IMPORTANTE: a Focus NFe atualiza sua API com frequência (novidades como
// a "NFSe Nacional" mudam endpoints e campos por município). O que está
// aqui segue o padrão documentado publicamente no momento em que este
// código foi escrito, mas antes de ir para produção de verdade, confira
// o endpoint exato na documentação oficial (doc.focusnfe.com.br) — em
// especial se sua prefeitura já usa o Ambiente Nacional (endpoint
// `/v2/nfsen`) ou o ambiente tradicional (`/v2/nfse`).

function getBaseUrl() {
  const env = process.env.FOCUS_NFE_ENV ?? "homologacao";
  return env === "producao"
    ? "https://api.focusnfe.com.br"
    : "https://homologacao.focusnfe.com.br";
}

function getAuthHeader() {
  const token = process.env.FOCUS_NFE_TOKEN;
  if (!token) {
    throw new Error("FOCUS_NFE_TOKEN não configurado. Veja FOCUSNFE.md.");
  }
  // Basic Auth: token como usuário, senha em branco.
  const encoded = Buffer.from(`${token}:`).toString("base64");
  return `Basic ${encoded}`;
}

export type NfsePayload = {
  data_emissao: string;
  natureza_operacao: number;
  optante_simples_nacional: boolean;
  prestador: {
    cnpj: string;
    inscricao_municipal: string;
    codigo_municipio: string;
  };
  tomador: {
    cpf?: string;
    cnpj?: string;
    razao_social: string;
    email?: string;
    telefone?: string;
    endereco?: {
      logradouro?: string;
      numero?: string;
      bairro?: string;
      codigo_municipio?: string;
      uf?: string;
      cep?: string;
    };
  };
  servico: {
    discriminacao: string;
    item_lista_servico: string;
    codigo_tributario_municipio?: string;
    valor_servicos: number;
    aliquota?: number;
    iss_retido: boolean;
  };
};

export type FocusNfeResult = {
  status: string; // processando_autorizacao | autorizado | erro_autorizacao | cancelado
  numero?: string;
  url_danfse?: string; // PDF/HTML da nota
  mensagem_sefaz?: string;
  erros?: { mensagem: string }[];
};

export async function emitirNfse(
  ref: string,
  payload: NfsePayload
): Promise<FocusNfeResult> {
  const res = await fetch(`${getBaseUrl()}/v2/nfse?ref=${ref}`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return data;
}

export async function consultarNfse(ref: string): Promise<FocusNfeResult> {
  const res = await fetch(`${getBaseUrl()}/v2/nfse/${ref}`, {
    method: "GET",
    headers: { Authorization: getAuthHeader() },
  });

  const data = await res.json();
  return data;
}

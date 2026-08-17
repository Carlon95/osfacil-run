"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { serviceOrders, serviceOrderItems } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getServiceOrderById, getUserById } from "@/lib/queries";
import { emitirNfse, consultarNfse } from "@/lib/focusnfe";

export type NfActionState = { error?: string } | null;

export async function emitirNotaFiscal(
  orderId: string
): Promise<NfActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const [order, user] = await Promise.all([
    getServiceOrderById(session.userId, orderId),
    getUserById(session.userId),
  ]);
  if (!order || !user) return { error: "OS não encontrada" };

  if (!user.cnpj || !user.inscricaoMunicipal || !user.codigoMunicipio) {
    return {
      error:
        "Preencha seus dados fiscais (CNPJ, inscrição municipal, código do município) antes de emitir.",
    };
  }
  if (!order.clientDocument) {
    return {
      error: "O cliente dessa OS precisa ter CPF/CNPJ cadastrado.",
    };
  }

  const items = await db
    .select()
    .from(serviceOrderItems)
    .where(eq(serviceOrderItems.serviceOrderId, orderId))
    .all();
  const itemsTotal = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const total = itemsTotal + order.laborCost;

  const ref = `osfacil-${order.id}`.slice(0, 40);

  try {
    const result = await emitirNfse(ref, {
      data_emissao: new Date().toISOString(),
      natureza_operacao: 1,
      optante_simples_nacional: user.optanteSimplesNacional ?? false,
      prestador: {
        cnpj: user.cnpj.replace(/\D/g, ""),
        inscricao_municipal: user.inscricaoMunicipal,
        codigo_municipio: user.codigoMunicipio,
      },
      tomador: {
        ...(order.clientDocument.replace(/\D/g, "").length > 11
          ? { cnpj: order.clientDocument.replace(/\D/g, "") }
          : { cpf: order.clientDocument.replace(/\D/g, "") }),
        razao_social: order.clientName,
        email: order.clientEmail ?? undefined,
        telefone: order.clientPhone ?? undefined,
        endereco: {
          logradouro: order.clientAddress ?? undefined,
          bairro: order.clientNeighborhood ?? undefined,
          codigo_municipio: user.codigoMunicipio,
          uf: order.clientState ?? undefined,
          cep: order.clientZipCode?.replace(/\D/g, ""),
        },
      },
      servico: {
        discriminacao: `${order.serviceType} — ${order.description}`.slice(
          0,
          2000
        ),
        item_lista_servico: user.codigoServicoMunicipal ?? "",
        valor_servicos: total,
        aliquota: user.aliquotaIss ?? undefined,
        iss_retido: false,
      },
    });

    await db
      .update(serviceOrders)
      .set({
        nfRef: ref,
        nfStatus: result.status ?? "processando_autorizacao",
        nfError: result.erros?.map((e) => e.mensagem).join("; ") || null,
      })
      .where(
        and(eq(serviceOrders.id, orderId), eq(serviceOrders.userId, session.userId))
      );
  } catch (err) {
    await db
      .update(serviceOrders)
      .set({
        nfRef: ref,
        nfStatus: "erro",
        nfError: err instanceof Error ? err.message : "Erro ao emitir",
      })
      .where(
        and(eq(serviceOrders.id, orderId), eq(serviceOrders.userId, session.userId))
      );
  }

  revalidatePath(`/dashboard/os/${orderId}`);
  return null;
}

export async function consultarStatusNotaFiscal(
  orderId: string
): Promise<NfActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const order = await getServiceOrderById(session.userId, orderId);
  if (!order || !order.nfRef) return { error: "Nenhuma nota emitida ainda" };

  try {
    const result = await consultarNfse(order.nfRef);

    await db
      .update(serviceOrders)
      .set({
        nfStatus: result.status,
        nfNumber: result.numero ?? null,
        nfPdfUrl: result.url_danfse ?? null,
        nfError:
          result.erros?.map((e) => e.mensagem).join("; ") ||
          result.mensagem_sefaz ||
          null,
      })
      .where(
        and(eq(serviceOrders.id, orderId), eq(serviceOrders.userId, session.userId))
      );
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Erro ao consultar",
    };
  }

  revalidatePath(`/dashboard/os/${orderId}`);
  return null;
}

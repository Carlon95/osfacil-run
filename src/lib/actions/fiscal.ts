"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { fiscalDataSchema } from "@/lib/validators";

export type ActionState = { error?: string; success?: boolean } | null;

export async function updateFiscalData(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsed = fiscalDataSchema.safeParse({
    cnpj: formData.get("cnpj"),
    inscricaoMunicipal: formData.get("inscricaoMunicipal"),
    codigoMunicipio: formData.get("codigoMunicipio"),
    optanteSimplesNacional: formData.get("optanteSimplesNacional"),
    codigoServicoMunicipal: formData.get("codigoServicoMunicipal"),
    aliquotaIss: formData.get("aliquotaIss") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await db
    .update(users)
    .set({
      cnpj: parsed.data.cnpj || null,
      inscricaoMunicipal: parsed.data.inscricaoMunicipal || null,
      codigoMunicipio: parsed.data.codigoMunicipio || null,
      optanteSimplesNacional: parsed.data.optanteSimplesNacional === "sim",
      codigoServicoMunicipal: parsed.data.codigoServicoMunicipal || null,
      aliquotaIss: parsed.data.aliquotaIss ? Number(parsed.data.aliquotaIss) : null,
    })
    .where(eq(users.id, session.userId));

  revalidatePath("/dashboard/dados-fiscais");
  return { success: true };
}

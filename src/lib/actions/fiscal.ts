"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { fiscalDataSchema } from "@/lib/validators";

export type ActionState = { error?: string; success?: boolean } | null;

const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_LOGO_BYTES = 1 * 1024 * 1024; // 1 MB

export async function updateBusinessProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const businessName = (formData.get("businessName") as string | null)?.trim();
  const phone = (formData.get("phone") as string | null)?.trim();

  await db
    .update(users)
    .set({
      businessName: businessName || null,
      phone: phone || null,
    })
    .where(eq(users.id, session.userId));

  revalidatePath("/dashboard/dados-fiscais");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateLogo(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const file = formData.get("logo");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Escolha um arquivo de imagem" };
  }

  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    return { error: "Use uma imagem PNG, JPEG, WEBP ou SVG" };
  }

  if (file.size > MAX_LOGO_BYTES) {
    return {
      error: `Imagem muito grande (${(file.size / (1024 * 1024)).toFixed(1)} MB). Use uma de até 1 MB.`,
    };
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  await db
    .update(users)
    .set({ logoUrl: dataUrl })
    .where(eq(users.id, session.userId));

  revalidatePath("/dashboard/dados-fiscais");
  return { success: true };
}

export async function removeLogo() {
  const session = await getSession();
  if (!session) redirect("/login");

  await db.update(users).set({ logoUrl: null }).where(eq(users.id, session.userId));

  revalidatePath("/dashboard/dados-fiscais");
}

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

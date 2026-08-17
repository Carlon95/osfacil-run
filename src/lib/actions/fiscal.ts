"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { fiscalDataSchema } from "@/lib/validators";

export type ActionState = { error?: string; success?: boolean } | null;

// SVG não entra: pode conter script embutido. PNG/JPEG/WEBP são formatos
// puramente raster, sem capacidade nenhuma de executar código.
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_LOGO_BYTES = 1 * 1024 * 1024; // 1 MB

// Confere os primeiros bytes do arquivo de verdade — o "type" que o
// navegador manda é só uma etiqueta que dá pra falsificar facilmente.
function detectRealImageType(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

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
    return { error: "Use uma imagem PNG, JPEG ou WEBP" };
  }

  if (file.size > MAX_LOGO_BYTES) {
    return {
      error: `Imagem muito grande (${(file.size / (1024 * 1024)).toFixed(1)} MB). Use uma de até 1 MB.`,
    };
  }

  const bytes = await file.arrayBuffer();
  const byteArray = new Uint8Array(bytes);

  const realType = detectRealImageType(byteArray);
  if (!realType || !ALLOWED_LOGO_TYPES.includes(realType)) {
    return {
      error:
        "Esse arquivo não parece ser uma imagem válida (o conteúdo não bate com uma imagem PNG, JPEG ou WEBP de verdade).",
    };
  }

  const base64 = Buffer.from(byteArray).toString("base64");
  // Usa o tipo real detectado nos bytes, não o que o navegador declarou.
  const dataUrl = `data:${realType};base64,${base64}`;

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

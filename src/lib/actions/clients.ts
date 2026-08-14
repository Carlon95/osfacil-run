"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { clientSchema } from "@/lib/validators";
import { getSession } from "@/lib/auth";

export type ActionState = { error?: string } | null;

export async function createClient(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    document: formData.get("document"),
    zipCode: formData.get("zipCode"),
    address: formData.get("address"),
    neighborhood: formData.get("neighborhood"),
    city: formData.get("city"),
    state: formData.get("state"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await db.insert(clients).values({
    userId: session.userId,
    name: parsed.data.name,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    document: parsed.data.document || null,
    zipCode: parsed.data.zipCode || null,
    address: parsed.data.address || null,
    neighborhood: parsed.data.neighborhood || null,
    city: parsed.data.city || null,
    state: parsed.data.state || null,
    notes: parsed.data.notes || null,
  });

  revalidatePath("/dashboard/clientes");
  redirect("/dashboard/clientes?saved=criado");
}

export async function updateClient(
  clientId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    document: formData.get("document"),
    zipCode: formData.get("zipCode"),
    address: formData.get("address"),
    neighborhood: formData.get("neighborhood"),
    city: formData.get("city"),
    state: formData.get("state"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  await db
    .update(clients)
    .set({
      name: parsed.data.name,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      document: parsed.data.document || null,
      zipCode: parsed.data.zipCode || null,
      address: parsed.data.address || null,
      neighborhood: parsed.data.neighborhood || null,
      city: parsed.data.city || null,
      state: parsed.data.state || null,
      notes: parsed.data.notes || null,
    })
    .where(and(eq(clients.id, clientId), eq(clients.userId, session.userId)));

  revalidatePath("/dashboard/clientes");
  revalidatePath(`/dashboard/clientes/${clientId}`);
  redirect("/dashboard/clientes?saved=atualizado");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq, and, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, serviceOrders, serviceOrderItems } from "@/lib/db/schema";
import { serviceOrderSchema, osStatusSchema } from "@/lib/validators";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { hasActiveAccess } from "@/lib/subscription";

export type ActionState = { error?: string } | null;

export async function createServiceOrder(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const currentUser = await getUserById(session.userId);
  if (!currentUser) redirect("/api/auth/invalidate");
  if (!hasActiveAccess(currentUser)) redirect("/dashboard/assinatura");

  let items: unknown = [];
  const itemsRaw = formData.get("itemsJson");
  if (typeof itemsRaw === "string" && itemsRaw.length > 0) {
    try {
      items = JSON.parse(itemsRaw);
    } catch {
      return { error: "Não foi possível ler os itens da OS" };
    }
  }

  const parsed = serviceOrderSchema.safeParse({
    clientId: formData.get("clientId") || undefined,
    newClientName: formData.get("newClientName") || undefined,
    newClientPhone: formData.get("newClientPhone") || undefined,
    serviceType: formData.get("serviceType"),
    description: formData.get("description"),
    laborCost: formData.get("laborCost") || 0,
    scheduledDate: formData.get("scheduledDate") || undefined,
    notes: formData.get("notes") || undefined,
    items,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const data = parsed.data;

  let clientId = data.clientId;

  if (clientId) {
    // Confere que o cliente escolhido realmente pertence a quem está
    // logado — sem isso, dava pra vincular a OS ao cliente de outra
    // conta só manipulando o valor enviado no formulário.
    const ownedClient = await db
      .select({ id: clients.id })
      .from(clients)
      .where(and(eq(clients.id, clientId), eq(clients.userId, session.userId)))
      .get();

    if (!ownedClient) {
      return { error: "Cliente inválido" };
    }
  }

  if (!clientId) {
    if (!data.newClientName || data.newClientName.length < 2) {
      return { error: "Selecione um cliente ou informe o nome de um novo" };
    }
    const [newClient] = await db
      .insert(clients)
      .values({
        userId: session.userId,
        name: data.newClientName,
        phone: data.newClientPhone || null,
      })
      .returning({ id: clients.id });
    clientId = newClient.id;
  }

  const [{ total: existingCount }] = await db
    .select({ total: count() })
    .from(serviceOrders)
    .where(eq(serviceOrders.userId, session.userId));

  const [createdOrder] = await db
    .insert(serviceOrders)
    .values({
      number: existingCount + 1,
      userId: session.userId,
      clientId,
      serviceType: data.serviceType,
      description: data.description,
      laborCost: data.laborCost,
      scheduledDate: data.scheduledDate || null,
      notes: data.notes || null,
    })
    .returning({ id: serviceOrders.id });

  if (data.items.length > 0) {
    await db.insert(serviceOrderItems).values(
      data.items.map((item) => ({
        serviceOrderId: createdOrder.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }))
    );
  }

  revalidatePath("/dashboard/os");
  revalidatePath("/dashboard");
  redirect(`/dashboard/os/${createdOrder.id}`);
}

export async function updateServiceOrderStatus(
  orderId: string,
  status: string
) {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsedStatus = osStatusSchema.safeParse(status);
  if (!parsedStatus.success) return;

  await db
    .update(serviceOrders)
    .set({ status: parsedStatus.data, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(serviceOrders.id, orderId),
        eq(serviceOrders.userId, session.userId)
      )
    );

  revalidatePath(`/dashboard/os/${orderId}`);
  revalidatePath("/dashboard/os");
  revalidatePath("/dashboard");
}

export async function setServiceOrderArchived(orderId: string, archived: boolean) {
  const session = await getSession();
  if (!session) redirect("/login");

  await db
    .update(serviceOrders)
    .set({ archived, updatedAt: new Date().toISOString() })
    .where(
      and(
        eq(serviceOrders.id, orderId),
        eq(serviceOrders.userId, session.userId)
      )
    );

  revalidatePath(`/dashboard/os/${orderId}`);
  revalidatePath("/dashboard/os");
  revalidatePath("/dashboard");
}

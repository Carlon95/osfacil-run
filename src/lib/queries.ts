import { eq, and, desc, sql, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { clients, serviceOrders, serviceOrderItems, users } from "@/lib/db/schema";

export async function getUserById(userId: string) {
  return db.select().from(users).where(eq(users.id, userId)).get();
}

export async function getClientById(userId: string, clientId: string) {
  return db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.userId, userId)))
    .get();
}

export async function getClientsForUser(userId: string) {
  return db
    .select()
    .from(clients)
    .where(eq(clients.userId, userId))
    .orderBy(desc(clients.createdAt))
    .all();
}

export async function getServiceOrdersForUser(
  userId: string,
  status?: string,
  archived: boolean = false
) {
  const conditions = status
    ? and(
        eq(serviceOrders.userId, userId),
        eq(serviceOrders.status, status),
        eq(serviceOrders.archived, archived)
      )
    : and(eq(serviceOrders.userId, userId), eq(serviceOrders.archived, archived));

  const rows = await db
    .select({
      id: serviceOrders.id,
      number: serviceOrders.number,
      serviceType: serviceOrders.serviceType,
      status: serviceOrders.status,
      laborCost: serviceOrders.laborCost,
      createdAt: serviceOrders.createdAt,
      scheduledDate: serviceOrders.scheduledDate,
      archived: serviceOrders.archived,
      clientName: clients.name,
    })
    .from(serviceOrders)
    .innerJoin(clients, eq(serviceOrders.clientId, clients.id))
    .where(conditions)
    .orderBy(desc(serviceOrders.createdAt))
    .all();

  if (rows.length === 0) return [];

  const itemSums = await db
    .select({
      serviceOrderId: serviceOrderItems.serviceOrderId,
      itemsTotal: sql<number>`sum(${serviceOrderItems.quantity} * ${serviceOrderItems.unitPrice})`,
    })
    .from(serviceOrderItems)
    .where(
      inArray(
        serviceOrderItems.serviceOrderId,
        rows.map((r) => r.id)
      )
    )
    .groupBy(serviceOrderItems.serviceOrderId)
    .all();

  const sumByOrder = new Map(itemSums.map((s) => [s.serviceOrderId, s.itemsTotal]));

  return rows.map((row) => ({
    ...row,
    total: row.laborCost + (sumByOrder.get(row.id) ?? 0),
  }));
}

export async function getServiceOrderById(userId: string, orderId: string) {
  const order = await db
    .select({
      id: serviceOrders.id,
      number: serviceOrders.number,
      serviceType: serviceOrders.serviceType,
      description: serviceOrders.description,
      laborCost: serviceOrders.laborCost,
      status: serviceOrders.status,
      notes: serviceOrders.notes,
      scheduledDate: serviceOrders.scheduledDate,
      createdAt: serviceOrders.createdAt,
      archived: serviceOrders.archived,
      nfStatus: serviceOrders.nfStatus,
      nfRef: serviceOrders.nfRef,
      nfNumber: serviceOrders.nfNumber,
      nfPdfUrl: serviceOrders.nfPdfUrl,
      nfError: serviceOrders.nfError,
      clientId: clients.id,
      clientName: clients.name,
      clientPhone: clients.phone,
      clientEmail: clients.email,
      clientDocument: clients.document,
      clientAddress: clients.address,
      clientNeighborhood: clients.neighborhood,
      clientCity: clients.city,
      clientState: clients.state,
      clientZipCode: clients.zipCode,
    })
    .from(serviceOrders)
    .innerJoin(clients, eq(serviceOrders.clientId, clients.id))
    .where(
      and(eq(serviceOrders.id, orderId), eq(serviceOrders.userId, userId))
    )
    .get();

  if (!order) return null;

  const items = await db
    .select()
    .from(serviceOrderItems)
    .where(eq(serviceOrderItems.serviceOrderId, orderId))
    .all();

  return { ...order, items };
}

export async function getDashboardSummary(userId: string) {
  const all = await db
    .select({
      status: serviceOrders.status,
      laborCost: serviceOrders.laborCost,
    })
    .from(serviceOrders)
    .where(and(eq(serviceOrders.userId, userId), eq(serviceOrders.archived, false)))
    .all();

  return {
    total: all.length,
    abertas: all.filter((o) => o.status === "ABERTA").length,
    emAndamento: all.filter((o) => o.status === "EM_ANDAMENTO").length,
    concluidas: all.filter((o) => o.status === "CONCLUIDA").length,
  };
}

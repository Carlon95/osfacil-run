import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  businessName: text("business_name"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  profession: text("profession"),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const clients = sqliteTable("clients", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  document: text("document"), // CPF ou CNPJ
  zipCode: text("zip_code"),
  address: text("address"),
  neighborhood: text("neighborhood"),
  city: text("city"),
  state: text("state"),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ABERTA | EM_ANDAMENTO | CONCLUIDA | CANCELADA
export const serviceOrders = sqliteTable("service_orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  number: integer("number").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: text("client_id")
    .notNull()
    .references(() => clients.id),
  serviceType: text("service_type").notNull(),
  description: text("description").notNull(),
  laborCost: real("labor_cost").notNull().default(0),
  status: text("status").notNull().default("ABERTA"),
  notes: text("notes"),
  scheduledDate: text("scheduled_date"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const serviceOrderItems = sqliteTable("service_order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  serviceOrderId: text("service_order_id")
    .notNull()
    .references(() => serviceOrders.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: real("quantity").notNull().default(1),
  unitPrice: real("unit_price").notNull().default(0),
});

export const usersRelations = relations(users, ({ many }) => ({
  clients: many(clients),
  serviceOrders: many(serviceOrders),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  user: one(users, { fields: [clients.userId], references: [users.id] }),
  serviceOrders: many(serviceOrders),
}));

export const serviceOrdersRelations = relations(
  serviceOrders,
  ({ one, many }) => ({
    user: one(users, { fields: [serviceOrders.userId], references: [users.id] }),
    client: one(clients, {
      fields: [serviceOrders.clientId],
      references: [clients.id],
    }),
    items: many(serviceOrderItems),
  })
);

export const serviceOrderItemsRelations = relations(
  serviceOrderItems,
  ({ one }) => ({
    serviceOrder: one(serviceOrders, {
      fields: [serviceOrderItems.serviceOrderId],
      references: [serviceOrders.id],
    }),
  })
);

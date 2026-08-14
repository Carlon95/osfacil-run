import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  libsqlClient: ReturnType<typeof createClient> | undefined;
};

const client =
  globalForDb.libsqlClient ??
  createClient({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

if (process.env.NODE_ENV !== "production") globalForDb.libsqlClient = client;

// PRAGMA de foreign keys só existe em SQLite local — bancos remotos no
// Turso já vêm com isso configurado, e chamar isso neles dá erro.
if (!process.env.DATABASE_AUTH_TOKEN) {
  void client.execute("PRAGMA foreign_keys = ON");
}

export const db = drizzle(client, { schema });

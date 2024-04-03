import { text, sqliteTable } from "drizzle-orm/sqlite-core";

export const log = sqliteTable("log", {
  id: text("id").notNull().primaryKey(),
  ts: text("ts").notNull(),
  ip: text("ip").notNull(),
});

export interface Log {
  ts: string;
  ip: string;
  id: string;
}

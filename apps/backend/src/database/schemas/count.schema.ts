import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const count = sqliteTable("count", {
  id: text("id").notNull().primaryKey(),
  count: integer("count").notNull(),
  // counts tied to ip address
  ip: text("ip").notNull().unique(),
});

export interface Count {
  ip: string;
  count: number;
  id: string;
}

export interface CountInsertData {
  ip: string;
  // count: number
  id: string;
}

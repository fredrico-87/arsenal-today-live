import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const matchesTable = pgTable("matches", {
  id: serial("id").primaryKey(),
  opponent: text("opponent").notNull(),
  date: text("date").notNull(),
  competition: text("competition").notNull(),
  venue: text("venue"),
  isHome: boolean("is_home").notNull().default(true),
  status: text("status").notNull().default("upcoming"),
  arsenalScore: integer("arsenal_score"),
  opponentScore: integer("opponent_score"),
  streamUrl: text("stream_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMatchSchema = createInsertSchema(matchesTable).omit({ id: true, createdAt: true });
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matchesTable.$inferSelect;

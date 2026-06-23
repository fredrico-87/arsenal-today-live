// @ts-nocheck
import { Router } from "express";
import { db } from "@workspace/db";
import { matchesTable, insertMatchSchema } from "@workspace/db";
import { eq, desc, gte, lt } from "drizzle-orm";

const router = Router();

router.get("/matches", async (req, res) => {
  const type = req.query["type"] as string | undefined;
  const now = new Date().toISOString();

  let rows;
  if (type === "upcoming") {
    rows = await db.select().from(matchesTable).where(eq(matchesTable.status, "upcoming")).orderBy(matchesTable.date);
  } else if (type === "recent") {
    rows = await db.select().from(matchesTable).where(eq(matchesTable.status, "completed")).orderBy(desc(matchesTable.date)).limit(10);
  } else {
    rows = await db.select().from(matchesTable).orderBy(desc(matchesTable.date));
  }

  return res.json(rows.map(formatMatch));
});

router.post("/matches", async (req, res) => {
  const parsed = insertMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const [row] = await db.insert(matchesTable).values(parsed.data).returning();
  return res.status(201).json(formatMatch(row));
});

router.get("/matches/:id", async (req, res) => {
  const id = parseInt(req.params["id"]!);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [row] = await db.select().from(matchesTable).where(eq(matchesTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(formatMatch(row));
});

router.get("/next-match", async (req, res) => {
  const [row] = await db.select().from(matchesTable)
    .where(eq(matchesTable.status, "upcoming"))
    .orderBy(matchesTable.date)
    .limit(1);
  if (!row) return res.status(404).json({ error: "No upcoming match" });
  return res.json(formatMatch(row));
});

function formatMatch(row: typeof matchesTable.$inferSelect) {
  return {
    id: row.id,
    opponent: row.opponent,
    date: row.date,
    competition: row.competition,
    venue: row.venue ?? null,
    isHome: row.isHome,
    status: row.status,
    arsenalScore: row.arsenalScore ?? null,
    opponentScore: row.opponentScore ?? null,
    streamUrl: row.streamUrl ?? null,
  };
}

export default router;

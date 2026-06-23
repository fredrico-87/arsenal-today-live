import { Router } from "express";
import { db } from "@workspace/db";
import { streamsTable, insertStreamSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/streams", async (req, res) => {
  const rows = await db.select().from(streamsTable).orderBy(desc(streamsTable.createdAt));
  return res.json(rows.map(formatStream));
});

router.post("/streams", async (req, res) => {
  const parsed = insertStreamSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const [row] = await db.insert(streamsTable).values(parsed.data).returning();
  return res.status(201).json(formatStream(row));
});

router.delete("/streams/:id", async (req, res) => {
  const id = parseInt(req.params["id"]!);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  await db.delete(streamsTable).where(eq(streamsTable.id, id));
  return res.status(204).send();
});

function formatStream(row: typeof streamsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    url: row.url,
    isLive: row.isLive,
    matchId: row.matchId ?? null,
    thumbnailUrl: row.thumbnailUrl ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;

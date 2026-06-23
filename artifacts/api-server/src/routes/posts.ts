// @ts-nocheck
import { Router } from "express";
import { db } from "@workspace/db";
import { postsTable, insertPostSchema } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/posts", async (req, res) => {
  const rows = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
  return res.json(rows.map(formatPost));
});

router.post("/posts", async (req, res) => {
  const parsed = insertPostSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const [row] = await db.insert(postsTable).values({ ...parsed.data, likes: 0 }).returning();
  return res.status(201).json(formatPost(row));
});

router.post("/posts/:id/like", async (req, res) => {
  const id = parseInt(req.params["id"]!);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [row] = await db.update(postsTable)
    .set({ likes: sql`${postsTable.likes} + 1` })
    .where(eq(postsTable.id, id))
    .returning();
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(formatPost(row));
});

function formatPost(row: typeof postsTable.$inferSelect) {
  return {
    id: row.id,
    author: row.author,
    content: row.content,
    likes: row.likes,
    createdAt: row.createdAt.toISOString(),
  };
}

export default router;

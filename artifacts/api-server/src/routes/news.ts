// @ts-nocheck
import { Router } from "express";
import { db } from "@workspace/db";
import { articlesTable, insertArticleSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/news", async (req, res) => {
  const category = req.query["category"] as string | undefined;
  const limit = req.query["limit"] ? parseInt(req.query["limit"] as string) : undefined;

  let query = db.select().from(articlesTable).orderBy(desc(articlesTable.publishedAt));

  const rows = category
    ? await db.select().from(articlesTable).where(eq(articlesTable.category, category)).orderBy(desc(articlesTable.publishedAt)).limit(limit ?? 100)
    : await db.select().from(articlesTable).orderBy(desc(articlesTable.publishedAt)).limit(limit ?? 100);

  return res.json(rows.map(formatArticle));
});

router.post("/news", async (req, res) => {
  const parsed = insertArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  const [row] = await db.insert(articlesTable).values(parsed.data).returning();
  return res.status(201).json(formatArticle(row));
});

router.get("/news/:id", async (req, res) => {
  const id = parseInt(req.params["id"]!);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const [row] = await db.select().from(articlesTable).where(eq(articlesTable.id, id));
  if (!row) return res.status(404).json({ error: "Not found" });
  return res.json(formatArticle(row));
});

router.delete("/news/:id", async (req, res) => {
  const id = parseInt(req.params["id"]!);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  await db.delete(articlesTable).where(eq(articlesTable.id, id));
  return res.status(204).send();
});

function formatArticle(row: typeof articlesTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt ?? null,
    category: row.category,
    imageUrl: row.imageUrl ?? null,
    publishedAt: row.publishedAt.toISOString(),
  };
}

export default router;

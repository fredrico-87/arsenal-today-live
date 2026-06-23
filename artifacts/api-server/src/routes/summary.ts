import { Router } from "express";
import { db } from "@workspace/db";
import { matchesTable, streamsTable, articlesTable, postsTable } from "@workspace/db";
import { eq, desc, count } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const [matchCount] = await db.select({ count: count() }).from(matchesTable);
  const [upcomingCount] = await db.select({ count: count() }).from(matchesTable).where(eq(matchesTable.status, "upcoming"));
  const [newsCount] = await db.select({ count: count() }).from(articlesTable);
  const [postsCount] = await db.select({ count: count() }).from(postsTable);
  const [liveStreamsCount] = await db.select({ count: count() }).from(streamsTable).where(eq(streamsTable.isLive, true));

  const [lastMatch] = await db.select()
    .from(matchesTable)
    .where(eq(matchesTable.status, "completed"))
    .orderBy(desc(matchesTable.date))
    .limit(1);

  let lastResult: string | null = null;
  if (lastMatch) {
    const aScore = lastMatch.arsenalScore ?? 0;
    const oScore = lastMatch.opponentScore ?? 0;
    const outcome = aScore > oScore ? "W" : aScore < oScore ? "L" : "D";
    lastResult = `${outcome} ${aScore}-${oScore} vs ${lastMatch.opponent}`;
  }

  return res.json({
    totalMatches: matchCount?.count ?? 0,
    upcomingMatches: upcomingCount?.count ?? 0,
    totalNews: newsCount?.count ?? 0,
    totalPosts: postsCount?.count ?? 0,
    liveStreams: liveStreamsCount?.count ?? 0,
    lastResult,
  });
});

export default router;

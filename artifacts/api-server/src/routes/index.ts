import { Router, type IRouter } from "express";
import healthRouter from "./health";
import matchesRouter from "./matches";
import streamsRouter from "./streams";
import newsRouter from "./news";
import postsRouter from "./posts";
import summaryRouter from "./summary";

const router: IRouter = Router();

router.use(healthRouter);
router.use(matchesRouter);
router.use(streamsRouter);
router.use(newsRouter);
router.use(postsRouter);
router.use(summaryRouter);

export default router;

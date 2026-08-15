import { Router } from "express";
import {
  fetchEndlessDistribution,
  fetchPuzzle,
  fetchStats,
  updateStats,
} from "../controllers/wordsmithController";

/**
 * Route for Wordsmith
 * GET api/wordsmith/puzzle - get random puzzle.
 * POST api/wordsmith/stats - update game's global statistics.
 * GET api/wordsmith/stats - get game's statistics for a specific mode and difficulty
 * GET api/wordsmith/distribution - get game's full stats for endless mode
 */
const router = Router();

router.post("/puzzle", fetchPuzzle);
router.post("/stats", updateStats);
router.get("/stats", fetchStats);
router.get("/distribution", fetchEndlessDistribution);

export default router;

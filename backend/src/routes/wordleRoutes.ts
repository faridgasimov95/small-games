import { Router } from "express";
import {
  fetchWord,
  updateStats,
  fetchStats,
  fetchEndlessDistribution,
} from "../controllers/wordleController";

/**
 * Route for Wordle
 * GET api/wordle/word - get random word.
 * POST api/wordle/stats - update game's global statistics.
 * GET api/wordle/stats - get game's statistics for a specific mode and difficulty
 * GET api/wordle/distribution - get game's full stats for endless mode
 */
const router = Router();

router.post("/word", fetchWord);
router.post("/stats", updateStats);
router.get("/stats", fetchStats);
router.get("/distribution", fetchEndlessDistribution);

export default router;

import { Router } from "express";
import {
  fetchWord,
  updateStats,
  fetchStats,
  fetchEndlessDistribution,
} from "../controllers/hangmanController";

/**
 * Route for Hangman
 * GET api/hangman/word - get random word.
 * POST api/hangman/stats - update game's global statistics.
 * GET api/hangman/stats - get game's statistics for a specific mode and difficulty
 * GET api/hangman/distribution - get game's full stats for endless mode
 */
const router = Router();

router.post("/word", fetchWord);
router.post("/stats", updateStats);
router.get("/stats", fetchStats);
router.get("/distribution", fetchEndlessDistribution);

export default router;

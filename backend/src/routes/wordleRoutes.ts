import { Router } from "express";
import {
  fetchWord,
  updateStats,
  fetchStats,
} from "../controllers/wordleController";

/**
 * Route for Wordle
 * GET api/wordle/word - get random word.
 * POST api/wordle/stats - update game's global statistics.
 * GET api/wordle/stats - get game's statistics for a specific mode and difficulty
 */
const router = Router();

router.post("/word", fetchWord);
router.post("/stats", updateStats);
router.get("/stats", fetchStats);

export default router;

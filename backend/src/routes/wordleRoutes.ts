import { Router } from "express";
import { fetchWord, updateStats } from "../controllers/wordleController";

/**
 * Route for Wordle
 * GET api/wordle/word - get random word.
 * POST api/wordle/stats - update game's global statistics.
 */
const router = Router();

router.get("/word", fetchWord);
router.post("/stats", updateStats);

export default router;

import { Router } from "express";
import { fetchWord, updateStats } from "../controllers/hangmanController";

/**
 * Route for Hangman
 * GET api/hangman/word - get random word.
 * POST api/hangman/stats - update game's global statistics.
 */
const router = Router();

router.get("/word", fetchWord);
router.post("/stats", updateStats);

export default router;

import { Router } from "express";
import { fetchPuzzle, updateStats } from "../controllers/wordsmithController";

/**
 * Route for Wordsmith
 * GET api/wordsmith/puzzle - get random puzzle.
 * POST api/wordsmith/stats - update game's global statistics.
 */
const router = Router();

router.get("/puzzle", fetchPuzzle);
router.post("/stats", updateStats);

export default router;

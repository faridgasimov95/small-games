import { Router } from "express";
import { fetchWord, updateStats } from "../controllers/wordleController";

/**
 * Route for Wordle
 * GET api/account/patch - change user password.
 * POST api/auth/sign-in - delete user account.
 */
const router = Router();

router.get("/word", fetchWord);
router.post("/stats", updateStats);

export default router;

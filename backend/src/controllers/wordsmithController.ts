import { Request, Response } from "express";
import {
  getPuzzleForMode,
  saveGlobalWordsmithStats as saveStats,
} from "../services/wordsmithService";
import {
  getRandom as getPuzzle,
  loadData as loadStats,
  loadJson as loadPuzzles,
  loadJson,
} from "../utils/wordUtils";
import {
  Difficulty,
  GlobalWordsmithStats,
  Mode,
  WordsmithPuzzle,
} from "../types/wordsmith";
import { DAILY_WORDSMITH_PATH } from "../data/wordsmith/constants";

export const fetchPuzzle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const difficulty = req.query.difficulty as Difficulty;
  const mode = req.query.mode as Mode;
  const data = req.body;

  try {
    const puzzles = loadJson<WordsmithPuzzle>("wordsmith", "puzzles.json");

    const puzzle = getPuzzleForMode(
      mode,
      difficulty,
      puzzles,
      DAILY_WORDSMITH_PATH,
      data?.usedPuzzles,
    );

    res.send(puzzle);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const singleStats = req.body;
    const globalStats = loadStats<GlobalWordsmithStats>(
      "../data/wordsmith/wordsmithStats.json",
    );
    saveStats(globalStats, singleStats);
    res.send({ message: "Stats were saved successfully" });
  } catch (e) {
    if (e instanceof Error && e.message.includes("game-mode doesn't exist")) {
      res.status(400).json({ error: e.message });
    } else {
      console.log(e);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const fetchStats = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const fetchEndlessDistribution = async (
  req: Request,
  res: Response,
): Promise<void> => {};

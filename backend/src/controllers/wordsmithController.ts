import { Request, Response } from "express";
import { saveGlobalWordsmithStats as saveStats } from "../services/wordsmithService";
import {
  getRandom as getPuzzle,
  loadStats,
  loadJson as loadPuzzles,
} from "../utils/wordUtils";
import { GlobalWordsmithStats, Puzzle } from "../types/wordsmith";

const puzzlesEasy = loadPuzzles<Puzzle>("wordsmith", "easy.json");
const puzzlesMedium = loadPuzzles<Puzzle>("wordsmith", "medium.json");
const puzzlesHard = loadPuzzles<Puzzle>("wordsmith", "hard.json");

const puzzleLists: Record<string, Puzzle[]> = {
  easy: puzzlesEasy,
  medium: puzzlesMedium,
  hard: puzzlesHard,
};

export const fetchPuzzle = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const difficulty = req.query.difficulty as string;
  try {
    const words = puzzleLists[difficulty];
    if (!words) throw new Error(`Invalid difficulty: ${difficulty}`);
    const puzzle = getPuzzle(words);
    res.send(puzzle);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Invalid difficulty")) {
      res.status(400).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
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

import { Request, Response } from "express";
import { saveGlobalWordleStats as saveStats } from "../services/wordleService";
import {
  loadData,
  loadJson as loadWords,
  calculateEndlessStats,
  getWordForMode,
} from "../utils/wordUtils";
import { Difficulty, GlobalWordleStats, Mode } from "../types/wordle";
import { WORDLE_STATS_PATH } from "../data/wordle/constants";

const wordsEasy = loadWords<string>("wordle", "easy.json");
const wordsMedium = loadWords<string>("wordle", "medium.json");
const wordsHard = loadWords<string>("wordle", "hard.json");

const wordLists: Record<string, string[]> = {
  easy: wordsEasy,
  medium: wordsMedium,
  hard: wordsHard,
};

export const fetchWord = async (req: Request, res: Response): Promise<void> => {
  const difficulty = req.query.difficulty as Difficulty;
  const mode = req.query.mode as Mode;
  const data = req.body;
  const words = wordLists[difficulty];
  try {
    if (!words) throw new Error(`Invalid difficulty: ${difficulty}`);
    const word = getWordForMode(
      mode,
      difficulty,
      words,
      "../data/wordle/dailyWords.json",
      data?.words,
    );
    res.send(word);
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
    const globalStats = loadData<GlobalWordleStats>(WORDLE_STATS_PATH);
    saveStats(globalStats, singleStats);
    res.send({ message: "Stats were saved successfully" });
  } catch (err) {
    if (
      err instanceof Error &&
      err.message.includes("game-mode doesn't exist")
    ) {
      res.status(400).json({ error: err.message });
    } else {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const fetchStats = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const difficulty = req.query.difficulty as Difficulty;
  const mode = req.query.mode as Mode;

  if (mode !== "daily" && mode !== "endless") {
    res.status(400).json({ error: "Given game-mode doesn't exist" });
    return;
  }

  try {
    const todayDate = new Date().toISOString().split("T")[0];
    const globalStats = loadData<GlobalWordleStats>(WORDLE_STATS_PATH);

    if (mode === "daily") {
      const todayStats = globalStats.daily[todayDate];
      if (!todayStats) {
        res.send({ attempts: [0, 0, 0, 0, 0, 0], solved: 0, total: 0 });
        return;
      }
      res.send(todayStats[difficulty]);
    } else {
      const streak = Number(req.query.streak);
      const resultCounts = globalStats.endless[difficulty].resultCounts;
      res.send(calculateEndlessStats(resultCounts, streak));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const fetchEndlessDistribution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const difficulty = req.query.difficulty as Difficulty;
    const globalStats = loadData<GlobalWordleStats>(WORDLE_STATS_PATH);
    const { resultCounts } = globalStats.endless[difficulty];

    res.send({ resultCounts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

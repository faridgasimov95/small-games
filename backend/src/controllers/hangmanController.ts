import { Request, Response } from "express";
import { saveGlobalHangmanStats as saveStats } from "../services/hangmanService";
import {
  calculateEndlessStats,
  getWordForMode,
  loadData,
  loadJson as loadWords,
} from "../utils/wordUtils";
import { Difficulty, GlobalHangmanStats, Mode } from "../types/hangman";

const wordsEasy = loadWords<string>("hangman", "easy.json");
const wordsMedium = loadWords<string>("hangman", "medium.json");
const wordsHard = loadWords<string>("hangman", "hard.json");

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
      "../data/hangman/dailyWords.json",
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
    const globalStats = loadData<GlobalHangmanStats>(
      "../data/hangman/hangmanStats.json",
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
): Promise<void> => {
  try {
    const difficulty = req.query.difficulty as Difficulty;
    const mode = req.query.mode as Mode;
    const todayDate = new Date().toISOString().split("T")[0];

    const globalStats = loadData<GlobalHangmanStats>(
      "../data/hangman/hangmanStats.json",
    );

    if (mode === "daily") {
      const todayStats = globalStats.daily[todayDate];
      if (!todayStats) {
        res.send({ mistakes: [0, 0, 0, 0, 0, 0, 0], solved: 0, total: 0 });
        return;
      }
      const stats = todayStats[difficulty];
      res.send(stats);
    } else if (mode === "endless") {
      const streak = Number(req.query.streak);
      const resultCounts = globalStats.endless[difficulty].resultCounts;
      const stats = calculateEndlessStats(resultCounts, streak);
      res.send(stats);
    }
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

export const fetchEndlessDistribution = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const difficulty = req.query.difficulty as Difficulty;
    const globalStats = loadData<GlobalHangmanStats>(
      "../data/hangman/hangmanStats.json",
    );
    const { resultCounts } = globalStats.endless[difficulty];
    res.send({ resultCounts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

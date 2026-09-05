import { Request, Response } from "express";
import {
  getPuzzleForMode,
  saveGlobalWordsmithStats as saveStats,
} from "../services/wordsmithService";
import {
  loadData as loadStats,
  loadJson,
  loadData,
  calculateEndlessStats,
  writeData,
  isAlreadyKnownWord,
} from "../utils/wordUtils";
import {
  Difficulty,
  GlobalWordsmithStats,
  Mode,
  WordsmithPuzzle,
  WordSuggestion,
} from "../types/wordsmith";
import {
  DAILY_WORDSMITH_PATH,
  WORDSMITH_STATS_PATH,
  WORDSMITH_SUGGESTIONS_PATH,
} from "../data/wordsmith/constants";

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

    const shuffledLetters = [...puzzle.letters].sort(() => Math.random() - 0.5);

    res.send({ ...puzzle, letters: shuffledLetters });
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
    const globalStats = loadStats<GlobalWordsmithStats>(WORDSMITH_STATS_PATH);
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
  const difficulty = req.query.difficulty as Difficulty;
  const mode = req.query.mode as Mode;

  if (mode !== "daily" && mode !== "endless") {
    res.status(400).json({ error: "Given game-mode doesn't exist" });
    return;
  }

  try {
    const todayDate = new Date().toISOString().split("T")[0];
    const globalStats = loadData<GlobalWordsmithStats>(WORDSMITH_STATS_PATH);

    if (mode === "daily") {
      const todayStats = globalStats.daily[todayDate];
      if (!todayStats) {
        res.send({ resultCounts: {}, total: 0, failed: 0 });
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
    const globalStats = loadData<GlobalWordsmithStats>(WORDSMITH_STATS_PATH);
    const { resultCounts } = globalStats.endless[difficulty];

    res.send({ resultCounts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const suggestWord = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { word, letters } = req.body;
  const cleanWord = word?.trim().toLowerCase();

  if (!cleanWord || cleanWord.length < 3) {
    res.status(400).json({ error: "Word must be at least 3 letters long." });
    return;
  }

  try {
    if (isAlreadyKnownWord(cleanWord)) {
      res.status(200).json({ message: "Word is already recognized." });
      return;
    }

    let suggestions: WordSuggestion[] = [];

    try {
      suggestions = loadData<WordSuggestion[]>(WORDSMITH_SUGGESTIONS_PATH);
    } catch {
      suggestions = [];
    }

    const alreadySuggested = suggestions.some((s) => s.word === cleanWord);
    if (alreadySuggested) {
      res.status(200).json({ message: "Word has already been suggested." });
      return;
    }

    suggestions.push({
      word: cleanWord,
      letters,
      createdAt: new Date().toISOString(),
    });

    writeData(WORDSMITH_SUGGESTIONS_PATH, suggestions);

    res.status(200).json({ message: "Suggestion saved successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
};

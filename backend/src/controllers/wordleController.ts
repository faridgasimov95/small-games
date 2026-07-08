import { Request, Response } from "express";
import { saveGlobalWordleStats as saveStats } from "../services/wordleService";
import {
  getRandom as getWord,
  loadData,
  writeData,
  loadJson as loadWords,
  getHistory,
  calculateEndlessStats,
} from "../utils/wordUtils";
import {
  Difficulty,
  GlobalWordleStats,
  DailyWords,
  Mode,
} from "../types/wordle";
import {
  DAILY_HISTORY_LIMIT,
  ENDLESS_HISTORY_LIMIT,
} from "../data/wordle/constants";

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

    if (mode === "daily") {
      const todayDate = new Date().toISOString().split("T")[0];
      const stored = loadData<DailyWords>("../data/wordle/dailyWords.json");
      const base: DailyWords =
        stored.date === todayDate
          ? stored
          : {
              ...stored,
              date: todayDate,
              easy: null,
              medium: null,
              hard: null,
            };

      let word = base[difficulty];

      if (word === null) {
        do {
          word = getWord(words);
        } while (getHistory(base, difficulty).includes(word));

        writeData("../data/wordle/dailyWords.json", {
          ...base,
          [difficulty]: word,
          [difficulty + "History"]: [
            ...getHistory(base, difficulty),
            word,
          ].slice(-DAILY_HISTORY_LIMIT),
        });
      }
      res.send(word);
    } else if (mode === "endless") {
      const recentWords = data.words.slice(-ENDLESS_HISTORY_LIMIT);
      const recentSet = new Set(recentWords);

      let word = getWord(words);
      while (recentSet.has(word)) {
        word = getWord(words);
      }
      res.send(word);
    }
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
    const globalStats = loadData<GlobalWordleStats>(
      "../data/wordle/wordleStats.json",
    );
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
  try {
    const difficulty = req.query.difficulty as Difficulty;
    const mode = req.query.mode as Mode;
    const todayDate = new Date().toISOString().split("T")[0];

    const globalStats = loadData<GlobalWordleStats>(
      "../data/wordle/wordleStats.json",
    );

    if (mode === "daily") {
      const todayStats = globalStats.daily[todayDate];
      if (!todayStats) {
        res.send({ attempts: [0, 0, 0, 0, 0, 0], solved: 0, total: 0 });
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

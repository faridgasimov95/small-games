import { Request, Response } from "express";
import { saveGlobalWordleStats as saveStats } from "../services/wordleService";
import {
  getRandom as getWord,
  loadStats,
  loadJson as loadWords,
} from "../utils/wordUtils";
import { Difficulty, GlobalWordleStats } from "../types/wordle";

const wordsEasy = loadWords<string>("wordle", "easy.json");
const wordsMedium = loadWords<string>("wordle", "medium.json");
const wordsHard = loadWords<string>("wordle", "hard.json");

const wordLists: Record<string, string[]> = {
  easy: wordsEasy,
  medium: wordsMedium,
  hard: wordsHard,
};

type DailyWordCache = {
  date: string;
  word: string;
};

const cachedWords: Record<Difficulty, DailyWordCache | null> = {
  easy: null,
  medium: null,
  hard: null,
};

export const fetchWord = async (req: Request, res: Response): Promise<void> => {
  const difficulty = req.query.difficulty as string;
  const words = wordLists[difficulty];
  try {
    if (!words) throw new Error(`Invalid difficulty: ${difficulty}`);

    if (req.query.mode === "daily") {
      const todayDate = new Date().toISOString().split("T")[0];
      const cached = cachedWords[difficulty as Difficulty];
      if (!cached || cached.date !== todayDate) {
        cachedWords[difficulty as Difficulty] = {
          date: todayDate,
          word: getWord(words),
        };
      }
      res.send(cachedWords[difficulty as Difficulty]!.word);
    } else {
      res.send(getWord(words));
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
    const globalStats = loadStats<GlobalWordleStats>(
      "../data/wordle/wordleStats.json",
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

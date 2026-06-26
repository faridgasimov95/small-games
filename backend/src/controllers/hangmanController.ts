import { Request, Response } from "express";
import { saveGlobalHangmanStats as saveStats } from "../services/hangmanService";
import {
  getRandom as getWord,
  loadData as loadStats,
  loadJson as loadWords,
} from "../utils/wordUtils";
import { GlobalHangmanStats } from "../types/hangman";

const wordsEasy = loadWords<string>("hangman", "easy.json");
const wordsMedium = loadWords<string>("hangman", "medium.json");
const wordsHard = loadWords<string>("hangman", "hard.json");

const wordLists: Record<string, string[]> = {
  easy: wordsEasy,
  medium: wordsMedium,
  hard: wordsHard,
};

export const fetchWord = async (req: Request, res: Response): Promise<void> => {
  const difficulty = req.query.difficulty as string;
  try {
    const words = wordLists[difficulty];
    if (!words) throw new Error(`Invalid difficulty: ${difficulty}`);
    const word = getWord(words);
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
    const globalStats = loadStats<GlobalHangmanStats>(
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

import { Request, Response } from "express";
import { getWord } from "../services/wordleService";

export const fetchWord = async (req: Request, res: Response): Promise<void> => {
  const difficulty = req.query.difficulty as string;
  try {
    const word = getWord(difficulty);
    res.send(word);
  } catch (e) {
    if (e instanceof Error && e.message.includes("Invalid difficulty")) {
      res.status(400).json({ error: e.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export function updateStats() {}

import { Request, Response } from "express";
import { getWord } from "../services/wordleService";

export const fetchWord = async (req: Request, res: Response): Promise<void> => {
  const difficulty = req.query.difficulty as string;
  const word = getWord(difficulty);
  res.send(word);
};

export function updateStats() {}

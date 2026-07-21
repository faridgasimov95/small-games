import { postData } from "@/utils/api";
import { clearStaleDailyCache } from "@/utils/storage";
import type { LoaderFunctionArgs } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

type HangmanLoaderData = {
  hiddenWord: string;
  guessedLetters: string[];
  currentStreak?: number;
  usedWords?: string[];
};

export async function hangmanLoader({
  params,
}: LoaderFunctionArgs): Promise<HangmanLoaderData> {
  if (params.mode === "daily") {
    const today = new Date().toISOString().split("T")[0];
    clearStaleDailyCache(today);
    const storageKey = `hangman-daily-${params.difficulty}-${today}`;
    const savedResult = localStorage.getItem(storageKey);
    if (savedResult) {
      const { guessedLetters, hiddenWord } = JSON.parse(savedResult);
      return { hiddenWord, guessedLetters };
    }
  } else if (params.mode === "endless") {
    const storageKey = `hangman-endless-${params.difficulty}`;
    const savedResult = localStorage.getItem(storageKey);
    if (savedResult) {
      const { guessedLetters, hiddenWord, streak, usedWords } =
        JSON.parse(savedResult);
      return {
        hiddenWord,
        guessedLetters,
        currentStreak: streak,
        usedWords,
      };
    }
  }

  const response = await postData(
    `${API_URL}/hangman/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
    params.mode === "endless" ? { words: [] } : undefined,
  );

  const hiddenWord = await response.text();
  return { hiddenWord, guessedLetters: [] };
}

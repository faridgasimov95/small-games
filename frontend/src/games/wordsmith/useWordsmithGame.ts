import { postData } from "@/utils/api";
import { clearStaleDailyCache } from "@/utils/storage";
import { useEffect, useState } from "react";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { ENDLESS_HISTORY_LIMIT } from "../wordle/constants";
import { TIME_LIMIT_SECONDS, WORD_TARGETS } from "./constants";
import type { WordsmithPuzzle, Difficulty } from "@/types/wordsmith";

const API_URL = import.meta.env.VITE_API_URL;

type WordsmithLoaderData = {
  puzzle: WordsmithPuzzle;
  foundWords: string[];
  currentStreak?: number;
  usedPuzzles?: WordsmithPuzzle[];
};

export async function wordsmithLoader({
  params,
}: LoaderFunctionArgs): Promise<WordsmithLoaderData> {
  if (params.mode === "daily") {
    const today = new Date().toISOString().split("T")[0];
    clearStaleDailyCache(today);
    const storageKey = `wordsmith-daily-${params.difficulty}-${today}`;
    const savedResult = localStorage.getItem(storageKey);
    if (savedResult) {
      const { foundWords, puzzle } = JSON.parse(savedResult);
      return { puzzle, foundWords };
    }
  } else if (params.mode === "endless") {
    const storageKey = `wordsmith-endless-${params.difficulty}`;
    const savedResult = localStorage.getItem(storageKey);
    if (savedResult) {
      const { foundWords, puzzle, streak, usedPuzzles } =
        JSON.parse(savedResult);
      return {
        foundWords,
        puzzle,
        currentStreak: streak,
        usedPuzzles,
      };
    }
  }

  const response = await postData(
    `${API_URL}/wordsmith/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
    params.mode === "endless" ? { usedPuzzles: [] } : undefined,
  );

  const puzzle = await response.json();
  return { puzzle, foundWords: [] };
}

export function useHangmanGame() {
  const params = useParams();
  const difficulty = params.difficulty as Difficulty;

  const { puzzle, foundWords, currentStreak, usedPuzzles } =
    useLoaderData() as WordsmithLoaderData;

  const [currentPuzzle, setCurrentPuzzle] = useState(puzzle);
  const [currentFoundWords, setCurrentFoundWords] = useState(foundWords);
  const [streak, setStreak] = useState(currentStreak ?? 0);
  const [showModal, setShowModal] = useState(false);
  const [currentUsedPuzzles, setCurrentUsedPuzzles] = useState(
    usedPuzzles ?? [],
  );
  const [endlessSolved, setEndlessSolved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [completionTime, setCompletionTime] = useState<number | null>(null);
  const [round, setRound] = useState((currentStreak ?? 0) + 1);

  const target = WORD_TARGETS[difficulty];
  const isSolved = currentFoundWords.length >= target;
  const isTimeUp = timeLeft <= 0;
  const readOnly = isSolved || isTimeUp;

  useEffect(() => {
    if (readOnly) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [readOnly]);

  useEffect(() => {
    if (!readOnly) return;
    if (isSolved && completionTime === null) {
      setCompletionTime(TIME_LIMIT_SECONDS - timeLeft);
    }

    // TODO: mirror hangman's daily/endless stats-saving + localStorage
    // cleanup + setShowModal(true) after a short delay
  }, [readOnly]);

  function handleWordGuess(word: string) {
    if (readOnly) return;
    if (currentFoundWords.includes(word)) return;
    if (!currentPuzzle.words.includes(word)) return; // not a valid word

    setCurrentFoundWords((prev) => [...prev, word]);
  }

  // TODO: handleNext and handlePlayAgain

  return {
    params,
    currentPuzzle,
    currentFoundWords,
    target,
    timeLeft,
    isSolved,
    isTimeUp,
    readOnly,
    endlessSolved,
    showModal,
    streak,
    round,
    completionTime,
    handleWordGuess,
    setShowModal,
  };
}

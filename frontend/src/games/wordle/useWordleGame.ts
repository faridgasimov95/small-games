import { useState } from "react";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { ENDLESS_HISTORY_LIMIT, WORDLE_MAX_ATTEMPTS } from "./constants";
import { postData } from "@/utils/api";
import { cleanStaleDailyCache } from "@/utils/storage";

const API_URL = import.meta.env.VITE_API_URL;

type WordleLoaderData = {
  hiddenWord: string;
  guesses: string[];
  currentStreak?: number;
  usedWords?: string[];
};

export async function wordleLoader({
  params,
}: LoaderFunctionArgs): Promise<WordleLoaderData> {
  if (params.mode === "daily") {
    const today = new Date().toISOString().split("T")[0];
    cleanStaleDailyCache(today);
    const storageKey = `wordle-daily-${params.difficulty}-${today}`;
    const savedResult = localStorage.getItem(storageKey);
    if (savedResult) {
      const { guesses, hiddenWord } = JSON.parse(savedResult);
      return { hiddenWord, guesses: guesses };
    }
  } else if (params.mode === "endless") {
    const storageKey = `wordle-endless-${params.difficulty}`;
    const savedResult = localStorage.getItem(storageKey);
    if (savedResult) {
      const { guesses, hiddenWord, streak, usedWords } =
        JSON.parse(savedResult);
      return { hiddenWord, guesses: guesses, currentStreak: streak, usedWords };
    }
  }

  const response = await postData(
    `${API_URL}/wordle/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
    params.mode === "endless" ? { words: [] } : undefined,
  );

  const hiddenWord = await response.text();
  return { hiddenWord, guesses: [] };
}

export function useWordleGame() {
  const params = useParams();

  const { hiddenWord, guesses, currentStreak, usedWords } =
    useLoaderData() as WordleLoaderData;
  const [currentGuesses, setCurrentGuesses] = useState(guesses);
  const [boardKey, setBoardKey] = useState(0);
  const [currentHiddenWord, setCurrentHiddenWord] = useState(hiddenWord);
  const [streak, setStreak] = useState(currentStreak ?? 0);
  const [showModal, setShowModal] = useState(
    params.mode === "daily" &&
      (guesses.length === WORDLE_MAX_ATTEMPTS ||
        guesses[guesses.length - 1] === hiddenWord),
  );
  const [currentUsedWords, setCurrentUsedWords] = useState(usedWords ?? []);
  const [endlessSolved, setEndlessSolved] = useState(
    currentGuesses[currentGuesses.length - 1] === currentHiddenWord,
  );
  const [round, setRound] = useState((currentStreak ?? 0) + 1);

  const isSolved =
    currentGuesses[currentGuesses.length - 1] === currentHiddenWord;
  const readOnly = currentGuesses.length === WORDLE_MAX_ATTEMPTS || isSolved;

  async function handleGuessSubmit(guesses: string[]) {
    setCurrentGuesses(guesses);
    const solved = guesses[guesses.length - 1] === currentHiddenWord;
    if (params.mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `wordle-daily-${params.difficulty}-${today}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ guesses, hiddenWord: currentHiddenWord }),
      );

      const gameOver = solved || guesses.length === WORDLE_MAX_ATTEMPTS;

      if (gameOver) {
        setTimeout(() => setShowModal(true), 1000);
        try {
          const response = await postData(`${API_URL}/wordle/stats`, {
            mode: "daily",
            difficulty: params.difficulty!,
            solved,
            date: today,
            ...(solved && { attempts: guesses.length }),
          });

          if (!response.ok) {
            console.error("Failed to save stats:", await response.json());
          }
        } catch (err) {
          console.error("Failed to save stats:", err);
        }
      }
    } else if (params.mode === "endless") {
      const storageKey = `wordle-endless-${params.difficulty}`;
      const gameOver = !solved && guesses.length === WORDLE_MAX_ATTEMPTS;

      if (solved) {
        const newUsedWords = [...currentUsedWords, currentHiddenWord].slice(
          -ENDLESS_HISTORY_LIMIT,
        );
        setCurrentUsedWords(newUsedWords);

        setStreak((prev) => {
          const newStreak = prev + 1;
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              guesses,
              hiddenWord: currentHiddenWord,
              streak: newStreak,
              usedWords: newUsedWords,
            }),
          );
          return newStreak;
        });

        setTimeout(() => {
          setEndlessSolved(true);
        }, 1000);
      } else {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            guesses,
            hiddenWord: currentHiddenWord,
            streak,
            usedWords: currentUsedWords,
          }),
        );
      }

      if (gameOver) {
        setTimeout(() => setShowModal(true), 1000);
        try {
          const response = await postData(`${API_URL}/wordle/stats`, {
            mode: "endless",
            difficulty: params.difficulty!,
            streak,
          });

          if (!response.ok) {
            console.error("Failed to save stats:", await response.json());
          } else {
            localStorage.removeItem(`wordle-endless-${params.difficulty}`);
          }
        } catch (err) {
          console.error("Failed to save stats:", err);
        }
      }
    }
  }

  async function handleNext(usedWordsOverride?: string[], nextRound?: number) {
    const wordsToExclude = usedWordsOverride ?? currentUsedWords;
    setEndlessSolved(false);
    const response = await postData(
      `${API_URL}/wordle/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
      params.mode === "endless" ? { words: wordsToExclude } : undefined,
    );
    const newWord = await response.text();
    setCurrentHiddenWord(newWord);
    setCurrentGuesses([]);
    setBoardKey((prev) => prev + 1);
    setRound(nextRound ?? round + 1);
  }

  function handlePlayAgain() {
    setStreak(0);
    setCurrentUsedWords([]);
    setShowModal(false);
    handleNext([], 1);
  }

  return {
    params,
    currentHiddenWord,
    currentGuesses,
    readOnly,
    boardKey,
    endlessSolved,
    showModal,
    streak,
    isSolved,
    round,
    handleGuessSubmit,
    handleNext,
    handlePlayAgain,
    setShowModal,
  };
}

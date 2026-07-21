import { postData } from "@/utils/api";
import { clearStaleDailyCache } from "@/utils/storage";
import { useState } from "react";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";
import { ENDLESS_HISTORY_LIMIT } from "../wordle/constants";
import { MAX_MISTAKES } from "./constants";

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

function isWordSolved(hiddenWord: string, guessedLetters: string[]): boolean {
  return [...hiddenWord].every((letter) => guessedLetters.includes(letter));
}

function countMistakes(hiddenWord: string, guessedLetters: string[]): number {
  return guessedLetters.filter((letter) => !hiddenWord.includes(letter)).length;
}

export function useHangmanGame() {
  const params = useParams();

  const { hiddenWord, guessedLetters, currentStreak, usedWords } =
    useLoaderData() as HangmanLoaderData;

  const [currentGuessedLetters, setCurrentGuessedLetters] =
    useState(guessedLetters);
  const [boardKey, setBoardKey] = useState(0);
  const [currentHiddenWord, setCurrentHiddenWord] = useState(hiddenWord);
  const [streak, setStreak] = useState(currentStreak ?? 0);
  const [showModal, setShowModal] = useState(
    params.mode === "daily" &&
      (isWordSolved(hiddenWord, guessedLetters) ||
        countMistakes(hiddenWord, guessedLetters) >= MAX_MISTAKES),
  );
  const [currentUsedWords, setCurrentUsedWords] = useState(usedWords ?? []);
  const [endlessSolved, setEndlessSolved] = useState(
    isWordSolved(hiddenWord, guessedLetters),
  );
  const [round, setRound] = useState((currentStreak ?? 0) + 1);

  const mistakes = countMistakes(currentHiddenWord, currentGuessedLetters);
  const isSolved = isWordSolved(currentHiddenWord, currentGuessedLetters);
  const isLost = mistakes >= MAX_MISTAKES;
  const readOnly = isSolved || isLost;

  async function handleLetterGuess(letter: string) {
    if (readOnly || currentGuessedLetters.includes(letter)) return;

    const newGuessedLetters = [...currentGuessedLetters, letter];
    setCurrentGuessedLetters(newGuessedLetters);

    const solved = isWordSolved(currentHiddenWord, newGuessedLetters);
    const newMistakes = countMistakes(currentHiddenWord, newGuessedLetters);
    const lost = newMistakes >= MAX_MISTAKES;

    if (params.mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `hangman-daily-${params.difficulty}-${today}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          guessedLetters: newGuessedLetters,
          hiddenWord: currentHiddenWord,
        }),
      );

      const gameOver = solved || lost;

      if (gameOver) {
        setTimeout(() => setShowModal(true), 1000);
        try {
          const response = await postData(`${API_URL}/hangman/stats`, {
            mode: "daily",
            difficulty: params.difficulty!,
            solved,
            date: today,
            mistakes: newMistakes,
          });

          if (!response.ok) {
            console.error("Failed to save stats:", await response.json());
          }
        } catch (err) {
          console.error("Failed to save stats:", err);
        }
      }
    } else if (params.mode === "endless") {
      const storageKey = `hangman-endless-${params.difficulty}`;
      const gameOver = !solved && lost;

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
              guessedLetters: newGuessedLetters,
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
            guessedLetters: newGuessedLetters,
            hiddenWord: currentHiddenWord,
            streak,
            usedWords: currentUsedWords,
          }),
        );
      }

      if (gameOver) {
        setTimeout(() => setShowModal(true), 1000);
        try {
          const response = await postData(`${API_URL}/hangman/stats`, {
            mode: "endless",
            difficulty: params.difficulty!,
            streak,
          });

          if (!response.ok) {
            console.error("Failed to save stats:", await response.json());
          } else {
            localStorage.removeItem(`hangman-endless-${params.difficulty}`);
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
      `${API_URL}/hangman/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
      params.mode === "endless" ? { words: wordsToExclude } : undefined,
    );
    const newWord = await response.text();
    setCurrentHiddenWord(newWord);
    setCurrentGuessedLetters([]);
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
    currentGuessedLetters,
    readOnly,
    boardKey,
    endlessSolved,
    showModal,
    streak,
    isSolved,
    round,
    handleLetterGuess,
    handleNext,
    handlePlayAgain,
    setShowModal,
  };
}

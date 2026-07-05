import {
  ENDLESS_HISTORY_LIMIT,
  WORDLE_MAX_ATTEMPTS,
} from "@/games/wordle/constants";
import DefinitionButton from "@/games/wordle/DefinitionButton";
import WordleBoard from "@/games/wordle/WordleBoard";
import WordleResultModal from "@/games/wordle/WordleResultModal";
import { useState } from "react";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";
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

  const response = await fetch(
    `${API_URL}/wordle/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      ...(params.mode === "endless"
        ? { body: JSON.stringify({ words: [] }) }
        : {}),
    },
  );
  const hiddenWord = await response.text();
  return { hiddenWord, guesses: [] };
}

export default function WordlePage() {
  const params = useParams();
  const { hiddenWord, guesses, currentStreak, usedWords } =
    useLoaderData() as WordleLoaderData;
  const [currentGuesses, setCurrentGuesses] = useState(guesses);
  const [boardKey, setBoardKey] = useState(0);
  const [currentHiddenWord, setCurrentHiddenWord] = useState(hiddenWord);
  const readOnly =
    currentGuesses.length === WORDLE_MAX_ATTEMPTS ||
    currentGuesses[currentGuesses.length - 1] === currentHiddenWord;
  const [streak, setStreak] = useState(currentStreak ?? 0);
  const [endlessSolved, setEndlessSolved] = useState(
    currentGuesses[currentGuesses.length - 1] === currentHiddenWord,
  );
  const [showModal, setShowModal] = useState(false);
  const [currentUsedWords, setCurrentUsedWords] = useState(usedWords ?? []);

  async function handleGuessSubmit(guesses: string[]) {
    setCurrentGuesses(guesses);
    if (params.mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `wordle-daily-${params.difficulty}-${today}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ guesses, hiddenWord: currentHiddenWord }),
      );

      const solved = guesses[guesses.length - 1] === currentHiddenWord;
      const gameOver = solved || guesses.length === WORDLE_MAX_ATTEMPTS;

      if (gameOver) {
        setTimeout(() => setShowModal(true), 1000);
        try {
          const response = await fetch(`${API_URL}/wordle/stats`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mode: "daily",
              difficulty: params.difficulty,
              solved,
              date: today,
              ...(solved && { attempts: guesses.length }),
            }),
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
      const solved = guesses[guesses.length - 1] === currentHiddenWord;
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
          const response = await fetch(`${API_URL}/wordle/stats`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mode: "endless",
              difficulty: params.difficulty,
              streak,
            }),
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

  async function handleNext(usedWordsOverride?: string[]) {
    const wordsToExclude = usedWordsOverride ?? currentUsedWords;
    setEndlessSolved(false);
    const response = await fetch(
      `${API_URL}/wordle/word?difficulty=${params.difficulty?.toLowerCase()}&mode=${params.mode?.toLowerCase()}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...(params.mode === "endless"
          ? { body: JSON.stringify({ words: wordsToExclude }) }
          : {}),
      },
    );
    const newWord = await response.text();
    setCurrentHiddenWord(newWord);
    setCurrentGuesses([]);
    setBoardKey((prev) => prev + 1);
  }

  function handlePlayAgain() {
    setStreak(0);
    setCurrentUsedWords([]);
    setShowModal(false);
    handleNext([]);
  }

  return (
    <>
      <div className="flex flex-col gap-2 min-h-screen items-center pt-10">
        <div className="flex flex-col items-center">
          <h2 className="font-mono text-text/50">
            {params.mode?.toUpperCase()} MODE
          </h2>
          <h1 className="flex justify-center gap-2">
            <span className="font-pixel text-accent text-xl">WORDLE</span>
            <span className="bg-accent px-2 py-0.5 rounded-xl text-sm text-bg ">
              {params.difficulty?.toUpperCase()}
            </span>
          </h1>
        </div>
        <WordleBoard
          hiddenWord={currentHiddenWord}
          initialGuesses={currentGuesses}
          readOnly={readOnly}
          onGuessSubmit={handleGuessSubmit}
          key={boardKey}
        />
        {params.mode === "endless" && endlessSolved && (
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-accent text-bg font-pixel transition-opacity cursor-pointer"
              onClick={() => handleNext()}
            >
              Next
            </button>
            <DefinitionButton word={currentHiddenWord} font="font-pixel" />
          </div>
        )}
      </div>
      {showModal && (
        <WordleResultModal
          mode={params.mode!}
          difficulty={params.difficulty!}
          solved={
            currentGuesses[currentGuesses.length - 1] === currentHiddenWord
          }
          hiddenWord={currentHiddenWord}
          attempts={currentGuesses.length}
          streak={streak}
          onClose={() => setShowModal(false)}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}

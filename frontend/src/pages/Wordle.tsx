import WordleBoard from "@/games/wordle/WordleBoard";
import { useState } from "react";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";

type WordleLoaderData = {
  hiddenWord: string;
  guesses: string[];
  currentStreak?: number;
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
      const { guesses, hiddenWord, streak } = JSON.parse(savedResult);
      return { hiddenWord, guesses: guesses, currentStreak: streak };
    }
  }

  const response = await fetch(
    `http://localhost:3000/wordle/word?difficulty=${params.difficulty?.toLowerCase()}`,
  );
  const hiddenWord = await response.text();
  return { hiddenWord, guesses: [] };
}

export default function WordlePage() {
  const params = useParams();
  const { hiddenWord, guesses, currentStreak } =
    useLoaderData() as WordleLoaderData;
  const [currentGuesses, setCurrentGuesses] = useState(guesses);
  const [boardKey, setBoardKey] = useState(0);
  const [currentHiddenWord, setCurrentHiddenWord] = useState(hiddenWord);
  const readOnly =
    currentGuesses.length === 6 ||
    currentGuesses[currentGuesses.length - 1] === currentHiddenWord;
  const [streak, setStreak] = useState(currentStreak ?? 0);
  const [endlessSolved, setEndlessSolved] = useState(
    currentGuesses[currentGuesses.length - 1] === currentHiddenWord,
  );

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
      const gameOver = solved || guesses.length === 6;

      if (gameOver) {
        try {
          const response = await fetch("http://localhost:3000/wordle/stats", {
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
      const gameOver = !solved && guesses.length === 6;

      if (solved) {
        setStreak((prev) => {
          const newStreak = prev + 1;
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              guesses,
              hiddenWord: currentHiddenWord,
              streak: newStreak,
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
          JSON.stringify({ guesses, hiddenWord: currentHiddenWord, streak }),
        );
      }

      if (gameOver) {
        try {
          const response = await fetch("http://localhost:3000/wordle/stats", {
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

  async function handleNext() {
    setEndlessSolved(false);
    const response = await fetch(
      `http://localhost:3000/wordle/word?difficulty=${params.difficulty?.toLowerCase()}`,
    );
    const newWord = await response.text();
    setCurrentHiddenWord(newWord);
    setCurrentGuesses([]);
    setBoardKey((prev) => prev + 1);
  }

  console.log(boardKey);

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center pt-10">
      <h1>
        Wordle - {params.mode} - {params.difficulty}
      </h1>
      <WordleBoard
        hiddenWord={currentHiddenWord}
        initialGuesses={currentGuesses}
        readOnly={readOnly}
        onGuessSubmit={handleGuessSubmit}
        key={boardKey}
      />
      {endlessSolved && (
        <button
          className="px-4 py-2 bg-accent text-bg font-pixel transition-opacity"
          onClick={handleNext}
        >
          Next
        </button>
      )}
    </div>
  );
}

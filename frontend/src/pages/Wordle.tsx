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
  }

  const response = await fetch(
    `http://localhost:3000/wordle/word?difficulty=${params.difficulty?.toLowerCase()}`,
  );
  const hiddenWord = await response.text();
  return { hiddenWord, guesses: [] };
}

export default function WordlePage() {
  const params = useParams();
  const { hiddenWord, guesses } = useLoaderData() as WordleLoaderData;
  const [currentGuesses, setCurrentGuesses] = useState(guesses);
  const readOnly =
    currentGuesses.length === 6 ||
    currentGuesses[currentGuesses.length - 1] === hiddenWord;

  function handleGuessSubmit(guesses: string[]) {
    setCurrentGuesses(guesses);
    if (params.mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `wordle-daily-${params.difficulty}-${today}`;
      localStorage.setItem(storageKey, JSON.stringify({ guesses, hiddenWord }));
    }
  }

  return (
    <div className="flex flex-col gap-2 min-h-screen items-center pt-10">
      <h1>
        Wordle - {params.mode} - {params.difficulty}
      </h1>
      <WordleBoard
        hiddenWord={hiddenWord}
        initialGuesses={guesses}
        readOnly={readOnly}
        onGuessSubmit={handleGuessSubmit}
      />
    </div>
  );
}

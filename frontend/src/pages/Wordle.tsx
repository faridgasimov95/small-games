import WordleBoard from "@/games/wordle/WordleBoard";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";

type WordleLoaderData = {
  hiddenWord: string;
  guesses: string[] | null;
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
      return { hiddenWord, guesses };
    }
  }

  const response = await fetch(
    `http://localhost:3000/wordle/word?difficulty=${params.difficulty?.toLowerCase()}`,
  );
  const hiddenWord = await response.text();
  return { hiddenWord, guesses: null };
}

export default function WordlePage() {
  const params = useParams();
  const { hiddenWord, guesses } = useLoaderData() as WordleLoaderData;

  function handleGameEnd(guesses: string[]) {
    if (params.mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      const storageKey = `wordle-daily-${params.difficulty}-${today}`;
      localStorage.setItem(storageKey, JSON.stringify({ guesses, hiddenWord }));
    }
  }

  return (
    <WordleBoard
      hiddenWord={hiddenWord}
      initialGuesses={guesses ?? []}
      readOnly={!!guesses}
      onGameEnd={handleGameEnd}
    />
  );
}

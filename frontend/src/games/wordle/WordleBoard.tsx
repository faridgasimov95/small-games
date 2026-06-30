import { useEffect, useState } from "react";
import WordleRow from "./WordleRow";
import { WORDLE_MAX_ATTEMPTS } from "./constants";

type WordleBoardProps = {
  hiddenWord: string;
  initialGuesses: string[];
  readOnly: boolean;
  onGuessSubmit: (guesses: string[]) => void;
};

export default function WordleBoard({
  hiddenWord,
  initialGuesses,
  readOnly,
  onGuessSubmit,
}: WordleBoardProps) {
  const wordLength = hiddenWord.length;
  const [guesses, setGuesses] = useState<string[]>(initialGuesses);
  const [currentGuess, setCurrentGuess] = useState("");
  const [shakingRow, setShakingRow] = useState<number | null>(null);

  useEffect(() => {
    if (readOnly) return;

    async function handleKeyDown(e: KeyboardEvent) {
      if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + e.key.toLowerCase());
      } else if (e.key === "Backspace" && currentGuess.length > 0) {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter" && currentGuess.length === wordLength) {
        try {
          const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${currentGuess}`,
          );
          if (!response.ok) {
            setShakingRow(guesses.length);
            setTimeout(() => setShakingRow(null), 1000);
            return;
          }
        } catch (err) {
          console.error(err);
          return;
        }

        setGuesses((prev) => [...prev, currentGuess]);
        setCurrentGuess("");
        onGuessSubmit([...guesses, currentGuess]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, wordLength, readOnly]);

  return (
    <div className="flex flex-col gap-2 bg-surface border-2 border-accent p-4">
      {Array.from({ length: WORDLE_MAX_ATTEMPTS }, (_, i) => i).map(
        (attempt) => (
          <WordleRow
            key={attempt}
            guessedWord={
              guesses[attempt] ??
              (attempt === guesses.length ? currentGuess : "")
            }
            {...(guesses[attempt]
              ? { isSubmitted: true, hiddenWord }
              : { isSubmitted: false })}
            isShaking={attempt === shakingRow}
            wordLength={wordLength}
          />
        ),
      )}
    </div>
  );
}

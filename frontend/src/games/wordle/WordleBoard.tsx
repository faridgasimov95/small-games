import { useEffect, useState } from "react";
import WordleRow from "./WordleRow";

type WordleBoardProps = {
  hiddenWord: string;
  onGameEnd: (won: boolean) => void;
};

export default function WordleBoard({
  hiddenWord,
  onGameEnd,
}: WordleBoardProps) {
  const wordLength = hiddenWord.length;
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [shakingRow, setShakingRow] = useState<number | null>(null);

  useEffect(() => {
    async function handleKeyDown(e: KeyboardEvent) {
      if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < wordLength) {
        setCurrentGuess((prev) => prev + e.key.toUpperCase());
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
        if (currentGuess === hiddenWord) {
          onGameEnd(true);
        } else if (guesses.length + 1 >= 6) {
          onGameEnd(false);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentGuess, wordLength]);

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 6 }, (_, i) => i).map((attempt) => (
        <WordleRow
          key={attempt}
          guessedWord={
            guesses[attempt] ?? (attempt === guesses.length ? currentGuess : "")
          }
          {...(guesses[attempt]
            ? { isSubmitted: true, hiddenWord }
            : { isSubmitted: false })}
          isShaking={attempt === shakingRow}
          wordLength={wordLength}
        />
      ))}
    </div>
  );
}

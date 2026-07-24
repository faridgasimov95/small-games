import { useEffect } from "react";

type HangmanKeyboardProps = {
  guessedLetters: string[];
  hiddenWord: string;
  readOnly: boolean;
  onGuess: (letter: string) => void;
};

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export default function HangmanKeyboard({
  guessedLetters,
  hiddenWord,
  readOnly,
  onGuess,
}: HangmanKeyboardProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const letter = e.key.toLocaleLowerCase();
      if (
        readOnly ||
        !/^[a-z]$/.test(letter) ||
        guessedLetters.includes(letter)
      ) {
        return;
      }

      onGuess(letter);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div>
      {ROWS.map((row, i) => (
        <div key={i} className="flex gap-1">
          {[...row].map((letter) => {
            const guessed = guessedLetters.includes(letter);
            const correct = guessed && hiddenWord.includes(letter);

            return (
              <button
                key={letter}
                onClick={() => onGuess(letter)}
                disabled={readOnly || guessed}
                className={`w-8 h-10 text-sm uppercase rounded-sm transition-colors ${
                  guessed
                    ? correct
                      ? "bg-accent text-bg"
                      : "bg-surface-hover text-text/30"
                    : "bg-surface-card text-text hover:bg-accent hover:text-bg"
                } disabled:cursor-not-allowed`}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

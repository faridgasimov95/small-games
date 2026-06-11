import WordleTile, { type LetterStatus } from "./WordleTile";

type WordleRowProps =
  | {
      guessedWord: string;
      isSubmitted: true;
      hiddenWord: string;
      isShaking: boolean;
    }
  | {
      guessedWord: string;
      isSubmitted: false;
      hiddenWord?: never;
      isShaking: boolean;
    };

function defineStatus(
  hiddenWord: string,
  letter: string,
  index: number,
): LetterStatus {
  if (letter === hiddenWord[index]) return "correct";
  if (hiddenWord.includes(letter)) return "present";
  return "absent";
}

export default function WordleRow({
  guessedWord,
  hiddenWord,
  isSubmitted,
  isShaking,
}: WordleRowProps) {
  return (
    <div className={`flex gap-2 ${isShaking ? "animate-shake" : ""}`}>
      {guessedWord.split("").map((letter, i) => (
        <WordleTile
          key={i}
          letter={letter}
          status={isSubmitted ? defineStatus(hiddenWord, letter, i) : null}
          revealDelay={i * 100}
        ></WordleTile>
      ))}
    </div>
  );
}

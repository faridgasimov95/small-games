import WordleTile, { type LetterStatus } from "./WordleTile";

type WordleRowProps =
  | {
      guessedWord: string;
      isSubmitted: true;
      hiddenWord: string;
      isShaking: boolean;
      wordLength: number;
    }
  | {
      guessedWord: string;
      isSubmitted: false;
      hiddenWord?: never;
      isShaking: boolean;
      wordLength: number;
    };

function getStatuses(guessedWord: string, hiddenWord: string): LetterStatus[] {
  const len = guessedWord.length;
  const statuses: LetterStatus[] = new Array(len).fill("absent");

  const guess = guessedWord.toLowerCase().split("");
  const hidden = hiddenWord.toLowerCase().split("");

  for (let i = 0; i < len; i++) {
    if (guess[i].toLowerCase() === hidden[i]) {
      statuses[i] = "correct";
      hidden[i] = "";
      guess[i] = "";
    }
  }

  for (let i = 0; i < len; i++) {
    if (guess[i] === "") continue;

    const targetIndex = hidden.indexOf(guess[i]);
    if (targetIndex !== -1) {
      statuses[i] = "present";
      hidden[targetIndex] = "";
    } else {
      statuses[i] = "absent";
    }
  }
  return statuses;
}

export default function WordleRow({
  guessedWord,
  hiddenWord,
  isSubmitted,
  isShaking,
  wordLength,
}: WordleRowProps) {
  const statuses = isSubmitted ? getStatuses(guessedWord, hiddenWord) : [];

  return (
    <div className={`flex gap-1 ${isShaking ? "animate-shake" : ""}`}>
      {Array.from({ length: wordLength }, (_, i) => guessedWord[i] ?? "").map(
        (letter, i) => (
          <WordleTile
            key={i}
            letter={letter}
            status={isSubmitted ? statuses[i] : null}
            revealDelay={i * 100}
          ></WordleTile>
        ),
      )}
    </div>
  );
}

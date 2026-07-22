type HangmanWordProps = {
  hiddenWord: string;
  guessedLetters: string[];
};

export default function HangmanWord({
  hiddenWord,
  guessedLetters,
}: HangmanWordProps) {
  return (
    <div className="flex gap-2 font-mono text-2xl tracking-widest text-text">
      {[...hiddenWord].map((letter, i) => (
        <span key={i} className="w-6 text-center border-b-2 border-divider">
          {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
        </span>
      ))}
    </div>
  );
}

import WordsmithLetterTile from "./WordsmithLetterTile";

type WordsmithLettersBoardProps = {
  letters: string[];
  onLetterClick?: (letter: string) => void;
  disabled: boolean;
};

export default function WordsmithLettersBoard({
  letters,
  onLetterClick,
  disabled,
}: WordsmithLettersBoardProps) {
  const radius = 80;
  const center = radius + 24;

  return (
    <div className="relative" style={{ width: center * 2, height: center * 2 }}>
      {letters.map((letter, i) => {
        const angle = (i / letters.length) * 2 * Math.PI;
        const x = radius * (Math.cos(angle) + 1);
        const y = radius * (Math.sin(angle) + 1);

        return (
          <div key={i} className="absolute" style={{ left: x, top: y }}>
            <WordsmithLetterTile
              letter={letter}
              onClick={() => onLetterClick?.(letter)}
              disabled={disabled}
            />
          </div>
        );
      })}
    </div>
  );
}

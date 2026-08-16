import WordsmithLetterTile from "./WordsmithLetterTile";

type WordsmithLettersBoardProps = {
  letters: string[];
};

export default function WordsmithLettersBoard({
  letters,
}: WordsmithLettersBoardProps) {
  const radius = 70;
  const center = radius + 24;

  return (
    <div className="relative" style={{ width: center * 2, height: center * 2 }}>
      {letters.map((letter, i) => {
        const angle = (i / letters.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - 24;
        const y = center + radius * Math.sin(angle) - 24;

        return (
          <div key={i} className="absolute" style={{ left: x, top: y }}>
            <WordsmithLetterTile letter={letter} />
          </div>
        );
      })}
    </div>
  );
}

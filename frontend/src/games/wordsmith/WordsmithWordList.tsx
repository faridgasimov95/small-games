type WordsmithWordListProps = {
  foundWords: string[];
  target: number;
};

export default function WordsmithWordList({
  foundWords,
  target,
}: WordsmithWordListProps) {
  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="font-mono text-text/70 text-sm">
        {foundWords.length} / {target} words found
      </p>
      <div className="flex flex-wrap gap-2 justify-center max-w-md">
        {foundWords.map((word) => (
          <span
            key={word}
            className="px-2 py-0.5 rounded-xl bg-surface-card font-mono text-xs text-text"
          >
            {word.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}

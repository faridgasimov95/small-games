type WordsmithWordListProps = {
  foundWords: string[];
  target: number;
};

export default function WordsmithWordList({
  foundWords,
  target,
}: WordsmithWordListProps) {
  return (
    <div>
      {foundWords.length} / {target} words found
    </div>
  );
}

type WordsmithTileProps = {
  letter: string;
};

export default function WordsmithLetterTile({ letter }: WordsmithTileProps) {
  return (
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-card font-pixel text-accent text-lg">
      {letter.toUpperCase()}
    </div>
  );
}

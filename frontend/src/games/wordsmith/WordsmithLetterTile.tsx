type WordsmithTileProps = {
  letter: string;
};

export default function WordsmithLetterTile({ letter }: WordsmithTileProps) {
  return <div className="tile">{letter}</div>;
}

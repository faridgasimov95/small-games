import DefinitionButton from "@/components/DefinitionButton";

type EndlessNextControlsProps = {
  word?: string;
  game: string;
  onNext: () => void;
  font?: string;
};

export default function EndlessNextControls({
  word,
  game,
  onNext,
  font = "font-mono",
}: EndlessNextControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        className={`px-4 py-2 bg-accent text-bg ${font} transition-opacity cursor-pointer`}
        onClick={onNext}
      >
        Next
      </button>
      {word && <DefinitionButton word={word} game={game} font={font} />}
    </div>
  );
}

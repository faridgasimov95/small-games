import DefinitionButton from "@/games/wordle/DefinitionButton";

type EndlessNextControlsProps = {
  word: string;
  onNext: () => void;
  font?: string;
};

export default function EndlessNextControls({
  word,
  onNext,
  font = "font-mono",
}: EndlessNextControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        className={`px-4 py-2 bg-accent text-bg ${font} transition-opacity cursor-pointer`}
        onClick={onNext}
        style={{ transitionProperty: "opacity" }}
      >
        Next
      </button>
      <DefinitionButton word={word} font={font} />
    </div>
  );
}

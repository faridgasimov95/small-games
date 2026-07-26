import { useState } from "react";
import WordDefinitionModal from "./WordDefinitionModal";

type DefinitionButtonProps = {
  word: string;
  game: string;
  font: string;
  compact?: boolean;
};

export default function DefinitionButton({
  word,
  game,
  font,
  compact = false,
}: DefinitionButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const sizeClasses = compact ? "px-1 py-0.5 text-xs" : "px-2 py-1";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`bg-accent text-bg ${sizeClasses} ${font} cursor-pointer`}
      >
        Definition
      </button>
      {showModal && (
        <WordDefinitionModal
          word={word}
          game={game}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

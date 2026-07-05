import { useState } from "react";
import WordDefinitionModal from "./WordDefinitionModal";

type DefinitionButtonProps = {
  word: string;
  font: string;
};

export default function DefinitionButton({
  word,
  font,
}: DefinitionButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`px-2 py-1 bg-accent text-bg ${font} cursor-pointer`}
      >
        Definition
      </button>
      {showModal && (
        <WordDefinitionModal word={word} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

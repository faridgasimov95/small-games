import Modal from "@/components/Modal";
import type { WordDefinition } from "@/types/shared";
import { useEffect, useState } from "react";
import { fetchDefinition } from "../games/wordle/dictionaryApi";

type WordDefinitionModalProps = {
  word: string;
  game: string;
  onClose: () => void;
};

export default function WordDefinitionModal({
  word,
  game,
  onClose,
}: WordDefinitionModalProps) {
  const [definitions, setDefinitions] = useState<WordDefinition[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storageKey = `${game}-definition-${word}`;
    const cached = localStorage.getItem(storageKey);

    if (cached) {
      setDefinitions(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchDefinition(word).then((result) => {
      setDefinitions(result);
      setIsLoading(false);
      if (result) {
        localStorage.setItem(storageKey, JSON.stringify(result));
      }
    });
  }, [word, game]);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 items-center text-center">
        <h2 className="font-pixel text-accent text-lg">{word.toUpperCase()}</h2>
        {isLoading && (
          <p className="font-mono text-text/70 text-sm">
            Loading definition...
          </p>
        )}
        {!isLoading && (
          <ul className="flex flex-col gap-3">
            {definitions &&
              definitions.map((def, i) => (
                <li key={i} className="flex flex-col gap-1 text-left">
                  <span className="text-accent italic text-sm">
                    {def.partOfSpeech}
                  </span>
                  <p className="text-text">{def.definition}</p>
                </li>
              ))}
          </ul>
        )}
        {!isLoading && !definitions && (
          <p className="font-mono text-text/70 text-sm">
            No definition found for this word.
          </p>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-accent text-bg font-pixel text-sm cursor-pointer"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

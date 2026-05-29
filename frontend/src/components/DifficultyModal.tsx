import type { Difficulty } from "@/types/game";

export default function DifficultyModal({
  difficulties,
  setDifficulty,
  isOpen,
  onClose,
}: {
  difficulties: Difficulty[];
  setDifficulty: (difficulty: Difficulty) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <dialog open={isOpen} onClose={onClose}>
      <ul>
        {difficulties.map((d: Difficulty) => (
          <li key={d}>
            <button onClick={() => setDifficulty(d)}>{d}</button>
          </li>
        ))}
      </ul>
    </dialog>
  );
}

import Modal from "@/components/Modal";

type WordleResultModalProps = {
  mode: string;
  solved: boolean;
  hiddenWord: string;
  attempts?: number;
  streak?: number;
  onClose: () => void;
};

export default function WordleResultModal({
  mode,
  solved,
  hiddenWord,
  attempts,
  streak,
  onClose,
}: WordleResultModalProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 items-center text-center">
        <h2 className="font-pixel text-accent text-lg">
          {solved ? "You won!" : "You lost"}
        </h2>
        <p className="font-mono text-text/70">
          The word was{" "}
          <span className="text-accent font-bold">
            {hiddenWord.toUpperCase()}
          </span>
        </p>
        {mode === "daily" && solved && attempts && (
          <p className="text-text/70">Solved in {attempts}</p>
        )}
        {mode === "endless" && solved && attempts && (
          <p className="text-text/70">Streak: {streak}</p>
        )}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-accent text-bg font-pixel text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

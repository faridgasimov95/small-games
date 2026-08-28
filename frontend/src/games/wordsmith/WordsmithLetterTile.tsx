type WordsmithTileProps = {
  letter: string;
  onClick?: () => void;
  disabled: boolean;
};

export default function WordsmithLetterTile({
  letter,
  onClick,
  disabled,
}: WordsmithTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-surface-card font-pixel text-accent text-lg cursor-pointer hover:bg-surface-card-selected disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface-card"
      disabled={disabled}
    >
      {letter.toUpperCase()}
    </button>
  );
}

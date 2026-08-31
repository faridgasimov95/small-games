type WordsmithWordInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (word: string) => void;
  disabled?: boolean;
  isShaking?: boolean;
};

export default function WordsmithWordInput({
  value,
  onChange,
  onSubmit,
  disabled,
  isShaking,
}: WordsmithWordInputProps) {
  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim().toLowerCase());
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`font-mono bg-surface border border-divider text-text px-3 py-2 rounded ${isShaking ? "animate-shake" : ""}`}
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 bg-accent text-bg font-mono text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Guess
      </button>
    </form>
  );
}

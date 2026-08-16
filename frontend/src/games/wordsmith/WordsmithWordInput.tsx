import React, { useState } from "react";

type WordsmithWordInputProps = {
  onSubmit: (word: string) => void;
  disabled?: boolean;
};

export default function WordsmithWordInput({
  onSubmit,
  disabled,
}: WordsmithWordInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim().toLowerCase());
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        className="font-mono bg-surface border border-divider text-text px-3 py-2 rounded"
        autoFocus
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 bg-accent text-bg font-mono text-sm cursor-pointer disabled:opacity-50"
      >
        Guess
      </button>
    </form>
  );
}

export type LetterStatus = "correct" | "present" | "absent" | null;

type WordleTileProps = {
  letter: string;
  status: LetterStatus;
  revealDelay: number;
};

export default function WordleTile({
  letter,
  status,
  revealDelay,
}: WordleTileProps) {
  const bgColor =
    status === "correct"
      ? "bg-accent"
      : status === "present"
        ? "bg-surface-card"
        : status === "absent"
          ? "bg-surface"
          : "bg-gray-100";
  return (
    <div
      className={`flex justify-center items-center w-16 h-16 border border-divider ${bgColor}`}
    >
      {letter || "_"}
    </div>
  );
}

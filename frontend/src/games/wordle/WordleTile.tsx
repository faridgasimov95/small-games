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
      ? "bg-tile-correct"
      : status === "present"
        ? "bg-tile-present"
        : status === "absent"
          ? "bg-tile-absent"
          : "bg-tile-empty";

  const textColor =
    status === "correct" || status === "present"
      ? "text-tile-text-dark"
      : "text-tile-text-light";

  return (
    <div
      className={`flex justify-center items-center w-16 h-16 border border-divider ${bgColor} ${textColor}`}
    >
      {letter || ""}
    </div>
  );
}

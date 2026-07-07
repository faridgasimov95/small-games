import { useEffect, useState } from "react";
import { TILES_REVEAL_DELAY_BASE } from "./constants";

export type LetterStatus = "correct" | "present" | "absent" | null;

type WordleTileProps = {
  letter: string;
  status: LetterStatus;
  revealDelay: number;
};

const STATUS_STYLES = {
  correct: { bg: "bg-tile-correct", text: "text-tile-text-dark" },
  present: { bg: "bg-tile-present", text: "text-tile-text-dark" },
  absent: { bg: "bg-tile-absent", text: "text-tile-text-light" },
} as const;

export default function WordleTile({
  letter,
  status,
  revealDelay,
}: WordleTileProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!status) {
      setRevealed(false);
      return;
    }

    const timer = setTimeout(() => {
      setRevealed(true);
    }, revealDelay + TILES_REVEAL_DELAY_BASE);

    return () => clearTimeout(timer);
  }, [status, revealDelay]);

  const bgColor =
    revealed && status ? STATUS_STYLES[status].bg : "bg-tile-empty";
  const textColor =
    revealed && status ? STATUS_STYLES[status].text : "text-tile-text-light";

  return (
    <div
      className={`flex justify-center items-center w-16 h-16 border border-divider ${bgColor} ${textColor} ${status ? "animate-flip" : ""}`}
      style={{ "--delay": `${revealDelay}ms` } as React.CSSProperties}
    >
      {letter.toUpperCase() || ""}
    </div>
  );
}

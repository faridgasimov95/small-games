import type { WordsmithPuzzle } from "@/types/wordsmith";

type WordsmithBoardProps = {
  puzzle: WordsmithPuzzle;
};

export default function WordsmithBoard({ puzzle }: WordsmithBoardProps) {
  return (
    <div>
      {puzzle.words}
      {/*TODO: letter tiles from puzzle.letters, word guess input*/}
    </div>
  );
}

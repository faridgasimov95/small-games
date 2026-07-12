import type { Game } from "@/types/game";

const games: Game[] = [
  {
    id: "01",
    name: "wordle",
    difficulties: ["easy", "medium", "hard"],
    modes: ["daily", "endless"],
  },
  {
    id: "02",
    name: "hangman",
    difficulties: ["easy", "medium", "hard"],
    modes: ["daily", "endless"],
  },
  {
    id: "03",
    name: "wordsmith",
    difficulties: ["easy", "medium", "hard"],
    modes: ["daily", "endless"],
  },
];

export default games;

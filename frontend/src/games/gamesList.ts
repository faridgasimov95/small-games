import type { Game } from "@/types/game";

const games: Game[] = [
  {
    id: "01",
    name: "Wordle",
    difficulties: ["easy", "medium", "hard"],
    modes: ["daily", "endless"],
  },
  {
    id: "02",
    name: "Hangman",
    difficulties: ["easy", "medium", "hard"],
    modes: ["daily", "endless"],
  },
  {
    id: "03",
    name: "Wordsmith",
    difficulties: ["easy", "medium", "hard"],
    modes: ["daily", "endless"],
  },
];

export default games;

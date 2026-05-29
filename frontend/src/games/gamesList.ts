import type { Game } from "@/types/game";

const games: Game[] = [
  {
    id: "01",
    name: "wordle",
    difficulties: ["easy", "medium", "hard"],
  },
  {
    id: "02",
    name: "hangman",
    difficulties: ["easy", "medium", "hard"],
  },
  {
    id: "03",
    name: "finder",
    difficulties: ["easy", "medium", "hard"],
  },
];

export default games;

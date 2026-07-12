export type GameName = "wordle" | "hangman" | "wordsmith";
export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "daily" | "endless";

export type Game = {
  id: string;
  name: GameName;
  difficulties: Difficulty[];
  modes: Mode[];
};

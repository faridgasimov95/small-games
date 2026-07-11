export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "daily" | "endless";

export type Game = {
  id: string;
  name: string;
  difficulties: Difficulty[];
  modes: Mode[];
};

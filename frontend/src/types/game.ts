export type Difficulty = "easy" | "medium" | "hard";

export type Game = {
  id: string;
  name: string;
  difficulties: Difficulty[];
};

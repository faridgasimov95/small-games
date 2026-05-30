export type Difficulty = "Easy" | "Medium" | "Hard";

export type Game = {
  id: string;
  name: string;
  difficulties: Difficulty[];
};

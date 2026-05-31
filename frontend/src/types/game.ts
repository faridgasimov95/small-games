export type Difficulty = "Easy" | "Medium" | "Hard";
export type Mode = "Daily" | "Endless";

export type Game = {
  id: string;
  name: string;
  difficulties: Difficulty[];
  modes: Mode[];
};

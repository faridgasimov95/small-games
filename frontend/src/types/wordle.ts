import type { EndlessStats, WordDefinition, EndlessResults } from "./shared";
import type { Difficulty, Mode } from "./game";

export type { EndlessStats, WordDefinition, EndlessResults, Difficulty, Mode };

export type DailyStats = {
  attempts: number[];
  solved: number;
  total: number;
};

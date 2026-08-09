import type { EndlessStats, WordDefinition, EndlessResults } from "./shared";
import type { Difficulty, Mode } from "./game";

export type { EndlessStats, WordDefinition, EndlessResults, Difficulty, Mode };

export type WordsmithPuzzle = {
  letters: string[];
  words: string[];
};

export type DailyStats = {
  resultCounts: EndlessResults;
  total: number;
};

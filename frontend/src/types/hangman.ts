import type { EndlessStats, WordDefinition, EndlessResults } from "./shared";

export type { EndlessStats, WordDefinition, EndlessResults };

export type DailyStats = {
  mistakes: number[];
  solved: number;
  total: number;
};

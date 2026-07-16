import type {
  Difficulty,
  Mode,
  DailyWords,
  EndlessResults,
  EndlessStatsCalculated,
  EndlessStats,
} from "./shared";

export type {
  Difficulty,
  Mode,
  DailyWords,
  EndlessResults,
  EndlessStatsCalculated,
  EndlessStats,
};

export type DailyGameResult = {
  mode: "daily";
  difficulty: Difficulty;
  solved: boolean;
  attempts?: number;
  date: string;
};

export type EndlessGameResult = {
  mode: "endless";
  difficulty: Difficulty;
  streak: number;
};

export type DailyStats = {
  attempts: number[];
  solved: number;
  total: number;
};

export type GlobalWordleStats = {
  daily: {
    [date: string]: {
      easy: DailyStats;
      medium: DailyStats;
      hard: DailyStats;
    };
  };
  endless: {
    easy: EndlessStats;
    medium: EndlessStats;
    hard: EndlessStats;
  };
};

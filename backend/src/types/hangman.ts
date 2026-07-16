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
  mistakes: number;
  date: string;
};

export type EndlessGameResult = {
  mode: "endless";
  difficulty: Difficulty;
  streak: number;
};

export type DailyStats = {
  mistakes: number[];
  solved: number;
  total: number;
};

export type GlobalHangmanStats = {
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

export type Difficulty = "easy" | "medium" | "hard";

export type Mode = "daily" | "endless";

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

export type EndlessStats = {
  resultCounts: EndlessResults;
};

export type EndlessResults = {
  [result: number]: number;
};

export type EndlessStatsCalculated = {
  gamesPlayed: number;
  maxStreak: number;
  percentile: number;
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

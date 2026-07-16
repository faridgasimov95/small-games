export type Difficulty = "easy" | "medium" | "hard";
export type Mode = "daily" | "endless";

export type DailyWords = {
  date: string;
  easy: string | null;
  medium: string | null;
  hard: string | null;
  easyHistory: string[];
  mediumHistory: string[];
  hardHistory: string[];
};

export type EndlessResults = {
  [result: number]: number;
};

export type EndlessStatsCalculated = {
  gamesPlayed: number;
  maxStreak: number;
  percentile: number;
};

export type EndlessStats = {
  resultCounts: EndlessResults;
};

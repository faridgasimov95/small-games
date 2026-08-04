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
  time: number;
  date: string;
};

export type EndlessGameResult = {
  mode: "endless";
  difficulty: Difficulty;
  streak: number;
};

export type DailyStats = {
  top10Times: number[];
  total: number;
};

export type GlobalWordsmithStats = {
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

export type WordsmithPuzzle = {
  letter: string[];
  words: string[];
};

export type DailyWordsmith = {
  date: string;
  easy: WordsmithPuzzle | null;
  medium: WordsmithPuzzle | null;
  hard: WordsmithPuzzle | null;
  easyHistory: WordsmithPuzzle[];
  mediumHistory: WordsmithPuzzle[];
  hardHistory: WordsmithPuzzle[];
};

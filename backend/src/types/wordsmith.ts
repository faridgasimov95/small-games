export type Difficulty = "easy" | "medium" | "hard";

export type Puzzle = {
  letters: string[];
  words: string[];
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

export type EndlessStats = {
  totalStreak: number;
  gamesPlayed: number;
  maxStreak: number;
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

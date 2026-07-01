export type Difficulty = "easy" | "medium" | "hard";

export type Mode = "daily" | "endless";

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

export type EndlessStats = {
  totalStreak: number;
  gamesPlayed: number;
  maxStreak: number;
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

export type DailyWords = {
  date: string;
  easy: string | null;
  medium: string | null;
  hard: string | null;
  easyHistory: string[];
  mediumHistory: string[];
  hardHistory: string[];
};

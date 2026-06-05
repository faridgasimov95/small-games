export type Difficulty = "easy" | "medium" | "hard";

export type DailyGameResult = {
  mode: "daily";
  difficulty: Difficulty;
  solved: boolean;
  attempts: number;
  date: string;
};

export type EndlessGameResult = {
  mode: "endless";
  difficulty: Difficulty;
  streak: number;
};

export type DifficultyStats = {
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
      easy: DifficultyStats;
      medium: DifficultyStats;
      hard: DifficultyStats;
    };
  };
  endless: {
    easy: EndlessStats;
    medium: EndlessStats;
    hard: EndlessStats;
  };
};

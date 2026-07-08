export type DailyStats = {
  attempts: number[];
  solved: number;
  total: number;
};

export type EndlessStats = {
  gamesPlayed: number;
  maxStreak: number;
  percentile: number;
};

export type WordDefinition = {
  partOfSpeech: string;
  definition: string;
};

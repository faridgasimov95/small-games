export type EndlessStats = {
  gamesPlayed: number;
  maxStreak: number;
  percentile: number;
};

export type WordDefinition = {
  partOfSpeech: string;
  definition: string;
};

export type EndlessResults = {
  [result: number]: number;
};

import type { WordsmithPuzzle } from "@/types/wordsmith";

type WordFetchBody = { words: string[] };

type WordleDailyStatsBody = {
  mode: "daily";
  difficulty: string;
  solved: boolean;
  date: string;
  attempts?: number;
};

type HangmanDailyStatsBody = {
  mode: "daily";
  difficulty: string;
  solved: boolean;
  date: string;
  mistakes: number;
};

type WordsmithDailyStatsBody = {
  mode: "daily";
  difficulty: string;
  solved: boolean;
  date: string;
  time: number;
};

type DailyStatsBody =
  | WordleDailyStatsBody
  | HangmanDailyStatsBody
  | WordsmithDailyStatsBody;

type EndlessStatsBody = {
  mode: "endless";
  difficulty: string;
  streak: number;
};

type WordsmithFetchBody = { usedPuzzles: WordsmithPuzzle[] };

type WordsmithSuggestBody = { word: string; letters: string[] };

type PostBody =
  | WordFetchBody
  | DailyStatsBody
  | EndlessStatsBody
  | WordsmithFetchBody
  | WordsmithSuggestBody;

export async function postData(url: string, data?: PostBody) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(data !== undefined && { body: JSON.stringify(data) }),
  });

  return response;
}

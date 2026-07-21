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
type DailyStatsBody = WordleDailyStatsBody | HangmanDailyStatsBody;

type EndlessStatsBody = {
  mode: "endless";
  difficulty: string;
  streak: number;
};

type PostBody = WordFetchBody | DailyStatsBody | EndlessStatsBody;

export async function postData(url: string, data?: PostBody) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(data !== undefined && { body: JSON.stringify(data) }),
  });

  return response;
}

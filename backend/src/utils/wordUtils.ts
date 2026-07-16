import fs from "fs";
import path from "path";
import {
  DAILY_HISTORY_LIMIT,
  ENDLESS_HISTORY_LIMIT,
} from "../data/shared/constants";
import type {
  DailyWords,
  Difficulty,
  Mode,
  EndlessResults,
  EndlessStatsCalculated,
} from "../types/shared";

export const loadJson = <T>(foldername: string, filename: string): T[] => {
  try {
    const data = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `../data/${foldername}/${filename}`),
        "utf-8",
      ),
    );
    if (!data.length) throw new Error(`${filename} is empty`);
    return data;
  } catch (e) {
    throw new Error(`Failed to load ${filename}: ${e}`);
  }
};

export const getRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

export const loadData = <T>(filePath: string): T => {
  try {
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, filePath), "utf-8"),
    );
    if (!Object.keys(data).length) throw new Error(`${filePath} is empty`);
    return data;
  } catch (e) {
    throw new Error(`Failed to load stats: ${e}`);
  }
};

export const writeData = <T>(filePath: string, data: T): void => {
  fs.writeFileSync(
    path.join(__dirname, filePath),
    JSON.stringify(data, null, 2),
    "utf-8",
  );
};

export const updateTopTen = (top: number[], newValue: number) => {
  if (top.length === 0) return [newValue];

  let i = 0;
  while (i < top.length && newValue > top[i]) {
    i++;
  }

  if (i === top.length && top.length === 10) return top;

  const newTop = [...top.slice(0, i), newValue].concat(
    top.slice(i, top.length === 10 ? top.length - 1 : top.length),
  );

  return newTop;
};

export const getHistory = (
  dailyWords: DailyWords,
  difficulty: Difficulty,
): string[] => {
  let words: string[] = [];
  switch (difficulty) {
    case "easy":
      words = dailyWords.easyHistory;
      break;
    case "medium":
      words = dailyWords.mediumHistory;
      break;
    case "hard":
      words = dailyWords.hardHistory;
    default:
      break;
  }

  return words;
};

export function calculateEndlessStats(
  resultCounts: EndlessResults,
  streak: number,
): EndlessStatsCalculated {
  let gamesPlayed = 0;
  let maxStreak = 0;
  let countAtOrBelow = 0;

  for (const key in resultCounts) {
    const value = Number(key);
    gamesPlayed += resultCounts[key];
    if (value > maxStreak) maxStreak = value;
    if (value <= streak) countAtOrBelow += resultCounts[key];
  }

  const percentile = gamesPlayed > 0 ? (countAtOrBelow / gamesPlayed) * 100 : 0;

  return { gamesPlayed, maxStreak, percentile };
}

export function getWordForMode(
  mode: Mode,
  difficulty: Difficulty,
  words: string[],
  dailyWordsPath: string,
  usedWords: string[] = [],
): string {
  if (mode === "daily") {
    const todayDate = new Date().toISOString().split("T")[0];
    const stored = loadData<DailyWords>(dailyWordsPath);
    const base: DailyWords =
      stored.date === todayDate
        ? stored
        : { ...stored, date: todayDate, easy: null, medium: null, hard: null };

    let word = base[difficulty];

    if (word === null) {
      do {
        word = getRandom(words);
      } while (getHistory(base, difficulty).includes(word));

      writeData(dailyWordsPath, {
        ...base,
        [difficulty]: word,
        [difficulty + "History"]: [...getHistory(base, difficulty), word].slice(
          -DAILY_HISTORY_LIMIT,
        ),
      });
    }
    return word;
  }

  const recentSet = new Set(usedWords.slice(-ENDLESS_HISTORY_LIMIT));
  let word = getRandom(words);
  while (recentSet.has(word)) {
    word = getRandom(words);
  }
  return word;
}

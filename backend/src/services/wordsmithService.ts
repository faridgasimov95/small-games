import {
  DailyGameResult,
  DailyWordsmith,
  EndlessGameResult,
  GlobalWordsmithStats,
  WordsmithPuzzle,
} from "../types/wordsmith";
import { getRandom, loadData, writeData } from "../utils/wordUtils";
import { Difficulty, Mode } from "../types/shared";
import {
  DAILY_HISTORY_LIMIT,
  ENDLESS_HISTORY_LIMIT,
  WORDSMITH_STATS_PATH,
} from "../data/wordsmith/constants";

const DAILY_TIME_BUCKETS = [30, 60, 120, 180] as const; // upper bounds; anything above last = overflow

function bucketTime(seconds: number): string {
  for (let i = 0; i < DAILY_TIME_BUCKETS.length; i++) {
    if (seconds < DAILY_TIME_BUCKETS[i])
      return i === 0
        ? `<${DAILY_TIME_BUCKETS[i]}`
        : `${DAILY_TIME_BUCKETS[i - 1]}-${DAILY_TIME_BUCKETS[i]}`;
  }
  return `>${DAILY_TIME_BUCKETS[DAILY_TIME_BUCKETS.length - 1]}`;
}

export const saveGlobalWordsmithStats = (
  globalStats: GlobalWordsmithStats,
  gameStats: DailyGameResult | EndlessGameResult,
) => {
  if (gameStats.mode !== "daily" && gameStats.mode !== "endless") {
    throw new Error("Given game-mode doesn't exist");
  }

  try {
    let newStats: GlobalWordsmithStats;
    if (gameStats.mode === "daily") {
      const existingDay = globalStats.daily[gameStats.date] ?? {
        easy: { resultCounts: {}, total: 0, failed: 0 },
        medium: { resultCounts: {}, total: 0, failed: 0 },
        hard: { resultCounts: {}, total: 0, failed: 0 },
      };

      const bucket = bucketTime(gameStats.time);
      const existingStats = existingDay[gameStats.difficulty];

      const updatedStats = gameStats.solved
        ? {
            ...existingStats,
            resultCounts: {
              ...existingStats.resultCounts,
              [bucket]: (existingStats.resultCounts[bucket] ?? 0) + 1,
            },
            total: existingStats.total + 1,
          }
        : {
            ...existingStats,
            total: existingStats.total + 1,
            failed: existingStats.failed + 1,
          };

      newStats = {
        ...globalStats,
        daily: {
          ...globalStats.daily,
          [gameStats.date]: {
            ...existingDay,
            [gameStats.difficulty]: {
              ...updatedStats,
            },
          },
        },
      };
    } else {
      const { difficulty, streak } = gameStats;
      const existingCounts = globalStats.endless[difficulty].resultCounts;

      newStats = {
        ...globalStats,
        endless: {
          ...globalStats.endless,
          [difficulty]: {
            resultCounts: {
              ...existingCounts,
              [streak]: (existingCounts[streak] ?? 0) + 1,
            },
          },
        },
      };
    }

    writeData(WORDSMITH_STATS_PATH, newStats);
  } catch (e) {
    throw new Error(`Failed to save stats: ${e}`);
  }
};

const getPuzzleKey = (puzzle: WordsmithPuzzle): string =>
  puzzle.letters.join("");

const getHistory = (
  dailyWordsmith: DailyWordsmith,
  difficulty: Difficulty,
): WordsmithPuzzle[] => {
  const historyKey = `${difficulty}History` as keyof DailyWordsmith;
  return (dailyWordsmith[historyKey] as WordsmithPuzzle[]) || [];
};

export function getPuzzleForMode(
  mode: Mode,
  difficulty: Difficulty,
  puzzles: WordsmithPuzzle[],
  dailyWordsmithPath: string,
  usedPuzzles: WordsmithPuzzle[] = [],
): WordsmithPuzzle {
  if (mode === "daily") {
    const todayDate = new Date().toISOString().split("T")[0];

    let stored: DailyWordsmith | null = null;
    try {
      stored = loadData<DailyWordsmith>(dailyWordsmithPath);
    } catch {
      stored = null;
    }

    const base: DailyWordsmith =
      stored?.date === todayDate
        ? stored
        : {
            date: todayDate,
            easy: null,
            medium: null,
            hard: null,
            easyHistory: stored?.easyHistory || [],
            mediumHistory: stored?.mediumHistory || [],
            hardHistory: stored?.hardHistory || [],
          };

    let puzzle = base[difficulty];

    if (!puzzle) {
      const currentHistory = getHistory(base, difficulty);
      const historyKeys = new Set(currentHistory.map(getPuzzleKey));

      let attempts = 0;
      do {
        puzzle = getRandom(puzzles);
        attempts++;
      } while (
        historyKeys.has(getPuzzleKey(puzzle)) &&
        attempts < puzzles.length
      );

      const historyKey = `${difficulty}History` as const;
      const updatedHistory = [...currentHistory, puzzle].slice(
        -DAILY_HISTORY_LIMIT,
      );

      writeData(dailyWordsmithPath, {
        ...base,
        [difficulty]: puzzle,
        [historyKey]: updatedHistory,
      });
    }

    return puzzle;
  }

  const recentKeys = new Set(
    usedPuzzles.slice(-ENDLESS_HISTORY_LIMIT).map(getPuzzleKey),
  );

  let puzzle = getRandom(puzzles);
  let attempts = 0;

  while (recentKeys.has(getPuzzleKey(puzzle)) && attempts < puzzles.length) {
    puzzle = getRandom(puzzles);
    attempts++;
  }

  return puzzle;
}

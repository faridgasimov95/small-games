import fs from "fs";
import path from "path";
import {
  DailyGameResult,
  DailyWordsmith,
  EndlessGameResult,
  GlobalWordsmithStats,
  WordsmithPuzzle,
} from "../types/wordsmith";
import {
  getRandom,
  loadData,
  updateTopTen,
  writeData,
} from "../utils/wordUtils";
import { Difficulty, Mode } from "../types/shared";
import {
  DAILY_HISTORY_LIMIT,
  ENDLESS_HISTORY_LIMIT,
} from "../data/wordsmith/constants";

export const saveGlobalWordsmithStats = (
  globalStats: GlobalWordsmithStats,
  gameStats: DailyGameResult | EndlessGameResult,
) => {
  // try {
  //   let newStats: GlobalWordsmithStats;
  //   if (gameStats.mode === "daily") {
  //     const existingDay = globalStats.daily[gameStats.date] ?? {
  //       easy: { top10Times: [], total: 0 },
  //       medium: { top10Times: [], total: 0 },
  //       hard: { top10Times: [], total: 0 },
  //     };
  //     newStats = {
  //       ...globalStats,
  //       daily: {
  //         ...globalStats.daily,
  //         [gameStats.date]: {
  //           ...existingDay,
  //           [gameStats.difficulty]: {
  //             top10Times: updateTopTen(
  //               [...existingDay[gameStats.difficulty].top10Times],
  //               gameStats.time,
  //             ),
  //             total: existingDay[gameStats.difficulty].total + 1,
  //           },
  //         },
  //       },
  //     };
  //   } else if (gameStats.mode === "endless") {
  //     newStats = {
  //       ...globalStats,
  //       endless: {
  //         ...globalStats.endless,
  //         [gameStats.difficulty]: {
  //           totalStreak:
  //             globalStats.endless[gameStats.difficulty].totalStreak +
  //             gameStats.streak,
  //           gamesPlayed:
  //             globalStats.endless[gameStats.difficulty].gamesPlayed + 1,
  //           maxStreak:
  //             gameStats.streak >
  //             globalStats.endless[gameStats.difficulty].maxStreak
  //               ? gameStats.streak
  //               : globalStats.endless[gameStats.difficulty].maxStreak,
  //         },
  //       },
  //     };
  //   } else {
  //     throw new Error("Given game-mode doesn't exist");
  //   }
  //   fs.writeFileSync(
  //     path.join(__dirname, "../data/wordsmith/wordsmithStats.json"),
  //     JSON.stringify(newStats, null, 2),
  //     "utf-8",
  //   );
  // } catch (e) {
  //   throw new Error(`Failed to save stats: ${e}`);
  // }
};

const getPuzzleKey = (puzzle: WordsmithPuzzle): string =>
  puzzle.letter.join("");

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

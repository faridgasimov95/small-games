import fs from "fs";
import path from "path";
import {
  DailyGameResult,
  EndlessGameResult,
  GlobalHangmanStats,
} from "../types/hangman";
import { HANGMAN_STATS_PATH } from "../data/hangman/constants";

export const saveGlobalHangmanStats = (
  globalStats: GlobalHangmanStats,
  gameStats: DailyGameResult | EndlessGameResult,
) => {
  try {
    let newStats: GlobalHangmanStats;
    if (gameStats.mode === "daily") {
      const existingDay = globalStats.daily[gameStats.date] ?? {
        easy: { mistakes: [0, 0, 0, 0, 0, 0, 0], solved: 0, total: 0 },
        medium: { mistakes: [0, 0, 0, 0, 0, 0, 0], solved: 0, total: 0 },
        hard: { mistakes: [0, 0, 0, 0, 0, 0, 0], solved: 0, total: 0 },
      };
      newStats = {
        ...globalStats,
        daily: {
          ...globalStats.daily,
          [gameStats.date]: {
            ...existingDay,
            [gameStats.difficulty]: {
              mistakes: existingDay[gameStats.difficulty].mistakes.map(
                (count, i) =>
                  i === gameStats.mistakes - 1 ? count + 1 : count,
              ),
              solved:
                existingDay[gameStats.difficulty].solved +
                Number(gameStats.solved),
              total: existingDay[gameStats.difficulty].total + 1,
            },
          },
        },
      };
    } else if (gameStats.mode === "endless") {
      const { difficulty, streak } = gameStats;
      const existingCounts = globalStats.endless[difficulty].resultCounts;

      newStats = {
        ...globalStats,
        endless: {
          ...globalStats.endless,
          [gameStats.difficulty]: {
            resultCounts: {
              ...existingCounts,
              [streak]: (existingCounts[streak] ?? 0) + 1,
            },
          },
        },
      };
    } else {
      throw new Error("Given game-mode doesn't exist");
    }

    fs.writeFileSync(
      path.join(__dirname, HANGMAN_STATS_PATH),
      JSON.stringify(newStats, null, 2),
      "utf-8",
    );
  } catch (e) {
    throw new Error(`Failed to save stats: ${e}`);
  }
};

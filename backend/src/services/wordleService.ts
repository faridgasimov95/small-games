import fs from "fs";
import path from "path";
import {
  DailyGameResult,
  EndlessGameResult,
  GlobalWordleStats,
} from "../types/wordle";

export const saveGlobalWordleStats = (
  globalStats: GlobalWordleStats,
  gameStats: DailyGameResult | EndlessGameResult,
) => {
  try {
    let newStats: GlobalWordleStats;
    if (gameStats.mode === "daily") {
      const existingDay = globalStats.daily[gameStats.date] ?? {
        easy: { attempts: [0, 0, 0, 0, 0, 0], solved: 0, total: 0 },
        medium: { attempts: [0, 0, 0, 0, 0, 0], solved: 0, total: 0 },
        hard: { attempts: [0, 0, 0, 0, 0, 0], solved: 0, total: 0 },
      };

      newStats = {
        ...globalStats,
        daily: {
          ...globalStats.daily,
          [gameStats.date]: {
            ...existingDay,
            [gameStats.difficulty]: {
              attempts: gameStats.solved
                ? existingDay[gameStats.difficulty].attempts.map((count, i) =>
                    i === gameStats.attempts! - 1 ? count + 1 : count,
                  )
                : existingDay[gameStats.difficulty].attempts,
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
          [difficulty]: {
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
      path.join(__dirname, "../data/wordle/wordleStats.json"),
      JSON.stringify(newStats, null, 2),
      "utf-8",
    );
  } catch (e) {
    throw new Error(`Failed to save stats: ${e}`);
  }
};

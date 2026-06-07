import fs from "fs";
import path from "path";
import {
  DailyGameResult,
  EndlessGameResult,
  GlobalWordsmithStats,
} from "../types/wordsmith";
import { updateTopTen } from "../utils/wordUtils";

export const saveGlobalWordsmithStats = (
  globalStats: GlobalWordsmithStats,
  gameStats: DailyGameResult | EndlessGameResult,
) => {
  try {
    let newStats: GlobalWordsmithStats;
    if (gameStats.mode === "daily") {
      const existingDay = globalStats.daily[gameStats.date] ?? {
        easy: { top10Times: [], total: 0 },
        medium: { top10Times: [], total: 0 },
        hard: { top10Times: [], total: 0 },
      };

      newStats = {
        ...globalStats,
        daily: {
          ...globalStats.daily,
          [gameStats.date]: {
            ...existingDay,
            [gameStats.difficulty]: {
              top10Times: updateTopTen(
                [...existingDay[gameStats.difficulty].top10Times],
                gameStats.time,
              ),
              total: existingDay[gameStats.difficulty].total + 1,
            },
          },
        },
      };
    } else if (gameStats.mode === "endless") {
      newStats = {
        ...globalStats,
        endless: {
          ...globalStats.endless,
          [gameStats.difficulty]: {
            totalStreak:
              globalStats.endless[gameStats.difficulty].totalStreak +
              gameStats.streak,
            gamesPlayed:
              globalStats.endless[gameStats.difficulty].gamesPlayed + 1,
            maxStreak:
              gameStats.streak >
              globalStats.endless[gameStats.difficulty].maxStreak
                ? gameStats.streak
                : globalStats.endless[gameStats.difficulty].maxStreak,
          },
        },
      };
    } else {
      throw new Error("Given game-mode doesn't exist");
    }

    fs.writeFileSync(
      path.join(__dirname, "../data/wordsmith/wordsmithStats.json"),
      JSON.stringify(newStats, null, 2),
      "utf-8",
    );
  } catch (e) {
    throw new Error(`Failed to save stats: ${e}`);
  }
};

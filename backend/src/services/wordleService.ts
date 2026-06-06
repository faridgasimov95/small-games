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
              attempts: existingDay[gameStats.difficulty].attempts.map(
                (count, i) =>
                  i === gameStats.attempts - 1 ? count + 1 : count,
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
      path.join(__dirname, "../data/wordle/wordleStats.json"),
      JSON.stringify(newStats, null, 2),
      "utf-8",
    );
  } catch (e) {
    throw new Error(`Failed to save stats: ${e}`);
  }
};

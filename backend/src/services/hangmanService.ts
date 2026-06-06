import fs from "fs";
import path from "path";
import {
  DailyGameResult,
  EndlessGameResult,
  GlobalHangmanStats,
} from "../types/hangman";

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
      path.join(__dirname, "../data/hangman/hangmanStats.json"),
      JSON.stringify(newStats, null, 2),
      "utf-8",
    );
  } catch (e) {
    throw new Error(`Failed to save stats: ${e}`);
  }
};

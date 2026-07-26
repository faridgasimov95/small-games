import DailyStatsView from "@/components/DailyStatsView";
import EndlessDistributionView from "@/games/wordle/EndlessDistributionView";
import { type Difficulty, type GameName, type Mode } from "@/types/game";
import type { EndlessResults } from "@/types/shared";
import type { DailyStats as WordleDailyStats } from "@/types/wordle";
import type { DailyStats as HangmanDailyStats } from "@/types/hangman";
import { useEffect, useState } from "react";
import games from "@/games/gamesList";
import { WORDLE_MAX_ATTEMPTS } from "@/games/wordle/constants";
import { MAX_MISTAKES } from "@/games/hangman/constants";

const API_URL = import.meta.env.VITE_API_URL;
const STATS_SUPPORTED_GAMES: GameName[] = ["wordle", "hangman"];

export default function AllStatsPage() {
  const [gameName, setGameName] = useState<GameName>("wordle");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [mode, setMode] = useState<Mode>("daily");
  const [dailyStats, setDailyStats] = useState<
    WordleDailyStats | HangmanDailyStats | null
  >(null);
  const [resultCounts, setResultCounts] = useState<EndlessResults | null>(null);

  const game = games.find((g) => g.name === gameName)!;
  const statsSupported = STATS_SUPPORTED_GAMES.includes(gameName);

  useEffect(() => {
    if (!statsSupported) return; // TODO: add other games stats fetching

    const fetchData = async () => {
      setDailyStats(null);
      setResultCounts(null);

      if (mode === "daily") {
        const response = await fetch(
          `${API_URL}/${gameName}/stats?difficulty=${difficulty}&mode=daily`,
        );
        setDailyStats(await response.json());
      } else {
        const response = await fetch(
          `${API_URL}/${gameName}/distribution?difficulty=${difficulty}`,
        );

        const data = await response.json();
        setResultCounts(data.resultCounts);
      }
    };

    fetchData();
  }, [gameName, mode, difficulty, statsSupported]);

  return (
    <div className="flex flex-col gap-4 items-center pt-10 min-h-screen">
      <h1 className="font-pixel text-accent text-2xl">STATS</h1>

      <div className="flex gap-2">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setDailyStats(null);
              setResultCounts(null);
              setGameName(g.name);
            }}
            className={`px-3 py-1 font-mono text-sm cursor-pointer ${
              gameName === g.name ? "bg-accent text-bg" : "bg-surface text-text"
            }`}
          >
            {g.name.toUpperCase()}
          </button>
        ))}
      </div>

      {!statsSupported && (
        <p className="font-mono text-text/70 text-sm">
          Stats for this game are coming soon.
        </p>
      )}

      {statsSupported && (
        <>
          <div className="flex gap-2">
            {game.difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1 font-mono text-sm cursor-pointer ${
                  difficulty === d
                    ? "bg-accent text-bg"
                    : "bg-surface text-text"
                }`}
              >
                {d.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {game.modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1 font-mono text-sm cursor-pointer ${
                  mode === m ? "bg-accent text-bg" : "bg-surface text-text"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          {mode === "daily" && dailyStats && (
            <DailyStatsView
              distribution={
                gameName === "hangman"
                  ? (dailyStats as HangmanDailyStats).mistakes
                  : (dailyStats as WordleDailyStats).attempts
              }
              maxRounds={
                gameName === "hangman" ? MAX_MISTAKES : WORDLE_MAX_ATTEMPTS
              }
            />
          )}
          {mode === "endless" && resultCounts && (
            <EndlessDistributionView resultCounts={resultCounts} />
          )}
        </>
      )}
    </div>
  );
}

import DailyStatsView from "@/games/wordle/DailyStatsView";
import EndlessDistributionView from "@/games/wordle/EndlessDistributionView";
import type { Difficulty, Mode } from "@/types/game";
import type { DailyStats, EndlessResults } from "@/types/wordle";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function AllStatsPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [mode, setMode] = useState<Mode>("daily");
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [resultCounts, setResultCounts] = useState<EndlessResults | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "daily") {
        const response = await fetch(
          `${API_URL}/wordle/stats?difficulty=${difficulty}&mode=daily`,
        );
        setDailyStats(await response.json());
      } else {
        const response = await fetch(
          `${API_URL}/wordle/distribution?difficulty=${difficulty}`,
        );

        const data = await response.json();
        setResultCounts(data.resultCounts);
      }
    };

    fetchData();
  }, [mode, difficulty]);

  return (
    <div className="flex flex-col gap-4 items-center pt-10 min-h-screen">
      <h1 className="font-pixel text-accent text-2xl">WORDLE STATS</h1>

      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-3 py-1 font-mono text-sm cursor-pointer ${
              difficulty === d ? "bg-accent text-bg" : "bg-surface text-text"
            }`}
          >
            {d.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        {(["daily", "endless"] as Mode[]).map((m) => (
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

      {mode === "daily" && dailyStats && <DailyStatsView stats={dailyStats} />}
      {mode === "endless" && resultCounts && (
        <EndlessDistributionView resultCounts={resultCounts} />
      )}
    </div>
  );
}

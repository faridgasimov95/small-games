import type {
  DailyStats,
  Difficulty,
  EndlessStats,
  Mode,
} from "@/types/wordsmith";
import { getBucketIndex, toDailyDistribution } from "./utils";
import EndlessStatsView from "@/components/EndlessStatsView";
import DailyStatsView from "@/components/DailyStatsView";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
const API_URL = import.meta.env.VITE_API_URL;

type WorsmithResultModalProps = {
  mode: Mode;
  difficulty: Difficulty;
  solved: boolean;
  foundWordsCount: number;
  target: number;
  streak?: number;
  completionTime: number;
  onClose: () => void;
  onPlayAgain: () => void;
};

export default function WordsmithResultModal({
  mode,
  difficulty,
  solved,
  foundWordsCount,
  target,
  streak,
  completionTime,
  onClose,
  onPlayAgain,
}: WorsmithResultModalProps) {
  const [stats, setStats] = useState<DailyStats | EndlessStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const streakParam = mode === "endless" ? `&streak=${streak}` : "";
      const response = await fetch(
        `${API_URL}/wordsmith/stats?difficulty=${difficulty}&mode=${mode}${streakParam}`,
      );
      const data = await response.json();

      setStats(data);
    };

    fetchStats();
  }, [mode, difficulty, streak]);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 items-center text-center">
        <h2 className="font-pixel text-accent text-lg">
          {solved ? "You won!" : "You lost"}
        </h2>
        <p className="font-mono text-text/70">
          You found{" "}
          <span className="text-accent font-bold">
            {foundWordsCount}/{target}
          </span>
        </p>

        {stats && mode === "daily" && "resultCounts" in stats && (
          <DailyStatsView
            {...toDailyDistribution(stats)}
            barCount={6}
            highlightedBar={solved ? getBucketIndex(completionTime) : 6}
          />
        )}
        {stats && mode === "endless" && "percentile" in stats && (
          <EndlessStatsView stats={stats} currentStreak={streak ?? 0} />
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-bg font-mono text-sm cursor-pointer"
          >
            Close
          </button>
          {mode === "endless" && !solved && (
            <button
              onClick={onPlayAgain}
              className="px-4 py-2 bg-accent text-bg font-mono text-sm cursor-pointer"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

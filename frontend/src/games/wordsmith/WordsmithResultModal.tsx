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
  dailyStats?: DailyStats;
  endlessStats?: EndlessStats;
  streak?: number;
  completionTime: number;
  onClose: () => void;
};

export default function WordsmithResultModal({
  mode,
  difficulty,
  dailyStats,
  endlessStats,
  streak,
  completionTime,
  onClose,
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
      <div>
        {stats && mode === "daily" && "resultCounts" in stats && (
          <DailyStatsView
            {...toDailyDistribution(stats.resultCounts)}
            barCount={5}
            highlightedBar={getBucketIndex(completionTime)}
          />
        )}
        {stats && mode === "endless" && "percentile" in stats && (
          <EndlessStatsView stats={stats} currentStreak={streak ?? 0} />
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}

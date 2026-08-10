import type { DailyStats, EndlessStats } from "@/types/wordsmith";
import { toDailyDistribution } from "./utils";
import EndlessStatsView from "@/components/EndlessStatsView";
import DailyStatsView from "@/components/DailyStatsView";

type WorsmithResultModalProps = {
  mode: "daily" | "endless";
  dailyStats?: DailyStats;
  endlessStats?: EndlessStats;
  currentStreak?: number;
  onClose: () => void;
};

export default function WordsmithResultModal({
  mode,
  dailyStats,
  endlessStats,
  currentStreak,
  onClose,
}: WorsmithResultModalProps) {
  return (
    <div>
      {mode === "daily" && dailyStats && (
        <DailyStatsView
          {...toDailyDistribution(dailyStats.resultCounts)}
          barCount={5}
        />
      )}
      {mode === "endless" && endlessStats && currentStreak !== undefined && (
        <EndlessStatsView stats={endlessStats} currentStreak={currentStreak} />
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

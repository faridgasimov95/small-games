import type { DailyStats } from "@/types/wordle";
import { WORDLE_MAX_ATTEMPTS } from "./constants";

type DailyStatsViewProps = {
  stats: DailyStats;
  attempts?: number;
};

export default function DailyStatsView({
  stats,
  attempts,
}: DailyStatsViewProps) {
  return (
    <div className="w-64">
      {Array.from({ length: WORDLE_MAX_ATTEMPTS }, (_, i) => i).map(
        (attempt) => (
          <div key={attempt} className="flex flex-row gap-1">
            <span>{attempt + 1}</span>
            <span
              className={`h-5 flex justify-end items-center px-1 min-w-4 ${attempt + 1 === attempts ? "bg-accent" : "bg-surface-card"}`}
              style={{
                width: `${(stats.attempts[attempt] / Math.max(...stats.attempts)) * 100}%`,
              }}
            >
              <span
                className={`text-xs ${attempt + 1 === attempts ? "text-bg" : "text-text"}`}
              >
                {stats.attempts[attempt]}
              </span>
            </span>
          </div>
        ),
      )}
    </div>
  );
}

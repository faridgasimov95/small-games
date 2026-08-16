import type { DailyStats } from "@/types/wordsmith";
import { DAILY_BUCKET_LABELS, DAILY_TIME_BOUNDS } from "./constants";

export function toDailyDistribution(stats: DailyStats) {
  return {
    distribution: [
      ...DAILY_BUCKET_LABELS.map((label) => stats.resultCounts[label] ?? 0),
      stats.failed,
    ],
    labels: [...DAILY_BUCKET_LABELS, "Failed"],
  };
}

export function getBucketIndex(seconds: number): number {
  for (let i = 0; i < DAILY_TIME_BOUNDS.length; i++) {
    if (seconds < DAILY_TIME_BOUNDS[i]) return i + 1;
  }
  return DAILY_TIME_BOUNDS.length + 1;
}

import type { EndlessResults } from "@/types/wordsmith";
import { DAILY_BUCKET_LABELS, DAILY_TIME_BOUNDS } from "./constants";

export function toDailyDistribution(resultCounts: EndlessResults) {
  return {
    distribution: DAILY_BUCKET_LABELS.map((label) => resultCounts[label] ?? 0),
    labels: DAILY_BUCKET_LABELS,
  };
}

export function getBucketIndex(seconds: number): number {
  for (let i = 0; i < DAILY_TIME_BOUNDS.length; i++) {
    if (seconds < DAILY_TIME_BOUNDS[i]) return i + 1;
  }
  return DAILY_TIME_BOUNDS.length + 1;
}

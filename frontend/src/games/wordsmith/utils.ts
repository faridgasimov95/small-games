import type { EndlessResults } from "@/types/wordsmith";
import { DAILY_BUCKET_LABELS } from "./constants";

export function toDailyDistribution(resultCounts: EndlessResults) {
  return {
    distribution: DAILY_BUCKET_LABELS.map((label) => resultCounts[label] ?? 0),
    labels: DAILY_BUCKET_LABELS,
  };
}

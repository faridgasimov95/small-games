import type { EndlessResults } from "@/types/shared";
import { ENDLESS_BUCKET_BOUNDARIES } from "@/constants/shared";

type EndlessDistributionViewProps = {
  resultCounts: EndlessResults;
};

function bucketLabel(lower: number, upper: number | null): string {
  if (upper === null) return `${lower}+`;
  return `${lower}-${upper - 1}`;
}

function bucketResults(entries: { streak: number; count: number }[]) {
  return ENDLESS_BUCKET_BOUNDARIES.map((lower, i) => {
    const upper = ENDLESS_BUCKET_BOUNDARIES[i + 1] ?? null;
    const count = entries
      .filter(
        ({ streak }) => streak >= lower && (upper === null || streak < upper),
      )
      .reduce((sum, { count }) => sum + count, 0);

    return { label: bucketLabel(lower, upper), count };
  });
}

export default function EndlessDistributionView({
  resultCounts,
}: EndlessDistributionViewProps) {
  const entries = Object.entries(resultCounts)
    .map(([streak, count]) => ({ streak: Number(streak), count }))
    .sort((a, b) => a.streak - b.streak);

  if (entries.length === 0) {
    return (
      <p className="font-mono text-text/70 text-sm">No games played yet.</p>
    );
  }

  const topResult = entries[entries.length - 1]?.streak ?? 0;
  const buckets = bucketResults(entries);
  const maxBucketCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 font-mono text-sm w-full max-w-md">
        {buckets.map(({ label, count }) => (
          <div key={label} className="flex items-center gap-2 w-64">
            <span className="w-16 text-text/70 text-right">{label}</span>
            <div className="flex-1 bg-surface h-4 rounded-sm overflow-hidden">
              <div
                className="bg-accent h-full"
                style={{ width: `${(count / maxBucketCount) * 100}%` }}
              />
            </div>
            <span className="text-text/50 text-xs w-8">{count}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 items-center">
        <div>🏆 ALL-TIME RECORD</div>
        <div>{topResult}</div>
      </div>
    </div>
  );
}

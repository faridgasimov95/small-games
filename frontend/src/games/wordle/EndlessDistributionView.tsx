import type { EndlessResults } from "@/types/wordle";

type EndlessDistributionViewProps = {
  resultCounts: EndlessResults;
};

export default function EndlessDistributionView({
  resultCounts,
}: EndlessDistributionViewProps) {
  const entries = Object.entries(resultCounts)
    .map(([streak, count]) => ({ streak: Number(streak), count }))
    .sort((a, b) => a.streak - b.streak);

  const maxCount = Math.max(...entries.map((e) => e.count), 1);

  if (entries.length === 0) {
    return (
      <p className="font-mono text-text/70 text-sm">No games played yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-1 font-mono text-sm w-full max-w-md">
      {entries.map(({ streak, count }) => (
        <div key={streak} className="flex items-center gap-2">
          <span className="w-8 text-text/70 text-right">{streak}</span>
          <div className="flex-1 bg-surface h-4 rounded-sm overflow-hidden">
            <div
              className="bg-accent h-full"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
          <span className="text-text/50 text-xs w-8">{count}</span>
        </div>
      ))}
    </div>
  );
}

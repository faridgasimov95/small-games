type DailyStatsViewProps = {
  distribution: number[];
  barCount: number;
  highlightedBar?: number;
  labels?: string[];
};

export default function DailyStatsView({
  distribution,
  barCount,
  highlightedBar,
  labels,
}: DailyStatsViewProps) {
  const maxCount = Math.max(...distribution, 1);

  return (
    <div className="w-64">
      {Array.from({ length: barCount }, (_, i) => i).map((round) => (
        <div key={round} className="flex flex-row gap-1">
          <span>{labels?.[round] ?? round + 1}</span>
          <span
            className={`h-5 flex justify-end items-center px-1 min-w-4 ${round + 1 === highlightedBar ? "bg-accent" : "bg-surface-card"}`}
            style={{
              width: `${(distribution[round] / maxCount) * 100}%`,
            }}
          >
            <span
              className={`text-xs ${round + 1 === highlightedBar ? "text-bg" : "text-text"}`}
            >
              {distribution[round]}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

type DailyStatsViewProps = {
  distribution: number[];
  maxRounds: number;
  highlightRound?: number;
};

export default function DailyStatsView({
  distribution,
  maxRounds,
  highlightRound,
}: DailyStatsViewProps) {
  const maxCount = Math.max(...distribution, 1);

  return (
    <div className="w-64">
      {Array.from({ length: maxRounds }, (_, i) => i).map((round) => (
        <div key={round} className="flex flex-row gap-1">
          <span>{round + 1}</span>
          <span
            className={`h-5 flex justify-end items-center px-1 min-w-4 ${round + 1 === highlightRound ? "bg-accent" : "bg-surface-card"}`}
            style={{
              width: `${(distribution[round] / maxCount) * 100}%`,
            }}
          >
            <span
              className={`text-xs ${round + 1 === highlightRound ? "text-bg" : "text-text"}`}
            >
              {distribution[round]}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

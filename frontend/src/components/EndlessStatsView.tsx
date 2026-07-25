import type { EndlessStats } from "@/types/shared";

type EndlessStatsViewProps = {
  stats: EndlessStats;
  currentStreak: number;
};

export default function EndlessStatsView({
  stats,
  currentStreak,
}: EndlessStatsViewProps) {
  return (
    <div className="flex flex-col gap-1 font-mono text-sm text-text/70">
      <p>
        Current streak: <span className="text-accent">{currentStreak}</span>
      </p>
      <p className="text-text/50 text-sm uppercase tracking-wide">
        Global stats
      </p>
      <p>
        Games played: <span className="text-accent">{stats.gamesPlayed}</span>
      </p>
      <p>
        Best streak: <span className="text-accent">{stats.maxStreak}</span>
      </p>
      <p>
        You're better than{" "}
        <span className="text-accent">{stats.percentile.toFixed(0)}%</span> of
        players
      </p>
    </div>
  );
}

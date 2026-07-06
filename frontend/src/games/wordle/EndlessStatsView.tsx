import type { EndlessStats } from "@/types/wordle";

type EndlessStatsViewProps = {
  stats: EndlessStats;
};

export default function EndlessStatsView({ stats }: EndlessStatsViewProps) {
  return (
    <div className="flex flex-col gap-1 font-mono text-sm text-text/70">
      <p>
        Total games played:{" "}
        <span className="text-accent">{stats.gamesPlayed}</span>
      </p>
      <p>
        Best streak: <span className="text-accent">{stats.maxStreak}</span>
      </p>
      <p>
        Total streak (all-time solves):{" "}
        <span className="text-accent">{stats.totalStreak}</span>
      </p>
    </div>
  );
}

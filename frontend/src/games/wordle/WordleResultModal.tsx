import Modal from "@/components/Modal";
import type { DailyStats, EndlessStats } from "@/types/wordle";
import { useEffect, useState } from "react";
import DefinitionButton from "./DefinitionButton";
import DailyStatsView from "./DailyStatsView";
import EndlessStatsView from "./EndlessStatsView";
const API_URL = import.meta.env.VITE_API_URL;

type WordleResultModalProps = {
  mode: string;
  difficulty: string;
  solved: boolean;
  hiddenWord: string;
  attempts?: number;
  streak?: number;
  onClose: () => void;
  onPlayAgain?: () => void;
};

export default function WordleResultModal({
  mode,
  difficulty,
  solved,
  hiddenWord,
  attempts,
  streak,
  onClose,
  onPlayAgain,
}: WordleResultModalProps) {
  const [stats, setStats] = useState<DailyStats | EndlessStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const streakParam = mode === "endless" ? `&streak=${streak}` : "";
      const response = await fetch(
        `${API_URL}/wordle/stats?difficulty=${difficulty}&mode=${mode}${streakParam}`,
      );
      const data = await response.json();

      setStats(data);
    };

    fetchStats();
  }, [mode, difficulty, streak]);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 items-center text-center">
        <h2 className="font-pixel text-accent text-lg">
          {solved ? "You won!" : "You lost"}
        </h2>
        <div className="flex gap-2 items-center">
          <p className="font-mono text-text/70">
            The word was{" "}
            <span className="text-accent font-bold">
              {hiddenWord.toUpperCase()}
            </span>
          </p>
          <DefinitionButton word={hiddenWord} font="font-mono" compact />
        </div>
        {stats && mode === "daily" && "attempts" in stats && (
          <DailyStatsView stats={stats} attempts={attempts} />
        )}

        {stats && mode === "endless" && "percentile" in stats && (
          <EndlessStatsView stats={stats} currentStreak={streak ?? 0} />
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-bg font-pixel text-sm cursor-pointer"
          >
            Close
          </button>
          {mode === "endless" && !solved && (
            <button
              onClick={onPlayAgain}
              className="px-4 py-2 bg-accent text-bg font-pixel text-sm cursor-pointer"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

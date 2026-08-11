import DailyStatsView from "@/components/DailyStatsView";
import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import DefinitionButton from "../../components/DefinitionButton";
import { MAX_MISTAKES } from "./constants";
import EndlessStatsView from "@/components/EndlessStatsView";
import type {
  DailyStats,
  Difficulty,
  EndlessStats,
  Mode,
} from "@/types/hangman";

const API_URL = import.meta.env.VITE_API_URL;

type HangmanResultModalProps = {
  mode: Mode;
  difficulty: Difficulty;
  solved: boolean;
  hiddenWord: string;
  mistakes?: number;
  streak?: number;
  onClose: () => void;
  onPlayAgain?: () => void;
};

export default function HangmanResultModal({
  mode,
  difficulty,
  solved,
  hiddenWord,
  mistakes,
  streak,
  onClose,
  onPlayAgain,
}: HangmanResultModalProps) {
  const [stats, setStats] = useState<DailyStats | EndlessStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const streakParam = mode === "endless" ? `&streak=${streak}` : "";
      const response = await fetch(
        `${API_URL}/hangman/stats?difficulty=${difficulty}&mode=${mode}${streakParam}`,
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
          <DefinitionButton
            word={hiddenWord}
            game={"hangman"}
            font="font-mono"
            compact
          />
        </div>
        {stats && mode === "daily" && "mistakes" in stats && (
          <DailyStatsView
            distribution={stats.mistakes}
            barCount={MAX_MISTAKES}
            highlightedBar={mistakes}
          />
        )}

        {stats && mode === "endless" && "percentile" in stats && (
          <EndlessStatsView stats={stats} currentStreak={streak ?? 0} />
        )}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-bg font-mono text-sm cursor-pointer"
          >
            Close
          </button>
          {mode === "endless" && !solved && (
            <button
              onClick={onPlayAgain}
              className="px-4 py-2 bg-accent text-bg font-mono text-sm cursor-pointer"
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

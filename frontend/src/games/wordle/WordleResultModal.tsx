import Modal from "@/components/Modal";
import type { DailyStats, EndlessStats } from "@/types/wordle";
import { useEffect, useState } from "react";
import { WORDLE_MAX_ATTEMPTS } from "./constants";
const API_URL = import.meta.env.VITE_API_URL;

type WordleResultModalProps = {
  mode: string;
  difficulty: string;
  solved: boolean;
  hiddenWord: string;
  attempts?: number;
  streak?: number;
  onClose: () => void;
};

export default function WordleResultModal({
  mode,
  difficulty,
  solved,
  hiddenWord,
  attempts,
  streak,
  onClose,
}: WordleResultModalProps) {
  const [stats, setStats] = useState<DailyStats | EndlessStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(
        `${API_URL}/wordle/stats?difficulty=${difficulty}&mode=${mode}`,
      );
      const data = await response.json();

      setStats(data);
    };

    fetchStats();
  }, [mode, difficulty]);

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 items-center text-center">
        <h2 className="font-pixel text-accent text-lg">
          {solved ? "You won!" : "You lost"}
        </h2>
        <p className="font-mono text-text/70">
          The word was{" "}
          <span className="text-accent font-bold">
            {hiddenWord.toUpperCase()}
          </span>
        </p>
        {mode === "daily" && solved && attempts && (
          <p className="text-text/70">Solved in {attempts}</p>
        )}
        {mode === "endless" && solved && attempts && (
          <p className="text-text/70">Streak: {streak}</p>
        )}
        {stats && mode === "daily" && "attempts" in stats && (
          <div className="w-64">
            {Array.from({ length: WORDLE_MAX_ATTEMPTS }, (_, i) => i).map(
              (attempt) => (
                <div className="flex flex-row gap-1">
                  <span>{attempt + 1}</span>
                  <span
                    className={`h-5 flex justify-end items-center px-1 min-w-4 ${attempt + 1 === attempts ? "bg-accent" : "bg-surface-card"}`}
                    style={{
                      width: `${(stats.attempts[attempt] / Math.max(...stats.attempts)) * 100}%`,
                    }}
                  >
                    <span
                      className={`text-xs ${attempt + 1 === attempts ? "text-bg" : "text-text"}`}
                    >
                      {stats.attempts[attempt]}
                    </span>
                  </span>
                </div>
              ),
            )}
          </div>
        )}

        {stats &&
          mode === "endless" &&
          "totalStreak" in stats &&
          // render endless stats
          null}
        <button
          onClick={onClose}
          className="px-4 py-2 bg-accent text-bg font-pixel text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

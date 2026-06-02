import { type Difficulty, type Game, type Mode } from "@/types/game";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameCard({ game }: { game: Game }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-sm px-4 py-3 border border-border border-x-4 border-x-accent hover:bg-surface-hover transition-colors ">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full text-left flex gap-1 justify-between"
      >
        <h2 className="font-pixel text-text">{game.name}</h2>
        <span className={expanded ? "rotate-90 inline-block" : "inline-block"}>
          ›
        </span>
      </button>
      {expanded && (
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex gap-2">
            <ul className="flex flex-col gap-1 flex-1">
              {game.difficulties.map((d) => (
                <li
                  key={d}
                  onClick={() =>
                    setSelectedDifficulty((prev) => (prev === d ? null : d))
                  }
                  className={`cursor-pointer px-4 py-2 rounded-sm transition-colors ${
                    selectedDifficulty === d
                      ? "bg-surface-card-selected text-bg"
                      : "bg-surface-card text-text hover:bg-accent hover:text-bg"
                  }`}
                >
                  {d}
                </li>
              ))}
            </ul>
            <div className="w-px bg-border"></div>
            <ul className="flex flex-col gap-1 flex-1">
              {game.modes.map((m) => (
                <li
                  key={m}
                  onClick={() =>
                    setSelectedMode((prev) => (prev === m ? null : m))
                  }
                  className={`cursor-pointer px-4 py-2 rounded-sm transition-colors ${
                    selectedMode === m
                      ? "bg-surface-card-selected text-bg"
                      : "bg-surface-card text-text hover:bg-accent hover:text-bg"
                  }`}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() =>
              navigate(`/${game.name}/${selectedDifficulty}/${selectedMode}`)
            }
            disabled={!selectedDifficulty || !selectedMode}
            className="w-full mt-2 px-4 py-2 bg-accent text-bg font-pixel disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Play
          </button>
        </div>
      )}
    </div>
  );
}

import type { Game } from "@/types/game";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameCard({ game }: { game: Game }) {
  const [expanded, setExpanded] = useState(false);
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
        <ul className="flex flex-col gap-1">
          {game.difficulties.map((d) => (
            <li
              key={d}
              onClick={() => navigate(`/${game.name}/${d}`)}
              className="cursor-pointer px-4 py-2 rounded-sm bg-surface-card text-text hover:bg-accent hover:text-bg transition-colors"
            >
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

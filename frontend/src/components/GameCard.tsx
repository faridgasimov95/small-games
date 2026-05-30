import type { Game } from "@/types/game";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GameCard({ game }: { game: Game }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex gap-1">
        <h2>{game.name}</h2>
        <button onClick={() => setExpanded((prev) => !prev)}>
          <span
            className={expanded ? "rotate-90 inline-block" : "inline-block"}
          >
            ›
          </span>
        </button>
      </div>
      {expanded && (
        <div>
          <ul>
            {game.difficulties.map((d) => (
              <li key={d} onClick={() => navigate(`/${game.name}/${d}`)}>
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

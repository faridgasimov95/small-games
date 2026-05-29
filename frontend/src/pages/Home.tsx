import DifficultyModal from "@/components/DifficultyModal";
import games from "@/games/gamesList";
import type { Difficulty, Game } from "@/types/game";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  function handleSelectGame(game: Game) {
    setSelectedGame(game);
    setModalIsOpen(true);
  }

  function handleSelectDifficulty(difficulty: Difficulty) {
    navigate(`/${selectedGame?.name}/${difficulty}`);
    setModalIsOpen(false);
  }

  return (
    <div>
      <DifficultyModal
        difficulties={selectedGame?.difficulties ?? []}
        setDifficulty={handleSelectDifficulty}
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      ></DifficultyModal>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <button onClick={() => handleSelectGame(game)}>{game.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

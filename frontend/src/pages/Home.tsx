import GameCard from "@/components/GameCard";
import games from "@/games/gamesList";

export default function HomePage() {
  return (
    <div>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </div>
  );
}

import GameCard from "@/components/GameCard";
import games from "@/games/gamesList";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen items-center max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-pixel text-text">Small Games</h1>
      <ul className="w-[20rem] flex flex-col gap-2 border-2 rounded-3xl px-4 py-4 mt-4">
        {games.map((game) => (
          <li key={game.id}>
            <GameCard game={game} />
          </li>
        ))}
      </ul>
    </main>
  );
}

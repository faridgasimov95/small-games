import { Link } from "react-router-dom";

type ComingSoonGame = {
  gameName: string;
};

export default function ComingSoonPage({ gameName }: ComingSoonGame) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-center">
      <h1 className="font-pixel text-accent text-xl">
        {gameName.toUpperCase()}
      </h1>
      <p className="font-mono text-text">Coming Soon</p>
      <Link to="/" className="px-4 py-2 bg-accent text-bg font-pixel text-sm">
        Go Back
      </Link>
    </div>
  );
}

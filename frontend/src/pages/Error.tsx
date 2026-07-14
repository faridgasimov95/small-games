import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-screen text-center">
      <h1 className="font-pixel text-accent text-xl">404</h1>
      <p className="font-mono text-text/70">This page doesn't exist</p>
      <Link to="/" className="px-4 py-2 bg-accent text-bg font-pixel text-sm">
        Back to Home
      </Link>
    </div>
  );
}

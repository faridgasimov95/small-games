import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import WordlePage from "./pages/Wordle";
import { wordleLoader } from "./games/wordle/useWordleGame";
import { useEffect } from "react";
import { cleanStaleDailyCache } from "./utils/storage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "wordle/:difficulty/:mode",
    element: <WordlePage />,
    loader: wordleLoader,
  },
  { path: "hangman/:difficulty/:mode", element: <div>Hangman</div> },
  { path: "finder/:difficulty/:mode", element: <div>Finder</div> },
]);

export default function App() {
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    cleanStaleDailyCache(today);
  }, []);

  return (
    <div className="bg-bg text-text">
      <RouterProvider router={router} />
    </div>
  );
}

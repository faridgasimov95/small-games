import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import WordlePage from "./pages/Wordle";
import { wordleLoader } from "./games/wordle/useWordleGame";
import { useEffect } from "react";
import { clearStaleDailyCache, clearDefinitionCache } from "./utils/storage";
import Layout from "./components/Layout";
import AllStatsPage from "./pages/AllStats";
import ErrorPage from "./pages/Error";
import ComingSoonPage from "./pages/ComingSoon";
import HangmanPage from "./pages/Hangman";
import { hangmanLoader } from "./games/hangman/useHangmanGame";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      { path: "/stats", element: <AllStatsPage /> },
      {
        path: "wordle/:difficulty/:mode",
        element: <WordlePage />,
        loader: wordleLoader,
      },
      {
        path: "hangman/:difficulty/:mode",
        element: <HangmanPage />,
        loader: hangmanLoader,
      },
      {
        path: "wordsmith/:difficulty/:mode",
        element: <ComingSoonPage gameName="wordsmith" />,
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

export default function App() {
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    clearStaleDailyCache(today);
    clearDefinitionCache();
  }, []);

  return (
    <div className="bg-bg text-text">
      <RouterProvider router={router} />
    </div>
  );
}

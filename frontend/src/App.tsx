import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import WordlePage from "./pages/Wordle";
import { wordleLoader } from "./games/wordle/useWordleGame";

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
  return (
    <div className="bg-bg text-text">
      <RouterProvider router={router} />
    </div>
  );
}

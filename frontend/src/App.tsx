import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";
import WordlePage, { wordleLoader } from "./pages/Wordle";

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
    <div className="min-h-screen bg-bg text-text">
      <RouterProvider router={router} />
    </div>
  );
}

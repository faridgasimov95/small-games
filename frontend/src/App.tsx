import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  { path: "wordle/:difficulty", element: <div>Wordle</div> },
  { path: "hangman/:difficulty", element: <div>Hangman</div> },
  { path: "finder/:difficulty", element: <div>Finder</div> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

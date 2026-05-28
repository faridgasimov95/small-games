import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function App() {
  const router = createBrowserRouter([{ path: "/", element: <div>Home</div> }]);

  return <RouterProvider router={router} />;
}

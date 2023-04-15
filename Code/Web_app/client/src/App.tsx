
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import "dayjs/locale/es";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export const App = () => (
  <RouterProvider router={router} />
);
